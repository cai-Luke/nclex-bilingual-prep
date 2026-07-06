import { writeFileSync } from "node:fs";

type ExtractionRecord = {
  exhibitRef: string;
  lane: "extract" | "skip_serial";
  panel?: {
    label: string;
    value: string;
    sourceUnit?: string;
    sourceSpan?: string;
    context?: string;
  }[];
  excludedValues?: {
    label: string;
    value: string;
    reason: "prior" | "trend" | "serial";
    sourceSpan?: string;
  }[];
  unitAliases?: { aliasOf: string; value: string }[];
};

const batch19Records: ExtractionRecord[] = [
  { exhibitRef: "cs_ngn_006_tbi/ex_006_vitals", lane: "skip_serial" },
  { exhibitRef: "gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage2_orders", lane: "skip_serial" },
  { exhibitRef: "gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage3_reassessment", lane: "skip_serial" },
  { exhibitRef: "gpt_case_caregiver_role_strain_dementia_01/stage_3_follow_up", lane: "skip_serial" },
  { exhibitRef: "gpt_case_lateral_incivility_01/stage_2_bp_spike", lane: "skip_serial" },
  { exhibitRef: "gpt_case_lateral_incivility_01/stage_3_intervention", lane: "skip_serial" },
  { exhibitRef: "gpt_case_major_burn_inhalation_fluid_creep_01/stage2_course", lane: "skip_serial" },
  { exhibitRef: "gpt_case_mass_casualty_start_triage_01/stage_1_update", lane: "skip_serial" },
  { exhibitRef: "gpt_case_mass_casualty_start_triage_01/stage_2_update", lane: "skip_serial" },
  { exhibitRef: "gpt_case_mass_casualty_start_triage_01/stage_3_update", lane: "skip_serial" },
  { exhibitRef: "gpt_case_neutropenic_fever_nadir_01/stage_3_course", lane: "skip_serial" },
  { exhibitRef: "gpt_case_nurse_provider_conflict_01/baseline_record", lane: "skip_serial" },
  { exhibitRef: "gpt_case_nurse_provider_conflict_01/stage_3_resolution", lane: "skip_serial" },
  { exhibitRef: "gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/stage2_update", lane: "skip_serial" },
  { exhibitRef: "gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/stage3_update", lane: "skip_serial" },
  { exhibitRef: "gpt_case_pressure_injury_prevention_mobility_01/stage_2_update", lane: "skip_serial" },
  { exhibitRef: "gpt_case_unsafe_assignment_01/stage_2_deterioration", lane: "skip_serial" },
  { exhibitRef: "gpt_case_unsafe_premature_discharge_01/stage_1_teaching_ambulation", lane: "skip_serial" },
  { exhibitRef: "gpt_case_warfarin_mvr_2026_06_11_01/stage_1_orders_response", lane: "skip_serial" },
  { exhibitRef: "gpt_case_warfarin_mvr_2026_06_11_01/stage_2_update", lane: "skip_serial" },
  { exhibitRef: "gpt_case_warfarin_mvr_2026_06_11_01/stage_3_orders_outcomes", lane: "skip_serial" },
  { exhibitRef: "gpt_opus21_case_colostomy_lep_discharge_01/initial_record", lane: "skip_serial" },
  { exhibitRef: "opus_case_lithium_toxicity_01/exhibit_stage1", lane: "skip_serial" },
  { exhibitRef: "opus_case_lithium_toxicity_01/exhibit_stage3", lane: "skip_serial" },
  { exhibitRef: "opus_case_warfarin_bridge_01/exh_1", lane: "skip_serial" },
  { exhibitRef: "opus1_case_tha_discharge_lep_01/baseline_record", lane: "skip_serial" },
  { exhibitRef: "opus4_case_postop_sbar_01/stage1_progression", lane: "skip_serial" },
  { exhibitRef: "opus4_case_postop_sbar_01/stage2_provider_response", lane: "skip_serial" }
];

const batch20Records: ExtractionRecord[] = [
  { exhibitRef: "cs_ngn_006_tbi/ex_006_vitals", lane: "skip_serial" },
  { exhibitRef: "gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage2_orders", lane: "skip_serial" },
  { exhibitRef: "gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage3_reassessment", lane: "skip_serial" },
  {
    exhibitRef: "gpt_case_caregiver_role_strain_dementia_01/stage_3_follow_up",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.9", sourceUnit: "°C", sourceSpan: "Vitals: T 36.9 °C, HR 74, BP 138/82, RR 16, SpO₂ 98%." },
      { label: "hr", value: "74", sourceUnit: "bpm", sourceSpan: "Vitals: T 36.9 °C, HR 74, BP 138/82, RR 16, SpO₂ 98%." },
      { label: "sbp", value: "138", sourceUnit: "mmHg", sourceSpan: "Vitals: T 36.9 °C, HR 74, BP 138/82, RR 16, SpO₂ 98%." },
      { label: "dbp", value: "82", sourceUnit: "mmHg", sourceSpan: "Vitals: T 36.9 °C, HR 74, BP 138/82, RR 16, SpO₂ 98%." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Vitals: T 36.9 °C, HR 74, BP 138/82, RR 16, SpO₂ 98%." },
      { label: "spo2", value: "98", sourceUnit: "%", sourceSpan: "Vitals: T 36.9 °C, HR 74, BP 138/82, RR 16, SpO₂ 98%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_lateral_incivility_01/stage_2_bp_spike",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.9", sourceUnit: "C", sourceSpan: "At 2200: T 36.9 C, HR 92, BP 186/102, RR 18, SpO2 96%." },
      { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: "At 2200: T 36.9 C, HR 92, BP 186/102, RR 18, SpO2 96%." },
      { label: "sbp", value: "186", sourceUnit: "mmHg", sourceSpan: "At 2200: T 36.9 C, HR 92, BP 186/102, RR 18, SpO2 96%." },
      { label: "dbp", value: "102", sourceUnit: "mmHg", sourceSpan: "At 2200: T 36.9 C, HR 92, BP 186/102, RR 18, SpO2 96%." },
      { label: "rr", value: "18", sourceUnit: "/min", sourceSpan: "At 2200: T 36.9 C, HR 92, BP 186/102, RR 18, SpO2 96%." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "At 2200: T 36.9 C, HR 92, BP 186/102, RR 18, SpO2 96%." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  { exhibitRef: "gpt_case_lateral_incivility_01/stage_3_intervention", lane: "skip_serial" },
  { exhibitRef: "gpt_case_major_burn_inhalation_fluid_creep_01/stage2_course", lane: "skip_serial" },
  {
    exhibitRef: "gpt_case_mass_casualty_start_triage_01/stage_1_update",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  { exhibitRef: "gpt_case_mass_casualty_start_triage_01/stage_2_update", lane: "skip_serial" },
  {
    exhibitRef: "gpt_case_mass_casualty_start_triage_01/stage_3_update",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  { exhibitRef: "gpt_case_neutropenic_fever_nadir_01/stage_3_course", lane: "skip_serial" },
  {
    exhibitRef: "gpt_case_nurse_provider_conflict_01/baseline_record",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.1", sourceUnit: "C", sourceSpan: "1900 assessment: Alert and oriented; mild incisional soreness and fatigue; denies palpitations, muscle cramps, or weakness. T 37.1 C, HR 82 regular, BP 134/78, RR 16, SpO2 97% on room air." },
      { label: "hr", value: "82", sourceUnit: "bpm", sourceSpan: "1900 assessment: Alert and oriented; mild incisional soreness and fatigue; denies palpitations, muscle cramps, or weakness. T 37.1 C, HR 82 regular, BP 134/78, RR 16, SpO2 97% on room air." },
      { label: "sbp", value: "134", sourceUnit: "mmHg", sourceSpan: "1900 assessment: Alert and oriented; mild incisional soreness and fatigue; denies palpitations, muscle cramps, or weakness. T 37.1 C, HR 82 regular, BP 134/78, RR 16, SpO2 97% on room air." },
      { label: "dbp", value: "78", sourceUnit: "mmHg", sourceSpan: "1900 assessment: Alert and oriented; mild incisional soreness and fatigue; denies palpitations, muscle cramps, or weakness. T 37.1 C, HR 82 regular, BP 134/78, RR 16, SpO2 97% on room air." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "1900 assessment: Alert and oriented; mild incisional soreness and fatigue; denies palpitations, muscle cramps, or weakness. T 37.1 C, HR 82 regular, BP 134/78, RR 16, SpO2 97% on room air." },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "1900 assessment: Alert and oriented; mild incisional soreness and fatigue; denies palpitations, muscle cramps, or weakness. T 37.1 C, HR 82 regular, BP 134/78, RR 16, SpO2 97% on room air." },
      { label: "sodium", value: "138", sourceUnit: "mEq/L", sourceSpan: "1600 labs: Na 138 mEq/L, K 3.1 mEq/L, Cl 101 mEq/L, HCO3 24 mEq/L, BUN 28 mg/dL, creatinine 1.6 mg/dL (baseline 1.3), eGFR 34 mL/min (baseline 42-44), Mg 1.9 mg/dL, phosphorus 3.4 mg/dL, glucose 142 mg/dL." },
      { label: "potassium", value: "3.1", sourceUnit: "mEq/L", sourceSpan: "1600 labs: Na 138 mEq/L, K 3.1 mEq/L, Cl 101 mEq/L, HCO3 24 mEq/L, BUN 28 mg/dL, creatinine 1.6 mg/dL (baseline 1.3), eGFR 34 mL/min (baseline 42-44), Mg 1.9 mg/dL, phosphorus 3.4 mg/dL, glucose 142 mg/dL." },
      { label: "chloride", value: "101", sourceUnit: "mEq/L", sourceSpan: "1600 labs: Na 138 mEq/L, K 3.1 mEq/L, Cl 101 mEq/L, HCO3 24 mEq/L, BUN 28 mg/dL, creatinine 1.6 mg/dL (baseline 1.3), eGFR 34 mL/min (baseline 42-44), Mg 1.9 mg/dL, phosphorus 3.4 mg/dL, glucose 142 mg/dL." },
      { label: "bicarbonate", value: "24", sourceUnit: "mEq/L", sourceSpan: "1600 labs: Na 138 mEq/L, K 3.1 mEq/L, Cl 101 mEq/L, HCO3 24 mEq/L, BUN 28 mg/dL, creatinine 1.6 mg/dL (baseline 1.3), eGFR 34 mL/min (baseline 42-44), Mg 1.9 mg/dL, phosphorus 3.4 mg/dL, glucose 142 mg/dL." },
      { label: "bun", value: "28", sourceUnit: "mg/dL", sourceSpan: "1600 labs: Na 138 mEq/L, K 3.1 mEq/L, Cl 101 mEq/L, HCO3 24 mEq/L, BUN 28 mg/dL, creatinine 1.6 mg/dL (baseline 1.3), eGFR 34 mL/min (baseline 42-44), Mg 1.9 mg/dL, phosphorus 3.4 mg/dL, glucose 142 mg/dL." },
      { label: "creatinine", value: "1.6", sourceUnit: "mg/dL", sourceSpan: "1600 labs: Na 138 mEq/L, K 3.1 mEq/L, Cl 101 mEq/L, HCO3 24 mEq/L, BUN 28 mg/dL, creatinine 1.6 mg/dL (baseline 1.3), eGFR 34 mL/min (baseline 42-44), Mg 1.9 mg/dL, phosphorus 3.4 mg/dL, glucose 142 mg/dL." },
      { label: "magnesium", value: "1.9", sourceUnit: "mg/dL", sourceSpan: "1600 labs: Na 138 mEq/L, K 3.1 mEq/L, Cl 101 mEq/L, HCO3 24 mEq/L, BUN 28 mg/dL, creatinine 1.6 mg/dL (baseline 1.3), eGFR 34 mL/min (baseline 42-44), Mg 1.9 mg/dL, phosphorus 3.4 mg/dL, glucose 142 mg/dL." },
      { label: "phosphate", value: "3.4", sourceUnit: "mg/dL", sourceSpan: "1600 labs: Na 138 mEq/L, K 3.1 mEq/L, Cl 101 mEq/L, HCO3 24 mEq/L, BUN 28 mg/dL, creatinine 1.6 mg/dL (baseline 1.3), eGFR 34 mL/min (baseline 42-44), Mg 1.9 mg/dL, phosphorus 3.4 mg/dL, glucose 142 mg/dL." },
      { label: "glucose", value: "142", sourceUnit: "mg/dL", sourceSpan: "1600 labs: Na 138 mEq/L, K 3.1 mEq/L, Cl 101 mEq/L, HCO3 24 mEq/L, BUN 28 mg/dL, creatinine 1.6 mg/dL (baseline 1.3), eGFR 34 mL/min (baseline 42-44), Mg 1.9 mg/dL, phosphorus 3.4 mg/dL, glucose 142 mg/dL." },
      { label: "wbc", value: "9,200", sourceUnit: "/uL", sourceSpan: "CBC: WBC 9,200/uL, Hgb 10.8 g/dL, platelets 188,000/uL." },
      { label: "hemoglobin", value: "10.8", sourceUnit: "g/dL", sourceSpan: "CBC: WBC 9,200/uL, Hgb 10.8 g/dL, platelets 188,000/uL." },
      { label: "platelets", value: "188,000", sourceUnit: "/uL", sourceSpan: "CBC: WBC 9,200/uL, Hgb 10.8 g/dL, platelets 188,000/uL." }
    ],
    excludedValues: [
      { label: "creatinine", value: "1.3", reason: "prior", sourceSpan: "1600 labs: Na 138 mEq/L, K 3.1 mEq/L, Cl 101 mEq/L, HCO3 24 mEq/L, BUN 28 mg/dL, creatinine 1.6 mg/dL (baseline 1.3), eGFR 34 mL/min (baseline 42-44), Mg 1.9 mg/dL, phosphorus 3.4 mg/dL, glucose 142 mg/dL." },
      { label: "potassium", value: "3.8", reason: "prior", sourceSpan: "POD1 potassium was 3.8 mEq/L and creatinine was 1.4 mg/dL." },
      { label: "creatinine", value: "1.4", reason: "prior", sourceSpan: "POD1 potassium was 3.8 mEq/L and creatinine was 1.4 mg/dL." }
    ],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_nurse_provider_conflict_01/stage_3_resolution",
    lane: "extract",
    panel: [
      { label: "potassium", value: "3.4", sourceUnit: "mEq/L", sourceSpan: "At 2245, after the second dose, a stat potassium drawn from the opposite arm returns at 3.4 mEq/L.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/stage2_update",
    lane: "extract",
    panel: [
      { label: "troponin_t", value: "0.38", sourceUnit: "ng/mL", sourceSpan: "Stat results: troponin I 0.38 ng/mL, BNP 620 pg/mL, D-dimer >5,000 ng/mL FEU, hemoglobin 11.4 g/dL, platelets 192,000/mcL, aPTT 29 seconds, INR 1.0, creatinine 1.0 mg/dL, potassium 4.3 mEq/L, lactate 3.2 mmol/L." },
      { label: "bnp", value: "620", sourceUnit: "pg/mL", sourceSpan: "Stat results: troponin I 0.38 ng/mL, BNP 620 pg/mL, D-dimer >5,000 ng/mL FEU, hemoglobin 11.4 g/dL, platelets 192,000/mcL, aPTT 29 seconds, INR 1.0, creatinine 1.0 mg/dL, potassium 4.3 mEq/L, lactate 3.2 mmol/L." },
      { label: "hemoglobin", value: "11.4", sourceUnit: "g/dL", sourceSpan: "Stat results: troponin I 0.38 ng/mL, BNP 620 pg/mL, D-dimer >5,000 ng/mL FEU, hemoglobin 11.4 g/dL, platelets 192,000/mcL, aPTT 29 seconds, INR 1.0, creatinine 1.0 mg/dL, potassium 4.3 mEq/L, lactate 3.2 mmol/L." },
      { label: "platelets", value: "192,000", sourceUnit: "/mcL", sourceSpan: "Stat results: troponin I 0.38 ng/mL, BNP 620 pg/mL, D-dimer >5,000 ng/mL FEU, hemoglobin 11.4 g/dL, platelets 192,000/mcL, aPTT 29 seconds, INR 1.0, creatinine 1.0 mg/dL, potassium 4.3 mEq/L, lactate 3.2 mmol/L." },
      { label: "ptt", value: "29", sourceUnit: "seconds", sourceSpan: "Stat results: troponin I 0.38 ng/mL, BNP 620 pg/mL, D-dimer >5,000 ng/mL FEU, hemoglobin 11.4 g/dL, platelets 192,000/mcL, aPTT 29 seconds, INR 1.0, creatinine 1.0 mg/dL, potassium 4.3 mEq/L, lactate 3.2 mmol/L." },
      { label: "inr", value: "1.0", sourceUnit: "(ratio)", sourceSpan: "Stat results: troponin I 0.38 ng/mL, BNP 620 pg/mL, D-dimer >5,000 ng/mL FEU, hemoglobin 11.4 g/dL, platelets 192,000/mcL, aPTT 29 seconds, INR 1.0, creatinine 1.0 mg/dL, potassium 4.3 mEq/L, lactate 3.2 mmol/L." },
      { label: "creatinine", value: "1.0", sourceUnit: "mg/dL", sourceSpan: "Stat results: troponin I 0.38 ng/mL, BNP 620 pg/mL, D-dimer >5,000 ng/mL FEU, hemoglobin 11.4 g/dL, platelets 192,000/mcL, aPTT 29 seconds, INR 1.0, creatinine 1.0 mg/dL, potassium 4.3 mEq/L, lactate 3.2 mmol/L." },
      { label: "potassium", value: "4.3", sourceUnit: "mEq/L", sourceSpan: "Stat results: troponin I 0.38 ng/mL, BNP 620 pg/mL, D-dimer >5,000 ng/mL FEU, hemoglobin 11.4 g/dL, platelets 192,000/mcL, aPTT 29 seconds, INR 1.0, creatinine 1.0 mg/dL, potassium 4.3 mEq/L, lactate 3.2 mmol/L." },
      { label: "lactate", value: "3.2", sourceUnit: "mmol/L", sourceSpan: "Stat results: troponin I 0.38 ng/mL, BNP 620 pg/mL, D-dimer >5,000 ng/mL FEU, hemoglobin 11.4 g/dL, platelets 192,000/mcL, aPTT 29 seconds, INR 1.0, creatinine 1.0 mg/dL, potassium 4.3 mEq/L, lactate 3.2 mmol/L." },
      { label: "ph", value: "7.47", sourceUnit: "(unitless)", sourceSpan: "ABG on non-rebreather: pH 7.47, PaCO2 28 mmHg, PaO2 68 mmHg, HCO3 20 mEq/L, SaO2 93%." },
      { label: "paco2", value: "28", sourceUnit: "mmHg", sourceSpan: "ABG on non-rebreather: pH 7.47, PaCO2 28 mmHg, PaO2 68 mmHg, HCO3 20 mEq/L, SaO2 93%." },
      { label: "pao2", value: "68", sourceUnit: "mmHg", sourceSpan: "ABG on non-rebreather: pH 7.47, PaCO2 28 mmHg, PaO2 68 mmHg, HCO3 20 mEq/L, SaO2 93%." },
      { label: "hco3_abg", value: "20", sourceUnit: "mEq/L", sourceSpan: "ABG on non-rebreather: pH 7.47, PaCO2 28 mmHg, PaO2 68 mmHg, HCO3 20 mEq/L, SaO2 93%." },
      { label: "hr", value: "118", sourceUnit: "bpm", sourceSpan: "Repeat vital signs at 0930: HR 118/min, BP 98/66 mmHg, RR 28/min, SpO2 93% on non-rebreather.", context: "post_intervention" },
      { label: "sbp", value: "98", sourceUnit: "mmHg", sourceSpan: "Repeat vital signs at 0930: HR 118/min, BP 98/66 mmHg, RR 28/min, SpO2 93% on non-rebreather.", context: "post_intervention" },
      { label: "dbp", value: "66", sourceUnit: "mmHg", sourceSpan: "Repeat vital signs at 0930: HR 118/min, BP 98/66 mmHg, RR 28/min, SpO2 93% on non-rebreather.", context: "post_intervention" },
      { label: "rr", value: "28", sourceUnit: "/min", sourceSpan: "Repeat vital signs at 0930: HR 118/min, BP 98/66 mmHg, RR 28/min, SpO2 93% on non-rebreather.", context: "post_intervention" },
      { label: "spo2", value: "93", sourceUnit: "%", sourceSpan: "Repeat vital signs at 0930: HR 118/min, BP 98/66 mmHg, RR 28/min, SpO2 93% on non-rebreather.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  { exhibitRef: "gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/stage3_update", lane: "skip_serial" },
  { exhibitRef: "gpt_case_pressure_injury_prevention_mobility_01/stage_2_update", lane: "skip_serial" },
  {
    exhibitRef: "gpt_case_unsafe_assignment_01/stage_2_deterioration",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  { exhibitRef: "gpt_case_unsafe_premature_discharge_01/stage_1_teaching_ambulation", lane: "skip_serial" },
  {
    exhibitRef: "gpt_case_warfarin_mvr_2026_06_11_01/stage_1_orders_response",
    lane: "extract",
    panel: [],
    excludedValues: [],
    unitAliases: []
  },
  { exhibitRef: "gpt_case_warfarin_mvr_2026_06_11_01/stage_2_update", lane: "skip_serial" },
  {
    exhibitRef: "gpt_case_warfarin_mvr_2026_06_11_01/stage_3_orders_outcomes",
    lane: "extract",
    panel: [
      { label: "hr", value: "88", sourceUnit: "bpm", sourceSpan: "1100-1200 status: HR 88, BP 114/70, urine light pink and clearing, INR 3.8, hemoglobin 9.8 g/dL after 1 unit PRBC with second unit infusing, abdominal tenderness mild and stable.", context: "post_intervention" },
      { label: "sbp", value: "114", sourceUnit: "mmHg", sourceSpan: "1100-1200 status: HR 88, BP 114/70, urine light pink and clearing, INR 3.8, hemoglobin 9.8 g/dL after 1 unit PRBC with second unit infusing, abdominal tenderness mild and stable.", context: "post_intervention" },
      { label: "dbp", value: "70", sourceUnit: "mmHg", sourceSpan: "1100-1200 status: HR 88, BP 114/70, urine light pink and clearing, INR 3.8, hemoglobin 9.8 g/dL after 1 unit PRBC with second unit infusing, abdominal tenderness mild and stable.", context: "post_intervention" },
      { label: "inr", value: "3.8", sourceUnit: "(ratio)", sourceSpan: "1100-1200 status: HR 88, BP 114/70, urine light pink and clearing, INR 3.8, hemoglobin 9.8 g/dL after 1 unit PRBC with second unit infusing, abdominal tenderness mild and stable.", context: "post_intervention" },
      { label: "hemoglobin", value: "9.8", sourceUnit: "g/dL", sourceSpan: "1100-1200 status: HR 88, BP 114/70, urine light pink and clearing, INR 3.8, hemoglobin 9.8 g/dL after 1 unit PRBC with second unit infusing, abdominal tenderness mild and stable.", context: "post_intervention" }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "gpt_opus21_case_colostomy_lep_discharge_01/initial_record",
    lane: "extract",
    panel: [
      { label: "temp", value: "37.2", sourceUnit: "C", sourceSpan: "Assessment: T 37.2 C, HR 78, BP 134/82, RR 16, SpO2 97% room air." },
      { label: "hr", value: "78", sourceUnit: "bpm", sourceSpan: "Assessment: T 37.2 C, HR 78, BP 134/82, RR 16, SpO2 97% room air." },
      { label: "sbp", value: "134", sourceUnit: "mmHg", sourceSpan: "Assessment: T 37.2 C, HR 78, BP 134/82, RR 16, SpO2 97% room air." },
      { label: "dbp", value: "82", sourceUnit: "mmHg", sourceSpan: "Assessment: T 37.2 C, HR 78, BP 134/82, RR 16, SpO2 97% room air." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Assessment: T 37.2 C, HR 78, BP 134/82, RR 16, SpO2 97% room air." },
      { label: "spo2", value: "97", sourceUnit: "%", sourceSpan: "Assessment: T 37.2 C, HR 78, BP 134/82, RR 16, SpO2 97% room air." },
      { label: "wbc", value: "9,800", sourceUnit: "/uL", sourceSpan: "Labs: WBC 9,800/uL; Hgb 11.4 g/dL; platelets 268,000/uL; BUN 14 mg/dL; creatinine 0.9 mg/dL; K 4.0 mEq/L; Na 139 mEq/L; glucose 148 mg/dL; albumin 3.1 g/dL." },
      { label: "hemoglobin", value: "11.4", sourceUnit: "g/dL", sourceSpan: "Labs: WBC 9,800/uL; Hgb 11.4 g/dL; platelets 268,000/uL; BUN 14 mg/dL; creatinine 0.9 mg/dL; K 4.0 mEq/L; Na 139 mEq/L; glucose 148 mg/dL; albumin 3.1 g/dL." },
      { label: "platelets", value: "268,000", sourceUnit: "/uL", sourceSpan: "Labs: WBC 9,800/uL; Hgb 11.4 g/dL; platelets 268,000/uL; BUN 14 mg/dL; creatinine 0.9 mg/dL; K 4.0 mEq/L; Na 139 mEq/L; glucose 148 mg/dL; albumin 3.1 g/dL." },
      { label: "bun", value: "14", sourceUnit: "mg/dL", sourceSpan: "Labs: WBC 9,800/uL; Hgb 11.4 g/dL; platelets 268,000/uL; BUN 14 mg/dL; creatinine 0.9 mg/dL; K 4.0 mEq/L; Na 139 mEq/L; glucose 148 mg/dL; albumin 3.1 g/dL." },
      { label: "creatinine", value: "0.9", sourceUnit: "mg/dL", sourceSpan: "Labs: WBC 9,800/uL; Hgb 11.4 g/dL; platelets 268,000/uL; BUN 14 mg/dL; creatinine 0.9 mg/dL; K 4.0 mEq/L; Na 139 mEq/L; glucose 148 mg/dL; albumin 3.1 g/dL." },
      { label: "potassium", value: "4.0", sourceUnit: "mEq/L", sourceSpan: "Labs: WBC 9,800/uL; Hgb 11.4 g/dL; platelets 268,000/uL; BUN 14 mg/dL; creatinine 0.9 mg/dL; K 4.0 mEq/L; Na 139 mEq/L; glucose 148 mg/dL; albumin 3.1 g/dL." },
      { label: "sodium", value: "139", sourceUnit: "mEq/L", sourceSpan: "Labs: WBC 9,800/uL; Hgb 11.4 g/dL; platelets 268,000/uL; BUN 14 mg/dL; creatinine 0.9 mg/dL; K 4.0 mEq/L; Na 139 mEq/L; glucose 148 mg/dL; albumin 3.1 g/dL." },
      { label: "glucose", value: "148", sourceUnit: "mg/dL", sourceSpan: "Labs: WBC 9,800/uL; Hgb 11.4 g/dL; platelets 268,000/uL; BUN 14 mg/dL; creatinine 0.9 mg/dL; K 4.0 mEq/L; Na 139 mEq/L; glucose 148 mg/dL; albumin 3.1 g/dL." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  {
    exhibitRef: "opus_case_lithium_toxicity_01/exhibit_stage1",
    lane: "extract",
    panel: [
      { label: "hr", value: "112", sourceUnit: "bpm", sourceSpan: "Heart rate rises to 112, blood pressure 94/58." },
      { label: "sbp", value: "94", sourceUnit: "mmHg", sourceSpan: "Heart rate rises to 112, blood pressure 94/58." },
      { label: "dbp", value: "58", sourceUnit: "mmHg", sourceSpan: "Heart rate rises to 112, blood pressure 94/58." }
    ],
    excludedValues: [],
    unitAliases: []
  },
  { exhibitRef: "opus_case_lithium_toxicity_01/exhibit_stage3", lane: "skip_serial" },
  { exhibitRef: "opus_case_warfarin_bridge_01/exh_1", lane: "skip_serial" },
  {
    exhibitRef: "opus1_case_tha_discharge_lep_01/baseline_record",
    lane: "extract",
    panel: [
      { label: "temp", value: "36.8", sourceUnit: "°C", sourceSpan: "Initial findings at 1600: T 36.8 °C, HR 82, BP 138/78, RR 16, SpO₂ 96% on 2 L nasal cannula." },
      { label: "hr", value: "82", sourceUnit: "bpm", sourceSpan: "Initial findings at 1600: T 36.8 °C, HR 82, BP 138/78, RR 16, SpO₂ 96% on 2 L nasal cannula." },
      { label: "sbp", value: "138", sourceUnit: "mmHg", sourceSpan: "Initial findings at 1600: T 36.8 °C, HR 82, BP 138/78, RR 16, SpO₂ 96% on 2 L nasal cannula." },
      { label: "dbp", value: "78", sourceUnit: "mmHg", sourceSpan: "Initial findings at 1600: T 36.8 °C, HR 82, BP 138/78, RR 16, SpO₂ 96% on 2 L nasal cannula." },
      { label: "rr", value: "16", sourceUnit: "/min", sourceSpan: "Initial findings at 1600: T 36.8 °C, HR 82, BP 138/78, RR 16, SpO₂ 96% on 2 L nasal cannula." },
      { label: "spo2", value: "96", sourceUnit: "%", sourceSpan: "Initial findings at 1600: T 36.8 °C, HR 82, BP 138/78, RR 16, SpO₂ 96% on 2 L nasal cannula." },
      { label: "hemoglobin", value: "10.8", sourceUnit: "g/dL", sourceSpan: "Baseline labs: Hgb 10.8 g/dL (pre-op 12.1), Hct 32%, platelets 198,000/µL, WBC 9,200/µL, INR 1.0, aPTT 28 sec, BUN 24 mg/dL, creatinine 1.4 mg/dL, eGFR 38 mL/min, K⁺ 4.0 mEq/L, Na⁺ 139 mEq/L, glucose 162 mg/dL, albumin 3.1 g/dL." },
      { label: "hematocrit", value: "32", sourceUnit: "%", sourceSpan: "Baseline labs: Hgb 10.8 g/dL (pre-op 12.1), Hct 32%, platelets 198,000/µL, WBC 9,200/µL, INR 1.0, aPTT 28 sec, BUN 24 mg/dL, creatinine 1.4 mg/dL, eGFR 38 mL/min, K⁺ 4.0 mEq/L, Na⁺ 139 mEq/L, glucose 162 mg/dL, albumin 3.1 g/dL." },
      { label: "platelets", value: "198,000", sourceUnit: "/µL", sourceSpan: "Baseline labs: Hgb 10.8 g/dL (pre-op 12.1), Hct 32%, platelets 198,000/µL, WBC 9,200/µL, INR 1.0, aPTT 28 sec, BUN 24 mg/dL, creatinine 1.4 mg/dL, eGFR 38 mL/min, K⁺ 4.0 mEq/L, Na⁺ 139 mEq/L, glucose 162 mg/dL, albumin 3.1 g/dL." },
      { label: "wbc", value: "9,200", sourceUnit: "/µL", sourceSpan: "Baseline labs: Hgb 10.8 g/dL (pre-op 12.1), Hct 32%, platelets 198,000/µL, WBC 9,200/µL, INR 1.0, aPTT 28 sec, BUN 24 mg/dL, creatinine 1.4 mg/dL, eGFR 38 mL/min, K⁺ 4.0 mEq/L, Na⁺ 139 mEq/L, glucose 162 mg/dL, albumin 3.1 g/dL." },
      { label: "inr", value: "1.0", sourceUnit: "(ratio)", sourceSpan: "Baseline labs: Hgb 10.8 g/dL (pre-op 12.1), Hct 32%, platelets 198,000/µL, WBC 9,200/µL, INR 1.0, aPTT 28 sec, BUN 24 mg/dL, creatinine 1.4 mg/dL, eGFR 38 mL/min, K⁺ 4.0 mEq/L, Na⁺ 139 mEq/L, glucose 162 mg/dL, albumin 3.1 g/dL." },
      { label: "ptt", value: "28", sourceUnit: "sec", sourceSpan: "Baseline labs: Hgb 10.8 g/dL (pre-op 12.1), Hct 32%, platelets 198,000/µL, WBC 9,200/µL, INR 1.0, aPTT 28 sec, BUN 24 mg/dL, creatinine 1.4 mg/dL, eGFR 38 mL/min, K⁺ 4.0 mEq/L, Na⁺ 139 mEq/L, glucose 162 mg/dL, albumin 3.1 g/dL." },
      { label: "bun", value: "24", sourceUnit: "mg/dL", sourceSpan: "Baseline labs: Hgb 10.8 g/dL (pre-op 12.1), Hct 32%, platelets 198,000/µL, WBC 9,200/µL, INR 1.0, aPTT 28 sec, BUN 24 mg/dL, creatinine 1.4 mg/dL, eGFR 38 mL/min, K⁺ 4.0 mEq/L, Na⁺ 139 mEq/L, glucose 162 mg/dL, albumin 3.1 g/dL." },
      { label: "creatinine", value: "1.4", sourceUnit: "mg/dL", sourceSpan: "Baseline labs: Hgb 10.8 g/dL (pre-op 12.1), Hct 32%, platelets 198,000/µL, WBC 9,200/µL, INR 1.0, aPTT 28 sec, BUN 24 mg/dL, creatinine 1.4 mg/dL, eGFR 38 mL/min, K⁺ 4.0 mEq/L, Na⁺ 139 mEq/L, glucose 162 mg/dL, albumin 3.1 g/dL." },
      { label: "potassium", value: "4.0", sourceUnit: "mEq/L", sourceSpan: "Baseline labs: Hgb 10.8 g/dL (pre-op 12.1), Hct 32%, platelets 198,000/µL, WBC 9,200/µL, INR 1.0, aPTT 28 sec, BUN 24 mg/dL, creatinine 1.4 mg/dL, eGFR 38 mL/min, K⁺ 4.0 mEq/L, Na⁺ 139 mEq/L, glucose 162 mg/dL, albumin 3.1 g/dL." },
      { label: "sodium", value: "139", sourceUnit: "mEq/L", sourceSpan: "Baseline labs: Hgb 10.8 g/dL (pre-op 12.1), Hct 32%, platelets 198,000/µL, WBC 9,200/µL, INR 1.0, aPTT 28 sec, BUN 24 mg/dL, creatinine 1.4 mg/dL, eGFR 38 mL/min, K⁺ 4.0 mEq/L, Na⁺ 139 mEq/L, glucose 162 mg/dL, albumin 3.1 g/dL." },
      { label: "glucose", value: "162", sourceUnit: "mg/dL", sourceSpan: "Baseline labs: Hgb 10.8 g/dL (pre-op 12.1), Hct 32%, platelets 198,000/µL, WBC 9,200/µL, INR 1.0, aPTT 28 sec, BUN 24 mg/dL, creatinine 1.4 mg/dL, eGFR 38 mL/min, K⁺ 4.0 mEq/L, Na⁺ 139 mEq/L, glucose 162 mg/dL, albumin 3.1 g/dL." }
    ],
    excludedValues: [
      { label: "creatinine", value: "1.3", reason: "prior", sourceSpan: "History: hypertension, mild chronic kidney disease (baseline creatinine 1.3 mg/dL, eGFR 42 mL/min), and type 2 diabetes." },
      { label: "hemoglobin", value: "12.1", reason: "prior", sourceSpan: "Baseline labs: Hgb 10.8 g/dL (pre-op 12.1), Hct 32%, platelets 198,000/µL, WBC 9,200/µL, INR 1.0, aPTT 28 sec, BUN 24 mg/dL, creatinine 1.4 mg/dL, eGFR 38 mL/min, K⁺ 4.0 mEq/L, Na⁺ 139 mEq/L, glucose 162 mg/dL, albumin 3.1 g/dL." }
    ],
    unitAliases: []
  },
  { exhibitRef: "opus4_case_postop_sbar_01/stage1_progression", lane: "skip_serial" },
  {
    exhibitRef: "opus4_case_postop_sbar_01/stage2_provider_response",
    lane: "extract",
    panel: [
      { label: "temp", value: "38.5", sourceUnit: "°C", sourceSpan: "1200 reassessment: T 38.5 °C, HR 110 irregular, BP 104/62, RR 24, SpO₂ 92% on room air." },
      { label: "hr", value: "110", sourceUnit: "bpm", sourceSpan: "1200 reassessment: T 38.5 °C, HR 110 irregular, BP 104/62, RR 24, SpO₂ 92% on room air." },
      { label: "sbp", value: "104", sourceUnit: "mmHg", sourceSpan: "1200 reassessment: T 38.5 °C, HR 110 irregular, BP 104/62, RR 24, SpO₂ 92% on room air." },
      { label: "dbp", value: "62", sourceUnit: "mmHg", sourceSpan: "1200 reassessment: T 38.5 °C, HR 110 irregular, BP 104/62, RR 24, SpO₂ 92% on room air." },
      { label: "rr", value: "24", sourceUnit: "/min", sourceSpan: "1200 reassessment: T 38.5 °C, HR 110 irregular, BP 104/62, RR 24, SpO₂ 92% on room air." },
      { label: "spo2", value: "92", sourceUnit: "%", sourceSpan: "1200 reassessment: T 38.5 °C, HR 110 irregular, BP 104/62, RR 24, SpO₂ 92% on room air." },
      { label: "lactate", value: "3.8", sourceUnit: "mmol/L", sourceSpan: "Per standing postoperative deterioration protocol, CBC and lactate are obtained: lactate 3.8 mmol/L, hemoglobin 9.1 g/dL, WBC 16,400/µL." },
      { label: "hemoglobin", value: "9.1", sourceUnit: "g/dL", sourceSpan: "Per standing postoperative deterioration protocol, CBC and lactate are obtained: lactate 3.8 mmol/L, hemoglobin 9.1 g/dL, WBC 16,400/µL." },
      { label: "wbc", value: "16,400", sourceUnit: "/µL", sourceSpan: "Per standing postoperative deterioration protocol, CBC and lactate are obtained: lactate 3.8 mmol/L, hemoglobin 9.1 g/dL, WBC 16,400/µL." }
    ],
    excludedValues: [],
    unitAliases: []
  }
];

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-19-serial-2026-07-06.json",
  `${JSON.stringify(batch19Records, null, 2)}\n`,
);

writeFileSync(
  "EXHIBIT-FLOWSHEET-MIGRATION-BATCH-20-serial-redo-2026-07-06.json",
  `${JSON.stringify(batch20Records, null, 2)}\n`,
);

console.log(`Wrote ${batch19Records.length} Batch 19 serial records.`);
console.log(`Wrote ${batch20Records.length} Batch 20 serial-redo records.`);
