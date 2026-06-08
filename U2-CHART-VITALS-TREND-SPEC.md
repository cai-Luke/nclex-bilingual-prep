# U2 · Chart primitive + `vitals_trend` renderer — implementation spec

**Unit:** U2 (Phase 2, highest ROI / lowest render-risk tier). **Type:** renderer (code).
**Depends on:** U0 (done). **Concurrent-safe with:** U1, then unblocks U3 (`lab_trend`).
**Kind:** `vitals_trend`. **Content ID prefix:** `vit_*`.
**Also delivers:** the reusable **chart primitive** that U3 (`lab_trend`) consumes.

Read `AGENTS.md`, `PROJECT-HISTORY.md`, `NCLEX-Question-Schema.md`, and `VISUAL-STIMULI-ROADMAP.md` first; they win on any conflict. Follow the `rhythm_strip` module for the registry contract, determinism discipline, and theming tokens. This unit has two deliverables: a **primitive** (`src/visuals/primitives/`) built reusably, and its **first consumer** (`vitals_trend`). Build the primitive inside the consumer so it's exercised, but keep its API kind-agnostic so U3 is a small follow-on.

---

## 1. Scope & gating-rule check

A vitals trend chart is load-bearing when the answer turns on a **trend or relationship across time or among series** — sepsis recognition, shock progression, postoperative deterioration, response to an intervention. It is *not* load-bearing when a single set of current vitals (stated in text) answers the question; do not let the content lane attach a chart to a single-timepoint stem.

The render-risk here is low (plotting numbers), so the discipline shifts to **arithmetic consistency**: the rendered points must equal the data array, and any trend or derived value the answer relies on must be *real in the rendered series*, computed not asserted.

---

## 2. Part A — Chart primitive (`src/visuals/primitives/lineChart.ts`)

A reusable, kind-agnostic line/trend chart. No clinical knowledge lives here.

```ts
// src/visuals/primitives/lineChart.ts
export interface ChartSeries {
  label: string;            // "HR", "SBP", …
  unit: string;             // "bpm", "mmHg", …
  points: { x: number; y: number }[];   // x in axis units (e.g., hours)
  axis?: 'left' | 'right';  // dual y-axis support (e.g., SpO2 % vs mmHg)
  /** optional shaded normal band for THIS series, in y-units */
  referenceBand?: { low: number; high: number };
  styleRole?: string;       // maps to a theme token; no raw colors here
}

export interface LineChartInput {
  series: ChartSeries[];
  xAxis: { label: string; min: number; max: number; ticks?: number[] };
  yAxisLeft: { label: string; min: number; max: number; ticks?: number[] };
  yAxisRight?: { label: string; min: number; max: number; ticks?: number[] };
  width?: number; height?: number;
}

export function renderLineChart(input: LineChartInput): string; // returns <g>/<svg> fragment
```

Requirements:
- **Deterministic**: identical input → byte-identical SVG. No `Date.now()`, no random jitter, fixed numeric formatting.
- Axes, gridlines, tick labels, series polylines, point markers, optional per-series reference bands, dual y-axis (left/right) for unlike units, and a legend.
- Colors/typography only via the shared theme tokens U0 established — the primitive takes a `styleRole`, never a hex value.
- Pure: takes data, returns SVG string. No registry awareness; the *kind* module wires it in.
- Designed so U3 (`lab_trend`) reuses it unchanged, adding only its own small table view alongside.

---

## 3. Part B — `vitals_trend` spec shape

Append **one single line** to the union in `src/visuals/types.ts` (append-only; keeps U1/U2 parallel-safe):

```ts
// src/visuals/types.ts  (append only)
//   | VitalsTrendSpec   ← U2 adds exactly this line
```

```ts
// src/visuals/kinds/vitals_trend/types.ts
export type VitalKey = 'hr' | 'sbp' | 'dbp' | 'map' | 'rr' | 'spo2' | 'temp';

export interface VitalsTrendSpec {
  kind: 'vitals_trend';
  /** Hour offsets for each reading; shared x-axis across series. */
  timepointsHr: number[];
  series: {
    vital: VitalKey;
    /** Same length as timepointsHr; one value per timepoint. */
    values: number[];
    /** Show the standard normal band for this vital. Default true. */
    showReferenceBand?: boolean;
  }[];
  /** Optional °C vs °F flag for temp formatting/banding. Default 'C'. */
  tempUnit?: 'C' | 'F';
}
```

Notes:
- BP can be entered as `sbp`+`dbp` series; if the answer turns on **MAP**, prefer adding a `map` series whose values are **computed** in `selfCheck` (see §5), not hand-keyed.
- The kind module owns the clinical bits the primitive doesn't: per-`VitalKey` unit, normal reference band, and left/right axis assignment (e.g., SpO2 % and temp on the right axis; HR/BP/RR on the left). Centralize these in one lookup table in the kind module.

---

## 4. `validate(spec)`

- `timepointsHr` non-empty, strictly increasing, all finite.
- Every `series[i].values.length === timepointsHr.length`.
- At least one series; no duplicate `vital` in `series`.
- Per-vital sanity ranges (reject, don't clamp): e.g., `hr 10–300`, `sbp 40–300`, `dbp 20–200`, `rr 2–80`, `spo2 50–100`, `temp` 30–43 °C (convert if `tempUnit==='F'`). MAP, if supplied directly, must satisfy `dbp ≤ map ≤ sbp` — but prefer computing it (see §5).
- All values finite numbers.
- Clear reason strings per the `validate-bank` convention.

---

## 5. `selfCheck(spec, question)` — the fidelity gate (required for this kind)

This is where U2 earns its keep. Assert **series → render fidelity** and **derived-value correctness**:

1. **Plotted == data.** Every point the primitive draws maps back to exactly `spec.series[*].values[*]` at the matching `timepointsHr`. No interpolation/resampling that would move a point off its datum.
2. **Computed MAP, not asserted.** If the question or a `map` series relies on MAP, compute it from SBP/DBP: `MAP = DBP + (SBP − DBP) / 3`, and assert the rendered/keyed MAP equals the computed value (exact, with a defined rounding rule recorded in the schema doc). Treat a mismatch as a **build failure**, not a content note.
3. **Trend the answer turns on is real.** If the item metadata declares the keyed trend (e.g., "MAP trending down", "HR up while BP down → compensated shock"), `selfCheck` verifies that direction actually holds in the rendered series (e.g., last value vs first, or monotonic over the stated window). This prevents an item whose stated trend contradicts its own chart.

Define the trend assertions against a small, explicit contract in the item (e.g., `expectedTrend: { vital: 'map', direction: 'down', window: [0, 6] }`) so `selfCheck` has something concrete to test rather than guessing intent.

---

## 6. Accuracy watch-items

- Plotted points must equal the data array (gated by `selfCheck` #1).
- Reference bands must use **current, correct** normal ranges and the unit shown; an item keying on "SpO2 below normal" needs the band to actually start at the right threshold. Keep ranges in one reviewed table; cite the source in the schema doc.
- Any derived value (MAP, or later in U3 anion gap etc.) is computed, never asserted (`selfCheck` #2).
- Don't let a flat/uninformative series carry a chart — that's the decorative trap; the content lane must declare the load-bearing trend.

---

## 7. Tests

- Register `vitals_trend`; it should flow through U0's **generic conformance harness** automatically.
- **Primitive unit tests:** axes/ticks/bands render deterministically; dual-axis placement; byte-identical output for fixed input; reference band geometry matches the given low/high.
- **Determinism:** byte-identical SVG for a fixed `VitalsTrendSpec`.
- **`selfCheck` cases:** plotted-equals-data pass; a deliberately mismatched point fails; MAP computed correctly and a wrong keyed MAP fails the build; declared trend that contradicts the series fails.
- **`validate` rejection cases:** length mismatch, non-increasing timepoints, duplicate vital, out-of-range value, `dbp > map > sbp` violation.
- `validate-bank`, `coverage-report` (now breaks out a `vitals_trend` count), `build`, `test-visuals` all green.

---

## 8. Registration & wiring (follow U0's barrel pattern)

1. Create `src/visuals/primitives/lineChart.ts` (kind-agnostic, reusable by U3).
2. Create `src/visuals/kinds/vitals_trend/` with `index.ts` (`{ validate, renderSvg, selfCheck }`), `types.ts`, and the per-vital lookup table.
3. Register the kind in `src/visuals/kinds/index.ts`.
4. Append the **one** union line in `src/visuals/types.ts`.
5. Confirm `VisualStimulus.tsx` routes `kind: 'vitals_trend'` through the registry with no special-casing.
6. Update `NCLEX-Question-Schema.md` ("Adding a new visual kind" entry + the reference-range/MAP-rounding note), `PROJECT-HISTORY.md`, and the ledger.

**Hand-off note for U3:** keep `lineChart.ts`'s API stable and documented; `lab_trend` will reuse it plus a small serial-labs table view. Flag in the PR description any primitive API surface U3 will depend on so the U3 agent inherits a clean contract.

---

## 9. Content lane (separate job, after the renderer lands)

- ID prefix `vit_*`, disjoint from all other lanes.
- Targets: sepsis recognition, shock progression (e.g., narrowing pulse pressure, rising HR with falling MAP), postoperative deterioration, response to intervention (vitals normalizing after fluids/pressors).
- Every item must declare its load-bearing trend in metadata so `selfCheck` can verify it; reject single-timepoint items (use text instead).
