import {
  PRODUCER_VOCABULARY_LEXICON,
  distinctItemKey,
  scanBundledBanks,
  scanSelectedBanks,
} from "../../lib/producer-vocabulary-leakage";
import type { AuditResult } from "./types";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export { PRODUCER_VOCABULARY_LEXICON };

export type RunAuditProducerVocabularyOptions = {
  /** Audit exactly these file paths instead of sweeping the default directory.
   *  Fails loud: a missing, unreadable, unparseable, or schema-invalid selected
   *  file is never silently skipped. */
  files?: string[];
};

export async function runAuditProducerVocabulary(
  options: RunAuditProducerVocabularyOptions = {},
): Promise<AuditResult> {
  if (options.files !== undefined && options.files.length === 0) {
    return {
      name: "audit:producer-vocabulary",
      status: "FAIL",
      failures: [],
      detail: "Explicit file selection is empty.",
    };
  }
  const explicit = options.files !== undefined;
  let scan;
  try {
    scan = explicit ? await scanSelectedBanks(options.files!) : await scanBundledBanks();
  } catch (error) {
    if (!explicit) throw error;
    return {
      name: "audit:producer-vocabulary",
      status: "FAIL",
      failures: options.files!,
      detail: `Explicitly selected file load failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
  const high = scan.occurrences.filter((entry) => entry.confidence === "HIGH");
  const failures = [...new Set(high.map((entry) => entry.embeddedQuestionId ?? entry.topLevelId))].sort();
  if (high.length === 0) {
    return {
      name: "audit:producer-vocabulary",
      status: "PASS",
      failures: [],
      detail: explicit
        ? `No HIGH-confidence producer vocabulary found across ${scan.canonicalItemsScanned} learner-facing items in the explicitly selected files.`
        : `No HIGH-confidence producer vocabulary found across ${scan.canonicalItemsScanned} learner-facing canonical items.`,
    };
  }
  const evidence = high.map((entry) =>
    `${entry.bank} ${distinctItemKey(entry)} ${entry.path}: ${JSON.stringify(entry.matchedPhrase)}`,
  );
  return {
    name: "audit:producer-vocabulary",
    status: "FAIL",
    failures,
    detail: `${high.length} HIGH-confidence learner-facing occurrence(s):\n${evidence.join("\n")}`,
  };
}

function parseCliArgs(argv: string[]): RunAuditProducerVocabularyOptions {
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
  let options: RunAuditProducerVocabularyOptions;
  try {
    options = parseCliArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return;
  }
  const result = await runAuditProducerVocabulary(options);
  console.log(`[${result.status}] ${result.name}`);
  console.log(result.detail);
  if (result.status === "FAIL") process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await runCli();
}
