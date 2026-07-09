# Codex Handoff — U11 `io_trend` (schema 1.9)

**Date:** 2026-07-09
**Architect:** Claude (spec + gate). **Implementer:** Codex. **Promoter:** Luke.
**Authoritative spec:** `Archive/U11-IO-TREND-SPEC.md` — read it in full before writing any code. This handoff is sequencing and gates, not a substitute.
**Governing decision:** `DECISIONS.md` principle 25 (written 2026-07-09, this session). Read it before §1 of the spec; it is *why* this kind renders a chart over a table at all.

Read order, as always: `CLAUDE.md` → `AGENTS.md` → `PROJECT-HISTORY.md` → `DECISIONS.md` → `NCLEX-Question-Schema.md`. Disk is authoritative; do not reconstruct from this document.

---

## What this is

The twelfth visual kind. `io_record` (U5) is a single-period snapshot with **no time axis** — verified live on disk this session — so it is structurally incapable of expressing any time-dependent I/O clinical frame. `io_trend` adds serial intake/output across ≥3 charted intervals, rendered as a **diverging bar chart over a value table**.

It is **not** a redesign of `io_record`. The two kinds stay disjoint: gross interval totals here, itemized sources there. Do not merge them, and do not add a time axis to `io_record`.

---

## Two fences you must not route around

These are principle 25's conditions, and the kind is invalid without them.

1. **The collapse test.** An `io_trend` item is valid iff collapsing the series to a single net balance changes the answer. Machine half: `meta.collapse_test` is required and `selfCheck` asserts its presence. Semantic half: human review. **You implement the machine half only.**

2. **No exact-value items — enforced by the registry, not by prose.** `allowedItemTypes` is `["multiple_choice", "select_all", "matrix"]`. **`fill_in_blank` is deliberately excluded**, unlike `io_record`, because a numeric blank is the affordance that would invite "what was the net balance at 1200?" — an `io_record` item that would prove this kind redundant. Ship a test asserting the exclusion (spec §10). If you find yourself wanting to add `fill_in_blank`, stop and flag it; do not add it.

---

## Order of work

Land these as separable commits. Do not open a content lane; do not write to any `banks/*.json`.

**1. `src/visuals/primitives/divergingBars.ts`** — new shared primitive (spec §7).
Keep it general: it is a bar chart around a zero baseline, with no I/O vocabulary. Built inside its first consumer, per the house pattern (`lineChart`→U2, `renderDocTable`→U4, `renderFieldPanel`→U6).
- Import `fmt` / `fmtNum` / `roundTo` from `graphPaper.ts`. **Never redefine them** — single-definition invariant, `DECISIONS.md` principle 11.
- Callers pass `negative` as a **magnitude**; the primitive owns the sign.
- **No value labels on bars.** The table is the value-complete layer; labelled bars would duplicate it.
- **No flag colors.** Neutral roles only (suggest `blue`/`slate`). A red bar or a red cumulative line asserts "overload" and states the answer. Mirrors U5's bold-but-uncolored net row.

**2. `src/visuals/kinds/io_trend/{types.ts,index.ts}`** — spec §4, §5, §6, §8.
- No net, cumulative, or total fields anywhere on the spec type. Both the renderer and `selfCheck` derive them independently. A derived value that never exists as data cannot drift.
- Volumes are integers `>= 0` (zero is meaningful — anuria). Equality is exact integer arithmetic: **no epsilon, no rounding**.
- `selfCheck` never throws; returns `[]` on malformed spec. Mirror `selfCheckIoRecord`'s defensive shape and its early-return-on-invalid-volume ordering.
- `requiredSchemaVersion: "1.9"`.

**3. Append-only registration** — `src/visuals/types.ts` (union + import), `src/visuals/kinds/index.ts` (`import "./io_trend";`).

**4. Two minimal, unavoidable edits.** A new schema version cannot be registry-driven.
- `src/schema.ts`: add `"1.9"` to the accepted `schemaVersion` set. **Nothing else.**
- `lib/canonical-routing.ts`: add `CANONICAL_PREFIXES` row `iotrend-` → `iotrend-canonical.json`. Do **not** reuse `io-` (that routes to U5's closed set).

**5. Tests** — spec §10. `scripts/tests/diverging-bars.ts` and `scripts/tests/io-trend.ts`, both registered in `test-visuals`. The arithmetic gate, the trend assertion, the crossover assertion, the two fence checks.

**6. Docs** — spec §15. `NCLEX-Question-Schema.md` gains the `1.9` version rows, the taxonomy row, the per-kind subsection, the validation bullets, and the migration note (`1.8`→`1.9` requires no content changes). `PROJECT-HISTORY.md` gains a U11 milestone.

**Not in this pass:** the proof batch (spec §11), any content generation, any promotion, any bank write. Those are gated on this landing green.

---

## Do not touch

```text
src/App.tsx
scripts/validate-bank.ts
scripts/coverage-report.ts
scripts/census.ts
banks/*.json
```

`src/schema.ts` and `lib/canonical-routing.ts` get exactly the two additions in step 4.

---

## Deferred deliberately — do not resolve on your own

- **Split eligibility** (`DECISIONS.md` principle 23). This is a net-new composite geometry; principle 23 rules by *measured* geometry, not prediction. Measure the real render, report chart height + table height + total, and let Claude/Luke rule. Expectation to confirm-or-falsify: it joins the standalone allowlist beside `io_record`, and the risk is total **height**, not width. If it overflows, the fix is an interval-count density cap for split-eligible items, not a full-width exclusion.
- **`MAX_INTERVAL_ML = 10_000`** is a sanity bound, not a clinical claim (mirrors U5's `MAX_ENTRY_ML`). If a legitimate volume trips it in the content lane, that is a calibration report, not a silent widening.
- **Zero in the crossover assertion.** Zero counts as neither positive nor negative and fails the assertion. State it in code; do not quietly pick a convention.

---

## Verification before you hand back

```sh
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run census
npm run census:check
npm run build
```

All green. Then report, explicitly:
- the measured composite render dimensions (for the §12 split ruling);
- any place the spec was underspecified and you made a judgment call;
- confirmation that `fill_in_blank` is absent from `allowedItemTypes` and that a test asserts it.

---

## Gate

**Codex does not merge or push `main`.** The architect gate is explicit and it is not optional — a prior self-promotion of the `structuredMeasurements` proof batch to `main` was a confirmed process breach. Open the PR; Claude reviews against live disk (not against your self-report); Luke promotes.

Claude's review will independently re-derive, from the live files rather than from this document:
- that no total, net, or cumulative field exists on `IoTrendSpec`;
- that `renderSvg` and `selfCheck` derive those values by separate code paths;
- that `fmt`/`fmtNum`/`roundTo` are imported, never redefined;
- that `allowedItemTypes` excludes `fill_in_blank`, and a test enforces it;
- that no bar, cell, or line carries a clinical flag color;
- that `selfCheck({} as IoTrendSpec, {})` returns `[]` and does not throw;
- that `src/schema.ts` gained one string and nothing else.

---

## Next, after this lands (not yours)

The proof batch (spec §11): four items, one per accepted frame. Frames **2 and 4 are a matched pair sharing an identical final cumulative net of −300 mL with opposite keyed actions** — expected diuresis (continue to monitor) vs. dehydration (intervene). If a single net balance could resolve an `io_trend` item, those two items would key the same answer. They do not. That pair is the executable proof of the collapse test, and it is authored last, by a model that is not Codex.
