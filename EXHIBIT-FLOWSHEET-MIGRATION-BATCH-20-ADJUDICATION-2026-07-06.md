# Exhibit Flowsheet Migration Batch 20 Adjudication Queue

Date: 2026-07-06
Bucket: `serial-redo`
Manifest slice: redo of the same final 28 refreshed-`serial` refs from Batch 19, using
`EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-20-serial-redo-2026-07-06.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-20-serial-redo-2026-07-06.json
```

Result:

- 28 records
- 0 FAIL
- 32 WARN
- Dispositions: 14 true `skip_serial`, 10 real current-panel extracts, 4 intentionally empty extracts.

WARN classes:

- Expected serial-detector advisories on the corrected non-serial records. These are the same
  mechanical false-positive surfaces that caused Batch 19 to fail: cross-client repeated labels,
  protocol/order text, prior/baseline comparisons, same-value restatement, and single-value records.
- Expected GATE 2 advisory mentions in intentionally empty multi-client/no-current-value records.
  These are checker-seat prompts, not blocker failures.
- Known source-prose normalization candidate: `HR 118/min` in the pulmonary-embolism record is staged
  as `hr` with canonical source unit `bpm` and remains a prose-normalization candidate.

## Sampling

Sampling mode: full redo after failed Batch 19 serial classification.

Total checker-seat sample: 28 of 28 records.

Rationale: Batch 19 proved that the mechanical `serial` manifest bucket cannot be trusted as a
disposition by itself. Batch 20 re-derives all 28 records from live source content using the same
content-aware extraction, exclusion, and multi-client rules already established for `scattered` and
`prose_embedded`.

## Sample Surface

| # | exhibitRef | Batch 20 disposition | Gate | Review note |
|---:|---|---|---|---|
| 1 | `cs_ngn_006_tbi/ex_006_vitals` | `skip_serial` | OK | True same-client Cushing-triad trend. |
| 2 | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage2_orders` | `skip_serial` | OK | True same-client severe-range BP series. |
| 3 | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage3_reassessment` | `skip_serial` | OK | True same-client BP series. |
| 4 | `gpt_case_caregiver_role_strain_dementia_01/stage_3_follow_up` | Extract current vitals | WARN | One current vitals set only; earlier "BP readings" has no numeric value. |
| 5 | `gpt_case_lateral_incivility_01/stage_2_bp_spike` | Extract current 2200 vitals | WARN | `SBP > 180` is a call threshold, not a second BP reading. |
| 6 | `gpt_case_lateral_incivility_01/stage_3_intervention` | `skip_serial` | OK | True 2300 vs. 0200 same-client BP/HR series. |
| 7 | `gpt_case_major_burn_inhalation_fluid_creep_01/stage2_course` | `skip_serial` | OK | True lactate trend. |
| 8 | `gpt_case_mass_casualty_start_triage_01/stage_1_update` | Empty extract | WARN | Multi-client exhibit; no single-client flowsheet surface. |
| 9 | `gpt_case_mass_casualty_start_triage_01/stage_2_update` | `skip_serial` | OK | Client D has a true SpO2 89% to 92% same-client sequence. |
| 10 | `gpt_case_mass_casualty_start_triage_01/stage_3_update` | Empty extract | WARN | Multi-client exhibit; repeated labels are across clients. |
| 11 | `gpt_case_neutropenic_fever_nadir_01/stage_3_course` | `skip_serial` | OK | True same-client 1930 vs. 2200 vitals. |
| 12 | `gpt_case_nurse_provider_conflict_01/baseline_record` | Extract current vitals/labs with prior exclusions | WARN | POD1/baseline comparisons excluded as `prior`; potassium chloride text is not a chloride result. |
| 13 | `gpt_case_nurse_provider_conflict_01/stage_3_resolution` | Extract potassium 3.4 | WARN | Dose-count/order language is not a second potassium result. |
| 14 | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/stage2_update` | Extract current stat labs/ABG/repeat vitals | WARN | aPTT order target is not a second result; ABG SaO2 is not pulse-ox SpO2. |
| 15 | `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/stage3_update` | `skip_serial` | OK | True 1000 vs. 1200 same-client vitals. |
| 16 | `gpt_case_pressure_injury_prevention_mobility_01/stage_2_update` | `skip_serial` | OK | Orthostatic vitals are intentionally un-flattenable. |
| 17 | `gpt_case_unsafe_assignment_01/stage_2_deterioration` | Empty extract | WARN | Multi-client exhibit; repeated labels are across clients. |
| 18 | `gpt_case_unsafe_premature_discharge_01/stage_1_teaching_ambulation` | `skip_serial` | OK | True ambulation/recovery vitals sequence. |
| 19 | `gpt_case_warfarin_mvr_2026_06_11_01/stage_1_orders_response` | Empty extract | WARN | No current INR value anywhere; only pending/future INR text. |
| 20 | `gpt_case_warfarin_mvr_2026_06_11_01/stage_2_update` | `skip_serial` | OK | True same-client HR/BP sequence; potassium flag is spurious but not disposition-driving. |
| 21 | `gpt_case_warfarin_mvr_2026_06_11_01/stage_3_orders_outcomes` | Extract 1100-1200 status | WARN | INR has one value; potassium text is an order/medication collision, not a result. |
| 22 | `gpt_opus21_case_colostomy_lep_discharge_01/initial_record` | Extract current assessment/labs | WARN | Creatinine 0.9 is the same draw restated, so keyed once. |
| 23 | `opus_case_lithium_toxicity_01/exhibit_stage1` | Extract current HR/BP | WARN | One current BP only. |
| 24 | `opus_case_lithium_toxicity_01/exhibit_stage3` | `skip_serial` | OK | True dialysis/recovery BP/HR sequence. |
| 25 | `opus_case_warfarin_bridge_01/exh_1` | `skip_serial` | OK | True multi-day INR/Hgb/platelet trend table. |
| 26 | `opus1_case_tha_discharge_lep_01/baseline_record` | Extract current initial vitals/labs with prior exclusions | WARN | Chronic baseline creatinine and pre-op Hgb excluded as `prior`. |
| 27 | `opus4_case_postop_sbar_01/stage1_progression` | `skip_serial` | OK | True 0900 vs. 1100 same-client vitals. |
| 28 | `opus4_case_postop_sbar_01/stage2_provider_response` | Extract current 1200 vitals/labs | WARN | One lactate result only. |

## Checker-Seat Ask

Please adjudicate all 28 records against live bank source, with special attention to the Batch 19
failure classes:

- Confirm the 14 `skip_serial` records are genuine same-client serial/preservation cases.
- Confirm the 4 empty extracts should remain empty because they are multi-client surfaces or have no
  current allowlisted value.
- Confirm the 10 real extracts do not need Rule D preservation and that prior/baseline values,
  protocol thresholds, medication/order text, and same-value restatements are handled correctly.
- Re-check the pulmonary-embolism ABG/pulse-ox boundary: ABG `SaO2` should not create a duplicate
  `spo2` extraction when pulse-ox SpO2 is separately present.

## Checker-Seat Adjudication (Antigravity Claude, 2026-07-06)

Independent review checked all 28 records against live bank source after reading the failed Batch 19
adjudication, the Batch 20 queue, and the Batch 20 artifact.

**Verdict: zero confirmed selection errors, zero re-dispositions. Batch 20 is clean and closes the
`serial` lane by content-reviewed disposition.**

Results by category:

- 14 of 14 `skip_serial` records confirmed as genuine same-client serial/preservation cases.
- 10 of 10 real current-panel `extract` records confirmed correct.
- 4 of 4 intentionally empty `extract` records confirmed correct.
- 32 of 32 WARNs confirmed as mechanical false positives or review prompts, not content errors.

Key confirmations:

- The 14 `skip_serial` records are all genuine preservation cases: Cushing-triad deterioration,
  severe-preeclampsia BP series, burn lactate trend, Client D's same-client SpO2 89% to 92% sequence
  in the mass-casualty case, orthostatic vitals, warfarin HR/BP sequence, lithium dialysis/recovery
  sequence, multi-day warfarin INR/Hgb/platelet trend, and the remaining same-client serial vitals.
- The prior/baseline exclusions in rows 12 and 26 are correct historical comparisons, not ambiguous
  current duplicates.
- Protocol/order/medication-name collisions are correctly not disposition drivers: SBP call threshold,
  potassium chloride / vitamin K order text, dose-count language, aPTT target monitoring orders, and
  pending/future INR language were all confirmed out of current-result scope.
- The same-value creatinine restatement in row 22 is correctly keyed once, matching the established
  same-draw restatement precedent.
- The four empty extracts are correct: rows 8, 10, and 17 are multi-client surfaces with no
  single-client flowsheet panel, and row 19 has no numeric current INR/vital/lab value.
- The pulmonary-embolism ABG/pulse-ox boundary in row 14 is correctly handled. ABG `SaO2 93%` and
  pulse-ox `SpO2 93%` are distinct measurements; Batch 20 extracts only the pulse-ox value as `spo2`
  and does not create a duplicate `spo2` entry from ABG saturation.

One non-blocking content-semantics note: row 14 source says "troponin I 0.38 ng/mL", but the current
allowlist label is `troponin_t`. This matches the already-recorded troponin-I-vs-T schema gap and is
not a Batch 20 disposition error.

**Disposition: Batch 20 is clean.** With `scattered` and `prose_embedded` already closed, this closes
the remaining `serial` lane.
