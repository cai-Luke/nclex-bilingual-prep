# Claude Handoff — Case-Study Split QA Hardening

Date: 2026-06-28  
Branch: `codex/case-split-qa-hardening`

## Scope

This is the PR 1.2 hardening pass after the case-study split layout and stage-reference audit landed.

No grading, storage, schema, or bank content behavior changed.

## Fixes Made

- Changed the live case-study aggregate submit copy from `Submit answer` to `Submit all parts`.
- Added a case navigation completion line, e.g. `0 of 6 parts complete`, so the disabled submit state has nearby whole-case context.
- Reset the work pane scroll position to the top when the learner switches active case parts.
- On mobile-width split collapse, part switching scrolls the work pane into view so the learner is not left stranded in the chart.
- Fixed the independent-scroll CSS constraint for live split case cards:
  - `.split-case-card .exam-split-layout` now stretches grid items inside the fixed-height container.
  - chart/work panes get `min-height: 0` and `max-height: 100%` so `overflow-y: auto` actually constrains the panes.
- Changed glossary popovers to position from the clicked term button and clamp inside the containing pane. Chart-side terms now open inside the chart pane instead of the old card-level top-right position.

## Smoke Notes

Browser smoke used the local dev server at `http://localhost:5173/`.

| Case | Purpose | Result |
| --- | --- | --- |
| `opus_psi_caregiver_2026_06_10_01` | Developer Review stacked global-only case | Passed: Developer Review used stacked layout, showed all 6 parts and rationales, and rendered no split card. |
| `opus25_case_tb_airborne_treatment_monitoring_01` | Live clean mapped staged case | Passed: one split card, chart/work panes independently scrolled, one active part visible, 5 inactive parts mounted hidden, submit appeared once as `Submit all parts`, and status showed `0 of 6 parts complete`. |
| `gpt_case_gap_2026_06_11_case_adhf_01` | Live invalid/absent mapping fallback after PR 1.1 repair | Passed: first part showed all declared stages (`Thirty minutes later`, `After initial treatment`) rather than hiding chart data. |
| `cs_thyroid_storm_main` | Live stage exhibit visual | Passed: split layout rendered and the stage visual appeared in the chart pane. |
| `opus_vanco_case_01` | Live six-part no-mapping fallback case | Passed: one active part visible, 5 inactive parts mounted hidden, and all 3 declared stages shown. |

Additional checks:

- Desktop split pane geometry after the CSS fix: layout/chart/work panes were all 512px high; chart/work `scrollHeight` exceeded pane height and `overflow-y` was `auto`.
- Part-switch scroll reset: after scrolling the work pane to `600px`, clicking `Next` moved to Part 2 and reset work pane `scrollTop` to `0`.
- Mobile viewport `390x844`: split collapsed to one column, chart appeared before the work pane, pane overflow was visible instead of internal scrolling, and the case toolbar was static.
- Mobile sticky submit/session actions did not overlap.
- Chart-side glossary popover for `Tuberculosis` stayed contained in the chart pane and did not overlap the work pane.

Commands:

- `npx tsc -b --pretty false`
- `npm run validate-bank -- banks/*.json`
- `npm run test-visuals`
- `npm run build`

Notes:

- `npm run build` still has the existing Vite chunk-size warning.

## Review Requests

1. Confirm the fixed-height pane range is still appropriate: `height: clamp(32rem, calc(100vh - 13rem), 48rem)`.
2. Confirm the case-submit copy should be `Submit all parts` rather than `Submit case`.
3. Confirm whether glossary popovers should remain pane-clamped, or whether a future pass should replace them with a shared anchored popover component.
