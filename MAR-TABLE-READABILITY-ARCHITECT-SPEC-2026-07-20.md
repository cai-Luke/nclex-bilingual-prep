# MAR Table Readability Repair — Codex Architect Spec

**Date:** 2026-07-20
**Priority:** P0 learner-facing answerability defect on a promoted, study-visible visual
**Architecture owner:** Luke
**Implementation seat:** Codex — focused renderer PR; does not merge and does not edit `DECISIONS.md`
**Forcing incident:** live study-session report on `gpt_fresh_2026_06_22_vis_06`
**Affected kind:** `mar`

This spec is closed-world. Every product and architecture decision needed for the repair is stated below. Read current disk before writing, preserve unrelated work, and surface only a genuine contradiction with live source.

## 0. Execution precondition and read order

Begin implementation only from a clean task branch/worktree. At spec-write closeout, the repository was clean except for this untracked spec; re-check rather than assuming that remains true. If unrelated deltas appear, isolate this task instead of reverting, absorbing, or rebaselining them.

Read, in order:

1. `AGENTS.md`
2. `DECISIONS.md` — principles 2, 3, 6, 23, 25, and 27
3. `PROJECT-HISTORY.md`
4. `NCLEX-Question-Schema.md` — common visual rules and `mar`
5. `src/visuals/kinds/mar/types.ts`
6. `src/visuals/kinds/mar/index.ts`
7. `src/visuals/primitives/table.ts`
8. `src/visuals/VisualStimulus.tsx`
9. the MAR and visual-focus selectors in `src/styles.css`
10. `src/examLayout.ts`
11. `scripts/promoted-visual-parity.ts`
12. `scripts/tests/visual-parity-promoted.ts`, `scripts/tests/visuals-conformance.ts`, and one current kind-specific visual test such as `scripts/tests/vitals-trend.ts`

Inspect `git status` and the live diff before every documentation or parity write.

## 1. Forcing incident and confirmed identity

The learner reported that the final row of a MAR was unreadable because its characters painted across neighboring cells. The promoted item is now positively identified:

- bank: `banks/gpt-canonical.json`
- question / parity identity: `gpt_fresh_2026_06_22_vis_06`
- visual kind: `mar`
- keyed MAR cells:
  - `Heparin Infusion` at `0800`
  - `Apixaban` at `0900`
  - `Heparin Discontinue Order` at `1000`

The long final medication label is legitimate authored content. It must not be abbreviated, renamed, removed, or moved into the stem to accommodate the renderer.

The answer-key and clinical-content review are not reopened by this task. This is a presentation defect: the table does not contain its own text.

## 2. Live-source diagnosis

The current failure is produced by the interaction of four live contracts:

1. `renderMarSvg()` always allocates a 600-unit canvas and fixed column fractions:
   - medication `2fr`
   - dose `1.5fr`
   - route `1fr`
   - frequency `1fr`
   - each time slot `1fr`
2. Every MAR body row is fixed at 28 units and the header at 32 units.
3. `renderDocTable()` renders every cell as one unwrapped SVG `<text>` node.
4. Cells have no clipping or viewport containment, so a long label continues painting across column dividers and over adjacent values.

The defect is not unique to the forcing item. The promoted corpus already contains other legitimate stress strings, including:

- `hydrocodone-acetaminophen`
- `trimethoprim-sulfamethoxazole`
- `0.9% sodium chloride flush`
- frequencies such as `PRN q4h pain`, `q8h PRN anxiety`, and `before meals`

The current promoted parity population contains **11 MAR artifacts**. There is no dedicated `scripts/tests/mar.ts` in `test-visuals`, so the kind currently lacks a regression that would fail on this geometry.

## 3. Architectural disposition

### 3.1 Renderer repair, not schema or content repair

This task makes **no** change to:

- `MarSpec` or `MarMedication` fields;
- accepted routes or statuses;
- schema version or schema floor;
- validation or `selfCheck` semantics;
- canonical bank content, answers, rationales, or metadata;
- MAR split eligibility.

Medication name, dose, and frequency are intentionally display strings. A renderer that accepts those fields must contain and display them rather than requiring authors to write around a fixed single-line cell.

Do not add author-selectable layout flags, line-break fields, abbreviated labels, maximum string lengths, or a `timeGrid` cardinality cap in this repair.

### 3.2 Shared primitive capability; MAR-owned wrapping policy

The repair crosses one architectural boundary deliberately:

- **The shared document-table primitive owns table geometry:** column bounds, row bounds, variable-row measurement, text placement, and cell containment.
- **The MAR renderer owns MAR presentation policy:** which fields may wrap, how MAR strings are split into lines, MAR column fractions, MAR minimum width, and the resulting per-row height.

Do not implement a second MAR-only table renderer. That would duplicate borders, fills, flagged-cell behavior, alignment, measurement, and future table maintenance.

Do not make the shared primitive guess how arbitrary clinical strings should wrap. Other consumers (`structuredMeasurements`, `io_record`, `io_trend`, and the unit-pure `vitals_trend` fallback) keep their current inputs and behavior.

The primitive extension must be opt-in. When the new multiline/containment inputs are omitted, existing non-MAR `renderDocTable()` output must remain byte-identical.

### 3.3 MAR remains a full-width dense visual

`mar` stays excluded from `STANDALONE_SPLIT_VISUAL_KINDS`. Principle 23 already records that its time-grid density does not fit the narrow standalone visual pane. This task does not reopen that measured layout decision.

At ordinary desktop width, the current promoted corpus remains centered at its 600-unit design width. On a viewport narrower than the MAR canvas, the visual scrolls horizontally at a readable scale instead of shrinking the table until the text is tiny. Focus mode preserves the same minimum readable width and uses its existing scroll container.

This is a targeted MAR sizing rule, not a global visual policy change.

## 4. Ratified rendering contract

### 4.1 Canvas width and time-grid growth

Keep the existing column proportions:

- medication `2fr`
- dose `1.5fr`
- route `1fr`
- frequency `1fr`
- each time slot `1fr`

Define the MAR table width deterministically as:

```ts
max(600, 56 * (5.5 + timeGrid.length))
```

The `5.5` term is the sum of the four non-time column fractions. This preserves a 600-unit canvas for up to five time slots — covering the current promoted shapes — and prevents future valid MARs with six or more slots from compressing every column indefinitely. Beyond five slots, the canvas grows while retaining a minimum 56-unit column fraction and relies on the MAR scroll contract rather than shrinking text.

Do not make SVG bytes viewport-dependent. The width is a pure function of `MarSpec` only.

### 4.2 Deterministic word-aware wrapping

Wrap the following MAR body fields:

- medication name;
- dose;
- frequency.

Route and administration-status cells remain single-line. Time-grid header labels may wrap when necessary because the validator currently requires only a nonempty unique string, not a four-digit time format.

Wrapping rules:

1. Use a deterministic code-point width estimate; never use `getBBox`, canvas measurement, DOM APIs, browser font metrics, or viewport state.
2. Prefer breaks at existing whitespace.
3. Treat hyphens as legal break opportunities while preserving the hyphen character.
4. If one token still exceeds the available line width, hard-break it deterministically by code point.
5. Handle Han characters conservatively as full-em width.
6. Add a safety margin inside the nominal cell width so ordinary cross-browser font differences do not turn a line that barely fits in one browser into a clipped line in another.
7. Never truncate, ellipsize, abbreviate, substitute, or silently drop authored characters.

The wrapping helper may live in `src/visuals/kinds/mar/index.ts` or a MAR-local sibling module. Do not refactor the unrelated approximate-width helper in `src/structuredMeasurements.ts` merely to deduplicate a small function in this PR.

### 4.3 Variable row and header heights

The shared table primitive gains an opt-in multiline representation and variable row heights.

The exact TypeScript names are implementer-owned, but the resulting contract must support all of the following without changing existing call sites:

- a cell can carry precomputed display lines while retaining its full source text;
- a column header can carry precomputed display lines;
- a body row can be taller than the default row height;
- `measureDocTable()` and `renderDocTable()` consume one shared row/header metric calculation;
- callers that supply no multiline data continue to receive the current fixed-height output.

MAR line geometry:

- body font size remains 12;
- body line height: 14 units;
- vertical padding: 7 units above and below the line stack;
- body row height: `max(28, maxCellLineCount * 14 + 14)`;
- header font size remains 11;
- header line height: 13 units;
- header vertical padding: 6 units above and below;
- header height: `max(32, maxHeaderLineCount * 13 + 12)`.

One-line rows therefore stay exactly 28 units tall and a one-line header stays exactly 32 units tall. Multi-line rows expand only as much as their tallest cell requires.

Text line stacks are vertically centered inside their row/header allocation. Existing horizontal alignment remains unchanged: medication and dose left-aligned; route, frequency, time headers, and statuses centered.

### 4.4 Cell containment

Every MAR header and body cell must have a real paint boundary. A wrapping estimate is not itself containment.

Use a nested SVG viewport for each opt-in contained cell, with explicit `overflow="hidden"`, positioned inside that cell's bounds. This avoids global or generated `<clipPath>` identifiers, which can collide when the same SVG is mounted twice during focus-mode transitions or elsewhere in the document.

Containment requirements:

- no cell can paint across a vertical divider;
- no line can paint into the row above or below;
- flagged-cell backgrounds still fill the entire status cell at the resolved row height;
- bold/high-alert medication styling applies to every wrapped line;
- route and status glyphs are vertically centered in the resolved row height;
- containment applies to single-line MAR cells as well as wrapped cells.

The non-MAR default primitive path must not acquire nested cell viewports or any other byte change.

### 4.5 Measurement and assembly

`renderMarSvg()` must stop duplicating the formula `headerHeight + medicationCount * rowHeight`.

Build one `DocTableInput`, pass it to both:

- `measureDocTable()` for the root viewBox/intrinsic height;
- `renderDocTable()` for the body.

The root SVG width and height must match the resolved table width and measured height exactly. Emit intrinsic dimensions so CSS can preserve the readable MAR canvas rather than scaling every MAR to the available mobile width.

The same `MarSpec` must produce byte-identical SVG on repeated calls.

### 4.6 Ordinary, mobile, and focus presentation

Update only MAR-specific CSS as needed:

- ordinary desktop: a current promoted MAR remains at its 600-unit intrinsic width, centered, with no horizontal scroll when its container is at least 600 CSS pixels wide;
- ordinary narrow/mobile: `.vis-mar` scrolls horizontally and the SVG does not shrink below 600 CSS pixels;
- future MARs wider than 600 because of the §4.1 formula retain their intrinsic width and scroll where the container is narrower;
- focus mode: preserve the existing full-screen dialog, Close/Escape/backdrop dismissal, body-scroll restoration, focus return, and one-SVG rendering; the MAR remains at least its intrinsic readable width inside `.visual-focus-body`;
- desktop focus must not introduce a second nested horizontal scrollbar around a 600-unit current MAR;
- print behavior must remain readable and must not clip authored rows.

No `VisualStimulus.tsx` change is expected. Change it only if the CSS/intrinsic-size contract cannot be satisfied without doing so, and preserve all kind-agnostic focus semantics.

## 5. Corpus and regression contract

Before implementation, deterministically load the promoted visual inventory through `loadPromotedVisualRecords()` and confirm:

- exactly 11 promoted `mar` records;
- the forcing identity `gpt_fresh_2026_06_22_vis_06` is present;
- all 11 are top-level question visuals;
- no current record expands beyond 600 units under §4.1.

If these facts have drifted, report the delta before writing parity or documentation. Do not silently rewrite the expected population in this spec.

## 6. Tests

### 6.1 Add a dedicated MAR test

Create `scripts/tests/mar.ts` and wire it into `npm run test-visuals` before the generic conformance/parity stages.

Prefer assertions against a pure MAR table model/layout helper used by the renderer rather than fragile incidental coordinate snapshots. Stable production data attributes may be added to contained table cells if they materially improve geometric assertions, but do not add test-only rendering behavior.

The test must prove:

1. identical `MarSpec` input produces byte-identical SVG;
2. validation and `selfCheck` behavior remain unchanged, including keyed-cell resolution and status validation;
3. the forcing record is loaded by exact ID from the promoted inventory rather than retyped as a look-alike fixture;
4. `Heparin Discontinue Order` is split into multiple visible lines without truncation or cross-cell paint;
5. all forcing-record keyed status cells and labels remain present and aligned to `0800`, `0900`, and `1000`;
6. medication, dose, and frequency wrapping preserves all authored characters;
7. hyphenated strings such as `hydrocodone-acetaminophen` and `trimethoprim-sulfamethoxazole` wrap deterministically;
8. a long unbroken synthetic token hard-breaks and remains fully recoverable from the rendered line sequence;
9. a one-line row remains exactly 28 units high;
10. a two-line and three-line row expand according to §4.3;
11. the header remains 32 units for current four-digit time labels and expands for a synthetic long header;
12. status glyphs and flagged backgrounds are vertically centered/fill the resolved row height;
13. high-alert bold styling applies to every medication-name line;
14. every contained cell viewport stays within its computed column and row bounds;
15. the root viewBox width/height exactly match the table width and `measureDocTable()` result;
16. a five-slot fixture remains 600 units wide;
17. a six-slot fixture expands to 644 units and does not narrow any fraction below 56 units;
18. all 11 promoted MAR records validate, self-check, and render deterministically;
19. every promoted medication name, dose, frequency, route, time label, and rendered status survives in the renderer's source-text/line model with no truncation;
20. the current promoted corpus remains 600 units wide.

### 6.2 Shared primitive non-regression

Add focused primitive assertions proving:

- a legacy single-line `DocTableInput` produces the exact pre-change SVG string;
- omitted multiline/containment options preserve current `measureDocTable()` behavior;
- variable rows are summed, not multiplied by one global row height;
- render and measurement use identical resolved metrics;
- contained multiline cells cannot paint outside their viewport;
- no generated/global clip IDs are emitted.

Existing non-MAR promoted parity is the final blast-radius check; do not rely on it as the only proof of default-byte preservation.

### 6.3 Browser proof matrix

Capture and inspect at minimum:

- `gpt_fresh_2026_06_22_vis_06` in ordinary desktop study view;
- the same item in focus mode;
- `mar_acetaminophen_duplicate_products_04` for the long combination-drug and PRN-frequency rows;
- `mar_warfarin_antibiotic_bleeding_06` for the long hyphenated antibiotic;
- one ordinary short-name MAR as a compact control;
- mobile approximately 390×844 in ordinary and focus modes;
- a synthetic six-slot fixture in Preview Lab or an equivalent deterministic local proof surface.

Acceptance:

- no text overlaps another cell or row;
- no authored clinical text is truncated or abbreviated;
- current desktop MARs remain comfortably readable at 600 units;
- mobile preserves a readable scale through horizontal scrolling rather than shrinking;
- row expansion does not obscure status timing or create ambiguous row association;
- the final row and bottom border remain fully reachable;
- no unexpected page-level horizontal overflow outside the visual container;
- focus interaction remains unchanged;
- no browser console warning/error is introduced.

## 7. File scope

### Change

- `src/visuals/primitives/table.ts`
- `src/visuals/kinds/mar/index.ts`
- `scripts/tests/mar.ts`
- `package.json`
- MAR-specific selectors in `src/styles.css`
- `NCLEX-Question-Schema.md` after implementation, per §8
- `PROJECT-HISTORY.md` after implementation, per §8
- promoted MAR parity snapshot and generated receipt only through §9's rebaseline command

### Change only if proven necessary

- `src/visuals/VisualStimulus.tsx` — only if intrinsic MAR sizing cannot be preserved through renderer output plus CSS

### Must not change

- `src/visuals/kinds/mar/types.ts`
- `src/types.ts`, `src/schema.ts`, or `src/allowedKeys.ts`
- `src/examLayout.ts` or MAR split eligibility
- any bank file under `banks/**`
- answer keys, rationales, clinical sources, validation vocabulary, or `selfCheck` meaning
- other visual-kind renderers
- `DECISIONS.md` from the Codex seat
- `BANK-REVIEW-LEDGER.md`

## 8. Documentation and governance

### 8.1 No new constitutional principle

No `DECISIONS.md` amendment is required. The repair applies existing principles:

- principle 3 — deterministic geometry;
- principle 6 — a load-bearing visual must be answerable;
- principle 23 — MAR remains full-width because its measured geometry is too dense for split view;
- principle 27 — existing non-MAR table output does not soften without a forcing incident.

The durable architecture is fully captured by code plus the schema's renderer note. Do not promote implementation details such as line height or width-estimation coefficients into constitutional prose.

### 8.2 `NCLEX-Question-Schema.md`

After code lands, add one concise renderer-behavior paragraph to the existing `mar` subsection:

- authoring shape unchanged;
- medication/dose/frequency and long time labels wrap deterministically;
- rows expand to preserve complete text;
- cells are paint-contained;
- the canvas remains 600 units through five time slots and grows for denser grids rather than compressing columns indefinitely;
- narrow viewports scroll at a readable scale;
- no author-supplied layout or line-break fields.

Do not restate exact TypeScript field definitions or validation rules already owned by source.

### 8.3 `PROJECT-HISTORY.md`

Record only what actually landed:

- forcing ID;
- renderer/primitive boundary;
- measured desktop/mobile/focus result;
- exact promoted parity delta;
- verification commands and results.

Re-read immediately before editing and append around unrelated live work.

## 9. Verification and parity

Run from the isolated clean task branch/worktree:

```bash
npx tsx scripts/tests/mar.ts
npm run test-visuals
npm run validate-bank -- banks/*.json
npx tsc -b --pretty false
npm run build
git diff --check
```

`selfCheck` is not arithmetic for MAR, so no numeric-equality proof is required. Its keyed-cell/relationship regressions are required.

After code, tests, CSS, and docs are final — and only when the diff contains no bank or unrelated renderer change — rebaseline:

```bash
npm run parity:rebaseline -- \
  --scope mar \
  --reason "intentional MAR multiline containment and variable-row repair (MAR-TABLE-READABILITY-ARCHITECT-SPEC-2026-07-20.md)"
```

Expected receipt:

- exactly 11 changed `mar` identities;
- 0 added;
- 0 removed;
- all 11 at top-level-question location;
- zero hash movement for every non-`mar` kind.

The 11 hashes are expected to move because MAR opts into contained cell viewports even where a particular row remains one line. Any non-MAR hash movement means the shared primitive default path leaked. Stop and fix that leak; do not accept a broad rebaseline. Never hand-edit snapshot hashes.

If the promoted population or location count has legitimately drifted before implementation, report it and obtain an updated expected receipt rather than silently changing this spec.

## 10. Out of scope

- learner-facing issue reporting or question-ID sharing;
- clinical/content re-review of the forcing item;
- abbreviation or rewriting of MAR strings;
- author-supplied line breaks or layout metadata;
- a schema-level maximum for strings, medication rows, or time slots;
- semantic HTML-table replacement or a new accessibility architecture;
- MAR split-view admission;
- interactive sticky columns, zoom/pan, or frozen headers;
- bilingual text inside the SVG;
- redesigning status glyphs, colors, or clinical meaning;
- global refactoring of every document-table consumer.

If proof rendering exposes a separate content defect or a density shape that remains unreadable despite the width-growth and wrapping contract, report it as a new issue rather than broadening this PR.

## 11. Codex deliverable

A focused PR that:

1. implements the shared opt-in table capability and MAR-owned policy in §§3–4;
2. adds and wires the deterministic regressions in §6;
3. produces the browser proof matrix;
4. updates only the authorized documentation after implementation;
5. runs the full verification and exact-scope MAR parity rebaseline;
6. leaves banks, schema shapes, validation/selfCheck meaning, split eligibility, and every non-MAR renderer byte untouched;
7. reports any genuine live-source contradiction instead of inventing a new product decision.
