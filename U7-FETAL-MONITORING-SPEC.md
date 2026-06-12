# U7 · `fetal_monitoring` Renderer Spec (dual-channel)

**Type:** renderer (code), large — **multi-window** (budget 2–3 windows). + later content lane.
**Depends on:** U0 only. Waveform-family kind (sibling of `rhythm_strip`/`capnography`): analytic sampling on a clinical grid, seeded variability texture. No `renderFieldPanel`/`renderDocTable`/`lineChart` dependency.
**Concurrent-safe with:** anything (own files; only the append-only union + registration lines are shared). Concurrent with U8.
**Status:** implemented and verified in three checkpointed windows (2026-06-12). Renderer-definition source audit: `audit/u7-fetal-monitoring-source-verification-2026-06-12.md`. No content generated.

Read `AGENTS.md`, `DECISIONS.md`, `VISUAL-STIMULI-ROADMAP.md`, and `NCLEX-Question-Schema.md` first; on any conflict they win. This spec covers the U7 row: **`fetal_monitoring`** — a synchronized two-channel cardiotocograph (FHR over uterine activity) drawn in correct temporal phase.

---

## 0. Why this is the hard one, and what the gate is

Every other visual kind keys on a value you can *read* (a number, a flag, a plotted point) or *compute* (a dose, a total). `fetal_monitoring` keys on a **temporal phase relationship between two channels** — the single subtlest thing on the whole roadmap, and the easiest to render *subtly wrong*. The diagnostic content is not "there is a deceleration"; it is "this deceleration is **late** because its nadir falls *after* the contraction peak," vs "**early** because the nadir *mirrors* the peak," vs "**variable** because it is abrupt and *not time-locked* to a contraction."

So unlike `rhythm_strip` (which has no `selfCheck`), this kind **must** carry a `selfCheck` whose core job is to **recompute the phase offset between each declared deceleration and its contraction and assert it is consistent with the declared category** (§7). A late decel rendered in early phase teaches the wrong category; the gate exists to make that a build failure, not a content note. This is the roadmap's headline accuracy watch-item, made mechanical.

The kind is staged across windows (§3) precisely because the phase logic (window 2) is where the difficulty concentrates and should land on top of a proven channel/grid foundation (window 1).

---

## 1. Purpose and necessity doctrine

`fetal_monitoring` renders a CTG strip: an **FHR channel** (top) over a **uterine activity / tocodynamometer channel** (bottom), sharing one time axis. Targets (roadmap): FHR category interpretation, decel-type discrimination, variability assessment, intrapartum decision-making.

It is decorative-prone (a strip can be attached to any L&D scenario). The gating rule binds hard:

1. **The load-bearing finding must live *only* on the strip and require *reading the tracing*.** The item earns the visual when identifying the decel **type** (via phase), the **variability category**, or the **acceleration** presence off the tracing is the task. **If the stem states "the client has late decelerations," the strip is decorative.** Human review confirms the keyed feature is not named in the stem.
2. **The answer turns on a tracing feature the stem does not name** — the decel category that must be inferred from phase, the variability band, the accel/decel distinction. Removing the strip makes the inference impossible.
3. **The render must not state the verdict.** No "LATE DECELS" banner, no category label printed on the strip. A fixed `"FHR (bpm)"` / `"UA (mmHg)"` axis label and a neutral caption are allowed; naming the finding is not (§8 caption rule, mirror `rhythm_strip`'s "do not caption the answer").
4. **The declared pattern is machine-verified against the rendered tracing.** The item declares the load-bearing feature(s) in `meta.expected_pattern`; `selfCheck` recomputes them from the structured spec (phase offsets, variability amplitude) and asserts consistency (§7). This is the `lab_trend` `expected_trend`/`expected_flags` contract adapted to FHR phase + variability.

`selfCheck` enforces *structure, phase-consistency, and necessity*. Stage-4 human review enforces clinical validity (is this a realistic tracing? is the category interpretation correct per NICHD/AWHONN? is the keyed feature the load-bearing one?).

### The simulation-engine trap (explicit non-goal)

We do **not** build a physiological fetal-cardiac simulator. The FHR trace is an **analytic synthesis** the same way `rhythm_strip` synthesizes ECG morphology: a baseline + seeded variability noise + accel bumps + decel dips of declared shape and phase. We model **named, enumerated decel categories** (`early`/`late`/`variable`/`prolonged`) and **enumerated variability categories**, not a continuum to be "interpreted." Sinusoidal pattern, beat-to-beat true cardiac mechanics, and arbitrary free-form tracings are **out of v1 scope** (flagged extension, §13). If a feature would require modeling beyond the enumerated set, it is out of scope, not a reason to grow a simulator.

---

## 2. Files

```
src/visuals/kinds/fetal_monitoring/
  index.ts            # validate / selfCheck / renderSvg / fixtures + registerVisual(...)
  types.ts            # FetalMonitoringSpec + enums
  channels.ts         # dual-panel grid + FHR baseline/variability + UA contraction curves (window 1)
  features.ts         # accel bump + decel-by-type shaping & phase math (window 2)
```

Reuse `primitives/graphPaper.ts` (`fmt`, `secondsToPx`, and the grid-drawing approach — see §5 note), `primitives/prng.ts` (`mulberry32` for seeded variability), `primitives/escapeXml.ts`. No new primitive (the dual-panel CTG layout is bespoke to this kind, like the ECG trace is bespoke to `rhythm_strip`). Append-only shared lines:
- `src/visuals/types.ts`: `import type { FetalMonitoringSpec } from "./kinds/fetal_monitoring/types";` and `… | FetalMonitoringSpec;`
- `src/visuals/kinds/index.ts`: `import "./fetal_monitoring";`

No edits to `App.tsx` / `schema.ts` / `validate-bank.ts` / `coverage-report.ts` / `census.ts`. Splitting `channels.ts`/`features.ts` inside the kind dir keeps the two-window foundation/feature split clean; the kind still registers once.

---

## 3. Window plan (this is a multi-window kind — implement in order)

The roadmap budgets 2–3 windows. Land them in this order; each ends green (`test-visuals` + `build`).

**Window 1 — foundation (`channels.ts`, spec type, validation, baseline tracing).**
- Dual stacked panels sharing one x (time) axis: FHR panel on top (y ≈ 50–210 bpm), UA panel below (y ≈ 0–100 mmHg). Clinical-paper grid in each.
- FHR **baseline** at `baselineFhr` with **variability** rendered as seeded beat-to-beat fluctuation whose amplitude is set by the `variability` category (§6 amplitude bands).
- UA **contractions** as bell curves (gaussians) at declared peak times.
- `validate` (§6) complete; spec type (§5) complete; fixtures for baseline+variability+contractions only (no decels yet).
- Optional Window-1 `selfCheck`: variability-amplitude check (rendered fluctuation peak-to-trough falls in the declared category band).
- **Exit:** baseline tracings render deterministically; variability categories visibly differ; contractions align to the time axis.

**Window 2 — features (`features.ts`): decelerations by phase + accelerations + the phase gate.**
- Accelerations: transient FHR rises (bump up from baseline).
- Decelerations by **type**, shaped and phased (§7.2): `early` (gradual, nadir ≈ contraction peak), `late` (gradual, nadir offset *after* peak), `variable` (abrupt V/W, *not* time-locked), `prolonged` (wide, ≥120 s).
- **The phase-offset `selfCheck` (§7) — the defining gate.** Recompute each decel's phase relationship from the structured timing and assert consistency with its declared `type`; verify `meta.expected_pattern`.
- Fixtures exercising each decel type + accel.
- **Exit:** each decel type renders in correct phase; planting a wrong-phase decel trips `selfCheck`; `meta.expected_pattern` verification works.

**Window 3 — polish, full test matrix, examples, docs, parity (fold into window 2 if time allows).**
- Full `scripts/tests/fetal-monitoring.ts` matrix (§10); schema-doc subsection; example fixtures spanning the category space; parity snapshots; `NCLEX-Question-Schema.md` + `PROJECT-HISTORY.md` + roadmap updates.

If only two windows are available, merge window 3's polish into window 2 and ship; do **not** ship window 2's phase logic without its `selfCheck` gate.

---

## 4. Placement (`allowedItemTypes`)

```
["multiple_choice", "select_all", "matrix"]
```

Registry default — the same set as `rhythm_strip`/`capnography`. FHR interpretation is categorical recognition (which category? expected/unexpected matrix? which actions?), not a numeric calc, so `fill_in_blank` is **not** added (contrast the arithmetic kinds). A `matrix` "expected / unexpected finding" item is a natural fit. (If a future content need wants a numeric baseline-rate `fill_in_blank`, that's an `allowedItemTypes` extension — out of v1.)

---

## 5. Spec type (`kinds/fetal_monitoring/types.ts`)

```ts
export type FhrVariability = "absent" | "minimal" | "moderate" | "marked";
export type DecelType = "early" | "late" | "variable" | "prolonged";

export interface UterineContraction {
  /** Peak time on the shared axis (seconds from strip start). */
  peakSec: number;
  /** Peak UA above resting tone, mmHg. Default 50. */
  amplitudeMmHg?: number;
  /** Total contraction width (onset→offset), seconds. Default 60. */
  durationSec?: number;
}

export interface FhrAcceleration {
  /** Peak time of the acceleration. */
  peakSec: number;
  /** Rise above baseline, bpm (v1 models the ≥32-week term accel ≥ 15). */
  riseBpm: number;
  /** Total width, seconds (term accel ≥ 15 s). */
  durationSec: number;
}

export interface FhrDeceleration {
  type: DecelType;
  /** Time of the FHR nadir (deepest point). */
  nadirSec: number;
  /** Drop from baseline to nadir, bpm. */
  depthBpm: number;
  /** Total decel width (onset→offset), seconds. */
  durationSec: number;
  /** Index into `contractions` this decel couples to. REQUIRED for `early`/`late`.
   *  OMITTED for `variable` because variable decelerations have no fixed phase
   *  relationship to a contraction; this does not mean they cannot occur near one.
   *  OPTIONAL for `prolonged`. */
  contractionIndex?: number;
}

export interface FetalMonitoringSpec {
  kind: "fetal_monitoring";
  /** Strip length in seconds (sets x-axis span). Default 600 (10 min). Render at a schematic
   *  px/sec; see §8. Range 120–1200. */
  durationSec?: number;
  /** Baseline FHR, bpm. 50–220. */
  baselineFhr: number;
  /** Variability category — sets the baseline fluctuation amplitude band (§6). */
  variability: FhrVariability;
  /** Seed for the deterministic variability texture (mulberry32). Default 0. */
  seed?: number;
  /** UA channel. May be empty (a tracing with no contractions is valid). */
  contractions?: UterineContraction[];
  /** FHR transient features. */
  accelerations?: FhrAcceleration[];
  decelerations?: FhrDeceleration[];
  caption?: { en: string; zh?: string };
}
```

Design notes:
- **Enumerated categories, not a continuum.** `variability` and `DecelType` are closed vocabularies; the renderer maps each to a fixed synthesis recipe (no "interpret the squiggle"). This is the `rhythm_strip` discipline (closed `RhythmClass`).
- **Phase is structural.** `early`/`late` *must* name the contraction they couple to (`contractionIndex`); their category is *defined* by `nadirSec` relative to that contraction's `peakSec`. `variable` is uncoupled (no index). This makes phase a checkable property of structured data, not a property of pixels.
- **`seed` drives only the variability noise** (like `rhythm_strip`'s fibrillatory baseline) — never the features. Deterministic per `seed`.

---

## 6. `validate(spec): VisualError[]`

Defensive (`validateRhythmStrip`/`validateCapnography` style: local `bounded`/`nonEmptyString`/`isRecord` helpers); never throw.

| Check | `code` |
|---|---|
| `kind === "fetal_monitoring"` | `invalid_kind` |
| `baselineFhr` finite, 50–220 | `baseline_out_of_range` / `baseline_required` if absent |
| `variability` ∈ {`absent`,`minimal`,`moderate`,`marked`} | `invalid_variability` |
| `durationSec` (if present) 120–1200 | `duration_out_of_range` |
| `seed` (if present) non-negative integer | `seed_out_of_range` |
| each `contractions[i].peakSec` finite, within `[0, durationSec]`; `amplitudeMmHg` (if present) 5–100; `durationSec` (if present) 20–180 | `contraction_out_of_range` |
| each `accelerations[i]`: `peakSec` in range; `riseBpm` 1–60; `durationSec` 5–120 | `acceleration_out_of_range` |
| each `decelerations[i]`: `type` ∈ vocab; `nadirSec` in range; `depthBpm` 1–120; `durationSec` 5–600 | `invalid_decel_type` / `deceleration_out_of_range` |
| `early`/`late` decel has a `contractionIndex` that indexes an existing contraction | `decel_contraction_index_invalid` |
| `variable` decel has **no** `contractionIndex` (no fixed contraction-phase relationship in this model) | `variable_decel_coupled` |
| `caption` rule (en required if present; zh non-empty if present) | `caption_en_required` / `caption_zh_empty` |

**Variability amplitude bands (NICHD; source-verified 2026-06-12):**

| `variability` | peak-to-trough amplitude |
|---|---|
| `absent` | ≈ 0 bpm (undetectable) |
| `minimal` | ≤ 5 bpm |
| `moderate` | 6–25 bpm |
| `marked` | > 25 bpm |

> **STRICTEST-TIER accuracy requirement — satisfied for renderer definitions on 2026-06-12.** See `audit/u7-fetal-monitoring-source-verification-2026-06-12.md`. Future items still require item-level source review for interpretation and management.

`validate` does **not** read `meta` — that is `selfCheck`'s job.

---

## 7. Question-level `meta` + `selfCheck(spec, question)` — the phase gate

`fetal_monitoring` uses the canonical `meta` block and adds `expected_pattern` (the declared load-bearing feature[s], the `lab_trend` `expected_trend` analogue).

### 7.1 `meta` shape

```jsonc
"meta": {
  "visual_justification": "REQUIRED non-empty — why inferring the decel category (or variability) off the tracing is the task.",
  "tier": "strictest",
  "source": "NICHD 2008 / AWHONN definitions.",
  "skill_signature": "fhr:late-decel/uteroplacental-insufficiency",
  "stem_disambiguators": ["fetal heart rate", "contractions"],

  "expected_pattern": {
    "decelerations": ["late"],        // the decel type(s) the item turns on; must match & render in-phase
    "variability": "minimal",          // OPTIONAL: the variability category the item turns on
    "accelerations_present": false     // OPTIONAL: whether an accel is the keyed feature
  }
}
```

At least one of `expected_pattern.decelerations` / `variability` / `accelerations_present` must be declared (the necessity cue).

### 7.2 Decel phase definitions (the recompute target)

For a decel coupled to contraction `c = contractions[contractionIndex]`, let `offset = decel.nadirSec − c.peakSec` and `onsetToNadir = decel.durationSec / 2` (symmetric synthesis; the onset is `nadirSec − onsetToNadir`).

| `type` | phase rule `selfCheck` asserts |
|---|---|
| `early` | coupled; nadir ≈ contraction peak: `abs(offset) ≤ EARLY_EPS_SEC` (≈ 5 s). Gradual: `onsetToNadir ≥ GRADUAL_MIN_SEC` (≈ 30 s). |
| `late` | coupled; nadir **after** peak: `offset ≥ LATE_LAG_MIN_SEC` (≈ 10 s, and `≤` a sane max). Gradual: `onsetToNadir ≥ GRADUAL_MIN_SEC`. |
| `variable` | no fixed contraction coupling (`contractionIndex` omitted). Abrupt: `onsetToNadir < ABRUPT_MAX_SEC` (30 s); depth ≥15 bpm; duration ≥15 s and <120 s. |
| `prolonged` | `durationSec ≥ PROLONGED_MIN_SEC` (120 s) and `< 600` (longer is a baseline change). |

`GRADUAL_MIN_SEC`, `ABRUPT_MAX_SEC`, and `PROLONGED_MIN_SEC` are source-backed NICHD morphology thresholds. `EARLY_EPS_SEC` and the late-lag min/max are renderer disambiguation tolerances around the source-defined phase relationships, not clinical thresholds.

### 7.3 `selfCheck` responsibilities

Defensive, never throws, `[]` on malformed spec (mirror `selfCheckCapnography`):

1. **Necessity — justification.** `visual_justification` present/non-empty → else `self_check_missing_justification`.
2. **Necessity — keyed feature.** `expected_pattern` declares ≥1 of decel types / variability / accel-present → else `self_check_no_keyed_pattern`.
3. **Phase consistency (the core gate).** For each `decelerations[i]`, assert its declared `type` satisfies its §7.2 phase rule against the spec timing → else a type-specific code: `self_check_early_phase` / `self_check_late_phase` / `self_check_variable_not_abrupt` / `self_check_prolonged_duration`. A late decel whose nadir is not offset after the peak is the canonical failure this catches.
4. **Declared-vs-actual pattern.** Every type in `expected_pattern.decelerations` must actually be present in `spec.decelerations` (and, by step 3, in correct phase) → else `self_check_pattern_absent`. If `expected_pattern.variability` is set, it must equal `spec.variability` → else `self_check_variability_mismatch`. If `accelerations_present` is set, it must match whether `spec.accelerations` is non-empty → else `self_check_accel_mismatch`.
5. **Variability render fidelity (optional, recommended).** Sample the rendered FHR baseline over a clean window (no decel/accel) and assert peak-to-trough falls in the declared category's §6 band → else `self_check_variability_amplitude`. (If the synthesis is constructed so amplitude is exact by construction, this can be a construction assertion rather than a sampling check — either satisfies the intent.)

`selfCheck` does **not** judge clinical management (what's the right *action* for late decels + minimal variability?) — that is stage-4 review.

---

## 8. `renderSvg(spec): string` — the dual-channel tracing

Self-contained deterministic SVG, seeded variability via `mulberry32(seed)` (like `rhythm_strip`). Two stacked panels sharing one x axis.

- **Layout.** FHR panel on top, UA panel below, a shared time axis. Each panel: a clinical grid (reuse the `renderGrid` *style* — light minor/major lines — but with this kind's own y-scales; do **not** force ECG mm/mV scaling). FHR y-axis ≈ 50–210 bpm with major lines every 30; UA y-axis 0–100 mmHg. Fixed left-label gutter (`"FHR (bpm)"` / `"UA (mmHg)"`).
- **Schematic time scale.** Real CTG paper is 3 cm/min; rendering 10 real minutes is very wide. Use a **schematic px/sec** (e.g. 1.0–1.5 px/sec) so a 600 s strip is a reasonable width; expose it via a `data-px-per-sec` attribute (like `rhythm_strip`). Sample the analytic traces at a fixed `sampleStepSec` (≈ 0.5 s — FHR is not a 250 Hz ECG; coarser sampling is fine and keeps the polyline small) and route every coordinate through `fmt`.
- **FHR trace synthesis** = `baselineFhr` + variabilityNoise(seed, category amplitude) + Σ accel bumps + Σ decel dips. Decel dip shape per `type`: `early`/`late` gradual symmetric U centered at `nadirSec` (late simply has `nadirSec` placed after the contraction peak — the phase *is* the data, the shape is the same gradual U); `variable` an abrupt V/W; `prolonged` a wide flat-bottomed dip. Accel = upward bump. Clamp FHR to the panel range.
- **UA trace synthesis** = resting tone + Σ contraction gaussians at `peakSec` with `amplitudeMmHg`/`durationSec`. The *visual* phase alignment between a late decel's nadir and its contraction's peak falls out automatically because both are placed on the same shared x from the same structured times — which is exactly what makes the `selfCheck` phase recompute and the render agree by construction.
- **No verdict text.** Axis labels and a neutral caption only. **Never** print a category name, "LATE", arrows annotating phase, or any feature label. `escapeXml` all text.
- **Determinism.** Identical spec → byte-identical SVG. No `Date`/`Math.random` (seed the PRNG)/DOM/network/module-level mutable state.
- **Wrap:**
  ```
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 <W> <H>" role="img"
       aria-label="<escaped>" data-kind="fetal_monitoring"
       data-baseline-fhr="<n>" data-variability="<cat>" data-duration-sec="<fmt>"
       data-px-per-sec="<fmt>"> … FHR panel … UA panel … </svg>
  ```
  `aria-label` = escaped `caption.en` (else `"Fetal monitoring tracing"` — **never** the category).

**Caption rule:** `caption` must never reveal the answer (do not caption "Late decelerations" or "Minimal variability" on an item asking the learner to identify them — the direct analogue of `rhythm_strip`'s "do not caption 'Atrial fibrillation'").

---

## 9. Fixtures

`valid` (≥5, spanning the category space — exercise each decel type + a variability contrast):
1. **Reassuring:** `baselineFhr:140, variability:"moderate"`, two contractions, one acceleration, no decels. `expected_pattern:{accelerations_present:true}`.
2. **Early decels:** contractions at `peakSec` 120/240; decels coupled, `nadirSec` ≈ each peak, gradual. `expected_pattern:{decelerations:["early"]}`.
3. **Late decels + minimal variability (the high-yield ominous pattern):** `variability:"minimal"`, decels coupled with `nadirSec` offset ~20 s after each contraction peak, gradual. `expected_pattern:{decelerations:["late"], variability:"minimal"}`.
4. **Variable decels:** no fixed phase coupling, abrupt (`durationSec` small relative to depth), nadirs not aligned to contractions. `expected_pattern:{decelerations:["variable"]}`.
5. **Prolonged decel:** one decel `durationSec:180`. `expected_pattern:{decelerations:["prolonged"]}`.

`invalid` (assert each `code`): `invalid_kind` (`kind:"rhythm_strip"`); `baseline_out_of_range` (`baselineFhr:400`); `invalid_variability` (`variability:"wandering"`); `duration_out_of_range` (`durationSec:30`); `invalid_decel_type` (`type:"prolonged_late"`); `decel_contraction_index_invalid` (`early` decel, `contractionIndex:9` with 1 contraction); `variable_decel_coupled` (`variable` decel with a `contractionIndex`); `acceleration_out_of_range` (`riseBpm:999`); `caption_en_required` (`caption:{en:""}`); `caption_zh_empty` (`caption:{en:"x",zh:""}`).

The conformance harness runs these automatically (valid → 0 validate errors, well-formed `<svg>…</svg>`, no `NaN`/`undefined`, deterministic ×2, `selfCheck` no-throw).

---

## 10. Tests (`scripts/tests/fetal-monitoring.ts`, register in `test-visuals`)

- Representative validation codes (`baseline_out_of_range`, `invalid_variability`, `decel_contraction_index_invalid`, `variable_decel_coupled`).
- Render determinism (×2 byte-identical, two seeds); both panels present; **no category/verdict text in the SVG** (regex-assert no "early"/"late"/"variable"/decel-name strings appear).
- **Phase `selfCheck` (the important matrix):**
  - fixture-2 early → 0 errors; **mutate its `nadirSec` to peak+20 (late phase) while leaving `type:"early"`** → `self_check_early_phase`. (The canonical wrong-phase regression.)
  - fixture-3 late → 0 errors; mutate `nadirSec` to ≈ peak → `self_check_late_phase`.
  - fixture-4 variable → 0 errors; widen `durationSec` so onset-to-nadir is gradual → `self_check_variable_not_abrupt`.
  - fixture-5 prolonged → 0 errors; shorten `durationSec` to 60 → `self_check_prolonged_duration`.
  - `expected_pattern.decelerations:["late"]` but spec has only early decels → `self_check_pattern_absent`.
  - `expected_pattern.variability:"moderate"` vs spec `variability:"minimal"` → `self_check_variability_mismatch`.
  - `meta` with empty `expected_pattern` → `self_check_no_keyed_pattern`.
  - `selfCheck({} as FetalMonitoringSpec, {})` → no throw, `[]`.
- Variability-amplitude (or construction) assertion per category band.
- Parity snapshots if the repo checks in visual hashes.

---

## 11. Acceptance / verification

```sh
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run census && npm run census:check
npm run build
```

All green at each window's exit. On the final window: `NCLEX-Question-Schema.md` gains a `fetal_monitoring` per-kind subsection (§5–§8 here) referencing the shared `meta` contract, documenting `expected_pattern`, the variability bands, and the decel phase definitions. Append `fetal_monitoring` to the kind taxonomy table. Add the `fhr_*` ID prefix to the content-lane list. Mark **U7 DONE** in `VISUAL-STIMULI-ROADMAP.md` and add `PROJECT-HISTORY.md` milestones (per window). **No content generation or promotion in this pass.**

---

## 12. Content lane (separate pass, after the renderer lands)

- ID prefix `fhr_*`, disjoint from other kinds.
- Generate → `banks/banks-raw/` → cross-model review (generator never reviews its own) → **source-check the variability bands, decel definitions, and management against NICHD/AWHONN (strictest tier)** → visual audit (the rendered tracing matches the declared pattern *in phase*; the keyed feature is not named in the stem; no verdict text) → human content review → `npm run promote` → merge into `banks/fhr-canonical.json` → `npm run audit` → ledger → delete raw.
- `selfCheck` machine-checks the phase/pattern, so human review concentrates on: is this a realistic tracing? is the category interpretation and recommended action correct? is the keyed feature load-bearing (only on the strip)? is the rationale position-agnostic (`DECISIONS.md` principle 4)?

---

## 13. Open decisions (flagged for Luke)

1. **Window budget.** Confirm a 2-window vs 3-window block. **Recommend:** plan 3, but window 2 (phase logic + its `selfCheck` gate) is the hard core — never ship it without the gate; window-3 polish can compress into window 2 if needed.
2. **Sinusoidal pattern.** Out of v1 (a fifth, mechanistically-distinct FHR pattern). **Recommend:** defer; add as `variability:"sinusoidal"` or a separate flag in a later pass if the content lane needs it.
3. **Symmetric decel synthesis.** §7.2 assumes a symmetric dip (`onsetToNadir = durationSec/2`). This keeps the phase math clean. **Recommend:** keep symmetric in v1; asymmetric onsets are an extension.
4. **Variability check style.** §7.3 step 5 can be a sampling check or a by-construction assertion. **Recommend:** by-construction (synthesize the noise so amplitude is exact), then a cheap construction assertion — avoids sampling fragility.

---

## 14. Do not touch

```text
src/schema.ts
src/App.tsx
scripts/validate-bank.ts
scripts/coverage-report.ts
scripts/census.ts
src/visuals/primitives/*    (graphPaper fmt/secondsToPx + prng mulberry32 are IMPORTED; never redefined.
                             Do NOT force ECG mm/mV scaling onto this kind — it uses its own bpm/mmHg y-scales.)
```
unless a failing test demonstrates a required change.

---

> Implemented across three checkpointed windows. The final renderer imports shared primitives, renders no category/verdict text, and remains an analytic enumerated synthesis rather than a physiological simulator. NICHD/AWHONN renderer-definition verification is recorded in `audit/u7-fetal-monitoring-source-verification-2026-06-12.md`. No content was generated or promoted.
