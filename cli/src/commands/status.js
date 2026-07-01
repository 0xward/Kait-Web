const { formatEther } = require("viem");
const { requireConfig } = require("../config");
const { getClients } = require("../client");

async function status() {
  const config = requireConfig();
  const { chain, account, publicClient } = getClients(config);

  const balance = await publicClient.getBalance({ address: account.address });

  console.log("KAIT CLI status\n");
  console.log("Network:    " + chain.name);
  console.log("Wallet:     " + account.address);
  console.log("ETH balance:" + " " + formatEther(balance) + " ETH");
  console.log("Gateway:    " + (config.gateway || "(not set — run `kait init --force`)"));
}

module.exports = status;
