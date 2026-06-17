# 835-Residual Topic Classification Proposal Report

Generated: 2026-06-17T03:09:21.179Z
Input: audit/unresolved_gpt_claude.json
Classifier: codex-gpt-5-bulk-approved
Canonical bank writes in this proposal report: none; approved execution is recorded separately in `audit/topic-residual-proposals-2026-06-17.execution-report.md`.

## Bulk Approval Note

Luke approved using the Codex recommendation set in bulk rather than performing row-by-row human adjudication for this proposal pass. The manifest remains proposal/documentation output: proposed rows are recommendations, blocked-cross-category rows are category-drift signals, and unresolved/category-untrusted/context-incomplete rows remain unapplied by this tool.

## Status Counts

- proposed: 493
- category-untrusted: 136
- context-incomplete: 90
- unresolved: 75
- blocked-cross-category: 41

## Overmatch Check

Unresolved before human curation: 75

## Hydration Summary by Item Type

| Item type | Found | Missing |
|---|---:|---:|
| bowtie | 11 | 0 |
| dropdown_cloze | 87 | 0 |
| fill_in_blank | 69 | 0 |
| highlight | 9 | 0 |
| matrix | 132 | 0 |
| multiple_choice | 247 | 0 |
| ordered_response | 76 | 0 |
| select_all | 114 | 0 |
| unknown | 0 | 90 |

## Proposed-Topic Distribution

| Proposed topic | Count | Flags |
|---|---:|---|
| Cardiovascular Disorders | 40 |  |
| Electrolyte Imbalances | 39 |  |
| Discharge Planning & Handoff | 36 | Management of Care >=35% |
| Dosage Calculations | 30 | Pharmacological and Parenteral Therapies >=35% |
| Suicide & Crisis Intervention | 28 | Psychosocial Integrity >=35% |
| Laboratory & Diagnostic Tests | 25 | Reduction of Risk Potential >=35% |
| Adult Health & Wellness | 22 | Health Promotion and Maintenance >=35% |
| Medication Safety & Admin | 22 |  |
| Chronic Disease Management & Lifestyle | 19 | Health Promotion and Maintenance >=35% |
| Anticoagulant Therapy | 17 |  |
| Renal & Gastrointestinal Disorders | 17 |  |
| Perioperative Care | 16 | Reduction of Risk Potential >=35% |
| Endocrine & Neurological Disorders | 15 |  |
| Mobility & Immobility | 15 |  |
| Caregiver Role Strain & Family Coping | 14 |  |
| Legal & Ethical Principles | 14 |  |
| Transmission-Based Precautions | 14 | Safety and Infection Control >=35% |
| Burn Management | 12 |  |
| Nutritional & Fluid Support | 11 |  |
| Sepsis & Septic Shock | 11 |  |
| Therapeutic Communication | 10 |  |
| Sleep & Rest | 9 |  |
| Elimination & Comfort | 8 |  |
| Mental Health Disorders | 6 |  |
| Patient & Environment Safety | 6 |  |
| Standard Precautions & Hygiene | 6 |  |
| Pediatric & Adolescent Health | 5 |  |
| Procedural Complications & Dialysis | 5 |  |
| Psychotropic Medications | 4 |  |
| Disaster & Emergency Preparedness | 3 |  |
| PPE & Sterile Technique | 3 |  |
| Respiratory & Infectious Disorders | 3 |  |
| Cardiovascular & Endocrine Medications | 2 |  |
| Prioritization & Delegation | 2 |  |
| Diabetic Ketoacidosis (DKA) | 1 |  |
| Maternal-Newborn Care & Teaching | 1 |  |
| Pediatric & Toddler Safety | 1 |  |
| Substance Use & Withdrawal | 1 |  |

## Category Integrity

Rows with deterministic category integrity flags: 136

| ID | Residual category | Canonical category | Notes |
|---|---|---|---|
| `cs_adhf_pulm_edema_01_part_2` | Management of Care | Management of Care | parent category (Physiological Adaptation) differs from child category (Management of Care) |
| `cs_adhf_pulm_edema_01_part_3` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Physiological Adaptation) differs from child category (Reduction of Risk Potential) |
| `cs_adhf_pulm_edema_01_part_4` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| `cs_sepsis_shock_01_part_2` | Management of Care | Management of Care | parent category (Physiological Adaptation) differs from child category (Management of Care) |
| `cs_sepsis_shock_01_part_3` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Physiological Adaptation) differs from child category (Reduction of Risk Potential) |
| `cs_sepsis_shock_01_part_4` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| `cs_stemi_vfib_04_part_2` | Management of Care | Management of Care | parent category (Physiological Adaptation) differs from child category (Management of Care) |
| `cs_stemi_vfib_04_part_3` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| `cs_thyroid_storm_q2` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| `cs_thyroid_storm_q3` | Management of Care | Management of Care | parent category (Physiological Adaptation) differs from child category (Management of Care) |
| `cs_thyroid_storm_q4` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Physiological Adaptation) differs from child category (Reduction of Risk Potential) |
| `gpt_2026_06_13_case_delirium_uti_01_q2` | Safety and Infection Control | Safety and Infection Control | parent category (Physiological Adaptation) differs from child category (Safety and Infection Control) |
| `gpt_2026_06_13_case_delirium_uti_01_q3` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| `gpt_2026_06_13_case_delirium_uti_01_q4` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Physiological Adaptation) differs from child category (Reduction of Risk Potential) |
| `gpt_2026_06_13_case_delirium_uti_01_q5` | Psychosocial Integrity | Psychosocial Integrity | parent category (Physiological Adaptation) differs from child category (Psychosocial Integrity) |
| `gpt_2026_06_13_case_delirium_uti_01_q6` | Basic Care and Comfort | Basic Care and Comfort | parent category (Physiological Adaptation) differs from child category (Basic Care and Comfort) |
| `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q4` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Reduction of Risk Potential) differs from child category (Pharmacological and Parenteral Therapies) |
| `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q5` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Reduction of Risk Potential) differs from child category (Pharmacological and Parenteral Therapies) |
| `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q2` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q4` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q5` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| `gpt_case_gallstone_pancreatitis_01_q5` | Basic Care and Comfort | Basic Care and Comfort | parent category (Physiological Adaptation) differs from child category (Basic Care and Comfort) |
| `gpt_case_gap_2026_06_11_adhf_or_03` | Management of Care | Management of Care | parent category (Reduction of Risk Potential) differs from child category (Management of Care) |
| `gpt_case_gap_2026_06_11_adrenal_or_03` | Management of Care | Management of Care | parent category (Reduction of Risk Potential) differs from child category (Management of Care) |
| `gpt_case_gap_2026_06_11_aki_or_03` | Management of Care | Management of Care | parent category (Reduction of Risk Potential) differs from child category (Management of Care) |
| `gpt_case_gap_2026_06_11_anticoag_or_03` | Management of Care | Management of Care | parent category (Reduction of Risk Potential) differs from child category (Management of Care) |
| `gpt_case_gap_2026_06_11_case_tls_01_q2` | Physiological Adaptation | Physiological Adaptation | parent category (Reduction of Risk Potential) differs from child category (Physiological Adaptation) |
| `gpt_case_gap_2026_06_11_case_tls_01_q3` | Physiological Adaptation | Physiological Adaptation | parent category (Reduction of Risk Potential) differs from child category (Physiological Adaptation) |
| `gpt_case_gap_2026_06_11_case_tls_01_q5` | Physiological Adaptation | Physiological Adaptation | parent category (Reduction of Risk Potential) differs from child category (Physiological Adaptation) |
| `gpt_case_gap_2026_06_11_panc_or_03` | Management of Care | Management of Care | parent category (Reduction of Risk Potential) differs from child category (Management of Care) |
| `gpt_case_gap_2026_06_11_post_stroke_rehab_part_4_cloze_priority` | Management of Care | Management of Care | parent category (Basic Care and Comfort) differs from child category (Management of Care) |
| `gpt_case_gap_2026_06_11_sepsis_cloze_02` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Safety and Infection Control) differs from child category (Reduction of Risk Potential) |
| `gpt_case_gap_2026_06_11_sepsis_fib_04` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Safety and Infection Control) differs from child category (Reduction of Risk Potential) |
| `gpt_case_gap_2026_06_11_sepsis_or_03` | Management of Care | Management of Care | parent category (Safety and Infection Control) differs from child category (Management of Care) |
| `gpt_case_gbs_respiratory_compromise_01_q2` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Physiological Adaptation) differs from child category (Reduction of Risk Potential) |
| `gpt_case_gbs_respiratory_compromise_01_q4` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| `gpt_case_opus23_nat_toddler_01_q2` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Management of Care) differs from child category (Reduction of Risk Potential) |
| `gpt_case_opus23_nat_toddler_01_q3` | Psychosocial Integrity | Psychosocial Integrity | parent category (Management of Care) differs from child category (Psychosocial Integrity) |
| `gpt_case_opus5_cdi_immunocompromised_01_q1` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Safety and Infection Control) differs from child category (Pharmacological and Parenteral Therapies) |
| `gpt_case_opus5_cdi_immunocompromised_01_q3` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Safety and Infection Control) differs from child category (Pharmacological and Parenteral Therapies) |
| `gpt_case_opus5_cdi_immunocompromised_01_q4` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Safety and Infection Control) differs from child category (Reduction of Risk Potential) |
| `gpt_case_opus5_cdi_immunocompromised_01_q5` | Management of Care | Management of Care | parent category (Safety and Infection Control) differs from child category (Management of Care) |
| `gpt_case_opus5_cdi_immunocompromised_01_q6` | Health Promotion and Maintenance | Health Promotion and Maintenance | parent category (Safety and Infection Control) differs from child category (Health Promotion and Maintenance) |
| `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q4` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q5` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| `gpt_case_premium_next_case_caregiver_adaptation_dementia_03_fib_respite` | Management of Care | Management of Care | parent category (Psychosocial Integrity) differs from child category (Management of Care) |
| `gpt_case_premium_next_case_caregiver_adaptation_dementia_03_or_plan` | Management of Care | Management of Care | parent category (Psychosocial Integrity) differs from child category (Management of Care) |
| `gpt_case_premium_next_case_health_literacy_diabetes_01_sata_referrals` | Management of Care | Management of Care | parent category (Health Promotion and Maintenance) differs from child category (Management of Care) |
| `gpt_case_premium_next_case_occupational_exposure_vaccine_04_fib_supplies` | Management of Care | Management of Care | parent category (Safety and Infection Control) differs from child category (Management of Care) |
| `gpt_case_premium_next_case_preventive_screening_vaccine_05_sata_plan` | Management of Care | Management of Care | parent category (Health Promotion and Maintenance) differs from child category (Management of Care) |
| `gpt_case_premium_next_case_rehab_pressure_bowel_02_matrix_delegation` | Management of Care | Management of Care | parent category (Basic Care and Comfort) differs from child category (Management of Care) |
| `gpt_case_premium_next_case_rehab_pressure_bowel_02_or_transfer` | Safety and Infection Control | Safety and Infection Control | parent category (Basic Care and Comfort) differs from child category (Safety and Infection Control) |
| `gpt_case_warfarin_mvr_2026_06_11_01_q4` | Physiological Adaptation | Physiological Adaptation | parent category (Pharmacological and Parenteral Therapies) differs from child category (Physiological Adaptation) |
| `gpt_case_warfarin_mvr_2026_06_11_01_q6` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Pharmacological and Parenteral Therapies) differs from child category (Reduction of Risk Potential) |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q2` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Management of Care) differs from child category (Reduction of Risk Potential) |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q5` | Health Promotion and Maintenance | Health Promotion and Maintenance | parent category (Management of Care) differs from child category (Health Promotion and Maintenance) |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01_q2` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Reduction of Risk Potential) differs from child category (Pharmacological and Parenteral Therapies) |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01_q4` | Health Promotion and Maintenance | Health Promotion and Maintenance | parent category (Reduction of Risk Potential) differs from child category (Health Promotion and Maintenance) |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03_q1` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Health Promotion and Maintenance) differs from child category (Reduction of Risk Potential) |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q1` | Safety and Infection Control | Safety and Infection Control | parent category (Reduction of Risk Potential) differs from child category (Safety and Infection Control) |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q2` | Basic Care and Comfort | Basic Care and Comfort | parent category (Reduction of Risk Potential) differs from child category (Basic Care and Comfort) |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q5` | Management of Care | Management of Care | parent category (Reduction of Risk Potential) differs from child category (Management of Care) |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q2` | Health Promotion and Maintenance | Health Promotion and Maintenance | parent category (Safety and Infection Control) differs from child category (Health Promotion and Maintenance) |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q3` | Management of Care | Management of Care | parent category (Safety and Infection Control) differs from child category (Management of Care) |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q5` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Safety and Infection Control) differs from child category (Reduction of Risk Potential) |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q4` | Health Promotion and Maintenance | Health Promotion and Maintenance | parent category (Psychosocial Integrity) differs from child category (Health Promotion and Maintenance) |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q5` | Management of Care | Management of Care | parent category (Psychosocial Integrity) differs from child category (Management of Care) |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q3` | Management of Care | Management of Care | parent category (Reduction of Risk Potential) differs from child category (Management of Care) |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q4` | Safety and Infection Control | Safety and Infection Control | parent category (Reduction of Risk Potential) differs from child category (Safety and Infection Control) |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q5` | Health Promotion and Maintenance | Health Promotion and Maintenance | parent category (Reduction of Risk Potential) differs from child category (Health Promotion and Maintenance) |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q5` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Basic Care and Comfort) differs from child category (Reduction of Risk Potential) |
| `gpt_opus21_case_colostomy_lep_discharge_01_q3` | Psychosocial Integrity | Psychosocial Integrity | parent category (Management of Care) differs from child category (Psychosocial Integrity) |
| `gpt_opus21_case_colostomy_lep_discharge_01_q4` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Management of Care) differs from child category (Reduction of Risk Potential) |
| `gpt_opus21_case_colostomy_lep_discharge_01_q5` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Management of Care) differs from child category (Pharmacological and Parenteral Therapies) |
| `gpt_r1_regen_case_celiac_01_q4` | Health Promotion and Maintenance | Health Promotion and Maintenance | parent category (Physiological Adaptation) differs from child category (Health Promotion and Maintenance) |
| `gpt_r1_regen_case_celiac_01_q5` | Health Promotion and Maintenance | Health Promotion and Maintenance | parent category (Physiological Adaptation) differs from child category (Health Promotion and Maintenance) |
| `opus_agvd_case_agvhd_01_q3` | Management of Care | Management of Care | parent category (Physiological Adaptation) differs from child category (Management of Care) |
| `opus_agvd_case_agvhd_01_q4` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| `opus_agvd_case_agvhd_01_q5` | Management of Care | Management of Care | parent category (Physiological Adaptation) differs from child category (Management of Care) |
| `opus_case_lithium_toxicity_q2` | Management of Care | Management of Care | parent category (Pharmacological and Parenteral Therapies) differs from child category (Management of Care) |
| `opus_case_lithium_toxicity_q3` | Physiological Adaptation | Physiological Adaptation | parent category (Pharmacological and Parenteral Therapies) differs from child category (Physiological Adaptation) |
| `opus_case_lithium_toxicity_q5` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Pharmacological and Parenteral Therapies) differs from child category (Reduction of Risk Potential) |
| `opus_case_lithium_toxicity_q6` | Psychosocial Integrity | Psychosocial Integrity | parent category (Pharmacological and Parenteral Therapies) differs from child category (Psychosocial Integrity) |
| `opus_case_se_01_q3` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| `opus_case_se_01_q4` | Management of Care | Management of Care | parent category (Physiological Adaptation) differs from child category (Management of Care) |
| `opus_case_se_01_q5` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Physiological Adaptation) differs from child category (Reduction of Risk Potential) |
| `opus_case_se_01_q6` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Physiological Adaptation) differs from child category (Reduction of Risk Potential) |
| `opus_case_warfarin_bridge_q2` | Safety and Infection Control | Safety and Infection Control | parent category (Pharmacological and Parenteral Therapies) differs from child category (Safety and Infection Control) |
| `opus_case_warfarin_bridge_q4` | Safety and Infection Control | Safety and Infection Control | parent category (Pharmacological and Parenteral Therapies) differs from child category (Safety and Infection Control) |
| `opus_case_warfarin_bridge_q5` | Basic Care and Comfort | Basic Care and Comfort | parent category (Pharmacological and Parenteral Therapies) differs from child category (Basic Care and Comfort) |
| `opus_case_warfarin_bridge_q6` | Management of Care | Management of Care | parent category (Pharmacological and Parenteral Therapies) differs from child category (Management of Care) |
| `opus_icit_case_01_q2` | Physiological Adaptation | Physiological Adaptation | parent category (Pharmacological and Parenteral Therapies) differs from child category (Physiological Adaptation) |
| `opus_icit_case_01_q3` | Management of Care | Management of Care | parent category (Pharmacological and Parenteral Therapies) differs from child category (Management of Care) |
| `opus_icit_case_01_q4` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Pharmacological and Parenteral Therapies) differs from child category (Reduction of Risk Potential) |
| `opus_tpn_case_mucositis_01_q2` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| `opus_tpn_case_mucositis_01_q3` | Management of Care | Management of Care | parent category (Physiological Adaptation) differs from child category (Management of Care) |
| `opus_tpn_case_mucositis_01_q4` | Basic Care and Comfort | Basic Care and Comfort | parent category (Physiological Adaptation) differs from child category (Basic Care and Comfort) |
| `opus_tpn_case_mucositis_01_q6` | Basic Care and Comfort | Basic Care and Comfort | parent category (Physiological Adaptation) differs from child category (Basic Care and Comfort) |
| `opus1_case_discharge_med_rec_anticoag_01_q2` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Management of Care) differs from child category (Pharmacological and Parenteral Therapies) |
| `opus1_case_discharge_med_rec_anticoag_01_q5` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Management of Care) differs from child category (Pharmacological and Parenteral Therapies) |
| `opus1_case_tha_discharge_lep_01_q2` | Health Promotion and Maintenance | Health Promotion and Maintenance | parent category (Management of Care) differs from child category (Health Promotion and Maintenance) |
| `opus1_case_tha_discharge_lep_01_q4` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Management of Care) differs from child category (Pharmacological and Parenteral Therapies) |
| `opus12_case_inpatient_suicide_risk_01_q5` | Management of Care | Management of Care | parent category (Psychosocial Integrity) differs from child category (Management of Care) |
| `opus20_case_cdiff_01_q2` | Safety and Infection Control | Safety and Infection Control | parent category (Physiological Adaptation) differs from child category (Safety and Infection Control) |
| `opus20_case_cdiff_01_q3` | Safety and Infection Control | Safety and Infection Control | parent category (Physiological Adaptation) differs from child category (Safety and Infection Control) |
| `opus20_case_cdiff_01_q4` | Basic Care and Comfort | Basic Care and Comfort | parent category (Physiological Adaptation) differs from child category (Basic Care and Comfort) |
| `opus20_case_cdiff_01_q5` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| `opus22_case_postpartum_intrusive_thoughts_01_q4` | Management of Care | Management of Care | parent category (Psychosocial Integrity) differs from child category (Management of Care) |
| `opus22_case_postpartum_intrusive_thoughts_01_q5` | Health Promotion and Maintenance | Health Promotion and Maintenance | parent category (Psychosocial Integrity) differs from child category (Health Promotion and Maintenance) |
| `opus24_case_elder_neglect_med_mismanagement_01_q2` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Psychosocial Integrity) differs from child category (Pharmacological and Parenteral Therapies) |
| `opus24_case_elder_neglect_med_mismanagement_01_q3` | Management of Care | Management of Care | parent category (Psychosocial Integrity) differs from child category (Management of Care) |
| `opus24_case_elder_neglect_med_mismanagement_01_q4` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Psychosocial Integrity) differs from child category (Pharmacological and Parenteral Therapies) |
| `opus24_case_elder_neglect_med_mismanagement_01_q5` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Psychosocial Integrity) differs from child category (Pharmacological and Parenteral Therapies) |
| `opus24_case_elder_neglect_med_mismanagement_01_q6` | Management of Care | Management of Care | parent category (Psychosocial Integrity) differs from child category (Management of Care) |
| `opus25_case_tb_airborne_treatment_monitoring_01_q2` | Management of Care | Management of Care | parent category (Safety and Infection Control) differs from child category (Management of Care) |
| `opus25_case_tb_airborne_treatment_monitoring_01_q3` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Safety and Infection Control) differs from child category (Pharmacological and Parenteral Therapies) |
| `opus25_case_tb_airborne_treatment_monitoring_01_q4` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Safety and Infection Control) differs from child category (Pharmacological and Parenteral Therapies) |
| `opus25_case_tb_airborne_treatment_monitoring_01_q5` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Safety and Infection Control) differs from child category (Pharmacological and Parenteral Therapies) |
| `opus25_case_tb_airborne_treatment_monitoring_01_q6` | Psychosocial Integrity | Psychosocial Integrity | parent category (Safety and Infection Control) differs from child category (Psychosocial Integrity) |
| `opus26_case_refeeding_syndrome_01_q2` | Basic Care and Comfort | Basic Care and Comfort | parent category (Physiological Adaptation) differs from child category (Basic Care and Comfort) |
| `opus26_case_refeeding_syndrome_01_q4` | Psychosocial Integrity | Psychosocial Integrity | parent category (Physiological Adaptation) differs from child category (Psychosocial Integrity) |
| `opus4_case_postop_sbar_01_q1` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Management of Care) differs from child category (Reduction of Risk Potential) |
| `opus4_case_postop_sbar_01_q2` | Physiological Adaptation | Physiological Adaptation | parent category (Management of Care) differs from child category (Physiological Adaptation) |
| `opus4_case_postop_sbar_01_q6` | Reduction of Risk Potential | Reduction of Risk Potential | parent category (Management of Care) differs from child category (Reduction of Risk Potential) |
| `q2_4` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Safety and Infection Control) differs from child category (Pharmacological and Parenteral Therapies) |
| `q2_5` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Safety and Infection Control) differs from child category (Pharmacological and Parenteral Therapies) |
| `q3_3` | Management of Care | Management of Care | parent category (Safety and Infection Control) differs from child category (Management of Care) |
| `q3_5` | Physiological Adaptation | Physiological Adaptation | parent category (Safety and Infection Control) differs from child category (Physiological Adaptation) |
| `q4_1` | Safety and Infection Control | Safety and Infection Control | parent category (Physiological Adaptation) differs from child category (Safety and Infection Control) |
| `q4_4` | Safety and Infection Control | Safety and Infection Control | parent category (Physiological Adaptation) differs from child category (Safety and Infection Control) |
| `q5_3` | Basic Care and Comfort | Basic Care and Comfort | parent category (Psychosocial Integrity) differs from child category (Basic Care and Comfort) |
| `q5_4` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Psychosocial Integrity) differs from child category (Pharmacological and Parenteral Therapies) |
| `q6_3` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| `q7_3` | Pharmacological and Parenteral Therapies | Pharmacological and Parenteral Therapies | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| `q7_4` | Safety and Infection Control | Safety and Infection Control | parent category (Physiological Adaptation) differs from child category (Safety and Infection Control) |
| `q9_5` | Physiological Adaptation | Physiological Adaptation | parent category (Pharmacological and Parenteral Therapies) differs from child category (Physiological Adaptation) |

## Per-Category Adjudication Tables

### Management of Care

Rows: 99

| Status | Proposed topic | Old topic | ID | Type | Reason |
|---|---|---|---|---|---|
| proposed | Discharge Planning & Handoff | Case Management & Continuity of Care | `claude_jun05_moc_case_mgmt_01` | multiple_choice | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | chain of command escalation | `opus4_case_postop_sbar_01_q4` | multiple_choice | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | colostomy discharge readiness | `gpt_opus21_case_colostomy_lep_discharge_01_q2` | select_all | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | Community resource planning for safe discharge | `gpt_case_gap_2026_06_11_community_resources_part_1_mc_priority` | multiple_choice | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | Community resource planning for safe discharge | `gpt_case_gap_2026_06_11_community_resources_part_2_matrix_referrals` | matrix | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | Community resource planning for safe discharge | `gpt_case_gap_2026_06_11_community_resources_part_3_sata_actions` | select_all | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | Community resource planning for safe discharge | `gpt_case_gap_2026_06_11_community_resources_part_4_order_discharge` | ordered_response | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | Community resource referral before discharge | `gpt_gap_2026_06_10_b_or_transport_food_resources_05` | ordered_response | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | community resource referral for food insecurity and medication access | `gpt_gap_2026_06_12_nonmcq_balanced_cloze_food_med_access_08` | dropdown_cloze | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | Community resources for older adult support | `gpt_gap_2026_06_10_b_fib_area_agency_aging_10` | fill_in_blank | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | Critical Result Closed-Loop Communication | `gpt_gap_jun11_or_critical_result_communication_02` | ordered_response | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | Delegation and scope of practice | `gpt_u6_matrix_cloze_2026_06_09_matrix_delegation_scope_04` | matrix | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | discharge barrier escalation sequence after sedation | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q4` | ordered_response | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | documentation of medication reconciliation | `opus1_case_discharge_med_rec_anticoag_01_q6` | multiple_choice | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | failed discharge teach-back escalation | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q3` | dropdown_cloze | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | food insecurity and medication access referral | `gpt_gap_2026_06_12_nonmcq_balanced_b_cloze_food_med_access_07` | dropdown_cloze | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | home health handoff after discharge | `opus1_case_tha_discharge_lep_01_q6` | select_all | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | Interdisciplinary Care Conference Coordination | `gpt_gap_jun11_or_care_conference_03` | ordered_response | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | Interdisciplinary Collaboration & Referral | `claude_jun05_moc_referral_slp_02` | multiple_choice | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | interdisciplinary discharge planning | `opus1_case_tha_discharge_lep_01_q3` | select_all | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | interdisciplinary medication reconciliation | `opus1_case_discharge_med_rec_anticoag_01_q3` | select_all | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | interpreter-facilitated teach-back | `gpt_opus21_case_colostomy_lep_discharge_01_q6` | select_all | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | Interpreter-Supported Discharge Teaching | `gpt_gap_jun11_cloze_interpreter_teaching_02` | dropdown_cloze | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | language access after surgery | `opus1_case_tha_discharge_lep_01_q1` | multiple_choice | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | limited English proficiency discharge teaching | `gpt_opus21_case_colostomy_lep_discharge_01_q1` | multiple_choice | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | Low-Health-Literacy Discharge Teaching | `gpt_gap_jun11_cloze_low_literacy_wound_teaching_03` | dropdown_cloze | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | multidisciplinary discharge planning after suspected child abuse | `gpt_case_opus23_nat_toddler_01_q5` | select_all | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | Prioritization of unstable findings during shift report | `gpt_u6_matrix_cloze_2026_06_09_matrix_shift_report_priority_14` | matrix | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | prioritizing nursing actions during acute deterioration | `opus4_case_postop_sbar_01_q5` | ordered_response | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | Rehabilitation referral for activities of daily living | `gpt_gap_2026_06_10_fib_occupational_therapy_10` | fill_in_blank | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | safe communication plan after discharge | `opus1_case_tha_discharge_lep_01_q5` | select_all | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | safe discharge medication teaching | `opus1_case_discharge_med_rec_anticoag_01_q4` | ordered_response | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | SBAR escalation for postoperative deterioration | `opus4_case_postop_sbar_01_q3` | select_all | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | SBAR Handoff for Clinical Deterioration | `gpt_gap_jun11_or_sbar_handoff_01` | ordered_response | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | Screening access and community referrals | `gpt_gap_2026_06_10_or_colorectal_screening_access_05` | ordered_response | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | Teach-Back for Heart Failure Discharge Readiness | `gpt_gap_jun11_cloze_teach_back_hf_01` | dropdown_cloze | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Legal & Ethical Principles | code status escalation | `opus2_case_code_status_q1` | multiple_choice | The item tests legal or ethical nursing responsibilities. |
| proposed | Legal & Ethical Principles | code status escalation | `opus2_case_code_status_q2` | multiple_choice | The item tests legal or ethical nursing responsibilities. |
| proposed | Legal & Ethical Principles | code status escalation | `opus2_case_code_status_q3` | multiple_choice | The item tests legal or ethical nursing responsibilities. |
| proposed | Legal & Ethical Principles | code status escalation | `opus2_case_code_status_q4` | multiple_choice | The item tests legal or ethical nursing responsibilities. |
| proposed | Legal & Ethical Principles | code status escalation | `opus2_case_code_status_q5` | select_all | The item tests legal or ethical nursing responsibilities. |
| proposed | Legal & Ethical Principles | consent documentation with interpreter | `opus5_case_consent_interpreter_01_q5` | dropdown_cloze | The item tests legal or ethical nursing responsibilities. |
| proposed | Legal & Ethical Principles | consent escalation sequence | `opus5_case_consent_interpreter_01_q3` | ordered_response | The item tests legal or ethical nursing responsibilities. |
| proposed | Legal & Ethical Principles | informed consent validity | `opus5_case_consent_interpreter_01_q1` | multiple_choice | The item tests legal or ethical nursing responsibilities. |
| proposed | Legal & Ethical Principles | interpreter-supported consent and discharge readiness | `gpt_gap_2026_06_12_nonmcq_balanced_or_interpreter_discharge_06` | ordered_response | The item tests legal or ethical nursing responsibilities. |
| proposed | Legal & Ethical Principles | interpreter-supported informed consent | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q1` | multiple_choice | The item tests legal or ethical nursing responsibilities. |
| proposed | Legal & Ethical Principles | mandatory reporting and nursing role boundaries | `gpt_case_opus23_nat_toddler_01_q4` | dropdown_cloze | The item tests legal or ethical nursing responsibilities. |
| proposed | Legal & Ethical Principles | nurse advocacy and chain of command | `opus5_case_consent_interpreter_01_q4` | multiple_choice | The item tests legal or ethical nursing responsibilities. |
| proposed | Legal & Ethical Principles | qualified medical interpreter use | `opus5_case_consent_interpreter_01_q2` | select_all | The item tests legal or ethical nursing responsibilities. |
| proposed | Legal & Ethical Principles | suspected nonaccidental trauma in a toddler | `gpt_case_opus23_nat_toddler_01_q1` | select_all | The item tests legal or ethical nursing responsibilities. |
| proposed | Prioritization & Delegation | Near-miss medication error reporting | `gpt_gap_jun12_or_near_miss_medication_error_01` | ordered_response | The item tests priority-setting, delegation, or escalation of care. |
| proposed | Prioritization & Delegation | Quality Improvement | `claude_jun05_moc_quality_improvement_03` | multiple_choice | The item tests priority-setting, delegation, or escalation of care. |
| unresolved |  | enteral pump duration calculation | `gpt_visual_smoke_2026_06_12_fib_device_enteral_duration_10` | fill_in_blank | No candidate topic genuinely fits the scoped context. |
| unresolved |  | missed dose follow-up | `mar_missed_antibiotic_followup_07` | matrix | No candidate topic genuinely fits the scoped context. |
| blocked-cross-category | Medication Safety & Admin | discharge medication reconciliation | `opus1_case_discharge_med_rec_anticoag_01_q1` | matrix | The item tests safe parenteral medication route or injection technique. |
| category-untrusted |  | Acute Graft-Versus-Host Disease | `opus_agvd_case_agvhd_01_q3` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Management of Care) |
| category-untrusted |  | Acute Graft-Versus-Host Disease | `opus_agvd_case_agvhd_01_q5` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Management of Care) |
| category-untrusted |  | Adrenal crisis emergency response | `gpt_case_gap_2026_06_11_adrenal_or_03` | ordered_response | parent category (Reduction of Risk Potential) differs from child category (Management of Care) |
| category-untrusted |  | Cardiac Arrest Resuscitation Sequence | `cs_stemi_vfib_04_part_2` | ordered_response | parent category (Physiological Adaptation) differs from child category (Management of Care) |
| category-untrusted |  | caregiver safety planning and care coordination | `gpt_case_premium_next_case_caregiver_adaptation_dementia_03_or_plan` | ordered_response | parent category (Psychosocial Integrity) differs from child category (Management of Care) |
| category-untrusted |  | Consent and family involvement in suicide safety planning | `opus12_case_inpatient_suicide_risk_01_q5` | dropdown_cloze | parent category (Psychosocial Integrity) differs from child category (Management of Care) |
| category-untrusted |  | delegation and interprofessional rehabilitation coordination | `gpt_case_premium_next_case_rehab_pressure_bowel_02_matrix_delegation` | matrix | parent category (Basic Care and Comfort) differs from child category (Management of Care) |
| category-untrusted |  | delirium discharge readiness | `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q5` | multiple_choice | parent category (Psychosocial Integrity) differs from child category (Management of Care) |
| category-untrusted |  | Emergency hyperkalemia management | `gpt_case_gap_2026_06_11_aki_or_03` | ordered_response | parent category (Reduction of Risk Potential) differs from child category (Management of Care) |
| category-untrusted |  | Escalation for acute pulmonary edema | `gpt_case_gap_2026_06_11_adhf_or_03` | ordered_response | parent category (Reduction of Risk Potential) differs from child category (Management of Care) |
| category-untrusted |  | home oxygen discharge coordination | `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q3` | ordered_response | parent category (Safety and Infection Control) differs from child category (Management of Care) |
| category-untrusted |  | home wound-care teach-back sequence | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q5` | ordered_response | parent category (Reduction of Risk Potential) differs from child category (Management of Care) |
| category-untrusted |  | Immune Checkpoint Inhibitor Myocarditis | `opus_icit_case_01_q3` | ordered_response | parent category (Pharmacological and Parenteral Therapies) differs from child category (Management of Care) |
| category-untrusted |  | Initial nursing sequence for suspected C. difficile infection | `gpt_case_opus5_cdi_immunocompromised_01_q5` | ordered_response | parent category (Safety and Infection Control) differs from child category (Management of Care) |
| category-untrusted |  | interdisciplinary discharge safety planning | `opus24_case_elder_neglect_med_mismanagement_01_q6` | select_all | parent category (Psychosocial Integrity) differs from child category (Management of Care) |
| category-untrusted |  | interprofessional diabetes care coordination | `gpt_case_premium_next_case_health_literacy_diabetes_01_sata_referrals` | select_all | parent category (Health Promotion and Maintenance) differs from child category (Management of Care) |
| category-untrusted |  | lithium toxicity | `opus_case_lithium_toxicity_q2` | multiple_choice | parent category (Pharmacological and Parenteral Therapies) differs from child category (Management of Care) |
| category-untrusted |  | Mandated Reporting | `q3_3` | multiple_choice | parent category (Safety and Infection Control) differs from child category (Management of Care) |
| category-untrusted |  | mandatory reporting and escalation | `opus24_case_elder_neglect_med_mismanagement_01_q3` | select_all | parent category (Psychosocial Integrity) differs from child category (Management of Care) |
| category-untrusted |  | Mucositis TPN and CRBSI | `opus_tpn_case_mucositis_01_q3` | ordered_response | parent category (Physiological Adaptation) differs from child category (Management of Care) |
| category-untrusted |  | Pancreatitis deterioration response | `gpt_case_gap_2026_06_11_panc_or_03` | ordered_response | parent category (Reduction of Risk Potential) differs from child category (Management of Care) |
| category-untrusted |  | post-fall escalation | `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q3` | dropdown_cloze | parent category (Reduction of Risk Potential) differs from child category (Management of Care) |
| category-untrusted |  | Post-stroke outpatient rehabilitation and safe feeding | `gpt_case_gap_2026_06_11_post_stroke_rehab_part_4_cloze_priority` | dropdown_cloze | parent category (Basic Care and Comfort) differs from child category (Management of Care) |
| category-untrusted |  | Pulmonary Edema Interventions | `cs_adhf_pulm_edema_01_part_2` | ordered_response | parent category (Physiological Adaptation) differs from child category (Management of Care) |
| category-untrusted |  | resource coordination for preventive care | `gpt_case_premium_next_case_preventive_screening_vaccine_05_sata_plan` | select_all | parent category (Health Promotion and Maintenance) differs from child category (Management of Care) |
| category-untrusted |  | resource management for vaccination clinic supplies | `gpt_case_premium_next_case_occupational_exposure_vaccine_04_fib_supplies` | fill_in_blank | parent category (Safety and Infection Control) differs from child category (Management of Care) |
| category-untrusted |  | resource planning for caregiver respite | `gpt_case_premium_next_case_caregiver_adaptation_dementia_03_fib_respite` | fill_in_blank | parent category (Psychosocial Integrity) differs from child category (Management of Care) |
| category-untrusted |  | Response to heparin-associated bleeding | `gpt_case_gap_2026_06_11_anticoag_or_03` | ordered_response | parent category (Reduction of Risk Potential) differs from child category (Management of Care) |
| category-untrusted |  | RN scope medication dose question | `opus22_case_postpartum_intrusive_thoughts_01_q4` | multiple_choice | parent category (Psychosocial Integrity) differs from child category (Management of Care) |
| category-untrusted |  | Sepsis bundle nursing priorities | `gpt_case_gap_2026_06_11_sepsis_or_03` | ordered_response | parent category (Safety and Infection Control) differs from child category (Management of Care) |
| category-untrusted |  | Septic Shock Interventions | `cs_sepsis_shock_01_part_2` | ordered_response | parent category (Physiological Adaptation) differs from child category (Management of Care) |
| category-untrusted |  | status epilepticus | `opus_case_se_01_q4` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Management of Care) |
| category-untrusted |  | Thyroid Storm Interventions | `cs_thyroid_storm_q3` | select_all | parent category (Physiological Adaptation) differs from child category (Management of Care) |
| category-untrusted |  | Tuberculosis contact investigation | `opus25_case_tb_airborne_treatment_monitoring_01_q2` | multiple_choice | parent category (Safety and Infection Control) differs from child category (Management of Care) |
| category-untrusted |  | warfarin-enoxaparin-bridge | `opus_case_warfarin_bridge_q6` | multiple_choice | parent category (Pharmacological and Parenteral Therapies) differs from child category (Management of Care) |
| context-incomplete |  | code status escalation | `opus2_case_code_status_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | colostomy discharge teaching for limited English proficiency | `gpt_opus21_case_colostomy_lep_discharge_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Community resource planning for safe discharge | `gpt_case_gap_2026_06_11_case_community_resource_discharge_05` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | discharge coordination after hip arthroplasty | `opus1_case_tha_discharge_lep_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | discharge medication reconciliation | `opus1_case_discharge_med_rec_anticoag_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | informed consent and interpreter services | `opus5_case_consent_interpreter_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | interpreter-supported consent and discharge readiness | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | postoperative deterioration escalation | `opus4_case_postop_sbar_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | suspected nonaccidental trauma in a toddler | `gpt_case_opus23_nat_toddler_01` |  | id not found in canonical banks; classification skipped |

### Safety and Infection Control

Rows: 65

| Status | Proposed topic | Old topic | ID | Type | Reason |
|---|---|---|---|---|---|
| proposed | Disaster & Emergency Preparedness | Chemical Decontamination Priority | `q2_1` | multiple_choice | The item tests disaster or emergency preparedness. |
| proposed | Disaster & Emergency Preparedness | Chemical Exposure Type | `q2_3` | multiple_choice | The item tests disaster or emergency preparedness. |
| proposed | Disaster & Emergency Preparedness | Disaster Triage Tagging | `q2_2` | multiple_choice | The item tests disaster or emergency preparedness. |
| proposed | Medication Safety & Admin | medication label dose verification | `gpt_visual_smoke_2026_06_12_mc_medlabel_tablet_quantity_08` | multiple_choice | The item tests medication safety in a safety context. |
| proposed | Medication Safety & Admin | PCA pump safety settings | `gpt_visual_smoke_2026_06_12_matrix_device_pca_basal_09` | matrix | The item tests medication safety in a safety context. |
| proposed | Patient & Environment Safety | anesthesia equipment | `cap_04` | multiple_choice | The item tests environmental or equipment safety. |
| proposed | Patient & Environment Safety | Consistency of History | `q3_2` | multiple_choice | The item tests environmental or equipment safety. |
| proposed | Patient & Environment Safety | home oxygen emergency teaching | `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q4` | multiple_choice | The item tests environmental or equipment safety. |
| proposed | Patient & Environment Safety | home oxygen equipment setup sequence | `gpt_gap_2026_06_12_nonmcq_balanced_b_or_home_oxygen_setup_11` | ordered_response | The item tests environmental or equipment safety. |
| proposed | Patient & Environment Safety | home oxygen safety | `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q1` | matrix | The item tests environmental or equipment safety. |
| proposed | Patient & Environment Safety | Restraint Monitoring Protocol | `gpt_gap_jun11_or_restraint_monitoring_01` | ordered_response | The item tests environmental or equipment safety. |
| proposed | PPE & Sterile Technique | Central line infection prevention | `gpt_u6_matrix_cloze_2026_06_09_matrix_central_line_care_13` | matrix | The item tests PPE or sterile technique. |
| proposed | PPE & Sterile Technique | sharps safety practice evaluation | `gpt_case_premium_next_case_occupational_exposure_vaccine_04_matrix_practices` | matrix | The item tests PPE or sterile technique. |
| proposed | PPE & Sterile Technique | Sterile Dressing Change Asepsis | `gpt_gap_jun11_or_sterile_dressing_change_03` | ordered_response | The item tests PPE or sterile technique. |
| proposed | Standard Precautions & Hygiene | Febrile neutropenia priority care | `gpt_u6_matrix_cloze_2026_06_09_cloze_febrile_neutropenia_10` | dropdown_cloze | The item tests standard precautions or hygiene safety. |
| proposed | Standard Precautions & Hygiene | needlestick exposure immediate response | `gpt_case_premium_next_case_occupational_exposure_vaccine_04_or_initial` | ordered_response | The item tests standard precautions or hygiene safety. |
| proposed | Standard Precautions & Hygiene | Needlestick Exposure Response | `gpt_gap_jun11_or_needlestick_exposure_02` | ordered_response | The item tests standard precautions or hygiene safety. |
| proposed | Standard Precautions & Hygiene | Norovirus Outbreak Infection Control | `gpt_gap_jun11_fib_norovirus_outbreak_02` | fill_in_blank | The item tests standard precautions or hygiene safety. |
| proposed | Standard Precautions & Hygiene | percutaneous exposure management | `gpt_case_premium_next_case_occupational_exposure_vaccine_04_cloze_exposure` | dropdown_cloze | The item tests standard precautions or hygiene safety. |
| proposed | Standard Precautions & Hygiene | quality improvement for sharps injury prevention | `gpt_case_premium_next_case_occupational_exposure_vaccine_04_sata_qi` | select_all | The item tests standard precautions or hygiene safety. |
| proposed | Transmission-Based Precautions | Active Pulmonary TB Airborne Precautions | `gpt_gap_jun11_sata_tb_airborne_precautions_01` | select_all | The item tests transmission-based isolation or visitor precautions. |
| proposed | Transmission-Based Precautions | Clostridioides difficile and Contact Precautions | `claude_cs_jun06_cdiff_sic_01_part_1` | multiple_choice | The item tests transmission-based isolation or visitor precautions. |
| proposed | Transmission-Based Precautions | Clostridioides difficile and Contact Precautions | `claude_cs_jun06_cdiff_sic_01_part_2` | multiple_choice | The item tests transmission-based isolation or visitor precautions. |
| proposed | Transmission-Based Precautions | Clostridioides difficile and Contact Precautions | `claude_cs_jun06_cdiff_sic_01_part_3` | matrix | The item tests transmission-based isolation or visitor precautions. |
| proposed | Transmission-Based Precautions | Clostridioides difficile and Contact Precautions | `claude_cs_jun06_cdiff_sic_01_part_4` | ordered_response | The item tests transmission-based isolation or visitor precautions. |
| proposed | Transmission-Based Precautions | contact precautions workflow for diarrheal illness | `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_contact_diarrhea_09` | matrix | The item tests transmission-based isolation or visitor precautions. |
| proposed | Transmission-Based Precautions | contact precautions workflow for diarrheal illness | `gpt_gap_2026_06_12_nonmcq_balanced_or_contact_precautions_diarrhea_09` | ordered_response | The item tests transmission-based isolation or visitor precautions. |
| proposed | Transmission-Based Precautions | Initial infection-control actions for suspected C. difficile infection | `gpt_case_opus5_cdi_immunocompromised_01_q2` | select_all | The item tests transmission-based isolation or visitor precautions. |
| proposed | Transmission-Based Precautions | Meningococcal Meningitis Droplet Precautions | `gpt_gap_jun11_sata_meningococcal_droplet_03` | select_all | The item tests transmission-based isolation or visitor precautions. |
| proposed | Transmission-Based Precautions | Scabies Contact Precautions | `gpt_gap_jun11_fib_scabies_precautions_03` | fill_in_blank | The item tests transmission-based isolation or visitor precautions. |
| proposed | Transmission-Based Precautions | stool specimen collection under contact precautions | `gpt_gap_2026_06_12_nonmcq_balanced_b_or_stool_specimen_contact_12` | ordered_response | The item tests transmission-based isolation or visitor precautions. |
| proposed | Transmission-Based Precautions | Transmission-based precautions selection | `gpt_u6_matrix_cloze_2026_06_09_matrix_infection_precautions_02` | matrix | The item tests transmission-based isolation or visitor precautions. |
| proposed | Transmission-Based Precautions | Tuberculosis airborne precautions | `opus25_case_tb_airborne_treatment_monitoring_01_q1` | multiple_choice | The item tests transmission-based isolation or visitor precautions. |
| proposed | Transmission-Based Precautions | Varicella Airborne and Contact Precautions | `gpt_gap_jun11_sata_varicella_precautions_02` | select_all | The item tests transmission-based isolation or visitor precautions. |
| unresolved |  | CAUTI Prevention Bundle | `gpt_gap_jun11_fib_cauti_prevention_01` | fill_in_blank | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Child Abuse Interventions | `q3_4` | select_all | No candidate topic genuinely fits the scoped context. |
| unresolved |  | malignant hyperthermia | `vit_10` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Moisture management for pressure injury prevention | `gpt_gap_2026_06_10_b_or_moisture_pressure_prevention_04` | ordered_response | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Pressure injury prevention in long-term care | `gpt_case_gap_2026_06_11_pressure_ltc_part_1_matrix_risk` | matrix | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Pressure injury prevention in long-term care | `gpt_case_gap_2026_06_11_pressure_ltc_part_2_sata_plan` | select_all | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Pressure injury prevention in long-term care | `gpt_case_gap_2026_06_11_pressure_ltc_part_3_mc_delegate` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Pressure injury prevention in long-term care | `gpt_case_gap_2026_06_11_pressure_ltc_part_4_cloze_outcome` | dropdown_cloze | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Pressure injury prevention in rehabilitation | `gpt_gap_2026_06_10_or_pressure_injury_prevention_04` | ordered_response | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Sepsis from urinary source | `gpt_case_gap_2026_06_11_sepsis_matrix_01` | matrix | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Shaken Baby Syndrome Signs | `q3_1` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| category-untrusted |  | C. difficile colitis and dehydration | `opus20_case_cdiff_01_q2` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Safety and Infection Control) |
| category-untrusted |  | C. difficile colitis and dehydration | `opus20_case_cdiff_01_q3` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Safety and Infection Control) |
| category-untrusted |  | DIC Nursing Interventions | `q7_4` | select_all | parent category (Physiological Adaptation) differs from child category (Safety and Infection Control) |
| category-untrusted |  | home wound-care infection prevention | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q1` | matrix | parent category (Reduction of Risk Potential) differs from child category (Safety and Infection Control) |
| category-untrusted |  | hyperactive delirium safety | `gpt_2026_06_13_case_delirium_uti_01_q2` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Safety and Infection Control) |
| category-untrusted |  | post-fall monitoring sequence | `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q4` | ordered_response | parent category (Reduction of Risk Potential) differs from child category (Safety and Infection Control) |
| category-untrusted |  | safe mobility and fall prevention | `gpt_case_premium_next_case_rehab_pressure_bowel_02_or_transfer` | ordered_response | parent category (Basic Care and Comfort) differs from child category (Safety and Infection Control) |
| category-untrusted |  | Transfusion Reaction Priority | `q4_1` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Safety and Infection Control) |
| category-untrusted |  | Transfusion Reaction Protocol | `q4_4` | select_all | parent category (Physiological Adaptation) differs from child category (Safety and Infection Control) |
| category-untrusted |  | warfarin-enoxaparin-bridge | `opus_case_warfarin_bridge_q2` | multiple_choice | parent category (Pharmacological and Parenteral Therapies) differs from child category (Safety and Infection Control) |
| category-untrusted |  | warfarin-enoxaparin-bridge | `opus_case_warfarin_bridge_q4` | matrix | parent category (Pharmacological and Parenteral Therapies) differs from child category (Safety and Infection Control) |
| context-incomplete |  | Child Abuse / Non-Accidental Trauma | `cs_ngn_003_child_abuse` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Clostridioides difficile and Contact Precautions | `claude_cs_jun06_cdiff_sic_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Clostridioides difficile infection control and treatment | `gpt_case_opus5_cdi_immunocompromised_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Disaster Triage / Chemical Exposure | `cs_ngn_002_disaster` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | home oxygen safety and COPD discharge teaching | `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | occupational exposure and sharps safety | `gpt_case_premium_next_case_occupational_exposure_vaccine_04` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Pressure injury prevention in long-term care | `gpt_case_gap_2026_06_11_case_pressure_injury_ltc_04` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Sepsis from obstructed urinary source | `gpt_case_gap_2026_06_11_case_urosepsis_05` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Tuberculosis airborne precautions and treatment monitoring | `opus25_case_tb_airborne_treatment_monitoring_01` |  | id not found in canonical banks; classification skipped |

### Health Promotion and Maintenance

Rows: 67

| Status | Proposed topic | Old topic | ID | Type | Reason |
|---|---|---|---|---|---|
| proposed | Adult Health & Wellness | Adult Immunization and Preventive Screening | `claude_cs_jun06_adult_immunization_hpm_01_part_1` | matrix | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | Adult Immunization and Preventive Screening | `claude_cs_jun06_adult_immunization_hpm_01_part_2` | multiple_choice | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | Adult Immunization and Preventive Screening | `claude_cs_jun06_adult_immunization_hpm_01_part_4` | select_all | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | Adult Physical Activity Counseling | `gpt_gap_jun11_matrix_adult_physical_activity_03` | matrix | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | adult preventive screening | `gpt_case_premium_2026_06_10_case01_cloze_counseling_02` | dropdown_cloze | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | adult preventive screening | `gpt_case_premium_2026_06_10_case01_matrix_screening_01` | matrix | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | adult preventive screening | `gpt_case_premium_2026_06_10_case01_mc_positive_fit_03` | multiple_choice | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | Adult preventive screening follow-up navigation | `gpt_case_gap_2026_06_11_screening_navigation_part_1_cloze_followup` | dropdown_cloze | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | Adult preventive screening follow-up navigation | `gpt_case_gap_2026_06_11_screening_navigation_part_2_matrix_barriers` | matrix | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | Adult preventive screening follow-up navigation | `gpt_case_gap_2026_06_11_screening_navigation_part_3_fib_days` | fill_in_blank | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | Adult preventive screening follow-up navigation | `gpt_case_gap_2026_06_11_screening_navigation_part_4_sata_navigation` | select_all | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | Average-Risk Colorectal Cancer Screening | `gpt_gap_jun11_fib_colorectal_screening_01` | fill_in_blank | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | Cervical Cancer Screening Average Risk | `gpt_gap_jun11_fib_cervical_screening_02` | fill_in_blank | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | colorectal cancer screening counseling | `gpt_case_premium_next_case_preventive_screening_vaccine_05_cloze_crc` | dropdown_cloze | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | Lung cancer screening eligibility | `gpt_gap_2026_06_10_b_fib_lung_screening_07` | fill_in_blank | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | Lung Cancer Screening Eligibility | `gpt_gap_jun11_fib_lung_cancer_screening_03` | fill_in_blank | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | motivational interviewing for preventive care | `gpt_case_premium_next_case_preventive_screening_vaccine_05_or_teaching` | ordered_response | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | Osteoporosis Screening and Prevention | `gpt_gap_jun11_matrix_osteoporosis_prevention_02` | matrix | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | preventive care need recognition | `gpt_case_premium_next_case_preventive_screening_vaccine_05_matrix_needs` | matrix | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | preventive health goal setting | `gpt_case_premium_next_case_preventive_screening_vaccine_05_fib_activity` | fill_in_blank | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | preventive screening counseling | `gpt_case_premium_2026_06_10_case01_or_screening_plan_05` | ordered_response | The item tests adult preventive health or screening. |
| proposed | Adult Health & Wellness | screening follow-up adherence | `gpt_case_premium_2026_06_10_case01_sata_followup_04` | select_all | The item tests adult preventive health or screening. |
| proposed | Chronic Disease Management & Lifestyle | chronic illness self-management | `gpt_case_premium_2026_06_10_case03_matrix_selfmgmt_01` | matrix | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | chronic illness self-management | `gpt_case_premium_2026_06_10_case03_sata_plan_03` | select_all | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | chronic illness self-management and health literacy | `gpt_case_premium_next_case_health_literacy_diabetes_01_matrix_cues` | matrix | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | chronic illness self-management follow-up | `gpt_case_premium_2026_06_10_case03_or_followup_05` | ordered_response | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | Chronic illness self-management foot inspection | `gpt_gap_2026_06_10_b_fib_diabetes_foot_self_management_09` | fill_in_blank | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | Chronic illness self-management goals | `gpt_gap_2026_06_10_fib_smart_goal_09` | fill_in_blank | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | Chronic illness self-management with symptom tracking | `gpt_case_gap_2026_06_11_self_management_part_1_matrix_cues` | matrix | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | Chronic illness self-management with symptom tracking | `gpt_case_gap_2026_06_11_self_management_part_2_fib_weight_gain` | fill_in_blank | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | Chronic illness self-management with symptom tracking | `gpt_case_gap_2026_06_11_self_management_part_3_cloze_escalation` | dropdown_cloze | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | Chronic illness self-management with symptom tracking | `gpt_case_gap_2026_06_11_self_management_part_4_sata_teachback` | select_all | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | diabetes foot care self-management | `gpt_case_premium_2026_06_10_case03_mc_understanding_04` | multiple_choice | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | diabetes self-management planning | `gpt_case_premium_2026_06_10_case03_cloze_goal_02` | dropdown_cloze | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | Discharge teaching with limited English proficiency | `gpt_gap_2026_06_10_b_or_interpreter_discharge_01` | ordered_response | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | Health literacy discharge teaching | `gpt_gap_2026_06_10_or_health_literacy_discharge_02` | ordered_response | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | hypoglycemia prevention teaching | `gpt_case_premium_next_case_health_literacy_diabetes_01_cloze_priority` | dropdown_cloze | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | Prediabetes Lifestyle Modification | `gpt_gap_jun11_matrix_prediabetes_lifestyle_01` | matrix | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | self-management goal setting | `gpt_case_premium_next_case_health_literacy_diabetes_01_fib_activity` | fill_in_blank | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | Teach-back for health literacy | `gpt_gap_2026_06_10_fib_teach_back_06` | fill_in_blank | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | teach-back for medication safety | `gpt_case_premium_next_case_health_literacy_diabetes_01_or_teachback` | ordered_response | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Maternal-Newborn Care & Teaching | Adult Immunization and Preventive Screening | `claude_cs_jun06_adult_immunization_hpm_01_part_3` | multiple_choice | The item tests maternal-newborn assessment or teaching. |
| proposed | Pediatric & Adolescent Health | Breast cancer screening teaching | `gpt_gap_2026_06_10_b_fib_mammography_screening_06` | fill_in_blank | The item tests pediatric or adolescent health teaching. |
| proposed | Pediatric & Adolescent Health | home oral rehydration sequence | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03_q4` | ordered_response | The item tests pediatric or adolescent health teaching. |
| proposed | Pediatric & Adolescent Health | oral rehydration after vomiting teaching | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03_q3` | dropdown_cloze | The item tests pediatric or adolescent health teaching. |
| proposed | Pediatric & Adolescent Health | oral rehydration volume calculation | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03_q2` | fill_in_blank | The item tests pediatric or adolescent health teaching. |
| proposed | Pediatric & Adolescent Health | pediatric dehydration return precautions | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03_q5` | select_all | The item tests pediatric or adolescent health teaching. |
| proposed | Pediatric & Toddler Safety | pediatric dehydration oral rehydration teaching | `gpt_gap_2026_06_12_nonmcq_balanced_fib_pediatric_ors_07` | fill_in_blank | The item tests toddler-specific safety. |
| unresolved |  | Pacemaker Discharge Teaching | `ekg_b5_sata_06` | select_all | No candidate topic genuinely fits the scoped context. |
| category-untrusted |  | Celiac disease with dermatitis herpetiformis | `gpt_r1_regen_case_celiac_01_q4` | select_all | parent category (Physiological Adaptation) differs from child category (Health Promotion and Maintenance) |
| category-untrusted |  | Celiac disease with dermatitis herpetiformis | `gpt_r1_regen_case_celiac_01_q5` | matrix | parent category (Physiological Adaptation) differs from child category (Health Promotion and Maintenance) |
| category-untrusted |  | COPD discharge teaching | `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q2` | dropdown_cloze | parent category (Safety and Infection Control) differs from child category (Health Promotion and Maintenance) |
| category-untrusted |  | Discharge teaching after C. difficile infection | `gpt_case_opus5_cdi_immunocompromised_01_q6` | multiple_choice | parent category (Safety and Infection Control) differs from child category (Health Promotion and Maintenance) |
| category-untrusted |  | fall prevention plan | `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q5` | matrix | parent category (Reduction of Risk Potential) differs from child category (Health Promotion and Maintenance) |
| category-untrusted |  | family education for delirium prevention | `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q4` | select_all | parent category (Psychosocial Integrity) differs from child category (Health Promotion and Maintenance) |
| category-untrusted |  | family teaching for patient-controlled analgesia safety | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01_q4` | select_all | parent category (Reduction of Risk Potential) differs from child category (Health Promotion and Maintenance) |
| category-untrusted |  | post-sedation discharge teaching comprehension | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q5` | matrix | parent category (Management of Care) differs from child category (Health Promotion and Maintenance) |
| category-untrusted |  | postpartum depression recovery teaching | `opus22_case_postpartum_intrusive_thoughts_01_q5` | select_all | parent category (Psychosocial Integrity) differs from child category (Health Promotion and Maintenance) |
| category-untrusted |  | teach-back discharge education | `opus1_case_tha_discharge_lep_01_q2` | multiple_choice | parent category (Management of Care) differs from child category (Health Promotion and Maintenance) |
| context-incomplete |  | Adult Immunization and Preventive Screening | `claude_cs_jun06_adult_immunization_hpm_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | adult preventive screening | `gpt_case_premium_2026_06_10_case01_preventive_screening` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | adult preventive screening and vaccination counseling | `gpt_case_premium_next_case_preventive_screening_vaccine_05` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Adult preventive screening follow-up navigation | `gpt_case_gap_2026_06_11_case_preventive_screening_navigation_06` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | chronic illness self-management | `gpt_case_premium_2026_06_10_case03_chronic_self_management` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | chronic illness self-management and health literacy | `gpt_case_premium_next_case_health_literacy_diabetes_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Chronic illness self-management with symptom tracking | `gpt_case_gap_2026_06_11_case_chronic_self_management_07` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | pediatric dehydration oral rehydration teaching | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03` |  | id not found in canonical banks; classification skipped |

### Psychosocial Integrity

Rows: 83

| Status | Proposed topic | Old topic | ID | Type | Reason |
|---|---|---|---|---|---|
| proposed | Caregiver Role Strain & Family Coping | analysis of caregiver burden contributing factors | `opus_psi_caregiver_2026_06_10_01b` | dropdown_cloze | The item tests caregiver strain or family coping. |
| proposed | Caregiver Role Strain & Family Coping | Caregiver burden after dementia discharge | `gpt_case_gap_2026_06_11_dementia_burden_part_1_matrix_cues` | matrix | The item tests caregiver strain or family coping. |
| proposed | Caregiver Role Strain & Family Coping | Caregiver burden after dementia discharge | `gpt_case_gap_2026_06_11_dementia_burden_part_2_mc_response` | multiple_choice | The item tests caregiver strain or family coping. |
| proposed | Caregiver Role Strain & Family Coping | Caregiver burden after dementia discharge | `gpt_case_gap_2026_06_11_dementia_burden_part_3_sata_resources` | select_all | The item tests caregiver strain or family coping. |
| proposed | Caregiver Role Strain & Family Coping | Caregiver burden and respite resources | `gpt_gap_2026_06_10_or_caregiver_burden_01` | ordered_response | The item tests caregiver strain or family coping. |
| proposed | Caregiver Role Strain & Family Coping | caregiver burden interventions | `gpt_case_premium_2026_06_10_case02_sata_resources_04` | select_all | The item tests caregiver strain or family coping. |
| proposed | Caregiver Role Strain & Family Coping | Caregiver Role Strain Communication | `gpt_gap_jun11_cloze_caregiver_strain_02` | dropdown_cloze | The item tests caregiver strain or family coping. |
| proposed | Caregiver Role Strain & Family Coping | caregiver support communication | `gpt_case_premium_2026_06_10_case02_cloze_response_03` | dropdown_cloze | The item tests caregiver strain or family coping. |
| proposed | Caregiver Role Strain & Family Coping | Community respite resources for family coping | `gpt_gap_2026_06_10_fib_adult_day_services_08` | fill_in_blank | The item tests caregiver strain or family coping. |
| proposed | Caregiver Role Strain & Family Coping | evaluating outcomes of caregiver support interventions | `opus_psi_caregiver_2026_06_10_01f` | matrix | The item tests caregiver strain or family coping. |
| proposed | Caregiver Role Strain & Family Coping | generating solutions for caregiver respite and community resources | `opus_psi_caregiver_2026_06_10_01e` | matrix | The item tests caregiver strain or family coping. |
| proposed | Caregiver Role Strain & Family Coping | prioritizing caregiver support interventions | `opus_psi_caregiver_2026_06_10_01c` | ordered_response | The item tests caregiver strain or family coping. |
| proposed | Caregiver Role Strain & Family Coping | recognizing cues of caregiver role strain | `opus_psi_caregiver_2026_06_10_01a` | matrix | The item tests caregiver strain or family coping. |
| proposed | Caregiver Role Strain & Family Coping | therapeutic communication with burdened caregiver | `opus_psi_caregiver_2026_06_10_01d` | dropdown_cloze | The item tests caregiver strain or family coping. |
| proposed | Mental Health Disorders | delirium prevention routine | `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q3` | ordered_response | The item tests a mental health condition or symptom cluster. |
| proposed | Mental Health Disorders | delirium risk recognition | `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q1` | matrix | The item tests a mental health condition or symptom cluster. |
| proposed | Mental Health Disorders | delirium versus dementia | `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q2` | dropdown_cloze | The item tests a mental health condition or symptom cluster. |
| proposed | Mental Health Disorders | Mania Milieu Management | `q5_2` | multiple_choice | The item tests a mental health condition or symptom cluster. |
| proposed | Mental Health Disorders | Mania Priority Diagnosis | `q5_1` | multiple_choice | The item tests a mental health condition or symptom cluster. |
| proposed | Mental Health Disorders | Mania Recovery Signs | `q5_5` | multiple_choice | The item tests a mental health condition or symptom cluster. |
| proposed | Substance Use & Withdrawal | Depression and grief safety screening | `gpt_case_gap_2026_06_11_grief_depression_part_2_matrix_cues` | matrix | The item tests substance use or withdrawal. |
| proposed | Suicide & Crisis Intervention | Caregiver burden after dementia discharge | `gpt_case_gap_2026_06_11_dementia_burden_part_4_order_plan` | ordered_response | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | caregiver role strain | `gpt_case_premium_next_case_caregiver_adaptation_dementia_03_cloze_risk` | dropdown_cloze | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | Caregiver strain and family coping in dementia | `gpt_gap_2026_06_10_b_or_dementia_caregiver_strain_02` | ordered_response | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | confidential resource delivery | `gpt_case_premium_next_case_ipv_safety_planning_06_cloze_privacy` | dropdown_cloze | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | Depression and grief safety screening | `gpt_case_gap_2026_06_11_grief_depression_part_1_mc_priority` | multiple_choice | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | Depression and grief safety screening | `gpt_case_gap_2026_06_11_grief_depression_part_3_cloze_plan` | dropdown_cloze | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | Depression and grief safety screening | `gpt_case_gap_2026_06_11_grief_depression_part_4_sata_safety` | select_all | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | Environmental safety sweep for suicide precautions | `opus12_case_inpatient_suicide_risk_01_q3` | matrix | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | Evaluation of ongoing suicide risk and discharge safety planning | `opus12_case_inpatient_suicide_risk_01_q6` | matrix | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | family adaptation planning | `gpt_case_premium_2026_06_10_case02_or_family_plan_05` | ordered_response | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | intimate partner violence cue recognition | `gpt_case_premium_next_case_ipv_safety_planning_06_matrix_cues` | matrix | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | intimate partner violence in prenatal care | `opus27_case_ipv_prenatal_care_01_q1` | multiple_choice | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | intimate partner violence in prenatal care | `opus27_case_ipv_prenatal_care_01_q2` | dropdown_cloze | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | intimate partner violence in prenatal care | `opus27_case_ipv_prenatal_care_01_q3` | multiple_choice | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | intimate partner violence in prenatal care | `opus27_case_ipv_prenatal_care_01_q4` | select_all | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | intimate partner violence in prenatal care | `opus27_case_ipv_prenatal_care_01_q5` | select_all | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | intimate partner violence in prenatal care | `opus27_case_ipv_prenatal_care_01_q6` | multiple_choice | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | Intimate Partner Violence Screening and Support | `claude_cs_jun06_ipv_screening_psi_01_part_1` | select_all | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | Intimate Partner Violence Screening and Support | `claude_cs_jun06_ipv_screening_psi_01_part_2` | multiple_choice | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | Intimate Partner Violence Screening and Support | `claude_cs_jun06_ipv_screening_psi_01_part_3` | multiple_choice | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | Intimate Partner Violence Screening and Support | `claude_cs_jun06_ipv_screening_psi_01_part_4` | matrix | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | IPV safety assessment sequence | `gpt_case_premium_next_case_ipv_safety_planning_06_or_actions` | ordered_response | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | Priority action after suicidal ideation disclosure | `opus12_case_inpatient_suicide_risk_01_q2` | multiple_choice | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | safety plan medication supply calculation | `gpt_case_premium_next_case_ipv_safety_planning_06_fib_gobag` | fill_in_blank | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | Suicide risk cues in hospitalized clients | `opus12_case_inpatient_suicide_risk_01_q1` | select_all | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | therapeutic communication in IPV screening | `gpt_case_premium_next_case_ipv_safety_planning_06_mc_communication` | multiple_choice | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | therapeutic communication with caregiver strain | `gpt_case_premium_next_case_caregiver_adaptation_dementia_03_mc_response` | multiple_choice | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Suicide & Crisis Intervention | Verbal de-escalation during suicide precautions | `opus12_case_inpatient_suicide_risk_01_q4` | multiple_choice | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Therapeutic Communication | Anticipatory Grief Therapeutic Response | `gpt_gap_jun11_cloze_anticipatory_grief_01` | dropdown_cloze | The item tests therapeutic communication or psychosocial support. |
| proposed | Therapeutic Communication | Body Image After Amputation | `gpt_gap_jun11_mc_amputation_body_image_02` | multiple_choice | The item tests therapeutic communication or psychosocial support. |
| proposed | Therapeutic Communication | Body Image Disturbance After Colostomy | `gpt_gap_jun11_mc_colostomy_body_image_01` | multiple_choice | The item tests therapeutic communication or psychosocial support. |
| proposed | Therapeutic Communication | Cultural Beliefs and Treatment Planning | `gpt_gap_jun11_mc_cultural_beliefs_care_03` | multiple_choice | The item tests therapeutic communication or psychosocial support. |
| proposed | Therapeutic Communication | health literacy and adherence evaluation | `gpt_case_premium_2026_06_10_case05_mc_evaluate_05` | multiple_choice | The item tests therapeutic communication or psychosocial support. |
| proposed | Therapeutic Communication | health literacy and medication adherence | `gpt_case_premium_2026_06_10_case05_matrix_understanding_02` | matrix | The item tests therapeutic communication or psychosocial support. |
| proposed | Therapeutic Communication | health literacy and medication adherence | `gpt_case_premium_2026_06_10_case05_mc_assessment_01` | multiple_choice | The item tests therapeutic communication or psychosocial support. |
| proposed | Therapeutic Communication | palliative dyspnea and family coping | `gpt_gap_2026_06_12_nonmcq_balanced_b_cloze_palliative_coping_08` | dropdown_cloze | The item tests therapeutic communication or psychosocial support. |
| proposed | Therapeutic Communication | palliative symptom management and family coping | `gpt_gap_2026_06_12_nonmcq_balanced_cloze_palliative_coping_11` | dropdown_cloze | The item tests therapeutic communication or psychosocial support. |
| proposed | Therapeutic Communication | Spiritual Distress at End of Life | `gpt_gap_jun11_cloze_spiritual_distress_03` | dropdown_cloze | The item tests therapeutic communication or psychosocial support. |
| unresolved |  | caregiver burden and safety cue recognition | `gpt_case_premium_next_case_caregiver_adaptation_dementia_03_matrix_cues` | matrix | No candidate topic genuinely fits the scoped context. |
| unresolved |  | elder neglect recognition | `opus24_case_elder_neglect_med_mismanagement_01_q1` | matrix | No candidate topic genuinely fits the scoped context. |
| unresolved |  | health literacy teaching plan | `gpt_case_premium_2026_06_10_case05_cloze_teaching_03` | dropdown_cloze | No candidate topic genuinely fits the scoped context. |
| unresolved |  | medication adherence support | `gpt_case_premium_2026_06_10_case05_sata_adherence_04` | select_all | No candidate topic genuinely fits the scoped context. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | postpartum depression treatment response | `opus22_case_postpartum_intrusive_thoughts_01_q3` | dropdown_cloze | The item tests postpartum or preeclampsia maternal-newborn care. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | postpartum intrusive thoughts versus psychosis | `opus22_case_postpartum_intrusive_thoughts_01_q1` | matrix | The item tests postpartum or preeclampsia maternal-newborn care. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | therapeutic communication for postpartum intrusive thoughts | `opus22_case_postpartum_intrusive_thoughts_01_q2` | select_all | The item tests postpartum or preeclampsia maternal-newborn care. |
| category-untrusted |  | domestic violence disclosure during child safety planning | `gpt_case_opus23_nat_toddler_01_q3` | select_all | parent category (Management of Care) differs from child category (Psychosocial Integrity) |
| category-untrusted |  | family teaching about delirium recovery | `gpt_2026_06_13_case_delirium_uti_01_q5` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Psychosocial Integrity) |
| category-untrusted |  | lithium toxicity | `opus_case_lithium_toxicity_q6` | select_all | parent category (Pharmacological and Parenteral Therapies) differs from child category (Psychosocial Integrity) |
| category-untrusted |  | ostomy psychosocial adaptation | `gpt_opus21_case_colostomy_lep_discharge_01_q3` | multiple_choice | parent category (Management of Care) differs from child category (Psychosocial Integrity) |
| category-untrusted |  | Psychosocial support and TB adherence planning | `opus25_case_tb_airborne_treatment_monitoring_01_q6` | select_all | parent category (Safety and Infection Control) differs from child category (Psychosocial Integrity) |
| category-untrusted |  | therapeutic communication during eating disorder refeeding | `opus26_case_refeeding_syndrome_01_q4` | select_all | parent category (Physiological Adaptation) differs from child category (Psychosocial Integrity) |
| context-incomplete |  | Bipolar I - Acute Manic Episode | `cs_ngn_005_bipolar` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Caregiver burden after dementia discharge | `gpt_case_gap_2026_06_11_case_dementia_caregiver_burden_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | delirium prevention and family education after hospitalization | `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Depression and grief safety screening | `gpt_case_gap_2026_06_11_case_grief_depression_safety_10` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | elder neglect medication mismanagement | `opus24_case_elder_neglect_med_mismanagement_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | health literacy and medication adherence | `gpt_case_premium_2026_06_10_case05_health_literacy_adherence` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Inpatient suicide risk and safety precautions | `opus12_case_inpatient_suicide_risk_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | intimate partner violence in prenatal care | `opus27_case_ipv_prenatal_care_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | intimate partner violence screening and safety planning | `gpt_case_premium_next_case_ipv_safety_planning_06` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Intimate Partner Violence Screening and Support | `claude_cs_jun06_ipv_screening_psi_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | postpartum depression with intrusive thoughts | `opus22_case_postpartum_intrusive_thoughts_01` |  | id not found in canonical banks; classification skipped |

### Basic Care and Comfort

Rows: 69

| Status | Proposed topic | Old topic | ID | Type | Reason |
|---|---|---|---|---|---|
| proposed | Elimination & Comfort | incontinence-associated dermatitis prevention and skin care | `opus_bcc_rehab_2026_06_10_03` | ordered_response | The item tests elimination or comfort-related care. |
| proposed | Elimination & Comfort | New ostomy discharge teaching with health literacy barriers | `gpt_case_gap_2026_06_11_ostomy_literacy_part_1_cloze_teachback` | dropdown_cloze | The item tests elimination or comfort-related care. |
| proposed | Elimination & Comfort | New ostomy discharge teaching with health literacy barriers | `gpt_case_gap_2026_06_11_ostomy_literacy_part_3_mc_instruction` | multiple_choice | The item tests elimination or comfort-related care. |
| proposed | Elimination & Comfort | New ostomy discharge teaching with health literacy barriers | `gpt_case_gap_2026_06_11_ostomy_literacy_part_4_sata_discharge` | select_all | The item tests elimination or comfort-related care. |
| proposed | Elimination & Comfort | postoperative urinary retention | `io_mc_postop_retention_priority_05` | multiple_choice | The item tests elimination or comfort-related care. |
| proposed | Elimination & Comfort | Postoperative urinary retention | `gpt_gap_jun12_cloze_postop_urinary_retention_01` | dropdown_cloze | The item tests elimination or comfort-related care. |
| proposed | Elimination & Comfort | pressure injury prevention in rehabilitation | `gpt_case_premium_2026_06_10_case04_matrix_risk_01` | matrix | The item tests elimination or comfort-related care. |
| proposed | Elimination & Comfort | Pressure Injury Staging and Prevention | `claude_cs_jun06_pressure_injury_bcc_01_part_2` | select_all | The item tests elimination or comfort-related care. |
| proposed | Mobility & Immobility | Hospital-acquired constipation management | `gpt_gap_jun12_or_constipation_management_01` | ordered_response | The item tests mobility, transfer, or immobility care. |
| proposed | Mobility & Immobility | mobility assistance and fall prevention with assistive devices | `opus_bcc_rehab_2026_06_10_05` | matrix | The item tests mobility, transfer, or immobility care. |
| proposed | Mobility & Immobility | pressure injury and comfort risk recognition | `gpt_case_premium_next_case_rehab_pressure_bowel_02_matrix_risk` | matrix | The item tests mobility, transfer, or immobility care. |
| proposed | Mobility & Immobility | pressure injury prevention in rehabilitation | `gpt_case_premium_2026_06_10_case04_sata_prevention_04` | select_all | The item tests mobility, transfer, or immobility care. |
| proposed | Mobility & Immobility | pressure injury prevention interventions | `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q4` | select_all | The item tests mobility, transfer, or immobility care. |
| proposed | Mobility & Immobility | pressure injury prevention plan | `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q2` | dropdown_cloze | The item tests mobility, transfer, or immobility care. |
| proposed | Mobility & Immobility | pressure injury risk assessment | `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q1` | matrix | The item tests mobility, transfer, or immobility care. |
| proposed | Mobility & Immobility | pressure injury risk factor identification in rehabilitation | `opus_bcc_rehab_2026_06_10_01` | matrix | The item tests mobility, transfer, or immobility care. |
| proposed | Mobility & Immobility | Rehabilitation mobility progression and fall prevention | `gpt_case_gap_2026_06_11_rehab_fall_part_1_order_mobility` | ordered_response | The item tests mobility, transfer, or immobility care. |
| proposed | Mobility & Immobility | Rehabilitation mobility progression and fall prevention | `gpt_case_gap_2026_06_11_rehab_fall_part_3_cloze_risk` | dropdown_cloze | The item tests mobility, transfer, or immobility care. |
| proposed | Mobility & Immobility | Rehabilitation mobility progression and fall prevention | `gpt_case_gap_2026_06_11_rehab_fall_part_4_sata_teaching` | select_all | The item tests mobility, transfer, or immobility care. |
| proposed | Mobility & Immobility | repositioning and skin care | `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q3` | ordered_response | The item tests mobility, transfer, or immobility care. |
| proposed | Mobility & Immobility | repositioning schedule and surface selection for pressure injury prevention | `opus_bcc_rehab_2026_06_10_02` | dropdown_cloze | The item tests mobility, transfer, or immobility care. |
| proposed | Mobility & Immobility | stroke rehabilitation progression with aspiration precautions | `gpt_gap_2026_06_12_nonmcq_balanced_matrix_stroke_aspiration_rehab_10` | matrix | The item tests mobility, transfer, or immobility care. |
| proposed | Mobility & Immobility | stroke rehabilitation with aspiration precautions | `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_stroke_rehab_10` | matrix | The item tests mobility, transfer, or immobility care. |
| proposed | Nutritional & Fluid Support | dehydration fluid deficit cues | `io_sata_gastroenteritis_deficit_03` | select_all | The item tests nutritional or fluid support. |
| proposed | Nutritional & Fluid Support | Dysphagia Mealtime Assistance | `gpt_gap_jun11_or_dysphagia_mealtime_02` | ordered_response | The item tests nutritional or fluid support. |
| proposed | Nutritional & Fluid Support | enteral feeding pump monitoring | `dev_enteral_volume_shift_01` | fill_in_blank | The item tests nutritional or fluid support. |
| proposed | Nutritional & Fluid Support | Enteral feeding tolerance monitoring | `gpt_gap_jun12_fib_enteral_feeding_tolerance_01` | fill_in_blank | The item tests nutritional or fluid support. |
| proposed | Nutritional & Fluid Support | intake and output net balance | `gpt_visual_smoke_2026_06_12_fib_io_net_balance_04` | fill_in_blank | The item tests nutritional or fluid support. |
| proposed | Nutritional & Fluid Support | intake and output total verification | `gpt_visual_smoke_2026_06_12_matrix_io_totals_06` | matrix | The item tests nutritional or fluid support. |
| proposed | Nutritional & Fluid Support | intake calculation for bowel and bladder planning | `gpt_case_premium_next_case_rehab_pressure_bowel_02_fib_intake` | fill_in_blank | The item tests nutritional or fluid support. |
| proposed | Nutritional & Fluid Support | Oral Care for Xerostomia | `gpt_gap_jun11_or_oral_care_xerostomia_03` | ordered_response | The item tests nutritional or fluid support. |
| proposed | Nutritional & Fluid Support | Post-stroke outpatient rehabilitation and safe feeding | `gpt_case_gap_2026_06_11_post_stroke_rehab_part_1_matrix_cues` | matrix | The item tests nutritional or fluid support. |
| proposed | Nutritional & Fluid Support | Post-stroke outpatient rehabilitation and safe feeding | `gpt_case_gap_2026_06_11_post_stroke_rehab_part_2_order_feeding` | ordered_response | The item tests nutritional or fluid support. |
| proposed | Nutritional & Fluid Support | Post-stroke outpatient rehabilitation and safe feeding | `gpt_case_gap_2026_06_11_post_stroke_rehab_part_3_sata_teaching` | select_all | The item tests nutritional or fluid support. |
| proposed | Sleep & Rest | Peripheral IV phlebitis response | `gpt_gap_jun12_matrix_iv_phlebitis_01` | matrix | The item tests sleep or rest support. |
| proposed | Sleep & Rest | pressure injury prevention bundle | `gpt_case_premium_next_case_rehab_pressure_bowel_02_cloze_skin` | dropdown_cloze | The item tests sleep or rest support. |
| proposed | Sleep & Rest | pressure injury prevention in rehabilitation | `gpt_case_premium_2026_06_10_case04_or_heel_action_05` | ordered_response | The item tests sleep or rest support. |
| proposed | Sleep & Rest | Pressure Injury Staging and Prevention | `claude_cs_jun06_pressure_injury_bcc_01_part_3` | select_all | The item tests sleep or rest support. |
| proposed | Sleep & Rest | pressure injury wound area trend | `gpt_gap_2026_06_12_nonmcq_balanced_b_fib_pressure_area_trend_06` | fill_in_blank | The item tests sleep or rest support. |
| proposed | Sleep & Rest | protein intake calculation for pressure injury prevention | `opus_bcc_rehab_2026_06_10_04` | fill_in_blank | The item tests sleep or rest support. |
| proposed | Sleep & Rest | Rehabilitation mobility progression and fall prevention | `gpt_case_gap_2026_06_11_rehab_fall_part_2_matrix_plan` | matrix | The item tests sleep or rest support. |
| proposed | Sleep & Rest | Safe mobility progression in rehabilitation | `gpt_gap_2026_06_10_or_mobility_progression_03` | ordered_response | The item tests sleep or rest support. |
| proposed | Sleep & Rest | Wheelchair-to-bed transfer in rehabilitation | `gpt_gap_2026_06_10_b_or_wheelchair_transfer_03` | ordered_response | The item tests sleep or rest support. |
| unresolved |  | Home skin inspection for pressure injury prevention | `gpt_gap_2026_06_10_fib_daily_skin_inspection_07` | fill_in_blank | The item tests skin/wound care, and no licensed candidate genuinely fits. |
| unresolved |  | Nonpharmacological Musculoskeletal Pain Management | `gpt_gap_jun11_or_nonpharm_pain_01` | ordered_response | The item tests skin/wound care, and no licensed candidate genuinely fits. |
| unresolved |  | pressure injury prevention in rehabilitation | `gpt_case_premium_2026_06_10_case04_cloze_stage1_02` | dropdown_cloze | The item tests skin/wound care, and no licensed candidate genuinely fits. |
| unresolved |  | pressure injury prevention in rehabilitation | `gpt_case_premium_2026_06_10_case04_mc_first_action_03` | multiple_choice | The item tests skin/wound care, and no licensed candidate genuinely fits. |
| unresolved |  | pressure injury staging and evaluation of wound healing | `opus_bcc_rehab_2026_06_10_06` | ordered_response | The item tests skin/wound care, and no licensed candidate genuinely fits. |
| unresolved |  | Pressure Injury Staging and Prevention | `claude_cs_jun06_pressure_injury_bcc_01_part_4` | multiple_choice | The item tests skin/wound care, and no licensed candidate genuinely fits. |
| unresolved |  | Repositioning schedule for pressure injury prevention | `gpt_gap_2026_06_10_b_fib_bed_repositioning_08` | fill_in_blank | The item tests skin/wound care, and no licensed candidate genuinely fits. |
| blocked-cross-category | Burn Management | adult Rule of Nines TBSA estimation | `gpt_visual_smoke_2026_06_12_mc_burn_tbsa_02` | multiple_choice | The item tests burn assessment or burn-fluid management. |
| blocked-cross-category | Burn Management | New ostomy discharge teaching with health literacy barriers | `gpt_case_gap_2026_06_11_ostomy_literacy_part_2_matrix_findings` | matrix | The item tests burn assessment or burn-fluid management. |
| blocked-cross-category | Burn Management | Pressure Injury Staging and Prevention | `claude_cs_jun06_pressure_injury_bcc_01_part_1` | matrix | The item tests burn assessment or burn-fluid management. |
| category-untrusted |  | C. difficile colitis and dehydration | `opus20_case_cdiff_01_q4` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Basic Care and Comfort) |
| category-untrusted |  | complication prevention in delirium | `gpt_2026_06_13_case_delirium_uti_01_q6` | select_all | parent category (Physiological Adaptation) differs from child category (Basic Care and Comfort) |
| category-untrusted |  | early refeeding gastrointestinal discomfort | `opus26_case_refeeding_syndrome_01_q2` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Basic Care and Comfort) |
| category-untrusted |  | Mania Nutritional Support | `q5_3` | multiple_choice | parent category (Psychosocial Integrity) differs from child category (Basic Care and Comfort) |
| category-untrusted |  | Mucositis TPN and CRBSI | `opus_tpn_case_mucositis_01_q4` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Basic Care and Comfort) |
| category-untrusted |  | Mucositis TPN and CRBSI | `opus_tpn_case_mucositis_01_q6` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Basic Care and Comfort) |
| category-untrusted |  | Nutrition in acute pancreatitis | `gpt_case_gallstone_pancreatitis_01_q5` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Basic Care and Comfort) |
| category-untrusted |  | warfarin-enoxaparin-bridge | `opus_case_warfarin_bridge_q5` | multiple_choice | parent category (Pharmacological and Parenteral Therapies) differs from child category (Basic Care and Comfort) |
| category-untrusted |  | wound-care teach-back failure | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q2` | dropdown_cloze | parent category (Reduction of Risk Potential) differs from child category (Basic Care and Comfort) |
| context-incomplete |  | New ostomy discharge teaching with health literacy barriers | `gpt_case_gap_2026_06_11_case_ostomy_health_literacy_02` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Post-stroke outpatient rehabilitation and safe feeding | `gpt_case_gap_2026_06_11_case_post_stroke_outpatient_rehab_09` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | pressure injury prevention in rehabilitation | `gpt_case_premium_2026_06_10_case04_pressure_injury_rehab` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | pressure injury prevention with poor nutrition | `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Pressure Injury Staging and Prevention | `claude_cs_jun06_pressure_injury_bcc_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Rehabilitation mobility progression and fall prevention | `gpt_case_gap_2026_06_11_case_rehab_mobility_falls_03` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | rehabilitation pressure injury prevention and bowel management | `gpt_case_premium_next_case_rehab_pressure_bowel_02` |  | id not found in canonical banks; classification skipped |

### Pharmacological and Parenteral Therapies

Rows: 123

| Status | Proposed topic | Old topic | ID | Type | Reason |
|---|---|---|---|---|---|
| proposed | Anticoagulant Therapy | anticoagulant administration safety | `mar_enoxaparin_prior_held_03` | multiple_choice | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | aPTT trend and heparin infusion safety | `gpt_u3_labtrend_2026_06_09_b_mc_ptt_heparin_infusion_02` | multiple_choice | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | Atrial Fibrillation Anticoagulation | `ekg_b2_mc_02` | multiple_choice | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | Atrial Fibrillation Rate Control | `ekg_b2_mc_08` | multiple_choice | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | Heparin infusion adverse effects and monitoring | `gpt_u6_matrix_cloze_2026_06_09_matrix_heparin_safety_11` | matrix | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | heparin infusion calculation | `medlbl_heparin_infusion_rate_001` | fill_in_blank | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | heparin infusion rate calculation from label | `gpt_visual_smoke_2026_06_12_fib_medlabel_heparin_rate_07` | fill_in_blank | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | INR trend after medication interaction | `gpt_u3_labtrend_2026_06_09_b_cloze_inr_amiodarone_09` | dropdown_cloze | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | INR trend and anticoagulant safety | `gpt_u3_labtrend_2026_06_09_matrix_inr_platelets_warfarin_05` | matrix | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | IV vitamin K and PCC administration safety | `gpt_case_warfarin_mvr_2026_06_11_01_q5` | select_all | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | opioid-induced respiratory depression | `opus2_case_postop_opioid_respiratory_depression_01_q1` | matrix | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | platelet trend and heparin safety | `gpt_u3_labtrend_2026_06_09_b_mc_platelets_heparin_01` | multiple_choice | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | vitamin K route and dose selection | `gpt_case_warfarin_mvr_2026_06_11_01_q3` | dropdown_cloze | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | warfarin hold and clarify | `gpt_case_warfarin_mvr_2026_06_11_01_q1` | multiple_choice | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | warfarin interaction monitoring | `mar_warfarin_antibiotic_bleeding_06` | multiple_choice | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | warfarin NSAID interaction teaching | `gpt_case_warfarin_mvr_2026_06_11_01_q2` | select_all | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | warfarin-enoxaparin-bridge | `opus_case_warfarin_bridge_q1` | multiple_choice | The item tests anticoagulant therapy or complications. |
| proposed | Cardiovascular & Endocrine Medications | First-Degree AV Block Management | `ekg_b3_mc_02` | multiple_choice | The item tests cardiovascular or endocrine medication therapy. |
| proposed | Cardiovascular & Endocrine Medications | medication administration safety | `mar_av_nodal_blockers_1600_01` | multiple_choice | The item tests cardiovascular or endocrine medication therapy. |
| proposed | Dosage Calculations | ACE inhibitor safety in acute kidney injury | `opus_vanco_case_01_q6_lisinopril_aki` | multiple_choice | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | Atropine Administration | `ekg_b1_mc_04` | multiple_choice | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | Beta Blocker Overdose | `ekg_b1_mc_05` | multiple_choice | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | cardiac glycoside tablet calculation | `medlbl_digoxin_tablets_005` | fill_in_blank | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | digoxin administration assessment | `mar_digoxin_low_pulse_due_08` | matrix | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | Digoxin Toxicity | `ekg_b5_mc_02` | multiple_choice | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | Immune Checkpoint Inhibitor Myocarditis | `opus_icit_case_01_q1` | multiple_choice | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | Immune Checkpoint Inhibitor Myocarditis | `opus_icit_case_01_q6` | matrix | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | IV diuretic dose volume verification | `medlbl_furosemide_matrix_007` | matrix | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | IV potassium rate calculation | `opus3_iv_potassium_safety_case_01_q3` | fill_in_blank | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | monitoring after naloxone reversal | `opus2_case_postop_opioid_respiratory_depression_01_q5` | multiple_choice | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | opioid and benzodiazepine coadministration | `mar_opioid_benzodiazepine_due_05` | multiple_choice | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | opioid dose volume calculation | `medlbl_morphine_iv_volume_002` | multiple_choice | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | opioid respiratory depression risk reduction | `opus2_case_postop_opioid_respiratory_depression_01_q6` | select_all | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | opioid-induced respiratory depression | `opus2_case_postop_opioid_respiratory_depression_01_q2` | select_all | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | oral antibiotic capsule calculation | `medlbl_cephalexin_capsules_006` | multiple_choice | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | patient-controlled analgesia documentation | `dev_pca_delivered_total_basal_01` | fill_in_blank | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | patient-controlled analgesia dose limits | `dev_pca_max_dose_basal_01` | fill_in_blank | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | potassium trend and loop diuretic safety | `gpt_u3_labtrend_2026_06_09_mc_potassium_furosemide_01` | multiple_choice | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | rapid-acting insulin administration | `mar_lispro_meal_delayed_02` | select_all | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | rising creatinine and nephrotoxic medication | `gpt_u3_labtrend_2026_06_09_mc_creatinine_gentamicin_03` | multiple_choice | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | Safe IV potassium administration | `opus3_iv_potassium_safety_case_01_q5` | select_all | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | safe opioid administration and reassessment | `gpt_gap_2026_06_12_nonmcq_balanced_matrix_opioid_sedation_05` | matrix | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | Stable Ventricular Tachycardia | `ekg_b4_mc_05` | multiple_choice | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | titrated naloxone dosing | `opus2_case_postop_opioid_respiratory_depression_01_q4` | dropdown_cloze | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | vancomycin adverse reaction documentation | `opus_vanco_case_01_q2_documentation_cloze` | dropdown_cloze | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | vancomycin flushing syndrome | `opus_vanco_case_01_q1_infusion_reaction` | multiple_choice | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | vancomycin nephrotoxicity recognition | `opus_vanco_case_01_q5_aki_cue_matrix` | matrix | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | Vancomycin toxicity monitoring | `gpt_u6_matrix_cloze_2026_06_09_matrix_vancomycin_monitoring_01` | matrix | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | vancomycin trough dose clarification | `opus_vanco_case_01_q3_supratherapeutic_trough_order` | ordered_response | The item calculates a medication dose or medication infusion quantity. |
| proposed | Laboratory & Diagnostic Tests | Hypokalemia cue recognition | `opus3_iv_potassium_safety_case_01_q1` | matrix | The item uses laboratory monitoring to guide therapy. |
| proposed | Medication Safety & Admin | acetaminophen duplicate therapy | `mar_acetaminophen_duplicate_products_04` | multiple_choice | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | Adenosine Administration Technique | `ekg_b2_mc_05` | multiple_choice | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | Albuterol Side Effects | `ekg_b1_mc_10` | multiple_choice | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | anaphylaxis | `cap_10` | multiple_choice | The item tests safe parenteral medication route or injection technique. |
| proposed | Medication Safety & Admin | antipyretic therapy | `vit_08` | multiple_choice | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | high-alert infusion pump verification | `dev_high_alert_kcl_pump_mismatch_01` | select_all | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | Immune Checkpoint Inhibitor Myocarditis | `opus_icit_case_01_q5` | multiple_choice | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | naloxone escalation for opioid respiratory depression | `opus2_case_postop_opioid_respiratory_depression_01_q3` | multiple_choice | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | NMS Antidote | `q9_3` | multiple_choice | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | opioid-induced respiratory depression | `hl_smoke_2026_06_14_opioid_sedation_02` | highlight | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | Pain Management & Opioid Safety | `claude_jun05_pharm_pca_opioid_safety_04` | multiple_choice | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | patient-controlled analgesia safety | `dev_pca_basal_opioid_naive_01` | multiple_choice | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | potassium chloride infusion calculation | `medlbl_potassium_chloride_rate_003` | fill_in_blank | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | Potassium replacement safety sequence | `opus3_iv_potassium_safety_case_01_q4` | ordered_response | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | regular insulin dose volume calculation | `medlbl_regular_insulin_volume_008` | fill_in_blank | The item tests safe parenteral medication route or injection technique. |
| proposed | Medication Safety & Admin | subcutaneous anticoagulant dose volume | `medlbl_enoxaparin_volume_004` | multiple_choice | The item tests safe parenteral medication route or injection technique. |
| proposed | Medication Safety & Admin | Theophylline therapeutic drug monitoring | `gpt_u6_matrix_cloze_2026_06_09_cloze_theophylline_toxicity_16` | dropdown_cloze | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | Unsafe IV potassium order clarification | `opus3_iv_potassium_safety_case_01_q2` | multiple_choice | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | vancomycin ototoxicity monitoring | `opus_vanco_case_01_q4_ototoxicity_screening` | select_all | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | warfarin-enoxaparin-bridge | `opus_case_warfarin_bridge_q3` | multiple_choice | The item tests safe parenteral medication route or injection technique. |
| proposed | Psychotropic Medications | lithium toxicity | `opus_case_lithium_toxicity_bowtie` | bowtie | The item tests psychotropic medication therapy. |
| proposed | Psychotropic Medications | lithium toxicity | `opus_case_lithium_toxicity_q1` | multiple_choice | The item tests psychotropic medication therapy. |
| proposed | Psychotropic Medications | lithium toxicity | `opus_case_lithium_toxicity_q4` | multiple_choice | The item tests psychotropic medication therapy. |
| proposed | Psychotropic Medications | Lithium toxicity and therapeutic monitoring | `gpt_u6_matrix_cloze_2026_06_09_cloze_lithium_toxicity_06` | dropdown_cloze | The item tests psychotropic medication therapy. |
| unresolved |  | Adenosine Side Effects | `ekg_b2_sata_06` | select_all | No candidate topic genuinely fits the scoped context. |
| unresolved |  | fluid resuscitation | `vit_04` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Hyperthermic Syndrome Interventions | `q9_4` | select_all | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Serotonin Syndrome Recognition | `q9_1` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | SS vs NMS Distinction | `q9_2` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| blocked-cross-category | Burn Management | Potassium infusion IV-site complication | `opus3_iv_potassium_safety_case_01_q6` | multiple_choice | The item tests burn assessment or burn-fluid management. |
| category-untrusted |  | Acute Graft-Versus-Host Disease | `opus_agvd_case_agvhd_01_q4` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Anti-tuberculosis hepatotoxicity monitoring | `opus25_case_tb_airborne_treatment_monitoring_01_q5` | multiple_choice | parent category (Safety and Infection Control) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | anticoagulant medication reconciliation | `opus1_case_discharge_med_rec_anticoag_01_q2` | multiple_choice | parent category (Management of Care) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Antimotility agents in suspected C. difficile infection | `gpt_case_opus5_cdi_immunocompromised_01_q1` | multiple_choice | parent category (Safety and Infection Control) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Atropine Evaluation | `q2_5` | multiple_choice | parent category (Safety and Infection Control) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | C. difficile colitis and dehydration | `opus20_case_cdiff_01_q5` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Cardiac Arrest Pharmacotherapy | `cs_stemi_vfib_04_part_3` | matrix | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Chronic corticosteroid tapering | `opus25_case_tb_airborne_treatment_monitoring_01_q4` | dropdown_cloze | parent category (Safety and Infection Control) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Cryoprecipitate Role | `q7_3` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | diuretic potassium safety | `opus24_case_elder_neglect_med_mismanagement_01_q2` | multiple_choice | parent category (Psychosocial Integrity) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Diuretic Therapy Evaluation | `cs_adhf_pulm_edema_01_part_4` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Ethambutol baseline assessment | `opus25_case_tb_airborne_treatment_monitoring_01_q3` | multiple_choice | parent category (Safety and Infection Control) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | GBS treatment plan and respiratory thresholds | `gpt_case_gbs_respiratory_compromise_01_q4` | select_all | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | haloperidol safety in delirium | `gpt_2026_06_13_case_delirium_uti_01_q3` | select_all | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Late postpartum preeclampsia with severe features | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q4` | multiple_choice | parent category (Reduction of Risk Potential) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Late postpartum preeclampsia with severe features | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q5` | select_all | parent category (Reduction of Risk Potential) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Mania Medications | `q5_4` | select_all | parent category (Psychosocial Integrity) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | metformin discharge teaching | `gpt_opus21_case_colostomy_lep_discharge_01_q5` | dropdown_cloze | parent category (Management of Care) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | metformin renal safety | `opus24_case_elder_neglect_med_mismanagement_01_q5` | multiple_choice | parent category (Psychosocial Integrity) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Mucositis TPN and CRBSI | `opus_tpn_case_mucositis_01_q2` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | opioid reassessment after IV dose | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01_q2` | dropdown_cloze | parent category (Reduction of Risk Potential) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Oral vancomycin route for C. difficile infection | `gpt_case_opus5_cdi_immunocompromised_01_q3` | dropdown_cloze | parent category (Safety and Infection Control) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Organophosphate Antidotes | `q2_4` | select_all | parent category (Safety and Infection Control) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Osmotic Diuretic Priority | `q6_3` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Postoperative pulmonary embolism with right ventricular strain | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q4` | select_all | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Postoperative pulmonary embolism with right ventricular strain | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q5` | select_all | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Prerenal acute kidney injury with hyperkalemia | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q2` | select_all | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Prerenal acute kidney injury with hyperkalemia | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q4` | dropdown_cloze | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Prerenal acute kidney injury with hyperkalemia | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q5` | select_all | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | rivaroxaban renal function monitoring | `opus1_case_tha_discharge_lep_01_q4` | matrix | parent category (Management of Care) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | safe IV potassium administration | `opus24_case_elder_neglect_med_mismanagement_01_q4` | select_all | parent category (Psychosocial Integrity) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | status epilepticus | `opus_case_se_01_q3` | select_all | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Thyroid Storm Pharmacology Sequence | `cs_thyroid_storm_q2` | ordered_response | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | Vasopressor Titration | `cs_sepsis_shock_01_part_4` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Pharmacological and Parenteral Therapies) |
| category-untrusted |  | warfarin discharge teaching | `opus1_case_discharge_med_rec_anticoag_01_q5` | dropdown_cloze | parent category (Management of Care) differs from child category (Pharmacological and Parenteral Therapies) |
| context-incomplete |  | Immune Checkpoint Inhibitor Myocarditis | `opus_icit_case_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | IV potassium replacement safety | `opus3_iv_potassium_safety_case_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | lithium toxicity | `opus_case_lithium_toxicity_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | opioid-induced respiratory depression | `opus2_case_postop_opioid_respiratory_depression_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Serotonin Syndrome vs. NMS | `cs_ngn_009_serotonin` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | vancomycin infusion reaction and nephrotoxicity | `opus_vanco_case_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | warfarin reversal in mechanical mitral valve bleeding | `gpt_case_warfarin_mvr_2026_06_11_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | warfarin-enoxaparin-bridge | `opus_case_warfarin_bridge_01` |  | id not found in canonical banks; classification skipped |

### Reduction of Risk Potential

Rows: 130

| Status | Proposed topic | Old topic | ID | Type | Reason |
|---|---|---|---|---|---|
| proposed | Laboratory & Diagnostic Tests | Acute decompensated heart failure | `gpt_case_gap_2026_06_11_adhf_matrix_01` | matrix | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Acute ischemic stroke thrombolysis and thrombectomy complications | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q1` | matrix | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Acute ischemic stroke thrombolysis and thrombectomy complications | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q2` | dropdown_cloze | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Acute ischemic stroke thrombolysis and thrombectomy complications | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q3` | multiple_choice | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Acute ischemic stroke thrombolysis and thrombectomy complications | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q6` | select_all | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Acute kidney injury | `gpt_case_gap_2026_06_11_aki_matrix_01` | matrix | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Acute pancreatitis complications | `gpt_case_gap_2026_06_11_panc_matrix_01` | matrix | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Adrenal crisis | `gpt_case_gap_2026_06_11_adrenal_matrix_01` | matrix | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Adrenal crisis complications | `gpt_case_gap_2026_06_11_adrenal_cloze_02` | dropdown_cloze | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Anticoagulation bleeding complication | `gpt_case_gap_2026_06_11_anticoag_cloze_02` | dropdown_cloze | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | CAR-T cytokine release syndrome and ICANS monitoring | `opus_car_t_crs_2026_06_11_case_01_q4` | matrix | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | creatinine trend calculation in AKI | `gpt_u3_labtrend_2026_06_09_b_fib_creatinine_increase_10` | fill_in_blank | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | falling WBC trend and infection precautions | `gpt_u3_labtrend_2026_06_09_b_matrix_neutropenia_wbc_05` | matrix | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Heparin monitoring complication | `gpt_case_gap_2026_06_11_anticoag_matrix_01` | matrix | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | patient-controlled analgesia dose limits | `dev_pca_lockout_max_demands_01` | fill_in_blank | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Platelet decline on heparin | `gpt_case_gap_2026_06_11_anticoag_fib_04` | fill_in_blank | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | post-fall neurologic monitoring | `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q2` | matrix | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | PVC Clinical Etiology | `ekg_b4_mc_02` | multiple_choice | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | renal laboratory response to fluid therapy | `gpt_u3_labtrend_2026_06_09_or_aki_fluid_response_07` | ordered_response | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Rhabdomyolysis and acute kidney injury prevention | `gpt_u6_matrix_cloze_2026_06_09_cloze_rhabdomyolysis_aki_08` | dropdown_cloze | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Shock risk in acute pancreatitis | `gpt_case_gap_2026_06_11_panc_cloze_02` | dropdown_cloze | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | tumor lysis syndrome | `gpt_case_gap_2026_06_11_case_tls_01_q1` | matrix | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Urine output evaluation in pancreatitis | `gpt_case_gap_2026_06_11_panc_fib_04` | fill_in_blank | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | wound measurement area trend | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q4` | fill_in_blank | The item tests laboratory or diagnostic result interpretation. |
| proposed | Perioperative Care | Chest Tube Management | `claude_cs_jun06_chest_tube_rrp_01_part_1` | matrix | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Perioperative Care | Chest Tube Management | `claude_cs_jun06_chest_tube_rrp_01_part_2` | multiple_choice | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Perioperative Care | Chest Tube Management | `claude_cs_jun06_chest_tube_rrp_01_part_3` | multiple_choice | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Perioperative Care | Chest Tube Management | `claude_cs_jun06_chest_tube_rrp_01_part_4` | multiple_choice | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Perioperative Care | intake and output net balance | `gpt_gap_2026_06_12_nonmcq_balanced_b_fib_io_balance_05` | fill_in_blank | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Perioperative Care | intake and output output total | `gpt_visual_smoke_2026_06_12_mc_io_output_total_05` | multiple_choice | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Perioperative Care | IV opioid reassessment timing | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01_q5` | fill_in_blank | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Perioperative Care | opioid oversedation response sequence | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01_q3` | ordered_response | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Perioperative Care | opioid respiratory depression risk cues | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01_q1` | matrix | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Perioperative Care | patient-controlled analgesia documentation | `dev_pca_delivered_total_no_basal_01` | fill_in_blank | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Perioperative Care | Post-thyroidectomy complication recognition | `gpt_u6_matrix_cloze_2026_06_09_matrix_post_thyroidectomy_complications_03` | matrix | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Perioperative Care | Postoperative drain output monitoring | `gpt_gap_jun12_fib_drain_monitoring_01` | fill_in_blank | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Perioperative Care | postoperative hemoglobin trend calculation | `gpt_u3_labtrend_2026_06_09_fib_hemoglobin_drop_10` | fill_in_blank | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Perioperative Care | postoperative output calculation | `io_fib_postop_output_total_06` | fill_in_blank | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Perioperative Care | Postoperative VTE prophylaxis | `gpt_gap_jun12_cloze_vte_prophylaxis_01` | dropdown_cloze | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Perioperative Care | wound infection escalation in home health | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q3` | multiple_choice | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Procedural Complications & Dialysis | Acute ischemic stroke thrombolysis and thrombectomy complications | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q5` | select_all | The item tests complications of procedures, devices, or dialysis-related care. |
| proposed | Procedural Complications & Dialysis | Blood transfusion reaction response | `gpt_gap_jun12_or_transfusion_reaction_01` | ordered_response | The item tests complications of procedures, devices, or dialysis-related care. |
| proposed | Procedural Complications & Dialysis | Compartment syndrome after extremity injury | `gpt_u6_matrix_cloze_2026_06_09_matrix_compartment_syndrome_12` | matrix | The item tests complications of procedures, devices, or dialysis-related care. |
| proposed | Procedural Complications & Dialysis | endotracheal intubation | `cap_02` | multiple_choice | The item tests complications of procedures, devices, or dialysis-related care. |
| proposed | Procedural Complications & Dialysis | Post-thoracentesis assessment | `gpt_gap_jun12_fib_thoracentesis_assessment_01` | fill_in_blank | The item tests complications of procedures, devices, or dialysis-related care. |
| unresolved |  | Acute ischemic stroke thrombolysis and thrombectomy complications | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_bowtie` | bowtie | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Acute ischemic stroke thrombolysis and thrombectomy complications | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q4` | select_all | No candidate topic genuinely fits the scoped context. |
| unresolved |  | acute kidney injury and hyperkalemia | `hl_smoke_2026_06_14_aki_hyperkalemia_01` | highlight | No candidate topic genuinely fits the scoped context. |
| unresolved |  | acute kidney injury fluid response | `io_matrix_prerenal_aki_recheck_04` | matrix | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Acute pulmonary edema in heart failure | `gpt_case_gap_2026_06_11_adhf_cloze_02` | dropdown_cloze | No candidate topic genuinely fits the scoped context. |
| unresolved |  | bowel preparation fluid deficit | `io_matrix_bowel_prep_deficit_08` | matrix | No candidate topic genuinely fits the scoped context. |
| unresolved |  | CAR-T cytokine release syndrome and ICANS monitoring | `opus_car_t_crs_2026_06_11_case_01_q1` | matrix | No candidate topic genuinely fits the scoped context. |
| unresolved |  | CAR-T cytokine release syndrome and ICANS monitoring | `opus_car_t_crs_2026_06_11_case_01_q2` | select_all | No candidate topic genuinely fits the scoped context. |
| unresolved |  | CAR-T cytokine release syndrome and ICANS monitoring | `opus_car_t_crs_2026_06_11_case_01_q3` | ordered_response | No candidate topic genuinely fits the scoped context. |
| unresolved |  | CAR-T cytokine release syndrome and ICANS monitoring | `opus_car_t_crs_2026_06_11_case_01_q5` | dropdown_cloze | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Evaluating diuretic response | `gpt_case_gap_2026_06_11_adhf_fib_04` | fill_in_blank | No candidate topic genuinely fits the scoped context. |
| unresolved |  | falling hemoglobin trend and suspected bleeding | `gpt_u3_labtrend_2026_06_09_b_or_gi_bleed_hgb_06` | ordered_response | No candidate topic genuinely fits the scoped context. |
| unresolved |  | falling magnesium trend | `gpt_u3_labtrend_2026_06_09_cloze_magnesium_decline_08` | dropdown_cloze | No candidate topic genuinely fits the scoped context. |
| unresolved |  | fluid balance monitoring | `io_fib_hf_net_balance_01` | fill_in_blank | No candidate topic genuinely fits the scoped context. |
| unresolved |  | home health wound-care teaching with teach-back failure | `gpt_gap_2026_06_12_nonmcq_balanced_fib_wound_teachback_12` | fill_in_blank | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Hyperkalemia in acute kidney injury | `gpt_case_gap_2026_06_11_aki_cloze_02` | dropdown_cloze | No candidate topic genuinely fits the scoped context. |
| unresolved |  | increased intracranial pressure | `vit_05` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | infusion pump time verification | `dev_infusion_duration_vtbi_01` | fill_in_blank | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Mean arterial pressure in shock | `gpt_case_gap_2026_06_11_adrenal_fib_04` | fill_in_blank | No candidate topic genuinely fits the scoped context. |
| unresolved |  | new-onset atrial fibrillation | `rhy_afib_001` | matrix | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Oliguria in acute kidney injury | `gpt_case_gap_2026_06_11_aki_fib_04` | fill_in_blank | No candidate topic genuinely fits the scoped context. |
| unresolved |  | post-fall assessment | `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q1` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | rapid sodium correction trend | `gpt_u3_labtrend_2026_06_09_b_cloze_sodium_overcorrection_08` | dropdown_cloze | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Transfusion-related acute lung injury response | `gpt_u6_matrix_cloze_2026_06_09_cloze_transfusion_trali_09` | dropdown_cloze | No candidate topic genuinely fits the scoped context. |
| unresolved |  | tumor lysis syndrome urine output monitoring | `gpt_case_gap_2026_06_11_case_tls_01_q4` | fill_in_blank | No candidate topic genuinely fits the scoped context. |
| blocked-cross-category | Burn Management | adult burn posterior surface TBSA | `burn_mc_posterior_tbsa_07` | multiple_choice | The item tests burn assessment or burn-fluid management. |
| blocked-cross-category | Burn Management | adult burn resuscitation Parkland calculation | `gpt_visual_smoke_2026_06_12_fib_burn_parkland_rate_01` | fill_in_blank | The item tests burn assessment or burn-fluid management. |
| blocked-cross-category | Burn Management | adult burn TBSA estimation | `burn_fib_tbsa_anterior_mix_01` | fill_in_blank | The item tests burn assessment or burn-fluid management. |
| blocked-cross-category | Burn Management | adult Rule of Nines region recognition | `gpt_visual_smoke_2026_06_12_matrix_burn_regions_03` | matrix | The item tests burn assessment or burn-fluid management. |
| blocked-cross-category | Burn Management | burn Parkland calculation verification | `burn_matrix_parkland_values_05` | matrix | The item tests burn assessment or burn-fluid management. |
| blocked-cross-category | Burn Management | Pressure injury staging | `gpt_gap_jun12_matrix_pressure_injury_staging_01` | matrix | The item tests burn assessment or burn-fluid management. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | intrapartum fetal monitoring | `fhr_gemini_smoke_2026_06_13_01` | multiple_choice | The item interprets fetal monitoring or intrapartum maternal-newborn findings. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | intrapartum fetal monitoring | `fhr_gemini_smoke_2026_06_13_02` | multiple_choice | The item interprets fetal monitoring or intrapartum maternal-newborn findings. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | intrapartum fetal monitoring | `fhr_gemini_smoke_2026_06_13_03` | multiple_choice | The item interprets fetal monitoring or intrapartum maternal-newborn findings. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | intrapartum fetal monitoring | `fhr_gemini_smoke_2026_06_13_04` | select_all | The item interprets fetal monitoring or intrapartum maternal-newborn findings. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | intrapartum fetal monitoring | `fhr_gemini_smoke_2026_06_13_05` | matrix | The item interprets fetal monitoring or intrapartum maternal-newborn findings. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | intrapartum fetal monitoring | `fhr_gemini_smoke_2026_06_13_06` | matrix | The item interprets fetal monitoring or intrapartum maternal-newborn findings. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | Late postpartum preeclampsia with severe features | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_bowtie` | bowtie | The item tests postpartum or preeclampsia maternal-newborn care. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | Late postpartum preeclampsia with severe features | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q1` | highlight | The item tests postpartum or preeclampsia maternal-newborn care. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | Late postpartum preeclampsia with severe features | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q2` | matrix | The item tests postpartum or preeclampsia maternal-newborn care. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | Late postpartum preeclampsia with severe features | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q3` | dropdown_cloze | The item tests postpartum or preeclampsia maternal-newborn care. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | Late postpartum preeclampsia with severe features | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q6` | matrix | The item tests postpartum or preeclampsia maternal-newborn care. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | Magnesium sulfate toxicity in preeclampsia | `gpt_u6_matrix_cloze_2026_06_09_cloze_preeclampsia_magnesium_20` | dropdown_cloze | The item tests postpartum or preeclampsia maternal-newborn care. |
| blocked-cross-category | Medication Safety & Admin | Injection route recognition from skin cross-section | `gpt_injection_smoke_2026_06_15_mc_intradermal_01` | multiple_choice | The item tests safe parenteral medication route or injection technique. |
| blocked-cross-category | Medication Safety & Admin | Injection route recognition from skin cross-section | `gpt_injection_smoke_2026_06_15_mc_intramuscular_03` | multiple_choice | The item tests safe parenteral medication route or injection technique. |
| blocked-cross-category | Medication Safety & Admin | Injection route recognition from skin cross-section | `gpt_injection_smoke_2026_06_15_mc_intravenous_04` | multiple_choice | The item tests safe parenteral medication route or injection technique. |
| blocked-cross-category | Medication Safety & Admin | Injection route recognition from skin cross-section | `gpt_injection_smoke_2026_06_15_mc_subcutaneous_02` | multiple_choice | The item tests safe parenteral medication route or injection technique. |
| blocked-cross-category | Medication Safety & Admin | Injection visual cue interpretation | `gpt_injection_smoke_2026_06_15_matrix_subq_cues_07` | matrix | The item tests safe parenteral medication route or injection technique. |
| blocked-cross-category | Medication Safety & Admin | Injection visual cue interpretation | `gpt_injection_smoke_2026_06_15_sata_im_cues_06` | select_all | The item tests safe parenteral medication route or injection technique. |
| blocked-cross-category | Medication Safety & Admin | Target layer identification from visual | `gpt_injection_smoke_2026_06_15_mc_layer_highlight_05` | multiple_choice | The item tests safe parenteral medication route or injection technique. |
| blocked-cross-category | Medication Safety & Admin | Visual technique analysis | `gpt_injection_smoke_2026_06_15_matrix_route_match_08` | matrix | The item tests safe parenteral medication route or injection technique. |
| category-untrusted |  | ADHF Pathophysiology | `cs_adhf_pulm_edema_01_part_3` | dropdown_cloze | parent category (Physiological Adaptation) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | anticoagulation reversal outcome evaluation | `gpt_case_warfarin_mvr_2026_06_11_01_q6` | multiple_choice | parent category (Pharmacological and Parenteral Therapies) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | discharge readiness after sedation with language barrier | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q2` | matrix | parent category (Management of Care) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | evaluating resuscitation response and OR handoff | `opus4_case_postop_sbar_01_q6` | matrix | parent category (Management of Care) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | Evaluating Sepsis Interventions | `cs_sepsis_shock_01_part_3` | select_all | parent category (Physiological Adaptation) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | fracture patterns concerning for nonaccidental trauma | `gpt_case_opus23_nat_toddler_01_q2` | matrix | parent category (Management of Care) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | GBS diagnostic and respiratory monitoring data | `gpt_case_gbs_respiratory_compromise_01_q2` | matrix | parent category (Physiological Adaptation) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | Immune Checkpoint Inhibitor Myocarditis | `opus_icit_case_01_q4` | select_all | parent category (Pharmacological and Parenteral Therapies) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | lithium toxicity | `opus_case_lithium_toxicity_q5` | multiple_choice | parent category (Pharmacological and Parenteral Therapies) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | Monitoring for fulminant C. difficile infection and toxic megacolon | `gpt_case_opus5_cdi_immunocompromised_01_q4` | matrix | parent category (Safety and Infection Control) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | pediatric dehydration cue recognition | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03_q1` | matrix | parent category (Health Promotion and Maintenance) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | portable oxygen planning | `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q5` | fill_in_blank | parent category (Safety and Infection Control) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | postoperative colostomy findings | `gpt_opus21_case_colostomy_lep_discharge_01_q4` | matrix | parent category (Management of Care) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | postoperative deterioration cue recognition | `opus4_case_postop_sbar_01_q1` | matrix | parent category (Management of Care) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | PTU Adverse Effects | `cs_thyroid_storm_q4` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | renal and delirium trend evaluation | `gpt_2026_06_13_case_delirium_uti_01_q4` | matrix | parent category (Physiological Adaptation) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | Septic shock recognition | `gpt_case_gap_2026_06_11_sepsis_cloze_02` | dropdown_cloze | parent category (Safety and Infection Control) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | status epilepticus | `opus_case_se_01_q5` | dropdown_cloze | parent category (Physiological Adaptation) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | status epilepticus | `opus_case_se_01_q6` | multiple_choice | parent category (Physiological Adaptation) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | Urine output target in sepsis | `gpt_case_gap_2026_06_11_sepsis_fib_04` | fill_in_blank | parent category (Safety and Infection Control) differs from child category (Reduction of Risk Potential) |
| category-untrusted |  | wound measurement trend | `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q5` | fill_in_blank | parent category (Basic Care and Comfort) differs from child category (Reduction of Risk Potential) |
| context-incomplete |  | Acute decompensated heart failure | `gpt_case_gap_2026_06_11_case_adhf_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Acute ischemic stroke thrombolysis and thrombectomy complications | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Acute kidney injury | `gpt_case_gap_2026_06_11_case_aki_02` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Acute pancreatitis complications | `gpt_case_gap_2026_06_11_case_pancreatitis_03` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Adrenal crisis | `gpt_case_gap_2026_06_11_case_adrenal_crisis_04` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Anticoagulation monitoring complication | `gpt_case_gap_2026_06_11_case_anticoag_bleeding_06` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | CAR-T cytokine release syndrome and ICANS monitoring | `opus_car_t_crs_2026_06_11_case_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Chest Tube Management | `claude_cs_jun06_chest_tube_rrp_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | home health wound-care teaching with teach-back failure | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Late postpartum preeclampsia with severe features | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | post-fall assessment and escalation in long-term care | `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | safe opioid administration and respiratory reassessment | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | tumor lysis syndrome | `gpt_case_gap_2026_06_11_case_tls_01` |  | id not found in canonical banks; classification skipped |

### Physiological Adaptation

Rows: 199

| Status | Proposed topic | Old topic | ID | Type | Reason |
|---|---|---|---|---|---|
| proposed | Burn Management | burn fluid resuscitation threshold | `burn_mc_resuscitation_threshold_02` | multiple_choice | The item tests burn assessment or burn-fluid management. |
| proposed | Burn Management | burn Parkland calculation chain | `burn_sata_parkland_chain_06` | select_all | The item tests burn assessment or burn-fluid management. |
| proposed | Burn Management | burn Parkland first 8 hours rate | `burn_fib_parkland_rate_arm_trunk_genitalia_04` | fill_in_blank | The item tests burn assessment or burn-fluid management. |
| proposed | Burn Management | burn Parkland first 8 hours volume | `burn_fib_parkland_first8h_leg_arm_08` | fill_in_blank | The item tests burn assessment or burn-fluid management. |
| proposed | Burn Management | burn Parkland total volume | `burn_fib_parkland_total_posterior_03` | fill_in_blank | The item tests burn assessment or burn-fluid management. |
| proposed | Burn Management | Guillain-Barre syndrome recognition | `gpt_case_gbs_respiratory_compromise_01_q1` | highlight | The item tests burn assessment or burn-fluid management. |
| proposed | Burn Management | Major thermal burn with inhalation injury and fluid creep | `gpt_case_major_burn_inhalation_fluid_creep_01_bowtie` | bowtie | The item tests burn assessment or burn-fluid management. |
| proposed | Burn Management | Major thermal burn with inhalation injury and fluid creep | `gpt_case_major_burn_inhalation_fluid_creep_01_q1` | fill_in_blank | The item tests burn assessment or burn-fluid management. |
| proposed | Burn Management | Major thermal burn with inhalation injury and fluid creep | `gpt_case_major_burn_inhalation_fluid_creep_01_q2` | highlight | The item tests burn assessment or burn-fluid management. |
| proposed | Burn Management | Major thermal burn with inhalation injury and fluid creep | `gpt_case_major_burn_inhalation_fluid_creep_01_q3` | fill_in_blank | The item tests burn assessment or burn-fluid management. |
| proposed | Burn Management | Major thermal burn with inhalation injury and fluid creep | `gpt_case_major_burn_inhalation_fluid_creep_01_q4` | multiple_choice | The item tests burn assessment or burn-fluid management. |
| proposed | Burn Management | Major thermal burn with inhalation injury and fluid creep | `gpt_case_major_burn_inhalation_fluid_creep_01_q5` | select_all | The item tests burn assessment or burn-fluid management. |
| proposed | Cardiovascular Disorders | Acute variceal hemorrhage in cirrhosis | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_q1` | highlight | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | AD Pathophysiology | `q10_3` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | AD Priority Action | `q10_2` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | AD Resolution Sign | `q10_5` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Asystole | `ekg_b4_mc_08` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Cardiac Arrest Rhythms | `ekg_b4_matrix_10` | matrix | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | cardiogenic shock | `vit_09` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | cardiopulmonary resuscitation | `cap_03` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Cardioversion Indications | `ekg_b2_sata_09` | select_all | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | compensated shock | `vit_01` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | GBS impending respiratory failure priority actions | `gpt_case_gbs_respiratory_compromise_01_q5` | select_all | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Guillain-Barre syndrome respiratory compromise | `gpt_case_gbs_respiratory_compromise_01_bowtie` | bowtie | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Mobitz I Management | `ekg_b3_mc_04` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Mobitz II Interventions | `ekg_b3_mc_06` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Myocardial Infarction Manifestations | `cs_stemi_vfib_04_part_1` | select_all | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | neurogenic shock | `vit_07` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Normal Sinus Rhythm | `ekg_b1_mc_01` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Pacemaker Conduction | `ekg_b5_matrix_10` | matrix | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Pacemaker Failure to Sense | `ekg_b5_mc_05` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | postoperative hemorrhage | `vit_03` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Postoperative pulmonary embolism with right ventricular strain | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q2` | matrix | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Postoperative pulmonary embolism with right ventricular strain | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q3` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Premature Ventricular Contractions | `ekg_b4_mc_01` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Pulmonary Edema Cue Recognition | `cs_adhf_pulm_edema_01_part_1` | select_all | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | pulseless ventricular tachycardia | `rhy_vtach_001` | select_all | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Pulseless Ventricular Tachycardia | `ekg_b4_mc_04` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | respiratory distress | `cap_05` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Return of Spontaneous Circulation (ROSC) | `cs_stemi_vfib_04_part_4` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Second-Degree AV Block Mobitz I | `ekg_b3_mc_03` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Second-Degree AV Block Mobitz II | `ekg_b3_mc_05` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | sinus bradycardia | `rhy_sinus_brady_001` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Sinus Bradycardia | `ekg_b1_mc_02` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Sinus Rhythms | `ekg_b1_matrix_09` | matrix | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | ST-Segment Elevation Myocardial Infarction | `ekg_b5_mc_07` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Supraventricular Tachycardia | `ekg_b2_mc_03` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | SVT Initial Interventions | `ekg_b2_mc_04` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Third-Degree AV Block | `ekg_b3_mc_07` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Ventricular Fibrillation | `ekg_b4_mc_06` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | Ventricular Tachycardia | `ekg_b4_mc_03` | multiple_choice | The item tests cardiovascular assessment or perfusion. |
| proposed | Cardiovascular Disorders | VFib Interventions | `ekg_b4_sata_07` | select_all | The item tests cardiovascular assessment or perfusion. |
| proposed | Diabetic Ketoacidosis (DKA) | DKA treatment response and potassium shift | `gpt_u3_labtrend_2026_06_09_b_matrix_dka_potassium_glucose_04` | matrix | The item tests DKA recognition or management. |
| proposed | Electrolyte Imbalances | Acute gallstone pancreatitis with cholangitis | `gpt_case_gallstone_pancreatitis_01_q1` | matrix | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Acute Graft-Versus-Host Disease | `opus_agvd_case_agvhd_01_q2` | multiple_choice | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Acute pancreatitis complications | `gpt_u6_matrix_cloze_2026_06_09_cloze_acute_pancreatitis_19` | dropdown_cloze | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Acute pancreatitis hypocalcemia | `gpt_case_gallstone_pancreatitis_01_q2` | dropdown_cloze | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Acute pancreatitis nursing priorities | `gpt_case_gallstone_pancreatitis_01_q4` | select_all | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Acute pancreatitis outcome evaluation | `gpt_case_gallstone_pancreatitis_01_q6` | matrix | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Adrenal crisis recognition and treatment | `gpt_u6_matrix_cloze_2026_06_09_cloze_adrenal_crisis_07` | dropdown_cloze | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Asystole Management | `ekg_b4_sata_09` | select_all | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | caloric advancement after refeeding electrolyte stabilization | `opus26_case_refeeding_syndrome_01_q6` | dropdown_cloze | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Celiac disease with dermatitis herpetiformis | `gpt_r1_regen_case_celiac_01_bowtie` | bowtie | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Celiac disease with dermatitis herpetiformis | `gpt_r1_regen_case_celiac_01_q1` | highlight | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Celiac disease with dermatitis herpetiformis | `gpt_r1_regen_case_celiac_01_q2` | matrix | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Celiac disease with dermatitis herpetiformis | `gpt_r1_regen_case_celiac_01_q6` | dropdown_cloze | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | diuresis response evaluation | `io_mc_pulmonary_edema_diuresis_02` | multiple_choice | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | falling calcium after thyroidectomy | `gpt_u3_labtrend_2026_06_09_cloze_calcium_thyroidectomy_09` | dropdown_cloze | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Gallstone pancreatitis with cholangitis | `gpt_case_gallstone_pancreatitis_01_q3` | multiple_choice | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Hyperkalemia ECG Changes | `ekg_b5_mc_01` | multiple_choice | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Hyperosmolar hyperglycemic state priority care | `gpt_u6_matrix_cloze_2026_06_09_cloze_hhs_18` | dropdown_cloze | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Hypokalemia ECG Changes | `ekg_b5_mc_09` | multiple_choice | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Pacemaker Failure to Capture | `ekg_b5_mc_04` | multiple_choice | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Potassium shifts during insulin therapy | `gpt_u6_matrix_cloze_2026_06_09_matrix_potassium_shift_insulin_15` | matrix | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Prerenal acute kidney injury with hyperkalemia | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_bowtie` | bowtie | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Prerenal acute kidney injury with hyperkalemia | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q1` | matrix | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Prerenal acute kidney injury with hyperkalemia | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q3` | multiple_choice | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Prerenal acute kidney injury with hyperkalemia | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q6` | matrix | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | refeeding edema evaluation | `opus26_case_refeeding_syndrome_01_q5` | multiple_choice | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Refeeding Evaluation | `q1_5` | multiple_choice | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Refeeding Interventions | `q1_4` | select_all | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Refeeding Pathophysiology | `q1_2` | multiple_choice | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Refeeding Priority Complication | `q1_3` | multiple_choice | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | refeeding syndrome cardiac rhythm changes | `opus26_case_refeeding_syndrome_01_q3` | multiple_choice | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | refeeding syndrome electrolyte thresholds | `opus26_case_refeeding_syndrome_01_q1` | select_all | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Refeeding Syndrome Risk | `q1_1` | select_all | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | status epilepticus | `opus_case_se_01_q2` | matrix | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | TCA Overdose QT Prolongation | `ekg_b5_mc_03` | multiple_choice | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | Third-Degree AV Block Pacemaker | `ekg_b3_mc_09` | multiple_choice | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | worsening hypercalcemia trend | `gpt_u3_labtrend_2026_06_09_b_or_hypercalcemia_progression_07` | ordered_response | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | worsening hyperkalemia emergency actions | `gpt_u3_labtrend_2026_06_09_or_hyperkalemia_progression_06` | ordered_response | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | worsening hyponatremia trend | `gpt_u3_labtrend_2026_06_09_mc_sodium_decline_02` | multiple_choice | The item tests electrolyte derangement recognition or response. |
| proposed | Endocrine & Neurological Disorders | Acute variceal hemorrhage in cirrhosis | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_bowtie` | bowtie | The item tests endocrine or neurological deterioration. |
| proposed | Endocrine & Neurological Disorders | Acute variceal hemorrhage in cirrhosis | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_q6` | select_all | The item tests endocrine or neurological deterioration. |
| proposed | Endocrine & Neurological Disorders | asthma exacerbation | `cap_01` | multiple_choice | The item tests endocrine or neurological deterioration. |
| proposed | Endocrine & Neurological Disorders | Cardiac Tamponade | `ekg_b5_sata_08` | select_all | The item tests endocrine or neurological deterioration. |
| proposed | Endocrine & Neurological Disorders | Differentiating GBS from spinal cord and neuromuscular junction disorders | `gpt_case_gbs_respiratory_compromise_01_q3` | multiple_choice | The item tests endocrine or neurological deterioration. |
| proposed | Endocrine & Neurological Disorders | ICP Recovery Evaluation | `q6_5` | multiple_choice | The item tests endocrine or neurological deterioration. |
| proposed | Endocrine & Neurological Disorders | Malignant Spinal Cord Compression | `opus_scc_case_01_q1` | multiple_choice | The item tests endocrine or neurological deterioration. |
| proposed | Endocrine & Neurological Disorders | Malignant Spinal Cord Compression | `opus_scc_case_01_q2` | multiple_choice | The item tests endocrine or neurological deterioration. |
| proposed | Endocrine & Neurological Disorders | Malignant Spinal Cord Compression | `opus_scc_case_01_q3` | multiple_choice | The item tests endocrine or neurological deterioration. |
| proposed | Endocrine & Neurological Disorders | Malignant Spinal Cord Compression | `opus_scc_case_01_q4` | select_all | The item tests endocrine or neurological deterioration. |
| proposed | Endocrine & Neurological Disorders | Malignant Spinal Cord Compression | `opus_scc_case_01_q5` | multiple_choice | The item tests endocrine or neurological deterioration. |
| proposed | Endocrine & Neurological Disorders | Malignant Spinal Cord Compression | `opus_scc_case_01_q6` | matrix | The item tests endocrine or neurological deterioration. |
| proposed | Endocrine & Neurological Disorders | status epilepticus | `opus_case_se_01_q1` | multiple_choice | The item tests endocrine or neurological deterioration. |
| proposed | Endocrine & Neurological Disorders | Symptomatic Tachycardia | `ekg_b1_sata_07` | select_all | The item tests endocrine or neurological deterioration. |
| proposed | Endocrine & Neurological Disorders | Thyroid Storm Assessment | `cs_thyroid_storm_q1` | matrix | The item tests endocrine or neurological deterioration. |
| proposed | Renal & Gastrointestinal Disorders | Acute variceal hemorrhage in cirrhosis | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_q2` | dropdown_cloze | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | Acute variceal hemorrhage in cirrhosis | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_q5` | matrix | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | C. difficile colitis and dehydration | `opus20_case_cdiff_01_q1` | multiple_choice | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | C. difficile colitis and dehydration | `opus20_case_cdiff_01_q6` | matrix | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | chronic kidney disease fluid overload risk | `io_sata_ckd_fluid_overload_07` | select_all | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | Complete Heart Block Symptoms | `ekg_b3_sata_08` | select_all | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | decompensated shock | `vit_06` | multiple_choice | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | delirium superimposed on dementia | `gpt_2026_06_13_case_delirium_uti_01_q1` | matrix | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | Hemolytic Reaction Complication | `q4_3` | multiple_choice | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | Myasthenic crisis respiratory deterioration | `gpt_u6_matrix_cloze_2026_06_09_cloze_myasthenic_crisis_17` | dropdown_cloze | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | Postoperative pulmonary embolism with right ventricular strain | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_bowtie` | bowtie | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | Postoperative pulmonary embolism with right ventricular strain | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q1` | highlight | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | Postoperative pulmonary embolism with right ventricular strain | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q6` | dropdown_cloze | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | Respiratory deterioration recognition | `gpt_u6_matrix_cloze_2026_06_09_matrix_respiratory_deterioration_05` | matrix | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | Sinus Tachycardia | `ekg_b1_mc_06` | multiple_choice | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | Symptomatic Bradycardia | `ekg_b1_sata_03` | select_all | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | Tachycardia Interventions | `ekg_b1_mc_08` | multiple_choice | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Respiratory & Infectious Disorders | Acute variceal hemorrhage in cirrhosis | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_q4` | select_all | The item tests respiratory or infectious physiologic assessment. |
| proposed | Respiratory & Infectious Disorders | Evaluating GBS plateau and ventilator recovery | `gpt_case_gbs_respiratory_compromise_01_q6` | dropdown_cloze | The item tests respiratory or infectious physiologic assessment. |
| proposed | Respiratory & Infectious Disorders | hyperventilation | `cap_08` | multiple_choice | The item tests respiratory or infectious physiologic assessment. |
| proposed | Sepsis & Septic Shock | Acute gallstone pancreatitis with cholangitis | `gpt_case_gallstone_pancreatitis_01_bowtie` | bowtie | The item tests sepsis-like systemic inflammatory deterioration or shock. |
| proposed | Sepsis & Septic Shock | Acute Graft-Versus-Host Disease | `opus_agvd_case_agvhd_01_q1` | multiple_choice | The item tests sepsis-like systemic inflammatory deterioration or shock. |
| proposed | Sepsis & Septic Shock | DIC Paradoxical Process | `q7_2` | multiple_choice | The item tests sepsis-like systemic inflammatory deterioration or shock. |
| proposed | Sepsis & Septic Shock | DIC Resolution Evaluation | `q7_5` | multiple_choice | The item tests sepsis-like systemic inflammatory deterioration or shock. |
| proposed | Sepsis & Septic Shock | DIC Underlying Cause | `q7_1` | multiple_choice | The item tests sepsis-like systemic inflammatory deterioration or shock. |
| proposed | Sepsis & Septic Shock | Mucositis TPN and CRBSI | `opus_tpn_case_mucositis_01_q1` | multiple_choice | The item tests sepsis-like systemic inflammatory deterioration or shock. |
| proposed | Sepsis & Septic Shock | Mucositis TPN and CRBSI | `opus_tpn_case_mucositis_01_q5` | matrix | The item tests sepsis-like systemic inflammatory deterioration or shock. |
| proposed | Sepsis & Septic Shock | sepsis | `vit_02` | multiple_choice | The item tests sepsis-like systemic inflammatory deterioration or shock. |
| proposed | Sepsis & Septic Shock | Sepsis Cue Recognition | `cs_sepsis_shock_01_part_1` | matrix | The item tests sepsis-like systemic inflammatory deterioration or shock. |
| proposed | Sepsis & Septic Shock | sepsis response to treatment trend | `gpt_u3_labtrend_2026_06_09_matrix_sepsis_lactate_wbc_04` | matrix | The item tests sepsis-like systemic inflammatory deterioration or shock. |
| proposed | Sepsis & Septic Shock | worsening lactate trend in sepsis | `gpt_u3_labtrend_2026_06_09_b_mc_lactate_worsening_03` | multiple_choice | The item tests sepsis-like systemic inflammatory deterioration or shock. |
| unresolved |  | Acute Graft-Versus-Host Disease | `opus_agvd_case_agvhd_01_q6` | matrix | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Acute variceal hemorrhage in cirrhosis | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_q3` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | AD Cause Identification | `q10_4` | select_all | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Atrial Arrhythmias | `ekg_b2_matrix_10` | matrix | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Atrial Fibrillation | `ekg_b2_mc_01` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Atrial Flutter | `ekg_b2_mc_07` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Autonomic Dysreflexia Triggers | `q10_1` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | AV Heart Blocks | `ekg_b3_matrix_10` | matrix | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Celiac disease with dermatitis herpetiformis | `gpt_r1_regen_case_celiac_01_q3` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Cushing Triad Recognition | `q6_1` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Cushing Triad Significance | `q6_2` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | First-Degree AV Block | `ekg_b3_mc_01` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Hemolytic Reaction Confirmation | `q4_5` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Hemolytic Reaction Identification | `q4_2` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | ICP Management Interventions | `q6_4` | select_all | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Intussusception Interventions | `q8_4` | select_all | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Intussusception Recognition | `q8_2` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Intussusception Recovery Sign | `q8_5` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Pyloric Stenosis Metabolic Impact | `q8_3` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Pyloric Stenosis Recognition | `q8_1` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | Postpartum hemorrhage due to uterine atony | `gpt_pph_2026_06_16_case_01_bowtie` | bowtie | The item interprets fetal monitoring or intrapartum maternal-newborn findings. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | Postpartum hemorrhage due to uterine atony | `gpt_pph_2026_06_16_case_01_q1` | highlight | The item interprets fetal monitoring or intrapartum maternal-newborn findings. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | Postpartum hemorrhage due to uterine atony | `gpt_pph_2026_06_16_case_01_q2` | dropdown_cloze | The item interprets fetal monitoring or intrapartum maternal-newborn findings. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | Postpartum hemorrhage due to uterine atony | `gpt_pph_2026_06_16_case_01_q3` | multiple_choice | The item interprets fetal monitoring or intrapartum maternal-newborn findings. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | Postpartum hemorrhage due to uterine atony | `gpt_pph_2026_06_16_case_01_q4` | select_all | The item interprets fetal monitoring or intrapartum maternal-newborn findings. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | Postpartum hemorrhage due to uterine atony | `gpt_pph_2026_06_16_case_01_q5` | matrix | The item interprets fetal monitoring or intrapartum maternal-newborn findings. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | Postpartum hemorrhage due to uterine atony | `gpt_pph_2026_06_16_case_01_q6` | select_all | The item interprets fetal monitoring or intrapartum maternal-newborn findings. |
| category-untrusted |  | acute hemorrhage prioritization | `gpt_case_warfarin_mvr_2026_06_11_01_q4` | matrix | parent category (Pharmacological and Parenteral Therapies) differs from child category (Physiological Adaptation) |
| category-untrusted |  | emergent hyperkalemia management | `gpt_case_gap_2026_06_11_case_tls_01_q3` | ordered_response | parent category (Reduction of Risk Potential) differs from child category (Physiological Adaptation) |
| category-untrusted |  | Immune Checkpoint Inhibitor Myocarditis | `opus_icit_case_01_q2` | multiple_choice | parent category (Pharmacological and Parenteral Therapies) differs from child category (Physiological Adaptation) |
| category-untrusted |  | Infant ICP Signs | `q3_5` | multiple_choice | parent category (Safety and Infection Control) differs from child category (Physiological Adaptation) |
| category-untrusted |  | lithium toxicity | `opus_case_lithium_toxicity_q3` | multiple_choice | parent category (Pharmacological and Parenteral Therapies) differs from child category (Physiological Adaptation) |
| category-untrusted |  | NMS Renal Risk | `q9_5` | multiple_choice | parent category (Pharmacological and Parenteral Therapies) differs from child category (Physiological Adaptation) |
| category-untrusted |  | postoperative hemorrhage with hypovolemic shock | `opus4_case_postop_sbar_01_q2` | multiple_choice | parent category (Management of Care) differs from child category (Physiological Adaptation) |
| category-untrusted |  | tumor lysis syndrome | `gpt_case_gap_2026_06_11_case_tls_01_q2` | dropdown_cloze | parent category (Reduction of Risk Potential) differs from child category (Physiological Adaptation) |
| category-untrusted |  | tumor lysis syndrome treatment response | `gpt_case_gap_2026_06_11_case_tls_01_q5` | matrix | parent category (Reduction of Risk Potential) differs from child category (Physiological Adaptation) |
| context-incomplete |  | Acute Decompensated Heart Failure (ADHF) | `cs_adhf_pulm_edema_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Acute gallstone pancreatitis with cholangitis | `gpt_case_gallstone_pancreatitis_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Acute Graft-Versus-Host Disease | `opus_agvd_case_agvhd_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Acute Myocardial Infarction and Ventricular Fibrillation | `cs_stemi_vfib_04` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Acute variceal hemorrhage in cirrhosis | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Anorexia Nervosa / Refeeding Syndrome | `cs_ngn_001_anorexia` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Autonomic Dysreflexia | `cs_ngn_010_ad` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Blood Transfusion Reaction (Hemolytic/TRALI) | `cs_ngn_004_blood` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | C. difficile colitis and dehydration | `opus20_case_cdiff_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Celiac disease with dermatitis herpetiformis | `gpt_r1_regen_case_celiac_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | delirium superimposed on dementia | `gpt_2026_06_13_case_delirium_uti_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Disseminated Intravascular Coagulation (DIC) | `cs_ngn_007_dic` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Guillain-Barre syndrome respiratory compromise | `gpt_case_gbs_respiratory_compromise_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Major thermal burn with inhalation injury and fluid creep | `gpt_case_major_burn_inhalation_fluid_creep_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Malignant Spinal Cord Compression | `opus_scc_case_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Mucositis TPN and CRBSI | `opus_tpn_case_mucositis_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Postoperative pulmonary embolism with right ventricular strain | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Postpartum hemorrhage due to uterine atony | `gpt_pph_2026_06_16_case_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Prerenal acute kidney injury with hyperkalemia | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Pyloric Stenosis vs. Intussusception | `cs_ngn_008_peds` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | refeeding syndrome risk in anorexia nervosa | `opus26_case_refeeding_syndrome_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Septic Shock from Urosepsis | `cs_sepsis_shock_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | status epilepticus | `opus_case_se_01` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Thyroid Storm | `cs_thyroid_storm_main` |  | id not found in canonical banks; classification skipped |
| context-incomplete |  | Traumatic Brain Injury (TBI) / Cushing's Triad | `cs_ngn_006_tbi` |  | id not found in canonical banks; classification skipped |
