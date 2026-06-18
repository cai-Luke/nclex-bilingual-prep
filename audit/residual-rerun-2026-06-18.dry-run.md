# Consolidated Residual Re-Run Dry Run

Generated: 2026-06-18T15:14:22.319Z
Classifier: openai/gpt-5-codex-in-harness
Mode: dry-run only
Canonical bank writes: none
Topic vocabulary writes: none

## Vocabulary/Licensing Changes Proposed

- none

## Safety Summary

- proposed: 170
- carried-forward: 65
- unresolved: 2

Decision types:
- topic_only: 169
- category_and_topic: 66
- abstain: 2

## Scope Membership

| Source tag | Rows |
|---|---:|
| excluded_settled_rows | 15 |
| original_blocked_source_rows | 41 |
| original_unresolved_source_rows | 75 |
| reclaim_blocked_source_rows | 4 |
| reclaim_proposed_source_rows | 109 |
| reclaim_unresolved_source_rows | 23 |
| unique_run_rows | 237 |

## S01-Impact Table

| Bucket | Rows |
|---|---:|
| resolved with no S01-dependent change | 194 |
| maternal shared licensing | 19 |
| Skin & Wound Care | 17 |
| Oncology & Immunotherapy Complications | 5 |

## Dominance + Category Integrity

| Proposed topic | Count | Flags |
|---|---:|---|
| Medication Safety & Admin | 34 | Pharmacological and Parenteral Therapies >=35% |
| Prioritization & Delegation | 22 | Management of Care >=35% |
| Cardiovascular Disorders | 19 |  |
| Maternal-Newborn Care & Teaching | 19 | Reduction of Risk Potential >=35% |
| Renal & Gastrointestinal Disorders | 18 |  |
| Skin & Wound Care | 17 | Basic Care and Comfort >=35% |
| Endocrine & Neurological Disorders | 10 |  |
| Discharge Planning & Handoff | 9 |  |
| Therapeutic Communication | 9 | Psychosocial Integrity >=35% |
| Laboratory & Diagnostic Tests | 8 |  |
| Patient & Environment Safety | 8 | Safety and Infection Control >=35% |
| Anticoagulant Therapy | 7 |  |
| Burn Management | 6 |  |
| Sepsis & Septic Shock | 6 |  |
| Mental Health Disorders | 5 |  |
| Oncology & Immunotherapy Complications | 5 |  |
| Transfusion & Blood Products | 5 |  |
| Nutritional & Fluid Support | 4 |  |
| Respiratory & Infectious Disorders | 4 |  |
| Caregiver Role Strain & Family Coping | 3 |  |
| Chronic Disease Management & Lifestyle | 2 | Health Promotion and Maintenance >=35% |
| Electrolyte Imbalances | 2 |  |
| Legal & Ethical Principles | 2 |  |
| Palliative & Supportive Care | 2 |  |
| Transmission-Based Precautions | 2 |  |
| Confidentiality & HIPAA | 1 |  |
| Dosage Calculations | 1 |  |
| Elimination & Comfort | 1 |  |
| PPE & Sterile Technique | 1 |  |
| Psychotropic Medications | 1 |  |
| Sleep & Rest | 1 |  |
| Standard Precautions & Hygiene | 1 |  |

## Wound-Licensing Watch

Wound rows requiring recategorization to Basic Care and Comfort solely to reach Skin & Wound Care: 0
No wound recategorization pressure detected.

## Row Plan

### topic_only

| Status | Current category | Current topic | Proposed category | Proposed topic | Sources | ID | Reason |
|---|---|---|---|---|---|---|---|
| proposed | Basic Care and Comfort | New ostomy discharge teaching with health literacy barriers | Basic Care and Comfort | Elimination & Comfort | original-blocked-cross-category | `gpt_case_gap_2026_06_11_ostomy_literacy_part_2_matrix_findings` | The item evaluates ostomy findings and pouch-care readiness. |
| proposed | Basic Care and Comfort | Nutrition in acute pancreatitis | Basic Care and Comfort | Nutritional & Fluid Support | reclaim-proposed | `gpt_case_gallstone_pancreatitis_01_q5` | The item addresses oral intake readiness after pancreatitis improvement. |
| proposed | Basic Care and Comfort | Mucositis TPN and CRBSI | Basic Care and Comfort | Palliative & Supportive Care | reclaim-proposed | `opus_tpn_case_mucositis_01_q4` | The item coordinates analgesia to enable atraumatic oral care. |
| proposed | Basic Care and Comfort | Nonpharmacological Musculoskeletal Pain Management | Basic Care and Comfort | Palliative & Supportive Care | original-unresolved | `gpt_gap_jun11_or_nonpharm_pain_01` | The item sequences nonpharmacologic comfort measures. |
| proposed | Basic Care and Comfort | C. difficile colitis and dehydration | Basic Care and Comfort | Skin & Wound Care | reclaim-blocked-cross-category | `opus20_case_cdiff_01_q4` | The item protects perianal skin from moisture-associated damage. |
| proposed | Basic Care and Comfort | Home skin inspection for pressure injury prevention | Basic Care and Comfort | Skin & Wound Care | original-unresolved | `gpt_gap_2026_06_10_fib_daily_skin_inspection_07` | The item teaches daily inspection for early skin breakdown. |
| proposed | Basic Care and Comfort | pressure injury prevention in rehabilitation | Basic Care and Comfort | Skin & Wound Care | original-unresolved | `gpt_case_premium_2026_06_10_case04_cloze_stage1_02` | The item tests wound, pressure-injury, ostomy skin, or skin-integrity care. |
| proposed | Basic Care and Comfort | pressure injury prevention in rehabilitation | Basic Care and Comfort | Skin & Wound Care | original-unresolved | `gpt_case_premium_2026_06_10_case04_mc_first_action_03` | The item tests wound, pressure-injury, ostomy skin, or skin-integrity care. |
| proposed | Basic Care and Comfort | pressure injury staging and evaluation of wound healing | Basic Care and Comfort | Skin & Wound Care | original-unresolved | `opus_bcc_rehab_2026_06_10_06` | The item sequences pressure-injury wound healing findings. |
| proposed | Basic Care and Comfort | Pressure Injury Staging and Prevention | Basic Care and Comfort | Skin & Wound Care | original-blocked-cross-category | `claude_cs_jun06_pressure_injury_bcc_01_part_1` | The item tests wound, pressure-injury, ostomy skin, or skin-integrity care. |
| proposed | Basic Care and Comfort | Pressure Injury Staging and Prevention | Basic Care and Comfort | Skin & Wound Care | original-unresolved | `claude_cs_jun06_pressure_injury_bcc_01_part_4` | The item tests wound, pressure-injury, ostomy skin, or skin-integrity care. |
| proposed | Basic Care and Comfort | Repositioning schedule for pressure injury prevention | Basic Care and Comfort | Skin & Wound Care | original-unresolved | `gpt_gap_2026_06_10_b_fib_bed_repositioning_08` | The item tests wound, pressure-injury, ostomy skin, or skin-integrity care. |
| proposed | Basic Care and Comfort | wound-care teach-back failure | Basic Care and Comfort | Skin & Wound Care | reclaim-unresolved | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q2` | The item tests wound, pressure-injury, ostomy skin, or skin-integrity care. |
| proposed | Health Promotion and Maintenance | Discharge teaching after C. difficile infection | Health Promotion and Maintenance | Chronic Disease Management & Lifestyle | reclaim-proposed | `gpt_case_opus5_cdi_immunocompromised_01_q6` | The item tests discharge teaching after CDI. |
| proposed | Management of Care | caregiver safety planning and care coordination | Management of Care | Caregiver Role Strain & Family Coping | reclaim-proposed | `gpt_case_premium_next_case_caregiver_adaptation_dementia_03_or_plan` | The item sequences a caregiver support and home-safety plan. |
| proposed | Management of Care | discharge medication reconciliation | Management of Care | Discharge Planning & Handoff | original-blocked-cross-category | `opus1_case_discharge_med_rec_anticoag_01_q1` | The item reviews medication reconciliation findings before discharge prescriptions. |
| proposed | Management of Care | home wound-care teach-back sequence | Management of Care | Discharge Planning & Handoff | reclaim-unresolved | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q5` | The item sequences home-visit teaching, barriers, escalation, and follow-up. |
| proposed | Management of Care | interprofessional diabetes care coordination | Management of Care | Discharge Planning & Handoff | reclaim-unresolved | `gpt_case_premium_next_case_health_literacy_diabetes_01_sata_referrals` | The item selects interprofessional referrals and care-coordination actions. |
| proposed | Management of Care | resource coordination for preventive care | Management of Care | Discharge Planning & Handoff | reclaim-unresolved | `gpt_case_premium_next_case_preventive_screening_vaccine_05_sata_plan` | The item coordinates screening/vaccine access and follow-through. |
| proposed | Management of Care | mandatory reporting and escalation | Management of Care | Legal & Ethical Principles | reclaim-proposed | `opus24_case_elder_neglect_med_mismanagement_01_q3` | The item tests mandated reporting and escalation. |
| proposed | Management of Care | delegation and interprofessional rehabilitation coordination | Management of Care | Prioritization & Delegation | reclaim-proposed | `gpt_case_premium_next_case_rehab_pressure_bowel_02_matrix_delegation` | The item assigns care activities to RN, AP, PT, and OT roles. |
| proposed | Management of Care | Immune Checkpoint Inhibitor Myocarditis | Management of Care | Prioritization & Delegation | reclaim-proposed | `opus_icit_case_01_q3` | The item orders urgent interventions for ICI myocarditis deterioration. |
| proposed | Management of Care | Initial nursing sequence for suspected C. difficile infection | Management of Care | Prioritization & Delegation | reclaim-proposed | `gpt_case_opus5_cdi_immunocompromised_01_q5` | The item sequences initial CDI response. |
| proposed | Management of Care | missed dose follow-up | Management of Care | Prioritization & Delegation | original-unresolved | `mar_missed_antibiotic_followup_07` | The item tests appropriate follow-up actions for a missed antibiotic dose. |
| proposed | Management of Care | post-fall escalation | Management of Care | Prioritization & Delegation | reclaim-unresolved | `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q3` | The item frames the provider-notification priority after a fall. |
| proposed | Management of Care | RN scope medication dose question | Management of Care | Prioritization & Delegation | reclaim-blocked-cross-category | `opus22_case_postpartum_intrusive_thoughts_01_q4` | Review correction: keep the RN-scope medication-dose item in Management of Care rather than moving postpartum context to HPM. |
| proposed | Management of Care | Thyroid Storm Interventions | Management of Care | Prioritization & Delegation | reclaim-unresolved | `cs_thyroid_storm_q3` | The item selects indicated safety interventions for thyroid storm management. |
| proposed | Pharmacological and Parenteral Therapies | Ethambutol baseline assessment | Pharmacological and Parenteral Therapies | Laboratory & Diagnostic Tests | reclaim-proposed | `opus25_case_tb_airborne_treatment_monitoring_01_q3` | The item tests baseline assessment before ethambutol therapy. |
| proposed | Pharmacological and Parenteral Therapies | Adenosine Side Effects | Pharmacological and Parenteral Therapies | Medication Safety & Admin | original-unresolved | `ekg_b2_sata_06` | The item tests adenosine medication effects and safety monitoring. |
| proposed | Pharmacological and Parenteral Therapies | Atropine Evaluation | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-unresolved | `q2_5` | The item evaluates atropine response. |
| proposed | Pharmacological and Parenteral Therapies | C. difficile colitis and dehydration | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-proposed | `opus20_case_cdiff_01_q5` | The item evaluates CDI medication/treatment resolution. |
| proposed | Pharmacological and Parenteral Therapies | Cardiac Arrest Pharmacotherapy | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-proposed | `cs_stemi_vfib_04_part_3` | The item tests pharmacotherapy during cardiac arrest. |
| proposed | Pharmacological and Parenteral Therapies | Chronic corticosteroid tapering | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-proposed | `opus25_case_tb_airborne_treatment_monitoring_01_q4` | The item tests safe corticosteroid tapering during TB treatment. |
| proposed | Pharmacological and Parenteral Therapies | diuretic potassium safety | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-proposed | `opus24_case_elder_neglect_med_mismanagement_01_q2` | The item handles medication safety in elder neglect. |
| proposed | Pharmacological and Parenteral Therapies | haloperidol safety in delirium | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-proposed | `gpt_2026_06_13_case_delirium_uti_01_q3` | The item tests medication safety for haloperidol in delirium. |
| proposed | Pharmacological and Parenteral Therapies | Hyperthermic Syndrome Interventions | Pharmacological and Parenteral Therapies | Medication Safety & Admin | original-unresolved | `q9_4` | The item tests interventions for a hyperthermic medication syndrome. |
| proposed | Pharmacological and Parenteral Therapies | Late postpartum preeclampsia with severe features | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-blocked-cross-category | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q4` | Review correction: keep acute magnesium/antihypertensive management in Pharmacological and route it to Medication Safety & Admin rather than HPM. |
| proposed | Pharmacological and Parenteral Therapies | Late postpartum preeclampsia with severe features | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-blocked-cross-category | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q5` | Review correction: keep acute magnesium/antihypertensive management in Pharmacological and route it to Medication Safety & Admin rather than HPM. |
| proposed | Pharmacological and Parenteral Therapies | metformin discharge teaching | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-proposed | `gpt_opus21_case_colostomy_lep_discharge_01_q5` | The item teaches metformin discharge safety. |
| proposed | Pharmacological and Parenteral Therapies | metformin renal safety | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-proposed | `opus24_case_elder_neglect_med_mismanagement_01_q5` | The item tests metformin renal safety. |
| proposed | Pharmacological and Parenteral Therapies | opioid reassessment after IV dose | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-proposed | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01_q2` | The item reassesses after an IV opioid dose. |
| proposed | Pharmacological and Parenteral Therapies | Osmotic Diuretic Priority | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-unresolved | `q6_3` | The item prioritizes osmotic diuretic therapy in ICP management. |
| proposed | Pharmacological and Parenteral Therapies | Postoperative pulmonary embolism with right ventricular strain | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-proposed | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q4` | The item tests medication actions for postoperative PE. |
| proposed | Pharmacological and Parenteral Therapies | Potassium infusion IV-site complication | Pharmacological and Parenteral Therapies | Medication Safety & Admin | original-blocked-cross-category | `opus3_iv_potassium_safety_case_01_q6` | The item evaluates IV potassium infusion-site safety. |
| proposed | Pharmacological and Parenteral Therapies | Serotonin Syndrome Recognition | Pharmacological and Parenteral Therapies | Medication Safety & Admin | original-unresolved | `q9_1` | The item recognizes serotonin syndrome from medication exposure. |
| proposed | Pharmacological and Parenteral Therapies | Thyroid Storm Pharmacology Sequence | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-proposed | `cs_thyroid_storm_q2` | The item sequences thyroid-storm medication administration. |
| proposed | Pharmacological and Parenteral Therapies | Cryoprecipitate Role | Pharmacological and Parenteral Therapies | Transfusion & Blood Products | reclaim-proposed | `q7_3` | After approved shared licensing, this transfusion or blood-product row can keep its current category and use Transfusion & Blood Products. |
| proposed | Physiological Adaptation | acute hemorrhage prioritization | Physiological Adaptation | Cardiovascular Disorders | reclaim-proposed | `gpt_case_warfarin_mvr_2026_06_11_01_q4` | The item tests cardiovascular physiology, perfusion, dysrhythmia, hemorrhage, or hemodynamic response. |
| proposed | Physiological Adaptation | Acute variceal hemorrhage in cirrhosis | Physiological Adaptation | Cardiovascular Disorders | original-unresolved | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_q3` | The item tests cardiovascular physiology, perfusion, dysrhythmia, hemorrhage, or hemodynamic response. |
| proposed | Physiological Adaptation | Atrial Arrhythmias | Physiological Adaptation | Cardiovascular Disorders | original-unresolved | `ekg_b2_matrix_10` | The item tests cardiovascular physiology, perfusion, dysrhythmia, hemorrhage, or hemodynamic response. |
| proposed | Physiological Adaptation | Atrial Fibrillation | Physiological Adaptation | Cardiovascular Disorders | original-unresolved | `ekg_b2_mc_01` | The item tests cardiovascular physiology, perfusion, dysrhythmia, hemorrhage, or hemodynamic response. |
| proposed | Physiological Adaptation | Atrial Flutter | Physiological Adaptation | Cardiovascular Disorders | original-unresolved | `ekg_b2_mc_07` | The item tests cardiovascular physiology, perfusion, dysrhythmia, hemorrhage, or hemodynamic response. |
| proposed | Physiological Adaptation | AV Heart Blocks | Physiological Adaptation | Cardiovascular Disorders | original-unresolved | `ekg_b3_matrix_10` | The item tests cardiovascular physiology, perfusion, dysrhythmia, hemorrhage, or hemodynamic response. |
| proposed | Physiological Adaptation | First-Degree AV Block | Physiological Adaptation | Cardiovascular Disorders | original-unresolved | `ekg_b3_mc_01` | The item tests cardiovascular physiology, perfusion, dysrhythmia, hemorrhage, or hemodynamic response. |
| proposed | Physiological Adaptation | postoperative hemorrhage with hypovolemic shock | Physiological Adaptation | Cardiovascular Disorders | reclaim-proposed | `opus4_case_postop_sbar_01_q2` | The item tests cardiovascular physiology, perfusion, dysrhythmia, hemorrhage, or hemodynamic response. |
| proposed | Physiological Adaptation | AD Cause Identification | Physiological Adaptation | Endocrine & Neurological Disorders | original-unresolved | `q10_4` | The item identifies autonomic dysreflexia causes. |
| proposed | Physiological Adaptation | Autonomic Dysreflexia Triggers | Physiological Adaptation | Endocrine & Neurological Disorders | original-unresolved | `q10_1` | The item identifies an autonomic dysreflexia trigger. |
| proposed | Physiological Adaptation | Cushing Triad Recognition | Physiological Adaptation | Endocrine & Neurological Disorders | original-unresolved | `q6_1` | The item recognizes Cushing triad as a neurologic ICP sign. |
| proposed | Physiological Adaptation | Cushing Triad Significance | Physiological Adaptation | Endocrine & Neurological Disorders | original-unresolved | `q6_2` | The item interprets Cushing triad as impending herniation. |
| proposed | Physiological Adaptation | ICP Management Interventions | Physiological Adaptation | Endocrine & Neurological Disorders | original-unresolved | `q6_4` | The item selects ICP-management actions. |
| proposed | Physiological Adaptation | Acute Graft-Versus-Host Disease | Physiological Adaptation | Oncology & Immunotherapy Complications | original-unresolved | `opus_agvd_case_agvhd_01_q6` | The item tests oncology or immunotherapy complication recognition, treatment, or evaluation. |
| proposed | Physiological Adaptation | Immune Checkpoint Inhibitor Myocarditis | Physiological Adaptation | Oncology & Immunotherapy Complications | reclaim-unresolved | `opus_icit_case_01_q2` | The item tests oncology or immunotherapy complication recognition, treatment, or evaluation. |
| proposed | Physiological Adaptation | tumor lysis syndrome | Physiological Adaptation | Oncology & Immunotherapy Complications | reclaim-proposed | `gpt_case_gap_2026_06_11_case_tls_01_q2` | The item analyzes tumor lysis syndrome findings. |
| proposed | Physiological Adaptation | tumor lysis syndrome treatment response | Physiological Adaptation | Oncology & Immunotherapy Complications | reclaim-proposed | `gpt_case_gap_2026_06_11_case_tls_01_q5` | The item evaluates tumor lysis syndrome treatment response. |
| proposed | Physiological Adaptation | Celiac disease with dermatitis herpetiformis | Physiological Adaptation | Renal & Gastrointestinal Disorders | original-unresolved | `gpt_r1_regen_case_celiac_01_q3` | The item tests renal, urinary, gastrointestinal, or fluid-output physiology. |
| proposed | Physiological Adaptation | Intussusception Interventions | Physiological Adaptation | Renal & Gastrointestinal Disorders | original-unresolved | `q8_4` | The item selects intussusception interventions. |
| proposed | Physiological Adaptation | Intussusception Recognition | Physiological Adaptation | Renal & Gastrointestinal Disorders | original-unresolved | `q8_2` | The item recognizes intussusception. |
| proposed | Physiological Adaptation | Intussusception Recovery Sign | Physiological Adaptation | Renal & Gastrointestinal Disorders | original-unresolved | `q8_5` | The item recognizes recovery after intussusception treatment. |
| proposed | Physiological Adaptation | Pyloric Stenosis Metabolic Impact | Physiological Adaptation | Renal & Gastrointestinal Disorders | original-unresolved | `q8_3` | The item interprets pyloric stenosis metabolic effects. |
| proposed | Physiological Adaptation | Pyloric Stenosis Recognition | Physiological Adaptation | Renal & Gastrointestinal Disorders | original-unresolved | `q8_1` | The item recognizes pyloric stenosis. |
| proposed | Physiological Adaptation | Hemolytic Reaction Identification | Physiological Adaptation | Transfusion & Blood Products | original-unresolved | `q4_2` | After approved shared licensing, this transfusion or blood-product row can keep its current category and use Transfusion & Blood Products. |
| proposed | Psychosocial Integrity | caregiver burden and safety cue recognition | Psychosocial Integrity | Caregiver Role Strain & Family Coping | original-unresolved | `gpt_case_premium_next_case_caregiver_adaptation_dementia_03_matrix_cues` | The item identifies caregiver strain and family safety/coping cues. |
| proposed | Psychosocial Integrity | elder neglect recognition | Psychosocial Integrity | Mental Health Disorders | original-unresolved | `opus24_case_elder_neglect_med_mismanagement_01_q1` | The item recognizes elder neglect pattern and cognitive vulnerabilities. |
| proposed | Psychosocial Integrity | postpartum depression treatment response | Psychosocial Integrity | Mental Health Disorders | original-blocked-cross-category | `opus22_case_postpartum_intrusive_thoughts_01_q3` | The item evaluates postpartum depression/anxiety treatment response. |
| proposed | Psychosocial Integrity | postpartum intrusive thoughts versus psychosis | Psychosocial Integrity | Mental Health Disorders | original-blocked-cross-category | `opus22_case_postpartum_intrusive_thoughts_01_q1` | The item distinguishes postpartum intrusive thoughts from psychosis. |
| proposed | Psychosocial Integrity | health literacy teaching plan | Psychosocial Integrity | Therapeutic Communication | original-unresolved | `gpt_case_premium_2026_06_10_case05_cloze_teaching_03` | The item tests plain-language teaching and teach-back. |
| proposed | Psychosocial Integrity | lithium toxicity | Psychosocial Integrity | Therapeutic Communication | reclaim-proposed | `opus_case_lithium_toxicity_q6` | The item provides psychosocial support and factual teaching to family. |
| proposed | Psychosocial Integrity | medication adherence support | Psychosocial Integrity | Therapeutic Communication | original-unresolved | `gpt_case_premium_2026_06_10_case05_sata_adherence_04` | The item supports medication adherence using respectful communication and routines. |
| proposed | Psychosocial Integrity | Psychosocial support and TB adherence planning | Psychosocial Integrity | Therapeutic Communication | reclaim-proposed | `opus25_case_tb_airborne_treatment_monitoring_01_q6` | The item combines psychosocial assessment, teaching, and support for TB adherence. |
| proposed | Psychosocial Integrity | therapeutic communication during eating disorder refeeding | Psychosocial Integrity | Therapeutic Communication | reclaim-proposed | `opus26_case_refeeding_syndrome_01_q4` | The item responds therapeutically during eating-disorder refeeding distress. |
| proposed | Psychosocial Integrity | therapeutic communication for postpartum intrusive thoughts | Psychosocial Integrity | Therapeutic Communication | original-blocked-cross-category | `opus22_case_postpartum_intrusive_thoughts_01_q2` | The item tests therapeutic response after postpartum safety assessment. |
| proposed | Reduction of Risk Potential | acute kidney injury fluid response | Reduction of Risk Potential | Laboratory & Diagnostic Tests | original-unresolved | `io_matrix_prerenal_aki_recheck_04` | The item evaluates fluid response from I/O data. |
| proposed | Reduction of Risk Potential | bowel preparation fluid deficit | Reduction of Risk Potential | Laboratory & Diagnostic Tests | original-unresolved | `io_matrix_bowel_prep_deficit_08` | The item interprets I/O deficit during bowel preparation. |
| proposed | Reduction of Risk Potential | falling hemoglobin trend and suspected bleeding | Reduction of Risk Potential | Laboratory & Diagnostic Tests | original-unresolved | `gpt_u3_labtrend_2026_06_09_b_or_gi_bleed_hgb_06` | The item sequences response to falling hemoglobin trend. |
| proposed | Reduction of Risk Potential | falling magnesium trend | Reduction of Risk Potential | Laboratory & Diagnostic Tests | original-unresolved | `gpt_u3_labtrend_2026_06_09_cloze_magnesium_decline_08` | The item interprets magnesium lab trend. |
| proposed | Reduction of Risk Potential | fluid balance monitoring | Reduction of Risk Potential | Laboratory & Diagnostic Tests | original-unresolved | `io_fib_hf_net_balance_01` | The item calculates net fluid balance from a record. |
| proposed | Reduction of Risk Potential | rapid sodium correction trend | Reduction of Risk Potential | Laboratory & Diagnostic Tests | original-unresolved | `gpt_u3_labtrend_2026_06_09_b_cloze_sodium_overcorrection_08` | The item interprets sodium overcorrection lab trend. |
| proposed | Reduction of Risk Potential | Pressure injury staging | Reduction of Risk Potential | Skin & Wound Care | original-blocked-cross-category | `gpt_gap_jun12_matrix_pressure_injury_staging_01` | After approved shared licensing, this wound or pressure-injury row can keep its current category and use Skin & Wound Care. |
| proposed | Reduction of Risk Potential | wound measurement trend | Reduction of Risk Potential | Skin & Wound Care | reclaim-unresolved | `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q5` | After approved shared licensing, this wound or pressure-injury row can keep its current category and use Skin & Wound Care. |
| proposed | Safety and Infection Control | malignant hyperthermia | Safety and Infection Control | Medication Safety & Admin | original-unresolved | `vit_10` | The item recognizes malignant hyperthermia after anesthetic exposure. |
| proposed | Safety and Infection Control | Child Abuse Interventions | Safety and Infection Control | Patient & Environment Safety | original-unresolved | `q3_4` | The item selects safety and assessment actions for suspected abuse. |
| proposed | Safety and Infection Control | DIC Nursing Interventions | Safety and Infection Control | Patient & Environment Safety | reclaim-proposed | `q7_4` | The item selects bleeding-safety interventions for DIC. |
| proposed | Safety and Infection Control | post-fall monitoring sequence | Safety and Infection Control | Patient & Environment Safety | reclaim-proposed | `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q4` | The item sequences ongoing monitoring and fall precautions after a fall. |
| proposed | Safety and Infection Control | Shaken Baby Syndrome Signs | Safety and Infection Control | Patient & Environment Safety | original-unresolved | `q3_1` | The item identifies abusive head trauma findings. |
| proposed | Safety and Infection Control | C. difficile colitis and dehydration | Safety and Infection Control | PPE & Sterile Technique | reclaim-proposed | `opus20_case_cdiff_01_q2` | The item corrects visitor PPE for CDI contact precautions. |
| proposed | Safety and Infection Control | home wound-care infection prevention | Safety and Infection Control | Skin & Wound Care | reclaim-proposed | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q1` | After approved shared licensing, this wound or pressure-injury row can keep its current category and use Skin & Wound Care. |
| proposed | Safety and Infection Control | Moisture management for pressure injury prevention | Safety and Infection Control | Skin & Wound Care | original-unresolved | `gpt_gap_2026_06_10_b_or_moisture_pressure_prevention_04` | After approved shared licensing, this wound or pressure-injury row can keep its current category and use Skin & Wound Care. |
| proposed | Safety and Infection Control | Pressure injury prevention in long-term care | Safety and Infection Control | Skin & Wound Care | original-unresolved | `gpt_case_gap_2026_06_11_pressure_ltc_part_1_matrix_risk` | After approved shared licensing, this wound or pressure-injury row can keep its current category and use Skin & Wound Care. |
| proposed | Safety and Infection Control | Pressure injury prevention in long-term care | Safety and Infection Control | Skin & Wound Care | original-unresolved | `gpt_case_gap_2026_06_11_pressure_ltc_part_2_sata_plan` | After approved shared licensing, this wound or pressure-injury row can keep its current category and use Skin & Wound Care. |
| proposed | Safety and Infection Control | Pressure injury prevention in long-term care | Safety and Infection Control | Skin & Wound Care | original-unresolved | `gpt_case_gap_2026_06_11_pressure_ltc_part_4_cloze_outcome` | After approved shared licensing, this wound or pressure-injury row can keep its current category and use Skin & Wound Care. |
| proposed | Safety and Infection Control | Pressure injury prevention in rehabilitation | Safety and Infection Control | Skin & Wound Care | original-unresolved | `gpt_gap_2026_06_10_or_pressure_injury_prevention_04` | After approved shared licensing, this wound or pressure-injury row can keep its current category and use Skin & Wound Care. |
| proposed | Safety and Infection Control | CAUTI Prevention Bundle | Safety and Infection Control | Standard Precautions & Hygiene | original-unresolved | `gpt_gap_jun11_fib_cauti_prevention_01` | The item tests CAUTI prevention through catheter necessity review. |
| proposed | Safety and Infection Control | Transfusion Reaction Priority | Safety and Infection Control | Transfusion & Blood Products | reclaim-unresolved | `q4_1` | After approved shared licensing, this transfusion or blood-product row can keep its current category and use Transfusion & Blood Products. |
| proposed | Safety and Infection Control | Transfusion Reaction Protocol | Safety and Infection Control | Transfusion & Blood Products | reclaim-unresolved | `q4_4` | After approved shared licensing, this transfusion or blood-product row can keep its current category and use Transfusion & Blood Products. |
| carried-forward | Basic Care and Comfort | early refeeding gastrointestinal discomfort | Basic Care and Comfort | Nutritional & Fluid Support | reclaim-proposed | `opus26_case_refeeding_syndrome_01_q2` | The item addresses GI discomfort while maintaining the refeeding meal plan. |
| carried-forward | Basic Care and Comfort | Mania Nutritional Support | Basic Care and Comfort | Nutritional & Fluid Support | reclaim-proposed | `q5_3` | The item selects nutrition support for mania. |
| carried-forward | Basic Care and Comfort | Mucositis TPN and CRBSI | Basic Care and Comfort | Nutritional & Fluid Support | reclaim-proposed | `opus_tpn_case_mucositis_01_q6` | The item evaluates whether TPN can be discontinued for enteral intake. |
| carried-forward | Basic Care and Comfort | complication prevention in delirium | Basic Care and Comfort | Sleep & Rest | reclaim-proposed | `gpt_2026_06_13_case_delirium_uti_01_q6` | The item includes delirium complication prevention with sleep-preserving care. |
| carried-forward | Health Promotion and Maintenance | teach-back discharge education | Health Promotion and Maintenance | Chronic Disease Management & Lifestyle | reclaim-proposed | `opus1_case_tha_discharge_lep_01_q2` | The item tests teach-back discharge education and self-management readiness. |
| carried-forward | Health Promotion and Maintenance | postpartum depression recovery teaching | Health Promotion and Maintenance | Maternal-Newborn Care & Teaching | reclaim-proposed | `opus22_case_postpartum_intrusive_thoughts_01_q5` | The item teaches postpartum recovery and follow-up. |
| carried-forward | Management of Care | resource planning for caregiver respite | Management of Care | Caregiver Role Strain & Family Coping | reclaim-proposed | `gpt_case_premium_next_case_caregiver_adaptation_dementia_03_fib_respite` | The item calculates planned respite hours in a caregiver-support plan. |
| carried-forward | Management of Care | Consent and family involvement in suicide safety planning | Management of Care | Confidentiality & HIPAA | reclaim-proposed | `opus12_case_inpatient_suicide_risk_01_q5` | The item tests confidentiality boundaries in suicide safety planning. |
| carried-forward | Management of Care | delirium discharge readiness | Management of Care | Discharge Planning & Handoff | reclaim-proposed | `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q5` | The item tests family understanding of when to seek post-discharge help. |
| carried-forward | Management of Care | home oxygen discharge coordination | Management of Care | Discharge Planning & Handoff | reclaim-proposed | `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q3` | The item sequences discharge coordination for home oxygen. |
| carried-forward | Management of Care | interdisciplinary discharge safety planning | Management of Care | Discharge Planning & Handoff | reclaim-proposed | `opus24_case_elder_neglect_med_mismanagement_01_q6` | The item tests interdisciplinary discharge safety planning. |
| carried-forward | Management of Care | Mandated Reporting | Management of Care | Legal & Ethical Principles | reclaim-proposed | `q3_3` | The item tests mandated reporting responsibilities. |
| carried-forward | Management of Care | Acute Graft-Versus-Host Disease | Management of Care | Prioritization & Delegation | reclaim-proposed | `opus_agvd_case_agvhd_01_q3` | The item asks for the highest-priority problem during deterioration. |
| carried-forward | Management of Care | Acute Graft-Versus-Host Disease | Management of Care | Prioritization & Delegation | reclaim-proposed | `opus_agvd_case_agvhd_01_q5` | The item asks which concurrent ordered action to initiate first. |
| carried-forward | Management of Care | Adrenal crisis emergency response | Management of Care | Prioritization & Delegation | reclaim-proposed | `gpt_case_gap_2026_06_11_adrenal_or_03` | The item sequences emergency response actions. |
| carried-forward | Management of Care | Cardiac Arrest Resuscitation Sequence | Management of Care | Prioritization & Delegation | reclaim-proposed | `cs_stemi_vfib_04_part_2` | The item sequences resuscitation actions, which is priority-setting in Management of Care. |
| carried-forward | Management of Care | Emergency hyperkalemia management | Management of Care | Prioritization & Delegation | reclaim-proposed | `gpt_case_gap_2026_06_11_aki_or_03` | The item sequences emergency hyperkalemia actions. |
| carried-forward | Management of Care | Escalation for acute pulmonary edema | Management of Care | Prioritization & Delegation | reclaim-proposed | `gpt_case_gap_2026_06_11_adhf_or_03` | The item sequences escalation for acute pulmonary edema. |
| carried-forward | Management of Care | lithium toxicity | Management of Care | Prioritization & Delegation | reclaim-proposed | `opus_case_lithium_toxicity_q2` | The item asks for immediate priority actions for declining status and vomiting. |
| carried-forward | Management of Care | Mucositis TPN and CRBSI | Management of Care | Prioritization & Delegation | reclaim-proposed | `opus_tpn_case_mucositis_01_q3` | The item sequences intervention coordination for suspected CRBSI. |
| carried-forward | Management of Care | Pancreatitis deterioration response | Management of Care | Prioritization & Delegation | reclaim-proposed | `gpt_case_gap_2026_06_11_panc_or_03` | The item sequences pancreatitis deterioration response. |
| carried-forward | Management of Care | Post-stroke outpatient rehabilitation and safe feeding | Management of Care | Prioritization & Delegation | reclaim-proposed | `gpt_case_gap_2026_06_11_post_stroke_rehab_part_4_cloze_priority` | The item tests priority-setting, delegation, or escalation. |
| carried-forward | Management of Care | Pulmonary Edema Interventions | Management of Care | Prioritization & Delegation | reclaim-proposed | `cs_adhf_pulm_edema_01_part_2` | The item orders immediate stabilization actions, which is priority-setting in Management of Care. |
| carried-forward | Management of Care | Response to heparin-associated bleeding | Management of Care | Prioritization & Delegation | reclaim-proposed | `gpt_case_gap_2026_06_11_anticoag_or_03` | The item sequences response to anticoagulant-associated bleeding. |
| carried-forward | Management of Care | Sepsis bundle nursing priorities | Management of Care | Prioritization & Delegation | reclaim-proposed | `gpt_case_gap_2026_06_11_sepsis_or_03` | The item sequences sepsis-bundle nursing priorities. |
| carried-forward | Management of Care | Septic Shock Interventions | Management of Care | Prioritization & Delegation | reclaim-proposed | `cs_sepsis_shock_01_part_2` | The item orders septic shock interventions, which is priority-setting in Management of Care. |
| carried-forward | Management of Care | status epilepticus | Management of Care | Prioritization & Delegation | reclaim-proposed | `opus_case_se_01_q4` | The item asks which problem to prioritize during respiratory compromise. |
| carried-forward | Pharmacological and Parenteral Therapies | anticoagulant medication reconciliation | Pharmacological and Parenteral Therapies | Anticoagulant Therapy | reclaim-proposed | `opus1_case_discharge_med_rec_anticoag_01_q2` | The item clarifies anticoagulant medication reconciliation. |
| carried-forward | Pharmacological and Parenteral Therapies | rivaroxaban renal function monitoring | Pharmacological and Parenteral Therapies | Anticoagulant Therapy | reclaim-proposed | `opus1_case_tha_discharge_lep_01_q4` | The item monitors renal function while using rivaroxaban. |
| carried-forward | Pharmacological and Parenteral Therapies | warfarin discharge teaching | Pharmacological and Parenteral Therapies | Anticoagulant Therapy | reclaim-proposed | `opus1_case_discharge_med_rec_anticoag_01_q5` | The item teaches warfarin discharge safety and monitoring. |
| carried-forward | Pharmacological and Parenteral Therapies | Anti-tuberculosis hepatotoxicity monitoring | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-proposed | `opus25_case_tb_airborne_treatment_monitoring_01_q5` | The item monitors anti-tuberculosis drug hepatotoxicity. |
| carried-forward | Pharmacological and Parenteral Therapies | Antimotility agents in suspected C. difficile infection | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-proposed | `gpt_case_opus5_cdi_immunocompromised_01_q1` | The item identifies unsafe antimotility medication use in suspected CDI. |
| carried-forward | Pharmacological and Parenteral Therapies | Oral vancomycin route for C. difficile infection | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-proposed | `gpt_case_opus5_cdi_immunocompromised_01_q3` | The item tests oral vancomycin route/rationale for CDI. |
| carried-forward | Pharmacological and Parenteral Therapies | Organophosphate Antidotes | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-proposed | `q2_4` | The item tests antidote medication selection for organophosphate poisoning. |
| carried-forward | Pharmacological and Parenteral Therapies | safe IV potassium administration | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-proposed | `opus24_case_elder_neglect_med_mismanagement_01_q4` | The item tests safe IV potassium administration. |
| carried-forward | Pharmacological and Parenteral Therapies | Mania Medications | Pharmacological and Parenteral Therapies | Psychotropic Medications | reclaim-proposed | `q5_4` | The item tests medication treatment for mania. |
| carried-forward | Physiological Adaptation | emergent hyperkalemia management | Physiological Adaptation | Electrolyte Imbalances | reclaim-proposed | `gpt_case_gap_2026_06_11_case_tls_01_q3` | The item prioritizes emergent hyperkalemia. |
| carried-forward | Physiological Adaptation | Infant ICP Signs | Physiological Adaptation | Endocrine & Neurological Disorders | reclaim-proposed | `q3_5` | The item identifies worsening increased ICP in an infant. |
| carried-forward | Physiological Adaptation | Postpartum hemorrhage due to uterine atony | Physiological Adaptation | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `gpt_pph_2026_06_16_case_01_bowtie` | The item tests maternal-newborn assessment, complications, or teaching. |
| carried-forward | Physiological Adaptation | Postpartum hemorrhage due to uterine atony | Physiological Adaptation | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `gpt_pph_2026_06_16_case_01_q1` | The item tests maternal-newborn assessment, complications, or teaching. |
| carried-forward | Physiological Adaptation | Postpartum hemorrhage due to uterine atony | Physiological Adaptation | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `gpt_pph_2026_06_16_case_01_q2` | The item tests maternal-newborn assessment, complications, or teaching. |
| carried-forward | Physiological Adaptation | Postpartum hemorrhage due to uterine atony | Physiological Adaptation | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `gpt_pph_2026_06_16_case_01_q4` | The item coordinates postpartum hemorrhage team response. |
| carried-forward | Physiological Adaptation | Postpartum hemorrhage due to uterine atony | Physiological Adaptation | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `gpt_pph_2026_06_16_case_01_q5` | The item tests maternal-newborn assessment, complications, or teaching. |
| carried-forward | Physiological Adaptation | Postpartum hemorrhage due to uterine atony | Physiological Adaptation | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `gpt_pph_2026_06_16_case_01_q6` | The item tests maternal-newborn assessment, complications, or teaching. |
| carried-forward | Physiological Adaptation | lithium toxicity | Physiological Adaptation | Renal & Gastrointestinal Disorders | reclaim-proposed | `opus_case_lithium_toxicity_q3` | The item tests renal, urinary, gastrointestinal, or fluid-output physiology. |
| carried-forward | Physiological Adaptation | NMS Renal Risk | Physiological Adaptation | Renal & Gastrointestinal Disorders | reclaim-proposed | `q9_5` | The item tests renal, urinary, gastrointestinal, or fluid-output physiology. |
| carried-forward | Psychosocial Integrity | family teaching about delirium recovery | Psychosocial Integrity | Mental Health Disorders | reclaim-proposed | `gpt_2026_06_13_case_delirium_uti_01_q5` | The item teaches family expectations for delirium recovery. |
| carried-forward | Psychosocial Integrity | domestic violence disclosure during child safety planning | Psychosocial Integrity | Therapeutic Communication | reclaim-proposed | `gpt_case_opus23_nat_toddler_01_q3` | The item tests therapeutic response to domestic violence disclosure. |
| carried-forward | Psychosocial Integrity | ostomy psychosocial adaptation | Psychosocial Integrity | Therapeutic Communication | reclaim-proposed | `gpt_opus21_case_colostomy_lep_discharge_01_q3` | The item addresses psychosocial adaptation to a colostomy. |
| carried-forward | Reduction of Risk Potential | PTU Adverse Effects | Reduction of Risk Potential | Laboratory & Diagnostic Tests | reclaim-proposed | `cs_thyroid_storm_q4` | The item interprets WBC monitoring for severe PTU adverse effect. |
| carried-forward | Reduction of Risk Potential | intrapartum fetal monitoring | Reduction of Risk Potential | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `fhr_gemini_smoke_2026_06_13_01` | The item tests maternal-newborn assessment, complications, or teaching. |
| carried-forward | Reduction of Risk Potential | intrapartum fetal monitoring | Reduction of Risk Potential | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `fhr_gemini_smoke_2026_06_13_02` | The item tests maternal-newborn assessment, complications, or teaching. |
| carried-forward | Reduction of Risk Potential | intrapartum fetal monitoring | Reduction of Risk Potential | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `fhr_gemini_smoke_2026_06_13_03` | The item tests maternal-newborn assessment, complications, or teaching. |
| carried-forward | Reduction of Risk Potential | intrapartum fetal monitoring | Reduction of Risk Potential | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `fhr_gemini_smoke_2026_06_13_04` | The item tests maternal-newborn assessment, complications, or teaching. |
| carried-forward | Reduction of Risk Potential | intrapartum fetal monitoring | Reduction of Risk Potential | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `fhr_gemini_smoke_2026_06_13_05` | The item tests maternal-newborn assessment, complications, or teaching. |
| carried-forward | Reduction of Risk Potential | intrapartum fetal monitoring | Reduction of Risk Potential | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `fhr_gemini_smoke_2026_06_13_06` | The item tests maternal-newborn assessment, complications, or teaching. |
| carried-forward | Reduction of Risk Potential | Late postpartum preeclampsia with severe features | Reduction of Risk Potential | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_bowtie` | The item tests maternal-newborn assessment, complications, or teaching. |
| carried-forward | Reduction of Risk Potential | Late postpartum preeclampsia with severe features | Reduction of Risk Potential | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q1` | The item tests maternal-newborn assessment, complications, or teaching. |
| carried-forward | Reduction of Risk Potential | Late postpartum preeclampsia with severe features | Reduction of Risk Potential | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q2` | The item tests maternal-newborn assessment, complications, or teaching. |
| carried-forward | Reduction of Risk Potential | Late postpartum preeclampsia with severe features | Reduction of Risk Potential | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q3` | The item tests maternal-newborn assessment, complications, or teaching. |
| carried-forward | Reduction of Risk Potential | Late postpartum preeclampsia with severe features | Reduction of Risk Potential | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q6` | The item tests maternal-newborn assessment, complications, or teaching. |
| carried-forward | Reduction of Risk Potential | Magnesium sulfate toxicity in preeclampsia | Reduction of Risk Potential | Maternal-Newborn Care & Teaching | original-blocked-cross-category | `gpt_u6_matrix_cloze_2026_06_09_cloze_preeclampsia_magnesium_20` | The item tests maternal-newborn assessment, complications, or teaching. |
| carried-forward | Safety and Infection Control | hyperactive delirium safety | Safety and Infection Control | Patient & Environment Safety | reclaim-proposed | `gpt_2026_06_13_case_delirium_uti_01_q2` | The item tests safety actions for hyperactive delirium. |
| carried-forward | Safety and Infection Control | safe mobility and fall prevention | Safety and Infection Control | Patient & Environment Safety | reclaim-proposed | `gpt_case_premium_next_case_rehab_pressure_bowel_02_or_transfer` | The item tests safe mobility and fall-prevention transfer actions. |
| carried-forward | Safety and Infection Control | C. difficile colitis and dehydration | Safety and Infection Control | Transmission-Based Precautions | reclaim-proposed | `opus20_case_cdiff_01_q3` | The item reinforces CDI soap-and-water and gown/glove precautions. |

### category_and_topic

| Status | Current category | Current topic | Proposed category | Proposed topic | Sources | ID | Reason |
|---|---|---|---|---|---|---|---|
| proposed | Reduction of Risk Potential | discharge readiness after sedation with language barrier | Management of Care | Discharge Planning & Handoff | reclaim-proposed | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q2` | The item assesses discharge readiness after sedation with language barriers. |
| proposed | Safety and Infection Control | Pressure injury prevention in long-term care | Management of Care | Discharge Planning & Handoff | original-unresolved | `gpt_case_gap_2026_06_11_pressure_ltc_part_3_mc_delegate` | The item tests discharge planning, referrals, handoff, or care coordination. |
| proposed | Safety and Infection Control | warfarin-enoxaparin-bridge | Pharmacological and Parenteral Therapies | Anticoagulant Therapy | reclaim-proposed | `opus_case_warfarin_bridge_q2` | The item manages NSAID use with warfarin/enoxaparin bleeding risk. |
| proposed | Safety and Infection Control | warfarin-enoxaparin-bridge | Pharmacological and Parenteral Therapies | Anticoagulant Therapy | reclaim-unresolved | `opus_case_warfarin_bridge_q4` | The item teaches bleeding urgency while on anticoagulation. |
| proposed | Basic Care and Comfort | warfarin-enoxaparin-bridge | Pharmacological and Parenteral Therapies | Anticoagulant Therapy | reclaim-proposed | `opus_case_warfarin_bridge_q5` | The item teaches consistent vitamin K intake with warfarin. |
| proposed | Management of Care | warfarin-enoxaparin-bridge | Pharmacological and Parenteral Therapies | Anticoagulant Therapy | reclaim-proposed | `opus_case_warfarin_bridge_q6` | The item addresses return-to-work safety while anticoagulated. |
| proposed | Management of Care | enteral pump duration calculation | Pharmacological and Parenteral Therapies | Dosage Calculations | original-unresolved | `gpt_visual_smoke_2026_06_12_fib_device_enteral_duration_10` | Review correction: enteral-pump duration is a medication/nutrition-device calculation matching the Dosage Calculations precedent. |
| proposed | Health Promotion and Maintenance | family teaching for patient-controlled analgesia safety | Pharmacological and Parenteral Therapies | Medication Safety & Admin | reclaim-proposed | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01_q4` | The item teaches family PCA medication safety. |
| proposed | Reduction of Risk Potential | Injection route recognition from skin cross-section | Pharmacological and Parenteral Therapies | Medication Safety & Admin | original-blocked-cross-category | `gpt_injection_smoke_2026_06_15_mc_intradermal_01` | The item identifies parenteral injection route/technique. |
| proposed | Reduction of Risk Potential | Injection route recognition from skin cross-section | Pharmacological and Parenteral Therapies | Medication Safety & Admin | original-blocked-cross-category | `gpt_injection_smoke_2026_06_15_mc_intramuscular_03` | The item identifies parenteral injection route/technique. |
| proposed | Reduction of Risk Potential | Injection route recognition from skin cross-section | Pharmacological and Parenteral Therapies | Medication Safety & Admin | original-blocked-cross-category | `gpt_injection_smoke_2026_06_15_mc_intravenous_04` | The item identifies parenteral injection route/technique. |
| proposed | Reduction of Risk Potential | Injection route recognition from skin cross-section | Pharmacological and Parenteral Therapies | Medication Safety & Admin | original-blocked-cross-category | `gpt_injection_smoke_2026_06_15_mc_subcutaneous_02` | The item identifies parenteral injection route/technique. |
| proposed | Reduction of Risk Potential | Injection visual cue interpretation | Pharmacological and Parenteral Therapies | Medication Safety & Admin | original-blocked-cross-category | `gpt_injection_smoke_2026_06_15_matrix_subq_cues_07` | The item classifies subcutaneous injection cues. |
| proposed | Reduction of Risk Potential | Injection visual cue interpretation | Pharmacological and Parenteral Therapies | Medication Safety & Admin | original-blocked-cross-category | `gpt_injection_smoke_2026_06_15_sata_im_cues_06` | The item identifies IM injection technique cues. |
| proposed | Physiological Adaptation | Postpartum hemorrhage due to uterine atony | Pharmacological and Parenteral Therapies | Medication Safety & Admin | original-blocked-cross-category | `gpt_pph_2026_06_16_case_01_q3` | The item tests medication safety, administration, adverse effects, or follow-up. |
| proposed | Reduction of Risk Potential | Target layer identification from visual | Pharmacological and Parenteral Therapies | Medication Safety & Admin | original-blocked-cross-category | `gpt_injection_smoke_2026_06_15_mc_layer_highlight_05` | The item identifies parenteral injection target layer. |
| proposed | Reduction of Risk Potential | Visual technique analysis | Pharmacological and Parenteral Therapies | Medication Safety & Admin | original-blocked-cross-category | `gpt_injection_smoke_2026_06_15_matrix_route_match_08` | The item matches parenteral route technique cues. |
| proposed | Reduction of Risk Potential | adult burn posterior surface TBSA | Physiological Adaptation | Burn Management | original-blocked-cross-category | `burn_mc_posterior_tbsa_07` | The item tests burn assessment, TBSA, or burn fluid management. |
| proposed | Reduction of Risk Potential | adult burn resuscitation Parkland calculation | Physiological Adaptation | Burn Management | original-blocked-cross-category | `gpt_visual_smoke_2026_06_12_fib_burn_parkland_rate_01` | The item tests burn assessment, TBSA, or burn fluid management. |
| proposed | Reduction of Risk Potential | adult burn TBSA estimation | Physiological Adaptation | Burn Management | original-blocked-cross-category | `burn_fib_tbsa_anterior_mix_01` | The item tests burn assessment, TBSA, or burn fluid management. |
| proposed | Reduction of Risk Potential | adult Rule of Nines region recognition | Physiological Adaptation | Burn Management | original-blocked-cross-category | `gpt_visual_smoke_2026_06_12_matrix_burn_regions_03` | The item tests burn assessment, TBSA, or burn fluid management. |
| proposed | Basic Care and Comfort | adult Rule of Nines TBSA estimation | Physiological Adaptation | Burn Management | original-blocked-cross-category | `gpt_visual_smoke_2026_06_12_mc_burn_tbsa_02` | The item tests burn assessment, TBSA, or burn fluid management. |
| proposed | Reduction of Risk Potential | burn Parkland calculation verification | Physiological Adaptation | Burn Management | original-blocked-cross-category | `burn_matrix_parkland_values_05` | The item tests burn assessment, TBSA, or burn fluid management. |
| proposed | Reduction of Risk Potential | ADHF Pathophysiology | Physiological Adaptation | Cardiovascular Disorders | reclaim-proposed | `cs_adhf_pulm_edema_01_part_3` | The item tests cardiovascular physiology, perfusion, dysrhythmia, hemorrhage, or hemodynamic response. |
| proposed | Reduction of Risk Potential | anticoagulation reversal outcome evaluation | Physiological Adaptation | Cardiovascular Disorders | reclaim-proposed | `gpt_case_warfarin_mvr_2026_06_11_01_q6` | The item tests cardiovascular physiology, perfusion, dysrhythmia, hemorrhage, or hemodynamic response. |
| proposed | Pharmacological and Parenteral Therapies | Diuretic Therapy Evaluation | Physiological Adaptation | Cardiovascular Disorders | reclaim-proposed | `cs_adhf_pulm_edema_01_part_4` | The item tests cardiovascular physiology, perfusion, dysrhythmia, hemorrhage, or hemodynamic response. |
| proposed | Reduction of Risk Potential | evaluating resuscitation response and OR handoff | Physiological Adaptation | Cardiovascular Disorders | reclaim-proposed | `opus4_case_postop_sbar_01_q6` | The item evaluates hemorrhage resuscitation response and OR handoff. |
| proposed | Pharmacological and Parenteral Therapies | fluid resuscitation | Physiological Adaptation | Cardiovascular Disorders | original-unresolved | `vit_04` | The item tests cardiovascular physiology, perfusion, dysrhythmia, hemorrhage, or hemodynamic response. |
| proposed | Reduction of Risk Potential | Immune Checkpoint Inhibitor Myocarditis | Physiological Adaptation | Cardiovascular Disorders | reclaim-proposed | `opus_icit_case_01_q4` | The item tests cardiovascular physiology, perfusion, dysrhythmia, hemorrhage, or hemodynamic response. |
| proposed | Reduction of Risk Potential | new-onset atrial fibrillation | Physiological Adaptation | Cardiovascular Disorders | original-unresolved | `rhy_afib_001` | The item tests cardiovascular physiology, perfusion, dysrhythmia, hemorrhage, or hemodynamic response. |
| proposed | Health Promotion and Maintenance | Pacemaker Discharge Teaching | Physiological Adaptation | Cardiovascular Disorders | original-unresolved | `ekg_b5_sata_06` | The item tests cardiovascular physiology, perfusion, dysrhythmia, hemorrhage, or hemodynamic response. |
| proposed | Reduction of Risk Potential | postoperative deterioration cue recognition | Physiological Adaptation | Cardiovascular Disorders | reclaim-proposed | `opus4_case_postop_sbar_01_q1` | The item tests cardiovascular physiology, perfusion, dysrhythmia, hemorrhage, or hemodynamic response. |
| proposed | Pharmacological and Parenteral Therapies | Postoperative pulmonary embolism with right ventricular strain | Physiological Adaptation | Cardiovascular Disorders | reclaim-proposed | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q5` | The item monitors RV strain/perfusion in PE. |
| proposed | Pharmacological and Parenteral Therapies | status epilepticus | Physiological Adaptation | Cardiovascular Disorders | reclaim-proposed | `opus_case_se_01_q3` | The item tests cardiovascular physiology, perfusion, dysrhythmia, hemorrhage, or hemodynamic response. |
| proposed | Pharmacological and Parenteral Therapies | Prerenal acute kidney injury with hyperkalemia | Physiological Adaptation | Electrolyte Imbalances | reclaim-proposed | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q4` | The item treats emergent hyperkalemia in AKI. |
| proposed | Reduction of Risk Potential | Acute ischemic stroke thrombolysis and thrombectomy complications | Physiological Adaptation | Endocrine & Neurological Disorders | original-unresolved | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_bowtie` | The item synthesizes acute ischemic stroke care. |
| proposed | Reduction of Risk Potential | Acute ischemic stroke thrombolysis and thrombectomy complications | Physiological Adaptation | Endocrine & Neurological Disorders | original-unresolved | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q4` | The item monitors neurologic complications after stroke intervention. |
| proposed | Reduction of Risk Potential | increased intracranial pressure | Physiological Adaptation | Endocrine & Neurological Disorders | original-unresolved | `vit_05` | The item interprets increased intracranial pressure findings. |
| proposed | Reduction of Risk Potential | status epilepticus | Physiological Adaptation | Endocrine & Neurological Disorders | reclaim-unresolved | `opus_case_se_01_q5` | The item tests endocrine or neurologic disorder recognition, intervention, or monitoring. |
| proposed | Pharmacological and Parenteral Therapies | Acute Graft-Versus-Host Disease | Physiological Adaptation | Oncology & Immunotherapy Complications | reclaim-proposed | `opus_agvd_case_agvhd_01_q4` | The item tests oncology or immunotherapy complication recognition, treatment, or evaluation. |
| proposed | Health Promotion and Maintenance | Celiac disease with dermatitis herpetiformis | Physiological Adaptation | Renal & Gastrointestinal Disorders | reclaim-proposed | `gpt_r1_regen_case_celiac_01_q4` | The item tests renal, urinary, gastrointestinal, or fluid-output physiology. |
| proposed | Health Promotion and Maintenance | Celiac disease with dermatitis herpetiformis | Physiological Adaptation | Renal & Gastrointestinal Disorders | reclaim-unresolved | `gpt_r1_regen_case_celiac_01_q5` | The item tests renal, urinary, gastrointestinal, or fluid-output physiology. |
| proposed | Reduction of Risk Potential | lithium toxicity | Physiological Adaptation | Renal & Gastrointestinal Disorders | reclaim-proposed | `opus_case_lithium_toxicity_q5` | The item tests renal, urinary, gastrointestinal, or fluid-output physiology. |
| proposed | Reduction of Risk Potential | Monitoring for fulminant C. difficile infection and toxic megacolon | Physiological Adaptation | Renal & Gastrointestinal Disorders | reclaim-proposed | `gpt_case_opus5_cdi_immunocompromised_01_q4` | The item monitors for fulminant CDI/toxic megacolon. |
| proposed | Reduction of Risk Potential | pediatric dehydration cue recognition | Physiological Adaptation | Renal & Gastrointestinal Disorders | reclaim-unresolved | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03_q1` | The item tests renal, urinary, gastrointestinal, or fluid-output physiology. |
| proposed | Reduction of Risk Potential | postoperative colostomy findings | Physiological Adaptation | Renal & Gastrointestinal Disorders | reclaim-proposed | `gpt_opus21_case_colostomy_lep_discharge_01_q4` | The item interprets postoperative colostomy findings. |
| proposed | Pharmacological and Parenteral Therapies | Prerenal acute kidney injury with hyperkalemia | Physiological Adaptation | Renal & Gastrointestinal Disorders | reclaim-proposed | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q2` | The item recognizes prerenal AKI with hyperkalemia. |
| proposed | Pharmacological and Parenteral Therapies | Prerenal acute kidney injury with hyperkalemia | Physiological Adaptation | Renal & Gastrointestinal Disorders | reclaim-proposed | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q5` | The item evaluates renal response in prerenal AKI. |
| proposed | Reduction of Risk Potential | renal and delirium trend evaluation | Physiological Adaptation | Renal & Gastrointestinal Disorders | reclaim-proposed | `gpt_2026_06_13_case_delirium_uti_01_q4` | The item evaluates renal, infection, and delirium recovery trends. |
| proposed | Reduction of Risk Potential | status epilepticus | Physiological Adaptation | Renal & Gastrointestinal Disorders | reclaim-unresolved | `opus_case_se_01_q6` | The item tests renal, urinary, gastrointestinal, or fluid-output physiology. |
| proposed | Health Promotion and Maintenance | COPD discharge teaching | Physiological Adaptation | Respiratory & Infectious Disorders | reclaim-proposed | `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q2` | The item tests respiratory status, oxygenation, ventilation, or respiratory infection. |
| proposed | Reduction of Risk Potential | GBS diagnostic and respiratory monitoring data | Physiological Adaptation | Respiratory & Infectious Disorders | reclaim-proposed | `gpt_case_gbs_respiratory_compromise_01_q2` | The item tests respiratory status, oxygenation, ventilation, or respiratory infection. |
| proposed | Pharmacological and Parenteral Therapies | GBS treatment plan and respiratory thresholds | Physiological Adaptation | Respiratory & Infectious Disorders | reclaim-proposed | `gpt_case_gbs_respiratory_compromise_01_q4` | The item tests respiratory status, oxygenation, ventilation, or respiratory infection. |
| proposed | Reduction of Risk Potential | portable oxygen planning | Physiological Adaptation | Respiratory & Infectious Disorders | reclaim-proposed | `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q5` | The item tests respiratory status, oxygenation, ventilation, or respiratory infection. |
| proposed | Reduction of Risk Potential | Evaluating Sepsis Interventions | Physiological Adaptation | Sepsis & Septic Shock | reclaim-proposed | `cs_sepsis_shock_01_part_3` | The item tests sepsis or septic-shock recognition, intervention, or response. |
| proposed | Pharmacological and Parenteral Therapies | Mucositis TPN and CRBSI | Physiological Adaptation | Sepsis & Septic Shock | reclaim-proposed | `opus_tpn_case_mucositis_01_q2` | The item tests sepsis or septic-shock recognition, intervention, or response. |
| proposed | Safety and Infection Control | Sepsis from urinary source | Physiological Adaptation | Sepsis & Septic Shock | original-unresolved | `gpt_case_gap_2026_06_11_sepsis_matrix_01` | The item tests sepsis or septic-shock recognition, intervention, or response. |
| proposed | Reduction of Risk Potential | Septic shock recognition | Physiological Adaptation | Sepsis & Septic Shock | reclaim-proposed | `gpt_case_gap_2026_06_11_sepsis_cloze_02` | The item tests sepsis or septic-shock recognition, intervention, or response. |
| proposed | Reduction of Risk Potential | Urine output target in sepsis | Physiological Adaptation | Sepsis & Septic Shock | reclaim-unresolved | `gpt_case_gap_2026_06_11_sepsis_fib_04` | The item tests sepsis or septic-shock recognition, intervention, or response. |
| proposed | Pharmacological and Parenteral Therapies | Vasopressor Titration | Physiological Adaptation | Sepsis & Septic Shock | reclaim-proposed | `cs_sepsis_shock_01_part_4` | The item tests sepsis or septic-shock recognition, intervention, or response. |
| proposed | Health Promotion and Maintenance | family education for delirium prevention | Psychosocial Integrity | Mental Health Disorders | reclaim-unresolved | `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q4` | The item teaches family prevention/monitoring for delirium recurrence. |
| proposed | Health Promotion and Maintenance | post-sedation discharge teaching comprehension | Psychosocial Integrity | Therapeutic Communication | reclaim-unresolved | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q5` | The item evaluates teach-back comprehension with interpreter support. |
| proposed | Physiological Adaptation | Hemolytic Reaction Confirmation | Reduction of Risk Potential | Transfusion & Blood Products | original-unresolved | `q4_5` | After approved shared licensing, the hemolytic-reaction confirmation item belongs with transfusion content while keeping its diagnostic-risk category. |
| proposed | Health Promotion and Maintenance | fall prevention plan | Safety and Infection Control | Patient & Environment Safety | reclaim-unresolved | `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q5` | The item tests a fall-prevention plan. |
| proposed | Reduction of Risk Potential | fracture patterns concerning for nonaccidental trauma | Safety and Infection Control | Patient & Environment Safety | reclaim-proposed | `gpt_case_opus23_nat_toddler_01_q2` | The item interprets injury patterns concerning for nonaccidental trauma. |
| proposed | Management of Care | Tuberculosis contact investigation | Safety and Infection Control | Transmission-Based Precautions | reclaim-unresolved | `opus25_case_tb_airborne_treatment_monitoring_01_q2` | The item tests TB contact investigation/public-health infection-control follow-up. |

### abstain

| Status | Current category | Current topic | Proposed category | Proposed topic | Sources | ID | Reason |
|---|---|---|---|---|---|---|---|
| unresolved | Management of Care | resource management for vaccination clinic supplies |  |  | reclaim-unresolved | `gpt_case_premium_next_case_occupational_exposure_vaccine_04_fib_supplies` | No canonical topic fits this scoped edge case without forcing a weak match. |
| unresolved | Pharmacological and Parenteral Therapies | SS vs NMS Distinction |  |  | original-unresolved | `q9_2` | No canonical topic fits this scoped edge case without forcing a weak match. |

## Exact Before/After Diff Preview

### burn_fib_tbsa_anterior_mix_01

- banks/burn-canonical.json:questions.0.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/burn-canonical.json:questions.0.topic: `adult burn TBSA estimation` -> `Burn Management`

### burn_matrix_parkland_values_05

- banks/burn-canonical.json:questions.4.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/burn-canonical.json:questions.4.topic: `burn Parkland calculation verification` -> `Burn Management`

### burn_mc_posterior_tbsa_07

- banks/burn-canonical.json:questions.6.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/burn-canonical.json:questions.6.topic: `adult burn posterior surface TBSA` -> `Burn Management`

### claude_cs_jun06_pressure_injury_bcc_01_part_1

- banks/hard-cases-canonical.json:questions.29.caseStudy.questions.0.topic: `Pressure Injury Staging and Prevention` -> `Skin & Wound Care`

### claude_cs_jun06_pressure_injury_bcc_01_part_4

- banks/hard-cases-canonical.json:questions.29.caseStudy.questions.3.topic: `Pressure Injury Staging and Prevention` -> `Skin & Wound Care`

### cs_adhf_pulm_edema_01_part_2

- banks/hard-cases-canonical.json:questions.34.caseStudy.questions.1.topic: `Pulmonary Edema Interventions` -> `Prioritization & Delegation`

### cs_adhf_pulm_edema_01_part_3

- banks/hard-cases-canonical.json:questions.34.caseStudy.questions.2.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.34.caseStudy.questions.2.topic: `ADHF Pathophysiology` -> `Cardiovascular Disorders`

### cs_adhf_pulm_edema_01_part_4

- banks/hard-cases-canonical.json:questions.34.caseStudy.questions.3.category: `Pharmacological and Parenteral Therapies` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.34.caseStudy.questions.3.topic: `Diuretic Therapy Evaluation` -> `Cardiovascular Disorders`

### cs_sepsis_shock_01_part_2

- banks/hard-cases-canonical.json:questions.36.caseStudy.questions.1.topic: `Septic Shock Interventions` -> `Prioritization & Delegation`

### cs_sepsis_shock_01_part_3

- banks/hard-cases-canonical.json:questions.36.caseStudy.questions.2.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.36.caseStudy.questions.2.topic: `Evaluating Sepsis Interventions` -> `Sepsis & Septic Shock`

### cs_sepsis_shock_01_part_4

- banks/hard-cases-canonical.json:questions.36.caseStudy.questions.3.category: `Pharmacological and Parenteral Therapies` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.36.caseStudy.questions.3.topic: `Vasopressor Titration` -> `Sepsis & Septic Shock`

### cs_stemi_vfib_04_part_2

- banks/hard-cases-canonical.json:questions.35.caseStudy.questions.1.topic: `Cardiac Arrest Resuscitation Sequence` -> `Prioritization & Delegation`

### cs_stemi_vfib_04_part_3

- banks/hard-cases-canonical.json:questions.35.caseStudy.questions.2.topic: `Cardiac Arrest Pharmacotherapy` -> `Medication Safety & Admin`

### cs_thyroid_storm_q2

- banks/hard-cases-canonical.json:questions.33.caseStudy.questions.1.topic: `Thyroid Storm Pharmacology Sequence` -> `Medication Safety & Admin`

### cs_thyroid_storm_q3

- banks/hard-cases-canonical.json:questions.33.caseStudy.questions.2.topic: `Thyroid Storm Interventions` -> `Prioritization & Delegation`

### cs_thyroid_storm_q4

- banks/hard-cases-canonical.json:questions.33.caseStudy.questions.3.topic: `PTU Adverse Effects` -> `Laboratory & Diagnostic Tests`

### ekg_b2_matrix_10

- banks/visual-canonical.json:questions.22.topic: `Atrial Arrhythmias` -> `Cardiovascular Disorders`

### ekg_b2_mc_01

- banks/visual-canonical.json:questions.13.topic: `Atrial Fibrillation` -> `Cardiovascular Disorders`

### ekg_b2_mc_07

- banks/visual-canonical.json:questions.19.topic: `Atrial Flutter` -> `Cardiovascular Disorders`

### ekg_b2_sata_06

- banks/visual-canonical.json:questions.18.topic: `Adenosine Side Effects` -> `Medication Safety & Admin`

### ekg_b3_matrix_10

- banks/visual-canonical.json:questions.32.topic: `AV Heart Blocks` -> `Cardiovascular Disorders`

### ekg_b3_mc_01

- banks/visual-canonical.json:questions.23.topic: `First-Degree AV Block` -> `Cardiovascular Disorders`

### ekg_b5_sata_06

- banks/visual-canonical.json:questions.48.category: `Health Promotion and Maintenance` -> `Physiological Adaptation`
- banks/visual-canonical.json:questions.48.topic: `Pacemaker Discharge Teaching` -> `Cardiovascular Disorders`

### fhr_gemini_smoke_2026_06_13_01

- banks/gemini-canonical.json:questions.769.topic: `intrapartum fetal monitoring` -> `Maternal-Newborn Care & Teaching`

### fhr_gemini_smoke_2026_06_13_02

- banks/gemini-canonical.json:questions.770.topic: `intrapartum fetal monitoring` -> `Maternal-Newborn Care & Teaching`

### fhr_gemini_smoke_2026_06_13_03

- banks/gemini-canonical.json:questions.771.topic: `intrapartum fetal monitoring` -> `Maternal-Newborn Care & Teaching`

### fhr_gemini_smoke_2026_06_13_04

- banks/gemini-canonical.json:questions.772.topic: `intrapartum fetal monitoring` -> `Maternal-Newborn Care & Teaching`

### fhr_gemini_smoke_2026_06_13_05

- banks/gemini-canonical.json:questions.773.topic: `intrapartum fetal monitoring` -> `Maternal-Newborn Care & Teaching`

### fhr_gemini_smoke_2026_06_13_06

- banks/gemini-canonical.json:questions.774.topic: `intrapartum fetal monitoring` -> `Maternal-Newborn Care & Teaching`

### gpt_2026_06_13_case_delirium_uti_01_q2

- banks/gpt-canonical.json:questions.266.caseStudy.questions.1.topic: `hyperactive delirium safety` -> `Patient & Environment Safety`

### gpt_2026_06_13_case_delirium_uti_01_q3

- banks/gpt-canonical.json:questions.266.caseStudy.questions.2.topic: `haloperidol safety in delirium` -> `Medication Safety & Admin`

### gpt_2026_06_13_case_delirium_uti_01_q4

- banks/gpt-canonical.json:questions.266.caseStudy.questions.3.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.266.caseStudy.questions.3.topic: `renal and delirium trend evaluation` -> `Renal & Gastrointestinal Disorders`

### gpt_2026_06_13_case_delirium_uti_01_q5

- banks/gpt-canonical.json:questions.266.caseStudy.questions.4.topic: `family teaching about delirium recovery` -> `Mental Health Disorders`

### gpt_2026_06_13_case_delirium_uti_01_q6

- banks/gpt-canonical.json:questions.266.caseStudy.questions.5.topic: `complication prevention in delirium` -> `Sleep & Rest`

### gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_bowtie

- banks/gpt-canonical.json:questions.280.topic: `Late postpartum preeclampsia with severe features` -> `Maternal-Newborn Care & Teaching`

### gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q1

- banks/gpt-canonical.json:questions.279.caseStudy.questions.0.topic: `Late postpartum preeclampsia with severe features` -> `Maternal-Newborn Care & Teaching`

### gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q2

- banks/gpt-canonical.json:questions.279.caseStudy.questions.1.topic: `Late postpartum preeclampsia with severe features` -> `Maternal-Newborn Care & Teaching`

### gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q3

- banks/gpt-canonical.json:questions.279.caseStudy.questions.2.topic: `Late postpartum preeclampsia with severe features` -> `Maternal-Newborn Care & Teaching`

### gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q4

- banks/gpt-canonical.json:questions.279.caseStudy.questions.3.topic: `Late postpartum preeclampsia with severe features` -> `Medication Safety & Admin`

### gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q5

- banks/gpt-canonical.json:questions.279.caseStudy.questions.4.topic: `Late postpartum preeclampsia with severe features` -> `Medication Safety & Admin`

### gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q6

- banks/gpt-canonical.json:questions.279.caseStudy.questions.5.topic: `Late postpartum preeclampsia with severe features` -> `Maternal-Newborn Care & Teaching`

### gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q2

- banks/hard-cases-canonical.json:questions.64.caseStudy.questions.1.category: `Pharmacological and Parenteral Therapies` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.64.caseStudy.questions.1.topic: `Prerenal acute kidney injury with hyperkalemia` -> `Renal & Gastrointestinal Disorders`

### gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q4

- banks/hard-cases-canonical.json:questions.64.caseStudy.questions.3.category: `Pharmacological and Parenteral Therapies` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.64.caseStudy.questions.3.topic: `Prerenal acute kidney injury with hyperkalemia` -> `Electrolyte Imbalances`

### gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q5

- banks/hard-cases-canonical.json:questions.64.caseStudy.questions.4.category: `Pharmacological and Parenteral Therapies` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.64.caseStudy.questions.4.topic: `Prerenal acute kidney injury with hyperkalemia` -> `Renal & Gastrointestinal Disorders`

### gpt_case_gallstone_pancreatitis_01_q5

- banks/hard-cases-canonical.json:questions.50.caseStudy.questions.4.topic: `Nutrition in acute pancreatitis` -> `Nutritional & Fluid Support`

### gpt_case_gap_2026_06_11_adhf_or_03

- banks/gpt-canonical.json:questions.184.caseStudy.questions.2.topic: `Escalation for acute pulmonary edema` -> `Prioritization & Delegation`

### gpt_case_gap_2026_06_11_adrenal_or_03

- banks/gpt-canonical.json:questions.187.caseStudy.questions.2.topic: `Adrenal crisis emergency response` -> `Prioritization & Delegation`

### gpt_case_gap_2026_06_11_aki_or_03

- banks/gpt-canonical.json:questions.185.caseStudy.questions.2.topic: `Emergency hyperkalemia management` -> `Prioritization & Delegation`

### gpt_case_gap_2026_06_11_anticoag_or_03

- banks/gpt-canonical.json:questions.189.caseStudy.questions.2.topic: `Response to heparin-associated bleeding` -> `Prioritization & Delegation`

### gpt_case_gap_2026_06_11_case_tls_01_q2

- banks/gpt-canonical.json:questions.183.caseStudy.questions.1.topic: `tumor lysis syndrome` -> `Oncology & Immunotherapy Complications`

### gpt_case_gap_2026_06_11_case_tls_01_q3

- banks/gpt-canonical.json:questions.183.caseStudy.questions.2.topic: `emergent hyperkalemia management` -> `Electrolyte Imbalances`

### gpt_case_gap_2026_06_11_case_tls_01_q5

- banks/gpt-canonical.json:questions.183.caseStudy.questions.4.topic: `tumor lysis syndrome treatment response` -> `Oncology & Immunotherapy Complications`

### gpt_case_gap_2026_06_11_ostomy_literacy_part_2_matrix_findings

- banks/gpt-canonical.json:questions.176.caseStudy.questions.1.topic: `New ostomy discharge teaching with health literacy barriers` -> `Elimination & Comfort`

### gpt_case_gap_2026_06_11_panc_or_03

- banks/gpt-canonical.json:questions.186.caseStudy.questions.2.topic: `Pancreatitis deterioration response` -> `Prioritization & Delegation`

### gpt_case_gap_2026_06_11_post_stroke_rehab_part_4_cloze_priority

- banks/gpt-canonical.json:questions.157.caseStudy.questions.3.topic: `Post-stroke outpatient rehabilitation and safe feeding` -> `Prioritization & Delegation`

### gpt_case_gap_2026_06_11_pressure_ltc_part_1_matrix_risk

- banks/gpt-canonical.json:questions.164.caseStudy.questions.0.topic: `Pressure injury prevention in long-term care` -> `Skin & Wound Care`

### gpt_case_gap_2026_06_11_pressure_ltc_part_2_sata_plan

- banks/gpt-canonical.json:questions.164.caseStudy.questions.1.topic: `Pressure injury prevention in long-term care` -> `Skin & Wound Care`

### gpt_case_gap_2026_06_11_pressure_ltc_part_3_mc_delegate

- banks/gpt-canonical.json:questions.164.caseStudy.questions.2.category: `Safety and Infection Control` -> `Management of Care`
- banks/gpt-canonical.json:questions.164.caseStudy.questions.2.topic: `Pressure injury prevention in long-term care` -> `Discharge Planning & Handoff`

### gpt_case_gap_2026_06_11_pressure_ltc_part_4_cloze_outcome

- banks/gpt-canonical.json:questions.164.caseStudy.questions.3.topic: `Pressure injury prevention in long-term care` -> `Skin & Wound Care`

### gpt_case_gap_2026_06_11_sepsis_cloze_02

- banks/gpt-canonical.json:questions.188.caseStudy.questions.1.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.188.caseStudy.questions.1.topic: `Septic shock recognition` -> `Sepsis & Septic Shock`

### gpt_case_gap_2026_06_11_sepsis_fib_04

- banks/gpt-canonical.json:questions.188.caseStudy.questions.3.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.188.caseStudy.questions.3.topic: `Urine output target in sepsis` -> `Sepsis & Septic Shock`

### gpt_case_gap_2026_06_11_sepsis_matrix_01

- banks/gpt-canonical.json:questions.188.caseStudy.questions.0.category: `Safety and Infection Control` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.188.caseStudy.questions.0.topic: `Sepsis from urinary source` -> `Sepsis & Septic Shock`

### gpt_case_gap_2026_06_11_sepsis_or_03

- banks/gpt-canonical.json:questions.188.caseStudy.questions.2.topic: `Sepsis bundle nursing priorities` -> `Prioritization & Delegation`

### gpt_case_gbs_respiratory_compromise_01_q2

- banks/hard-cases-canonical.json:questions.52.caseStudy.questions.1.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.52.caseStudy.questions.1.topic: `GBS diagnostic and respiratory monitoring data` -> `Respiratory & Infectious Disorders`

### gpt_case_gbs_respiratory_compromise_01_q4

- banks/hard-cases-canonical.json:questions.52.caseStudy.questions.3.category: `Pharmacological and Parenteral Therapies` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.52.caseStudy.questions.3.topic: `GBS treatment plan and respiratory thresholds` -> `Respiratory & Infectious Disorders`

### gpt_case_opus23_nat_toddler_01_q2

- banks/gpt-canonical.json:questions.267.caseStudy.questions.1.category: `Reduction of Risk Potential` -> `Safety and Infection Control`
- banks/gpt-canonical.json:questions.267.caseStudy.questions.1.topic: `fracture patterns concerning for nonaccidental trauma` -> `Patient & Environment Safety`

### gpt_case_opus23_nat_toddler_01_q3

- banks/gpt-canonical.json:questions.267.caseStudy.questions.2.topic: `domestic violence disclosure during child safety planning` -> `Therapeutic Communication`

### gpt_case_opus5_cdi_immunocompromised_01_q1

- banks/gpt-canonical.json:questions.220.caseStudy.questions.0.topic: `Antimotility agents in suspected C. difficile infection` -> `Medication Safety & Admin`

### gpt_case_opus5_cdi_immunocompromised_01_q3

- banks/gpt-canonical.json:questions.220.caseStudy.questions.2.topic: `Oral vancomycin route for C. difficile infection` -> `Medication Safety & Admin`

### gpt_case_opus5_cdi_immunocompromised_01_q4

- banks/gpt-canonical.json:questions.220.caseStudy.questions.3.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.220.caseStudy.questions.3.topic: `Monitoring for fulminant C. difficile infection and toxic megacolon` -> `Renal & Gastrointestinal Disorders`

### gpt_case_opus5_cdi_immunocompromised_01_q5

- banks/gpt-canonical.json:questions.220.caseStudy.questions.4.topic: `Initial nursing sequence for suspected C. difficile infection` -> `Prioritization & Delegation`

### gpt_case_opus5_cdi_immunocompromised_01_q6

- banks/gpt-canonical.json:questions.220.caseStudy.questions.5.topic: `Discharge teaching after C. difficile infection` -> `Chronic Disease Management & Lifestyle`

### gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q4

- banks/hard-cases-canonical.json:questions.54.caseStudy.questions.3.topic: `Postoperative pulmonary embolism with right ventricular strain` -> `Medication Safety & Admin`

### gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q5

- banks/hard-cases-canonical.json:questions.54.caseStudy.questions.4.category: `Pharmacological and Parenteral Therapies` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.54.caseStudy.questions.4.topic: `Postoperative pulmonary embolism with right ventricular strain` -> `Cardiovascular Disorders`

### gpt_case_premium_2026_06_10_case04_cloze_stage1_02

- banks/gpt-canonical.json:questions.145.caseStudy.questions.1.topic: `pressure injury prevention in rehabilitation` -> `Skin & Wound Care`

### gpt_case_premium_2026_06_10_case04_mc_first_action_03

- banks/gpt-canonical.json:questions.145.caseStudy.questions.2.topic: `pressure injury prevention in rehabilitation` -> `Skin & Wound Care`

### gpt_case_premium_2026_06_10_case05_cloze_teaching_03

- banks/gpt-canonical.json:questions.146.caseStudy.questions.2.topic: `health literacy teaching plan` -> `Therapeutic Communication`

### gpt_case_premium_2026_06_10_case05_sata_adherence_04

- banks/gpt-canonical.json:questions.146.caseStudy.questions.3.topic: `medication adherence support` -> `Therapeutic Communication`

### gpt_case_premium_next_case_caregiver_adaptation_dementia_03_fib_respite

- banks/gpt-canonical.json:questions.179.caseStudy.questions.4.topic: `resource planning for caregiver respite` -> `Caregiver Role Strain & Family Coping`

### gpt_case_premium_next_case_caregiver_adaptation_dementia_03_matrix_cues

- banks/gpt-canonical.json:questions.179.caseStudy.questions.0.topic: `caregiver burden and safety cue recognition` -> `Caregiver Role Strain & Family Coping`

### gpt_case_premium_next_case_caregiver_adaptation_dementia_03_or_plan

- banks/gpt-canonical.json:questions.179.caseStudy.questions.2.topic: `caregiver safety planning and care coordination` -> `Caregiver Role Strain & Family Coping`

### gpt_case_premium_next_case_health_literacy_diabetes_01_sata_referrals

- banks/gpt-canonical.json:questions.177.caseStudy.questions.3.topic: `interprofessional diabetes care coordination` -> `Discharge Planning & Handoff`

### gpt_case_premium_next_case_preventive_screening_vaccine_05_sata_plan

- banks/gpt-canonical.json:questions.181.caseStudy.questions.3.topic: `resource coordination for preventive care` -> `Discharge Planning & Handoff`

### gpt_case_premium_next_case_rehab_pressure_bowel_02_matrix_delegation

- banks/gpt-canonical.json:questions.178.caseStudy.questions.4.topic: `delegation and interprofessional rehabilitation coordination` -> `Prioritization & Delegation`

### gpt_case_premium_next_case_rehab_pressure_bowel_02_or_transfer

- banks/gpt-canonical.json:questions.178.caseStudy.questions.1.topic: `safe mobility and fall prevention` -> `Patient & Environment Safety`

### gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_q3

- banks/hard-cases-canonical.json:questions.56.caseStudy.questions.2.topic: `Acute variceal hemorrhage in cirrhosis` -> `Cardiovascular Disorders`

### gpt_case_warfarin_mvr_2026_06_11_01_q4

- banks/gpt-canonical.json:questions.221.caseStudy.questions.3.topic: `acute hemorrhage prioritization` -> `Cardiovascular Disorders`

### gpt_case_warfarin_mvr_2026_06_11_01_q6

- banks/gpt-canonical.json:questions.221.caseStudy.questions.5.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.221.caseStudy.questions.5.topic: `anticoagulation reversal outcome evaluation` -> `Cardiovascular Disorders`

### gpt_gap_2026_06_10_b_fib_bed_repositioning_08

- banks/gpt-canonical.json:questions.172.topic: `Repositioning schedule for pressure injury prevention` -> `Skin & Wound Care`

### gpt_gap_2026_06_10_b_or_moisture_pressure_prevention_04

- banks/gpt-canonical.json:questions.168.topic: `Moisture management for pressure injury prevention` -> `Skin & Wound Care`

### gpt_gap_2026_06_10_fib_daily_skin_inspection_07

- banks/gpt-canonical.json:questions.153.topic: `Home skin inspection for pressure injury prevention` -> `Skin & Wound Care`

### gpt_gap_2026_06_10_or_pressure_injury_prevention_04

- banks/gpt-canonical.json:questions.150.topic: `Pressure injury prevention in rehabilitation` -> `Skin & Wound Care`

### gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q2

- banks/gpt-canonical.json:questions.255.caseStudy.questions.1.category: `Reduction of Risk Potential` -> `Management of Care`
- banks/gpt-canonical.json:questions.255.caseStudy.questions.1.topic: `discharge readiness after sedation with language barrier` -> `Discharge Planning & Handoff`

### gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q5

- banks/gpt-canonical.json:questions.255.caseStudy.questions.4.category: `Health Promotion and Maintenance` -> `Psychosocial Integrity`
- banks/gpt-canonical.json:questions.255.caseStudy.questions.4.topic: `post-sedation discharge teaching comprehension` -> `Therapeutic Communication`

### gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01_q2

- banks/gpt-canonical.json:questions.254.caseStudy.questions.1.topic: `opioid reassessment after IV dose` -> `Medication Safety & Admin`

### gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01_q4

- banks/gpt-canonical.json:questions.254.caseStudy.questions.3.category: `Health Promotion and Maintenance` -> `Pharmacological and Parenteral Therapies`
- banks/gpt-canonical.json:questions.254.caseStudy.questions.3.topic: `family teaching for patient-controlled analgesia safety` -> `Medication Safety & Admin`

### gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03_q1

- banks/gpt-canonical.json:questions.256.caseStudy.questions.0.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.256.caseStudy.questions.0.topic: `pediatric dehydration cue recognition` -> `Renal & Gastrointestinal Disorders`

### gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q1

- banks/gpt-canonical.json:questions.257.caseStudy.questions.0.topic: `home wound-care infection prevention` -> `Skin & Wound Care`

### gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q2

- banks/gpt-canonical.json:questions.257.caseStudy.questions.1.topic: `wound-care teach-back failure` -> `Skin & Wound Care`

### gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q5

- banks/gpt-canonical.json:questions.257.caseStudy.questions.4.topic: `home wound-care teach-back sequence` -> `Discharge Planning & Handoff`

### gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q2

- banks/gpt-canonical.json:questions.242.caseStudy.questions.1.category: `Health Promotion and Maintenance` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.242.caseStudy.questions.1.topic: `COPD discharge teaching` -> `Respiratory & Infectious Disorders`

### gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q3

- banks/gpt-canonical.json:questions.242.caseStudy.questions.2.topic: `home oxygen discharge coordination` -> `Discharge Planning & Handoff`

### gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q5

- banks/gpt-canonical.json:questions.242.caseStudy.questions.4.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.242.caseStudy.questions.4.topic: `portable oxygen planning` -> `Respiratory & Infectious Disorders`

### gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q4

- banks/gpt-canonical.json:questions.245.caseStudy.questions.3.category: `Health Promotion and Maintenance` -> `Psychosocial Integrity`
- banks/gpt-canonical.json:questions.245.caseStudy.questions.3.topic: `family education for delirium prevention` -> `Mental Health Disorders`

### gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q5

- banks/gpt-canonical.json:questions.245.caseStudy.questions.4.topic: `delirium discharge readiness` -> `Discharge Planning & Handoff`

### gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q3

- banks/gpt-canonical.json:questions.243.caseStudy.questions.2.topic: `post-fall escalation` -> `Prioritization & Delegation`

### gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q4

- banks/gpt-canonical.json:questions.243.caseStudy.questions.3.topic: `post-fall monitoring sequence` -> `Patient & Environment Safety`

### gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q5

- banks/gpt-canonical.json:questions.243.caseStudy.questions.4.category: `Health Promotion and Maintenance` -> `Safety and Infection Control`
- banks/gpt-canonical.json:questions.243.caseStudy.questions.4.topic: `fall prevention plan` -> `Patient & Environment Safety`

### gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q5

- banks/gpt-canonical.json:questions.244.caseStudy.questions.4.topic: `wound measurement trend` -> `Skin & Wound Care`

### gpt_gap_jun11_fib_cauti_prevention_01

- banks/gpt-canonical.json:questions.191.topic: `CAUTI Prevention Bundle` -> `Standard Precautions & Hygiene`

### gpt_gap_jun11_or_nonpharm_pain_01

- banks/gpt-canonical.json:questions.199.topic: `Nonpharmacological Musculoskeletal Pain Management` -> `Palliative & Supportive Care`

### gpt_gap_jun12_matrix_pressure_injury_staging_01

- banks/gpt-canonical.json:questions.224.topic: `Pressure injury staging` -> `Skin & Wound Care`

### gpt_injection_smoke_2026_06_15_matrix_route_match_08

- banks/gpt-canonical.json:questions.278.category: `Reduction of Risk Potential` -> `Pharmacological and Parenteral Therapies`
- banks/gpt-canonical.json:questions.278.topic: `Visual technique analysis` -> `Medication Safety & Admin`

### gpt_injection_smoke_2026_06_15_matrix_subq_cues_07

- banks/gpt-canonical.json:questions.277.category: `Reduction of Risk Potential` -> `Pharmacological and Parenteral Therapies`
- banks/gpt-canonical.json:questions.277.topic: `Injection visual cue interpretation` -> `Medication Safety & Admin`

### gpt_injection_smoke_2026_06_15_mc_intradermal_01

- banks/gpt-canonical.json:questions.271.category: `Reduction of Risk Potential` -> `Pharmacological and Parenteral Therapies`
- banks/gpt-canonical.json:questions.271.topic: `Injection route recognition from skin cross-section` -> `Medication Safety & Admin`

### gpt_injection_smoke_2026_06_15_mc_intramuscular_03

- banks/gpt-canonical.json:questions.273.category: `Reduction of Risk Potential` -> `Pharmacological and Parenteral Therapies`
- banks/gpt-canonical.json:questions.273.topic: `Injection route recognition from skin cross-section` -> `Medication Safety & Admin`

### gpt_injection_smoke_2026_06_15_mc_intravenous_04

- banks/gpt-canonical.json:questions.274.category: `Reduction of Risk Potential` -> `Pharmacological and Parenteral Therapies`
- banks/gpt-canonical.json:questions.274.topic: `Injection route recognition from skin cross-section` -> `Medication Safety & Admin`

### gpt_injection_smoke_2026_06_15_mc_layer_highlight_05

- banks/gpt-canonical.json:questions.275.category: `Reduction of Risk Potential` -> `Pharmacological and Parenteral Therapies`
- banks/gpt-canonical.json:questions.275.topic: `Target layer identification from visual` -> `Medication Safety & Admin`

### gpt_injection_smoke_2026_06_15_mc_subcutaneous_02

- banks/gpt-canonical.json:questions.272.category: `Reduction of Risk Potential` -> `Pharmacological and Parenteral Therapies`
- banks/gpt-canonical.json:questions.272.topic: `Injection route recognition from skin cross-section` -> `Medication Safety & Admin`

### gpt_injection_smoke_2026_06_15_sata_im_cues_06

- banks/gpt-canonical.json:questions.276.category: `Reduction of Risk Potential` -> `Pharmacological and Parenteral Therapies`
- banks/gpt-canonical.json:questions.276.topic: `Injection visual cue interpretation` -> `Medication Safety & Admin`

### gpt_opus21_case_colostomy_lep_discharge_01_q3

- banks/gpt-canonical.json:questions.268.caseStudy.questions.2.topic: `ostomy psychosocial adaptation` -> `Therapeutic Communication`

### gpt_opus21_case_colostomy_lep_discharge_01_q4

- banks/gpt-canonical.json:questions.268.caseStudy.questions.3.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.268.caseStudy.questions.3.topic: `postoperative colostomy findings` -> `Renal & Gastrointestinal Disorders`

### gpt_opus21_case_colostomy_lep_discharge_01_q5

- banks/gpt-canonical.json:questions.268.caseStudy.questions.4.topic: `metformin discharge teaching` -> `Medication Safety & Admin`

### gpt_pph_2026_06_16_case_01_bowtie

- banks/hard-cases-canonical.json:questions.59.topic: `Postpartum hemorrhage due to uterine atony` -> `Maternal-Newborn Care & Teaching`

### gpt_pph_2026_06_16_case_01_q1

- banks/hard-cases-canonical.json:questions.58.caseStudy.questions.0.topic: `Postpartum hemorrhage due to uterine atony` -> `Maternal-Newborn Care & Teaching`

### gpt_pph_2026_06_16_case_01_q2

- banks/hard-cases-canonical.json:questions.58.caseStudy.questions.1.topic: `Postpartum hemorrhage due to uterine atony` -> `Maternal-Newborn Care & Teaching`

### gpt_pph_2026_06_16_case_01_q3

- banks/hard-cases-canonical.json:questions.58.caseStudy.questions.2.category: `Physiological Adaptation` -> `Pharmacological and Parenteral Therapies`
- banks/hard-cases-canonical.json:questions.58.caseStudy.questions.2.topic: `Postpartum hemorrhage due to uterine atony` -> `Medication Safety & Admin`

### gpt_pph_2026_06_16_case_01_q4

- banks/hard-cases-canonical.json:questions.58.caseStudy.questions.3.topic: `Postpartum hemorrhage due to uterine atony` -> `Maternal-Newborn Care & Teaching`

### gpt_pph_2026_06_16_case_01_q5

- banks/hard-cases-canonical.json:questions.58.caseStudy.questions.4.topic: `Postpartum hemorrhage due to uterine atony` -> `Maternal-Newborn Care & Teaching`

### gpt_pph_2026_06_16_case_01_q6

- banks/hard-cases-canonical.json:questions.58.caseStudy.questions.5.topic: `Postpartum hemorrhage due to uterine atony` -> `Maternal-Newborn Care & Teaching`

### gpt_r1_regen_case_celiac_01_q3

- banks/hard-cases-canonical.json:questions.60.caseStudy.questions.2.topic: `Celiac disease with dermatitis herpetiformis` -> `Renal & Gastrointestinal Disorders`

### gpt_r1_regen_case_celiac_01_q4

- banks/hard-cases-canonical.json:questions.60.caseStudy.questions.3.category: `Health Promotion and Maintenance` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.60.caseStudy.questions.3.topic: `Celiac disease with dermatitis herpetiformis` -> `Renal & Gastrointestinal Disorders`

### gpt_r1_regen_case_celiac_01_q5

- banks/hard-cases-canonical.json:questions.60.caseStudy.questions.4.category: `Health Promotion and Maintenance` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.60.caseStudy.questions.4.topic: `Celiac disease with dermatitis herpetiformis` -> `Renal & Gastrointestinal Disorders`

### gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_bowtie

- banks/hard-cases-canonical.json:questions.63.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.63.topic: `Acute ischemic stroke thrombolysis and thrombectomy complications` -> `Endocrine & Neurological Disorders`

### gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q4

- banks/hard-cases-canonical.json:questions.62.caseStudy.questions.3.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.62.caseStudy.questions.3.topic: `Acute ischemic stroke thrombolysis and thrombectomy complications` -> `Endocrine & Neurological Disorders`

### gpt_u3_labtrend_2026_06_09_b_cloze_sodium_overcorrection_08

- banks/lab-canonical.json:questions.17.topic: `rapid sodium correction trend` -> `Laboratory & Diagnostic Tests`

### gpt_u3_labtrend_2026_06_09_b_or_gi_bleed_hgb_06

- banks/lab-canonical.json:questions.15.topic: `falling hemoglobin trend and suspected bleeding` -> `Laboratory & Diagnostic Tests`

### gpt_u3_labtrend_2026_06_09_cloze_magnesium_decline_08

- banks/lab-canonical.json:questions.7.topic: `falling magnesium trend` -> `Laboratory & Diagnostic Tests`

### gpt_u6_matrix_cloze_2026_06_09_cloze_preeclampsia_magnesium_20

- banks/gpt-canonical.json:questions.141.topic: `Magnesium sulfate toxicity in preeclampsia` -> `Maternal-Newborn Care & Teaching`

### gpt_visual_smoke_2026_06_12_fib_burn_parkland_rate_01

- banks/gpt-canonical.json:questions.232.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.232.topic: `adult burn resuscitation Parkland calculation` -> `Burn Management`

### gpt_visual_smoke_2026_06_12_fib_device_enteral_duration_10

- banks/gpt-canonical.json:questions.241.category: `Management of Care` -> `Pharmacological and Parenteral Therapies`
- banks/gpt-canonical.json:questions.241.topic: `enteral pump duration calculation` -> `Dosage Calculations`

### gpt_visual_smoke_2026_06_12_matrix_burn_regions_03

- banks/gpt-canonical.json:questions.234.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.234.topic: `adult Rule of Nines region recognition` -> `Burn Management`

### gpt_visual_smoke_2026_06_12_mc_burn_tbsa_02

- banks/gpt-canonical.json:questions.233.category: `Basic Care and Comfort` -> `Physiological Adaptation`
- banks/gpt-canonical.json:questions.233.topic: `adult Rule of Nines TBSA estimation` -> `Burn Management`

### io_fib_hf_net_balance_01

- banks/io-canonical.json:questions.0.topic: `fluid balance monitoring` -> `Laboratory & Diagnostic Tests`

### io_matrix_bowel_prep_deficit_08

- banks/io-canonical.json:questions.7.topic: `bowel preparation fluid deficit` -> `Laboratory & Diagnostic Tests`

### io_matrix_prerenal_aki_recheck_04

- banks/io-canonical.json:questions.3.topic: `acute kidney injury fluid response` -> `Laboratory & Diagnostic Tests`

### mar_missed_antibiotic_followup_07

- banks/mar-canonical.json:questions.6.topic: `missed dose follow-up` -> `Prioritization & Delegation`

### opus_agvd_case_agvhd_01_q3

- banks/gemini-canonical.json:questions.768.caseStudy.questions.2.topic: `Acute Graft-Versus-Host Disease` -> `Prioritization & Delegation`

### opus_agvd_case_agvhd_01_q4

- banks/gemini-canonical.json:questions.768.caseStudy.questions.3.category: `Pharmacological and Parenteral Therapies` -> `Physiological Adaptation`
- banks/gemini-canonical.json:questions.768.caseStudy.questions.3.topic: `Acute Graft-Versus-Host Disease` -> `Oncology & Immunotherapy Complications`

### opus_agvd_case_agvhd_01_q5

- banks/gemini-canonical.json:questions.768.caseStudy.questions.4.topic: `Acute Graft-Versus-Host Disease` -> `Prioritization & Delegation`

### opus_agvd_case_agvhd_01_q6

- banks/gemini-canonical.json:questions.768.caseStudy.questions.5.topic: `Acute Graft-Versus-Host Disease` -> `Oncology & Immunotherapy Complications`

### opus_bcc_rehab_2026_06_10_06

- banks/claude-canonical.json:questions.55.topic: `pressure injury staging and evaluation of wound healing` -> `Skin & Wound Care`

### opus_case_lithium_toxicity_q2

- banks/claude-canonical.json:questions.67.caseStudy.questions.1.topic: `lithium toxicity` -> `Prioritization & Delegation`

### opus_case_lithium_toxicity_q3

- banks/claude-canonical.json:questions.67.caseStudy.questions.2.topic: `lithium toxicity` -> `Renal & Gastrointestinal Disorders`

### opus_case_lithium_toxicity_q5

- banks/claude-canonical.json:questions.67.caseStudy.questions.4.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/claude-canonical.json:questions.67.caseStudy.questions.4.topic: `lithium toxicity` -> `Renal & Gastrointestinal Disorders`

### opus_case_lithium_toxicity_q6

- banks/claude-canonical.json:questions.67.caseStudy.questions.5.topic: `lithium toxicity` -> `Therapeutic Communication`

### opus_case_se_01_q3

- banks/hard-cases-canonical.json:questions.41.caseStudy.questions.2.category: `Pharmacological and Parenteral Therapies` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.41.caseStudy.questions.2.topic: `status epilepticus` -> `Cardiovascular Disorders`

### opus_case_se_01_q4

- banks/hard-cases-canonical.json:questions.41.caseStudy.questions.3.topic: `status epilepticus` -> `Prioritization & Delegation`

### opus_case_se_01_q5

- banks/hard-cases-canonical.json:questions.41.caseStudy.questions.4.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.41.caseStudy.questions.4.topic: `status epilepticus` -> `Endocrine & Neurological Disorders`

### opus_case_se_01_q6

- banks/hard-cases-canonical.json:questions.41.caseStudy.questions.5.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.41.caseStudy.questions.5.topic: `status epilepticus` -> `Renal & Gastrointestinal Disorders`

### opus_case_warfarin_bridge_q2

- banks/claude-canonical.json:questions.61.caseStudy.questions.1.category: `Safety and Infection Control` -> `Pharmacological and Parenteral Therapies`
- banks/claude-canonical.json:questions.61.caseStudy.questions.1.topic: `warfarin-enoxaparin-bridge` -> `Anticoagulant Therapy`

### opus_case_warfarin_bridge_q4

- banks/claude-canonical.json:questions.61.caseStudy.questions.3.category: `Safety and Infection Control` -> `Pharmacological and Parenteral Therapies`
- banks/claude-canonical.json:questions.61.caseStudy.questions.3.topic: `warfarin-enoxaparin-bridge` -> `Anticoagulant Therapy`

### opus_case_warfarin_bridge_q5

- banks/claude-canonical.json:questions.61.caseStudy.questions.4.category: `Basic Care and Comfort` -> `Pharmacological and Parenteral Therapies`
- banks/claude-canonical.json:questions.61.caseStudy.questions.4.topic: `warfarin-enoxaparin-bridge` -> `Anticoagulant Therapy`

### opus_case_warfarin_bridge_q6

- banks/claude-canonical.json:questions.61.caseStudy.questions.5.category: `Management of Care` -> `Pharmacological and Parenteral Therapies`
- banks/claude-canonical.json:questions.61.caseStudy.questions.5.topic: `warfarin-enoxaparin-bridge` -> `Anticoagulant Therapy`

### opus_icit_case_01_q2

- banks/hard-cases-canonical.json:questions.39.caseStudy.questions.1.topic: `Immune Checkpoint Inhibitor Myocarditis` -> `Oncology & Immunotherapy Complications`

### opus_icit_case_01_q3

- banks/hard-cases-canonical.json:questions.39.caseStudy.questions.2.topic: `Immune Checkpoint Inhibitor Myocarditis` -> `Prioritization & Delegation`

### opus_icit_case_01_q4

- banks/hard-cases-canonical.json:questions.39.caseStudy.questions.3.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.39.caseStudy.questions.3.topic: `Immune Checkpoint Inhibitor Myocarditis` -> `Cardiovascular Disorders`

### opus_tpn_case_mucositis_01_q2

- banks/hard-cases-canonical.json:questions.40.caseStudy.questions.1.category: `Pharmacological and Parenteral Therapies` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.40.caseStudy.questions.1.topic: `Mucositis TPN and CRBSI` -> `Sepsis & Septic Shock`

### opus_tpn_case_mucositis_01_q3

- banks/hard-cases-canonical.json:questions.40.caseStudy.questions.2.topic: `Mucositis TPN and CRBSI` -> `Prioritization & Delegation`

### opus_tpn_case_mucositis_01_q4

- banks/hard-cases-canonical.json:questions.40.caseStudy.questions.3.topic: `Mucositis TPN and CRBSI` -> `Palliative & Supportive Care`

### opus_tpn_case_mucositis_01_q6

- banks/hard-cases-canonical.json:questions.40.caseStudy.questions.5.topic: `Mucositis TPN and CRBSI` -> `Nutritional & Fluid Support`

### opus1_case_discharge_med_rec_anticoag_01_q1

- banks/hard-cases-canonical.json:questions.42.caseStudy.questions.0.topic: `discharge medication reconciliation` -> `Discharge Planning & Handoff`

### opus1_case_discharge_med_rec_anticoag_01_q2

- banks/hard-cases-canonical.json:questions.42.caseStudy.questions.1.topic: `anticoagulant medication reconciliation` -> `Anticoagulant Therapy`

### opus1_case_discharge_med_rec_anticoag_01_q5

- banks/hard-cases-canonical.json:questions.42.caseStudy.questions.4.topic: `warfarin discharge teaching` -> `Anticoagulant Therapy`

### opus1_case_tha_discharge_lep_01_q2

- banks/claude-canonical.json:questions.59.caseStudy.questions.1.topic: `teach-back discharge education` -> `Chronic Disease Management & Lifestyle`

### opus1_case_tha_discharge_lep_01_q4

- banks/claude-canonical.json:questions.59.caseStudy.questions.3.topic: `rivaroxaban renal function monitoring` -> `Anticoagulant Therapy`

### opus12_case_inpatient_suicide_risk_01_q5

- banks/hard-cases-canonical.json:questions.47.caseStudy.questions.4.topic: `Consent and family involvement in suicide safety planning` -> `Confidentiality & HIPAA`

### opus20_case_cdiff_01_q2

- banks/claude-canonical.json:questions.60.caseStudy.questions.1.topic: `C. difficile colitis and dehydration` -> `PPE & Sterile Technique`

### opus20_case_cdiff_01_q3

- banks/claude-canonical.json:questions.60.caseStudy.questions.2.topic: `C. difficile colitis and dehydration` -> `Transmission-Based Precautions`

### opus20_case_cdiff_01_q4

- banks/claude-canonical.json:questions.60.caseStudy.questions.3.topic: `C. difficile colitis and dehydration` -> `Skin & Wound Care`

### opus20_case_cdiff_01_q5

- banks/claude-canonical.json:questions.60.caseStudy.questions.4.topic: `C. difficile colitis and dehydration` -> `Medication Safety & Admin`

### opus22_case_postpartum_intrusive_thoughts_01_q1

- banks/claude-canonical.json:questions.62.caseStudy.questions.0.topic: `postpartum intrusive thoughts versus psychosis` -> `Mental Health Disorders`

### opus22_case_postpartum_intrusive_thoughts_01_q2

- banks/claude-canonical.json:questions.62.caseStudy.questions.1.topic: `therapeutic communication for postpartum intrusive thoughts` -> `Therapeutic Communication`

### opus22_case_postpartum_intrusive_thoughts_01_q3

- banks/claude-canonical.json:questions.62.caseStudy.questions.2.topic: `postpartum depression treatment response` -> `Mental Health Disorders`

### opus22_case_postpartum_intrusive_thoughts_01_q4

- banks/claude-canonical.json:questions.62.caseStudy.questions.3.topic: `RN scope medication dose question` -> `Prioritization & Delegation`

### opus22_case_postpartum_intrusive_thoughts_01_q5

- banks/claude-canonical.json:questions.62.caseStudy.questions.4.topic: `postpartum depression recovery teaching` -> `Maternal-Newborn Care & Teaching`

### opus24_case_elder_neglect_med_mismanagement_01_q1

- banks/claude-canonical.json:questions.63.caseStudy.questions.0.topic: `elder neglect recognition` -> `Mental Health Disorders`

### opus24_case_elder_neglect_med_mismanagement_01_q2

- banks/claude-canonical.json:questions.63.caseStudy.questions.1.topic: `diuretic potassium safety` -> `Medication Safety & Admin`

### opus24_case_elder_neglect_med_mismanagement_01_q3

- banks/claude-canonical.json:questions.63.caseStudy.questions.2.topic: `mandatory reporting and escalation` -> `Legal & Ethical Principles`

### opus24_case_elder_neglect_med_mismanagement_01_q4

- banks/claude-canonical.json:questions.63.caseStudy.questions.3.topic: `safe IV potassium administration` -> `Medication Safety & Admin`

### opus24_case_elder_neglect_med_mismanagement_01_q5

- banks/claude-canonical.json:questions.63.caseStudy.questions.4.topic: `metformin renal safety` -> `Medication Safety & Admin`

### opus24_case_elder_neglect_med_mismanagement_01_q6

- banks/claude-canonical.json:questions.63.caseStudy.questions.5.topic: `interdisciplinary discharge safety planning` -> `Discharge Planning & Handoff`

### opus25_case_tb_airborne_treatment_monitoring_01_q2

- banks/claude-canonical.json:questions.64.caseStudy.questions.1.category: `Management of Care` -> `Safety and Infection Control`
- banks/claude-canonical.json:questions.64.caseStudy.questions.1.topic: `Tuberculosis contact investigation` -> `Transmission-Based Precautions`

### opus25_case_tb_airborne_treatment_monitoring_01_q3

- banks/claude-canonical.json:questions.64.caseStudy.questions.2.topic: `Ethambutol baseline assessment` -> `Laboratory & Diagnostic Tests`

### opus25_case_tb_airborne_treatment_monitoring_01_q4

- banks/claude-canonical.json:questions.64.caseStudy.questions.3.topic: `Chronic corticosteroid tapering` -> `Medication Safety & Admin`

### opus25_case_tb_airborne_treatment_monitoring_01_q5

- banks/claude-canonical.json:questions.64.caseStudy.questions.4.topic: `Anti-tuberculosis hepatotoxicity monitoring` -> `Medication Safety & Admin`

### opus25_case_tb_airborne_treatment_monitoring_01_q6

- banks/claude-canonical.json:questions.64.caseStudy.questions.5.topic: `Psychosocial support and TB adherence planning` -> `Therapeutic Communication`

### opus26_case_refeeding_syndrome_01_q2

- banks/claude-canonical.json:questions.65.caseStudy.questions.1.topic: `early refeeding gastrointestinal discomfort` -> `Nutritional & Fluid Support`

### opus26_case_refeeding_syndrome_01_q4

- banks/claude-canonical.json:questions.65.caseStudy.questions.3.topic: `therapeutic communication during eating disorder refeeding` -> `Therapeutic Communication`

### opus3_iv_potassium_safety_case_01_q6

- banks/hard-cases-canonical.json:questions.44.caseStudy.questions.5.topic: `Potassium infusion IV-site complication` -> `Medication Safety & Admin`

### opus4_case_postop_sbar_01_q1

- banks/hard-cases-canonical.json:questions.45.caseStudy.questions.0.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.45.caseStudy.questions.0.topic: `postoperative deterioration cue recognition` -> `Cardiovascular Disorders`

### opus4_case_postop_sbar_01_q2

- banks/hard-cases-canonical.json:questions.45.caseStudy.questions.1.topic: `postoperative hemorrhage with hypovolemic shock` -> `Cardiovascular Disorders`

### opus4_case_postop_sbar_01_q6

- banks/hard-cases-canonical.json:questions.45.caseStudy.questions.5.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/hard-cases-canonical.json:questions.45.caseStudy.questions.5.topic: `evaluating resuscitation response and OR handoff` -> `Cardiovascular Disorders`

### q10_1

- banks/hard-cases-canonical.json:questions.27.caseStudy.questions.0.topic: `Autonomic Dysreflexia Triggers` -> `Endocrine & Neurological Disorders`

### q10_4

- banks/hard-cases-canonical.json:questions.27.caseStudy.questions.3.topic: `AD Cause Identification` -> `Endocrine & Neurological Disorders`

### q2_4

- banks/hard-cases-canonical.json:questions.19.caseStudy.questions.3.topic: `Organophosphate Antidotes` -> `Medication Safety & Admin`

### q2_5

- banks/hard-cases-canonical.json:questions.19.caseStudy.questions.4.topic: `Atropine Evaluation` -> `Medication Safety & Admin`

### q3_1

- banks/hard-cases-canonical.json:questions.20.caseStudy.questions.0.topic: `Shaken Baby Syndrome Signs` -> `Patient & Environment Safety`

### q3_3

- banks/hard-cases-canonical.json:questions.20.caseStudy.questions.2.topic: `Mandated Reporting` -> `Legal & Ethical Principles`

### q3_4

- banks/hard-cases-canonical.json:questions.20.caseStudy.questions.3.topic: `Child Abuse Interventions` -> `Patient & Environment Safety`

### q3_5

- banks/hard-cases-canonical.json:questions.20.caseStudy.questions.4.topic: `Infant ICP Signs` -> `Endocrine & Neurological Disorders`

### q4_1

- banks/hard-cases-canonical.json:questions.21.caseStudy.questions.0.topic: `Transfusion Reaction Priority` -> `Transfusion & Blood Products`

### q4_2

- banks/hard-cases-canonical.json:questions.21.caseStudy.questions.1.topic: `Hemolytic Reaction Identification` -> `Transfusion & Blood Products`

### q4_4

- banks/hard-cases-canonical.json:questions.21.caseStudy.questions.3.topic: `Transfusion Reaction Protocol` -> `Transfusion & Blood Products`

### q4_5

- banks/hard-cases-canonical.json:questions.21.caseStudy.questions.4.category: `Physiological Adaptation` -> `Reduction of Risk Potential`
- banks/hard-cases-canonical.json:questions.21.caseStudy.questions.4.topic: `Hemolytic Reaction Confirmation` -> `Transfusion & Blood Products`

### q5_3

- banks/hard-cases-canonical.json:questions.22.caseStudy.questions.2.topic: `Mania Nutritional Support` -> `Nutritional & Fluid Support`

### q5_4

- banks/hard-cases-canonical.json:questions.22.caseStudy.questions.3.topic: `Mania Medications` -> `Psychotropic Medications`

### q6_1

- banks/hard-cases-canonical.json:questions.23.caseStudy.questions.0.topic: `Cushing Triad Recognition` -> `Endocrine & Neurological Disorders`

### q6_2

- banks/hard-cases-canonical.json:questions.23.caseStudy.questions.1.topic: `Cushing Triad Significance` -> `Endocrine & Neurological Disorders`

### q6_3

- banks/hard-cases-canonical.json:questions.23.caseStudy.questions.2.topic: `Osmotic Diuretic Priority` -> `Medication Safety & Admin`

### q6_4

- banks/hard-cases-canonical.json:questions.23.caseStudy.questions.3.topic: `ICP Management Interventions` -> `Endocrine & Neurological Disorders`

### q7_3

- banks/hard-cases-canonical.json:questions.24.caseStudy.questions.2.topic: `Cryoprecipitate Role` -> `Transfusion & Blood Products`

### q7_4

- banks/hard-cases-canonical.json:questions.24.caseStudy.questions.3.topic: `DIC Nursing Interventions` -> `Patient & Environment Safety`

### q8_1

- banks/hard-cases-canonical.json:questions.25.caseStudy.questions.0.topic: `Pyloric Stenosis Recognition` -> `Renal & Gastrointestinal Disorders`

### q8_2

- banks/hard-cases-canonical.json:questions.25.caseStudy.questions.1.topic: `Intussusception Recognition` -> `Renal & Gastrointestinal Disorders`

### q8_3

- banks/hard-cases-canonical.json:questions.25.caseStudy.questions.2.topic: `Pyloric Stenosis Metabolic Impact` -> `Renal & Gastrointestinal Disorders`

### q8_4

- banks/hard-cases-canonical.json:questions.25.caseStudy.questions.3.topic: `Intussusception Interventions` -> `Renal & Gastrointestinal Disorders`

### q8_5

- banks/hard-cases-canonical.json:questions.25.caseStudy.questions.4.topic: `Intussusception Recovery Sign` -> `Renal & Gastrointestinal Disorders`

### q9_1

- banks/hard-cases-canonical.json:questions.26.caseStudy.questions.0.topic: `Serotonin Syndrome Recognition` -> `Medication Safety & Admin`

### q9_4

- banks/hard-cases-canonical.json:questions.26.caseStudy.questions.3.topic: `Hyperthermic Syndrome Interventions` -> `Medication Safety & Admin`

### q9_5

- banks/hard-cases-canonical.json:questions.26.caseStudy.questions.4.topic: `NMS Renal Risk` -> `Renal & Gastrointestinal Disorders`

### rhy_afib_001

- banks/visual-canonical.json:questions.2.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/visual-canonical.json:questions.2.topic: `new-onset atrial fibrillation` -> `Cardiovascular Disorders`

### vit_04

- banks/vitals-canonical.json:questions.3.category: `Pharmacological and Parenteral Therapies` -> `Physiological Adaptation`
- banks/vitals-canonical.json:questions.3.topic: `fluid resuscitation` -> `Cardiovascular Disorders`

### vit_05

- banks/vitals-canonical.json:questions.4.category: `Reduction of Risk Potential` -> `Physiological Adaptation`
- banks/vitals-canonical.json:questions.4.topic: `increased intracranial pressure` -> `Endocrine & Neurological Disorders`

### vit_10

- banks/vitals-canonical.json:questions.9.topic: `malignant hyperthermia` -> `Medication Safety & Admin`

## Stop Gate

No changes have been applied. Apply only after Luke approves this exact dry-run.

