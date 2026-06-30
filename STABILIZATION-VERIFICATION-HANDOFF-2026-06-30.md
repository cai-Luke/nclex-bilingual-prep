# Stabilization Verification Handoff — 2026-06-30

Status: **Stopped on browser smoke mismatch. No app code patched in this pass.**

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

The smoke pass stopped on a manual mismatch, per the spec's stop condition.

Confirmed before the stop:
- `lab-canonical` live Study item at 1440x900 used the widened session shell, measured about 1393 px wide in-browser.
- The same `lab_trend` item rendered in `.exam-split-layout.standalone-visual-layout` with CSS `display: grid`, grid columns around `420px 912px`, and the lab SVG in `.standalone-visual-pane`.
- A hard-cases live case-study item rendered chart-over-work in `.case-study-panel.exam-split-layout`; the chart pane measured full-width above the work pane and had `overflow-y: auto`.
- The case-study completion count was visible as `1 of 4 parts complete`.

Stop reason:
- The stabilization checklist asks to confirm `Submit all parts` / completion count through a case-study part-switch flow.
- The current live case-study aggregate submit button visibly renders `Submit case study`.
- The button title attribute is still `Submit all parts` when ready, or `Complete all N parts before submitting` when incomplete, but the visible affordance text is not `Submit all parts`.
- Source location observed: `src/App.tsx`, in the split case-study toolbar, where the button span is `Submit case study`.

Because the checklist calls out `Submit all parts`, I treated this as a smoke mismatch and stopped without patching.

## Outstanding Smoke Items

Not completed because of the stop condition:
- Finish target 1: verify `mar` remains full-width and `io_record` splits with compacted 420-unit viewBox.
- Target 2: Summary / Developer Review full-width stacked layout for one case study and one standalone visual.
- Target 3: Preview Lab from Settings, including no session/progress write and desktop/mobile preview modes.
- Target 4: Mobile stacked layout below the split breakpoint.
- Target 5: On-tap Chinese reveal inside bowtie and highlight/dropdown answer controls.
- Target 6 remainder: part-switch scroll reset and sticky-toolbar clearance after deciding whether the visible submit copy should be `Submit all parts` or the checklist should be updated to accept `Submit case study`.

## Recommendation

Architects should decide whether the visible aggregate case-study submit copy should be restored to `Submit all parts` or whether the stabilization checklist should be amended to treat `Submit case study` as intentional current copy. After that decision, rerun the manual smoke checklist from the beginning.
