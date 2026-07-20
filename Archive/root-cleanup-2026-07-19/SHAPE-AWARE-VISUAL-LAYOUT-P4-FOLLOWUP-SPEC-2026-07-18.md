# Shape-Aware Visual Layout — Presentation Commission (Codex Work-Order)

Status: **Open — scoped, not yet commissioned. Not a prerequisite for any other work.**

Provenance: a **new presentation commission prompted by dogfooding**, informed by the closed P4 evidence (`DECISIONS.md` Principle 29; `SINGLE-ROW-LAB-PANELS-P4-SURVEY-SPEC-2026-07-18.md`). Principle 29 authorized no renderer work and left no deferred renderer obligation — P4 ruled the *content* correct and the *shape* valid. This order is new work justified by a later layout observation, not an unfinished P4 task. It authorizes **no** bank, schema, generation, census, grading, stage-visibility, answer-coupling, or case-identity change.

## Problem (from dogfooding)

Two presentation observations, both about viewport allocation, not data shape:

- A one-series `lab_trend` is rendered inside the narrow standalone **visual pane** of the split layout (that pane is a minority of the shell width), which is the wrong allocation for a horizontal time-trend the learner reads across time.
- A one-row `structured_labs_panel` is rendered inside a figure whose width is floored at 600 units regardless of content, so a single 1×1 result is stretched to the same width as a dense multi-row table.

## Closed-world inputs (verified against live source)

Split layout (`src/examLayout.ts`):
- `usesStandaloneVisualSplit(question)` returns true iff `question.itemType !== "case_study"`, `question.visual` is defined, and `question.visual.kind ∈ STANDALONE_SPLIT_VISUAL_KINDS`. `lab_trend` is in that set. The function inspects visual **kind only** — never the payload — so a one-series `lab_trend` is treated identically to a two-series one.
- `structured_labs_panel` exhibits live inside `case_study` items, which the `itemType !== "case_study"` gate excludes from `usesStandaloneVisualSplit`. They render via the case renderer, a different path from the split. Work Items 1 and 2 are therefore independent surfaces.

Structured-measurement width is fixed by three independent constraints — a CSS-only change cannot compact the figure:
1. `panelToTable()` in `src/structuredMeasurements.ts` hardcodes `width = 600` per panel.
2. `renderStructuredMeasurementsSvg()` floors the outer viewBox width at `Math.max(...panelWidths, 600)`.
3. `.structured-measurements-svg svg` in `src/styles.css` sets `width: 100%; min-width: 28rem;`.
`StructuredMeasurementsStimulus.tsx` emits a fixed `structured-measurements` class with no row/column-density hook, so CSS has no way to know whether a payload is 1×1, 1×N, or multi-row. Height is computed purely from `title + header + rowCount` (`tableHeight`); there is **no** forced minimum card height — the demonstrated defect is horizontal only.

Governing rules: `DECISIONS.md` Principle 23 (exam-like presentation is a renderer concern; standalone/split eligibility is determined by **measured** visual geometry, and a kind joins or leaves the allowlist only after a measured proof render, never a predicted one; case identity and grading are out of scope) and Principle 24 (structured measurements supplement prose; the prose fallback is not removed).

## Population facts (from the P4 survey, re-derived)

Of the 13 one-row structured labs panels, all are 1 row × 1 column. **4** are the sole panel in their `structuredMeasurements` payload (safe compaction targets). **9** sit beside a larger sibling panel in the same payload — compacting those individually while the outer figure stays 600-wide produces a compact inner table inside a non-compact figure, which is not the desired outcome. Pass 1 handles only the 4 sole payloads; the 9 sibling cases are explicitly out of scope until there is evidence that independently-sized nested panels matter.

## Work Item 1 — one-series `lab_trend`: measure before deciding

Measurement precedes the policy decision. Do not assume the outcome.
1. Capture the **current** one-series layout at the target viewport.
2. Capture a **proposed** full-width / stacked-above-stem alternative (allowed to exceed the current standalone dimension cap for `lab_trend`; the same chart moved above the stem at the same size is not an improvement).
3. Compare axis readability, chart width, stem displacement, and overall viewport use.
4. Implement the payload-aware branch (`visual.kind === "lab_trend" && visual.series.length === 1` leaves the standalone split) **only if** the measured alternative is better. Two-series `lab_trend` is unchanged either way in this pass.

Fixtures: one-series `gpt_u3_labtrend_2026_06_09_mc_potassium_furosemide_01`; two-series control `gpt_u3_labtrend_2026_06_09_b_matrix_dka_potassium_glucose_04`. Use the established M1 Air / Safari target (or its recorded viewport equivalent) plus the mobile fallback.

## Work Item 2 — sole 1×1 structured payloads: compact the figure (TS + CSS)

Required outcome: for a payload that is exactly one panel with one row and one column, the **rendered figure** (not merely the inner table) renders at its natural compact width. A compact inner table inside a retained 600-wide canvas does not satisfy this order.
- Authorized surface: `src/structuredMeasurements.ts`, `src/StructuredMeasurementsStimulus.tsx`, `src/styles.css`, `scripts/tests/structured-measurements.ts`.
- First-pass rule: compact **only** when the entire `StructuredMeasurements` payload is one panel × one row × one column (the 4 sole cases). Every mixed-panel or denser payload keeps current behavior. This requires relaxing all three width constraints for the compact case (panel width, outer-width floor, CSS `min-width`) — e.g. by computing width from content and emitting a density class the CSS can key on.
- Do **not** remove the duplicated prose value: the renderer is SVG with a generic image label, and the prose remains the accessible textual fallback until a semantic-table surface exists (Principle 24).

## Hard fences

- Presentation-only. No change to any bank, schema, generation prompt, census, coverage report, grading, scoring, stage visibility, answer coupling, or case identity.
- No allowlist, dimension, or split-eligibility change lands on a predicted render — a measured proof render is required (Principle 23), and Work Item 1's branch is contingent on the comparison favoring it.
- Two-series `lab_trend`, multi-row panels, and one-row panels beside sibling panels are out of scope for behavior change in this pass.

## Verification floor

Commands:
```
npm run test:exam-layout
npm run test:structured-measurements
npm run test-visuals
npm run validate-bank -- banks/*.json
npx tsc -b --pretty false
npm run build
git diff --check
```
Browser evidence: one-series `lab_trend` before/after; two-series `lab_trend` unchanged; a sole 1×1 structured payload (e.g. `opus3_iv_potassium_safety_case_01`) before/after; a mixed multi-panel exhibit containing a one-row panel (e.g. `opus20_case_cdiff_01`) unchanged; English-first and always-bilingual display; desktop target and mobile fallback.

## Routing

UI/CSS verification tier. Producer implements; the independent gate is the measured proof renders plus the command floor above — not a clinical or content gate, since this order creates no content to review. Producer ≠ checker by role.
