# R9 Temperature Sanity Decoupling — Codex Spec

Date: 2026-07-15
Author: Claude (architect seat)
Consolidated by: Codex
Implementer: Codex
Final spec-conformance gate: Claude (architect seat)
Ratified by: Luke (sign-off on `T = 46.5 °C`, 2026-07-15); Claude (architect ratification, 2026-07-15)

Status: **ratified — implementable.** `T = 46.5 °C`, sourced to Slovis CM, Anderson GF, Casolaro A,
"Survival in a heat stroke victim with a core temperature in excess of 46.5 C," *Annals of Emergency
Medicine* (1982), <https://doi.org/10.1016/S0196-0644(82)80099-1> — the highest of the three
documented survived-hyperthermia values in §2.2, chosen as the most conservative point within the §2.1
compatibility interval. `DECISIONS.md` §7 reconciled in the same pass (2026-07-15).

Change class: schema/data contract (`src/measurementAllowlist.ts`) plus focused gate and renderer
regressions. The full schema verification path applies. Codex does not merge, does not push to `main`,
and does not write `DECISIONS.md`.

This is the ratified rev. 4. It incorporates the accepted review of rev. 2 (threshold no longer
borrowed from renderer code, override table widened so it type-checks, bank survey does not filter on
literal unit spellings, other six vital bounds remain explicitly provisional) and an independent
architect-seat re-verification (bank survey re-derived from a fresh script against all 13 canonical
banks — identical result; all three §2.2 citations checked against publisher/PubMed records —
accurate). The only substantive change from rev. 3 is substituting the ratified `T = 46.5` for every
placeholder.

---

## 1. Problem

`src/measurementAllowlist.ts` currently derives every vital's `MeasurementDef.sanity` from
`VITAL_DEFS[key].range`.

For temperature, these contracts are not interchangeable:

- `VITAL_DEFS.temp` has canonical unit `°C` and a legacy range of `{ min: 30, max: 110 }`.
- `validateVitalsTrend` ignores that temperature range and applies source-unit-specific authoring
  envelopes of `30–43 °C` and `86–109 °F`.
- `scripts/exhibit-flowsheet-gate.ts` converts staged values to canonical Celsius and then applies
  `MeasurementDef.sanity` as GATE 4's unit/value-mismatch tripwire.

Consequently, `101.2 °F` correctly converts to approximately `38.44 °C`, but `101.2` mis-staged as
`°C` or bare `C` remains `101.2 °C`. Both currently pass the inherited `30–110` band, so GATE 4 is
silent on the exact value/unit mismatch it is meant to detect.

The defect is established and requires no clinical judgment: a canonical-Celsius mismatch tripwire
is aliased to an envelope that admits Fahrenheit-shaped magnitudes. The repair value is different. An
upper sanity ceiling answers a clinical/data-contract question and must be sourced and ratified; it
cannot be inherited from renderer code or authored in conversation.

## 2. Contract distinction

The two surfaces answer different questions:

- The renderer's temperature envelope asks what an author may place in a `vitals_trend` visual in a
  declared source unit.
- `MeasurementDef.sanity` asks whether a staged value, after conversion to its canonical unit, is
  implausible enough to warrant a unit/value-mismatch warning.

The renderer should be restrictive enough to keep visual authoring coherent. The gate tripwire should
be permissive enough to avoid treating genuine extreme measurements as transcription errors. Numeric
equality between those contracts is neither required nor presumed.

### 2.1 Engineering compatibility interval

The renderer accepts Fahrenheit temperature inputs from `86 °F` through `109 °F` inclusive.

- Correctly staged, that interval converts to `30 °C` through approximately `42.7778 °C`.
- Mis-staged as Celsius or bare `C`, the same raw magnitudes remain `86 °C` through `109 °C`.

Therefore a canonical-Celsius ceiling `T` preserves the full current renderer envelope and catches
the full corresponding Fahrenheit-as-Celsius defect class when:

```text
toCanonicalMeasurementValue("temp", "109", "°F") <= T < 86
```

This interval is an engineering constraint, not clinical sourcing. It proves detection equivalence
across a wide range of possible ceilings; it does not select the clinically appropriate value.

### 2.2 Preliminary clinical evidence, not ratification

The sourcing brief must not claim that a mid-40s ceiling can never flag a genuine reading. Published
case literature includes survival after recorded core temperatures of `44.3 °C`, `45 °C`, and
`46.5 °C`:

- DeGroot DW, Litchfield AC, Blodgett CA, Rhodehouse BB, Hudson KP. “Chain of survival for a severe
  exertional heat stroke casualty.” *Journal of Applied Physiology* (2025),
  <https://doi.org/10.1152/japplphysiol.01006.2024>.
- Suchard JR. “Recovery from severe hyperthermia (45 °C) and rhabdomyolysis induced by
  methamphetamine body-stuffing.” *Western Journal of Emergency Medicine* (2007),
  <https://escholarship.org/uc/item/9jv3q70s>.
- Slovis CM, Anderson GF, Casolaro A. “Survival in a heat stroke victim with a core temperature in
  excess of 46.5 C.” *Annals of Emergency Medicine* (1982),
  <https://doi.org/10.1016/S0196-0644(82)80099-1>.

These reports rule out an absolute “no real reading” rationale at or below those values. They do not,
by themselves, select `T` or establish how a rare extreme should be balanced against a warning-only
transcription tripwire.

### 2.3 Ratified selection (2026-07-15)

Luke selected `T = 46.5 °C`, the highest of the three documented values above, as the most
conservative choice within the §2.1 interval: it is bounded above by primary case literature
documenting full recovery at that exact core temperature, and it sits `39.5 °C` clear of `86`, the
floor of the Fahrenheit-mis-stage defect class, so no part of the renderer's admissible Fahrenheit
range can ever be flagged. This spec is ratified against that value.

## 3. Sourcing and ratification brief — satisfied 2026-07-15

The reference-range lane's brief is satisfied by §2.1 (engineering compatibility interval), §2.2
(sourced case literature), and §2.3 (ratified selection):

1. Contract purpose stated: a permissive, warning-only, canonical-Celsius unit/value-mismatch
   tripwire—not a normal range, diagnostic cutoff, treatment threshold, survivability boundary, or
   renderer authoring limit.
2. Authoritative primary case literature used for the extreme-survivable-measurement question.
3. Three credible candidates (`44.3`, `45`, `46.5 °C`) presented within the §2.1 compatibility
   interval; `46.5` selected.
4. False-positive implications described: each candidate is bounded by a documented full-recovery
   case at or above it, and the selected value is the most conservative of the three.
5. `T = 46.5` is conservative enough for a WARN-level forensic gate: it is the highest documented
   survived value among the three, least likely of the three to ever flag a genuine extreme reading,
   while remaining well clear of the Fahrenheit-mis-stage defect class.
6. Luke's sign-off is recorded above and in `DECISIONS.md` §7 (2026-07-15).

The architect seat has substituted `T = 46.5` throughout this spec (§7.1, §7.2, §8.1), amended
`DECISIONS.md` §7 against live disk state, and changed the status to implementable. The amendment
closes only the temperature tripwire. The authorship question for the remaining six vital bounds stays
in REVISIT with its deterministic inventory as the next step.

## 4. Non-goals

- Do not change `VITAL_DEFS.temp.range`.
- Do not change `validateVitalsTrend` or its `30–43 °C` / `86–109 °F` authoring behavior.
- Do not touch `hr`, `sbp`, `dbp`, `map`, `rr`, or `spo2` bounds. Their inheritance from renderer
  envelopes remains provisional pending the separate REVISIT inventory.
- Do not generalize the override mechanism beyond temperature.
- Do not touch laboratory sanity bounds. They have their own REVISIT/source work.
- Do not promote GATE 4 out-of-band findings from `WARN` to ordinary `FAIL`.
- Do not add source-unit-specific sanity bounds to the shared data shape.
- Do not change canonical bank content in this work.
- Do not treat a survived extreme temperature as a normal or safe value; this contract is only about
  avoiding false-positive transcription warnings.

## 5. Consumer trace

Record this trace in the implementation PR body and re-check it if any named consumer changes before
implementation.

| Consumer | Enforcement | Effect of changing `temp.sanity` |
|---|---|---|
| `src/schema.ts` | None for `sanity`; reads allowlist keys, kind, and accepted source units | No new `validate-bank` failure |
| `scripts/exhibit-flowsheet-gate.ts` → `gateRecord`, GATE 4 | `WARN` for canonical values outside `sanity`; CLI `--strict` may aggregate warnings to a nonzero exit | Intended repair: newly warns on Fahrenheit-shaped values staged as Celsius |
| `scripts/exhibit-flowsheet-gate.ts` → `plausibleAcceptedUnits` | Inferred-unit ambiguity warning | No temperature effect; this path requires `inferredUnit`, which temperature does not have |
| `scripts/tests/measurement-allowlist.ts` | Regression test | Must stop requiring temperature sanity to equal `VITAL_DEFS.temp.range` |

`src/schema.ts` does not parse structured measurement values, convert them, or apply `sanity` at FAIL
level. The change therefore remains a warning-gate/data-contract change, with the full verification
path required by `AGENTS.md`.

## 6. Bank-impact survey — blocking precondition at implementation time

Run a fresh read-only survey against every top-level `banks/*.json`; do not rely solely on the gate's
`DEFAULT_BANKS`.

Traversal surfaces:

- `caseStudy.exhibits[].structuredMeasurements`
- `caseStudy.stages[].exhibits[].structuredMeasurements`

Case-study question leaves do not carry `structuredMeasurements` in the current `src/types.ts`
contract and are not a traversal surface.

For every panel row where `row.key === "temp"`, enumerate every `row.values[]` entry. Do not filter on
literal unit strings. Report:

```text
{
  bank,
  questionId,
  exhibitRef,
  columnId,
  value,
  unit,
  normalizedUnitAccepted,
  canonicalCelsius,
  context,
  bound
}
```

Compute `normalizedUnitAccepted` by normalizing the raw unit and the public
`MEASUREMENT_ALLOWLIST.temp.acceptedSourceUnits`; do not duplicate a four-literal spelling filter.
Compute `canonicalCelsius` with `toCanonicalMeasurementValue`, not hand arithmetic.

Partition and report:

- newly flagged: canonical Celsius in `(46.5, VITAL_DEFS.temp.range.max]` (currently `(46.5, 110]`);
- already flagged: canonical Celsius outside the inherited
  `[VITAL_DEFS.temp.range.min, VITAL_DEFS.temp.range.max]` band (currently `[30, 110]`);
- still admitted: canonical Celsius in `[VITAL_DEFS.temp.range.min, 46.5]`;
- unconvertible or unrecognized units: separate explicit findings, never silently skipped.

Precondition to implement: zero newly flagged values, or each newly flagged value adjudicated by the
gate seat. If a value is a transcription/unit error, repair it in a separate content-reviewed PR. If
it is a genuine extreme, record the adjudication; do not change bank content in this PR.

### 6.1 Preliminary 2026-07-15 disk survey

Codex performed a read-only survey of the top-level banks at Git HEAD
`b4fcd487ff91c5de3e2e805c29633bc4adad58fe` using the traversal above:

- 104 temperature values total;
- 100 raw units `°C`, 4 raw units `°F`;
- canonical-Celsius range `35.8` through `40.111111111111114`;
- zero values outside the current `[30, 110]` band;
- zero values that would flip under any ratified `T` satisfying §2.1.

**Architect-seat independent re-derivation (2026-07-15):** re-run against a fresh copy of all 13
canonical banks with an independently written traversal (not Codex's script) and confirmed
byte-for-byte identical results, including zero flips at the ratified `T = 46.5` specifically. All
three §2.2 citations were independently checked against publisher/PubMed records and are accurate.

Reproduce the summary from the repository root with:

```sh
git rev-parse HEAD
npx tsx -e '
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { MEASUREMENT_ALLOWLIST } from "./src/measurementAllowlist";
import { normalizeUnit, toCanonicalMeasurementValue } from "./src/measurementUnitPolicy";
import { VITAL_DEFS } from "./src/visuals/kinds/vitals_trend/defs";

const accepted = new Set(MEASUREMENT_ALLOWLIST.temp.acceptedSourceUnits.map(normalizeUnit));
const rows: Array<{ unit: string; canonicalCelsius: number | null; normalizedUnitAccepted: boolean }> = [];

for (const bank of readdirSync("banks").filter((name) => name.endsWith(".json"))) {
  const envelope = JSON.parse(readFileSync(join("banks", bank), "utf8"));
  for (const question of envelope.questions ?? []) {
    if (question.itemType !== "case_study") continue;
    const exhibits = [
      ...(question.caseStudy.exhibits ?? []),
      ...(question.caseStudy.stages ?? []).flatMap((stage) => stage.exhibits ?? []),
    ];
    for (const exhibit of exhibits) {
      for (const panel of exhibit.structuredMeasurements?.panels ?? []) {
        for (const row of panel.rows ?? []) {
          if (row.key !== "temp") continue;
          for (const value of row.values ?? []) {
            rows.push({
              unit: value.unit,
              canonicalCelsius: toCanonicalMeasurementValue("temp", value.value, value.unit),
              normalizedUnitAccepted: accepted.has(normalizeUnit(value.unit)),
            });
          }
        }
      }
    }
  }
}

const converted = rows.flatMap((row) => row.canonicalCelsius === null ? [] : [row.canonicalCelsius]);
const lowestCompatibleCeiling = toCanonicalMeasurementValue("temp", "109", "°F");
const currentRange = VITAL_DEFS.temp.range;
console.log(JSON.stringify({
  total: rows.length,
  units: Object.fromEntries([...new Set(rows.map((row) => row.unit))]
    .map((unit) => [unit, rows.filter((row) => row.unit === unit).length])),
  canonicalMin: Math.min(...converted),
  canonicalMax: Math.max(...converted),
  unacceptedNormalizedUnits: rows.filter((row) => !row.normalizedUnitAccepted).length,
  unconvertible: rows.length - converted.length,
  outsideCurrentBand: converted.filter((value) =>
    value < currentRange.min || value > currentRange.max
  ).length,
  potentialFlipsAtLowestCompatibleCeiling: converted.filter((value) =>
    lowestCompatibleCeiling !== null &&
      value > lowestCompatibleCeiling &&
      value <= currentRange.max
  ).length,
}, null, 2));
'
```

This is orientation evidence, not a substitute for the fresh implementation-time survey. The bank
corpus may change before the final threshold is ratified.

## 7. Implementation

### 7.1 Decouple temperature sanity

In `src/measurementAllowlist.ts`, import `VitalKey` as a type and add this private override table above
`vitalEntries`. `T = 46.5` is ratified; implement it exactly as written below:

```ts
import type { VitalKey } from "./visuals/kinds/vitals_trend/types";

/**
 * Authored canonical-unit sanity ceilings that intentionally diverge from the
 * vital registry ranges.
 *
 * VITAL_DEFS[key].range supplies the renderer validation envelope for most
 * vitals. Temperature is different: its active validator bypasses the legacy
 * registry range and uses separate source-unit-specific bounds.
 *
 * MeasurementDef.sanity is a warning-only unit/value-mismatch tripwire used by
 * the flowsheet gate after conversion to the canonical unit. Temperature's
 * sourced and ratified ceiling is recorded in DECISIONS.md §7; its floor
 * continues to inherit VITAL_DEFS.temp.range.min pending separate review.
 *
 * The remaining six vitals currently inherit their full registry ranges
 * pending the separate REVISIT inventory. That inheritance is provisional,
 * not a suitability finding.
 *
 * Adding another key is a data-contract change requiring a consumer trace,
 * bank-impact survey, sourcing where clinically applicable, and the full
 * schema verification path. Do not quietly retune ceilings here.
 */
const VITAL_SANITY_MAX_OVERRIDES: Readonly<Partial<Record<VitalKey, number>>> =
  Object.freeze({
    temp: 46.5, // Ratified 2026-07-15; sourced to Slovis CM et al. 1982 (DECISIONS.md §7).
  });
```

Then construct the override as a ceiling-only change inside `vitalEntries`:

```ts
const vitalEntries = Object.entries(VITAL_DEFS).map(([key, def]) => {
  const maxOverride = VITAL_SANITY_MAX_OVERRIDES[key as VitalKey];
  return [
    key,
    freezeDef({
      key,
      canonicalUnit: def.unit,
      acceptedSourceUnits: key === "temp" ? [def.unit, "°F", "F", "C"] : [def.unit],
      sanity: maxOverride === undefined
        ? def.range
        : { min: def.range.min, max: maxOverride },
      kind: "vital",
    }),
  ] as const;
});
```

Do not export `VITAL_SANITY_MAX_OVERRIDES`. `freezeDef` already copies and freezes the selected
`sanity` object in the public allowlist entry. This work authors only the temperature ceiling; the
floor remains inherited from `VITAL_DEFS.temp.range.min` and is not ratified by this spec.

### 7.2 Update the public-observable drift guard

In `scripts/tests/measurement-allowlist.ts`, retain the existing `VITAL_DEFS` loop and all existing
kind, canonical-unit, and accepted-source-unit assertions. Replace the blanket sanity equality check
with:

```ts
if (key === "temp") {
  assert.equal(
    got.sanity.min,
    def.range.min,
    "temp sanity floor must remain inherited from VITAL_DEFS pending separate review",
  );
  assert.equal(
    got.sanity.max,
    46.5,
    "temp sanity ceiling must equal the sourced and ratified canonical-Celsius tripwire",
  );
} else {
  assert.deepEqual(got.sanity, def.range, `${key} sanity drift`);
}
```

The hardcoded temperature branch is deliberate. A future second override must fail the non-temperature
drift guard until its own contract and regression are added. Leave the existing temperature
`acceptedSourceUnits` assertions unchanged.

## 8. Regressions

### 8.1 GATE 4 tripwire — `scripts/tests/exhibit-flowsheet-gate.ts`

Exercise `gateRecord` directly using source text that contains each staged value and unit verbatim.
Assert finding presence and `WARN` level separately from unrelated gate findings.

| Case | Raw value | Source unit | Expected GATE 4 result |
|---|---:|---|---|
| Correctly staged Fahrenheit fever | `101.2` | `°F` | No out-of-band finding |
| Fahrenheit magnitude mis-staged as Celsius | `101.2` | `°C` | `WARN` |
| Same defect with bare-C spelling | `101.2` | `C` | `WARN` |
| Lowest renderer-admissible Fahrenheit magnitude mis-staged as Celsius | `86` | `°C` | `WARN` |
| Ratified ceiling, inclusive | `46.5` | `°C` | No out-of-band finding |
| Just above ratified ceiling | `46.6` | `°C` | `WARN` |
| Renderer Fahrenheit ceiling, correctly staged | `109` | `°F` | No out-of-band finding |
| Renderer Fahrenheit floor, correctly staged | `86` | `°F` | No out-of-band finding |

The `86 °C` row pins full detection of the renderer-admissible Fahrenheit mis-stage interval. The
`109 °F` row pins the other side of the compatibility interval: the ratified canonical ceiling must
not reject correctly converted renderer-admissible Fahrenheit input.

Do not add CLI exit-code assertions. Strict-mode aggregation is unchanged; the change-specific
contract is that the finding emitted by `gateRecord` remains `WARN`. Temperature values with typed
bounds are not in scope.

### 8.2 Renderer envelope — `vitals_trend` fixtures

The renderer contract is unchanged and remains independent from `T`. Confirm or add, without changing
existing fixtures:

- a valid `tempUnit: "F"` fixture whose temperature series includes `109`;
- an invalid `tempUnit: "C"` fixture with the exact value `43.1` and
  `expectCode: "value_out_of_range"`.

The current colocated fixtures do not pin those exact boundaries, so both additions are expected.
`npm run test-visuals` already runs the kind-specific vitals test, generic fixture conformance/render
smoke, registry checks, and visual parity.

## 9. Verification path

Run all commands after implementation:

```sh
npm run test:measurement-allowlist
npm run test:flowsheet-gate
npm run test:structured-measurements
npm run test-visuals
npm run validate-bank -- banks/*.json
npm run audit
npx tsc -b --pretty false
npm run census && npm run census:check
npm run build
git diff --check
```

The implementation PR body must include:

- the refreshed consumer trace;
- the full survey output or a durable artifact containing it;
- the sourced and ratified value of `T` and its `DECISIONS.md` reference;
- verification results;
- confirmation that no canonical bank content changed.

The census should remain byte-identical. Regeneration plus `census:check` remains required by the full
verification path.

## 10. Acceptance criteria

- The reference-range sourcing brief satisfies §3. **Done** — §2.1/§2.2/§2.3, ratified 2026-07-15.
- Luke signs off on one canonical-Celsius ceiling `T` within the §2.1 compatibility interval. **Done**
  — `T = 46.5`.
- The architect seat ratifies `T`, substitutes it for every placeholder in this spec, reconciles
  `DECISIONS.md` §7, and marks the spec implementable before Codex begins. **Done.**
- The fresh §6 survey reports zero newly flagged canonical values, or every flip is adjudicated by the
  gate seat with any bank repair routed to a separate content-reviewed PR. Preliminary survey (§6.1,
  independently re-verified by the architect seat) shows zero; Codex must still re-run the survey at
  implementation time against current HEAD, since the bank corpus may have moved.
- `MEASUREMENT_ALLOWLIST.temp.sanity.min === VITAL_DEFS.temp.range.min`; the floor remains inherited
  and unratified pending separate review.
- `MEASUREMENT_ALLOWLIST.temp.sanity.max === 46.5`; only the ceiling is newly authored and ratified.
- The public allowlist exports no new symbol.
- `validateVitalsTrend` and its `30–43 °C` / `86–109 °F` behavior are unchanged.
- `101.2 °C`, `101.2 C`, and `86 °C` produce GATE 4 `WARN` findings.
- `101.2 °F`, `109 °F`, `86 °F`, and exact `46.5 °C` do not produce GATE 4 out-of-band findings.
- The six non-temperature vital sanity values remain unchanged and drift-guarded against
  `VITAL_DEFS` without any new claim that those inherited bounds are suitable.
- The full verification path is green.
- No canonical bank content changes in this PR.
- After the implementation pass lands, `PROJECT-HISTORY.md` records the completed repair and verified
  command results without restating the live numeric contract owned by code and `DECISIONS.md`.

## 11. Implementation authority boundary

This spec is ratified and authorizes implementation of exactly what is written above — no other
threshold, no generalization to the other six vitals, no bank content change. Codex may implement
against this spec, create a `codex/` branch if requested, and prepare changes for review. Codex must
not merge or push directly to `main` and must leave `DECISIONS.md` to the architect seat — it has
already been amended by the architect seat (2026-07-15); Codex should not re-edit it. Before
implementing, Codex must still re-run the §6 bank-impact survey fresh against current HEAD; §6.1's
zero-flip result is preliminary orientation evidence, not a substitute.
