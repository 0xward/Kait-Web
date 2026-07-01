const { formatUnits } = require("viem");
const { requireConfig, USDC } = require("../config");
const { getClients } = require("../client");
const { GATEWAY_ABI, NATIVE_TOKEN } = require("../abi");

function parseMetadata(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.name === "string") return parsed;
  } catch {
    // not JSON, fall through
  }
  return { name: raw || "UNNAMED_API" };
}

async function list() {
  const config = requireConfig();
  if (!config.gateway) {
    console.error("No gateway contract configured. Re-run `kait init --force`.");
    process.exit(1);
  }

  const { account, publicClient } = getClients(config);
  const usdcAddress = USDC[config.network || "base"];

  const total = await publicClient.readContract({
    address: config.gateway,
    abi: GATEWAY_ABI,
    functionName: "totalAPIs",
  });

  if (total === 0n) {
    console.log("No APIs registered on this gateway yet.");
    return;
  }

  const ids = Array.from({ length: Number(total) }, (_, i) => BigInt(i + 1));
  const listings = await Promise.all(
    ids.map((id) =>
      publicClient.readContract({
        address: config.gateway,
        abi: GATEWAY_ABI,
        functionName: "getAPI",
        args: [id],
      })
    )
  );

  const mine = listings
    .map((listing, i) => ({ id: ids[i], ...listing }))
    .filter((l) => l.owner.toLowerCase() === account.address.toLowerCase());

  if (mine.length === 0) {
    console.log("You haven't registered any APIs on this gateway yet.");
    console.log("Run `kait deploy` to register your first one.");
    return;
  }

  console.log(`\nYour APIs (${mine.length}):\n`);

  for (const api of mine) {
    const meta = parseMetadata(api.metadataURI);
    const isEth = api.paymentToken.toLowerCase() === NATIVE_TOKEN.toLowerCase();
    const decimals = isEth ? 18 : 6;
    const symbol = isEth ? "ETH" : "USDC";

    console.log(`#${api.id.toString()}  ${meta.name}`);
    if (meta.endpoint) console.log(`   endpoint: ${meta.endpoint}`);
    console.log(`   status:   ${api.active ? "active" : "paused"}`);
    console.log(`   price:    ${formatUnits(api.pricePerCall, decimals)} ${symbol} / call`);
    console.log(`   calls:    ${api.totalCalls.toString()}`);
    console.log(`   volume:   ${formatUnits(api.totalVolume, decimals)} ${symbol}`);
    console.log("");
  }
}

module.exports = list;
