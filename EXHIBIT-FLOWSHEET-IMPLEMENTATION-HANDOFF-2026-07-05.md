# Exhibit Flowsheet Implementation Handoff (2026-07-05)

Status: Step 1 implementation plus Claude's unit-policy adjudications are implemented. The first
conservative clean-KV staged artifact now gates clean and is ready as the proof batch. No canonical
banks or schema fields were written.

## Implemented

- Added pure registry definition modules:
  - `src/visuals/kinds/lab_trend/defs.ts`
  - `src/visuals/kinds/vitals_trend/defs.ts`
- Added `src/measurementAllowlist.ts`, derived from those defs, with frozen entries and
  `ALLOWLIST_KEYS`.
- Applied the refined unit policy in the lab registry defs: `wbc` and `platelets` keep canonical
  `×10³/µL`, accept source alternates `K/µL`, `/µL`, `/uL`, `/mcL`, `/mm³`, and `×10⁹/L`, and do not
  render raw-count notation as the primary trend unit.
- Added `mEq/L` as an accepted source alternate for `magnesium`, `calcium`, and `ionized_calcium`.
- Added `src/measurementUnitPolicy.ts` as the shared source for analyte-keyed conversion factors and
  first-pass display policy metadata. The gate imports conversion logic from this module instead of
  keeping a separate factor table.
- Refactored `scripts/exhibit-flowsheet-gate.ts` to import the shared allowlist instead of carrying a
  hand-mirrored registry table.
- Added calcium identity checks to the gate: explicit ionized/total markers must route to the matching
  key, and bare calcium only WARNs when the chosen key is out of normal band while the opposite calcium
  key would be in normal band.
- Added `scripts/tests/measurement-allowlist.ts` and `npm run test:measurement-allowlist`.
- Added `scripts/exhibit-flowsheet-manifest.ts` and `npm run flowsheet-manifest`.
- Added `CO2` / `CO₂` as a source synonym for serum `bicarbonate` in the gate/manifest label patterns.

## Generated Staged Artifacts

- `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
  - Total allowlist-hit panels: 337 after de-duping repeated exhibit refs
  - `clean_kv`: 2
  - `prose_embedded`: 145
  - `scattered`: 160
  - `serial`: 30
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-01-clean_kv-2026-07-05.json`
  - 2 records from the conservative `clean_kv` bucket.
  - Gate result: 0 FAIL, 0 WARN.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-02-prose_embedded-2026-07-05.json`
  - 20 records from the first `prose_embedded` manifest slice.
  - Gate result: 0 FAIL, 9 WARN after the source-unit-laundering gate fix.
  - WARNs are advisory no-value label mentions plus two nonstandard vital-unit prose candidates, listed in
    `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-02-ADJUDICATION-2026-07-05.md`.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-03-prose_embedded-2026-07-05.json`
  - 20 records from the second `prose_embedded` manifest slice.
  - Gate result: 0 FAIL, 6 WARN.
  - `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-03-ADJUDICATION-2026-07-05.md` is prepared for the required
    100% checker-seat adjudication.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-04-prose_embedded-2026-07-05.json`
  - 20 records from the third `prose_embedded` manifest slice.
  - Gate result: 0 FAIL, 13 WARN.
  - Because Batch 02 and Batch 03 both adjudicated clean, Batch 04 uses tapered sampling:
    5 seeded-random records plus always-sampled records, documented in
    `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-04-ADJUDICATION-2026-07-05.md`.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-05-prose_embedded-2026-07-05.json`
  - 20 records from the fourth `prose_embedded` manifest slice.
  - Gate result: 0 FAIL, 9 WARN.
  - Tapered checker queue: 10 records, documented in
    `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-05-ADJUDICATION-2026-07-05.md`.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-06-prose_embedded-2026-07-05.json`
  - 20 records from the fifth `prose_embedded` manifest slice.
  - Gate result: 0 FAIL, 9 WARN.
  - Tapered checker queue: 9 records, documented in
    `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-06-ADJUDICATION-2026-07-05.md`.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-07-prose_embedded-2026-07-05.json`
  - 20 records from the sixth `prose_embedded` manifest slice.
  - Gate result: 0 FAIL, 2 WARN.
  - Tapered checker queue: 9 records, documented in
    `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-07-ADJUDICATION-2026-07-05.md`.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-08-prose_embedded-2026-07-05.json`
  - 20 records from the seventh `prose_embedded` manifest slice.
  - Gate result: 0 FAIL, 9 WARN.
  - Tapered checker queue: 12 records, documented in
    `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-08-ADJUDICATION-2026-07-05.md`.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-09-prose_embedded-2026-07-05.json`
  - 5 records from the final current-manifest `prose_embedded` slice.
  - Gate result: 0 FAIL, 5 WARN.
  - Tapered checker queue: 3 records, documented in
    `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-09-ADJUDICATION-2026-07-05.md`.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-10-scattered-2026-07-05.json`
  - 20 records from the first `scattered` manifest slice.
  - Gate result: 0 FAIL, 13 WARN.
  - Because this starts a new higher-risk bucket, the checker queue resets to 100%, documented in
    `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-10-ADJUDICATION-2026-07-05.md`.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-11-scattered-2026-07-05.json`
  - 20 records from the second `scattered` manifest slice.
  - Gate result: 0 FAIL, 18 WARN.
  - Because Batch 10 did not count clean after the Rule D re-disposition, Batch 11 remains a 100%
    checker-seat queue, documented in
    `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-11-ADJUDICATION-2026-07-05.md`.
- `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md`
  - Tracks staged artifacts and adjudication status through Batch 11.

## Current Gate Result

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-01-clean_kv-2026-07-05.json
```

Result:

- `case_dka_01/ex_vitals_0800`: OK.
- `opus24_case_elder_neglect_med_mismanagement_01/home_visit_labs_returned`: OK; magnesium `1.4 mEq/L`
  is now keyed as `magnesium` with source unit preserved.

The earlier magnesium WARN is resolved by the refined unit policy. Extraction still preserves the
source unit byte-exact; conversion is used only by the gate/display policy layer.

## Decisions Resolved

- Retain strict `clean_kv` classification.
- Fix duplicate manifest refs, then proceed to the `prose_embedded` batch.
- Use conventional-first, source-permissive, analyte-aware unit policy:
  - canonical/display strings stay compact and U.S.-practice oriented;
  - extraction accepts real source reporting forms and preserves `sourceUnit`;
  - conversion factors are keyed by analyte plus source unit;
  - source prose normalization is a separate reviewed lane, not part of values-only extraction.

## Next Work

Proceed to the `prose_embedded` batch values-only. Do not mutate bank prose while doing that extraction
pass. Keep calcium total/ionized identity warnings in the adjudication loop, and defer actual prose
normalization to the reviewed manifest lane described in `EXHIBIT-FLOWSHEET-CLAUDE-HANDOFF-2026-07-05.md`.

Update after Claude green light: Batch 02 stages the first 20 `prose_embedded` records and has clean
100% independent Opus adjudication. It is the first of the two required clean full-adjudication
`prose_embedded` batches before tapering.

Batch 03 is now staged and gate-clean; it is the second required 100% `prose_embedded` batch and is
pending checker-seat adjudication.

Update after checker-seat review: Batch 03 adjudicated clean, so Batch 04 was staged with the tapered
sample protocol. Batch 04 also adjudicated clean, so Batches 05 and 06 were staged together while
staying at 20 records per artifact; their checker queues are pending independent adjudication.
After Batches 05 and 06 adjudicated clean, Batches 07-09 were staged to close the remaining
current-manifest `prose_embedded` panels (101-145). The repo manifest currently has 145
`prose_embedded` panels, not 217; if a newer count is expected, regenerate or replace
`EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json` before continuing.

Code-note closeout: Claude's Batch 04 advisory about the serial detector missing `hour N` narration
has been addressed in `scripts/exhibit-flowsheet-gate.ts`; the timestamp detector now recognizes
relative `hour N`, `day N`, and `N hours later/after` phrasing, and the HR label pattern no longer
counts lowercase duration/rate `hr` as heart rate. Regression assertions live in
`scripts/tests/exhibit-flowsheet-gate.ts`.
Additional detector fix: `SpO₂` with subscript `₂` now counts reliably in the serial detector; Batch
08's code-status `skip_serial` record mechanically re-confirms after this fix.

Update after prose closeout: Batches 07-09 adjudicated clean, closing the current-manifest
`prose_embedded` bucket at 145/145 with zero selection errors. Batch 10 starts the `scattered` bucket
and intentionally returns to 100% checker-seat adjudication for the first two clean batches before any
new-bucket taper is considered.

Update after Batch 10 escalation: the paired severe-range BP confirmation in
`case_preeclampsia_magnesium_01/admission` is resolved as Rule D serial, and the staged artifact plus
`scripts/exhibit-flowsheet-stage-scattered-batch.ts` now emit a bare `skip_serial`. The gate now FAILs
duplicate current `panel[]` labels in `extract` records (Guard 1 from
`EXHIBIT-FLOWSHEET-CODEX-NOTE-serial-confirmatory-readings-2026-07-05.md`); Guard 2, the source-prose
current-reading-count WARN heuristic, remains queued.

Update after Batch 11 staging: the second `scattered` artifact covers manifest scattered panels 21-40
and gates at 0 FAIL / 18 WARN. It is queued for 100% checker-seat adjudication because the Batch 10
Rule D re-disposition reset the `scattered` ramp counter to 0. If clean, Batch 11 becomes clean
scattered batch 1 of 2. After this artifact, 40/160 scattered panels are staged and 120 remain.

## Verification Run

- `npm run test:measurement-allowlist`
- `npm run test:flowsheet-gate`
- `npx tsc -b --pretty false`
- `npm run test-visuals`
- `npm run flowsheet-blind-score`
- `npm run validate-bank -- banks/*.json`
- `npm run build`
- Archived smoke gate: 6 records, 0 FAIL, 0 WARN
- Archived blind gate: 12 records, 0 FAIL, 0 WARN
- Clean-KV staged gate: 2 records, 0 FAIL, 0 WARN
- Batch 05 staged gate: 20 records, 0 FAIL, 9 WARN
- Batch 06 staged gate: 20 records, 0 FAIL, 9 WARN
- Batch 07 staged gate: 20 records, 0 FAIL, 2 WARN
- Batch 08 staged gate: 20 records, 0 FAIL, 9 WARN
- Batch 09 staged gate: 5 records, 0 FAIL, 5 WARN
- Batch 10 staged gate: 20 records, 0 FAIL, 13 WARN
- Batch 11 staged gate: 20 records, 0 FAIL, 18 WARN
