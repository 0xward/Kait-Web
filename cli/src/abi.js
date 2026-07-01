// Kept in sync by hand with contracts/KaitGateway.sol -- see that file's
// comment header for the full design rationale. If the contract changes,
// regenerate this from contracts/build/KaitGateway.json.
const GATEWAY_ABI = [
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
];

const ERC20_ABI = [
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
];

const NATIVE_TOKEN = "0x0000000000000000000000000000000000000000";

module.exports = { GATEWAY_ABI, ERC20_ABI, NATIVE_TOKEN };
