# U3 · `lab_trend` Renderer Spec

**Type:** renderer (code) + later content lane.
**Depends on:** U0 (registry), U2 (`lineChart` primitive — already shipped).
**Concurrent-safe with:** U4 (`table` primitive + `mar`). The two slices share only the append-only union line in `src/visuals/types.ts` and the append-only registration line in `src/visuals/kinds/index.ts`; nothing else overlaps.
**Status:** specced, not implemented.

Read `AGENTS.md`, `DECISIONS.md`, `VISUAL-STIMULI-ROADMAP.md`, and `NCLEX-Question-Schema.md` first; on any conflict they win. This spec implements the U3 row of the roadmap and the "Adding a new visual kind" checklist verbatim.

---

## 1. Purpose and necessity doctrine

`lab_trend` renders **serial laboratory values for one or two analytes across ≥3 timepoints**, reusing the `lineChart` primitive, with per-analyte reference bands so the learner reads the *trajectory* and its relation to normal.

Labs are the single easiest visual to make decorative: six numbers can always be written into the stem. The roadmap's gating rule therefore applies with full force — *if removing the visual leaves the answer unchanged, the item is invalid.* This spec makes necessity **structural**, not a reviewer's good intention:

1. **Trajectory, not snapshot.** A `lab_trend` is load-bearing only when the answer turns on the *shape over time* (still climbing vs. plateauing, falling fast enough to threaten a complication, normalizing in response to therapy). A single final value that would answer the item on its own means the chart is decorative → the item is invalid.
2. **≤2 analytes.** Plot only the analyte(s) the answer actually turns on. Context labs belong in the stem text, not on the chart. This is enforced in `validate` (see §4) and doubles as the rendering constraint (the primitive has two y-axes). A multi-analyte single-timepoint *panel* is a table, is decorative-prone, and is explicitly **out of scope** here (it would be a future `lab_panel` table kind on U4's primitive, not `lab_trend`).
3. **≥3 timepoints.** Enforced in `validate`. Two points is a before/after that text states more cheaply.
4. **Declared load-bearing cue.** The item must declare, in question-level `meta` (§6), the trend/flag the answer keys on; `selfCheck` asserts that cue is actually present in the rendered data and spans more than one timepoint.

If a candidate item can't satisfy all four, it is a text item, not a `lab_trend`.

> **Content-prompt follow-up (tracked, not part of this spec):** confirm the `lab_*` generation prompt states the four gates above explicitly and rejects single-snapshot or >2-analyte requests. If it doesn't, reinforce it before the content lane opens. (This is the point-2 action item from planning.)

---

## 2. Files (mirrors `capnography` / `vitals_trend` layout)

```
src/visuals/kinds/lab_trend/
  index.ts     # validate / selfCheck / renderSvg / fixtures + registerVisual(...)
  types.ts     # LabTrendSpec, LabAnalyteKey
```

No new primitive. Reuse `src/visuals/primitives/lineChart.ts` (`renderLineChart`), `graphPaper.ts` (`fmt`), `escapeXml.ts`.

Shared touch-points (append-only, one line each — the only files outside the kind dir that change):
- `src/visuals/types.ts`: `export type QuestionVisual = … | LabTrendSpec;`
- `src/visuals/kinds/index.ts`: `import "./lab_trend";`

If implementing requires editing `App.tsx`, `schema.ts`, `validate-bank.ts`, or `coverage-report.ts`, the framework was under-generalized — fix the framework, not the kind. (`coverage-report` already iterates `listVisualKinds()`, so `lab_trend` appears in the per-kind breakdown for free.)

---

## 3. Spec type (`types.ts`)

```ts
export type LabAnalyteKey =
  | "sodium" | "potassium" | "chloride" | "bicarbonate" | "anion_gap"
  | "bun" | "creatinine" | "glucose"
  | "calcium" | "ionized_calcium" | "magnesium" | "phosphate"
  | "lactate" | "troponin_t" | "bnp"
  | "wbc" | "hemoglobin" | "hematocrit" | "platelets"
  | "inr" | "ptt" | "ph" | "paco2" | "pao2" | "hco3_abg"
  | "ast" | "alt" | "total_bilirubin" | "ammonia"
  | "potassium_critical_demo"; // placeholder slot; real set finalized against the registry in §5

export interface LabTrendSpec {
  kind: "lab_trend";
  /** Required. Hour/min/day offsets; strictly increasing; length >= 3. */
  time: { unit: "hr" | "min" | "day"; values: number[] };
  /** Reference-range population. Default "adult". Selects which range set §5 uses. */
  population?: "adult" | "peds_child" | "peds_infant";
  /** 1–2 analytes. Plot only the load-bearing analyte(s). */
  series: {
    analyte: LabAnalyteKey;
    /** Same length as time.values; one value per timepoint, in `unit`. */
    values: number[];
    /** Display/validation unit. Defaults to the registry's canonical unit for the analyte. */
    unit?: string;
    /** Show the analyte's normal band. Default true. */
    showReferenceBand?: boolean;
  }[];
  caption?: { en: string; zh?: string };
}
```

Note `time` is the object form only (`{unit, values}`). `lab_trend` is new, so it does **not** carry `vitals_trend`'s deprecated bare `timepointsHr`. `unit` adds `"day"` because serial labs commonly span days (creatinine over a 5-day AKI course).

---

## 4. `validate(spec): VisualError[]`

Structural + range validation of the spec **alone** (no question access). Codes are stable; fixtures assert against them.

| Check | `code` | Notes |
|---|---|---|
| `kind === "lab_trend"` | `invalid_kind` | |
| `time.unit ∈ {hr,min,day}` | `invalid_time_unit` | |
| `time.values` non-empty, all finite | `timepoints_invalid` / `timepoint_not_number` | |
| `time.values` strictly increasing | `timepoints_not_increasing` | |
| `time.values.length >= 3` | `too_few_timepoints` | **necessity gate** |
| `series` length 1–2 | `series_empty` / `too_many_series` | **necessity gate**; >2 rejected |
| each `analyte` in registry (§5) | `invalid_analyte_key` | |
| no duplicate `analyte` | `duplicate_analyte` | |
| `series[i].values.length === time.values.length` | `values_length_mismatch` | |
| each value finite | `value_not_number` | |
| each value within the analyte's **absolute physiologic sanity bounds** (wide; *not* the reference range) | `value_out_of_range` | sanity bounds in §5; reference band is for display, sanity bound is for validation |
| `unit` (if given) is a recognized unit for that analyte | `invalid_unit_for_analyte` | |
| `population` (if given) in enum | `invalid_population` | |
| `showReferenceBand` (if given) boolean | `invalid_show_reference_band` | |
| caption: if present, `caption.en` non-empty; `caption.zh` non-empty if present | `caption_en_required` / `caption_zh_empty` | mirror `vitals_trend` |

`validate` never throws on malformed input; guard every access (follow the defensive pattern already in `validateVitalsTrend`).

---

## 5. Analyte registry (clinical accuracy gate)

`lab_trend` needs a registry analogous to `VITAL_DEFS`: per analyte and per `population`, a label, canonical unit (plus accepted alternate units), reference band `{low, high}`, and absolute sanity bounds `{min, max}`. Axis assignment is decided at render time from the two chosen analytes (see §7), not stored per analyte.

> **STRICTEST-TIER ACCURACY REQUIREMENT.** Reference ranges and units are clinical claims under the strictest tier in `AGENTS.md`. **Every numeric range below is a PLACEHOLDER and must be source-verified before any item keys an answer to it.** Verify against authoritative sources (professional society guidelines, government health agencies, drug labels, established clinical references such as current lab medicine texts). Peds ranges are age-banded in reality; `peds_child` / `peds_infant` are coarse buckets and the verifier must confirm they are defensible or the bucket must be narrowed. Record the source per analyte the way `vitals-canonical.json` items record `meta.source`.

Starter table (adult; **placeholders pending verification**):

| analyte | canonical unit | alt units | ref band (adult) | sanity bounds |
|---|---|---|---|---|
| sodium | mEq/L | mmol/L | 135–145 | 90–200 |
| potassium | mEq/L | mmol/L | 3.5–5.0 | 1.0–10.0 |
| chloride | mEq/L | mmol/L | 98–106 | 60–160 |
| bicarbonate | mEq/L | mmol/L | 22–28 | 3–60 |
| anion_gap | mEq/L | — | 8–12 | 0–50 |
| bun | mg/dL | mmol/L | 7–20 | 1–250 |
| creatinine | mg/dL | µmol/L | 0.6–1.3 | 0.1–25 |
| glucose | mg/dL | mmol/L | 70–99 (fasting) | 10–1500 |
| calcium | mg/dL | mmol/L | 8.5–10.5 | 3–20 |
| magnesium | mg/dL | mmol/L | 1.7–2.2 | 0.3–10 |
| phosphate | mg/dL | mmol/L | 2.5–4.5 | 0.2–20 |
| lactate | mmol/L | — | 0.5–2.0 | 0.1–30 |
| troponin_t | ng/mL | µg/L | 0–0.01 | 0–50 |
| wbc | ×10⁹/L | K/µL | 4.0–11.0 | 0–200 |
| hemoglobin | g/dL | g/L | 12–17 | 2–25 |
| platelets | ×10⁹/L | K/µL | 150–400 | 0–2000 |
| inr | (ratio) | — | 0.8–1.1 | 0.5–12 |

Implementer: finalize `LabAnalyteKey` to exactly the verified set (drop the `*_demo` placeholder), and have the verifier sign off in the U3 audit report before the content lane opens.

---

## 6. Question-level `meta` contract (audit-only) — and the reconciliation

`lab_trend` requires a real `selfCheck`, which needs a declared contract for *what the answer turns on*. That contract **already exists on disk** in `vitals-canonical.json` as a question-level `meta` block, but it is **not the shape the schema doc documents, and not the shape the live `selfCheck` code reads.** Resolving this is part of U3 (point-4 from planning). See §6.3 for the finding; §6.1–6.2 define the canonical shape `lab_trend` uses.

### 6.1 Canonical shape (adopt the on-disk `vitals` convention; richest, already reviewed)

```jsonc
// sibling of `visual`, at the QUESTION level. Audit-only. Never displayed.
"meta": {
  "visual_justification": "string — REQUIRED, non-empty. Why the visual is load-bearing.",
  "source": "string — clinical source for ranges/pattern (strict tier).",
  "tier": "strictest | routine",
  "skill_signature": "string — stable skill tag, e.g. 'lab:rising-creatinine/aki-worsening'.",
  "expected_trend": [
    { "series": "creatinine", "direction": "up", "window": [0, 72] }
  ],
  "expected_flags": [
    { "series": "potassium", "at": 48, "flag": "H" }
  ],
  "derived_values_keyed": [],
  "reference_bands": "adult",
  "stem_disambiguators": ["acute kidney injury", "rising creatinine"]
}
```

- `series` is the per-kind series identifier — `analyte` keys for `lab_trend`, `vital` keys for `vitals_trend`. (The on-disk vitals items use the field name `vital`; on migration this becomes `series` to be kind-agnostic — see §6.3.)
- `direction ∈ {"up","down","stable"}`. `"stable"` is **new** (the on-disk data only uses up/down); `lab_trend` needs it for plateau recognition (e.g., creatinine no longer climbing). Tolerance for "stable" is `|valEnd − valStart| <= stableEps`, where `stableEps` is a per-analyte fraction of the reference-band width (define in the registry; default 10%).
- `expected_flags` is **new for `lab_trend`** (H/L assertion); `vitals_trend` does not need it.
- `window`/`at` values are matched against `time.values` by equality (same as the live vitals code matches timepoints).

### 6.2 `selfCheck(spec, question): VisualError[]` responsibilities

Non-fatal at import; must be clean before promotion. Guard everything (a malformed `meta` must produce a `VisualError`, never a throw).

1. **Render fidelity** — every plotted point equals `series.values` (no resampling/interpolation; same guarantee `vitals_trend` makes). Code `self_check_render_divergence`.
2. **Flag correctness** — for each `expected_flags` entry, recompute from the registry band for the active `population`: `value < low → "L"`, `value > high → "H"` (extend with critical thresholds if the registry defines them). Mismatch → `self_check_flag_failed`.
3. **Trend correctness** — for each `expected_trend` entry, locate the series and the window indices; assert the direction holds (`up`: valEnd > valStart; `down`: valEnd < valStart; `stable`: within `stableEps`). Mismatch → `self_check_trend_failed`.
4. **Necessity** — `meta.visual_justification` present and non-empty (`self_check_missing_justification`); at least one `expected_trend` **or** `expected_flags` entry present (`self_check_no_keyed_cue`); every keyed `expected_trend.window` must span more than one timepoint (`self_check_snapshot_not_trajectory`). This is the structural backstop for the §1 doctrine.

### 6.3 The reconciliation finding (resolve in U3; flag to implementers)

Three different shapes are currently in play for this metadata:

- **Schema doc** (`NCLEX-Question-Schema.md`): a `meta` block with `expected_trend` as an array of `{vital, direction:"decreasing"|"increasing"}` — **no window**.
- **Live code** (`selfCheckVitalsTrend` in `src/visuals/kinds/vitals_trend/index.ts`): reads `question.metadata.expectedTrend` — a **single object** (not array), `{vital, window, direction:"up"|"down"}`, camelCase, under `metadata`.
- **Promoted bank** (`banks/vitals-canonical.json`, all 10 items): a question-level `meta` block (snake_case) with `expected_trend` as an **array** of `{vital, direction:"up"|"down", window:[t0,t1]}`, plus `visual_justification`, `source`, `tier`, `skill_signature`, `derived_values_keyed`, `reference_bands`, `stem_disambiguators`.

**Consequence:** because the code reads `question.metadata.expectedTrend` (camelCase, singular) while the bank writes `question.meta.expected_trend` (snake_case, array), **the live trend `selfCheck` never matches the promoted data — its trend branch is effectively dead against the real bank.** Only the MAP-derived check fires (it reads `spec.series` directly, not metadata). Per `DECISIONS.md` ("dormant checks must not be read as a pass"), this is a latent gap, not a clean state.

**Resolution (canonical = the on-disk bank shape, because 10 reviewed items already conform and migrating code is cheaper than re-reviewing content):**
1. Fix `selfCheckVitalsTrend` to read `question.meta.expected_trend` (array), iterate entries, and key on `series` (accept legacy `vital` during migration). Migrate the `derived_values_keyed`/MAP check to read the same block.
2. Migrate the 10 `vitals` items: rename `expected_trend[].vital → series`; add `"stable"` only where applicable; no value changes. (Audit-only field, non-fatal, so this is low-risk; re-run `selfCheck` after.)
3. Update `NCLEX-Question-Schema.md`: replace the under-specified `meta`/snake_case example with §6.1's full shape (window, `series`, three directions, `expected_flags`, `tier`, `source`, `skill_signature`, `derived_values_keyed`, `reference_bands`, `stem_disambiguators`), and note that question-level `meta` is **distinct from the bank-envelope `meta`** and is **stripped from display**.
4. **Also document `visual.population`**: the on-disk vitals items carry `visual.population` ("adult"/"peds_child"), but neither `VitalsTrendSpec` nor the schema doc defines it. `lab_trend` defines `population` properly (§3); retrofit `population` into `VitalsTrendSpec` + the schema doc in the same pass so the two trend kinds agree.

> Naming wart (do **not** block U3/U4): question-level `meta` reuses the name of the bank-envelope `meta`. Keeping it avoids re-migrating reviewed content (minimal, deliberate schema changes per `AGENTS.md`). A future deliberate migration could rename question-level to `visualMeta`; out of scope here.

---

## 7. `renderSvg(spec): string`

Pure, deterministic, XML-escaped. No `Date`/`Math.random`/DOM/network. Route all coordinates through `fmt`; escape all free text.

- Build one `ChartSeries` per analyte: `label` = registry label, `unit` = effective unit, `points` = `values.map((v,i) => ({x: time.values[i], y: v}))`, `referenceBand` from the registry band (for the active `population`) unless `showReferenceBand === false`, `styleRole` per analyte (reuse `lineChart`'s `colorForRole` roles).
- **Axis assignment:** 1 analyte → left axis only. 2 analytes → analyte[0] left, analyte[1] right (dual-axis, exactly as `vitals_trend` does). Compute axis bounds from points **and** the reference band, with the same padding approach as `renderVitalsTrendSvg`.
- **X axis:** label from `time.unit` ("Time (Hours)" / "(Minutes)" / "(Days)"); `ticks = time.values`.
- Wrap: `<svg xmlns=... viewBox="0 0 600 300" role="img" aria-label="Lab Trend" data-kind="lab_trend"> … </svg>`.
- Determinism: identical spec → byte-identical SVG (the conformance harness asserts this).

---

## 8. Fixtures (`fixtures` on the module)

`valid` (≥2): e.g. rising creatinine over 0/24/48/72 h (AKI worsening, single analyte, left axis); falling Na⁺ over 3 days (SIADH) paired with serum osm on the right axis.

`invalid` (assert each `code`): `too_few_timepoints` (2 points); `too_many_series` (3 analytes); `duplicate_analyte`; `values_length_mismatch`; `value_out_of_range` (creatinine 99); `invalid_analyte_key`; `timepoints_not_increasing`.

The generic conformance harness (`scripts/tests/visuals-conformance.ts`) runs these automatically over all registered kinds — no per-kind wiring needed.

---

## 9. Tests

- **Conformance (automatic):** fixtures valid/invalid + determinism, via the existing harness.
- **Kind-specific** (`scripts/tests/lab-trend.ts`, register in `npm run test-visuals`):
  - reference-band derivation per `population`;
  - `selfCheck` flag correctness (H/L recomputation) and trend correctness (up/down/stable incl. `stableEps`);
  - necessity backstops (`self_check_no_keyed_cue`, `self_check_snapshot_not_trajectory`, `self_check_missing_justification`);
  - render fidelity (plotted y’s equal `values`).
- **Parity:** add `lab_trend` fixtures to the SVG snapshot set in `scripts/tests/__snapshots__/visual-parity.json`.

---

## 10. Acceptance / verification

```sh
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run coverage-report      # lab_trend appears in the per-kind visual breakdown
npm run build
```

All green; `vitals_trend` `selfCheck` migration (§6.3) leaves the 10 vitals items clean; schema doc updated with the `lab_trend` subsection (§3–§7) and the reconciled `meta` contract (§6.1).

---

## 11. Content lane (after the renderer lands — separate pass)

- ID prefix `lab_*`, disjoint from other kinds.
- Generate → `banks/banks-raw/` → cross-model review (generator never reviews its own) → source-check ranges/flags (strict tier) → visual audit (artifact matches data; necessity holds) → human content review → promote to `banks/visual-canonical.json` → `BANK-REVIEW-LEDGER.md` entry → delete raw file.
- Every item carries the §6.1 `meta` block with a specific, non-generic `visual_justification` and at least one `expected_trend`/`expected_flags` cue.
- Targets (roadmap): DKA (glucose↓ + bicarbonate↑ resolution), SIADH (Na⁺↓), AKI (creatinine↑, plateau vs. still-climbing), electrolyte disorders, tumor lysis (K⁺/phosphate↑).
