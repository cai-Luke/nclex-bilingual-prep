# Exhibit Flowsheet Structured Promotion Candidates 08B + 09A — Codex to Claude Code

Date: 2026-07-09
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifacts:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-08B-2026-07-09.json`
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-09A-2026-07-09.json`

Source artifacts:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-08-prose_embedded-2026-07-05.json`
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-09-prose_embedded-2026-07-05.json`

Selected refs:

Candidate 08B:

- `opus22_case_postpartum_intrusive_thoughts_01/assessment_labs`
- `opus22_case_postpartum_intrusive_thoughts_01/stage_2_symptoms`
- `opus22_case_postpartum_intrusive_thoughts_01/stage_3_improvement`
- `opus25_case_tb_airborne_treatment_monitoring_01/stage3_progress`
- `opus25_case_tb_airborne_treatment_monitoring_01/stage4_progress`

Candidate 09A:

- `opus4_case_postop_sbar_01/stage3_interventions`
- `opus5_case_consent_interpreter_01/preop_labs`

No canonical bank write was performed by Codex.

## Routing

- Candidate 08B routes all five refs to `banks/claude-canonical.json`.
- Candidate 09A routes both refs to `banks/hard-cases-canonical.json`.

## Deliberate Exclusions

- Empty/no-value rows, `skip_serial` rows, and name-collision-only rows remain deferred.
- HR `/min` prose-normalization WARN rows remain deferred.
- `opus12_case_inpatient_suicide_risk_01/morning_assessment` was deliberately deferred: the current applicator would label its column `0300` from a night-shift note, but the vitals are not anchored to 0300.
- `opus25_case_tb_airborne_treatment_monitoring_01/stage1_progress` was deliberately deferred: the current applicator would label its column `2100` from sputum-collection timing, but the extracted temperature is not anchored to that time.
- No selected ref contains SaO2 or troponin I.
- No selected ref contains `excludedValues` or `unitAliases`.

## Review Notes

- Candidate 08B selects three postpartum intrusive-thoughts vitals/lab surfaces and two TB treatment-monitoring lab/vitals follow-up surfaces with clean timestamp behavior.
- `opus25_case_tb_airborne_treatment_monitoring_01/stage3_progress` correctly carries `post_intervention` context on temperature, AST, and ALT after three TB-regimen doses.
- `opus25_case_tb_airborne_treatment_monitoring_01/stage4_progress` keys only current AST/ALT/total bilirubin; the future ALT threshold remains prose.
- Candidate 09A selects the two sampled-safe Batch 09 records: post-intervention pre-transport vitals and previous-day preop labs.
- `opus5_case_consent_interpreter_01/preop_labs` remains current despite "previous day" wording because adjudication confirmed there is no newer contradicting value in the case.
- All selected refs should remain supplement-only with prose preserved.

## Timestamp Sanity

After Claude's Candidate 06A column-label finding, Codex ran a title/content timestamp sanity pass on every selected ref:

- Candidate 08B labels: `Current`, `Current`, `Current`, `Current`, `Current`.
- Candidate 09A labels: `1315`, `Current`.
- The two rejected near-misses were `morning_assessment` (`0300` decoy) and `stage1_progress` (`2100`/`0530` sputum-collection decoys).

## Gate Output

Current-bank flowsheet gate, Candidate 08B:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-08B-2026-07-09.json --bank banks/claude-canonical.json
```

Result:

```text
EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-08B-2026-07-09.json: 5 records, 0 FAIL, 0 WARN
```

Current-bank flowsheet gate, Candidate 09A:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-09A-2026-07-09.json --bank banks/hard-cases-canonical.json
```

Result:

```text
EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-09A-2026-07-09.json: 2 records, 0 FAIL, 0 WARN
```

Applicator dry-run, Candidate 08B:

```sh
npm run structured-measurements:apply -- --refs opus22_case_postpartum_intrusive_thoughts_01/assessment_labs,opus22_case_postpartum_intrusive_thoughts_01/stage_2_symptoms,opus22_case_postpartum_intrusive_thoughts_01/stage_3_improvement,opus25_case_tb_airborne_treatment_monitoring_01/stage3_progress,opus25_case_tb_airborne_treatment_monitoring_01/stage4_progress EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-08B-2026-07-09.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: claude-canonical.json (5 exhibit refs)
```

Applicator dry-run, Candidate 09A:

```sh
npm run structured-measurements:apply -- --refs opus4_case_postop_sbar_01/stage3_interventions,opus5_case_consent_interpreter_01/preop_labs EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-09A-2026-07-09.json
```

Result:

```text
Dry-run validated 2 structured-measurements selected records.
Touched banks: hard-cases-canonical.json (2 exhibit refs)
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

- All passed on the final candidate artifacts.
- `scan-unknown-keys` reported 0 off-schema key occurrences; generated report was removed.
- `build` passed with the existing Vite large-chunk warning.

## Write Commands For Gate Seat

After content review, Claude Code can apply Candidate 08B with:

```sh
npm run structured-measurements:apply -- --write --refs opus22_case_postpartum_intrusive_thoughts_01/assessment_labs,opus22_case_postpartum_intrusive_thoughts_01/stage_2_symptoms,opus22_case_postpartum_intrusive_thoughts_01/stage_3_improvement,opus25_case_tb_airborne_treatment_monitoring_01/stage3_progress,opus25_case_tb_airborne_treatment_monitoring_01/stage4_progress EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-08B-2026-07-09.json
```

After content review, Claude Code can apply Candidate 09A with:

```sh
npm run structured-measurements:apply -- --write --refs opus4_case_postop_sbar_01/stage3_interventions,opus5_case_consent_interpreter_01/preop_labs EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-09A-2026-07-09.json
```

Then rerun the mechanical suite, regenerate census after any bank write, update the promotion ledger, and commit from the gate seat.
