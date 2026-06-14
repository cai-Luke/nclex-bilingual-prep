# U10 · `injection_site` Renderer Spec

**Type:** renderer (code) + later content lane.
**Depends on:** U0 only. No primitive dependency — `injection_site` is a self-contained skin cross-section in the `rhythm_strip`/`capnography`/`burn_map`/`fetal_monitoring` family (bespoke SVG geometry), not a `renderFieldPanel`/`renderDocTable`/`lineChart` consumer.
**Concurrent-safe with:** anything (own files; only the append-only union + registration lines are shared).
**Status:** renderer implemented 2026-06-14; content lane remains closed pending strictest-tier source verification. **Net-new beyond the original ten-kind roadmap — this pass re-opens the visual taxonomy** (kind #11). See §11.

Read `AGENTS.md`, `DECISIONS.md`, `VISUAL-STIMULI-ROADMAP.md`, and `NCLEX-Question-Schema.md` first; on any conflict they win. This spec covers a new visual kind: **`injection_site`** — a schematic skin cross-section (epidermis → dermis → subcutaneous tissue → muscle, with a fixed vessel) and a needle inserted at a route-canonical angle terminating at a route-canonical depth. The load-bearing output is **the parenteral route (or the target tissue layer), read from the needle's geometry against the labeled layers**. This is the parametrized replacement for the decorative AI-generated "injection routes" figure that circulates on social study feeds.

---

## 1. Purpose and necessity doctrine

`injection_site` renders a stack of labeled skin layers and a single needle whose **angle** and **termination depth** are determined by a parenteral `route`. It exists to support route-identification and target-layer-identification items that are *load-bearing*, and to replace asset-sourced or AI-generated injection diagrams (the explicit reason the kind is worth building rather than sourcing).

A layered skin diagram is **decorative-prone in exactly the way the circulating figure is.** The gating rule binds hard:

1. **The load-bearing fact is *the needle's angle and depth*, and it must live *only* on the figure.** The item earns the visual exactly when reading the needle's trajectory and termination layer off the diagram **is** the task — "a needle is inserted as shown; identify the route," or "the needle tip lies in which structure." The stem must **not** name the route or the angle.
2. **The canonical decorative trap — bar it explicitly.** "Which injection route provides the fastest absorption?" with a four-panel ID/SubQ/IM/IV figure is **invalid**: the answer (IV) is resolvable from the stem and options alone, so the figure is decorative. Removing the figure must change the answer, or the item is a text question. Human review rejects any item whose stem already names the depicted route or whose answer survives deletion of the visual.
3. **The discriminating cue is geometry, not feature presence.** The vessel is **always** rendered (a fixed vein in the dermal/subcutaneous plane), so "there is a vein, therefore IV" is never the tell. IV is identified by the needle entering the **vessel lumen**, not by the vessel existing. Likewise every layer is always drawn and labeled, burned-or-not style, so the figure always reads as skin.
4. **The render must not print the answer.** The figure may label the anatomical layers (§8) and nothing else. It must **never** display the route name (`"Intramuscular"`), the angle (`"90°"`), or any verdict. A route/angle label would hand the learner the answer (§1.1).

Unlike the arithmetic kinds (`burn_map`/`io_record`/`medication_label`/`device_screen`), **`injection_site` performs no arithmetic.** Its `selfCheck` is in the `fetal_monitoring` family: it enforces *necessity* and *declared-vs-spec consistency*, not a recomputed number (§6). Clinical validity — is the route appropriate for the drug in the stem? is the correct option the one the geometry implies? — is Stage-4 human review.

### Scope traps (explicit non-goals for v1)

- **No hot-spot / click-the-layer item type.** Identifying the target layer is done with ordinary `multiple_choice`/`matrix` against the labeled figure (the needle terminates in the target layer; the load-bearing read is tip-position-relative-to-labeled-bands). A click-to-select answer mechanic is a **new item type**, schema-bump-gated (≥ `1.4`, with `bowtie`), and is **out of scope** — confirmed.
- **No geometry-keyed error-identification in v1.** v1 is **route-keyed only**: `route` → canonical `(angle, target)` from a fixed table. Rendering a *wrong* technique (e.g. a 90° needle bottoming out in subcutaneous fat) to ask "what is wrong here?" requires decoupled `angleDeg` + `target` inputs and a richer `selfCheck`; it is a **flagged v2 extension** (§14), not v1.
- **No anatomical illustration.** This is a *schematic* cross-section (labeled rectangular tissue bands + a straight needle + a simple vessel ellipse), not a rendered anatomy plate — same discipline as `burn_map`'s schematic silhouette.

---

## 2. Files

```
src/visuals/kinds/injection_site/
  index.ts            # validate / selfCheck / renderSvg / fixtures + registerVisual(...)
  types.ts            # InjectionSiteSpec + enums
  routes.ts           # FIXED route→(angle, target) table + skin-layer band geometry (see §4, §8)
```

Reuse `primitives/graphPaper.ts` (`fmt`) and `primitives/escapeXml.ts`. No new primitive; no PRNG (the figure is fully deterministic from `route` — omit `seed`). Append-only shared lines:
- `src/visuals/types.ts`: `import type { InjectionSiteSpec } from "./kinds/injection_site/types";` and `… | InjectionSiteSpec;`
- `src/visuals/kinds/index.ts`: `import "./injection_site";`

No edits to `App.tsx` / `schema.ts` / `validate-bank.ts` / `coverage-report.ts` / `census.ts` (all registry-driven). If a step seems to require one, the framework was under-generalized — fix the framework, not the kind.

**Why `routes.ts` is split out:** the angle/target table is the strictest-tier clinical constant in this kind (the same role `regions.ts`'s Rule-of-Nines table plays for `burn_map`), and the layer-band geometry is bulky. Keeping both in one colocated module makes the source-verify audit target a single file and keeps `index.ts` to validate/selfCheck/render/fixtures. The kind still registers once.

---

## 3. Placement (`allowedItemTypes`)

Use the **global default** — omit `allowedItemTypes` entirely:

```
["multiple_choice", "select_all", "matrix"]
```

There is no numeric derivation, so **`fill_in_blank` is deliberately not supported** (unlike `burn_map`/`io_record`/`medication_label`/`device_screen`). Route-ID and single-target-layer-ID are `multiple_choice`; "which of these routes reach muscle / match each insertion to its route" are `select_all`/`matrix`. Rendering is independent of answer-control type.

---

## 4. The route table (`routes.ts`) — strictest-tier constant

Two fixed tables: the parenteral routes (angle + target tissue) and the skin-layer band geometry.

```ts
export type InjectionRoute =
  | "intradermal" | "subcutaneous" | "intramuscular" | "intravenous";

export type SkinLayerKey = "epidermis" | "dermis" | "subcutaneous" | "muscle";

/** A needle may terminate in a tissue layer or in the vessel lumen (IV). */
export type InjectionTarget = SkinLayerKey | "vessel";

export interface RouteGeometry {
  /** Canonical insertion angle measured FROM THE SKIN-SURFACE PLANE, in degrees:
   *  0° = flat along the surface, 90° = perpendicular (straight in, deepest). See §4. */
  angleDeg: number;
  /** Where the needle tip terminates. */
  target: InjectionTarget;
}

// FIXED, strictest-tier. Angles are teaching conventions; SEE the source-verify note.
export const ROUTE_TABLE: Record<InjectionRoute, RouteGeometry> = {
  intradermal:   { angleDeg: 10, target: "dermis" },        // 5–15°; draw ~10–15°
  subcutaneous:  { angleDeg: 45, target: "subcutaneous" },  // 45° standard (90°-with-pinch is a v2 variant, §14)
  intramuscular: { angleDeg: 90, target: "muscle" },
  intravenous:   { angleDeg: 25, target: "vessel" },        // 15–30°; draw ~25°
};

export const INJECTION_ROUTES = Object.keys(ROUTE_TABLE) as InjectionRoute[];
```

- **These four routes are the firm, standard NCLEX teaching set.** ID 5–15° into dermis; SubQ 45° (or 90° pinched) into subcutaneous fat; IM 90° into muscle; IV 15–30° into a vein.
- **The vessel is anatomy, not a route input.** It is a fixed feature of the cross-section (§8), targeted only by `intravenous`.
- **Angle convention (codify, or the renderer inverts).** `angleDeg` is measured **from the skin-surface plane**: `0°` lies flat along the surface, `90°` is perpendicular — straight down into the tissue, deepest. Insertion proceeds downward-and-inward from the surface entry point. A naïve "angle from vertical" reading inverts the whole figure (ID would become near-perpendicular, IM near-flat); the §10 "IM steeper than ID" test exists to catch exactly that.

> **STRICTEST-TIER accuracy requirement (the watch-item).** The canonical angles above are conventional and must be **source-verified against an authoritative reference (e.g. Potter & Perry / Lippincott fundamentals, current nursing skills standard) and the source recorded per route in the U10 audit report before the content lane opens** — mirror `lab_trend`'s reference-range note and `burn_map`'s Rule-of-Nines note. The SubQ 45°-vs-90° distinction (needle length / body habitus / pinch technique) is real and is the most likely place a single fixed angle is contestable; v1 ships the canonical 45° and defers the 90°-pinch variant (§14).

### Skin-layer band geometry (`routes.ts`)

A fixed top-to-bottom stack of tissue bands within the figure's local coordinate box, plus the vessel. Representative bands (final pixels are Codex's to settle; the *order, relative thickness, and the rule that the needle tip lands in the target band* are the contract):

| Layer | Relative depth | Notes |
|---|---|---|
| `epidermis` | thin top band | |
| `dermis` | below epidermis | ID terminates here |
| `subcutaneous` | thick band | SubQ terminates here; contains the vessel |
| `muscle` | bottom band | IM terminates here |
| vessel (lumen) | ellipse within the dermal/subcutaneous plane | IV terminates here; **always drawn** |

```ts
export interface LayerBand { key: SkinLayerKey; y0: number; y1: number; fill: string; label: string; }
export const LAYER_BANDS: LayerBand[];   // fixed; ordered surface→deep
export const VESSEL_GEOMETRY: { cx: number; cy: number; rx: number; ry: number };  // fixed lumen
```

---

## 5. Spec type (`kinds/injection_site/types.ts`)

```ts
import type { InjectionRoute } from "./routes";

export interface InjectionSiteSpec {
  kind: "injection_site";
  /** The depicted parenteral route. Selects the canonical (angle, target) from ROUTE_TABLE.
   *  This is the ONLY load-bearing content. */
  route: InjectionRoute;
  caption?: { en: string; zh?: string };
}
```

Design notes:
- **`route` is the load-bearing data; angle and target are never on the spec.** The renderer and `selfCheck` both derive `(angle, target)` from `route` + the fixed table, so a displayed needle can never drift from a keyed answer. There is nothing to hand-key — same discipline as `burn_map` deriving %TBSA from `burns`.
- **No `angleDeg` / `target` / `pinch` / `showVessel` in v1.** Decoupled geometry (error-identification) and the pinch variant are flagged v2 extensions (§14). Keeping the spec to `{ route, caption }` keeps `validate` a membership check and `selfCheck` a consistency check.

---

## 6. Question-level `meta` + `selfCheck(spec, question)`

`injection_site` uses the canonical question-level `meta` block (schema doc §"Visual contract metadata") and adds one kind-specific field, `expected`, in the `fetal_monitoring` `expected_pattern` family (a declared contract the auditor reads and `selfCheck` verifies against the spec). **No arithmetic.**

### 6.1 `meta` shape

```jsonc
"meta": {
  // --- inherited canonical shape ---
  "visual_justification": "REQUIRED non-empty — why reading the needle's angle/depth off the figure is the task.",
  "tier": "strictest",
  "source": "Parenteral route angle/depth reference (recorded per route, §4).",
  "skill_signature": "inj:identify-route/intramuscular-90deg",
  "stem_disambiguators": ["injection", "needle angle"],

  // --- injection_site-specific (the declared contract) ---
  "expected": {
    "route": "intramuscular",        // REQUIRED. MUST equal visual.route.
    "target": "muscle"               // OPTIONAL. If present, MUST equal ROUTE_TABLE[route].target. ("vessel" for IV; not a layer.)
  }
}
```

### 6.2 `selfCheck` responsibilities

Follow the defensive `selfCheckFetalMonitoring` style — **never throws**; returns `[]` on malformed spec (the conformance harness calls it with `{}`):

1. **Necessity — justification.** `visual_justification` present/non-empty → else `self_check_missing_justification`.
2. **Necessity — declared cue.** `meta.expected.route` present → else `self_check_no_expected_cue`.
3. **Route consistency.** `meta.expected.route === spec.route` → else `self_check_route_mismatch`. (Guards the meta and spec drifting; gives the auditor one honest statement of the keyed answer.)
4. **Target consistency (if declared).** When `meta.expected.target` is present, `=== ROUTE_TABLE[spec.route].target` → else `self_check_target_mismatch`.
5. **Internal consistency echo.** `spec.route ∈ INJECTION_ROUTES` (cheap, independent of `validate`) → else `self_check_invalid_route`.

`selfCheck` does **not** verify the answer-option text or that the stem omits the route name — that is Stage-4 review (the `fetal_monitoring` "stem must not name the pattern" rule applied to routes). It asserts only that the declared `expected` matches what the figure will actually draw.

---

## 7. `validate(spec): VisualError[]`

Defensive (`validateFetalMonitoring`/`validateBurnMap` style); never throw. Does **not** read `meta`.

| Check | `code` |
|---|---|
| `kind === "injection_site"` | `invalid_kind` |
| `route ∈ INJECTION_ROUTES` | `invalid_route` |
| `caption` rule (en required if present; zh non-empty if present) | `caption_en_required` / `caption_zh_empty` |

---

## 8. `renderSvg(spec): string` — the bespoke skin cross-section

A self-contained deterministic SVG, no PRNG. The figure is a **single stacked cross-section**: labeled tissue bands surface-to-deep, a fixed vessel in the dermal/subcutaneous plane, and one needle inserted from the surface at the route's canonical angle, terminating in the route's target.

- **Bands.** Draw every `LAYER_BANDS` entry as a filled `<rect>` surface→deep, each with its anatomical label (§ label rule). Distinct, muted tissue fills (e.g. epidermis lightest, muscle a deep red-brown); fixed, not load-bearing color.
- **Vessel — always drawn, never labeled.** Render `VESSEL_GEOMETRY` as a lumen ellipse in the dermal/subcutaneous plane regardless of `route`, so vessel presence is never the route tell (§1.3). It carries **no label** — no `vein`, `vessel`, or `lumen` text. IV is identified by the needle tip resting *inside* the ellipse, never by a caption naming it.
- **Needle — anchored at the tip, drawn back to the surface.** To keep every route in-frame (a near-flat 10° ID needle runs far horizontally if projected forward from a fixed entry point), define the needle by its **tip** — the mid-depth of the target band, or the vessel-lumen center for `intravenous` — then compute the entry point and syringe barrel **backward** along `ROUTE_TABLE[route].angleDeg` using the surface-plane angle convention (§4). Choose the tip position so all four routes' full needle **and** barrel sit inside the viewBox; this is a firm invariant (§10 asserts it). Tag the needle path with a non-answer-bearing hook (e.g. `data-element="needle"`) so geometry tests can extract it without reading a route. Every coordinate through `fmt`. The tip's resting band/lumen is the load-bearing read.
- **Labels — English layer names only (LOCKED, §14.1).** Render the four anatomical layer names on-figure in **English** (`Epidermis` / `Dermis` / `Subcutaneous tissue` / `Muscle`), consistent with the English-primary exam surface and the `mar`/`device_screen` on-figure-English precedent; bilingual parity is satisfied at the item level (stem, options, glossary). **Forbidden on-figure text:** the route name, the angle/degree value, any vessel/vein/lumen label (see Vessel above), and any verdict. `escapeXml` all text.
- **Determinism.** Fixed coordinates + computed needle endpoint; identical spec → byte-identical SVG. No `Date`/`Math.random`/DOM/network/module-level mutable state.
- **Wrap:**
  ```
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 <W> <H>" role="img"
       aria-label="<escaped>" data-kind="injection_site">
    … bands · vessel · needle …
  </svg>
  ```
  `aria-label` = escaped `caption.en` (else `"Injection cross-section"` — **never** the route or angle). Suggested `viewBox="0 0 480 360"`.

**Caption rule:** `caption` must never reveal the answer or clinical interpretation (no "Intramuscular injection at 90°"). The route is **not** embedded anywhere in the SVG string — not as text and not as a `data-*` attribute; tests derive geometry from known route inputs, never by reading a route attribute back out (§10).

---

## 9. Fixtures

`valid` (one per route, exercising route-ID and layer-ID framings):
1. `intramuscular` → `expected:{ route:"intramuscular", target:"muscle" }`.
2. `subcutaneous` → `expected:{ route:"subcutaneous", target:"subcutaneous" }`.
3. `intradermal` → `expected:{ route:"intradermal", target:"dermis" }`, `caption:{en:"Skin cross-section", zh:"皮肤横断面"}`.
4. `intravenous` → `expected:{ route:"intravenous", target:"vessel" }`.

`invalid` (assert each `code`): `invalid_kind` (`kind:"mar"`); `invalid_route` (`route:"intraosseous"`); `caption_en_required` (`caption:{en:""}`); `caption_zh_empty` (`caption:{en:"x",zh:""}`).

The conformance harness runs these automatically (valid → 0 validate errors, well-formed `<svg>…</svg>`, no `NaN`/`undefined`, deterministic ×2, `selfCheck` no-throw).

---

## 10. Tests (`scripts/tests/injection-site.ts`, register in `test-visuals`)

- Representative validation codes (`invalid_route`, `caption_en_required`).
- Render determinism (×2 byte-identical); `<svg data-kind="injection_site">` well-formed.
- **Geometry distinctness:** render the four known route inputs, extract each needle path via its `data-element="needle"` hook (never a route attribute), and assert the four paths are pairwise non-identical and that the **IM needle is steeper (closer to vertical) than the ID needle** — which also catches an inverted angle convention (§4).
- **Answer-reveal guard:** SVG output contains **no** route name (`intradermal|subcutaneous|intramuscular|intravenous`, case-insensitive), **no** vessel label (`vein|vessel|lumen`), and **no** degree/angle text (regex-assert no `°` and no `\bangle\b`).
- **In-frame invariant:** for all four routes, every needle and syringe-barrel coordinate lies within `[0,W] × [0,H]` (guards the near-flat ID needle from running off-canvas, §8).
- **Vessel-always guard:** the vessel element renders for a non-IV route (regression against the "vein ⇒ IV" tell).
- **`selfCheck`:**
  - fixture-1 with matching `expected` → 0 errors.
  - planted `expected.route:"subcutaneous"` on an `intramuscular` spec → `self_check_route_mismatch`.
  - planted `expected.target:"dermis"` on `intramuscular` → `self_check_target_mismatch`.
  - `meta` without `expected.route` → `self_check_no_expected_cue`.
  - missing `visual_justification` → `self_check_missing_justification`.
  - `selfCheck({} as InjectionSiteSpec, {})` → no throw, `[]`.
- Update parity snapshots if the repo checks in visual hashes.

---

## 11. Acceptance / verification

```sh
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run census && npm run census:check
npm run build
```

All green. Documentation/registration updates (renderer pass only):
- `NCLEX-Question-Schema.md` gains an `injection_site` per-kind subsection (§5–§8 here), referencing the shared `meta` contract, documenting `expected` + the answer-reveal (no route/angle text) rule, and noting the route-table source-verify requirement.
- Append `injection_site` to the kind taxonomy table.
- Add the `inj_*` ID prefix to the content-lane list.
- **Re-open `VISUAL-STIMULI-ROADMAP.md`:** add a `U10` row (status: renderer specced → in progress), and note the kind is net-new beyond the original ten-kind surface. Luke flagged other diagram-mold kinds may follow; leave the roadmap open rather than re-closing it on U10 landing.
- Add a `PROJECT-HISTORY.md` milestone. **No content generation or promotion in this pass.**

---

## 12. Content lane (separate pass, after the renderer lands)

- ID prefix `inj_*`, disjoint from other kinds.
- Generate → `banks/banks-raw/` → cross-model review (generator never reviews its own) → **source-check the route angle/target table against an authoritative reference (strictest tier), recorded per route** → visual audit (needle geometry matches `route`; the stem does **not** name the route or angle; no route/angle text rendered; the figure is load-bearing — answer dies if the visual is removed) → human content review → `npm run promote` → merge into `banks/injection-canonical.json` → `npm run audit` → ledger entry → delete raw.
- `selfCheck` machine-checks necessity + declared-vs-spec consistency, so human review concentrates on: **is the figure load-bearing** (does the stem accidentally name the route? does the answer survive deleting the visual — the decorative trap, §1.2)? is the correct option the one the geometry implies? is the route clinically appropriate for any drug the stem names? is the rationale position-agnostic (`DECISIONS.md` principle 4)?

---

## 13. Error codes

Validation:
```text
invalid_kind
invalid_route
caption_en_required
caption_zh_empty
```
Self-check:
```text
self_check_missing_justification
self_check_no_expected_cue
self_check_route_mismatch
self_check_target_mismatch
self_check_invalid_route
```

---

## 14. Open decisions (flagged for Luke)

1. **Layer-label language on the figure — RESOLVED (locked v1).** English anatomical layer names on-figure (`Epidermis` / `Dermis` / `Subcutaneous tissue` / `Muscle`); Chinese carried at the item level (stem, options, glossary), not on the figure. Rationale: the NCLEX is an English-only exam surface and Chinese is comprehension scaffolding, so English is the surface the learner must read; bilingual on-figure labels also crowd the cross-section. Consistent with the `mar`/`device_screen` on-figure-English precedent. Encoded in §8.
2. **SubQ 90°-with-pinch variant.** v1 ships canonical SubQ at 45°. The 90°-pinched-skin technique is real and testable. **Recommend:** defer to v2 as an optional `pinch?: boolean` (renders pinched skin + 90° short needle), keeping v1 to the four canonical routes.
3. **Vessel always-rendered.** v1 draws the vessel for every route so its presence is not an IV tell (§1.3). **Recommend:** keep always-rendered; confirm you don't instead want it only on IV (which I'd argue against on necessity grounds).
4. **Layer set.** v1 fixes four tissue bands + vessel. **Recommend:** keep minimal; do not add fascia/bone/nerve unless a content need appears.
5. **v2 geometry-keyed extension (not v1).** Decoupled `angleDeg` + `target` to render *wrong* technique for error-identification items ("what is wrong with the technique shown?"). Noted as the natural v2; confirm it stays out of v1.

---

## 15. Do not touch

```text
src/schema.ts
src/App.tsx
scripts/validate-bank.ts
scripts/coverage-report.ts
scripts/census.ts
src/visuals/primitives/*          (graphPaper fmt is IMPORTED; never redefined)
```
unless a failing test demonstrates a required change.

---

> Implement U10 as a self-contained kind: a schematic skin cross-section (fixed labeled tissue bands + an always-drawn vessel) + a FIXED route→(angle, target) table (`routes.ts`, source-verify pending) + a needle drawn at the route's canonical angle terminating in its canonical layer. Follow the `burn_map`/`fetal_monitoring` kind structure; import `fmt` from `graphPaper.ts` — do not redefine it. There is NO arithmetic — `selfCheck` enforces necessity + declared-vs-spec route/layer consistency only. Render no route name or angle on the figure. The vessel is always drawn so its presence is not an IV tell. v1 is route-keyed only: do NOT build decoupled angle/layer inputs, the 90°-pinch variant, or a click-to-select layer mechanic. No content generation or promotion.

---

## Appendix A — Paste-ready `NCLEX-Question-Schema.md` edits (checklist step 5)

Two append-only edits to `NCLEX-Question-Schema.md`; do not reflow neighboring kinds. Transcribe verbatim.

### A.1 — Taxonomy table row

Append to the **Visual kind taxonomy** table, immediately after the `burn_map` row:

```
| `injection_site` | Schematic skin cross-section (epidermis→muscle with a fixed vessel) and a needle at a route-canonical angle/depth, for parenteral route or target-layer identification |
```

### A.2 — Per-kind subsection

Insert after the `### Kind: ``burn_map`` ` subsection (kinds are append-only). The block below is the subsection to paste:

````md
### Kind: `injection_site`

Renders a schematic skin cross-section — epidermis, dermis, subcutaneous tissue, and muscle as labeled bands, plus a fixed vessel in the dermal/subcutaneous plane — with a single needle inserted at the canonical angle and depth for a parenteral `route`. The visual is load-bearing only when the learner must read the needle's angle and termination layer off the figure to identify the route (or the target tissue). If the stem names the route or the angle, or the answer is resolvable from the options alone (e.g. "which route is fastest?"), the figure is decorative and the item is invalid.

`injection_site` uses the global default placement (`multiple_choice`, `select_all`, `matrix`); it does **not** support `fill_in_blank` (there is no numeric derivation). The needle's angle and termination depth are fixed per route and derived by the renderer — never stored on the spec.

```json
{
  "visual": {
    "kind": "injection_site",
    "route": "intramuscular",
    "caption": { "en": "Skin cross-section with needle", "zh": "带针头的皮肤横断面" }
  },
  "meta": {
    "visual_justification": "The learner must read the needle's angle and termination depth from the figure to identify the route; the stem does not name it.",
    "tier": "strictest",
    "source": "Parenteral route angle/depth reference (recorded per route).",
    "skill_signature": "inj:identify-route/intramuscular-90deg",
    "stem_disambiguators": ["injection", "needle angle"],
    "expected": {
      "route": "intramuscular",
      "target": "muscle"
    }
  }
}
```

Controlled vocabularies:
- `route`: `intradermal`, `subcutaneous`, `intramuscular`, `intravenous`.
- `meta.expected.target` is the canonical termination for the route and is derived, not varied independently in v1: `intradermal → dermis`, `subcutaneous → subcutaneous`, `intramuscular → muscle`, `intravenous → vessel`. The target vocabulary is the four layer keys (`epidermis`, `dermis`, `subcutaneous`, `muscle`) plus `vessel`; v1 routes never terminate in `epidermis`.

Canonical geometry (fixed in the kind, strictest-tier — source-verify before the content lane opens):
- `intradermal` ≈ 10° into dermis; `subcutaneous` 45° into subcutaneous tissue; `intramuscular` 90° into muscle; `intravenous` ≈ 25° into the vessel lumen.
- Angle is measured **from the skin-surface plane**: 0° lies flat along the surface, 90° is perpendicular (deepest).

Validation rules:
- `kind` must be `"injection_site"`.
- `route` must be one of `intradermal`, `subcutaneous`, `intramuscular`, `intravenous`.
- `caption.en`, if `caption` is present, is required. `caption.zh` is optional but must be non-empty if present.

`selfCheck` rules (necessity + declared-vs-spec consistency; no arithmetic):
- `meta.visual_justification` must be present and non-empty (`self_check_missing_justification`).
- `meta.expected.route` must be present (`self_check_no_expected_cue`) and must equal `visual.route` (`self_check_route_mismatch`).
- If `meta.expected.target` is present, it must equal the canonical target for `visual.route` (`self_check_target_mismatch`).

- **Answer-reveal rule:** the SVG may label only the four anatomical layers (in English) and nothing else. It must never render the route name, the insertion angle/degree, any vessel/vein/lumen label, or the route as a `data-*` attribute — any of these hands the learner the answer.
- **Content rule:** the stem must not name the route or the insertion angle when the learner is expected to identify it from the figure.
- **STRICTEST tier.** The route→(angle, target) table is a fixed clinical constant; it must be source-verified and recorded per route before the content lane opens (mirror `lab_trend`/`burn_map`). Human review confirms the figure is load-bearing (the answer dies if the visual is removed) and that the depicted route is clinically appropriate for any drug named in the stem.

Future content uses globally unique `inj_*` IDs and remains subject to raw → cross-model review → visual source verification → promote → ledger.
````

### A.3 — Other doc touches (mechanical; already enumerated in §11)

- `VISUAL-STIMULI-ROADMAP.md`: add a `U10` row and re-open the surface (do not re-close on landing).
- `PROJECT-HISTORY.md`: add the U10 renderer milestone.
- Content-lane prefix list (`CLAUDE.md` and/or `visual-content-lanes-spec.md`, wherever the `cap_*`…`fhr_*` set lives): append `inj_*` to the disjoint-prefix set.
