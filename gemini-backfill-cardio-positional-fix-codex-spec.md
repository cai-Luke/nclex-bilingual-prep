# Codex spec — fix positional-language hazard in `gemini_backfill_or_cardio_01`

**Author:** Claude (diagnosis / spec seat)
**For:** Codex (implementation)
**Date:** 2026-06-20
**Goal:** clear the one remaining `npm run audit` failure and return the gate to green.

---

## What's wrong

`audit:references` (Tier 1) fails on a single item: `gemini_backfill_or_cardio_01`. The standalone run flags exactly two fields:

```
gemini_backfill_or_cardio_01:
  [hazard]    rationale.correct.en
  [hazard]    rationale.correct.zh
```

This is a **true positional-language hazard**, not a regex false positive. The `rationale.correct` text describes an ordered resuscitation/code sequence and tags each step with its option letter — `... defibrillator immediately (A). Second ... (B). Third ... (C) ... rhythm (D). Fifth ... (E) ...`, and the Chinese mirrors it (`... (A)。其次 ... (B)。第三 ... (C) ... (D)。第五 ... (E) ...`). Those letter tags are meaningless once options shuffle, which is exactly what the zero-tolerance hazard rule exists to catch.

## The fix

Rewrite **only** `rationale.correct.en` and `rationale.correct.zh` on `gemini_backfill_or_cardio_01` so each step stands on its **action content** instead of its option letter.

- **Remove** the `(A)`–`(E)` option-letter tags and smooth the surrounding punctuation.
- **Name the action by its clinical content** where the letter previously carried the reference (the text already names each action — e.g. "call for help and get the defibrillator," "check the rhythm," "deliver the shock"). Do **not** substitute a generic ordinal+noun like "the first action."
- **Keep** the step sequence and the ordinal sequencing words ("Second/Third/Fifth" / "其次/第三/第五"). Those are not hazards — the audit only flags ordinals immediately followed by `option|answer|choice`, which these are not.
- **Preserve** all clinical content, terminology, and step order verbatim apart from removing the letter tags. This is a de-referencing pass, not a content rewrite.
- **Keep bilingual parity:** apply the change symmetrically so `en` and `zh` remain semantically matched.

## Scope guard

Touch only those two strings on that one item. Do **not** alter `rationale.byChoice` (already clean), `options`, the `correct` array, `stem`, `testTakingStrategy`, `glossary`, or any other field or item. Additive/minimal — no reordering, no renumbering.

## Verify

1. `npx tsx scripts/audit/audit-references.ts` → `gemini_backfill_or_cardio_01` no longer listed; and confirm the rewrite did not introduce any other hazard pattern.
2. `npm run audit` → GATE PASSED (this was the only failing item).
3. `npm run validate-bank -- banks/gemini-canonical.json` and `npm run test:schema-bank` → still green (no structural regression).
4. Spot-check `en`/`zh` parity on the rewritten field.

## Boundary

Codex implements; the audit going green is the objective check. The rewrite content comes from the item's own existing text, not from reconstruction. Claude can gate the diff before merge if desired.
