# Patch — Revert item-type row ordering to count-rank (coverage-report)

**Target file:** `scripts/coverage-report.ts` (+ one guard assertion in `scripts/tests/coverage-report.ts`). No other files.

**Type:** Surgical revert. One line of behavior, one guard test.

---

## Why

The coverage-report feature over-applied schema ordering. The spec scoped schema order to the four *new* item-type fields (`TopicBucket.itemTypeCounts`, `categoryItemTypeCounts`, `backfillTopics.missingTypes`, `backfillCategories.lowTypes`). The implementation also routed the pre-existing `byItemType` through the new `orderedCounts` helper, which:

1. Changes existing output — `byItemType` was count-ascending before the feature; this violates the additive invariant ("no existing field changes meaning").
2. Reorders `underItemTypes` — it derives from the same row set, so the `PRIORITIZE_TOPICS` under-type entries lost their most-deficient-first ordering, which is the useful order for steering.

Count-ascending is also simply better for both surfaces: rarest types first in the display, most-deficient types first in PRIORITIZE.

---

## Change

In `computeCoverage`, revert the item-type row builder from the new helper back to the count-sorting one:

```ts
// from:
const sortedItemTypeRows = orderedCounts(itemTypes, itemTypeCounts);
// to:
const sortedItemTypeRows = sortedCounts(itemTypes, itemTypeCounts);
```

That single change restores both `byItemType` and `underItemTypes` (which both read `sortedItemTypeRows`) to count-ascending order.

---

## Must NOT change

Leave `orderedCounts` defined and in use for the genuinely-new fields — they must stay schema-ordered:

- `TopicBucket.itemTypeCounts` → `orderedCounts(itemTypes, b.itemTypeCounts)`
- `categoryItemTypeCounts` → `orderedCounts(itemTypes, ...)`
- `backfillTopics.missingTypes` and `backfillCategories.lowTypes` → derived from `BACKFILL_TYPES` (schema order)

Do not touch `byCategory`, `byDifficulty`, `byRhythmClass` (already `sortedCounts`), the backfill logic, the carve-out, or any CLI section. This is ordering-only on the two item-type surfaces.

---

## Test

No existing test asserts `byItemType` order, so the revert breaks nothing. Add one guard so the drift can't silently recur:

```ts
const itemTypeCountsAscending = coverage.byItemType.every(
  ([, count], index, rows) => index === 0 || rows[index - 1][1] <= count,
);
assert.equal(itemTypeCountsAscending, true, "byItemType rows must stay count-ascending");
```

(Fixture-independent — asserts monotonic non-decreasing count rather than a specific order.) The existing schema-order assertions on `topics[].itemTypeCounts` and `backfillCategories[].lowTypes` must continue to pass unchanged — they prove the new fields stayed schema-ordered.

---

## Verify

- `npm run test:coverage-report`
- `npm run build`
- `npm run coverage-report` — confirm `PRIORITIZE_TOPICS` under-type entries (the `{type} (n vs target …)` lines) lead with the most-deficient types, and the `## Format Backfill Opportunities` / topic-level `missing:` lists remain in schema order.
