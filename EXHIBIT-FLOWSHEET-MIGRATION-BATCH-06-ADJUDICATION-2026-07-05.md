# Exhibit Flowsheet Migration Batch 06 Adjudication Queue

Date: 2026-07-05
Bucket: `prose_embedded`
Manifest slice: `prose_embedded` panels 81-100 from `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-06-prose_embedded-2026-07-05.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-06-prose_embedded-2026-07-05.json
```

Result:

- 20 records
- 0 FAIL
- 9 WARN

WARN classes:

- No-value / name-collision advisory mentions:
  - `initial_diabetes_visit`: A1c and self-monitoring prose only; no numeric glucose value.
  - `triage_note`: distal pulse finding only; no heart-rate value.
  - `stage_2_advocacy_resources`: downtrending BNP language only; no numeric BNP value.
  - `baseline_wound` and `home_observe`: glucose monitoring/log adherence prose only; no numeric
    glucose value.
- Serial-lane advisory:
  - `assessment` staged as `skip_serial`; mechanical detector does not re-confirm because the source
    is a log-style multi-value glucose sequence rather than timestamped prose.
- Prose-normalization candidates:
  - HR/pulse values written as `/min` but staged as `bpm` in `assessment_data`, `stage_3_update`,
    and `triage`.

## Sampling

Sampling mode: tapered `prose_embedded` batch after two consecutive clean 100% batches.

Seed: `batch06-prose_embedded-2026-07-05`

25% seeded random sample:

- 84 `gpt_case_premium_next_case_preventive_screening_vaccine_05/assessment_data`
- 87 `gpt_case_taco_vs_trali_01/baseline_history_protocol`
- 90 `gpt_case_taco_vs_trali_01/stage_3_interventions`
- 96 `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/post_dose`
- 98 `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03/triage`

Always-sampled additions:

- 82 `gpt_case_premium_next_case_health_literacy_diabetes_01/assessment` — `skip_serial`.
- 89 `gpt_case_taco_vs_trali_01/stage_3_diagnostics` — `excludedValues` baseline BNP.
- 90 `gpt_case_taco_vs_trali_01/stage_3_interventions` — `post_intervention` context.
- 91 `gpt_case_unsafe_assignment_01/stage_3_resolution` — `post_intervention` context.
- 94 `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01/initial_labs` — noncanonical CBC
  `/µL` source units plus excluded baseline creatinine.

Total checker-seat sample: 9 of 20 records.

## Sample Surface

| # | exhibitRef | Extractor disposition | Gate | Review note |
|---:|---|---|---|---|
| 82 | `gpt_case_premium_next_case_health_literacy_diabetes_01/assessment` | `skip_serial` | WARN | Always-sampled due to log-style repeated glucose values. |
| 84 | `gpt_case_premium_next_case_preventive_screening_vaccine_05/assessment_data` | Keyed BP, pulse, respirations | WARN | Random sample; pulse `/min` prose-normalization candidate. |
| 87 | `gpt_case_taco_vs_trali_01/baseline_history_protocol` | Keyed outpatient hemoglobin 6.4 | OK | Random sample; verify this is the current admission-driving measurement, not excluded prior history. |
| 89 | `gpt_case_taco_vs_trali_01/stage_3_diagnostics` | Keyed current BNP/Hgb; excluded baseline BNP | OK | Always-sampled due to current-vs-baseline BNP split. |
| 90 | `gpt_case_taco_vs_trali_01/stage_3_interventions` | Keyed post-intervention Temp/HR/BP/RR/SpO2 | OK | Random + always-sampled due to `post_intervention` context. |
| 91 | `gpt_case_unsafe_assignment_01/stage_3_resolution` | Keyed post-nicardipine systolic BP | OK | Always-sampled due to `post_intervention` context. |
| 94 | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01/initial_labs` | Keyed current CBC/CMP/coags/lactate/ammonia; excluded baseline Cr | OK | Always-sampled due to `/µL` CBC units and current-vs-baseline Cr split. |
| 96 | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/post_dose` | Keyed RR/SpO2 | OK | Random sample; sedation score out of allowlist scope. |
| 98 | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03/triage` | Keyed Temp/HR | WARN | Random sample; HR `/min` prose-normalization candidate. |

## Status

Codex staged the values-only artifact and deterministic gate result. Independent checker-seat
adjudication (Claude Code) of the 9-record tapered sample is complete.

Re-ran the gate against current `main`: 20 records, 0 FAIL, 9 WARN — matches the result recorded
above.

For each of the 9 sampled records, pulled the full case content from `banks/gpt-canonical.json` and
independently re-derived the correct disposition:

- `#82 assessment` (`skip_serial`): the source is a 7-value fasting-glucose log across a week plus a
  single current BP reading in the same exhibit. Rule D is exhibit-level and all-or-nothing —
  "excluded from flowsheet extraction entirely" once any allowlisted parameter is serial in that
  exhibit — so `skip_serial` correctly discards the BP too, even though it stood alone. This is the
  spec's deliberate no-partial-credit design (`EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`
  Rule D), not an extraction gap. The mechanical detector can't independently confirm it (no
  clock-time tokens in a log-style list), the same class of gap as the "hour N" case in batch 4 —
  correct disposition, detector just can't see it.
- `#87 baseline_history_protocol` (TACO/TRALI): flagged in the queue for extra scrutiny — "outpatient
  hemoglobin 6.4 g/dL" is cited as the reason for admission, not obviously "current" vs. "prior."
  Cross-checked against the same case's `baseline_assessment_labs` exhibit, which independently
  reports the identical 6.4 g/dL as the admission labs value — confirms this is the actual
  admission-driving reading, not a stale value superseded by something newer within this exhibit.
  Correctly kept current, not excluded.
- `#90 stage_3_interventions` and `#91 stage_3_resolution`: first live firings of Rule F
  (`post_intervention` context) seen in this migration. Both are correct — `#90`'s six vitals are
  explicitly "Thirty minutes later" after the emergency interventions narrated earlier in the same
  exhibit; `#91`'s systolic-only reading is explicitly "after the nicardipine increase." Both keyed
  as current with the context tag, not excluded, per Rule F.
- `#89 stage_3_diagnostics`: BNP current-vs-baseline split ("890... up from 280... baseline")
  correctly separated.
- `#94 initial_labs`: current-vs-baseline creatinine split ("1.3... (baseline 1.0)") correctly
  separated; albumin correctly out of scope.
- `#84`, `#96`, `#98`: all keyed values match source verbatim; non-allowlisted content (pain score,
  sedation score) correctly silent.

**No selection errors found.** Sampling stays tapered at 25% + always-sampled for future
`prose_embedded` batches.
