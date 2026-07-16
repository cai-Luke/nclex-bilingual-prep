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

Schema 2.0 is current. The structured-measurement flowsheet migration — including the refeeding-syndrome PACU baseline unit clarification, the multi-column staging contract, and the authoritative Batch 20 serial redo with its R9 age-marker fixes (week-unit and day-unit) — is closed with no open holds or flagged tag disputes. Failed Batch 19 is retained only as failure provenance; Batch 20 is the authoritative serial-lane redo. Detailed batch-by-batch chronology lives in the dated archive (`Archive/exhibit-flowsheet-migration-2026-07-13/`) and `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md`; the executable gate (`scripts/exhibit-flowsheet-gate.ts`) and applicator (`scripts/apply-structured-measurements.ts`) own current behavior.

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

### Census Denominator Authority Closeout (Jul 16)

PR #51 introduced separate top-level/session-unit and scored-leaf populations but deliberately left
their planning authority unresolved. PR #52 then established the accepted post-promotion bank state:
the three GPT coverage-balance batches were promoted and the complete 556-record topic/license
residual was adjudicated and applied. This closeout made scored leaves authoritative for category,
topic, difficulty, item-type, target, and generation-prompt planning, while retaining session units as
the authority for inventory, standalone draw capacity, case-container supply, and session
constructibility.

The census now exposes explicit `sessionUnits`, `scoredLeaves`, and `visualArtifacts` lanes. The
legacy root aliases, including `gradedTotal`, were removed after migrating the only real consumer.
`case_study` remains visible as session-unit inventory but cannot enter scored-format targets; the
human census and CLI coverage report each emit one canonical scored-leaf target/prompt block. A
deterministic mixed-parent/leaf regression proves the two denominators, leaf-owned metadata,
standalone delivery capacity, prompt singularity, and fail-closed reconciliation.

### GPT Coverage Balance Batches 5/6A/6B — Promoted (Jul 16)

Independent (Claude, non-producer) content review and promotion of the three raw drafts staged by the
raw-gate preparation entries below: `gpt-balance5-coverage-batch-2026-07-16.json`,
`gpt-balance6a-coverage-batch-2026-07-16.json`, and `gpt-balance6b-coverage-batch-2026-07-16.json`
(18 items each, 54 total).

Review:
- Read all 54 items in full. Every category/format/difficulty distribution matched its commissioned
  manifest exactly: Batch 5 is 8 Management of Care / 4 Pharmacological and Parenteral Therapies / 3
  Safety and Infection Prevention and Control / 3 Reduction of Risk Potential, 7 highlights / 5
  bowties / 3 dropdown clozes / 3 matrices, 7 easy / 8 medium / 3 hard. Batches 6A and 6B each are 11
  Management of Care / 4 Reduction of Risk Potential / 3 Safety and Infection Prevention and Control,
  6 highlights / 4 bowties / 3 dropdown clozes / 3 matrices / 2 ordered responses, 7 easy / 8 medium /
  3 hard.
- Hand-reverified every calculation: Batch 5's anion-gap/Winter's-formula ileostomy item; 6A's
  chloride-responsive metabolic-alkalosis item using the raw-gate-supplied 40 mm Hg PaCO2 reference;
  6B's DKA-plus-vomiting item (anion gap 31, expected PaCO2 25.5–29.5 mm Hg against a measured 27,
  delta-gap-corrected HCO3 32 mEq/L identifying a concurrent metabolic alkalosis). All arithmetic
  checks out.
- Spot-verified the 6B in-line repairs applied by `scripts/patches/2026-07-16-gpt-balance6-inline-repair.ts`:
  the Safety-category rename, the cleaned `meta.source`/`meta.skill_signature` fields, and the restored
  sterilization boundary and CDC nail-length source pin both read correctly in the promoted content.
- No clinical, bilingual-parity, or answer-key ambiguity issues found across any of the 54 items;
  no fixes were required beyond the raw-gate provenance work already recorded below.

Verification:
- `npm run validate-bank` passed all three raw drafts, then all 13 bundled banks post-merge.
- Confirmed 0 ID collisions — raw-vs-raw and raw-vs-canonical (54 raw IDs, 1798 pre-merge canonical
  IDs, no overlap).
- `npm run promote` staged all three to `banks/_promoted/`; `npm run audit` **GATE PASSED** before and
  after merge (2573 bundled IDs globally unique post-merge; only the pre-existing advisory
  topic-license vocabulary warning and the pre-existing visual non-MCQ distributional advisory, both
  unrelated to this batch).
- `npm run consolidate` routed all three `gpt-` drafts into `gpt-canonical.json` sequentially
  (627→645→663→681); staged files auto-consumed. Raw drafts deleted after the merge and audit passed.
- `npm run census && npm run census:check` — 1852 top-level / 721 embedded parts / 2430 scored leaves
  / 199 visuals (unchanged visual count; both batches are text-only). `npm run coverage-report`
  regenerated cleanly.
- `npm run test:topic-vocabulary`, `test:topic-migration-guards`, `test:topic-residual-proposals`,
  `test:residual-rerun`, and `npm run test-visuals` all passed.
- `npx tsc -b --pretty false` and `npm run build` both passed.
- `BANK-REVIEW-LEDGER.md` updated: new Merged Source Batches entry, and the `gpt-canonical.json` row's
  count/last-validated fields bumped to 681 / 2026-07-16.

Note: these 54 additions are all standalone, so their top-level and scored-leaf increments agree.
Their promotion established PR #52's final bank state; the separate denominator closeout above then
selected scored leaves as the planning authority and removed the competing top-level prompt output.

### Topic/License Semantic Residual Closeout (Jul 16)

Completed:
- Semantically adjudicated the complete 556-record topic/license residual: 465 noncanonical-topic
  findings plus 91 canonical topic/category license mismatches.
- Preserved record kinds in the controlled manifest and report: 91 case-study containers, 275
  standalone scored leaves, and 190 embedded scored leaves. Containers were migrated as records but
  were not counted as scored leaves.
- Materialized deterministic per-record before/after decisions in
  `audit/topic-license-adjudication-2026-07-16.manifest.json` and grouped the review report first by
  issue type, then by record kind. All 91 license mismatches have explicit item-level decisions.
- Applied 556 metadata-only changes through a fail-closed applicator that verifies the exact source
  population, record identity and before-values, canonical target membership, and category license
  before writing. No stems, exhibits, keys, rationales, sources, difficulty labels, or grading data
  changed.
- Regenerated the recursive topic-license report and conservative residual outputs. Current result:
  1,852 top-level records (143 case containers + 1,709 standalone leaves), 721 embedded leaves, and
  2,430 scored leaves with zero noncanonical topics and zero category-license mismatches; the legacy
  residual pass also has zero suggestions, unresolveds, untrusted rows, and cross-category blocks.
- Kept the report-only limitation explicit: vocabulary membership and declared licenses are
  mechanically enforceable, while clinical boundaries inside SHARED licenses remain semantic-review
  work.

Verification:
- `npx tsx scripts/patches/2026-07-16-topic-license-adjudication.ts --verify` confirmed all 556
  manifest rows at their expected paths/kinds/parents and zero residual findings.
- A `HEAD`-to-worktree bank-impact comparison confirmed all 556 migrated records and all 1,963 other
  pre-existing records are unchanged outside recursive `category`/`topic` fields; 54 separately
  promoted new records are additive, and no record was removed.
- `npm run validate-bank -- banks/*.json` passed all 13 bundled banks.
- `npm run audit` passed Tier 0/1 and the topic-license advisory with 2,573 globally unique IDs;
  only the standing visual `select_all` distribution advisory remains. Integrity was insufficient
  because the already-promoted raw directory is empty.
- Topic vocabulary, migration-guard, residual-proposal, residual-rerun, recursive-population,
  topic-license, IV-fluid-taxonomy, and coverage-report tests passed.
- `npm run test-visuals` passed all 12 registered kinds and shared conformance/parity checks.
- `npx tsc -b --pretty false` passed.
- `npm run census && npm run census:check` passed at 1,852 top-level / 721 embedded / 2,430 scored
  leaves / 199 visuals. `npm run coverage-report` regenerated against the same state.
- `npm run build` passed with only the standing Vite chunk-size warning.

### Dual-Lane Census, Recursive Topic Population, and IV-Fluid Audit (Jul 16)

Completed in PR #51 (with the final authority settled later by the PR #52 closeout above):
- Introduced separate top-level/session-unit and scored-leaf census views so case containers and
  scored leaves were no longer combined. The first pass preserved legacy root fields and
  `gradedTotal` for compatibility; PR #52 later retired those aliases after selecting scored leaves
  as the sole content-planning denominator.
- Added one shared question-population traversal and moved global ID indexing onto it. The same
  traversal now powers exact-topic audits, preventing embedded case leaves from disappearing from
  future worklists.
- Added a generic two-stage topic-population reporter: recursive exact-topic enumeration plus a
  required dated human semantic-residual manifest. Regenerated Burn Management at current HEAD as
  36 exact records plus 4 reviewed exclusions, final population 36; no keyword detector was added.
- Regenerated current-HEAD coverage and topic-vocabulary residual artifacts from live banks. The
  deterministic topic pass reports 0 exact writes, 8 review suggestions, and 457 unresolved
  noncanonical assignments.
- Completed the non-burn IV-fluid calculation collateral audit. Nine prescribed non-medication IV
  arithmetic items were found: 6 have the correct Pharmacological category but the medication-scoped
  `Dosage Calculations` topic, and 3 require both category and topic correction. One adjacent
  intake/output balance item also needs a topic correction but is not IV-therapy arithmetic.

Architect ruling implemented:
- Added STRICT `IV Fluid Calculations` under Pharmacological and Parenteral Therapies and applied
  the exact nine-item manifest: six topic-only and three category-plus-topic corrections. Routed the
  separate generic net-fluid-balance residual to Basic Care and Comfort / `Nutritional & Fluid
  Support`; it is not counted in the nine. Burn Management remained closed at 36 retained records.
- Added the recursive report-only topic-license hygiene gate. It separately reports top-level and
  scored-leaf populations/findings, labels case containers versus embedded parts, and explicitly
  limits itself to vocabulary membership and declared licenses; SHARED-topic clinical boundaries
  remain semantic-review work. Current report: 1,798 top-level / 2,376 scored leaves, with 366
  top-level and 465 scored-leaf findings (556 unique records because the lanes overlap at standalone
  scored leaves).
- Completed the quiet controlled-category rename to `Safety and Infection Prevention and Control`
  without changing the 13% weight, topic licenses, clinical meaning, or 228 top-level / 277
  scored-leaf population. Legacy bank imports and stored upload/telemetry records normalize the
  retired label at their compatibility boundaries.
- Folded the two identified English `substance abuse` strings into the same cleanup as `substance
  misuse`; no separate terminology audit was commissioned. Regenerated topic vocabulary, residual,
  topic-license, coverage, Burn-population, and dual-lane census artifacts from the live banks.

Verified:
- All 13 canonical banks plus the current raw balance-5 draft validate.
- `npm run audit` passes Tier 0/1 with the new topic-license report-only warning and the pre-existing
  non-MCQ distribution warning.
- Topic vocabulary/migration/residual/population/license, IV-manifest, schema, storage compatibility,
  translation telemetry, and coverage tests pass.
- `npx tsc -b --pretty false`, `npm run census && npm run census:check`, and `npm run build` pass.

### Burn Management Full-Population Gate and SHARED License (Jul 16)

Completed:
- Reconciled the corrected 42-row candidate population against all bundled banks and embedded case
  leaves: 42 unique IDs, all present exactly once.
- Independently adjudicated every live stem, key, rationale, and applicable case exhibit against the
  official NCSBN 2026 Appendix A category pages. The gate accepted 40 architect/Gemini routes, held
  the visual-smoke-only row 23 for removal/quarantine, and revised row 34 to PA /
  `Cardiovascular Disorders` because its matrix spans burn, septic, and cardiogenic shock.
- Applied 27 category/topic metadata corrections across `burn-canonical.json`,
  `gemini-canonical.json`, `gpt-canonical.json`, and `hard-cases-canonical.json`; no stem, answer,
  rationale, clinical claim, visual payload, or derived value changed.
- Changed `Burn Management` from STRICT PA to SHARED `[Pharmacological and Parenteral Therapies,
  Reduction of Risk Potential, Physiological Adaptation]`. The retained exact-topic rollup is 36
  items: Pharm 17, RRP 8, PA 11.
- Closed the architect hold by retiring row 23 from learner-facing `gpt-canonical.json` (628 → 627)
  while preserving its exact question payload in a non-bundled archive. Corrected the stale primary
  decision-table row so it now agrees with the ratified SHARED license.
- Added the architect review artifact, Gemini report/manifest/applicator, independent gate handoff,
  and deterministic row-34 canonical patch record. Updated the dated taxonomy ruling, source record,
  topic export, review ledger, migration report, and census.
- Archived the completed audit bundle under
  `Archive/burn-management-topic-audit-2026-07-16/`; the canonical bank, active taxonomy, and generic
  audit/regression tooling remain live.

Verified:
- `npm run validate-bank -- banks/*.json`
- `npm run audit` (gate passed; only the pre-existing advisory distribution warning)
- `npm run test:topic-vocabulary`, `test:topic-migration-guards`,
  `test:topic-residual-proposals`, and `test:residual-rerun`
- `npm run test-visuals`
- `npx tsc -b --pretty false`
- `npm run census && npm run census:check` (1,798 top-level / 721 embedded / 199 visuals after
  architect-directed row-23 retirement)
- `npm run build`

### GPT Coverage Balance Batch 6 Split Commission (Jul 16)

Prepared and archived after content delivery:
- Added two independently runnable 18-item commissions,
  `Archive/coverage-balance-batch-6-2026-07-16/GPT-COVERAGE-BALANCE-BATCH-6A-SPEC-2026-07-16.md`
  and
  `Archive/coverage-balance-batch-6-2026-07-16/GPT-COVERAGE-BALANCE-BATCH-6B-SPEC-2026-07-16.md`,
  for a coordinated 36-item expansion. Each
  producer returns a separate raw bank and does not depend on the companion packet.
- Provisionally counted the reviewed Batch 5 raw bank for planning while continuing to exclude the
  rejected Batch 4 Gemini output. The post-Batch-5 baseline is 1,816 top-level items; the remaining
  under-target categories are Management of Care (-28), Reduction of Risk Potential (-12), and
  Safety and Infection Prevention and Control (-5).
- Allocated the aggregate order 22/8/6 across those categories. Each lane receives the same 11/4/3
  category burden, 6 highlights / 4 bowties / 3 dropdown clozes / 3 matrices / 2 ordered responses,
  and 7 easy / 8 medium / 3 hard items.
- Expanded Management of Care through the explicitly SHARED `Caregiver Role Strain & Family Coping`
  license as well as advocacy, conflict, confidentiality, and concrete transition failures. Every row
  fixes an affirmative premise and load-bearing decision; source-heavy and hard items are divided
  evenly between the two lanes.
- Preserved the minimal-commission design while adding two producer-facing improvements: each packet
  states its relationship to the aggregate order without requiring cross-packet context, and each
  source table pins the exact guideline section or rule supporting the keyed decision rather than a
  topic homepage.

Verification:
- Re-ran the coverage report against the 13 canonical banks plus provisional Batch 5 and confirmed
  the 1,816-item baseline and category/format/difficulty counts.
- Programmatically parsed both assignment tables and confirmed 18 rows per packet with exact
  11/4/3 category, 6/4/3/3/2 format, and 7/8/3 difficulty totals.
- Confirmed all assigned category/topic strings against `src/topics.ts`, schema version `2.0`
  against `src/types.ts`, and unused `gpt_balance6a_*` / `gpt_balance6b_*` ID namespaces.
- Performed targeted canonical-bank premise searches and checked the load-bearing source lanes
  against current CMS, HHS/OCR, DOJ/ADA/OVW, AHRQ, CDC, OSHA, SAMHSA, NICE, IDSA, ISPD, ASRA, ATS,
  Merck, and ASPR TRACIE materials.

### GPT Coverage Balance Batch 6 Raw Gate Preparation (Jul 16)

Completed in staging only:
- Received both 18-item drafts in `banks/banks-raw/` and restored the shortened 6B filename to the
  routable `gpt-balance6b-coverage-batch-2026-07-16.json`. Both drafts remain raw; neither has been
  independently approved, promoted, consolidated, or ledgered.
- Applied the canonical `Safety and Infection Prevention and Control` label to the final three items
  in each draft. The archived commissions predated the controlled-category rename and still carried
  the retired label.
- Repaired inline-rendering corruption in all 18 6B `meta.source` and `meta.skill_signature` fields.
  The copied response had interpreted source URLs as Markdown; the artifact scan confirmed that no
  stem, option, answer key, rationale, glossary, or bilingual learner-facing field was affected.
- Added the missing 40 mm Hg reference used by 6A's closed-world metabolic-alkalosis compensation
  calculation. In 6B, pinned the CDC guideline section supporting the supplied 1/4-inch nail limit
  and restored the sterile-tissue ultrasound-probe row to the commission's explicit sterilization
  boundary. The deterministic repair record is
  `scripts/patches/2026-07-16-gpt-balance6-inline-repair.ts`.

Verified:
- Both drafts contain exactly 18 standalone items and match their assignment manifests apart from
  the ratified Safety-category rename: each has the required 11/4/3 category, 6/4/3/3/2 format, and
  7/8/3 difficulty distribution.
- Batch 5 plus both Batch 6 drafts pass `validate-bank`; Batch 6 needs zero normalizer changes.
- No canonical/Batch-5/Batch-6 ID collisions, topic-license findings, rationale-reference hazards,
  or mechanical non-MCQ bias findings were found.
- The provisional combined coverage report is 1,852 top-level questions, with remaining top-level
  category gaps of Management of Care -12, Reduction of Risk Potential -9, Safety and Infection
  Prevention and Control -4, Health Promotion and Maintenance -3, and Basic Care and Comfort -1.
- Independent clinical/source adjudication, collision review, promotion, consolidation, ledger entry,
  census regeneration, and the full bank-content verification path remain required.

### GPT Coverage Balance Batch 5 Commission (Jul 16)

The completed producer order is now archived; see the raw-gate entry immediately below for the
arriving draft's current staging status.

Prepared:
- Added `GPT-COVERAGE-BALANCE-BATCH-5-SPEC-2026-07-16.md`, an 18-item standalone GPT producer
  commission planned from the 1,799-question canonical baseline after promotion of Batches 1–3.
- Allocated 8 Management of Care, 4 Pharmacological and Parenteral Therapies, 3 Safety and Infection
  Control, and 3 Reduction of Risk Potential items, with 7 easy / 8 medium / 3 hard and an exact mix
  of 7 highlights, 5 bowties, 3 dropdown clozes, and 3 matrices.
- Replaced the prior topic-level assignment style with an affirmative row-level manifest: every row
  now fixes the scenario and load-bearing decision, with targeted collision boundaries and a precise
  source lane supplied by the commission. Ordered responses, fill-in-the-blank items, visuals, and
  case-study repair are excluded because the selected targets do not support those formats as cleanly.
- Corrected the requested raw filename at commission time to the routable
  `gpt-balance5-coverage-batch-2026-07-16.json` convention while retaining `gpt_balance5_*` question
  IDs. Added a citation-placement guard against repeating CFR subsection labels inside choice
  rationales.
- Marked archived Batch 4 as discarded process history. Its rejected Gemini generation is not
  pending and receives no coverage credit.

Verification:
- Re-ran `npm run coverage-report` against all 13 current canonical banks.
- Confirmed canonical topic/category strings against `src/topics.ts`, schema `2.0` against
  `src/types.ts` and `src/schema.ts`, and the `gpt-` filename route against
  `lib/canonical-routing.ts`.
- Performed targeted canonical-bank premise searches for the 18 assigned scenarios and anchored each
  load-bearing rule to a specific government, professional-guideline, or current drug-label source.

### GPT Coverage Balance Batch 5 Raw Gate Preparation (Jul 16)

Completed in staging only:
- Performed the final producer-side pre-checker read of
  `banks/banks-raw/gpt-balance5-coverage-batch-2026-07-16.json`; all 18 answer keys, distractors,
  rationales, bilingual pairs, and closed-world rules were retained. The draft remains raw and has
  not been promoted, consolidated, or ledgered.
- Tightened four load-bearing source pins without changing learner-facing content: replaced the
  research-withdrawal guidance's historical pre-2018 paragraph number with current 45 CFR
  § 46.116(b)(8), replaced broad dialysis pages with the exact ESRD record-transfer rule and a
  destination-treatment/record checklist, added FDA's oxygen/fuel/ignition surgical-fire guidance,
  and extended the NICE fetal-monitoring pin to transducer repositioning and second-stage cautions.
- Added `scripts/patches/2026-07-16-gpt-balance5-final-review.ts` as the declarative record of the
  four raw-stage provenance corrections.
- Archived the completed producer order as
  `Archive/GPT-COVERAGE-BALANCE-BATCH-5-SPEC-2026-07-16.md`.

Verification:
- Raw normalization: 0 structural changes; validation passed for all 18 questions; strict bilingual
  parity produced no warnings.
- Exact commissioned category/topic/item-type/difficulty assignment remained 18 of 18. The bank has
  8 Management of Care, 4 Pharmacological and Parenteral Therapies, 3 Safety and Infection Control,
  and 3 Reduction of Risk Potential items; 7 highlights, 5 bowties, 3 dropdown clozes, and 3
  matrices; 7 easy, 8 medium, and 3 hard.
- Explicit raw-versus-bundled ID comparison found 0 collisions. Targeted phrase search and a
  stem/prompt/rationale similarity sweep found no material semantic duplicate; the largest lexical
  matches were expected shared vocabulary for anion-gap calculation and fetal monitoring, with
  different premises and tested decisions.
- `npm run audit`: gate passed with the pre-existing advisory non-MCQ visual distribution warning
  only; the integrity lane correctly reports one raw draft not yet promoted.
- `npm run test:topic-vocabulary`, `npx tsc -b --pretty false`, `npm run census:check`, `npm run
  build`, and `git diff --check`: passed.

### GPT MOC/SIC + Coverage Balance Batches 2/3 — Promoted (Jul 16)

The three raw drafts covered by the "Raw Gate Preparation" and "Commission" entries below (`gpt-mocsic-coverage-batch-2026-07-15.json`, `gpt-balance2-coverage-batch-2026-07-15.json`, `gpt-balance3-coverage-batch-2026-07-16.json`) cleared independent Claude content review and are now promoted: 54 standalone items merged into `banks/gpt-canonical.json` (574→628). All raw drafts had originally been named with an underscore after `gpt` rather than the `gpt-` hyphen prefix `lib/canonical-routing.ts` requires for `gpt-canonical.json` routing; renamed both the raw and staged-promoted copies before consolidating (question `id` values, already `gpt_*`-prefixed, were untouched). One post-consolidation `audit:references` false positive — an inline-repeated `45 CFR § 164.524(b)(2)(i)` citation whose `(b)` tripped the option-letter hazard pattern — was corrected via `scripts/patches/2026-07-16-gpt-balance3-cfr-citation-hazard-fix.ts` (`patch-raw --allow-canonical`). `banks/banks-raw/` is now empty. Full verification (`normalize-raw-bank`, `promote`, `npm run audit` GATE PASSED, `consolidate`, `validate-bank` on all 13 banks, `test:topic-vocabulary`, `tsc -b`, `census`/`census:check`, `npm run build`) and per-batch content notes are recorded in `BANK-REVIEW-LEDGER.md`'s 2026-07-16 entry.

### GPT MOC/SIC Raw Gate Preparation (Jul 15)

Completed in staging only:
- Performed the final pre-checker review of
  `banks/banks-raw/gpt_mocsic_coverage_batch_2026_07_15.json`; the 18-item draft remains raw and
  has not been promoted, consolidated, or ledgered.
- Replaced one material semantic collision: the float-nurse/vasoactive-infusion conflict bowtie
  duplicated a live unsafe-assignment premise, so it now uses an interdisciplinary postoperative
  mobilization conflict with an inline reassessment policy.
- Removed one local fire-door motif overlap, clarified the correctional-client advocacy matrix,
  strengthened weak distractors in four items, and replaced broad topic-level references with
  sources that support each load-bearing rule.
- Added `scripts/patches/2026-07-15-gpt-mocsic-final-review.ts` as the declarative record of the raw
  transformations.
- Archived the completed producer order as
  `Archive/GPT-MOC-SIC-COVERAGE-BATCH-SPEC-2026-07-15.md`; the next commission remains active at the
  repo root.

Verification:
- Raw normalization: 0 structural changes; validation passed for all 18 questions.
- Strict bilingual parity: no warnings.
- `npm run audit`: gate passed with the pre-existing advisory non-MCQ distribution warning only.
- Explicit bundled-versus-raw ID intersection: 0 collisions.
- `npm run test:topic-vocabulary`: passed.

### GPT Coverage Balance Batch 2 Raw Gate Preparation (Jul 15)

Completed in staging only:
- Performed the final pre-checker review of
  `banks/banks-raw/gpt_balance2_coverage_batch_2026_07_15.json`; the 18-item draft remains raw and
  has not been promoted, consolidated, or ledgered.
- Replaced three material semantic collisions: a shared-infusion-pump conflict item became a
  family/quiet-hours conflict, a teach-back fill-in-the-blank became a transparent warm handoff, and
  an opioid-apnea ABG bowtie became residual neuromuscular blockade after rocuronium.
- Tightened load-bearing references for sickle-cell pain response, DESC conflict communication,
  closed-loop test-result follow-up, linezolid/SSRI serotonin syndrome, euglycemic ketoacidosis,
  utility failure, and postoperative neuromuscular-blockade recovery.
- Added `scripts/patches/2026-07-15-gpt-balance2-final-review.ts` as the declarative record of the raw
  transformations.

Verification:
- Raw normalization: 0 structural changes; validation passed for all 18 questions.
- Exact commissioned category/topic/item-type/difficulty assignment: 18 of 18 rows matched.
- Explicit bundled/other-raw ID intersection: 0 collisions; targeted final premise search found no
  duplicate quiet-hours, warm-handoff, or residual-neuromuscular-blockade scenario.
- `npm run audit`: gate passed with the pre-existing advisory non-MCQ distribution warning only.
- `npm run audit:references`, `npm run audit:positions`, `npm run test:topic-vocabulary`,
  `npx tsc -b --pretty false`, `npm run census:check`, and `git diff --check`: passed.

### GPT Coverage Balance Batch 3 Raw Gate Preparation (Jul 16)

Completed in staging only:
- Performed the final pre-checker review of
  `banks/banks-raw/gpt_balance3_coverage_batch_2026_07_16.json`; the 18-item draft remains raw and
  has not been promoted, consolidated, or ledgered. Removed the browser-added `(1)` filename suffix
  so the staging name matches the producer order.
- Replaced three material semantic collisions: the spontaneous-breathing-trial conflict bowtie
  duplicated the earlier interdisciplinary mobility-conflict structure, the interruption-response
  highlight repeated the earlier DESC-like behavior/impact/request pattern, and the elevated
  anti-Xa heparin sequence reskinned a live elevated-aPTT protocol. The replacements cover an
  interpersonal dispute compromising handoff, respectful reception of formative feedback, and
  neuraxial-catheter timing for prophylactic enoxaparin.
- Tightened load-bearing support for medication reconciliation and handoff closure, doxorubicin BSA
  dosing, SMOFlipid hypertriglyceridemia and pancreatitis cues, hazardous-drug spill PPE and skin
  decontamination, dialysis access-related hand ischemia, and suspected intraamniotic infection.
  Added the missing lipase reference interval, current NIOSH respiratory protection for spill
  cleanup, and KDOQI-aligned prompt referral language.
- Added `scripts/patches/2026-07-16-gpt-balance3-final-review.ts` as the declarative record of all raw
  transformations.
- Archived the completed Batch 2 and Batch 3 producer orders as
  `Archive/GPT-COVERAGE-BALANCE-BATCH-2-SPEC-2026-07-15.md` and
  `Archive/GPT-COVERAGE-BALANCE-BATCH-3-SPEC-2026-07-16.md`.

Verification:
- Raw normalization: 0 structural changes; validation passed for all 18 questions.
- Strict bilingual parity: no warnings.
- Exact commissioned category/topic/item-type/difficulty assignment: 18 of 18 rows matched; format
  totals are 6 bowties, 5 highlights, 3 dropdown clozes, 2 ordered responses, and 2 fill-in-the-blank
  items; difficulty totals are 7 easy, 8 medium, and 3 hard.
- Explicit bundled/other-raw ID intersection: 0 collisions across 15 peer files. Targeted phrase and
  same-topic similarity review found no remaining semantic duplicate.
- `npm run audit`: gate passed with the pre-existing advisory non-MCQ distribution warning only.
- `npm run test:topic-vocabulary`, `npx tsc -b --pretty false`, `npm run census:check`,
  `npm run build`, and `git diff --check`: passed.

### GPT Coverage Balance Batch 2 Commission (Jul 15)

Prepared:
- Added `Archive/GPT-COVERAGE-BALANCE-BATCH-2-SPEC-2026-07-15.md`, an 18-item standalone producer order
  planned against the bundled banks plus the assumed-promoted
  `gpt_mocsic_coverage_batch_2026_07_15.json` draft.
- Allocated 8 Management of Care, 4 Pharmacological and Parenteral Therapies, 3 Safety and Infection
  Control, and 3 Reduction of Risk Potential items so every projected under-target category improves
  after denominator growth.
- Assigned 6 bowties, 4 highlights, 3 fill-in-the-blank, 3 ordered-response, and 2 dropdown-cloze
  items, with exact STRICT category/topic strings, bank-derived premise exclusions, full rationale-
  reference coverage, and the producer-requested load-bearing source-granularity rule.

Planning verification:
- `npm run validate-bank -- banks/banks-raw/gpt_mocsic_coverage_batch_2026_07_15.json`
- `npm run coverage-report -- banks/banks-raw/gpt_mocsic_coverage_batch_2026_07_15.json`
- Confirmed current schema version and item-type contracts directly against `src/types.ts` and
  `src/schema.ts`; confirmed every commissioned category/topic pair against `src/topics.ts`.

### Visual Focus Dialog (Jul 15)

Completed:
- Added a shared focus mode to `VisualStimulus`, automatically covering standalone question visuals, case-part visuals, case exhibits, and rationale visuals without changing any visual kind contract or bank data.
- Added bilingual `Enlarge visual / 放大图像` and `Close / 关闭` controls. The explicit button and the visual itself open a native top-layer dialog; Close, Escape, and backdrop dismissal all return focus to the trigger and preserve the underlying answer state and page position.
- Kept exactly one rendered visual SVG mounted while the dialog is open, with a same-height source placeholder. This prevents duplicate fixed SVG ids such as `burn_map`'s clip paths while preserving layout and scroll state.
- Expanded vector visuals to the available dialog width. Tall visuals scroll vertically inside the dialog; wide calibrated tracings retain a readable minimum width and scroll horizontally on narrow screens. Structured-measurement exhibit tables remain a separate, unchanged stimulus path.
- Kept the first pass narrow: no custom zoom/pan controls, telemetry, storage changes, renderer changes, schema changes, or bank changes.

Verified:
- Pre-change and post-change `npm run test-visuals` passed, including the numeric `selfCheck` cases for `io_record`, `medication_label`, `device_screen`, and `burn_map`; `src/visuals/kinds/**` has no diff.
- `npm run test:exam-layout`
- `npm run validate-bank -- banks/*.json`
- `npx tsc -b --pretty false`
- `npm run build`
- Browser smoke at 1280x800 and 390x844 covered `lab_trend`, `vitals_trend`, `io_trend`, `rhythm_strip`, `capnography`, `fetal_monitoring`, and `burn_map`; answer preservation, one-SVG mounting, focus return, Close/Escape/backdrop dismissal, mobile horizontal scrolling, and fixed clip-path ids passed.
- Repeated-instance smoke used the two-rhythm-strip review rendering in `opus26_case_refeeding_syndrome_01`: opening one visual left the sibling instance intact. No bundled question currently has multiple `rationale.visuals`, so that exact loop has no committed browser fixture.
- Production-preview smoke passed with the built assets and no browser console warnings or errors.

### R9 Temperature Sanity Decoupling (Jul 15)

Completed:
- Decoupled the structured-measurement temperature tripwire from the legacy `VITAL_DEFS.temp.range`
  ceiling with a private, ceiling-only allowlist override. The temperature floor remains inherited and
  explicitly unratified; all six non-temperature vital sanity ranges remain unchanged and
  drift-guarded against `VITAL_DEFS`.
- Implemented the sourced and ratified canonical-Celsius ceiling from
  `r9-temperature-sanity-decoupling-codex-spec.md`, preserving GATE 4's warning-only semantics and the
  renderer's independent source-unit-specific authoring envelopes.
- Added focused GATE 4 regressions for correctly staged Fahrenheit values, Fahrenheit magnitudes
  mis-staged as `°C` and bare `C`, the inclusive ceiling, the first value above it, and both ends of
  the renderer-admissible Fahrenheit interval.
- Added colocated `vitals_trend` fixtures that pin `109 °F` as valid and `43.1 °C` as outside the
  unchanged renderer envelope. Generic visual conformance supplies the fixture render smoke.
- Re-ran the exhaustive survey after the GPT format-gap promotion: 104 structured temperature values
  across 13 canonical banks, canonical range 35.8–40.111 °C, zero unrecognized or unconvertible
  units, and zero values newly warned by the ratified ceiling.
- Regenerated the census after the promotion; bank counts were already current, while the generated
  timestamp and embedded Git SHA advanced to the promotion commit.

Verified:
- `npm run test:measurement-allowlist`
- `npm run test:flowsheet-gate`
- `npm run test:structured-measurements`
- `npm run test-visuals` (including kind-specific vitals tests, fixture render smoke, and visual parity)
- `npm run validate-bank -- banks/*.json`
- `npm run audit` (gate passed; existing advisory distributional warning remains)
- `npx tsc -b --pretty false`
- `npm run census && npm run census:check`
- `npm run build`

### Documentation Architecture Pass: `DECISIONS.md` Constitution (Jul 14)

Completed:
- Reworked `DECISIONS.md` into an architectural constitution: expanded the status vocabulary to ACTIVE / CONDITIONAL / PARKED / REVISIT / SUPERSEDED, tagged every numbered principle (1–27, excluding the intentionally unused 13–14) with exactly one status, and rebuilt the decision index around the five buckets.
- Narrowed principles 2, 5, 6, 10, 16, 21, 23, 24, and 26 to their durable constitutional core, moving exact metrics, field shapes, and closed chronology owned by code or by the (already-reconciled) exhibit-flowsheet extraction contract out of the principle bodies.
- Grouped principles 8, 9, 12, 18, and 22 as one "Conditional lane contracts" section describing the forward case-generation pipeline, binding only while that lane is active, with the current GPT-5.6 Sol producer assignment stated once so a future producer swap touches one line instead of five principles.
- Parked principle 20 (pronunciation/audio) to its safety-boundary core plus resumption triggers, moving the full distribution/pricing/codec architecture to archive.
- Resolved principle 6's direct conflict with `AGENTS.md`: both now agree that curated licensed clinical imagery is permitted through a separate provenance/licensing/review lane, not banned outright.
- Archived the full condensed history — forcing incidents, exact historical metrics, superseded prior wordings, and closed flowsheet-extraction rulings now owned by the extraction contract — to [`Archive/DECISIONS-ARCHIVE-2026-07-14.md`](Archive/DECISIONS-ARCHIVE-2026-07-14.md).
- `AGENTS.md` required no edits: its principle 5 / 27(a) / `CANONICAL_PREFIXES` references, curated-licensed-image allowance, and risk-tiered verification table already agreed with the new rulings.

Verified:
- Every numeric/field claim retained in the narrowed principles (`NCLEX_CATEGORY_WEIGHTS`, `STANDALONE_SPLIT_VISUAL_KINDS`, `max_cell_deviation_pp`/`template_repeat_max_share`, `SchemaVersion` union, `CANONICAL_PREFIXES`, the `/^opus\d*_/` routing matcher) checked directly against `src/schema.ts`, `src/examLayout.ts`, `scripts/audit/non-mcq-bias-lib.ts`, `src/types.ts`, `lib/canonical-routing.ts`, and `scripts/audit/early-bank-semantic-layer-a.ts`.
- `git diff --check` passed; no code, bank, schema, or clinical content changed.

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
- Resolved by PR #45 (2026-07-13): the case-part GPT rescue action now renders below its part rationale in the shared `CaseActivePart` component, matching the standalone order ratified in this pass.

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
- Candidates 02A through 11B (Batches 02–11 supplement records) were reviewed and promoted across `gemini-canonical.json`, `gpt-canonical.json`, `claude-canonical.json`, and `hard-cases-canonical.json` in the Claude Code gate-review seat, each independently re-gated before writing. Full candidate-by-candidate detail (which refs, which commits, which WARNs were adjudicated) is archived in [`Archive/exhibit-flowsheet-migration-2026-07-13/PROJECT-HISTORY-CANDIDATE-CHRONOLOGY-2026-07-13.md`](Archive/exhibit-flowsheet-migration-2026-07-13/PROJECT-HISTORY-CANDIDATE-CHRONOLOGY-2026-07-13.md) and `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md`.

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
- Staged and checker-seat-adjudicated Batches 01–20 across all four manifest buckets (`clean_kv`, `prose_embedded`, `scattered`, `serial`), landing several gate/detector fixes along the way (GATE 2 ABG completeness patterns, a duplicate-current-label hard FAIL, Greek-mu and ASCII CBC unit variants, a relative-timestamp serial detector, Unicode SpO₂ recognition). Batch 19's bare `skip_serial` bulk-staging was checker-adjudicated as **not clean** (14 of 28 records misclassified); Batch 20 re-derived the same 28 refs via content-aware source review and closed the `serial` bucket cleanly. With `prose_embedded`, `scattered`, and `serial` all closed, the refreshed exhibit-flowsheet values-only migration was fully staged and adjudicated. Full batch-by-batch detail (per-batch gate counts, which records held/re-dispositioned, and why) is archived in [`Archive/exhibit-flowsheet-migration-2026-07-13/PROJECT-HISTORY-CANDIDATE-CHRONOLOGY-2026-07-13.md`](Archive/exhibit-flowsheet-migration-2026-07-13/PROJECT-HISTORY-CANDIDATE-CHRONOLOGY-2026-07-13.md) and the individual `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-*-ADJUDICATION-*.md` files under that archive directory.

Verification:
- `npm run test:measurement-allowlist` passed.
- `npm run test:flowsheet-gate` passed.
- `npx tsc -b --pretty false` passed.
- `npm run test-visuals` passed.
- `npm run flowsheet-blind-score` passed (12/12).
- `npm run validate-bank -- banks/*.json` passed.
- `npm run build` passed with the existing Vite chunk-size warning.
- Every staged batch (01 clean_kv, 02–09 prose_embedded, 10–20 scattered/serial) gated and was checker-seat adjudicated before the next batch opened; per-batch gate counts and adjudication files are in the archive pointer above.

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

**No structured-measurement candidate promotion work is waiting to resume.** Candidates 12A through
20E, the 13H dissolution/re-disposition, the 12G gallstone re-extraction, the refeeding-baseline
multi-column promotion, and the R9 pediatric-detector week-unit/day-unit fixes were all reviewed and
closed between 2026-07-11 and 2026-07-13; Schema 2.0 landed (PR #23) partway through and every
still-open candidate was re-reviewed against it before promotion. No flowsheet holds or flagged Rule F
tag disputes remain open. The full candidate-by-candidate reasoning (why 12G/13H/16E-THA were held and
how each was later resolved, the Rule F boundary refinements, the R9 fixes) is archived in
[`Archive/exhibit-flowsheet-migration-2026-07-13/PROJECT-HISTORY-CANDIDATE-CHRONOLOGY-2026-07-13.md`](Archive/exhibit-flowsheet-migration-2026-07-13/PROJECT-HISTORY-CANDIDATE-CHRONOLOGY-2026-07-13.md);
the ledger of record is `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md`; current gate/applicator
behavior is owned by `scripts/exhibit-flowsheet-gate.ts` and `scripts/apply-structured-measurements.ts`.

Genuinely open backlog, unrelated to the closed flowsheet migration:

- Add browser automation to the verification baseline when Playwright or the in-app browser tool is available.
- Extend shared grading regressions when new item types are added.
- Continue bank expansion guided by `npm run census` (structured) and `npm run coverage-report` (Markdown prompt parameters).
- Consider optional live Gemini generation only if still wanted.
- Consider optional remote bank update flow if manual bundled-bank updates become annoying.
