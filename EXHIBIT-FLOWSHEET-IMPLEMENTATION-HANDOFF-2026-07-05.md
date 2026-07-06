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
  - Total allowlist-hit panels: 336 after de-duping repeated exhibit refs and adding ABG completeness
    patterns
  - `clean_kv`: 2
  - `prose_embedded`: 149
  - `scattered`: 152
  - `serial`: 33
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
  - 100% checker-seat adjudication found no selection errors or re-dispositions, making Batch 11 clean
    scattered batch 1 of 2, documented in
    `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-11-ADJUDICATION-2026-07-05.md`.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-12-scattered-2026-07-05.json`
  - 20 records from the third `scattered` manifest slice.
  - Gate result: 0 FAIL, 32 WARN after producer re-extraction.
  - Batch 12 does not count clean: adjudication found a confirmed WBC/Hct omission in two gallstone
    records, and the same-value dual-modality HR escalation resolved to `extract` for clozapine
    `day18_assessment`. The ramp counter resets to 0. Queue and resolution documented in
    `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-12-ADJUDICATION-2026-07-05.md`.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-13-scattered-2026-07-05.json`
  - 20 records from the fourth `scattered` manifest slice.
  - Gate result: 0 FAIL, 38 WARN after PaO2 re-extraction.
  - Batch 13 does not count clean: adjudication found an omitted in-scope `pao2=68 mmHg` in
    `gpt_case_major_burn_inhalation_fluid_creep_01/baseline_labs`. Codex re-extracted the value and
    added ABG completeness-pattern coverage, documented in
    `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-13-ADJUDICATION-2026-07-05.md`.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-14-scattered-2026-07-06.json`
  - 20 records from the first uncovered refreshed-`scattered` slice after the ABG manifest refresh.
  - Gate result: 0 FAIL, 27 WARN.
  - 100% checker-seat adjudication found no selection errors or re-dispositions, making Batch 14 clean
    scattered batch 1 of 2 for the fresh post-PaO2-fix ramp.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-15-scattered-2026-07-06.json`
  - 20 records from the next uncovered refreshed-`scattered` slice.
  - Gate result: 0 FAIL, 16 WARN.
  - 100% checker-seat adjudication found no selection errors or re-dispositions, making Batch 15 clean
    scattered batch 2 of 2 and closing the fresh post-PaO2-fix ramp.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-16-scattered-2026-07-06.json`
  - 20 records from the first tapered refreshed-`scattered` slice after the Batch 14-15 clean ramp.
  - Gate result: 0 FAIL, 9 WARN.
  - Tapered checker queue prepared in
    `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-16-ADJUDICATION-2026-07-06.md`: 18 of 20 records (25% seeded
    random + always-sampled risk surfaces).
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-17-scattered-2026-07-06.json`
  - 17 records from the final uncovered refreshed-`scattered` slice.
  - Gate result: 0 FAIL, 27 WARN.
  - 17-record checker-seat adjudication found no selection errors or re-dispositions, closing the
    refreshed `scattered` bucket at 152/152 covered.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-18-prose_embedded-2026-07-06.json`
  - 6 records from the final refreshed `prose_embedded` tail created by the ABG completeness-pattern
    refresh.
  - Gate result: 0 FAIL, 2 WARN.
  - 6-record checker-seat adjudication found no selection errors or re-dispositions, closing the
    refreshed `prose_embedded` bucket at 149/149 covered.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-19-serial-2026-07-06.json`
  - 28 records from the final refreshed `serial` tail.
  - Gate result: 0 FAIL, 0 WARN.
  - 28-record checker-seat adjudication found 14 confirmed misclassifications, so this batch does not
    count clean and does not close `serial`.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-20-serial-redo-2026-07-06.json`
  - Redo of the same 28 refreshed `serial` tail refs after the Batch 19 miss.
  - Gate result: 0 FAIL, 32 WARN.
  - 28-record checker-seat adjudication (Antigravity Claude, 2026-07-06) found no selection errors or
    re-dispositions, closing `serial`. Dispositions are 14 true `skip_serial`, 10 real current-panel
    extracts, and 4 intentionally empty extracts.
- `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md`
  - Tracks staged artifacts and adjudication status through Batch 20.

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

Update after prose closeout: Batches 07-09 adjudicated clean, closing the then-current-manifest
`prose_embedded` bucket at 145/145 with zero selection errors. The later ABG completeness-pattern
refresh regenerated the manifest to 149 `prose_embedded` refs, leaving 6 refreshed prose refs uncovered
before final lane closure. Batch 10 starts the `scattered` bucket and intentionally returns to 100%
checker-seat adjudication for the first two clean batches before any new-bucket taper is considered.

Update after Batch 10 escalation: the paired severe-range BP confirmation in
`case_preeclampsia_magnesium_01/admission` is resolved as Rule D serial, and the staged artifact plus
`scripts/exhibit-flowsheet-stage-scattered-batch.ts` now emit a bare `skip_serial`. The gate now FAILs
duplicate current `panel[]` labels in `extract` records (Guard 1 from
`EXHIBIT-FLOWSHEET-CODEX-NOTE-serial-confirmatory-readings-2026-07-05.md`); Guard 2, the source-prose
current-reading-count WARN heuristic, remains queued.

Update after Batch 11 adjudication: the second `scattered` artifact covers manifest scattered panels
21-40, gates at 0 FAIL / 18 WARN, and adjudicated clean with no selection errors or re-dispositions.
It is clean scattered batch 1 of 2.

Update after Batch 12 adjudication/resolution: the third `scattered` artifact covers manifest
scattered panels 41-60 and gates at 0 FAIL / 32 WARN after producer re-extraction. Batch 12 does not
count clean because adjudication found the gallstone WBC/Hct omission; the clozapine same-value
vitals-HR/ECG-rate escalation resolved as not Rule D and the record now stages as `extract`. The
`scattered` ramp counter resets to 0; 60/160 scattered panels are staged and 100 remain.

Update after Batch 13 adjudication/resolution: the fourth `scattered` artifact gates at 0 FAIL / 38
WARN after adding omitted `pao2=68 mmHg`. It does not count clean; scattered needs a fresh 2-batch
clean streak starting after the PaO2 fix. After the ABG completeness-pattern refresh, the regenerated
manifest has 152 `scattered` refs; existing staged artifacts cover 75/152 and 77 remain uncovered.

Update after Batch 15 adjudication and Batch 16 staging: Batch 15 adjudicated clean with no selection
errors or re-dispositions, making it clean scattered batch 2 of 2 and closing the fresh post-PaO2-fix
ramp. Batch 16 is the first tapered scattered batch: it covers the next 20 refreshed `scattered` refs
and gates at 0 FAIL / 9 WARN, with an 18-record checker queue because the slice is risk-dense.
Refreshed scattered coverage is 135/152, with 17 uncovered. Batch 15 also added `/μL` as a
WBC/platelet source-unit alias after the aGVHD baseline labs used Greek-mu CBC units.

Update after Batch 16 adjudication and Batch 17 staging: Batch 16 adjudicated clean with no selection
errors or re-dispositions, so the tapered scattered lane held. Batch 17 covers the remaining 17
refreshed `scattered` refs and gates at 0 FAIL / 27 WARN. All 17 are queued for checker-seat review
because this is the final partial scattered closure batch and includes empty no-value/order records,
medication/protocol name collisions, refeeding trend restatements, prior-value exclusions,
`post_intervention` context, and HR `/min` prose-normalization candidates. Refreshed scattered
coverage is now 152/152, with 0 uncovered, pending Batch 17 adjudication. The refreshed
`prose_embedded` tail still has 6 uncovered refs and `serial` has 28 uncovered.

Update after Batch 17 adjudication and Batch 18 staging: Batch 17 adjudicated clean and closes
`scattered` at 152/152 covered. Batch 18 now stages the 6 refreshed `prose_embedded` tail refs and
gates at 0 FAIL / 2 WARN. All 6 are queued for checker-seat review, with attention to serum-chemistry
HCO3 being staged as `bicarbonate` rather than `hco3_abg`, an empty no-current-HR opioid background
record, a prior baseline-creatinine exclusion, and C. difficile recovery values tagged
`post_intervention`. Refreshed `prose_embedded` coverage is now 149/149, pending Batch 18
adjudication; only `serial` remains open at 5/33 covered, 28 uncovered.

Update after Batch 18 adjudication and Batch 19 staging: Batch 18 adjudicated clean and closes
`prose_embedded` at 149/149 covered. Batch 19 staged the remaining 28 refreshed `serial` refs as bare
`skip_serial` records and gated at 0 FAIL / 0 WARN, but 100% checker-seat adjudication found 14 of 28
records misclassified. Batch 19 does not count clean and does not close `serial`.

Update after Batch 19 adjudication and Batch 20 staging/adjudication: Batch 20 re-derives the same 28
serial-tail refs from source content rather than manifest membership. It gates at 0 FAIL / 32 WARN and
has a completed 28-record Antigravity Claude checker-seat adjudication with zero selection errors and
zero re-dispositions. The redo stages 14 true `skip_serial` preservation records, 10 real current-panel
extracts, and 4 intentionally empty extracts for multi-client/no-current-value surfaces. This closes
the `serial` lane by content-reviewed disposition. Non-blocking carry-forward note: the PE row source
says troponin I while the current allowlist label remains `troponin_t`, matching the existing
troponin-I-vs-T schema gap.

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
- Batch 12 staged gate: 20 records, 0 FAIL, 32 WARN after producer re-extraction
- Batch 13 staged gate: 20 records, 0 FAIL, 38 WARN
- Batch 14 staged gate: 20 records, 0 FAIL, 27 WARN
- Batch 15 staged gate: 20 records, 0 FAIL, 16 WARN
- Batch 16 staged gate: 20 records, 0 FAIL, 9 WARN
- Batch 17 staged gate: 17 records, 0 FAIL, 27 WARN
- Batch 18 staged gate: 6 records, 0 FAIL, 2 WARN
- Batch 19 staged gate: 28 records, 0 FAIL, 0 WARN
- Batch 20 staged gate: 28 records, 0 FAIL, 32 WARN
