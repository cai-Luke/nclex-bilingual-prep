# Codex Spec — Full-width standalone visuals in review surfaces (T1)

Date: 2026-06-30
Author: Claude (planning/spec seat)
Status: ready for Codex
Depends on: `exam-layout-extraction-and-tests-codex-spec.md` (uses the extracted `usesStandaloneVisualSplit`)

## Goal

Standalone visual-stimulus questions currently render in the exam-style split layout (visual left, work right) **everywhere** `QuestionCard` renders — including Summary review and the Developer console. In a review context, split is the wrong layout: the accordion/console column is narrow, and read-through is better served by the full-width visual-on-top layout. This mirrors the decision already made for case studies, which render stacked in review (`caseStudyLayout="stacked"`).

Add a sibling prop so review surfaces force standalone visuals full-width. Live answering is unchanged (stays split).

## Non-goals

- No change to live session answering layout (standalone split stays the default there).
- No change to case-study layout behavior (already correct).
- No grading/storage/schema/bank changes.

## Changes — `src/App.tsx`

1. `QuestionCard` props: add a sibling to the existing `caseStudyLayout`:
   ```ts
   caseStudyLayout = "split",
   standaloneVisualLayout = "split",
   ```
   and in the prop type block:
   ```ts
   caseStudyLayout?: CaseStudyLayoutMode;
   standaloneVisualLayout?: CaseStudyLayoutMode;
   ```
   (`CaseStudyLayoutMode = "split" | "stacked"` already exists.)

2. Gate the standalone-split boolean on the new prop (after Spec T2, the local is `showsStandaloneVisualSplit = usesStandaloneVisualSplit(question)`):
   ```ts
   const showsStandaloneVisualSplit =
     standaloneVisualLayout !== "stacked" && usesStandaloneVisualSplit(question);
   ```
   When `standaloneVisualLayout === "stacked"`, the `<article>` gets no `standalone-visual-card` class and renders the existing full-width branch (`<><VisualStimulus/>{answerBody}</>`). No new layout/CSS needed.

3. `SummaryView` — the review `QuestionCard` already passes `caseStudyLayout="stacked"`. Add:
   ```tsx
   standaloneVisualLayout="stacked"
   ```

4. `DeveloperReviewConsole` — its review `QuestionCard` must render both case studies and standalone visuals in read-through. Ensure the call passes **both**:
   ```tsx
   caseStudyLayout="stacked"
   standaloneVisualLayout="stacked"
   ```
   (Add whichever is not already present.)

Live `SessionView` passes neither prop, so both default to `"split"` — unchanged.

## Verification

```sh
npx tsc -b --pretty false
npm run build
```

## Smoke (browser, learner + review)

- Live session, `lab_trend` MCQ (`gpt_u3_labtrend_2026_06_09_mc_potassium_furosemide_01`) and `vitals_trend` (`vit_01`): still split (visual left, work right). No regression.
- Answer that question, finish set, open it in Summary review accordion: renders **full-width**, visual above stem, no `.standalone-visual-card`.
- Developer console, open `vit_01`: renders full-width (no split card).
- A non-included kind in review (e.g. `mar` `gpt_fresh_2026_06_22_vis_01`): unchanged full-width either way.

## Acceptance

- Summary review and Developer console render allowlisted standalone visuals full-width (visual-on-top).
- Live answering for the same questions is unchanged (split).
- `tsc -b` and `build` pass.
