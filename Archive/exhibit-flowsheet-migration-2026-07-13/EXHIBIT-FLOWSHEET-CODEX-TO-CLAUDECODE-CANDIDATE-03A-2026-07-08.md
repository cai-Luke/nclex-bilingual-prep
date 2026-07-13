# Exhibit Flowsheet Structured Promotion Candidate 03A — Codex to Claude Code

Date: 2026-07-08
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifact:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-03A-2026-07-08.json`

Source artifact:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-03-prose_embedded-2026-07-05.json`

Selected refs:

- `gemini_gapfill_case_2026_06_10_case_wellness_03/labs`
- `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/baseline_labs`
- `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage1_triage_call`
- `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage2_labs`
- `gpt_2026_06_19_case_ici_pneumonitis_01/baseline_assessment`

All five are supplement-path records routed to `banks/gemini-canonical.json` and `banks/gpt-canonical.json`. No canonical bank write was performed by Codex.

## Deliberate Exclusions

- Batch 03 empty-panel records were excluded.
- Batch 03 records with `excludedValues`, source-unit-laundering WARNs, or larger mixed ABG/vitals surfaces were deferred to a later risk-sampled candidate.
- No selected ref contains SaO2 or troponin I.

## Review Notes

- `gemini_gapfill_case_2026_06_10_case_wellness_03/labs` keys fasting glucose only; A1C remains out of allowlist scope per Batch 03 adjudication.
- `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/baseline_labs` and `stage2_labs` key allowlisted HELLP/preeclampsia labs; uric acid, LDH, urine protein wording, fibrinogen, and urine protein ratio remain out of allowlist scope per adjudication.
- `gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage1_triage_call` keys home BP only; pain score and timing are out of scope.
- `gpt_2026_06_19_case_ici_pneumonitis_01/baseline_assessment` keys current vital signs only.
- No selected record has `excludedValues` or `unitAliases`.
- All five should remain supplement-only with prose preserved.

## Gate Output

Current-bank flowsheet gate:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-03A-2026-07-08.json --bank banks/gemini-canonical.json banks/gpt-canonical.json
```

Result:

```text
OK   gemini_gapfill_case_2026_06_10_case_wellness_03/labs [extract]
OK   gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/baseline_labs [extract]
OK   gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage1_triage_call [extract]
OK   gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage2_labs [extract]
OK   gpt_2026_06_19_case_ici_pneumonitis_01/baseline_assessment [extract]

EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-03A-2026-07-08.json: 5 records, 0 FAIL, 0 WARN
```

Applicator dry-run:

```sh
npm run structured-measurements:apply -- --refs gemini_gapfill_case_2026_06_10_case_wellness_03/labs,gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/baseline_labs,gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage1_triage_call,gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage2_labs,gpt_2026_06_19_case_ici_pneumonitis_01/baseline_assessment EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-03A-2026-07-08.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: gemini-canonical.json (1 exhibit refs), gpt-canonical.json (4 exhibit refs)
Selected refs:
- gemini_gapfill_case_2026_06_10_case_wellness_03/labs [supplement]
- gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/baseline_labs [supplement]
- gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage1_triage_call [supplement]
- gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage2_labs [supplement]
- gpt_2026_06_19_case_ici_pneumonitis_01/baseline_assessment [supplement]
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
npm run structured-measurements:apply -- --write --refs gemini_gapfill_case_2026_06_10_case_wellness_03/labs,gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/baseline_labs,gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage1_triage_call,gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage2_labs,gpt_2026_06_19_case_ici_pneumonitis_01/baseline_assessment EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-03A-2026-07-08.json
```

Then rerun the mechanical suite, regenerate census after the bank write, update the promotion ledger, and commit from the gate seat.
