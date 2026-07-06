# Exhibit Flowsheet Migration Batch 11 Adjudication Queue

Date: 2026-07-05
Bucket: `scattered`
Manifest slice: `scattered` panels 21-40 from `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-11-scattered-2026-07-05.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-11-scattered-2026-07-05.json
```

Result:

- 20 records
- 0 FAIL
- 18 WARN

WARN classes:

- Prose-normalization candidates:
  - HR values written as `/min` but staged as `bpm` in
    `gpt_2026_06_13_case_delirium_uti_01/ed_assessment_labs`,
    `gpt_2026_06_13_case_delirium_uti_01/ed_course`,
    `gpt_2026_06_13_case_delirium_uti_01/med_surg_update`,
    `gpt_2026_06_13_case_delirium_uti_01/recovery_update`,
    `gpt_case_acute_hemolytic_transfusion_reaction_01/baseline_record`,
    `gpt_case_acute_hemolytic_transfusion_reaction_01/stage_2_update`, and
    `gpt_case_acute_hemolytic_transfusion_reaction_01/stage_3_update`.
- Serial-lane advisory:
  - `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage1_ed_assessment` is `skip_serial`
    for two current same-client BP readings five minutes apart; the current detector does not
    mechanically re-confirm this prose shape.
  - `gpt_case_caregiver_role_strain_dementia_01/stage_1_agitation_and_stove` is `skip_serial` for
    repeated same-client HR/BP/RR readings across agitation and calming; the current detector does not
    mechanically re-confirm this prose shape.
- No-value / name-collision advisory mentions:
  - `gpt_2026_06_13_case_delirium_uti_01/agitation_prn_protocol`: potassium and magnesium are order
    protocol terms, not patient values.
  - `gpt_2026_06_13_case_delirium_uti_01/ed_course`: sodium and chloride are IV fluid names, not serum
    electrolyte values.
  - `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/background`: sodium is a diet restriction
    term, not a serum sodium value.
  - `gpt_case_acute_hemolytic_transfusion_reaction_01/stage_3_update`: MAP is mentioned as a care
    target, not a measured current value.
  - `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/admission_history`: diabetes medication
    prose mentions glucose context without a current glucose value.
  - `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/stage2_course`: sodium and calcium are
    treatment references, not current lab values in this stage.

## Sampling

Sampling mode: `scattered` bucket ramp reset.

Batch 10 did not count as a clean ramp batch after the Rule D re-disposition. Batch 11 is therefore
queued for 100% independent checker-seat adjudication. If no selection errors or re-dispositions are
found, it becomes clean scattered batch 1 of 2 for the new-bucket taper.

Total checker-seat sample: 20 of 20 records.

## Sample Surface

| # | exhibitRef | Extractor disposition | Gate | Review note |
|---:|---|---|---|---|
| 1 | `gemini_gap_case_pediatric_croup_02/ex2_treatment_response` | Keyed post-racemic-epi SpO2/HR | OK | Both values carry `post_intervention`. |
| 2 | `gpt_2026_06_13_case_delirium_uti_01/agitation_prn_protocol` | Empty panel | WARN | Protocol/order thresholds only; potassium and magnesium are not current patient values. |
| 3 | `gpt_2026_06_13_case_delirium_uti_01/ed_assessment_labs` | Keyed ED vitals and labs | WARN | Excludes baseline creatinine; urine WBC/hpf is not blood WBC. |
| 4 | `gpt_2026_06_13_case_delirium_uti_01/ed_course` | Keyed hour-3 vitals | WARN | All values carry `post_intervention`; IV fluid sodium/chloride terms are not serum values. |
| 5 | `gpt_2026_06_13_case_delirium_uti_01/med_surg_update` | Keyed hour-10 vitals and hour-12 labs | WARN | All values carry `post_intervention`. |
| 6 | `gpt_2026_06_13_case_delirium_uti_01/recovery_update` | Keyed morning vitals and repeat labs | WARN | All values carry `post_intervention`. |
| 7 | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/background` | Empty panel with prior BP excluded | WARN | Prior discharge BP is excluded; diet sodium and prenatal threshold prose are not current values. |
| 8 | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage1_ed_assessment` | `skip_serial` | WARN | Two current same-client BP readings five minutes apart trigger Rule D. |
| 9 | `gpt_case_acute_hemolytic_transfusion_reaction_01/baseline_record` | Keyed baseline vitals and admission labs | WARN | LDH/fibrinogen/haptoglobin/urine output out of allowlist scope. |
| 10 | `gpt_case_acute_hemolytic_transfusion_reaction_01/stage_2_update` | Keyed reaction vitals and stat labs | WARN | LDH/fibrinogen/haptoglobin/free plasma hemoglobin out of allowlist scope. |
| 11 | `gpt_case_acute_hemolytic_transfusion_reaction_01/stage_3_update` | Keyed ICU current vitals and repeat labs | WARN | Values carry `post_intervention`; MAP is a care target, not a measured value. |
| 12 | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/admission_history` | Empty panel with prior creatinine excluded | WARN | Baseline creatinine excluded; medication/glucose context is not a current value. |
| 13 | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/admission_labs` | Keyed admission chemistry/CBC/VBG values | OK | VBG pCO2, urine sodium, BUN:Cr, and FENa are out of current allowlist scope. |
| 14 | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/stage1_course` | Keyed repeat vitals | OK | Values carry `post_intervention`. |
| 15 | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/stage2_course` | Keyed hour-4 labs | WARN | Values carry `post_intervention`; calcium/sodium appear only in treatment references. |
| 16 | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/stage3_course` | `skip_serial` | OK | Hour 8/hour 14 repeated same-client current values trigger Rule D. |
| 17 | `gpt_case_caregiver_role_strain_dementia_01/baseline_assessment_and_labs` | Keyed Margaret vitals/labs | OK | Weight, albumin, prealbumin, TSH, and UA remain out of allowlist scope. |
| 18 | `gpt_case_caregiver_role_strain_dementia_01/stage_1_agitation_and_stove` | `skip_serial` | WARN | During-agitation and after-calming repeated same-client vitals trigger Rule D. |
| 19 | `gpt_case_client_advocacy_refusal_01/baseline_record` | Keyed baseline vitals/labs | OK | Baseline creatinine 2.8 excluded; weight/eGFR/albumin/prealbumin out of scope. |
| 20 | `gpt_case_client_advocacy_refusal_01/stage_2_update` | Keyed stage-2 vitals/labs | OK | Current BNP/Cr/K/Na retained; no context tag. |

## Status

Codex staged the second `scattered` values-only artifact and deterministic gate result. Independent
checker-seat adjudication (Claude Code) of all 20 records is complete.

Re-ran the gate against current `main`: 20 records, 0 FAIL, 18 WARN — matches the result recorded
above.

For each of the 20 records, pulled the full case content from `banks/gpt-canonical.json` /
`banks/hard-cases-canonical.json` / `banks/gemini-canonical.json` and independently re-derived the
correct disposition. Notable checks beyond routine current/prior/context/scope verification:

- `#8 stage1_ed_assessment` (postpartum severe preeclampsia) and `#18 stage_1_agitation_and_stove`
  (caregiver strain): both correctly `skip_serial` under the **amended** Rule D — two current
  same-client readings of one parameter (BP "five minutes apart"; HR/BP/RR "during agitation" vs.
  "after calming" ~10 minutes apart), neither marked historical. Both are **new instances on cases
  never seen in batch 10**, so this confirms the amendment is being applied consistently going
  forward, not just retroactively on the original escalation panel. As expected, the detector's WARN
  ("did not re-confirm") fires on both — Guard 2 (source-prose heuristic) is still queued, not a
  defect here.
- `#16 stage3_course` (AKI/hyperkalemia): also correctly `skip_serial` — but this one **is** mechanically
  re-confirmed clean (gate: OK, no WARN), because it uses explicit "hour 8" / "hour 14" phrasing that
  the already-landed timestamp-regex fix (from the batch-4/5 "hour N" gap) catches. Good contrast with
  `#8`/`#18`: a genuine multi-timepoint trend the detector *can* see, versus a closely-spaced
  confirmatory pair it still can't.
- `#13 admission_labs` (AKI): correctly keeps **venous** blood-gas pCO2 and **urine** sodium separate
  from the registry's arterial `paco2` and serum `sodium` keys — conflating either would silently mix
  incompatible reference ranges. `BUN:Cr` ratio and `FENa` (calculated indices, not raw measurements)
  correctly out of scope.
- `#12 admission_history`: "point-of-care glucose" is an **order**, not a resulted value — correctly
  left unkeyed; confirms the GATE 2 'glucose' advisory is a genuine order-vs-result distinction, not a
  missed value.
- `#11 stage_3_update` (hemolytic transfusion reaction): "maintain MAP above 65 mmHg per ICU protocol"
  is the **titration target**, not a measured MAP — correctly not fabricated into the panel, a clean
  Rule B call parallel to batch 10's propranolol-threshold and thrombectomy-BP-threshold catches.
- `#7 background` (postpartum severe preeclampsia): the discharge BP (118/74, postpartum day 1) is
  correctly excluded as `prior` — this is a genuinely different, earlier clinical encounter (the
  discharge that preceded the current re-presentation), not the same-admission background-vs-dedicated-exhibit
  pattern seen earlier; a clean prior-value case.
- Minor observation, not a selection error: `#15 stage2_course` tags the "at hour 4" hyperkalemia labs
  `post_intervention`, but those values are read chronologically *before* the calcium
  gluconate/insulin/bicarbonate orders given later in the same sentence — they are the trigger for
  that escalation, not its effect. They are, however, genuinely after the stage-1 fluid boluses, and
  the schema's `context` tag has no per-intervention specificity to distinguish "after which
  treatment." The kept value itself is correct and current either way; this is a labeling-precision
  nuance, not a wrong disposition.

**No selection errors and no re-dispositions found.** Per the ledger's stated criterion, this batch
becomes **clean scattered batch 1 of 2** toward re-establishing the taper.
