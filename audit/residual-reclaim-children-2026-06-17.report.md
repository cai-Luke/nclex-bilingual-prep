# 835-Residual Topic Classification Proposal Report

Generated: 2026-06-17T20:50:50.678Z
Input: audit/residual-reclaim-children-2026-06-17.input.json
Classifier: codex-gpt-5-reclaim
Canonical bank writes: none

## Status Counts

- proposed: 109
- unresolved: 23
- blocked-cross-category: 4

## Overmatch Check

Unresolved before human curation: 23

## Hydration Summary by Item Type

| Item type | Found | Missing |
|---|---:|---:|
| dropdown_cloze | 15 | 0 |
| fill_in_blank | 5 | 0 |
| matrix | 19 | 0 |
| multiple_choice | 49 | 0 |
| ordered_response | 19 | 0 |
| select_all | 29 | 0 |

## Proposed-Topic Distribution

| Proposed topic | Count | Flags |
|---|---:|---|
| Prioritization & Delegation | 16 | Management of Care >=35% |
| Laboratory & Diagnostic Tests | 12 | Reduction of Risk Potential >=35% |
| Cardiovascular & Endocrine Medications | 10 |  |
| Medication Safety & Admin | 10 | Safety and Infection Control >=35% |
| Discharge Planning & Handoff | 7 |  |
| Dosage Calculations | 7 |  |
| Anticoagulant Therapy | 6 |  |
| Nutritional & Fluid Support | 4 | Basic Care and Comfort >=35% |
| Electrolyte Imbalances | 3 | Physiological Adaptation >=35% |
| Mental Health Disorders | 3 | Psychosocial Integrity >=35% |
| Pediatric & Adolescent Health | 3 | Health Promotion and Maintenance >=35% |
| Perioperative Care | 3 |  |
| Renal & Gastrointestinal Disorders | 3 | Physiological Adaptation >=35% |
| Chronic Disease Management & Lifestyle | 2 |  |
| Elimination & Comfort | 2 |  |
| Endocrine & Neurological Disorders | 2 |  |
| Legal & Ethical Principles | 2 |  |
| Patient & Environment Safety | 2 |  |
| Therapeutic Communication | 2 |  |
| Transmission-Based Precautions | 2 |  |
| Caregiver Role Strain & Family Coping | 1 |  |
| Confidentiality & HIPAA | 1 |  |
| Maternal-Newborn Care & Teaching | 1 |  |
| Procedural Complications & Dialysis | 1 |  |
| Psychotropic Medications | 1 |  |
| Sleep & Rest | 1 |  |
| Standard Precautions & Hygiene | 1 |  |
| Suicide & Crisis Intervention | 1 |  |

## Category Integrity

Rows with deterministic category integrity flags: 0

## Per-Category Adjudication Tables

### Management of Care

Rows: 35

| Status | Proposed topic | Old topic | ID | Type | Reason |
|---|---|---|---|---|---|
| proposed | Caregiver Role Strain & Family Coping | resource planning for caregiver respite | `gpt_case_premium_next_case_caregiver_adaptation_dementia_03_fib_respite` | fill_in_blank | The item tests caregiver strain or family coping support. |
| proposed | Confidentiality & HIPAA | Consent and family involvement in suicide safety planning | `opus12_case_inpatient_suicide_risk_01_q5` | dropdown_cloze | The item tests confidentiality or HIPAA protections. |
| proposed | Discharge Planning & Handoff | delegation and interprofessional rehabilitation coordination | `gpt_case_premium_next_case_rehab_pressure_bowel_02_matrix_delegation` | matrix | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | delirium discharge readiness | `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q5` | multiple_choice | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | home oxygen discharge coordination | `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q3` | ordered_response | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | Initial nursing sequence for suspected C. difficile infection | `gpt_case_opus5_cdi_immunocompromised_01_q5` | ordered_response | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | interdisciplinary discharge safety planning | `opus24_case_elder_neglect_med_mismanagement_01_q6` | select_all | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | mandatory reporting and escalation | `opus24_case_elder_neglect_med_mismanagement_01_q3` | select_all | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Discharge Planning & Handoff | warfarin-enoxaparin-bridge | `opus_case_warfarin_bridge_q6` | multiple_choice | The item tests coordinated discharge, referral, or handoff planning. |
| proposed | Legal & Ethical Principles | Immune Checkpoint Inhibitor Myocarditis | `opus_icit_case_01_q3` | ordered_response | The item tests legal or ethical nursing responsibilities. |
| proposed | Legal & Ethical Principles | Mandated Reporting | `q3_3` | multiple_choice | The item tests legal or ethical nursing responsibilities. |
| proposed | Prioritization & Delegation | Acute Graft-Versus-Host Disease | `opus_agvd_case_agvhd_01_q3` | multiple_choice | The item tests priority-setting, delegation, or escalation of care. |
| proposed | Prioritization & Delegation | Acute Graft-Versus-Host Disease | `opus_agvd_case_agvhd_01_q5` | multiple_choice | The item tests priority-setting, delegation, or escalation of care. |
| proposed | Prioritization & Delegation | Adrenal crisis emergency response | `gpt_case_gap_2026_06_11_adrenal_or_03` | ordered_response | The item tests priority-setting, delegation, or escalation of care. |
| proposed | Prioritization & Delegation | Cardiac Arrest Resuscitation Sequence | `cs_stemi_vfib_04_part_2` | ordered_response | The item tests priority-setting, delegation, or escalation of care. |
| proposed | Prioritization & Delegation | caregiver safety planning and care coordination | `gpt_case_premium_next_case_caregiver_adaptation_dementia_03_or_plan` | ordered_response | The item tests priority-setting, delegation, or escalation of care. |
| proposed | Prioritization & Delegation | Emergency hyperkalemia management | `gpt_case_gap_2026_06_11_aki_or_03` | ordered_response | The item tests priority-setting, delegation, or escalation of care. |
| proposed | Prioritization & Delegation | Escalation for acute pulmonary edema | `gpt_case_gap_2026_06_11_adhf_or_03` | ordered_response | The item tests priority-setting, delegation, or escalation of care. |
| proposed | Prioritization & Delegation | lithium toxicity | `opus_case_lithium_toxicity_q2` | multiple_choice | The item tests priority-setting, delegation, or escalation of care. |
| proposed | Prioritization & Delegation | Mucositis TPN and CRBSI | `opus_tpn_case_mucositis_01_q3` | ordered_response | The item tests priority-setting, delegation, or escalation of care. |
| proposed | Prioritization & Delegation | Pancreatitis deterioration response | `gpt_case_gap_2026_06_11_panc_or_03` | ordered_response | The item tests priority-setting, delegation, or escalation of care. |
| proposed | Prioritization & Delegation | Post-stroke outpatient rehabilitation and safe feeding | `gpt_case_gap_2026_06_11_post_stroke_rehab_part_4_cloze_priority` | dropdown_cloze | The item tests priority-setting, delegation, or escalation of care. |
| proposed | Prioritization & Delegation | Pulmonary Edema Interventions | `cs_adhf_pulm_edema_01_part_2` | ordered_response | The item tests priority-setting, delegation, or escalation of care. |
| proposed | Prioritization & Delegation | Response to heparin-associated bleeding | `gpt_case_gap_2026_06_11_anticoag_or_03` | ordered_response | The item tests priority-setting, delegation, or escalation of care. |
| proposed | Prioritization & Delegation | Sepsis bundle nursing priorities | `gpt_case_gap_2026_06_11_sepsis_or_03` | ordered_response | The item tests priority-setting, delegation, or escalation of care. |
| proposed | Prioritization & Delegation | Septic Shock Interventions | `cs_sepsis_shock_01_part_2` | ordered_response | The item tests priority-setting, delegation, or escalation of care. |
| proposed | Prioritization & Delegation | status epilepticus | `opus_case_se_01_q4` | multiple_choice | The item tests priority-setting, delegation, or escalation of care. |
| unresolved |  | home wound-care teach-back sequence | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q5` | ordered_response | No candidate topic genuinely fits the scoped context. |
| unresolved |  | interprofessional diabetes care coordination | `gpt_case_premium_next_case_health_literacy_diabetes_01_sata_referrals` | select_all | No candidate topic genuinely fits the scoped context. |
| unresolved |  | post-fall escalation | `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q3` | dropdown_cloze | No candidate topic genuinely fits the scoped context. |
| unresolved |  | resource coordination for preventive care | `gpt_case_premium_next_case_preventive_screening_vaccine_05_sata_plan` | select_all | No candidate topic genuinely fits the scoped context. |
| unresolved |  | resource management for vaccination clinic supplies | `gpt_case_premium_next_case_occupational_exposure_vaccine_04_fib_supplies` | fill_in_blank | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Thyroid Storm Interventions | `cs_thyroid_storm_q3` | select_all | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Tuberculosis contact investigation | `opus25_case_tb_airborne_treatment_monitoring_01_q2` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | RN scope medication dose question | `opus22_case_postpartum_intrusive_thoughts_01_q4` | multiple_choice | The item tests postpartum or preeclampsia maternal-newborn care. |

### Safety and Infection Control

Rows: 11

| Status | Proposed topic | Old topic | ID | Type | Reason |
|---|---|---|---|---|---|
| proposed | Medication Safety & Admin | DIC Nursing Interventions | `q7_4` | select_all | The item tests safe parenteral medication route or injection technique. |
| proposed | Medication Safety & Admin | post-fall monitoring sequence | `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q4` | ordered_response | The item tests medication safety in a safety context. |
| proposed | Medication Safety & Admin | warfarin-enoxaparin-bridge | `opus_case_warfarin_bridge_q2` | multiple_choice | The item tests medication safety in a safety context. |
| proposed | Patient & Environment Safety | hyperactive delirium safety | `gpt_2026_06_13_case_delirium_uti_01_q2` | multiple_choice | The item tests environmental or equipment safety. |
| proposed | Patient & Environment Safety | safe mobility and fall prevention | `gpt_case_premium_next_case_rehab_pressure_bowel_02_or_transfer` | ordered_response | The item tests environmental or equipment safety. |
| proposed | Standard Precautions & Hygiene | home wound-care infection prevention | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q1` | matrix | The item tests standard precautions or hygiene safety. |
| proposed | Transmission-Based Precautions | C. difficile colitis and dehydration | `opus20_case_cdiff_01_q2` | multiple_choice | The item tests transmission-based isolation or visitor precautions. |
| proposed | Transmission-Based Precautions | C. difficile colitis and dehydration | `opus20_case_cdiff_01_q3` | multiple_choice | The item tests transmission-based isolation or visitor precautions. |
| unresolved |  | Transfusion Reaction Priority | `q4_1` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Transfusion Reaction Protocol | `q4_4` | select_all | No candidate topic genuinely fits the scoped context. |
| unresolved |  | warfarin-enoxaparin-bridge | `opus_case_warfarin_bridge_q4` | matrix | No candidate topic genuinely fits the scoped context. |

### Health Promotion and Maintenance

Rows: 10

| Status | Proposed topic | Old topic | ID | Type | Reason |
|---|---|---|---|---|---|
| proposed | Chronic Disease Management & Lifestyle | Celiac disease with dermatitis herpetiformis | `gpt_r1_regen_case_celiac_01_q4` | select_all | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Chronic Disease Management & Lifestyle | teach-back discharge education | `opus1_case_tha_discharge_lep_01_q2` | multiple_choice | The item tests chronic disease self-management or lifestyle teaching. |
| proposed | Maternal-Newborn Care & Teaching | postpartum depression recovery teaching | `opus22_case_postpartum_intrusive_thoughts_01_q5` | select_all | The item tests maternal-newborn assessment or teaching. |
| proposed | Pediatric & Adolescent Health | COPD discharge teaching | `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q2` | dropdown_cloze | The item tests pediatric or adolescent health teaching. |
| proposed | Pediatric & Adolescent Health | Discharge teaching after C. difficile infection | `gpt_case_opus5_cdi_immunocompromised_01_q6` | multiple_choice | The item tests pediatric or adolescent health teaching. |
| proposed | Pediatric & Adolescent Health | family teaching for patient-controlled analgesia safety | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01_q4` | select_all | The item tests pediatric or adolescent health teaching. |
| unresolved |  | Celiac disease with dermatitis herpetiformis | `gpt_r1_regen_case_celiac_01_q5` | matrix | No candidate topic genuinely fits the scoped context. |
| unresolved |  | fall prevention plan | `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q5` | matrix | No candidate topic genuinely fits the scoped context. |
| unresolved |  | family education for delirium prevention | `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q4` | select_all | No candidate topic genuinely fits the scoped context. |
| unresolved |  | post-sedation discharge teaching comprehension | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q5` | matrix | No candidate topic genuinely fits the scoped context. |

### Psychosocial Integrity

Rows: 6

| Status | Proposed topic | Old topic | ID | Type | Reason |
|---|---|---|---|---|---|
| proposed | Mental Health Disorders | family teaching about delirium recovery | `gpt_2026_06_13_case_delirium_uti_01_q5` | multiple_choice | The item tests a mental health condition or symptom cluster. |
| proposed | Mental Health Disorders | lithium toxicity | `opus_case_lithium_toxicity_q6` | select_all | The item tests a mental health condition or symptom cluster. |
| proposed | Mental Health Disorders | therapeutic communication during eating disorder refeeding | `opus26_case_refeeding_syndrome_01_q4` | select_all | The item tests a mental health condition or symptom cluster. |
| proposed | Suicide & Crisis Intervention | Psychosocial support and TB adherence planning | `opus25_case_tb_airborne_treatment_monitoring_01_q6` | select_all | The item tests suicide risk, crisis intervention, or safety planning. |
| proposed | Therapeutic Communication | domestic violence disclosure during child safety planning | `gpt_case_opus23_nat_toddler_01_q3` | select_all | The item tests therapeutic communication or psychosocial support. |
| proposed | Therapeutic Communication | ostomy psychosocial adaptation | `gpt_opus21_case_colostomy_lep_discharge_01_q3` | multiple_choice | The item tests therapeutic communication or psychosocial support. |

### Basic Care and Comfort

Rows: 9

| Status | Proposed topic | Old topic | ID | Type | Reason |
|---|---|---|---|---|---|
| proposed | Elimination & Comfort | Nutrition in acute pancreatitis | `gpt_case_gallstone_pancreatitis_01_q5` | multiple_choice | The item tests elimination or comfort-related care. |
| proposed | Elimination & Comfort | warfarin-enoxaparin-bridge | `opus_case_warfarin_bridge_q5` | multiple_choice | The item tests elimination or comfort-related care. |
| proposed | Nutritional & Fluid Support | early refeeding gastrointestinal discomfort | `opus26_case_refeeding_syndrome_01_q2` | multiple_choice | The item tests nutritional or fluid support. |
| proposed | Nutritional & Fluid Support | Mania Nutritional Support | `q5_3` | multiple_choice | The item tests nutritional or fluid support. |
| proposed | Nutritional & Fluid Support | Mucositis TPN and CRBSI | `opus_tpn_case_mucositis_01_q4` | multiple_choice | The item tests nutritional or fluid support. |
| proposed | Nutritional & Fluid Support | Mucositis TPN and CRBSI | `opus_tpn_case_mucositis_01_q6` | multiple_choice | The item tests nutritional or fluid support. |
| proposed | Sleep & Rest | complication prevention in delirium | `gpt_2026_06_13_case_delirium_uti_01_q6` | select_all | The item tests sleep or rest support. |
| unresolved |  | wound-care teach-back failure | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q2` | dropdown_cloze | The item tests skin/wound care, and no licensed candidate genuinely fits. |
| blocked-cross-category | Burn Management | C. difficile colitis and dehydration | `opus20_case_cdiff_01_q4` | multiple_choice | The item tests burn assessment or burn-fluid management. |

### Pharmacological and Parenteral Therapies

Rows: 35

| Status | Proposed topic | Old topic | ID | Type | Reason |
|---|---|---|---|---|---|
| proposed | Anticoagulant Therapy | anticoagulant medication reconciliation | `opus1_case_discharge_med_rec_anticoag_01_q2` | multiple_choice | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | Cardiac Arrest Pharmacotherapy | `cs_stemi_vfib_04_part_3` | matrix | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | Postoperative pulmonary embolism with right ventricular strain | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q4` | select_all | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | Postoperative pulmonary embolism with right ventricular strain | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q5` | select_all | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | rivaroxaban renal function monitoring | `opus1_case_tha_discharge_lep_01_q4` | matrix | The item tests anticoagulant therapy or complications. |
| proposed | Anticoagulant Therapy | warfarin discharge teaching | `opus1_case_discharge_med_rec_anticoag_01_q5` | dropdown_cloze | The item tests anticoagulant therapy or complications. |
| proposed | Cardiovascular & Endocrine Medications | Chronic corticosteroid tapering | `opus25_case_tb_airborne_treatment_monitoring_01_q4` | dropdown_cloze | The item tests cardiovascular or endocrine medication therapy. |
| proposed | Cardiovascular & Endocrine Medications | diuretic potassium safety | `opus24_case_elder_neglect_med_mismanagement_01_q2` | multiple_choice | The item tests cardiovascular or endocrine medication therapy. |
| proposed | Cardiovascular & Endocrine Medications | GBS treatment plan and respiratory thresholds | `gpt_case_gbs_respiratory_compromise_01_q4` | select_all | The item tests cardiovascular or endocrine medication therapy. |
| proposed | Cardiovascular & Endocrine Medications | metformin discharge teaching | `gpt_opus21_case_colostomy_lep_discharge_01_q5` | dropdown_cloze | The item tests cardiovascular or endocrine medication therapy. |
| proposed | Cardiovascular & Endocrine Medications | metformin renal safety | `opus24_case_elder_neglect_med_mismanagement_01_q5` | multiple_choice | The item tests cardiovascular or endocrine medication therapy. |
| proposed | Cardiovascular & Endocrine Medications | Mucositis TPN and CRBSI | `opus_tpn_case_mucositis_01_q2` | multiple_choice | The item tests cardiovascular or endocrine medication therapy. |
| proposed | Cardiovascular & Endocrine Medications | Prerenal acute kidney injury with hyperkalemia | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q2` | select_all | The item tests cardiovascular or endocrine medication therapy. |
| proposed | Cardiovascular & Endocrine Medications | Prerenal acute kidney injury with hyperkalemia | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q4` | dropdown_cloze | The item tests cardiovascular or endocrine medication therapy. |
| proposed | Cardiovascular & Endocrine Medications | Prerenal acute kidney injury with hyperkalemia | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q5` | select_all | The item tests cardiovascular or endocrine medication therapy. |
| proposed | Cardiovascular & Endocrine Medications | Thyroid Storm Pharmacology Sequence | `cs_thyroid_storm_q2` | ordered_response | The item tests cardiovascular or endocrine medication therapy. |
| proposed | Dosage Calculations | Acute Graft-Versus-Host Disease | `opus_agvd_case_agvhd_01_q4` | multiple_choice | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | C. difficile colitis and dehydration | `opus20_case_cdiff_01_q5` | multiple_choice | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | Ethambutol baseline assessment | `opus25_case_tb_airborne_treatment_monitoring_01_q3` | multiple_choice | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | haloperidol safety in delirium | `gpt_2026_06_13_case_delirium_uti_01_q3` | select_all | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | opioid reassessment after IV dose | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01_q2` | dropdown_cloze | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | status epilepticus | `opus_case_se_01_q3` | select_all | The item calculates a medication dose or medication infusion quantity. |
| proposed | Dosage Calculations | Vasopressor Titration | `cs_sepsis_shock_01_part_4` | multiple_choice | The item calculates a medication dose or medication infusion quantity. |
| proposed | Medication Safety & Admin | Anti-tuberculosis hepatotoxicity monitoring | `opus25_case_tb_airborne_treatment_monitoring_01_q5` | multiple_choice | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | Antimotility agents in suspected C. difficile infection | `gpt_case_opus5_cdi_immunocompromised_01_q1` | multiple_choice | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | Cryoprecipitate Role | `q7_3` | multiple_choice | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | Diuretic Therapy Evaluation | `cs_adhf_pulm_edema_01_part_4` | multiple_choice | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | Oral vancomycin route for C. difficile infection | `gpt_case_opus5_cdi_immunocompromised_01_q3` | dropdown_cloze | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | Organophosphate Antidotes | `q2_4` | select_all | The item tests medication administration or safety. |
| proposed | Medication Safety & Admin | safe IV potassium administration | `opus24_case_elder_neglect_med_mismanagement_01_q4` | select_all | The item tests medication administration or safety. |
| proposed | Psychotropic Medications | Mania Medications | `q5_4` | select_all | The item tests psychotropic medication therapy. |
| unresolved |  | Atropine Evaluation | `q2_5` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Osmotic Diuretic Priority | `q6_3` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | Late postpartum preeclampsia with severe features | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q4` | multiple_choice | The item tests postpartum or preeclampsia maternal-newborn care. |
| blocked-cross-category | Maternal-Newborn Care & Teaching | Late postpartum preeclampsia with severe features | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q5` | select_all | The item tests postpartum or preeclampsia maternal-newborn care. |

### Reduction of Risk Potential

Rows: 21

| Status | Proposed topic | Old topic | ID | Type | Reason |
|---|---|---|---|---|---|
| proposed | Laboratory & Diagnostic Tests | ADHF Pathophysiology | `cs_adhf_pulm_edema_01_part_3` | dropdown_cloze | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | anticoagulation reversal outcome evaluation | `gpt_case_warfarin_mvr_2026_06_11_01_q6` | multiple_choice | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | discharge readiness after sedation with language barrier | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q2` | matrix | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Evaluating Sepsis Interventions | `cs_sepsis_shock_01_part_3` | select_all | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | fracture patterns concerning for nonaccidental trauma | `gpt_case_opus23_nat_toddler_01_q2` | matrix | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | GBS diagnostic and respiratory monitoring data | `gpt_case_gbs_respiratory_compromise_01_q2` | matrix | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Immune Checkpoint Inhibitor Myocarditis | `opus_icit_case_01_q4` | select_all | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Monitoring for fulminant C. difficile infection and toxic megacolon | `gpt_case_opus5_cdi_immunocompromised_01_q4` | matrix | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | portable oxygen planning | `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q5` | fill_in_blank | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | PTU Adverse Effects | `cs_thyroid_storm_q4` | multiple_choice | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | renal and delirium trend evaluation | `gpt_2026_06_13_case_delirium_uti_01_q4` | matrix | The item tests laboratory or diagnostic result interpretation. |
| proposed | Laboratory & Diagnostic Tests | Septic shock recognition | `gpt_case_gap_2026_06_11_sepsis_cloze_02` | dropdown_cloze | The item tests laboratory or diagnostic result interpretation. |
| proposed | Perioperative Care | evaluating resuscitation response and OR handoff | `opus4_case_postop_sbar_01_q6` | matrix | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Perioperative Care | postoperative colostomy findings | `gpt_opus21_case_colostomy_lep_discharge_01_q4` | matrix | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Perioperative Care | postoperative deterioration cue recognition | `opus4_case_postop_sbar_01_q1` | matrix | The item tests perioperative assessment or postoperative complication prevention. |
| proposed | Procedural Complications & Dialysis | lithium toxicity | `opus_case_lithium_toxicity_q5` | multiple_choice | The item tests complications of procedures, devices, or dialysis-related care. |
| unresolved |  | pediatric dehydration cue recognition | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03_q1` | matrix | No candidate topic genuinely fits the scoped context. |
| unresolved |  | status epilepticus | `opus_case_se_01_q5` | dropdown_cloze | No candidate topic genuinely fits the scoped context. |
| unresolved |  | status epilepticus | `opus_case_se_01_q6` | multiple_choice | No candidate topic genuinely fits the scoped context. |
| unresolved |  | Urine output target in sepsis | `gpt_case_gap_2026_06_11_sepsis_fib_04` | fill_in_blank | No candidate topic genuinely fits the scoped context. |
| unresolved |  | wound measurement trend | `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q5` | fill_in_blank | No candidate topic genuinely fits the scoped context. |

### Physiological Adaptation

Rows: 9

| Status | Proposed topic | Old topic | ID | Type | Reason |
|---|---|---|---|---|---|
| proposed | Electrolyte Imbalances | emergent hyperkalemia management | `gpt_case_gap_2026_06_11_case_tls_01_q3` | ordered_response | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | tumor lysis syndrome | `gpt_case_gap_2026_06_11_case_tls_01_q2` | dropdown_cloze | The item tests electrolyte derangement recognition or response. |
| proposed | Electrolyte Imbalances | tumor lysis syndrome treatment response | `gpt_case_gap_2026_06_11_case_tls_01_q5` | matrix | The item tests electrolyte derangement recognition or response. |
| proposed | Endocrine & Neurological Disorders | acute hemorrhage prioritization | `gpt_case_warfarin_mvr_2026_06_11_01_q4` | matrix | The item tests endocrine or neurological deterioration. |
| proposed | Endocrine & Neurological Disorders | Infant ICP Signs | `q3_5` | multiple_choice | The item tests endocrine or neurological deterioration. |
| proposed | Renal & Gastrointestinal Disorders | lithium toxicity | `opus_case_lithium_toxicity_q3` | multiple_choice | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | NMS Renal Risk | `q9_5` | multiple_choice | The item tests renal, gastrointestinal, or fluid-output physiology. |
| proposed | Renal & Gastrointestinal Disorders | postoperative hemorrhage with hypovolemic shock | `opus4_case_postop_sbar_01_q2` | multiple_choice | The item tests renal, gastrointestinal, or fluid-output physiology. |
| unresolved |  | Immune Checkpoint Inhibitor Myocarditis | `opus_icit_case_01_q2` | multiple_choice | No candidate topic genuinely fits the scoped context. |

