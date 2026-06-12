import assert from "node:assert/strict";
import type {
  CaseStudyQuestion,
  DropdownClozeQuestion,
  MatrixQuestion,
  Option,
  OrderedResponseQuestion,
  Question,
  SelectAllQuestion,
} from "../../src/types";
import {
  auditNonMcqBias,
  NON_MCQ_BIAS_CONFIG_HASH,
  type BiasRecord,
} from "../audit/non-mcq-bias-lib";
import {
  buildLayerBQueue,
  formatLayerBPrompt,
  mergeLayerBResults,
  parseLayerBResults,
  type LayerAArtifact,
  type LayerBResult,
} from "../audit/non-mcq-bias-layer-b";

const pair = (text: string) => ({ en: text, zh: text });
const options = (count: number, prefix = "o"): Option[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}${index}`,
    ...pair(`${prefix}${index}`),
  }));
const common = (id: string) => ({
  id,
  category: "Management of Care" as const,
  topic: "Fixture",
  difficulty: "medium" as const,
  stem: pair("Stem"),
  rationale: { correct: pair("Content-based rationale.") },
  testTakingStrategy: pair("Strategy"),
  glossary: [],
});

function sata(id: string, positions: number[], rationale = "Content-based rationale."): SelectAllQuestion {
  const itemOptions = options(5, `${id}-`);
  return {
    ...common(id),
    itemType: "select_all",
    options: itemOptions,
    correct: positions.map((position) => itemOptions[position].id),
    rationale: { correct: pair(rationale) },
  };
}

function ordered(id: string, permutation: number[]): OrderedResponseQuestion {
  const itemOptions = options(permutation.length, `${id}-`);
  return {
    ...common(id),
    itemType: "ordered_response",
    options: itemOptions,
    correct: permutation.map((position) => itemOptions[position].id),
  };
}

function dropdown(id: string, correctIndex: number): DropdownClozeQuestion {
  const itemOptions = options(4, `${id}-`);
  return {
    ...common(id),
    itemType: "dropdown_cloze",
    clozeStem: pair("{{blank}}"),
    dropdowns: [{ id: "blank", options: itemOptions, correct: itemOptions[correctIndex].id }],
  };
}

function matrix(id: string, correctColumnByRow: number[]): MatrixQuestion {
  const rows = options(correctColumnByRow.length, `${id}-r`);
  const columns = options(4, `${id}-c`);
  return {
    ...common(id),
    itemType: "matrix",
    matrix: { rows, columns, selectionMode: "single_per_row" },
    correct: rows.map((row, index) => ({
      rowId: row.id,
      columnIds: [columns[correctColumnByRow[index]].id],
    })),
  };
}

function find(records: BiasRecord[], bank: string, check: string): BiasRecord {
  const record = records.find((candidate) => candidate.bank === bank && candidate.check === check);
  assert(record, `missing ${bank}/${check}`);
  return record;
}

const biasedQuestions: Question[] = [
  ...Array.from({ length: 20 }, (_, index) =>
    sata(`sata-biased-${index}`, [0, 1], index === 0 ? "Option A is correct." : undefined)),
  ...Array.from({ length: 10 }, (_, index) => ordered(`ordered-biased-${index}`, [0, 1, 2, 3])),
  ...Array.from({ length: 20 }, (_, index) => dropdown(`dropdown-biased-${index}`, 0)),
  ...Array.from({ length: 10 }, (_, index) => matrix(`matrix-biased-${index}`, [0, 0, 0, 0])),
];
const biased = auditNonMcqBias([{ id: "biased", questions: biasedQuestions }]);
assert.equal(biased.config_hash, NON_MCQ_BIAS_CONFIG_HASH);
assert.equal(find(biased.records, "biased", "correct_option_position_n5").verdict, "FAIL");
assert.equal(find(biased.records, "biased", "correct_count_distribution").fix_class, "REGENERATE");
assert.equal(find(biased.records, "biased", "scramble_depth").verdict, "FAIL");
assert.equal(find(biased.records, "biased", "template_repetition").verdict, "FAIL");
assert.equal(find(biased.records, "biased", "correct_index_n4").verdict, "FAIL");
assert.equal(find(biased.records, "biased", "correct_column_n4").verdict, "FAIL");
assert.equal(find(biased.records, "biased", "all_rows_same_column").verdict, "FAIL");
assert.equal(find(biased.records, "biased", "rationale_shuffle_hazard").fix_class, "RATIONALE_REPAIR");
assert((find(biased.records, "biased", "correct_option_position_n5").p_value ?? 1) < 0.01);

const balancedDropdowns = Array.from({ length: 20 }, (_, index) =>
  dropdown(`dropdown-balanced-${index}`, index % 4));
const balancedMatrices = Array.from({ length: 20 }, (_, index) =>
  matrix(`matrix-balanced-${index}`, [index % 4, (index + 1) % 4, (index + 2) % 4, (index + 3) % 4]));
const balanced = auditNonMcqBias([{
  id: "balanced",
  questions: [...balancedDropdowns, ...balancedMatrices],
}]);
assert.equal(find(balanced.records, "balanced", "correct_index_n4").verdict, "PASS");
assert.equal(find(balanced.records, "balanced", "correct_column_n4").verdict, "PASS");
assert.equal(find(balanced.records, "balanced", "correct_row_n4").verdict, "PASS");
assert.equal(find(balanced.records, "balanced", "all_rows_same_column").verdict, "PASS");

const underpowered = auditNonMcqBias([{ id: "tiny", questions: [dropdown("tiny-dropdown", 0)] }]);
assert.equal(find(underpowered.records, "tiny", "correct_index_n4").verdict, "INSUFFICIENT");

const absent = auditNonMcqBias([{ id: "empty", questions: [] }]);
assert.equal(find(absent.records, "empty", "correct_option_position").verdict, "INSUFFICIENT");
assert.equal(find(absent.records, "empty", "correct_index").verdict, "INSUFFICIENT");
assert.equal(find(absent.records, "empty", "correct_column").verdict, "INSUFFICIENT");
assert.equal(find(absent.records, "empty", "correct_row").verdict, "INSUFFICIENT");

const topHazard = auditNonMcqBias([{
  id: "hazard",
  questions: [sata("top-hazard", [0, 1], "The top option is correct.")],
}]);
assert.equal(find(topHazard.records, "hazard", "rationale_shuffle_hazard").verdict, "FAIL");

const inherited = auditNonMcqBias([
  { id: "biased-bank", questions: Array.from({ length: 20 }, (_, index) => dropdown(`b-${index}`, 0)) },
  { id: "balanced-bank", questions: Array.from({ length: 380 }, (_, index) => dropdown(`p-${index}`, index % 4)) },
]);
const globalDropdown = find(inherited.records, "global", "correct_index_n4");
assert.equal(globalDropdown.verdict, "FAIL");
assert.deepEqual(globalDropdown.metrics.inherited_per_bank_failures, ["biased-bank"]);

const first = JSON.stringify(auditNonMcqBias([{ id: "biased", questions: biasedQuestions }]));
const second = JSON.stringify(auditNonMcqBias([{ id: "biased", questions: [...biasedQuestions].reverse() }]));
assert.equal(first, second);

const casePart = sata("case-part", [0, 1]);
const caseStudy: CaseStudyQuestion = {
  ...common("case-parent"),
  itemType: "case_study",
  caseStudy: {
    title: pair("Case"),
    exhibits: [
      { id: "ex1", title: pair("First exhibit"), content: pair("First grounded cue.") },
      { id: "ex2", title: pair("Last exhibit"), content: pair("Last grounded cue.") },
    ],
    questions: [casePart],
  },
};
const handoffInputs = [
  { id: "case-bank", questions: [caseStudy] },
  { id: "biased", questions: biasedQuestions },
];
const handoffReport = auditNonMcqBias(handoffInputs);
const queue = buildLayerBQueue(handoffInputs, handoffReport);
const reversedQueue = buildLayerBQueue([...handoffInputs].reverse(), handoffReport);
assert.equal(JSON.stringify(queue), JSON.stringify(reversedQueue));
assert(queue.some((row) =>
  row.qid === "case-part" &&
  row.layer_b_task === "case_inferability" &&
  row.redaction_variant === "first_row_only" &&
  JSON.stringify(row.options_or_rows_en).includes("First grounded cue.") &&
  !JSON.stringify(row.options_or_rows_en).includes("Last grounded cue.")
));
assert(queue.some((row) => row.layer_b_task === "distractor_plausibility"));
assert(queue.some((row) => row.layer_b_task === "rationale_semantic_review"));
const prompt = formatLayerBPrompt(queue.length);
assert(prompt.includes("Return JSONL only"));
assert(prompt.includes("Do not change answer keys"));

const artifact: LayerAArtifact = { ...handoffReport, layer_b_queue: queue };
const validResults: LayerBResult[] = queue.map((row, index) => ({
  qid: row.qid,
  parent_qid: row.parent_qid,
  layer_b_task: row.layer_b_task,
  redaction_variant: row.redaction_variant,
  verdict: index === 0 ? "FAIL" : "PASS",
  confidence: index === 0 ? "low" : "high",
  quoted_evidence: index === 0
    ? [{ location: "stem", quote: row.stem_en }]
    : [],
  reason: "Fixture judgment.",
  recommended_fix_class: index === 0 ? "MANUAL_REVIEW" : "NONE",
}));
const merged = mergeLayerBResults(artifact, validResults);
assert.equal(merged.layer_b.complete, true);
assert.equal(merged.layer_b.findings[0].effective_verdict, "REVIEW");
assert.equal(merged.layer_a.records, handoffReport.records);

assert.throws(
  () => mergeLayerBResults(artifact, validResults.slice(1)),
  /missing 1 queued row/,
);
assert.equal(mergeLayerBResults(artifact, validResults.slice(1), true).layer_b.complete, false);
assert.throws(
  () => mergeLayerBResults(artifact, [{ ...validResults[0], qid: "unknown" }, ...validResults.slice(1)]),
  /does not map to the queue/,
);
assert.throws(
  () => mergeLayerBResults(artifact, [{ ...validResults[0], quoted_evidence: [] }, ...validResults.slice(1)]),
  /FAIL requires quoted_evidence/,
);
assert.throws(
  () => mergeLayerBResults(artifact, [{
    ...validResults[0],
    recommended_fix_class: "NONE",
  }, ...validResults.slice(1)]),
  /FAIL requires MANUAL_REVIEW or REGENERATE/,
);
assert.throws(
  () => mergeLayerBResults(artifact, [{
    ...validResults[0],
    quoted_evidence: [{ location: "stem", quote: "invented evidence" }],
  }, ...validResults.slice(1)]),
  /Ungrounded quote/,
);
assert.throws(() => parseLayerBResults('{"qid":\n'), /not valid JSON/);

console.log("non-mcq bias tests passed");
