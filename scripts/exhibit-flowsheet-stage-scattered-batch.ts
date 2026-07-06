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
    lane: "extract",
    panel: [
      { label: "temp", value: "38.7", sourceUnit: "°C", sourceSpan: "Vital signs and exam: T 38.7 °C, HR 118 at rest, BP 110/70 sitting, RR 22, SpO2 95% on room air." },
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "Vital signs and exam: T 38.7 °C, HR 118 at rest, BP 110/70 sitting, RR 22, SpO2 95% on room air." },
      { label: "sbp", value: "110", sourceUnit: "mmHg", sourceSpan: "Vital signs and exam: T 38.7 °C, HR 118 at rest, BP 110/70 sitting, RR 22, SpO2 95% on room air." },
      { label: "dbp", value: "70", sourceUnit: "mmHg", sourceSpan: "Vital signs and exam: T 38.7 °C, HR 118 at rest, BP 110/70 sitting, RR 22, SpO2 95% on room air." },
      { label: "rr", value: "22", sourceUnit: "/min", sourceSpan: "Vital signs and exam: T 38.7 °C, HR 118 at rest, BP 110/70 sitting, RR 22, SpO2 95% on room air." },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "Vital signs and exam: T 38.7 °C, HR 118 at rest, BP 110/70 sitting, RR 22, SpO2 95% on room air." },
      { label: "wbc", value: "3,100", sourceUnit: "/µL", sourceSpan: "Stat labs: WBC 3,100/µL, ANC 980/µL, Hgb 14.2 g/dL, platelets 210,000/µL." },
      { label: "hemoglobin", value: "14.2", sourceUnit: "g/dL", sourceSpan: "Stat labs: WBC 3,100/µL, ANC 980/µL, Hgb 14.2 g/dL, platelets 210,000/µL." },
      { label: "platelets", value: "210,000", sourceUnit: "/µL", sourceSpan: "Stat labs: WBC 3,100/µL, ANC 980/µL, Hgb 14.2 g/dL, platelets 210,000/µL." },
      { label: "bnp", value: "420", sourceUnit: "pg/mL", sourceSpan: "Troponin I 0.48 ng/mL, CRP 68 mg/L, BNP 420 pg/mL, AST 52 U/L, ALT 48 U/L, fasting glucose 124 mg/dL." },
      { label: "ast", value: "52", sourceUnit: "U/L", sourceSpan: "Troponin I 0.48 ng/mL, CRP 68 mg/L, BNP 420 pg/mL, AST 52 U/L, ALT 48 U/L, fasting glucose 124 mg/dL." },
      { label: "alt", value: "48", sourceUnit: "U/L", sourceSpan: "Troponin I 0.48 ng/mL, CRP 68 mg/L, BNP 420 pg/mL, AST 52 U/L, ALT 48 U/L, fasting glucose 124 mg/dL." },
      { label: "glucose", value: "124", sourceUnit: "mg/dL", sourceSpan: "Troponin I 0.48 ng/mL, CRP 68 mg/L, BNP 420 pg/mL, AST 52 U/L, ALT 48 U/L, fasting glucose 124 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
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
      { label: "spo2", value: "94", sourceUnit: "%", sourceSpan: "At hour 16: T 38.4 C, HR 118, BP 108/62, RR 26, SpO2 94% on 2 L NC." },
      { label: "wbc", value: "19,200", sourceUnit: "/mcL", sourceSpan: "Hour 18 labs: WBC 19,200/mcL, Hct 38%, BUN 18, Cr 0.8, calcium 7.9, ionized calcium 4.0, lipase 2,640, glucose 220, lactate 2.6, CRP 285." },
      { label: "hematocrit", value: "38", sourceUnit: "%", sourceSpan: "Hour 18 labs: WBC 19,200/mcL, Hct 38%, BUN 18, Cr 0.8, calcium 7.9, ionized calcium 4.0, lipase 2,640, glucose 220, lactate 2.6, CRP 285." }
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
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "At hour 40: T 37.6 C, HR 92, BP 124/76, RR 18, SpO2 96% room air.", context: "post_intervention" },
      { label: "wbc", value: "11,800", sourceUnit: "/mcL", sourceSpan: "Hour 42 labs: WBC 11,800/mcL, lipase 980, total bilirubin 1.8, AST 88, ALT 140, calcium 8.4, ionized calcium 4.4, glucose 148, CRP 190, lactate 1.2, Hct 36%.", context: "post_intervention" },
      { label: "hematocrit", value: "36", sourceUnit: "%", sourceSpan: "Hour 42 labs: WBC 11,800/mcL, lipase 980, total bilirubin 1.8, AST 88, ALT 140, calcium 8.4, ionized calcium 4.4, glucose 148, CRP 190, lactate 1.2, Hct 36%.", context: "post_intervention" }
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

const batch13Records: ExtractionRecord[] = [
  {
    exhibitRef: "gpt_case_hipaa_disclosure_breach_01/baseline_assessment_labs",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.2", sourceUnit: "°C", sourceSpan: "0715 vital signs: T 37.2 °C, HR 78/min, BP 134/82 mm Hg, RR 14/min, SpO2 97% on room air." },
      { label: "hr", value: "78", sourceUnit: "bpm", sourceSpan: "0715 vital signs: T 37.2 °C, HR 78/min, BP 134/82 mm Hg, RR 14/min, SpO2 97% on room air." },
      { label: "sbp", value: "134", sourceUnit: "mm Hg", sourceSpan: "0715 vital signs: T 37.2 °C, HR 78/min, BP 134/82 mm Hg, RR 14/min, SpO2 97% on room air." },
      { label: "dbp", value: "82", sourceUnit: "mm Hg", sourceSpan: "0715 vital signs: T 37.2 °C, HR 78/min, BP 134/82 mm Hg, RR 14/min, SpO2 97% on room air." },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "0715 vital signs: T 37.2 °C, HR 78/min, BP 134/82 mm Hg, RR 14/min, SpO2 97% on room air." },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "0715 vital signs: T 37.2 °C, HR 78/min, BP 134/82 mm Hg, RR 14/min, SpO2 97% on room air." },
      { label: "hemoglobin", value: "11.4", sourceUnit: "g/dL", sourceSpan: "0600 labs: Hgb 11.4 g/dL, creatinine 1.3 mg/dL, eGFR 52 mL/min, glucose 168 mg/dL." },
      { label: "creatinine", value: "1.3", sourceUnit: "mg/dL", sourceSpan: "0600 labs: Hgb 11.4 g/dL, creatinine 1.3 mg/dL, eGFR 52 mL/min, glucose 168 mg/dL." },
      { label: "glucose", value: "168", sourceUnit: "mg/dL", sourceSpan: "0600 labs: Hgb 11.4 g/dL, creatinine 1.3 mg/dL, eGFR 52 mL/min, glucose 168 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_lateral_incivility_01/baseline_assessment_labs",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "C", sourceSpan: "1930 assessment: T 36.8 C, HR 78 regular, BP 152/88 left arm sitting, RR 16, SpO2 96% room air." },
      { label: "hr", value: "78", sourceUnit: "bpm", sourceSpan: "1930 assessment: T 36.8 C, HR 78 regular, BP 152/88 left arm sitting, RR 16, SpO2 96% room air." },
      { label: "sbp", value: "152", sourceUnit: "mmHg", sourceSpan: "1930 assessment: T 36.8 C, HR 78 regular, BP 152/88 left arm sitting, RR 16, SpO2 96% room air." },
      { label: "dbp", value: "88", sourceUnit: "mmHg", sourceSpan: "1930 assessment: T 36.8 C, HR 78 regular, BP 152/88 left arm sitting, RR 16, SpO2 96% room air." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "1930 assessment: T 36.8 C, HR 78 regular, BP 152/88 left arm sitting, RR 16, SpO2 96% room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "1930 assessment: T 36.8 C, HR 78 regular, BP 152/88 left arm sitting, RR 16, SpO2 96% room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_lateral_incivility_01/baseline_client_record",
    lane: "extract",
    panel: [],
    excludedValues: [
      { label: "sbp", value: "218", reason: "prior", sourceSpan: "Admitted 2 days ago for hypertensive urgency; arrival BP 218/114." },
      { label: "dbp", value: "114", reason: "prior", sourceSpan: "Admitted 2 days ago for hypertensive urgency; arrival BP 218/114." },
      { label: "creatinine", value: "1.5", reason: "prior", sourceSpan: "History: CKD stage 3b, baseline creatinine 1.5 mg/dL/eGFR 37 mL/min; HFpEF; type 2 diabetes." },
      { label: "sbp", value: "168-174", reason: "trend", sourceSpan: "Orders updated at 1400: amlodipine 10 mg PO daily, increased from 5 mg after BP trend 168-174/92-96; lisinopril 20 mg PO daily; metformin 500 mg PO twice daily held per pharmacy renal-dose flag pending repeat labs; sliding-scale insulin per protocol." },
      { label: "dbp", value: "92-96", reason: "trend", sourceSpan: "Orders updated at 1400: amlodipine 10 mg PO daily, increased from 5 mg after BP trend 168-174/92-96; lisinopril 20 mg PO daily; metformin 500 mg PO twice daily held per pharmacy renal-dose flag pending repeat labs; sliding-scale insulin per protocol." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_major_burn_inhalation_fluid_creep_01/baseline_labs",
    lane: "extract",
    panel: [
      { label: "wbc", value: "14,200", sourceUnit: "/uL", sourceSpan: "CBC: WBC 14,200/uL, hemoglobin 16.8 g/dL, hematocrit 52%, platelets 210,000/uL." },
      { label: "hemoglobin", value: "16.8", sourceUnit: "g/dL", sourceSpan: "CBC: WBC 14,200/uL, hemoglobin 16.8 g/dL, hematocrit 52%, platelets 210,000/uL." },
      { label: "hematocrit", value: "52", sourceUnit: "%", sourceSpan: "CBC: WBC 14,200/uL, hemoglobin 16.8 g/dL, hematocrit 52%, platelets 210,000/uL." },
      { label: "platelets", value: "210,000", sourceUnit: "/uL", sourceSpan: "CBC: WBC 14,200/uL, hemoglobin 16.8 g/dL, hematocrit 52%, platelets 210,000/uL." },
      { label: "sodium", value: "139", sourceUnit: "mEq/L", sourceSpan: "BMP: sodium 139 mEq/L, potassium 5.1 mEq/L, chloride 102 mEq/L, bicarbonate 20 mEq/L, BUN 18 mg/dL, creatinine 1.0 mg/dL, glucose 168 mg/dL." },
      { label: "potassium", value: "5.1", sourceUnit: "mEq/L", sourceSpan: "BMP: sodium 139 mEq/L, potassium 5.1 mEq/L, chloride 102 mEq/L, bicarbonate 20 mEq/L, BUN 18 mg/dL, creatinine 1.0 mg/dL, glucose 168 mg/dL." },
      { label: "chloride", value: "102", sourceUnit: "mEq/L", sourceSpan: "BMP: sodium 139 mEq/L, potassium 5.1 mEq/L, chloride 102 mEq/L, bicarbonate 20 mEq/L, BUN 18 mg/dL, creatinine 1.0 mg/dL, glucose 168 mg/dL." },
      { label: "bicarbonate", value: "20", sourceUnit: "mEq/L", sourceSpan: "BMP: sodium 139 mEq/L, potassium 5.1 mEq/L, chloride 102 mEq/L, bicarbonate 20 mEq/L, BUN 18 mg/dL, creatinine 1.0 mg/dL, glucose 168 mg/dL." },
      { label: "bun", value: "18", sourceUnit: "mg/dL", sourceSpan: "BMP: sodium 139 mEq/L, potassium 5.1 mEq/L, chloride 102 mEq/L, bicarbonate 20 mEq/L, BUN 18 mg/dL, creatinine 1.0 mg/dL, glucose 168 mg/dL." },
      { label: "creatinine", value: "1.0", sourceUnit: "mg/dL", sourceSpan: "BMP: sodium 139 mEq/L, potassium 5.1 mEq/L, chloride 102 mEq/L, bicarbonate 20 mEq/L, BUN 18 mg/dL, creatinine 1.0 mg/dL, glucose 168 mg/dL." },
      { label: "glucose", value: "168", sourceUnit: "mg/dL", sourceSpan: "BMP: sodium 139 mEq/L, potassium 5.1 mEq/L, chloride 102 mEq/L, bicarbonate 20 mEq/L, BUN 18 mg/dL, creatinine 1.0 mg/dL, glucose 168 mg/dL." },
      { label: "ph", value: "7.32", sourceUnit: "(unitless)", sourceSpan: "ABG on room air: pH 7.32, PaCO2 32 mmHg, PaO2 68 mmHg, HCO3 20 mEq/L, lactate 4.2 mmol/L." },
      { label: "paco2", value: "32", sourceUnit: "mmHg", sourceSpan: "ABG on room air: pH 7.32, PaCO2 32 mmHg, PaO2 68 mmHg, HCO3 20 mEq/L, lactate 4.2 mmol/L." },
      { label: "pao2", value: "68", sourceUnit: "mmHg", sourceSpan: "ABG on room air: pH 7.32, PaCO2 32 mmHg, PaO2 68 mmHg, HCO3 20 mEq/L, lactate 4.2 mmol/L." },
      { label: "hco3_abg", value: "20", sourceUnit: "mEq/L", sourceSpan: "ABG on room air: pH 7.32, PaCO2 32 mmHg, PaO2 68 mmHg, HCO3 20 mEq/L, lactate 4.2 mmol/L." },
      { label: "lactate", value: "4.2", sourceUnit: "mmol/L", sourceSpan: "ABG on room air: pH 7.32, PaCO2 32 mmHg, PaO2 68 mmHg, HCO3 20 mEq/L, lactate 4.2 mmol/L." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_mass_casualty_start_triage_01/triage_point_findings",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_neutropenic_fever_nadir_01/initial_assessment_labs",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.9", sourceUnit: "°C", sourceSpan: "Vitals: T 38.9 °C oral, HR 104, BP 108/68, RR 20, SpO₂ 96% room air." },
      { label: "hr", value: "104", sourceUnit: "bpm", sourceSpan: "Vitals: T 38.9 °C oral, HR 104, BP 108/68, RR 20, SpO₂ 96% room air." },
      { label: "sbp", value: "108", sourceUnit: "mmHg", sourceSpan: "Vitals: T 38.9 °C oral, HR 104, BP 108/68, RR 20, SpO₂ 96% room air." },
      { label: "dbp", value: "68", sourceUnit: "mmHg", sourceSpan: "Vitals: T 38.9 °C oral, HR 104, BP 108/68, RR 20, SpO₂ 96% room air." },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "Vitals: T 38.9 °C oral, HR 104, BP 108/68, RR 20, SpO₂ 96% room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Vitals: T 38.9 °C oral, HR 104, BP 108/68, RR 20, SpO₂ 96% room air." },
      { label: "wbc", value: "0.6", sourceUnit: "× 10³/µL", sourceSpan: "1420 CBC: WBC 0.6 × 10³/µL, ANC 180/µL, Hgb 9.8 g/dL, platelets 112,000/µL." },
      { label: "hemoglobin", value: "9.8", sourceUnit: "g/dL", sourceSpan: "1420 CBC: WBC 0.6 × 10³/µL, ANC 180/µL, Hgb 9.8 g/dL, platelets 112,000/µL." },
      { label: "platelets", value: "112,000", sourceUnit: "/µL", sourceSpan: "1420 CBC: WBC 0.6 × 10³/µL, ANC 180/µL, Hgb 9.8 g/dL, platelets 112,000/µL." },
      { label: "lactate", value: "1.4", sourceUnit: "mmol/L", sourceSpan: "Lactate 1.4 mmol/L." }
    ],
    excludedValues: [],
    unitAliases: [{ aliasOf: "wbc", value: "0.6 × 10³/µL" }]
  },
  {
    exhibitRef: "gpt_case_neutropenic_fever_nadir_01/stage_2_course",
    lane: "extract",
    panel: [
      { label: "temp", value: "39.4", sourceUnit: "°C", sourceSpan: "1745 vitals: T 39.4 °C, HR 118, BP 92/58, RR 24, SpO₂ 94% room air." },
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "1745 vitals: T 39.4 °C, HR 118, BP 92/58, RR 24, SpO₂ 94% room air." },
      { label: "sbp", value: "92", sourceUnit: "mmHg", sourceSpan: "1745 vitals: T 39.4 °C, HR 118, BP 92/58, RR 24, SpO₂ 94% room air." },
      { label: "dbp", value: "58", sourceUnit: "mmHg", sourceSpan: "1745 vitals: T 39.4 °C, HR 118, BP 92/58, RR 24, SpO₂ 94% room air." },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "1745 vitals: T 39.4 °C, HR 118, BP 92/58, RR 24, SpO₂ 94% room air." },
      { label: "spo2", value: "94", sourceUnit: "%", sourceSpan: "1745 vitals: T 39.4 °C, HR 118, BP 92/58, RR 24, SpO₂ 94% room air." },
      { label: "lactate", value: "3.2", sourceUnit: "mmol/L", sourceSpan: "1800 lactate: 3.2 mmol/L, up from 1.4." }
    ],
    excludedValues: [
      { label: "lactate", value: "1.4", reason: "prior", sourceSpan: "1800 lactate: 3.2 mmol/L, up from 1.4." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_nine_month_well_child_safety_01/baseline_record",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.1", sourceUnit: "C", sourceSpan: "Temperature 37.1 C tympanic, HR 128/min, RR 30/min, SpO2 99% on room air." },
      { label: "hr", value: "128", sourceUnit: "bpm", sourceSpan: "Temperature 37.1 C tympanic, HR 128/min, RR 30/min, SpO2 99% on room air." },
      { label: "rr", value: "30", sourceUnit: "/min", sourceSpan: "Temperature 37.1 C tympanic, HR 128/min, RR 30/min, SpO2 99% on room air." },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "Temperature 37.1 C tympanic, HR 128/min, RR 30/min, SpO2 99% on room air." },
      { label: "hemoglobin", value: "10.8", sourceUnit: "g/dL", sourceSpan: "Hemoglobin 10.8 g/dL; hematocrit 33%; lead level 2 mcg/dL." },
      { label: "hematocrit", value: "33", sourceUnit: "%", sourceSpan: "Hemoglobin 10.8 g/dL; hematocrit 33%; lead level 2 mcg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_nurse_provider_conflict_01/stage_1_order_conflict",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_nurse_provider_conflict_01/stage_2_escalation",
    lane: "extract",
    panel: [
      { label: "hr", value: "80", sourceUnit: "bpm", sourceSpan: "Vital signs: HR 80, BP 130/76, RR 16, SpO2 97%." },
      { label: "sbp", value: "130", sourceUnit: "mmHg", sourceSpan: "Vital signs: HR 80, BP 130/76, RR 16, SpO2 97%." },
      { label: "dbp", value: "76", sourceUnit: "mmHg", sourceSpan: "Vital signs: HR 80, BP 130/76, RR 16, SpO2 97%." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Vital signs: HR 80, BP 130/76, RR 16, SpO2 97%." },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Vital signs: HR 80, BP 130/76, RR 16, SpO2 97%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_opioid_recovery_relapse_risk_01/baseline_assessment_labs",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "°C", sourceSpan: "Vital signs: T 36.8 °C, HR 102, BP 148/92, RR 18, SpO2 99% on room air." },
      { label: "hr", value: "102", sourceUnit: "bpm", sourceSpan: "Vital signs: T 36.8 °C, HR 102, BP 148/92, RR 18, SpO2 99% on room air." },
      { label: "sbp", value: "148", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.8 °C, HR 102, BP 148/92, RR 18, SpO2 99% on room air." },
      { label: "dbp", value: "92", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.8 °C, HR 102, BP 148/92, RR 18, SpO2 99% on room air." },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Vital signs: T 36.8 °C, HR 102, BP 148/92, RR 18, SpO2 99% on room air." },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "Vital signs: T 36.8 °C, HR 102, BP 148/92, RR 18, SpO2 99% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_opus23_nat_toddler_01/initial_assessment_labs",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.2", sourceUnit: "°C", sourceSpan: "T 37.2 °C, HR 152, BP 96/58, RR 28, SpO2 99% on room air." },
      { label: "hr", value: "152", sourceUnit: "bpm", sourceSpan: "T 37.2 °C, HR 152, BP 96/58, RR 28, SpO2 99% on room air." },
      { label: "sbp", value: "96", sourceUnit: "mmHg", sourceSpan: "T 37.2 °C, HR 152, BP 96/58, RR 28, SpO2 99% on room air." },
      { label: "dbp", value: "58", sourceUnit: "mmHg", sourceSpan: "T 37.2 °C, HR 152, BP 96/58, RR 28, SpO2 99% on room air." },
      { label: "rr", value: "28", sourceUnit: "/min", sourceSpan: "T 37.2 °C, HR 152, BP 96/58, RR 28, SpO2 99% on room air." },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "T 37.2 °C, HR 152, BP 96/58, RR 28, SpO2 99% on room air." },
      { label: "wbc", value: "9,800", sourceUnit: "/µL", sourceSpan: "Labs: WBC 9,800/µL, Hgb 11.4 g/dL, platelets 312,000/µL." },
      { label: "hemoglobin", value: "11.4", sourceUnit: "g/dL", sourceSpan: "Labs: WBC 9,800/µL, Hgb 11.4 g/dL, platelets 312,000/µL." },
      { label: "platelets", value: "312,000", sourceUnit: "/µL", sourceSpan: "Labs: WBC 9,800/µL, Hgb 11.4 g/dL, platelets 312,000/µL." },
      { label: "sodium", value: "139", sourceUnit: "mEq/L", sourceSpan: "Sodium 139 mEq/L, potassium 4.3 mEq/L, creatinine 0.3 mg/dL, glucose 94 mg/dL, calcium 9.8 mg/dL." },
      { label: "potassium", value: "4.3", sourceUnit: "mEq/L", sourceSpan: "Sodium 139 mEq/L, potassium 4.3 mEq/L, creatinine 0.3 mg/dL, glucose 94 mg/dL, calcium 9.8 mg/dL." },
      { label: "creatinine", value: "0.3", sourceUnit: "mg/dL", sourceSpan: "Sodium 139 mEq/L, potassium 4.3 mEq/L, creatinine 0.3 mg/dL, glucose 94 mg/dL, calcium 9.8 mg/dL." },
      { label: "glucose", value: "94", sourceUnit: "mg/dL", sourceSpan: "Sodium 139 mEq/L, potassium 4.3 mEq/L, creatinine 0.3 mg/dL, glucose 94 mg/dL, calcium 9.8 mg/dL." },
      { label: "calcium", value: "9.8", sourceUnit: "mg/dL", sourceSpan: "Sodium 139 mEq/L, potassium 4.3 mEq/L, creatinine 0.3 mg/dL, glucose 94 mg/dL, calcium 9.8 mg/dL." },
      { label: "inr", value: "1.0", sourceUnit: "(ratio)", sourceSpan: "PT 12.8 seconds, INR 1.0, PTT 28 seconds." },
      { label: "ptt", value: "28", sourceUnit: "seconds", sourceSpan: "PT 12.8 seconds, INR 1.0, PTT 28 seconds." },
      { label: "ast", value: "34", sourceUnit: "U/L", sourceSpan: "AST 34 U/L, ALT 28 U/L, lipase 42 U/L." },
      { label: "alt", value: "28", sourceUnit: "U/L", sourceSpan: "AST 34 U/L, ALT 28 U/L, lipase 42 U/L." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_overdue_preventive_screening_01/baseline_assessment",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "°C", sourceSpan: "Vital signs: T 36.8 °C oral, HR 76 regular, BP 124/78, RR 14, SpO2 99% on room air." },
      { label: "hr", value: "76", sourceUnit: "bpm", sourceSpan: "Vital signs: T 36.8 °C oral, HR 76 regular, BP 124/78, RR 14, SpO2 99% on room air." },
      { label: "sbp", value: "124", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.8 °C oral, HR 76 regular, BP 124/78, RR 14, SpO2 99% on room air." },
      { label: "dbp", value: "78", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.8 °C oral, HR 76 regular, BP 124/78, RR 14, SpO2 99% on room air." },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "Vital signs: T 36.8 °C oral, HR 76 regular, BP 124/78, RR 14, SpO2 99% on room air." },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "Vital signs: T 36.8 °C oral, HR 76 regular, BP 124/78, RR 14, SpO2 99% on room air." },
      { label: "glucose", value: "118", sourceUnit: "mg/dL", sourceSpan: "Labs/screening today: non-fasting fingerstick glucose 118 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_overdue_preventive_screening_01/stage_3_followup",
    lane: "extract",
    panel: [
      { label: "glucose", value: "104", sourceUnit: "mg/dL", sourceSpan: "Fasting labs: glucose 104 mg/dL, total cholesterol 212 mg/dL, LDL 134 mg/dL, HDL 52 mg/dL, triglycerides 130 mg/dL." },
      { label: "temp", value: "36.7", sourceUnit: "°C", sourceSpan: "Vital signs: T 36.7 °C, HR 72, BP 122/76, RR 14, SpO2 99% on room air." },
      { label: "hr", value: "72", sourceUnit: "bpm", sourceSpan: "Vital signs: T 36.7 °C, HR 72, BP 122/76, RR 14, SpO2 99% on room air." },
      { label: "sbp", value: "122", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.7 °C, HR 72, BP 122/76, RR 14, SpO2 99% on room air." },
      { label: "dbp", value: "76", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.7 °C, HR 72, BP 122/76, RR 14, SpO2 99% on room air." },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "Vital signs: T 36.7 °C, HR 72, BP 122/76, RR 14, SpO2 99% on room air." },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "Vital signs: T 36.7 °C, HR 72, BP 122/76, RR 14, SpO2 99% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_pressure_injury_prevention_mobility_01/baseline_assessment_labs",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "°C", sourceSpan: "T 36.8 °C, HR 82, BP 138/78, RR 14, SpO2 95% on 2 L nasal cannula." },
      { label: "hr", value: "82", sourceUnit: "bpm", sourceSpan: "T 36.8 °C, HR 82, BP 138/78, RR 14, SpO2 95% on 2 L nasal cannula." },
      { label: "sbp", value: "138", sourceUnit: "mmHg", sourceSpan: "T 36.8 °C, HR 82, BP 138/78, RR 14, SpO2 95% on 2 L nasal cannula." },
      { label: "dbp", value: "78", sourceUnit: "mmHg", sourceSpan: "T 36.8 °C, HR 82, BP 138/78, RR 14, SpO2 95% on 2 L nasal cannula." },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "T 36.8 °C, HR 82, BP 138/78, RR 14, SpO2 95% on 2 L nasal cannula." },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "T 36.8 °C, HR 82, BP 138/78, RR 14, SpO2 95% on 2 L nasal cannula." },
      { label: "hemoglobin", value: "10.4", sourceUnit: "g/dL", sourceSpan: "Labs: Hgb 10.4 g/dL, WBC 9,200/µL, platelets 198,000/µL, Na 141, K 3.9, BUN 24, creatinine 0.9, glucose 128, albumin 2.8, prealbumin 14, INR 1.0." },
      { label: "wbc", value: "9,200", sourceUnit: "/µL", sourceSpan: "Labs: Hgb 10.4 g/dL, WBC 9,200/µL, platelets 198,000/µL, Na 141, K 3.9, BUN 24, creatinine 0.9, glucose 128, albumin 2.8, prealbumin 14, INR 1.0." },
      { label: "platelets", value: "198,000", sourceUnit: "/µL", sourceSpan: "Labs: Hgb 10.4 g/dL, WBC 9,200/µL, platelets 198,000/µL, Na 141, K 3.9, BUN 24, creatinine 0.9, glucose 128, albumin 2.8, prealbumin 14, INR 1.0." },
      { label: "inr", value: "1.0", sourceUnit: "(ratio)", sourceSpan: "Labs: Hgb 10.4 g/dL, WBC 9,200/µL, platelets 198,000/µL, Na 141, K 3.9, BUN 24, creatinine 0.9, glucose 128, albumin 2.8, prealbumin 14, INR 1.0." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_pressure_injury_prevention_mobility_01/stage_3_update",
    lane: "skip_serial"
  },
  {
    exhibitRef: "gpt_case_refeeding_syndrome_tpn_01/baseline_record",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "C", sourceSpan: "Vital signs: T 36.8 C, HR 92, BP 108/64, RR 16, SpO2 97% on room air." },
      { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: "Vital signs: T 36.8 C, HR 92, BP 108/64, RR 16, SpO2 97% on room air." },
      { label: "sbp", value: "108", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.8 C, HR 92, BP 108/64, RR 16, SpO2 97% on room air." },
      { label: "dbp", value: "64", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.8 C, HR 92, BP 108/64, RR 16, SpO2 97% on room air." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Vital signs: T 36.8 C, HR 92, BP 108/64, RR 16, SpO2 97% on room air." },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Vital signs: T 36.8 C, HR 92, BP 108/64, RR 16, SpO2 97% on room air." },
      { label: "glucose", value: "142", sourceUnit: "mg/dL", sourceSpan: "Point-of-care glucose 142 mg/dL." }
    ],
    excludedValues: [
      { label: "sodium", value: "138", reason: "prior", sourceSpan: "PACU labs 6 hours earlier: Na 138, K 3.5, Cl 102, bicarbonate 24, BUN 18, creatinine 0.8, glucose 156, calcium 8.4, phosphorus 2.8, magnesium 1.8, albumin 2.1, prealbumin 8, WBC 9,200, Hgb 11.0, platelets 210,000." },
      { label: "potassium", value: "3.5", reason: "prior", sourceSpan: "PACU labs 6 hours earlier: Na 138, K 3.5, Cl 102, bicarbonate 24, BUN 18, creatinine 0.8, glucose 156, calcium 8.4, phosphorus 2.8, magnesium 1.8, albumin 2.1, prealbumin 8, WBC 9,200, Hgb 11.0, platelets 210,000." },
      { label: "chloride", value: "102", reason: "prior", sourceSpan: "PACU labs 6 hours earlier: Na 138, K 3.5, Cl 102, bicarbonate 24, BUN 18, creatinine 0.8, glucose 156, calcium 8.4, phosphorus 2.8, magnesium 1.8, albumin 2.1, prealbumin 8, WBC 9,200, Hgb 11.0, platelets 210,000." },
      { label: "bicarbonate", value: "24", reason: "prior", sourceSpan: "PACU labs 6 hours earlier: Na 138, K 3.5, Cl 102, bicarbonate 24, BUN 18, creatinine 0.8, glucose 156, calcium 8.4, phosphorus 2.8, magnesium 1.8, albumin 2.1, prealbumin 8, WBC 9,200, Hgb 11.0, platelets 210,000." },
      { label: "bun", value: "18", reason: "prior", sourceSpan: "PACU labs 6 hours earlier: Na 138, K 3.5, Cl 102, bicarbonate 24, BUN 18, creatinine 0.8, glucose 156, calcium 8.4, phosphorus 2.8, magnesium 1.8, albumin 2.1, prealbumin 8, WBC 9,200, Hgb 11.0, platelets 210,000." },
      { label: "creatinine", value: "0.8", reason: "prior", sourceSpan: "PACU labs 6 hours earlier: Na 138, K 3.5, Cl 102, bicarbonate 24, BUN 18, creatinine 0.8, glucose 156, calcium 8.4, phosphorus 2.8, magnesium 1.8, albumin 2.1, prealbumin 8, WBC 9,200, Hgb 11.0, platelets 210,000." },
      { label: "glucose", value: "156", reason: "prior", sourceSpan: "PACU labs 6 hours earlier: Na 138, K 3.5, Cl 102, bicarbonate 24, BUN 18, creatinine 0.8, glucose 156, calcium 8.4, phosphorus 2.8, magnesium 1.8, albumin 2.1, prealbumin 8, WBC 9,200, Hgb 11.0, platelets 210,000." },
      { label: "calcium", value: "8.4", reason: "prior", sourceSpan: "PACU labs 6 hours earlier: Na 138, K 3.5, Cl 102, bicarbonate 24, BUN 18, creatinine 0.8, glucose 156, calcium 8.4, phosphorus 2.8, magnesium 1.8, albumin 2.1, prealbumin 8, WBC 9,200, Hgb 11.0, platelets 210,000." },
      { label: "phosphate", value: "2.8", reason: "prior", sourceSpan: "PACU labs 6 hours earlier: Na 138, K 3.5, Cl 102, bicarbonate 24, BUN 18, creatinine 0.8, glucose 156, calcium 8.4, phosphorus 2.8, magnesium 1.8, albumin 2.1, prealbumin 8, WBC 9,200, Hgb 11.0, platelets 210,000." },
      { label: "magnesium", value: "1.8", reason: "prior", sourceSpan: "PACU labs 6 hours earlier: Na 138, K 3.5, Cl 102, bicarbonate 24, BUN 18, creatinine 0.8, glucose 156, calcium 8.4, phosphorus 2.8, magnesium 1.8, albumin 2.1, prealbumin 8, WBC 9,200, Hgb 11.0, platelets 210,000." },
      { label: "wbc", value: "9,200", reason: "prior", sourceSpan: "PACU labs 6 hours earlier: Na 138, K 3.5, Cl 102, bicarbonate 24, BUN 18, creatinine 0.8, glucose 156, calcium 8.4, phosphorus 2.8, magnesium 1.8, albumin 2.1, prealbumin 8, WBC 9,200, Hgb 11.0, platelets 210,000." },
      { label: "hemoglobin", value: "11.0", reason: "prior", sourceSpan: "PACU labs 6 hours earlier: Na 138, K 3.5, Cl 102, bicarbonate 24, BUN 18, creatinine 0.8, glucose 156, calcium 8.4, phosphorus 2.8, magnesium 1.8, albumin 2.1, prealbumin 8, WBC 9,200, Hgb 11.0, platelets 210,000." },
      { label: "platelets", value: "210,000", reason: "prior", sourceSpan: "PACU labs 6 hours earlier: Na 138, K 3.5, Cl 102, bicarbonate 24, BUN 18, creatinine 0.8, glucose 156, calcium 8.4, phosphorus 2.8, magnesium 1.8, albumin 2.1, prealbumin 8, WBC 9,200, Hgb 11.0, platelets 210,000." },
      { label: "ast", value: "28", reason: "prior", sourceSpan: "AST 28, ALT 22, total bilirubin 0.6." },
      { label: "alt", value: "22", reason: "prior", sourceSpan: "AST 28, ALT 22, total bilirubin 0.6." },
      { label: "total_bilirubin", value: "0.6", reason: "prior", sourceSpan: "AST 28, ALT 22, total bilirubin 0.6." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_refeeding_syndrome_tpn_01/stage_1_update",
    lane: "skip_serial"
  },
  {
    exhibitRef: "gpt_case_refeeding_syndrome_tpn_01/stage_2_update",
    lane: "extract",
    panel: [
      { label: "potassium", value: "2.9", sourceUnit: "mEq/L", sourceSpan: "Repeat labs now: potassium 2.9 mEq/L, phosphorus 1.3 mg/dL, magnesium 1.3 mg/dL, glucose 226 mg/dL, creatinine 0.9 mg/dL.", context: "post_intervention" },
      { label: "phosphate", value: "1.3", sourceUnit: "mg/dL", sourceSpan: "Repeat labs now: potassium 2.9 mEq/L, phosphorus 1.3 mg/dL, magnesium 1.3 mg/dL, glucose 226 mg/dL, creatinine 0.9 mg/dL.", context: "post_intervention" },
      { label: "magnesium", value: "1.3", sourceUnit: "mg/dL", sourceSpan: "Repeat labs now: potassium 2.9 mEq/L, phosphorus 1.3 mg/dL, magnesium 1.3 mg/dL, glucose 226 mg/dL, creatinine 0.9 mg/dL.", context: "post_intervention" },
      { label: "glucose", value: "226", sourceUnit: "mg/dL", sourceSpan: "Repeat labs now: potassium 2.9 mEq/L, phosphorus 1.3 mg/dL, magnesium 1.3 mg/dL, glucose 226 mg/dL, creatinine 0.9 mg/dL.", context: "post_intervention" },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "Repeat labs now: potassium 2.9 mEq/L, phosphorus 1.3 mg/dL, magnesium 1.3 mg/dL, glucose 226 mg/dL, creatinine 0.9 mg/dL.", context: "post_intervention" },
      { label: "temp", value: "38.2", sourceUnit: "C", sourceSpan: "Vital signs: T 38.2 C, HR 118, BP 98/58, RR 22, SpO2 95% on room air.", context: "post_intervention" },
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "Vital signs: T 38.2 C, HR 118, BP 98/58, RR 22, SpO2 95% on room air.", context: "post_intervention" },
      { label: "sbp", value: "98", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 38.2 C, HR 118, BP 98/58, RR 22, SpO2 95% on room air.", context: "post_intervention" },
      { label: "dbp", value: "58", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 38.2 C, HR 118, BP 98/58, RR 22, SpO2 95% on room air.", context: "post_intervention" },
      { label: "rr", value: "22", sourceUnit: "/min", sourceSpan: "Vital signs: T 38.2 C, HR 118, BP 98/58, RR 22, SpO2 95% on room air.", context: "post_intervention" },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "Vital signs: T 38.2 C, HR 118, BP 98/58, RR 22, SpO2 95% on room air.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_refeeding_syndrome_tpn_01/stage_3_update",
    lane: "extract",
    panel: [
      { label: "potassium", value: "3.4", sourceUnit: "mEq/L", sourceSpan: "After interventions, repeat labs: potassium 3.4 mEq/L, phosphorus 1.9 mg/dL, magnesium 1.6 mg/dL, glucose 168 mg/dL, creatinine 0.9 mg/dL.", context: "post_intervention" },
      { label: "phosphate", value: "1.9", sourceUnit: "mg/dL", sourceSpan: "After interventions, repeat labs: potassium 3.4 mEq/L, phosphorus 1.9 mg/dL, magnesium 1.6 mg/dL, glucose 168 mg/dL, creatinine 0.9 mg/dL.", context: "post_intervention" },
      { label: "magnesium", value: "1.6", sourceUnit: "mg/dL", sourceSpan: "After interventions, repeat labs: potassium 3.4 mEq/L, phosphorus 1.9 mg/dL, magnesium 1.6 mg/dL, glucose 168 mg/dL, creatinine 0.9 mg/dL.", context: "post_intervention" },
      { label: "glucose", value: "168", sourceUnit: "mg/dL", sourceSpan: "After interventions, repeat labs: potassium 3.4 mEq/L, phosphorus 1.9 mg/dL, magnesium 1.6 mg/dL, glucose 168 mg/dL, creatinine 0.9 mg/dL.", context: "post_intervention" },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "After interventions, repeat labs: potassium 3.4 mEq/L, phosphorus 1.9 mg/dL, magnesium 1.6 mg/dL, glucose 168 mg/dL, creatinine 0.9 mg/dL.", context: "post_intervention" },
      { label: "temp", value: "37.6", sourceUnit: "C", sourceSpan: "Vital signs: T 37.6 C, HR 96, BP 110/66, RR 18, SpO2 97% on room air.", context: "post_intervention" },
      { label: "hr", value: "96", sourceUnit: "bpm", sourceSpan: "Vital signs: T 37.6 C, HR 96, BP 110/66, RR 18, SpO2 97% on room air.", context: "post_intervention" },
      { label: "sbp", value: "110", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.6 C, HR 96, BP 110/66, RR 18, SpO2 97% on room air.", context: "post_intervention" },
      { label: "dbp", value: "66", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.6 C, HR 96, BP 110/66, RR 18, SpO2 97% on room air.", context: "post_intervention" },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Vital signs: T 37.6 C, HR 96, BP 110/66, RR 18, SpO2 97% on room air.", context: "post_intervention" },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Vital signs: T 37.6 C, HR 96, BP 110/66, RR 18, SpO2 97% on room air.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  }
];

const batch14Records: ExtractionRecord[] = [
  {
    exhibitRef: "gpt_case_major_burn_inhalation_fluid_creep_01/stage3_course",
    lane: "extract",
    panel: [
      { label: "hr", value: "100", sourceUnit: "bpm", sourceSpan: "At 1600, urine output is 55 mL/hr, HR 100/min, BP 112/72 mmHg, and the patient is hemodynamically improving." },
      { label: "sbp", value: "112", sourceUnit: "mmHg", sourceSpan: "At 1600, urine output is 55 mL/hr, HR 100/min, BP 112/72 mmHg, and the patient is hemodynamically improving." },
      { label: "dbp", value: "72", sourceUnit: "mmHg", sourceSpan: "At 1600, urine output is 55 mL/hr, HR 100/min, BP 112/72 mmHg, and the patient is hemodynamically improving." },
      { label: "sodium", value: "134", sourceUnit: "mEq/L", sourceSpan: "Labs: sodium 134 mEq/L, potassium 4.2 mEq/L, creatinine 0.9 mg/dL, hematocrit 38%, albumin 2.1 g/dL." },
      { label: "potassium", value: "4.2", sourceUnit: "mEq/L", sourceSpan: "Labs: sodium 134 mEq/L, potassium 4.2 mEq/L, creatinine 0.9 mg/dL, hematocrit 38%, albumin 2.1 g/dL." },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "Labs: sodium 134 mEq/L, potassium 4.2 mEq/L, creatinine 0.9 mg/dL, hematocrit 38%, albumin 2.1 g/dL." },
      { label: "hematocrit", value: "38", sourceUnit: "%", sourceSpan: "Labs: sodium 134 mEq/L, potassium 4.2 mEq/L, creatinine 0.9 mg/dL, hematocrit 38%, albumin 2.1 g/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_svc_syndrome_01/baseline_record",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.1", sourceUnit: "°C", sourceSpan: "Vital signs/labs: T 37.1 °C, HR 92/min, BP 138/82 mmHg, RR 20/min, SpO2 94% on 2 L nasal cannula." },
      { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: "Vital signs/labs: T 37.1 °C, HR 92/min, BP 138/82 mmHg, RR 20/min, SpO2 94% on 2 L nasal cannula." },
      { label: "sbp", value: "138", sourceUnit: "mmHg", sourceSpan: "Vital signs/labs: T 37.1 °C, HR 92/min, BP 138/82 mmHg, RR 20/min, SpO2 94% on 2 L nasal cannula." },
      { label: "dbp", value: "82", sourceUnit: "mmHg", sourceSpan: "Vital signs/labs: T 37.1 °C, HR 92/min, BP 138/82 mmHg, RR 20/min, SpO2 94% on 2 L nasal cannula." },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "Vital signs/labs: T 37.1 °C, HR 92/min, BP 138/82 mmHg, RR 20/min, SpO2 94% on 2 L nasal cannula." },
      { label: "spo2", value: "94", sourceUnit: "%", sourceSpan: "Vital signs/labs: T 37.1 °C, HR 92/min, BP 138/82 mmHg, RR 20/min, SpO2 94% on 2 L nasal cannula." },
      { label: "wbc", value: "11,200", sourceUnit: "/µL", sourceSpan: "WBC 11,200/µL, Hgb 13.8 g/dL, platelets 268,000/µL, Na 139 mEq/L, K 4.2 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, INR 1.0, PTT 28 seconds, D-dimer 0.8 µg/mL." },
      { label: "hemoglobin", value: "13.8", sourceUnit: "g/dL", sourceSpan: "WBC 11,200/µL, Hgb 13.8 g/dL, platelets 268,000/µL, Na 139 mEq/L, K 4.2 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, INR 1.0, PTT 28 seconds, D-dimer 0.8 µg/mL." },
      { label: "platelets", value: "268,000", sourceUnit: "/µL", sourceSpan: "WBC 11,200/µL, Hgb 13.8 g/dL, platelets 268,000/µL, Na 139 mEq/L, K 4.2 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, INR 1.0, PTT 28 seconds, D-dimer 0.8 µg/mL." },
      { label: "sodium", value: "139", sourceUnit: "mEq/L", sourceSpan: "WBC 11,200/µL, Hgb 13.8 g/dL, platelets 268,000/µL, Na 139 mEq/L, K 4.2 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, INR 1.0, PTT 28 seconds, D-dimer 0.8 µg/mL." },
      { label: "potassium", value: "4.2", sourceUnit: "mEq/L", sourceSpan: "WBC 11,200/µL, Hgb 13.8 g/dL, platelets 268,000/µL, Na 139 mEq/L, K 4.2 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, INR 1.0, PTT 28 seconds, D-dimer 0.8 µg/mL." },
      { label: "bun", value: "18", sourceUnit: "mg/dL", sourceSpan: "WBC 11,200/µL, Hgb 13.8 g/dL, platelets 268,000/µL, Na 139 mEq/L, K 4.2 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, INR 1.0, PTT 28 seconds, D-dimer 0.8 µg/mL." },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "WBC 11,200/µL, Hgb 13.8 g/dL, platelets 268,000/µL, Na 139 mEq/L, K 4.2 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, INR 1.0, PTT 28 seconds, D-dimer 0.8 µg/mL." },
      { label: "inr", value: "1.0", sourceUnit: "(ratio)", sourceSpan: "WBC 11,200/µL, Hgb 13.8 g/dL, platelets 268,000/µL, Na 139 mEq/L, K 4.2 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, INR 1.0, PTT 28 seconds, D-dimer 0.8 µg/mL." },
      { label: "ptt", value: "28", sourceUnit: "seconds", sourceSpan: "WBC 11,200/µL, Hgb 13.8 g/dL, platelets 268,000/µL, Na 139 mEq/L, K 4.2 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, INR 1.0, PTT 28 seconds, D-dimer 0.8 µg/mL." },
      { label: "ph", value: "7.42", sourceUnit: "(unitless)", sourceSpan: "ABG on 2 L nasal cannula: pH 7.42, PaCO2 36 mmHg, PaO2 72 mmHg, HCO3 23 mEq/L, SaO2 94%." },
      { label: "paco2", value: "36", sourceUnit: "mmHg", sourceSpan: "ABG on 2 L nasal cannula: pH 7.42, PaCO2 36 mmHg, PaO2 72 mmHg, HCO3 23 mEq/L, SaO2 94%." },
      { label: "pao2", value: "72", sourceUnit: "mmHg", sourceSpan: "ABG on 2 L nasal cannula: pH 7.42, PaCO2 36 mmHg, PaO2 72 mmHg, HCO3 23 mEq/L, SaO2 94%." },
      { label: "hco3_abg", value: "23", sourceUnit: "mEq/L", sourceSpan: "ABG on 2 L nasal cannula: pH 7.42, PaCO2 36 mmHg, PaO2 72 mmHg, HCO3 23 mEq/L, SaO2 94%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_svc_syndrome_01/stage_1_update",
    lane: "skip_serial"
  },
  {
    exhibitRef: "gpt_case_svc_syndrome_01/stage_2_update",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.3", sourceUnit: "°C", sourceSpan: "Vital signs: T 37.3 °C, HR 110/min, BP 134/86 mmHg, RR 28/min, SpO2 90% on 2 L nasal cannula." },
      { label: "hr", value: "110", sourceUnit: "bpm", sourceSpan: "Vital signs: T 37.3 °C, HR 110/min, BP 134/86 mmHg, RR 28/min, SpO2 90% on 2 L nasal cannula." },
      { label: "sbp", value: "134", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.3 °C, HR 110/min, BP 134/86 mmHg, RR 28/min, SpO2 90% on 2 L nasal cannula." },
      { label: "dbp", value: "86", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.3 °C, HR 110/min, BP 134/86 mmHg, RR 28/min, SpO2 90% on 2 L nasal cannula." },
      { label: "rr", value: "28", sourceUnit: "/min", sourceSpan: "Vital signs: T 37.3 °C, HR 110/min, BP 134/86 mmHg, RR 28/min, SpO2 90% on 2 L nasal cannula." },
      { label: "spo2", value: "90", sourceUnit: "%", sourceSpan: "Vital signs: T 37.3 °C, HR 110/min, BP 134/86 mmHg, RR 28/min, SpO2 90% on 2 L nasal cannula." },
      { label: "ph", value: "7.38", sourceUnit: "(unitless)", sourceSpan: "ABG on 2 L nasal cannula: pH 7.38, PaCO2 42 mmHg, PaO2 62 mmHg, HCO3 24 mEq/L, SaO2 90%." },
      { label: "paco2", value: "42", sourceUnit: "mmHg", sourceSpan: "ABG on 2 L nasal cannula: pH 7.38, PaCO2 42 mmHg, PaO2 62 mmHg, HCO3 24 mEq/L, SaO2 90%." },
      { label: "pao2", value: "62", sourceUnit: "mmHg", sourceSpan: "ABG on 2 L nasal cannula: pH 7.38, PaCO2 42 mmHg, PaO2 62 mmHg, HCO3 24 mEq/L, SaO2 90%." },
      { label: "hco3_abg", value: "24", sourceUnit: "mEq/L", sourceSpan: "ABG on 2 L nasal cannula: pH 7.38, PaCO2 42 mmHg, PaO2 62 mmHg, HCO3 24 mEq/L, SaO2 90%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_taco_vs_trali_01/baseline_assessment_labs",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "C", sourceSpan: "Vital signs: T 36.8 C, HR 92, BP 138/82, RR 16, SpO2 96% on room air." },
      { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: "Vital signs: T 36.8 C, HR 92, BP 138/82, RR 16, SpO2 96% on room air." },
      { label: "sbp", value: "138", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.8 C, HR 92, BP 138/82, RR 16, SpO2 96% on room air." },
      { label: "dbp", value: "82", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.8 C, HR 92, BP 138/82, RR 16, SpO2 96% on room air." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Vital signs: T 36.8 C, HR 92, BP 138/82, RR 16, SpO2 96% on room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Vital signs: T 36.8 C, HR 92, BP 138/82, RR 16, SpO2 96% on room air." },
      { label: "hemoglobin", value: "6.4", sourceUnit: "g/dL", sourceSpan: "Labs: Hgb 6.4 g/dL, Hct 19.2%, WBC 7,200/uL, platelets 188,000/uL." },
      { label: "hematocrit", value: "19.2", sourceUnit: "%", sourceSpan: "Labs: Hgb 6.4 g/dL, Hct 19.2%, WBC 7,200/uL, platelets 188,000/uL." },
      { label: "wbc", value: "7,200", sourceUnit: "/uL", sourceSpan: "Labs: Hgb 6.4 g/dL, Hct 19.2%, WBC 7,200/uL, platelets 188,000/uL." },
      { label: "platelets", value: "188,000", sourceUnit: "/uL", sourceSpan: "Labs: Hgb 6.4 g/dL, Hct 19.2%, WBC 7,200/uL, platelets 188,000/uL." },
      { label: "bun", value: "34", sourceUnit: "mg/dL", sourceSpan: "BUN 34 mg/dL, creatinine 1.4 mg/dL, eGFR 38 mL/min/1.73 m2." },
      { label: "creatinine", value: "1.4", sourceUnit: "mg/dL", sourceSpan: "BUN 34 mg/dL, creatinine 1.4 mg/dL, eGFR 38 mL/min/1.73 m2." },
      { label: "potassium", value: "4.6", sourceUnit: "mEq/L", sourceSpan: "K 4.6 mEq/L, Na 139 mEq/L, Cl 102 mEq/L, CO2 22 mEq/L." },
      { label: "sodium", value: "139", sourceUnit: "mEq/L", sourceSpan: "K 4.6 mEq/L, Na 139 mEq/L, Cl 102 mEq/L, CO2 22 mEq/L." },
      { label: "chloride", value: "102", sourceUnit: "mEq/L", sourceSpan: "K 4.6 mEq/L, Na 139 mEq/L, Cl 102 mEq/L, CO2 22 mEq/L." },
      { label: "bicarbonate", value: "22", sourceUnit: "mEq/L", sourceSpan: "K 4.6 mEq/L, Na 139 mEq/L, Cl 102 mEq/L, CO2 22 mEq/L." },
      { label: "bnp", value: "280", sourceUnit: "pg/mL", sourceSpan: "BNP 280 pg/mL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_taco_vs_trali_01/stage_1_update",
    lane: "skip_serial"
  },
  {
    exhibitRef: "gpt_case_taco_vs_trali_01/stage_4_resolution",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.9", sourceUnit: "C", sourceSpan: "Current vital signs: T 36.9 C, HR 84, BP 136/78, RR 18, SpO2 96% on 4 L nasal cannula after weaning from the non-rebreather.", context: "post_intervention" },
      { label: "hr", value: "84", sourceUnit: "bpm", sourceSpan: "Current vital signs: T 36.9 C, HR 84, BP 136/78, RR 18, SpO2 96% on 4 L nasal cannula after weaning from the non-rebreather.", context: "post_intervention" },
      { label: "sbp", value: "136", sourceUnit: "mmHg", sourceSpan: "Current vital signs: T 36.9 C, HR 84, BP 136/78, RR 18, SpO2 96% on 4 L nasal cannula after weaning from the non-rebreather.", context: "post_intervention" },
      { label: "dbp", value: "78", sourceUnit: "mmHg", sourceSpan: "Current vital signs: T 36.9 C, HR 84, BP 136/78, RR 18, SpO2 96% on 4 L nasal cannula after weaning from the non-rebreather.", context: "post_intervention" },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Current vital signs: T 36.9 C, HR 84, BP 136/78, RR 18, SpO2 96% on 4 L nasal cannula after weaning from the non-rebreather.", context: "post_intervention" },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Current vital signs: T 36.9 C, HR 84, BP 136/78, RR 18, SpO2 96% on 4 L nasal cannula after weaning from the non-rebreather.", context: "post_intervention" },
      { label: "bnp", value: "420", sourceUnit: "pg/mL", sourceSpan: "Repeat BNP: 420 pg/mL.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_unsafe_assignment_01/baseline_assessment",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_unsafe_assignment_01/baseline_assignment",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_unsafe_premature_discharge_01/baseline_assessment_labs",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "C", sourceSpan: "Vital signs: T 36.8 C, HR 92 regular, BP 108/68, RR 22, SpO2 93% on room air." },
      { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: "Vital signs: T 36.8 C, HR 92 regular, BP 108/68, RR 22, SpO2 93% on room air." },
      { label: "sbp", value: "108", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.8 C, HR 92 regular, BP 108/68, RR 22, SpO2 93% on room air." },
      { label: "dbp", value: "68", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.8 C, HR 92 regular, BP 108/68, RR 22, SpO2 93% on room air." },
      { label: "rr", value: "22", sourceUnit: "/min", sourceSpan: "Vital signs: T 36.8 C, HR 92 regular, BP 108/68, RR 22, SpO2 93% on room air." },
      { label: "spo2", value: "93", sourceUnit: "%", sourceSpan: "Vital signs: T 36.8 C, HR 92 regular, BP 108/68, RR 22, SpO2 93% on room air." },
      { label: "creatinine", value: "1.8", sourceUnit: "mg/dL", sourceSpan: "Labs: Na 138, K 3.4, Cl 96, CO2 30, BUN 38, creatinine 1.8 mg/dL (baseline outpatient 1.4; admission 1.6), glucose 142, BNP 680 pg/mL (admission 2,400; yesterday 820), Hgb 11.4, WBC 7.2, platelets 210, Mg 1.7, INR 1.0, albumin 3.0." },
      { label: "bnp", value: "680", sourceUnit: "pg/mL", sourceSpan: "Labs: Na 138, K 3.4, Cl 96, CO2 30, BUN 38, creatinine 1.8 mg/dL (baseline outpatient 1.4; admission 1.6), glucose 142, BNP 680 pg/mL (admission 2,400; yesterday 820), Hgb 11.4, WBC 7.2, platelets 210, Mg 1.7, INR 1.0, albumin 3.0." },
      { label: "inr", value: "1.0", sourceUnit: "(ratio)", sourceSpan: "Labs: Na 138, K 3.4, Cl 96, CO2 30, BUN 38, creatinine 1.8 mg/dL (baseline outpatient 1.4; admission 1.6), glucose 142, BNP 680 pg/mL (admission 2,400; yesterday 820), Hgb 11.4, WBC 7.2, platelets 210, Mg 1.7, INR 1.0, albumin 3.0." }
    ],
    excludedValues: [
      { label: "creatinine", value: "1.4", reason: "prior", sourceSpan: "Labs: Na 138, K 3.4, Cl 96, CO2 30, BUN 38, creatinine 1.8 mg/dL (baseline outpatient 1.4; admission 1.6), glucose 142, BNP 680 pg/mL (admission 2,400; yesterday 820), Hgb 11.4, WBC 7.2, platelets 210, Mg 1.7, INR 1.0, albumin 3.0." },
      { label: "creatinine", value: "1.6", reason: "prior", sourceSpan: "Labs: Na 138, K 3.4, Cl 96, CO2 30, BUN 38, creatinine 1.8 mg/dL (baseline outpatient 1.4; admission 1.6), glucose 142, BNP 680 pg/mL (admission 2,400; yesterday 820), Hgb 11.4, WBC 7.2, platelets 210, Mg 1.7, INR 1.0, albumin 3.0." },
      { label: "bnp", value: "2,400", reason: "prior", sourceSpan: "Labs: Na 138, K 3.4, Cl 96, CO2 30, BUN 38, creatinine 1.8 mg/dL (baseline outpatient 1.4; admission 1.6), glucose 142, BNP 680 pg/mL (admission 2,400; yesterday 820), Hgb 11.4, WBC 7.2, platelets 210, Mg 1.7, INR 1.0, albumin 3.0." },
      { label: "bnp", value: "820", reason: "prior", sourceSpan: "Labs: Na 138, K 3.4, Cl 96, CO2 30, BUN 38, creatinine 1.8 mg/dL (baseline outpatient 1.4; admission 1.6), glucose 142, BNP 680 pg/mL (admission 2,400; yesterday 820), Hgb 11.4, WBC 7.2, platelets 210, Mg 1.7, INR 1.0, albumin 3.0." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_unsafe_premature_discharge_01/stage_3_discharge_readiness",
    lane: "skip_serial"
  },
  {
    exhibitRef: "gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01/stage1_update",
    lane: "extract",
    panel: [
      { label: "hr", value: "112", sourceUnit: "bpm", sourceSpan: "After the bolus, HR 112, BP 92/58, and the patient vomits another 200 mL bright red blood.", context: "post_intervention" },
      { label: "sbp", value: "92", sourceUnit: "mmHg", sourceSpan: "After the bolus, HR 112, BP 92/58, and the patient vomits another 200 mL bright red blood.", context: "post_intervention" },
      { label: "dbp", value: "58", sourceUnit: "mmHg", sourceSpan: "After the bolus, HR 112, BP 92/58, and the patient vomits another 200 mL bright red blood.", context: "post_intervention" },
      { label: "hemoglobin", value: "7.2", sourceUnit: "g/dL", sourceSpan: "Point-of-care Hgb is 7.2 g/dL, lactate rises to 4.1 mmol/L, and urine output is 25 mL in the first hour.", context: "post_intervention" },
      { label: "lactate", value: "4.1", sourceUnit: "mmol/L", sourceSpan: "Point-of-care Hgb is 7.2 g/dL, lactate rises to 4.1 mmol/L, and urine output is 25 mL in the first hour.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01/stage2_update",
    lane: "extract",
    panel: [
      { label: "hr", value: "96", sourceUnit: "bpm", sourceSpan: "In the ICU, HR 96, BP 104/62, RR 16, SpO2 98% on 2 L.", context: "post_intervention" },
      { label: "sbp", value: "104", sourceUnit: "mmHg", sourceSpan: "In the ICU, HR 96, BP 104/62, RR 16, SpO2 98% on 2 L.", context: "post_intervention" },
      { label: "dbp", value: "62", sourceUnit: "mmHg", sourceSpan: "In the ICU, HR 96, BP 104/62, RR 16, SpO2 98% on 2 L.", context: "post_intervention" },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "In the ICU, HR 96, BP 104/62, RR 16, SpO2 98% on 2 L.", context: "post_intervention" },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "In the ICU, HR 96, BP 104/62, RR 16, SpO2 98% on 2 L.", context: "post_intervention" },
      { label: "hemoglobin", value: "7.8", sourceUnit: "g/dL", sourceSpan: "Post-transfusion Hgb is 7.8 g/dL, lactate 2.6 mmol/L, urine output 40 mL/hr.", context: "post_intervention" },
      { label: "lactate", value: "2.6", sourceUnit: "mmol/L", sourceSpan: "Post-transfusion Hgb is 7.8 g/dL, lactate 2.6 mmol/L, urine output 40 mL/hr.", context: "post_intervention" },
      { label: "creatinine", value: "1.5", sourceUnit: "mg/dL", sourceSpan: "Four-hour labs show creatinine 1.5 mg/dL, INR 2.0, platelets 68,000/µL, and ammonia 78 µmol/L.", context: "post_intervention" },
      { label: "inr", value: "2.0", sourceUnit: "(ratio)", sourceSpan: "Four-hour labs show creatinine 1.5 mg/dL, INR 2.0, platelets 68,000/µL, and ammonia 78 µmol/L.", context: "post_intervention" },
      { label: "platelets", value: "68,000", sourceUnit: "/µL", sourceSpan: "Four-hour labs show creatinine 1.5 mg/dL, INR 2.0, platelets 68,000/µL, and ammonia 78 µmol/L.", context: "post_intervention" },
      { label: "ammonia", value: "78", sourceUnit: "µmol/L", sourceSpan: "Four-hour labs show creatinine 1.5 mg/dL, INR 2.0, platelets 68,000/µL, and ammonia 78 µmol/L.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01/stage3_update",
    lane: "extract",
    panel: [
      { label: "hr", value: "82", sourceUnit: "bpm", sourceSpan: "Vitals: HR 82, BP 108/66, RR 14, SpO2 97% room air, T 37.9 C." },
      { label: "sbp", value: "108", sourceUnit: "mmHg", sourceSpan: "Vitals: HR 82, BP 108/66, RR 14, SpO2 97% room air, T 37.9 C." },
      { label: "dbp", value: "66", sourceUnit: "mmHg", sourceSpan: "Vitals: HR 82, BP 108/66, RR 14, SpO2 97% room air, T 37.9 C." },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "Vitals: HR 82, BP 108/66, RR 14, SpO2 97% room air, T 37.9 C." },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Vitals: HR 82, BP 108/66, RR 14, SpO2 97% room air, T 37.9 C." },
      { label: "temp", value: "37.9", sourceUnit: "C", sourceSpan: "Vitals: HR 82, BP 108/66, RR 14, SpO2 97% room air, T 37.9 C." },
      { label: "hemoglobin", value: "7.6", sourceUnit: "g/dL", sourceSpan: "Hgb 7.6 g/dL is stable with no further hematemesis." },
      { label: "creatinine", value: "1.8", sourceUnit: "mg/dL", sourceSpan: "Labs: creatinine 1.8 mg/dL, urine output 15 mL/hr, ammonia 124 µmol/L, lactate 1.8 mmol/L." },
      { label: "ammonia", value: "124", sourceUnit: "µmol/L", sourceSpan: "Labs: creatinine 1.8 mg/dL, urine output 15 mL/hr, ammonia 124 µmol/L, lactate 1.8 mmol/L." },
      { label: "lactate", value: "1.8", sourceUnit: "mmol/L", sourceSpan: "Labs: creatinine 1.8 mg/dL, urine output 15 mL/hr, ammonia 124 µmol/L, lactate 1.8 mmol/L." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_warfarin_mvr_2026_06_11_01/admission_record",
    lane: "extract",
    panel: [],
    excludedValues: [
      { label: "inr", value: "3.0", reason: "prior", sourceSpan: "Target INR for mechanical mitral valve: 2.5-3.5. INR was 3.0 at discharge and 3.2 at cardiology follow-up one day later." },
      { label: "inr", value: "3.2", reason: "prior", sourceSpan: "Target INR for mechanical mitral valve: 2.5-3.5. INR was 3.0 at discharge and 3.2 at cardiology follow-up one day later." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_warfarin_mvr_2026_06_11_01/initial_assessment_labs",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.9", sourceUnit: "C", sourceSpan: "Vital signs: T 36.9 C, HR 88 irregularly irregular, BP 106/64, RR 18, SpO2 95% on room air." },
      { label: "hr", value: "88", sourceUnit: "bpm", sourceSpan: "Vital signs: T 36.9 C, HR 88 irregularly irregular, BP 106/64, RR 18, SpO2 95% on room air." },
      { label: "sbp", value: "106", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.9 C, HR 88 irregularly irregular, BP 106/64, RR 18, SpO2 95% on room air." },
      { label: "dbp", value: "64", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.9 C, HR 88 irregularly irregular, BP 106/64, RR 18, SpO2 95% on room air." },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Vital signs: T 36.9 C, HR 88 irregularly irregular, BP 106/64, RR 18, SpO2 95% on room air." },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "Vital signs: T 36.9 C, HR 88 irregularly irregular, BP 106/64, RR 18, SpO2 95% on room air." },
      { label: "inr", value: "5.2", sourceUnit: "(ratio)", sourceSpan: "Labs: INR 5.2, PT 58.4 seconds, aPTT 42 seconds, hemoglobin 11.4 g/dL (12.8 g/dL at discharge), hematocrit 34%, platelets 188,000/uL, BUN 34 mg/dL, creatinine 1.4 mg/dL, albumin 3.0 g/dL." },
      { label: "ptt", value: "42", sourceUnit: "seconds", sourceSpan: "Labs: INR 5.2, PT 58.4 seconds, aPTT 42 seconds, hemoglobin 11.4 g/dL (12.8 g/dL at discharge), hematocrit 34%, platelets 188,000/uL, BUN 34 mg/dL, creatinine 1.4 mg/dL, albumin 3.0 g/dL." },
      { label: "hemoglobin", value: "11.4", sourceUnit: "g/dL", sourceSpan: "Labs: INR 5.2, PT 58.4 seconds, aPTT 42 seconds, hemoglobin 11.4 g/dL (12.8 g/dL at discharge), hematocrit 34%, platelets 188,000/uL, BUN 34 mg/dL, creatinine 1.4 mg/dL, albumin 3.0 g/dL." },
      { label: "hematocrit", value: "34", sourceUnit: "%", sourceSpan: "Labs: INR 5.2, PT 58.4 seconds, aPTT 42 seconds, hemoglobin 11.4 g/dL (12.8 g/dL at discharge), hematocrit 34%, platelets 188,000/uL, BUN 34 mg/dL, creatinine 1.4 mg/dL, albumin 3.0 g/dL." },
      { label: "platelets", value: "188,000", sourceUnit: "/uL", sourceSpan: "Labs: INR 5.2, PT 58.4 seconds, aPTT 42 seconds, hemoglobin 11.4 g/dL (12.8 g/dL at discharge), hematocrit 34%, platelets 188,000/uL, BUN 34 mg/dL, creatinine 1.4 mg/dL, albumin 3.0 g/dL." },
      { label: "bun", value: "34", sourceUnit: "mg/dL", sourceSpan: "Labs: INR 5.2, PT 58.4 seconds, aPTT 42 seconds, hemoglobin 11.4 g/dL (12.8 g/dL at discharge), hematocrit 34%, platelets 188,000/uL, BUN 34 mg/dL, creatinine 1.4 mg/dL, albumin 3.0 g/dL." },
      { label: "creatinine", value: "1.4", sourceUnit: "mg/dL", sourceSpan: "Labs: INR 5.2, PT 58.4 seconds, aPTT 42 seconds, hemoglobin 11.4 g/dL (12.8 g/dL at discharge), hematocrit 34%, platelets 188,000/uL, BUN 34 mg/dL, creatinine 1.4 mg/dL, albumin 3.0 g/dL." }
    ],
    excludedValues: [
      { label: "hemoglobin", value: "12.8", reason: "prior", sourceSpan: "Labs: INR 5.2, PT 58.4 seconds, aPTT 42 seconds, hemoglobin 11.4 g/dL (12.8 g/dL at discharge), hematocrit 34%, platelets 188,000/uL, BUN 34 mg/dL, creatinine 1.4 mg/dL, albumin 3.0 g/dL." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_warfarin_mvr_2026_06_11_01/stage_3_deterioration",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.1", sourceUnit: "C", sourceSpan: "0600 vital signs: T 37.1 C, HR 98, BP 100/60, RR 20, SpO2 95% on room air." },
      { label: "hr", value: "98", sourceUnit: "bpm", sourceSpan: "0600 vital signs: T 37.1 C, HR 98, BP 100/60, RR 20, SpO2 95% on room air." },
      { label: "sbp", value: "100", sourceUnit: "mmHg", sourceSpan: "0600 vital signs: T 37.1 C, HR 98, BP 100/60, RR 20, SpO2 95% on room air." },
      { label: "dbp", value: "60", sourceUnit: "mmHg", sourceSpan: "0600 vital signs: T 37.1 C, HR 98, BP 100/60, RR 20, SpO2 95% on room air." },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "0600 vital signs: T 37.1 C, HR 98, BP 100/60, RR 20, SpO2 95% on room air." },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "0600 vital signs: T 37.1 C, HR 98, BP 100/60, RR 20, SpO2 95% on room air." },
      { label: "inr", value: "6.8", sourceUnit: "(ratio)", sourceSpan: "0645 stat labs: INR 6.8, PT 76.2 seconds, hemoglobin 9.2 g/dL, hematocrit 27.6%, platelets 174,000/uL, BUN 42 mg/dL, creatinine 1.5 mg/dL, lactate 2.4 mmol/L." },
      { label: "hemoglobin", value: "9.2", sourceUnit: "g/dL", sourceSpan: "0645 stat labs: INR 6.8, PT 76.2 seconds, hemoglobin 9.2 g/dL, hematocrit 27.6%, platelets 174,000/uL, BUN 42 mg/dL, creatinine 1.5 mg/dL, lactate 2.4 mmol/L." },
      { label: "hematocrit", value: "27.6", sourceUnit: "%", sourceSpan: "0645 stat labs: INR 6.8, PT 76.2 seconds, hemoglobin 9.2 g/dL, hematocrit 27.6%, platelets 174,000/uL, BUN 42 mg/dL, creatinine 1.5 mg/dL, lactate 2.4 mmol/L." },
      { label: "platelets", value: "174,000", sourceUnit: "/uL", sourceSpan: "0645 stat labs: INR 6.8, PT 76.2 seconds, hemoglobin 9.2 g/dL, hematocrit 27.6%, platelets 174,000/uL, BUN 42 mg/dL, creatinine 1.5 mg/dL, lactate 2.4 mmol/L." },
      { label: "bun", value: "42", sourceUnit: "mg/dL", sourceSpan: "0645 stat labs: INR 6.8, PT 76.2 seconds, hemoglobin 9.2 g/dL, hematocrit 27.6%, platelets 174,000/uL, BUN 42 mg/dL, creatinine 1.5 mg/dL, lactate 2.4 mmol/L." },
      { label: "creatinine", value: "1.5", sourceUnit: "mg/dL", sourceSpan: "0645 stat labs: INR 6.8, PT 76.2 seconds, hemoglobin 9.2 g/dL, hematocrit 27.6%, platelets 174,000/uL, BUN 42 mg/dL, creatinine 1.5 mg/dL, lactate 2.4 mmol/L." },
      { label: "lactate", value: "2.4", sourceUnit: "mmol/L", sourceSpan: "0645 stat labs: INR 6.8, PT 76.2 seconds, hemoglobin 9.2 g/dL, hematocrit 27.6%, platelets 174,000/uL, BUN 42 mg/dL, creatinine 1.5 mg/dL, lactate 2.4 mmol/L." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/ongoing_plan",
    lane: "extract",
    panel: [
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "At 1015 after stimulation, oxygen 2 L/min by nasal cannula, and provider notification, respiratory rate is 14/min and SpO2 is 95%.", context: "post_intervention" },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "At 1015 after stimulation, oxygen 2 L/min by nasal cannula, and provider notification, respiratory rate is 14/min and SpO2 is 95%.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_opus21_case_colostomy_lep_discharge_01/stage3_discharge_teachback",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.0", sourceUnit: "C", sourceSpan: "Discharge vitals: T 37.0 C, HR 76, BP 128/76, RR 14, SpO2 98%." },
      { label: "hr", value: "76", sourceUnit: "bpm", sourceSpan: "Discharge vitals: T 37.0 C, HR 76, BP 128/76, RR 14, SpO2 98%." },
      { label: "sbp", value: "128", sourceUnit: "mmHg", sourceSpan: "Discharge vitals: T 37.0 C, HR 76, BP 128/76, RR 14, SpO2 98%." },
      { label: "dbp", value: "76", sourceUnit: "mmHg", sourceSpan: "Discharge vitals: T 37.0 C, HR 76, BP 128/76, RR 14, SpO2 98%." },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "Discharge vitals: T 37.0 C, HR 76, BP 128/76, RR 14, SpO2 98%." },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "Discharge vitals: T 37.0 C, HR 76, BP 128/76, RR 14, SpO2 98%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_pph_2026_06_16_case_01/stage_2_update",
    lane: "extract",
    panel: [
      { label: "hr", value: "132", sourceUnit: "bpm", sourceSpan: "Vital signs: HR 132, BP 80/52, RR 26, SpO2 95% on room air.", context: "post_intervention" },
      { label: "sbp", value: "80", sourceUnit: "mmHg", sourceSpan: "Vital signs: HR 132, BP 80/52, RR 26, SpO2 95% on room air.", context: "post_intervention" },
      { label: "dbp", value: "52", sourceUnit: "mmHg", sourceSpan: "Vital signs: HR 132, BP 80/52, RR 26, SpO2 95% on room air.", context: "post_intervention" },
      { label: "rr", value: "26", sourceUnit: "/min", sourceSpan: "Vital signs: HR 132, BP 80/52, RR 26, SpO2 95% on room air.", context: "post_intervention" },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "Vital signs: HR 132, BP 80/52, RR 26, SpO2 95% on room air.", context: "post_intervention" },
      { label: "hemoglobin", value: "8.1", sourceUnit: "g/dL", sourceSpan: "Stat labs: Hgb 8.1 g/dL, Hct 24.3%, platelets 162,000/µL, fibrinogen 280 mg/dL, INR 1.1, aPTT 30 sec." },
      { label: "hematocrit", value: "24.3", sourceUnit: "%", sourceSpan: "Stat labs: Hgb 8.1 g/dL, Hct 24.3%, platelets 162,000/µL, fibrinogen 280 mg/dL, INR 1.1, aPTT 30 sec." },
      { label: "platelets", value: "162,000", sourceUnit: "/µL", sourceSpan: "Stat labs: Hgb 8.1 g/dL, Hct 24.3%, platelets 162,000/µL, fibrinogen 280 mg/dL, INR 1.1, aPTT 30 sec." },
      { label: "inr", value: "1.1", sourceUnit: "(ratio)", sourceSpan: "Stat labs: Hgb 8.1 g/dL, Hct 24.3%, platelets 162,000/µL, fibrinogen 280 mg/dL, INR 1.1, aPTT 30 sec." },
      { label: "ptt", value: "30", sourceUnit: "sec", sourceSpan: "Stat labs: Hgb 8.1 g/dL, Hct 24.3%, platelets 162,000/µL, fibrinogen 280 mg/dL, INR 1.1, aPTT 30 sec." }
    ],
    excludedValues: [],
    unitAliases: []
  }
];

const batch15Records: ExtractionRecord[] = [
  {
    exhibitRef: "gpt_pph_2026_06_16_case_01/stage_3_update",
    lane: "extract",
    panel: [
      { label: "hr", value: "112", sourceUnit: "bpm", sourceSpan: "Vital signs: HR 112, BP 94/60, RR 20, SpO2 97% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "sbp", value: "94", sourceUnit: "mmHg", sourceSpan: "Vital signs: HR 112, BP 94/60, RR 20, SpO2 97% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "dbp", value: "60", sourceUnit: "mmHg", sourceSpan: "Vital signs: HR 112, BP 94/60, RR 20, SpO2 97% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "Vital signs: HR 112, BP 94/60, RR 20, SpO2 97% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Vital signs: HR 112, BP 94/60, RR 20, SpO2 97% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "hemoglobin", value: "7.4", sourceUnit: "g/dL", sourceSpan: "Repeat labs: Hgb 7.4 g/dL, Hct 22.1%, platelets 148,000/µL, fibrinogen 240 mg/dL, INR 1.2, aPTT 32 sec.", context: "post_intervention" },
      { label: "hematocrit", value: "22.1", sourceUnit: "%", sourceSpan: "Repeat labs: Hgb 7.4 g/dL, Hct 22.1%, platelets 148,000/µL, fibrinogen 240 mg/dL, INR 1.2, aPTT 32 sec.", context: "post_intervention" },
      { label: "platelets", value: "148,000", sourceUnit: "/µL", sourceSpan: "Repeat labs: Hgb 7.4 g/dL, Hct 22.1%, platelets 148,000/µL, fibrinogen 240 mg/dL, INR 1.2, aPTT 32 sec.", context: "post_intervention" },
      { label: "inr", value: "1.2", sourceUnit: "(ratio)", sourceSpan: "Repeat labs: Hgb 7.4 g/dL, Hct 22.1%, platelets 148,000/µL, fibrinogen 240 mg/dL, INR 1.2, aPTT 32 sec.", context: "post_intervention" },
      { label: "ptt", value: "32", sourceUnit: "sec", sourceSpan: "Repeat labs: Hgb 7.4 g/dL, Hct 22.1%, platelets 148,000/µL, fibrinogen 240 mg/dL, INR 1.2, aPTT 32 sec.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/baseline_assessment",
    lane: "skip_serial"
  },
  {
    exhibitRef: "gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/stage_1_stroke_team",
    lane: "extract",
    panel: [
      { label: "inr", value: "1.8", sourceUnit: "(ratio)", sourceSpan: "Stat INR is 1.8." },
      { label: "sbp", value: "186", sourceUnit: "mmHg", sourceSpan: "BP remains 186/102 mmHg." },
      { label: "dbp", value: "102", sourceUnit: "mmHg", sourceSpan: "BP remains 186/102 mmHg." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/stage_3_post_procedure_baseline",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.1", sourceUnit: "°C", sourceSpan: "On neuro-ICU arrival: T 37.1 °C, HR 82/min irregularly irregular, BP 156/88 mmHg on nicardipine 5 mg/hr, RR 14/min, SpO2 98% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "hr", value: "82", sourceUnit: "bpm", sourceSpan: "On neuro-ICU arrival: T 37.1 °C, HR 82/min irregularly irregular, BP 156/88 mmHg on nicardipine 5 mg/hr, RR 14/min, SpO2 98% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "sbp", value: "156", sourceUnit: "mmHg", sourceSpan: "On neuro-ICU arrival: T 37.1 °C, HR 82/min irregularly irregular, BP 156/88 mmHg on nicardipine 5 mg/hr, RR 14/min, SpO2 98% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "dbp", value: "88", sourceUnit: "mmHg", sourceSpan: "On neuro-ICU arrival: T 37.1 °C, HR 82/min irregularly irregular, BP 156/88 mmHg on nicardipine 5 mg/hr, RR 14/min, SpO2 98% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "On neuro-ICU arrival: T 37.1 °C, HR 82/min irregularly irregular, BP 156/88 mmHg on nicardipine 5 mg/hr, RR 14/min, SpO2 98% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "On neuro-ICU arrival: T 37.1 °C, HR 82/min irregularly irregular, BP 156/88 mmHg on nicardipine 5 mg/hr, RR 14/min, SpO2 98% on 2 L nasal cannula.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/stage_4_ich_management",
    lane: "extract",
    panel: [
      { label: "inr", value: "1.6", sourceUnit: "(ratio)", sourceSpan: "Repeat labs: INR 1.6, hemoglobin 12.8 g/dL, platelets 174,000/µL." },
      { label: "hemoglobin", value: "12.8", sourceUnit: "g/dL", sourceSpan: "Repeat labs: INR 1.6, hemoglobin 12.8 g/dL, platelets 174,000/µL." },
      { label: "platelets", value: "174,000", sourceUnit: "/µL", sourceSpan: "Repeat labs: INR 1.6, hemoglobin 12.8 g/dL, platelets 174,000/µL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_agvd_case_agvhd_01/exhibit_labs_01",
    lane: "extract",
    panel: [
      { label: "wbc", value: "3,800", sourceUnit: "/μL", sourceSpan: "White blood cell count: 3,800/μL" },
      { label: "hemoglobin", value: "9.8", sourceUnit: "g/dL", sourceSpan: "Hemoglobin: 9.8 g/dL" },
      { label: "platelets", value: "42,000", sourceUnit: "/μL", sourceSpan: "Platelets: 42,000/μL" },
      { label: "sodium", value: "138", sourceUnit: "mEq/L", sourceSpan: "Sodium: 138 mEq/L" },
      { label: "potassium", value: "3.4", sourceUnit: "mEq/L", sourceSpan: "Potassium: 3.4 mEq/L" },
      { label: "chloride", value: "104", sourceUnit: "mEq/L", sourceSpan: "Chloride: 104 mEq/L" },
      { label: "bicarbonate", value: "22", sourceUnit: "mEq/L", sourceSpan: "Bicarbonate: 22 mEq/L" },
      { label: "bun", value: "28", sourceUnit: "mg/dL", sourceSpan: "Blood urea nitrogen: 28 mg/dL" },
      { label: "creatinine", value: "1.0", sourceUnit: "mg/dL", sourceSpan: "Creatinine: 1.0 mg/dL" },
      { label: "glucose", value: "118", sourceUnit: "mg/dL", sourceSpan: "Glucose: 118 mg/dL" },
      { label: "magnesium", value: "1.6", sourceUnit: "mg/dL", sourceSpan: "Magnesium: 1.6 mg/dL" },
      { label: "phosphate", value: "3.2", sourceUnit: "mg/dL", sourceSpan: "Phosphorus: 3.2 mg/dL" },
      { label: "total_bilirubin", value: "2.1", sourceUnit: "mg/dL", sourceSpan: "Total bilirubin: 2.1 mg/dL" },
      { label: "alt", value: "62", sourceUnit: "U/L", sourceSpan: "Alanine aminotransferase (ALT): 62 U/L" },
      { label: "ast", value: "58", sourceUnit: "U/L", sourceSpan: "Aspartate aminotransferase (AST): 58 U/L" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_agvd_case_agvhd_01/exhibit_presentation_01",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.3", sourceUnit: "°C", sourceSpan: "Temperature: 37.3°C (99.1°F)" },
      { label: "hr", value: "96", sourceUnit: "bpm", sourceSpan: "Heart rate: 96 beats/min" },
      { label: "sbp", value: "108", sourceUnit: "mmHg", sourceSpan: "Blood pressure: 108/68 mmHg" },
      { label: "dbp", value: "68", sourceUnit: "mmHg", sourceSpan: "Blood pressure: 108/68 mmHg" },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Respiratory rate: 18 breaths/min" },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Oxygen saturation: 97% on room air" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_agvd_case_agvhd_01/exhibit_stage1_01",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.6", sourceUnit: "°C", sourceSpan: "Temperature: 37.6°C (99.7°F)" },
      { label: "hr", value: "102", sourceUnit: "bpm", sourceSpan: "Heart rate: 102 beats/min" },
      { label: "sbp", value: "104", sourceUnit: "mmHg", sourceSpan: "Blood pressure: 104/64 mmHg" },
      { label: "dbp", value: "64", sourceUnit: "mmHg", sourceSpan: "Blood pressure: 104/64 mmHg" },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Respiratory rate: 18 breaths/min" },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Oxygen saturation: 97% on room air" },
      { label: "potassium", value: "3.1", sourceUnit: "mEq/L", sourceSpan: "Potassium: 3.1 mEq/L" },
      { label: "magnesium", value: "1.4", sourceUnit: "mg/dL", sourceSpan: "Magnesium: 1.4 mg/dL" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_agvd_case_agvhd_01/exhibit_stage2_01",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.1", sourceUnit: "°C", sourceSpan: "Temperature: 38.1°C (100.6°F)", context: "post_intervention" },
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "Heart rate: 118 beats/min", context: "post_intervention" },
      { label: "sbp", value: "92", sourceUnit: "mmHg", sourceSpan: "Blood pressure: 92/56 mmHg", context: "post_intervention" },
      { label: "dbp", value: "56", sourceUnit: "mmHg", sourceSpan: "Blood pressure: 92/56 mmHg", context: "post_intervention" },
      { label: "rr", value: "22", sourceUnit: "/min", sourceSpan: "Respiratory rate: 22 breaths/min", context: "post_intervention" },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Oxygen saturation: 96% on room air", context: "post_intervention" },
      { label: "potassium", value: "2.8", sourceUnit: "mEq/L", sourceSpan: "Potassium: 2.8 mEq/L", context: "post_intervention" },
      { label: "magnesium", value: "1.1", sourceUnit: "mg/dL", sourceSpan: "Magnesium: 1.1 mg/dL", context: "post_intervention" },
      { label: "sodium", value: "134", sourceUnit: "mEq/L", sourceSpan: "Sodium: 134 mEq/L", context: "post_intervention" },
      { label: "total_bilirubin", value: "3.6", sourceUnit: "mg/dL", sourceSpan: "Total bilirubin: 3.6 mg/dL", context: "post_intervention" },
      { label: "alt", value: "94", sourceUnit: "U/L", sourceSpan: "ALT: 94 U/L", context: "post_intervention" },
      { label: "ast", value: "88", sourceUnit: "U/L", sourceSpan: "AST: 88 U/L", context: "post_intervention" },
      { label: "creatinine", value: "1.6", sourceUnit: "mg/dL", sourceSpan: "Creatinine: 1.6 mg/dL", context: "post_intervention" },
      { label: "bun", value: "38", sourceUnit: "mg/dL", sourceSpan: "Blood urea nitrogen: 38 mg/dL", context: "post_intervention" },
      { label: "glucose", value: "248", sourceUnit: "mg/dL", sourceSpan: "Glucose: 248 mg/dL", context: "post_intervention" },
      { label: "hemoglobin", value: "7.9", sourceUnit: "g/dL", sourceSpan: "Hemoglobin: 7.9 g/dL", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_agvd_case_agvhd_01/exhibit_stage3_01",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.2", sourceUnit: "°C", sourceSpan: "Temperature: 37.2°C (99.0°F)", context: "post_intervention" },
      { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: "Heart rate: 92 beats/min", context: "post_intervention" },
      { label: "sbp", value: "110", sourceUnit: "mmHg", sourceSpan: "Blood pressure: 110/70 mmHg", context: "post_intervention" },
      { label: "dbp", value: "70", sourceUnit: "mmHg", sourceSpan: "Blood pressure: 110/70 mmHg", context: "post_intervention" },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Respiratory rate: 16 breaths/min", context: "post_intervention" },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "Oxygen saturation: 98% on room air", context: "post_intervention" },
      { label: "potassium", value: "3.8", sourceUnit: "mEq/L", sourceSpan: "Potassium: 3.8 mEq/L", context: "post_intervention" },
      { label: "magnesium", value: "1.8", sourceUnit: "mg/dL", sourceSpan: "Magnesium: 1.8 mg/dL", context: "post_intervention" },
      { label: "total_bilirubin", value: "2.4", sourceUnit: "mg/dL", sourceSpan: "Total bilirubin: 2.4 mg/dL", context: "post_intervention" },
      { label: "alt", value: "72", sourceUnit: "U/L", sourceSpan: "ALT: 72 U/L", context: "post_intervention" },
      { label: "creatinine", value: "1.2", sourceUnit: "mg/dL", sourceSpan: "Creatinine: 1.2 mg/dL", context: "post_intervention" },
      { label: "bun", value: "26", sourceUnit: "mg/dL", sourceSpan: "Blood urea nitrogen: 26 mg/dL", context: "post_intervention" },
      { label: "glucose", value: "162", sourceUnit: "mg/dL", sourceSpan: "Glucose: 162 mg/dL", context: "post_intervention" },
      { label: "hemoglobin", value: "8.8", sourceUnit: "g/dL", sourceSpan: "Hemoglobin: 8.8 g/dL (post-transfusion)", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_car_t_crs_2026_06_11_case_01/ex3",
    lane: "extract",
    panel: [
      { label: "wbc", value: "0.3", sourceUnit: "× 10³/µL", sourceSpan: "WBC 0.3 × 10³/µL" },
      { label: "hemoglobin", value: "9.8", sourceUnit: "g/dL", sourceSpan: "Hemoglobin 9.8 g/dL" },
      { label: "platelets", value: "45,000", sourceUnit: "/µL", sourceSpan: "Platelets 45,000/µL" },
      { label: "bun", value: "14", sourceUnit: "mg/dL", sourceSpan: "BUN 14 mg/dL" },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "Creatinine 0.9 mg/dL" },
      { label: "sodium", value: "138", sourceUnit: "mEq/L", sourceSpan: "Sodium 138 mEq/L" },
      { label: "potassium", value: "4.2", sourceUnit: "mEq/L", sourceSpan: "Potassium 4.2 mEq/L" },
      { label: "chloride", value: "102", sourceUnit: "mEq/L", sourceSpan: "Chloride 102 mEq/L" },
      { label: "bicarbonate", value: "24", sourceUnit: "mEq/L", sourceSpan: "Bicarbonate 24 mEq/L" },
      { label: "glucose", value: "148", sourceUnit: "mg/dL", sourceSpan: "Glucose 148 mg/dL" },
      { label: "ast", value: "28", sourceUnit: "U/L", sourceSpan: "AST 28 U/L" },
      { label: "alt", value: "32", sourceUnit: "U/L", sourceSpan: "ALT 32 U/L" },
      { label: "total_bilirubin", value: "0.8", sourceUnit: "mg/dL", sourceSpan: "Total bilirubin 0.8 mg/dL" },
      { label: "inr", value: "1.0", sourceUnit: "(ratio)", sourceSpan: "INR 1.0" }
    ],
    excludedValues: [],
    unitAliases: [
      { aliasOf: "wbc", value: "0.3 × 10³/µL" }
    ]
  },
  {
    exhibitRef: "opus_car_t_crs_2026_06_11_case_01/ex4",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.9", sourceUnit: "°C", sourceSpan: "Vital signs: temperature 38.9 °C (oral), heart rate 104 and sinus tachycardia on telemetry, blood pressure 118/72, respiratory rate 20, SpO₂ 96% on room air." },
      { label: "hr", value: "104", sourceUnit: "bpm", sourceSpan: "Vital signs: temperature 38.9 °C (oral), heart rate 104 and sinus tachycardia on telemetry, blood pressure 118/72, respiratory rate 20, SpO₂ 96% on room air." },
      { label: "sbp", value: "118", sourceUnit: "mmHg", sourceSpan: "Vital signs: temperature 38.9 °C (oral), heart rate 104 and sinus tachycardia on telemetry, blood pressure 118/72, respiratory rate 20, SpO₂ 96% on room air." },
      { label: "dbp", value: "72", sourceUnit: "mmHg", sourceSpan: "Vital signs: temperature 38.9 °C (oral), heart rate 104 and sinus tachycardia on telemetry, blood pressure 118/72, respiratory rate 20, SpO₂ 96% on room air." },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "Vital signs: temperature 38.9 °C (oral), heart rate 104 and sinus tachycardia on telemetry, blood pressure 118/72, respiratory rate 20, SpO₂ 96% on room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Vital signs: temperature 38.9 °C (oral), heart rate 104 and sinus tachycardia on telemetry, blood pressure 118/72, respiratory rate 20, SpO₂ 96% on room air." },
      { label: "creatinine", value: "1.0", sourceUnit: "mg/dL", sourceSpan: "The provider is notified and orders stat labs: CRP 86 mg/L, ferritin 1,450 ng/mL, fibrinogen 280 mg/dL, LDH 380 U/L, creatinine 1.0 mg/dL, AST 40 U/L, ALT 38 U/L." },
      { label: "ast", value: "40", sourceUnit: "U/L", sourceSpan: "The provider is notified and orders stat labs: CRP 86 mg/L, ferritin 1,450 ng/mL, fibrinogen 280 mg/dL, LDH 380 U/L, creatinine 1.0 mg/dL, AST 40 U/L, ALT 38 U/L." },
      { label: "alt", value: "38", sourceUnit: "U/L", sourceSpan: "The provider is notified and orders stat labs: CRP 86 mg/L, ferritin 1,450 ng/mL, fibrinogen 280 mg/dL, LDH 380 U/L, creatinine 1.0 mg/dL, AST 40 U/L, ALT 38 U/L." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_car_t_crs_2026_06_11_case_01/ex5",
    lane: "extract",
    panel: [
      { label: "temp", value: "39.8", sourceUnit: "°C", sourceSpan: "Over the night shift, the patient's fever has escalated to 39.8 °C despite scheduled acetaminophen." },
      { label: "hr", value: "122", sourceUnit: "bpm", sourceSpan: "On assessment, heart rate is 122, sinus tachycardia, blood pressure 88/52 (mean arterial pressure 64), respiratory rate 26, SpO₂ 93% on room air." },
      { label: "sbp", value: "88", sourceUnit: "mmHg", sourceSpan: "On assessment, heart rate is 122, sinus tachycardia, blood pressure 88/52 (mean arterial pressure 64), respiratory rate 26, SpO₂ 93% on room air." },
      { label: "dbp", value: "52", sourceUnit: "mmHg", sourceSpan: "On assessment, heart rate is 122, sinus tachycardia, blood pressure 88/52 (mean arterial pressure 64), respiratory rate 26, SpO₂ 93% on room air." },
      { label: "map", value: "64", sourceUnit: "mmHg", sourceSpan: "On assessment, heart rate is 122, sinus tachycardia, blood pressure 88/52 (mean arterial pressure 64), respiratory rate 26, SpO₂ 93% on room air." },
      { label: "rr", value: "26", sourceUnit: "/min", sourceSpan: "On assessment, heart rate is 122, sinus tachycardia, blood pressure 88/52 (mean arterial pressure 64), respiratory rate 26, SpO₂ 93% on room air." },
      { label: "spo2", value: "93", sourceUnit: "%", sourceSpan: "On assessment, heart rate is 122, sinus tachycardia, blood pressure 88/52 (mean arterial pressure 64), respiratory rate 26, SpO₂ 93% on room air." },
      { label: "creatinine", value: "1.6", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: CRP 245 mg/L, ferritin 8,200 ng/mL, fibrinogen 180 mg/dL, LDH 620 U/L, creatinine 1.6 mg/dL, AST 78 U/L, ALT 65 U/L, total bilirubin 1.4 mg/dL, D-dimer 2.8 µg/mL FEU, potassium 5.1 mEq/L." },
      { label: "ast", value: "78", sourceUnit: "U/L", sourceSpan: "Repeat labs: CRP 245 mg/L, ferritin 8,200 ng/mL, fibrinogen 180 mg/dL, LDH 620 U/L, creatinine 1.6 mg/dL, AST 78 U/L, ALT 65 U/L, total bilirubin 1.4 mg/dL, D-dimer 2.8 µg/mL FEU, potassium 5.1 mEq/L." },
      { label: "alt", value: "65", sourceUnit: "U/L", sourceSpan: "Repeat labs: CRP 245 mg/L, ferritin 8,200 ng/mL, fibrinogen 180 mg/dL, LDH 620 U/L, creatinine 1.6 mg/dL, AST 78 U/L, ALT 65 U/L, total bilirubin 1.4 mg/dL, D-dimer 2.8 µg/mL FEU, potassium 5.1 mEq/L." },
      { label: "total_bilirubin", value: "1.4", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: CRP 245 mg/L, ferritin 8,200 ng/mL, fibrinogen 180 mg/dL, LDH 620 U/L, creatinine 1.6 mg/dL, AST 78 U/L, ALT 65 U/L, total bilirubin 1.4 mg/dL, D-dimer 2.8 µg/mL FEU, potassium 5.1 mEq/L." },
      { label: "potassium", value: "5.1", sourceUnit: "mEq/L", sourceSpan: "Repeat labs: CRP 245 mg/L, ferritin 8,200 ng/mL, fibrinogen 180 mg/dL, LDH 620 U/L, creatinine 1.6 mg/dL, AST 78 U/L, ALT 65 U/L, total bilirubin 1.4 mg/dL, D-dimer 2.8 µg/mL FEU, potassium 5.1 mEq/L." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_car_t_crs_2026_06_11_case_01/ex6",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.6", sourceUnit: "°C", sourceSpan: "On reassessment: temperature 37.6 °C (down from 39.8), heart rate 96 (sinus rhythm, improved from 122), blood pressure 108/68 (up from 88/52 and now stable without vasopressors after one additional 250 mL bolus), respiratory rate 18, SpO₂ 96% on 1 L nasal cannula (weaned from 2 L).", context: "post_intervention" },
      { label: "hr", value: "96", sourceUnit: "bpm", sourceSpan: "On reassessment: temperature 37.6 °C (down from 39.8), heart rate 96 (sinus rhythm, improved from 122), blood pressure 108/68 (up from 88/52 and now stable without vasopressors after one additional 250 mL bolus), respiratory rate 18, SpO₂ 96% on 1 L nasal cannula (weaned from 2 L).", context: "post_intervention" },
      { label: "sbp", value: "108", sourceUnit: "mmHg", sourceSpan: "On reassessment: temperature 37.6 °C (down from 39.8), heart rate 96 (sinus rhythm, improved from 122), blood pressure 108/68 (up from 88/52 and now stable without vasopressors after one additional 250 mL bolus), respiratory rate 18, SpO₂ 96% on 1 L nasal cannula (weaned from 2 L).", context: "post_intervention" },
      { label: "dbp", value: "68", sourceUnit: "mmHg", sourceSpan: "On reassessment: temperature 37.6 °C (down from 39.8), heart rate 96 (sinus rhythm, improved from 122), blood pressure 108/68 (up from 88/52 and now stable without vasopressors after one additional 250 mL bolus), respiratory rate 18, SpO₂ 96% on 1 L nasal cannula (weaned from 2 L).", context: "post_intervention" },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "On reassessment: temperature 37.6 °C (down from 39.8), heart rate 96 (sinus rhythm, improved from 122), blood pressure 108/68 (up from 88/52 and now stable without vasopressors after one additional 250 mL bolus), respiratory rate 18, SpO₂ 96% on 1 L nasal cannula (weaned from 2 L).", context: "post_intervention" },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "On reassessment: temperature 37.6 °C (down from 39.8), heart rate 96 (sinus rhythm, improved from 122), blood pressure 108/68 (up from 88/52 and now stable without vasopressors after one additional 250 mL bolus), respiratory rate 18, SpO₂ 96% on 1 L nasal cannula (weaned from 2 L).", context: "post_intervention" },
      { label: "creatinine", value: "1.2", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: CRP 110 mg/L (still elevated but trending down from 245), ferritin 5,400 ng/mL (down from 8,200), fibrinogen 240 mg/dL (improving from 180), LDH 420 U/L, creatinine 1.2 mg/dL (improving from 1.6), AST 52 U/L, ALT 48 U/L, D-dimer 1.6 µg/mL FEU, potassium 4.4 mEq/L.", context: "post_intervention" },
      { label: "ast", value: "52", sourceUnit: "U/L", sourceSpan: "Repeat labs: CRP 110 mg/L (still elevated but trending down from 245), ferritin 5,400 ng/mL (down from 8,200), fibrinogen 240 mg/dL (improving from 180), LDH 420 U/L, creatinine 1.2 mg/dL (improving from 1.6), AST 52 U/L, ALT 48 U/L, D-dimer 1.6 µg/mL FEU, potassium 4.4 mEq/L.", context: "post_intervention" },
      { label: "alt", value: "48", sourceUnit: "U/L", sourceSpan: "Repeat labs: CRP 110 mg/L (still elevated but trending down from 245), ferritin 5,400 ng/mL (down from 8,200), fibrinogen 240 mg/dL (improving from 180), LDH 420 U/L, creatinine 1.2 mg/dL (improving from 1.6), AST 52 U/L, ALT 48 U/L, D-dimer 1.6 µg/mL FEU, potassium 4.4 mEq/L.", context: "post_intervention" },
      { label: "potassium", value: "4.4", sourceUnit: "mEq/L", sourceSpan: "Repeat labs: CRP 110 mg/L (still elevated but trending down from 245), ferritin 5,400 ng/mL (down from 8,200), fibrinogen 240 mg/dL (improving from 180), LDH 420 U/L, creatinine 1.2 mg/dL (improving from 1.6), AST 52 U/L, ALT 48 U/L, D-dimer 1.6 µg/mL FEU, potassium 4.4 mEq/L.", context: "post_intervention" }
    ],
    excludedValues: [
      { label: "temp", value: "39.8", reason: "trend", sourceSpan: "On reassessment: temperature 37.6 °C (down from 39.8), heart rate 96 (sinus rhythm, improved from 122), blood pressure 108/68 (up from 88/52 and now stable without vasopressors after one additional 250 mL bolus), respiratory rate 18, SpO₂ 96% on 1 L nasal cannula (weaned from 2 L)." },
      { label: "hr", value: "122", reason: "trend", sourceSpan: "On reassessment: temperature 37.6 °C (down from 39.8), heart rate 96 (sinus rhythm, improved from 122), blood pressure 108/68 (up from 88/52 and now stable without vasopressors after one additional 250 mL bolus), respiratory rate 18, SpO₂ 96% on 1 L nasal cannula (weaned from 2 L)." },
      { label: "sbp", value: "88", reason: "trend", sourceSpan: "On reassessment: temperature 37.6 °C (down from 39.8), heart rate 96 (sinus rhythm, improved from 122), blood pressure 108/68 (up from 88/52 and now stable without vasopressors after one additional 250 mL bolus), respiratory rate 18, SpO₂ 96% on 1 L nasal cannula (weaned from 2 L)." },
      { label: "dbp", value: "52", reason: "trend", sourceSpan: "On reassessment: temperature 37.6 °C (down from 39.8), heart rate 96 (sinus rhythm, improved from 122), blood pressure 108/68 (up from 88/52 and now stable without vasopressors after one additional 250 mL bolus), respiratory rate 18, SpO₂ 96% on 1 L nasal cannula (weaned from 2 L)." },
      { label: "creatinine", value: "1.6", reason: "trend", sourceSpan: "Repeat labs: CRP 110 mg/L (still elevated but trending down from 245), ferritin 5,400 ng/mL (down from 8,200), fibrinogen 240 mg/dL (improving from 180), LDH 420 U/L, creatinine 1.2 mg/dL (improving from 1.6), AST 52 U/L, ALT 48 U/L, D-dimer 1.6 µg/mL FEU, potassium 4.4 mEq/L." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "opus_case_lithium_toxicity_01/exhibit_admission",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.1", sourceUnit: "°C", sourceSpan: "Temperature 37.1 °C, heart rate 102 and regular, blood pressure 98/62, respiratory rate 18, SpO₂ 96% on room air." },
      { label: "hr", value: "102", sourceUnit: "bpm", sourceSpan: "Temperature 37.1 °C, heart rate 102 and regular, blood pressure 98/62, respiratory rate 18, SpO₂ 96% on room air." },
      { label: "sbp", value: "98", sourceUnit: "mmHg", sourceSpan: "Temperature 37.1 °C, heart rate 102 and regular, blood pressure 98/62, respiratory rate 18, SpO₂ 96% on room air." },
      { label: "dbp", value: "62", sourceUnit: "mmHg", sourceSpan: "Temperature 37.1 °C, heart rate 102 and regular, blood pressure 98/62, respiratory rate 18, SpO₂ 96% on room air." },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Temperature 37.1 °C, heart rate 102 and regular, blood pressure 98/62, respiratory rate 18, SpO₂ 96% on room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Temperature 37.1 °C, heart rate 102 and regular, blood pressure 98/62, respiratory rate 18, SpO₂ 96% on room air." },
      { label: "sodium", value: "148", sourceUnit: "mEq/L", sourceSpan: "Sodium 148 mEq/L, potassium 3.1 mEq/L, chloride 96 mEq/L, bicarbonate 30 mEq/L, BUN 38 mg/dL, creatinine 1.9 mg/dL (baseline 0.9 mg/dL), glucose 142 mg/dL, calcium 9.4 mg/dL, magnesium 1.6 mg/dL (reference 1.7–2.2 mg/dL), phosphorus 3.8 mg/dL." },
      { label: "potassium", value: "3.1", sourceUnit: "mEq/L", sourceSpan: "Sodium 148 mEq/L, potassium 3.1 mEq/L, chloride 96 mEq/L, bicarbonate 30 mEq/L, BUN 38 mg/dL, creatinine 1.9 mg/dL (baseline 0.9 mg/dL), glucose 142 mg/dL, calcium 9.4 mg/dL, magnesium 1.6 mg/dL (reference 1.7–2.2 mg/dL), phosphorus 3.8 mg/dL." },
      { label: "chloride", value: "96", sourceUnit: "mEq/L", sourceSpan: "Sodium 148 mEq/L, potassium 3.1 mEq/L, chloride 96 mEq/L, bicarbonate 30 mEq/L, BUN 38 mg/dL, creatinine 1.9 mg/dL (baseline 0.9 mg/dL), glucose 142 mg/dL, calcium 9.4 mg/dL, magnesium 1.6 mg/dL (reference 1.7–2.2 mg/dL), phosphorus 3.8 mg/dL." },
      { label: "bicarbonate", value: "30", sourceUnit: "mEq/L", sourceSpan: "Sodium 148 mEq/L, potassium 3.1 mEq/L, chloride 96 mEq/L, bicarbonate 30 mEq/L, BUN 38 mg/dL, creatinine 1.9 mg/dL (baseline 0.9 mg/dL), glucose 142 mg/dL, calcium 9.4 mg/dL, magnesium 1.6 mg/dL (reference 1.7–2.2 mg/dL), phosphorus 3.8 mg/dL." },
      { label: "bun", value: "38", sourceUnit: "mg/dL", sourceSpan: "Sodium 148 mEq/L, potassium 3.1 mEq/L, chloride 96 mEq/L, bicarbonate 30 mEq/L, BUN 38 mg/dL, creatinine 1.9 mg/dL (baseline 0.9 mg/dL), glucose 142 mg/dL, calcium 9.4 mg/dL, magnesium 1.6 mg/dL (reference 1.7–2.2 mg/dL), phosphorus 3.8 mg/dL." },
      { label: "creatinine", value: "1.9", sourceUnit: "mg/dL", sourceSpan: "Sodium 148 mEq/L, potassium 3.1 mEq/L, chloride 96 mEq/L, bicarbonate 30 mEq/L, BUN 38 mg/dL, creatinine 1.9 mg/dL (baseline 0.9 mg/dL), glucose 142 mg/dL, calcium 9.4 mg/dL, magnesium 1.6 mg/dL (reference 1.7–2.2 mg/dL), phosphorus 3.8 mg/dL." },
      { label: "glucose", value: "142", sourceUnit: "mg/dL", sourceSpan: "Sodium 148 mEq/L, potassium 3.1 mEq/L, chloride 96 mEq/L, bicarbonate 30 mEq/L, BUN 38 mg/dL, creatinine 1.9 mg/dL (baseline 0.9 mg/dL), glucose 142 mg/dL, calcium 9.4 mg/dL, magnesium 1.6 mg/dL (reference 1.7–2.2 mg/dL), phosphorus 3.8 mg/dL." },
      { label: "calcium", value: "9.4", sourceUnit: "mg/dL", sourceSpan: "Sodium 148 mEq/L, potassium 3.1 mEq/L, chloride 96 mEq/L, bicarbonate 30 mEq/L, BUN 38 mg/dL, creatinine 1.9 mg/dL (baseline 0.9 mg/dL), glucose 142 mg/dL, calcium 9.4 mg/dL, magnesium 1.6 mg/dL (reference 1.7–2.2 mg/dL), phosphorus 3.8 mg/dL." },
      { label: "magnesium", value: "1.6", sourceUnit: "mg/dL", sourceSpan: "Sodium 148 mEq/L, potassium 3.1 mEq/L, chloride 96 mEq/L, bicarbonate 30 mEq/L, BUN 38 mg/dL, creatinine 1.9 mg/dL (baseline 0.9 mg/dL), glucose 142 mg/dL, calcium 9.4 mg/dL, magnesium 1.6 mg/dL (reference 1.7–2.2 mg/dL), phosphorus 3.8 mg/dL." },
      { label: "phosphate", value: "3.8", sourceUnit: "mg/dL", sourceSpan: "Sodium 148 mEq/L, potassium 3.1 mEq/L, chloride 96 mEq/L, bicarbonate 30 mEq/L, BUN 38 mg/dL, creatinine 1.9 mg/dL (baseline 0.9 mg/dL), glucose 142 mg/dL, calcium 9.4 mg/dL, magnesium 1.6 mg/dL (reference 1.7–2.2 mg/dL), phosphorus 3.8 mg/dL." }
    ],
    excludedValues: [
      { label: "creatinine", value: "0.9", reason: "prior", sourceSpan: "Sodium 148 mEq/L, potassium 3.1 mEq/L, chloride 96 mEq/L, bicarbonate 30 mEq/L, BUN 38 mg/dL, creatinine 1.9 mg/dL (baseline 0.9 mg/dL), glucose 142 mg/dL, calcium 9.4 mg/dL, magnesium 1.6 mg/dL (reference 1.7–2.2 mg/dL), phosphorus 3.8 mg/dL." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "opus_case_lithium_toxicity_01/exhibit_stage2",
    lane: "extract",
    panel: [
      { label: "sodium", value: "146", sourceUnit: "mEq/L", sourceSpan: "Repeat labs at 1200: lithium 2.6 mEq/L, sodium 146 mEq/L, potassium 3.4 mEq/L, creatinine 1.8 mg/dL, BUN 34 mg/dL, eGFR 30 mL/min/1.73 m².", context: "post_intervention" },
      { label: "potassium", value: "3.4", sourceUnit: "mEq/L", sourceSpan: "Repeat labs at 1200: lithium 2.6 mEq/L, sodium 146 mEq/L, potassium 3.4 mEq/L, creatinine 1.8 mg/dL, BUN 34 mg/dL, eGFR 30 mL/min/1.73 m².", context: "post_intervention" },
      { label: "creatinine", value: "1.8", sourceUnit: "mg/dL", sourceSpan: "Repeat labs at 1200: lithium 2.6 mEq/L, sodium 146 mEq/L, potassium 3.4 mEq/L, creatinine 1.8 mg/dL, BUN 34 mg/dL, eGFR 30 mL/min/1.73 m².", context: "post_intervention" },
      { label: "bun", value: "34", sourceUnit: "mg/dL", sourceSpan: "Repeat labs at 1200: lithium 2.6 mEq/L, sodium 146 mEq/L, potassium 3.4 mEq/L, creatinine 1.8 mg/dL, BUN 34 mg/dL, eGFR 30 mL/min/1.73 m².", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_case_se_01/exhibit_baseline",
    lane: "skip_serial"
  },
  {
    exhibitRef: "opus_case_se_01/exhibit_stage_1",
    lane: "skip_serial"
  },
  {
    exhibitRef: "opus_case_se_01/exhibit_stage_2",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.9", sourceUnit: "°C", sourceSpan: "Updated vitals: T 38.9 °C, HR 148, BP 164/96, RR 24 (still irregular), SpO₂ 91% on NRB (dropping despite supplemental O₂)." },
      { label: "hr", value: "148", sourceUnit: "bpm", sourceSpan: "Updated vitals: T 38.9 °C, HR 148, BP 164/96, RR 24 (still irregular), SpO₂ 91% on NRB (dropping despite supplemental O₂)." },
      { label: "sbp", value: "164", sourceUnit: "mmHg", sourceSpan: "Updated vitals: T 38.9 °C, HR 148, BP 164/96, RR 24 (still irregular), SpO₂ 91% on NRB (dropping despite supplemental O₂)." },
      { label: "dbp", value: "96", sourceUnit: "mmHg", sourceSpan: "Updated vitals: T 38.9 °C, HR 148, BP 164/96, RR 24 (still irregular), SpO₂ 91% on NRB (dropping despite supplemental O₂)." },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "Updated vitals: T 38.9 °C, HR 148, BP 164/96, RR 24 (still irregular), SpO₂ 91% on NRB (dropping despite supplemental O₂)." },
      { label: "spo2", value: "91", sourceUnit: "%", sourceSpan: "Updated vitals: T 38.9 °C, HR 148, BP 164/96, RR 24 (still irregular), SpO₂ 91% on NRB (dropping despite supplemental O₂)." },
      { label: "lactate", value: "9.4", sourceUnit: "mmol/L", sourceSpan: "Repeat labs drawn at this point: lactate 9.4 mmol/L (rising), CK 1,220 U/L (rising significantly, raising concern for rhabdomyolysis), ABG pH 7.18, PaCO₂ 54 mmHg, PaO₂ 62 mmHg, bicarbonate 14 mEq/L." },
      { label: "ph", value: "7.18", sourceUnit: "(unitless)", sourceSpan: "Repeat labs drawn at this point: lactate 9.4 mmol/L (rising), CK 1,220 U/L (rising significantly, raising concern for rhabdomyolysis), ABG pH 7.18, PaCO₂ 54 mmHg, PaO₂ 62 mmHg, bicarbonate 14 mEq/L." },
      { label: "paco2", value: "54", sourceUnit: "mmHg", sourceSpan: "Repeat labs drawn at this point: lactate 9.4 mmol/L (rising), CK 1,220 U/L (rising significantly, raising concern for rhabdomyolysis), ABG pH 7.18, PaCO₂ 54 mmHg, PaO₂ 62 mmHg, bicarbonate 14 mEq/L." },
      { label: "pao2", value: "62", sourceUnit: "mmHg", sourceSpan: "Repeat labs drawn at this point: lactate 9.4 mmol/L (rising), CK 1,220 U/L (rising significantly, raising concern for rhabdomyolysis), ABG pH 7.18, PaCO₂ 54 mmHg, PaO₂ 62 mmHg, bicarbonate 14 mEq/L." },
      { label: "hco3_abg", value: "14", sourceUnit: "mEq/L", sourceSpan: "Repeat labs drawn at this point: lactate 9.4 mmol/L (rising), CK 1,220 U/L (rising significantly, raising concern for rhabdomyolysis), ABG pH 7.18, PaCO₂ 54 mmHg, PaO₂ 62 mmHg, bicarbonate 14 mEq/L." },
      { label: "potassium", value: "5.1", sourceUnit: "mEq/L", sourceSpan: "Potassium 5.1 mEq/L (rising from muscle breakdown)." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_case_se_01/exhibit_stage_3",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.4", sourceUnit: "°C", sourceSpan: "Post-intubation vitals begin to stabilize: T 38.4 °C (trending down with cooling measures), HR 112, BP 128/78 (now on vasopressor-free arterial-line monitoring), RR set at 16 on the ventilator, SpO₂ 99% on FiO₂ 60%.", context: "post_intervention" },
      { label: "hr", value: "112", sourceUnit: "bpm", sourceSpan: "Post-intubation vitals begin to stabilize: T 38.4 °C (trending down with cooling measures), HR 112, BP 128/78 (now on vasopressor-free arterial-line monitoring), RR set at 16 on the ventilator, SpO₂ 99% on FiO₂ 60%.", context: "post_intervention" },
      { label: "sbp", value: "128", sourceUnit: "mmHg", sourceSpan: "Post-intubation vitals begin to stabilize: T 38.4 °C (trending down with cooling measures), HR 112, BP 128/78 (now on vasopressor-free arterial-line monitoring), RR set at 16 on the ventilator, SpO₂ 99% on FiO₂ 60%.", context: "post_intervention" },
      { label: "dbp", value: "78", sourceUnit: "mmHg", sourceSpan: "Post-intubation vitals begin to stabilize: T 38.4 °C (trending down with cooling measures), HR 112, BP 128/78 (now on vasopressor-free arterial-line monitoring), RR set at 16 on the ventilator, SpO₂ 99% on FiO₂ 60%.", context: "post_intervention" },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Post-intubation vitals begin to stabilize: T 38.4 °C (trending down with cooling measures), HR 112, BP 128/78 (now on vasopressor-free arterial-line monitoring), RR set at 16 on the ventilator, SpO₂ 99% on FiO₂ 60%.", context: "post_intervention" },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "Post-intubation vitals begin to stabilize: T 38.4 °C (trending down with cooling measures), HR 112, BP 128/78 (now on vasopressor-free arterial-line monitoring), RR set at 16 on the ventilator, SpO₂ 99% on FiO₂ 60%.", context: "post_intervention" },
      { label: "lactate", value: "5.2", sourceUnit: "mmol/L", sourceSpan: "Repeat labs at the one-hour ICU mark: lactate 5.2 mmol/L (falling), CK 2,800 U/L (still rising but expected to peak and then fall), potassium 5.3 mEq/L (stable, being monitored closely), creatinine 1.1 mg/dL (slight rise), ABG pH 7.30, PaCO₂ 38 mmHg (improved with mechanical ventilation), PaO₂ 142 mmHg (on FiO₂ 60%), bicarbonate 18 mEq/L (improving).", context: "post_intervention" },
      { label: "potassium", value: "5.3", sourceUnit: "mEq/L", sourceSpan: "Repeat labs at the one-hour ICU mark: lactate 5.2 mmol/L (falling), CK 2,800 U/L (still rising but expected to peak and then fall), potassium 5.3 mEq/L (stable, being monitored closely), creatinine 1.1 mg/dL (slight rise), ABG pH 7.30, PaCO₂ 38 mmHg (improved with mechanical ventilation), PaO₂ 142 mmHg (on FiO₂ 60%), bicarbonate 18 mEq/L (improving).", context: "post_intervention" },
      { label: "creatinine", value: "1.1", sourceUnit: "mg/dL", sourceSpan: "Repeat labs at the one-hour ICU mark: lactate 5.2 mmol/L (falling), CK 2,800 U/L (still rising but expected to peak and then fall), potassium 5.3 mEq/L (stable, being monitored closely), creatinine 1.1 mg/dL (slight rise), ABG pH 7.30, PaCO₂ 38 mmHg (improved with mechanical ventilation), PaO₂ 142 mmHg (on FiO₂ 60%), bicarbonate 18 mEq/L (improving).", context: "post_intervention" },
      { label: "ph", value: "7.30", sourceUnit: "(unitless)", sourceSpan: "Repeat labs at the one-hour ICU mark: lactate 5.2 mmol/L (falling), CK 2,800 U/L (still rising but expected to peak and then fall), potassium 5.3 mEq/L (stable, being monitored closely), creatinine 1.1 mg/dL (slight rise), ABG pH 7.30, PaCO₂ 38 mmHg (improved with mechanical ventilation), PaO₂ 142 mmHg (on FiO₂ 60%), bicarbonate 18 mEq/L (improving).", context: "post_intervention" },
      { label: "paco2", value: "38", sourceUnit: "mmHg", sourceSpan: "Repeat labs at the one-hour ICU mark: lactate 5.2 mmol/L (falling), CK 2,800 U/L (still rising but expected to peak and then fall), potassium 5.3 mEq/L (stable, being monitored closely), creatinine 1.1 mg/dL (slight rise), ABG pH 7.30, PaCO₂ 38 mmHg (improved with mechanical ventilation), PaO₂ 142 mmHg (on FiO₂ 60%), bicarbonate 18 mEq/L (improving).", context: "post_intervention" },
      { label: "pao2", value: "142", sourceUnit: "mmHg", sourceSpan: "Repeat labs at the one-hour ICU mark: lactate 5.2 mmol/L (falling), CK 2,800 U/L (still rising but expected to peak and then fall), potassium 5.3 mEq/L (stable, being monitored closely), creatinine 1.1 mg/dL (slight rise), ABG pH 7.30, PaCO₂ 38 mmHg (improved with mechanical ventilation), PaO₂ 142 mmHg (on FiO₂ 60%), bicarbonate 18 mEq/L (improving).", context: "post_intervention" },
      { label: "hco3_abg", value: "18", sourceUnit: "mEq/L", sourceSpan: "Repeat labs at the one-hour ICU mark: lactate 5.2 mmol/L (falling), CK 2,800 U/L (still rising but expected to peak and then fall), potassium 5.3 mEq/L (stable, being monitored closely), creatinine 1.1 mg/dL (slight rise), ABG pH 7.30, PaCO₂ 38 mmHg (improved with mechanical ventilation), PaO₂ 142 mmHg (on FiO₂ 60%), bicarbonate 18 mEq/L (improving).", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  }
];

const batch16Records: ExtractionRecord[] = [
  {
    exhibitRef: "opus_icit_case_01/opus_icit_exhibit_baseline",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.1", sourceUnit: "°C", sourceSpan: "Baseline assessment on arrival: temperature 37.1 °C, heart rate 102 and regular, blood pressure 118/74, respiratory rate 20, SpO₂ 96% on room air." },
      { label: "hr", value: "102", sourceUnit: "bpm", sourceSpan: "Baseline assessment on arrival: temperature 37.1 °C, heart rate 102 and regular, blood pressure 118/74, respiratory rate 20, SpO₂ 96% on room air." },
      { label: "sbp", value: "118", sourceUnit: "mmHg", sourceSpan: "Baseline assessment on arrival: temperature 37.1 °C, heart rate 102 and regular, blood pressure 118/74, respiratory rate 20, SpO₂ 96% on room air." },
      { label: "dbp", value: "74", sourceUnit: "mmHg", sourceSpan: "Baseline assessment on arrival: temperature 37.1 °C, heart rate 102 and regular, blood pressure 118/74, respiratory rate 20, SpO₂ 96% on room air." },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "Baseline assessment on arrival: temperature 37.1 °C, heart rate 102 and regular, blood pressure 118/74, respiratory rate 20, SpO₂ 96% on room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Baseline assessment on arrival: temperature 37.1 °C, heart rate 102 and regular, blood pressure 118/74, respiratory rate 20, SpO₂ 96% on room air." },
      { label: "wbc", value: "7.2", sourceUnit: "× 10³/µL", sourceSpan: "Baseline labs drawn this morning: WBC 7.2 × 10³/µL (differential: neutrophils 68%, lymphocytes 18%, monocytes 10%, eosinophils 4%), hemoglobin 11.8 g/dL, platelets 198 × 10³/µL, sodium 139 mEq/L, potassium 4.3 mEq/L, chloride 101 mEq/L, bicarbonate 24 mEq/L, BUN 16 mg/dL, creatinine 0.9 mg/dL, glucose 104 mg/dL, AST 88 U/L (normal up to 35), ALT 112 U/L (normal up to 40), alkaline phosphatase 95 U/L, total bilirubin 1.0 mg/dL, troponin I 0.18 ng/mL (normal < 0.04), BNP 245 pg/mL (normal < 100), CRP 3.8 mg/dL (normal < 0.5), TSH 2.1 mIU/L, LDH 310 U/L." },
      { label: "hemoglobin", value: "11.8", sourceUnit: "g/dL", sourceSpan: "Baseline labs drawn this morning: WBC 7.2 × 10³/µL (differential: neutrophils 68%, lymphocytes 18%, monocytes 10%, eosinophils 4%), hemoglobin 11.8 g/dL, platelets 198 × 10³/µL, sodium 139 mEq/L, potassium 4.3 mEq/L, chloride 101 mEq/L, bicarbonate 24 mEq/L, BUN 16 mg/dL, creatinine 0.9 mg/dL, glucose 104 mg/dL, AST 88 U/L (normal up to 35), ALT 112 U/L (normal up to 40), alkaline phosphatase 95 U/L, total bilirubin 1.0 mg/dL, troponin I 0.18 ng/mL (normal < 0.04), BNP 245 pg/mL (normal < 100), CRP 3.8 mg/dL (normal < 0.5), TSH 2.1 mIU/L, LDH 310 U/L." },
      { label: "platelets", value: "198", sourceUnit: "× 10³/µL", sourceSpan: "Baseline labs drawn this morning: WBC 7.2 × 10³/µL (differential: neutrophils 68%, lymphocytes 18%, monocytes 10%, eosinophils 4%), hemoglobin 11.8 g/dL, platelets 198 × 10³/µL, sodium 139 mEq/L, potassium 4.3 mEq/L, chloride 101 mEq/L, bicarbonate 24 mEq/L, BUN 16 mg/dL, creatinine 0.9 mg/dL, glucose 104 mg/dL, AST 88 U/L (normal up to 35), ALT 112 U/L (normal up to 40), alkaline phosphatase 95 U/L, total bilirubin 1.0 mg/dL, troponin I 0.18 ng/mL (normal < 0.04), BNP 245 pg/mL (normal < 100), CRP 3.8 mg/dL (normal < 0.5), TSH 2.1 mIU/L, LDH 310 U/L." },
      { label: "sodium", value: "139", sourceUnit: "mEq/L", sourceSpan: "Baseline labs drawn this morning: WBC 7.2 × 10³/µL (differential: neutrophils 68%, lymphocytes 18%, monocytes 10%, eosinophils 4%), hemoglobin 11.8 g/dL, platelets 198 × 10³/µL, sodium 139 mEq/L, potassium 4.3 mEq/L, chloride 101 mEq/L, bicarbonate 24 mEq/L, BUN 16 mg/dL, creatinine 0.9 mg/dL, glucose 104 mg/dL, AST 88 U/L (normal up to 35), ALT 112 U/L (normal up to 40), alkaline phosphatase 95 U/L, total bilirubin 1.0 mg/dL, troponin I 0.18 ng/mL (normal < 0.04), BNP 245 pg/mL (normal < 100), CRP 3.8 mg/dL (normal < 0.5), TSH 2.1 mIU/L, LDH 310 U/L." },
      { label: "potassium", value: "4.3", sourceUnit: "mEq/L", sourceSpan: "Baseline labs drawn this morning: WBC 7.2 × 10³/µL (differential: neutrophils 68%, lymphocytes 18%, monocytes 10%, eosinophils 4%), hemoglobin 11.8 g/dL, platelets 198 × 10³/µL, sodium 139 mEq/L, potassium 4.3 mEq/L, chloride 101 mEq/L, bicarbonate 24 mEq/L, BUN 16 mg/dL, creatinine 0.9 mg/dL, glucose 104 mg/dL, AST 88 U/L (normal up to 35), ALT 112 U/L (normal up to 40), alkaline phosphatase 95 U/L, total bilirubin 1.0 mg/dL, troponin I 0.18 ng/mL (normal < 0.04), BNP 245 pg/mL (normal < 100), CRP 3.8 mg/dL (normal < 0.5), TSH 2.1 mIU/L, LDH 310 U/L." },
      { label: "chloride", value: "101", sourceUnit: "mEq/L", sourceSpan: "Baseline labs drawn this morning: WBC 7.2 × 10³/µL (differential: neutrophils 68%, lymphocytes 18%, monocytes 10%, eosinophils 4%), hemoglobin 11.8 g/dL, platelets 198 × 10³/µL, sodium 139 mEq/L, potassium 4.3 mEq/L, chloride 101 mEq/L, bicarbonate 24 mEq/L, BUN 16 mg/dL, creatinine 0.9 mg/dL, glucose 104 mg/dL, AST 88 U/L (normal up to 35), ALT 112 U/L (normal up to 40), alkaline phosphatase 95 U/L, total bilirubin 1.0 mg/dL, troponin I 0.18 ng/mL (normal < 0.04), BNP 245 pg/mL (normal < 100), CRP 3.8 mg/dL (normal < 0.5), TSH 2.1 mIU/L, LDH 310 U/L." },
      { label: "bicarbonate", value: "24", sourceUnit: "mEq/L", sourceSpan: "Baseline labs drawn this morning: WBC 7.2 × 10³/µL (differential: neutrophils 68%, lymphocytes 18%, monocytes 10%, eosinophils 4%), hemoglobin 11.8 g/dL, platelets 198 × 10³/µL, sodium 139 mEq/L, potassium 4.3 mEq/L, chloride 101 mEq/L, bicarbonate 24 mEq/L, BUN 16 mg/dL, creatinine 0.9 mg/dL, glucose 104 mg/dL, AST 88 U/L (normal up to 35), ALT 112 U/L (normal up to 40), alkaline phosphatase 95 U/L, total bilirubin 1.0 mg/dL, troponin I 0.18 ng/mL (normal < 0.04), BNP 245 pg/mL (normal < 100), CRP 3.8 mg/dL (normal < 0.5), TSH 2.1 mIU/L, LDH 310 U/L." },
      { label: "bun", value: "16", sourceUnit: "mg/dL", sourceSpan: "Baseline labs drawn this morning: WBC 7.2 × 10³/µL (differential: neutrophils 68%, lymphocytes 18%, monocytes 10%, eosinophils 4%), hemoglobin 11.8 g/dL, platelets 198 × 10³/µL, sodium 139 mEq/L, potassium 4.3 mEq/L, chloride 101 mEq/L, bicarbonate 24 mEq/L, BUN 16 mg/dL, creatinine 0.9 mg/dL, glucose 104 mg/dL, AST 88 U/L (normal up to 35), ALT 112 U/L (normal up to 40), alkaline phosphatase 95 U/L, total bilirubin 1.0 mg/dL, troponin I 0.18 ng/mL (normal < 0.04), BNP 245 pg/mL (normal < 100), CRP 3.8 mg/dL (normal < 0.5), TSH 2.1 mIU/L, LDH 310 U/L." },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "Baseline labs drawn this morning: WBC 7.2 × 10³/µL (differential: neutrophils 68%, lymphocytes 18%, monocytes 10%, eosinophils 4%), hemoglobin 11.8 g/dL, platelets 198 × 10³/µL, sodium 139 mEq/L, potassium 4.3 mEq/L, chloride 101 mEq/L, bicarbonate 24 mEq/L, BUN 16 mg/dL, creatinine 0.9 mg/dL, glucose 104 mg/dL, AST 88 U/L (normal up to 35), ALT 112 U/L (normal up to 40), alkaline phosphatase 95 U/L, total bilirubin 1.0 mg/dL, troponin I 0.18 ng/mL (normal < 0.04), BNP 245 pg/mL (normal < 100), CRP 3.8 mg/dL (normal < 0.5), TSH 2.1 mIU/L, LDH 310 U/L." },
      { label: "glucose", value: "104", sourceUnit: "mg/dL", sourceSpan: "Baseline labs drawn this morning: WBC 7.2 × 10³/µL (differential: neutrophils 68%, lymphocytes 18%, monocytes 10%, eosinophils 4%), hemoglobin 11.8 g/dL, platelets 198 × 10³/µL, sodium 139 mEq/L, potassium 4.3 mEq/L, chloride 101 mEq/L, bicarbonate 24 mEq/L, BUN 16 mg/dL, creatinine 0.9 mg/dL, glucose 104 mg/dL, AST 88 U/L (normal up to 35), ALT 112 U/L (normal up to 40), alkaline phosphatase 95 U/L, total bilirubin 1.0 mg/dL, troponin I 0.18 ng/mL (normal < 0.04), BNP 245 pg/mL (normal < 100), CRP 3.8 mg/dL (normal < 0.5), TSH 2.1 mIU/L, LDH 310 U/L." },
      { label: "ast", value: "88", sourceUnit: "U/L", sourceSpan: "Baseline labs drawn this morning: WBC 7.2 × 10³/µL (differential: neutrophils 68%, lymphocytes 18%, monocytes 10%, eosinophils 4%), hemoglobin 11.8 g/dL, platelets 198 × 10³/µL, sodium 139 mEq/L, potassium 4.3 mEq/L, chloride 101 mEq/L, bicarbonate 24 mEq/L, BUN 16 mg/dL, creatinine 0.9 mg/dL, glucose 104 mg/dL, AST 88 U/L (normal up to 35), ALT 112 U/L (normal up to 40), alkaline phosphatase 95 U/L, total bilirubin 1.0 mg/dL, troponin I 0.18 ng/mL (normal < 0.04), BNP 245 pg/mL (normal < 100), CRP 3.8 mg/dL (normal < 0.5), TSH 2.1 mIU/L, LDH 310 U/L." },
      { label: "alt", value: "112", sourceUnit: "U/L", sourceSpan: "Baseline labs drawn this morning: WBC 7.2 × 10³/µL (differential: neutrophils 68%, lymphocytes 18%, monocytes 10%, eosinophils 4%), hemoglobin 11.8 g/dL, platelets 198 × 10³/µL, sodium 139 mEq/L, potassium 4.3 mEq/L, chloride 101 mEq/L, bicarbonate 24 mEq/L, BUN 16 mg/dL, creatinine 0.9 mg/dL, glucose 104 mg/dL, AST 88 U/L (normal up to 35), ALT 112 U/L (normal up to 40), alkaline phosphatase 95 U/L, total bilirubin 1.0 mg/dL, troponin I 0.18 ng/mL (normal < 0.04), BNP 245 pg/mL (normal < 100), CRP 3.8 mg/dL (normal < 0.5), TSH 2.1 mIU/L, LDH 310 U/L." },
      { label: "total_bilirubin", value: "1.0", sourceUnit: "mg/dL", sourceSpan: "Baseline labs drawn this morning: WBC 7.2 × 10³/µL (differential: neutrophils 68%, lymphocytes 18%, monocytes 10%, eosinophils 4%), hemoglobin 11.8 g/dL, platelets 198 × 10³/µL, sodium 139 mEq/L, potassium 4.3 mEq/L, chloride 101 mEq/L, bicarbonate 24 mEq/L, BUN 16 mg/dL, creatinine 0.9 mg/dL, glucose 104 mg/dL, AST 88 U/L (normal up to 35), ALT 112 U/L (normal up to 40), alkaline phosphatase 95 U/L, total bilirubin 1.0 mg/dL, troponin I 0.18 ng/mL (normal < 0.04), BNP 245 pg/mL (normal < 100), CRP 3.8 mg/dL (normal < 0.5), TSH 2.1 mIU/L, LDH 310 U/L." },
      { label: "troponin_t", value: "0.18", sourceUnit: "ng/mL", sourceSpan: "Baseline labs drawn this morning: WBC 7.2 × 10³/µL (differential: neutrophils 68%, lymphocytes 18%, monocytes 10%, eosinophils 4%), hemoglobin 11.8 g/dL, platelets 198 × 10³/µL, sodium 139 mEq/L, potassium 4.3 mEq/L, chloride 101 mEq/L, bicarbonate 24 mEq/L, BUN 16 mg/dL, creatinine 0.9 mg/dL, glucose 104 mg/dL, AST 88 U/L (normal up to 35), ALT 112 U/L (normal up to 40), alkaline phosphatase 95 U/L, total bilirubin 1.0 mg/dL, troponin I 0.18 ng/mL (normal < 0.04), BNP 245 pg/mL (normal < 100), CRP 3.8 mg/dL (normal < 0.5), TSH 2.1 mIU/L, LDH 310 U/L." },
      { label: "bnp", value: "245", sourceUnit: "pg/mL", sourceSpan: "Baseline labs drawn this morning: WBC 7.2 × 10³/µL (differential: neutrophils 68%, lymphocytes 18%, monocytes 10%, eosinophils 4%), hemoglobin 11.8 g/dL, platelets 198 × 10³/µL, sodium 139 mEq/L, potassium 4.3 mEq/L, chloride 101 mEq/L, bicarbonate 24 mEq/L, BUN 16 mg/dL, creatinine 0.9 mg/dL, glucose 104 mg/dL, AST 88 U/L (normal up to 35), ALT 112 U/L (normal up to 40), alkaline phosphatase 95 U/L, total bilirubin 1.0 mg/dL, troponin I 0.18 ng/mL (normal < 0.04), BNP 245 pg/mL (normal < 100), CRP 3.8 mg/dL (normal < 0.5), TSH 2.1 mIU/L, LDH 310 U/L." }
    ],
    excludedValues: [],
    unitAliases: [
      { aliasOf: "wbc", value: "7.2 × 10³/µL" },
      { aliasOf: "platelets", value: "198 × 10³/µL" }
    ]
  },
  {
    exhibitRef: "opus_icit_case_01/opus_icit_exhibit_stage_1",
    lane: "skip_serial"
  },
  {
    exhibitRef: "opus_icit_case_01/opus_icit_exhibit_stage_2",
    lane: "extract",
    panel: [
      { label: "troponin_t", value: "1.42", sourceUnit: "ng/mL", sourceSpan: "Repeat labs: troponin I 1.42 ng/mL (rising sharply from 0.18), BNP 580 pg/mL, AST 156 U/L, ALT 189 U/L, total bilirubin 1.4 mg/dL, CRP 7.2 mg/dL, creatinine 1.0 mg/dL." },
      { label: "bnp", value: "580", sourceUnit: "pg/mL", sourceSpan: "Repeat labs: troponin I 1.42 ng/mL (rising sharply from 0.18), BNP 580 pg/mL, AST 156 U/L, ALT 189 U/L, total bilirubin 1.4 mg/dL, CRP 7.2 mg/dL, creatinine 1.0 mg/dL." },
      { label: "ast", value: "156", sourceUnit: "U/L", sourceSpan: "Repeat labs: troponin I 1.42 ng/mL (rising sharply from 0.18), BNP 580 pg/mL, AST 156 U/L, ALT 189 U/L, total bilirubin 1.4 mg/dL, CRP 7.2 mg/dL, creatinine 1.0 mg/dL." },
      { label: "alt", value: "189", sourceUnit: "U/L", sourceSpan: "Repeat labs: troponin I 1.42 ng/mL (rising sharply from 0.18), BNP 580 pg/mL, AST 156 U/L, ALT 189 U/L, total bilirubin 1.4 mg/dL, CRP 7.2 mg/dL, creatinine 1.0 mg/dL." },
      { label: "total_bilirubin", value: "1.4", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: troponin I 1.42 ng/mL (rising sharply from 0.18), BNP 580 pg/mL, AST 156 U/L, ALT 189 U/L, total bilirubin 1.4 mg/dL, CRP 7.2 mg/dL, creatinine 1.0 mg/dL." },
      { label: "creatinine", value: "1.0", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: troponin I 1.42 ng/mL (rising sharply from 0.18), BNP 580 pg/mL, AST 156 U/L, ALT 189 U/L, total bilirubin 1.4 mg/dL, CRP 7.2 mg/dL, creatinine 1.0 mg/dL." },
      { label: "temp", value: "37.3", sourceUnit: "°C", sourceSpan: "Vital signs: T 37.3 °C, HR 112 (irregular due to PVCs), BP 104/66, RR 24, SpO₂ 93% on room air." },
      { label: "hr", value: "112", sourceUnit: "bpm", sourceSpan: "Vital signs: T 37.3 °C, HR 112 (irregular due to PVCs), BP 104/66, RR 24, SpO₂ 93% on room air." },
      { label: "sbp", value: "104", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.3 °C, HR 112 (irregular due to PVCs), BP 104/66, RR 24, SpO₂ 93% on room air." },
      { label: "dbp", value: "66", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.3 °C, HR 112 (irregular due to PVCs), BP 104/66, RR 24, SpO₂ 93% on room air." },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "Vital signs: T 37.3 °C, HR 112 (irregular due to PVCs), BP 104/66, RR 24, SpO₂ 93% on room air." },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "The nurse administers the first dose of methylprednisolone and titrates oxygen to 3 L/min via nasal cannula, achieving SpO₂ 95%.", context: "post_intervention" }
    ],
    excludedValues: [
      { label: "troponin_t", value: "0.18", reason: "trend", sourceSpan: "Repeat labs: troponin I 1.42 ng/mL (rising sharply from 0.18), BNP 580 pg/mL, AST 156 U/L, ALT 189 U/L, total bilirubin 1.4 mg/dL, CRP 7.2 mg/dL, creatinine 1.0 mg/dL." },
      { label: "spo2", value: "93", reason: "prior", sourceSpan: "Vital signs: T 37.3 °C, HR 112 (irregular due to PVCs), BP 104/66, RR 24, SpO₂ 93% on room air." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "opus_icit_case_01/opus_icit_exhibit_stage_3",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.0", sourceUnit: "°C", sourceSpan: "Repeat vital signs: T 37.0 °C, HR 94 and regular, BP 114/72, RR 18, SpO₂ 96% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "hr", value: "94", sourceUnit: "bpm", sourceSpan: "Repeat vital signs: T 37.0 °C, HR 94 and regular, BP 114/72, RR 18, SpO₂ 96% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "sbp", value: "114", sourceUnit: "mmHg", sourceSpan: "Repeat vital signs: T 37.0 °C, HR 94 and regular, BP 114/72, RR 18, SpO₂ 96% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "dbp", value: "72", sourceUnit: "mmHg", sourceSpan: "Repeat vital signs: T 37.0 °C, HR 94 and regular, BP 114/72, RR 18, SpO₂ 96% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Repeat vital signs: T 37.0 °C, HR 94 and regular, BP 114/72, RR 18, SpO₂ 96% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Repeat vital signs: T 37.0 °C, HR 94 and regular, BP 114/72, RR 18, SpO₂ 96% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "troponin_t", value: "0.64", sourceUnit: "ng/mL", sourceSpan: "Repeat labs: troponin I 0.64 ng/mL (declining from 1.42), BNP 390 pg/mL (declining), AST 132 U/L (declining), ALT 148 U/L (declining), total bilirubin 1.2 mg/dL, CRP 4.1 mg/dL, creatinine 0.9 mg/dL, CK 420 U/L (mildly elevated), blood glucose 218 mg/dL (new hyperglycemia attributed to high-dose corticosteroids).", context: "post_intervention" },
      { label: "bnp", value: "390", sourceUnit: "pg/mL", sourceSpan: "Repeat labs: troponin I 0.64 ng/mL (declining from 1.42), BNP 390 pg/mL (declining), AST 132 U/L (declining), ALT 148 U/L (declining), total bilirubin 1.2 mg/dL, CRP 4.1 mg/dL, creatinine 0.9 mg/dL, CK 420 U/L (mildly elevated), blood glucose 218 mg/dL (new hyperglycemia attributed to high-dose corticosteroids).", context: "post_intervention" },
      { label: "ast", value: "132", sourceUnit: "U/L", sourceSpan: "Repeat labs: troponin I 0.64 ng/mL (declining from 1.42), BNP 390 pg/mL (declining), AST 132 U/L (declining), ALT 148 U/L (declining), total bilirubin 1.2 mg/dL, CRP 4.1 mg/dL, creatinine 0.9 mg/dL, CK 420 U/L (mildly elevated), blood glucose 218 mg/dL (new hyperglycemia attributed to high-dose corticosteroids).", context: "post_intervention" },
      { label: "alt", value: "148", sourceUnit: "U/L", sourceSpan: "Repeat labs: troponin I 0.64 ng/mL (declining from 1.42), BNP 390 pg/mL (declining), AST 132 U/L (declining), ALT 148 U/L (declining), total bilirubin 1.2 mg/dL, CRP 4.1 mg/dL, creatinine 0.9 mg/dL, CK 420 U/L (mildly elevated), blood glucose 218 mg/dL (new hyperglycemia attributed to high-dose corticosteroids).", context: "post_intervention" },
      { label: "total_bilirubin", value: "1.2", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: troponin I 0.64 ng/mL (declining from 1.42), BNP 390 pg/mL (declining), AST 132 U/L (declining), ALT 148 U/L (declining), total bilirubin 1.2 mg/dL, CRP 4.1 mg/dL, creatinine 0.9 mg/dL, CK 420 U/L (mildly elevated), blood glucose 218 mg/dL (new hyperglycemia attributed to high-dose corticosteroids).", context: "post_intervention" },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: troponin I 0.64 ng/mL (declining from 1.42), BNP 390 pg/mL (declining), AST 132 U/L (declining), ALT 148 U/L (declining), total bilirubin 1.2 mg/dL, CRP 4.1 mg/dL, creatinine 0.9 mg/dL, CK 420 U/L (mildly elevated), blood glucose 218 mg/dL (new hyperglycemia attributed to high-dose corticosteroids).", context: "post_intervention" },
      { label: "glucose", value: "218", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: troponin I 0.64 ng/mL (declining from 1.42), BNP 390 pg/mL (declining), AST 132 U/L (declining), ALT 148 U/L (declining), total bilirubin 1.2 mg/dL, CRP 4.1 mg/dL, creatinine 0.9 mg/dL, CK 420 U/L (mildly elevated), blood glucose 218 mg/dL (new hyperglycemia attributed to high-dose corticosteroids).", context: "post_intervention" }
    ],
    excludedValues: [
      { label: "troponin_t", value: "1.42", reason: "trend", sourceSpan: "Repeat labs: troponin I 0.64 ng/mL (declining from 1.42), BNP 390 pg/mL (declining), AST 132 U/L (declining), ALT 148 U/L (declining), total bilirubin 1.2 mg/dL, CRP 4.1 mg/dL, creatinine 0.9 mg/dL, CK 420 U/L (mildly elevated), blood glucose 218 mg/dL (new hyperglycemia attributed to high-dose corticosteroids)." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "opus_scc_case_01/exh_baseline",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.1", sourceUnit: "°C", sourceSpan: "Baseline vital signs: temperature 37.1 °C, heart rate 92 beats per minute, blood pressure 138/82 mmHg, respiratory rate 18 breaths per minute, SpO₂ 96% on room air." },
      { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: "Baseline vital signs: temperature 37.1 °C, heart rate 92 beats per minute, blood pressure 138/82 mmHg, respiratory rate 18 breaths per minute, SpO₂ 96% on room air." },
      { label: "sbp", value: "138", sourceUnit: "mmHg", sourceSpan: "Baseline vital signs: temperature 37.1 °C, heart rate 92 beats per minute, blood pressure 138/82 mmHg, respiratory rate 18 breaths per minute, SpO₂ 96% on room air." },
      { label: "dbp", value: "82", sourceUnit: "mmHg", sourceSpan: "Baseline vital signs: temperature 37.1 °C, heart rate 92 beats per minute, blood pressure 138/82 mmHg, respiratory rate 18 breaths per minute, SpO₂ 96% on room air." },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Baseline vital signs: temperature 37.1 °C, heart rate 92 beats per minute, blood pressure 138/82 mmHg, respiratory rate 18 breaths per minute, SpO₂ 96% on room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Baseline vital signs: temperature 37.1 °C, heart rate 92 beats per minute, blood pressure 138/82 mmHg, respiratory rate 18 breaths per minute, SpO₂ 96% on room air." },
      { label: "wbc", value: "6,800", sourceUnit: "/µL", sourceSpan: "Baseline labs: WBC 6,800/µL, hemoglobin 10.8 g/dL, platelets 188,000/µL, sodium 141 mEq/L, potassium 4.2 mEq/L, chloride 102 mEq/L, bicarbonate 24 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, calcium (corrected) 10.1 mg/dL, albumin 3.2 g/dL, alkaline phosphatase 312 U/L (elevated, consistent with bone metastases), ALT 28 U/L, AST 32 U/L, glucose 118 mg/dL, PT/INR 1.0, aPTT 29 seconds." },
      { label: "hemoglobin", value: "10.8", sourceUnit: "g/dL", sourceSpan: "Baseline labs: WBC 6,800/µL, hemoglobin 10.8 g/dL, platelets 188,000/µL, sodium 141 mEq/L, potassium 4.2 mEq/L, chloride 102 mEq/L, bicarbonate 24 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, calcium (corrected) 10.1 mg/dL, albumin 3.2 g/dL, alkaline phosphatase 312 U/L (elevated, consistent with bone metastases), ALT 28 U/L, AST 32 U/L, glucose 118 mg/dL, PT/INR 1.0, aPTT 29 seconds." },
      { label: "platelets", value: "188,000", sourceUnit: "/µL", sourceSpan: "Baseline labs: WBC 6,800/µL, hemoglobin 10.8 g/dL, platelets 188,000/µL, sodium 141 mEq/L, potassium 4.2 mEq/L, chloride 102 mEq/L, bicarbonate 24 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, calcium (corrected) 10.1 mg/dL, albumin 3.2 g/dL, alkaline phosphatase 312 U/L (elevated, consistent with bone metastases), ALT 28 U/L, AST 32 U/L, glucose 118 mg/dL, PT/INR 1.0, aPTT 29 seconds." },
      { label: "sodium", value: "141", sourceUnit: "mEq/L", sourceSpan: "Baseline labs: WBC 6,800/µL, hemoglobin 10.8 g/dL, platelets 188,000/µL, sodium 141 mEq/L, potassium 4.2 mEq/L, chloride 102 mEq/L, bicarbonate 24 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, calcium (corrected) 10.1 mg/dL, albumin 3.2 g/dL, alkaline phosphatase 312 U/L (elevated, consistent with bone metastases), ALT 28 U/L, AST 32 U/L, glucose 118 mg/dL, PT/INR 1.0, aPTT 29 seconds." },
      { label: "potassium", value: "4.2", sourceUnit: "mEq/L", sourceSpan: "Baseline labs: WBC 6,800/µL, hemoglobin 10.8 g/dL, platelets 188,000/µL, sodium 141 mEq/L, potassium 4.2 mEq/L, chloride 102 mEq/L, bicarbonate 24 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, calcium (corrected) 10.1 mg/dL, albumin 3.2 g/dL, alkaline phosphatase 312 U/L (elevated, consistent with bone metastases), ALT 28 U/L, AST 32 U/L, glucose 118 mg/dL, PT/INR 1.0, aPTT 29 seconds." },
      { label: "chloride", value: "102", sourceUnit: "mEq/L", sourceSpan: "Baseline labs: WBC 6,800/µL, hemoglobin 10.8 g/dL, platelets 188,000/µL, sodium 141 mEq/L, potassium 4.2 mEq/L, chloride 102 mEq/L, bicarbonate 24 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, calcium (corrected) 10.1 mg/dL, albumin 3.2 g/dL, alkaline phosphatase 312 U/L (elevated, consistent with bone metastases), ALT 28 U/L, AST 32 U/L, glucose 118 mg/dL, PT/INR 1.0, aPTT 29 seconds." },
      { label: "bicarbonate", value: "24", sourceUnit: "mEq/L", sourceSpan: "Baseline labs: WBC 6,800/µL, hemoglobin 10.8 g/dL, platelets 188,000/µL, sodium 141 mEq/L, potassium 4.2 mEq/L, chloride 102 mEq/L, bicarbonate 24 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, calcium (corrected) 10.1 mg/dL, albumin 3.2 g/dL, alkaline phosphatase 312 U/L (elevated, consistent with bone metastases), ALT 28 U/L, AST 32 U/L, glucose 118 mg/dL, PT/INR 1.0, aPTT 29 seconds." },
      { label: "bun", value: "18", sourceUnit: "mg/dL", sourceSpan: "Baseline labs: WBC 6,800/µL, hemoglobin 10.8 g/dL, platelets 188,000/µL, sodium 141 mEq/L, potassium 4.2 mEq/L, chloride 102 mEq/L, bicarbonate 24 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, calcium (corrected) 10.1 mg/dL, albumin 3.2 g/dL, alkaline phosphatase 312 U/L (elevated, consistent with bone metastases), ALT 28 U/L, AST 32 U/L, glucose 118 mg/dL, PT/INR 1.0, aPTT 29 seconds." },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "Baseline labs: WBC 6,800/µL, hemoglobin 10.8 g/dL, platelets 188,000/µL, sodium 141 mEq/L, potassium 4.2 mEq/L, chloride 102 mEq/L, bicarbonate 24 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, calcium (corrected) 10.1 mg/dL, albumin 3.2 g/dL, alkaline phosphatase 312 U/L (elevated, consistent with bone metastases), ALT 28 U/L, AST 32 U/L, glucose 118 mg/dL, PT/INR 1.0, aPTT 29 seconds." },
      { label: "calcium", value: "10.1", sourceUnit: "mg/dL", sourceSpan: "Baseline labs: WBC 6,800/µL, hemoglobin 10.8 g/dL, platelets 188,000/µL, sodium 141 mEq/L, potassium 4.2 mEq/L, chloride 102 mEq/L, bicarbonate 24 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, calcium (corrected) 10.1 mg/dL, albumin 3.2 g/dL, alkaline phosphatase 312 U/L (elevated, consistent with bone metastases), ALT 28 U/L, AST 32 U/L, glucose 118 mg/dL, PT/INR 1.0, aPTT 29 seconds." },
      { label: "alt", value: "28", sourceUnit: "U/L", sourceSpan: "Baseline labs: WBC 6,800/µL, hemoglobin 10.8 g/dL, platelets 188,000/µL, sodium 141 mEq/L, potassium 4.2 mEq/L, chloride 102 mEq/L, bicarbonate 24 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, calcium (corrected) 10.1 mg/dL, albumin 3.2 g/dL, alkaline phosphatase 312 U/L (elevated, consistent with bone metastases), ALT 28 U/L, AST 32 U/L, glucose 118 mg/dL, PT/INR 1.0, aPTT 29 seconds." },
      { label: "ast", value: "32", sourceUnit: "U/L", sourceSpan: "Baseline labs: WBC 6,800/µL, hemoglobin 10.8 g/dL, platelets 188,000/µL, sodium 141 mEq/L, potassium 4.2 mEq/L, chloride 102 mEq/L, bicarbonate 24 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, calcium (corrected) 10.1 mg/dL, albumin 3.2 g/dL, alkaline phosphatase 312 U/L (elevated, consistent with bone metastases), ALT 28 U/L, AST 32 U/L, glucose 118 mg/dL, PT/INR 1.0, aPTT 29 seconds." },
      { label: "glucose", value: "118", sourceUnit: "mg/dL", sourceSpan: "Baseline labs: WBC 6,800/µL, hemoglobin 10.8 g/dL, platelets 188,000/µL, sodium 141 mEq/L, potassium 4.2 mEq/L, chloride 102 mEq/L, bicarbonate 24 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, calcium (corrected) 10.1 mg/dL, albumin 3.2 g/dL, alkaline phosphatase 312 U/L (elevated, consistent with bone metastases), ALT 28 U/L, AST 32 U/L, glucose 118 mg/dL, PT/INR 1.0, aPTT 29 seconds." },
      { label: "inr", value: "1.0", sourceUnit: "(ratio)", sourceSpan: "Baseline labs: WBC 6,800/µL, hemoglobin 10.8 g/dL, platelets 188,000/µL, sodium 141 mEq/L, potassium 4.2 mEq/L, chloride 102 mEq/L, bicarbonate 24 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, calcium (corrected) 10.1 mg/dL, albumin 3.2 g/dL, alkaline phosphatase 312 U/L (elevated, consistent with bone metastases), ALT 28 U/L, AST 32 U/L, glucose 118 mg/dL, PT/INR 1.0, aPTT 29 seconds." },
      { label: "ptt", value: "29", sourceUnit: "seconds", sourceSpan: "Baseline labs: WBC 6,800/µL, hemoglobin 10.8 g/dL, platelets 188,000/µL, sodium 141 mEq/L, potassium 4.2 mEq/L, chloride 102 mEq/L, bicarbonate 24 mEq/L, BUN 18 mg/dL, creatinine 0.9 mg/dL, calcium (corrected) 10.1 mg/dL, albumin 3.2 g/dL, alkaline phosphatase 312 U/L (elevated, consistent with bone metastases), ALT 28 U/L, AST 32 U/L, glucose 118 mg/dL, PT/INR 1.0, aPTT 29 seconds." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_scc_case_01/exh_stage2",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.6", sourceUnit: "°C", sourceSpan: "Vital signs: temperature 37.6 °C, heart rate 86 beats/min; lower than prior after improved pain control and reduced anxiety.", context: "post_intervention" },
      { label: "hr", value: "86", sourceUnit: "bpm", sourceSpan: "Vital signs: temperature 37.6 °C, heart rate 86 beats/min; lower than prior after improved pain control and reduced anxiety.", context: "post_intervention" },
      { label: "sbp", value: "136", sourceUnit: "mmHg", sourceSpan: "Blood pressure 136/80 mmHg, respiratory rate 18, SpO₂ 96% on room air.", context: "post_intervention" },
      { label: "dbp", value: "80", sourceUnit: "mmHg", sourceSpan: "Blood pressure 136/80 mmHg, respiratory rate 18, SpO₂ 96% on room air.", context: "post_intervention" },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Blood pressure 136/80 mmHg, respiratory rate 18, SpO₂ 96% on room air.", context: "post_intervention" },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Blood pressure 136/80 mmHg, respiratory rate 18, SpO₂ 96% on room air.", context: "post_intervention" },
      { label: "glucose", value: "186", sourceUnit: "mg/dL", sourceSpan: "Blood glucose check is 186 mg/dL (steroid-induced hyperglycemia).", context: "post_intervention" },
      { label: "calcium", value: "10.8", sourceUnit: "mg/dL", sourceSpan: "Repeat calcium (corrected) is 10.8 mg/dL — trending upward.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_scc_case_01/exh_stage3",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.8", sourceUnit: "°C", sourceSpan: "Vital signs: temperature 37.8 °C, heart rate 78, blood pressure 124/74, respiratory rate 16, SpO₂ 97% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "hr", value: "78", sourceUnit: "bpm", sourceSpan: "Vital signs: temperature 37.8 °C, heart rate 78, blood pressure 124/74, respiratory rate 16, SpO₂ 97% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "sbp", value: "124", sourceUnit: "mmHg", sourceSpan: "Vital signs: temperature 37.8 °C, heart rate 78, blood pressure 124/74, respiratory rate 16, SpO₂ 97% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "dbp", value: "74", sourceUnit: "mmHg", sourceSpan: "Vital signs: temperature 37.8 °C, heart rate 78, blood pressure 124/74, respiratory rate 16, SpO₂ 97% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Vital signs: temperature 37.8 °C, heart rate 78, blood pressure 124/74, respiratory rate 16, SpO₂ 97% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Vital signs: temperature 37.8 °C, heart rate 78, blood pressure 124/74, respiratory rate 16, SpO₂ 97% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "glucose", value: "210", sourceUnit: "mg/dL", sourceSpan: "Blood glucose is 210 mg/dL; a sliding-scale insulin order is in place.", context: "post_intervention" },
      { label: "hemoglobin", value: "9.6", sourceUnit: "g/dL", sourceSpan: "Repeat labs: hemoglobin 9.6 g/dL (dropped from 10.8, expected surgical loss), creatinine 0.9 mg/dL (stable), corrected calcium 10.4 mg/dL (slightly improved from 10.8, bisphosphonate and steroids helping), alkaline phosphatase 298 U/L (stable).", context: "post_intervention" },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: hemoglobin 9.6 g/dL (dropped from 10.8, expected surgical loss), creatinine 0.9 mg/dL (stable), corrected calcium 10.4 mg/dL (slightly improved from 10.8, bisphosphonate and steroids helping), alkaline phosphatase 298 U/L (stable).", context: "post_intervention" },
      { label: "calcium", value: "10.4", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: hemoglobin 9.6 g/dL (dropped from 10.8, expected surgical loss), creatinine 0.9 mg/dL (stable), corrected calcium 10.4 mg/dL (slightly improved from 10.8, bisphosphonate and steroids helping), alkaline phosphatase 298 U/L (stable).", context: "post_intervention" }
    ],
    excludedValues: [
      { label: "hemoglobin", value: "10.8", reason: "trend", sourceSpan: "Repeat labs: hemoglobin 9.6 g/dL (dropped from 10.8, expected surgical loss), creatinine 0.9 mg/dL (stable), corrected calcium 10.4 mg/dL (slightly improved from 10.8, bisphosphonate and steroids helping), alkaline phosphatase 298 U/L (stable)." },
      { label: "calcium", value: "10.8", reason: "trend", sourceSpan: "Repeat labs: hemoglobin 9.6 g/dL (dropped from 10.8, expected surgical loss), creatinine 0.9 mg/dL (stable), corrected calcium 10.4 mg/dL (slightly improved from 10.8, bisphosphonate and steroids helping), alkaline phosphatase 298 U/L (stable)." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "opus_tpn_case_mucositis_01/exhibit_baseline",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.9", sourceUnit: "°C", sourceSpan: "Baseline assessment at start of night shift: Temperature 38.9 °C (102.0 °F) orally (elevated from 37.2 °C twelve hours earlier), heart rate 112 and regular, blood pressure 96/58 (down from 118/72 earlier in the day), respiratory rate 22, SpO₂ 95% on room air." },
      { label: "hr", value: "112", sourceUnit: "bpm", sourceSpan: "Baseline assessment at start of night shift: Temperature 38.9 °C (102.0 °F) orally (elevated from 37.2 °C twelve hours earlier), heart rate 112 and regular, blood pressure 96/58 (down from 118/72 earlier in the day), respiratory rate 22, SpO₂ 95% on room air." },
      { label: "sbp", value: "96", sourceUnit: "mmHg", sourceSpan: "Baseline assessment at start of night shift: Temperature 38.9 °C (102.0 °F) orally (elevated from 37.2 °C twelve hours earlier), heart rate 112 and regular, blood pressure 96/58 (down from 118/72 earlier in the day), respiratory rate 22, SpO₂ 95% on room air." },
      { label: "dbp", value: "58", sourceUnit: "mmHg", sourceSpan: "Baseline assessment at start of night shift: Temperature 38.9 °C (102.0 °F) orally (elevated from 37.2 °C twelve hours earlier), heart rate 112 and regular, blood pressure 96/58 (down from 118/72 earlier in the day), respiratory rate 22, SpO₂ 95% on room air." },
      { label: "rr", value: "22", sourceUnit: "/min", sourceSpan: "Baseline assessment at start of night shift: Temperature 38.9 °C (102.0 °F) orally (elevated from 37.2 °C twelve hours earlier), heart rate 112 and regular, blood pressure 96/58 (down from 118/72 earlier in the day), respiratory rate 22, SpO₂ 95% on room air." },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "Baseline assessment at start of night shift: Temperature 38.9 °C (102.0 °F) orally (elevated from 37.2 °C twelve hours earlier), heart rate 112 and regular, blood pressure 96/58 (down from 118/72 earlier in the day), respiratory rate 22, SpO₂ 95% on room air." },
      { label: "wbc", value: "0.3", sourceUnit: "× 10³/µL", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." },
      { label: "hemoglobin", value: "7.8", sourceUnit: "g/dL", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." },
      { label: "platelets", value: "18,000", sourceUnit: "/µL", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." },
      { label: "bun", value: "32", sourceUnit: "mg/dL", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." },
      { label: "creatinine", value: "1.6", sourceUnit: "mg/dL", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." },
      { label: "sodium", value: "138", sourceUnit: "mEq/L", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." },
      { label: "potassium", value: "3.2", sourceUnit: "mEq/L", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." },
      { label: "chloride", value: "101", sourceUnit: "mEq/L", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." },
      { label: "bicarbonate", value: "22", sourceUnit: "mEq/L", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." },
      { label: "magnesium", value: "1.4", sourceUnit: "mg/dL", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." },
      { label: "phosphate", value: "2.8", sourceUnit: "mg/dL", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." },
      { label: "calcium", value: "8.0", sourceUnit: "mg/dL", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." },
      { label: "glucose", value: "268", sourceUnit: "mg/dL", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." },
      { label: "ast", value: "42", sourceUnit: "U/L", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." },
      { label: "alt", value: "38", sourceUnit: "U/L", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." },
      { label: "total_bilirubin", value: "1.0", sourceUnit: "mg/dL", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." },
      { label: "lactate", value: "2.8", sourceUnit: "mmol/L", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." }
    ],
    excludedValues: [
      { label: "temp", value: "37.2", reason: "prior", sourceSpan: "Baseline assessment at start of night shift: Temperature 38.9 °C (102.0 °F) orally (elevated from 37.2 °C twelve hours earlier), heart rate 112 and regular, blood pressure 96/58 (down from 118/72 earlier in the day), respiratory rate 22, SpO₂ 95% on room air." },
      { label: "sbp", value: "118", reason: "prior", sourceSpan: "Baseline assessment at start of night shift: Temperature 38.9 °C (102.0 °F) orally (elevated from 37.2 °C twelve hours earlier), heart rate 112 and regular, blood pressure 96/58 (down from 118/72 earlier in the day), respiratory rate 22, SpO₂ 95% on room air." },
      { label: "dbp", value: "72", reason: "prior", sourceSpan: "Baseline assessment at start of night shift: Temperature 38.9 °C (102.0 °F) orally (elevated from 37.2 °C twelve hours earlier), heart rate 112 and regular, blood pressure 96/58 (down from 118/72 earlier in the day), respiratory rate 22, SpO₂ 95% on room air." },
      { label: "creatinine", value: "1.3", reason: "prior", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." },
      { label: "glucose", value: "312", reason: "prior", sourceSpan: "Baseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated)." }
    ],
    unitAliases: [
      { aliasOf: "wbc", value: "0.3 × 10³/µL" },
      { aliasOf: "platelets", value: "18,000/µL" }
    ]
  },
  {
    exhibitRef: "opus_tpn_case_mucositis_01/exhibit_stage1",
    lane: "extract",
    panel: [
      { label: "temp", value: "39.2", sourceUnit: "°C", sourceSpan: "Two hours later, repeat vitals show temperature 39.2 °C (103.6 °F), heart rate 118, blood pressure 92/54 (worsening despite the bolus), respiratory rate 24, SpO₂ 94% on room air.", context: "post_intervention" },
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "Two hours later, repeat vitals show temperature 39.2 °C (103.6 °F), heart rate 118, blood pressure 92/54 (worsening despite the bolus), respiratory rate 24, SpO₂ 94% on room air.", context: "post_intervention" },
      { label: "sbp", value: "92", sourceUnit: "mmHg", sourceSpan: "Two hours later, repeat vitals show temperature 39.2 °C (103.6 °F), heart rate 118, blood pressure 92/54 (worsening despite the bolus), respiratory rate 24, SpO₂ 94% on room air.", context: "post_intervention" },
      { label: "dbp", value: "54", sourceUnit: "mmHg", sourceSpan: "Two hours later, repeat vitals show temperature 39.2 °C (103.6 °F), heart rate 118, blood pressure 92/54 (worsening despite the bolus), respiratory rate 24, SpO₂ 94% on room air.", context: "post_intervention" },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "Two hours later, repeat vitals show temperature 39.2 °C (103.6 °F), heart rate 118, blood pressure 92/54 (worsening despite the bolus), respiratory rate 24, SpO₂ 94% on room air.", context: "post_intervention" },
      { label: "spo2", value: "94", sourceUnit: "%", sourceSpan: "Two hours later, repeat vitals show temperature 39.2 °C (103.6 °F), heart rate 118, blood pressure 92/54 (worsening despite the bolus), respiratory rate 24, SpO₂ 94% on room air.", context: "post_intervention" },
      { label: "potassium", value: "3.0", sourceUnit: "mEq/L", sourceSpan: "The stat labs return: potassium 3.0 mEq/L (still low despite replacement), magnesium 1.3 mg/dL (unchanged), creatinine 1.9 mg/dL (rising), blood glucose 324 mg/dL (rising; the TPN dextrose load is outpacing the sliding-scale coverage), lactate 3.6 mmol/L (rising).", context: "post_intervention" },
      { label: "magnesium", value: "1.3", sourceUnit: "mg/dL", sourceSpan: "The stat labs return: potassium 3.0 mEq/L (still low despite replacement), magnesium 1.3 mg/dL (unchanged), creatinine 1.9 mg/dL (rising), blood glucose 324 mg/dL (rising; the TPN dextrose load is outpacing the sliding-scale coverage), lactate 3.6 mmol/L (rising).", context: "post_intervention" },
      { label: "creatinine", value: "1.9", sourceUnit: "mg/dL", sourceSpan: "The stat labs return: potassium 3.0 mEq/L (still low despite replacement), magnesium 1.3 mg/dL (unchanged), creatinine 1.9 mg/dL (rising), blood glucose 324 mg/dL (rising; the TPN dextrose load is outpacing the sliding-scale coverage), lactate 3.6 mmol/L (rising).", context: "post_intervention" },
      { label: "glucose", value: "324", sourceUnit: "mg/dL", sourceSpan: "The stat labs return: potassium 3.0 mEq/L (still low despite replacement), magnesium 1.3 mg/dL (unchanged), creatinine 1.9 mg/dL (rising), blood glucose 324 mg/dL (rising; the TPN dextrose load is outpacing the sliding-scale coverage), lactate 3.6 mmol/L (rising).", context: "post_intervention" },
      { label: "lactate", value: "3.6", sourceUnit: "mmol/L", sourceSpan: "The stat labs return: potassium 3.0 mEq/L (still low despite replacement), magnesium 1.3 mg/dL (unchanged), creatinine 1.9 mg/dL (rising), blood glucose 324 mg/dL (rising; the TPN dextrose load is outpacing the sliding-scale coverage), lactate 3.6 mmol/L (rising).", context: "post_intervention" }
    ],
    excludedValues: [
      { label: "temp", value: "38.9", reason: "prior", sourceSpan: "The nurse notifies the provider of the new fever (38.9 °C), hypotension (96/58), tachycardia (112), oliguria, the PICC site erythema, and the lab abnormalities." },
      { label: "sbp", value: "96", reason: "prior", sourceSpan: "The nurse notifies the provider of the new fever (38.9 °C), hypotension (96/58), tachycardia (112), oliguria, the PICC site erythema, and the lab abnormalities." },
      { label: "dbp", value: "58", reason: "prior", sourceSpan: "The nurse notifies the provider of the new fever (38.9 °C), hypotension (96/58), tachycardia (112), oliguria, the PICC site erythema, and the lab abnormalities." },
      { label: "hr", value: "112", reason: "prior", sourceSpan: "The nurse notifies the provider of the new fever (38.9 °C), hypotension (96/58), tachycardia (112), oliguria, the PICC site erythema, and the lab abnormalities." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "opus_tpn_case_mucositis_01/exhibit_stage2",
    lane: "extract",
    panel: [
      { label: "temp", value: "39.4", sourceUnit: "°C", sourceSpan: "Repeat vitals after interventions: temperature 39.4 °C, heart rate 122, blood pressure 100/62 (slightly improved with the second bolus), respiratory rate 22, SpO₂ 95% on 2 L nasal cannula (now requiring supplemental oxygen).", context: "post_intervention" },
      { label: "hr", value: "122", sourceUnit: "bpm", sourceSpan: "Repeat vitals after interventions: temperature 39.4 °C, heart rate 122, blood pressure 100/62 (slightly improved with the second bolus), respiratory rate 22, SpO₂ 95% on 2 L nasal cannula (now requiring supplemental oxygen).", context: "post_intervention" },
      { label: "sbp", value: "100", sourceUnit: "mmHg", sourceSpan: "Repeat vitals after interventions: temperature 39.4 °C, heart rate 122, blood pressure 100/62 (slightly improved with the second bolus), respiratory rate 22, SpO₂ 95% on 2 L nasal cannula (now requiring supplemental oxygen).", context: "post_intervention" },
      { label: "dbp", value: "62", sourceUnit: "mmHg", sourceSpan: "Repeat vitals after interventions: temperature 39.4 °C, heart rate 122, blood pressure 100/62 (slightly improved with the second bolus), respiratory rate 22, SpO₂ 95% on 2 L nasal cannula (now requiring supplemental oxygen).", context: "post_intervention" },
      { label: "rr", value: "22", sourceUnit: "/min", sourceSpan: "Repeat vitals after interventions: temperature 39.4 °C, heart rate 122, blood pressure 100/62 (slightly improved with the second bolus), respiratory rate 22, SpO₂ 95% on 2 L nasal cannula (now requiring supplemental oxygen).", context: "post_intervention" },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "Repeat vitals after interventions: temperature 39.4 °C, heart rate 122, blood pressure 100/62 (slightly improved with the second bolus), respiratory rate 22, SpO₂ 95% on 2 L nasal cannula (now requiring supplemental oxygen).", context: "post_intervention" },
      { label: "glucose", value: "245", sourceUnit: "mg/dL", sourceSpan: "Blood glucose is 245 mg/dL on the insulin drip (trending down).", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_tpn_case_mucositis_01/exhibit_stage3",
    lane: "extract",
    panel: [
      { label: "potassium", value: "3.8", sourceUnit: "mEq/L", sourceSpan: "Repeat labs: potassium 3.8 mEq/L (improving after aggressive replacement), magnesium 1.8 mg/dL (improving), creatinine 1.7 mg/dL (plateau, slight improvement), lactate 1.9 mmol/L (trending down), triglycerides 280 mg/dL (still elevated but decreasing with the reduced TPN rate).", context: "post_intervention" },
      { label: "magnesium", value: "1.8", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: potassium 3.8 mEq/L (improving after aggressive replacement), magnesium 1.8 mg/dL (improving), creatinine 1.7 mg/dL (plateau, slight improvement), lactate 1.9 mmol/L (trending down), triglycerides 280 mg/dL (still elevated but decreasing with the reduced TPN rate).", context: "post_intervention" },
      { label: "creatinine", value: "1.7", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: potassium 3.8 mEq/L (improving after aggressive replacement), magnesium 1.8 mg/dL (improving), creatinine 1.7 mg/dL (plateau, slight improvement), lactate 1.9 mmol/L (trending down), triglycerides 280 mg/dL (still elevated but decreasing with the reduced TPN rate).", context: "post_intervention" },
      { label: "lactate", value: "1.9", sourceUnit: "mmol/L", sourceSpan: "Repeat labs: potassium 3.8 mEq/L (improving after aggressive replacement), magnesium 1.8 mg/dL (improving), creatinine 1.7 mg/dL (plateau, slight improvement), lactate 1.9 mmol/L (trending down), triglycerides 280 mg/dL (still elevated but decreasing with the reduced TPN rate).", context: "post_intervention" },
      { label: "temp", value: "38.1", sourceUnit: "°C", sourceSpan: "Temperature is 38.1 °C (trending down from peak), heart rate 98, blood pressure 110/68, respiratory rate 18, SpO₂ 97% on room air (supplemental oxygen weaned).", context: "post_intervention" },
      { label: "hr", value: "98", sourceUnit: "bpm", sourceSpan: "Temperature is 38.1 °C (trending down from peak), heart rate 98, blood pressure 110/68, respiratory rate 18, SpO₂ 97% on room air (supplemental oxygen weaned).", context: "post_intervention" },
      { label: "sbp", value: "110", sourceUnit: "mmHg", sourceSpan: "Temperature is 38.1 °C (trending down from peak), heart rate 98, blood pressure 110/68, respiratory rate 18, SpO₂ 97% on room air (supplemental oxygen weaned).", context: "post_intervention" },
      { label: "dbp", value: "68", sourceUnit: "mmHg", sourceSpan: "Temperature is 38.1 °C (trending down from peak), heart rate 98, blood pressure 110/68, respiratory rate 18, SpO₂ 97% on room air (supplemental oxygen weaned).", context: "post_intervention" },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Temperature is 38.1 °C (trending down from peak), heart rate 98, blood pressure 110/68, respiratory rate 18, SpO₂ 97% on room air (supplemental oxygen weaned).", context: "post_intervention" },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Temperature is 38.1 °C (trending down from peak), heart rate 98, blood pressure 110/68, respiratory rate 18, SpO₂ 97% on room air (supplemental oxygen weaned).", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_vanco_case_01/baseline_assessment_labs",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.6", sourceUnit: "°C", sourceSpan: "Vital signs: temperature 38.6 °C, heart rate 96/min regular, blood pressure 142/84 mm Hg, respiratory rate 18/min, SpO2 96% on room air." },
      { label: "hr", value: "96", sourceUnit: "bpm", sourceSpan: "Vital signs: temperature 38.6 °C, heart rate 96/min regular, blood pressure 142/84 mm Hg, respiratory rate 18/min, SpO2 96% on room air." },
      { label: "sbp", value: "142", sourceUnit: "mm Hg", sourceSpan: "Vital signs: temperature 38.6 °C, heart rate 96/min regular, blood pressure 142/84 mm Hg, respiratory rate 18/min, SpO2 96% on room air." },
      { label: "dbp", value: "84", sourceUnit: "mm Hg", sourceSpan: "Vital signs: temperature 38.6 °C, heart rate 96/min regular, blood pressure 142/84 mm Hg, respiratory rate 18/min, SpO2 96% on room air." },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Vital signs: temperature 38.6 °C, heart rate 96/min regular, blood pressure 142/84 mm Hg, respiratory rate 18/min, SpO2 96% on room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Vital signs: temperature 38.6 °C, heart rate 96/min regular, blood pressure 142/84 mm Hg, respiratory rate 18/min, SpO2 96% on room air." },
      { label: "wbc", value: "14,800", sourceUnit: "/µL", sourceSpan: "Labs drawn at 1200: WBC 14,800/µL with 82% neutrophils and 9% bands; hemoglobin 11.2 g/dL; platelets 228,000/µL; sodium 138 mEq/L; potassium 4.6 mEq/L; bicarbonate 22 mEq/L; BUN 32 mg/dL; creatinine 1.8 mg/dL; eGFR 38 mL/min; glucose 198 mg/dL; lactate 2.2 mmol/L; albumin 2.8 g/dL." },
      { label: "hemoglobin", value: "11.2", sourceUnit: "g/dL", sourceSpan: "Labs drawn at 1200: WBC 14,800/µL with 82% neutrophils and 9% bands; hemoglobin 11.2 g/dL; platelets 228,000/µL; sodium 138 mEq/L; potassium 4.6 mEq/L; bicarbonate 22 mEq/L; BUN 32 mg/dL; creatinine 1.8 mg/dL; eGFR 38 mL/min; glucose 198 mg/dL; lactate 2.2 mmol/L; albumin 2.8 g/dL." },
      { label: "platelets", value: "228,000", sourceUnit: "/µL", sourceSpan: "Labs drawn at 1200: WBC 14,800/µL with 82% neutrophils and 9% bands; hemoglobin 11.2 g/dL; platelets 228,000/µL; sodium 138 mEq/L; potassium 4.6 mEq/L; bicarbonate 22 mEq/L; BUN 32 mg/dL; creatinine 1.8 mg/dL; eGFR 38 mL/min; glucose 198 mg/dL; lactate 2.2 mmol/L; albumin 2.8 g/dL." },
      { label: "sodium", value: "138", sourceUnit: "mEq/L", sourceSpan: "Labs drawn at 1200: WBC 14,800/µL with 82% neutrophils and 9% bands; hemoglobin 11.2 g/dL; platelets 228,000/µL; sodium 138 mEq/L; potassium 4.6 mEq/L; bicarbonate 22 mEq/L; BUN 32 mg/dL; creatinine 1.8 mg/dL; eGFR 38 mL/min; glucose 198 mg/dL; lactate 2.2 mmol/L; albumin 2.8 g/dL." },
      { label: "potassium", value: "4.6", sourceUnit: "mEq/L", sourceSpan: "Labs drawn at 1200: WBC 14,800/µL with 82% neutrophils and 9% bands; hemoglobin 11.2 g/dL; platelets 228,000/µL; sodium 138 mEq/L; potassium 4.6 mEq/L; bicarbonate 22 mEq/L; BUN 32 mg/dL; creatinine 1.8 mg/dL; eGFR 38 mL/min; glucose 198 mg/dL; lactate 2.2 mmol/L; albumin 2.8 g/dL." },
      { label: "bicarbonate", value: "22", sourceUnit: "mEq/L", sourceSpan: "Labs drawn at 1200: WBC 14,800/µL with 82% neutrophils and 9% bands; hemoglobin 11.2 g/dL; platelets 228,000/µL; sodium 138 mEq/L; potassium 4.6 mEq/L; bicarbonate 22 mEq/L; BUN 32 mg/dL; creatinine 1.8 mg/dL; eGFR 38 mL/min; glucose 198 mg/dL; lactate 2.2 mmol/L; albumin 2.8 g/dL." },
      { label: "bun", value: "32", sourceUnit: "mg/dL", sourceSpan: "Labs drawn at 1200: WBC 14,800/µL with 82% neutrophils and 9% bands; hemoglobin 11.2 g/dL; platelets 228,000/µL; sodium 138 mEq/L; potassium 4.6 mEq/L; bicarbonate 22 mEq/L; BUN 32 mg/dL; creatinine 1.8 mg/dL; eGFR 38 mL/min; glucose 198 mg/dL; lactate 2.2 mmol/L; albumin 2.8 g/dL." },
      { label: "creatinine", value: "1.8", sourceUnit: "mg/dL", sourceSpan: "Labs drawn at 1200: WBC 14,800/µL with 82% neutrophils and 9% bands; hemoglobin 11.2 g/dL; platelets 228,000/µL; sodium 138 mEq/L; potassium 4.6 mEq/L; bicarbonate 22 mEq/L; BUN 32 mg/dL; creatinine 1.8 mg/dL; eGFR 38 mL/min; glucose 198 mg/dL; lactate 2.2 mmol/L; albumin 2.8 g/dL." },
      { label: "glucose", value: "198", sourceUnit: "mg/dL", sourceSpan: "Labs drawn at 1200: WBC 14,800/µL with 82% neutrophils and 9% bands; hemoglobin 11.2 g/dL; platelets 228,000/µL; sodium 138 mEq/L; potassium 4.6 mEq/L; bicarbonate 22 mEq/L; BUN 32 mg/dL; creatinine 1.8 mg/dL; eGFR 38 mL/min; glucose 198 mg/dL; lactate 2.2 mmol/L; albumin 2.8 g/dL." },
      { label: "lactate", value: "2.2", sourceUnit: "mmol/L", sourceSpan: "Labs drawn at 1200: WBC 14,800/µL with 82% neutrophils and 9% bands; hemoglobin 11.2 g/dL; platelets 228,000/µL; sodium 138 mEq/L; potassium 4.6 mEq/L; bicarbonate 22 mEq/L; BUN 32 mg/dL; creatinine 1.8 mg/dL; eGFR 38 mL/min; glucose 198 mg/dL; lactate 2.2 mmol/L; albumin 2.8 g/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus1_case_discharge_med_rec_anticoag_01/baseline_record",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "C", sourceSpan: "T 36.8 C, HR 78 irregularly irregular, BP 134/76, RR 16, SpO2 97% on room air." },
      { label: "hr", value: "78", sourceUnit: "bpm", sourceSpan: "T 36.8 C, HR 78 irregularly irregular, BP 134/76, RR 16, SpO2 97% on room air." },
      { label: "sbp", value: "134", sourceUnit: "mmHg", sourceSpan: "T 36.8 C, HR 78 irregularly irregular, BP 134/76, RR 16, SpO2 97% on room air." },
      { label: "dbp", value: "76", sourceUnit: "mmHg", sourceSpan: "T 36.8 C, HR 78 irregularly irregular, BP 134/76, RR 16, SpO2 97% on room air." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "T 36.8 C, HR 78 irregularly irregular, BP 134/76, RR 16, SpO2 97% on room air." },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "T 36.8 C, HR 78 irregularly irregular, BP 134/76, RR 16, SpO2 97% on room air." },
      { label: "inr", value: "1.8", sourceUnit: "(ratio)", sourceSpan: "Laboratory results: INR 1.8, PT 21.4 seconds, aPTT 34 seconds, hemoglobin 10.8 g/dL and stable from postoperative day 1, platelets 198,000/mcL, creatinine 1.7 mg/dL, eGFR 44 mL/min, BUN 28 mg/dL, potassium 4.6 mEq/L, fasting glucose 142 mg/dL." },
      { label: "ptt", value: "34", sourceUnit: "seconds", sourceSpan: "Laboratory results: INR 1.8, PT 21.4 seconds, aPTT 34 seconds, hemoglobin 10.8 g/dL and stable from postoperative day 1, platelets 198,000/mcL, creatinine 1.7 mg/dL, eGFR 44 mL/min, BUN 28 mg/dL, potassium 4.6 mEq/L, fasting glucose 142 mg/dL." },
      { label: "hemoglobin", value: "10.8", sourceUnit: "g/dL", sourceSpan: "Laboratory results: INR 1.8, PT 21.4 seconds, aPTT 34 seconds, hemoglobin 10.8 g/dL and stable from postoperative day 1, platelets 198,000/mcL, creatinine 1.7 mg/dL, eGFR 44 mL/min, BUN 28 mg/dL, potassium 4.6 mEq/L, fasting glucose 142 mg/dL." },
      { label: "platelets", value: "198,000", sourceUnit: "/mcL", sourceSpan: "Laboratory results: INR 1.8, PT 21.4 seconds, aPTT 34 seconds, hemoglobin 10.8 g/dL and stable from postoperative day 1, platelets 198,000/mcL, creatinine 1.7 mg/dL, eGFR 44 mL/min, BUN 28 mg/dL, potassium 4.6 mEq/L, fasting glucose 142 mg/dL." },
      { label: "creatinine", value: "1.7", sourceUnit: "mg/dL", sourceSpan: "Laboratory results: INR 1.8, PT 21.4 seconds, aPTT 34 seconds, hemoglobin 10.8 g/dL and stable from postoperative day 1, platelets 198,000/mcL, creatinine 1.7 mg/dL, eGFR 44 mL/min, BUN 28 mg/dL, potassium 4.6 mEq/L, fasting glucose 142 mg/dL." },
      { label: "bun", value: "28", sourceUnit: "mg/dL", sourceSpan: "Laboratory results: INR 1.8, PT 21.4 seconds, aPTT 34 seconds, hemoglobin 10.8 g/dL and stable from postoperative day 1, platelets 198,000/mcL, creatinine 1.7 mg/dL, eGFR 44 mL/min, BUN 28 mg/dL, potassium 4.6 mEq/L, fasting glucose 142 mg/dL." },
      { label: "potassium", value: "4.6", sourceUnit: "mEq/L", sourceSpan: "Laboratory results: INR 1.8, PT 21.4 seconds, aPTT 34 seconds, hemoglobin 10.8 g/dL and stable from postoperative day 1, platelets 198,000/mcL, creatinine 1.7 mg/dL, eGFR 44 mL/min, BUN 28 mg/dL, potassium 4.6 mEq/L, fasting glucose 142 mg/dL." },
      { label: "glucose", value: "142", sourceUnit: "mg/dL", sourceSpan: "Laboratory results: INR 1.8, PT 21.4 seconds, aPTT 34 seconds, hemoglobin 10.8 g/dL and stable from postoperative day 1, platelets 198,000/mcL, creatinine 1.7 mg/dL, eGFR 44 mL/min, BUN 28 mg/dL, potassium 4.6 mEq/L, fasting glucose 142 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus1_case_tha_discharge_lep_01/pod1_update",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.2", sourceUnit: "°C", sourceSpan: "About 18 hr after surgery: T 37.2 °C, HR 78, BP 132/74, RR 14, SpO₂ 97% on room air.", context: "post_intervention" },
      { label: "hr", value: "78", sourceUnit: "bpm", sourceSpan: "About 18 hr after surgery: T 37.2 °C, HR 78, BP 132/74, RR 14, SpO₂ 97% on room air.", context: "post_intervention" },
      { label: "sbp", value: "132", sourceUnit: "mmHg", sourceSpan: "About 18 hr after surgery: T 37.2 °C, HR 78, BP 132/74, RR 14, SpO₂ 97% on room air.", context: "post_intervention" },
      { label: "dbp", value: "74", sourceUnit: "mmHg", sourceSpan: "About 18 hr after surgery: T 37.2 °C, HR 78, BP 132/74, RR 14, SpO₂ 97% on room air.", context: "post_intervention" },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "About 18 hr after surgery: T 37.2 °C, HR 78, BP 132/74, RR 14, SpO₂ 97% on room air.", context: "post_intervention" },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "About 18 hr after surgery: T 37.2 °C, HR 78, BP 132/74, RR 14, SpO₂ 97% on room air.", context: "post_intervention" },
      { label: "hemoglobin", value: "10.2", sourceUnit: "g/dL", sourceSpan: "Repeat labs: Hgb 10.2 g/dL, creatinine 1.5 mg/dL, eGFR 36 mL/min, glucose 148 mg/dL.", context: "post_intervention" },
      { label: "creatinine", value: "1.5", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: Hgb 10.2 g/dL, creatinine 1.5 mg/dL, eGFR 36 mL/min, glucose 148 mg/dL.", context: "post_intervention" },
      { label: "glucose", value: "148", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: Hgb 10.2 g/dL, creatinine 1.5 mg/dL, eGFR 36 mL/min, glucose 148 mg/dL.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus1_case_tha_discharge_lep_01/pod2_update",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.9", sourceUnit: "°C", sourceSpan: "About 42 hr after surgery: T 36.9 °C, HR 74, BP 128/72, RR 14, SpO₂ 98% on room air.", context: "post_intervention" },
      { label: "hr", value: "74", sourceUnit: "bpm", sourceSpan: "About 42 hr after surgery: T 36.9 °C, HR 74, BP 128/72, RR 14, SpO₂ 98% on room air.", context: "post_intervention" },
      { label: "sbp", value: "128", sourceUnit: "mmHg", sourceSpan: "About 42 hr after surgery: T 36.9 °C, HR 74, BP 128/72, RR 14, SpO₂ 98% on room air.", context: "post_intervention" },
      { label: "dbp", value: "72", sourceUnit: "mmHg", sourceSpan: "About 42 hr after surgery: T 36.9 °C, HR 74, BP 128/72, RR 14, SpO₂ 98% on room air.", context: "post_intervention" },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "About 42 hr after surgery: T 36.9 °C, HR 74, BP 128/72, RR 14, SpO₂ 98% on room air.", context: "post_intervention" },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "About 42 hr after surgery: T 36.9 °C, HR 74, BP 128/72, RR 14, SpO₂ 98% on room air.", context: "post_intervention" },
      { label: "creatinine", value: "1.4", sourceUnit: "mg/dL", sourceSpan: "Repeat creatinine 1.4 mg/dL after hydration and adequate oral intake; eGFR 39 mL/min.", context: "post_intervention" },
      { label: "hemoglobin", value: "10.0", sourceUnit: "g/dL", sourceSpan: "Hgb 10.0 g/dL.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus1_case_tha_discharge_lep_01/pod3_update",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.7", sourceUnit: "°C", sourceSpan: "About 66 hr after surgery: T 36.7 °C, HR 72, BP 126/70, RR 14, SpO₂ 99% on room air.", context: "post_intervention" },
      { label: "hr", value: "72", sourceUnit: "bpm", sourceSpan: "About 66 hr after surgery: T 36.7 °C, HR 72, BP 126/70, RR 14, SpO₂ 99% on room air.", context: "post_intervention" },
      { label: "sbp", value: "126", sourceUnit: "mmHg", sourceSpan: "About 66 hr after surgery: T 36.7 °C, HR 72, BP 126/70, RR 14, SpO₂ 99% on room air.", context: "post_intervention" },
      { label: "dbp", value: "70", sourceUnit: "mmHg", sourceSpan: "About 66 hr after surgery: T 36.7 °C, HR 72, BP 126/70, RR 14, SpO₂ 99% on room air.", context: "post_intervention" },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "About 66 hr after surgery: T 36.7 °C, HR 72, BP 126/70, RR 14, SpO₂ 99% on room air.", context: "post_intervention" },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "About 66 hr after surgery: T 36.7 °C, HR 72, BP 126/70, RR 14, SpO₂ 99% on room air.", context: "post_intervention" },
      { label: "creatinine", value: "1.3", sourceUnit: "mg/dL", sourceSpan: "Creatinine 1.3 mg/dL, eGFR 42 mL/min.", context: "post_intervention" },
      { label: "hemoglobin", value: "9.8", sourceUnit: "g/dL", sourceSpan: "Hgb 9.8 g/dL and stable.", context: "post_intervention" },
      { label: "glucose", value: "132", sourceUnit: "mg/dL", sourceSpan: "Glucose 132 mg/dL.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus12_case_inpatient_suicide_risk_01/stage2_precautions_sweep",
    lane: "extract",
    panel: [
      { label: "hr", value: "104", sourceUnit: "bpm", sourceSpan: "Vitals: HR 104, BP 152/94, RR 20, SpO₂ 96%." },
      { label: "sbp", value: "152", sourceUnit: "mmHg", sourceSpan: "Vitals: HR 104, BP 152/94, RR 20, SpO₂ 96%." },
      { label: "dbp", value: "94", sourceUnit: "mmHg", sourceSpan: "Vitals: HR 104, BP 152/94, RR 20, SpO₂ 96%." },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "Vitals: HR 104, BP 152/94, RR 20, SpO₂ 96%." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Vitals: HR 104, BP 152/94, RR 20, SpO₂ 96%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus2_case_code_status_01/exhibit_baseline",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.1", sourceUnit: "°C", sourceSpan: "Temperature: 37.1 °C" },
      { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: "Heart rate: 92 bpm" },
      { label: "sbp", value: "118", sourceUnit: "mmHg", sourceSpan: "Blood pressure: 118/72 mmHg" },
      { label: "dbp", value: "72", sourceUnit: "mmHg", sourceSpan: "Blood pressure: 118/72 mmHg" },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "Respiratory rate: 20 breaths/min" },
      { label: "spo2", value: "93", sourceUnit: "%", sourceSpan: "SpO₂: 93% on 3 L nasal cannula" },
      { label: "wbc", value: "3,800", sourceUnit: "/µL", sourceSpan: "WBC: 3,800/µL" },
      { label: "hemoglobin", value: "10.4", sourceUnit: "g/dL", sourceSpan: "Hemoglobin: 10.4 g/dL" },
      { label: "platelets", value: "112,000", sourceUnit: "/µL", sourceSpan: "Platelets: 112,000/µL" },
      { label: "bun", value: "18", sourceUnit: "mg/dL", sourceSpan: "BUN: 18 mg/dL" },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "Creatinine: 0.9 mg/dL" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus2_case_postop_opioid_respiratory_depression_01/handoff_assessment_labs",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.2", sourceUnit: "°C", sourceSpan: "Vital signs: T 37.2 °C, HR 82/min, BP 138/84 mm Hg, RR 16/min, SpO2 95% on room air." },
      { label: "hr", value: "82", sourceUnit: "bpm", sourceSpan: "Vital signs: T 37.2 °C, HR 82/min, BP 138/84 mm Hg, RR 16/min, SpO2 95% on room air." },
      { label: "sbp", value: "138", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 37.2 °C, HR 82/min, BP 138/84 mm Hg, RR 16/min, SpO2 95% on room air." },
      { label: "dbp", value: "84", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 37.2 °C, HR 82/min, BP 138/84 mm Hg, RR 16/min, SpO2 95% on room air." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Vital signs: T 37.2 °C, HR 82/min, BP 138/84 mm Hg, RR 16/min, SpO2 95% on room air." },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "Vital signs: T 37.2 °C, HR 82/min, BP 138/84 mm Hg, RR 16/min, SpO2 95% on room air." },
      { label: "wbc", value: "11,200", sourceUnit: "/µL", sourceSpan: "0600 labs: WBC 11,200/µL; hemoglobin 11.4 g/dL (preoperative 13.8 g/dL); hematocrit 34.2%; platelets 210,000/µL; sodium 139 mEq/L; potassium 3.9 mEq/L; chloride 101 mEq/L; CO2 26 mEq/L; BUN 18 mg/dL; creatinine 1.0 mg/dL; glucose 168 mg/dL; calcium 8.6 mg/dL." },
      { label: "hemoglobin", value: "11.4", sourceUnit: "g/dL", sourceSpan: "0600 labs: WBC 11,200/µL; hemoglobin 11.4 g/dL (preoperative 13.8 g/dL); hematocrit 34.2%; platelets 210,000/µL; sodium 139 mEq/L; potassium 3.9 mEq/L; chloride 101 mEq/L; CO2 26 mEq/L; BUN 18 mg/dL; creatinine 1.0 mg/dL; glucose 168 mg/dL; calcium 8.6 mg/dL." },
      { label: "hematocrit", value: "34.2", sourceUnit: "%", sourceSpan: "0600 labs: WBC 11,200/µL; hemoglobin 11.4 g/dL (preoperative 13.8 g/dL); hematocrit 34.2%; platelets 210,000/µL; sodium 139 mEq/L; potassium 3.9 mEq/L; chloride 101 mEq/L; CO2 26 mEq/L; BUN 18 mg/dL; creatinine 1.0 mg/dL; glucose 168 mg/dL; calcium 8.6 mg/dL." },
      { label: "platelets", value: "210,000", sourceUnit: "/µL", sourceSpan: "0600 labs: WBC 11,200/µL; hemoglobin 11.4 g/dL (preoperative 13.8 g/dL); hematocrit 34.2%; platelets 210,000/µL; sodium 139 mEq/L; potassium 3.9 mEq/L; chloride 101 mEq/L; CO2 26 mEq/L; BUN 18 mg/dL; creatinine 1.0 mg/dL; glucose 168 mg/dL; calcium 8.6 mg/dL." },
      { label: "sodium", value: "139", sourceUnit: "mEq/L", sourceSpan: "0600 labs: WBC 11,200/µL; hemoglobin 11.4 g/dL (preoperative 13.8 g/dL); hematocrit 34.2%; platelets 210,000/µL; sodium 139 mEq/L; potassium 3.9 mEq/L; chloride 101 mEq/L; CO2 26 mEq/L; BUN 18 mg/dL; creatinine 1.0 mg/dL; glucose 168 mg/dL; calcium 8.6 mg/dL." },
      { label: "potassium", value: "3.9", sourceUnit: "mEq/L", sourceSpan: "0600 labs: WBC 11,200/µL; hemoglobin 11.4 g/dL (preoperative 13.8 g/dL); hematocrit 34.2%; platelets 210,000/µL; sodium 139 mEq/L; potassium 3.9 mEq/L; chloride 101 mEq/L; CO2 26 mEq/L; BUN 18 mg/dL; creatinine 1.0 mg/dL; glucose 168 mg/dL; calcium 8.6 mg/dL." },
      { label: "chloride", value: "101", sourceUnit: "mEq/L", sourceSpan: "0600 labs: WBC 11,200/µL; hemoglobin 11.4 g/dL (preoperative 13.8 g/dL); hematocrit 34.2%; platelets 210,000/µL; sodium 139 mEq/L; potassium 3.9 mEq/L; chloride 101 mEq/L; CO2 26 mEq/L; BUN 18 mg/dL; creatinine 1.0 mg/dL; glucose 168 mg/dL; calcium 8.6 mg/dL." },
      { label: "bicarbonate", value: "26", sourceUnit: "mEq/L", sourceSpan: "0600 labs: WBC 11,200/µL; hemoglobin 11.4 g/dL (preoperative 13.8 g/dL); hematocrit 34.2%; platelets 210,000/µL; sodium 139 mEq/L; potassium 3.9 mEq/L; chloride 101 mEq/L; CO2 26 mEq/L; BUN 18 mg/dL; creatinine 1.0 mg/dL; glucose 168 mg/dL; calcium 8.6 mg/dL." },
      { label: "bun", value: "18", sourceUnit: "mg/dL", sourceSpan: "0600 labs: WBC 11,200/µL; hemoglobin 11.4 g/dL (preoperative 13.8 g/dL); hematocrit 34.2%; platelets 210,000/µL; sodium 139 mEq/L; potassium 3.9 mEq/L; chloride 101 mEq/L; CO2 26 mEq/L; BUN 18 mg/dL; creatinine 1.0 mg/dL; glucose 168 mg/dL; calcium 8.6 mg/dL." },
      { label: "creatinine", value: "1.0", sourceUnit: "mg/dL", sourceSpan: "0600 labs: WBC 11,200/µL; hemoglobin 11.4 g/dL (preoperative 13.8 g/dL); hematocrit 34.2%; platelets 210,000/µL; sodium 139 mEq/L; potassium 3.9 mEq/L; chloride 101 mEq/L; CO2 26 mEq/L; BUN 18 mg/dL; creatinine 1.0 mg/dL; glucose 168 mg/dL; calcium 8.6 mg/dL." },
      { label: "glucose", value: "168", sourceUnit: "mg/dL", sourceSpan: "0600 labs: WBC 11,200/µL; hemoglobin 11.4 g/dL (preoperative 13.8 g/dL); hematocrit 34.2%; platelets 210,000/µL; sodium 139 mEq/L; potassium 3.9 mEq/L; chloride 101 mEq/L; CO2 26 mEq/L; BUN 18 mg/dL; creatinine 1.0 mg/dL; glucose 168 mg/dL; calcium 8.6 mg/dL." },
      { label: "calcium", value: "8.6", sourceUnit: "mg/dL", sourceSpan: "0600 labs: WBC 11,200/µL; hemoglobin 11.4 g/dL (preoperative 13.8 g/dL); hematocrit 34.2%; platelets 210,000/µL; sodium 139 mEq/L; potassium 3.9 mEq/L; chloride 101 mEq/L; CO2 26 mEq/L; BUN 18 mg/dL; creatinine 1.0 mg/dL; glucose 168 mg/dL; calcium 8.6 mg/dL." }
    ],
    excludedValues: [
      { label: "hemoglobin", value: "13.8", reason: "prior", sourceSpan: "0600 labs: WBC 11,200/µL; hemoglobin 11.4 g/dL (preoperative 13.8 g/dL); hematocrit 34.2%; platelets 210,000/µL; sodium 139 mEq/L; potassium 3.9 mEq/L; chloride 101 mEq/L; CO2 26 mEq/L; BUN 18 mg/dL; creatinine 1.0 mg/dL; glucose 168 mg/dL; calcium 8.6 mg/dL." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "opus2_case_postop_opioid_respiratory_depression_01/stage_0830_findings",
    lane: "extract",
    panel: [
      { label: "hr", value: "68", sourceUnit: "bpm", sourceSpan: "Vital signs: HR 68/min, BP 118/70 mm Hg, RR 8/min and shallow, SpO2 89% on room air." },
      { label: "sbp", value: "118", sourceUnit: "mm Hg", sourceSpan: "Vital signs: HR 68/min, BP 118/70 mm Hg, RR 8/min and shallow, SpO2 89% on room air." },
      { label: "dbp", value: "70", sourceUnit: "mm Hg", sourceSpan: "Vital signs: HR 68/min, BP 118/70 mm Hg, RR 8/min and shallow, SpO2 89% on room air." },
      { label: "rr", value: "8", sourceUnit: "/min", sourceSpan: "Vital signs: HR 68/min, BP 118/70 mm Hg, RR 8/min and shallow, SpO2 89% on room air." },
      { label: "spo2", value: "89", sourceUnit: "%", sourceSpan: "Vital signs: HR 68/min, BP 118/70 mm Hg, RR 8/min and shallow, SpO2 89% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  }
];

const batch17Records: ExtractionRecord[] = [
  {
    exhibitRef: "opus20_case_cdiff_01/exhibit_baseline",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.1", sourceUnit: "°C", sourceSpan: "Temperature 38.1 °C (100.6 °F), heart rate 104, blood pressure 98/62, respiratory rate 18, SpO₂ 96% on room air." },
      { label: "hr", value: "104", sourceUnit: "bpm", sourceSpan: "Temperature 38.1 °C (100.6 °F), heart rate 104, blood pressure 98/62, respiratory rate 18, SpO₂ 96% on room air." },
      { label: "sbp", value: "98", sourceUnit: "mmHg", sourceSpan: "Temperature 38.1 °C (100.6 °F), heart rate 104, blood pressure 98/62, respiratory rate 18, SpO₂ 96% on room air." },
      { label: "dbp", value: "62", sourceUnit: "mmHg", sourceSpan: "Temperature 38.1 °C (100.6 °F), heart rate 104, blood pressure 98/62, respiratory rate 18, SpO₂ 96% on room air." },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Temperature 38.1 °C (100.6 °F), heart rate 104, blood pressure 98/62, respiratory rate 18, SpO₂ 96% on room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Temperature 38.1 °C (100.6 °F), heart rate 104, blood pressure 98/62, respiratory rate 18, SpO₂ 96% on room air." },
      { label: "wbc", value: "18,200", sourceUnit: "/µL", sourceSpan: "WBC 18,200/µL, hemoglobin 13.8 g/dL, platelets 210,000/µL." },
      { label: "hemoglobin", value: "13.8", sourceUnit: "g/dL", sourceSpan: "WBC 18,200/µL, hemoglobin 13.8 g/dL, platelets 210,000/µL." },
      { label: "platelets", value: "210,000", sourceUnit: "/µL", sourceSpan: "WBC 18,200/µL, hemoglobin 13.8 g/dL, platelets 210,000/µL." },
      { label: "sodium", value: "139", sourceUnit: "mEq/L", sourceSpan: "Sodium 139 mEq/L, potassium 3.3 mEq/L, chloride 96 mEq/L, bicarbonate 20 mEq/L, BUN 38 mg/dL, creatinine 2.1 mg/dL, eGFR 24 mL/min/1.73 m², glucose 188 mg/dL." },
      { label: "potassium", value: "3.3", sourceUnit: "mEq/L", sourceSpan: "Sodium 139 mEq/L, potassium 3.3 mEq/L, chloride 96 mEq/L, bicarbonate 20 mEq/L, BUN 38 mg/dL, creatinine 2.1 mg/dL, eGFR 24 mL/min/1.73 m², glucose 188 mg/dL." },
      { label: "chloride", value: "96", sourceUnit: "mEq/L", sourceSpan: "Sodium 139 mEq/L, potassium 3.3 mEq/L, chloride 96 mEq/L, bicarbonate 20 mEq/L, BUN 38 mg/dL, creatinine 2.1 mg/dL, eGFR 24 mL/min/1.73 m², glucose 188 mg/dL." },
      { label: "bicarbonate", value: "20", sourceUnit: "mEq/L", sourceSpan: "Sodium 139 mEq/L, potassium 3.3 mEq/L, chloride 96 mEq/L, bicarbonate 20 mEq/L, BUN 38 mg/dL, creatinine 2.1 mg/dL, eGFR 24 mL/min/1.73 m², glucose 188 mg/dL." },
      { label: "bun", value: "38", sourceUnit: "mg/dL", sourceSpan: "Sodium 139 mEq/L, potassium 3.3 mEq/L, chloride 96 mEq/L, bicarbonate 20 mEq/L, BUN 38 mg/dL, creatinine 2.1 mg/dL, eGFR 24 mL/min/1.73 m², glucose 188 mg/dL." },
      { label: "creatinine", value: "2.1", sourceUnit: "mg/dL", sourceSpan: "Sodium 139 mEq/L, potassium 3.3 mEq/L, chloride 96 mEq/L, bicarbonate 20 mEq/L, BUN 38 mg/dL, creatinine 2.1 mg/dL, eGFR 24 mL/min/1.73 m², glucose 188 mg/dL." },
      { label: "glucose", value: "188", sourceUnit: "mg/dL", sourceSpan: "Sodium 139 mEq/L, potassium 3.3 mEq/L, chloride 96 mEq/L, bicarbonate 20 mEq/L, BUN 38 mg/dL, creatinine 2.1 mg/dL, eGFR 24 mL/min/1.73 m², glucose 188 mg/dL." },
      { label: "lactate", value: "2.4", sourceUnit: "mmol/L", sourceSpan: "Lactate 2.4 mmol/L." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus20_case_cdiff_01/exhibit_stage1",
    lane: "extract",
    panel: [
      { label: "hr", value: "100", sourceUnit: "bpm", sourceSpan: "She remains tachycardic (HR 100) and hypotensive (BP 100/64)." },
      { label: "sbp", value: "100", sourceUnit: "mmHg", sourceSpan: "She remains tachycardic (HR 100) and hypotensive (BP 100/64)." },
      { label: "dbp", value: "64", sourceUnit: "mmHg", sourceSpan: "She remains tachycardic (HR 100) and hypotensive (BP 100/64)." },
      { label: "potassium", value: "3.1", sourceUnit: "mEq/L", sourceSpan: "Repeat potassium drawn at 6 hours is 3.1 mEq/L." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus24_case_elder_neglect_med_mismanagement_01/background_discharge_plan",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus24_case_elder_neglect_med_mismanagement_01/ed_initial_findings_orders",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.2", sourceUnit: "C", sourceSpan: "Vitals: T 36.2 C, HR 48, BP 88/52, RR 20, SpO2 93% room air." },
      { label: "hr", value: "48", sourceUnit: "bpm", sourceSpan: "Vitals: T 36.2 C, HR 48, BP 88/52, RR 20, SpO2 93% room air." },
      { label: "sbp", value: "88", sourceUnit: "mmHg", sourceSpan: "Vitals: T 36.2 C, HR 48, BP 88/52, RR 20, SpO2 93% room air." },
      { label: "dbp", value: "52", sourceUnit: "mmHg", sourceSpan: "Vitals: T 36.2 C, HR 48, BP 88/52, RR 20, SpO2 93% room air." },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "Vitals: T 36.2 C, HR 48, BP 88/52, RR 20, SpO2 93% room air." },
      { label: "spo2", value: "93", sourceUnit: "%", sourceSpan: "Vitals: T 36.2 C, HR 48, BP 88/52, RR 20, SpO2 93% room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus24_case_elder_neglect_med_mismanagement_01/home_visit_day10_assessment",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.4", sourceUnit: "C", sourceSpan: "Vitals: T 36.4 C, HR 54, BP 92/58, RR 18, SpO2 94% room air." },
      { label: "hr", value: "54", sourceUnit: "bpm", sourceSpan: "Vitals: T 36.4 C, HR 54, BP 92/58, RR 18, SpO2 94% room air." },
      { label: "sbp", value: "92", sourceUnit: "mmHg", sourceSpan: "Vitals: T 36.4 C, HR 54, BP 92/58, RR 18, SpO2 94% room air." },
      { label: "dbp", value: "58", sourceUnit: "mmHg", sourceSpan: "Vitals: T 36.4 C, HR 54, BP 92/58, RR 18, SpO2 94% room air." },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Vitals: T 36.4 C, HR 54, BP 92/58, RR 18, SpO2 94% room air." },
      { label: "spo2", value: "94", sourceUnit: "%", sourceSpan: "Vitals: T 36.4 C, HR 54, BP 92/58, RR 18, SpO2 94% room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus24_case_elder_neglect_med_mismanagement_01/six_hour_response",
    lane: "extract",
    panel: [
      { label: "sodium", value: "146", sourceUnit: "mEq/L", sourceSpan: "After normal saline, IV potassium, and IV magnesium: sodium 146 mEq/L, potassium 3.4 mEq/L, creatinine 1.6 mg/dL, eGFR 33 mL/min/1.73 m2, magnesium 1.8 mEq/L, blood glucose 198 mg/dL.", context: "post_intervention" },
      { label: "potassium", value: "3.4", sourceUnit: "mEq/L", sourceSpan: "After normal saline, IV potassium, and IV magnesium: sodium 146 mEq/L, potassium 3.4 mEq/L, creatinine 1.6 mg/dL, eGFR 33 mL/min/1.73 m2, magnesium 1.8 mEq/L, blood glucose 198 mg/dL.", context: "post_intervention" },
      { label: "creatinine", value: "1.6", sourceUnit: "mg/dL", sourceSpan: "After normal saline, IV potassium, and IV magnesium: sodium 146 mEq/L, potassium 3.4 mEq/L, creatinine 1.6 mg/dL, eGFR 33 mL/min/1.73 m2, magnesium 1.8 mEq/L, blood glucose 198 mg/dL.", context: "post_intervention" },
      { label: "magnesium", value: "1.8", sourceUnit: "mEq/L", sourceSpan: "After normal saline, IV potassium, and IV magnesium: sodium 146 mEq/L, potassium 3.4 mEq/L, creatinine 1.6 mg/dL, eGFR 33 mL/min/1.73 m2, magnesium 1.8 mEq/L, blood glucose 198 mg/dL.", context: "post_intervention" },
      { label: "glucose", value: "198", sourceUnit: "mg/dL", sourceSpan: "After normal saline, IV potassium, and IV magnesium: sodium 146 mEq/L, potassium 3.4 mEq/L, creatinine 1.6 mg/dL, eGFR 33 mL/min/1.73 m2, magnesium 1.8 mEq/L, blood glucose 198 mg/dL.", context: "post_intervention" },
      { label: "temp", value: "36.6", sourceUnit: "C", sourceSpan: "Vitals: T 36.6 C, HR 62, BP 100/64, RR 18, SpO2 96% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "hr", value: "62", sourceUnit: "bpm", sourceSpan: "Vitals: T 36.6 C, HR 62, BP 100/64, RR 18, SpO2 96% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "sbp", value: "100", sourceUnit: "mmHg", sourceSpan: "Vitals: T 36.6 C, HR 62, BP 100/64, RR 18, SpO2 96% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "dbp", value: "64", sourceUnit: "mmHg", sourceSpan: "Vitals: T 36.6 C, HR 62, BP 100/64, RR 18, SpO2 96% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Vitals: T 36.6 C, HR 62, BP 100/64, RR 18, SpO2 96% on 2 L nasal cannula.", context: "post_intervention" },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Vitals: T 36.6 C, HR 62, BP 100/64, RR 18, SpO2 96% on 2 L nasal cannula.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus26_case_refeeding_syndrome_01/admission_orders",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus26_case_refeeding_syndrome_01/baseline_record",
    lane: "extract",
    panel: [
      { label: "temp", value: "35.8", sourceUnit: "°C", sourceSpan: "Vital signs: T 35.8 °C (96.4 °F), HR 52, BP 88/54, RR 14, SpO2 99% on room air." },
      { label: "hr", value: "52", sourceUnit: "bpm", sourceSpan: "Vital signs: T 35.8 °C (96.4 °F), HR 52, BP 88/54, RR 14, SpO2 99% on room air." },
      { label: "sbp", value: "88", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 35.8 °C (96.4 °F), HR 52, BP 88/54, RR 14, SpO2 99% on room air." },
      { label: "dbp", value: "54", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 35.8 °C (96.4 °F), HR 52, BP 88/54, RR 14, SpO2 99% on room air." },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "Vital signs: T 35.8 °C (96.4 °F), HR 52, BP 88/54, RR 14, SpO2 99% on room air." },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "Vital signs: T 35.8 °C (96.4 °F), HR 52, BP 88/54, RR 14, SpO2 99% on room air." },
      { label: "sodium", value: "137", sourceUnit: "mEq/L", sourceSpan: "Labs: Na 137 mEq/L, K 3.6 mEq/L, Cl 100 mEq/L, CO2 26 mEq/L, BUN 18 mg/dL, Cr 0.9 mg/dL, glucose 62 mg/dL, Ca 8.8 mg/dL, Mg 1.9 mg/dL, phosphorus 3.1 mg/dL, albumin 3.0 g/dL, prealbumin 11 mg/dL, AST 48 U/L, ALT 52 U/L, WBC 3,200/uL, Hgb 10.8 g/dL, Hct 32%, platelets 130,000/uL, TSH 2.4 mIU/L." },
      { label: "potassium", value: "3.6", sourceUnit: "mEq/L", sourceSpan: "Labs: Na 137 mEq/L, K 3.6 mEq/L, Cl 100 mEq/L, CO2 26 mEq/L, BUN 18 mg/dL, Cr 0.9 mg/dL, glucose 62 mg/dL, Ca 8.8 mg/dL, Mg 1.9 mg/dL, phosphorus 3.1 mg/dL, albumin 3.0 g/dL, prealbumin 11 mg/dL, AST 48 U/L, ALT 52 U/L, WBC 3,200/uL, Hgb 10.8 g/dL, Hct 32%, platelets 130,000/uL, TSH 2.4 mIU/L." },
      { label: "chloride", value: "100", sourceUnit: "mEq/L", sourceSpan: "Labs: Na 137 mEq/L, K 3.6 mEq/L, Cl 100 mEq/L, CO2 26 mEq/L, BUN 18 mg/dL, Cr 0.9 mg/dL, glucose 62 mg/dL, Ca 8.8 mg/dL, Mg 1.9 mg/dL, phosphorus 3.1 mg/dL, albumin 3.0 g/dL, prealbumin 11 mg/dL, AST 48 U/L, ALT 52 U/L, WBC 3,200/uL, Hgb 10.8 g/dL, Hct 32%, platelets 130,000/uL, TSH 2.4 mIU/L." },
      { label: "bicarbonate", value: "26", sourceUnit: "mEq/L", sourceSpan: "Labs: Na 137 mEq/L, K 3.6 mEq/L, Cl 100 mEq/L, CO2 26 mEq/L, BUN 18 mg/dL, Cr 0.9 mg/dL, glucose 62 mg/dL, Ca 8.8 mg/dL, Mg 1.9 mg/dL, phosphorus 3.1 mg/dL, albumin 3.0 g/dL, prealbumin 11 mg/dL, AST 48 U/L, ALT 52 U/L, WBC 3,200/uL, Hgb 10.8 g/dL, Hct 32%, platelets 130,000/uL, TSH 2.4 mIU/L." },
      { label: "bun", value: "18", sourceUnit: "mg/dL", sourceSpan: "Labs: Na 137 mEq/L, K 3.6 mEq/L, Cl 100 mEq/L, CO2 26 mEq/L, BUN 18 mg/dL, Cr 0.9 mg/dL, glucose 62 mg/dL, Ca 8.8 mg/dL, Mg 1.9 mg/dL, phosphorus 3.1 mg/dL, albumin 3.0 g/dL, prealbumin 11 mg/dL, AST 48 U/L, ALT 52 U/L, WBC 3,200/uL, Hgb 10.8 g/dL, Hct 32%, platelets 130,000/uL, TSH 2.4 mIU/L." },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "Labs: Na 137 mEq/L, K 3.6 mEq/L, Cl 100 mEq/L, CO2 26 mEq/L, BUN 18 mg/dL, Cr 0.9 mg/dL, glucose 62 mg/dL, Ca 8.8 mg/dL, Mg 1.9 mg/dL, phosphorus 3.1 mg/dL, albumin 3.0 g/dL, prealbumin 11 mg/dL, AST 48 U/L, ALT 52 U/L, WBC 3,200/uL, Hgb 10.8 g/dL, Hct 32%, platelets 130,000/uL, TSH 2.4 mIU/L." },
      { label: "glucose", value: "62", sourceUnit: "mg/dL", sourceSpan: "Labs: Na 137 mEq/L, K 3.6 mEq/L, Cl 100 mEq/L, CO2 26 mEq/L, BUN 18 mg/dL, Cr 0.9 mg/dL, glucose 62 mg/dL, Ca 8.8 mg/dL, Mg 1.9 mg/dL, phosphorus 3.1 mg/dL, albumin 3.0 g/dL, prealbumin 11 mg/dL, AST 48 U/L, ALT 52 U/L, WBC 3,200/uL, Hgb 10.8 g/dL, Hct 32%, platelets 130,000/uL, TSH 2.4 mIU/L." },
      { label: "calcium", value: "8.8", sourceUnit: "mg/dL", sourceSpan: "Labs: Na 137 mEq/L, K 3.6 mEq/L, Cl 100 mEq/L, CO2 26 mEq/L, BUN 18 mg/dL, Cr 0.9 mg/dL, glucose 62 mg/dL, Ca 8.8 mg/dL, Mg 1.9 mg/dL, phosphorus 3.1 mg/dL, albumin 3.0 g/dL, prealbumin 11 mg/dL, AST 48 U/L, ALT 52 U/L, WBC 3,200/uL, Hgb 10.8 g/dL, Hct 32%, platelets 130,000/uL, TSH 2.4 mIU/L." },
      { label: "magnesium", value: "1.9", sourceUnit: "mg/dL", sourceSpan: "Labs: Na 137 mEq/L, K 3.6 mEq/L, Cl 100 mEq/L, CO2 26 mEq/L, BUN 18 mg/dL, Cr 0.9 mg/dL, glucose 62 mg/dL, Ca 8.8 mg/dL, Mg 1.9 mg/dL, phosphorus 3.1 mg/dL, albumin 3.0 g/dL, prealbumin 11 mg/dL, AST 48 U/L, ALT 52 U/L, WBC 3,200/uL, Hgb 10.8 g/dL, Hct 32%, platelets 130,000/uL, TSH 2.4 mIU/L." },
      { label: "phosphate", value: "3.1", sourceUnit: "mg/dL", sourceSpan: "Labs: Na 137 mEq/L, K 3.6 mEq/L, Cl 100 mEq/L, CO2 26 mEq/L, BUN 18 mg/dL, Cr 0.9 mg/dL, glucose 62 mg/dL, Ca 8.8 mg/dL, Mg 1.9 mg/dL, phosphorus 3.1 mg/dL, albumin 3.0 g/dL, prealbumin 11 mg/dL, AST 48 U/L, ALT 52 U/L, WBC 3,200/uL, Hgb 10.8 g/dL, Hct 32%, platelets 130,000/uL, TSH 2.4 mIU/L." },
      { label: "ast", value: "48", sourceUnit: "U/L", sourceSpan: "Labs: Na 137 mEq/L, K 3.6 mEq/L, Cl 100 mEq/L, CO2 26 mEq/L, BUN 18 mg/dL, Cr 0.9 mg/dL, glucose 62 mg/dL, Ca 8.8 mg/dL, Mg 1.9 mg/dL, phosphorus 3.1 mg/dL, albumin 3.0 g/dL, prealbumin 11 mg/dL, AST 48 U/L, ALT 52 U/L, WBC 3,200/uL, Hgb 10.8 g/dL, Hct 32%, platelets 130,000/uL, TSH 2.4 mIU/L." },
      { label: "alt", value: "52", sourceUnit: "U/L", sourceSpan: "Labs: Na 137 mEq/L, K 3.6 mEq/L, Cl 100 mEq/L, CO2 26 mEq/L, BUN 18 mg/dL, Cr 0.9 mg/dL, glucose 62 mg/dL, Ca 8.8 mg/dL, Mg 1.9 mg/dL, phosphorus 3.1 mg/dL, albumin 3.0 g/dL, prealbumin 11 mg/dL, AST 48 U/L, ALT 52 U/L, WBC 3,200/uL, Hgb 10.8 g/dL, Hct 32%, platelets 130,000/uL, TSH 2.4 mIU/L." },
      { label: "wbc", value: "3,200", sourceUnit: "/uL", sourceSpan: "Labs: Na 137 mEq/L, K 3.6 mEq/L, Cl 100 mEq/L, CO2 26 mEq/L, BUN 18 mg/dL, Cr 0.9 mg/dL, glucose 62 mg/dL, Ca 8.8 mg/dL, Mg 1.9 mg/dL, phosphorus 3.1 mg/dL, albumin 3.0 g/dL, prealbumin 11 mg/dL, AST 48 U/L, ALT 52 U/L, WBC 3,200/uL, Hgb 10.8 g/dL, Hct 32%, platelets 130,000/uL, TSH 2.4 mIU/L." },
      { label: "hemoglobin", value: "10.8", sourceUnit: "g/dL", sourceSpan: "Labs: Na 137 mEq/L, K 3.6 mEq/L, Cl 100 mEq/L, CO2 26 mEq/L, BUN 18 mg/dL, Cr 0.9 mg/dL, glucose 62 mg/dL, Ca 8.8 mg/dL, Mg 1.9 mg/dL, phosphorus 3.1 mg/dL, albumin 3.0 g/dL, prealbumin 11 mg/dL, AST 48 U/L, ALT 52 U/L, WBC 3,200/uL, Hgb 10.8 g/dL, Hct 32%, platelets 130,000/uL, TSH 2.4 mIU/L." },
      { label: "hematocrit", value: "32", sourceUnit: "%", sourceSpan: "Labs: Na 137 mEq/L, K 3.6 mEq/L, Cl 100 mEq/L, CO2 26 mEq/L, BUN 18 mg/dL, Cr 0.9 mg/dL, glucose 62 mg/dL, Ca 8.8 mg/dL, Mg 1.9 mg/dL, phosphorus 3.1 mg/dL, albumin 3.0 g/dL, prealbumin 11 mg/dL, AST 48 U/L, ALT 52 U/L, WBC 3,200/uL, Hgb 10.8 g/dL, Hct 32%, platelets 130,000/uL, TSH 2.4 mIU/L." },
      { label: "platelets", value: "130,000", sourceUnit: "/uL", sourceSpan: "Labs: Na 137 mEq/L, K 3.6 mEq/L, Cl 100 mEq/L, CO2 26 mEq/L, BUN 18 mg/dL, Cr 0.9 mg/dL, glucose 62 mg/dL, Ca 8.8 mg/dL, Mg 1.9 mg/dL, phosphorus 3.1 mg/dL, albumin 3.0 g/dL, prealbumin 11 mg/dL, AST 48 U/L, ALT 52 U/L, WBC 3,200/uL, Hgb 10.8 g/dL, Hct 32%, platelets 130,000/uL, TSH 2.4 mIU/L." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus26_case_refeeding_syndrome_01/stage_18h_update",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.0", sourceUnit: "°C", sourceSpan: "Vital signs: T 36.0 °C, HR 58, BP 90/58, RR 16, SpO2 99%.", context: "post_intervention" },
      { label: "hr", value: "58", sourceUnit: "bpm", sourceSpan: "Vital signs: T 36.0 °C, HR 58, BP 90/58, RR 16, SpO2 99%.", context: "post_intervention" },
      { label: "sbp", value: "90", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.0 °C, HR 58, BP 90/58, RR 16, SpO2 99%.", context: "post_intervention" },
      { label: "dbp", value: "58", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.0 °C, HR 58, BP 90/58, RR 16, SpO2 99%.", context: "post_intervention" },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Vital signs: T 36.0 °C, HR 58, BP 90/58, RR 16, SpO2 99%.", context: "post_intervention" },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "Vital signs: T 36.0 °C, HR 58, BP 90/58, RR 16, SpO2 99%.", context: "post_intervention" },
      { label: "potassium", value: "3.4", sourceUnit: "mEq/L", sourceSpan: "12-hour repeat labs: K 3.4 mEq/L, phosphorus 2.4 mg/dL, Mg 1.7 mg/dL, glucose 78 mg/dL, Ca 8.6 mg/dL.", context: "post_intervention" },
      { label: "phosphate", value: "2.4", sourceUnit: "mg/dL", sourceSpan: "12-hour repeat labs: K 3.4 mEq/L, phosphorus 2.4 mg/dL, Mg 1.7 mg/dL, glucose 78 mg/dL, Ca 8.6 mg/dL.", context: "post_intervention" },
      { label: "magnesium", value: "1.7", sourceUnit: "mg/dL", sourceSpan: "12-hour repeat labs: K 3.4 mEq/L, phosphorus 2.4 mg/dL, Mg 1.7 mg/dL, glucose 78 mg/dL, Ca 8.6 mg/dL.", context: "post_intervention" },
      { label: "glucose", value: "78", sourceUnit: "mg/dL", sourceSpan: "12-hour repeat labs: K 3.4 mEq/L, phosphorus 2.4 mg/dL, Mg 1.7 mg/dL, glucose 78 mg/dL, Ca 8.6 mg/dL.", context: "post_intervention" },
      { label: "calcium", value: "8.6", sourceUnit: "mg/dL", sourceSpan: "12-hour repeat labs: K 3.4 mEq/L, phosphorus 2.4 mg/dL, Mg 1.7 mg/dL, glucose 78 mg/dL, Ca 8.6 mg/dL.", context: "post_intervention" }
    ],
    excludedValues: [
      { label: "phosphate", value: "3.1", reason: "trend", sourceSpan: "The nurse notes that phosphorus dropped from 3.1 to 2.4 mg/dL and potassium from 3.6 to 3.4 mEq/L since admission." },
      { label: "potassium", value: "3.6", reason: "trend", sourceSpan: "The nurse notes that phosphorus dropped from 3.1 to 2.4 mg/dL and potassium from 3.6 to 3.4 mEq/L since admission." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "opus26_case_refeeding_syndrome_01/stage_36h_update",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.2", sourceUnit: "°C", sourceSpan: "Vital signs: T 36.2 °C, HR 64, BP 92/60, RR 18, SpO2 98%.", context: "post_intervention" },
      { label: "hr", value: "64", sourceUnit: "bpm", sourceSpan: "Vital signs: T 36.2 °C, HR 64, BP 92/60, RR 18, SpO2 98%.", context: "post_intervention" },
      { label: "sbp", value: "92", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.2 °C, HR 64, BP 92/60, RR 18, SpO2 98%.", context: "post_intervention" },
      { label: "dbp", value: "60", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.2 °C, HR 64, BP 92/60, RR 18, SpO2 98%.", context: "post_intervention" },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Vital signs: T 36.2 °C, HR 64, BP 92/60, RR 18, SpO2 98%.", context: "post_intervention" },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "Vital signs: T 36.2 °C, HR 64, BP 92/60, RR 18, SpO2 98%.", context: "post_intervention" },
      { label: "potassium", value: "3.1", sourceUnit: "mEq/L", sourceSpan: "36-hour labs: K 3.1 mEq/L, phosphorus 1.9 mg/dL, Mg 1.4 mg/dL, glucose 88 mg/dL, Ca 8.2 mg/dL.", context: "post_intervention" },
      { label: "phosphate", value: "1.9", sourceUnit: "mg/dL", sourceSpan: "36-hour labs: K 3.1 mEq/L, phosphorus 1.9 mg/dL, Mg 1.4 mg/dL, glucose 88 mg/dL, Ca 8.2 mg/dL.", context: "post_intervention" },
      { label: "magnesium", value: "1.4", sourceUnit: "mg/dL", sourceSpan: "36-hour labs: K 3.1 mEq/L, phosphorus 1.9 mg/dL, Mg 1.4 mg/dL, glucose 88 mg/dL, Ca 8.2 mg/dL.", context: "post_intervention" },
      { label: "glucose", value: "88", sourceUnit: "mg/dL", sourceSpan: "36-hour labs: K 3.1 mEq/L, phosphorus 1.9 mg/dL, Mg 1.4 mg/dL, glucose 88 mg/dL, Ca 8.2 mg/dL.", context: "post_intervention" },
      { label: "calcium", value: "8.2", sourceUnit: "mg/dL", sourceSpan: "36-hour labs: K 3.1 mEq/L, phosphorus 1.9 mg/dL, Mg 1.4 mg/dL, glucose 88 mg/dL, Ca 8.2 mg/dL.", context: "post_intervention" }
    ],
    excludedValues: [
      { label: "phosphate", value: "2.4", reason: "prior", sourceSpan: "Oral sodium phosphate was initiated per protocol for phosphorus 2.4 mg/dL, and caloric advancement was held." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "opus26_case_refeeding_syndrome_01/stage_60h_update",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.4", sourceUnit: "°C", sourceSpan: "Vital signs: T 36.4 °C, HR 68, BP 96/62, RR 16, SpO2 99%.", context: "post_intervention" },
      { label: "hr", value: "68", sourceUnit: "bpm", sourceSpan: "Vital signs: T 36.4 °C, HR 68, BP 96/62, RR 16, SpO2 99%.", context: "post_intervention" },
      { label: "sbp", value: "96", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.4 °C, HR 68, BP 96/62, RR 16, SpO2 99%.", context: "post_intervention" },
      { label: "dbp", value: "62", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.4 °C, HR 68, BP 96/62, RR 16, SpO2 99%.", context: "post_intervention" },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Vital signs: T 36.4 °C, HR 68, BP 96/62, RR 16, SpO2 99%.", context: "post_intervention" },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "Vital signs: T 36.4 °C, HR 68, BP 96/62, RR 16, SpO2 99%.", context: "post_intervention" },
      { label: "potassium", value: "3.8", sourceUnit: "mEq/L", sourceSpan: "60-hour labs: K 3.8 mEq/L, phosphorus 2.8 mg/dL, Mg 1.8 mg/dL, glucose 92 mg/dL, Ca 8.7 mg/dL.", context: "post_intervention" },
      { label: "phosphate", value: "2.8", sourceUnit: "mg/dL", sourceSpan: "60-hour labs: K 3.8 mEq/L, phosphorus 2.8 mg/dL, Mg 1.8 mg/dL, glucose 92 mg/dL, Ca 8.7 mg/dL.", context: "post_intervention" },
      { label: "magnesium", value: "1.8", sourceUnit: "mg/dL", sourceSpan: "60-hour labs: K 3.8 mEq/L, phosphorus 2.8 mg/dL, Mg 1.8 mg/dL, glucose 92 mg/dL, Ca 8.7 mg/dL.", context: "post_intervention" },
      { label: "glucose", value: "92", sourceUnit: "mg/dL", sourceSpan: "60-hour labs: K 3.8 mEq/L, phosphorus 2.8 mg/dL, Mg 1.8 mg/dL, glucose 92 mg/dL, Ca 8.7 mg/dL.", context: "post_intervention" },
      { label: "calcium", value: "8.7", sourceUnit: "mg/dL", sourceSpan: "60-hour labs: K 3.8 mEq/L, phosphorus 2.8 mg/dL, Mg 1.8 mg/dL, glucose 92 mg/dL, Ca 8.7 mg/dL.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus27_case_ipv_prenatal_care_01/ex2_initial_assessment",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "C", sourceSpan: "Vital signs: T 36.8 C, HR 82/min, BP 118/74 mm Hg, RR 16/min, SpO2 99% on room air." },
      { label: "hr", value: "82", sourceUnit: "bpm", sourceSpan: "Vital signs: T 36.8 C, HR 82/min, BP 118/74 mm Hg, RR 16/min, SpO2 99% on room air." },
      { label: "sbp", value: "118", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 36.8 C, HR 82/min, BP 118/74 mm Hg, RR 16/min, SpO2 99% on room air." },
      { label: "dbp", value: "74", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 36.8 C, HR 82/min, BP 118/74 mm Hg, RR 16/min, SpO2 99% on room air." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Vital signs: T 36.8 C, HR 82/min, BP 118/74 mm Hg, RR 16/min, SpO2 99% on room air." },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "Vital signs: T 36.8 C, HR 82/min, BP 118/74 mm Hg, RR 16/min, SpO2 99% on room air." },
      { label: "hemoglobin", value: "11.4", sourceUnit: "g/dL", sourceSpan: "Hemoglobin is 11.4 g/dL, hematocrit 34%, and platelets 218,000/mcL." },
      { label: "hematocrit", value: "34", sourceUnit: "%", sourceSpan: "Hemoglobin is 11.4 g/dL, hematocrit 34%, and platelets 218,000/mcL." },
      { label: "platelets", value: "218,000", sourceUnit: "/mcL", sourceSpan: "Hemoglobin is 11.4 g/dL, hematocrit 34%, and platelets 218,000/mcL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus3_iv_potassium_safety_case_01/exhibit_stage1_labs_orders",
    lane: "extract",
    panel: [
      { label: "potassium", value: "2.8", sourceUnit: "mEq/L", sourceSpan: "Laboratory results: potassium 2.8 mEq/L, magnesium 1.4 mg/dL, sodium 137 mEq/L, creatinine 1.1 mg/dL, BUN 20 mg/dL, glucose 108 mg/dL." },
      { label: "magnesium", value: "1.4", sourceUnit: "mg/dL", sourceSpan: "Laboratory results: potassium 2.8 mEq/L, magnesium 1.4 mg/dL, sodium 137 mEq/L, creatinine 1.1 mg/dL, BUN 20 mg/dL, glucose 108 mg/dL." },
      { label: "sodium", value: "137", sourceUnit: "mEq/L", sourceSpan: "Laboratory results: potassium 2.8 mEq/L, magnesium 1.4 mg/dL, sodium 137 mEq/L, creatinine 1.1 mg/dL, BUN 20 mg/dL, glucose 108 mg/dL." },
      { label: "creatinine", value: "1.1", sourceUnit: "mg/dL", sourceSpan: "Laboratory results: potassium 2.8 mEq/L, magnesium 1.4 mg/dL, sodium 137 mEq/L, creatinine 1.1 mg/dL, BUN 20 mg/dL, glucose 108 mg/dL." },
      { label: "bun", value: "20", sourceUnit: "mg/dL", sourceSpan: "Laboratory results: potassium 2.8 mEq/L, magnesium 1.4 mg/dL, sodium 137 mEq/L, creatinine 1.1 mg/dL, BUN 20 mg/dL, glucose 108 mg/dL." },
      { label: "glucose", value: "108", sourceUnit: "mg/dL", sourceSpan: "Laboratory results: potassium 2.8 mEq/L, magnesium 1.4 mg/dL, sodium 137 mEq/L, creatinine 1.1 mg/dL, BUN 20 mg/dL, glucose 108 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus3_iv_potassium_safety_case_01/exhibit_stage2_revised_plan",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus3_iv_potassium_safety_case_01/exhibit_stage3_status",
    lane: "extract",
    panel: [
      { label: "potassium", value: "3.2", sourceUnit: "mEq/L", sourceSpan: "Repeat point-of-care potassium drawn early during replacement is 3.2 mEq/L.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus4_case_postop_sbar_01/baseline_0700",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.6", sourceUnit: "°C", sourceSpan: "Vital signs: T 37.6 °C oral, HR 82 irregular, BP 134/78, RR 16, SpO₂ 95% on room air." },
      { label: "hr", value: "82", sourceUnit: "bpm", sourceSpan: "Vital signs: T 37.6 °C oral, HR 82 irregular, BP 134/78, RR 16, SpO₂ 95% on room air." },
      { label: "sbp", value: "134", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.6 °C oral, HR 82 irregular, BP 134/78, RR 16, SpO₂ 95% on room air." },
      { label: "dbp", value: "78", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.6 °C oral, HR 82 irregular, BP 134/78, RR 16, SpO₂ 95% on room air." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Vital signs: T 37.6 °C oral, HR 82 irregular, BP 134/78, RR 16, SpO₂ 95% on room air." },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "Vital signs: T 37.6 °C oral, HR 82 irregular, BP 134/78, RR 16, SpO₂ 95% on room air." }
    ],
    excludedValues: [
      { label: "creatinine", value: "1.4", reason: "prior", sourceSpan: "mild chronic kidney disease with baseline creatinine 1.4 mg/dL" }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "opus5_case_consent_interpreter_01/initial_assessment",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "°C", sourceSpan: "Baseline findings: T 36.8 °C, HR 78/min, BP 138/82 mm Hg, RR 14/min, SpO₂ 99% on room air." },
      { label: "hr", value: "78", sourceUnit: "bpm", sourceSpan: "Baseline findings: T 36.8 °C, HR 78/min, BP 138/82 mm Hg, RR 14/min, SpO₂ 99% on room air." },
      { label: "sbp", value: "138", sourceUnit: "mm Hg", sourceSpan: "Baseline findings: T 36.8 °C, HR 78/min, BP 138/82 mm Hg, RR 14/min, SpO₂ 99% on room air." },
      { label: "dbp", value: "82", sourceUnit: "mm Hg", sourceSpan: "Baseline findings: T 36.8 °C, HR 78/min, BP 138/82 mm Hg, RR 14/min, SpO₂ 99% on room air." },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "Baseline findings: T 36.8 °C, HR 78/min, BP 138/82 mm Hg, RR 14/min, SpO₂ 99% on room air." },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "Baseline findings: T 36.8 °C, HR 78/min, BP 138/82 mm Hg, RR 14/min, SpO₂ 99% on room air." },
      { label: "glucose", value: "142", sourceUnit: "mg/dL", sourceSpan: "Capillary blood glucose 142 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
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

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-13-scattered-2026-07-05.json",
  `${JSON.stringify(batch13Records, null, 2)}\n`,
);

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-14-scattered-2026-07-06.json",
  `${JSON.stringify(batch14Records, null, 2)}\n`,
);

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-15-scattered-2026-07-06.json",
  `${JSON.stringify(batch15Records, null, 2)}\n`,
);

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-16-scattered-2026-07-06.json",
  `${JSON.stringify(batch16Records, null, 2)}\n`,
);

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-17-scattered-2026-07-06.json",
  `${JSON.stringify(batch17Records, null, 2)}\n`,
);

console.log(`Wrote ${batch10Records.length} Batch 10 scattered records, ${batch11Records.length} Batch 11 scattered records, ${batch12Records.length} Batch 12 scattered records, ${batch13Records.length} Batch 13 scattered records, ${batch14Records.length} Batch 14 scattered records, ${batch15Records.length} Batch 15 scattered records, ${batch16Records.length} Batch 16 scattered records, and ${batch17Records.length} Batch 17 scattered records.`);
