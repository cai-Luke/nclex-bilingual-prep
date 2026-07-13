# Exhibit Flowsheet Structured Promotion Candidate 05A — Codex to Claude Code

Date: 2026-07-08
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifact:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-05A-2026-07-08.json`

Source artifact:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-05-prose_embedded-2026-07-05.json`

Selected refs:

- `gpt_case_neutropenic_fever_nadir_01/baseline_orders`
- `gpt_case_opioid_recovery_relapse_risk_01/stage_1_update`
- `gpt_case_opus23_nat_toddler_01/stage_1_imaging_caregiver_update`
- `gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_assessment`
- `gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/baseline_labs`

All five are supplement-path records routed to `banks/gpt-canonical.json` and `banks/hard-cases-canonical.json`. No canonical bank write was performed by Codex.

## Deliberate Exclusions

- Batch 05 empty-panel/no-value rows were excluded.
- Batch 05 rows with `excludedValues` were deferred.
- Batch 05 HR `/min` prose-normalization WARN rows were deferred.
- No selected ref contains SaO2 or troponin I.

## Review Notes

- All five selected refs were in the Batch 05 checker-seat sample and adjudicated clean.
- `baseline_orders` keys the baseline admission vitals only; protocol fever thresholds remain prose.
- `stage_1_update` keys post-analgesia vitals only; pain score remains out of allowlist scope.
- `stage_1_imaging_caregiver_update` intentionally keys the single embedded HR 128 only; other vitals are in a different exhibitRef.
- `exhibit_stage1_assessment` keys current assessment vitals only.
- `baseline_labs` preserves WBC and platelet source units as `/mcL`; eGFR remains out of allowlist scope.
- All five should remain supplement-only with prose preserved.

## Gate Output

Current-bank flowsheet gate:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-05A-2026-07-08.json --bank banks/gpt-canonical.json banks/hard-cases-canonical.json
```

Result:

```text
OK   gpt_case_neutropenic_fever_nadir_01/baseline_orders [extract]
OK   gpt_case_opioid_recovery_relapse_risk_01/stage_1_update [extract]
OK   gpt_case_opus23_nat_toddler_01/stage_1_imaging_caregiver_update [extract]
OK   gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_assessment [extract]
OK   gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/baseline_labs [extract]

EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-05A-2026-07-08.json: 5 records, 0 FAIL, 0 WARN
```

Applicator dry-run:

```sh
npm run structured-measurements:apply -- --refs gpt_case_neutropenic_fever_nadir_01/baseline_orders,gpt_case_opioid_recovery_relapse_risk_01/stage_1_update,gpt_case_opus23_nat_toddler_01/stage_1_imaging_caregiver_update,gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_assessment,gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/baseline_labs EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-05A-2026-07-08.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: gpt-canonical.json (4 exhibit refs), hard-cases-canonical.json (1 exhibit refs)
Selected refs:
- gpt_case_neutropenic_fever_nadir_01/baseline_orders [supplement]
- gpt_case_opioid_recovery_relapse_risk_01/stage_1_update [supplement]
- gpt_case_opus23_nat_toddler_01/stage_1_imaging_caregiver_update [supplement]
- gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_assessment [supplement]
- gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/baseline_labs [supplement]
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
npm run structured-measurements:apply -- --write --refs gpt_case_neutropenic_fever_nadir_01/baseline_orders,gpt_case_opioid_recovery_relapse_risk_01/stage_1_update,gpt_case_opus23_nat_toddler_01/stage_1_imaging_caregiver_update,gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_assessment,gpt_case_pe_2026_06_16_case_pulmonary_embolism_01/baseline_labs EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-05A-2026-07-08.json
```

Then rerun the mechanical suite, regenerate census after the bank write, update the promotion ledger, and commit from the gate seat.
