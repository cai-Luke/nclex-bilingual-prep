/**
 * exhibit-flowsheet-gate.ts — deterministic gate for exhibit-flowsheet extraction.
 *
 * Reconciles a junior-model extraction file against the live canonical banks it
 * was derived from. This is the "checker" end of the producer≠checker split for
 * the exhibit-flowsheet migration (see EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md):
 * the model proposes structured panels; this script is the primary check, not a
 * second LLM. Every gate here is mechanical.
 *
 * GATES (per the proposal):
 *   GATE 1  verbatim containment — each keyed/excluded/alias value is a byte-exact
 *           substring of the source content.en after NFC normalization.
 *   GATE 2  exclusion accounting — ADVISORY here. The gate validates that every SUPPLIED
 *           exclusion is well-formed (allowlisted label, verbatim value, reason ∈
 *           {prior,trend,serial}), and runs a best-effort source sweep that WARNs when an
 *           allowlisted-looking measurement token in the source is neither keyed nor
 *           excluded. That sweep is heuristic (free-prose tokenizing is not deterministic),
 *           so its misses/false-positives are WARN, never FAIL. Authoritative
 *           completeness/selection is owned by the answer key + Claude adjudication, not by
 *           this gate. (post_intervention is NOT an exclusion reason — Rule F.)
 *   GATE 3  narrative preservation — the gate never mutates the bank; it only reads.
 *           (Enforced by construction: this script has no write path.)
 *   GATE 4  dimensional sanity — each keyed value, interpreted in its sourceUnit and
 *           converted to the analyte's canonical unit, falls within sanity{min,max}.
 *
 * RULE CHECKS:
 *   Rule A  every label is an allowlist key.
 *   Rule C  keyed entries carry sourceUnit (not a registry-stamped unit); sourceUnit
 *           must be a recognized unit for that analyte (canonical, alt, or known variant).
 *   Rule D  a skip_serial record carries only {exhibitRef, lane} and no arrays; and the
 *           gate independently re-derives the serial flag (any allowlisted parameter, not
 *           just BP) to confirm the skip was earned and to flag a serial exhibit mislabeled
 *           as extract.
 *   Rule E  sourceSpan is REQUIRED on every panel[] and excludedValues[] entry and must be
 *           a verbatim substring of the source. Missing or non-verbatim → FAIL.
 *   Rule F  post_intervention is a keyed panel context tag, never an excluded reason.
 *
 * USAGE:
 *   npx tsx scripts/exhibit-flowsheet-gate.ts <extraction.json> [--bank <bank.json> ...]
 *   npx tsx scripts/exhibit-flowsheet-gate.ts <extraction.json> --blind <cases.json>
 * With no --bank/--blind, the default canonical set that carries case studies is scanned.
 * --blind reads a flat array of { exhibitRef, content:{en,zh} } fixtures (the blind test set)
 * and resolves exhibitRef → content.en directly, bypassing the bank/question walk.
 *
 * EXIT: non-zero if any FAIL-level finding is present. WARN-level findings (GATE 4 out-of-band,
 * which can be a genuinely extreme real value) are reported but do not fail the run; they route
 * to human adjudication. Use --strict to promote WARN to FAIL.
 */

import { readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBankText, getRawQuestions } from "../src/bankImport";
import type { Question, CaseStudyExhibit, TextPair } from "../src/types";

// ----------------------------------------------------------------------------
// Allowlist + units, mirrored from the live registries. The proposal calls for a
// shared measurementAllowlist module; until that lands, this table is derived by
// hand from VITAL_DEFS (vitals_trend/index.ts) and ANALYTE_DEFS (lab_trend/index.ts).
// Keep in sync until the shared module exists; a drift guard test asserts equality.
// ----------------------------------------------------------------------------

type Allow = {
  canonicalUnit: string;
  altUnits: string[];
  // sanity bounds are expressed in the CANONICAL unit
  sanity: { min: number; max: number };
};

const VITALS: Record<string, Allow> = {
  hr:   { canonicalUnit: "bpm",  altUnits: [], sanity: { min: 10, max: 300 } },
  sbp:  { canonicalUnit: "mmHg", altUnits: [], sanity: { min: 40, max: 300 } },
  dbp:  { canonicalUnit: "mmHg", altUnits: [], sanity: { min: 20, max: 200 } },
  map:  { canonicalUnit: "mmHg", altUnits: [], sanity: { min: 30, max: 250 } },
  rr:   { canonicalUnit: "/min", altUnits: [], sanity: { min: 2,  max: 80 } },
  spo2: { canonicalUnit: "%",    altUnits: [], sanity: { min: 50, max: 100 } },
  temp: { canonicalUnit: "°C",   altUnits: ["°F", "F", "C"], sanity: { min: 30, max: 110 } },
};

const LABS: Record<string, Allow> = {
  sodium:          { canonicalUnit: "mEq/L", altUnits: ["mmol/L"], sanity: { min: 90, max: 200 } },
  potassium:       { canonicalUnit: "mEq/L", altUnits: ["mmol/L"], sanity: { min: 1.0, max: 10.0 } },
  chloride:        { canonicalUnit: "mEq/L", altUnits: ["mmol/L"], sanity: { min: 60, max: 160 } },
  bicarbonate:     { canonicalUnit: "mEq/L", altUnits: ["mmol/L"], sanity: { min: 3, max: 60 } },
  anion_gap:       { canonicalUnit: "mEq/L", altUnits: [], sanity: { min: 0, max: 50 } },
  bun:             { canonicalUnit: "mg/dL", altUnits: ["mmol/L"], sanity: { min: 1, max: 250 } },
  creatinine:      { canonicalUnit: "mg/dL", altUnits: ["µmol/L"], sanity: { min: 0.1, max: 25 } },
  glucose:         { canonicalUnit: "mg/dL", altUnits: ["mmol/L"], sanity: { min: 10, max: 1500 } },
  calcium:         { canonicalUnit: "mg/dL", altUnits: ["mmol/L"], sanity: { min: 3, max: 20 } },
  ionized_calcium: { canonicalUnit: "mmol/L", altUnits: ["mg/dL"], sanity: { min: 0.3, max: 5.0 } },
  magnesium:       { canonicalUnit: "mg/dL", altUnits: ["mmol/L"], sanity: { min: 0.3, max: 10 } },
  phosphate:       { canonicalUnit: "mg/dL", altUnits: ["mmol/L"], sanity: { min: 0.2, max: 20 } },
  lactate:         { canonicalUnit: "mmol/L", altUnits: [], sanity: { min: 0.1, max: 30 } },
  troponin_t:      { canonicalUnit: "ng/mL", altUnits: ["µg/L"], sanity: { min: 0, max: 50 } },
  bnp:             { canonicalUnit: "pg/mL", altUnits: [], sanity: { min: 0, max: 10000 } },
  wbc:             { canonicalUnit: "×10⁹/L", altUnits: ["K/µL", "×10³/µL", "/µL"], sanity: { min: 0, max: 200 } },
  hemoglobin:      { canonicalUnit: "g/dL", altUnits: ["g/L"], sanity: { min: 2, max: 25 } },
  hematocrit:      { canonicalUnit: "%", altUnits: [], sanity: { min: 5, max: 80 } },
  platelets:       { canonicalUnit: "×10⁹/L", altUnits: ["K/µL", "×10³/µL", "/µL"], sanity: { min: 0, max: 2000 } },
  inr:             { canonicalUnit: "(ratio)", altUnits: [], sanity: { min: 0.5, max: 12 } },
  ptt:             { canonicalUnit: "seconds", altUnits: ["sec"], sanity: { min: 10, max: 200 } },
  ph:              { canonicalUnit: "(unitless)", altUnits: [], sanity: { min: 6.5, max: 8.0 } },
  paco2:           { canonicalUnit: "mmHg", altUnits: [], sanity: { min: 5, max: 100 } },
  pao2:            { canonicalUnit: "mmHg", altUnits: [], sanity: { min: 10, max: 600 } },
  hco3_abg:        { canonicalUnit: "mEq/L", altUnits: ["mmol/L"], sanity: { min: 5, max: 50 } },
  ast:             { canonicalUnit: "U/L", altUnits: [], sanity: { min: 0, max: 10000 } },
  alt:             { canonicalUnit: "U/L", altUnits: [], sanity: { min: 0, max: 10000 } },
  total_bilirubin: { canonicalUnit: "mg/dL", altUnits: [], sanity: { min: 0, max: 60 } },
  ammonia:         { canonicalUnit: "µmol/L", altUnits: ["µg/dL"], sanity: { min: 0, max: 500 } },
};

const ALLOW: Record<string, Allow> = { ...VITALS, ...LABS };
const ALLOW_KEYS = new Set(Object.keys(ALLOW));

const EXCLUSION_REASONS = new Set(["prior", "trend", "serial"]);
const CONTEXT_TAGS = new Set(["post_intervention"]);
const IMPLICIT_SOURCE_UNITS: Record<string, Set<string>> = {
  hr: new Set(["bpm"]),
  rr: new Set(["/min"]),
  sbp: new Set(["mmhg"]),
  dbp: new Set(["mmhg"]),
  map: new Set(["mmhg"]),
};

// ----------------------------------------------------------------------------
// Source-label synonym patterns → allowlist key. Used by the generalized serial
// detector (Rule D) and the advisory GATE 2 source sweep. Mirrors the synonym map
// in the extraction proposal (Rule A). These are intentionally conservative: a miss
// is a WARN at worst (GATE 2 is advisory), never a FAIL, so we prefer specific
// patterns over greedy ones. `sbp`/`dbp` share the BP pattern (a BP token implies both).
// ----------------------------------------------------------------------------

const LABEL_PATTERNS: Array<{ key: string; re: RegExp }> = [
  { key: "bp",              re: /\bBP\b|blood pressure/gi }, // pseudo-key: expands to sbp+dbp downstream
  { key: "map",            re: /\bMAP\b/g },
  { key: "hr",             re: /\bHR\b|heart rate|\bpulse\b/gi },
  { key: "rr",             re: /\bRR\b|respiratory rate/gi },
  { key: "spo2",           re: /\bSpO₂\b|\bSpO2\b|\bSaO2\b|O2 sat|oxygen saturation/gi },
  { key: "temp",           re: /\btemperature\b|\btemp\b/gi },
  { key: "sodium",         re: /\bsodium\b|\bNa\b/g },
  { key: "potassium",      re: /\bpotassium\b|\bK\b/g },
  { key: "chloride",       re: /\bchloride\b|\bCl\b/g },
  { key: "bicarbonate",    re: /\bbicarbonate\b/gi },
  { key: "bun",            re: /\bBUN\b/g },
  { key: "creatinine",     re: /\bcreatinine\b/gi },
  { key: "glucose",        re: /\bglucose\b/gi },
  { key: "calcium",        re: /\bcalcium\b/gi },
  { key: "magnesium",      re: /\bmagnesium\b/gi },
  { key: "phosphate",      re: /\bphosphate\b|\bphosphorus\b/gi },
  { key: "lactate",        re: /\blactate\b/gi },
  { key: "troponin_t",     re: /\btroponin\b/gi },
  { key: "bnp",            re: /\bBNP\b/g },
  { key: "wbc",            re: /\bWBC\b/g },
  { key: "hemoglobin",     re: /\bhemoglobin\b|\bHgb\b|\bHb\b/g },
  { key: "hematocrit",     re: /\bhematocrit\b|\bHct\b/g },
  { key: "platelets",      re: /\bplatelets?\b|\bplt\b/gi },
  { key: "inr",            re: /\bINR\b/g },
  { key: "ptt",            re: /\bPTT\b|\baPTT\b/g },
  { key: "ast",            re: /\bAST\b/g },
  { key: "alt",            re: /\bALT\b/g },
  { key: "total_bilirubin", re: /\btotal bilirubin\b|\bbilirubin\b/gi },
  { key: "ammonia",        re: /\bammonia\b/gi },
];

// Count how many distinct timepoint-adjacent occurrences a label pattern has in the
// source. Deterministic and conservative: we count matches of the label pattern and,
// separately, distinct timepoint tokens; a label is "serial" when it appears ≥2 times
// AND there are ≥2 distinct timepoints in the exhibit.
const labelHitCount = (source: string, re: RegExp): number =>
  (source.match(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g")) ?? []).length;

// ----------------------------------------------------------------------------
// Unit conversion to canonical, for GATE 4. Only scale factors that actually
// appear in the allowlist alt/variant units are encoded; an unrecognized unit is
// a Rule C failure (reported separately) and skips GATE 4 rather than guessing.
// The map key is `${analyteKey}|${normalizedSourceUnit}` → multiply source value
// by factor to get canonical. Temp is handled specially (affine, not linear).
// ----------------------------------------------------------------------------

const normalizeUnit = (u: string): string =>
  u.normalize("NFC").replace(/\s+/g, "").replace(/·/g, "").toLowerCase();

const sourceContainsUnit = (source: string, sourceUnit: string): boolean => {
  const compactSource = normalizeUnit(source);
  const compactUnit = normalizeUnit(sourceUnit);
  if (compactSource.includes(compactUnit)) return true;
  if (compactUnit === "mmhg" && /\bmm\s*hg\b/i.test(source)) return true;
  return false;
};

const isImplicitUnitAllowed = (key: string, sourceUnit: string): boolean =>
  IMPLICIT_SOURCE_UNITS[key]?.has(normalizeUnit(sourceUnit)) ?? false;

// factor to convert SOURCE value → CANONICAL value (linear analytes only)
const LINEAR_FACTORS: Record<string, number> = {
  // CBC counts: registry canonical is ×10⁹/L.
  //   ×10³/µL == ×10⁹/L  (same scale) → factor 1
  //   K/µL    == ×10⁹/L  (same scale) → factor 1
  //   /µL (plain per-microliter): 1 /µL = 1e6 /L = 1e-3 ×10⁹/L.
  //     So 18,000 /µL = 18 ×10⁹/L → factor 1e-3. This is the platelet-defect catch:
  //     if the extractor mislabels 18,000 as sourceUnit ×10⁹/L (factor 1), GATE 4
  //     sees 18,000 ×10⁹/L, which exceeds the platelets sanity max of 2000 → WARN.
  "wbc|/µl": 1e-3,
  "wbc|×10³/µl": 1,
  "wbc|k/µl": 1,
  "wbc|×10⁹/l": 1,
  "platelets|/µl": 1e-3,
  "platelets|×10³/µl": 1,
  "platelets|k/µl": 1,
  "platelets|×10⁹/l": 1,
};

const toCanonical = (key: string, rawValue: string, sourceUnit: string): number | null => {
  const cleaned = rawValue.replace(/,/g, "").replace(/[<>]/g, "").trim();
  const num = Number(cleaned);
  if (!Number.isFinite(num)) return null;
  const nu = normalizeUnit(sourceUnit);

  if (key === "temp") {
    // canonical is °C. Convert if source is Fahrenheit.
    if (nu === "°f" || nu === "f") return (num - 32) * (5 / 9);
    return num; // °C or C
  }

  const override = LINEAR_FACTORS[`${key}|${nu}`];
  if (override !== undefined) return num * override;

  const def = ALLOW[key];
  const canon = normalizeUnit(def.canonicalUnit);
  const alts = def.altUnits.map(normalizeUnit);
  if (nu === canon) return num;
  // Alt unit with no encoded factor: numeric scale may differ (e.g. glucose mg/dL
  // vs mmol/L is ~18×). Rather than assert a possibly-wrong bound, return null so
  // GATE 4 is skipped and the entry is surfaced as a unit ambiguity for review.
  if (alts.includes(nu)) return null;
  return null;
};

// ----------------------------------------------------------------------------
// Bank loading + exhibit resolution
// ----------------------------------------------------------------------------

const DEFAULT_BANKS = [
  "banks/hard-cases-canonical.json",
  "banks/claude-canonical.json",
  "banks/gpt-canonical.json",
  "banks/gemini-canonical.json",
];

const en = (t: TextPair | undefined): string => (t?.en ?? "");

const allExhibits = (q: Question): CaseStudyExhibit[] => {
  if (q.itemType !== "case_study") return [];
  const cs = q.caseStudy;
  const out: CaseStudyExhibit[] = [...(cs.exhibits ?? [])];
  for (const st of cs.stages ?? []) out.push(...(st.exhibits ?? []));
  return out;
};

type ExhibitIndex = Map<string, string>; // "caseId/exhibitId" → content.en

const buildExhibitIndex = async (bankPaths: string[]): Promise<ExhibitIndex> => {
  const idx: ExhibitIndex = new Map();
  for (const p of bankPaths) {
    let text: string;
    try {
      text = await readFile(p, "utf8");
    } catch {
      console.error(`[warn] could not read bank ${p}; skipping`);
      continue;
    }
    const questions = getRawQuestions(parseBankText(text)) as Question[];
    for (const q of questions) {
      for (const ex of allExhibits(q)) {
        idx.set(`${q.id}/${ex.id}`, en(ex.content).normalize("NFC"));
      }
    }
  }
  return idx;
};

// --blind mode: a flat array of { exhibitRef, content:{en,zh} } test fixtures.
// Resolves exhibitRef → content.en directly, bypassing the bank/question walk.
type BlindCase = { exhibitRef: string; content?: TextPair };

const buildBlindIndex = async (casesPath: string): Promise<ExhibitIndex> => {
  const idx: ExhibitIndex = new Map();
  const raw = await readFile(casesPath, "utf8");
  const cases = JSON.parse(raw) as BlindCase[];
  for (const c of cases) {
    if (!c.exhibitRef) continue;
    idx.set(c.exhibitRef, en(c.content).normalize("NFC"));
  }
  return idx;
};

// ----------------------------------------------------------------------------
// Serial re-derivation (Rule D independent check) — generalized to ANY allowlisted
// parameter, not just BP. An exhibit is serial when some allowlisted parameter
// appears ≥2 times AND the exhibit carries ≥2 distinct timepoint tokens. Returns the
// set of parameter keys that look serial (empty = not serial).
// ----------------------------------------------------------------------------

const TIMESTAMP = /\b([01]?\d|2[0-3]):[0-5]\d\b|\b\d{1,2}:\d{2}\s?(?:AM|PM)\b|\b\d{1,2}\s?(?:AM|PM)\b|\b(?:[01]\d|2[0-3])[0-5]\d\b/gi;

const serialParams = (source: string): string[] => {
  const times = source.match(TIMESTAMP) ?? [];
  const distinctTimes = new Set(times.map((t) => t.toLowerCase().replace(/\s+/g, "")));
  if (distinctTimes.size < 2) return [];
  const hits: string[] = [];
  for (const { key, re } of LABEL_PATTERNS) {
    if (labelHitCount(source, re) >= 2) hits.push(key === "bp" ? "sbp/dbp" : key);
  }
  return hits;
};

const looksSerial = (source: string): boolean => serialParams(source).length > 0;

// ----------------------------------------------------------------------------
// Extraction record types (mirror the proposal's emitted shape)
// ----------------------------------------------------------------------------

type PanelEntry = { label: string; value: string; sourceUnit?: string; sourceSpan?: string; context?: string };
type ExcludedEntry = { label: string; value: string; reason: string; sourceSpan?: string };
type AliasEntry = { aliasOf: string; value: string };
type ExtractionRecord = {
  exhibitRef: string;
  lane: "extract" | "skip_serial";
  panel?: PanelEntry[];
  excludedValues?: ExcludedEntry[];
  unitAliases?: AliasEntry[];
};

type Finding = { level: "FAIL" | "WARN"; ref: string; msg: string };

const nfc = (s: string): string => s.normalize("NFC");

// ----------------------------------------------------------------------------
// Core gate
// ----------------------------------------------------------------------------

const gateRecord = (rec: ExtractionRecord, source: string | undefined): Finding[] => {
  const f: Finding[] = [];
  const ref = rec.exhibitRef;
  const push = (level: Finding["level"], msg: string) => f.push({ level, ref, msg });

  if (source === undefined) {
    push("FAIL", "exhibitRef not found in any scanned bank");
    return f;
  }
  const src = nfc(source);

  if (rec.lane === "skip_serial") {
    const extra = Object.keys(rec).filter((k) => k !== "exhibitRef" && k !== "lane");
    if (extra.length) push("FAIL", `skip_serial record carries extra keys: ${extra.join(", ")}`);
    if (!looksSerial(src)) push("WARN", "lane=skip_serial but serial detector did not re-confirm ≥2 timepoints; verify");
    return f;
  }

  // Rule D negative check: an extract record must NOT be a serial exhibit.
  const serialHits = serialParams(src);
  if (serialHits.length) push("WARN", `lane=extract but exhibit looks serial (${serialHits.join(", ")} repeated across ≥2 timepoints); should this be skip_serial?`);

  const panel = rec.panel ?? [];
  const excluded = rec.excludedValues ?? [];
  const aliases = rec.unitAliases ?? [];

  for (const [i, e] of panel.entries()) {
    const at = `panel[${i}] ${e.label}=${e.value}`;
    // Rule A: allowlisted label
    if (!ALLOW_KEYS.has(e.label)) push("FAIL", `${at}: label not in allowlist`);
    // GATE 1: value verbatim
    if (!src.includes(nfc(e.value))) push("FAIL", `${at}: value not a verbatim substring of source`);
    // Rule E: sourceSpan REQUIRED and verbatim
    if (!e.sourceSpan) {
      push("FAIL", `${at}: missing sourceSpan (Rule E: required)`);
    } else if (!src.includes(nfc(e.sourceSpan))) {
      push("FAIL", `${at}: sourceSpan not a verbatim substring`);
    }
    // Rule C: sourceUnit present + recognized
    if (!e.sourceUnit) {
      push("FAIL", `${at}: missing sourceUnit (Rule C)`);
    } else if (ALLOW_KEYS.has(e.label)) {
      const def = ALLOW[e.label];
      const recognized = [def.canonicalUnit, ...def.altUnits].map(normalizeUnit);
      if (!recognized.includes(normalizeUnit(e.sourceUnit))) {
        push("FAIL", `${at}: sourceUnit '${e.sourceUnit}' not recognized for ${e.label} (canonical ${def.canonicalUnit}, alts [${def.altUnits.join(", ")}])`);
      }
      const unitSource = e.sourceSpan ? nfc(e.sourceSpan) : src;
      if (!sourceContainsUnit(unitSource, e.sourceUnit) && !isImplicitUnitAllowed(e.label, e.sourceUnit)) {
        push("FAIL", `${at}: sourceUnit '${e.sourceUnit}' is not a verbatim source unit in sourceSpan/source and is not an allowed implicit vital unit`);
      }
    }
    // Rule F: context tag, if present, is in the closed set
    if (e.context && !CONTEXT_TAGS.has(e.context)) push("FAIL", `${at}: context '${e.context}' not a recognized tag`);
    // GATE 4: dimensional sanity
    if (ALLOW_KEYS.has(e.label) && e.sourceUnit) {
      const canonVal = toCanonical(e.label, e.value, e.sourceUnit);
      if (canonVal === null) {
        push("WARN", `${at}: could not convert '${e.value} ${e.sourceUnit}' to canonical; GATE 4 skipped (verify unit)`);
      } else {
        const { min, max } = ALLOW[e.label].sanity;
        if (canonVal < min || canonVal > max) {
          push("WARN", `${at}: GATE 4 out of band — ${e.value} ${e.sourceUnit} = ${canonVal.toPrecision(4)} ${ALLOW[e.label].canonicalUnit}, sanity [${min}, ${max}] (likely value+unit mismatch)`);
        }
      }
    }
  }

  for (const [i, e] of excluded.entries()) {
    const at = `excludedValues[${i}] ${e.label}=${e.value}`;
    if (!ALLOW_KEYS.has(e.label)) push("FAIL", `${at}: label not in allowlist`);
    if (!src.includes(nfc(e.value))) push("FAIL", `${at}: value not a verbatim substring of source`);
    // Rule E: sourceSpan REQUIRED and verbatim on exclusions too
    if (!e.sourceSpan) {
      push("FAIL", `${at}: missing sourceSpan (Rule E: required)`);
    } else if (!src.includes(nfc(e.sourceSpan))) {
      push("FAIL", `${at}: sourceSpan not a verbatim substring`);
    }
    // Rule F: post_intervention must not appear as an exclusion reason
    if (e.reason === "post_intervention") push("FAIL", `${at}: post_intervention is a keyed context, not an exclusion reason (Rule F)`);
    else if (!EXCLUSION_REASONS.has(e.reason)) push("FAIL", `${at}: reason '${e.reason}' not in {prior, trend, serial}`);
  }

  for (const [i, a] of aliases.entries()) {
    const at = `unitAliases[${i}] aliasOf=${a.aliasOf}`;
    if (!ALLOW_KEYS.has(a.aliasOf)) push("FAIL", `${at}: aliasOf not in allowlist`);
    if (!panel.some((e) => e.label === a.aliasOf)) push("FAIL", `${at}: unit alias has no keyed panel entry for '${a.aliasOf}'`);
    if (!src.includes(nfc(a.value))) push("FAIL", `${at}: alias value not a verbatim substring of source`);
  }

  // GATE 2 (advisory): best-effort source sweep. For each allowlisted label whose
  // synonym pattern appears in the source, check that the label is accounted for
  // somewhere in the record (keyed OR excluded OR aliased). A present-in-source label
  // with no accounting is a WARN, never a FAIL — the sweep is heuristic (it cannot tell
  // a patient measurement from a reference range or a drug name collision), so it
  // surfaces candidates for the answer key / Claude, not verdicts.
  const accounted = new Set<string>();
  for (const e of panel) accounted.add(e.label);
  for (const e of excluded) accounted.add(e.label);
  for (const a of aliases) accounted.add(a.aliasOf);
  for (const { key, re } of LABEL_PATTERNS) {
    if (labelHitCount(src, re) === 0) continue;
    if (key === "bp") {
      if (!accounted.has("sbp") && !accounted.has("dbp")) {
        push("WARN", `GATE 2 (advisory): source mentions blood pressure but neither sbp nor dbp is keyed/excluded; verify completeness`);
      }
      continue;
    }
    if (!accounted.has(key)) {
      push("WARN", `GATE 2 (advisory): source mentions '${key}' but it is neither keyed nor excluded; verify completeness (may be a reference range or name collision)`);
    }
  }

  return f;
};

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------

const main = async () => {
  const args = process.argv.slice(2);
  const strict = args.includes("--strict");
  const bankFlagIdx = args.indexOf("--bank");
  const blindFlagIdx = args.indexOf("--blind");
  const positional = args.filter((a) => !a.startsWith("--"));
  const extractionPath = positional[0];
  if (!extractionPath) {
    console.error("Usage: npx tsx scripts/exhibit-flowsheet-gate.ts <extraction.json> [--bank <bank.json> ...] [--blind <cases.json>] [--strict]");
    process.exit(2);
  }

  let idx: ExhibitIndex;
  if (blindFlagIdx !== -1) {
    const casesPath = args[blindFlagIdx + 1];
    if (!casesPath || casesPath.startsWith("--")) {
      console.error("--blind requires a path to the flat cases JSON");
      process.exit(2);
    }
    idx = await buildBlindIndex(casesPath);
  } else {
    const banks = bankFlagIdx === -1
      ? DEFAULT_BANKS
      : args.slice(bankFlagIdx + 1).filter((a) => !a.startsWith("--"));
    idx = await buildExhibitIndex(banks);
  }

  const raw = await readFile(extractionPath, "utf8");
  const records: ExtractionRecord[] = JSON.parse(raw);

  let fails = 0;
  let warns = 0;
  for (const rec of records) {
    const findings = gateRecord(rec, idx.get(rec.exhibitRef));
    if (findings.length === 0) {
      console.log(`OK   ${rec.exhibitRef} [${rec.lane}]`);
      continue;
    }
    for (const finding of findings) {
      if (finding.level === "FAIL") fails++;
      else warns++;
      console.log(`${finding.level} ${finding.ref}: ${finding.msg}`);
    }
  }

  console.log(`\n${basename(extractionPath)}: ${records.length} records, ${fails} FAIL, ${warns} WARN`);
  if (fails > 0 || (strict && warns > 0)) process.exit(1);
};

// Exports for the test harness (scripts/tests/exhibit-flowsheet-gate.ts). Importing
// this module must NOT run the CLI — main() is guarded on being the entry module below.
export {
  gateRecord,
  toCanonical,
  serialParams,
  looksSerial,
  buildExhibitIndex,
  buildBlindIndex,
  ALLOW,
  ALLOW_KEYS,
};
export type { ExtractionRecord, PanelEntry, ExcludedEntry, AliasEntry, Finding };

// Run the CLI only when invoked directly (tsx/node entry), not when imported.
// Matches the repo idiom (see scripts/census.ts).
const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.stack : String(err));
    process.exit(2);
  });
}
