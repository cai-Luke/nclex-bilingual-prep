# Exhibit Flowsheet Structured Promotion Candidates 10A + 10B — Codex to Claude Code

Date: 2026-07-09
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifacts:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-10A-2026-07-09.json`
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-10B-2026-07-09.json`

Source artifact:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-10-scattered-2026-07-05.json`

Selected refs:

Candidate 10A:

- `case_dka_01/ex_labs_0815`
- `case_preeclampsia_magnesium_01/labs`
- `case_preeclampsia_magnesium_01/toxicity_assessment`
- `case_sepsis_pneumonia_01/initial_results`
- `cs_ckd_01/labs_pre`

Candidate 10B:

- `cs_copd_01/vitals`
- `cs_sepsis_shock_01/labs_1600`
- `cs_thyroid_storm_main/ex_triage_0800`
- `gemini_gap_case_palliative_care_03/ex1_hospice_baseline`
- `gemini_gap_case_pediatric_croup_02/ex1_triage_respiratory`

No canonical bank write was performed by Codex.

## Routing

- Candidate 10A routes all five refs to `banks/hard-cases-canonical.json`.
- Candidate 10B routes three refs to `banks/hard-cases-canonical.json` and two refs to `banks/gemini-canonical.json`.

## Deliberate Exclusions

- Batch 10 `skip_serial`, empty/no-value, multi-victim, protocol-threshold, and name-collision-only rows remain deferred.
- HR `/min` or `beats/minute` prose-normalization WARN rows remain deferred unless already absent from the selected surface.
- `case_sepsis_pneumonia_01/after_500_ml`, `case_sepsis_pneumonia_01/after_resuscitation`, `cs_adhf_pulm_edema_01/ed_assessment`, `cs_sepsis_shock_01/triage_vitals`, `cs_sepsis_shock_01/vitals_1600`, and `cs_stemi_vfib_04/triage_1400` remain deferred for WARN cleanup or later review.
- No selected ref contains SaO2 or troponin I.
- No selected ref contains `excludedValues` or `unitAliases`.

## Review Notes

- Candidate 10A starts the scattered-lane promotion with adjudicated-clean DKA/preeclampsia/sepsis/CKD lab and focused-assessment surfaces.
- `case_preeclampsia_magnesium_01/toxicity_assessment` preserves Rule F granularity: RR/SpO2 carry no context, while the post-labetalol BP values carry `post_intervention`.
- Candidate 10B covers clean COPD, sepsis-shock labs, thyroid-storm triage vitals, and two Gemini vitals surfaces.
- `cs_copd_01/vitals` keys the Fahrenheit source temperature once; the Celsius parenthetical remains prose and is not double-counted.
- `cs_sepsis_shock_01/labs_1600` labels as `Current` because the visible title/content do not carry 1600; the 1600 appears only in the internal exhibit id.
- All selected refs should remain supplement-only with prose preserved.

## Timestamp Sanity

After Claude's Candidate 06A column-label finding, Codex ran a title/content timestamp sanity pass on every selected ref:

- Candidate 10A labels: `0815`, `Current`, `Current`, `Current`, `Current`.
- Candidate 10B labels: `1000`, `Current`, `0800`, `Current`, `Current`.
- No selected row has a competing body-text decoy timestamp tied to a different clinical event.

## Gate Output

Current-bank flowsheet gate, Candidate 10A:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-10A-2026-07-09.json --bank banks/hard-cases-canonical.json
```

Result:

```text
EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-10A-2026-07-09.json: 5 records, 0 FAIL, 0 WARN
```

Current-bank flowsheet gate, Candidate 10B:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-10B-2026-07-09.json --bank banks/gemini-canonical.json --bank banks/hard-cases-canonical.json
```

Result:

```text
EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-10B-2026-07-09.json: 5 records, 0 FAIL, 0 WARN
```

Applicator dry-run, Candidate 10A:

```sh
npm run structured-measurements:apply -- --refs case_dka_01/ex_labs_0815,case_preeclampsia_magnesium_01/labs,case_preeclampsia_magnesium_01/toxicity_assessment,case_sepsis_pneumonia_01/initial_results,cs_ckd_01/labs_pre EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-10A-2026-07-09.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: hard-cases-canonical.json (5 exhibit refs)
```

Applicator dry-run, Candidate 10B:

```sh
npm run structured-measurements:apply -- --refs cs_copd_01/vitals,cs_sepsis_shock_01/labs_1600,cs_thyroid_storm_main/ex_triage_0800,gemini_gap_case_palliative_care_03/ex1_hospice_baseline,gemini_gap_case_pediatric_croup_02/ex1_triage_respiratory EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-10B-2026-07-09.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: gemini-canonical.json (2 exhibit refs), hard-cases-canonical.json (3 exhibit refs)
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

- All passed.
- `scan-unknown-keys` reported 0 off-schema key occurrences; generated report was removed.
- `build` passed with the existing Vite large-chunk warning.

## Write Commands For Gate Seat

After content review, Claude Code can apply Candidate 10A with:

```sh
npm run structured-measurements:apply -- --write --refs case_dka_01/ex_labs_0815,case_preeclampsia_magnesium_01/labs,case_preeclampsia_magnesium_01/toxicity_assessment,case_sepsis_pneumonia_01/initial_results,cs_ckd_01/labs_pre EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-10A-2026-07-09.json
```

After content review, Claude Code can apply Candidate 10B with:

```sh
npm run structured-measurements:apply -- --write --refs cs_copd_01/vitals,cs_sepsis_shock_01/labs_1600,cs_thyroid_storm_main/ex_triage_0800,gemini_gap_case_palliative_care_03/ex1_hospice_baseline,gemini_gap_case_pediatric_croup_02/ex1_triage_respiratory EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-10B-2026-07-09.json
```

Then rerun the mechanical suite, regenerate census after any bank write, update the promotion ledger, and commit from the gate seat.
