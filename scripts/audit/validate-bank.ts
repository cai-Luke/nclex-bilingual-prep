/**
 * Tier 0 — structural well-formedness check.
 *
 * Validates every JSON file in the promoted banks/ directory. A failure here
 * short-circuits the aggregate before any Tier-1 audit runs.
 *
 * Can be run standalone:  tsx scripts/audit/validate-bank.ts
 */

import { readFile, readdir } from "node:fs/promises";
import { join, basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { dedupeSelectedFilePaths } from "../../lib/selected-file-paths";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import type { AuditResult } from "./types";

const PROMOTED_DIR = "banks";

export type RunValidateBankOptions = {
  /** Audit exactly these file paths instead of sweeping the default directory.
   *  Fails loud: a missing, unreadable, unparseable, or schema-invalid selected
   *  file is never silently skipped. */
  files?: string[];
};

async function runDefaultSweep(): Promise<AuditResult> {
  const files = await readdir(PROMOTED_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json")).sort();

  const failures: string[] = [];
  const lines: string[] = [];

  for (const filename of jsonFiles) {
    const path = join(PROMOTED_DIR, filename);
    try {
      const text = await readFile(path, "utf8");
      const raw = parseBankText(text);
      const result = validateBankObject(raw, { rejectUnknownKeys: true, requireMeta: true });
      if (!result.ok) {
        const stem = basename(filename, ".json");
        failures.push(stem);
        lines.push(`${filename}:`);
        result.reasons.forEach((r) => lines.push(`  ${r}`));
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

async function runSelectedFiles(files: string[]): Promise<AuditResult> {
  const selected = dedupeSelectedFilePaths(files);
  const failures: string[] = [];
  const lines: string[] = [];

  for (const { resolvedPath, displayPath } of selected) {
    try {
      const text = await readFile(resolvedPath, "utf8");
      const raw = parseBankText(text);
      const result = validateBankObject(raw, { rejectUnknownKeys: true, requireMeta: true });
      if (!result.ok) {
        failures.push(displayPath);
        lines.push(`${displayPath}:`);
        result.reasons.forEach((reason) => lines.push(`  ${reason}`));
      }
    } catch (error) {
      failures.push(displayPath);
      lines.push(`${displayPath}: could not read or parse — ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return {
    name: "validate:bank",
    status: failures.length === 0 ? "PASS" : "FAIL",
    failures,
    detail: failures.length === 0
      ? `All ${selected.length} explicitly selected bank file(s) passed structural validation.`
      : lines.join("\n"),
  };
}

export async function runValidateBank(options: RunValidateBankOptions = {}): Promise<AuditResult> {
  if (options.files === undefined) return runDefaultSweep();
  if (options.files.length === 0) {
    return {
      name: "validate:bank",
      status: "FAIL",
      failures: [],
      detail: "Explicit file selection is empty.",
    };
  }
  return runSelectedFiles(options.files);
}

function parseCliArgs(argv: string[]): { files?: string[] } {
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
  let options: RunValidateBankOptions;
  try {
    options = parseCliArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return;
  }
  const result = await runValidateBank(options);
  console.log(`[${result.status}] ${result.name}`);
  if (result.status !== "PASS") {
    console.error(result.detail);
  } else {
    console.log(result.detail);
  }
  if (result.status === "FAIL") process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await runCli();
