# U6 · `renderFieldPanel` primitive + `medication_label` Renderer Spec

**Type:** primitive (code) + renderer (code) + later content lane.
**Depends on:** U4 (table/form module — same file `src/visuals/primitives/table.ts`; `renderFieldPanel` is added *next to* `renderDocTable`).
**Concurrent-safe with:** U3/U4/U5 (already landed). **Sequences before U9** — U9 `device_screen` consumes `renderFieldPanel`, so U6 must merge first. Shared touch-points remain only the append-only union line and the registration line.
**Status:** implemented 2026-06-12.

Read `AGENTS.md`, `DECISIONS.md`, `VISUAL-STIMULI-ROADMAP.md`, and `NCLEX-Question-Schema.md` first; on any conflict they win. This spec covers the U6 row of the roadmap: the **`renderFieldPanel`** primitive (the second reusable panel/label layout, sibling to `renderDocTable`) and the first kind that consumes it, **`medication_label`** (synthetic vial / IV-bag / infusion product labels).

---

## 0. Why this is two jobs in one unit

`renderFieldPanel` is the U6/U9 analogue of what `lineChart` was for U2/U3 and `renderDocTable` was for U4/U5: **build the primitive reusably inside its first consumer; the second consumer (U9) is then small.** The forward-reference stub already lives at the bottom of `src/visuals/primitives/table.ts`. U6 replaces that comment with the real implementation and proves it through `medication_label`'s fixtures. Do not build the primitive without a consumer — it cannot be conformance-tested except through a kind.

A field panel differs from a doc table structurally: it is **key→value pairs**, optionally grouped into sections under a banner, with no column header and no time grid. A medication label and a PCA screen are both this shape; a flowsheet/MAR is a grid and stays on `renderDocTable`.

---

## 1. Purpose and necessity doctrine

`medication_label` renders a **synthetic medication product label** — a vial, ampule, IV bag/premix, or oral container — carrying the drug name and a **structured strength** (`amount` of drug per `perQty` `perUnit`). Targets (roadmap): dosage and infusion calculations, label verification, high-alert safety.

A label is a product artifact, so it is decorative-prone — the gating rule applies with full force:

1. **The load-bearing fact is the strength, and it must live *only* on the label.** The item earns the visual exactly when the learner must read the concentration off the label and apply it to an order stated in the stem. If the stem already states "heparin 100 units/mL," the label adds nothing and the item is a text calc. **Human review must confirm the strength is not restated in the stem.**
2. **The answer is a *computed* value the stem does not state** — a volume to draw, a quantity to give, an infusion rate, or the per-mL concentration itself. Removing the label makes that computation impossible. That is what makes it load-bearing.
3. **The keyed value is machine-recomputed, never trusted.** The item declares the computed answer in question-level `meta.derived_values_keyed`; `selfCheck` recomputes it from the spec's structured strength plus the order in `meta`, and asserts exact equality after a declared rounding (§6). Per the roadmap this arithmetic mismatch is a **build failure, not a content note**.
4. **The render must not print the keyed answer.** If the item keys on `concentration_per_ml`, the label must not display the derived concentration row; if it keys on a volume/rate, the label shows only the product strength, never the computed administration. The renderer derives any concentration it *does* show from `amount`/`perQty` — there is no free-text concentration field to drift (the io_record "nothing to hand-key" property).

`selfCheck` enforces *structure* and *arithmetic*. Stage-4 human review enforces clinical validity (realistic product, plausible order, nothing accidentally unsafe) and that the derivation is genuinely required.

### The dosage-engine trap (explicit non-goal)

We do **not** parse free-text doses or build a general unit-conversion engine. U4 deliberately treated MAR dose/frequency as opaque display strings for this reason. U6's arithmetic is confined to a **small enumerated derivation set** (§6.3), each a one-line formula over `amount`, `perQty`, and a single ordered quantity with a **matching unit**. Cross-unit conversion (mg↔mcg, mg/kg, mcg/kg/min, body-weight dosing) is **out of v1 scope** and is a candidate extension, flagged where relevant. If a derivation would require unit conversion, the item is out of scope for v1, not an excuse to grow the engine.

---

## 2. Files

```
src/visuals/primitives/table.ts        # ADD renderFieldPanel + measureFieldPanel beside renderDocTable (replace the stub comment)
src/visuals/primitives/graphPaper.ts   # ADD fmtNum + roundTo (pure numeric helpers) beside fmt — shared by U9 (and U8 later)
src/visuals/kinds/medication_label/
  index.ts                             # validate / selfCheck / renderSvg / fixtures + registerVisual(...)
  types.ts                             # MedLabelSpec + enums
```

Reuse `primitives/table.ts` (`renderFieldPanel`), `primitives/graphPaper.ts` (`fmt`), `primitives/escapeXml.ts`. Append-only shared lines:
- `src/visuals/types.ts`: `import type { MedLabelSpec } from "./kinds/medication_label/types";` and `… | MedLabelSpec;`
- `src/visuals/kinds/index.ts`: `import "./medication_label";`

No edits to `App.tsx` / `schema.ts` / `validate-bank.ts` / `coverage-report.ts` / `census.ts` (all registry-driven). If a step seems to require one, the framework was under-generalized — fix the framework, not the kind.

---

## 3. `renderFieldPanel` primitive (in `primitives/table.ts`)

Replace the forward-reference comment with a real implementation. Same conventions as `renderDocTable`: pure, deterministic, every coordinate through `fmt`, every free string through `escapeXml`, returns `<g class="field-panel">…</g>` (no `<svg>` wrapper — the kind wraps).

```ts
export interface FieldPanelField {
  label: string;
  value: string;
  emphasis?: "normal" | "bold" | "flag";   // default "normal"
}
export interface FieldPanelSection {
  heading?: string;                          // optional section divider row
  fields: FieldPanelField[];
}
export interface FieldPanelInput {
  title?: string;                            // banner across the top
  sections: FieldPanelSection[];
  variant?: "label" | "screen";              // visual treatment; default "label"
  width?: number;                            // default 360
  rowHeight?: number;                        // default 26
  bannerHeight?: number;                     // default 34
  headingHeight?: number;                    // default 24
}
export function renderFieldPanel(input: FieldPanelInput): string;
```

Behavior:

- **Layout.** Banner row (if `title`) → for each section: optional heading row (if `heading`) → one row per field rendered as `label` (left) … `value` (right). Two-zone row: label left-aligned at `x = PAD`, value right-aligned at `x = width − PAD`.
- **Deterministic height.** `totalHeight = (title ? bannerHeight : 0) + Σ_sections[(heading ? headingHeight : 0) + fields.length * rowHeight]`. The consuming kind recomputes the identical height for its `viewBox`. Expose this math so the kind does not duplicate magic numbers — either return height via a sibling helper `measureFieldPanel(input): number` or keep the formula documented and asserted by a test. (Recommend the helper; `renderDocTable` inlines its height, but U6/U9 both need the number, so a shared `measureFieldPanel` avoids drift.)
- **`variant: "label"`** (default): white panel (`#ffffff`), `#94a3b8` border, `rx=4`; banner `#e2e8f0` fill, `#1e293b` bold title; section heading `#475569` small-caps-ish (just `font-weight:600 font-size:11`); field label `#475569`, value `#0f172a`. Product-label feel.
- **`variant: "screen"`** (for U9): dark panel (`#0f172a`), `#1e293b` border; banner `#1e293b`, light title (`#e2e8f0`); field label `#94a3b8`, value `#bef264` (LCD green) `font-family:"ui-monospace, monospace"`. Device-display feel. (U6 uses `"label"`; `"screen"` ships now so U9 needs no primitive edit.)
- **`emphasis`.** `bold` → value `font-weight:600`. `flag` → yellow highlight rect behind the row in `label` variant (`#fef9c3`), amber value text (`#f59e0b`) in `screen` variant. **`flag` never asserts the answer** — it marks an out-of-range/attention value the *question* turns on, not a verdict; content review owns whether flagging is appropriate (mirror MAR's glyph rule).
- All text `escapeXml`'d; all coords `fmt`'d; no `Date`/`Math.random`/DOM/network; no module-level mutable state.

> Keep `renderFieldPanel` **dumb**: it lays out whatever fields it is handed. All "what to show / what to flag / what not to reveal" judgment lives in the kind and in content review. This is what keeps the primitive reusable by U9 without modification.

---

## 4. Placement (`allowedItemTypes`)

```
["multiple_choice", "select_all", "matrix", "fill_in_blank"]
```

Same rationale as `io_record`: numeric `fill_in_blank` (draw-up volume, mL/hr) is a primary use, and rendering is independent of answer-control type. Strictest-tier safety/verification items are commonly `multiple_choice`/`select_all`.

---

## 5. Spec type (`kinds/medication_label/types.ts`)

```ts
export type MedLabelAmountUnit = "mg" | "mcg" | "g" | "units" | "mEq" | "mmol";
export type MedLabelPerUnit = "mL" | "tablet" | "capsule";

export interface MedLabelExtraField {
  /** Printed ancillary fact: route, diluent, lot, exp, "Refrigerate", etc. Display string only — NEVER load-bearing. */
  label: string;
  value: string;
}

export interface MedLabelSpec {
  kind: "medication_label";
  /** Product/drug name as printed, e.g. "Heparin Sodium", "Digoxin". Display string. */
  drugName: string;
  /** Structured strength: `amount` `amountUnit` of drug per `perQty` `perUnit`. The load-bearing numbers. */
  amount: number;            // finite, > 0
  amountUnit: MedLabelAmountUnit;
  perQty: number;            // finite, > 0
  perUnit: MedLabelPerUnit;
  /** If true, render a DERIVED "Concentration: X amountUnit/mL" row computed from amount/perQty.
   *  MUST be false when the item keys on `concentration_per_ml` (would reveal the answer). Only meaningful when perUnit === "mL". */
  showDerivedConcentration?: boolean;
  /** Optional printed ancillary facts. Display only. */
  fields?: MedLabelExtraField[];
  caption?: { en: string; zh?: string };
}
```

Design notes:

- **Strength is `amount / perQty perUnit`**, not a free string. This is the io_record discipline applied to concentration: the load-bearing numbers are typed, so render and `selfCheck` read the same source and a printed concentration can never drift from it.
- **`perUnit` covers liquids and solids.** `mL` for vials/bags/infusions; `tablet`/`capsule` for oral counts (0.25 mg/tablet → "how many tablets for 0.5 mg"). **Open decision (recommend: include solids).** The roadmap names "vial / IV bag / infusion labels" (all `mL`). Solids add one enum value and *no new arithmetic shape* (still `amount/perQty`) and are high-yield NCLEX calcs. If you'd rather match the roadmap literally, cut `tablet`/`capsule` and the `quantity_to_administer_*` derivation; everything else stands.
- **No free concentration field.** Any displayed per-unit concentration is derived (`showDerivedConcentration`). There is nothing to hand-key.
- **`amountUnit` and the order unit must match** for the volume/rate derivations — no conversion (§1 trap). v1 rejects a units-mismatched order at `selfCheck` rather than converting.

---

## 6. Question-level `meta` + `selfCheck(spec, question)`

`medication_label` uses the canonical question-level `meta` block (§6.1 of the schema doc) and adds two kind-specific fields: `order` (the input the stem poses, which is NOT a label fact) and `derived_values_keyed` (the computed answer the item turns on).

### 6.1 `meta` shape

```jsonc
"meta": {
  // --- inherited canonical shape ---
  "visual_justification": "REQUIRED non-empty — why reading the strength off the label and applying it is the task.",
  "tier": "strictest",
  "source": "string (drug reference for strength/route).",
  "skill_signature": "medlbl:concentration-to-volume/heparin-bolus",
  "stem_disambiguators": ["heparin", "units"],

  // --- medication_label-specific ---
  "order": {
    "kind": "dose" | "dose_rate" | "none",  // "none" only when the sole keyed value is concentration_per_ml
    "value": 5000,                           // the ordered quantity; omitted/ignored when kind === "none"
    "unit": "units",                         // MUST equal spec.amountUnit for volume/quantity/rate derivations
    "round": 1                               // decimal places for the keyed result (0 | 1 | 2)
  },
  "derived_values_keyed": {
    // present key(s) select the derivation; value is the keyed answer AFTER rounding to order.round
    "volume_to_administer_ml": 50            // see §6.3 for the full key set
  }
}
```

### 6.2 `selfCheck` responsibilities

Follow `selfCheckIoRecord` defensive style — **never throws**; returns `[]` on malformed spec (the conformance harness calls it with `{}`):

1. **Necessity — justification.** `visual_justification` present/non-empty → else `self_check_missing_justification`.
2. **Necessity — keyed value.** `derived_values_keyed` present with ≥1 recognized key → else `self_check_no_keyed_values`.
3. **Order presence.** For any keyed derivation other than `concentration_per_ml`, `order.kind` ∈ {`dose`,`dose_rate`}, `order.value` finite > 0, and `order.unit === spec.amountUnit` → else `self_check_order_invalid` (covers missing order and unit mismatch — the no-conversion guard).
4. **Arithmetic gate (the core).** For each present key, recompute from the spec strength + order (§6.3), round to `order.round` (default `1`) with round-half-away-from-zero, and assert exact equality with the declared value → mismatch is `self_check_value_mismatch`. **Build failure, not a content note.**
5. **Internal consistency echo.** Re-assert `amount`, `perQty` finite > 0 (cheap, independent of `validate`) → `self_check_invalid_strength`.

`selfCheck` does **not** judge clinical validity (is 5,000 units a safe heparin bolus for *this* client?) — that is stage-4 review.

### 6.3 Derivation set (enumerated; the ONLY arithmetic v1 performs)

Let `cPerUnit = amount / perQty` (drug units per `perUnit`).

| `derived_values_keyed` key | Requires | Formula | Result unit |
|---|---|---|---|
| `concentration_per_ml` | `perUnit === "mL"`; `order.kind` may be `"none"` | `amount / perQty` | `amountUnit`/mL |
| `volume_to_administer_ml` | `perUnit === "mL"`; `order.kind === "dose"`; `order.unit === amountUnit` | `order.value / cPerUnit` | mL |
| `quantity_to_administer_tablets` | `perUnit === "tablet"`; `order.kind === "dose"`; `order.unit === amountUnit` | `order.value / cPerUnit` | tablets |
| `quantity_to_administer_capsules` | `perUnit === "capsule"`; `order.kind === "dose"`; `order.unit === amountUnit` | `order.value / cPerUnit` | capsules |
| `rate_ml_per_hr` | `perUnit === "mL"`; `order.kind === "dose_rate"`; `order.unit === amountUnit` (rate is `amountUnit`/hr) | `order.value / cPerUnit` | mL/hr |

A present key whose `perUnit`/`order.kind` preconditions are unmet → `self_check_derivation_unsupported` (do not attempt the math). Multiple keys may be present (e.g., `concentration_per_ml` + `volume_to_administer_ml`); each is checked independently.

**Rounding.** Add a shared pure helper `roundTo(x, places)` to `primitives/graphPaper.ts` (beside `fmt`/`fmtNum`): `Math.round((x + Number.EPSILON) * 10**places) / 10**places` (positive doses ⇒ half-up == half-away-from-zero). **U6 creates the single definition; U9 and later arithmetic kinds (U8 Parkland) import it — never copy it into a kind.** Sharing here is a correctness property, not just DRY: one canonical rounding transform means every kind rounds identically, and divergent per-kind rounding is exactly the silent inconsistency the deterministic-core principle (`DECISIONS.md`) forbids. NCLEX convention is standard rounding to the stated precision; the content lane keys the value at that precision and declares `order.round`. Equality after rounding is exact — no clinical epsilon (contrast `lab_trend`'s `stableEps`, which exists because *measured* labs are noisy; computed doses are not).

---

## 7. `validate(spec): VisualError[]`

Defensive (`validateIoRecord`/`validateMar` style); never throw.

| Check | `code` |
|---|---|
| `kind === "medication_label"` | `invalid_kind` |
| `drugName` non-empty string | `drug_name_missing` |
| `amount` finite number `> 0` | `invalid_amount` |
| `amountUnit` ∈ vocab | `invalid_amount_unit` |
| `perQty` finite number `> 0` | `invalid_per_qty` |
| `perUnit` ∈ {`mL`,`tablet`,`capsule`} | `invalid_per_unit` |
| `amount <= MAX_AMOUNT`, `perQty <= MAX_PER_QTY` (misplaced-digit sanity bounds) | `amount_out_of_range` / `per_qty_out_of_range` |
| `showDerivedConcentration` boolean if present; if `true`, `perUnit` must be `"mL"` | `invalid_show_concentration` |
| each `fields[i]` has non-empty `label` and `value` (strings) | `extra_field_invalid` |
| `caption` rule (en required if present; zh non-empty if present) | `caption_en_required` / `caption_zh_empty` |

`MAX_AMOUNT = 1_000_000` (covers e.g. 1,000,000-unit products), `MAX_PER_QTY = 5_000` (mL of a large bag). **Calibratable placeholders, not clinical claims** — widen if a legitimate product trips them in the content lane (mirror io_record's `MAX_ENTRY_ML`).

No duplicate-field check on `fields`: ancillary printed facts are free display strings and are never load-bearing (they are not read by `selfCheck`).

---

## 8. `renderSvg(spec): string`

One `renderFieldPanel` call, `variant: "label"`, wrapped in `<svg>`.

- **Title** = `drugName`.
- **Section** (single, no heading): fields in order
  1. `{ label: "Amount", value: \`${fmtNum(amount)} ${amountUnit}\` }`
  2. `{ label: "Volume" | "Per", value: \`${fmtNum(perQty)} ${perUnit}\` }` (label "Volume" when `perUnit==="mL"`, else "Per unit")
  3. if `showDerivedConcentration` *and* `perUnit==="mL"`: `{ label: "Concentration", value: \`${fmtNum(amount/perQty)} ${amountUnit}/mL\` }` — **derived, never from a free field**
  4. spread any `spec.fields` as additional `{label,value}` rows.
- `fmtNum` formats integers without trailing `.0` and uses a thousands separator for readability of large unit counts (e.g. `25,000`). Keep it pure/deterministic; do not use `toLocaleString` (locale-dependent) — implement a small fixed grouping helper. **Export it from `primitives/graphPaper.ts` beside `fmt`** (it is a pure numeric formatter; that is its home, not `escapeXml.ts`). U9 imports the same `fmtNum`.
- Wrap: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 <h>" role="img" aria-label="<escaped>" data-kind="medication_label"> … </svg>`, where `<h> = measureFieldPanel(input)` and `aria-label` = escaped `caption.en` (else `drugName`).
- **No clinical editorializing**: no `flag` styling on a label row in v1 (a label states facts; flagging would assert a verdict). Reserve `flag` for U9's settings.
- **Answer-reveal guard (render-side):** when `showDerivedConcentration` is `true` the item must NOT key on `concentration_per_ml` — caught by content review, not the renderer; the renderer simply honors the flag. State this in the per-kind schema subsection and the content-lane checklist.
- Deterministic: identical spec → byte-identical SVG.

**Caption rule:** `caption` must never reveal the answer or clinical interpretation (do not caption "High-alert anticoagulant — verify dose").

---

## 9. Fixtures

`valid` (≥3, exercise each `perUnit`):
1. **Heparin premix bag (mL, rate).** `drugName:"Heparin Sodium"`, `amount:25000, amountUnit:"units", perQty:250, perUnit:"mL"`, `showDerivedConcentration:false`, `fields:[{label:"Diluent",value:"D5W"}]`, caption en/zh. (Pairs with a `rate_ml_per_hr` or `volume_to_administer_ml` item.)
2. **Digoxin vial (mL, volume).** `amount:0.5, amountUnit:"mg", perQty:2, perUnit:"mL"` (= 0.25 mg/mL). (Pairs with `volume_to_administer_ml` for an ordered mg dose → tenths.)
3. **Levothyroxine tablet (tablet, quantity).** `amount:0.05, amountUnit:"mg", perQty:1, perUnit:"tablet"` (= 50 mcg/tablet). (Pairs with `quantity_to_administer_tablets`.) *(omit if solids are cut per §5.)*

`invalid` (assert each `code`): `invalid_kind` (`kind:"mar"`); `drug_name_missing` (`drugName:""`); `invalid_amount` (`amount:0`); `invalid_amount_unit` (`amountUnit:"mL"`); `invalid_per_qty` (`perQty:-1`); `invalid_per_unit` (`perUnit:"vial"`); `amount_out_of_range` (`amount:9_999_999`); `invalid_show_concentration` (`showDerivedConcentration:true, perUnit:"tablet"`); `extra_field_invalid` (`fields:[{label:"",value:"x"}]`); `caption_en_required` (`caption:{en:""}`); `caption_zh_empty` (`caption:{en:"x",zh:""}`).

The conformance harness runs these automatically (valid → 0 validate errors, well-formed `<svg>…</svg>`, no `NaN`/`undefined`, deterministic ×2, `selfCheck` no-throw).

---

## 10. Tests (`scripts/tests/medication-label.ts`, register in `test-visuals`)

- Representative validation codes (`invalid_amount`, `invalid_per_unit`, `amount_out_of_range`, `extra_field_invalid`).
- Render determinism + a `measureFieldPanel`/render height-agreement assertion.
- **Arithmetic `selfCheck` (the important one):**
  - fixture-1 heparin, order `{kind:"dose_rate", value:1000, unit:"units", round:0}`, keyed `{rate_ml_per_hr: 10}` → 0 errors (1000 ÷ (25000/250=100) = 10).
  - fixture-2 digoxin, order `{kind:"dose", value:0.125, unit:"mg", round:1}`, keyed `{volume_to_administer_ml: 0.5}` → 0 errors (0.125 ÷ 0.25 = 0.5).
  - planted wrong keyed (`volume_to_administer_ml: 0.6`) → `self_check_value_mismatch`.
  - unit mismatch (`order.unit:"mcg"` vs `amountUnit:"mg"`) → `self_check_order_invalid`.
  - `concentration_per_ml` with `order.kind:"none"` → checks `amount/perQty`, no order required.
  - `derivation_unsupported`: keyed `rate_ml_per_hr` on a `tablet` product → `self_check_derivation_unsupported`.
  - `selfCheck({} as MedLabelSpec, {})` → no throw, `[]`.
- **`renderFieldPanel` primitive tests** (can live in this file or `registry-mechanics`): both variants render a `<g class="field-panel">`, height = `measureFieldPanel`, `flag` emphasis emits the highlight/amber, `escapeXml` on a `<script>`-bearing label.
- Update parity snapshots if the repo checks in visual hashes.

---

## 11. Acceptance / verification

```sh
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run census
npm run census:check
npm run build
```

All green. `NCLEX-Question-Schema.md` gains a `medication_label` per-kind subsection (§4–§8 here), referencing the shared §6.1 `meta` contract, documenting `order` + the `derived_values_keyed` key set, and stating the `showDerivedConcentration` answer-reveal rule. Append `medication_label` to the kind taxonomy table. Mark **U6 DONE** in `VISUAL-STIMULI-ROADMAP.md` and add a `PROJECT-HISTORY.md` milestone. **No content generation or promotion in this pass.**

---

## 12. Content lane (separate pass, after the renderer lands)

- ID prefix `medlbl_*`, disjoint from other kinds.
- Generate → `banks/banks-raw/` → cross-model review (generator never reviews its own) → **source-check the strength against a drug reference (strictest tier)** → visual audit (label matches spec; strength is not restated in the stem; `showDerivedConcentration` is false when concentration is keyed) → human content review → `npm run promote` → merge into `banks/medlbl-canonical.json` → `npm run audit` → ledger entry → delete raw.
- `selfCheck` machine-checks the arithmetic, so human review concentrates on: is this a real product at a real strength? is the order clinically plausible? is the strength load-bearing (only on the label)? does the rationale interpret the result and the high-alert safety angle correctly and position-agnostically (`DECISIONS.md` principle 4)?

---

## 13. Error codes

Validation:
```text
invalid_kind
drug_name_missing
invalid_amount
invalid_amount_unit
invalid_per_qty
invalid_per_unit
amount_out_of_range
per_qty_out_of_range
invalid_show_concentration
extra_field_invalid
caption_en_required
caption_zh_empty
```
Self-check:
```text
self_check_missing_justification
self_check_no_keyed_values
self_check_order_invalid
self_check_value_mismatch
self_check_invalid_strength
self_check_derivation_unsupported
```

---

## 14. Canonical render example (heparin bag, `variant:"label"`)

```text
┌─────────────────────────────┐
│  Heparin Sodium             │   ← banner (title)
├─────────────────────────────┤
│  Amount            25,000 units │
│  Volume                250 mL   │
│  Diluent                D5W     │
└─────────────────────────────┘
```
Stem supplies the order ("infuse at 1,000 units/hr"); the learner computes 10 mL/hr; `selfCheck` recomputes 1000 ÷ (25000/250) = 10 and asserts it equals the keyed `rate_ml_per_hr`.

---

## 15. Do not touch

```text
src/schema.ts
src/App.tsx
scripts/validate-bank.ts
scripts/coverage-report.ts
scripts/census.ts
```
unless a failing test demonstrates a required change. `renderDocTable` is **not** modified — `renderFieldPanel` is added beside it. `graphPaper.ts` **is** edited: add `fmtNum` and `roundTo` beside `fmt` (the shared homes for both helpers; U9/U8 import them).

---

> Implement U6 exactly as specified: add `renderFieldPanel` (+ `measureFieldPanel`) to `primitives/table.ts`, then the `medication_label` kind. Follow the established `io_record`/`mar` structure; prefer copying it over inventing abstractions. The arithmetic is a strict, machine-checked gate — a keyed value that disagrees with the recompute is a build failure. Do NOT build a dosage/unit-conversion engine; v1 is the five enumerated same-unit derivations only. Do not perform content generation or promotion.
