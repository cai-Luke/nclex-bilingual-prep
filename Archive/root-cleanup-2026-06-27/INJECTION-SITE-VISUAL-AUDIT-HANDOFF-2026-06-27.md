# Injection-Site Visual Audit Handoff (2026-06-27)

## Purpose

Architect handoff for the `injection_site` visual subset.

The current renderer can make safe-route injection visuals appear to puncture a blood vessel. This handoff records the audit evidence only. It intentionally does not prescribe the patch implementation, because the remediation should be designed as a hardened renderer/data-contract change.

## Scope Audited

Search command used:

```sh
rg -n "injection_site|Injection route recognition|needle tip|subcutaneous|intradermal|intramuscular|intravenous|vessel|vein" banks src
```

Files containing the active injection-site subset:

- `banks/gpt-canonical.json`
- `src/visuals/kinds/injection_site/index.ts`
- `src/visuals/kinds/injection_site/routes.ts`
- `src/visuals/kinds/injection_site/types.ts`
- `scripts/tests/injection-site.ts`

No nested or alternate bank items with `visual.kind === "injection_site"` were found. The active bank subset contains 8 questions, all in `banks/gpt-canonical.json`.

## Renderer Findings

The visual schema is minimal:

```ts
interface InjectionSiteSpec {
  kind: "injection_site";
  route: InjectionRoute;
  caption?: { en: string; zh?: string };
}
```

There are no per-item structured fields for vessel placement, target ovals, medication depots, unsafe paths, or needle geometry. The problematic visual behavior is therefore global renderer behavior, not question-specific JSON geometry.

Current fixed renderer geometry:

- Tissue surface: `SURFACE_Y = 80`
- Needle tip x: `TIP_X = 350`
- Vessel ellipse: `cx = 330`, `cy = 162`, `rx = 25`, `ry = 11`
- Vessel is rendered for every route as `data-element="blood-channel"`

Current route table:

| Route | Angle | Target |
|---|---:|---|
| `intradermal` | 10 degrees | `dermis` |
| `subcutaneous` | 45 degrees | `subcutaneous` |
| `intramuscular` | 90 degrees | `muscle` |
| `intravenous` | 25 degrees | `vessel` |

Computed needle/vessel intersection results:

| Route | Result |
|---|---|
| `intradermal` | Needle does not intersect the vessel ellipse, but an irrelevant red vessel remains visible. |
| `subcutaneous` | Needle intersects the vessel ellipse. |
| `intramuscular` | Needle intersects the vessel ellipse. |
| `intravenous` | Needle intersects/enters the vessel ellipse intentionally. |

The current test suite encodes part of the flawed behavior: `scripts/tests/injection-site.ts` asserts that every route must render `data-element="blood-channel"`.

## Bank Item Audit

| Bank | ID | Topic | Visual route | Keyed answer | Audit result |
|---|---|---|---|---|---|
| `banks/gpt-canonical.json` | `gpt_injection_smoke_2026_06_15_mc_intradermal_01` | Injection route recognition from skin cross-section | `intradermal` | `A: Intradermal` | Ambiguous. The needle does not cross the vessel, but the irrelevant red vessel remains visible. The rationale mentions a small bleb, but the renderer does not render a medication depot/bleb. |
| `banks/gpt-canonical.json` | `gpt_injection_smoke_2026_06_15_mc_subcutaneous_02` | Injection route recognition from skin cross-section | `subcutaneous` | `B: Subcutaneous` | Unsafe/defective. Needle crosses the fixed vessel ellipse while the keyed route is subcutaneous. |
| `banks/gpt-canonical.json` | `gpt_injection_smoke_2026_06_15_mc_intramuscular_03` | Injection route recognition from skin cross-section | `intramuscular` | `C: Intramuscular` | Unsafe/defective. Needle crosses the fixed vessel ellipse while the keyed route is intramuscular. |
| `banks/gpt-canonical.json` | `gpt_injection_smoke_2026_06_15_mc_intravenous_04` | Injection route recognition from skin cross-section | `intravenous` | `D: Intravenous` | OK. Vessel entry is clinically intended and is reflected in the keyed answer/rationale. |
| `banks/gpt-canonical.json` | `gpt_injection_smoke_2026_06_15_mc_layer_highlight_05` | Target layer identification from visual | `subcutaneous` | `C: Subcutaneous tissue` | Unsafe/defective. Needle crosses the fixed vessel ellipse while the target is subcutaneous tissue. |
| `banks/gpt-canonical.json` | `gpt_injection_smoke_2026_06_15_sata_im_cues_06` | Injection visual cue interpretation | `intramuscular` | `A`, `B`, `C` | Unsafe/defective. Needle crosses the fixed vessel ellipse while the item explicitly rejects "needle tip is inside a blood vessel." |
| `banks/gpt-canonical.json` | `gpt_injection_smoke_2026_06_15_matrix_subq_cues_07` | Injection visual cue interpretation | `subcutaneous` | `r1=c1`, `r2=c2`, `r3=c2`, `r4=c1` | Unsafe/defective. Needle crosses the fixed vessel ellipse while row `r3` says visible blood-vessel entry does not support the route shown. |
| `banks/gpt-canonical.json` | `gpt_injection_smoke_2026_06_15_matrix_route_match_08` | Visual technique analysis | `intradermal` | `r1=c1`, `r2=c2`, `r3=c1`, `r4=c2` | Ambiguous. The needle does not cross the vessel, but the renderer does not show a dermal medication depot/bleb despite the route and rationale depending on dermal placement. |

## Clinical/Visual Risk

The safe-route visuals for subcutaneous and intramuscular routes currently imply accidental vascular puncture. This conflicts with the instructional intent of route recognition and with rationales that contrast safe-route placement against intravenous placement.

The intradermal visuals are less severe but still incomplete: the visual can show route depth/angle, but does not render the bleb/depot implied by the rationale and can distract with a non-load-bearing vessel.

The intravenous visual is the only current case where vessel entry is expected.

## Validation Baseline

Commands run during audit:

```sh
npm run validate-bank -- banks/*.json
npx tsx scripts/tests/injection-site.ts
```

Results:

- `npm run validate-bank -- banks/*.json` passed for all bundled banks.
- `npx tsx scripts/tests/injection-site.ts` passed.

Important caveat: the existing injection-site test passes because it asserts current renderer behavior, including always rendering the blood channel. A future patch should revise this test rather than treating the current pass as proof of clinical correctness.

`npm run build` was not run because this handoff is audit-only and no app, bank, or test behavior was changed.

## Implementation Notes for Future Remediation

Do not hand-edit bank JSON by retyping large blocks. If item metadata changes become necessary, use a serializer-safe programmatic transform.

Likely remediation will be renderer/test focused because the current bank data only specifies `route`; no per-item geometry exists to fix. Preserve keyed answers and rationales where the clinical intent remains correct.

The hardened implementation should establish a deterministic invariant for safe-route visuals: non-IV route visuals must not render or imply a needle crossing a vessel unless a future explicit unsafe/contraindicated visual state exists and the item is keyed/rationaled for that state.
