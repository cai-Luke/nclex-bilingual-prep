import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { scanBundledAuthorialConstraints } from "../../lib/authorial-constraint-leakage";
import type { AuditResult } from "./types";

export async function runAuditAuthorialConstraintLeakage(): Promise<AuditResult> {
  const scan = await scanBundledAuthorialConstraints();
  const blocking = scan.candidates.filter((row) => row.blockingEligible);
  if (blocking.length === 0) return {
    name: "audit:authorial-constraint-leakage",
    status: "PASS",
    failures: [],
    detail: `No blocking authorial-constraint leakage found across ${scan.topLevelQuestionsScanned} top-level questions / ${scan.scoredLeavesScanned} scored leaves; ${scan.candidates.length} advisory candidate(s) remain review-only.`,
  };
  return {
    name: "audit:authorial-constraint-leakage",
    status: "FAIL",
    failures: [...new Set(blocking.map((row) => row.embeddedQuestionId ?? row.topLevelQuestionId))].sort(),
    detail: blocking.map((row) => `${row.bankPath} ${row.topLevelQuestionId}${row.embeddedQuestionId ? `/${row.embeddedQuestionId}` : ""} ${row.jsonPath}: ${JSON.stringify(row.sentenceText)} [${row.signatureId}; ${row.promptSourcePath ?? "unattributed"}]`).join("\n"),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = await runAuditAuthorialConstraintLeakage();
  console.log(`[${result.status}] ${result.name}`);
  console.log(result.detail);
  process.exit(result.status === "FAIL" ? 1 : 0);
}
