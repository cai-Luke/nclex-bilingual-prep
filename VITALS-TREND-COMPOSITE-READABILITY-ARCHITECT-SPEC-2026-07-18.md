# Vitals-Trend Composite Readability — Codex Architect Spec

**Date:** 2026-07-18<br>
**Priority:** P0 learner-facing answerability defect on a promoted, study-visible visual<br>
**Architecture owner:** Luke<br>
**Draft lineage:** Claude draft, revised before implementation to close unit-axis, band-overlap, responsive-layout, and parity-worktree ambiguities<br>
**Implementation seat:** Codex — PR author; does not merge and does not edit `DECISIONS.md`<br>
**Forcing incident:** live study-session observation on `vit_gpt_2026_07_02_t01_001`<br>
**Supersedes:** `VITALS-TREND-COMPOSITE-READABILITY-PRIORITY-HANDOFF-2026-07-18.md` for implementation detail; the handoff remains orientation only

This spec is closed-world. Every product decision needed to implement the repair is stated here. Read current disk before writing, preserve unrelated work, and surface only a genuinely blocking contradiction with live source.

## 0. Execution precondition and read order

Begin implementation only from a clean task branch/worktree. At spec-write closeout, the repository was clean except for this untracked spec; re-check rather than assuming that remains true. If unrelated deltas appear before or during implementation, isolate this task instead of reverting, overwriting, absorbing, or rebaselining those changes.

Read, in order:

1. `AGENTS.md`
2. `DECISIONS.md` — principles 6, 23, 25, 27, and 29
3. `PROJECT-HISTORY.md`
4. `NCLEX-Question-Schema.md` — common visual rules and `vitals_trend`
5. `src/visuals/kinds/vitals_trend/index.ts`
6. `src/visuals/kinds/vitals_trend/defs.ts`
7. `src/visuals/primitives/lineChart.ts`
8. `src/visuals/primitives/table.ts`
9. `src/visuals/VisualStimulus.tsx`
10. `src/examLayout.ts`
11. the relevant selectors in `src/styles.css`
12. `scripts/tests/vitals-trend.ts`, `scripts/tests/exam-layout.ts`, and the promoted parity workflow

Inspect `git status` and the live diff before every documentation or parity write.

## 1. Problem and scope

The promoted item `vit_gpt_2026_07_02_t01_001` (`banks/gpt-canonical.json`, current path `questions.503.visual`) turns on recognizing a deteriorating multi-vital trajectory. The current `vitals_trend` renderer makes that clinical read unreliable:

- **Legend clipping:** `lineChart.ts` advances entries with fixed `legendX += 100` spacing inside a 600-unit viewBox; dense records render final labels past the boundary.
- **SBP/DBP ambiguity:** both use the same solid blue stroke.
- **Mixed-unit compression:** HR, SBP, DBP, MAP, and RR currently share one left scale; SpO₂ and temperature currently share one right scale.
- **Reference-band noise:** each implicit adult band emits a full-width translucent rectangle, so dense records stack several unrelated bands.
- **Untitled right scale:** temperature or SpO₂ ticks may appear without an identifying axis title.
- **No exact-value recovery surface:** the learner has no familiar flowsheet view when the plotted points are dense or visually close.
- **Poor layout fit:** the existing 600×300 admission proof no longer describes the accepted composite.

This is a renderer defect, not a content-key defect. No schema version, visual payload, canonical bank record, answer key, clinical range, validation envelope, or `selfCheck` meaning changes.

## 2. Corpus inventory — frozen planning input

A deterministic six-location traversal of all 13 bundled canonical banks found **29** `vitals_trend` artifacts:

- Banks: `gpt-canonical.json` 18; `vitals-canonical.json` 10; `hard-cases-canonical.json` 1.
- Locations: 28 top-level question visuals; 1 case-stage exhibit; zero rationale figures, ordinary case exhibits, or embedded-leaf visuals.
- Series cardinality: 2 series → 7 records; 3 → 2; 4 → 2; 6 → 12; 7 → 6. Dense 6–7-series records are the dominant shape: 18/29.
- Temperature present: 14. SpO₂ present: 15. Both present: 6; the tri-family respiratory/SpO₂/temperature collision is live.
- Population: explicit adult 27; omitted/default adult 1; `peds_child` 1.
- `showReferenceBand`: omitted on all 142 live series; zero explicit `true`, zero explicit `false`.
- Temperature unit: explicit `C` on 11 temperature records; omitted/default Celsius on 3; no live Fahrenheit record.

Named proof records:

- **Forcing incident — `vit_gpt_2026_07_02_t01_001`:** time 0/2/4/6 hr; HR 96→130; SBP 126→92; DBP 78→58; MAP 94→69; RR 20→30; temperature 38.4→38.8 °C with an intervening peak. Expected trends: HR up, RR up, MAP down. It renders three panels under §4.
- **Densest — `vit_gpt_2026_07_02_t01_004`:** HR, SBP, DBP, MAP, RR, SpO₂, and temperature across 0/15/30/60 min. It renders three panels.
- **Sparsest staged exhibit — `ex_trend_1200`:** HR plus temperature across four timepoints. It renders two panels.
- **Pediatric proof:** the sole `peds_child` record; reference bands remain suppressed.

Re-run the inventory before implementation only to detect drift. If the population is no longer 29 or the named records are absent, stop and report the delta; do not silently rewrite this scope.

## 3. Ratified product decisions

1. Do not repair this by merely widening the legend.
2. The renderer may present the same typed vital-sign data through both charts and a compact flowsheet table. The assessed skill is clinical interpretation of serial data, not graph-literacy purity.
3. Artifact-level necessity remains strict: removing the complete chart-plus-table artifact must materially change answerability; the stem must not state the carried values or interpreted trajectory; the item must turn on multi-timepoint or cross-series reasoning, never one isolated table cell.
4. The table is always renderer-derived from the existing `VitalsTrendSpec`; it is never authored, persisted, or validated as a second payload.
5. No schema change and no bank migration.
6. Immediate renderer repair; no broad quarantine. Hold new dense `vitals_trend` commissioning until the composite lands.
7. Governance is an application of principle 25. Principle 29 is cited only by parallel reasoning; it is scoped to laboratory presentations and does not directly govern `vitals_trend`.

## 4. Deterministic presentation contract

All layout and styling decisions below are pure functions of `VitalsTrendSpec`. The same spec must produce byte-identical SVG.

### 4.1 Unit-pure scale-family panels

**Invariant: every y-axis represents exactly one unit family. There is no HR/BP shared-scale exception and temperature never shares an RR or SpO₂ scale.**

Render non-empty panels in this fixed order:

#### Panel A — Hemodynamics

Present series: `hr`, `sbp`, `dbp`, `map`.

- Pressure family (`sbp`, `dbp`, `map`) uses the left y-axis in `mmHg`.
- HR uses the right y-axis in `bpm` when at least one pressure series is present.
- If HR is the only Panel A series, render it on the left axis and omit the right axis.
- If pressure is present without HR, use the left axis only.
- Axis labels are explicit: `Blood pressure (mmHg)` and, when present, `HR (bpm)`.

#### Panel B — Respiratory / oxygenation

Present series: `rr`, `spo2`.

- RR uses the left y-axis in `/min`.
- SpO₂ uses the right y-axis in `%` when RR is also present.
- If SpO₂ is the only Panel B series, render it on the left axis and omit the right axis.
- Axis labels are explicit: `RR (/min)` and, when present, `SpO₂ (%)`.

#### Panel C — Temperature

Present series: `temp` only.

- Temperature uses the left y-axis on its own compact panel.
- Axis label is explicit: `Temperature (°C)` or `Temperature (°F)` from `tempUnit`, defaulting to Celsius exactly as the live renderer does.

Panel count equals the number of non-empty families among A/B/C, not the raw series count. All panels use identical x bounds, timepoints, plot-left coordinate, and plot-right coordinate so timepoints align vertically. Upper panels may pass an empty x-axis title; the lowest panel alone carries `Time (Hours)` or `Time (Minutes)`. Tick values remain aligned and visible on every panel unless the proof render demonstrates that suppressing duplicate upper tick labels is necessary; such suppression may be added only through an optional byte-preserving primitive flag and must leave all non-vitals default output unchanged.

Expected results:

- forcing incident and densest record → A + B + C;
- `{hr,temp}` → A + C;
- `{hr,map}` → A only, dual-axis;
- pressure/HR/RR/SpO₂ without temperature → A + B.

### 4.2 Panel headings and axis identity

Each panel has a visible heading above its legend:

- `Hemodynamics`
- `Respiratory / oxygenation`
- `Temperature`

Axis titles must remain visible at normal desktop size and in focus mode. Unit identity must not depend solely on color or legend order.

### 4.3 Fixed-cell panel-local legends

The primitive's internal legend is suppressed for `vitals_trend`; the wrapper draws one legend per panel.

Use deterministic fixed cells, not estimated proportional-font advances:

- SVG width: 600.
- Legend left edge: x=60.
- Legend content width: 480.
- Two columns at x=60 and x=300; cell width 240.
- Row height: 20.
- Marker line length: 16; marker center x = cellX + 8; label x = cellX + 22.
- Panel A: at most four entries, filled left-to-right into a 2×2 grid.
- Panel B: at most two entries, one row of two cells.
- Panel C: one entry in the first cell.
- Series order is fixed: HR, SBP, DBP, MAP; RR, SpO₂; Temperature.

The closed label vocabulary easily fits inside a 240-unit cell at font-size 12. Tests must assert every marker and text anchor remains inside its cell and every cell remains inside x=60…540. Do not use `getBBox`, canvas measurement, DOM APIs, a character-width estimate, or runtime font metrics.

### 4.4 SBP/DBP distinction

Keep both pressure lines blue, but render DBP with exact `stroke-dasharray="6 4"`; SBP remains solid. The DBP legend marker uses the same dash pattern. Dash, not color, is the load-bearing distinction and must survive monochrome review.

Encode the DBP dash in the vitals wrapper's series-to-style mapping. Do not modify `defs.ts`.

### 4.5 Reference bands — panel-exclusive

A reference band renders only when all of the following are true:

1. effective population is adult;
2. `showReferenceBand !== false`;
3. the panel contains exactly one rendered series.

This rule is intentionally stricter than axis occupancy. Two bands tied to separate y-axes can still overlap in pixel space and recreate the same visual noise, so **any multi-series panel renders zero reference bands**.

Flag behavior:

- omitted, adult: band only on a one-series panel;
- explicit `true`, adult: still only on a one-series panel; `true` does not override panel exclusivity;
- explicit `false`: never;
- non-adult: never; explicit `true` remains the existing `reference_band_population_unsupported` validation error.

Reuse `VITAL_DEFS[key].normal(tempUnit)`; introduce no new ranges.

### 4.6 Renderer-derived flowsheet table

Render a compact table beneath the final panel using `renderDocTable` and `measureDocTable` from `src/visuals/primitives/table.ts`.

- Width: 600.
- No separate authored title is required; first header cell is `Vital sign`.
- First column is wider than data columns (`widthFr` chosen so the longest row label fits without truncation); all timepoint columns share equal width.
- Header columns: one per source timepoint, formatted as `0 h`, `2 h`, or `15 min` using `fmtNum` and the source time unit.
- Body row height and header height may be reduced from the primitive defaults only through existing `DocTableInput` options; do not alter `table.ts` defaults.
- Rows appear in this fixed order, omitting absent data:
  1. `HR (bpm)`
  2. `BP (mmHg)` when both SBP and DBP are present, with each cell exactly `SBP/DBP`
  3. otherwise `SBP (mmHg)` or `DBP (mmHg)` as the single present pressure row
  4. `MAP (mmHg)`
  5. `RR (/min)`
  6. `SpO₂ (%)`
  7. `Temperature (°C)` or `Temperature (°F)`
- Values use `fmtNum` directly from `spec.series[*].values`; no display rounding, normalization, unit conversion, or recomputation.
- Combined BP cells contain each source SBP and DBP value exactly once.
- No phantom rows and no independent table data structure that can drift from the chart.

The current promoted corpus uses a small timepoint count and must fit at 600 units without clipped cells. This task does not add a schema-level maximum timepoint count. If a valid synthetic stress fixture with more columns becomes unreadable, report it as a future schema/layout question rather than widening this task into a new scrolling-table contract.

### 4.7 Composite assembly

Return one SVG with width/viewBox width 600. Stack:

1. Panel A if present;
2. fixed inter-panel gap;
3. Panel B if present;
4. fixed inter-panel gap;
5. Panel C if present;
6. fixed chart-to-table gap;
7. flowsheet table.

Each panel's total height is its visible heading + legend rows + line-chart block. The table height comes only from `measureDocTable`. Total SVG height is the exact sum of rendered blocks and gaps.

The question caption is **not inside the SVG**. `VisualStimulus.tsx` renders it as an external `<figcaption>`; do not include caption height in the SVG viewBox and do not duplicate the caption inside the table or chart.

### 4.8 Standalone layout fork — measured, not predicted

The current split admission was proved for a 600×300 chart. This composite is materially taller. Resolve one kind-wide fork from measured proof:

#### Split acceptance gate

At approximately 1280×727 and 1280×800, the forcing item must be answerable in the ordinary question view without opening focus mode. The full legend, clinically meaningful trend shapes, and exact flowsheet values must be reachable through ordinary page scrolling, with:

- no horizontal scrolling on desktop;
- no clipped panel, axis title, legend, cell, or caption;
- no nested/sticky-pane behavior that makes the bottom of the artifact inaccessible;
- no requirement to enlarge the visual merely to identify a series or read the values.

If all conditions pass, keep `vitals_trend` in `STANDALONE_SPLIT_VISUAL_KINDS`.

If any condition fails, remove only `"vitals_trend"` from `STANDALONE_SPLIT_VISUAL_KINDS`; the existing non-split route then renders the visual full-width above the stem. Update the allowlist comment and `scripts/tests/exam-layout.ts` with the measured result. Do not author a third layout path.

The expected branch is removal because the dense composite is substantially taller than the prior 600×300 proof, but the screenshot/measurement decides.

#### Normal and focus sizing

Current CSS generically expands focus SVGs to the full body width, which would make a tall 600-unit composite excessively tall. Use kind-specific CSS; no `VisualStimulus.tsx` change is expected unless CSS cannot satisfy the proof:

- ordinary non-split desktop: `vitals_trend` may grow beyond the old 37.5rem cap, up to a measured maximum near 50rem, centered;
- focus desktop: cap the SVG near 50rem wide, centered, and let the existing `.visual-focus-body { overflow: auto; }` provide vertical scrolling at a readable scale;
- focus mode does **not** have to fit the entire tall composite into one viewport; shrinking exact values to force height-fit is forbidden;
- desktop focus must not require horizontal scrolling;
- mobile may use horizontal scrolling at a readable minimum width, consistent with the existing dense-visual policy; do not shrink table text into illegibility merely to avoid it;
- preserve one-SVG mounting, Close/Escape/backdrop dismissal, body-scroll restoration, focus return, and answer state.

## 5. Implementation architecture

### 5.1 Shared primitive blast radius

`renderLineChart` is also used by `lab_trend`. Its default SVG must remain byte-identical.

Permitted primitive extensions:

1. `LineChartInput.showLegend?: boolean`
   - omitted/default = `true`, exactly current output;
   - `vitals_trend` passes `false` and draws panel legends itself.
2. `ChartSeries.strokeDash?: boolean`
   - omitted/default = current solid output with **no** `stroke-dasharray` attribute;
   - `true` emits exact `stroke-dasharray="6 4"` on the polyline and, when the primitive legend is enabled, its legend marker.

If duplicate upper x-axis labels cannot meet the measured height gate, one additional optional input may suppress x-axis title/tick-label output. It must default to current behavior, be used only by the vitals wrapper, and prove byte-identical `lab_trend` output. Do not add it speculatively.

All paneling, axis assignment, headings, fixed-cell legends, panel-exclusive bands, table construction, and stacking live in `src/visuals/kinds/vitals_trend/index.ts`. Do not redesign `lineChart.ts` globally.

### 5.2 One source of truth

Chart points, axes, legends, table headers, and table values all derive from the same `VitalsTrendSpec`. No parallel payload, duplicated registry, hidden author flag, or bank migration.

### 5.3 Validation and selfCheck stay unchanged

Do not change:

- accepted vital keys;
- source-unit value ranges;
- population vocabulary;
- time rules;
- MAP bounds or exact MAP recomputation;
- `expected_trend` semantics;
- pediatric reference-band validation;
- schema floors or allowed item types.

Readability must not depend on new `meta` fields. `vitals_trend` remains a non-arithmetic trend kind for promoted parity proof purposes.

### 5.4 Determinism

No DOM, font measurement, random state, current time, viewport-dependent SVG generation, or module-level mutable state. Responsive behavior belongs in CSS; SVG bytes depend only on the spec.

## 6. File scope

### Change

- `src/visuals/kinds/vitals_trend/index.ts`
- `src/visuals/primitives/lineChart.ts`
- `scripts/tests/vitals-trend.ts`
- `src/styles.css`
- `src/examLayout.ts` and `scripts/tests/exam-layout.ts` only if the measured split gate fails
- `src/visuals/VisualStimulus.tsx` only if CSS cannot satisfy focus behavior without changing shared interaction semantics
- `NCLEX-Question-Schema.md` after implementation, per §7
- `PROJECT-HISTORY.md` after implementation, appending around unrelated live edits rather than replacing them
- promoted `vitals_trend` parity snapshot and generated receipt only through the rebaseline command in §9

### Must not change

- `src/visuals/kinds/lab_trend/**`
- every other visual kind
- `src/visuals/kinds/vitals_trend/defs.ts`
- `src/types.ts`, `src/schema.ts`, or the `VitalsTrendSpec` shape
- `banks/**`
- clinical ranges, sanity bounds, MAP/expected-trend logic, grading, or answer keys
- `BANK-REVIEW-LEDGER.md`
- `CLAUDE.md`
- `DECISIONS.md` from the Codex seat

## 7. Governance and documentation

### 7.1 `DECISIONS.md` — architect/Luke write, not Codex

Codex includes the following exact proposal in the PR/handoff. It does not edit `DECISIONS.md`.

Insert under principle 25 immediately after the sentence ending `Full io_trend/fishbone litigation chronology: archived.` without reformatting surrounding text:

> **Application — composite trend artifacts.** A deterministic trend artifact may present the same typed source data through both charts and a renderer-derived table when the views provide distinct reading affordances: charts expose direction, divergence, crossover, and trajectory; the table exposes exact values in a familiar flowsheet form. The artifact-level necessity gate remains unchanged — removing the complete chart-plus-table artifact must materially change answerability, and the item must still turn on multi-timepoint or cross-series reasoning, never one isolated cell. The table is never an independently authored second source of truth. Sparse cardinality is not a validity floor here by the same reasoning principle 29 applies to laboratory presentations — principle 7 plus principle 25's anti-ornament fence — not under principle 29 itself, which remains scoped to `lab_trend` and `structured_labs_panel`. First applied to `vitals_trend` by the 2026-07-18 composite readability repair: unit-pure scale-family panels, panel-exclusive reference bands, and a renderer-derived vital-sign flowsheet, with no schema or bank-content change.

### 7.2 `NCLEX-Question-Schema.md` — implementation documentation

After code lands, append one concise paragraph to the existing `vitals_trend` subsection. Describe the renderer output, not a new authoring shape:

- unit-pure hemodynamic, respiratory/oxygenation, and temperature panels;
- pressure-left/HR-right and RR-left/SpO₂-right assignment when both families coexist;
- explicit axis units;
- dashed DBP;
- panel-exclusive reference bands;
- renderer-derived flowsheet table from the same series;
- schema shape unchanged.

Do not restate field definitions already owned by code/schema.

### 7.3 `PROJECT-HISTORY.md`

Record only the implementation that actually landed, measured split disposition, focus/mobile behavior, parity delta, and verification results. Re-read the file immediately before editing and preserve any intervening work.

Run a plain grep of final governance/schema text before commit to guard connector-path corruption.

## 8. Containment disposition

**Immediate repair; no bank quarantine.**

- The keyed answer is clinically correct; the failure is that the load-bearing data are not reliably legible.
- The repair is bounded and renderer-only.
- Dense records are 18/29, so quarantining the dense shape would effectively disable most of the kind and create sampling churn that must immediately be reversed.

This spec is the next Codex implementation task once the current unrelated worktree is clean. Hold new dense `vitals_trend` production until merge. If implementation is materially deferred, Luke may separately authorize deterministic sampling containment; do not hand-edit bank content from this spec.

## 9. Tests and proof

### 9.1 `scripts/tests/vitals-trend.ts`

Preserve unchanged primitive-default tests:

- XSS escaping;
- primitive reference-band rectangle geometry;
- primitive dual-axis point mapping.

If any of those change, an optional primitive default leaked.

Replace/update vitals-specific assertions and add regressions proving:

1. same spec → byte-identical composite SVG;
2. panel order and presence for `{hr,map}`, `{hr,temp}`, forcing six-series, and full seven-series fixtures;
3. pressure and HR occupy separate axes when both are present;
4. RR and SpO₂ occupy separate axes when both are present;
5. temperature always occupies its own panel and never shares a scale;
6. every visible axis carries the correct unit title;
7. fixed legend cells stay within x=60…540 for 6- and 7-series fixtures;
8. DBP polyline and DBP legend marker carry `6 4`; SBP does not;
9. one-series adult panel renders one band;
10. any multi-series panel renders zero bands, including explicit adult `showReferenceBand: true`;
11. pediatric implicit suppression and explicit-true rejection remain intact;
12. table headers contain every source timepoint once;
13. every present source value appears in its intended row/cell once, with no absent-vital row;
14. combined BP strings exactly equal source `SBP/DBP` pairs;
15. temperature defaults to Celsius when `tempUnit` is omitted and renders Fahrenheit correctly in a synthetic fixture;
16. outer viewBox height exactly equals measured block heights and gaps;
17. caption text is not duplicated inside the SVG.

Prefer semantic/layout invariants over incidental full-coordinate snapshots.

### 9.2 Exam-layout regression

After the measured fork:

- split retained → existing `vitals_trend splits` assertion remains true and a comment records the measured proof;
- split removed → update it to assert false and confirm the ordinary non-split route, without changing other allowlisted kinds.

### 9.3 Proof-render matrix

Capture and inspect:

- `vit_gpt_2026_07_02_t01_001` at ~1280×727 and ~1280×800 in ordinary mode;
- the same item in focus mode;
- `vit_gpt_2026_07_02_t01_004` full seven-series/minute-unit shape;
- `ex_trend_1200` staged `{hr,temp}` exhibit;
- the sole `peds_child` record;
- mobile ~390×844 in ordinary and focus modes.

Acceptance:

- every series identifiable without color alone;
- no mixed-unit y-axis;
- sepsis deterioration readable without guessing the clipped orange line;
- exact values legible in the table;
- no clipped heading, legend, axis title, cell, or caption;
- desktop no horizontal scrolling;
- mobile remains readable, with horizontal scrolling permitted where required;
- split fork resolved from evidence;
- focus interaction and one-SVG invariant preserved;
- no browser console warning/error introduced.

### 9.4 Full verification

Run from the isolated clean task branch/worktree:

```bash
npm run test-visuals
npm run test:exam-layout
npm run validate-bank -- banks/*.json
npx tsc -b --pretty false
npm run build
```

Also run the kind-specific test directly if needed during iteration.

### 9.5 Promoted parity rebaseline

Only after code/tests/docs are final and the task diff contains no unrelated renderer or bank changes:

```bash
npm run parity:rebaseline -- \
  --scope vitals_trend \
  --reason "intentional vitals_trend composite renderer change (VITALS-TREND-COMPOSITE-READABILITY-ARCHITECT-SPEC-2026-07-18.md)"
```

Expected receipt:

- exactly 29 changed `vitals_trend` identities;
- 0 added;
- 0 removed;
- 28 top-level-question locations and 1 case-stage-exhibit location;
- zero hash movement for `lab_trend` or any other kind.

Any added/removed identity means bank/location drift. Any non-`vitals_trend` hash movement means a primitive default or unrelated task leaked. Stop, restore the clean scope, and fix before accepting the receipt. Never hand-edit snapshot hashes.

## 10. Out of scope

- new visual kinds;
- schema-version changes or author-selectable layouts;
- bank edits or answer-key changes;
- new reference ranges, sanity-bound work, or unit conversion;
- `lab_trend` redesign;
- custom zoom/pan;
- a second flowsheet payload;
- proportional-font measurement;
- pre-ratified nested/sticky scrolling;
- content re-review of all 29 promoted items. If proof rendering exposes a separate single-cell/collapse defect, report that item for an independent content disposition rather than changing it in this PR.

## 11. Codex deliverable

A focused PR that:

1. implements §§4–6;
2. adds the deterministic regressions in §9.1;
3. produces the §9.3 proof evidence and resolves the split fork;
4. updates schema/history documentation as authorized, while proposing but not writing the principle-25 text;
5. runs the full verification and exact-scope parity rebaseline;
6. leaves banks, schema shapes, clinical logic, and all non-vitals renderer bytes untouched;
7. reports any genuine live-source contradiction instead of inventing a new product decision.
