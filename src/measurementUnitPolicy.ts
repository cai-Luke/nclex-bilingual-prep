import { MEASUREMENT_ALLOWLIST } from "./measurementAllowlist";

export interface MeasurementDisplayPolicy {
  primaryUnit: string;
  secondaryUnit?: string;
  secondaryMode?: "paren";
}

export interface UnitConversionSource {
  label: string;
  url: string;
  note: string;
}

export const UNIT_CONVERSION_SOURCES: readonly UnitConversionSource[] = Object.freeze([
  Object.freeze({
    label: "Merck Manual Professional, Unit of Measure Conversions",
    url: "https://www.merckmanuals.com/professional/resources/unit-of-measure-conversions/unit-of-measure-conversions",
    note: "Defines mEq, mg, mmol conversion formulae using formula weight and valence.",
  }),
  Object.freeze({
    label: "NLM UCUM unit conversion service",
    url: "https://ucum.nlm.nih.gov/ucum-service.html",
    note: "Equivalent-to-mass conversions require substance molecular weight and charge.",
  }),
]);

export const normalizeUnit = (unit: string): string =>
  unit.normalize("NFC").replace(/\s+/g, "").replace(/·/g, "").toLowerCase();

const factorKey = (key: string, sourceUnit: string): string => `${key}|${normalizeUnit(sourceUnit)}`;

// Linear factor to convert SOURCE value -> registry canonical value.
// Factors are keyed by analyte and source unit, never by unit token alone.
export const LINEAR_UNIT_FACTORS: Readonly<Record<string, number>> = Object.freeze({
  // CBC counts: ×10³/µL, K/µL, and ×10⁹/L carry the same plotted magnitude.
  // Plain per-microliter-style counts scale by 1e-3.
  [factorKey("wbc", "/µL")]: 1e-3,
  [factorKey("wbc", "/μL")]: 1e-3,
  [factorKey("wbc", "/uL")]: 1e-3,
  [factorKey("wbc", "/mcL")]: 1e-3,
  [factorKey("wbc", "/mm3")]: 1e-3,
  [factorKey("wbc", "/mm³")]: 1e-3,
  [factorKey("wbc", "x 10^3/uL")]: 1,
  [factorKey("wbc", "×10³/µL")]: 1,
  [factorKey("wbc", "K/µL")]: 1,
  [factorKey("wbc", "×10⁹/L")]: 1,
  [factorKey("platelets", "/µL")]: 1e-3,
  [factorKey("platelets", "/μL")]: 1e-3,
  [factorKey("platelets", "/uL")]: 1e-3,
  [factorKey("platelets", "/mcL")]: 1e-3,
  [factorKey("platelets", "/mm3")]: 1e-3,
  [factorKey("platelets", "/mm³")]: 1e-3,
  [factorKey("platelets", "x 10^3/uL")]: 1,
  [factorKey("platelets", "×10³/µL")]: 1,
  [factorKey("platelets", "K/µL")]: 1,
  [factorKey("platelets", "×10⁹/L")]: 1,

  [factorKey("sodium", "mmol/L")]: 1,
  [factorKey("potassium", "mmol/L")]: 1,
  [factorKey("chloride", "mmol/L")]: 1,
  [factorKey("bicarbonate", "mmol/L")]: 1,
  [factorKey("hco3_abg", "mmol/L")]: 1,

  [factorKey("bun", "mmol/L")]: 2.801,
  [factorKey("creatinine", "µmol/L")]: 0.011312,
  [factorKey("glucose", "mmol/L")]: 18.0182,
  [factorKey("calcium", "mmol/L")]: 4.008,
  [factorKey("calcium", "mEq/L")]: 2.004,
  [factorKey("ionized_calcium", "mg/dL")]: 0.2495,
  [factorKey("ionized_calcium", "mEq/L")]: 0.5,
  [factorKey("magnesium", "mmol/L")]: 2.4305,
  [factorKey("magnesium", "mEq/L")]: 1.2153,
  [factorKey("phosphate", "mmol/L")]: 3.097,
  [factorKey("hemoglobin", "g/L")]: 0.1,
  [factorKey("troponin_t", "µg/L")]: 1,
  [factorKey("troponin_i", "µg/L")]: 1,
  [factorKey("ptt", "sec")]: 1,
});

export const MEASUREMENT_DISPLAY_POLICIES: Readonly<Record<string, MeasurementDisplayPolicy>> = Object.freeze({
  temp: Object.freeze({ primaryUnit: "°F", secondaryUnit: "°C", secondaryMode: "paren" }),
  wbc: Object.freeze({ primaryUnit: "×10³/µL", secondaryUnit: "×10⁹/L", secondaryMode: "paren" }),
  platelets: Object.freeze({ primaryUnit: "×10³/µL", secondaryUnit: "×10⁹/L", secondaryMode: "paren" }),
  calcium: Object.freeze({ primaryUnit: "mg/dL", secondaryUnit: "mmol/L", secondaryMode: "paren" }),
  magnesium: Object.freeze({ primaryUnit: "mg/dL", secondaryUnit: "mmol/L", secondaryMode: "paren" }),
});

export const displayPolicyFor = (key: string): MeasurementDisplayPolicy => {
  const policy = MEASUREMENT_DISPLAY_POLICIES[key];
  if (policy) return policy;
  const def = MEASUREMENT_ALLOWLIST[key];
  return { primaryUnit: def?.canonicalUnit ?? "" };
};

export const parseMeasurementValue = (rawValue: string): number | null => {
  const cleaned = rawValue.replace(/,/g, "").replace(/[<>]/g, "").trim();
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
};

export const toCanonicalMeasurementValue = (key: string, rawValue: string, sourceUnit: string): number | null => {
  const value = parseMeasurementValue(rawValue);
  if (value === null) return null;
  const normalizedUnit = normalizeUnit(sourceUnit);

  if (key === "temp") {
    if (normalizedUnit === "°f" || normalizedUnit === "f") return (value - 32) * (5 / 9);
    return value;
  }

  const factor = LINEAR_UNIT_FACTORS[factorKey(key, sourceUnit)];
  if (factor !== undefined) return value * factor;

  const def = MEASUREMENT_ALLOWLIST[key];
  if (!def) return null;
  if (normalizedUnit === normalizeUnit(def.canonicalUnit)) return value;
  if (def.acceptedSourceUnits.map(normalizeUnit).includes(normalizedUnit)) return null;
  return null;
};

export const toMeasurementDisplayValue = (
  key: string,
  rawValue: string,
  sourceUnit: string,
  displayUnit: string,
): number | null => {
  const canonicalValue = toCanonicalMeasurementValue(key, rawValue, sourceUnit);
  if (canonicalValue === null) return null;
  const def = MEASUREMENT_ALLOWLIST[key];
  if (!def) return null;
  const normalizedDisplayUnit = normalizeUnit(displayUnit);

  if (key === "temp") {
    if (normalizedDisplayUnit === normalizeUnit(def.canonicalUnit)) return canonicalValue;
    if (normalizedDisplayUnit === "°f" || normalizedDisplayUnit === "f") return (canonicalValue * (9 / 5)) + 32;
  }

  if (normalizedDisplayUnit === normalizeUnit(def.canonicalUnit)) return canonicalValue;

  const canonicalFromDisplayFactor = LINEAR_UNIT_FACTORS[factorKey(key, displayUnit)];
  if (canonicalFromDisplayFactor !== undefined) return canonicalValue / canonicalFromDisplayFactor;

  if (normalizedDisplayUnit === normalizeUnit(sourceUnit)) return parseMeasurementValue(rawValue);
  return null;
};
