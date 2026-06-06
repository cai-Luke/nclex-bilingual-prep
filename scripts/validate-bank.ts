import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { parseBankText } from "../src/bankImport";
import { validateBankObject } from "../src/schema";

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error("Usage: npm run validate-bank -- banks/*.json");
  process.exit(1);
}

let failed = false;

for (const file of files) {
  try {
    const text = await readFile(file, "utf8");
    const raw = parseBankText(text);
    const result = validateBankObject(raw);
    if (!result.ok) {
      failed = true;
      console.error(`\n${basename(file)} failed validation:`);
      result.reasons.forEach((reason) => console.error(`- ${reason}`));
      continue;
    }
    console.log(`${basename(file)} OK (${result.value.questions.length} questions)`);
  } catch (error) {
    failed = true;
    console.error(`\n${basename(file)} could not be read or parsed:`);
    console.error(error instanceof Error ? error.message : String(error));
  }
}

if (failed) process.exit(1);
