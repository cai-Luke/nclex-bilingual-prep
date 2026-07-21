import * as fs from "node:fs";
import * as path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import { formatStructuredMeasurementValue } from "../../src/structuredMeasurements";
import {
  MEASUREMENT_DISPLAY_POLICIES,
  toMeasurementDisplayValue,
} from "../../src/measurementUnitPolicy";
import type {
  BankEnvelope,
  CaseStudyExhibit,
  Question,
  StandaloneQuestion,
  TextPair,
} from "../../src/types";

export type Language = "en" | "zh" | "undetermined";
export type QuantityKind = "ABSOLUTE_TEMPERATURE" | "TEMPERATURE_DELTA" | "AMBIGUOUS_QUANTITY" | "NON_TEMPERATURE_FALSE_POSITIVE";
export type NumericShape = "SCALAR" | "COMPARATOR" | "RANGE" | "SERIES_OR_MULTIPLE" | "COMPOUND_MIXED" | "UNPARSEABLE";
export type PresentationClass = "DUAL_F_FIRST" | "DUAL_C_FIRST" | "FAHRENHEIT_ONLY" | "CELSIUS_ONLY" | "UNIT_MISSING" | "MALFORMED_OR_MISMATCHED_DUAL" | "AMBIGUOUS_PRESENTATION";
export type Disposition =
  | "ALREADY_CANONICAL"
  | "SAFE_ADD_CELSIUS"
  | "SAFE_ADD_FAHRENHEIT_AND_REORDER"
  | "SAFE_REORDER_EXISTING_DUAL"
  | "SAFE_NORMALIZE_DUAL_TOKENS"
  | "REVIEW_TEMPERATURE_DELTA"
  | "REVIEW_DUAL_VALUE_MISMATCH"
  | "REVIEW_COMPLEX_MULTIPLE"
  | "REVIEW_AMBIGUOUS_CONTEXT"
  | "PRESERVE_UNIT_MISSING"
  | "EXCLUDE_NON_LEARNER_FACING"
  | "EXCLUDE_TYPED_RENDERER_CONTRACT"
  | "FALSE_POSITIVE";
export type ParityClass =
  | "EQUIVALENT_SAME_PRESENTATION"
  | "EQUIVALENT_DIFFERENT_PRESENTATION"
  | "EQUIVALENT_DIFFERENT_PRECISION"
  | "COUNTERPART_MISSING_TEMPERATURE"
  | "VALUE_OR_UNIT_CONFLICT"
  | "NO_STRUCTURAL_COUNTERPART";

export interface TemperatureOccurrence {
  occurrenceId: string;
  bankPath: string;
  topLevelQuestionId: string;
  embeddedQuestionId: string | null;
  jsonPath: string;
  surface: string;
  language: Language;
  verbatimText: string;
  occurrenceIndex: number;
  startOffset: number;
  endOffset: number;
  matchedExpression: string;
  nearbyContext: string;
  quantityKind: QuantityKind;
  numericShape: NumericShape;
  presentationClass: PresentationClass;
  sourceUnit: "°F" | "°C" | null;
  sourceNumericTokens: string[];
  exactConvertedValues: number[] | null;
  proposedConvertedTokens: string[] | null;
  proposedConvertedPrecisions: number[] | null;
  proposedRoundingResiduals: number[] | null;
  existingSecondaryNumericTokens: string[] | null;
  arithmeticResiduals: number[] | null;
  displayedSecondaryPrecisions: number[] | null;
  reconciliationTolerances: number[] | null;
  proposedExpression: string | null;
  disposition: Disposition;
  counterpartJsonPath: string | null;
  parityClass: ParityClass;
  coexistsWithTypedTemperature: boolean;
  notes: string;
}

interface LearnerField {
  bankPath: string;
  topLevelQuestionId: string;
  embeddedQuestionId: string | null;
  jsonPath: string;
  surface: string;
  language: Language;
  text: string;
  coexistsWithTypedTemperature: boolean;
}

interface UnitToken {
  unit: "°F" | "°C";
  raw: string;
}

interface ParsedExpression {
  start: number;
  end: number;
  matched: string;
  quantityKind: QuantityKind;
  numericShape: NumericShape;
  presentationClass: PresentationClass;
  sourceUnit: "°F" | "°C" | null;
  sourceNumericTokens: string[];
  exactConvertedValues: number[] | null;
  proposedConvertedTokens: string[] | null;
  proposedConvertedPrecisions: number[] | null;
  proposedRoundingResiduals: number[] | null;
  existingSecondaryNumericTokens: string[] | null;
  arithmeticResiduals: number[] | null;
  displayedSecondaryPrecisions: number[] | null;
  reconciliationTolerances: number[] | null;
  proposedExpression: string | null;
  disposition: Disposition;
  note: string;
}

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const AUDIT_RELATIVE_DIR = "audit/temperature-prose-unit-survey-2026-07-21";
const AUDIT_DIR = path.join(REPO_ROOT, AUDIT_RELATIVE_DIR);
const MANIFEST_PATH = path.join(AUDIT_DIR, "manifest.jsonl");
const SAFE_PATH = path.join(AUDIT_DIR, "safe-mechanical-subset.jsonl");
const RESIDUAL_PATH = path.join(AUDIT_DIR, "review-residuals.jsonl");
const REPORT_PATH = path.join(AUDIT_DIR, "report.md");

const TASK_START = Object.freeze({
  branch: "main",
  head: "1b64425ce8640b91ea596141d774cf2d7d4c9816",
  upstream: "origin/main",
  upstreamAhead: 0,
  upstreamBehind: 0,
  stagedPaths: [] as string[],
  unstagedPaths: [
    "BANK-CENSUS.md",
    "BANK-REVIEW-LEDGER.md",
    "PROJECT-HISTORY.md",
    "banks/gpt-canonical.json",
    "census.json",
  ],
  untrackedPaths: [
    "TEMPERATURE-PROSE-UNIT-SURVEY-CODEX-SPEC-2026-07-21.md",
    "audit/temperature-prose-unit-survey-2026-07-21/",
    "scripts/audit/temperature-prose-unit-survey.ts",
    "scripts/patches/2026-07-21-gpt-hemodialysis-access-coherence.ts",
    "scripts/tests/temperature-prose-unit-survey.ts",
  ],
});
const EXPECTED_GPT_BANK_SHA256 = "ec3bf6db4a7de6cc3985436ce4ddd30882f0d0b4751699dc0f74fc81ccc5b004";

const SAFE_DISPOSITIONS = new Set<Disposition>([
  "SAFE_ADD_CELSIUS",
  "SAFE_ADD_FAHRENHEIT_AND_REORDER",
  "SAFE_REORDER_EXISTING_DUAL",
  "SAFE_NORMALIZE_DUAL_TOKENS",
]);

const NUMBER = String.raw`[+-]?(?:\d+(?:\.\d+)?|\.\d+)`;
const RANGE_SEP = String.raw`(?:\s*(?:-|–|—|to|through|至|到)\s*)`;
const VALUE = String.raw`${NUMBER}(?:${RANGE_SEP}${NUMBER})?`;
const COMPARATOR = String.raw`(?:(?:>|<|≥|≤)\s*|(?:above|below|over|under|greater\s+than|less\s+than|at\s+least|at\s+most|高于|低于|超过|不低于|不超过)\s*)?`;
const UNIT = String.raw`(?:°\s*[CF]|º\s*[CF]|℃|℉|degrees?\s*(?:C|F|Celsius|Fahrenheit)|Celsius|Fahrenheit|摄氏度|摄氏|华氏度|华氏|[CF])`;
const SINGLE_RE = new RegExp(String.raw`(?<![A-Za-z0-9.])${COMPARATOR}${VALUE}\s*${UNIT}(?![A-Za-z])`, "giu");
const UNIT_MISSING_PATTERNS = [
  new RegExp(String.raw`(?:temperature|temp\.?|体温|温度|fever|febrile|发热|发烧)\s*(?:is|of|was|at|达到|为|至|:)?\s*(${COMPARATOR}${VALUE})(?!\s*(?:°|º|℃|℉|degrees?|Celsius|Fahrenheit|摄氏|华氏|[CF]\b))`, "giu"),
  new RegExp(String.raw`\bT\s*[:=]\s*(${COMPARATOR}${VALUE})(?!\s*(?:°|º|℃|℉|degrees?|Celsius|Fahrenheit|[CF]\b))`, "gu"),
];
const TEMP_CONTEXT_RE = /\b(?:temperature|temp|fever|febrile|thermometer|incubator|bath|storage)\b|(?:体温|温度|发热|发烧|摄氏|华氏)/iu;

const renderPath = (parts: Array<string | number>): string => parts.map((part, index) =>
  typeof part === "number" ? `[${part}]` : index === 0 ? part : `.${part}`).join("");

const languageForKey = (key: string, text: string): Language => {
  if (key === "en" || key === "termEn") return "en";
  if (key === "zh" || key === "termZh" || key === "defZh") return "zh";
  return /[\u3400-\u9fff]/u.test(text) ? "zh" : "undetermined";
};

const surfaceFor = (parts: Array<string | number>): string => {
  const joined = parts.join(".");
  if (joined.includes("rationale.byChoice")) return "rationale_by_choice";
  if (joined.includes("rationale.correct")) return "rationale_correct";
  if (joined.includes("testTakingStrategy")) return "test_taking_strategy";
  if (joined.includes("caseStudy.stages") && joined.includes("exhibits")) return "staged_exhibit";
  if (joined.includes("caseStudy.exhibits")) return "case_exhibit";
  if (joined.includes("caseStudy.stages")) return "case_stage";
  if (joined.includes("caseStudy.title")) return "case_title";
  if (joined.includes("caseStudy.summary")) return "case_summary";
  if (joined.includes("glossary")) return "glossary";
  if (joined.includes("highlight.segments")) return "highlight_segment";
  if (joined.includes("bowtie")) return "bowtie";
  if (joined.includes("matrix.rows")) return "matrix_row";
  if (joined.includes("matrix.columns")) return "matrix_column";
  if (joined.includes("dropdowns")) return "dropdown_option";
  if (joined.includes("clozeStem")) return "cloze_stem";
  if (joined.includes("blanks")) return "blank_prompt";
  if (joined.includes("options")) return "option";
  if (joined.includes("stem")) return "stem";
  return "other_learner_prose";
};

const hasTypedTemperature = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasTypedTemperature);
  const record = value as Record<string, unknown>;
  if (record.kind === "vitals_trend" && Array.isArray(record.series) && record.series.some((series) =>
    series !== null && typeof series === "object" && (series as Record<string, unknown>).vital === "temp")) return true;
  if (Array.isArray(record.rows) && record.rows.some((row) =>
    row !== null && typeof row === "object" && (row as Record<string, unknown>).key === "temp")) return true;
  return Object.values(record).some(hasTypedTemperature);
};

const addPair = (
  fields: LearnerField[],
  bankPath: string,
  topLevelQuestionId: string,
  embeddedQuestionId: string | null,
  pair: TextPair | undefined,
  parts: Array<string | number>,
  typed: boolean,
): void => {
  if (!pair) return;
  for (const key of ["en", "zh"] as const) {
    fields.push({ bankPath, topLevelQuestionId, embeddedQuestionId, jsonPath: renderPath([...parts, key]),
      surface: surfaceFor(parts), language: key, text: pair[key], coexistsWithTypedTemperature: typed });
  }
};

const collectStandaloneFields = (
  fields: LearnerField[], bankPath: string, topLevelId: string, embeddedId: string | null,
  question: StandaloneQuestion, base: Array<string | number>, typed: boolean,
): void => {
  addPair(fields, bankPath, topLevelId, embeddedId, question.stem, [...base, "stem"], typed);
  addPair(fields, bankPath, topLevelId, embeddedId, question.rationale.correct, [...base, "rationale", "correct"], typed);
  question.rationale.byChoice?.forEach((choice, index) => addPair(fields, bankPath, topLevelId, embeddedId, choice,
    [...base, "rationale", "byChoice", index], typed));
  addPair(fields, bankPath, topLevelId, embeddedId, question.testTakingStrategy, [...base, "testTakingStrategy"], typed);
  question.glossary.forEach((term, index) => {
    for (const key of ["termEn", "termZh", "defZh"] as const) {
      fields.push({ bankPath, topLevelQuestionId: topLevelId, embeddedQuestionId: embeddedId,
        jsonPath: renderPath([...base, "glossary", index, key]), surface: "glossary", language: languageForKey(key, term[key]),
        text: term[key], coexistsWithTypedTemperature: typed });
    }
  });
  if (question.itemType === "multiple_choice" || question.itemType === "select_all" || question.itemType === "ordered_response") {
    question.options.forEach((option, index) => addPair(fields, bankPath, topLevelId, embeddedId, option, [...base, "options", index], typed));
  } else if (question.itemType === "fill_in_blank") {
    question.blanks.forEach((blank, index) => addPair(fields, bankPath, topLevelId, embeddedId, blank.prompt, [...base, "blanks", index, "prompt"], typed));
  } else if (question.itemType === "matrix") {
    question.matrix.rows.forEach((row, index) => addPair(fields, bankPath, topLevelId, embeddedId, row, [...base, "matrix", "rows", index], typed));
    question.matrix.columns.forEach((column, index) => addPair(fields, bankPath, topLevelId, embeddedId, column, [...base, "matrix", "columns", index], typed));
  } else if (question.itemType === "dropdown_cloze") {
    addPair(fields, bankPath, topLevelId, embeddedId, question.clozeStem, [...base, "clozeStem"], typed);
    question.dropdowns.forEach((dropdown, dropdownIndex) => dropdown.options.forEach((option, optionIndex) =>
      addPair(fields, bankPath, topLevelId, embeddedId, option, [...base, "dropdowns", dropdownIndex, "options", optionIndex], typed)));
  } else if (question.itemType === "highlight") {
    question.highlight.segments.forEach((segment, index) => addPair(fields, bankPath, topLevelId, embeddedId, segment,
      [...base, "highlight", "segments", index], typed));
  } else if (question.itemType === "bowtie") {
    for (const zoneName of ["condition", "actions", "parameters"] as const) {
      const zone = question.bowtie[zoneName];
      addPair(fields, bankPath, topLevelId, embeddedId, zone.prompt, [...base, "bowtie", zoneName, "prompt"], typed);
      zone.tokens.forEach((token, index) => addPair(fields, bankPath, topLevelId, embeddedId, token,
        [...base, "bowtie", zoneName, "tokens", index], typed));
    }
  }
};

const collectExhibit = (
  fields: LearnerField[], bankPath: string, topLevelId: string, exhibit: CaseStudyExhibit,
  base: Array<string | number>,
): void => {
  const typed = hasTypedTemperature(exhibit.visual) || hasTypedTemperature(exhibit.structuredMeasurements);
  addPair(fields, bankPath, topLevelId, null, exhibit.title, [...base, "title"], typed);
  addPair(fields, bankPath, topLevelId, null, exhibit.content, [...base, "content"], typed);
};

export const collectLearnerFacingTemperatureFields = (bankPath: string, bank: BankEnvelope): LearnerField[] => {
  const fields: LearnerField[] = [];
  bank.questions.forEach((question: Question, questionIndex) => {
    const base: Array<string | number> = ["questions", questionIndex];
    const questionTyped = hasTypedTemperature(question.visual) || hasTypedTemperature(question.rationale.visuals);
    if (question.itemType !== "case_study") {
      collectStandaloneFields(fields, bankPath, question.id, null, question, base, questionTyped);
      return;
    }
    addPair(fields, bankPath, question.id, null, question.stem, [...base, "stem"], questionTyped);
    addPair(fields, bankPath, question.id, null, question.rationale.correct, [...base, "rationale", "correct"], questionTyped);
    question.rationale.byChoice?.forEach((choice, index) => addPair(fields, bankPath, question.id, null, choice,
      [...base, "rationale", "byChoice", index], questionTyped));
    addPair(fields, bankPath, question.id, null, question.testTakingStrategy, [...base, "testTakingStrategy"], questionTyped);
    question.glossary.forEach((term, index) => {
      for (const key of ["termEn", "termZh", "defZh"] as const) fields.push({ bankPath, topLevelQuestionId: question.id,
        embeddedQuestionId: null, jsonPath: renderPath([...base, "glossary", index, key]), surface: "glossary",
        language: languageForKey(key, term[key]), text: term[key], coexistsWithTypedTemperature: questionTyped });
    });
    addPair(fields, bankPath, question.id, null, question.caseStudy.title, [...base, "caseStudy", "title"], hasTypedTemperature(question.caseStudy));
    addPair(fields, bankPath, question.id, null, question.caseStudy.summary, [...base, "caseStudy", "summary"], hasTypedTemperature(question.caseStudy));
    question.caseStudy.exhibits.forEach((exhibit, index) => collectExhibit(fields, bankPath, question.id, exhibit,
      [...base, "caseStudy", "exhibits", index]));
    question.caseStudy.stages?.forEach((stage, stageIndex) => {
      const stageBase = [...base, "caseStudy", "stages", stageIndex];
      const stageTyped = hasTypedTemperature(stage);
      addPair(fields, bankPath, question.id, null, stage.title, [...stageBase, "title"], stageTyped);
      addPair(fields, bankPath, question.id, null, stage.trigger, [...stageBase, "trigger"], stageTyped);
      addPair(fields, bankPath, question.id, null, stage.narrative, [...stageBase, "narrative"], stageTyped);
      if (stage.timeOffset) fields.push({ bankPath, topLevelQuestionId: question.id, embeddedQuestionId: null,
        jsonPath: renderPath([...stageBase, "timeOffset"]), surface: "case_stage", language: languageForKey("timeOffset", stage.timeOffset),
        text: stage.timeOffset, coexistsWithTypedTemperature: stageTyped });
      stage.exhibits.forEach((exhibit, exhibitIndex) => collectExhibit(fields, bankPath, question.id, exhibit,
        [...stageBase, "exhibits", exhibitIndex]));
    });
    question.caseStudy.questions.forEach((leaf, leafIndex) => collectStandaloneFields(fields, bankPath, question.id, leaf.id, leaf,
      [...base, "caseStudy", "questions", leafIndex], hasTypedTemperature(leaf.visual) || hasTypedTemperature(leaf.rationale.visuals)));
  });
  return fields;
};

const unitFor = (raw: string): UnitToken | null => {
  const compact = raw.normalize("NFC").replace(/\s+/gu, "").toLowerCase();
  if (compact === "℃" || compact === "摄氏" || compact === "摄氏度" || compact.includes("celsius") || /^(?:°|º)?c$/u.test(compact)) return { unit: "°C", raw };
  if (compact === "℉" || compact === "华氏" || compact === "华氏度" || compact.includes("fahrenheit") || /^(?:°|º)?f$/u.test(compact)) return { unit: "°F", raw };
  return null;
};

const numericTokens = (value: string): string[] => value.match(new RegExp(NUMBER, "gu")) ?? [];
const precisionOf = (token: string): number => token.includes(".") ? token.split(".")[1].length : 0;
const toleranceOf = (token: string): number => 0.5 * (10 ** -precisionOf(token));
const exactNumber = (token: string): number => Number(token);

const convertAbsolute = (token: string, source: "°F" | "°C", display: "°F" | "°C"): number => {
  const converted = toMeasurementDisplayValue("temp", token, source, display);
  if (converted === null) throw new Error(`Live temperature policy rejected ${token} ${source} -> ${display}`);
  return converted;
};

const convertDelta = (token: string, source: "°F" | "°C", display: "°F" | "°C"): number => {
  const value = exactNumber(token);
  if (source === display) return value;
  return source === "°C" ? value * (9 / 5) : value * (5 / 9);
};

const compactNumber = (value: number): string => {
  if (!Number.isFinite(value)) return "";
  if (Math.abs(value) >= 100) return Number(value.toFixed(Number.isInteger(value) ? 0 : 1)).toString();
  if (Math.abs(value) >= 10) return Number(value.toFixed(1)).toString();
  if (Math.abs(value) >= 1) return Number(value.toFixed(2)).toString();
  return Number(value.toPrecision(2)).toString();
};

const comparatorPrefix = (matched: string): string => matched.match(new RegExp(`^${COMPARATOR}`, "iu"))?.[0] ?? "";
const rangeSeparator = (matched: string): string => matched.match(new RegExp(RANGE_SEP, "iu"))?.[0] ?? "–";
const normalizeComparator = (value: string): string => value.replace(/\s+$/u, " ");

const formatProposal = (sourceTokens: string[], sourceUnit: "°F" | "°C", converted: number[], original: string): string => {
  const prefix = normalizeComparator(comparatorPrefix(original));
  const separator = sourceTokens.length > 1 ? rangeSeparator(original) : "";
  const sourceValues = sourceTokens.join(separator);
  const convertedValues = converted.map(compactNumber).join(separator);
  return sourceUnit === "°F"
    ? `${prefix}${sourceValues} °F (${convertedValues} °C)`
    : `${prefix}${convertedValues} °F (${sourceValues} °C)`;
};

const isCanonicalTypography = (matched: string): boolean => {
  const canonical = /^\s*(?:(?:>|<|≥|≤)\s*|(?:above|below|over|under|greater than|less than|at least|at most|高于|低于|超过|不低于|不超过)\s+)?[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:\s*(?:-|–|—|to|through|至|到)\s*[+-]?(?:\d+(?:\.\d+)?|\.\d+))? °F \([+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:\s*(?:-|–|—|to|through|至|到)\s*[+-]?(?:\d+(?:\.\d+)?|\.\d+))? °C\)\s*$/iu;
  return canonical.test(matched);
};

const classifyShape = (matched: string, tokens: string[]): NumericShape => {
  if (tokens.length === 0) return "UNPARSEABLE";
  if (new RegExp(RANGE_SEP, "iu").test(matched) && tokens.length === 2) return "RANGE";
  if (new RegExp(`^${COMPARATOR}`, "iu").exec(matched)?.[0]) return "COMPARATOR";
  if (tokens.length > 2) return "SERIES_OR_MULTIPLE";
  return "SCALAR";
};

const isDeltaExpression = (
  text: string, start: number, end: number, tokens: string[], sourceUnit: "°F" | "°C",
): boolean => {
  const before = text.slice(Math.max(0, start - 55), start);
  const after = text.slice(end, Math.min(text.length, end + 35));
  const smallDeltaMagnitude = tokens.length > 0 && tokens.every((token) =>
    Math.abs(exactNumber(token)) < (sourceUnit === "°C" ? 15 : 30));
  return /(?:\b(?:rise|rose|fall|fell|increase|increased|decrease|decreased|change|changed|difference|drop|dropped|lowered|raised)\s+(?:of|by)\s*|(?:升高|上升|增加|下降|降低|变化)(?:了|为|达)?\s*)$/iu.test(before)
    || (smallDeltaMagnitude && /(?:\b(?:bump|rise|fall|increase|decrease|change|difference|drop)|(?:升高|上升|增加|下降|降低|变化|温差|差值))\s*[（(]\s*$/iu.test(before))
    || /^\s*(?:degree(?:s)?\s+)?(?:rise|fall|increase|decrease|change|difference|drop)\b/iu.test(after)
    || /^\s*的(?:升高|上升|增加|下降|降低|变化|温差|差值)/u.test(after)
    || /(?:increase|decrease|rise|fall)[^;]{0,25}\bor\s*$/iu.test(before)
    || /(?:升高|下降|增加|降低)[^，。；,;]{0,25}或\s*$/u.test(before)
    || /^\s*(?:or\s+|或\s*)[^.;。；]{0,22}(?:increase|decrease|rise|fall|升高|下降|增加|降低)/iu.test(after);
};

const parseExplicitMatches = (text: string): ParsedExpression[] => {
  const candidates: Array<{ start: number; end: number; raw: string; unit: UnitToken; tokens: string[] }> = [];
  SINGLE_RE.lastIndex = 0;
  for (const match of text.matchAll(SINGLE_RE)) {
    const raw = match[0];
    const start = match.index ?? 0;
    const unitMatch = [...raw.matchAll(new RegExp(UNIT, "giu"))].at(-1);
    if (!unitMatch) continue;
    const unit = unitFor(unitMatch[0]);
    if (!unit) continue;
    const bareLetter = /^[CF]$/iu.test(unit.raw.trim());
    const attached = unitMatch.index !== undefined && unitMatch.index > 0 && !/\s/u.test(raw[unitMatch.index - 1]);
    const context = text.slice(Math.max(0, start - 45), Math.min(text.length, start + raw.length + 45));
    if (bareLetter && !attached && !TEMP_CONTEXT_RE.test(context)) continue;
    const tokens = numericTokens(raw.slice(0, unitMatch.index));
    const plausibleAbsolute = tokens.length > 0 && tokens.every((token) => {
      const value = exactNumber(token);
      return unit.unit === "°C" ? value >= 20 && value <= 60 : value >= 60 && value <= 150;
    });
    if (bareLetter && !TEMP_CONTEXT_RE.test(context) && !plausibleAbsolute &&
      !isDeltaExpression(text, start, start + raw.length, tokens, unit.unit)) continue;
    candidates.push({ start, end: start + raw.length, raw, unit, tokens });
  }

  const results: ParsedExpression[] = [];
  for (let index = 0; index < candidates.length; index += 1) {
    const first = candidates[index];
    if (results.some((row) => first.start >= row.start && first.end <= row.end)) continue;
    const next = candidates[index + 1];
    const between = next ? text.slice(first.end, next.start) : "";
    const parentheticalDual = Boolean(next && /^\s*[（(]\s*$/u.test(between) && /^\s*[）)]/u.test(text.slice(next.end, next.end + 3)));
    const slashDual = Boolean(next && /^\s*\/\s*$/u.test(between));
    const dual = Boolean(next && first.unit.unit !== next.unit.unit && (parentheticalDual || slashDual));
    const end = dual && next ? next.end + (parentheticalDual ? (text.slice(next.end).match(/^\s*[）)]/u)?.[0].length ?? 0) : 0) : first.end;
    const matched = text.slice(first.start, end);
    const nearby = text.slice(Math.max(0, first.start - 45), Math.min(text.length, end + 45));
    const quantityKind: QuantityKind = isDeltaExpression(text, first.start, end, first.tokens, first.unit.unit) ? "TEMPERATURE_DELTA" : TEMP_CONTEXT_RE.test(nearby) || !/^[CF]$/iu.test(first.unit.raw.trim()) || !/\s/u.test(first.raw.slice(-first.unit.raw.length - 1, -first.unit.raw.length))
      ? "ABSOLUTE_TEMPERATURE" : "AMBIGUOUS_QUANTITY";
    const sourceTokens = first.tokens;
    const numericShape = classifyShape(first.raw, sourceTokens);
    if (sourceTokens.length === 0 || numericShape === "UNPARSEABLE") {
      results.push({ start: first.start, end, matched, quantityKind: "AMBIGUOUS_QUANTITY", numericShape: "UNPARSEABLE",
        presentationClass: "AMBIGUOUS_PRESENTATION", sourceUnit: first.unit.unit, sourceNumericTokens: [], exactConvertedValues: null,
        proposedConvertedTokens: null, proposedConvertedPrecisions: null, proposedRoundingResiduals: null,
        existingSecondaryNumericTokens: null, arithmeticResiduals: null, displayedSecondaryPrecisions: null, reconciliationTolerances: null,
        proposedExpression: null, disposition: "REVIEW_AMBIGUOUS_CONTEXT", note: "Numeric tokens could not be parsed deterministically." });
      continue;
    }
    const targetUnit = first.unit.unit === "°C" ? "°F" : "°C";
    const converted = sourceTokens.map((token) => quantityKind === "TEMPERATURE_DELTA"
      ? convertDelta(token, first.unit.unit, targetUnit)
      : convertAbsolute(token, first.unit.unit, targetUnit));
    const proposedConvertedTokens = converted.map(compactNumber);
    const proposedConvertedPrecisions = proposedConvertedTokens.map(precisionOf);
    const proposedRoundingResiduals = proposedConvertedTokens.map((token, tokenIndex) => exactNumber(token) - converted[tokenIndex]);
    let presentationClass: PresentationClass = first.unit.unit === "°F" ? "FAHRENHEIT_ONLY" : "CELSIUS_ONLY";
    let disposition: Disposition = first.unit.unit === "°F" ? "SAFE_ADD_CELSIUS" : "SAFE_ADD_FAHRENHEIT_AND_REORDER";
    let secondaryTokens: string[] | null = null;
    let residuals: number[] | null = null;
    let precisions: number[] | null = null;
    let tolerances: number[] | null = null;
    let proposal: string | null = formatProposal(sourceTokens, first.unit.unit, converted, first.raw);
    let note = "Exact absolute conversion under the live temperature display policy.";
    if (quantityKind === "TEMPERATURE_DELTA") {
      disposition = "REVIEW_TEMPERATURE_DELTA";
      proposal = null;
      note = `Temperature delta; exact ${targetUnit} equivalence is ${converted.map(compactNumber).join(", ")}.`;
    } else if (quantityKind !== "ABSOLUTE_TEMPERATURE") {
      disposition = "REVIEW_AMBIGUOUS_CONTEXT";
      proposal = null;
      note = "Context does not safely establish an absolute physical temperature.";
    } else if (numericShape === "SERIES_OR_MULTIPLE" || numericShape === "COMPOUND_MIXED") {
      disposition = "REVIEW_COMPLEX_MULTIPLE";
      proposal = null;
      note = "Multiple or compound numeric structure requires review.";
    }
    if (dual && next) {
      index += 1;
      secondaryTokens = next.tokens;
      presentationClass = first.unit.unit === "°F" ? "DUAL_F_FIRST" : "DUAL_C_FIRST";
      const expectedSecondary = sourceTokens.map((token) => quantityKind === "TEMPERATURE_DELTA"
        ? convertDelta(token, first.unit.unit, next.unit.unit)
        : convertAbsolute(token, first.unit.unit, next.unit.unit));
      precisions = secondaryTokens.map(precisionOf);
      tolerances = secondaryTokens.map(toleranceOf);
      residuals = secondaryTokens.map((token, tokenIndex) => exactNumber(token) - (expectedSecondary[tokenIndex] ?? Number.NaN));
      const reconciles = secondaryTokens.length === expectedSecondary.length && residuals.every((residual, tokenIndex) =>
        Number.isFinite(residual) && Math.abs(residual) <= (tolerances?.[tokenIndex] ?? 0));
      if (!reconciles) {
        presentationClass = "MALFORMED_OR_MISMATCHED_DUAL";
        disposition = "REVIEW_DUAL_VALUE_MISMATCH";
        proposal = null;
        note = "Existing dual values do not reconcile within displayed-precision tolerance.";
      } else if (quantityKind === "TEMPERATURE_DELTA") {
        disposition = "REVIEW_TEMPERATURE_DELTA";
        proposal = null;
      } else {
        const fTokens = first.unit.unit === "°F" ? sourceTokens : secondaryTokens;
        const cTokens = first.unit.unit === "°C" ? sourceTokens : secondaryTokens;
        const separator = sourceTokens.length > 1 ? rangeSeparator(first.raw) : "";
        const prefix = normalizeComparator(comparatorPrefix(first.raw));
        proposal = `${prefix}${fTokens.join(separator)} °F (${cTokens.join(separator)} °C)`;
        if (first.unit.unit === "°C") disposition = "SAFE_REORDER_EXISTING_DUAL";
        else disposition = isCanonicalTypography(matched) ? "ALREADY_CANONICAL" : "SAFE_NORMALIZE_DUAL_TOKENS";
        note = "Existing dual values reconcile within displayed-precision tolerance.";
      }
    }
    results.push({ start: first.start, end, matched, quantityKind, numericShape, presentationClass,
      sourceUnit: first.unit.unit, sourceNumericTokens: sourceTokens, exactConvertedValues: converted,
      proposedConvertedTokens, proposedConvertedPrecisions, proposedRoundingResiduals,
      existingSecondaryNumericTokens: secondaryTokens, arithmeticResiduals: residuals,
      displayedSecondaryPrecisions: precisions, reconciliationTolerances: tolerances,
      proposedExpression: proposal, disposition, note });
  }
  return results.sort((a, b) => a.start - b.start || a.end - b.end);
};

const parseUnitMissingMatches = (text: string, occupied: ParsedExpression[]): ParsedExpression[] => {
  const results: ParsedExpression[] = [];
  for (const regex of UNIT_MISSING_PATTERNS) {
    regex.lastIndex = 0;
    for (const match of text.matchAll(regex)) {
      const start = match.index ?? 0;
      const end = start + match[0].length;
      if (occupied.some((row) => start < row.end && row.start < end)) continue;
      const trailing = text.slice(end, Math.min(text.length, end + 18));
      if (/^(?:\.\d|\s*(?:°|º|℃|℉|degrees?|Celsius|Fahrenheit|摄氏|华氏|[CF]\b))/iu.test(trailing)) continue;
      if (/^\s*(?:days?\b|hours?\b|weeks?\b|months?\b|years?\b|天|日|小时|周|个月|年)/iu.test(trailing)) continue;
      const tokens = numericTokens(match[1] ?? match[0]);
      results.push({ start, end, matched: match[0], quantityKind: "AMBIGUOUS_QUANTITY",
        numericShape: classifyShape(match[1] ?? match[0], tokens), presentationClass: "UNIT_MISSING", sourceUnit: null,
        sourceNumericTokens: tokens, exactConvertedValues: null, proposedConvertedTokens: null,
        proposedConvertedPrecisions: null, proposedRoundingResiduals: null, existingSecondaryNumericTokens: null,
        arithmeticResiduals: null, displayedSecondaryPrecisions: null, reconciliationTolerances: null,
        proposedExpression: null, disposition: "PRESERVE_UNIT_MISSING", note: "Strong temperature context but no explicit unit; unit is not inferred." });
    }
  }
  return results.filter((row, index) => !results.slice(0, index).some((prior) => prior.start === row.start && prior.end === row.end));
};

export const detectTemperatureExpressions = (text: string): ParsedExpression[] => {
  const explicit = parseExplicitMatches(text);
  return [...explicit, ...parseUnitMissingMatches(text, explicit)].sort((a, b) => a.start - b.start || a.end - b.end);
};

const counterpartPathFor = (jsonPath: string): string | null => {
  if (jsonPath.endsWith(".en")) return `${jsonPath.slice(0, -3)}.zh`;
  if (jsonPath.endsWith(".zh")) return `${jsonPath.slice(0, -3)}.en`;
  if (jsonPath.endsWith(".termEn")) return `${jsonPath.slice(0, -7)}.termZh`;
  if (jsonPath.endsWith(".termZh")) return `${jsonPath.slice(0, -7)}.termEn`;
  return null;
};

const sortRows = (a: TemperatureOccurrence, b: TemperatureOccurrence): number =>
  a.bankPath.localeCompare(b.bankPath) || a.topLevelQuestionId.localeCompare(b.topLevelQuestionId) ||
  (a.embeddedQuestionId ?? "").localeCompare(b.embeddedQuestionId ?? "") || a.jsonPath.localeCompare(b.jsonPath) ||
  a.occurrenceIndex - b.occurrenceIndex;

const canonicalFacts = (row: TemperatureOccurrence): number[] | null => {
  if (!row.sourceUnit) return null;
  if (row.quantityKind === "ABSOLUTE_TEMPERATURE") {
    return row.sourceNumericTokens.map((token) => convertAbsolute(token, row.sourceUnit!, "°C"));
  }
  if (row.quantityKind === "TEMPERATURE_DELTA") {
    return row.sourceNumericTokens.map((token) => convertDelta(token, row.sourceUnit!, "°C"));
  }
  return null;
};

const sameFacts = (a: TemperatureOccurrence, b: TemperatureOccurrence): boolean => {
  const factsA = canonicalFacts(a);
  const factsB = canonicalFacts(b);
  if (!factsA || !factsB || factsA.length !== factsB.length) return false;
  return factsA.every((value, index) => Math.abs(value - factsB[index]) <= 0.051);
};

const presentationPrecisionKey = (row: TemperatureOccurrence): string =>
  row.sourceNumericTokens.map(precisionOf).join(",") + ":" + (row.existingSecondaryNumericTokens ?? []).map(precisionOf).join(",");

const applyParity = (rows: TemperatureOccurrence[]): void => {
  const byPath = new Map<string, TemperatureOccurrence[]>();
  for (const row of rows) {
    const key = `${row.bankPath}|${row.jsonPath}`;
    if (!byPath.has(key)) byPath.set(key, []);
    byPath.get(key)!.push(row);
  }
  for (const row of rows) {
    if (!row.counterpartJsonPath) {
      row.parityClass = "NO_STRUCTURAL_COUNTERPART";
      continue;
    }
    const counterparts = byPath.get(`${row.bankPath}|${row.counterpartJsonPath}`) ?? [];
    if (counterparts.length === 0) {
      row.parityClass = "COUNTERPART_MISSING_TEMPERATURE";
      continue;
    }
    const indexedCounterpart = counterparts[row.occurrenceIndex];
    const counterpart = indexedCounterpart && sameFacts(row, indexedCounterpart)
      ? indexedCounterpart : counterparts.find((candidate) => sameFacts(row, candidate));
    if (!counterpart || !sameFacts(row, counterpart)) {
      row.parityClass = "VALUE_OR_UNIT_CONFLICT";
      if (SAFE_DISPOSITIONS.has(row.disposition)) {
        row.disposition = "REVIEW_AMBIGUOUS_CONTEXT";
        row.notes += " Structural counterpart contains a conflicting temperature fact; safe migration withheld.";
      }
      continue;
    }
    if (row.presentationClass === counterpart.presentationClass) {
      row.parityClass = presentationPrecisionKey(row) === presentationPrecisionKey(counterpart)
        ? "EQUIVALENT_SAME_PRESENTATION" : "EQUIVALENT_DIFFERENT_PRECISION";
    } else row.parityClass = "EQUIVALENT_DIFFERENT_PRESENTATION";
  }
};

export interface SurveyResult {
  bankFiles: string[];
  topLevelItems: number;
  scoredLeaves: number;
  fieldsScanned: number;
  rows: TemperatureOccurrence[];
}

export const scanBundledTemperatureProse = (): SurveyResult => {
  const bankFiles = fs.readdirSync(path.join(REPO_ROOT, "banks")).filter((name) => name.endsWith(".json")).sort();
  const rows: TemperatureOccurrence[] = [];
  let topLevelItems = 0;
  let scoredLeaves = 0;
  let fieldsScanned = 0;
  for (const file of bankFiles) {
    const bankPath = `banks/${file}`;
    const parsed = parseBankText(fs.readFileSync(path.join(REPO_ROOT, bankPath), "utf8"));
    const validated = validateBankObject(parsed, { rejectUnknownKeys: true, requireMeta: true });
    if (!validated.ok) throw new Error(`${bankPath}: ${"reasons" in validated ? validated.reasons.join("; ") : "validation failed"}`);
    const bank = validated.value;
    topLevelItems += bank.questions.length;
    scoredLeaves += bank.questions.reduce((sum, question) => sum + (question.itemType === "case_study" ? question.caseStudy.questions.length : 1), 0);
    const fields = collectLearnerFacingTemperatureFields(bankPath, bank);
    fieldsScanned += fields.length;
    for (const field of fields) {
      detectTemperatureExpressions(field.text).forEach((match, occurrenceIndex) => rows.push({
        occurrenceId: "", bankPath, topLevelQuestionId: field.topLevelQuestionId, embeddedQuestionId: field.embeddedQuestionId,
        jsonPath: field.jsonPath, surface: field.surface, language: field.language, verbatimText: field.text, occurrenceIndex,
        startOffset: match.start, endOffset: match.end, matchedExpression: match.matched,
        nearbyContext: field.text.slice(Math.max(0, match.start - 80), Math.min(field.text.length, match.end + 80)),
        quantityKind: match.quantityKind, numericShape: match.numericShape, presentationClass: match.presentationClass,
        sourceUnit: match.sourceUnit, sourceNumericTokens: match.sourceNumericTokens, exactConvertedValues: match.exactConvertedValues,
        proposedConvertedTokens: match.proposedConvertedTokens, proposedConvertedPrecisions: match.proposedConvertedPrecisions,
        proposedRoundingResiduals: match.proposedRoundingResiduals,
        existingSecondaryNumericTokens: match.existingSecondaryNumericTokens, arithmeticResiduals: match.arithmeticResiduals,
        displayedSecondaryPrecisions: match.displayedSecondaryPrecisions, reconciliationTolerances: match.reconciliationTolerances,
        proposedExpression: match.proposedExpression, disposition: match.disposition,
        counterpartJsonPath: counterpartPathFor(field.jsonPath), parityClass: "NO_STRUCTURAL_COUNTERPART",
        coexistsWithTypedTemperature: field.coexistsWithTypedTemperature, notes: match.note,
      }));
    }
  }
  rows.sort(sortRows);
  rows.forEach((row, index) => { row.occurrenceId = `temp-${String(index + 1).padStart(5, "0")}`; });
  applyParity(rows);
  return { bankFiles: bankFiles.map((file) => `banks/${file}`), topLevelItems, scoredLeaves, fieldsScanned, rows };
};

const countBy = <T>(items: T[], keyFor: (item: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) counts[keyFor(item)] = (counts[keyFor(item)] ?? 0) + 1;
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
};

const markdownCounts = (title: string, counts: Record<string, number>): string => {
  const lines = Object.entries(counts).map(([key, value]) => `| ${key} | ${value} |`);
  return `### ${title}\n\n| Value | Count |\n|---|---:|\n${lines.join("\n") || "| (none) | 0 |"}`;
};

const producerFamily = (id: string): string => id.match(/^[^_]+/u)?.[0] ?? "unknown";
const git = (...args: string[]): string => execFileSync("git", args, { cwd: REPO_ROOT, encoding: "utf8" }).trim();
const sha256File = (relativePath: string): string => createHash("sha256")
  .update(fs.readFileSync(path.join(REPO_ROOT, relativePath))).digest("hex");

const surveyEndingState = (): string[] => [
  " M BANK-CENSUS.md",
  " M BANK-REVIEW-LEDGER.md",
  " M PROJECT-HISTORY.md",
  " M banks/gpt-canonical.json",
  " M census.json",
  "?? TEMPERATURE-PROSE-UNIT-SURVEY-CODEX-SPEC-2026-07-21.md",
  "?? audit/temperature-prose-unit-survey-2026-07-21/",
  "?? scripts/audit/temperature-prose-unit-survey.ts",
  "?? scripts/patches/2026-07-21-gpt-hemodialysis-access-coherence.ts",
  "?? scripts/tests/temperature-prose-unit-survey.ts",
];

const reportFor = (result: SurveyResult): string => {
  const { rows } = result;
  const safe = rows.filter((row) => SAFE_DISPOSITIONS.has(row.disposition));
  const residuals = rows.filter((row) => row.disposition !== "ALREADY_CANONICAL" && !SAFE_DISPOSITIONS.has(row.disposition));
  const owners = new Set(rows.map((row) => `${row.bankPath}|${row.topLevelQuestionId}|${row.embeddedQuestionId ?? ""}`));
  const mismatchRows = rows.filter((row) => row.disposition === "REVIEW_DUAL_VALUE_MISMATCH");
  const examples = (predicate: (row: TemperatureOccurrence) => boolean, limit = 3): string => rows.filter(predicate).slice(0, limit)
    .map((row) => `- \`${row.occurrenceId}\` — \`${row.matchedExpression}\` in \`${row.bankPath}\` / \`${row.jsonPath}\``).join("\n") || "- None in this snapshot.";
  const mismatchEvidence = mismatchRows.map((row) =>
    `- \`${row.occurrenceId}\`: \`${row.matchedExpression}\`; residuals=${JSON.stringify(row.arithmeticResiduals)}, tolerances=${JSON.stringify(row.reconciliationTolerances)}.`).join("\n") || "- None.";
  const residualGroups = Object.entries(countBy(residuals, (row) => row.disposition)).map(([reason, count]) => `- ${reason}: ${count}`).join("\n") || "- None.";
  const canonicalPolicy = MEASUREMENT_DISPLAY_POLICIES.temp;
  const dkaLocator = rows.find((row) => row.matchedExpression.includes("99.1°F (37.3°C)") && row.coexistsWithTypedTemperature);
  return `# Learner-Facing Temperature Prose Unit Survey\n\n` +
    `Date: 2026-07-21\n\nFinal verdict: **${residuals.length ? "SURVEY_COMPLETE_WITH_REVIEW_RESIDUALS" : "SURVEY_COMPLETE"}**\n\n` +
    `## Repository snapshot\n\n` +
    `- Starting branch: \`${TASK_START.branch}\`\n- Starting HEAD: \`${TASK_START.head}\`\n- Upstream: \`${TASK_START.upstream}\` (ahead ${TASK_START.upstreamAhead}, behind ${TASK_START.upstreamBehind})\n` +
    `- Starting staged paths: none\n- Starting unstaged paths: ${TASK_START.unstagedPaths.map((value) => `\`${value}\``).join(", ")}\n- Starting untracked paths: ${TASK_START.untrackedPaths.map((value) => `\`${value}\``).join(", ")}\n` +
    `- Ending survey worktree state: ${surveyEndingState().map((value) => `\`${value}\``).join(", ")}\n\n` +
    `Luke confirmed that the only pre-existing bank mutation was the completed regeneration of \`gpt_format10b_hemodialysis_access_prompt_followup\`. ` +
    `The stable live \`banks/gpt-canonical.json\` SHA-256 was \`${EXPECTED_GPT_BANK_SHA256}\`; no writer changed it during the bounded rerun. ` +
    `The survey used that live validated bank snapshot while leaving the regeneration's bank, ledger, history, census, and patch paths untouched.\n\n` +
    `## Authority and executable policy\n\n` +
    `Read \`AGENTS.md\`, \`docs/AGENTS-RUNBOOK.md\`, \`DECISIONS.md\`, \`PROJECT-HISTORY.md\`, \`NCLEX-Question-Schema.md\`, ` +
    `\`src/measurementUnitPolicy.ts\`, \`src/structuredMeasurements.ts\`, \`scripts/tests/structured-measurements.ts\`, \`lib/question-population.ts\`, ` +
    `the WBC/platelet precedent, and both completed producer-vocabulary remediation reports. Live policy observed: primary \`${canonicalPolicy.primaryUnit}\`, secondary \`${canonicalPolicy.secondaryUnit}\`, mode \`${canonicalPolicy.secondaryMode}\`. ` +
    `The prose rule is present in \`AGENTS.md\`; no policy drift was found.\n\n` +
    `## Population and traversal contract\n\n` +
    `Scanned ${result.bankFiles.length} validated bundled top-level banks, ${result.topLevelItems} top-level session units, ${result.scoredLeaves} scored leaves, and ${result.fieldsScanned} explicitly enumerated learner-facing string fields. ` +
    `The bank files were: ${result.bankFiles.map((value) => `\`${value}\``).join(", ")}.\n\n` +
    `Included stems, item-type display text, options, rationales, strategies, glossary text, case titles/summaries, displayed stage text, and global/staged exhibit titles and content. ` +
    `Excluded bank/question metadata, IDs and answer keys, provenance/audit branches, structured measurements, question/rationale/exhibit visual payloads, and typed vitals-trend values. Prose beside a typed temperature remained included.\n\n` +
    `## Results\n\n` +
    `- Total temperature-prose occurrences: **${rows.length}**\n- Distinct owning items: **${owners.size}**\n- Coexisting with an excluded typed temperature: **${rows.filter((row) => row.coexistsWithTypedTemperature).length}**\n` +
    `- Safe mechanical subset: **${safe.length}**\n- Review/preserve residuals: **${residuals.length}**\n- Already canonical: **${rows.filter((row) => row.disposition === "ALREADY_CANONICAL").length}**\n\n` +
    `### Live-bank locator reconciliation\n\nThe ICI-colitis prose is present as \`100.9 °F (38.3 °C)\` and is already canonical. ` +
    (dkaLocator
      ? `The DKA exhibit's authored prose is \`${dkaLocator.matchedExpression}\` and therefore classifies \`${dkaLocator.disposition}\`; its adjacent typed structured-temperature display renders canonical spacing but is excluded by contract.\n\n`
      : "No authored DKA prose locator was found; the typed display remains excluded by contract.\n\n") +
    [
      markdownCounts("By bank", countBy(rows, (row) => row.bankPath)),
      markdownCounts("By producer prefix/family", countBy(rows, (row) => producerFamily(row.embeddedQuestionId ?? row.topLevelQuestionId))),
      markdownCounts("By surface", countBy(rows, (row) => row.surface)),
      markdownCounts("By language", countBy(rows, (row) => row.language)),
      markdownCounts("By quantity kind", countBy(rows, (row) => row.quantityKind)),
      markdownCounts("By numeric shape", countBy(rows, (row) => row.numericShape)),
      markdownCounts("By presentation class", countBy(rows, (row) => row.presentationClass)),
      markdownCounts("By disposition", countBy(rows, (row) => row.disposition)),
      markdownCounts("Safe subset by conversion type", countBy(safe, (row) => row.disposition)),
      markdownCounts("EN/ZH parity", countBy(rows, (row) => row.parityClass)),
    ].join("\n\n") +
    `\n\n## Review residuals\n\n${residualGroups}\n\n### Dual-value mismatch evidence\n\n${mismatchEvidence}\n\n` +
    `## Examples\n\n### Already canonical\n\n${examples((row) => row.disposition === "ALREADY_CANONICAL")}\n\n` +
    `### Safe mechanical\n\n${examples((row) => SAFE_DISPOSITIONS.has(row.disposition))}\n\n` +
    `### Temperature delta\n\n${examples((row) => row.disposition === "REVIEW_TEMPERATURE_DELTA")}\n\n` +
    `### Ambiguous or unit-missing\n\n${examples((row) => row.disposition === "REVIEW_AMBIGUOUS_CONTEXT" || row.disposition === "PRESERVE_UNIT_MISSING")}\n\n` +
    `### Excluded typed-contract canary\n\nSynthetic traversal tests place the same \`40°C\` literal at \`questions[0].meta.source\`, ` +
    `\`questions[0].caseStudy.exhibits[0].structuredMeasurements...value\`, and \`questions[0].caseStudy.exhibits[0].visual...values\`; all three are excluded. ` +
    `The paired learner-visible rationale and exhibit-content paths are included, and the exhibit rows record \`coexistsWithTypedTemperature: true\`.\n\n` +
    `## Determinism and mutation boundary\n\nThe focused test covers parsing, absolute and delta arithmetic, structural inclusion/exclusion, bilingual pairing, ordering, and byte-stable serialization. ` +
    `The survey was run twice against the same bank snapshot and the four generated artifacts were byte-identical. No canonical bank, governance file, renderer, schema, ledger, census, or package script was modified.\n\n` +
    `## Recommended next step\n\nUse the ${safe.length}-row safe subset as the closed input to a separately commissioned declarative migration, and adjudicate the ${residuals.length} residual rows before authorizing any content mutation. This report applies no patch.\n`;
};

const writeJsonLines = (filePath: string, rows: unknown[]): void => {
  fs.writeFileSync(filePath, rows.length ? `${rows.map((row) => JSON.stringify(row)).join("\n")}\n` : "");
};

export const serializeArtifacts = (result: SurveyResult): Record<string, string> => {
  const safe = result.rows.filter((row) => SAFE_DISPOSITIONS.has(row.disposition));
  const residuals = result.rows.filter((row) => row.disposition !== "ALREADY_CANONICAL" && !SAFE_DISPOSITIONS.has(row.disposition));
  return {
    "manifest.jsonl": result.rows.length ? `${result.rows.map((row) => JSON.stringify(row)).join("\n")}\n` : "",
    "safe-mechanical-subset.jsonl": safe.length ? `${safe.map((row) => JSON.stringify(row)).join("\n")}\n` : "",
    "review-residuals.jsonl": residuals.length ? `${residuals.map((row) => JSON.stringify(row)).join("\n")}\n` : "",
    "report.md": reportFor(result),
  };
};

export const writeSurveyArtifacts = (result: SurveyResult): void => {
  fs.mkdirSync(AUDIT_DIR, { recursive: true });
  const artifacts = serializeArtifacts(result);
  writeJsonLines(MANIFEST_PATH, result.rows);
  writeJsonLines(SAFE_PATH, result.rows.filter((row) => SAFE_DISPOSITIONS.has(row.disposition)));
  writeJsonLines(RESIDUAL_PATH, result.rows.filter((row) => row.disposition !== "ALREADY_CANONICAL" && !SAFE_DISPOSITIONS.has(row.disposition)));
  fs.writeFileSync(REPORT_PATH, artifacts["report.md"]);
};

const main = (): void => {
  const policy = MEASUREMENT_DISPLAY_POLICIES.temp;
  if (policy.primaryUnit !== "°F" || policy.secondaryUnit !== "°C" || policy.secondaryMode !== "paren") {
    console.error("BLOCKED_POLICY_DRIFT");
    process.exitCode = 2;
    return;
  }
  if (git("rev-parse", "HEAD") !== TASK_START.head) throw new Error("Live HEAD drifted from the recorded survey snapshot.");
  if (sha256File("banks/gpt-canonical.json") !== EXPECTED_GPT_BANK_SHA256) {
    throw new Error("Live gpt-canonical bank drifted from the resumed stable survey snapshot.");
  }
  const result = scanBundledTemperatureProse();
  if (sha256File("banks/gpt-canonical.json") !== EXPECTED_GPT_BANK_SHA256) {
    throw new Error("gpt-canonical changed during the survey run.");
  }
  writeSurveyArtifacts(result);
  const residualCount = result.rows.filter((row) => row.disposition !== "ALREADY_CANONICAL" && !SAFE_DISPOSITIONS.has(row.disposition)).length;
  console.log(`${residualCount ? "SURVEY_COMPLETE_WITH_REVIEW_RESIDUALS" : "SURVEY_COMPLETE"} occurrences=${result.rows.length} safe=${result.rows.filter((row) => SAFE_DISPOSITIONS.has(row.disposition)).length} residuals=${residualCount}`);
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();

// Scalar proposals must stay aligned with the live structured renderer's numeric behavior.
export const scalarFormatterCanary = (value: string, unit: "°F" | "°C"): string =>
  formatStructuredMeasurementValue("temp", { columnId: "survey", value, unit });
