/**
 * Tier 0 — structural well-formedness check.
 *
 * Validates every JSON file in the promoted banks/ directory. A failure here
 * short-circuits the aggregate before any Tier-1 audit runs.
 *
 * Can be run standalone:  tsx scripts/audit/validate-bank.ts
 */

import { readFile, readdir } from "node:fs/promises";
import { join, basename } from "node:path";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import type { AuditResult } from "./types";
import { findNoncanonicalTopics, formatTopicValidationIssues } from "../../lib/topic-validation";

const PROMOTED_DIR = "banks";

export async function runValidateBank(): Promise<AuditResult> {
  const files = await readdir(PROMOTED_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json")).sort();

  const failures: string[] = [];
  const lines: string[] = [];

  for (const filename of jsonFiles) {
    const path = join(PROMOTED_DIR, filename);
    try {
      const text = await readFile(path, "utf8");
      const raw = parseBankText(text);
      const result = validateBankObject(raw);
      if (!result.ok) {
        const stem = basename(filename, ".json");
        failures.push(stem);
        lines.push(`${filename}:`);
        result.reasons.forEach((r) => lines.push(`  ${r}`));
        continue;
      }
      const topicIssues = findNoncanonicalTopics(raw);
      if (topicIssues.length > 0) {
        const stem = basename(filename, ".json");
        failures.push(stem);
        lines.push(`${filename}:`);
        formatTopicValidationIssues(topicIssues).forEach((r) => lines.push(`  ${r}`));
      }
    } catch (e) {
      const stem = basename(filename, ".json");
      failures.push(stem);
      lines.push(`${filename}: could not read or parse — ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  const status = failures.length === 0 ? "PASS" : "FAIL";
  const detail =
    status === "PASS"
      ? `All ${jsonFiles.length} bank file(s) passed structural validation.`
      : lines.join("\n");

  return { name: "validate:bank", status, failures, detail };
}

// Standalone entry point
if (process.argv[1]?.includes("validate-bank")) {
  const result = await runValidateBank();
  console.log(`[${result.status}] ${result.name}`);
  if (result.status !== "PASS") {
    console.error(result.detail);
    process.exit(1);
  } else {
    console.log(result.detail);
  }
}
