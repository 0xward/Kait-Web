"use client";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { GATEWAY_ABI, NATIVE_TOKEN } from "../../lib/contracts";
import { useGateway } from "../../lib/useGateway";
import { formatTokenAmount } from "../../lib/format";
import { IconArrowUpRight } from "../icons";

function WithdrawRow({ token, decimals, label }: { token: `0x${string}`; decimals: number; label: string }) {
  const { address } = useAccount();
  const { gatewayAddress, isDeployed, chainId, chain } = useGateway();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const { data: amount, refetch } = useReadContract({
    address: gatewayAddress as `0x${string}` | undefined,
    abi: GATEWAY_ABI,
    functionName: "earningsOf",
    args: [token, address ?? NATIVE_TOKEN],
    chainId,
    query: { enabled: isDeployed && Boolean(address) },
  });

  const hasFunds = typeof amount === "bigint" && amount > 0n;

  function handleWithdraw() {
    if (!gatewayAddress || !address) return;
    writeContract({
      address: gatewayAddress as `0x${string}`,
      abi: GATEWAY_ABI,
      functionName: "withdraw",
      args: [token],
      account: address,
      chain,
    });
  }

  if (isSuccess) {
    // refresh the balance shortly after confirmation
    refetch();
  }

  return (
    <div className="flex items-center justify-between py-4 b-line-b last:border-b-0">
      <div>
        <p className="font-mono text-[10px] tracking-widest2 uppercase text-muted">{label}</p>
        <p className="font-display font-bold text-xl mt-1">
          {isDeployed && amount !== undefined ? formatTokenAmount(amount, decimals, decimals === 6 ? 2 : 5) : "—"}
        </p>
      </div>
      <button
        onClick={handleWithdraw}
        disabled={!isDeployed || !hasFunds || isPending || isConfirming}
        className="inline-flex items-center gap-2 bg-ink text-white font-mono font-semibold text-[11px] tracking-widest2 uppercase px-4 py-2.5 hover:bg-purple transition-colors disabled:opacity-30 disabled:hover:bg-ink"
      >
        {isPending || isConfirming ? "PROCESSING…" : "WITHDRAW"} <IconArrowUpRight className="w-3 h-3" />
      </button>
      {error && (
        <p className="text-[10px] font-mono text-purple absolute mt-12">
          {error.message.split("\n")[0].slice(0, 80)}
        </p>
      )}
    </div>
  );
}

export default function WithdrawPanel({ usdcAddress }: { usdcAddress: `0x${string}` }) {
  return (
    <div className="bg-surface p-6 md:p-8">
      <p className="font-mono text-xs tracking-widest2 text-muted mb-5">/02&nbsp;&nbsp;WITHDRAW</p>
      <WithdrawRow token={NATIVE_TOKEN} decimals={18} label="ETH BALANCE" />
      <WithdrawRow token={usdcAddress} decimals={6} label="USDC BALANCE" />
    </div>
  );
}
