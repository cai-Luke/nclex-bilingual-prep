# Codex Spec: Mobile Graph Fit-to-Width Pass

**Date:** 2026-07-19
**Owner:** Luke
**Implementer:** Codex
**Scope:** UI/CSS and narrowly necessary presentation plumbing only

## 1. Owner call

Proceed without a separate architecture litigation pass.

This is a bounded mobile-presentation correction. It does not reopen the clinical, schema, grading, bank-content, visual-necessity, or split-layout decisions governing the affected visual kinds. The ordinary mobile question surface should avoid horizontal scrolling where a graph remains readable when scaled to the available width. Expanded focus mode remains the full-size inspection surface.

Do not modify `DECISIONS.md` as part of this implementation. Luke will brief the architect after the pass.

## 2. Problem

Several graph-like visuals retain desktop-oriented minimum widths on narrow screens. In particular, the Epic `vitals_trend` ordinary mobile stage is forced to `37.5rem`, so it scrolls horizontally even though its 600×360 design may remain usable when responsively scaled into the question column.

The same conservative width policy may affect other non-calibrated graph visuals. The mobile question shell also spends enough width on outer gutters and card padding that a materially larger graph viewport may be recoverable without changing renderer geometry.

## 3. Goal

At a representative narrow mobile viewport, non-calibrated graph visuals should present a useful fit-to-width overview without horizontal page or visual scrolling. The learner must retain access to a full-size expanded view for detailed inspection.

The pass should prefer CSS and existing responsive SVG behavior over renderer rewrites.

## 4. Required distinction

### 4.1 Candidate fit-to-width graph family

Evaluate and, where the proof supports it, make the ordinary mobile rendering fit the available width for:

- Epic-style `vitals_trend`
- `lab_trend`
- `io_trend` graph content
- unit-pure/panels `vitals_trend`, only where simple scaling remains readable

Do not assume all listed kinds need identical CSS. The implementation may use kind-specific selectors where their existing wrappers differ.

### 4.2 Calibrated tracings are out of scope

Do not remove native-width scrolling or otherwise compact:

- `rhythm_strip`
- `capnography`
- `fetal_monitoring`

Their calibrated morphology and grid readability require a separate measured decision.

### 4.3 Non-graph data surfaces

Do not make a broad table-compression change in this task.

For hybrid visuals such as `io_trend`, the graph may fit while an exact-value table remains independently scrollable. A table must not force the graph itself to retain a 600 px minimum width.

The case-study structured-measurements table issue is explicitly deferred.

## 5. Epic vitals contract

For ordinary mobile view:

- Remove the forced `37.5rem` minimum from the Epic chart stage.
- Allow the SVG and its HTML overlay controls to scale together to the available width.
- Preserve the exact-value readout below the graph.
- Preserve legend emphasis and time-column interactions.
- Do not create horizontal overflow in the visual or page.

For expanded focus mode:

- Preserve the existing full-width/minimum-width inspection behavior.
- Keep the enlarged chart scrollable when the viewport cannot contain its design width.
- Preserve the one-mounted-SVG focus-mode behavior established by the A/B implementation.

Do not change the Epic data model, adaptive ceiling, clinical validation, interaction state model, or persisted A/B setting.

## 6. Mobile shell width

Inspect the combined width loss from `main`, `.question-card`, standalone visual wrappers, and mobile preview wrappers.

Recover a modest amount of graph width on narrow screens where this can be done without making ordinary text and controls touch the viewport edges. Prefer a small mobile-only reduction in outer gutter and/or card padding over global desktop changes.

Do not change the desktop or split-screen layout merely to improve mobile width.

## 7. Implementation order

1. Establish the current representative viewport behavior before editing.
2. Remove ordinary-view minimum-width constraints from Epic vitals while retaining the focus-dialog constraint.
3. Apply the smallest safe mobile shell spacing adjustment that materially increases graph width.
4. Evaluate the other candidate graph kinds and add only the selectors needed to make proven-safe kinds fit.
5. Keep calibrated tracing behavior unchanged.
6. Avoid renderer code changes unless CSS scaling cannot satisfy a required interaction or readability condition. Stop and report rather than redesigning a renderer beyond this spec.

## 8. Proof viewport and surfaces

Use at minimum:

- **390 × 844 CSS px** narrow mobile viewport
- ordinary standalone question view
- ordinary case-study/embedded visual view where the kind can appear
- expanded focus mode
- Preview Lab mobile surface when available

Use representative current valid fixtures or canonical items for each affected kind. Do not author or alter bank content for the proof.

## 9. Acceptance criteria

### 9.1 Epic vitals ordinary mobile

- Entire chart width is visible without horizontal scrolling.
- No page-level horizontal overflow.
- Legend labels and axis labels remain meaningfully readable as an overview.
- Time-column hover/focus/tap controls remain aligned with their SVG columns.
- Legend controls remain aligned with their visual entries.
- Exact-value readout remains readable and usable.
- Tapping controls does not accidentally open focus mode.
- The enlarge action still opens the full-size view.

### 9.2 Expanded Epic vitals

- Full-size geometry is preserved.
- Horizontal scrolling remains available where needed.
- Close, Escape, backdrop behavior, focus restoration, and scroll restoration remain intact.
- Only one Epic SVG is mounted while the dialog is open.

### 9.3 Other fit-to-width graph kinds

For every kind changed:

- Entire ordinary graph is visible without horizontal scrolling at the proof viewport.
- The load-bearing trend/pattern remains answerable.
- Axis labels, timestamps, legend labels, and plotted marks are not clipped.
- No regression appears at desktop width.
- Focus mode remains available at a more inspectable size.

### 9.4 Explicit unchanged surfaces

- Calibrated tracings retain their current native-width/scroll behavior.
- No schema, bank, grading, validation, self-check, clinical-range, or persisted-setting behavior changes.
- No change to the current desktop split allowlists or measured split decisions.

## 10. Testing and verification

This is primarily a UI/CSS pass, but it touches learner-facing visual presentation. Run:

```bash
npx tsc -b --pretty false
npm run build
npm run test-visuals
```

Also run the relevant kind-specific visual tests for every renderer kind whose files or presentation contract are touched. If the implementation remains CSS-only, still run the existing visual smoke/parity path to prove renderer output did not drift.

Perform and record browser proof at 390×844 for:

- Epic vitals ordinary view and focus view
- each additional graph kind changed
- one calibrated tracing showing scrolling was preserved
- no page-level horizontal overflow

If any renderer file under `src/visuals/**` is changed, follow the full renderer verification floor in `AGENTS.md`, including `validate-bank` and required self-check regressions.

## 11. Documentation

Update `PROJECT-HISTORY.md` with:

- the mobile fit-to-width behavior that landed;
- the graph kinds covered;
- the calibrated tracings deliberately excluded;
- the proof viewport and verification results.

Do not record this as an architectural reversal. It is a presentation allocation: fit-to-width overview in ordinary mobile view, full-size inspection in focus mode.

## 12. Stop conditions

Stop and report instead of improvising if:

- Epic overlay controls cannot remain geometrically aligned under responsive scaling;
- a candidate graph becomes materially unreadable or non-answerable when fit to width;
- satisfying the task requires changing visual source data, schema, clinical ranges, or grading;
- a renderer redesign appears necessary rather than a bounded responsive-layout adjustment;
- unrelated worktree changes are present and cannot be cleanly preserved.

## 13. Deliverable

Implement the bounded mobile fit-to-width pass, commit the code and documentation, and provide:

- files changed;
- graph kinds changed;
- before/after proof dimensions;
- commands run and results;
- browser-proof summary;
- any candidate kind intentionally left scrolling because the proof failed.
