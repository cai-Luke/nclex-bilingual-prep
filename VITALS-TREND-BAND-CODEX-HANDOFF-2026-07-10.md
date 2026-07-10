# Vitals-Trend Band Suppression — Implementer Handoff

Date: 2026-07-10
From: Claude (architect seat)
To: implementer seat (Codex / GPT-5.6 Sol)
Governing spec: `vitals-trend-band-population-codex-spec.md`

## Your survey was right, and the item is worse than the report

`vit_08` declares `population: "peds_child"` on a stem that reads *"A pediatric client is admitted with a
high fever."* The renderer's band expression is:

```ts
referenceBand: s.showReferenceBand !== false ? def.normal(spec.tempUnit) : undefined,
```

`def.normal` takes the temperature unit and nothing else — `population` never reaches it — and the flag
defaults on. The band then feeds the y-axis bounds. So the bundled build draws a shaded band labeled
normal at **HR 60–100 on a child**, and scales the chart to it.

Two things to carry forward. The author declared the intended population **twice**
(`visual.population` and `meta.reference_bands`), and the renderer consumed neither. And **no gate could
have caught this**: `validate-bank` passes, `selfCheck` asserts trend direction rather than bands, and
visual parity passes because deterministically wrong output is still deterministic. Determinism buys
reproducibility, not truth.

## What this patch is, and is not

The keyed answer is unaffected — `A` holds under any band, both series descend monotonically, and the
distractors stay wrong. This is a **rendering** defect. **No bank file is touched.** No answer migration,
no `--allow-canonical`, no ledger entry.

And it does **not** build a pediatric band table. `peds_child` spans roughly one to twelve years; normal
HR for a one-year-old and a ten-year-old barely overlap, and the stem states no age. A correct pediatric
band is not computable from a three-value enum. Drawing no band is honest; drawing an adult band is a
false claim; drawing an invented pediatric band is a false claim made with more confidence.

## The work

1. **Renderer.** Default only an absent (`undefined`) population to `"adult"`; draw the band only when
   the resulting value is literally `"adult"` and `showReferenceBand !== false`. `null`, typos, and
   garbage suppress the band. Absent population behaves as adult, so every existing adult item stays
   byte-identical.
2. **Validation.** FAIL when `population` is present and non-adult *and* a series sets
   `showReferenceBand: true` explicitly. Code `reference_band_population_unsupported`. `vit_08` omits the
   flag, so it does not fail — that seam is deliberate.
3. **Fixtures.** Three valid (peds, omitted flag; peds, `false`; `null`, omitted flag), one invalid (peds,
   explicit `true`), plus renderer assertions that adult and peds specs with identical series produce
   different SVG and that `null` suppresses the band.

No carve-out for `temp`, despite 36.5–37.5 °C being roughly population-invariant. One rule, no
exceptions.

Do not add an enum check on `population` here. The **runtime vocabulary** — not a TypeScript union, which
erases, and whose erasure is exactly why `vitals_trend` accepts arbitrary JSON strings today — is being
centralized in Schema 2.0 Phase 1 (Amendment 0A, R10). The suppression guard is safe in the meantime:
anything other than `"adult"`, typo or garbage included, suppresses the band. It fails toward
not-claiming.

## Expected diff surface — the hash gate does not exist

**You were right; the spec was wrong and is corrected.** `scripts/tests/__snapshots__/visual-parity.json`
holds three rhythm-strip `svgHash` entries and nothing else; `scripts/tests/vitals-trend.ts` proves
determinism by rendering one fixture twice. There is no `vit_08` snapshot to update and no adult hash to
watch.

Verify by **ad-hoc before/after sweep** instead: SHA-256 every promoted `vitals_trend` SVG before the
edit, repeat after, and assert the changed-ID set is exactly `banks/vitals-canonical.json :: vit_08`.
Anything else in the set → stop and report, the guard is wrong. `vit_08` missing from the set → stop and
report, the suppression did not take. Do **not** mint a promoted-surface parity baseline as part of this
patch; that the committed baseline covers 3 visuals against ~196 promoted ones is its own finding and its
own gate change.

What changes for `vit_08`: the band disappears and the y-scale recomputes without the band bounds.

## Answered, closed

Your `lab_trend` report is recorded: bands default on, the renderer selects non-adult bands when authored,
and zero promoted `lab_trend` items use a non-adult population. `lab_trend` is **latent** where
`vitals_trend` was **live**. Nothing to do here — band consumption belongs to
`lab-reference-range-verification-spec.md`, which now inherits two consumers rather than one.

Also recorded: `selfCheckVitalsTrend` makes no reference-band assertion.

## Verification (renderer class)

```sh
npx tsc -b --pretty false
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run census:check
npm run build
```

Plus the before/after SHA-256 sweep above, with the changed-ID set reported.

Plus a visual audit of the re-rendered `vit_08`: no band, both series still descending, caption and axes
intact, and the item still answerable from the chart — the visual is load-bearing and must still carry
the trend the stem asks the learner to evaluate.

## Sequencing

Land this **before the next `pages.yml` deploy**. It does not block Phase 0B — different code, no
dependency — but a false clinical claim rendered into an assessed stimulus in a licensure prep app
outranks version infrastructure, and the fix is small enough that ordering it first costs nothing.

0B's scope is unchanged and stays gated behind the architect seat. Codex does not merge or push `main`.
