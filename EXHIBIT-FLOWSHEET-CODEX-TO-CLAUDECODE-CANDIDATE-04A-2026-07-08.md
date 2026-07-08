# Exhibit Flowsheet Structured Promotion Candidate 04A — Codex to Claude Code

Date: 2026-07-08
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifact:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-04A-2026-07-08.json`

Source artifact:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-04-prose_embedded-2026-07-05.json`

Selected refs:

- `gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_labs`
- `gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_labs`
- `gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_labs`
- `gpt_case_gbs_respiratory_compromise_01/ex_initial_assessment`
- `gpt_case_infection_control_clustered_care_01/stage_2_1130_status`

All five are supplement-path records routed to `banks/gpt-canonical.json` and `banks/hard-cases-canonical.json`. No canonical bank write was performed by Codex.

## Deliberate Exclusions

- Batch 04 rows with `excludedValues` were deferred.
- The `skip_serial` row was deferred.
- Empty-panel / scalar-range rows were deferred.
- WARN rows caused by HR `/min` prose-normalization or qualitative/no-value lab mentions were deferred.
- No selected ref contains SaO2 or troponin I.

## Review Notes

- Four of five selected refs were in the Batch 04 checker-seat sample and adjudicated clean: `anticoag_labs`, `panc_labs`, `ex_initial_assessment`, and `stage_2_1130_status`.
- `adrenal_labs` was not in the tapered checker-seat sample, but it is a low-noise scalar lab panel with no gate warnings, no `excludedValues`, and no `unitAliases`.
- `anticoag_labs` and `panc_labs` preserve CBC source units as `/mm3`; the Batch 04 adjudication specifically reviewed the `/mm3` surfaces as acceptable.
- `stage_2_1130_status` is intentionally scoped to Client A values only; other clients' status prose remains unstructured.
- All five should remain supplement-only with prose preserved.

## Gate Output

Current-bank flowsheet gate:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-04A-2026-07-08.json --bank banks/gpt-canonical.json banks/hard-cases-canonical.json
```

Result:

```text
OK   gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_labs [extract]
OK   gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_labs [extract]
OK   gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_labs [extract]
OK   gpt_case_gbs_respiratory_compromise_01/ex_initial_assessment [extract]
OK   gpt_case_infection_control_clustered_care_01/stage_2_1130_status [extract]

EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-04A-2026-07-08.json: 5 records, 0 FAIL, 0 WARN
```

Applicator dry-run:

```sh
npm run structured-measurements:apply -- --refs gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_labs,gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_labs,gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_labs,gpt_case_gbs_respiratory_compromise_01/ex_initial_assessment,gpt_case_infection_control_clustered_care_01/stage_2_1130_status EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-04A-2026-07-08.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: gpt-canonical.json (4 exhibit refs), hard-cases-canonical.json (1 exhibit refs)
Selected refs:
- gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_labs [supplement]
- gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_labs [supplement]
- gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_labs [supplement]
- gpt_case_gbs_respiratory_compromise_01/ex_initial_assessment [supplement]
- gpt_case_infection_control_clustered_care_01/stage_2_1130_status [supplement]
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
npm run structured-measurements:apply -- --write --refs gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_labs,gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_labs,gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_labs,gpt_case_gbs_respiratory_compromise_01/ex_initial_assessment,gpt_case_infection_control_clustered_care_01/stage_2_1130_status EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-04A-2026-07-08.json
```

Then rerun the mechanical suite, regenerate census after the bank write, update the promotion ledger, and commit from the gate seat.
