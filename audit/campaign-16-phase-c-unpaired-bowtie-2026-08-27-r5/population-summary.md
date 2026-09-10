# Campaign 16 Phase C Revision 5 Population

- Bank read path: **working-tree filesystem bytes**.
- Live `_bowtie` suffix roster: **50**.
- Paired complement: **31** (30 `EXACT`, 1 `ORDINAL_SUFFIX`).
- Live unpaired population: **19**.
- Phase A delta: additions **0**, removals **0**.
- Structural precondition: **19/19** at 3/4/4 tokens and 1/2/2 keys.
- Pilot: first **4** rows in ascending candidate-ID order.

## Nullable schema adaptation

Every manifest row explicitly carries `companionCaseId`, `companionBankPath`, companion JSON path/index/ordinal, and `pairingRule` as `null`, plus `unpairedReason: "NO_ELIGIBLE_SIBLING_CASE"`. The Revision-5 TypeScript type encodes these as null literals; no invented pairing member or cast is used.

## Unpaired population

| Surrogate | Candidate | Companion | Pairing | Reason | Lane |
|---|---|---|---|---|---|
| CAND-01 | `gpt_2026_07_03_2114_t1_01_co_exposure_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | pilot |
| CAND-02 | `gpt_2026_07_03_2114_t2_01_cdiff_spores_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | pilot |
| CAND-03 | `gpt_2026_07_03_2114_t2_02_imminent_suicide_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | pilot |
| CAND-04 | `gpt_format13_last_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | pilot |
| CAND-05 | `gpt_format13_mh_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | scale-up |
| CAND-06 | `gpt_format13_pd_peritonitis_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | scale-up |
| CAND-07 | `gpt_format14_hcm_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | scale-up |
| CAND-08 | `gpt_format15_acquired_methemoglobinemia_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | scale-up |
| CAND-09 | `gpt_format15_cardiac_tamponade_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | scale-up |
| CAND-10 | `gpt_format15_ect_prolonged_seizure_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | scale-up |
| CAND-11 | `gpt_format15_meningococcemia_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | scale-up |
| CAND-12 | `gpt_format15_palliative_malignant_bowel_obstruction_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | scale-up |
| CAND-13 | `gpt_format15_severe_asthma_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | scale-up |
| CAND-14 | `gpt_format15_sickle_acute_chest_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | scale-up |
| CAND-15 | `gpt_format15_splenic_sequestration_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | scale-up |
| CAND-16 | `gpt_format15_transfusion_anaphylaxis_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | scale-up |
| CAND-17 | `gpt_format15_vasa_previa_bleeding_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | scale-up |
| CAND-18 | `gpt_format7c_exercise_hypoglycemia_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | scale-up |
| CAND-19 | `gpt_format7c_heart_failure_action_plan_bowtie` | null | null | NO_ELIGIBLE_SIBLING_CASE | scale-up |

## Paired complement

- `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_bowtie`
- `gpt_2026_06_19_case_ici_pneumonitis_01_bowtie`
- `gpt_case_acute_hemolytic_transfusion_reaction_01_bowtie`
- `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_bowtie`
- `gpt_case_caregiver_role_strain_dementia_01_bowtie`
- `gpt_case_client_advocacy_refusal_01_bowtie`
- `gpt_case_clozapine_toxicity_01_bowtie`
- `gpt_case_gallstone_pancreatitis_01_bowtie`
- `gpt_case_gbs_respiratory_compromise_01_bowtie`
- `gpt_case_hipaa_disclosure_breach_01_bowtie`
- `gpt_case_infection_control_clustered_care_01_bowtie`
- `gpt_case_lateral_incivility_01_bowtie`
- `gpt_case_major_burn_inhalation_fluid_creep_01_bowtie`
- `gpt_case_mass_casualty_start_triage_01_bowtie`
- `gpt_case_neutropenic_fever_nadir_01_bowtie`
- `gpt_case_nine_month_well_child_safety_01_bowtie`
- `gpt_case_nurse_provider_conflict_01_bowtie`
- `gpt_case_opioid_recovery_relapse_risk_01_bowtie`
- `gpt_case_overdue_preventive_screening_01_bowtie`
- `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_bowtie`
- `gpt_case_pressure_injury_prevention_mobility_01_bowtie`
- `gpt_case_refeeding_syndrome_tpn_01_bowtie`
- `gpt_case_svc_syndrome_01_bowtie`
- `gpt_case_taco_vs_trali_01_bowtie`
- `gpt_case_unsafe_assignment_01_bowtie`
- `gpt_case_unsafe_premature_discharge_01_bowtie`
- `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_bowtie`
- `gpt_pph_2026_06_16_case_01_bowtie`
- `gpt_r1_regen_case_celiac_01_bowtie`
- `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_bowtie`
- `opus_case_lithium_toxicity_bowtie`
