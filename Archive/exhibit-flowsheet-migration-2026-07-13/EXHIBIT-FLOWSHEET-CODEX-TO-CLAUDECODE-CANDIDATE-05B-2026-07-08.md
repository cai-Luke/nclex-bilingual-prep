# Exhibit Flowsheet Structured Promotion Candidate 05B — Codex to Claude Code

Date: 2026-07-08
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifact:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-05B-2026-07-08.json`

Source artifact:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-05-prose_embedded-2026-07-05.json`

Selected refs:

- `gpt_case_opioid_recovery_relapse_risk_01/stage_2_update`
- `gpt_case_opioid_recovery_relapse_risk_01/stage_3_update`
- `gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_labs`
- `gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage2_status`
- `gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage3_discharge`

All five are supplement-path records routed to `banks/gpt-canonical.json`. No canonical bank write was performed by Codex.

## Deliberate Exclusions

- Candidate 05A refs were excluded.
- Batch 05 empty-panel/no-value rows remain deferred.
- Batch 05 HR `/min` prose-normalization WARN rows remain deferred unless included here with a clean gate result.
- No selected ref contains SaO2 or troponin I.

## Review Notes

- `stage_2_update` and `stage_3_update` continue the opioid recovery case after the already-promoted `stage_1_update`; both are current vital panels only, with pain/recovery narrative preserved as prose.
- `exhibit_stage1_labs` is the key review surface: current WBC, potassium, and creatinine are keyed while prior WBC, prior potassium, and baseline creatinine remain in `excludedValues`.
- `exhibit_stage1_labs`, `exhibit_stage2_status`, and `exhibit_stage3_discharge` preserve CBC source units as `/µL`.
- `exhibit_stage2_status` and `exhibit_stage3_discharge` are mixed vitals + labs surfaces; the applicator dry-run splits them into typed panels under one `structuredMeasurements` wrapper.
- eGFR, albumin, CRP, stool count, medication plan, and pain/recovery narrative remain out of structured-measurements scope.
- All five should remain supplement-only with prose preserved.

## Gate Output

Current-bank flowsheet gate:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-05B-2026-07-08.json --bank banks/gpt-canonical.json banks/hard-cases-canonical.json
```

Result:

```text
OK   gpt_case_opioid_recovery_relapse_risk_01/stage_2_update [extract]
OK   gpt_case_opioid_recovery_relapse_risk_01/stage_3_update [extract]
OK   gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_labs [extract]
OK   gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage2_status [extract]
OK   gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage3_discharge [extract]

EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-05B-2026-07-08.json: 5 records, 0 FAIL, 0 WARN
```

Applicator dry-run:

```sh
npm run structured-measurements:apply -- --refs gpt_case_opioid_recovery_relapse_risk_01/stage_2_update,gpt_case_opioid_recovery_relapse_risk_01/stage_3_update,gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_labs,gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage2_status,gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage3_discharge EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-05B-2026-07-08.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: gpt-canonical.json (5 exhibit refs)
Selected refs:
- gpt_case_opioid_recovery_relapse_risk_01/stage_2_update [supplement]
- gpt_case_opioid_recovery_relapse_risk_01/stage_3_update [supplement]
- gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_labs [supplement]
- gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage2_status [supplement]
- gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage3_discharge [supplement]
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
npm run structured-measurements:apply -- --write --refs gpt_case_opioid_recovery_relapse_risk_01/stage_2_update,gpt_case_opioid_recovery_relapse_risk_01/stage_3_update,gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage1_labs,gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage2_status,gpt_case_opus5_cdi_immunocompromised_01/exhibit_stage3_discharge EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-05B-2026-07-08.json
```

Then rerun the mechanical suite, regenerate census after the bank write, update the promotion ledger, and commit from the gate seat.
