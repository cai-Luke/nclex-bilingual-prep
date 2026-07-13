# Exhibit Flowsheet Structured Promotion Candidates 07B + 08A — Codex to Claude Code

Date: 2026-07-09
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifacts:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-07B-2026-07-09.json`
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-08A-2026-07-09.json`

Source artifacts:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-07-prose_embedded-2026-07-05.json`
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-08-prose_embedded-2026-07-05.json`

Selected refs:

Candidate 07B:

- `gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04/teachback_wound`
- `gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01/baseline`
- `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04/acute_change`
- `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02/assessment`
- `gpt_opus21_case_colostomy_lep_discharge_01/stage2_woc_teaching`

Candidate 08A:

- `opus_vanco_case_01/stage_2_data`
- `opus12_case_inpatient_suicide_risk_01/admission_labs`
- `opus20_case_cdiff_01/exhibit_stage2`
- `opus25_case_tb_airborne_treatment_monitoring_01/orders_and_baseline_labs`
- `opus4_case_postop_sbar_01/morning_labs_0600`

No canonical bank write was performed by Codex.

## Routing

- Candidate 07B routes all five refs to `banks/gpt-canonical.json`.
- Candidate 08A routes three refs to `banks/claude-canonical.json` and two refs to `banks/hard-cases-canonical.json`.

## Deliberate Exclusions

- Empty/no-value rows, `skip_serial` rows, and excluded-only rows remain deferred.
- Batch 07 HR `/min` prose-normalization WARN rows remain deferred.
- Batch 08 HR `/min` prose-normalization WARN rows remain deferred, including the post-op opioid respiratory-depression stage rows.
- `opus_case_warfarin_bridge_01/exh_stage2` remains deferred because Batch 07 adjudication noted a non-blocking duplicate-display concern for the INR 1.9 restatement.
- No selected ref contains SaO2 or troponin I.
- No selected ref contains `unitAliases`.

## Review Notes

- Candidate 07B uses simple low-noise Batch 07 supplement records: three single-vital surfaces and two compact vitals panels.
- Candidate 08A uses sampled/adjudicated Batch 08 records with clean extraction notes: vanco morning labs, inpatient-suicide admission labs, C. diff repeat labs/vitals with only potassium tagged `post_intervention`, TB baseline CBC/CMP/AST/ALT, and post-op SBAR 0600 labs.
- The Candidate 08A SBAR glucose duplicate remains a single `glucose` row, matching adjudication.
- The C. diff potassium context is per-value only; the co-located creatinine/BUN/lactate/vitals are intentionally untagged.
- Timestamp sanity pass after Claude's column-label finding:
  - Candidate 07B labels infer as `Current`, `1900`, `0240`, or `Current` with no competing source timestamps in selected value spans.
  - Candidate 08A labels infer as `0830`, `Current`, `Current`, `Current`, and `0600`.
  - `opus_vanco_case_01/stage_2_data` contains a `0730` trough-time decoy in prose, but the applicator's current title-first behavior labels the column `0830`, matching the exhibit title. This is the same direction Claude preserved when reverting the fragile sourceSpan-only prototype.
- All selected refs should remain supplement-only with prose preserved.

## Gate Output

Current-bank flowsheet gate, Candidate 07B:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-07B-2026-07-09.json --bank banks/gpt-canonical.json
```

Result:

```text
EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-07B-2026-07-09.json: 5 records, 0 FAIL, 0 WARN
```

Current-bank flowsheet gate, Candidate 08A:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-08A-2026-07-09.json --bank banks/claude-canonical.json --bank banks/hard-cases-canonical.json
```

Result:

```text
EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-08A-2026-07-09.json: 5 records, 0 FAIL, 0 WARN
```

Applicator dry-run, Candidate 07B:

```sh
npm run structured-measurements:apply -- --refs gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04/teachback_wound,gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01/baseline,gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04/acute_change,gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02/assessment,gpt_opus21_case_colostomy_lep_discharge_01/stage2_woc_teaching EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-07B-2026-07-09.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: gpt-canonical.json (5 exhibit refs)
```

Applicator dry-run, Candidate 08A:

```sh
npm run structured-measurements:apply -- --refs opus_vanco_case_01/stage_2_data,opus12_case_inpatient_suicide_risk_01/admission_labs,opus20_case_cdiff_01/exhibit_stage2,opus25_case_tb_airborne_treatment_monitoring_01/orders_and_baseline_labs,opus4_case_postop_sbar_01/morning_labs_0600 EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-08A-2026-07-09.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: claude-canonical.json (3 exhibit refs), hard-cases-canonical.json (2 exhibit refs)
```

Mechanical suite run by Codex:

```sh
npm run validate-bank -- banks/*.json
npm run scan-unknown-keys
npm run test:structured-measurements
npm run test:measurement-allowlist
npm run census:check
npm run build
npm run test:schema-bank
npm run test:flowsheet-gate
```

Results:

- All passed.
- `scan-unknown-keys` reported 0 off-schema key occurrences; generated report was removed.
- `build` passed with the existing Vite large-chunk warning.

## Write Commands For Gate Seat

After content review, Claude Code can apply Candidate 07B with:

```sh
npm run structured-measurements:apply -- --write --refs gpt_gap_2026_06_12_nonmcq_balanced_b_case_wound_teachback_04/teachback_wound,gpt_gap_2026_06_12_nonmcq_balanced_case_copd_home_oxygen_01/baseline,gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04/acute_change,gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02/assessment,gpt_opus21_case_colostomy_lep_discharge_01/stage2_woc_teaching EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-07B-2026-07-09.json
```

After content review, Claude Code can apply Candidate 08A with:

```sh
npm run structured-measurements:apply -- --write --refs opus_vanco_case_01/stage_2_data,opus12_case_inpatient_suicide_risk_01/admission_labs,opus20_case_cdiff_01/exhibit_stage2,opus25_case_tb_airborne_treatment_monitoring_01/orders_and_baseline_labs,opus4_case_postop_sbar_01/morning_labs_0600 EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-08A-2026-07-09.json
```

Then rerun the mechanical suite, regenerate census after any bank write, update the promotion ledger, and commit from the gate seat.
