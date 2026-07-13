# Exhibit Flowsheet Structured Promotion Candidates 12A + 12B - Patched Codex to Claude Code

Date: 2026-07-09
Producer: Codex
Promotion gate: Claude Code

## Scope

This supersedes the earlier 12A/12B handoff after the comparator/inferred-unit rulings.

Promotion-ready artifacts:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12A-2026-07-09.json`
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12B-2026-07-09.json`

Hold/review artifacts:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12G-GALLSTONE-HOLD-2026-07-09.json`
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12T-TLS-HOLD-2026-07-09.json`

Source artifact:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-12-scattered-2026-07-05.json`

No canonical bank write was performed by Codex.

## Promotion-Ready Refs

Candidate 12A:

- `gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_deterioration`
- `gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_response`
- `gpt_case_gap_2026_06_11_case_aki_02/aki_initial`

Candidate 12B:

- `gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_deterioration`
- `gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_response`
- `gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_deterioration`

All six promotion-ready refs route to `banks/gpt-canonical.json`.

## Patch Notes

- `anticoag_deterioration` no longer stores `ptt=>200` as a structured value. The ptt entry was moved to `excludedValues` with `reason: "comparator"` because v1 has no censored/comparator value representation. The six scalar rows remain promotable. This historical disposition was later superseded by schema 2.0's typed `bound` representation.
- Gallstone `stage_2_update` and `stage_3_update` were removed from promotion-ready 12A and moved to the explicit gallstone HOLD artifact after the inferred-unit ruling.
- TLS `baseline_exhibit` and `stage1_exhibit` were removed from promotion-ready 12B and moved to the explicit TLS HOLD artifact. The TLS HOLD re-extraction now includes `uric_acid` so the criterion analyte is not omitted.
- No selected promotion-ready ref contains SaO2 or Troponin I.
- No selected promotion-ready ref contains `unitAliases`.

## Gate Output

Promotion-ready Candidate 12A:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12A-2026-07-09.json --bank banks/gpt-canonical.json
```

Result:

```text
EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12A-2026-07-09.json: 3 records, 0 FAIL, 3 WARN
```

The 3 WARNs are the established HR `/min` to `bpm` prose-normalization category.

Promotion-ready Candidate 12B:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12B-2026-07-09.json --bank banks/gpt-canonical.json
```

Result:

```text
EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12B-2026-07-09.json: 3 records, 0 FAIL, 4 WARN
```

The 4 WARNs are 3 HR `/min` prose-normalization WARNs plus the already-adjudicated qualitative platelet-decline advisory in `anticoag_response`.

Gallstone HOLD:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12G-GALLSTONE-HOLD-2026-07-09.json --bank banks/hard-cases-canonical.json
```

Result:

```text
EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12G-GALLSTONE-HOLD-2026-07-09.json: 2 records, 0 FAIL, 5 WARN
```

Expected HOLD warnings: inferred BUN ambiguity plus unitless calcium/ionized-calcium GATE 2 subclass warnings. The re-extraction keys BUN/Cr/glucose/lactate where eligible and leaves calcium/ionized calcium prose.

TLS HOLD:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12T-TLS-HOLD-2026-07-09.json --bank banks/gpt-canonical.json
```

Result:

```text
EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12T-TLS-HOLD-2026-07-09.json: 2 records, 0 FAIL, 2 WARN
```

Expected HOLD warnings: HR `/min` prose-normalization only. The re-extraction includes `uric_acid`; LDH remains out of structured scope.

## Applicator Dry-Runs

Candidate 12A:

```sh
npm run structured-measurements:apply -- --refs gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_deterioration,gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_response,gpt_case_gap_2026_06_11_case_aki_02/aki_initial EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12A-2026-07-09.json
```

Result:

```text
Dry-run validated 3 structured-measurements selected records.
Touched banks: gpt-canonical.json (3 exhibit refs)
```

Candidate 12B:

```sh
npm run structured-measurements:apply -- --refs gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_deterioration,gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_response,gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_deterioration EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12B-2026-07-09.json
```

Result:

```text
Dry-run validated 3 structured-measurements selected records.
Touched banks: gpt-canonical.json (3 exhibit refs)
```

Gallstone HOLD and TLS HOLD also dry-run successfully, but remain review/hold artifacts.

## Write Commands For Gate Seat

After content review, Claude Code can apply Candidate 12A with:

```sh
npm run structured-measurements:apply -- --write --refs gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_deterioration,gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_response,gpt_case_gap_2026_06_11_case_aki_02/aki_initial EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12A-2026-07-09.json
```

After content review, Claude Code can apply Candidate 12B with:

```sh
npm run structured-measurements:apply -- --write --refs gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_deterioration,gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_response,gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_deterioration EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12B-2026-07-09.json
```

Then rerun the mechanical suite, regenerate census after any bank write, update the promotion ledger, and commit from the gate seat.
