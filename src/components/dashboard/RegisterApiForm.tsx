"use client";
import { useState } from "react";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { GATEWAY_ABI, NATIVE_TOKEN } from "../../lib/contracts";
import { useGateway } from "../../lib/useGateway";
import { encodeMetadata, parseTokenAmount } from "../../lib/format";
import { IconArrowUpRight } from "../icons";

export default function RegisterApiForm() {
  const { address } = useAccount();
  const { gatewayAddress, usdcAddress, isDeployed, chain } = useGateway();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [name, setName] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [token, setToken] = useState<"ETH" | "USDC">("USDC");
  const [price, setPrice] = useState("0.001");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!gatewayAddress || !address || !name.trim()) return;

    const decimals = token === "USDC" ? 6 : 18;
    const priceWei = parseTokenAmount(price, decimals);
    const paymentToken = token === "USDC" ? usdcAddress : NATIVE_TOKEN;
    const metadataURI = encodeMetadata({ name: name.trim(), endpoint: endpoint.trim() || undefined });

    writeContract({
      address: gatewayAddress as `0x${string}`,
      abi: GATEWAY_ABI,
      functionName: "registerAPI",
      args: [paymentToken, priceWei, metadataURI],
      account: address,
      chain,
    });
  }

  return (
    <div className="bg-ink text-white p-6 md:p-8">
      <p className="font-mono text-xs tracking-widest2 text-white/40 mb-5">/01&nbsp;&nbsp;REGISTER NEW API</p>

      {!isDeployed && (
        <p className="font-mono text-xs text-white/50 mb-5 leading-relaxed">
          No contract configured for this network yet — this form will be live once
          KaitGateway is deployed. See contracts/DEPLOY_GUIDE.md.
        </p>
      )}

      {isSuccess ? (
        <div className="py-6">
          <p className="font-display font-bold text-lg text-lime mb-2">API Registered</p>
          <p className="font-mono text-xs text-white/60 mb-4">
            Your API is now live on KaitGateway. It may take a moment to appear below.
          </p>
          <button
            onClick={() => {
              reset();
              setName("");
              setEndpoint("");
              setPrice("0.001");
            }}
            className="font-mono text-[11px] tracking-widest2 uppercase text-lime hover:text-white transition-colors"
          >
            Register another →
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] tracking-widest2 uppercase text-white/50 mb-1.5">
              API Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. VISION_OCR"
              className="w-full bg-white/5 border border-white/15 px-3 py-2.5 font-mono text-sm placeholder:text-white/30 focus:outline-none focus:border-purple"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-widest2 uppercase text-white/50 mb-1.5">
              Endpoint URL (optional, public)
            </label>
            <input
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="https://api.yourservice.com/v1/run"
              className="w-full bg-white/5 border border-white/15 px-3 py-2.5 font-mono text-sm placeholder:text-white/30 focus:outline-none focus:border-purple"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] tracking-widest2 uppercase text-white/50 mb-1.5">
                Payment Token
              </label>
              <select
                value={token}
                onChange={(e) => setToken(e.target.value as "ETH" | "USDC")}
                className="w-full bg-white/5 border border-white/15 px-3 py-2.5 font-mono text-sm focus:outline-none focus:border-purple"
              >
                <option value="USDC" className="bg-ink">USDC</option>
                <option value="ETH" className="bg-ink">ETH</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[10px] tracking-widest2 uppercase text-white/50 mb-1.5">
                Price / Call
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                inputMode="decimal"
                placeholder="0.001"
                className="w-full bg-white/5 border border-white/15 px-3 py-2.5 font-mono text-sm placeholder:text-white/30 focus:outline-none focus:border-purple"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isDeployed || isPending || isConfirming}
            className="w-full inline-flex items-center justify-center gap-2 bg-lime text-ink font-mono font-semibold text-xs tracking-widest2 uppercase px-5 py-3 hover:bg-white transition-colors disabled:opacity-30 disabled:hover:bg-lime"
          >
            {isPending ? "CONFIRM IN WALLET…" : isConfirming ? "DEPLOYING…" : "REGISTER ON-CHAIN"}
            <IconArrowUpRight className="w-3 h-3" />
          </button>

          {error && (
            <p className="font-mono text-[11px] text-purple leading-relaxed">
              {error.message.split("\n")[0].slice(0, 140)}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
