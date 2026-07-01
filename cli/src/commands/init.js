const readline = require("readline");
const { privateKeyToAccount } = require("viem/accounts");
const { saveConfig, loadConfig, DEFAULT_GATEWAY } = require("../config");

// Uses the readline async-iterator API rather than repeated .question()
// calls. With piped/non-TTY input, Node's readline can emit a 'line' event
// before the next .question() has registered its listener, silently
// dropping that answer. Consuming lines via the async iterator queues them
// correctly regardless of timing, so this works the same whether input is
// typed interactively or piped in (e.g. from a setup script).
function createPrompter() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
  const it = rl[Symbol.asyncIterator]();

  async function ask(question) {
    process.stdout.write(question);
    const { value, done } = await it.next();
    return done ? "" : (value || "").trim();
  }

  return { ask, close: () => rl.close() };
}

// Masked input for the private key. Only works on a real interactive TTY
// (raw mode isn't meaningful for piped input); falls back to the normal
// prompter otherwise.
function askHidden(question) {
  if (!process.stdin.isTTY) {
    const { ask, close } = createPrompter();
    return ask(question).then((value) => {
      close();
      return value;
    });
  }

  return new Promise((resolve) => {
    const stdin = process.stdin;
    process.stdout.write(question);
    let value = "";

    const onData = (char) => {
      char = char.toString();
      if (char === "\n" || char === "\r" || char === "\u0004") {
        stdin.setRawMode(false);
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(value.trim());
      } else if (char === "\u0003") {
        process.exit(1);
      } else if (char === "\u007f") {
        value = value.slice(0, -1);
      } else {
        value += char;
      }
    };

    stdin.setRawMode(true);
    stdin.resume();
    stdin.on("data", onData);
  });
}

async function init(options) {
  console.log("KAIT CLI setup\n");

  const existing = loadConfig();
  if (existing && !options.force) {
    console.log("A config already exists at ~/.kait/config.json.");
    console.log("Run `kait init --force` to overwrite it.\n");
    return;
  }

  // The private key needs its own raw-mode-capable stdin handling on a real
  // TTY, so it's asked first/separately; the rest share one prompter.
  const privateKey = await askHidden("Wallet private key (input hidden): ");

  if (!privateKey) {
    console.error("A private key is required.");
    process.exit(1);
  }

  const normalizedKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;

  let address;
  try {
    address = privateKeyToAccount(normalizedKey).address;
  } catch {
    console.error("That doesn't look like a valid private key.");
    process.exit(1);
  }

  const { ask, close } = createPrompter();

  const networkAnswer = await ask("Network (base / baseSepolia) [base]: ");
  const network = networkAnswer || "base";

  const gatewayDefault = DEFAULT_GATEWAY[network] || "";
  const gatewayInput = await ask(
    `KaitGateway contract address${gatewayDefault ? ` [${gatewayDefault}]` : " (required, see contracts/DEPLOY_GUIDE.md)"}: `
  );
  const gateway = gatewayInput || gatewayDefault;

  close();

  if (!gateway) {
    console.error("\nNo gateway address set. You can still finish setup and add it later by re-running `kait init --force`.");
  }

  saveConfig({
    network,
    privateKey: normalizedKey,
    gateway,
    rpcUrl: "",
  });

  console.log("\nSaved to ~/.kait/config.json");
  console.log("Wallet address: " + address);
  console.log("\nYou're ready. Try `kait deploy` to register your first API.");
}

module.exports = init;
