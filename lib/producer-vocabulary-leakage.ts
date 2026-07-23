import { readFile, readdir } from "node:fs/promises";
import { basename, join } from "node:path";
import { dedupeSelectedFilePaths } from "./selected-file-paths";
import { parseBankText } from "../src/bankImport";
import { validateBankObject } from "../src/schema";
import type { BankEnvelope, Question } from "../src/types";

export type LeakageLanguage = "en" | "zh" | "undetermined";
export type LeakageTier = "stem" | "testTakingStrategy" | "rationale_other" | "other";

export type ProducerVocabularyPattern = {
  id: string;
  language: "en" | "zh";
  source: string;
  flags: string;
};

export const PRODUCER_VOCABULARY_LEXICON = {
  highConfidence: [
    { id: "source-pinned", language: "en", source: "\\bsource[- ]pinned\\b", flags: "giu" },
    { id: "source-supported", language: "en", source: "\\bsource[- ]supported\\b", flags: "giu" },
    { id: "closed-world", language: "en", source: "\\bclosed[- ]world\\b", flags: "giu" },
    { id: "cross-lane", language: "en", source: "\\bcross(?:es|ed|ing)?\\s+(?:(?:the|a|this|that|supplied)\\s+){0,2}lane\\b", flags: "giu" },
    { id: "evaluation/escalation-lane", language: "en", source: "\\bevaluation\\s*\\/\\s*escalation lane\\b", flags: "giu" },
    { id: "escalation-lane", language: "en", source: "\\bescalation lane\\b", flags: "giu" },
    { id: "resolution-lane", language: "en", source: "\\bresolution lane\\b", flags: "giu" },
    { id: "acidosis-resolution-lane", language: "en", source: "\\bacidosis[- ]resolution lane\\b", flags: "giu" },
    { id: "teaching-lane", language: "en", source: "\\bteaching lane\\b", flags: "giu" },
    { id: "closed-scenario", language: "en", source: "\\bclosed scenario\\b", flags: "giu" },
    { id: "closed-information-pathway", language: "en", source: "\\bclosed information (?:pathway|channel)\\b", flags: "giu" },
    { id: "source-limited-zh", language: "zh", source: "来源限定", flags: "gu" },
    { id: "source-supported-zh", language: "zh", source: "来源支持", flags: "gu" },
    { id: "closed-form-escalation-rule-zh", language: "zh", source: "封闭式升级规则", flags: "gu" },
    { id: "closed-form-sequence-zh", language: "zh", source: "封闭式顺序", flags: "gu" },
    { id: "closed-form-pathway-zh", language: "zh", source: "封闭式流程", flags: "gu" },
    { id: "closed-form-plan-zh", language: "zh", source: "封闭式(?:停用)?方案", flags: "gu" },
    { id: "closed-rule-zh", language: "zh", source: "封闭规则", flags: "gu" },
    { id: "closed-pathway-zh", language: "zh", source: "封闭流程", flags: "gu" },
    { id: "closed-information-channel-zh", language: "zh", source: "封闭的信息通道", flags: "gu" },
    { id: "closed-scenario-zh", language: "zh", source: "封闭情境", flags: "gu" },
    { id: "closed-condition-thresholds-zh", language: "zh", source: "封闭条件阈值", flags: "gu" },
  ] satisfies ProducerVocabularyPattern[],
  bareLane: { id: "bare-lane", language: "en", source: "\\blane\\b", flags: "giu" } satisfies ProducerVocabularyPattern,
} as const;

export type LearnerFacingField = {
  topLevelId: string;
  embeddedQuestionId?: string;
  itemType: string;
  path: string;
  language: LeakageLanguage;
  text: string;
};

export type LeakageOccurrence = LearnerFacingField & {
  bank: string;
  confidence: "HIGH" | "ANNEX";
  patternId: string;
  matchedPhrase: string;
  matchIndex: number;
  tier: LeakageTier;
};

const SKIP_SUBTREES = new Set(["meta", "_compileManifest", "audit", "provenance", "correct", "acceptable", "numeric"]);
const SKIP_STRING_KEYS = new Set([
  "id", "refId", "optionId", "segmentId", "rowId", "columnId", "dropdownId", "blankId",
  "stageId", "answerableAfterStageId", "schemaVersion", "itemType", "category", "topic", "difficulty",
  "ngnSkill", "kind", "source", "tier", "type", "selectionMode", "direction", "bound", "context",
  "population", "exam",
]);

const languageFor = (key: string, text: string): LeakageLanguage => {
  if (key === "en" || key === "termEn") return "en";
  if (key === "zh" || key === "termZh" || key === "defZh") return "zh";
  return /[\u3400-\u9fff]/u.test(text) ? "zh" : "undetermined";
};

const pathPart = (key: string | number): string => typeof key === "number" ? `[${key}]` : key;
const appendPath = (base: string, key: string | number): string =>
  typeof key === "number" ? `${base}[${key}]` : base ? `${base}.${key}` : key;

/**
 * Traverse rendered prose while excluding provenance, answer keys, IDs, enums,
 * and non-rendered validation/configuration strings. Embedded case questions
 * retain their parent identity and receive their own embedded identity.
 */
export function collectLearnerFacingFields(question: Question): LearnerFacingField[] {
  const fields: LearnerFacingField[] = [];

  const walk = (
    value: unknown,
    path: string,
    topLevelId: string,
    embeddedQuestionId: string | undefined,
    itemType: string,
    parentKey = "",
  ): void => {
    if (typeof value === "string") {
      if (!SKIP_STRING_KEYS.has(parentKey)) {
        fields.push({ topLevelId, embeddedQuestionId, itemType, path, language: languageFor(parentKey, value), text: value });
      }
      return;
    }
    if (value === null || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach((entry, index) => walk(entry, appendPath(path, index), topLevelId, embeddedQuestionId, itemType, parentKey));
      return;
    }

    const record = value as Record<string, unknown>;
    for (const [key, child] of Object.entries(record)) {
      if (SKIP_SUBTREES.has(key) && !(key === "correct" && path.endsWith("rationale"))) continue;
      const childPath = appendPath(path, key);
      if (key === "questions" && path.endsWith("caseStudy") && Array.isArray(child)) {
        child.forEach((nested, index) => {
          const nestedRecord = nested as Record<string, unknown>;
          const nestedId = typeof nestedRecord.id === "string" ? nestedRecord.id : undefined;
          const nestedType = typeof nestedRecord.itemType === "string" ? nestedRecord.itemType : "unknown";
          walk(nested, `${childPath}[${index}]`, topLevelId, nestedId, nestedType, pathPart(index));
        });
        continue;
      }
      walk(child, childPath, topLevelId, embeddedQuestionId, itemType, key);
    }
  };

  walk(question, "", question.id, undefined, question.itemType);
  return fields;
}

const tierForPath = (path: string): LeakageTier => {
  if (/(^|\.)stem\.(en|zh)$/.test(path)) return "stem";
  if (/(^|\.)testTakingStrategy\.(en|zh)$/.test(path)) return "testTakingStrategy";
  if (/(^|\.)rationale\./.test(path)) return "rationale_other";
  return "other";
};

const matchesFor = (text: string, pattern: ProducerVocabularyPattern): Array<{ phrase: string; index: number }> => {
  const regex = new RegExp(pattern.source, pattern.flags);
  return [...text.matchAll(regex)].map((match) => ({ phrase: match[0], index: match.index ?? 0 }));
};

export function scanQuestionForProducerVocabulary(question: Question, bank: string): LeakageOccurrence[] {
  const occurrences: LeakageOccurrence[] = [];
  for (const field of collectLearnerFacingFields(question)) {
    const highCandidates: LeakageOccurrence[] = [];
    for (const pattern of PRODUCER_VOCABULARY_LEXICON.highConfidence) {
      if (pattern.language !== field.language && field.language !== "undetermined") continue;
      for (const match of matchesFor(field.text, pattern)) {
        highCandidates.push({ ...field, bank, confidence: "HIGH", patternId: pattern.id, matchedPhrase: match.phrase, matchIndex: match.index, tier: tierForPath(field.path) });
      }
    }
    highCandidates.sort((a, b) => a.matchIndex - b.matchIndex || b.matchedPhrase.length - a.matchedPhrase.length);
    const acceptedHigh: LeakageOccurrence[] = [];
    for (const candidate of highCandidates) {
      const candidateEnd = candidate.matchIndex + candidate.matchedPhrase.length;
      const overlaps = acceptedHigh.some((entry) => {
        const entryEnd = entry.matchIndex + entry.matchedPhrase.length;
        return candidate.matchIndex < entryEnd && entry.matchIndex < candidateEnd;
      });
      if (!overlaps) acceptedHigh.push(candidate);
    }
    occurrences.push(...acceptedHigh);
    const highLaneIndexes = new Set(
      acceptedHigh
        .filter((entry) => /lane/i.test(entry.matchedPhrase))
        .flatMap((entry) => Array.from({ length: entry.matchedPhrase.length }, (_, offset) => entry.matchIndex + offset)),
    );
    for (const match of matchesFor(field.text, PRODUCER_VOCABULARY_LEXICON.bareLane)) {
      if (highLaneIndexes.has(match.index)) continue;
      occurrences.push({ ...field, bank, confidence: "ANNEX", patternId: "bare-lane", matchedPhrase: match.phrase, matchIndex: match.index, tier: tierForPath(field.path) });
    }
  }
  return occurrences;
}

export type BundledLeakageScan = {
  canonicalItemsScanned: number;
  banksScanned: number;
  occurrences: LeakageOccurrence[];
};

export async function scanBundledBanks(directory = "banks"): Promise<BundledLeakageScan> {
  const files = (await readdir(directory)).filter((file) => file.endsWith(".json")).sort();
  const occurrences: LeakageOccurrence[] = [];
  let canonicalItemsScanned = 0;

  for (const file of files) {
    const raw = parseBankText(await readFile(join(directory, file), "utf8"));
    const validated = validateBankObject(raw, { rejectUnknownKeys: true, requireMeta: true });
    if (!validated.ok) throw new Error(`${file}: ${validated.reasons.join("; ")}`);
    canonicalItemsScanned += validated.value.questions.length;
    for (const question of validated.value.questions) occurrences.push(...scanQuestionForProducerVocabulary(question, basename(file)));
  }
  return { canonicalItemsScanned, banksScanned: files.length, occurrences };
}

export async function scanSelectedBanks(files: string[]): Promise<BundledLeakageScan> {
  const selected = dedupeSelectedFilePaths(files);
  const occurrences: LeakageOccurrence[] = [];
  let canonicalItemsScanned = 0;

  for (const { resolvedPath, displayPath } of selected) {
    try {
      const raw = parseBankText(await readFile(resolvedPath, "utf8"));
      const validated = validateBankObject(raw, { rejectUnknownKeys: true, requireMeta: true });
      if (!validated.ok) throw new Error(validated.reasons.join("; "));
      canonicalItemsScanned += validated.value.questions.length;
      for (const question of validated.value.questions) {
        occurrences.push(...scanQuestionForProducerVocabulary(question, displayPath));
      }
    } catch (error) {
      throw new Error(`${displayPath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return { canonicalItemsScanned, banksScanned: selected.length, occurrences };
}

export function distinctItemKey(entry: Pick<LeakageOccurrence, "bank" | "topLevelId" | "embeddedQuestionId">): string {
  return `${entry.bank}::${entry.topLevelId}::${entry.embeddedQuestionId ?? ""}`;
}
