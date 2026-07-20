import * as fs from "node:fs";
import * as path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { toCanonicalMeasurementValue } from "../../src/measurementUnitPolicy";

type Analyte = "wbc" | "platelets";
type Language = "en" | "zh" | "unknown";
type Disposition =
  | "NORMALIZE_EXPLICIT"
  | "NORMALIZE_TOKEN_ONLY"
  | "ALREADY_CANONICAL"
  | "PRESERVE_IMPLICIT"
  | "EXCLUDE_NON_BLOOD"
  | "EXCLUDE_NON_COUNT"
  | "EXCLUDE_NON_LEARNER_FACING"
  | "BLOCKED_CONTEXT";

export interface OccurrenceRow {
  occurrenceId: string;
  bankPath: string;
  topLevelQuestionId: string;
  embeddedQuestionId: string | null;
  jsonPath: string;
  surface: string;
  language: Language;
  analyte: Analyte;
  specimenContext: "blood_cbc" | "non_blood" | "unknown";
  learnerFacing: boolean;
  verbatimText: string;
  occurrenceIndex: number;
  startOffset: number;
  endOffset: number;
  matchedExpression: string;
  numericExpression: string;
  unitExpression: string | null;
  formClass: string;
  canonicalExpression: string | null;
  canonicalNumericExpression: string | null;
  counterpartJsonPath: string | null;
  parityClass: "EQUIVALENT" | "COUNTERPART_ABSENT" | "POSSIBLE_MISMATCH" | "NOT_APPLICABLE";
  candidateSource: "gemini_seed" | "independent_traversal" | "both";
  disposition: Disposition;
  notes: string;
}

export interface DispositionRow {
  bankPath: string;
  topLevelQuestionId: string;
  embeddedQuestionId: string | null;
  jsonPath: string;
  patchPath: Array<string | number | { id: string }>;
  language: Language;
  before: string;
  after: string | null;
  occurrenceIds: string[];
  disposition: Disposition;
  reason: string;
  counterpartJsonPath: string | null;
  pairedMutationRequired: boolean;
  changedSubstrings: Array<{ before: string; after: string }>;
}

interface StringLeaf {
  bankPath: string;
  topLevelQuestionId: string;
  embeddedQuestionId: string | null;
  jsonPath: string;
  stablePath: Array<string | number | { id: string }>;
  value: string;
  language: Language;
  surface: string;
  learnerFacing: boolean;
}

interface RawMatch {
  analyte: Analyte;
  start: number;
  end: number;
  matched: string;
  numeric: string;
  unit: string | null;
  canonical: string | null;
  canonicalNumeric: string | null;
  formClass: string;
  specimen: "blood_cbc" | "non_blood" | "unknown";
  disposition: Disposition;
  note: string;
}

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const AUDIT_DIR = path.join(REPO_ROOT, "audit/wbc-platelet-prose-unit-inventory-2026-07-19");
const SEED_PATH = path.join(AUDIT_DIR, "manifest.jsonl");
const MANIFEST_PATH = path.join(AUDIT_DIR, "codex-corrected-manifest.jsonl");
const DISPOSITIONS_PATH = path.join(AUDIT_DIR, "codex-dispositions.jsonl");
const POST_MANIFEST_PATH = path.join(AUDIT_DIR, "codex-post-manifest.jsonl");
const POST_DISPOSITIONS_PATH = path.join(AUDIT_DIR, "codex-post-dispositions.jsonl");

const ANALYTE_RE = /(?:white\s+blood\s+cell(?:s)?(?:\s+count)?|white\s+count|leukocytes?|WBC|白细胞(?:计数|总数)?|白血球(?:计数)?|platelet(?:s)?(?:\s+count)?|PLT|thrombocytes?|血小板(?:计数)?)/giu;
const WBC_RE = /(?:white\s+blood\s+cell(?:s)?(?:\s+count)?|white\s+count|leukocytes?|WBC|白细胞(?:计数|总数)?|白血球(?:计数)?)/iu;
const PLATELET_RE = /(?:platelet(?:s)?(?:\s+count)?|PLT|thrombocytes?|血小板(?:计数)?)/iu;
const NUMBER = String.raw`(?:\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)`;
const VALUE = String.raw`(?:[<>≤≥]\s*)?${NUMBER}(?:\s*(?:-|–|—|to|至|到|降至|升至)\s*${NUMBER})?`;
const RAW_UNIT = String.raw`(?:cells?\s*|个\s*)?\/(?:µL|μL|uL|mcL|mm3|mm³)`;
const CANON_UNIT = String.raw`(?:[×x]\s*10\s*(?:³|\^\s*3)\s*\/(?:µL|μL|uL)|K\s*\/(?:µL|μL|uL|mcL))`;
const SI_UNIT = String.raw`(?:[×x]\s*10\s*(?:⁹|\^\s*9)\s*\/L)`;
const EXPLICIT_RE = new RegExp(
  String.raw`(${VALUE})\s*(${RAW_UNIT}|${CANON_UNIT}|${SI_UNIT})(?:\s*\(\s*(${VALUE})\s*(${SI_UNIT}|${CANON_UNIT})\s*\))?`,
  "giu",
);

const NON_LEARNER_KEYS = new Set([
  "meta", "visual", "visuals", "structuredMeasurements", "sourceUnit", "sources", "source",
  "id", "topic", "category", "ngnSkill", "difficulty", "schemaVersion", "correctOrder",
  "correctByBlank", "scoring", "type", "kind", "key", "canonicalUnit", "acceptedSourceUnits",
]);

const surfaceFor = (parts: Array<string | number>): string => {
  const joined = parts.join(".");
  if (joined.includes("rationale")) return "rationale";
  if (joined.includes("exhibits")) return "exhibit";
  if (joined.includes("stages")) return "staged_exhibit";
  if (joined.includes("options")) return "option";
  if (joined.includes("matrix")) return "matrix";
  if (joined.includes("highlight")) return "highlight";
  if (joined.includes("bowtie")) return "bowtie";
  if (joined.includes("ordered")) return "ordered_response";
  if (joined.includes("cloze") || joined.includes("blanks")) return "cloze";
  if (joined.includes("glossary")) return "glossary";
  if (joined.includes("stem") || joined.includes("prompt")) return "stem";
  return "other";
};

const renderPath = (parts: Array<string | number>): string => parts.map((part, index) =>
  typeof part === "number" ? `[${part}]` : index === 0 ? part : `.${part}`).join("");

const analyteFor = (token: string): Analyte => PLATELET_RE.test(token) ? "platelets" : "wbc";

const normalizedUnitClass = (unit: string): "raw" | "canonical" | "scaled" | "si" => {
  const compact = unit.normalize("NFC").replace(/\s+/g, "").toLowerCase();
  if (/^(?:cells?|个)?\/(?:µl|μl|ul|mcl|mm3|mm³)$/.test(compact)) return "raw";
  if (compact === "×10³/µl") return "canonical";
  if (/^(?:x10(?:³|\^3)\/ul|×10(?:³|\^3)\/(?:µl|μl|ul)|k\/(?:µl|μl|ul|mcl))$/.test(compact)) return "scaled";
  return "si";
};

const decimalDivideThousand = (raw: string): string => {
  const cleaned = raw.replace(/,/g, "");
  const [whole, fraction = ""] = cleaned.split(".");
  const digits = `${whole}${fraction}`.replace(/^0+(?=\d)/, "") || "0";
  const scale = fraction.length + 3;
  const padded = digits.padStart(scale + 1, "0");
  const split = padded.length - scale;
  const result = `${padded.slice(0, split)}.${padded.slice(split)}`.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
  return result.startsWith(".") ? `0${result}` : result;
};

const normalizeNumeric = (numeric: string, factor: 1 | 0.001): string => {
  const comparator = numeric.match(/^[<>≤≥]\s*/)?.[0] ?? "";
  const body = numeric.slice(comparator.length);
  const range = body.match(new RegExp(`^(${NUMBER})(\\s*(?:-|–|—|to|至|到|降至|升至)\\s*)(${NUMBER})$`, "iu"));
  const convert = (value: string): string => factor === 0.001 ? decimalDivideThousand(value) : value.replace(/,/g, "");
  if (!range) return `${comparator}${convert(body.trim())}`;
  return `${comparator}${convert(range[1])}${range[2]}${convert(range[3])}`;
};

const specimenContext = (text: string, start: number, end: number, analyte: Analyte): "blood_cbc" | "non_blood" | "unknown" => {
  if (analyte === "platelets") return "blood_cbc";
  const context = text.slice(Math.max(0, start - 190), Math.min(text.length, end + 20));
  if (/(?:CSF|cerebrospinal|ascitic|pleural|peritoneal|urine|urinalysis|synovial|脑脊液|腹水|胸水|尿液|尿检|滑液)[^\n.;。；]{0,180}(?:WBC|white\s+blood|leukocyte|白细胞|白血球)/iu.test(context)) {
    return "non_blood";
  }
  return "blood_cbc";
};

const isNonCount = (text: string, start: number, end: number): boolean => {
  const context = text.slice(Math.max(0, start - 35), Math.min(text.length, end + 25));
  return /(?:corrected count increment|platelet increment|血小板增量|减当前值|divide by baseline|除以基线)/iu.test(context);
};

export const nearestAnalyte = (text: string, start: number, end: number): { analyte: Analyte; anchorStart: number; anchorEnd: number } | null => {
  const candidates: Array<{ analyte: Analyte; anchorStart: number; anchorEnd: number; distance: number }> = [];
  ANALYTE_RE.lastIndex = 0;
  for (const match of text.matchAll(ANALYTE_RE)) {
    const anchorStart = match.index ?? 0;
    const anchorEnd = anchorStart + match[0].length;
    const distance = anchorEnd <= start ? start - anchorEnd : anchorStart >= end ? anchorStart - end : 0;
    if (distance <= 90) candidates.push({ analyte: analyteFor(match[0]), anchorStart, anchorEnd, distance });
  }
  const valid = candidates.filter((candidate) => {
    const between = text.slice(Math.min(candidate.anchorEnd, end), Math.max(candidate.anchorStart, start));
    if (/[\n.;。；]/u.test(between)) return false;
    return !(candidate.analyte === "wbc" && /(?:ANC|absolute neutrophil|neutrophils?|RBC|red blood|中性粒细胞|红细胞)/iu.test(between));
  });
  const preceding = valid.filter((candidate) => candidate.anchorEnd <= start).sort((a, b) => a.distance - b.distance);
  const following = valid.filter((candidate) => candidate.anchorStart >= end).sort((a, b) => a.distance - b.distance);
  const best = preceding[0] ?? following[0];
  if (!best) return null;
  return best;
};

const canonicalizeExplicit = (analyte: Analyte, numeric: string, unit: string, wholeMatch: string): {
  canonical: string; canonicalNumeric: string; formClass: string; disposition: Disposition;
} => {
  const unitClass = normalizedUnitClass(unit);
  const factor = unitClass === "raw" ? 0.001 : 1;
  const canonicalNumeric = normalizeNumeric(numeric, factor);
  const canonical = `${canonicalNumeric} ×10³/µL`;
  const exactCanonical = unitClass === "canonical" && !wholeMatch.includes("(") && /^\S|./u.test(wholeMatch);
  const formClass = wholeMatch.includes("(")
    ? "NONCANONICAL_DUAL_DISPLAY"
    : unitClass === "raw" ? "ALTERNATE_SOURCE_FORM_PRIMARY"
      : unitClass === "si" ? "SI_PRIMARY_ONLY"
        : unitClass === "canonical" ? "CANONICAL_PRIMARY"
          : "CANONICAL_MAGNITUDE_NONCANONICAL_TOKEN";
  const disposition: Disposition = exactCanonical && wholeMatch === canonical
    ? "ALREADY_CANONICAL"
    : factor === 1 && !wholeMatch.includes("(") ? "NORMALIZE_TOKEN_ONLY" : "NORMALIZE_EXPLICIT";
  const check = toCanonicalMeasurementValue(analyte, numeric.replace(/^[<>≤≥]\s*/, "").split(/\s*(?:-|–|—|to|至|到|降至|升至)\s*/u)[0], unit.replace(/^(?:cells?|个)\s*/iu, ""));
  if (check === null && !/[<>≤≥-]/u.test(numeric)) throw new Error(`Live policy rejected ${analyte} ${numeric} ${unit}`);
  return { canonical, canonicalNumeric, formClass, disposition };
};

export const findExplicitMatches = (text: string, learnerFacing = true): RawMatch[] => {
  const matches: RawMatch[] = [];
  EXPLICIT_RE.lastIndex = 0;
  for (const match of text.matchAll(EXPLICIT_RE)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    const anchor = nearestAnalyte(text, start, end);
    if (!anchor) continue;
    const analyte = anchor.analyte;
    const specimen = specimenContext(text, Math.min(start, anchor.anchorStart), Math.max(end, anchor.anchorEnd), analyte);
    const nonCount = analyte === "platelets" && isNonCount(text, Math.min(start, anchor.anchorStart), Math.max(end, anchor.anchorEnd));
    const normalized = canonicalizeExplicit(analyte, match[1], match[2], match[0]);
    let disposition: Disposition = normalized.disposition;
    let note = "Exact analyte-keyed conversion under live measurement policy.";
    if (!learnerFacing) {
      disposition = "EXCLUDE_NON_LEARNER_FACING";
      note = "Path is a non-learner-facing source, configuration, identity, or audit branch.";
    } else if (specimen === "non_blood") {
      disposition = "EXCLUDE_NON_BLOOD";
      note = "Explicit context identifies a non-blood specimen.";
    } else if (nonCount) {
      disposition = "EXCLUDE_NON_COUNT";
      note = "Expression is a transfusion quantity or corrected-count-increment arithmetic, not a patient CBC count.";
    } else if (specimen === "unknown") {
      disposition = "BLOCKED_CONTEXT";
      note = "Specimen context cannot be established mechanically.";
    }
    matches.push({ analyte, start, end, matched: match[0], numeric: match[1], unit: match[2], canonical: normalized.canonical,
      canonicalNumeric: normalized.canonicalNumeric, formClass: normalized.formClass, specimen, disposition, note });
  }
  return matches;
};

const findImplicitMatches = (text: string, explicit: RawMatch[], learnerFacing: boolean): RawMatch[] => {
  const matches: RawMatch[] = [];
  if (!learnerFacing) return matches;
  ANALYTE_RE.lastIndex = 0;
  for (const anchor of text.matchAll(ANALYTE_RE)) {
    const anchorStart = anchor.index ?? 0;
    const anchorEnd = anchorStart + anchor[0].length;
    if (explicit.some((item) => item.analyte === analyteFor(anchor[0]) && item.start >= anchorEnd && item.start - anchorEnd <= 55)) continue;
    const after = text.slice(anchorStart + anchor[0].length, anchorStart + anchor[0].length + 65);
    const numberMatch = after.match(new RegExp(String.raw`^[^\d\n.;。；]{0,18}(${VALUE})`, "iu"));
    if (!numberMatch || numberMatch.index === undefined) continue;
    if (/(?:ANC|RBC|PT|aPTT|fibrinogen|hemoglobin|hematocrit|neutrophil|血红蛋白|红细胞|中性粒细胞|纤维蛋白原)/iu.test(numberMatch[0])) continue;
    const numberStart = anchorStart + anchor[0].length + numberMatch.index + numberMatch[0].lastIndexOf(numberMatch[1]);
    const numberEnd = numberStart + numberMatch[1].length;
    if (/[A-Za-z]/u.test(text.slice(numberStart - 1, numberStart)) || /[%kK万¹²³⁹]/u.test(text.slice(numberEnd, numberEnd + 1))) continue;
    if (explicit.some((item) => item.analyte === analyteFor(anchor[0]) && item.start <= numberStart && item.end >= numberEnd)) continue;
    const analyte = analyteFor(anchor[0]);
    const specimen = specimenContext(text, anchorStart, numberEnd, analyte);
    const nonCount = analyte === "platelets" && isNonCount(text, anchorStart, numberEnd);
    let disposition: Disposition = "PRESERVE_IMPLICIT";
    let note = "Blood-CBC numeric expression has no explicit unit; deliberately deferred.";
    if (!learnerFacing) {
      disposition = "EXCLUDE_NON_LEARNER_FACING";
      note = "Path is non-learner-facing.";
    } else if (specimen === "non_blood") {
      disposition = "EXCLUDE_NON_BLOOD";
      note = "Context identifies a non-blood specimen.";
    } else if (nonCount) {
      disposition = "EXCLUDE_NON_COUNT";
      note = "Expression is a transfusion quantity or CCI arithmetic.";
    }
    matches.push({ analyte, start: anchorStart, end: numberEnd, matched: text.slice(anchorStart, numberEnd), numeric: numberMatch[1], unit: null,
      canonical: null, canonicalNumeric: null, formClass: "MISSING_OR_IMPLICIT_UNIT", specimen, disposition, note });
  }
  return matches;
};

const findSupplementalMatches = (text: string, learnerFacing: boolean): RawMatch[] => {
  if (!learnerFacing) return [];
  const matches: RawMatch[] = [];
  const addImplicit = (analyte: Analyte, match: RegExpMatchArray): void => {
    const start = match.index ?? 0;
    matches.push({ analyte, start, end: start + match[0].length, matched: match[0], numeric: match[1], unit: null,
      canonical: null, canonicalNumeric: null, formClass: "MISSING_OR_IMPLICIT_UNIT", specimen: "blood_cbc",
      disposition: "PRESERVE_IMPLICIT", note: "Blood-CBC value uses implicit shorthand or omits an explicit unit; deliberately deferred." });
  };
  for (const match of text.matchAll(/(?:WBC|白细胞)\s*\(\s*(\d+(?:\.\d+)?k\s*[-–]\s*\d+(?:\.\d+)?k)\s*\)/giu)) addImplicit("wbc", match);
  if (/(?:platelet(?:s)?(?:\s+count)?|血小板计数)/iu.test(text)) {
    for (const regex of [
      /(?:Normal is|normal range:?|正常值为)\s*([<>≤≥]?\s*\d[\d,]*(?:\s*(?:-|–|to|至)\s*\d[\d,]*)?)/giu,
      /(?:Less than|below|低于)\s*([<>≤≥]?\s*\d[\d,]*)/giu,
    ]) for (const match of text.matchAll(regex)) {
      const start = match.index ?? 0;
      const anchor = nearestAnalyte(text, start, start + match[0].length);
      const prior = text.slice(Math.max(0, start - 150), start);
      if (anchor?.analyte === "platelets" || PLATELET_RE.test(prior)) addImplicit("platelets", match);
    }
  }
  const unrecognized: Array<{ regex: RegExp; numeric: (match: RegExpMatchArray) => string }> = [
    { regex: /platelet transfusion threshold of (ten thousand) per microliter/giu, numeric: (match) => match[1] },
    { regex: /血小板输注阈值为(1万)\/微升/giu, numeric: (match) => match[1] },
  ];
  for (const { regex, numeric } of unrecognized) for (const match of text.matchAll(regex)) {
    const start = match.index ?? 0;
    matches.push({ analyte: "platelets", start, end: start + match[0].length, matched: match[0], numeric: numeric(match), unit: match[0].includes("微升") ? "/微升" : "per microliter",
      canonical: null, canonicalNumeric: null, formClass: "UNRESOLVED_EXPLICIT_UNIT", specimen: "blood_cbc", disposition: "BLOCKED_CONTEXT",
      note: "Explicit natural-language unit/value form is outside the live parser's accepted source tokens; no mechanical mutation authorized." });
  }
  return matches;
};

const collectLeaves = (bankPath: string, bank: unknown): StringLeaf[] => {
  const leaves: StringLeaf[] = [];
  const walk = (
    value: unknown,
    displayPath: Array<string | number>,
    stablePath: Array<string | number | { id: string }>,
    topLevelQuestionId: string,
    embeddedQuestionId: string | null,
    learnerFacing: boolean,
  ): void => {
    if (typeof value === "string") {
      leaves.push({ bankPath, topLevelQuestionId, embeddedQuestionId, jsonPath: renderPath(displayPath), stablePath,
        value, language: displayPath.at(-1) === "en" ? "en" : displayPath.at(-1) === "zh" ? "zh" : "unknown",
        surface: surfaceFor(displayPath), learnerFacing });
      return;
    }
    if (value === null || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const itemId = item && typeof item === "object" && !Array.isArray(item) && typeof (item as { id?: unknown }).id === "string"
          ? (item as { id: string }).id : null;
        const isTop = displayPath.length === 1 && displayPath[0] === "questions";
        const isEmbedded = displayPath.at(-1) === "questions" && displayPath.includes("caseStudy");
        walk(item, [...displayPath, index], [...stablePath, itemId ? { id: itemId } : index],
          isTop && itemId ? itemId : topLevelQuestionId, isEmbedded && itemId ? itemId : embeddedQuestionId, learnerFacing);
      });
      return;
    }
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      const childLearnerFacing = learnerFacing && !NON_LEARNER_KEYS.has(key);
      walk(child, [...displayPath, key], [...stablePath, key], topLevelQuestionId, embeddedQuestionId, childLearnerFacing);
    }
  };
  walk(bank, [], [], "", null, true);
  return leaves.filter((leaf) => leaf.topLevelQuestionId !== "");
};

const readJsonLines = <T>(filePath: string): T[] => fs.readFileSync(filePath, "utf8").trim().split(/\n/u).filter(Boolean).map((line) => JSON.parse(line) as T);
const writeJsonLines = (filePath: string, rows: unknown[]): void => fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`);
const counterpartPathFor = (jsonPath: string): string | null => jsonPath.endsWith(".en") ? `${jsonPath.slice(0, -3)}.zh` : jsonPath.endsWith(".zh") ? `${jsonPath.slice(0, -3)}.en` : null;

const sortOccurrences = (a: OccurrenceRow, b: OccurrenceRow): number =>
  a.bankPath.localeCompare(b.bankPath) || a.topLevelQuestionId.localeCompare(b.topLevelQuestionId) ||
  (a.embeddedQuestionId ?? "").localeCompare(b.embeddedQuestionId ?? "") || a.jsonPath.localeCompare(b.jsonPath) ||
  a.occurrenceIndex - b.occurrenceIndex;

const replacementFor = (match: RawMatch): string => match.canonical ?? match.matched;

export const scanBanks = (): { occurrences: OccurrenceRow[]; dispositions: DispositionRow[]; leaves: StringLeaf[] } => {
  const seed = readJsonLines<Record<string, unknown>>(SEED_PATH);
  const seedKeys = new Set(seed.map((row) => `${row.bankPath}|${row.jsonPath}|${row.analyte}`));
  const bankFiles = fs.readdirSync(path.join(REPO_ROOT, "banks")).filter((name) => name.endsWith(".json")).sort();
  const leaves = bankFiles.flatMap((name) => {
    const bankPath = `banks/${name}`;
    return collectLeaves(bankPath, JSON.parse(fs.readFileSync(path.join(REPO_ROOT, bankPath), "utf8")));
  });
  const leafByPath = new Map(leaves.map((leaf) => [`${leaf.bankPath}|${leaf.jsonPath}`, leaf]));
  const rows: OccurrenceRow[] = [];
  for (const leaf of leaves) {
    if (!ANALYTE_RE.test(leaf.value)) { ANALYTE_RE.lastIndex = 0; continue; }
    ANALYTE_RE.lastIndex = 0;
    const explicit = findExplicitMatches(leaf.value, leaf.learnerFacing);
    const implicit = findImplicitMatches(leaf.value, explicit, leaf.learnerFacing);
    const supplemental = findSupplementalMatches(leaf.value, leaf.learnerFacing);
    const all = [...explicit, ...implicit, ...supplemental.filter((item) =>
      !explicit.some((candidate) => candidate.analyte === item.analyte &&
        ((candidate.start <= item.start && candidate.end >= item.end) || candidate.matched.includes(item.numeric))))]
      .sort((a, b) => a.start - b.start || b.end - a.end || a.analyte.localeCompare(b.analyte))
      .filter((item, index, items) => !items.slice(0, index).some((prior) =>
        prior.analyte === item.analyte && prior.unit === null && item.unit === null && prior.end === item.end));
    all.forEach((match, occurrenceIndex) => {
      const candidateKey = `${leaf.bankPath}|${leaf.jsonPath}|${match.analyte}`;
      rows.push({ occurrenceId: "", bankPath: leaf.bankPath, topLevelQuestionId: leaf.topLevelQuestionId,
        embeddedQuestionId: leaf.embeddedQuestionId, jsonPath: leaf.jsonPath, surface: leaf.surface, language: leaf.language,
        analyte: match.analyte, specimenContext: match.specimen, learnerFacing: leaf.learnerFacing, verbatimText: leaf.value,
        occurrenceIndex, startOffset: match.start, endOffset: match.end, matchedExpression: match.matched,
        numericExpression: match.numeric, unitExpression: match.unit, formClass: match.formClass,
        canonicalExpression: match.canonical, canonicalNumericExpression: match.canonicalNumeric,
        counterpartJsonPath: counterpartPathFor(leaf.jsonPath), parityClass: "NOT_APPLICABLE",
        candidateSource: seedKeys.has(candidateKey) ? "both" : "independent_traversal", disposition: match.disposition, notes: match.note });
    });
  }
  rows.sort(sortOccurrences);
  rows.forEach((row, index) => { row.occurrenceId = `occ-${String(index + 1).padStart(4, "0")}`; });
  const rowGroups = new Map<string, OccurrenceRow[]>();
  for (const row of rows) {
    const key = `${row.bankPath}|${row.jsonPath}|${row.analyte}`;
    if (!rowGroups.has(key)) rowGroups.set(key, []);
    rowGroups.get(key)!.push(row);
  }
  for (const row of rows) {
    if (!row.counterpartJsonPath || row.language === "unknown") continue;
    const counterpart = rowGroups.get(`${row.bankPath}|${row.counterpartJsonPath}|${row.analyte}`) ?? [];
    if (counterpart.length === 0) row.parityClass = "COUNTERPART_ABSENT";
    else {
      const numericKey = (item: OccurrenceRow): string => (item.canonicalNumericExpression ?? item.numericExpression)
        .match(/\d+(?:\.\d+)?/gu)?.join("|") ?? "";
      row.parityClass = counterpart.some((item) => numericKey(item) === numericKey(row)) ? "EQUIVALENT" : "POSSIBLE_MISMATCH";
    }
  }
  const byPath = new Map<string, OccurrenceRow[]>();
  for (const row of rows) {
    const key = `${row.bankPath}|${row.jsonPath}`;
    if (!byPath.has(key)) byPath.set(key, []);
    byPath.get(key)!.push(row);
  }
  const dispositions: DispositionRow[] = [];
  for (const [key, group] of byPath) {
    const leaf = leafByPath.get(key)!;
    const mutable = group.filter((row) => row.disposition === "NORMALIZE_EXPLICIT" || row.disposition === "NORMALIZE_TOKEN_ONLY");
    const unsafe = group.filter((row) => row.disposition === "BLOCKED_CONTEXT" ||
      ((row.disposition === "NORMALIZE_EXPLICIT" || row.disposition === "NORMALIZE_TOKEN_ONLY") && row.parityClass === "POSSIBLE_MISMATCH"));
    let disposition: Disposition;
    let after: string | null = null;
    let reason: string;
    const changes: Array<{ before: string; after: string }> = [];
    if (mutable.length > 0 && unsafe.length === 0) {
      disposition = mutable.some((row) => row.disposition === "NORMALIZE_EXPLICIT") ? "NORMALIZE_EXPLICIT" : "NORMALIZE_TOKEN_ONLY";
      let output = leaf.value;
      for (const row of [...mutable].sort((a, b) => b.startOffset - a.startOffset)) {
        const replacement = row.canonicalExpression!;
        output = `${output.slice(0, row.startOffset)}${replacement}${output.slice(row.endOffset)}`;
        changes.push({ before: row.matchedExpression, after: replacement });
      }
      after = output;
      reason = "All explicit blood-CBC WBC/platelet expressions on this path convert exactly under live policy.";
    } else if (mutable.length > 0) {
      disposition = "BLOCKED_CONTEXT";
      reason = "A path-local context or bilingual parity conflict prevents a fail-closed whole-string patch.";
    } else {
      const priority: Disposition[] = ["BLOCKED_CONTEXT", "EXCLUDE_NON_BLOOD", "EXCLUDE_NON_COUNT", "EXCLUDE_NON_LEARNER_FACING", "PRESERVE_IMPLICIT", "ALREADY_CANONICAL"];
      disposition = priority.find((candidate) => group.some((row) => row.disposition === candidate)) ?? "BLOCKED_CONTEXT";
      reason = group.find((row) => row.disposition === disposition)?.notes ?? "No mutation authorized.";
    }
    const counterpartJsonPath = counterpartPathFor(leaf.jsonPath);
    const counterpartGroup = counterpartJsonPath ? byPath.get(`${leaf.bankPath}|${counterpartJsonPath}`) ?? [] : [];
    const pairedMutationRequired = mutable.length > 0 && counterpartGroup.some((row) => row.disposition === "NORMALIZE_EXPLICIT" || row.disposition === "NORMALIZE_TOKEN_ONLY");
    dispositions.push({ bankPath: leaf.bankPath, topLevelQuestionId: leaf.topLevelQuestionId, embeddedQuestionId: leaf.embeddedQuestionId,
      jsonPath: leaf.jsonPath, patchPath: leaf.stablePath.slice(2), language: leaf.language, before: leaf.value, after, occurrenceIds: group.map((row) => row.occurrenceId),
      disposition, reason, counterpartJsonPath, pairedMutationRequired, changedSubstrings: changes.reverse() });
  }
  dispositions.sort((a, b) => a.bankPath.localeCompare(b.bankPath) || a.topLevelQuestionId.localeCompare(b.topLevelQuestionId) ||
    (a.embeddedQuestionId ?? "").localeCompare(b.embeddedQuestionId ?? "") || a.jsonPath.localeCompare(b.jsonPath));
  return { occurrences: rows, dispositions, leaves };
};

const verifyDiff = (dispositions: DispositionRow[]): void => {
  const planned = new Set(dispositions.filter((row) => row.after !== null).map((row) => `${row.bankPath}|${row.jsonPath}`));
  const actual = new Set<string>();
  for (const bankPath of [...new Set(dispositions.filter((row) => row.after !== null).map((row) => row.bankPath))]) {
    const before = JSON.parse(execFileSync("git", ["show", `HEAD:${bankPath}`], { cwd: REPO_ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })) as unknown;
    const after = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, bankPath), "utf8")) as unknown;
    const walk = (a: unknown, b: unknown, parts: Array<string | number>): void => {
      if (typeof a === "string" && typeof b === "string") { if (a !== b) actual.add(`${bankPath}|${renderPath(parts)}`); return; }
      if (Array.isArray(a) && Array.isArray(b)) { if (a.length !== b.length) throw new Error(`${bankPath} array length changed at ${renderPath(parts)}`); a.forEach((v, i) => walk(v, b[i], [...parts, i])); return; }
      if (a && b && typeof a === "object" && typeof b === "object") {
        if (JSON.stringify(Object.keys(a as object)) !== JSON.stringify(Object.keys(b as object))) throw new Error(`${bankPath} object keys changed at ${renderPath(parts)}`);
        for (const key of Object.keys(a as object)) walk((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key], [...parts, key]);
        return;
      }
      if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${bankPath} non-string value changed at ${renderPath(parts)}`);
    };
    walk(before, after, []);
  }
  const missing = [...planned].filter((key) => !actual.has(key));
  const extra = [...actual].filter((key) => !planned.has(key));
  if (missing.length || extra.length) throw new Error(`Exact-diff mismatch: missing=${JSON.stringify(missing)} extra=${JSON.stringify(extra)}`);
  console.log(`EXACT_DIFF_PASS changedPaths=${actual.size}`);
};

const main = (): void => {
  const verifyOnly = process.argv.includes("--verify-diff");
  if (verifyOnly) {
    verifyDiff(readJsonLines<DispositionRow>(DISPOSITIONS_PATH));
    return;
  }
  const postScan = process.argv.includes("--post");
  const result = scanBanks();
  fs.mkdirSync(AUDIT_DIR, { recursive: true });
  writeJsonLines(postScan ? POST_MANIFEST_PATH : MANIFEST_PATH, result.occurrences);
  writeJsonLines(postScan ? POST_DISPOSITIONS_PATH : DISPOSITIONS_PATH, result.dispositions);
  const changed = result.dispositions.filter((row) => row.after !== null);
  const blocked = result.dispositions.filter((row) => row.disposition === "BLOCKED_CONTEXT");
  const byDisposition = Object.fromEntries([...new Set(result.dispositions.map((row) => row.disposition))].sort().map((key) => [key, result.dispositions.filter((row) => row.disposition === key).length]));
  const summary: Record<string, unknown> = { scan: postScan ? "post" : "pre", occurrences: result.occurrences.length, paths: result.dispositions.length, changedPaths: changed.length,
    changedEn: changed.filter((row) => row.language === "en").length, changedZh: changed.filter((row) => row.language === "zh").length,
    blockedPaths: blocked.length, rationaleCorrectOccurrences: result.occurrences.filter((row) => row.jsonPath.includes("rationale.correct")).length,
    dispositions: byDisposition };
  if (postScan) {
    const pre = readJsonLines<DispositionRow>(DISPOSITIONS_PATH);
    const authorized = new Set(pre.filter((row) => row.after !== null).map((row) => `${row.bankPath}|${row.jsonPath}`));
    const residual = result.occurrences.filter((row) => authorized.has(`${row.bankPath}|${row.jsonPath}`) &&
      (row.disposition === "NORMALIZE_EXPLICIT" || row.disposition === "NORMALIZE_TOKEN_ONLY"));
    const globalSafeResidual = result.occurrences.filter((row) => row.disposition === "NORMALIZE_EXPLICIT" || row.disposition === "NORMALIZE_TOKEN_ONLY");
    if (residual.length || globalSafeResidual.length) throw new Error(`Post-scan residuals: authorized=${residual.length} global=${globalSafeResidual.length}`);
    summary.authorizedResiduals = 0;
    summary.globalSafeExplicitResiduals = 0;
    summary.authorizedPathsObservedCanonical = new Set(result.occurrences.filter((row) =>
      authorized.has(`${row.bankPath}|${row.jsonPath}`) && row.disposition === "ALREADY_CANONICAL").map((row) => `${row.bankPath}|${row.jsonPath}`)).size;
  }
  console.log(JSON.stringify(summary, null, 2));
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
