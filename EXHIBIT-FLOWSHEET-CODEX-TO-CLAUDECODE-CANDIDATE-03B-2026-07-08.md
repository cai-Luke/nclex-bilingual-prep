# Exhibit Flowsheet Structured Promotion Candidate 03B — Codex to Claude Code

Date: 2026-07-08
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifact:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-03B-2026-07-08.json`

Source artifact:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-03-prose_embedded-2026-07-05.json`

Selected refs:

- `gpt_2026_06_19_case_ici_pneumonitis_01/stage_2_diagnostics`
- `gpt_2026_06_19_case_ici_pneumonitis_01/stage_3_response`
- `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/admission_assessment`
- `gpt_case_client_advocacy_refusal_01/stage_1_update`
- `gpt_case_client_advocacy_refusal_01/stage_3_update`

All five are supplement-path records routed to `banks/gpt-canonical.json` and `banks/hard-cases-canonical.json`. No canonical bank write was performed by Codex.

## Deliberate Exclusions

- Candidate 03A refs were excluded.
- Batch 03 empty-panel records were excluded.
- Batch 03 records with `excludedValues`, source-unit-laundering WARNs, or larger calcium-identity surfaces were deferred to a later risk-sampled candidate.
- No selected ref contains SaO2 or troponin I.

## Review Notes

- `gpt_2026_06_19_case_ici_pneumonitis_01/stage_2_diagnostics` and `stage_3_response` are mixed vitals + ABG surfaces. The applicator dry-run splits them into typed `vitals` and `labs` panels under one `structuredMeasurements` wrapper.
- `gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/admission_assessment` routes to `banks/hard-cases-canonical.json`; the other four route to `banks/gpt-canonical.json`.
- No selected record has `excludedValues` or `unitAliases`.
- All five should remain supplement-only with prose preserved.

## Gate Output

Current-bank flowsheet gate:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-03B-2026-07-08.json --bank banks/gpt-canonical.json banks/hard-cases-canonical.json
```

Result:

```text
OK   gpt_2026_06_19_case_ici_pneumonitis_01/stage_2_diagnostics [extract]
OK   gpt_2026_06_19_case_ici_pneumonitis_01/stage_3_response [extract]
OK   gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/admission_assessment [extract]
OK   gpt_case_client_advocacy_refusal_01/stage_1_update [extract]
OK   gpt_case_client_advocacy_refusal_01/stage_3_update [extract]

EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-03B-2026-07-08.json: 5 records, 0 FAIL, 0 WARN
```

Applicator dry-run:

```sh
npm run structured-measurements:apply -- --refs gpt_2026_06_19_case_ici_pneumonitis_01/stage_2_diagnostics,gpt_2026_06_19_case_ici_pneumonitis_01/stage_3_response,gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/admission_assessment,gpt_case_client_advocacy_refusal_01/stage_1_update,gpt_case_client_advocacy_refusal_01/stage_3_update EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-03B-2026-07-08.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: gpt-canonical.json (4 exhibit refs), hard-cases-canonical.json (1 exhibit refs)
Selected refs:
- gpt_2026_06_19_case_ici_pneumonitis_01/stage_2_diagnostics [supplement]
- gpt_2026_06_19_case_ici_pneumonitis_01/stage_3_response [supplement]
- gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/admission_assessment [supplement]
- gpt_case_client_advocacy_refusal_01/stage_1_update [supplement]
- gpt_case_client_advocacy_refusal_01/stage_3_update [supplement]
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
npm run structured-measurements:apply -- --write --refs gpt_2026_06_19_case_ici_pneumonitis_01/stage_2_diagnostics,gpt_2026_06_19_case_ici_pneumonitis_01/stage_3_response,gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01/admission_assessment,gpt_case_client_advocacy_refusal_01/stage_1_update,gpt_case_client_advocacy_refusal_01/stage_3_update EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-03B-2026-07-08.json
```

Then rerun the mechanical suite, regenerate census after the bank write, update the promotion ledger, and commit from the gate seat.
