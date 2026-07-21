import { PRODUCER_VOCABULARY_LEXICON, distinctItemKey, scanBundledBanks } from "../../lib/producer-vocabulary-leakage";
import type { AuditResult } from "./types";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export { PRODUCER_VOCABULARY_LEXICON };

export async function runAuditProducerVocabulary(): Promise<AuditResult> {
  const scan = await scanBundledBanks();
  const high = scan.occurrences.filter((entry) => entry.confidence === "HIGH");
  const failures = [...new Set(high.map((entry) => entry.embeddedQuestionId ?? entry.topLevelId))].sort();
  if (high.length === 0) {
    return {
      name: "audit:producer-vocabulary",
      status: "PASS",
      failures: [],
      detail: `No HIGH-confidence producer vocabulary found across ${scan.canonicalItemsScanned} learner-facing canonical items.`,
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

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = await runAuditProducerVocabulary();
  console.log(`[${result.status}] ${result.name}`);
  console.log(result.detail);
  process.exit(result.status === "FAIL" ? 1 : 0);
}
