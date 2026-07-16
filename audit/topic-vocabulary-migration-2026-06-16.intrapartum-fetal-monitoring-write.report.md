# Topic Metadata Cleanup

Date: 2026-06-16
Mode: applied
Write reason: add Intrapartum Fetal Monitoring as canonical RRP topic; sweep pre-existing approved exact aliases (caregiver strain, restraint safety, airborne precautions, postop complications)

Exact topic updates: 26
Suggestions requiring review: 8
Unresolved noncanonical topics: 463
Category untrusted rows: 0
Blocked cross-category lexical aliases: 0

## Updates by Previous Topic

- intrapartum fetal monitoring: 8
- caregiver burden and family adaptation: 5
- caregiver strain: 5
- Family coping after new chronic illness diagnosis: 5
- Airborne Precautions: 1
- Postoperative Complications: 1
- Restraint Safety: 1

## Updates by File

### banks/claude-canonical.json

| Question ID | Category | Type | Old topic | New topic | Rule |
|---|---|---|---|---|---|
| `opus_psi_caregiver_2026_06_10_01` | Psychosocial Integrity | case_study | caregiver burden and family adaptation | Caregiver Role Strain & Family Coping | exact topic normalization |

### banks/gemini-canonical.json

| Question ID | Category | Type | Old topic | New topic | Rule |
|---|---|---|---|---|---|
| `gemini_gapfill_case_2026_06_10_case_caregiver_08` | Psychosocial Integrity | case_study | caregiver strain | Caregiver Role Strain & Family Coping | exact topic normalization |
| `gemini_gapfill_case_2026_06_10_case_caregiver_08_q1` | Psychosocial Integrity | select_all | caregiver strain | Caregiver Role Strain & Family Coping | exact topic normalization |
| `gemini_gapfill_case_2026_06_10_case_caregiver_08_q2` | Psychosocial Integrity | matrix | caregiver strain | Caregiver Role Strain & Family Coping | exact topic normalization |
| `gemini_gapfill_case_2026_06_10_case_caregiver_08_q3` | Psychosocial Integrity | multiple_choice | caregiver strain | Caregiver Role Strain & Family Coping | exact topic normalization |
| `gemini_gapfill_case_2026_06_10_case_caregiver_08_q4` | Psychosocial Integrity | dropdown_cloze | caregiver strain | Caregiver Role Strain & Family Coping | exact topic normalization |
| `fhr_gemini_smoke_2026_06_13_01` | Reduction of Risk Potential | multiple_choice | intrapartum fetal monitoring | Intrapartum Fetal Monitoring | exact topic normalization |
| `fhr_gemini_smoke_2026_06_13_02` | Reduction of Risk Potential | multiple_choice | intrapartum fetal monitoring | Intrapartum Fetal Monitoring | exact topic normalization |
| `fhr_gemini_smoke_2026_06_13_03` | Reduction of Risk Potential | multiple_choice | intrapartum fetal monitoring | Intrapartum Fetal Monitoring | exact topic normalization |
| `fhr_gemini_smoke_2026_06_13_04` | Reduction of Risk Potential | select_all | intrapartum fetal monitoring | Intrapartum Fetal Monitoring | exact topic normalization |
| `fhr_gemini_smoke_2026_06_13_05` | Reduction of Risk Potential | matrix | intrapartum fetal monitoring | Intrapartum Fetal Monitoring | exact topic normalization |
| `fhr_gemini_smoke_2026_06_13_06` | Reduction of Risk Potential | matrix | intrapartum fetal monitoring | Intrapartum Fetal Monitoring | exact topic normalization |

### banks/gpt-canonical.json

| Question ID | Category | Type | Old topic | New topic | Rule |
|---|---|---|---|---|---|
| `gpt_case_premium_2026_06_10_case02_caregiver_burden` | Psychosocial Integrity | case_study | caregiver burden and family adaptation | Caregiver Role Strain & Family Coping | exact topic normalization |
| `gpt_case_premium_2026_06_10_case02_mc_caregiver_priority_01` | Psychosocial Integrity | multiple_choice | caregiver burden and family adaptation | Caregiver Role Strain & Family Coping | exact topic normalization |
| `gpt_case_premium_2026_06_10_case02_matrix_cues_02` | Psychosocial Integrity | matrix | caregiver burden and family adaptation | Caregiver Role Strain & Family Coping | exact topic normalization |
| `gpt_case_gap_2026_06_11_case_family_coping_chronic_diagnosis_08` | Psychosocial Integrity | case_study | Family coping after new chronic illness diagnosis | Caregiver Role Strain & Family Coping | exact topic normalization |
| `gpt_case_gap_2026_06_11_family_coping_part_1_mc_response` | Psychosocial Integrity | multiple_choice | Family coping after new chronic illness diagnosis | Caregiver Role Strain & Family Coping | exact topic normalization |
| `gpt_case_gap_2026_06_11_family_coping_part_2_matrix_cues` | Psychosocial Integrity | matrix | Family coping after new chronic illness diagnosis | Caregiver Role Strain & Family Coping | exact topic normalization |
| `gpt_case_gap_2026_06_11_family_coping_part_3_sata_plan` | Psychosocial Integrity | select_all | Family coping after new chronic illness diagnosis | Caregiver Role Strain & Family Coping | exact topic normalization |
| `gpt_case_gap_2026_06_11_family_coping_part_4_order_visit` | Psychosocial Integrity | ordered_response | Family coping after new chronic illness diagnosis | Caregiver Role Strain & Family Coping | exact topic normalization |
| `gpt_case_premium_next_case_caregiver_adaptation_dementia_03` | Psychosocial Integrity | case_study | caregiver burden and family adaptation | Caregiver Role Strain & Family Coping | exact topic normalization |
| `gpt_hl_sic_restraint_06` | Safety and Infection Control | highlight | Restraint Safety | Patient & Environment Safety | exact topic normalization |
| `gpt_hl_sic_airborne_tb_08` | Safety and Infection Control | highlight | Airborne Precautions | Transmission-Based Precautions | exact topic normalization |
| `gpt_hl_rrp_postop_11` | Reduction of Risk Potential | highlight | Postoperative Complications | Perioperative Care | exact topic normalization |
| `gpt_deepen_2026_06_23_bow_04` | Reduction of Risk Potential | bowtie | intrapartum fetal monitoring | Intrapartum Fetal Monitoring | exact topic normalization |
| `gpt_2026_07_03_2114_t3_fetal_cloze_late_deceleration_05` | Reduction of Risk Potential | dropdown_cloze | intrapartum fetal monitoring | Intrapartum Fetal Monitoring | exact topic normalization |

## Unresolved Human Decisions

| Question ID | Category | Type | Topic | Suggested topic | Reason |
|---|---|---|---|---|---|
| `burn_fib_tbsa_anterior_mix_01` | Reduction of Risk Potential | fill_in_blank | adult burn TBSA estimation | (unresolved) | no exact alias matched; no suggestion available |
| `burn_matrix_parkland_values_05` | Reduction of Risk Potential | matrix | burn Parkland calculation verification | (unresolved) | no exact alias matched; no suggestion available |
| `burn_mc_posterior_tbsa_07` | Reduction of Risk Potential | multiple_choice | adult burn posterior surface TBSA | (unresolved) | no exact alias matched; no suggestion available |
| `opus_bcc_rehab_2026_06_10_06` | Basic Care and Comfort | ordered_response | pressure injury staging and evaluation of wound healing | (unresolved) | no exact alias matched; no suggestion available |
| `opus2_case_code_status_01` | Management of Care | case_study | code status escalation | (unresolved) | no exact alias matched; no suggestion available |
| `opus_vanco_case_01` | Pharmacological and Parenteral Therapies | case_study | vancomycin infusion reaction and nephrotoxicity | (unresolved) | no exact alias matched; no suggestion available |
| `opus1_case_tha_discharge_lep_01` | Management of Care | case_study | discharge coordination after hip arthroplasty | (unresolved) | no exact alias matched; no suggestion available |
| `opus1_case_tha_discharge_lep_01_q2` | Health Promotion and Maintenance | multiple_choice | teach-back discharge education | (unresolved) | no exact alias matched; no suggestion available |
| `opus1_case_tha_discharge_lep_01_q4` | Pharmacological and Parenteral Therapies | matrix | rivaroxaban renal function monitoring | (unresolved) | no exact alias matched; no suggestion available |
| `opus20_case_cdiff_01` | Physiological Adaptation | case_study | C. difficile colitis and dehydration | (unresolved) | no exact alias matched; no suggestion available |
| `opus20_case_cdiff_01_q2` | Safety and Infection Control | multiple_choice | C. difficile colitis and dehydration | (unresolved) | no exact alias matched; no suggestion available |
| `opus20_case_cdiff_01_q3` | Safety and Infection Control | multiple_choice | C. difficile colitis and dehydration | (unresolved) | no exact alias matched; no suggestion available |
| `opus20_case_cdiff_01_q4` | Basic Care and Comfort | multiple_choice | C. difficile colitis and dehydration | (unresolved) | no exact alias matched; no suggestion available |
| `opus20_case_cdiff_01_q5` | Pharmacological and Parenteral Therapies | multiple_choice | C. difficile colitis and dehydration | (unresolved) | no exact alias matched; no suggestion available |
| `opus_case_warfarin_bridge_01` | Pharmacological and Parenteral Therapies | case_study | warfarin-enoxaparin-bridge | (unresolved) | no exact alias matched; no suggestion available |
| `opus_case_warfarin_bridge_q2` | Safety and Infection Control | multiple_choice | warfarin-enoxaparin-bridge | (unresolved) | no exact alias matched; no suggestion available |
| `opus_case_warfarin_bridge_q4` | Safety and Infection Control | matrix | warfarin-enoxaparin-bridge | (unresolved) | no exact alias matched; no suggestion available |
| `opus_case_warfarin_bridge_q5` | Basic Care and Comfort | multiple_choice | warfarin-enoxaparin-bridge | (unresolved) | no exact alias matched; no suggestion available |
| `opus_case_warfarin_bridge_q6` | Management of Care | multiple_choice | warfarin-enoxaparin-bridge | (unresolved) | no exact alias matched; no suggestion available |
| `opus22_case_postpartum_intrusive_thoughts_01` | Psychosocial Integrity | case_study | postpartum depression with intrusive thoughts | (unresolved) | no exact alias matched; no suggestion available |
| `opus22_case_postpartum_intrusive_thoughts_01_q1` | Psychosocial Integrity | matrix | postpartum intrusive thoughts versus psychosis | (unresolved) | no exact alias matched; no suggestion available |
| `opus22_case_postpartum_intrusive_thoughts_01_q2` | Psychosocial Integrity | select_all | therapeutic communication for postpartum intrusive thoughts | (unresolved) | no exact alias matched; no suggestion available |
| `opus22_case_postpartum_intrusive_thoughts_01_q3` | Psychosocial Integrity | dropdown_cloze | postpartum depression treatment response | (unresolved) | no exact alias matched; no suggestion available |
| `opus22_case_postpartum_intrusive_thoughts_01_q4` | Management of Care | multiple_choice | RN scope medication dose question | (unresolved) | no exact alias matched; no suggestion available |
| `opus22_case_postpartum_intrusive_thoughts_01_q5` | Health Promotion and Maintenance | select_all | postpartum depression recovery teaching | (unresolved) | no exact alias matched; no suggestion available |
| `opus24_case_elder_neglect_med_mismanagement_01` | Psychosocial Integrity | case_study | elder neglect medication mismanagement | (unresolved) | no exact alias matched; no suggestion available |
| `opus24_case_elder_neglect_med_mismanagement_01_q1` | Psychosocial Integrity | matrix | elder neglect recognition | (unresolved) | no exact alias matched; no suggestion available |
| `opus24_case_elder_neglect_med_mismanagement_01_q2` | Pharmacological and Parenteral Therapies | multiple_choice | diuretic potassium safety | (unresolved) | no exact alias matched; no suggestion available |
| `opus24_case_elder_neglect_med_mismanagement_01_q3` | Management of Care | select_all | mandatory reporting and escalation | (unresolved) | no exact alias matched; no suggestion available |
| `opus24_case_elder_neglect_med_mismanagement_01_q4` | Pharmacological and Parenteral Therapies | select_all | safe IV potassium administration | (unresolved) | no exact alias matched; no suggestion available |
| `opus24_case_elder_neglect_med_mismanagement_01_q5` | Pharmacological and Parenteral Therapies | multiple_choice | metformin renal safety | (unresolved) | no exact alias matched; no suggestion available |
| `opus24_case_elder_neglect_med_mismanagement_01_q6` | Management of Care | select_all | interdisciplinary discharge safety planning | (unresolved) | no exact alias matched; no suggestion available |
| `opus25_case_tb_airborne_treatment_monitoring_01` | Safety and Infection Control | case_study | Tuberculosis airborne precautions and treatment monitoring | (unresolved) | no exact alias matched; no suggestion available |
| `opus25_case_tb_airborne_treatment_monitoring_01_q2` | Management of Care | multiple_choice | Tuberculosis contact investigation | (unresolved) | no exact alias matched; no suggestion available |
| `opus25_case_tb_airborne_treatment_monitoring_01_q3` | Pharmacological and Parenteral Therapies | multiple_choice | Ethambutol baseline assessment | (unresolved) | no exact alias matched; no suggestion available |
| `opus25_case_tb_airborne_treatment_monitoring_01_q4` | Pharmacological and Parenteral Therapies | dropdown_cloze | Chronic corticosteroid tapering | (unresolved) | no exact alias matched; no suggestion available |
| `opus25_case_tb_airborne_treatment_monitoring_01_q5` | Pharmacological and Parenteral Therapies | multiple_choice | Anti-tuberculosis hepatotoxicity monitoring | (unresolved) | no exact alias matched; no suggestion available |
| `opus25_case_tb_airborne_treatment_monitoring_01_q6` | Psychosocial Integrity | select_all | Psychosocial support and TB adherence planning | (unresolved) | no exact alias matched; no suggestion available |
| `opus26_case_refeeding_syndrome_01` | Physiological Adaptation | case_study | refeeding syndrome risk in anorexia nervosa | (unresolved) | no exact alias matched; no suggestion available |
| `opus26_case_refeeding_syndrome_01_q2` | Basic Care and Comfort | multiple_choice | early refeeding gastrointestinal discomfort | (unresolved) | no exact alias matched; no suggestion available |
| `opus26_case_refeeding_syndrome_01_q4` | Psychosocial Integrity | select_all | therapeutic communication during eating disorder refeeding | (unresolved) | no exact alias matched; no suggestion available |
| `opus27_case_ipv_prenatal_care_01` | Psychosocial Integrity | case_study | intimate partner violence in prenatal care | (unresolved) | no exact alias matched; no suggestion available |
| `opus_case_lithium_toxicity_01` | Pharmacological and Parenteral Therapies | case_study | lithium toxicity | (unresolved) | no exact alias matched; no suggestion available |
| `opus_case_lithium_toxicity_q2` | Management of Care | multiple_choice | lithium toxicity | (unresolved) | no exact alias matched; no suggestion available |
| `opus_case_lithium_toxicity_q3` | Physiological Adaptation | multiple_choice | lithium toxicity | (unresolved) | no exact alias matched; no suggestion available |
| `opus_case_lithium_toxicity_q5` | Reduction of Risk Potential | multiple_choice | lithium toxicity | (unresolved) | no exact alias matched; no suggestion available |
| `opus_case_lithium_toxicity_q6` | Psychosocial Integrity | select_all | lithium toxicity | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_deleg_uap_hl_01` | Management of Care | highlight | Delegation to UAP | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_unsafe_orders_hl_02` | Management of Care | highlight | Unsafe Orders / Chain of Command | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_informed_consent_hl_03` | Management of Care | highlight | Informed Consent / Advocacy | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_incident_doc_hl_04` | Management of Care | highlight | Incident Reporting vs Documentation | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_discharge_coord_bt_05` | Management of Care | bowtie | Discharge Coordination / Referrals | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_escalation_bt_06` | Management of Care | bowtie | Chain of Command / Escalation | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_informed_refusal_bt_07` | Management of Care | bowtie | Advocacy / Informed Refusal | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_deleg_matrix_08` | Management of Care | matrix | Delegation Scope (UAP / LPN / RN) | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_notify_matrix_09` | Management of Care | matrix | Prioritization / Escalation | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_referrals_sata_10` | Management of Care | select_all | Care Coordination / Referrals | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_ama_sata_11` | Management of Care | select_all | Legal-Ethical / Against Medical Advice | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_med_error_order_12` | Management of Care | ordered_response | Error Response / Incident Reporting | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_deleg_process_order_13` | Management of Care | ordered_response | Delegation Process / Supervision | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_assignment_mc_14` | Management of Care | multiple_choice | Assignment / Acuity Matching | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_lpn_deleg_hl_b01` | Management of Care | highlight | Delegation to LPN/LVN | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_intervene_cues_hl_b02` | Management of Care | highlight | Prioritization of Cues | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_hipaa_breach_hl_b03` | Management of Care | highlight | Confidentiality / HIPAA | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_supervision_hl_b04` | Management of Care | highlight | Supervision of UAP | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_triage_priority_bt_b05` | Management of Care | bowtie | Prioritization / Triage | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_advance_directive_bt_b06` | Management of Care | bowtie | Advance Directives / DNR | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_uap_supervision_bt_b07` | Management of Care | bowtie | Delegation / Supervision | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_independent_action_matrix_b08` | Management of Care | matrix | Scope of Practice / Independent Actions | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_see_first_matrix_b09` | Management of Care | matrix | Prioritization / Assessment Order | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_telephone_order_sata_b10` | Management of Care | select_all | Verbal / Telephone Orders | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_impaired_colleague_sata_b11` | Management of Care | select_all | Legal-Ethical / Impaired Practice | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_chain_command_order_b12` | Management of Care | ordered_response | Chain of Command / Unsafe Order | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_discharge_process_order_b13` | Management of Care | ordered_response | Discharge Coordination | (unresolved) | no exact alias matched; no suggestion available |
| `claude_moc_priority_mc_b14` | Management of Care | multiple_choice | Prioritization | (unresolved) | no exact alias matched; no suggestion available |
| `opus_agvd_case_agvhd_01` | Physiological Adaptation | case_study | Acute Graft-Versus-Host Disease | (unresolved) | no exact alias matched; no suggestion available |
| `opus_agvd_case_agvhd_01_q3` | Management of Care | multiple_choice | Acute Graft-Versus-Host Disease | (unresolved) | no exact alias matched; no suggestion available |
| `opus_agvd_case_agvhd_01_q4` | Pharmacological and Parenteral Therapies | multiple_choice | Acute Graft-Versus-Host Disease | (unresolved) | no exact alias matched; no suggestion available |
| `opus_agvd_case_agvhd_01_q5` | Management of Care | multiple_choice | Acute Graft-Versus-Host Disease | (unresolved) | no exact alias matched; no suggestion available |
| `opus_agvd_case_agvhd_01_q6` | Physiological Adaptation | matrix | Acute Graft-Versus-Host Disease | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_backfill_hl_physadapt_12` | Physiological Adaptation | highlight | Physiological Adaptation | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_ppt_ngn_2026_06_22_q6` | Pharmacological and Parenteral Therapies | bowtie | Antimicrobial Therapy | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_ppt_ngn_2026_06_22_q7` | Pharmacological and Parenteral Therapies | dropdown_cloze | Respiratory Medications | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_moc_ngn_2026_06_22_q6` | Management of Care | bowtie | Chain of Command & Escalation | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_sic_ngn_2026_06_21_q1` | Safety and Infection Control | ordered_response | PPE donning and doffing | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_sic_ngn_2026_06_21_q2` | Safety and Infection Control | multiple_choice | Fire safety / oxygen safety | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_sic_ngn_2026_06_21_q4` | Safety and Infection Control | select_all | Sharps safety / exposure response | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_sic_ngn_2026_06_21_q6` | Safety and Infection Control | highlight | Standard / contact / droplet / airborne precautions | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_sic_ngn_2026_06_21_q7` | Safety and Infection Control | highlight | Restraint alternatives and restraint safety | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_sic_ngn_2026_06_21_q8` | Safety and Infection Control | matrix | Transmission-based room placement | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_sic_ngn_2026_06_21_q9` | Safety and Infection Control | bowtie | Isolation teaching for families | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_sic_ngn_2026_06_21_q10` | Safety and Infection Control | bowtie | Environmental safety and equipment checks | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_sic_ngn_2026_06_21_q11` | Safety and Infection Control | ordered_response | Sterile technique / sterile gloving | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_sic_ngn_2026_06_21_q12` | Safety and Infection Control | multiple_choice | Environmental safety and equipment checks | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_sic_ngn_2026_06_21_q15` | Safety and Infection Control | select_all | Standard / contact / droplet / airborne precautions | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_sic_ngn_2026_06_21_q16` | Safety and Infection Control | select_all | Restraint alternatives and restraint safety | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_sic_ngn_2026_06_21_q17` | Safety and Infection Control | highlight | Fire safety / oxygen safety | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_sic_ngn_2026_06_21_q18` | Safety and Infection Control | highlight | Sharps safety / exposure response | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_sic_ngn_2026_06_21_q19` | Safety and Infection Control | bowtie | Isolation teaching for families | (unresolved) | no exact alias matched; no suggestion available |
| `gemini_sic_ngn_2026_06_21_q20` | Safety and Infection Control | bowtie | Environmental safety and equipment checks | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_u6_matrix_cloze_2026_06_09_cloze_preeclampsia_magnesium_20` | Reduction of Risk Potential | dropdown_cloze | Magnesium sulfate toxicity in preeclampsia | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_2026_06_10_case01_preventive_screening` | Health Promotion and Maintenance | case_study | adult preventive screening | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_2026_06_10_case03_chronic_self_management` | Health Promotion and Maintenance | case_study | chronic illness self-management | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_2026_06_10_case04_pressure_injury_rehab` | Basic Care and Comfort | case_study | pressure injury prevention in rehabilitation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_2026_06_10_case04_cloze_stage1_02` | Basic Care and Comfort | dropdown_cloze | pressure injury prevention in rehabilitation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_2026_06_10_case04_mc_first_action_03` | Basic Care and Comfort | multiple_choice | pressure injury prevention in rehabilitation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_2026_06_10_case05_health_literacy_adherence` | Psychosocial Integrity | case_study | health literacy and medication adherence | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_2026_06_10_case05_cloze_teaching_03` | Psychosocial Integrity | dropdown_cloze | health literacy teaching plan | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_2026_06_10_case05_sata_adherence_04` | Psychosocial Integrity | select_all | medication adherence support | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_10_or_pressure_injury_prevention_04` | Safety and Infection Control | ordered_response | Pressure injury prevention in rehabilitation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_10_fib_daily_skin_inspection_07` | Basic Care and Comfort | fill_in_blank | Home skin inspection for pressure injury prevention | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_post_stroke_outpatient_rehab_09` | Basic Care and Comfort | case_study | Post-stroke outpatient rehabilitation and safe feeding | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_post_stroke_rehab_part_4_cloze_priority` | Management of Care | dropdown_cloze | Post-stroke outpatient rehabilitation and safe feeding | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_grief_depression_safety_10` | Psychosocial Integrity | case_study | Depression and grief safety screening | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_chronic_self_management_07` | Health Promotion and Maintenance | case_study | Chronic illness self-management with symptom tracking | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_community_resource_discharge_05` | Management of Care | case_study | Community resource planning for safe discharge | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_preventive_screening_navigation_06` | Health Promotion and Maintenance | case_study | Adult preventive screening follow-up navigation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_rehab_mobility_falls_03` | Basic Care and Comfort | case_study | Rehabilitation mobility progression and fall prevention | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_pressure_injury_ltc_04` | Safety and Infection Control | case_study | Pressure injury prevention in long-term care | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_pressure_ltc_part_1_matrix_risk` | Safety and Infection Control | matrix | Pressure injury prevention in long-term care | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_pressure_ltc_part_2_sata_plan` | Safety and Infection Control | select_all | Pressure injury prevention in long-term care | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_pressure_ltc_part_3_mc_delegate` | Safety and Infection Control | multiple_choice | Pressure injury prevention in long-term care | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_pressure_ltc_part_4_cloze_outcome` | Safety and Infection Control | dropdown_cloze | Pressure injury prevention in long-term care | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_10_b_or_moisture_pressure_prevention_04` | Safety and Infection Control | ordered_response | Moisture management for pressure injury prevention | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_10_b_fib_bed_repositioning_08` | Basic Care and Comfort | fill_in_blank | Repositioning schedule for pressure injury prevention | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_dementia_caregiver_burden_01` | Psychosocial Integrity | case_study | Caregiver burden after dementia discharge | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_ostomy_health_literacy_02` | Basic Care and Comfort | case_study | New ostomy discharge teaching with health literacy barriers | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_ostomy_literacy_part_2_matrix_findings` | Basic Care and Comfort | matrix | New ostomy discharge teaching with health literacy barriers | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_next_case_health_literacy_diabetes_01` | Health Promotion and Maintenance | case_study | chronic illness self-management and health literacy | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_next_case_health_literacy_diabetes_01_sata_referrals` | Management of Care | select_all | interprofessional diabetes care coordination | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_next_case_rehab_pressure_bowel_02` | Basic Care and Comfort | case_study | rehabilitation pressure injury prevention and bowel management | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_next_case_rehab_pressure_bowel_02_or_transfer` | Safety and Infection Control | ordered_response | safe mobility and fall prevention | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_next_case_rehab_pressure_bowel_02_matrix_delegation` | Management of Care | matrix | delegation and interprofessional rehabilitation coordination | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_next_case_caregiver_adaptation_dementia_03_matrix_cues` | Psychosocial Integrity | matrix | caregiver burden and safety cue recognition | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_next_case_caregiver_adaptation_dementia_03_or_plan` | Management of Care | ordered_response | caregiver safety planning and care coordination | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_next_case_caregiver_adaptation_dementia_03_fib_respite` | Management of Care | fill_in_blank | resource planning for caregiver respite | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_next_case_occupational_exposure_vaccine_04` | Safety and Infection Control | case_study | occupational exposure and sharps safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_next_case_occupational_exposure_vaccine_04_fib_supplies` | Management of Care | fill_in_blank | resource management for vaccination clinic supplies | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_next_case_preventive_screening_vaccine_05` | Health Promotion and Maintenance | case_study | adult preventive screening and vaccination counseling | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_next_case_preventive_screening_vaccine_05_sata_plan` | Management of Care | select_all | resource coordination for preventive care | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_premium_next_case_ipv_safety_planning_06` | Psychosocial Integrity | case_study | intimate partner violence screening and safety planning | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_tls_01` | Reduction of Risk Potential | case_study | tumor lysis syndrome | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_tls_01_q2` | Physiological Adaptation | dropdown_cloze | tumor lysis syndrome | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_tls_01_q3` | Physiological Adaptation | ordered_response | emergent hyperkalemia management | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_tls_01_q5` | Physiological Adaptation | matrix | tumor lysis syndrome treatment response | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_adhf_01` | Reduction of Risk Potential | case_study | Acute decompensated heart failure | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_adhf_or_03` | Management of Care | ordered_response | Escalation for acute pulmonary edema | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_aki_02` | Reduction of Risk Potential | case_study | Acute kidney injury | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_aki_or_03` | Management of Care | ordered_response | Emergency hyperkalemia management | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_pancreatitis_03` | Reduction of Risk Potential | case_study | Acute pancreatitis complications | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_panc_or_03` | Management of Care | ordered_response | Pancreatitis deterioration response | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_adrenal_crisis_04` | Reduction of Risk Potential | case_study | Adrenal crisis | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_adrenal_or_03` | Management of Care | ordered_response | Adrenal crisis emergency response | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_urosepsis_05` | Safety and Infection Control | case_study | Sepsis from obstructed urinary source | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_sepsis_matrix_01` | Safety and Infection Control | matrix | Sepsis from urinary source | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_sepsis_cloze_02` | Reduction of Risk Potential | dropdown_cloze | Septic shock recognition | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_sepsis_or_03` | Management of Care | ordered_response | Sepsis bundle nursing priorities | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_sepsis_fib_04` | Reduction of Risk Potential | fill_in_blank | Urine output target in sepsis | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_case_anticoag_bleeding_06` | Reduction of Risk Potential | case_study | Anticoagulation monitoring complication | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gap_2026_06_11_anticoag_or_03` | Management of Care | ordered_response | Response to heparin-associated bleeding | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_jun11_fib_cauti_prevention_01` | Safety and Infection Control | fill_in_blank | CAUTI Prevention Bundle | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_jun11_or_nonpharm_pain_01` | Basic Care and Comfort | ordered_response | Nonpharmacological Musculoskeletal Pain Management | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_opus5_cdi_immunocompromised_01` | Safety and Infection Control | case_study | Clostridioides difficile infection control and treatment | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_opus5_cdi_immunocompromised_01_q1` | Pharmacological and Parenteral Therapies | multiple_choice | Antimotility agents in suspected C. difficile infection | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_opus5_cdi_immunocompromised_01_q3` | Pharmacological and Parenteral Therapies | dropdown_cloze | Oral vancomycin route for C. difficile infection | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_opus5_cdi_immunocompromised_01_q4` | Reduction of Risk Potential | matrix | Monitoring for fulminant C. difficile infection and toxic megacolon | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_opus5_cdi_immunocompromised_01_q5` | Management of Care | ordered_response | Initial nursing sequence for suspected C. difficile infection | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_opus5_cdi_immunocompromised_01_q6` | Health Promotion and Maintenance | multiple_choice | Discharge teaching after C. difficile infection | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_warfarin_mvr_2026_06_11_01` | Pharmacological and Parenteral Therapies | case_study | warfarin reversal in mechanical mitral valve bleeding | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_warfarin_mvr_2026_06_11_01_q4` | Physiological Adaptation | matrix | acute hemorrhage prioritization | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_warfarin_mvr_2026_06_11_01_q6` | Reduction of Risk Potential | multiple_choice | anticoagulation reversal outcome evaluation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_jun12_matrix_pressure_injury_staging_01` | Reduction of Risk Potential | matrix | Pressure injury staging | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_visual_smoke_2026_06_12_fib_burn_parkland_rate_01` | Reduction of Risk Potential | fill_in_blank | adult burn resuscitation Parkland calculation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_visual_smoke_2026_06_12_mc_burn_tbsa_02` | Basic Care and Comfort | multiple_choice | adult Rule of Nines TBSA estimation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_visual_smoke_2026_06_12_matrix_burn_regions_03` | Reduction of Risk Potential | matrix | adult Rule of Nines region recognition | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_visual_smoke_2026_06_12_fib_device_enteral_duration_10` | Management of Care | fill_in_blank | enteral pump duration calculation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01` | Safety and Infection Control | case_study | home oxygen safety and COPD discharge teaching | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q2` | Health Promotion and Maintenance | dropdown_cloze | COPD discharge teaching | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q3` | Management of Care | ordered_response | home oxygen discharge coordination | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01_q5` | Reduction of Risk Potential | fill_in_blank | portable oxygen planning | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02` | Reduction of Risk Potential | case_study | post-fall assessment and escalation in long-term care | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q3` | Management of Care | dropdown_cloze | post-fall escalation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q4` | Safety and Infection Control | ordered_response | post-fall monitoring sequence | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q5` | Health Promotion and Maintenance | matrix | fall prevention plan | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03` | Basic Care and Comfort | case_study | pressure injury prevention with poor nutrition | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q5` | Reduction of Risk Potential | fill_in_blank | wound measurement trend | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04` | Psychosocial Integrity | case_study | delirium prevention and family education after hospitalization | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q4` | Health Promotion and Maintenance | select_all | family education for delirium prevention | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q5` | Management of Care | multiple_choice | delirium discharge readiness | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01` | Reduction of Risk Potential | case_study | safe opioid administration and respiratory reassessment | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01_q2` | Pharmacological and Parenteral Therapies | dropdown_cloze | opioid reassessment after IV dose | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01_q4` | Health Promotion and Maintenance | select_all | family teaching for patient-controlled analgesia safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02` | Management of Care | case_study | interpreter-supported consent and discharge readiness | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q2` | Reduction of Risk Potential | matrix | discharge readiness after sedation with language barrier | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q5` | Health Promotion and Maintenance | matrix | post-sedation discharge teaching comprehension | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03` | Health Promotion and Maintenance | case_study | pediatric dehydration oral rehydration teaching | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03_q1` | Reduction of Risk Potential | matrix | pediatric dehydration cue recognition | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04` | Reduction of Risk Potential | case_study | home health wound-care teaching with teach-back failure | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q1` | Safety and Infection Control | matrix | home wound-care infection prevention | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q2` | Basic Care and Comfort | dropdown_cloze | wound-care teach-back failure | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04_q5` | Management of Care | ordered_response | home wound-care teach-back sequence | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_06_13_case_delirium_uti_01` | Physiological Adaptation | case_study | delirium superimposed on dementia | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_06_13_case_delirium_uti_01_q2` | Safety and Infection Control | multiple_choice | hyperactive delirium safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_06_13_case_delirium_uti_01_q3` | Pharmacological and Parenteral Therapies | select_all | haloperidol safety in delirium | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_06_13_case_delirium_uti_01_q4` | Reduction of Risk Potential | matrix | renal and delirium trend evaluation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_06_13_case_delirium_uti_01_q5` | Psychosocial Integrity | multiple_choice | family teaching about delirium recovery | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_06_13_case_delirium_uti_01_q6` | Basic Care and Comfort | select_all | complication prevention in delirium | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_opus23_nat_toddler_01` | Management of Care | case_study | suspected nonaccidental trauma in a toddler | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_opus23_nat_toddler_01_q2` | Reduction of Risk Potential | matrix | fracture patterns concerning for nonaccidental trauma | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_opus23_nat_toddler_01_q3` | Psychosocial Integrity | select_all | domestic violence disclosure during child safety planning | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_opus21_case_colostomy_lep_discharge_01` | Management of Care | case_study | colostomy discharge teaching for limited English proficiency | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_opus21_case_colostomy_lep_discharge_01_q3` | Psychosocial Integrity | multiple_choice | ostomy psychosocial adaptation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_opus21_case_colostomy_lep_discharge_01_q4` | Reduction of Risk Potential | matrix | postoperative colostomy findings | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_opus21_case_colostomy_lep_discharge_01_q5` | Pharmacological and Parenteral Therapies | dropdown_cloze | metformin discharge teaching | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_injection_smoke_2026_06_15_mc_intradermal_01` | Reduction of Risk Potential | multiple_choice | Injection route recognition from skin cross-section | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_injection_smoke_2026_06_15_mc_subcutaneous_02` | Reduction of Risk Potential | multiple_choice | Injection route recognition from skin cross-section | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_injection_smoke_2026_06_15_mc_intramuscular_03` | Reduction of Risk Potential | multiple_choice | Injection route recognition from skin cross-section | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_injection_smoke_2026_06_15_mc_intravenous_04` | Reduction of Risk Potential | multiple_choice | Injection route recognition from skin cross-section | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_injection_smoke_2026_06_15_mc_layer_highlight_05` | Reduction of Risk Potential | multiple_choice | Target layer identification from visual | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_injection_smoke_2026_06_15_sata_im_cues_06` | Reduction of Risk Potential | select_all | Injection visual cue interpretation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_injection_smoke_2026_06_15_matrix_subq_cues_07` | Reduction of Risk Potential | matrix | Injection visual cue interpretation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_injection_smoke_2026_06_15_matrix_route_match_08` | Reduction of Risk Potential | matrix | Visual technique analysis | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01` | Reduction of Risk Potential | case_study | Late postpartum preeclampsia with severe features | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q1` | Reduction of Risk Potential | highlight | Late postpartum preeclampsia with severe features | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q2` | Reduction of Risk Potential | matrix | Late postpartum preeclampsia with severe features | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q3` | Reduction of Risk Potential | dropdown_cloze | Late postpartum preeclampsia with severe features | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q4` | Pharmacological and Parenteral Therapies | multiple_choice | Late postpartum preeclampsia with severe features | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q5` | Pharmacological and Parenteral Therapies | select_all | Late postpartum preeclampsia with severe features | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_q6` | Reduction of Risk Potential | matrix | Late postpartum preeclampsia with severe features | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_bowtie` | Reduction of Risk Potential | bowtie | Late postpartum preeclampsia with severe features | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_hl_moc_chain_command_01` | Management of Care | highlight | Chain of Command & Escalation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_hl_moc_interpreter_02` | Management of Care | highlight | Communication & Interpreter Use | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_hl_moc_code_status_03` | Management of Care | highlight | Advance Directives & Code Status | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_hl_moc_incident_doc_04` | Management of Care | highlight | Documentation & Incident Reporting | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_hl_moc_lpn_scope_05` | Management of Care | highlight | Scope of Practice & Assignment | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_hl_sic_fire_oxygen_07` | Safety and Infection Control | highlight | Oxygen & Fire Safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_hl_pharm_kcl_order_09` | Pharmacological and Parenteral Therapies | highlight | High-Alert Medication Safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_hl_pharm_maoi_10` | Pharmacological and Parenteral Therapies | highlight | Psychotropic Medication Safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_hl_hpm_immunization_12` | Health Promotion and Maintenance | highlight | Immunizations & Immunosuppression | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_a_bowtie_opioid_sedation_05` | Pharmacological and Parenteral Therapies | bowtie | Opioid Safety and Naloxone | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_a_bowtie_insulin_hypoglycemia_06` | Pharmacological and Parenteral Therapies | bowtie | Insulin Safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_a_highlight_warfarin_rec_07` | Pharmacological and Parenteral Therapies | highlight | Medication Reconciliation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_a_highlight_cefazolin_allergy_08` | Pharmacological and Parenteral Therapies | highlight | Antibiotic Allergy Screening | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_a_matrix_high_alert_admin_09` | Pharmacological and Parenteral Therapies | matrix | High-Alert Medication Safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_a_sata_naloxone_teaching_11` | Pharmacological and Parenteral Therapies | select_all | Opioid Safety and Naloxone | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_a_mc_allergy_hold_12` | Pharmacological and Parenteral Therapies | multiple_choice | Antibiotic Allergy Screening | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_b_fib_vancomycin_rate_02` | Pharmacological and Parenteral Therapies | fill_in_blank | IV Infusion Safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_b_fib_morphine_volume_03` | Pharmacological and Parenteral Therapies | fill_in_blank | Opioid Medication Safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_b_fib_acetaminophen_peds_volume_04` | Pharmacological and Parenteral Therapies | fill_in_blank | Pediatric Weight-Based Dosing | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_b_bowtie_insulin_hypoglycemia_05` | Pharmacological and Parenteral Therapies | bowtie | Insulin Safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_b_bowtie_vancomycin_infusion_reaction_06` | Pharmacological and Parenteral Therapies | bowtie | IV Infusion Safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_b_highlight_apixaban_bleeding_rec_07` | Pharmacological and Parenteral Therapies | highlight | Medication Reconciliation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_b_highlight_gentamicin_toxicity_08` | Pharmacological and Parenteral Therapies | highlight | Antibiotic Monitoring | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_b_matrix_iv_infusion_safety_09` | Pharmacological and Parenteral Therapies | matrix | IV Compatibility and Infusion Safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_b_matrix_patient_teaching_safety_10` | Pharmacological and Parenteral Therapies | matrix | Patient Teaching for Medication Safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_b_sata_transfusion_reaction_11` | Pharmacological and Parenteral Therapies | select_all | Blood Product Monitoring | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pharm_easy_medium_2026_06_21_b_mc_potassium_iv_push_12` | Pharmacological and Parenteral Therapies | multiple_choice | Potassium Replacement Safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_fresh_2026_06_22_moc_03` | Management of Care | ordered_response | Chain of Command & Escalation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_fresh_2026_06_22_moc_04` | Management of Care | highlight | Advance Directives / DNR | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_fresh_2026_06_22_moc_09` | Management of Care | highlight | Chain of Command & Escalation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_fresh_2026_06_22_pharm_05` | Pharmacological and Parenteral Therapies | bowtie | High-Alert Medication Safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_fresh_2026_06_22_sic_03` | Safety and Infection Control | highlight | Environmental safety and equipment checks | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_fresh_2026_06_22_vis_03` | Pharmacological and Parenteral Therapies | multiple_choice | High-Alert Medication Safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_fresh_2026_06_22_vis_07` | Pharmacological and Parenteral Therapies | fill_in_blank | High-Alert Medication Safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_fresh_2026_06_22_vis_08` | Reduction of Risk Potential | fill_in_blank | High-Alert Medication Safety | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_deepen_2026_06_22_esc_01` | Management of Care | bowtie | Chain of Command & Escalation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_deepen_2026_06_22_esc_02` | Management of Care | bowtie | Chain of Command & Escalation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_deepen_2026_06_22_esc_05` | Management of Care | bowtie | Advance Directives / DNR | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_deepen_2026_06_22_esc_06` | Management of Care | bowtie | Advance Directives / DNR | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_deepen_2026_06_22_esc_07` | Management of Care | ordered_response | Chain of Command & Escalation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_deepen_2026_06_22_esc_10` | Management of Care | ordered_response | Advance Directives / DNR | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_deepen_2026_06_22_sic_04` | Safety and Infection Control | highlight | Environmental safety and equipment checks | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_deepen_2026_06_22_sic_08` | Safety and Infection Control | bowtie | Environmental safety and equipment checks | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_deepen_2026_06_22_sic_12` | Safety and Infection Control | ordered_response | Environmental safety and equipment checks | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_deepen_2026_06_22_sic_14` | Safety and Infection Control | bowtie | Environmental safety and equipment checks | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_deepen_2026_06_22_b_moc1_01` | Management of Care | bowtie | Chain of Command & Escalation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_deepen_2026_06_22_b_moc1_02` | Management of Care | bowtie | Advance Directives / DNR | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_deepen_2026_06_22_b_moc1_04` | Management of Care | bowtie | Advance Directives / DNR | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_deepen_2026_06_22_b_moc1_06` | Management of Care | ordered_response | Chain of Command & Escalation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_deepen_2026_06_22_b_moc1_07` | Management of Care | ordered_response | Advance Directives / DNR | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_deepen_2026_06_23_bow_09` | Pharmacological and Parenteral Therapies | bowtie | High-Alert Medication Safety | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t01_001` | Physiological Adaptation | multiple_choice | bronchospasm during procedural sedation | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t01_002` | Reduction of Risk Potential | select_all | capnography after intubation | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t01_003` | Physiological Adaptation | multiple_choice | ROSC during CPR | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t01_004` | Reduction of Risk Potential | matrix | rebreathing on anesthesia circuit | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t01_005` | Safety and Infection Control | select_all | tracheal tube monitoring during transfer | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t01_006` | Pharmacological and Parenteral Therapies | matrix | opioid oversedation with apnea | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t01_001` | Physiological Adaptation | multiple_choice | septic shock progression | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t01_002` | Reduction of Risk Potential | select_all | postoperative hemorrhage | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t01_003` | Physiological Adaptation | matrix | compensated hypovolemic shock | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t01_004` | Pharmacological and Parenteral Therapies | multiple_choice | response to fluid bolus | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t01_005` | Pharmacological and Parenteral Therapies | matrix | septic shock response to fluids | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t01_006` | Safety and Infection Control | select_all | atypical sepsis deterioration | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t02_001` | Reduction of Risk Potential | multiple_choice | ventilator circuit disconnection | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t02_002` | Reduction of Risk Potential | select_all | rebreathing on anesthesia circuit | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t02_003` | Physiological Adaptation | matrix | ROSC recognition during CPR | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t02_004` | Physiological Adaptation | multiple_choice | endotracheal tube placement confirmation | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t02_005` | Physiological Adaptation | select_all | COPD exacerbation with obstructive capnogram | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t02_006` | Safety and Infection Control | matrix | tube displacement during transport | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t03_001` | Physiological Adaptation | multiple_choice | bronchospasm during allergic reaction | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t03_002` | Reduction of Risk Potential | select_all | accidental tracheostomy dislodgement | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t03_003` | Management of Care | matrix | ROSC during code team resuscitation | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t03_004` | Safety and Infection Control | multiple_choice | rebreathing during monitored anesthesia care | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t03_005` | Pharmacological and Parenteral Therapies | matrix | sedation ventilation assessment | (unresolved) | no exact alias matched; no suggestion available |
| `cap_gpt_2026_07_02_t03_006` | Physiological Adaptation | select_all | mainstem intubation versus bronchospasm | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t02_001` | Reduction of Risk Potential | multiple_choice | postoperative hemorrhage | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t02_002` | Safety and Infection Control | select_all | urosepsis deterioration | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t02_003` | Pharmacological and Parenteral Therapies | matrix | response to fluid bolus in pancreatitis | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t02_004` | Pharmacological and Parenteral Therapies | multiple_choice | anaphylaxis response to epinephrine | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t02_005` | Physiological Adaptation | select_all | cardiogenic shock deterioration | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t02_006` | Reduction of Risk Potential | matrix | response to blood replacement in hemorrhage | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t03_001` | Physiological Adaptation | matrix | antipyretic-masked sepsis progression | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t03_002` | Reduction of Risk Potential | select_all | postpartum hemorrhage with uterine atony | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t03_003` | Physiological Adaptation | multiple_choice | occult hypovolemic shock from gastrointestinal bleeding | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t03_004` | Pharmacological and Parenteral Therapies | multiple_choice | response to naloxone for opioid-induced respiratory depression | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t03_005` | Pharmacological and Parenteral Therapies | matrix | vasopressor response in septic shock | (unresolved) | no exact alias matched; no suggestion available |
| `vit_gpt_2026_07_02_t03_006` | Reduction of Risk Potential | select_all | retroperitoneal bleeding after femoral catheterization | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_07_03_2114_t3_clozapine_infection_highlight_02` | Pharmacological and Parenteral Therapies | highlight | Antipsychotic Safety Monitoring | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_07_03_2114_t3_post_thyroidectomy_hypocalcemia_highlight_03` | Reduction of Risk Potential | highlight | Postoperative Thyroidectomy Care | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_07_03_2114_t3_insulin_correction_fib_04` | Pharmacological and Parenteral Therapies | fill_in_blank | Insulin Dose Calculation | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_2026_07_03_2114_t3_hypoglycemia_cloze_rule15_06` | Physiological Adaptation | dropdown_cloze | Hypoglycemia Management | (unresolved) | no exact alias matched; no suggestion available |
| `cs_ngn_001_anorexia` | Physiological Adaptation | case_study | Anorexia Nervosa / Refeeding Syndrome | (unresolved) | no exact alias matched; no suggestion available |
| `cs_ngn_002_disaster` | Safety and Infection Control | case_study | Disaster Triage / Chemical Exposure | (unresolved) | no exact alias matched; no suggestion available |
| `q2_4` | Pharmacological and Parenteral Therapies | select_all | Organophosphate Antidotes | (unresolved) | no exact alias matched; no suggestion available |
| `q2_5` | Pharmacological and Parenteral Therapies | multiple_choice | Atropine Evaluation | (unresolved) | no exact alias matched; no suggestion available |
| `cs_ngn_003_child_abuse` | Safety and Infection Control | case_study | Child Abuse / Non-Accidental Trauma | (unresolved) | no exact alias matched; no suggestion available |
| `q3_1` | Safety and Infection Control | multiple_choice | Shaken Baby Syndrome Signs | (unresolved) | no exact alias matched; no suggestion available |
| `q3_3` | Management of Care | multiple_choice | Mandated Reporting | (unresolved) | no exact alias matched; no suggestion available |
| `q3_4` | Safety and Infection Control | select_all | Child Abuse Interventions | (unresolved) | no exact alias matched; no suggestion available |
| `q3_5` | Physiological Adaptation | multiple_choice | Infant ICP Signs | (unresolved) | no exact alias matched; no suggestion available |
| `cs_ngn_004_blood` | Physiological Adaptation | case_study | Blood Transfusion Reaction (Hemolytic/TRALI) | (unresolved) | no exact alias matched; no suggestion available |
| `q4_1` | Safety and Infection Control | multiple_choice | Transfusion Reaction Priority | (unresolved) | no exact alias matched; no suggestion available |
| `q4_2` | Physiological Adaptation | multiple_choice | Hemolytic Reaction Identification | (unresolved) | no exact alias matched; no suggestion available |
| `q4_4` | Safety and Infection Control | select_all | Transfusion Reaction Protocol | (unresolved) | no exact alias matched; no suggestion available |
| `q4_5` | Physiological Adaptation | multiple_choice | Hemolytic Reaction Confirmation | (unresolved) | no exact alias matched; no suggestion available |
| `cs_ngn_005_bipolar` | Psychosocial Integrity | case_study | Bipolar I - Acute Manic Episode | (unresolved) | no exact alias matched; no suggestion available |
| `q5_3` | Basic Care and Comfort | multiple_choice | Mania Nutritional Support | (unresolved) | no exact alias matched; no suggestion available |
| `q5_4` | Pharmacological and Parenteral Therapies | select_all | Mania Medications | (unresolved) | no exact alias matched; no suggestion available |
| `cs_ngn_006_tbi` | Physiological Adaptation | case_study | Traumatic Brain Injury (TBI) / Cushing's Triad | (unresolved) | no exact alias matched; no suggestion available |
| `q6_1` | Physiological Adaptation | multiple_choice | Cushing Triad Recognition | (unresolved) | no exact alias matched; no suggestion available |
| `q6_2` | Physiological Adaptation | multiple_choice | Cushing Triad Significance | (unresolved) | no exact alias matched; no suggestion available |
| `q6_3` | Pharmacological and Parenteral Therapies | multiple_choice | Osmotic Diuretic Priority | (unresolved) | no exact alias matched; no suggestion available |
| `q6_4` | Physiological Adaptation | select_all | ICP Management Interventions | (unresolved) | no exact alias matched; no suggestion available |
| `cs_ngn_007_dic` | Physiological Adaptation | case_study | Disseminated Intravascular Coagulation (DIC) | (unresolved) | no exact alias matched; no suggestion available |
| `q7_3` | Pharmacological and Parenteral Therapies | multiple_choice | Cryoprecipitate Role | (unresolved) | no exact alias matched; no suggestion available |
| `q7_4` | Safety and Infection Control | select_all | DIC Nursing Interventions | (unresolved) | no exact alias matched; no suggestion available |
| `cs_ngn_008_peds` | Physiological Adaptation | case_study | Pyloric Stenosis vs. Intussusception | (unresolved) | no exact alias matched; no suggestion available |
| `q8_1` | Physiological Adaptation | multiple_choice | Pyloric Stenosis Recognition | (unresolved) | no exact alias matched; no suggestion available |
| `q8_2` | Physiological Adaptation | multiple_choice | Intussusception Recognition | (unresolved) | no exact alias matched; no suggestion available |
| `q8_3` | Physiological Adaptation | multiple_choice | Pyloric Stenosis Metabolic Impact | (unresolved) | no exact alias matched; no suggestion available |
| `q8_4` | Physiological Adaptation | select_all | Intussusception Interventions | (unresolved) | no exact alias matched; no suggestion available |
| `q8_5` | Physiological Adaptation | multiple_choice | Intussusception Recovery Sign | (unresolved) | no exact alias matched; no suggestion available |
| `cs_ngn_009_serotonin` | Pharmacological and Parenteral Therapies | case_study | Serotonin Syndrome vs. NMS | (unresolved) | no exact alias matched; no suggestion available |
| `q9_1` | Pharmacological and Parenteral Therapies | multiple_choice | Serotonin Syndrome Recognition | (unresolved) | no exact alias matched; no suggestion available |
| `q9_2` | Pharmacological and Parenteral Therapies | multiple_choice | SS vs NMS Distinction | (unresolved) | no exact alias matched; no suggestion available |
| `q9_4` | Pharmacological and Parenteral Therapies | select_all | Hyperthermic Syndrome Interventions | (unresolved) | no exact alias matched; no suggestion available |
| `q9_5` | Physiological Adaptation | multiple_choice | NMS Renal Risk | (unresolved) | no exact alias matched; no suggestion available |
| `cs_ngn_010_ad` | Physiological Adaptation | case_study | Autonomic Dysreflexia | (unresolved) | no exact alias matched; no suggestion available |
| `q10_1` | Physiological Adaptation | multiple_choice | Autonomic Dysreflexia Triggers | (unresolved) | no exact alias matched; no suggestion available |
| `q10_4` | Physiological Adaptation | select_all | AD Cause Identification | (unresolved) | no exact alias matched; no suggestion available |
| `claude_cs_jun06_chest_tube_rrp_01` | Reduction of Risk Potential | case_study | Chest Tube Management | (unresolved) | no exact alias matched; no suggestion available |
| `claude_cs_jun06_pressure_injury_bcc_01` | Basic Care and Comfort | case_study | Pressure Injury Staging and Prevention | (unresolved) | no exact alias matched; no suggestion available |
| `claude_cs_jun06_pressure_injury_bcc_01_part_1` | Basic Care and Comfort | matrix | Pressure Injury Staging and Prevention | (unresolved) | no exact alias matched; no suggestion available |
| `claude_cs_jun06_pressure_injury_bcc_01_part_4` | Basic Care and Comfort | multiple_choice | Pressure Injury Staging and Prevention | (unresolved) | no exact alias matched; no suggestion available |
| `claude_cs_jun06_cdiff_sic_01` | Safety and Infection Control | case_study | Clostridioides difficile and Contact Precautions | (unresolved) | no exact alias matched; no suggestion available |
| `claude_cs_jun06_adult_immunization_hpm_01` | Health Promotion and Maintenance | case_study | Adult Immunization and Preventive Screening | (unresolved) | no exact alias matched; no suggestion available |
| `claude_cs_jun06_ipv_screening_psi_01` | Psychosocial Integrity | case_study | Intimate Partner Violence Screening and Support | (unresolved) | no exact alias matched; no suggestion available |
| `cs_thyroid_storm_main` | Physiological Adaptation | case_study | Thyroid Storm | (unresolved) | no exact alias matched; no suggestion available |
| `cs_thyroid_storm_q2` | Pharmacological and Parenteral Therapies | ordered_response | Thyroid Storm Pharmacology Sequence | (unresolved) | no exact alias matched; no suggestion available |
| `cs_thyroid_storm_q3` | Management of Care | select_all | Thyroid Storm Interventions | (unresolved) | no exact alias matched; no suggestion available |
| `cs_thyroid_storm_q4` | Reduction of Risk Potential | multiple_choice | PTU Adverse Effects | (unresolved) | no exact alias matched; no suggestion available |
| `cs_adhf_pulm_edema_01` | Physiological Adaptation | case_study | Acute Decompensated Heart Failure (ADHF) | (unresolved) | no exact alias matched; no suggestion available |
| `cs_adhf_pulm_edema_01_part_2` | Management of Care | ordered_response | Pulmonary Edema Interventions | (unresolved) | no exact alias matched; no suggestion available |
| `cs_adhf_pulm_edema_01_part_3` | Reduction of Risk Potential | dropdown_cloze | ADHF Pathophysiology | (unresolved) | no exact alias matched; no suggestion available |
| `cs_adhf_pulm_edema_01_part_4` | Pharmacological and Parenteral Therapies | multiple_choice | Diuretic Therapy Evaluation | (unresolved) | no exact alias matched; no suggestion available |
| `cs_stemi_vfib_04` | Physiological Adaptation | case_study | Acute Myocardial Infarction and Ventricular Fibrillation | (unresolved) | no exact alias matched; no suggestion available |
| `cs_stemi_vfib_04_part_2` | Management of Care | ordered_response | Cardiac Arrest Resuscitation Sequence | (unresolved) | no exact alias matched; no suggestion available |
| `cs_stemi_vfib_04_part_3` | Pharmacological and Parenteral Therapies | matrix | Cardiac Arrest Pharmacotherapy | (unresolved) | no exact alias matched; no suggestion available |
| `cs_sepsis_shock_01` | Physiological Adaptation | case_study | Septic Shock from Urosepsis | (unresolved) | no exact alias matched; no suggestion available |
| `cs_sepsis_shock_01_part_2` | Management of Care | ordered_response | Septic Shock Interventions | (unresolved) | no exact alias matched; no suggestion available |
| `cs_sepsis_shock_01_part_3` | Reduction of Risk Potential | select_all | Evaluating Sepsis Interventions | (unresolved) | no exact alias matched; no suggestion available |
| `cs_sepsis_shock_01_part_4` | Pharmacological and Parenteral Therapies | multiple_choice | Vasopressor Titration | (unresolved) | no exact alias matched; no suggestion available |
| `opus_scc_case_01` | Physiological Adaptation | case_study | Malignant Spinal Cord Compression | (unresolved) | no exact alias matched; no suggestion available |
| `opus_car_t_crs_2026_06_11_case_01` | Reduction of Risk Potential | case_study | CAR-T cytokine release syndrome and ICANS monitoring | (unresolved) | no exact alias matched; no suggestion available |
| `opus_icit_case_01` | Pharmacological and Parenteral Therapies | case_study | Immune Checkpoint Inhibitor Myocarditis | (unresolved) | no exact alias matched; no suggestion available |
| `opus_icit_case_01_q2` | Physiological Adaptation | multiple_choice | Immune Checkpoint Inhibitor Myocarditis | (unresolved) | no exact alias matched; no suggestion available |
| `opus_icit_case_01_q3` | Management of Care | ordered_response | Immune Checkpoint Inhibitor Myocarditis | (unresolved) | no exact alias matched; no suggestion available |
| `opus_icit_case_01_q4` | Reduction of Risk Potential | select_all | Immune Checkpoint Inhibitor Myocarditis | (unresolved) | no exact alias matched; no suggestion available |
| `opus_tpn_case_mucositis_01` | Physiological Adaptation | case_study | Mucositis TPN and CRBSI | (unresolved) | no exact alias matched; no suggestion available |
| `opus_tpn_case_mucositis_01_q2` | Pharmacological and Parenteral Therapies | multiple_choice | Mucositis TPN and CRBSI | (unresolved) | no exact alias matched; no suggestion available |
| `opus_tpn_case_mucositis_01_q3` | Management of Care | ordered_response | Mucositis TPN and CRBSI | (unresolved) | no exact alias matched; no suggestion available |
| `opus_tpn_case_mucositis_01_q4` | Basic Care and Comfort | multiple_choice | Mucositis TPN and CRBSI | (unresolved) | no exact alias matched; no suggestion available |
| `opus_tpn_case_mucositis_01_q6` | Basic Care and Comfort | multiple_choice | Mucositis TPN and CRBSI | (unresolved) | no exact alias matched; no suggestion available |
| `opus_case_se_01` | Physiological Adaptation | case_study | status epilepticus | (unresolved) | no exact alias matched; no suggestion available |
| `opus_case_se_01_q3` | Pharmacological and Parenteral Therapies | select_all | status epilepticus | (unresolved) | no exact alias matched; no suggestion available |
| `opus_case_se_01_q4` | Management of Care | multiple_choice | status epilepticus | (unresolved) | no exact alias matched; no suggestion available |
| `opus_case_se_01_q5` | Reduction of Risk Potential | dropdown_cloze | status epilepticus | (unresolved) | no exact alias matched; no suggestion available |
| `opus_case_se_01_q6` | Reduction of Risk Potential | multiple_choice | status epilepticus | (unresolved) | no exact alias matched; no suggestion available |
| `opus1_case_discharge_med_rec_anticoag_01` | Management of Care | case_study | discharge medication reconciliation | (unresolved) | no exact alias matched; no suggestion available |
| `opus1_case_discharge_med_rec_anticoag_01_q1` | Management of Care | matrix | discharge medication reconciliation | (unresolved) | no exact alias matched; no suggestion available |
| `opus1_case_discharge_med_rec_anticoag_01_q2` | Pharmacological and Parenteral Therapies | multiple_choice | anticoagulant medication reconciliation | (unresolved) | no exact alias matched; no suggestion available |
| `opus1_case_discharge_med_rec_anticoag_01_q5` | Pharmacological and Parenteral Therapies | dropdown_cloze | warfarin discharge teaching | (unresolved) | no exact alias matched; no suggestion available |
| `opus2_case_postop_opioid_respiratory_depression_01` | Pharmacological and Parenteral Therapies | case_study | opioid-induced respiratory depression | (unresolved) | no exact alias matched; no suggestion available |
| `opus3_iv_potassium_safety_case_01` | Pharmacological and Parenteral Therapies | case_study | IV potassium replacement safety | (unresolved) | no exact alias matched; no suggestion available |
| `opus3_iv_potassium_safety_case_01_q6` | Pharmacological and Parenteral Therapies | multiple_choice | Potassium infusion IV-site complication | (unresolved) | no exact alias matched; no suggestion available |
| `opus4_case_postop_sbar_01` | Management of Care | case_study | postoperative deterioration escalation | (unresolved) | no exact alias matched; no suggestion available |
| `opus4_case_postop_sbar_01_q1` | Reduction of Risk Potential | matrix | postoperative deterioration cue recognition | (unresolved) | no exact alias matched; no suggestion available |
| `opus4_case_postop_sbar_01_q2` | Physiological Adaptation | multiple_choice | postoperative hemorrhage with hypovolemic shock | (unresolved) | no exact alias matched; no suggestion available |
| `opus4_case_postop_sbar_01_q6` | Reduction of Risk Potential | matrix | evaluating resuscitation response and OR handoff | (unresolved) | no exact alias matched; no suggestion available |
| `opus5_case_consent_interpreter_01` | Management of Care | case_study | informed consent and interpreter services | (unresolved) | no exact alias matched; no suggestion available |
| `opus12_case_inpatient_suicide_risk_01` | Psychosocial Integrity | case_study | Inpatient suicide risk and safety precautions | (unresolved) | no exact alias matched; no suggestion available |
| `opus12_case_inpatient_suicide_risk_01_q5` | Management of Care | dropdown_cloze | Consent and family involvement in suicide safety planning | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_major_burn_inhalation_fluid_creep_01` | Physiological Adaptation | case_study | Major thermal burn with inhalation injury and fluid creep | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gallstone_pancreatitis_01` | Physiological Adaptation | case_study | Acute gallstone pancreatitis with cholangitis | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gallstone_pancreatitis_01_q5` | Basic Care and Comfort | multiple_choice | Nutrition in acute pancreatitis | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gbs_respiratory_compromise_01` | Physiological Adaptation | case_study | Guillain-Barre syndrome respiratory compromise | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gbs_respiratory_compromise_01_q2` | Reduction of Risk Potential | matrix | GBS diagnostic and respiratory monitoring data | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_gbs_respiratory_compromise_01_q4` | Pharmacological and Parenteral Therapies | select_all | GBS treatment plan and respiratory thresholds | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01` | Physiological Adaptation | case_study | Postoperative pulmonary embolism with right ventricular strain | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q4` | Pharmacological and Parenteral Therapies | select_all | Postoperative pulmonary embolism with right ventricular strain | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_q5` | Pharmacological and Parenteral Therapies | select_all | Postoperative pulmonary embolism with right ventricular strain | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01` | Physiological Adaptation | case_study | Acute variceal hemorrhage in cirrhosis | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_q3` | Physiological Adaptation | multiple_choice | Acute variceal hemorrhage in cirrhosis | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pph_2026_06_16_case_01` | Physiological Adaptation | case_study | Postpartum hemorrhage due to uterine atony | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pph_2026_06_16_case_01_q1` | Physiological Adaptation | highlight | Postpartum hemorrhage due to uterine atony | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pph_2026_06_16_case_01_q2` | Physiological Adaptation | dropdown_cloze | Postpartum hemorrhage due to uterine atony | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pph_2026_06_16_case_01_q3` | Physiological Adaptation | multiple_choice | Postpartum hemorrhage due to uterine atony | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pph_2026_06_16_case_01_q4` | Physiological Adaptation | select_all | Postpartum hemorrhage due to uterine atony | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pph_2026_06_16_case_01_q5` | Physiological Adaptation | matrix | Postpartum hemorrhage due to uterine atony | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pph_2026_06_16_case_01_q6` | Physiological Adaptation | select_all | Postpartum hemorrhage due to uterine atony | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_pph_2026_06_16_case_01_bowtie` | Physiological Adaptation | bowtie | Postpartum hemorrhage due to uterine atony | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_r1_regen_case_celiac_01` | Physiological Adaptation | case_study | Celiac disease with dermatitis herpetiformis | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_r1_regen_case_celiac_01_q3` | Physiological Adaptation | multiple_choice | Celiac disease with dermatitis herpetiformis | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_r1_regen_case_celiac_01_q4` | Health Promotion and Maintenance | select_all | Celiac disease with dermatitis herpetiformis | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_r1_regen_case_celiac_01_q5` | Health Promotion and Maintenance | matrix | Celiac disease with dermatitis herpetiformis | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01` | Reduction of Risk Potential | case_study | Acute ischemic stroke thrombolysis and thrombectomy complications | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_q4` | Reduction of Risk Potential | select_all | Acute ischemic stroke thrombolysis and thrombectomy complications | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_bowtie` | Reduction of Risk Potential | bowtie | Acute ischemic stroke thrombolysis and thrombectomy complications | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01` | Physiological Adaptation | case_study | Prerenal acute kidney injury with hyperkalemia | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q2` | Pharmacological and Parenteral Therapies | select_all | Prerenal acute kidney injury with hyperkalemia | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q4` | Pharmacological and Parenteral Therapies | dropdown_cloze | Prerenal acute kidney injury with hyperkalemia | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_q5` | Pharmacological and Parenteral Therapies | select_all | Prerenal acute kidney injury with hyperkalemia | (unresolved) | no exact alias matched; no suggestion available |
| `io_fib_hf_net_balance_01` | Reduction of Risk Potential | fill_in_blank | fluid balance monitoring | (unresolved) | no exact alias matched; no suggestion available |
| `io_matrix_prerenal_aki_recheck_04` | Reduction of Risk Potential | matrix | acute kidney injury fluid response | (unresolved) | no exact alias matched; no suggestion available |
| `io_matrix_bowel_prep_deficit_08` | Reduction of Risk Potential | matrix | bowel preparation fluid deficit | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_u3_labtrend_2026_06_09_cloze_magnesium_decline_08` | Reduction of Risk Potential | dropdown_cloze | falling magnesium trend | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_u3_labtrend_2026_06_09_b_or_gi_bleed_hgb_06` | Reduction of Risk Potential | ordered_response | falling hemoglobin trend and suspected bleeding | (unresolved) | no exact alias matched; no suggestion available |
| `gpt_u3_labtrend_2026_06_09_b_cloze_sodium_overcorrection_08` | Reduction of Risk Potential | dropdown_cloze | rapid sodium correction trend | (unresolved) | no exact alias matched; no suggestion available |
| `mar_missed_antibiotic_followup_07` | Management of Care | matrix | missed dose follow-up | (unresolved) | no exact alias matched; no suggestion available |
| `rhy_afib_001` | Reduction of Risk Potential | matrix | new-onset atrial fibrillation | (unresolved) | no exact alias matched; no suggestion available |
| `ekg_b2_mc_01` | Physiological Adaptation | multiple_choice | Atrial Fibrillation | (unresolved) | no exact alias matched; no suggestion available |
| `ekg_b2_sata_06` | Pharmacological and Parenteral Therapies | select_all | Adenosine Side Effects | (unresolved) | no exact alias matched; no suggestion available |
| `ekg_b2_mc_07` | Physiological Adaptation | multiple_choice | Atrial Flutter | (unresolved) | no exact alias matched; no suggestion available |
| `ekg_b2_matrix_10` | Physiological Adaptation | matrix | Atrial Arrhythmias | (unresolved) | no exact alias matched; no suggestion available |
| `ekg_b3_mc_01` | Physiological Adaptation | multiple_choice | First-Degree AV Block | (unresolved) | no exact alias matched; no suggestion available |
| `ekg_b3_matrix_10` | Physiological Adaptation | matrix | AV Heart Blocks | (unresolved) | no exact alias matched; no suggestion available |
| `ekg_b5_sata_06` | Health Promotion and Maintenance | select_all | Pacemaker Discharge Teaching | (unresolved) | no exact alias matched; no suggestion available |
| `iot_hf_ckd_declining_output` | Physiological Adaptation | select_all | Fluid and Electrolyte Balance | (unresolved) | no exact alias matched; no suggestion available |
| `iot_furosemide_late_partial_reversal` | Pharmacological and Parenteral Therapies | multiple_choice | Diuretic Therapy | (unresolved) | no exact alias matched; no suggestion available |
| `iot_furosemide_positive_to_negative_crossover` | Pharmacological and Parenteral Therapies | multiple_choice | Diuretic Therapy | (unresolved) | no exact alias matched; no suggestion available |
| `vit_04` | Pharmacological and Parenteral Therapies | multiple_choice | fluid resuscitation | (unresolved) | no exact alias matched; no suggestion available |
| `vit_05` | Reduction of Risk Potential | multiple_choice | increased intracranial pressure | (unresolved) | no exact alias matched; no suggestion available |
| `vit_10` | Safety and Infection Control | multiple_choice | malignant hyperthermia | (unresolved) | no exact alias matched; no suggestion available |

## Suggestions Requiring Review

| Question ID | Category | Type | Current topic | Suggested topic | Reason |
|---|---|---|---|---|---|
| `gemini_sic_ngn_2026_06_21_q3` | Safety and Infection Control | select_all | Seizure precautions | Endocrine & Neurological Disorders | semantic alias suggestion |
| `gemini_sic_ngn_2026_06_21_q5` | Safety and Infection Control | highlight | Fall prevention | Patient & Environment Safety | semantic alias suggestion |
| `gemini_sic_ngn_2026_06_21_q13` | Safety and Infection Control | dropdown_cloze | Fall prevention | Patient & Environment Safety | semantic alias suggestion |
| `gemini_sic_ngn_2026_06_21_q14` | Safety and Infection Control | dropdown_cloze | Seizure precautions | Endocrine & Neurological Disorders | semantic alias suggestion |
| `gpt_fresh_2026_06_22_sic_05` | Safety and Infection Control | highlight | Fall prevention | Patient & Environment Safety | semantic alias suggestion |
| `gpt_fresh_2026_06_22_sic_07` | Safety and Infection Control | ordered_response | Fall prevention | Patient & Environment Safety | semantic alias suggestion |
| `gpt_deepen_2026_06_22_sic_03` | Safety and Infection Control | highlight | Fall prevention | Patient & Environment Safety | semantic alias suggestion |
| `gpt_deepen_2026_06_22_sic_11` | Safety and Infection Control | ordered_response | Fall prevention | Patient & Environment Safety | semantic alias suggestion |
