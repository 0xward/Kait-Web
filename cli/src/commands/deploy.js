const readline = require("readline");
const { parseUnits } = require("viem");
const { requireConfig, USDC } = require("../config");
const { getClients } = require("../client");
const { GATEWAY_ABI, NATIVE_TOKEN } = require("../abi");

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (a) => { rl.close(); resolve(a.trim()); }));
}

async function deploy(options) {
  const config = requireConfig();
  if (!config.gateway) {
    console.error("No gateway contract configured. Re-run `kait init --force` and set one, or set it in ~/.kait/config.json.");
    process.exit(1);
  }

  const name = options.name || (await ask("API name: "));
  const endpoint = options.endpoint || (await ask("Endpoint URL (optional, press enter to skip): "));
  const tokenChoice = (options.token || (await ask("Payment token, usdc or eth [usdc]: ")) || "usdc").toLowerCase();
  const priceInput = options.price || (await ask("Price per call (e.g. 0.001): "));

  if (!name) {
    console.error("API name is required.");
    process.exit(1);
  }
  if (!priceInput || isNaN(Number(priceInput))) {
    console.error("A valid price is required.");
    process.exit(1);
  }

  const { chain, account, publicClient, walletClient } = getClients(config);
  const usdcAddress = USDC[config.network || "base"];

  const paymentToken = tokenChoice === "eth" ? NATIVE_TOKEN : usdcAddress;
  const decimals = tokenChoice === "eth" ? 18 : 6;
  const priceWei = parseUnits(priceInput, decimals);
  const metadataURI = JSON.stringify({ name, endpoint: endpoint || undefined });

  console.log("\nRegistering API on " + chain.name + " ...");
  console.log("  Name:      " + name);
  console.log("  Token:     " + tokenChoice.toUpperCase());
  console.log("  Price:     " + priceInput + " " + tokenChoice.toUpperCase() + " per call");
  console.log("  Deployer:  " + account.address);

  const hash = await walletClient.writeContract({
    address: config.gateway,
    abi: GATEWAY_ABI,
    functionName: "registerAPI",
    args: [paymentToken, priceWei, metadataURI],
  });

  console.log("\nTx sent: " + hash);
  console.log("Waiting for confirmation...");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (receipt.status !== "success") {
    console.error("Transaction reverted. Check it on the block explorer.");
    process.exit(1);
  }

  console.log("\nAPI registered successfully.");
  console.log("Block: " + receipt.blockNumber);
  console.log("\nRun `kait list` to see all your registered APIs.");
}

module.exports = deploy;
