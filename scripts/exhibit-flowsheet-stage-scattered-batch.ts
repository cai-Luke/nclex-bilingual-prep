import { writeFileSync } from "node:fs";

type PanelEntry = {
  label: string;
  value: string;
  sourceUnit?: string;
  sourceSpan?: string;
  context?: string;
};

type ExcludedEntry = {
  label: string;
  value: string;
  reason: "prior" | "trend" | "serial";
  sourceSpan?: string;
};

type ExtractionRecord = {
  exhibitRef: string;
  lane: "extract" | "skip_serial";
  panel?: PanelEntry[];
  excludedValues?: ExcludedEntry[];
  unitAliases?: { aliasOf: string; value: string }[];
};

const batch10Records: ExtractionRecord[] = [
  {
    exhibitRef: "case_dka_01/ex_labs_0815",
    lane: "extract",
    panel: [
      { label: "glucose", value: "540", sourceUnit: "mg/dL", sourceSpan: "Glucose: 540 mg/dL" },
      { label: "sodium", value: "132", sourceUnit: "mEq/L", sourceSpan: "Sodium: 132 mEq/L" },
      { label: "potassium", value: "3.4", sourceUnit: "mEq/L", sourceSpan: "Potassium: 3.4 mEq/L" },
      { label: "bicarbonate", value: "12", sourceUnit: "mEq/L", sourceSpan: "Bicarbonate: 12 mEq/L" },
      { label: "ph", value: "7.15", sourceUnit: "(unitless)", sourceSpan: "Arterial pH: 7.15" },
      { label: "anion_gap", value: "20", sourceUnit: "mEq/L", sourceSpan: "Anion Gap: 20 mEq/L" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "case_preeclampsia_magnesium_01/admission",
    lane: "skip_serial"
  },
  {
    exhibitRef: "case_preeclampsia_magnesium_01/labs",
    lane: "extract",
    panel: [
      { label: "platelets", value: "92,000", sourceUnit: "/mm3", sourceSpan: "Platelets: 92,000/mm3. AST 94 U/L, ALT 88 U/L. Creatinine 1.2 mg/dL." },
      { label: "ast", value: "94", sourceUnit: "U/L", sourceSpan: "Platelets: 92,000/mm3. AST 94 U/L, ALT 88 U/L. Creatinine 1.2 mg/dL." },
      { label: "alt", value: "88", sourceUnit: "U/L", sourceSpan: "Platelets: 92,000/mm3. AST 94 U/L, ALT 88 U/L. Creatinine 1.2 mg/dL." },
      { label: "creatinine", value: "1.2", sourceUnit: "mg/dL", sourceSpan: "Platelets: 92,000/mm3. AST 94 U/L, ALT 88 U/L. Creatinine 1.2 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "case_preeclampsia_magnesium_01/toxicity_assessment",
    lane: "extract",
    panel: [
      { label: "rr", value: "10", sourceUnit: "/min", sourceSpan: "RR 10/min. SpO2 93% on room air." },
      { label: "spo2", value: "93", sourceUnit: "%", sourceSpan: "RR 10/min. SpO2 93% on room air." },
      { label: "sbp", value: "148", sourceUnit: "mm Hg", sourceSpan: "Blood pressure after labetalol: 148/94 mm Hg.", context: "post_intervention" },
      { label: "dbp", value: "94", sourceUnit: "mm Hg", sourceSpan: "Blood pressure after labetalol: 148/94 mm Hg.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "case_sepsis_pneumonia_01/after_500_ml",
    lane: "extract",
    panel: [
      { label: "sbp", value: "84", sourceUnit: "mm Hg", sourceSpan: "BP 84/48 mm Hg, MAP 59 mm Hg. HR 124/min. SpO2 93% on 3 L nasal cannula.", context: "post_intervention" },
      { label: "dbp", value: "48", sourceUnit: "mm Hg", sourceSpan: "BP 84/48 mm Hg, MAP 59 mm Hg. HR 124/min. SpO2 93% on 3 L nasal cannula.", context: "post_intervention" },
      { label: "map", value: "59", sourceUnit: "mm Hg", sourceSpan: "BP 84/48 mm Hg, MAP 59 mm Hg. HR 124/min. SpO2 93% on 3 L nasal cannula.", context: "post_intervention" },
      { label: "hr", value: "124", sourceUnit: "bpm", sourceSpan: "BP 84/48 mm Hg, MAP 59 mm Hg. HR 124/min. SpO2 93% on 3 L nasal cannula.", context: "post_intervention" },
      { label: "spo2", value: "93", sourceUnit: "%", sourceSpan: "BP 84/48 mm Hg, MAP 59 mm Hg. HR 124/min. SpO2 93% on 3 L nasal cannula.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "case_sepsis_pneumonia_01/after_resuscitation",
    lane: "extract",
    panel: [
      { label: "sbp", value: "104", sourceUnit: "mm Hg", sourceSpan: "BP 104/58 mm Hg, MAP 69 mm Hg. HR 104/min. Lactate 3.1 mmol/L. Urine output 20 mL in the past hour.", context: "post_intervention" },
      { label: "dbp", value: "58", sourceUnit: "mm Hg", sourceSpan: "BP 104/58 mm Hg, MAP 69 mm Hg. HR 104/min. Lactate 3.1 mmol/L. Urine output 20 mL in the past hour.", context: "post_intervention" },
      { label: "map", value: "69", sourceUnit: "mm Hg", sourceSpan: "BP 104/58 mm Hg, MAP 69 mm Hg. HR 104/min. Lactate 3.1 mmol/L. Urine output 20 mL in the past hour.", context: "post_intervention" },
      { label: "hr", value: "104", sourceUnit: "bpm", sourceSpan: "BP 104/58 mm Hg, MAP 69 mm Hg. HR 104/min. Lactate 3.1 mmol/L. Urine output 20 mL in the past hour.", context: "post_intervention" },
      { label: "lactate", value: "3.1", sourceUnit: "mmol/L", sourceSpan: "BP 104/58 mm Hg, MAP 69 mm Hg. HR 104/min. Lactate 3.1 mmol/L. Urine output 20 mL in the past hour.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "case_sepsis_pneumonia_01/initial_results",
    lane: "extract",
    panel: [
      { label: "wbc", value: "18,400", sourceUnit: "/mm3", sourceSpan: "WBC 18,400/mm3. Lactate 4.6 mmol/L. Creatinine 1.4 mg/dL." },
      { label: "lactate", value: "4.6", sourceUnit: "mmol/L", sourceSpan: "WBC 18,400/mm3. Lactate 4.6 mmol/L. Creatinine 1.4 mg/dL." },
      { label: "creatinine", value: "1.4", sourceUnit: "mg/dL", sourceSpan: "WBC 18,400/mm3. Lactate 4.6 mmol/L. Creatinine 1.4 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "cs_adhf_pulm_edema_01/ed_assessment",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "°C", sourceSpan: "Temperature: 36.8°C (98.2°F)" },
      { label: "hr", value: "128", sourceUnit: "bpm", sourceSpan: "Heart Rate: 128 beats/minute, irregularly irregular" },
      { label: "rr", value: "34", sourceUnit: "/min", sourceSpan: "Respiratory Rate: 34 breaths/minute, labored" },
      { label: "sbp", value: "188", sourceUnit: "mmHg", sourceSpan: "Blood Pressure: 188/102 mmHg" },
      { label: "dbp", value: "102", sourceUnit: "mmHg", sourceSpan: "Blood Pressure: 188/102 mmHg" },
      { label: "spo2", value: "85", sourceUnit: "%", sourceSpan: "SpO2: 85% on room air" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "cs_ckd_01/labs_pre",
    lane: "extract",
    panel: [
      { label: "bun", value: "82", sourceUnit: "mg/dL", sourceSpan: "BUN: 82 mg/dL" },
      { label: "creatinine", value: "7.4", sourceUnit: "mg/dL", sourceSpan: "Creatinine: 7.4 mg/dL" },
      { label: "potassium", value: "6.2", sourceUnit: "mEq/L", sourceSpan: "Potassium: 6.2 mEq/L" },
      { label: "calcium", value: "8.1", sourceUnit: "mg/dL", sourceSpan: "Calcium: 8.1 mg/dL" },
      { label: "phosphate", value: "5.8", sourceUnit: "mg/dL", sourceSpan: "Phosphorus: 5.8 mg/dL" },
      { label: "hemoglobin", value: "9.1", sourceUnit: "g/dL", sourceSpan: "Hgb: 9.1 g/dL" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "cs_copd_01/vitals",
    lane: "extract",
    panel: [
      { label: "temp", value: "101.2", sourceUnit: "F", sourceSpan: "T: 101.2 F (38.4 C)" },
      { label: "hr", value: "112", sourceUnit: "bpm", sourceSpan: "HR: 112 bpm" },
      { label: "rr", value: "28", sourceUnit: "/min", sourceSpan: "RR: 28/min, shallow" },
      { label: "sbp", value: "148", sourceUnit: "mmHg", sourceSpan: "BP: 148/92 mmHg" },
      { label: "dbp", value: "92", sourceUnit: "mmHg", sourceSpan: "BP: 148/92 mmHg" },
      { label: "spo2", value: "86", sourceUnit: "%", sourceSpan: "SpO2: 86% on room air" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "cs_sepsis_shock_01/labs_1600",
    lane: "extract",
    panel: [
      { label: "wbc", value: "18,500", sourceUnit: "/mm³", sourceSpan: "- White Blood Cell (WBC) Count: 18,500/mm³" },
      { label: "lactate", value: "4.2", sourceUnit: "mmol/L", sourceSpan: "- Lactate: 4.2 mmol/L" },
      { label: "creatinine", value: "1.8", sourceUnit: "mg/dL", sourceSpan: "- Serum Creatinine: 1.8 mg/dL" },
      { label: "glucose", value: "210", sourceUnit: "mg/dL", sourceSpan: "- Blood Glucose: 210 mg/dL" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "cs_sepsis_shock_01/triage_vitals",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.9", sourceUnit: "°C", sourceSpan: "Temperature: 38.9°C (102.0°F)" },
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "Heart Rate: 118 beats/minute" },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "Respiratory Rate: 24 breaths/minute" },
      { label: "sbp", value: "94", sourceUnit: "mmHg", sourceSpan: "Blood Pressure: 94/52 mmHg" },
      { label: "dbp", value: "52", sourceUnit: "mmHg", sourceSpan: "Blood Pressure: 94/52 mmHg" },
      { label: "spo2", value: "91", sourceUnit: "%", sourceSpan: "SpO2: 91% on room air" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "cs_sepsis_shock_01/vitals_1600",
    lane: "extract",
    panel: [
      { label: "hr", value: "124", sourceUnit: "bpm", sourceSpan: "After a 500 mL bolus of 0.9% sodium chloride:\n- Heart Rate: 124 beats/minute\n- Respiratory Rate: 26 breaths/minute\n- Blood Pressure: 88/48 mmHg\n- Mean Arterial Pressure (MAP): 61 mmHg", context: "post_intervention" },
      { label: "rr", value: "26", sourceUnit: "/min", sourceSpan: "After a 500 mL bolus of 0.9% sodium chloride:\n- Heart Rate: 124 beats/minute\n- Respiratory Rate: 26 breaths/minute\n- Blood Pressure: 88/48 mmHg\n- Mean Arterial Pressure (MAP): 61 mmHg", context: "post_intervention" },
      { label: "sbp", value: "88", sourceUnit: "mmHg", sourceSpan: "After a 500 mL bolus of 0.9% sodium chloride:\n- Heart Rate: 124 beats/minute\n- Respiratory Rate: 26 breaths/minute\n- Blood Pressure: 88/48 mmHg\n- Mean Arterial Pressure (MAP): 61 mmHg", context: "post_intervention" },
      { label: "dbp", value: "48", sourceUnit: "mmHg", sourceSpan: "After a 500 mL bolus of 0.9% sodium chloride:\n- Heart Rate: 124 beats/minute\n- Respiratory Rate: 26 breaths/minute\n- Blood Pressure: 88/48 mmHg\n- Mean Arterial Pressure (MAP): 61 mmHg", context: "post_intervention" },
      { label: "map", value: "61", sourceUnit: "mmHg", sourceSpan: "After a 500 mL bolus of 0.9% sodium chloride:\n- Heart Rate: 124 beats/minute\n- Respiratory Rate: 26 breaths/minute\n- Blood Pressure: 88/48 mmHg\n- Mean Arterial Pressure (MAP): 61 mmHg", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "cs_stemi_vfib_04/triage_1400",
    lane: "extract",
    panel: [
      { label: "sbp", value: "155", sourceUnit: "mmHg", sourceSpan: "Blood Pressure: 155/90 mmHg" },
      { label: "dbp", value: "90", sourceUnit: "mmHg", sourceSpan: "Blood Pressure: 155/90 mmHg" },
      { label: "hr", value: "110", sourceUnit: "bpm", sourceSpan: "Heart Rate: 110 beats/minute" },
      { label: "rr", value: "28", sourceUnit: "/min", sourceSpan: "Respiratory Rate: 28 breaths/minute" },
      { label: "spo2", value: "92", sourceUnit: "%", sourceSpan: "SpO2: 92% on room air" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "cs_thyroid_storm_main/ex_orders_0830",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "cs_thyroid_storm_main/ex_triage_0800",
    lane: "extract",
    panel: [
      { label: "temp", value: "104.2", sourceUnit: "°F", sourceSpan: "Temperature: 104.2 °F (40.1 °C)" },
      { label: "hr", value: "152", sourceUnit: "bpm", sourceSpan: "Heart Rate: 152 bpm (irregular)" },
      { label: "sbp", value: "168", sourceUnit: "mm Hg", sourceSpan: "Blood Pressure: 168/94 mm Hg" },
      { label: "dbp", value: "94", sourceUnit: "mm Hg", sourceSpan: "Blood Pressure: 168/94 mm Hg" },
      { label: "rr", value: "28", sourceUnit: "/min", sourceSpan: "Respiratory Rate: 28 breaths/min" },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "SpO2: 95% on room air" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gemini_gap_case_disaster_triage_05/ex1_disaster_scene",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gemini_gap_case_hypertension_lifestyle_02/ex2_htn_3mo_results",
    lane: "extract",
    panel: [
      { label: "sbp", value: "128", sourceUnit: "mmHg", sourceSpan: "- Blood pressure: 128/82 mmHg (seated, average of 2 readings)." },
      { label: "dbp", value: "82", sourceUnit: "mmHg", sourceSpan: "- Blood pressure: 128/82 mmHg (seated, average of 2 readings)." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gemini_gap_case_palliative_care_03/ex1_hospice_baseline",
    lane: "extract",
    panel: [
      { label: "rr", value: "28", sourceUnit: "/min", sourceSpan: "- Respiratory rate: 28 breaths/min, shallow." },
      { label: "hr", value: "96", sourceUnit: "bpm", sourceSpan: "- Heart rate: 96 bpm." },
      { label: "spo2", value: "92", sourceUnit: "%", sourceSpan: "- Oxygen saturation: 92% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gemini_gap_case_pediatric_croup_02/ex1_triage_respiratory",
    lane: "extract",
    panel: [
      { label: "temp", value: "101.1", sourceUnit: "°F", sourceSpan: "- Temperature: 101.1°F (38.4°C)" },
      { label: "hr", value: "138", sourceUnit: "bpm", sourceSpan: "- Heart rate: 138 bpm" },
      { label: "rr", value: "32", sourceUnit: "/min", sourceSpan: "- Respiratory rate: 32 breaths/min" },
      { label: "spo2", value: "94", sourceUnit: "%", sourceSpan: "- Oxygen saturation: 94% on room air" }
    ],
    excludedValues: [],
    unitAliases: []
  }
];

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-10-scattered-2026-07-05.json",
  `${JSON.stringify(batch10Records, null, 2)}\n`,
);

console.log(`Wrote ${batch10Records.length} Batch 10 scattered records.`);
