Spec: io_trend split-layout fix + overlapping bars presentation
Goal

Improve the standalone io_trend question experience so that:

the full visual is visible in the two-panel desktop view without requiring horizontal scrolling, and
the intake/output chart adopts overlapping diverging bars (Epic-like presentation) as the preferred visual style.

This is a layout + renderer presentation change, not a schema/content change.

Decisions ratified
1) Keep io_trend in split view on desktop

Do not solve the problem by removing io_trend from the two-panel standalone visual layout.

Instead, keep the visual in the split view and give it a layout that is appropriate for its width needs.

2) Widen the visual pane specifically for io_trend

The current generic standalone split allocates too little width to the visual pane, which causes the chart/table block to overflow and require scrolling.

Implement a kind-specific wider split treatment for standalone io_trend visuals so the left visual pane gets materially more width than the current generic split.

This should be implemented as a targeted/layout-specific change, not a global widening of every standalone visual.

3) Adopt overlapping bars for io_trend

Render intake and output bars at the same x position per interval:

intake extends upward from zero
output extends downward from zero
both share the same interval center
cumulative net line remains overlaid

This is now the preferred style choice, not merely an overflow workaround.

4) Keep stacked fallback on narrower layouts

On narrow viewports / mobile / constrained preview states, the layout should still fall back to the existing stacked behavior (visual above work area/question) rather than forcing horizontal scrolling.

Scope
In scope
Standalone io_trend layout behavior in split view
io_trend chart bar placement/style
CSS/layout changes needed to eliminate horizontal scrolling for the visual block
Preservation of existing table/chart/question content and interaction
Out of scope
Schema changes
Bank/content regeneration
Changes to non-io_trend standalone visuals unless required incidentally by shared code
Reworking question copy, translation behavior, telemetry, or grading behavior
Changing the enlarge-visual feature beyond preserving compatibility
Implementation intent
A. Layout

Codex should implement a specific layout path for standalone io_trend visuals.

Suggested approach:

add an io_trend-specific class or gate in the standalone visual question card/layout path
give that layout a wider left pane than the generic standalone visual split
preserve current behavior for other standalone visual kinds unless explicitly needed

The important architectural point is:

generic standalone split remains generic
io_trend gets a specific width treatment
B. Chart renderer

In the io_trend chart renderer:

place intake and output bars on the same interval center
reduce/removal of side-by-side bar separation
keep the cumulative line and markers
keep the zero baseline visually clear
preserve distinct visual identity of intake vs output

This is a rendering/presentation change only; the underlying values and meanings must remain unchanged.

C. Table

The table under the chart should remain present and readable.

The combined visual block (legend/button + chart + full table including all columns) must fit in the intended split-view desktop experience without horizontal scrolling.

Acceptance criteria

Codex’s implementation is accepted when all of the following are true:

Desktop split-view behavior

On the target desktop dogfood view (the same general session view shown in the screenshot), a standalone io_trend question shows:

full legend
enlarge-visual button
full chart with all intervals visible
full table with all columns visible
no horizontal scrolling required to inspect the visual block
Chart presentation

The io_trend chart renders with:

overlapping intake/output bars per interval
intake above zero
output below zero
cumulative net line preserved
readable x-axis interval labeling
clear zero baseline
no obvious ambiguity about which series is which
Fallback behavior

On narrow/mobile-constrained layouts:

the experience falls back to stacked layout rather than forcing a horizontally scrollable split visual area
Non-regression

The change must not break:

other standalone visual question types
case study split layouts
enlarge visual control
existing question answering / submission flow
File-level guidance

Codex should expect this to involve at least:

the standalone question-card / split-layout logic
the CSS for standalone visual split layouts
the io_trend chart renderer (the diverging bar renderer / equivalent path used by that visual kind)

No schema or content file changes should be necessary.

Verification checklist for Codex

Before closing, verify all of the following manually in the app / preview flow:

Open a standalone io_trend question in the normal split session view.
Confirm the visual pane is visibly wider than before.
Confirm the visual no longer requires horizontal scrolling.
Confirm the bars overlap by interval center.
Confirm the cumulative line still reads correctly.
Confirm the table remains fully visible.
Confirm narrow/mobile preview still stacks.
Confirm a non-io_trend standalone visual still behaves normally.
Deliverable expectation

Codex should return:

the implementation
brief note on files changed
short verification summary against the checklist above