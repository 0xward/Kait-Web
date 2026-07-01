const fs = require("fs");
const path = require("path");
const os = require("os");

const CONFIG_DIR = path.join(os.homedir(), ".kait");
const CONFIG_PATH = path.join(CONFIG_DIR, "config.json");

// Kept in sync by hand with contracts/KaitGateway.sol deployments. Update
// these once you deploy your own instance, or override via `kait init`.
const DEFAULT_GATEWAY = {
  base: "",
  baseSepolia: "",
};

const USDC = {
  base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  baseSepolia: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
};

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  } catch {
    return null;
  }
}

function saveConfig(config) {
  if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), { mode: 0o600 });
}

function requireConfig() {
  const config = loadConfig();
  if (!config || !config.privateKey) {
    console.error("No KAIT config found. Run `kait init` first.");
    process.exit(1);
  }
  return config;
}

module.exports = { CONFIG_PATH, DEFAULT_GATEWAY, USDC, loadConfig, saveConfig, requireConfig };
