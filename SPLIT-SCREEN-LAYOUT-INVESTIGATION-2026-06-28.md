# Split-Screen Layout Investigation

Date: 2026-06-28  
Scope: feasibility investigation only; no schema, bank, grading, storage, or UI implementation changes.

## Executive Summary

Project Shrimp can support an NCLEX/Pearson-style split-screen testing layout with a local React/CSS refactor. The lowest-risk path is a renderer-only case-study layout that keeps each `case_study` as one top-level session question, adds an active embedded-part navigation UI inside `CaseStudyControl`, and renders the relevant client record/exhibits in a left pane while the active part renders in a right pane.

The data model is close enough for this, but stage visibility must be conservative. Of 143 bundled case studies, 102 have stages, but only 21 use explicit embedded-part stage mapping fields. Nine of those mapped cases contain invalid stage references. That leaves 12 staged case studies with clean explicit mappings, 41 simple global-exhibits-only cases, and 90 staged cases that need fallback behavior because mappings are absent or invalid. The feature is feasible, but any first PR should avoid hiding stage data too aggressively.

Verification performed:

- `npm run validate-bank -- banks/*.json` passed for all 13 bundled banks.
- `npm run build` passed with the existing Vite chunk-size warning.

## 1. Current Case-Study Data Shape

Bundled top-level banks audited: `banks/*.json`.

| Metric | Count |
|---|---:|
| Top-level bundled questions | 1,665 |
| Top-level `case_study` questions | 143 |
| Embedded case-study questions | 721 |
| Case studies with no stages and global exhibits only | 41 |
| Case studies with stages | 102 |
| Case studies with explicit `stageId` and/or `answerableAfterStageId` mappings | 21 |
| Case studies needing fallback because mappings are absent | 81 |
| Case studies needing fallback because mappings are invalid/ambiguous | 9 |
| Case studies with embedded question-level `visual` | 0 |
| Case studies with global exhibit `visual` | 0 |
| Case studies with stage exhibit `visual` | 1 |

Stage-count distribution:

| Stage count | Case studies |
|---:|---:|
| 0 | 41 |
| 1 | 25 |
| 2 | 12 |
| 3 | 60 |
| 4 | 5 |

Embedded-part count distribution:

| Embedded parts | Case studies |
|---:|---:|
| 4 | 47 |
| 5 | 43 |
| 6 | 53 |

Mapping-field distribution:

| Mapping mode | Case studies |
|---|---:|
| None | 122 |
| `stageId` only | 19 |
| `answerableAfterStageId` only | 1 |
| Both fields present somewhere in case | 1 |

Invalid stage references found:

| Parent case | Bank | Part | Field | Referenced value | Valid stage IDs |
|---|---|---|---|---|---|
| `gpt_case_gap_2026_06_11_case_adhf_01` | `gpt-canonical.json` | `gpt_case_gap_2026_06_11_adhf_matrix_01` | `stageId` | `adhf_triage` | `adhf_stage2`, `adhf_stage3` |
| `gpt_case_gap_2026_06_11_case_aki_02` | `gpt-canonical.json` | `gpt_case_gap_2026_06_11_aki_matrix_01` | `stageId` | `aki_initial` | `aki_stage2`, `aki_stage3` |
| `gpt_case_gap_2026_06_11_case_pancreatitis_03` | `gpt-canonical.json` | `gpt_case_gap_2026_06_11_panc_matrix_01` | `stageId` | `panc_initial` | `panc_stage2`, `panc_stage3` |
| `gpt_case_gap_2026_06_11_case_adrenal_crisis_04` | `gpt-canonical.json` | `gpt_case_gap_2026_06_11_adrenal_matrix_01` | `stageId` | `adrenal_initial` | `adrenal_stage2`, `adrenal_stage3` |
| `gpt_case_gap_2026_06_11_case_urosepsis_05` | `gpt-canonical.json` | `gpt_case_gap_2026_06_11_sepsis_matrix_01` | `stageId` | `sepsis_initial` | `sepsis_stage2`, `sepsis_stage3` |
| `gpt_case_gap_2026_06_11_case_anticoag_bleeding_06` | `gpt-canonical.json` | `gpt_case_gap_2026_06_11_anticoag_matrix_01` | `stageId` | `anticoag_initial` | `anticoag_stage2`, `anticoag_stage3` |
| `gpt_case_gallstone_pancreatitis_01` | `hard-cases-canonical.json` | `gpt_case_gallstone_pancreatitis_01_q1` | `stageId` | `admission` | `stage_1`, `stage_2`, `stage_3` |
| `gpt_case_gbs_respiratory_compromise_01` | `hard-cases-canonical.json` | `q1`, `q2`, `q3` | `answerableAfterStageId` | `initial` | `stage1_0_12h`, `stage2_12_24h`, `stage3_icu_days2_5` |
| `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01` | `hard-cases-canonical.json` | `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_q1` | `stageId` | `initial` | `stage1`, `stage2`, `stage3` |

The only case-study visual found is a `vitals_trend` stage exhibit:

| Parent case | Bank | Stage | Exhibit | Kind |
|---|---|---|---|---|
| `cs_thyroid_storm_main` | `hard-cases-canonical.json` | `stage_1200` | `ex_trend_1200` | `vitals_trend` |

## 2. Current Standalone Visual Data Shape

Standalone non-case questions with `visual`: 153. There are no embedded case subquestions with their own `visual`.

Count by visual kind:

| Visual kind | Count | Split-pane fit |
|---|---:|---|
| `rhythm_strip` | 44 | Good candidate, but needs horizontal scroll or wider left pane. |
| `lab_trend` | 20 | Good candidate. |
| `medication_label` | 13 | Good candidate. |
| `device_screen` | 12 | Good candidate. |
| `burn_map` | 11 | Good candidate. |
| `io_record` | 11 | Dense; usable with careful width. |
| `mar` | 11 | Dense; likely the highest overflow risk. |
| `vitals_trend` | 10 | Good candidate. |
| `injection_site` | 8 | Good candidate. |
| `capnography` | 7 | Good candidate, tracing width needs scroll handling. |
| `fetal_monitoring` | 6 | Dense/wide; likely needs special casing or a full-width fallback. |

Count by item type:

| Item type | Visual count |
|---|---:|
| `multiple_choice` | 82 |
| `fill_in_blank` | 26 |
| `matrix` | 22 |
| `select_all` | 15 |
| `ordered_response` | 4 |
| `dropdown_cloze` | 4 |

Visual kinds most likely too wide or dense for a constrained left pane:

- `fetal_monitoring`: synchronized tracing is wide and visually dense.
- `mar`: table density can become cramped.
- `io_record`: table density can become cramped.
- `rhythm_strip` and `capnography`: feasible, but the current CSS intentionally gives tracing SVGs a `min-width: 36rem` and horizontal scrolling.

Best candidates for split-pane layout:

- `lab_trend`
- `vitals_trend`
- `device_screen`
- `medication_label`
- `burn_map`
- `injection_site`
- `capnography` with horizontal-scroll preservation
- `rhythm_strip` with horizontal-scroll preservation

## 3. Current Renderer Behavior

Current path in `src/App.tsx`:

- `SessionView` selects `session.questions[session.index]`, gets `session.answers[question.id] ?? getInitialAnswer(question)`, checks whether `session.results` has the top-level question ID, and renders one `QuestionCard`.
- `QuestionCard` renders metadata, `VisualStimulus` for `question.visual`, stem/read-aloud controls, `QuestionAnswerControl`, submit button, answer banner, language-miss affordance, and `RationalePanel`.
- `QuestionAnswerControl` delegates by `itemType` to option, fill-in-blank, matrix, highlight, bowtie, case-study, or dropdown controls.
- `CaseStudyControl` currently renders, in one vertical flow: case title/summary, global exhibits, every stage and all stage exhibits, then every embedded case question with its stem, answer control, and part rationale after top-level submission.
- `CaseExhibit` already supports `exhibit.visual` through the same `VisualStimulus` dispatcher.
- Summary review reuses `QuestionCard` inside `SummaryView`, with `submitted` forced true and the stored top-level answer/result passed back in.

Least-disruptive insertion point:

- Add a case-specific split layout inside `CaseStudyControl`, not above `QuestionCard`.
- Keep `QuestionCard` responsible for top-level metadata, submit, rationale, flagging, language miss, and session integration.
- Refactor `CaseStudyControl` into chart-pane and active-part-pane subcomponents, with local UI state for `activePartId`.
- For standalone visual split layout, insert a wrapper inside `QuestionCard` around `VisualStimulus + stem + QuestionAnswerControl`, gated by `question.visual && question.itemType !== "case_study"`.

## 4. Current Grading And Session Behavior

`AnswerState.caseStudy` is `Record<string, AnswerState>`, keyed by embedded case question ID.

`getInitialAnswer` initializes a case study as:

```ts
{
  caseStudy: Object.fromEntries(
    question.caseStudy.questions.map((caseQuestion) => [caseQuestion.id, getInitialAnswer(caseQuestion)]),
  ),
}
```

`getAnswerCompleteness` treats the whole case study as ready only when every embedded part is complete.

`scoreQuestion` delegates `case_study` to `scoreCaseStudy`, which sums `scoreStandaloneQuestion` for every embedded part. `gradeQuestion` then requires full earned points across the aggregate case.

Session state is top-level-question oriented:

- `answers`, `results`, and `scores` are keyed by top-level `question.id`.
- `progress`, flags, answer history, SRS scheduling, skipped question behavior, adaptive difficulty, and summary review all operate on top-level question IDs.
- Stored active sessions persist `questionIds`, `answers`, `results`, `scores`, `skippedQuestionIds`, `phase`, and adaptive state.

Feasibility conclusions:

- Active embedded-part navigation can be added without changing top-level session identity, because all embedded answers already live inside the single top-level `AnswerState.caseStudy` object.
- Per-part submit would require deeper changes. It would need partial result state, partial completeness rules, possibly per-part rationales before final case submission, and new persistence semantics. It would also complicate progress, flags, SRS, adaptive mode, skipped review, and summary review.
- A renderer-only active part UI is compatible with current grading/session behavior if the existing top-level submit remains the only grading event.

## 5. Stage Visibility Feasibility

Candidate rules:

1. Always show global exhibits.
2. For embedded parts with valid `stageId`, show global exhibits plus that one stage.
3. For embedded parts with valid `answerableAfterStageId`, show global exhibits plus all stages up to and including that stage.
4. For unmapped or invalid embedded parts, show all stages.

Recommended rule for the current bank:

- Use global exhibits as the permanent chart base.
- Use valid `answerableAfterStageId` cumulatively.
- Use valid `stageId` as focused stage context, but consider showing previous stage headers or an "all chart data" toggle because many NCLEX-style unfolding cases depend on earlier data.
- Use all stages as fallback when mapping is absent or invalid.

Clean behavior count under this rule:

| Behavior bucket | Case studies |
|---|---:|
| Clean simple/global-only behavior | 41 |
| Clean explicit stage behavior | 12 |
| Needs fallback for absent mapping | 81 |
| Needs fallback for invalid mapping | 9 |

Dangerous or ambiguous cases are the nine invalid-reference parents listed in Section 1. The 81 unmapped staged cases are not structurally invalid, but hiding stages by inferred part order would be unsafe without content review.

## 6. UI/CSS Feasibility

A reusable split layout can be added with CSS plus local React refactor. No schema change, dependency, server, or storage change is needed.

Current helpful CSS facts:

- `QuestionCard`, `CaseStudyControl`, `CaseExhibit`, and visual wrappers already use `min-width: 0`, which helps grid/flex overflow.
- Visual rendering is centralized in `VisualStimulus`.
- Visual panels are light-locked with `color-scheme: light`, which protects clinical visuals in dark mode.
- The mobile session UI already has responsive rules and sticky bottom actions.

Risks:

- Current visual CSS gives tracing SVGs `min-width: 36rem`; split panes must preserve horizontal scroll and avoid squeezing waveforms.
- `mar`, `io_record`, and `fetal_monitoring` are dense and may need a full-width or "expand chart" fallback.
- Sticky left panes are feasible on desktop but risky if nested inside the existing mobile sticky topbar/bottom action structure. Use desktop-only sticky behavior, with normal flow on mobile.
- The term popover is positioned relative to `QuestionCard`; a split layout should check that it does not float over the wrong pane.
- Summary review reuses `QuestionCard`; split behavior should either be disabled in summary or intentionally supported there.

Mobile collapse:

- Use stacked layout below roughly the existing `820px` breakpoint.
- Put chart/client record first, then active question and answer controls.
- Keep the existing sticky submit and session-actions behavior.
- Avoid making the chart pane independently sticky on mobile.

`App.tsx` monolith:

- A full component extraction is not required before implementing a first split-screen PR.
- A small local extraction is recommended: `CaseChartPane`, `CasePartNavigator`, `CaseActivePart`, and possibly `StandaloneVisualQuestionLayout`.
- Broader App decomposition should be deferred unless the feature PR becomes hard to review.

## 7. Recommended Implementation Path

### Option A: Renderer-only case-study split layout

Keep `case_study` as one top-level session question. Add active embedded-part navigation inside `CaseStudyControl`.

Assessment:

- Difficulty: medium.
- Risk: low to medium if top-level submit remains unchanged.
- Files likely touched: `src/App.tsx`, `src/styles.css`; optional tiny helper in a new local component file if desired.
- UX quality: high for exam-like behavior, especially because current all-parts vertical rendering is unlike Pearson-style case navigation.
- Compatibility: strong. Existing `AnswerState.caseStudy`, aggregate completeness, aggregate score, flags, progress, skipped review, summary review, and adaptive mode can remain unchanged.

Recommended as PR #1.

### Option B: Flatten embedded case parts into pseudo-session steps

Treat each embedded case part as its own session step while sharing a parent chart.

Assessment:

- Difficulty: high.
- Risk: high.
- Files touched: `src/App.tsx`, `src/grading.ts`, storage/hydration, progress, summary, possibly session navigation and sampler logic.
- Progress/scoring implications: substantial. The app currently keys learning history by top-level `question.id`; pseudo-steps would need stable synthetic IDs or nested progress semantics.
- Recommendation: defer. This is only worth revisiting if the product later wants per-part submit, per-part progress, or true unfolding reveal over time.

### Option C: Standalone visual split layout

For non-case questions with `visual`, render visual left and stem/answer right.

Assessment:

- Difficulty: low to medium.
- Risk: low if gated by visual kind and responsive CSS.
- UX quality: good for `lab_trend`, `vitals_trend`, `device_screen`, `medication_label`, `burn_map`, `injection_site`, `rhythm_strip`, and `capnography`.
- Special-case or initially exclude: `fetal_monitoring`, possibly `mar` and `io_record` if desktop pane width is too tight.
- Recommendation: do as PR #2 after the case-study split lands. It is simpler, but combining it with case-study navigation increases review surface and screenshot QA burden.

## Suggested First PR Shape

1. Refactor `CaseStudyControl` locally into chart pane, part navigation, and active part rendering.
2. Add local `activePartId` state, defaulting to the first embedded part and advancing only through explicit learner navigation.
3. Preserve the existing top-level Submit button and aggregate completeness requirement.
4. Implement the conservative stage-visibility helper:
   - global exhibits always visible;
   - valid `answerableAfterStageId` means cumulative stages;
   - valid `stageId` means focused stage;
   - absent/invalid mapping means all stages.
5. Add desktop split CSS and mobile stacked fallback.
6. QA with:
   - one simple global-only case;
   - one valid mapped staged case;
   - one invalid mapped case;
   - `cs_thyroid_storm_main` because it has a stage exhibit visual;
   - summary review expansion;
   - dark mode;
   - mobile viewport.

## Bottom Line

Feasible. The app already has the right static/offline architecture, nested answer shape, and visual dispatcher. The main constraint is bank metadata quality: most staged cases cannot safely drive precise chart filtering. Ship a renderer-only split layout first, use conservative all-stage fallback, and defer pseudo-session flattening or per-part submit until there is a deliberate storage/grading redesign.
