# Campaign 16 Phase A Baseline

Terminal status: `CAMPAIGN16_PHASE_A_COMPLETE`

This is a read-and-measure producer artifact. It does not close Phase A: Claude must independently rederive A.2–A.5.

## Charter and repository snapshot

- Charter SHA-256: `c3cd80bd38474794a70861119bdc42d3f977b1393c32421c052e05fb34d522f6` — **MATCH**
- Repository: `/Users/holemini/Desktop/Project Shrimp`
- Branch: `main`
- HEAD: `3286024bcab90c1a114811a7202d956c3e586bf4`
- Upstream: `origin/main`
- Ahead/behind: `0/0`
- Complete opening dirty-path list: ` M STAGE-REFERENCE-SEMANTIC-CENSUS-GEMINI-CALIBRATION-SPEC-2026-07-23.md`
- Dirty bank paths: none

The pre-existing unrelated spec modification was preserved.

## A.1 Census baseline

- Generated: `2026-08-27T04:42:21.802Z`
- Input Git SHA: `3286024bcab90c1a114811a7202d956c3e586bf4`
- Total session units: **1,930**
- Standalone top-level supply: **1,785**
- Case-container supply: **145**
- Embedded-part inventory: **731**
- Question-shaped inventory records: **2,661**
- Scored leaves: **1,785 + 731 = 2,516**
- Stable-payload census check: **PASS**

| File | Schema | meta.count | Session Units | Mismatch |
| --- | --- | --- | --- | --- |
| burn-canonical.json | 1.2 | 8 | 8 | — |
| capnography-canonical.json | 1.2 | 7 | 7 | — |
| claude-canonical.json | 2.0 | 96 | 96 | — |
| device-canonical.json | 1.2 | 8 | 8 | — |
| gemini-canonical.json | 2.0 | 874 | 874 | — |
| gpt-canonical.json | 2.0 | 760 | 760 | — |
| hard-cases-canonical.json | 1.8 | 66 | 66 | — |
| io-canonical.json | 1.2 | 8 | 8 | — |
| lab-canonical.json | 1.2 | 20 | 20 | — |
| mar-canonical.json | 1.2 | 8 | 8 | — |
| medlabel-canonical.json | 1.2 | 8 | 8 | — |
| visual-canonical.json | 2.0 | 57 | 57 | — |
| vitals-canonical.json | 1.2 | 10 | 10 | — |

The live totals differ from the 2026-08-23 orientation figures by **0 session units** and **0 scored leaves**. There is no count drift to explain. No byte-identity claim is made for `BANK-CENSUS.md`; the stable payload was checked with `census:check`.

## A.2 Absence proof for the 13 quarantined FIX IDs

Method: shell `rg -n --no-heading --fixed-strings` over the complete `banks/` tree. MCP search was not used.

| ID | Result | Location |
| --- | --- | --- |
| `gpt_balance2_2026_07_15_dc_client_advocacy_02` | NOT_FOUND | — |
| `gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08` | NOT_FOUND | — |
| `gpt_balance3_2026_07_16_dc_psychotropic_medications_11` | NOT_FOUND | — |
| `gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13` | NOT_FOUND | — |
| `gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18` | NOT_FOUND | — |
| `gpt_balance5_2026_07_16_mx_client_advocacy_02` | NOT_FOUND | — |
| `gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13` | NOT_FOUND | — |
| `gpt_balance5_2026_07_16_mx_standard_precautions_hygiene_15` | NOT_FOUND | — |
| `gpt_balance6a_2026_07_16_bt_perioperative_care_13` | NOT_FOUND | — |
| `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05` | NOT_FOUND | — |
| `gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07` | NOT_FOUND | — |
| `gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14` | NOT_FOUND | — |
| `gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17` | NOT_FOUND | — |

All 13 per-ID searches returned cleanly and no quarantined ID was present.

## A.3 Stage-reference population

Trap 4 mitigation used: **mitigation 1**. `validate-bank` passed on the explicit 13-file `banks/*.json` expansion before either sweep. This independently establishes 13 parseable, schema-valid inputs and prevents the canonical sweep's silent-skip path from affecting the result.

- Banks independently established as loaded/analyzable: **13**
- `revealsAllStages`: **451**
- Distinct parent cases with `revealsAllStages`: **93**
- `unresolved`: **0**
- Strict `missingRequiredAnchor`: **75** across **19** parent cases
- Non-strict emitted status / exit: `WARN` / **0**
- Strict emitted status / exit: `FAIL` / **1** — expected under Trap 3

| File | revealsAllStages | unresolved | strict missingRequiredAnchor |
| --- | --- | --- | --- |
| burn-canonical.json | 0 | 0 | 0 |
| capnography-canonical.json | 0 | 0 | 0 |
| claude-canonical.json | 58 | 0 | 6 |
| device-canonical.json | 0 | 0 | 0 |
| gemini-canonical.json | 46 | 0 | 0 |
| gpt-canonical.json | 243 | 0 | 34 |
| hard-cases-canonical.json | 104 | 0 | 35 |
| io-canonical.json | 0 | 0 | 0 |
| lab-canonical.json | 0 | 0 | 0 |
| mar-canonical.json | 0 | 0 | 0 |
| medlabel-canonical.json | 0 | 0 | 0 |
| visual-canonical.json | 0 | 0 | 0 |
| vitals-canonical.json | 0 | 0 | 0 |

The live value happens to equal 451. This is a coincidence of measurement, not reconciliation or confirmation of the historical denominator.

## A.4 Bowtie population and drift

Only `derivePopulation`, `stableJson`, and `sha256` were imported from the frozen audit module. None of `generateArtifacts()`, `openingIdentity()`, `assertFrozenBanks()`, or `finalize-and-verify` was invoked.

Payload hash convention: **`sha256(stableJson(q, 0))`**, where object keys are recursively sorted, `JSON.stringify(value, null, 0)` is used, and a trailing newline is appended.

- Live `_bowtie` suffix roster: **50**
- Paired: **31** — **30 EXACT**, **1 ORDINAL_SUFFIX**
- Unpaired: **19 NO_ELIGIBLE_SIBLING_CASE**
- Paired additions/removals since freeze: none / none
- Unpaired additions/removals since freeze: none / none

### Live paired roster

| Candidate ID | Rule | Current location | Companion ID |
| --- | --- | --- | --- |
| `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[279]` | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01` |
| `gpt_2026_06_19_case_ici_pneumonitis_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[285]` | `gpt_2026_06_19_case_ici_pneumonitis_01` |
| `gpt_case_acute_hemolytic_transfusion_reaction_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[281]` | `gpt_case_acute_hemolytic_transfusion_reaction_01` |
| `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01_bowtie` | EXACT | `banks/hard-cases-canonical.json $.questions[65]` | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01` |
| `gpt_case_caregiver_role_strain_dementia_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[345]` | `gpt_case_caregiver_role_strain_dementia_01` |
| `gpt_case_client_advocacy_refusal_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[301]` | `gpt_case_client_advocacy_refusal_01` |
| `gpt_case_clozapine_toxicity_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[305]` | `gpt_case_clozapine_toxicity_01` |
| `gpt_case_gallstone_pancreatitis_01_bowtie` | EXACT | `banks/hard-cases-canonical.json $.questions[51]` | `gpt_case_gallstone_pancreatitis_01` |
| `gpt_case_gbs_respiratory_compromise_01_bowtie` | EXACT | `banks/hard-cases-canonical.json $.questions[53]` | `gpt_case_gbs_respiratory_compromise_01` |
| `gpt_case_hipaa_disclosure_breach_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[293]` | `gpt_case_hipaa_disclosure_breach_01` |
| `gpt_case_infection_control_clustered_care_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[347]` | `gpt_case_infection_control_clustered_care_01` |
| `gpt_case_lateral_incivility_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[303]` | `gpt_case_lateral_incivility_01` |
| `gpt_case_major_burn_inhalation_fluid_creep_01_bowtie` | EXACT | `banks/hard-cases-canonical.json $.questions[49]` | `gpt_case_major_burn_inhalation_fluid_creep_01` |
| `gpt_case_mass_casualty_start_triage_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[295]` | `gpt_case_mass_casualty_start_triage_01` |
| `gpt_case_neutropenic_fever_nadir_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[287]` | `gpt_case_neutropenic_fever_nadir_01` |
| `gpt_case_nine_month_well_child_safety_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[349]` | `gpt_case_nine_month_well_child_safety_01` |
| `gpt_case_nurse_provider_conflict_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[299]` | `gpt_case_nurse_provider_conflict_01` |
| `gpt_case_opioid_recovery_relapse_risk_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[351]` | `gpt_case_opioid_recovery_relapse_risk_01` |
| `gpt_case_overdue_preventive_screening_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[353]` | `gpt_case_overdue_preventive_screening_01` |
| `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01_bowtie` | EXACT | `banks/hard-cases-canonical.json $.questions[55]` | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01` |
| `gpt_case_pressure_injury_prevention_mobility_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[355]` | `gpt_case_pressure_injury_prevention_mobility_01` |
| `gpt_case_refeeding_syndrome_tpn_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[307]` | `gpt_case_refeeding_syndrome_tpn_01` |
| `gpt_case_svc_syndrome_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[283]` | `gpt_case_svc_syndrome_01` |
| `gpt_case_taco_vs_trali_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[289]` | `gpt_case_taco_vs_trali_01` |
| `gpt_case_unsafe_assignment_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[291]` | `gpt_case_unsafe_assignment_01` |
| `gpt_case_unsafe_premature_discharge_01_bowtie` | EXACT | `banks/gpt-canonical.json $.questions[297]` | `gpt_case_unsafe_premature_discharge_01` |
| `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_bowtie` | EXACT | `banks/hard-cases-canonical.json $.questions[57]` | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01` |
| `gpt_pph_2026_06_16_case_01_bowtie` | EXACT | `banks/hard-cases-canonical.json $.questions[59]` | `gpt_pph_2026_06_16_case_01` |
| `gpt_r1_regen_case_celiac_01_bowtie` | EXACT | `banks/hard-cases-canonical.json $.questions[61]` | `gpt_r1_regen_case_celiac_01` |
| `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01_bowtie` | EXACT | `banks/hard-cases-canonical.json $.questions[63]` | `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01` |
| `opus_case_lithium_toxicity_bowtie` | ORDINAL_SUFFIX | `banks/claude-canonical.json $.questions[68]` | `opus_case_lithium_toxicity_01` |

### Live unpaired roster

| Candidate ID | Current location | Reason |
| --- | --- | --- |
| `gpt_2026_07_03_2114_t1_01_co_exposure_bowtie` | `banks/gpt-canonical.json $.questions[539]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_2026_07_03_2114_t2_01_cdiff_spores_bowtie` | `banks/gpt-canonical.json $.questions[545]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_2026_07_03_2114_t2_02_imminent_suicide_bowtie` | `banks/gpt-canonical.json $.questions[546]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_format13_last_bowtie` | `banks/gpt-canonical.json $.questions[721]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_format13_mh_bowtie` | `banks/gpt-canonical.json $.questions[722]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_format13_pd_peritonitis_bowtie` | `banks/gpt-canonical.json $.questions[723]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_format14_hcm_bowtie` | `banks/gpt-canonical.json $.questions[731]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_format15_acquired_methemoglobinemia_bowtie` | `banks/gpt-canonical.json $.questions[748]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_format15_cardiac_tamponade_bowtie` | `banks/gpt-canonical.json $.questions[750]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_format15_ect_prolonged_seizure_bowtie` | `banks/gpt-canonical.json $.questions[736]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_format15_meningococcemia_bowtie` | `banks/gpt-canonical.json $.questions[737]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_format15_palliative_malignant_bowel_obstruction_bowtie` | `banks/gpt-canonical.json $.questions[743]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_format15_severe_asthma_bowtie` | `banks/gpt-canonical.json $.questions[756]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_format15_sickle_acute_chest_bowtie` | `banks/gpt-canonical.json $.questions[754]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_format15_splenic_sequestration_bowtie` | `banks/gpt-canonical.json $.questions[755]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_format15_transfusion_anaphylaxis_bowtie` | `banks/gpt-canonical.json $.questions[742]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_format15_vasa_previa_bleeding_bowtie` | `banks/gpt-canonical.json $.questions[749]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_format7c_exercise_hypoglycemia_bowtie` | `banks/gpt-canonical.json $.questions[642]` | NO_ELIGIBLE_SIBLING_CASE |
| `gpt_format7c_heart_failure_action_plan_bowtie` | `banks/gpt-canonical.json $.questions[643]` | NO_ELIGIBLE_SIBLING_CASE |

### Eleven paired failing candidates

| Candidate ID | Verdict | Current location | Current hash | Frozen hash | Drift |
| --- | --- | --- | --- | --- | --- |
| `gpt_case_acute_hemolytic_transfusion_reaction_01_bowtie` | FAIL_HIDDEN_CASE_DEPENDENCY | `banks/gpt-canonical.json $.questions[281]` | `789d52ef3191509f938526bdd66cbfb6fc32d6ee1bbb45b4a14b2c2b33f0da65` | `789d52ef3191509f938526bdd66cbfb6fc32d6ee1bbb45b4a14b2c2b33f0da65` | MATCH |
| `gpt_case_caregiver_role_strain_dementia_01_bowtie` | FAIL_HIDDEN_CASE_DEPENDENCY | `banks/gpt-canonical.json $.questions[345]` | `7b2d554215d8a3c2249aaa9bd595721793b4f3a439663e74e76efabe5a3ff6e1` | `7b2d554215d8a3c2249aaa9bd595721793b4f3a439663e74e76efabe5a3ff6e1` | MATCH |
| `gpt_case_client_advocacy_refusal_01_bowtie` | FAIL_HIDDEN_CASE_DEPENDENCY | `banks/gpt-canonical.json $.questions[301]` | `d601c32d131bb984399cbb131b98f3c995e4fe1ef2512ddb1d30c61757172521` | `d601c32d131bb984399cbb131b98f3c995e4fe1ef2512ddb1d30c61757172521` | MATCH |
| `gpt_case_gbs_respiratory_compromise_01_bowtie` | FAIL_HIDDEN_CASE_DEPENDENCY | `banks/hard-cases-canonical.json $.questions[53]` | `74e4fc43567f17a8eed82ce10fd440372afe4bfde7da0878bda51fb30aa34804` | `74e4fc43567f17a8eed82ce10fd440372afe4bfde7da0878bda51fb30aa34804` | MATCH |
| `gpt_case_hipaa_disclosure_breach_01_bowtie` | FAIL_UNSUPPORTED_TOKEN_PREMISE | `banks/gpt-canonical.json $.questions[293]` | `9ba8faa3ec3cea8e1668c0460b2888686f1600d52186d7f5b8297dc6ae332984` | `9ba8faa3ec3cea8e1668c0460b2888686f1600d52186d7f5b8297dc6ae332984` | MATCH |
| `gpt_case_infection_control_clustered_care_01_bowtie` | FAIL_HIDDEN_CASE_DEPENDENCY | `banks/gpt-canonical.json $.questions[347]` | `9257f536a25485a9761d3f004f6deb2679177570b83a6937f1e65ef880d45daf` | `9257f536a25485a9761d3f004f6deb2679177570b83a6937f1e65ef880d45daf` | MATCH |
| `gpt_case_lateral_incivility_01_bowtie` | FAIL_HIDDEN_CASE_DEPENDENCY | `banks/gpt-canonical.json $.questions[303]` | `fea2d76c8716a73087600efe5fd026a33cb36e5b19f28dde067b940ff57e9563` | `fea2d76c8716a73087600efe5fd026a33cb36e5b19f28dde067b940ff57e9563` | MATCH |
| `gpt_case_mass_casualty_start_triage_01_bowtie` | FAIL_HIDDEN_CASE_DEPENDENCY | `banks/gpt-canonical.json $.questions[295]` | `7cdf149aff899a7cd171c9395ec6ab23b93b571c15cb779dc169d605e1dbd4d6` | `7cdf149aff899a7cd171c9395ec6ab23b93b571c15cb779dc169d605e1dbd4d6` | MATCH |
| `gpt_case_neutropenic_fever_nadir_01_bowtie` | FAIL_UNSUPPORTED_TOKEN_PREMISE | `banks/gpt-canonical.json $.questions[287]` | `f8e8ca6eddd5f48cf67ef7ea5a51d9eb5bcfea2c67def6b50eafcbf0818ac00b` | `f8e8ca6eddd5f48cf67ef7ea5a51d9eb5bcfea2c67def6b50eafcbf0818ac00b` | MATCH |
| `gpt_case_unsafe_premature_discharge_01_bowtie` | FAIL_UNSUPPORTED_TOKEN_PREMISE | `banks/gpt-canonical.json $.questions[297]` | `d9462741c338b5041762f5f4a4c51cffd17bd54d34d17839c381b02cbd59bf5e` | `d9462741c338b5041762f5f4a4c51cffd17bd54d34d17839c381b02cbd59bf5e` | MATCH |
| `gpt_pph_2026_06_16_case_01_bowtie` | FAIL_UNSUPPORTED_TOKEN_PREMISE | `banks/hard-cases-canonical.json $.questions[59]` | `efcc3588cf2750744fb89be66529904081f6953d6158505dfc694e48086fed39` | `efcc3588cf2750744fb89be66529904081f6953d6158505dfc694e48086fed39` | MATCH |

All 11 were resolved by ID, not by the frozen indices. Candidate payload drift: **0/11**.

### Seven relational companion checks

| Candidate ID | Companion ID | Current location | Current hash | Frozen hash | Drift |
| --- | --- | --- | --- | --- | --- |
| `gpt_case_acute_hemolytic_transfusion_reaction_01_bowtie` | `gpt_case_acute_hemolytic_transfusion_reaction_01` | `banks/gpt-canonical.json $.questions[280]` | `bcfcc790be6233200ab06313261491e64498a34a19ea591fd9401d732ee957c8` | `bcfcc790be6233200ab06313261491e64498a34a19ea591fd9401d732ee957c8` | MATCH |
| `gpt_case_caregiver_role_strain_dementia_01_bowtie` | `gpt_case_caregiver_role_strain_dementia_01` | `banks/gpt-canonical.json $.questions[344]` | `cea0cb8c7a2e680cddd6acc98d8b92b5c579c4c6f461000b68de54e132dea094` | `cea0cb8c7a2e680cddd6acc98d8b92b5c579c4c6f461000b68de54e132dea094` | MATCH |
| `gpt_case_client_advocacy_refusal_01_bowtie` | `gpt_case_client_advocacy_refusal_01` | `banks/gpt-canonical.json $.questions[300]` | `c496073c994e10b31b80663f3d15c406e3614973f7fcb7701c3fed97e0ebfabd` | `c496073c994e10b31b80663f3d15c406e3614973f7fcb7701c3fed97e0ebfabd` | MATCH |
| `gpt_case_gbs_respiratory_compromise_01_bowtie` | `gpt_case_gbs_respiratory_compromise_01` | `banks/hard-cases-canonical.json $.questions[52]` | `adb56be57dfb15252c6dd54f6046452f691634fc588b786f45236e8a140a6b86` | `adb56be57dfb15252c6dd54f6046452f691634fc588b786f45236e8a140a6b86` | MATCH |
| `gpt_case_infection_control_clustered_care_01_bowtie` | `gpt_case_infection_control_clustered_care_01` | `banks/gpt-canonical.json $.questions[346]` | `e7d80f5c5f577144b24c0b077a39bb361d84a948f7cbdc74c7c63f257efe938b` | `e7d80f5c5f577144b24c0b077a39bb361d84a948f7cbdc74c7c63f257efe938b` | MATCH |
| `gpt_case_lateral_incivility_01_bowtie` | `gpt_case_lateral_incivility_01` | `banks/gpt-canonical.json $.questions[302]` | `ac9ad4bd169f9065a85b1216abd4091b1eec3b0c378c5259d7548dc351f8414b` | `ac9ad4bd169f9065a85b1216abd4091b1eec3b0c378c5259d7548dc351f8414b` | MATCH |
| `gpt_case_mass_casualty_start_triage_01_bowtie` | `gpt_case_mass_casualty_start_triage_01` | `banks/gpt-canonical.json $.questions[294]` | `4462fe97c8ce38a9bfa029b4df5795783b4864df2a7143dea649e6a0d8d819aa` | `4462fe97c8ce38a9bfa029b4df5795783b4864df2a7143dea649e6a0d8d819aa` | MATCH |

Frozen companion payloads were reconstructed with `git show c2ff546:<bankPath>`. Companion drift: **0/7**.

### Nineteen unpaired payload checks

| Candidate ID | Current location | Current hash | Frozen hash | Drift |
| --- | --- | --- | --- | --- |
| `gpt_2026_07_03_2114_t1_01_co_exposure_bowtie` | `banks/gpt-canonical.json $.questions[539]` | `d52f20663ce537cee595d9e46dee04c69b4de4a78f63ab885679101f797b5bd3` | `d52f20663ce537cee595d9e46dee04c69b4de4a78f63ab885679101f797b5bd3` | MATCH |
| `gpt_2026_07_03_2114_t2_01_cdiff_spores_bowtie` | `banks/gpt-canonical.json $.questions[545]` | `156c37fb872d72e4dcc1c03422222699e844d6c07c46c28c3a3646e612575949` | `156c37fb872d72e4dcc1c03422222699e844d6c07c46c28c3a3646e612575949` | MATCH |
| `gpt_2026_07_03_2114_t2_02_imminent_suicide_bowtie` | `banks/gpt-canonical.json $.questions[546]` | `db0f561af76d4e1cb5de422662fad579f58e81a0ef068d8d68500fa29668e4cb` | `db0f561af76d4e1cb5de422662fad579f58e81a0ef068d8d68500fa29668e4cb` | MATCH |
| `gpt_format13_last_bowtie` | `banks/gpt-canonical.json $.questions[721]` | `ab06ae7bf9bae8cf39c3ab315030d14b88c077c149343fe1c0b9f590262924fc` | `ab06ae7bf9bae8cf39c3ab315030d14b88c077c149343fe1c0b9f590262924fc` | MATCH |
| `gpt_format13_mh_bowtie` | `banks/gpt-canonical.json $.questions[722]` | `b84e2dfc09ca8a6b46501e792bae2261fab64c1f46ffabc559a1ba0aa126bccb` | `b84e2dfc09ca8a6b46501e792bae2261fab64c1f46ffabc559a1ba0aa126bccb` | MATCH |
| `gpt_format13_pd_peritonitis_bowtie` | `banks/gpt-canonical.json $.questions[723]` | `1917fc5c2d0bf9e47dc370fe0c3e761f68ac155fde9c4ae290b87096e46a6095` | `1917fc5c2d0bf9e47dc370fe0c3e761f68ac155fde9c4ae290b87096e46a6095` | MATCH |
| `gpt_format14_hcm_bowtie` | `banks/gpt-canonical.json $.questions[731]` | `b88ed0482d9d7f6d8d39b143b457657ad9243bc138f2b9e7d4622c2dfa07d75f` | `b88ed0482d9d7f6d8d39b143b457657ad9243bc138f2b9e7d4622c2dfa07d75f` | MATCH |
| `gpt_format15_acquired_methemoglobinemia_bowtie` | `banks/gpt-canonical.json $.questions[748]` | `48f90bfa36cb3f7e0b65f637a8ae9de80c35257eac4f812b3373018d4a727777` | `48f90bfa36cb3f7e0b65f637a8ae9de80c35257eac4f812b3373018d4a727777` | MATCH |
| `gpt_format15_cardiac_tamponade_bowtie` | `banks/gpt-canonical.json $.questions[750]` | `14b942965319b128382b879025356dbac3d13561d392c5ece80ef5e21244fb14` | `14b942965319b128382b879025356dbac3d13561d392c5ece80ef5e21244fb14` | MATCH |
| `gpt_format15_ect_prolonged_seizure_bowtie` | `banks/gpt-canonical.json $.questions[736]` | `c0d8638519d80fc1b6bd8a23ae0ec2a5cd5ec094611d15c83d26632f9306367a` | `c0d8638519d80fc1b6bd8a23ae0ec2a5cd5ec094611d15c83d26632f9306367a` | MATCH |
| `gpt_format15_meningococcemia_bowtie` | `banks/gpt-canonical.json $.questions[737]` | `6ecd999b61f1b17d953b1e54820b3047afabd1e88392e09fb4e8d4163e65cd2b` | `6ecd999b61f1b17d953b1e54820b3047afabd1e88392e09fb4e8d4163e65cd2b` | MATCH |
| `gpt_format15_palliative_malignant_bowel_obstruction_bowtie` | `banks/gpt-canonical.json $.questions[743]` | `238dd73803862f44c357109bde8cced485f0479c27667466b24b5e9c336e036d` | `238dd73803862f44c357109bde8cced485f0479c27667466b24b5e9c336e036d` | MATCH |
| `gpt_format15_severe_asthma_bowtie` | `banks/gpt-canonical.json $.questions[756]` | `b5000b34fcdead37f242f2294f6c95246011d7635b757bb03e0c0618c627159d` | `b5000b34fcdead37f242f2294f6c95246011d7635b757bb03e0c0618c627159d` | MATCH |
| `gpt_format15_sickle_acute_chest_bowtie` | `banks/gpt-canonical.json $.questions[754]` | `124a53eb198eb035ac98b83ef256ad7e2bd8c72424af90e8a783f951229af698` | `124a53eb198eb035ac98b83ef256ad7e2bd8c72424af90e8a783f951229af698` | MATCH |
| `gpt_format15_splenic_sequestration_bowtie` | `banks/gpt-canonical.json $.questions[755]` | `cad98e7f2d181e8141bee5db89a7142dc8f2ddfbb09f6937ee53312b44779423` | `cad98e7f2d181e8141bee5db89a7142dc8f2ddfbb09f6937ee53312b44779423` | MATCH |
| `gpt_format15_transfusion_anaphylaxis_bowtie` | `banks/gpt-canonical.json $.questions[742]` | `1157de9021406a663da1d8649f6654de20f4e6322fa73f7c8ad4354a46a6188b` | `1157de9021406a663da1d8649f6654de20f4e6322fa73f7c8ad4354a46a6188b` | MATCH |
| `gpt_format15_vasa_previa_bleeding_bowtie` | `banks/gpt-canonical.json $.questions[749]` | `1f9dbd06dd65e1c2f010b94372f32d6a23420264b5651663d770ac55edd77920` | `1f9dbd06dd65e1c2f010b94372f32d6a23420264b5651663d770ac55edd77920` | MATCH |
| `gpt_format7c_exercise_hypoglycemia_bowtie` | `banks/gpt-canonical.json $.questions[642]` | `df41a515bafd2325afb0a63fa1b3050ae5d6c6165213af41314d8e3e8dc8ad81` | `df41a515bafd2325afb0a63fa1b3050ae5d6c6165213af41314d8e3e8dc8ad81` | MATCH |
| `gpt_format7c_heart_failure_action_plan_bowtie` | `banks/gpt-canonical.json $.questions[643]` | `20cdfd9a06862487c399ca4e36c2de9e76ebf1d16d5267721e47fb4df8db877f` | `20cdfd9a06862487c399ca4e36c2de9e76ebf1d16d5267721e47fb4df8db877f` | MATCH |

Frozen unpaired payloads were reconstructed from `git show c2ff546:banks/gpt-canonical.json`. Unpaired payload drift: **0/19**.

## A.5 Campaign 16 raw-file-byte baseline

These are SHA-256 hashes of the raw bank file bytes. They are distinct from the stable-payload convention in A.4.

| Bundled bank file | Raw-file SHA-256 |
| --- | --- |
| `banks/burn-canonical.json` | `5244b8d37daa49adbd1fbed7991f4ede52ded8ce710e26821841ef5e2ce3719f` |
| `banks/capnography-canonical.json` | `36d72a89405fe4400f27b3b8969cdbe1c51f3217151f8b2592b7f877d636f20c` |
| `banks/claude-canonical.json` | `25f53ded1ac21da4ca9d211040c3f6110ebee38d72ba41d0fc64fe358ba73b71` |
| `banks/device-canonical.json` | `83d5a6ac7219524f4c528265291cbee2ed5b2f17c13fbeb3649342bae2e4aac5` |
| `banks/gemini-canonical.json` | `3dc416a4652f5f5712219dde7de87b92f0697fac953750b8abb8fc0dbb976bb6` |
| `banks/gpt-canonical.json` | `be83c943bbe6e50297de94d25b596069767b8fee876426ec798dc66ca8d5a76d` |
| `banks/hard-cases-canonical.json` | `8068c6917e53257a31c7299454c213f61bea62e61d7cf185cb1a09386f4e4862` |
| `banks/io-canonical.json` | `2ce6488e65049ba00cd9dccf889a042e0a624f224387382d564d282e147b2645` |
| `banks/lab-canonical.json` | `1038cb68f6b91f6a2c981562d97ad9e16179db9b1332c75725fd538595c44b05` |
| `banks/mar-canonical.json` | `f12c03a28ff5b52411843f84bc942b4ca5667e989194357ed2d60a394f17641e` |
| `banks/medlabel-canonical.json` | `cc3bd0053516fc7ea4b23e814e46f186e6d2dbf40888fa713a862c07ea2b3993` |
| `banks/visual-canonical.json` | `e42e2a3fa6aa349a61279e6988e250e65c2b752a6f36d33806a2671e0af0f9e4` |
| `banks/vitals-canonical.json` | `5154e25492bced8e4a49d763f04e25e154389c31e085bf37669651e13d411b9d` |

## Verification

### A.1

- `npm run census` — exit **0**; emitted `Census written to census.json and BANK-CENSUS.md`, 1,930 session units, 2,516 scored leaves, 199 visual artifacts.
- `npm run census:check` — exit **0**; emitted `census.json is up to date.`

### A.2

Exact shell command:

```zsh
overall=0
while IFS= read -r id; do
  matches=$(rg -n --no-heading --fixed-strings "$id" banks 2>&1)
  rc=$?
  if [ "$rc" -eq 0 ]; then
    printf '%s\tFOUND\t%s\n' "$id" "$matches"
    overall=1
  elif [ "$rc" -eq 1 ]; then
    printf '%s\tNOT_FOUND\n' "$id"
  else
    printf '%s\tSEARCH_ERROR_%s\t%s\n' "$id" "$rc" "$matches"
    overall=2
  fi
done <<'IDS'
gpt_balance2_2026_07_15_dc_client_advocacy_02
gpt_balance3_2026_07_16_dc_discharge_planning_handoff_08
gpt_balance3_2026_07_16_dc_psychotropic_medications_11
gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13
gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18
gpt_balance5_2026_07_16_mx_client_advocacy_02
gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13
gpt_balance5_2026_07_16_mx_standard_precautions_hygiene_15
gpt_balance6a_2026_07_16_bt_perioperative_care_13
gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_05
gpt_balance6b_2026_07_16_dc_confidentiality_hipaa_07
gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14
gpt_balance6b_2026_07_16_hl_standard_precautions_hygiene_17
IDS
exit "$overall"
```

Exit **0**; emitted 13 `NOT_FOUND` rows.

### A.3

- `npm run validate-bank -- banks/*.json` — exit **0**; all 13 explicit bank files emitted `OK`.
- `npm run audit:stage-refs` — exit **0**; emitted `[WARN]` and the complete 451-row measurement.
- `npm run audit:stage-refs -- --strict` — exit **1**; emitted `[FAIL]` and the structurally complete 526-row measurement. It was rerun with stdout captured to a `mktemp` file and parsed before the saved exit code was inspected; the temporary file was then removed.

### A.4

- `npx tsx audit/campaign-16-phase-a-baseline-2026-08-26/.measure-a4.ts` — exit **0**; emitted structured JSON with `status: PASS`, the 50-row live roster, and every required hash comparison.
- The helper imported exactly `derivePopulation`, `stableJson`, and `sha256`. Prohibited generator/freeze/finalize entrypoints invoked: **none**.

### A.5

- `shasum -a 256 banks/*.json` — exit **0**; emitted 13 raw-file hash rows.

### Closeout checks

- Baseline JSON parse and Markdown/JSON cardinality check — **PASS**.
- Recomputed live bank byte hashes against the A.5 set — **PASS**.
- Charter SHA-256 recheck — **PASS**.
- Final `npm run census:check` — exit **0**.
- `git diff --quiet -- banks/*.json` — exit **0**; no bank diff.
- `git diff --check` — exit **0**.
- The transient A.4 measurement helper was removed after its output was captured in both deliverables.

## Seat limitations and scope

This is the local disk-reading Codex producer seat. It cannot discharge the independent checker gate. A.2, A.3, A.4, and A.5 remain pending Claude's independent re-derivation. No assertion is made that local uncommitted state is visible to a remote-reading seat.

No bank edit, repair, promotion, ledger entry, `DECISIONS.md` edit, bank commit, push, new content, or Phase B–F work was performed.
