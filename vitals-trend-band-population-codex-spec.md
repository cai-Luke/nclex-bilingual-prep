# Vitals-Trend Reference Band × Population — Codex Spec

Date: 2026-07-10
Author: Claude (architect seat)
Implementer: Codex
Spec-conformance gate: Claude (architect)
Content gate: not required — **no bank file is touched by this patch**

Stops `vitals_trend` from rendering an **adult** reference band on a client the author declared
pediatric. One promoted item is affected. Governing decisions: `DECISIONS.md` principle 3 (fail loud),
principle 6 (deterministic, load-bearing visuals), principle 11 (single definition), principle 19
(stimulus vs. explanation figures).

Nothing here authorizes a canonical bank write. `banks/vitals-canonical.json` is not edited.

---

## 1. The defect

`src/visuals/kinds/vitals_trend/index.ts`, inside `renderVitalsTrendSvg`:

```ts
referenceBand: s.showReferenceBand !== false ? def.normal(spec.tempUnit) : undefined,
```

`VitalDef.normal` (`./defs.ts`) has the signature `(unit?: "C" | "F") => { low, high }`. It takes the
temperature unit and nothing else. **`spec.population` never reaches it.** `showReferenceBand` defaults
to on. `validateVitalsTrend` never inspects `population`.

The band is not merely drawn — it also participates in the axis calculation:

```ts
if (s.referenceBand) { vals.push(s.referenceBand.low, s.referenceBand.high); }
```

so it sets the chart's y-scale as well.

### The live item

`banks/vitals-canonical.json` → `vit_08`, an antipyretic-response item. Stem: *"A pediatric client is
admitted with a high fever."* The visual carries `population: "peds_child"`, `tempUnit: "C"`, series
`temp` 39.5 → 38.8 → 37.9 → 37.2 and `hr` 145 → 130 → 115 → 100, and sets `showReferenceBand` on
neither series.

The bundled build therefore renders a shaded band labeled normal at **HR 60–100 on a pediatric client**,
and scales the chart to that band.

The author declared the intended band population **twice** — `visual.population` and
`meta.reference_bands: "peds_child"` — and the renderer consumed neither. That is as clear a statement
of authorial intent as this repo produces.

**No gate could have caught this.** `validate-bank` passes. `selfCheck` passes — it asserts trend
direction, not bands. Visual parity passes, because deterministically wrong output is still
deterministic. Determinism buys reproducibility, not truth. This was found by reading.

## 2. What is *not* wrong

`vit_08`'s keyed answer (`A` — therapy effective, temperature and heart rate normalizing) holds under
any band. Both series descend monotonically; the three distractors stay wrong under adult or pediatric
reference ranges alike.

So this is a **rendering** defect, not a content defect. There is no answer-key migration, no clinical
re-review of the item, and no bank edit. Contain the render.

## 3. Why this patch does not build a pediatric band table

`peds_child` spans roughly one to twelve years. Normal heart rate for a one-year-old (~98–140) and for a
ten-year-old (~70–110) barely overlap, and `vit_08`'s stem states no age. **A correct pediatric band is
not computable from a three-value population enum.**

Drawing no band is honest. Drawing an adult band is a false clinical claim. Drawing an invented
pediatric band is a false clinical claim made with more confidence. Recall also that every `refBand` in
the registry is an unverified placeholder — `VITAL_DEFS.normal` is hardcoded adult and equally unsourced
— and that band *consumption* is owned by `lab-reference-range-verification-spec.md`, not by this patch.

**Finding routed to that lane:** any future pediatric banding requires an **age or age band carried on
the visual**, not a population enum. Record it there before the lane designs a band table.

## 4. The change

### 4a. Renderer — suppress the band outside the adult population

In `renderVitalsTrendSvg`, the band is drawn only when the population is adult *and* the series has not
opted out:

```ts
const population = spec.population === undefined ? "adult" : spec.population;
// ...
referenceBand:
  population === "adult" && s.showReferenceBand !== false
    ? def.normal(spec.tempUnit)
    : undefined,
```

Absent (`undefined`) `population` behaves as `"adult"`, so **every existing adult item renders
byte-identically.** `null`, typos, and garbage suppress the band; only the literal `"adult"` enables it.

This is abstention, not silent auto-correction. Nothing is invented and no value is repaired; the
renderer declines to assert a normal range it cannot support, and in doing so honors the author's
declaration rather than overriding it. Principle 3 exists to stop silent *wrongness*, not a silent
refusal to claim.

**No carve-out for `temp`,** even though 36.5–37.5 °C is roughly population-invariant. The blanket rule
is one condition; the exception is a maintenance liability, and `temp` is separately implicated in the
Fahrenheit-sourced-renders-as-Celsius defect. One rule, no exceptions.

### 4b. Validation — FAIL when an author explicitly demands the missing capability

Add to `validateVitalsTrend`:

> If `population` is present and is not `"adult"`, and any series sets `showReferenceBand: true`
> **explicitly**, the visual FAILs.

- Error code: `reference_band_population_unsupported`
- Path: `series[i].showReferenceBand`
- Message: `reference bands are only available for population "adult"; omit showReferenceBand or set it to false`

An author writing `showReferenceBand: true` on a pediatric visual is demanding a capability that does not
exist, and that must fail loudly. An author who omits the flag gets suppression — which is why `vit_08`
does **not** fail, and why no canonical edit, `--allow-canonical` invocation, or ledger entry is needed.

`population` remains structurally unvalidated at runtime; do not add an enum check here. The **runtime
vocabulary** — not merely a TypeScript union, which erases and is precisely why `vitals_trend` accepts
arbitrary JSON strings today — is being centralized in the Schema 2.0 Phase 1 pass (Amendment 0A, R10). A
second definition in this patch is the drift we are closing.

The suppression guard is safe against that gap in the meantime: any value other than `"adult"`, including
a typo or garbage, suppresses the band. It fails toward not-claiming.

### 4c. Fixtures

Add to `vitalsTrendModule.fixtures`:

- **valid** — `population: "peds_child"`, one `hr` series, `showReferenceBand` omitted. Renders; no band.
- **valid** — `population: "peds_infant"`, one `hr` series, `showReferenceBand: false`. Renders; no band.
- **valid** — `population: null`, one `hr` series, `showReferenceBand` omitted. Renders; no band. Phase 1
  flips this fixture to invalid when the shared runtime vocabulary lands.
- **invalid** — `population: "peds_child"`, one `hr` series with `showReferenceBand: true`.
  `expectCode: "reference_band_population_unsupported"`.

Add a renderer assertion, wherever the existing per-kind render tests live, that an adult spec and a
`peds_child` spec with identical series produce **different** SVG, and that the adult output is unchanged
from before the patch.

## 5. Expected diff surface — and the gate that does not exist

**Correction (2026-07-10, implementer objection sustained).** An earlier draft of this spec instructed
you to "update the parity/determinism hash for `vit_08`" and to stop if "any adult item's hash moves."
**No such hashes exist.** `scripts/tests/__snapshots__/visual-parity.json` stores exactly three
`svgHash` entries — `rhy_sinus_brady_001`, `rhy_vtach_001`, `rhy_afib_001` — captured as the U0
pre-refactor baseline for the inline rhythm-strip implementation. `scripts/tests/vitals-trend.ts` proves
determinism by rendering the same fixture twice. Neither can observe a promoted `vitals_trend` SVG.

So the invariant is verified by an **ad-hoc before/after sweep**, run by you, reported to the architect:

> Before editing, compute SHA-256 over the rendered SVG of every promoted `vitals_trend` visual. After
> editing, repeat the sweep. **Assert that the set of changed IDs is exactly**
> `banks/vitals-canonical.json :: vit_08`. There is no stored `vit_08` snapshot to update, and none is
> minted by this patch.

If any other ID appears in the changed set, **stop and report** — the guard is wrong. If `vit_08` does
*not* appear, stop and report — the suppression did not take.

What changes for `vit_08`: the band disappears, and the y-scale recomputes without the band's `low`/`high`
in the bounds calculation. That is the artifact of a false claim being withdrawn, and it must be visible
in review rather than absorbed silently. The sweep is what makes it visible.

The focused adult-versus-pediatric renderer assertion in §4c stays — it is a useful unit test — but it
cannot prove the promoted surface stayed unchanged, and this spec does not pretend it can.

**Do not mint a promoted-surface parity baseline as a ride-along.** That the committed baseline covers 3
visuals against ~196 promoted ones is a real finding, and a real gate change: it needs its own pass, its
own scope, and its own review. Recorded as an open thread; not this patch.

`selfCheckVitalsTrend` has been confirmed to make no reference-band assertion. Nothing to check there.

## 6. Out of scope

- **`lab_trend`.** Confirmed by the implementer sweep: bands default on, the renderer *does* select
  non-adult bands when a non-adult population is authored, and **no promoted `lab_trend` item uses a
  non-adult population** — all 20 render adult placeholder bands. So `lab_trend` is latent where
  `vitals_trend` was live. The asymmetry (vitals suppresses; labs would draw unverified pediatric
  numbers) is real and belongs to `lab-reference-range-verification-spec.md`. **Do not change it here.**
- **`meta.reference_bands`.** Authoring metadata with no type, no validation, and no consumer. Reserved
  for the reference-range lane. No new use; not typed in Schema 2.0.
- **`burn_map.population`** (`adult | pediatric`). A deliberate divergence — the geometry has two region
  tables, not three. Do not harmonize.
- **The `temp` Fahrenheit/Celsius display defect.** Separate open thread.
- **Building any reference-range table.** Owned by the reference-range lane, and blocked on the age
  finding in §3.

## 7. Verification (renderer class)

```sh
npx tsc -b --pretty false
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run census:check
npm run build
```

Plus the §5 before/after SHA-256 sweep over every promoted `vitals_trend` SVG, with the changed-ID set
reported to the architect.

Plus a visual audit of the re-rendered `vit_08` artifact: confirm no band, confirm both series still
descend monotonically, confirm the caption and axes are intact, and confirm the item remains answerable
— the visual is load-bearing (principle 6) and must still carry the trend the stem asks the learner to
evaluate.

## 8. Gates

Per `DECISIONS.md` principle 2 extension: **Codex does not merge or push `main`.** Spec conformance is
verified by the architect seat, which authored this document. This patch touches no bank and no
question content, so no content-review seat is required.

Land this **before the next `pages.yml` deploy.** It does not block Schema 2.0 Phase 0B — different code,
no dependency — but a false clinical claim rendered into an assessed stimulus in a licensure prep app
outranks version infrastructure, and the fix is small enough that ordering it first costs nothing.
