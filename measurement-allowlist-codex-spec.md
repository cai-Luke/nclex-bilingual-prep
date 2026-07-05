# Shared Measurement Allowlist Module — Codex Spec

Date: 2026-07-04
Author: Claude (architect seat). Implementer: Codex.
Context: `EXHIBIT-FLOWSHEET-BLIND-ADJUDICATION-2026-07-04.md` recommends this as the **first build
item** before the staged exhibit-flowsheet migration. It closes the drift risk Codex flagged: the
gate (`scripts/exhibit-flowsheet-gate.ts`) currently hand-mirrors the measurement allowlist + units +
sanity bounds from the two visual registries, so a registry edit that doesn't reach the gate silently
changes what the gate accepts.

## Goal

Create `src/measurementAllowlist.ts` as the **single source of truth** for the flowsheet-extraction
allowlist (labels + canonical unit + accepted source units + sanity bounds), *derived from* the live
registries `VITAL_DEFS` (`src/visuals/kinds/vitals_trend/index.ts`) and `ANALYTE_DEFS`
(`src/visuals/kinds/lab_trend/index.ts`). The gate imports it instead of its hand-mirrored table. A
drift-guard test asserts the module and the registries agree, so future registry edits either flow
through or fail the test loudly.

## BLOCKER — a real registry/gate drift to resolve first (needs Luke's call)

Reading the live registries surfaced a discrepancy that must be resolved **before** this module is
built, because the resolution determines what the module derives:

- The gate's hand-mirrored table lists, for **`wbc`** and **`platelets`**, accepted alt units
  `["K/µL", "×10³/µL", "/µL"]`.
- The live `ANALYTE_DEFS` registry lists, for both, only `altUnits: ["K/µL"]`.

The blind extraction (which passed the gate clean and scored 12/12) used `sourceUnit` values of
`/µL` and `× 10³/µL` on CBC values. Those units are sanctioned by the gate's table but **not** by the
registry. So a shared module naively derived from the registry would make the gate *stricter* and
reject the exact CBC notations the migration depends on.

This is not a bug to silently absorb — it is a genuine content decision:

- **Option A (recommended): extend the registry.** Add `"×10³/µL"` and `"/µL"` to `altUnits` for
  `wbc` and `platelets` in `ANALYTE_DEFS`. Rationale: these are real, common chart notations a lab
  renderer should accept; `×10³/µL` is numerically identical to the canonical `×10⁹/L`, and `/µL` is
  the plain per-microliter count. The registry is simply incomplete here; the gate's table is the
  more correct list. This keeps the registry as the true single source *after* correction, and the
  renderer benefits from accepting the same notations the extractor emits.
- **Option B: narrow the extractor.** Keep the registry as-is and require the migration to normalize
  CBC values to `K/µL` before keying. Rejected as the recommendation: it pushes a numeric
  normalization into the extractor, which is exactly the dimensional operation Rule C deliberately
  defers to the renderer, and it discards the byte-exact source unit the flowsheet is supposed to
  preserve.

**Do not build the module until Luke picks A or B.** If A (recommended), the registry edit to
`ANALYTE_DEFS` lands first (with a note that the numeric renderer must handle `×10³/µL` = `×10⁹/L`
scale 1 and `/µL` = `×10⁹/L` scale 1e-3, which the gate's `LINEAR_FACTORS` already encodes), then the
module derives cleanly and the gate's table stops being a superset of the registry. If B, the
migration spec changes instead and the gate's extra units are removed.

The rest of this spec assumes **Option A**.

## Module shape

`src/measurementAllowlist.ts` exports a derived, frozen table plus helpers. It must not re-hardcode
values that already live in the registries — it reads them.

```ts
// Derives from VITAL_DEFS and ANALYTE_DEFS. Single source of truth for flowsheet extraction.
export interface MeasurementDef {
  key: string;                 // allowlist key (e.g. "hr", "platelets")
  canonicalUnit: string;       // from registry
  acceptedSourceUnits: string[]; // canonicalUnit + altUnits, normalized-comparable
  sanity: { min: number; max: number }; // vitals: range; labs: sanity
  kind: "vital" | "lab";
}

export const MEASUREMENT_ALLOWLIST: Record<string, MeasurementDef>; // frozen
export const ALLOWLIST_KEYS: ReadonlySet<string>;

// BP is a pseudo-key at the source level that expands to sbp+dbp; the allowlist itself
// contains sbp and dbp as separate keys (per Rule A). Keep the bp→{sbp,dbp} expansion in
// the gate's LABEL_PATTERNS, not here — this module is the keyed-measurement table only.
```

Derivation rules:
- **Vitals:** for each entry in `VITAL_DEFS`, `key` = the record key, `canonicalUnit` = `.unit`,
  `sanity` = `.range`, `acceptedSourceUnits` = `[.unit]` (vitals have no altUnits). `kind: "vital"`.
- **Labs:** for each entry in `ANALYTE_DEFS`, `key` = the record key, `canonicalUnit` =
  `.canonicalUnit`, `sanity` = `.sanity`, `acceptedSourceUnits` = `[.canonicalUnit, ...altUnits]`.
  `kind: "lab"`.
- Freeze the exported object (`Object.freeze`, deep) so no consumer mutates it.

The registries are the SVG-renderer modules; importing them into a non-visual module is fine (they
export their defs or can be refactored to). If `VITAL_DEFS`/`ANALYTE_DEFS` are not currently exported,
export them (a named `export const`) — do not copy them.

## Gate refactor

`scripts/exhibit-flowsheet-gate.ts` replaces its hand-mirrored `VITALS`/`LABS`/`ALLOW`/`ALLOW_KEYS`
block with imports from `src/measurementAllowlist.ts`:
- `ALLOW` ← a view over `MEASUREMENT_ALLOWLIST` (canonicalUnit + altUnits + sanity, matching the
  gate's current `Allow` shape, so `toCanonical` and the Rule C / GATE 4 logic don't change).
- `ALLOW_KEYS` ← `ALLOWLIST_KEYS`.
- `LINEAR_FACTORS`, `LABEL_PATTERNS`, `IMPLICIT_SOURCE_UNITS`, and the temp affine conversion stay in
  the gate — they are extraction-source concerns (synonyms, unit scale factors, implicit vital units),
  not registry data. Only the label/unit/sanity table moves.
- The `normalizeUnit`-based `sourceUnit` recognition keeps working because `acceptedSourceUnits`
  carries the same strings the gate currently lists (after the Option A registry edit).

Behavior must be unchanged after the refactor: re-run both extraction batches through the gate and
confirm still `0 FAIL, 0 WARN`:
```
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-SMOKE-EXTRACTION-V2-2026-07-04.json
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-BLIND-EXTRACTION-2026-07-04.json --blind EXHIBIT-FLOWSHEET-BLIND-CASES-2026-07-04.json
```
And re-score the blind set:
```
npm run flowsheet-blind-score
```
All three must be identical to the pre-refactor results (gate clean; scorer 12/12).

## Drift-guard test

`scripts/tests/measurement-allowlist.ts` (registered as `test:measurement-allowlist`), house test
style (plain `.ts`, local throwing `assert`). It asserts the derived module and the registries agree,
so a future registry edit that should reach the gate does, and one that shouldn't diverge is caught:
- Every `VITAL_DEFS` key is in `MEASUREMENT_ALLOWLIST` with matching `canonicalUnit` and `sanity`.
- Every `ANALYTE_DEFS` key is in `MEASUREMENT_ALLOWLIST` with matching `canonicalUnit`, `sanity`, and
  `acceptedSourceUnits` == `[canonicalUnit, ...altUnits]`.
- `ALLOWLIST_KEYS.size` == `|VITAL_DEFS| + |ANALYTE_DEFS|` (no extra, no missing).
- A guard that the exported table is frozen (mutating a member throws in strict mode).
- Regression pin for the Option A resolution: `acceptedSourceUnits` for `wbc` and `platelets` each
  include `"×10³/µL"` and `"/µL"`. (If Luke chose B, this pin inverts — assert they are absent — and
  the gate's `LINEAR_FACTORS` for those units are removed.)

## Out of scope

- No change to the flowsheet extraction contract (`EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`)
  beyond the CBC-unit clarification the Option A registry edit implies.
- No renderer/schema/canonical changes. This is the allowlist plumbing only. The supplement-vs-replace
  product pass is separate and downstream (see the adjudication doc's bounded GO).
- Peds reference bands (`refBand`) are NOT part of this module — the flowsheet allowlist only needs
  canonical unit + accepted source units + sanity. Leave `refBand`/`stableEps` in the lab registry.

## Pre-push gate

- `npx tsc -b --pretty false` clean.
- `npm run test:measurement-allowlist` passes (new).
- `npm run test:flowsheet-gate` passes (unchanged behavior).
- `npm run test-visuals` passes (the registry edit for Option A adds alt units; confirm no lab_trend
  validation fixture regressed — `invalid_unit_for_analyte` fixtures must still fail on genuinely
  wrong units).
- Both gate runs + the blind scorer reproduce their prior clean results (above).
