# PARTIAL-CREDIT-SCORING-SPEC

**Status:** ready for implementation. **Owner of this change:** implementation agent (Codex/Claude Code).
**Schema impact:** none — this is a runtime grading + display change, release-versioned, **not** a `meta.schemaVersion` bump. Bank JSON shapes are unchanged; existing banks re-grade under the new rules with no migration; an older runtime reads new banks fine (it just grades harsher).
**Prerequisite for:** `HIGHLIGHT-ITEM-TYPE-SPEC` (highlight reuses the `+/-` path defined here).

---

## 1. Motivation

The app currently grades every item dichotomously (`gradeQuestion → boolean`, exact match; `select_all` and `matrix` are all-or-nothing). The real NGN exam uses **polytomous (partial-credit) scoring** — our grading is therefore harsher than the exam it prepares for. NCSBN assigns partial credit in three families: `0/1`, `+/-`, and rationale/dyad. This refactor brings every current item type onto the correct family for its **displayed score**, while deliberately keeping **retention** (spaced repetition) gated on full correctness.

### Locked design decisions

- **Score vs. retention are decoupled.** Partial credit improves the **session score** only. An item returns to review unless the learner earns **full marks** (`earned === possible`). No threshold. The concept is not "learned" until every part is nailed.
- Because retention stays full-marks, **`storage.ts` and the SRS scheduler (`reviewSchedule.ts` / `scheduleReview`) need zero changes.** They keep consuming a single boolean.
- **The boolean `gradeQuestion` is behavior-preserving** (proof in §7). Only the new `scoreQuestion` surfaces partial credit. This contains the blast radius to `grading.ts` + display + session aggregation.

### Out of scope (deliberate, note in DECISIONS)

- Threshold-based retention ("≥50% counts as mastered").
- Graded SRS — feeding a continuous quality signal into `scheduleReview` ease/interval.
- Rationale/dyad scoring — only needed for explicit linked "X as evidenced by Y" item types, which we do not have and are not planning.
- `ordered_response` partial credit — stays 0/1 until/unless redesigned into an extended drag-and-drop with explicit targets.

---

## 2. Core type

Home in **`src/types.ts`** (the schema/storage source-of-truth layer). `grading.ts` already imports question types from `types.ts`, so defining `ItemScore` there and referencing it from `StoredSessionSnapshot` keeps the dependency one-directional (`grading.ts → types.ts`); homing it in `grading.ts` would invert that and create a `types.ts → grading.ts` cycle.

```ts
// src/types.ts
export type ItemScore = { earned: number; possible: number };
```

`grading.ts` imports it: `import type { ItemScore } from "./types";`.

`possible` is the maximum earnable points for the item; `earned` is what the response earned, never negative, never exceeding `possible`.

Shared helper for the `+/-` family:

```ts
// +1 per correct selection, -1 per incorrect, floored at 0.
const plusMinus = (selected: string[], correct: string[]): number => {
  const correctSet = new Set(correct);
  const picked = new Set(selected);
  let earned = 0;
  for (const id of picked) earned += correctSet.has(id) ? 1 : -1;
  return Math.max(0, earned);
};
```

NCSBN `+/-`: max earnable equals the number of correct options; not-selecting a distractor does not earn a point, it only avoids the penalty; a negative sum truncates to 0.

---

## 3. Per-type scoring

| Type | NGN family | `earned` | `possible` |
|---|---|---|---|
| `multiple_choice` | 0/1 | `1` if the single selection equals the key, else `0` | `1` |
| `select_all` | +/- | `plusMinus(selected, correct)` | `correct.length` |
| `ordered_response` | 0/1 (all-or-nothing) | `1` if submitted order equals key order, else `0` | `1` |
| `fill_in_blank` | 0/1 per blank | count of blanks that pass (text or numeric) | `blanks.length` |
| `matrix` `single_per_row` | 0/1 per row | count of rows whose selected set equals the row key | `matrix.rows.length` |
| `matrix` `multiple_per_row` | +/- per row, floor each row at 0 | `Σ_row plusMinus(selectedRow, keyRow)` | `Σ_row keyRow.length` (total correct cells) |
| `dropdown_cloze` | 0/1 per dropdown | count of dropdowns whose selection equals key | `dropdowns.length` |
| `case_study` | sum of embedded | `Σ embedded.earned` | `Σ embedded.possible` |

Note the matrix denominator differs by mode by design: single-per-row scores **per row** (1 pt/row), multiple-per-row scores **per cell** with a per-row floor. This matches NCSBN Matrix Multiple-Choice (0/1) vs Matrix Multiple-Response (+/-).

`highlight` (added in the highlight spec) uses the **same `+/-` path as `select_all`**: `earned = plusMinus(selectedSegmentIds, correct)`, `possible = correct.length`.

---

## 4. Grading API changes (`src/grading.ts`)

`AnswerState` is unchanged. Refactor the graders to produce `ItemScore`, and keep a behavior-preserving boolean:

```ts
export const scoreStandaloneQuestion = (q: StandaloneQuestion, a: AnswerState): ItemScore => { /* per §3 */ };

const scoreCaseStudy = (q: CaseStudyQuestion, a: AnswerState): ItemScore =>
  q.caseStudy.questions.reduce<ItemScore>((acc, cq) => {
    const s = scoreStandaloneQuestion(cq, a.caseStudy?.[cq.id] ?? getInitialAnswer(cq));
    return { earned: acc.earned + s.earned, possible: acc.possible + s.possible };
  }, { earned: 0, possible: 0 });

export const scoreQuestion = (q: Question, a: AnswerState): ItemScore =>
  q.itemType === "case_study" ? scoreCaseStudy(q, a) : scoreStandaloneQuestion(q, a as AnswerState);

export const isFullyCorrect = (s: ItemScore): boolean => s.possible > 0 && s.earned === s.possible;

// Behavior-preserving boolean — keeps every existing call site (App feedback, recordAnswer) working.
export const gradeQuestion = (q: Question, a: AnswerState): boolean => isFullyCorrect(scoreQuestion(q, a));
```

- Existing helpers (`sameOrdered`, `sameSet`, `normalizedText`, the per-blank text/numeric check) are reused inside the `score*` functions — extract the per-unit predicates so both the count (earned) and the boolean fall out of the same logic.
- `getInitialAnswer`, `getCorrectAnswer`, `getAnswerCompleteness` are unchanged.

---

## 5. Retention path — no change required

`storage.ts::recordAnswer(questionId, wasCorrect)` continues to receive a boolean. Callers pass `gradeQuestion(...)` (i.e. `isFullyCorrect(scoreQuestion(...))`). `scheduleReview`, streak/`missed`, ease, interval ladder, lapses, `AnswerEvent.wasCorrect` are all untouched. An item with partial credit yields `false` here and is correctly resurfaced.

---

## 6. Session aggregation & display (`src/App.tsx`, session snapshot)

- `StoredSessionSnapshot.results: Record<string, boolean>` stays (drives the `incorrect` status filter and mastery count). Populate it from `gradeQuestion`.
- **Add** `scores?: Record<string, ItemScore>` to `StoredSessionSnapshot` (additive, optional → old persisted sessions remain valid; absence falls back to a booleans-only summary). Populate from `scoreQuestion`, **keyed by top-level `question.id`** — same keying as `results`. For a `case_study`, `scores[caseId]` is the single summed case score (`scoreQuestion` already sums the embedded items); per-embedded breakdowns, if shown, are computed by the UI and not stored separately.
- **Session summary** shows two numbers: exam-style score `Σ earned / Σ possible` (e.g. "Score 82%") and mastery `count(results == true) / answered` (e.g. "Mastered 7/10"). The exam-style number is the headline; mastery explains why items remain in review.
- **Per-item feedback** after submit: for partial-credit types show `earned / possible` ("3 of 4 points"), and make explicit in copy that the item is still scheduled for review because it was not fully correct. (UX wording is the implementer's; the contract is: partial credit shown, retention boolean is full-marks.)
- Alternative to storing `scores`: recompute from `answers` (the stored `AnswerState`) + the in-scope questions at summary render. Storing is preferred for robustness; either is acceptable.

---

## 7. Behavior-preservation proof (regression anchor)

For every existing type, `isFullyCorrect(scoreQuestion) === oldGradeQuestion`:

- `multiple_choice` / `ordered_response`: 0/1 unchanged.
- `select_all`: `plusMinus === correct.length` ⇔ all correct selected and no incorrect ⇔ `sameSet` (old).
- `matrix single`: `#correctRows === rows.length` ⇔ every row correct (old).
- `matrix multiple`: `Σ plusMinus === Σ keyRow.length` ⇔ each row earns its full cell count ⇔ each row exactly correct (old).
- `fill_in_blank`: `#correctBlanks === blanks.length` ⇔ every blank passes (old).
- `dropdown_cloze`: `#correct === dropdowns.length` ⇔ every dropdown correct (old).
- `case_study`: `Σearned === Σpossible` ⇔ every embedded fully correct (old).

**Regression test:** every currently-passing grading fixture must keep its boolean verdict under `gradeQuestion`. New tests assert the partial `earned` values.

---

## 8. Touch-point checklist

1. `src/types.ts` — add `ItemScore`; add `scores?: Record<string, ItemScore>` to `StoredSessionSnapshot`.
2. `src/grading.ts` — `import type { ItemScore } from "./types"`; `plusMinus`, `score*` per §3, `scoreQuestion`, `isFullyCorrect`; redefine `gradeQuestion` as the boolean adapter.
3. `src/App.tsx` — call `scoreQuestion` for feedback + session summary; keep `recordAnswer(gradeQuestion(...))`; populate `snapshot.scores`.
4. `NCLEX-Question-Schema.md` — rewrite the **Grading** section (§9 below).
5. `DECISIONS.md` — add the new principle (§10 below).
6. Tests — per-type `scoreQuestion` (full → `{n,n}`; partial values; `+/-` over-selection floored to 0); `isFullyCorrect`; the §7 regression.
7. `PROJECT-HISTORY.md` — after landing, record that grading is now polytomous (`ItemScore`, partial credit on display/session, full-marks retention). Read the live file first; it is the status map and may have drifted.

---

## 9. `NCLEX-Question-Schema.md` — Grading section replacement

Replace the current Grading list with:

> Scoring is polytomous (partial credit), matching the NGN. Each item yields `{ earned, possible }`. Partial credit contributes to the session score; an item is counted as **mastered** (and removed from spaced-repetition review) only at full marks (`earned === possible`).
> - `multiple_choice`: `0/1`. 1 point iff the selection equals the single key.
> - `select_all`: `+/-`. +1 per correct selection, −1 per incorrect, floored at 0; `possible` = number of correct options.
> - `ordered_response`: `0/1` all-or-nothing on the full permutation.
> - `fill_in_blank`: `0/1` per blank; `possible` = number of blanks.
> - `matrix` single_per_row: `0/1` per row; `possible` = number of rows.
> - `matrix` multiple_per_row: `+/-` per row, each row floored at 0; `possible` = total correct cells.
> - `dropdown_cloze`: `0/1` per dropdown; `possible` = number of dropdowns.
> - `case_study`: sum of embedded item points.

Remove the stale "NCLEX gives no partial credit on SATA … all-or-nothing" wording (that is the pre-2023 rule).

---

## 10. `DECISIONS.md` — new principle

> **17. Scoring is exam-style polytomous; retention is full-marks.** Grading returns `ItemScore { earned, possible }` per the NGN families (`0/1`, `+/-` floored at 0; `case_study` sums embedded). Partial credit feeds the **session score and per-item feedback only**. Spaced repetition resurfaces any item below full marks: an item is "mastered" iff `earned === possible`. This keeps the study app honest about exam scoring while still re-teaching anything not fully correct. The boolean `gradeQuestion` is defined as `isFullyCorrect(scoreQuestion(...))` and is **behavior-preserving** for every existing type, so `storage.ts` and the SRS scheduler are untouched — the change is contained to `grading.ts`, display, and session aggregation. Explicitly out of scope: threshold-based retention, graded-SRS ease from partial scores, rationale/dyad scoring, and `ordered_response` partial credit.
