# coverage-target-spec.md

Reconcile `scripts/coverage-report.ts` category targeting with the 2026 NCLEX-RN test plan,
so generation direction and study-session sampling read the **same** category weights.

## Problem

`coverage-report.ts` flags a category as under/over against a **uniform** target:

```ts
const categoryAverage = questions.length / categories.length;       // 1219 / 8 ≈ 152
const underCategories = sortedCategoryRows.filter(([, c]) => c < categoryAverage);
```

But `DECISIONS.md` principle 10 and `src/sessionSampler.ts` already commit the **study draw** to the
2026 test-plan distribution via `NCLEX_CATEGORY_WEIGHTS` (Mgmt 0.18, Pharm 0.16, PhysAdapt 0.14, Safety
0.13, RRP 0.12, HPM/Psych/BCC 0.09). Net effect today: the bank is *generated* toward flat-8 balance and
*served* toward the test plan — two distributions for one bank. Against the real plan the census reads very
differently from the uniform report: the holes are **Management of Care (140 vs ≈219)** and
**Pharmacological (153 vs ≈195)**; HPM / Psychosocial / Basic Care, reported "under" against flat-152, are
actually **over**.

Item-type targeting is **not** part of this problem. The test plan weights Client Needs categories, not item
formats; uniform across the seven item types is the correct target and stays as-is.

## Patch 1 — single source of truth for the weights

Move `NCLEX_CATEGORY_WEIGHTS` into `src/schema.ts` (which already owns `categories`/`itemTypes` and already
imports the `Category` type), and re-export it from `sessionSampler.ts` so existing import paths keep working.

**`src/schema.ts`** — insert immediately after the `categories` block:

```ts
export const NCLEX_CATEGORY_WEIGHTS: Record<Category, number> = {
  "Management of Care": 0.18,
  "Pharmacological and Parenteral Therapies": 0.16,
  "Physiological Adaptation": 0.14,
  "Safety and Infection Control": 0.13,
  "Reduction of Risk Potential": 0.12,
  "Health Promotion and Maintenance": 0.09,
  "Psychosocial Integrity": 0.09,
  "Basic Care and Comfort": 0.09,
};
```

**`src/sessionSampler.ts`** — delete the local `NCLEX_CATEGORY_WEIGHTS` literal and replace with:

```ts
import { NCLEX_CATEGORY_WEIGHTS } from "./schema";
export { NCLEX_CATEGORY_WEIGHTS }; // re-export: preserves any existing `from "./sessionSampler"` importers
```

`CATEGORY_ORDER` and the rest of the sampler are unchanged. The value is identical, so sampler behavior and
its tests are untouched. (No import cycle: `schema → types/visuals`, `sessionSampler → schema`; schema never
imports the sampler.)

> Lower-churn fallback if you'd rather not move it: leave the literal in `sessionSampler.ts` and have
> `coverage-report.ts` import `NCLEX_CATEGORY_WEIGHTS` from `../src/sessionSampler`. The schema home is
> preferred — it keeps domain constants together and avoids a report script reaching into a UI-adjacent
> module — but both achieve one definition.

## Patch 2 — weighted targets in `scripts/coverage-report.ts`

**Imports** — add `NCLEX_CATEGORY_WEIGHTS` and the `Category` type:

```ts
import { categories, difficulties, itemTypes, NCLEX_CATEGORY_WEIGHTS, rhythmClasses, validateBankObject } from "../src/schema";
import type { Category, Question, QuestionVisual, RhythmStripVisual } from "../src/types";
```

**`CoverageData` type** — drop `categoryAverage: number;` and add `categoryTargets: [string, number][];`.
Keep `itemTypeAverage: number;` (item types stay uniform).

**`computeCoverage`** — replace the uniform block:

```ts
const categoryAverage = questions.length / categories.length;
const itemTypeAverage = questions.length / itemTypes.length;
const sortedCategoryRows = sortedCounts(categories, categoryCounts);
const sortedItemTypeRows = sortedCounts(itemTypes, itemTypeCounts);
const underCategories = sortedCategoryRows.filter(([, c]) => c < categoryAverage);
const overCategories = sortedCategoryRows.filter(([, c]) => c > categoryAverage).reverse();
const underItemTypes = sortedItemTypeRows.filter(([, c]) => c < itemTypeAverage);
```

with weighted targets (item-type line unchanged):

```ts
const itemTypeAverage = questions.length / itemTypes.length;
const sortedCategoryRows = sortedCounts(categories, categoryCounts);
const sortedItemTypeRows = sortedCounts(itemTypes, itemTypeCounts);

// Category targets follow the 2026 NCLEX-RN test plan — the same weights the study
// sampler draws to (NCLEX_CATEGORY_WEIGHTS), not a uniform per-category average.
// NCSBN tolerates ±3 percentage points per category, so only flag outside that band.
const TOLERANCE_PP = 0.03;
const band = TOLERANCE_PP * questions.length;
const categoryTarget = (category: string) => (NCLEX_CATEGORY_WEIGHTS[category as Category] ?? 0) * questions.length;
const categoryGap = (category: string, count: number) => count - categoryTarget(category);
const categoryTargets: [string, number][] = categories.map((category) => [category, categoryTarget(category)]);

const underCategories = sortedCategoryRows
  .filter(([category, count]) => count < categoryTarget(category) - band)
  .sort((left, right) => categoryGap(left[0], left[1]) - categoryGap(right[0], right[1])); // largest deficit first
const overCategories = sortedCategoryRows
  .filter(([category, count]) => count > categoryTarget(category) + band)
  .sort((left, right) => categoryGap(right[0], right[1]) - categoryGap(left[0], left[1])); // largest surplus first
const underItemTypes = sortedItemTypeRows.filter(([, c]) => c < itemTypeAverage);
```

The sort change matters as much as the target change: the old code ranked "under" by lowest raw count, which
under the test plan mis-ranks (Psychosocial has the lowest count, 137, but is *over* its 110 target). Ranking
by deficit-vs-target puts Management of Care first, where it belongs.

**`prioritizeTopics`** — show each category's own target instead of the global average:

```ts
const prioritizeTopics = [
  ...underCategories.map(([cat, cnt]) => `${cat} (${cnt} vs target ${categoryTarget(cat).toFixed(0)})`),
  ...underItemTypes.map(([it, cnt]) => `${it} (${cnt} vs target ${itemTypeAverage.toFixed(1)})`),
  ...lowTopics.map((t) => t.label),
].slice(0, 24);
```

**Return object** — remove `categoryAverage`, add `categoryTargets`.

**CLI (optional, recommended)** — annotate the `## Category Counts` section with target and gap so the printed
report is self-explaining, e.g. `- Management of Care: 140 (target 219, −79)`. Build a small row formatter
that pairs `coverage.byCategory` with `coverage.categoryTargets`; leave the other sections alone.

## Patch 3 — `DECISIONS.md`

**3a. New bullet in *Other standing invariants*** — insert after the `fmt`/`roundTo` single-definition bullet
(ends "…Same single-transform discipline the shuffle function follows (principle 2)."):

> - Category targets are the 2026 test-plan weights, projectwide — not uniform. `NCLEX_CATEGORY_WEIGHTS`
>   (in `src/schema.ts`, re-exported from `sessionSampler.ts`) is the single source for both the weighted
>   study draw (principle 10) and the generation backlog in `scripts/coverage-report.ts`. The coverage report
>   formerly used a uniform `questions.length / categories.length`, so the bank was *generated* toward flat-8
>   balance while *sampled* toward the test plan — two distributions for one bank. Both now read one map;
>   under/over is measured against `weight × total` within NCSBN's ±3 pp tolerance. **Item-type** balance
>   stays uniform by design — the plan weights Client Needs categories, not item formats, so even coverage
>   across the seven types is the right target there.

**3b. Distribution-table intro** — append one sentence to "…Midpoint targets from the published test plan;
sum to 1.00.":

> The same map (`NCLEX_CATEGORY_WEIGHTS`, now homed in `src/schema.ts`) drives generation targeting in
> `coverage-report.ts` — see *Other standing invariants*.

**3c. New *Open threads* entry** — add beside the census entry:

> **Coverage-report category target — specced this session.** `coverage-report.ts` measured category under/over
> against a uniform `questions.length / categories.length`, inconsistent with principle 10's test-plan-weighted
> draw — bank generated to flat-8, served to the test plan. Spec reconciles both onto the shared
> `NCLEX_CATEGORY_WEIGHTS` (moved to `src/schema.ts`), under/over against `weight × total` inside NCSBN's ±3 pp
> band; item-type targeting stays uniform. Restating the census against the plan, the real holes are
> **Management of Care (140 vs ≈219)** and **Pharmacological (153 vs ≈195)**; HPM/Psych/BCC, previously "under"
> against flat-152, are over. Spec: `coverage-target-spec.md`.

## Verification

- `npm run build` / typecheck clean; `sessionSampler` tests still green (value unchanged).
- Run `coverage-report` against the current banks and confirm: **Management of Care** and **Pharmacological**
  now lead `underCategories`; **Physiological Adaptation**, **Basic Care and Comfort**, **Health Promotion**,
  **Psychosocial** appear in `overCategories`; **Safety** sits inside the ±3 pp band (≈1.6 pp under — light but
  tolerated); item-type output is byte-identical to before.

## Downstream / out of scope (flag, don't fix here)

- **`census.ts` / `census-spec.md`** consume `computeCoverage`. Regenerate `BANK-CENSUS.md` so the committed
  census shows per-category targets; whoever adds the missing `--json` branch (the empty-`coverage.json` bug)
  must include `categoryTargets`.
- **Embedded case-study parts are still not category-counted** — category balance is over top-level questions
  only (`computeCoverage` increments per top-level `question.category`; embedded `caseStudy.questions` aren't
  counted). Generating case studies to fix the `case_study` item-type deficit therefore injects graded content
  the category metric can't see. Whether to count embedded parts in category balance is a separate decision
  (ties to `census-spec.md`); not changed here.
