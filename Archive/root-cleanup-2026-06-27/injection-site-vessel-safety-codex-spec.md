# injection_site vessel-safety hardening — Codex spec

Status: ready to implement. Author: Claude (planning/spec). Implementer: Codex.
Trust basis: builds on the verified audit `INJECTION-SITE-VISUAL-AUDIT-HANDOFF-2026-06-27.md`.
Start from that audit, but **re-run the narrow search at implementation time** (it is free)
to confirm the active item set before patching:

```sh
rg -n "injection_site|Injection route recognition|needle tip|subcutaneous|intradermal|intramuscular|intravenous|vessel|vein" banks src
```

Expectation to confirm: exactly the 8 items in `banks/gpt-canonical.json`, no new
`visual.kind === "injection_site"` items elsewhere. If the set differs, stop and flag —
the per-item mapping below assumes those 8.

(Revised after a GPT design review; all five review points are folded into the relevant
sections below — schema-doc update, `vesselEntry` guard, single-source geometry,
bare-IV split, re-run search.)

## Problem (one paragraph)

`src/visuals/kinds/injection_site/index.ts` renders a single hardcoded vessel
(`data-element="blood-channel"`, `VESSEL_GEOMETRY` cx=330 cy=162 rx=25 ry=11)
**unconditionally for every route**, and every route's needle converges on
`TIP_X = 350`. The intramuscular needle is a vertical line at x=350 straight
through the vessel; the 45° subcutaneous needle clips it as well. Result: safe-route
visuals depict the needle puncturing a vessel to reach its target. This is a global
renderer property, not per-item JSON — so every present and future `injection_site`
item is unsafe by construction, not just the 8 audited rows.

## Decision (the load-bearing call)

The fix is a **data-contract change**, not a geometry tweak, for one decisive reason:
audited items **02** (subcutaneous, vessel irrelevant) and **07** (subcutaneous,
vessel is the rejected-distractor cue) are the **same route** but require **different
vessel behavior**. Route alone cannot disambiguate "show no vessel" from "show a
vessel the needle must visibly avoid." That distinction is per-item clinical intent
and must become typed spec data. A pure relocation of one fixed vessel cannot express
it and would be brittle besides (the needles converge at x=350, so any vessel at
injection depth tends to be clipped by the SC/IV sweep).

This mirrors principle 11: type the load-bearing geometric relationship on the spec
and let `selfCheck` recompute and assert it, so an unsafe figure is a **build failure**,
not a content note.

## The invariant

For any `injection_site` visual:

> The rendered needle segment intersects a rendered vessel **iff** the item's vessel
> relation is `target` (vascular access). For every non-`target` state the needle
> segment must be provably clear of every rendered vessel.

`target` is permitted only on `route: "intravenous"` (the only current vascular-access
state). A future explicit unsafe/contraindicated state would extend the allowlist; it
does not exist yet and must not be implied.

## Schema / data-contract change

### `src/visuals/kinds/injection_site/types.ts`

Add an optional, typed vessel relation. No per-item coordinates (placement is derived
deterministically by the renderer — keep the "no free-text geometry" discipline of
principle 11).

```ts
import type { InjectionRoute } from "./routes";

export type VesselRelation = "target" | "bystander";

export interface InjectionSiteSpec {
  kind: "injection_site";
  route: InjectionRoute;
  /**
   * Optional vessel rendered in the cross-section.
   *  - "target":    needle enters the vessel; valid ONLY for route "intravenous".
   *  - "bystander": a vessel is shown but the needle must NOT intersect it
   *                 (the "don't conclude IV just because a vessel is visible" cue).
   *  - omitted:     no vessel is rendered.
   */
  vessel?: VesselRelation;
  caption?: { en: string; zh?: string };
}
```

The union in `src/visuals/types.ts` imports this type, so the optional field flows
through with no edit there. Confirm `src/schema.ts` routes visual-spec validation
through the kind registry (`getVisual(...).validate` / `selfCheck`) — it does via the
registry contract — so the kind module below is the only spec-validation touch-point.
If `schema.ts` carries any injection_site-specific branch, it must not reject the new
optional key.

### `NCLEX-Question-Schema.md` (schema doc — required, not optional)

This change adds an optional field to a committed visual kind, and the parallel
content-generating GPT instances read the schema markdown over GitHub (principle 21) —
not the live tree. The doc must record the new field or generation stays blind to it.
In the `injection_site` kind entry, add:

```ts
vessel?: "target" | "bystander"
```

and record the invariant in prose: a non-IV `injection_site` visual must not show a
needle–vessel intersection; `route: "intravenous"` requires `vessel: "target"`;
`bystander` shows a vessel the needle does not enter; omitted shows no vessel. Bump any
"add a kind" / changelog notes consistent with how the doc tracks the other kinds. No
schemaVersion bump is needed (this is an optional additive field on an existing kind,
not a new bank-level structure), unless the doc's own conventions require one — match
existing practice for prior additive visual-field changes.

### `src/visuals/kinds/injection_site/geometry.ts` (NEW — single source of truth)

All vessel geometry and the intersection math live here and are imported by the
renderer, `selfCheck`, **and** the test. Do **not** copy this math into `index.ts` or
the test — duplicated geometry is exactly how `selfCheck` passes while the SVG drifts.
Same single-definition discipline as `fmt`/`roundTo` (principle 11).

```ts
export interface Ellipse { cx: number; cy: number; rx: number; ry: number; }
export interface Point { x: number; y: number; }

// IV target vessel: centered on the needle tip so entry is unambiguous.
export const IV_VESSEL_RADII = { rx: 25, ry: 11 } as const;
export const IV_VESSEL_DEPTH_Y = 162; // IV needle tipY (subcutaneous band)

// Bystander vessel: fixed safe-zone ellipse, provably clear of every non-IV needle.
// Subcutaneous band, left of the x=350 needle convergence column.
export const BYSTANDER_VESSEL: Ellipse = { cx: 205, cy: 190, rx: 22, ry: 10 } as const;

// Returns the ellipse the renderer should draw for this (route, vessel), or null.
// target -> centered on the needle tip; bystander -> BYSTANDER_VESSEL; omitted -> null.
export const getRenderedVesselGeometry = (
  route: InjectionRoute,
  vessel: VesselRelation | undefined,
  tip: Point,            // from getInjectionNeedleGeometry
): Ellipse | null => { /* target: {cx:tip.x, cy:tip.y, ...IV_VESSEL_RADII}; bystander: BYSTANDER_VESSEL; else null */ };

// Pure, deterministic. No Math.random / Date.
export const segmentIntersectsEllipse = (p0: Point, p1: Point, e: Ellipse): boolean => {
  const ax = (p0.x - e.cx) / e.rx, ay = (p0.y - e.cy) / e.ry;
  const bx = (p1.x - e.cx) / e.rx, by = (p1.y - e.cy) / e.ry;
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2));
  const qx = ax + t * dx, qy = ay + t * dy;
  return qx * qx + qy * qy <= 1;
};

export const tipInsideEllipse = (tip: Point, e: Ellipse): boolean =>
  ((tip.x - e.cx) / e.rx) ** 2 + ((tip.y - e.cy) / e.ry) ** 2 <= 1;
```

`routes.ts`: drop the old single `VESSEL_GEOMETRY` const (its values now live in
`geometry.ts`). `ROUTE_TABLE` stays as-is; for `intravenous`, `tipY` resolves to
`IV_VESSEL_DEPTH_Y` — do not regress the IV tip depth.

### Verified placement (preserve these values; do not re-derive)

Needle segments by route (entry at surface y=80, tip at x=350):
- intradermal: (106.1, 80) → (350, 123)
- subcutaneous: (237.5, 80) → (350, 192.5)
- intramuscular: (350, 80) → (350, 282.5)  [vertical]
- intravenous: (174.1, 80) → (350, 162)

`BYSTANDER_VESSEL` (205,190,22,10) spans x∈[183,227], y∈[180,200]:
- intramuscular needle x=350: clear (far right).
- subcutaneous needle min x = 237.5 > 227 (right edge): clear, ~10px gap.
- intradermal needle max y = 123 < 180 (top edge): clear.
All three non-IV needles are provably clear; the renderer asserts this (selfCheck),
it does not trust it.

## Renderer changes — `index.ts`

1. **Stop rendering the vessel unconditionally.** Compute the needle geometry, then call
   `getRenderedVesselGeometry(route, spec.vessel, tip)`. Render an ellipse with
   `data-element="blood-channel"` only when it returns non-null. target → centered on
   the tip (tip inside the lumen by construction); bystander → `BYSTANDER_VESSEL`;
   omitted → no vessel element at all.
2. Use `segmentIntersectsEllipse` / `tipInsideEllipse` from `geometry.ts` (imported, not
   re-implemented) anywhere the renderer needs them.
3. `getInjectionNeedleGeometry` is unchanged.

## selfCheck changes — `index.ts`

Keep the existing route/target/`meta.expected` checks. Add (all using `geometry.ts`):

- `vessel === "target"` ⟹ `route === "intravenous"`, else `self_check_target_requires_iv`.
- `route === "intravenous"` ⟹ `vessel === "target"`, else `self_check_iv_requires_target`.
- **Safety invariant (the load-bearing gate):** resolve the rendered vessel via
  `getRenderedVesselGeometry`. If `vessel === "target"`: assert `tipInsideEllipse(tip, v)`
  true, else `self_check_target_not_entered`. If a vessel is rendered and
  `vessel !== "target"`: assert `segmentIntersectsEllipse(p0, p1, v)` is **false**, else
  `self_check_unsafe_vessel_crossing`. A safe-route crossing is therefore a build failure
  regardless of authoring.
- **Optional `vesselEntry` coupling — guarded.** `meta` is not part of `CommonQuestion`
  (it is an untyped audit-only bag, read loosely by the existing selfCheck), and
  `rejectUnknownKeys` is not yet enforced, so `meta.expected.vesselEntry` is almost
  certainly free under the current validator. Confirm that (run `validate-bank` on a
  patched item). If free: add `meta.expected.vesselEntry?: boolean` to the audited items
  and assert `vesselEntry === (vessel === "target")` (`self_check_vessel_entry_mismatch`).
  If adding it would require invasive expected-meta schema work or trips validation:
  **skip `vesselEntry` entirely** and rely on `visual.vessel` + the safety invariant
  above. Do not let this strengthening expand the patch.

## validate changes — `index.ts`

Structural only. If `vessel` present and not in `{"target","bystander"}`, push
`invalid_vessel_relation`. Do **not** put the route-coupling rule here — that is clinical
coupling and belongs in selfCheck. Concretely: a bare
`{ kind:"injection_site", route:"intravenous" }` (no vessel) stays **structurally valid**
under `validate`; the IV-requires-target rule fires only in `selfCheck` on a full item.

## fixtures — `index.ts`

- valid: add `{ kind:"injection_site", route:"intravenous", vessel:"target" }` and
  `{ kind:"injection_site", route:"subcutaneous", vessel:"bystander" }`.
- valid: existing bare-route fixtures stay valid (vessel optional under `validate`,
  per the structural/clinical split above).
- invalid: add `{ kind:"injection_site", route:"subcutaneous", vessel:"intra_arterial" }`
  → `invalid_vessel_relation`.

## Test rewrite — `scripts/tests/injection-site.ts`

The current suite **encodes the bug** and must be revised; it imports its geometry from
`geometry.ts` (no re-implemented math):

- **Remove** `assert(svg.includes('data-element="blood-channel"'), "${route} must always render the blood channel")`.
- Per-route loop renders bare specs (no vessel) and asserts **no** `data-element="blood-channel"`.
- Safety matrix:
  - Each non-IV route with `vessel:"bystander"`: assert the vessel renders AND
    `segmentIntersectsEllipse(needle, BYSTANDER_VESSEL)` is **false**.
  - `intravenous` with `vessel:"target"`: assert the vessel renders AND
    `tipInsideEllipse(tip, rendered)` is **true**.
  - `vessel:"target"` on a non-IV route → selfCheck `self_check_target_requires_iv`
    (minimal question with `meta.expected`).
  - A full IV item/selfCheck with **no** `vessel:"target"` → `self_check_iv_requires_target`.
    (Bare-IV-under-`validate` stays valid; this assertion is the selfCheck side.)
- Keep: determinism, well-formedness, distinct needle paths (`paths.size === 4`),
  IM-steeper-than-ID, permitted-labels-only, no angle text, no vessel label,
  no route metadata.

`npm run test-visuals`, `npx tsx scripts/tests/injection-site.ts`, and `npm run build`
must pass on the revised semantics.

## Bank items — `banks/gpt-canonical.json` (the 8 audited rows)

Canonical edits go through a **serializer-safe programmatic transform**, not hand-typed
JSON (DECISIONS quote-hygiene invariant + principle 15). Use `scripts/patch-raw.ts`
with `--allow-canonical --reason "injection_site vessel-safety hardening"` (declarative
`before`→`after`, precondition-checked), which forces a `BANK-REVIEW-LEDGER.md` entry;
or a one-off load→mutate→serialize migration script. Only the `vessel` (and, if free,
`meta.expected.vesselEntry`) field is added — no stem, option, key, order, or rationale
text changes, so no re-shuffle is needed. Per-item mapping:

| ID (suffix) | route | set `vessel` | `vesselEntry` (if added) |
|---|---|---|:--:|
| `…_mc_intradermal_01` | intradermal | omit | false |
| `…_mc_subcutaneous_02` | subcutaneous | omit | false |
| `…_mc_intramuscular_03` | intramuscular | omit | false |
| `…_mc_intravenous_04` | intravenous | `target` | true |
| `…_mc_layer_highlight_05` | subcutaneous | omit | false |
| `…_sata_im_cues_06` | intramuscular | `bystander` | false |
| `…_matrix_subq_cues_07` | subcutaneous | `bystander` | false |
| `…_matrix_route_match_08` | intradermal | omit | false |

Rationale: 02/03/05 have no vessel cue in the keyed answer → vessel removed entirely.
06 (rejects "needle tip is inside a blood vessel") and 07 (row r3: visible blood-vessel
entry does not support the route) require a **visible** vessel the needle clearly avoids
→ `bystander`. 04 (IV) is the only entered case → `target`. 01/08 (intradermal) lose the
irrelevant red vessel.

## Sequencing (atomic)

Land the contract (types/routes/geometry/index/test), the schema-doc update, **and** the
bank patch in **one** change so `npm run audit` is green at the tip. If the selfCheck
`iv_requires_target` rule lands before item 04 is patched, the canonical bank fails the
gate in the interim — avoid that window. Order within the change:
re-run `rg` search to confirm the 8-item set → schema/types + `geometry.ts` →
renderer + selfCheck + validate → `NCLEX-Question-Schema.md` → tests pass →
bank patch via programmatic transform → `npm run validate-bank -- banks/*.json` →
`npm run audit` → ledger entry.

## Out of scope (separate follow-up, with rationale)

The intradermal **bleb/depot** gap (items 01/08 rationales reference a dermal bleb the
renderer never draws) is **not** part of this safety patch. The ID figure already
encodes route via shallow angle + dermal tip depth, so the items remain answerable
without it; the bleb is reinforcing, not load-bearing. If content review later deems it
load-bearing, it is a small additive render gated behind its own spec field — a separate
spec, not a blocker here.

## Definition of done

- No `injection_site` route renders a needle crossing a vessel unless `vessel:"target"`
  (IV only), enforced by `selfCheck` as a build failure.
- Geometry + intersection math live in one `geometry.ts`, imported by renderer,
  selfCheck, and test — no duplicated copies.
- Revised test suite no longer asserts the always-on blood channel; asserts the
  non-crossing invariant for non-IV and tip-inside for IV.
- `NCLEX-Question-Schema.md` records `vessel?: "target" | "bystander"` and the invariant.
- 8 audited items carry correct `vessel` values via a serializer-safe canonical patch
  with a ledger entry.
- `npm run test-visuals`, `npx tsx scripts/tests/injection-site.ts`,
  `npm run validate-bank -- banks/*.json`, `npm run audit`, `npm run build` all pass.
