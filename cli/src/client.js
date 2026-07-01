const { createPublicClient, createWalletClient, http } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const { base, baseSepolia } = require("viem/chains");

function chainFromName(name) {
  return name === "baseSepolia" ? baseSepolia : base;
}

function getClients(config) {
  const chain = chainFromName(config.network || "base");
  const rpcUrl = config.rpcUrl || undefined;
  const normalizedKey = config.privateKey.startsWith("0x") ? config.privateKey : `0x${config.privateKey}`;
  const account = privateKeyToAccount(normalizedKey);

  const publicClient = createPublicClient({ chain, transport: http(rpcUrl) });
  const walletClient = createWalletClient({ account, chain, transport: http(rpcUrl) });

  return { chain, account, publicClient, walletClient };
}

module.exports = { getClients, chainFromName };
