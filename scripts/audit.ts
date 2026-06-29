/**
 * npm run audit — aggregate gate. CI calls only this.
 *
 * Execution order:
 *   1. Tier 0: validate:bank — structural well-formedness. Short-circuits on FAIL.
 *   2. Tier 1: blocking standing audits — run in parallel, all failures
 *      collected into a single report. Exits non-zero if any Tier-1 check
 *      failed.
 *   3. Tier 2: advisory audits — report warnings without blocking the gate.
 *
 * Wiring all checks as a single process (not separate CI steps) ensures every
 * failure is visible in one run — no first-failure masking.
 */

import { runValidateBank } from "./audit/validate-bank";
import { runAuditReferences } from "./audit/audit-references";
import { runAuditPositions } from "./audit/audit-positions";
import { runAuditIntegrity } from "./audit/audit-integrity";
import { runAuditIds } from "./audit/audit-ids";
import { runAuditNonMcqBias } from "./audit/audit-non-mcq-bias";
import { runAuditStageRefs } from "./audit/audit-stage-refs";
import { gateVerdict, isMechanicalBiasEnforced } from "./audit/audit-verdict";
import type { AuditResult } from "./audit/types";

function printResult(r: AuditResult): void {
  const icon = r.status === "PASS" ? "✓" : r.status === "INSUFFICIENT" ? "?" : r.status === "WARN" ? "!" : "✗";
  console.log(`\n[${r.status}] ${icon} ${r.name}`);
  if (r.status !== "PASS") {
    console.log(r.detail);
    if (r.failures.length > 0) {
      const label = r.status === "WARN" ? "Related IDs" : "Failing IDs";
      console.log(`${label}: ${r.failures.join(", ")}`);
    }
  } else {
    console.log(r.detail);
  }
}

async function main(): Promise<number> {
  // ---------------------------------------------------------------------------
  // Tier 0
  // ---------------------------------------------------------------------------
  console.log("=== Promotion Gate ===\n");
  console.log("── Tier 0: structural validation ──");

  const tier0 = await runValidateBank();
  printResult(tier0);

  if (tier0.status === "FAIL") {
    console.error("\nTier 0 failed — bank is structurally broken. Fix before running audits.\n");
    return 1;
  }

  // ---------------------------------------------------------------------------
  // Tier 1 — run all standing checks, collect all failures
  // ---------------------------------------------------------------------------
  console.log("\n── Tier 1: standing audits ──");

  const [references, positions, integrity, ids, stageRefs, nonMcqBias] = await Promise.all([
    runAuditReferences(),
    runAuditPositions(),
    runAuditIntegrity(),
    runAuditIds(),
    runAuditStageRefs(),
    runAuditNonMcqBias(),
  ]);

  const tier1Results: AuditResult[] = [references, positions, integrity, ids];
  for (const r of tier1Results) printResult(r);

  // ---------------------------------------------------------------------------
  // Tier 2 — advisory metadata and distribution checks
  // ---------------------------------------------------------------------------
  console.log("\n── Tier 2: advisory audits ──");
  printResult(stageRefs);
  for (const r of nonMcqBias) printResult(r);

  // ---------------------------------------------------------------------------
  // Final verdict
  // ---------------------------------------------------------------------------
  const mechanicalBias = nonMcqBias.find((result) => result.name === "audit:non-mcq-bias:mechanical");
  const blockingResults = isMechanicalBiasEnforced() && mechanicalBias
    ? [...tier1Results, mechanicalBias]
    : tier1Results;
  const allResults = [...tier1Results, stageRefs, ...nonMcqBias];
  const verdict = gateVerdict(allResults, blockingResults);

  console.log("\n══════════════════════");
  if (verdict.exitCode === 1) {
    console.error(verdict.message);
    if (verdict.failedIds.length > 0) {
      console.error(`Items requiring repair: ${verdict.failedIds.join(", ")}`);
    }
  } else {
    console.log(verdict.message);
  }
  return verdict.exitCode;
}

process.exit(await main());
