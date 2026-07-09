# U11 · `io_trend` Renderer Spec

**Type:** renderer (code) + new primitive + later content lane.
**Depends on:** U2 (`lineChart` — for the cumulative overlay's axis math patterns), U4 (`renderDocTable` — the value table), `graphPaper.ts` (`fmt`, `fmtNum`, `roundTo`).
**Introduces:** `primitives/divergingBars.ts` — a new shared primitive, built inside its first consumer per the established pattern (`lineChart`→U2, `renderDocTable`→U4, `renderFieldPanel`→U6).
**Schema:** bumps `schemaVersion` to **`1.9`**. `io_trend` requires `1.9`.
**Status:** specced 2026-07-09. Not implemented.

Read `AGENTS.md`, `DECISIONS.md` (principles 6, 11, 25), and `NCLEX-Question-Schema.md` first; on any conflict they win. This spec adds the twelfth visual kind, **`io_trend`** — serial intake & output over ≥3 charted intervals.

---

## 1. Purpose, and why this is not `io_record`

`io_record` (U5) is a **single-period snapshot**: a flat `intake[]` + `output[]` for one `periodLabel`, yielding one intake total, one output total, one net balance. It carries **no time axis**. It is therefore structurally incapable of expressing any time-dependent I/O clinical frame — the pattern that a nurse actually reads off a flowsheet across a shift or a resuscitation.

`io_trend` is that missing capability. It renders per-interval gross intake and output over ≥3 charted intervals, with a derived per-interval net and a derived cumulative net.

The two kinds are **disjoint by construction and must stay so**:

| | `io_record` | `io_trend` |
|---|---|---|
| Time | none (one period) | ≥3 intervals |
| Entries | itemized sources (`PO water`, `Foley urine`) | gross interval totals only |
| Task | **sum** heterogeneous sources; derive one net | **read the pattern** of the totals over time |
| Item types | includes `fill_in_blank` | **excludes `fill_in_blank`** (see §3) |

Do not add itemized sources to `io_trend`; that is `io_record`'s job and would make the kinds overlap. Do not add a time axis to `io_record`.

### 1.1 The necessity gate (DECISIONS principle 25, fence 1)

> **An `io_trend` item is valid iff collapsing the series to a single net balance changes the answer.**

If any single-timepoint tally, or the final cumulative net alone, resolves the item, it is an `io_record` item and must be rejected at review. This gate is **strict and unwaived**. `meta.collapse_test` (§6) forces the author to write down the *counterfactual answer under collapse*; `selfCheck` asserts the field is present, and stage-4 human review asserts that the counterfactual is genuinely different from the keyed answer.

### 1.2 The additive-element waiver (DECISIONS principle 25)

The rendered artifact is a **composite: diverging bar chart over a value table.** The table is value-complete — every interval's intake, output, net, and cumulative net appears exactly. The chart is therefore an *informational subset* of the table and is, element-wise, redundant.

This is permitted under principle 25: the chart is an **additive reading affordance** (direction, divergence, crossover) over a value-complete artifact. It is **not** permitted on grounds of Epic-familiarity; vendor ubiquity is explicitly not a qualifying criterion. Familiarity is a side effect.

The waiver relaxes *chart-vs-table*. It relaxes nothing else. §1.1 still binds.

### 1.3 Bars, not lines — and this is a real distinction, not a style choice

Intake and output are **interval quantities** (a volume accumulated across a period), not instantaneous measurements. `vitals_trend` and `lab_trend` plot points sampled at instants, so a polyline between them is meaningful. Interpolating between two interval volumes is *not* meaningful — there is no "intake at 10:37."

Therefore: the x-axis is a sequence of **categorical bins**, and each bin gets a paired bar (intake above the zero baseline, output below). The only series that is legitimately a line is the **cumulative net**, which is a genuine running quantity defined at each bin boundary.

---

## 2. Files

```
src/visuals/primitives/divergingBars.ts   # NEW shared primitive
src/visuals/kinds/io_trend/
  index.ts                                # validate / selfCheck / renderSvg / fixtures + registerVisual(...)
  types.ts                                # IoTrendInterval, IoTrendSpec
```

Reuse `primitives/table.ts` (`renderDocTable`), `primitives/graphPaper.ts` (`fmt`), `primitives/escapeXml.ts`.

Append-only shared lines:
- `src/visuals/types.ts`: `import type { IoTrendSpec } from "./kinds/io_trend/types";` and `export type QuestionVisual = … | IoTrendSpec;`
- `src/visuals/kinds/index.ts`: `import "./io_trend";`

Minimal, unavoidable edits (a new schema version cannot be registry-driven):
- `src/schema.ts`: add `"1.9"` to the accepted `schemaVersion` set. Nothing else. `requiredSchemaVersion: "1.9"` on the module handles the floor.
- `lib/canonical-routing.ts`: add `CANONICAL_PREFIXES` row `iotrend-` → `iotrend-canonical.json`. (`io-` already routes to `io-canonical.json`, the U5 set; do not reuse it.)

Do **not** touch `src/App.tsx`, `scripts/validate-bank.ts`, `scripts/coverage-report.ts`, `scripts/census.ts` unless a failing test demonstrates a required change.

---

## 3. Placement

```md
allowedItemTypes:
[
  "multiple_choice",
  "select_all",
  "matrix"
]
```

**`fill_in_blank` is deliberately excluded.** This is principle 25's second fence made mechanical rather than prose: the value table makes "what was the net balance at 1200?" *renderable*, and a numeric blank is exactly the affordance that would invite it. Such an item is `io_record`'s (which does allow `fill_in_blank`), and authoring it on `io_trend` would prove the kind redundant. The registry refuses the placement, so the fence cannot be crossed by an inattentive generation lane.

Item briefs on this kind are **pattern-only**: direction, divergence, crossover, response-to-intervention.

---

## 4. Spec type (`kinds/io_trend/types.ts`)

```ts
export interface IoTrendInterval {
  /** Gross intake for this interval, whole mL. Integer >= 0. */
  intakeMl: number;
  /** Gross output for this interval, whole mL. Integer >= 0. */
  outputMl: number;
}

export interface IoTrendSpec {
  kind: "io_trend";
  time: {
    /** "hr" = interval END time in hours; "shift" = shift ordinal. */
    unit: "hr" | "shift";
    /** Strictly increasing. Length === intervals.length. Minimum length 3. */
    values: number[];
    /** Optional per-bin display label, e.g. "0700–1500". Length must match values. */
    labels?: { en: string; zh?: string }[];
  };
  /** One entry per bin, aligned to time.values by index. */
  intervals: IoTrendInterval[];
  /** Overlay the derived cumulative-net line. Default false. */
  showCumulativeNet?: boolean;
  /** Display-only label for the charted span. No arithmetic. */
  periodLabel?: { en: string; zh?: string };
  caption?: { en: string; zh?: string };
}
```

Design notes:

- **No net fields, no cumulative fields, no totals — anywhere on the spec.** Exactly as U5: the renderer and `selfCheck` both *derive* `net[i] = intakeMl[i] − outputMl[i]` and `cum[i] = Σ net[0..i]`. A derived value that never exists as data can never drift from its inputs. This is the cleanest expression of principle 11's "never hand-key a total."
- **Integers, so equality is exact.** No epsilon, no `roundTo`. Charted volumes are whole mL.
- **`>= 0`, not `> 0`.** Unlike `io_record`'s per-entry rule, a zero is clinically meaningful here (anuria; an interval with no oral intake). Zero must be representable.
- **Gross totals only.** No itemized sources (§1). If an item needs to know *what* the intake was, it is an `io_record` item.
- **`unit: "shift"`** exists because I/O is very often charted per shift, and forcing shift data onto an hour axis produces misleading bar spacing.

---

## 5. `validate(spec): VisualError[]`

Defensive style throughout — never throw; guard every access. Mirror `validateVitalsTrend` / `validateIoRecord`.

| Check | `code` |
|---|---|
| `kind === "io_trend"` | `invalid_kind` |
| `time` is an object with `values` array | `time_invalid` |
| `time.unit` is `"hr"` or `"shift"` | `invalid_time_unit` |
| each `time.values[i]` is a finite number | `timepoint_not_number` |
| `time.values` strictly increasing | `timepoints_not_increasing` |
| `time.values.length >= 3` | `too_few_timepoints` |
| `intervals` is an array | `intervals_invalid` |
| `intervals.length === time.values.length` | `intervals_length_mismatch` |
| each `intakeMl` / `outputMl` is a finite integer `>= 0` | `invalid_volume` |
| each `intakeMl` / `outputMl` `<= MAX_INTERVAL_ML` | `volume_out_of_range` |
| at least one interval has `intakeMl + outputMl > 0` | `no_volumes` |
| `time.labels` (if present) length matches `time.values` | `time_labels_length_mismatch` |
| each label: `en` non-empty; `zh` non-empty if present | `time_label_en_required` / `time_label_zh_empty` |
| `showCumulativeNet` boolean if present | `invalid_show_cumulative_net` |
| `periodLabel` en required / zh non-empty if present | `period_label_en_required` / `period_label_zh_empty` |
| `caption` en required / zh non-empty if present | `caption_en_required` / `caption_zh_empty` |

`MAX_INTERVAL_ML = 10_000` — a **sanity bound, not a clinical claim** (mirrors U5's `MAX_ENTRY_ML`). It catches a misplaced digit. Widen it if a legitimate interval volume trips it during the content lane.

`too_few_timepoints` at `< 3` is the structural expression of §1.1: two bins cannot show a trend, only a change.

---

## 6. Question-level `meta` + `selfCheck(spec, question)`

`io_trend` uses the canonical question-level `meta` block (§6.1 of `NCLEX-Question-Schema.md`) and adds three kind-specific fields.

```jsonc
"meta": {
  // --- inherited canonical shape ---
  "visual_justification": "REQUIRED non-empty — what the learner must read from the trend that the stem does not state.",
  "tier": "standard",
  "source": "string",
  "skill_signature": "io_trend:diuresis/expected-response",
  "stem_disambiguators": ["intake and output", "trend"],

  // --- io_trend-specific ---

  // REQUIRED. Principle 25, fence 1. The counterfactual answer if the learner
  // saw ONLY the final cumulative net. Must differ from the keyed answer.
  // selfCheck asserts presence; human review asserts the difference is real.
  "collapse_test": "Final cumulative net is −300 mL. Shown that number alone, a learner keys 'hypovolemia — give fluids.' The keyed answer is 'continue to monitor' and turns on output rising while intake is steady (expected diuretic response).",

  // OPTIONAL, arithmetic-gated. Any present key is recomputed and must match exactly.
  "derived_values_keyed": {
    "net_by_interval_ml": [150, 30, -200, -280],
    "cumulative_net_ml": [150, 180, -20, -300],
    "final_cumulative_net_ml": -300
  },

  // OPTIONAL, machine-checked trend assertions. series ∈
  //   "intake" | "output" | "net" | "cumulative_net"
  // window is [startTimeValue, endTimeValue], both from time.values.
  "expected_trend": [
    { "series": "output", "direction": "up",   "window": [4, 16] },
    { "series": "net",    "direction": "down", "window": [4, 16] }
  ],

  // OPTIONAL. Asserts a sign change in the named series at bin `index`
  // (0-based): series[index-1] and series[index] have opposite signs.
  "crossover": { "series": "net", "index": 2, "from": "positive", "to": "negative" }
}
```

`selfCheck` responsibilities (never throws; returns `[]` on malformed spec, mirroring `selfCheckIoRecord`):

1. **Necessity — justification.** `visual_justification` present/non-empty → else `self_check_missing_justification`.
2. **Necessity — collapse test.** `collapse_test` present/non-empty → else `self_check_missing_collapse_test`. *This is the machine half of fence 1; the semantic half is human review.*
3. **Structural — trend floor.** `intervals.length >= 3` → else `self_check_too_few_timepoints`.
4. **Arithmetic gate (principle 11).** Recompute:
   - `net[i] = intervals[i].intakeMl − intervals[i].outputMl`
   - `cum[i] = cum[i-1] + net[i]`, `cum[0] = net[0]`
   - `final = cum[last]`
   For each key **present** in `derived_values_keyed`, assert exact integer equality (element-wise for the arrays; length must match too). Mismatch → `self_check_net_mismatch` / `self_check_cumulative_mismatch` / `self_check_final_mismatch`. Array length mismatch → `self_check_keyed_length_mismatch`. **A mismatch is a build failure, not a content note.**
5. **Trend assertions.** For each `expected_trend` entry, resolve the named series (derived for `net`/`cumulative_net`), map `window` to indices via `time.values.indexOf`, skip silently on unresolvable window (mirrors `selfCheckVitalsTrend`), else compare endpoint values: `"up"` requires `end > start`, `"down"` requires `end < start` → else `self_check_trend_failed`.
6. **Crossover assertion.** If present: `index` in `[1, len-1]`; the named series must satisfy `sign(series[index-1]) === from` and `sign(series[index]) === to`, with `from !== to` → else `self_check_crossover_failed`. Zero counts as neither positive nor negative and fails the assertion (state it explicitly rather than picking a convention).
7. **Internal consistency echo.** Re-assert each volume is a finite non-negative integer → `self_check_invalid_volume`. If any fire, return early before arithmetic (mirrors U5).

Conformance-harness behavior: `selfCheck({} as IoTrendSpec, {} as Question)` returns `[]` and never throws.

Promotion-gate behavior: when `question.meta` exists, `visual_justification` and `collapse_test` become mandatory. `derived_values_keyed` is **not** mandatory here (unlike U5) — an `io_trend` item's answer legitimately turns on a *shape*, not a number, so requiring a keyed scalar would push authors toward exactly the exact-value items §3 forbids. When it is present, it is gated exactly.

`selfCheck` does **not** judge clinical interpretation (whether a −300 mL net means expected diuresis or dehydration — that is the whole point of the matched pair in §11). Stage-4 human review owns it.

---

## 7. The `divergingBars` primitive (`primitives/divergingBars.ts`)

New shared primitive. Keep it general (it is a bar chart around a zero baseline), keep it free of I/O vocabulary, and keep it pure.

```ts
export interface DivergingBarBin {
  /** x-axis category label, already display-ready. */
  label: string;
  /** Bar extent above the baseline. >= 0. */
  positive: number;
  /** Bar extent below the baseline. >= 0 (magnitude, not a negative number). */
  negative: number;
}

export interface OverlayLinePoint { binIndex: number; value: number; }

export interface DivergingBarsInput {
  bins: DivergingBarBin[];
  positiveLabel: string;          // legend, e.g. "Intake"
  negativeLabel: string;          // legend, e.g. "Output"
  yAxisLabel: string;             // e.g. "Volume (mL)"
  /** Optional right-axis line drawn across bin centers (the cumulative net). */
  overlay?: {
    label: string;
    points: OverlayLinePoint[];
    axisLabel: string;
  };
  width?: number;                 // default 600
  height?: number;                // default 260
}

export function renderDivergingBars(input: DivergingBarsInput): string;
```

Rules:

- **Pure and deterministic.** No DOM, no `Date`, no `Math.random`, no fetch. Identical input → byte-identical SVG.
- Import `fmt` / `fmtNum` / `roundTo` from `graphPaper.ts`. **Never redefine them** (`DECISIONS.md` principle 11 / the single-definition invariant).
- Zero baseline is drawn as a distinct rule. Positive bars extend up, negative bars extend down as **magnitudes** — the caller passes `outputMl` as a positive number in `negative`, and the primitive handles the sign. Do not make callers pass negatives.
- Y-axis ticks are symmetric about zero, computed from `max(maxPositive, maxNegative)` rounded up to a clean step.
- Bar text: **no value labels on the bars.** The table beneath carries the exact values (§8); labelling the bars would duplicate it and make the chart pretend to be the value-complete layer.
- **No clinical editorializing in styling.** Intake and output get two neutral, distinguishable roles from the existing palette (suggest `blue` / `slate` per `lineChart`'s `colorForRole`). The overlay line is `primary`. **No red/amber "danger" fill on any bar or on the cumulative line** — a color that asserts overload or deficit states the answer. (Mirrors U5's "the net-balance row is bold but carries no flag color" and `mar`'s "the render must not state the answer.")
- `escapeXml` every caller-supplied string.

---

## 8. `renderSvg(spec): string` — the composite

A single SVG containing, stacked vertically:

1. **The diverging bar chart** via `renderDivergingBars`, one bin per interval.
   - `label` = `time.labels[i].en` if present, else `` `${fmt(time.values[i])}${unit === "hr" ? " hr" : ""}` `` (for `"shift"`, `` `Shift ${fmt(v)}` ``).
   - `positive` = `intakeMl`, `negative` = `outputMl`.
   - `overlay` present iff `showCumulativeNet === true`, carrying the derived cumulative net.
2. **The value table** via `renderDocTable`, directly beneath, sharing the SVG's coordinate space.
   - Columns: `[{ key: "period", label: "", widthFr: 2, align: "left" }, { key: "in", label: "Intake (mL)", widthFr: 1.2, align: "right" }, { key: "out", label: "Output (mL)", widthFr: 1.2, align: "right" }, { key: "net", label: "Net (mL)", widthFr: 1.2, align: "right" }, { key: "cum", label: "Cumulative (mL)", widthFr: 1.4, align: "right" }]`
   - One row per interval. A final bold row: period `"Total"`, `in` = Σ intake, `out` = Σ output, `net` = `signed(final)`, `cum` = `signed(final)`.
   - **Rows are timepoints, columns are quantities** — not the transpose. This keeps width bounded as intervals grow and preserves split-pane eligibility (§12).
   - `signed(n)` renders `+n` for `n >= 0`, `−|n|` (U+2212) otherwise, exactly as U5.
   - The `net` and `cum` cells carry **no flag color**, for the reason in §7.

Wrapper: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 <h>" role="img" aria-label="<escaped>" data-kind="io_trend"> … </svg>` where `<h>` is derived deterministically as `chartHeight + tableHeight` (`renderDocTable`'s existing height math: title + header + rowCount·rowHeight, `rowCount = intervals.length + 1`), and `aria-label` = escaped `caption.en` ?? `periodLabel.en` ?? `"Intake and Output Trend"`.

Title = `periodLabel?.en ?? "Intake & Output Trend"`.

**Caption rule:** `caption` / `periodLabel` / `time.labels` must never reveal the answer. Do not caption a trend "Fluid volume overload" or label a bin "diuresis begins."

---

## 9. Fixtures

`valid` (≥2, drawn from §11 so the fixtures and the proof batch cannot drift apart):

1. **Diuresis with crossover** (`showCumulativeNet: true`, full labels, en+zh caption): `time.unit "hr"`, `values [4,8,12,16]`; intervals `(300,150) (250,220) (200,400) (200,480)`. Derived net `[150, 30, −200, −280]`; cumulative `[150, 180, −20, −300]`.
2. **Serial negative, no crossover** (minimal — no caption, no labels, no overlay): `values [8,16,24]`; intervals `(250,300) (200,280) (150,250)`. Derived net `[−50, −80, −100]`; cumulative `[−50, −130, −230]`.

`invalid` (assert each `code`): `too_few_timepoints` (2 intervals); `intervals_length_mismatch` (3 times, 2 intervals); `timepoints_not_increasing`; `invalid_volume` (negative or non-integer `outputMl`); `volume_out_of_range` (`intakeMl: 50_000`); `no_volumes` (all zeros); `invalid_kind` (`kind: "io_record"`); `time_invalid` (`time: null`); `invalid_time_unit` (`unit: "min"`); `time_labels_length_mismatch`; `caption_en_required` (`caption: { en: "" }`); `caption_zh_empty`; `period_label_en_required`; `period_label_zh_empty`.

The conformance harness runs these automatically (valid → 0 validate errors, well-formed `<svg>…</svg>`, no `NaN`/`undefined`, deterministic ×2, `selfCheck` no-throw).

---

## 10. Tests

- **Conformance (automatic):** fixtures + determinism across all kinds (`visuals-conformance.ts`).
- **Primitive** (`scripts/tests/diverging-bars.ts`): determinism ×2; symmetric zero-baseline tick math; a bin with `negative: 0` renders no downward bar; overlay omitted when absent; `escapeXml` applied to labels.
- **Kind-specific** (`scripts/tests/io-trend.ts`, registered in `test-visuals`):
  - representative validation codes (`too_few_timepoints`, `intervals_length_mismatch`, `invalid_volume`, `no_volumes`, `invalid_time_unit`);
  - render determinism ×2;
  - **arithmetic `selfCheck`**: fixture 1 keyed with the correct `net_by_interval_ml` / `cumulative_net_ml` / `final_cumulative_net_ml` → 0 errors; a planted wrong `final_cumulative_net_ml: 999` → `self_check_final_mismatch`; a keyed array of wrong length → `self_check_keyed_length_mismatch`;
  - **trend assertion**: `{ series: "output", direction: "up", window: [4,16] }` on fixture 1 → 0 errors; `direction: "down"` → `self_check_trend_failed`;
  - **crossover assertion**: `{ series: "net", index: 2, from: "positive", to: "negative" }` on fixture 1 → 0 errors; `index: 1` → `self_check_crossover_failed`;
  - **fence checks**: `meta` with `visual_justification` but no `collapse_test` → `self_check_missing_collapse_test`; and a registry assertion that `allowedItemTypes` does **not** include `fill_in_blank` (this is the machine-enforced fence — a test, not a comment);
  - `selfCheck({} as IoTrendSpec, {})` → no throw, `[]`.
- **Parity:** update parity snapshots if the repo expects checked-in visual hashes.

---

## 11. Proof batch (before the content lane opens)

Four items, one per accepted clinical frame. The renderer ships complete (chart + table) *before* these are authored; these validate the render and, more importantly, the collapse gate.

**The matched pair is the point.** Frames 2 and 4 are constructed to share an **identical final cumulative net of −300 mL** while keying **opposite actions**. If a single net balance could resolve an `io_trend` item, these two items would have the same answer. They do not. This pair is the executable proof of §1.1, and it is why frame 4 — initially scoped as a marginal supporting example — is load-bearing.

| # | Frame | `time.unit`, values | intervals (intake, output) | derived net | cumulative | keyed direction |
|---|---|---|---|---|---|---|
| 1 | HF / CKD overload | hr, `[4,8,12,16]` | `(500,450) (500,380) (500,300) (500,220)` | `50,120,200,280` | `50,170,370,650` | rising positive balance **with falling UO** → overload risk; act |
| 2 | Post-loop-diuretic diuresis | hr, `[4,8,12,16]` | `(300,150) (250,220) (200,400) (200,480)` | `150,30,−200,−280` | `150,180,−20,**−300**` | expected response → **continue to monitor** |
| 3 | Prerenal AKI fluid challenge | hr, `[4,8,12,16]` | `(300,200) (700,180) (900,120) (900,100)` | `100,520,780,800` | `100,620,1400,2200` | escalating intake, **UO does not respond** → notify; failed challenge |
| 4 | Bowel prep / gastroenteritis | hr, `[8,16,24,32]` | `(250,300) (200,280) (150,250) (150,220)` | `−50,−80,−100,−70` | `−50,−130,−230,**−300**` | falling intake against ongoing losses → **dehydration; intervene** |

Authoring constraints:

- **Closed-world stems (principle 12).** Where the answer turns on a threshold (a UO target, a hold parameter), state the governing order or unit protocol *inside the stem*. Never rely on an external guideline value.
- **The stem must not state the trend.** "Urine output has been declining" hands over the visual's job. The stem gives the clinical context; the chart gives the pattern.
- **Frame 3 is the weakest collapse case** and must be reviewed with that in mind: its final net (+2200) is dramatic enough that a naive collapse answer ("overload → diurese") may be reachable. It is admissible precisely because that collapse answer is *wrong* — the keyed answer is escalation for a failed fluid challenge — but review must confirm the two genuinely diverge rather than converging on "notify the provider" from both directions.
- **No `fill_in_blank`.** The registry will refuse it (§3); do not attempt to route around it with a numeric `matrix`.
- `meta.collapse_test` on every item, written as the counterfactual answer, not as a restatement of the justification.

Frames explicitly **out of scope** (ratified 2026-07-09):
- **DI / SIADH — rejected.** The diagnostic pivot is serum Na and serum/urine osmolality, not the I/O pattern. An item answerable from the labs makes the trend decorative (principle 6).
- **Burn resuscitation UO — rerouted.** A single-series urine-output rate trend against a target is `vitals_trend`-shaped, not a two-sided diverging bar; `burn_map` already owns Parkland. Fold it in here and the kind loses its identity.

---

## 12. Split eligibility

**Deferred to the proof render** (`DECISIONS.md` principle 23 is by visual *geometry*, and this is a net-new composite geometry — measure it, don't predict it). Precedent: the `structuredMeasurements` density cap was likewise deferred to a real render (instrument-before-building).

Expectation, to be confirmed or falsified: the chart is squarish (600×260) and the table is narrow-columned, so the composite should join the standalone split allowlist alongside `io_record`. The risk is total *height*, not width — a 6-interval item stacks a 260px chart on a ~7-row table. If the composite exceeds the pane, the fix is a **density cap on interval count for split-eligible items**, not a full-width exclusion.

Record the ruling in `DECISIONS.md` principle 23's allowlist once measured.

---

## 13. Error codes

Validation:

```text
invalid_kind
time_invalid
invalid_time_unit
timepoint_not_number
timepoints_not_increasing
too_few_timepoints
intervals_invalid
intervals_length_mismatch
invalid_volume
volume_out_of_range
no_volumes
time_labels_length_mismatch
time_label_en_required
time_label_zh_empty
invalid_show_cumulative_net
period_label_en_required
period_label_zh_empty
caption_en_required
caption_zh_empty
```

Self-check:

```text
self_check_missing_justification
self_check_missing_collapse_test
self_check_too_few_timepoints
self_check_invalid_volume
self_check_net_mismatch
self_check_cumulative_mismatch
self_check_final_mismatch
self_check_keyed_length_mismatch
self_check_trend_failed
self_check_crossover_failed
```

---

## 14. Canonical render sketch

```text
                Intake & Output — 16 h
   mL
  500 ┤  █
      ┤  █     █
    0 ┼──█─────█─────▄─────▄──────────  (zero baseline)
      ┤  ▓     ▓     █     █
 -500 ┤
        4 hr  8 hr  12hr  16hr
        █ Intake   ▓ Output   ── Cumulative net

  Period    Intake   Output    Net   Cumulative
  4 hr         300      150   +150         +150
  8 hr         250      220    +30         +180
  12 hr        200      400   −200          −20
  16 hr        200      480   −280         −300
  Total        950     1250   −300         −300
```

The bars show that output overtakes intake at the third bin. The table says by exactly how much. Neither is redundant with the *item* — but the chart is redundant with the *table*, and that is permitted, once, by principle 25.

---

## 15. Acceptance / verification

```sh
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run census
npm run census:check
npm run build
```

All green. Then:

- `NCLEX-Question-Schema.md` gains: `"1.9"` in the accepted-version list and the envelope example; an `io_trend` row in the visual-kind taxonomy table; an `io_trend` per-kind subsection (§4–§6 of this spec) referencing the shared §6.1 `meta` contract and documenting `collapse_test` + `derived_values_keyed`; a validation-rules bullet (`io_trend` present below `"1.9"`; `fill_in_blank` placement rejected); and a migration note (`1.8`→`1.9` requires no content changes — only banks carrying `io_trend` declare `1.9`).
- `PROJECT-HISTORY.md` gains a U11 milestone.
- `DECISIONS.md` principle 23's split allowlist gains the §12 ruling once measured.

---

## 16. Do not touch

```text
src/App.tsx
scripts/validate-bank.ts
scripts/coverage-report.ts
scripts/census.ts
banks/*.json
```

`src/schema.ts` and `lib/canonical-routing.ts` get the two minimal additions named in §2 and nothing more.

---

## 17. Content lane (after the renderer and proof batch land — separate pass)

- ID prefix `iot_*`, disjoint from `io_*` (U5) and every other kind.
- Raw draft filename prefix `iotrend-` → routes to `banks/iotrend-canonical.json`.
- Pipeline: generate → `banks/banks-raw/` → cross-model review (**the generating model never reviews its own batch**) → source-check → visual audit → human content review → `npm run promote` → `npm run audit` → `npm run consolidate` → ledger entry → delete raw.
- The arithmetic and the trend/crossover assertions are machine-checked by `selfCheck`. Human review therefore concentrates on the three things the machine cannot see:
  1. **Does the item survive the collapse test?** Is `meta.collapse_test`'s counterfactual answer genuinely different from the keyed answer — or is it a restatement?
  2. **Is the trend clinically real?** Are these plausible charted volumes for the stated frame, and is the keyed interpretation right?
  3. **Does the stem leak the pattern?** If the stem says "output has been increasing," the visual is decorative.
- Bilingual parity on `caption`, `periodLabel`, and every `time.labels[i]`.

---

> Implement U11 `io_trend` exactly as specified. Build `divergingBars` as a general primitive inside this consumer; follow the established `io_record` / `vitals_trend` module structure and prefer copying it over inventing new abstractions. The registry, conformance harness, and census integration already exist. Do not perform content generation or promotion work — the proof batch (§11) is a separate pass gated on this renderer landing green.
