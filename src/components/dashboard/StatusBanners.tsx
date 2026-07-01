"use client";
import { useAccount } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import ConnectWalletButton from "../ConnectWalletButton";
import { useGateway } from "../../lib/useGateway";

export function WalletGate({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="bg-surface px-6 md:px-10 py-16 md:py-24 text-center">
        <p className="font-mono text-xs tracking-widest2 text-muted mb-4">DASHBOARD</p>
        <h2 className="font-display font-extrabold uppercase text-2xl md:text-3xl mb-4">
          Connect Your Wallet
        </h2>
        <p className="text-muted text-sm max-w-sm mx-auto mb-8">
          Connect a wallet on Base to view your APIs, earnings, and register
          new endpoints.
        </p>
        <div className="flex justify-center">
          <ConnectWalletButton />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function DeploymentBanner() {
  const { isDeployed, chainId } = useGateway();
  if (isDeployed) return null;

  const networkName = chainId === baseSepolia.id ? "Base Sepolia" : "Base Mainnet";

  return (
    <div className="bg-purple text-white px-5 md:px-10 py-4 md:py-5">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
        <p className="font-mono text-xs md:text-sm">
          <span className="text-lime">●</span> No KaitGateway contract is configured for {networkName} yet.
          Showing UI in preview mode.
        </p>
        <p className="font-mono text-[10px] tracking-widest2 uppercase text-white/60">
          See contracts/DEPLOY_GUIDE.md
        </p>
      </div>
    </div>
  );
}
