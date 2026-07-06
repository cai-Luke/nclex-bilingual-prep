# Exhibit Flowsheet Migration Batch 10 Adjudication Queue

Date: 2026-07-05
Bucket: `scattered`
Manifest slice: `scattered` panels 1-20 from `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-10-scattered-2026-07-05.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-10-scattered-2026-07-05.json
```

Result:

- 20 records
- 0 FAIL
- 13 WARN

WARN classes:

- Prose-normalization candidates:
  - HR values written as `/min` or `beats/minute` but staged as `bpm` in
    `case_preeclampsia_magnesium_01/admission`, `case_sepsis_pneumonia_01/after_500_ml`,
    `case_sepsis_pneumonia_01/after_resuscitation`, `cs_adhf_pulm_edema_01/ed_assessment`,
    `cs_sepsis_shock_01/triage_vitals`, `cs_sepsis_shock_01/vitals_1600`, and
    `cs_stemi_vfib_04/triage_1400`.
- No-value / name-collision advisory mentions:
  - `cs_sepsis_shock_01/vitals_1600`: `0.9% sodium chloride` IV fluid name; no serum sodium/chloride.
  - `cs_stemi_vfib_04/triage_1400`: troponin pending; no numeric troponin value.
  - `cs_thyroid_storm_main/ex_orders_0830`: propranolol order threshold `heart rate < 100 bpm`;
    no patient HR value.
  - `gemini_gap_case_disaster_triage_05/ex1_disaster_scene`: multi-victim pulse/breathing values;
    not a single-client flowsheet surface.
  - `gemini_gap_case_hypertension_lifestyle_02/ex2_htn_3mo_results`: dietary sodium restriction;
    no serum sodium value.

## Sampling

Sampling mode: `scattered` bucket ramp reset.

Because `scattered` is the highest-risk bucket and has not yet earned a taper, Batch 10 is queued for
100% independent adjudication.

Total checker-seat sample: 20 of 20 records.

## Sample Surface

| # | exhibitRef | Extractor disposition | Gate | Review note |
|---:|---|---|---|---|
| 1 | `case_dka_01/ex_labs_0815` | Keyed DKA labs including anion gap and pH | OK | Ketones are out of allowlist scope. |
| 2 | `case_preeclampsia_magnesium_01/admission` | Keyed both severe-range BP readings plus HR/RR | WARN | Important adjudication point: paired admission BP readings 20 minutes apart are keyed as a current severe-BP cluster, not `skip_serial`. |
| 3 | `case_preeclampsia_magnesium_01/labs` | Keyed platelets/AST/ALT/Cr | OK | Always notable due to platelet `/mm3`; urine protein out of allowlist scope. |
| 4 | `case_preeclampsia_magnesium_01/toxicity_assessment` | Keyed RR/SpO2 and post-labetalol BP | OK | BP carries `post_intervention`; reflexes/urine output out of allowlist scope. |
| 5 | `case_sepsis_pneumonia_01/after_500_ml` | Keyed post-fluid BP/MAP/HR/SpO2 | WARN | `post_intervention` context on all keyed values; HR `/min` prose-normalization candidate. |
| 6 | `case_sepsis_pneumonia_01/after_resuscitation` | Keyed post-resuscitation BP/MAP/HR/lactate | WARN | `post_intervention` context on all keyed values; urine output out of allowlist scope. |
| 7 | `case_sepsis_pneumonia_01/initial_results` | Keyed WBC/lactate/Cr | OK | WBC `/mm3` source-unit edge. |
| 8 | `cs_adhf_pulm_edema_01/ed_assessment` | Keyed ED Temp/HR/RR/BP/SpO2 | WARN | HR `beats/minute` prose-normalization candidate. |
| 9 | `cs_ckd_01/labs_pre` | Keyed BUN/Cr/K/Ca/phosphorus/Hgb | OK | Bare calcium routed as total calcium. |
| 10 | `cs_copd_01/vitals` | Keyed Temp/HR/RR/BP/SpO2 | OK | Temp keyed from Fahrenheit source; Celsius parenthetical not duplicated. |
| 11 | `cs_sepsis_shock_01/labs_1600` | Keyed WBC/lactate/Cr/glucose | OK | CRP out of allowlist scope; WBC `/mm³` edge. |
| 12 | `cs_sepsis_shock_01/triage_vitals` | Keyed triage Temp/HR/RR/BP/SpO2 | WARN | HR `beats/minute` prose-normalization candidate. |
| 13 | `cs_sepsis_shock_01/vitals_1600` | Keyed post-bolus HR/RR/BP/MAP | WARN | `post_intervention`; sodium chloride IV fluid correctly not serum sodium/chloride. |
| 14 | `cs_stemi_vfib_04/triage_1400` | Keyed triage BP/HR/RR/SpO2 | WARN | Troponin pending has no numeric value. |
| 15 | `cs_thyroid_storm_main/ex_orders_0830` | Empty panel | WARN | Orders/thresholds only; sodium chloride and HR target are not patient measurements. |
| 16 | `cs_thyroid_storm_main/ex_triage_0800` | Keyed Temp/HR/BP/RR/SpO2 | OK | Temp keyed from Fahrenheit source; Celsius parenthetical not duplicated. |
| 17 | `gemini_gap_case_disaster_triage_05/ex1_disaster_scene` | Empty panel | WARN | Multi-victim disaster scene is not a single-client flowsheet surface. |
| 18 | `gemini_gap_case_hypertension_lifestyle_02/ex2_htn_3mo_results` | Keyed BP average | WARN | Dietary sodium text has no serum sodium value; weight/BMI out of allowlist scope. |
| 19 | `gemini_gap_case_palliative_care_03/ex1_hospice_baseline` | Keyed RR/HR/SpO2 | OK | Comfort narrative preserved in prose. |
| 20 | `gemini_gap_case_pediatric_croup_02/ex1_triage_respiratory` | Keyed Temp/HR/RR/SpO2 | OK | Pediatric clinical signs preserved in prose. |

## Status

Codex staged the first `scattered` values-only artifact and deterministic gate result. Independent
checker-seat adjudication (Claude Code) of all 20 records is complete.

Re-ran the gate against current `main`: 20 records, 0 FAIL, 13 WARN — matches the result recorded
above.

For each of the 20 records, pulled the full case content from `banks/hard-cases-canonical.json` /
`banks/gemini-canonical.json` and independently re-derived the correct disposition. Notable checks
beyond routine current/prior/scope verification:

- `#2 admission` (severe preeclampsia): fetal heart rate ("Fetal heart rate baseline 140/min") is
  correctly **never** keyed as `hr` — `fhr` is not in the vitals registry, and conflating a fetal HR
  with the maternal HR field would be a real clinical-safety error in the eventual rendering. Confirmed
  correct. The two maternal BP readings ("166/112 and 164/110... 20 minutes apart") in the same
  exhibit raised a genuine open question about Rule D scope — **escalated separately**, see
  `EXHIBIT-FLOWSHEET-ESCALATION-rule-d-closely-spaced-readings-2026-07-05.md`. Not treated as a
  selection error; the current disposition (both readings kept) is defensible, not clearly wrong.
- `#4 toxicity_assessment`: precise Rule F granularity — RR/SpO2 (concurrent magnesium-toxicity
  findings) correctly carry no context tag, while only the BP explicitly framed "after labetalol"
  gets `post_intervention`. Same exhibit as the extraction proposal's own Rule F worked example.
- `#10`, `#12`, `#16`, `#20`: Fahrenheit-primary temperature readings with a Celsius parenthetical
  correctly keep the source's primary unit and silently drop the parenthetical (no `unitAliases`
  entry) — confirmed this is the established, consistent pattern across the whole migration (Rule C's
  `unitAliases` mechanism is reserved for the CBC legacy-notation case per the proposal's own wording,
  not routine °F/°C pairs), not an omission newly introduced here.
- `#15 ex_orders_0830` (thyroid storm): "heart rate < 100 bpm" is the propranolol titration
  **threshold** from the order, not a patient reading — correctly left unkeyed, a clean Rule B call.
- `#17 ex1_disaster_scene` (mass-casualty triage): correctly staged with an **empty panel** despite
  containing specific numeric vitals (RR 24/HR 110 for Victim B, RR 34 for Victim D) — the record
  shape has no per-victim attribution field, and this is fundamentally a four-person scene, not a
  single-client flowsheet surface. Extracting any of these numbers would misattribute them as if they
  were the case's one client. Correctly left as prose.
- `#18 ex2_htn_3mo_results`: "128/82 mmHg (seated, average of 2 readings)" is the source's own
  pre-averaged single figure, not two raw serial readings — correctly kept as one current BP, no
  Rule D question here (contrast with `#2`, where two distinct raw values are given).

**No selection errors found.** One item escalated (Rule D scope for closely-spaced confirmatory
readings) rather than adjudicated either way — see the escalation note. Per the sampling ramp, a new
bucket resets to 100% adjudication for its first two batches; batch 10 (this one) is the first.
