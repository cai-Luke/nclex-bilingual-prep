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
import { ALLOWLIST_KEYS, MEASUREMENT_ALLOWLIST } from "../src/measurementAllowlist";
import { normalizeUnit, toCanonicalMeasurementValue } from "../src/measurementUnitPolicy";
import type { Question, CaseStudyExhibit, TextPair } from "../src/types";
import { ANALYTE_DEFS } from "../src/visuals/kinds/lab_trend/defs";

// ----------------------------------------------------------------------------
// Allowlist + units, derived from the live visual registries through
// src/measurementAllowlist.ts. Label patterns stay here because they are
// extraction-source concerns, not renderer registry data.
// ----------------------------------------------------------------------------

type Allow = {
  canonicalUnit: string;
  altUnits: string[];
  inferredUnit?: string;
  // sanity bounds are expressed in the CANONICAL unit
  sanity: { min: number; max: number };
};

const EXTRA_SOURCE_UNITS: Record<string, string[]> = {
  temp: ["°F", "F", "C"],
};

const ALLOW: Record<string, Allow> = Object.fromEntries(
  Object.entries(MEASUREMENT_ALLOWLIST).map(([key, def]) => {
    const altUnits = def.acceptedSourceUnits.filter((unit) => unit !== def.canonicalUnit);
    return [key, {
      canonicalUnit: def.canonicalUnit,
      altUnits: [...altUnits, ...(EXTRA_SOURCE_UNITS[key] ?? [])],
      inferredUnit: def.inferredUnit,
      sanity: { ...def.sanity },
    }];
  }),
);
const ALLOW_KEYS = ALLOWLIST_KEYS;

const EXCLUSION_REASONS = new Set(["prior", "trend", "serial", "comparator"]);
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
  { key: "hr",             re: /\bHR\b|[Hh]eart rate|\b[Pp]ulse\b/g },
  { key: "rr",             re: /\bRR\b|respiratory rate/gi },
  { key: "spo2",           re: /\bSpO₂|\bSpO2\b|pulse\s+ox(?:imetry)?|O₂ sat|O2 sat|(?<!arterial\s)oxygen saturation/gi },
  { key: "sao2",           re: /\bSaO₂|\bSaO2\b|arterial oxygen saturation/gi },
  { key: "temp",           re: /\btemperature\b|\btemp\b/gi },
  { key: "sodium",         re: /\bsodium\b|\bNa\b/g },
  { key: "potassium",      re: /\bpotassium\b|\bK\b/g },
  { key: "chloride",       re: /\bchloride\b|\bCl\b/g },
  { key: "bicarbonate",    re: /\bbicarbonate\b|\bCO2\b|\bCO₂\b/gi },
  { key: "bun",            re: /\bBUN\b/g },
  { key: "creatinine",     re: /\bcreatinine\b|\bCr\b/g },
  { key: "glucose",        re: /\bglucose\b/gi },
  { key: "ionized_calcium", re: /\bionized\s+calcium\b|\biCa(?:l)?\b|\bfree\s+calcium\b|离子钙|游离钙/gi },
  { key: "calcium",        re: /\btotal\s+calcium\b|\bserum\s+calcium\b|(?<!ionized\s)(?<!free\s)\bcalcium\b/gi },
  { key: "magnesium",      re: /\bmagnesium\b/gi },
  { key: "phosphate",      re: /\bphosphate\b|\bphosphorus\b/gi },
  { key: "lactate",        re: /\blactate\b/gi },
  { key: "troponin_i",     re: /\btroponin\s*I\b|\bcTnI\b/gi },
  { key: "troponin_t",     re: /\btroponin\s*T\b|\bcTnT\b/gi },
  { key: "bnp",            re: /\bBNP\b/g },
  { key: "wbc",            re: /\bWBC\b/g },
  { key: "hemoglobin",     re: /\bhemoglobin\b|\bHgb\b|\bHb\b/g },
  { key: "hematocrit",     re: /\bhematocrit\b|\bHct\b/g },
  { key: "platelets",      re: /\bplatelets?\b|\bplt\b/gi },
  { key: "inr",            re: /\bINR\b/g },
  { key: "ptt",            re: /\bPTT\b|\baPTT\b/g },
  { key: "ph",             re: /\bpH\b/g },
  { key: "paco2",          re: /\bPaCO2\b|\bPaCO₂\b/gi },
  { key: "pao2",           re: /\bPaO2\b|\bPaO₂\b/gi },
  { key: "hco3_abg",       re: /\bHCO3\b|\bHCO₃\b/gi },
  { key: "ast",            re: /\bAST\b/g },
  { key: "alt",            re: /\bALT\b/g },
  { key: "total_bilirubin", re: /\btotal bilirubin\b|\bbilirubin\b/gi },
  { key: "ammonia",        re: /\bammonia\b/gi },
  { key: "uric_acid",      re: /\buric\s+acid\b/gi },
];

// Count how many distinct timepoint-adjacent occurrences a label pattern has in the
// source. Deterministic and conservative: we count matches of the label pattern and,
// separately, distinct timepoint tokens; a label is "serial" when it appears ≥2 times
// AND there are ≥2 distinct timepoints in the exhibit.
const labelHitCount = (source: string, re: RegExp): number =>
  (source.match(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g")) ?? []).length;

// ----------------------------------------------------------------------------
// Unit conversion to canonical, for GATE 4. Source-unit factors live in
// src/measurementUnitPolicy.ts so extraction, display, and later prose
// normalization do not grow separate conversion truth tables.
// ----------------------------------------------------------------------------

const sourceContainsUnit = (source: string, sourceUnit: string): boolean => {
  const compactSource = normalizeUnit(source);
  const compactUnit = normalizeUnit(sourceUnit);
  if (compactUnit === "(unitless)" || compactUnit === "(ratio)") return true;
  if (compactSource.includes(compactUnit)) return true;
  if (compactUnit === "mmhg" && /\bmm\s*hg\b/i.test(source)) return true;
  return false;
};

const ADJACENT_UNIT_TOKEN = /^\s*(?:mg\/dL|mmol\/L|mEq\/L|U\/L|ng\/mL|pg\/mL|g\/dL|g\/L|seconds?|sec|mm\s*Hg|bpm|\/\s*(?:min|µL|μL|uL|mcL|mm3|mm³)|%|K\/µL|x\s*10\^3\/uL|×\s*10³\/µL|×\s*10⁹\/L)\b/i;

const valueHasAdjacentUnitToken = (source: string, rawValue: string): boolean => {
  const valueRe = new RegExp(escapeRegExp(rawValue), "g");
  let match: RegExpExecArray | null;
  while ((match = valueRe.exec(source)) !== null) {
    const after = source.slice(match.index + match[0].length);
    if (ADJACENT_UNIT_TOKEN.test(after)) return true;
  }
  return false;
};

const isInferredUnitUse = (key: string, sourceUnit: string, rawValue: string, source: string): boolean => {
  const inferred = ALLOW[key]?.inferredUnit;
  return inferred !== undefined &&
    normalizeUnit(sourceUnit) === normalizeUnit(inferred) &&
    !valueHasAdjacentUnitToken(source, rawValue);
};

const plausibleAcceptedUnits = (key: string, rawValue: string): string[] => {
  const def = ALLOW[key];
  if (!def) return [];
  const units = [def.canonicalUnit, ...def.altUnits];
  return units.filter((unit) => {
    const value = toCanonical(key, rawValue, unit);
    return value !== null && value >= def.sanity.min && value <= def.sanity.max;
  });
};

const isImplicitUnitAllowed = (key: string, sourceUnit: string): boolean =>
  IMPLICIT_SOURCE_UNITS[key]?.has(normalizeUnit(sourceUnit)) ?? false;

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const EXPLICIT_IMPLICIT_UNIT_TOKENS: Record<string, RegExp> = {
  hr: /\b(?:bpm|beats?\s*\/\s*min(?:ute)?|\/\s*min)\b/i,
  rr: /\b(?:bpm|breaths?\s*\/\s*min(?:ute)?|respirations?\s*\/\s*min(?:ute)?|\/\s*min)\b/i,
  sbp: /\bmm\s*hg\b/i,
  dbp: /\bmm\s*hg\b/i,
  map: /\bmm\s*hg\b/i,
};

const explicitImplicitSourceUnit = (key: string, rawValue: string, source: string): string | null => {
  const tokenRe = EXPLICIT_IMPLICIT_UNIT_TOKENS[key];
  if (!tokenRe) return null;
  const valueRe = new RegExp(`${escapeRegExp(rawValue)}\\s*(${tokenRe.source})`, "i");
  const match = source.match(valueRe);
  return match?.[1] ?? null;
};

const sourceHasUnitlessNumericLabel = (source: string, key: string, re: RegExp): boolean => {
  const def = MEASUREMENT_ALLOWLIST[key];
  if (!def || def.kind !== "lab") return false;
  const global = new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`);
  let match: RegExpExecArray | null;
  while ((match = global.exec(source)) !== null) {
    const afterLabel = source.slice(match.index + match[0].length, match.index + match[0].length + 50);
    const value = afterLabel.match(/^\s*(?:[:=]?\s*)?([<>≤≥]?\d[\d,.]*)/);
    if (!value) continue;
    const afterValue = afterLabel.slice(value.index! + value[0].length);
    if (!ADJACENT_UNIT_TOKEN.test(afterValue)) return true;
  }
  return false;
};

const toCanonical = (key: string, rawValue: string, sourceUnit: string): number | null =>
  toCanonicalMeasurementValue(key, rawValue, sourceUnit);

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

const TIMESTAMP = /\b([01]?\d|2[0-3]):[0-5]\d\b|\b\d{1,2}:\d{2}\s?(?:AM|PM)\b|\b\d{1,2}\s?(?:AM|PM)\b|\b(?:[01]\d|2[0-3])[0-5]\d\b|\bhour\s+\d+\b|\bday\s+\d+\b|\b\d+\s*(?:hr|hours?)\s+(?:later|after)\b/gi;

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

const IONIZED_CALCIUM_RE = /\bionized\s+calcium\b|\biCa(?:l)?\b|\bfree\s+calcium\b|离子钙|游离钙/i;
const TOTAL_CALCIUM_RE = /\btotal\s+calcium\b|\bserum\s+calcium\b/i;
const BARE_CALCIUM_RE = /(?<!ionized\s)(?<!free\s)\bcalcium\b/i;

const calciumQualifier = (text: string): "ionized" | "total" | "bare" | null => {
  if (IONIZED_CALCIUM_RE.test(text)) return "ionized";
  if (TOTAL_CALCIUM_RE.test(text)) return "total";
  if (BARE_CALCIUM_RE.test(text)) return "bare";
  return null;
};

const inAdultRefBand = (key: "calcium" | "ionized_calcium", canonicalValue: number): boolean => {
  const band = ANALYTE_DEFS[key].refBand.adult;
  return canonicalValue >= band.low && canonicalValue <= band.high;
};

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
    if (!looksSerial(src)) push("WARN", "lane=skip_serial but serial detector did not re-confirm a Rule D serial pattern; verify");
    return f;
  }

  // Rule D negative check: an extract record must NOT be a serial exhibit.
  const serialHits = serialParams(src);
  if (serialHits.length) push("WARN", `lane=extract but exhibit looks serial (${serialHits.join(", ")} repeated across ≥2 timepoints); should this be skip_serial?`);

  const panel = rec.panel ?? [];
  const excluded = rec.excludedValues ?? [];
  const aliases = rec.unitAliases ?? [];
  const seenPanelLabels = new Map<string, number>();
  for (const [i, e] of panel.entries()) {
    const previous = seenPanelLabels.get(e.label);
    if (previous !== undefined) {
      push("FAIL", `panel[${i}] ${e.label}=${e.value}: duplicate current label also appears at panel[${previous}] (Rule D: extract lane allows at most one current value per parameter)`);
    } else {
      seenPanelLabels.set(e.label, i);
    }
  }

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
      if (!sourceContainsUnit(unitSource, e.sourceUnit)) {
        if (isInferredUnitUse(e.label, e.sourceUnit, e.value, unitSource)) {
          const plausibleUnits = plausibleAcceptedUnits(e.label, e.value);
          if (plausibleUnits.length > 1) {
            push("WARN", `${at}: sourceUnit '${e.sourceUnit}' is inferred and value is plausible under multiple accepted units [${plausibleUnits.join(", ")}]; verify US-reporting inference`);
          }
        } else if (isImplicitUnitAllowed(e.label, e.sourceUnit)) {
          const explicitUnit = explicitImplicitSourceUnit(e.label, e.value, unitSource);
          if (explicitUnit) {
            push("WARN", `${at}: source carries nonstandard/conflicting unit '${explicitUnit}' for ${e.label}; staged as '${e.sourceUnit}' (prose-normalization candidate)`);
          }
        } else {
          push("FAIL", `${at}: sourceUnit '${e.sourceUnit}' is not a verbatim source unit in sourceSpan/source and is not an allowed implicit vital unit`);
        }
      }
    }
    // Rule F: context tag, if present, is in the closed set
    if (e.context && !CONTEXT_TAGS.has(e.context)) push("FAIL", `${at}: context '${e.context}' not a recognized tag`);
    if ((e.label === "calcium" || e.label === "ionized_calcium") && e.sourceSpan) {
      const qualifier = calciumQualifier(e.sourceSpan);
      if (qualifier === "ionized" && e.label !== "ionized_calcium") {
        push("FAIL", `${at}: explicit ionized calcium source must be labeled ionized_calcium`);
      } else if (qualifier === "total" && e.label !== "calcium") {
        push("FAIL", `${at}: explicit total/serum calcium source must be labeled calcium`);
      } else if (qualifier === "bare" && e.sourceUnit) {
        const otherKey = e.label === "calcium" ? "ionized_calcium" : "calcium";
        const currentValue = toCanonical(e.label, e.value, e.sourceUnit);
        const otherValue = toCanonical(otherKey, e.value, e.sourceUnit);
        if (
          currentValue !== null &&
          otherValue !== null &&
          !inAdultRefBand(e.label, currentValue) &&
          inAdultRefBand(otherKey, otherValue)
        ) {
          push("WARN", `${at}: bare calcium value is out of normal band for ${e.label} but in band for ${otherKey}; verify total vs ionized identity`);
        }
      }
    }
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
    else if (!EXCLUSION_REASONS.has(e.reason)) push("FAIL", `${at}: reason '${e.reason}' not in {prior, trend, serial, comparator}`);
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
      if (sourceHasUnitlessNumericLabel(src, key, re)) {
        push("WARN", `GATE 2 (advisory): source mentions '${key}' with a numeric value but no adjacent unit; verify inferred-unit eligibility or leave prose with reason`);
      } else {
        push("WARN", `GATE 2 (advisory): source mentions '${key}' but it is neither keyed nor excluded; verify completeness (may be a reference range or name collision)`);
      }
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
  LABEL_PATTERNS,
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
