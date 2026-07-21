import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  PRODUCER_VOCABULARY_LEXICON,
  distinctItemKey,
  scanBundledBanks,
  type LeakageOccurrence,
} from "../lib/producer-vocabulary-leakage";

export { PRODUCER_VOCABULARY_LEXICON };

const argValue = (flag: string): string | undefined => {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
};

const contextFor = (entry: LeakageOccurrence): string => {
  const start = Math.max(0, entry.matchIndex - 70);
  const end = Math.min(entry.text.length, entry.matchIndex + entry.matchedPhrase.length + 70);
  return entry.text.slice(start, end);
};

export async function buildProducerVocabularyManifest() {
  const scan = await scanBundledBanks();
  const high = scan.occurrences.filter((entry) => entry.confidence === "HIGH");
  const annex = scan.occurrences.filter((entry) => entry.confidence === "ANNEX");
  const highItemKeys = new Set(high.map(distinctItemKey));
  const tierByItem = new Map<string, string>();
  const rank = { stem: 0, testTakingStrategy: 1, rationale_other: 2, other: 3 } as const;
  for (const entry of high) {
    const key = distinctItemKey(entry);
    const current = tierByItem.get(key) as keyof typeof rank | undefined;
    if (!current || rank[entry.tier] < rank[current]) tierByItem.set(key, entry.tier);
  }
  const tierCounts = [...tierByItem.values()].reduce<Record<string, number>>((counts, tier) => {
    counts[tier] = (counts[tier] ?? 0) + 1;
    return counts;
  }, {});

  const serialize = (entry: LeakageOccurrence) => ({
    bank: entry.bank,
    topLevelQuestionId: entry.topLevelId,
    ...(entry.embeddedQuestionId ? { embeddedQuestionId: entry.embeddedQuestionId } : {}),
    itemType: entry.itemType,
    jsonPath: entry.path,
    language: entry.language,
    exactMatchedPhrase: entry.matchedPhrase,
    fullFieldText: entry.text,
    tier: entry.tier,
    alsoInAnnex: annex.some((candidate) => distinctItemKey(candidate) === distinctItemKey(entry) && candidate.path === entry.path),
    context: contextFor(entry),
  });

  return {
    generatedFor: "producer-vocabulary-leakage remediation",
    canonicalItemsScanned: scan.canonicalItemsScanned,
    banksScanned: scan.banksScanned,
    executableLexicon: PRODUCER_VOCABULARY_LEXICON,
    distinctItemsHigh: highItemKeys.size,
    tierCounts,
    highOccurrences: high.map(serialize),
    bareLaneAnnexOccurrences: annex.map(serialize),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const manifest = await buildProducerVocabularyManifest();
  const output = resolve(argValue("--out") ?? "audit/producer-vocabulary-leakage-2026-07-21/codex-baseline.json");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Wrote ${output}`);
  console.log(`Canonical items: ${manifest.canonicalItemsScanned}`);
  console.log(`HIGH distinct items: ${manifest.distinctItemsHigh}`);
  console.log(`HIGH occurrences: ${manifest.highOccurrences.length}`);
  console.log(`Bare-lane annex occurrences: ${manifest.bareLaneAnnexOccurrences.length}`);
  console.log(`Tier split: ${JSON.stringify(manifest.tierCounts)}`);
}
