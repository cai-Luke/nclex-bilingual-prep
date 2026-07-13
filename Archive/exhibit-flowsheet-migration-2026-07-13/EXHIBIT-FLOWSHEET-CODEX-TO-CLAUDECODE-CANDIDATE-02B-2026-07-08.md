# Exhibit Flowsheet Structured Promotion Candidate 02B — Codex to Claude Code

Date: 2026-07-08
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifact:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-02B-2026-07-08.json`

Source artifact:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-02-prose_embedded-2026-07-05.json`

Selected refs:

- `gemini_gap_case_chronic_hf_05/ex1_hf_clinic_visit`
- `gemini_gap_case_cirrhosis_homecare_04/ex1_cirrhosis_clinic_note`
- `gemini_gap_case_hypertension_lifestyle_02/ex1_htn_baseline`

All three are supplement-path records routed to `banks/gemini-canonical.json`. No canonical bank write was performed by Codex.

## Deliberate Exclusions

- Already-promoted Batch 02 refs from proof and Candidate 02A were excluded.
- Empty-panel records were excluded.
- `cs_copd_01/labs` remains excluded because the staged artifact predates the `sao2`/`spo2` split and keys source `SaO2` as `spo2`; it needs re-extraction before promotion.

## Review Notes

- `gemini_gap_case_hypertension_lifestyle_02/ex1_htn_baseline` includes prior BP values in `excludedValues` (`138/86 mmHg`). The applicator dry-run does not write `excludedValues`; only current BP `136/88 mmHg` is selected.
- No selected ref contains SaO2 or troponin I.
- No selected ref contains `unitAliases`.
- All three should remain supplement-only with prose preserved.

## Gate Output

Current-bank flowsheet gate:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-02B-2026-07-08.json --bank banks/gemini-canonical.json
```

Result:

```text
OK   gemini_gap_case_chronic_hf_05/ex1_hf_clinic_visit [extract]
OK   gemini_gap_case_cirrhosis_homecare_04/ex1_cirrhosis_clinic_note [extract]
OK   gemini_gap_case_hypertension_lifestyle_02/ex1_htn_baseline [extract]

EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-02B-2026-07-08.json: 3 records, 0 FAIL, 0 WARN
```

Applicator dry-run:

```sh
npm run structured-measurements:apply -- --refs gemini_gap_case_chronic_hf_05/ex1_hf_clinic_visit,gemini_gap_case_cirrhosis_homecare_04/ex1_cirrhosis_clinic_note,gemini_gap_case_hypertension_lifestyle_02/ex1_htn_baseline EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-02B-2026-07-08.json
```

Result:

```text
Dry-run validated 3 structured-measurements selected records.
Touched banks: gemini-canonical.json (3 exhibit refs)
Selected refs:
- gemini_gap_case_chronic_hf_05/ex1_hf_clinic_visit [supplement]
- gemini_gap_case_cirrhosis_homecare_04/ex1_cirrhosis_clinic_note [supplement]
- gemini_gap_case_hypertension_lifestyle_02/ex1_htn_baseline [supplement]
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
npm run structured-measurements:apply -- --write --refs gemini_gap_case_chronic_hf_05/ex1_hf_clinic_visit,gemini_gap_case_cirrhosis_homecare_04/ex1_cirrhosis_clinic_note,gemini_gap_case_hypertension_lifestyle_02/ex1_htn_baseline EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-02B-2026-07-08.json
```

Then rerun the mechanical suite, regenerate census after the bank write, update the promotion ledger, and commit from the gate seat.
