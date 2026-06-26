import { readFile, readdir } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import type { Question } from "../../src/types";
import type { AuditResult } from "./types";
import {
  auditNonMcqBias,
  type BiasBankInput,
  type BiasFixClass,
  type BiasRecord,
  type BiasReport,
} from "./non-mcq-bias-lib";

const CANONICAL_DIR = "banks";

const DISTRIBUTIONAL_CHECKS = new Set(["correct_count_distribution", "template_repetition"]);
const RATIONALE_CHECKS = new Set(["rationale_shuffle_hazard"]);

function isMechanicalRecord(record: BiasRecord): boolean {
  return !DISTRIBUTIONAL_CHECKS.has(record.check) && !RATIONALE_CHECKS.has(record.check);
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort();
}

function recordLabel(record: BiasRecord): string {
  const examples = record.example_item_ids.length > 0
    ? ` [${record.example_item_ids.join(", ")}]`
    : "";
  return `${record.bank} / ${record.item_type} / ${record.check} (n=${record.n_usable})${examples}`;
}

function failuresFor(records: BiasRecord[]): string[] {
  return uniqueSorted(records.flatMap((record) => record.example_item_ids));
}

function statusForNonFailingAxis(records: BiasRecord[]): "PASS" | "INSUFFICIENT" {
  return records.length > 0 && records.every((record) => record.verdict === "INSUFFICIENT")
    ? "INSUFFICIENT"
    : "PASS";
}

function assertNeverFixClass(fixClass: never): never {
  throw new Error(`Unhandled non-MCQ bias fix_class: ${String(fixClass)}`);
}

export async function defaultNonMcqBiasBankPaths(): Promise<string[]> {
  return (await readdir(CANONICAL_DIR))
    .filter((filename) => filename.endsWith(".json"))
    .sort()
    .map((filename) => join(CANONICAL_DIR, filename));
}

export async function loadNonMcqBiasBanks(paths: string[]): Promise<BiasBankInput[]> {
  const banks: BiasBankInput[] = [];
  for (const path of [...paths].sort()) {
    const text = await readFile(path, "utf8");
    const result = validateBankObject(parseBankText(text), { rejectUnknownKeys: true });
    if (!result.ok) {
      throw new Error(`${path} failed bank validation:\n${result.reasons.map((reason) => `  ${reason}`).join("\n")}`);
    }
    banks.push({
      id: basename(path, ".json"),
      questions: result.value.questions,
    });
  }
  return banks;
}

export function nonMcqBiasReportToAuditResults(report: BiasReport): AuditResult[] {
  const failRecords = report.records.filter((record) => record.verdict === "FAIL");
  const mechanicalFailures: BiasRecord[] = [];
  const distributionalFailures: BiasRecord[] = [];
  const manualFailures: BiasRecord[] = [];

  for (const record of failRecords) {
    const fixClass: BiasFixClass = record.fix_class;
    switch (fixClass) {
      case "SHUFFLE_AT_PROMOTION":
        mechanicalFailures.push(record);
        break;
      case "REGENERATE":
        distributionalFailures.push(record);
        break;
      case "RATIONALE_REPAIR":
        // Owned by audit:references, which calls the same checkQuestionReferences
        // path used by the bias lib's rationaleRecord.
        break;
      case "MANUAL_REVIEW":
        manualFailures.push(record);
        break;
      case "NONE":
        throw new Error(`Non-MCQ bias FAIL record has fix_class NONE: ${recordLabel(record)}`);
      default:
        assertNeverFixClass(fixClass);
    }
  }

  const mechanicalRecords = report.records.filter(isMechanicalRecord);
  const distributionalRecords = report.records.filter((record) => DISTRIBUTIONAL_CHECKS.has(record.check));
  const results: AuditResult[] = [];

  results.push({
    name: "audit:non-mcq-bias:mechanical",
    status: mechanicalFailures.length > 0 ? "FAIL" : statusForNonFailingAxis(mechanicalRecords),
    failures: failuresFor(mechanicalFailures),
    detail: mechanicalFailures.length > 0
      ? [
          `${mechanicalFailures.length} positional/mechanical non-MCQ bias finding(s).`,
          ...mechanicalFailures.map((record) => `  ${recordLabel(record)}`),
        ].join("\n")
      : "No positional/mechanical non-MCQ bias findings.",
  });

  results.push({
    name: "audit:non-mcq-bias:distributional",
    status: distributionalFailures.length > 0 ? "WARN" : statusForNonFailingAxis(distributionalRecords),
    failures: failuresFor(distributionalFailures),
    detail: distributionalFailures.length > 0
      ? [
          `${distributionalFailures.length} distributional non-MCQ bias finding(s); advisory only.`,
          ...distributionalFailures.map((record) => `  ${recordLabel(record)}`),
        ].join("\n")
      : "No distributional non-MCQ bias findings.",
  });

  if (manualFailures.length > 0) {
    results.push({
      name: "audit:non-mcq-bias:manual",
      status: "WARN",
      failures: failuresFor(manualFailures),
      detail: [
        `${manualFailures.length} manual-review non-MCQ bias finding(s) need human disposition.`,
        ...manualFailures.map((record) => `  ${recordLabel(record)}`),
      ].join("\n"),
    });
  }

  return results;
}

export function runAuditNonMcqBiasOnBanks(banks: BiasBankInput[]): AuditResult[] {
  return nonMcqBiasReportToAuditResults(auditNonMcqBias(banks));
}

export function runAuditNonMcqBiasOnQuestions(id: string, questions: Question[]): AuditResult[] {
  return runAuditNonMcqBiasOnBanks([{ id, questions }]);
}

export async function runAuditNonMcqBias(opts: { paths?: string[] } = {}): Promise<AuditResult[]> {
  const paths = (opts.paths && opts.paths.length > 0
    ? opts.paths
    : await defaultNonMcqBiasBankPaths()).map((path) => resolve(path));
  return runAuditNonMcqBiasOnBanks(await loadNonMcqBiasBanks(paths));
}
