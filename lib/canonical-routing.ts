export const CANONICAL_PREFIXES: Array<[prefix: string, canonical: string]> = [
  // model-origin lanes
  ["gemini-", "gemini-canonical.json"],
  ["gpt-", "gpt-canonical.json"],
  ["claude-", "claude-canonical.json"],
  ["hard-cases-", "hard-cases-canonical.json"],
  // visual-kind lanes (complete sets, not generation targets)
  ["burn-", "burn-canonical.json"],
  ["capnography-", "capnography-canonical.json"],
  ["device-", "device-canonical.json"],
  ["io-", "io-canonical.json"],
  ["lab-", "lab-canonical.json"],
  ["mar-", "mar-canonical.json"],
  ["medlabel-", "medlabel-canonical.json"],
  ["vitals-", "vitals-canonical.json"],
  ["visual-", "visual-canonical.json"],
];

export const routeCanonical = (filename: string): string | null =>
  CANONICAL_PREFIXES.find(([prefix]) => filename.startsWith(prefix))?.[1] ?? null;
