# Targeted Review V1 — Codex Spec

## Goal

Replace the existing `SummaryView` "Practice related" behavior (currently powered by the naive
`buildRelatedPracticePool` in `App.tsx`) with a real, pure, tested targeted-review sampler that builds
a weakness-focused ~50-question follow-up session from the just-completed session's missed / flagged /
prior-incorrect signal, following the same architectural pattern as the existing `buildWeightedSession`
study-session sampler.

## Constraints

- Static/offline only. No AI/API/server call.
- No readiness/pass-fail claims.
- No new content generation, no schema change.
- One-click UX from the end-of-session Summary screen (button + count, same as today).
- Small, testable, well-scoped — reuse existing patterns rather than inventing new ones.

## What changes

### 1. New pure function: `buildTargetedReviewPool` in `src/sessionSampler.ts`

Sibling to `buildWeightedSession`, same architectural shape (injected `rng`, pure, testable in isolation).

```ts
// Narrow, local signal shape — deliberately NOT the full App.tsx-local `SessionState`, which has no
// `export` keyword. Importing it into sessionSampler.ts would either fail to compile or force a
// circular import (App.tsx already imports from sessionSampler.ts). Only `questions` and `results`
// are needed for scoring, so that's all this type carries.
export type CompletedSessionSignal = {
  questions: Question[];
  results: Record<string, boolean>;
};

export const buildTargetedReviewPool = (
  records: QuestionRecord[],
  session: CompletedSessionSignal, // the just-completed session, narrowed
  progress: Record<string, QuestionProgress>,
  flags: Record<string, QuestionFlag>,
  count: number,
  rng: () => number,
): QuestionRecord[]
```

**Candidate pool:** `records.filter(r => r.question.itemType !== "case_study")`. Case studies are excluded
from the pool — same reasoning `buildWeightedSession` already uses (a fixed allotment counted
independently, not a weighted-draw citizen). This applies to both directions: a missed case study does
not get served back as a candidate, and case studies never fill remaining slots.

**Signal extraction (from `session`):** Walk `session.questions` (top-level only — no case-study
embedded-part re-grading in V1; that is a V2 cut, see Out of scope) where
`session.results[q.id] === false`. A missed case study still contributes its own top-level
`topic`/`category`/`ngnSkill` to the signal sets (same as today's `buildRelatedPracticePool`) — that's a
free read of `CommonQuestion` fields, not new plumbing. Build:
- `missedTopics: Set<string>`
- `missedCategories: Set<Category>`
- `missedItemTypes: Set<ItemType>`
- `missedNgnSkills: Set<NgnSkill>`

A session with only case-study misses still populates `missedTopics`/`missedCategories`/
`missedNgnSkills` purely from the case's own top-level fields (per the free-signal read above) — this is
the intended behavior, not an edge case to special-case away. A case-study-only bad session should still
produce a standalone remediation pool from the same topic/category; disabling the button there would be
strictly worse than what today's naive `buildRelatedPracticePool` already does.

`missedTopics` is empty only when the session had **zero misses of any kind** — a perfect score. Only in
that case return `[]`, matching today's fallback behavior; the button stays disabled (`relatedCount === 0`).

**Do NOT exclude `session`'s served questions from the candidate pool.** This is a deliberate change
from the current `buildRelatedPracticePool`, which wrongly excludes everything served in the
just-completed session (missed and correct alike). Dropping that exclusion is what makes "direct retry"
work as a scoring bonus rather than a hard bucket or a hard exclusion: a question just missed in this
session naturally scores `+6` (same topic as itself) `+4` (now has `progress.incorrect > 0`) without any
special-cased constant, and can resurface or not depending on how it stacks against everything else —
never guaranteed a slot, never forced out.

**This is about eligibility, not duplication.** A question from the just-completed session is eligible to
be *a* candidate in the new pool — it is never eligible to be *two* candidates. Selection throughout is
without replacement: every stage of the fallback chain below draws only from records not already selected
in this pool build, so no `question.id` can appear twice in the final `questions` array. This matters
architecturally, not just semantically — `SessionState.answers`/`results`/`scores` are all
`Record<string, ...>` keyed by `question.id` (`App.tsx` `submitCurrent`), so a duplicate id inside one
session's `questions` array would make answering one instance silently resolve the other as already
submitted. Never let this happen.

**Scoring, per candidate** (boring, auditable, no over-calibration — matches house style):

```
+6  same topic as a missed question
+4  same category as a missed question
+3  same item type as a missed question
+3  same ngnSkill as a missed question (only when both question.ngnSkill values are defined)
+5  flags[id]?.flagged
+4  progress[id]?.incorrect > 0
+2  (progress[id]?.seen ?? 0) === 0
-3  (progress[id]?.correctStreak ?? 0) >= 2   // the existing "mastered" definition (PROJECT-HISTORY.md
                                                // product decisions: two consecutive correct clears missed)
```

Score = sum of applicable terms. No direct-retry term — see above.

**Diversity:** reuse `buildWeightedSession`'s exact dampening mechanism, don't invent a second one.
Within any weighted draw below, weight candidates by `score / (1 + α·topicCountSoFar + β·kindCountSoFar)`
with `α = β = 1` (the already-calibrated constants from the Jun 26 Sampler Calibration Closeout),
incrementing `topicCountSoFar`/`kindCountSoFar` as each candidate is selected — same running-tally pattern
already implemented in `buildWeightedSession`'s `topicCounts`/`kindCounts` maps. Note `kindCountSoFar`
tracks `question.visual?.kind` (visual kind — rhythm_strip, lab_trend, etc.), same as
`buildWeightedSession`. This is intentionally a different axis from the `+3 same item type` scoring term
above (multiple_choice/select_all/etc.) — both apply; they dampen/reward different things.

**Selection / fallback chain, all stages drawing only from records not yet selected in this pool build
(no `question.id` ever appears twice in the output — see the eligibility note above):**

1. **Strong signal.** Candidates with `score > 0`. Since this is gated on `score > 0`, the diversity
   weight `score / (1 + α·topic + β·kind)` is always strictly positive here — no `chooseWeighted` edge
   case. If ≥ `count` candidates qualify, weighted-sample `count` without replacement (seeded `rng`) and
   skip to the return. Otherwise take all of them and continue with `count - selected.length` slots
   remaining.
2. **General fill.** From non-case-study candidates not yet selected, reuse `progressTier` (already
   exported from this module) rather than re-deriving `unseen`/`mastered` from raw scoring math — raw
   `+2`/`-3` terms can be zero or negative and `chooseWeighted` assumes positive weights (flagged in
   Codex's pre-implementation review — this is why Stage 2 does not just reuse the Stage 1 score). Drain
   tier 0 (unseen) first, then tier 1 (seen + missed-or-due), then tier 2 (settled) — same
   best-available-tier-first pattern as `buildWeightedSession`'s floor-kind selection. Within a tier, use
   the same positive diversity weight `1 / (1 + α·topic + β·kind)` (uniform base weight of `1`, always
   positive) via `chooseWeighted`; drain a tier fully (or until `count` is reached) before moving to the
   next.
3. **Bank exhausted.** If Stage 1 + Stage 2 together still can't reach `count` — every non-case-study
   candidate has been selected — stop and return the shorter list. Do not duplicate any `question.id` to
   pad to `count`; a truly tiny bank returns fewer than `count` items rather than repeating a question
   within the same session.

Return the final list, seeded-shuffled for presentation order (same `rng`).

### 2. `buildSessionState` extraction in `App.tsx`

`startSession` and `startAdaptiveSession` currently duplicate the `SessionState` object-literal
construction inline (`id`, `mode`, `questions`, `poolIds`, `index`, `answers: {}`, `results: {}`,
`scores: {}`, `skippedQuestionIds: []`, `phase: "questions"`, `languageMode`, `title`, `startedAt`, plus
optional `adaptive`). Targeted Review's kickoff becomes a third call site through the same shape. Pull
this into a small pure `buildSessionState(...)` helper (same extraction pattern as the Jun 30
`examLayout.ts` pull — mechanical, behavior-preserving, directly testable) rather than adding a fourth
ad-hoc construction site later. Keep it in `App.tsx` or a new small module — Codex's call on placement,
but it must be pure and covered by a regression test asserting shape parity with the current inline
construction for both the plain and adaptive branches.

### 3. Wire `App.tsx`

`sessionSampler.ts` currently imports only `Category, QuestionProgress, QuestionRecord` from `./types`.
Add `Question, QuestionFlag, ItemType, NgnSkill` to that import (needed for the new function's signature
and scoring). Do **not** import `SessionState` — it's declared locally in `App.tsx` with no `export`
keyword, and pulling it into `sessionSampler.ts` would either fail to compile or force a circular import.
Use the narrow `CompletedSessionSignal` type defined alongside `buildTargetedReviewPool` instead.

Replace `relatedPracticePool = useMemo(() => buildRelatedPracticePool(session, allRecords, progress),
[session, allRecords, progress])` with:

```ts
const relatedPracticePool = useMemo(
  () =>
    session
      ? buildTargetedReviewPool(
          allRecords,
          { questions: session.questions, results: session.results },
          progress,
          flags,
          DEFAULT_SESSION_COUNT,
          rng,
        )
      : [],
  [session, allRecords, progress, flags],
);
```

Note the explicit `flags` in the dependency array — the current `buildRelatedPracticePool` memo only
depends on `[session, allRecords, progress]` and would go stale on a flag toggle if copied verbatim.

Seed the `rng` deterministically from `session.id` (a stable string that doesn't change across re-renders)
rather than `Date.now() ^ Math.random()` — reuse the existing ID-seeded pattern already established for
option shuffling (`lib/shuffle.ts` FNV-1a → seed) if it's safely importable client-side; otherwise a small
inline string hash in `sessionSampler.ts` feeding `mulberry32` is fine. Either way: same seed in, same
pool out, so the memoized value doesn't churn on every render and is debuggable.

Delete the old `buildRelatedPracticePool` function once the new wiring is confirmed working.

`SummaryView`'s existing props (`relatedCount`, `onPracticeRelated`) and the `startSession(pool, "study",
"Practice related", { count: DEFAULT_SESSION_COUNT, order: "sequential" })` call stay unchanged — the new
pool arrives pre-ordered by the sampler, `order: "sequential"` is still correct so `startSession` doesn't
reshuffle on top of it. Button copy stays "Practice related" — a copy change is Luke's call, non-blocking.

## Out of scope (V1)

- Case-study embedded-part signal extraction (re-grading `session.answers[caseId].caseStudy[partId]` to
  pull per-part topic/category/NGN into the weighting). Cut for scope; case-study fidelity work is already
  deferred pending real-session observation per DECISIONS.md principle 23.
- New question generation, schema changes, dashboard redesign, pass/fail prediction, AI-generated
  recommendations.
- Translation reveal telemetry (separate lane), rhythm visual backfill (Spec E), content remediation
  report export.
- Slider/filter/confidence-score UI. Button stays one-click. At most a small subtitle like "Builds a
  focused set from missed, flagged, and related topics."

## Tests required

- Weighting: each signal term fires independently and additively; verify via fixture questions with
  controlled topic/category/itemType/ngnSkill/flag/progress combinations.
- Case-study exclusion: a case study with a matching missed topic never appears in the output pool.
- No hard exclusion / no hard bucket: a question missed in the just-completed session can reappear in the
  output (not guaranteed, not forbidden) — assert it's a valid candidate and gets scored, not filtered.
- Diversity dampening: repeated topic/kind candidates get progressively down-weighted during selection
  (mirror the existing `buildWeightedSession` diversity test shape).
- No within-pool duplicates: fixture with a tiny candidate universe (fewer than `count` distinct
  non-case-study records) never produces a `question.id` twice in the output, and the returned list is
  shorter than `count` rather than padded with repeats.
- Fallback chain: fewer than `count` strong (`score > 0`) candidates → Stage 2 tier draining (unseen →
  seen/due → settled) engages in order and respects the no-duplicate constraint; a genuinely exhausted
  bank returns fewer than `count` items rather than looping back to Stage 1's candidates.
- Determinism: same `session`/`progress`/`flags`/seed in → identical output pool, order included.
- `buildSessionState`: shape-parity regression against the current inline `startSession` and
  `startAdaptiveSession` construction.

## Verification

```
npx tsc -b --pretty false
npx tsx scripts/tests/session-sampler.ts   # extend with targeted-review-pool cases
npm run validate-bank -- banks/*.json
npm run build
```
