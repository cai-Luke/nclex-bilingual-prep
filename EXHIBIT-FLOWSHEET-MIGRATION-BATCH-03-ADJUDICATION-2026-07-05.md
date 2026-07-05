# Exhibit Flowsheet Migration Batch 03 Adjudication Queue

Date: 2026-07-05
Bucket: `prose_embedded`
Manifest slice: `prose_embedded` panels 21-40 from `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-03-prose_embedded-2026-07-05.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-03-prose_embedded-2026-07-05.json
```

Result:

- 20 records
- 0 FAIL
- 6 WARN

WARNs:

- `gpt_2026_06_13_case_delirium_uti_01/initial_history`: medication frequency `every 6 hr PRN`
  triggers advisory `hr`; no heart-rate value is present.
- `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage2_breastfeeding_question`: medication
  prose mentions magnesium therapy; no serum magnesium value is present.
- `gpt_2026_06_19_case_ici_pneumonitis_01/baseline_labs`: `No baseline ABG...` / `pulse oximetry`
  prose triggers advisory `hr`; no heart-rate value is present in that lab panel.
- `gpt_2026_06_19_case_ici_pneumonitis_01/stage_3_plan_teaching`: blood-pressure medication mention;
  no BP value is present.
- `gpt_case_acute_hemolytic_transfusion_reaction_01/stage_1_update`: source `HR 118/min` staged as HR
  `bpm`; prose-normalization candidate.
- `gpt_case_gap_2026_06_11_case_adhf_01/adhf_deterioration`: source `HR 124/min` staged as HR `bpm`;
  prose-normalization candidate.

## 100% Adjudication Surface

Per protocol, this second `prose_embedded` batch requires 100% independent adjudication. If clean, it
becomes the second consecutive clean full-adjudication prose batch and allows tapering future
`prose_embedded` batches to 25% plus always-sampled categories.

| # | exhibitRef | Extractor disposition | Gate | Review note |
|---:|---|---|---|---|
| 21 | `gemini_gapfill_case_2026_06_10_case_wellness_03/labs` | Keyed fasting glucose | OK | A1C out of allowlist scope. |
| 22 | `gpt_2026_06_13_case_delirium_uti_01/initial_history` | Empty panel | WARN | `6 hr PRN` medication frequency only; no HR. |
| 23 | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/baseline_labs` | Keyed Hgb/Hct/platelets/AST/ALT/creatinine | OK | Uric acid, LDH, urine protein wording out of allowlist scope. |
| 24 | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage1_triage_call` | Keyed home BP | OK | `8/10` pain score and timing not in measurement allowlist. |
| 25 | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage2_breastfeeding_question` | Empty panel | WARN | Medication magnesium mention only. |
| 26 | `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage2_labs` | Keyed Hgb/Hct/platelets/AST/ALT/creatinine/INR | OK | Fibrinogen and urine protein ratio out of allowlist scope. |
| 27 | `gpt_2026_06_19_case_ici_pneumonitis_01/baseline_assessment` | Keyed Temp/HR/BP/RR/SpO2 | OK | Current vital-sign sentence. |
| 28 | `gpt_2026_06_19_case_ici_pneumonitis_01/baseline_background` | Excluded baseline SpO2 as `prior` | OK | Always-sampled due to `excludedValues`. |
| 29 | `gpt_2026_06_19_case_ici_pneumonitis_01/baseline_labs` | Keyed WBC/Hgb/platelets/BUN/Cr/Na/K/glucose/ALT/AST | WARN | CBC source includes `x 10^3/uL`; now accepted. TSH/CRP/LDH out of allowlist scope. |
| 30 | `gpt_2026_06_19_case_ici_pneumonitis_01/stage_1_update` | Keyed current SpO2; excluded baseline SpO2 as `prior` | OK | Always-sampled due to `excludedValues`. |
| 31 | `gpt_2026_06_19_case_ici_pneumonitis_01/stage_2_diagnostics` | Keyed ABG + repeat vitals | OK | Oxygen target/order text not keyed. |
| 32 | `gpt_2026_06_19_case_ici_pneumonitis_01/stage_3_plan_teaching` | Empty panel | WARN | Blood-pressure medication mention only. |
| 33 | `gpt_2026_06_19_case_ici_pneumonitis_01/stage_3_response` | Keyed vitals + ABG | OK | CRP change out of allowlist scope. |
| 34 | `gpt_case_acute_hemolytic_transfusion_reaction_01/stage_1_update` | Keyed Temp/HR/BP/RR/SpO2 | WARN | HR source unit `/min` staged as `bpm`; prose-normalization candidate. |
| 35 | `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/admission_assessment` | Keyed Temp/HR/BP/RR/SpO2 | OK | Weight, bladder scan, ECG intervals out of allowlist scope. |
| 36 | `gpt_case_client_advocacy_refusal_01/stage_1_update` | Keyed HR/BP/RR/SpO2 | OK | Weight out of allowlist scope. |
| 37 | `gpt_case_client_advocacy_refusal_01/stage_3_update` | Keyed HR/BP/RR/SpO2 | OK | Weight out of allowlist scope. |
| 38 | `gpt_case_gallstone_pancreatitis_01/ex_admission_assessment` | Keyed Temp/HR/BP/RR/SpO2 | OK | Current vital-sign sentence. |
| 39 | `gpt_case_gallstone_pancreatitis_01/ex_admission_labs` | Keyed allowlisted labs including total + ionized calcium | OK | Calcium sourceSpans narrowed to exact total/ionized substrings for identity gate. |
| 40 | `gpt_case_gap_2026_06_11_case_adhf_01/adhf_deterioration` | Keyed RR/SpO2/HR/BP | WARN | HR source unit `/min` staged as `bpm`; prose-normalization candidate. |

## Status

Codex staged the values-only artifact and deterministic gate result. Independent checker-seat
adjudication (Claude Code, Sonnet tier) is complete.

Re-ran the gate against current `main` (confirms the sourceUnit-laundering fix is landed and
producing the two expected WARNs at panel[1]/panel[2] `hr`, nothing else changed): 20 records,
0 FAIL, 6 WARN — matches the result recorded above.

For each of the 20 records, pulled the full `content.en` for the exhibit from its canonical bank
(`gpt-canonical.json`, `hard-cases-canonical.json`, or `gemini-canonical.json`) and independently
re-derived the correct disposition, rather than checking the staged panel against itself:

- Both `excludedValues` entries (`baseline_background` prior SpO2 96%, `stage_1_update` prior SpO2
  96% vs. current 93%) are genuine current-vs-prior exclusions — the source text explicitly frames
  each excluded value as "baseline"/"documented baseline ... down from," and the kept current value
  is the one actually being acted on.
- The `ex_admission_labs` calcium split (`calcium` 7.6 mg/dL / `ionized_calcium` 3.6 mg/dL) is
  correct: the source carries an explicit "ionized calcium" qualifier immediately after the bare
  "calcium" mention, and the staged `sourceSpan`s are correctly narrowed to the individual
  substrings rather than the shared multi-analyte sentence, which is what lets the calcium-identity
  gate check each one's qualifier independently.
- Every "out of allowlist scope" claim (weight, TSH, CRP, LDH, fibrinogen, uric acid, urine
  protein/creatinine ratio, A1C, pain score, PR/QRS intervals, lipase/amylase/alk phos/
  triglycerides/albumin) checks out against the registry — none of these keys exist in
  `ANALYTE_DEFS`/`VITAL_DEFS`, so silence on them is a scope boundary, not a missed extraction.
- The `hr` GATE 2 advisory on `baseline_labs` (ici_pneumonitis) is a genuine name collision —
  `\bpulse\b` matches "pulse oximetry," not a heart-rate mention — and is correctly left
  unaccounted rather than force-keyed.
- The two `sourceUnit`-laundering WARNs (`gpt_case_acute_hemolytic_transfusion_reaction_01/
  stage_1_update`, `gpt_case_gap_2026_06_11_case_adhf_01/adhf_deterioration`, both `HR .../min` →
  staged `bpm`) are dimensionally safe and correctly flagged as prose-normalization candidates, not
  selection errors, consistent with the Codex note.

**No selection errors found.** This is the second consecutive clean 100% `prose_embedded` batch
(after batch 02), so per the sampling ramp, future `prose_embedded` batches may taper to 25% random
+ always-sampled categories (every GATE 4 WARN, every `skip_serial`, every non-canonical CBC
`sourceUnit`, every `post_intervention` context, every `excludedValues` entry, every calcium-identity
WARN).
