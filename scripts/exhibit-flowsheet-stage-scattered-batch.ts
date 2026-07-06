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

const batch11Records: ExtractionRecord[] = [
  {
    exhibitRef: "gemini_gap_case_pediatric_croup_02/ex2_treatment_response",
    lane: "extract",
    panel: [
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "Oxygen saturation is 98% on room air.", context: "post_intervention" },
      { label: "hr", value: "110", sourceUnit: "bpm", sourceSpan: "Heart rate has decreased to 110 bpm.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_13_case_delirium_uti_01/agitation_prn_protocol",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_13_case_delirium_uti_01/ed_assessment_labs",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.3", sourceUnit: "°C", sourceSpan: "Vital signs: T 38.3 °C (101.0 °F) oral, HR 104/min, BP 148/82 mm Hg, RR 20/min, SpO₂ 96% room air." },
      { label: "hr", value: "104", sourceUnit: "bpm", sourceSpan: "Vital signs: T 38.3 °C (101.0 °F) oral, HR 104/min, BP 148/82 mm Hg, RR 20/min, SpO₂ 96% room air." },
      { label: "sbp", value: "148", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 38.3 °C (101.0 °F) oral, HR 104/min, BP 148/82 mm Hg, RR 20/min, SpO₂ 96% room air." },
      { label: "dbp", value: "82", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 38.3 °C (101.0 °F) oral, HR 104/min, BP 148/82 mm Hg, RR 20/min, SpO₂ 96% room air." },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "Vital signs: T 38.3 °C (101.0 °F) oral, HR 104/min, BP 148/82 mm Hg, RR 20/min, SpO₂ 96% room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Vital signs: T 38.3 °C (101.0 °F) oral, HR 104/min, BP 148/82 mm Hg, RR 20/min, SpO₂ 96% room air." },
      { label: "wbc", value: "14,200", sourceUnit: "/µL", sourceSpan: "Labs: WBC 14,200/µL with 82% neutrophils and 6% bands; Hgb 11.8 g/dL; platelets 210,000/µL; Na 146 mEq/L; K 4.0 mEq/L; Cl 108 mEq/L; HCO₃ 24 mEq/L; BUN 32 mg/dL; creatinine 1.3 mg/dL (baseline 0.9); glucose 158 mg/dL; lactate 1.6 mmol/L." },
      { label: "hemoglobin", value: "11.8", sourceUnit: "g/dL", sourceSpan: "Labs: WBC 14,200/µL with 82% neutrophils and 6% bands; Hgb 11.8 g/dL; platelets 210,000/µL; Na 146 mEq/L; K 4.0 mEq/L; Cl 108 mEq/L; HCO₃ 24 mEq/L; BUN 32 mg/dL; creatinine 1.3 mg/dL (baseline 0.9); glucose 158 mg/dL; lactate 1.6 mmol/L." },
      { label: "platelets", value: "210,000", sourceUnit: "/µL", sourceSpan: "Labs: WBC 14,200/µL with 82% neutrophils and 6% bands; Hgb 11.8 g/dL; platelets 210,000/µL; Na 146 mEq/L; K 4.0 mEq/L; Cl 108 mEq/L; HCO₃ 24 mEq/L; BUN 32 mg/dL; creatinine 1.3 mg/dL (baseline 0.9); glucose 158 mg/dL; lactate 1.6 mmol/L." },
      { label: "sodium", value: "146", sourceUnit: "mEq/L", sourceSpan: "Labs: WBC 14,200/µL with 82% neutrophils and 6% bands; Hgb 11.8 g/dL; platelets 210,000/µL; Na 146 mEq/L; K 4.0 mEq/L; Cl 108 mEq/L; HCO₃ 24 mEq/L; BUN 32 mg/dL; creatinine 1.3 mg/dL (baseline 0.9); glucose 158 mg/dL; lactate 1.6 mmol/L." },
      { label: "potassium", value: "4.0", sourceUnit: "mEq/L", sourceSpan: "Labs: WBC 14,200/µL with 82% neutrophils and 6% bands; Hgb 11.8 g/dL; platelets 210,000/µL; Na 146 mEq/L; K 4.0 mEq/L; Cl 108 mEq/L; HCO₃ 24 mEq/L; BUN 32 mg/dL; creatinine 1.3 mg/dL (baseline 0.9); glucose 158 mg/dL; lactate 1.6 mmol/L." },
      { label: "chloride", value: "108", sourceUnit: "mEq/L", sourceSpan: "Labs: WBC 14,200/µL with 82% neutrophils and 6% bands; Hgb 11.8 g/dL; platelets 210,000/µL; Na 146 mEq/L; K 4.0 mEq/L; Cl 108 mEq/L; HCO₃ 24 mEq/L; BUN 32 mg/dL; creatinine 1.3 mg/dL (baseline 0.9); glucose 158 mg/dL; lactate 1.6 mmol/L." },
      { label: "bicarbonate", value: "24", sourceUnit: "mEq/L", sourceSpan: "Labs: WBC 14,200/µL with 82% neutrophils and 6% bands; Hgb 11.8 g/dL; platelets 210,000/µL; Na 146 mEq/L; K 4.0 mEq/L; Cl 108 mEq/L; HCO₃ 24 mEq/L; BUN 32 mg/dL; creatinine 1.3 mg/dL (baseline 0.9); glucose 158 mg/dL; lactate 1.6 mmol/L." },
      { label: "bun", value: "32", sourceUnit: "mg/dL", sourceSpan: "Labs: WBC 14,200/µL with 82% neutrophils and 6% bands; Hgb 11.8 g/dL; platelets 210,000/µL; Na 146 mEq/L; K 4.0 mEq/L; Cl 108 mEq/L; HCO₃ 24 mEq/L; BUN 32 mg/dL; creatinine 1.3 mg/dL (baseline 0.9); glucose 158 mg/dL; lactate 1.6 mmol/L." },
      { label: "creatinine", value: "1.3", sourceUnit: "mg/dL", sourceSpan: "Labs: WBC 14,200/µL with 82% neutrophils and 6% bands; Hgb 11.8 g/dL; platelets 210,000/µL; Na 146 mEq/L; K 4.0 mEq/L; Cl 108 mEq/L; HCO₃ 24 mEq/L; BUN 32 mg/dL; creatinine 1.3 mg/dL (baseline 0.9); glucose 158 mg/dL; lactate 1.6 mmol/L." },
      { label: "glucose", value: "158", sourceUnit: "mg/dL", sourceSpan: "Labs: WBC 14,200/µL with 82% neutrophils and 6% bands; Hgb 11.8 g/dL; platelets 210,000/µL; Na 146 mEq/L; K 4.0 mEq/L; Cl 108 mEq/L; HCO₃ 24 mEq/L; BUN 32 mg/dL; creatinine 1.3 mg/dL (baseline 0.9); glucose 158 mg/dL; lactate 1.6 mmol/L." },
      { label: "lactate", value: "1.6", sourceUnit: "mmol/L", sourceSpan: "Labs: WBC 14,200/µL with 82% neutrophils and 6% bands; Hgb 11.8 g/dL; platelets 210,000/µL; Na 146 mEq/L; K 4.0 mEq/L; Cl 108 mEq/L; HCO₃ 24 mEq/L; BUN 32 mg/dL; creatinine 1.3 mg/dL (baseline 0.9); glucose 158 mg/dL; lactate 1.6 mmol/L." }
    ],
    excludedValues: [
      { label: "creatinine", value: "0.9", reason: "prior", sourceSpan: "creatinine 1.3 mg/dL (baseline 0.9)" }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_13_case_delirium_uti_01/ed_course",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.1", sourceUnit: "°C", sourceSpan: "Hour 3: T 38.1 °C, HR 98/min, BP 140/78 mm Hg, RR 18/min, SpO₂ 97%.", context: "post_intervention" },
      { label: "hr", value: "98", sourceUnit: "bpm", sourceSpan: "Hour 3: T 38.1 °C, HR 98/min, BP 140/78 mm Hg, RR 18/min, SpO₂ 97%.", context: "post_intervention" },
      { label: "sbp", value: "140", sourceUnit: "mm Hg", sourceSpan: "Hour 3: T 38.1 °C, HR 98/min, BP 140/78 mm Hg, RR 18/min, SpO₂ 97%.", context: "post_intervention" },
      { label: "dbp", value: "78", sourceUnit: "mm Hg", sourceSpan: "Hour 3: T 38.1 °C, HR 98/min, BP 140/78 mm Hg, RR 18/min, SpO₂ 97%.", context: "post_intervention" },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Hour 3: T 38.1 °C, HR 98/min, BP 140/78 mm Hg, RR 18/min, SpO₂ 97%.", context: "post_intervention" },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Hour 3: T 38.1 °C, HR 98/min, BP 140/78 mm Hg, RR 18/min, SpO₂ 97%.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_13_case_delirium_uti_01/med_surg_update",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.6", sourceUnit: "°C", sourceSpan: "Hour 10 vitals: T 37.6 °C, HR 92/min, BP 134/76 mm Hg, RR 16/min, SpO₂ 98%.", context: "post_intervention" },
      { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: "Hour 10 vitals: T 37.6 °C, HR 92/min, BP 134/76 mm Hg, RR 16/min, SpO₂ 98%.", context: "post_intervention" },
      { label: "sbp", value: "134", sourceUnit: "mm Hg", sourceSpan: "Hour 10 vitals: T 37.6 °C, HR 92/min, BP 134/76 mm Hg, RR 16/min, SpO₂ 98%.", context: "post_intervention" },
      { label: "dbp", value: "76", sourceUnit: "mm Hg", sourceSpan: "Hour 10 vitals: T 37.6 °C, HR 92/min, BP 134/76 mm Hg, RR 16/min, SpO₂ 98%.", context: "post_intervention" },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Hour 10 vitals: T 37.6 °C, HR 92/min, BP 134/76 mm Hg, RR 16/min, SpO₂ 98%.", context: "post_intervention" },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "Hour 10 vitals: T 37.6 °C, HR 92/min, BP 134/76 mm Hg, RR 16/min, SpO₂ 98%.", context: "post_intervention" },
      { label: "wbc", value: "12,800", sourceUnit: "/µL", sourceSpan: "Hour 12 labs: WBC 12,800/µL; Na 143 mEq/L; BUN 28 mg/dL; creatinine 1.1 mg/dL; glucose 142 mg/dL.", context: "post_intervention" },
      { label: "sodium", value: "143", sourceUnit: "mEq/L", sourceSpan: "Hour 12 labs: WBC 12,800/µL; Na 143 mEq/L; BUN 28 mg/dL; creatinine 1.1 mg/dL; glucose 142 mg/dL.", context: "post_intervention" },
      { label: "bun", value: "28", sourceUnit: "mg/dL", sourceSpan: "Hour 12 labs: WBC 12,800/µL; Na 143 mEq/L; BUN 28 mg/dL; creatinine 1.1 mg/dL; glucose 142 mg/dL.", context: "post_intervention" },
      { label: "creatinine", value: "1.1", sourceUnit: "mg/dL", sourceSpan: "Hour 12 labs: WBC 12,800/µL; Na 143 mEq/L; BUN 28 mg/dL; creatinine 1.1 mg/dL; glucose 142 mg/dL.", context: "post_intervention" },
      { label: "glucose", value: "142", sourceUnit: "mg/dL", sourceSpan: "Hour 12 labs: WBC 12,800/µL; Na 143 mEq/L; BUN 28 mg/dL; creatinine 1.1 mg/dL; glucose 142 mg/dL.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_13_case_delirium_uti_01/recovery_update",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.1", sourceUnit: "°C", sourceSpan: "Morning assessment: T 37.1 °C, HR 82/min, BP 130/72 mm Hg, RR 14/min, SpO₂ 98%.", context: "post_intervention" },
      { label: "hr", value: "82", sourceUnit: "bpm", sourceSpan: "Morning assessment: T 37.1 °C, HR 82/min, BP 130/72 mm Hg, RR 14/min, SpO₂ 98%.", context: "post_intervention" },
      { label: "sbp", value: "130", sourceUnit: "mm Hg", sourceSpan: "Morning assessment: T 37.1 °C, HR 82/min, BP 130/72 mm Hg, RR 14/min, SpO₂ 98%.", context: "post_intervention" },
      { label: "dbp", value: "72", sourceUnit: "mm Hg", sourceSpan: "Morning assessment: T 37.1 °C, HR 82/min, BP 130/72 mm Hg, RR 14/min, SpO₂ 98%.", context: "post_intervention" },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "Morning assessment: T 37.1 °C, HR 82/min, BP 130/72 mm Hg, RR 14/min, SpO₂ 98%.", context: "post_intervention" },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "Morning assessment: T 37.1 °C, HR 82/min, BP 130/72 mm Hg, RR 14/min, SpO₂ 98%.", context: "post_intervention" },
      { label: "wbc", value: "10,400", sourceUnit: "/µL", sourceSpan: "Repeat labs: WBC 10,400/µL; Na 140 mEq/L; BUN 24 mg/dL; creatinine 1.0 mg/dL; glucose 130 mg/dL.", context: "post_intervention" },
      { label: "sodium", value: "140", sourceUnit: "mEq/L", sourceSpan: "Repeat labs: WBC 10,400/µL; Na 140 mEq/L; BUN 24 mg/dL; creatinine 1.0 mg/dL; glucose 130 mg/dL.", context: "post_intervention" },
      { label: "bun", value: "24", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: WBC 10,400/µL; Na 140 mEq/L; BUN 24 mg/dL; creatinine 1.0 mg/dL; glucose 130 mg/dL.", context: "post_intervention" },
      { label: "creatinine", value: "1.0", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: WBC 10,400/µL; Na 140 mEq/L; BUN 24 mg/dL; creatinine 1.0 mg/dL; glucose 130 mg/dL.", context: "post_intervention" },
      { label: "glucose", value: "130", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: WBC 10,400/µL; Na 140 mEq/L; BUN 24 mg/dL; creatinine 1.0 mg/dL; glucose 130 mg/dL.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/background",
    lane: "extract",
    panel: [],
    excludedValues: [
      { label: "sbp", value: "118", reason: "prior", sourceSpan: "Discharged postpartum day 1 with BP 118/74" },
      { label: "dbp", value: "74", reason: "prior", sourceSpan: "Discharged postpartum day 1 with BP 118/74" }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage1_ed_assessment",
    lane: "skip_serial"
  },
  {
    exhibitRef: "gpt_case_acute_hemolytic_transfusion_reaction_01/baseline_record",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "°C", sourceSpan: "Baseline vital signs: T 36.8 °C, HR 92/min, BP 108/68 mmHg, RR 18/min, SpO2 96% on room air." },
      { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: "Baseline vital signs: T 36.8 °C, HR 92/min, BP 108/68 mmHg, RR 18/min, SpO2 96% on room air." },
      { label: "sbp", value: "108", sourceUnit: "mmHg", sourceSpan: "Baseline vital signs: T 36.8 °C, HR 92/min, BP 108/68 mmHg, RR 18/min, SpO2 96% on room air." },
      { label: "dbp", value: "68", sourceUnit: "mmHg", sourceSpan: "Baseline vital signs: T 36.8 °C, HR 92/min, BP 108/68 mmHg, RR 18/min, SpO2 96% on room air." },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Baseline vital signs: T 36.8 °C, HR 92/min, BP 108/68 mmHg, RR 18/min, SpO2 96% on room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Baseline vital signs: T 36.8 °C, HR 92/min, BP 108/68 mmHg, RR 18/min, SpO2 96% on room air." },
      { label: "hemoglobin", value: "6.4", sourceUnit: "g/dL", sourceSpan: "Admission labs: Hgb 6.4 g/dL, Hct 19.2%, WBC 7,800/uL, platelets 218,000/uL, BUN 32 mg/dL, creatinine 1.8 mg/dL, K 4.6 mEq/L, total bilirubin 0.9 mg/dL, LDH 190 U/L, INR 1.0, aPTT 28 sec, fibrinogen 310 mg/dL, haptoglobin 95 mg/dL." },
      { label: "hematocrit", value: "19.2", sourceUnit: "%", sourceSpan: "Admission labs: Hgb 6.4 g/dL, Hct 19.2%, WBC 7,800/uL, platelets 218,000/uL, BUN 32 mg/dL, creatinine 1.8 mg/dL, K 4.6 mEq/L, total bilirubin 0.9 mg/dL, LDH 190 U/L, INR 1.0, aPTT 28 sec, fibrinogen 310 mg/dL, haptoglobin 95 mg/dL." },
      { label: "wbc", value: "7,800", sourceUnit: "/uL", sourceSpan: "Admission labs: Hgb 6.4 g/dL, Hct 19.2%, WBC 7,800/uL, platelets 218,000/uL, BUN 32 mg/dL, creatinine 1.8 mg/dL, K 4.6 mEq/L, total bilirubin 0.9 mg/dL, LDH 190 U/L, INR 1.0, aPTT 28 sec, fibrinogen 310 mg/dL, haptoglobin 95 mg/dL." },
      { label: "platelets", value: "218,000", sourceUnit: "/uL", sourceSpan: "Admission labs: Hgb 6.4 g/dL, Hct 19.2%, WBC 7,800/uL, platelets 218,000/uL, BUN 32 mg/dL, creatinine 1.8 mg/dL, K 4.6 mEq/L, total bilirubin 0.9 mg/dL, LDH 190 U/L, INR 1.0, aPTT 28 sec, fibrinogen 310 mg/dL, haptoglobin 95 mg/dL." },
      { label: "bun", value: "32", sourceUnit: "mg/dL", sourceSpan: "Admission labs: Hgb 6.4 g/dL, Hct 19.2%, WBC 7,800/uL, platelets 218,000/uL, BUN 32 mg/dL, creatinine 1.8 mg/dL, K 4.6 mEq/L, total bilirubin 0.9 mg/dL, LDH 190 U/L, INR 1.0, aPTT 28 sec, fibrinogen 310 mg/dL, haptoglobin 95 mg/dL." },
      { label: "creatinine", value: "1.8", sourceUnit: "mg/dL", sourceSpan: "Admission labs: Hgb 6.4 g/dL, Hct 19.2%, WBC 7,800/uL, platelets 218,000/uL, BUN 32 mg/dL, creatinine 1.8 mg/dL, K 4.6 mEq/L, total bilirubin 0.9 mg/dL, LDH 190 U/L, INR 1.0, aPTT 28 sec, fibrinogen 310 mg/dL, haptoglobin 95 mg/dL." },
      { label: "potassium", value: "4.6", sourceUnit: "mEq/L", sourceSpan: "Admission labs: Hgb 6.4 g/dL, Hct 19.2%, WBC 7,800/uL, platelets 218,000/uL, BUN 32 mg/dL, creatinine 1.8 mg/dL, K 4.6 mEq/L, total bilirubin 0.9 mg/dL, LDH 190 U/L, INR 1.0, aPTT 28 sec, fibrinogen 310 mg/dL, haptoglobin 95 mg/dL." },
      { label: "total_bilirubin", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "Admission labs: Hgb 6.4 g/dL, Hct 19.2%, WBC 7,800/uL, platelets 218,000/uL, BUN 32 mg/dL, creatinine 1.8 mg/dL, K 4.6 mEq/L, total bilirubin 0.9 mg/dL, LDH 190 U/L, INR 1.0, aPTT 28 sec, fibrinogen 310 mg/dL, haptoglobin 95 mg/dL." },
      { label: "inr", value: "1.0", sourceUnit: "(ratio)", sourceSpan: "Admission labs: Hgb 6.4 g/dL, Hct 19.2%, WBC 7,800/uL, platelets 218,000/uL, BUN 32 mg/dL, creatinine 1.8 mg/dL, K 4.6 mEq/L, total bilirubin 0.9 mg/dL, LDH 190 U/L, INR 1.0, aPTT 28 sec, fibrinogen 310 mg/dL, haptoglobin 95 mg/dL." },
      { label: "ptt", value: "28", sourceUnit: "sec", sourceSpan: "Admission labs: Hgb 6.4 g/dL, Hct 19.2%, WBC 7,800/uL, platelets 218,000/uL, BUN 32 mg/dL, creatinine 1.8 mg/dL, K 4.6 mEq/L, total bilirubin 0.9 mg/dL, LDH 190 U/L, INR 1.0, aPTT 28 sec, fibrinogen 310 mg/dL, haptoglobin 95 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_acute_hemolytic_transfusion_reaction_01/stage_2_update",
    lane: "extract",
    panel: [
      { label: "temp", value: "39.1", sourceUnit: "°C", sourceSpan: "Vital signs: T 39.1 °C, HR 132/min, BP 82/50 mmHg, RR 28/min, SpO2 93% on 4 L nasal cannula." },
      { label: "hr", value: "132", sourceUnit: "bpm", sourceSpan: "Vital signs: T 39.1 °C, HR 132/min, BP 82/50 mmHg, RR 28/min, SpO2 93% on 4 L nasal cannula." },
      { label: "sbp", value: "82", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 39.1 °C, HR 132/min, BP 82/50 mmHg, RR 28/min, SpO2 93% on 4 L nasal cannula." },
      { label: "dbp", value: "50", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 39.1 °C, HR 132/min, BP 82/50 mmHg, RR 28/min, SpO2 93% on 4 L nasal cannula." },
      { label: "rr", value: "28", sourceUnit: "/min", sourceSpan: "Vital signs: T 39.1 °C, HR 132/min, BP 82/50 mmHg, RR 28/min, SpO2 93% on 4 L nasal cannula." },
      { label: "spo2", value: "93", sourceUnit: "%", sourceSpan: "Vital signs: T 39.1 °C, HR 132/min, BP 82/50 mmHg, RR 28/min, SpO2 93% on 4 L nasal cannula." },
      { label: "hemoglobin", value: "5.8", sourceUnit: "g/dL", sourceSpan: "Stat labs: Hgb 5.8 g/dL, platelets 104,000/uL, K 5.4 mEq/L, creatinine 2.6 mg/dL, total bilirubin 4.2 mg/dL, LDH 1,840 U/L, INR 1.8, aPTT 52 sec, fibrinogen 140 mg/dL, haptoglobin <10 mg/dL, free plasma hemoglobin elevated." },
      { label: "platelets", value: "104,000", sourceUnit: "/uL", sourceSpan: "Stat labs: Hgb 5.8 g/dL, platelets 104,000/uL, K 5.4 mEq/L, creatinine 2.6 mg/dL, total bilirubin 4.2 mg/dL, LDH 1,840 U/L, INR 1.8, aPTT 52 sec, fibrinogen 140 mg/dL, haptoglobin <10 mg/dL, free plasma hemoglobin elevated." },
      { label: "potassium", value: "5.4", sourceUnit: "mEq/L", sourceSpan: "Stat labs: Hgb 5.8 g/dL, platelets 104,000/uL, K 5.4 mEq/L, creatinine 2.6 mg/dL, total bilirubin 4.2 mg/dL, LDH 1,840 U/L, INR 1.8, aPTT 52 sec, fibrinogen 140 mg/dL, haptoglobin <10 mg/dL, free plasma hemoglobin elevated." },
      { label: "creatinine", value: "2.6", sourceUnit: "mg/dL", sourceSpan: "Stat labs: Hgb 5.8 g/dL, platelets 104,000/uL, K 5.4 mEq/L, creatinine 2.6 mg/dL, total bilirubin 4.2 mg/dL, LDH 1,840 U/L, INR 1.8, aPTT 52 sec, fibrinogen 140 mg/dL, haptoglobin <10 mg/dL, free plasma hemoglobin elevated." },
      { label: "total_bilirubin", value: "4.2", sourceUnit: "mg/dL", sourceSpan: "Stat labs: Hgb 5.8 g/dL, platelets 104,000/uL, K 5.4 mEq/L, creatinine 2.6 mg/dL, total bilirubin 4.2 mg/dL, LDH 1,840 U/L, INR 1.8, aPTT 52 sec, fibrinogen 140 mg/dL, haptoglobin <10 mg/dL, free plasma hemoglobin elevated." },
      { label: "inr", value: "1.8", sourceUnit: "(ratio)", sourceSpan: "Stat labs: Hgb 5.8 g/dL, platelets 104,000/uL, K 5.4 mEq/L, creatinine 2.6 mg/dL, total bilirubin 4.2 mg/dL, LDH 1,840 U/L, INR 1.8, aPTT 52 sec, fibrinogen 140 mg/dL, haptoglobin <10 mg/dL, free plasma hemoglobin elevated." },
      { label: "ptt", value: "52", sourceUnit: "sec", sourceSpan: "Stat labs: Hgb 5.8 g/dL, platelets 104,000/uL, K 5.4 mEq/L, creatinine 2.6 mg/dL, total bilirubin 4.2 mg/dL, LDH 1,840 U/L, INR 1.8, aPTT 52 sec, fibrinogen 140 mg/dL, haptoglobin <10 mg/dL, free plasma hemoglobin elevated." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_acute_hemolytic_transfusion_reaction_01/stage_3_update",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.4", sourceUnit: "°C", sourceSpan: "Current vital signs: T 38.4 °C, HR 120/min, BP 88/56 mmHg on norepinephrine, RR 24/min on 6 L nasal cannula, SpO2 94%.", context: "post_intervention" },
      { label: "hr", value: "120", sourceUnit: "bpm", sourceSpan: "Current vital signs: T 38.4 °C, HR 120/min, BP 88/56 mmHg on norepinephrine, RR 24/min on 6 L nasal cannula, SpO2 94%.", context: "post_intervention" },
      { label: "sbp", value: "88", sourceUnit: "mmHg", sourceSpan: "Current vital signs: T 38.4 °C, HR 120/min, BP 88/56 mmHg on norepinephrine, RR 24/min on 6 L nasal cannula, SpO2 94%.", context: "post_intervention" },
      { label: "dbp", value: "56", sourceUnit: "mmHg", sourceSpan: "Current vital signs: T 38.4 °C, HR 120/min, BP 88/56 mmHg on norepinephrine, RR 24/min on 6 L nasal cannula, SpO2 94%.", context: "post_intervention" },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "Current vital signs: T 38.4 °C, HR 120/min, BP 88/56 mmHg on norepinephrine, RR 24/min on 6 L nasal cannula, SpO2 94%.", context: "post_intervention" },
      { label: "spo2", value: "94", sourceUnit: "%", sourceSpan: "Current vital signs: T 38.4 °C, HR 120/min, BP 88/56 mmHg on norepinephrine, RR 24/min on 6 L nasal cannula, SpO2 94%.", context: "post_intervention" },
      { label: "hemoglobin", value: "5.2", sourceUnit: "g/dL", sourceSpan: "Repeat labs: Hgb 5.2 g/dL, platelets 78,000/uL, K 5.9 mEq/L, creatinine 3.4 mg/dL, total bilirubin 6.1 mg/dL, LDH 2,600 U/L, INR 2.2, aPTT 68 sec, fibrinogen 88 mg/dL.", context: "post_intervention" },
      { label: "platelets", value: "78,000", sourceUnit: "/uL", sourceSpan: "Repeat labs: Hgb 5.2 g/dL, platelets 78,000/uL, K 5.9 mEq/L, creatinine 3.4 mg/dL, total bilirubin 6.1 mg/dL, LDH 2,600 U/L, INR 2.2, aPTT 68 sec, fibrinogen 88 mg/dL.", context: "post_intervention" },
      { label: "potassium", value: "5.9", sourceUnit: "mEq/L", sourceSpan: "Repeat labs: Hgb 5.2 g/dL, platelets 78,000/uL, K 5.9 mEq/L, creatinine 3.4 mg/dL, total bilirubin 6.1 mg/dL, LDH 2,600 U/L, INR 2.2, aPTT 68 sec, fibrinogen 88 mg/dL.", context: "post_intervention" },
      { label: "creatinine", value: "3.4", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: Hgb 5.2 g/dL, platelets 78,000/uL, K 5.9 mEq/L, creatinine 3.4 mg/dL, total bilirubin 6.1 mg/dL, LDH 2,600 U/L, INR 2.2, aPTT 68 sec, fibrinogen 88 mg/dL.", context: "post_intervention" },
      { label: "total_bilirubin", value: "6.1", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: Hgb 5.2 g/dL, platelets 78,000/uL, K 5.9 mEq/L, creatinine 3.4 mg/dL, total bilirubin 6.1 mg/dL, LDH 2,600 U/L, INR 2.2, aPTT 68 sec, fibrinogen 88 mg/dL.", context: "post_intervention" },
      { label: "inr", value: "2.2", sourceUnit: "(ratio)", sourceSpan: "Repeat labs: Hgb 5.2 g/dL, platelets 78,000/uL, K 5.9 mEq/L, creatinine 3.4 mg/dL, total bilirubin 6.1 mg/dL, LDH 2,600 U/L, INR 2.2, aPTT 68 sec, fibrinogen 88 mg/dL.", context: "post_intervention" },
      { label: "ptt", value: "68", sourceUnit: "sec", sourceSpan: "Repeat labs: Hgb 5.2 g/dL, platelets 78,000/uL, K 5.9 mEq/L, creatinine 3.4 mg/dL, total bilirubin 6.1 mg/dL, LDH 2,600 U/L, INR 2.2, aPTT 68 sec, fibrinogen 88 mg/dL.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/admission_history",
    lane: "extract",
    panel: [],
    excludedValues: [
      { label: "creatinine", value: "1.4", reason: "prior", sourceSpan: "Baseline creatinine 1.4 mg/dL three months ago with eGFR 48 mL/min/1.73 m²." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/admission_labs",
    lane: "extract",
    panel: [
      { label: "sodium", value: "134", sourceUnit: "mEq/L", sourceSpan: "Na 134 mEq/L, K 6.1 mEq/L, Cl 96 mEq/L, HCO₃ 18 mEq/L, BUN 68 mg/dL, creatinine 4.2 mg/dL, BUN:Cr 16.2:1, glucose 188 mg/dL, calcium 8.4 mg/dL, phosphorus 5.1 mg/dL, magnesium 1.6 mg/dL." },
      { label: "potassium", value: "6.1", sourceUnit: "mEq/L", sourceSpan: "Na 134 mEq/L, K 6.1 mEq/L, Cl 96 mEq/L, HCO₃ 18 mEq/L, BUN 68 mg/dL, creatinine 4.2 mg/dL, BUN:Cr 16.2:1, glucose 188 mg/dL, calcium 8.4 mg/dL, phosphorus 5.1 mg/dL, magnesium 1.6 mg/dL." },
      { label: "chloride", value: "96", sourceUnit: "mEq/L", sourceSpan: "Na 134 mEq/L, K 6.1 mEq/L, Cl 96 mEq/L, HCO₃ 18 mEq/L, BUN 68 mg/dL, creatinine 4.2 mg/dL, BUN:Cr 16.2:1, glucose 188 mg/dL, calcium 8.4 mg/dL, phosphorus 5.1 mg/dL, magnesium 1.6 mg/dL." },
      { label: "bicarbonate", value: "18", sourceUnit: "mEq/L", sourceSpan: "Na 134 mEq/L, K 6.1 mEq/L, Cl 96 mEq/L, HCO₃ 18 mEq/L, BUN 68 mg/dL, creatinine 4.2 mg/dL, BUN:Cr 16.2:1, glucose 188 mg/dL, calcium 8.4 mg/dL, phosphorus 5.1 mg/dL, magnesium 1.6 mg/dL." },
      { label: "bun", value: "68", sourceUnit: "mg/dL", sourceSpan: "Na 134 mEq/L, K 6.1 mEq/L, Cl 96 mEq/L, HCO₃ 18 mEq/L, BUN 68 mg/dL, creatinine 4.2 mg/dL, BUN:Cr 16.2:1, glucose 188 mg/dL, calcium 8.4 mg/dL, phosphorus 5.1 mg/dL, magnesium 1.6 mg/dL." },
      { label: "creatinine", value: "4.2", sourceUnit: "mg/dL", sourceSpan: "Na 134 mEq/L, K 6.1 mEq/L, Cl 96 mEq/L, HCO₃ 18 mEq/L, BUN 68 mg/dL, creatinine 4.2 mg/dL, BUN:Cr 16.2:1, glucose 188 mg/dL, calcium 8.4 mg/dL, phosphorus 5.1 mg/dL, magnesium 1.6 mg/dL." },
      { label: "glucose", value: "188", sourceUnit: "mg/dL", sourceSpan: "Na 134 mEq/L, K 6.1 mEq/L, Cl 96 mEq/L, HCO₃ 18 mEq/L, BUN 68 mg/dL, creatinine 4.2 mg/dL, BUN:Cr 16.2:1, glucose 188 mg/dL, calcium 8.4 mg/dL, phosphorus 5.1 mg/dL, magnesium 1.6 mg/dL." },
      { label: "calcium", value: "8.4", sourceUnit: "mg/dL", sourceSpan: "Na 134 mEq/L, K 6.1 mEq/L, Cl 96 mEq/L, HCO₃ 18 mEq/L, BUN 68 mg/dL, creatinine 4.2 mg/dL, BUN:Cr 16.2:1, glucose 188 mg/dL, calcium 8.4 mg/dL, phosphorus 5.1 mg/dL, magnesium 1.6 mg/dL." },
      { label: "phosphate", value: "5.1", sourceUnit: "mg/dL", sourceSpan: "Na 134 mEq/L, K 6.1 mEq/L, Cl 96 mEq/L, HCO₃ 18 mEq/L, BUN 68 mg/dL, creatinine 4.2 mg/dL, BUN:Cr 16.2:1, glucose 188 mg/dL, calcium 8.4 mg/dL, phosphorus 5.1 mg/dL, magnesium 1.6 mg/dL." },
      { label: "magnesium", value: "1.6", sourceUnit: "mg/dL", sourceSpan: "Na 134 mEq/L, K 6.1 mEq/L, Cl 96 mEq/L, HCO₃ 18 mEq/L, BUN 68 mg/dL, creatinine 4.2 mg/dL, BUN:Cr 16.2:1, glucose 188 mg/dL, calcium 8.4 mg/dL, phosphorus 5.1 mg/dL, magnesium 1.6 mg/dL." },
      { label: "wbc", value: "11,200", sourceUnit: "/µL", sourceSpan: "CBC: WBC 11,200/µL, Hgb 13.8 g/dL, platelets 210,000/µL." },
      { label: "hemoglobin", value: "13.8", sourceUnit: "g/dL", sourceSpan: "CBC: WBC 11,200/µL, Hgb 13.8 g/dL, platelets 210,000/µL." },
      { label: "platelets", value: "210,000", sourceUnit: "/µL", sourceSpan: "CBC: WBC 11,200/µL, Hgb 13.8 g/dL, platelets 210,000/µL." },
      { label: "ph", value: "7.30", sourceUnit: "(unitless)", sourceSpan: "VBG: pH 7.30, pCO₂ 32 mmHg, lactate 2.8 mmol/L." },
      { label: "lactate", value: "2.8", sourceUnit: "mmol/L", sourceSpan: "VBG: pH 7.30, pCO₂ 32 mmHg, lactate 2.8 mmol/L." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/stage1_course",
    lane: "extract",
    panel: [
      { label: "hr", value: "106", sourceUnit: "bpm", sourceSpan: "Repeat vitals: HR 106, BP 92/58, RR 18, SpO₂ 97%.", context: "post_intervention" },
      { label: "sbp", value: "92", sourceUnit: "mmHg", sourceSpan: "Repeat vitals: HR 106, BP 92/58, RR 18, SpO₂ 97%.", context: "post_intervention" },
      { label: "dbp", value: "58", sourceUnit: "mmHg", sourceSpan: "Repeat vitals: HR 106, BP 92/58, RR 18, SpO₂ 97%.", context: "post_intervention" },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Repeat vitals: HR 106, BP 92/58, RR 18, SpO₂ 97%.", context: "post_intervention" },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Repeat vitals: HR 106, BP 92/58, RR 18, SpO₂ 97%.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/stage2_course",
    lane: "extract",
    panel: [
      { label: "potassium", value: "6.4", sourceUnit: "mEq/L", sourceSpan: "At hour 4: K 6.4 mEq/L, creatinine 4.5 mg/dL, BUN 72 mg/dL, HCO₃ 16 mEq/L, lactate 3.2 mmol/L, glucose 162 mg/dL.", context: "post_intervention" },
      { label: "creatinine", value: "4.5", sourceUnit: "mg/dL", sourceSpan: "At hour 4: K 6.4 mEq/L, creatinine 4.5 mg/dL, BUN 72 mg/dL, HCO₃ 16 mEq/L, lactate 3.2 mmol/L, glucose 162 mg/dL.", context: "post_intervention" },
      { label: "bun", value: "72", sourceUnit: "mg/dL", sourceSpan: "At hour 4: K 6.4 mEq/L, creatinine 4.5 mg/dL, BUN 72 mg/dL, HCO₃ 16 mEq/L, lactate 3.2 mmol/L, glucose 162 mg/dL.", context: "post_intervention" },
      { label: "bicarbonate", value: "16", sourceUnit: "mEq/L", sourceSpan: "At hour 4: K 6.4 mEq/L, creatinine 4.5 mg/dL, BUN 72 mg/dL, HCO₃ 16 mEq/L, lactate 3.2 mmol/L, glucose 162 mg/dL.", context: "post_intervention" },
      { label: "lactate", value: "3.2", sourceUnit: "mmol/L", sourceSpan: "At hour 4: K 6.4 mEq/L, creatinine 4.5 mg/dL, BUN 72 mg/dL, HCO₃ 16 mEq/L, lactate 3.2 mmol/L, glucose 162 mg/dL.", context: "post_intervention" },
      { label: "glucose", value: "162", sourceUnit: "mg/dL", sourceSpan: "At hour 4: K 6.4 mEq/L, creatinine 4.5 mg/dL, BUN 72 mg/dL, HCO₃ 16 mEq/L, lactate 3.2 mmol/L, glucose 162 mg/dL.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/stage3_course",
    lane: "skip_serial"
  },
  {
    exhibitRef: "gpt_case_caregiver_role_strain_dementia_01/baseline_assessment_and_labs",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "°C", sourceSpan: "Margaret: T 36.8 °C, HR 76 regular, BP 148/88, RR 16, SpO₂ 97% room air." },
      { label: "hr", value: "76", sourceUnit: "bpm", sourceSpan: "Margaret: T 36.8 °C, HR 76 regular, BP 148/88, RR 16, SpO₂ 97% room air." },
      { label: "sbp", value: "148", sourceUnit: "mmHg", sourceSpan: "Margaret: T 36.8 °C, HR 76 regular, BP 148/88, RR 16, SpO₂ 97% room air." },
      { label: "dbp", value: "88", sourceUnit: "mmHg", sourceSpan: "Margaret: T 36.8 °C, HR 76 regular, BP 148/88, RR 16, SpO₂ 97% room air." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Margaret: T 36.8 °C, HR 76 regular, BP 148/88, RR 16, SpO₂ 97% room air." },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Margaret: T 36.8 °C, HR 76 regular, BP 148/88, RR 16, SpO₂ 97% room air." },
      { label: "sodium", value: "141", sourceUnit: "mEq/L", sourceSpan: "Labs from primary care office 1 week ago: sodium 141 mEq/L, potassium 4.2 mEq/L, BUN 24 mg/dL, creatinine 0.9 mg/dL, fasting glucose 102 mg/dL, albumin 3.1 g/dL, prealbumin 14 mg/dL, TSH 2.8 mIU/L, hemoglobin 11.8 g/dL, hematocrit 35%, WBC 6,200/µL, platelets 210,000/µL." },
      { label: "potassium", value: "4.2", sourceUnit: "mEq/L", sourceSpan: "Labs from primary care office 1 week ago: sodium 141 mEq/L, potassium 4.2 mEq/L, BUN 24 mg/dL, creatinine 0.9 mg/dL, fasting glucose 102 mg/dL, albumin 3.1 g/dL, prealbumin 14 mg/dL, TSH 2.8 mIU/L, hemoglobin 11.8 g/dL, hematocrit 35%, WBC 6,200/µL, platelets 210,000/µL." },
      { label: "bun", value: "24", sourceUnit: "mg/dL", sourceSpan: "Labs from primary care office 1 week ago: sodium 141 mEq/L, potassium 4.2 mEq/L, BUN 24 mg/dL, creatinine 0.9 mg/dL, fasting glucose 102 mg/dL, albumin 3.1 g/dL, prealbumin 14 mg/dL, TSH 2.8 mIU/L, hemoglobin 11.8 g/dL, hematocrit 35%, WBC 6,200/µL, platelets 210,000/µL." },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "Labs from primary care office 1 week ago: sodium 141 mEq/L, potassium 4.2 mEq/L, BUN 24 mg/dL, creatinine 0.9 mg/dL, fasting glucose 102 mg/dL, albumin 3.1 g/dL, prealbumin 14 mg/dL, TSH 2.8 mIU/L, hemoglobin 11.8 g/dL, hematocrit 35%, WBC 6,200/µL, platelets 210,000/µL." },
      { label: "glucose", value: "102", sourceUnit: "mg/dL", sourceSpan: "Labs from primary care office 1 week ago: sodium 141 mEq/L, potassium 4.2 mEq/L, BUN 24 mg/dL, creatinine 0.9 mg/dL, fasting glucose 102 mg/dL, albumin 3.1 g/dL, prealbumin 14 mg/dL, TSH 2.8 mIU/L, hemoglobin 11.8 g/dL, hematocrit 35%, WBC 6,200/µL, platelets 210,000/µL." },
      { label: "hemoglobin", value: "11.8", sourceUnit: "g/dL", sourceSpan: "Labs from primary care office 1 week ago: sodium 141 mEq/L, potassium 4.2 mEq/L, BUN 24 mg/dL, creatinine 0.9 mg/dL, fasting glucose 102 mg/dL, albumin 3.1 g/dL, prealbumin 14 mg/dL, TSH 2.8 mIU/L, hemoglobin 11.8 g/dL, hematocrit 35%, WBC 6,200/µL, platelets 210,000/µL." },
      { label: "hematocrit", value: "35", sourceUnit: "%", sourceSpan: "Labs from primary care office 1 week ago: sodium 141 mEq/L, potassium 4.2 mEq/L, BUN 24 mg/dL, creatinine 0.9 mg/dL, fasting glucose 102 mg/dL, albumin 3.1 g/dL, prealbumin 14 mg/dL, TSH 2.8 mIU/L, hemoglobin 11.8 g/dL, hematocrit 35%, WBC 6,200/µL, platelets 210,000/µL." },
      { label: "wbc", value: "6,200", sourceUnit: "/µL", sourceSpan: "Labs from primary care office 1 week ago: sodium 141 mEq/L, potassium 4.2 mEq/L, BUN 24 mg/dL, creatinine 0.9 mg/dL, fasting glucose 102 mg/dL, albumin 3.1 g/dL, prealbumin 14 mg/dL, TSH 2.8 mIU/L, hemoglobin 11.8 g/dL, hematocrit 35%, WBC 6,200/µL, platelets 210,000/µL." },
      { label: "platelets", value: "210,000", sourceUnit: "/µL", sourceSpan: "Labs from primary care office 1 week ago: sodium 141 mEq/L, potassium 4.2 mEq/L, BUN 24 mg/dL, creatinine 0.9 mg/dL, fasting glucose 102 mg/dL, albumin 3.1 g/dL, prealbumin 14 mg/dL, TSH 2.8 mIU/L, hemoglobin 11.8 g/dL, hematocrit 35%, WBC 6,200/µL, platelets 210,000/µL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_caregiver_role_strain_dementia_01/stage_1_agitation_and_stove",
    lane: "skip_serial"
  },
  {
    exhibitRef: "gpt_case_client_advocacy_refusal_01/baseline_record",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "C", sourceSpan: "Vitals: T 36.8 C, HR 92 irregular, BP 104/62, RR 22, SpO2 93% on 2 L nasal cannula." },
      { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: "Vitals: T 36.8 C, HR 92 irregular, BP 104/62, RR 22, SpO2 93% on 2 L nasal cannula." },
      { label: "sbp", value: "104", sourceUnit: "mmHg", sourceSpan: "Vitals: T 36.8 C, HR 92 irregular, BP 104/62, RR 22, SpO2 93% on 2 L nasal cannula." },
      { label: "dbp", value: "62", sourceUnit: "mmHg", sourceSpan: "Vitals: T 36.8 C, HR 92 irregular, BP 104/62, RR 22, SpO2 93% on 2 L nasal cannula." },
      { label: "rr", value: "22", sourceUnit: "/min", sourceSpan: "Vitals: T 36.8 C, HR 92 irregular, BP 104/62, RR 22, SpO2 93% on 2 L nasal cannula." },
      { label: "spo2", value: "93", sourceUnit: "%", sourceSpan: "Vitals: T 36.8 C, HR 92 irregular, BP 104/62, RR 22, SpO2 93% on 2 L nasal cannula." },
      { label: "bnp", value: "2,840", sourceUnit: "pg/mL", sourceSpan: "Admission labs: BNP 2,840 pg/mL, Na 131 mEq/L, K 5.1 mEq/L, BUN 48 mg/dL, creatinine 3.2 mg/dL, eGFR 14 mL/min/1.73 m2, glucose 142 mg/dL, albumin 2.6 g/dL, Hgb 9.8 g/dL, WBC 6,200/uL, platelets 188,000/uL, INR 1.1, prealbumin 11 mg/dL." },
      { label: "sodium", value: "131", sourceUnit: "mEq/L", sourceSpan: "Admission labs: BNP 2,840 pg/mL, Na 131 mEq/L, K 5.1 mEq/L, BUN 48 mg/dL, creatinine 3.2 mg/dL, eGFR 14 mL/min/1.73 m2, glucose 142 mg/dL, albumin 2.6 g/dL, Hgb 9.8 g/dL, WBC 6,200/uL, platelets 188,000/uL, INR 1.1, prealbumin 11 mg/dL." },
      { label: "potassium", value: "5.1", sourceUnit: "mEq/L", sourceSpan: "Admission labs: BNP 2,840 pg/mL, Na 131 mEq/L, K 5.1 mEq/L, BUN 48 mg/dL, creatinine 3.2 mg/dL, eGFR 14 mL/min/1.73 m2, glucose 142 mg/dL, albumin 2.6 g/dL, Hgb 9.8 g/dL, WBC 6,200/uL, platelets 188,000/uL, INR 1.1, prealbumin 11 mg/dL." },
      { label: "bun", value: "48", sourceUnit: "mg/dL", sourceSpan: "Admission labs: BNP 2,840 pg/mL, Na 131 mEq/L, K 5.1 mEq/L, BUN 48 mg/dL, creatinine 3.2 mg/dL, eGFR 14 mL/min/1.73 m2, glucose 142 mg/dL, albumin 2.6 g/dL, Hgb 9.8 g/dL, WBC 6,200/uL, platelets 188,000/uL, INR 1.1, prealbumin 11 mg/dL." },
      { label: "creatinine", value: "3.2", sourceUnit: "mg/dL", sourceSpan: "Admission labs: BNP 2,840 pg/mL, Na 131 mEq/L, K 5.1 mEq/L, BUN 48 mg/dL, creatinine 3.2 mg/dL, eGFR 14 mL/min/1.73 m2, glucose 142 mg/dL, albumin 2.6 g/dL, Hgb 9.8 g/dL, WBC 6,200/uL, platelets 188,000/uL, INR 1.1, prealbumin 11 mg/dL." },
      { label: "glucose", value: "142", sourceUnit: "mg/dL", sourceSpan: "Admission labs: BNP 2,840 pg/mL, Na 131 mEq/L, K 5.1 mEq/L, BUN 48 mg/dL, creatinine 3.2 mg/dL, eGFR 14 mL/min/1.73 m2, glucose 142 mg/dL, albumin 2.6 g/dL, Hgb 9.8 g/dL, WBC 6,200/uL, platelets 188,000/uL, INR 1.1, prealbumin 11 mg/dL." },
      { label: "hemoglobin", value: "9.8", sourceUnit: "g/dL", sourceSpan: "Admission labs: BNP 2,840 pg/mL, Na 131 mEq/L, K 5.1 mEq/L, BUN 48 mg/dL, creatinine 3.2 mg/dL, eGFR 14 mL/min/1.73 m2, glucose 142 mg/dL, albumin 2.6 g/dL, Hgb 9.8 g/dL, WBC 6,200/uL, platelets 188,000/uL, INR 1.1, prealbumin 11 mg/dL." },
      { label: "wbc", value: "6,200", sourceUnit: "/uL", sourceSpan: "Admission labs: BNP 2,840 pg/mL, Na 131 mEq/L, K 5.1 mEq/L, BUN 48 mg/dL, creatinine 3.2 mg/dL, eGFR 14 mL/min/1.73 m2, glucose 142 mg/dL, albumin 2.6 g/dL, Hgb 9.8 g/dL, WBC 6,200/uL, platelets 188,000/uL, INR 1.1, prealbumin 11 mg/dL." },
      { label: "platelets", value: "188,000", sourceUnit: "/uL", sourceSpan: "Admission labs: BNP 2,840 pg/mL, Na 131 mEq/L, K 5.1 mEq/L, BUN 48 mg/dL, creatinine 3.2 mg/dL, eGFR 14 mL/min/1.73 m2, glucose 142 mg/dL, albumin 2.6 g/dL, Hgb 9.8 g/dL, WBC 6,200/uL, platelets 188,000/uL, INR 1.1, prealbumin 11 mg/dL." },
      { label: "inr", value: "1.1", sourceUnit: "(ratio)", sourceSpan: "Admission labs: BNP 2,840 pg/mL, Na 131 mEq/L, K 5.1 mEq/L, BUN 48 mg/dL, creatinine 3.2 mg/dL, eGFR 14 mL/min/1.73 m2, glucose 142 mg/dL, albumin 2.6 g/dL, Hgb 9.8 g/dL, WBC 6,200/uL, platelets 188,000/uL, INR 1.1, prealbumin 11 mg/dL." }
    ],
    excludedValues: [
      { label: "creatinine", value: "2.8", reason: "prior", sourceSpan: "baseline creatinine 2.8 mg/dL" }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_client_advocacy_refusal_01/stage_2_update",
    lane: "extract",
    panel: [
      { label: "hr", value: "90", sourceUnit: "bpm", sourceSpan: "Vitals: HR 90, BP 100/60, RR 20, SpO2 94% on 2 L." },
      { label: "sbp", value: "100", sourceUnit: "mmHg", sourceSpan: "Vitals: HR 90, BP 100/60, RR 20, SpO2 94% on 2 L." },
      { label: "dbp", value: "60", sourceUnit: "mmHg", sourceSpan: "Vitals: HR 90, BP 100/60, RR 20, SpO2 94% on 2 L." },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "Vitals: HR 90, BP 100/60, RR 20, SpO2 94% on 2 L." },
      { label: "spo2", value: "94", sourceUnit: "%", sourceSpan: "Vitals: HR 90, BP 100/60, RR 20, SpO2 94% on 2 L." },
      { label: "bnp", value: "2,410", sourceUnit: "pg/mL", sourceSpan: "BNP 2,410 pg/mL, creatinine 3.4 mg/dL, K 5.3 mEq/L, Na 130 mEq/L." },
      { label: "creatinine", value: "3.4", sourceUnit: "mg/dL", sourceSpan: "BNP 2,410 pg/mL, creatinine 3.4 mg/dL, K 5.3 mEq/L, Na 130 mEq/L." },
      { label: "potassium", value: "5.3", sourceUnit: "mEq/L", sourceSpan: "BNP 2,410 pg/mL, creatinine 3.4 mg/dL, K 5.3 mEq/L, Na 130 mEq/L." },
      { label: "sodium", value: "130", sourceUnit: "mEq/L", sourceSpan: "BNP 2,410 pg/mL, creatinine 3.4 mg/dL, K 5.3 mEq/L, Na 130 mEq/L." }
    ],
    excludedValues: [],
    unitAliases: []
  }
];

const batch12Records: ExtractionRecord[] = [
  {
    exhibitRef: "gpt_case_clozapine_toxicity_01/baseline_record",
    lane: "skip_serial"
  },
  {
    exhibitRef: "gpt_case_clozapine_toxicity_01/day10_update",
    lane: "skip_serial"
  },
  {
    exhibitRef: "gpt_case_clozapine_toxicity_01/day18_assessment",
    lane: "skip_serial"
  },
  {
    exhibitRef: "gpt_case_clozapine_toxicity_01/four_hour_update",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.4", sourceUnit: "°C", sourceSpan: "Repeat vital signs: T 38.4 °C, HR 112, BP 106/68, RR 20, SpO2 97% on 2 L oxygen.", context: "post_intervention" },
      { label: "hr", value: "112", sourceUnit: "bpm", sourceSpan: "Repeat vital signs: T 38.4 °C, HR 112, BP 106/68, RR 20, SpO2 97% on 2 L oxygen.", context: "post_intervention" },
      { label: "sbp", value: "106", sourceUnit: "mmHg", sourceSpan: "Repeat vital signs: T 38.4 °C, HR 112, BP 106/68, RR 20, SpO2 97% on 2 L oxygen.", context: "post_intervention" },
      { label: "dbp", value: "68", sourceUnit: "mmHg", sourceSpan: "Repeat vital signs: T 38.4 °C, HR 112, BP 106/68, RR 20, SpO2 97% on 2 L oxygen.", context: "post_intervention" },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "Repeat vital signs: T 38.4 °C, HR 112, BP 106/68, RR 20, SpO2 97% on 2 L oxygen.", context: "post_intervention" },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Repeat vital signs: T 38.4 °C, HR 112, BP 106/68, RR 20, SpO2 97% on 2 L oxygen.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gallstone_pancreatitis_01/stage_1_update",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gallstone_pancreatitis_01/stage_2_update",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.4", sourceUnit: "C", sourceSpan: "At hour 16: T 38.4 C, HR 118, BP 108/62, RR 26, SpO2 94% on 2 L NC." },
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "At hour 16: T 38.4 C, HR 118, BP 108/62, RR 26, SpO2 94% on 2 L NC." },
      { label: "sbp", value: "108", sourceUnit: "mmHg", sourceSpan: "At hour 16: T 38.4 C, HR 118, BP 108/62, RR 26, SpO2 94% on 2 L NC." },
      { label: "dbp", value: "62", sourceUnit: "mmHg", sourceSpan: "At hour 16: T 38.4 C, HR 118, BP 108/62, RR 26, SpO2 94% on 2 L NC." },
      { label: "rr", value: "26", sourceUnit: "/min", sourceSpan: "At hour 16: T 38.4 C, HR 118, BP 108/62, RR 26, SpO2 94% on 2 L NC." },
      { label: "spo2", value: "94", sourceUnit: "%", sourceSpan: "At hour 16: T 38.4 C, HR 118, BP 108/62, RR 26, SpO2 94% on 2 L NC." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gallstone_pancreatitis_01/stage_3_update",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.6", sourceUnit: "C", sourceSpan: "At hour 40: T 37.6 C, HR 92, BP 124/76, RR 18, SpO2 96% room air.", context: "post_intervention" },
      { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: "At hour 40: T 37.6 C, HR 92, BP 124/76, RR 18, SpO2 96% room air.", context: "post_intervention" },
      { label: "sbp", value: "124", sourceUnit: "mmHg", sourceSpan: "At hour 40: T 37.6 C, HR 92, BP 124/76, RR 18, SpO2 96% room air.", context: "post_intervention" },
      { label: "dbp", value: "76", sourceUnit: "mmHg", sourceSpan: "At hour 40: T 37.6 C, HR 92, BP 124/76, RR 18, SpO2 96% room air.", context: "post_intervention" },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "At hour 40: T 37.6 C, HR 92, BP 124/76, RR 18, SpO2 96% room air.", context: "post_intervention" },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "At hour 40: T 37.6 C, HR 92, BP 124/76, RR 18, SpO2 96% room air.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_deterioration",
    lane: "extract",
    panel: [
      { label: "sbp", value: "78", sourceUnit: "mm Hg", sourceSpan: "BP 78/40 mm Hg, HR 132/min." },
      { label: "dbp", value: "40", sourceUnit: "mm Hg", sourceSpan: "BP 78/40 mm Hg, HR 132/min." },
      { label: "hr", value: "132", sourceUnit: "bpm", sourceSpan: "BP 78/40 mm Hg, HR 132/min." },
      { label: "glucose", value: "48", sourceUnit: "mg/dL", sourceSpan: "Capillary glucose is 48 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_response",
    lane: "extract",
    panel: [
      { label: "sbp", value: "96", sourceUnit: "mm Hg", sourceSpan: "BP 96/58 mm Hg, HR 108/min, capillary glucose 92 mg/dL.", context: "post_intervention" },
      { label: "dbp", value: "58", sourceUnit: "mm Hg", sourceSpan: "BP 96/58 mm Hg, HR 108/min, capillary glucose 92 mg/dL.", context: "post_intervention" },
      { label: "hr", value: "108", sourceUnit: "bpm", sourceSpan: "BP 96/58 mm Hg, HR 108/min, capillary glucose 92 mg/dL.", context: "post_intervention" },
      { label: "glucose", value: "92", sourceUnit: "mg/dL", sourceSpan: "BP 96/58 mm Hg, HR 108/min, capillary glucose 92 mg/dL.", context: "post_intervention" },
      { label: "potassium", value: "5.4", sourceUnit: "mEq/L", sourceSpan: "Potassium is 5.4 mEq/L and sodium is 128 mEq/L.", context: "post_intervention" },
      { label: "sodium", value: "128", sourceUnit: "mEq/L", sourceSpan: "Potassium is 5.4 mEq/L and sodium is 128 mEq/L.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_aki_02/aki_initial",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.6", sourceUnit: "°C", sourceSpan: "Vital signs: T 37.6° C, HR 108/min, BP 96/58 mm Hg." },
      { label: "hr", value: "108", sourceUnit: "bpm", sourceSpan: "Vital signs: T 37.6° C, HR 108/min, BP 96/58 mm Hg." },
      { label: "sbp", value: "96", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 37.6° C, HR 108/min, BP 96/58 mm Hg." },
      { label: "dbp", value: "58", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 37.6° C, HR 108/min, BP 96/58 mm Hg." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_deterioration",
    lane: "extract",
    panel: [
      { label: "hr", value: "128", sourceUnit: "bpm", sourceSpan: "HR 128/min, BP 88/52 mm Hg, RR 24/min." },
      { label: "sbp", value: "88", sourceUnit: "mm Hg", sourceSpan: "HR 128/min, BP 88/52 mm Hg, RR 24/min." },
      { label: "dbp", value: "52", sourceUnit: "mm Hg", sourceSpan: "HR 128/min, BP 88/52 mm Hg, RR 24/min." },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "HR 128/min, BP 88/52 mm Hg, RR 24/min." },
      { label: "hemoglobin", value: "9.8", sourceUnit: "g/dL", sourceSpan: "Stat labs: hemoglobin 9.8 g/dL, platelet count 96,000/mm3, aPTT >150 seconds." },
      { label: "platelets", value: "96,000", sourceUnit: "/mm3", sourceSpan: "Stat labs: hemoglobin 9.8 g/dL, platelet count 96,000/mm3, aPTT >150 seconds." },
      { label: "ptt", value: ">150", sourceUnit: "seconds", sourceSpan: "Stat labs: hemoglobin 9.8 g/dL, platelet count 96,000/mm3, aPTT >150 seconds." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_response",
    lane: "extract",
    panel: [
      { label: "sbp", value: "94", sourceUnit: "mm Hg", sourceSpan: "BP 94/56 mm Hg after fluid bolus, HR 116/min.", context: "post_intervention" },
      { label: "dbp", value: "56", sourceUnit: "mm Hg", sourceSpan: "BP 94/56 mm Hg after fluid bolus, HR 116/min.", context: "post_intervention" },
      { label: "hr", value: "116", sourceUnit: "bpm", sourceSpan: "BP 94/56 mm Hg after fluid bolus, HR 116/min.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_deterioration",
    lane: "extract",
    panel: [
      { label: "hr", value: "132", sourceUnit: "bpm", sourceSpan: "HR 132/min, RR 30/min, BP 86/48 mm Hg, SpO2 90% on 4 L/min nasal cannula." },
      { label: "rr", value: "30", sourceUnit: "/min", sourceSpan: "HR 132/min, RR 30/min, BP 86/48 mm Hg, SpO2 90% on 4 L/min nasal cannula." },
      { label: "sbp", value: "86", sourceUnit: "mm Hg", sourceSpan: "HR 132/min, RR 30/min, BP 86/48 mm Hg, SpO2 90% on 4 L/min nasal cannula." },
      { label: "dbp", value: "48", sourceUnit: "mm Hg", sourceSpan: "HR 132/min, RR 30/min, BP 86/48 mm Hg, SpO2 90% on 4 L/min nasal cannula." },
      { label: "spo2", value: "90", sourceUnit: "%", sourceSpan: "HR 132/min, RR 30/min, BP 86/48 mm Hg, SpO2 90% on 4 L/min nasal cannula." },
      { label: "hematocrit", value: "52", sourceUnit: "%", sourceSpan: "Hematocrit 52%, BUN 39 mg/dL, calcium 6.8 mg/dL." },
      { label: "bun", value: "39", sourceUnit: "mg/dL", sourceSpan: "Hematocrit 52%, BUN 39 mg/dL, calcium 6.8 mg/dL." },
      { label: "calcium", value: "6.8", sourceUnit: "mg/dL", sourceSpan: "Hematocrit 52%, BUN 39 mg/dL, calcium 6.8 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_tls_01/baseline_exhibit",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.0", sourceUnit: "°C", sourceSpan: "Assessment: T 37.0°C, HR 88/min, BP 128/80 mm Hg, RR 16/min, SpO2 98% on room air." },
      { label: "hr", value: "88", sourceUnit: "bpm", sourceSpan: "Assessment: T 37.0°C, HR 88/min, BP 128/80 mm Hg, RR 16/min, SpO2 98% on room air." },
      { label: "sbp", value: "128", sourceUnit: "mm Hg", sourceSpan: "Assessment: T 37.0°C, HR 88/min, BP 128/80 mm Hg, RR 16/min, SpO2 98% on room air." },
      { label: "dbp", value: "80", sourceUnit: "mm Hg", sourceSpan: "Assessment: T 37.0°C, HR 88/min, BP 128/80 mm Hg, RR 16/min, SpO2 98% on room air." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Assessment: T 37.0°C, HR 88/min, BP 128/80 mm Hg, RR 16/min, SpO2 98% on room air." },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "Assessment: T 37.0°C, HR 88/min, BP 128/80 mm Hg, RR 16/min, SpO2 98% on room air." },
      { label: "wbc", value: "48,000", sourceUnit: "/µL", sourceSpan: "Labs: WBC 48,000/µL, hemoglobin 10.2 g/dL, platelets 98,000/µL, BUN 22 mg/dL, creatinine 1.1 mg/dL, potassium 4.8 mEq/L, phosphorus 4.9 mg/dL, calcium 8.9 mg/dL, uric acid 9.2 mg/dL, LDH 1,450 U/L." },
      { label: "hemoglobin", value: "10.2", sourceUnit: "g/dL", sourceSpan: "Labs: WBC 48,000/µL, hemoglobin 10.2 g/dL, platelets 98,000/µL, BUN 22 mg/dL, creatinine 1.1 mg/dL, potassium 4.8 mEq/L, phosphorus 4.9 mg/dL, calcium 8.9 mg/dL, uric acid 9.2 mg/dL, LDH 1,450 U/L." },
      { label: "platelets", value: "98,000", sourceUnit: "/µL", sourceSpan: "Labs: WBC 48,000/µL, hemoglobin 10.2 g/dL, platelets 98,000/µL, BUN 22 mg/dL, creatinine 1.1 mg/dL, potassium 4.8 mEq/L, phosphorus 4.9 mg/dL, calcium 8.9 mg/dL, uric acid 9.2 mg/dL, LDH 1,450 U/L." },
      { label: "bun", value: "22", sourceUnit: "mg/dL", sourceSpan: "Labs: WBC 48,000/µL, hemoglobin 10.2 g/dL, platelets 98,000/µL, BUN 22 mg/dL, creatinine 1.1 mg/dL, potassium 4.8 mEq/L, phosphorus 4.9 mg/dL, calcium 8.9 mg/dL, uric acid 9.2 mg/dL, LDH 1,450 U/L." },
      { label: "creatinine", value: "1.1", sourceUnit: "mg/dL", sourceSpan: "Labs: WBC 48,000/µL, hemoglobin 10.2 g/dL, platelets 98,000/µL, BUN 22 mg/dL, creatinine 1.1 mg/dL, potassium 4.8 mEq/L, phosphorus 4.9 mg/dL, calcium 8.9 mg/dL, uric acid 9.2 mg/dL, LDH 1,450 U/L." },
      { label: "potassium", value: "4.8", sourceUnit: "mEq/L", sourceSpan: "Labs: WBC 48,000/µL, hemoglobin 10.2 g/dL, platelets 98,000/µL, BUN 22 mg/dL, creatinine 1.1 mg/dL, potassium 4.8 mEq/L, phosphorus 4.9 mg/dL, calcium 8.9 mg/dL, uric acid 9.2 mg/dL, LDH 1,450 U/L." },
      { label: "phosphate", value: "4.9", sourceUnit: "mg/dL", sourceSpan: "Labs: WBC 48,000/µL, hemoglobin 10.2 g/dL, platelets 98,000/µL, BUN 22 mg/dL, creatinine 1.1 mg/dL, potassium 4.8 mEq/L, phosphorus 4.9 mg/dL, calcium 8.9 mg/dL, uric acid 9.2 mg/dL, LDH 1,450 U/L." },
      { label: "calcium", value: "8.9", sourceUnit: "mg/dL", sourceSpan: "Labs: WBC 48,000/µL, hemoglobin 10.2 g/dL, platelets 98,000/µL, BUN 22 mg/dL, creatinine 1.1 mg/dL, potassium 4.8 mEq/L, phosphorus 4.9 mg/dL, calcium 8.9 mg/dL, uric acid 9.2 mg/dL, LDH 1,450 U/L." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_tls_01/stage1_exhibit",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.4", sourceUnit: "°C", sourceSpan: "T 37.4°C, HR 108/min, BP 132/88 mm Hg, RR 22/min, SpO2 97% on room air." },
      { label: "hr", value: "108", sourceUnit: "bpm", sourceSpan: "T 37.4°C, HR 108/min, BP 132/88 mm Hg, RR 22/min, SpO2 97% on room air." },
      { label: "sbp", value: "132", sourceUnit: "mm Hg", sourceSpan: "T 37.4°C, HR 108/min, BP 132/88 mm Hg, RR 22/min, SpO2 97% on room air." },
      { label: "dbp", value: "88", sourceUnit: "mm Hg", sourceSpan: "T 37.4°C, HR 108/min, BP 132/88 mm Hg, RR 22/min, SpO2 97% on room air." },
      { label: "rr", value: "22", sourceUnit: "/min", sourceSpan: "T 37.4°C, HR 108/min, BP 132/88 mm Hg, RR 22/min, SpO2 97% on room air." },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "T 37.4°C, HR 108/min, BP 132/88 mm Hg, RR 22/min, SpO2 97% on room air." },
      { label: "potassium", value: "7.1", sourceUnit: "mEq/L", sourceSpan: "Repeat labs: potassium 7.1 mEq/L, phosphorus 8.4 mg/dL, calcium 6.8 mg/dL, uric acid 4.1 mg/dL, creatinine 2.4 mg/dL, LDH 3,200 U/L." },
      { label: "phosphate", value: "8.4", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: potassium 7.1 mEq/L, phosphorus 8.4 mg/dL, calcium 6.8 mg/dL, uric acid 4.1 mg/dL, creatinine 2.4 mg/dL, LDH 3,200 U/L." },
      { label: "calcium", value: "6.8", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: potassium 7.1 mEq/L, phosphorus 8.4 mg/dL, calcium 6.8 mg/dL, uric acid 4.1 mg/dL, creatinine 2.4 mg/dL, LDH 3,200 U/L." },
      { label: "creatinine", value: "2.4", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: potassium 7.1 mEq/L, phosphorus 8.4 mg/dL, calcium 6.8 mg/dL, uric acid 4.1 mg/dL, creatinine 2.4 mg/dL, LDH 3,200 U/L." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_tls_01/stage3_exhibit",
    lane: "extract",
    panel: [
      { label: "hr", value: "96", sourceUnit: "bpm", sourceSpan: "HR 96/min, BP 126/78 mm Hg, RR 18/min, SpO2 98% on room air.", context: "post_intervention" },
      { label: "sbp", value: "126", sourceUnit: "mm Hg", sourceSpan: "HR 96/min, BP 126/78 mm Hg, RR 18/min, SpO2 98% on room air.", context: "post_intervention" },
      { label: "dbp", value: "78", sourceUnit: "mm Hg", sourceSpan: "HR 96/min, BP 126/78 mm Hg, RR 18/min, SpO2 98% on room air.", context: "post_intervention" },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "HR 96/min, BP 126/78 mm Hg, RR 18/min, SpO2 98% on room air.", context: "post_intervention" },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "HR 96/min, BP 126/78 mm Hg, RR 18/min, SpO2 98% on room air.", context: "post_intervention" },
      { label: "potassium", value: "5.4", sourceUnit: "mEq/L", sourceSpan: "Labs: potassium 5.4 mEq/L, phosphorus 6.2 mg/dL, calcium 7.5 mg/dL, creatinine 2.0 mg/dL, uric acid 2.8 mg/dL.", context: "post_intervention" },
      { label: "phosphate", value: "6.2", sourceUnit: "mg/dL", sourceSpan: "Labs: potassium 5.4 mEq/L, phosphorus 6.2 mg/dL, calcium 7.5 mg/dL, creatinine 2.0 mg/dL, uric acid 2.8 mg/dL.", context: "post_intervention" },
      { label: "calcium", value: "7.5", sourceUnit: "mg/dL", sourceSpan: "Labs: potassium 5.4 mEq/L, phosphorus 6.2 mg/dL, calcium 7.5 mg/dL, creatinine 2.0 mg/dL, uric acid 2.8 mg/dL.", context: "post_intervention" },
      { label: "creatinine", value: "2.0", sourceUnit: "mg/dL", sourceSpan: "Labs: potassium 5.4 mEq/L, phosphorus 6.2 mg/dL, calcium 7.5 mg/dL, creatinine 2.0 mg/dL, uric acid 2.8 mg/dL.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_urosepsis_05/sepsis_deterioration",
    lane: "extract",
    panel: [
      { label: "sbp", value: "84", sourceUnit: "mm Hg", sourceSpan: "BP 84/46 mm Hg after 1 L isotonic fluid, HR 132/min, RR 30/min, T 39.5° C.", context: "post_intervention" },
      { label: "dbp", value: "46", sourceUnit: "mm Hg", sourceSpan: "BP 84/46 mm Hg after 1 L isotonic fluid, HR 132/min, RR 30/min, T 39.5° C.", context: "post_intervention" },
      { label: "hr", value: "132", sourceUnit: "bpm", sourceSpan: "BP 84/46 mm Hg after 1 L isotonic fluid, HR 132/min, RR 30/min, T 39.5° C.", context: "post_intervention" },
      { label: "rr", value: "30", sourceUnit: "/min", sourceSpan: "BP 84/46 mm Hg after 1 L isotonic fluid, HR 132/min, RR 30/min, T 39.5° C.", context: "post_intervention" },
      { label: "temp", value: "39.5", sourceUnit: "°C", sourceSpan: "BP 84/46 mm Hg after 1 L isotonic fluid, HR 132/min, RR 30/min, T 39.5° C.", context: "post_intervention" },
      { label: "lactate", value: "4.6", sourceUnit: "mmol/L", sourceSpan: "Repeat lactate is 4.6 mmol/L.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gbs_respiratory_compromise_01/ex_diagnostics",
    lane: "extract",
    panel: [
      { label: "glucose", value: "96", sourceUnit: "mg/dL", sourceSpan: "CSF glucose 62 mg/dL with serum glucose 96 mg/dL" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gbs_respiratory_compromise_01/stage2_12_24h_update",
    lane: "skip_serial"
  },
  {
    exhibitRef: "gpt_case_gbs_respiratory_compromise_01/stage3_icu_days2_5_update",
    lane: "skip_serial"
  }
];

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-10-scattered-2026-07-05.json",
  `${JSON.stringify(batch10Records, null, 2)}\n`,
);

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-11-scattered-2026-07-05.json",
  `${JSON.stringify(batch11Records, null, 2)}\n`,
);

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-12-scattered-2026-07-05.json",
  `${JSON.stringify(batch12Records, null, 2)}\n`,
);

console.log(`Wrote ${batch10Records.length} Batch 10 scattered records, ${batch11Records.length} Batch 11 scattered records, and ${batch12Records.length} Batch 12 scattered records.`);
