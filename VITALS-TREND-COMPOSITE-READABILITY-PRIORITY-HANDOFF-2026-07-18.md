# Vitals-Trend Composite Readability — Priority Architect Handoff

**Date:** 2026-07-18
**Priority:** P0 learner-facing correctness defect
**Architect seat:** Claude
**Implementation seat:** Codex
**Forcing incident:** live study-session observation on `vit_gpt_2026_07_02_t01_001`

## 1. Why this is priority work

This is not ordinary visual polish. The promoted question below is currently study-visible, and its keyed response depends on the learner recognizing a deteriorating multi-vital trajectory:

- **Question id:** `vit_gpt_2026_07_02_t01_001`
- **Stem:** adult with pyelonephritis receiving IV fluids and a first antibiotic dose; choose the priority action from the vital-sign trend
- **Intended clinical read:** worsening tachycardia/tachypnea with falling blood pressure/MAP and persistent fever, requiring escalation and sepsis support rather than routine reassessment

In the current desktop split render, the chart is reduced to a small 600×300 artifact in the narrow left pane. In focus mode it becomes a larger copy of the same malformed artifact rather than a reflowed presentation. During the live session:

- the final legend entry was clipped, so the orange temperature series could not be identified;
- SBP and DBP used the same blue styling;
- RR shared the broad pressure/heart-rate axis and was compressed near the bottom;
- the temperature axis had numeric ticks but no identifying axis title;
- overlapping per-series reference bands produced layered gray stripes;
- no exact-value view was available to recover the clinical record;
- the standalone split pane left substantial unused vertical space while the load-bearing visual remained difficult to interpret.

Luke's judgment is that the item does not presently provide the information in a reliably usable form. Treat this as an answerability defect on a promoted load-bearing visual, not as a discretionary UX enhancement.

## 2. Read before specifying

Read current disk, in this order:

1. `AGENTS.md`
2. `PROJECT-HISTORY.md`
3. `DECISIONS.md` — especially principles 6, 23, 25, 27, and 29
4. `NCLEX-Question-Schema.md` — `vitals_trend` and common visual rules
5. `src/visuals/kinds/vitals_trend/index.ts`
6. `src/visuals/kinds/vitals_trend/defs.ts`
7. `src/visuals/primitives/lineChart.ts`
8. `src/visuals/VisualStimulus.tsx`
9. `src/examLayout.ts`
10. the relevant CSS in `src/styles.css`
11. `scripts/tests/vitals-trend.ts`
12. the promoted visual parity workflow and current `vitals_trend` snapshot

Inspect `git status` and the live diff before writing. `DECISIONS.md` and `PROJECT-HISTORY.md` already carry unrelated worktree edits on the current branch; do not overwrite, revert, or casually reformat them.

## 3. Ratified product decisions

The following calls are already made. Do not re-litigate them as open questions.

### 3.1 Do not fix this by merely widening the legend

The clipped legend exposed a deeper presentation failure. A wider single-row legend would leave mixed scales, duplicate styling, reference-band noise, compressed RR, and poor use of the split pane intact.

### 3.2 The visual may include a compact vital-sign table beneath the charts

The assessed skill is clinical interpretation of serial vital signs and selection of the correct nursing response. It is not graph-literacy purity. A familiar flowsheet-style table is permitted when it makes the exact record recoverable and improves the clinical read.

This does **not** repeal or soften the artifact-level necessity gate:

- the stem still must not state the carried values or interpreted trajectory;
- removing the **complete chart-plus-table artifact** must materially change answerability;
- the item must still turn on multi-timepoint or cross-series reasoning rather than one isolated cell;
- the table must be renderer-derived from the same typed `visual.series` and time data, never independently authored or stored as a second source of truth.

This is an application of `DECISIONS.md` principle 25: a necessary artifact may contain redundant internal views when they provide distinct reading affordances.

### 3.3 No schema or routine bank-content change

The existing `VitalsTrendSpec` contains all required source data. Do not add layout flags, table rows, panel assignments, duplicated values, or a new schema version. The renderer owns the presentation.

The current question payload and answer key should remain unchanged unless Claude explicitly determines that temporary quarantine is required under §8.

## 4. Required learner-facing result

The final architecture must produce a composite `vitals_trend` artifact that works in both the standalone split pane and the existing focus dialog.

### 4.1 Adaptive chart grouping

For dense records, use two vertically aligned chart panels sharing the same time axis:

- **Hemodynamic panel:** `hr`, `sbp`, `dbp`, `map`
- **Respiratory / oxygenation / temperature panel:** `rr`, `spo2`, `temp`

Omit an empty panel. Sparse one- and two-series records remain valid under principle 29 and must not be forced into awkward empty or filler layouts. The renderer may use a single panel for sparse combinations when that is clearer, but the grouping policy must be deterministic and require no author input.

### 4.2 Complete, non-clipping identification

Every rendered series must be identifiable without inference from color or endpoint position.

Required outcomes:

- legends wrap or otherwise reflow within the viewBox;
- no legend label is clipped at any supported cardinality;
- temperature is explicitly identified with the active unit;
- any right-side scale is explicitly titled rather than relying on the legend alone;
- SBP and DBP are distinguishable by more than identical color — for example solid versus dashed stroke, with the legend reflecting the distinction;
- the solution must remain readable for color-vision differences and monochrome review.

The exact legend mechanism may be panel-local legends or another measured equivalent, but fixed `legendX += 100` placement is not acceptable.

### 4.3 Reference-band discipline

Do not continue drawing one overlapping gray band for every default adult series on a shared panel. Specify a deterministic rule that removes or substantially reduces this noise while preserving any clinically useful reference affordance and respecting the existing `showReferenceBand` contract.

The architecture must state how omitted, `true`, and `false` flags behave for:

- sparse adult charts;
- dense adult charts;
- pediatric charts, which currently suppress implicit bands and reject explicitly enabled bands.

Do not introduce new clinical ranges or reopen the separate vital-sanity-bound workstream.

### 4.4 Renderer-derived flowsheet table

Render a compact table beneath the chart area from the same source arrays.

Preferred visible order:

1. HR
2. BP as `SBP/DBP` when both are present; otherwise retain the available pressure row explicitly
3. MAP
4. RR
5. SpO₂
6. Temperature with the active unit

Timepoints are columns. Values must be exact deterministic renderings of `spec.series[*].values`; the table may not round or transform them differently from the chart's source values. The table is a view, not a new data contract.

The table should resemble a concise clinical flowsheet rather than a second oversized chart. Reuse the existing measured table primitives when suitable, but do not force a primitive whose geometry or semantics make the result worse.

### 4.5 Use the available space without breaking focus mode

The current standalone split admission was calibrated against a 600×300 `vitals_trend`. The accepted composite will be taller. Re-measure rather than assuming the old layout remains valid.

The spec must cover:

- desktop split behavior at the observed approximately 1280×727 / 1280×800 session sizes;
- whether the sticky visual pane needs a viewport cap or internal scrolling;
- focus-dialog sizing for a taller viewBox — the current `width: 100%` rule must not scale the composite beyond the usable viewport height and turn the exact-value table into an off-screen afterthought;
- mobile behavior near 390×844, including horizontal overflow only where genuinely necessary;
- caption placement and preservation of the existing one-SVG-mounted focus-dialog invariant.

Do not add custom zoom/pan controls in this pass unless the measured composite cannot be made usable without them. The existing focus-dialog interaction itself is not being redesigned.

## 5. Implementation architecture constraints

### 5.1 Preserve one source of truth

Chart coordinates, legends, axes, and table cells all derive from the same `VitalsTrendSpec` object. No parallel authored table payload, duplicated registry, or bank migration.

### 5.2 Keep shared primitive blast radius explicit

`lab_trend` also consumes `renderLineChart`. If the solution extends `ChartSeries` or `LineChartInput`, new fields must be optional and default to byte-equivalent current behavior for other kinds unless their output is deliberately included in the change scope.

A vitals-specific composite wrapper is acceptable. A silent global `lineChart` redesign that changes `lab_trend` incidentally is not.

### 5.3 Validation and `selfCheck` remain clinical-data contracts

This work changes presentation, not the meaning of:

- accepted vital keys;
- value ranges;
- MAP consistency;
- expected-trend assertions;
- population vocabulary;
- schema floors.

Do not make visual readability depend on new audit-only metadata.

### 5.4 Determinism remains mandatory

The composite SVG, including measured table height and wrapped legend geometry, must render byte-identically from the same spec.

## 6. Corpus inventory before final spec

Before freezing the implementation shape, deterministically inspect all promoted `vitals_trend` artifacts across all six supported visual locations. At minimum report:

- total artifact count;
- series cardinality distribution;
- observed vital combinations;
- number containing temperature and/or SpO₂;
- adult versus pediatric population usage;
- explicit `showReferenceBand: true` / `false` usage;
- any record that would produce only one of the two proposed panels;
- the exact records representing the densest and sparsest live shapes.

Use the existing full-schema visual traversal rather than hand-searching only top-level question visuals. This inventory may be a bounded one-off architect artifact or a committed deterministic report if it materially protects the implementation, but do not invent a permanent audit lane without need.

The exact forcing-incident item must be included as a named proof record:

- `vit_gpt_2026_07_02_t01_001`

## 7. Governance record

This ruling belongs primarily in `DECISIONS.md` principle 25, not as a new exception to principle 6.

Use language materially equivalent to:

> **Application — composite trend artifacts.** A deterministic trend artifact may present the same source data through both a chart and a renderer-derived table when the two views provide distinct reading affordances: the chart exposes direction, divergence, crossover, or trajectory, while the table exposes exact values in a familiar clinical-documentation form. The artifact-level necessity gate remains unchanged: removing the complete artifact must materially change answerability, and the item must still turn on multi-timepoint reasoning rather than one isolated value. The table must be derived from the same typed series and must never become an independently authored second source of truth.

Also plan the following documentation updates:

- `NCLEX-Question-Schema.md`, `vitals_trend`: describe the composite renderer output and source-of-truth rule without changing the schema shape.
- `PROJECT-HISTORY.md`: record the concrete implementation and verification only after it lands.
- `CLAUDE.md`: do **not** duplicate the full policy. Add at most a narrow cross-reference if an operational ambiguity remains after the `DECISIONS.md` and schema updates.

Because the two governance files currently have unrelated modifications, the architect spec must include exact insertion text and placement. Apply the live edits only after reconciling the current diff safely.

## 8. Immediate containment disposition

Claude must explicitly choose one of these in the architect output:

1. **Immediate repair:** this becomes the next Codex implementation task and lands promptly enough that no temporary bank quarantine is justified; or
2. **Temporary quarantine:** if implementation will be delayed, identify the smallest affected learner-facing population that must be removed from sessions and route that change through the normal bank-content or deterministic sampling-control process.

Do not leave the promoted forcing-incident item knowingly difficult to answer under an undefined future polish backlog. Also do not quarantine the whole kind merely because one dense shape failed without first inspecting the corpus distribution.

Until the renderer is repaired or a containment decision is made, do not commission or promote additional dense `vitals_trend` content.

## 9. Required tests and proof surfaces

This is a renderer change, so the `AGENTS.md` renderer verification floor applies.

### 9.1 Focused deterministic regressions

Extend `scripts/tests/vitals-trend.ts` or add a narrowly owned companion test to prove at least:

- a six- or seven-series legend cannot clip its final entry;
- legend wrapping/measurement is deterministic;
- SBP and DBP produce distinguishable stroke semantics and matching legend markers;
- temperature scale identification includes the correct `°C` or `°F` unit;
- the table contains every present vital and every timepoint exactly once;
- combined BP cells exactly match the source SBP/DBP pairs;
- omitted series produce no phantom table rows or empty chart panels;
- sparse one-series rendering remains valid;
- pediatric implicit reference-band suppression still holds;
- the same spec produces byte-identical SVG.

Avoid brittle assertions against incidental coordinates when a measured-layout invariant can be asserted directly.

### 9.2 Browser/proof-render matrix

Smoke at minimum:

- `vit_gpt_2026_07_02_t01_001` in the normal standalone split at approximately 1280×727 and 1280×800;
- the same item in focus mode;
- a sparse one-series promoted record;
- a temperature + SpO₂ dual-right-scale or same-panel record if present;
- the densest promoted record;
- a pediatric record;
- mobile near 390×844.

Acceptance criteria:

- every parameter is identifiable;
- the sepsis forcing incident can be interpreted without guessing the clipped series;
- exact values are readable in the table;
- RR and temperature trends are not visually crushed by unrelated scales;
- no text, legend, axis title, table cell, or caption clips;
- the normal split pane no longer leaves the load-bearing artifact unnecessarily tiny while answers occupy the full height;
- focus mode fits the composite sensibly and preserves Close/Escape/backdrop/focus-return behavior;
- no duplicate SVG mounting or fixed-id regression.

### 9.3 Full verification

At minimum:

- `npm run test-visuals`
- the kind-specific vitals test
- `npm run test:exam-layout`
- `npm run validate-bank -- banks/*.json`
- `npx tsc -b --pretty false`
- `npm run build`
- visual smoke on the affected surfaces

Every promoted `vitals_trend` SVG hash is expected to change if the composite renderer is applied universally. Follow the current promoted-visual parity rebaseline contract with an intentional renderer-change cause, declared complete scope, receipt, and review evidence. Do not hand-edit parity hashes.

No `BANK-REVIEW-LEDGER.md` entry is required for a renderer-only change unless temporary quarantine changes canonical bank content.

## 10. Out of scope

- new visual kinds;
- schema-version changes;
- author-selectable panel layouts;
- duplicated table data in banks;
- new clinical reference ranges or vital sanity-bound adjudication;
- custom pan/zoom tooling unless measured proof shows the accepted composite cannot fit otherwise;
- unrelated `lab_trend` redesign;
- changing the question's clinical key merely to accommodate a weak renderer.

## 11. Claude deliverable

Produce a Codex-ready architect spec on disk that:

1. records the corpus inventory;
2. fixes the deterministic grouping, axis, legend, line-style, reference-band, table, and responsive-layout contracts;
3. identifies every file expected to change and every file that must remain untouched;
4. includes the immediate containment disposition;
5. gives exact governance insertion text while respecting the dirty worktree;
6. defines the parity rebaseline scope and proof-render set;
7. leaves no product decision for Codex to invent.

The final Claude response should name the spec file, summarize the containment call, and state any genuinely blocking issue. The implementation itself remains Codex's seat.
