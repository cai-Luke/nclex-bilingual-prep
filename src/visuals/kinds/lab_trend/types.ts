import type { Population } from "../../../population";

// Adult teaching bands are source-verified in defs.ts. Pediatric bands are intentionally
// unavailable until the population model can represent clinically meaningful age bands.

export type LabAnalyteKey =
  | "sodium" | "potassium" | "chloride" | "bicarbonate" | "anion_gap"
  | "bun" | "creatinine" | "glucose"
  | "calcium" | "ionized_calcium" | "magnesium" | "phosphate"
  | "lactate" | "troponin_t" | "bnp"
  | "wbc" | "hemoglobin" | "hematocrit" | "platelets"
  | "inr" | "ptt" | "ph" | "paco2" | "pao2" | "hco3_abg"
  | "ast" | "alt" | "total_bilirubin" | "ammonia";

export interface LabTrendSpec {
  kind: "lab_trend";
  /** Hour/min/day offsets; strictly increasing; length >= 3. */
  time: { unit: "hr" | "min" | "day"; values: number[] };
  /** Reference-range population. Default "adult". Pediatric populations are trend-only. */
  population?: Population;
  /** 1–2 analytes. Plot only the load-bearing analyte(s). */
  series: {
    analyte: LabAnalyteKey;
    /** Same length as time.values; one value per timepoint. */
    values: number[];
    /** Display/validation unit. Defaults to the registry's canonical unit. */
    unit?: string;
    /** Show the verified band. Default true; must be false for pediatric trend-only use. */
    showReferenceBand?: boolean;
  }[];
  caption?: { en: string; zh?: string };
}
