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

const batch02Records: ExtractionRecord[] = [
  {
    exhibitRef: "case_ami_01/ex_vitals_new",
    lane: "extract",
    panel: [
      { label: "sbp", value: "80", sourceUnit: "mmHg", sourceSpan: "BP: 80/50 mmHg, HR: 110 bpm, RR: 24 bpm, Crackles in all lung fields." },
      { label: "dbp", value: "50", sourceUnit: "mmHg", sourceSpan: "BP: 80/50 mmHg, HR: 110 bpm, RR: 24 bpm, Crackles in all lung fields." },
      { label: "hr", value: "110", sourceUnit: "bpm", sourceSpan: "BP: 80/50 mmHg, HR: 110 bpm, RR: 24 bpm, Crackles in all lung fields." },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "BP: 80/50 mmHg, HR: 110 bpm, RR: 24 bpm, Crackles in all lung fields." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "case_preeclampsia_magnesium_01/orders",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "case_sepsis_pneumonia_01/sepsis_orders",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "case_sepsis_pneumonia_01/triage",
    lane: "extract",
    panel: [
      { label: "temp", value: "39.2", sourceUnit: "C", sourceSpan: "Vital signs: T 39.2 C, HR 118/min, RR 30/min, BP 92/54 mm Hg, SpO2 90% on room air." },
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "Vital signs: T 39.2 C, HR 118/min, RR 30/min, BP 92/54 mm Hg, SpO2 90% on room air." },
      { label: "rr", value: "30", sourceUnit: "/min", sourceSpan: "Vital signs: T 39.2 C, HR 118/min, RR 30/min, BP 92/54 mm Hg, SpO2 90% on room air." },
      { label: "sbp", value: "92", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 39.2 C, HR 118/min, RR 30/min, BP 92/54 mm Hg, SpO2 90% on room air." },
      { label: "dbp", value: "54", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 39.2 C, HR 118/min, RR 30/min, BP 92/54 mm Hg, SpO2 90% on room air." },
      { label: "spo2", value: "90", sourceUnit: "%", sourceSpan: "Vital signs: T 39.2 C, HR 118/min, RR 30/min, BP 92/54 mm Hg, SpO2 90% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "claude_cs_jun06_cdiff_sic_01/assessment",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.1", sourceUnit: "C", sourceSpan: "Temperature 38.1 C, mild abdominal cramping." },
      { label: "wbc", value: "14,000", sourceUnit: "/mm3", sourceSpan: "WBC 14,000/mm3." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "claude_cs_jun06_chest_tube_rrp_01/drainage_obs",
    lane: "extract",
    panel: [
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "SpO2 95% on 2 L nasal cannula." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "claude_cs_jun06_chest_tube_rrp_01/incident",
    lane: "extract",
    panel: [
      { label: "spo2", value: "89", sourceUnit: "%", sourceSpan: "SpO2 is now 89%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "cs_ckd_01/assessment",
    lane: "extract",
    panel: [
      { label: "sbp", value: "162", sourceUnit: "mmHg", sourceSpan: "BP: 162/94 mmHg." },
      { label: "dbp", value: "94", sourceUnit: "mmHg", sourceSpan: "BP: 162/94 mmHg." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "cs_copd_01/labs",
    lane: "extract",
    panel: [
      { label: "ph", value: "7.31", sourceUnit: "(unitless)", sourceSpan: "pH: 7.31" },
      { label: "paco2", value: "58", sourceUnit: "mmHg", sourceSpan: "PaCO2: 58 mmHg" },
      { label: "pao2", value: "54", sourceUnit: "mmHg", sourceSpan: "PaO2: 54 mmHg" },
      { label: "hco3_abg", value: "28", sourceUnit: "mEq/L", sourceSpan: "HCO3: 28 mEq/L" },
      { label: "sao2", value: "85", sourceUnit: "%", sourceSpan: "SaO2: 85%" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "cs_ngn_001_anorexia/ex_001_labs",
    lane: "extract",
    panel: [
      { label: "sodium", value: "136", sourceUnit: "mEq/L", sourceSpan: "Sodium: 136 mEq/L, Potassium: 3.1 mEq/L, Phosphorus: 2.2 mg/dL, Magnesium: 1.4 mg/dL, Glucose: 62 mg/dL." },
      { label: "potassium", value: "3.1", sourceUnit: "mEq/L", sourceSpan: "Sodium: 136 mEq/L, Potassium: 3.1 mEq/L, Phosphorus: 2.2 mg/dL, Magnesium: 1.4 mg/dL, Glucose: 62 mg/dL." },
      { label: "phosphate", value: "2.2", sourceUnit: "mg/dL", sourceSpan: "Sodium: 136 mEq/L, Potassium: 3.1 mEq/L, Phosphorus: 2.2 mg/dL, Magnesium: 1.4 mg/dL, Glucose: 62 mg/dL." },
      { label: "magnesium", value: "1.4", sourceUnit: "mg/dL", sourceSpan: "Sodium: 136 mEq/L, Potassium: 3.1 mEq/L, Phosphorus: 2.2 mg/dL, Magnesium: 1.4 mg/dL, Glucose: 62 mg/dL." },
      { label: "glucose", value: "62", sourceUnit: "mg/dL", sourceSpan: "Sodium: 136 mEq/L, Potassium: 3.1 mEq/L, Phosphorus: 2.2 mg/dL, Magnesium: 1.4 mg/dL, Glucose: 62 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "cs_ngn_004_blood/ex_004_vitals",
    lane: "extract",
    panel: [
      { label: "sbp", value: "90", sourceUnit: "mmHg", sourceSpan: "BP: 90/50 mmHg, HR: 115 bpm, RR: 24 breaths/min, Temp: 38.5°C." },
      { label: "dbp", value: "50", sourceUnit: "mmHg", sourceSpan: "BP: 90/50 mmHg, HR: 115 bpm, RR: 24 breaths/min, Temp: 38.5°C." },
      { label: "hr", value: "115", sourceUnit: "bpm", sourceSpan: "BP: 90/50 mmHg, HR: 115 bpm, RR: 24 breaths/min, Temp: 38.5°C." },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "BP: 90/50 mmHg, HR: 115 bpm, RR: 24 breaths/min, Temp: 38.5°C." },
      { label: "temp", value: "38.5", sourceUnit: "°C", sourceSpan: "BP: 90/50 mmHg, HR: 115 bpm, RR: 24 breaths/min, Temp: 38.5°C." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "cs_ngn_007_dic/ex_007_labs",
    lane: "extract",
    panel: [
      { label: "platelets", value: "45,000", sourceUnit: "/mm3", sourceSpan: "Platelets: 45,000/mm3, PT: 24 sec, PTT: 80 sec, D-Dimer: High, Fibrinogen: 120 mg/dL." },
      { label: "ptt", value: "80", sourceUnit: "sec", sourceSpan: "Platelets: 45,000/mm3, PT: 24 sec, PTT: 80 sec, D-Dimer: High, Fibrinogen: 120 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "cs_ngn_010_ad/ex_010_vitals",
    lane: "extract",
    panel: [
      { label: "sbp", value: "210", sourceUnit: "mmHg", sourceSpan: "BP: 210/110 mmHg, HR: 50 bpm (Bradycardia)." },
      { label: "dbp", value: "110", sourceUnit: "mmHg", sourceSpan: "BP: 210/110 mmHg, HR: 50 bpm (Bradycardia)." },
      { label: "hr", value: "50", sourceUnit: "bpm", sourceSpan: "BP: 210/110 mmHg, HR: 50 bpm (Bradycardia)." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "cs_stemi_vfib_04/arrest_1415",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gemini_gap_case_chronic_hf_05/ex1_hf_clinic_visit",
    lane: "extract",
    panel: [
      { label: "sbp", value: "116", sourceUnit: "mmHg", sourceSpan: "- Blood pressure: 116/70 mmHg" },
      { label: "dbp", value: "70", sourceUnit: "mmHg", sourceSpan: "- Blood pressure: 116/70 mmHg" },
      { label: "hr", value: "64", sourceUnit: "bpm", sourceSpan: "- Heart rate: 64 bpm" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gemini_gap_case_cirrhosis_homecare_04/ex1_cirrhosis_clinic_note",
    lane: "extract",
    panel: [
      { label: "sbp", value: "112", sourceUnit: "mmHg", sourceSpan: "- Blood pressure: 112/68 mmHg" },
      { label: "dbp", value: "68", sourceUnit: "mmHg", sourceSpan: "- Blood pressure: 112/68 mmHg" },
      { label: "hr", value: "76", sourceUnit: "bpm", sourceSpan: "- Heart rate: 76 bpm" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gemini_gap_case_hypertension_lifestyle_02/ex1_htn_baseline",
    lane: "extract",
    panel: [
      { label: "sbp", value: "136", sourceUnit: "mmHg", sourceSpan: "- Blood pressure: 136/88 mmHg (seated, average of 2 readings; prior visit was 138/86 mmHg)." },
      { label: "dbp", value: "88", sourceUnit: "mmHg", sourceSpan: "- Blood pressure: 136/88 mmHg (seated, average of 2 readings; prior visit was 138/86 mmHg)." }
    ],
    excludedValues: [
      { label: "sbp", value: "138", reason: "prior", sourceSpan: "- Blood pressure: 136/88 mmHg (seated, average of 2 readings; prior visit was 138/86 mmHg)." },
      { label: "dbp", value: "86", reason: "prior", sourceSpan: "- Blood pressure: 136/88 mmHg (seated, average of 2 readings; prior visit was 138/86 mmHg)." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gemini_gap_case_pediatric_diabetes_03/ex1_ped_dm_orders",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gemini_gap_case_pediatric_diabetes_03/ex2_school_exercise",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gemini_gapfill_case_2026_06_10_case_caregiver_08/history",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  }
];

const batch03Records: ExtractionRecord[] = [
  {
    exhibitRef: "gemini_gapfill_case_2026_06_10_case_wellness_03/labs",
    lane: "extract",
    panel: [
      { label: "glucose", value: "145", sourceUnit: "mg/dL", sourceSpan: "Fasting blood glucose: 145 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_13_case_delirium_uti_01/initial_history",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/baseline_labs",
    lane: "extract",
    panel: [
      { label: "hemoglobin", value: "11.8", sourceUnit: "g/dL", sourceSpan: "Hemoglobin 11.8 g/dL; hematocrit 35%; platelets 238,000/µL; AST 22 U/L; ALT 18 U/L; creatinine 0.7 mg/dL; uric acid 4.1 mg/dL; LDH 162 U/L; urinalysis negative for protein." },
      { label: "hematocrit", value: "35", sourceUnit: "%", sourceSpan: "Hemoglobin 11.8 g/dL; hematocrit 35%; platelets 238,000/µL; AST 22 U/L; ALT 18 U/L; creatinine 0.7 mg/dL; uric acid 4.1 mg/dL; LDH 162 U/L; urinalysis negative for protein." },
      { label: "platelets", value: "238,000", sourceUnit: "/µL", sourceSpan: "Hemoglobin 11.8 g/dL; hematocrit 35%; platelets 238,000/µL; AST 22 U/L; ALT 18 U/L; creatinine 0.7 mg/dL; uric acid 4.1 mg/dL; LDH 162 U/L; urinalysis negative for protein." },
      { label: "ast", value: "22", sourceUnit: "U/L", sourceSpan: "Hemoglobin 11.8 g/dL; hematocrit 35%; platelets 238,000/µL; AST 22 U/L; ALT 18 U/L; creatinine 0.7 mg/dL; uric acid 4.1 mg/dL; LDH 162 U/L; urinalysis negative for protein." },
      { label: "alt", value: "18", sourceUnit: "U/L", sourceSpan: "Hemoglobin 11.8 g/dL; hematocrit 35%; platelets 238,000/µL; AST 22 U/L; ALT 18 U/L; creatinine 0.7 mg/dL; uric acid 4.1 mg/dL; LDH 162 U/L; urinalysis negative for protein." },
      { label: "creatinine", value: "0.7", sourceUnit: "mg/dL", sourceSpan: "Hemoglobin 11.8 g/dL; hematocrit 35%; platelets 238,000/µL; AST 22 U/L; ALT 18 U/L; creatinine 0.7 mg/dL; uric acid 4.1 mg/dL; LDH 162 U/L; urinalysis negative for protein." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage1_triage_call",
    lane: "extract",
    panel: [
      { label: "sbp", value: "162", sourceUnit: "mmHg", sourceSpan: "At 10:15 AM, the patient reports severe frontal headache 8/10 unrelieved by ibuprofen, intermittent visual spots, new facial/periorbital puffiness, and home BP 162/108 twice, five minutes apart." },
      { label: "dbp", value: "108", sourceUnit: "mmHg", sourceSpan: "At 10:15 AM, the patient reports severe frontal headache 8/10 unrelieved by ibuprofen, intermittent visual spots, new facial/periorbital puffiness, and home BP 162/108 twice, five minutes apart." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage2_breastfeeding_question",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage2_labs",
    lane: "extract",
    panel: [
      { label: "hemoglobin", value: "12.0", sourceUnit: "g/dL", sourceSpan: "Hemoglobin 12.0 g/dL; hematocrit 36%; platelets 195,000/µL; AST 34 U/L; ALT 28 U/L; creatinine 0.9 mg/dL; uric acid 6.8 mg/dL; LDH 198 U/L; INR 1.0; fibrinogen 380 mg/dL; urine protein-to-creatinine ratio 0.42." },
      { label: "hematocrit", value: "36", sourceUnit: "%", sourceSpan: "Hemoglobin 12.0 g/dL; hematocrit 36%; platelets 195,000/µL; AST 34 U/L; ALT 28 U/L; creatinine 0.9 mg/dL; uric acid 6.8 mg/dL; LDH 198 U/L; INR 1.0; fibrinogen 380 mg/dL; urine protein-to-creatinine ratio 0.42." },
      { label: "platelets", value: "195,000", sourceUnit: "/µL", sourceSpan: "Hemoglobin 12.0 g/dL; hematocrit 36%; platelets 195,000/µL; AST 34 U/L; ALT 28 U/L; creatinine 0.9 mg/dL; uric acid 6.8 mg/dL; LDH 198 U/L; INR 1.0; fibrinogen 380 mg/dL; urine protein-to-creatinine ratio 0.42." },
      { label: "ast", value: "34", sourceUnit: "U/L", sourceSpan: "Hemoglobin 12.0 g/dL; hematocrit 36%; platelets 195,000/µL; AST 34 U/L; ALT 28 U/L; creatinine 0.9 mg/dL; uric acid 6.8 mg/dL; LDH 198 U/L; INR 1.0; fibrinogen 380 mg/dL; urine protein-to-creatinine ratio 0.42." },
      { label: "alt", value: "28", sourceUnit: "U/L", sourceSpan: "Hemoglobin 12.0 g/dL; hematocrit 36%; platelets 195,000/µL; AST 34 U/L; ALT 28 U/L; creatinine 0.9 mg/dL; uric acid 6.8 mg/dL; LDH 198 U/L; INR 1.0; fibrinogen 380 mg/dL; urine protein-to-creatinine ratio 0.42." },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "Hemoglobin 12.0 g/dL; hematocrit 36%; platelets 195,000/µL; AST 34 U/L; ALT 28 U/L; creatinine 0.9 mg/dL; uric acid 6.8 mg/dL; LDH 198 U/L; INR 1.0; fibrinogen 380 mg/dL; urine protein-to-creatinine ratio 0.42." },
      { label: "inr", value: "1.0", sourceUnit: "(ratio)", sourceSpan: "Hemoglobin 12.0 g/dL; hematocrit 36%; platelets 195,000/µL; AST 34 U/L; ALT 28 U/L; creatinine 0.9 mg/dL; uric acid 6.8 mg/dL; LDH 198 U/L; INR 1.0; fibrinogen 380 mg/dL; urine protein-to-creatinine ratio 0.42." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_19_case_ici_pneumonitis_01/baseline_assessment",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.1", sourceUnit: "C", sourceSpan: "Vital signs: T 37.1 C, HR 92, BP 134/78, RR 20, SpO2 93% on room air." },
      { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: "Vital signs: T 37.1 C, HR 92, BP 134/78, RR 20, SpO2 93% on room air." },
      { label: "sbp", value: "134", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.1 C, HR 92, BP 134/78, RR 20, SpO2 93% on room air." },
      { label: "dbp", value: "78", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.1 C, HR 92, BP 134/78, RR 20, SpO2 93% on room air." },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "Vital signs: T 37.1 C, HR 92, BP 134/78, RR 20, SpO2 93% on room air." },
      { label: "spo2", value: "93", sourceUnit: "%", sourceSpan: "Vital signs: T 37.1 C, HR 92, BP 134/78, RR 20, SpO2 93% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_19_case_ici_pneumonitis_01/baseline_background",
    lane: "extract",
    panel: [],
    excludedValues: [
      { label: "spo2", value: "96", reason: "prior", sourceSpan: "Baseline SpO2 before therapy was 96% on room air with no oxygen requirement." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_19_case_ici_pneumonitis_01/baseline_labs",
    lane: "extract",
    panel: [
      { label: "wbc", value: "6.8", sourceUnit: "x 10^3/uL", sourceSpan: "WBC 6.8 x 10^3/uL, hemoglobin 11.4 g/dL, platelets 188,000/uL, BUN 14 mg/dL, creatinine 0.9 mg/dL, sodium 139 mEq/L, potassium 4.2 mEq/L, glucose 102 mg/dL, ALT 28 U/L, AST 31 U/L, TSH 2.4 mIU/L, CRP 18 mg/L (reference <5), LDH 240 U/L (reference 120-246)." },
      { label: "hemoglobin", value: "11.4", sourceUnit: "g/dL", sourceSpan: "WBC 6.8 x 10^3/uL, hemoglobin 11.4 g/dL, platelets 188,000/uL, BUN 14 mg/dL, creatinine 0.9 mg/dL, sodium 139 mEq/L, potassium 4.2 mEq/L, glucose 102 mg/dL, ALT 28 U/L, AST 31 U/L, TSH 2.4 mIU/L, CRP 18 mg/L (reference <5), LDH 240 U/L (reference 120-246)." },
      { label: "platelets", value: "188,000", sourceUnit: "/uL", sourceSpan: "WBC 6.8 x 10^3/uL, hemoglobin 11.4 g/dL, platelets 188,000/uL, BUN 14 mg/dL, creatinine 0.9 mg/dL, sodium 139 mEq/L, potassium 4.2 mEq/L, glucose 102 mg/dL, ALT 28 U/L, AST 31 U/L, TSH 2.4 mIU/L, CRP 18 mg/L (reference <5), LDH 240 U/L (reference 120-246)." },
      { label: "bun", value: "14", sourceUnit: "mg/dL", sourceSpan: "WBC 6.8 x 10^3/uL, hemoglobin 11.4 g/dL, platelets 188,000/uL, BUN 14 mg/dL, creatinine 0.9 mg/dL, sodium 139 mEq/L, potassium 4.2 mEq/L, glucose 102 mg/dL, ALT 28 U/L, AST 31 U/L, TSH 2.4 mIU/L, CRP 18 mg/L (reference <5), LDH 240 U/L (reference 120-246)." },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "WBC 6.8 x 10^3/uL, hemoglobin 11.4 g/dL, platelets 188,000/uL, BUN 14 mg/dL, creatinine 0.9 mg/dL, sodium 139 mEq/L, potassium 4.2 mEq/L, glucose 102 mg/dL, ALT 28 U/L, AST 31 U/L, TSH 2.4 mIU/L, CRP 18 mg/L (reference <5), LDH 240 U/L (reference 120-246)." },
      { label: "sodium", value: "139", sourceUnit: "mEq/L", sourceSpan: "WBC 6.8 x 10^3/uL, hemoglobin 11.4 g/dL, platelets 188,000/uL, BUN 14 mg/dL, creatinine 0.9 mg/dL, sodium 139 mEq/L, potassium 4.2 mEq/L, glucose 102 mg/dL, ALT 28 U/L, AST 31 U/L, TSH 2.4 mIU/L, CRP 18 mg/L (reference <5), LDH 240 U/L (reference 120-246)." },
      { label: "potassium", value: "4.2", sourceUnit: "mEq/L", sourceSpan: "WBC 6.8 x 10^3/uL, hemoglobin 11.4 g/dL, platelets 188,000/uL, BUN 14 mg/dL, creatinine 0.9 mg/dL, sodium 139 mEq/L, potassium 4.2 mEq/L, glucose 102 mg/dL, ALT 28 U/L, AST 31 U/L, TSH 2.4 mIU/L, CRP 18 mg/L (reference <5), LDH 240 U/L (reference 120-246)." },
      { label: "glucose", value: "102", sourceUnit: "mg/dL", sourceSpan: "WBC 6.8 x 10^3/uL, hemoglobin 11.4 g/dL, platelets 188,000/uL, BUN 14 mg/dL, creatinine 0.9 mg/dL, sodium 139 mEq/L, potassium 4.2 mEq/L, glucose 102 mg/dL, ALT 28 U/L, AST 31 U/L, TSH 2.4 mIU/L, CRP 18 mg/L (reference <5), LDH 240 U/L (reference 120-246)." },
      { label: "alt", value: "28", sourceUnit: "U/L", sourceSpan: "WBC 6.8 x 10^3/uL, hemoglobin 11.4 g/dL, platelets 188,000/uL, BUN 14 mg/dL, creatinine 0.9 mg/dL, sodium 139 mEq/L, potassium 4.2 mEq/L, glucose 102 mg/dL, ALT 28 U/L, AST 31 U/L, TSH 2.4 mIU/L, CRP 18 mg/L (reference <5), LDH 240 U/L (reference 120-246)." },
      { label: "ast", value: "31", sourceUnit: "U/L", sourceSpan: "WBC 6.8 x 10^3/uL, hemoglobin 11.4 g/dL, platelets 188,000/uL, BUN 14 mg/dL, creatinine 0.9 mg/dL, sodium 139 mEq/L, potassium 4.2 mEq/L, glucose 102 mg/dL, ALT 28 U/L, AST 31 U/L, TSH 2.4 mIU/L, CRP 18 mg/L (reference <5), LDH 240 U/L (reference 120-246)." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_19_case_ici_pneumonitis_01/stage_1_update",
    lane: "extract",
    panel: [
      { label: "spo2", value: "93", sourceUnit: "%", sourceSpan: "SpO2 is 93% on room air, down from the documented baseline of 96%." }
    ],
    excludedValues: [
      { label: "spo2", value: "96", reason: "prior", sourceSpan: "SpO2 is 93% on room air, down from the documented baseline of 96%." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_19_case_ici_pneumonitis_01/stage_2_diagnostics",
    lane: "extract",
    panel: [
      { label: "ph", value: "7.44", sourceUnit: "(unitless)", sourceSpan: "ABG on room air: pH 7.44, PaCO2 36 mmHg, PaO2 68 mmHg." },
      { label: "paco2", value: "36", sourceUnit: "mmHg", sourceSpan: "ABG on room air: pH 7.44, PaCO2 36 mmHg, PaO2 68 mmHg." },
      { label: "pao2", value: "68", sourceUnit: "mmHg", sourceSpan: "ABG on room air: pH 7.44, PaCO2 36 mmHg, PaO2 68 mmHg." },
      { label: "temp", value: "37.2", sourceUnit: "C", sourceSpan: "Repeat vitals: T 37.2 C, HR 98, BP 130/82, RR 22, SpO2 91% on room air." },
      { label: "hr", value: "98", sourceUnit: "bpm", sourceSpan: "Repeat vitals: T 37.2 C, HR 98, BP 130/82, RR 22, SpO2 91% on room air." },
      { label: "sbp", value: "130", sourceUnit: "mmHg", sourceSpan: "Repeat vitals: T 37.2 C, HR 98, BP 130/82, RR 22, SpO2 91% on room air." },
      { label: "dbp", value: "82", sourceUnit: "mmHg", sourceSpan: "Repeat vitals: T 37.2 C, HR 98, BP 130/82, RR 22, SpO2 91% on room air." },
      { label: "rr", value: "22", sourceUnit: "/min", sourceSpan: "Repeat vitals: T 37.2 C, HR 98, BP 130/82, RR 22, SpO2 91% on room air." },
      { label: "spo2", value: "91", sourceUnit: "%", sourceSpan: "Repeat vitals: T 37.2 C, HR 98, BP 130/82, RR 22, SpO2 91% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_19_case_ici_pneumonitis_01/stage_3_plan_teaching",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_2026_06_19_case_ici_pneumonitis_01/stage_3_response",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.0", sourceUnit: "C", sourceSpan: "Vitals: T 37.0 C, HR 86, BP 126/76, RR 18, SpO2 96% on 3 L nasal cannula." },
      { label: "hr", value: "86", sourceUnit: "bpm", sourceSpan: "Vitals: T 37.0 C, HR 86, BP 126/76, RR 18, SpO2 96% on 3 L nasal cannula." },
      { label: "sbp", value: "126", sourceUnit: "mmHg", sourceSpan: "Vitals: T 37.0 C, HR 86, BP 126/76, RR 18, SpO2 96% on 3 L nasal cannula." },
      { label: "dbp", value: "76", sourceUnit: "mmHg", sourceSpan: "Vitals: T 37.0 C, HR 86, BP 126/76, RR 18, SpO2 96% on 3 L nasal cannula." },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Vitals: T 37.0 C, HR 86, BP 126/76, RR 18, SpO2 96% on 3 L nasal cannula." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Vitals: T 37.0 C, HR 86, BP 126/76, RR 18, SpO2 96% on 3 L nasal cannula." },
      { label: "ph", value: "7.42", sourceUnit: "(unitless)", sourceSpan: "ABG on 3 L nasal cannula: pH 7.42, PaCO2 38 mmHg, PaO2 82 mmHg." },
      { label: "paco2", value: "38", sourceUnit: "mmHg", sourceSpan: "ABG on 3 L nasal cannula: pH 7.42, PaCO2 38 mmHg, PaO2 82 mmHg." },
      { label: "pao2", value: "82", sourceUnit: "mmHg", sourceSpan: "ABG on 3 L nasal cannula: pH 7.42, PaCO2 38 mmHg, PaO2 82 mmHg." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_acute_hemolytic_transfusion_reaction_01/stage_1_update",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.6", sourceUnit: "°C", sourceSpan: "Vital signs: T 38.6 °C, HR 118/min, BP 96/58 mmHg, RR 24/min, SpO2 95% on room air." },
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "Vital signs: T 38.6 °C, HR 118/min, BP 96/58 mmHg, RR 24/min, SpO2 95% on room air." },
      { label: "sbp", value: "96", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 38.6 °C, HR 118/min, BP 96/58 mmHg, RR 24/min, SpO2 95% on room air." },
      { label: "dbp", value: "58", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 38.6 °C, HR 118/min, BP 96/58 mmHg, RR 24/min, SpO2 95% on room air." },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "Vital signs: T 38.6 °C, HR 118/min, BP 96/58 mmHg, RR 24/min, SpO2 95% on room air." },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "Vital signs: T 38.6 °C, HR 118/min, BP 96/58 mmHg, RR 24/min, SpO2 95% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/admission_assessment",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.2", sourceUnit: "°C", sourceSpan: "T 37.2 °C, HR 112 regular, BP 88/54, RR 20, SpO₂ 96% room air." },
      { label: "hr", value: "112", sourceUnit: "bpm", sourceSpan: "T 37.2 °C, HR 112 regular, BP 88/54, RR 20, SpO₂ 96% room air." },
      { label: "sbp", value: "88", sourceUnit: "mmHg", sourceSpan: "T 37.2 °C, HR 112 regular, BP 88/54, RR 20, SpO₂ 96% room air." },
      { label: "dbp", value: "54", sourceUnit: "mmHg", sourceSpan: "T 37.2 °C, HR 112 regular, BP 88/54, RR 20, SpO₂ 96% room air." },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "T 37.2 °C, HR 112 regular, BP 88/54, RR 20, SpO₂ 96% room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "T 37.2 °C, HR 112 regular, BP 88/54, RR 20, SpO₂ 96% room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_client_advocacy_refusal_01/stage_1_update",
    lane: "extract",
    panel: [
      { label: "hr", value: "88", sourceUnit: "bpm", sourceSpan: "Vitals: HR 88, BP 108/64, RR 20, SpO2 94% on 2 L." },
      { label: "sbp", value: "108", sourceUnit: "mmHg", sourceSpan: "Vitals: HR 88, BP 108/64, RR 20, SpO2 94% on 2 L." },
      { label: "dbp", value: "64", sourceUnit: "mmHg", sourceSpan: "Vitals: HR 88, BP 108/64, RR 20, SpO2 94% on 2 L." },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "Vitals: HR 88, BP 108/64, RR 20, SpO2 94% on 2 L." },
      { label: "spo2", value: "94", sourceUnit: "%", sourceSpan: "Vitals: HR 88, BP 108/64, RR 20, SpO2 94% on 2 L." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_client_advocacy_refusal_01/stage_3_update",
    lane: "extract",
    panel: [
      { label: "hr", value: "86", sourceUnit: "bpm", sourceSpan: "Vitals: HR 86, BP 102/58, RR 18, SpO2 95% on 2 L." },
      { label: "sbp", value: "102", sourceUnit: "mmHg", sourceSpan: "Vitals: HR 86, BP 102/58, RR 18, SpO2 95% on 2 L." },
      { label: "dbp", value: "58", sourceUnit: "mmHg", sourceSpan: "Vitals: HR 86, BP 102/58, RR 18, SpO2 95% on 2 L." },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Vitals: HR 86, BP 102/58, RR 18, SpO2 95% on 2 L." },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "Vitals: HR 86, BP 102/58, RR 18, SpO2 95% on 2 L." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gallstone_pancreatitis_01/ex_admission_assessment",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.3", sourceUnit: "C", sourceSpan: "T 37.3 C, HR 112, BP 118/74, RR 24, SpO2 96% room air." },
      { label: "hr", value: "112", sourceUnit: "bpm", sourceSpan: "T 37.3 C, HR 112, BP 118/74, RR 24, SpO2 96% room air." },
      { label: "sbp", value: "118", sourceUnit: "mmHg", sourceSpan: "T 37.3 C, HR 112, BP 118/74, RR 24, SpO2 96% room air." },
      { label: "dbp", value: "74", sourceUnit: "mmHg", sourceSpan: "T 37.3 C, HR 112, BP 118/74, RR 24, SpO2 96% room air." },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "T 37.3 C, HR 112, BP 118/74, RR 24, SpO2 96% room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "T 37.3 C, HR 112, BP 118/74, RR 24, SpO2 96% room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gallstone_pancreatitis_01/ex_admission_labs",
    lane: "extract",
    panel: [
      { label: "ast", value: "210", sourceUnit: "U/L", sourceSpan: "Lipase 1,840 U/L; amylase 1,260 U/L; AST 210 U/L; ALT 280 U/L; total bilirubin 3.2 mg/dL; direct bilirubin 2.4 mg/dL; alkaline phosphatase 310 U/L; WBC 14,500/mcL; Hgb 15.8 g/dL; Hct 48%; platelets 238,000/mcL; BUN 22 mg/dL; creatinine 0.9 mg/dL; calcium 7.6 mg/dL; ionized calcium 3.6 mg/dL; magnesium 1.7 mg/dL; glucose 180 mg/dL; lactate 1.8 mmol/L; triglycerides 168 mg/dL; albumin 3.2 g/dL; INR 1.1; urinalysis concentrated, specific gravity 1.030, no blood or infection." },
      { label: "alt", value: "280", sourceUnit: "U/L", sourceSpan: "Lipase 1,840 U/L; amylase 1,260 U/L; AST 210 U/L; ALT 280 U/L; total bilirubin 3.2 mg/dL; direct bilirubin 2.4 mg/dL; alkaline phosphatase 310 U/L; WBC 14,500/mcL; Hgb 15.8 g/dL; Hct 48%; platelets 238,000/mcL; BUN 22 mg/dL; creatinine 0.9 mg/dL; calcium 7.6 mg/dL; ionized calcium 3.6 mg/dL; magnesium 1.7 mg/dL; glucose 180 mg/dL; lactate 1.8 mmol/L; triglycerides 168 mg/dL; albumin 3.2 g/dL; INR 1.1; urinalysis concentrated, specific gravity 1.030, no blood or infection." },
      { label: "total_bilirubin", value: "3.2", sourceUnit: "mg/dL", sourceSpan: "Lipase 1,840 U/L; amylase 1,260 U/L; AST 210 U/L; ALT 280 U/L; total bilirubin 3.2 mg/dL; direct bilirubin 2.4 mg/dL; alkaline phosphatase 310 U/L; WBC 14,500/mcL; Hgb 15.8 g/dL; Hct 48%; platelets 238,000/mcL; BUN 22 mg/dL; creatinine 0.9 mg/dL; calcium 7.6 mg/dL; ionized calcium 3.6 mg/dL; magnesium 1.7 mg/dL; glucose 180 mg/dL; lactate 1.8 mmol/L; triglycerides 168 mg/dL; albumin 3.2 g/dL; INR 1.1; urinalysis concentrated, specific gravity 1.030, no blood or infection." },
      { label: "wbc", value: "14,500", sourceUnit: "/mcL", sourceSpan: "Lipase 1,840 U/L; amylase 1,260 U/L; AST 210 U/L; ALT 280 U/L; total bilirubin 3.2 mg/dL; direct bilirubin 2.4 mg/dL; alkaline phosphatase 310 U/L; WBC 14,500/mcL; Hgb 15.8 g/dL; Hct 48%; platelets 238,000/mcL; BUN 22 mg/dL; creatinine 0.9 mg/dL; calcium 7.6 mg/dL; ionized calcium 3.6 mg/dL; magnesium 1.7 mg/dL; glucose 180 mg/dL; lactate 1.8 mmol/L; triglycerides 168 mg/dL; albumin 3.2 g/dL; INR 1.1; urinalysis concentrated, specific gravity 1.030, no blood or infection." },
      { label: "hemoglobin", value: "15.8", sourceUnit: "g/dL", sourceSpan: "Lipase 1,840 U/L; amylase 1,260 U/L; AST 210 U/L; ALT 280 U/L; total bilirubin 3.2 mg/dL; direct bilirubin 2.4 mg/dL; alkaline phosphatase 310 U/L; WBC 14,500/mcL; Hgb 15.8 g/dL; Hct 48%; platelets 238,000/mcL; BUN 22 mg/dL; creatinine 0.9 mg/dL; calcium 7.6 mg/dL; ionized calcium 3.6 mg/dL; magnesium 1.7 mg/dL; glucose 180 mg/dL; lactate 1.8 mmol/L; triglycerides 168 mg/dL; albumin 3.2 g/dL; INR 1.1; urinalysis concentrated, specific gravity 1.030, no blood or infection." },
      { label: "hematocrit", value: "48", sourceUnit: "%", sourceSpan: "Lipase 1,840 U/L; amylase 1,260 U/L; AST 210 U/L; ALT 280 U/L; total bilirubin 3.2 mg/dL; direct bilirubin 2.4 mg/dL; alkaline phosphatase 310 U/L; WBC 14,500/mcL; Hgb 15.8 g/dL; Hct 48%; platelets 238,000/mcL; BUN 22 mg/dL; creatinine 0.9 mg/dL; calcium 7.6 mg/dL; ionized calcium 3.6 mg/dL; magnesium 1.7 mg/dL; glucose 180 mg/dL; lactate 1.8 mmol/L; triglycerides 168 mg/dL; albumin 3.2 g/dL; INR 1.1; urinalysis concentrated, specific gravity 1.030, no blood or infection." },
      { label: "platelets", value: "238,000", sourceUnit: "/mcL", sourceSpan: "Lipase 1,840 U/L; amylase 1,260 U/L; AST 210 U/L; ALT 280 U/L; total bilirubin 3.2 mg/dL; direct bilirubin 2.4 mg/dL; alkaline phosphatase 310 U/L; WBC 14,500/mcL; Hgb 15.8 g/dL; Hct 48%; platelets 238,000/mcL; BUN 22 mg/dL; creatinine 0.9 mg/dL; calcium 7.6 mg/dL; ionized calcium 3.6 mg/dL; magnesium 1.7 mg/dL; glucose 180 mg/dL; lactate 1.8 mmol/L; triglycerides 168 mg/dL; albumin 3.2 g/dL; INR 1.1; urinalysis concentrated, specific gravity 1.030, no blood or infection." },
      { label: "bun", value: "22", sourceUnit: "mg/dL", sourceSpan: "Lipase 1,840 U/L; amylase 1,260 U/L; AST 210 U/L; ALT 280 U/L; total bilirubin 3.2 mg/dL; direct bilirubin 2.4 mg/dL; alkaline phosphatase 310 U/L; WBC 14,500/mcL; Hgb 15.8 g/dL; Hct 48%; platelets 238,000/mcL; BUN 22 mg/dL; creatinine 0.9 mg/dL; calcium 7.6 mg/dL; ionized calcium 3.6 mg/dL; magnesium 1.7 mg/dL; glucose 180 mg/dL; lactate 1.8 mmol/L; triglycerides 168 mg/dL; albumin 3.2 g/dL; INR 1.1; urinalysis concentrated, specific gravity 1.030, no blood or infection." },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "Lipase 1,840 U/L; amylase 1,260 U/L; AST 210 U/L; ALT 280 U/L; total bilirubin 3.2 mg/dL; direct bilirubin 2.4 mg/dL; alkaline phosphatase 310 U/L; WBC 14,500/mcL; Hgb 15.8 g/dL; Hct 48%; platelets 238,000/mcL; BUN 22 mg/dL; creatinine 0.9 mg/dL; calcium 7.6 mg/dL; ionized calcium 3.6 mg/dL; magnesium 1.7 mg/dL; glucose 180 mg/dL; lactate 1.8 mmol/L; triglycerides 168 mg/dL; albumin 3.2 g/dL; INR 1.1; urinalysis concentrated, specific gravity 1.030, no blood or infection." },
      { label: "calcium", value: "7.6", sourceUnit: "mg/dL", sourceSpan: "calcium 7.6 mg/dL" },
      { label: "ionized_calcium", value: "3.6", sourceUnit: "mg/dL", sourceSpan: "ionized calcium 3.6 mg/dL" },
      { label: "magnesium", value: "1.7", sourceUnit: "mg/dL", sourceSpan: "Lipase 1,840 U/L; amylase 1,260 U/L; AST 210 U/L; ALT 280 U/L; total bilirubin 3.2 mg/dL; direct bilirubin 2.4 mg/dL; alkaline phosphatase 310 U/L; WBC 14,500/mcL; Hgb 15.8 g/dL; Hct 48%; platelets 238,000/mcL; BUN 22 mg/dL; creatinine 0.9 mg/dL; calcium 7.6 mg/dL; ionized calcium 3.6 mg/dL; magnesium 1.7 mg/dL; glucose 180 mg/dL; lactate 1.8 mmol/L; triglycerides 168 mg/dL; albumin 3.2 g/dL; INR 1.1; urinalysis concentrated, specific gravity 1.030, no blood or infection." },
      { label: "glucose", value: "180", sourceUnit: "mg/dL", sourceSpan: "Lipase 1,840 U/L; amylase 1,260 U/L; AST 210 U/L; ALT 280 U/L; total bilirubin 3.2 mg/dL; direct bilirubin 2.4 mg/dL; alkaline phosphatase 310 U/L; WBC 14,500/mcL; Hgb 15.8 g/dL; Hct 48%; platelets 238,000/mcL; BUN 22 mg/dL; creatinine 0.9 mg/dL; calcium 7.6 mg/dL; ionized calcium 3.6 mg/dL; magnesium 1.7 mg/dL; glucose 180 mg/dL; lactate 1.8 mmol/L; triglycerides 168 mg/dL; albumin 3.2 g/dL; INR 1.1; urinalysis concentrated, specific gravity 1.030, no blood or infection." },
      { label: "lactate", value: "1.8", sourceUnit: "mmol/L", sourceSpan: "Lipase 1,840 U/L; amylase 1,260 U/L; AST 210 U/L; ALT 280 U/L; total bilirubin 3.2 mg/dL; direct bilirubin 2.4 mg/dL; alkaline phosphatase 310 U/L; WBC 14,500/mcL; Hgb 15.8 g/dL; Hct 48%; platelets 238,000/mcL; BUN 22 mg/dL; creatinine 0.9 mg/dL; calcium 7.6 mg/dL; ionized calcium 3.6 mg/dL; magnesium 1.7 mg/dL; glucose 180 mg/dL; lactate 1.8 mmol/L; triglycerides 168 mg/dL; albumin 3.2 g/dL; INR 1.1; urinalysis concentrated, specific gravity 1.030, no blood or infection." },
      { label: "inr", value: "1.1", sourceUnit: "(ratio)", sourceSpan: "Lipase 1,840 U/L; amylase 1,260 U/L; AST 210 U/L; ALT 280 U/L; total bilirubin 3.2 mg/dL; direct bilirubin 2.4 mg/dL; alkaline phosphatase 310 U/L; WBC 14,500/mcL; Hgb 15.8 g/dL; Hct 48%; platelets 238,000/mcL; BUN 22 mg/dL; creatinine 0.9 mg/dL; calcium 7.6 mg/dL; ionized calcium 3.6 mg/dL; magnesium 1.7 mg/dL; glucose 180 mg/dL; lactate 1.8 mmol/L; triglycerides 168 mg/dL; albumin 3.2 g/dL; INR 1.1; urinalysis concentrated, specific gravity 1.030, no blood or infection." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_adhf_01/adhf_deterioration",
    lane: "extract",
    panel: [
      { label: "rr", value: "32", sourceUnit: "/min", sourceSpan: "RR 32/min, SpO2 84% on 2 L/min nasal cannula, HR 124/min, BP 182/98 mm Hg." },
      { label: "spo2", value: "84", sourceUnit: "%", sourceSpan: "RR 32/min, SpO2 84% on 2 L/min nasal cannula, HR 124/min, BP 182/98 mm Hg." },
      { label: "hr", value: "124", sourceUnit: "bpm", sourceSpan: "RR 32/min, SpO2 84% on 2 L/min nasal cannula, HR 124/min, BP 182/98 mm Hg." },
      { label: "sbp", value: "182", sourceUnit: "mm Hg", sourceSpan: "RR 32/min, SpO2 84% on 2 L/min nasal cannula, HR 124/min, BP 182/98 mm Hg." },
      { label: "dbp", value: "98", sourceUnit: "mm Hg", sourceSpan: "RR 32/min, SpO2 84% on 2 L/min nasal cannula, HR 124/min, BP 182/98 mm Hg." }
    ],
    excludedValues: [],
    unitAliases: []
  }
];

const batch04Records: ExtractionRecord[] = [
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_adhf_01/adhf_labs",
    lane: "extract",
    panel: [
      { label: "bnp", value: "1,240", sourceUnit: "pg/mL", sourceSpan: "BNP 1,240 pg/mL." },
      { label: "sodium", value: "132", sourceUnit: "mEq/L", sourceSpan: "Sodium 132 mEq/L, potassium 3.7 mEq/L, creatinine 1.1 mg/dL, troponin not elevated." },
      { label: "potassium", value: "3.7", sourceUnit: "mEq/L", sourceSpan: "Sodium 132 mEq/L, potassium 3.7 mEq/L, creatinine 1.1 mg/dL, troponin not elevated." },
      { label: "creatinine", value: "1.1", sourceUnit: "mg/dL", sourceSpan: "Sodium 132 mEq/L, potassium 3.7 mEq/L, creatinine 1.1 mg/dL, troponin not elevated." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_adhf_01/adhf_response",
    lane: "extract",
    panel: [
      { label: "spo2", value: "93", sourceUnit: "%", sourceSpan: "SpO2 is 93% with noninvasive positive-pressure ventilation; RR 22/min; crackles are decreased." },
      { label: "rr", value: "22", sourceUnit: "/min", sourceSpan: "SpO2 is 93% with noninvasive positive-pressure ventilation; RR 22/min; crackles are decreased." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_adhf_01/adhf_triage",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.1", sourceUnit: "° C", sourceSpan: "Vital signs: T 37.1° C, HR 112/min, RR 26/min, BP 168/94 mm Hg, SpO2 89% on room air." },
      { label: "hr", value: "112", sourceUnit: "bpm", sourceSpan: "Vital signs: T 37.1° C, HR 112/min, RR 26/min, BP 168/94 mm Hg, SpO2 89% on room air." },
      { label: "rr", value: "26", sourceUnit: "/min", sourceSpan: "Vital signs: T 37.1° C, HR 112/min, RR 26/min, BP 168/94 mm Hg, SpO2 89% on room air." },
      { label: "sbp", value: "168", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 37.1° C, HR 112/min, RR 26/min, BP 168/94 mm Hg, SpO2 89% on room air." },
      { label: "dbp", value: "94", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 37.1° C, HR 112/min, RR 26/min, BP 168/94 mm Hg, SpO2 89% on room air." },
      { label: "spo2", value: "89", sourceUnit: "%", sourceSpan: "Vital signs: T 37.1° C, HR 112/min, RR 26/min, BP 168/94 mm Hg, SpO2 89% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_initial",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.4", sourceUnit: "° C", sourceSpan: "Vital signs: T 38.4° C, HR 122/min, RR 24/min, BP 84/46 mm Hg." },
      { label: "hr", value: "122", sourceUnit: "bpm", sourceSpan: "Vital signs: T 38.4° C, HR 122/min, RR 24/min, BP 84/46 mm Hg." },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "Vital signs: T 38.4° C, HR 122/min, RR 24/min, BP 84/46 mm Hg." },
      { label: "sbp", value: "84", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 38.4° C, HR 122/min, RR 24/min, BP 84/46 mm Hg." },
      { label: "dbp", value: "46", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 38.4° C, HR 122/min, RR 24/min, BP 84/46 mm Hg." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_labs",
    lane: "extract",
    panel: [
      { label: "sodium", value: "126", sourceUnit: "mEq/L", sourceSpan: "Sodium 126 mEq/L, potassium 5.9 mEq/L, glucose 52 mg/dL, BUN 34 mg/dL, creatinine 1.4 mg/dL." },
      { label: "potassium", value: "5.9", sourceUnit: "mEq/L", sourceSpan: "Sodium 126 mEq/L, potassium 5.9 mEq/L, glucose 52 mg/dL, BUN 34 mg/dL, creatinine 1.4 mg/dL." },
      { label: "glucose", value: "52", sourceUnit: "mg/dL", sourceSpan: "Sodium 126 mEq/L, potassium 5.9 mEq/L, glucose 52 mg/dL, BUN 34 mg/dL, creatinine 1.4 mg/dL." },
      { label: "bun", value: "34", sourceUnit: "mg/dL", sourceSpan: "Sodium 126 mEq/L, potassium 5.9 mEq/L, glucose 52 mg/dL, BUN 34 mg/dL, creatinine 1.4 mg/dL." },
      { label: "creatinine", value: "1.4", sourceUnit: "mg/dL", sourceSpan: "Sodium 126 mEq/L, potassium 5.9 mEq/L, glucose 52 mg/dL, BUN 34 mg/dL, creatinine 1.4 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_aki_02/aki_deterioration",
    lane: "extract",
    panel: [
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "HR 118/min, BP 92/54 mm Hg." },
      { label: "sbp", value: "92", sourceUnit: "mm Hg", sourceSpan: "HR 118/min, BP 92/54 mm Hg." },
      { label: "dbp", value: "54", sourceUnit: "mm Hg", sourceSpan: "HR 118/min, BP 92/54 mm Hg." },
      { label: "potassium", value: "6.2", sourceUnit: "mEq/L", sourceSpan: "Potassium 6.2 mEq/L." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_aki_02/aki_labs",
    lane: "extract",
    panel: [
      { label: "bun", value: "48", sourceUnit: "mg/dL", sourceSpan: "BUN 48 mg/dL, creatinine 2.6 mg/dL (baseline 0.9), potassium 5.6 mEq/L, bicarbonate 18 mEq/L." },
      { label: "creatinine", value: "2.6", sourceUnit: "mg/dL", sourceSpan: "BUN 48 mg/dL, creatinine 2.6 mg/dL (baseline 0.9), potassium 5.6 mEq/L, bicarbonate 18 mEq/L." },
      { label: "potassium", value: "5.6", sourceUnit: "mEq/L", sourceSpan: "BUN 48 mg/dL, creatinine 2.6 mg/dL (baseline 0.9), potassium 5.6 mEq/L, bicarbonate 18 mEq/L." },
      { label: "bicarbonate", value: "18", sourceUnit: "mEq/L", sourceSpan: "BUN 48 mg/dL, creatinine 2.6 mg/dL (baseline 0.9), potassium 5.6 mEq/L, bicarbonate 18 mEq/L." }
    ],
    excludedValues: [
      { label: "creatinine", value: "0.9", reason: "prior", sourceSpan: "BUN 48 mg/dL, creatinine 2.6 mg/dL (baseline 0.9), potassium 5.6 mEq/L, bicarbonate 18 mEq/L." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_aki_02/aki_response",
    lane: "extract",
    panel: [
      { label: "potassium", value: "5.3", sourceUnit: "mEq/L", sourceSpan: "Potassium 5.3 mEq/L." },
      { label: "sbp", value: "104", sourceUnit: "mm Hg", sourceSpan: "BP 104/62 mm Hg." },
      { label: "dbp", value: "62", sourceUnit: "mm Hg", sourceSpan: "BP 104/62 mm Hg." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_initial",
    lane: "extract",
    panel: [
      { label: "hr", value: "96", sourceUnit: "bpm", sourceSpan: "Current vital signs: HR 96/min, BP 118/70 mm Hg, SpO2 95% on 2 L/min." },
      { label: "sbp", value: "118", sourceUnit: "mm Hg", sourceSpan: "Current vital signs: HR 96/min, BP 118/70 mm Hg, SpO2 95% on 2 L/min." },
      { label: "dbp", value: "70", sourceUnit: "mm Hg", sourceSpan: "Current vital signs: HR 96/min, BP 118/70 mm Hg, SpO2 95% on 2 L/min." },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "Current vital signs: HR 96/min, BP 118/70 mm Hg, SpO2 95% on 2 L/min." }
    ],
    excludedValues: [
      { label: "platelets", value: "226,000", reason: "prior", sourceSpan: "Baseline platelet count was 226,000/mm3 and hemoglobin was 13.2 g/dL." },
      { label: "hemoglobin", value: "13.2", reason: "prior", sourceSpan: "Baseline platelet count was 226,000/mm3 and hemoglobin was 13.2 g/dL." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_labs",
    lane: "extract",
    panel: [
      { label: "ptt", value: "118", sourceUnit: "seconds", sourceSpan: "aPTT 118 seconds" },
      { label: "platelets", value: "154,000", sourceUnit: "/mm3", sourceSpan: "platelet count 154,000/mm3" },
      { label: "hemoglobin", value: "12.6", sourceUnit: "g/dL", sourceSpan: "hemoglobin 12.6 g/dL" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_initial",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.0", sourceUnit: "° C", sourceSpan: "Vital signs: T 38.0° C, HR 116/min, RR 24/min, BP 104/62 mm Hg." },
      { label: "hr", value: "116", sourceUnit: "bpm", sourceSpan: "Vital signs: T 38.0° C, HR 116/min, RR 24/min, BP 104/62 mm Hg." },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "Vital signs: T 38.0° C, HR 116/min, RR 24/min, BP 104/62 mm Hg." },
      { label: "sbp", value: "104", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 38.0° C, HR 116/min, RR 24/min, BP 104/62 mm Hg." },
      { label: "dbp", value: "62", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 38.0° C, HR 116/min, RR 24/min, BP 104/62 mm Hg." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_labs",
    lane: "extract",
    panel: [
      { label: "wbc", value: "18,500", sourceUnit: "/mm3", sourceSpan: "WBC 18,500/mm3" },
      { label: "hematocrit", value: "49", sourceUnit: "%", sourceSpan: "hematocrit 49%" },
      { label: "calcium", value: "7.4", sourceUnit: "mg/dL", sourceSpan: "calcium 7.4 mg/dL" },
      { label: "glucose", value: "212", sourceUnit: "mg/dL", sourceSpan: "glucose 212 mg/dL" },
      { label: "bun", value: "31", sourceUnit: "mg/dL", sourceSpan: "BUN 31 mg/dL" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_response",
    lane: "extract",
    panel: [
      { label: "sbp", value: "98", sourceUnit: "mm Hg", sourceSpan: "After 2 hr: BP 98/58 mm Hg, HR 118/min, urine output 38 mL/hr, SpO2 94% on 4 L/min." },
      { label: "dbp", value: "58", sourceUnit: "mm Hg", sourceSpan: "After 2 hr: BP 98/58 mm Hg, HR 118/min, urine output 38 mL/hr, SpO2 94% on 4 L/min." },
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "After 2 hr: BP 98/58 mm Hg, HR 118/min, urine output 38 mL/hr, SpO2 94% on 4 L/min." },
      { label: "spo2", value: "94", sourceUnit: "%", sourceSpan: "After 2 hr: BP 98/58 mm Hg, HR 118/min, urine output 38 mL/hr, SpO2 94% on 4 L/min." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_urosepsis_05/sepsis_initial",
    lane: "extract",
    panel: [
      { label: "temp", value: "39.2", sourceUnit: "° C", sourceSpan: "Vital signs: T 39.2° C, HR 118/min, RR 24/min, BP 102/58 mm Hg, SpO2 96% on room air." },
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "Vital signs: T 39.2° C, HR 118/min, RR 24/min, BP 102/58 mm Hg, SpO2 96% on room air." },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "Vital signs: T 39.2° C, HR 118/min, RR 24/min, BP 102/58 mm Hg, SpO2 96% on room air." },
      { label: "sbp", value: "102", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 39.2° C, HR 118/min, RR 24/min, BP 102/58 mm Hg, SpO2 96% on room air." },
      { label: "dbp", value: "58", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 39.2° C, HR 118/min, RR 24/min, BP 102/58 mm Hg, SpO2 96% on room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Vital signs: T 39.2° C, HR 118/min, RR 24/min, BP 102/58 mm Hg, SpO2 96% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_urosepsis_05/sepsis_labs",
    lane: "extract",
    panel: [
      { label: "wbc", value: "22,400", sourceUnit: "/mm3", sourceSpan: "WBC 22,400/mm3 with 14% bands" },
      { label: "lactate", value: "3.8", sourceUnit: "mmol/L", sourceSpan: "lactate 3.8 mmol/L" },
      { label: "creatinine", value: "1.8", sourceUnit: "mg/dL", sourceSpan: "creatinine 1.8 mg/dL (baseline 0.9)" }
    ],
    excludedValues: [
      { label: "creatinine", value: "0.9", reason: "prior", sourceSpan: "creatinine 1.8 mg/dL (baseline 0.9)" }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gap_2026_06_11_case_urosepsis_05/sepsis_response",
    lane: "extract",
    panel: [
      { label: "sbp", value: "92", sourceUnit: "mm Hg", sourceSpan: "BP 92/50 mm Hg, MAP 64 mm Hg, HR 118/min, urine output 25 mL/hr." },
      { label: "dbp", value: "50", sourceUnit: "mm Hg", sourceSpan: "BP 92/50 mm Hg, MAP 64 mm Hg, HR 118/min, urine output 25 mL/hr." },
      { label: "map", value: "64", sourceUnit: "mm Hg", sourceSpan: "BP 92/50 mm Hg, MAP 64 mm Hg, HR 118/min, urine output 25 mL/hr." },
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "BP 92/50 mm Hg, MAP 64 mm Hg, HR 118/min, urine output 25 mL/hr." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gbs_respiratory_compromise_01/ex_initial_assessment",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "C", sourceSpan: "T 36.8 C, HR 82, BP 126/78, RR 16, SpO2 98% on room air." },
      { label: "hr", value: "82", sourceUnit: "bpm", sourceSpan: "T 36.8 C, HR 82, BP 126/78, RR 16, SpO2 98% on room air." },
      { label: "sbp", value: "126", sourceUnit: "mmHg", sourceSpan: "T 36.8 C, HR 82, BP 126/78, RR 16, SpO2 98% on room air." },
      { label: "dbp", value: "78", sourceUnit: "mmHg", sourceSpan: "T 36.8 C, HR 82, BP 126/78, RR 16, SpO2 98% on room air." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "T 36.8 C, HR 82, BP 126/78, RR 16, SpO2 98% on room air." },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "T 36.8 C, HR 82, BP 126/78, RR 16, SpO2 98% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_gbs_respiratory_compromise_01/stage1_0_12h_update",
    lane: "skip_serial"
  },
  {
    exhibitRef: "gpt_case_infection_control_clustered_care_01/baseline_client_snapshot",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_infection_control_clustered_care_01/stage_2_1130_status",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.4", sourceUnit: "C", sourceSpan: "Client A: T 38.4 C, HR 110, BP 100/58; two additional large watery stools since 0900, intake 750 mL IV, output about 1,100 mL; potassium 3.1 mEq/L, creatinine 1.5 mg/dL." },
      { label: "hr", value: "110", sourceUnit: "bpm", sourceSpan: "Client A: T 38.4 C, HR 110, BP 100/58; two additional large watery stools since 0900, intake 750 mL IV, output about 1,100 mL; potassium 3.1 mEq/L, creatinine 1.5 mg/dL." },
      { label: "sbp", value: "100", sourceUnit: "mmHg", sourceSpan: "Client A: T 38.4 C, HR 110, BP 100/58; two additional large watery stools since 0900, intake 750 mL IV, output about 1,100 mL; potassium 3.1 mEq/L, creatinine 1.5 mg/dL." },
      { label: "dbp", value: "58", sourceUnit: "mmHg", sourceSpan: "Client A: T 38.4 C, HR 110, BP 100/58; two additional large watery stools since 0900, intake 750 mL IV, output about 1,100 mL; potassium 3.1 mEq/L, creatinine 1.5 mg/dL." },
      { label: "potassium", value: "3.1", sourceUnit: "mEq/L", sourceSpan: "Client A: T 38.4 C, HR 110, BP 100/58; two additional large watery stools since 0900, intake 750 mL IV, output about 1,100 mL; potassium 3.1 mEq/L, creatinine 1.5 mg/dL." },
      { label: "creatinine", value: "1.5", sourceUnit: "mg/dL", sourceSpan: "Client A: T 38.4 C, HR 110, BP 100/58; two additional large watery stools since 0900, intake 750 mL IV, output about 1,100 mL; potassium 3.1 mEq/L, creatinine 1.5 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  }
];

const batch05Records: ExtractionRecord[] = [
  {
    exhibitRef: "gpt_case_lateral_incivility_01/stage_1_handoff",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_major_burn_inhalation_fluid_creep_01/baseline_assessment",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "C", sourceSpan: "Temperature 36.8 C, heart rate 125/min, blood pressure 90/60 mmHg, respiratory rate 28/min, SpO2 93% on room air." },
      { label: "hr", value: "125", sourceUnit: "bpm", sourceSpan: "Temperature 36.8 C, heart rate 125/min, blood pressure 90/60 mmHg, respiratory rate 28/min, SpO2 93% on room air." },
      { label: "sbp", value: "90", sourceUnit: "mmHg", sourceSpan: "Temperature 36.8 C, heart rate 125/min, blood pressure 90/60 mmHg, respiratory rate 28/min, SpO2 93% on room air." },
      { label: "dbp", value: "60", sourceUnit: "mmHg", sourceSpan: "Temperature 36.8 C, heart rate 125/min, blood pressure 90/60 mmHg, respiratory rate 28/min, SpO2 93% on room air." },
      { label: "rr", value: "28", sourceUnit: "/min", sourceSpan: "Temperature 36.8 C, heart rate 125/min, blood pressure 90/60 mmHg, respiratory rate 28/min, SpO2 93% on room air." },
      { label: "spo2", value: "93", sourceUnit: "%", sourceSpan: "Temperature 36.8 C, heart rate 125/min, blood pressure 90/60 mmHg, respiratory rate 28/min, SpO2 93% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_mass_casualty_start_triage_01/baseline_protocol_resources",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_neutropenic_fever_nadir_01/baseline_orders",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "°C", sourceSpan: "Baseline admission vitals: T 36.8 °C, HR 78, BP 118/72, RR 14, SpO₂ 98% room air." },
      { label: "hr", value: "78", sourceUnit: "bpm", sourceSpan: "Baseline admission vitals: T 36.8 °C, HR 78, BP 118/72, RR 14, SpO₂ 98% room air." },
      { label: "sbp", value: "118", sourceUnit: "mmHg", sourceSpan: "Baseline admission vitals: T 36.8 °C, HR 78, BP 118/72, RR 14, SpO₂ 98% room air." },
      { label: "dbp", value: "72", sourceUnit: "mmHg", sourceSpan: "Baseline admission vitals: T 36.8 °C, HR 78, BP 118/72, RR 14, SpO₂ 98% room air." },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "Baseline admission vitals: T 36.8 °C, HR 78, BP 118/72, RR 14, SpO₂ 98% room air." },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "Baseline admission vitals: T 36.8 °C, HR 78, BP 118/72, RR 14, SpO₂ 98% room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_neutropenic_fever_nadir_01/stage_1_course",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_opioid_recovery_relapse_risk_01/stage_1_update",
    lane: "extract",
    panel: [
      { label: "hr", value: "94", sourceUnit: "bpm", sourceSpan: "After 45 minutes, pain decreases from 8/10 to 6/10; HR 94, BP 138/86, RR 16, SpO2 99%." },
      { label: "sbp", value: "138", sourceUnit: "mmHg", sourceSpan: "After 45 minutes, pain decreases from 8/10 to 6/10; HR 94, BP 138/86, RR 16, SpO2 99%." },
      { label: "dbp", value: "86", sourceUnit: "mmHg", sourceSpan: "After 45 minutes, pain decreases from 8/10 to 6/10; HR 94, BP 138/86, RR 16, SpO2 99%." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "After 45 minutes, pain decreases from 8/10 to 6/10; HR 94, BP 138/86, RR 16, SpO2 99%." },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "After 45 minutes, pain decreases from 8/10 to 6/10; HR 94, BP 138/86, RR 16, SpO2 99%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_opioid_recovery_relapse_risk_01/stage_2_update",
    lane: "extract",
    panel: [
      { label: "hr", value: "82", sourceUnit: "bpm", sourceSpan: "Post-procedure vitals: HR 82, BP 126/78, RR 14, SpO2 99%." },
      { label: "sbp", value: "126", sourceUnit: "mmHg", sourceSpan: "Post-procedure vitals: HR 82, BP 126/78, RR 14, SpO2 99%." },
      { label: "dbp", value: "78", sourceUnit: "mmHg", sourceSpan: "Post-procedure vitals: HR 82, BP 126/78, RR 14, SpO2 99%." },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "Post-procedure vitals: HR 82, BP 126/78, RR 14, SpO2 99%." },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "Post-procedure vitals: HR 82, BP 126/78, RR 14, SpO2 99%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_opioid_recovery_relapse_risk_01/stage_3_update",
    lane: "extract",
    panel: [
      { label: "hr", value: "88", sourceUnit: "bpm", sourceSpan: "Vitals: HR 88, BP 132/82, RR 16, SpO2 99%." },
      { label: "sbp", value: "132", sourceUnit: "mmHg", sourceSpan: "Vitals: HR 88, BP 132/82, RR 16, SpO2 99%." },
      { label: "dbp", value: "82", sourceUnit: "mmHg", sourceSpan: "Vitals: HR 88, BP 132/82, RR 16, SpO2 99%." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Vitals: HR 88, BP 132/82, RR 16, SpO2 99%." },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "Vitals: HR 88, BP 132/82, RR 16, SpO2 99%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_opus23_nat_toddler_01/initial_ed_record",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_opus23_nat_toddler_01/stage_1_imaging_caregiver_update",
    lane: "extract",
    panel: [
      { label: "hr", value: "128", sourceUnit: "bpm", sourceSpan: "HR decreases to 128 with the mother present." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_opus23_nat_toddler_01/stage_2_interviews_safety",
    lane: "extract",
    panel: [
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "HR 118, BP 92/56, RR 24, SpO2 99%." },
      { label: "sbp", value: "92", sourceUnit: "mmHg", sourceSpan: "HR 118, BP 92/56, RR 24, SpO2 99%." },
      { label: "dbp", value: "56", sourceUnit: "mmHg", sourceSpan: "HR 118, BP 92/56, RR 24, SpO2 99%." },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "HR 118, BP 92/56, RR 24, SpO2 99%." },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "HR 118, BP 92/56, RR 24, SpO2 99%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_opus23_nat_toddler_01/stage_3_pediatric_unit_plan",
    lane: "extract",
    panel: [
      { label: "hr", value: "110", sourceUnit: "bpm", sourceSpan: "HR 110, BP 90/54, RR 22, SpO2 99%, FLACC score 2." },
      { label: "sbp", value: "90", sourceUnit: "mmHg", sourceSpan: "HR 110, BP 90/54, RR 22, SpO2 99%, FLACC score 2." },
      { label: "dbp", value: "54", sourceUnit: "mmHg", sourceSpan: "HR 110, BP 90/54, RR 22, SpO2 99%, FLACC score 2." },
      { label: "rr", value: "22", sourceUnit: "/min", sourceSpan: "HR 110, BP 90/54, RR 22, SpO2 99%, FLACC score 2." },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "HR 110, BP 90/54, RR 22, SpO2 99%, FLACC score 2." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_opus5_cdi_immunocompromised_01/exhibit_background",
    lane: "extract",
    panel: [],
    excludedValues: [
      { label: "creatinine", value: "1.1", reason: "prior", sourceSpan: "Baseline mild CKD: creatinine 1.1 mg/dL, eGFR 54 mL/min." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_assessment",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.1", sourceUnit: "°C", sourceSpan: "Vital signs: T 38.1 °C, HR 94, BP 108/62, RR 18, SpO₂ 96% on room air." },
      { label: "hr", value: "94", sourceUnit: "bpm", sourceSpan: "Vital signs: T 38.1 °C, HR 94, BP 108/62, RR 18, SpO₂ 96% on room air." },
      { label: "sbp", value: "108", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 38.1 °C, HR 94, BP 108/62, RR 18, SpO₂ 96% on room air." },
      { label: "dbp", value: "62", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 38.1 °C, HR 94, BP 108/62, RR 18, SpO₂ 96% on room air." },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Vital signs: T 38.1 °C, HR 94, BP 108/62, RR 18, SpO₂ 96% on room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Vital signs: T 38.1 °C, HR 94, BP 108/62, RR 18, SpO₂ 96% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_labs",
    lane: "extract",
    panel: [
      { label: "wbc", value: "21,400", sourceUnit: "/µL", sourceSpan: "Morning labs: WBC 21,400/µL with 84% neutrophils and 6% bands (WBC was 8,200/µL two days ago), hemoglobin 11.6 g/dL, platelets 204,000/µL, sodium 136 mEq/L, potassium 3.2 mEq/L (was 4.1 two days ago), chloride 98 mEq/L, bicarbonate 20 mEq/L, BUN 28 mg/dL, creatinine 1.4 mg/dL (baseline 1.1), eGFR 38 mL/min, glucose 142 mg/dL, lactate 1.6 mmol/L, albumin 2.4 g/dL, CRP 68 mg/L." },
      { label: "hemoglobin", value: "11.6", sourceUnit: "g/dL", sourceSpan: "Morning labs: WBC 21,400/µL with 84% neutrophils and 6% bands (WBC was 8,200/µL two days ago), hemoglobin 11.6 g/dL, platelets 204,000/µL, sodium 136 mEq/L, potassium 3.2 mEq/L (was 4.1 two days ago), chloride 98 mEq/L, bicarbonate 20 mEq/L, BUN 28 mg/dL, creatinine 1.4 mg/dL (baseline 1.1), eGFR 38 mL/min, glucose 142 mg/dL, lactate 1.6 mmol/L, albumin 2.4 g/dL, CRP 68 mg/L." },
      { label: "platelets", value: "204,000", sourceUnit: "/µL", sourceSpan: "Morning labs: WBC 21,400/µL with 84% neutrophils and 6% bands (WBC was 8,200/µL two days ago), hemoglobin 11.6 g/dL, platelets 204,000/µL, sodium 136 mEq/L, potassium 3.2 mEq/L (was 4.1 two days ago), chloride 98 mEq/L, bicarbonate 20 mEq/L, BUN 28 mg/dL, creatinine 1.4 mg/dL (baseline 1.1), eGFR 38 mL/min, glucose 142 mg/dL, lactate 1.6 mmol/L, albumin 2.4 g/dL, CRP 68 mg/L." },
      { label: "sodium", value: "136", sourceUnit: "mEq/L", sourceSpan: "Morning labs: WBC 21,400/µL with 84% neutrophils and 6% bands (WBC was 8,200/µL two days ago), hemoglobin 11.6 g/dL, platelets 204,000/µL, sodium 136 mEq/L, potassium 3.2 mEq/L (was 4.1 two days ago), chloride 98 mEq/L, bicarbonate 20 mEq/L, BUN 28 mg/dL, creatinine 1.4 mg/dL (baseline 1.1), eGFR 38 mL/min, glucose 142 mg/dL, lactate 1.6 mmol/L, albumin 2.4 g/dL, CRP 68 mg/L." },
      { label: "potassium", value: "3.2", sourceUnit: "mEq/L", sourceSpan: "Morning labs: WBC 21,400/µL with 84% neutrophils and 6% bands (WBC was 8,200/µL two days ago), hemoglobin 11.6 g/dL, platelets 204,000/µL, sodium 136 mEq/L, potassium 3.2 mEq/L (was 4.1 two days ago), chloride 98 mEq/L, bicarbonate 20 mEq/L, BUN 28 mg/dL, creatinine 1.4 mg/dL (baseline 1.1), eGFR 38 mL/min, glucose 142 mg/dL, lactate 1.6 mmol/L, albumin 2.4 g/dL, CRP 68 mg/L." },
      { label: "chloride", value: "98", sourceUnit: "mEq/L", sourceSpan: "Morning labs: WBC 21,400/µL with 84% neutrophils and 6% bands (WBC was 8,200/µL two days ago), hemoglobin 11.6 g/dL, platelets 204,000/µL, sodium 136 mEq/L, potassium 3.2 mEq/L (was 4.1 two days ago), chloride 98 mEq/L, bicarbonate 20 mEq/L, BUN 28 mg/dL, creatinine 1.4 mg/dL (baseline 1.1), eGFR 38 mL/min, glucose 142 mg/dL, lactate 1.6 mmol/L, albumin 2.4 g/dL, CRP 68 mg/L." },
      { label: "bicarbonate", value: "20", sourceUnit: "mEq/L", sourceSpan: "Morning labs: WBC 21,400/µL with 84% neutrophils and 6% bands (WBC was 8,200/µL two days ago), hemoglobin 11.6 g/dL, platelets 204,000/µL, sodium 136 mEq/L, potassium 3.2 mEq/L (was 4.1 two days ago), chloride 98 mEq/L, bicarbonate 20 mEq/L, BUN 28 mg/dL, creatinine 1.4 mg/dL (baseline 1.1), eGFR 38 mL/min, glucose 142 mg/dL, lactate 1.6 mmol/L, albumin 2.4 g/dL, CRP 68 mg/L." },
      { label: "bun", value: "28", sourceUnit: "mg/dL", sourceSpan: "Morning labs: WBC 21,400/µL with 84% neutrophils and 6% bands (WBC was 8,200/µL two days ago), hemoglobin 11.6 g/dL, platelets 204,000/µL, sodium 136 mEq/L, potassium 3.2 mEq/L (was 4.1 two days ago), chloride 98 mEq/L, bicarbonate 20 mEq/L, BUN 28 mg/dL, creatinine 1.4 mg/dL (baseline 1.1), eGFR 38 mL/min, glucose 142 mg/dL, lactate 1.6 mmol/L, albumin 2.4 g/dL, CRP 68 mg/L." },
      { label: "creatinine", value: "1.4", sourceUnit: "mg/dL", sourceSpan: "Morning labs: WBC 21,400/µL with 84% neutrophils and 6% bands (WBC was 8,200/µL two days ago), hemoglobin 11.6 g/dL, platelets 204,000/µL, sodium 136 mEq/L, potassium 3.2 mEq/L (was 4.1 two days ago), chloride 98 mEq/L, bicarbonate 20 mEq/L, BUN 28 mg/dL, creatinine 1.4 mg/dL (baseline 1.1), eGFR 38 mL/min, glucose 142 mg/dL, lactate 1.6 mmol/L, albumin 2.4 g/dL, CRP 68 mg/L." },
      { label: "glucose", value: "142", sourceUnit: "mg/dL", sourceSpan: "Morning labs: WBC 21,400/µL with 84% neutrophils and 6% bands (WBC was 8,200/µL two days ago), hemoglobin 11.6 g/dL, platelets 204,000/µL, sodium 136 mEq/L, potassium 3.2 mEq/L (was 4.1 two days ago), chloride 98 mEq/L, bicarbonate 20 mEq/L, BUN 28 mg/dL, creatinine 1.4 mg/dL (baseline 1.1), eGFR 38 mL/min, glucose 142 mg/dL, lactate 1.6 mmol/L, albumin 2.4 g/dL, CRP 68 mg/L." },
      { label: "lactate", value: "1.6", sourceUnit: "mmol/L", sourceSpan: "Morning labs: WBC 21,400/µL with 84% neutrophils and 6% bands (WBC was 8,200/µL two days ago), hemoglobin 11.6 g/dL, platelets 204,000/µL, sodium 136 mEq/L, potassium 3.2 mEq/L (was 4.1 two days ago), chloride 98 mEq/L, bicarbonate 20 mEq/L, BUN 28 mg/dL, creatinine 1.4 mg/dL (baseline 1.1), eGFR 38 mL/min, glucose 142 mg/dL, lactate 1.6 mmol/L, albumin 2.4 g/dL, CRP 68 mg/L." }
    ],
    excludedValues: [
      { label: "wbc", value: "8,200", reason: "prior", sourceSpan: "WBC was 8,200/µL two days ago" },
      { label: "potassium", value: "4.1", reason: "prior", sourceSpan: "potassium 3.2 mEq/L (was 4.1 two days ago)" },
      { label: "creatinine", value: "1.1", reason: "prior", sourceSpan: "creatinine 1.4 mg/dL (baseline 1.1)" }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_orders",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage2_status",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.8", sourceUnit: "°C", sourceSpan: "Vital signs: T 37.8 °C, HR 88, BP 118/70, RR 16, SpO₂ 97%." },
      { label: "hr", value: "88", sourceUnit: "bpm", sourceSpan: "Vital signs: T 37.8 °C, HR 88, BP 118/70, RR 16, SpO₂ 97%." },
      { label: "sbp", value: "118", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.8 °C, HR 88, BP 118/70, RR 16, SpO₂ 97%." },
      { label: "dbp", value: "70", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.8 °C, HR 88, BP 118/70, RR 16, SpO₂ 97%." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Vital signs: T 37.8 °C, HR 88, BP 118/70, RR 16, SpO₂ 97%." },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Vital signs: T 37.8 °C, HR 88, BP 118/70, RR 16, SpO₂ 97%." },
      { label: "wbc", value: "18,600", sourceUnit: "/µL", sourceSpan: "Labs: WBC 18,600/µL, potassium 3.6 mEq/L, creatinine 1.3 mg/dL, BUN 24 mg/dL, bicarbonate 22 mEq/L, lactate 1.2 mmol/L." },
      { label: "potassium", value: "3.6", sourceUnit: "mEq/L", sourceSpan: "Labs: WBC 18,600/µL, potassium 3.6 mEq/L, creatinine 1.3 mg/dL, BUN 24 mg/dL, bicarbonate 22 mEq/L, lactate 1.2 mmol/L." },
      { label: "creatinine", value: "1.3", sourceUnit: "mg/dL", sourceSpan: "Labs: WBC 18,600/µL, potassium 3.6 mEq/L, creatinine 1.3 mg/dL, BUN 24 mg/dL, bicarbonate 22 mEq/L, lactate 1.2 mmol/L." },
      { label: "bun", value: "24", sourceUnit: "mg/dL", sourceSpan: "Labs: WBC 18,600/µL, potassium 3.6 mEq/L, creatinine 1.3 mg/dL, BUN 24 mg/dL, bicarbonate 22 mEq/L, lactate 1.2 mmol/L." },
      { label: "bicarbonate", value: "22", sourceUnit: "mEq/L", sourceSpan: "Labs: WBC 18,600/µL, potassium 3.6 mEq/L, creatinine 1.3 mg/dL, BUN 24 mg/dL, bicarbonate 22 mEq/L, lactate 1.2 mmol/L." },
      { label: "lactate", value: "1.2", sourceUnit: "mmol/L", sourceSpan: "Labs: WBC 18,600/µL, potassium 3.6 mEq/L, creatinine 1.3 mg/dL, BUN 24 mg/dL, bicarbonate 22 mEq/L, lactate 1.2 mmol/L." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage3_discharge",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "°C", sourceSpan: "Vital signs: T 36.8 °C, HR 76, BP 126/74, RR 14, SpO₂ 98% on room air." },
      { label: "hr", value: "76", sourceUnit: "bpm", sourceSpan: "Vital signs: T 36.8 °C, HR 76, BP 126/74, RR 14, SpO₂ 98% on room air." },
      { label: "sbp", value: "126", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.8 °C, HR 76, BP 126/74, RR 14, SpO₂ 98% on room air." },
      { label: "dbp", value: "74", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.8 °C, HR 76, BP 126/74, RR 14, SpO₂ 98% on room air." },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "Vital signs: T 36.8 °C, HR 76, BP 126/74, RR 14, SpO₂ 98% on room air." },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "Vital signs: T 36.8 °C, HR 76, BP 126/74, RR 14, SpO₂ 98% on room air." },
      { label: "wbc", value: "11,200", sourceUnit: "/µL", sourceSpan: "Labs: WBC 11,200/µL, potassium 4.0 mEq/L, creatinine 1.1 mg/dL, BUN 18 mg/dL, bicarbonate 24 mEq/L, lactate 0.8 mmol/L." },
      { label: "potassium", value: "4.0", sourceUnit: "mEq/L", sourceSpan: "Labs: WBC 11,200/µL, potassium 4.0 mEq/L, creatinine 1.1 mg/dL, BUN 18 mg/dL, bicarbonate 24 mEq/L, lactate 0.8 mmol/L." },
      { label: "creatinine", value: "1.1", sourceUnit: "mg/dL", sourceSpan: "Labs: WBC 11,200/µL, potassium 4.0 mEq/L, creatinine 1.1 mg/dL, BUN 18 mg/dL, bicarbonate 24 mEq/L, lactate 0.8 mmol/L." },
      { label: "bun", value: "18", sourceUnit: "mg/dL", sourceSpan: "Labs: WBC 11,200/µL, potassium 4.0 mEq/L, creatinine 1.1 mg/dL, BUN 18 mg/dL, bicarbonate 24 mEq/L, lactate 0.8 mmol/L." },
      { label: "bicarbonate", value: "24", sourceUnit: "mEq/L", sourceSpan: "Labs: WBC 11,200/µL, potassium 4.0 mEq/L, creatinine 1.1 mg/dL, BUN 18 mg/dL, bicarbonate 24 mEq/L, lactate 0.8 mmol/L." },
      { label: "lactate", value: "0.8", sourceUnit: "mmol/L", sourceSpan: "Labs: WBC 11,200/µL, potassium 4.0 mEq/L, creatinine 1.1 mg/dL, BUN 18 mg/dL, bicarbonate 24 mEq/L, lactate 0.8 mmol/L." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/baseline_labs",
    lane: "extract",
    panel: [
      { label: "wbc", value: "11,200", sourceUnit: "/mcL", sourceSpan: "WBC 11,200/mcL; hemoglobin 11.8 g/dL; hematocrit 35.4%; platelets 198,000/mcL; INR 1.0; aPTT 28 seconds; BUN 18 mg/dL; creatinine 0.9 mg/dL; eGFR >60 mL/min; sodium 139 mEq/L; potassium 4.1 mEq/L; glucose 142 mg/dL." },
      { label: "hemoglobin", value: "11.8", sourceUnit: "g/dL", sourceSpan: "WBC 11,200/mcL; hemoglobin 11.8 g/dL; hematocrit 35.4%; platelets 198,000/mcL; INR 1.0; aPTT 28 seconds; BUN 18 mg/dL; creatinine 0.9 mg/dL; eGFR >60 mL/min; sodium 139 mEq/L; potassium 4.1 mEq/L; glucose 142 mg/dL." },
      { label: "hematocrit", value: "35.4", sourceUnit: "%", sourceSpan: "WBC 11,200/mcL; hemoglobin 11.8 g/dL; hematocrit 35.4%; platelets 198,000/mcL; INR 1.0; aPTT 28 seconds; BUN 18 mg/dL; creatinine 0.9 mg/dL; eGFR >60 mL/min; sodium 139 mEq/L; potassium 4.1 mEq/L; glucose 142 mg/dL." },
      { label: "platelets", value: "198,000", sourceUnit: "/mcL", sourceSpan: "WBC 11,200/mcL; hemoglobin 11.8 g/dL; hematocrit 35.4%; platelets 198,000/mcL; INR 1.0; aPTT 28 seconds; BUN 18 mg/dL; creatinine 0.9 mg/dL; eGFR >60 mL/min; sodium 139 mEq/L; potassium 4.1 mEq/L; glucose 142 mg/dL." },
      { label: "inr", value: "1.0", sourceUnit: "(ratio)", sourceSpan: "WBC 11,200/mcL; hemoglobin 11.8 g/dL; hematocrit 35.4%; platelets 198,000/mcL; INR 1.0; aPTT 28 seconds; BUN 18 mg/dL; creatinine 0.9 mg/dL; eGFR >60 mL/min; sodium 139 mEq/L; potassium 4.1 mEq/L; glucose 142 mg/dL." },
      { label: "ptt", value: "28", sourceUnit: "seconds", sourceSpan: "WBC 11,200/mcL; hemoglobin 11.8 g/dL; hematocrit 35.4%; platelets 198,000/mcL; INR 1.0; aPTT 28 seconds; BUN 18 mg/dL; creatinine 0.9 mg/dL; eGFR >60 mL/min; sodium 139 mEq/L; potassium 4.1 mEq/L; glucose 142 mg/dL." },
      { label: "bun", value: "18", sourceUnit: "mg/dL", sourceSpan: "WBC 11,200/mcL; hemoglobin 11.8 g/dL; hematocrit 35.4%; platelets 198,000/mcL; INR 1.0; aPTT 28 seconds; BUN 18 mg/dL; creatinine 0.9 mg/dL; eGFR >60 mL/min; sodium 139 mEq/L; potassium 4.1 mEq/L; glucose 142 mg/dL." },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "WBC 11,200/mcL; hemoglobin 11.8 g/dL; hematocrit 35.4%; platelets 198,000/mcL; INR 1.0; aPTT 28 seconds; BUN 18 mg/dL; creatinine 0.9 mg/dL; eGFR >60 mL/min; sodium 139 mEq/L; potassium 4.1 mEq/L; glucose 142 mg/dL." },
      { label: "sodium", value: "139", sourceUnit: "mEq/L", sourceSpan: "WBC 11,200/mcL; hemoglobin 11.8 g/dL; hematocrit 35.4%; platelets 198,000/mcL; INR 1.0; aPTT 28 seconds; BUN 18 mg/dL; creatinine 0.9 mg/dL; eGFR >60 mL/min; sodium 139 mEq/L; potassium 4.1 mEq/L; glucose 142 mg/dL." },
      { label: "potassium", value: "4.1", sourceUnit: "mEq/L", sourceSpan: "WBC 11,200/mcL; hemoglobin 11.8 g/dL; hematocrit 35.4%; platelets 198,000/mcL; INR 1.0; aPTT 28 seconds; BUN 18 mg/dL; creatinine 0.9 mg/dL; eGFR >60 mL/min; sodium 139 mEq/L; potassium 4.1 mEq/L; glucose 142 mg/dL." },
      { label: "glucose", value: "142", sourceUnit: "mg/dL", sourceSpan: "WBC 11,200/mcL; hemoglobin 11.8 g/dL; hematocrit 35.4%; platelets 198,000/mcL; INR 1.0; aPTT 28 seconds; BUN 18 mg/dL; creatinine 0.9 mg/dL; eGFR >60 mL/min; sodium 139 mEq/L; potassium 4.1 mEq/L; glucose 142 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/stage1_update",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.2", sourceUnit: "C", sourceSpan: "Vital signs: T 37.2 C, HR 122/min regular, BP 100/70 mmHg from a preoperative baseline of 138/82, RR 28/min, SpO2 87% on room air." },
      { label: "hr", value: "122", sourceUnit: "bpm", sourceSpan: "Vital signs: T 37.2 C, HR 122/min regular, BP 100/70 mmHg from a preoperative baseline of 138/82, RR 28/min, SpO2 87% on room air." },
      { label: "sbp", value: "100", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.2 C, HR 122/min regular, BP 100/70 mmHg from a preoperative baseline of 138/82, RR 28/min, SpO2 87% on room air." },
      { label: "dbp", value: "70", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.2 C, HR 122/min regular, BP 100/70 mmHg from a preoperative baseline of 138/82, RR 28/min, SpO2 87% on room air." },
      { label: "rr", value: "28", sourceUnit: "/min", sourceSpan: "Vital signs: T 37.2 C, HR 122/min regular, BP 100/70 mmHg from a preoperative baseline of 138/82, RR 28/min, SpO2 87% on room air." },
      { label: "spo2", value: "87", sourceUnit: "%", sourceSpan: "Vital signs: T 37.2 C, HR 122/min regular, BP 100/70 mmHg from a preoperative baseline of 138/82, RR 28/min, SpO2 87% on room air." }
    ],
    excludedValues: [
      { label: "sbp", value: "138", reason: "prior", sourceSpan: "BP 100/70 mmHg from a preoperative baseline of 138/82" },
      { label: "dbp", value: "82", reason: "prior", sourceSpan: "BP 100/70 mmHg from a preoperative baseline of 138/82" }
    ],
    unitAliases: []
  }
];

const batch06Records: ExtractionRecord[] = [
  {
    exhibitRef: "gpt_case_premium_2026_06_10_case03_chronic_self_management/initial_diabetes_visit",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_premium_next_case_health_literacy_diabetes_01/assessment",
    lane: "skip_serial"
  },
  {
    exhibitRef: "gpt_case_premium_next_case_ipv_safety_planning_06/triage_note",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_premium_next_case_preventive_screening_vaccine_05/assessment_data",
    lane: "extract",
    panel: [
      { label: "sbp", value: "136", sourceUnit: "mm Hg", sourceSpan: "Blood pressure 136/84 mm Hg, pulse 78/min, respirations 16/min." },
      { label: "dbp", value: "84", sourceUnit: "mm Hg", sourceSpan: "Blood pressure 136/84 mm Hg, pulse 78/min, respirations 16/min." },
      { label: "hr", value: "78", sourceUnit: "bpm", sourceSpan: "Blood pressure 136/84 mm Hg, pulse 78/min, respirations 16/min." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Blood pressure 136/84 mm Hg, pulse 78/min, respirations 16/min." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_pressure_injury_prevention_mobility_01/stage_1_update",
    lane: "extract",
    panel: [
      { label: "hr", value: "76", sourceUnit: "bpm", sourceSpan: "HR 76, BP 130/72, RR 12, SpO2 94% on 2 L nasal cannula." },
      { label: "sbp", value: "130", sourceUnit: "mmHg", sourceSpan: "HR 76, BP 130/72, RR 12, SpO2 94% on 2 L nasal cannula." },
      { label: "dbp", value: "72", sourceUnit: "mmHg", sourceSpan: "HR 76, BP 130/72, RR 12, SpO2 94% on 2 L nasal cannula." },
      { label: "rr", value: "12", sourceUnit: "/min", sourceSpan: "HR 76, BP 130/72, RR 12, SpO2 94% on 2 L nasal cannula." },
      { label: "spo2", value: "94", sourceUnit: "%", sourceSpan: "HR 76, BP 130/72, RR 12, SpO2 94% on 2 L nasal cannula." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_svc_syndrome_01/stage_3_update",
    lane: "extract",
    panel: [
      { label: "spo2", value: "93", sourceUnit: "%", sourceSpan: "At hour 24: SpO2 93% on high-flow nasal cannula, RR 24/min, HR 102/min, BP 130/80 mmHg." },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "At hour 24: SpO2 93% on high-flow nasal cannula, RR 24/min, HR 102/min, BP 130/80 mmHg." },
      { label: "hr", value: "102", sourceUnit: "bpm", sourceSpan: "At hour 24: SpO2 93% on high-flow nasal cannula, RR 24/min, HR 102/min, BP 130/80 mmHg." },
      { label: "sbp", value: "130", sourceUnit: "mmHg", sourceSpan: "At hour 24: SpO2 93% on high-flow nasal cannula, RR 24/min, HR 102/min, BP 130/80 mmHg." },
      { label: "dbp", value: "80", sourceUnit: "mmHg", sourceSpan: "At hour 24: SpO2 93% on high-flow nasal cannula, RR 24/min, HR 102/min, BP 130/80 mmHg." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_taco_vs_trali_01/baseline_history_protocol",
    lane: "extract",
    panel: [
      { label: "hemoglobin", value: "6.4", sourceUnit: "g/dL", sourceSpan: "outpatient hemoglobin 6.4 g/dL" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_taco_vs_trali_01/stage_2_reaction",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.2", sourceUnit: "C", sourceSpan: "Vital signs: T 37.2 C, HR 110, BP 168/96, RR 28, SpO2 89% on room air." },
      { label: "hr", value: "110", sourceUnit: "bpm", sourceSpan: "Vital signs: T 37.2 C, HR 110, BP 168/96, RR 28, SpO2 89% on room air." },
      { label: "sbp", value: "168", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.2 C, HR 110, BP 168/96, RR 28, SpO2 89% on room air." },
      { label: "dbp", value: "96", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.2 C, HR 110, BP 168/96, RR 28, SpO2 89% on room air." },
      { label: "rr", value: "28", sourceUnit: "/min", sourceSpan: "Vital signs: T 37.2 C, HR 110, BP 168/96, RR 28, SpO2 89% on room air." },
      { label: "spo2", value: "89", sourceUnit: "%", sourceSpan: "Vital signs: T 37.2 C, HR 110, BP 168/96, RR 28, SpO2 89% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_taco_vs_trali_01/stage_3_diagnostics",
    lane: "extract",
    panel: [
      { label: "bnp", value: "890", sourceUnit: "pg/mL", sourceSpan: "BNP: 890 pg/mL, up from 280 pg/mL baseline." },
      { label: "hemoglobin", value: "8.1", sourceUnit: "g/dL", sourceSpan: "Post-transfusion hemoglobin: 8.1 g/dL." }
    ],
    excludedValues: [
      { label: "bnp", value: "280", reason: "prior", sourceSpan: "BNP: 890 pg/mL, up from 280 pg/mL baseline." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_taco_vs_trali_01/stage_3_interventions",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.1", sourceUnit: "C", sourceSpan: "Thirty minutes later: T 37.1 C, HR 98, BP 152/88, RR 22, SpO2 94% on non-rebreather.", context: "post_intervention" },
      { label: "hr", value: "98", sourceUnit: "bpm", sourceSpan: "Thirty minutes later: T 37.1 C, HR 98, BP 152/88, RR 22, SpO2 94% on non-rebreather.", context: "post_intervention" },
      { label: "sbp", value: "152", sourceUnit: "mmHg", sourceSpan: "Thirty minutes later: T 37.1 C, HR 98, BP 152/88, RR 22, SpO2 94% on non-rebreather.", context: "post_intervention" },
      { label: "dbp", value: "88", sourceUnit: "mmHg", sourceSpan: "Thirty minutes later: T 37.1 C, HR 98, BP 152/88, RR 22, SpO2 94% on non-rebreather.", context: "post_intervention" },
      { label: "rr", value: "22", sourceUnit: "/min", sourceSpan: "Thirty minutes later: T 37.1 C, HR 98, BP 152/88, RR 22, SpO2 94% on non-rebreather.", context: "post_intervention" },
      { label: "spo2", value: "94", sourceUnit: "%", sourceSpan: "Thirty minutes later: T 37.1 C, HR 98, BP 152/88, RR 22, SpO2 94% on non-rebreather.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_unsafe_assignment_01/stage_3_resolution",
    lane: "extract",
    panel: [
      { label: "sbp", value: "148", sourceUnit: "mmHg", sourceSpan: "Systolic blood pressure is 148 after the nicardipine increase.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_unsafe_premature_discharge_01/stage_2_advocacy_resources",
    lane: "extract",
    panel: [
      { label: "spo2", value: "89", sourceUnit: "%", sourceSpan: "the client desaturates to 89% with minimal exertion" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01/initial_assessment",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "C", sourceSpan: "Vitals: T 36.8 C, HR 118, BP 88/54, RR 20, SpO2 96% on 2 L nasal cannula." },
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "Vitals: T 36.8 C, HR 118, BP 88/54, RR 20, SpO2 96% on 2 L nasal cannula." },
      { label: "sbp", value: "88", sourceUnit: "mmHg", sourceSpan: "Vitals: T 36.8 C, HR 118, BP 88/54, RR 20, SpO2 96% on 2 L nasal cannula." },
      { label: "dbp", value: "54", sourceUnit: "mmHg", sourceSpan: "Vitals: T 36.8 C, HR 118, BP 88/54, RR 20, SpO2 96% on 2 L nasal cannula." },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "Vitals: T 36.8 C, HR 118, BP 88/54, RR 20, SpO2 96% on 2 L nasal cannula." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Vitals: T 36.8 C, HR 118, BP 88/54, RR 20, SpO2 96% on 2 L nasal cannula." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01/initial_labs",
    lane: "extract",
    panel: [
      { label: "hemoglobin", value: "8.1", sourceUnit: "g/dL", sourceSpan: "Hgb 8.1 g/dL, Hct 24.3%, platelets 72,000/µL, WBC 6,200/µL, Na 131 mEq/L, K 3.6 mEq/L, BUN 32 mg/dL, creatinine 1.3 mg/dL (baseline 1.0), total bilirubin 3.8 mg/dL, albumin 2.4 g/dL, INR 1.9, lactate 3.4 mmol/L, ammonia 62 µmol/L." },
      { label: "hematocrit", value: "24.3", sourceUnit: "%", sourceSpan: "Hgb 8.1 g/dL, Hct 24.3%, platelets 72,000/µL, WBC 6,200/µL, Na 131 mEq/L, K 3.6 mEq/L, BUN 32 mg/dL, creatinine 1.3 mg/dL (baseline 1.0), total bilirubin 3.8 mg/dL, albumin 2.4 g/dL, INR 1.9, lactate 3.4 mmol/L, ammonia 62 µmol/L." },
      { label: "platelets", value: "72,000", sourceUnit: "/µL", sourceSpan: "Hgb 8.1 g/dL, Hct 24.3%, platelets 72,000/µL, WBC 6,200/µL, Na 131 mEq/L, K 3.6 mEq/L, BUN 32 mg/dL, creatinine 1.3 mg/dL (baseline 1.0), total bilirubin 3.8 mg/dL, albumin 2.4 g/dL, INR 1.9, lactate 3.4 mmol/L, ammonia 62 µmol/L." },
      { label: "wbc", value: "6,200", sourceUnit: "/µL", sourceSpan: "Hgb 8.1 g/dL, Hct 24.3%, platelets 72,000/µL, WBC 6,200/µL, Na 131 mEq/L, K 3.6 mEq/L, BUN 32 mg/dL, creatinine 1.3 mg/dL (baseline 1.0), total bilirubin 3.8 mg/dL, albumin 2.4 g/dL, INR 1.9, lactate 3.4 mmol/L, ammonia 62 µmol/L." },
      { label: "sodium", value: "131", sourceUnit: "mEq/L", sourceSpan: "Hgb 8.1 g/dL, Hct 24.3%, platelets 72,000/µL, WBC 6,200/µL, Na 131 mEq/L, K 3.6 mEq/L, BUN 32 mg/dL, creatinine 1.3 mg/dL (baseline 1.0), total bilirubin 3.8 mg/dL, albumin 2.4 g/dL, INR 1.9, lactate 3.4 mmol/L, ammonia 62 µmol/L." },
      { label: "potassium", value: "3.6", sourceUnit: "mEq/L", sourceSpan: "Hgb 8.1 g/dL, Hct 24.3%, platelets 72,000/µL, WBC 6,200/µL, Na 131 mEq/L, K 3.6 mEq/L, BUN 32 mg/dL, creatinine 1.3 mg/dL (baseline 1.0), total bilirubin 3.8 mg/dL, albumin 2.4 g/dL, INR 1.9, lactate 3.4 mmol/L, ammonia 62 µmol/L." },
      { label: "bun", value: "32", sourceUnit: "mg/dL", sourceSpan: "Hgb 8.1 g/dL, Hct 24.3%, platelets 72,000/µL, WBC 6,200/µL, Na 131 mEq/L, K 3.6 mEq/L, BUN 32 mg/dL, creatinine 1.3 mg/dL (baseline 1.0), total bilirubin 3.8 mg/dL, albumin 2.4 g/dL, INR 1.9, lactate 3.4 mmol/L, ammonia 62 µmol/L." },
      { label: "creatinine", value: "1.3", sourceUnit: "mg/dL", sourceSpan: "Hgb 8.1 g/dL, Hct 24.3%, platelets 72,000/µL, WBC 6,200/µL, Na 131 mEq/L, K 3.6 mEq/L, BUN 32 mg/dL, creatinine 1.3 mg/dL (baseline 1.0), total bilirubin 3.8 mg/dL, albumin 2.4 g/dL, INR 1.9, lactate 3.4 mmol/L, ammonia 62 µmol/L." },
      { label: "total_bilirubin", value: "3.8", sourceUnit: "mg/dL", sourceSpan: "Hgb 8.1 g/dL, Hct 24.3%, platelets 72,000/µL, WBC 6,200/µL, Na 131 mEq/L, K 3.6 mEq/L, BUN 32 mg/dL, creatinine 1.3 mg/dL (baseline 1.0), total bilirubin 3.8 mg/dL, albumin 2.4 g/dL, INR 1.9, lactate 3.4 mmol/L, ammonia 62 µmol/L." },
      { label: "inr", value: "1.9", sourceUnit: "(ratio)", sourceSpan: "Hgb 8.1 g/dL, Hct 24.3%, platelets 72,000/µL, WBC 6,200/µL, Na 131 mEq/L, K 3.6 mEq/L, BUN 32 mg/dL, creatinine 1.3 mg/dL (baseline 1.0), total bilirubin 3.8 mg/dL, albumin 2.4 g/dL, INR 1.9, lactate 3.4 mmol/L, ammonia 62 µmol/L." },
      { label: "lactate", value: "3.4", sourceUnit: "mmol/L", sourceSpan: "Hgb 8.1 g/dL, Hct 24.3%, platelets 72,000/µL, WBC 6,200/µL, Na 131 mEq/L, K 3.6 mEq/L, BUN 32 mg/dL, creatinine 1.3 mg/dL (baseline 1.0), total bilirubin 3.8 mg/dL, albumin 2.4 g/dL, INR 1.9, lactate 3.4 mmol/L, ammonia 62 µmol/L." },
      { label: "ammonia", value: "62", sourceUnit: "µmol/L", sourceSpan: "Hgb 8.1 g/dL, Hct 24.3%, platelets 72,000/µL, WBC 6,200/µL, Na 131 mEq/L, K 3.6 mEq/L, BUN 32 mg/dL, creatinine 1.3 mg/dL (baseline 1.0), total bilirubin 3.8 mg/dL, albumin 2.4 g/dL, INR 1.9, lactate 3.4 mmol/L, ammonia 62 µmol/L." }
    ],
    excludedValues: [
      { label: "creatinine", value: "1.0", reason: "prior", sourceSpan: "creatinine 1.3 mg/dL (baseline 1.0)" }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/baseline_order",
    lane: "extract",
    panel: [
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Respiratory rate 16/min, SpO2 95% on room air, sedation score 1 (awake and alert)." },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "Respiratory rate 16/min, SpO2 95% on room air, sedation score 1 (awake and alert)." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/post_dose",
    lane: "extract",
    panel: [
      { label: "rr", value: "10", sourceUnit: "/min", sourceSpan: "Respiratory rate 10/min, SpO2 90% on room air." },
      { label: "spo2", value: "90", sourceUnit: "%", sourceSpan: "Respiratory rate 10/min, SpO2 90% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/pre_dose",
    lane: "extract",
    panel: [
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Respiratory rate 16/min, SpO2 95% on room air, blood pressure 132/76 mm Hg." },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "Respiratory rate 16/min, SpO2 95% on room air, blood pressure 132/76 mm Hg." },
      { label: "sbp", value: "132", sourceUnit: "mm Hg", sourceSpan: "Respiratory rate 16/min, SpO2 95% on room air, blood pressure 132/76 mm Hg." },
      { label: "dbp", value: "76", sourceUnit: "mm Hg", sourceSpan: "Respiratory rate 16/min, SpO2 95% on room air, blood pressure 132/76 mm Hg." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03/triage",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.8", sourceUnit: "°C", sourceSpan: "Temperature 37.8°C." },
      { label: "hr", value: "128", sourceUnit: "bpm", sourceSpan: "Heart rate 128/min." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04/baseline_wound",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04/home_observe",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  }
];

const batch07Records: ExtractionRecord[] = [
  {
    exhibitRef: "gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04/teachback_wound",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.9", sourceUnit: "°C", sourceSpan: "Temperature is 37.9°C." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01/baseline",
    lane: "extract",
    panel: [
      { label: "spo2", value: "92", sourceUnit: "%", sourceSpan: "SpO2 92% on 2 L/min after walking 30 feet." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04/acute_change",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.9", sourceUnit: "C", sourceSpan: "Temperature 37.9 C." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02/assessment",
    lane: "extract",
    panel: [
      { label: "sbp", value: "148", sourceUnit: "mmHg", sourceSpan: "BP 148/86, HR 96 irregular, RR 18, SpO2 95% room air." },
      { label: "dbp", value: "86", sourceUnit: "mmHg", sourceSpan: "BP 148/86, HR 96 irregular, RR 18, SpO2 95% room air." },
      { label: "hr", value: "96", sourceUnit: "bpm", sourceSpan: "BP 148/86, HR 96 irregular, RR 18, SpO2 95% room air." },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "BP 148/86, HR 96 irregular, RR 18, SpO2 95% room air." },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "BP 148/86, HR 96 irregular, RR 18, SpO2 95% room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_opus21_case_colostomy_lep_discharge_01/stage2_woc_teaching",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.1", sourceUnit: "C", sourceSpan: "Vitals: T 37.1 C, HR 74, BP 130/78, RR 14, SpO2 98%." },
      { label: "hr", value: "74", sourceUnit: "bpm", sourceSpan: "Vitals: T 37.1 C, HR 74, BP 130/78, RR 14, SpO2 98%." },
      { label: "sbp", value: "130", sourceUnit: "mmHg", sourceSpan: "Vitals: T 37.1 C, HR 74, BP 130/78, RR 14, SpO2 98%." },
      { label: "dbp", value: "78", sourceUnit: "mmHg", sourceSpan: "Vitals: T 37.1 C, HR 74, BP 130/78, RR 14, SpO2 98%." },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "Vitals: T 37.1 C, HR 74, BP 130/78, RR 14, SpO2 98%." },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "Vitals: T 37.1 C, HR 74, BP 130/78, RR 14, SpO2 98%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_pph_2026_06_16_case_01/ex_background",
    lane: "extract",
    panel: [],
    excludedValues: [
      { label: "sbp", value: "148", reason: "prior", sourceSpan: "Admission BP 148/94 mmHg." },
      { label: "dbp", value: "94", reason: "prior", sourceSpan: "Admission BP 148/94 mmHg." },
      { label: "hemoglobin", value: "11.8", reason: "prior", sourceSpan: "Admission Hgb 11.8 g/dL, Hct 35.2%." },
      { label: "hematocrit", value: "35.2", reason: "prior", sourceSpan: "Admission Hgb 11.8 g/dL, Hct 35.2%." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_pph_2026_06_16_case_01/ex_baseline_labs",
    lane: "extract",
    panel: [
      { label: "hemoglobin", value: "11.8", sourceUnit: "g/dL", sourceSpan: "Hgb 11.8 g/dL, Hct 35.2%, platelets 188,000/µL, fibrinogen 410 mg/dL, INR 1.0, aPTT 28 sec. Sodium 138 mEq/L, potassium 3.9 mEq/L, creatinine 0.7 mg/dL, glucose 92 mg/dL." },
      { label: "hematocrit", value: "35.2", sourceUnit: "%", sourceSpan: "Hgb 11.8 g/dL, Hct 35.2%, platelets 188,000/µL, fibrinogen 410 mg/dL, INR 1.0, aPTT 28 sec. Sodium 138 mEq/L, potassium 3.9 mEq/L, creatinine 0.7 mg/dL, glucose 92 mg/dL." },
      { label: "platelets", value: "188,000", sourceUnit: "/µL", sourceSpan: "Hgb 11.8 g/dL, Hct 35.2%, platelets 188,000/µL, fibrinogen 410 mg/dL, INR 1.0, aPTT 28 sec. Sodium 138 mEq/L, potassium 3.9 mEq/L, creatinine 0.7 mg/dL, glucose 92 mg/dL." },
      { label: "inr", value: "1.0", sourceUnit: "(ratio)", sourceSpan: "Hgb 11.8 g/dL, Hct 35.2%, platelets 188,000/µL, fibrinogen 410 mg/dL, INR 1.0, aPTT 28 sec. Sodium 138 mEq/L, potassium 3.9 mEq/L, creatinine 0.7 mg/dL, glucose 92 mg/dL." },
      { label: "ptt", value: "28", sourceUnit: "sec", sourceSpan: "Hgb 11.8 g/dL, Hct 35.2%, platelets 188,000/µL, fibrinogen 410 mg/dL, INR 1.0, aPTT 28 sec. Sodium 138 mEq/L, potassium 3.9 mEq/L, creatinine 0.7 mg/dL, glucose 92 mg/dL." },
      { label: "sodium", value: "138", sourceUnit: "mEq/L", sourceSpan: "Hgb 11.8 g/dL, Hct 35.2%, platelets 188,000/µL, fibrinogen 410 mg/dL, INR 1.0, aPTT 28 sec. Sodium 138 mEq/L, potassium 3.9 mEq/L, creatinine 0.7 mg/dL, glucose 92 mg/dL." },
      { label: "potassium", value: "3.9", sourceUnit: "mEq/L", sourceSpan: "Hgb 11.8 g/dL, Hct 35.2%, platelets 188,000/µL, fibrinogen 410 mg/dL, INR 1.0, aPTT 28 sec. Sodium 138 mEq/L, potassium 3.9 mEq/L, creatinine 0.7 mg/dL, glucose 92 mg/dL." },
      { label: "creatinine", value: "0.7", sourceUnit: "mg/dL", sourceSpan: "Hgb 11.8 g/dL, Hct 35.2%, platelets 188,000/µL, fibrinogen 410 mg/dL, INR 1.0, aPTT 28 sec. Sodium 138 mEq/L, potassium 3.9 mEq/L, creatinine 0.7 mg/dL, glucose 92 mg/dL." },
      { label: "glucose", value: "92", sourceUnit: "mg/dL", sourceSpan: "Hgb 11.8 g/dL, Hct 35.2%, platelets 188,000/µL, fibrinogen 410 mg/dL, INR 1.0, aPTT 28 sec. Sodium 138 mEq/L, potassium 3.9 mEq/L, creatinine 0.7 mg/dL, glucose 92 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_pph_2026_06_16_case_01/ex_initial_assessment",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "°C", sourceSpan: "Vital signs: T 36.8 °C, HR 118, BP 90/62 mmHg, RR 22, SpO2 97% on room air." },
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "Vital signs: T 36.8 °C, HR 118, BP 90/62 mmHg, RR 22, SpO2 97% on room air." },
      { label: "sbp", value: "90", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.8 °C, HR 118, BP 90/62 mmHg, RR 22, SpO2 97% on room air." },
      { label: "dbp", value: "62", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.8 °C, HR 118, BP 90/62 mmHg, RR 22, SpO2 97% on room air." },
      { label: "rr", value: "22", sourceUnit: "/min", sourceSpan: "Vital signs: T 36.8 °C, HR 118, BP 90/62 mmHg, RR 22, SpO2 97% on room air." },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Vital signs: T 36.8 °C, HR 118, BP 90/62 mmHg, RR 22, SpO2 97% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_pph_2026_06_16_case_01/stage_1_update",
    lane: "extract",
    panel: [
      { label: "hr", value: "124", sourceUnit: "bpm", sourceSpan: "Vital signs: HR 124, BP 86/58, RR 24, SpO2 96% on room air.", context: "post_intervention" },
      { label: "sbp", value: "86", sourceUnit: "mmHg", sourceSpan: "Vital signs: HR 124, BP 86/58, RR 24, SpO2 96% on room air.", context: "post_intervention" },
      { label: "dbp", value: "58", sourceUnit: "mmHg", sourceSpan: "Vital signs: HR 124, BP 86/58, RR 24, SpO2 96% on room air.", context: "post_intervention" },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "Vital signs: HR 124, BP 86/58, RR 24, SpO2 96% on room air.", context: "post_intervention" },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Vital signs: HR 124, BP 86/58, RR 24, SpO2 96% on room air.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_r1_regen_case_celiac_01/stage3_update",
    lane: "extract",
    panel: [
      { label: "hemoglobin", value: "12.1", sourceUnit: "g/dL", sourceSpan: "Labs: Hgb 12.1 g/dL, MCV 82 fL, ferritin 22 ng/mL, folate 8.6 ng/mL, vitamin D 32 ng/mL, calcium 8.6 mg/dL, PTH 42 pg/mL, albumin 3.8 g/dL, tTG-IgA 38 U/mL." },
      { label: "calcium", value: "8.6", sourceUnit: "mg/dL", sourceSpan: "Labs: Hgb 12.1 g/dL, MCV 82 fL, ferritin 22 ng/mL, folate 8.6 ng/mL, vitamin D 32 ng/mL, calcium 8.6 mg/dL, PTH 42 pg/mL, albumin 3.8 g/dL, tTG-IgA 38 U/mL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/initial_ed_record",
    lane: "extract",
    panel: [],
    excludedValues: [
      { label: "inr", value: "2.3", reason: "prior", sourceSpan: "Anticoagulation clinic INR five days ago was 2.3." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/stage_2_thrombectomy_preparation",
    lane: "extract",
    panel: [
      { label: "sbp", value: "168", sourceUnit: "mmHg", sourceSpan: "After 20 minutes, BP is 168/94 mmHg.", context: "post_intervention" },
      { label: "dbp", value: "94", sourceUnit: "mmHg", sourceSpan: "After 20 minutes, BP is 168/94 mmHg.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/stage_3_deterioration",
    lane: "extract",
    panel: [
      { label: "sbp", value: "174", sourceUnit: "mmHg", sourceSpan: "BP 174/96 mmHg. HR 72/min regular." },
      { label: "dbp", value: "96", sourceUnit: "mmHg", sourceSpan: "BP 174/96 mmHg. HR 72/min regular." },
      { label: "hr", value: "72", sourceUnit: "bpm", sourceSpan: "BP 174/96 mmHg. HR 72/min regular." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_car_t_crs_2026_06_11_case_01/ex1",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_car_t_crs_2026_06_11_case_01/ex2",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "°C", sourceSpan: "Baseline vital signs at 1200: Temperature 36.8 °C (oral), heart rate 78 and regular sinus rhythm on telemetry, blood pressure 132/78, respiratory rate 14, SpO₂ 98% on room air." },
      { label: "hr", value: "78", sourceUnit: "bpm", sourceSpan: "Baseline vital signs at 1200: Temperature 36.8 °C (oral), heart rate 78 and regular sinus rhythm on telemetry, blood pressure 132/78, respiratory rate 14, SpO₂ 98% on room air." },
      { label: "sbp", value: "132", sourceUnit: "mmHg", sourceSpan: "Baseline vital signs at 1200: Temperature 36.8 °C (oral), heart rate 78 and regular sinus rhythm on telemetry, blood pressure 132/78, respiratory rate 14, SpO₂ 98% on room air." },
      { label: "dbp", value: "78", sourceUnit: "mmHg", sourceSpan: "Baseline vital signs at 1200: Temperature 36.8 °C (oral), heart rate 78 and regular sinus rhythm on telemetry, blood pressure 132/78, respiratory rate 14, SpO₂ 98% on room air." },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "Baseline vital signs at 1200: Temperature 36.8 °C (oral), heart rate 78 and regular sinus rhythm on telemetry, blood pressure 132/78, respiratory rate 14, SpO₂ 98% on room air." },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "Baseline vital signs at 1200: Temperature 36.8 °C (oral), heart rate 78 and regular sinus rhythm on telemetry, blood pressure 132/78, respiratory rate 14, SpO₂ 98% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_case_warfarin_bridge_01/exh_stage1",
    lane: "extract",
    panel: [
      { label: "inr", value: "1.9", sourceUnit: "(ratio)", sourceSpan: "The INR result of 1.9 returns while the nurse is reviewing the discharge medication list with the patient and his wife." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_case_warfarin_bridge_01/exh_stage2",
    lane: "extract",
    panel: [
      { label: "inr", value: "1.9", sourceUnit: "(ratio)", sourceSpan: "The provider confirms that the INR of 1.9 does not meet the therapeutic threshold and that the enoxaparin bridge must continue at home" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_case_warfarin_bridge_01/exh_stage3",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.0", sourceUnit: "°C", sourceSpan: "The patient's final set of vitals before discharge: T 37.0 °C, HR 72, BP 130/76, RR 14, SpO₂ 98%." },
      { label: "hr", value: "72", sourceUnit: "bpm", sourceSpan: "The patient's final set of vitals before discharge: T 37.0 °C, HR 72, BP 130/76, RR 14, SpO₂ 98%." },
      { label: "sbp", value: "130", sourceUnit: "mmHg", sourceSpan: "The patient's final set of vitals before discharge: T 37.0 °C, HR 72, BP 130/76, RR 14, SpO₂ 98%." },
      { label: "dbp", value: "76", sourceUnit: "mmHg", sourceSpan: "The patient's final set of vitals before discharge: T 37.0 °C, HR 72, BP 130/76, RR 14, SpO₂ 98%." },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "The patient's final set of vitals before discharge: T 37.0 °C, HR 72, BP 130/76, RR 14, SpO₂ 98%." },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "The patient's final set of vitals before discharge: T 37.0 °C, HR 72, BP 130/76, RR 14, SpO₂ 98%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_scc_case_01/exh_stage1",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.2", sourceUnit: "°C", sourceSpan: "Vital signs: temperature 37.2 °C, heart rate 98, blood pressure 142/86, respiratory rate 20, SpO₂ 95% on room air." },
      { label: "hr", value: "98", sourceUnit: "bpm", sourceSpan: "Vital signs: temperature 37.2 °C, heart rate 98, blood pressure 142/86, respiratory rate 20, SpO₂ 95% on room air." },
      { label: "sbp", value: "142", sourceUnit: "mmHg", sourceSpan: "Vital signs: temperature 37.2 °C, heart rate 98, blood pressure 142/86, respiratory rate 20, SpO₂ 95% on room air." },
      { label: "dbp", value: "86", sourceUnit: "mmHg", sourceSpan: "Vital signs: temperature 37.2 °C, heart rate 98, blood pressure 142/86, respiratory rate 20, SpO₂ 95% on room air." },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "Vital signs: temperature 37.2 °C, heart rate 98, blood pressure 142/86, respiratory rate 20, SpO₂ 95% on room air." },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "Vital signs: temperature 37.2 °C, heart rate 98, blood pressure 142/86, respiratory rate 20, SpO₂ 95% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_vanco_case_01/stage_1_assessment",
    lane: "extract",
    panel: [
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "Vital signs: heart rate 118/min, blood pressure 108/62 mm Hg, respiratory rate 20/min, SpO2 96% on room air." },
      { label: "sbp", value: "108", sourceUnit: "mm Hg", sourceSpan: "Vital signs: heart rate 118/min, blood pressure 108/62 mm Hg, respiratory rate 20/min, SpO2 96% on room air." },
      { label: "dbp", value: "62", sourceUnit: "mm Hg", sourceSpan: "Vital signs: heart rate 118/min, blood pressure 108/62 mm Hg, respiratory rate 20/min, SpO2 96% on room air." },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "Vital signs: heart rate 118/min, blood pressure 108/62 mm Hg, respiratory rate 20/min, SpO2 96% on room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Vital signs: heart rate 118/min, blood pressure 108/62 mm Hg, respiratory rate 20/min, SpO2 96% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  }
];

const batch08Records: ExtractionRecord[] = [
  {
    exhibitRef: "opus_vanco_case_01/stage_2_data",
    lane: "extract",
    panel: [
      { label: "wbc", value: "12,200", sourceUnit: "/µL", sourceSpan: "Morning labs: WBC 12,200/µL, creatinine 1.7 mg/dL, BUN 28 mg/dL, potassium 4.4 mEq/L, lactate 1.4 mmol/L, glucose 164 mg/dL." },
      { label: "creatinine", value: "1.7", sourceUnit: "mg/dL", sourceSpan: "Morning labs: WBC 12,200/µL, creatinine 1.7 mg/dL, BUN 28 mg/dL, potassium 4.4 mEq/L, lactate 1.4 mmol/L, glucose 164 mg/dL." },
      { label: "bun", value: "28", sourceUnit: "mg/dL", sourceSpan: "Morning labs: WBC 12,200/µL, creatinine 1.7 mg/dL, BUN 28 mg/dL, potassium 4.4 mEq/L, lactate 1.4 mmol/L, glucose 164 mg/dL." },
      { label: "potassium", value: "4.4", sourceUnit: "mEq/L", sourceSpan: "Morning labs: WBC 12,200/µL, creatinine 1.7 mg/dL, BUN 28 mg/dL, potassium 4.4 mEq/L, lactate 1.4 mmol/L, glucose 164 mg/dL." },
      { label: "lactate", value: "1.4", sourceUnit: "mmol/L", sourceSpan: "Morning labs: WBC 12,200/µL, creatinine 1.7 mg/dL, BUN 28 mg/dL, potassium 4.4 mEq/L, lactate 1.4 mmol/L, glucose 164 mg/dL." },
      { label: "glucose", value: "164", sourceUnit: "mg/dL", sourceSpan: "Morning labs: WBC 12,200/µL, creatinine 1.7 mg/dL, BUN 28 mg/dL, potassium 4.4 mEq/L, lactate 1.4 mmol/L, glucose 164 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_vanco_case_01/stage_3_data",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.4", sourceUnit: "°C", sourceSpan: "Vital signs: temperature 37.4 °C, heart rate 82/min, blood pressure 148/88 mm Hg, respiratory rate 18/min, SpO2 96% on room air." },
      { label: "hr", value: "82", sourceUnit: "bpm", sourceSpan: "Vital signs: temperature 37.4 °C, heart rate 82/min, blood pressure 148/88 mm Hg, respiratory rate 18/min, SpO2 96% on room air." },
      { label: "sbp", value: "148", sourceUnit: "mm Hg", sourceSpan: "Vital signs: temperature 37.4 °C, heart rate 82/min, blood pressure 148/88 mm Hg, respiratory rate 18/min, SpO2 96% on room air." },
      { label: "dbp", value: "88", sourceUnit: "mm Hg", sourceSpan: "Vital signs: temperature 37.4 °C, heart rate 82/min, blood pressure 148/88 mm Hg, respiratory rate 18/min, SpO2 96% on room air." },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Vital signs: temperature 37.4 °C, heart rate 82/min, blood pressure 148/88 mm Hg, respiratory rate 18/min, SpO2 96% on room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Vital signs: temperature 37.4 °C, heart rate 82/min, blood pressure 148/88 mm Hg, respiratory rate 18/min, SpO2 96% on room air." },
      { label: "creatinine", value: "2.4", sourceUnit: "mg/dL", sourceSpan: "Morning labs: creatinine 2.4 mg/dL, BUN 44 mg/dL, potassium 5.1 mEq/L, bicarbonate 19 mEq/L, eGFR 26 mL/min." },
      { label: "bun", value: "44", sourceUnit: "mg/dL", sourceSpan: "Morning labs: creatinine 2.4 mg/dL, BUN 44 mg/dL, potassium 5.1 mEq/L, bicarbonate 19 mEq/L, eGFR 26 mL/min." },
      { label: "potassium", value: "5.1", sourceUnit: "mEq/L", sourceSpan: "Morning labs: creatinine 2.4 mg/dL, BUN 44 mg/dL, potassium 5.1 mEq/L, bicarbonate 19 mEq/L, eGFR 26 mL/min." },
      { label: "bicarbonate", value: "19", sourceUnit: "mEq/L", sourceSpan: "Morning labs: creatinine 2.4 mg/dL, BUN 44 mg/dL, potassium 5.1 mEq/L, bicarbonate 19 mEq/L, eGFR 26 mL/min." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus1_case_discharge_med_rec_anticoag_01/clarification_note",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus1_case_discharge_med_rec_anticoag_01/teaching_note",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus12_case_inpatient_suicide_risk_01/admission_labs",
    lane: "extract",
    panel: [
      { label: "wbc", value: "14,200", sourceUnit: "/µL", sourceSpan: "WBC 14,200/µL, hemoglobin 11.8 g/dL, platelets 210,000/µL, BUN 28 mg/dL, creatinine 1.3 mg/dL, eGFR 56 mL/min/1.73 m², sodium 139 mEq/L, potassium 4.4 mEq/L, glucose 238 mg/dL, HbA1c 9.4%, albumin 2.9 g/dL, ESR 62 mm/hr, CRP 8.4 mg/dL, wound culture pending." },
      { label: "hemoglobin", value: "11.8", sourceUnit: "g/dL", sourceSpan: "WBC 14,200/µL, hemoglobin 11.8 g/dL, platelets 210,000/µL, BUN 28 mg/dL, creatinine 1.3 mg/dL, eGFR 56 mL/min/1.73 m², sodium 139 mEq/L, potassium 4.4 mEq/L, glucose 238 mg/dL, HbA1c 9.4%, albumin 2.9 g/dL, ESR 62 mm/hr, CRP 8.4 mg/dL, wound culture pending." },
      { label: "platelets", value: "210,000", sourceUnit: "/µL", sourceSpan: "WBC 14,200/µL, hemoglobin 11.8 g/dL, platelets 210,000/µL, BUN 28 mg/dL, creatinine 1.3 mg/dL, eGFR 56 mL/min/1.73 m², sodium 139 mEq/L, potassium 4.4 mEq/L, glucose 238 mg/dL, HbA1c 9.4%, albumin 2.9 g/dL, ESR 62 mm/hr, CRP 8.4 mg/dL, wound culture pending." },
      { label: "bun", value: "28", sourceUnit: "mg/dL", sourceSpan: "WBC 14,200/µL, hemoglobin 11.8 g/dL, platelets 210,000/µL, BUN 28 mg/dL, creatinine 1.3 mg/dL, eGFR 56 mL/min/1.73 m², sodium 139 mEq/L, potassium 4.4 mEq/L, glucose 238 mg/dL, HbA1c 9.4%, albumin 2.9 g/dL, ESR 62 mm/hr, CRP 8.4 mg/dL, wound culture pending." },
      { label: "creatinine", value: "1.3", sourceUnit: "mg/dL", sourceSpan: "WBC 14,200/µL, hemoglobin 11.8 g/dL, platelets 210,000/µL, BUN 28 mg/dL, creatinine 1.3 mg/dL, eGFR 56 mL/min/1.73 m², sodium 139 mEq/L, potassium 4.4 mEq/L, glucose 238 mg/dL, HbA1c 9.4%, albumin 2.9 g/dL, ESR 62 mm/hr, CRP 8.4 mg/dL, wound culture pending." },
      { label: "sodium", value: "139", sourceUnit: "mEq/L", sourceSpan: "WBC 14,200/µL, hemoglobin 11.8 g/dL, platelets 210,000/µL, BUN 28 mg/dL, creatinine 1.3 mg/dL, eGFR 56 mL/min/1.73 m², sodium 139 mEq/L, potassium 4.4 mEq/L, glucose 238 mg/dL, HbA1c 9.4%, albumin 2.9 g/dL, ESR 62 mm/hr, CRP 8.4 mg/dL, wound culture pending." },
      { label: "potassium", value: "4.4", sourceUnit: "mEq/L", sourceSpan: "WBC 14,200/µL, hemoglobin 11.8 g/dL, platelets 210,000/µL, BUN 28 mg/dL, creatinine 1.3 mg/dL, eGFR 56 mL/min/1.73 m², sodium 139 mEq/L, potassium 4.4 mEq/L, glucose 238 mg/dL, HbA1c 9.4%, albumin 2.9 g/dL, ESR 62 mm/hr, CRP 8.4 mg/dL, wound culture pending." },
      { label: "glucose", value: "238", sourceUnit: "mg/dL", sourceSpan: "WBC 14,200/µL, hemoglobin 11.8 g/dL, platelets 210,000/µL, BUN 28 mg/dL, creatinine 1.3 mg/dL, eGFR 56 mL/min/1.73 m², sodium 139 mEq/L, potassium 4.4 mEq/L, glucose 238 mg/dL, HbA1c 9.4%, albumin 2.9 g/dL, ESR 62 mm/hr, CRP 8.4 mg/dL, wound culture pending." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus12_case_inpatient_suicide_risk_01/morning_assessment",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.6", sourceUnit: "°C", sourceSpan: "Vital signs: T 37.6 °C, HR 82, BP 138/86, RR 16, SpO₂ 96% on room air." },
      { label: "hr", value: "82", sourceUnit: "bpm", sourceSpan: "Vital signs: T 37.6 °C, HR 82, BP 138/86, RR 16, SpO₂ 96% on room air." },
      { label: "sbp", value: "138", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.6 °C, HR 82, BP 138/86, RR 16, SpO₂ 96% on room air." },
      { label: "dbp", value: "86", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 37.6 °C, HR 82, BP 138/86, RR 16, SpO₂ 96% on room air." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Vital signs: T 37.6 °C, HR 82, BP 138/86, RR 16, SpO₂ 96% on room air." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Vital signs: T 37.6 °C, HR 82, BP 138/86, RR 16, SpO₂ 96% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus2_case_code_status_01/exhibit_stage2",
    lane: "skip_serial"
  },
  {
    exhibitRef: "opus2_case_postop_opioid_respiratory_depression_01/stage_0838_findings",
    lane: "extract",
    panel: [
      { label: "hr", value: "62", sourceUnit: "bpm", sourceSpan: "Vital signs: HR 62/min, BP 108/66 mm Hg, RR 7/min, SpO2 91% on 2 L/min nasal cannula.", context: "post_intervention" },
      { label: "sbp", value: "108", sourceUnit: "mm Hg", sourceSpan: "Vital signs: HR 62/min, BP 108/66 mm Hg, RR 7/min, SpO2 91% on 2 L/min nasal cannula.", context: "post_intervention" },
      { label: "dbp", value: "66", sourceUnit: "mm Hg", sourceSpan: "Vital signs: HR 62/min, BP 108/66 mm Hg, RR 7/min, SpO2 91% on 2 L/min nasal cannula.", context: "post_intervention" },
      { label: "rr", value: "7", sourceUnit: "/min", sourceSpan: "Vital signs: HR 62/min, BP 108/66 mm Hg, RR 7/min, SpO2 91% on 2 L/min nasal cannula.", context: "post_intervention" },
      { label: "spo2", value: "91", sourceUnit: "%", sourceSpan: "Vital signs: HR 62/min, BP 108/66 mm Hg, RR 7/min, SpO2 91% on 2 L/min nasal cannula.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus2_case_postop_opioid_respiratory_depression_01/stage_0855_findings",
    lane: "extract",
    panel: [
      { label: "hr", value: "78", sourceUnit: "bpm", sourceSpan: "0855 vital signs: HR 78/min, BP 126/78 mm Hg, RR 14/min, SpO2 94% on 2 L/min nasal cannula.", context: "post_intervention" },
      { label: "sbp", value: "126", sourceUnit: "mm Hg", sourceSpan: "0855 vital signs: HR 78/min, BP 126/78 mm Hg, RR 14/min, SpO2 94% on 2 L/min nasal cannula.", context: "post_intervention" },
      { label: "dbp", value: "78", sourceUnit: "mm Hg", sourceSpan: "0855 vital signs: HR 78/min, BP 126/78 mm Hg, RR 14/min, SpO2 94% on 2 L/min nasal cannula.", context: "post_intervention" },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "0855 vital signs: HR 78/min, BP 126/78 mm Hg, RR 14/min, SpO2 94% on 2 L/min nasal cannula.", context: "post_intervention" },
      { label: "spo2", value: "94", sourceUnit: "%", sourceSpan: "0855 vital signs: HR 78/min, BP 126/78 mm Hg, RR 14/min, SpO2 94% on 2 L/min nasal cannula.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus20_case_cdiff_01/exhibit_stage2",
    lane: "extract",
    panel: [
      { label: "potassium", value: "3.6", sourceUnit: "mEq/L", sourceSpan: "Repeat labs: potassium 3.6 mEq/L (post-replacement), creatinine 1.9 mg/dL, BUN 34 mg/dL, lactate 1.8 mmol/L.", context: "post_intervention" },
      { label: "creatinine", value: "1.9", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: potassium 3.6 mEq/L (post-replacement), creatinine 1.9 mg/dL, BUN 34 mg/dL, lactate 1.8 mmol/L." },
      { label: "bun", value: "34", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: potassium 3.6 mEq/L (post-replacement), creatinine 1.9 mg/dL, BUN 34 mg/dL, lactate 1.8 mmol/L." },
      { label: "lactate", value: "1.8", sourceUnit: "mmol/L", sourceSpan: "Repeat labs: potassium 3.6 mEq/L (post-replacement), creatinine 1.9 mg/dL, BUN 34 mg/dL, lactate 1.8 mmol/L." },
      { label: "temp", value: "37.6", sourceUnit: "°C", sourceSpan: "Vitals: T 37.6 °C, HR 92, BP 108/68, RR 16, SpO₂ 97%." },
      { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: "Vitals: T 37.6 °C, HR 92, BP 108/68, RR 16, SpO₂ 97%." },
      { label: "sbp", value: "108", sourceUnit: "mmHg", sourceSpan: "Vitals: T 37.6 °C, HR 92, BP 108/68, RR 16, SpO₂ 97%." },
      { label: "dbp", value: "68", sourceUnit: "mmHg", sourceSpan: "Vitals: T 37.6 °C, HR 92, BP 108/68, RR 16, SpO₂ 97%." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Vitals: T 37.6 °C, HR 92, BP 108/68, RR 16, SpO₂ 97%." },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Vitals: T 37.6 °C, HR 92, BP 108/68, RR 16, SpO₂ 97%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus22_case_postpartum_intrusive_thoughts_01/assessment_labs",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "C", sourceSpan: "Vital signs: T 36.8 C, HR 78, BP 118/72, RR 16, SpO2 99% on room air." },
      { label: "hr", value: "78", sourceUnit: "bpm", sourceSpan: "Vital signs: T 36.8 C, HR 78, BP 118/72, RR 16, SpO2 99% on room air." },
      { label: "sbp", value: "118", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.8 C, HR 78, BP 118/72, RR 16, SpO2 99% on room air." },
      { label: "dbp", value: "72", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.8 C, HR 78, BP 118/72, RR 16, SpO2 99% on room air." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Vital signs: T 36.8 C, HR 78, BP 118/72, RR 16, SpO2 99% on room air." },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "Vital signs: T 36.8 C, HR 78, BP 118/72, RR 16, SpO2 99% on room air." },
      { label: "hemoglobin", value: "12.1", sourceUnit: "g/dL", sourceSpan: "Laboratory results from postpartum visit: TSH 2.4 mIU/L, hemoglobin 12.1 g/dL, CBC within normal limits, CMP unremarkable." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus22_case_postpartum_intrusive_thoughts_01/stage_2_symptoms",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.9", sourceUnit: "C", sourceSpan: "Vital signs: T 36.9 C, HR 84, BP 122/76, RR 18, SpO2 99%." },
      { label: "hr", value: "84", sourceUnit: "bpm", sourceSpan: "Vital signs: T 36.9 C, HR 84, BP 122/76, RR 18, SpO2 99%." },
      { label: "sbp", value: "122", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.9 C, HR 84, BP 122/76, RR 18, SpO2 99%." },
      { label: "dbp", value: "76", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.9 C, HR 84, BP 122/76, RR 18, SpO2 99%." },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "Vital signs: T 36.9 C, HR 84, BP 122/76, RR 18, SpO2 99%." },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "Vital signs: T 36.9 C, HR 84, BP 122/76, RR 18, SpO2 99%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus22_case_postpartum_intrusive_thoughts_01/stage_3_improvement",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.7", sourceUnit: "C", sourceSpan: "Vital signs: T 36.7 C, HR 74, BP 116/70, RR 14, SpO2 99%." },
      { label: "hr", value: "74", sourceUnit: "bpm", sourceSpan: "Vital signs: T 36.7 C, HR 74, BP 116/70, RR 14, SpO2 99%." },
      { label: "sbp", value: "116", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.7 C, HR 74, BP 116/70, RR 14, SpO2 99%." },
      { label: "dbp", value: "70", sourceUnit: "mmHg", sourceSpan: "Vital signs: T 36.7 C, HR 74, BP 116/70, RR 14, SpO2 99%." },
      { label: "rr", value: "14", sourceUnit: "/min", sourceSpan: "Vital signs: T 36.7 C, HR 74, BP 116/70, RR 14, SpO2 99%." },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "Vital signs: T 36.7 C, HR 74, BP 116/70, RR 14, SpO2 99%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus25_case_tb_airborne_treatment_monitoring_01/initial_assessment",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.3", sourceUnit: "C", sourceSpan: "Vital signs: T 38.3 C (101.0 F), HR 92/min, BP 118/74 mm Hg, RR 20/min, SpO2 95% on room air." },
      { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: "Vital signs: T 38.3 C (101.0 F), HR 92/min, BP 118/74 mm Hg, RR 20/min, SpO2 95% on room air." },
      { label: "sbp", value: "118", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 38.3 C (101.0 F), HR 92/min, BP 118/74 mm Hg, RR 20/min, SpO2 95% on room air." },
      { label: "dbp", value: "74", sourceUnit: "mm Hg", sourceSpan: "Vital signs: T 38.3 C (101.0 F), HR 92/min, BP 118/74 mm Hg, RR 20/min, SpO2 95% on room air." },
      { label: "rr", value: "20", sourceUnit: "/min", sourceSpan: "Vital signs: T 38.3 C (101.0 F), HR 92/min, BP 118/74 mm Hg, RR 20/min, SpO2 95% on room air." },
      { label: "spo2", value: "95", sourceUnit: "%", sourceSpan: "Vital signs: T 38.3 C (101.0 F), HR 92/min, BP 118/74 mm Hg, RR 20/min, SpO2 95% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus25_case_tb_airborne_treatment_monitoring_01/orders_and_baseline_labs",
    lane: "extract",
    panel: [
      { label: "wbc", value: "11,200", sourceUnit: "/uL", sourceSpan: "Baseline labs: WBC 11,200/uL, hemoglobin 11.4 g/dL, hematocrit 34.2%, platelets 410,000/uL, sodium 136 mEq/L, potassium 4.1 mEq/L, BUN 14 mg/dL, creatinine 0.9 mg/dL, AST 42 U/L, ALT 48 U/L, ESR 68 mm/hr." },
      { label: "hemoglobin", value: "11.4", sourceUnit: "g/dL", sourceSpan: "Baseline labs: WBC 11,200/uL, hemoglobin 11.4 g/dL, hematocrit 34.2%, platelets 410,000/uL, sodium 136 mEq/L, potassium 4.1 mEq/L, BUN 14 mg/dL, creatinine 0.9 mg/dL, AST 42 U/L, ALT 48 U/L, ESR 68 mm/hr." },
      { label: "hematocrit", value: "34.2", sourceUnit: "%", sourceSpan: "Baseline labs: WBC 11,200/uL, hemoglobin 11.4 g/dL, hematocrit 34.2%, platelets 410,000/uL, sodium 136 mEq/L, potassium 4.1 mEq/L, BUN 14 mg/dL, creatinine 0.9 mg/dL, AST 42 U/L, ALT 48 U/L, ESR 68 mm/hr." },
      { label: "platelets", value: "410,000", sourceUnit: "/uL", sourceSpan: "Baseline labs: WBC 11,200/uL, hemoglobin 11.4 g/dL, hematocrit 34.2%, platelets 410,000/uL, sodium 136 mEq/L, potassium 4.1 mEq/L, BUN 14 mg/dL, creatinine 0.9 mg/dL, AST 42 U/L, ALT 48 U/L, ESR 68 mm/hr." },
      { label: "sodium", value: "136", sourceUnit: "mEq/L", sourceSpan: "Baseline labs: WBC 11,200/uL, hemoglobin 11.4 g/dL, hematocrit 34.2%, platelets 410,000/uL, sodium 136 mEq/L, potassium 4.1 mEq/L, BUN 14 mg/dL, creatinine 0.9 mg/dL, AST 42 U/L, ALT 48 U/L, ESR 68 mm/hr." },
      { label: "potassium", value: "4.1", sourceUnit: "mEq/L", sourceSpan: "Baseline labs: WBC 11,200/uL, hemoglobin 11.4 g/dL, hematocrit 34.2%, platelets 410,000/uL, sodium 136 mEq/L, potassium 4.1 mEq/L, BUN 14 mg/dL, creatinine 0.9 mg/dL, AST 42 U/L, ALT 48 U/L, ESR 68 mm/hr." },
      { label: "bun", value: "14", sourceUnit: "mg/dL", sourceSpan: "Baseline labs: WBC 11,200/uL, hemoglobin 11.4 g/dL, hematocrit 34.2%, platelets 410,000/uL, sodium 136 mEq/L, potassium 4.1 mEq/L, BUN 14 mg/dL, creatinine 0.9 mg/dL, AST 42 U/L, ALT 48 U/L, ESR 68 mm/hr." },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "Baseline labs: WBC 11,200/uL, hemoglobin 11.4 g/dL, hematocrit 34.2%, platelets 410,000/uL, sodium 136 mEq/L, potassium 4.1 mEq/L, BUN 14 mg/dL, creatinine 0.9 mg/dL, AST 42 U/L, ALT 48 U/L, ESR 68 mm/hr." },
      { label: "ast", value: "42", sourceUnit: "U/L", sourceSpan: "Baseline labs: WBC 11,200/uL, hemoglobin 11.4 g/dL, hematocrit 34.2%, platelets 410,000/uL, sodium 136 mEq/L, potassium 4.1 mEq/L, BUN 14 mg/dL, creatinine 0.9 mg/dL, AST 42 U/L, ALT 48 U/L, ESR 68 mm/hr." },
      { label: "alt", value: "48", sourceUnit: "U/L", sourceSpan: "Baseline labs: WBC 11,200/uL, hemoglobin 11.4 g/dL, hematocrit 34.2%, platelets 410,000/uL, sodium 136 mEq/L, potassium 4.1 mEq/L, BUN 14 mg/dL, creatinine 0.9 mg/dL, AST 42 U/L, ALT 48 U/L, ESR 68 mm/hr." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus25_case_tb_airborne_treatment_monitoring_01/stage1_progress",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.9", sourceUnit: "C", sourceSpan: "The patient has drenching night sweats and a temperature spike to 38.9 C." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus25_case_tb_airborne_treatment_monitoring_01/stage3_progress",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.8", sourceUnit: "C", sourceSpan: "After three doses of the four-drug TB regimen, the patient reports nausea. Temperature is 37.8 C. Labs at 48 hours: AST 58 U/L, ALT 72 U/L.", context: "post_intervention" },
      { label: "ast", value: "58", sourceUnit: "U/L", sourceSpan: "After three doses of the four-drug TB regimen, the patient reports nausea. Temperature is 37.8 C. Labs at 48 hours: AST 58 U/L, ALT 72 U/L.", context: "post_intervention" },
      { label: "alt", value: "72", sourceUnit: "U/L", sourceSpan: "After three doses of the four-drug TB regimen, the patient reports nausea. Temperature is 37.8 C. Labs at 48 hours: AST 58 U/L, ALT 72 U/L.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus25_case_tb_airborne_treatment_monitoring_01/stage4_progress",
    lane: "extract",
    panel: [
      { label: "ast", value: "86", sourceUnit: "U/L", sourceSpan: "Repeat labs: AST 86 U/L, ALT 104 U/L, total bilirubin 1.8 mg/dL." },
      { label: "alt", value: "104", sourceUnit: "U/L", sourceSpan: "Repeat labs: AST 86 U/L, ALT 104 U/L, total bilirubin 1.8 mg/dL." },
      { label: "total_bilirubin", value: "1.8", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: AST 86 U/L, ALT 104 U/L, total bilirubin 1.8 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus3_iv_potassium_safety_case_01/exhibit_stage1_nursing_note",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus4_case_postop_sbar_01/morning_labs_0600",
    lane: "extract",
    panel: [
      { label: "wbc", value: "13,800", sourceUnit: "/µL", sourceSpan: "WBC 13,800/µL; hemoglobin 11.2 g/dL; platelets 188,000/µL; sodium 138 mEq/L; potassium 4.2 mEq/L; chloride 101 mEq/L; bicarbonate 24 mEq/L; BUN 24 mg/dL; creatinine 1.5 mg/dL; glucose 162 mg/dL; lactate 1.2 mmol/L; INR 1.1." },
      { label: "hemoglobin", value: "11.2", sourceUnit: "g/dL", sourceSpan: "WBC 13,800/µL; hemoglobin 11.2 g/dL; platelets 188,000/µL; sodium 138 mEq/L; potassium 4.2 mEq/L; chloride 101 mEq/L; bicarbonate 24 mEq/L; BUN 24 mg/dL; creatinine 1.5 mg/dL; glucose 162 mg/dL; lactate 1.2 mmol/L; INR 1.1." },
      { label: "platelets", value: "188,000", sourceUnit: "/µL", sourceSpan: "WBC 13,800/µL; hemoglobin 11.2 g/dL; platelets 188,000/µL; sodium 138 mEq/L; potassium 4.2 mEq/L; chloride 101 mEq/L; bicarbonate 24 mEq/L; BUN 24 mg/dL; creatinine 1.5 mg/dL; glucose 162 mg/dL; lactate 1.2 mmol/L; INR 1.1." },
      { label: "sodium", value: "138", sourceUnit: "mEq/L", sourceSpan: "WBC 13,800/µL; hemoglobin 11.2 g/dL; platelets 188,000/µL; sodium 138 mEq/L; potassium 4.2 mEq/L; chloride 101 mEq/L; bicarbonate 24 mEq/L; BUN 24 mg/dL; creatinine 1.5 mg/dL; glucose 162 mg/dL; lactate 1.2 mmol/L; INR 1.1." },
      { label: "potassium", value: "4.2", sourceUnit: "mEq/L", sourceSpan: "WBC 13,800/µL; hemoglobin 11.2 g/dL; platelets 188,000/µL; sodium 138 mEq/L; potassium 4.2 mEq/L; chloride 101 mEq/L; bicarbonate 24 mEq/L; BUN 24 mg/dL; creatinine 1.5 mg/dL; glucose 162 mg/dL; lactate 1.2 mmol/L; INR 1.1." },
      { label: "chloride", value: "101", sourceUnit: "mEq/L", sourceSpan: "WBC 13,800/µL; hemoglobin 11.2 g/dL; platelets 188,000/µL; sodium 138 mEq/L; potassium 4.2 mEq/L; chloride 101 mEq/L; bicarbonate 24 mEq/L; BUN 24 mg/dL; creatinine 1.5 mg/dL; glucose 162 mg/dL; lactate 1.2 mmol/L; INR 1.1." },
      { label: "bicarbonate", value: "24", sourceUnit: "mEq/L", sourceSpan: "WBC 13,800/µL; hemoglobin 11.2 g/dL; platelets 188,000/µL; sodium 138 mEq/L; potassium 4.2 mEq/L; chloride 101 mEq/L; bicarbonate 24 mEq/L; BUN 24 mg/dL; creatinine 1.5 mg/dL; glucose 162 mg/dL; lactate 1.2 mmol/L; INR 1.1." },
      { label: "bun", value: "24", sourceUnit: "mg/dL", sourceSpan: "WBC 13,800/µL; hemoglobin 11.2 g/dL; platelets 188,000/µL; sodium 138 mEq/L; potassium 4.2 mEq/L; chloride 101 mEq/L; bicarbonate 24 mEq/L; BUN 24 mg/dL; creatinine 1.5 mg/dL; glucose 162 mg/dL; lactate 1.2 mmol/L; INR 1.1." },
      { label: "creatinine", value: "1.5", sourceUnit: "mg/dL", sourceSpan: "WBC 13,800/µL; hemoglobin 11.2 g/dL; platelets 188,000/µL; sodium 138 mEq/L; potassium 4.2 mEq/L; chloride 101 mEq/L; bicarbonate 24 mEq/L; BUN 24 mg/dL; creatinine 1.5 mg/dL; glucose 162 mg/dL; lactate 1.2 mmol/L; INR 1.1." },
      { label: "glucose", value: "162", sourceUnit: "mg/dL", sourceSpan: "WBC 13,800/µL; hemoglobin 11.2 g/dL; platelets 188,000/µL; sodium 138 mEq/L; potassium 4.2 mEq/L; chloride 101 mEq/L; bicarbonate 24 mEq/L; BUN 24 mg/dL; creatinine 1.5 mg/dL; glucose 162 mg/dL; lactate 1.2 mmol/L; INR 1.1." },
      { label: "lactate", value: "1.2", sourceUnit: "mmol/L", sourceSpan: "WBC 13,800/µL; hemoglobin 11.2 g/dL; platelets 188,000/µL; sodium 138 mEq/L; potassium 4.2 mEq/L; chloride 101 mEq/L; bicarbonate 24 mEq/L; BUN 24 mg/dL; creatinine 1.5 mg/dL; glucose 162 mg/dL; lactate 1.2 mmol/L; INR 1.1." },
      { label: "inr", value: "1.1", sourceUnit: "(ratio)", sourceSpan: "WBC 13,800/µL; hemoglobin 11.2 g/dL; platelets 188,000/µL; sodium 138 mEq/L; potassium 4.2 mEq/L; chloride 101 mEq/L; bicarbonate 24 mEq/L; BUN 24 mg/dL; creatinine 1.5 mg/dL; glucose 162 mg/dL; lactate 1.2 mmol/L; INR 1.1." }
    ],
    excludedValues: [],
    unitAliases: []
  }
];

const batch09Records: ExtractionRecord[] = [
  {
    exhibitRef: "opus4_case_postop_sbar_01/stage3_interventions",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.4", sourceUnit: "°C", sourceSpan: "Pre-transport status: T 38.4 °C, HR 116 irregular, BP 98/58, RR 26, SpO₂ 93% on 4 L nasal cannula after oxygen was applied for SpO₂ below 92%.", context: "post_intervention" },
      { label: "hr", value: "116", sourceUnit: "bpm", sourceSpan: "Pre-transport status: T 38.4 °C, HR 116 irregular, BP 98/58, RR 26, SpO₂ 93% on 4 L nasal cannula after oxygen was applied for SpO₂ below 92%.", context: "post_intervention" },
      { label: "sbp", value: "98", sourceUnit: "mmHg", sourceSpan: "Pre-transport status: T 38.4 °C, HR 116 irregular, BP 98/58, RR 26, SpO₂ 93% on 4 L nasal cannula after oxygen was applied for SpO₂ below 92%.", context: "post_intervention" },
      { label: "dbp", value: "58", sourceUnit: "mmHg", sourceSpan: "Pre-transport status: T 38.4 °C, HR 116 irregular, BP 98/58, RR 26, SpO₂ 93% on 4 L nasal cannula after oxygen was applied for SpO₂ below 92%.", context: "post_intervention" },
      { label: "rr", value: "26", sourceUnit: "/min", sourceSpan: "Pre-transport status: T 38.4 °C, HR 116 irregular, BP 98/58, RR 26, SpO₂ 93% on 4 L nasal cannula after oxygen was applied for SpO₂ below 92%.", context: "post_intervention" },
      { label: "spo2", value: "93", sourceUnit: "%", sourceSpan: "Pre-transport status: T 38.4 °C, HR 116 irregular, BP 98/58, RR 26, SpO₂ 93% on 4 L nasal cannula after oxygen was applied for SpO₂ below 92%.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus5_case_consent_interpreter_01/background",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus5_case_consent_interpreter_01/preop_labs",
    lane: "extract",
    panel: [
      { label: "wbc", value: "7,200", sourceUnit: "/µL", sourceSpan: "Labs drawn the previous day: WBC 7,200/µL; Hgb 13.1 g/dL; platelets 238,000/µL; INR 1.0; BUN 18 mg/dL; creatinine 0.9 mg/dL; potassium 4.2 mEq/L; fasting glucose 148 mg/dL; HbA1c 7.1%." },
      { label: "hemoglobin", value: "13.1", sourceUnit: "g/dL", sourceSpan: "Labs drawn the previous day: WBC 7,200/µL; Hgb 13.1 g/dL; platelets 238,000/µL; INR 1.0; BUN 18 mg/dL; creatinine 0.9 mg/dL; potassium 4.2 mEq/L; fasting glucose 148 mg/dL; HbA1c 7.1%." },
      { label: "platelets", value: "238,000", sourceUnit: "/µL", sourceSpan: "Labs drawn the previous day: WBC 7,200/µL; Hgb 13.1 g/dL; platelets 238,000/µL; INR 1.0; BUN 18 mg/dL; creatinine 0.9 mg/dL; potassium 4.2 mEq/L; fasting glucose 148 mg/dL; HbA1c 7.1%." },
      { label: "inr", value: "1.0", sourceUnit: "(ratio)", sourceSpan: "Labs drawn the previous day: WBC 7,200/µL; Hgb 13.1 g/dL; platelets 238,000/µL; INR 1.0; BUN 18 mg/dL; creatinine 0.9 mg/dL; potassium 4.2 mEq/L; fasting glucose 148 mg/dL; HbA1c 7.1%." },
      { label: "bun", value: "18", sourceUnit: "mg/dL", sourceSpan: "Labs drawn the previous day: WBC 7,200/µL; Hgb 13.1 g/dL; platelets 238,000/µL; INR 1.0; BUN 18 mg/dL; creatinine 0.9 mg/dL; potassium 4.2 mEq/L; fasting glucose 148 mg/dL; HbA1c 7.1%." },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "Labs drawn the previous day: WBC 7,200/µL; Hgb 13.1 g/dL; platelets 238,000/µL; INR 1.0; BUN 18 mg/dL; creatinine 0.9 mg/dL; potassium 4.2 mEq/L; fasting glucose 148 mg/dL; HbA1c 7.1%." },
      { label: "potassium", value: "4.2", sourceUnit: "mEq/L", sourceSpan: "Labs drawn the previous day: WBC 7,200/µL; Hgb 13.1 g/dL; platelets 238,000/µL; INR 1.0; BUN 18 mg/dL; creatinine 0.9 mg/dL; potassium 4.2 mEq/L; fasting glucose 148 mg/dL; HbA1c 7.1%." },
      { label: "glucose", value: "148", sourceUnit: "mg/dL", sourceSpan: "Labs drawn the previous day: WBC 7,200/µL; Hgb 13.1 g/dL; platelets 238,000/µL; INR 1.0; BUN 18 mg/dL; creatinine 0.9 mg/dL; potassium 4.2 mEq/L; fasting glucose 148 mg/dL; HbA1c 7.1%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus5_case_consent_interpreter_01/stage_2_note",
    lane: "extract",
    panel: [
      { label: "sbp", value: "148", sourceUnit: "mm Hg", sourceSpan: "BP 148/90 mm Hg, HR 86/min." },
      { label: "dbp", value: "90", sourceUnit: "mm Hg", sourceSpan: "BP 148/90 mm Hg, HR 86/min." },
      { label: "hr", value: "86", sourceUnit: "bpm", sourceSpan: "BP 148/90 mm Hg, HR 86/min." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus5_case_consent_interpreter_01/stage_3_note",
    lane: "extract",
    panel: [
      { label: "sbp", value: "136", sourceUnit: "mm Hg", sourceSpan: "BP 136/84 mm Hg, HR 78/min, SpO₂ 99% on room air." },
      { label: "dbp", value: "84", sourceUnit: "mm Hg", sourceSpan: "BP 136/84 mm Hg, HR 78/min, SpO₂ 99% on room air." },
      { label: "hr", value: "78", sourceUnit: "bpm", sourceSpan: "BP 136/84 mm Hg, HR 78/min, SpO₂ 99% on room air." },
      { label: "spo2", value: "99", sourceUnit: "%", sourceSpan: "BP 136/84 mm Hg, HR 78/min, SpO₂ 99% on room air." }
    ],
    excludedValues: [],
    unitAliases: []
  }
];

const batch18Records: ExtractionRecord[] = [
  {
    exhibitRef: "gemini_gap_case_pyloric_stenosis_01/ex2_labs",
    lane: "extract",
    panel: [
      { label: "sodium", value: "133", sourceUnit: "mEq/L", sourceSpan: "- Sodium: 133 mEq/L (Reference: 135-145 mEq/L)" },
      { label: "potassium", value: "3.1", sourceUnit: "mEq/L", sourceSpan: "- Potassium: 3.1 mEq/L (Reference: 3.5-5.0 mEq/L)" },
      { label: "chloride", value: "88", sourceUnit: "mEq/L", sourceSpan: "- Chloride: 88 mEq/L (Reference: 96-106 mEq/L)" },
      { label: "bicarbonate", value: "34", sourceUnit: "mEq/L", sourceSpan: "- Carbon Dioxide (HCO3): 34 mEq/L (Reference: 22-26 mEq/L)" },
      { label: "ph", value: "7.51", sourceUnit: "(unitless)", sourceSpan: "- pH: 7.51 (Reference: 7.35-7.45)" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_major_burn_inhalation_fluid_creep_01/stage1_course",
    lane: "extract",
    panel: [
      { label: "spo2", value: "94", sourceUnit: "%", sourceSpan: "Over the next 30 minutes hoarseness worsens, the patient drools, inspiratory stridor becomes audible without a stethoscope, SpO2 is 94% on the non-rebreather, and facial/lip edema progresses.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_r1_regen_case_celiac_01/initial_labs",
    lane: "extract",
    panel: [
      { label: "hemoglobin", value: "10.4", sourceUnit: "g/dL", sourceSpan: "Hgb 10.4 g/dL, MCV 74 fL, WBC 6,200/µL, platelets 310,000/µL." },
      { label: "wbc", value: "6,200", sourceUnit: "/µL", sourceSpan: "Hgb 10.4 g/dL, MCV 74 fL, WBC 6,200/µL, platelets 310,000/µL." },
      { label: "platelets", value: "310,000", sourceUnit: "/µL", sourceSpan: "Hgb 10.4 g/dL, MCV 74 fL, WBC 6,200/µL, platelets 310,000/µL." },
      { label: "calcium", value: "7.6", sourceUnit: "mg/dL", sourceSpan: "Calcium 7.6 mg/dL, albumin 3.3 g/dL, alkaline phosphatase 142 U/L, creatinine 0.7 mg/dL." },
      { label: "creatinine", value: "0.7", sourceUnit: "mg/dL", sourceSpan: "Calcium 7.6 mg/dL, albumin 3.3 g/dL, alkaline phosphatase 142 U/L, creatinine 0.7 mg/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_vanco_case_01/background_orders",
    lane: "extract",
    panel: [],
    excludedValues: [
      { label: "creatinine", value: "1.6", reason: "prior", sourceSpan: "History: stage 3b chronic kidney disease; baseline creatinine 1.6 mg/dL; estimated baseline creatinine clearance 44 mL/min; type 2 diabetes; hypertension; obesity; bilateral sensorineural hearing loss managed with hearing aids." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "opus2_case_postop_opioid_respiratory_depression_01/background_orders",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus20_case_cdiff_01/exhibit_stage3",
    lane: "extract",
    panel: [
      { label: "potassium", value: "3.8", sourceUnit: "mEq/L", sourceSpan: "Repeat labs: potassium 3.8 mEq/L, creatinine 1.6 mg/dL, BUN 28 mg/dL, eGFR 33 mL/min/1.73 m², lactate 1.2 mmol/L, WBC 12,400/µL.", context: "post_intervention" },
      { label: "creatinine", value: "1.6", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: potassium 3.8 mEq/L, creatinine 1.6 mg/dL, BUN 28 mg/dL, eGFR 33 mL/min/1.73 m², lactate 1.2 mmol/L, WBC 12,400/µL.", context: "post_intervention" },
      { label: "bun", value: "28", sourceUnit: "mg/dL", sourceSpan: "Repeat labs: potassium 3.8 mEq/L, creatinine 1.6 mg/dL, BUN 28 mg/dL, eGFR 33 mL/min/1.73 m², lactate 1.2 mmol/L, WBC 12,400/µL.", context: "post_intervention" },
      { label: "lactate", value: "1.2", sourceUnit: "mmol/L", sourceSpan: "Repeat labs: potassium 3.8 mEq/L, creatinine 1.6 mg/dL, BUN 28 mg/dL, eGFR 33 mL/min/1.73 m², lactate 1.2 mmol/L, WBC 12,400/µL.", context: "post_intervention" },
      { label: "wbc", value: "12,400", sourceUnit: "/µL", sourceSpan: "Repeat labs: potassium 3.8 mEq/L, creatinine 1.6 mg/dL, BUN 28 mg/dL, eGFR 33 mL/min/1.73 m², lactate 1.2 mmol/L, WBC 12,400/µL.", context: "post_intervention" },
      { label: "temp", value: "37.2", sourceUnit: "°C", sourceSpan: "Vitals: T 37.2 °C, HR 82, BP 118/72, RR 16, SpO₂ 98%.", context: "post_intervention" },
      { label: "hr", value: "82", sourceUnit: "bpm", sourceSpan: "Vitals: T 37.2 °C, HR 82, BP 118/72, RR 16, SpO₂ 98%.", context: "post_intervention" },
      { label: "sbp", value: "118", sourceUnit: "mmHg", sourceSpan: "Vitals: T 37.2 °C, HR 82, BP 118/72, RR 16, SpO₂ 98%.", context: "post_intervention" },
      { label: "dbp", value: "72", sourceUnit: "mmHg", sourceSpan: "Vitals: T 37.2 °C, HR 82, BP 118/72, RR 16, SpO₂ 98%.", context: "post_intervention" },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Vitals: T 37.2 °C, HR 82, BP 118/72, RR 16, SpO₂ 98%.", context: "post_intervention" },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "Vitals: T 37.2 °C, HR 82, BP 118/72, RR 16, SpO₂ 98%.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  }
];

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-02-prose_embedded-2026-07-05.json",
  `${JSON.stringify(batch02Records, null, 2)}\n`,
);

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-03-prose_embedded-2026-07-05.json",
  `${JSON.stringify(batch03Records, null, 2)}\n`,
);

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-04-prose_embedded-2026-07-05.json",
  `${JSON.stringify(batch04Records, null, 2)}\n`,
);

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-05-prose_embedded-2026-07-05.json",
  `${JSON.stringify(batch05Records, null, 2)}\n`,
);

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-06-prose_embedded-2026-07-05.json",
  `${JSON.stringify(batch06Records, null, 2)}\n`,
);

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-07-prose_embedded-2026-07-05.json",
  `${JSON.stringify(batch07Records, null, 2)}\n`,
);

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-08-prose_embedded-2026-07-05.json",
  `${JSON.stringify(batch08Records, null, 2)}\n`,
);

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-09-prose_embedded-2026-07-05.json",
  `${JSON.stringify(batch09Records, null, 2)}\n`,
);

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-18-prose_embedded-2026-07-06.json",
  `${JSON.stringify(batch18Records, null, 2)}\n`,
);

console.log(`Wrote ${batch02Records.length} Batch 02 records, ${batch03Records.length} Batch 03 records, ${batch04Records.length} Batch 04 records, ${batch05Records.length} Batch 05 records, ${batch06Records.length} Batch 06 records, ${batch07Records.length} Batch 07 records, ${batch08Records.length} Batch 08 records, ${batch09Records.length} Batch 09 records, and ${batch18Records.length} Batch 18 records.`);
