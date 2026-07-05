# Shared Measurement Allowlist Module — Codex Spec

Date: 2026-07-04
Author: Claude (architect seat). Implementer: Codex.
Context: `EXHIBIT-FLOWSHEET-BLIND-ADJUDICATION-2026-07-04.md` recommends this as the **first build
item** before the staged exhibit-flowsheet migration. It closes the drift risk Codex flagged: the
gate (`scripts/exhibit-flowsheet-gate.ts`) currently hand-mirrors the measurement allowlist + units +
sanity bounds from the two visual registries, so a registry edit that doesn't reach the gate silently
changes what the gate accepts.

**Supersession note (2026-07-05):** the shared-allowlist architecture in this spec was implemented, but
the CBC unit policy below is historical. `DECISIONS.md` now refines the ruling to conventional-canonical
and source-permissive: `wbc`/`platelets` remain canonical `×10³/µL`, while accepted source units include
`K/µL`, `/µL`, `/uL`, `/mcL`, `/mm³`, and `×10⁹/L`. Magnesium, total calcium, and ionized calcium also
accept `mEq/L` with analyte-keyed conversion factors in `src/measurementUnitPolicy.ts`.

## Goal

Create `src/measurementAllowlist.ts` as the **single source of truth** for the flowsheet-extraction
allowlist (labels + canonical unit + accepted source units + sanity bounds), *derived from* the live
registries `VITAL_DEFS` (`src/visuals/kinds/vitals_trend/index.ts`) and `ANALYTE_DEFS`
(`src/visuals/kinds/lab_trend/index.ts`). The gate imports it instead of its hand-mirrored table. A
drift-guard test asserts the module and the registries agree, so future registry edits either flow
through or fail the test loudly.

## RESOLVED — CBC units are American conventional (Luke ruling, 2026-07-04; recorded in DECISIONS.md)

The open blocker is decided, and the ruling is cleaner than either option I first floated. Reading the
live registries had surfaced a drift: the gate accepted `["K/µL", "×10³/µL", "/µL"]` for `wbc`/
`platelets`, but `ANALYTE_DEFS` listed only `altUnits: ["K/µL"]`, with SI `×10⁹/L` as the **canonical**.
The blind extraction used `/µL` and `× 10³/µL`. Rather than extend the registry around an SI canonical
(my old Option A) or normalize in the extractor (Option B), Luke ruled: **CBC uses American
conventional units, never SI** — this is the American nursing exam and US labs report these counts
conventionally. He is a laboratory technologist; this is a domain call, not a guess.

Concrete resolution, applied as **step 0 of this spec, before the module is built**:

1. **Registry edit (`ANALYTE_DEFS`, load-bearing — principle 6):** for `wbc` and `platelets`, set
   `canonicalUnit` to the conventional `×10³/µL` (numerically identical to the old SI `×10⁹/L`, so
   **no plotted lab_trend value changes** — only the axis/label string), `altUnits: ["K/µL", "/µL"]`,
   and **remove** `×10⁹/L`. The `sanity` bounds are unchanged (same magnitude). This also makes CBC
   consistent with the rest of `ANALYTE_DEFS`, which is already conventional-canonical (Na `mEq/L`;
   glucose/BUN/creatinine `mg/dL`; SI forms as alternates) — the CBC pair was the lone SI outlier.
2. **Precondition grep (do this first):** search live banks for any `lab_trend` item carrying
   `unit: "×10⁹/L"` on a `wbc`/`platelets` series. After the edit those would fail
   `invalid_unit_for_analyte`. If any exist, migrate the label to `×10³/µL` in the same pass (the
   numeric value is unchanged) and ledger it. If none exist (likely — CBC trend items may be sparse),
   note that in the handback. **Claude has not run this grep** (no shell from the architect seat); it
   is Codex's gating precondition, not an assumed-clean.
3. **Gate `LINEAR_FACTORS`:** drop the `wbc|×10⁹/l` and `platelets|×10⁹/l` entries (SI is no longer an
   accepted source unit, so Rule C rejects it before GATE 4 is reached anyway). Keep `×10³/µl` → 1
   (canonical identity) and `/µl` → 1e-3. Temp, and everything else, untouched.

After step 0, the module derives cleanly and honestly from the registry with **no override layer** —
`acceptedSourceUnits` for the CBC pair = `["×10³/µL", "K/µL", "/µL"]`, exactly what the gate already
accepts and the blind data used, and SI is absent everywhere. The single-source-of-truth goal holds:
the registry is corrected to match reality rather than the module papering over a registry defect.

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
  `kind: "lab"`. (After step 0, the CBC pair's `.canonicalUnit` is `×10³/µL` and `.altUnits` is
  `["K/µL", "/µL"]`, so this derives the conventional-only set with no special-casing.)
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
npm run flowsheet-gate -- Archive/root-cleanup-2026-07-05/EXHIBIT-FLOWSHEET-SMOKE-EXTRACTION-V2-2026-07-04.json
npm run flowsheet-gate -- Archive/root-cleanup-2026-07-05/EXHIBIT-FLOWSHEET-BLIND-EXTRACTION-2026-07-04.json --blind Archive/root-cleanup-2026-07-05/EXHIBIT-FLOWSHEET-BLIND-CASES-2026-07-04.json
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
- Regression pin for the CBC ruling: `acceptedSourceUnits` for `wbc` and `platelets` each equal
  `["×10³/µL", "K/µL", "/µL"]` (canonical conventional + two alts) and do **not** contain SI `×10⁹/L`.
  This pins the DECISIONS ruling into a test so a later well-meaning "add SI back" edit fails loudly.

## Out of scope

- No change to the flowsheet extraction contract (`EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`)
  beyond the CBC-unit ruling recorded in DECISIONS.md.
- No schema/canonical changes beyond the step-0 CBC label migration (if any bank items carry SI on a
  CBC series). This is the allowlist plumbing + the registry-consistency fix only. The
  supplement-vs-replace product pass is separate and downstream (see the adjudication doc's bounded GO).
- Peds reference bands (`refBand`) are NOT part of this module — the flowsheet allowlist only needs
  canonical unit + accepted source units + sanity. Leave `refBand`/`stableEps` in the lab registry.

## Pre-push gate

- `npx tsc -b --pretty false` clean.
- `npm run test:measurement-allowlist` passes (new).
- `npm run test:flowsheet-gate` passes (unchanged behavior).
- `npm run test-visuals` passes. The step-0 registry edit changes the CBC canonical label and drops
  SI; confirm no `lab_trend` fixture regressed and that `invalid_unit_for_analyte` fixtures still fail
  on genuinely wrong units. If a fixture asserted `×10⁹/L` as valid for wbc/platelets, update it to
  `×10³/µL` (value unchanged).
- Both gate runs + the blind scorer reproduce their prior clean results (above).
