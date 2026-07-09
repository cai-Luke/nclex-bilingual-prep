# Exhibit Flowsheet Structured Promotion Candidate 07A — Codex to Claude Code

Date: 2026-07-08
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifact:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-07A-2026-07-08.json`

Source artifact:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-07-prose_embedded-2026-07-05.json`

Selected refs:

- `gpt_pph_2026_06_16_case_01/ex_baseline_labs`
- `gpt_pph_2026_06_16_case_01/stage_1_update`
- `gpt_r1_regen_case_celiac_01/stage3_update`
- `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/stage_2_thrombectomy_preparation`
- `opus_scc_case_01/exh_stage1`

All five are supplement-path records routed to `banks/hard-cases-canonical.json`. No canonical bank write was performed by Codex.

## Deliberate Exclusions

- Batch 07 empty-panel/no-value rows were excluded.
- Batch 07 HR `/min` prose-normalization WARN rows were deferred.
- `gpt_pph_2026_06_16_case_01/ex_background` and `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/initial_ed_record` were deferred because they are empty panels carrying only `excludedValues`.
- `opus_case_warfarin_bridge_01/exh_stage2` was deferred because adjudication noted a non-blocking duplicate-display concern for the INR 1.9 restatement.
- No selected ref contains SaO2 or troponin I.
- No selected ref contains `unitAliases`.

## Review Notes

- All five selected refs were in the Batch 07 checker-seat sample and adjudicated clean.
- `ex_baseline_labs` keys current admission CBC/coagulation/electrolyte/creatinine/glucose values; fibrinogen and UA protein remain out of allowlist scope.
- `stage_1_update` keys post-intervention PPH vital signs only, preserving the surrounding intervention narrative as prose.
- `stage3_update` keys only hemoglobin and total calcium; MCV, ferritin, folate, vitamin D, PTH, albumin, and tTG-IgA remain out of structured-measurements scope.
- `stage_2_thrombectomy_preparation` keys the actual post-nicardipine BP reading only; protocol thresholds remain prose.
- `exh_stage1` keys the sickle-cell reassessment vital-sign panel only; pain score, lung assessment, bladder scan, and neuro grades remain prose.
- All five should remain supplement-only with prose preserved.

## Gate Output

Current-bank flowsheet gate:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-07A-2026-07-08.json --bank banks/hard-cases-canonical.json
```

Result:

```text
OK   gpt_pph_2026_06_16_case_01/ex_baseline_labs [extract]
OK   gpt_pph_2026_06_16_case_01/stage_1_update [extract]
OK   gpt_r1_regen_case_celiac_01/stage3_update [extract]
OK   gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/stage_2_thrombectomy_preparation [extract]
OK   opus_scc_case_01/exh_stage1 [extract]

EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-07A-2026-07-08.json: 5 records, 0 FAIL, 0 WARN
```

Applicator dry-run:

```sh
npm run structured-measurements:apply -- --refs gpt_pph_2026_06_16_case_01/ex_baseline_labs,gpt_pph_2026_06_16_case_01/stage_1_update,gpt_r1_regen_case_celiac_01/stage3_update,gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/stage_2_thrombectomy_preparation,opus_scc_case_01/exh_stage1 EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-07A-2026-07-08.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: hard-cases-canonical.json (5 exhibit refs)
Selected refs:
- gpt_pph_2026_06_16_case_01/ex_baseline_labs [supplement]
- gpt_pph_2026_06_16_case_01/stage_1_update [supplement]
- gpt_r1_regen_case_celiac_01/stage3_update [supplement]
- gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/stage_2_thrombectomy_preparation [supplement]
- opus_scc_case_01/exh_stage1 [supplement]
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
npm run structured-measurements:apply -- --write --refs gpt_pph_2026_06_16_case_01/ex_baseline_labs,gpt_pph_2026_06_16_case_01/stage_1_update,gpt_r1_regen_case_celiac_01/stage3_update,gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/stage_2_thrombectomy_preparation,opus_scc_case_01/exh_stage1 EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-07A-2026-07-08.json
```

Then rerun the mechanical suite, regenerate census after the bank write, update the promotion ledger, and commit from the gate seat.
