import * as fs from "node:fs";
import * as path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { replaceText, runPatch, type JsonPath } from "../patch-raw";
import type { DispositionRow, OccurrenceRow } from "../audit/wbc-platelet-prose-unit-remediation";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const auditDir = path.join(repoRoot, "audit/wbc-platelet-prose-unit-inventory-2026-07-19");
const dispositionPath = path.join(auditDir, "codex-dispositions.jsonl");
const manifestPath = path.join(auditDir, "codex-corrected-manifest.jsonl");
const scriptPath = path.relative(repoRoot, fileURLToPath(import.meta.url));
const requiredReason = "normalize learner-facing WBC and platelet prose to the ratified conventional display policy";

const readJsonLines = <T>(filePath: string): T[] => fs.readFileSync(filePath, "utf8").trim().split(/\n/u).filter(Boolean).map((line) => JSON.parse(line) as T);
const dispositions = readJsonLines<DispositionRow>(dispositionPath);
const manifest = readJsonLines<OccurrenceRow>(manifestPath);
const changed = dispositions.filter((row) => row.after !== null);

const duplicateKeys = changed.map((row) => `${row.bankPath}|${row.jsonPath}`).filter((key, index, keys) => keys.indexOf(key) !== index);
if (duplicateKeys.length) throw new Error(`Duplicate changed path dispositions: ${JSON.stringify(duplicateKeys)}`);
if (changed.some((row) => row.disposition === "BLOCKED_CONTEXT")) throw new Error("Blocked disposition entered patch plan");

const inArgIndex = process.argv.indexOf("--in");
if (inArgIndex !== -1) {
  const input = process.argv[inArgIndex + 1];
  if (!input) throw new Error("--in requires a bank path");
  const bankPath = path.relative(repoRoot, path.resolve(input)).replaceAll(path.sep, "/");
  const rows = changed.filter((row) => row.bankPath === bankPath);
  if (!rows.length) throw new Error(`No approved dispositions for ${bankPath}`);
  runPatch(rows.map((row) => replaceText({
    id: row.topLevelQuestionId,
    path: row.patchPath as JsonPath,
    before: row.before,
    after: row.after!,
    note: "Normalize scoped WBC/platelet units only; clinical values, relationships, answer logic, and surrounding prose are preserved.",
  })));
} else {
  const has = (flag: string): boolean => process.argv.includes(flag);
  const value = (flag: string): string | undefined => {
    const index = process.argv.indexOf(flag);
    return index === -1 ? undefined : process.argv[index + 1];
  };
  if (!has("--allow-canonical") || value("--reason") !== requiredReason) {
    throw new Error(`Wrapper requires --allow-canonical --reason ${JSON.stringify(requiredReason)}`);
  }

  const resolve = (question: unknown, segments: JsonPath): unknown => {
    let current = question;
    for (const segment of segments) {
      if (typeof segment === "string") current = (current as Record<string, unknown>)[segment];
      else if (typeof segment === "number") current = (current as unknown[])[segment];
      else {
        const matches = (current as unknown[]).filter((item) => item && typeof item === "object" && (item as { id?: unknown }).id === segment.id);
        if (matches.length !== 1) throw new Error(`Selector ${segment.id} matched ${matches.length} records`);
        current = matches[0];
      }
    }
    return current;
  };

  const stateByBank = new Map<string, "before" | "after">();
  for (const bankPath of [...new Set(changed.map((row) => row.bankPath))].sort()) {
    const bank = JSON.parse(fs.readFileSync(path.join(repoRoot, bankPath), "utf8")) as { questions: Array<{ id: string }> };
    const rows = changed.filter((row) => row.bankPath === bankPath);
    const states = rows.map((row) => {
      const questions = bank.questions.filter((question) => question.id === row.topLevelQuestionId);
      if (questions.length !== 1) throw new Error(`${row.topLevelQuestionId} matched ${questions.length} top-level questions in ${bankPath}`);
      const current = resolve(questions[0], row.patchPath as JsonPath);
      if (current === row.before) return "before" as const;
      if (current === row.after) return "after" as const;
      throw new Error(`Stale precondition at ${bankPath} ${row.jsonPath}`);
    });
    if (new Set(states).size !== 1) throw new Error(`Partially applied patch state in ${bankPath}`);
    stateByBank.set(bankPath, states[0]);
  }

  const writes = [...stateByBank.values()].filter((state) => state === "before").length;
  const changedKeys = new Set(changed.map((row) => `${row.bankPath}|${row.jsonPath}`));
  const changedOccurrences = manifest.filter((row) => changedKeys.has(`${row.bankPath}|${row.jsonPath}`) &&
    (row.disposition === "NORMALIZE_EXPLICIT" || row.disposition === "NORMALIZE_TOKEN_ONLY"));
  const byAnalyteAndForm = Object.fromEntries([...new Set(changedOccurrences.map((row) => `${row.analyte}|${row.formClass}`))].sort().map((key) =>
    [key, changedOccurrences.filter((row) => `${row.analyte}|${row.formClass}` === key).length]));
  const changedSet = new Set(changed.map((row) => `${row.bankPath}|${row.jsonPath}`));
  const unpairedSameFact = changed.filter((row) => row.pairedMutationRequired && row.counterpartJsonPath &&
    !changedSet.has(`${row.bankPath}|${row.counterpartJsonPath}`));
  if (unpairedSameFact.length) throw new Error(`Unpaired same-fact bilingual changes: ${JSON.stringify(unpairedSameFact.map((row) => row.jsonPath))}`);

  console.log(JSON.stringify({
    affectedBanks: [...stateByBank.keys()],
    changedPaths: changed.length,
    changedEn: changed.filter((row) => row.language === "en").length,
    changedZh: changed.filter((row) => row.language === "zh").length,
    changedOccurrences: changedOccurrences.length,
    changedOccurrencesByAnalyteAndForm: byAnalyteAndForm,
    blockedRowsIncluded: 0,
    unpairedSameFactBilingualChanges: 0,
    bankWritesRequired: writes,
  }, null, 2));

  if (!has("--dry-run") && writes > 0) {
    for (const [bankPath, state] of stateByBank) {
      if (state === "after") continue;
      execFileSync("npx", ["tsx", scriptPath, "--in", bankPath, "--out", bankPath, "--allow-canonical", "--reason", requiredReason], {
        cwd: repoRoot,
        stdio: "inherit",
      });
    }
  }
}
