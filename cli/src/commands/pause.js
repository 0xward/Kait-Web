const { requireConfig } = require("../config");
const { getClients } = require("../client");
const { GATEWAY_ABI } = require("../abi");

async function setActive(apiId, active) {
  const config = requireConfig();
  if (!config.gateway) {
    console.error("No gateway contract configured. Re-run `kait init --force`.");
    process.exit(1);
  }
  if (!apiId || isNaN(Number(apiId))) {
    console.error("Usage: kait pause <apiId>  /  kait resume <apiId>");
    process.exit(1);
  }

  const { publicClient, walletClient } = getClients(config);

  console.log(`${active ? "Resuming" : "Pausing"} API #${apiId} ...`);

  const hash = await walletClient.writeContract({
    address: config.gateway,
    abi: GATEWAY_ABI,
    functionName: "setActive",
    args: [BigInt(apiId), active],
  });

  console.log("Tx sent: " + hash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (receipt.status !== "success") {
    console.error("Transaction reverted. Check it on the block explorer.");
    process.exit(1);
  }

  console.log(`API #${apiId} is now ${active ? "active" : "paused"}.`);
}

module.exports = setActive;
