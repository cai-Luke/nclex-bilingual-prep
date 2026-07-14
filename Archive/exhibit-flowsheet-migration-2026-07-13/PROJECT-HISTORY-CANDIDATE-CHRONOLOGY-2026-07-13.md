# Structured-Measurement Candidate Chronology (archived from PROJECT-HISTORY.md, 2026-07-13)

This document preserves the batch-by-batch, candidate-by-candidate narrative that previously lived
inline in `PROJECT-HISTORY.md`'s Milestones and "Candidate next work" sections while the
structured-measurement flowsheet migration was open. The migration closed 2026-07-13 with no open
holds or flagged tag disputes; `PROJECT-HISTORY.md`'s Current status section and its condensed
milestone entries are the authoritative summary. This file is retained only so the reasoning behind
individual candidate/hold/re-disposition decisions (12G, 13H, 16E-THA, 17C-REFEEDING, the R9 fixes)
remains readable without restoring stale "no canonical bank write" / "held" / "prepared for review"
language to the live status surface.

See also `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md` (ledger of record), the per-batch staged
artifacts and adjudications in this directory, and the executable gate/applicator
(`scripts/exhibit-flowsheet-gate.ts`, `scripts/apply-structured-measurements.ts`), which own current
behavior.

---

## From "Structured Measurements Schema 1.8 Proof (Jul 7)"

Completed:
- Added schema `1.8` support for optional case-study exhibit `structuredMeasurements`, with typed `panels[]`, lab/vital panel-kind checks, same-panel `columnId` integrity, measurement allowlist/unit validation, values-only flag/range rejection, strict unknown-key recursion, and export-envelope version inference.
- Added structured-measurement-only allowlist entries for `troponin_i` and lab/ABG `sao2` without widening the `lab_trend`/`vitals_trend` key unions, and de-conflated the flowsheet gate so `SaO2` no longer matches `spo2` and bare troponin no longer maps to `troponin_t`.
- Corrected `sao2` panel classification to labs/ABG only and pinned the positive split with `spo2` in vitals plus `sao2` in labs.
- Added shared structured-measurement formatting/serialization/rendering: conventional-primary display with optional SI parentheses, TTS and review-prompt text serialization, and inline flat table rendering in case exhibits using existing deterministic table primitives.
- Added focused regression coverage: schema/floor/strict-key cases, measurement allowlist drift guard, flowsheet gate de-conflation cases, structured measurement formatter/serializer/SVG test.
- Added deterministic proof applicator `npm run structured-measurements:apply -- --proof <artifacts>` and promoted seven reviewed proof exhibits into canonical banks: both Batch 01 clean-KV records plus five simple Batch 02 supplement records. The first proof write deliberately keeps all original prose intact because the clean-KV records contain useful non-table facts outside v1 structured fields (for example oxygen delivery, respiratory character, eGFR, and non-allowlisted nutrition labs).
- Widened structured temperature source-unit acceptance to include Fahrenheit (`°F`/`F`) and bare `C`, matching existing conversion/display behavior and allowing the DKA proof record to preserve its source value/unit.
- Amended the migration ledger to distinguish staged artifacts from canonical structured-measurements promotions and recorded proof commit `959a5f0`.
- Changed structured temperature display to US-conventional Fahrenheit-first with Celsius in parentheses, and added explicit-ref applicator dry-run mode (`--refs`) for future promotion-gate batches.
- Prepared Candidate 02A for Claude Code gate review: five still-unpromoted Batch 02 supplement records, current-bank flowsheet gate `0 FAIL / 0 WARN`, applicator dry-run green, and no canonical bank write.
- Candidate 02A was promoted by Claude Code (`ab2b180`) and recorded in the migration ledger (`fc68fd2`) after a gate-seat fix for missing applicator bilingual labels. Prepared Candidate 02B for Claude Code gate review: three remaining safe Batch 02 supplement records routed to `gemini-canonical.json`, current-bank flowsheet gate `0 FAIL / 0 WARN`, applicator dry-run green, and no canonical bank write.
- Candidate 02B was promoted by Claude Code (`d19b1b4`) and recorded in the migration ledger (`77c596d`). Prepared Candidate 03A for Claude Code gate review: five safe Batch 03 supplement records routed to `gemini-canonical.json`/`gpt-canonical.json`, current-bank flowsheet gate `0 FAIL / 0 WARN`, applicator dry-run green, and no canonical bank write.
- Prepared Candidate 03B for Claude Code gate review: five additional safe Batch 03 supplement records routed to `gpt-canonical.json`/`hard-cases-canonical.json`, including two mixed vitals+ABG surfaces, current-bank flowsheet gate `0 FAIL / 0 WARN`, applicator dry-run green, and no canonical bank write.
- Corrected the deferred `cs_copd_01/labs` SaO2 extraction from `spo2` to `sao2` in Batch 02 source artifacts and prepared Candidate SAO2 for Claude Code gate review: one ABG/labs supplement record routed to `hard-cases-canonical.json`, current-bank flowsheet gate `0 FAIL / 0 WARN`, applicator dry-run green, and no canonical bank write.
- Prepared Candidate 04A for Claude Code gate review: five low-noise Batch 04 supplement records routed to `gpt-canonical.json`/`hard-cases-canonical.json`, with rows carrying `excludedValues`, empty/range panels, `skip_serial`, or WARN-only prose-normalization issues deferred; current-bank flowsheet gate `0 FAIL / 0 WARN`, applicator dry-run green, and no canonical bank write.
- Candidate 04A was promoted by Claude Code (`bace6b6`) and recorded in the migration ledger (`b9ba11e`). Prepared Candidate 04B for Claude Code gate review: five additional Batch 04 supplement records routed to `gpt-canonical.json`, including two adjudicated prior-creatinine exclusions and review notes for qualitative troponin, urine output, and urine WBC/hpf non-extractions; current-bank flowsheet gate `0 FAIL / 0 WARN`, applicator dry-run green, and no canonical bank write.
- Candidate 04B was promoted by Claude Code (`02c15f6`) and recorded in the migration ledger (`1f070f0`). Prepared Candidate 05A for Claude Code gate review: five sampled-clean Batch 05 supplement records routed to `gpt-canonical.json`/`hard-cases-canonical.json`, with empty panels, `excludedValues`, and HR `/min` WARN rows deferred; current-bank flowsheet gate `0 FAIL / 0 WARN`, applicator dry-run green, and no canonical bank write.
- Candidate 05A was promoted by Claude Code (`bd27eb2`) and recorded in the migration ledger (`a9c238b`). Prepared Candidate 05B for Claude Code gate review: five additional Batch 05 supplement records routed to `gpt-canonical.json`, including the CDI stage-1 lab triple prior/current split and two mixed CDI vitals+labs follow-up surfaces; current-bank flowsheet gate `0 FAIL / 0 WARN`, applicator dry-run green, and no canonical bank write.
- Candidate 05B was promoted by Claude Code (`744f869`) and recorded in the migration ledger (`7c894e4`). Prepared Candidate 06A for Claude Code gate review: five sampled-clean Batch 06 supplement records routed to `gpt-canonical.json`, including the TACO/TRALI BNP baseline split and two post-intervention context surfaces; current-bank flowsheet gate `0 FAIL / 0 WARN`, applicator dry-run green, and no canonical bank write.
- Prepared Candidate 06B for Claude Code gate review: five additional Batch 06 supplement records routed to `gpt-canonical.json`/`hard-cases-canonical.json`, excluding Candidate 06A refs and deferring empty, `skip_serial`, HR `/min` WARN, and larger variceal lab surfaces; current-bank flowsheet gate `0 FAIL / 0 WARN`, applicator dry-run green, and no canonical bank write.
- Prepared Candidate 07A for Claude Code gate review: five sampled-clean Batch 07 supplement records routed to `hard-cases-canonical.json`, deferring empty/excluded-only rows, HR `/min` WARN rows, and the warfarin-bridge INR restatement with a duplicate-display note; current-bank flowsheet gate `0 FAIL / 0 WARN`, applicator dry-run green, and no canonical bank write.
- Candidate 07A was promoted by Claude Code (`17162a1`) and recorded in the migration ledger (`03a66e1`). Prepared Candidates 07B and 08A for Claude Code gate review: 07B covers five simple Batch 07 supplement records routed to `gpt-canonical.json`; 08A covers five sampled/adjudicated Batch 08 supplement records routed to `claude-canonical.json`/`hard-cases-canonical.json`. Claude's column-label finding was accounted for by selecting title-local/current timestamp surfaces and documenting the vanco `0830` title-label vs `0730` trough-time decoy; scoped flowsheet gates `0 FAIL / 0 WARN`, applicator dry-runs green, and no canonical bank write.
- Candidates 07B/08A were promoted by Claude Code (`914139b`) and recorded in the migration ledger (`c33c28b`). Prepared Candidates 08B and 09A for Claude Code gate review: 08B covers five clean Batch 08 supplement records routed to `claude-canonical.json`; 09A covers two sampled-safe Batch 09 supplement records routed to `hard-cases-canonical.json`. The column-label sanity pass explicitly deferred two near-misses (`morning_assessment` with a `0300` decoy and TB `stage1_progress` with `2100`/`0530` sputum-collection decoys); scoped flowsheet gates `0 FAIL / 0 WARN`, applicator dry-runs green, and no canonical bank write.
- Candidates 08B/09A were promoted by Claude Code (`66785c8`) and recorded in the migration ledger (`56f3e0c`). Prepared Candidates 10A and 10B for Claude Code gate review: ten adjudicated-clean Batch 10 scattered supplement records routed across `hard-cases-canonical.json` and `gemini-canonical.json`, while `skip_serial`, empty/no-value, multi-victim, protocol-threshold, name-collision, and HR-unit WARN rows remain deferred; scoped flowsheet gates `0 FAIL / 0 WARN`, applicator dry-runs green, timestamp sanity labels clean, and no canonical bank write.
- Candidates 10A/10B were promoted by Claude Code (`ecb4649`) and recorded in the migration ledger (`e337583`). Prepared Candidates 11A and 11B for Claude Code gate review: ten Batch 11 scattered supplement records routed across `gemini-canonical.json`, `gpt-canonical.json`, and `hard-cases-canonical.json`; 11A gates `0 FAIL / 0 WARN`, while 11B intentionally carries `0 FAIL / 6 WARN` from adjudicated HR `/min` prose-normalization and IV-fluid sodium/chloride name-collision surfaces; applicator dry-runs green, timestamp sanity labels clean, and no canonical bank write.

Verified:
- `npm run test:schema-bank`
- `npm run test:measurement-allowlist`
- `npm run test:flowsheet-gate`
- `npm run test:structured-measurements`
- `npm run validate-bank -- banks/*.json`
- `npm run test:review-prompt`
- `npm run scan-unknown-keys` (0 off-schema key occurrences; generated report was not kept)
- `npm run census`
- `npm run test-visuals`
- `npm run coverage-report`
- `npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-20-serial-redo-2026-07-06.json` (0 FAIL / 34 WARN after `sao2` + `troponin_i` de-conflation)
- `npm run build`


---

## From "Exhibit Flowsheet Allowlist + Manifest (Jul 5)"

Completed:
- Implemented the shared measurement allowlist foundation from `measurement-allowlist-codex-spec.md`: pure lab/vitals registry defs, derived frozen `src/measurementAllowlist.ts`, CBC conventional-canonical/source-permissive policy (`wbc`/`platelets` canonical `×10³/µL`, source alternates `K/µL`, `/µL`, `/uL`, `/mcL`, `/mm³`, `×10⁹/L`), and a drift-guard test.
- Added `src/measurementUnitPolicy.ts` for analyte-keyed conversion factors and first-pass display policy metadata; magnesium, total calcium, and ionized calcium now accept source `mEq/L`.
- Refactored the exhibit-flowsheet gate to consume the shared allowlist/unit policy while keeping extraction-source concerns (`LABEL_PATTERNS`, implicit vital units, temp affine conversion) in the gate; added total-vs-ionized calcium identity checks.
- Added deterministic manifest tooling (`npm run flowsheet-manifest`) and generated `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`: 336 de-duplicated allowlist-hit panels after the ABG completeness-pattern refresh, with conservative buckets `clean_kv` 2, `prose_embedded` 149, `scattered` 152, `serial` 33.
- Produced the first conservative staged clean-KV artifact, `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-01-clean_kv-2026-07-05.json`, without canonical bank/schema/render writes.
- Added `EXHIBIT-FLOWSHEET-IMPLEMENTATION-HANDOFF-2026-07-05.md` for Luke/Claude decisions before widening the run: magnesium `mEq/L` disposition, clean-bucket strictness, and adjudication/prose-bucket go/no-go.
- Added `EXHIBIT-FLOWSHEET-CLAUDE-HANDOFF-2026-07-05.md` after Luke's initial decisions: keep strict clean-KV, fix duplicate manifest refs before prose, proceed next to `prose_embedded`, and investigate a unit-policy reversal toward conventional-first/SI-parenthetical display.
- After Claude's prose-bucket green light, staged `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-02-prose_embedded-2026-07-05.json` for the first 20 prose-embedded manifest panels and added `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-02-ADJUDICATION-2026-07-05.md` plus `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md`; no canonical bank/schema/render writes.
- Widened source-unit handling uncovered by the first prose batch: CBC count source units now accept ASCII `/mm3` alongside `/mm³`, PTT `sec` converts to canonical seconds, and unitless/ratio-style measurements such as pH/INR can pass Rule C without a literal unit token in source prose.
- Added the source-unit-laundering gate WARN requested by Claude review: conflicting explicit vital units such as `RR 24 bpm` or `HR 118/min` now remain passable but surface as prose-normalization candidates instead of silently passing through the implicit-unit path.
- Staged `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-03-prose_embedded-2026-07-05.json` for prose-embedded manifest panels 21-40 and prepared `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-03-ADJUDICATION-2026-07-05.md`; no canonical bank/schema/render writes.
- After Batch 03 adjudicated clean in the checker seat, staged `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-04-prose_embedded-2026-07-05.json` for prose-embedded manifest panels 41-60 and prepared tapered-sample `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-04-ADJUDICATION-2026-07-05.md`; no canonical bank/schema/render writes.
- After Batch 04 adjudicated clean, staged two additional tapered `prose_embedded` artifacts without
  widening individual artifact size: Batch 05 covers manifest panels 61-80 with a 10-record checker
  queue, and Batch 06 covers panels 81-100 with a 9-record checker queue; no canonical
  bank/schema/render writes.
- After Batches 05 and 06 adjudicated clean, staged the remaining current-manifest `prose_embedded`
  panels: Batch 07 covers panels 101-120 with a 9-record checker queue, Batch 08 covers panels
  121-140 with a 12-record checker queue, and Batch 09 closes panels 141-145 with a 3-record checker
  queue; no canonical bank/schema/render writes.
- After Batches 07-09 adjudicated clean, marked the then-current `prose_embedded` bucket complete
  at 145/145 with zero selection errors and staged the first `scattered` ramp batch: Batch 10 covers
  scattered panels 1-20 and gates at 0 FAIL / 13 WARN. The later ABG completeness-pattern refresh
  regenerated the manifest to 149 `prose_embedded` refs, leaving 6 refreshed prose refs uncovered
  before final lane closure; no canonical bank/schema/render writes.
- Resolved the Batch 10 Rule D escalation: paired same-client current BP readings in
  `case_preeclampsia_magnesium_01/admission` are serial and now stage as bare `skip_serial`; the
  `scattered` ramp counter reset to 0. Added a gate hard FAIL for duplicate current `panel[]` labels
  in `extract` records, while leaving the source-prose current-reading-count WARN heuristic queued.
- Staged and adjudicated the second `scattered` ramp artifact: Batch 11 covers scattered panels 21-40,
  gates at 0 FAIL / 18 WARN, and adjudicated clean with no selection errors or re-dispositions. It is
  clean scattered batch 1 of 2.
- Staged and adjudicated the third `scattered` artifact: Batch 12 covers scattered panels 41-60 and
  gates at 0 FAIL / 32 WARN after producer re-extraction. It does not count clean because adjudication
  found a confirmed WBC/Hct omission in two gallstone records; the clozapine same-value vitals-HR/ECG
  rate escalation resolved as not Rule D and now stages as `extract`. The `scattered` ramp counter
  resets to 0; 100 of 160 scattered panels remain unstaged.
- Staged and re-extracted the fourth `scattered` artifact: Batch 13 covers 20 records and gates at
  0 FAIL / 38 WARN after adding omitted `pao2=68 mmHg` for
  `gpt_case_major_burn_inhalation_fluid_creep_01/baseline_labs`. Checker adjudication found that
  confirmed omission, so Batch 13 does **not** count clean; scattered needs a fresh 2-batch clean streak
  starting after the PaO2 fix. The ABG GATE 2 pattern refresh also regenerated the manifest to 152
  `scattered` refs; existing staged artifacts cover 75/152 refreshed scattered refs, with 77 uncovered.
- Closed the Batch 13 code-note by adding GATE 2 completeness patterns for `ph`, `paco2`, `pao2`, and
  `hco3_abg`, plus regression coverage that an omitted PaO2 now raises an advisory WARN.
- Staged the fifth `scattered` artifact: Batch 14 covers the first 20 uncovered refreshed-`scattered`
  refs after Batches 10-13 and gates at 0 FAIL / 27 WARN. 100% independent checker-seat adjudication
  (Claude, 2026-07-06) found zero confirmed selection errors and zero re-dispositions, making it clean
  scattered batch 1 of 2 for the fresh post-PaO2-fix ramp. Two non-blocking notes for Codex: `context:
  post_intervention` was applied inconsistently within one narrative window
  (`gpt_pph_2026_06_16_case_01/stage_2_update`), and the gate's `spo2` synonym pattern also matches
  `SaO2`, which could mask a future ABG/pulse-ox divergence in a later batch. Refreshed scattered
  coverage is now 95/152, with 57 uncovered.
- Staged the sixth `scattered` artifact: Batch 15 covers the next 20 uncovered refreshed-`scattered`
  refs and gates at 0 FAIL / 16 WARN. 100% independent checker-seat adjudication (Claude, 2026-07-06)
  found zero confirmed selection errors and zero re-dispositions, closing the fresh post-PaO2-fix
  2-batch clean streak (clean scattered batch 2 of 2). Future scattered batches may now taper from
  100% checker-seat sampling, per the `prose_embedded` precedent. This batch also exposed Greek-mu CBC
  units (`/μL`) in the aGVHD baseline labs, so WBC and platelets now accept `/μL` as a byte-exact
  source unit with conversion/test coverage. Refreshed scattered coverage is now 115/152, with 37
  uncovered.
- Staged the first tapered `scattered` artifact: Batch 16 covers the next 20 uncovered refreshed refs
  and gates at 0 FAIL / 9 WARN. Because this slice is risk-dense, the tapered checker queue is still
  18 of 20 records under the 25% seeded-random + always-sampled rule (`skip_serial`, `excludedValues`,
  `post_intervention`, unit aliases/CBC source units, and scalar-omitted range advisory). 100%
  independent checker-seat adjudication (Claude, 2026-07-06) of the sampled records found zero
  confirmed selection errors and zero re-dispositions, so it counts clean; the taper continues for
  future batches. Recorded one non-blocking content-semantics note: `measurementAllowlist` has only a
  single `troponin_t` key used for every troponin reference in the repo, though `opus_icit_case_01`
  states "troponin I" with its own normal cutoff — background for the already-deferred
  reference-range-verification decision, not a Batch 16 defect. Refreshed scattered coverage is now
  135/152, with 17 uncovered.
- Staged the final refreshed `scattered` closure artifact: Batch 17 covers the remaining 17 uncovered
  scattered refs and gates at 0 FAIL / 27 WARN. All 17 records were checker-seat adjudicated (Claude,
  2026-07-06) with zero confirmed selection errors and zero re-dispositions — this closes the
  `scattered` bucket at 152/152 covered, 0 uncovered. Confirmed correct: three refeeding-syndrome
  trend/prior exclusions across consecutive stage updates (including the subtle case where a restated
  phosphorus value serves only as protocol-trigger context, not a new measurement), three empty-panel
  order/history/care-plan exhibits, a CKD baseline-creatinine `prior` exclusion, and fetal heart tones
  correctly kept separate from maternal HR in the IPV prenatal case.
- Staged the refreshed `prose_embedded` closure artifact: Batch 18 covers the 6 prose refs left
  uncovered by the ABG completeness-pattern refresh and gates at 0 FAIL / 2 WARN. All 6 records were
  checker-seat adjudicated (Claude, 2026-07-06) with zero confirmed selection errors and zero
  re-dispositions — confirmed correct: serum-chemistry `Carbon Dioxide (HCO3)` correctly staged as
  `bicarbonate` rather than `hco3_abg` (no ABG context anywhere in the exhibit), the opioid
  background/order record correctly has no current HR/lab/vital value at all, the vancomycin case's
  baseline creatinine is correctly excluded as `prior` chronic-CKD history, and the C. difficile recovery
  update's `post_intervention` context is appropriate. This closes `prose_embedded` at 149/149 covered,
  0 uncovered. **Combined with Batch 17 closing `scattered` at 152/152, both the `prose_embedded` and
  `scattered` buckets are now fully covered.** `serial` remains the sole open bucket at 5/33 covered,
  28 uncovered.
- Staged the final refreshed `serial` closure artifact: Batch 19 covers the remaining 28 serial refs as
  bare `skip_serial` records and gates at 0 FAIL / 0 WARN. 100% checker-seat adjudication (Claude,
  2026-07-06) found **this batch does NOT count clean**: 14 of 28 records are confirmed misclassified.
  The bare `skip_serial` manifest bucket was never content-verified before this pass — the gate's
  "0 FAIL / 0 WARN" only re-confirmed the mechanical detector against its own earlier classification,
  not against source prose. Confirmed error categories: cross-client conflation in multi-client exhibits
  (3 records — different clients' readings counted as one repeated parameter; should get the
  already-established multi-client empty-panel treatment instead), protocol/order/medication-name text
  mistaken for a lab result (4 records, including a recurrence of the known SaO2/SpO2 synonym
  collision from Batch 14), explicit prior/baseline-vs-current pairs misread as ambiguous (2 records,
  the same `prior`-exclusion pattern established across earlier batches), a same-value restatement
  misread as a duplicate (1 record), and single-value records with no second reading at all (4 records,
  one of which — `gpt_case_warfarin_mvr_2026_06_11_01/stage_1_orders_response` — has zero current INR
  value anywhere and needs an empty panel, not extraction). The 14 confirmed-correct records include one
  good edge case (orthostatic vitals) that is legitimately un-flattenable for a different reason than
  temporal ambiguity. Recommend Codex re-derive all 28 dispositions using the same
  extraction/exclusion/multi-client logic already established for `scattered`/`prose_embedded`, rather
  than bulk-staging manifest membership as bare `skip_serial`. **The `serial` bucket is not closed**:
  raw manifest coverage (33/33) is not the same as verified-correct disposition; only 16/33 refreshed
  serial refs currently have a confirmed-correct disposition on record.
- Staged and adjudicated the Batch 20 serial redo artifact after the Batch 19 miss:
  `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-20-serial-redo-2026-07-06.json` re-derives the same 28 refs using
  content-aware source review rather than manifest membership. It gates at 0 FAIL / 32 WARN and 100%
  checker-seat adjudication (Antigravity Claude, 2026-07-06) found zero confirmed selection errors and
  zero re-dispositions. The redo stages 14 true `skip_serial` preservation records, 10 real
  current-panel extracts, and 4 intentionally empty extracts for multi-client/no-current-value surfaces.
  The WARNs were confirmed as mechanical false positives or review prompts around the same classes that
  caused Batch 19 to fail: cross-client repeated labels, protocol/order collisions, prior/baseline
  comparisons, same-value restatement, SaO2/SpO2 synonym overlap, and single-value/no-current-value
  records. Non-blocking content-semantics note: the pulmonary-embolism row source says troponin I while
  the current allowlist label remains `troponin_t`, matching the already-recorded troponin-I-vs-T schema
  gap. **Batch 20 closes `serial` by content-reviewed disposition.** With `scattered` and
  `prose_embedded` already closed, the refreshed exhibit-flowsheet values-only migration is now fully
  staged and adjudicated.
- Added a narrow pre-litigation audit addendum to
  `EXHIBIT-FLOWSHEET-NEXT-LANES-HANDOFF-2026-07-06.md` so the next schema-lane pass starts from the
  known blocker facts: exclude failed Batch 19 from promotion input, consume Batch 20 for serial redo,
  decide empty/skip canonical-vs-ledger handling, separate troponin I/T and SaO2/SpO2 decisions from
  rendering, distinguish source/canonical/display units, and freeze mixed-panel column semantics before
  implementing `structuredMeasurements`.
- Closed the Batch 04 code-note by widening the serial timestamp detector to recognize relative
  `hour N`, `day N`, and `N hours later/after` narration, while tightening the HR label pattern so
  lowercase duration/rate `hr` does not masquerade as heart rate; added regression coverage.
- Fixed another serial-detector edge found while staging Batch 08: Unicode `SpO₂` with subscript `₂`
  now counts as an SpO2 label for mechanical `skip_serial` re-confirmation.

Verification:
- `npm run test:measurement-allowlist` passed.
- `npm run test:flowsheet-gate` passed.
- `npx tsc -b --pretty false` passed.
- `npm run test-visuals` passed.
- `npm run flowsheet-blind-score` passed (12/12).
- `npm run validate-bank -- banks/*.json` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- Archived smoke and blind extraction artifacts still gate clean after the refactor (smoke 6 records 0 FAIL/0 WARN; blind 12 records 0 FAIL/0 WARN).
- The staged clean-KV batch gates with 0 FAIL / 0 WARN after keying magnesium `1.4 mEq/L` under the refined unit policy.
- The staged prose-embedded Batch 02 gates with 0 FAIL / 9 WARN after the source-unit-laundering gate fix; independent Opus adjudication found no selection errors, making it the first clean full-adjudication prose batch.
- The staged prose-embedded Batch 03 gates with 0 FAIL / 6 WARN and is pending the required 100% checker-seat adjudication.
- The staged prose-embedded Batch 04 gates with 0 FAIL / 13 WARN and adjudicated clean on its
  10-record tapered checker queue.
- The staged prose-embedded Batch 05 gates with 0 FAIL / 9 WARN and has a 10-record checker queue
  (5 seeded random + always-sampled).
- The staged prose-embedded Batch 06 gates with 0 FAIL / 9 WARN and has a 9-record checker queue
  (5 seeded random + always-sampled).
- The staged prose-embedded Batch 07 gates with 0 FAIL / 2 WARN and has a 9-record checker queue
  (5 seeded random + always-sampled).
- The staged prose-embedded Batch 08 gates with 0 FAIL / 9 WARN and has a 12-record checker queue
  (5 seeded random + always-sampled).
- The staged prose-embedded Batch 09 gates with 0 FAIL / 5 WARN and has a 3-record checker queue
  (2 seeded random + always-sampled for the final 5-record partial batch).
- The staged scattered Batch 10 gates with 0 FAIL / 13 WARN and has a 20-record checker queue
  (100% ramp reset for the first scattered batch).
- The staged scattered Batch 11 gates with 0 FAIL / 18 WARN and has a 20-record checker queue
  (100% ramp after the Batch 10 Rule D reset).
- The staged scattered Batch 12 gates with 0 FAIL / 32 WARN after producer re-extraction and has a
  completed 20-record checker queue; it does not count clean.
- The staged scattered Batch 13 gates with 0 FAIL / 38 WARN after PaO2 re-extraction; adjudication found
  one confirmed omission, so it does not count clean.
- The staged scattered Batch 14 gates with 0 FAIL / 27 WARN and has a completed 20-record checker
  queue; it counts clean (`EXHIBIT-FLOWSHEET-MIGRATION-BATCH-14-ADJUDICATION-2026-07-06.md`).
- The staged scattered Batch 15 gates with 0 FAIL / 16 WARN and has a completed 20-record checker
  queue; it counts clean and closes the fresh 2-batch streak
  (`EXHIBIT-FLOWSHEET-MIGRATION-BATCH-15-ADJUDICATION-2026-07-06.md`).
- The staged scattered Batch 16 gates with 0 FAIL / 9 WARN and has an 18-record tapered checker queue;
  it counts clean (`EXHIBIT-FLOWSHEET-MIGRATION-BATCH-16-ADJUDICATION-2026-07-06.md`).
- The staged scattered Batch 17 gates with 0 FAIL / 27 WARN and has a 17-record checker queue; it
  counts clean and closes the `scattered` bucket at 152/152 covered
  (`EXHIBIT-FLOWSHEET-MIGRATION-BATCH-17-ADJUDICATION-2026-07-06.md`).
- The staged prose-embedded Batch 18 gates with 0 FAIL / 2 WARN and has a 6-record checker queue; it
  counts clean and closes the `prose_embedded` bucket at 149/149 covered
  (`EXHIBIT-FLOWSHEET-MIGRATION-BATCH-18-ADJUDICATION-2026-07-06.md`).
- The staged serial Batch 19 gates with 0 FAIL / 0 WARN and has a 28-record checker queue; it does
  **not** count clean — 14 of 28 records are confirmed misclassified
  (`EXHIBIT-FLOWSHEET-MIGRATION-BATCH-19-ADJUDICATION-2026-07-06.md`).
- The staged serial-redo Batch 20 gates with 0 FAIL / 32 WARN and has a completed 28-record
  checker-seat adjudication; it counts clean and closes the `serial` bucket
  (`EXHIBIT-FLOWSHEET-MIGRATION-BATCH-20-ADJUDICATION-2026-07-06.md`).


---

## From "Candidate next work" (batch 12–20 closure narrative)


- Candidates 11A/11B were promoted by Claude Code (`91bcca2`) and recorded in the migration ledger (`02d7045`). Prepared and then patched Candidates 12A/12B after comparator and inferred-unit review: promotion-ready 12A now contains three GPT refs (`0 FAIL / 3 WARN`), promotion-ready 12B contains three GPT refs with `anticoag_deterioration`'s comparator ptt moved to `excludedValues` (`0 FAIL / 4 WARN`), gallstone and TLS rows moved to explicit HOLD re-extraction artifacts, applicator dry-runs green, and no canonical bank write. Troponin-I clozapine Batch 12 rows remain deliberately deferred for fresh `troponin_i` re-extraction under the current structured-only allowlist.
- Patched Candidates 13A/13B after Claude Code review: the original ten-record promotion framing is superseded, the three accepted refs remain in the 13A/13B candidate files, and the seven pediatric/refeeding/overdue-screening refs moved to explicit hold artifact `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-13H-HOLD-2026-07-10.json`. Added structured-measurement `population`, a hard flowsheet-gate check for `prior` exclusions without a same-key current value, and display fixes for significant trailing zeros, placeholder `(unitless)`/`(ratio)` units, and duplicate-scale CBC SI parentheses. No canonical bank write.
- Refined Rule F `post_intervention` semantics and re-dispositioned the 13H hold (2026-07-11). Litigated the Phase 2 post-intervention disposition against live disk: `gpt_case_refeeding_syndrome_tpn_01` stage-2 prose administers KCl / sodium phosphate / magnesium sulfate and adds sliding-scale insulin *before* the repeat draw, so the ruled split tags potassium/phosphate/magnesium/glucose `post_intervention` and leaves creatinine and the six vitals untagged in stages 2 and 3. Codex re-extracted the 13H hold to this split; architect checker-seat disposition PASS. Baseline prior-only exclusions re-adjudicated under the existing `prior_no_current` gate — 15 PACU labs with no current same-key value removed to out-of-scope-silent, glucose 156 retained as `prior` (trades 15 hard FAILs for ~15 advisory GATE 2 WARNs). Rule F operative test (directed-measurement-or-domain + temporal linkage; co-location insufficient) written to `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`; closeout recorded in `DECISIONS.md`. Separated Codex commits: origin-shaped `prior_no_current` regression (the 16-exclusion refeeding baseline) and the `comparator` enum doc/docstring reconciliation (gate `EXCLUSION_REASONS` already carries `comparator`; Schema 2.0 supersedes it with the typed `bound` field for new extraction). Verification: `npm run test:flowsheet-gate` passed; deterministic 13H gate moved from `17 FAIL / 8 WARN` to `2 FAIL / 23 WARN`. 13H remains a hold — the two pediatric-population failures remain; no canonical bank write.
- Dissolved 13H into three independently gated review candidates plus a dedicated refeeding-baseline hold (2026-07-11). PEDS authors source-supported `peds_child`/`peds_infant` and gates `0 FAIL / 1 WARN`; SCREENING retains vitals only and gates `0 FAIL / 4 WARN`; REFEEDING-FOLLOWUP preserves the ratified Rule F split and gates `0 FAIL / 4 WARN`. All three passed scoped applicator dry-runs with no write; every WARN is classified in `EXHIBIT-FLOWSHEET-13H-SPLIT-VERIFICATION-2026-07-11.md`. The baseline remains held for a deferred multi-column temporal-panel authoring lane. Completed the required comparator extension over Batch 01, supplement Batches 02–20, and holds 12G/12T/13H: zero comparator-bearing staged `value` hits, zero records need a new `bound`, and the one existing Batch 12 bound is already correct. The architect independently verified exact seven-ref coverage and all four traced transformations, corrected the deletion criterion from impossible byte identity to coverage-plus-traceability, repointed `DECISIONS.md`, and authorized deletion of the superseded original artifact. The four successors are now the only live 13H units. No canonical bank write.
- **Schema 2.0 promotion sweep, closed (2026-07-11).** With PR #23 (schema 2.0: `bound`, `population`, the pediatric detector, Phase 2/3 gate and display fixes) merged to `main`, Claude Code re-reviewed every staged/held candidate above against current code and promoted five of six: **12A/12B** (6 refs — `anticoag_deterioration`'s aPTT `>200 seconds` now lands as `bound: ">"` per Phase 1a, superseding the old v1 `excludedValues`/`reason: "comparator"` workaround), **13A/13B** (3 refs, the small accepted subset), the three actionable **13H successors** (PEDS/SCREENING/REFEEDING-FOLLOWUP, 6 refs — pediatric `population` verified subject-scoped against source prose, Rule F split verified intact post-write), and the **TLS hold** (2 refs, unblocked on `uric_acid` as predicted). `banks/gpt-canonical.json` is now `2.0`; `banks/hard-cases-canonical.json` stays `1.8` (no 2.0-only field in its one touched record). Every promotion independently re-ran the gate against current banks and traced every WARN to source prose rather than trusting prior notes — several were new false-positive pediatric-marker WARNs from the newly landed detector, all confirmed decoys (an object's age, a duration phrase, a family-history age). The **gallstone hold (12G) remains held**: the Phase 2 unitless-subclass/`inferredUnit` machinery is live, but the staged artifact was never re-extracted to use it, so `calcium`/`ionized_calcium` in `stage_2_update`/`stage_3_update` stay unkeyed against a six-analyte source sentence with no unit tokens — a producer-seat re-extraction call, documented in `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md` and the schema 2.0 spec's deferred note. The **refeeding baseline hold** also remains held (deferred multi-column temporal-panel lane, unchanged). Full mechanical suite (`tsc -b`, `validate-bank`, `scan-unknown-keys`, `test:structured-measurements`, `test:measurement-allowlist`, `test:flowsheet-gate`, `test:schema-bank`, `census`/`census:check`, `build`) green after every write.
- **`12G` (gallstone) closed (2026-07-12).** Codex re-derived a fresh 12G successor from source (not copied forward from the 2026-07-09 hold): all 17 keyed values verbatim, `calcium`/`ionized_calcium` correctly left unkeyed with visible unitless-subclass WARNs, and a genuine per-measurement Rule F re-derivation (Stage 2 gained 7 differentiated tags from 0; Stage 3 independently re-confirmed its prior all-tagged outcome via ERCP's explicit source-control framing). Independent Sonnet review caught and corrected one defect in the handoff's own evidence (a claimed "client is explicitly 45" that does not exist in source — the disposition was still correct, only the cited justification was wrong) before promoting. Separately, `DECISIONS.md` gained a 2026-07-12 amendment authorizing PR B's operation — asserting a standard analyte unit into previously unit-less exhibit prose is a distinct, narrowly-scoped operation from ordinary unit-reformatting, gated on owner pre-approval, the canonical `patch-raw --allow-canonical` path, and extraction-grade evidence discipline — under which the refeeding baseline's PACU lab sentence was patched bilingually (18 analyte-unit pairs, EN+ZH) and independently verified via a full leaf-level bank diff (exactly two paths changed, nothing else). `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md` and `BANK-REVIEW-LEDGER.md` are the ledgers of record.
- **Refeeding baseline closed — no open flowsheet holds remain (2026-07-12).** PR A's multi-column machinery plus PR B's unit-clarified source enabled the first real multi-column promotion: `gpt_case_refeeding_syndrome_tpn_01/baseline_record` now carries an implicit single-column vitals panel alongside a labs panel with two source-evidenced columns, `PACU (6 h prior)` and `Current`. All 23 keyed measurements verified byte-verbatim; the WARN's cited evidence (age 62, stated explicitly) checked out this time, unlike 12G's fabricated claim. This recovers the exact potassium/phosphate/magnesium/CBC/LFT data whose silent loss under a `prior`-exclusion-with-no-current-sibling was Principle 26's original forcing incident — those values are now real PACU-column rows rather than an `excludedValues` entry. Independent review also caught and fixed a regression: PR26's new applicator test hardcoded this exact ref as its fixture, so the promotion permanently tripped the applicator's double-application guard against that test; relocated the fixture to a currently-unpromoted exhibit with a comment flagging that the applicator has no isolated-bank override, so this class of collision can recur for whatever ref is chosen next.
- **Schema 2.0 documentation consolidation (2026-07-12).** Updated the canonical schema contract and current-status summary to `2.0`, split operational mechanics from constitutional agent guidance into `docs/AGENTS-RUNBOOK.md`, added decision-status conventions, and repointed Claude's operational references. Runtime field floors and the fresh census were verified directly before the docs changed.
- Prepared Candidate 14A for independent Claude/Sonnet gate review: four low-noise, still-unpromoted Batch 14 extracts routed to `gpt-canonical.json`; current gate `0 FAIL / 2 WARN` (one adult-child pediatric-marker decoy and one protocol glucose-range GATE 2 advisory), applicator dry-run green, and no canonical bank write. The full Batch 14 artifact is not promotion-ready under current semantics because `gpt_case_warfarin_mvr_2026_06_11_01/admission_record` now hard-fails `prior_no_current`; that record and other non-actionable or timestamp-ambiguous surfaces were excluded from 14A.
- **Batch 14 remainder + Batch 15 closed (2026-07-12).** Candidates 14B-14G (10 refs, 5 to `gpt-canonical.json`, 5 to `hard-cases-canonical.json`, correcting a handoff reporting slip that claimed 6/4) closed Batch 14 in full. Candidates 15A-15E (17 refs across `hard-cases-canonical.json`, `gemini-canonical.json`, and `claude-canonical.json`) closed Batch 15 in full, including an "ordered vs. administered" Rule F distinction in 15B and an explicit vasopressor-free HR/BP contrast against a tagged temp/RR/SpO2 cluster in 15E. Every candidate independently re-gated at 0 FAIL and content-reviewed against source before writing.
- **Batch 16 closed with one held candidate (2026-07-12).** Reviewed per an explicit GPT pre-handoff addendum (six review priorities, kept separate from candidate adjudication). Promoted 16A-ICIT, 16B-SCC, 16C-TPN-MUCOSITIS, 16D-BASELINES, 16F-OPIOID (16 refs). 16A's `troponin_i` analyte identity re-derived from literal source wording ("troponin I," never "troponin T") and each stage-3 tag verified individually. 16C independently confirmed Rule F is a temporal-placement test, not an outcome test — potassium/magnesium/creatinine/lactate stay tagged even though source explicitly calls them "still low despite replacement" or "rising," because the fluid bolus and electrolyte replacement were administered immediately before the reassessment. Held **16E-THA** (3 refs, not promoted): POD3's creatinine `post_intervention` tag borrows its causal language ("after hydration and adequate oral intake") from POD2's sentence, not its own — POD3's own source sentence is bare, matching POD1's correctly-untagged shape. Systemic/tooling findings (none candidate-blocking): the `/min`→`bpm` HR normalization is confirmed ratified policy, not a defect (`DECISIONS.md`'s structuredMeasurements section explicitly rejected byte-exact `sourceUnitText` storage — the literal token stays recoverable via `sourceSpan`); R9 pediatric-marker WARNs on duration phrases ("8 months ago," "14 months ago") continue to fire as designed and every instance this batch checked out against a genuinely-stated adult age, unlike the fabricated-age precedent caught in the 12G review; the ICIT stage-1 `skip_serial` exclusion (HR 104 vs. 106) is a known serial-heuristic gap, not a content defect. Full mechanical suite green before and after write.
- **Batch 17 closed, both tooling holds resolved (2026-07-13).** PR32 merged as a bounded, no-canonical-write staging/adjudication artifact after an independent PASS/BLOCK verdict on all four candidates (17A-CDIFF, 17B-ELDER-NEGLECT, 17C-REFEEDING, 17D-BASELINES); a separate PR33 landed the two tooling fixes the addendum's holds required; a third promotion PR wrote all fourteen refs (17A-D's eleven plus the two restaged holds) to canonical banks. 17B's sodium/creatinine/HR-BP/RR-SpO2 tags were adjudicated individually per instruction rather than approved as one panel — each traces to independent evidence (NS bolus explicitly ordered for documented hypotension; SpO2 co-located with an administered nasal-cannula device). 17C's stage-60 phosphate tag was verified not to borrow a merely-ordered (never confirmed administered), differently-thresholded IV replacement backward from a later sentence. **R9 fix:** case-wide `context` text (spanning every exhibit/stage/question stem in a case) now hard-triggers pediatric subject-scoping only on explicit patient/client identity evidence; the staged exhibit's own local text keeps the full detector. This resolved the prenatal hold (`opus27_case_ipv_prenatal_care_01/ex2_initial_assessment`, restaged with `population: "adult"`) without adding kinship/anaphora-tracking machinery, per architect ruling. **Exhibit-id uniqueness fix:** `validateCaseStudy` now shares one duplicate-tracking set across a case's top-level `exhibits` array and every stage, instead of a fresh set per array. This resolved the IV-potassium hold and, on the first global re-scan, surfaced two more canonical cases with the identical byte-for-byte duplication shape (`gpt_case_opus5_cdi_immunocompromised_01`, `gpt_r1_regen_case_celiac_01`) — all three deduped, content verified byte-identical and unpromoted in every removed copy. The duplication was also an exam-facing spoiler bug independent of the flowsheet tooling gap (`CaseChartPane` renders the top-level `exhibits` array unconditionally from case start, ahead of the stage gate the duplicate content was meant to sit behind), confirmed by direct code-path trace since no browser tool was available this session to verify interactively. Removing the duplicates left three cases with an empty top-level `exhibits` array, so the schema's "at least one exhibit" floor was relaxed to "at least one exhibit somewhere, top-level or staged." The flowsheet gate also gained its own duplicate-identity hard FAIL so a gate PASS can no longer ship a ref the applicator's unweakened exact-one-match fail-safe then rejects. `16E-THA` remained the only open flowsheet hold at this point (closed separately below). Full mechanical suite green before and after write.
- **`16E-THA` closed (2026-07-13).** Architect ruling: Rule F carries no automatic carry-forward across stages — a measurement earns `post_intervention` only when its own record, or unambiguous sequencing directly governing that record, establishes a directed intervention preceded it; a prior stage's attribution does not persist merely because the treatment may still be ongoing (`DECISIONS.md`). Applied to the original dispute: `pod3_update`'s creatinine `post_intervention` tag is removed (its own sourceSpan carries no causal language; the "after hydration and adequate oral intake" attribution lives only in `pod2_update`'s sentence, a different record); `pod2_update`'s tag is unchanged. Gate re-run independently: `0 FAIL / 0 WARN` across all three refs. Also corrected the migration ledger's prior Batch 17 row, which had mislabeled these unrelated `17H` prenatal/IV-potassium successors as "16E-successor-class" — `16E-THA` was always the separate three-ref hold closed here. **Flagged the same question for `17C-REFEEDING`'s already-promoted `stage_60h_update` phosphate tag** (resolved separately below). Full mechanical suite green before and after write.
- **`17C-REFEEDING` stage-60 phosphate tag corrected (2026-07-13).** Owner ruling on the question flagged above: pull the tag — no operative distinction from the corrected `16E-THA` POD3 tag. Stage 36 independently establishes administration before its own reading (unchanged, still tagged); Stage 60's own text carries only a new, merely-*ordered* IV replacement whose stated threshold doesn't match its own value, and no explicit or unambiguous connection to the earlier administration. **Refined Rule F boundary (owner-stated, `DECISIONS.md`):** an earlier record may establish administration, but the later record must explicitly or unambiguously connect its own measurement to that intervention ("after," "following," "while receiving," "on [active device/infusion]," or an equivalent reassessment frame) — mere stage chronology, clinical plausibility, or the absence of a discontinuation statement is insufficient. Narrow single-field correction applied directly to the already-promoted canonical value (the applicator's double-application guard blocks re-supplementing an already-populated exhibit); `git diff` confirmed exactly one field touched. Gate re-run on the corrected disposition: `0 FAIL / 1 WARN`. This closes the open question in full — no open flowsheet holds or flagged tag disputes remain. Full mechanical suite green before and after write.
- **Batch 18 closed (2026-07-13) — the `prose_embedded` lane's closure tail, in full.** Reviewed per `EXHIBIT-FLOWSHEET-CODEX-TO-CLAUDECODE-BATCH-18-2026-07-13.md`; both candidates independently gated (18A 0/3, 18B 0/0, exact match) and content-reviewed before writing. 18A's pyloric-stenosis `population: "peds_infant"` verified against the case stem despite the age living only in case-wide context; bicarbonate/HCO3 identity re-derived from the "Serum Chemistries" exhibit framing (no ABG context, so `bicarbonate` not `hco3_abg`); celiac's R9 WARN confirmed a genuine duration-not-age false positive. 18B's burn SpO2 tag is a textbook same-record device-framing match for the refined Rule F boundary ("on the non-rebreather"), with an explicit column correctly dodging four decoy clock times in its own exhibit text; C. difficile's follow-up record correctly carries zero Rule F tags under the no-carry-forward rule. **Non-blocking tooling finding at Batch 18 close:** the R9 age-marker regex did not recognize `weeks?` as a unit, so a genuinely pediatric case stated only in weeks, only in case-wide context, with `population` left unset, could WARN instead of hard-FAIL. The separately reviewed week-unit fix recorded immediately below closed this finding. Full mechanical suite green across all four refs.
- **R9 week-unit fix landed, Batch 20 closed (2026-07-13) — the authoritative serial-lane redo, in full.** Codex implemented the flagged R9 gap against a Claude-authored bounded spec (`r9-age-marker-week-unit-codex-spec.md`): a week-scaled age threshold (not a raw comparison against the years threshold) and a male/female subject-noun modifier, in both English and Chinese, plus an additional fix beyond the spec closing a related possessive-adjacency gap ("the client's 6-week-old infant"). Verified the diff matches the spec exactly, all required regression fixtures present and purely additive, nothing pre-existing touched. Reviewed per `EXHIBIT-FLOWSHEET-CODEX-TO-CLAUDECODE-BATCH-20-2026-07-13.md`; all five candidates independently gated (20A 0/5, 20B 0/4, 20C 0/3, 20D 0/3, 20E 0/3, exact match) and content-reviewed before writing. 20C's pulmonary-embolism record required individually adjudicating five repeat vitals/labs rather than approving them as one cluster — all five trace to an explicit same-record reassessment frame ("Repeat vital signs at 0930" following a documented bolus ten minutes earlier) or device framing ("on non-rebreather"), and `troponin_i`/`sao2`-vs-`spo2`/`hco3_abg`-vs-`bicarbonate` identities were each re-derived from literal source wording. 20D's lithium-toxicity HR/BP tag was the closest call in the batch (same-record but no explicit "after"/"while receiving" phrase; resolved PASS on a likely-still-active 1-hour infusion reading, flagged explicitly rather than approved quietly) and 20E's postop SBAR record is a clean Rule F negative control (source explicitly states no new order or intervention occurred, confirming zero tags). Full mechanical suite green across all ten refs, including `npm run audit` (GATE PASSED). No open flowsheet holds remain.
- **R9 day-age extension landed (2026-07-13).** Implemented the separately approved work order (`r9-age-marker-day-unit-codex-spec.md`) without widening the existing optional-`old` years/months/weeks expression: English day ages require explicit `old` and capture four digits; Chinese accepts `日龄`, `天龄`, and `天大/天大的`; both apply the exclusive `age < 6570` boundary and reuse existing subject/kinship scoping. Final architect review added explicit Chinese `6569日龄`/`6570日龄` threshold fixtures before merge. Full data-contract verification and the Promotion Gate passed; no bank, ledger, or census content changed.
