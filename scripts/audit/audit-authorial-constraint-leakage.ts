import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  scanBundledAuthorialConstraints,
  scanSelectedAuthorialConstraints,
} from "../../lib/authorial-constraint-leakage";
import type { AuditResult } from "./types";

export type RunAuditAuthorialConstraintLeakageOptions = {
  /** Audit exactly these file paths instead of sweeping the default directory.
   *  Fails loud: a missing, unreadable, unparseable, or schema-invalid selected
   *  file is never silently skipped. */
  files?: string[];
};

export async function runAuditAuthorialConstraintLeakage(
  options: RunAuditAuthorialConstraintLeakageOptions = {},
): Promise<AuditResult> {
  if (options.files !== undefined && options.files.length === 0) {
    return {
      name: "audit:authorial-constraint-leakage",
      status: "FAIL",
      failures: [],
      detail: "Explicit file selection is empty.",
    };
  }
  const explicit = options.files !== undefined;
  let scan;
  try {
    scan = explicit
      ? await scanSelectedAuthorialConstraints(options.files!)
      : await scanBundledAuthorialConstraints();
  } catch (error) {
    if (!explicit) throw error;
    return {
      name: "audit:authorial-constraint-leakage",
      status: "FAIL",
      failures: options.files!,
      detail: `Explicitly selected file load failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
  const blocking = scan.candidates.filter((row) => row.blockingEligible);
  if (blocking.length === 0) return {
    name: "audit:authorial-constraint-leakage",
    status: "PASS",
    failures: [],
    detail: explicit
      ? `No blocking authorial-constraint leakage found across ${scan.topLevelQuestionsScanned} top-level questions / ${scan.scoredLeavesScanned} scored leaves in the explicitly selected files; ${scan.candidates.length} advisory candidate(s) remain review-only.`
      : `No blocking authorial-constraint leakage found across ${scan.topLevelQuestionsScanned} top-level questions / ${scan.scoredLeavesScanned} scored leaves; ${scan.candidates.length} advisory candidate(s) remain review-only.`,
  };
  return {
    name: "audit:authorial-constraint-leakage",
    status: "FAIL",
    failures: [...new Set(blocking.map((row) => row.embeddedQuestionId ?? row.topLevelQuestionId))].sort(),
    detail: blocking.map((row) => `${row.bankPath} ${row.topLevelQuestionId}${row.embeddedQuestionId ? `/${row.embeddedQuestionId}` : ""} ${row.jsonPath}: ${JSON.stringify(row.sentenceText)} [${row.signatureId}; ${row.promptSourcePath ?? "unattributed"}]`).join("\n"),
  };
}

function parseCliArgs(argv: string[]): RunAuditAuthorialConstraintLeakageOptions {
  const files: string[] = [];
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] !== "--file") throw new Error(`Unknown argument: ${argv[index]}`);
    const value = argv[index + 1];
    if (value === undefined) throw new Error("--file requires a path argument");
    if (value.trim() === "") throw new Error("--file requires a non-empty path argument");
    files.push(value);
    index += 1;
  }
  return { files: files.length > 0 ? files : undefined };
}

async function runCli(): Promise<void> {
  let options: RunAuditAuthorialConstraintLeakageOptions;
  try {
    options = parseCliArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
  const result = await runAuditAuthorialConstraintLeakage(options);
  console.log(`[${result.status}] ${result.name}`);
  console.log(result.detail);
  process.exit(result.status === "FAIL" ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await runCli();
}
