#!/usr/bin/env node

const { Command } = require("commander");
const pkg = require("../package.json");

const init = require("../src/commands/init");
const deploy = require("../src/commands/deploy");
const list = require("../src/commands/list");
const withdraw = require("../src/commands/withdraw");
const setActive = require("../src/commands/pause");
const status = require("../src/commands/status");

const program = new Command();

program
  .name("kait")
  .description("Deploy and manage pay-per-call APIs on KAIT (Base).")
  .version(pkg.version);

program
  .command("init")
  .description("Set up your KAIT CLI config (wallet + network + gateway contract).")
  .option("--force", "overwrite an existing config")
  .action(init);

program
  .command("deploy")
  .description("Register a new API for monetization on-chain.")
  .option("-n, --name <name>", "API name")
  .option("-e, --endpoint <url>", "API endpoint URL")
  .option("-t, --token <usdc|eth>", "payment token")
  .option("-p, --price <amount>", "price per call")
  .action(deploy);

program
  .command("list")
  .description("List your registered APIs and their stats.")
  .action(list);

program
  .command("withdraw")
  .description("Withdraw your accumulated earnings.")
  .option("-t, --token <usdc|eth>", "which token to withdraw", "usdc")
  .action(withdraw);

program
  .command("pause <apiId>")
  .description("Pause an API so it stops accepting payments.")
  .action((apiId) => setActive(apiId, false));

program
  .command("resume <apiId>")
  .description("Resume a paused API.")
  .action((apiId) => setActive(apiId, true));

program
  .command("status")
  .description("Show your wallet, network, and gateway config.")
  .action(status);

program.parseAsync(process.argv).catch((err) => {
  console.error("\nError: " + (err.shortMessage || err.message || err));
  process.exit(1);
});
