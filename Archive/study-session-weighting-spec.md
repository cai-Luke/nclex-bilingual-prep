# Study-Session Distribution Weighting — Implementation Spec

**Implementer:** Codex
**Author:** Claude (planning)
**Status:** implemented and archived
**Depends on:** none (no schema change; `question.category` already exists and is typed to the eight Client Needs categories)
**Concurrent-safe with:** U5 io_record spec (no shared surface)

---

## 1. Goal

Make the default test session a representative slice of the NCLEX-RN exam rather than a flat random draw. Today's test launcher samples uniformly over the whole bank, so a session's content mix reflects *what we happened to generate* (e.g. 44 rhythm strips) instead of *what the exam tests*. Two changes fix that:

1. **Category weighting** — draw questions in proportion to the 2026 NCLEX-RN test-plan Client Needs distribution.
2. **Within-category diversity** — stop any one narrow topic or visual kind from filling its category's slots (the EKG-glut complaint), with a **floor** guaranteeing at least one of the well-stocked visual kinds per session.

Default session size moves from 25 to **50** (≈ the 52 scored content items of a minimum-length real exam, where the distribution actually resolves).

**Out of scope (explicitly):** difficulty adaptivity. The real exam is adaptive on difficulty; that is a *separate axis* and belongs to a future exam-simulation mode, not study mode. Do **not** touch difficulty selection, the `adaptive` `SessionMode`, or any `AdaptiveSessionSnapshot` logic. Case studies are also out of scope for this draw (see §4).

---

## 2. Category weights (2026 NCLEX-RN Test Plan, effective April 2026)

Keyed by the exact `Category` string literals in `src/types.ts`. Midpoint targets from the published test plan; they sum to 1.00. (NCSBN's schema label "Safety and Infection Control" corresponds to the 2026 plan's "Safety and Infection Prevention and Control" at 13%.)

| Category (schema label)                      | Weight |
|----------------------------------------------|:------:|
| Management of Care                           | 0.18   |
| Pharmacological and Parenteral Therapies     | 0.16   |
| Physiological Adaptation                     | 0.14   |
| Safety and Infection Control                 | 0.13   |
| Reduction of Risk Potential                  | 0.12   |
| Health Promotion and Maintenance             | 0.09   |
| Psychosocial Integrity                       | 0.09   |
| Basic Care and Comfort                       | 0.09   |

Define as a `Record<Category, number>` constant (e.g. `NCLEX_CATEGORY_WEIGHTS`) in the sampler module. The canonical copy and its provenance live in `DECISIONS.md` ("Study-session distribution"); keep the two in sync. NCSBN itself permits ±3% per category, so exact per-session counts do not matter — the distribution is a target, not a constraint.

---

## 3. Where this lives

New module, e.g. `src/sessionSampler.ts` (Codex's call on path/name), exporting a pure function:

```
buildWeightedSession(
  pool: QuestionRecord[],
  count: number,
  progress: Record<string, QuestionProgress>,
  rng: () => number,            // [0,1); injected for determinism in tests
  params?: SamplerParams,
): QuestionRecord[]             // ordered, length <= count
```

- **PRNG:** reuse `mulberry32` from `src/visuals/primitives/prng.ts` (already the project's shared deterministic [0,1) PRNG). If a non-visuals home reads cleaner, lift it to `lib/`. Production seeds it freshly per session, with **all `Date`/`Math.random` kept outside `buildWeightedSession`**:
  ```ts
  const seed = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
  const rng = mulberry32(seed);
  ```
  Tests pass a fixed seed and assert behavior. Do **not** reuse `lib/shuffle.ts` (that is the content-shuffle, FNV-seeded by item id, uint32 output — wrong tool).
- **Purity:** no `Date`, no `Math.random` inside the function; all randomness via `rng`. This is what makes the unit tests deterministic.

### Integration in `src/App.tsx`

1. **Bump the default.** `DEFAULT_SESSION_COUNT = 25` → `50`. The Home test launcher toggle (`testCounts = [10, 25, 50]`, `useState(DEFAULT_SESSION_COUNT)`) then defaults to 50 automatically; the toggle keeps offering 10/25/50. Verify the other two consumers of the constant (`buildRelatedPracticePool` slice, `SummaryView` "Practice related") remain acceptable at 50 — they slice and are capped by availability, so they are.

2. **Gate the weighted draw to the whole-bank test path only.** Add an option to `startSession`'s `options` bag, e.g. `weighting?: "nclex"`. Only the **Home test launcher** call site passes it:
   ```
   onTest={(count) => startSession(allRecords, "test", `Test · ${count} questions`, { count, weighting: "nclex" })}
   ```
   In `startSession`, for the non-`sequential`, non-`adaptive` branch: **if `options.weighting === "nclex"`**, replace the current
   ```
   const unseen = shuffle(records.filter(seen===0));
   const seen   = shuffle(records.filter(seen>0));
   orderedRecords = [...unseen, ...seen];
   // ...slice(0, count)
   ```
   block with `orderedRecords = buildWeightedSession(records, count, progress, rng)`. Otherwise keep the existing behavior verbatim.

   **Do not** weight: "Study all", "Review mistakes/answered/due", filtered Library study/test sets, single-question practice, related practice, or the Builder. Those are intentionally narrow or user-curated pools where category weighting is meaningless or unwanted. (Builder-with-no-filters is a possible phase-2 extension; not now.)

3. **Resume is unaffected.** `StoredSessionSnapshot` already persists the realized `questionIds`/`poolIds`, so a resumed session replays the exact drawn list. The sampler only runs at fresh-draw time.

---

## 4. Sampler algorithm

Inputs: `pool`, `count` (N), `progress`, `rng`, `params`.

### 4.0 Pool filter
Exclude `itemType === "case_study"` from the draw. (On the real exam, case studies are a fixed independent allotment counted separately from the content-area percentages; folding them into a category-weighted draw double-counts. They keep their own entrypoints.) The category weight of a case study is irrelevant here because it never enters this pool.

### 4.1 Category targets (largest-remainder rounding)
Compute integer per-category targets `t_c` by largest-remainder (Hamilton) apportionment of `N` across the eight categories by their weights, so `Σ t_c = N` exactly. Categories absent from `pool` get their seats redistributed by the same remainder rule (don't strand seats on an empty category).

### 4.2 Floor reservation (the "≥1, never 0" rule)
- **Floor set = visual kinds whose total count in `pool` ≥ `floorThreshold`** (default **10**), computed at runtime from the loaded bank — *not* read from a config or the census, so it self-corrects as content grows. With the current bank this yields `{ rhythm_strip (44), lab_trend (20), vitals_trend (11) }`; `capnography (7)` and `mar (5)` fall below and are not floored (correct: a dedicated capnography or MAR read is rare on a real exam).
- **Floors apply only when `N >= floorMinCount`** (default **40**). Below that, skip floors entirely — at small N the reserved visual seats would over-represent. (At the 50 default, floors are active.)
- For each floored kind, reserve **one** record: prefer unseen → due/`missed` → seen; among ties pick via `rng`. Charge the reservation to its **own category** (decrement that category's remaining capacity from §4.1). The reserved item counts *within* the distribution, not on top of it.
- **Silent drop:** if a floored kind has no unseen item left, relax to a seen one; if it has no available item at all, drop the floor for that session with no error. (This is the "ran through the bank" behavior — acceptable; the target user passes the exam before exhausting the bank.)
- **Edge (rare at N=50):** if reserving a floor would require a category already at 0 remaining capacity, the floor wins — steal one seat from the category with the largest current remaining capacity so `Σ` stays = N. With these weights every category target is ≥ ~4 at N=50, so this effectively never triggers; specify it only so the implementation is total.

### 4.3 Fill with diversity penalty
For each category, fill its remaining capacity by sampling **without replacement** from that category's records (excluding already-reserved), preferring unseen → due/`missed` → seen. Within a preference tier, sample by `rng` weighted by a **diversity penalty** computed against the running selection (across the whole session, not just the category):

```
weight(candidate) = 1 / (1 + alpha * sameTopicCount + beta * sameKindCount)
```

where `sameTopicCount` = items already selected this session with the same `question.topic`, `sameKindCount` = items already selected with the same `question.visual?.kind` (kind only counts when the candidate has a visual). Defaults `alpha = beta = 1` (`params`-overridable). This is the soft penalty chosen over a hard cap: it spreads across distinct topics/kinds and generalizes to any future bulk-generated cluster.

**On variance (corrected).** Category counts are *fixed per session* by largest-remainder (§4.1) — this is not a free multinomial draw, so a 9% category does not swing between 0 and 9 across sessions. The session-to-session variance the student actually experiences comes from (a) the RNG remainder tie-break in §4.1 (bounded ±1 per category, ≈ the exam's own ±3% tolerance) and (b) which items are drawn here, over a large pool under the diversity weighting. That is the right variance for this tool: unlike the differential trainer — where the *count* of each cell type is the learning object — here the student practices items, not category tallies, so realistic-but-stable counts plus varied item selection beats free category swings. (If you do want true per-session count variance, §9 notes the one-line swap to a multinomial category apportionment; default is largest-remainder.)

### 4.4 Output
Concatenate reserved + filled records. Final ordering for presentation: shuffle the combined set with `rng` (so floored visual items aren't clustered at the front). Return; length is `min(N, available)`.

---

## 5. Census extension (visibility / tuning — separate, non-runtime)

The sampler derives its floor set at runtime and needs nothing from the census. This extension is purely so Luke can *see* concentration and tune `floorThreshold` / `alpha` / `beta`. Per the deterministic-core principle this is script work, not a model task.

Extend `scripts/census.ts` to emit a **within-category breakdown**:
- For each of the eight categories: top topics by count, and visual-kind counts within that category.
- Surfaces exactly how concentrated rhythm strips (and lab_trend, etc.) are inside their home category — the number that justifies the floor threshold and penalty constants.

Add to both `census.json` (source of truth) and the generated `BANK-CENSUS.md`. Reuses the existing `coverage-report.ts` counters and traversal already imported by `census.ts`. The `--check` drift gate covers the new fields automatically (it diffs the whole stripped object). Advisory only — not consumed by app runtime.

---

## 6. Tests

Add a sampler test (alongside `scripts/tests/`), all with a **fixed seed** so they're deterministic:

1. **Distribution** — over a large synthetic pool, a draw of 50 lands each category within ±1 of its largest-remainder target; over many seeds the mean tracks the weights.
2. **Sums to N** — realized length is exactly `min(N, availableNonCaseStudy)` across seeds, including when floor reservations occur.
3. **Floor** — when `rhythm_strip`/`lab_trend`/`vitals_trend` are present and `N >= 40`, each appears ≥ 1; when a floored kind's pool is empty, the draw still succeeds (silent drop) and sums correctly.
4. **Floor disabled at small N** — at `N = 10`, no floor reservation occurs.
5. **Case-study exclusion** — no `case_study` item ever appears in the output.
6. **Diversity** — given a category whose pool is dominated by one topic/kind, the selected set is more topic-diverse than a flat draw (e.g. a glut kind appears fewer times than its raw share would predict).
7. **Determinism** — same seed + same pool ⇒ identical output.

No new `npm` script needed; fold into the existing test runner. The runtime change is offline/`file://`-safe (pure function, injected RNG) — preserves the static-runtime invariant.

---

## 7. DECISIONS.md

Policy additions are being applied to `DECISIONS.md` this session (new standing principle on distribution-weighted study sessions + difficulty-is-exam-sim-only; the category weight table with provenance; the floor/diversity/case-study-excluded rules; the 50 default). Treat that section as the authoritative source for the weights and policy; this spec is the operational detail.

---

## 8. Acceptance checklist

- [ ] `DEFAULT_SESSION_COUNT` = 50; Home test toggle defaults to 50, still offers 10/25/50.
- [ ] Home test launcher passes `weighting: "nclex"`; no other entrypoint does.
- [ ] `buildWeightedSession` pure, RNG-injected, `mulberry32`-based; case studies excluded.
- [ ] Category targets by largest-remainder, sum to N.
- [ ] Runtime-derived floor set (pool count ≥ 10), active only at N ≥ 40, within-distribution, silent-drop on depletion.
- [ ] Soft topic/visual-kind diversity penalty (α = β = 1 default).
- [ ] Difficulty / adaptive logic untouched.
- [ ] `census.ts` emits within-category topic + visual-kind breakdown to `census.json` + `BANK-CENSUS.md`; `--check` still passes after regen.
- [ ] Sampler tests pass; static/offline runtime invariant preserved.
- [ ] Equal-remainder ties broken by RNG (no permanent category bias at N=50).
- [ ] Shortage redistributed when a category is present but under-stocked, not only when absent.
- [ ] Floor counts computed over the case-study-excluded pool (standalone visuals only).
- [ ] A single `progressTier` helper drives both floor reservation and fill.
- [ ] Integration guard: only the Home launcher passes `weighting: "nclex"`.

---

## 9. Cross-model review addendum (v1.1)

Folds in a GPT pre-implementation review. These amend the sections noted; where they extend earlier prose, the addendum wins.

**9.1 Largest-remainder tie-break (amends §4.1) — material at N=50.** Floor each `weightₖ · N`, then award leftover seats by largest fractional remainder. At N=50 the floors sum to 48 and four categories tie at exactly `.5` remainders — Safety, Health Promotion, Psychosocial, Basic Care — competing for the last 2 seats. Object-iteration order must **not** decide this; it would bias the same two categories up every session permanently. Break equal-remainder ties with `rng` (shuffle the tied set, take the needed count). This RNG tie-break is also the intended, *bounded* (±1 per category) source of session-to-session category variance — close to the exam's own ±3% tolerance — replacing the inaccurate "multinomial" framing.

**9.2 Shortage redistribution (amends §4.1).** Handle not just categories *absent* from the pool but categories *present with fewer eligible records than their target*. After the fill pass, if `selection.length < min(N, availableNonCaseStudy)`, redistribute the unmet seats to categories that still have eligible candidates (by weight, repeating until full or exhausted). Don't strand seats on a thin category.

**9.3 Floor pool excludes case studies (amends §4.2).** Compute floor visual-kind counts over the **case-study-excluded** pool, counting `question.visual?.kind` on standalone items only. Case-study exhibit visuals must never trigger or satisfy a floor — the draw can't surface them anyway.

**9.4 Explicit progress tiers (amends §4.2/§4.3).** Define one helper, e.g. `progressTier(progress): 0 | 1 | 2`, used by both floor reservation and fill so the ordering is single-sourced:
- `0 unseen`: `(progress?.seen ?? 0) === 0`
- `1 reviewable`: seen AND (`progress.missed === true` OR `isDueForReview(progress)`) — reuse the `isDueForReview` helper App.tsx already imports from `storage.ts`
- `2 otherSeen`: everything else seen

**9.5 Integration guard test (adds to §6).** Besides the sampler tests, add a light guard that weighting does not leak into non-Home paths: assert `startSession` without the `weighting` flag reproduces the prior unseen-first behavior, and assert (test or lint) that `weighting: "nclex"` appears at exactly one call site. The dominant failure mode here is behavior leakage into Builder / filtered Library / review pools, not the sampler math.

**9.6 Optional — true multinomial (deferred).** If per-session category *counts* should vary freely (the differential-trainer instinct) rather than stay fixed-with-±1-tie-jitter, swap §4.1's largest-remainder for a multinomial draw over the eight weights (sums to N by construction; floor reservation then occasionally needs the "steal a seat from the slackest category" rule more often). Default stays largest-remainder — for a question-practice tool, realistic-but-stable counts + varied item selection is the better behavior, and it keeps the floor math clean. Flip only if Luke wants the wider swing.
