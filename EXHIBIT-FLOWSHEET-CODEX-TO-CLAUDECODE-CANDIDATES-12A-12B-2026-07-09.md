# Exhibit Flowsheet Structured Promotion Candidates 12A + 12B - Codex to Claude Code

Date: 2026-07-09
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifacts:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12A-2026-07-09.json`
- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12B-2026-07-09.json`

Source artifact:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-12-scattered-2026-07-05.json`

Selected refs:

Candidate 12A:

- `gpt_case_gallstone_pancreatitis_01/stage_2_update`
- `gpt_case_gallstone_pancreatitis_01/stage_3_update`
- `gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_deterioration`
- `gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_response`
- `gpt_case_gap_2026_06_11_case_aki_02/aki_initial`

Candidate 12B:

- `gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_deterioration`
- `gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_response`
- `gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_deterioration`
- `gpt_case_gap_2026_06_11_case_tls_01/baseline_exhibit`
- `gpt_case_gap_2026_06_11_case_tls_01/stage1_exhibit`

No canonical bank write was performed by Codex.

## Routing

- Candidate 12A routes three refs to `banks/gpt-canonical.json` and two refs to `banks/hard-cases-canonical.json`.
- Candidate 12B routes all five refs to `banks/gpt-canonical.json`.

## Gate Shape

- Candidate 12A: `0 FAIL / 15 WARN`.
- Candidate 12B: `0 FAIL / 6 WARN`.
- Candidate 12A was initially probed against `gpt-canonical.json` only and the two gallstone refs failed scope lookup; rerun with `hard-cases-canonical.json` included was clean of FAILs.
- WARNs are disclosed rather than normalized away:
  - Candidate 12A has 12 GATE 2 advisories from the gallstone abbreviated lab lists. Batch 12 adjudication confirmed WBC/Hct were re-extracted because they carry explicit units, while the remaining named labs in those sentences remain prose because source units are absent.
  - Candidate 12A has 3 HR `/min` prose-normalization WARNs.
  - Candidate 12B has 5 HR `/min` prose-normalization WARNs.
  - Candidate 12B has 1 GATE 2 advisory for a qualitative platelet-decline phrase in `anticoag_response`, not a current platelet value.

## Deliberate Exclusions

- Batch 12 empty/no-value rows and `skip_serial` rows remain deferred.
- `gpt_case_clozapine_toxicity_01/day18_assessment` and `.../four_hour_update` are deferred, not promoted here. These source rows contain numeric Troponin I values. The old staged artifact correctly avoided mapping them to `troponin_t`, but the current structured-only allowlist now has `troponin_i`; those two rows should get a fresh mini re-extraction/review rather than silently preserving the older omission.
- No selected ref contains SaO2 or Troponin I.
- No selected ref contains `excludedValues` or `unitAliases`.

## Review Notes

- Candidate 12A:
  - Gallstone `stage_2_update` and `stage_3_update` include the Batch 12 re-extraction fix: WBC/Hct are keyed from explicit `/mcL` and `%` units; other abbreviated labs in the same sentences remain prose because units are absent.
  - Gallstone `stage_3_update` values carry `post_intervention`.
  - Adrenal crisis `adrenal_response` values carry `post_intervention`; `adrenal_deterioration` does not.
  - AKI `aki_initial` keys admission temp/HR/BP only; urine output remains out of scope.
- Candidate 12B:
  - Anticoagulation `anticoag_deterioration` preserves aPTT as `>150 seconds`.
  - Anticoagulation `anticoag_response` keys post-fluid BP/HR only; platelet decline is qualitative.
  - Pancreatitis `panc_deterioration` keys vitals/Hct/BUN/Ca; urine output remains out of scope.
  - TLS `baseline_exhibit` and `stage1_exhibit` key vitals plus allowlisted labs; uric acid, LDH, urine output, and ECG morphology remain prose/out of scope.
- All selected refs should remain supplement-only with prose preserved.

## Timestamp Sanity

After the Candidate 06A column-label finding, Codex ran a title/content timestamp sanity pass on every selected ref:

- Candidate 12A labels: `Current`, `Current`, `Current`, `Current`, `Current`.
- Candidate 12B labels: `Current`, `Current`, `Current`, `Current`, `Current`.
- The gallstone titles contain hour ranges (`12-24`, `36-48`) but no clock/military tokens, so the applicator leaves their column labels as `Current`.
- No selected ref has a competing clock/military body-text decoy timestamp.

## Gate Output

Current-bank flowsheet gate, Candidate 12A:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12A-2026-07-09.json --bank banks/gpt-canonical.json --bank banks/hard-cases-canonical.json
```

Result:

```text
EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12A-2026-07-09.json: 5 records, 0 FAIL, 15 WARN
```

Current-bank flowsheet gate, Candidate 12B:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12B-2026-07-09.json --bank banks/gpt-canonical.json
```

Result:

```text
EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12B-2026-07-09.json: 5 records, 0 FAIL, 6 WARN
```

Applicator dry-run, Candidate 12A:

```sh
npm run structured-measurements:apply -- --refs gpt_case_gallstone_pancreatitis_01/stage_2_update,gpt_case_gallstone_pancreatitis_01/stage_3_update,gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_deterioration,gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_response,gpt_case_gap_2026_06_11_case_aki_02/aki_initial EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12A-2026-07-09.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: gpt-canonical.json (3 exhibit refs), hard-cases-canonical.json (2 exhibit refs)
```

Applicator dry-run, Candidate 12B:

```sh
npm run structured-measurements:apply -- --refs gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_deterioration,gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_response,gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_deterioration,gpt_case_gap_2026_06_11_case_tls_01/baseline_exhibit,gpt_case_gap_2026_06_11_case_tls_01/stage1_exhibit EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12B-2026-07-09.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: gpt-canonical.json (5 exhibit refs)
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

After content review, Claude Code can apply Candidate 12A with:

```sh
npm run structured-measurements:apply -- --write --refs gpt_case_gallstone_pancreatitis_01/stage_2_update,gpt_case_gallstone_pancreatitis_01/stage_3_update,gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_deterioration,gpt_case_gap_2026_06_11_case_adrenal_crisis_04/adrenal_response,gpt_case_gap_2026_06_11_case_aki_02/aki_initial EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12A-2026-07-09.json
```

After content review, Claude Code can apply Candidate 12B with:

```sh
npm run structured-measurements:apply -- --write --refs gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_deterioration,gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_response,gpt_case_gap_2026_06_11_case_pancreatitis_03/panc_deterioration,gpt_case_gap_2026_06_11_case_tls_01/baseline_exhibit,gpt_case_gap_2026_06_11_case_tls_01/stage1_exhibit EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-12B-2026-07-09.json
```

Then rerun the mechanical suite, regenerate census after any bank write, update the promotion ledger, and commit from the gate seat.
