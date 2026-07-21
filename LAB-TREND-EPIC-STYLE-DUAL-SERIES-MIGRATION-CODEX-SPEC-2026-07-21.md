# Lab Trend Epic-Style Dual-Series Migration — Codex Specification

**Date:** 2026-07-21
**Status:** Ready for implementation
**Owner:** Codex implementation seat
**Change class:** Renderer/UI; no schema, bank-content, grading, or clinical-source migration

## 1. Objective

Replace the learner-facing presentation of every two-series `lab_trend` visual with an Epic-style trend display that separates **trajectory reading** from **exact-value reading**:

- the graph communicates direction, timing, and relative change;
- a visible semantic table directly beneath the graph owns exact values and units;
- the learner no longer has to interpolate exact values from two independent Y axes;
- correlated series such as hemoglobin and hematocrit remain distinguishable and inspectable.

Keep one-series `lab_trend` presentation unchanged unless a small shared refactor is required to support the new branch.

This is a renderer migration over the existing authored payload. Do not edit canonical bank JSON merely to select the new presentation.

## 2. Live scope and forcing evidence

The current canonical `lab_trend` population is bounded:

- 20 total `lab_trend` visuals;
- 11 one-series visuals;
- 9 two-series visuals;
- 2 two-series CBC records pairing hemoglobin and hematocrit.

The forcing example is a CBC trend whose two axes are scaled so hemoglobin and hematocrit nearly overlap. The current chart consumes substantial space on two numeric Y axes while still requiring the learner to estimate exact values from the plotted points. The intended replacement is the same interaction/presentation family already established for the Epic-style `vitals_trend`: unified visual emphasis plus an exact table below.

The implementation must prove the design on the complete nine-record two-series corpus, not only on the two correlated CBC records.

## 3. Architectural boundaries

### 3.1 Must remain unchanged

Do not change:

- `LabTrendSpec` or any authored `lab_trend` field;
- schema version floors or `NCLEX-Question-Schema.md` authoring shape;
- canonical bank content, question IDs, keys, rationales, metadata, or sources;
- `validateLabTrend` behavior;
- `selfCheckLabTrend` semantics, expected-trend interpretation, expected-flag interpretation, or reference-band authority;
- item-type placement rules;
- grading, session sampling, storage, import/export, or case-stage behavior;
- the deterministic legacy renderer’s output contract except where an explicitly approved and rebaselined implementation requires otherwise.

No bank promotion pipeline is required because no bank content should change.

### 3.2 Presentation routing

Route by payload shape:

- `series.length === 1`: preserve the current fitted numeric chart, Y-axis labels, and reference-band behavior.
- `series.length === 2`: use the new Epic-style interactive presentation in every learner-facing location handled by `VisualStimulus`, including standalone questions, embedded case leaves, case exhibits, staged exhibits, rationale visuals, Summary/review, Developer Review, Preview Lab, and focus mode.

Do not add a persisted user setting or A/B selector. This is one standing presentation policy.

### 3.3 Legacy deterministic surface

Preserve `renderLabTrendSvg(spec)` as the deterministic registered renderer and parity surface unless implementation discovery proves a narrower extraction is necessary. The preferred shape is:

- registered renderer remains deterministic, noninteractive, and structurally equivalent to the current output;
- learner-facing two-series visuals are dispatched through a React interactive wrapper, parallel to `VitalsTrendInteractiveStimulus`;
- the new user-facing model and SVG receive their own focused fixed snapshot coverage rather than silently replacing the existing registered parity owner.

If Codex finds that preserving the current registered bytes would create substantial duplication or an incoherent ownership boundary, stop and report the alternative before rebaselining all `lab_trend` parity records.

## 4. Two-series graph semantics

### 4.1 The graph is normalized, not an unlabeled dual-axis chart

Do not merely remove Y-axis numbers from the existing dual-axis rendering. Each series must be transformed onto one explicit normalized display scale before plotting.

Use **percent change from that series’ baseline value**:

```text
normalizedChangePct = ((value - baselineValue) / abs(baselineValue)) × 100
```

where `baselineValue` is the first value in that series.

This makes the graph’s vertical geometry interpretable as relative change while the exact table retains the original measurements.

### 4.2 Baseline guard

The live corpus is expected to use nonzero baselines. The model builder must nevertheless fail closed for a zero baseline rather than divide by zero or silently invent a denominator.

Acceptable implementation choices:

1. return a model/result error and fall back to the legacy deterministic renderer for that visual; or
2. use a documented alternate normalization only after proving and testing it.

The preferred behavior is deterministic fallback to the legacy renderer. Do not reject or skip an otherwise schema-valid imported item because this presentation-only normalization cannot be constructed.

### 4.3 Scale construction

For two-series normalized graphs:

- include every normalized point from both series;
- always include `0%` so baseline is visually anchored;
- calculate a shared fitted domain with deterministic padding;
- choose human-readable symmetric or rounded ticks that expose direction without implying exact original-unit magnitudes;
- show a subtle horizontal zero/baseline line;
- do not render original-unit reference bands on the normalized plot.

The Y-axis must not show original analyte units. Either:

- show compact percentage ticks with a small neutral label such as `Change from baseline`, or
- omit numbered Y ticks entirely while retaining a visibly marked baseline.

Codex should prefer the percentage-tick version if it remains readable at the measured split width. The user’s “Y axis no units” decision means no analyte-unit axes, not that normalized geometry should become semantically opaque.

### 4.4 Series identity

Use the existing analyte label and unit registry. Each legend entry must expose:

- analyte label;
- authored unit when present, otherwise canonical unit;
- stable style role;
- a visible marker/line sample.

Do not intentionally offset or falsify points merely to prevent overlap. If two normalized series are identical, identical geometry is truthful. Distinguish them through legend emphasis, point styling, and the exact table.

## 5. Exact-value table

Add a visible semantic HTML table immediately below every two-series learner-facing lab graph.

### 5.1 Model

Create and export a pure model builder, preferably:

```ts
buildLabTrendTableModel(spec: LabTrendSpec): LabTrendTableModel
```

The model must derive solely from the same `spec.time` and `spec.series` arrays used for the graph.

Suggested shape:

```ts
type LabTrendTableModel = {
  columns: Array<{ key: string; label: string }>;
  rows: Array<{
    key: LabAnalyteKey;
    label: string;
    unit: string;
    values: string[];
    flags: Array<"H" | "L" | null>;
  }>;
};
```

The exact type may vary, but it must preserve analyte identity, display unit, formatted values, and reference-band-derived flags where an active verified band exists.

### 5.2 Required behavior

- First column: analyte name plus unit.
- Remaining columns: exact source timepoints in the authored time unit.
- Cells: exact authored values formatted deterministically; do not calculate values from plotted coordinates.
- H/L status: display only when the active population has a verified reference band and that series has not disabled it with `showReferenceBand: false`.
- A value inside the band has no forced `N` badge.
- Pediatric trajectory-only records remain supported without flags or bands.
- The table must be visible in ordinary view, not print-only or screen-reader-only.
- At narrow widths the table scrolls inside its own bounded frame; the page must not gain horizontal overflow.
- Keep the first analyte column visible while horizontally scrolling when practical, matching the current vitals flowsheet convention.
- Use real semantic `<table>`, `<thead>`, `<tbody>`, header scopes, and text content. Do not duplicate the table inside SVG.

The visible table is part of the answer stimulus, not an answer reveal. It must contain only values already present in the authored visual payload and mechanically derived H/L flags permitted by the existing reference-band contract.

## 6. Interaction contract

Create a two-series interactive wrapper, preferably `LabTrendInteractiveStimulus`, following the established vitals interaction pattern without forcing the vitals component into an over-general abstraction.

### 6.1 Timepoint interaction

Transparent HTML controls aligned over graph timepoints must support:

- pointer hover;
- keyboard focus;
- click/tap pinning;
- Enter and Space pinning;
- a visible guide line at the active timepoint;
- a compact readout listing both exact analyte values and units for that timepoint.

The readout must derive from the same table model as the visible table.

### 6.2 Legend interaction

Legend entries must support pointer hover and keyboard focus. Activating/focusing one entry:

- emphasizes the selected series;
- suppresses the other series without fully removing it;
- emphasizes the corresponding table row;
- does not change any underlying data or scale.

Loss of hover/focus restores both series unless a deliberate pinned-legend behavior is added and tested. A pinned legend state is not required.

### 6.3 Focus mode and mounting

Preserve the shared visual-focus guarantees:

- exactly one SVG for the visual is mounted while focus mode is open;
- opening focus mode preserves answer state and page position;
- Close, Escape, and backdrop dismissal work;
- focus returns to the enlarge trigger;
- body scrolling is restored;
- the focused two-series graph uses its readable design width and may scroll internally on narrow screens;
- the exact table remains reachable in focused mode.

### 6.4 Propagation and accessibility

- Overlay controls must not trigger the surrounding enlarge target.
- Timepoint and legend controls need explicit bilingual or language-neutral accessible names.
- Decorative SVG groups remain non-focusable; HTML controls own interaction.
- The graph’s accessible description must state that vertical position represents percentage change from baseline and exact measurements are listed in the table.
- Print must show the graph and complete table while hiding pointer-only controls and transient readouts.

## 7. Layout policy

Preserve the existing shape-aware exam layout decision:

- one-series `lab_trend` remains full-width above the question;
- two-series `lab_trend` remains eligible for the desktop split layout.

The new two-series surface must fit the measured 600 px visual lane and shrink responsively on mobile ordinary view. Focus mode may retain the 600 px design width inside an internal scroller.

Do not alter `usesStandaloneVisualSplit` unless measured implementation evidence shows the new graph-plus-table cannot remain usable and reachable in the current split. If that happens, stop for an architect decision rather than silently moving all two-series lab trends full-width.

## 8. Implementation ownership and suggested files

Expected implementation area:

- `src/visuals/kinds/lab_trend/index.ts`
  - export analyte display helpers if needed;
  - add pure table/model builders;
  - keep current validator and self-check behavior stable.
- `src/visuals/kinds/lab_trend/LabTrendInteractive.tsx`
  - new learner-facing two-series wrapper and interaction logic.
- `src/visuals/VisualStimulus.tsx`
  - route two-series lab trends through the new wrapper.
- `src/styles.css`
  - graph overlay, readout, table frame, sticky first column, focus/mobile/print behavior.
- `scripts/tests/lab-trend.ts` or the current lab-specific test owner
  - model, rendering, interaction-contract, and non-regression assertions.
- a fixed snapshot file dedicated to the new presentation model/SVG if consistent with the vitals precedent.

Do not refactor unrelated visual kinds or shared primitives unless a small extraction has a direct demonstrated need and retains their existing bytes/contracts.

## 9. Deterministic tests

At minimum, add focused deterministic coverage for:

1. **Inventory assertion** at implementation time: the promoted corpus contains 20 `lab_trend` visuals, split 11 one-series / 9 two-series. If concurrent legitimate content work changes the counts, update the proof population deliberately rather than hard-coding a stale unexplained number.
2. Two-series model computes correct percent changes for both series.
3. Baseline is exactly `0%` for every series.
4. Negative and positive trajectories share one deterministic fitted scale.
5. Zero baseline takes the documented fallback and never emits `Infinity`, `NaN`, or invalid SVG.
6. Table columns exactly match source timepoints and authored time units.
7. Table values exactly match source arrays and authored/canonical units.
8. Adult H/L flags reproduce the registry bands and honor `showReferenceBand: false`.
9. Pediatric/no-band table emits no invented flags.
10. Timepoint readout is sourced from the table model.
11. Legend-to-series and legend-to-row identity mappings are complete and stable.
12. Two identical normalized trajectories remain truthful and independently addressable.
13. One-series `renderLabTrendSvg` remains byte-identical to its pre-change output for representative and promoted one-series records.
14. `validateLabTrend` and `selfCheckLabTrend` before/after results are identical for every promoted `lab_trend` record.
15. No bank file is modified.
16. Generic visual conformance and registered rendering still pass.

The fixed presentation snapshot should include all nine promoted two-series identities and byte-sorted model/SVG hashes, or another equally deterministic complete-corpus proof. Do not snapshot only the two CBC records.

## 10. Browser proof matrix

Use at least the following promoted records:

- both hemoglobin/hematocrit CBC trends;
- one discordant or weakly related pair such as INR/platelets;
- one pair with both values moving in the same direction but at materially different relative rates;
- one non-hour time unit if present in the nine-record population.

Verify at:

- desktop live standalone split around the existing 1280×720/800 proof environment;
- mobile around 390×844;
- focus mode at desktop and mobile;
- Summary/review or Developer Review;
- Preview Lab if it provides the easiest deterministic surface.

Browser assertions:

- graph and table are fully reachable;
- no page-level horizontal overflow;
- mobile table scroll is contained within its frame;
- first column remains readable at maximum table scroll;
- exact readout matches source data at first, middle, and final timepoints;
- legend hover/focus suppresses the opposite series and emphasizes the correct row;
- correlated CBC series remain independently inspectable;
- the INR/platelets control does not imply that equal vertical displacement means equal original-unit change;
- focused mode mounts one SVG and restores focus/body scroll on close;
- keyboard operation works without opening focus mode accidentally;
- print preview exposes graph and complete table and hides transient controls;
- final browser console has no warning or error introduced by the change.

## 11. Verification floor

Run the renderer verification path required by `AGENTS.md`:

```bash
npm run test-visuals
npx tsx scripts/tests/lab-trend.ts        # use the actual focused command/file name
npm run validate-bank -- banks/*.json
npx tsc -b --pretty false
npm run build
git diff --check
```

Also run any affected exam-layout or focus-mode regression suite, expected to include:

```bash
npm run test:exam-layout
```

Because the registered deterministic renderer should remain unchanged, the promoted visual parity suite should report zero `lab_trend` parity movement. If any registered hash changes, produce an explicit scoped rebaseline receipt and explain why preserving the legacy bytes was impossible or inferior; do not casually rebaseline.

Before completion, compare every promoted `lab_trend` record’s pre/post:

- validation errors;
- `selfCheck` errors;
- authored spec JSON;
- registered renderer SVG hash.

Expected result: exact equality on all four surfaces.

## 12. Documentation and closeout

On successful implementation:

- update `PROJECT-HISTORY.md` with the measured browser proof, affected population, architecture boundary, tests, and parity result;
- update `NCLEX-Question-Schema.md` only to replace stale presentation prose for `lab_trend`, without changing its authoring contract or implying a schema migration;
- do not update `BANK-REVIEW-LEDGER.md` or census artifacts unless an unexpected bank/content change is separately authorized;
- archive this completed implementation spec according to the project’s normal root-cleanup convention after the work lands.

## 13. Stop conditions

Stop and return for architect adjudication before writing around any of these:

- percent-from-baseline produces clinically misleading geometry for a live record;
- a live record has a zero baseline and fallback would materially degrade the user experience;
- the graph-plus-table cannot fit the current two-series split route while remaining reachable;
- preserving the current registered renderer/parity surface requires substantial duplication or unsafe divergence;
- implementation appears to require changing bank payloads, schema, clinical ranges, or `selfCheck` meaning;
- a shared refactor would move bytes or behavior for non-`lab_trend` visual kinds.

## 14. Acceptance criteria

The task passes only when all of the following are true:

- every learner-facing two-series `lab_trend` uses one normalized Epic-style graph plus one visible exact-value table;
- one-series lab trends remain unchanged;
- the normalized graph has an explicit, tested percent-from-baseline meaning;
- exact values, units, and eligible H/L flags are correct and table-derived;
- timepoint and legend keyboard/pointer interactions work;
- the complete nine-record two-series corpus has deterministic proof coverage;
- desktop, mobile, focus, review, and print surfaces remain usable and overflow-safe;
- canonical bank bytes, schema, validation, `selfCheck`, and grading remain unchanged;
- registered `lab_trend` parity remains unchanged unless an explicitly justified scoped rebaseline is reviewed;
- all required tests, validation, TypeScript, build, browser smoke, and diff checks pass.
