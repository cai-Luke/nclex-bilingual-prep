/**
 * npm run promote
 *
 * Reads every JSON file in banks/banks-raw/, applies the deterministic shuffle,
 * and writes the promoted result to banks/ with the same filename.
 *
 * Idempotent for a given seed: re-running always produces the same output.
 * The promoter never touches files in banks/ that have no corresponding draft.
 */

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { parseBankText } from "../src/bankImport";
import { supportedSchemaVersions, validateBankObject } from "../src/schema";
import { shuffle } from "../lib/shuffle";
import { checkCaseCompileManifests, stripCompileManifests } from "../lib/case-completeness";
import { normalizeBankPresentations, serializeBank } from "../lib/presentation-normalization";
import { routeCanonical } from "../lib/canonical-routing";
import { CANONICAL_DIR, DRAFT_DIR, STAGING_DIR } from "../lib/pipeline-paths";
import { runAuditNonMcqBiasOnBanks } from "./audit/audit-non-mcq-bias";
import { isMechanicalBiasEnforced } from "./audit/audit-verdict";
import type { BankEnvelope } from "../src/types";

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
await mkdir(STAGING_DIR, { recursive: true });
const stagedBanks: Array<{ filename: string; promotedPath: string; bank: BankEnvelope }> = [];

for (const filename of jsonFiles) {
  const draftPath = join(DRAFT_DIR, filename);
  const promotedPath = join(STAGING_DIR, filename);

  try {
    const text = await readFile(draftPath, "utf8");
    const raw = parseBankText(text);
    const manifestFailures = checkCaseCompileManifests(raw);
    if (manifestFailures.length > 0) {
      console.error(`\n${filename}: case-completeness gate failed:`);
      manifestFailures.forEach((failure) => {
        failure.reasons.forEach((reason) => console.error(`  - ${failure.caseId}: ${reason}`));
      });
      anyFailed = true;
      continue;
    }
    const result = validateBankObject(stripCompileManifests(raw), { rejectUnknownKeys: true });

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
    const canonicalName = routeCanonical(filename);
    const comparisonPath = join(CANONICAL_DIR, canonicalName ?? filename);
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

    stagedBanks.push({ filename, promotedPath, bank: promoted });
  } catch (e) {
    console.error(`${filename}: ${e instanceof Error ? e.message : String(e)}`);
    anyFailed = true;
  }
}

if (anyFailed) process.exit(1);

const biasResults = runAuditNonMcqBiasOnBanks(stagedBanks.map((entry) => ({
  id: basename(entry.filename, ".json"),
  questions: entry.bank.questions,
})));
const mechanicalBias = biasResults.find((result) => result.name === "audit:non-mcq-bias:mechanical");
const advisoryBias = biasResults.filter((result) => result.status === "WARN" || result.status === "FAIL");

for (const result of advisoryBias) {
  const label = result.status === "FAIL" ? "fail" : "warn";
  console.warn(`[${label}] ${result.name}: ${result.detail}`);
}

if (mechanicalBias?.status === "FAIL" && isMechanicalBiasEnforced()) {
  console.error("staged batch has positional tells post-shuffle — normalization did not apply; not staging.");
  process.exit(1);
}

for (const { filename, promotedPath, bank } of stagedBanks) {
  await writeFile(promotedPath, serializeBank(bank), "utf8");
  console.log(`${filename}: promoted ${bank.questions.length} item(s) → ${join(STAGING_DIR, basename(promotedPath))}`);
}
