# Exhibit Flowsheet Migration Batch 08 Adjudication Queue

Date: 2026-07-05
Bucket: `prose_embedded`
Manifest slice: `prose_embedded` panels 121-140 from `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-08-prose_embedded-2026-07-05.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-08-prose_embedded-2026-07-05.json
```

Result:

- 20 records
- 0 FAIL
- 9 WARN

WARN classes:

- No-value / name-collision advisory mentions:
  - `clarification_note`: INR follow-up timing only; no INR value.
  - `teaching_note`: vitamin K diet teaching and INR appointment timing only; no potassium/INR value.
  - `exhibit_stage1_nursing_note`: sodium chloride IV fluid name; no serum sodium/chloride value.
- Prose-normalization candidates:
  - HR values written as `/min` but staged as `bpm` in `stage_3_data`,
    `stage_0838_findings`, `stage_0855_findings`, and `initial_assessment`.

## Sampling

Sampling mode: tapered `prose_embedded` batch.

Seed: `batch08-prose_embedded-2026-07-05`

25% seeded random sample:

- 123 `opus1_case_discharge_med_rec_anticoag_01/clarification_note`
- 124 `opus1_case_discharge_med_rec_anticoag_01/teaching_note`
- 125 `opus12_case_inpatient_suicide_risk_01/admission_labs`
- 138 `opus25_case_tb_airborne_treatment_monitoring_01/stage4_progress`
- 140 `opus4_case_postop_sbar_01/morning_labs_0600`

Always-sampled additions:

- 121 `opus_vanco_case_01/stage_2_data` — noncanonical CBC `/µL` source unit.
- 125 `opus12_case_inpatient_suicide_risk_01/admission_labs` — noncanonical CBC `/µL`
  source units.
- 127 `opus2_case_code_status_01/exhibit_stage2` — `skip_serial`.
- 128 `opus2_case_postop_opioid_respiratory_depression_01/stage_0838_findings` —
  `post_intervention` context.
- 129 `opus2_case_postop_opioid_respiratory_depression_01/stage_0855_findings` —
  `post_intervention` context.
- 130 `opus20_case_cdiff_01/exhibit_stage2` — `post_intervention` potassium value.
- 135 `opus25_case_tb_airborne_treatment_monitoring_01/orders_and_baseline_labs` —
  noncanonical CBC `/uL` source units.
- 137 `opus25_case_tb_airborne_treatment_monitoring_01/stage3_progress` —
  `post_intervention` context after TB regimen doses.
- 140 `opus4_case_postop_sbar_01/morning_labs_0600` — noncanonical CBC `/µL` source units.

Total checker-seat sample: 12 of 20 records.

## Sample Surface

| # | exhibitRef | Extractor disposition | Gate | Review note |
|---:|---|---|---|---|
| 121 | `opus_vanco_case_01/stage_2_data` | Keyed WBC/Cr/BUN/K/lactate/glucose | OK | Always-sampled due to WBC `/µL`; vancomycin trough out of allowlist scope. |
| 123 | `opus1_case_discharge_med_rec_anticoag_01/clarification_note` | Empty panel | WARN | Random sample; INR follow-up timing has no INR value. |
| 124 | `opus1_case_discharge_med_rec_anticoag_01/teaching_note` | Empty panel | WARN | Random sample; vitamin K/INR teaching text has no serum potassium or INR value. |
| 125 | `opus12_case_inpatient_suicide_risk_01/admission_labs` | Keyed CBC/BUN/Cr/Na/K/glucose | OK | Random + always-sampled due to `/µL`; HbA1c/albumin/ESR/CRP out of allowlist scope. |
| 127 | `opus2_case_code_status_01/exhibit_stage2` | `skip_serial` | OK | Always-sampled; serial SpO2/RR/HR/BP across 0945-1030, with SpO₂ subscript now mechanically re-confirmed. |
| 128 | `opus2_case_postop_opioid_respiratory_depression_01/stage_0838_findings` | Keyed post-intervention HR/BP/RR/SpO2 | WARN | Always-sampled due to `post_intervention`; HR `/min` prose-normalization candidate. |
| 129 | `opus2_case_postop_opioid_respiratory_depression_01/stage_0855_findings` | Keyed post-naloxone HR/BP/RR/SpO2 | WARN | Always-sampled due to `post_intervention`; HR `/min` prose-normalization candidate. |
| 130 | `opus20_case_cdiff_01/exhibit_stage2` | Keyed repeat labs/vitals; potassium tagged post-replacement | OK | Always-sampled due to `post_intervention` potassium. |
| 135 | `opus25_case_tb_airborne_treatment_monitoring_01/orders_and_baseline_labs` | Keyed baseline CBC/CMP/AST/ALT | OK | Always-sampled due to `/uL`; ESR out of allowlist scope. |
| 137 | `opus25_case_tb_airborne_treatment_monitoring_01/stage3_progress` | Keyed post-regimen Temp/AST/ALT | OK | Always-sampled due to `post_intervention` context after three doses. |
| 138 | `opus25_case_tb_airborne_treatment_monitoring_01/stage4_progress` | Keyed repeat AST/ALT/total bilirubin | OK | Random sample; future ALT threshold not keyed as current lab. |
| 140 | `opus4_case_postop_sbar_01/morning_labs_0600` | Keyed CBC/CMP/lactate/INR | OK | Random + always-sampled due to `/µL`; duplicate fingerstick glucose not double-keyed. |

## Status

Codex staged the values-only artifact and deterministic gate result. Independent checker-seat
adjudication (Claude Code) of the 12-record tapered sample is complete.

Re-ran the gate against current `main`: 20 records, 0 FAIL, 9 WARN — matches the result recorded
above.

For each of the 12 sampled records, pulled the full case content from `banks/claude-canonical.json` /
`banks/hard-cases-canonical.json` and independently re-derived the correct disposition:

- `#127 exhibit_stage2` (code-status case, `skip_serial`): genuinely serial — SpO2/RR/HR/BP repeat
  across 0930/0945/0950/1030, all real 4-digit military-time tokens. Confirmed the SpO₂-subscript
  gate fix landed and correctly re-confirms this one mechanically (no longer a detector blind spot
  like the earlier "hour N" and glucose-log cases).
- `#128`/`#129` (opioid respiratory depression case): both post-naloxone/post-repositioning vitals
  correctly keyed current with `post_intervention` context.
- `#130 exhibit_stage2` (C. diff case): a precise, granular application of Rule F — **only** the
  potassium value carries `context: "post_intervention"` (matching the source's explicit
  "(post-replacement)" parenthetical), while the co-located creatinine/BUN/lactate and the vitals in
  the next sentence correctly carry no context tag, since the source doesn't frame them as an
  intervention effect. Confirms the extractor applies context per-value, not per-exhibit.
- `#138 stage4_progress` (TB case): correctly keys the current AST/ALT/bilirubin and correctly leaves
  the *future* threshold ("if the next ALT exceeds 120 U/L") unkeyed — another clean Rule B
  application, plus confirms `#140`'s duplicate fingerstick-glucose (restating the same 162 mg/dL
  venous value) is correctly not double-keyed per Rule C.
- All other sampled records (`#121`, `#123`, `#124`, `#125`, `#135`, `#137`) match source verbatim;
  name-collision GATE 2 advisories (`potassium` matching "vitamin K", `sodium`/`inr` matching
  order/appointment text) are correctly left unaccounted rather than force-keyed.

**No selection errors found.** Sampling stays tapered.
