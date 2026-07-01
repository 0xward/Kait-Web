// Deploys the compiled KaitGateway contract to Base mainnet using viem.
// Reads your private key from a local .env file (never paste it anywhere
// else, never commit .env to git -- it's already in .gitignore).
//
// Run from inside the contracts/ folder, after scripts/compile.js:
//   node scripts/deploy.js

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const {
  createWalletClient,
  createPublicClient,
  http,
  formatEther,
} = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const { base } = require("viem/chains");

const BUILD_PATH = path.join(__dirname, "..", "build", "KaitGateway.json");

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => { rl.close(); resolve(answer); }));
}

async function main() {
  if (!fs.existsSync(BUILD_PATH)) {
    console.error("build/KaitGateway.json not found. Run `node scripts/compile.js` first.");
    process.exit(1);
  }

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("PRIVATE_KEY missing. Copy .env.example to .env and fill it in.");
    process.exit(1);
  }
  const normalizedKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;

  const rpcUrl = process.env.BASE_RPC_URL || "https://mainnet.base.org";

  const { abi, bytecode } = JSON.parse(fs.readFileSync(BUILD_PATH, "utf8"));
  const account = privateKeyToAccount(normalizedKey);

  const publicClient = createPublicClient({ chain: base, transport: http(rpcUrl) });
  const walletClient = createWalletClient({ account, chain: base, transport: http(rpcUrl) });

  console.log("Network:        Base Mainnet (chainId 8453)");
  console.log("RPC:            " + rpcUrl);
  console.log("Deployer:       " + account.address);

  const balance = await publicClient.getBalance({ address: account.address });
  console.log("Wallet balance: " + formatEther(balance) + " ETH");

  const gasPrice = await publicClient.getGasPrice();
  const estimatedGas = await publicClient.estimateGas({
    account: account.address,
    data: bytecode,
  });
  const estimatedCost = gasPrice * estimatedGas;

  console.log("Estimated gas:  " + estimatedGas.toString() + " units");
  console.log("Estimated cost: ~" + formatEther(estimatedCost) + " ETH (at current gas price)");

  if (balance < estimatedCost) {
    console.error("\nInsufficient balance to cover estimated deployment cost. Fund your wallet and try again.");
    process.exit(1);
  }

  const answer = await ask("\nThis will deploy to BASE MAINNET and spend real ETH. Type 'deploy' to continue: ");
  if (answer.trim().toLowerCase() !== "deploy") {
    console.log("Aborted. Nothing was sent.");
    process.exit(0);
  }

  console.log("\nSending deployment transaction...");
  const hash = await walletClient.deployContract({ abi, bytecode });
  console.log("Tx hash: " + hash);
  console.log("Waiting for confirmation...");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (receipt.status !== "success") {
    console.error("Deployment transaction reverted. Check the tx on BaseScan.");
    process.exit(1);
  }

  console.log("\nDeployed successfully.");
  console.log("Contract address: " + receipt.contractAddress);
  console.log("Block:            " + receipt.blockNumber);
  console.log("\nNext step: put this in your frontend .env.local as:");
  console.log("NEXT_PUBLIC_GATEWAY_BASE=" + receipt.contractAddress);
  console.log("\nView on BaseScan:");
  console.log("https://basescan.org/address/" + receipt.contractAddress);
}

main().catch((err) => {
  console.error("\nDeployment failed:");
  console.error(err.shortMessage || err.message || err);
  process.exit(1);
});
