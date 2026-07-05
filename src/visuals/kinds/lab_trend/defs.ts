// PLACEHOLDER ranges — all reference bands and sanity bounds below are placeholders
// pending source-verification against authoritative clinical references (professional
// society guidelines, government health agencies, established lab medicine texts).
// Peds buckets (peds_child / peds_infant) are coarse approximations; the verifier
// must confirm they are defensible or narrow the age bands before the content lane opens.
// Record the source per analyte (as vitals-canonical.json items do in meta.source)
// in the U3 audit report.

import type { LabAnalyteKey } from "./types";

export type PopKey = "adult" | "peds_child" | "peds_infant";

export interface AnalyteDef {
  label: string;
  canonicalUnit: string;
  altUnits: string[];
  refBand: Record<PopKey, { low: number; high: number }>;
  sanity: { min: number; max: number };
  /** Fraction of (refBand.high - refBand.low) within which direction="stable" passes. */
  stableEps: number;
}

export const ANALYTE_DEFS: Record<LabAnalyteKey, AnalyteDef> = {
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
    label: "Ca²⁺", canonicalUnit: "mg/dL", altUnits: ["mmol/L", "mEq/L"],
    refBand: { adult: { low: 8.5, high: 10.5 }, peds_child: { low: 8.8, high: 10.8 }, peds_infant: { low: 9.0, high: 11.0 } },
    sanity: { min: 3, max: 20 }, stableEps: 0.10,
  },
  ionized_calcium: {
    label: "iCa²⁺", canonicalUnit: "mmol/L", altUnits: ["mg/dL", "mEq/L"],
    refBand: { adult: { low: 1.15, high: 1.35 }, peds_child: { low: 1.12, high: 1.32 }, peds_infant: { low: 1.20, high: 1.40 } },
    sanity: { min: 0.3, max: 5.0 }, stableEps: 0.10,
  },
  magnesium: {
    label: "Mg²⁺", canonicalUnit: "mg/dL", altUnits: ["mmol/L", "mEq/L"],
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
    label: "WBC", canonicalUnit: "×10³/µL", altUnits: ["K/µL", "/µL", "/uL", "/mcL", "/mm3", "/mm³", "x 10^3/uL", "×10⁹/L"],
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
    label: "Platelets", canonicalUnit: "×10³/µL", altUnits: ["K/µL", "/µL", "/uL", "/mcL", "/mm3", "/mm³", "x 10^3/uL", "×10⁹/L"],
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
