/**
 * npm run consolidate
 *
 * Merges promoted staging files from banks/_promoted/ into their routed
 * canonical banks with validation, schema, and global ID collision gates.
 */

import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBankText } from "../src/bankImport";
import { supportedSchemaVersions, validateBankObject } from "../src/schema";
import { serializeBank } from "../lib/presentation-normalization";
import { routeCanonical } from "../lib/canonical-routing";
import { CANONICAL_DIR, STAGING_DIR } from "../lib/pipeline-paths";
import { collectQuestionIds, type IdLocation } from "../lib/id-index";
import type { BankEnvelope } from "../src/types";

const SCHEMA_RANK = Object.fromEntries(
  supportedSchemaVersions.map((version, index) => [version, index]),
) as Record<string, number>;

export type ConsolidateDirs = {
  stagingDir: string;
  canonicalDir: string;
};

export type ConsolidateResult =
  | { ok: true; filename: string; canonical: string; mergedCount: number; dryRun: boolean; detail: string }
  | { ok: false; filename: string; canonical?: string; reason: string; details?: string[] };

const versionRank = (version: string | undefined) => SCHEMA_RANK[version ?? "1.0"] ?? 0;
const defaultMeta = (): NonNullable<BankEnvelope["meta"]> => ({
  schemaVersion: "1.0",
  count: 0,
});

const loadValidatedBank = async (path: string, label: string): Promise<BankEnvelope> => {
  const raw = parseBankText(await readFile(path, "utf8"));
  const result = validateBankObject(raw, { rejectUnknownKeys: true });
  if (!result.ok) {
    throw new Error(`${label} failed validation:\n${result.reasons.join("\n")}`);
  }
  return result.value;
};

const groupDuplicateIds = (locations: IdLocation[]): IdLocation[][] => {
  const byId = new Map<string, IdLocation[]>();
  for (const location of locations) {
    const existing = byId.get(location.id) ?? [];
    existing.push(location);
    byId.set(location.id, existing);
  }
  return [...byId.values()]
    .filter((entry) => entry.length > 1)
    .sort((left, right) => left[0].id.localeCompare(right[0].id));
};

const formatCollisions = (collisions: IdLocation[][]) =>
  collisions.map((locations) =>
    [
      `${locations[0].id}:`,
      ...locations.map((location) => `  - ${location.file}: ${location.path}`),
    ].join("\n"),
  );

export async function consolidateInto(
  dirs: ConsolidateDirs,
  filename: string,
  options: { dryRun?: boolean } = {},
): Promise<ConsolidateResult> {
  const canonical = routeCanonical(filename);
  if (!canonical) {
    return { ok: false, filename, reason: `Unknown canonical route for ${filename}` };
  }

  const stagingPath = join(dirs.stagingDir, filename);
  const canonicalPath = join(dirs.canonicalDir, canonical);

  let staging: BankEnvelope;
  try {
    staging = await loadValidatedBank(stagingPath, filename);
  } catch (error) {
    return {
      ok: false,
      filename,
      canonical,
      reason: error instanceof Error ? error.message : String(error),
    };
  }

  let canonicalBank: BankEnvelope;
  try {
    canonicalBank = await loadValidatedBank(canonicalPath, canonical);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("ENOENT")) {
      return { ok: false, filename, canonical, reason: message };
    }
    canonicalBank = {
      ...staging,
      meta: { ...defaultMeta(), ...staging.meta, count: 0 },
      questions: [],
    };
  }

  if (versionRank(staging.meta?.schemaVersion) > versionRank(canonicalBank.meta?.schemaVersion)) {
    return {
      ok: false,
      filename,
      canonical,
      reason: `${filename} schemaVersion ${staging.meta?.schemaVersion ?? "1.0"} is higher than ${canonical} ${canonicalBank.meta?.schemaVersion ?? "1.0"}; bump the canonical deliberately before consolidating.`,
    };
  }

  const collisions = groupDuplicateIds([
    ...collectQuestionIds(canonicalBank, canonical),
    ...collectQuestionIds(staging, filename),
  ]);
  if (collisions.length > 0) {
    return {
      ok: false,
      filename,
      canonical,
      reason: `${collisions.length} duplicate ID(s) would result from consolidation.`,
      details: formatCollisions(collisions),
    };
  }

  const merged: BankEnvelope = {
    ...canonicalBank,
    meta: {
      ...defaultMeta(),
      ...canonicalBank.meta,
      count: canonicalBank.questions.length + staging.questions.length,
    },
    questions: [...canonicalBank.questions, ...staging.questions],
  };

  const mergedResult = validateBankObject(merged, { rejectUnknownKeys: true });
  if (!mergedResult.ok) {
    return {
      ok: false,
      filename,
      canonical,
      reason: `Merged ${canonical} failed validation.`,
      details: mergedResult.reasons,
    };
  }

  const detail = `${filename} -> ${canonical}: ${canonicalBank.questions.length} + ${staging.questions.length} = ${merged.questions.length}`;
  if (options.dryRun) {
    return { ok: true, filename, canonical, mergedCount: merged.questions.length, dryRun: true, detail };
  }

  await mkdir(dirs.canonicalDir, { recursive: true });
  await writeFile(canonicalPath, serializeBank(mergedResult.value), "utf8");
  await unlink(stagingPath);

  return { ok: true, filename, canonical, mergedCount: merged.questions.length, dryRun: false, detail };
}

export async function consolidateAll(
  dirs: ConsolidateDirs,
  options: { dryRun?: boolean; files?: string[] } = {},
): Promise<ConsolidateResult[]> {
  const files: string[] = options.files ?? (await readdir(dirs.stagingDir).then((entries) =>
    entries.filter((entry) => entry.endsWith(".json")).sort(),
  ));
  const results: ConsolidateResult[] = [];
  for (const file of files) {
    results.push(await consolidateInto(dirs, basename(file), { dryRun: options.dryRun }));
  }
  return results;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dryRun = process.argv.includes("--dry-run");
  const files = process.argv.slice(2).filter((arg) => arg !== "--dry-run");

  let results: ConsolidateResult[];
  try {
    results = await consolidateAll(
      { stagingDir: STAGING_DIR, canonicalDir: CANONICAL_DIR },
      { dryRun, files: files.length > 0 ? files : undefined },
    );
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      console.log(`No staged files found in ${STAGING_DIR}.`);
      process.exit(0);
    }
    throw error;
  }

  if (results.length === 0) {
    console.log(`No staged files found in ${STAGING_DIR}.`);
    process.exit(0);
  }

  let failed = false;
  for (const result of results) {
    if (result.ok) {
      console.log(`${dryRun ? "[dry-run] " : ""}${result.detail}`);
    } else {
      failed = true;
      console.error(`${result.filename}: ${result.reason}`);
      result.details?.forEach((detail) => console.error(detail));
    }
  }

  if (failed) process.exit(1);
}
