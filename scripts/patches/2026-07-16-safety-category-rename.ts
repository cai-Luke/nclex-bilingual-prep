/** One-time quiet migration for the ratified NCLEX category label. */

import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OLD_CATEGORY = "Safety and Infection Control";
const NEW_CATEGORY = "Safety and Infection Prevention and Control";
const EXPECTED_REPLACEMENTS = 291;

const migrate = (value: unknown): number => {
  if (Array.isArray(value)) return value.reduce((sum, child) => sum + migrate(child), 0);
  if (!value || typeof value !== "object") return 0;
  let count = 0;
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (key === "category" && child === OLD_CATEGORY) {
      (value as Record<string, unknown>)[key] = NEW_CATEGORY;
      count += 1;
    } else {
      count += migrate(child);
    }
  }
  return count;
};

const write = process.argv.includes("--write");
let replacements = 0;
let changedFiles = 0;
const files = (await readdir("banks"))
  .filter((filename) => filename.endsWith(".json"))
  .sort()
  .map((filename) => join("banks", filename));
for (const file of files) {
  const raw = JSON.parse(await readFile(file, "utf8")) as unknown;
  const count = migrate(raw);
  if (count === 0) continue;
  replacements += count;
  changedFiles += 1;
  if (write) await writeFile(file, `${JSON.stringify(raw, null, 2)}\n`, "utf8");
}

if (replacements !== EXPECTED_REPLACEMENTS) {
  throw new Error(`Safety category migration matched ${replacements} fields; expected ${EXPECTED_REPLACEMENTS}.`);
}
console.log(`${write ? "Applied" : "Would apply"} ${replacements} Safety category field replacements across ${changedFiles} files.`);
