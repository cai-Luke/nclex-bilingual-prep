import type {
  CaseStudyQuestion,
  StandaloneQuestion,
} from "../../src/types";
import type { BiasBankInput, BiasReport } from "./non-mcq-bias-lib";

export type LayerBTask =
  | "case_inferability"
  | "distractor_plausibility"
  | "rationale_semantic_review";
export type RedactionVariant = "first_row_only" | "last_row_only" | null;

export type LayerBQueueRow = {
  audit_version: string;
  qid: string;
  parent_qid: string | null;
  source_bank: string;
  item_type:
    | "case_study"
    | "case_study_part"
    | "select_all"
    | "ordered_response"
    | "dropdown_cloze"
    | "matrix"
    | "highlight";
  layer_b_task: LayerBTask;
  triggering_layer_a_checks: string[];
  stem_en: string;
  options_or_rows_en: unknown[];
  correct_answer: unknown;
  rationale_en: string;
  redaction_variant: RedactionVariant;
  expected_result_schema: string;
};

export type LayerAArtifact = BiasReport & {
  layer_b_queue: LayerBQueueRow[];
};

export type LayerBResult = {
  qid: string;
  parent_qid: string | null;
  layer_b_task: LayerBTask;
  redaction_variant: RedactionVariant;
  verdict: "PASS" | "FAIL" | "REVIEW";
  confidence: "high" | "medium" | "low";
  quoted_evidence: Array<{
    location: "stem" | "option" | "row" | "exhibit" | "rationale";
    quote: string;
  }>;
  reason: string;
  recommended_fix_class: "MANUAL_REVIEW" | "REGENERATE" | "NONE";
};

export type LayerBSemanticFinding = LayerBResult & {
  source_bank: string;
  effective_verdict: "PASS" | "FAIL" | "REVIEW";
};

export type FinalBiasReport = {
  audit_version: string;
  config_hash: string;
  layer_a: {
    authority: "deterministic";
    records: BiasReport["records"];
  };
  layer_b: {
    authority: "model_judgment";
    complete: boolean;
    expected_rows: number;
    received_rows: number;
    findings: LayerBSemanticFinding[];
  };
};

const RESULT_SCHEMA =
  '{"qid":"string","parent_qid":"string|null","layer_b_task":"case_inferability|distractor_plausibility|rationale_semantic_review","redaction_variant":"first_row_only|last_row_only|null","verdict":"PASS|FAIL|REVIEW","confidence":"high|medium|low","quoted_evidence":[{"location":"stem|option|row|exhibit|rationale","quote":"string"}],"reason":"string","recommended_fix_class":"MANUAL_REVIEW|REGENERATE|NONE"}';

const TASKS = new Set<LayerBTask>([
  "case_inferability",
  "distractor_plausibility",
  "rationale_semantic_review",
]);
const VARIANTS = new Set<RedactionVariant>(["first_row_only", "last_row_only", null]);
const VERDICTS = new Set(["PASS", "FAIL", "REVIEW"]);
const CONFIDENCES = new Set(["high", "medium", "low"]);
const FIX_CLASSES = new Set(["MANUAL_REVIEW", "REGENERATE", "NONE"]);
const EVIDENCE_LOCATIONS = new Set(["stem", "option", "row", "exhibit", "rationale"]);

type ItemContext = {
  bank: string;
  parent: CaseStudyQuestion | null;
  question: StandaloneQuestion;
};

function queueKey(row: Pick<LayerBQueueRow, "qid" | "parent_qid" | "layer_b_task" | "redaction_variant">): string {
  return JSON.stringify([row.qid, row.parent_qid, row.layer_b_task, row.redaction_variant]);
}

function collectContexts(inputs: BiasBankInput[]): ItemContext[] {
  const contexts: ItemContext[] = [];
  for (const bank of [...inputs].sort((left, right) => left.id.localeCompare(right.id))) {
    for (const question of [...bank.questions].sort((left, right) => left.id.localeCompare(right.id))) {
      if (question.itemType === "case_study") {
        for (const part of question.caseStudy.questions) {
          contexts.push({ bank: bank.id, parent: question, question: part });
        }
      } else {
        contexts.push({ bank: bank.id, parent: null, question });
      }
    }
  }
  return contexts;
}

function caseEvidence(parent: CaseStudyQuestion): Array<{ id: string; title: string; content: string }> {
  return [
    ...parent.caseStudy.exhibits,
    ...(parent.caseStudy.stages ?? []).flatMap((stage) => stage.exhibits),
  ].map((exhibit) => ({
    id: exhibit.id,
    title: exhibit.title.en,
    content: exhibit.content.en,
  }));
}

function itemSurface(question: StandaloneQuestion): unknown[] {
  if (
    question.itemType === "multiple_choice" ||
    question.itemType === "select_all" ||
    question.itemType === "ordered_response"
  ) {
    return question.options.map((option) => ({ id: option.id, text: option.en }));
  }
  if (question.itemType === "dropdown_cloze") {
    return question.dropdowns.map((dropdown) => ({
      id: dropdown.id,
      options: dropdown.options.map((option) => ({ id: option.id, text: option.en })),
    }));
  }
  if (question.itemType === "matrix") {
    return [
      ...question.matrix.rows.map((row) => ({ kind: "row", id: row.id, text: row.en })),
      ...question.matrix.columns.map((column) => ({ kind: "column", id: column.id, text: column.en })),
    ];
  }
  if (question.itemType === "highlight") {
    return question.highlight.segments.map((segment) => ({
      id: segment.id,
      text: segment.en,
      selectable: segment.selectable === true,
    }));
  }
  return question.blanks.map((blank) => ({ id: blank.id, prompt: blank.prompt.en }));
}

function correctAnswer(question: StandaloneQuestion): unknown {
  if (
    question.itemType === "multiple_choice" ||
    question.itemType === "select_all" ||
    question.itemType === "ordered_response"
  ) return question.correct;
  if (question.itemType === "dropdown_cloze") {
    return question.dropdowns.map((dropdown) => ({ id: dropdown.id, correct: dropdown.correct }));
  }
  if (question.itemType === "matrix") return question.correct;
  if (question.itemType === "highlight") return question.highlight.correct;
  return question.blanks.map((blank) => ({
    id: blank.id,
    acceptable: blank.acceptable,
    numeric: blank.numeric,
  }));
}

function queueRow(
  context: ItemContext,
  task: LayerBTask,
  checks: string[],
  variant: RedactionVariant,
): LayerBQueueRow {
  const evidence = context.parent ? caseEvidence(context.parent) : [];
  const visibleEvidence =
    variant === "first_row_only"
      ? evidence.slice(0, 1)
      : variant === "last_row_only"
        ? evidence.slice(-1)
        : evidence;
  return {
    audit_version: "2.0.0",
    qid: context.question.id,
    parent_qid: context.parent?.id ?? null,
    source_bank: context.bank,
    item_type: context.parent ? "case_study_part" : context.question.itemType as LayerBQueueRow["item_type"],
    layer_b_task: task,
    triggering_layer_a_checks: [...checks].sort(),
    stem_en: context.question.stem.en,
    options_or_rows_en: [
      ...visibleEvidence.map((row) => ({ kind: "exhibit", ...row })),
      ...itemSurface(context.question),
    ],
    correct_answer: correctAnswer(context.question),
    rationale_en: context.question.rationale.correct.en,
    redaction_variant: variant,
    expected_result_schema: RESULT_SCHEMA,
  };
}

function queueSort(left: LayerBQueueRow, right: LayerBQueueRow): number {
  return left.source_bank.localeCompare(right.source_bank) ||
    (left.parent_qid ?? "").localeCompare(right.parent_qid ?? "") ||
    left.qid.localeCompare(right.qid) ||
    left.layer_b_task.localeCompare(right.layer_b_task) ||
    (left.redaction_variant ?? "").localeCompare(right.redaction_variant ?? "");
}

export function buildLayerBQueue(inputs: BiasBankInput[], report: BiasReport): LayerBQueueRow[] {
  const contexts = collectContexts(inputs);
  const contextByBankAndId = new Map(contexts.map((context) => [`${context.bank}\0${context.question.id}`, context]));
  const rows: LayerBQueueRow[] = [];

  for (const context of contexts.filter((item) => item.parent !== null)) {
    rows.push(queueRow(context, "case_inferability", [], "first_row_only"));
    rows.push(queueRow(context, "case_inferability", [], "last_row_only"));
  }

  const failedByItem = new Map<string, Set<string>>();
  for (const record of report.records) {
    if (record.bank === "global" || record.verdict !== "FAIL") continue;
    for (const qid of record.example_item_ids) {
      const key = `${record.bank}\0${qid}`;
      const checks = failedByItem.get(key) ?? new Set<string>();
      checks.add(record.check);
      failedByItem.set(key, checks);
    }
  }

  for (const [key, checks] of [...failedByItem.entries()].sort()) {
    const context = contextByBankAndId.get(key);
    if (!context) continue;
    const checkList = [...checks].sort();
    const rationaleChecks = checkList.filter((check) => check === "rationale_shuffle_hazard");
    const structuralChecks = checkList.filter((check) => check !== "rationale_shuffle_hazard");
    if (rationaleChecks.length > 0) {
      rows.push(queueRow(context, "rationale_semantic_review", rationaleChecks, null));
    }
    if (structuralChecks.length > 0) {
      rows.push(queueRow(context, "distractor_plausibility", structuralChecks, null));
    }
  }

  const deduped = new Map(rows.map((row) => [queueKey(row), row]));
  return [...deduped.values()].sort(queueSort);
}

export function formatLayerBPrompt(queueCount: number): string {
  return `# Non-MCQ Bias Audit Layer B Review

Review exactly ${queueCount} JSONL queue rows. Return JSONL only, one result per input row, in the same order.

For \`case_inferability\`, judge only whether the keyed answer is determinable from the single exhibit retained in \`options_or_rows_en\`. Do not use omitted exhibits or outside facts.

For \`distractor_plausibility\`, judge whether the displayed distractors/rows make the answer structurally obvious or implausibly easy. Layer A's statistical verdict is authoritative and must not be reconsidered.

For \`rationale_semantic_review\`, judge whether the rationale's positional wording can be replaced with content-based wording without changing the key. Do not perform the rewrite.

Required result schema:
\`\`\`json
${RESULT_SCHEMA}
\`\`\`

Rules:
- Do not rewrite items.
- Do not change answer keys.
- Do not invent missing evidence.
- Do not evaluate rows or exhibits absent from the queue row.
- Quote only exact text present in the queue row.
- A \`FAIL\` requires at least one grounded quote.
- Use \`REVIEW\` when evidence is ambiguous.
- Return no prose, Markdown, fences, headings, or commentary outside JSONL.
`;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseLayerBResults(text: string): unknown[] {
  const rows: unknown[] = [];
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    if (line.trim() === "") continue;
    try {
      rows.push(JSON.parse(line));
    } catch {
      throw new Error(`Layer B line ${index + 1} is not valid JSON.`);
    }
  }
  return rows;
}

function validateResult(raw: unknown, line: number): LayerBResult {
  if (!isObject(raw)) throw new Error(`Layer B line ${line} must be an object.`);
  const requireString = (field: string): string => {
    const value = raw[field];
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`Layer B line ${line} requires non-empty ${field}.`);
    }
    return value;
  };
  const qid = requireString("qid");
  const parent = raw.parent_qid;
  if (parent !== null && (typeof parent !== "string" || parent.trim() === "")) {
    throw new Error(`Layer B line ${line} has invalid parent_qid.`);
  }
  if (!TASKS.has(raw.layer_b_task as LayerBTask)) throw new Error(`Layer B line ${line} has invalid layer_b_task.`);
  if (!VARIANTS.has(raw.redaction_variant as RedactionVariant)) throw new Error(`Layer B line ${line} has invalid redaction_variant.`);
  if (!VERDICTS.has(raw.verdict as string)) throw new Error(`Layer B line ${line} has invalid verdict.`);
  if (!CONFIDENCES.has(raw.confidence as string)) throw new Error(`Layer B line ${line} has invalid confidence.`);
  if (!FIX_CLASSES.has(raw.recommended_fix_class as string)) throw new Error(`Layer B line ${line} has invalid recommended_fix_class.`);
  const reason = requireString("reason");
  if (!Array.isArray(raw.quoted_evidence)) throw new Error(`Layer B line ${line} requires quoted_evidence.`);
  const quotedEvidence = raw.quoted_evidence.map((entry, evidenceIndex) => {
    if (!isObject(entry) || !EVIDENCE_LOCATIONS.has(entry.location as string) ||
      typeof entry.quote !== "string" || entry.quote.trim() === "") {
      throw new Error(`Layer B line ${line} has invalid quoted_evidence[${evidenceIndex}].`);
    }
    return entry as LayerBResult["quoted_evidence"][number];
  });
  if (raw.verdict === "FAIL" && quotedEvidence.length === 0) {
    throw new Error(`Layer B line ${line} FAIL requires quoted_evidence.`);
  }
  if (raw.verdict === "FAIL" && raw.recommended_fix_class === "NONE") {
    throw new Error(`Layer B line ${line} FAIL requires MANUAL_REVIEW or REGENERATE.`);
  }
  return {
    qid,
    parent_qid: parent as string | null,
    layer_b_task: raw.layer_b_task as LayerBTask,
    redaction_variant: raw.redaction_variant as RedactionVariant,
    verdict: raw.verdict as LayerBResult["verdict"],
    confidence: raw.confidence as LayerBResult["confidence"],
    quoted_evidence: quotedEvidence,
    reason,
    recommended_fix_class: raw.recommended_fix_class as LayerBResult["recommended_fix_class"],
  };
}

export function mergeLayerBResults(
  artifact: LayerAArtifact,
  rawRows: unknown[],
  allowPartial = false,
): FinalBiasReport {
  const queueByKey = new Map(artifact.layer_b_queue.map((row) => [queueKey(row), row]));
  const results = rawRows.map((raw, index) => validateResult(raw, index + 1));
  const seen = new Set<string>();
  const findings: LayerBSemanticFinding[] = [];

  for (const result of results) {
    const key = queueKey(result);
    if (seen.has(key)) throw new Error(`Duplicate Layer B result for ${key}.`);
    seen.add(key);
    const queueRow = queueByKey.get(key);
    if (!queueRow) throw new Error(`Layer B result does not map to the queue: ${key}.`);
    const groundedText = JSON.stringify(queueRow);
    for (const evidence of result.quoted_evidence) {
      if (!groundedText.includes(evidence.quote)) {
        throw new Error(`Ungrounded quote for ${result.qid}: ${JSON.stringify(evidence.quote)}.`);
      }
    }
    const effectiveVerdict =
      result.verdict === "FAIL" && result.confidence === "low" ? "REVIEW" : result.verdict;
    findings.push({
      ...result,
      source_bank: queueRow.source_bank,
      effective_verdict: effectiveVerdict,
    });
  }

  const missing = [...queueByKey.keys()].filter((key) => !seen.has(key));
  if (!allowPartial && missing.length > 0) {
    throw new Error(`Layer B results are missing ${missing.length} queued row(s).`);
  }

  return {
    audit_version: artifact.audit_version,
    config_hash: artifact.config_hash,
    layer_a: {
      authority: "deterministic",
      records: artifact.records,
    },
    layer_b: {
      authority: "model_judgment",
      complete: missing.length === 0,
      expected_rows: artifact.layer_b_queue.length,
      received_rows: results.length,
      findings: findings.sort((left, right) =>
        left.source_bank.localeCompare(right.source_bank) ||
        (left.parent_qid ?? "").localeCompare(right.parent_qid ?? "") ||
        left.qid.localeCompare(right.qid) ||
        left.layer_b_task.localeCompare(right.layer_b_task) ||
        (left.redaction_variant ?? "").localeCompare(right.redaction_variant ?? ""),
      ),
    },
  };
}

export function formatFinalBiasReport(report: FinalBiasReport): string {
  const layerAFailures = report.layer_a.records.filter((record) => record.verdict === "FAIL");
  const lines = [
    "# Non-MCQ Bias Audit Final Report",
    "",
    "## Layer A — Deterministic",
    "",
    `- FAIL: ${layerAFailures.length}`,
    `- INSUFFICIENT: ${report.layer_a.records.filter((record) => record.verdict === "INSUFFICIENT").length}`,
    "- Authority: statistical findings remain unchanged by Layer B.",
    "",
    "## Layer B — Model Judgment",
    "",
    `- Complete: ${report.layer_b.complete ? "yes" : "no"}`,
    `- Results: ${report.layer_b.received_rows}/${report.layer_b.expected_rows}`,
  ];
  for (const finding of report.layer_b.findings) {
    lines.push(
      `- ${finding.effective_verdict}: ${finding.source_bank}/${finding.qid} ${finding.layer_b_task}` +
      `${finding.redaction_variant ? ` (${finding.redaction_variant})` : ""} — ${finding.recommended_fix_class}`,
    );
  }
  return `${lines.join("\n")}\n`;
}
