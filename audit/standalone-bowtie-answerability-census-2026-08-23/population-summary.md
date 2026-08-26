# Standalone Bowtie Answerability Population

- Frozen bank baseline: `c2ff546`
- Actual paired candidates: **31**
- Expected checkpoint: **31**
- Pairing: **30 EXACT**, **1 ORDINAL_SUFFIX**
- Excluded `_bowtie` items: **19**
- Duplicate IDs, ambiguous pairs, non-case matches, structural deviations: **0**

## Paired population

| Surrogate | Candidate | Companion | Rule | Lane |
|---|---|---|---|---|
| CAND-01 | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_bowtie` | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01` | EXACT | scale-up |
| CAND-02 | `gpt_2026_06_19_case_ici_pneumonitis_01_bowtie` | `gpt_2026_06_19_case_ici_pneumonitis_01` | EXACT | scale-up |
| CAND-03 | `gpt_case_acute_hemolytic_transfusion_reaction_01_bowtie` | `gpt_case_acute_hemolytic_transfusion_reaction_01` | EXACT | scale-up |
| CAND-04 | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_bowtie` | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01` | EXACT | scale-up |
| CAND-05 | `gpt_case_caregiver_role_strain_dementia_01_bowtie` | `gpt_case_caregiver_role_strain_dementia_01` | EXACT | pilot |
| CAND-06 | `gpt_case_client_advocacy_refusal_01_bowtie` | `gpt_case_client_advocacy_refusal_01` | EXACT | scale-up |
| CAND-07 | `gpt_case_clozapine_toxicity_01_bowtie` | `gpt_case_clozapine_toxicity_01` | EXACT | scale-up |
| CAND-08 | `gpt_case_gallstone_pancreatitis_01_bowtie` | `gpt_case_gallstone_pancreatitis_01` | EXACT | scale-up |
| CAND-09 | `gpt_case_gbs_respiratory_compromise_01_bowtie` | `gpt_case_gbs_respiratory_compromise_01` | EXACT | scale-up |
| CAND-10 | `gpt_case_hipaa_disclosure_breach_01_bowtie` | `gpt_case_hipaa_disclosure_breach_01` | EXACT | scale-up |
| CAND-11 | `gpt_case_infection_control_clustered_care_01_bowtie` | `gpt_case_infection_control_clustered_care_01` | EXACT | pilot |
| CAND-12 | `gpt_case_lateral_incivility_01_bowtie` | `gpt_case_lateral_incivility_01` | EXACT | scale-up |
| CAND-13 | `gpt_case_major_burn_inhalation_fluid_creep_01_bowtie` | `gpt_case_major_burn_inhalation_fluid_creep_01` | EXACT | scale-up |
| CAND-14 | `gpt_case_mass_casualty_start_triage_01_bowtie` | `gpt_case_mass_casualty_start_triage_01` | EXACT | scale-up |
| CAND-15 | `gpt_case_neutropenic_fever_nadir_01_bowtie` | `gpt_case_neutropenic_fever_nadir_01` | EXACT | scale-up |
| CAND-16 | `gpt_case_nine_month_well_child_safety_01_bowtie` | `gpt_case_nine_month_well_child_safety_01` | EXACT | pilot |
| CAND-17 | `gpt_case_nurse_provider_conflict_01_bowtie` | `gpt_case_nurse_provider_conflict_01` | EXACT | scale-up |
| CAND-18 | `gpt_case_opioid_recovery_relapse_risk_01_bowtie` | `gpt_case_opioid_recovery_relapse_risk_01` | EXACT | pilot |
| CAND-19 | `gpt_case_overdue_preventive_screening_01_bowtie` | `gpt_case_overdue_preventive_screening_01` | EXACT | pilot |
| CAND-20 | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_bowtie` | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01` | EXACT | scale-up |
| CAND-21 | `gpt_case_pressure_injury_prevention_mobility_01_bowtie` | `gpt_case_pressure_injury_prevention_mobility_01` | EXACT | pilot |
| CAND-22 | `gpt_case_refeeding_syndrome_tpn_01_bowtie` | `gpt_case_refeeding_syndrome_tpn_01` | EXACT | scale-up |
| CAND-23 | `gpt_case_svc_syndrome_01_bowtie` | `gpt_case_svc_syndrome_01` | EXACT | scale-up |
| CAND-24 | `gpt_case_taco_vs_trali_01_bowtie` | `gpt_case_taco_vs_trali_01` | EXACT | scale-up |
| CAND-25 | `gpt_case_unsafe_assignment_01_bowtie` | `gpt_case_unsafe_assignment_01` | EXACT | scale-up |
| CAND-26 | `gpt_case_unsafe_premature_discharge_01_bowtie` | `gpt_case_unsafe_premature_discharge_01` | EXACT | scale-up |
| CAND-27 | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_bowtie` | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01` | EXACT | scale-up |
| CAND-28 | `gpt_pph_2026_06_16_case_01_bowtie` | `gpt_pph_2026_06_16_case_01` | EXACT | scale-up |
| CAND-29 | `gpt_r1_regen_case_celiac_01_bowtie` | `gpt_r1_regen_case_celiac_01` | EXACT | scale-up |
| CAND-30 | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_bowtie` | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01` | EXACT | scale-up |
| CAND-31 | `opus_case_lithium_toxicity_bowtie` | `opus_case_lithium_toxicity_01` | ORDINAL_SUFFIX | pilot |

## Explicit exclusion roster

| Candidate | Reason | Bank | Top-level ordinal (1-based) |
|---|---|---|---:|
| `gpt_2026_07_03_2114_t1_01_co_exposure_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 540 |
| `gpt_2026_07_03_2114_t2_01_cdiff_spores_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 546 |
| `gpt_2026_07_03_2114_t2_02_imminent_suicide_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 547 |
| `gpt_format13_last_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 722 |
| `gpt_format13_mh_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 723 |
| `gpt_format13_pd_peritonitis_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 724 |
| `gpt_format14_hcm_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 732 |
| `gpt_format15_acquired_methemoglobinemia_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 749 |
| `gpt_format15_cardiac_tamponade_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 751 |
| `gpt_format15_ect_prolonged_seizure_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 737 |
| `gpt_format15_meningococcemia_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 738 |
| `gpt_format15_palliative_malignant_bowel_obstruction_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 744 |
| `gpt_format15_severe_asthma_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 757 |
| `gpt_format15_sickle_acute_chest_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 755 |
| `gpt_format15_splenic_sequestration_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 756 |
| `gpt_format15_transfusion_anaphylaxis_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 743 |
| `gpt_format15_vasa_previa_bleeding_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 750 |
| `gpt_format7c_exercise_hypoglycemia_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 643 |
| `gpt_format7c_heart_failure_action_plan_bowtie` | NO_ELIGIBLE_SIBLING_CASE | `banks/gpt-canonical.json` | 644 |
