# Exhibit Flowsheet Structured Promotion Candidate 04B — Codex to Claude Code

Date: 2026-07-08
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifact:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-04B-2026-07-08.json`

Source artifact:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-04-prose_embedded-2026-07-05.json`

Selected refs:

- `gpt_case_gap_2026_06_11_case_adhf_01/adhf_labs`
- `gpt_case_gap_2026_06_11_case_adhf_01/adhf_response`
- `gpt_case_gap_2026_06_11_case_aki_02/aki_labs`
- `gpt_case_gap_2026_06_11_case_aki_02/aki_response`
- `gpt_case_gap_2026_06_11_case_urosepsis_05/sepsis_labs`

All five are supplement-path records routed to `banks/gpt-canonical.json`. No canonical bank write was performed by Codex.

## Deliberate Exclusions

- Candidate 04A refs were excluded.
- Batch 04 HR `/min` prose-normalization rows remain deferred unless already included here with a clean gate result.
- The `skip_serial` row remains deferred.
- The empty/range `baseline_client_snapshot` row remains deferred.
- No selected ref contains SaO2 or troponin I.

## Review Notes

- `adhf_labs` keys BNP/sodium/potassium/creatinine only; qualitative `troponin not elevated` has no numeric value, and weight is out of the structured-measurements allowlist.
- `adhf_response` keys SpO2 and RR only; intake and urine output remain prose.
- `aki_labs` preserves the current creatinine `2.6 mg/dL` and carries baseline creatinine `0.9` as an excluded prior value.
- `aki_response` keys potassium and BP only; urine output `45 mL/hr` remains prose and should not be mistaken for heart rate.
- `sepsis_labs` preserves current blood WBC/lactate/creatinine and carries baseline creatinine `0.9` as an excluded prior value; urine WBC/hpf is urine microscopy, not the blood WBC value.
- All five should remain supplement-only with prose preserved.

## Gate Output

Current-bank flowsheet gate:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-04B-2026-07-08.json --bank banks/gpt-canonical.json banks/hard-cases-canonical.json
```

Result:

```text
OK   gpt_case_gap_2026_06_11_case_adhf_01/adhf_labs [extract]
OK   gpt_case_gap_2026_06_11_case_adhf_01/adhf_response [extract]
OK   gpt_case_gap_2026_06_11_case_aki_02/aki_labs [extract]
OK   gpt_case_gap_2026_06_11_case_aki_02/aki_response [extract]
OK   gpt_case_gap_2026_06_11_case_urosepsis_05/sepsis_labs [extract]

EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-04B-2026-07-08.json: 5 records, 0 FAIL, 0 WARN
```

Applicator dry-run:

```sh
npm run structured-measurements:apply -- --refs gpt_case_gap_2026_06_11_case_adhf_01/adhf_labs,gpt_case_gap_2026_06_11_case_adhf_01/adhf_response,gpt_case_gap_2026_06_11_case_aki_02/aki_labs,gpt_case_gap_2026_06_11_case_aki_02/aki_response,gpt_case_gap_2026_06_11_case_urosepsis_05/sepsis_labs EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-04B-2026-07-08.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: gpt-canonical.json (5 exhibit refs)
Selected refs:
- gpt_case_gap_2026_06_11_case_adhf_01/adhf_labs [supplement]
- gpt_case_gap_2026_06_11_case_adhf_01/adhf_response [supplement]
- gpt_case_gap_2026_06_11_case_aki_02/aki_labs [supplement]
- gpt_case_gap_2026_06_11_case_aki_02/aki_response [supplement]
- gpt_case_gap_2026_06_11_case_urosepsis_05/sepsis_labs [supplement]
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
npm run structured-measurements:apply -- --write --refs gpt_case_gap_2026_06_11_case_adhf_01/adhf_labs,gpt_case_gap_2026_06_11_case_adhf_01/adhf_response,gpt_case_gap_2026_06_11_case_aki_02/aki_labs,gpt_case_gap_2026_06_11_case_aki_02/aki_response,gpt_case_gap_2026_06_11_case_urosepsis_05/sepsis_labs EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-04B-2026-07-08.json
```

Then rerun the mechanical suite, regenerate census after the bank write, update the promotion ledger, and commit from the gate seat.
