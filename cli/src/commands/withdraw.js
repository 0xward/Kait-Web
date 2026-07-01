const { formatUnits } = require("viem");
const { requireConfig, USDC } = require("../config");
const { getClients } = require("../client");
const { GATEWAY_ABI, NATIVE_TOKEN } = require("../abi");

async function withdraw(options) {
  const config = requireConfig();
  if (!config.gateway) {
    console.error("No gateway contract configured. Re-run `kait init --force`.");
    process.exit(1);
  }

  const tokenChoice = (options.token || "usdc").toLowerCase();
  const usdcAddress = USDC[config.network || "base"];
  const token = tokenChoice === "eth" ? NATIVE_TOKEN : usdcAddress;
  const decimals = tokenChoice === "eth" ? 18 : 6;
  const symbol = tokenChoice === "eth" ? "ETH" : "USDC";

  const { account, publicClient, walletClient } = getClients(config);

  const balance = await publicClient.readContract({
    address: config.gateway,
    abi: GATEWAY_ABI,
    functionName: "earningsOf",
    args: [token, account.address],
  });

  if (balance === 0n) {
    console.log(`Nothing to withdraw in ${symbol}.`);
    return;
  }

  console.log(`Withdrawing ${formatUnits(balance, decimals)} ${symbol} ...`);

  const hash = await walletClient.writeContract({
    address: config.gateway,
    abi: GATEWAY_ABI,
    functionName: "withdraw",
    args: [token],
  });

  console.log("Tx sent: " + hash);
  console.log("Waiting for confirmation...");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (receipt.status !== "success") {
    console.error("Transaction reverted. Check it on the block explorer.");
    process.exit(1);
  }

  console.log("Withdrawn successfully. Funds sent to " + account.address);
}

module.exports = withdraw;
