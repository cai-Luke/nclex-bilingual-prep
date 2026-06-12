import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const ENUMS = {
  flag_type: ["visual_replace_candidate", "visual_parallel_candidate", "human_review", "redundancy_candidate"],
  priority: ["high", "medium", "low"],
  visual_value: ["essential", "helpful", "none"],
  item_type: [
    "multiple_choice",
    "select_all",
    "ordered_response",
    "fill_in_blank",
    "matrix",
    "dropdown_cloze",
    "case_study",
    "case_study_part",
  ],
  target_renderer: [
    "rhythm_strip",
    "capnography",
    "vitals_trend",
    "lab_trend",
    "mar",
    "io_record",
    "medication_label",
    "device_screen",
    "fetal_monitoring",
    "burn_map",
  ],
  answer_key_trust: ["high", "medium", "low", "not_assessed"],
  ambiguity_risk: ["low", "medium", "high"],
  recommended_action: [
    "replace_text_item_with_visual",
    "add_parallel_visual_item",
    "human_review_before_action",
    "possible_duplicate_review",
    "leave_after_review",
  ],
  evidence_location: ["stem", "option", "row", "column", "dropdown", "blank", "exhibit", "rationale.correct", "rationale.byChoice"],
  risk_tier: ["low", "medium", "high"],
  content_lane_status: ["open", "blocked", "unknown"],
} as const;

const REQUIRED_ROW_FIELDS = [
  "qid",
  "item_type",
  "category",
  "flag_type",
  "priority",
  "visual_value",
  "quoted_evidence",
  "answer_key_trust",
  "ambiguity_risk",
  "recommended_action",
  "action_rationale",
  "needs_human_review",
  "risk_tier",
  "content_lane_status",
] as const;

const BANNED_PHRASES = [
  "finding described",
  "wound characteristics mentioned",
  "i&o records mentioned",
  "device settings described",
  "rationale is coherent",
  "key and rationale align",
  "near-duplicate stem logic based on text similarity",
  "random sample for review",
  "visual adds realism",
  "text item remains useful",
  "random sample",
  "text similarity only",
  "renderer-keyed cluster",
  "cluster integrity",
  "cluster_integrity",
  "characteristics mentioned",
  "stem logic",
  "generic similarity",
] as const;

const GENERIC_VISUAL_PHRASES = [
  "would be helpful",
  "adds visual interest",
  "supports learning",
  "could be shown visually",
] as const;

const DECORATIVE_LANGUAGE = [
  "optional",
  "illustrative",
  "decorative",
  "merely helpful",
  "nice to have",
] as const;

const PROSE_KEYS = /(?:rationale|justification|evidence|claim|note|notes|reason|why|shared_concept|description)$/i;
const ID_KEY = /(?:^|_)(?:id|ids|qid|qids)$/i;
const COUNT_KEY = /(?:^|_)(?:count|counts|total|totals|emitted|read)$/i;
const ENUM_KEYS = new Set([
  "flag_type",
  "priority",
  "visual_value",
  "item_type",
  "target_renderer",
  "answer_key_trust",
  "ambiguity_risk",
  "recommended_action",
  "risk_tier",
  "content_lane_status",
  "source_spec_version",
  "location",
  "status",
]);

export type SweepIssue = {
  line?: number;
  qid?: string;
  check: string;
  detail: string;
};

export type SummaryDivergence = {
  field: string;
  reported: boolean;
  computed: boolean;
};

export type ValidatorReport = {
  status: "usable" | "usable_with_warnings" | "rejected";
  manifest: string;
  rows_total: number;
  rows_failed: number;
  hard_failures: SweepIssue[];
  warnings: SweepIssue[];
  recomputed_counts: {
    rows_emitted: number;
    by_flag_type: Record<string, number>;
    by_renderer: Record<string, number>;
  };
  summary_divergences: SummaryDivergence[];
};

type ManifestRow = Record<string, unknown>;
type ParsedRow = { line: number; row: ManifestRow };
type BankEntry = { text: string };
type BankIndex = Map<string, BankEntry>;

export type ValidateSweepOptions = {
  manifestPath: string;
  summaryPath: string;
  bankPaths?: string[];
  strict?: boolean;
  reportPath?: string;
  writeReport?: boolean;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const normalized = (value: string) => value.trim().toLocaleLowerCase();

const containsPhrase = (value: string, phrases: readonly string[]) => {
  const haystack = normalized(value);
  return phrases.find((phrase) => haystack.includes(normalized(phrase)));
};

const addIssue = (
  issues: SweepIssue[],
  check: string,
  detail: string,
  parsed?: ParsedRow,
) => {
  issues.push({
    ...(parsed ? { line: parsed.line } : {}),
    ...(parsed && nonEmptyString(parsed.row.qid) ? { qid: parsed.row.qid } : {}),
    check,
    detail,
  });
};

const stableCountMap = (entries: Iterable<[string, number]>) =>
  Object.fromEntries([...entries].sort(([left], [right]) => left.localeCompare(right)));

const increment = (map: Map<string, number>, key: string) =>
  map.set(key, (map.get(key) ?? 0) + 1);

const mapsEqual = (left: Record<string, number>, right: unknown) => {
  if (!isRecord(right)) return false;
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  for (const key of keys) {
    const leftValue = left[key] ?? 0;
    const rightValue = right[key] ?? 0;
    if (typeof rightValue !== "number" || leftValue !== rightValue) return false;
  }
  return true;
};

const scanProse = (
  value: unknown,
  onString: (path: string, value: string) => void,
  path = "",
  parentKey = "",
) => {
  if (typeof value === "string") {
    if (
      PROSE_KEYS.test(parentKey) &&
      !ID_KEY.test(parentKey) &&
      !COUNT_KEY.test(parentKey) &&
      !ENUM_KEYS.has(parentKey)
    ) {
      onString(path, value);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanProse(entry, onString, `${path}[${index}]`, parentKey));
    return;
  }
  if (!isRecord(value)) return;
  for (const [key, entry] of Object.entries(value)) {
    if (key === "the_tell") continue;
    if (key === "quote" && path.includes("quoted_evidence")) continue;
    const childPath = path ? `${path}.${key}` : key;
    scanProse(entry, onString, childPath, key);
  }
};

const validateRequiredFields = (parsed: ParsedRow, failures: SweepIssue[]) => {
  for (const field of REQUIRED_ROW_FIELDS) {
    if (!(field in parsed.row) || parsed.row[field] === null || parsed.row[field] === undefined) {
      addIssue(failures, "F2", `required field ${field} is missing or null`, parsed);
    }
  }

  const { row } = parsed;
  if (row.target_renderer !== null && row.target_renderer !== undefined && !nonEmptyString(row.renderer_justification)) {
    addIssue(failures, "F2", "renderer_justification is required when target_renderer is non-null", parsed);
  }
  if (row.item_type === "case_study_part" && !nonEmptyString(row.parent_qid)) {
    addIssue(failures, "F2", "parent_qid is required for case_study_part", parsed);
  }
  if (row.flag_type === "visual_replace_candidate" && !nonEmptyString(row.the_tell)) {
    addIssue(failures, "F2", "the_tell is required for visual_replace_candidate", parsed);
  }
  if (row.flag_type === "redundancy_candidate") {
    if (!Array.isArray(row.possible_duplicate_qids)) {
      addIssue(failures, "F2", "possible_duplicate_qids is required for redundancy_candidate", parsed);
    }
    if (!nonEmptyString(row.duplicate_claim)) {
      addIssue(failures, "F2", "duplicate_claim is required for redundancy_candidate", parsed);
    }
  }
};

const validateEnums = (parsed: ParsedRow, failures: SweepIssue[]) => {
  const enumFields: Array<[keyof typeof ENUMS, unknown]> = [
    ["flag_type", parsed.row.flag_type],
    ["priority", parsed.row.priority],
    ["visual_value", parsed.row.visual_value],
    ["item_type", parsed.row.item_type],
    ["answer_key_trust", parsed.row.answer_key_trust],
    ["ambiguity_risk", parsed.row.ambiguity_risk],
    ["recommended_action", parsed.row.recommended_action],
    ["risk_tier", parsed.row.risk_tier],
    ["content_lane_status", parsed.row.content_lane_status],
  ];
  for (const [field, value] of enumFields) {
    if (!(ENUMS[field] as readonly unknown[]).includes(value)) {
      addIssue(failures, "F3", `${field} has invalid value ${JSON.stringify(value)}`, parsed);
    }
  }
  const renderer = parsed.row.target_renderer;
  if (renderer !== null && renderer !== undefined && !(ENUMS.target_renderer as readonly unknown[]).includes(renderer)) {
    addIssue(failures, "F3", `target_renderer has invalid value ${JSON.stringify(renderer)}`, parsed);
  }
};

const validateEvidence = (parsed: ParsedRow, failures: SweepIssue[], warnings: SweepIssue[]) => {
  const evidence = parsed.row.quoted_evidence;
  if (!Array.isArray(evidence) || evidence.length === 0) {
    addIssue(failures, "F5", "quoted_evidence must be a non-empty array", parsed);
    return;
  }
  evidence.forEach((entry, index) => {
    if (!isRecord(entry)) {
      addIssue(failures, "F5", `quoted_evidence[${index}] must be an object`, parsed);
      return;
    }
    if (!(ENUMS.evidence_location as readonly unknown[]).includes(entry.location)) {
      addIssue(failures, "F5", `quoted_evidence[${index}].location is invalid`, parsed);
    }
    if (!nonEmptyString(entry.quote)) {
      addIssue(failures, "F5", `quoted_evidence[${index}].quote must be non-empty`, parsed);
    } else if (entry.quote.trim().length < 8) {
      addIssue(warnings, "W3", `quoted_evidence[${index}].quote is under 8 characters`, parsed);
    }
  });
};

const validateCrossFields = (
  parsed: ParsedRow,
  failures: SweepIssue[],
  pediatricBurnMap: boolean,
) => {
  const { row } = parsed;
  if (row.flag_type === "visual_replace_candidate") {
    const checks: Array<[boolean, string]> = [
      [row.visual_value === "essential", "visual_value must be essential"],
      [row.recommended_action === "replace_text_item_with_visual", "recommended_action must be replace_text_item_with_visual"],
      [row.target_renderer !== null && row.target_renderer !== undefined, "target_renderer must be non-null"],
      [nonEmptyString(row.the_tell), "the_tell must be non-empty"],
      [row.answer_key_trust === "high", "answer_key_trust must be high"],
    ];
    checks.forEach(([ok, detail]) => {
      if (!ok) addIssue(failures, "F7", `visual_replace_candidate: ${detail}`, parsed);
    });
  }
  if (row.flag_type === "visual_parallel_candidate") {
    if (row.recommended_action !== "add_parallel_visual_item") {
      addIssue(failures, "F7", "visual_parallel_candidate must use add_parallel_visual_item", parsed);
    }
    if (row.target_renderer === null || row.target_renderer === undefined) {
      addIssue(failures, "F7", "visual_parallel_candidate requires target_renderer", parsed);
    }
  }
  if (row.flag_type === "redundancy_candidate") {
    if (!Array.isArray(row.possible_duplicate_qids) || row.possible_duplicate_qids.length < 1) {
      addIssue(failures, "F7", "redundancy_candidate requires at least one possible_duplicate_qid", parsed);
    }
    if (!nonEmptyString(row.duplicate_claim)) {
      addIssue(failures, "F7", "redundancy_candidate requires duplicate_claim", parsed);
    }
  }
  if (row.target_renderer !== null && row.target_renderer !== undefined && !nonEmptyString(row.renderer_justification)) {
    addIssue(failures, "F7", "non-null target_renderer requires renderer_justification", parsed);
  }
  if (nonEmptyString(row.the_tell)) {
    const quotes = Array.isArray(row.quoted_evidence)
      ? row.quoted_evidence
          .filter(isRecord)
          .map((entry) => entry.quote)
          .filter(nonEmptyString)
      : [];
    if (!quotes.some((quote) => normalized(quote).includes(normalized(row.the_tell as string)))) {
      addIssue(failures, "F7", "the_tell was not found in quoted_evidence", parsed);
    }
  }
  if (row.content_lane_status === "blocked" && row.recommended_action === "replace_text_item_with_visual") {
    addIssue(failures, "F7", "blocked content lane cannot replace a text item with a visual", parsed);
  }
  if (pediatricBurnMap && row.recommended_action === "replace_text_item_with_visual") {
    addIssue(failures, "F7", "pediatric burn_map content is blocked and cannot replace a text item", parsed);
  }
};

const validateVisualNecessity = (parsed: ParsedRow, failures: SweepIssue[], warnings: SweepIssue[]) => {
  const { row } = parsed;
  if (row.flag_type !== "visual_replace_candidate" && row.flag_type !== "visual_parallel_candidate") return;
  if (!nonEmptyString(row.renderer_justification)) {
    addIssue(failures, "F9", "visual candidate requires a load-bearing renderer_justification", parsed);
    return;
  }
  const generic = containsPhrase(row.renderer_justification, GENERIC_VISUAL_PHRASES);
  if (generic) {
    addIssue(failures, "F9", `renderer_justification contains generic claim "${generic}"`, parsed);
  }
  const decorative = containsPhrase(row.renderer_justification, DECORATIVE_LANGUAGE);
  if (decorative) {
    addIssue(warnings, "W7", `renderer_justification suggests decorative use: "${decorative}"`, parsed);
  }
};

const hasExplicitLowRiskJustification = (row: ManifestRow) =>
  nonEmptyString(row.action_rationale) &&
  /\blow[- ]risk\b.{0,80}\b(?:because|since|given|straightforward|nonclinical|non-clinical)\b/i.test(row.action_rationale);

const addRiskWarnings = (parsed: ParsedRow, warnings: SweepIssue[]) => {
  const { row } = parsed;
  if (
    row.content_lane_status === "blocked" &&
    ["replace_text_item_with_visual", "add_parallel_visual_item"].includes(String(row.recommended_action))
  ) {
    addIssue(warnings, "W8_BLOCKED_LANE_ACTION", "blocked content lane still proposes a visual action", parsed);
  }
  if (
    ["fetal_monitoring", "medication_label", "device_screen"].includes(String(row.target_renderer)) &&
    row.risk_tier !== "high"
  ) {
    addIssue(warnings, "W7_RISK_TIER_SUSPICIOUS", `${row.target_renderer} should default to high risk`, parsed);
  }
  if (
    ["mar", "io_record", "burn_map", "rhythm_strip"].includes(String(row.target_renderer)) &&
    row.risk_tier === "low" &&
    !hasExplicitLowRiskJustification(row)
  ) {
    addIssue(warnings, "W7_RISK_TIER_SUSPICIOUS", `${row.target_renderer} should default to at least medium risk`, parsed);
  }
};

const addTemplatingWarnings = (rows: ParsedRow[], warnings: SweepIssue[]) => {
  for (const field of ["item_type", "answer_key_trust", "ambiguity_risk", "priority"] as const) {
    const counts = new Map<string, number>();
    rows.forEach(({ row }) => {
      if (typeof row[field] === "string") increment(counts, row[field]);
    });
    if (rows.length === 0 || counts.size === 0) continue;
    const [value, count] = [...counts.entries()].sort((left, right) => right[1] - left[1])[0];
    const concentration = count / rows.length;
    if (counts.size === 1 || concentration >= 0.95) {
      addIssue(warnings, "W1", `${field} concentrated: ${Math.round(concentration * 100)}% ${JSON.stringify(value)}`);
    }
  }
  const notAssessed = rows.filter(({ row }) => row.answer_key_trust === "not_assessed").length;
  if (rows.length > 0 && notAssessed / rows.length > 0.25) {
    addIssue(warnings, "W2", `answer_key_trust=not_assessed on ${notAssessed}/${rows.length} rows`);
  }
};

const addBoilerplateWarnings = (value: unknown, warnings: SweepIssue[], parsed?: ParsedRow) => {
  scanProse(value, (path, text) => {
    if (
      /\b(?:wording|lexical|surface)[ -]similarity\b/i.test(text) ||
      /\bshared (?:wording|characteristics?)\b/i.test(text) ||
      /\bsimilar (?:stem|phrasing|language)\b/i.test(text)
    ) {
      addIssue(warnings, "W4", `near-boilerplate prose at ${path}`, parsed);
    }
  });
};

const collectQuestionText = (value: unknown): string => {
  const strings: string[] = [];
  const visit = (entry: unknown) => {
    if (typeof entry === "string") strings.push(entry);
    else if (Array.isArray(entry)) entry.forEach(visit);
    else if (isRecord(entry)) Object.values(entry).forEach(visit);
  };
  visit(value);
  return strings.join(" ");
};

const indexQuestion = (question: unknown, index: BankIndex) => {
  if (!isRecord(question)) return;
  if (nonEmptyString(question.id)) {
    index.set(question.id, { text: collectQuestionText(question) });
  }
  const caseStudy = question.caseStudy;
  if (isRecord(caseStudy) && Array.isArray(caseStudy.questions)) {
    caseStudy.questions.forEach((part) => indexQuestion(part, index));
  }
};

const loadBankIndex = async (paths: string[]): Promise<BankIndex> => {
  const index: BankIndex = new Map();
  for (const path of paths) {
    const raw = JSON.parse(await readFile(path, "utf8")) as unknown;
    if (isRecord(raw) && Array.isArray(raw.questions)) {
      raw.questions.forEach((question) => indexQuestion(question, index));
    } else if (Array.isArray(raw)) {
      raw.forEach((question) => indexQuestion(question, index));
    } else {
      throw new Error(`${path} is not a bank envelope or question array`);
    }
  }
  return index;
};

const isPediatricText = (text: string) => {
  if (/\b(?:infant|toddler|child|pediatric|paediatric|adolescent|newborn|neonate)\b/i.test(text)) return true;
  for (const match of text.matchAll(/\b(\d{1,2})\s*(?:years?|yrs?)\s*old\b/gi)) {
    if (Number(match[1]) < 18) return true;
  }
  for (const match of text.matchAll(/\b(\d{1,3})\s*months?\s*old\b/gi)) {
    if (Number(match[1]) < 216) return true;
  }
  return false;
};

const addBankWarnings = (
  rows: ParsedRow[],
  bank: BankIndex,
  warnings: SweepIssue[],
  pediatricRows: Set<number>,
) => {
  rows.forEach((parsed) => {
    const { row } = parsed;
    if (nonEmptyString(row.qid) && !bank.has(row.qid)) {
      addIssue(warnings, "W5", `qid ${row.qid} was not found in supplied banks`, parsed);
    }
    if (Array.isArray(row.possible_duplicate_qids)) {
      row.possible_duplicate_qids.forEach((qid) => {
        if (nonEmptyString(qid) && !bank.has(qid)) {
          addIssue(warnings, "W5", `possible duplicate qid ${qid} was not found in supplied banks`, parsed);
        }
      });
    }
    if (row.target_renderer === "burn_map" && nonEmptyString(row.qid)) {
      const entry = bank.get(row.qid);
      if (entry && isPediatricText(entry.text)) {
        pediatricRows.add(parsed.line);
        if (row.content_lane_status !== "blocked") {
          addIssue(warnings, "W9_POSSIBLE_PEDIATRIC_BURN_MAP", "pediatric burn_map should declare content_lane_status=blocked", parsed);
        }
      }
    }
  });
};

const gateMappings = (
  failures: SweepIssue[],
  warnings: SweepIssue[],
  bankSupplied: boolean,
): Record<string, boolean | undefined> => {
  const noFailure = (check: string) => !failures.some((issue) => issue.check === check);
  const noWarning = (check: string) => !warnings.some((issue) => issue.check === check);
  return {
    parse_valid: noFailure("F1"),
    jsonl_valid: noFailure("F1"),
    required_fields_present: noFailure("F2"),
    all_required_fields_present: noFailure("F2"),
    enum_valid: noFailure("F3"),
    needs_human_review_all_true: noFailure("F4"),
    quoted_evidence_present: noFailure("F5"),
    all_rows_have_quotes: noFailure("F5"),
    banned_phrases_absent: noFailure("F6"),
    cross_field_consistency: noFailure("F7"),
    counts_reconcile: noFailure("F8"),
    visual_necessity_grounded: noFailure("F9"),
    no_generic_justifications: noFailure("F9"),
    no_text_similarity_only_clusters: noFailure("F6") && noWarning("W4"),
    cluster_integrity: noFailure("F6") && noWarning("W4"),
    no_dangling_qids: bankSupplied ? noWarning("W5") : undefined,
  };
};

const inspectReportedGates = (
  summary: Record<string, unknown>,
  mappings: Record<string, boolean | undefined>,
  warnings: SweepIssue[],
  divergences: SummaryDivergence[],
) => {
  for (const containerName of ["gate_results", "global_gate_results"]) {
    const container = summary[containerName];
    if (!isRecord(container)) continue;
    for (const [gateName, reported] of Object.entries(container)) {
      if (typeof reported !== "boolean") continue;
      const computed = mappings[gateName];
      if (computed === undefined) {
        addIssue(warnings, "W6_UNKNOWN_GATE", `${containerName}.${gateName} has no validator mapping`);
      } else if (reported !== computed) {
        divergences.push({ field: `${containerName}.${gateName}`, reported, computed });
        addIssue(warnings, "W6", `${containerName}.${gateName} reported ${reported} but computed ${computed}`);
      }
    }
  }
};

export const validateSweep = async (options: ValidateSweepOptions): Promise<ValidatorReport> => {
  const failures: SweepIssue[] = [];
  const warnings: SweepIssue[] = [];
  const divergences: SummaryDivergence[] = [];
  const parsedRows: ParsedRow[] = [];

  const manifestText = await readFile(options.manifestPath, "utf8");
  let rowsTotal = 0;
  manifestText.split(/\r?\n/).forEach((text, index) => {
    if (text.trim().length === 0) return;
    rowsTotal += 1;
    const line = index + 1;
    try {
      const value = JSON.parse(text) as unknown;
      if (!isRecord(value)) {
        addIssue(failures, "F1", "line must parse as a JSON object", { line, row: {} });
      } else {
        parsedRows.push({ line, row: value });
      }
    } catch (error) {
      addIssue(failures, "F1", `invalid JSON: ${error instanceof Error ? error.message : String(error)}`, { line, row: {} });
    }
  });

  let summary: Record<string, unknown> = {};
  try {
    const parsed = JSON.parse(await readFile(options.summaryPath, "utf8")) as unknown;
    if (!isRecord(parsed)) {
      addIssue(failures, "F1", "summary.json must parse as a JSON object");
    } else {
      summary = parsed;
    }
  } catch (error) {
    addIssue(failures, "F1", `summary.json is invalid: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (!nonEmptyString(summary.source_spec_version)) {
    addIssue(failures, "F2", "summary required field source_spec_version is missing, null, or empty");
  }

  let bank: BankIndex | undefined;
  if (options.bankPaths?.length) {
    bank = await loadBankIndex(options.bankPaths);
  }
  const pediatricRows = new Set<number>();
  if (bank) addBankWarnings(parsedRows, bank, warnings, pediatricRows);

  parsedRows.forEach((parsed) => {
    validateRequiredFields(parsed, failures);
    validateEnums(parsed, failures);
    if (parsed.row.needs_human_review !== true) {
      addIssue(failures, "F4", "needs_human_review must be true", parsed);
    }
    validateEvidence(parsed, failures, warnings);
    scanProse(parsed.row, (path, text) => {
      const phrase = containsPhrase(text, BANNED_PHRASES);
      if (phrase) addIssue(failures, "F6", `banned phrase "${phrase}" found at ${path}`, parsed);
    });
    validateCrossFields(parsed, failures, pediatricRows.has(parsed.line));
    validateVisualNecessity(parsed, failures, warnings);
    addRiskWarnings(parsed, warnings);
    addBoilerplateWarnings(parsed.row, warnings, parsed);
  });

  scanProse(summary, (path, text) => {
    const phrase = containsPhrase(text, BANNED_PHRASES);
    if (phrase) addIssue(failures, "F6", `banned phrase "${phrase}" found in summary at ${path}`);
  });
  addBoilerplateWarnings(summary, warnings);
  addTemplatingWarnings(parsedRows, warnings);

  const byFlag = new Map<string, number>();
  const byRenderer = new Map<string, number>();
  parsedRows.forEach(({ row }) => {
    if (typeof row.flag_type === "string") increment(byFlag, row.flag_type);
    const renderer = row.target_renderer === null || row.target_renderer === undefined
      ? "null"
      : String(row.target_renderer);
    increment(byRenderer, renderer);
  });
  const recomputed = {
    rows_emitted: parsedRows.length,
    by_flag_type: stableCountMap(byFlag),
    by_renderer: stableCountMap(byRenderer),
  };

  if (summary.rows_emitted !== recomputed.rows_emitted) {
    addIssue(failures, "F8", `rows_emitted reported ${JSON.stringify(summary.rows_emitted)} but recomputed ${recomputed.rows_emitted}`);
  }
  if (!mapsEqual(recomputed.by_flag_type, summary.counts_by_flag_type)) {
    addIssue(failures, "F8", "counts_by_flag_type does not match manifest");
  }
  if (!mapsEqual(recomputed.by_renderer, summary.counts_by_renderer)) {
    addIssue(failures, "F8", "counts_by_renderer does not match manifest");
  }

  const mappings = gateMappings(failures, warnings, Boolean(bank));
  inspectReportedGates(summary, mappings, warnings, divergences);

  const reportFailures = failures.map((issue) => ({
    line: issue.line ?? 0,
    qid: issue.qid ?? (issue.line ? "(unknown)" : "(summary)"),
    check: issue.check,
    detail: issue.detail,
  }));
  const failedLines = new Set(reportFailures.flatMap((issue) => issue.line > 0 ? [issue.line] : []));
  const rejected = failures.length > 0 || (options.strict === true && warnings.length > 0);
  const report: ValidatorReport = {
    status: rejected ? "rejected" : warnings.length > 0 ? "usable_with_warnings" : "usable",
    manifest: options.manifestPath,
    rows_total: rowsTotal,
    rows_failed: failedLines.size,
    hard_failures: reportFailures,
    warnings,
    recomputed_counts: recomputed,
    summary_divergences: divergences,
  };

  if (options.writeReport !== false) {
    await writeFile(options.reportPath ?? "validator_report.json", `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
  return report;
};

export const printSweepReport = (report: ValidatorReport) => {
  console.log(`[${report.status.toUpperCase()}] ${basename(report.manifest)}`);
  console.log(`${report.rows_total} rows; ${report.hard_failures.length} hard failure(s); ${report.warnings.length} warning(s)`);
  report.hard_failures.forEach((issue) => {
    const location = issue.line ? ` line ${issue.line}${issue.qid ? ` (${issue.qid})` : ""}` : "";
    console.log(`- ${issue.check}${location}: ${issue.detail}`);
  });
  report.warnings.forEach((issue) => {
    const location = issue.line ? ` line ${issue.line}${issue.qid ? ` (${issue.qid})` : ""}` : "";
    console.log(`- ${issue.check}${location}: ${issue.detail}`);
  });
};

export const resolveSweepPath = (path: string) => resolve(process.cwd(), path);
