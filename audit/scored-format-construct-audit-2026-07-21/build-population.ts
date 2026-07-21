import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type JsonRecord = Record<string, unknown>;

const bankPath = "banks/gpt-canonical.json";
const outputPath = "audit/scored-format-construct-audit-2026-07-21/population.jsonl";

const families = [
  { pattern: /^gpt_fmtgap_2026_07_14_/, provenanceFamily: "FORMAT_GAP_2026_07_14", subBatch: "fmtgap" },
  { pattern: /^gpt_format7([abc])_/, provenanceFamily: "SCORED_FORMAT_BATCH_7", subBatch: "7" },
  { pattern: /^gpt_format8([abc])_/, provenanceFamily: "SCORED_FORMAT_BATCH_8", subBatch: "8" },
  { pattern: /^gpt_format9([abc])_/, provenanceFamily: "SCORED_FORMAT_BATCH_9", subBatch: "9" },
  { pattern: /^gpt_format10([abc])_/, provenanceFamily: "SCORED_FORMAT_BATCH_10", subBatch: "10" },
  { pattern: /^gpt_format11([abc])_/, provenanceFamily: "SCORED_FORMAT_BATCH_11", subBatch: "11" },
] as const;

const expectedFamilyCounts: Record<string, number> = {
  FORMAT_GAP_2026_07_14: 16,
  SCORED_FORMAT_BATCH_7: 17,
  SCORED_FORMAT_BATCH_8: 18,
  SCORED_FORMAT_BATCH_9: 18,
  SCORED_FORMAT_BATCH_10: 17,
  SCORED_FORMAT_BATCH_11: 18,
};

const expectedTypeCounts: Record<string, number> = {
  ordered_response: 23,
  dropdown_cloze: 9,
  fill_in_blank: 26,
  highlight: 24,
  bowtie: 21,
  select_all: 1,
};

const record = (value: unknown): JsonRecord => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Expected an object");
  }
  return value as JsonRecord;
};

const responseStructure = (question: JsonRecord): JsonRecord => {
  switch (question.itemType) {
    case "ordered_response":
    case "select_all":
      return { options: question.options };
    case "fill_in_blank":
      return {
        blanks: (question.blanks as JsonRecord[]).map(({ acceptable: _acceptable, numeric: _numeric, ...blank }) => blank),
      };
    case "highlight":
      return { segments: record(question.highlight).segments };
    case "bowtie": {
      const bowtie = record(question.bowtie);
      return {
        condition: record(bowtie.condition).tokens,
        actions: record(bowtie.actions).tokens,
        parameters: record(bowtie.parameters).tokens,
      };
    }
    case "dropdown_cloze":
      return {
        clozeStem: question.clozeStem,
        dropdowns: (question.dropdowns as JsonRecord[]).map(({ correct: _correct, ...dropdown }) => dropdown),
      };
    default:
      throw new Error(`Unexpected scoped item type: ${String(question.itemType)}`);
  }
};

const currentKey = (question: JsonRecord): JsonRecord => {
  switch (question.itemType) {
    case "ordered_response":
    case "select_all":
      return { correct: question.correct };
    case "fill_in_blank":
      return {
        blanks: (question.blanks as JsonRecord[]).map((blank) => ({
          id: blank.id,
          acceptable: blank.acceptable,
          numeric: blank.numeric,
        })),
      };
    case "highlight":
      return { correct: record(question.highlight).correct };
    case "bowtie": {
      const bowtie = record(question.bowtie);
      return {
        condition: record(bowtie.condition).correct,
        actions: record(bowtie.actions).correct,
        parameters: record(bowtie.parameters).correct,
      };
    }
    case "dropdown_cloze":
      return {
        dropdowns: (question.dropdowns as JsonRecord[]).map((dropdown) => ({
          id: dropdown.id,
          correct: dropdown.correct,
        })),
      };
    default:
      throw new Error(`Unexpected scoped item type: ${String(question.itemType)}`);
  }
};

const sourceMetadata = (question: JsonRecord): unknown => {
  const meta = record(question.meta ?? {});
  return meta.source ?? question.source ?? null;
};

const countBy = (values: string[]) =>
  values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});

const assertCounts = (label: string, actual: Record<string, number>, expected: Record<string, number>) => {
  const sortedEntries = (value: Record<string, number>) =>
    Object.entries(value).sort(([left], [right]) => left.localeCompare(right));
  if (JSON.stringify(sortedEntries(actual)) !== JSON.stringify(sortedEntries(expected))) {
    throw new Error(`${label} mismatch: ${JSON.stringify(actual)} expected ${JSON.stringify(expected)}`);
  }
};

const bankBytes = readFileSync(resolve(bankPath));
const bankSha256 = createHash("sha256").update(bankBytes).digest("hex");
const bank = record(JSON.parse(bankBytes.toString("utf8")));
const questions = bank.questions as JsonRecord[];

const selected = questions.flatMap((question, questionIndex) => {
  const id = String(question.id);
  const family = families.find(({ pattern }) => pattern.test(id));
  if (!family) return [];
  if (question.itemType === "case_study") throw new Error(`Matched case container: ${id}`);
  const letter = id.match(/^gpt_format(?:7|8|9|10|11)([abc])_/)?.[1]?.toUpperCase();
  return [{ question, questionIndex, family, subBatch: letter ? `${family.subBatch}${letter}` : family.subBatch }];
});

if (selected.length !== 104) throw new Error(`Population mismatch: ${selected.length} expected 104`);
const ids = selected.map(({ question }) => String(question.id));
if (new Set(ids).size !== ids.length) throw new Error("Duplicate stable ID in scoped population");

assertCounts(
  "Provenance family counts",
  countBy(selected.map(({ family }) => family.provenanceFamily)),
  expectedFamilyCounts,
);
assertCounts(
  "Item type counts",
  countBy(selected.map(({ question }) => String(question.itemType)).sort()),
  expectedTypeCounts,
);

for (const knownId of [
  "gpt_format11c_home_peak_flow_technique",
  "gpt_format11c_microcytic_anemia_localization",
  "gpt_format10c_occupational_sharps_hiv_pep_sequence",
  "gpt_format10b_hemodialysis_access_prompt_followup",
  "gpt_format7c_exercise_hypoglycemia_bowtie",
]) {
  if (!ids.includes(knownId)) throw new Error(`Known forcing ID absent: ${knownId}`);
}

const rows = selected.map(({ question, questionIndex, family, subBatch }, index) => ({
  populationIndex: index + 1,
  bankPath,
  bankSha256,
  questionIndex,
  questionPath: `questions[${questionIndex}]`,
  id: question.id,
  provenanceFamily: family.provenanceFamily,
  subBatch,
  itemType: question.itemType,
  category: question.category,
  topic: question.topic,
  difficulty: question.difficulty,
  ngnSkill: question.ngnSkill,
  stem: question.stem,
  responseStructure: responseStructure(question),
  currentKey: currentKey(question),
  rationale: question.rationale,
  testTakingStrategy: question.testTakingStrategy,
  glossary: question.glossary ?? [],
  sourceMetadata: sourceMetadata(question),
  completeItem: question,
}));

writeFileSync(resolve(outputPath), `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`, "utf8");
console.log(JSON.stringify({ outputPath, bankSha256, count: rows.length }));
