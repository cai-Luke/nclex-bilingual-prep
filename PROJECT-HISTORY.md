# Project History

This is the living status record for Project Shrimp / NCLEX Bilingual Prep. Update it whenever a meaningful implementation pass lands, verification changes, or the active scope moves.

## Coding-agent orientation

This file is the living **status map** — *what currently exists*. For *how to work* (project coordinates, implementation notes, the bank/visual workflow, and commands) see `AGENTS.md`; for *why* the architecture is the way it is see `DECISIONS.md`; the schema source of truth is `NCLEX-Question-Schema.md`. On conflict, the current-status facts in this file and `NCLEX-Question-Schema.md` override older prose anywhere.

Codex is the implementation agent for code changes. Other LLMs may generate or review question content, but they should not be treated as owners of app architecture.

## Current status

The app is a static offline Vite + React + TypeScript NCLEX-RN practice tool. It builds with bundled question banks, supports importing/exporting JSON banks, and does not require a runtime API or server after build.

Core learning features are implemented: all schema item types render and grade, case studies are supported, sessions are resumable, custom sessions can be built from filters, the dashboard summarizes performance, flags feed review pools, glossary flashcards have their own SRS progress, and adaptive exam-condition practice is available without any pass/fail readiness claim.

Current canonical banks and their roles. Per-file counts and schema versions are generated, not hand-maintained here — see [BANK-CENSUS.md](BANK-CENSUS.md)'s Per-File Summary table for current numbers:

- `banks/burn-canonical.json` — burn-map visual items
- `banks/capnography-canonical.json` — capnography visual items; dedicated home for the capnography kind
- `banks/claude-canonical.json` — bilingual Claude/Opus-source questions; ledgered content review complete
- `banks/device-canonical.json` — device-screen visual items
- `banks/gemini-canonical.json` — bilingual Gemini-source questions; includes original + pending batches + traditional/easy/gap-fill/format-backfill/standalone NGN consolidations minus redundant/flawed questions
- `banks/gpt-canonical.json` — bilingual GPT-source questions incl. the promoted Candidates 12A/12B/13A/13B/13H-successors/TLS-hold; ledgered content review complete
- `banks/hard-cases-canonical.json` — top-level hard/NGN items; ledgered content review complete
- `banks/io-canonical.json` — intake/output record visual items
- `banks/lab-canonical.json` — lab_trend visual items; dedicated home for the lab_trend kind
- `banks/mar-canonical.json` — mar visual items
- `banks/medlabel-canonical.json` — medication-label visual items
- `banks/visual-canonical.json` — reviewed rhythm/EKG items; carries pacer-overlay `rhythm_strip` items; the dedicated home for the rhythm_strip kind, formerly `banks/rhythm-canonical`
- `banks/vitals-canonical.json` — vitals-trend visual items; dedicated home for the vitals_trend kind

Current schema version is `2.0` (`bound` and structured-measurement `population`, PR #23, merged 2026-07-11) — also generated per-bank in `BANK-CENSUS.md`. `NCLEX-Question-Schema.md` owns the complete feature-floor ladder; this file does not restate it.

The refeeding-syndrome case's named PACU baseline panel now carries owner-approved conventional
units in both learner-facing locales. The deterministic canonical patch changed only the two
`baseline_record.content` locale strings; its exact manifest and independent-review evidence are
committed. No structured measurements were authored by that edit.

Batch 20, the authoritative serial redo, is staged as five bounded candidates (`20A`-`20E`): all
ten actionable refs gate at 0 FAIL and pass explicit-ref applicator dry-runs. Failed Batch 19 is
excluded in full. The other eighteen Batch 20 refs remain intentionally non-rendering (fourteen
genuine same-client serial/preservation records plus four empty, multi-client, or no-current-value
records). The PE slice corrects troponin identity, preserves distinct SaO2/SpO2 measurements, and
isolates its five measurement-level Rule F dispositions for independent review. No canonical write
has occurred.

PR A's staging-layer multi-column machinery is merged: the
flowsheet gate enforces the ratified G1-G8 explicit-column invariants, and the applicator preserves
authored bilingual columns plus per-value `columnId` while leaving the legacy inferred single-column
path unchanged. Focused coverage includes mixed explicit-labs/implicit-vitals records, sparse rows,
historical-only columns, every hard invariant, canonical-preview parity, and legacy output. This
implementation did not change canonical schema, renderers, banks, or census. **The refeeding-baseline
successor is promoted (2026-07-12), closing the last open flowsheet hold.** Current vitals stayed on
the implicit single-column path; labs authored two source-evidenced columns (`PACU (6 h prior)`,
`Current`). This recovered the potassium/phosphate/magnesium/CBC/LFT data that Principle 26's
forcing incident had flagged as silently dropped by a prior-only exclusion with no current sibling —
those 16 values are now real PACU-column rows instead of an `excludedValues` entry. Independent
review caught and fixed one regression in the process: PR26's new applicator test hardcoded this
exact exhibit ref as its fixture, so the promotion permanently broke it via the double-application
guard; the fixture was relocated to a different currently-unpromoted exhibit with a comment flagging
the coupling risk, since the applicator has no isolated-bank override.

Batch 14 is promoted and closed: Candidate 14A plus successors `14B`-`14G` added all fourteen
actionable refs under the current gate/applicator contract. Six other Batch 14 dispositions remain
intentionally non-rendering (`skip_serial`, empty narrative, or stale exclusion-only).

Batch 15 is promoted and closed: all seventeen actionable refs across five bounded candidates
(`15A`-`15E`) landed, each independently re-gated at 0 FAIL before writing. Three genuine
differing-current-value records remain intentionally non-rendering `skip_serial` dispositions.

Batch 16 is promoted and closed in full: nineteen of nineteen staged refs across candidates
`16A`-`16F` landed, each independently re-gated at 0 FAIL before writing (16A's `troponin_i`
analyte identity and stage-3 Rule F cluster verified individually rather than approved as a group;
16C's Rule F tags on worsening/unchanged potassium, magnesium, creatinine, and lactate confirmed
correct under the ratified directed-intervention-plus-temporal-linkage test, which does not require
the intervention to have succeeded). `16E-THA`'s original disputed tag — POD3's creatinine carrying
a `post_intervention` tag whose causal language ("after hydration and adequate oral intake") appears
only in POD2's own sentence, not POD3's — was resolved under the ratified rule that Rule F carries no
automatic carry-forward across stages; the corrected successor promotes cleanly (0 FAIL / 0 WARN).

Batch 17 is promoted and closed, along with both of its tooling holds: fourteen refs landed —
eleven across candidates `17A`-`17D`, plus a prenatal `population: "adult"` restage and two
IV-potassium refs unblocked by a pair of tooling fixes. The R9 pediatric detector now scores
case-wide `context` text (which spans every exhibit, stage, and question stem in a case) more
strictly than the staged exhibit's own local text — case-wide text hard-triggers only on explicit
patient/client identity evidence, not the loose bare-noun heuristic that previously misread a
different exhibit's anaphoric reference to a related person as the measurement subject. Separately,
`validateCaseStudy` now tracks exhibit-id uniqueness with one set shared across the whole case
instead of a fresh set per array, which surfaced and fixed byte-for-byte exhibit duplication (a
stage's content copied into the top-level array — also an exam-facing spoiler risk, since the
top-level array renders unconditionally ahead of the stage gate) in three canonical cases, not just
the one originally flagged. `17C-REFEEDING`'s already-promoted `stage_60h_update` phosphate tag was
also corrected under the same Rule F no-carry-forward ruling that closed `16E-THA`: its
"never stated as discontinued" justification was owner-ruled automatic carry-forward and the tag
was pulled (stage-36 phosphate's own-record tag is unaffected). Rule F's boundary is now refined
(`DECISIONS.md`): an earlier record may establish administration, but a later record must explicitly
or unambiguously connect its own measurement to that intervention — mere stage chronology, clinical
plausibility, or the absence of a discontinuation statement no longer suffices. No open flowsheet
holds or flagged tag disputes remain.

Batch 18 is promoted and closed in full: all four actionable refs across candidates `18A`-`18B`
landed, each independently re-gated at 0 FAIL before writing. This closes the entire
`prose_embedded` lane's original closure tail. A burn SpO2 tag is a textbook match for the
refined Rule F boundary ("on the non-rebreather," explicit same-record device framing), and a
C. difficile follow-up record correctly carries zero Rule F tags under the no-carry-forward rule.
Tracing a WARN in this batch surfaced a real (non-blocking) gap in the R9 context-provenance fix:
the age-marker regex doesn't recognize `weeks?` as a unit, so a genuinely pediatric case stated
only in weeks, only in case-wide context, with population left unset, could currently WARN rather
than hard-FAIL — flagged as a follow-up, not yet fixed.

Current schema item types:

- `multiple_choice`
- `select_all`
- `ordered_response`
- `fill_in_blank`
- `matrix`
- `dropdown_cloze`
- `highlight`
- `bowtie`
- `case_study`

The committed NGN item-type set is complete. Rationale/dyad scoring and an explicit linked “X as evidenced by Y” type remain out of scope.

## Milestones

> Milestones dated **2026-06-23 and earlier** are archived in [`Archive/PROJECT-HISTORY-ARCHIVE.md`](Archive/PROJECT-HISTORY-ARCHIVE.md). Only the current arc (2026-06-24 onward) is kept here.

### Intake/Output Trend Visual Schema 1.9 (Jul 9)

Completed:
- Added the `io_trend` visual lane at schema `1.9`: serial interval intake/output bars, optional cumulative-net overlay, derived table, strict validation, and self-checks for visual justification, collapse test, interval/cumulative/final net arithmetic, trend assertions, and adjacent sign crossovers.
- Added shared `renderDivergingBars` and reused the shared measured document-table primitive so the composite SVG height is deterministic. `io_record` remains byte-pinned through pre-refactor SVG hashes after the shared `measureDocTable` extraction.
- Kept the implementation narrow: no app-renderer special casing, no canonical bank/routing change, no `fill_in_blank` placement for `io_trend`, and no changes to the existing pacer/rationale schema-floor behavior outside the new `collectAllVisuals` use for `io_trend`.

Verified:
- `npm run test-visuals`
- `npm run validate-bank -- banks/*.json`
- `npm run census`
- `npm run census:check`
- `npx tsc -b --pretty false`
- `npm run build`

### Default Session Mode Repoint + Translate-All Fix-Up (Jul 9)

Completed:
- Repointed the home splash's recommended zero-configuration session from `mode: "test"` to `mode: "study"`, keeping the NCLEX-weighted `{ count, weighting: "nclex" }` draw. Copy moved to `Start practice · N questions` / `Practice · N questions`. `mode: "test"` is retained, unchanged, reachable from the custom session builder. Identifiers (`onTest`, `testCount`) deliberately not renamed.
- The repoint restores three instruments on the learner's primary path: the language tabs open on `on-tap` (saved preference) instead of EN-only, the Vocab Rescue "Missed because of the English" toggle appears on missed items, and reveal telemetry records. Because `isTranslationRevealEligible` is `study && on-tap`, the previous default path was excluded from the entire translation-friction analytic.
- Translate-all Part A: deleted the dead `Boolean(revealTrackingContext)` clause from `showTranslateAll` (the memo never returns `null`); extended `hasQuestionLevelZh` to fall through to rationale/strategy/glossary Chinese (`hasExplanationZh`) by converting the per-item-type terminal returns into `if (...) return true` guards; threaded `sessionId` / `sessionMode` / `onTranslationReveal` to `QuestionCard` for every live session mode; added optional `sessionMode` / `languageModeAtReveal` to `TranslationRevealEvent` (additive, no `DB_VERSION` bump).
- Translate-all Part B: added `buildChoiceMarkerMap`, replacing the raw `choice.refId` fallback that leaked internal ids (`c_valid_dnr_arrest`, `p_last_meal`) to the learner on every item type without `options` — bowtie, matrix, dropdown_cloze, highlight, fill_in_blank. Markers are zone-scoped for bowtie (`S1`/`A2`/`P3`), dropdown-level `D{n}` per the schema's `byChoice.refId → dropdownId` contract, `R{n}` for matrix rows, `H{n}` over selectable highlight segments only, `B{n}` for blanks. An unresolved refId now renders **no marker** and the rationale spans the full row; a raw id is never displayed.
- Fixed the `.choice-rationales` grid: `2rem` was sized for a single letter, so a long refId overflowed column 1 and painted on top of the rationale text. Now `minmax(2rem, max-content) minmax(0, 1fr)` with `overflow-wrap: anywhere`, a `.no-marker` single-column variant, and the dead `grid-row: span 2` rule removed.
- Bowtie post-submit no longer renders `.bowtie-token-pool` at all (conditional render, not CSS hiding), removing the disabled duplicate tokens from the DOM and the tab order; slots and the `bowtie-key` list remain.

Notes:
- Known scope correction: threading the recorder through every live mode is currently a **no-op**. Both `test` and `adaptive` force `languageMode: "off"` at session creation, and no reveal can fire in `off`. See the `DECISIONS.md` correction under *Default recommended session is Study, not Test*.
- Process: the Part B branch was pushed directly to `origin/main` rather than merged through the architect gate, and carried an unrelated structured-measurements commit with it. Nothing was lost (fast-forward), but branch protection on `main` is warranted before the next large batch lane.
- Still open: the case-part GPT rescue action renders *above* its part rationale, inverting the standalone order ratified in this pass.

Verified:
- `npm run test:translation-telemetry` (incl. new adaptive-ineligibility case)
- `npx tsc -b --pretty false`
- `npm run build`
- Browser smoke: clean `S1`–`P4` bowtie markers, no raw refId leaks, no overlapping text, token pool absent from the DOM post-submit.

### Translate-All Post-Submit Reveal (Jul 8)

Completed:
- Added a post-submit `Show full Chinese / 显示完整中文` action above the rationale, with GPT rescue moved below the rationale in the standalone answer flow.
- Added a reveal-all context signal so `BilingualText`, highlight, and dropdown-cloze reveal consumers can silently open remaining on-tap Chinese text without emitting per-block telemetry.
- Added aggregate `fullQuestionReveal` telemetry, a developer-panel full-reveal count, and summary/friction regression coverage that keeps aggregate post-submit reveals out of per-block and pre-submit friction buckets.
- Follow-up scope correction: decoupled the reveal-all UI broadcast from telemetry availability so review/preview contexts can still reveal Chinese without recording, extended the post-submit control to rendered case-study surfaces when Chinese text is present, kept aggregate full reveals out of `revealedBlocks`, and gave the button a subdued display-toggle style.

Verified:
- `npm run test:translation-telemetry`
- `npx tsc -b --pretty false`
- `npm run build` (passed with the expected Vite chunk-size warning)
- Browser smoke on local Vite study session: Tap ZH post-submit order is answer banner → language-miss action → translate-all → rationale → GPT rescue; one translate-all click hides the button and reveals rationale Chinese.
- Browser smoke on local production preview after follow-up: a case-study Summary/review surface now shows translate-all; one click hides the button, removes all per-block `需要中文` buttons on the rendered surface, and reveals Chinese text without requiring telemetry.

### Structured Measurements Schema 1.8 Proof (Jul 7)

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

### Exhibit Flowsheet Allowlist + Manifest (Jul 5)

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

### Root Markdown Cleanup (Jul 3)

Completed:
- Archived completed root reports/specs into `Archive/root-cleanup-2026-07-03/`: adversarial audit findings from Jun 24/25, the split-screen feasibility investigation, the Vocab Rescue Phase 1 walkthrough, and the implemented Translation Telemetry V1.2b spec.
- Kept live root guidance and active/reusable prompts in place, including `bowtie-highlight-topup-batch-spec.md` and the generation prompts.
- Added the Claude-authored `case-footer-and-option-marker-codex-spec.md` to version control, then archived it under `Archive/root-cleanup-2026-07-04/` after the active UI polish pass closed.

Verification:
- `rg` reference scan updated current root/history/ledger/audit pointers to the archived paths.

### GPT Evergreen Generation Prompt (Jul 3)

Completed:
- Added `gpt-evergreen-generation-prompt.md` as a reusable maintenance-mode content-generation handoff for spare GPT usage.
- Scoped the prompt to self-target against the committed census, exclude visual/case-study/pediatric-burn lanes, and output raw `gpt-` prefixed batches for the existing review and promotion pipeline.
- Revised the prompt after initial litigation with fail-closed repo access, flexible topic-fit format selection, matrix-specific quality floors, non-under-served format justification, and timestamped batch/file IDs for same-day parallel chats.
- Promoted the first 6-item evergreen smoke batch (`gpt-2026-07-03-1344-t1.json`) into `banks/gpt-canonical.json` after Claude Architect review and one ordered-response semantic remediation; `gpt-canonical.json` moved 534→540.

Verification:
- `npm run normalize-raw-bank -- banks/banks-raw/gpt-2026-07-03-1344-t1.json` reported 0 structural changes after remediation.
- `npm run validate-bank -- banks/banks-raw/gpt-2026-07-03-1344-t1.json` passed.
- `npm run promote`, `npm run audit`, `npm run consolidate -- --dry-run`, and `npm run consolidate` passed.
- `npm run census` regenerated `census.json` and `BANK-CENSUS.md`.

### Case Footer + Option Marker UI Polish (Jul 2)

Completed:
- Replaced raw option-id display in MC/SATA option rows, option audio labels, and option-mapped per-choice rationales with stable A/B/C/D markers while preserving raw `refId` fallback for non-option rationale entries.
- Moved the split case-study part navigator and "Submit all parts" control out of the top of the work pane into a desktop sticky footer rendered after the active part content.
- Added desktop-only footer flex styling with full case-content width, compact wrapping at narrower desktop widths, and a mobile safety override that leaves <=820px behavior static.
- Added a deploy quality gate to `.github/workflows/pages.yml`: the Pages build job now runs `npx tsc -b --pretty false` and `npm run validate-bank -- banks/*.json` before `npm run build`, so direct pushes to `main` cannot deploy type errors or invalid bank JSON (Vite's esbuild build transpiles without typechecking; the PR promotion gate does not cover direct pushes).

Verification:
- `npx tsc -b --pretty false` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- Browser smoke in Preview Lab passed at 1280x800, 1000x800, and 800x800: desktop footer pinned full-width at bottom, chart and active question were visible together with no toolbar between them, option markers/audio labels/rationale labels used A-D with no raw `opt_*` leak, and mobile stacked mode remained footer-free.

### GPT Visual Content Prompt Split (Jul 2)

Completed:
- Split the archived combined U1/U2 visual content-generation spec into two standalone GPT-chat handoff prompts:
  - `GPT-CAPNOGRAPHY-CONTENT-GENERATION-PROMPT.md`
  - `GPT-VITALS-TREND-CONTENT-GENERATION-PROMPT.md`
- Kept the archived source spec intact while updating the split prompts against the current schema/version, visual placement rules, raw-bank workflow, and live `capnography` / `vitals_trend` renderer contracts.
- Made each prompt self-contained for external chat use, with duplicated shared safeguards for visual necessity, bilingual parity, audit-only metadata, raw staging, downloadable JSON output, and a turn-labeled smoke → follow-up batch workflow.

### GPT Rescue Prompt (Jul 2)

Completed:
- Replaced the Summary batch GPT review export with single-question / single-case-part rescue prompts for missed or partially correct items.
- Added a prominent learner-facing rescue action on live post-submit missed-item surfaces, with the same shared clipboard/fallback component used quietly inside expanded Summary missed-item review blocks.
- Kept the rescue affordance explicitly injected from learner Study/Summary call sites, so Preview Lab and Developer Review do not inherit GPT buttons from shared rationale rendering.
- Updated prompt generation to include learner answer, correct answer, EN/ZH stem and rationale, glossary terms, case title/summary, global exhibits, visible-stage exhibits, and structured visual JSON with recursive `meta`/`selfCheck` stripping.
- Removed the top-level Summary "Copy review prompt" action; Summary now offers GPT rescue only per expanded missed item.

Verification:
- `npm run test:review-prompt` passed.
- `npx tsc -b --pretty false` passed.
- `npm run build` passed with the existing Vite chunk-size warning.

### Bucket 1B Rhythm-Strip Closeout (Jul 2)

Completed:
- `gpt_deepen_2026_06_22_bow_12` adjudicated by Claude: stem narrates "frequent premature ventricular contractions," but both dropdown answers resolve without it — `action` (a1: notify provider, prepare K+ replacement) follows from symptomatic hypokalemia (K 2.9, cramps, weakness) alone, and `parameter` (p1: serum potassium + cardiac rhythm) is justified in the rationale by hypokalemia's general dysrhythmia risk, not the observed PVCs specifically. Converting to a `rhythm_strip` visual with a trimmed stem would leave both blanks unchanged — decorative under Principle 6. Confirmed keep-as-text, same disposition as `gemini_backfill_or_cardio_01` and `gemini_c10_07`. Closes the three-item deferral opened in "Rhythm Strip Bucket 1B Conversions (Jul 1)." No canonical bank content changed.
- Archived implemented root specs and handoff notes into `Archive/root-cleanup-2026-07-02/`, leaving `translation-telemetry-v1-2-correctness-join-audit-candidates-spec.md` at root as the active Task 1 spec until implementation closeout. The spec was archived after implementation closeout in `Archive/root-cleanup-2026-07-03/`.

### Rhythm Strip Placement Widening (Jul 1)

Completed:
- Implemented `rhythm_strip` item-type placement widening from `rhythm-strip-item-type-placement-widening-codex-spec.md`, resolving the deferred placement-policy question from the pacemaker-overlay addendum without converting any content.
- Added `ordered_response` and `dropdown_cloze` to `rhythm_strip`'s explicit `allowedItemTypes` override; left `fill_in_blank` unsupported.
- Updated `NCLEX-Question-Schema.md` to document the new `rhythm_strip` placements and the pre-existing `lab_trend` placement override.
- Extended the generic visual conformance test to exercise each registered kind's declared placements, and updated the rhythm-strip visual-parity placement fixture to use still-unsupported `fill_in_blank`.
- No canonical bank files changed.

Verification:
- `npx tsc -b --pretty false` passed.
- `npm run test-visuals` passed.
- `npm run validate-bank -- banks/*.json` passed with the same canonical bank set and counts.
- `npm run build` passed with the existing Vite chunk-size warning.

### Translation Telemetry V1.2b Correctness Join (Jul 2)

Completed:
- Implemented the V1.2b analytic correctness join from `Archive/root-cleanup-2026-07-03/translation-telemetry-v1-2-correctness-join-audit-candidates-spec.md` without adding learner-facing UI, sampler weighting, or new instrumentation.
- Completed discovery against `src/storage.ts`, `src/types.ts`, `src/grading.ts`, and the `submitCurrent` path: V1.2a persists `sessionId`, `sessionMode`, and `languageModeAtAnswer`; on-demand reveal is `"on-tap"`; case-part joins use the same embedded part id for `CaseAnswerPartEvent.partId` and `TranslationRevealEvent.partId`; standalone joins use `sessionId + questionId`.
- Added pure `summarizeTranslationFriction` support for eligible attempt buckets, pre-submit reveal aggregation, deterministic revealed-block ordering, part-level case-study audit candidates, fade trend rows, unresolved-current-bank handling, and join diagnostics.
- Added a normalization adapter that excludes legacy answer rows and top-level case-study `AnswerEvent` rows before the pure summary, carrying both exclusion counts into diagnostics.
- Extended the existing dev-only translation telemetry panel with a joined JSON export while keeping the existing raw reveal export.

Verification:
- `npm run test:translation-telemetry` passed.
- `npx tsc -b --pretty false` passed.
- `npm run build` passed with the existing Vite chunk-size warning.

### Translation Telemetry V1.2a Attempt History (Jul 1)

Completed:
- Added durable attempt context for future translation-friction joins: `AnswerEvent` now records `sessionId`, `sessionMode`, and `languageModeAtAnswer` for newly submitted answers while remaining backward-compatible with older rows.
- Added a new local `caseAnswerPartEvents` IndexedDB store plus in-memory fallback, record/load helpers, and a DB version bump for part-level case-study correctness.
- Wrote case-part correctness events only from the canonical `submitCurrent` submission path, leaving render/display grading in `CasePartNavigator` and `CaseActivePart` read-only.
- Confirmed V1.2a discovery: `submitCurrent` is the canonical persisted answer path, `"on-tap"` is the reveal-eligible `LanguageMode`, study language mode can change mid-session, and existing `AnswerEvent` consumers only use the stream for dashboard trend history.

Verification:
- `npm run test:translation-telemetry` passed.
- `npx tsc -b --pretty false` passed.
- `npm run build` passed with the existing Vite chunk-size warning.

### Pacemaker / Bucket 1B Closeout — Content Review Flags Resolved (Jul 1)

Completed:
- Pacemaker arc end-to-end closed: Spec E (Phases 0–3 + Bucket 1B) → Gemini flag-only review → Claude Code final review + meta-assessment → two Principle 6 flags resolved by Luke.
- **Stroke case `baseline_assessment` exhibit (`hard-cases-canonical.json`):** rewrote `q1` matrix row `r5` from "Irregularly irregular heart rhythm with atrial fibrillation history" to "Cardiac rhythm pattern on the baseline telemetry strip" — makes the AFib strip load-bearing; correct mapping (`r5 → c1`) and rationale unchanged.
- **ADHF case `ed_assessment` exhibit (`hard-cases-canonical.json`):** removed the decorative `rhythm_strip` visual added by Bucket 1B; restored verbatim original content (`Heart Rate: 128 beats/minute, irregularly irregular` / `心率：128次/分钟，不规则且不规律`) recovered from git history at commit `b32e14f`.
- Census: `rhythm_strip` visuals 161 → 160 (one decorative strip removed).

Verification:
- `npm run validate-bank -- banks/hard-cases-canonical.json` passed (66 questions).
- `npm run test-visuals` passed (all 11 kind renderers + conformance + parity + session sampler).
- `npm run audit` GATE PASSED (existing advisory non-MCQ distribution warnings unchanged).
- `npm run census` → 1,665 top-level / 721 embedded / 160 visuals.
- `npm run build` green.

### Rhythm Strip Bucket 1B Conversions (Jul 1)

Completed:
- Converted the four placement-clean narration-debt targets from the pacemaker overlay spec: `opus26_case_refeeding_syndrome_01_q3`, `opus26_case_refeeding_syndrome_01_q5`, `cs_adhf_pulm_edema_01/ed_assessment`, and `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/baseline_assessment`.
- Kept the edits as manual canonical patches because the targets are existing case-study entries or embedded leaves, which cannot be safely staged through append-only consolidation.
- Deferred `gemini_backfill_or_cardio_01`, `gpt_deepen_2026_06_22_bow_12`, and `gemini_c10_07` pending a separate `rhythm_strip` item-type placement-policy decision.
- Added render-audit artifacts under `audit/rhythm-strip-bucket-1b-conversions-2026-07-01/`.

Verification:
- `npm run validate-bank -- banks/claude-canonical.json banks/hard-cases-canonical.json` passed after the canonical patch.
- Visual inspection of `audit/rhythm-strip-bucket-1b-conversions-2026-07-01/rendered/contact-sheet.png` confirmed all four rhythm strips are readable.

### Rhythm Strip Pacemaker Overlay Phase 3 Backfill (Jul 1)

Completed:
- Added schema `1.7` support and live bank-level validation requiring `meta.schemaVersion >= 1.7` for pacer-bearing `rhythm_strip` visuals.
- Retired text-only pacemaker items `ekg_b5_mc_04`, `ekg_b5_mc_05`, and `ekg_b5_matrix_10` from `banks/visual-canonical.json`.
- Promoted and consolidated three new load-bearing rhythm-strip replacements: `ekg_pacer_failure_to_capture_2026_07_01`, `ekg_pacer_failure_to_sense_2026_07_01`, and `ekg_pacer_failure_to_pace_2026_07_01`.
- Bumped `banks/visual-canonical.json` from schema `1.2` to `1.7` while keeping its count at 53 after the retire/replace cycle.
- Added ledger and render-audit artifacts under `audit/rhythm-strip-pacemaker-backfill-2026-07-01/`.

Verification:
- `npm run validate-bank -- banks/visual-canonical.json banks/banks-raw/visual-pacemaker-overlay-2026-07-01.json` passed before consolidation.
- `npm run promote` staged the 3 replacement items.
- `npm run audit` passed before consolidation with the raw and promoted artifacts present; only the existing advisory non-MCQ distribution warning remained.
- `npm run consolidate -- --dry-run` reported `50 + 3 = 53`, then `npm run consolidate` merged the replacements.
- Visual inspection of `audit/rhythm-strip-pacemaker-backfill-2026-07-01/rendered/contact-sheet.png` confirmed the pacer cues are readable.

### Rhythm Strip Pacemaker Overlay Phase 2 Smoke (Jul 1)

Completed:
- Added an audit-only pacemaker smoke bank under `audit/rhythm-strip-pacemaker-smoke-2026-07-01/` covering capture, failure to capture, failure to sense, and failure to pace.
- Rendered each smoke fixture to SVG and PNG, plus a stacked contact sheet for quick visual review.
- Confirmed the smoke fixtures remain outside bundled top-level banks and are not promoted study content.

Verification:
- `npm run validate-bank -- audit/rhythm-strip-pacemaker-smoke-2026-07-01/smoke-bank.json` passed.
- `npx tsx scripts/tests/rhythm-strip.ts` passed.
- Visual inspection of `audit/rhythm-strip-pacemaker-smoke-2026-07-01/rendered/contact-sheet.png` confirmed the pacer cues are readable.

### Rhythm Strip Pacemaker Overlay Phase 1 (Jul 1)

Completed:
- Added ventricular pacemaker overlay support to `rhythm_strip` visuals without adding new rhythm-class enums.
- Split intrinsic rhythm generation from pacer-aware render beat composition, with a shared render context so AFib RNG timing stays identical between rendering and `selfCheck`.
- Added sampled pacer spike rendering, captured paced QRS synthesis, pacer structural validation, and pacer-only `selfCheck` assertions for capture, failure to capture, failure to pace, and failure to sense.
- Updated strict visual-key allowlists and the schema documentation for the new optional `pacer` contract.
- Kept Phase 1 code-only: no canonical bank items, raw bank drafts, pacer smoke items, or Bucket 1B content conversions were edited.

Verification:
- `npx tsc -b --pretty false` passed.
- `npx tsx scripts/tests/rhythm-strip.ts` passed with pacer validation/self-check coverage and existing 14-rhythm render coverage.
- `npm run test-visuals` passed.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run audit` passed with the existing insufficient raw-draft integrity note and advisory non-MCQ distribution warning.
- `npm run build` passed with the existing Vite chunk-size warning.

### Translation Telemetry V1.1 (Jul 1)

Completed:
- Added a dev-gated Translation telemetry panel behind the existing hidden dev-tools flag, making locally recorded reveal-tap history visible without surfacing anything in the learner UI.
- Added pure translation telemetry aggregation in `src/translationTelemetry.ts` for totals, distinct sessions, earliest/latest reveal timestamps, deterministic block/category/topic grouping, finite elapsed-time averages, before-submit shares, blank-topic fallback, and top-15 topic capping.
- Added raw JSON export with an `exportFormatVersion` envelope so local reveal events can be analyzed outside the app without overloading bank `schemaVersion` semantics.
- Added dedicated telemetry row styling instead of reusing `.category-breakdown`, avoiding selector bleed from the existing descendant selector.

Verification:
- `npm run test:translation-telemetry` passed.
- `npx tsc -b --pretty false` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- Browser smoke confirmed the Telemetry nav and panel render behind `?dev=1`, a clean-origin non-dev page shows only learner navigation, and the export control is present and click-safe with no console errors; the browser automation surface did not expose a Blob download event for direct file verification.

### Summary GPT Review Prompt (Jul 1)

Completed:
- Added a Summary "Copy review prompt" action that assembles missed non-visual leaf items into a Chinese-first Markdown prompt for external GPT review, with no in-app AI call or network dependency.
- Extracted the shared `formatItemType` helper into `src/itemTypes.ts` so both `App.tsx` and the new pure `src/reviewPrompt.ts` can use it without a module cycle.
- The prompt includes learner answer state, correct answer markers, targeted per-choice rationales for MC/SATA, full rationale context for other item types, dropdown cloze sentences, highlight passages, glossary practice terms, and case parent context when available.
- Visual-dependent misses are conservatively excluded from full detail blocks and surfaced as pointer lines when either the leaf has its own visual or the parent case has exhibit/stage visuals.
- Added a clipboard fallback textarea for contexts where `navigator.clipboard.writeText` is unavailable.

Verification:
- `npm run test:review-prompt` passed.
- `npx tsc -b --pretty false` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- Browser smoke loaded the local Vite app successfully; the available browser session resumed into an unfinished case study, so Summary-specific UI was covered by build and prompt tests rather than a forced multi-part browser completion.

### Targeted Review V1 (Jul 1)

Completed:
- Replaced Summary "Practice related" pool construction with a pure `buildTargetedReviewPool` sampler in `src/sessionSampler.ts`.
- Targeted review now scores missed-topic/category/item-type/NGN signals, flags, prior incorrect history, unseen status, and mastered streaks; it uses the same topic/visual-kind diversity dampening pattern as the weighted study sampler.
- Case studies are excluded from targeted-review output while top-level missed case-study topic/category/NGN signals still contribute to standalone remediation.
- Direct retry is eligible for just-missed standalone questions, but each targeted-review pool is still selected without replacement so no question ID can appear twice in one session.
- Extracted `buildSessionState` into `src/sessionState.ts` and routed plain Study/Test and Adaptive session construction through it.
- Seeded Summary targeted-review generation from stable `session.id` so the memoized related pool is deterministic across renders and includes flags in its dependencies.

Verification:
- `npx tsc -b --pretty false` passed.
- `npx tsx scripts/tests/session-sampler.ts` passed with targeted-review scoring, case-study exclusion, direct retry, no-duplicate, fallback, determinism, and session-state shape coverage.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run build` passed with the existing Vite chunk-size warning.

### Stabilization Verification Pass (Jun 30)

Completed:
- Ran the combined post-feature automated stabilization suite requested by `stabilization-verification-pass-2026-06-30-codex-spec.md`.
- Confirmed browser/rendering capability was available and started manual smoke against the local Vite app at `1440x900`.
- Added [`STABILIZATION-VERIFICATION-HANDOFF-2026-06-30.md`](STABILIZATION-VERIFICATION-HANDOFF-2026-06-30.md) for architect follow-up.
- Verified the architect-side patch changing the visible split case-study aggregate submit copy to `Submit all parts`.
- Reran browser smoke after the patch and confirmed the checklist passed, with a browser-tooling note that direct IndexedDB reads were unavailable and learner-visible Home counters were used as the fallback progress-write check.

Verification:
- `npx tsc -b --pretty false` passed.
- `npm run test:exam-layout` passed.
- `npm run test:session-navigation` passed.
- `npm run test:grading` passed.
- `npm run test:highlight` passed.
- `npm run test:bowtie` passed.
- `npm run test:case-completeness` passed.
- `npm run test-visuals` passed.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run audit` passed with the existing advisory non-MCQ distribution warning and `audit:integrity` insufficient because no raw drafts were present.
- `npm run census:check` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- First browser smoke stopped without Codex app patching because the live case-study aggregate submit button visibly read `Submit case study`, while the stabilization checklist asked to confirm `Submit all parts`.
- Rerun browser smoke passed after the architect-side copy patch: lab and I/O split, MAR full-width, case-study chart-over-work, Summary/Developer Review stacked review behavior, Preview Lab live/review/mobile modes, mobile stacked fallback, on-tap reveal click isolation, and case-study part-switch toolbar/counter behavior were verified.

### Exam Shell Width and Split Density (Jun 30)

Completed:
- Widened the live Session and Preview Lab `main` shell to a 1400px cap while leaving Home, Builder, Dashboard, Flashcards, Library, Import, Settings, Summary, and Developer Review on the existing site-wide width.
- Reinstated `io_record` in the standalone visual split allowlist through `src/examLayout.ts`, kept `mar` excluded, and derived Preview Lab split buckets from the same allowlist to avoid label drift.
- Compacted the `io_record` SVG table geometry from a 600-unit viewBox to a 420-unit viewBox with shorter rows so I/O records remain readable in the desktop split pane without changing shared table primitives or MAR geometry.
- Changed live case-study split layout from side-by-side panes to a horizontal chart-over-work layout, with the chart pane capped and independently scrollable and the work pane in normal page flow.
- Preserved case-study part navigation and aggregate submit behavior by offsetting the sticky case toolbar and switching part-change scroll reset to the normal-flow work pane.

Verification:
- `npx tsc -b --pretty false` passed.
- `npm run test:exam-layout` passed.
- `npm run test-visuals` passed.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- Browser smoke in Preview Lab at a 1440x900 desktop viewport confirmed Home and Settings stayed at the existing 1120px shell, Preview Lab used the widened shell, `io_record` rendered in the standalone split pane with a 420-unit SVG viewBox, `mar` remained full-width, `lab_trend` still used the standalone split, case studies rendered chart-over-work with the chart pane capped and independently scrollable, and case part switching scrolled the work pane back under the sticky header offset.

### Translation Reveal Default and Telemetry Foundation (Jun 30)

Completed:
- Changed new/never-configured users from always-bilingual to English-first / Chinese-on-demand by default in Study sessions, while preserving saved language preferences and the existing Test/Adaptive English-only startup defaults.
- Added a local-only `translationRevealEvents` IndexedDB store with ISO timestamps, elapsed-on-question timing, submit/completeness snapshots, per-question reveal counts, top-level question IDs, and embedded case-study `partId` metadata.
- Gated reveal telemetry explicitly to live Study sessions; Summary, Developer Review, Preview Lab, Test, Adaptive, and other non-live surfaces do not receive the recorder even if on-tap reveal UI is visible.
- Added defensive empty-`zh` guards and centralized reveal handlers for `BilingualText`, `HighlightControl`, and `DropdownClozeControl`.
- Stopped reveal-button clicks from bubbling into selectable answer rows, and disabled English-line reveal inside interactive answer choices so reveal intent does not also select/deselect an answer.
- Converted `RationalePanel` rationale, per-choice rationale, strategy, and glossary terms to on-tap reveal behavior so post-submit explanation reveals can be recorded as `rationale`/`glossary` blocks in live Study sessions.

Verification:
- `npx tsc -b --pretty false` passed.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- Browser smoke checked a live Study on-tap reveal button nested inside a bowtie answer token: the reveal button disappeared after one click, the token remained unselected, and Submit remained disabled.

### Settings Preview Lab (Jun 30)

Completed:
- Added a low-prominence collapsed `Preview Lab` section at the bottom of Settings for inspecting bundled questions without starting sessions or writing progress.
- Added curated preview buckets for case studies, standalone split visual candidates, standalone full-width/excluded visual kinds, ordered response, bowtie, and highlight items.
- Reused `QuestionCard`, visual rendering, standalone split eligibility, and `getVisibleCaseStages` instead of duplicating clinical question markup.
- Added local-only preview modes for live answer layout, current summary/review layout, and a narrow stacked mobile inspection container.
- Added case-study controls for current part selection, detected `stageId` / `answerableAfterStageId`, visible stage count, and a comparison-only show-all-stages toggle.
- Moved the actual preview renderer out of the narrow Settings column into a full-width hidden app view, leaving Settings as a low-prominence launcher so desktop previews match the real user environment.

Verification:
- Browser smoke checked the Settings launcher, full-width Preview Lab page width, case-study split rendering, `lab_trend` live standalone split, excluded `capnography` full-width rendering, staged case cumulative visibility, mobile stacked preview, summary/review standalone full-width behavior, and browser console errors.
- `npx tsc -b --pretty false` passed.
- `npm run test:exam-layout` passed.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run build` passed with the existing Vite chunk-size warning.

### Exam Layout Extraction and Review Visual Layout (Jun 30)

Completed:
- Extracted exam split/stage layout helpers from `src/App.tsx` into `src/examLayout.ts` so stage visibility and standalone visual split eligibility are directly testable.
- Added `npm run test:exam-layout` coverage for cumulative case-stage visibility, fail-open unresolved stage metadata, answerable-after precedence, and the six-kind standalone split allowlist.
- Added a `standaloneVisualLayout` prop so Summary review and Developer Review render standalone visual questions full-width while live answering keeps the exam-style split layout.
- Implemented `exam-layout-extraction-and-tests-codex-spec.md` and `standalone-visual-review-layout-codex-spec.md`.

Verification:
- `npx tsc -b --pretty false` passed.
- `npm run test:exam-layout` passed.
- `npm run build` passed with the existing Vite chunk-size warning.

### App Icon Pack Integration (Jun 29)

Completed:
- Installed the new NCLEX Bilingual Prep icon pack into `public/` so Vite includes favicons, Apple touch icon, PWA icons, and the full-bleed 1024px source icon in static builds.
- Wired `index.html` to the project favicon, PNG favicon fallbacks, Apple touch icon, web app manifest, and theme color.
- Added a relative-path `manifest.webmanifest` to preserve the app's GitHub Pages and `file://`-compatible static build behavior.
- Replaced the generic header flask mark and home hero eyebrow marker with the project app icon as the first in-app use of the pack's brand assets.

Verification:
- `npm run build` passed with the existing Vite chunk-size warning.

### Standalone Visual Split QA Hardening (Jun 28)

Completed:
- Fixed standalone visual split rendering by making `.exam-split-layout` an actual CSS grid; previously standalone split had grid columns but no grid display context.
- Reduced the standalone split allowlist to `vitals_trend`, `lab_trend`, `medication_label`, `device_screen`, `burn_map`, and `injection_site`.
- Removed `mar` and `io_record` from standalone split eligibility after browser measurements showed the desktop visual pane is 384 px wide in learner sessions, which is too tight for dense table stimuli.
- Confirmed excluded waveform/tracing visuals (`rhythm_strip`, `capnography`, `fetal_monitoring`) remain full-width with tracing min-width and horizontal overflow preserved.
- Confirmed bowtie and non-visual questions remain normal full-width cards.
- Added [`CLAUDE-HANDOFF-STANDALONE-VISUAL-SPLIT-QA-2026-06-28.md`](CLAUDE-HANDOFF-STANDALONE-VISUAL-SPLIT-QA-2026-06-28.md) with smoke IDs, layout results, and review requests.

Verification:
- Browser smoke checks covered all six included split visual kinds, MAR/I&O full-width fallback, three excluded waveform/tracing kinds, bowtie, non-visual control, and `1024x768` stacked fallback.
- `npx tsc -b --pretty false` passed.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run test-visuals` passed.
- `npm run build` passed with the existing Vite chunk-size warning.

### Case-Study Split QA Hardening (Jun 28)

Completed:
- Hardened the live case-study split layout after PR #1 and PR #1.1 without changing grading, storage, schema, or bank content.
- Changed the aggregate case submit affordance to `Submit all parts` and added a whole-case completion indicator such as `0 of 6 parts complete`.
- Fixed the independent-pane scrolling constraint by stretching live split grid items inside the fixed-height container and capping chart/work pane heights to the container.
- Reset the work pane scroll position when switching active case parts; mobile collapse also scrolls the work pane into view on part switches.
- Repositioned glossary popovers from clicked term buttons and clamped them inside the containing split pane so chart terms do not open in the work pane.
- Added [`CLAUDE-HANDOFF-CASE-SPLIT-QA-HARDENING-2026-06-28.md`](CLAUDE-HANDOFF-CASE-SPLIT-QA-HARDENING-2026-06-28.md) with smoke notes, edge cases, and review requests.

Verification:
- `npx tsc -b --pretty false` passed.
- Browser smoke checks covered Developer Review stacked layout, live clean staged split, absent-mapping fallback, stage visual rendering, six-part fallback case, mobile collapse, part-switch scroll reset, non-overlapping sticky actions, and chart-pane glossary popover placement.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run test-visuals` passed.
- `npm run build` passed with the existing Vite chunk-size warning.

### Case-Study Stage Reference Audit (Jun 28)

Completed:
- Added an advisory `audit:stage-refs` check for embedded case-study parts whose `stageId` or `answerableAfterStageId` does not resolve to a declared parent `caseStudy.stages[].id`.
- Wired the check into aggregate `npm run audit` as a non-blocking Tier 2 advisory result, so unresolved metadata is visible without blocking existing content gates.
- Added focused fixture coverage for valid refs, invalid refs, and referenced stages on cases without declared stages.
- Repaired the 11 known unresolved canonical references: six GPT gap-case initial references were removed because no initial stage object exists, while five hard-case `initial`/`admission` aliases were mapped to the declared first stage.
- Added [`CLAUDE-HANDOFF-STAGE-REFERENCE-AUDIT-2026-06-28.md`](CLAUDE-HANDOFF-STAGE-REFERENCE-AUDIT-2026-06-28.md) with repair rationale, verification, and review questions.

Verification:
- `npm run test:audit-stage-refs` passed.
- `npm run audit:stage-refs` passed after the bank repair.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run audit` passed with the existing advisory non-MCQ distribution WARN and `audit:integrity` INSUFFICIENT because no raw drafts are present.
- `npm run census` regenerated `census.json` and `BANK-CENSUS.md` with unchanged counts (1,665 top-level / 721 embedded / 154 visuals).
- `npm run census:check` passed.
- `npm run build` passed with the existing Vite chunk-size warning.

### Standalone Visual Split Layout (Jun 28)

Completed:
- Added an allowlisted split layout for standalone non-case questions with selected visual stimuli: `vitals_trend`, `lab_trend`, `mar`, `io_record`, `medication_label`, `device_screen`, `burn_map`, and `injection_site`.
- Preserved full-width visual-above-stem layout for tracing/waveform kinds: `rhythm_strip`, `capnography`, and `fetal_monitoring`.
- Kept bowtie and non-visual questions out of the split path naturally because they have no standalone `question.visual`.
- Added an early stacked fallback at `1100px` for standalone visual split, with narrow-width visual-wrapper overflow guards for dense included visuals.
- Added [`CLAUDE-HANDOFF-STANDALONE-VISUAL-SPLIT-2026-06-28.md`](CLAUDE-HANDOFF-STANDALONE-VISUAL-SPLIT-2026-06-28.md) with the allowlist, exclusions, smoke IDs, verification, and review requests.

Verification:
- `npx tsc -b --pretty false` passed.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run test-visuals` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- Browser smoke checks covered one ID per included kind and one ID per excluded kind; included kinds split at desktop width, excluded waveform/tracing kinds stayed full-width, and MAR/I&O stacked below `1100px`.

### Exam-Like Case-Study Split Layout (Jun 28)

Completed:
- Refactored case-study rendering into an exam-like split layout: client chart/exhibits in a left pane and one active embedded case part in a right pane.
- Added local embedded-part navigation with previous/next controls, part chips, pre-submit completion status, and post-submit correct/review status while preserving top-level case-study identity and aggregate submit/grading.
- Moved the aggregate case-study submit affordance into the right-pane toolbar so it remains visible from any active embedded part, while still gating submit readiness on all embedded parts being complete.
- Kept inactive embedded parts mounted with `hidden` in split mode so tab switching does not discard local draft UI state.
- Constrained the desktop split layout so the chart and work panes scroll independently; mobile returns to normal stacked flow.
- Added conservative stage visibility: global exhibits always show; valid `answerableAfterStageId` and valid `stageId` show cumulative stages through the mapped stage; absent or invalid mappings show all stages so chart data is not hidden.
- Preserved existing summary/dev-review reuse of `QuestionCard`; Summary and Developer Review intentionally use the stacked read-through case layout, while live sessions use the split layout.
- Deferred standalone visual split layout to a later PR.
- Added [`CLAUDE-HANDOFF-EXAM-SPLIT-LAYOUT-2026-06-28.md`](CLAUDE-HANDOFF-EXAM-SPLIT-LAYOUT-2026-06-28.md) with implementation notes, smoke IDs, verification, and review requests.

Verification:
- `npx tsc -b --pretty false` passed.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run test-visuals` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- Browser smoke checks covered `opus_psi_caregiver_2026_06_10_01`, `opus25_case_tb_airborne_treatment_monitoring_01`, `gpt_case_gallstone_pancreatitis_01`, `cs_thyroid_storm_main`, and `opus_vanco_case_01`; mobile collapse, dark mode, language modes, chip navigation, visible aggregate submit, cumulative mapped stages, invalid-mapping fallback, stage visual rendering, independent pane scrolling, stacked Developer Review, and stacked Summary expansion were checked.

### Split-Screen Layout Feasibility Investigation (Jun 28)

Completed:
- Audited the current case-study, visual-stimulus, renderer, grading, session, storage, and CSS surfaces for an NCLEX/Pearson-style split-screen testing layout.
- Added [`SPLIT-SCREEN-LAYOUT-INVESTIGATION-2026-06-28.md`](Archive/root-cleanup-2026-07-03/SPLIT-SCREEN-LAYOUT-INVESTIGATION-2026-06-28.md) with feasibility findings, bank-shape counts, risky stage-mapping IDs, renderer insertion points, and a phased implementation recommendation.
- Recommended a renderer-only case-study split layout as PR #1, preserving top-level session identity and aggregate submit behavior, with conservative all-stage fallback for absent or invalid stage mappings.

Verification:
- `npm run validate-bank -- banks/*.json` passed.
- `npm run build` passed with the existing Vite chunk-size warning.

### Burn Map Gemini Geometry Follow-up (Jun 28)

Completed:
- Translated Gemini's latest burn-map fixes into the deterministic SVG renderer while preserving the existing 13 `BurnRegionKey` schema surface, TBSA table, self-check arithmetic, and static/offline rendering path.
- Replaced the compact mannequin paths with the revised full-size anterior/posterior geometry: clearer head/neck silhouette, broader trunk/shoulder joins, longer limbs with hand/foot termini, distinct genitalia, and posterior glute orientation ink.
- Expanded the SVG viewBox to add a bottom label band so view labels do not overlap the head or feet, and updated burn-map regressions around the new geometry landmarks.
- Further refined the head-only geometry after preview review: smaller skull, shorter neck run, modest jaw/chin taper, and a subtler anterior lower-face boundary cue without touching hand geometry.
- Added a valid genitalia-only burn-map fixture to keep the supported anterior 1% region covered by visual fixture/conformance runs.
- Restored the anterior chin/jaw cue using the previewed mild-thin-neck head variant so the line sits low enough to read as jaw structure rather than a smile, while preserving hand geometry.
- Added the selected subtle broken-clavicle anterior body ink cue to improve front-view orientation without creating a new fillable region or changing hands/body geometry.

Verification:
- `npx tsx scripts/tests/burn-map.ts` passed.
- `npm run test-visuals` passed.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run build` passed with the existing Vite chunk-size warning.

### Burn Map Jawline and Shoulder Polish (Jun 28)

Completed:
- Added a clipped anterior jawline/chin `BODY_INK` cue so the front-view head/neck reads less alien without adding face details or a new fillable region.
- Softened the anterior/posterior shoulder yokes from straight ruler-like lines into shallow curves while moving shared arm/trunk seam points together.
- Generated updated smoke outputs under `audit/burn-map-smoke-2026-06-28-jaw-shoulders/`.

Verification:
- `npx tsx scripts/tests/burn-map.ts` passed.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run test-visuals` passed.
- `npm run build` passed with the existing Vite chunk-size warning.

### Burn Map Clinical-Chart Translation (Jun 28)

Completed:
- Translated Gemini's chart-style burn mannequin direction into the existing 13-key `burn_map` renderer without adding schema regions: neck is absorbed into the head keys, glute cues remain posterior `BODY_INK`, and no extra fillable neck/glute islands were introduced.
- Reworked the silhouette toward a professional schematic chart: broad flat shoulders, simple tapered trunk, deliberate hand termini, no ears, and high-readability whole-region boundaries.
- Added a single-region renderer regression loop so every `BurnRegionKey` shades exactly one keyed fill when selected alone.
- Generated updated chart-style smoke outputs under `audit/burn-map-smoke-2026-06-28-chart/`.

Verification:
- `npx tsx scripts/tests/burn-map.ts` passed.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run test-visuals` passed.
- `npm run build` passed with the existing Vite chunk-size warning.

### Burn Map Anatomical Readability Follow-up (Jun 28)

Completed:
- Refined the `burn_map` silhouette around anatomical readability rather than pixel-area proportionality: arms now reach mid-thigh, taper more clearly, and preserve shared shoulder seams with the trunk.
- Enlarged the anterior genitalia wedge enough to read when selected while keeping it visibly subordinate to trunk and legs.
- Mirrored posterior left/right keyed regions for anatomical back-view convention while preserving the symmetric visible silhouette and posterior glute orientation creases.
- Generated updated renderer smoke outputs under `audit/burn-map-smoke-2026-06-28/`.

Verification:
- `npx tsx scripts/tests/burn-map.ts` passed.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run test-visuals` passed.
- `npm run build` passed with the existing Vite chunk-size warning.

### Burn Map Renderer Readability Polish (Jun 27)

Completed:
- Reworked the `burn_map` SVG region geometry for a clearer NCLEX-style adult anterior/posterior silhouette: broader shoulder yokes, more distinguishable arms and legs, parallel front/back proportions, and a more visible standalone genitalia region.
- Reduced body-ink detail to posterior orientation lines only and softened burn-map outlines so selected translucent red regions remain the dominant cue.
- Kept the pass cosmetic only: no `BurnRegionKey`, `TBSA_PCT`, validation, self-check, schema, scoring, bank JSON, or question-content changes.
- Generated renderer smoke outputs under `audit/burn-map-smoke-2026-06-27/` for baseline, anterior/posterior group burns, individual trunk/arm/leg/genitalia selections, and a mixed case.

Verification:
- `npx tsx scripts/tests/burn-map.ts` passed.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run test-visuals` passed.
- `npm run build` passed with the existing Vite chunk-size warning.

### Injection-Site Vessel Safety Hardening (Jun 27)

Completed:
- Added a typed optional `visual.vessel` relation for `injection_site` visuals: omitted renders no vessel, `bystander` renders a non-intersecting vessel cue, and `target` renders a vessel entered by the needle.
- Moved injection-site vessel geometry and needle/ellipse intersection checks into a shared `geometry.ts` module used by the renderer, selfCheck, and tests.
- Hardened `selfCheck` so IV visuals require `vessel: "target"`, target vessels are IV-only, target vessels contain the needle tip, and bystander vessels cannot intersect the needle segment.
- Patched the 8 GPT injection-site smoke items in `banks/gpt-canonical.json` with serializer-safe `visual.vessel` / `meta.expected.vesselEntry` metadata while preserving stems, options, answer keys, and rationales.
- Updated the injection-site schema documentation and review ledger, and archived the implementation specs under `Archive/root-cleanup-2026-06-27/`.

Verification:
- `npx tsx scripts/tests/injection-site.ts` passed.
- `npx tsc -b --pretty false` passed.
- `npm run test-visuals` passed.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run audit` passed with existing advisory distributional WARN and `audit:integrity` INSUFFICIENT because no raw drafts are present.
- `npm run census` regenerated `census.json` and `BANK-CENSUS.md` with unchanged counts (1,665 top-level / 721 embedded / 154 visuals).
- `npm run build` passed with the existing Vite chunk-size warning.

### Text Size Accessibility Follow-up (Jun 27)

Completed:
- Added a persisted `Compact / Default / Large` text-size setting to the existing Settings view, stored through the current local settings path.
- Made `Default` the new baseline and mapped it to a modest reading-text scale increase without changing root `font-size`, app chrome sizing, spacing, or visual-stimulus dimensions.
- Scoped the font scale to learner-facing reading surfaces including stems, bilingual text, case-study copy, cloze/highlight text, bowtie tokens, rationales, glossary chips, and flashcards.
- Preserved the dark-mode root sync and added a separate `data-text-size` root sync for the reading scale.

Verification:
- `npx tsc -b --pretty false` passed.
- `npm run build` passed, with only the existing Vite chunk-size warning.
- Browser sanity check on `http://127.0.0.1:5173/` confirmed Settings shows the text-size segmented control, Default starts at `--font-scale: 1.08`, Large applies `1.16`, Compact applies `1`, and the session was restored to Default.

### Vocab Rescue Phase 1 Instrument MVP (Jun 27)

Completed:
- Added a local `LanguageMiss` signal for learner-marked English-language misses, stored in a new IndexedDB `languageMisses` object store with in-memory fallback and no bank/schema/content-pipeline changes.
- Added the incorrect-answer "Missed because of the English / 是英文卡住了" affordance for study-mode and summary-review missed questions that have glossary terms.
- Added durable Vocab Rescue term derivation from missed questions plus manually language-tagged questions, using the existing glossary aggregation and flashcard SRS.
- Added a Summary "Review missed terms" handoff that opens Vocab in a one-shot session-focused Rescue scope, with stale focus cleared on normal Vocab entry or after leaving the Flashcards view.
- Added a `Rescue | All` scope control to Vocab and a `Vocab Rescue` chip for terms tied to manually language-tagged questions.
- Added [`VOCAB-RESCUE-PHASE1-WALKTHROUGH.md`](Archive/root-cleanup-2026-07-03/VOCAB-RESCUE-PHASE1-WALKTHROUGH.md), originally in the project root, to document the unfinished product state, manual QA flow, and future interview questions.

Verification:
- `npx tsc -b --pretty false` passed.
- `npm run build` passed, with only the existing Vite chunk-size warning.

### Dark Mode Toggle Prep and Implementation (Jun 27)

Completed:
- Audited the current styling/theme structure and visual-stimulus renderers for dark-mode risk, with the low-risk recommendation of dark app chrome plus light-locked clinical visual panels.
- Added a binary Light/Dark setting stored in existing local settings, applies `data-theme` on the document root, and includes a pre-React startup script to avoid dark-mode flash when the saved setting is dark.
- Introduced CSS custom properties for app surfaces, text, borders, controls, focus rings, rationale/evidence panels, and semantic answer states while preserving the static/offline architecture and `file://` build path.
- Locked the visual stimulus wrapper to light rendering so ECG paper, waveform contrast, device/MAR tables, fetal monitoring, burn maps, and injection-site visuals are not reinterpreted by global dark theme variables.
- Captured the Claude handoff and text-resize follow-up context in `CLAUDE-DARK-MODE-HANDOFF-2026-06-27.md`; the text-size spec remains deferred to a later pass.

Verification:
- `npx tsc -b --pretty false` passed.
- `npm run test-visuals` passed.
- `npm run build` passed, with only the existing Vite chunk-size warning.

### Phase B Adversarial Coherence Audit Closeout (Jun 26)

Completed:
- Closed out the Phase B adversarial coherence audit over the bounded, provenance-split slice `audit/early-bank-semantic/coherence/2026-06-25-phaseB.slice.json` (104 candidate pairs / 93 items) — the scale-up the Phase A pilot recommended.
- Dispatched producer-clean across three review lanes: Claude Code / Claude Opus 4.8 (81 pairs — gemini×gemini 40, gpt×gpt 30, gemini×gpt 11), Codex / GPT-5 (6 claude×gemini pairs), and Gemini / gemini-3.5-flash (46 pairs — 31 Part A + 15 Part B). Producer≠checker held at the model level for every pair; the 8 Part B mixed×gemini pairs and the 2 Part A HIPAA pairs were additionally adjudicated by Luke at the human level.
- Result: **0 contradictions across all 104 pairs.** Every pair resolves to a coherent shared-decision DISMISS or a NULL-COHERENCE no-shared-decision dismissal. No canonical content was mutated; all lanes are flag-only and advisory. Luke independently reviewed all three lanes and concurs with every dismissal.
- Raised an architect-facing quality finding: lane *convergence* on the verdict hid a lane-*quality* gap. The Gemini lane reached the correct outcome via templated, non-pair-specific reconciliations that required human re-research to trust, whereas the Claude and Codex lanes produced self-verifying, verbatim-evidenced reconciliations. Handoff `Archive/root-cleanup-2026-06-26/CLAUDE-ARCHITECT-GEMINI-AUDIT-QUALITY-HANDOFF-2026-06-26.md`; resulting design decision (demote Gemini from peer audit lane) recorded in `DECISIONS.md`.

Verification:
- Parsed the merged manifest `audit/early-bank-semantic/coherence/ADVERSARIAL-AUDIT-2026-06-25.manifest.jsonl` (266 rows, 17 fields each, every line parses, all DISMISS, `needsHumanReview` 0).
- Merged findings report: `Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-25.md`; lane files `lanes/{claude,codex,gemini}.phaseB.*`.
- No bank content changed, so counts are unchanged from the 2026-06-25 census regeneration (1,665 top-level / 721 embedded / 2,386 graded).

### Non-MCQ Bias Gate Phase 1 (Jun 26)

Completed:
- Wired the non-MCQ bias audit into `npm run audit` as a Tier-2 advisory split: `audit:non-mcq-bias:mechanical` reports positional/mechanical findings, while `audit:non-mcq-bias:distributional` reports non-blocking `REGENERATE` concentration debt.
- Added `WARN` as a gate status and fixed the aggregate verdict bug where an all-clean run could be described as "some checks INSUFFICIENT."
- Kept mechanical enforcement behind `BIAS_GATE_ENFORCE_MECHANICAL=1` for Phase 1 observe-only rollout; distributional warnings never block.
- Added `scramble_min_n` and reused it for `ordered_response / scramble_depth` and `matrix / all_rows_same_column` so tiny pools return `INSUFFICIENT` rather than FAIL-grade artifacts.
- Added a gate adapter that calls `non-mcq-bias-lib` directly without writing the standalone `audit/non-mcq-bias-report.*` or Layer B handoff artifacts.
- Updated `promote.ts` to run the normalized staged batch through the in-memory non-MCQ gate before writing any `banks/_promoted/` output, preventing partial staged writes on enforced mechanical failure.
- Archived completed root specs and dated handoffs under `Archive/root-cleanup-2026-06-26/`.

Verification:
- `npm run test:non-mcq-bias` passed.
- `npx tsc -b --pretty false` passed.
- `npm run audit` passed: Tier 2 showed mechanical PASS and distributional WARN (12 records), with `audit:integrity` still INSUFFICIENT because no raw drafts are present.

### Sampler Calibration Closeout (Jun 26)

Completed:
- Resolved the study-session sampler calibration placeholder: retained `alpha = beta = 1` after checking the live case-study-excluded sampler pool, where rhythm strips are ~14% of Physiological Adaptation and the largest topic concentration is Cardiovascular Disorders at ~31%.
- Replaced the drifting visual floor derivation ("all visual kinds with count >= 10") with the explicit, threshold-gated priority allowlist `["rhythm_strip", "lab_trend", "vitals_trend"]`, reserved in list order and deduped for caller overrides. `floorThreshold = 10` now serves only as a viability gate.
- Flipped the mechanical non-MCQ bias gate to enforce by default in local audit, local promote, and CI; `BIAS_GATE_ENFORCE_MECHANICAL=0` remains the explicit observe-only diagnostic escape hatch.
- Added sampler regressions for high-count non-allowlisted visuals, below-threshold allowlisted visuals, disabled floors, and duplicate allowlist entries.

Verification:
- `npm run test:non-mcq-bias` passed.
- `npx tsx scripts/tests/session-sampler.ts` passed.
- `npm run test-visuals` passed.
- `npx tsc -b --pretty false` passed.
- `npm run audit` passed: Tier 2 showed mechanical PASS under default-on enforcement and distributional WARN (12 records), with `audit:integrity` still INSUFFICIENT because no raw drafts are present.
- `npm run build` passed.

### Phase A Adversarial Semantic Audit Pilot Closeout (Jun 25)

Completed:
- Opened the Phase A adversarial semantic audit pilot for the regenerated coherence slice at `audit/early-bank-semantic/coherence/2026-06-24.slice.json`.
- Completed the Gemini-flagged / Luke-adjudicated straggler review for the two Claude × GPT delegation pairs. Both candidate contradictions were dismissed/kept; the shared report and manifest are recorded in `Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md` and `audit/early-bank-semantic/coherence/ADVERSARIAL-AUDIT-2026-06-24.manifest.jsonl`.
- Completed the GPT-5/Codex assigned lane and wrote lane-scoped artifacts under `audit/early-bank-semantic/coherence/lanes/`: 5 coherence pairs plus 7 source-checked currency rows, with zero actionable findings and 14 DISMISS/keep manifest rows.
- Completed the Claude coherence lane and the five-row Claude Opus currency exception. The merged pilot covers 109 unique items / 156 candidate pairs, with 117 DISMISS rows and 2 minor FIX rows.
- Applied the two key-preserving Phase A coherence-polish corrections to `banks/gemini-canonical.json`: `gemini_c9_01` rationale summary option letter B→A in EN and ZH, and `gap_50_sic_03` ZH `流液`→`流感`.
- The Phase A pilot recommends scaling to Phase B in bounded, provenance-split coherence batches. There are no blocker/major, source_check, hold, discard, or answer-key-change findings.

Verification:
- Parsed the shared Gemini JSONL manifest successfully (4 rows with required pilot fields).
- Parsed `audit/early-bank-semantic/coherence/lanes/codex.manifest.jsonl` successfully (14 rows with required pilot fields).
- Parsed the merged coherence manifest successfully (119 rows with required pilot fields) and parsed the Claude Opus currency exception manifest successfully (5 rows).
- The canonical patch reported 3 FIX operations, preserved 874 Gemini questions, and passed in-process bank validation. Post-patch disk reread confirmed keys/matrix mapping unchanged.

### Phase 2 Schema-Hardening Step B Closeout (Jun 24)

Completed:
- Added `scripts/cleanup-unknown-key-residuals.ts` plus `npm run cleanup-unknown-keys`, a dry-run-default deterministic cleanup for the Phase 2 residual unknown-key tail.
- Cleaned all 16 live residual off-schema keys from canonical banks: duplicate `rationale.byChoice[].id` keys on `cs_copd_01_q1`; stray glossary `en` on `opus_tpn_case_mucositis_01_q3`; legacy nested `matrix.correct` on `gpt_pph_2026_06_16_case_01_q5`; duplicate misnested `caseStudy.rationale` / `testTakingStrategy` / `glossary` on `gpt_case_unsafe_assignment_01`; empty `meta.custom` on `gpt_fresh_2026_06_22_vis_07`; `io-canonical.json` bank-meta provenance keys; and the legacy `overview` alias on `opus12_case_inpatient_suicide_risk_01`, renamed to schema `summary`.
- Implemented the A1 unknown-key strict reject gate in `src/schema.ts` using `src/allowedKeys.ts` as the single manifest. Strictness is opt-in via `rejectUnknownKeys`; pipeline/audit call sites pass it explicitly, while learner-uploaded imports remain forgiving by default.
- Kept `npm run scan-unknown-keys` as an on-demand diagnostic rather than wiring it into `npm run audit`; Tier 0 `validate:bank` now owns strict rejection in the aggregate gate.

Verification:
- `npm run cleanup-unknown-keys` dry-run reported the expected 16 changes; `npm run cleanup-unknown-keys -- --write` applied them.
- `npm run scan-unknown-keys` passed with 0 off-schema key occurrences.
- `npm run test:schema-bank` passed, including strict unknown-key fixtures and the `termDef` regression.
- `npm run validate-bank -- banks/*.json` passed with strict mode.
- `npm run audit` passed, with `audit:integrity` marked INSUFFICIENT because no raw draft files are currently present.
- `npx tsc -b --pretty false` passed.
- Final census/build verification completed for this pass.

### Phase 2 Schema-Hardening Step A Closeout (Jun 24)

Completed:
- Confirmed promote-time presentation normalization is already folded into `scripts/promote.ts` via `normalizeBankPresentations(shuffled)`, covering MC/SATA/ordered option pools, dropdown options, matrix columns, and embedded case-study leaves after deterministic shuffle.
- Extended `audit:integrity` regression coverage with embedded ordered-response, dropdown-cloze, and matrix leaves so the effective promote path verifies normalized structural axes while preserving keys, IDs, rationale refs, bilingual text, and keyed answers.
- Ran the standalone presentation dry run and resolved the one live canonical display-order drift: `banks/gemini-canonical.json` item `gap_50_sic_04` matrix columns were re-normalized from `c2,c1,c3` to `c3,c1,c2`. The recorded `gpt-gap-jun12-rrp-bcc` diagnostic was clean.
- Left `audit-non-mcq-bias` advisory-only; distributional bias findings are not wired into `npm run audit`.
- Regenerated census artifacts. Counts remain 1,665 top-level questions, 721 embedded parts, and 154 visuals.

Verification:
- `npm run test:audit-integrity` passed.
- `npm run test:presentation-normalization` passed.
- `npm run normalize-presentations` passed with 0 pending changes after the rebaseline.
- `npm run validate-bank -- banks/*.json` passed.
- `npm run audit` passed, with `audit:integrity` marked INSUFFICIENT because no raw draft files are currently present.
- `npm run census` completed.
- `npm run build` passed.

### Visual Stimulus Natural-Size Caps (Jun 24)

Completed:
- Added visual-kind classes to the shared `VisualStimulus` SVG wrapper so CSS can distinguish data-dense panels from calibrated tracings without changing renderer output.
- Capped non-tracing visual kinds (`device_screen`, `medication_label`, `mar`, `io_record`, `burn_map`, `injection_site`, `vitals_trend`, `lab_trend`) to their design widths while allowing them to shrink to mobile column width with no forced horizontal scrollbar.
- Left `rhythm_strip`, `capnography`, and `fetal_monitoring` on the existing tracing behavior with the 36rem floor and wrapper-level horizontal scroll.
- Archived the implementation spec at `Archive/visual-sizing-codex-spec.md`.

Verification:
- `npm run test-visuals` passed.
- `npm run build` passed.
- Browser spot checks in the dev review console confirmed capped visuals fit mobile width without page overflow, while rhythm strip and capnography still keep their horizontal scroll behavior.

## Verification baseline

Last verified on 2026-06-15:

- `npm run test:case-completeness` — raw compile-manifest accounting, omission, bowtie, strip, and canonical-leak regressions pass
- `npm run case-completion:layer-a` — 116 cases reconciled against 27 archived skeletons; substantive output is deterministic; 2-row Gemini queue emitted
- Gemini Layer B completed the capped two-case alignment: both joins were confirmed, with one merged CAR-T DP and one code-status DP lacking a dedicated item. `audit/case-completion/FINAL-ARCHITECTURE-REPORT.md` records the GPT completion contract and Claude adjudication choices; no bank content was changed.
- `npm run test:grading` — all current item types, partial-credit families, full-marks retention, and malformed duplicate-selection regressions pass
- `npm run test:highlight` — schema 1.3 highlight validation, export, and recursive version-floor regressions pass
- `npm run test:bowtie` — schema 1.4 bowtie validation, grading, export, completeness, standalone-only, version-floor, and shuffle regressions pass
- `npm run test:exam-layout` — split/stage visibility and standalone visual split eligibility regressions pass
- `npm run validate-bank -- banks/*.json` — all bundled top-level banks pass
- `npm run test-visuals` — 11 registered visual kinds green
- `npm run census && npm run census:check`
- `npm run build`

Representative fetal-monitoring fixtures were also inspected through the in-app browser; the visual pass found and corrected channel-label overlap.

## Authoritative references

- `NCLEX-Question-Schema.md` is the schema source of truth.
- `src/types.ts` implements the schema contract; its `SchemaVersion` union is the single source of truth for the current version floor — verify it directly rather than trusting prose (`AGENTS.md`'s risk-tiered matrix, *Docs* row). `Rationale.visuals` carries rationale explanation figures; the visual union is assembled in `src/visuals/types.ts`.
- `src/schema.ts` validates committed and imported question data.
- `scripts/validate-bank.ts` reuses the app validation path for bank files.
- `BANK-REVIEW-LEDGER.md` tracks per-bank review status and should be updated before any generated bank is treated as reviewed testing material.

## Product decisions

- The home splash's recommended practice session runs in Study mode with the saved Chinese display preference (`on-tap` by default). Test mode is reachable only from the custom session builder.
- Chinese is off by default in Test mode and in Adaptive mode. Both are non-default exam-condition placeholders pending a real exam-simulator spec; both still reveal the answer and rationale immediately after each submit.
- Study mode uses the saved Chinese display preference.
- Missed-question clearing currently requires two consecutive correct answers after a miss.
- Uploaded banks are stored question-by-question in IndexedDB.
- Bundled banks are read-only.
- Import accepts wrapped bank objects or bare arrays and skips invalid individual questions.
- The production build rewrites module script output to a classic deferred script for better `file://` compatibility.
- The app no longer shows a persistent AI warning footer; question provenance and caveats are handled outside the study UI.
- External-GPT handoff is per-question at the rationale moment, plus per-expanded missed item at Summary; it is never a session-batch export.

## Candidate next work

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
- **Batch 18 closed (2026-07-13) — the `prose_embedded` lane's closure tail, in full.** Reviewed per `EXHIBIT-FLOWSHEET-CODEX-TO-CLAUDECODE-BATCH-18-2026-07-13.md`; both candidates independently gated (18A 0/3, 18B 0/0, exact match) and content-reviewed before writing. 18A's pyloric-stenosis `population: "peds_infant"` verified against the case stem despite the age living only in case-wide context; bicarbonate/HCO3 identity re-derived from the "Serum Chemistries" exhibit framing (no ABG context, so `bicarbonate` not `hco3_abg`); celiac's R9 WARN confirmed a genuine duration-not-age false positive. 18B's burn SpO2 tag is a textbook same-record device-framing match for the refined Rule F boundary ("on the non-rebreather"), with an explicit column correctly dodging four decoy clock times in its own exhibit text; C. difficile's follow-up record correctly carries zero Rule F tags under the no-carry-forward rule. **Non-blocking tooling finding:** the R9 age-marker regex doesn't recognize `weeks?` as a unit — a genuinely pediatric case stated only in weeks, only in case-wide context, with `population` left unset, would currently only WARN instead of hard-FAIL. Flagged for Codex/Luke as a follow-up (add `weeks?` to the regex, or widen the context-only explicit-identity check to catch "noun + is/was/admitted" framing); not yet fixed. Full mechanical suite green across all four refs.
- Add browser automation to the verification baseline when Playwright or the in-app browser tool is available.
- Extend shared grading regressions when new item types are added.
- Continue bank expansion guided by `npm run census` (structured) and `npm run coverage-report` (Markdown prompt parameters).
- Consider optional live Gemini generation only if still wanted.
- Consider optional remote bank update flow if manual bundled-bank updates become annoying.
