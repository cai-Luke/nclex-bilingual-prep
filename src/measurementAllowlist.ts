import { ANALYTE_DEFS } from "./visuals/kinds/lab_trend/defs";
import { VITAL_DEFS } from "./visuals/kinds/vitals_trend/defs";

export interface MeasurementDef {
  key: string;
  canonicalUnit: string;
  acceptedSourceUnits: readonly string[];
  sanity: Readonly<{ min: number; max: number }>;
  kind: "vital" | "lab";
}

const freezeDef = (def: MeasurementDef): MeasurementDef =>
  Object.freeze({
    ...def,
    acceptedSourceUnits: Object.freeze([...def.acceptedSourceUnits]),
    sanity: Object.freeze({ ...def.sanity }),
  });

const vitalEntries = Object.entries(VITAL_DEFS).map(([key, def]) => [
  key,
  freezeDef({
    key,
    canonicalUnit: def.unit,
    acceptedSourceUnits: [def.unit],
    sanity: def.range,
    kind: "vital",
  }),
] as const);

const labEntries = Object.entries(ANALYTE_DEFS).map(([key, def]) => [
  key,
  freezeDef({
    key,
    canonicalUnit: def.canonicalUnit,
    acceptedSourceUnits: [def.canonicalUnit, ...def.altUnits],
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
] as const;

export const MEASUREMENT_ALLOWLIST: Readonly<Record<string, MeasurementDef>> = Object.freeze(
  Object.fromEntries([...vitalEntries, ...labEntries, ...structuredOnlyEntries]) as Record<string, MeasurementDef>,
);

export const ALLOWLIST_KEYS: ReadonlySet<string> = Object.freeze(new Set(Object.keys(MEASUREMENT_ALLOWLIST)));
