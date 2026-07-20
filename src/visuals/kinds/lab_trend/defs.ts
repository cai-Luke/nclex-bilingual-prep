// Source-verified adult teaching bands and warning-only numeric sanity envelopes.
// Full provenance, interval-selection rules, pediatric disposition, and assay caveats:
// audit/lab-reference-range-verification-2026-07-19.md
//
// Pediatric reference intervals are intentionally absent. The product's coarse
// peds_child / peds_infant buckets cannot represent the age-, sex-, and assay-specific
// intervals in the cited laboratory catalogs. Pediatric lab trends may be authored only
// with showReferenceBand:false; H/L and stable assertions require a verified band.

import type { LabAnalyteKey } from "./types";
import type { Population } from "../../../population";

export interface AnalyteDef {
  label: string;
  canonicalUnit: string;
  altUnits: string[];
  refBand: { adult: { low: number; high: number } } &
    Partial<Record<Exclude<Population, "adult">, { low: number; high: number }>>;
  sanity: { min: number; max: number };
  /** Fraction of (refBand.high - refBand.low) within which direction="stable" passes. */
  stableEps: number;
}

export const ANALYTE_DEFS: Record<LabAnalyteKey, AnalyteDef> = {
  sodium: {
    label: "Na⁺", canonicalUnit: "mEq/L", altUnits: ["mmol/L"],
    refBand: { adult: { low: 135, high: 145 } },
    sanity: { min: 90, max: 200 }, stableEps: 0.10,
  },
  potassium: {
    label: "K⁺", canonicalUnit: "mEq/L", altUnits: ["mmol/L"],
    refBand: { adult: { low: 3.5, high: 5.0 } },
    sanity: { min: 1.0, max: 10.0 }, stableEps: 0.10,
  },
  chloride: {
    label: "Cl⁻", canonicalUnit: "mEq/L", altUnits: ["mmol/L"],
    refBand: { adult: { low: 95, high: 107 } },
    sanity: { min: 60, max: 160 }, stableEps: 0.10,
  },
  bicarbonate: {
    label: "HCO₃⁻", canonicalUnit: "mEq/L", altUnits: ["mmol/L"],
    refBand: { adult: { low: 22, high: 29 } },
    sanity: { min: 3, max: 60 }, stableEps: 0.10,
  },
  anion_gap: {
    label: "Anion Gap", canonicalUnit: "mEq/L", altUnits: [],
    refBand: { adult: { low: 7, high: 15 } },
    sanity: { min: 0, max: 50 }, stableEps: 0.10,
  },
  bun: {
    label: "BUN", canonicalUnit: "mg/dL", altUnits: ["mmol/L"],
    refBand: { adult: { low: 10, high: 20 } },
    sanity: { min: 1, max: 250 }, stableEps: 0.10,
  },
  creatinine: {
    label: "Creatinine", canonicalUnit: "mg/dL", altUnits: ["µmol/L"],
    refBand: { adult: { low: 0.51, high: 1.17 } },
    sanity: { min: 0.1, max: 25 }, stableEps: 0.10,
  },
  glucose: {
    label: "Glucose", canonicalUnit: "mg/dL", altUnits: ["mmol/L"],
    refBand: { adult: { low: 65, high: 139 } },
    sanity: { min: 10, max: 1500 }, stableEps: 0.10,
  },
  calcium: {
    label: "Ca²⁺", canonicalUnit: "mg/dL", altUnits: ["mmol/L", "mEq/L"],
    refBand: { adult: { low: 8.5, high: 10.5 } },
    sanity: { min: 3, max: 20 }, stableEps: 0.10,
  },
  ionized_calcium: {
    label: "iCa²⁺", canonicalUnit: "mmol/L", altUnits: ["mg/dL", "mEq/L"],
    refBand: { adult: { low: 0.95, high: 1.30 } },
    sanity: { min: 0.3, max: 5.0 }, stableEps: 0.10,
  },
  magnesium: {
    label: "Mg²⁺", canonicalUnit: "mg/dL", altUnits: ["mmol/L", "mEq/L"],
    refBand: { adult: { low: 1.7, high: 2.3 } },
    sanity: { min: 0.3, max: 10 }, stableEps: 0.10,
  },
  phosphate: {
    label: "PO₄³⁻", canonicalUnit: "mg/dL", altUnits: ["mmol/L"],
    refBand: { adult: { low: 2.5, high: 4.5 } },
    sanity: { min: 0.2, max: 20 }, stableEps: 0.10,
  },
  lactate: {
    label: "Lactate", canonicalUnit: "mmol/L", altUnits: [],
    refBand: { adult: { low: 0.5, high: 2.0 } },
    sanity: { min: 0.1, max: 40 }, stableEps: 0.10,
  },
  troponin_t: {
    label: "hs-Troponin T", canonicalUnit: "ng/mL", altUnits: ["µg/L"],
    refBand: { adult: { low: 0, high: 0.022 } },
    sanity: { min: 0, max: 50 }, stableEps: 0.10,
  },
  bnp: {
    label: "BNP", canonicalUnit: "pg/mL", altUnits: [],
    refBand: { adult: { low: 0, high: 100 } },
    sanity: { min: 0, max: 10000 }, stableEps: 0.10,
  },
  wbc: {
    label: "WBC", canonicalUnit: "×10³/µL", altUnits: ["K/µL", "/µL", "/μL", "/uL", "/mcL", "/mm3", "/mm³", "x 10^3/uL", "×10⁹/L"],
    refBand: { adult: { low: 3.7, high: 10.5 } },
    sanity: { min: 0, max: 200 }, stableEps: 0.10,
  },
  hemoglobin: {
    label: "Hgb", canonicalUnit: "g/dL", altUnits: ["g/L"],
    refBand: { adult: { low: 11.9, high: 17.7 } },
    sanity: { min: 2, max: 25 }, stableEps: 0.10,
  },
  hematocrit: {
    label: "Hct", canonicalUnit: "%", altUnits: [],
    refBand: { adult: { low: 35, high: 52 } },
    sanity: { min: 5, max: 80 }, stableEps: 0.10,
  },
  platelets: {
    label: "Platelets", canonicalUnit: "×10³/µL", altUnits: ["K/µL", "/µL", "/μL", "/uL", "/mcL", "/mm3", "/mm³", "x 10^3/uL", "×10⁹/L"],
    refBand: { adult: { low: 150, high: 400 } },
    sanity: { min: 0, max: 2000 }, stableEps: 0.10,
  },
  inr: {
    label: "INR", canonicalUnit: "(ratio)", altUnits: [],
    refBand: { adult: { low: 0.8, high: 1.2 } },
    sanity: { min: 0.5, max: 20 }, stableEps: 0.10,
  },
  ptt: {
    label: "PTT", canonicalUnit: "seconds", altUnits: ["sec"],
    refBand: { adult: { low: 22, high: 31 } },
    sanity: { min: 10, max: 300 }, stableEps: 0.10,
  },
  ph: {
    label: "pH", canonicalUnit: "(unitless)", altUnits: [],
    refBand: { adult: { low: 7.35, high: 7.45 } },
    sanity: { min: 6.5, max: 8.0 }, stableEps: 0.10,
  },
  paco2: {
    label: "PaCO₂", canonicalUnit: "mmHg", altUnits: [],
    refBand: { adult: { low: 35, high: 45 } },
    sanity: { min: 5, max: 200 }, stableEps: 0.10,
  },
  pao2: {
    label: "PaO₂", canonicalUnit: "mmHg", altUnits: [],
    refBand: { adult: { low: 75, high: 100 } },
    sanity: { min: 10, max: 700 }, stableEps: 0.10,
  },
  hco3_abg: {
    label: "HCO₃ (ABG)", canonicalUnit: "mEq/L", altUnits: ["mmol/L"],
    refBand: { adult: { low: 22, high: 26 } },
    sanity: { min: 5, max: 50 }, stableEps: 0.10,
  },
  ast: {
    label: "AST", canonicalUnit: "U/L", altUnits: [],
    refBand: { adult: { low: 0, high: 50 } },
    sanity: { min: 0, max: 10000 }, stableEps: 0.10,
  },
  alt: {
    label: "ALT", canonicalUnit: "U/L", altUnits: [],
    refBand: { adult: { low: 0, high: 50 } },
    sanity: { min: 0, max: 10000 }, stableEps: 0.10,
  },
  total_bilirubin: {
    label: "Total Bili", canonicalUnit: "mg/dL", altUnits: [],
    refBand: { adult: { low: 0, high: 1.2 } },
    sanity: { min: 0, max: 60 }, stableEps: 0.10,
  },
  ammonia: {
    label: "Ammonia", canonicalUnit: "µmol/L", altUnits: ["µg/dL"],
    refBand: { adult: { low: 11, high: 60 } },
    sanity: { min: 0, max: 1000 }, stableEps: 0.10,
  },
};
