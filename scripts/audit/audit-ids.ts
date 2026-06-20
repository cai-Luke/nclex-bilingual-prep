/**
 * Tier 1 — global bundled-bank ID uniqueness.
 *
 * Checks every bundled banks/*.json file for duplicate IDs across top-level
 * questions and embedded case-study leaf questions.
 */

import { readFile, readdir } from "node:fs/promises";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import { CANONICAL_DIR } from "../../lib/pipeline-paths";
import { collectQuestionIds, type IdLocation } from "../../lib/id-index";
import type { AuditResult } from "./types";
import type { BankEnvelope } from "../../src/types";

export function findIdCollisions(
  banks: Array<{ bank: BankEnvelope; file: string }>,
): IdLocation[][] {
  const byId = new Map<string, IdLocation[]>();
  for (const { bank, file } of banks) {
    for (const location of collectQuestionIds(bank, file)) {
      const existing = byId.get(location.id) ?? [];
      existing.push(location);
      byId.set(location.id, existing);
    }
  }
  return [...byId.values()]
    .filter((locations) => locations.length > 1)
    .sort((left, right) => left[0].id.localeCompare(right[0].id));
}

export async function runAuditIds(): Promise<AuditResult> {
  let files: string[];
  try {
    files = (await readdir(CANONICAL_DIR)).filter((file) => file.endsWith(".json")).sort();
  } catch {
    return {
      name: "audit:ids",
      status: "INSUFFICIENT",
      failures: [],
      detail: `Canonical directory ${CANONICAL_DIR} not found or not readable.`,
    };
  }

  const banks: Array<{ bank: BankEnvelope; file: string }> = [];
  for (const filename of files) {
    const text = await readFile(join(CANONICAL_DIR, filename), "utf8");
    const raw = parseBankText(text);
    const result = validateBankObject(raw);
    if (!result.ok) {
      return {
        name: "audit:ids",
        status: "FAIL",
        failures: [filename],
        detail: `${filename}: structural validation failed before ID audit:\n${result.reasons.join("\n")}`,
      };
    }
    banks.push({ bank: result.value, file: basename(filename) });
  }

  const collisions = findIdCollisions(banks);
  if (collisions.length === 0) {
    const idCount = banks.reduce((total, entry) => total + collectQuestionIds(entry.bank, entry.file).length, 0);
    return {
      name: "audit:ids",
      status: "PASS",
      failures: [],
      detail: `All ${idCount} bundled question IDs are globally unique across ${files.length} file(s).`,
    };
  }

  const failures = collisions.map((locations) => locations[0].id);
  const detail = [
    `${collisions.length} duplicate question ID(s) found across bundled banks.`,
    ...collisions.map((locations) =>
      [
        `${locations[0].id}:`,
        ...locations.map((location) => `  - ${location.file}: ${location.path}`),
      ].join("\n"),
    ),
  ].join("\n");

  return { name: "audit:ids", status: "FAIL", failures, detail };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await runAuditIds();
  console.log(`[${result.status}] ${result.name}`);
  console.log(result.detail);
  if (result.status === "FAIL") process.exit(1);
}
