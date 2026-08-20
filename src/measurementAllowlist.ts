import { ANALYTE_DEFS } from "./visuals/kinds/lab_trend/defs";
import { VITAL_DEFS } from "./visuals/kinds/vitals_trend/defs";
import type { VitalKey } from "./visuals/kinds/vitals_trend/types";

export interface MeasurementDef {
  key: string;
  canonicalUnit: string;
  acceptedSourceUnits: readonly string[];
  inferredUnit?: string;
  sanity: Readonly<{ min: number; max: number }>;
  kind: "vital" | "lab";
}

const freezeDef = (def: MeasurementDef): MeasurementDef =>
  Object.freeze({
    ...def,
    acceptedSourceUnits: Object.freeze([...def.acceptedSourceUnits]),
    sanity: Object.freeze({ ...def.sanity }),
  });

const INFERRED_UNITS: Readonly<Record<string, string>> = Object.freeze({
  bun: "mg/dL",
  creatinine: "mg/dL",
  glucose: "mg/dL",
  lactate: "mmol/L",
  ast: "U/L",
  alt: "U/L",
  total_bilirubin: "mg/dL",
});

/**
 * Authored per-side canonical-unit sanity bounds that intentionally diverge
 * from the vital registry ranges.
 *
 * VITAL_DEFS[key].range supplies the renderer validation envelope for most
 * vitals. Temperature is different: its active validator bypasses the legacy
 * registry range and uses separate source-unit-specific bounds.
 *
 * MeasurementDef.sanity is a warning-only unit/value-mismatch tripwire used by
 * the flowsheet gate after conversion to the canonical unit. R3 authors the
 * temperature ceiling; R5 authors the SBP and RR ceilings and the SpO2 floor.
 * All other sides continue to inherit their matching registry range side.
 *
 * Adding another key is a data-contract change requiring a consumer trace,
 * bank-impact survey, sourcing where clinically applicable, and the full
 * schema verification path. Do not quietly retune bounds here.
 */
const VITAL_SANITY_MIN_OVERRIDES: Readonly<Partial<Record<VitalKey, number>>> =
  Object.freeze({
    spo2: 0, // Ratified by R5.
  });

const VITAL_SANITY_MAX_OVERRIDES: Readonly<Partial<Record<VitalKey, number>>> =
  Object.freeze({
    sbp: 400, // Ratified by R5.
    rr: 150, // Ratified by R5.
    temp: 46.5, // Ratified by R3.
  });

const vitalEntries = Object.entries(VITAL_DEFS).map(([key, def]) => {
  const vitalKey = key as VitalKey;
  return [
    key,
    freezeDef({
      key,
      canonicalUnit: def.unit,
      acceptedSourceUnits: key === "temp" ? [def.unit, "°F", "F", "C"] : [def.unit],
      sanity: {
        min: VITAL_SANITY_MIN_OVERRIDES[vitalKey] ?? def.range.min,
        max: VITAL_SANITY_MAX_OVERRIDES[vitalKey] ?? def.range.max,
      },
      kind: "vital",
    }),
  ] as const;
});

const labEntries = Object.entries(ANALYTE_DEFS).map(([key, def]) => [
  key,
  freezeDef({
    key,
    canonicalUnit: def.canonicalUnit,
    acceptedSourceUnits: [def.canonicalUnit, ...def.altUnits],
    ...(INFERRED_UNITS[key] ? { inferredUnit: INFERRED_UNITS[key] } : {}),
    sanity: def.sanity,
    kind: "lab",
  }),
] as const);

const structuredOnlyEntries = [
  ["troponin_i", freezeDef({
    key: "troponin_i",
    canonicalUnit: "ng/mL",
    acceptedSourceUnits: ["ng/mL", "µg/L"],
    sanity: { min: 0, max: 50 },
    kind: "lab",
  })],
  ["sao2", freezeDef({
    key: "sao2",
    canonicalUnit: "%",
    acceptedSourceUnits: ["%"],
    sanity: { min: 50, max: 100 },
    kind: "lab",
  })],
  ["uric_acid", freezeDef({
    key: "uric_acid",
    canonicalUnit: "mg/dL",
    acceptedSourceUnits: ["mg/dL"],
    sanity: { min: 0, max: 30 },
    kind: "lab",
  })],
] as const;

export const MEASUREMENT_ALLOWLIST: Readonly<Record<string, MeasurementDef>> = Object.freeze(
  Object.fromEntries([...vitalEntries, ...labEntries, ...structuredOnlyEntries]) as Record<string, MeasurementDef>,
);

export const ALLOWLIST_KEYS: ReadonlySet<string> = Object.freeze(new Set(Object.keys(MEASUREMENT_ALLOWLIST)));
