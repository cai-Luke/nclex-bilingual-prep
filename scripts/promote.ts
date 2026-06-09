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
import { validateBankObject } from "../src/schema";
import { shuffle } from "../lib/shuffle";
import type { BankEnvelope } from "../src/types";

const DRAFT_DIR = "banks/banks-raw";
const PROMOTED_DIR = "banks";

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
    const promoted: BankEnvelope = {
      ...bank,
      questions: bank.questions.map(shuffle),
    };

    await writeFile(promotedPath, JSON.stringify(promoted, null, 2) + "\n", "utf8");
    console.log(`${filename}: promoted ${promoted.questions.length} item(s) → ${basename(promotedPath)}`);
  } catch (e) {
    console.error(`${filename}: ${e instanceof Error ? e.message : String(e)}`);
    anyFailed = true;
  }
}

if (anyFailed) process.exit(1);
