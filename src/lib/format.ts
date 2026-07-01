export function truncateAddress(addr: string, chars = 4) {
  return `${addr.slice(0, 2 + chars)}…${addr.slice(-chars)}`;
}

/** USDC on Base uses 6 decimals. ETH uses 18. */
export function decimalsForToken(tokenAddress: string, usdcAddress: string) {
  return tokenAddress.toLowerCase() === usdcAddress.toLowerCase() ? 6 : 18;
}

export function formatTokenAmount(raw: bigint, decimals: number, maxFractionDigits = 4) {
  const divisor = 10n ** BigInt(decimals);
  const whole = raw / divisor;
  const fraction = raw % divisor;
  if (fraction === 0n) return whole.toString();
  const fractionStr = fraction.toString().padStart(decimals, "0").slice(0, maxFractionDigits);
  const trimmed = fractionStr.replace(/0+$/, "");
  return trimmed ? `${whole}.${trimmed}` : whole.toString();
}

export function parseTokenAmount(value: string, decimals: number): bigint {
  if (!value || isNaN(Number(value))) return 0n;
  const [whole, fraction = ""] = value.split(".");
  const paddedFraction = (fraction + "0".repeat(decimals)).slice(0, decimals);
  const wholeDigits = whole.replace(/[^0-9]/g, "") || "0";
  return BigInt(wholeDigits + paddedFraction || "0");
}

/**
 * KAIT stores API metadata directly on-chain as a compact JSON string in
 * metadataURI (no IPFS pinning service wired up yet, so no external API
 * key dependency for v1). Falls back gracefully if it's not valid JSON
 * (e.g. someone registered via a raw contract call with a plain string).
 */
export interface ApiMetadata {
  name: string;
  endpoint?: string;
  tag?: string;
}

export function parseMetadata(raw: string): ApiMetadata {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.name === "string") {
      return { name: parsed.name, endpoint: parsed.endpoint, tag: parsed.tag };
    }
  } catch {
    // not JSON — fall through
  }
  return { name: raw || "UNNAMED_API" };
}

export function encodeMetadata(meta: ApiMetadata): string {
  return JSON.stringify(meta);
}
