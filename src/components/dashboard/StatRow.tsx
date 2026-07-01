"use client";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { GATEWAY_ABI, USDC_ADDRESSES, NATIVE_TOKEN } from "../../lib/contracts";
import { useGateway } from "../../lib/useGateway";
import { formatTokenAmount } from "../../lib/format";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-surface p-5 md:p-6">
      <p className="font-mono text-[10px] tracking-widest2 uppercase text-muted mb-3">{label}</p>
      <p className="font-display font-extrabold text-2xl md:text-3xl leading-none">{value}</p>
      {sub && <p className="font-mono text-[10px] text-muted mt-2">{sub}</p>}
    </div>
  );
}

export default function StatRow() {
  const { address } = useAccount();
  const { gatewayAddress, usdcAddress, isDeployed, chainId } = useGateway();

  const { data: totalApis } = useReadContract({
    address: gatewayAddress as `0x${string}` | undefined,
    abi: GATEWAY_ABI,
    functionName: "totalAPIs",
    chainId,
    query: { enabled: isDeployed },
  });

  const { data: earnings } = useReadContracts({
    contracts: [
      {
        address: gatewayAddress as `0x${string}` | undefined,
        abi: GATEWAY_ABI,
        functionName: "earningsOf",
        args: [NATIVE_TOKEN, address ?? NATIVE_TOKEN],
        chainId,
      },
      {
        address: gatewayAddress as `0x${string}` | undefined,
        abi: GATEWAY_ABI,
        functionName: "earningsOf",
        args: [usdcAddress, address ?? NATIVE_TOKEN],
        chainId,
      },
    ],
    query: { enabled: isDeployed && Boolean(address) },
  });

  const ethEarnings = earnings?.[0]?.result as bigint | undefined;
  const usdcEarnings = earnings?.[1]?.result as bigint | undefined;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px md:gap-4">
      <StatCard
        label="Total APIs (network)"
        value={isDeployed ? (totalApis !== undefined ? totalApis.toString() : "…") : "—"}
        sub={isDeployed ? "Registered on-chain" : "Contract not deployed"}
      />
      <StatCard
        label="Your Earnings (ETH)"
        value={isDeployed && ethEarnings !== undefined ? formatTokenAmount(ethEarnings, 18, 5) : "—"}
        sub="Withdrawable"
      />
      <StatCard
        label="Your Earnings (USDC)"
        value={isDeployed && usdcEarnings !== undefined ? formatTokenAmount(usdcEarnings, 6, 2) : "—"}
        sub="Withdrawable"
      />
      <StatCard label="Network" value={chainId === 8453 ? "Base" : "Base Sepolia"} sub={`Chain ID ${chainId}`} />
    </div>
  );
}
