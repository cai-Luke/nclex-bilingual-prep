import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import type { Question } from "../../src/types";
import { normalizeTopic } from "../coverage-report";

export const DEFAULT_BANKS = [
  "banks/gemini-canonical.json",
  "banks/gpt-canonical.json",
  "banks/claude-canonical.json",
  "banks/hard-cases-canonical.json",
] as const;
export const DEFAULT_QUEUE =
  "audit/early-bank-semantic/layer-a-queue.jsonl";
export const DEFAULT_SUMMARY =
  "audit/early-bank-semantic/layer-a-summary.json";

export type ProvenanceTier = "high" | "medium" | "low";
export type SemanticTrack = "currency" | "coherence";
export type CurrencyCluster =
  | "immunization_screening"
  | "isolation_precautions"
  | "anticoagulation"
  | "dka_insulin"
  | "sepsis"
  | "burn_parkland"
  | "stroke"
  | "acls"
  | "bp_targets";

export type SemanticInventoryItem = {
  id: string;
  bank: string;
  path: string;
  producer: "gemini" | "gpt" | "claude" | "mixed";
  provenance_tier: ProvenanceTier;
  topic: string;
  normalized_topic: string;
  item_type: Question["itemType"];
  skill_signature?: string;
  currency_clusters: CurrencyCluster[];
};

export type SemanticQueueRow = SemanticInventoryItem & {
  track: SemanticTrack;
  currency_cluster?: CurrencyCluster;
  pair_with: string[];
  routing_reasons: string[];
  harm_rank: number;
};

type LoadedItem = SemanticInventoryItem & {
  question: Question;
  searchText: string;
  tokens: Set<string>;
  answerTokens: Set<string>;
};

const HIGH_PREFIXES = [
  "gemini_jun05",
  "gemini_p",
  "gemini_b",
  "gemini_c",
  "gemini_d",
  "trad_",
  "gen_",
  "easy_",
  "gap_",
  "gemini_gapfill",
];
const LOW_PREFIXES = ["opus_", "gpt_case_", "claude_cs_"];

const CURRENCY_RULES: Array<{
  cluster: CurrencyCluster;
  pattern: RegExp;
  harmRank: number;
}> = [
  {
    cluster: "immunization_screening",
    pattern:
      /\b(?:immuni[sz]|vaccin|screen(?:ing)?|mammogra|colorectal|colonoscopy|cervical cancer|pap smear|papanicolaou|lung cancer|pneumococ|shingles|zoster|hpv|hepatitis [ab]|influenza)\b/i,
    harmRank: 90,
  },
  {
    cluster: "isolation_precautions",
    pattern:
      /\b(?:isolation|transmission-based|airborne|droplet|contact precaution|negative-pressure|negative pressure|n95|respirator|ppe|personal protective equipment|doffing|donning)\b/i,
    harmRank: 88,
  },
  {
    cluster: "anticoagulation",
    pattern:
      /\b(?:anticoag|warfarin|heparin|enoxaparin|apixaban|rivaroxaban|dabigatran|protamine|vitamin k|inr|aPTT|anti-xa)\b/i,
    harmRank: 86,
  },
  {
    cluster: "dka_insulin",
    pattern:
      /\b(?:diabetic ketoacidosis|dka|insulin infusion|regular insulin|insulin therapy|insulin administration|mixing insulin|potassium replacement)\b/i,
    harmRank: 85,
  },
  {
    cluster: "sepsis",
    pattern:
      /\b(?:sepsis|septic shock|sepsis bundle|serum lactate|blood cultures before antibiotics)\b/i,
    harmRank: 84,
  },
  {
    cluster: "stroke",
    pattern:
      /\b(?:stroke|cva|thromboly|alteplase|tenecteplase|mechanical thrombectomy|nihss)\b/i,
    harmRank: 83,
  },
  {
    cluster: "burn_parkland",
    pattern:
      /\b(?:parkland|rule of nines|burn resuscitation|tbsa|total body surface area)\b/i,
    harmRank: 82,
  },
  {
    cluster: "acls",
    pattern:
      /\b(?:acls|cardiac arrest|pulseless|ventricular fibrillation|ventricular tachycardia|asystole|pea|advanced cardiac life support)\b/i,
    harmRank: 81,
  },
  {
    cluster: "bp_targets",
    pattern:
      /\b(?:hypertension|hypertensive|blood pressure target|bp target|systolic target|map target|mean arterial pressure target)\b/i,
    harmRank: 80,
  },
];

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "based",
  "client",
  "does",
  "for",
  "from",
  "has",
  "in",
  "is",
  "most",
  "nurse",
  "of",
  "on",
  "or",
  "should",
  "the",
  "this",
  "to",
  "which",
  "with",
]);

const tokenize = (text: string) =>
  new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter((token) => token.length >= 3 && !STOP_WORDS.has(token)),
  );

const jaccard = (left: Set<string>, right: Set<string>) => {
  if (left.size === 0 || right.size === 0) return 0;
  let intersection = 0;
  left.forEach((token) => {
    if (right.has(token)) intersection += 1;
  });
  return intersection / (left.size + right.size - intersection);
};

const producerFor = (
  bank: string,
  id: string,
): SemanticInventoryItem["producer"] => {
  if (id.startsWith("opus_") || bank.startsWith("claude-")) return "claude";
  if (id.startsWith("gpt_") || bank.startsWith("gpt-")) return "gpt";
  if (
    id.startsWith("gemini_") ||
    id.startsWith("trad_") ||
    id.startsWith("gen_") ||
    id.startsWith("easy_") ||
    id.startsWith("gap_") ||
    bank.startsWith("gemini-")
  ) {
    return "gemini";
  }
  return "mixed";
};

export const provenanceTierFor = (id: string): ProvenanceTier => {
  if (LOW_PREFIXES.some((prefix) => id.startsWith(prefix))) return "low";
  if (HIGH_PREFIXES.some((prefix) => id.startsWith(prefix))) return "high";
  return "medium";
};

const getSkillSignature = (question: Question) => {
  const meta = (question as Question & {
    meta?: { skill_signature?: unknown };
  }).meta;
  return typeof meta?.skill_signature === "string"
    ? meta.skill_signature
    : undefined;
};

const keyedAnswerText = (question: Question): string => {
  if (question.itemType === "case_study") return "";
  if (
    question.itemType === "multiple_choice" ||
    question.itemType === "select_all" ||
    question.itemType === "ordered_response"
  ) {
    const correct = new Set(question.correct);
    return question.options
      .filter((option) => correct.has(option.id))
      .map((option) => option.en)
      .join(" ");
  }
  if (question.itemType === "fill_in_blank") {
    return question.blanks
      .flatMap((blank) => [
        ...(blank.acceptable ?? []),
        ...(blank.numeric ? [String(blank.numeric.value)] : []),
      ])
      .join(" ");
  }
  if (question.itemType === "matrix") {
    const columns = new Map(
      question.matrix.columns.map((column) => [column.id, column.en]),
    );
    return question.correct
      .flatMap((row) =>
        row.columnIds.map((columnId) => columns.get(columnId) ?? columnId),
      )
      .join(" ");
  }
  if (question.itemType === "highlight") {
    const correct = new Set(question.highlight.correct);
    return question.highlight.segments
      .filter((segment) => correct.has(segment.id))
      .map((segment) => segment.en)
      .join(" ");
  }
  return question.dropdowns
    .map((dropdown) => {
      const option = dropdown.options.find(
        (candidate) => candidate.id === dropdown.correct,
      );
      return option?.en ?? dropdown.correct;
    })
    .join(" ");
};

const flattenBank = (
  questions: Question[],
): Array<{ question: Question; path: string }> => {
  const flattened: Array<{ question: Question; path: string }> = [];
  questions.forEach((question, index) => {
    flattened.push({ question, path: `questions[${index}]` });
    if (question.itemType === "case_study") {
      question.caseStudy.questions.forEach((part, partIndex) => {
        flattened.push({
          question: part,
          path: `questions[${index}].caseStudy.questions[${partIndex}]`,
        });
      });
    }
  });
  return flattened;
};

const loadItems = async (bankPaths: readonly string[]): Promise<LoadedItem[]> => {
  const loaded = await Promise.all(
    bankPaths.map(async (bankPath) => {
      const raw = parseBankText(await readFile(bankPath, "utf8"));
      const result = validateBankObject(raw);
      if (!result.ok) {
        throw new Error(
          `${bankPath} failed validation:\n${result.reasons.join("\n")}`,
        );
      }
      const bank = basename(bankPath);
      return flattenBank(result.value.questions).map(
        ({ question, path }): LoadedItem => {
          const searchText = `${question.topic} ${question.stem.en}`;
          const currencyClusters = CURRENCY_RULES.filter(({ pattern }) =>
            pattern.test(searchText),
          ).map(({ cluster }) => cluster);
          return {
            id: question.id,
            bank,
            path,
            producer: producerFor(bank, question.id),
            provenance_tier: provenanceTierFor(question.id),
            topic: question.topic,
            normalized_topic: normalizeTopic(question.topic),
            item_type: question.itemType,
            skill_signature: getSkillSignature(question),
            currency_clusters: currencyClusters,
            question,
            searchText,
            tokens: tokenize(searchText),
            answerTokens: tokenize(keyedAnswerText(question)),
          };
        },
      );
    }),
  );
  return loaded.flat().sort((left, right) => left.id.localeCompare(right.id));
};

const groupBy = <T>(values: T[], keyFor: (value: T) => string) => {
  const groups = new Map<string, T[]>();
  values.forEach((value) => {
    const key = keyFor(value);
    groups.set(key, [...(groups.get(key) ?? []), value]);
  });
  return groups;
};

const buildPairMap = (items: LoadedItem[]) => {
  const pairMap = new Map<string, Set<string>>();
  const addPair = (left: string, right: string) => {
    pairMap.set(left, new Set([...(pairMap.get(left) ?? []), right]));
    pairMap.set(right, new Set([...(pairMap.get(right) ?? []), left]));
  };

  const topicGroups = groupBy(items, (item) => item.normalized_topic);
  topicGroups.forEach((group) => {
    if (group.length < 2 || group.length > 40) return;
    for (let leftIndex = 0; leftIndex < group.length; leftIndex += 1) {
      for (
        let rightIndex = leftIndex + 1;
        rightIndex < group.length;
        rightIndex += 1
      ) {
        const left = group[leftIndex];
        const right = group[rightIndex];
        const stemSimilarity = jaccard(left.tokens, right.tokens);
        const answerSimilarity = jaccard(left.answerTokens, right.answerTokens);
        if (stemSimilarity >= 0.28 || answerSimilarity >= 0.34) {
          addPair(left.id, right.id);
        }
      }
    }
  });

  const signatureGroups = groupBy(
    items.filter((item) => item.skill_signature),
    (item) => item.skill_signature ?? "",
  );
  signatureGroups.forEach((group) => {
    for (let leftIndex = 0; leftIndex < group.length; leftIndex += 1) {
      for (
        let rightIndex = leftIndex + 1;
        rightIndex < group.length;
        rightIndex += 1
      ) {
        addPair(group[leftIndex].id, group[rightIndex].id);
      }
    }
  });
  return pairMap;
};

export const buildSemanticLayerA = (items: LoadedItem[]) => {
  const pairMap = buildPairMap(items);
  const redundancyGroups = groupBy(
    items,
    (item) =>
      `${item.normalized_topic}\0${item.item_type}\0${item.skill_signature ?? ""}`,
  );
  const redundancyIds = new Set<string>();
  redundancyGroups.forEach((group) => {
    if (group.length >= 3) group.forEach((item) => redundancyIds.add(item.id));
  });

  const rows: SemanticQueueRow[] = [];
  items.forEach((item) => {
    item.currency_clusters.forEach((currencyCluster) => {
      const rule = CURRENCY_RULES.find(
        (candidate) => candidate.cluster === currencyCluster,
      );
      rows.push({
        ...inventoryFields(item),
        track: "currency",
        currency_cluster: currencyCluster,
        pair_with: [],
        routing_reasons: ["volatile-topic keyword match"],
        harm_rank:
          (rule?.harmRank ?? 0) + provenanceBonus(item.provenance_tier),
      });
    });

    const peers = [...(pairMap.get(item.id) ?? [])].sort();
    const routingReasons: string[] = [];
    if (peers.length > 0) routingReasons.push("topic/answer similarity pair");
    if (redundancyIds.has(item.id)) {
      routingReasons.push("redundancy cluster size >= 3");
    }
    if (routingReasons.length > 0) {
      rows.push({
        ...inventoryFields(item),
        track: "coherence",
        pair_with: peers,
        routing_reasons: routingReasons,
        harm_rank: 50 + provenanceBonus(item.provenance_tier),
      });
    }
  });

  const trackOrder: Record<SemanticTrack, number> = {
    currency: 0,
    coherence: 1,
  };
  rows.sort(
    (left, right) =>
      right.harm_rank - left.harm_rank ||
      trackOrder[left.track] - trackOrder[right.track] ||
      left.id.localeCompare(right.id) ||
      (left.currency_cluster ?? "").localeCompare(
        right.currency_cluster ?? "",
      ),
  );
  return {
    inventory: items.map(inventoryFields),
    rows,
  };
};

const inventoryFields = (item: LoadedItem): SemanticInventoryItem => ({
  id: item.id,
  bank: item.bank,
  path: item.path,
  producer: item.producer,
  provenance_tier: item.provenance_tier,
  topic: item.topic,
  normalized_topic: item.normalized_topic,
  item_type: item.item_type,
  ...(item.skill_signature
    ? { skill_signature: item.skill_signature }
    : {}),
  currency_clusters: item.currency_clusters,
});

const provenanceBonus = (tier: ProvenanceTier) =>
  tier === "high" ? 20 : tier === "medium" ? 10 : 0;

const countBy = <T extends string>(
  values: T[],
): Partial<Record<T, number>> => {
  const counts: Partial<Record<T, number>> = {};
  values.forEach((value) => {
    counts[value] = (counts[value] ?? 0) + 1;
  });
  return counts;
};

const toJsonl = (rows: unknown[]) =>
  `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`;

export const writeSemanticLayerA = async (
  bankPaths: readonly string[] = DEFAULT_BANKS,
  queuePath = DEFAULT_QUEUE,
  summaryPath = DEFAULT_SUMMARY,
) => {
  const output = buildSemanticLayerA(await loadItems(bankPaths));
  const summary = {
    methodology:
      "Deterministic routing only. Keyword and similarity matches are candidates, not clinical findings or verdicts.",
    banks: bankPaths.map((bankPath) => basename(bankPath)),
    inventory_count: output.inventory.length,
    queue_row_count: output.rows.length,
    unique_queued_items: new Set(output.rows.map((row) => row.id)).size,
    inventory_by_provenance: countBy(
      output.inventory.map((item) => item.provenance_tier),
    ),
    rows_by_track: countBy(output.rows.map((row) => row.track)),
    currency_rows_by_cluster: countBy(
      output.rows
        .filter((row) => row.track === "currency")
        .map((row) => row.currency_cluster as CurrencyCluster),
    ),
  };
  await Promise.all([
    mkdir(dirname(queuePath), { recursive: true }),
    mkdir(dirname(summaryPath), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(queuePath, toJsonl(output.rows), "utf8"),
    writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
  ]);
  return { ...output, summary };
};

const runCli = async () => {
  const result = await writeSemanticLayerA();
  console.log(
    `Wrote ${result.rows.length} Layer A queue rows covering ` +
      `${result.summary.unique_queued_items}/${result.inventory.length} graded items ` +
      `to ${DEFAULT_QUEUE}.`,
  );
};

if (fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await runCli();
}
