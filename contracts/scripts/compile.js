// Compiles KaitGateway.sol with solc (pure JS/WASM, no native toolchain
// needed — works fine in Termux) and writes the ABI + bytecode to
// build/KaitGateway.json so deploy.js can use them.
//
// Run from inside the contracts/ folder:
//   node scripts/compile.js

const fs = require("fs");
const path = require("path");
const solc = require("solc");

const CONTRACT_PATH = path.join(__dirname, "..", "KaitGateway.sol");
const BUILD_DIR = path.join(__dirname, "..", "build");
const OUT_PATH = path.join(BUILD_DIR, "KaitGateway.json");

function main() {
  const source = fs.readFileSync(CONTRACT_PATH, "utf8");

  const input = {
    language: "Solidity",
    sources: {
      "KaitGateway.sol": { content: source },
    },
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        "*": { "*": ["abi", "evm.bytecode.object"] },
      },
    },
  };

  console.log("Compiling KaitGateway.sol ...");
  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  let hasError = false;
  if (output.errors) {
    for (const err of output.errors) {
      const tag = err.severity === "error" ? "ERROR" : "warning";
      console.log(`[${tag}] ${err.formattedMessage}`);
      if (err.severity === "error") hasError = true;
    }
  }

  if (hasError) {
    console.error("\nCompilation failed. Fix the errors above and re-run.");
    process.exit(1);
  }

  const contract = output.contracts["KaitGateway.sol"]["KaitGateway"];
  const abi = contract.abi;
  const bytecode = "0x" + contract.evm.bytecode.object;

  if (!fs.existsSync(BUILD_DIR)) fs.mkdirSync(BUILD_DIR, { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify({ abi, bytecode }, null, 2));

  console.log("Compiled successfully.");
  console.log(`ABI entries: ${abi.length}`);
  console.log(`Bytecode size: ${(bytecode.length - 2) / 2} bytes`);
  console.log(`Output written to: ${OUT_PATH}`);
}

main();
