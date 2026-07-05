# Exhibit Flowsheet — Claude Handoff After Luke Decisions (2026-07-05)

Audience: Claude architect seat. Purpose: hand off the post-adjudication state after Claude's
`DECISIONS.md` unit-policy rulings were implemented by Codex.

## Current Repo State

Codex implemented the measurement-allowlist foundation, manifest tooling, and Claude's unit-policy
adjudications. It has **not** written canonical banks, schema 1.8 fields, or structured flowsheet
renderer changes.

Implemented:
- Pure registry definition modules:
  - `src/visuals/kinds/lab_trend/defs.ts`
  - `src/visuals/kinds/vitals_trend/defs.ts`
- Derived/frozen `src/measurementAllowlist.ts`.
- CBC registry ruling refined: `wbc` and `platelets` canonical `×10³/µL`, but source-unit acceptance
  is permissive for real reporting forms (`K/µL`, `/µL`, `/uL`, `/mcL`, `/mm³`, `×10⁹/L`).
- Magnesium / calcium source-unit ruling implemented: `mEq/L` accepted for `magnesium`, `calcium`, and
  `ionized_calcium`, with analyte-keyed conversion factors.
- Shared unit policy: `src/measurementUnitPolicy.ts` owns conversion factors and first-pass display
  policy metadata; the gate no longer carries a separate factor table.
- Gate refactor: `scripts/exhibit-flowsheet-gate.ts` imports the shared allowlist and unit policy.
- Calcium identity guard: explicit ionized/total calcium labels must route to the corresponding key;
  bare calcium only WARNs when the chosen key is out of normal band while the opposite calcium key
  would be in normal band.
- Drift guard: `scripts/tests/measurement-allowlist.ts`.
- Manifest tool: `scripts/exhibit-flowsheet-manifest.ts`.
- Staged clean-KV proof artifact:
  `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-01-clean_kv-2026-07-05.json`.

## Decisions Now Implemented

1. **Clean bucket strictness:** retain the strict detector. Do not widen `clean_kv` to include
   narrative-bearing exhibits just to get a larger "easy" batch.
2. **Next migration sequencing:** fix manifest duplicates, then proceed to the `prose_embedded` batch.
3. **Magnesium / unit policy:** conventional-first, source-permissive, analyte-aware. Extraction accepts
   real reporting forms and preserves `sourceUnit`; conversion/display is separate and keyed by
   analyte plus source unit.
4. **Source prose mutability:** Luke has now explicitly ruled that source prose is editable when unit
   formatting hurts learner readability. The constraint is not immutability; the constraint is reviewed,
   analyte-aware normalization with provenance, parity checks, and no clinical meaning drift.

## Duplicate Fix

Codex found six duplicate manifest refs caused by scanning the same case exhibit id more than once.
`scripts/exhibit-flowsheet-manifest.ts` now de-dupes by `exhibitRef`, matching the gate's map behavior.

Regenerated manifest:

- `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json`
- Total: 337 panels
- `clean_kv`: 2
- `prose_embedded`: 145
- `scattered`: 160
- `serial`: 30
- Duplicate exhibit refs after patch: 0

The "same measurement-key profile" clusters are **not** duplicates; they are expected common shapes
(vitals-only snapshots, BMP/CBC panels, etc.).

## Clean-KV Proof Artifact

`EXHIBIT-FLOWSHEET-MIGRATION-BATCH-01-clean_kv-2026-07-05.json` contains two strict clean-KV records.

Gate result:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-01-clean_kv-2026-07-05.json
```

- 2 records
- 0 FAIL
- 0 WARN

The earlier WARN is resolved. `opus24_case_elder_neglect_med_mismanagement_01/home_visit_labs_returned`
now keys magnesium `1.4 mEq/L` as `magnesium`, preserving the source unit byte-exact.

## Unit-Policy Investigation

### Structured visual/unit registry scope

This part is feasible and relatively contained:

- All existing `lab_trend` visual series in `banks/lab-canonical.json` use default registry units
  (`series[].unit` is omitted). There are no explicit lab-trend `unit` overrides to migrate.
- Therefore changing **display** for `lab_trend` axes/labels can mostly happen in registry/render code,
  not bank JSON.
- The safer design is to keep numeric `canonicalUnit`/`acceptedSourceUnits` for validation and add
  separate display metadata, e.g. `primaryDisplayUnit`, `secondaryDisplayUnit`, and a sourced conversion
  function or factor. Do not overload `canonicalUnit` with a string like `mg/dL (mmol/L)`.
- Future `structuredMeasurements` rendering can use the same display metadata while preserving the
  extracted `sourceUnit` byte-exact for audit.

Current lab registry posture after the adjudication implementation:

- Already conventional-first with SI alternate/source alternate: Na/K/Cl/HCO3 (`mEq/L`, alt `mmol/L`), BUN
  (`mg/dL`, alt `mmol/L`), creatinine (`mg/dL`, alt `µmol/L`), glucose (`mg/dL`, alt `mmol/L`),
  calcium (`mg/dL`, alts `mmol/L`, `mEq/L`), magnesium (`mg/dL`, alts `mmol/L`, `mEq/L`), phosphate
  (`mg/dL`, alt `mmol/L`), hemoglobin (`g/dL`, alt `g/L`), CBC counts (`×10³/µL`, alts `K/µL`, `/µL`,
  `/uL`, `/mcL`, `/mm³`, `×10⁹/L`).
- Already unit-stable/no obvious SI pair: anion gap, BNP, INR, PTT, pH, PaCO2/PaO2, AST/ALT/bilirubin.
- Needs source-verification before any "flip" assumption: ionized calcium remains `mmol/L` canonical
  with `mg/dL` and `mEq/L` accepted as source alternates; lactate is `mmol/L`; ammonia is `µmol/L`
  alt `µg/dL`; troponin T `ng/mL` alt `µg/L`.
  These may be normal US reporting forms despite looking SI-ish. Do not mechanically invert them.

### Bank prose scope

Global prose rewrite is **not** a small mechanical cleanup. Token counts across top-level bank JSONs:

- `mEq/L`: 850
- `mmol/L`: 179
- `mg/dL`: 1,339
- `µmol/L` / `umol/L`: 14
- `µg/dL` / `mcg/dL`: 32
- `g/dL`: 1,721
- `g/L`: 46
- CBC `×10³/µL` style: 20
- CBC SI `×10⁹/L` style: 6
- CBC-ish `/µL` / `/uL` / `/mcL`: 329

This inventory includes English and Chinese strings, rationales, stems, exhibits, options, glossary
entries, and some non-lab contexts. A global "append SI in parentheses" pass would be high-risk:

- It must identify the analyte, not just the unit token.
- Some units are already paired in prose, e.g. platelet/WBC examples like `45,000/mm³ (45 ×10⁹/L)`.
- Some conversions are 1:1 only for specific analytes/valence assumptions (`mEq/L` vs `mmol/L` is
  not globally interchangeable; magnesium is the live counterexample).
- The prose is reviewed study content; altering it changes source exhibits and rationales, not just
  display.

### Luke addendum: prose can be normalized when units hurt readability

After dogfooding, Luke's position is stronger than "do not mutate bank prose":

**Source prose is not sacred when measurement formatting makes clinical data harder to parse.** Some
existing prose uses awkward or nonstandard unit formats that increase cognitive load. Because Project
Shrimp is a learner-facing NCLEX/U.S.-practice app, measurement prose should prefer compact, familiar
U.S. conventional units where that improves readability.

This does **not** authorize a blind global rewrite. It authorizes a separate, reviewed
**measurement prose normalization lane**.

Policy:

1. Primary prose display should prefer U.S.-practice conventional units.
2. Use compact conventional formatting when it improves scanability.
3. SI or alternate units may appear in parentheses only when useful, sourced, and not visually noisy.
4. Do not append parentheticals everywhere by default.
5. Do not treat authored prose as immutable if its unit formatting is genuinely worse for learner
   comprehension.
6. Do not alter clinical meaning, values, trends, severity, or answer logic.
7. Do not rewrite medication doses, infusion rates, weights, intake/output, timing, gestational age, or
   non-lab/non-vital quantities unless a separate allowlist explicitly covers them.

Desired direction examples:

- Prefer compact CBC table/trend style:
  - `WBC 18.0 ×10³/µL`
  - `Platelets 72 ×10³/µL`
- Avoid noisy source forms when a compact conventional form is clearer:
  - `18,000/mm³` may be normalized to `18.0 ×10³/µL` in lab-panel prose after review.
  - `45,000/µL` may be normalized to `45 ×10³/µL`.
- Preserve or add SI parentheticals only where they serve the learner:
  - `WBC 18.0 ×10³/µL (18.0 ×10⁹/L)` may be appropriate in structured lab displays.
  - Free prose should not become cluttered with every possible equivalent unit.

Implementation sequencing:

1. Build/settle the unit display policy and formatter first.
2. Continue values-only staged flowsheet extraction; extraction preserves source units and does not
   render.
3. Create a separate prose-normalization manifest:
   - byte-exact span
   - inferred analyte
   - current value/unit
   - proposed normalized text
   - conversion used, if any
   - skip reason when unsafe
4. Stage diffs only. No direct canonical writes.
5. Review sample batches before promotion.
6. Require EN/ZH parity checks when the same measurement appears in both languages.
7. Record every promoted normalization in a ledger.

First safe targets:

- Prioritize exhibit/lab-panel prose, not rationales or long narrative paragraphs.
- Initial target classes:
  - CBC count formats: `/µL`, `/uL`, `/mcL`, `/mm³`, `×10⁹/L`, `K/µL`
  - basic chemistry panels already covered by the lab registry
  - vital-sign strings with redundant or awkward unit presentation
- Defer:
  - medication dosing
  - IV rates
  - intake/output
  - weights
  - peds growth values
  - reference ranges
  - any sentence where the measurement value is part of answer-choice wording rather than source data

Recommendation for Claude to consider:

1. **Do not mutate all bank prose blindly.** Source prose may be normalized, but only through the
   separate measurement-prose lane above.
2. **Add a display-unit policy layer** for `lab_trend` and future `structuredMeasurements`, because
   that is contained and aligns with Luke's goal without disturbing reviewed prose.
3. **For prose/clinical text**, scope the normalization lane as a staged migration: analyte-aware
   parser, conversion table with cited sources, EN/ZH parity, no duplicate parentheticals,
   validation/audit, and human review.

## Remaining Implementation Concerns

1. The `prose_embedded` migration can proceed values-only while display rendering is designed, because
   extraction preserves byte-exact `sourceUnit` and does not mutate bank prose.
2. The display policy now has a home (`src/measurementUnitPolicy.ts`) but is not yet consumed by
   `lab_trend` or future `structuredMeasurements` rendering. Integrating it should be a separate UI pass.
3. The prose-normalization lane should remain separate from values-only flowsheet extraction. Start with
   exhibit/lab-panel text, produce a manifest/diff/ledger, and keep answer choices/rationales deferred
   until the parity/audit harness is stronger.
4. Calcium total/ionized ambiguity is now mechanically guarded in the gate, but Claude/human review should
   watch the first prose-embedded batch for WARN volume and false positives.
5. If Claude wants source citations recorded more formally than code comments, promote the two links in
   `UNIT_CONVERSION_SOURCES` into a small policy note before the prose-normalization lane starts.

## Verification Already Run

- `npm run test:measurement-allowlist`
- `npm run test:flowsheet-gate`
- `npx tsc -b --pretty false`
- `npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-01-clean_kv-2026-07-05.json`
- `npm run flowsheet-gate -- Archive/root-cleanup-2026-07-05/EXHIBIT-FLOWSHEET-SMOKE-EXTRACTION-V2-2026-07-04.json`
- `npm run flowsheet-gate -- Archive/root-cleanup-2026-07-05/EXHIBIT-FLOWSHEET-BLIND-EXTRACTION-2026-07-04.json --blind Archive/root-cleanup-2026-07-05/EXHIBIT-FLOWSHEET-BLIND-CASES-2026-07-04.json`
- `npm run flowsheet-blind-score`
- `npm run test-visuals`
- `npm run validate-bank -- banks/*.json`
- `npm run build`
