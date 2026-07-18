# Shape-Aware Visual Layout — P4 Presentation Follow-Up (Codex Work-Order)

Status: **Open — scoped, not yet commissioned. Not a prerequisite for any other work.**

Provenance: deferred presentation item from `DECISIONS.md` Principle 29 (P4 single-row lab presentation survey). Presentation/renderer-only; authorizes **no** bank, schema, generation, census, grading, stage-visibility, answer-coupling, or case-identity change.

## Problem (from dogfooding)

Single-series `lab_trend` visuals and single-row `structured_labs_panel` exhibits render awkwardly. A one-series horizontal time-trend is compressed into the left half of the standalone split layout (meant for denser charts), and a one-row labs panel is stretched across a full document-table card. P4 (Principle 29) ruled the *content* correct and the *shape* valid: this is a viewport-allocation problem, not a data-shape problem, and no bank content changes.

## Closed-world inputs (verified against `src/examLayout.ts`)

- Split eligibility today: `usesStandaloneVisualSplit(question)` returns true iff `question.itemType !== "case_study"`, `question.visual` is defined, and `question.visual.kind ∈ STANDALONE_SPLIT_VISUAL_KINDS`. `lab_trend` is in that set. The function inspects visual **kind only** — never the payload — so a one-series `lab_trend` is forced into the split identically to a two-series one.
- `structured_labs_panel` exhibits live inside `case_study` items, which the `itemType !== "case_study"` gate excludes from `usesStandaloneVisualSplit`. Their layout is the case renderer's chart-over-work presentation, **not** the standalone split — so Work Item 2 is a different render path from Work Item 1.
- Governing rule: `DECISIONS.md` Principle 23 — exam-like presentation is a renderer concern; **standalone/split eligibility is determined by measured visual geometry, not nominal type, and a kind joins or leaves the standalone allowlist only after a MEASURED proof render, never a predicted one.** Exact dimensions and allowlist contents are owned by `src/examLayout.ts`, not by prose. Case identity and grading are out of scope and must not change.

## Work Item 1 — one-series `lab_trend` leaves the split, renders full-width above the stem

- Make split eligibility payload-aware: a `lab_trend` whose `visual.series.length === 1` must **not** use the standalone split; it renders full-width above the question stem. Two-series `lab_trend` behavior is unchanged in this pass (revisit only with its own dogfood evidence).
- The full-width render must be allowed to exceed the current standalone dimension cap for `lab_trend` — moving the same compressed chart above the stem is not an improvement. Choose the new width/height from a measured proof render, not a predicted one.
- Acceptance: a measured proof render (not a prediction) showing the one-series trend at readable axis scale full-width above the stem; two-series trends visually unchanged; `usesStandaloneVisualSplit` unit coverage extended to the series-count branch; `tsc`, bank validation, and build green.

## Work Item 2 — density-aware sizing for one-row / low-density structured labs panels

- Locate the structured-measurement panel renderer (the component that renders `structuredMeasurements.panels[]` for case exhibits) and its card/table CSS. (Codex identifies the exact file; not asserted here.)
- Target: size by rows **and** columns rather than treating every panel as a full document-table card.
  - 1 row × 1 column → compact result strip near its natural width; no forced full-width card, no unnecessary minimum card height.
  - 1 row × several columns → full available width, horizontal table.
  - several rows → existing document-table presentation, unchanged.
- Lowest-risk first pass is CSS/sizing only (remove forced min-height; stop stretching a 1×1 panel across the whole case chart). A dedicated compact renderer is a follow-up only if sizing alone is insufficient.
- Do **not** remove the duplicated prose value. The structured renderer is SVG with a generic image label; the prose remains the accessible textual fallback until a semantic-table surface exists (consistent with Principle 24, structured measurements supplement prose).
- Acceptance: measured proof renders of a 1×1, a 1×N, and an N-row panel showing the intended sizing; multi-row panels unchanged; `tsc` and build green.

## Hard fences

- Presentation-only. No change to any bank, schema, generation prompt, census, coverage report, grading, scoring, stage visibility, answer coupling, or case identity.
- No allowlist or dimension change lands on a predicted render — a measured proof render is required (Principle 23).
- Two-series `lab_trend` and multi-row panels are explicitly out of scope for behavior change in this pass.

## Routing

UI/CSS verification tier. Producer implements; the independent gate is the measured proof renders plus visual smoke and `tsc`/build/bank-validation — not a clinical or content gate, since this work order creates no content to review. Producer ≠ checker by role.
