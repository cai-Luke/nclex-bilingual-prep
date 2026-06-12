# U8 · `burn_map` Renderer Spec

**Type:** renderer (code) + later content lane.
**Depends on:** U0 only. No primitive dependency — `burn_map` is a self-contained body schematic in the `rhythm_strip`/`capnography` family (bespoke SVG geometry), not a `renderFieldPanel`/`renderDocTable`/`lineChart` consumer.
**Concurrent-safe with:** anything (own files; only the append-only union + registration lines are shared). Concurrent with U7.
**Status:** specced (not implemented).

Read `AGENTS.md`, `DECISIONS.md`, `VISUAL-STIMULI-ROADMAP.md`, and `NCLEX-Question-Schema.md` first; on any conflict they win. This spec covers the U8 row: **`burn_map`** — a schematic anterior/posterior body with shaded burned regions, whose load-bearing output is **%TBSA derived from the shaded regions** (Rule of Nines) and, from it, **Parkland fluid arithmetic**. This is the "stylized diagram (the one survivor)" from the roadmap.

---

## 1. Purpose and necessity doctrine

`burn_map` renders a schematic human body (anterior + posterior silhouettes) with discrete anatomical regions; the burned regions are shaded. The targets (roadmap): Rule of Nines %TBSA estimation, Parkland formula fluid resuscitation, burn severity classification.

A body diagram is decorative-prone — it can be slapped onto any burn scenario. The gating rule binds hard:

1. **The load-bearing fact is *which regions are burned*, and it must live *only* on the map.** The item earns the visual exactly when reading the shaded regions off the diagram and summing their Rule-of-Nines percentages to a %TBSA is the task. **If the stem already states "%TBSA is 36%," the map is decorative and the item is a text Parkland calc.** Human review confirms %TBSA is not restated in the stem.
2. **The answer is a *computed* value the stem does not state** — the %TBSA itself, or a Parkland volume/rate derived from %TBSA plus a patient weight stated in the stem. Removing the map makes that computation impossible. That is what makes it load-bearing.
3. **The keyed value is machine-recomputed, never trusted.** The item declares the computed answer in question-level `meta.derived_values_keyed`; `selfCheck` recomputes %TBSA from the shaded regions (a sum of fixed, source-verified Rule-of-Nines constants) and Parkland from %TBSA + weight, and asserts exact equality after a declared rounding (§6). A mismatch is a **build failure, not a content note** (`DECISIONS.md` principle 11).
4. **The render must not print the answer.** The map shades regions; it must never display a "%TBSA: 36%" total or a Parkland volume. Fixed per-view labels ("Anterior" / "Posterior") are allowed; per-region percentage labels are **not** (they would hand the learner the summands). See §8.

`selfCheck` enforces *structure* and *arithmetic*. Stage-4 human review enforces clinical validity (is this a plausible burn distribution? is the weight realistic? is the severity interpretation correct?) and that the derivation is genuinely required.

### The estimation-engine trap (explicit non-goal)

We do **not** estimate fractional-region burns or build a Lund-Browder age-interpolation engine. v1 burns are **whole `(region)` units only** — the way Rule-of-Nines NCLEX items are constructed — so %TBSA is a clean **sum of fixed constants**, never a judgment about "what fraction of the anterior trunk is burned." The percentage table is a **fixed, source-verified constant in the kind**, keyed by `(population, regionKey)`; the content item declares only *which* regions burned. Anything requiring fractional-area estimation or age-banded Lund-Browder interpolation is **out of v1 scope** and a flagged extension (§5, §12), not a reason to grow an estimator. This is the U6 dosage-engine discipline applied to body-surface arithmetic.

---

## 2. Files

```
src/visuals/kinds/burn_map/
  index.ts            # validate / selfCheck / renderSvg / fixtures + registerVisual(...)
  types.ts            # BurnMapSpec + enums
  regions.ts          # FIXED Rule-of-Nines percentage table + region geometry (see §4, §8)
```

Reuse `primitives/graphPaper.ts` (`fmt`, `fmtNum`, `roundTo`) and `primitives/escapeXml.ts`. No new primitive. Append-only shared lines:
- `src/visuals/types.ts`: `import type { BurnMapSpec } from "./kinds/burn_map/types";` and `… | BurnMapSpec;`
- `src/visuals/kinds/index.ts`: `import "./burn_map";`

No edits to `App.tsx` / `schema.ts` / `validate-bank.ts` / `coverage-report.ts` / `census.ts` (all registry-driven). If a step seems to require one, the framework was under-generalized — fix the framework, not the kind.

**Why `regions.ts` is split out:** the percentage table is the strictest-tier clinical constant in this kind, and the geometry table is bulky. Keeping both in one colocated module (a) makes the source-verify audit target a single file, and (b) keeps `index.ts` to validate/selfCheck/render/fixtures like the other kinds. The kind still registers once.

---

## 3. Placement (`allowedItemTypes`)

```
["multiple_choice", "select_all", "matrix", "fill_in_blank"]
```

Same rationale as `io_record`/`medication_label`: a keyed %TBSA or Parkland mL/hr is a primary numeric `fill_in_blank` use; severity-classification and "which regions count" items are `multiple_choice`/`select_all`/`matrix`. Rendering is independent of answer-control type.

---

## 4. The Rule-of-Nines table (`regions.ts`) — strictest-tier constant

A **flat** region-key enumeration (one entry per body segment × body aspect), each mapped to a fixed percentage **per population**. Flat keys (not `segment × aspect` objects) keep validation a membership check and dedup trivial, mirroring `DeviceSettingKey`.

```ts
export type BurnPopulation = "adult" | "pediatric";

export type BurnRegionKey =
  | "head_anterior" | "head_posterior"
  | "trunk_anterior" | "trunk_posterior"
  | "arm_l_anterior" | "arm_l_posterior"
  | "arm_r_anterior" | "arm_r_posterior"
  | "leg_l_anterior" | "leg_l_posterior"
  | "leg_r_anterior" | "leg_r_posterior"
  | "genitalia";

// FIXED. Each population's values MUST sum to exactly 100.0. A unit test asserts this.
export const TBSA_PCT: Record<BurnPopulation, Record<BurnRegionKey, number>> = {
  adult: {
    head_anterior: 4.5,  head_posterior: 4.5,
    trunk_anterior: 18,  trunk_posterior: 18,
    arm_l_anterior: 4.5, arm_l_posterior: 4.5,
    arm_r_anterior: 4.5, arm_r_posterior: 4.5,
    leg_l_anterior: 9,   leg_l_posterior: 9,
    leg_r_anterior: 9,   leg_r_posterior: 9,
    genitalia: 1,
  },
  pediatric: {
    // PLACEHOLDER — modified pediatric Rule of Nines. MUST be source-verified before
    // the content lane opens (see the accuracy watch-item below). One common teaching:
    // larger head, smaller legs; arms/trunk/genitalia as adult. Representative values
    // that sum to 100 are given so fixtures and the sum-to-100 test pass; do NOT treat
    // them as clinically authoritative until verified and recorded in the U8 audit report.
    head_anterior: 9,    head_posterior: 9,
    trunk_anterior: 18,  trunk_posterior: 18,
    arm_l_anterior: 4.5, arm_l_posterior: 4.5,
    arm_r_anterior: 4.5, arm_r_posterior: 4.5,
    leg_l_anterior: 6.75, leg_l_posterior: 6.75,
    leg_r_anterior: 6.75, leg_r_posterior: 6.75,
    genitalia: 1,
  },
};

export const BURN_REGION_KEYS = Object.keys(TBSA_PCT.adult) as BurnRegionKey[];
```

- **Adult Rule of Nines is firm and standard.** Head 9 (4.5/4.5), each arm 9 (4.5/4.5), anterior trunk 18, posterior trunk 18, each leg 18 (9/9), genitalia 1 → 100.
- **`genitalia` is aspect-less** (perineum, 1%): a single flat key with no anterior/posterior split. It renders on the anterior view by convention.
- **Sum-to-100 invariant.** A test asserts `Σ TBSA_PCT[pop] === 100` for every population. This is the cheapest guard against a corrupted table.

> **STRICTEST-TIER accuracy requirement (the roadmap watch-item).** Adult/pediatric proportions differ, and the wrong chart silently corrupts %TBSA. The **adult** table is standard Rule of Nines. The **pediatric** table above is a placeholder for the *modified pediatric Rule of Nines* and **must be source-verified against an authoritative reference before the content lane opens**, with the source recorded per population in the U8 audit report (mirror `lab_trend`'s reference-range note). **Age-banded Lund-Browder** (infant / 1 / 5 / 10 / 15 yr) is the precise pediatric tool and is **out of v1 scope** — flagged as the extension if finer pediatric accuracy is needed; v1 ships a single `pediatric` population.

---

## 5. Spec type (`kinds/burn_map/types.ts`)

```ts
import type { BurnPopulation, BurnRegionKey } from "./regions";

export interface BurnMapSpec {
  kind: "burn_map";
  /** Which body-surface table to use AND how to annotate the figure. Default "adult".
   *  This is the depicted patient's class; weight + age remain stem facts. */
  population?: BurnPopulation;
  /** The shaded (burned) regions. ≥1 entry; no duplicates; each ∈ BurnRegionKey. The ONLY load-bearing content. */
  burns: BurnRegionKey[];
  caption?: { en: string; zh?: string };
}
```

Design notes:
- **`burns` is the load-bearing data; %TBSA is never on the spec.** Same discipline as `io_record` totals: the renderer and `selfCheck` both derive %TBSA from `burns` + the fixed table, so a displayed/keyed %TBSA can never drift from the shaded figure. There is nothing to hand-key.
- **`population` lives on the spec** (not `meta`), matching `vitals_trend`/`lab_trend` precedent — it selects the percentage table for *both* `validate`/`selfCheck` arithmetic and any rendered annotation. **Weight is NOT on the spec** — it is the stem-stated patient fact, supplied in `meta.weight_kg` (§6), exactly as `medication_label` keeps the ordered dose in `meta`, not on the label.
- **Whole regions only.** No fractional/percent-of-region field. Fractional-area estimation is the explicit non-goal (§1).

---

## 6. Question-level `meta` + `selfCheck(spec, question)`

`burn_map` uses the canonical question-level `meta` block (schema doc §"Visual contract metadata") and adds two kind-specific fields: `weight_kg` (a stem fact, needed for Parkland) and `derived_values_keyed`.

### 6.1 `meta` shape

```jsonc
"meta": {
  // --- inherited canonical shape ---
  "visual_justification": "REQUIRED non-empty — why reading the burned regions off the map and summing to %TBSA is the task.",
  "tier": "strictest",
  "source": "Rule of Nines + Parkland reference (e.g. ABA/ATLS).",
  "skill_signature": "burn:rule-of-nines-parkland/adult-major-burn",
  "stem_disambiguators": ["Rule of Nines", "Parkland"],

  // --- burn_map-specific ---
  "weight_kg": 70,        // REQUIRED for any parkland_* key; a stem fact, NOT on the body map. finite > 0.
  "round": 0,             // decimal places for keyed results (0 | 1 | 2); default 0
  "derived_values_keyed": {
    // present key(s) select the derivation; value is the keyed answer AFTER rounding
    "tbsa_pct": 36,
    "parkland_total_ml": 10080,
    "parkland_first8h_ml": 5040,
    "parkland_rate_first8h_ml_hr": 630
  }
}
```

An item supplies ≥1 recognized `derived_values_keyed` key. `tbsa_pct` is the natural always-available key; the `parkland_*` keys additionally require `weight_kg`.

### 6.2 `selfCheck` responsibilities

Follow `selfCheckMedicationLabel`/`selfCheckIoRecord` defensive style — **never throws**; returns `[]` on malformed spec (the conformance harness calls it with `{}`):

1. **Necessity — justification.** `visual_justification` present/non-empty → else `self_check_missing_justification`.
2. **Necessity — keyed value.** `derived_values_keyed` present with ≥1 recognized key → else `self_check_no_keyed_values`.
3. **Weight presence.** For any `parkland_*` key, `meta.weight_kg` finite `> 0` → else `self_check_weight_missing` (analogue of `medication_label`'s order-presence guard; `tbsa_pct` alone needs no weight).
4. **Arithmetic gate (the core).** For each present key, recompute from `burns` + the population table + `weight_kg` (§6.3), round to `meta.round` (default `0`) with the shared `roundTo`, assert exact equality → mismatch is `self_check_value_mismatch`. **Build failure, not a content note.**
5. **Internal consistency echo.** `burns` non-empty and every entry ∈ `BurnRegionKey` with no duplicate (cheap, independent of `validate`) → `self_check_invalid_burns`.

`selfCheck` does **not** judge clinical plausibility (is a 70 kg adult with 36% TBSA a realistic scenario? is the severity classification right?) — that is stage-4 review.

### 6.3 Derivation set (enumerated; the ONLY arithmetic v1 performs)

Let `tbsa = Σ TBSA_PCT[population][k] for k in burns` (a sum of fixed constants).

| `derived_values_keyed` key | Requires | Formula | Result unit |
|---|---|---|---|
| `tbsa_pct` | `burns` | `Σ TBSA_PCT[population][k]` | % |
| `parkland_total_ml` | `weight_kg` | `4 * weight_kg * tbsa` | mL (first 24 h) |
| `parkland_first8h_ml` | `weight_kg` | `4 * weight_kg * tbsa / 2` | mL |
| `parkland_rate_first8h_ml_hr` | `weight_kg` | `(4 * weight_kg * tbsa / 2) / 8` | mL/hr |

- Parkland formula: **4 mL × weight(kg) × %TBSA** for the first 24 h, **half in the first 8 h**, half over the next 16 h. The first-8-hour rate is the highest-yield NCLEX number.
- A present key whose precondition is unmet (`parkland_*` without `weight_kg`) → `self_check_weight_missing` (don't attempt the math).
- **Out of v1 (flagged extensions, not built):** `parkland_next16h_ml` and `parkland_rate_next16h_ml_hr` (trivially `total/2` over 16 h — add later if the content lane wants them); severity *classification* (minor/moderate/major) is a human-review judgment, not an arithmetic key. Keep the set to these four.

**Rounding.** Use the shared `roundTo` from `primitives/graphPaper.ts` (created in U6) — **do not redefine it.** One canonical rounding transform means U6/U9/U8 round identically (`DECISIONS.md` deterministic-core principle). Parkland volumes/rates are conventionally whole numbers; default `round: 0`. Equality after rounding is exact — no clinical epsilon (computed fluid volumes are not noisy measurements). Note that `4 * 70 * 36 = 10080` is already integral; declare `round` deliberately for cases where the division yields a fraction (e.g. an odd %TBSA → a fractional mL/hr).

---

## 7. `validate(spec): VisualError[]`

Defensive (`validateMedicationLabel`/`validateIoRecord` style); never throw.

| Check | `code` |
|---|---|
| `kind === "burn_map"` | `invalid_kind` |
| `population` (if present) ∈ {`adult`,`pediatric`} | `invalid_population` |
| `burns` is a non-empty array | `burns_empty` |
| each `burns[i]` ∈ `BurnRegionKey` | `invalid_region` |
| no duplicate region in `burns` | `duplicate_region` |
| `caption` rule (en required if present; zh non-empty if present) | `caption_en_required` / `caption_zh_empty` |

No upper bound on burn count beyond "≤ all keys" (the dedup + membership checks already bound it). `validate` does **not** read `meta` — weight/derived values are `selfCheck`'s job (mirror how `validate` never touches `meta` in the other arithmetic kinds).

---

## 8. `renderSvg(spec): string` — the bespoke body schematic

A self-contained deterministic SVG, no PRNG (no randomness needed; omit `seed` entirely). The figure is **two side-by-side schematic silhouettes** — anterior (left) and posterior (right) — each composed of the region sub-shapes, with burned regions shaded.

- **Geometry table in `regions.ts`.** A fixed `REGION_GEOMETRY: Record<BurnRegionKey, { view: "anterior" | "posterior"; shape: string }>` where `shape` is an SVG path/rect/polygon `d`/coordinates for that region within its silhouette's local coordinate box. Keep geometry schematic (head = circle/ellipse, trunk = rounded rect, limbs = capsules/rects) — this is a *diagram*, not an anatomical illustration. `genitalia` is a small region at the base of the anterior trunk. Every coordinate through `fmt`.
- **One schematic figure for both populations (v1).** Do **not** attempt two anatomically-accurate population-shaped silhouettes — that reintroduces the very "wrong chart" inaccuracy the table guards against, in geometry instead of arithmetic. The `population` parameter governs the **percentage table and a rendered text annotation** (e.g. a small `"Pediatric"` / `"Adult"` tag), not the silhouette shape. (Optionally scale the head slightly larger when `pediatric` as a visual cue — cosmetic only, never load-bearing. Recommend skipping in v1 to keep geometry fixed.)
- **Shading.** Burned regions: solid fill `#dc2626` at `opacity 0.55` (or a deterministic 45° hatch `<pattern>` if you prefer print-style — pick one, keep it fixed). Unburned regions: skin fill `#f1f5f9`, outline `#94a3b8 stroke-width 1.5`. Region outlines are **always** drawn (burned or not) so the body always reads as a body.
- **Labels.** Allowed: a fixed `"Anterior"` / `"Posterior"` caption under each silhouette and the population tag. **Forbidden:** any per-region percentage label and any %TBSA/Parkland total — these would reveal the summands or the answer (§1.4). `escapeXml` all text.
- **Determinism.** Fixed coordinates from the geometry table; identical spec → byte-identical SVG. No `Date`/`Math.random`/DOM/network/module-level mutable state.
- **Wrap:**
  ```
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 <W> <H>" role="img"
       aria-label="<escaped>" data-kind="burn_map" data-population="<pop>">
    … two silhouettes …
  </svg>
  ```
  `aria-label` = escaped `caption.en` (else `"Burn diagram"` — **never** the burned regions or %TBSA). Pick fixed `W`/`H` (e.g. `viewBox="0 0 480 360"`) sized for two silhouettes side by side.

**Caption rule:** `caption` must never reveal the answer or clinical interpretation (no "36% TBSA major burn", no "Anterior trunk + both legs").

---

## 9. Fixtures

`valid` (≥3, exercise adult + pediatric + a parkland-only/tbsa-only split):
1. **Adult, anterior trunk + both anterior legs (classic 36%).** `population:"adult"`, `burns:["trunk_anterior","leg_l_anterior","leg_r_anterior"]` (18 + 9 + 9 = 36). Pairs with `tbsa_pct:36` and the Parkland chain at `weight_kg:70` (`parkland_total_ml:10080`, `parkland_first8h_ml:5040`, `parkland_rate_first8h_ml_hr:630`).
2. **Adult, both full arms + head anterior (single-aspect mix).** `burns:["arm_l_anterior","arm_l_posterior","arm_r_anterior","arm_r_posterior","head_anterior"]` (4.5×4 + 4.5 = 22.5). Pairs with `tbsa_pct:22.5`, `round:1`.
3. **Pediatric, full head + anterior trunk.** `population:"pediatric"`, `burns:["head_anterior","head_posterior","trunk_anterior"]` (9 + 9 + 18 = 36 with the placeholder table). Pairs with `tbsa_pct:36`. *(Recompute the expected value from whatever the source-verified pediatric table ends up being.)*

`invalid` (assert each `code`): `invalid_kind` (`kind:"mar"`); `invalid_population` (`population:"neonate"`); `burns_empty` (`burns:[]`); `invalid_region` (`burns:["left_foot"]`); `duplicate_region` (`burns:["trunk_anterior","trunk_anterior"]`); `caption_en_required` (`caption:{en:""}`); `caption_zh_empty` (`caption:{en:"x",zh:""}`).

The conformance harness runs these automatically (valid → 0 validate errors, well-formed `<svg>…</svg>`, no `NaN`/`undefined`, deterministic ×2, `selfCheck` no-throw).

---

## 10. Tests (`scripts/tests/burn-map.ts`, register in `test-visuals`)

- **Table integrity:** `Σ TBSA_PCT[pop] === 100` for `adult` and `pediatric` (the cheapest corruption guard).
- Representative validation codes (`invalid_region`, `duplicate_region`, `invalid_population`).
- Render determinism (×2 byte-identical); `<svg data-kind="burn_map">` well-formed; burned regions emit the shade fill, unburned do not; **no percentage/total text appears in the SVG** (regex-assert the output contains no `%` digit-label and no Parkland number).
- **Arithmetic `selfCheck` (the important one):**
  - fixture-1 → `tbsa_pct:36` and the full Parkland chain at `weight_kg:70` → 0 errors (`4*70*36=10080`, `/2=5040`, `/8=630`).
  - planted wrong keyed (`tbsa_pct:40`) → `self_check_value_mismatch`.
  - `parkland_total_ml` keyed but `weight_kg` absent → `self_check_weight_missing`.
  - `meta` with no recognized key → `self_check_no_keyed_values`.
  - pediatric fixture → `tbsa_pct` recompute uses the pediatric table, not adult (regression against the "wrong chart" hazard).
  - `selfCheck({} as BurnMapSpec, {})` → no throw, `[]`.
- Update parity snapshots if the repo checks in visual hashes.

---

## 11. Acceptance / verification

```sh
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run census && npm run census:check
npm run build
```

All green. `NCLEX-Question-Schema.md` gains a `burn_map` per-kind subsection (§5–§8 here), referencing the shared `meta` contract, documenting `weight_kg` + the `derived_values_keyed` key set + the answer-reveal (no rendered totals) rule, and noting the adult/pediatric table source-verify requirement. Append `burn_map` to the kind taxonomy table. Add the `burn_*` ID prefix to the content-lane list. Mark **U8 DONE** in `VISUAL-STIMULI-ROADMAP.md` and add a `PROJECT-HISTORY.md` milestone. **No content generation or promotion in this pass.**

---

## 12. Content lane (separate pass, after the renderer lands)

- ID prefix `burn_*`, disjoint from other kinds.
- Generate → `banks/banks-raw/` → cross-model review (generator never reviews its own) → **source-check the population %TBSA table and the Parkland convention against an authoritative reference (strictest tier)** → visual audit (shaded regions match `burns`; %TBSA is not restated in the stem; no totals rendered) → human content review → `npm run promote` → merge into `banks/burn-canonical.json` → `npm run audit` → ledger entry → delete raw.
- `selfCheck` machine-checks the arithmetic, so human review concentrates on: is this a plausible burn distribution? is the weight realistic for the population? is %TBSA load-bearing (only on the map)? does the rationale interpret severity and the Parkland staging correctly and position-agnostically (`DECISIONS.md` principle 4)?
- **Pediatric items are blocked until the pediatric table is source-verified and recorded** (§4 watch-item). Adult items may proceed first.

---

## 13. Error codes

Validation:
```text
invalid_kind
invalid_population
burns_empty
invalid_region
duplicate_region
caption_en_required
caption_zh_empty
```
Self-check:
```text
self_check_missing_justification
self_check_no_keyed_values
self_check_weight_missing
self_check_value_mismatch
self_check_invalid_burns
```

---

## 14. Open decisions (flagged for Luke)

1. **Pediatric model.** v1 ships a single `pediatric` population on a *modified Rule of Nines* table (placeholder in §4). Confirm whether that's the intended scope, or whether pediatric should be deferred entirely until age-banded Lund-Browder is built (in which case ship `adult`-only v1 and cut `population`). **Recommend:** ship `adult` + placeholder `pediatric`, gate pediatric *content* on source-verification.
2. **Shade style.** Solid translucent red vs deterministic hatch pattern. **Recommend:** solid translucent (`#dc2626 @ 0.55`) for simplicity; hatch only if the print-style look matters.
3. **Whole-region-only.** v1 forbids fractional regions (§1). Confirm this matches how you want Rule-of-Nines items built. **Recommend:** keep whole-region-only; it's how the formula is taught and keeps the arithmetic a constant sum.

---

## 15. Do not touch

```text
src/schema.ts
src/App.tsx
scripts/validate-bank.ts
scripts/coverage-report.ts
scripts/census.ts
src/visuals/primitives/*          (graphPaper helpers are IMPORTED — fmt/fmtNum/roundTo; never redefined)
```
unless a failing test demonstrates a required change.

---

> Implement U8 as a self-contained kind: bespoke anterior/posterior body schematic + a FIXED Rule-of-Nines percentage table (`regions.ts`, sum-to-100 tested) + Parkland arithmetic gate. Follow the `medication_label`/`io_record` kind structure; import `fmt`/`fmtNum`/`roundTo` from `graphPaper.ts` — do not redefine them. The arithmetic is a strict, machine-checked gate — a keyed value disagreeing with the recompute is a build failure. Render no %TBSA or Parkland totals on the figure. Do NOT build a fractional-area estimator or Lund-Browder interpolation; v1 is whole regions + the four enumerated derivations. The pediatric table is a placeholder pending source-verification. No content generation or promotion.
