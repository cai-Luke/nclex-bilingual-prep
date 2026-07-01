# Stabilization Verification Handoff — 2026-06-30

Status: **Rerun passed after architect-side app patch.**

## Rerun After Patch

Claude patched the visible split case-study aggregate submit copy in `src/App.tsx` from `Submit case study` to `Submit all parts`. I reran the full automated suite and browser smoke against that patched tree.

Outcome:
- The original stop condition is resolved: the live split case-study toolbar now visibly renders `Submit all parts`.
- No app code was patched during this rerun by Codex; I only verified Claude's patch and updated documentation.
- The only tooling limitation was direct IndexedDB inspection from the browser automation sandbox. As a fallback, I compared the learner-visible Home counters before and after a Preview Lab visit; they were unchanged.

## Browser Capability

This run had rendering/browser capability. I used the in-app browser against the local Vite dev server at `http://localhost:5173/` with a 1440x900 desktop viewport for desktop smoke checks.

## Automated Checks

All requested automated commands passed, in order:

```sh
npx tsc -b --pretty false
npm run test:exam-layout
npm run test:session-navigation
npm run test:grading
npm run test:highlight
npm run test:bowtie
npm run test:case-completeness
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run audit
npm run census:check
npm run build
```

Notes:
- `npm run audit` exited 0 with the existing advisory non-MCQ distribution warning and `audit:integrity` marked insufficient because no raw drafts were present.
- `npm run build` exited 0 with the existing Vite chunk-size warning.

## Browser Smoke Results

Rerun smoke findings:
- **Live Study split layout:** Passed. `lab_trend` rendered in `.exam-split-layout.standalone-visual-layout` at about `420px / 912px` columns inside a 1393px session shell. `io_record` rendered split with a visual SVG viewBox of `0 0 420 324`. `mar` stayed full-width with no standalone split container. A hard-cases case study rendered chart-over-work; the chart pane had `overflow-y: auto`.
- **Summary / Developer Review layout:** Passed. Developer Review rendered a case study stacked with zero case split panels, and rendered a standalone lab visual full-width with zero standalone split panels. Actual Summary expanded an `io_record` standalone visual with zero standalone split panels. Source check confirms Summary passes both `caseStudyLayout="stacked"` and `standaloneVisualLayout="stacked"` into `QuestionCard`.
- **Preview Lab:** Passed. Opened from Settings. Live preview split a case study and a `lab_trend`; Summary/review mode removed standalone split for the lab visual; Mobile stacked mode rendered inside the 400px mobile preview canvas. Browser automation could not directly inspect IndexedDB, but Home counters before and after a Preview Lab visit were identical: 1665 Questions, 4 Answered, 3 Due review, 1 Mistakes, 0 Flagged, 3055 Vocab terms.
- **Mobile stacked layout:** Passed. At an 800px viewport, standalone `lab_trend` collapsed to one grid column with visual and work panes both full-width; the case-study split also collapsed to a one-column stacked layout.
- **On-tap Chinese reveal inside answer controls:** Passed. In a live bowtie item, tapping a token reveal button decreased reveal buttons from 11 to 10 and left selected token count at 0. In a live highlight item, tapping the answer-control reveal button decreased reveal buttons from 1 to 0 and left selected segment count at 0.
- **Case-study part-switch flow:** Passed. After scrolling a split case study and switching from Part 1 to Part 3, the active part changed, the visible scroll position reset upward, the sticky toolbar stayed clear of the active content, the completion count remained `1 of 4 parts complete`, and the aggregate submit affordance read `Submit all parts`.

Historical first-run stop:
- The first run stopped because the visible case-study aggregate submit copy was `Submit case study` while the checklist expected `Submit all parts`.
- That mismatch is now fixed by the architect-side patch and verified in browser.

## Recommendation

No further stabilization blocker found in this rerun.
