Status: **ARCHIVED — unratified model-authored architecture excursion; no implementation authority.**

Provenance: Drafted by Gemini/Antigravity during recovery from an interrupted Claude MCP write session. Retained as a process artifact. Its P4 policy instinct was later partially ratified through Principle 29, but its proposed renderer implementation and verification plan were not approved.

# Shape-Aware Exam Layout Spec

Date: 2026-07-18
Author: Antigravity (architect seat)
Status: **draft — pending implementation**
Change class: presentation/renderer only (`src/examLayout.ts`, `src/structuredMeasurements.ts`, `src/styles.css`). No schema, bank, or data changes.

---

## 1. Problem Statement

Under **Principle 29** (Component cardinality is not a validity floor; sparse-but-correct is valid), single-series `lab_trend` visuals and single-row `structured_labs_panel` (part of `structuredMeasurements`) are officially ratified as valid and clinically appropriate configurations.

However, the current rendering layer is "shape-blind." It treats single-series and single-row layouts identically to multi-series and multi-row layouts:

1. **Single-Series `lab_trend` Visuals:**
   - Currently, all `lab_trend` questions are rendered in the two-column **exam split layout** (`usesStandaloneVisualSplit` returns `true`).
   - For a single analyte line chart (e.g., just Potassium over time), devoting an entire left-pane split can feel sparse, empty, and horizontally stretched.

2. **Single-Row `structuredMeasurements` Panels:**
   - Currently, all structured measurement panels are rendered as SVG tables with a fixed width of `600px`.
   - A single-row panel (e.g., a postpartum case showing only a single Hemoglobin measurement) rendered at `600px` width stretches the cells horizontally, leaving excessive white space and taking up unnecessary vertical height relative to its content density.

To improve the visual presentation, the rendering layer needs to adapt dynamically to the shape of the data.

---

## 2. Proposed Changes

### 2.1 Standalone Split Layout Exclusion for Single-Series Lab Trends

In [src/examLayout.ts](file:///Users/holemini/Desktop/Project%20Shrimp/src/examLayout.ts), update the `usesStandaloneVisualSplit` predicate to inspect the series count of a `lab_trend` visual.

- **Current Contract:** Any `lab_trend` visual is placed in the `STANDALONE_SPLIT_VISUAL_KINDS` set, causing it to render in the left-hand split layout for standalone questions.
- **New Contract:** A `lab_trend` visual with exactly one series (`series.length === 1`) is excluded from the split layout. It will render inline inside the normal question card flow, above the question stem.
- **Implementation Detail:**
  Update `usesStandaloneVisualSplit` in `src/examLayout.ts` to return `false` if `question.visual` is a `lab_trend` with `series.length === 1`.

### 2.2 Density-Aware Sizing for Single-Row Structured Measurement Panels

In [src/structuredMeasurements.ts](file:///Users/holemini/Desktop/Project%20Shrimp/src/structuredMeasurements.ts), update the SVG rendering properties when a panel has exactly one row.

- **Current Contract:** All panels render at a fixed width of `600` (`const width = 600;`).
- **New Contract:** When a panel has exactly one row (`panel.rows.length === 1`), the table width is reduced to a more compact width (e.g., `400` or dynamically scaled based on column count) to prevent horizontal stretching.
- **Implementation Detail:**
  - In `panelToTable`, check `panel.rows.length`. If it is `1`, set `width = 400` (or `450`). Otherwise, keep `width = 600`.
  - In the SVG output, ensure the container handles the smaller width gracefully. If the parent `<figure className="structured-measurements">` has styles that stretch the SVG to full width, ensure we center or left-align the compact SVG using CSS (e.g., setting a max-width or aligning it in the container).

---

## 3. Verification Plan

### 3.1 Automated Verification
- Run the visual parity regressions and tests to ensure no regressions in other visual kinds:
  ```sh
  npx tsc -b --pretty false
  npm run test-visuals
  npm run build
  ```

### 3.2 Manual / Visual Verification
- **Single-Series `lab_trend`:**
  - Load a question with a single-series `lab_trend` (e.g., `gpt_u3_labtrend_2026_06_09_mc_potassium_furosemide_01`).
  - Verify it renders inline inside the question pane rather than in the split layout.
  - Verify a two-series `lab_trend` question still correctly triggers the split layout.
- **Single-Row Panels:**
  - Load a case study with a single-row structured measurement panel (e.g., `gpt_case_gap_2026_06_11_case_adrenal_crisis_04`).
  - Verify the table renders compactly without horizontal stretching.
  - Verify multi-row panels still render at full width (`600px`).
