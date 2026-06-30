# Codex Spec — Extract exam-layout logic + regression tests (T2)

Date: 2026-06-30
Author: Claude (planning/spec seat)
Status: ready for Codex

## Goal

Move the three pure layout helpers out of `src/App.tsx` into a new importable module `src/examLayout.ts`, then add a deterministic regression test. This is behavior-preserving — no rendered output, grading, storage, schema, or bank changes. The point is to make the split/stage logic testable the same way `grading.ts`, `sessionNavigation.ts`, and `sessionSampler.ts` are, and to lock the clinical-safety-relevant stage-visibility rule (cumulative + fail-open) against silent regression.

Land this spec **before** `standalone-visual-review-layout-codex-spec.md` (T1), which imports the extracted predicate.

## Non-goals

- No behavior change. `getVisibleCaseStages` and the standalone-split gate must produce identical results.
- No change to `CaseStudyControl`/`QuestionCard` rendering beyond swapping a local definition for an import.
- No new visual kinds, no schema/bank edits, no grading edits.

## Step 1 — Create `src/examLayout.ts`

Move the existing logic verbatim (same behavior) into a new pure module. It must import only from `./types` (no React, no CSS, no DOM).

```ts
import type {
  CaseStudyQuestion,
  CaseStudyStage,
  CaseSubQuestion,
  Question,
  QuestionVisual,
} from "./types";

// Standalone visual kinds that render in the exam-style split layout.
// Excluded by design: rhythm_strip, capnography, fetal_monitoring (calibrated
// wide tracings whose min-width:36rem horizontal-scroll calibration breaks in a
// half-width pane), and mar / io_record (dense tables unreadable at the ~384px
// desktop visual pane). See DECISIONS.md principle 23.
export const STANDALONE_SPLIT_VISUAL_KINDS: ReadonlySet<QuestionVisual["kind"]> = new Set([
  "vitals_trend",
  "lab_trend",
  "medication_label",
  "device_screen",
  "burn_map",
  "injection_site",
]);

export const usesStandaloneVisualSplit = (question: Question): boolean =>
  question.itemType !== "case_study" &&
  question.visual !== undefined &&
  STANDALONE_SPLIT_VISUAL_KINDS.has(question.visual.kind);

// Stage visibility is cumulative and fail-open. Both stageId and
// answerableAfterStageId show all stages up through the active part's stage;
// an absent or unresolved reference shows ALL stages so chart data is never
// hidden (unfolding cases are cumulative). See DECISIONS.md principle 23.
export const getVisibleCaseStages = (
  question: CaseStudyQuestion,
  activeQuestion?: CaseSubQuestion,
): CaseStudyStage[] => {
  const stages = question.caseStudy.stages ?? [];
  if (!activeQuestion || stages.length === 0) return [];
  const stageIndexById = new Map(stages.map((stage, index) => [stage.id, index] as const));
  const answerableAfterStageIndex =
    activeQuestion.answerableAfterStageId !== undefined
      ? stageIndexById.get(activeQuestion.answerableAfterStageId)
      : undefined;
  if (answerableAfterStageIndex !== undefined) {
    return stages.slice(0, answerableAfterStageIndex + 1);
  }
  const stageIndex =
    activeQuestion.stageId !== undefined ? stageIndexById.get(activeQuestion.stageId) : undefined;
  if (stageIndex !== undefined) {
    return stages.slice(0, stageIndex + 1);
  }
  return stages;
};
```

This is the current App.tsx logic unchanged (answerableAfter precedence, cumulative `slice(0, idx+1)` for both fields, all-stages fallback).

## Step 2 — Update `src/App.tsx`

1. Add the import near the other `./` imports:
   ```ts
   import { getVisibleCaseStages, STANDALONE_SPLIT_VISUAL_KINDS, usesStandaloneVisualSplit } from "./examLayout";
   ```
2. Delete the module-level `function getVisibleCaseStages(...)` definition.
3. Delete the module-level `const STANDALONE_SPLIT_VISUAL_KINDS = new Set([...])` definition.
4. In `QuestionCard`, the local boolean is currently named `usesStandaloneVisualSplit` — that now collides with the imported function. Rename the local boolean and call the imported predicate:
   ```ts
   // was: const usesStandaloneVisualSplit = question.itemType !== "case_study" && question.visual !== undefined && STANDALONE_SPLIT_VISUAL_KINDS.has(question.visual.kind);
   const showsStandaloneVisualSplit = usesStandaloneVisualSplit(question);
   ```
   Update its two references in `QuestionCard`:
   - the `<article>` className (`${showsStandaloneVisualSplit ? "standalone-visual-card" : ""}`)
   - the conditional render branch (`{showsStandaloneVisualSplit ? (...split...) : (...full-width...)}`)

`CaseStudyControl` keeps calling `getVisibleCaseStages(question, activeQuestion)` unchanged — it now resolves to the import.

## Step 3 — Add `scripts/tests/exam-layout.ts`

Match the existing test style (`node:assert/strict`, console.log on success, throws on failure). Minimal fixtures cast via `as unknown as` are fine — `getVisibleCaseStages` only reads `caseStudy.stages`, and `usesStandaloneVisualSplit` only reads `itemType`/`visual.kind`.

```ts
import assert from "node:assert/strict";
import {
  STANDALONE_SPLIT_VISUAL_KINDS,
  getVisibleCaseStages,
  usesStandaloneVisualSplit,
} from "../../src/examLayout";
import type { CaseStudyQuestion, CaseStudyStage, CaseSubQuestion, Question } from "../../src/types";

const stages = ["s1", "s2", "s3"].map(
  (id) => ({ id, title: { en: id, zh: id }, exhibits: [] }) as CaseStudyStage,
);
const caseOf = (stageList: CaseStudyStage[]): CaseStudyQuestion =>
  ({ caseStudy: { stages: stageList, questions: [] } }) as unknown as CaseStudyQuestion;
const part = (fields: Partial<CaseSubQuestion>): CaseSubQuestion => fields as unknown as CaseSubQuestion;

const ids = (result: CaseStudyStage[]) => result.map((s) => s.id);

// no stages, or no active question -> empty
assert.deepEqual(ids(getVisibleCaseStages(caseOf([]), part({ stageId: "s1" }))), [], "no stages -> []");
assert.deepEqual(ids(getVisibleCaseStages(caseOf(stages), undefined)), [], "no active part -> []");

// stageId cumulative (the safety-critical case: never hide earlier stages)
assert.deepEqual(ids(getVisibleCaseStages(caseOf(stages), part({ stageId: "s2" }))), ["s1", "s2"], "stageId cumulative");

// answerableAfterStageId cumulative
assert.deepEqual(
  ids(getVisibleCaseStages(caseOf(stages), part({ answerableAfterStageId: "s2" }))),
  ["s1", "s2"],
  "answerableAfterStageId cumulative",
);

// unresolved refs -> fail open to all stages
assert.deepEqual(ids(getVisibleCaseStages(caseOf(stages), part({ stageId: "nope" }))), ["s1", "s2", "s3"], "unresolved stageId -> all stages");
assert.deepEqual(
  ids(getVisibleCaseStages(caseOf(stages), part({ answerableAfterStageId: "nope" }))),
  ["s1", "s2", "s3"],
  "unresolved answerableAfterStageId -> all stages",
);

// answerableAfterStageId takes precedence over stageId when both resolve
assert.deepEqual(
  ids(getVisibleCaseStages(caseOf(stages), part({ answerableAfterStageId: "s1", stageId: "s3" }))),
  ["s1"],
  "answerableAfterStageId wins over stageId",
);

// standalone split allowlist
const mc = (kind?: string): Question =>
  ({ itemType: "multiple_choice", ...(kind ? { visual: { kind } } : {}) }) as unknown as Question;
assert.equal(usesStandaloneVisualSplit(mc("lab_trend")), true, "lab_trend splits");
assert.equal(usesStandaloneVisualSplit(mc("vitals_trend")), true, "vitals_trend splits");
assert.equal(usesStandaloneVisualSplit(mc("burn_map")), true, "burn_map splits");
assert.equal(usesStandaloneVisualSplit(mc("rhythm_strip")), false, "rhythm_strip excluded");
assert.equal(usesStandaloneVisualSplit(mc("capnography")), false, "capnography excluded");
assert.equal(usesStandaloneVisualSplit(mc("fetal_monitoring")), false, "fetal_monitoring excluded");
assert.equal(usesStandaloneVisualSplit(mc("mar")), false, "mar excluded (density)");
assert.equal(usesStandaloneVisualSplit(mc("io_record")), false, "io_record excluded (density)");
assert.equal(usesStandaloneVisualSplit(mc()), false, "no visual -> no split");
assert.equal(
  usesStandaloneVisualSplit({ itemType: "case_study", visual: { kind: "lab_trend" } } as unknown as Question),
  false,
  "case_study never standalone-splits",
);

assert.equal(STANDALONE_SPLIT_VISUAL_KINDS.size, 6, "exactly six standalone split kinds");

console.log("exam layout tests passed");
```

## Step 4 — Wire the script

In `package.json` scripts, add (alphabetical neighborhood near other `test:` entries):
```json
"test:exam-layout": "tsx scripts/tests/exam-layout.ts",
```

In `PROJECT-HISTORY.md`, add `npm run test:exam-layout` to the verification baseline list.

## Verification

```sh
npx tsc -b --pretty false
npm run test:exam-layout
npm run build
```

`npm run build` will still show the existing Vite chunk-size warning.

## Acceptance

- `src/examLayout.ts` exists; `App.tsx` imports the three symbols and no longer defines them locally.
- `npm run test:exam-layout` passes all assertions.
- `tsc -b` and `build` pass.
- No diff in rendered behavior: case-study split, stage visibility, and standalone-visual split are identical to pre-change (spot-check `opus25_case_tb_airborne_treatment_monitoring_01` and `vit_01`).
