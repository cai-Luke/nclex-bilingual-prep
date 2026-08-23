# Fishbone lab presentation proof render

- Date: 2026-08-19
- Frozen base: `011a340bad2643dcee954ae3c3f2566c12524870`
- Branch: `codex/fishbone-proof-render-2026-08-19`
- Terminal status: **FISHBONE_PROOF_BLOCKED**
- Scope: proof only; no production routing, schema, registry, runtime, bank, or dependency change.
- Missing evidence:
  - `FISHBONE_PROOF_CATEGORY_NOT_FOUND` — `bmp_or_near_full`; predicate `templateMatch === 'BMP' AND rowCount >= 6`
  - `FISHBONE_PROOF_CATEGORY_NOT_FOUND` — `expanded_chemistry_well_populated`; predicate `templateMatch === 'expanded chemistry' AND rowCount >= 7 AND core-BMP-key count >= 6 AND at least one of ast|alt|total_bilirubin`

## Population

The deterministic scan covered 13 top-level bank files and found 126 structured lab panels: 125 one-column and 1 with two or more columns.

Template counts: `{"CBC":5,"BMP":14,"expanded chemistry":5,"NO_TEMPLATE_MATCH":102}`. Analyte-count distribution: `{"1":13,"2":11,"3":15,"4":12,"5":23,"6":11,"7":6,"8":6,"9":3,"10":5,"11":6,"12":4,"14":3,"15":4,"16":3,"17":1}`.

Template row-count ranges: `{"CBC":{"min":1,"max":3},"BMP":{"min":1,"max":5},"expanded chemistry":{"min":2,"max":5},"NO_TEMPLATE_MATCH":{"min":1,"max":17}}`. Required-category qualifying counts: `{"full_or_near_full_cbc":1,"sparse_cbc_subset":4,"bmp_or_near_full":0,"expanded_chemistry_well_populated":0,"no_template_flat_fallback":102}`.

## Deterministic selections

| Category | Predicate | Result | Source |
|---|---|---|---|
| Full or near-full CBC | `templateMatch === 'CBC' AND rowCount >= 3` | SELECTED | banks/claude-canonical.json :: opus27_case_ipv_prenatal_care_01 :: questions[66].caseStudy.exhibits[1].structuredMeasurements.panels[1] |
| Sparse CBC subset | `templateMatch === 'CBC' AND rowCount <= 2` | SELECTED | banks/claude-canonical.json :: opus22_case_postpartum_intrusive_thoughts_01 :: questions[62].caseStudy.exhibits[2].structuredMeasurements.panels[1] |
| BMP or near-full BMP | `templateMatch === 'BMP' AND rowCount >= 6` | FISHBONE_PROOF_CATEGORY_NOT_FOUND | — |
| Well-populated expanded chemistry | `templateMatch === 'expanded chemistry' AND rowCount >= 7 AND core-BMP-key count >= 6 AND at least one of ast|alt|total_bilirubin` | FISHBONE_PROOF_CATEGORY_NOT_FOUND | — |
| No-template flat fallback | `templateMatch === 'NO_TEMPLATE_MATCH'` | SELECTED | banks/claude-canonical.json :: opus1_case_tha_discharge_lep_01 :: questions[59].caseStudy.exhibits[0].structuredMeasurements.panels[1] |

## Conditions

| # | Condition | Result |
|---:|---|---|
| 1 | Exact value-tuple preservation | **PASS** |
| 2 | No clinical inference | **PASS** |
| 3 | Deterministic non-clinical voids | **PASS** |
| 4 | Exact fallback and deterministic matching | **PASS** |
| 5 | Responsive geometry | **PASS** |
| 6 | Bilingual and accessible label preservation | **PASS** |
| 7 | Same typed input and no production routing | **PASS** |

### 1. Exact value-tuple preservation: PASS

- 20 render legs compared source, current-flat, and candidate exact sorted multisets of (row.key, column.id, value, unit, bound).
- 0 typed-bound tuple observations were included across render legs.

### 2. No clinical inference: PASS

- Candidate semantic models contain only source keys, source bilingual labels, exact value tuples, and display text from the existing formatStructuredMeasurementValue helper.
- No reference range, high/low flag, interpretation, derived result, or answer logic is generated; arbitrary SVG numerics are intentionally excluded from the check.

### 3. Deterministic non-clinical voids: PASS

- 16 void slot observations used EMPTY_OUTLINED_SLOT_WITHOUT_TEXT_OR_GLYPH.
- Void slots contain an outline only and no numeric-looking value, dash, N/A label, or other clinical-result glyph.

### 4. Exact fallback and deterministic matching: PASS

- 102 of 102 live no-template panels called the current flat renderer directly and compared full SVG bytes; 12 selected/multi render legs also expose the fallback visually.
- Template matching is pure, whole-panel, smallest-template-first, and separately checked twice by the focused test.

### 5. Responsive geometry: PASS

- 20 render legs measured desktop 1325px and narrow/mobile 249px targets.
- Surface overflow is distinguished from the current flat renderer's contained internal horizontal scroller.
- Every height delta versus the current flat rendering is recorded in manifest.json.

### 6. Bilingual and accessible label preservation: PASS

- Arm A checked 4 semantic models for visible source English and Chinese labels.
- Arm B checked 4 semantic models for source English and Chinese labels in the accessible layer.
- The live on-tap interaction has no position-only label anchor; that is reported as an owner product-shape fork, not hidden by this proof.

### 7. Same typed input and no production routing: PASS

- The prototype accepts StructuredMeasurementPanel directly and emits proof SVG/model output without schema fields, visual registry kinds, runtime routing, or bank mutation.
- Smallest future attachment point: src/StructuredMeasurementsStimulus.tsx, delegating presentation from the existing typed structuredMeasurements surface; no attachment was made.

## Multi-column fork

The first byte-sorted multi-column panel is `questions[306].caseStudy.exhibits[0].structuredMeasurements.panels[1]` in `banks/gpt-canonical.json`. M1 outcome: NO_TEMPLATE_MATCH_DIRECT_FLAT_FALLBACK: the frozen whole-panel safety rule takes precedence; no alternate multi-column case was substituted. M2 outcome: CURRENT_FLAT_FALLBACK_RENDERED No winner is selected.

## Width and layout basis

- Desktop target: 1325px, derived from the live 1400px wide-main maximum and nested split-case/exhibit border-box insets.
- Narrow/mobile target: 249px, derived from the live 320px body floor and current mobile session/card/exhibit border-box insets.
- Live breakpoints: 820px for the generic split layout and 780px for the mobile session/inset rules used by the narrow target. Live non-compact flat minimum: 448px (28rem at 16px).
- The current flat renderer's narrow internal scroll is recorded separately; the containing figure prevents page/surface overflow.

## Product-shape forks for owner review

- Arm A keeps both English and Chinese labels visibly attached to each occupied position; Arm B makes position primary and retains both labels in the accessible layer. Owner must choose; this proof does not choose.
- The live language mode `on-tap` expects a visible/tappable bilingual text surface. Arm B has no visible row-label anchor, so production would need an explicit focus/tap disclosure design without changing the data contract.
- The only multi-column panel is a whole-panel NO_TEMPLATE_MATCH. M1 therefore resolves to the mandatory intact flat fallback and cannot supply fishbone geometry without violating the frozen safety rule; M2 also falls back flat. No alternate case was substituted and no winner was chosen.
- The current split chart pane caps vertical space at 40vh. Fishbone height deltas are measured here; any production choice must decide whether vertical scrolling inside that pane remains acceptable.
- Smallest future attachment point is src/StructuredMeasurementsStimulus.tsx, using the existing StructuredMeasurements input and existing P23 allocation. No source attachment or routing is part of this commission.

## Smallest future production plan (not authorized here)

1. After owner selection, place the approved pure presentation helper beside the current structured-measurements renderer while keeping StructuredMeasurements as its only clinical input.
2. At src/StructuredMeasurementsStimulus.tsx, route only whole-panel frozen-template matches into the approved presentation; preserve direct current-flat fallback for every no-template panel and the owner-selected multi-column rule.
3. Keep the existing P23 compact/allocation decision intact, map all three language modes explicitly, and add production renderer/accessibility/visual regressions before any routing change is proposed.

## Verification record

- **PASS** — `focused proof-harness test`: Two independently built live-source bundles and every on-disk artifact compared byte-for-byte; no synthetic measurement payload was used.
- **PASS** — `npx --no-install tsc -b --pretty false`: The task-local TypeScript participates in project typechecking.
- **PASS** — `npm run census:check`: census.json is up to date; no census or bank artifact was regenerated.
- **PASS** — `deterministic second proof run`: The complete output tree was unchanged across the second generator run.
- **PASS** — `representative SVG visual inspection`: Available CBC Arm A/Arm B desktop and narrow renders were inspected for legibility and clipping. Multi-column M1 fishbone readability is not evaluable because the sole live multi-column panel is a mandatory NO_TEMPLATE_MATCH flat fallback.
- **PASS** — `git diff --check`: No whitespace errors.
- **NOT_RUN_BY_RULE** — `npm run build`: The dependency direction is proof harness to read-only app helpers; no application entry imports the harness and the normal Vite/file-build path is unchanged.

## Output index

- Population: `audit/fishbone-proof-render-2026-08-19/population.json`
- Machine-readable manifest: `audit/fishbone-proof-render-2026-08-19/manifest.json`
- Side-by-side SVG evidence: `audit/fishbone-proof-render-2026-08-19/renders/` (20 files)
- Prototype and focused test: `scripts/fishbone-proof/`

Technical clearance, if reached, is evidence only. It does not authorize production implementation, routing, schema changes, or bank edits.
