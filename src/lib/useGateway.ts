"use client";
import { useAccount } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { GATEWAY_ADDRESSES, USDC_ADDRESSES } from "./contracts";

export function useGateway() {
  const { chainId } = useAccount();
  const chain = chainId === baseSepolia.id ? baseSepolia : base;

  const gatewayAddress = GATEWAY_ADDRESSES[chain.id] || undefined;
  const usdcAddress = USDC_ADDRESSES[chain.id];
  const isDeployed = Boolean(gatewayAddress);

  return { chainId: chain.id, chain, gatewayAddress, usdcAddress, isDeployed };
}
