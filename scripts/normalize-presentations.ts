import { readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import {
  normalizeBankPresentations,
  serializeBank,
  type PresentationComponent,
} from "../lib/presentation-normalization";
import { parseBankText } from "../src/bankImport";
import { validateBankObject } from "../src/schema";

type Args = {
  write: boolean;
  paths: string[];
};

function parseArgs(args: string[]): Args {
  const paths: string[] = [];
  let write = false;
  for (const arg of args) {
    if (arg === "--write") {
      write = true;
    } else if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      paths.push(arg);
    }
  }
  return { write, paths };
}

async function defaultBankPaths(): Promise<string[]> {
  return (await readdir("banks"))
    .filter((filename) => filename.endsWith(".json"))
    .sort()
    .map((filename) => join("banks", filename));
}

const args = parseArgs(process.argv.slice(2));
const paths = args.paths.length > 0 ? [...args.paths].sort() : await defaultBankPaths();
const totals = new Map<PresentationComponent, number>();
let totalChanges = 0;
let totalSkippedUnsafe = 0;
let failed = false;

for (const path of paths) {
  try {
    const sourceText = await readFile(path, "utf8");
    const raw = parseBankText(sourceText);
    const validation = validateBankObject(raw);
    if (!validation.ok) {
      throw new Error(validation.reasons.join("\n"));
    }
    const result = normalizeBankPresentations(validation.value);
    const outputText = Array.isArray(raw)
      ? `${JSON.stringify(result.bank.questions, null, 2)}\n`
      : serializeBank(result.bank);
    const changed = outputText !== sourceText;
    totalChanges += result.changes.length;
    totalSkippedUnsafe += result.skippedUnsafe;
    for (const change of result.changes) {
      totals.set(change.component, (totals.get(change.component) ?? 0) + 1);
    }
    if (args.write && changed) {
      await writeFile(path, outputText, "utf8");
    }
    console.log(
      `${basename(path)}: ${result.changes.length} component(s) ${
        changed ? (args.write ? "changed" : "would change") : "already normalized"
      }; invariants passed`,
    );
  } catch (error) {
    failed = true;
    console.error(`${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log(`\nMode: ${args.write ? "write" : "dry-run"}`);
console.log(`Files inspected: ${paths.length}`);
console.log(`Display components changed: ${totalChanges}`);
for (const [component, count] of [...totals].sort(([left], [right]) => left.localeCompare(right))) {
  console.log(`  ${component}: ${count}`);
}
console.log(`Unsafe shapes skipped: ${totalSkippedUnsafe}`);
console.log(`Invariants: ${failed ? "FAILED" : "passed"}`);

if (failed) process.exit(1);
