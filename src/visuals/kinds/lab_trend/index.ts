// PLACEHOLDER ranges — all reference bands and sanity bounds below are placeholders
// pending source-verification against authoritative clinical references (professional
// society guidelines, government health agencies, established lab medicine texts).
// Peds buckets (peds_child / peds_infant) are coarse approximations; the verifier
// must confirm they are defensible or narrow the age bands before the content lane opens.
// Record the source per analyte (as vitals-canonical.json items do in meta.source)
// in the U3 audit report.

import { type VisualError, type VisualKindModule } from "../../registry";
import { type ChartSeries, type LineChartInput, renderLineChart } from "../../primitives/lineChart";
import { type LabAnalyteKey, type LabTrendSpec } from "./types";
import { fmt } from "../../primitives/graphPaper";
import { escapeXml } from "../../primitives/escapeXml";

type PopKey = "adult" | "peds_child" | "peds_infant";

interface AnalyteDef {
  label: string;
  canonicalUnit: string;
  altUnits: string[];
  refBand: Record<PopKey, { low: number; high: number }>;
  sanity: { min: number; max: number };
  /** Fraction of (refBand.high - refBand.low) within which direction="stable" passes. */
  stableEps: number;
}

// Each entry: [canonicalUnit, altUnits, adult refBand, peds_child refBand, peds_infant refBand, sanity {min,max}, stableEps]
const ANALYTE_DEFS: Record<LabAnalyteKey, AnalyteDef> = {
  sodium: {
    label: "Na⁺", canonicalUnit: "mEq/L", altUnits: ["mmol/L"],
    refBand: { adult: { low: 135, high: 145 }, peds_child: { low: 136, high: 145 }, peds_infant: { low: 134, high: 146 } },
    sanity: { min: 90, max: 200 }, stableEps: 0.10,
  },
  potassium: {
    label: "K⁺", canonicalUnit: "mEq/L", altUnits: ["mmol/L"],
    refBand: { adult: { low: 3.5, high: 5.0 }, peds_child: { low: 3.4, high: 4.7 }, peds_infant: { low: 3.7, high: 5.9 } },
    sanity: { min: 1.0, max: 10.0 }, stableEps: 0.10,
  },
  chloride: {
    label: "Cl⁻", canonicalUnit: "mEq/L", altUnits: ["mmol/L"],
    refBand: { adult: { low: 98, high: 106 }, peds_child: { low: 98, high: 106 }, peds_infant: { low: 98, high: 106 } },
    sanity: { min: 60, max: 160 }, stableEps: 0.10,
  },
  bicarbonate: {
    label: "HCO₃⁻", canonicalUnit: "mEq/L", altUnits: ["mmol/L"],
    refBand: { adult: { low: 22, high: 28 }, peds_child: { low: 20, high: 28 }, peds_infant: { low: 19, high: 24 } },
    sanity: { min: 3, max: 60 }, stableEps: 0.10,
  },
  anion_gap: {
    label: "Anion Gap", canonicalUnit: "mEq/L", altUnits: [],
    refBand: { adult: { low: 8, high: 12 }, peds_child: { low: 8, high: 12 }, peds_infant: { low: 8, high: 12 } },
    sanity: { min: 0, max: 50 }, stableEps: 0.10,
  },
  bun: {
    label: "BUN", canonicalUnit: "mg/dL", altUnits: ["mmol/L"],
    refBand: { adult: { low: 7, high: 20 }, peds_child: { low: 5, high: 18 }, peds_infant: { low: 5, high: 18 } },
    sanity: { min: 1, max: 250 }, stableEps: 0.10,
  },
  creatinine: {
    label: "Creatinine", canonicalUnit: "mg/dL", altUnits: ["µmol/L"],
    refBand: { adult: { low: 0.6, high: 1.3 }, peds_child: { low: 0.3, high: 0.7 }, peds_infant: { low: 0.2, high: 0.4 } },
    sanity: { min: 0.1, max: 25 }, stableEps: 0.10,
  },
  glucose: {
    label: "Glucose", canonicalUnit: "mg/dL", altUnits: ["mmol/L"],
    refBand: { adult: { low: 70, high: 99 }, peds_child: { low: 60, high: 99 }, peds_infant: { low: 50, high: 90 } },
    sanity: { min: 10, max: 1500 }, stableEps: 0.10,
  },
  calcium: {
    label: "Ca²⁺", canonicalUnit: "mg/dL", altUnits: ["mmol/L"],
    refBand: { adult: { low: 8.5, high: 10.5 }, peds_child: { low: 8.8, high: 10.8 }, peds_infant: { low: 9.0, high: 11.0 } },
    sanity: { min: 3, max: 20 }, stableEps: 0.10,
  },
  ionized_calcium: {
    label: "iCa²⁺", canonicalUnit: "mmol/L", altUnits: ["mg/dL"],
    refBand: { adult: { low: 1.15, high: 1.35 }, peds_child: { low: 1.12, high: 1.32 }, peds_infant: { low: 1.20, high: 1.40 } },
    sanity: { min: 0.3, max: 5.0 }, stableEps: 0.10,
  },
  magnesium: {
    label: "Mg²⁺", canonicalUnit: "mg/dL", altUnits: ["mmol/L"],
    refBand: { adult: { low: 1.7, high: 2.2 }, peds_child: { low: 1.7, high: 2.2 }, peds_infant: { low: 1.7, high: 2.2 } },
    sanity: { min: 0.3, max: 10 }, stableEps: 0.10,
  },
  phosphate: {
    label: "PO₄³⁻", canonicalUnit: "mg/dL", altUnits: ["mmol/L"],
    refBand: { adult: { low: 2.5, high: 4.5 }, peds_child: { low: 4.0, high: 7.0 }, peds_infant: { low: 4.5, high: 8.0 } },
    sanity: { min: 0.2, max: 20 }, stableEps: 0.10,
  },
  lactate: {
    label: "Lactate", canonicalUnit: "mmol/L", altUnits: [],
    refBand: { adult: { low: 0.5, high: 2.0 }, peds_child: { low: 0.5, high: 2.0 }, peds_infant: { low: 0.5, high: 2.2 } },
    sanity: { min: 0.1, max: 30 }, stableEps: 0.10,
  },
  troponin_t: {
    label: "Troponin T", canonicalUnit: "ng/mL", altUnits: ["µg/L"],
    refBand: { adult: { low: 0, high: 0.01 }, peds_child: { low: 0, high: 0.01 }, peds_infant: { low: 0, high: 0.01 } },
    sanity: { min: 0, max: 50 }, stableEps: 0.10,
  },
  bnp: {
    label: "BNP", canonicalUnit: "pg/mL", altUnits: [],
    refBand: { adult: { low: 0, high: 100 }, peds_child: { low: 0, high: 100 }, peds_infant: { low: 0, high: 100 } },
    sanity: { min: 0, max: 10000 }, stableEps: 0.10,
  },
  wbc: {
    label: "WBC", canonicalUnit: "×10⁹/L", altUnits: ["K/µL"],
    refBand: { adult: { low: 4.0, high: 11.0 }, peds_child: { low: 5.0, high: 13.0 }, peds_infant: { low: 6.0, high: 17.5 } },
    sanity: { min: 0, max: 200 }, stableEps: 0.10,
  },
  hemoglobin: {
    label: "Hgb", canonicalUnit: "g/dL", altUnits: ["g/L"],
    refBand: { adult: { low: 12, high: 17 }, peds_child: { low: 11, high: 14 }, peds_infant: { low: 10, high: 14 } },
    sanity: { min: 2, max: 25 }, stableEps: 0.10,
  },
  hematocrit: {
    label: "Hct", canonicalUnit: "%", altUnits: [],
    refBand: { adult: { low: 36, high: 52 }, peds_child: { low: 35, high: 45 }, peds_infant: { low: 30, high: 44 } },
    sanity: { min: 5, max: 80 }, stableEps: 0.10,
  },
  platelets: {
    label: "Platelets", canonicalUnit: "×10⁹/L", altUnits: ["K/µL"],
    refBand: { adult: { low: 150, high: 400 }, peds_child: { low: 150, high: 400 }, peds_infant: { low: 150, high: 400 } },
    sanity: { min: 0, max: 2000 }, stableEps: 0.10,
  },
  inr: {
    label: "INR", canonicalUnit: "(ratio)", altUnits: [],
    refBand: { adult: { low: 0.8, high: 1.1 }, peds_child: { low: 0.8, high: 1.1 }, peds_infant: { low: 0.8, high: 1.1 } },
    sanity: { min: 0.5, max: 12 }, stableEps: 0.10,
  },
  ptt: {
    label: "PTT", canonicalUnit: "seconds", altUnits: ["sec"],
    refBand: { adult: { low: 25, high: 35 }, peds_child: { low: 25, high: 35 }, peds_infant: { low: 25, high: 35 } },
    sanity: { min: 10, max: 200 }, stableEps: 0.10,
  },
  ph: {
    label: "pH", canonicalUnit: "(unitless)", altUnits: [],
    refBand: { adult: { low: 7.35, high: 7.45 }, peds_child: { low: 7.35, high: 7.45 }, peds_infant: { low: 7.35, high: 7.45 } },
    sanity: { min: 6.5, max: 8.0 }, stableEps: 0.10,
  },
  paco2: {
    label: "PaCO₂", canonicalUnit: "mmHg", altUnits: [],
    refBand: { adult: { low: 35, high: 45 }, peds_child: { low: 35, high: 45 }, peds_infant: { low: 26, high: 41 } },
    sanity: { min: 5, max: 100 }, stableEps: 0.10,
  },
  pao2: {
    label: "PaO₂", canonicalUnit: "mmHg", altUnits: [],
    refBand: { adult: { low: 75, high: 100 }, peds_child: { low: 75, high: 100 }, peds_infant: { low: 60, high: 90 } },
    sanity: { min: 10, max: 600 }, stableEps: 0.10,
  },
  hco3_abg: {
    label: "HCO₃ (ABG)", canonicalUnit: "mEq/L", altUnits: ["mmol/L"],
    refBand: { adult: { low: 22, high: 26 }, peds_child: { low: 20, high: 26 }, peds_infant: { low: 18, high: 24 } },
    sanity: { min: 5, max: 50 }, stableEps: 0.10,
  },
  ast: {
    label: "AST", canonicalUnit: "U/L", altUnits: [],
    refBand: { adult: { low: 10, high: 40 }, peds_child: { low: 10, high: 40 }, peds_infant: { low: 20, high: 65 } },
    sanity: { min: 0, max: 10000 }, stableEps: 0.10,
  },
  alt: {
    label: "ALT", canonicalUnit: "U/L", altUnits: [],
    refBand: { adult: { low: 7, high: 56 }, peds_child: { low: 7, high: 45 }, peds_infant: { low: 7, high: 45 } },
    sanity: { min: 0, max: 10000 }, stableEps: 0.10,
  },
  total_bilirubin: {
    label: "Total Bili", canonicalUnit: "mg/dL", altUnits: [],
    refBand: { adult: { low: 0.1, high: 1.2 }, peds_child: { low: 0.1, high: 1.2 }, peds_infant: { low: 1.0, high: 12.0 } },
    sanity: { min: 0, max: 60 }, stableEps: 0.10,
  },
  ammonia: {
    label: "Ammonia", canonicalUnit: "µmol/L", altUnits: ["µg/dL"],
    refBand: { adult: { low: 11, high: 35 }, peds_child: { low: 11, high: 35 }, peds_infant: { low: 21, high: 95 } },
    sanity: { min: 0, max: 500 }, stableEps: 0.10,
  },
};

const ANALYTE_KEYS = new Set<string>(Object.keys(ANALYTE_DEFS));

const SERIES_STYLE_ROLES = ["blue", "green"] as const;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const nonEmptyString = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

// ---------- validate ----------

export const validateLabTrend = (spec: LabTrendSpec): VisualError[] => {
  const errs: VisualError[] = [];
  const value = spec as unknown as Record<string, unknown>;

  if (value.kind !== "lab_trend") {
    errs.push({ path: "kind", code: "invalid_kind", message: "must be 'lab_trend'" });
    return errs;
  }

  // time
  if (!isRecord(value.time)) {
    errs.push({ path: "time", code: "timepoints_invalid", message: "must be an object with unit and values" });
    return errs;
  }
  const timeObj = value.time as Record<string, unknown>;
  if (timeObj.unit !== "hr" && timeObj.unit !== "min" && timeObj.unit !== "day") {
    errs.push({ path: "time.unit", code: "invalid_time_unit", message: "must be 'hr', 'min', or 'day'" });
  }
  if (!Array.isArray(timeObj.values) || timeObj.values.length === 0) {
    errs.push({ path: "time.values", code: "timepoints_invalid", message: "must be a non-empty array" });
    return errs;
  }

  const times = timeObj.values as unknown[];
  for (let i = 0; i < times.length; i++) {
    if (typeof times[i] !== "number" || !Number.isFinite(times[i] as number)) {
      errs.push({ path: `time.values[${i}]`, code: "timepoint_not_number", message: "must be a finite number" });
    } else if (i > 0 && typeof times[i - 1] === "number" && (times[i] as number) <= (times[i - 1] as number)) {
      errs.push({ path: `time.values[${i}]`, code: "timepoints_not_increasing", message: "must be strictly increasing" });
    }
  }

  const numTimepoints = times.length;
  if (numTimepoints < 3) {
    errs.push({ path: "time.values", code: "too_few_timepoints", message: "must have at least 3 timepoints" });
  }

  // population
  if (value.population !== undefined && value.population !== "adult" && value.population !== "peds_child" && value.population !== "peds_infant") {
    errs.push({ path: "population", code: "invalid_population", message: "must be 'adult', 'peds_child', or 'peds_infant'" });
  }

  // series
  if (!Array.isArray(value.series) || value.series.length === 0) {
    errs.push({ path: "series", code: "series_empty", message: "must have at least one series" });
    return errs;
  }
  if ((value.series as unknown[]).length > 2) {
    errs.push({ path: "series", code: "too_many_series", message: "must have at most 2 series" });
  }

  const pop: PopKey = (value.population as PopKey) ?? "adult";
  const seenAnalytes = new Set<string>();
  const seriesArr = value.series as Record<string, unknown>[];

  seriesArr.forEach((s, idx) => {
    if (!isRecord(s)) {
      errs.push({ path: `series[${idx}]`, code: "series_entry_invalid", message: "must be an object" });
      return;
    }

    if (typeof s.analyte !== "string" || !ANALYTE_KEYS.has(s.analyte)) {
      errs.push({ path: `series[${idx}].analyte`, code: "invalid_analyte_key", message: "is not a recognized analyte key" });
      return;
    }

    const analyteKey = s.analyte as LabAnalyteKey;
    if (seenAnalytes.has(analyteKey)) {
      errs.push({ path: `series[${idx}].analyte`, code: "duplicate_analyte", message: "cannot duplicate analyte keys" });
    }
    seenAnalytes.add(analyteKey);

    const def = ANALYTE_DEFS[analyteKey];

    if (s.unit !== undefined) {
      const recognizedUnits = [def.canonicalUnit, ...def.altUnits];
      if (typeof s.unit !== "string" || !recognizedUnits.includes(s.unit)) {
        errs.push({ path: `series[${idx}].unit`, code: "invalid_unit_for_analyte", message: `must be one of: ${recognizedUnits.join(", ")}` });
      }
    }

    if (s.showReferenceBand !== undefined && typeof s.showReferenceBand !== "boolean") {
      errs.push({ path: `series[${idx}].showReferenceBand`, code: "invalid_show_reference_band", message: "must be a boolean" });
    }

    if (!Array.isArray(s.values)) {
      errs.push({ path: `series[${idx}].values`, code: "values_length_mismatch", message: "must be an array" });
      return;
    }

    if ((s.values as unknown[]).length !== numTimepoints) {
      errs.push({ path: `series[${idx}].values`, code: "values_length_mismatch", message: "must match time.values length" });
    }

    const { min, max } = def.sanity;
    const refBand = def.refBand[pop];

    (s.values as unknown[]).forEach((v, vidx) => {
      if (typeof v !== "number" || !Number.isFinite(v)) {
        errs.push({ path: `series[${idx}].values[${vidx}]`, code: "value_not_number", message: "must be a finite number" });
      } else if (v < min || v > max) {
        errs.push({ path: `series[${idx}].values[${vidx}]`, code: "value_out_of_range", message: `must be between ${min} and ${max} ${def.canonicalUnit} (sanity bounds for ${analyteKey}; reference band is ${refBand.low}–${refBand.high})` });
      }
    });
  });

  if (value.caption !== undefined) {
    if (!isRecord(value.caption) || !nonEmptyString(value.caption.en)) {
      errs.push({ path: "caption.en", code: "caption_en_required", message: "is required when caption is present" });
    } else if (value.caption.zh !== undefined && !nonEmptyString(value.caption.zh)) {
      errs.push({ path: "caption.zh", code: "caption_zh_empty", message: "must be non-empty when present" });
    }
  }

  return errs;
};

// ---------- selfCheck ----------

export const selfCheckLabTrend = (spec: LabTrendSpec, question: unknown): VisualError[] => {
  const errs: VisualError[] = [];

  const times = Array.isArray(spec.time?.values) ? spec.time.values : [];
  if (times.length === 0 || !Array.isArray(spec.series)) return errs;

  const pop: PopKey = spec.population ?? "adult";

  // 1. Render fidelity: every plotted point equals series.values
  spec.series.forEach((s, idx) => {
    if (!ANALYTE_KEYS.has(s.analyte) || !Array.isArray(s.values)) return;
    s.values.forEach((v, vidx) => {
      if (typeof v !== "number" || !Number.isFinite(v)) {
        errs.push({ path: `series[${idx}].values[${vidx}]`, code: "self_check_render_divergence", message: "plotted value is not a finite number" });
      }
    });
  });

  // 2–4. Check question.meta block (audit-only; guards for malformed meta → VisualError, never throw)
  const meta = isRecord(question) && isRecord((question as Record<string, unknown>).meta)
    ? (question as Record<string, unknown>).meta as Record<string, unknown>
    : null;

  // 4a. Necessity: visual_justification
  if (meta !== null && !nonEmptyString(meta.visual_justification)) {
    errs.push({ path: "meta.visual_justification", code: "self_check_missing_justification", message: "must be present and non-empty" });
  }

  // 4b. Necessity: at least one expected_trend or expected_flags entry
  const expectedTrends: unknown[] = meta && Array.isArray(meta.expected_trend) ? meta.expected_trend : [];
  const expectedFlags: unknown[] = meta && Array.isArray(meta.expected_flags) ? meta.expected_flags : [];
  if (meta !== null && expectedTrends.length === 0 && expectedFlags.length === 0) {
    errs.push({ path: "meta", code: "self_check_no_keyed_cue", message: "must declare at least one expected_trend or expected_flags entry" });
  }

  // 3. Trend correctness
  for (const entry of expectedTrends) {
    if (!isRecord(entry)) continue;
    const seriesKey = typeof entry.series === "string" ? entry.series : null;
    if (!seriesKey) continue;
    if (!Array.isArray(entry.window) || entry.window.length !== 2) continue;

    const t0 = entry.window[0] as number;
    const t1 = entry.window[1] as number;

    // 4c. Necessity: window must span more than one timepoint
    const idxStart = times.indexOf(t0);
    const idxEnd = times.indexOf(t1);
    if (idxStart === -1 || idxEnd === -1 || idxEnd <= idxStart) {
      errs.push({ path: `meta.expected_trend[series=${seriesKey}]`, code: "self_check_snapshot_not_trajectory", message: "window must span more than one timepoint present in time.values" });
      continue;
    }

    const tSeries = spec.series.find(s => s.analyte === seriesKey);
    if (!tSeries || !Array.isArray(tSeries.values)) continue;

    const valStart = tSeries.values[idxStart];
    const valEnd = tSeries.values[idxEnd];
    if (typeof valStart !== "number" || typeof valEnd !== "number") continue;

    const def = ANALYTE_DEFS[tSeries.analyte];
    const band = def ? def.refBand[pop] : null;
    const eps = def ? def.stableEps * (band ? band.high - band.low : 1) : 0;

    if (entry.direction === "up" && valEnd <= valStart) {
      errs.push({ path: `series.${seriesKey}`, code: "self_check_trend_failed", message: `expected 'up' but valEnd (${valEnd}) <= valStart (${valStart})` });
    } else if (entry.direction === "down" && valEnd >= valStart) {
      errs.push({ path: `series.${seriesKey}`, code: "self_check_trend_failed", message: `expected 'down' but valEnd (${valEnd}) >= valStart (${valStart})` });
    } else if (entry.direction === "stable" && Math.abs(valEnd - valStart) > eps) {
      errs.push({ path: `series.${seriesKey}`, code: "self_check_trend_failed", message: `expected 'stable' but |valEnd − valStart| (${Math.abs(valEnd - valStart)}) > stableEps (${eps})` });
    }
  }

  // 2. Flag correctness: for each expected_flags entry, recompute H/L from registry band
  for (const entry of expectedFlags) {
    if (!isRecord(entry)) continue;
    const seriesKey = typeof entry.series === "string" ? entry.series : null;
    if (!seriesKey || typeof entry.at !== "number") continue;

    const tSeries = spec.series.find(s => s.analyte === seriesKey);
    if (!tSeries || !Array.isArray(tSeries.values)) continue;

    const def = ANALYTE_DEFS[tSeries.analyte];
    if (!def) continue;

    const timeIdx = times.indexOf(entry.at as number);
    if (timeIdx === -1) continue;

    const val = tSeries.values[timeIdx];
    if (typeof val !== "number") continue;

    const band = def.refBand[pop];
    const computedFlag = val > band.high ? "H" : val < band.low ? "L" : null;
    if (entry.flag !== computedFlag) {
      errs.push({ path: `series.${seriesKey}[t=${entry.at}]`, code: "self_check_flag_failed", message: `declared flag '${entry.flag}' but computed '${computedFlag ?? "normal"}' (value ${val}, band ${band.low}–${band.high})` });
    }
  }

  return errs;
};

// ---------- renderSvg ----------

export const renderLabTrendSvg = (spec: LabTrendSpec): string => {
  const times = spec.time?.values ?? [];
  const timeUnit = spec.time?.unit ?? "hr";
  const pop: PopKey = spec.population ?? "adult";

  const xAxisLabel =
    timeUnit === "min" ? "Time (Minutes)" :
    timeUnit === "day" ? "Time (Days)" :
    "Time (Hours)";

  const chartSeries: ChartSeries[] = spec.series.map((s, idx) => {
    const def = ANALYTE_DEFS[s.analyte];
    const band = def ? def.refBand[pop] : undefined;
    const axis: "left" | "right" = idx === 0 ? "left" : "right";
    return {
      label: def ? def.label : s.analyte,
      unit: s.unit ?? (def ? def.canonicalUnit : ""),
      axis,
      styleRole: SERIES_STYLE_ROLES[idx] ?? "blue",
      points: s.values.map((v, i) => ({ x: times[i], y: v })),
      referenceBand: s.showReferenceBand !== false && band ? band : undefined,
    };
  });

  const xMin = times.length > 0 ? Math.min(...times) : 0;
  const xMax = times.length > 0 ? Math.max(...times) : 1;

  let leftMin = 9999, leftMax = -9999;
  let rightMin = 9999, rightMax = -9999;
  let hasLeft = false, hasRight = false;

  chartSeries.forEach(s => {
    const vals = s.points.map(p => p.y);
    if (s.referenceBand) vals.push(s.referenceBand.low, s.referenceBand.high);
    const mn = Math.min(...vals);
    const mx = Math.max(...vals);
    if (s.axis === "left") {
      hasLeft = true;
      leftMin = Math.min(leftMin, mn);
      leftMax = Math.max(leftMax, mx);
    } else {
      hasRight = true;
      rightMin = Math.min(rightMin, mn);
      rightMax = Math.max(rightMax, mx);
    }
  });

  if (hasLeft) {
    const pad = Math.max((leftMax - leftMin) * 0.1, (leftMax - leftMin) * 0.05 + 0.1);
    leftMin = leftMin - pad;
    leftMax = leftMax + pad;
    if (leftMin < 0 && !chartSeries.some(s => s.axis === "left" && s.points.some(p => p.y < 0))) leftMin = 0;
  } else {
    leftMin = 0; leftMax = 100;
  }

  if (hasRight) {
    const pad = Math.max((rightMax - rightMin) * 0.1, (rightMax - rightMin) * 0.05 + 0.1);
    rightMin = rightMin - pad;
    rightMax = rightMax + pad;
    if (rightMin < 0 && !chartSeries.some(s => s.axis === "right" && s.points.some(p => p.y < 0))) rightMin = 0;
  }

  const input: LineChartInput = {
    series: chartSeries,
    xAxis: { label: xAxisLabel, min: xMin, max: xMax, ticks: times },
    yAxisLeft: {
      label: "",
      min: leftMin,
      max: leftMax,
      ticks: [leftMin, leftMin + (leftMax - leftMin) / 2, leftMax],
    },
    width: 600,
    height: 300,
  };

  if (hasRight) {
    input.yAxisRight = {
      label: "",
      min: rightMin,
      max: rightMax,
      ticks: [rightMin, rightMin + (rightMax - rightMin) / 2, rightMax],
    };
  }

  const svgBody = renderLineChart(input);
  const captionAttr = spec.caption ? ` aria-label="${escapeXml(spec.caption.en)}"` : ` aria-label="Lab Trend"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" role="img"${captionAttr} data-kind="lab_trend">\n${svgBody}\n</svg>`;
};

// ---------- fixtures ----------

const fixtures: VisualKindModule<LabTrendSpec>["fixtures"] = {
  valid: [
    // Rising creatinine over 72 h (AKI worsening, single analyte, left axis)
    {
      kind: "lab_trend",
      time: { unit: "hr", values: [0, 24, 48, 72] },
      population: "adult",
      series: [{ analyte: "creatinine", values: [1.1, 1.8, 2.6, 3.5] }],
      caption: { en: "Serum creatinine trend", zh: "血肌酐变化趋势" },
    },
    // Falling Na⁺ (SIADH) paired with rising creatinine — dual axis
    {
      kind: "lab_trend",
      time: { unit: "day", values: [0, 1, 2, 3] },
      population: "adult",
      series: [
        { analyte: "sodium", values: [138, 132, 126, 121] },
        { analyte: "creatinine", values: [0.9, 1.2, 1.6, 2.0] },
      ],
    },
  ],
  invalid: [
    // too_few_timepoints: only 2 points
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24] }, series: [{ analyte: "creatinine", values: [1.0, 2.0] }] }, expectCode: "too_few_timepoints" },
    // too_many_series: 3 analytes
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "sodium", values: [138, 135, 132] }, { analyte: "potassium", values: [4.0, 4.2, 4.5] }, { analyte: "creatinine", values: [1.0, 1.5, 2.0] }] }, expectCode: "too_many_series" },
    // duplicate_analyte
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1.0, 1.5, 2.0] }, { analyte: "creatinine", values: [1.0, 1.5, 2.0] }] }, expectCode: "duplicate_analyte" },
    // values_length_mismatch
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1.0, 2.0] }] }, expectCode: "values_length_mismatch" },
    // value_out_of_range: creatinine 99 exceeds sanity max of 25
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1.0, 2.0, 99] }] }, expectCode: "value_out_of_range" },
    // invalid_analyte_key
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "fibrinogen", values: [300, 350, 400] }] }, expectCode: "invalid_analyte_key" },
    // timepoints_not_increasing
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 48, 24] }, series: [{ analyte: "creatinine", values: [1.0, 2.0, 1.5] }] }, expectCode: "timepoints_not_increasing" },
    // invalid_kind
    { spec: { kind: "vitals_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1.0, 1.5, 2.0] }] }, expectCode: "invalid_kind" },
    // invalid_time_unit
    { spec: { kind: "lab_trend", time: { unit: "week", values: [0, 1, 2] }, series: [{ analyte: "creatinine", values: [1.0, 1.5, 2.0] }] }, expectCode: "invalid_time_unit" },
    // timepoint_not_number
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, "twenty-four", 48] }, series: [{ analyte: "creatinine", values: [1.0, 1.5, 2.0] }] }, expectCode: "timepoint_not_number" },
    // invalid_population
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, population: "geriatric", series: [{ analyte: "creatinine", values: [1.0, 1.5, 2.0] }] }, expectCode: "invalid_population" },
    // invalid_unit_for_analyte
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", unit: "bpm", values: [1.0, 1.5, 2.0] }] }, expectCode: "invalid_unit_for_analyte" },
    // caption_en_required
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1.0, 1.5, 2.0] }], caption: { en: "" } }, expectCode: "caption_en_required" },
    // caption_zh_empty
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1.0, 1.5, 2.0] }], caption: { en: "Creatinine", zh: "" } }, expectCode: "caption_zh_empty" },
  ],
};

export const labTrendModule: VisualKindModule<LabTrendSpec> = {
  kind: "lab_trend",
  validate: validateLabTrend,
  selfCheck: selfCheckLabTrend,
  renderSvg: renderLabTrendSvg,
  fixtures,
};

import { registerVisual } from "../../registry";
registerVisual(labTrendModule as VisualKindModule);
