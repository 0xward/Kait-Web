"use client";
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { GATEWAY_ABI, ERC20_ABI, NATIVE_TOKEN } from "../../lib/contracts";
import { useGateway } from "../../lib/useGateway";
import { formatTokenAmount } from "../../lib/format";
import { IconArrowUpRight } from "../icons";

type Step = "idle" | "approving" | "approve-confirming" | "paying" | "pay-confirming" | "done";

export default function PayAndCallButton({
  apiId,
  paymentToken,
  price,
  decimals,
  tokenLabel,
}: {
  apiId: bigint;
  paymentToken: `0x${string}`;
  price: bigint;
  decimals: number;
  tokenLabel: string;
}) {
  const { address } = useAccount();
  const { gatewayAddress, chain } = useGateway();
  const isNative = paymentToken.toLowerCase() === NATIVE_TOKEN.toLowerCase();

  const [step, setStep] = useState<Step>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { writeContract, data: hash, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: isNative ? undefined : paymentToken,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address && gatewayAddress ? [address, gatewayAddress as `0x${string}`] : undefined,
    query: { enabled: !isNative && Boolean(address) && Boolean(gatewayAddress) },
  });

  const needsApproval = !isNative && (allowance === undefined || (allowance as bigint) < price);

  // advance the state machine as each tx confirms
  useEffect(() => {
    if (!isConfirmed) return;
    if (step === "approve-confirming") {
      refetchAllowance();
      setStep("idle"); // fall through to the pay step, triggered by the user tapping again
    } else if (step === "pay-confirming") {
      setStep("done");
    }
  }, [isConfirmed, step, refetchAllowance]);

  useEffect(() => {
    if (isConfirming && step === "approving") setStep("approve-confirming");
    if (isConfirming && step === "paying") setStep("pay-confirming");
  }, [isConfirming, step]);

  function handleApprove() {
    if (!gatewayAddress || !address) return;
    setErrorMsg(null);
    setStep("approving");
    writeContract(
      {
        address: paymentToken,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [gatewayAddress as `0x${string}`, price],
        account: address,
        chain,
      },
      { onError: (e) => { setErrorMsg(e.message.split("\n")[0].slice(0, 100)); setStep("idle"); } }
    );
  }

  function handlePay() {
    if (!gatewayAddress || !address) return;
    setErrorMsg(null);
    setStep("paying");
    reset();

    if (isNative) {
      writeContract(
        {
          address: gatewayAddress as `0x${string}`,
          abi: GATEWAY_ABI,
          functionName: "payForCall",
          args: [apiId],
          value: price,
          account: address,
          chain,
        },
        { onError: (e) => { setErrorMsg(e.message.split("\n")[0].slice(0, 100)); setStep("idle"); } }
      );
    } else {
      writeContract(
        {
          address: gatewayAddress as `0x${string}`,
          abi: GATEWAY_ABI,
          functionName: "payForCallERC20",
          args: [apiId],
          account: address,
          chain,
        },
        { onError: (e) => { setErrorMsg(e.message.split("\n")[0].slice(0, 100)); setStep("idle"); } }
      );
    }
  }

  if (step === "done") {
    return (
      <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest2 uppercase text-lime">
        <span className="w-1.5 h-1.5 rounded-full bg-lime" /> PAID — TX CONFIRMED
      </div>
    );
  }

  const isBusy = step === "approving" || step === "approve-confirming" || step === "paying" || step === "pay-confirming";

  return (
    <div>
      <div className="flex items-center gap-2">
        {needsApproval && (
          <button
            onClick={handleApprove}
            disabled={isBusy || !address}
            className="inline-flex items-center gap-1.5 bg-bg text-ink font-mono font-semibold text-[10px] tracking-widest2 uppercase px-3 py-2 hover:bg-ink hover:text-white transition-colors disabled:opacity-40"
          >
            {step === "approving" || step === "approve-confirming" ? "APPROVING…" : "1. APPROVE"}
          </button>
        )}
        <button
          onClick={handlePay}
          disabled={isBusy || !address || needsApproval}
          className="inline-flex items-center gap-1.5 bg-lime text-ink font-mono font-semibold text-[10px] tracking-widest2 uppercase px-3 py-2 hover:bg-ink hover:text-white transition-colors disabled:opacity-40"
        >
          {step === "paying" || step === "pay-confirming"
            ? "PAYING…"
            : `${needsApproval ? "2. " : ""}PAY ${formatTokenAmount(price, decimals, 4)} ${tokenLabel}`}
          <IconArrowUpRight className="w-3 h-3" />
        </button>
      </div>
      {errorMsg && <p className="font-mono text-[10px] text-purple mt-1.5 max-w-[220px]">{errorMsg}</p>}
      {!address && <p className="font-mono text-[10px] text-muted mt-1.5">Connect a wallet to pay.</p>}
    </div>
  );
}
