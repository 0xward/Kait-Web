import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors/injected";
import { coinbaseWallet } from "wagmi/connectors/coinbaseWallet";
import { walletConnect } from "wagmi/connectors/walletConnect";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// WalletConnect needs a free Project ID from https://cloud.reown.com — only
// added if one is configured, so the app still works with MetaMask /
// Coinbase Wallet out of the box without requiring that signup step first.
const connectors = [
  injected(),
  coinbaseWallet({ appName: "KAIT" }),
  ...(walletConnectProjectId ? [walletConnect({ projectId: walletConnectProjectId })] : []),
];

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

export const SUPPORTED_CHAIN_IDS = [base.id, baseSepolia.id];
