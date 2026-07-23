/**
 * Tier 1 — global bundled-bank ID uniqueness.
 *
 * Checks every bundled banks/*.json file for duplicate IDs across top-level
 * questions and embedded case-study leaf questions.
 */

import { readFile, readdir } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dedupeSelectedFilePaths, type SelectedFilePath } from "../../lib/selected-file-paths";
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

export type RunAuditIdsOptions = {
  /** Files whose IDs are being evaluated. Findings attribute to these. */
  candidates?: string[];

  /** Files checked for collisions against the candidates.
   *  Defaults to the current canonical sweep of banks/*.json. */
  comparison?: string[];
};

async function runCanonicalSweep(): Promise<AuditResult> {
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
    const result = validateBankObject(raw, { rejectUnknownKeys: true });
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

type LoadedExplicitBank = {
  bank: BankEnvelope;
  resolvedPath: string;
  displayPath: string;
};

async function loadExplicitBanks(
  files: SelectedFilePath[],
  population: "candidate" | "comparison",
): Promise<{ ok: true; banks: LoadedExplicitBank[] } | { ok: false; detail: string }> {
  const banks: LoadedExplicitBank[] = [];
  for (const { resolvedPath, displayPath } of files) {
    try {
      const raw = parseBankText(await readFile(resolvedPath, "utf8"));
      const result = validateBankObject(raw, { rejectUnknownKeys: true });
      if (!result.ok) {
        return {
          ok: false,
          detail: `${displayPath}: structural validation failed for explicitly selected ${population} file:\n${result.reasons.join("\n")}`,
        };
      }
      banks.push({ bank: result.value, resolvedPath, displayPath });
    } catch (error) {
      return {
        ok: false,
        detail: `${displayPath}: could not load explicitly selected ${population} file — ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
  return { ok: true, banks };
}

async function defaultComparisonFiles(): Promise<
  { ok: true; files: SelectedFilePath[] } | { ok: false; detail: string }
> {
  try {
    const filenames = (await readdir(CANONICAL_DIR)).filter((file) => file.endsWith(".json")).sort();
    return {
      ok: true,
      files: filenames.map((filename) => ({
        resolvedPath: resolve(CANONICAL_DIR, filename),
        displayPath: filename,
      })),
    };
  } catch (error) {
    return {
      ok: false,
      detail: `Comparison directory ${CANONICAL_DIR} not found or not readable — ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * A candidate-scoped ID audit reports a collision only when at least one colliding
 * location belongs to the candidate population. Comparison-only collisions are outside
 * the candidate verdict and must not poison every subsequent candidate run.
 */
async function runCandidateScope(
  candidates: string[],
  comparison: string[] | undefined,
): Promise<AuditResult> {
  const candidateFiles = dedupeSelectedFilePaths(candidates);
  const candidateKeys = new Set(candidateFiles.map(({ resolvedPath }) => resolvedPath));

  let comparisonFiles: SelectedFilePath[];
  if (comparison === undefined) {
    const defaults = await defaultComparisonFiles();
    if (!defaults.ok) {
      return { name: "audit:ids", status: "FAIL", failures: [], detail: defaults.detail };
    }
    comparisonFiles = defaults.files;
  } else {
    comparisonFiles = dedupeSelectedFilePaths(comparison);
  }
  comparisonFiles = comparisonFiles.filter(({ resolvedPath }) => !candidateKeys.has(resolvedPath));

  const loadedCandidates = await loadExplicitBanks(candidateFiles, "candidate");
  if (!loadedCandidates.ok) {
    return {
      name: "audit:ids",
      status: "FAIL",
      failures: candidateFiles.map(({ displayPath }) => displayPath),
      detail: loadedCandidates.detail,
    };
  }
  const loadedComparison = await loadExplicitBanks(comparisonFiles, "comparison");
  if (!loadedComparison.ok) {
    return {
      name: "audit:ids",
      status: "FAIL",
      failures: comparisonFiles.map(({ displayPath }) => displayPath),
      detail: loadedComparison.detail,
    };
  }

  const displayByResolved = new Map(
    [...loadedCandidates.banks, ...loadedComparison.banks]
      .map(({ resolvedPath, displayPath }) => [resolvedPath, displayPath] as const),
  );
  const collisions = findIdCollisions(
    [...loadedCandidates.banks, ...loadedComparison.banks]
      .map(({ bank, resolvedPath }) => ({ bank, file: resolvedPath })),
  ).filter((locations) => locations.some((location) => candidateKeys.has(location.file)));

  if (collisions.length === 0) {
    const idCount = [...loadedCandidates.banks, ...loadedComparison.banks]
      .reduce((total, entry) => total + collectQuestionIds(entry.bank, entry.resolvedPath).length, 0);
    return {
      name: "audit:ids",
      status: "PASS",
      failures: [],
      detail:
        `All ${idCount} question IDs across ${loadedCandidates.banks.length} explicitly selected candidate file(s) ` +
        `and ${loadedComparison.banks.length} comparison file(s) produced no candidate-attributable collisions.`,
    };
  }

  const failures = collisions.map((locations) => locations[0].id);
  const detail = [
    `${collisions.length} duplicate question ID(s) involve the explicitly selected candidate files.`,
    ...collisions.map((locations) =>
      [
        `${locations[0].id}:`,
        ...locations.map((location) =>
          `  - ${displayByResolved.get(location.file) ?? location.file}: ${location.path}`),
      ].join("\n"),
    ),
  ].join("\n");
  return { name: "audit:ids", status: "FAIL", failures, detail };
}

export async function runAuditIds(options: RunAuditIdsOptions = {}): Promise<AuditResult> {
  if (options.candidates === undefined) {
    if (options.comparison !== undefined) {
      return {
        name: "audit:ids",
        status: "FAIL",
        failures: [],
        detail: "A comparison file selection requires a non-empty candidate file selection.",
      };
    }
    return runCanonicalSweep();
  }
  if (options.candidates.length === 0) {
    return {
      name: "audit:ids",
      status: "FAIL",
      failures: [],
      detail: "Explicit candidate file selection is empty.",
    };
  }
  return runCandidateScope(options.candidates, options.comparison);
}

function parseCliArgs(argv: string[]): RunAuditIdsOptions {
  const candidates: string[] = [];
  const comparison: string[] = [];
  let comparisonSupplied = false;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg !== "--candidate" && arg !== "--comparison") {
      throw new Error(`Unknown argument: ${arg}`);
    }
    const value = argv[index + 1];
    if (value === undefined) throw new Error(`${arg} requires a path argument`);
    if (value.trim() === "") throw new Error(`${arg} requires a non-empty path argument`);
    if (arg === "--candidate") candidates.push(value);
    else {
      comparison.push(value);
      comparisonSupplied = true;
    }
    index += 1;
  }
  return {
    candidates: candidates.length > 0 ? candidates : undefined,
    comparison: comparisonSupplied ? comparison : undefined,
  };
}

async function runCli(): Promise<void> {
  let options: RunAuditIdsOptions;
  try {
    options = parseCliArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
  const result = await runAuditIds(options);
  console.log(`[${result.status}] ${result.name}`);
  console.log(result.detail);
  process.exit(result.status === "FAIL" ? 1 : 0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await runCli();
