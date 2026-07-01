# Claude Handoff: Exam-Like Case-Study Split Layout

Date: 2026-06-28  
Branch: `codex/exam-split-layout`

## Product Call

This pass implements a renderer-only NCLEX/Pearson-style presentation for case studies:

- client chart/exhibits on the left;
- one active embedded case part on the right;
- local previous/next and part-chip navigation;
- top-level case-study submit button inside the right-pane toolbar, visible regardless of active part;
- aggregate top-level case-study submit/grading unchanged.

It is not a per-part unfolding engine. There are no schema, bank, storage, grading, progress, SRS, import/export, or adaptive-session changes.

Standalone visual split layout was deferred intentionally. The case-study pass is the meaningful first PR, and standalone MAR/I&O/table fit should be reviewed separately.

Summary review and Developer Review intentionally use the stacked case-study layout. The split layout is for exam-like answering; review/triage surfaces are optimized for reading all parts and rationales quickly.

## Files Changed

- `src/App.tsx`
- `src/styles.css`
- `PROJECT-HISTORY.md`
- `SPLIT-SCREEN-LAYOUT-INVESTIGATION-2026-06-28.md` from the prior investigation pass
- `CLAUDE-HANDOFF-EXAM-SPLIT-LAYOUT-2026-06-28.md`

## Implementation Notes

`CaseStudyControl` now owns local `activePartId` state. It defaults to:

1. `focusedPartId` when the dev review console opens a specific embedded part;
2. first missed embedded part when initially mounted in submitted/review mode;
3. first embedded part otherwise.

Live sessions do not automatically jump to a missed part immediately after top-level submit. That felt potentially disorienting, and the spec allowed first-part behavior.

Inactive embedded parts stay mounted in the React tree with `hidden` rather than being conditionally removed. This preserves any local draft UI state in embedded item controls when the learner switches part tabs.

The top-level case-study submit button is rendered inside the split work pane toolbar. It is disabled until every embedded part is complete, but it is visible from every active part. Non-case questions keep the existing `QuestionCard` submit location.

New helper:

- `getVisibleCaseStages(question, activeQuestion)`

Conservative visibility rule:

1. global exhibits always render;
2. valid `answerableAfterStageId` renders stages cumulatively through that stage;
3. valid `stageId` renders stages cumulatively through that stage;
4. absent or invalid mapping renders all stages.

The all-stage fallback is deliberate. The investigation found that most staged case studies do not have reliable part-to-stage mappings, and nine mapped cases reference invalid stage IDs.

## CSS Notes

New reusable classes:

- `.exam-split-layout`
- `.exam-split-chart-pane`
- `.exam-split-work-pane`
- `.case-chart-section`
- `.case-work-toolbar`
- `.case-part-nav`
- `.case-part-nav-controls`
- `.case-part-chip-list`
- `.case-part-chip`
- `.case-active-part`

Desktop split mode uses a constrained two-column grid with independent internal scrolling for the chart pane and work pane. The right-pane toolbar is sticky inside the work pane so navigation and aggregate submit remain available while the active part scrolls. Mobile collapses to one column at the existing `820px` breakpoint, chart first, work pane second, and internal pane scrolling disabled.

The chart pane forces exhibits to one column so dense clinical cards do not get squeezed side-by-side.

## Smoke IDs Used

Case-study smoke set:

- Simple global-exhibits-only: `opus_psi_caregiver_2026_06_10_01`
- Clean mapped staged case: `opus25_case_tb_airborne_treatment_monitoring_01`
- Invalid-mapping staged case: `gpt_case_gallstone_pancreatitis_01`
- Stage exhibit visual: `cs_thyroid_storm_main`
- Six-part staged fallback case: `opus_vanco_case_01`

Observed:

- one `.case-active-part` is visible at a time in split mode; inactive parts remain mounted with `hidden`;
- part chips match embedded-part count;
- chip navigation switches active part;
- aggregate submit is visible from non-final active parts and remains disabled until all embedded parts are complete;
- clean mapped case showed one relevant stage;
- `stageId` mappings now show cumulative chart data, matching unfolding-case expectations;
- invalid mapped case fell back to all three stages;
- `cs_thyroid_storm_main` rendered `vis-vitals_trend` in the chart pane;
- mobile viewport stacked chart before work pane and disabled internal split scrolling;
- dark mode preserved light-locked clinical visual rendering;
- language modes EN / Tap ZH / EN-ZH toggled as expected;
- Summary review expansion rendered the stacked read-through layout.
- Developer Review renders case studies stacked so focused embedded-part triage can still scan the whole case.

## Verification

Passed:

```sh
npx tsc -b --pretty false
npm run validate-bank -- banks/*.json
npm run test-visuals
npm run build
```

`npm run build` still reports the existing Vite chunk-size warning.

## Known Issues / Review Requests

- Browser console showed a React nested-button warning when answer option buttons contain glossary term buttons. This appears to come from the existing `OptionAnswerControl` + `BilingualText`/`GlossaryText` structure rather than from the split layout, so I did not widen this PR.
- Desktop independent pane scrolling looked acceptable in the dev review console, but Claude should review in a normal full-width session too.
- Consider adding a deterministic advisory audit for unresolved `stageId` / `answerableAfterStageId` references; this branch consumes those fields and still safely falls back to all stages when they are invalid.
- Consider a later "expand chart" affordance for dense chart panes.
- Standalone visual split should be a separate PR, likely allowlisted by kind.
