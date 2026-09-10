// scripts/single-row-lab-panels-survey.ts
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// src/allowedKeys.ts
var allowedKeySets = {
  bank: ["meta", "questions"],
  bankMeta: ["schemaVersion", "exam", "topic", "category", "difficulty", "count"],
  questionCommon: [
    "id",
    "itemType",
    "category",
    "topic",
    "difficulty",
    "ngnSkill",
    "stem",
    "rationale",
    "testTakingStrategy",
    "glossary",
    "visual",
    "meta"
  ],
  questionByItemType: {
    multiple_choice: ["options", "correct"],
    select_all: ["options", "correct"],
    ordered_response: ["options", "correct"],
    fill_in_blank: ["blanks"],
    matrix: ["matrix", "correct"],
    dropdown_cloze: ["clozeStem", "dropdowns"],
    highlight: ["highlight"],
    bowtie: ["bowtie"],
    case_study: ["caseStudy"]
  },
  caseSubQuestion: ["stageId", "answerableAfterStageId"],
  textPair: ["en", "zh"],
  rationale: ["correct", "byChoice", "visuals"],
  rationaleChoice: ["refId", "en", "zh"],
  glossaryTerm: ["termEn", "termZh", "defZh"],
  option: ["id", "en", "zh"],
  blank: ["id", "prompt", "acceptable", "numeric"],
  blankNumeric: ["value", "tolerance", "unit"],
  matrix: ["rows", "columns", "selectionMode"],
  matrixCorrect: ["rowId", "columnIds"],
  dropdown: ["id", "options", "correct"],
  highlight: ["segments", "correct"],
  highlightSegment: ["id", "en", "zh", "selectable"],
  bowtie: ["condition", "actions", "parameters"],
  bowtieZone: ["prompt", "tokens", "correct"],
  bowtieToken: ["id", "en", "zh"],
  caseStudy: ["title", "summary", "exhibits", "stages", "questions"],
  caseStudyExhibit: ["id", "type", "title", "content", "visual", "structuredMeasurements"],
  caseStudyStage: ["id", "title", "trigger", "narrative", "timeOffset", "exhibits"],
  structuredMeasurements: ["population", "panels"],
  structuredMeasurementPanel: ["kind", "columns", "rows"],
  structuredMeasurementColumn: ["id", "label"],
  structuredMeasurementRow: ["key", "label", "values"],
  structuredMeasurementValue: ["columnId", "value", "unit", "bound", "context"],
  questionMeta: [
    "visual_justification",
    "derived_values_keyed",
    "expected_trend",
    "expected_flags",
    "expected_pattern",
    "pattern_keyed",
    "expected",
    "reference_bands",
    "collapse_test",
    "crossover",
    "keyed_cells",
    "keyed_relationship",
    "keyed_settings",
    "source",
    "tier",
    "skill_signature",
    "stem_disambiguators",
    "order",
    "weight_kg",
    "round",
    "shift_hours"
  ],
  expectedTrend: ["series", "vital", "direction", "window"],
  expectedFlag: ["series", "vital", "at", "flag"],
  referenceBand: ["series", "vital", "low", "high", "unit", "population"],
  caption: ["en", "zh"],
  visualCommon: ["kind", "caption"],
  visualByKind: {
    rhythm_strip: [
      "rhythm",
      "rateBpm",
      "durationSec",
      "seed",
      "calibrationPulse",
      "atrialRateBpm",
      "conductionRatio",
      "prSec",
      "qrsSec",
      "qtSec",
      "pacer"
    ],
    capnography: [
      "pattern",
      "etco2",
      "respiratoryRate",
      "durationSec",
      "severity",
      "baselineEtco2",
      "rosc"
    ],
    vitals_trend: ["timepointsHr", "time", "population", "series", "tempUnit"],
    lab_trend: ["time", "population", "series"],
    mar: ["timeGrid", "medications"],
    io_record: ["periodLabel", "intake", "output"],
    io_trend: ["time", "intervals", "binLabels", "showCumulativeNet", "periodLabel"],
    medication_label: [
      "drugName",
      "amount",
      "amountUnit",
      "perQty",
      "perUnit",
      "showDerivedConcentration",
      "fields"
    ],
    device_screen: ["device", "title", "settings"],
    fetal_monitoring: [
      "durationSec",
      "baselineFhr",
      "variability",
      "seed",
      "contractions",
      "accelerations",
      "decelerations"
    ],
    burn_map: ["population", "burns"],
    injection_site: ["route", "vessel"]
  },
  rosc: ["lowEtco2", "highEtco2", "stepAtSec"],
  visualTime: ["unit", "values"],
  vitalsSeries: ["vital", "values", "showReferenceBand"],
  labSeries: ["analyte", "values", "unit", "showReferenceBand"],
  marMedication: ["name", "dose", "route", "frequency", "administrations", "isHighAlert"],
  marAdministration: ["time", "status"],
  ioEntry: ["label", "volumeMl"],
  ioTrendInterval: ["intakeMl", "outputMl"],
  crossoverAssertion: ["series", "index", "from", "to"],
  medLabelField: ["label", "value"],
  deviceSetting: ["key", "value", "text", "unit", "flag"],
  fetalContraction: ["peakSec", "amplitudeMmHg", "durationSec"],
  fetalAcceleration: ["peakSec", "riseBpm", "durationSec"],
  fetalDeceleration: ["type", "nadirSec", "depthBpm", "durationSec", "contractionIndex"]
};

// src/visuals/kinds/lab_trend/defs.ts
var ANALYTE_DEFS = {
  sodium: {
    label: "Na\u207A",
    canonicalUnit: "mEq/L",
    altUnits: ["mmol/L"],
    refBand: { adult: { low: 135, high: 145 } },
    sanity: { min: 90, max: 200 },
    stableEps: 0.1
  },
  potassium: {
    label: "K\u207A",
    canonicalUnit: "mEq/L",
    altUnits: ["mmol/L"],
    refBand: { adult: { low: 3.5, high: 5 } },
    sanity: { min: 1, max: 10 },
    stableEps: 0.1
  },
  chloride: {
    label: "Cl\u207B",
    canonicalUnit: "mEq/L",
    altUnits: ["mmol/L"],
    refBand: { adult: { low: 95, high: 107 } },
    sanity: { min: 60, max: 160 },
    stableEps: 0.1
  },
  bicarbonate: {
    label: "HCO\u2083\u207B",
    canonicalUnit: "mEq/L",
    altUnits: ["mmol/L"],
    refBand: { adult: { low: 22, high: 29 } },
    sanity: { min: 3, max: 60 },
    stableEps: 0.1
  },
  anion_gap: {
    label: "Anion Gap",
    canonicalUnit: "mEq/L",
    altUnits: [],
    refBand: { adult: { low: 7, high: 15 } },
    sanity: { min: 0, max: 50 },
    stableEps: 0.1
  },
  bun: {
    label: "BUN",
    canonicalUnit: "mg/dL",
    altUnits: ["mmol/L"],
    refBand: { adult: { low: 10, high: 20 } },
    sanity: { min: 1, max: 250 },
    stableEps: 0.1
  },
  creatinine: {
    label: "Creatinine",
    canonicalUnit: "mg/dL",
    altUnits: ["\xB5mol/L"],
    refBand: { adult: { low: 0.51, high: 1.17 } },
    sanity: { min: 0.1, max: 25 },
    stableEps: 0.1
  },
  glucose: {
    label: "Glucose",
    canonicalUnit: "mg/dL",
    altUnits: ["mmol/L"],
    refBand: { adult: { low: 65, high: 139 } },
    sanity: { min: 10, max: 1500 },
    stableEps: 0.1
  },
  calcium: {
    label: "Ca\xB2\u207A",
    canonicalUnit: "mg/dL",
    altUnits: ["mmol/L", "mEq/L"],
    refBand: { adult: { low: 8.5, high: 10.5 } },
    sanity: { min: 3, max: 20 },
    stableEps: 0.1
  },
  ionized_calcium: {
    label: "iCa\xB2\u207A",
    canonicalUnit: "mmol/L",
    altUnits: ["mg/dL", "mEq/L"],
    refBand: { adult: { low: 0.95, high: 1.3 } },
    sanity: { min: 0.3, max: 5 },
    stableEps: 0.1
  },
  magnesium: {
    label: "Mg\xB2\u207A",
    canonicalUnit: "mg/dL",
    altUnits: ["mmol/L", "mEq/L"],
    refBand: { adult: { low: 1.7, high: 2.3 } },
    sanity: { min: 0.3, max: 10 },
    stableEps: 0.1
  },
  phosphate: {
    label: "PO\u2084\xB3\u207B",
    canonicalUnit: "mg/dL",
    altUnits: ["mmol/L"],
    refBand: { adult: { low: 2.5, high: 4.5 } },
    sanity: { min: 0.2, max: 20 },
    stableEps: 0.1
  },
  lactate: {
    label: "Lactate",
    canonicalUnit: "mmol/L",
    altUnits: [],
    refBand: { adult: { low: 0.5, high: 2 } },
    sanity: { min: 0.1, max: 40 },
    stableEps: 0.1
  },
  troponin_t: {
    label: "hs-Troponin T",
    canonicalUnit: "ng/mL",
    altUnits: ["\xB5g/L"],
    refBand: { adult: { low: 0, high: 0.022 } },
    sanity: { min: 0, max: 50 },
    stableEps: 0.1
  },
  bnp: {
    label: "BNP",
    canonicalUnit: "pg/mL",
    altUnits: [],
    refBand: { adult: { low: 0, high: 100 } },
    sanity: { min: 0, max: 1e4 },
    stableEps: 0.1
  },
  wbc: {
    label: "WBC",
    canonicalUnit: "\xD710\xB3/\xB5L",
    altUnits: ["K/\xB5L", "/\xB5L", "/\u03BCL", "/uL", "/mcL", "/mm3", "/mm\xB3", "x 10^3/uL", "\xD710\u2079/L"],
    refBand: { adult: { low: 3.7, high: 10.5 } },
    sanity: { min: 0, max: 200 },
    stableEps: 0.1
  },
  hemoglobin: {
    label: "Hgb",
    canonicalUnit: "g/dL",
    altUnits: ["g/L"],
    refBand: { adult: { low: 11.9, high: 17.7 } },
    sanity: { min: 2, max: 25 },
    stableEps: 0.1
  },
  hematocrit: {
    label: "Hct",
    canonicalUnit: "%",
    altUnits: [],
    refBand: { adult: { low: 35, high: 52 } },
    sanity: { min: 5, max: 80 },
    stableEps: 0.1
  },
  platelets: {
    label: "Platelets",
    canonicalUnit: "\xD710\xB3/\xB5L",
    altUnits: ["K/\xB5L", "/\xB5L", "/\u03BCL", "/uL", "/mcL", "/mm3", "/mm\xB3", "x 10^3/uL", "\xD710\u2079/L"],
    refBand: { adult: { low: 150, high: 400 } },
    sanity: { min: 0, max: 2e3 },
    stableEps: 0.1
  },
  inr: {
    label: "INR",
    canonicalUnit: "(ratio)",
    altUnits: [],
    refBand: { adult: { low: 0.8, high: 1.2 } },
    sanity: { min: 0.5, max: 20 },
    stableEps: 0.1
  },
  ptt: {
    label: "PTT",
    canonicalUnit: "seconds",
    altUnits: ["sec"],
    refBand: { adult: { low: 22, high: 31 } },
    sanity: { min: 10, max: 300 },
    stableEps: 0.1
  },
  ph: {
    label: "pH",
    canonicalUnit: "(unitless)",
    altUnits: [],
    refBand: { adult: { low: 7.35, high: 7.45 } },
    sanity: { min: 6.5, max: 8 },
    stableEps: 0.1
  },
  paco2: {
    label: "PaCO\u2082",
    canonicalUnit: "mmHg",
    altUnits: [],
    refBand: { adult: { low: 35, high: 45 } },
    sanity: { min: 5, max: 200 },
    stableEps: 0.1
  },
  pao2: {
    label: "PaO\u2082",
    canonicalUnit: "mmHg",
    altUnits: [],
    refBand: { adult: { low: 75, high: 100 } },
    sanity: { min: 10, max: 700 },
    stableEps: 0.1
  },
  hco3_abg: {
    label: "HCO\u2083 (ABG)",
    canonicalUnit: "mEq/L",
    altUnits: ["mmol/L"],
    refBand: { adult: { low: 22, high: 26 } },
    sanity: { min: 5, max: 50 },
    stableEps: 0.1
  },
  ast: {
    label: "AST",
    canonicalUnit: "U/L",
    altUnits: [],
    refBand: { adult: { low: 0, high: 50 } },
    sanity: { min: 0, max: 1e4 },
    stableEps: 0.1
  },
  alt: {
    label: "ALT",
    canonicalUnit: "U/L",
    altUnits: [],
    refBand: { adult: { low: 0, high: 50 } },
    sanity: { min: 0, max: 1e4 },
    stableEps: 0.1
  },
  total_bilirubin: {
    label: "Total Bili",
    canonicalUnit: "mg/dL",
    altUnits: [],
    refBand: { adult: { low: 0, high: 1.2 } },
    sanity: { min: 0, max: 60 },
    stableEps: 0.1
  },
  ammonia: {
    label: "Ammonia",
    canonicalUnit: "\xB5mol/L",
    altUnits: ["\xB5g/dL"],
    refBand: { adult: { low: 11, high: 60 } },
    sanity: { min: 0, max: 1e3 },
    stableEps: 0.1
  }
};

// src/visuals/kinds/vitals_trend/defs.ts
var VITAL_DEFS = {
  hr: { label: "HR", unit: "bpm", axis: "left", styleRole: "red", range: { min: 10, max: 300 }, normal: () => ({ low: 60, high: 100 }) },
  sbp: { label: "SBP", unit: "mmHg", axis: "left", styleRole: "blue", range: { min: 40, max: 300 }, normal: () => ({ low: 90, high: 120 }) },
  dbp: { label: "DBP", unit: "mmHg", axis: "left", styleRole: "blue", range: { min: 20, max: 200 }, normal: () => ({ low: 60, high: 80 }) },
  map: { label: "MAP", unit: "mmHg", axis: "left", styleRole: "purple", range: { min: 30, max: 250 }, normal: () => ({ low: 70, high: 100 }) },
  rr: { label: "RR", unit: "/min", axis: "left", styleRole: "green", range: { min: 2, max: 80 }, normal: () => ({ low: 12, high: 20 }) },
  spo2: { label: "SpO2", unit: "%", axis: "right", styleRole: "slate", range: { min: 50, max: 100 }, normal: () => ({ low: 95, high: 100 }) },
  temp: { label: "Temp", unit: "\xB0C", axis: "right", styleRole: "orange", range: { min: 30, max: 110 }, normal: (u) => u === "F" ? { low: 97.7, high: 99.5 } : { low: 36.5, high: 37.5 } }
};

// src/measurementAllowlist.ts
var freezeDef = (def) => Object.freeze({
  ...def,
  acceptedSourceUnits: Object.freeze([...def.acceptedSourceUnits]),
  sanity: Object.freeze({ ...def.sanity })
});
var INFERRED_UNITS = Object.freeze({
  bun: "mg/dL",
  creatinine: "mg/dL",
  glucose: "mg/dL",
  lactate: "mmol/L",
  ast: "U/L",
  alt: "U/L",
  total_bilirubin: "mg/dL"
});
var VITAL_SANITY_MIN_OVERRIDES = Object.freeze({
  spo2: 0
  // Ratified by R5.
});
var VITAL_SANITY_MAX_OVERRIDES = Object.freeze({
  sbp: 400,
  // Ratified by R5.
  rr: 150,
  // Ratified by R5.
  temp: 46.5
  // Ratified by R3.
});
var vitalEntries = Object.entries(VITAL_DEFS).map(([key, def]) => {
  const vitalKey = key;
  return [
    key,
    freezeDef({
      key,
      canonicalUnit: def.unit,
      acceptedSourceUnits: key === "temp" ? [def.unit, "\xB0F", "F", "C"] : [def.unit],
      sanity: {
        min: VITAL_SANITY_MIN_OVERRIDES[vitalKey] ?? def.range.min,
        max: VITAL_SANITY_MAX_OVERRIDES[vitalKey] ?? def.range.max
      },
      kind: "vital"
    })
  ];
});
var labEntries = Object.entries(ANALYTE_DEFS).map(([key, def]) => [
  key,
  freezeDef({
    key,
    canonicalUnit: def.canonicalUnit,
    acceptedSourceUnits: [def.canonicalUnit, ...def.altUnits],
    ...INFERRED_UNITS[key] ? { inferredUnit: INFERRED_UNITS[key] } : {},
    sanity: def.sanity,
    kind: "lab"
  })
]);
var structuredOnlyEntries = [
  ["troponin_i", freezeDef({
    key: "troponin_i",
    canonicalUnit: "ng/mL",
    acceptedSourceUnits: ["ng/mL", "\xB5g/L"],
    sanity: { min: 0, max: 50 },
    kind: "lab"
  })],
  ["sao2", freezeDef({
    key: "sao2",
    canonicalUnit: "%",
    acceptedSourceUnits: ["%"],
    sanity: { min: 50, max: 100 },
    kind: "lab"
  })],
  ["uric_acid", freezeDef({
    key: "uric_acid",
    canonicalUnit: "mg/dL",
    acceptedSourceUnits: ["mg/dL"],
    sanity: { min: 0, max: 30 },
    kind: "lab"
  })]
];
var MEASUREMENT_ALLOWLIST = Object.freeze(
  Object.fromEntries([...vitalEntries, ...labEntries, ...structuredOnlyEntries])
);
var ALLOWLIST_KEYS = Object.freeze(new Set(Object.keys(MEASUREMENT_ALLOWLIST)));

// src/measurementUnitPolicy.ts
var UNIT_CONVERSION_SOURCES = Object.freeze([
  Object.freeze({
    label: "Merck Manual Professional, Unit of Measure Conversions",
    url: "https://www.merckmanuals.com/professional/resources/unit-of-measure-conversions/unit-of-measure-conversions",
    note: "Defines mEq, mg, mmol conversion formulae using formula weight and valence."
  }),
  Object.freeze({
    label: "NLM UCUM unit conversion service",
    url: "https://ucum.nlm.nih.gov/ucum-service.html",
    note: "Equivalent-to-mass conversions require substance molecular weight and charge."
  })
]);
var normalizeUnit = (unit) => unit.normalize("NFC").replace(/\s+/g, "").replace(/·/g, "").toLowerCase();
var factorKey = (key, sourceUnit) => `${key}|${normalizeUnit(sourceUnit)}`;
var LINEAR_UNIT_FACTORS = Object.freeze({
  // CBC counts: ×10³/µL, K/µL, and ×10⁹/L carry the same plotted magnitude.
  // Plain per-microliter-style counts scale by 1e-3.
  [factorKey("wbc", "/\xB5L")]: 1e-3,
  [factorKey("wbc", "/\u03BCL")]: 1e-3,
  [factorKey("wbc", "/uL")]: 1e-3,
  [factorKey("wbc", "/mcL")]: 1e-3,
  [factorKey("wbc", "/mm3")]: 1e-3,
  [factorKey("wbc", "/mm\xB3")]: 1e-3,
  [factorKey("wbc", "x 10^3/uL")]: 1,
  [factorKey("wbc", "\xD710\xB3/\xB5L")]: 1,
  [factorKey("wbc", "K/\xB5L")]: 1,
  [factorKey("wbc", "\xD710\u2079/L")]: 1,
  [factorKey("platelets", "/\xB5L")]: 1e-3,
  [factorKey("platelets", "/\u03BCL")]: 1e-3,
  [factorKey("platelets", "/uL")]: 1e-3,
  [factorKey("platelets", "/mcL")]: 1e-3,
  [factorKey("platelets", "/mm3")]: 1e-3,
  [factorKey("platelets", "/mm\xB3")]: 1e-3,
  [factorKey("platelets", "x 10^3/uL")]: 1,
  [factorKey("platelets", "\xD710\xB3/\xB5L")]: 1,
  [factorKey("platelets", "K/\xB5L")]: 1,
  [factorKey("platelets", "\xD710\u2079/L")]: 1,
  [factorKey("sodium", "mmol/L")]: 1,
  [factorKey("potassium", "mmol/L")]: 1,
  [factorKey("chloride", "mmol/L")]: 1,
  [factorKey("bicarbonate", "mmol/L")]: 1,
  [factorKey("hco3_abg", "mmol/L")]: 1,
  [factorKey("bun", "mmol/L")]: 2.801,
  [factorKey("creatinine", "\xB5mol/L")]: 0.011312,
  [factorKey("glucose", "mmol/L")]: 18.0182,
  [factorKey("calcium", "mmol/L")]: 4.008,
  [factorKey("calcium", "mEq/L")]: 2.004,
  [factorKey("ionized_calcium", "mg/dL")]: 0.2495,
  [factorKey("ionized_calcium", "mEq/L")]: 0.5,
  [factorKey("magnesium", "mmol/L")]: 2.4305,
  [factorKey("magnesium", "mEq/L")]: 1.2153,
  [factorKey("phosphate", "mmol/L")]: 3.097,
  [factorKey("hemoglobin", "g/L")]: 0.1,
  [factorKey("troponin_t", "\xB5g/L")]: 1,
  [factorKey("troponin_i", "\xB5g/L")]: 1,
  [factorKey("ptt", "sec")]: 1
});
var MEASUREMENT_DISPLAY_POLICIES = Object.freeze({
  temp: Object.freeze({ primaryUnit: "\xB0F", secondaryUnit: "\xB0C", secondaryMode: "paren" }),
  wbc: Object.freeze({ primaryUnit: "\xD710\xB3/\xB5L", secondaryUnit: "\xD710\u2079/L", secondaryMode: "paren" }),
  platelets: Object.freeze({ primaryUnit: "\xD710\xB3/\xB5L", secondaryUnit: "\xD710\u2079/L", secondaryMode: "paren" }),
  calcium: Object.freeze({ primaryUnit: "mg/dL", secondaryUnit: "mmol/L", secondaryMode: "paren" }),
  magnesium: Object.freeze({ primaryUnit: "mg/dL", secondaryUnit: "mmol/L", secondaryMode: "paren" })
});

// src/population.ts
var POPULATIONS = ["adult", "peds_child", "peds_infant"];
var POPULATION_SET = new Set(POPULATIONS);
var isPopulation = (value) => typeof value === "string" && POPULATION_SET.has(value);

// src/visuals/registry.ts
var registry = /* @__PURE__ */ new Map();
function registerVisual(m) {
  if (registry.has(m.kind)) throw new Error(`duplicate visual kind: ${m.kind}`);
  registry.set(m.kind, m);
}
function getVisual(kind) {
  return registry.get(kind);
}
var VISUAL_ITEM_TYPES = ["multiple_choice", "select_all", "matrix"];

// src/visuals/primitives/prng.ts
var mulberry32 = (seed) => {
  let state = seed >>> 0;
  return () => {
    state += 1831565813;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
};

// src/visuals/primitives/graphPaper.ts
var ECG_SCALE = {
  paperSpeedMmPerSec: 25,
  gainMmPerMv: 10,
  smallBoxMm: 1,
  largeBoxMm: 5,
  pxPerMm: 6
};
var pxPerSec = ECG_SCALE.pxPerMm * ECG_SCALE.paperSpeedMmPerSec;
var pxPerMv = ECG_SCALE.pxPerMm * ECG_SCALE.gainMmPerMv;
var smallBoxSec = ECG_SCALE.smallBoxMm / ECG_SCALE.paperSpeedMmPerSec;
var largeBoxSec = ECG_SCALE.largeBoxMm / ECG_SCALE.paperSpeedMmPerSec;
var secondsToPx = (seconds) => seconds * pxPerSec;
var mvToPx = (mv) => mv * pxPerMv;
var fmt = (value) => {
  const fixed = value.toFixed(2);
  return fixed.endsWith(".00") ? fixed.slice(0, -3) : fixed.replace(/0$/, "");
};
var fmtNum = (value) => {
  if (!Number.isFinite(value)) return String(value);
  const raw = Number.isInteger(value) ? String(value) : value.toFixed(12).replace(/0+$/, "").replace(/\.$/, "");
  const [integer, decimal] = raw.split(".");
  const sign = integer.startsWith("-") ? "-" : "";
  const digits = sign ? integer.slice(1) : integer;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}${grouped}${decimal === void 0 ? "" : `.${decimal}`}`;
};
var roundTo = (value, places) => {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};
var renderGrid = (width, height) => {
  const minorStep = ECG_SCALE.pxPerMm;
  const lines = [];
  for (let x = 0; x <= width; x += minorStep) {
    const major = Math.round(x / minorStep) % ECG_SCALE.largeBoxMm === 0;
    lines.push(
      `<line x1="${fmt(x)}" y1="0" x2="${fmt(x)}" y2="${fmt(height)}" stroke="${major ? "#e9a0ad" : "#f7cbd3"}" stroke-width="${major ? "1" : "0.5"}"/>`
    );
  }
  for (let y = 0; y <= height; y += minorStep) {
    const major = Math.round(y / minorStep) % ECG_SCALE.largeBoxMm === 0;
    lines.push(
      `<line x1="0" y1="${fmt(y)}" x2="${fmt(width)}" y2="${fmt(y)}" stroke="${major ? "#e9a0ad" : "#f7cbd3"}" stroke-width="${major ? "1" : "0.5"}"/>`
    );
  }
  return lines.join("");
};

// src/visuals/kinds/rhythmStrip.ts
var rhythmClasses = [
  "sinus",
  "sinus_brady",
  "sinus_tach",
  "afib",
  "aflutter",
  "svt",
  "avb_1",
  "avb_2_mobitz1",
  "avb_2_mobitz2",
  "avb_3",
  "pvc",
  "vtach",
  "vfib",
  "asystole"
];
var pacerFindings = ["capture", "failure_to_capture", "failure_to_sense", "failure_to_pace"];
var clamp = (value, min, max) => Math.max(min, Math.min(max, value));
var normalizeSpec = (spec) => ({
  ...spec,
  durationSec: spec.durationSec ?? 6,
  seed: spec.seed ?? 0,
  calibrationPulse: spec.calibrationPulse ?? true,
  pacer: spec.pacer ? { ...spec.pacer, captureLatencySec: spec.pacer.captureLatencySec ?? 0.08 } : void 0
});
var rhythmDefaults = (rhythm) => {
  if (rhythm === "avb_1") return { prSec: 0.24, qrsSec: 0.08, qtSec: 0.36 };
  if (rhythm === "vtach" || rhythm === "pvc") return { prSec: 0.16, qrsSec: 0.16, qtSec: 0.42 };
  if (rhythm === "avb_3") return { prSec: 0.16, qrsSec: 0.12, qtSec: 0.42 };
  return { prSec: 0.16, qrsSec: 0.08, qtSec: 0.36 };
};
var gaussian = (timeSec, centerSec, sigmaSec, ampMv) => {
  const z = (timeSec - centerSec) / sigmaSec;
  return ampMv * Math.exp(-0.5 * z * z);
};
var sawtooth = (phase) => 2 * (phase - Math.floor(phase + 0.5));
var buildRegularRPeaks = (rateBpm, durationSec, startSec = 0.8) => {
  if (rateBpm <= 0) return [];
  const rrSec = 60 / rateBpm;
  const peaks = [];
  for (let rSec = startSec; rSec < durationSec + 0.3; rSec += rrSec) peaks.push(rSec);
  return peaks;
};
var buildIrregularRPeaks = (rateBpm, durationSec, rng) => {
  const meanRrSec = 60 / Math.max(rateBpm, 20);
  const peaks = [];
  let rSec = 0.55 + rng() * 0.25;
  while (rSec < durationSec + 0.3) {
    peaks.push(rSec);
    const jitter = 0.62 + rng() * 0.78;
    rSec += clamp(meanRrSec * jitter, 0.28, 1.8);
  }
  return peaks;
};
var buildRenderContext = (spec) => {
  const rng = mulberry32(spec.seed);
  const rngValues = [rng(), rng(), rng(), rng()];
  return { rng, rngValues };
};
var buildIntrinsicBeats = (spec, rng) => {
  const defaults = rhythmDefaults(spec.rhythm);
  const prSec = spec.prSec ?? defaults.prSec;
  const qrsSec = spec.qrsSec ?? defaults.qrsSec;
  const qtSec = spec.qtSec ?? defaults.qtSec;
  const beats = [];
  const pushSinusBeat = (rSec, overrides = {}) => {
    beats.push({
      rSec,
      pSec: rSec - prSec,
      tSec: rSec + qtSec * 0.58,
      pAmpMv: 0.16,
      rAmpMv: 1,
      qrsSec,
      ...overrides
    });
  };
  if (spec.rhythm === "vfib" || spec.rhythm === "asystole") return beats;
  if (spec.rhythm === "afib") {
    buildIrregularRPeaks(spec.rateBpm, spec.durationSec, rng).forEach(
      (rSec) => beats.push({ rSec, tSec: rSec + qtSec * 0.55, rAmpMv: 0.9, qrsSec })
    );
    return beats;
  }
  if (spec.rhythm === "aflutter" || spec.rhythm === "svt") {
    buildRegularRPeaks(spec.rateBpm, spec.durationSec, spec.rhythm === "svt" ? 0.55 : 0.7).forEach(
      (rSec) => beats.push({ rSec, tSec: rSec + qtSec * 0.54, rAmpMv: spec.rhythm === "svt" ? 0.85 : 0.95, qrsSec })
    );
    return beats;
  }
  if (spec.rhythm === "avb_2_mobitz1") {
    const atrialRate = spec.atrialRateBpm ?? Math.max(spec.rateBpm * 1.33, 72);
    const ppSec = 60 / atrialRate;
    let pSec = 0.48;
    let groupIndex = 0;
    while (pSec < spec.durationSec) {
      if (groupIndex % 4 !== 3) {
        const progressivePr = [0.16, 0.22, 0.3][groupIndex % 4] ?? 0.2;
        pushSinusBeat(pSec + progressivePr, { pSec, qrsSec, rAmpMv: 0.95 });
      }
      pSec += ppSec;
      groupIndex += 1;
    }
    return beats;
  }
  if (spec.rhythm === "avb_2_mobitz2") {
    const atrialRate = spec.atrialRateBpm ?? Math.max(spec.rateBpm * 1.5, 78);
    const ppSec = 60 / atrialRate;
    let pSec = 0.45;
    let index = 0;
    while (pSec < spec.durationSec) {
      if (index % 3 !== 2) pushSinusBeat(pSec + prSec, { pSec, qrsSec, rAmpMv: 0.95 });
      pSec += ppSec;
      index += 1;
    }
    return beats;
  }
  if (spec.rhythm === "avb_3") {
    buildRegularRPeaks(spec.rateBpm, spec.durationSec, 0.9).forEach(
      (rSec) => beats.push({ rSec, tSec: rSec + qtSec * 0.6, rAmpMv: 0.85, qrsSec: spec.qrsSec ?? 0.12, wide: true })
    );
    return beats;
  }
  if (spec.rhythm === "pvc") {
    const ectopicSec = spec.durationSec / 2;
    buildRegularRPeaks(spec.rateBpm, spec.durationSec, 0.75).forEach((rSec) => {
      if (Math.abs(rSec - ectopicSec) > 0.55) pushSinusBeat(rSec);
    });
    beats.push({ rSec: ectopicSec, tSec: ectopicSec + 0.34, rAmpMv: 1.35, qrsSec: spec.qrsSec ?? 0.16, wide: true });
    return beats.sort((left, right) => left.rSec - right.rSec);
  }
  if (spec.rhythm === "vtach") {
    buildRegularRPeaks(spec.rateBpm, spec.durationSec, 0.35).forEach(
      (rSec) => beats.push({ rSec, tSec: rSec + 0.2, rAmpMv: 1.25, qrsSec: spec.qrsSec ?? 0.16, wide: true })
    );
    return beats;
  }
  buildRegularRPeaks(spec.rateBpm, spec.durationSec).forEach((rSec) => pushSinusBeat(rSec));
  return beats;
};
var composeRenderBeats = (spec, rng) => {
  const beats = buildIntrinsicBeats(spec, rng);
  if (spec.pacer) {
    const pacer = spec.pacer;
    pacer.capturedSpikeTimesSec.forEach((spikeTimeSec) => {
      beats.push({
        rSec: spikeTimeSec + pacer.captureLatencySec,
        tSec: spikeTimeSec + pacer.captureLatencySec + 0.34,
        rAmpMv: 1.18,
        qrsSec: spec.qrsSec ?? rhythmDefaults(spec.rhythm).qrsSec,
        wide: true
      });
    });
  }
  return beats.sort((left, right) => left.rSec - right.rSec);
};
var atrialPWaveMv = (timeSec, spec) => {
  if (spec.rhythm !== "avb_3") return 0;
  const atrialRate = spec.atrialRateBpm ?? Math.max(spec.rateBpm * 1.8, 78);
  const ppSec = 60 / atrialRate;
  let value = 0;
  for (let pSec = 0.28; pSec < spec.durationSec + ppSec; pSec += ppSec) {
    value += gaussian(timeSec, pSec, 0.04, 0.14);
  }
  return value;
};
var rhythmBaselineMv = (timeSec, spec, rngValues) => {
  if (spec.rhythm === "asystole") {
    return 0.012 * Math.sin(timeSec * 2 * Math.PI * 0.7);
  }
  if (spec.rhythm === "vfib") {
    const f1 = 4.5 + rngValues[0] * 2.5;
    const f2 = 8 + rngValues[1] * 5;
    const f3 = 13 + rngValues[2] * 4;
    return 0.36 * Math.sin(timeSec * 2 * Math.PI * f1) + 0.22 * Math.sin(timeSec * 2 * Math.PI * f2 + 1.7) + 0.13 * Math.sin(timeSec * 2 * Math.PI * f3 + 0.4);
  }
  if (spec.rhythm === "afib") {
    return 0.045 * Math.sin(timeSec * 2 * Math.PI * 7.5) + 0.025 * Math.sin(timeSec * 2 * Math.PI * 11.7 + 0.8);
  }
  if (spec.rhythm === "aflutter") {
    const atrialRate = spec.atrialRateBpm ?? spec.rateBpm * (spec.conductionRatio ?? 4);
    const phase = timeSec * atrialRate / 60;
    return -0.16 * sawtooth(phase);
  }
  return 0;
};
var beatMvAt = (timeSec, beat) => {
  let value = 0;
  if (beat.pSec !== void 0) value += gaussian(timeSec, beat.pSec, 0.045, beat.pAmpMv ?? 0.14);
  const qrsSigma = beat.qrsSec / (beat.wide ? 4.8 : 7.5);
  value += gaussian(timeSec, beat.rSec - beat.qrsSec * 0.22, qrsSigma, beat.wide ? -0.35 : -0.18);
  value += gaussian(timeSec, beat.rSec, qrsSigma * 0.7, beat.rAmpMv);
  value += gaussian(timeSec, beat.rSec + beat.qrsSec * 0.24, qrsSigma, beat.wide ? -0.65 : -0.28);
  if (beat.tSec !== void 0) value += gaussian(timeSec, beat.tSec, beat.wide ? 0.11 : 0.13, beat.wide ? -0.18 : 0.28);
  return value;
};
var pacerSpikeMv = (timeSec, spec) => {
  if (!spec.pacer) return 0;
  return spec.pacer.spikeTimesSec.reduce(
    (sum, spikeTimeSec) => sum + gaussian(timeSec, spikeTimeSec, 0.01, 2.4),
    0
  );
};
var renderCalibrationPulse = (x, baselineY) => {
  const topY = baselineY - mvToPx(1);
  const width = secondsToPx(0.2);
  const foot = secondsToPx(0.04);
  return `<path d="M ${fmt(x)} ${fmt(baselineY)} h ${fmt(foot)} v ${fmt(-mvToPx(1))} h ${fmt(width)} v ${fmt(mvToPx(1))} h ${fmt(foot)}" fill="none" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-calibration-mv="1" data-calibration-sec="0.2" data-calibration-top-y="${fmt(topY)}"/>`;
};
var renderRhythmStripSvg = (input) => {
  const spec = normalizeSpec(input);
  const { rng, rngValues } = buildRenderContext(spec);
  const leftPadding = spec.calibrationPulse ? 72 : 18;
  const rightPadding = 18;
  const topPadding = 18;
  const traceHeight = 150;
  const width = leftPadding + secondsToPx(spec.durationSec) + rightPadding;
  const height = topPadding * 2 + traceHeight;
  const baselineY = topPadding + traceHeight / 2;
  const beats = composeRenderBeats(spec, rng);
  const sampleStepSec = 4e-3;
  const points = [];
  for (let timeSec = 0; timeSec <= spec.durationSec + sampleStepSec / 2; timeSec += sampleStepSec) {
    let mv = rhythmBaselineMv(timeSec, spec, rngValues) + atrialPWaveMv(timeSec, spec) + pacerSpikeMv(timeSec, spec);
    beats.forEach((beat) => {
      mv += beatMvAt(timeSec, beat);
    });
    const x = leftPadding + secondsToPx(timeSec);
    const y = baselineY - mvToPx(clamp(mv, -1.4, 1.7));
    points.push(`${fmt(x)},${fmt(y)}`);
  }
  const grid = renderGrid(width, height);
  const calibration = spec.calibrationPulse ? renderCalibrationPulse(18, baselineY) : "";
  const trace = `<polyline points="${points.join(" ")}" fill="none" stroke="#1f2933" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(width)} ${fmt(height)}" role="img" aria-label="ECG rhythm strip" data-kind="rhythm_strip" data-rhythm="${spec.rhythm}" data-duration-sec="${fmt(spec.durationSec)}" data-px-per-sec="${fmt(pxPerSec)}" data-px-per-mv="${fmt(pxPerMv)}">${grid}${calibration}${trace}</svg>`;
};
var isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var nonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var isPacerFinding = (value) => typeof value === "string" && pacerFindings.includes(value);
var bounded = (value, path, min, max, code, errs, options = {}) => {
  if (value === void 0) return;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    errs.push({ path, code: `${code}_not_number`, message: "must be a number" });
    return;
  }
  if (options.integer && !Number.isInteger(value)) errs.push({ path, code: `${code}_not_integer`, message: "must be an integer" });
  if (value < min || value > max) errs.push({ path, code, message: `must be between ${min} and ${max}` });
};
var numericArray = (value, path, errs) => {
  if (!Array.isArray(value)) {
    errs.push({ path, code: "pacer_array_required", message: "must be an array" });
    return null;
  }
  const numbers = [];
  value.forEach((entry, index) => {
    if (typeof entry !== "number" || !Number.isFinite(entry)) {
      errs.push({ path: `${path}[${index}]`, code: "pacer_time_not_number", message: "must be a number" });
    } else {
      numbers.push(entry);
    }
  });
  return numbers.length === value.length ? numbers : null;
};
var validateRhythmStrip = (spec) => {
  const errs = [];
  const value = spec;
  if (!rhythmClasses.includes(value.rhythm)) {
    errs.push({ path: "rhythm", code: "bad_rhythm_class", message: "is invalid" });
  }
  const rhythm = value.rhythm;
  const minRate = rhythm === "vfib" || rhythm === "asystole" ? 0 : 20;
  bounded(value.rateBpm, "rateBpm", minRate, 300, "rate_out_of_range", errs);
  if (value.rateBpm === void 0) errs.push({ path: "rateBpm", code: "rate_required", message: "is required" });
  bounded(value.durationSec, "durationSec", 3, 12, "duration_out_of_range", errs);
  bounded(value.seed, "seed", 0, Number.MAX_SAFE_INTEGER, "seed_out_of_range", errs, { integer: true });
  bounded(value.atrialRateBpm, "atrialRateBpm", 20, 400, "atrial_rate_out_of_range", errs);
  bounded(value.conductionRatio, "conductionRatio", 1, 8, "conduction_ratio_out_of_range", errs, { integer: true });
  bounded(value.prSec, "prSec", 0.06, 0.4, "pr_out_of_range", errs);
  bounded(value.qrsSec, "qrsSec", 0.04, 0.24, "qrs_out_of_range", errs);
  bounded(value.qtSec, "qtSec", 0.16, 0.7, "qt_out_of_range", errs);
  if (value.pacer !== void 0) {
    if (!isRecord(value.pacer)) {
      errs.push({ path: "pacer", code: "pacer_not_object", message: "must be an object" });
    } else {
      const pacer = value.pacer;
      const durationSec = typeof value.durationSec === "number" && Number.isFinite(value.durationSec) ? value.durationSec : 6;
      const captureLatencySec = typeof pacer.captureLatencySec === "number" && Number.isFinite(pacer.captureLatencySec) ? pacer.captureLatencySec : 0.08;
      if (pacer.mode !== "ventricular") {
        errs.push({ path: "pacer.mode", code: "pacer_mode_invalid", message: "must be ventricular" });
      }
      bounded(pacer.setRateBpm, "pacer.setRateBpm", 20, 300, "pacer_set_rate_out_of_range", errs);
      if (pacer.setRateBpm === void 0) {
        errs.push({ path: "pacer.setRateBpm", code: "pacer_set_rate_required", message: "is required" });
      }
      bounded(pacer.captureLatencySec, "pacer.captureLatencySec", 0.03, 0.2, "pacer_latency_out_of_range", errs);
      if (!isPacerFinding(pacer.finding)) {
        errs.push({ path: "pacer.finding", code: "pacer_finding_invalid", message: "is invalid" });
      }
      const spikeTimes = numericArray(pacer.spikeTimesSec, "pacer.spikeTimesSec", errs);
      const capturedTimes = numericArray(pacer.capturedSpikeTimesSec, "pacer.capturedSpikeTimesSec", errs);
      if (spikeTimes && spikeTimes.length === 0) {
        errs.push({ path: "pacer.spikeTimesSec", code: "pacer_spikes_required", message: "must contain at least one spike" });
      }
      if (spikeTimes) {
        const seen = /* @__PURE__ */ new Set();
        spikeTimes.forEach((timeSec, index) => {
          if (timeSec < 0 || timeSec > durationSec) {
            errs.push({ path: `pacer.spikeTimesSec[${index}]`, code: "pacer_spike_time_out_of_range", message: `must be between 0 and ${durationSec}` });
          }
          if (seen.has(timeSec)) {
            errs.push({ path: `pacer.spikeTimesSec[${index}]`, code: "pacer_spike_time_duplicate", message: "must be unique" });
          }
          seen.add(timeSec);
        });
      }
      if (spikeTimes && capturedTimes) {
        const spikeSet = new Set(spikeTimes);
        const capturedSet = /* @__PURE__ */ new Set();
        capturedTimes.forEach((timeSec, index) => {
          if (!spikeSet.has(timeSec)) {
            errs.push({ path: `pacer.capturedSpikeTimesSec[${index}]`, code: "pacer_captured_spike_not_subset", message: "must also appear in spikeTimesSec" });
          }
          if (capturedSet.has(timeSec)) {
            errs.push({ path: `pacer.capturedSpikeTimesSec[${index}]`, code: "pacer_captured_spike_duplicate", message: "must be unique" });
          }
          capturedSet.add(timeSec);
          if (timeSec + captureLatencySec > durationSec) {
            errs.push({ path: `pacer.capturedSpikeTimesSec[${index}]`, code: "pacer_captured_qrs_out_of_range", message: "must leave room for capture before strip end" });
          }
        });
      }
    }
  }
  if (value.calibrationPulse !== void 0 && typeof value.calibrationPulse !== "boolean") {
    errs.push({ path: "calibrationPulse", code: "calibration_not_boolean", message: "must be a boolean" });
  }
  if (value.caption !== void 0) {
    if (!isRecord(value.caption) || !nonEmptyString(value.caption.en)) {
      errs.push({ path: "caption.en", code: "caption_en_required", message: "is required when caption is present" });
    } else if (value.caption.zh !== void 0 && !nonEmptyString(value.caption.zh)) {
      errs.push({ path: "caption.zh", code: "caption_zh_empty", message: "must be non-empty when present" });
    }
  }
  return errs;
};
var selfCheckRhythmStrip = (spec, question) => {
  const value = spec;
  if (value.pacer === void 0) return [];
  if (!isRecord(value.pacer)) return [];
  const errors = [];
  const normalized = normalizeSpec(spec);
  const pacer = normalized.pacer;
  if (!pacer || !isPacerFinding(pacer.finding)) return errors;
  const meta = isRecord(question) && isRecord(question.meta) ? question.meta : {};
  if (!nonEmptyString(meta.visual_justification)) {
    errors.push({
      path: "meta.visual_justification",
      code: "self_check_missing_justification",
      message: "must be present and non-empty"
    });
  }
  const expected = isRecord(meta.expected) ? meta.expected : null;
  if (expected === null || !nonEmptyString(expected.pacerFinding)) {
    errors.push({
      path: "meta.expected.pacerFinding",
      code: "self_check_no_expected_cue",
      message: "must declare the pacer finding"
    });
  } else if (expected.pacerFinding !== pacer.finding) {
    errors.push({
      path: "meta.expected.pacerFinding",
      code: "self_check_pacer_finding_mismatch",
      message: "does not match the visual pacer finding"
    });
  }
  if (pacer.finding === "capture" && pacer.capturedSpikeTimesSec.length !== pacer.spikeTimesSec.length) {
    errors.push({
      path: "pacer.capturedSpikeTimesSec",
      code: "self_check_capture_incomplete",
      message: "must include every spike for capture"
    });
  }
  if (pacer.finding === "failure_to_capture" && pacer.capturedSpikeTimesSec.length >= pacer.spikeTimesSec.length) {
    errors.push({
      path: "pacer.capturedSpikeTimesSec",
      code: "self_check_failure_to_capture_absent",
      message: "must omit at least one spike for failure to capture"
    });
  }
  const { rng } = buildRenderContext(normalized);
  const intrinsicBeats = buildIntrinsicBeats(normalized, rng);
  if (pacer.finding === "failure_to_pace" && !hasPacingGap(intrinsicBeats, pacer.spikeTimesSec, pacer.setRateBpm, normalized.durationSec)) {
    errors.push({
      path: "pacer.spikeTimesSec",
      code: "self_check_failure_to_pace_absent",
      message: "must leave a programmed-rate interval without a spike"
    });
  }
  if (pacer.finding === "failure_to_sense" && !hasSpikeOnIntrinsicRepolarization(intrinsicBeats, pacer.spikeTimesSec)) {
    errors.push({
      path: "pacer.spikeTimesSec",
      code: "self_check_failure_to_sense_absent",
      message: "must place a spike on an intrinsic QRS/T window"
    });
  }
  return errors;
};
var hasPacingGap = (intrinsicBeats, spikeTimesSec, setRateBpm, durationSec) => {
  const sortedBeats = [...intrinsicBeats].sort((left, right) => left.rSec - right.rSec);
  const gapEdges = sortedBeats.length === 0 ? [{ start: 0, end: durationSec }] : [
    { start: 0, end: sortedBeats[0].rSec },
    ...sortedBeats.slice(0, -1).map((beat, index) => ({ start: beat.rSec, end: sortedBeats[index + 1].rSec })),
    { start: sortedBeats[sortedBeats.length - 1].rSec, end: durationSec }
  ];
  const maxExpectedIntervalSec = 60 / setRateBpm;
  const sortedSpikes = [...spikeTimesSec].sort((left, right) => left - right);
  return gapEdges.some(({ start, end }) => {
    let segmentStart = start;
    for (const spikeTimeSec of sortedSpikes) {
      if (spikeTimeSec <= start || spikeTimeSec >= end) continue;
      if (spikeTimeSec - segmentStart > maxExpectedIntervalSec) return true;
      segmentStart = spikeTimeSec;
    }
    return end - segmentStart > maxExpectedIntervalSec;
  });
};
var hasSpikeOnIntrinsicRepolarization = (intrinsicBeats, spikeTimesSec) => {
  const epsilonSec = 0.04;
  return spikeTimesSec.some(
    (spikeTimeSec) => intrinsicBeats.some((beat) => {
      const windowStart = beat.rSec - beat.qrsSec - epsilonSec;
      const windowEnd = (beat.tSec ?? beat.rSec + beat.qrsSec) + 0.16 + epsilonSec;
      return spikeTimeSec >= windowStart && spikeTimeSec <= windowEnd;
    })
  );
};
var fixtures = {
  valid: [
    { kind: "rhythm_strip", rhythm: "sinus", rateBpm: 75, durationSec: 6, seed: 42, prSec: 0.16, qrsSec: 0.08, qtSec: 0.36 },
    { kind: "rhythm_strip", rhythm: "afib", rateBpm: 134, seed: 33, qrsSec: 0.08, caption: { en: "Lead II rhythm strip" } },
    { kind: "rhythm_strip", rhythm: "vfib", rateBpm: 0, seed: 5 },
    { kind: "rhythm_strip", rhythm: "asystole", rateBpm: 0 },
    { kind: "rhythm_strip", rhythm: "aflutter", rateBpm: 75, atrialRateBpm: 300, conductionRatio: 4, caption: { en: "On admission", zh: "\u5165\u9662\u65F6" } },
    {
      kind: "rhythm_strip",
      rhythm: "asystole",
      rateBpm: 0,
      durationSec: 6,
      pacer: { mode: "ventricular", setRateBpm: 60, spikeTimesSec: [1, 2, 3, 4, 5], capturedSpikeTimesSec: [1, 2, 3, 4, 5], finding: "capture" }
    },
    {
      kind: "rhythm_strip",
      rhythm: "asystole",
      rateBpm: 0,
      durationSec: 6,
      pacer: { mode: "ventricular", setRateBpm: 60, spikeTimesSec: [1, 2, 3, 4, 5], capturedSpikeTimesSec: [1, 3, 5], finding: "failure_to_capture" }
    },
    {
      kind: "rhythm_strip",
      rhythm: "asystole",
      rateBpm: 0,
      durationSec: 6,
      pacer: { mode: "ventricular", setRateBpm: 60, spikeTimesSec: [1, 2, 5], capturedSpikeTimesSec: [1, 2, 5], finding: "failure_to_pace" }
    }
  ],
  invalid: [
    { spec: { kind: "rhythm_strip", rhythm: "nope", rateBpm: 75 }, expectCode: "bad_rhythm_class" },
    { spec: { kind: "rhythm_strip", rhythm: "sinus", rateBpm: 9999 }, expectCode: "rate_out_of_range" },
    { spec: { kind: "rhythm_strip", rhythm: "sinus" }, expectCode: "rate_required" },
    { spec: { kind: "rhythm_strip", rhythm: "sinus", rateBpm: 75, durationSec: 99 }, expectCode: "duration_out_of_range" },
    { spec: { kind: "rhythm_strip", rhythm: "sinus", rateBpm: 75, seed: 1.5 }, expectCode: "seed_out_of_range_not_integer" },
    { spec: { kind: "rhythm_strip", rhythm: "aflutter", rateBpm: 75, conductionRatio: 0 }, expectCode: "conduction_ratio_out_of_range" },
    { spec: { kind: "rhythm_strip", rhythm: "sinus", rateBpm: 75, prSec: 9 }, expectCode: "pr_out_of_range" },
    { spec: { kind: "rhythm_strip", rhythm: "sinus", rateBpm: 75, calibrationPulse: "yes" }, expectCode: "calibration_not_boolean" },
    { spec: { kind: "rhythm_strip", rhythm: "sinus", rateBpm: 75, caption: { en: "" } }, expectCode: "caption_en_required" },
    { spec: { kind: "rhythm_strip", rhythm: "sinus", rateBpm: 75, caption: { en: "ok", zh: "" } }, expectCode: "caption_zh_empty" },
    {
      spec: {
        kind: "rhythm_strip",
        rhythm: "asystole",
        rateBpm: 0,
        pacer: { mode: "ventricular", setRateBpm: 60, spikeTimesSec: [], capturedSpikeTimesSec: [], finding: "capture" }
      },
      expectCode: "pacer_spikes_required"
    },
    {
      spec: {
        kind: "rhythm_strip",
        rhythm: "sinus",
        rateBpm: 75,
        pacer: { mode: "ventricular", setRateBpm: 60, spikeTimesSec: [1], capturedSpikeTimesSec: [2], finding: "capture" }
      },
      expectCode: "pacer_captured_spike_not_subset"
    }
  ]
};
var rhythmStripModule = {
  kind: "rhythm_strip",
  allowedItemTypes: ["multiple_choice", "select_all", "matrix", "ordered_response", "dropdown_cloze"],
  validate: validateRhythmStrip,
  selfCheck: selfCheckRhythmStrip,
  renderSvg: renderRhythmStripSvg,
  fixtures
};
registerVisual(rhythmStripModule);

// src/visuals/kinds/capnography/index.ts
var isRecord2 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var nonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var bounded2 = (value, path, min, max, code, errs, options = {}) => {
  if (value === void 0) return;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    errs.push({ path, code: `${code}_not_number`, message: "must be a number" });
    return;
  }
  if (options.integer && !Number.isInteger(value)) errs.push({ path, code: `${code}_not_integer`, message: "must be an integer" });
  const tooSmall = options.exclusiveMin ? value <= min : value < min;
  const tooLarge = options.exclusiveMax ? value >= max : value > max;
  if (tooSmall || tooLarge) {
    const minStr = options.exclusiveMin ? `> ${min}` : `>= ${min}`;
    const maxStr = options.exclusiveMax ? `< ${max}` : `<= ${max}`;
    errs.push({ path, code, message: `must be ${minStr} and ${maxStr}` });
  }
};
var validateCapnography = (spec) => {
  const errs = [];
  const value = spec;
  if (!["normal", "shark_fin", "flat", "rosc", "rebreathing"].includes(value.pattern)) {
    errs.push({ path: "pattern", code: "bad_pattern", message: "is invalid" });
  }
  bounded2(value.etco2, "etco2", 0, 150, "etco2_out_of_range", errs);
  if (value.etco2 === void 0) errs.push({ path: "etco2", code: "etco2_required", message: "is required" });
  if (value.pattern === "flat" && value.etco2 !== 0) {
    errs.push({ path: "etco2", code: "flat_nonzero_etco2", message: "must be 0 for flat pattern" });
  }
  bounded2(value.respiratoryRate, "respiratoryRate", 4, 60, "rr_out_of_range", errs);
  if (value.respiratoryRate === void 0) errs.push({ path: "respiratoryRate", code: "rr_required", message: "is required" });
  bounded2(value.durationSec, "durationSec", 5, 60, "duration_out_of_range", errs);
  if (value.pattern === "shark_fin") {
    if (value.severity === void 0) {
      errs.push({ path: "severity", code: "severity_required", message: "is required for shark_fin pattern" });
    } else {
      bounded2(value.severity, "severity", 0, 1, "severity_out_of_range", errs, { exclusiveMin: true });
    }
  } else if (value.severity !== void 0) {
    errs.push({ path: "severity", code: "severity_disallowed", message: "is only allowed for shark_fin pattern" });
  }
  if (value.pattern === "rebreathing") {
    if (value.baselineEtco2 === void 0) {
      errs.push({ path: "baselineEtco2", code: "baseline_required", message: "is required for rebreathing pattern" });
    } else {
      bounded2(value.baselineEtco2, "baselineEtco2", 0, value.etco2, "baseline_out_of_range", errs, { exclusiveMin: true, exclusiveMax: true });
    }
  } else if (value.baselineEtco2 !== void 0) {
    errs.push({ path: "baselineEtco2", code: "baseline_disallowed", message: "is only allowed for rebreathing pattern" });
  }
  if (value.pattern === "rosc") {
    if (value.rosc === void 0) {
      errs.push({ path: "rosc", code: "rosc_required", message: "is required for rosc pattern" });
    } else if (!isRecord2(value.rosc)) {
      errs.push({ path: "rosc", code: "rosc_not_object", message: "must be an object" });
    } else {
      const rosc = value.rosc;
      if (rosc.lowEtco2 === void 0) errs.push({ path: "rosc.lowEtco2", code: "rosc_low_required", message: "is required" });
      if (rosc.highEtco2 === void 0) errs.push({ path: "rosc.highEtco2", code: "rosc_high_required", message: "is required" });
      if (rosc.stepAtSec === void 0) errs.push({ path: "rosc.stepAtSec", code: "rosc_step_required", message: "is required" });
      bounded2(rosc.lowEtco2, "rosc.lowEtco2", 0, 150, "rosc_low_out_of_range", errs, { exclusiveMin: true });
      bounded2(rosc.highEtco2, "rosc.highEtco2", rosc.lowEtco2 || 0, 150, "rosc_high_out_of_range", errs, { exclusiveMin: true });
      bounded2(rosc.stepAtSec, "rosc.stepAtSec", 0, value.durationSec || 15, "rosc_step_out_of_range", errs, { exclusiveMin: true, exclusiveMax: true });
    }
  } else if (value.rosc !== void 0) {
    errs.push({ path: "rosc", code: "rosc_disallowed", message: "is only allowed for rosc pattern" });
  }
  if (value.caption !== void 0) {
    if (!isRecord2(value.caption) || !nonEmptyString2(value.caption.en)) {
      errs.push({ path: "caption.en", code: "caption_en_required", message: "is required when caption is present" });
    } else if (value.caption.zh !== void 0 && !nonEmptyString2(value.caption.zh)) {
      errs.push({ path: "caption.zh", code: "caption_zh_empty", message: "must be non-empty when present" });
    }
  }
  return errs;
};
var normalizeSpec2 = (spec) => ({
  ...spec,
  durationSec: spec.durationSec ?? 15
});
var getCurrentEtco2 = (timeSec, spec) => {
  if (spec.pattern === "rosc" && spec.rosc) {
    return timeSec < spec.rosc.stepAtSec ? spec.rosc.lowEtco2 : spec.rosc.highEtco2;
  }
  return spec.etco2;
};
var getWaveform = (u, spec, currentEtco2) => {
  if (spec.pattern === "flat") return 0;
  const baseline = spec.pattern === "rebreathing" ? spec.baselineEtco2 ?? 0 : 0;
  if (u < 0) return baseline;
  if (u > 0.45 && u <= 0.5) {
    const down_t = (u - 0.45) / 0.05;
    return currentEtco2 - (currentEtco2 - baseline) * down_t;
  }
  if (u > 0.5) {
    return baseline;
  }
  if (spec.pattern === "shark_fin") {
    const sev = spec.severity ?? 0.5;
    const phase2_end = 0.05 + 0.3 * sev;
    const phase2_amp = currentEtco2 * (0.95 - 0.45 * sev);
    if (u <= phase2_end) {
      return baseline + (phase2_amp - baseline) * (u / phase2_end);
    } else {
      return phase2_amp + (currentEtco2 - phase2_amp) * ((u - phase2_end) / (0.45 - phase2_end));
    }
  }
  if (u <= 0.05) {
    const phase2_amp = currentEtco2 * 0.95;
    return baseline + (phase2_amp - baseline) * (u / 0.05);
  } else {
    const phase2_amp = currentEtco2 * 0.95;
    return phase2_amp + (currentEtco2 - phase2_amp) * ((u - 0.05) / 0.4);
  }
};
var selfCheckCapnography = (spec, _question) => {
  const errs = [];
  const normalized = normalizeSpec2(spec);
  const period = 60 / normalized.respiratoryRate;
  if (normalized.pattern === "rosc" && normalized.rosc) {
    const preTime = Math.max(0, normalized.rosc.stepAtSec - period);
    const postTime = Math.min(normalized.durationSec, normalized.rosc.stepAtSec + period);
    const preEtco2 = getCurrentEtco2(preTime, normalized);
    const preVal = getWaveform(0.45, normalized, preEtco2);
    if (Math.abs(preVal - normalized.rosc.lowEtco2) > 0.1) {
      errs.push({ path: "rosc.lowEtco2", code: "self_check_rosc_low_failed", message: "rendered plateau does not match lowEtco2" });
    }
    const postEtco2 = getCurrentEtco2(postTime, normalized);
    const postVal = getWaveform(0.45, normalized, postEtco2);
    if (Math.abs(postVal - normalized.rosc.highEtco2) > 0.1) {
      errs.push({ path: "rosc.highEtco2", code: "self_check_rosc_high_failed", message: "rendered plateau does not match highEtco2" });
    }
  } else {
    const testEtco2 = normalized.etco2;
    const testVal = getWaveform(0.45, normalized, testEtco2);
    if (Math.abs(testVal - testEtco2) > 0.1) {
      errs.push({ path: "etco2", code: "self_check_plateau_failed", message: "rendered plateau does not match etco2" });
    }
    if (normalized.pattern === "flat" && testVal !== 0) {
      errs.push({ path: "pattern", code: "self_check_flat_failed", message: "flat trace must be zero" });
    }
  }
  if (normalized.pattern === "rebreathing" && normalized.baselineEtco2) {
    const testVal = getWaveform(0.6, normalized, normalized.etco2);
    if (Math.abs(testVal - normalized.baselineEtco2) > 0.1) {
      errs.push({ path: "baselineEtco2", code: "self_check_baseline_failed", message: "rendered baseline does not match baselineEtco2" });
    }
  }
  return errs;
};
var pxPerMmHg = 3;
var renderCapnographySvg = (input) => {
  const spec = normalizeSpec2(input);
  const leftPadding = 30;
  const rightPadding = 18;
  const topPadding = 18;
  const maxEtco2 = spec.pattern === "rosc" && spec.rosc ? Math.max(spec.etco2, spec.rosc.highEtco2) : spec.etco2;
  const requiredBoxes = Math.max(5, Math.ceil((maxEtco2 + 5) / 10));
  const traceHeight = requiredBoxes * 30;
  const width = leftPadding + secondsToPx(spec.durationSec) + rightPadding;
  const height = topPadding * 2 + traceHeight;
  const baselineY = topPadding + traceHeight;
  const sampleStepSec = 4e-3;
  const points = [];
  const period = 60 / spec.respiratoryRate;
  for (let timeSec = 0; timeSec <= spec.durationSec + sampleStepSec / 2; timeSec += sampleStepSec) {
    const currentEtco2 = getCurrentEtco2(timeSec, spec);
    const u = timeSec % period / period;
    const val = getWaveform(u, spec, currentEtco2);
    const x = leftPadding + secondsToPx(timeSec);
    const y = baselineY - val * pxPerMmHg;
    points.push(`${fmt(x)},${fmt(y)}`);
  }
  const grid = renderGrid(width, height);
  const trace = `<polyline points="${points.join(" ")}" fill="none" stroke="#1f2933" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;
  const etco2LabelText = spec.pattern === "rosc" && spec.rosc ? `${spec.rosc.lowEtco2} \u2192 ${spec.rosc.highEtco2}` : `${spec.etco2}`;
  const label = `<text x="${fmt(width - rightPadding - 10)}" y="${fmt(topPadding + 20)}" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1f2933" text-anchor="end">EtCO2: ${etco2LabelText} mmHg</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(width)} ${fmt(height)}" role="img" aria-label="Capnogram" data-kind="capnography" data-pattern="${spec.pattern}" data-duration-sec="${fmt(spec.durationSec)}" data-px-per-sec="${fmt(pxPerSec)}" data-px-per-mmhg="${fmt(pxPerMmHg)}" data-baseline-y="${fmt(baselineY)}">${grid}${trace}${label}</svg>`;
};
var fixtures2 = {
  valid: [
    { kind: "capnography", pattern: "normal", etco2: 40, respiratoryRate: 16, durationSec: 15 },
    { kind: "capnography", pattern: "shark_fin", etco2: 45, respiratoryRate: 20, severity: 0.8 },
    { kind: "capnography", pattern: "flat", etco2: 0, respiratoryRate: 12 },
    { kind: "capnography", pattern: "rosc", etco2: 40, respiratoryRate: 10, rosc: { lowEtco2: 12, highEtco2: 40, stepAtSec: 8 } },
    { kind: "capnography", pattern: "rebreathing", etco2: 45, respiratoryRate: 16, baselineEtco2: 15 }
  ],
  invalid: [
    { spec: { kind: "capnography", pattern: "nope", etco2: 40, respiratoryRate: 16 }, expectCode: "bad_pattern" },
    { spec: { kind: "capnography", pattern: "normal", etco2: 999, respiratoryRate: 16 }, expectCode: "etco2_out_of_range" },
    { spec: { kind: "capnography", pattern: "flat", etco2: 10, respiratoryRate: 16 }, expectCode: "flat_nonzero_etco2" },
    { spec: { kind: "capnography", pattern: "normal", etco2: 40 }, expectCode: "rr_required" },
    { spec: { kind: "capnography", pattern: "shark_fin", etco2: 40, respiratoryRate: 16 }, expectCode: "severity_required" },
    { spec: { kind: "capnography", pattern: "normal", etco2: 40, respiratoryRate: 16, severity: 0.5 }, expectCode: "severity_disallowed" },
    { spec: { kind: "capnography", pattern: "rebreathing", etco2: 40, respiratoryRate: 16, baselineEtco2: 50 }, expectCode: "baseline_out_of_range" },
    { spec: { kind: "capnography", pattern: "rosc", etco2: 40, respiratoryRate: 16 }, expectCode: "rosc_required" },
    { spec: { kind: "capnography", pattern: "rosc", etco2: 40, respiratoryRate: 16, rosc: { lowEtco2: 12 } }, expectCode: "rosc_high_required" },
    { spec: { kind: "capnography", pattern: "normal", etco2: 40, respiratoryRate: 999 }, expectCode: "rr_out_of_range" }
  ]
};
var capnographyModule = {
  kind: "capnography",
  validate: validateCapnography,
  selfCheck: selfCheckCapnography,
  renderSvg: renderCapnographySvg,
  fixtures: fixtures2
};
registerVisual(capnographyModule);

// src/visuals/primitives/escapeXml.ts
var escapeXml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

// src/visuals/primitives/lineChart.ts
var colorForRole = (role) => {
  switch (role) {
    case "red":
      return "#ef4444";
    // red-500
    case "blue":
      return "#3b82f6";
    // blue-500
    case "green":
      return "#10b981";
    // emerald-500
    case "orange":
      return "#f97316";
    // orange-500
    case "purple":
      return "#8b5cf6";
    // violet-500
    case "slate":
      return "#64748b";
    // slate-500
    case "primary":
      return "#1f2933";
    // text color
    case "band":
      return "#f1f5f9";
    // slate-100 for bands
    default:
      return "#1f2933";
  }
};
function renderLineChart(input) {
  const width = input.width ?? 600;
  const height = input.height ?? 300;
  const marginTop = 30;
  const marginBottom = 50;
  const marginLeft = 60;
  const marginRight = input.yAxisRight ? 60 : 30;
  const plotWidth = width - marginLeft - marginRight;
  const plotHeight = height - marginTop - marginBottom;
  const mapX = (x) => {
    const range = input.xAxis.max - input.xAxis.min;
    if (range <= 0) return marginLeft + plotWidth / 2;
    return marginLeft + (x - input.xAxis.min) / range * plotWidth;
  };
  const mapYLeft = (y) => {
    const range = input.yAxisLeft.max - input.yAxisLeft.min;
    if (range <= 0) return marginTop + plotHeight / 2;
    return marginTop + plotHeight - (y - input.yAxisLeft.min) / range * plotHeight;
  };
  const mapYRight = (y) => {
    if (!input.yAxisRight) return marginTop + plotHeight / 2;
    const range = input.yAxisRight.max - input.yAxisRight.min;
    if (range <= 0) return marginTop + plotHeight / 2;
    return marginTop + plotHeight - (y - input.yAxisRight.min) / range * plotHeight;
  };
  const mapY = (y, axis) => axis === "right" ? mapYRight(y) : mapYLeft(y);
  let elements = [];
  input.series.forEach((s) => {
    if (s.referenceBand) {
      const y1 = mapY(s.referenceBand.high, s.axis);
      const y2 = mapY(s.referenceBand.low, s.axis);
      const bandHeight = Math.max(0, y2 - y1);
      if (bandHeight > 0) {
        elements.push(`<rect x="${fmt(marginLeft)}" y="${fmt(y1)}" width="${fmt(plotWidth)}" height="${fmt(bandHeight)}" fill="${colorForRole("band")}" opacity="0.6"/>`);
      }
    }
  });
  const leftTicks = input.yAxisLeft.ticks ?? [input.yAxisLeft.min, input.yAxisLeft.max];
  leftTicks.forEach((tick) => {
    const y = mapYLeft(tick);
    elements.push(`<line x1="${fmt(marginLeft)}" y1="${fmt(y)}" x2="${fmt(width - marginRight)}" y2="${fmt(y)}" stroke="#e2e8f0" stroke-width="1"/>`);
    elements.push(`<text x="${fmt(marginLeft - 8)}" y="${fmt(y + 4)}" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="end">${fmt(tick)}</text>`);
  });
  if (input.yAxisRight) {
    const rightTicks = input.yAxisRight.ticks ?? [input.yAxisRight.min, input.yAxisRight.max];
    rightTicks.forEach((tick) => {
      const y = mapYRight(tick);
      elements.push(`<text x="${fmt(width - marginRight + 8)}" y="${fmt(y + 4)}" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="start">${fmt(tick)}</text>`);
    });
  }
  const xTicks = input.xAxis.ticks ?? [input.xAxis.min, input.xAxis.max];
  xTicks.forEach((tick) => {
    const x = mapX(tick);
    elements.push(`<line x1="${fmt(x)}" y1="${fmt(marginTop)}" x2="${fmt(x)}" y2="${fmt(height - marginBottom)}" stroke="#e2e8f0" stroke-width="1"/>`);
    elements.push(`<text x="${fmt(x)}" y="${fmt(height - marginBottom + 16)}" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle">${escapeXml(fmt(tick))}</text>`);
  });
  elements.push(`<line x1="${fmt(marginLeft)}" y1="${fmt(marginTop)}" x2="${fmt(marginLeft)}" y2="${fmt(height - marginBottom)}" stroke="#94a3b8" stroke-width="2"/>`);
  elements.push(`<line x1="${fmt(marginLeft)}" y1="${fmt(height - marginBottom)}" x2="${fmt(width - marginRight)}" y2="${fmt(height - marginBottom)}" stroke="#94a3b8" stroke-width="2"/>`);
  if (input.yAxisRight) {
    elements.push(`<line x1="${fmt(width - marginRight)}" y1="${fmt(marginTop)}" x2="${fmt(width - marginRight)}" y2="${fmt(height - marginBottom)}" stroke="#94a3b8" stroke-width="2"/>`);
  }
  elements.push(`<text x="${fmt(marginLeft + plotWidth / 2)}" y="${fmt(height - marginBottom + 36)}" font-family="sans-serif" font-size="14" font-weight="500" fill="#334155" text-anchor="middle">${escapeXml(input.xAxis.label)}</text>`);
  elements.push(`<text x="${fmt(marginLeft - 40)}" y="${fmt(marginTop - 10)}" font-family="sans-serif" font-size="12" font-weight="500" fill="#334155" text-anchor="start">${escapeXml(input.yAxisLeft.label)}</text>`);
  if (input.yAxisRight) {
    elements.push(`<text x="${fmt(width - marginRight + 40)}" y="${fmt(marginTop - 10)}" font-family="sans-serif" font-size="12" font-weight="500" fill="#334155" text-anchor="end">${escapeXml(input.yAxisRight.label)}</text>`);
  }
  input.series.forEach((s) => {
    if (s.points.length === 0) return;
    const color = colorForRole(s.styleRole);
    const svgPts = s.points.map((p) => `${fmt(mapX(p.x))},${fmt(mapY(p.y, s.axis))}`).join(" ");
    const strokeDash = s.strokeDash ? ` stroke-dasharray="6 4"` : "";
    elements.push(`<polyline points="${svgPts}" fill="none" stroke="${color}" stroke-width="2"${strokeDash} stroke-linecap="round" stroke-linejoin="round"/>`);
    s.points.forEach((p) => {
      elements.push(`<circle cx="${fmt(mapX(p.x))}" cy="${fmt(mapY(p.y, s.axis))}" r="4" fill="#ffffff" stroke="${color}" stroke-width="2"/>`);
    });
  });
  if (input.showLegend !== false) {
    let legendX = marginLeft;
    const legendY = 15;
    input.series.forEach((s) => {
      const color = colorForRole(s.styleRole);
      const strokeDash = s.strokeDash ? ` stroke-dasharray="6 4"` : "";
      elements.push(`<line x1="${fmt(legendX)}" y1="${fmt(legendY - 4)}" x2="${fmt(legendX + 16)}" y2="${fmt(legendY - 4)}" stroke="${color}" stroke-width="2"${strokeDash}/>`);
      elements.push(`<circle cx="${fmt(legendX + 8)}" cy="${fmt(legendY - 4)}" r="3" fill="#ffffff" stroke="${color}" stroke-width="2"/>`);
      elements.push(`<text x="${fmt(legendX + 22)}" y="${fmt(legendY)}" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="start">${escapeXml(s.label)} (${escapeXml(s.unit)})</text>`);
      legendX += 100;
    });
  }
  return `<g class="line-chart">${elements.join("\n")}</g>`;
}

// src/visuals/primitives/table.ts
var DOC_TABLE_DEFAULT_ROW_HEIGHT = 28;
var DOC_TABLE_DEFAULT_HEADER_HEIGHT = 32;
var DOC_TABLE_TITLE_HEIGHT = 32;
function measureDocTable(input) {
  const defaultRowHeight = input.rowHeight ?? DOC_TABLE_DEFAULT_ROW_HEIGHT;
  const headerHeight = input.headerHeight ?? DOC_TABLE_DEFAULT_HEADER_HEIGHT;
  const hasTitleRow = typeof input.title === "string" && input.title.length > 0;
  const bodyHeight = input.rows.reduce((sum, r) => sum + (r.rowHeight ?? defaultRowHeight), 0);
  return (hasTitleRow ? DOC_TABLE_TITLE_HEIGHT : 0) + headerHeight + bodyHeight;
}
var colorForStyleRole = (role) => {
  switch (role) {
    case "red":
      return "#ef4444";
    case "blue":
      return "#3b82f6";
    case "green":
      return "#10b981";
    case "orange":
      return "#f97316";
    case "purple":
      return "#8b5cf6";
    case "slate":
      return "#64748b";
    default:
      return "#1e293b";
  }
};
function renderDocTable(input) {
  const width = input.width ?? 600;
  const defaultRowHeight = input.rowHeight ?? DOC_TABLE_DEFAULT_ROW_HEIGHT;
  const headerHeight = input.headerHeight ?? DOC_TABLE_DEFAULT_HEADER_HEIGHT;
  const containCells = input.containCells === true;
  const CELL_PAD = 8;
  const hasTitleRow = typeof input.title === "string" && input.title.length > 0;
  const totalFr = input.columns.reduce((sum, c) => sum + (c.widthFr ?? 1), 0) || 1;
  const colWidths = input.columns.map((c) => (c.widthFr ?? 1) / totalFr * width);
  const colXs = [];
  let xAcc = 0;
  for (const w of colWidths) {
    colXs.push(xAcc);
    xAcc += w;
  }
  const totalHeight = measureDocTable(input);
  const els = [];
  els.push(`<rect x="0" y="0" width="${fmt(width)}" height="${fmt(totalHeight)}" fill="#ffffff" stroke="#94a3b8" stroke-width="1" rx="2"/>`);
  let yOff = 0;
  if (hasTitleRow) {
    els.push(`<rect x="0" y="${fmt(yOff)}" width="${fmt(width)}" height="${fmt(DOC_TABLE_TITLE_HEIGHT)}" fill="#e2e8f0" rx="2"/>`);
    els.push(`<text x="${fmt(width / 2)}" y="${fmt(yOff + DOC_TABLE_TITLE_HEIGHT * 0.65)}" font-family="sans-serif" font-size="13" font-weight="600" fill="#1e293b" text-anchor="middle">${escapeXml(input.title)}</text>`);
    els.push(`<line x1="0" y1="${fmt(yOff + DOC_TABLE_TITLE_HEIGHT)}" x2="${fmt(width)}" y2="${fmt(yOff + DOC_TABLE_TITLE_HEIGHT)}" stroke="#94a3b8" stroke-width="1"/>`);
    yOff += DOC_TABLE_TITLE_HEIGHT;
  }
  els.push(`<rect x="0" y="${fmt(yOff)}" width="${fmt(width)}" height="${fmt(headerHeight)}" fill="#e2e8f0"/>`);
  input.columns.forEach((col, i) => {
    const x = colXs[i];
    const w = colWidths[i];
    const align = col.align ?? "left";
    if (containCells) {
      const lines = input.columnHeaderLines?.[i] ?? [col.label];
      const innerW = Math.max(0, w - 2);
      const innerH = Math.max(0, headerHeight - 2);
      const lineH = 13;
      const totalTextH = lines.length * lineH;
      const stackTopY = (innerH - totalTextH) / 2;
      const anchor = align === "center" ? "middle" : align === "right" ? "end" : "start";
      const tx = align === "center" ? innerW / 2 : align === "right" ? innerW - CELL_PAD : CELL_PAD;
      const cellEls = lines.map(
        (line, li) => `<text x="${fmt(tx)}" y="${fmt(stackTopY + (li + 1) * lineH - 2)}" font-family="sans-serif" font-size="11" font-weight="600" fill="#334155" text-anchor="${anchor}">${escapeXml(line)}</text>`
      );
      els.push(`<svg x="${fmt(x + 1)}" y="${fmt(yOff + 1)}" width="${fmt(innerW)}" height="${fmt(innerH)}" overflow="hidden" data-table-column="${escapeXml(col.key)}" data-table-header="true" data-source-text="${escapeXml(col.label)}">${cellEls.join("")}</svg>`);
    } else {
      const tx = align === "center" ? x + w / 2 : align === "right" ? x + w - CELL_PAD : x + CELL_PAD;
      const anchor = align === "center" ? "middle" : align === "right" ? "end" : "start";
      els.push(`<text x="${fmt(tx)}" y="${fmt(yOff + headerHeight * 0.65)}" font-family="sans-serif" font-size="11" font-weight="600" fill="#334155" text-anchor="${anchor}">${escapeXml(col.label)}</text>`);
    }
  });
  els.push(`<line x1="0" y1="${fmt(yOff + headerHeight)}" x2="${fmt(width)}" y2="${fmt(yOff + headerHeight)}" stroke="#94a3b8" stroke-width="1"/>`);
  yOff += headerHeight;
  input.rows.forEach((row, rowIdx) => {
    const rowHeight = row.rowHeight ?? defaultRowHeight;
    const rowY = yOff;
    yOff += rowHeight;
    const rowFill = row.rowHeader ? "#f1f5f9" : rowIdx % 2 === 0 ? "#ffffff" : "#f8fafc";
    els.push(`<rect x="0" y="${fmt(rowY)}" width="${fmt(width)}" height="${fmt(rowHeight)}" fill="${rowFill}"/>`);
    els.push(`<line x1="0" y1="${fmt(rowY + rowHeight)}" x2="${fmt(width)}" y2="${fmt(rowY + rowHeight)}" stroke="#e2e8f0" stroke-width="1"/>`);
    input.columns.forEach((col, colIdx) => {
      const rawCell = row.cells[col.key];
      if (rawCell === void 0 && !containCells) return;
      const cell = rawCell === void 0 ? { text: "", emphasis: "normal" } : typeof rawCell === "string" ? { text: rawCell, emphasis: "normal" } : rawCell;
      if (!cell.text && !containCells) return;
      const cx = colXs[colIdx];
      const cw = colWidths[colIdx];
      const align = col.align ?? "left";
      if (containCells) {
        if (cell.emphasis === "flag") {
          els.push(`<rect x="${fmt(cx + 1)}" y="${fmt(rowY + 1)}" width="${fmt(cw - 2)}" height="${fmt(rowHeight - 2)}" fill="#fef9c3"/>`);
        }
        const fontWeight = cell.emphasis === "bold" ? "600" : "400";
        const textColor = colorForStyleRole(cell.styleRole);
        const innerW = Math.max(0, cw - 2);
        const innerH = Math.max(0, rowHeight - 2);
        const lines = cell.displayLines && cell.displayLines.length > 0 ? cell.displayLines : [cell.text];
        const lineH = 14;
        const totalTextH = lines.length * lineH;
        const stackTopY = (innerH - totalTextH) / 2;
        const anchor = align === "center" ? "middle" : align === "right" ? "end" : "start";
        const tx = align === "center" ? innerW / 2 : align === "right" ? innerW - CELL_PAD : CELL_PAD;
        const cellEls = lines.map(
          (line, li) => `<text x="${fmt(tx)}" y="${fmt(stackTopY + (li + 1) * lineH - 2)}" font-family="sans-serif" font-size="12" font-weight="${fontWeight}" fill="${textColor}" text-anchor="${anchor}">${escapeXml(line)}</text>`
        );
        els.push(`<svg x="${fmt(cx + 1)}" y="${fmt(rowY + 1)}" width="${fmt(innerW)}" height="${fmt(innerH)}" overflow="hidden" data-table-column="${escapeXml(col.key)}" data-table-row="${rowIdx}" data-source-text="${escapeXml(cell.text)}">${cellEls.join("")}</svg>`);
      } else {
        if (cell.emphasis === "flag") {
          els.push(`<rect x="${fmt(cx + 1)}" y="${fmt(rowY + 1)}" width="${fmt(cw - 2)}" height="${fmt(rowHeight - 2)}" fill="#fef9c3"/>`);
        }
        const fontWeight = cell.emphasis === "bold" ? "600" : "400";
        const textColor = colorForStyleRole(cell.styleRole);
        const tx = align === "center" ? cx + cw / 2 : align === "right" ? cx + cw - CELL_PAD : cx + CELL_PAD;
        const anchor = align === "center" ? "middle" : align === "right" ? "end" : "start";
        els.push(`<text x="${fmt(tx)}" y="${fmt(rowY + rowHeight * 0.65)}" font-family="sans-serif" font-size="12" font-weight="${fontWeight}" fill="${textColor}" text-anchor="${anchor}">${escapeXml(cell.text)}</text>`);
      }
    });
  });
  const dividerTop = hasTitleRow ? DOC_TABLE_TITLE_HEIGHT : 0;
  for (let i = 1; i < input.columns.length; i++) {
    els.push(`<line x1="${fmt(colXs[i])}" y1="${fmt(dividerTop)}" x2="${fmt(colXs[i])}" y2="${fmt(totalHeight)}" stroke="#e2e8f0" stroke-width="1"/>`);
  }
  return `<g class="doc-table">
${els.join("\n")}
</g>`;
}
var fieldPanelMetrics = (input) => ({
  width: input.width ?? 360,
  rowHeight: input.rowHeight ?? 26,
  bannerHeight: input.bannerHeight ?? 34,
  headingHeight: input.headingHeight ?? 24
});
function measureFieldPanel(input) {
  const { rowHeight, bannerHeight, headingHeight } = fieldPanelMetrics(input);
  const hasTitle = typeof input.title === "string" && input.title.length > 0;
  return (hasTitle ? bannerHeight : 0) + input.sections.reduce(
    (height, section) => height + (typeof section.heading === "string" && section.heading.length > 0 ? headingHeight : 0) + section.fields.length * rowHeight,
    0
  );
}
function renderFieldPanel(input) {
  const { width, rowHeight, bannerHeight, headingHeight } = fieldPanelMetrics(input);
  const variant = input.variant ?? "label";
  const isScreen = variant === "screen";
  const totalHeight = measureFieldPanel(input);
  const pad = 12;
  const els = [];
  const panelFill = isScreen ? "#0f172a" : "#ffffff";
  const panelStroke = isScreen ? "#1e293b" : "#94a3b8";
  const bannerFill = isScreen ? "#1e293b" : "#e2e8f0";
  const titleFill = isScreen ? "#e2e8f0" : "#1e293b";
  const labelFill = isScreen ? "#94a3b8" : "#475569";
  const valueFill = isScreen ? "#bef264" : "#0f172a";
  const dividerStroke = isScreen ? "#334155" : "#e2e8f0";
  els.push(
    `<rect x="0" y="0" width="${fmt(width)}" height="${fmt(totalHeight)}" fill="${panelFill}" stroke="${panelStroke}" stroke-width="1" rx="4"/>`
  );
  let yOff = 0;
  if (typeof input.title === "string" && input.title.length > 0) {
    els.push(
      `<rect x="0" y="0" width="${fmt(width)}" height="${fmt(bannerHeight)}" fill="${bannerFill}" rx="4"/>`
    );
    els.push(
      `<text x="${fmt(pad)}" y="${fmt(bannerHeight * 0.65)}" font-family="sans-serif" font-size="13" font-weight="600" fill="${titleFill}" text-anchor="start">${escapeXml(input.title)}</text>`
    );
    els.push(
      `<line x1="0" y1="${fmt(bannerHeight)}" x2="${fmt(width)}" y2="${fmt(bannerHeight)}" stroke="${panelStroke}" stroke-width="1"/>`
    );
    yOff += bannerHeight;
  }
  for (const section of input.sections) {
    if (typeof section.heading === "string" && section.heading.length > 0) {
      els.push(
        `<rect x="0" y="${fmt(yOff)}" width="${fmt(width)}" height="${fmt(headingHeight)}" fill="${isScreen ? "#172033" : "#f8fafc"}"/>`
      );
      els.push(
        `<text x="${fmt(pad)}" y="${fmt(yOff + headingHeight * 0.66)}" font-family="sans-serif" font-size="11" font-weight="600" fill="${labelFill}" text-anchor="start">${escapeXml(section.heading)}</text>`
      );
      yOff += headingHeight;
    }
    for (const field of section.fields) {
      if (field.emphasis === "flag" && !isScreen) {
        els.push(
          `<rect x="1" y="${fmt(yOff + 1)}" width="${fmt(width - 2)}" height="${fmt(rowHeight - 2)}" fill="#fef9c3"/>`
        );
      }
      els.push(
        `<line x1="0" y1="${fmt(yOff + rowHeight)}" x2="${fmt(width)}" y2="${fmt(yOff + rowHeight)}" stroke="${dividerStroke}" stroke-width="1"/>`
      );
      els.push(
        `<text x="${fmt(pad)}" y="${fmt(yOff + rowHeight * 0.65)}" font-family="sans-serif" font-size="12" font-weight="400" fill="${labelFill}" text-anchor="start">${escapeXml(field.label)}</text>`
      );
      const fontWeight = field.emphasis === "bold" ? "600" : "400";
      const emphasizedValueFill = field.emphasis === "flag" && isScreen ? "#f59e0b" : valueFill;
      const fontFamily = isScreen ? "ui-monospace, monospace" : "sans-serif";
      els.push(
        `<text x="${fmt(width - pad)}" y="${fmt(yOff + rowHeight * 0.65)}" font-family="${fontFamily}" font-size="12" font-weight="${fontWeight}" fill="${emphasizedValueFill}" text-anchor="end">${escapeXml(field.value)}</text>`
      );
      yOff += rowHeight;
    }
  }
  return `<g class="field-panel">
${els.join("\n")}
</g>`;
}

// src/visuals/kinds/vitals_trend/index.ts
var isRecord3 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var nonEmptyString3 = (value) => typeof value === "string" && value.trim().length > 0;
var validateVitalsTrend = (spec) => {
  const errs = [];
  const value = spec;
  let times = [];
  if (isRecord3(value.time) && Array.isArray(value.time.values)) {
    times = value.time.values;
    if (value.time.unit !== "hr" && value.time.unit !== "min") {
      errs.push({ path: "time.unit", code: "invalid_time_unit", message: "must be 'hr' or 'min'" });
    }
  } else if (Array.isArray(value.timepointsHr)) {
    times = value.timepointsHr;
  }
  if (times.length === 0) {
    errs.push({ path: "time", code: "timepoints_invalid", message: "must provide time.values or timepointsHr as a non-empty array" });
    return errs;
  }
  for (let i = 0; i < times.length; i++) {
    if (typeof times[i] !== "number" || !Number.isFinite(times[i])) {
      errs.push({ path: `time.values[${i}]`, code: "timepoint_not_number", message: "must be a finite number" });
    }
    if (i > 0 && times[i] <= times[i - 1]) {
      errs.push({ path: `time.values[${i}]`, code: "timepoints_not_increasing", message: "must be strictly increasing" });
    }
  }
  if (value.population !== void 0 && !isPopulation(value.population)) {
    errs.push({ path: "population", code: "invalid_population", message: "must be 'adult', 'peds_child', or 'peds_infant'" });
  }
  if (!Array.isArray(value.series) || value.series.length === 0) {
    errs.push({ path: "series", code: "series_empty", message: "must have at least one series" });
    return errs;
  }
  const seenVitals = /* @__PURE__ */ new Set();
  const series = value.series;
  series.forEach((s, idx) => {
    if (!isRecord3(s)) {
      errs.push({ path: `series[${idx}]`, code: "series_entry_invalid", message: "must be an object" });
      return;
    }
    if (typeof s.vital !== "string" || !Object.keys(VITAL_DEFS).includes(s.vital)) {
      errs.push({ path: `series[${idx}].vital`, code: "invalid_vital_key", message: "is not a recognized vital key" });
      return;
    }
    if (seenVitals.has(s.vital)) {
      errs.push({ path: `series[${idx}].vital`, code: "duplicate_vital", message: "cannot duplicate vital keys" });
    }
    seenVitals.add(s.vital);
    if (!Array.isArray(s.values)) {
      errs.push({ path: `series[${idx}].values`, code: "values_not_array", message: "must be an array" });
      return;
    }
    if (s.values.length !== times.length) {
      errs.push({ path: `series[${idx}].values`, code: "values_length_mismatch", message: "must match timepointsHr length" });
    }
    const def = VITAL_DEFS[s.vital];
    let min = def.range.min;
    let max = def.range.max;
    if (s.vital === "temp") {
      const u = spec.tempUnit ?? "C";
      min = u === "F" ? 86 : 30;
      max = u === "F" ? 109 : 43;
    }
    if (s.showReferenceBand !== void 0 && typeof s.showReferenceBand !== "boolean") {
      errs.push({ path: `series[${idx}].showReferenceBand`, code: "invalid_show_reference_band", message: "must be a boolean" });
    }
    if (value.population !== void 0 && value.population !== "adult" && s.showReferenceBand === true) {
      errs.push({
        path: `series[${idx}].showReferenceBand`,
        code: "reference_band_population_unsupported",
        message: 'reference bands are only available for population "adult"; omit showReferenceBand or set it to false'
      });
    }
    s.values.forEach((v, vidx) => {
      if (typeof v !== "number" || !Number.isFinite(v)) {
        errs.push({ path: `series[${idx}].values[${vidx}]`, code: "value_not_number", message: "must be a finite number" });
      } else if (v < min || v > max) {
        errs.push({ path: `series[${idx}].values[${vidx}]`, code: "value_out_of_range", message: `must be between ${min} and ${max}` });
      }
    });
  });
  const tempUnit = value.tempUnit;
  if (tempUnit !== void 0 && tempUnit !== "C" && tempUnit !== "F") {
    errs.push({ path: "tempUnit", code: "invalid_temp_unit", message: "must be 'C' or 'F'" });
  }
  const dbpSeries = (spec.series || []).find((s) => isRecord3(s) && s.vital === "dbp" && Array.isArray(s.values));
  const mapSeries = (spec.series || []).find((s) => isRecord3(s) && s.vital === "map" && Array.isArray(s.values));
  const sbpSeries = (spec.series || []).find((s) => isRecord3(s) && s.vital === "sbp" && Array.isArray(s.values));
  if (mapSeries && sbpSeries && dbpSeries && mapSeries.values.length === times.length && sbpSeries.values.length === times.length && dbpSeries.values.length === times.length) {
    for (let i = 0; i < times.length; i++) {
      const mapVal = mapSeries.values[i];
      const sbpVal = sbpSeries.values[i];
      const dbpVal = dbpSeries.values[i];
      if (mapVal < dbpVal || mapVal > sbpVal) {
        errs.push({ path: `series_map[${i}]`, code: "map_bounds_violation", message: "MAP must be between DBP and SBP" });
      }
    }
  }
  if (value.caption !== void 0) {
    if (!isRecord3(value.caption) || !nonEmptyString3(value.caption.en)) {
      errs.push({ path: "caption.en", code: "caption_en_required", message: "is required when caption is present" });
    } else if (value.caption.zh !== void 0 && !nonEmptyString3(value.caption.zh)) {
      errs.push({ path: "caption.zh", code: "caption_zh_empty", message: "must be non-empty when present" });
    }
  }
  return errs;
};
var selfCheckVitalsTrend = (spec, _question) => {
  const errs = [];
  const times = spec.time?.values ?? spec.timepointsHr;
  if (!Array.isArray(times) || !Array.isArray(spec.series)) {
    return errs;
  }
  const dbpSeries = spec.series.find((s) => isRecord3(s) && s.vital === "dbp" && Array.isArray(s.values));
  const mapSeries = spec.series.find((s) => isRecord3(s) && s.vital === "map" && Array.isArray(s.values));
  const sbpSeries = spec.series.find((s) => isRecord3(s) && s.vital === "sbp" && Array.isArray(s.values));
  if (mapSeries && sbpSeries && dbpSeries) {
    for (let i = 0; i < times.length; i++) {
      const dbp = dbpSeries.values[i];
      const sbp = sbpSeries.values[i];
      const providedMap = mapSeries.values[i];
      if (typeof dbp === "number" && typeof sbp === "number" && typeof providedMap === "number") {
        const computedMap = Math.round(dbp + (sbp - dbp) / 3);
        if (providedMap !== computedMap) {
          errs.push({ path: `series.map.values[${i}]`, code: "self_check_map_failed", message: `provided MAP ${providedMap} does not match computed MAP ${computedMap}` });
        }
      }
    }
  }
  const meta = isRecord3(_question) && isRecord3(_question.meta) ? _question.meta : null;
  const expectedTrends = meta && Array.isArray(meta.expected_trend) ? meta.expected_trend : [];
  for (const entry of expectedTrends) {
    if (!isRecord3(entry)) continue;
    const vitalKey = typeof entry.series === "string" ? entry.series : typeof entry.vital === "string" ? entry.vital : null;
    if (!vitalKey || !Array.isArray(entry.window) || entry.window.length !== 2) continue;
    const tSeries = spec.series.find((s) => isRecord3(s) && s.vital === vitalKey && Array.isArray(s.values));
    if (!tSeries) continue;
    const idxStart = times.indexOf(entry.window[0]);
    const idxEnd = times.indexOf(entry.window[1]);
    if (idxStart === -1 || idxEnd === -1 || idxEnd <= idxStart) continue;
    const valStart = tSeries.values[idxStart];
    const valEnd = tSeries.values[idxEnd];
    if (typeof valStart !== "number" || typeof valEnd !== "number") continue;
    if (entry.direction === "down" && valEnd >= valStart) {
      errs.push({ path: `series.${vitalKey}`, code: "self_check_trend_failed", message: `expected trend ${entry.direction} but values did not match` });
    }
    if (entry.direction === "up" && valEnd <= valStart) {
      errs.push({ path: `series.${vitalKey}`, code: "self_check_trend_failed", message: `expected trend ${entry.direction} but values did not match` });
    }
  }
  return errs;
};
var VITALS_TREND_LAYOUT = {
  width: 600,
  singleAxisChartWidth: 570,
  headingHeight: 28,
  legendRowHeight: 20,
  panelGap: 16,
  chartTableGap: 24,
  standardChartHeight: 260,
  temperatureChartHeight: 220,
  tableHeaderHeight: 28,
  tableRowHeight: 24,
  tableFirstColumnFr: 2.4
};
var LEGEND_LABELS = {
  hr: "HR",
  sbp: "SBP",
  dbp: "DBP",
  map: "MAP",
  rr: "RR",
  spo2: "SpO\u2082",
  temp: "Temperature"
};
var VITAL_ORDER = ["hr", "sbp", "dbp", "map", "rr", "spo2", "temp"];
var EPIC_VITALS_LAYOUT = {
  width: 600,
  height: 360,
  plotLeft: 60,
  plotRight: 570,
  plotTop: 74,
  plotBottom: 304,
  legendLeft: 60,
  legendTop: 10,
  legendCellWidth: 170,
  legendCellHeight: 24,
  legendColumns: 3
};
var colorForStyleRole2 = (role) => {
  switch (role) {
    case "red":
      return "#ef4444";
    case "blue":
      return "#3b82f6";
    case "green":
      return "#10b981";
    case "orange":
      return "#f97316";
    case "purple":
      return "#8b5cf6";
    case "slate":
      return "#64748b";
    default:
      return "#1f2933";
  }
};
var unitForVital = (vital, tempUnit) => vital === "temp" ? tempUnit === "F" ? "\xB0F" : "\xB0C" : VITAL_DEFS[vital].unit;
var buildVitalsPanels = (seriesByVital, times, tempUnit, population) => {
  const panels = [];
  const makeSeries = (vital, axis, panelSeriesCount) => {
    const source = seriesByVital.get(vital);
    if (!source) return void 0;
    const def = VITAL_DEFS[vital];
    return {
      vital,
      chart: {
        label: LEGEND_LABELS[vital],
        unit: unitForVital(vital, tempUnit),
        axis,
        styleRole: def.styleRole,
        strokeDash: vital === "dbp",
        points: source.values.map((value, index) => ({ x: times[index], y: value })),
        referenceBand: panelSeriesCount === 1 && population === "adult" && source.showReferenceBand !== false ? def.normal(tempUnit) : void 0
      }
    };
  };
  const hemodynamicKeys = ["hr", "sbp", "dbp", "map"].filter((key) => seriesByVital.has(key));
  if (hemodynamicKeys.length > 0) {
    const pressurePresent = ["sbp", "dbp", "map"].some((key) => seriesByVital.has(key));
    const hrPresent = seriesByVital.has("hr");
    const series = hemodynamicKeys.map((vital) => makeSeries(vital, vital === "hr" && pressurePresent ? "right" : "left", hemodynamicKeys.length)).filter((entry) => entry !== void 0);
    panels.push({
      key: "hemodynamics",
      heading: "Hemodynamics",
      chartHeight: VITALS_TREND_LAYOUT.standardChartHeight,
      series,
      leftFamily: pressurePresent ? "pressure" : "hr",
      leftLabel: pressurePresent ? "Blood pressure (mmHg)" : "HR (bpm)",
      ...pressurePresent && hrPresent ? { rightFamily: "hr", rightLabel: "HR (bpm)" } : {}
    });
  }
  const respiratoryKeys = ["rr", "spo2"].filter((key) => seriesByVital.has(key));
  if (respiratoryKeys.length > 0) {
    const rrPresent = seriesByVital.has("rr");
    const spo2Present = seriesByVital.has("spo2");
    const series = respiratoryKeys.map((vital) => makeSeries(vital, vital === "spo2" && rrPresent ? "right" : "left", respiratoryKeys.length)).filter((entry) => entry !== void 0);
    panels.push({
      key: "respiratory-oxygenation",
      heading: "Respiratory / oxygenation",
      chartHeight: VITALS_TREND_LAYOUT.standardChartHeight,
      series,
      leftFamily: rrPresent ? "rr" : "spo2",
      leftLabel: rrPresent ? "RR (/min)" : "SpO\u2082 (%)",
      ...rrPresent && spo2Present ? { rightFamily: "spo2", rightLabel: "SpO\u2082 (%)" } : {}
    });
  }
  if (seriesByVital.has("temp")) {
    const series = makeSeries("temp", "left", 1);
    if (series) {
      panels.push({
        key: "temperature",
        heading: "Temperature",
        chartHeight: VITALS_TREND_LAYOUT.temperatureChartHeight,
        series: [series],
        leftFamily: "temp",
        leftLabel: `Temperature (${tempUnit === "F" ? "\xB0F" : "\xB0C"})`
      });
    }
  }
  return panels;
};
var scaleForSeries = (series, family) => {
  const values = series.flatMap(({ chart }) => [
    ...chart.points.map((point) => point.y),
    ...chart.referenceBand ? [chart.referenceBand.low, chart.referenceBand.high] : []
  ]);
  const rawMin = values.length > 0 ? Math.min(...values) : 0;
  const rawMax = values.length > 0 ? Math.max(...values) : 100;
  const fineScale = family === "spo2" || family === "temp";
  const step = fineScale ? 1 : 10;
  const padding = Math.max(step, (rawMax - rawMin) * 0.1);
  let min = Math.floor((rawMin - padding) / step) * step;
  const max = Math.ceil((rawMax + padding) / step) * step;
  if (min < 0 && values.every((value) => value >= 0)) min = 0;
  return { min, max, ticks: [min, min + (max - min) / 2, max] };
};
var legendRowsForPanel = (panel) => Math.ceil(panel.series.length / 2);
var measureVitalsPanel = (panel) => VITALS_TREND_LAYOUT.headingHeight + legendRowsForPanel(panel) * VITALS_TREND_LAYOUT.legendRowHeight + panel.chartHeight;
var renderPanelLegend = (panel) => {
  const elements = panel.series.map(({ vital, chart }, index) => {
    const cellX = index % 2 === 0 ? 60 : 300;
    const row = Math.floor(index / 2);
    const markerY = VITALS_TREND_LAYOUT.headingHeight + row * VITALS_TREND_LAYOUT.legendRowHeight + 8;
    const color = colorForStyleRole2(chart.styleRole);
    const strokeDash = vital === "dbp" ? ` stroke-dasharray="6 4"` : "";
    return [
      `<g class="vitals-legend-entry" data-vital="${vital}" data-axis="${chart.axis ?? "left"}" data-cell-x="${cellX}" data-cell-width="240">`,
      `<line x1="${cellX}" y1="${fmt(markerY)}" x2="${cellX + 16}" y2="${fmt(markerY)}" stroke="${color}" stroke-width="2"${strokeDash}/>`,
      `<circle cx="${cellX + 8}" cy="${fmt(markerY)}" r="3" fill="#ffffff" stroke="${color}" stroke-width="2"/>`,
      `<text x="${cellX + 22}" y="${fmt(markerY + 4)}" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="start">${escapeXml(chart.label)} (${escapeXml(chart.unit)})</text>`,
      `</g>`
    ].join("\n");
  });
  return `<g class="vitals-panel-legend">
${elements.join("\n")}
</g>`;
};
var renderVitalsPanel = (panel, yOffset, times, xMin, xMax, isLowestPanel, timeUnit) => {
  const leftSeries = panel.series.filter(({ chart }) => chart.axis !== "right");
  const rightSeries = panel.series.filter(({ chart }) => chart.axis === "right");
  const leftScale = scaleForSeries(leftSeries, panel.leftFamily);
  const rightScale = panel.rightFamily ? scaleForSeries(rightSeries, panel.rightFamily) : void 0;
  const chartTop = VITALS_TREND_LAYOUT.headingHeight + legendRowsForPanel(panel) * VITALS_TREND_LAYOUT.legendRowHeight;
  const input = {
    series: panel.series.map(({ chart }) => chart),
    xAxis: {
      label: isLowestPanel ? timeUnit === "min" ? "Time (Minutes)" : "Time (Hours)" : "",
      min: xMin,
      max: xMax,
      ticks: times
    },
    yAxisLeft: { label: panel.leftLabel, ...leftScale },
    width: rightScale ? VITALS_TREND_LAYOUT.width : VITALS_TREND_LAYOUT.singleAxisChartWidth,
    height: panel.chartHeight,
    showLegend: false,
    ...rightScale && panel.rightLabel ? { yAxisRight: { label: panel.rightLabel, ...rightScale } } : {}
  };
  return [
    `<g class="vitals-panel" data-vitals-panel="${panel.key}" transform="translate(0 ${fmt(yOffset)})">`,
    `<text x="60" y="19" font-family="sans-serif" font-size="15" font-weight="600" fill="#1e293b" text-anchor="start">${escapeXml(panel.heading)}</text>`,
    renderPanelLegend(panel),
    `<g class="vitals-panel-chart" transform="translate(0 ${fmt(chartTop)})">`,
    renderLineChart(input),
    `</g>`,
    `</g>`
  ].join("\n");
};
var buildVitalsTableModel = (spec) => {
  const times = spec.time?.values ?? spec.timepointsHr ?? [];
  const timeUnit = spec.time?.unit ?? "hr";
  const seriesByVital = new Map(spec.series.map((series) => [series.vital, series]));
  const rows = [];
  const addRow = (key, label, values) => rows.push({ key, label, values });
  const addNumericRow = (vital, label) => {
    const source = seriesByVital.get(vital);
    if (source) addRow(vital, label, source.values.map(fmtNum));
  };
  addNumericRow("hr", "HR (bpm)");
  const sbp = seriesByVital.get("sbp");
  const dbp = seriesByVital.get("dbp");
  if (sbp && dbp) {
    addRow("bp", "BP (mmHg)", times.map((_, index) => `${fmtNum(sbp.values[index])}/${fmtNum(dbp.values[index])}`));
  } else if (sbp) {
    addRow("sbp", "SBP (mmHg)", sbp.values.map(fmtNum));
  } else if (dbp) {
    addRow("dbp", "DBP (mmHg)", dbp.values.map(fmtNum));
  }
  addNumericRow("map", "MAP (mmHg)");
  addNumericRow("rr", "RR (/min)");
  addNumericRow("spo2", "SpO\u2082 (%)");
  addNumericRow("temp", `Temperature (${spec.tempUnit === "F" ? "\xB0F" : "\xB0C"})`);
  return {
    columns: [
      { key: "vital", label: "Vital sign" },
      ...times.map((time, index) => ({
        key: `time-${index}`,
        label: `${fmtNum(time)} ${timeUnit === "hr" ? "h" : "min"}`
      }))
    ],
    rows
  };
};
var buildVitalsTable = (spec) => {
  const model = buildVitalsTableModel(spec);
  const columns = model.columns.map((column, index) => ({
    ...column,
    ...index === 0 ? { widthFr: VITALS_TREND_LAYOUT.tableFirstColumnFr } : { align: "center" }
  }));
  const rows = model.rows.map((row) => {
    const cells = { vital: { text: row.label, emphasis: "bold" } };
    row.values.forEach((value, index) => {
      cells[`time-${index}`] = value;
    });
    return { cells };
  });
  return {
    columns,
    rows,
    width: VITALS_TREND_LAYOUT.width,
    rowHeight: VITALS_TREND_LAYOUT.tableRowHeight,
    headerHeight: VITALS_TREND_LAYOUT.tableHeaderHeight
  };
};
var familyForVital = (vital) => {
  if (vital === "hr") return "hr";
  if (vital === "rr") return "rr";
  if (vital === "spo2") return "spo2";
  if (vital === "temp") return "temp";
  return "pressure";
};
var fittedEpicScale = (vital, values, referenceBand) => {
  const chart = {
    label: LEGEND_LABELS[vital],
    unit: "",
    points: values.map((value, index) => ({ x: index, y: value })),
    referenceBand
  };
  return scaleForSeries([{ vital, chart }], familyForVital(vital));
};
var adaptiveEpicCeiling = (values) => {
  const maxValue = values.length > 0 ? Math.max(...values) : 0;
  const minCeiling = maxValue / 0.95;
  return [120, 140, 160, 180, 200, 250, 300].find((bucket) => bucket >= minCeiling) ?? 300;
};
var buildEpicModel = (spec) => {
  const times = spec.time?.values ?? spec.timepointsHr ?? [];
  const timeUnit = spec.time?.unit ?? "hr";
  const seriesByVital = new Map(spec.series.map((series) => [series.vital, series]));
  const orderedSeries = VITAL_ORDER.flatMap((vital) => {
    const source = seriesByVital.get(vital);
    if (!source) return [];
    const def = VITAL_DEFS[vital];
    return [{
      vital,
      label: LEGEND_LABELS[vital],
      unit: unitForVital(vital, spec.tempUnit),
      colorRole: def.styleRole,
      dashed: vital === "dbp",
      points: source.values.map((value, timeIndex) => ({ timeIndex, value }))
    }];
  });
  const onlySeries = orderedSeries.length === 1 ? orderedSeries[0] : void 0;
  const onlySource = onlySeries ? seriesByVital.get(onlySeries.vital) : void 0;
  const population = spec.population === void 0 ? "adult" : spec.population;
  const referenceBand = onlySeries && onlySource && population === "adult" && onlySource.showReferenceBand !== false ? VITAL_DEFS[onlySeries.vital].normal(spec.tempUnit) : void 0;
  const allValues = orderedSeries.flatMap((series) => series.points.map((point) => point.value));
  const yAxis = onlySeries ? fittedEpicScale(onlySeries.vital, allValues, referenceBand) : (() => {
    const max = adaptiveEpicCeiling(allValues);
    return { min: 0, max, ticks: [0, max / 2, max] };
  })();
  const legend = [];
  const addLegend = (key, label, unit, vitals, colorRole, dashed = false) => legend.push({ key, label, unit, vitals, colorRole, dashed });
  if (seriesByVital.has("hr")) addLegend("hr", "HR", "bpm", ["hr"], VITAL_DEFS.hr.styleRole);
  const hasSbp = seriesByVital.has("sbp");
  const hasDbp = seriesByVital.has("dbp");
  if (hasSbp && hasDbp) {
    addLegend("bp", "BP", "mmHg", ["sbp", "dbp"], VITAL_DEFS.sbp.styleRole, true);
  } else if (hasSbp) {
    addLegend("bp", "SBP", "mmHg", ["sbp"], VITAL_DEFS.sbp.styleRole);
  } else if (hasDbp) {
    addLegend("bp", "DBP", "mmHg", ["dbp"], VITAL_DEFS.dbp.styleRole, true);
  }
  if (seriesByVital.has("map")) addLegend("map", "MAP", "mmHg", ["map"], VITAL_DEFS.map.styleRole);
  if (seriesByVital.has("rr")) addLegend("rr", "RR", "/min", ["rr"], VITAL_DEFS.rr.styleRole);
  if (seriesByVital.has("spo2")) addLegend("spo2", "SpO\u2082", "%", ["spo2"], VITAL_DEFS.spo2.styleRole);
  if (seriesByVital.has("temp")) {
    addLegend("temp", "Temperature", spec.tempUnit === "F" ? "\xB0F" : "\xB0C", ["temp"], VITAL_DEFS.temp.styleRole);
  }
  const tableModel = buildVitalsTableModel(spec);
  return {
    timeUnit,
    timepoints: times.map((value, index) => ({
      index,
      value,
      label: `${fmtNum(value)} ${timeUnit === "hr" ? "h" : "min"}`
    })),
    yAxis,
    ...referenceBand ? { referenceBand } : {},
    series: orderedSeries,
    legend,
    readoutByTimepoint: times.map((_, index) => ({
      timeLabel: `${fmtNum(times[index])} ${timeUnit === "hr" ? "h" : "min"}`,
      rows: tableModel.rows.map((row) => ({
        key: row.key,
        label: row.label,
        valueText: row.values[index]
      }))
    })),
    tableModel
  };
};
var renderEpicVitalsSvg = (spec) => {
  const model = buildEpicModel(spec);
  const layout = EPIC_VITALS_LAYOUT;
  const plotWidth = layout.plotRight - layout.plotLeft;
  const plotHeight = layout.plotBottom - layout.plotTop;
  const xMin = model.timepoints.length > 0 ? Math.min(...model.timepoints.map((point) => point.value)) : 0;
  const xMax = model.timepoints.length > 0 ? Math.max(...model.timepoints.map((point) => point.value)) : 1;
  const mapX = (value) => xMax <= xMin ? layout.plotLeft + plotWidth / 2 : layout.plotLeft + (value - xMin) / (xMax - xMin) * plotWidth;
  const mapY = (value) => model.yAxis.max <= model.yAxis.min ? layout.plotTop + plotHeight / 2 : layout.plotBottom - (value - model.yAxis.min) / (model.yAxis.max - model.yAxis.min) * plotHeight;
  const elements = [];
  if (model.referenceBand) {
    const y1 = mapY(model.referenceBand.high);
    const y2 = mapY(model.referenceBand.low);
    elements.push(`<rect x="${fmt(layout.plotLeft)}" y="${fmt(y1)}" width="${fmt(plotWidth)}" height="${fmt(Math.max(0, y2 - y1))}" fill="#f1f5f9" opacity="0.6" data-reference-band="true"/>`);
  }
  model.yAxis.ticks.forEach((tick) => {
    const y = mapY(tick);
    elements.push(`<line x1="${fmt(layout.plotLeft)}" y1="${fmt(y)}" x2="${fmt(layout.plotRight)}" y2="${fmt(y)}" stroke="#e2e8f0" stroke-width="1"/>`);
    elements.push(`<text x="${fmt(layout.plotLeft - 8)}" y="${fmt(y + 4)}" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="end">${escapeXml(fmtNum(tick))}</text>`);
  });
  const pointXs = model.timepoints.map((timepoint) => mapX(timepoint.value));
  model.timepoints.forEach((timepoint, index) => {
    const x = pointXs[index];
    elements.push(`<line x1="${fmt(x)}" y1="${fmt(layout.plotTop)}" x2="${fmt(x)}" y2="${fmt(layout.plotBottom)}" stroke="#e2e8f0" stroke-width="1"/>`);
    elements.push(`<text x="${fmt(x)}" y="${fmt(layout.plotBottom + 18)}" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle">${escapeXml(fmtNum(timepoint.value))}</text>`);
  });
  elements.push(`<line x1="${fmt(layout.plotLeft)}" y1="${fmt(layout.plotTop)}" x2="${fmt(layout.plotLeft)}" y2="${fmt(layout.plotBottom)}" stroke="#94a3b8" stroke-width="2"/>`);
  elements.push(`<line x1="${fmt(layout.plotLeft)}" y1="${fmt(layout.plotBottom)}" x2="${fmt(layout.plotRight)}" y2="${fmt(layout.plotBottom)}" stroke="#94a3b8" stroke-width="2"/>`);
  elements.push(`<text x="${fmt(layout.plotLeft + plotWidth / 2)}" y="${fmt(layout.height - 14)}" font-family="sans-serif" font-size="14" font-weight="500" fill="#334155" text-anchor="middle">${model.timeUnit === "min" ? "Time (Minutes)" : "Time (Hours)"}</text>`);
  model.series.forEach((series) => {
    const color = colorForStyleRole2(series.colorRole);
    const points = series.points.map((point) => `${fmt(pointXs[point.timeIndex])},${fmt(mapY(point.value))}`).join(" ");
    const dash = series.dashed ? ` stroke-dasharray="6 4"` : "";
    const marks = series.points.map(
      (point) => `<circle cx="${fmt(pointXs[point.timeIndex])}" cy="${fmt(mapY(point.value))}" r="4" fill="#ffffff" stroke="${color}" stroke-width="2"/>`
    ).join("\n");
    elements.push(`<g class="vitals-epic-series" data-vital="${series.vital}">
<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.5"${dash} stroke-linecap="round" stroke-linejoin="round"/>
${marks}
</g>`);
  });
  model.legend.forEach((entry, index) => {
    const column = index % layout.legendColumns;
    const row = Math.floor(index / layout.legendColumns);
    const x = layout.legendLeft + column * layout.legendCellWidth;
    const y = layout.legendTop + row * layout.legendCellHeight + 10;
    const color = colorForStyleRole2(entry.colorRole);
    const dash = entry.dashed ? ` stroke-dasharray="6 4"` : "";
    const marker = entry.key === "bp" && entry.vitals.length === 2 ? [
      `<line x1="${fmt(x)}" y1="${fmt(y - 3)}" x2="${fmt(x + 18)}" y2="${fmt(y - 3)}" stroke="${color}" stroke-width="2"/>`,
      `<line x1="${fmt(x)}" y1="${fmt(y + 3)}" x2="${fmt(x + 18)}" y2="${fmt(y + 3)}" stroke="${color}" stroke-width="2" stroke-dasharray="6 4"/>`
    ].join("\n") : `<line x1="${fmt(x)}" y1="${fmt(y)}" x2="${fmt(x + 18)}" y2="${fmt(y)}" stroke="${color}" stroke-width="2.5"${dash}/>`;
    elements.push([
      `<g class="vitals-epic-legend-entry" data-legend="${entry.key}" data-legend-x="${fmt(x)}" data-legend-y="${fmt(y - 10)}" data-legend-width="${fmt(layout.legendCellWidth)}" data-legend-height="${fmt(layout.legendCellHeight)}">`,
      marker,
      `<circle cx="${fmt(x + 9)}" cy="${fmt(y)}" r="3" fill="#ffffff" stroke="${color}" stroke-width="2"/>`,
      `<text x="${fmt(x + 25)}" y="${fmt(y + 4)}" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="start">${escapeXml(entry.label)} (${escapeXml(entry.unit)})</text>`,
      `</g>`
    ].join("\n"));
  });
  model.timepoints.forEach((timepoint, index) => {
    const x = pointXs[index];
    const left = index === 0 ? layout.plotLeft : (pointXs[index - 1] + x) / 2;
    const right = index === model.timepoints.length - 1 ? layout.plotRight : (x + pointXs[index + 1]) / 2;
    elements.push(`<rect x="${fmt(left)}" y="${fmt(layout.plotTop)}" width="${fmt(Math.max(0, right - left))}" height="${fmt(plotHeight)}" fill="transparent" data-timepoint-index="${timepoint.index}" data-timepoint-x="${fmt(x)}"/>`);
  });
  elements.push(`<line class="vitals-epic-guide" data-guide-line="true" x1="${fmt(layout.plotLeft)}" y1="${fmt(layout.plotTop)}" x2="${fmt(layout.plotLeft)}" y2="${fmt(layout.plotBottom)}" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="3 3" opacity="0"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${layout.width} ${layout.height}" role="img" aria-label="Vitals Trend" data-kind="vitals_trend" data-variant="epic">
${elements.join("\n")}
</svg>`;
};
var renderVitalsTrendSvg = (spec, options) => {
  if (options?.variant === "epic") return renderEpicVitalsSvg(spec);
  const times = spec.time?.values ?? spec.timepointsHr ?? [];
  const timeUnit = spec.time?.unit ?? "hr";
  const population = spec.population === void 0 ? "adult" : spec.population;
  const seriesByVital = new Map(spec.series.map((series) => [series.vital, series]));
  const xMin = times.length > 0 ? Math.min(...times) : 0;
  const xMax = times.length > 0 ? Math.max(...times) : 1;
  const panels = buildVitalsPanels(seriesByVital, times, spec.tempUnit, population);
  const table = buildVitalsTable(spec);
  const tableHeight = measureDocTable(table);
  const panelsHeight = panels.reduce(
    (height, panel, index) => height + measureVitalsPanel(panel) + (index > 0 ? VITALS_TREND_LAYOUT.panelGap : 0),
    0
  );
  const totalHeight = panelsHeight + VITALS_TREND_LAYOUT.chartTableGap + tableHeight;
  const elements = [];
  let yOffset = 0;
  panels.forEach((panel, index) => {
    if (index > 0) yOffset += VITALS_TREND_LAYOUT.panelGap;
    elements.push(renderVitalsPanel(panel, yOffset, times, xMin, xMax, index === panels.length - 1, timeUnit));
    yOffset += measureVitalsPanel(panel);
  });
  yOffset += VITALS_TREND_LAYOUT.chartTableGap;
  elements.push(`<g class="vitals-flowsheet" data-vitals-table="true" transform="translate(0 ${fmt(yOffset)})">
${renderDocTable(table)}
</g>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VITALS_TREND_LAYOUT.width} ${fmt(totalHeight)}" role="img" aria-label="Vitals Trend" data-kind="vitals_trend">
${elements.join("\n")}
</svg>`;
};
var fixtures3 = {
  valid: [
    {
      kind: "vitals_trend",
      timepointsHr: [0, 1, 2, 3],
      series: [
        { vital: "hr", values: [80, 90, 100, 120] },
        { vital: "map", values: [90, 85, 80, 65] }
      ]
    },
    {
      kind: "vitals_trend",
      timepointsHr: [0, 4, 8],
      series: [
        { vital: "temp", values: [37, 38.5, 39.2] },
        { vital: "spo2", values: [98, 96, 92] }
      ],
      tempUnit: "C"
    },
    {
      kind: "vitals_trend",
      timepointsHr: [0, 1],
      series: [{ vital: "temp", values: [108, 109] }],
      tempUnit: "F"
    },
    {
      kind: "vitals_trend",
      population: "peds_child",
      timepointsHr: [0, 1],
      series: [{ vital: "hr", values: [110, 105] }]
    },
    {
      kind: "vitals_trend",
      population: "peds_infant",
      timepointsHr: [0, 1],
      series: [{ vital: "hr", values: [140, 135], showReferenceBand: false }]
    }
  ],
  invalid: [
    { spec: { kind: "vitals_trend", population: null, timepointsHr: [0, 1], series: [{ vital: "hr", values: [80, 85] }] }, expectCode: "invalid_population" },
    { spec: { kind: "vitals_trend", timepointsHr: [0, 1], series: [] }, expectCode: "series_empty" },
    { spec: { kind: "vitals_trend", timepointsHr: [1, 0], series: [{ vital: "hr", values: [80, 90] }] }, expectCode: "timepoints_not_increasing" },
    { spec: { kind: "vitals_trend", timepointsHr: [0, 1], series: [{ vital: "hr", values: [80] }] }, expectCode: "values_length_mismatch" },
    { spec: { kind: "vitals_trend", timepointsHr: [0, 1], series: [{ vital: "hr", values: [80, 90] }, { vital: "hr", values: [85, 95] }] }, expectCode: "duplicate_vital" },
    { spec: { kind: "vitals_trend", timepointsHr: [0, 1], series: [{ vital: "hr", values: [999, 90] }] }, expectCode: "value_out_of_range" },
    { spec: { kind: "vitals_trend", timepointsHr: [0], tempUnit: "C", series: [{ vital: "temp", values: [43.1] }] }, expectCode: "value_out_of_range" },
    { spec: { kind: "vitals_trend", timepointsHr: [0, 1], series: [{ vital: "sbp", values: [100, 100] }, { vital: "dbp", values: [60, 60] }, { vital: "map", values: [200, 200] }] }, expectCode: "map_bounds_violation" },
    { spec: { kind: "vitals_trend", population: "peds_child", timepointsHr: [0, 1], series: [{ vital: "hr", values: [110, 105], showReferenceBand: true }] }, expectCode: "reference_band_population_unsupported" }
  ]
};
var vitalsTrendModule = {
  kind: "vitals_trend",
  validate: validateVitalsTrend,
  selfCheck: selfCheckVitalsTrend,
  renderSvg: renderVitalsTrendSvg,
  fixtures: fixtures3
};
registerVisual(vitalsTrendModule);

// src/visuals/kinds/lab_trend/index.ts
var ANALYTE_KEYS = new Set(Object.keys(ANALYTE_DEFS));
var SERIES_STYLE_ROLES = ["blue", "green"];
var isRecord4 = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
var nonEmptyString4 = (v) => typeof v === "string" && v.trim().length > 0;
var validateLabTrend = (spec) => {
  const errs = [];
  const value = spec;
  if (value.kind !== "lab_trend") {
    errs.push({ path: "kind", code: "invalid_kind", message: "must be 'lab_trend'" });
    return errs;
  }
  if (!isRecord4(value.time)) {
    errs.push({ path: "time", code: "timepoints_invalid", message: "must be an object with unit and values" });
    return errs;
  }
  const timeObj = value.time;
  if (timeObj.unit !== "hr" && timeObj.unit !== "min" && timeObj.unit !== "day") {
    errs.push({ path: "time.unit", code: "invalid_time_unit", message: "must be 'hr', 'min', or 'day'" });
  }
  if (!Array.isArray(timeObj.values) || timeObj.values.length === 0) {
    errs.push({ path: "time.values", code: "timepoints_invalid", message: "must be a non-empty array" });
    return errs;
  }
  const times = timeObj.values;
  for (let i = 0; i < times.length; i++) {
    if (typeof times[i] !== "number" || !Number.isFinite(times[i])) {
      errs.push({ path: `time.values[${i}]`, code: "timepoint_not_number", message: "must be a finite number" });
    } else if (i > 0 && typeof times[i - 1] === "number" && times[i] <= times[i - 1]) {
      errs.push({ path: `time.values[${i}]`, code: "timepoints_not_increasing", message: "must be strictly increasing" });
    }
  }
  const numTimepoints = times.length;
  if (numTimepoints < 3) {
    errs.push({ path: "time.values", code: "too_few_timepoints", message: "must have at least 3 timepoints" });
  }
  if (value.population !== void 0 && !isPopulation(value.population)) {
    errs.push({ path: "population", code: "invalid_population", message: "must be 'adult', 'peds_child', or 'peds_infant'" });
  }
  if (!Array.isArray(value.series) || value.series.length === 0) {
    errs.push({ path: "series", code: "series_empty", message: "must have at least one series" });
    return errs;
  }
  if (value.series.length > 2) {
    errs.push({ path: "series", code: "too_many_series", message: "must have at most 2 series" });
  }
  const pop = isPopulation(value.population) ? value.population : "adult";
  const seenAnalytes = /* @__PURE__ */ new Set();
  const seriesArr = value.series;
  seriesArr.forEach((s, idx) => {
    if (!isRecord4(s)) {
      errs.push({ path: `series[${idx}]`, code: "series_entry_invalid", message: "must be an object" });
      return;
    }
    if (typeof s.analyte !== "string" || !ANALYTE_KEYS.has(s.analyte)) {
      errs.push({ path: `series[${idx}].analyte`, code: "invalid_analyte_key", message: "is not a recognized analyte key" });
      return;
    }
    const analyteKey = s.analyte;
    if (seenAnalytes.has(analyteKey)) {
      errs.push({ path: `series[${idx}].analyte`, code: "duplicate_analyte", message: "cannot duplicate analyte keys" });
    }
    seenAnalytes.add(analyteKey);
    const def = ANALYTE_DEFS[analyteKey];
    if (s.unit !== void 0) {
      const recognizedUnits = [def.canonicalUnit, ...def.altUnits];
      if (typeof s.unit !== "string" || !recognizedUnits.includes(s.unit)) {
        errs.push({ path: `series[${idx}].unit`, code: "invalid_unit_for_analyte", message: `must be one of: ${recognizedUnits.join(", ")}` });
      }
    }
    if (s.showReferenceBand !== void 0 && typeof s.showReferenceBand !== "boolean") {
      errs.push({ path: `series[${idx}].showReferenceBand`, code: "invalid_show_reference_band", message: "must be a boolean" });
    }
    if (!Array.isArray(s.values)) {
      errs.push({ path: `series[${idx}].values`, code: "values_length_mismatch", message: "must be an array" });
      return;
    }
    if (s.values.length !== numTimepoints) {
      errs.push({ path: `series[${idx}].values`, code: "values_length_mismatch", message: "must match time.values length" });
    }
    const { min, max } = def.sanity;
    const refBand = def.refBand[pop];
    if (s.showReferenceBand !== false && !refBand) {
      errs.push({
        path: `series[${idx}].showReferenceBand`,
        code: "reference_band_unavailable",
        message: `no verified ${pop} reference band exists for ${analyteKey}; set showReferenceBand false for trend-only use`
      });
    }
    s.values.forEach((v, vidx) => {
      if (typeof v !== "number" || !Number.isFinite(v)) {
        errs.push({ path: `series[${idx}].values[${vidx}]`, code: "value_not_number", message: "must be a finite number" });
      } else if (v < min || v > max) {
        const bandContext = refBand ? `; reference band is ${refBand.low}\u2013${refBand.high}` : "";
        errs.push({ path: `series[${idx}].values[${vidx}]`, code: "value_out_of_range", message: `must be between ${min} and ${max} ${def.canonicalUnit} (sanity bounds for ${analyteKey}${bandContext})` });
      }
    });
  });
  if (value.caption !== void 0) {
    if (!isRecord4(value.caption) || !nonEmptyString4(value.caption.en)) {
      errs.push({ path: "caption.en", code: "caption_en_required", message: "is required when caption is present" });
    } else if (value.caption.zh !== void 0 && !nonEmptyString4(value.caption.zh)) {
      errs.push({ path: "caption.zh", code: "caption_zh_empty", message: "must be non-empty when present" });
    }
  }
  return errs;
};
var selfCheckLabTrend = (spec, question) => {
  const errs = [];
  const times = Array.isArray(spec.time?.values) ? spec.time.values : [];
  if (times.length === 0 || !Array.isArray(spec.series)) return errs;
  const pop = spec.population ?? "adult";
  spec.series.forEach((s, idx) => {
    if (!ANALYTE_KEYS.has(s.analyte) || !Array.isArray(s.values)) return;
    s.values.forEach((v, vidx) => {
      if (typeof v !== "number" || !Number.isFinite(v)) {
        errs.push({ path: `series[${idx}].values[${vidx}]`, code: "self_check_render_divergence", message: "plotted value is not a finite number" });
      }
    });
  });
  const meta = isRecord4(question) && isRecord4(question.meta) ? question.meta : null;
  if (meta !== null && !nonEmptyString4(meta.visual_justification)) {
    errs.push({ path: "meta.visual_justification", code: "self_check_missing_justification", message: "must be present and non-empty" });
  }
  const expectedTrends = meta && Array.isArray(meta.expected_trend) ? meta.expected_trend : [];
  const expectedFlags = meta && Array.isArray(meta.expected_flags) ? meta.expected_flags : [];
  if (meta !== null && expectedTrends.length === 0 && expectedFlags.length === 0) {
    errs.push({ path: "meta", code: "self_check_no_keyed_cue", message: "must declare at least one expected_trend or expected_flags entry" });
  }
  for (const entry of expectedTrends) {
    if (!isRecord4(entry)) continue;
    const seriesKey = typeof entry.series === "string" ? entry.series : null;
    if (!seriesKey) continue;
    if (!Array.isArray(entry.window) || entry.window.length !== 2) continue;
    const t0 = entry.window[0];
    const t1 = entry.window[1];
    const idxStart = times.indexOf(t0);
    const idxEnd = times.indexOf(t1);
    if (idxStart === -1 || idxEnd === -1 || idxEnd <= idxStart) {
      errs.push({ path: `meta.expected_trend[series=${seriesKey}]`, code: "self_check_snapshot_not_trajectory", message: "window must span more than one timepoint present in time.values" });
      continue;
    }
    const tSeries = spec.series.find((s) => s.analyte === seriesKey);
    if (!tSeries || !Array.isArray(tSeries.values)) continue;
    const valStart = tSeries.values[idxStart];
    const valEnd = tSeries.values[idxEnd];
    if (typeof valStart !== "number" || typeof valEnd !== "number") continue;
    const def = ANALYTE_DEFS[tSeries.analyte];
    const band = def ? def.refBand[pop] : void 0;
    if (entry.direction === "stable" && !band) {
      errs.push({
        path: `meta.expected_trend[series=${seriesKey}]`,
        code: "self_check_stable_requires_reference_band",
        message: `stable assertions require a verified ${pop} reference band for ${seriesKey}`
      });
      continue;
    }
    const eps = def && band ? def.stableEps * (band.high - band.low) : 0;
    if (entry.direction === "up" && valEnd <= valStart) {
      errs.push({ path: `series.${seriesKey}`, code: "self_check_trend_failed", message: `expected 'up' but valEnd (${valEnd}) <= valStart (${valStart})` });
    } else if (entry.direction === "down" && valEnd >= valStart) {
      errs.push({ path: `series.${seriesKey}`, code: "self_check_trend_failed", message: `expected 'down' but valEnd (${valEnd}) >= valStart (${valStart})` });
    } else if (entry.direction === "stable" && Math.abs(valEnd - valStart) > eps) {
      errs.push({ path: `series.${seriesKey}`, code: "self_check_trend_failed", message: `expected 'stable' but |valEnd \u2212 valStart| (${Math.abs(valEnd - valStart)}) > stableEps (${eps})` });
    }
  }
  for (const entry of expectedFlags) {
    if (!isRecord4(entry)) continue;
    const seriesKey = typeof entry.series === "string" ? entry.series : null;
    if (!seriesKey || typeof entry.at !== "number") continue;
    const tSeries = spec.series.find((s) => s.analyte === seriesKey);
    if (!tSeries || !Array.isArray(tSeries.values)) continue;
    const def = ANALYTE_DEFS[tSeries.analyte];
    if (!def) continue;
    const timeIdx = times.indexOf(entry.at);
    if (timeIdx === -1) continue;
    const val = tSeries.values[timeIdx];
    if (typeof val !== "number") continue;
    const band = def.refBand[pop];
    if (!band) {
      errs.push({
        path: `meta.expected_flags[series=${seriesKey}]`,
        code: "self_check_flag_requires_reference_band",
        message: `H/L assertions require a verified ${pop} reference band for ${seriesKey}`
      });
      continue;
    }
    const computedFlag = val > band.high ? "H" : val < band.low ? "L" : null;
    if (entry.flag !== computedFlag) {
      errs.push({ path: `series.${seriesKey}[t=${entry.at}]`, code: "self_check_flag_failed", message: `declared flag '${entry.flag}' but computed '${computedFlag ?? "normal"}' (value ${val}, band ${band.low}\u2013${band.high})` });
    }
  }
  return errs;
};
var renderLabTrendSvg = (spec) => {
  const times = spec.time?.values ?? [];
  const timeUnit = spec.time?.unit ?? "hr";
  const pop = spec.population ?? "adult";
  const xAxisLabel = timeUnit === "min" ? "Time (Minutes)" : timeUnit === "day" ? "Time (Days)" : "Time (Hours)";
  const chartSeries = spec.series.map((s, idx) => {
    const def = ANALYTE_DEFS[s.analyte];
    const band = def ? def.refBand[pop] : void 0;
    const axis = idx === 0 ? "left" : "right";
    return {
      label: def ? def.label : s.analyte,
      unit: s.unit ?? (def ? def.canonicalUnit : ""),
      axis,
      styleRole: SERIES_STYLE_ROLES[idx] ?? "blue",
      points: s.values.map((v, i) => ({ x: times[i], y: v })),
      referenceBand: s.showReferenceBand !== false && band ? band : void 0
    };
  });
  const xMin = times.length > 0 ? Math.min(...times) : 0;
  const xMax = times.length > 0 ? Math.max(...times) : 1;
  let leftMin = 9999, leftMax = -9999;
  let rightMin = 9999, rightMax = -9999;
  let hasLeft = false, hasRight = false;
  chartSeries.forEach((s) => {
    const vals = s.points.map((p) => p.y);
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
    if (leftMin < 0 && !chartSeries.some((s) => s.axis === "left" && s.points.some((p) => p.y < 0))) leftMin = 0;
  } else {
    leftMin = 0;
    leftMax = 100;
  }
  if (hasRight) {
    const pad = Math.max((rightMax - rightMin) * 0.1, (rightMax - rightMin) * 0.05 + 0.1);
    rightMin = rightMin - pad;
    rightMax = rightMax + pad;
    if (rightMin < 0 && !chartSeries.some((s) => s.axis === "right" && s.points.some((p) => p.y < 0))) rightMin = 0;
  }
  const input = {
    series: chartSeries,
    xAxis: { label: xAxisLabel, min: xMin, max: xMax, ticks: times },
    yAxisLeft: {
      label: "",
      min: leftMin,
      max: leftMax,
      ticks: [leftMin, leftMin + (leftMax - leftMin) / 2, leftMax]
    },
    width: 600,
    height: 300
  };
  if (hasRight) {
    input.yAxisRight = {
      label: "",
      min: rightMin,
      max: rightMax,
      ticks: [rightMin, rightMin + (rightMax - rightMin) / 2, rightMax]
    };
  }
  const svgBody = renderLineChart(input);
  const captionAttr = spec.caption ? ` aria-label="${escapeXml(spec.caption.en)}"` : ` aria-label="Lab Trend"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" role="img"${captionAttr} data-kind="lab_trend">
${svgBody}
</svg>`;
};
var fixtures4 = {
  valid: [
    // Rising creatinine over 72 h (AKI worsening, single analyte, left axis)
    {
      kind: "lab_trend",
      time: { unit: "hr", values: [0, 24, 48, 72] },
      population: "adult",
      series: [{ analyte: "creatinine", values: [1.1, 1.8, 2.6, 3.5] }],
      caption: { en: "Serum creatinine trend", zh: "\u8840\u808C\u9150\u53D8\u5316\u8D8B\u52BF" }
    },
    // Falling Na⁺ (SIADH) paired with rising creatinine — dual axis
    {
      kind: "lab_trend",
      time: { unit: "day", values: [0, 1, 2, 3] },
      population: "adult",
      series: [
        { analyte: "sodium", values: [138, 132, 126, 121] },
        { analyte: "creatinine", values: [0.9, 1.2, 1.6, 2] }
      ]
    },
    // Pediatric trend-only use is allowed when the unavailable coarse-bucket band is suppressed.
    {
      kind: "lab_trend",
      time: { unit: "hr", values: [0, 12, 24] },
      population: "peds_child",
      series: [{ analyte: "lactate", values: [4.2, 2.8, 1.9], showReferenceBand: false }]
    }
  ],
  invalid: [
    // too_few_timepoints: only 2 points
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24] }, series: [{ analyte: "creatinine", values: [1, 2] }] }, expectCode: "too_few_timepoints" },
    // too_many_series: 3 analytes
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "sodium", values: [138, 135, 132] }, { analyte: "potassium", values: [4, 4.2, 4.5] }, { analyte: "creatinine", values: [1, 1.5, 2] }] }, expectCode: "too_many_series" },
    // duplicate_analyte
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1, 1.5, 2] }, { analyte: "creatinine", values: [1, 1.5, 2] }] }, expectCode: "duplicate_analyte" },
    // values_length_mismatch
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1, 2] }] }, expectCode: "values_length_mismatch" },
    // value_out_of_range: creatinine 99 exceeds sanity max of 25
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1, 2, 99] }] }, expectCode: "value_out_of_range" },
    // invalid_analyte_key
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "fibrinogen", values: [300, 350, 400] }] }, expectCode: "invalid_analyte_key" },
    // timepoints_not_increasing
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 48, 24] }, series: [{ analyte: "creatinine", values: [1, 2, 1.5] }] }, expectCode: "timepoints_not_increasing" },
    // invalid_kind
    { spec: { kind: "vitals_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1, 1.5, 2] }] }, expectCode: "invalid_kind" },
    // invalid_time_unit
    { spec: { kind: "lab_trend", time: { unit: "week", values: [0, 1, 2] }, series: [{ analyte: "creatinine", values: [1, 1.5, 2] }] }, expectCode: "invalid_time_unit" },
    // timepoint_not_number
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, "twenty-four", 48] }, series: [{ analyte: "creatinine", values: [1, 1.5, 2] }] }, expectCode: "timepoint_not_number" },
    // invalid_population
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, population: "geriatric", series: [{ analyte: "creatinine", values: [1, 1.5, 2] }] }, expectCode: "invalid_population" },
    // Coarse pediatric buckets are trend-only unless the band is explicitly suppressed.
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, population: "peds_child", series: [{ analyte: "creatinine", values: [0.5, 0.6, 0.7] }] }, expectCode: "reference_band_unavailable" },
    // invalid_unit_for_analyte
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", unit: "bpm", values: [1, 1.5, 2] }] }, expectCode: "invalid_unit_for_analyte" },
    // caption_en_required
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1, 1.5, 2] }], caption: { en: "" } }, expectCode: "caption_en_required" },
    // caption_zh_empty
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1, 1.5, 2] }], caption: { en: "Creatinine", zh: "" } }, expectCode: "caption_zh_empty" }
  ]
};
var labTrendModule = {
  kind: "lab_trend",
  allowedItemTypes: ["multiple_choice", "select_all", "matrix", "ordered_response", "dropdown_cloze", "fill_in_blank"],
  validate: validateLabTrend,
  selfCheck: selfCheckLabTrend,
  renderSvg: renderLabTrendSvg,
  fixtures: fixtures4
};
registerVisual(labTrendModule);

// src/visuals/kinds/mar/index.ts
var cpWidth = (cp) => {
  if (cp >= 19968 && cp <= 40959 || cp >= 13312 && cp <= 19903 || cp >= 63744 && cp <= 64255 || cp >= 12288 && cp <= 12351 || cp >= 65280 && cp <= 65519) return 2;
  if ("MW@%#&QO0".includes(String.fromCodePoint(cp))) return 1.7;
  if ("- .,;:!'|ijlI()[]{}".includes(String.fromCodePoint(cp))) return 0.55;
  return 1;
};
var estimateWidth = (text, fontSize, unitEm = 0.62) => {
  let w = 0;
  for (const ch of text) {
    const cp = ch.codePointAt(0) ?? 0;
    w += cpWidth(cp);
  }
  return w * fontSize * unitEm;
};
var wrapText = (text, maxWidth, fontSize, unitEm = 0.62) => {
  if (estimateWidth(text, fontSize, unitEm) <= maxWidth) return [text];
  const lines = [];
  const words = text.split(/(\s+)/);
  let current = "";
  const flush = () => {
    if (current.length > 0) {
      lines.push(current);
      current = "";
    }
  };
  const appendFragment = (fragment) => {
    if (estimateWidth(fragment, fontSize, unitEm) <= maxWidth) {
      if (current.length === 0) {
        current = fragment;
      } else if (estimateWidth(current + fragment, fontSize, unitEm) <= maxWidth) {
        current += fragment;
      } else {
        flush();
        current = fragment;
      }
      return;
    }
    for (const ch of fragment) {
      if (current.length === 0) {
        current = ch;
      } else if (estimateWidth(current + ch, fontSize, unitEm) <= maxWidth) {
        current += ch;
      } else {
        flush();
        current = ch;
      }
    }
  };
  for (const token of words) {
    if (/^\s+$/.test(token)) {
      if (current.length > 0) {
        if (estimateWidth(current + token, fontSize, unitEm) <= maxWidth) {
          current += token;
        } else {
          flush();
        }
      }
      continue;
    }
    const subTokens = token.split(/((?<=-)|(?=-))/);
    for (const sub of subTokens) {
      if (sub.length === 0) continue;
      appendFragment(sub);
    }
  }
  flush();
  return lines.length > 0 ? lines : [text];
};
var MAR_BODY_FONT_SIZE = 12;
var MAR_BODY_LINE_H = 14;
var MAR_BODY_V_PAD = 7;
var MAR_HEADER_FONT_SIZE = 11;
var MAR_HEADER_LINE_H = 13;
var MAR_HEADER_V_PAD = 6;
var marRowHeight = (maxLineCount) => Math.max(28, maxLineCount * MAR_BODY_LINE_H + MAR_BODY_V_PAD * 2);
var marHeaderHeight = (maxLineCount) => Math.max(32, maxLineCount * MAR_HEADER_LINE_H + MAR_HEADER_V_PAD * 2);
var marCanvasWidth = (timeGridLength) => Math.max(600, Math.round(56 * (5.5 + timeGridLength)));
var MAR_ROUTES = /* @__PURE__ */ new Set([
  "PO",
  "IV",
  "IVPB",
  "IM",
  "SubQ",
  "SL",
  "PR",
  "topical",
  "inhaled",
  "ophthalmic",
  "NG"
]);
var MAR_STATUSES = /* @__PURE__ */ new Set([
  "given",
  "held",
  "due",
  "missed",
  "late",
  "not_given"
]);
var isRecord5 = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
var nonEmptyString5 = (v) => typeof v === "string" && v.trim().length > 0;
var validateMar = (spec) => {
  const errs = [];
  const value = spec;
  if (value.kind !== "mar") {
    errs.push({ path: "kind", code: "invalid_kind", message: "must be 'mar'" });
    return errs;
  }
  if (!Array.isArray(value.timeGrid) || value.timeGrid.length === 0) {
    errs.push({ path: "timeGrid", code: "time_grid_empty", message: "must be a non-empty array" });
    return errs;
  }
  const timeGridArr = value.timeGrid;
  const timeGridSet = /* @__PURE__ */ new Set();
  for (let i = 0; i < timeGridArr.length; i++) {
    if (typeof timeGridArr[i] !== "string" || timeGridArr[i].length === 0) {
      errs.push({ path: `timeGrid[${i}]`, code: "time_grid_empty", message: "must be a non-empty string" });
    } else {
      const t = timeGridArr[i];
      if (timeGridSet.has(t)) {
        errs.push({ path: `timeGrid[${i}]`, code: "time_grid_duplicate", message: `duplicate time slot '${t}'` });
      }
      timeGridSet.add(t);
    }
  }
  if (!Array.isArray(value.medications) || value.medications.length === 0) {
    errs.push({ path: "medications", code: "medications_empty", message: "must have at least one medication" });
    return errs;
  }
  const medsArr = value.medications;
  const seenNames = /* @__PURE__ */ new Set();
  for (let i = 0; i < medsArr.length; i++) {
    if (!isRecord5(medsArr[i])) continue;
    const medName = medsArr[i].name;
    if (typeof medName === "string" && medName.trim().length > 0) {
      if (seenNames.has(medName)) {
        errs.push({ path: `medications[${i}].name`, code: "duplicate_medication_name", message: `duplicate medication name '${medName}'` });
      }
      seenNames.add(medName);
    }
  }
  for (let i = 0; i < medsArr.length; i++) {
    if (!isRecord5(medsArr[i])) {
      errs.push({ path: `medications[${i}]`, code: "med_field_missing", message: "must be an object" });
      continue;
    }
    const med = medsArr[i];
    if (!nonEmptyString5(med.name)) {
      errs.push({ path: `medications[${i}].name`, code: "med_field_missing", message: "must be a non-empty string" });
    }
    if (!nonEmptyString5(med.dose)) {
      errs.push({ path: `medications[${i}].dose`, code: "med_field_missing", message: "must be a non-empty string" });
    }
    if (!nonEmptyString5(med.frequency)) {
      errs.push({ path: `medications[${i}].frequency`, code: "med_field_missing", message: "must be a non-empty string" });
    }
    if (typeof med.route !== "string" || !MAR_ROUTES.has(med.route)) {
      errs.push({ path: `medications[${i}].route`, code: "invalid_route", message: `'${String(med.route)}' is not a valid MarRoute` });
    }
    if (!Array.isArray(med.administrations)) {
      errs.push({ path: `medications[${i}].administrations`, code: "administrations_invalid", message: "must be an array" });
      continue;
    }
    const seenAdminTimes = /* @__PURE__ */ new Set();
    const admArr = med.administrations;
    for (let j = 0; j < admArr.length; j++) {
      if (!isRecord5(admArr[j])) {
        errs.push({ path: `medications[${i}].administrations[${j}]`, code: "administrations_invalid", message: "must be an object" });
        continue;
      }
      const adm = admArr[j];
      if (typeof adm.time !== "string" || !timeGridSet.has(adm.time)) {
        errs.push({ path: `medications[${i}].administrations[${j}].time`, code: "admin_time_not_in_grid", message: `'${String(adm.time)}' is not in timeGrid` });
      } else {
        const t = adm.time;
        if (seenAdminTimes.has(t)) {
          errs.push({ path: `medications[${i}].administrations[${j}]`, code: "duplicate_administration", message: `duplicate administration at time '${t}'` });
        }
        seenAdminTimes.add(t);
      }
      if (typeof adm.status !== "string" || !MAR_STATUSES.has(adm.status)) {
        errs.push({ path: `medications[${i}].administrations[${j}].status`, code: "invalid_status", message: `'${String(adm.status)}' is not a valid MarStatus` });
      }
    }
    if (med.isHighAlert !== void 0 && typeof med.isHighAlert !== "boolean") {
      errs.push({ path: `medications[${i}].isHighAlert`, code: "invalid_high_alert", message: "must be a boolean" });
    }
  }
  if (value.caption !== void 0) {
    if (!isRecord5(value.caption) || !nonEmptyString5(value.caption.en)) {
      errs.push({ path: "caption.en", code: "caption_en_required", message: "is required when caption is present" });
    } else if (value.caption.zh !== void 0 && !nonEmptyString5(value.caption.zh)) {
      errs.push({ path: "caption.zh", code: "caption_zh_empty", message: "must be non-empty when present" });
    }
  }
  return errs;
};
var selfCheckMar = (spec, question) => {
  const errs = [];
  const meta = isRecord5(question) && isRecord5(question.meta) ? question.meta : null;
  if (meta !== null && !nonEmptyString5(meta.visual_justification)) {
    errs.push({ path: "meta.visual_justification", code: "self_check_missing_justification", message: "must be present and non-empty" });
  }
  if (meta !== null) {
    const keyedCells = Array.isArray(meta.keyed_cells) ? meta.keyed_cells : [];
    const hasKeyedCells = keyedCells.length > 0;
    const hasKeyedRel = typeof meta.keyed_relationship === "string" && meta.keyed_relationship.trim().length > 0;
    if (!hasKeyedCells && !hasKeyedRel) {
      errs.push({ path: "meta", code: "self_check_no_keyed_cue", message: "must declare at least one keyed_cells entry or a non-null keyed_relationship" });
    }
  }
  if (meta !== null && Array.isArray(meta.keyed_cells)) {
    const gridSet = new Set(Array.isArray(spec.timeGrid) ? spec.timeGrid.filter((t) => typeof t === "string") : []);
    const keyedCells = meta.keyed_cells;
    for (let i = 0; i < keyedCells.length; i++) {
      const entry = keyedCells[i];
      if (!isRecord5(entry)) continue;
      const medName = entry.medication;
      const time = entry.time;
      if (typeof medName !== "string" || typeof time !== "string") continue;
      if (!gridSet.has(time)) {
        errs.push({ path: `meta.keyed_cells[${i}]`, code: "self_check_keyed_cell_absent", message: `time '${time}' is not in timeGrid` });
        continue;
      }
      const med = Array.isArray(spec.medications) ? spec.medications.find((m) => m.name === medName) : void 0;
      if (!med) {
        errs.push({ path: `meta.keyed_cells[${i}]`, code: "self_check_keyed_cell_absent", message: `medication '${medName}' not found in spec` });
        continue;
      }
      const hasAdmin = Array.isArray(med.administrations) && med.administrations.some((a) => a.time === time);
      if (!hasAdmin) {
        errs.push({ path: `meta.keyed_cells[${i}]`, code: "self_check_keyed_cell_absent", message: `no administration for '${medName}' at time '${time}'` });
      }
    }
  }
  if (Array.isArray(spec.medications) && Array.isArray(spec.timeGrid)) {
    const gridSet = new Set(spec.timeGrid.filter((t) => typeof t === "string"));
    spec.medications.forEach((med, mi) => {
      if (!Array.isArray(med.administrations)) return;
      med.administrations.forEach((adm, ai) => {
        if (typeof adm.time === "string" && !gridSet.has(adm.time)) {
          errs.push({ path: `medications[${mi}].administrations[${ai}].time`, code: "self_check_admin_time_not_in_grid", message: `'${adm.time}' not in timeGrid` });
        }
        if (typeof adm.status === "string" && !MAR_STATUSES.has(adm.status)) {
          errs.push({ path: `medications[${mi}].administrations[${ai}].status`, code: "self_check_invalid_status", message: `'${adm.status}' is not a valid MarStatus` });
        }
      });
    });
  }
  return errs;
};
var STATUS_GLYPHS = {
  given: "\u2713",
  held: "H",
  due: "\u2014",
  missed: "\xD7",
  late: "L",
  not_given: "NG"
};
var statusNeedsFlag = (status) => status === "held" || status === "missed" || status === "late";
var buildMarTableModel = (spec) => {
  const timeGrid = Array.isArray(spec.timeGrid) ? spec.timeGrid : [];
  const medications = Array.isArray(spec.medications) ? spec.medications : [];
  const canvasWidth = marCanvasWidth(timeGrid.length);
  const totalFr = 5.5 + timeGrid.length;
  const frUnit = canvasWidth / totalFr;
  const medColW = frUnit * 2;
  const doseColW = frUnit * 1.5;
  const freqColW = frUnit * 1;
  const CELL_INNER_PAD = 16;
  const medWrapW = medColW - CELL_INNER_PAD;
  const doseWrapW = doseColW - CELL_INNER_PAD;
  const freqWrapW = freqColW - CELL_INNER_PAD;
  const timeSlotW = frUnit * 1;
  const timeWrapW = timeSlotW - CELL_INNER_PAD;
  const timeHeaderLinesPerCol = timeGrid.map(
    (t) => wrapText(t, timeWrapW, MAR_HEADER_FONT_SIZE)
  );
  const maxTimeHeaderLines = timeHeaderLinesPerCol.reduce(
    (m, ls) => Math.max(m, ls.length),
    1
  );
  const resolvedHeaderHeight = marHeaderHeight(maxTimeHeaderLines);
  const columns = [
    { key: "med", label: "Medication", widthFr: 2, align: "left" },
    { key: "dose", label: "Dose", widthFr: 1.5, align: "left" },
    { key: "rte", label: "Route", widthFr: 1, align: "center" },
    { key: "freq", label: "Freq", widthFr: 1, align: "center" },
    ...timeGrid.map((t) => ({ key: `t_${t}`, label: t, widthFr: 1, align: "center" }))
  ];
  const columnHeaderLines = [
    void 0,
    // Medication
    void 0,
    // Dose
    void 0,
    // Route
    void 0,
    // Freq
    ...timeHeaderLinesPerCol
  ];
  const rows = medications.map((med) => {
    const adminByTime = {};
    if (Array.isArray(med.administrations)) {
      for (const adm of med.administrations) {
        if (typeof adm.time === "string" && typeof adm.status === "string") {
          adminByTime[adm.time] = adm.status;
        }
      }
    }
    const medLines = wrapText(med.name, medWrapW, MAR_BODY_FONT_SIZE);
    const doseLines = wrapText(med.dose, doseWrapW, MAR_BODY_FONT_SIZE);
    const freqLines = wrapText(med.frequency, freqWrapW, MAR_BODY_FONT_SIZE);
    const maxLines = Math.max(medLines.length, doseLines.length, freqLines.length, 1);
    const resolvedRowHeight = marRowHeight(maxLines);
    const cells = {
      med: med.isHighAlert ? { text: med.name, emphasis: "bold", displayLines: medLines } : { text: med.name, displayLines: medLines },
      dose: { text: med.dose, displayLines: doseLines },
      rte: med.route,
      // single-line center
      freq: { text: med.frequency, displayLines: freqLines }
    };
    for (const t of timeGrid) {
      const status = adminByTime[t];
      if (status !== void 0) {
        cells[`t_${t}`] = {
          text: STATUS_GLYPHS[status] ?? status,
          emphasis: statusNeedsFlag(status) ? "flag" : "normal"
          // status glyphs are single-line, centered; no displayLines needed
        };
      }
    }
    return { cells, rowHeight: resolvedRowHeight };
  });
  const tableInput = {
    columns,
    rows,
    width: canvasWidth,
    headerHeight: resolvedHeaderHeight,
    containCells: true,
    columnHeaderLines
  };
  return {
    input: tableInput,
    width: canvasWidth,
    height: measureDocTable(tableInput)
  };
};
var renderMarSvg = (spec) => {
  const model = buildMarTableModel(spec);
  const tableG = renderDocTable(model.input);
  const ariaLabel = spec.caption?.en ? escapeXml(spec.caption.en) : "Medication Administration Record";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${fmt(model.width)}" height="${fmt(model.height)}" viewBox="0 0 ${fmt(model.width)} ${fmt(model.height)}" role="img" aria-label="${ariaLabel}" data-kind="mar">
${tableG}
</svg>`;
};
var fixtures5 = {
  valid: [
    // Four-slot MAR: held enoxaparin dose at 1800 (single keyed cell); isHighAlert med
    {
      kind: "mar",
      timeGrid: ["0600", "1200", "1800", "2400"],
      medications: [
        {
          name: "enoxaparin",
          dose: "40 mg",
          route: "SubQ",
          frequency: "daily",
          administrations: [
            { time: "0600", status: "given" },
            { time: "1800", status: "held" }
          ],
          isHighAlert: true
        },
        {
          name: "metoprolol",
          dose: "25 mg",
          route: "PO",
          frequency: "BID",
          administrations: [
            { time: "0600", status: "given" },
            { time: "1200", status: "given" },
            { time: "1800", status: "due" }
          ]
        }
      ],
      caption: { en: "Medication Administration Record", zh: "\u836F\u7269\u7ED9\u836F\u8BB0\u5F55" }
    },
    // Two-row MAR: concurrent rate-lowering agents (timing collision, keyed_relationship)
    {
      kind: "mar",
      timeGrid: ["0800", "1200", "1600", "2000"],
      medications: [
        {
          name: "metoprolol",
          dose: "25 mg",
          route: "PO",
          frequency: "BID",
          administrations: [
            { time: "0800", status: "given" },
            { time: "1200", status: "given" },
            { time: "2000", status: "due" }
          ]
        },
        {
          name: "diltiazem",
          dose: "30 mg",
          route: "PO",
          frequency: "TID",
          administrations: [
            { time: "0800", status: "given" },
            { time: "1200", status: "given" },
            { time: "1600", status: "late" }
          ]
        }
      ]
    }
  ],
  invalid: [
    // medications_empty
    { spec: { kind: "mar", timeGrid: ["0600"], medications: [] }, expectCode: "medications_empty" },
    // duplicate_medication_name
    {
      spec: {
        kind: "mar",
        timeGrid: ["0600", "1200"],
        medications: [
          { name: "heparin", dose: "5000 units", route: "SubQ", frequency: "q8h", administrations: [] },
          { name: "heparin", dose: "10000 units", route: "IV", frequency: "q12h", administrations: [] }
        ]
      },
      expectCode: "duplicate_medication_name"
    },
    // invalid_route
    {
      spec: {
        kind: "mar",
        timeGrid: ["0600"],
        medications: [{ name: "aspirin", dose: "81 mg", route: "oral", frequency: "daily", administrations: [] }]
      },
      expectCode: "invalid_route"
    },
    // admin_time_not_in_grid
    {
      spec: {
        kind: "mar",
        timeGrid: ["0600", "1200"],
        medications: [
          { name: "lisinopril", dose: "10 mg", route: "PO", frequency: "daily", administrations: [{ time: "0800", status: "given" }] }
        ]
      },
      expectCode: "admin_time_not_in_grid"
    },
    // duplicate_administration
    {
      spec: {
        kind: "mar",
        timeGrid: ["0600", "1200"],
        medications: [
          { name: "furosemide", dose: "40 mg", route: "IV", frequency: "BID", administrations: [{ time: "0600", status: "given" }, { time: "0600", status: "given" }] }
        ]
      },
      expectCode: "duplicate_administration"
    },
    // time_grid_duplicate
    { spec: { kind: "mar", timeGrid: ["0600", "0600"], medications: [{ name: "aspirin", dose: "81 mg", route: "PO", frequency: "daily", administrations: [] }] }, expectCode: "time_grid_duplicate" },
    // invalid_status
    {
      spec: {
        kind: "mar",
        timeGrid: ["0600"],
        medications: [
          { name: "warfarin", dose: "5 mg", route: "PO", frequency: "daily", administrations: [{ time: "0600", status: "pending" }] }
        ]
      },
      expectCode: "invalid_status"
    }
  ]
};
var marModule = {
  kind: "mar",
  validate: validateMar,
  selfCheck: selfCheckMar,
  renderSvg: renderMarSvg,
  fixtures: fixtures5
};
registerVisual(marModule);

// src/visuals/kinds/io_record/index.ts
var MAX_ENTRY_ML = 1e4;
var KEYED_TOTALS = ["intake_total_ml", "output_total_ml", "net_balance_ml"];
var isRecord6 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var nonEmptyString6 = (value) => typeof value === "string" && value.trim().length > 0;
var isValidVolume = (value) => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value > 0;
var validateEntries = (entries, path) => {
  const errors = [];
  entries.forEach((entry, index) => {
    if (!isRecord6(entry)) {
      errors.push({
        path: `${path}[${index}].label`,
        code: "entry_label_missing",
        message: "must be a non-empty string"
      });
      errors.push({
        path: `${path}[${index}].volumeMl`,
        code: "invalid_volume",
        message: "must be a finite positive integer"
      });
      return;
    }
    if (!nonEmptyString6(entry.label)) {
      errors.push({
        path: `${path}[${index}].label`,
        code: "entry_label_missing",
        message: "must be a non-empty string"
      });
    }
    if (!isValidVolume(entry.volumeMl)) {
      errors.push({
        path: `${path}[${index}].volumeMl`,
        code: "invalid_volume",
        message: "must be a finite positive integer"
      });
    } else if (entry.volumeMl > MAX_ENTRY_ML) {
      errors.push({
        path: `${path}[${index}].volumeMl`,
        code: "volume_out_of_range",
        message: `must be no greater than ${MAX_ENTRY_ML} mL`
      });
    }
  });
  return errors;
};
var validateTextPair = (value, path) => {
  if (!isRecord6(value) || !nonEmptyString6(value.en)) {
    return [{
      path: `${path}.en`,
      code: path === "periodLabel" ? "period_label_en_required" : "caption_en_required",
      message: "is required when present"
    }];
  }
  if (value.zh !== void 0 && !nonEmptyString6(value.zh)) {
    return [{
      path: `${path}.zh`,
      code: path === "periodLabel" ? "period_label_zh_empty" : "caption_zh_empty",
      message: "must be non-empty when present"
    }];
  }
  return [];
};
var validateIoRecord = (spec) => {
  const errors = [];
  const value = spec;
  if (value.kind !== "io_record") {
    return [{ path: "kind", code: "invalid_kind", message: "must be 'io_record'" }];
  }
  const intakeValid = Array.isArray(value.intake);
  const outputValid = Array.isArray(value.output);
  if (!intakeValid) {
    errors.push({ path: "intake", code: "intake_invalid", message: "must be an array" });
  }
  if (!outputValid) {
    errors.push({ path: "output", code: "output_invalid", message: "must be an array" });
  }
  const intake = intakeValid ? value.intake : [];
  const output = outputValid ? value.output : [];
  if (intakeValid && outputValid && intake.length + output.length === 0) {
    errors.push({ path: "", code: "no_entries", message: "must contain at least one intake or output entry" });
  }
  errors.push(...validateEntries(intake, "intake"));
  errors.push(...validateEntries(output, "output"));
  if (value.periodLabel !== void 0) {
    errors.push(...validateTextPair(value.periodLabel, "periodLabel"));
  }
  if (value.caption !== void 0) {
    errors.push(...validateTextPair(value.caption, "caption"));
  }
  return errors;
};
var structuralEntries = (value) => {
  if (!Array.isArray(value)) return null;
  const entries = [];
  for (const entry of value) {
    if (!isRecord6(entry)) return null;
    entries.push(entry);
  }
  return entries;
};
var selfCheckIoRecord = (spec, question) => {
  const value = spec;
  const intake = structuralEntries(value.intake);
  const output = structuralEntries(value.output);
  if (value.kind !== "io_record" || intake === null || output === null) return [];
  const errors = [];
  const meta = isRecord6(question) && isRecord6(question.meta) ? question.meta : null;
  if (meta !== null && !nonEmptyString6(meta.visual_justification)) {
    errors.push({
      path: "meta.visual_justification",
      code: "self_check_missing_justification",
      message: "must be present and non-empty"
    });
  }
  const keyed = meta !== null && isRecord6(meta.derived_values_keyed) ? meta.derived_values_keyed : null;
  const presentKeys = keyed === null ? [] : KEYED_TOTALS.filter((key) => Object.prototype.hasOwnProperty.call(keyed, key));
  if (meta !== null && presentKeys.length === 0) {
    errors.push({
      path: "meta.derived_values_keyed",
      code: "self_check_no_keyed_values",
      message: "must declare at least one computed intake, output, or net value"
    });
  }
  const allEntries = [...intake, ...output];
  allEntries.forEach((entry, index) => {
    if (!isValidVolume(entry.volumeMl)) {
      errors.push({
        path: `entries[${index}].volumeMl`,
        code: "self_check_invalid_volume",
        message: "must be a finite positive integer"
      });
    }
  });
  if (errors.some((error) => error.code === "self_check_invalid_volume")) return errors;
  const intakeTotal = intake.reduce((sum, entry) => sum + entry.volumeMl, 0);
  const outputTotal = output.reduce((sum, entry) => sum + entry.volumeMl, 0);
  const computed = {
    intake_total_ml: intakeTotal,
    output_total_ml: outputTotal,
    net_balance_ml: intakeTotal - outputTotal
  };
  for (const key of presentKeys) {
    if (keyed?.[key] !== computed[key]) {
      errors.push({
        path: `meta.derived_values_keyed.${key}`,
        code: "self_check_total_mismatch",
        message: `declared ${String(keyed?.[key])} does not match computed ${computed[key]}`
      });
    }
  }
  return errors;
};
var sumVolumes = (entries) => entries.reduce((sum, entry) => sum + entry.volumeMl, 0);
var signed = (value) => value >= 0 ? `+${fmt(value)}` : `\u2212${fmt(Math.abs(value))}`;
var renderIoRecordSvg = (spec) => {
  const intake = Array.isArray(spec.intake) ? spec.intake : [];
  const output = Array.isArray(spec.output) ? spec.output : [];
  const intakeTotal = sumVolumes(intake);
  const outputTotal = sumVolumes(output);
  const netBalance = intakeTotal - outputTotal;
  const rows = [
    { rowHeader: true, cells: { item: "Intake" } },
    ...intake.map((entry) => ({ cells: { item: entry.label, vol: fmt(entry.volumeMl) } })),
    {
      cells: {
        item: { text: "Intake total", emphasis: "bold" },
        vol: { text: fmt(intakeTotal), emphasis: "bold" }
      }
    },
    { rowHeader: true, cells: { item: "Output" } },
    ...output.map((entry) => ({ cells: { item: entry.label, vol: fmt(entry.volumeMl) } })),
    {
      cells: {
        item: { text: "Output total", emphasis: "bold" },
        vol: { text: fmt(outputTotal), emphasis: "bold" }
      }
    },
    {
      cells: {
        item: { text: "Net balance", emphasis: "bold" },
        vol: { text: signed(netBalance), emphasis: "bold" }
      }
    }
  ];
  const rowHeight = 24;
  const headerHeight = 28;
  const title = spec.periodLabel?.en ?? "Intake & Output Record";
  const tableInput = {
    title,
    columns: [
      { key: "item", label: "", widthFr: 3, align: "left" },
      { key: "vol", label: "Volume (mL)", widthFr: 1.4, align: "right" }
    ],
    rows,
    width: 420,
    rowHeight,
    headerHeight
  };
  const totalHeight = measureDocTable(tableInput);
  const table = renderDocTable(tableInput);
  const ariaLabel = escapeXml(
    spec.caption?.en ?? spec.periodLabel?.en ?? "Intake and Output Record"
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 ${fmt(totalHeight)}" role="img" aria-label="${ariaLabel}" data-kind="io_record">
${table}
</svg>`;
};
var fixtures6 = {
  valid: [
    {
      kind: "io_record",
      periodLabel: { en: "0700\u20131500 shift", zh: "0700\u20131500 \u73ED\u6B21" },
      intake: [
        { label: "PO water", volumeMl: 480 },
        { label: "0.9% NaCl IV", volumeMl: 1e3 },
        { label: "IV piggyback antibiotic", volumeMl: 100 }
      ],
      output: [
        { label: "Foley urine", volumeMl: 600 },
        { label: "Emesis", volumeMl: 150 }
      ],
      caption: { en: "Intake and output flowsheet", zh: "\u51FA\u5165\u91CF\u8BB0\u5F55\u5355" }
    },
    {
      kind: "io_record",
      intake: [
        { label: "PO fluids", volumeMl: 240 },
        { label: "0.9% NaCl IV", volumeMl: 500 }
      ],
      output: [
        { label: "Urine", volumeMl: 1400 },
        { label: "NG drainage", volumeMl: 300 }
      ]
    }
  ],
  invalid: [
    { spec: { kind: "io_record", intake: [], output: [] }, expectCode: "no_entries" },
    {
      spec: { kind: "io_record", intake: [{ label: "PO", volumeMl: -1 }], output: [] },
      expectCode: "invalid_volume"
    },
    {
      spec: { kind: "io_record", intake: [{ label: "IV", volumeMl: 5e4 }], output: [] },
      expectCode: "volume_out_of_range"
    },
    {
      spec: { kind: "io_record", intake: [{ label: "", volumeMl: 100 }], output: [] },
      expectCode: "entry_label_missing"
    },
    { spec: { kind: "mar", intake: [], output: [] }, expectCode: "invalid_kind" },
    { spec: { kind: "io_record", intake: null, output: [] }, expectCode: "intake_invalid" },
    {
      spec: { kind: "io_record", intake: [{ label: "PO", volumeMl: 100 }], output: [], caption: { en: "" } },
      expectCode: "caption_en_required"
    },
    {
      spec: { kind: "io_record", intake: [{ label: "PO", volumeMl: 100 }], output: [], caption: { en: "x", zh: "" } },
      expectCode: "caption_zh_empty"
    },
    {
      spec: { kind: "io_record", intake: [{ label: "PO", volumeMl: 100 }], output: [], periodLabel: { en: "" } },
      expectCode: "period_label_en_required"
    },
    {
      spec: { kind: "io_record", intake: [{ label: "PO", volumeMl: 100 }], output: [], periodLabel: { en: "x", zh: "" } },
      expectCode: "period_label_zh_empty"
    }
  ]
};
var ioRecordModule = {
  kind: "io_record",
  allowedItemTypes: ["multiple_choice", "select_all", "matrix", "fill_in_blank"],
  validate: validateIoRecord,
  selfCheck: selfCheckIoRecord,
  renderSvg: renderIoRecordSvg,
  fixtures: fixtures6
};
registerVisual(ioRecordModule);

// src/visuals/kinds/medication_label/index.ts
var AMOUNT_UNITS = /* @__PURE__ */ new Set(["mg", "mcg", "g", "units", "mEq", "mmol"]);
var PER_UNITS = /* @__PURE__ */ new Set(["mL", "tablet", "capsule"]);
var MAX_AMOUNT = 1e6;
var MAX_PER_QTY = 5e3;
var KEYED_DERIVATIONS = [
  "concentration_per_ml",
  "volume_to_administer_ml",
  "quantity_to_administer_tablets",
  "quantity_to_administer_capsules",
  "rate_ml_per_hr"
];
var isRecord7 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var nonEmptyString7 = (value) => typeof value === "string" && value.trim().length > 0;
var isPositiveFinite = (value) => typeof value === "number" && Number.isFinite(value) && value > 0;
var validateMedicationLabel = (spec) => {
  const errors = [];
  const value = spec;
  if (value.kind !== "medication_label") {
    return [{ path: "kind", code: "invalid_kind", message: "must be 'medication_label'" }];
  }
  if (!nonEmptyString7(value.drugName)) {
    errors.push({ path: "drugName", code: "drug_name_missing", message: "must be a non-empty string" });
  }
  if (!isPositiveFinite(value.amount)) {
    errors.push({ path: "amount", code: "invalid_amount", message: "must be a finite positive number" });
  } else if (value.amount > MAX_AMOUNT) {
    errors.push({ path: "amount", code: "amount_out_of_range", message: `must be no greater than ${MAX_AMOUNT}` });
  }
  if (typeof value.amountUnit !== "string" || !AMOUNT_UNITS.has(value.amountUnit)) {
    errors.push({ path: "amountUnit", code: "invalid_amount_unit", message: "must be a supported medication amount unit" });
  }
  if (!isPositiveFinite(value.perQty)) {
    errors.push({ path: "perQty", code: "invalid_per_qty", message: "must be a finite positive number" });
  } else if (value.perQty > MAX_PER_QTY) {
    errors.push({ path: "perQty", code: "per_qty_out_of_range", message: `must be no greater than ${MAX_PER_QTY}` });
  }
  if (typeof value.perUnit !== "string" || !PER_UNITS.has(value.perUnit)) {
    errors.push({ path: "perUnit", code: "invalid_per_unit", message: "must be 'mL', 'tablet', or 'capsule'" });
  }
  if (value.showDerivedConcentration !== void 0 && (typeof value.showDerivedConcentration !== "boolean" || value.showDerivedConcentration === true && value.perUnit !== "mL")) {
    errors.push({
      path: "showDerivedConcentration",
      code: "invalid_show_concentration",
      message: "must be boolean and may be true only when perUnit is 'mL'"
    });
  }
  if (value.fields !== void 0) {
    if (!Array.isArray(value.fields)) {
      errors.push({ path: "fields", code: "extra_field_invalid", message: "must be an array" });
    } else {
      value.fields.forEach((field, index) => {
        if (!isRecord7(field) || !nonEmptyString7(field.label) || !nonEmptyString7(field.value)) {
          errors.push({
            path: `fields[${index}]`,
            code: "extra_field_invalid",
            message: "must contain non-empty label and value strings"
          });
        }
      });
    }
  }
  if (value.caption !== void 0) {
    if (!isRecord7(value.caption) || !nonEmptyString7(value.caption.en)) {
      errors.push({ path: "caption.en", code: "caption_en_required", message: "is required when caption is present" });
    } else if (value.caption.zh !== void 0 && !nonEmptyString7(value.caption.zh)) {
      errors.push({ path: "caption.zh", code: "caption_zh_empty", message: "must be non-empty when present" });
    }
  }
  return errors;
};
var derivationSupported = (key, perUnit, orderKind) => {
  switch (key) {
    case "concentration_per_ml":
      return perUnit === "mL";
    case "volume_to_administer_ml":
      return perUnit === "mL" && orderKind === "dose";
    case "quantity_to_administer_tablets":
      return perUnit === "tablet" && orderKind === "dose";
    case "quantity_to_administer_capsules":
      return perUnit === "capsule" && orderKind === "dose";
    case "rate_ml_per_hr":
      return perUnit === "mL" && orderKind === "dose_rate";
  }
};
var selfCheckMedicationLabel = (spec, question) => {
  const value = spec;
  if (value.kind !== "medication_label") return [];
  const errors = [];
  if (!isPositiveFinite(value.amount) || !isPositiveFinite(value.perQty)) {
    errors.push({
      path: "amount",
      code: "self_check_invalid_strength",
      message: "amount and perQty must be finite positive numbers"
    });
    return errors;
  }
  const meta = isRecord7(question) && isRecord7(question.meta) ? question.meta : null;
  if (meta === null) return errors;
  if (!nonEmptyString7(meta.visual_justification)) {
    errors.push({
      path: "meta.visual_justification",
      code: "self_check_missing_justification",
      message: "must be present and non-empty"
    });
  }
  const keyed = isRecord7(meta.derived_values_keyed) ? meta.derived_values_keyed : null;
  const presentKeys = keyed === null ? [] : KEYED_DERIVATIONS.filter((key) => Object.prototype.hasOwnProperty.call(keyed, key));
  if (presentKeys.length === 0) {
    errors.push({
      path: "meta.derived_values_keyed",
      code: "self_check_no_keyed_values",
      message: "must declare at least one supported medication-label derivation"
    });
    return errors;
  }
  const order = isRecord7(meta.order) ? meta.order : null;
  const needsOrder = presentKeys.some((key) => key !== "concentration_per_ml");
  const orderValid = order !== null && (order.kind === "dose" || order.kind === "dose_rate") && isPositiveFinite(order.value) && order.unit === value.amountUnit && (order.round === void 0 || order.round === 0 || order.round === 1 || order.round === 2);
  if (needsOrder && !orderValid) {
    errors.push({
      path: "meta.order",
      code: "self_check_order_invalid",
      message: "must declare a positive same-unit dose or dose_rate order with round 0, 1, or 2"
    });
  }
  const roundPlaces = order !== null && (order.round === 0 || order.round === 1 || order.round === 2) ? order.round : 1;
  const concentration = value.amount / value.perQty;
  for (const key of presentKeys) {
    const orderKind = order?.kind;
    if (!derivationSupported(key, value.perUnit, orderKind)) {
      errors.push({
        path: `meta.derived_values_keyed.${key}`,
        code: "self_check_derivation_unsupported",
        message: `cannot derive ${key} from perUnit '${String(value.perUnit)}' and order kind '${String(orderKind)}'`
      });
      continue;
    }
    if (key !== "concentration_per_ml" && !orderValid) continue;
    const computed = key === "concentration_per_ml" ? concentration : order.value / concentration;
    const rounded = roundTo(computed, roundPlaces);
    if (keyed?.[key] !== rounded) {
      errors.push({
        path: `meta.derived_values_keyed.${key}`,
        code: "self_check_value_mismatch",
        message: `declared ${String(keyed?.[key])} does not match computed ${fmtNum(rounded)}`
      });
    }
  }
  return errors;
};
var panelInputFor = (spec) => {
  const fields = [
    { label: "Amount", value: `${fmtNum(spec.amount)} ${spec.amountUnit}` },
    {
      label: spec.perUnit === "mL" ? "Volume" : "Per unit",
      value: `${fmtNum(spec.perQty)} ${spec.perUnit}`
    }
  ];
  if (spec.showDerivedConcentration === true && spec.perUnit === "mL") {
    fields.push({
      label: "Concentration",
      value: `${fmtNum(spec.amount / spec.perQty)} ${spec.amountUnit}/mL`
    });
  }
  if (Array.isArray(spec.fields)) {
    fields.push(...spec.fields.map((field) => ({ label: field.label, value: field.value })));
  }
  return {
    title: spec.drugName,
    sections: [{ fields }],
    variant: "label",
    width: 360
  };
};
var renderMedicationLabelSvg = (spec) => {
  const input = panelInputFor(spec);
  const height = measureFieldPanel(input);
  const ariaLabel = escapeXml(spec.caption?.en ?? spec.drugName);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 ${fmt(height)}" role="img" aria-label="${ariaLabel}" data-kind="medication_label">
${renderFieldPanel(input)}
</svg>`;
};
var fixtures7 = {
  valid: [
    {
      kind: "medication_label",
      drugName: "Heparin Sodium",
      amount: 25e3,
      amountUnit: "units",
      perQty: 250,
      perUnit: "mL",
      showDerivedConcentration: false,
      fields: [{ label: "Diluent", value: "D5W" }],
      caption: { en: "Heparin premix label", zh: "\u809D\u7D20\u9884\u6DF7\u6DB2\u6807\u7B7E" }
    },
    {
      kind: "medication_label",
      drugName: "Digoxin",
      amount: 0.5,
      amountUnit: "mg",
      perQty: 2,
      perUnit: "mL"
    },
    {
      kind: "medication_label",
      drugName: "Levothyroxine",
      amount: 0.05,
      amountUnit: "mg",
      perQty: 1,
      perUnit: "tablet"
    }
  ],
  invalid: [
    { spec: { kind: "mar" }, expectCode: "invalid_kind" },
    { spec: { kind: "medication_label", drugName: "", amount: 1, amountUnit: "mg", perQty: 1, perUnit: "mL" }, expectCode: "drug_name_missing" },
    { spec: { kind: "medication_label", drugName: "X", amount: 0, amountUnit: "mg", perQty: 1, perUnit: "mL" }, expectCode: "invalid_amount" },
    { spec: { kind: "medication_label", drugName: "X", amount: 1, amountUnit: "mL", perQty: 1, perUnit: "mL" }, expectCode: "invalid_amount_unit" },
    { spec: { kind: "medication_label", drugName: "X", amount: 1, amountUnit: "mg", perQty: -1, perUnit: "mL" }, expectCode: "invalid_per_qty" },
    { spec: { kind: "medication_label", drugName: "X", amount: 1, amountUnit: "mg", perQty: 1, perUnit: "vial" }, expectCode: "invalid_per_unit" },
    { spec: { kind: "medication_label", drugName: "X", amount: 9999999, amountUnit: "units", perQty: 1, perUnit: "mL" }, expectCode: "amount_out_of_range" },
    { spec: { kind: "medication_label", drugName: "X", amount: 1, amountUnit: "mg", perQty: 1, perUnit: "tablet", showDerivedConcentration: true }, expectCode: "invalid_show_concentration" },
    { spec: { kind: "medication_label", drugName: "X", amount: 1, amountUnit: "mg", perQty: 1, perUnit: "mL", fields: [{ label: "", value: "x" }] }, expectCode: "extra_field_invalid" },
    { spec: { kind: "medication_label", drugName: "X", amount: 1, amountUnit: "mg", perQty: 1, perUnit: "mL", caption: { en: "" } }, expectCode: "caption_en_required" },
    { spec: { kind: "medication_label", drugName: "X", amount: 1, amountUnit: "mg", perQty: 1, perUnit: "mL", caption: { en: "x", zh: "" } }, expectCode: "caption_zh_empty" }
  ]
};
var medicationLabelModule = {
  kind: "medication_label",
  allowedItemTypes: ["multiple_choice", "select_all", "matrix", "fill_in_blank"],
  validate: validateMedicationLabel,
  selfCheck: selfCheckMedicationLabel,
  renderSvg: renderMedicationLabelSvg,
  fixtures: fixtures7
};
registerVisual(medicationLabelModule);

// src/visuals/kinds/device_screen/index.ts
var DEVICES = /* @__PURE__ */ new Set(["pca", "infusion", "enteral"]);
var SETTING_KEYS = /* @__PURE__ */ new Set([
  "drug",
  "concentration",
  "mode",
  "demand_dose",
  "lockout_min",
  "basal_rate",
  "limit_1h",
  "limit_4h",
  "attempts",
  "delivered",
  "rate_ml_hr",
  "vtbi_ml",
  "volume_infused_ml",
  "duration_min"
]);
var TEXT_SETTING_KEYS = /* @__PURE__ */ new Set(["drug", "mode", "concentration"]);
var DERIVATION_KEYS = [
  "max_demands_1h",
  "max_dose_1h_mg",
  "delivered_dose_total_mg",
  "infusion_volume_ml",
  "infusion_duration_min"
];
var MAX_SETTING = 1e5;
var LABELS = {
  drug: "Drug",
  concentration: "Concentration",
  mode: "Mode",
  demand_dose: "Dose",
  lockout_min: "Lockout",
  basal_rate: "Basal",
  limit_1h: "1 hr limit",
  limit_4h: "4 hr limit",
  attempts: "Attempts",
  delivered: "Delivered",
  rate_ml_hr: "Rate",
  vtbi_ml: "VTBI",
  volume_infused_ml: "Volume infused",
  duration_min: "Duration"
};
var DEFAULT_TITLES = {
  pca: "PCA Pump",
  infusion: "Infusion Pump",
  enteral: "Feeding Pump"
};
var isRecord8 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var nonEmptyString8 = (value) => typeof value === "string" && value.trim().length > 0;
var isNonNegativeFinite = (value) => typeof value === "number" && Number.isFinite(value) && value >= 0;
var validateTextPair2 = (value, path) => {
  if (!isRecord8(value) || !nonEmptyString8(value.en)) {
    return [{
      path: `${path}.en`,
      code: path === "title" ? "title_en_required" : "caption_en_required",
      message: "is required when present"
    }];
  }
  if (value.zh !== void 0 && !nonEmptyString8(value.zh)) {
    return [{
      path: `${path}.zh`,
      code: path === "title" ? "title_zh_empty" : "caption_zh_empty",
      message: "must be non-empty when present"
    }];
  }
  return [];
};
var validateDeviceScreen = (spec) => {
  const value = spec;
  if (value.kind !== "device_screen") {
    return [{ path: "kind", code: "invalid_kind", message: "must be 'device_screen'" }];
  }
  const errors = [];
  if (typeof value.device !== "string" || !DEVICES.has(value.device)) {
    errors.push({
      path: "device",
      code: "invalid_device",
      message: "must be 'pca', 'infusion', or 'enteral'"
    });
  }
  if (!Array.isArray(value.settings) || value.settings.length === 0) {
    errors.push({
      path: "settings",
      code: "settings_empty",
      message: "must be a non-empty array"
    });
  } else {
    const seen = /* @__PURE__ */ new Set();
    value.settings.forEach((setting, index) => {
      if (!isRecord8(setting) || typeof setting.key !== "string" || !SETTING_KEYS.has(setting.key)) {
        errors.push({
          path: `settings[${index}].key`,
          code: "invalid_setting_key",
          message: "must be a recognized device setting key"
        });
        return;
      }
      if (seen.has(setting.key)) {
        errors.push({
          path: `settings[${index}].key`,
          code: "duplicate_setting",
          message: "must not repeat a setting key"
        });
      }
      seen.add(setting.key);
      const key = setting.key;
      if (TEXT_SETTING_KEYS.has(key)) {
        if (!nonEmptyString8(setting.text) || setting.value !== void 0) {
          errors.push({
            path: `settings[${index}]`,
            code: "setting_value_invalid",
            message: "text settings require non-empty text and no numeric value"
          });
        }
      } else if (!isNonNegativeFinite(setting.value)) {
        errors.push({
          path: `settings[${index}].value`,
          code: "setting_value_invalid",
          message: "must be a finite non-negative number"
        });
      } else if (setting.value > MAX_SETTING) {
        errors.push({
          path: `settings[${index}].value`,
          code: "setting_out_of_range",
          message: `must be no greater than ${MAX_SETTING}`
        });
      }
      if (setting.flag !== void 0 && typeof setting.flag !== "boolean") {
        errors.push({
          path: `settings[${index}].flag`,
          code: "invalid_flag",
          message: "must be boolean when present"
        });
      }
    });
  }
  if (value.title !== void 0) errors.push(...validateTextPair2(value.title, "title"));
  if (value.caption !== void 0) errors.push(...validateTextPair2(value.caption, "caption"));
  return errors;
};
var structuralSettings = (value) => {
  if (!Array.isArray(value) || value.length === 0) return null;
  const settings = [];
  for (const setting of value) {
    if (!isRecord8(setting) || typeof setting.key !== "string") return null;
    settings.push(setting);
  }
  return settings;
};
var numericSetting = (settings, key, positive = false) => {
  const value = settings.get(key)?.value;
  if (!isNonNegativeFinite(value) || positive && value === 0) return null;
  return value;
};
var includesBasal = (settings) => {
  const mode = settings.get("mode")?.text;
  return typeof mode === "string" && mode.toLowerCase().includes("basal");
};
var computeDerivation = (key, device, settings, meta) => {
  if (key === "max_demands_1h") {
    if (device !== "pca") return null;
    const lockout = numericSetting(settings, "lockout_min", true);
    return lockout === null ? null : Math.floor(60 / lockout);
  }
  if (key === "max_dose_1h_mg") {
    if (device !== "pca") return null;
    const lockout = numericSetting(settings, "lockout_min", true);
    const demandDose = numericSetting(settings, "demand_dose");
    if (lockout === null || demandDose === null) return null;
    const basalRate = includesBasal(settings) ? numericSetting(settings, "basal_rate") : 0;
    if (basalRate === null) return null;
    return Math.floor(60 / lockout) * demandDose + basalRate;
  }
  if (key === "delivered_dose_total_mg") {
    if (device !== "pca") return null;
    const delivered = numericSetting(settings, "delivered");
    const demandDose = numericSetting(settings, "demand_dose");
    if (delivered === null || demandDose === null) return null;
    let total = delivered * demandDose;
    if (includesBasal(settings)) {
      const basalRate = numericSetting(settings, "basal_rate");
      if (basalRate === null || !isNonNegativeFinite(meta.shift_hours)) return null;
      total += basalRate * meta.shift_hours;
    }
    return total;
  }
  if (device !== "infusion" && device !== "enteral") return null;
  const rate = numericSetting(settings, "rate_ml_hr", true);
  if (rate === null) return null;
  if (key === "infusion_volume_ml") {
    const duration = numericSetting(settings, "duration_min");
    return duration === null ? null : rate * duration / 60;
  }
  const vtbi = numericSetting(settings, "vtbi_ml");
  return vtbi === null ? null : vtbi / rate * 60;
};
var selfCheckDeviceScreen = (spec, question) => {
  const value = spec;
  const settingsList = structuralSettings(value.settings);
  if (value.kind !== "device_screen" || settingsList === null) return [];
  const errors = [];
  const meta = isRecord8(question) && isRecord8(question.meta) ? question.meta : {};
  if (!nonEmptyString8(meta.visual_justification)) {
    errors.push({
      path: "meta.visual_justification",
      code: "self_check_missing_justification",
      message: "must be present and non-empty"
    });
  }
  const keyedSettings = Array.isArray(meta.keyed_settings) ? meta.keyed_settings : [];
  const keyed = isRecord8(meta.derived_values_keyed) ? meta.derived_values_keyed : null;
  const presentDerivations = keyed === null ? [] : DERIVATION_KEYS.filter((key) => Object.prototype.hasOwnProperty.call(keyed, key));
  if (keyedSettings.length === 0 && presentDerivations.length === 0) {
    errors.push({
      path: "meta",
      code: "self_check_no_keyed_cue",
      message: "must declare at least one keyed setting or supported derived value"
    });
  }
  const settings = new Map(settingsList.map((setting) => [String(setting.key), setting]));
  keyedSettings.forEach((entry, index) => {
    const key = isRecord8(entry) ? entry.key : void 0;
    if (typeof key !== "string" || !settings.has(key)) {
      errors.push({
        path: `meta.keyed_settings[${index}].key`,
        code: "self_check_keyed_setting_absent",
        message: "must resolve to a setting present on the screen"
      });
    }
  });
  settingsList.forEach((setting, index) => {
    const key = typeof setting.key === "string" ? setting.key : null;
    if (key !== null && !TEXT_SETTING_KEYS.has(key) && !isNonNegativeFinite(setting.value)) {
      errors.push({
        path: `settings[${index}].value`,
        code: "self_check_invalid_setting",
        message: "must be a finite non-negative number"
      });
    }
  });
  const roundPlaces = meta.round === 0 || meta.round === 1 || meta.round === 2 ? meta.round : 0;
  for (const key of presentDerivations) {
    const computed = computeDerivation(key, value.device, settings, meta);
    if (computed === null) {
      errors.push({
        path: `meta.derived_values_keyed.${key}`,
        code: "self_check_derivation_unsupported",
        message: `cannot derive ${key} from the declared device settings`
      });
      continue;
    }
    const rounded = roundTo(computed, roundPlaces);
    if (keyed?.[key] !== rounded) {
      errors.push({
        path: `meta.derived_values_keyed.${key}`,
        code: "self_check_value_mismatch",
        message: `declared ${String(keyed?.[key])} does not match computed ${fmtNum(rounded)}`
      });
    }
  }
  return errors;
};
var panelInputFor2 = (spec) => {
  const defaultTitle = DEFAULT_TITLES[spec.device] ?? "Device Screen";
  const settings = Array.isArray(spec.settings) ? spec.settings : [];
  return {
    title: spec.title?.en ?? defaultTitle,
    sections: [{
      fields: settings.map((setting) => ({
        label: LABELS[setting.key] ?? setting.key,
        value: TEXT_SETTING_KEYS.has(setting.key) ? setting.text ?? "" : `${fmtNum(setting.value ?? 0)}${setting.unit ? ` ${setting.unit}` : ""}`,
        emphasis: setting.flag ? "flag" : "normal"
      }))
    }],
    variant: "screen",
    width: 360
  };
};
var renderDeviceScreenSvg = (spec) => {
  const input = panelInputFor2(spec);
  const height = measureFieldPanel(input);
  const defaultTitle = DEFAULT_TITLES[spec.device] ?? "Device Screen";
  const ariaLabel = escapeXml(spec.caption?.en ?? spec.title?.en ?? defaultTitle);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 ${fmt(height)}" role="img" aria-label="${ariaLabel}" data-kind="device_screen">
${renderFieldPanel(input)}
</svg>`;
};
var fixtures8 = {
  valid: [
    {
      kind: "device_screen",
      device: "pca",
      title: { en: "PCA Pump - morphine", zh: "PCA \u6CF5 - \u5417\u5561" },
      settings: [
        { key: "drug", text: "morphine" },
        { key: "concentration", text: "1 mg/mL" },
        { key: "mode", text: "PCA+basal" },
        { key: "demand_dose", value: 1, unit: "mg" },
        { key: "lockout_min", value: 8, unit: "min" },
        { key: "basal_rate", value: 1, unit: "mg/hr", flag: true },
        { key: "limit_4h", value: 20, unit: "mg" },
        { key: "attempts", value: 14 },
        { key: "delivered", value: 9 }
      ]
    },
    {
      kind: "device_screen",
      device: "pca",
      settings: [
        { key: "mode", text: "PCA" },
        { key: "demand_dose", value: 1, unit: "mg" },
        { key: "lockout_min", value: 10, unit: "min" }
      ]
    },
    {
      kind: "device_screen",
      device: "infusion",
      settings: [
        { key: "rate_ml_hr", value: 125, unit: "mL/hr" },
        { key: "duration_min", value: 90, unit: "min" }
      ],
      caption: { en: "Infusion pump settings", zh: "\u8F93\u6DB2\u6CF5\u8BBE\u7F6E" }
    }
  ],
  invalid: [
    { spec: { kind: "mar" }, expectCode: "invalid_kind" },
    { spec: { kind: "device_screen", device: "ventilator", settings: [{ key: "rate_ml_hr", value: 1 }] }, expectCode: "invalid_device" },
    { spec: { kind: "device_screen", device: "pca", settings: [] }, expectCode: "settings_empty" },
    { spec: { kind: "device_screen", device: "pca", settings: [{ key: "tidal_volume", value: 500 }] }, expectCode: "invalid_setting_key" },
    { spec: { kind: "device_screen", device: "pca", settings: [{ key: "lockout_min", value: 8 }, { key: "lockout_min", value: 10 }] }, expectCode: "duplicate_setting" },
    { spec: { kind: "device_screen", device: "pca", settings: [{ key: "demand_dose", text: "1 mg" }] }, expectCode: "setting_value_invalid" },
    { spec: { kind: "device_screen", device: "infusion", settings: [{ key: "rate_ml_hr", value: 999999 }] }, expectCode: "setting_out_of_range" },
    { spec: { kind: "device_screen", device: "pca", settings: [{ key: "mode", text: "PCA" }], caption: { en: "" } }, expectCode: "caption_en_required" },
    { spec: { kind: "device_screen", device: "pca", settings: [{ key: "mode", text: "PCA" }], caption: { en: "PCA settings", zh: "" } }, expectCode: "caption_zh_empty" }
  ]
};
var deviceScreenModule = {
  kind: "device_screen",
  allowedItemTypes: ["multiple_choice", "select_all", "matrix", "fill_in_blank"],
  validate: validateDeviceScreen,
  selfCheck: selfCheckDeviceScreen,
  renderSvg: renderDeviceScreenSvg,
  fixtures: fixtures8
};
registerVisual(deviceScreenModule);

// src/visuals/kinds/burn_map/regions.ts
var TBSA_PCT = {
  adult: {
    head_anterior: 4.5,
    head_posterior: 4.5,
    trunk_anterior: 18,
    trunk_posterior: 18,
    arm_l_anterior: 4.5,
    arm_l_posterior: 4.5,
    arm_r_anterior: 4.5,
    arm_r_posterior: 4.5,
    leg_l_anterior: 9,
    leg_l_posterior: 9,
    leg_r_anterior: 9,
    leg_r_posterior: 9,
    genitalia: 1
  },
  pediatric: {
    head_anterior: 9,
    head_posterior: 9,
    trunk_anterior: 18,
    trunk_posterior: 18,
    arm_l_anterior: 4.5,
    arm_l_posterior: 4.5,
    arm_r_anterior: 4.5,
    arm_r_posterior: 4.5,
    leg_l_anterior: 6.75,
    leg_l_posterior: 6.75,
    leg_r_anterior: 6.75,
    leg_r_posterior: 6.75,
    genitalia: 1
  }
};
var BURN_REGION_KEYS = Object.keys(TBSA_PCT.adult);
var REGION_GEOMETRY = {
  head_anterior: {
    view: "anterior",
    d: "M 240,145 Q 237,135 231,125 Q 222,105 219,85 C 217,35 283,35 281,85 Q 278,105 269,125 Q 263,135 260,145 Z"
  },
  head_posterior: {
    view: "posterior",
    d: "M 590,145 Q 587,135 581,125 Q 572,105 569,85 C 567,35 633,35 631,85 Q 628,105 619,125 Q 613,135 610,145 Z"
  },
  trunk_anterior: {
    view: "anterior",
    d: "M 235,145 Q 215,145 180,155 L 190,180 L 200,310 L 235,320 Q 250,310 265,320 L 300,310 L 310,180 L 320,155 Q 285,145 265,145 Z"
  },
  trunk_posterior: {
    view: "posterior",
    d: "M 585,145 Q 565,145 530,155 L 540,180 L 550,310 Q 550,360 600,350 Q 650,360 650,310 L 660,180 L 670,155 Q 635,145 615,145 Z"
  },
  arm_l_anterior: {
    view: "anterior",
    d: "M 310,180 L 360,260 L 370,300 L 375,330 Q 385,340 393,325 L 390,310 L 397,312 Q 400,305 395,298 L 385,290 Q 370,220 320,155 L 310,180 Z"
  },
  arm_l_posterior: {
    view: "posterior",
    d: "M 540,180 L 490,260 L 480,300 L 475,330 Q 465,340 457,325 L 460,310 L 453,312 Q 450,305 455,298 L 465,290 Q 480,220 530,155 L 540,180 Z"
  },
  arm_r_anterior: {
    view: "anterior",
    d: "M 190,180 L 140,260 L 130,300 L 125,330 Q 115,340 107,325 L 110,310 L 103,312 Q 100,305 105,298 L 115,290 Q 130,220 180,155 L 190,180 Z"
  },
  arm_r_posterior: {
    view: "posterior",
    d: "M 660,180 L 710,260 L 720,300 L 725,330 Q 735,340 743,325 L 740,310 L 747,312 Q 750,305 745,298 L 735,290 Q 720,220 670,155 L 660,180 Z"
  },
  leg_l_anterior: {
    view: "anterior",
    d: "M 265,320 L 300,310 L 295,440 L 285,550 L 295,580 Q 280,585 265,580 L 265,550 L 260,440 L 250,360 Q 260,350 265,320 Z"
  },
  leg_l_posterior: {
    view: "posterior",
    d: "M 550,310 Q 550,360 600,350 L 590,440 L 585,550 L 595,580 Q 580,585 565,580 L 565,550 L 555,440 Z"
  },
  leg_r_anterior: {
    view: "anterior",
    d: "M 200,310 L 235,320 Q 240,350 250,360 L 240,440 L 235,550 L 235,580 Q 220,585 205,580 L 215,550 L 205,440 Z"
  },
  leg_r_posterior: {
    view: "posterior",
    d: "M 600,350 Q 650,360 650,310 L 645,440 L 635,550 L 635,580 Q 620,585 605,580 L 615,550 L 610,440 Z"
  },
  genitalia: {
    view: "anterior",
    d: "M 235,320 Q 250,310 265,320 Q 260,350 250,360 Q 240,350 235,320 Z"
  }
};
var BODY_INK = {
  anterior: '<path d="M 230,125 Q 250,140 270,125" fill="none" stroke="#64748b" opacity="0.4"/><path d="M 216,157 Q 232,164 246,166 M 254,166 Q 268,164 284,157" opacity="0.34"/>',
  posterior: '<path d="M 600,170 L 600,310" opacity="0.25"/><path d="M 550,310 Q 600,330 650,310" opacity="0.45"/><path d="M 600,320 L 600,350" opacity="0.5"/>'
};
var renderRegionShape = (key, attributes) => `<path data-region="${key}" d="${REGION_GEOMETRY[key].d}" ${attributes}/>`;

// src/visuals/kinds/burn_map/index.ts
var POPULATIONS2 = /* @__PURE__ */ new Set(["adult", "pediatric"]);
var REGION_KEYS = new Set(BURN_REGION_KEYS);
var KEYED_DERIVATIONS2 = [
  "tbsa_pct",
  "parkland_total_ml",
  "parkland_first8h_ml",
  "parkland_rate_first8h_ml_hr"
];
var isRecord9 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var nonEmptyString9 = (value) => typeof value === "string" && value.trim().length > 0;
var isPositiveFinite2 = (value) => typeof value === "number" && Number.isFinite(value) && value > 0;
var isBurnRegion = (value) => typeof value === "string" && REGION_KEYS.has(value);
var validateBurnMap = (spec) => {
  const value = spec;
  if (value.kind !== "burn_map") {
    return [{ path: "kind", code: "invalid_kind", message: "must be 'burn_map'" }];
  }
  const errors = [];
  if (value.population !== void 0 && !POPULATIONS2.has(value.population)) {
    errors.push({
      path: "population",
      code: "invalid_population",
      message: "must be 'adult' or 'pediatric'"
    });
  }
  if (!Array.isArray(value.burns) || value.burns.length === 0) {
    errors.push({ path: "burns", code: "burns_empty", message: "must be a non-empty array" });
  } else {
    const seen = /* @__PURE__ */ new Set();
    value.burns.forEach((region, index) => {
      if (!isBurnRegion(region)) {
        errors.push({
          path: `burns[${index}]`,
          code: "invalid_region",
          message: "must be a supported whole burn region"
        });
        return;
      }
      if (seen.has(region)) {
        errors.push({
          path: `burns[${index}]`,
          code: "duplicate_region",
          message: "must not repeat a burn region"
        });
      }
      seen.add(region);
    });
  }
  if (value.caption !== void 0) {
    if (!isRecord9(value.caption) || !nonEmptyString9(value.caption.en)) {
      errors.push({
        path: "caption.en",
        code: "caption_en_required",
        message: "is required when caption is present"
      });
    } else if (value.caption.zh !== void 0 && !nonEmptyString9(value.caption.zh)) {
      errors.push({
        path: "caption.zh",
        code: "caption_zh_empty",
        message: "must be non-empty when present"
      });
    }
  }
  return errors;
};
var structuralBurns = (value) => {
  if (!Array.isArray(value) || value.length === 0) return null;
  const burns = [];
  const seen = /* @__PURE__ */ new Set();
  for (const region of value) {
    if (!isBurnRegion(region) || seen.has(region)) return null;
    burns.push(region);
    seen.add(region);
  }
  return burns;
};
var deriveValues = (population, burns, weightKg, roundPlaces) => {
  const tbsa = burns.reduce((sum, region) => sum + TBSA_PCT[population][region], 0);
  const values = {
    tbsa_pct: roundTo(tbsa, roundPlaces)
  };
  if (weightKg !== null) {
    const total = 4 * weightKg * tbsa;
    values.parkland_total_ml = roundTo(total, roundPlaces);
    values.parkland_first8h_ml = roundTo(total / 2, roundPlaces);
    values.parkland_rate_first8h_ml_hr = roundTo(total / 2 / 8, roundPlaces);
  }
  return values;
};
var selfCheckBurnMap = (spec, question) => {
  const value = spec;
  if (value.kind !== "burn_map") return [];
  const errors = [];
  const burns = structuralBurns(value.burns);
  const population = value.population === void 0 ? "adult" : value.population;
  if (burns === null || !POPULATIONS2.has(population)) {
    errors.push({
      path: "burns",
      code: "self_check_invalid_burns",
      message: "must contain unique supported whole regions"
    });
    return errors;
  }
  const meta = isRecord9(question) && isRecord9(question.meta) ? question.meta : null;
  if (meta === null || !nonEmptyString9(meta.visual_justification)) {
    errors.push({
      path: "meta.visual_justification",
      code: "self_check_missing_justification",
      message: "must be present and non-empty"
    });
  }
  const keyed = meta !== null && isRecord9(meta.derived_values_keyed) ? meta.derived_values_keyed : null;
  const presentKeys = keyed === null ? [] : KEYED_DERIVATIONS2.filter((key) => Object.prototype.hasOwnProperty.call(keyed, key));
  if (presentKeys.length === 0) {
    errors.push({
      path: "meta.derived_values_keyed",
      code: "self_check_no_keyed_values",
      message: "must declare at least one supported burn-map derivation"
    });
  }
  const needsWeight = presentKeys.some((key) => key !== "tbsa_pct");
  const weightKg = meta !== null && isPositiveFinite2(meta.weight_kg) ? meta.weight_kg : null;
  if (needsWeight && weightKg === null) {
    errors.push({
      path: "meta.weight_kg",
      code: "self_check_weight_missing",
      message: "must be a finite positive number for Parkland derivations"
    });
  }
  const roundPlaces = meta !== null && (meta.round === 0 || meta.round === 1 || meta.round === 2) ? meta.round : 0;
  const computed = deriveValues(
    population,
    burns,
    weightKg,
    roundPlaces
  );
  for (const key of presentKeys) {
    const expected = computed[key];
    if (expected === void 0) continue;
    if (keyed?.[key] !== expected) {
      errors.push({
        path: `meta.derived_values_keyed.${key}`,
        code: "self_check_value_mismatch",
        message: `declared ${String(keyed?.[key])} does not match computed ${fmtNum(expected)}`
      });
    }
  }
  if (isRecord9(question) && question.itemType === "fill_in_blank" && Array.isArray(question.blanks)) {
    const presentDerivedValues = presentKeys.map((key) => computed[key]).filter((derived) => derived !== void 0);
    question.blanks.forEach((blank, index) => {
      if (!isRecord9(blank) || !isRecord9(blank.numeric) || typeof blank.numeric.value !== "number") return;
      const blankValue = blank.numeric.value;
      if (!presentDerivedValues.includes(blankValue)) {
        errors.push({
          path: `blanks[${index}].numeric.value`,
          code: "self_check_answer_value_mismatch",
          message: `numeric answer ${fmtNum(blankValue)} does not match any present computed derived value`
        });
      }
    });
  }
  return errors;
};
var regionAttributes = (burned) => burned ? 'fill="#dc2626" fill-opacity="0.55"' : 'fill="#f1f5f9"';
var renderBurnMapSvg = (spec) => {
  const population = spec.population ?? "adult";
  const burned = new Set(Array.isArray(spec.burns) ? spec.burns : []);
  const fills = BURN_REGION_KEYS.filter((key) => REGION_GEOMETRY[key] !== void 0).map((key) => renderRegionShape(key, regionAttributes(burned.has(key)))).join("\n");
  const outlines = BURN_REGION_KEYS.filter((key) => REGION_GEOMETRY[key] !== void 0).map((key) => `<path d="${REGION_GEOMETRY[key].d}"/>`).join("");
  const clipPaths = ["anterior", "posterior"].map((view) => {
    const paths = BURN_REGION_KEYS.filter((key) => REGION_GEOMETRY[key].view === view).map((key) => `<path d="${REGION_GEOMETRY[key].d}"/>`).join("");
    return `<clipPath id="burn-${view}-clip">${paths}</clipPath>`;
  }).join("");
  const ariaLabel = escapeXml(spec.caption?.en ?? "Burn diagram");
  const populationLabel = population === "pediatric" ? "Pediatric" : "Adult";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(850)} ${fmt(640)}" role="img" aria-label="${ariaLabel}" data-kind="burn_map" data-population="${population}">
<rect x="0" y="0" width="${fmt(850)}" height="${fmt(640)}" fill="#ffffff"/>
<defs>${clipPaths}</defs>
<rect x="${fmt(8)}" y="${fmt(8)}" width="${fmt(834)}" height="${fmt(624)}" fill="none" stroke="#cbd5e1" stroke-width="1.5"/>
<line x1="${fmt(425)}" y1="${fmt(8)}" x2="${fmt(425)}" y2="${fmt(632)}" stroke="#e2e8f0"/>
<text x="${fmt(20)}" y="${fmt(30)}" font-family="Georgia, serif" font-size="${fmt(16)}" font-weight="600" fill="#1e293b">Burn Surface Assessment</text>
<text x="${fmt(822)}" y="${fmt(30)}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${fmt(14)}" fill="#475569">${escapeXml(populationLabel)}</text>
<g>${fills}</g>
<g stroke="#64748b" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" fill="none">
${outlines}
<g clip-path="url(#burn-anterior-clip)">${BODY_INK.anterior}</g>
<g clip-path="url(#burn-posterior-clip)">${BODY_INK.posterior}</g>
</g>
<text x="${fmt(250)}" y="${fmt(622)}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${fmt(16)}" font-weight="700" fill="#334155">Anterior</text>
<text x="${fmt(600)}" y="${fmt(622)}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${fmt(16)}" font-weight="700" fill="#334155">Posterior</text>
</svg>`;
};
var fixtures9 = {
  valid: [
    {
      kind: "burn_map",
      population: "adult",
      burns: ["trunk_anterior", "leg_l_anterior", "leg_r_anterior"],
      caption: { en: "Burn diagram", zh: "\u70E7\u4F24\u793A\u610F\u56FE" }
    },
    {
      kind: "burn_map",
      burns: [
        "arm_l_anterior",
        "arm_l_posterior",
        "arm_r_anterior",
        "arm_r_posterior",
        "head_anterior"
      ]
    },
    {
      kind: "burn_map",
      population: "pediatric",
      burns: ["head_anterior", "head_posterior", "trunk_anterior"]
    },
    {
      kind: "burn_map",
      population: "adult",
      burns: ["genitalia"],
      caption: { en: "Burn diagram", zh: "\u70E7\u4F24\u793A\u610F\u56FE" }
    }
  ],
  invalid: [
    { spec: { kind: "mar" }, expectCode: "invalid_kind" },
    { spec: { kind: "burn_map", population: "neonate", burns: ["head_anterior"] }, expectCode: "invalid_population" },
    { spec: { kind: "burn_map", burns: [] }, expectCode: "burns_empty" },
    { spec: { kind: "burn_map", burns: ["left_foot"] }, expectCode: "invalid_region" },
    { spec: { kind: "burn_map", burns: ["trunk_anterior", "trunk_anterior"] }, expectCode: "duplicate_region" },
    { spec: { kind: "burn_map", burns: ["head_anterior"], caption: { en: "" } }, expectCode: "caption_en_required" },
    { spec: { kind: "burn_map", burns: ["head_anterior"], caption: { en: "x", zh: "" } }, expectCode: "caption_zh_empty" }
  ]
};
var burnMapModule = {
  kind: "burn_map",
  allowedItemTypes: ["multiple_choice", "select_all", "matrix", "fill_in_blank"],
  validate: validateBurnMap,
  selfCheck: selfCheckBurnMap,
  renderSvg: renderBurnMapSvg,
  fixtures: fixtures9
};
registerVisual(burnMapModule);

// src/visuals/kinds/fetal_monitoring/features.ts
var EARLY_EPS_SEC = 5;
var LATE_LAG_MIN_SEC = 10;
var LATE_LAG_MAX_SEC = 90;
var GRADUAL_MIN_SEC = 30;
var ABRUPT_MAX_SEC = 30;
var PROLONGED_MIN_SEC = 120;
var FEATURE_MIN_DEPTH_BPM = 15;
var TERM_ACCEL_MIN_RISE_BPM = 15;
var TERM_ACCEL_MIN_DURATION_SEC = 15;
var cosineBump = (timeSec, centerSec, durationSec) => {
  const halfWidth = durationSec / 2;
  const distance = Math.abs(timeSec - centerSec);
  if (distance >= halfWidth) return 0;
  return 0.5 * (1 + Math.cos(Math.PI * distance / halfWidth));
};
var accelerationOffsetAt = (timeSec, acceleration) => acceleration.riseBpm * cosineBump(timeSec, acceleration.peakSec, acceleration.durationSec);
var accelerationMorphologyIsValid = (acceleration) => acceleration.riseBpm >= TERM_ACCEL_MIN_RISE_BPM && acceleration.durationSec >= TERM_ACCEL_MIN_DURATION_SEC && acceleration.durationSec / 2 < ABRUPT_MAX_SEC;
var gradualDecelerationOffsetAt = (timeSec, deceleration) => -deceleration.depthBpm * cosineBump(timeSec, deceleration.nadirSec, deceleration.durationSec);
var variableDecelerationOffsetAt = (timeSec, deceleration) => {
  const halfWidth = deceleration.durationSec / 2;
  const distance = Math.abs(timeSec - deceleration.nadirSec);
  if (distance >= halfWidth) return 0;
  return -deceleration.depthBpm * (1 - distance / halfWidth);
};
var prolongedDecelerationOffsetAt = (timeSec, deceleration) => {
  const halfWidth = deceleration.durationSec / 2;
  const distance = Math.abs(timeSec - deceleration.nadirSec);
  if (distance >= halfWidth) return 0;
  const shoulderWidth = Math.min(30, halfWidth * 0.3);
  const flatHalfWidth = halfWidth - shoulderWidth;
  if (distance <= flatHalfWidth) return -deceleration.depthBpm;
  const shoulderProgress = (distance - flatHalfWidth) / shoulderWidth;
  return -deceleration.depthBpm * 0.5 * (1 + Math.cos(Math.PI * shoulderProgress));
};
var decelerationOffsetAt = (timeSec, deceleration) => {
  if (deceleration.type === "variable") {
    return variableDecelerationOffsetAt(timeSec, deceleration);
  }
  if (deceleration.type === "prolonged") {
    return prolongedDecelerationOffsetAt(timeSec, deceleration);
  }
  return gradualDecelerationOffsetAt(timeSec, deceleration);
};
var featureOffsetAt = (timeSec, accelerations, decelerations) => {
  const accelerationOffset = accelerations.reduce(
    (sum, acceleration) => sum + accelerationOffsetAt(timeSec, acceleration),
    0
  );
  const decelerationOffset = decelerations.reduce(
    (sum, deceleration) => sum + decelerationOffsetAt(timeSec, deceleration),
    0
  );
  return accelerationOffset + decelerationOffset;
};
var decelerationPhaseIsValid = (deceleration, contractions) => {
  const onsetToNadir = deceleration.durationSec / 2;
  if (deceleration.type === "variable") {
    return deceleration.contractionIndex === void 0 && deceleration.depthBpm >= FEATURE_MIN_DEPTH_BPM && deceleration.durationSec >= TERM_ACCEL_MIN_DURATION_SEC && deceleration.durationSec < PROLONGED_MIN_SEC && onsetToNadir < ABRUPT_MAX_SEC;
  }
  if (deceleration.type === "prolonged") {
    return deceleration.depthBpm >= FEATURE_MIN_DEPTH_BPM && deceleration.durationSec >= PROLONGED_MIN_SEC && deceleration.durationSec < 600;
  }
  const contraction = deceleration.contractionIndex === void 0 ? void 0 : contractions[deceleration.contractionIndex];
  if (!contraction || onsetToNadir < GRADUAL_MIN_SEC) return false;
  const offsetSec = deceleration.nadirSec - contraction.peakSec;
  if (deceleration.type === "early") return Math.abs(offsetSec) <= EARLY_EPS_SEC;
  return offsetSec >= LATE_LAG_MIN_SEC && offsetSec <= LATE_LAG_MAX_SEC;
};

// src/visuals/kinds/fetal_monitoring/channels.ts
var CTG_PX_PER_SEC = 1.2;
var SAMPLE_STEP_SEC = 0.5;
var DEFAULT_DURATION_SEC = 600;
var DEFAULT_CONTRACTION_AMPLITUDE_MMHG = 50;
var DEFAULT_CONTRACTION_DURATION_SEC = 60;
var UA_RESTING_TONE_MMHG = 10;
var FHR_MIN_BPM = 50;
var FHR_MAX_BPM = 220;
var UA_MIN_MMHG = 0;
var UA_MAX_MMHG = 100;
var LABEL_GUTTER = 82;
var RIGHT_PADDING = 18;
var TOP_PADDING = 18;
var BOTTOM_PADDING = 28;
var PANEL_GAP = 24;
var FHR_PANEL_HEIGHT = 238;
var UA_PANEL_HEIGHT = 150;
var VARIABILITY_PEAK_TO_TROUGH_BPM = {
  absent: 0,
  minimal: 4,
  moderate: 14,
  marked: 32
};
var normalizeFetalMonitoringSpec = (spec) => ({
  ...spec,
  durationSec: spec.durationSec ?? DEFAULT_DURATION_SEC,
  seed: spec.seed ?? 0,
  contractions: Array.isArray(spec.contractions) ? spec.contractions : [],
  accelerations: Array.isArray(spec.accelerations) ? spec.accelerations : [],
  decelerations: Array.isArray(spec.decelerations) ? spec.decelerations : []
});
var ctgSecondsToPx = (seconds) => secondsToPx(seconds) / pxPerSec * CTG_PX_PER_SEC;
var createChannelLayout = (durationSec) => {
  const plotWidth = ctgSecondsToPx(durationSec);
  const fhrTop = TOP_PADDING;
  const uaTop = fhrTop + FHR_PANEL_HEIGHT + PANEL_GAP;
  return {
    width: LABEL_GUTTER + plotWidth + RIGHT_PADDING,
    height: uaTop + UA_PANEL_HEIGHT + BOTTOM_PADDING,
    plotLeft: LABEL_GUTTER,
    plotWidth,
    fhrTop,
    fhrHeight: FHR_PANEL_HEIGHT,
    uaTop,
    uaHeight: UA_PANEL_HEIGHT
  };
};
var timeToX = (timeSec, layout) => layout.plotLeft + ctgSecondsToPx(timeSec);
var fhrToY = (fhr, layout) => layout.fhrTop + (FHR_MAX_BPM - fhr) / (FHR_MAX_BPM - FHR_MIN_BPM) * layout.fhrHeight;
var uaToY = (ua, layout) => layout.uaTop + (UA_MAX_MMHG - ua) / (UA_MAX_MMHG - UA_MIN_MMHG) * layout.uaHeight;
var clamp2 = (value, min, max) => Math.max(min, Math.min(max, value));
var buildVariabilitySeries = (durationSec, variability, seed) => {
  const sampleCount = Math.round(durationSec / SAMPLE_STEP_SEC) + 1;
  const targetRange = VARIABILITY_PEAK_TO_TROUGH_BPM[variability];
  if (targetRange === 0) return Array.from({ length: sampleCount }, () => 0);
  const rng = mulberry32(seed);
  const raw = Array.from({ length: sampleCount }, (_, index) => {
    const fast = rng() * 2 - 1;
    const slow = Math.sin(index * 0.41 + rng() * 0.3);
    return fast * 0.72 + slow * 0.28;
  });
  const min = Math.min(...raw);
  const max = Math.max(...raw);
  const midpoint = (max + min) / 2;
  const scale = targetRange / (max - min);
  return raw.map((value) => (value - midpoint) * scale);
};
var uterineActivityAt = (timeSec, contractions) => {
  const activity = contractions.reduce((sum, contraction) => {
    const amplitude = contraction.amplitudeMmHg ?? DEFAULT_CONTRACTION_AMPLITUDE_MMHG;
    const duration = contraction.durationSec ?? DEFAULT_CONTRACTION_DURATION_SEC;
    const sigma = duration / 6;
    const z = (timeSec - contraction.peakSec) / sigma;
    return sum + amplitude * Math.exp(-0.5 * z * z);
  }, UA_RESTING_TONE_MMHG);
  return clamp2(activity, UA_MIN_MMHG, UA_MAX_MMHG);
};
var fetalHeartRateAt = (timeSec, baselineFhr, variabilityOffset, accelerations, decelerations) => clamp2(
  baselineFhr + variabilityOffset + featureOffsetAt(timeSec, accelerations, decelerations),
  FHR_MIN_BPM,
  FHR_MAX_BPM
);
var renderPanelGrid = (layout, top, height, horizontalValues, valueToY) => {
  const lines = [
    `<rect x="${fmt(layout.plotLeft)}" y="${fmt(top)}" width="${fmt(layout.plotWidth)}" height="${fmt(height)}" fill="#fffdfd" stroke="#d48c99" stroke-width="1"/>`
  ];
  for (let sec = 0; sec <= layout.plotWidth / CTG_PX_PER_SEC; sec += 10) {
    const x = timeToX(sec, layout);
    const major = sec % 60 === 0;
    lines.push(
      `<line x1="${fmt(x)}" y1="${fmt(top)}" x2="${fmt(x)}" y2="${fmt(top + height)}" stroke="${major ? "#e9a0ad" : "#f5c8d0"}" stroke-width="${major ? "1" : "0.5"}"/>`
    );
  }
  horizontalValues.forEach((value) => {
    const y = valueToY(value, layout);
    lines.push(
      `<line x1="${fmt(layout.plotLeft)}" y1="${fmt(y)}" x2="${fmt(layout.plotLeft + layout.plotWidth)}" y2="${fmt(y)}" stroke="#e9a0ad" stroke-width="0.8"/>`
    );
  });
  return lines.join("");
};
var renderAxisLabels = (layout, values, valueToY) => values.map(
  (value) => `<text x="${fmt(layout.plotLeft - 8)}" y="${fmt(valueToY(value, layout) + 4)}" text-anchor="end" font-family="system-ui, sans-serif" font-size="10" fill="#64748b">${value}</text>`
).join("");
var renderChannels = (input) => {
  const spec = normalizeFetalMonitoringSpec(input);
  const layout = createChannelLayout(spec.durationSec);
  const variability = buildVariabilitySeries(spec.durationSec, spec.variability, spec.seed);
  const fhrPoints = [];
  const uaPoints = [];
  for (let index = 0; index < variability.length; index += 1) {
    const timeSec = Math.min(index * SAMPLE_STEP_SEC, spec.durationSec);
    const fhr = fetalHeartRateAt(
      timeSec,
      spec.baselineFhr,
      variability[index],
      spec.accelerations,
      spec.decelerations
    );
    const ua = uterineActivityAt(timeSec, spec.contractions);
    const x = timeToX(timeSec, layout);
    fhrPoints.push(`${fmt(x)},${fmt(fhrToY(fhr, layout))}`);
    uaPoints.push(`${fmt(x)},${fmt(uaToY(ua, layout))}`);
  }
  const fhrValues = [60, 90, 120, 150, 180, 210];
  const uaValues = [0, 20, 40, 60, 80, 100];
  const timeLabels = [];
  for (let sec = 0; sec <= spec.durationSec; sec += 60) {
    timeLabels.push(
      `<text x="${fmt(timeToX(sec, layout))}" y="${fmt(layout.uaTop + layout.uaHeight + 18)}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="#64748b">${sec / 60}</text>`
    );
  }
  const contractionMarkers = spec.contractions.map(
    (contraction, index) => `<circle data-contraction-index="${index}" data-peak-sec="${fmt(contraction.peakSec)}" cx="${fmt(timeToX(contraction.peakSec, layout))}" cy="${fmt(uaToY(uterineActivityAt(contraction.peakSec, [contraction]), layout))}" r="0" fill="none"/>`
  ).join("");
  return `<rect x="0" y="0" width="${fmt(layout.width)}" height="${fmt(layout.height)}" fill="#ffffff"/>
<g id="fhr-panel" data-panel="fhr">
${renderPanelGrid(layout, layout.fhrTop, layout.fhrHeight, fhrValues, fhrToY)}
${renderAxisLabels(layout, fhrValues, fhrToY)}
<text x="18" y="${fmt(layout.fhrTop + layout.fhrHeight / 2)}" transform="rotate(-90 18 ${fmt(layout.fhrTop + layout.fhrHeight / 2)})" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#334155">FHR (bpm)</text>
<polyline data-channel="fhr" points="${fhrPoints.join(" ")}" fill="none" stroke="#1f2933" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<g id="ua-panel" data-panel="ua">
${renderPanelGrid(layout, layout.uaTop, layout.uaHeight, uaValues, uaToY)}
${renderAxisLabels(layout, uaValues, uaToY)}
<text x="18" y="${fmt(layout.uaTop + layout.uaHeight / 2)}" transform="rotate(-90 18 ${fmt(layout.uaTop + layout.uaHeight / 2)})" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#334155">UA (mmHg)</text>
<polyline data-channel="ua" points="${uaPoints.join(" ")}" fill="none" stroke="#1f2933" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
${contractionMarkers}
${timeLabels.join("")}
<text x="${fmt(layout.plotLeft + layout.plotWidth / 2)}" y="${fmt(layout.height - 4)}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="#64748b">Time (min)</text>
</g>`;
};

// src/visuals/kinds/fetal_monitoring/index.ts
var VARIABILITY = ["absent", "minimal", "moderate", "marked"];
var DECEL_TYPES = ["early", "late", "variable", "prolonged"];
var isRecord10 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var nonEmptyString10 = (value) => typeof value === "string" && value.trim().length > 0;
var inRange = (value, min, max) => typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
var validateFetalMonitoring = (spec) => {
  const errors = [];
  const value = spec;
  const durationSec = inRange(value.durationSec, 120, 1200) ? value.durationSec : 600;
  if (value.kind !== "fetal_monitoring") {
    errors.push({ path: "kind", code: "invalid_kind", message: "must be fetal_monitoring" });
  }
  if (value.baselineFhr === void 0) {
    errors.push({ path: "baselineFhr", code: "baseline_required", message: "is required" });
  } else if (!inRange(value.baselineFhr, 50, 220)) {
    errors.push({ path: "baselineFhr", code: "baseline_out_of_range", message: "must be 50 to 220 bpm" });
  }
  if (!VARIABILITY.includes(value.variability)) {
    errors.push({ path: "variability", code: "invalid_variability", message: "is invalid" });
  }
  if (value.durationSec !== void 0 && !inRange(value.durationSec, 120, 1200)) {
    errors.push({ path: "durationSec", code: "duration_out_of_range", message: "must be 120 to 1200 seconds" });
  }
  if (value.seed !== void 0 && (typeof value.seed !== "number" || !Number.isInteger(value.seed) || value.seed < 0)) {
    errors.push({ path: "seed", code: "seed_out_of_range", message: "must be a non-negative integer" });
  }
  const contractions = Array.isArray(value.contractions) ? value.contractions : [];
  if (value.contractions !== void 0 && !Array.isArray(value.contractions)) {
    errors.push({ path: "contractions", code: "contraction_out_of_range", message: "must be an array" });
  }
  contractions.forEach((contraction, index) => {
    const valid = isRecord10(contraction) && inRange(contraction.peakSec, 0, durationSec) && (contraction.amplitudeMmHg === void 0 || inRange(contraction.amplitudeMmHg, 5, 100)) && (contraction.durationSec === void 0 || inRange(contraction.durationSec, 20, 180));
    if (!valid) {
      errors.push({
        path: `contractions[${index}]`,
        code: "contraction_out_of_range",
        message: "contains an invalid peak, amplitude, or duration"
      });
    }
  });
  const accelerations = Array.isArray(value.accelerations) ? value.accelerations : [];
  if (value.accelerations !== void 0 && !Array.isArray(value.accelerations)) {
    errors.push({ path: "accelerations", code: "acceleration_out_of_range", message: "must be an array" });
  }
  accelerations.forEach((acceleration, index) => {
    const valid = isRecord10(acceleration) && inRange(acceleration.peakSec, 0, durationSec) && inRange(acceleration.riseBpm, 1, 60) && inRange(acceleration.durationSec, 5, 120);
    if (!valid) {
      errors.push({
        path: `accelerations[${index}]`,
        code: "acceleration_out_of_range",
        message: "contains an invalid peak, rise, or duration"
      });
    }
  });
  const decelerations = Array.isArray(value.decelerations) ? value.decelerations : [];
  if (value.decelerations !== void 0 && !Array.isArray(value.decelerations)) {
    errors.push({ path: "decelerations", code: "deceleration_out_of_range", message: "must be an array" });
  }
  decelerations.forEach((deceleration, index) => {
    if (!isRecord10(deceleration)) {
      errors.push({
        path: `decelerations[${index}]`,
        code: "deceleration_out_of_range",
        message: "must be an object"
      });
      return;
    }
    if (!DECEL_TYPES.includes(deceleration.type)) {
      errors.push({
        path: `decelerations[${index}].type`,
        code: "invalid_decel_type",
        message: "is invalid"
      });
    }
    if (!inRange(deceleration.nadirSec, 0, durationSec) || !inRange(deceleration.depthBpm, 1, 120) || !inRange(deceleration.durationSec, 5, 600)) {
      errors.push({
        path: `decelerations[${index}]`,
        code: "deceleration_out_of_range",
        message: "contains an invalid nadir, depth, or duration"
      });
    }
    if (deceleration.type === "early" || deceleration.type === "late") {
      if (typeof deceleration.contractionIndex !== "number" || !Number.isInteger(deceleration.contractionIndex) || deceleration.contractionIndex < 0 || deceleration.contractionIndex >= contractions.length) {
        errors.push({
          path: `decelerations[${index}].contractionIndex`,
          code: "decel_contraction_index_invalid",
          message: "must index an existing contraction"
        });
      }
    }
    if (deceleration.type === "variable" && deceleration.contractionIndex !== void 0) {
      errors.push({
        path: `decelerations[${index}].contractionIndex`,
        code: "variable_decel_coupled",
        message: "must be omitted for variable decelerations"
      });
    }
  });
  if (value.caption !== void 0) {
    if (!isRecord10(value.caption) || !nonEmptyString10(value.caption.en)) {
      errors.push({ path: "caption.en", code: "caption_en_required", message: "is required when caption is present" });
    } else if (value.caption.zh !== void 0 && !nonEmptyString10(value.caption.zh)) {
      errors.push({ path: "caption.zh", code: "caption_zh_empty", message: "must be non-empty when present" });
    }
  }
  return errors;
};
var renderFetalMonitoringSvg = (input) => {
  const spec = normalizeFetalMonitoringSpec(input);
  const layout = createChannelLayout(spec.durationSec);
  const ariaLabel = escapeXml(spec.caption?.en ?? "Fetal monitoring tracing");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(layout.width)} ${fmt(layout.height)}" role="img" aria-label="${ariaLabel}" data-kind="fetal_monitoring" data-baseline-fhr="${fmt(spec.baselineFhr)}" data-variability="${spec.variability}" data-variability-peak-to-trough-bpm="${fmt(VARIABILITY_PEAK_TO_TROUGH_BPM[spec.variability])}" data-duration-sec="${fmt(spec.durationSec)}" data-px-per-sec="${fmt(CTG_PX_PER_SEC)}">${renderChannels(spec)}</svg>`;
};
var structuralSpec = (value) => {
  if (value.kind !== "fetal_monitoring" || !inRange(value.baselineFhr, 50, 220) || !VARIABILITY.includes(value.variability)) {
    return null;
  }
  const contractions = Array.isArray(value.contractions) ? value.contractions : [];
  const accelerations = Array.isArray(value.accelerations) ? value.accelerations : [];
  const decelerations = Array.isArray(value.decelerations) ? value.decelerations : [];
  if (!contractions.every(isRecord10) || !accelerations.every(isRecord10) || !decelerations.every(isRecord10)) {
    return null;
  }
  return {
    contractions,
    accelerations,
    decelerations
  };
};
var selfCheckFetalMonitoring = (spec, question) => {
  const value = spec;
  const structural = structuralSpec(value);
  if (structural === null) return [];
  const errors = [];
  const meta = isRecord10(question) && isRecord10(question.meta) ? question.meta : {};
  if (!nonEmptyString10(meta.visual_justification)) {
    errors.push({
      path: "meta.visual_justification",
      code: "self_check_missing_justification",
      message: "must be present and non-empty"
    });
  }
  const expectedPattern = isRecord10(meta.expected_pattern) ? meta.expected_pattern : {};
  const expectedDecelerations = Array.isArray(expectedPattern.decelerations) ? expectedPattern.decelerations.filter(
    (entry) => typeof entry === "string" && DECEL_TYPES.includes(entry)
  ) : [];
  const hasExpectedVariability = VARIABILITY.includes(
    expectedPattern.variability
  );
  const hasExpectedAccelerations = typeof expectedPattern.accelerations_present === "boolean";
  if (expectedDecelerations.length === 0 && !hasExpectedVariability && !hasExpectedAccelerations) {
    errors.push({
      path: "meta.expected_pattern",
      code: "self_check_no_keyed_pattern",
      message: "must declare at least one supported tracing feature"
    });
  }
  structural.decelerations.forEach((deceleration, index) => {
    if (!decelerationPhaseIsValid(deceleration, structural.contractions)) {
      const code = deceleration.type === "early" ? "self_check_early_phase" : deceleration.type === "late" ? "self_check_late_phase" : deceleration.type === "variable" ? "self_check_variable_not_abrupt" : "self_check_prolonged_duration";
      errors.push({
        path: `decelerations[${index}]`,
        code,
        message: `timing is inconsistent with declared ${deceleration.type} morphology`
      });
    }
  });
  structural.accelerations.forEach((acceleration, index) => {
    if (!accelerationMorphologyIsValid(acceleration)) {
      errors.push({
        path: `accelerations[${index}]`,
        code: "self_check_acceleration_morphology",
        message: "must satisfy the v1 term acceleration morphology"
      });
    }
  });
  const actualTypes = new Set(structural.decelerations.map((deceleration) => deceleration.type));
  expectedDecelerations.forEach((type, index) => {
    if (!actualTypes.has(type)) {
      errors.push({
        path: `meta.expected_pattern.decelerations[${index}]`,
        code: "self_check_pattern_absent",
        message: `declared ${type} pattern is absent`
      });
    }
  });
  if (hasExpectedVariability && expectedPattern.variability !== value.variability) {
    errors.push({
      path: "meta.expected_pattern.variability",
      code: "self_check_variability_mismatch",
      message: "does not match the rendered variability category"
    });
  }
  if (hasExpectedAccelerations && expectedPattern.accelerations_present !== structural.accelerations.length > 0) {
    errors.push({
      path: "meta.expected_pattern.accelerations_present",
      code: "self_check_accel_mismatch",
      message: "does not match acceleration presence in the tracing"
    });
  }
  const variabilityRange = VARIABILITY_PEAK_TO_TROUGH_BPM[value.variability];
  if (!Number.isFinite(variabilityRange)) {
    errors.push({
      path: "variability",
      code: "self_check_variability_amplitude",
      message: "does not map to a deterministic amplitude"
    });
  }
  return errors;
};
var fixtures10 = {
  valid: [
    {
      kind: "fetal_monitoring",
      durationSec: 300,
      baselineFhr: 140,
      variability: "moderate",
      contractions: [{ peakSec: 100 }, { peakSec: 220 }],
      accelerations: [{ peakSec: 160, riseBpm: 20, durationSec: 30 }]
    },
    {
      kind: "fetal_monitoring",
      durationSec: 300,
      baselineFhr: 140,
      variability: "moderate",
      seed: 7,
      contractions: [{ peakSec: 90 }, { peakSec: 210 }],
      decelerations: [
        { type: "early", nadirSec: 90, depthBpm: 25, durationSec: 70, contractionIndex: 0 },
        { type: "early", nadirSec: 210, depthBpm: 25, durationSec: 70, contractionIndex: 1 }
      ]
    },
    {
      kind: "fetal_monitoring",
      durationSec: 300,
      baselineFhr: 135,
      variability: "minimal",
      seed: 17,
      contractions: [{ peakSec: 90 }, { peakSec: 210 }],
      decelerations: [
        { type: "late", nadirSec: 110, depthBpm: 30, durationSec: 70, contractionIndex: 0 },
        { type: "late", nadirSec: 230, depthBpm: 30, durationSec: 70, contractionIndex: 1 }
      ]
    },
    {
      kind: "fetal_monitoring",
      durationSec: 300,
      baselineFhr: 145,
      variability: "moderate",
      seed: 23,
      contractions: [{ peakSec: 120 }, { peakSec: 240 }],
      decelerations: [
        { type: "variable", nadirSec: 70, depthBpm: 45, durationSec: 24 },
        { type: "variable", nadirSec: 190, depthBpm: 40, durationSec: 20 }
      ]
    },
    {
      kind: "fetal_monitoring",
      durationSec: 300,
      baselineFhr: 140,
      variability: "moderate",
      seed: 29,
      contractions: [{ peakSec: 80 }, { peakSec: 230 }],
      decelerations: [
        { type: "prolonged", nadirSec: 155, depthBpm: 35, durationSec: 180 }
      ],
      caption: { en: "Fetal monitoring tracing", zh: "\u80CE\u513F\u76D1\u62A4\u56FE" }
    }
  ],
  invalid: [
    { spec: { kind: "rhythm_strip", baselineFhr: 140, variability: "moderate" }, expectCode: "invalid_kind" },
    { spec: { kind: "fetal_monitoring", variability: "moderate" }, expectCode: "baseline_required" },
    { spec: { kind: "fetal_monitoring", baselineFhr: 400, variability: "moderate" }, expectCode: "baseline_out_of_range" },
    { spec: { kind: "fetal_monitoring", baselineFhr: 140, variability: "wandering" }, expectCode: "invalid_variability" },
    { spec: { kind: "fetal_monitoring", baselineFhr: 140, variability: "moderate", durationSec: 30 }, expectCode: "duration_out_of_range" },
    { spec: { kind: "fetal_monitoring", baselineFhr: 140, variability: "moderate", seed: -1 }, expectCode: "seed_out_of_range" },
    {
      spec: {
        kind: "fetal_monitoring",
        baselineFhr: 140,
        variability: "moderate",
        contractions: [{ peakSec: 700 }]
      },
      expectCode: "contraction_out_of_range"
    },
    { spec: { kind: "fetal_monitoring", baselineFhr: 140, variability: "moderate", caption: { en: "" } }, expectCode: "caption_en_required" },
    { spec: { kind: "fetal_monitoring", baselineFhr: 140, variability: "moderate", caption: { en: "x", zh: "" } }, expectCode: "caption_zh_empty" }
  ]
};
var fetalMonitoringModule = {
  kind: "fetal_monitoring",
  validate: validateFetalMonitoring,
  selfCheck: selfCheckFetalMonitoring,
  renderSvg: renderFetalMonitoringSvg,
  fixtures: fixtures10
};
registerVisual(fetalMonitoringModule);

// src/visuals/kinds/injection_site/routes.ts
var ROUTE_TABLE = {
  intradermal: { angleDeg: 10, target: "dermis" },
  subcutaneous: { angleDeg: 45, target: "subcutaneous" },
  intramuscular: { angleDeg: 90, target: "muscle" },
  intravenous: { angleDeg: 25, target: "vessel" }
};
var INJECTION_ROUTES = Object.keys(ROUTE_TABLE);
var LAYER_BANDS = [
  { key: "epidermis", y0: 80, y1: 96, fill: "#f8d7b5", label: "Epidermis" },
  { key: "dermis", y0: 96, y1: 150, fill: "#efb38f", label: "Dermis" },
  {
    key: "subcutaneous",
    y0: 150,
    y1: 235,
    fill: "#f6df8d",
    label: "Subcutaneous tissue"
  },
  { key: "muscle", y0: 235, y1: 330, fill: "#b96868", label: "Muscle" }
];

// src/visuals/kinds/injection_site/geometry.ts
var IV_VESSEL_RADII = { rx: 25, ry: 11 };
var IV_VESSEL_DEPTH_Y = 162;
var BYSTANDER_VESSEL = {
  cx: 205,
  cy: 190,
  rx: 22,
  ry: 10
};
var getRenderedVesselGeometry = (route, vessel, tip) => {
  if (vessel === "target") {
    return {
      cx: tip.x,
      cy: tip.y,
      rx: IV_VESSEL_RADII.rx,
      ry: IV_VESSEL_RADII.ry
    };
  }
  if (vessel === "bystander") return BYSTANDER_VESSEL;
  return null;
};
var segmentIntersectsEllipse = (p0, p1, e) => {
  const ax = (p0.x - e.cx) / e.rx;
  const ay = (p0.y - e.cy) / e.ry;
  const bx = (p1.x - e.cx) / e.rx;
  const by = (p1.y - e.cy) / e.ry;
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2));
  const qx = ax + t * dx;
  const qy = ay + t * dy;
  return qx * qx + qy * qy <= 1;
};
var tipInsideEllipse = (tip, e) => ((tip.x - e.cx) / e.rx) ** 2 + ((tip.y - e.cy) / e.ry) ** 2 <= 1;

// src/visuals/kinds/injection_site/index.ts
var WIDTH = 480;
var HEIGHT = 360;
var TISSUE_X = 140;
var TISSUE_WIDTH = 320;
var SURFACE_Y = LAYER_BANDS[0].y0;
var TIP_X = 350;
var BARREL_LENGTH = 58;
var ROUTES = new Set(INJECTION_ROUTES);
var isRecord11 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var nonEmptyString11 = (value) => typeof value === "string" && value.trim().length > 0;
var isInjectionRoute = (value) => typeof value === "string" && ROUTES.has(value);
var isVesselRelation = (value) => value === "target" || value === "bystander";
var validateInjectionSite = (spec) => {
  const value = spec;
  const errors = [];
  if (value.kind !== "injection_site") {
    errors.push({ path: "kind", code: "invalid_kind", message: "must be 'injection_site'" });
  }
  if (!isInjectionRoute(value.route)) {
    errors.push({
      path: "route",
      code: "invalid_route",
      message: "must be intradermal, subcutaneous, intramuscular, or intravenous"
    });
  }
  if (value.vessel !== void 0 && !isVesselRelation(value.vessel)) {
    errors.push({
      path: "vessel",
      code: "invalid_vessel_relation",
      message: "must be target or bystander when present"
    });
  }
  if (value.caption !== void 0) {
    if (!isRecord11(value.caption) || !nonEmptyString11(value.caption.en)) {
      errors.push({
        path: "caption.en",
        code: "caption_en_required",
        message: "is required when caption is present"
      });
    } else if (value.caption.zh !== void 0 && !nonEmptyString11(value.caption.zh)) {
      errors.push({
        path: "caption.zh",
        code: "caption_zh_empty",
        message: "must be non-empty when present"
      });
    }
  }
  return errors;
};
var selfCheckInjectionSite = (spec, question) => {
  const value = spec;
  if (value.kind !== "injection_site") return [];
  const errors = [];
  if (!isInjectionRoute(value.route)) {
    errors.push({
      path: "route",
      code: "self_check_invalid_route",
      message: "must map to a supported route geometry"
    });
    return errors;
  }
  const meta = isRecord11(question) && isRecord11(question.meta) ? question.meta : {};
  if (!nonEmptyString11(meta.visual_justification)) {
    errors.push({
      path: "meta.visual_justification",
      code: "self_check_missing_justification",
      message: "must be present and non-empty"
    });
  }
  const expected = isRecord11(meta.expected) ? meta.expected : null;
  if (expected === null || !nonEmptyString11(expected.route)) {
    errors.push({
      path: "meta.expected.route",
      code: "self_check_no_expected_cue",
      message: "must declare the depicted route"
    });
    return errors;
  }
  if (expected.route !== value.route) {
    errors.push({
      path: "meta.expected.route",
      code: "self_check_route_mismatch",
      message: "does not match the visual route"
    });
  }
  if (expected.target !== void 0 && expected.target !== ROUTE_TABLE[value.route].target) {
    errors.push({
      path: "meta.expected.target",
      code: "self_check_target_mismatch",
      message: "does not match the canonical route target"
    });
  }
  const vessel = isVesselRelation(value.vessel) ? value.vessel : void 0;
  const needle = getInjectionNeedleGeometry(value.route);
  const renderedVessel = getRenderedVesselGeometry(value.route, vessel, {
    x: needle.tipX,
    y: needle.tipY
  });
  if (vessel === "target" && value.route !== "intravenous") {
    errors.push({
      path: "vessel",
      code: "self_check_target_requires_iv",
      message: "target vessel relation is only valid for intravenous route"
    });
  }
  if (value.route === "intravenous" && vessel !== "target") {
    errors.push({
      path: "vessel",
      code: "self_check_iv_requires_target",
      message: "intravenous route must declare vessel target relation"
    });
  }
  if (vessel === "target" && renderedVessel !== null) {
    const tip = { x: needle.tipX, y: needle.tipY };
    if (!tipInsideEllipse(tip, renderedVessel)) {
      errors.push({
        path: "vessel",
        code: "self_check_target_not_entered",
        message: "needle tip must enter the target vessel"
      });
    }
  } else if (renderedVessel !== null) {
    const intersects = segmentIntersectsEllipse(
      { x: needle.entryX, y: needle.entryY },
      { x: needle.tipX, y: needle.tipY },
      renderedVessel
    );
    if (intersects) {
      errors.push({
        path: "vessel",
        code: "self_check_unsafe_vessel_crossing",
        message: "non-target vessel must not intersect the needle segment"
      });
    }
  }
  if (expected.vesselEntry !== void 0 && expected.vesselEntry !== (vessel === "target")) {
    errors.push({
      path: "meta.expected.vesselEntry",
      code: "self_check_vessel_entry_mismatch",
      message: "does not match the rendered vessel entry state"
    });
  }
  return errors;
};
var targetY = (target) => {
  if (target === "vessel") return IV_VESSEL_DEPTH_Y;
  const band = LAYER_BANDS.find((candidate) => candidate.key === target);
  return band ? (band.y0 + band.y1) / 2 : SURFACE_Y;
};
var getInjectionNeedleGeometry = (route) => {
  const routeGeometry = ROUTE_TABLE[route];
  const radians = routeGeometry.angleDeg * Math.PI / 180;
  const tipY = targetY(routeGeometry.target);
  const depth = tipY - SURFACE_Y;
  const horizontalRun = routeGeometry.angleDeg === 90 ? 0 : depth / Math.tan(radians);
  const entryX = TIP_X - horizontalRun;
  const barrelX = entryX - Math.cos(radians) * BARREL_LENGTH;
  const barrelY = SURFACE_Y - Math.sin(radians) * BARREL_LENGTH;
  const perpendicularX = -Math.sin(radians);
  const perpendicularY = Math.cos(radians);
  return {
    entryX,
    entryY: SURFACE_Y,
    tipX: TIP_X,
    tipY,
    barrelX,
    barrelY,
    barrelPerpX: perpendicularX * 10,
    barrelPerpY: perpendicularY * 10
  };
};
var renderBands = () => LAYER_BANDS.map(
  (band) => `<g data-layer="${band.key}">
<rect x="${fmt(TISSUE_X)}" y="${fmt(band.y0)}" width="${fmt(TISSUE_WIDTH)}" height="${fmt(band.y1 - band.y0)}" fill="${band.fill}" stroke="#ffffff" stroke-width="1"/>
<text x="${fmt(TISSUE_X + 12)}" y="${fmt((band.y0 + band.y1) / 2 + 4)}" font-family="system-ui, sans-serif" font-size="${fmt(12)}" font-weight="600" fill="${band.key === "muscle" ? "#ffffff" : "#573b2d"}">${escapeXml(band.label)}</text>
</g>`
).join("\n");
var renderVessel = (vessel) => {
  if (vessel === null) return "";
  return `<ellipse data-element="blood-channel" cx="${fmt(vessel.cx)}" cy="${fmt(vessel.cy)}" rx="${fmt(vessel.rx)}" ry="${fmt(vessel.ry)}" fill="#8b1e3f" stroke="#5f1530" stroke-width="2"/>
<ellipse cx="${fmt(vessel.cx)}" cy="${fmt(vessel.cy)}" rx="${fmt(Math.max(vessel.rx - 5, 1))}" ry="${fmt(Math.max(vessel.ry - 4, 1))}" fill="#d56a7f"/>`;
};
var renderInjectionSiteSvg = (spec) => {
  const route = isInjectionRoute(spec.route) ? spec.route : "intradermal";
  const needle = getInjectionNeedleGeometry(route);
  const vessel = isVesselRelation(spec.vessel) ? spec.vessel : void 0;
  const renderedVessel = getRenderedVesselGeometry(route, vessel, {
    x: needle.tipX,
    y: needle.tipY
  });
  const ariaLabel = escapeXml(spec.caption?.en ?? "Injection cross-section");
  const barrelStartX = needle.barrelX - needle.barrelPerpX;
  const barrelStartY = needle.barrelY - needle.barrelPerpY;
  const barrelEndX = needle.barrelX + needle.barrelPerpX;
  const barrelEndY = needle.barrelY + needle.barrelPerpY;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(WIDTH)} ${fmt(HEIGHT)}" role="img" aria-label="${ariaLabel}" data-kind="injection_site">
<rect x="0" y="0" width="${fmt(WIDTH)}" height="${fmt(HEIGHT)}" fill="#ffffff"/>
<rect x="${fmt(TISSUE_X)}" y="${fmt(SURFACE_Y)}" width="${fmt(TISSUE_WIDTH)}" height="${fmt(LAYER_BANDS[LAYER_BANDS.length - 1].y1 - SURFACE_Y)}" fill="none" stroke="#7c5a4b" stroke-width="1.5"/>
${renderBands()}
${renderVessel(renderedVessel)}
<g stroke-linecap="round" stroke-linejoin="round">
<path data-element="needle" d="M ${fmt(needle.entryX)} ${fmt(needle.entryY)} L ${fmt(needle.tipX)} ${fmt(needle.tipY)}" fill="none" stroke="#475569" stroke-width="4"/>
<path d="M ${fmt(needle.entryX)} ${fmt(needle.entryY)} L ${fmt(needle.tipX)} ${fmt(needle.tipY)}" fill="none" stroke="#e2e8f0" stroke-width="1.3"/>
<line data-element="syringe-barrel" x1="${fmt(needle.barrelX)}" y1="${fmt(needle.barrelY)}" x2="${fmt(needle.entryX)}" y2="${fmt(needle.entryY)}" stroke="#64748b" stroke-width="12"/>
<line data-element="syringe-barrel" x1="${fmt(needle.barrelX)}" y1="${fmt(needle.barrelY)}" x2="${fmt(needle.entryX)}" y2="${fmt(needle.entryY)}" stroke="#dbeafe" stroke-width="7"/>
<line data-element="syringe-barrel" x1="${fmt(barrelStartX)}" y1="${fmt(barrelStartY)}" x2="${fmt(barrelEndX)}" y2="${fmt(barrelEndY)}" stroke="#475569" stroke-width="4"/>
<circle cx="${fmt(needle.tipX)}" cy="${fmt(needle.tipY)}" r="${fmt(3.5)}" fill="#1e293b"/>
</g>
</svg>`;
};
var fixtures11 = {
  valid: [
    { kind: "injection_site", route: "intramuscular" },
    { kind: "injection_site", route: "subcutaneous" },
    {
      kind: "injection_site",
      route: "intradermal",
      caption: { en: "Skin cross-section", zh: "\u76AE\u80A4\u6A2A\u65AD\u9762" }
    },
    { kind: "injection_site", route: "intravenous" },
    { kind: "injection_site", route: "intravenous", vessel: "target" },
    { kind: "injection_site", route: "subcutaneous", vessel: "bystander" }
  ],
  invalid: [
    { spec: { kind: "mar" }, expectCode: "invalid_kind" },
    {
      spec: { kind: "injection_site", route: "intraosseous" },
      expectCode: "invalid_route"
    },
    {
      spec: { kind: "injection_site", route: "intradermal", caption: { en: "" } },
      expectCode: "caption_en_required"
    },
    {
      spec: {
        kind: "injection_site",
        route: "intradermal",
        caption: { en: "x", zh: "" }
      },
      expectCode: "caption_zh_empty"
    },
    {
      spec: { kind: "injection_site", route: "subcutaneous", vessel: "intra_arterial" },
      expectCode: "invalid_vessel_relation"
    }
  ]
};
var injectionSiteModule = {
  kind: "injection_site",
  validate: validateInjectionSite,
  selfCheck: selfCheckInjectionSite,
  renderSvg: renderInjectionSiteSvg,
  fixtures: fixtures11
};
registerVisual(injectionSiteModule);

// src/visuals/primitives/divergingBars.ts
var signedTick = (value) => value < 0 ? `\u2212${fmtNum(Math.abs(value))}` : fmtNum(value);
var niceCeil = (value) => {
  if (!Number.isFinite(value) || value <= 0) return 100;
  const exponent = Math.floor(Math.log10(value));
  const base = 10 ** exponent;
  const normalized = value / base;
  const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return roundTo(factor * base, 6);
};
function renderDivergingBars(input) {
  const width = input.width ?? 600;
  const height = input.height ?? 260;
  const marginTop = 34;
  const hasOverlay = input.overlay !== void 0 && input.overlay.points.length > 0;
  const marginRight = hasOverlay ? 62 : 24;
  const marginBottom = 48;
  const marginLeft = 62;
  const plotWidth = width - marginLeft - marginRight;
  const plotHeight = height - marginTop - marginBottom;
  const baselineY = marginTop + plotHeight / 2;
  const maxBarAbs = Math.max(
    0,
    ...input.bins.flatMap((bin) => [Math.abs(bin.positive), Math.abs(bin.negative)])
  );
  const axisMax = niceCeil(maxBarAbs);
  const axisMin = -axisMax;
  const yScale = plotHeight / (axisMax - axisMin);
  const maxOverlayAbs = Math.max(
    0,
    ...input.overlay?.points.map((point) => Math.abs(point.value)) ?? []
  );
  const overlayAxisMax = niceCeil(maxOverlayAbs);
  const overlayAxisMin = -overlayAxisMax;
  const overlayYScale = plotHeight / (overlayAxisMax - overlayAxisMin);
  const band = input.bins.length > 0 ? plotWidth / input.bins.length : plotWidth;
  const barWidth = Math.max(10, Math.min(36, band * 0.34));
  const elements = [];
  const yFor = (value) => baselineY - value * yScale;
  const overlayYFor = (value) => baselineY - value * overlayYScale;
  const xForBin = (index) => marginLeft + band * index + band / 2;
  elements.push(`<rect x="0" y="0" width="${fmt(width)}" height="${fmt(height)}" fill="#ffffff"/>`);
  for (const tick of [axisMin, axisMin / 2, 0, axisMax / 2, axisMax]) {
    const y = yFor(tick);
    elements.push(`<line x1="${fmt(marginLeft)}" y1="${fmt(y)}" x2="${fmt(width - marginRight)}" y2="${fmt(y)}" stroke="${tick === 0 ? "#94a3b8" : "#e2e8f0"}" stroke-width="${tick === 0 ? "1.5" : "1"}"/>`);
    elements.push(`<text x="${fmt(marginLeft - 8)}" y="${fmt(y + 4)}" font-family="sans-serif" font-size="11" fill="#64748b" text-anchor="end">${escapeXml(signedTick(tick))}</text>`);
  }
  elements.push(`<line x1="${fmt(marginLeft)}" y1="${fmt(marginTop)}" x2="${fmt(marginLeft)}" y2="${fmt(marginTop + plotHeight)}" stroke="#94a3b8" stroke-width="1.5"/>`);
  elements.push(`<line x1="${fmt(marginLeft)}" y1="${fmt(marginTop + plotHeight)}" x2="${fmt(width - marginRight)}" y2="${fmt(marginTop + plotHeight)}" stroke="#94a3b8" stroke-width="1.5"/>`);
  elements.push(`<text x="${fmt(marginLeft - 42)}" y="${fmt(marginTop - 12)}" font-family="sans-serif" font-size="12" font-weight="600" fill="#334155" text-anchor="start">${escapeXml(input.yAxisLabel)}</text>`);
  if (hasOverlay) {
    const rightAxisX = width - marginRight;
    elements.push(`<line x1="${fmt(rightAxisX)}" y1="${fmt(marginTop)}" x2="${fmt(rightAxisX)}" y2="${fmt(marginTop + plotHeight)}" stroke="#94a3b8" stroke-width="1.5"/>`);
    for (const tick of [overlayAxisMin, overlayAxisMin / 2, 0, overlayAxisMax / 2, overlayAxisMax]) {
      const y = overlayYFor(tick);
      elements.push(`<text x="${fmt(rightAxisX + 8)}" y="${fmt(y + 4)}" font-family="sans-serif" font-size="11" fill="#64748b" text-anchor="start">${escapeXml(signedTick(tick))}</text>`);
    }
  }
  input.bins.forEach((bin, index) => {
    const x = xForBin(index);
    elements.push(`<line x1="${fmt(x)}" y1="${fmt(marginTop)}" x2="${fmt(x)}" y2="${fmt(marginTop + plotHeight)}" stroke="#f1f5f9" stroke-width="1"/>`);
    if (bin.positive > 0) {
      const barHeight = bin.positive * yScale;
      elements.push(`<rect data-role="positive-bar" x="${fmt(x - barWidth / 2)}" y="${fmt(baselineY - barHeight)}" width="${fmt(barWidth)}" height="${fmt(barHeight)}" fill="#2563eb" opacity="0.82" rx="2"/>`);
    }
    if (bin.negative > 0) {
      const barHeight = bin.negative * yScale;
      elements.push(`<rect data-role="negative-bar" x="${fmt(x - barWidth / 2)}" y="${fmt(baselineY)}" width="${fmt(barWidth)}" height="${fmt(barHeight)}" fill="#64748b" opacity="0.86" rx="2"/>`);
    }
    elements.push(`<text x="${fmt(x)}" y="${fmt(height - 18)}" font-family="sans-serif" font-size="11" fill="#475569" text-anchor="middle">${escapeXml(bin.label)}</text>`);
  });
  if (hasOverlay && input.overlay !== void 0) {
    const points = input.overlay.points.filter((point) => point.binIndex >= 0 && point.binIndex < input.bins.length).map((point) => `${fmt(xForBin(point.binIndex))},${fmt(overlayYFor(point.value))}`).join(" ");
    if (points.length > 0) {
      elements.push(`<polyline data-role="overlay-line" points="${points}" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`);
      input.overlay.points.filter((point) => point.binIndex >= 0 && point.binIndex < input.bins.length).forEach((point) => {
        elements.push(`<circle data-role="overlay-point" cx="${fmt(xForBin(point.binIndex))}" cy="${fmt(overlayYFor(point.value))}" r="3.5" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>`);
      });
    }
  }
  let legendX = marginLeft;
  const legendY = 16;
  const legendItems = [
    { label: input.positiveLabel, color: "#2563eb", shape: "rect" },
    { label: input.negativeLabel, color: "#64748b", shape: "rect" },
    ...hasOverlay && input.overlay !== void 0 ? [{ label: input.overlay.label, color: "#0f172a", shape: "line" }] : []
  ];
  legendItems.forEach((item) => {
    if (item.shape === "line") {
      elements.push(`<line x1="${fmt(legendX)}" y1="${fmt(legendY - 4)}" x2="${fmt(legendX + 18)}" y2="${fmt(legendY - 4)}" stroke="${item.color}" stroke-width="2.2"/>`);
    } else {
      elements.push(`<rect x="${fmt(legendX)}" y="${fmt(legendY - 11)}" width="14" height="8" fill="${item.color}" rx="1"/>`);
    }
    elements.push(`<text x="${fmt(legendX + 24)}" y="${fmt(legendY)}" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="start">${escapeXml(item.label)}</text>`);
    legendX += Math.max(92, item.label.length * 7 + 42);
  });
  if (hasOverlay && input.overlay !== void 0) {
    elements.push(`<text x="${fmt(width - marginRight + 42)}" y="${fmt(marginTop - 12)}" font-family="sans-serif" font-size="12" font-weight="600" fill="#334155" text-anchor="end">${escapeXml(input.overlay.axisLabel)}</text>`);
  }
  return `<g class="diverging-bars" data-axis-min="${fmt(axisMin)}" data-axis-max="${fmt(axisMax)}" data-zero-y="${fmt(baselineY)}"${hasOverlay ? ` data-overlay-axis-min="${fmt(overlayAxisMin)}" data-overlay-axis-max="${fmt(overlayAxisMax)}" data-overlay-zero-y="${fmt(baselineY)}"` : ""}>
${elements.join("\n")}
</g>`;
}

// src/visuals/kinds/io_trend/index.ts
var MAX_INTERVAL_ML = 1e4;
var KEYED_ARRAYS = ["net_by_interval_ml", "cumulative_net_ml"];
var KEYED_SCALARS = ["final_cumulative_net_ml"];
var TREND_SERIES = ["intake", "output", "net", "cumulative_net"];
var isRecord12 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var nonEmptyString12 = (value) => typeof value === "string" && value.trim().length > 0;
var isValidVolume2 = (value) => typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= 0;
var validateTextPair3 = (value, path) => {
  if (!isRecord12(value) || !nonEmptyString12(value.en)) {
    return [{
      path: `${path}.en`,
      code: path === "periodLabel" ? "period_label_en_required" : "caption_en_required",
      message: "is required when present"
    }];
  }
  if (value.zh !== void 0 && !nonEmptyString12(value.zh)) {
    return [{
      path: `${path}.zh`,
      code: path === "periodLabel" ? "period_label_zh_empty" : "caption_zh_empty",
      message: "must be non-empty when present"
    }];
  }
  return [];
};
var structuralIntervals = (value) => {
  if (!Array.isArray(value)) return null;
  const intervals = [];
  for (const interval of value) {
    if (!isRecord12(interval)) return null;
    intervals.push(interval);
  }
  return intervals;
};
var usableIntervals = (spec) => {
  if (!Array.isArray(spec.intervals)) return null;
  const intervals = [];
  for (const interval of spec.intervals) {
    if (!isRecord12(interval) || !isValidVolume2(interval.intakeMl) || !isValidVolume2(interval.outputMl)) return null;
    intervals.push({ intakeMl: interval.intakeMl, outputMl: interval.outputMl });
  }
  return intervals;
};
var validateIoTrend = (spec) => {
  const errors = [];
  const value = spec;
  if (value.kind !== "io_trend") {
    return [{ path: "kind", code: "invalid_kind", message: "must be 'io_trend'" }];
  }
  let times = [];
  if (!isRecord12(value.time) || !Array.isArray(value.time.values)) {
    errors.push({ path: "time", code: "time_invalid", message: "must provide time.values as an array" });
  } else {
    times = value.time.values;
    if (value.time.unit !== "hr" && value.time.unit !== "shift") {
      errors.push({ path: "time.unit", code: "invalid_time_unit", message: "must be 'hr' or 'shift'" });
    }
    times.forEach((timepoint, index) => {
      if (typeof timepoint !== "number" || !Number.isFinite(timepoint)) {
        errors.push({ path: `time.values[${index}]`, code: "timepoint_not_number", message: "must be a finite number" });
        return;
      }
      if (index > 0 && timepoint <= times[index - 1]) {
        errors.push({ path: `time.values[${index}]`, code: "timepoints_not_increasing", message: "must be strictly increasing" });
      }
    });
    if (times.length < 3) {
      errors.push({ path: "time.values", code: "too_few_timepoints", message: "must contain at least three timepoints" });
    }
  }
  const intervals = structuralIntervals(value.intervals);
  if (intervals === null) {
    errors.push({ path: "intervals", code: "intervals_invalid", message: "must be an array of interval objects" });
  } else {
    if (times.length > 0 && intervals.length !== times.length) {
      errors.push({ path: "intervals", code: "intervals_length_mismatch", message: "must match time.values length" });
    }
    let totalVolume = 0;
    intervals.forEach((interval, index) => {
      for (const key of ["intakeMl", "outputMl"]) {
        const volume = interval[key];
        if (!isValidVolume2(volume)) {
          errors.push({ path: `intervals[${index}].${key}`, code: "invalid_volume", message: "must be a finite non-negative integer" });
        } else {
          totalVolume += volume;
          if (volume > MAX_INTERVAL_ML) {
            errors.push({ path: `intervals[${index}].${key}`, code: "volume_out_of_range", message: `must be no greater than ${MAX_INTERVAL_ML} mL` });
          }
        }
      }
    });
    if (intervals.length > 0 && totalVolume === 0) {
      errors.push({ path: "intervals", code: "no_volumes", message: "must contain at least one non-zero intake or output volume" });
    }
  }
  if (value.binLabels !== void 0) {
    if (!Array.isArray(value.binLabels) || times.length > 0 && value.binLabels.length !== times.length) {
      errors.push({ path: "binLabels", code: "bin_labels_length_mismatch", message: "must match time.values length" });
    } else {
      value.binLabels.forEach((label, index) => {
        if (!isRecord12(label) || !nonEmptyString12(label.en)) {
          errors.push({ path: `binLabels[${index}].en`, code: "bin_label_en_required", message: "is required when present" });
        } else if (label.zh !== void 0 && !nonEmptyString12(label.zh)) {
          errors.push({ path: `binLabels[${index}].zh`, code: "bin_label_zh_empty", message: "must be non-empty when present" });
        }
      });
    }
  }
  if (value.showCumulativeNet !== void 0 && typeof value.showCumulativeNet !== "boolean") {
    errors.push({ path: "showCumulativeNet", code: "invalid_show_cumulative_net", message: "must be a boolean when present" });
  }
  if (value.periodLabel !== void 0) errors.push(...validateTextPair3(value.periodLabel, "periodLabel"));
  if (value.caption !== void 0) errors.push(...validateTextPair3(value.caption, "caption"));
  return errors;
};
var derive = (intervals) => {
  const netByInterval = intervals.map((interval) => interval.intakeMl - interval.outputMl);
  const cumulative = [];
  let running = 0;
  for (const net of netByInterval) {
    running += net;
    cumulative.push(running);
  }
  return { netByInterval, cumulative, final: running };
};
var seriesValues = (series, intervals, netByInterval, cumulative) => {
  switch (series) {
    case "intake":
      return intervals.map((interval) => interval.intakeMl);
    case "output":
      return intervals.map((interval) => interval.outputMl);
    case "net":
      return netByInterval;
    case "cumulative_net":
      return cumulative;
    default:
      return null;
  }
};
var signOf = (value) => value > 0 ? "positive" : value < 0 ? "negative" : null;
var selfCheckIoTrend = (spec, question) => {
  if (spec.kind !== "io_trend" || !Array.isArray(spec.time?.values)) return [];
  const rawIntervals = structuralIntervals(spec.intervals);
  if (rawIntervals === null) return [];
  const errors = [];
  const meta = isRecord12(question) && isRecord12(question.meta) ? question.meta : null;
  if (meta !== null && !nonEmptyString12(meta.visual_justification)) {
    errors.push({
      path: "meta.visual_justification",
      code: "self_check_missing_justification",
      message: "must be present and non-empty"
    });
  }
  if (meta !== null && !nonEmptyString12(meta.collapse_test)) {
    errors.push({
      path: "meta.collapse_test",
      code: "self_check_missing_collapse_test",
      message: "must be present and non-empty"
    });
  }
  if (rawIntervals.length < 3) {
    errors.push({
      path: "intervals",
      code: "self_check_too_few_timepoints",
      message: "must contain at least three intervals for trend assertions"
    });
  }
  for (let index = 0; index < rawIntervals.length; index += 1) {
    const interval = rawIntervals[index];
    if (!isValidVolume2(interval.intakeMl) || !isValidVolume2(interval.outputMl)) {
      errors.push({
        path: `intervals[${index}]`,
        code: "self_check_invalid_volume",
        message: "must contain finite non-negative integer volumes"
      });
    }
  }
  if (errors.some((error) => error.code === "self_check_invalid_volume")) return errors;
  const intervals = rawIntervals.map((interval) => ({
    intakeMl: interval.intakeMl,
    outputMl: interval.outputMl
  }));
  const { netByInterval, cumulative, final } = derive(intervals);
  const keyed = meta !== null && isRecord12(meta.derived_values_keyed) ? meta.derived_values_keyed : null;
  if (keyed !== null) {
    for (const key of KEYED_ARRAYS) {
      if (!Object.prototype.hasOwnProperty.call(keyed, key)) continue;
      const expected = key === "net_by_interval_ml" ? netByInterval : cumulative;
      const actual = keyed[key];
      if (!Array.isArray(actual) || actual.length !== expected.length) {
        errors.push({
          path: `meta.derived_values_keyed.${key}`,
          code: "self_check_keyed_length_mismatch",
          message: `must contain ${expected.length} values`
        });
      } else if (actual.some((value, index) => value !== expected[index])) {
        errors.push({
          path: `meta.derived_values_keyed.${key}`,
          code: key === "net_by_interval_ml" ? "self_check_net_mismatch" : "self_check_cumulative_mismatch",
          message: "does not match computed values"
        });
      }
    }
    for (const key of KEYED_SCALARS) {
      if (Object.prototype.hasOwnProperty.call(keyed, key) && keyed[key] !== final) {
        errors.push({
          path: `meta.derived_values_keyed.${key}`,
          code: "self_check_final_mismatch",
          message: `declared ${String(keyed[key])} does not match computed ${final}`
        });
      }
    }
  }
  const times = spec.time.values;
  const expectedTrends = meta !== null && Array.isArray(meta.expected_trend) ? meta.expected_trend : [];
  for (const entry of expectedTrends) {
    if (!isRecord12(entry)) continue;
    if (typeof entry.series !== "string" || !TREND_SERIES.includes(entry.series)) continue;
    if (entry.direction !== "up" && entry.direction !== "down") continue;
    if (!Array.isArray(entry.window) || entry.window.length !== 2) continue;
    const idxStart = times.indexOf(entry.window[0]);
    const idxEnd = times.indexOf(entry.window[1]);
    if (idxStart === -1 || idxEnd === -1 || idxEnd <= idxStart) continue;
    const values = seriesValues(entry.series, intervals, netByInterval, cumulative);
    if (values === null) continue;
    const start = values[idxStart];
    const end = values[idxEnd];
    if (entry.direction === "up" && end <= start) {
      errors.push({ path: `meta.expected_trend.${entry.series}`, code: "self_check_trend_failed", message: "expected upward trend but values did not match" });
    }
    if (entry.direction === "down" && end >= start) {
      errors.push({ path: `meta.expected_trend.${entry.series}`, code: "self_check_trend_failed", message: "expected downward trend but values did not match" });
    }
  }
  if (meta !== null && isRecord12(meta.crossover)) {
    const entry = meta.crossover;
    const values = typeof entry.series === "string" ? seriesValues(entry.series, intervals, netByInterval, cumulative) : null;
    const index = typeof entry.index === "number" ? entry.index : -1;
    const from = typeof entry.from === "string" ? entry.from : null;
    const to = typeof entry.to === "string" ? entry.to : null;
    const validSigns = from !== null && to !== null && ["positive", "negative"].includes(from) && ["positive", "negative"].includes(to) && from !== to;
    const passed = values !== null && Number.isInteger(index) && index >= 1 && index < values.length && validSigns && signOf(values[index - 1]) === from && signOf(values[index]) === to;
    if (!passed) {
      errors.push({
        path: "meta.crossover",
        code: "self_check_crossover_failed",
        message: "declared crossover does not match computed adjacent signs"
      });
    }
  }
  return errors;
};
var labelForBin = (spec, index) => {
  const explicit = spec.binLabels?.[index]?.en;
  if (explicit !== void 0) return explicit;
  const value = spec.time.values[index];
  return spec.time.unit === "shift" ? `Shift ${fmt(value)}` : `${fmt(value)} hr`;
};
var signed2 = (value) => value >= 0 ? `+${fmtNum(value)}` : `\u2212${fmtNum(Math.abs(value))}`;
var buildTableInput = (spec, intervals) => {
  const { netByInterval, cumulative, final } = derive(intervals);
  const totalIntake = intervals.reduce((sum, interval) => sum + interval.intakeMl, 0);
  const totalOutput = intervals.reduce((sum, interval) => sum + interval.outputMl, 0);
  const rows = intervals.map((interval, index) => ({
    cells: {
      period: labelForBin(spec, index),
      intake: fmtNum(interval.intakeMl),
      output: fmtNum(interval.outputMl),
      net: signed2(netByInterval[index]),
      cumulative: signed2(cumulative[index])
    }
  }));
  rows.push({
    rowHeader: true,
    cells: {
      period: { text: "Total", emphasis: "bold" },
      intake: { text: fmtNum(totalIntake), emphasis: "bold" },
      output: { text: fmtNum(totalOutput), emphasis: "bold" },
      net: { text: signed2(final), emphasis: "bold" },
      cumulative: { text: signed2(final), emphasis: "bold" }
    }
  });
  return {
    title: spec.periodLabel?.en ?? "Intake & Output Trend",
    columns: [
      { key: "period", label: "", widthFr: 2, align: "left" },
      { key: "intake", label: "Intake (mL)", widthFr: 1.2, align: "right" },
      { key: "output", label: "Output (mL)", widthFr: 1.2, align: "right" },
      { key: "net", label: "Net (mL)", widthFr: 1.2, align: "right" },
      { key: "cumulative", label: "Cumulative (mL)", widthFr: 1.4, align: "right" }
    ],
    rows,
    width: 600,
    rowHeight: 26,
    headerHeight: 30
  };
};
var renderIoTrendSvg = (spec) => {
  const intervals = usableIntervals(spec) ?? [];
  const { cumulative } = derive(intervals);
  const chartHeight = 260;
  const tableInput = buildTableInput(spec, intervals);
  const tableHeight = measureDocTable(tableInput);
  const totalHeight = chartHeight + tableHeight;
  const bins = intervals.map((interval, index) => ({
    label: labelForBin(spec, index),
    positive: interval.intakeMl,
    negative: interval.outputMl
  }));
  const overlayPoints = cumulative.map((value, index) => ({
    binIndex: index,
    value
  }));
  const chart = renderDivergingBars({
    bins,
    positiveLabel: "Intake",
    negativeLabel: "Output",
    yAxisLabel: "mL by interval",
    overlay: spec.showCumulativeNet === true ? { label: "Cumulative net", points: overlayPoints, axisLabel: "net mL" } : void 0,
    width: 600,
    height: chartHeight
  });
  const table = renderDocTable(tableInput);
  const ariaLabel = escapeXml(
    spec.caption?.en ?? spec.periodLabel?.en ?? "Intake and Output Trend"
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 ${fmt(totalHeight)}" role="img" aria-label="${ariaLabel}" data-kind="io_trend">
${chart}
<g transform="translate(0 ${fmt(chartHeight)})">
${table}
</g>
</svg>`;
};
var invalidBase = {
  kind: "io_trend",
  time: { unit: "hr", values: [1, 2, 3] },
  intervals: [
    { intakeMl: 1, outputMl: 0 },
    { intakeMl: 0, outputMl: 1 },
    { intakeMl: 1, outputMl: 0 }
  ]
};
var fixtures12 = {
  valid: [
    {
      kind: "io_trend",
      time: { unit: "hr", values: [4, 8, 12, 16] },
      binLabels: [
        { en: "0400", zh: "0400" },
        { en: "0800", zh: "0800" },
        { en: "1200", zh: "1200" },
        { en: "1600", zh: "1600" }
      ],
      intervals: [
        { intakeMl: 300, outputMl: 150 },
        { intakeMl: 250, outputMl: 220 },
        { intakeMl: 200, outputMl: 400 },
        { intakeMl: 200, outputMl: 480 }
      ],
      showCumulativeNet: true,
      periodLabel: { en: "Postoperative I/O trend", zh: "\u672F\u540E\u51FA\u5165\u91CF\u8D8B\u52BF" },
      caption: { en: "Intake and output trend across the shift", zh: "\u73ED\u6B21\u5185\u51FA\u5165\u91CF\u8D8B\u52BF" }
    },
    {
      kind: "io_trend",
      time: { unit: "hr", values: [8, 16, 24] },
      intervals: [
        { intakeMl: 250, outputMl: 300 },
        { intakeMl: 200, outputMl: 280 },
        { intakeMl: 150, outputMl: 250 }
      ]
    }
  ],
  invalid: [
    { spec: { ...invalidBase, kind: "io_record" }, expectCode: "invalid_kind" },
    { spec: { kind: "io_trend", intervals: [] }, expectCode: "time_invalid" },
    { spec: { ...invalidBase, time: { unit: "day", values: [1, 2, 3] } }, expectCode: "invalid_time_unit" },
    { spec: { ...invalidBase, time: { unit: "hr", values: [1, "x", 3] } }, expectCode: "timepoint_not_number" },
    { spec: { ...invalidBase, time: { unit: "hr", values: [1, 1, 3] } }, expectCode: "timepoints_not_increasing" },
    { spec: { ...invalidBase, time: { unit: "hr", values: [1, 2] }, intervals: [{ intakeMl: 1, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }] }, expectCode: "too_few_timepoints" },
    { spec: { ...invalidBase, intervals: null }, expectCode: "intervals_invalid" },
    { spec: { ...invalidBase, intervals: [{ intakeMl: 1, outputMl: 0 }] }, expectCode: "intervals_length_mismatch" },
    { spec: { ...invalidBase, intervals: [{ intakeMl: -1, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }, { intakeMl: 1, outputMl: 0 }] }, expectCode: "invalid_volume" },
    { spec: { ...invalidBase, intervals: [{ intakeMl: 2e4, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }, { intakeMl: 1, outputMl: 0 }] }, expectCode: "volume_out_of_range" },
    { spec: { ...invalidBase, intervals: [{ intakeMl: 0, outputMl: 0 }, { intakeMl: 0, outputMl: 0 }, { intakeMl: 0, outputMl: 0 }] }, expectCode: "no_volumes" },
    { spec: { ...invalidBase, binLabels: [{ en: "1" }] }, expectCode: "bin_labels_length_mismatch" },
    { spec: { ...invalidBase, binLabels: [{ en: "1" }, { en: "" }, { en: "3" }] }, expectCode: "bin_label_en_required" },
    { spec: { ...invalidBase, binLabels: [{ en: "1" }, { en: "2", zh: "" }, { en: "3" }] }, expectCode: "bin_label_zh_empty" },
    { spec: { ...invalidBase, showCumulativeNet: "yes" }, expectCode: "invalid_show_cumulative_net" },
    { spec: { ...invalidBase, periodLabel: { en: "" } }, expectCode: "period_label_en_required" },
    { spec: { ...invalidBase, periodLabel: { en: "x", zh: "" } }, expectCode: "period_label_zh_empty" },
    { spec: { ...invalidBase, caption: { en: "" } }, expectCode: "caption_en_required" },
    { spec: { ...invalidBase, caption: { en: "x", zh: "" } }, expectCode: "caption_zh_empty" }
  ]
};
var ioTrendModule = {
  kind: "io_trend",
  requiredSchemaVersion: "1.9",
  allowedItemTypes: ["multiple_choice", "select_all", "matrix"],
  validate: validateIoTrend,
  selfCheck: selfCheckIoTrend,
  renderSvg: renderIoTrendSvg,
  fixtures: fixtures12
};
registerVisual(ioTrendModule);

// src/schema.ts
var supportedSchemaVersions = ["1.0", "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "2.0"];
var categories = [
  "Management of Care",
  "Safety and Infection Prevention and Control",
  "Health Promotion and Maintenance",
  "Psychosocial Integrity",
  "Basic Care and Comfort",
  "Pharmacological and Parenteral Therapies",
  "Reduction of Risk Potential",
  "Physiological Adaptation"
];
var NCLEX_CATEGORY_WEIGHTS = {
  "Management of Care": 0.18,
  "Pharmacological and Parenteral Therapies": 0.16,
  "Physiological Adaptation": 0.14,
  "Safety and Infection Prevention and Control": 0.13,
  "Reduction of Risk Potential": 0.12,
  "Health Promotion and Maintenance": 0.09,
  "Psychosocial Integrity": 0.09,
  "Basic Care and Comfort": 0.09
};
var categoryWeightEntries = categories.map((category) => [
  category,
  NCLEX_CATEGORY_WEIGHTS[category]
]);
for (const [category, weight] of categoryWeightEntries) {
  if (!Number.isFinite(weight) || weight <= 0) {
    throw new Error(`NCLEX category weight for "${category}" must be a positive finite number`);
  }
}
var categoryWeightTotal = categoryWeightEntries.reduce((sum, [, weight]) => sum + weight, 0);
if (Math.abs(categoryWeightTotal - 1) > 1e-9) {
  throw new Error(`NCLEX category weights must sum to 1.00; received ${categoryWeightTotal}`);
}
var standaloneItemTypes = [
  "multiple_choice",
  "select_all",
  "ordered_response",
  "fill_in_blank",
  "matrix",
  "dropdown_cloze",
  "highlight",
  "bowtie"
];
var itemTypes = [
  ...standaloneItemTypes,
  "case_study"
];
var difficulties = ["easy", "medium", "hard"];
var ngnSkills = [
  "recognize_cues",
  "analyze_cues",
  "prioritize_hypotheses",
  "generate_solutions",
  "take_action",
  "evaluate_outcomes"
];
var isRecord13 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var nonEmptyString13 = (value) => typeof value === "string" && value.trim().length > 0;
var isTextPair = (value) => isRecord13(value) && nonEmptyString13(value.en) && nonEmptyString13(value.zh);
var addTextPairError = (value, path, reasons) => {
  if (!isTextPair(value)) {
    reasons.push(`${path}.en and ${path}.zh are required`);
  }
};
var scanForReplacementChar = (value, path, reasons) => {
  if (typeof value === "string") {
    if (value.includes("\uFFFD")) {
      reasons.push(`${path || "question"} contains a U+FFFD replacement character (encoding corruption)`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanForReplacementChar(item, `${path}[${index}]`, reasons));
    return;
  }
  if (isRecord13(value)) {
    for (const [key, child] of Object.entries(value)) {
      scanForReplacementChar(child, path ? `${path}.${key}` : key, reasons);
    }
  }
};
var enumIncludes = (values, value) => typeof value === "string" && values.includes(value);
var optionIds = (question) => new Set(question.options.map((option) => option.id));
var sameSet = (left, right) => {
  if (left.length !== right.length) return false;
  const rightSet = new Set(right);
  return left.every((item) => rightSet.has(item));
};
var extractPlaceholders = (value) => {
  const matches = value.matchAll(/\{\{([^{}]+)\}\}/g);
  return Array.from(matches, (match) => match[1].trim());
};
var schemaVersionIndex = (version) => {
  const index = supportedSchemaVersions.indexOf(version);
  if (index === -1) throw new Error(`Unsupported schema version: ${version}`);
  return index;
};
var schemaVersionAtLeast = (version, floor) => schemaVersionIndex(version) >= schemaVersionIndex(floor);
var formatVisualError = (basePath, err) => err.path ? `${basePath}.${err.path} ${err.message}` : `${basePath} ${err.message}`;
var keySet = (keys) => new Set(keys);
var unknownKeys = (value, path, objectType, allowed, reasons) => {
  if (!isRecord13(value)) return;
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      reasons.push(`${path || objectType} has unknown key '${key}'`);
    }
  }
};
var collectTextPairUnknownKeys = (value, path, reasons) => {
  unknownKeys(value, path, "textPair", keySet(allowedKeySets.textPair), reasons);
};
var collectVisualUnknownKeys = (value, path, reasons) => {
  if (!isRecord13(value)) return;
  const kind = typeof value.kind === "string" ? value.kind : "unknown";
  const kindKeys = kind in allowedKeySets.visualByKind ? allowedKeySets.visualByKind[kind] : [];
  unknownKeys(value, path, `visual:${kind}`, keySet([...allowedKeySets.visualCommon, ...kindKeys]), reasons);
  if (value.caption !== void 0) collectTextPairUnknownKeys(value.caption, `${path}.caption`, reasons);
  if (value.rosc !== void 0) unknownKeys(value.rosc, `${path}.rosc`, "rosc", keySet(allowedKeySets.rosc), reasons);
  if (value.time !== void 0) unknownKeys(value.time, `${path}.time`, "visualTime", keySet(allowedKeySets.visualTime), reasons);
  if (Array.isArray(value.series)) {
    const seriesType = kind === "lab_trend" ? "labSeries" : "vitalsSeries";
    const allowed = keySet(seriesType === "labSeries" ? allowedKeySets.labSeries : allowedKeySets.vitalsSeries);
    value.series.forEach((entry, index) => unknownKeys(entry, `${path}.series[${index}]`, seriesType, allowed, reasons));
  }
  if (Array.isArray(value.medications)) {
    value.medications.forEach((medication, index) => {
      const medicationPath = `${path}.medications[${index}]`;
      unknownKeys(medication, medicationPath, "marMedication", keySet(allowedKeySets.marMedication), reasons);
      if (isRecord13(medication) && Array.isArray(medication.administrations)) {
        medication.administrations.forEach(
          (administration, adminIndex) => unknownKeys(administration, `${medicationPath}.administrations[${adminIndex}]`, "marAdministration", keySet(allowedKeySets.marAdministration), reasons)
        );
      }
    });
  }
  for (const entryKey of ["intake", "output"]) {
    if (Array.isArray(value[entryKey])) {
      value[entryKey].forEach(
        (entry, index) => unknownKeys(entry, `${path}.${entryKey}[${index}]`, "ioEntry", keySet(allowedKeySets.ioEntry), reasons)
      );
    }
  }
  if (Array.isArray(value.intervals)) {
    value.intervals.forEach(
      (interval, index) => unknownKeys(interval, `${path}.intervals[${index}]`, "ioTrendInterval", keySet(allowedKeySets.ioTrendInterval), reasons)
    );
  }
  if (Array.isArray(value.binLabels)) {
    value.binLabels.forEach(
      (label, index) => collectTextPairUnknownKeys(label, `${path}.binLabels[${index}]`, reasons)
    );
  }
  if (value.periodLabel !== void 0) collectTextPairUnknownKeys(value.periodLabel, `${path}.periodLabel`, reasons);
  if (value.title !== void 0) collectTextPairUnknownKeys(value.title, `${path}.title`, reasons);
  if (Array.isArray(value.fields)) {
    value.fields.forEach((field, index) => unknownKeys(field, `${path}.fields[${index}]`, "medLabelField", keySet(allowedKeySets.medLabelField), reasons));
  }
  if (Array.isArray(value.settings)) {
    value.settings.forEach((setting, index) => unknownKeys(setting, `${path}.settings[${index}]`, "deviceSetting", keySet(allowedKeySets.deviceSetting), reasons));
  }
  if (Array.isArray(value.contractions)) {
    value.contractions.forEach(
      (contraction, index) => unknownKeys(contraction, `${path}.contractions[${index}]`, "fetalContraction", keySet(allowedKeySets.fetalContraction), reasons)
    );
  }
  if (Array.isArray(value.accelerations)) {
    value.accelerations.forEach(
      (acceleration, index) => unknownKeys(acceleration, `${path}.accelerations[${index}]`, "fetalAcceleration", keySet(allowedKeySets.fetalAcceleration), reasons)
    );
  }
  if (Array.isArray(value.decelerations)) {
    value.decelerations.forEach(
      (deceleration, index) => unknownKeys(deceleration, `${path}.decelerations[${index}]`, "fetalDeceleration", keySet(allowedKeySets.fetalDeceleration), reasons)
    );
  }
};
var collectQuestionMetaUnknownKeys = (value, path, reasons) => {
  unknownKeys(value, path, "questionMeta", keySet(allowedKeySets.questionMeta), reasons);
  if (!isRecord13(value)) return;
  if (Array.isArray(value.expected_trend)) {
    value.expected_trend.forEach(
      (entry, index) => unknownKeys(entry, `${path}.expected_trend[${index}]`, "expectedTrend", keySet(allowedKeySets.expectedTrend), reasons)
    );
  }
  if (Array.isArray(value.expected_flags)) {
    value.expected_flags.forEach(
      (entry, index) => unknownKeys(entry, `${path}.expected_flags[${index}]`, "expectedFlag", keySet(allowedKeySets.expectedFlag), reasons)
    );
  }
  if (Array.isArray(value.reference_bands)) {
    value.reference_bands.forEach(
      (entry, index) => unknownKeys(entry, `${path}.reference_bands[${index}]`, "referenceBand", keySet(allowedKeySets.referenceBand), reasons)
    );
  }
  if (isRecord13(value.crossover)) {
    unknownKeys(value.crossover, `${path}.crossover`, "crossoverAssertion", keySet(allowedKeySets.crossoverAssertion), reasons);
  }
};
var collectRationaleUnknownKeys = (value, path, reasons) => {
  unknownKeys(value, path, "rationale", keySet(allowedKeySets.rationale), reasons);
  if (!isRecord13(value)) return;
  if (value.correct !== void 0) collectTextPairUnknownKeys(value.correct, `${path}.correct`, reasons);
  if (Array.isArray(value.byChoice)) {
    value.byChoice.forEach(
      (choice, index) => unknownKeys(choice, `${path}.byChoice[${index}]`, "rationaleChoice", keySet(allowedKeySets.rationaleChoice), reasons)
    );
  }
  if (Array.isArray(value.visuals)) {
    value.visuals.forEach((visual, index) => collectVisualUnknownKeys(visual, `${path}.visuals[${index}]`, reasons));
  }
};
var collectStructuredMeasurementsUnknownKeys = (value, path, reasons) => {
  unknownKeys(value, path, "structuredMeasurements", keySet(allowedKeySets.structuredMeasurements), reasons);
  if (!isRecord13(value) || !Array.isArray(value.panels)) return;
  value.panels.forEach((panel, panelIndex) => {
    const panelPath = `${path}.panels[${panelIndex}]`;
    unknownKeys(panel, panelPath, "structuredMeasurementPanel", keySet(allowedKeySets.structuredMeasurementPanel), reasons);
    if (!isRecord13(panel)) return;
    if (Array.isArray(panel.columns)) {
      panel.columns.forEach((column, columnIndex) => {
        const columnPath = `${panelPath}.columns[${columnIndex}]`;
        unknownKeys(column, columnPath, "structuredMeasurementColumn", keySet(allowedKeySets.structuredMeasurementColumn), reasons);
        if (isRecord13(column) && column.label !== void 0) {
          collectTextPairUnknownKeys(column.label, `${columnPath}.label`, reasons);
        }
      });
    }
    if (Array.isArray(panel.rows)) {
      panel.rows.forEach((row, rowIndex) => {
        const rowPath = `${panelPath}.rows[${rowIndex}]`;
        unknownKeys(row, rowPath, "structuredMeasurementRow", keySet(allowedKeySets.structuredMeasurementRow), reasons);
        if (!isRecord13(row)) return;
        collectTextPairUnknownKeys(row.label, `${rowPath}.label`, reasons);
        if (Array.isArray(row.values)) {
          row.values.forEach(
            (entry, valueIndex) => unknownKeys(entry, `${rowPath}.values[${valueIndex}]`, "structuredMeasurementValue", keySet(allowedKeySets.structuredMeasurementValue), reasons)
          );
        }
      });
    }
  });
};
var collectOptionsUnknownKeys = (value, path, reasons) => {
  if (!Array.isArray(value)) return;
  value.forEach((option, index) => unknownKeys(option, `${path}[${index}]`, "option", keySet(allowedKeySets.option), reasons));
};
var collectCaseStudyExhibitUnknownKeys = (value, path, reasons) => {
  unknownKeys(value, path, "caseStudyExhibit", keySet(allowedKeySets.caseStudyExhibit), reasons);
  if (!isRecord13(value)) return;
  collectTextPairUnknownKeys(value.title, `${path}.title`, reasons);
  collectTextPairUnknownKeys(value.content, `${path}.content`, reasons);
  if (value.visual !== void 0) collectVisualUnknownKeys(value.visual, `${path}.visual`, reasons);
  if (value.structuredMeasurements !== void 0) {
    collectStructuredMeasurementsUnknownKeys(value.structuredMeasurements, `${path}.structuredMeasurements`, reasons);
  }
};
var collectQuestionUnknownKeys = (value, path, reasons, options = {}) => {
  if (!isRecord13(value)) return;
  const itemType = typeof value.itemType === "string" ? value.itemType : "unknown";
  const itemTypeKeys = itemType in allowedKeySets.questionByItemType ? allowedKeySets.questionByItemType[itemType] : [];
  const caseSubQuestionKeys = options.caseSubQuestion ? allowedKeySets.caseSubQuestion : [];
  unknownKeys(
    value,
    path,
    `question:${itemType}`,
    keySet([...allowedKeySets.questionCommon, ...itemTypeKeys, ...caseSubQuestionKeys]),
    reasons
  );
  collectTextPairUnknownKeys(value.stem, `${path}.stem`, reasons);
  collectTextPairUnknownKeys(value.testTakingStrategy, `${path}.testTakingStrategy`, reasons);
  if (value.rationale !== void 0) collectRationaleUnknownKeys(value.rationale, `${path}.rationale`, reasons);
  if (value.visual !== void 0) collectVisualUnknownKeys(value.visual, `${path}.visual`, reasons);
  if (value.meta !== void 0) collectQuestionMetaUnknownKeys(value.meta, `${path}.meta`, reasons);
  if (Array.isArray(value.glossary)) {
    value.glossary.forEach(
      (term, index) => unknownKeys(term, `${path}.glossary[${index}]`, "glossaryTerm", keySet(allowedKeySets.glossaryTerm), reasons)
    );
  }
  if (Array.isArray(value.options)) collectOptionsUnknownKeys(value.options, `${path}.options`, reasons);
  if (Array.isArray(value.blanks)) {
    value.blanks.forEach((blank, index) => {
      const blankPath = `${path}.blanks[${index}]`;
      unknownKeys(blank, blankPath, "blank", keySet(allowedKeySets.blank), reasons);
      if (isRecord13(blank)) {
        collectTextPairUnknownKeys(blank.prompt, `${blankPath}.prompt`, reasons);
        if (blank.numeric !== void 0) unknownKeys(blank.numeric, `${blankPath}.numeric`, "blankNumeric", keySet(allowedKeySets.blankNumeric), reasons);
      }
    });
  }
  if (isRecord13(value.matrix)) {
    unknownKeys(value.matrix, `${path}.matrix`, "matrix", keySet(allowedKeySets.matrix), reasons);
    collectOptionsUnknownKeys(value.matrix.rows, `${path}.matrix.rows`, reasons);
    collectOptionsUnknownKeys(value.matrix.columns, `${path}.matrix.columns`, reasons);
  }
  if (Array.isArray(value.correct) && itemType === "matrix") {
    value.correct.forEach(
      (entry, index) => unknownKeys(entry, `${path}.correct[${index}]`, "matrixCorrect", keySet(allowedKeySets.matrixCorrect), reasons)
    );
  }
  if (value.clozeStem !== void 0) collectTextPairUnknownKeys(value.clozeStem, `${path}.clozeStem`, reasons);
  if (Array.isArray(value.dropdowns)) {
    value.dropdowns.forEach((dropdown, index) => {
      const dropdownPath = `${path}.dropdowns[${index}]`;
      unknownKeys(dropdown, dropdownPath, "dropdown", keySet(allowedKeySets.dropdown), reasons);
      if (isRecord13(dropdown)) collectOptionsUnknownKeys(dropdown.options, `${dropdownPath}.options`, reasons);
    });
  }
  if (isRecord13(value.highlight)) {
    unknownKeys(value.highlight, `${path}.highlight`, "highlight", keySet(allowedKeySets.highlight), reasons);
    if (Array.isArray(value.highlight.segments)) {
      value.highlight.segments.forEach(
        (segment, index) => unknownKeys(segment, `${path}.highlight.segments[${index}]`, "highlightSegment", keySet(allowedKeySets.highlightSegment), reasons)
      );
    }
  }
  if (isRecord13(value.bowtie)) {
    unknownKeys(value.bowtie, `${path}.bowtie`, "bowtie", keySet(allowedKeySets.bowtie), reasons);
    for (const zoneName of ["condition", "actions", "parameters"]) {
      const zone = value.bowtie[zoneName];
      const zonePath = `${path}.bowtie.${zoneName}`;
      unknownKeys(zone, zonePath, "bowtieZone", keySet(allowedKeySets.bowtieZone), reasons);
      if (isRecord13(zone)) {
        if (zone.prompt !== void 0) collectTextPairUnknownKeys(zone.prompt, `${zonePath}.prompt`, reasons);
        if (Array.isArray(zone.tokens)) {
          zone.tokens.forEach(
            (token, index) => unknownKeys(token, `${zonePath}.tokens[${index}]`, "bowtieToken", keySet(allowedKeySets.bowtieToken), reasons)
          );
        }
      }
    }
  }
  if (isRecord13(value.caseStudy)) {
    const casePath = `${path}.caseStudy`;
    unknownKeys(value.caseStudy, casePath, "caseStudy", keySet(allowedKeySets.caseStudy), reasons);
    collectTextPairUnknownKeys(value.caseStudy.title, `${casePath}.title`, reasons);
    if (value.caseStudy.summary !== void 0) collectTextPairUnknownKeys(value.caseStudy.summary, `${casePath}.summary`, reasons);
    if (Array.isArray(value.caseStudy.exhibits)) {
      value.caseStudy.exhibits.forEach(
        (exhibit, index) => collectCaseStudyExhibitUnknownKeys(exhibit, `${casePath}.exhibits[${index}]`, reasons)
      );
    }
    if (Array.isArray(value.caseStudy.stages)) {
      value.caseStudy.stages.forEach((stage, index) => {
        const stagePath = `${casePath}.stages[${index}]`;
        unknownKeys(stage, stagePath, "caseStudyStage", keySet(allowedKeySets.caseStudyStage), reasons);
        if (isRecord13(stage)) {
          collectTextPairUnknownKeys(stage.title, `${stagePath}.title`, reasons);
          if (stage.trigger !== void 0) collectTextPairUnknownKeys(stage.trigger, `${stagePath}.trigger`, reasons);
          if (stage.narrative !== void 0) collectTextPairUnknownKeys(stage.narrative, `${stagePath}.narrative`, reasons);
          if (Array.isArray(stage.exhibits)) {
            stage.exhibits.forEach(
              (exhibit, exhibitIndex) => collectCaseStudyExhibitUnknownKeys(exhibit, `${stagePath}.exhibits[${exhibitIndex}]`, reasons)
            );
          }
        }
      });
    }
    if (Array.isArray(value.caseStudy.questions)) {
      value.caseStudy.questions.forEach(
        (caseQuestion, index) => collectQuestionUnknownKeys(caseQuestion, `${casePath}.questions[${index}]`, reasons, { caseSubQuestion: true })
      );
    }
  }
};
var validateVisual = (value, basePath, reasons, options = {}) => {
  if (!isRecord13(value)) {
    reasons.push(`${basePath} must be an object`);
    return;
  }
  const mod = typeof value.kind === "string" ? getVisual(value.kind) : void 0;
  if (!mod) {
    reasons.push(`${basePath}.kind is invalid`);
    return;
  }
  if (options.itemType !== void 0) {
    const allowed = mod.allowedItemTypes ?? VISUAL_ITEM_TYPES;
    if (!allowed.includes(options.itemType)) {
      reasons.push(
        mod.allowedItemTypes ? `visual of kind ${mod.kind} is not allowed on ${options.itemType}` : "visual is only supported on multiple_choice, select_all, matrix, and case-study exhibits"
      );
      return;
    }
  }
  if (options.schemaVersion !== void 0 && !schemaVersionAtLeast(options.schemaVersion, mod.requiredSchemaVersion ?? "1.2")) {
    reasons.push(`${basePath} requires schema ${mod.requiredSchemaVersion ?? "1.2"}`);
  }
  const initialReasonsLen = reasons.length;
  for (const err of mod.validate(value)) reasons.push(formatVisualError(basePath, err));
  if (mod.selfCheck && options.question && reasons.length === initialReasonsLen) {
    for (const err of mod.selfCheck(value, options.question)) reasons.push(formatVisualError(basePath, err));
  }
};
var forbiddenStructuredMeasurementKeys = /* @__PURE__ */ new Set([
  "flag",
  "referenceRange",
  "reference_range",
  "refRange",
  "refBand",
  "referenceBand",
  "low",
  "high",
  "range",
  "normalRange"
]);
var collectForbiddenStructuredMeasurementFields = (value, path, reasons) => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectForbiddenStructuredMeasurementFields(item, `${path}[${index}]`, reasons));
    return;
  }
  if (!isRecord13(value)) return;
  for (const [key, child] of Object.entries(value)) {
    if (forbiddenStructuredMeasurementKeys.has(key)) {
      reasons.push(`${path}.${key} is not allowed in structuredMeasurements v1 (values-only; omit flags and reference ranges)`);
    }
    collectForbiddenStructuredMeasurementFields(child, `${path}.${key}`, reasons);
  }
};
var isAcceptedMeasurementUnit = (key, unit) => {
  const def = MEASUREMENT_ALLOWLIST[key];
  if (!def) return false;
  const normalized = normalizeUnit(unit);
  return def.acceptedSourceUnits.map(normalizeUnit).includes(normalized);
};
var validateStructuredMeasurements = (value, path, reasons) => {
  if (!isRecord13(value)) {
    reasons.push(`${path} must be an object`);
    return;
  }
  collectForbiddenStructuredMeasurementFields(value, path, reasons);
  if (value.population !== void 0 && !isPopulation(value.population)) {
    reasons.push(`${path}.population must be ${POPULATIONS.join(", ")} when present`);
  }
  if (!Array.isArray(value.panels) || value.panels.length === 0) {
    reasons.push(`${path}.panels must be a non-empty array`);
    return;
  }
  value.panels.forEach((panel, panelIndex) => {
    const panelPath = `${path}.panels[${panelIndex}]`;
    if (!isRecord13(panel)) {
      reasons.push(`${panelPath} must be an object`);
      return;
    }
    if (panel.kind !== "labs" && panel.kind !== "vitals") {
      reasons.push(`${panelPath}.kind must be labs or vitals`);
    }
    if (!Array.isArray(panel.columns) || panel.columns.length === 0) {
      reasons.push(`${panelPath}.columns must be a non-empty array`);
    }
    if (!Array.isArray(panel.rows) || panel.rows.length === 0) {
      reasons.push(`${panelPath}.rows must be a non-empty array`);
    }
    const columnIds = /* @__PURE__ */ new Set();
    if (Array.isArray(panel.columns)) {
      panel.columns.forEach((column, columnIndex) => {
        const columnPath = `${panelPath}.columns[${columnIndex}]`;
        if (!isRecord13(column)) {
          reasons.push(`${columnPath} must be an object`);
          return;
        }
        if (!nonEmptyString13(column.id)) {
          reasons.push(`${columnPath}.id is required`);
        } else if (columnIds.has(column.id)) {
          reasons.push(`${columnPath}.id duplicates column id ${column.id}`);
        } else {
          columnIds.add(column.id);
        }
        if (column.label !== void 0) addTextPairError(column.label, `${columnPath}.label`, reasons);
      });
    }
    const rowKeys = /* @__PURE__ */ new Set();
    if (Array.isArray(panel.rows)) {
      panel.rows.forEach((row, rowIndex) => {
        const rowPath = `${panelPath}.rows[${rowIndex}]`;
        if (!isRecord13(row)) {
          reasons.push(`${rowPath} must be an object`);
          return;
        }
        if (!nonEmptyString13(row.key)) {
          reasons.push(`${rowPath}.key is required`);
        } else {
          if (!ALLOWLIST_KEYS.has(row.key)) {
            reasons.push(`${rowPath}.key '${row.key}' is not in the measurement allowlist`);
          } else {
            const def = MEASUREMENT_ALLOWLIST[row.key];
            const expectedKind = panel.kind === "labs" ? "lab" : "vital";
            if (def.kind !== expectedKind) {
              reasons.push(`${rowPath}.key '${row.key}' is a ${def.kind} measurement and cannot appear in a ${panel.kind} panel`);
            }
          }
          if (rowKeys.has(row.key)) reasons.push(`${rowPath}.key duplicates row key ${row.key}`);
          rowKeys.add(row.key);
        }
        addTextPairError(row.label, `${rowPath}.label`, reasons);
        if (!Array.isArray(row.values) || row.values.length === 0) {
          reasons.push(`${rowPath}.values must be a non-empty array`);
          return;
        }
        row.values.forEach((entry, valueIndex) => {
          const valuePath = `${rowPath}.values[${valueIndex}]`;
          if (!isRecord13(entry)) {
            reasons.push(`${valuePath} must be an object`);
            return;
          }
          if (!nonEmptyString13(entry.columnId)) {
            reasons.push(`${valuePath}.columnId is required`);
          } else if (!columnIds.has(entry.columnId)) {
            reasons.push(`${valuePath}.columnId '${entry.columnId}' does not match a column id in the same panel`);
          }
          if (!nonEmptyString13(entry.value)) {
            reasons.push(`${valuePath}.value is required`);
          } else if (/[<>≤≥]/.test(entry.value)) {
            reasons.push(`${valuePath}.value must be an exact scalar without comparator symbols; store the comparator in bound`);
          }
          if (!nonEmptyString13(entry.unit)) {
            reasons.push(`${valuePath}.unit is required`);
          } else if (nonEmptyString13(row.key) && ALLOWLIST_KEYS.has(row.key) && !isAcceptedMeasurementUnit(row.key, entry.unit)) {
            reasons.push(`${valuePath}.unit '${entry.unit}' is not accepted for measurement key '${row.key}'`);
          }
          if (entry.context !== void 0 && entry.context !== "post_intervention") {
            reasons.push(`${valuePath}.context must be post_intervention when present`);
          }
          if (entry.bound !== void 0 && entry.bound !== ">" && entry.bound !== "<") {
            reasons.push(`${valuePath}.bound must be > or < when present`);
          }
        });
      });
    }
  });
};
var validateQuestion = (raw, options = {}) => {
  const allowCaseStudy = options.allowCaseStudy ?? true;
  const reasons = [];
  if (!isRecord13(raw)) {
    return { ok: false, reasons: ["question must be an object"] };
  }
  if (options.rejectUnknownKeys === true) {
    collectQuestionUnknownKeys(raw, "question", reasons);
  }
  scanForReplacementChar(raw, "", reasons);
  if (!nonEmptyString13(raw.id)) reasons.push("missing id");
  if (raw._compileManifest !== void 0) {
    reasons.push("_compileManifest is raw-only and must be stripped before canonical/import validation");
  }
  if (!enumIncludes(itemTypes, raw.itemType)) {
    reasons.push("invalid itemType");
  } else if (!allowCaseStudy && raw.itemType === "case_study") {
    reasons.push("nested case_study items are not supported");
  }
  if (!enumIncludes(categories, raw.category)) reasons.push("invalid category");
  if (!nonEmptyString13(raw.topic)) {
    reasons.push("missing topic");
  } else if (/[　-〿぀-ゟ゠-ヿ㐀-䶿一-鿿豈-﫿＀-￯]/.test(raw.topic)) {
    reasons.push("topic must be English-only (no CJK characters)");
  }
  if (!enumIncludes(difficulties, raw.difficulty)) reasons.push("invalid difficulty");
  if (raw.ngnSkill !== void 0 && !enumIncludes(ngnSkills, raw.ngnSkill)) reasons.push("invalid ngnSkill");
  addTextPairError(raw.stem, "stem", reasons);
  addTextPairError(raw.testTakingStrategy, "testTakingStrategy", reasons);
  if (raw.visual !== void 0) {
    validateVisual(raw.visual, "visual", reasons, {
      itemType: raw.itemType,
      question: raw
    });
  }
  if (!isRecord13(raw.rationale)) {
    reasons.push("missing rationale");
  } else {
    addTextPairError(raw.rationale.correct, "rationale.correct", reasons);
    if (raw.rationale.byChoice !== void 0 && !Array.isArray(raw.rationale.byChoice)) {
      reasons.push("rationale.byChoice must be an array when present");
    }
    if (Array.isArray(raw.rationale.byChoice)) {
      raw.rationale.byChoice.forEach((choice, index) => {
        if (!isRecord13(choice) || !nonEmptyString13(choice.refId) || !nonEmptyString13(choice.en) || !nonEmptyString13(choice.zh)) {
          reasons.push(`rationale.byChoice[${index}] requires refId, en, and zh`);
        }
      });
    }
    if (raw.rationale.visuals !== void 0) {
      if (!Array.isArray(raw.rationale.visuals)) {
        reasons.push("rationale.visuals must be an array when present");
      } else if (raw.rationale.visuals.length === 0) {
        reasons.push("rationale.visuals must not be empty (omit the field for no visuals)");
      } else if (raw.rationale.visuals.length > 6) {
        reasons.push("rationale.visuals must contain at most 6 entries");
      } else {
        raw.rationale.visuals.forEach((visual, index) => {
          validateVisual(visual, `rationale.visuals[${index}]`, reasons);
        });
      }
    }
  }
  if (!Array.isArray(raw.glossary)) {
    reasons.push("glossary must be an array");
  } else {
    raw.glossary.forEach((term, index) => {
      if (!isRecord13(term) || !nonEmptyString13(term.termEn) || !nonEmptyString13(term.termZh) || !nonEmptyString13(term.defZh)) {
        reasons.push(`glossary[${index}] requires termEn, termZh, and defZh`);
      }
    });
  }
  if (reasons.length > 0) return { ok: false, reasons };
  const question = raw;
  if (question.itemType === "multiple_choice" || question.itemType === "select_all" || question.itemType === "ordered_response") {
    validateOptionQuestion(question, reasons);
  } else if (question.itemType === "fill_in_blank") {
    validateFillInBlank(question, reasons);
  } else if (question.itemType === "matrix") {
    validateMatrix(question, reasons);
  } else if (question.itemType === "dropdown_cloze") {
    validateDropdownCloze(question, reasons);
  } else if (question.itemType === "highlight") {
    validateHighlight(question, reasons);
  } else if (question.itemType === "bowtie") {
    validateBowtie(question, reasons);
  } else if (question.itemType === "case_study") {
    validateCaseStudy(question, reasons);
  }
  return reasons.length > 0 ? { ok: false, reasons } : { ok: true, value: question };
};
var isStandaloneQuestion = (question) => question.itemType !== "case_study";
var validateOptionQuestion = (question, reasons) => {
  if (!Array.isArray(question.options) || question.options.length === 0) {
    reasons.push("option type requires options");
    return;
  }
  const minOptions = question.itemType === "select_all" ? 5 : 3;
  const maxOptions = question.itemType === "select_all" || question.itemType === "ordered_response" ? 6 : 5;
  if (question.options.length < minOptions || question.options.length > maxOptions) {
    reasons.push(`${question.itemType} requires ${minOptions}-${maxOptions} options`);
  }
  const seen = /* @__PURE__ */ new Set();
  question.options.forEach((option, index) => {
    if (!isRecord13(option) || !nonEmptyString13(option.id) || !nonEmptyString13(option.en) || !nonEmptyString13(option.zh)) {
      reasons.push(`options[${index}] requires id, en, and zh`);
      return;
    }
    if (seen.has(option.id)) reasons.push(`duplicate option id ${option.id}`);
    seen.add(option.id);
  });
  if (!Array.isArray(question.correct) || question.correct.length === 0) {
    reasons.push("option type requires correct");
    return;
  }
  const ids = optionIds(question);
  question.correct.forEach((id) => {
    if (!ids.has(id)) reasons.push(`correct id ${id} is not in options`);
  });
  if (new Set(question.correct).size !== question.correct.length) reasons.push("correct contains duplicate ids");
  if (question.itemType === "multiple_choice" && question.correct.length !== 1) {
    reasons.push("multiple_choice correct must contain exactly one id");
  }
  if (question.itemType === "ordered_response" && !sameSet(question.correct, question.options.map((option) => option.id))) {
    reasons.push("ordered_response correct must be a permutation of every option id");
  }
  const byChoiceIds = new Set(question.rationale.byChoice?.map((choice) => choice.refId));
  if (byChoiceIds.size !== question.options.length || question.options.some((option) => !byChoiceIds.has(option.id))) {
    reasons.push("option types require one rationale.byChoice entry per option");
  }
};
var validateFillInBlank = (question, reasons) => {
  if (!Array.isArray(question.blanks) || question.blanks.length === 0) {
    reasons.push("fill_in_blank requires blanks");
    return;
  }
  const seenBlankIds = /* @__PURE__ */ new Set();
  question.blanks.forEach((blank, index) => {
    if (!isRecord13(blank)) {
      reasons.push(`blanks[${index}] must be an object`);
      return;
    }
    if (!nonEmptyString13(blank.id)) reasons.push(`blanks[${index}] requires id`);
    if (nonEmptyString13(blank.id)) {
      if (seenBlankIds.has(blank.id)) reasons.push(`duplicate blank id ${blank.id}`);
      seenBlankIds.add(blank.id);
    }
    addTextPairError(blank.prompt, `blanks[${index}].prompt`, reasons);
    const hasAcceptable = Array.isArray(blank.acceptable) && blank.acceptable.some(nonEmptyString13);
    const hasNumeric = isRecord13(blank.numeric) && typeof blank.numeric.value === "number" && typeof blank.numeric.tolerance === "number";
    if (!hasAcceptable && !hasNumeric) reasons.push(`blanks[${index}] requires acceptable or numeric`);
  });
};
var validateMatrix = (question, reasons) => {
  if (!isRecord13(question.matrix) || !Array.isArray(question.matrix.rows) || !Array.isArray(question.matrix.columns)) {
    reasons.push("matrix requires rows and columns");
    return;
  }
  if (question.matrix.selectionMode !== "single_per_row" && question.matrix.selectionMode !== "multiple_per_row") {
    reasons.push("matrix.selectionMode is invalid");
  }
  const rowIds = /* @__PURE__ */ new Set();
  const columnIds = /* @__PURE__ */ new Set();
  question.matrix.rows.forEach((row, index) => {
    if (!isRecord13(row) || !nonEmptyString13(row.id) || !nonEmptyString13(row.en) || !nonEmptyString13(row.zh)) {
      reasons.push(`matrix.rows[${index}] requires id, en, and zh`);
      return;
    }
    if (rowIds.has(row.id)) reasons.push(`duplicate matrix row id ${row.id}`);
    rowIds.add(row.id);
  });
  question.matrix.columns.forEach((column, index) => {
    if (!isRecord13(column) || !nonEmptyString13(column.id) || !nonEmptyString13(column.en) || !nonEmptyString13(column.zh)) {
      reasons.push(`matrix.columns[${index}] requires id, en, and zh`);
      return;
    }
    if (columnIds.has(column.id)) reasons.push(`duplicate matrix column id ${column.id}`);
    columnIds.add(column.id);
  });
  if (!Array.isArray(question.correct) || question.correct.length !== question.matrix.rows.length) {
    reasons.push("matrix correct requires exactly one entry per row");
    return;
  }
  const correctRowIds = /* @__PURE__ */ new Set();
  question.correct.forEach((entry, index) => {
    if (!isRecord13(entry)) {
      reasons.push(`matrix correct[${index}] must be an object`);
      return;
    }
    if (!rowIds.has(entry.rowId)) reasons.push(`matrix correct[${index}] has unknown rowId`);
    if (correctRowIds.has(entry.rowId)) reasons.push(`matrix correct has duplicate rowId ${entry.rowId}`);
    correctRowIds.add(entry.rowId);
    if (!Array.isArray(entry.columnIds) || entry.columnIds.length === 0) {
      reasons.push(`matrix correct[${index}] requires columnIds`);
      return;
    }
    if (new Set(entry.columnIds).size !== entry.columnIds.length) {
      reasons.push(`matrix correct[${index}] contains duplicate columnIds`);
    }
    entry.columnIds.forEach((columnId) => {
      if (!columnIds.has(columnId)) reasons.push(`matrix correct[${index}] has unknown columnId ${columnId}`);
    });
    if (question.matrix.selectionMode === "single_per_row" && entry.columnIds.length !== 1) {
      reasons.push(`matrix single_per_row row ${entry.rowId} must have exactly one columnId`);
    }
  });
  rowIds.forEach((rowId) => {
    if (!correctRowIds.has(rowId)) reasons.push(`matrix correct is missing rowId ${rowId}`);
  });
};
var validateDropdownCloze = (question, reasons) => {
  if (question.itemType !== "dropdown_cloze") return;
  addTextPairError(question.clozeStem, "clozeStem", reasons);
  if (!isTextPair(question.clozeStem)) return;
  if (!Array.isArray(question.dropdowns) || question.dropdowns.length === 0) {
    reasons.push("dropdown_cloze requires dropdowns");
    return;
  }
  const dropdownIds = /* @__PURE__ */ new Set();
  question.dropdowns.forEach((dropdown, index) => {
    if (!isRecord13(dropdown) || !nonEmptyString13(dropdown.id)) {
      reasons.push(`dropdowns[${index}] requires id`);
      return;
    }
    if (dropdownIds.has(dropdown.id)) reasons.push(`duplicate dropdown id ${dropdown.id}`);
    dropdownIds.add(dropdown.id);
  });
  const enPlaceholders = extractPlaceholders(question.clozeStem.en);
  const zhPlaceholders = extractPlaceholders(question.clozeStem.zh);
  const allPlaceholders = /* @__PURE__ */ new Set([...enPlaceholders, ...zhPlaceholders]);
  dropdownIds.forEach((id) => {
    if (!enPlaceholders.includes(id) || !zhPlaceholders.includes(id)) reasons.push(`dropdown placeholder ${id} must appear in en and zh`);
  });
  allPlaceholders.forEach((id) => {
    if (!dropdownIds.has(id)) reasons.push(`placeholder ${id} has no matching dropdown`);
  });
  question.dropdowns.forEach((dropdown, index) => {
    if (!isRecord13(dropdown) || !nonEmptyString13(dropdown.id)) return;
    if (!Array.isArray(dropdown.options) || dropdown.options.length === 0) {
      reasons.push(`dropdowns[${index}] requires options`);
      return;
    }
    const ids = /* @__PURE__ */ new Set();
    dropdown.options.forEach((option, optionIndex) => {
      if (!isRecord13(option) || !nonEmptyString13(option.id) || !nonEmptyString13(option.en) || !nonEmptyString13(option.zh)) {
        reasons.push(`dropdowns[${index}].options[${optionIndex}] requires id, en, and zh`);
        return;
      }
      if (ids.has(option.id)) reasons.push(`dropdown ${dropdown.id} has duplicate option id ${option.id}`);
      ids.add(option.id);
    });
    if (!nonEmptyString13(dropdown.correct) || !ids.has(dropdown.correct)) {
      reasons.push(`dropdown ${dropdown.id} correct id is not in options`);
    }
    const correctOption = dropdown.options.find((option) => isRecord13(option) && option.id === dropdown.correct);
    if (isRecord13(correctOption)) {
      ["en", "zh"].forEach((locale) => {
        const answer = correctOption[locale];
        if (nonEmptyString13(answer) && question.clozeStem[locale].includes(answer)) {
          reasons.push(`dropdown ${dropdown.id} leaks its correct answer in clozeStem.${locale}`);
        }
      });
    }
  });
};
var validateHighlight = (question, reasons) => {
  if (!isRecord13(question.highlight)) {
    reasons.push("highlight requires highlight");
    return;
  }
  if (!Array.isArray(question.highlight.segments) || question.highlight.segments.length === 0) {
    reasons.push("highlight requires segments");
    return;
  }
  const segmentIds = /* @__PURE__ */ new Set();
  const selectableIds = /* @__PURE__ */ new Set();
  question.highlight.segments.forEach((segment, index) => {
    if (!isRecord13(segment) || !nonEmptyString13(segment.id) || !nonEmptyString13(segment.en) || !nonEmptyString13(segment.zh)) {
      reasons.push(`highlight.segments[${index}] requires id, en, and zh`);
      return;
    }
    if (segment.selectable !== void 0 && typeof segment.selectable !== "boolean") {
      reasons.push(`highlight.segments[${index}].selectable must be boolean when present`);
    }
    if (segmentIds.has(segment.id)) reasons.push(`duplicate highlight segment id ${segment.id}`);
    segmentIds.add(segment.id);
    if (segment.selectable === true) selectableIds.add(segment.id);
  });
  if (selectableIds.size === 0) reasons.push("highlight requires at least one selectable segment");
  if (!Array.isArray(question.highlight.correct) || question.highlight.correct.length === 0) {
    reasons.push("highlight requires correct");
    return;
  }
  if (new Set(question.highlight.correct).size !== question.highlight.correct.length) {
    reasons.push("highlight correct contains duplicate ids");
  }
  question.highlight.correct.forEach((id) => {
    if (!selectableIds.has(id)) reasons.push(`highlight correct id ${id} is not a selectable segment`);
  });
  if (question.highlight.correct.length >= selectableIds.size) {
    reasons.push("highlight must include at least one selectable distractor");
  }
  const seenRationaleIds = /* @__PURE__ */ new Set();
  question.rationale.byChoice?.forEach((choice) => {
    if (seenRationaleIds.has(choice.refId)) {
      reasons.push(`rationale.byChoice contains duplicate refId ${choice.refId}`);
    }
    seenRationaleIds.add(choice.refId);
    if (!selectableIds.has(choice.refId)) {
      reasons.push(`rationale.byChoice refId ${choice.refId} is not a selectable highlight segment`);
    }
  });
};
var validateBowtie = (question, reasons) => {
  if (!isRecord13(question.bowtie)) {
    reasons.push("bowtie requires bowtie");
    return;
  }
  const allTokenIds = /* @__PURE__ */ new Set();
  const zones = [
    ["condition", question.bowtie.condition, 1],
    ["actions", question.bowtie.actions, 2],
    ["parameters", question.bowtie.parameters, 2]
  ];
  for (const [zoneName, zone, correctCount] of zones) {
    if (!isRecord13(zone)) {
      reasons.push(`bowtie.${zoneName} must be an object`);
      continue;
    }
    if (zone.prompt !== void 0) {
      addTextPairError(zone.prompt, `bowtie.${zoneName}.prompt`, reasons);
    }
    if (!Array.isArray(zone.tokens) || zone.tokens.length === 0) {
      reasons.push(`bowtie.${zoneName}.tokens must be a non-empty array`);
      continue;
    }
    const tokenIds = /* @__PURE__ */ new Set();
    const enTexts = /* @__PURE__ */ new Set();
    const zhTexts = /* @__PURE__ */ new Set();
    zone.tokens.forEach((token, index) => {
      if (!isRecord13(token) || !nonEmptyString13(token.id) || !nonEmptyString13(token.en) || !nonEmptyString13(token.zh)) {
        reasons.push(`bowtie.${zoneName}.tokens[${index}] requires id, en, and zh`);
        return;
      }
      if (allTokenIds.has(token.id)) reasons.push(`duplicate bowtie token id ${token.id}`);
      allTokenIds.add(token.id);
      tokenIds.add(token.id);
      if (enTexts.has(token.en)) reasons.push(`bowtie.${zoneName} has duplicate en token text ${token.en}`);
      if (zhTexts.has(token.zh)) reasons.push(`bowtie.${zoneName} has duplicate zh token text ${token.zh}`);
      enTexts.add(token.en);
      zhTexts.add(token.zh);
    });
    const correctIds = zoneName === "condition" ? nonEmptyString13(zone.correct) ? [zone.correct] : [] : Array.isArray(zone.correct) ? zone.correct : [];
    if (zoneName === "condition" && !nonEmptyString13(zone.correct)) {
      reasons.push("bowtie.condition.correct must be a token id");
    }
    if (zoneName !== "condition" && (!Array.isArray(zone.correct) || zone.correct.length !== correctCount)) {
      reasons.push(`bowtie.${zoneName}.correct must contain exactly ${correctCount} ids`);
    }
    if (new Set(correctIds).size !== correctIds.length) {
      reasons.push(`bowtie.${zoneName}.correct contains duplicate ids`);
    }
    correctIds.forEach((id) => {
      if (!tokenIds.has(id)) reasons.push(`bowtie.${zoneName}.correct id ${id} is not in that zone's tokens`);
    });
    if (zone.tokens.length <= correctCount) {
      reasons.push(`bowtie.${zoneName} must include at least one distractor`);
    }
  }
  const seenRationaleIds = /* @__PURE__ */ new Set();
  question.rationale.byChoice?.forEach((choice) => {
    if (seenRationaleIds.has(choice.refId)) {
      reasons.push(`rationale.byChoice contains duplicate refId ${choice.refId}`);
    }
    seenRationaleIds.add(choice.refId);
    if (!allTokenIds.has(choice.refId)) {
      reasons.push(`rationale.byChoice refId ${choice.refId} is not a bowtie token`);
    }
  });
};
var validateCaseStudyExhibit = (value, path, seenIds, reasons) => {
  if (!isRecord13(value)) {
    reasons.push(`${path} must be an object`);
    return;
  }
  if (!nonEmptyString13(value.id)) {
    reasons.push(`${path} requires id`);
  } else if (seenIds.has(value.id)) {
    reasons.push(`duplicate case exhibit id ${value.id}`);
  } else {
    seenIds.add(value.id);
  }
  if (value.type !== void 0 && !nonEmptyString13(value.type)) {
    reasons.push(`${path}.type must be non-empty when present`);
  }
  addTextPairError(value.title, `${path}.title`, reasons);
  addTextPairError(value.content, `${path}.content`, reasons);
  if (value.visual !== void 0) validateVisual(value.visual, `${path}.visual`, reasons);
  if (value.structuredMeasurements !== void 0) {
    validateStructuredMeasurements(value.structuredMeasurements, `${path}.structuredMeasurements`, reasons);
  }
};
var validateCaseStudy = (question, reasons) => {
  if (!isRecord13(question.caseStudy)) {
    reasons.push("case_study requires caseStudy");
    return;
  }
  addTextPairError(question.caseStudy.title, "caseStudy.title", reasons);
  if (question.caseStudy.summary !== void 0) addTextPairError(question.caseStudy.summary, "caseStudy.summary", reasons);
  const seenExhibitIds = /* @__PURE__ */ new Set();
  if (!Array.isArray(question.caseStudy.exhibits)) {
    reasons.push("caseStudy.exhibits must be an array");
  } else {
    question.caseStudy.exhibits.forEach(
      (exhibit, index) => validateCaseStudyExhibit(exhibit, `caseStudy.exhibits[${index}]`, seenExhibitIds, reasons)
    );
  }
  let hasAnyStageExhibit = false;
  if (question.caseStudy.stages !== void 0) {
    if (!Array.isArray(question.caseStudy.stages)) {
      reasons.push("caseStudy.stages must be an array when present");
    } else {
      const seenStageIds = /* @__PURE__ */ new Set();
      question.caseStudy.stages.forEach((stage, stageIndex) => {
        if (!isRecord13(stage)) {
          reasons.push(`caseStudy.stages[${stageIndex}] must be an object`);
          return;
        }
        if (!nonEmptyString13(stage.id)) {
          reasons.push(`caseStudy.stages[${stageIndex}] requires id`);
        } else if (seenStageIds.has(stage.id)) {
          reasons.push(`duplicate case stage id ${stage.id}`);
        } else {
          seenStageIds.add(stage.id);
        }
        addTextPairError(stage.title, `caseStudy.stages[${stageIndex}].title`, reasons);
        if (stage.trigger !== void 0) addTextPairError(stage.trigger, `caseStudy.stages[${stageIndex}].trigger`, reasons);
        if (stage.narrative !== void 0) addTextPairError(stage.narrative, `caseStudy.stages[${stageIndex}].narrative`, reasons);
        if (stage.timeOffset !== void 0 && !nonEmptyString13(stage.timeOffset)) {
          reasons.push(`caseStudy.stages[${stageIndex}].timeOffset must be non-empty when present`);
        }
        if (!Array.isArray(stage.exhibits) || stage.exhibits.length === 0) {
          reasons.push(`caseStudy.stages[${stageIndex}].exhibits must include at least one exhibit`);
        } else {
          hasAnyStageExhibit = true;
          stage.exhibits.forEach(
            (exhibit, exhibitIndex) => validateCaseStudyExhibit(
              exhibit,
              `caseStudy.stages[${stageIndex}].exhibits[${exhibitIndex}]`,
              seenExhibitIds,
              reasons
            )
          );
        }
      });
    }
  }
  const hasTopLevelExhibit = Array.isArray(question.caseStudy.exhibits) && question.caseStudy.exhibits.length > 0;
  if (!hasTopLevelExhibit && !hasAnyStageExhibit) {
    reasons.push("caseStudy must include at least one exhibit, in either the top-level exhibits array or a stage");
  }
  if (!Array.isArray(question.caseStudy.questions) || question.caseStudy.questions.length < 2) {
    reasons.push("caseStudy.questions must include at least two embedded questions");
    return;
  }
  if (question.caseStudy.questions.length > 6) {
    reasons.push("caseStudy.questions should not contain more than six embedded questions");
  }
  const seenQuestionIds = /* @__PURE__ */ new Set();
  question.caseStudy.questions.forEach((caseQuestion, index) => {
    if (caseQuestion.itemType === "bowtie") {
      reasons.push(`caseStudy.questions[${index}]: bowtie may not be embedded in a case study (standalone item type)`);
      return;
    }
    if (caseQuestion.stageId !== void 0 && !nonEmptyString13(caseQuestion.stageId)) {
      reasons.push(`caseStudy.questions[${index}].stageId must be non-empty when present`);
    }
    if (caseQuestion.answerableAfterStageId !== void 0 && !nonEmptyString13(caseQuestion.answerableAfterStageId)) {
      reasons.push(`caseStudy.questions[${index}].answerableAfterStageId must be non-empty when present`);
    }
    const result = validateQuestion(caseQuestion, { allowCaseStudy: false });
    if (!result.ok) {
      reasons.push(`caseStudy.questions[${index}]: ${result.reasons.join("; ")}`);
      return;
    }
    if (!isStandaloneQuestion(result.value)) {
      reasons.push(`caseStudy.questions[${index}] must be a standalone item type`);
      return;
    }
    if (seenQuestionIds.has(result.value.id)) {
      reasons.push(`caseStudy.questions[${index}]: duplicate embedded question id ${result.value.id}`);
      return;
    }
    if (result.value.id === question.id) {
      reasons.push(`caseStudy.questions[${index}]: embedded question id must differ from parent id`);
    }
    seenQuestionIds.add(result.value.id);
  });
};
var hasRationaleVisuals = (question) => {
  if (Array.isArray(question.rationale.visuals) && question.rationale.visuals.length > 0) return true;
  if (question.itemType === "case_study") {
    return question.caseStudy.questions.some(
      (caseQuestion) => Array.isArray(caseQuestion.rationale.visuals) && caseQuestion.rationale.visuals.length > 0
    );
  }
  return false;
};
var collectVisualRefs = (question) => {
  const refs = [];
  const add = (visual, location, ownerId, locationIndex, stageIndex) => {
    if (visual === void 0) return;
    refs.push({
      visual,
      location,
      parentQuestionId: question.id,
      ownerId,
      ...locationIndex === void 0 ? {} : { locationIndex },
      ...stageIndex === void 0 ? {} : { stageIndex }
    });
  };
  const addCarrier = (carrier, ownerId, visualLocation, rationaleLocation) => {
    add(carrier.visual, visualLocation, ownerId);
    carrier.rationale.visuals?.forEach(
      (visual, index) => add(visual, rationaleLocation, ownerId, index)
    );
  };
  addCarrier(question, question.id, "question", "questionRationale");
  if (question.itemType !== "case_study") return refs;
  question.caseStudy.exhibits.forEach(
    (exhibit, index) => add(exhibit.visual, "caseExhibit", question.id, index)
  );
  question.caseStudy.stages?.forEach(
    (stage, stageIndex) => stage.exhibits.forEach(
      (exhibit, index) => add(exhibit.visual, "caseStageExhibit", question.id, index, stageIndex)
    )
  );
  question.caseStudy.questions.forEach(
    (caseQuestion) => addCarrier(caseQuestion, caseQuestion.id, "caseQuestion", "caseQuestionRationale")
  );
  return refs;
};
var collectAllVisuals = (question) => collectVisualRefs(question).map(({ visual }) => visual);
var hasSchema16CaseFields = (question) => {
  if (question.itemType !== "case_study") return false;
  if (question.caseStudy.exhibits.some((exhibit) => exhibit.type !== void 0)) return true;
  if (question.caseStudy.stages?.some(
    (stage) => stage.trigger !== void 0 || stage.narrative !== void 0 || stage.timeOffset !== void 0 || stage.exhibits.some((exhibit) => exhibit.type !== void 0)
  )) {
    return true;
  }
  return question.caseStudy.questions.some(
    (caseQuestion) => caseQuestion.stageId !== void 0 || caseQuestion.answerableAfterStageId !== void 0
  );
};
var hasPacerRhythmVisual = (visual) => visual.kind === "rhythm_strip" && "pacer" in visual && visual.pacer !== void 0;
var collectStructuredMeasurements = (question) => {
  if (question.itemType !== "case_study") return [];
  const measurements = question.caseStudy.exhibits.flatMap(
    (exhibit) => exhibit.structuredMeasurements ? [exhibit.structuredMeasurements] : []
  );
  for (const stage of question.caseStudy.stages ?? []) {
    for (const exhibit of stage.exhibits) {
      if (exhibit.structuredMeasurements) measurements.push(exhibit.structuredMeasurements);
    }
  }
  return measurements;
};
var hasStructuredMeasurements = (question) => collectStructuredMeasurements(question).length > 0;
var hasStructuredMeasurementPopulation = (question) => collectStructuredMeasurements(question).some((measurements) => measurements.population !== void 0);
var hasStructuredMeasurementBound = (question) => collectStructuredMeasurements(question).some(
  (measurements) => measurements.panels.some(
    (panel) => panel.rows.some((row) => row.values.some((entry) => entry.bound !== void 0))
  )
);
var hasIoTrend = (question) => collectAllVisuals(question).some((visual) => visual.kind === "io_trend");
var validateBankObject = (raw, options = {}) => {
  const reasons = [];
  const payload = Array.isArray(raw) ? { questions: raw } : raw;
  if (!isRecord13(payload)) return { ok: false, reasons: ["bank must be an object or array"] };
  if (options.requireMeta === true && payload.meta === void 0) {
    reasons.push("meta with schemaVersion is required; normalize bare arrays to a bank envelope before repository use");
  }
  if (options.rejectUnknownKeys === true) {
    unknownKeys(payload, "$", "bank", keySet(allowedKeySets.bank), reasons);
    if (payload.meta !== void 0) {
      unknownKeys(payload.meta, "$.meta", "bankMeta", keySet(allowedKeySets.bankMeta), reasons);
    }
    if (Array.isArray(payload.questions)) {
      payload.questions.forEach(
        (question, index) => collectQuestionUnknownKeys(question, `questions[${index}]`, reasons)
      );
    }
  }
  let schemaVersion;
  let meta;
  if (payload.meta !== void 0) {
    if (!isRecord13(payload.meta)) {
      reasons.push("meta must be an object");
    } else {
      meta = payload.meta;
      if (!enumIncludes(supportedSchemaVersions, meta.schemaVersion)) {
        reasons.push(`meta.schemaVersion must be one of ${supportedSchemaVersions.join(", ")}`);
      } else {
        schemaVersion = meta.schemaVersion;
      }
    }
  }
  if (!Array.isArray(payload.questions)) {
    reasons.push("questions must be an array");
    return { ok: false, reasons };
  }
  if (meta?.count !== void 0) {
    if (typeof meta.count !== "number" || !Number.isInteger(meta.count) || meta.count < 0) {
      reasons.push("meta.count must be a non-negative integer");
    } else if (meta.count !== payload.questions.length) {
      reasons.push(`meta.count ${meta.count} does not match questions.length ${payload.questions.length}`);
    }
  }
  const seen = /* @__PURE__ */ new Set();
  const questions = [];
  payload.questions.forEach((question, index) => {
    const result = validateQuestion(question);
    if (!result.ok) {
      reasons.push(`questions[${index}]: ${result.reasons.join("; ")}`);
      return;
    }
    if (schemaVersion !== void 0 && !schemaVersionAtLeast(schemaVersion, "1.1") && result.value.itemType === "case_study") {
      reasons.push(`questions[${index}]: case_study requires meta.schemaVersion 1.1`);
      return;
    }
    if (schemaVersion !== void 0 && !schemaVersionAtLeast(schemaVersion, "1.3") && (result.value.itemType === "highlight" || result.value.itemType === "case_study" && result.value.caseStudy.questions.some((caseQuestion) => caseQuestion.itemType === "highlight"))) {
      reasons.push(`questions[${index}]: highlight requires meta.schemaVersion 1.3`);
      return;
    }
    if (schemaVersion !== void 0 && !schemaVersionAtLeast(schemaVersion, "1.4") && result.value.itemType === "bowtie") {
      reasons.push(`questions[${index}]: bowtie requires meta.schemaVersion 1.4`);
      return;
    }
    if (schemaVersion !== void 0 && !schemaVersionAtLeast(schemaVersion, "1.5") && hasRationaleVisuals(result.value)) {
      reasons.push(`questions[${index}]: rationale.visuals requires meta.schemaVersion 1.5`);
      return;
    }
    if (schemaVersion !== void 0 && !schemaVersionAtLeast(schemaVersion, "1.2") && (result.value.visual !== void 0 || result.value.itemType === "case_study" && (result.value.caseStudy.exhibits.some((exhibit) => exhibit.visual !== void 0) || result.value.caseStudy.stages?.some((stage) => stage.exhibits.some((exhibit) => exhibit.visual !== void 0))))) {
      reasons.push(`questions[${index}]: visual requires meta.schemaVersion 1.2`);
      return;
    }
    if (schemaVersion !== void 0 && !schemaVersionAtLeast(schemaVersion, "1.6") && hasSchema16CaseFields(result.value)) {
      reasons.push(`questions[${index}]: unfolding case-study metadata requires meta.schemaVersion 1.6`);
      return;
    }
    if (schemaVersion !== void 0 && !schemaVersionAtLeast(schemaVersion, "1.7") && collectAllVisuals(result.value).some(hasPacerRhythmVisual)) {
      reasons.push(`questions[${index}]: pacer rhythm_strip requires meta.schemaVersion 1.7`);
      return;
    }
    if (schemaVersion !== void 0 && !schemaVersionAtLeast(schemaVersion, "1.8") && hasStructuredMeasurements(result.value)) {
      reasons.push(`questions[${index}]: structuredMeasurements requires meta.schemaVersion 1.8`);
      return;
    }
    if (schemaVersion !== void 0 && !schemaVersionAtLeast(schemaVersion, "1.9") && hasIoTrend(result.value)) {
      reasons.push(`questions[${index}]: io_trend visual requires meta.schemaVersion 1.9`);
      return;
    }
    if (schemaVersion !== void 0 && !schemaVersionAtLeast(schemaVersion, "2.0") && hasStructuredMeasurementPopulation(result.value)) {
      reasons.push(`questions[${index}]: structuredMeasurements.population requires meta.schemaVersion 2.0`);
      return;
    }
    if (schemaVersion !== void 0 && !schemaVersionAtLeast(schemaVersion, "2.0") && hasStructuredMeasurementBound(result.value)) {
      reasons.push(`questions[${index}]: structuredMeasurements bound requires meta.schemaVersion 2.0`);
      return;
    }
    if (seen.has(result.value.id)) {
      reasons.push(`questions[${index}]: duplicate question id ${result.value.id}`);
      return;
    }
    seen.add(result.value.id);
    questions.push(result.value);
  });
  if (reasons.length > 0) return { ok: false, reasons };
  return { ok: true, value: { ...payload, questions } };
};

// scripts/single-row-lab-panels-survey.ts
var SURVEY_DATE = "2026-07-18";
var BANK_DIR = "banks";
var RAW_DIR = "banks/banks-raw";
var PROMOTED_DIR = "banks/_promoted";
var OUTPUT_PATH = "audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json";
var byteCompare = (left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right));
var emptyObservationCounts = () => ({
  labTrendVisuals: 0,
  oneSeriesLabTrendCandidates: 0,
  twoSeriesLabTrendNonCandidates: 0,
  structuredLabsPanels: 0,
  oneRowStructuredLabsCandidates: 0,
  multiRowStructuredLabsNonCandidates: 0
});
var addObservationCounts = (left, right) => ({
  labTrendVisuals: left.labTrendVisuals + right.labTrendVisuals,
  oneSeriesLabTrendCandidates: left.oneSeriesLabTrendCandidates + right.oneSeriesLabTrendCandidates,
  twoSeriesLabTrendNonCandidates: left.twoSeriesLabTrendNonCandidates + right.twoSeriesLabTrendNonCandidates,
  structuredLabsPanels: left.structuredLabsPanels + right.structuredLabsPanels,
  oneRowStructuredLabsCandidates: left.oneRowStructuredLabsCandidates + right.oneRowStructuredLabsCandidates,
  multiRowStructuredLabsNonCandidates: left.multiRowStructuredLabsNonCandidates + right.multiRowStructuredLabsNonCandidates
});
var countBy = (values, valueFor) => {
  const counts = /* @__PURE__ */ new Map();
  for (const value of values) {
    const key = valueFor(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort(([left], [right]) => byteCompare(left, right)));
};
var answerKeyFor = (question) => {
  switch (question.itemType) {
    case "multiple_choice":
    case "select_all":
    case "ordered_response":
      return { options: question.options, correct: question.correct };
    case "fill_in_blank":
      return { blanks: question.blanks };
    case "matrix":
      return { matrix: question.matrix, correct: question.correct };
    case "dropdown_cloze":
      return { clozeStem: question.clozeStem, dropdowns: question.dropdowns };
    case "highlight":
      return { highlight: question.highlight };
    case "bowtie":
      return { bowtie: question.bowtie };
  }
};
var taskMaterialFor = (question) => {
  switch (question.itemType) {
    case "multiple_choice":
    case "select_all":
    case "ordered_response":
      return { options: question.options };
    case "fill_in_blank":
      return { prompts: question.blanks.map(({ id, prompt }) => ({ id, prompt })) };
    case "matrix":
      return { matrix: question.matrix };
    case "dropdown_cloze":
      return { clozeStem: question.clozeStem, dropdowns: question.dropdowns.map(({ id, options }) => ({ id, options })) };
    case "highlight":
      return { segments: question.highlight.segments };
    case "bowtie":
      return { zones: question.bowtie };
  }
};
var decisionEvidenceFor = (question) => {
  const staged = question;
  return {
    questionId: question.id,
    itemType: question.itemType,
    stageId: staged.stageId ?? null,
    answerableAfterStageId: staged.answerableAfterStageId ?? null,
    stem: question.stem,
    taskMaterial: taskMaterialFor(question),
    answerKey: answerKeyFor(question),
    rationale: question.rationale
  };
};
var questionMeta = (question) => {
  const value = question.meta;
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
};
var keyedMetadata = (question, questionPath) => {
  const meta = questionMeta(question);
  return {
    expectedTrendPath: Array.isArray(meta.expected_trend) ? `${questionPath}.meta.expected_trend` : null,
    expectedFlagsPath: Array.isArray(meta.expected_flags) ? `${questionPath}.meta.expected_flags` : null,
    visualJustificationPath: typeof meta.visual_justification === "string" ? `${questionPath}.meta.visual_justification` : null,
    values: {
      expected_trend: Array.isArray(meta.expected_trend) ? meta.expected_trend : null,
      expected_flags: Array.isArray(meta.expected_flags) ? meta.expected_flags : null
    },
    visualJustification: typeof meta.visual_justification === "string" ? meta.visual_justification : null
  };
};
var visualContextFor = (questionPath, question, ref) => {
  switch (ref.location) {
    case "question":
      return { objectPath: `${questionPath}.visual`, label: "top-level question visual", carrier: question, carrierPath: questionPath, exhibit: null, stage: null };
    case "questionRationale":
      return { objectPath: `${questionPath}.rationale.visuals[${ref.locationIndex}]`, label: "top-level rationale visual", carrier: question, carrierPath: questionPath, exhibit: null, stage: null };
    case "caseExhibit": {
      if (question.itemType !== "case_study") throw new Error(`${question.id}: case exhibit visual on non-case question`);
      const exhibit = question.caseStudy.exhibits[ref.locationIndex ?? -1];
      if (!exhibit) throw new Error(`${question.id}: missing case exhibit ${ref.locationIndex}`);
      return { objectPath: `${questionPath}.caseStudy.exhibits[${ref.locationIndex}].visual`, label: "case exhibit visual", carrier: question, carrierPath: questionPath, exhibit, stage: null };
    }
    case "caseStageExhibit": {
      if (question.itemType !== "case_study") throw new Error(`${question.id}: staged exhibit visual on non-case question`);
      const stage = question.caseStudy.stages?.[ref.stageIndex ?? -1];
      const exhibit = stage?.exhibits[ref.locationIndex ?? -1];
      if (!stage || !exhibit) throw new Error(`${question.id}: missing staged exhibit ${ref.stageIndex}/${ref.locationIndex}`);
      return { objectPath: `${questionPath}.caseStudy.stages[${ref.stageIndex}].exhibits[${ref.locationIndex}].visual`, label: "staged case exhibit visual", carrier: question, carrierPath: questionPath, exhibit, stage };
    }
    case "caseQuestion":
    case "caseQuestionRationale": {
      if (question.itemType !== "case_study") throw new Error(`${question.id}: embedded visual on non-case question`);
      const embeddedIndex = question.caseStudy.questions.findIndex(({ id }) => id === ref.ownerId);
      const carrier = question.caseStudy.questions[embeddedIndex];
      if (!carrier) throw new Error(`${question.id}: cannot resolve embedded owner ${ref.ownerId}`);
      const carrierPath = `${questionPath}.caseStudy.questions[${embeddedIndex}]`;
      return {
        objectPath: ref.location === "caseQuestion" ? `${carrierPath}.visual` : `${carrierPath}.rationale.visuals[${ref.locationIndex}]`,
        label: ref.location === "caseQuestion" ? "embedded-question visual" : "embedded rationale visual",
        carrier,
        carrierPath,
        exhibit: null,
        stage: null
      };
    }
  }
};
var caseContextFor = (question, exhibit, stage) => {
  if (question.itemType !== "case_study") return null;
  return {
    caseTitle: question.caseStudy.title,
    caseSummary: question.caseStudy.summary ?? null,
    stage: stage ? {
      id: stage.id,
      title: stage.title,
      trigger: stage.trigger ?? null,
      narrative: stage.narrative ?? null,
      timeOffset: stage.timeOffset ?? null
    } : null,
    exhibit: exhibit ? {
      id: exhibit.id,
      type: exhibit.type ?? null,
      title: exhibit.title,
      content: exhibit.content
    } : null
  };
};
var reviewDecisionsFor = (question, carrier) => {
  if (carrier.itemType !== "case_study") return [decisionEvidenceFor(carrier)];
  if (question.itemType !== "case_study") throw new Error(`${question.id}: case carrier mismatch`);
  return question.caseStudy.questions.map(decisionEvidenceFor);
};
var semanticReviewTemplate = () => ({
  status: "PENDING_INDEPENDENT_REVIEW",
  loadBearing: null,
  exactProseDuplication: null,
  partialDuplication: null,
  secondRowMerit: null,
  surfaceFit: null,
  namedS4ContextClass: null
});
var labCandidate = ({
  bank,
  question,
  questionIndex,
  ref
}) => {
  const questionPath = `questions[${questionIndex}]`;
  const context = visualContextFor(questionPath, question, ref);
  const visual = ref.visual;
  const series = visual.series[0];
  if (!series) throw new Error(`${bank.path}::${context.objectPath}: missing candidate series`);
  const metadata = keyedMetadata(context.carrier, context.carrierPath);
  const validationErrors = validateLabTrend(visual).map(({ path, code, message }) => `${path}:${code}:${message}`);
  const selfCheckApplies = ref.location === "question" || ref.location === "caseQuestion";
  const selfCheckErrors = selfCheckApplies ? selfCheckLabTrend(visual, context.carrier).map(({ path, code, message }) => `${path}:${code}:${message}`) : [];
  const decisions = reviewDecisionsFor(question, context.carrier);
  const populationDeclared = visual.population ?? "unspecified";
  return {
    lane: bank.lane,
    bankPath: bank.path,
    questionId: question.id,
    embeddedLeafId: ref.ownerId === question.id ? null : ref.ownerId,
    exactObjectPath: context.objectPath,
    normalizedLocationLabel: context.label,
    declaredSchemaVersion: bank.envelope.meta?.schemaVersion ?? null,
    surface: "lab_trend",
    itemType: context.carrier.itemType,
    category: context.carrier.category,
    topic: context.carrier.topic,
    difficulty: context.carrier.difficulty,
    analyteOrRowKey: series.analyte,
    displayedLabel: { en: ANALYTE_DEFS[series.analyte].label, zh: null },
    unit: series.unit ?? ANALYTE_DEFS[series.analyte].canonicalUnit,
    populationDeclared,
    populationEffective: visual.population ?? "adult",
    numSeries: visual.series.length,
    numTimepoints: visual.time.values.length,
    numColumns: null,
    numValues: null,
    keyedVisualMetadata: {
      expectedTrendPath: metadata.expectedTrendPath,
      expectedFlagsPath: metadata.expectedFlagsPath,
      visualJustificationPath: metadata.visualJustificationPath
    },
    currentValidation: {
      status: validationErrors.length === 0 ? "PASS" : "FAIL",
      proofSurface: "VISUAL_MODULE_AND_BANK_SCHEMA",
      errors: validationErrors
    },
    currentApplicableSelfCheck: {
      status: selfCheckApplies ? selfCheckErrors.length === 0 ? "PASS" : "FAIL" : "NOT_APPLICABLE_BY_CURRENT_CONTRACT",
      contract: selfCheckApplies ? "Answer-coupled lab_trend selfCheck applies to question.visual and embedded-question visual." : "Rationale and case-exhibit visuals receive structural validation but no answer-coupled selfCheck under the current validator contract.",
      errors: selfCheckErrors
    },
    policyImpact: {
      L1: "PASSES_CURRENT_ONE_OR_TWO_SERIES_CONTRACT",
      L2: "NEWLY_FAILS_UNIVERSAL_TWO_SERIES_FLOOR",
      L3: "PENDING_INDEPENDENT_LOAD_BEARING_AND_EXACT_DUPLICATION_CLASSIFICATION"
    },
    semanticReview: semanticReviewTemplate(),
    reviewPacket: {
      testedDecisionEvidence: decisions,
      presentationValues: { time: visual.time, series: visual.series, caption: visual.caption ?? null },
      caseContext: caseContextFor(question, context.exhibit, context.stage),
      rationalePassages: decisions.map(({ questionId, rationale }) => ({ questionId, rationale })),
      declaredVisualJustification: metadata.visualJustification,
      keyedVisualMetadata: metadata.values,
      usefulContextDimensions: {
        location: context.label,
        analyte: series.analyte,
        timeUnit: visual.time.unit,
        timepointCount: visual.time.values.length,
        caseStageId: context.stage?.id ?? null,
        exhibitType: context.exhibit?.type ?? null,
        exhibitTitle: context.exhibit?.title ?? null
      }
    }
  };
};
var structuredCandidate = ({
  bank,
  question,
  questionIndex,
  panel,
  panelPath,
  locationLabel,
  measurementsPopulation,
  exhibit,
  stage
}) => {
  const row = panel.rows[0];
  if (!row) throw new Error(`${bank.path}::${panelPath}: missing candidate row`);
  const decisions = question.caseStudy.questions.map(decisionEvidenceFor);
  const units = [...new Set(row.values.map(({ unit }) => unit))].sort(byteCompare);
  return {
    lane: bank.lane,
    bankPath: bank.path,
    questionId: question.id,
    embeddedLeafId: null,
    exactObjectPath: panelPath,
    normalizedLocationLabel: locationLabel,
    declaredSchemaVersion: bank.envelope.meta?.schemaVersion ?? null,
    surface: "structured_labs_panel",
    itemType: question.itemType,
    category: question.category,
    topic: question.topic,
    difficulty: question.difficulty,
    analyteOrRowKey: row.key,
    displayedLabel: row.label,
    unit: units.join(" | "),
    populationDeclared: measurementsPopulation ?? "unspecified",
    populationEffective: measurementsPopulation ?? "unspecified",
    numSeries: null,
    numTimepoints: null,
    numColumns: panel.columns.length,
    numValues: row.values.length,
    keyedVisualMetadata: {
      expectedTrendPath: null,
      expectedFlagsPath: null,
      visualJustificationPath: null
    },
    currentValidation: {
      status: "PASS",
      proofSurface: "BANK_SCHEMA",
      errors: []
    },
    currentApplicableSelfCheck: {
      status: "NOT_APPLICABLE_BY_CURRENT_CONTRACT",
      contract: "Structured panels have no renderer selfCheck; their current proof surface is bank/schema validation and separately named gates.",
      errors: []
    },
    policyImpact: {
      S1: "PASSES_CURRENT_NONEMPTY_ROWS_CONTRACT",
      S2: "NEWLY_FAILS_UNIVERSAL_TWO_ROW_FLOOR",
      S3: "PENDING_INDEPENDENT_LOAD_BEARING_AND_EXACT_DUPLICATION_CLASSIFICATION",
      S4: "PENDING_ARCHITECT_NAMED_CONTEXT_CLASS_AFTER_EVIDENCE_REVIEW"
    },
    semanticReview: semanticReviewTemplate(),
    reviewPacket: {
      testedDecisionEvidence: decisions,
      presentationValues: panel,
      caseContext: caseContextFor(question, exhibit, stage),
      rationalePassages: decisions.map(({ questionId, rationale }) => ({ questionId, rationale })),
      declaredVisualJustification: null,
      keyedVisualMetadata: null,
      usefulContextDimensions: {
        location: locationLabel,
        panelColumns: panel.columns,
        caseStageId: stage?.id ?? null,
        caseStageTitle: stage?.title ?? null,
        exhibitType: exhibit.type ?? null,
        exhibitTitle: exhibit.title,
        analyte: row.key,
        surroundingProse: exhibit.content
      }
    }
  };
};
var collectP4CandidatesFromBank = (bank) => {
  const records = [];
  const observations = emptyObservationCounts();
  bank.envelope.questions.forEach((question, questionIndex) => {
    for (const ref of collectVisualRefs(question)) {
      if (ref.visual.kind !== "lab_trend") continue;
      observations.labTrendVisuals += 1;
      const visual = ref.visual;
      if (visual.series.length === 1) {
        observations.oneSeriesLabTrendCandidates += 1;
        records.push(labCandidate({ bank, question, questionIndex, ref }));
      } else if (visual.series.length === 2) {
        observations.twoSeriesLabTrendNonCandidates += 1;
      }
    }
    if (question.itemType !== "case_study") return;
    const collectExhibit = (exhibit, basePath, locationLabel, stage) => {
      const measurements = exhibit.structuredMeasurements;
      if (!measurements) return;
      measurements.panels.forEach((panel, panelIndex) => {
        if (panel.kind !== "labs") return;
        observations.structuredLabsPanels += 1;
        if (panel.rows.length === 1) {
          observations.oneRowStructuredLabsCandidates += 1;
          records.push(structuredCandidate({
            bank,
            question,
            questionIndex,
            panel,
            panelPath: `${basePath}.structuredMeasurements.panels[${panelIndex}]`,
            locationLabel,
            measurementsPopulation: measurements.population,
            exhibit,
            stage
          }));
        } else {
          observations.multiRowStructuredLabsNonCandidates += 1;
        }
      });
    };
    question.caseStudy.exhibits.forEach((exhibit, exhibitIndex) => collectExhibit(
      exhibit,
      `questions[${questionIndex}].caseStudy.exhibits[${exhibitIndex}]`,
      "case exhibit structured measurements",
      null
    ));
    question.caseStudy.stages?.forEach((stage, stageIndex) => stage.exhibits.forEach((exhibit, exhibitIndex) => collectExhibit(
      exhibit,
      `questions[${questionIndex}].caseStudy.stages[${stageIndex}].exhibits[${exhibitIndex}]`,
      "staged case exhibit structured measurements",
      stage
    )));
  });
  return { records, observations };
};
var listJsonNames = async (directory, optional) => {
  try {
    return (await readdir(directory)).filter((name) => name.endsWith(".json")).sort(byteCompare);
  } catch (error) {
    if (optional && error.code === "ENOENT") return [];
    throw error;
  }
};
var discoverP4SurveyBankPaths = async ({
  bankDir = BANK_DIR,
  rawDir = RAW_DIR,
  promotedDir = PROMOTED_DIR
} = {}) => {
  const [canonical, raw, promoted] = await Promise.all([
    listJsonNames(bankDir, false),
    listJsonNames(rawDir, true),
    listJsonNames(promotedDir, true)
  ]);
  return {
    canonical: canonical.map((name) => join(bankDir, name)),
    raw: raw.map((name) => join(rawDir, name)),
    promoted: promoted.map((name) => join(promotedDir, name))
  };
};
var loadValidatedBank = async (path, lane) => {
  const parsed = JSON.parse(await readFile(path, "utf8"));
  const result = validateBankObject(parsed);
  if (!result.ok) throw new Error(`${path}: ${result.reasons.join("; ")}`);
  return { path, lane, envelope: result.value };
};
var candidateReference = (record) => ({
  bankPath: record.bankPath,
  questionId: record.questionId,
  embeddedLeafId: record.embeddedLeafId,
  exactObjectPath: record.exactObjectPath,
  normalizedLocationLabel: record.normalizedLocationLabel
});
var exactPolicy = (records, label, newlyFails, consequences) => ({
  status: "CALCULATED_MECHANICALLY",
  rule: label,
  candidateCountEvaluated: records.length,
  affectedCandidateCount: newlyFails ? records.length : 0,
  newlyFailingRecords: newlyFails ? records.map(candidateReference) : [],
  affectedBanks: newlyFails ? [...new Set(records.map(({ bankPath }) => bankPath))].sort(byteCompare) : [],
  affectedLocations: newlyFails ? countBy(records, ({ normalizedLocationLabel }) => normalizedLocationLabel) : {},
  metadataOnlyRepairPossible: newlyFails ? "NO" : "NOT_NEEDED",
  clinicallyUnnecessaryDataRequired: newlyFails ? "PENDING_INDEPENDENT_ADDITIONAL_DATA_MERIT_REVIEW" : "NO",
  surfaceRemovalPreservesAnswerability: newlyFails ? "PENDING_INDEPENDENT_LOAD_BEARING_REVIEW" : "NOT_APPLICABLE",
  consequences
});
var pendingPolicy = (records, label, additional) => ({
  status: "PENDING_INDEPENDENT_REVIEW",
  ruleTemplate: label,
  candidatePopulation: records.length,
  exactAffectedCandidateCount: null,
  newlyFailingRecords: null,
  affectedBanks: null,
  affectedLocations: null,
  metadataOnlyRepairPossible: null,
  clinicallyUnnecessaryDataRequired: null,
  surfaceRemovalPreservesAnswerability: null,
  ...additional
});
var laneSummary = (records, observations, lane, discoveredBankPaths) => {
  const laneRecords = records.filter((record) => record.lane === lane);
  return {
    discoveredFileCount: discoveredBankPaths.length,
    discoveredBankPaths,
    candidateCount: laneRecords.length,
    candidateBankPaths: [...new Set(laneRecords.map(({ bankPath }) => bankPath))].sort(byteCompare),
    candidatesBySurface: countBy(laneRecords, ({ surface }) => surface),
    observations
  };
};
var buildSingleRowLabPanelsSurvey = async ({
  bankDir = BANK_DIR,
  rawDir = RAW_DIR,
  promotedDir = PROMOTED_DIR
} = {}) => {
  const paths = await discoverP4SurveyBankPaths({ bankDir, rawDir, promotedDir });
  const banks = (await Promise.all(Object.entries(paths).flatMap(
    ([lane, lanePaths]) => lanePaths.map((path) => loadValidatedBank(path, lane))
  ))).sort((left, right) => byteCompare(left.path, right.path));
  const laneObservations = {
    canonical: emptyObservationCounts(),
    raw: emptyObservationCounts(),
    promoted: emptyObservationCounts()
  };
  const records = [];
  for (const bank of banks) {
    const collected = collectP4CandidatesFromBank(bank);
    records.push(...collected.records);
    laneObservations[bank.lane] = addObservationCounts(laneObservations[bank.lane], collected.observations);
  }
  records.sort((left, right) => byteCompare(
    [left.lane, left.bankPath, left.exactObjectPath, left.surface].join("\0"),
    [right.lane, right.bankPath, right.exactObjectPath, right.surface].join("\0")
  ));
  const lab = records.filter(({ surface }) => surface === "lab_trend");
  const structured = records.filter(({ surface }) => surface === "structured_labs_panel");
  const totalObservations = Object.values(laneObservations).reduce(addObservationCounts, emptyObservationCounts());
  const structuredContextInventory = {
    normalizedLocations: [...new Set(structured.map(({ normalizedLocationLabel }) => normalizedLocationLabel))].sort(byteCompare),
    panelColumnCounts: countBy(structured, ({ numColumns }) => String(numColumns)),
    caseStageIds: countBy(structured, (record) => String(record.reviewPacket.usefulContextDimensions.caseStageId)),
    exhibitTypes: countBy(structured, (record) => String(record.reviewPacket.usefulContextDimensions.exhibitType)),
    analytes: countBy(structured, ({ analyteOrRowKey }) => analyteOrRowKey)
  };
  return {
    survey: "single-row-lab-presentation-p4",
    surveyDate: SURVEY_DATE,
    status: "MECHANICAL_COMPLETE_SEMANTIC_ADJUDICATION_PENDING",
    authority: {
      mode: "REPORT_ONLY",
      forbiddenChanges: ["schema floors", "renderer behavior", "bank content", "reference-band policy", "runtime behavior"],
      seatSplit: "The generator owns mechanical facts only. A producer-independent checker owns load-bearing, duplication, second-row-merit, and surface-fit classifications. The architecture seat may name an S4 context class only after reviewing the evidence."
    },
    contractEvidence: {
      labTrend: {
        candidateDefinition: "lab_trend visual with exactly one series entry",
        currentContract: "one or two series; at least three timepoints",
        selfCheckApplicability: "Answer-coupled selfCheck applies only to top-level or embedded question.visual. Rationale visuals and case exhibits receive structural validation without that answer-coupled selfCheck."
      },
      structuredLabsPanel: {
        candidateDefinition: "individual structuredMeasurements.panels[] entry with kind=labs and rows.length=1",
        currentContract: "nonempty rows; no two-row minimum",
        selfCheckApplicability: "NOT_APPLICABLE_BY_CURRENT_CONTRACT; structured panels have no renderer selfCheck."
      }
    },
    population: {
      canonical: laneSummary(records, laneObservations.canonical, "canonical", paths.canonical),
      raw: laneSummary(records, laneObservations.raw, "raw", paths.raw),
      promoted: laneSummary(records, laneObservations.promoted, "promoted", paths.promoted),
      absentOptionalDirectoryRule: "An absent raw or promoted directory is an empty population. Other filesystem and validation failures fail the survey.",
      note: "An absent optional lane serializes like a present lane containing no JSON files. Every discovered JSON path is recorded; noncandidate P4 surfaces remain visible in observation counts."
    },
    summary: {
      candidateCount: records.length,
      candidatesBySurface: countBy(records, ({ surface }) => surface),
      candidatesByLane: countBy(records, ({ lane }) => lane),
      candidatesByLocation: countBy(records, ({ normalizedLocationLabel }) => normalizedLocationLabel),
      observations: totalObservations,
      currentValidationFailures: records.filter(({ currentValidation }) => currentValidation.status === "FAIL").length,
      applicableSelfCheckFailures: records.filter(({ currentApplicableSelfCheck }) => currentApplicableSelfCheck.status === "FAIL").length,
      selfCheckNotApplicableByCurrentContract: records.filter(({ currentApplicableSelfCheck }) => currentApplicableSelfCheck.status === "NOT_APPLICABLE_BY_CURRENT_CONTRACT").length,
      semanticClassificationsComplete: 0
    },
    policyResults: {
      L1: exactPolicy(lab, "Preserve one-or-two-series lab_trend contract.", false, {
        schemaValidation: "NONE; the current one-or-two-series validation contract remains unchanged.",
        renderer: "NONE.",
        exportEnvelope: "NONE.",
        promotedVisualParity: "NONE.",
        bankMigration: "NONE."
      }),
      L2: exactPolicy(lab, "Require two series universally for lab_trend.", true, {
        schemaValidation: "Would change lab_trend validation policy from one-or-two series to exactly two. A new schema-version floor is a separate architecture choice, not an automatic consequence.",
        renderer: "No renderer change is inherently required; the current lab_trend renderer already supports two series.",
        exportEnvelope: "No automatic consequence. Export-envelope behavior changes only if the architecture introduces a new feature floor.",
        promotedVisualParity: "Policy alone does not change snapshot hashes. Current promoted-bank loading would fail until affected payloads are migrated or excepted; hashes change only if a visual payload or renderer changes.",
        bankMigration: "All newly failing records require a meaningful second series, removal/replacement of the visual surface, or an exception policy; metadata alone cannot comply."
      }),
      L3: pendingPolicy(lab, "Permit one series only when independently classified as load-bearing and not exactly duplicated by prose.", {
        calculationAfterReview: "newly fails when loadBearing != true OR exactProseDuplication == true",
        consequences: {
          schemaValidation: "Would add a conditional validation policy after independent classifications are represented by an architecture-approved mechanism; exact scope is pending review.",
          renderer: "No renderer change is inherently required.",
          exportEnvelope: "No automatic consequence; it depends on whether the approved mechanism introduces a new feature floor.",
          promotedVisualParity: "Policy alone does not change hashes. Any later payload repair is handled by the existing record-local parity process.",
          bankMigration: "Exact records and repair types remain pending independent load-bearing and duplication classifications."
        }
      }),
      S1: exactPolicy(structured, "Preserve nonempty-row structured labs panel contract.", false, {
        schemaValidation: "NONE; the current nonempty-rows contract remains unchanged.",
        renderer: "NONE.",
        exportEnvelope: "NONE.",
        promotedVisualParity: "NONE; structuredMeasurements panels are not registered QuestionVisual artifacts in the promoted-visual baseline.",
        bankMigration: "NONE."
      }),
      S2: exactPolicy(structured, "Require two rows for every structured labs panel.", true, {
        schemaValidation: "Would change structured labs panel validation policy from nonempty rows to at least two rows. A new schema-version floor is a separate architecture choice, not an automatic consequence.",
        renderer: "No renderer change is inherently required; the current structured-measurements renderer already supports multiple rows.",
        exportEnvelope: "No automatic consequence. Export-envelope behavior changes only if the architecture introduces a new feature floor.",
        promotedVisualParity: "NONE under the current baseline; structuredMeasurements panels are not registered QuestionVisual artifacts. Structured renderer/schema regressions remain applicable.",
        bankMigration: "All newly failing panels require a clinically meaningful second row, removal/replacement of the structured surface, or an exception policy; metadata alone cannot comply."
      }),
      S3: pendingPolicy(structured, "Permit one row only when independently classified as load-bearing and not exactly duplicated by prose.", {
        calculationAfterReview: "newly fails when loadBearing != true OR exactProseDuplication == true",
        consequences: {
          schemaValidation: "Would add a conditional structured-panel validation policy after independent classifications are represented by an architecture-approved mechanism; exact scope is pending review.",
          renderer: "No renderer change is inherently required.",
          exportEnvelope: "No automatic consequence; it depends on whether the approved mechanism introduces a new feature floor.",
          promotedVisualParity: "NONE under the current registered-QuestionVisual baseline. Any later structured payload repair remains subject to structured renderer/schema tests.",
          bankMigration: "Exact panels and repair types remain pending independent load-bearing and duplication classifications."
        }
      }),
      S4: pendingPolicy(structured, "Apply a two-row floor only to an architecture-named panel/context class derived from this evidence.", {
        namedPanelOrContextClass: null,
        contextInventory: structuredContextInventory,
        calculationAfterArchitectureRuling: "deterministically match the named class, then list matching one-row panels as newly failing",
        consequences: {
          schemaValidation: "Pending the architecture-seat class definition. Only matching panels would enter a changed validation policy.",
          renderer: "No renderer change is inherently required.",
          exportEnvelope: "No automatic consequence; it depends on whether the approved class mechanism introduces a new feature floor.",
          promotedVisualParity: "NONE under the current registered-QuestionVisual baseline. Any later matching-panel repair remains subject to structured renderer/schema tests.",
          bankMigration: "Pending both the named class and deterministic matching pass; nonmatching one-row panels would require no migration."
        }
      })
    },
    semanticReviewTemplate: {
      requiredFields: ["loadBearing", "exactProseDuplication", "partialDuplication", "secondRowMerit", "surfaceFit"],
      S4Restriction: "The checker may classify the supplied context facts but must not invent the named S4 panel/context class. That is an architecture-seat decision after candidate review.",
      allowedSurfaceFitValues: ["one_analyte_trend", "one_row_structured_panel", "ordinary_prose", "other_existing_surface"]
    },
    records,
    regenerationCommand: "npm run survey:single-row-lab-panels",
    driftCommand: "npm run test:single-row-lab-panels"
  };
};
var serializeSingleRowLabPanelsSurvey = (survey) => `${JSON.stringify(survey, null, 2)}
`;
var main = async () => {
  const survey = await buildSingleRowLabPanelsSurvey();
  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, serializeSingleRowLabPanelsSurvey(survey), "utf8");
  console.log(`${OUTPUT_PATH}: ${survey.summary.candidateCount} candidates (${survey.summary.candidatesBySurface.lab_trend ?? 0} lab_trend; ${survey.summary.candidatesBySurface.structured_labs_panel ?? 0} structured panels)`);
};
var isMain = process.argv[1] !== void 0 && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
export {
  buildSingleRowLabPanelsSurvey,
  serializeSingleRowLabPanelsSurvey
};
