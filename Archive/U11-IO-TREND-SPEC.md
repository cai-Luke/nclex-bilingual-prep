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

**Schema-version touch points — `requiredSchemaVersion` alone does NOT enforce the floor.**

Verified against live source 2026-07-09. `validateVisual`'s own docblock says it outright: `schemaVersion` *"is accepted for the registry-mechanics test; production schema-floor enforcement stays at the bank level in `validateBankObject`."* And `validateBankObject` never passes it. Setting `requiredSchemaVersion: "1.9"` on the module is therefore **necessary but not sufficient**, and an earlier draft of this spec was wrong to claim `src/schema.ts` needs a single addition. The complete set:

| File | Change | Why |
|---|---|---|
| `src/types.ts` | add `"1.9"` to the `SchemaVersion` union | `supportedSchemaVersions` is `... satisfies readonly SchemaVersion[]`; without this, TypeScript fails |
| `src/schema.ts` | add `"1.9"` to `supportedSchemaVersions` | drives `schemaOrder` / `cmpSchema` ordering |
| `src/schema.ts` | add the `io_trend` floor to the hard-coded floor block in `validateBankObject`, via the shared traversal of §2.2 | **the only place the floor is actually enforced** |
| `src/schema.ts` | `SCHEMA_VERSION` → `"1.9"` (§2.1 — resolved; zero consumers) | it has tracked the newest schema through every prior bump |
| `src/schema.ts` / `src/bankImport.ts` | one shared `collectAllVisuals(question)` traversal (§2.2) | the floor and the export ladder must not disagree |
| `src/schema.ts` | `collectVisualUnknownKeys`: add `intervals[]` and `binLabels[]` branches | strict unknown-key rejection |
| `src/schema.ts` | `collectQuestionMetaUnknownKeys`: add a `crossover` branch | ditto |
| `src/allowedKeys.ts` | `visualByKind.io_trend`; new `ioTrendInterval` and `crossoverAssertion` sets; `questionMeta` gains `collapse_test` + `crossover` | ditto |
| `src/bankImport.ts` | `toExportEnvelope` gains an `io_trend` rung above `"1.8"` (§2.2) | otherwise exports declare `1.2` and fail our own gate |
| `src/visuals/kinds/io_trend/index.ts` | `requiredSchemaVersion: "1.9"` | registry-contract parity; **never relied on as the production gate** |

Key sets to add in `src/allowedKeys.ts`:

```ts
io_trend: ["periodLabel", "time", "intervals", "binLabels", "showCumulativeNet"],  // under visualByKind
ioTrendInterval: ["intakeMl", "outputMl"],
crossoverAssertion: ["series", "index", "from", "to"],
```

`questionMeta` gains `"collapse_test"` and `"crossover"`. `expectedTrend` already permits a `series` key — **no change needed there**; `io_trend` reuses it with `series ∈ {intake, output, net, cumulative_net}`.

**`visualTime` is NOT modified.** See §4's `binLabels` note for why.

### 2.1 `SCHEMA_VERSION` — resolved: bump to `"1.9"`

`src/schema.ts` exports `SCHEMA_VERSION = "1.8"`. The concern was that a promote/stamp path might write it into `meta.schemaVersion`, in which case bumping it would silently re-declare every canonical bank. Codex's `rg SCHEMA_VERSION` (2026-07-09) found **no consumer beyond its own definition**, so that risk does not materialize.

**Ruling: bump it to `"1.9"`.** An exported constant with zero consumers is a latent trap — whatever imports it next inherits whatever value it holds — and leaving it at `"1.8"` while the current schema is `1.9` makes it actively wrong. It is the documented "current schema version" and must stay true. Include the `rg` output in the PR as the evidence for the zero-consumer claim; do not assert it from memory.

### 2.2 `toExportEnvelope` — this is a blocker, not a follow-up

`toExportEnvelope` is a descending ladder that terminates in `questions.some(hasVisual) → "1.2"`. An `io_trend` question falls straight through to `"1.2"`. The exported bank then declares `1.2` while carrying an `io_trend`, and **`validate-bank` rejects that file** — we would ship an export path that emits artifacts our own Tier-0 gate refuses. That is a broken round-trip, not a fidelity nit, and it is one rung on a ladder you are already editing.

Add `questions.some(hasIoTrend) → "1.9"` as the new top rung.

**`hasIoTrend` is one shared traversal with two consumers — not two copies.** The export ladder in `bankImport.ts` and the production floor in `validateBankObject` must agree, or an `io_trend` used only as an answer-revealed explanation figure declares `1.5` on export *and* slips past the `1.9` floor on validate. Today those two files each keep their **own** copy of the pacer traversal, which is precisely why they drifted (§2.3).

Therefore: define **`collectAllVisuals(question): QuestionVisual[]`** once — exported from `src/schema.ts` (or a small `src/visuals/collect.ts`), imported by `bankImport.ts` — and derive `hasIoTrend` from it in both places. It must cover every slot a visual can occupy:

- `question.visual`
- `question.rationale.visuals[]`
- `caseStudy.exhibits[].visual`
- `caseStudy.stages[].exhibits[].visual`
- `caseStudy.questions[].visual`
- `caseStudy.questions[].rationale.visuals[]`

This is the single-definition discipline (principle 11) applied to traversal rather than arithmetic: one walk, so two gates cannot disagree about where a visual lives.

### 2.3 Pre-existing floor-traversal defect — report, do not fix in this pass

Verified on live source 2026-07-09 while specifying §2.2. `hasPacerRhythmStrip` in **both** `src/schema.ts` and `src/bankImport.ts` traverses `question.visual`, case exhibits, stage exhibits, and embedded questions — but **not `rationale.visuals`**. A pacer-bearing `rhythm_strip` used only as an explanation figure therefore declares `1.5` on export and passes the `1.7` floor on validate, while carrying a `1.7`-only field. The `1.2` visual floor has a narrower version of the same hole (it never inspects `caseStudy.questions[].visual` or `rationale.visuals`).

This is a **latent defect that predates `io_trend`**, in the same family Codex correctly identified. It is **out of scope for U11** and must not be silently repaired here: tightening the pacer floor can newly *reject* an existing bank, which is a content-affecting validation change that needs its own gate and its own review.

What Codex does in this pass: **report only.** Run a read-only check for any bank carrying a pacer `rhythm_strip` inside `rationale.visuals` with `meta.schemaVersion < 1.7`, and state the count (expected: zero). Do not change `hasPacerRhythmStrip`. Building `collectAllVisuals` (§2.2) is what makes the eventual fix a one-line retrofit rather than a third copy.

**No routing change.** `lib/canonical-routing.ts` is **not** edited and `io_trend` does **not** mint a canonical. Per the `DECISIONS.md` canonical-routing invariant, the eight per-kind visual canonicals are historical closed sets frozen at schema `1.2`; every visual kind added after the original roadmap promotes through the `visual-` prefix into the live `visual-canonical.json`. `rhythm_strip`, `fetal_monitoring` (U7), and `injection_site` (U10) all shipped this way — none has a prefix row. `io_trend` follows them. (An earlier draft of this spec proposed an `iotrend-canonical.json`; that was wrong and is corrected here.)

Do **not** touch `src/App.tsx`, `scripts/validate-bank.ts`, `scripts/coverage-report.ts`, `scripts/census.ts`, `lib/canonical-routing.ts` unless a failing test demonstrates a required change.

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
  };
  /** One entry per bin, aligned to time.values by index. */
  intervals: IoTrendInterval[];
  /** Optional per-bin display label, e.g. "0700–1500". Length must match time.values. */
  binLabels?: { en: string; zh?: string }[];
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
- **`binLabels` is a sibling of `time`, deliberately not `time.labels`.** `src/schema.ts`'s `collectVisualUnknownKeys` validates any visual's `time` object against the **shared** `allowedKeySets.visualTime` set, which `vitals_trend` and `lab_trend` also consume. Adding `labels` there to serve one kind would silently permit `time.labels` on those two kinds, where nothing validates or renders it — widening a shared contract for a single consumer, which is the failure mode the single-definition invariant exists to prevent. It is also conceptually wrong: per §1.3 this kind's x-axis is a sequence of **categorical bins**, not the instants `vitals_trend` and `lab_trend` sample. Labelling a bin is not labelling a time axis. `visualTime` stays untouched; `binLabels` lives in `visualByKind.io_trend`.
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
| `binLabels` (if present) length matches `time.values` | `bin_labels_length_mismatch` |
| each bin label: `en` non-empty; `zh` non-empty if present | `bin_label_en_required` / `bin_label_zh_empty` |
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
   - `label` = `binLabels[i].en` if present, else `` `${fmt(time.values[i])}${unit === "hr" ? " hr" : ""}` `` (for `"shift"`, `` `Shift ${fmt(v)}` ``).
   - `positive` = `intakeMl`, `negative` = `outputMl`.
   - `overlay` present iff `showCumulativeNet === true`, carrying the derived cumulative net.
2. **The value table** via `renderDocTable`, directly beneath, sharing the SVG's coordinate space.
   - Columns: `[{ key: "period", label: "", widthFr: 2, align: "left" }, { key: "in", label: "Intake (mL)", widthFr: 1.2, align: "right" }, { key: "out", label: "Output (mL)", widthFr: 1.2, align: "right" }, { key: "net", label: "Net (mL)", widthFr: 1.2, align: "right" }, { key: "cum", label: "Cumulative (mL)", widthFr: 1.4, align: "right" }]`
   - One row per interval. A final bold row: period `"Total"`, `in` = Σ intake, `out` = Σ output, `net` = `signed(final)`, `cum` = `signed(final)`.
   - **Rows are timepoints, columns are quantities** — not the transpose. This keeps width bounded as intervals grow and preserves split-pane eligibility (§12).
   - `signed(n)` renders `+n` for `n >= 0`, `−|n|` (U+2212) otherwise, exactly as U5.
   - The `net` and `cum` cells carry **no flag color**, for the reason in §7.

Wrapper: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 <h>" role="img" aria-label="<escaped>" data-kind="io_trend"> … </svg>`.

**Height is measured, not re-derived — add `measureDocTable`.** `primitives/table.ts` exports `renderDocTable` but **no measurement helper**, so `io_record` currently open-codes the height formula (`titleHeight + headerHeight + rows·rowHeight`) at its call site. A composite needs that number twice — once to offset the table, once for the viewBox — and open-coding it a second time is the same duplicated-arithmetic hazard the single `roundTo` exists to prevent (`DECISIONS.md` principle 11). There is already precedent for the sibling shape: `renderFieldPanel` ships with `measureFieldPanel` (U6).

Therefore:
- Export `measureDocTable(input: DocTableInput): number` from `primitives/table.ts`, returning exactly the height `renderDocTable` produces. `renderDocTable` calls it internally, so the two can never disagree.
- `io_trend` consumes it: table offset = `chartHeight`, `<h>` = `chartHeight + measureDocTable(tableInput)`.
- **Refactor `io_record` to consume it too**, deleting its open-coded formula. This is behavior-preserving, and the proof must be **a hash pinned from the pre-refactor tree**. Note that `scripts/tests/visual-parity.ts` covers **rhythm-strip hashes only** — its snapshot rows are `{id, rhythm, svgHash}`, keyed to bank items — so "the parity snapshot stays green" proves *nothing* about `io_record`. See §10 for the required proof and its commit order.
- `renderDocTable` returns an SVG *fragment* (not a full `<svg>`), so the table is placed with `<g transform="translate(0, ${fmt(chartHeight)})">…</g>`.

`aria-label` = escaped `caption.en` ?? `periodLabel.en` ?? `"Intake and Output Trend"`. Table `rowCount = intervals.length + 1` (per-interval rows plus the bold Total row).

Title = `periodLabel?.en ?? "Intake & Output Trend"`.

**Caption rule:** `caption` / `periodLabel` / `binLabels` must never reveal the answer. Do not caption a trend "Fluid volume overload" or label a bin "diuresis begins."

---

## 9. Fixtures

`valid` (≥2, drawn from §11 so the fixtures and the proof batch cannot drift apart):

1. **Diuresis with crossover** (`showCumulativeNet: true`, full `binLabels`, en+zh caption): `time.unit "hr"`, `values [4,8,12,16]`; intervals `(300,150) (250,220) (200,400) (200,480)`. Derived net `[150, 30, −200, −280]`; cumulative `[150, 180, −20, −300]`.
2. **Serial negative, no crossover** (minimal — no caption, no labels, no overlay): `values [8,16,24]`; intervals `(250,300) (200,280) (150,250)`. Derived net `[−50, −80, −100]`; cumulative `[−50, −130, −230]`.

`invalid` (assert each `code`): `too_few_timepoints` (2 intervals); `intervals_length_mismatch` (3 times, 2 intervals); `timepoints_not_increasing`; `invalid_volume` (negative or non-integer `outputMl`); `volume_out_of_range` (`intakeMl: 50_000`); `no_volumes` (all zeros); `invalid_kind` (`kind: "io_record"`); `time_invalid` (`time: null`); `invalid_time_unit` (`unit: "min"`); `bin_labels_length_mismatch`; `caption_en_required` (`caption: { en: "" }`); `caption_zh_empty`; `period_label_en_required`; `period_label_zh_empty`.

The conformance harness runs these automatically (valid → 0 validate errors, well-formed `<svg>…</svg>`, no `NaN`/`undefined`, deterministic ×2, `selfCheck` no-throw).

---

## 10. Tests

- **Conformance (automatic):** fixtures + determinism across all kinds (`visuals-conformance.ts`).
- **Primitive** (`scripts/tests/diverging-bars.ts`): determinism ×2; symmetric zero-baseline tick math; a bin with `negative: 0` renders no downward bar; overlay omitted when absent; `escapeXml` applied to labels.
- **`measureDocTable` + the `io_record` refactor — the proof is the commit order.** `scripts/tests/visual-parity.ts` hashes **rhythm strips only**, so it cannot witness an `io_record` regression. Required sequence, as two commits:
  1. **On the pre-refactor tree**, compute `sha256(renderIoRecordSvg(fixture))` for both `io_record` fixtures and pin those hashes into `scripts/tests/io-record.ts`. Commit. This commit must pass on the *unmodified* renderer — that is what makes the hash a witness rather than a tautology.
  2. Then add `measureDocTable`, refactor `io_record` onto it, and commit. The pinned hashes must still pass, unchanged.
  A hash captured *after* the refactor proves only that the code equals itself. If the hashes move in step 2, stop: `measureDocTable` does not reproduce the existing formula.
- Also assert `measureDocTable(input)` equals the height `renderDocTable(input)` actually occupies, for an `io_record` input and a 5-column `io_trend` input.
- *Follow-up, explicitly out of U11 scope:* `visual-parity.ts` should eventually hash every kind's fixtures (generalizing its `{id, rhythm, svgHash}` row to a `kind` field), so the next primitive refactor gets this proof for free instead of hand-pinning. Note it; do not build it here.
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
bin_labels_length_mismatch
bin_label_en_required
bin_label_zh_empty
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
lib/canonical-routing.ts
banks/*.json
```

`src/types.ts`, `src/schema.ts`, `src/allowedKeys.ts`, and `src/bankImport.ts` get exactly the changes enumerated in §2 — no more. `src/visuals/primitives/table.ts` gains `measureDocTable` (§8), and `src/visuals/kinds/io_record/index.ts` is refactored to consume it, gated on a byte-identical visual-parity snapshot.

---

## 17. Content lane (after the renderer and proof batch land — separate pass)

- ID prefix `iot_*`, disjoint from `io_*` (U5) and every other kind.
- Raw draft filename prefix **`visual-`** (e.g. `visual-iotrend-2026-07-XX.json`) → routes to the live `banks/visual-canonical.json`. Do **not** create an `iotrend-canonical.json` and do **not** reuse `io-` (U5's closed set). `visual-canonical.json` currently declares schema `1.7`; merging the first `io_trend` items bumps its `meta.schemaVersion` to `1.9`, which `npm run consolidate`'s schema-version guard expects — that bump is the normal, deliberate consequence of a new kind landing, not a workaround.
- Pipeline: generate → `banks/banks-raw/` → cross-model review (**the generating model never reviews its own batch**) → source-check → visual audit → human content review → `npm run promote` → `npm run audit` → `npm run consolidate` → ledger entry → delete raw.
- The arithmetic and the trend/crossover assertions are machine-checked by `selfCheck`. Human review therefore concentrates on the three things the machine cannot see:
  1. **Does the item survive the collapse test?** Is `meta.collapse_test`'s counterfactual answer genuinely different from the keyed answer — or is it a restatement?
  2. **Is the trend clinically real?** Are these plausible charted volumes for the stated frame, and is the keyed interpretation right?
  3. **Does the stem leak the pattern?** If the stem says "output has been increasing," the visual is decorative.
- Bilingual parity on `caption`, `periodLabel`, and every `binLabels[i]`.

---

> Implement U11 `io_trend` exactly as specified. Build `divergingBars` as a general primitive inside this consumer; follow the established `io_record` / `vitals_trend` module structure and prefer copying it over inventing new abstractions. The registry, conformance harness, and census integration already exist. Do not perform content generation or promotion work — the proof batch (§11) is a separate pass gated on this renderer landing green.
