/**
 * npm run audit — aggregate gate. CI calls only this.
 *
 * Execution order:
 *   1. Tier 0: validate:bank — structural well-formedness. Short-circuits on FAIL.
 *   2. Tier 1: audit:references, audit:positions, audit:integrity — run in
 *      parallel, all failures collected into a single report. Exits non-zero
 *      if any Tier-1 check failed.
 *
 * Wiring all checks as a single process (not separate CI steps) ensures every
 * failure is visible in one run — no first-failure masking.
 */

import { runValidateBank } from "./audit/validate-bank";
import { runAuditReferences } from "./audit/audit-references";
import { runAuditPositions } from "./audit/audit-positions";
import { runAuditIntegrity } from "./audit/audit-integrity";
import type { AuditResult } from "./audit/types";

function printResult(r: AuditResult): void {
  const icon = r.status === "PASS" ? "✓" : r.status === "INSUFFICIENT" ? "?" : "✗";
  console.log(`\n[${r.status}] ${icon} ${r.name}`);
  if (r.status !== "PASS") {
    console.log(r.detail);
    if (r.failures.length > 0) {
      console.log(`Failing IDs: ${r.failures.join(", ")}`);
    }
  } else {
    console.log(r.detail);
  }
}

// ---------------------------------------------------------------------------
// Tier 0
// ---------------------------------------------------------------------------
console.log("=== Promotion Gate ===\n");
console.log("── Tier 0: structural validation ──");

const tier0 = await runValidateBank();
printResult(tier0);

if (tier0.status === "FAIL") {
  console.error("\nTier 0 failed — bank is structurally broken. Fix before running audits.\n");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Tier 1 — all three run, collect all failures
// ---------------------------------------------------------------------------
console.log("\n── Tier 1: standing audits ──");

const [references, positions, integrity] = await Promise.all([
  runAuditReferences(),
  runAuditPositions(),
  runAuditIntegrity(),
]);

const tier1Results: AuditResult[] = [references, positions, integrity];
for (const r of tier1Results) printResult(r);

// ---------------------------------------------------------------------------
// Final verdict
// ---------------------------------------------------------------------------
const anyFailed = tier1Results.some((r) => r.status === "FAIL");
const allInsufficient = tier1Results.every((r) => r.status !== "FAIL");

const allFailedIds = [...new Set(tier1Results.flatMap((r) => r.failures))];

console.log("\n══════════════════════");
if (anyFailed) {
  console.error(`GATE FAILED — ${allFailedIds.length} item(s) across ${tier1Results.filter((r) => r.status === "FAIL").length} check(s).`);
  if (allFailedIds.length > 0) {
    console.error(`Items requiring repair: ${allFailedIds.join(", ")}`);
  }
  process.exit(1);
} else if (allInsufficient) {
  console.log("GATE PASSED (some checks INSUFFICIENT — bank may be too small for full analysis).");
} else {
  console.log("GATE PASSED — bank is clean.");
}
