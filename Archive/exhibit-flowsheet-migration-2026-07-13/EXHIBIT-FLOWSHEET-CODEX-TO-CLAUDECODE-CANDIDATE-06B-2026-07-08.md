# Exhibit Flowsheet Structured Promotion Candidate 06B — Codex to Claude Code

Date: 2026-07-08
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifact:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-06B-2026-07-08.json`

Source artifact:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-06-prose_embedded-2026-07-05.json`

Selected refs:

- `gpt_case_pressure_injury_prevention_mobility_01/stage_1_update`
- `gpt_case_taco_vs_trali_01/stage_2_reaction`
- `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01/initial_assessment`
- `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/baseline_order`
- `gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/pre_dose`

All five are supplement-path records routed to `banks/gpt-canonical.json` and `banks/hard-cases-canonical.json`. No canonical bank write was performed by Codex.

## Deliberate Exclusions

- Candidate 06A refs were excluded.
- Batch 06 empty-panel/no-value rows were excluded.
- Batch 06 `skip_serial` rows were excluded.
- Batch 06 HR `/min` prose-normalization WARN rows were deferred.
- The larger variceal-hemorrhage lab panel was deferred to keep this candidate reviewable.
- No selected ref contains SaO2 or troponin I.

## Review Notes

- `stage_1_update` keys post-repositioning vitals only; pain, sedation description, Foley output, intake, and pressure-injury prose remain unstructured.
- `stage_2_reaction` keys the acute TACO/TRALI reaction vital-sign panel only; urine output and physical assessment findings remain prose.
- `initial_assessment` keys variceal-hemorrhage ED arrival vitals only; assessment findings remain prose.
- `baseline_order` and `pre_dose` key respiratory/BP safety measurements only; pain and sedation scores remain out of structured-measurements scope.
- All five have no `excludedValues` or `unitAliases`.
- All five should remain supplement-only with prose preserved.

## Gate Output

Current-bank flowsheet gate:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-06B-2026-07-08.json --bank banks/gpt-canonical.json banks/hard-cases-canonical.json
```

Result:

```text
OK   gpt_case_pressure_injury_prevention_mobility_01/stage_1_update [extract]
OK   gpt_case_taco_vs_trali_01/stage_2_reaction [extract]
OK   gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01/initial_assessment [extract]
OK   gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/baseline_order [extract]
OK   gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/pre_dose [extract]

EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-06B-2026-07-08.json: 5 records, 0 FAIL, 0 WARN
```

Applicator dry-run:

```sh
npm run structured-measurements:apply -- --refs gpt_case_pressure_injury_prevention_mobility_01/stage_1_update,gpt_case_taco_vs_trali_01/stage_2_reaction,gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01/initial_assessment,gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/baseline_order,gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/pre_dose EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-06B-2026-07-08.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: gpt-canonical.json (4 exhibit refs), hard-cases-canonical.json (1 exhibit refs)
Selected refs:
- gpt_case_pressure_injury_prevention_mobility_01/stage_1_update [supplement]
- gpt_case_taco_vs_trali_01/stage_2_reaction [supplement]
- gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01/initial_assessment [supplement]
- gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/baseline_order [supplement]
- gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/pre_dose [supplement]
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
npm run structured-measurements:apply -- --write --refs gpt_case_pressure_injury_prevention_mobility_01/stage_1_update,gpt_case_taco_vs_trali_01/stage_2_reaction,gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01/initial_assessment,gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/baseline_order,gpt_gap_2026_06_12_nonmcq_balanced_b_case_opioid_safety_01/pre_dose EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-06B-2026-07-08.json
```

Then rerun the mechanical suite, regenerate census after the bank write, update the promotion ledger, and commit from the gate seat.
