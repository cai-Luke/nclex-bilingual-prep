/**
 * npm run promote
 *
 * Reads every JSON file in banks/banks-raw/, applies the deterministic shuffle,
 * and writes the promoted result to banks/ with the same filename.
 *
 * Idempotent for a given seed: re-running always produces the same output.
 * The promoter never touches files in banks/ that have no corresponding draft.
 */

import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { parseBankText } from "../src/bankImport";
import { supportedSchemaVersions, validateBankObject } from "../src/schema";
import { shuffle } from "../lib/shuffle";
import { normalizeBankPresentations, serializeBank } from "../lib/presentation-normalization";
import type { BankEnvelope } from "../src/types";

const DRAFT_DIR = "banks/banks-raw";
const PROMOTED_DIR = "banks";

// Maps filename prefix → the canonical bank it will be jq-merged into.
// Used by the schemaVersion guard so it compares against the aggregate, not
// the same-named transient intermediate written by this script.
// Model-origin banks are the active generation targets — `gemini-` is the live
// emit prefix; `gpt-`/`claude-`/`hard-cases-` are legacy aggregates. The
// visual-kind banks are complete content sets, not generation targets; their
// rows exist so a stray draft still routes for the schema guard. No prefix here
// is a string-prefix of another, so `find`/`startsWith` order is not load-bearing.
const CANONICAL_PREFIXES: Array<[prefix: string, canonical: string]> = [
  // model-origin lanes
  ["gemini-", "gemini-canonical.json"],
  ["gpt-", "gpt-canonical.json"],
  ["claude-", "claude-canonical.json"],
  ["hard-cases-", "hard-cases-canonical.json"],
  // visual-kind lanes (complete sets, not generation targets)
  ["burn-", "burn-canonical.json"],
  ["capnography-", "capnography-canonical.json"],
  ["device-", "device-canonical.json"],
  ["io-", "io-canonical.json"],
  ["lab-", "lab-canonical.json"],
  ["mar-", "mar-canonical.json"],
  ["medlabel-", "medlabel-canonical.json"],
  ["vitals-", "vitals-canonical.json"],
  ["visual-", "visual-canonical.json"],
];

const SCHEMA_RANK = Object.fromEntries(
  supportedSchemaVersions.map((version, index) => [version, index]),
) as Record<string, number>;

const files = await readdir(DRAFT_DIR);
const jsonFiles = files.filter((f) => f.endsWith(".json")).sort();

if (jsonFiles.length === 0) {
  console.error(`No JSON files found in ${DRAFT_DIR}`);
  process.exit(1);
}

let anyFailed = false;

for (const filename of jsonFiles) {
  const draftPath = join(DRAFT_DIR, filename);
  const promotedPath = join(PROMOTED_DIR, filename);

  try {
    const text = await readFile(draftPath, "utf8");
    const raw = parseBankText(text);
    const result = validateBankObject(raw);

    if (!result.ok) {
      console.error(`\n${filename}: draft validation failed — fix these before promoting:`);
      result.reasons.forEach((r) => console.error(`  - ${r}`));
      anyFailed = true;
      continue;
    }

    const bank = result.value;

    // Schema version guard: warn if draft declares a higher schemaVersion than
    // the canonical it will land in, so the bump surfaces here rather than as a
    // silent downstream audit failure.
    const canonicalName =
      CANONICAL_PREFIXES.find(([pfx]) => filename.startsWith(pfx))?.[1] ?? null;
    const comparisonPath = join(PROMOTED_DIR, canonicalName ?? filename);
    try {
      const existing = JSON.parse(await readFile(comparisonPath, "utf8")) as {
        meta?: { schemaVersion?: string };
      };
      const existingVersion = existing.meta?.schemaVersion ?? "1.0";
      const existingRank = SCHEMA_RANK[existingVersion] ?? 0;
      const draftVersion = bank.meta?.schemaVersion ?? "1.0";
      const draftRank = SCHEMA_RANK[draftVersion] ?? 0;
      if (draftRank > existingRank) {
        console.warn(
          `[warn] ${filename}: schemaVersion ${draftVersion} > ${canonicalName ?? basename(comparisonPath)} ${existingVersion} — canonical will need a version bump before merge`
        );
      }
    } catch {
      // canonical not yet present (new bank) — skip silently
    }

    const shuffled: BankEnvelope = {
      ...bank,
      questions: bank.questions.map(shuffle),
    };

    const { bank: promoted } = normalizeBankPresentations(shuffled);

    await writeFile(promotedPath, serializeBank(promoted), "utf8");
    console.log(`${filename}: promoted ${promoted.questions.length} item(s) → ${basename(promotedPath)}`);
  } catch (e) {
    console.error(`${filename}: ${e instanceof Error ? e.message : String(e)}`);
    anyFailed = true;
  }
}

if (anyFailed) process.exit(1);
