# Coverage Report — Draw-Eligible Capacity + Format-Aware Backfill (Codex spec)

**Target files:** `scripts/coverage-report.ts` and its test `scripts/tests/coverage-report.ts`. No other files.

**Status:** Reviewed twice (GPT cross-model: design + implementer pass) and adjudicated. Ready for Codex. Thresholds are named consts, tunable after first run.

---

## Why

Two blind spots, both verified against live behavior:

1. **Eligible-capacity masking.** `computeCoverage` counts every item — case studies included — toward each category total (`categoryCounts`). But `buildWeightedSession` (`src/sessionSampler.ts`) draws only `eligible = pool.filter((r) => r.question.itemType !== "case_study")`, then apportions `targetCount = min(requested, eligible.length)` seats per category by `NCLEX_CATEGORY_WEIGHTS` via `apportionSeats`, which is capacity-capped: a category whose eligible pool is below its weighted seat target hits capacity, drops out of the active set, and **silently donates its unfilled seats to other categories**. The current report shows `byCategory` (case studies included), so a category can read "covered" while the sampler sees a thin pool. The report never surfaces the number the draw actually uses.

2. **Format-blind AVOID.** `avoidTopics` is derived from `overTopics`, a raw count ranking. A topic saturated *only in `multiple_choice`* and missing the newer NGN types reads as over-covered and gets steered away from — backwards, because an NGN item on a concept already covered in MC is complementary (it exercises cue analysis / prioritization / multi-step judgment), not redundant. The early "generate 50 random" MC volume in **Physiological Adaptation** is the live instance: high MC count, little/no `matrix`, `dropdown_cloze`, `highlight`, `bowtie` on those topics.

**Decision (from review):** keep AVOID's definition (blunt "we already have a lot here"), but (a) carve MC-heavy / NGN-light topics out of it so it stops suppressing format backfill, and (b) add a positive signal that points generation at the underserved item types within over-served categories and topics. Everything additive except the two deliberate, listed changes to AVOID/PRIORITIZE output.

---

## Invariants (hold these)

- **Deterministic.** No model calls, no `Date`/`now`, no randomness. Same input → byte-identical output.
- **Derive type sets from schema; never hardcode item-type string literals in this file.** Import `standaloneItemTypes` (and `itemTypes`) from `../src/schema`. The "newer types" set must be computed, so it stays correct as the enum grows (highlight/bowtie are already in `standaloneItemTypes`; a future type joins automatically).
- **Schema order for all item-type-keyed rows.** `itemTypeCounts`, `categoryItemTypeCounts`, `missingTypes`, `lowTypes` enumerate in `itemTypes` / `standaloneItemTypes` order (matching the existing `sortedCounts` convention), never count-rank. Stable and deterministic.
- **Top-level standalone items only** for the format and eligibility tallies. Do **not** recurse into `caseStudy.questions` for itemType/eligibility counting — embedded items are never draw-eligible (their parent `case_study` is excluded from the weighted session), so counting them would misalign the report from the sampler. This matches existing `categoryCounts`/`itemTypeCounts` behavior; preserve it. (`collectVisuals`' recursion into case studies is for the *visual* tally only and is unrelated — leave it.)
- **Additive**, except: the contents of `avoidTopics` and `prioritizeTopics` change as specified in Addition B. No existing `CoverageData` field changes type or meaning; no existing CLI section is removed.
- **Load-bearing numbers are named consts**, commented as calibration knobs.

---

## Addition A — Draw-eligible capacity per category

Mirror what `buildWeightedSession` sees.

**New `CoverageData` fields:**
- `sessionSize: number` — N used for seat targets (default `SESSION_SIZE`, CLI-overridable).
- `totalEligible: number` — count of all non-`case_study` top-level questions across the bank.
- `insufficientForFullSession: boolean` — `totalEligible < sessionSize` (the whole bank can't fill a full weighted session yet).
- `eligibleByCategory: [string, number][]` — count of non-`case_study` top-level questions per category, in `categories` order.
- `eligibleCategoryTargets: [string, number][]` — `NCLEX_CATEGORY_WEIGHTS[cat] * sessionSize`. **This is a requested-session adequacy yardstick, not the sampler's realized per-category allocation.** The sampler apportions `min(requested, totalEligible)` seats and caps each category at its eligible count; the report deliberately measures against the full `sessionSize` (un-clamped) so a thin bank shows the gap to a *healthy* session, not to a stretched undersized one. The `insufficientForFullSession` flag carries the global "can't reach N" message separately, so per-category gaps aren't misread as the whole story.
- `eligibilityShortfalls: [string, number][]` — categories where `eligibleCount < eligibleTarget`, value = `eligibleCount - eligibleTarget` (negative), sorted most-negative first.

**Compute:** one pass; for each question with `itemType !== "case_study"`, increment its category and `totalEligible`. Reuse the existing `NCLEX_CATEGORY_WEIGHTS` import already present in the file.

**Consts:** `const SESSION_SIZE = 50; // default weighted-session size; matches the app's default 50-Q session`.

**CLI flag — pure, testable parser.** Extract `export const parseSessionSize = (argv: string[]): number` that reads `--session-size=<n>` and returns the parsed positive integer or `SESSION_SIZE` (on absent / non-numeric / non-positive). `runCli` calls it; the existing bank-path arg filter that drops `--`-prefixed args is unaffected. Do not embed the parse inline — the pure function is what test #6 exercises, no CLI shelling.

**CLI section** (after `## Category Counts`):
```
## Draw-Eligible Capacity per Category (requested session size {N})
Total eligible (non-case_study): {totalEligible}
{when insufficientForFullSession}: NOTE: fewer than {N} eligible items bank-wide — a full weighted session cannot be drawn yet.
- {Category}: eligible {count} (requested target {weight*N, 1dp}, gap {+/-}{gap, 1dp})
...
Shortfalls (under requested target — these under-deliver and donate seats to other categories):
- {Category}: eligible {count} vs target {target} (short {gap})
- none      // when there are no shortfalls
Targets are the requested {N}-Q adequacy yardstick (weight x {N}); the sampler's realized allocation caps at eligible.length per category.
```

---

## Addition B — Format-aware backfill + AVOID carve-out

**Target type set (derived). `case_study` is excluded by construction — verified, see note:**
```ts
// standaloneItemTypes (src/schema.ts), verified at schema 1.5:
//   multiple_choice, select_all, ordered_response, fill_in_blank,
//   matrix, dropdown_cloze, highlight, bowtie
// It does NOT contain case_study — case_study lives only in `itemTypes`.
// Exclude multiple_choice (the baseline/over-served type) and, redundantly but
// explicitly, case_study. The case_study clause is a documented no-op guard: it
// is already absent from standaloneItemTypes, but spelling it out makes the
// intent unmistakable and survives any future refactor of the enum shape.
// Any OTHER standalone type, present or future, is included automatically.
const BACKFILL_TYPES = standaloneItemTypes.filter(
  (t) => t !== "multiple_choice" && t !== "case_study",
);
// => select_all, ordered_response, fill_in_blank, matrix, dropdown_cloze, highlight, bowtie
```

**Per-topic per-type counts.** Extend the topic bucket aggregation in `computeCoverage` so each topic tracks counts per itemType, not just presence. Add to `TopicBucket` an additive field:
- `itemTypeCounts: [string, number][]` — `[itemType, count]` for that topic in schema order (full enumerated vector including zeros, like `sortedCounts`). CLI may render present-only for compactness; the field carries the full vector.

Keep the existing `itemTypes: string[]` presence array as-is (other readers may use it).

**Per-category per-type counts.** Add:
- `categoryItemTypeCounts: [string, [string, number][]][]` — for each category (in `categories` order), the `[itemType, count]` rows in schema order (full enumerated vector including zeros; top-level items). Drives the category-level backfill view.

**Two distinct "missing/low" notions — do not conflate:**
- *Topic-level (strict absence):* a backfill type is "missing" on a topic when its count is **exactly 0**. Gates the AVOID carve-out and the PRIORITIZE `add:` entries — it touches steering, so it stays conservative.
- *Category-level (low):* a backfill type is "low" in a category when `count < BACKFILL_TYPE_FLOOR`. Advisory only (no behavioral side effect).

**Backfill signals:**

- `backfillTopics: { label: string; categories: string[]; mcCount: number; missingTypes: string[] }[]` — a topic qualifies when its `multiple_choice` count `>= MC_HEAVY_FLOOR` **and** at least one `BACKFILL_TYPES` member has count `=== 0` for that topic. `categories` = the topic bucket's sorted category set (a normalized label can merge across categories; carry the full sorted set so the merge is surfaced, not hidden behind a lossy singular pick — deterministic). `missingTypes` = strictly-absent backfill types, schema order. Sort entries by `mcCount` desc, then label. Expose `isBackfillTopic(bucket)` used in both the signal and the AVOID filter.

- `backfillCategories: { category: string; overTarget: number; lowTypes: [string, number][] }[]` — for each **over-served** category (a category in `overCategories`: raw count above `categoryTarget + band`), list backfill types whose `count < BACKFILL_TYPE_FLOOR`, schema order. `overTarget` = how far over (raw). Compute for over-served categories only; empty if none. See the raw-basis note below.

**Raw over-served basis (intended).** `overCategories` is computed from the raw category total, case studies included — so a category can be raw-over yet draw-eligible-thin (the exact tension Addition A surfaces). This is intended and not contradictory: both signals resolve to the *same* action, adding NGN **standalone** items, which are simultaneously draw-eligible volume and a new format. The CLI annotates any over-served category that also appears in `eligibilityShortfalls` as "also eligible-short" so the overlap is explicit.

**The two output changes (the approved softening):**

1. **AVOID carve-out.** When building `avoidTopics`, exclude any topic that satisfies `isBackfillTopic`. AVOID still lists genuinely-saturated topics (full or near-full type coverage); it no longer lists MC-monoculture topics.
   ```ts
   const avoidTopics = overTopics
     .filter((t) => !isBackfillTopic(byTopicBucket(t)))   // resolve bucket via normalizeTopic(label), not raw-label equality
     .map((t) => `${t.label} (${t.count})`);
   ```
2. **PRIORITIZE injection.** Prepend backfill opportunities to `prioritizeTopics`, missing types explicit, then slice (raise cap 24 → 32 so backfill entries don't crowd out the existing under-category / under-type / low-topic entries):
   ```
   {topic} — add: {missingTypes joined}
   ```
   Order: backfill topic entries first, then existing `underCategories` / `underItemTypes` / `lowTopics` content.

**Consts (knobs):**
```ts
const MC_HEAVY_FLOOR = 3;
// topic multiple_choice count at/above which an NGN-light topic is a backfill
// target (and carved out of AVOID). 1-2 MC items is a lightly-touched topic,
// not a monoculture; do not lower.

const BACKFILL_TYPE_FLOOR = 2;
// category-level "low" cutoff, used as `count < BACKFILL_TYPE_FLOOR`.
// 2 => a backfill type with 0 OR 1 items in an over-served category reads as
// low (one item among dozens of MC is effectively a monoculture). Set to 1 for
// "absent only". Advisory list only — no behavioral side effect.
```

**CLI section** (after `## Lowest-Covered Topics`, before `## Prompt Parameters`):
```
## Format Backfill Opportunities
Over-served categories missing newer item types (raw count basis):
- {Category} (over target by {overTarget}{; also eligible-short when applicable}): low/absent: {type} ({count}), ...
- none

MC-heavy topics missing newer item types (carved out of AVOID):
- {topic} [{categories joined}]: MC x{mcCount}, missing: {missingTypes}
- none
```

---

## Resolved knob — `case_study` in `BACKFILL_TYPES`

**Excluded.** Concurred by review (GPT), Claude's recommendation, and the stated intent (cheap standalone NGN variety in over-served categories, not expensive case studies). Case studies are a separate pipeline (authored prose → skeleton review → JSON compile → audit/promotion) and are not draw-eligible; Addition A already exposes the case-study-vs-eligible split per category. To flip — surface "topic X is missing a case study" in the same backfill list — drop the `&& t !== "case_study"` clause from the `BACKFILL_TYPES` derivation; nothing else changes.

---

## Tests (extend `scripts/tests/coverage-report.ts`, mirror existing `computeCoverage` cases)

1. **Eligible masking.** A category whose raw total clears its target *only because of case studies* but whose non-`case_study` count is below `weight * sessionSize` appears in `eligibilityShortfalls`; a category with enough eligible items does not.
2. **AVOID carve-out + PRIORITIZE.** A topic with `multiple_choice` count `>= MC_HEAVY_FLOOR` and zero `matrix`/`highlight` appears in `backfillTopics`, appears in `prioritizeTopics` with its missing types, and is **absent** from `avoidTopics`.
3. **Carve-out is targeted (critical guard).** A topic that is over-served **and already has full backfill-type coverage** stays in `avoidTopics` and is **not** in `backfillTopics`. Proves AVOID was softened, not gutted.
4. **Derived type set.** Assert `BACKFILL_TYPES` includes `highlight` and `bowtie` and excludes both `multiple_choice` and `case_study`.
5. **Determinism.** Same `questions` input twice → deep-equal `CoverageData`.
6. **`parseSessionSize`.** Direct unit test: `--session-size=20` → 20; absent / `--session-size=abc` / `--session-size=0` / negative → `SESSION_SIZE`.
7. **Un-clamped target + insufficiency flag.** A fixture with `totalEligible < sessionSize` sets `insufficientForFullSession = true` and still computes `eligibleCategoryTargets` against the full `sessionSize` (not clamped), so per-category gaps reflect the gap to a healthy session.
8. **Cross-category topic merge.** A normalized topic label appearing under two categories yields `backfillTopics[].categories` containing both, sorted — surfacing the merge deterministically.
9. **Schema order.** `itemTypeCounts` / `lowTypes` rows are in `itemTypes` order, not count rank.

---

## Out of scope / follow-ups (do not do here)

- **Generation prompt.** No edit to `NCLEX-Bank-Generation-Prompt.md` required: it already consumes `PRIORITIZE_TOPICS`/`AVOID_TOPICS` as soft bias, so enriched entries flow through. An optional one-line clarification that a PRIORITIZE entry may name specific item types to add is a separate, later edit.
- **`find-duplicates.ts` cross-type labeling** (so a future redundancy pass doesn't false-positive an NGN reformulation of an existing MC item as a "duplicate") — separate small spec.
- **Under-served category type-mix section** (GPT's note): a later report could add type-mix backfill for under-served categories too. Not this pass — scope stays "newer types in over-served categories."
- No change to `sessionSampler.ts`, `schema.ts`, or any bank file.

---

## Acceptance

- `npm run coverage-report` prints the two new sections; `--session-size=N` (via `parseSessionSize`) changes the capacity targets; `Total eligible` and the insufficiency note render.
- `avoidTopics` no longer contains MC-heavy / NGN-light topics; `prioritizeTopics` lists them with explicit missing types.
- New `CoverageData` fields populated; no existing field changed in type or meaning.
- No model calls; deterministic; no hardcoded item-type string lists; item-type rows in schema order.
- `npm run test` (coverage-report suite) green.

---

## Review adjudication (cross-model, GPT)

**Round 1 (design).** Accepted as-is: keep `case_study` excluded (#1); don't lower `MC_HEAVY_FLOOR` (#4); 24→32 prioritize cap (#5); `backfillCategories` over-served-only (#6); tests sufficient, #3 the load-bearing guard (#7). Clarified: `BACKFILL_TYPE_FLOOR` spelled as `count < FLOOR`, default 2, topic-level strict-absence kept distinct (#2); `BACKFILL_TYPES` derivation stated as verified fact + explicit double-filter (#3, since `standaloneItemTypes` provably excludes `case_study`).

**Round 2 (implementer).** Accepted: restored the Addition B CLI section (#2, a rewrite regression); `backfillTopics.category` → sorted `categories: string[]` for merged-topic determinism (#3); schema order for all item-type rows (#4); extracted pure `parseSessionSize` for clean testing (#5). Resolved against GPT's first option, with reason: did **not** clamp targets to `min(sessionSize, totalEligible)` (#1) — kept `weight × sessionSize` as a relabeled adequacy yardstick plus `totalEligible` + `insufficientForFullSession`, so a thin bank shows the gap to a healthy session rather than a diluted one. Kept `backfillCategories` on the raw over-served basis (mild note) — the raw-over/eligible-thin overlap is intended and complementary, annotated "also eligible-short" in the CLI.
