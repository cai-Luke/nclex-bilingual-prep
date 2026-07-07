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

### 8. Snapshot Panel Presentation (Fishbone Layout) — Override Recorded 2026-07-07

Luke's ruling (2026-07-07 planning session): a fishbone-style **current-panel snapshot** layout — the
CBC / BMP "skeleton" view clinicians see first on Epic chart review — is preferred over the flat
list/tabular rendering for point-in-time panel data. Principle 6's necessity bar is **explicitly waived**
for this surface. Luke accepts it as presentation/decoration, justified by workflow familiarity (it
matches how nurses actually read these panels at work), not by load-bearing necessity. This is a
deliberate, stated override, not an oversight.

Preference rule as stated:

- Prefer the fishbone snapshot when it **saves vertical space** vs. the current flat list.
- When **space-neutral**, still prefer it (better presentation).
- No rule was given for the case where the fishbone costs *more* space than the flat list — treat that
  as open; likely fall back to flat, but confirm with Luke before implementing.

Scope and entanglements to litigate next session:

- This is the **snapshot** surface (single point-in-time CBC/BMP), distinct from `lab_trend` serial/trend
  rendering (≥3 timepoints), which stays flat/tabular and is unchanged. The values-only extraction
  pipeline's trend data is not affected by this decision.
- It is a **new visual kind** regardless of the necessity override. No existing primitive renders the
  X-layout (`renderFieldPanel` is key→value, not fishbone), so the renderer + `selfCheck` + registry
  conformance build is required either way. The override removes *only* the necessity gate on top of
  that build — it does not save the build.
- It is **entangled with Decision #1 (schema shape) and Decision #3 (rendering policy)** above: whether
  the `structuredMeasurements` current-panel render *is* the fishbone, and how snapshot-panel semantics
  differ from the mixed-panel/trend column contract, is part of what #1/#3 must resolve. Decide
  snapshot-fishbone scope explicitly; do not let it fold into the trend-column work implicitly.
- **Principle-6-compliant fallback if the override is later reversed:** schema 1.5 `rationale.visuals`
  is necessity-exempt by design (principle 19) and would host a post-answer *teaching-figure* version of
  the fishbone with no override needed. Luke's stated preference here is the in-exhibit display path
  (the override), so the override stands unless next-session litigation reverses it.

Not written to `DECISIONS.md` this session, deliberately: the override's correct standing-principle form
depends on the schema-1.8 resolution, and `DECISIONS.md` entries are not re-litigated once written. This
note is the forward-pointer; the standing entry gets authored once #1/#3/#8 settle together.

## Pre-Litigation Audit Addendum

Codex ran a narrow blocker-risk audit on 2026-07-07 against the staged batches, current repo schema,
gate, allowlist, unit policy, and renderer-adjacent files. This did **not** reopen migration
adjudication; it only identifies facts tomorrow's schema-lane litigation should freeze before code
or promotion.

Blocker facts:

- Failed Batch 19 must stay excluded from promotion input. It is useful as a failure record only.
  It still gates 0 FAIL / 0 WARN because it contains bare `skip_serial` records, but adjudication found
  14/28 misclassified. Batch 20 is the clean serial-redo artifact to consume.
- Promotion tooling must not glob every staged JSON artifact blindly. Historical pre-refresh artifacts
  remain on disk, and the manifest/ledger establish which refreshed refs are current. Use the refreshed
  manifest plus clean adjudicated artifacts, with explicit Batch 20 substitution for Batch 19.
- Current canonical schema does not yet allow `structuredMeasurements`. `CaseStudyExhibit` is still
  `id/type/title/content/visual` only in `src/types.ts`, `src/schema.ts`, and `src/allowedKeys.ts`.
- Troponin identity is not render-safe as-is. Batch 20 row 14 source says `troponin I 0.38 ng/mL`, but
  the current allowlist/registry stores it as `troponin_t`.
- SaO2 and SpO2 are distinct. Batch 20 correctly did not duplicate ABG `SaO2 93%` into pulse-ox `SpO2`,
  but the gate's current `spo2` synonym pattern still matches `SaO2`.
- Staged `sourceUnit` is sometimes an extraction-valid normalized source unit, not the byte-exact unit
  token. Example: source `HR 118/min` staged as `hr` with `sourceUnit: "bpm"` and a prose-normalization
  WARN. The schema must distinguish source token, canonical unit, and display unit if those concepts
  matter downstream.
- Staged records can mix clinical panels in one `panel[]` array: vitals, stat labs, ABG values, CBC,
  and post-intervention values may coexist. A canonical table contract needs explicit panel/column
  identity instead of inferring it later from `sourceSpan`.
- Empty extracts are intentional in the staged artifacts for multi-client or no-current-value surfaces;
  they must either remain ledger-only or become no-render canonical metadata. They must never render
  a blank learner-facing table.
- `skip_serial` covers several preservation classes, not just simple time trends: serial vitals/labs,
  orthostatic vitals, ambulation/recovery sequences, and multi-day trend tables. Do not flatten these
  into one-column current panels.

Spec questions to freeze:

- Is canonical `structuredMeasurements` one generic measurement table, separate `labs_flowsheet` /
  `vitals_flowsheet`, or a wrapper that supports multiple typed panels per exhibit?
- Are `skip_serial`, empty extracts, `excludedValues`, `unitAliases`, and source-span audit data
  canonical metadata or ledger-only promotion evidence?
- What fields distinguish `sourceValue`, `sourceUnitToken`, `acceptedSourceUnit`, `canonicalValue`,
  and `displayUnit`? Values-only v1 can keep this small, but the names should not paint the renderer
  into a corner.
- Are timestamps/column labels required in canonical data when a staged record combines separate
  clinical panels, or does the first proof batch deliberately avoid mixed-panel records?
- Should reference ranges and H/L flags be rejected in v1 validation? Recommendation remains yes:
  no reference ranges or flags until the separate reference-range lane verifies them.

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

1. Architect freezes the small migration contract: schema shape, empty/skip disposition, source/canonical/display unit naming, mixed-panel handling, and v1 no-range/no-flag rule.
2. Architect explicitly resolves or defers troponin I/T and SaO2/SpO2 before any broad rendering.
3. Codex implements schema/types validation for a tiny proof shape.
4. Codex writes a deterministic dry-run applicator for staged extraction artifacts, explicitly excluding Batch 19 and consuming Batch 20 for the serial redo.
5. Promote a tiny proof batch, validate, and render behind conservative UI.
6. Add formatter tests for conventional-first display.
7. After proof UI is good, promote the rest of the clean extracted panels.
8. Start prose-normalization manifest tooling as a separate lane.

## Hard Guardrails

- Do not retype canonical bank JSON by hand.
- Do not globally rewrite prose.
- Do not render serial/orthostatic/trend preservation cases as if they were single current panels.
- Do not mutate medication doses, infusion rates, weights, I/O, timing, gestational age, or answer-choice
  measurement wording in the prose-normalization lane without a new allowlist.
- Do not add server/runtime API dependency; app remains static/offline.
