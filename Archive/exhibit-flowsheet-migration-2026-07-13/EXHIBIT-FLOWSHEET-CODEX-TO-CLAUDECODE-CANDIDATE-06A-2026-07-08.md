# Exhibit Flowsheet Structured Promotion Candidate 06A — Codex to Claude Code

Date: 2026-07-08
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifact:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-06A-2026-07-08.json`

Source artifact:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-06-prose_embedded-2026-07-05.json`

Selected refs:

- `gpt_case_taco_vs_trali_01/baseline_history_protocol`
- `gpt_case_taco_vs_trali_01/stage_3_diagnostics`
- `gpt_case_taco_vs_trali_01/stage_3_interventions`
- `gpt_case_unsafe_assignment_01/stage_3_resolution`
- `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/post_dose`

All five are supplement-path records routed to `banks/gpt-canonical.json`. No canonical bank write was performed by Codex.

## Deliberate Exclusions

- Batch 06 empty-panel/no-value rows were excluded.
- Batch 06 `skip_serial` rows were excluded.
- Batch 06 HR `/min` prose-normalization WARN rows were deferred.
- The larger variceal-hemorrhage lab panel was deferred to keep this candidate reviewable.
- No selected ref contains SaO2 or troponin I.

## Review Notes

- All five selected refs were in the Batch 06 checker-seat sample and adjudicated clean.
- `baseline_history_protocol` keys outpatient hemoglobin 6.4 g/dL as the admission-driving current measurement, matching the adjudication cross-check.
- `stage_3_diagnostics` preserves current BNP 890 pg/mL and post-transfusion hemoglobin 8.1 g/dL while carrying baseline BNP 280 pg/mL in `excludedValues`.
- `stage_3_interventions` uses `context: post_intervention` for the 30-minute post-treatment vital-sign panel.
- `stage_3_resolution` uses `context: post_intervention` for systolic BP after the nicardipine increase.
- `post_dose` keys only RR and SpO2; pain and sedation score remain out of structured-measurements scope.
- All five should remain supplement-only with prose preserved.

## Gate Output

Current-bank flowsheet gate:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-06A-2026-07-08.json --bank banks/gpt-canonical.json banks/hard-cases-canonical.json
```

Result:

```text
OK   gpt_case_taco_vs_trali_01/baseline_history_protocol [extract]
OK   gpt_case_taco_vs_trali_01/stage_3_diagnostics [extract]
OK   gpt_case_taco_vs_trali_01/stage_3_interventions [extract]
OK   gpt_case_unsafe_assignment_01/stage_3_resolution [extract]
OK   gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/post_dose [extract]

EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-06A-2026-07-08.json: 5 records, 0 FAIL, 0 WARN
```

Applicator dry-run:

```sh
npm run structured-measurements:apply -- --refs gpt_case_taco_vs_trali_01/baseline_history_protocol,gpt_case_taco_vs_trali_01/stage_3_diagnostics,gpt_case_taco_vs_trali_01/stage_3_interventions,gpt_case_unsafe_assignment_01/stage_3_resolution,gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/post_dose EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-06A-2026-07-08.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: gpt-canonical.json (5 exhibit refs)
Selected refs:
- gpt_case_taco_vs_trali_01/baseline_history_protocol [supplement]
- gpt_case_taco_vs_trali_01/stage_3_diagnostics [supplement]
- gpt_case_taco_vs_trali_01/stage_3_interventions [supplement]
- gpt_case_unsafe_assignment_01/stage_3_resolution [supplement]
- gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/post_dose [supplement]
```

Mechanical suite run by Codex:

```sh
npm run validate-bank -- banks/*.json
npm run scan-unknown-keys
npm run test:structured-measurements
npm run test:measurement-allowlist
npm run census:check
npm run build
```

Results:

- All passed.
- `scan-unknown-keys` reported 0 off-schema key occurrences; generated report was removed.
- `build` passed with the existing Vite large-chunk warning.

## Write Command For Gate Seat

After content review, Claude Code can apply this candidate with:

```sh
npm run structured-measurements:apply -- --write --refs gpt_case_taco_vs_trali_01/baseline_history_protocol,gpt_case_taco_vs_trali_01/stage_3_diagnostics,gpt_case_taco_vs_trali_01/stage_3_interventions,gpt_case_unsafe_assignment_01/stage_3_resolution,gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/post_dose EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-06A-2026-07-08.json
```

Then rerun the mechanical suite, regenerate census after the bank write, update the promotion ledger, and commit from the gate seat.
