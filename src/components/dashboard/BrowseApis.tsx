"use client";
import { useMemo } from "react";
import { useReadContract, useReadContracts } from "wagmi";
import { GATEWAY_ABI, NATIVE_TOKEN } from "../../lib/contracts";
import { useGateway } from "../../lib/useGateway";
import { decimalsForToken, parseMetadata, truncateAddress } from "../../lib/format";
import PayAndCallButton from "./PayAndCallButton";

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

export default function BrowseApis({ usdcAddress }: { usdcAddress: `0x${string}` }) {
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
    return Array.from({ length: Number(totalApis) }, (_, i) => BigInt(i + 1));
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

  const apis: ApiRow[] = useMemo(() => {
    if (!results) return [];
    return results
      .map((r, i) => {
        if (r.status !== "success") return null;
        const listing = r.result as Omit<ApiRow, "id">;
        if (!listing.active) return null;
        return { id: ids[i], ...listing };
      })
      .filter((r): r is ApiRow => r !== null);
  }, [results, ids]);

  if (!isDeployed) {
    return (
      <div className="bg-surface p-6 md:p-8">
        <p className="font-mono text-xs tracking-widest2 text-muted">/04&nbsp;&nbsp;BROWSE APIS</p>
        <p className="font-mono text-xs text-muted mt-4">
          No contract deployed for this network yet — nothing to browse or pay for.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface p-6 md:p-8">
      <p className="font-mono text-xs tracking-widest2 text-muted mb-1">
        /04&nbsp;&nbsp;BROWSE APIS {apis.length > 0 && `(${apis.length} ACTIVE)`}
      </p>
      <p className="font-mono text-[10px] text-muted mb-5">
        Every API registered on this gateway. Pay once to call it — real on-chain transaction.
      </p>

      {apis.length === 0 ? (
        <p className="font-mono text-xs text-muted">No active APIs registered on this gateway yet.</p>
      ) : (
        <div className="space-y-5">
          {apis.map((api) => {
            const meta = parseMetadata(api.metadataURI);
            const decimals = decimalsForToken(api.paymentToken, usdcAddress);
            const isEth = api.paymentToken.toLowerCase() === NATIVE_TOKEN.toLowerCase();
            const tokenLabel = isEth ? "ETH" : "USDC";

            return (
              <div key={api.id.toString()} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 b-line-b pb-5 last:border-b-0 last:pb-0">
                <div>
                  <p className="font-mono font-semibold text-sm uppercase">{meta.name}</p>
                  <p className="font-mono text-[10px] text-muted mt-1">
                    #{api.id.toString()} · by {truncateAddress(api.owner)}
                    {meta.endpoint && <> · {meta.endpoint}</>}
                  </p>
                </div>
                <PayAndCallButton
                  apiId={api.id}
                  paymentToken={api.paymentToken}
                  price={api.pricePerCall}
                  decimals={decimals}
                  tokenLabel={tokenLabel}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
