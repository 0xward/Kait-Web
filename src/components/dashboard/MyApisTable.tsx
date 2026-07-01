"use client";
import { useMemo, useState } from "react";
import { useAccount, useReadContract, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { GATEWAY_ABI, NATIVE_TOKEN } from "../../lib/contracts";
import { useGateway } from "../../lib/useGateway";
import { decimalsForToken, formatTokenAmount, parseMetadata } from "../../lib/format";

interface ApiRow {
  id: bigint;
  owner: `0x${string}`;
  paymentToken: `0x${string}`;
  pricePerCall: bigint;
  metadataURI: string;
  active: boolean;
  totalCalls: bigint;
  totalVolume: bigint;
}

function ToggleActiveButton({ apiId, active }: { apiId: bigint; active: boolean }) {
  const { address } = useAccount();
  const { gatewayAddress, chain } = useGateway();
  const { writeContract, isPending } = useWriteContract();

  function handleToggle() {
    if (!gatewayAddress || !address) return;
    writeContract({
      address: gatewayAddress as `0x${string}`,
      abi: GATEWAY_ABI,
      functionName: "setActive",
      args: [apiId, !active],
      account: address,
      chain,
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`font-mono text-[10px] tracking-widest2 uppercase px-3 py-1.5 transition-colors disabled:opacity-40 ${
        active ? "bg-lime text-ink hover:bg-ink hover:text-white" : "bg-bg text-muted hover:bg-ink hover:text-white"
      }`}
    >
      {isPending ? "…" : active ? "ACTIVE" : "PAUSED"}
    </button>
  );
}

export default function MyApisTable({ usdcAddress }: { usdcAddress: `0x${string}` }) {
  const { address } = useAccount();
  const { gatewayAddress, isDeployed, chainId } = useGateway();

  const { data: totalApis } = useReadContract({
    address: gatewayAddress as `0x${string}` | undefined,
    abi: GATEWAY_ABI,
    functionName: "totalAPIs",
    chainId,
    query: { enabled: isDeployed },
  });

  const ids = useMemo(() => {
    if (!totalApis) return [];
    const n = Number(totalApis);
    return Array.from({ length: n }, (_, i) => BigInt(i + 1));
  }, [totalApis]);

  const { data: results } = useReadContracts({
    contracts: ids.map((id) => ({
      address: gatewayAddress as `0x${string}` | undefined,
      abi: GATEWAY_ABI,
      functionName: "getAPI" as const,
      args: [id] as const,
      chainId,
    })),
    query: { enabled: isDeployed && ids.length > 0 },
  });

  const myApis: ApiRow[] = useMemo(() => {
    if (!results || !address) return [];
    return results
      .map((r, i) => {
        if (r.status !== "success") return null;
        const listing = r.result as {
          owner: `0x${string}`;
          paymentToken: `0x${string}`;
          pricePerCall: bigint;
          metadataURI: string;
          active: boolean;
          totalCalls: bigint;
          totalVolume: bigint;
        };
        if (listing.owner.toLowerCase() !== address.toLowerCase()) return null;
        return { id: ids[i], ...listing };
      })
      .filter((r): r is ApiRow => r !== null);
  }, [results, address, ids]);

  if (!isDeployed) {
    return (
      <div className="bg-surface p-6 md:p-8">
        <p className="font-mono text-xs tracking-widest2 text-muted">/03&nbsp;&nbsp;YOUR APIS</p>
        <p className="font-mono text-xs text-muted mt-4">Connect a deployed contract to see your APIs here.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface p-6 md:p-8">
      <p className="font-mono text-xs tracking-widest2 text-muted mb-5">
        /03&nbsp;&nbsp;YOUR APIS {myApis.length > 0 && `(${myApis.length})`}
      </p>

      {myApis.length === 0 ? (
        <p className="font-mono text-xs text-muted">
          You haven&apos;t registered any APIs yet. Use the form to register your first one.
        </p>
      ) : (
        <div className="space-y-4">
          {myApis.map((api) => {
            const meta = parseMetadata(api.metadataURI);
            const decimals = decimalsForToken(api.paymentToken, usdcAddress);
            const tokenLabel = api.paymentToken === NATIVE_TOKEN ? "ETH" : "USDC";
            return (
              <div key={api.id.toString()} className="b-line-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono font-semibold text-sm uppercase">{meta.name}</p>
                    {meta.endpoint && (
                      <p className="font-mono text-[10px] text-muted mt-1 truncate max-w-xs">{meta.endpoint}</p>
                    )}
                  </div>
                  <ToggleActiveButton apiId={api.id} active={api.active} />
                </div>
                <div className="flex gap-6 mt-3 font-mono text-[10px] tracking-widest2 uppercase text-muted">
                  <span>
                    PRICE <span className="text-ink">{formatTokenAmount(api.pricePerCall, decimals, 4)} {tokenLabel}</span>
                  </span>
                  <span>
                    CALLS <span className="text-ink">{api.totalCalls.toString()}</span>
                  </span>
                  <span>
                    VOLUME{" "}
                    <span className="text-ink">
                      {formatTokenAmount(api.totalVolume, decimals, 4)} {tokenLabel}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
