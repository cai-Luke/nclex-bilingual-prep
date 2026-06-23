import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { checkCaseCompileManifests, stripCompileManifests } from "../lib/case-completeness";
import { normalizeRawBankStructure, serializeRawBank } from "../lib/raw-bank-normalization";
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

const args = parseArgs(process.argv.slice(2));
if (args.paths.length === 0) {
  console.error("Usage: npm run normalize-raw-bank -- [--write] banks/banks-raw/<file>.json [...]");
  process.exit(1);
}

let failed = false;
for (const path of args.paths) {
  try {
    const sourceText = await readFile(path, "utf8");
    const raw = parseBankText(sourceText);
    const result = normalizeRawBankStructure(raw);
    const outputText = serializeRawBank(result.bank);
    const changed = outputText !== sourceText;
    const manifestFailures = checkCaseCompileManifests(result.bank);
    if (manifestFailures.length > 0) {
      throw new Error(
        `case-completeness validation failed:\n${manifestFailures
          .flatMap((failure) => failure.reasons.map((reason) => `${failure.caseId}: ${reason}`))
          .join("\n")}`,
      );
    }
    const validation = validateBankObject(stripCompileManifests(result.bank));
    if (!validation.ok) {
      throw new Error(`normalized bank still fails validation:\n${validation.reasons.join("\n")}`);
    }
    if (args.write && changed) {
      await writeFile(path, outputText, "utf8");
    }
    console.log(
      `${basename(path)}: ${result.changes.length} structural change(s); ${
        changed ? (args.write ? "written" : "would write") : "already normalized"
      }; validation passed`,
    );
    result.changes.forEach((change) => {
      console.log(`  - ${change.path}: ${change.note}`);
    });
  } catch (error) {
    failed = true;
    console.error(`${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failed) process.exit(1);
