# Exhibit Flowsheet Next-Lanes Handoff

Date: 2026-07-06
Audience: Claude / GPT architect seat
Purpose: decide the post-extraction lanes before Codex starts schema/render/prose-normalization work.

## Current State

The values-only exhibit-flowsheet migration staging is fully closed and pushed to `main`.

Latest pushed commit:

```text
b04ce44 Close exhibit flowsheet migration staging
```

Closed lanes:

- `clean_kv`: 2/2 covered
- `prose_embedded`: 149/149 covered
- `scattered`: 152/152 covered
- `serial`: 33/33 covered after Batch 20 redid the failed Batch 19 serial tail

Important files:

- `PROJECT-HISTORY.md` — current status map.
- `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md` — batch ledger through Batch 20.
- `EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json` — refreshed 336-ref manifest.
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-01-clean_kv-2026-07-05.json`
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-02-prose_embedded-2026-07-05.json` through Batch 18
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-10-scattered-2026-07-05.json` through Batch 17
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-19-serial-2026-07-06.json` — failed bare-skip serial closure
- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-20-serial-redo-2026-07-06.json` — clean serial redo

Verification before push:

```sh
npm run test:measurement-allowlist
npm run test:flowsheet-gate
npx tsc -b --pretty false
npm run build
```

Build passed with the existing Vite large-chunk warning.

## What Is Actually Done

The extraction artifacts are staged values-only data. They do **not** mutate canonical banks, add schema
fields, or render anything in the app yet.

The migration established:

- shared allowlist source of truth in `src/measurementAllowlist.ts`;
- analyte-aware unit conversion/display policy foundation in `src/measurementUnitPolicy.ts`;
- gate coverage for label/unit/source-span safety;
- reviewed staged records across all manifest buckets;
- `skip_serial` as a preservation disposition when flattening would lose meaning;
- empty extracts for no-current-value or multi-client surfaces.

The migration did **not** decide the final schema, renderer, or prose-normalization write path.

## Decisions To Litigate First

### 1. Canonical Schema Shape

Decide whether promoted data becomes something like:

```ts
structuredMeasurements?: ExhibitStructuredMeasurements
```

or a different name. Suggested requirements:

- Lives on exhibit objects, not on question root.
- Supports `panel` values, `excludedValues`, `context`, and `unitAliases`/source audit metadata.
- Represents empty extracts deliberately, if useful for future tooling, without rendering a useless
  blank table to learners.
- Represents `skip_serial` as a preservation/no-render disposition or excludes it from canonical bank
  writes entirely.

Architect question: should `skip_serial` and empty extracts be promoted into canonical metadata, or are
they ledger-only audit facts?

### 2. Promotion Strategy

Codex should not hand-edit canonical JSON. If promoting:

- write a deterministic applicator that loads bank JSON, matches `caseId/exhibitId`, mutates objects,
  and serializes;
- keep a dry-run mode;
- validate every target bank after writing;
- regenerate census if canonical banks change.

Architect question: promote all clean extracted panels at once, or start with a tiny canonical proof
batch such as the original 2 `clean_kv` records plus a few reviewed prose/scattered records?

### 3. Rendering Policy

Do not render until the schema/data contract is settled.

Likely product behavior:

- Render compact U.S.-practice flowsheet panels inside exhibits when `structuredMeasurements.panel`
  exists.
- Do not render `excludedValues`.
- Do not render empty extracts.
- Do not render `skip_serial`; preserve authored prose because serial/orthostatic/trend semantics matter.
- Keep English primary and Chinese scaffold behavior unchanged.

Architect question: should rendered panels supplement source prose, replace selected prose spans, or sit
as an additional structured exhibit view? Replacement is riskier and starts to overlap with prose
normalization.

### 4. Unit Display / Formatter Policy

Luke's current direction:

- Primary learner-facing display should prefer compact U.S.-practice conventional units.
- SI/alternate units may appear in parentheses only where useful and not visually noisy.
- Extraction preserves source units byte-exact; rendering can normalize display separately.

Suggested implementation:

- Build a formatter on top of `src/measurementUnitPolicy.ts`.
- Keep analyte-keyed conversions; do not treat unit strings as globally convertible.
- Use conventional-first display for CBC and common chemistry.
- Do not append SI parentheticals everywhere by default.

Architect question: which analytes should show parenthetical SI in structured displays, and which should
stay conventional-only?

### 5. Troponin I vs Troponin T

Carry-forward issue:

- Current allowlist has `troponin_t`.
- Batch 16 and Batch 20 surfaced source cases saying troponin I with different stated normal cutoffs.
- Batch 20 row 14 correctly followed current schema but Antigravity Claude flagged the label mismatch.

Architect question: split allowlist into `troponin_i` and `troponin_t`, keep a generic `troponin`, or
defer until reference-range verification?

Recommendation: split I/T before rendering or reference bands, because learner-facing labels and normal
cutoffs differ.

### 6. SaO2 vs SpO2

Carry-forward issue:

- Gate `spo2` synonym matching can notice `SaO2`.
- Batch 20 correctly did **not** duplicate ABG SaO2 into pulse-ox SpO2.

Architect question: add a distinct `sao2`/`oxygen_saturation_abg` allowlist key, or keep SaO2 as
out-of-scope unless the app explicitly renders ABG oxygen saturation?

Recommendation: separate `SaO2` from `SpO2` in detection at minimum, even if `SaO2` is not rendered yet.

### 7. Reference Ranges

Do not assume current `refBand` metadata is clinically/render-ready.

Known caution:

- Troponin I/T mismatch affects reference ranges.
- Some source prose includes local/stated normals that may differ from registry defaults.

Architect question: should structured panels render no reference ranges initially, or render ranges only
after a separate reference-range verification pass?

Recommendation: first renderer should omit reference ranges or treat them as opt-in per verified key.

## Separate Prose-Normalization Lane

Luke's product ruling: source prose is editable when measurement formatting hurts learner readability,
but only through a reviewed lane.

Do not combine this with structured-measurement promotion.

Prose-normalization lane should produce a manifest with:

- byte-exact span;
- inferred analyte;
- current value/unit;
- proposed normalized text;
- conversion used, if any;
- skip reason when unsafe;
- EN/ZH parity notes;
- promotion ledger entry after review.

First safe targets:

- exhibit/lab-panel prose;
- CBC count formats (`/µL`, `/uL`, `/mcL`, `/mm³`, `×10⁹/L`, `K/µL`);
- chemistry panels already covered by the registry;
- vital-sign strings with redundant or awkward unit presentation.

Defer:

- medication doses;
- IV rates;
- intake/output;
- weights;
- peds growth values;
- reference ranges;
- answer-choice wording;
- rationales and long narrative paragraphs until the lane is proven.

## Recommended Next Codex Sequence

1. Architect decides schema shape and whether empty/skip dispositions are canonical metadata or ledger-only.
2. Codex implements schema/types validation for a tiny proof shape.
3. Codex writes a deterministic dry-run applicator for staged extraction artifacts.
4. Promote a tiny proof batch, validate, and render behind conservative UI.
5. Add formatter tests for conventional-first display.
6. Resolve or explicitly defer troponin I/T and SaO2/SpO2 before broad promotion.
7. After proof UI is good, promote the rest of the clean extracted panels.
8. Start prose-normalization manifest tooling as a separate lane.

## Hard Guardrails

- Do not retype canonical bank JSON by hand.
- Do not globally rewrite prose.
- Do not render serial/orthostatic/trend preservation cases as if they were single current panels.
- Do not mutate medication doses, infusion rates, weights, I/O, timing, gestational age, or answer-choice
  measurement wording in the prose-normalization lane without a new allowlist.
- Do not add server/runtime API dependency; app remains static/offline.
