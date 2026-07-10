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

**4. Schema-version wiring — more than one file.** Read spec §2 in full; it was rewritten on 2026-07-09 after your pre-implementation review, which was correct on every count.

`requiredSchemaVersion: "1.9"` on the module does **not** enforce the bank floor. `validateVisual`'s own docblock says `schemaVersion` is accepted only for the registry-mechanics test and that production enforcement lives in `validateBankObject` — which never passes it. Ship `requiredSchemaVersion` for registry-contract parity, but the real gate is the hard-coded floor block.

Required: `src/types.ts` (`SchemaVersion` union — without it the `satisfies` clause fails the build), `src/schema.ts` (`supportedSchemaVersions`, the `validateBankObject` floor, `collectVisualUnknownKeys` branches for `intervals[]`/`binLabels[]`, a `collectQuestionMetaUnknownKeys` branch for `crossover`), `src/allowedKeys.ts` (`visualByKind.io_trend`, `ioTrendInterval`, `crossoverAssertion`, plus `collapse_test`/`crossover` on `questionMeta`), and `src/bankImport.ts` (§2.2).

Three rulings you do **not** get to re-decide:
- **`visualTime` is not modified.** Your suggestion to add `labels` there would loosen the shared key set that `vitals_trend` and `lab_trend` also consume, permitting `time.labels` on two kinds where nothing validates or renders it. Labels move to a sibling **`binLabels`** on `io_trend`'s own key set. (Also conceptually right: per spec §1.3 this kind's x is categorical bins, not the instants those kinds sample.)
- **`toExportEnvelope` is a blocker, not a follow-up.** An `io_trend` falls through the ladder to `"1.2"`, and `validate-bank` then *rejects that exported file*. Add the `"1.9"` rung.
- **The floor and the export ladder share one traversal.** You are right that `validateBankObject`'s floor needs the same `rationale.visuals` coverage as `hasIoTrend`. The fix is **not** to write the walk twice: export a single `collectAllVisuals(question)` and derive `hasIoTrend` from it in both files. Those two files already keep *separate* copies of the pacer traversal, which is exactly why they drifted — do not add a third pair. Spec §2.2.

**`SCHEMA_VERSION` — resolved, act on it.** Your `rg` found no consumer beyond the definition, so the mass-re-declaration risk does not exist. Bump it to `"1.9"`; an exported constant with zero consumers that holds a stale value is a trap for whatever imports it next. Put the `rg` output in the PR as evidence.

**Do not touch `lib/canonical-routing.ts`, and do not create a canonical bank.** `io_trend` mints no `iotrend-canonical.json` and adds no `CANONICAL_PREFIXES` row. The eight per-kind visual canonicals are historical closed sets frozen at schema `1.2`; every kind added since — `rhythm_strip`, `fetal_monitoring` (U7), `injection_site` (U10) — promotes through the existing `visual-` prefix into the live `visual-canonical.json`, which is why no `rhythm-`/`fetal-`/`inj-` row exists. `io_trend` follows them. (An earlier draft of the spec said otherwise; it was corrected on 2026-07-09 after GPT flagged the doc conflict. If you find a stale `iotrend-` reference anywhere, that is the bug — flag it, do not implement it.)

**4b. `measureDocTable`, and a proof that actually proves something.** You are right on both counts: `renderDocTable` has no measurement helper, and `visual-parity.ts` hashes **rhythm strips only**, so "the parity snapshot stays green" would have been a vacuous proof for `io_record`. My earlier wording was wrong.

Export `measureDocTable(input): number` from `primitives/table.ts`; have `renderDocTable` call it internally so they cannot disagree (precedent: `measureFieldPanel`, U6). Do **not** open-code the formula a second time — that is the duplicated-arithmetic hazard the single `roundTo` exists to prevent (principle 11).

**The refactor proof is the commit order**, two commits:
1. On the **pre-refactor** tree, pin `sha256(renderIoRecordSvg(fixture))` for both `io_record` fixtures into `scripts/tests/io-record.ts`. Commit. It must pass against the *unmodified* renderer.
2. Then add `measureDocTable`, refactor `io_record` onto it, commit. The pinned hashes must be unchanged.

A hash captured after the refactor proves only that the code equals itself. If the hashes move in step 2, stop.

**4c. A pre-existing defect you surfaced — report, do not fix.** `hasPacerRhythmStrip` in *both* `schema.ts` and `bankImport.ts` omits `rationale.visuals`, so a pacer `rhythm_strip` used only as an explanation figure evades the `1.7` floor today. Same family as your finding, older than `io_trend`. **Out of scope for U11:** tightening that floor can newly *reject* an existing bank, which is a content-affecting validation change needing its own gate. In this pass, run a read-only check for any bank with a pacer `rhythm_strip` in `rationale.visuals` at `schemaVersion < 1.7` and **report the count** (expected: zero). Leave `hasPacerRhythmStrip` alone. Recorded as an open thread in `DECISIONS.md`.

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
lib/canonical-routing.ts
banks/*.json
```

`src/types.ts`, `src/schema.ts`, `src/allowedKeys.ts`, `src/bankImport.ts` get exactly the changes in step 4 — no more. `src/visuals/primitives/table.ts` gains `measureDocTable`; `src/visuals/kinds/io_record/index.ts` is refactored onto it, parity-snapshot-gated.

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
- the `rg SCHEMA_VERSION` output (evidence for the zero-consumer claim);
- the count of banks carrying a pacer `rhythm_strip` in `rationale.visuals` below schema `1.7` (§4c — read-only);
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
- that the `io_trend` floor is enforced in `validateBankObject`, not merely declared via `requiredSchemaVersion`;
- that `collectAllVisuals` is a **single** definition consumed by both the floor and `toExportEnvelope`, and that it walks `rationale.visuals`;
- that `hasPacerRhythmStrip` is **unchanged**;
- that `allowedKeySets.visualTime` is **unchanged**, and `binLabels` lives under `visualByKind.io_trend`;
- that the pinned `io_record` hashes were committed *before* the refactor commit (check the history, not just the final tree);
- that `measureDocTable` is the single definition of table height;
- that `lib/canonical-routing.ts` is untouched and no new canonical bank exists.

---

## Next, after this lands (not yours)

The proof batch (spec §11): four items, one per accepted frame. Frames **2 and 4 are a matched pair sharing an identical final cumulative net of −300 mL with opposite keyed actions** — expected diuresis (continue to monitor) vs. dehydration (intervene). If a single net balance could resolve an `io_trend` item, those two items would key the same answer. They do not. That pair is the executable proof of the collapse test, and it is authored last, by a model that is not Codex.
