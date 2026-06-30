# Project History

This is the living status record for Project Shrimp / NCLEX Bilingual Prep. Update it whenever a meaningful implementation pass lands, verification changes, or the active scope moves.

## Coding-agent orientation

This file is the living **status map** — *what currently exists*. For *how to work* (project coordinates, implementation notes, the bank/visual workflow, and commands) see `AGENTS.md`; for *why* the architecture is the way it is see `DECISIONS.md`; the schema source of truth is `NCLEX-Question-Schema.md`. On conflict, the current-status facts in this file and `NCLEX-Question-Schema.md` override older prose anywhere.

Codex is the implementation agent for code changes. Other LLMs may generate or review question content, but they should not be treated as owners of app architecture.

## Current status

The app is a static offline Vite + React + TypeScript NCLEX-RN practice tool. It builds with bundled question banks, supports importing/exporting JSON banks, and does not require a runtime API or server after build.

Core learning features are implemented: all schema item types render and grade, case studies are supported, sessions are resumable, custom sessions can be built from filters, the dashboard summarizes performance, flags feed review pools, glossary flashcards have their own SRS progress, and adaptive exam-condition practice is available without any pass/fail readiness claim.

Current canonical banks (see [BANK-CENSUS.md](BANK-CENSUS.md); 1,665 top-level, 721 embedded parts as of 2026-06-24):

- `banks/burn-canonical.json` (8 schema v1.2 burn-map visual items)
- `banks/capnography-canonical.json` (7 schema v1.2 capnography visual items; dedicated home for capnography kind)
- `banks/claude-canonical.json` (97 bilingual Claude/Opus-source questions; ledgered content review complete; schema v1.6 for typed unfolding-case metadata)
- `banks/device-canonical.json` (8 schema v1.2 device-screen visual items)
- `banks/gemini-canonical.json` (874 bilingual Gemini-source questions; includes original + pending batches + traditional/easy/gap-fill/format-backfill/standalone NGN consolidations minus redundant/flawed questions; schema v1.6)
- `banks/gpt-canonical.json` (498 bilingual GPT-source questions; ledgered content review complete; schema v1.6 for typed unfolding-case metadata)
- `banks/hard-cases-canonical.json` (66 top-level hard/NGN items; ledgered content review complete; schema v1.6 for typed unfolding-case metadata)
- `banks/io-canonical.json` (8 schema v1.2 intake/output record visual items)
- `banks/lab-canonical.json` (20 schema v1.2 lab_trend visual items; dedicated home for lab_trend kind)
- `banks/mar-canonical.json` (8 schema v1.2 mar visual items; dedicated home for mar kind)
- `banks/medlabel-canonical.json` (8 schema v1.2 medication-label visual items)
- `banks/visual-canonical.json` (53 reviewed schema v1.2 rhythm-strip visual items; the dedicated home for rhythm_strip kind, formerly `banks/rhythm-canonical`)
- `banks/vitals-canonical.json` (10 reviewed schema v1.2 vitals-trend visual items; dedicated home for vitals_trend kind)
- Schema version `1.6` current; `1.0` standalone, `1.1` case-study, `1.2` visual, `1.3` highlight, `1.4` bowtie, and `1.5` rationale-visual banks remain supported

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
- Added [`SPLIT-SCREEN-LAYOUT-INVESTIGATION-2026-06-28.md`](SPLIT-SCREEN-LAYOUT-INVESTIGATION-2026-06-28.md) with feasibility findings, bank-shape counts, risky stage-mapping IDs, renderer insertion points, and a phased implementation recommendation.
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
- Added [`VOCAB-RESCUE-PHASE1-WALKTHROUGH.md`](VOCAB-RESCUE-PHASE1-WALKTHROUGH.md) in the project root to document the unfinished product state, manual QA flow, and future interview questions.

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
- Merged findings report: `ADVERSARIAL-AUDIT-FINDINGS-2026-06-25.md`; lane files `lanes/{claude,codex,gemini}.phaseB.*`.
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
- Completed the Gemini-flagged / Luke-adjudicated straggler review for the two Claude × GPT delegation pairs. Both candidate contradictions were dismissed/kept; the shared report and manifest are recorded in `ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md` and `audit/early-bank-semantic/coherence/ADVERSARIAL-AUDIT-2026-06-24.manifest.jsonl`.
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
- `src/types.ts` mirrors schema v1.6 (its `SchemaVersion` union spans `1.0`–`1.6`; `Rationale.visuals` carries the 1.5 figures and the visual union is assembled in `src/visuals/types.ts`).
- `src/schema.ts` validates committed and imported question data.
- `scripts/validate-bank.ts` reuses the app validation path for bank files.
- `BANK-REVIEW-LEDGER.md` tracks per-bank review status and should be updated before any generated bank is treated as reviewed testing material.

## Product decisions

- Chinese is off by default in Test mode.
- Study mode uses the saved Chinese display preference.
- Missed-question clearing currently requires two consecutive correct answers after a miss.
- Uploaded banks are stored question-by-question in IndexedDB.
- Bundled banks are read-only.
- Import accepts wrapped bank objects or bare arrays and skips invalid individual questions.
- The production build rewrites module script output to a classic deferred script for better `file://` compatibility.
- The app no longer shows a persistent AI warning footer; question provenance and caveats are handled outside the study UI.

## Candidate next work

- Add browser automation to the verification baseline when Playwright or the in-app browser tool is available.
- Extend shared grading regressions when new item types are added.
- Continue bank expansion guided by `npm run census` (structured) and `npm run coverage-report` (Markdown prompt parameters).
- Consider optional live Gemini generation only if still wanted.
- Consider optional remote bank update flow if manual bundled-bank updates become annoying.
