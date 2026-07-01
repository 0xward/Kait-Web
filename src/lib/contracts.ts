import { base, baseSepolia } from "wagmi/chains";

// Verified against Circle's official docs (developers.circle.com/stablecoins)
// and BaseScan — native USDC, not the deprecated bridged USDbC.
export const USDC_ADDRESSES: Record<number, `0x${string}`> = {
  [base.id]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  [baseSepolia.id]: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
};

export const NATIVE_TOKEN = "0x0000000000000000000000000000000000000000" as const;

// Set after you deploy contracts/KaitGateway.sol — see CONTRACTS_README.md.
// Empty string = "not deployed yet", every component below degrades gracefully.
export const GATEWAY_ADDRESSES: Record<number, `0x${string}` | ""> = {
  [base.id]: (process.env.NEXT_PUBLIC_GATEWAY_BASE as `0x${string}`) || "",
  [baseSepolia.id]: (process.env.NEXT_PUBLIC_GATEWAY_BASE_SEPOLIA as `0x${string}`) || "",
};

// This ABI is generated directly from compiling contracts/KaitGateway.sol
// (see contracts/scripts/compile.js) -- kept in sync by hand here since the
// frontend and contracts live in separate package.json's. If you ever
// modify KaitGateway.sol, regenerate this from build/KaitGateway.json.
export const GATEWAY_ABI = [
  {
    type: "function",
    name: "registerAPI",
    stateMutability: "nonpayable",
    inputs: [
      { name: "paymentToken", type: "address" },
      { name: "pricePerCall", type: "uint256" },
      { name: "metadataURI", type: "string" },
    ],
    outputs: [{ name: "apiId", type: "uint256" }],
  },
  {
    type: "function",
    name: "updatePrice",
    stateMutability: "nonpayable",
    inputs: [
      { name: "apiId", type: "uint256" },
      { name: "newPrice", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setActive",
    stateMutability: "nonpayable",
    inputs: [
      { name: "apiId", type: "uint256" },
      { name: "active", type: "bool" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [{ name: "token", type: "address" }],
    outputs: [],
  },
  {
    type: "function",
    name: "payForCall",
    stateMutability: "payable",
    inputs: [{ name: "apiId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "payForCallERC20",
    stateMutability: "nonpayable",
    inputs: [{ name: "apiId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "totalAPIs",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "getAPI",
    stateMutability: "view",
    inputs: [{ name: "apiId", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "owner", type: "address" },
          { name: "paymentToken", type: "address" },
          { name: "pricePerCall", type: "uint256" },
          { name: "metadataURI", type: "string" },
          { name: "active", type: "bool" },
          { name: "totalCalls", type: "uint256" },
          { name: "totalVolume", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "earningsOf",
    stateMutability: "view",
    inputs: [
      { name: "token", type: "address" },
      { name: "user", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "NATIVE_TOKEN",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    type: "event",
    name: "APIRegistered",
    inputs: [
      { name: "apiId", type: "uint256", indexed: true },
      { name: "owner", type: "address", indexed: true },
      { name: "paymentToken", type: "address", indexed: false },
      { name: "pricePerCall", type: "uint256", indexed: false },
      { name: "metadataURI", type: "string", indexed: false },
    ],
  },
  {
    type: "event",
    name: "APIPriceUpdated",
    inputs: [
      { name: "apiId", type: "uint256", indexed: true },
      { name: "newPrice", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "APIStatusChanged",
    inputs: [
      { name: "apiId", type: "uint256", indexed: true },
      { name: "active", type: "bool", indexed: false },
    ],
  },
  {
    type: "event",
    name: "APICalled",
    inputs: [
      { name: "apiId", type: "uint256", indexed: true },
      { name: "payer", type: "address", indexed: true },
      { name: "paymentToken", type: "address", indexed: false },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Withdrawn",
    inputs: [
      { name: "token", type: "address", indexed: true },
      { name: "user", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const;

export const ERC20_ABI = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
] as const;
