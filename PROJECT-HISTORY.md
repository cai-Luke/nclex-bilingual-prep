# Project History

This is the living status record for Project Shrimp / NCLEX Bilingual Prep. It records accepted, merged current state: update it when a meaningful implementation pass is accepted and merged, verification status changes, or the active scope moves. An implementation branch may defer publication; the post-review publishing or merge seat writes the status entry.

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

### DECISIONS Format Parser and Conformance Checker (Jul 28)

Merged the ratified `DECISIONS.md` target-format instrument. `lib/decisions-format.ts` is the shared
filesystem-independent parser for live entries, attachments, the derived index and declared total,
both archive addressing modes, archive-index pointers, the retired-identifier register, sentence
boundaries, and the closed parser/conformance reason-code sets. The explicit
`scripts/decisions-format-conform.ts` CLI owns repository and Git-index access; the legacy live
`DECISIONS.md` remains intentionally unwired until migration.

The checker enforces field grammar and ordering, kind/status and section compatibility, permanent-ID
allocation across live and registered identifiers, bidirectional index/body equality and order,
declared-total consistency, tracked `Evidence`/`Owner` paths, live reuse of either `RETIRED` or
`NEVER ASSIGNED` identifiers, and archive pointer file/anchor resolution. Entry-heading and archive
anchors use the same run-collapsing Markdown-anchor algorithm; malformed declared-total syntax does
not also emit a missing-total finding.

`npm run test:decisions-format` passes F1–F13, M1–M19, C1–C8, the full kind/status matrix, archive
file/anchor and `NEVER ASSIGNED` regressions, the obsolete double-hyphen anchor control, and the
independent four-defect CLI negative control. The repaired direct CLI control exits 0, the negative
control exits nonzero with all four injected findings, and `npx tsc -b --pretty false` passes.
Reference-graph hardening, document migration, production gate wiring, and archive creation remain
separate later commissions.

### Exam-Condition Calculator (Jul 26)

Added an ordinary-arithmetic calculator to active study, test, and adaptive
questions. The production component uses an immediate-execution pure TypeScript
model, stays temporary to the current session/question, preserves work across
case-study parts, and resets/minimizes at each new top-level question or session.
Desktop presentation is an 18 rem lower-right panel with pointer/mouse dragging,
8 px viewport clamping, resize re-clamping, and temporary question-card clearance
that keeps the stem and left clinical visual readable. Mobile presentation is a
safe-area-aware bottom sheet with its launcher above the sticky action bar.

Preview Lab exposes the same production component. Focused calculator regressions,
TypeScript, the production/file build, and browser smoke inspection at 1280 × 800,
1440 × 900, and 390 × 844 passed across the dopamine, heparin-label, Parkland,
I&O, device-screen, and multi-part case-study layouts. No schema, grading, bank,
storage, telemetry, or clinical-content contract changed.

### Candidate Orchestrator and Promotion Enforcement — Raw-Gate Commission 2 (Jul 23)

Merged the prospective raw-candidate gate in PR #83. `npm run gate:raw -- --file <path>`
now evaluates exact deterministic promotion previews without writing to the repository, separates
candidate-local findings from candidate-set findings, and returns the prepared serialized outputs
that `npm run promote` stages after a complete-set pass. Promotion no longer creates or changes
staging when any selected candidate fails.

The candidate-local lane blocks preparation, routing/schema-version incompatibility, strict
validation, reference hazards, producer/checker leakage, every strict stage-reference finding, and
exact topic-vocabulary/license defects. The candidate-set lane blocks candidate-attributable ID
collisions, scored-leaf MC position failures, and enforced mechanical non-MCQ bias; distributional
and manual non-MCQ findings remain advisory. Explicit comparison populations are authoritative and
do not fall back to repository canonicals.

`prepareRawPromotionPreview` is the single transformation owner: parse, detect normalization debt,
check and strip valid compile manifests, validate strictly, shuffle deterministically, normalize
presentation order, revalidate strictly, and serialize canonically. Focused integration coverage
pins read-only behavior, external temporary cleanup, raw-format handling, stage/topic policy,
candidate/canonical/comparison/embedded collisions, post-shuffle position inspection, mechanical
enforcement and its diagnostic override, advisory distribution findings, deterministic reports,
and all-or-nothing promotion writes.

The full tooling verification floor passed, including all bank validations, aggregate audit,
focused regressions, TypeScript, census drift check, and production build. No canonical bank,
ledger, census artifact, schema, grading path, or learner-facing behavior changed. Canonical
stage-reference findings remain advisory and are not evaluated under the prospective raw policy.

### Audit Scope Parameterization — Raw-Gate Commission 1 (Jul 23)

Merged the audit-scope substrate required by the forthcoming raw gate. Six runners now accept an optional explicit file population through `{ files? }`: `runValidateBank`, `runAuditReferences`, `runAuditPositions`, `runAuditTopicLicense`, `runAuditProducerVocabulary`, and `runAuditAuthorialConstraintLeakage`. `runAuditIds` instead accepts `{ candidates?, comparison? }`, because a candidate-only scope would miss IDs that collide with canonical banks. `runAuditStageRefs` and `runAuditNonMcqBias` were already scoped.

`scripts/audit/audit-integrity.ts` remains deliberately unscoped. It is a post-staging equality proof, and its pure `integrityForFile(draftText, promotedText)` core already accepts text rather than paths.

The established contracts are:

- No-argument runner behavior is unchanged. `scripts/audit.ts` was not edited, and the aggregate audit output and verdict remain unchanged.
- Explicitly selected files fail loud: a missing, unreadable, malformed, or schema-invalid requested file returns `FAIL` rather than inheriting a default sweep's skip behavior.
- Candidate-scoped ID auditing reports only collisions involving at least one candidate location. Comparison-only collisions cannot be attributed to candidates or poison subsequent candidate runs.
- Resolved paths are the deduplication and population-membership identity; the first caller-supplied spelling remains the display label. Candidate membership wins when the same resolved path appears in both populations.
- Standalone wrappers reject unknown, missing, and whitespace-only arguments, and exit 1 on `FAIL`. `audit-topic-license` retains `--output=<path>` and composes it with repeated `--file` selections.

Shared implementation support lives in `lib/selected-file-paths.ts`; focused temporary-bank fixtures in `scripts/test-utils/audit-scope-fixtures.ts`; and `scripts/tests/audit-scope-cli.ts` exercises all seven wrappers as real subprocesses. The work order of record is `RAW-GATE-COMMISSION-1-AUDIT-SCOPE-PARAMETERIZATION-CODEX-SPEC-2026-07-23.md`.

This pass adds no new audit check and no new verdict policy. Commission 2 remains responsible for the candidate-local read-only `gate:raw` orchestrator, stage-anchor fatality policy, candidate-versus-candidate-set verdict lanes, raw-format handling where required, and promotion-time consumption.

Two preserved behaviors are intentional rather than defects: `runAuditPositions` still examines only top-level `multiple_choice` items and does not recurse into embedded case-study parts, and the explicit loaders retain each runner's existing validator profile rather than preprocessing raw-only formats.

The seven commissioned wrappers set `process.exitCode = 1` on failure and terminate naturally, allowing asynchronous stdout and stderr to drain completely. A static regression prohibits `process.exit()` in these wrappers, and the subprocess matrix preserves the expected exit statuses.

### Stage-Reference Semantic Census Preparation (Jul 23)

Prepared the deterministic Stage A population and blind-calibration dispatch surface for the
stage-reference semantic census. The current live corpus rederived 451 `revealsAllStages` targets
across 93 parent cases and packed them, without splitting cases, into 76 full-run packets. The
architect-selected 32-target calibration set spans 12 parent cases and materializes into nine
Gemini-facing shards; selection reasons and the checker-owned hidden verdict key remain outside
those shards.

Task-local builders, validators, manifests, packets, calibration shards, hash attestations, and the
delivery record live under `audit/stage-reference-semantic-census-2026-07-23/`. The hidden
calibration key remains local and ignored because the repository is public. No runtime, bank,
schema, grading, ledger, census, or learner-facing behavior changed.

### Terminal-Sentence Remediation (Jul 22)

Completed the owner-authorized 35-row remediation across the Claude, Gemini, GPT, and hard-case
canonical banks: 34 rows were repaired and queue 162 was retired after its pre-authoring source test
found no explicit policy capable of supporting the full delegation matrix without an invented
nationwide scope. The exact retired payload and retained-payload/order proof are archived under
`Archive/terminal-sentence-remediation-2026-07-22/` and
`audit/terminal-sentence-remediation-2026-07-22/`.

Codex produced the content-gated replacements and Claude Opus 4.7 independently approved all 17
before application. Queue 1731 retained all six live clozapine case parts and rewrote `_q5` in
place after folding already-initiated neutropenic precautions into the Stage-2 state. Queues 2123
and 2228 survived rewrite-first review; no disclaimer-dependent D5 retirement fired. Queue 2235
remained present and untouched, and `DECISIONS.md` was not changed.

The resulting corpus has 1,891 session units and 2,477 scored leaves. The full bank-content
verification floor passes; the audit retains only its 451 pre-existing stage-reference advisories.

### Lab-Trend Epic-Style Dual-Series Migration (Jul 21)

Migrated all nine promoted two-series `lab_trend` records to a learner-facing normalized presentation
without changing schema, bank content, grading, validation, `selfCheck`, clinical ranges, or the
registered deterministic renderer. Each series is plotted as percent change from its own first value
on one fitted percentage scale, with an explicit zero baseline, separate solid/circle and
dashed/diamond identities, timepoint hover/focus/tap readouts, legend-driven series and table-row
emphasis, and a visible semantic exact-value table. The 11 one-series records retain their prior
fitted numeric chart. A schema-valid two-series record with either baseline equal to zero now takes a
discriminated `legacy_fallback` path that preserves the legacy graph and still supplies the exact
table; all nine promoted records take the normalized path.

The table and readout remain values-only under active Decision 30: no H/L badges, normal indicators,
reference-range columns, or alternate-unit range interpretation were added. The registered
`renderLabTrendSvg` parity owner remains byte-identical. A dedicated complete-corpus snapshot, sorted
by question ID and visual object path, records separate SHA-256 hashes for stable presentation-model
JSON and the new presentation SVG. Focused coverage also pins percent math, fitted mixed-direction
scales, zero-baseline fallback, authored/canonical unit display, pediatric trajectory-only behavior,
identical normalized trajectories, interaction state, print CSS, and exact pre/post validation,
`selfCheck`, authored-spec, and registered-SVG equality.

Browser proof covered Developer Review and Preview Lab at 1280×800 and 390×844, the renal,
INR/platelets, and correlated Hgb/Hct records, first/middle/final exact readouts, legend and row
identity, Enter/Space pinning without accidental enlargement, zero page overflow in Preview Lab,
mobile shrinking, focused 600 px internal graph scrolling, one-SVG mounting, table reachability,
pinned-readout preservation, focus return, body-scroll restoration, and Summary/review. The only
console entries during the live-edit session were Vite HMR duplicate-registration reload messages;
fresh reloads and production verification introduced no application warning or error. Print rules
hide transient controls/readouts and expose the complete graph and semantic table.

Verification: `test:lab-trend`, `test-visuals`, all 13 promoted-bank validations, `test:exam-layout`,
TypeScript, production build plus build-identity validation, and `git diff --check` passed. No bank,
ledger, census, schema-version, or promoted-parity snapshot changed.

### Root Work-Order Cleanup (Jul 21)

Moved three closed or superseded July 21 work orders out of the repository root and into
`Archive/root-cleanup-2026-07-21/`: the completed GPT scored-format construct audit commission, the
rejected Gemini terminal-sentence census commission, and the completed Gemini 3.6 Flash bounded
pilot. Their audit evidence remains in the corresponding `audit/` directories, and the July 16
outer-ring work order now points to the archived construct-audit vocabulary source.

The lab-trend Epic-style dual-series work order was subsequently completed and joined this archive;
the Sonnet terminal-sentence semantic census and post-review terminal-sentence adjudication work
orders remain at root because they are still open. No runtime or bank behavior changed in the
original cleanup pass.

### GPT July 15–16 Construct-Disposition Audit Implemented (Jul 21)

Implemented the owner-accepted disposition from the 108-item GPT coverage-batch outer-ring audit.
The final ruling was 58 KEEP / 13 FIX / 37 RETIRE: all 37 retirement payloads were removed from the
live GPT bank and archived, while the 13 FIX payloads were removed from delivery and preserved in a
separate repair quarantine rather than permanently retired. `gpt-canonical.json` changed from 771 to
721 questions. Exact pre/post identity proof confirms that all 50 targeted IDs are absent and every
one of the 721 retained payloads, plus their order, is unchanged.

The exact-removal coverage analysis found no category-topic pair reduced to zero and no operational
category shortfall for a 50-question session. The 32 replacement-conditional retirements therefore
resolve to `NO_IMMEDIATE_REPLACEMENT_GENERATION`; ordinary future topic/format priorities remain
separate planning inputs, not one-for-one obligations. The retired and quarantined payloads are
recoverable under `Archive/gpt-july16-construct-dispositions-2026-07-21/`, and the complete evidence,
coverage impact, and implementation closeout live under
`audit/july16-coverage-construct-audit-2026-07-21/`.

Verification: all 13 banks validated; aggregate audit gates and grading/highlight/bowtie/schema-bank/
topic-vocabulary/topic-license regressions passed; TypeScript passed; coverage and census regenerated
at 1,892 session units / 2,478 scored leaves / 199 visual artifacts; `census:check`, production build,
and `git diff --check` passed.

### Authorial-Constraint Leakage Survey and Narrow Gate Implemented (Jul 21)

Added a separate learner-surface survey for producer/checker constraints that appear as learner
instructions, preserving the existing producer-vocabulary audit unchanged. The 13-bank baseline
(1,942 top-level questions / 2,528 scored leaves) found exactly one bilingual item with four affected
paths: the English/Chinese final-sentence disclaimers and paired strategy clauses on the
exercise-associated-hypoglycemia bowtie. The disclaimers were removed and the strategies were
naturalized declaratively without changing choices, keys, rationales, scoring, IDs, or populations;
the existing choices and rationale continue to carry the nursing-scope boundary.

The prospective Tier-1 gate blocks only the confirmed imperative/gerund signatures on task/strategy
surfaces and the two exact observed Chinese counterparts. Broader scope-shaped instructions remain advisory to
avoid collisions with legitimate options, rationales, client teaching, and Management of Care items.
Active/portable producer prompts and governance now explicitly keep authoring constraints off learner
surfaces. Independent non-GPT review then verified the exact four-field bank diff, complete live
bowtie answerability and scope preservation, bilingual parity, focused negative tests, governance
changes, and the full verification floor; the ledger status is now `REVIEWED` / `fixed-and-validated`.

Post-closeout correction: architect review found a second semantic residual outside the finite
signatures, so the one-item/zero-residual language is not an exhaustive-recall claim. The occupational
HIV PEP ordered-response item had exposed an adjudication note and forced source-patient testing,
exposed-worker baseline testing, and PEP initiation into a misleading serial structure. A declarative
14-field EN/ZH rewrite now limits the ordered actions to exposed-worker care, combines urgent baseline
collection and PEP initiation in one step, and keeps source testing only as a concurrent rationale
fact that cannot delay PEP. Independent non-GPT review subsequently cleared the sequence, all 14
changed EN/ZH fields, source-testing placement, narrow advisory configuration, governance language,
and verification floor. The original bowtie review remains closed, and the PEP residual is now
`fixed-and-validated`.

### Hemodialysis Access Highlight Coherence Regeneration (Jul 21)

Regenerated `gpt_format10b_hemodialysis_access_prompt_followup` after a learner report and GPT
architect adjudication identified an internally incoherent checklist-collage scenario. The prior
passage simultaneously described the fistula's usual continuous thrill and a new weak/discontinuous
thrill, plus both a warm and a cool access-side hand, while combining stenosis, purulent infection,
threatened aneurysm skin, severe distal ischemia, and prolonged bleeding into one client.

The replacement remains a medium `highlight` / `recognize_cues` item in Reduction of Risk Potential,
but now tests only AV fistula stenosis/dysfunction. Four selectable targets are independently stated:
new abnormal thrill/bruit, failure to reach prescribed target blood flow, new cannulation difficulty,
and bleeding longer than usual after three consecutive sessions. A warm, well-perfused hand and a
small resolving cannulation bruise are the two non-targets. All learner-facing English/Chinese text,
answer references, rationales, strategy, glossary, and source metadata were regenerated together;
infection, aneurysm, and ischemia content was removed.

The replacement was checked against the National Kidney Foundation KDOQI 2019 clinically significant
AV-access-lesion implementation tool, pp. 2–3. The declarative canonical patch applied with zero
bilingual-parity warnings and preserved bank count and identity fields. All 13 banks validated; the
highlight regression and aggregate audit passed (2,673 globally unique IDs; only the pre-existing
stage-reference advisory and expected no-raw-draft integrity notice); coverage remained 1,942 session
units / 2,528 scored leaves / 199 visual artifacts; census regeneration and `census:check`, TypeScript,
production build, build-identity validation, and `git diff --check` passed.

### Learner-Facing Temperature Prose Survey Accepted (Jul 21)

Completed and architect-accepted the deterministic read-only survey under
[`TEMPERATURE-PROSE-UNIT-SURVEY-CODEX-SPEC-2026-07-21.md`](TEMPERATURE-PROSE-UNIT-SURVEY-CODEX-SPEC-2026-07-21.md).
After the separately reviewed hemodialysis-access regeneration removed one bilingual temperature
display, the stable 13-bank snapshot contains 488 learner-facing temperature-prose occurrences across
137 owning items: 468 mechanically safe migration rows, five already-canonical rows, and 15 review
residuals. The residual rows reduce to five semantic decisions: nine dual-display mismatches across
four contexts and six temperature-delta expressions in one bilingual rationale. Sixteen additional
`COUNTERPART_MISSING_TEMPERATURE` rows remain classified as pre-existing parity debt, not authority to
add clinical facts during unit normalization.

The survey implementation, focused traversal/arithmetic regression, full manifest, safe subset,
residual file, and report live under `scripts/audit/`, `scripts/tests/`, and
[`audit/temperature-prose-unit-survey-2026-07-21/`](audit/temperature-prose-unit-survey-2026-07-21/).
Focused tests, all-bank validation, TypeScript, census freshness, diff checks, and a byte-identical
repeat run passed. The survey itself changed no canonical bank, schema, renderer, package script,
ledger, or census.

The follow-up residual adjudication is recorded in
[`residual-adjudication.jsonl`](audit/temperature-prose-unit-survey-2026-07-21/residual-adjudication.jsonl),
with a deterministic generator and concise report. It consumes all 15 residual occurrences exactly
once across five decisions and 11 target fields. Each target pins the complete field preimage, owner,
path, occurrence identity/index, exact replacement or complete rewrite, and resulting field hashes.
The neutropenic-fever threshold preserves the ASCO/IDSA published `101 °F (38.3 °C)` pair; the
transfusion delta rewrite uses multiplicative conversion and the AABB `≥1.8 °F (1 °C)` threshold.
The separately commissioned closed migration then consumed only the 468-row safe subset and the
five-decision adjudication. It changed 483 authorized occurrences across 439 exact string fields in
`claude-canonical.json`, `gemini-canonical.json`, `gpt-canonical.json`,
`hard-cases-canonical.json`, and `vitals-canonical.json`. Complete field preimages were verified before
application, multiple operations were applied right-to-left, and an idempotent rerun required no
write. Typed/visual/structured temperature payloads remained outside scope, and none of the 16 known
counterpart-missing rows gained or lost a clinical fact.

The migration receipt is
[`migration-receipt.json`](audit/temperature-prose-unit-survey-2026-07-21/migration-receipt.json).
A separate parsed-object checker proved exactly 439 authorized string diffs and 483 occurrence IDs,
with no structural or extra-value change. The post-scan contains 486 paired expressions: 480 raw
`ALREADY_CANONICAL`, two scanner `SAFE` labels whose proposals are exact no-ops, and four classifier
rows in the already-adjudicated bilingual delta rationale (the original six single-unit delta tokens
collapsed into four paired expressions). Thus zero actionable safe rows and zero unadjudicated
residuals remain. All 13 banks validated; measurement tests, the aggregate audit, coverage, census,
TypeScript, production build, build identity, and diff checks passed. Coverage remains 1,942 session
units / 2,528 scored leaves / 199 visual artifacts; the audit retained only the pre-existing no-raw-
draft notice and 451 stage-reference advisories.

### MAR Table Readability Repair (Jul 20–21)

Forcing incident: `gpt_fresh_2026_06_22_vis_06` — learner report of final-row text overflowing into neighboring cells.

**Renderer/primitive boundary:** The shared `table.ts` primitive received opt-in extensions: `containCells` flag, `columnHeaderLines` on DocTableInput, `rowHeight` on DocTableRow, and `displayLines` on DocTableCell. When opt-in is active, every cell renders inside a nested SVG viewport with `overflow="hidden"`; no cell can cross a column divider or row boundary. No global `<clipPath>` IDs are emitted. The legacy call path (all existing non-MAR callers) remains byte-identical.

**MAR renderer policy (`mar/index.ts`):** Added deterministic `wrapText` helper (whitespace breaks, hyphen breaks, Han full-em width, hard-break fallback). Uses a four-class character width estimator to conservatively fit wide glyphs (`M`, `W`, `@`, etc.). Canvas width: `max(600, round(56 × (5.5 + timeGrid.length)))` — 600 units through five slots, wider for denser grids. Body row height: `max(28, N × 14 + 14)`. Header height: `max(32, N × 13 + 12)`. Single `DocTableInput` passed to both `measureDocTable` and `renderDocTable`; root SVG emits intrinsic `width` and `height` from measured values. No schema, selfCheck, validation, or bank file changes.

**CSS:** Removed `.vis-mar` from the shared `overflow-x: visible` group and the shared `max-width: 37.5rem` / `min-width: 37.5rem` ordinary and focus-mode groups. Replaced with MAR-specific `overflow-x: auto` on the wrapper, and `width: auto`, `min-width: 600px`, `max-width: none` on the SVG to strictly preserve emitted intrinsic sizing, in both ordinary and focus mode.

**`scripts/tests/mar.ts` added** — wired into `test-visuals` after `injection-site.ts` and before `visuals-conformance.ts`. Covers §6.1 assertions 1–20 and §6.2 shared primitive non-regression, including tight viewport containment, specific height comparisons against measureDocTable, and wide-glyph lines checked against an independent conservative width bound.

**Verification commands and results:**
- `npx tsc -b --pretty false` — clean
- `npx tsx scripts/tests/mar.ts` — all dedicated MAR and shared-table assertions passed
- `npm run test-visuals` — all stages passed (199 promoted parity snapshots)
- `npm run validate-bank -- banks/*.json` — all banks OK
- `npm run build` — clean build
- `git diff --check` — clean

**Browser proof:** On desktop, ordinary and focus MARs retained a 600 CSS-pixel canvas with no nested scrollbar for current records, no cell overflow, and no page-level horizontal overflow. At a 390×844 viewport, ordinary and focus MARs retained the 600-pixel canvas inside 323/354-pixel scrolling containers, with the final row reachable and no page-level overflow. The forcing record, long combination-drug/PRN rows, long hyphenated antibiotic, and compact control all remained contained. Focus close restored body scrolling and focus to the enlarge control; no browser console warning/error was introduced. The synthetic six-slot model resolved to 644 units with a 56-unit minimum fraction.

**Parity rebaseline:** `--scope mar`; authoritative receipt: `audit/visual-parity-rebaseline-2026-07-21T04-26-37-563Z/receipt.json`. It records 11 changed, 0 added, 0 removed, and 188 unchanged; all 11 `mar` identities remain at `top-level-question`, with zero hash movement for every non-`mar` kind.

### Rationale-Visual-Floor Survey Retired (Jul 20)

Retired the dated 2026-07-16 `rationale-visual-floor-survey` census manifest and generator as completed at-migration snapshots. The live pacer-to-schema floor and six-location traversal invariants are preserved under `scripts/tests/rationale-visual-schema-floor.ts`. The `test-visuals` script no longer byte-compares live content to a frozen census.

### Lab Reference-Range Verification Implemented (Jul 19)

Closed the placeholder-range state in `ANALYTE_DEFS` with a sourced adult teaching-band table and a
separate warning-only sanity-envelope review. Full provenance, assay/method caveats, interval-selection
rules, the adult-vitals audit, and the exact changed ceilings are recorded in
[`audit/lab-reference-range-verification-2026-07-19.md`](audit/lab-reference-range-verification-2026-07-19.md).
The registry now carries adult bands only: published pediatric intervals divide by multiple age bands
and sometimes sex or assay, so the existing `peds_child` / `peds_infant` vocabulary was adjudicated as
insufficient rather than populated with unsafe aggregate ranges.

`lab_trend` now preserves pediatric trajectory-only use when every series explicitly sets
`showReferenceBand: false`; leaving the default band enabled fails validation with
`reference_band_unavailable`. Pediatric H/L assertions and `direction: "stable"` fail closed without a
verified band, while up/down trajectory assertions remain valid. Added a dedicated regression and
wired it into `test-visuals`; updated the schema and originating spec to point at the completed source
packet. Because reference bands affect rendered chart geometry, the governed `lab_trend` promoted-
visual parity rebaseline is also required before the visual suite can pass. The implementation was
written through the Desktop repository connector; the independent clinical-checker, parity, and local
shell receipts listed in the audit report remain pending.

### Root Markdown Cleanup (Jul 19)

Moved 17 completed or superseded root-level implementation specs, work orders, closed survey/
adjudication packets, and finished pilot-case commissions into
[`Archive/root-cleanup-2026-07-19/`](Archive/root-cleanup-2026-07-19/) and repaired references to their
new paths in this file, `BANK-REVIEW-LEDGER.md`, `DECISIONS.md`,
`NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md`, and the one live (if now-unreachable) code
constant in `scripts/visual-parity-baseline.ts` that names the promoted-visual-parity spec's path. A
file's own static status header was not trusted alone — several said "ready for generation" or "Open —
scoped, not yet commissioned" despite the corresponding work already being implemented and merged; each
was cross-checked against this file (and `DECISIONS.md` for the two vitals-trend files) before moving.

`VITAL-SANITY-BOUNDS-P3-SURVEY-ARCHITECT-SPEC-2026-07-17.md` (P3 stage 3 still open),
`NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md` (P5 still open),
`EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` (a living authority map, not historical spec
prose), `lab-reference-range-verification-spec.md` (active at the time of this cleanup; subsequently
implemented by the later Jul 19 milestone above), and `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md` (the living contract
for the now-standing episodic direct-case pathway) were surveyed and explicitly kept at root as still
live. See the archive's `README.md` for the full per-file disposition. No bank, schema, renderer, or
runtime behavior changed.

### Stage-Reference Audit Extended for Anchor-Omission Leakage (Jul 19)

Merged PR #72, closing the gap the direct-case pilot C/D repair surfaced: `audit:stage-refs` previously
only flagged a `stageId`/`answerableAfterStageId` value that was present but unresolved, so a part that
omitted the anchor entirely produced no finding — the case renderer (`getVisibleCaseStages` in
`src/examLayout.ts`) is cumulative and fail-open, and reveals **all** stages when neither anchor
resolves. `StageReferenceFinding` is now a `kind`-discriminated union (`unresolved`, the new
`revealsAllStages` leak check keyed on the renderer's actual resolution path rather than output length,
and `missingRequiredAnchor` under `--strict`). `runAuditStageRefs(options?)` stayed pure and
options-driven; `scripts/audit.ts`'s argument-free call is unchanged and can still only return
`PASS`/`WARN`/`INSUFFICIENT`, so the aggregate gate's fatality is untouched. A new `--file`/`--strict`
CLI wrapper supports auditing raw drafts directly, with `--file` failing loud on any missing/unreadable/
schema-invalid selected file.

The extended default sweep over current `banks/` found 451 pre-existing `revealsAllStages` findings
across 13 files (0 unresolved, 0 missingRequiredAnchor) — legacy `case_study` items authored before the
anchor system existed. This is recorded as a decision input for a possible later default-fatal flip; no
bank content was changed or migrated in this pass. Only `scripts/audit/audit-stage-refs.ts` and
`scripts/tests/audit-stage-refs.ts` changed.

### Responsive Vitals Helper Compacted (Jul 19)

Removed the Epic vitals readout panel's fixed desktop minimum height at every viewport. The idle
bilingual helper now hugs its wrapped text instead of reserving space for a populated readout;
selected-time values continue to determine their own natural height. Graph and focused-chart geometry
are unchanged.

At 1280×720, the idle panel measured 65 px around 42.2 px of bilingual text, while a keyboard-selected
five-value readout expanded naturally to 113.7 px. At the 390×844 proof viewport (375 px document client
width), those measurements were 86.1 px around 63.3 px and 162.9 px populated. Both layouts remained
free of horizontal overflow and the final console was clean. TypeScript, the production build, build
identity validation, and `git diff --check` passed; the existing Vite large-chunk advisory remains
unchanged.

### Unified Vitals Trend Experiment Concluded (Jul 19)

The real-user comparison concluded in favor of the Epic-style unified graph with the original
presentation's exact-value flowsheet retained beneath it. `vitals_trend` now has one application
presentation: the deterministic unified graph, interactive timepoint readout and legend emphasis,
followed by one visible semantic HTML values table derived from the same `buildVitalsTableModel` data.
The table scrolls within its own rounded frame when narrow and keeps the first vital-sign column visible.
Print continues to show the graph and complete table while hiding pointer-only controls.

Removed the experiment's `VitalsChartStyle` type, persisted setting/default, bilingual Settings control,
variant prop chain through all question/case/rationale/review surfaces, variant-aware split condition, and
Preview Lab comparison bucket. Vitals trends retain the measured 600 px desktop split route and appear in
Preview Lab with the ordinary split visual candidates. The legacy unit-pure renderer remains an internal
deterministic renderer/parity surface, not a user-selectable application arm; no bank, schema, grading,
clinical range, authored visual, or SVG byte contract changed.

Browser proof at 1280×720 measured the ordinary graph at 600×360.8 px, the values table at 598 px,
the visual/work split at 600 px + 537.8 px, and zero page-level horizontal overflow; the table remained
fully reachable at maximum page scroll. At a 390×844 viewport (375 px document client width), the graph
fit its 295.4 px Preview Lab column while the 360.1 px table scrolled only inside a 293 px frame; the
sticky first column remained aligned at maximum horizontal scroll and the page stayed overflow-free.
The complete table remained exposed in the accessibility tree in ordinary and focused views. Keyboard
pinning recovered the exact 6 h values and guide line, focus retained one 600 px SVG, and Escape restored
body scroll and focus to the enlarge button. The final browser console was clean.

Focused vitals and exam-layout tests, TypeScript, top-level bank validation, the production build, and
`git diff --check` passed. `npm run test-visuals` passed from a clean detached checkout of the exact
code commit, including all 12 kind suites, conformance and registry mechanics, 199 promoted
parity snapshots, the promoted survey, session sampling, and the rationale-visual-floor survey. The
existing Vite large-chunk advisory remains unchanged.

### Mobile Graph Fit-to-Width Pass Implemented (Jul 19)

Implemented
[`MOBILE-GRAPH-FIT-TO-WIDTH-CODEX-SPEC-2026-07-19.md`](Archive/root-cleanup-2026-07-19/MOBILE-GRAPH-FIT-TO-WIDTH-CODEX-SPEC-2026-07-19.md)
as a mobile presentation allocation, not an architectural reversal. Ordinary mobile Epic vitals,
unit-pure vitals panels, and one-series lab trends now scale their existing deterministic SVGs to the
question column. `io_trend` already fit responsively and gains only the reclaimed shell width. Expanded
Epic, panel-vitals, and lab views retain the 600 px design width and internal horizontal inspection.
Calibrated `rhythm_strip`, `capnography`, and `fetal_monitoring` behavior is deliberately unchanged.

At the 390×844 proof viewport (375 px document client width), the forcing Epic chart changed from a
275→600 px internal scroller to a 313→313 px fitted surface; its embedded thyroid-storm exhibit changed
from 213→600 px to 252→252 px. The one-series potassium lab chart changed from 273→600 px to 311→311 px,
and the panel-vitals composite from 273→600 px to 311→311 px. The existing I/O trend expanded from
273 px to 311 px without introducing overflow. A rhythm-strip control remained 576 px inside a 311 px
native-width scroller. No surface introduced page-level horizontal overflow. At 1280×800, the Epic
standalone split remained 600 px + 537.8 px with the chart at its unchanged 600 px design width.

The Epic overlay still scales with the SVG: timepoint and legend buttons align with their geometry,
Enter/Space and click/tap pin exact readouts without opening focus, and BP emphasis covers both pressure
series. The mounted-SVG synchronization now runs after every interaction commit so deterministic
inner-HTML recommits cannot erase guide/emphasis attributes. Overlay controls stop only their activation
keys, allowing Escape to reach the focus dialog. Browser proof covered exact 6 h and focused 4 h
readouts, guide placement, BP opacity, one-SVG mounting, 600 px focused geometry, Close/Escape/backdrop
dismissal, focus restoration, Preview Lab mobile stacking, the embedded exhibit, lab/panels focus, the
unchanged tracing scroller, desktop parity, and a clean cold-load console.

Focused vitals and exam-layout tests, bank validation, TypeScript, the production build, and
`git diff --check` passed locally. `npm run test-visuals` passed in a detached clean checkout of the exact
implementation commit, including all kind tests, conformance, registry mechanics, 199 promoted parity
snapshots, promoted survey, session sampling, and the rationale-visual-floor survey. The existing Vite
large-chunk advisory remains unchanged.

### Epic-Style Vitals Trend A/B Rendering Implemented (Jul 19)

Implemented
[`VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md`](Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md)
as a presentation-only A/B path with no bank, clinical-content, grading, or authored-visual-shape
change. The shared `VitalsChartStyle` setting defaults to `epic`, persists through the existing settings
store, and is required across every render path. The bilingual Settings control can switch back to the
preserved `panels` arm, whose default SVG output remains byte-identical to the 199-record promoted
parity baseline.

The Epic arm renders a deterministic 600×360 unified chart. Multi-series records use an adaptive
zero-based shared scale; eligible one-series adult records retain fitted scaling and a reference band.
SBP and DBP share one BP legend control while remaining solid and dashed series, MAP stays separate,
and the legend's paired marker exposes both pressure styles. Transparent HTML buttons above stable SVG
geometry provide hover, focus, click/tap, Enter, and Space interaction without putting focusable controls
inside the image role. Timepoint readouts use the same derived table model as the real hidden HTML table,
which becomes visible for print. A two-level focus owner keeps exactly one SVG mounted, restores focus on
close, and uses internal horizontal scrolling at narrow widths.

The variant-aware layout measurement passed the split experiment. At 1280×727 and 1280×800, the forcing
record rendered a 600×360.8 chart in a 600 px visual track with a 537.8 px work track and no page-level
horizontal overflow. At 390×844, the page remained overflow-free while the 600 px chart stayed readable
inside a 275 px internal scroller. Browser proof also covered exact pointer/touch readouts, keyboard
pinning persistence, BP legend emphasis, propagation isolation, focus dialog dismissal/restoration,
the seven-series record, pediatric band suppression, the staged thyroid-storm exhibit, the panels arm,
the hidden assistive table, print rules, and a clean cold-load console. Preview Lab now has a dedicated
variant-comparison bucket regardless of split disposition. On the forcing record, the pinned 6 h
readout recovered the decision-critical RR rise at 30/min and temperature at 38.8 °C; those same exact
source-derived rows are present in the table revealed for print.
A synthetic Fahrenheit proof retained the authored 98.6→102 °F values on the same raw shared axis,
with an explicit °F legend and coherent source-positioned points; no unit conversion was introduced.

The fixed Epic snapshot
[`scripts/tests/__snapshots__/vitals-trend-epic.json`](scripts/tests/__snapshots__/vitals-trend-epic.json)
pins byte-sorted identities and SVG hashes for all 29 promoted vitals artifacts. Focused vitals tests,
`npm run test:exam-layout`, `npm run validate-bank -- banks/*.json`, `npm run audit`,
`npx tsc -b --pretty false`, `npm run census && npm run census:check`, `npm run build`, and
`git diff --check` passed locally. GitHub's clean-checkout Promotion Gate also passed, including the full
`npm run test-visuals` suite, promotion audit, sweep/schema/staging/coverage tests, and census-drift check.
The existing Vite large-chunk advisory remains unchanged.

### Shape-Aware Sparse Visual Layout Implemented (Jul 19)

Implemented
[`SHAPE-AWARE-VISUAL-LAYOUT-P4-FOLLOWUP-SPEC-2026-07-18.md`](Archive/root-cleanup-2026-07-19/SHAPE-AWARE-VISUAL-LAYOUT-P4-FOLLOWUP-SPEC-2026-07-18.md)
as a presentation-only follow-up with no bank, schema, grading, stage-visibility, answer-coupling,
case-identity, or clinical-content change.

The required measurement preceded the `lab_trend` policy decision. At 1280×727, the specified
one-series potassium record measured 382×191 in the 384 px sticky split pane; the proposed full-width
route measured 800×400 and materially improved axis, marker, and trajectory readability. That evidence
favored the payload-aware branch, so a standalone one-series `lab_trend` now stacks above the stem and
uses the 800 px desktop cap. The specified two-series DKA control remains in the split and measured the
same 382×191 before and after. At 390×844, the one-series surface retains its 600 px design width inside
an internal scroller with no page-level horizontal overflow; the two-series mobile control retains its
existing fit-to-column behavior.

Structured measurements now classify only an entire one-panel × one-row × one-column payload as
compact. Its table and outer SVG widths are computed from the rendered title, headers, row label, and
formatted value; the component emits a matching density class, removing the former independent
600-unit panel floor, 600-unit outer floor, and 28 rem CSS minimum only for that shape. The forcing
`opus3_iv_potassium_safety_case_01` exhibit changed from a 600-unit canvas stretched to 1,075×165 to a
natural 480×92 bilingual figure. English-first and always-bilingual modes preserve the compact figure;
the 390×844 fallback keeps native text size in an internal scroller. The mixed
`opus20_case_cdiff_01` control retains its 600-unit, full-width two-panel figures unchanged.

Verification: `npm run test:exam-layout`, `npm run test:structured-measurements`, `npm run test-visuals`
(clean checkout with this scoped diff), `npm run validate-bank -- banks/*.json`,
`npx tsc -b --pretty false`, `npm run build`, and `git diff --check` passed. Browser proof covered the
specified one-/two-series trends and sole/mixed structured payloads at 1280×727 and 390×844 in
English-first and always-bilingual presentation. The existing Vite large-chunk advisory remains
unchanged.

### Direct GPT Case Pilot C/D Repaired and Promoted (Jul 19)

Closed the C/D repair-gate opened below. Claude independently re-derived the checker's blocking
findings from the raw JSON and the producer contract before repairing: Case C's reverse leakage into
Part 4 (10:30 narrative, Part 5 option D) and baseline-terminology drift (10:09/10:30 CTG exhibits);
Case D's untitrated 97% SpO₂ against GINA's 95% adult ceiling (verified independently — the checker had
cited 96%) and the closing matrix's source-scope gap, closed with an additional exact citation rather
than a redesign. Repairs applied via `scripts/patch-raw` one-off scripts (load → mutate → re-serialize,
no hand-edited JSON); both raw files re-passed `normalize-raw-bank` and `validate-bank` with zero drift
after patching. A post-consolidation `audit:topic-license` pass caught one finding neither the checker
nor the initial repair had flagged — Case D's Part 4 medication-safety item carried a topic licensed
only under a different category — retopicked (not recategorized) directly in the canonical file.

Promoted via `npm run promote` → `npm run consolidate`: both cases routed into `banks/gpt-canonical.json`,
769→771. `npm run audit` **GATE PASSED** with all 2,673 bundled IDs globally unique, both cases' 5/5
`answerableAfterStageId` anchors resolving, and `audit:topic-license` clean; only the pre-existing
unrelated EKG select_all distributional advisory remained. Census regenerated at 1,942 session units /
2,528 scored leaves / 199 visual artifacts; `census:check` and the production build passed. Both raw
drafts were deleted after the ledger entry (`BANK-REVIEW-LEDGER.md`, 2026-07-19) was recorded, per
`audit:integrity`'s draft-retention contract.

### Direct GPT Case Pilot Disposition — A/B Archived; C/D Repair-Gate Approved (Jul 19)

Closed the direct-case pilot disposition. Cases A and B and their original commissions are preserved
under [`Archive/direct-case-pilot-controls-2026-07-19/`](Archive/direct-case-pilot-controls-2026-07-19/)
as held learning-experience controls; neither remains a repair or promotion candidate. Cases C and D
both passed their mechanical checks and are retained in `banks/banks-raw/` as viable drafts approved
for bounded checker repair followed by Claude's normal independent promotion gate. C's remaining work
is limited to reverse-leakage and CTG timing/baseline terminology; D requires the oxygen-target repair,
a certainty correction, and exact source support or bounded redesign for its closing support-context
matrix. Neither case warrants regeneration.

Architectural result: the revised direct-case producer contract now constitutes a viable episodic
case-generation pathway when a topic or load-bearing visual warrants case form. It is not a standing
bulk-generation pipeline, and its raw outputs remain subject to producer-independent clinical,
source-scope, leakage, bilingual, promotion, ledger, and census review. No C/D content, canonical bank,
ledger, census, or promotion state changed in this disposition pass.

### Direct GPT Case Pilot Revision 1 Commissioned (Jul 19)

Preserved Pilot Cases A/B and their raw outputs as the control for the first direct-case experiment,
then opened a controlled architecture rerun rather than repairing the drafts in place. The shared
producer contract is
[`GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md`](GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md);
the independently runnable topic commissions are
[`GPT-DIRECT-CASE-PILOT-CASE-C-SPEC-2026-07-19.md`](Archive/root-cleanup-2026-07-19/GPT-DIRECT-CASE-PILOT-CASE-C-SPEC-2026-07-19.md)
and
[`GPT-DIRECT-CASE-PILOT-CASE-D-SPEC-2026-07-19.md`](Archive/root-cleanup-2026-07-19/GPT-DIRECT-CASE-PILOT-CASE-D-SPEC-2026-07-19.md).

The rerun keeps one fresh GPT-5.6 Sol producer per case and preserves producer ownership of the
patient, progression, exhibits, formats, and distractors. It adds an ordered private blueprint before
JSON authoring: stage plan, per-part construct/response-demand allocation, claim-level source
coverage, comparator basis, serial support context when applicable, independent-evidence accounting,
stage-transition legitimacy, and a pairwise reverse-leakage matrix. The final receipt exposes those
claims for checker challenge without adding an unsupported raw-only manifest or off-schema key.

The contract corrects the stale opening-part assumption from A/B: the live renderer fails open when
stage metadata is absent or unresolved, so every staged direct-case part must carry a resolving
`answerableAfterStageId`, including Part 1 mapped to a real baseline stage. C reruns the intrapartum
fetal-assessment room with explicit comparator and review/escalation guards; D reruns the severe-
asthma/serial-ABG room with criterion-transcription, source-scope, respiratory-support-context,
timely-escalation, and duplicate-evidence guards. The held A/B specs and raw drafts are explicitly
excluded as templates and do not occupy the repeated premises for collision purposes.

A pre-dispatch architecture review then narrowed the experiment claim and closed two spec gaps. C/D
test the thicker shared contract plus private blueprint, not the still-deferred durable manifest or
mechanical-linter architecture. Acceptance now requires a non-writing programmatic assertion against
the raw pilot file that rejects both omitted and unresolved `answerableAfterStageId` values; the
existing bundled-bank `audit:stage-refs` advisory is explicitly insufficient for that purpose. Case D
also records whether intubation was considered and whether the post-intubation source-scope guard was
exercised, deliberately avoided, or not applicable, so a pre-intubation endpoint cannot be mistaken
for proof that the Case B overreach was directly tested.

Generation and independent non-GPT review remain pending. No code, schema, canonical bank, held raw
draft, ledger, or census file changed in this commissioning pass.

### Vitals-Trend Composite Readability Repair Implemented (Jul 18)

Implemented [`VITALS-TREND-COMPOSITE-READABILITY-ARCHITECT-SPEC-2026-07-18.md`](Archive/root-cleanup-2026-07-19/VITALS-TREND-COMPOSITE-READABILITY-ARCHITECT-SPEC-2026-07-18.md) without changing schema shape, bank content, clinical ranges, grading, or `selfCheck`. `vitals_trend` now renders fixed-order, unit-pure hemodynamic, respiratory/oxygenation, and temperature panels with explicit axis units and a common time alignment. Dense legends are panel-local fixed cells, DBP is dashed in both the line and marker, and adult reference bands appear only in one-series panels. A compact flowsheet derived directly from the same source series provides exact timepoint values, including combined SBP/DBP cells.

The forcing record measures 600×1108 and the seven-series record 600×1132. At 1280×727, the former split route squeezed the forcing record to 382 px and its sticky pane stranded the flowsheet below the page's maximum scroll position, so only `vitals_trend` left `STANDALONE_SPLIT_VISUAL_KINDS`. The existing full-width route renders it at a capped 800 px on desktop; focus mode uses the same cap with vertical scrolling and no desktop horizontal overflow. At 390×844, ordinary and focus views retain a readable 600 px minimum surface with internal horizontal scrolling. Browser proof at 1280×727, 1280×800, and 390×844 also covered the forcing item, seven-series minute-unit item, `{hr,temp}` staged exhibit, pediatric band suppression, one-SVG mounting, focus dismissal/restoration, exact-table reachability, and a clean final console.

The scoped promoted parity rebaseline changed exactly 29 `vitals_trend` identities—28 top-level questions and one case-stage exhibit—with zero added or removed records and 170 non-vitals identities unchanged. Receipt: [`audit/visual-parity-rebaseline-2026-07-19T02-38-38-965Z/receipt.json`](audit/visual-parity-rebaseline-2026-07-19T02-38-38-965Z/receipt.json).

Verification: `npm run test-visuals`, `npm run test:exam-layout`, `npm run validate-bank -- banks/*.json`, `npx tsc -b --pretty false`, `npm run build`, and `git diff --check` passed. The existing Vite large-chunk advisory remains unchanged.

### Standalone I/O Trend Layout and Bar Presentation Fixed (Jul 18)

Implemented [`io_trend_fix.md`](Archive/root-cleanup-2026-07-19/io_trend_fix.md) without changing schema or bank content. Standalone
`io_trend` questions retain the live two-pane experience but now receive a dedicated 600 px desktop
visual track; other standalone visual kinds retain the generic 384 px track. The chart and five-column
table scale without internal horizontal overflow, while the existing constrained-width breakpoint and
Preview Lab mobile mode stack the visual above the work area.

The diverging-bar primitive now centers intake and output on the same interval x coordinate, with intake
above and output below the zero baseline. The cumulative-net line, independent right axis, interval
labels, legend, table, and focus dialog remain intact. Focused geometry tests assert the shared bar
coordinate. The scoped promoted-visual rebaseline changed only the four `io_trend` hashes and recorded
unchanged before/after arithmetic with empty self-check errors in
[`audit/visual-parity-rebaseline-2026-07-19T01-58-42-319Z/receipt.json`](audit/visual-parity-rebaseline-2026-07-19T01-58-42-319Z/receipt.json).

Verification: `npm run test-visuals`, `npm run test:exam-layout`, `npx tsc -b --pretty false`,
`npm run validate-bank -- banks/*.json`, and `npm run build` passed. Browser smoke at 1280×800,
1024×800, and the 400 px mobile Preview canvas verified the targeted 600 px desktop pane, zero visual
or page horizontal overflow, same-center bars, preserved cumulative line/table/enlarge control, the
stacked fallback, unchanged 384 px `lab_trend` pane, and no console errors.

### App Update Banner and Build Identity Implemented (Jul 18)

Implemented the passive update flow commissioned by
[`APP-UPDATE-BANNER-CODEX-SPEC-2026-07-18.md`](Archive/root-cleanup-2026-07-19/APP-UPDATE-BANNER-CODEX-SPEC-2026-07-18.md).
Each Vite process now computes one build identity, embeds it in the generated `index.html`, and emits
the same object as `dist/build-info.json`. The production build ends with a deterministic validator
that runs after the existing `file://` rewrite and fails missing, malformed, empty, invalid-timestamp,
or mismatched HTML/JSON identities.

Production HTTP(S) pages check the relative same-origin marker on mount, window focus, and return to
a visible tab. Checks use a cache-busting query and `cache: "no-store"`, are throttled to one per
minute, do not overlap, stop fetching after a changed identity is latched, and treat offline,
non-OK, aborted, or malformed responses silently. Vite development, `file:`, and unsupported
protocols remain ineligible. No service worker, bank synchronization, storage mutation, cache
clearing, or runtime backend was added.

The learner surface is one bilingual, non-modal status banner in the global content flow with a
same-page refresh action. Settings now shows a low-prominence embedded App build / 应用版本 diagnostic.
Production-HTTP browser smoke covered a same-build control, an old HTML/new marker mismatch, a full
artifact replacement and refresh into the new identity, continued answer interaction while the
banner was present, resumable session state after refresh, a missing-marker failure with no console
error, and desktop/mobile light/dark presentation. The available browser controller blocks direct
`file://` navigation by policy and keeps controlled tabs logically visible, so those two mechanics
were not overstated as browser proof: final file-artifact structure and zero-fetch `file:`
eligibility, plus mount/focus/visibility registration and throttling, are covered deterministically.

Verification: `npm run test:app-update`, `npx tsc -b --pretty false`, `npm run build` (including
`validate:build-info`), final distribution metadata/script inspection, browser smoke at 390×844 and
1441×1267, and `git diff --check` passed. The existing Vite large-chunk advisory remains unchanged.

### Direct GPT Case Pilot Commissioned (Jul 18)

Opened the first episodic direct-case pilot after retirement of the Opus-skeleton pipeline as two
isolated one-case producer orders:
[`GPT-DIRECT-CASE-PILOT-CASE-A-SPEC-2026-07-18.md`](Archive/direct-case-pilot-controls-2026-07-19/GPT-DIRECT-CASE-PILOT-CASE-A-SPEC-2026-07-18.md)
and
[`GPT-DIRECT-CASE-PILOT-CASE-B-SPEC-2026-07-18.md`](Archive/direct-case-pilot-controls-2026-07-19/GPT-DIRECT-CASE-PILOT-CASE-B-SPEC-2026-07-18.md).
Each GPT-5.6 Sol instance owns one 5–6-part case, writes its own raw bank under a dedicated ID
namespace, and has no dependency on or integration responsibility for the other producer's output.

The clinical rooms are evolving intrapartum fetal assessment and acute severe asthma
with serial ABG/bedside respiratory change. Corpus screening found no existing intrapartum fetal-
monitoring case container but several occupied fetal-monitoring leaf constructs; the respiratory
brief is fenced away from the existing life-threatening-asthma bowtie, asthma response matrices,
intubated-status-asthmaticus capnography item, COPD case, and other respiratory-deterioration cases.
There is no shared reserve or producer-side integration session. A producer that cannot clear its
assigned premise returns a documented block; any replacement is a later, separate commission.

The commission makes case affordance and cross-part answer leakage hard gates. Because the learner
can navigate directly to later parts before aggregate submission, the producer must audit every
stem, option, exhibit, and caption under unrestricted navigation and perform a reverse-order leakage
read. Direct GPT case production is episodic; no standing multi-model pipeline replaces the retired
skeleton lane. Generated output remains raw and unreviewed until independent non-GPT source,
collision, bilingual, leakage, and any visual review clears the normal promotion pipeline.

### GPT Scored-Format Batch 11 — Independent Review and Promotion Complete (Jul 18)

All 18 commissioned items cleared independent producer≠checker review and are promoted into
`gpt-canonical.json` (751→769). Zero clinical, mathematical, or logical defects were found. Full
findings are in the 2026-07-18 `BANK-REVIEW-LEDGER.md` Batch 11 promotion entry.

Claude reviewed [`GPT-SCORED-FORMAT-BATCH-11-SPEC-2026-07-18.md`](Archive/root-cleanup-2026-07-19/GPT-SCORED-FORMAT-BATCH-11-SPEC-2026-07-18.md)
before generation and caught a design flaw in row 16: its original `dropdown_cloze` structure tested
primary-vs-central adrenal insufficiency and mineralocorticoid status from the same client's data —
clinically near-tautological, since one answer determines the other almost by definition, which would
have mechanically revealed one dropdown's answer from another's in violation of the spec's own gate.
Luke fixed the spec (three separately-labeled client records, one per dropdown) before the producer
ran; independent review of the generated item confirmed the fix holds.

The `dropdown_cloze` correct-first generation habit that caused the Batch 9/10 defect recurred at the
raw-generation level (all 9 blanks in Batch 11C again keyed the correct option first) — but this time
it was harmless: the `lib/shuffle.ts` fix from the prior promotion correctly randomized all 9 blanks at
promotion time, confirmed by direct inspection of the promoted output. The raw-generation pattern
itself remains uncorrected upstream and is worth feeding back into future producer prompts.

Verification: `npm run audit` **GATE PASSED** post-consolidation with 2,661 bundled IDs globally unique
across 13 banks (only the pre-existing, unrelated `visual-canonical` distributional advisory);
`test:grading`, `test:highlight`, `test:bowtie`, `test:schema-bank`, `test:non-mcq-bias`, and
`test:shuffle` all passed; `npx tsc -b` passed; census regenerated at 1,940 session units / 2,518
scored leaves / 199 visual artifacts and `census:check` passed; production build passed. The
`rationale-visual-floor` survey snapshot needed the same regeneration as the prior promotion
(`topLevelRecords` drift only).

### GPT Scored-Format Batch 11 Commissioned (Jul 18)

The next producer order is
[`GPT-SCORED-FORMAT-BATCH-11-SPEC-2026-07-18.md`](Archive/root-cleanup-2026-07-19/GPT-SCORED-FORMAT-BATCH-11-SPEC-2026-07-18.md):
18 standalone text-only questions in three raw files, with a planned 5 `bowtie` / 4 `highlight` /
3 `fill_in_blank` / 3 `ordered_response` / 3 `dropdown_cloze` mix. It uses the promoted
Batches 8–10 canonical baseline while honoring the commissioning decision not to review Batch 10 raw
output during this pass.

The operating contract incorporates producer feedback: every primary and reserve records its nearest
canonical or commissioned comparator and required semantic divergence; six reserves match the six
item-type/difficulty lanes; blocked primaries use only unused matched reserves and may yield a smaller
valid delivery when reserve capacity is exhausted. Dropdown rationales require one `byChoice` entry
per dropdown ID. All approved source URLs were opened during spec preparation. Shell normalization
and validation are conditional on producer command access and otherwise pass explicitly to
Codex/checker. The contract specifies the required final disk state without prescribing an atomic
write mechanism.

A producer pre-release critique was accepted before dispatch. Corpus-wide collision screening now
belongs to spec preparation, while the producer checks live raw drafts, named row comparators,
intra-batch collisions, and any direct evidence of an omitted canonical match. The revision narrows
acute limb ischemia to Rutherford IIb, fixes the clean-catch sequence at the schema's six-option
ceiling, separates the adrenal and DI dropdown inferences, replaces the misclassified testicular-
torsion reserve with an AHA-sourced CRAO emergency highlight, and adds a diagnostic source to the
postpartum-endometritis row. Codex's handoff is mechanical/source-resolution preflight; Claude owns
clinical/key, bilingual, collision, and promotion adjudication. Generation and independent review
remain pending.

Claude's pre-dispatch review then caught one remaining dependency in row 16: primary-versus-central
AI mechanically revealed the mineralocorticoid-deficient-versus-preserved blank. Row 16 now uses
three separate stable mini-records for HPA localization, aldosterone appropriateness, and etiology,
so no dropdown answer constrains another. Row 5 now mandates two concise TTP action tokens and places
the ADAMTS13 feasibility/non-delay condition in the stem. Because the current producer seat is known
to lack shell execution, Section 3 now directly defers normalization and validation to Codex/checker
instead of inviting a capability probe.

### GPT Scored-Format Batches 8/9/10 — Independent Review and Promotion Complete (Jul 18)

All three commissioned batches (53 items: 18 Batch 8, 18 Batch 9, 17 Batch 10 — one short of the
planned 18) cleared independent producer≠checker review and are promoted into `gpt-canonical.json`
(681→751). Zero clinical, mathematical, or logical defects were found in any item across all three
batches. Full findings, item-type composition per raw file, and verification detail are in the
2026-07-18 `BANK-REVIEW-LEDGER.md` promotion entry.

The one substantive finding was structural rather than clinical: all 18 `dropdown_cloze` blanks split
across Batch 9C and Batch 10C keyed their correct option as the first-listed option 100% of the time,
against a ~25–37% baseline in already-promoted content. `lib/shuffle.ts` had never implemented a
`dropdown_cloze` case, despite the non-MCQ bias audit's own `correct_index_n{N}` check already
declaring `SHUFFLE_AT_PROMOTION` as this defect's designated repair — the audit could detect the defect
but nothing at promotion time actually fixed it. Added `shuffleDropdownCloze` to `lib/shuffle.ts`
(mirrors the existing bowtie per-zone Fisher-Yates pattern) and `scripts/tests/shuffle.ts`
(`npm run test:shuffle`). This defect appeared identically in Batch 9 (GPT self-check completed before
handoff) and Batch 10 (no self-check) — the review found no self-check quality difference for either
defect class it covered, since the one real defect is a cross-item statistical pattern that a per-item
review pass (human or model) is not positioned to catch regardless of who performs it.

Verification: `validate-bank` passed all nine raw files; `npm run audit` **GATE PASSED**
post-consolidation with 2,643 bundled IDs globally unique across 13 banks (only the pre-existing,
unrelated `visual-canonical` distributional advisory); `test:grading`, `test:highlight`, `test:bowtie`,
`test:schema-bank`, `test:non-mcq-bias`, and the new `test:shuffle` all passed; `npx tsc -b` passed;
census regenerated at 1,922 session units / 2,500 scored leaves / 199 visual artifacts and
`census:check` passed; production build passed.

### GPT Scored-Format Batch 10 Commissioned (Jul 18)

The next producer order is
[`GPT-SCORED-FORMAT-BATCH-10-SPEC-2026-07-18.md`](Archive/root-cleanup-2026-07-19/GPT-SCORED-FORMAT-BATCH-10-SPEC-2026-07-18.md):
18 standalone text-only questions in three independently runnable six-item GPT raw files. The planned
mix is 4 `bowtie`, 4 `highlight`, 4 `fill_in_blank`, 3 `ordered_response`, and 3
`dropdown_cloze` questions, with direct writes to `banks/banks-raw/` and producer-owned preflight
against bundled questions, embedded case leaves, and live raw drafts. The commission incorporates
Batch 9 review lessons by treating cosmetic symptom swaps and artificial ordering of simultaneous
recommendations as blocking collisions. Generation and independent review remain pending.

### GPT Scored-Format Batch 9 — Checker Pass Ready for Claude (Jul 18)

All 18 Batch 9 questions completed an independent raw-bank checker pass. The review replaced two
material collisions, repaired a time-sensitive contraception sequence and a contradictory swallowing
cue, strengthened weak source pins, recomputed all arithmetic keys, and rechecked each item against
the live bundled and raw inventories. The three final raw files normalize without changes, validate
6/6, and have globally unique IDs. The untouched producer drafts are preserved under
`Archive/banks-raw-provenance-2026-07-18/`; deterministic repair scripts are retained under
`scripts/patches/`. Per the current handoff, promotion, producer-independent clinical adjudication,
consolidation, ledgering, and census regeneration are deferred to Claude.

### Root Markdown Cleanup (Jul 18)

Moved 17 completed or superseded root-level implementation handoffs, code/content specs, and closed
proof-batch packets into `Archive/root-specs-2026-07-18/` and repaired
references to their new paths. The in-flight Batch 8–10 commissions, active generation
prompts, living ledgers, unresolved clinical/reference work, P3's ratified adjudication, the P5-bearing
architect handoff, and current operational specs remain at root.

### GPT Scored-Format Batch 9 Commissioned (Jul 18)

The next producer order is
[`GPT-SCORED-FORMAT-BATCH-9-SPEC-2026-07-18.md`](Archive/root-cleanup-2026-07-19/GPT-SCORED-FORMAT-BATCH-9-SPEC-2026-07-18.md):
18 standalone text-only questions in three independently runnable six-item GPT raw files. It plans
against the assumption that most or all of Batch 8 clears review and allocates 17 seats to the five
lowest scored standalone formats, plus one `select_all` seat for ECT's missing format lane.

The direct-write contract now delegates first-pass semantic collision prevention to the producer.
Before authoring and again after drafting, the producer must compare every assigned construct against
all bundled standalone questions, embedded case leaves, and live raw drafts. Reusing the same equation,
scoring tool, decision pathway, priority sequence, or cue-response pattern under a different wrapper is
a blocking collision; the producer must report the conflicting ID rather than silently substitute.
Generation and independent review remain pending.

### P4 Single-Row Laboratory Presentation Survey — Closed by Principle 29 (Jul 18)

The isolated report-only P4 pass is implemented by `scripts/single-row-lab-panels-survey.ts`, with its
dated manifest at `audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json`, decision packet
at `Archive/root-cleanup-2026-07-19/SINGLE-ROW-LAB-PANELS-P4-SURVEY-SPEC-2026-07-18.md`, and focused byte-drift/contract regression at
`scripts/tests/single-row-lab-panels.ts`. It reuses the six-location `collectVisualRefs` projection for
`lab_trend` and the established top-level/staged exhibit traversal for structured measurements.

The canonical inventory found 24 candidates across five banks: 11 of 20 `lab_trend` visuals use one
series, and 13 of 126 structured labs panels use one row. The remaining nine trends use two series and
113 panels use multiple rows. Current validation has zero failures; all 11 applicable question-visual
self-checks pass, while all 13 structured panels correctly report
`NOT_APPLICABLE_BY_CURRENT_CONTRACT`. Absent structured population remains unspecified; undeclared
bank schema versions remain null.

L1/L2 and S1/S2 were mechanically calculated: preservation changes zero records, a universal
two-series floor would newly fail 11 visuals, and a universal two-row floor would newly fail 13 panels.
The producer-independent checker then classified all 24 candidates, and Luke closed P4 through
Principle 29. L1/S1 are ratified; universal floors L2/S2 are rejected; L3 is rejected because it
changes nothing in the surveyed corpus; S3 is rejected because its nonduplication predicate conflicts
with Principle 24's additive structured-measurement contract; and S4 is closed without naming a
context class. The nine non-answer-referenced structured rows open no remediation lane. The ruling
authorized no schema, bank-content, renderer, or runtime change. Any future presentation work requires
a new measured proof-render commission under Principle 23 rather than continuing as a deferred P4
obligation.

### GPT Scored-Format Batch 8 Commissioned (Jul 18)

The active content order is
[`GPT-SCORED-FORMAT-BATCH-8-SPEC-2026-07-18.md`](Archive/root-cleanup-2026-07-19/GPT-SCORED-FORMAT-BATCH-8-SPEC-2026-07-18.md):
18 standalone text-only questions in three independently runnable six-item GPT raw files. It retains
Batch 7's successful 6 fill-in-blank / 6 ordered-response / 2 bowtie / 4 highlight shape while using
the current post-promotion scored-leaf report (`INPUT_SHA`
`9bf33b2e56a5919d3b5b42e0cc54894497a6d5a1`) and current bundled-item inventory. The commission is
format backfill, not category rescue.

The producer operating contract now reflects GPT's available write tools: create the three exact
files directly under `banks/banks-raw/`, dry-run normalization and validate each file, modify nothing
else, and return only a receipt rather than pasting JSON into chat. Explicit duplicate exclusions
address the one confirmed duplicate dropped from Batch 7. Generation, independent content review,
promotion, ledgering, and census regeneration remain pending.

### Vital-Sign Sanity Bounds P3 Deterministic Inventory — Closed; Stage-2 Adjudication Ratified (Jul 17–18)

The ratified P3 survey is implemented by `scripts/vital-sanity-bounds-survey.ts`, with its dated
manifest at `audit/vital-sanity-bounds-survey-2026-07-17/survey-manifest.json` and a byte-drift/
boundary regression at `scripts/tests/vital-sanity-bounds.ts`. `npm run survey:vital-sanity-bounds`
regenerates the artifact; `npm run test:vital-sanity-bounds` proves its committed bytes, synthetic
current-bound probes, temperature's affine source-unit behavior, typed-bound semantics, optional
staging-lane handling, and reusable candidate-interval accounting.

The inventory deterministically discovered 13 top-level canonical banks and 1,317 machine-readable
vital records. The 766 structured-measurement rows are the live GATE 4 population; they have zero
warnings, unit failures, and conversion failures. The 551 `vitals_trend` values are renderer-envelope
records: their clean validation and MAP null are structural, not evidence that the `sanity` tripwires
are clinically suitable. Temperature documents the decoupled contracts across both lanes but does not
make the renderer execute GATE 4. The artifact records declared/effective population per record, all
seven vital contracts, side authorship and override-mechanism cost, exact live canonical ranges, and
nearest boundary records. The prior 2026-07-11 survey and pre-move sweep is located in Git history at
`a67476cee75e365dd72c22a589d8e76c6e3ddc6d:DECISIONS.md`, while current `DECISIONS.md` §7 preserves
its compact zero-flip summary and r9 §6.1 is a separate July 15 re-derivation. P3 explicitly extends
that limited historical survey/sweep scope; the historical promoted/refreshed temperature spans are
not directly comparable to P3's pooled two-surface `liveRange`.

No bank, renderer, measurement-unit vocabulary, or `sanity` bound changed. Per the P3 seat split,
the producing implementation did not certify the manifest's contract-interpretation fields; the
independent checker seat owned that classification review.

**Closeout (Jul 18).** The independent classification review completed. The item-3 provenance repair
merged as `9bf33b2` (survey generator, regenerated manifest, `PROJECT-HISTORY.md`, and the
citation-locking regression moved together), locking the 2026-07-11 sweep citation to the Git-backed
`a67476cee75e365dd72c22a589d8e76c6e3ddc6d:DECISIONS.md` record and forbidding drift back to the
unsupported archived-decisions attribution or the overstated "temperature-only flip probes" phrase.
The full validation suite reran clean. The dated manifest is not rewritten for lifecycle status; its
`status` field records its production-time state, and current status lives here and in the merge
commit.

Stage 2 (architect adjudication) is ratified as §20 of
`VITAL-SANITY-BOUNDS-P3-SURVEY-ARCHITECT-SPEC-2026-07-17.md`. Reading the merged manifest's
boundary-neighbour and mechanism-cost fields rather than a prose summary, three of the thirteen open
sides move to stage-3 clinical sourcing — SBP ceiling and RR ceiling to extreme-value sourcing, SpO₂
floor to device/reporting-limit sourcing — while the other ten (including the temperature floor)
remain provisional or structural. The SpO₂-floor override-mechanism extension is recorded as a
contingent implementation prerequisite, not a stage-3 deliverable: it is built only if that floor is
sourced and ratified. No candidate numbers are selected; no bound, bank, renderer, mechanism, or
runtime code changed.

### Promoted Visual Parity P2 Baseline Phase — Merged (Jul 17)

The survey phase authorized by
`Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md` merged in PR #55
(`7792caf`). A shared,
byte-sorted promoted-visual loader now fails loudly when a top-level bank is invalid or two visuals
resolve to the same parity identity, closing the two silent-skip/overwrite defects in the legacy
three-hash parity test. Carrier routing is explicit for all six full-schema locations.

The generated dated survey covers 13 banks and 199 visuals across all 12 registered kinds. It found
zero identity collisions, nondeterministic renders, `selfCheck` failures, exact-arithmetic records
without keyed values, `device_screen` records without a checked keyed-setting/arithmetic surface, or
`io_trend` records without a checked keyed/trend/crossover surface. All four live `io_trend` records
carry both keyed arithmetic and trend assertions; the pattern-only allowance has no live population.
All 11 `mar` records are now classified in the structured-document/table tier and independently
demonstrate a nonempty keyed relationship or a keyed cell resolving to a real medication/time
administration. Regressions prove that `keyed_cells: [null]` and missing metadata can leave
`selfCheckErrors` empty without satisfying that proof recognizer.
After Claude recorded `SURVEY-ADJUDICATION: PASS`, the one-time bootstrap reconciled that committed
survey byte-for-byte and wrote 199 byte-sorted records across all 12 registered-kind snapshots. Its
receipt records zero ordinary deltas, the exact merge-base SHA, the complete population/proof null,
and all three U0 rhythm ids as structurally eligible and byte-equal. The promoted rhythm snapshot
landed while the legacy hashes still existed; a following commit removed the old `svgHashes` owner.
The legacy snapshot note, this history, the initial receipt, and git history retain U0 provenance,
while `visual-parity.json` now owns only its 11 validation-reason cases.

`parity:rebaseline` now has a permanently one-shot bootstrap and an ordinary steady-state path with
Git-derived record-local causes, all-delta scope enforcement, ambiguous renderer/content failure,
keyed-proof preservation, exact before-ref SHA rendering from an always-unregistered clean
worktree, deterministic per-kind snapshots, one-sided removal evidence, and tracing review-artifact
generation. `test:visual-parity-promoted` owns fail-closed loading/collisions, universal `selfCheck`,
proof surfaces, missing/stale/hash failures, bootstrap permanence, delta mechanics, and worktree
cleanup. Tracing artifact generation preflights `rsvg-convert` and `magick` before creating any
receipt/evidence directory and fails clearly when either local-only tool is absent. The Promotion
Gate adds only the authorized `npm run test-visuals` step, while that package command now genuinely
includes P0's six-location `rationale-visual-floor` regression. That P0 survey treats absent optional
raw/promoted staging directories as an empty population in clean Git checkouts while preserving all
other filesystem failures. Claude's baseline spec-conformance verdict was `CONFORMS`.

Merged as `7792caf` on Luke's merge authority. The spec's §10 seat order placed an independent
gate-seat review before merge; that review did not occur, and none has been performed by a
qualifying seat. A post-merge read by Gemini returned no findings, but under Gemini's standing
restrictions (`DECISIONS.md`, Reference appendices) it is not a gate seat and does not discharge the
obligation. Accepted as a closed residual rather than remediated: the bootstrap changed no bank
content and recorded zero deltas, the baseline hashes a corpus whose proof surfaces the survey
measured independently, and `test-visuals` now runs in the Promotion Gate. P3, P4, and the remaining
P5 policy work remain separate follow-up scopes.

### Rationale-Visual Schema-Floor Traversal Retrofit (Jul 16)

P0 of the deterministic revisit queue is implemented. `src/schema.ts` now owns one location-aware,
six-location full-schema visual projection covering question visuals, rationale figures, case
exhibits, staged exhibits, embedded-leaf visuals, and embedded rationale figures. Validator schema
floors, export-envelope inference, and visual parity all derive from it; the two hand-written pacer
walkers and the parity walk are removed. The separately ratified census artifact traversal remains
four-location and continues to exclude rationale figures.

Synthetic regressions prove top-level and embedded rationale pacer strips require schema `1.7`,
non-pacer rationale strips do not, validator and exporter agree at every supported location, and
every location is emitted with its own metadata. The deterministic survey generator refreshes the dated corpus proof after the
Batch 7 promotion: 13 banks, 1,869 top-level records, 199 visual refs, zero rationale visuals, three
pacer strips already satisfying the floor, zero bank flips, and zero export-envelope changes. Bank
content and the three-item visual-parity snapshot are unchanged.

### GPT Scored-Format Batch 7 Promoted (Jul 16)

17 of 18 candidates promoted into `banks/gpt-canonical.json` (681→698); the confirmed-duplicate
18th was dropped, not promoted. Independent review (Claude, producer≠checker against GPT's own
self-review below) recomputed all six fill-in-blank keys from first principles, verified the five
ordered-response `correct` arrays as full permutations, verified both bowtie 1/2/2 key structures
and both highlight bounded-correct sets, read every bilingual pair inline, and cross-checked every
cited guideline source against the tested clinical decision — no inaccuracies found. Confirmed
GPT's held-item finding for `gpt_format7b_dry_chemical_skin_decontamination` (duplicate of
`gpt_fmtgap_2026_07_14_or_dry_chemical_burn_15` and `gemini_b4_06`) and dropped it via
`scripts/patches/2026-07-16-gpt-format7b-drop-duplicate.ts`; its exact payload is preserved in
`Archive/retired-bank-items-2026-07-16/` since `banks/banks-raw/` is gitignored and carries no git
provenance of its own. Full detail in `BANK-REVIEW-LEDGER.md`'s 2026-07-16 Batch 7 promotion entry.

GPT's original staging-only self-review, preserved as-is below:

Completed in staging only:
- Reviewed all 18 standalone questions in the three Batch 7 raw files against the row-level
  commission, current schema/grading contracts, bundled-bank inventory, bilingual content, and
  load-bearing clinical sources. The drafts remain raw and have not been independently approved,
  promoted, consolidated, ledgered, or counted by the census.
- Recomputed all six fill-in-the-blank keys from the supplied data: corrected sodium 136 mEq/L,
  effective serum osmolality 344 mOsm/kg, CURB-65 score 4, renal SOFA component 3, initial PRBC
  rate 100 mL/hr, and revised PRBC rate 131 mL/hr. Stored numeric answers, accepted strings,
  units, and tolerances agree with those results.
- Corrected Batch 7C's mislabeled ADA hypoglycemia section and tightened the two 2026 Surviving
  Sepsis Campaign links to the current guideline and named recommendation lanes. The declarative
  raw-stage record is `scripts/patches/2026-07-16-gpt-format7c-final-review.ts`; learner-facing
  content and answer keys were unchanged.
- Placed `gpt_format7b_dry_chemical_skin_decontamination` on hold because it materially duplicates
  the already bundled ordered-response items `gpt_fmtgap_2026_07_14_or_dry_chemical_burn_15` and
  `gemini_b4_06`: all three test the same remove/brush/irrigate decontamination sequence. The item
  must be replaced or explicitly adjudicated before Batch 7 can be presented as an 18-item
  promotion-ready set; the raw file is intentionally left intact so the six-row manifest is not
  silently altered.

Verification:
- All three raw files normalize with zero structural changes and pass `validate-bank`; the exact
  commissioned 18-row category, topic, item-type, and difficulty distribution is preserved.
- No raw-versus-bundled ID collision was found. Targeted premise and similarity review found no
  other material duplicate; common PRBC arithmetic, home-PN transition, heart-failure action-plan,
  and sepsis vocabulary represented different tested decisions.
- The six ordered-response keys are full permutations, both bowties retain exact 1/2/2 keys, and
  all four highlights have bounded correct sets plus near-miss distractors. English/Chinese choice
  and rationale-reference coverage is complete.
- Formal independent producer≠checker clinical/source review, resolution of the held duplicate,
  and the complete promotion pipeline are now complete — see the note above this section.

### Post-PR #52 Format Commission and Deterministic Handoff (Jul 16)

PR #52 merged after the architect's pass and the local-only unresolved-root-file check. The
census-denominator/topic-license arc is closed. The authoritative scored-leaf report has no category
outside tolerance and no standalone delivery-capacity shortfall, so no generic category-balance batch
was commissioned.

The next content order is instead the active 18-item, three-file scored-format commission in
[`GPT-SCORED-FORMAT-BATCH-7-SPEC-2026-07-16.md`](GPT-SCORED-FORMAT-BATCH-7-SPEC-2026-07-16.md),
targeting only topic/format combinations named by the scored-leaf report. The deterministic revisit
queue and recommended sequencing are handed to the next architecture seat in
[`NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md`](NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md):
schema-floor coverage for `rationale.visuals` first, with visual parity, vital-sign sanity evidence,
single-row lab policy, and CI hardening kept as separate workstreams. The proposed active-governance
encoding gate was withdrawn by Luke on 2026-07-16 after every reported corruption was traced to the
connector read path rather than repository bytes; the durable replacement control lives in
`CLAUDE.md` and the withdrawal rationale in `DECISIONS.md` §8.

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
  `Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md`, preserving GATE 4's warning-only semantics and the
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
- Implemented the shared measurement allowlist foundation from `Archive/root-specs-2026-07-18/measurement-allowlist-codex-spec.md`: pure lab/vitals registry defs, derived frozen `src/measurementAllowlist.ts`, CBC conventional-canonical/source-permissive policy (`wbc`/`platelets` canonical `×10³/µL`, source alternates `K/µL`, `/µL`, `/uL`, `/mcL`, `/mm³`, `×10⁹/L`), and a drift-guard test.
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

> **STALE as of 2026-07-17.** This baseline has not been re-executed since 2026-06-15 and predates
> schema 2.0, the `io_trend` kind, and the closed flowsheet migration. The list below is a historical
> record of that run — **not** a statement of current green status. Known structural drift: the
> registry now holds **12** kinds (`listVisualKinds()` in `src/visuals/registry.ts`; confirmed against
> `src/visuals/kinds/` — `burn_map`, `capnography`, `device_screen`, `fetal_monitoring`,
> `injection_site`, `io_record`, `io_trend`, `lab_trend`, `mar`, `medication_label`, `rhythm_strip`,
> `vitals_trend`), not the 11 that were green on 2026-06-15. Refreshing this section requires actually
> executing the commands; the architect seat cannot run them and has not claimed a re-verification
> here. The per-line entries below remain accurate *for their date*.

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
