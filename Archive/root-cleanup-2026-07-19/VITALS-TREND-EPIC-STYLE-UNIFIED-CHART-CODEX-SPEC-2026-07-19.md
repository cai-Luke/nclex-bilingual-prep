# Vitals-Trend Epic-Style Unified Chart — Implementation Spec (A/B experiment)

**Date:** 2026-07-19
**Status:** Ratified for implementation as an A/B experiment. Not a reversal of any principle.
**Architecture owner:** Luke
**Architect seat (this spec):** Claude — authored this spec; verifies conformance; does not merge; does not write `DECISIONS.md`.
**Implementation seat:** Codex or Claude Code — PR author; does not merge; does not edit `DECISIONS.md`.
**Origin:** `VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-PROPOSAL-2026-07-19.md` (GPT-drafted product proposal), after a Claude architect litigation pass.
**Overriding decision principle for this feature:** the real user's experience decides. Luke has chosen to settle the readability trade empirically via A/B testing rather than from source argument, and to loosen some project discipline for this instance. This spec loosens *only* what that choice requires, and records the loosening on the record rather than absorbing it silently.

This spec is closed-world. Every product and integration decision needed to implement it is stated here. Read current disk before writing, preserve unrelated work, and surface only a genuinely blocking contradiction with live source.

---

## 0. What this builds, in one paragraph

A second `vitals_trend` render style — an Epic-style **single unified chart** (one time axis, one 0-based numeric y-axis, no unit title, interactive per-timepoint readout, legend-driven emphasis, no visible flowsheet) — selectable at runtime beside the current **unit-pure panels-plus-flowsheet** composite. A persisted user setting `vitalsChartStyle` chooses between them; its default is `"epic"`, so the real user experiences the Epic style in ordinary study flow and can flip to `"panels"` to compare the same items. The existing composite is preserved **byte-identical** as the `"panels"` arm. Nothing about banks, schema, clinical ranges, answer keys, validation, or `selfCheck` changes.

---

## 1. Execution precondition and read order

Begin only from a clean task branch/worktree. At spec-write closeout the repository had this spec untracked plus whatever content-lane work Luke has in flight; re-check `git status` rather than assuming. If unrelated deltas appear, isolate this task — do not revert, overwrite, absorb, or rebaseline them.

Read, in order, before writing:

1. `AGENTS.md`
2. `DECISIONS.md` — principles 6, 7, 23, 25 (including its "Application — composite trend artifacts" clause), 27, 29
3. `PROJECT-HISTORY.md` — current-status section
4. `NCLEX-Question-Schema.md` — common visual rules and `vitals_trend`
5. `VITALS-TREND-COMPOSITE-READABILITY-ARCHITECT-SPEC-2026-07-18.md` — the just-landed composite this experiment sits beside
6. `src/visuals/registry.ts`
7. `src/visuals/VisualStimulus.tsx`
8. `src/visuals/kinds/vitals_trend/index.ts`, `defs.ts`, `types.ts`
9. `src/visuals/primitives/lineChart.ts`, `table.ts`, `graphPaper.ts` (owns `fmt`, `fmtNum`, `roundTo`), `escapeXml.ts`
10. `src/examLayout.ts`
11. `src/storage.ts` (`Settings`, `defaultSettings`, `loadSettings`, `saveSettings`), `src/types.ts` (`Settings`)
12. `scripts/visual-parity-baseline.ts` and `scripts/promoted-visual-parity.ts` — the promoted-parity contract
13. `scripts/tests/vitals-trend.ts`, `scripts/tests/exam-layout.ts`
14. the relevant `src/styles.css` selectors and the `App.tsx` anchors in §8

Inspect `git status` and the live diff before every documentation or snapshot write.

---

## 2. Corpus — frozen planning input (re-run only to detect drift)

The composite readability spec's deterministic six-location traversal found **29** `vitals_trend` artifacts across the 13 bundled canonical banks: `gpt-canonical.json` 18, `vitals-canonical.json` 10, `hard-cases-canonical.json` 1; 28 top-level question visuals + 1 case-stage exhibit. Series cardinality: 2→7, 3→2, 4→2, 6→12, 7→6 (dense 6–7 series = 18/29). Temperature present 14; SpO₂ present 15; both 6. Population: adult 28 (27 explicit + 1 default), `peds_child` 1. `showReferenceBand` omitted on all 142 live series. Temperature unit: no live Fahrenheit record.

Named proof records (unchanged from the composite spec):

- **Forcing incident — `vit_gpt_2026_07_02_t01_001`:** time 0/2/4/6 hr; HR 96→130; SBP 126→92; DBP 78→58; MAP 94→69; RR 20→30; temp 38.4→38.8 °C with an intervening peak. Keyed expected trends: HR up, RR up, MAP down.
- **Densest — `vit_gpt_2026_07_02_t01_004`:** all seven vitals across 0/15/30/60 min.
- **Sparsest staged exhibit — `ex_trend_1200`:** HR + temperature across four timepoints.
- **Pediatric proof:** the sole `peds_child` record.

Re-run the inventory before implementation only to detect drift. If the population is no longer 29 or a named record is absent, stop and report the delta; do not silently rewrite scope.

---

## 3. Ratified product decisions

These are architect rulings for the Epic arm. The proposal left several open; they are closed here.

1. **Two coexisting render styles, one runtime setting.** `vitalsChartStyle: "epic" | "panels"`, persisted, **default `"epic"`**. `"panels"` renders exactly today's composite; `"epic"` renders the unified chart in §4.
2. **The `"panels"` arm is byte-identical to today.** The refactor must not change one byte of the current composite output for any record. This is a hard gate (§6).
3. **Unified single 0-based axis for multi-vital (≥2 series) records only.** All present series share one time x-axis and one numeric y-axis with **no unit title**; the y-axis communicates raw numeric position only. No panels, no left/right unit families.
4. **One-series records keep a fitted scale in the Epic arm — no universal bucket.** A single-vital "unified" chart has no unlike-unit mixing to justify a 0-based universal ceiling, and forcing e.g. temperature alone onto `0–120` destroys resolution for zero compactness gain (one series is already compact). One-series Epic output uses the same fitted single-series scale and reference-band behavior as the `"panels"` arm would for that series, minus the flowsheet. This mirrors principle 23's one-series `lab_trend` carve-out and the proposal's §7 one-series reference-band carve-out.
5. **Adaptive ceiling algorithm (multi-vital only), ratified exactly (§4.2).**
6. **No reference bands on the unified multi-series chart** (unlike units on one axis make simultaneous bands misleading). One-series Epic charts retain the existing adult single-series band behavior. No new clinical ranges.
7. **Legend: BP is one conceptual entry that emphasizes SBP+DBP together; MAP is a separate entry** (MAP is independently plotted and independently gated by `selfCheck` MAP recomputation). SBP solid / DBP dashed (`stroke-dasharray="6 4"`) is retained so the pair survives monochrome.
8. **Interactive consolidated timestamp readout + legend-driven emphasis** replace the visible flowsheet (§5). Emphasis changes opacity only and **never** rescales the y-axis.
9. **Table disposition = Route C.** No visible flowsheet in ordinary Epic view; a visually-hidden but screen-reader- and print-accessible structured value table is always present in the DOM (§5.4). Pointer-hover-only is rejected: keyboard, touch-pin, SR, and print value access are mandatory.
10. **Split re-entry is variant-aware and conditional on measured proof (§7).** If the Epic arm passes the measured split gate at 1280×727/800, `vitals_trend` becomes split-eligible **only when `vitalsChartStyle === "epic"`**; the `"panels"` arm keeps its proven full-width route. Principle 23: measured proof, never predicted.
11. **Fahrenheit is acknowledged, not hidden.** On a shared raw axis, °C temperature floors near the bottom while °F temperature (~98–104) sits mid-scale; clinically identical temperatures land at different heights across source units. The live corpus is entirely °C, so this is not an active learner risk today, but the Epic renderer must render a synthetic °F record coherently (its own value, correctly positioned) and the proof matrix (§11) includes one. No unit conversion is introduced.

---

## 4. Deterministic Epic presentation contract

`renderSvg(spec, { variant: "epic" })` must be a pure, deterministic, XML-escaped SVG string — same rules as every other renderer (no DOM, `Date`, `Math.random`, `fetch`, viewport-dependent bytes, or module-level mutable state). The same spec must produce byte-identical SVG. Transient hover/pin/emphasis state lives only in React (§5) and never in these bytes.

### 4.1 One pure model builder consumed by every surface

Add a pure function in `src/visuals/kinds/vitals_trend/index.ts`:

```
buildEpicModel(spec: VitalsTrendSpec): EpicVitalsModel
```

`EpicVitalsModel` carries everything the SVG, the interactive overlay, the readout, and the hidden table need, so there is **one** source of truth and no drift:

- `timeUnit`, `timepoints: { index, label, value }[]` (label uses `fmtNum` + the source unit, e.g. `2 h`, `15 min`);
- `yAxis: { min: number; max: number; ticks: number[] }`;
- `referenceBand?: { low: number; high: number }`;
- `series: { vital, label, unit, colorRole, dashed, points: { timeIndex, value }[] }[]` in fixed order HR, SBP, DBP, MAP, RR, SpO₂, Temperature (present-only);
- `legend: LegendEntry[]` where BP is one entry referencing both `sbp` and `dbp` when both present (individually named when only one present), MAP separate;
- `readoutByTimepoint: { timeLabel, rows: { key, label, valueText }[] }[]` — every present vital at that timestamp, BP combined as `SBP/DBP mmHg` when both present, all values via `fmtNum` directly from `spec.series[*].values`; no recomputation, normalization, or unit conversion;
- `tableModel` — the same row/column value model the `"panels"` flowsheet uses (see §4.4).

`buildEpicModel` reads only `spec` (`time`/`timepointsHr`, `series`, `population`, `tempUnit`). It introduces no author-facing flag and no `meta` dependency.

### 4.2 Adaptive ceiling (multi-vital only) — ratified

```
BUCKETS = [120, 140, 160, 180, 200, 250, 300]
maxValue = max over every present series value at every timepoint (both BP components included)
minCeiling = maxValue / 0.95            // target ~5% headroom when a bucket permits it
ceiling  = smallest bucket B in BUCKETS with B >= minCeiling
           if none exists (minCeiling > 300), ceiling = 300
```

Rationale for the ratified constants: lower bound fixed at `0`; minimum ceiling `120` so a normal SBP of 120 is never clipped; `250` (not the proposal's `240`) to align with `VITAL_DEFS.map.range.max = 250`; `300` matches the renderer's hard `hr/sbp/dbp` validation ceiling, so nothing can exceed it and clamping at `300` for near-ceiling extremes is safe. Bucket selection provides approximately 5% headroom when an available bucket permits it. At the renderer's absolute 300-value authoring ceiling, the chart may use 300 without additional headroom. The ceiling is computed once from the full dataset and is **stable across every hover, focus, tap, emphasis, and pin state** — emphasis changes opacity only. For multi-series charts, `yAxis.min = 0`, `yAxis.max = ceiling`, and `yAxis.ticks = [0, ceiling / 2, ceiling]`. For one-series charts, `yAxis` uses the existing fitted-scale calculation and `referenceBand` uses the existing adult single-series rule. Use the exact arithmetic above; the dedicated snapshot (§6.2) pins the resulting bytes.

### 4.3 Unified chart SVG

Assemble the unified chart inside `vitals_trend/index.ts` (reuse `fmt`, `fmtNum`, `escapeXml`, and any pure geometry helpers; do **not** add new parameters to `lineChart.ts`/`table.ts` — the shared primitives' default output must stay byte-identical for `lab_trend` and every other kind). Emit:

- one plot with all present series as polylines + point markers, colors from `colorForStyleRole`, DBP dashed `6 4`;
- one x-axis (time ticks at each timepoint; lowest-level axis title `Time (Hours)` or `Time (Minutes)`);
- one y-axis using `model.yAxis`, **no unit title**;
- an interactive legend (see §5.3) with the BP-grouped vocabulary from §4.1;
- **deterministic data attributes** for the interaction layer to bind to, all present in the static bytes:
  - root: `data-kind="vitals_trend" data-variant="epic"`;
  - each series group: `data-vital="<key>"`;
  - each legend entry group: `data-legend="<hr|bp|map|rr|spo2|temp>"` (BP entry carries `data-legend="bp"` and covers both pressure series);
  - one full-plot-height transparent geometry rect per timepoint: `data-timepoint-index="<i>"` with its deterministic x extent (midpoint between neighbors), so the React layer can align a target over the entire vertical time column;
  - one hidden guide-line element the overlay positions per selected timepoint (no transient state baked in — it is inert in the static bytes);
- **no visible flowsheet table** in the Epic SVG.

The question caption stays external (`VisualStimulus` renders `<figcaption>`); do not put caption text inside the SVG.

### 4.4 Shared table value model

Extract the existing flowsheet's row/column **data** construction (currently inside `buildVitalsTable` in `index.ts`) into a pure `buildVitalsTableModel(spec)` returning `{ columns, rows }` (labels, `fmtNum` values, combined `SBP/DBP` cell, MAP separate, fixed row order, absent rows omitted). Consume it in three places with no divergence: (a) the `"panels"` arm's `renderDocTable` SVG flowsheet (unchanged output), (b) the Epic hidden accessible HTML table (§5.4), (c) the Epic per-timepoint readout rows. If extracting the data model would change the `"panels"` flowsheet bytes, keep the SVG path exactly as-is and have the new model produce the identical values it already produces — the `"panels"` bytes are the invariant, the refactor serves it.

---

## 5. Interaction architecture (narrowest compatible with the static registry)

### 5.1 Registry signature — optional, back-compatible

Extend the render contract to accept optional render-time options:

```
renderSvg(spec: S, options?: RenderOptions): string
type RenderOptions = { variant?: "unit_pure" | "epic" }
```

- **Omitted `options` = current behavior for every kind.** Only `vitals_trend` reads `options`. Every other module ignores the second argument, so their output is unchanged and the promoted-parity harness — which calls `mod.renderSvg(visual)` with no options (`scripts/visual-parity-baseline.ts`) — sees byte-identical results (§6).
- `vitals_trend`: `variant === "epic"` → §4 Epic SVG; otherwise (`"unit_pure"` or omitted) → today's composite, byte-identical.
- The registry-level default (no options) stays `unit_pure`. This is deliberately **not** the user-facing default; the user-facing default (`"epic"`) is applied in the application layer (§5.2). Do not conflate the two — moving the registry default to `epic` would move all 29 committed parity hashes.

### 5.2 Application wiring

Define one shared alias and use it throughout the application layer:

```
export type VitalsChartStyle = "epic" | "panels";
```

`VisualStimulus` receives the resolved style and dispatches:

- add a required prop `vitalsChartStyle: VitalsChartStyle`; the user-facing default comes only from `defaultSettings`, so TypeScript exposes every missed prop path;
- map `"panels" → "unit_pure"`, `"epic" → "epic"`;
- for `visual.kind === "vitals_trend" && style === "epic"`, render the new `VitalsTrendInteractive` component; otherwise keep the existing `InteractiveVisualStimulus`/`VisualGraphic` path unchanged;
- thread `vitalsChartStyle` from `settings.vitalsChartStyle` through `App`, `SessionView`, `SummaryView`, `DeveloperReviewConsole`, `PreviewLab`, `QuestionCard`, `RationalePanel`, `CaseStudyControl`, `CaseStudyStackedLayout`, `CaseChartPane`, `CaseExhibit`, and `CaseActivePart` to all five final rendering edges, exactly as `languageMode` is threaded today; resolve it in the same component scope that currently exposes `languageMode`.

### 5.3 `VitalsTrendInteractive` (new component)

A `vitals_trend`-scoped React surface — the only kind-specific interaction layer; no global registry redesign. Use a two-level ownership shape:

```
VitalsTrendInteractiveStimulus
  owns dialog/open/close/placeholder/focus restoration
  renders exactly one EpicVitalsGraphic
    owns hover/pin/emphasis/readout state
```

When focus opens, the ordinary graphic unmounts and the focused graphic mounts, preserving the current one-SVG invariant. The graphic must not recursively render its own dialog. The surface:

- computes `model = buildEpicModel(visual)` and renders the Epic base SVG (via `renderSvg(visual, { variant: "epic" })`) with `dangerouslySetInnerHTML`, our own deterministic SVG only;
- keeps the base SVG noninteractive and overlays transparent, absolutely positioned HTML `<button>` controls aligned from the deterministic SVG/model geometry. The SVG retains `data-vital`, `data-legend`, and `data-timepoint-index` geometry only; the HTML buttons carry accessible names, keyboard behavior, and reliable focus semantics;
- overlays interaction driven from `model`, holding all transient state in React (never mutating SVG bytes):
  - **timepoint readout:** pointer hover, keyboard focus, or touch on a `data-timepoint-index` column reveals a consolidated readout (all present vitals at that timestamp, from `model.readoutByTimepoint`) plus the guide line at that x. Hover is transient; **click/tap pins** the readout until another timepoint or an explicit clear;
  - **legend emphasis:** hover/focus on a legend entry raises that vital to full opacity and lowers all unrelated series' opacity (BP entry emphasizes both SBP and DBP); leaving restores all unless pinned by click/tap; emphasis toggles CSS classes/inline opacity on the mounted SVG elements via refs — it **never** re-renders SVG or rescales the y-axis;
  - **keyboard:** the ordinary HTML timepoint and legend buttons are focusable, have accessible names, and pin through native Enter/Space button activation;
  - **focus-mode conflict (proposal §6.2):** all legend/timepoint handlers `stopPropagation` so they do not trigger the figure's `openVisual`; the explicit **Enlarge visual** button remains the focus entry point. Inside the focus dialog, `VitalsTrendInteractiveStimulus` mounts one focused `EpicVitalsGraphic` so emphasis/readout work there too without recursive dialog ownership.

### 5.4 Route C — hidden accessible value surface

- Render a visually-hidden (`sr-only`) real HTML `<table>` sibling to the chart, built from `buildVitalsTableModel(visual)` — every source value once, `fmtNum`, combined BP cell, MAP row, absent rows omitted. It is always in the DOM for assistive technology.
- `@media print`: reveal the hidden table and hide the interactive overlay/guide line, so print shows the chart plus the full static value table. No exact value depends on pointer availability.

---

## 6. Determinism and parity boundary

### 6.1 `"panels"` arm — zero movement, no rebaseline

The promoted-parity harness renders with no options → `unit_pure` → the existing 29 `vitals_trend` identities and all other kinds must hash **byte-identical**. Expected outcome: the promoted parity verification passes with **zero drift and no rebaseline**. If it reports any `vitals_trend` (or other-kind) hash movement, the refactor leaked into the default path — stop and fix; do not rebaseline to paper over it. (`registry.ts` is in the harness's "shared renderer" set, so a genuine default-path change would be attributed to *every* kind — a strong tripwire.)

### 6.2 Epic arm — dedicated separate snapshot

The Epic variant **must not** be added to `scripts/tests/__snapshots__/visual-parity-promoted/` — that harness enforces snapshot files exactly equal to the registered kinds, so an extra `vitals_trend.epic.json` would be read as a bogus kind and break the whole baseline. Instead give the Epic variant its own deterministic coverage in a dedicated test (extend `scripts/tests/vitals-trend.ts` or add `scripts/tests/vitals-trend-epic.ts`):

- render each of the 29 promoted `vitals_trend` specs with `{ variant: "epic" }`, assert render-twice byte-identity, and pin byte-sorted parity IDs plus SVG hashes in `scripts/tests/__snapshots__/vitals-trend-epic.json`, outside `visual-parity-promoted/`;
- prove the Epic SVG is a pure function of spec (no `Date`/random/DOM/viewport input).

This keeps the 12-kind promoted-parity system entirely untouched while giving the experimental arm real determinism coverage.

---

## 7. Layout — split re-entry is variant-aware and measured

`usesStandaloneVisualSplit` (App.tsx:3208 → `examLayout.ts:31`) currently excludes `vitals_trend`. Make split eligibility depend on the resolved style:

- extend `usesStandaloneVisualSplit(question, vitalsChartStyle?)`; return `true` for `vitals_trend` **only** when `vitalsChartStyle === "epic"` and the measured split gate below passes; the `"panels"` arm stays full-width;
- thread the resolved style into the call site exactly as the `VisualStimulus` sites are threaded.

**Measured split gate (principle 23 — proof, not prediction).** At ~1280×727 and ~1280×800, the forcing item in the Epic arm must be answerable in the ordinary question view without opening focus: full legend reachable, trend shapes legible, exact values recoverable via the readout, no horizontal scroll, no clipped legend/axis/caption, no sticky-pane stranding. If it passes, make Epic split-eligible and record the measured dimensions in the allowlist comment and `scripts/tests/exam-layout.ts`. If it fails, leave `vitals_trend` full-width in both arms and record the measured result. Do not author a third layout path.

**Sizing CSS (kind- and variant-scoped; no `VisualStimulus.tsx` change unless CSS cannot satisfy focus):** ordinary Epic chart centered at a compact measured width; focus caps near a readable width with `.visual-focus-body { overflow: auto }`; mobile ~390×844 stays readable (horizontal scroll permitted only if required, never shrinking the readout/table into illegibility); preserve one-SVG mounting, Close/Escape/backdrop dismissal, body-scroll restoration, focus return, and answer state.

Preview Lab must expose a dedicated `Vitals trend — variant comparison` bucket regardless of whether the measured gate leaves Epic full-width or makes it split-eligible. Do not rely on the static split-kind or full-width lists to make `vitals_trend` selectable.

---

## 8. Settings and persistence

- `src/types.ts`: add `vitalsChartStyle: "epic" | "panels"` to `Settings`.
- `src/storage.ts`: add `vitalsChartStyle: "epic"` to `defaultSettings`. `loadSettings` already spreads over defaults, so existing users with no stored value get `"epic"`.
- Settings UI: add a control beside the existing language-mode control (App.tsx:1936 region) bound to `settings.vitalsChartStyle`, updating via the same settings-update handler the other controls use. Use bilingual text for the surrounding label and for both options, e.g. `Vitals chart style / 生命体征图表样式`, `Epic (unified) / Epic（统一图）`, and `Panels / 分面图`.
- No migration, no IndexedDB version bump (settings live in localStorage).

---

## 9. File scope

**Change**

- `src/visuals/registry.ts` — optional `RenderOptions` second param on `renderSvg`; `RenderOptions` type (here or a small `renderOptions.ts`).
- `src/visuals/kinds/vitals_trend/index.ts` — `buildEpicModel`, `buildVitalsTableModel` extraction, Epic-variant branch in `renderVitalsTrendSvg`; `"panels"` path byte-identical.
- `src/visuals/kinds/vitals_trend/VitalsTrendInteractive.tsx` — new interactive component.
- `src/visuals/VisualStimulus.tsx` — accept `vitalsChartStyle`, dispatch to `VitalsTrendInteractive` for `vitals_trend + epic`, thread variant into `renderSvg`.
- `src/App.tsx` — resolve `settings.vitalsChartStyle`; pass to the five `VisualStimulus` sites and to `usesStandaloneVisualSplit`; add the Settings control.
- `src/examLayout.ts` and `scripts/tests/exam-layout.ts` — variant-aware split predicate + measured result.
- `src/types.ts`, `src/storage.ts` — `Settings.vitalsChartStyle` + default.
- `src/styles.css` — Epic chart, readout, guide line, emphasis, `sr-only` table, `@media print` reveal, ordinary/focus/mobile/split sizing.
- `scripts/tests/vitals-trend.ts` (+ optional `vitals-trend-epic.ts`) — regressions and the Epic deterministic snapshot.
- `NCLEX-Question-Schema.md`, `PROJECT-HISTORY.md` — after implementation, per §10.

**Must not change**

- `src/visuals/primitives/**` (no new `lineChart`/`table` params; their default bytes are invariant), `src/visuals/kinds/lab_trend/**`, every other visual kind, `src/visuals/kinds/vitals_trend/defs.ts`.
- `banks/**`, `src/schema.ts`, the `VitalsTrendSpec` shape, clinical ranges, sanity bounds, MAP/`expected_trend` logic, grading, answer keys.
- `scripts/tests/__snapshots__/visual-parity-promoted/**` (no additions/edits; the `"panels"` arm produces zero drift by construction).
- `CLAUDE.md`, `DECISIONS.md` (implementation seat writes neither).
- `BANK-REVIEW-LEDGER.md`.

---

## 10. Governance and documentation

### 10.1 `DECISIONS.md` — architect/Luke only, not the implementation seat

The implementation seat does **not** edit `DECISIONS.md`. Principle 25's "Application — composite trend artifacts" clause (unit-pure panels, panel-exclusive bands, renderer-derived flowsheet) **stays as written** — this feature adds an experimental alternative behind a toggle; it does not reverse the clause. If the A/B outcome favors Epic and Luke decides to make it the sole model, that is a **separate** principle-27 amendment, minted with the A/B result as the forcing evidence — not part of this PR.

Proposed `DECISIONS.md` note for Luke to ratify in his own wording (recorded so the loosening is on the record, not silent) — append under principle 25's composite-trend application:

> **Experiment (2026-07-19) — Epic-style unified `vitals_trend` arm.** A second render style (single 0-based unitless axis, interactive timestamp readout, legend emphasis, no visible flowsheet, hidden accessible value table) ships behind the persisted `vitalsChartStyle` setting, defaulting to `epic`, beside the unit-pure composite (`panels`). The composite invariant above is intentionally not applied to the `epic` arm while the experiment runs; the arm is an A/B probe whose adjudicator is the real user's experience, not source argument. The `panels` output is byte-identical to the 2026-07-18 composite and remains the parity baseline. If the user prefers `epic`, a principle-27 amendment (this experiment as the forcing incident) may then generalize it; if not, the arm is removed with nothing to unwind.

### 10.2 `NCLEX-Question-Schema.md`

After code lands, append one concise paragraph to the `vitals_trend` subsection describing the two render styles as *renderer output selected by a user setting*, not a new authoring shape; the spec shape is unchanged. Do not restate field definitions owned by code/schema.

### 10.3 `PROJECT-HISTORY.md`

Record what landed: the Epic arm, the toggle + default, the measured split-gate disposition, focus/mobile behavior, the zero-movement `"panels"` parity result, the dedicated Epic snapshot, and the A/B-experiment status. Re-read immediately before editing and preserve intervening work. Run a plain `grep` of final governance/schema text before commit to guard connector-path corruption.

---

## 11. Tests and proof

### 11.1 Deterministic regressions

- **`"panels"` byte-identity:** the existing `vitals-trend.ts` composite assertions remain green unchanged; add an explicit assertion that `renderSvg(spec)` and `renderSvg(spec, { variant: "unit_pure" })` are byte-identical to the committed composite for the forcing, densest, `{hr,temp}`, and pediatric fixtures.
- **Promoted parity:** the full visual suite passes with **zero** `vitals_trend` hash movement and no rebaseline (§6.1).
- **Epic determinism:** render-twice byte-identity for every fixture; dedicated Epic snapshot committed outside `visual-parity-promoted/` (§6.2).
- **Epic model:** ceiling bucket selection for boundary fixtures (maxValue at 114→120, 120→140, 138→160, 190→200, 200→250, and a synthetic near-300 clamped to 300); ceiling stable across simulated emphasis/pin state; no reference band on any multi-series Epic chart; one-series Epic chart keeps fitted scale + adult band; BP legend entry covers both pressure series while MAP is separate; DBP dashed `6 4`, SBP solid.
- **Readout + hidden table completeness:** every present source value appears once in `readoutByTimepoint` and once in the hidden table; combined BP equals source `SBP/DBP`; MAP separate; absent vitals omitted; all via `fmtNum`; no recomputation/conversion.
- **Interaction state tests:** extract pure state-transition functions and prove emphasis raises the targeted vital and lowers others without rescaling y; BP emphasis covers SBP+DBP; activation pins/toggles/clears; hover/focus transitions preserve pins. Do not add a DOM test dependency for this experiment.
- **Accessibility:** hidden table is a real navigable `<table>`; print CSS reveals it and hides the overlay; focusable targets have accessible names; bilingual labels present.
- **Browser proof:** use the running application to prove actual pointer hover, click/tap pinning, keyboard focus plus Enter/Space, focus-dialog interaction and restoration, touch emulation, `stopPropagation`, hidden-table accessibility structure, and the one-SVG invariant.

### 11.2 Exam-layout regression

Variant-aware `usesStandaloneVisualSplit`: `vitals_trend + epic` matches the measured gate result; `vitals_trend + panels` stays full-width; no other allowlisted kind changes.

### 11.3 Proof-render matrix (capture and inspect)

- `vit_gpt_2026_07_02_t01_001` (Epic) at ~1280×727 and ~1280×800, ordinary and focus;
- `vit_gpt_2026_07_02_t01_004` full seven-series/minute-unit (Epic);
- `ex_trend_1200` staged `{hr,temp}` (Epic);
- the sole `peds_child` record (Epic);
- a **synthetic Fahrenheit** temperature record (Epic) — confirm coherent temp positioning, no misleading cross-unit artifact;
- mobile ~390×844 ordinary and focus.

**A/B-decisiveness acceptance (this is what makes Luke's test conclusive, not prettier):** on the forcing item specifically confirm whether the **RR-up** read and a **temperature** read are recoverable — visually and via the readout — in °C and in print. Record it plainly; this is the exact place the Epic model is most likely to help or hurt, and the A/B verdict should turn on it. Also confirm: every series identifiable without color alone; no clipped legend/axis/caption; desktop no horizontal scroll; split gate resolved from evidence; focus interaction and one-SVG invariant preserved; no console warning/error introduced; and the `"panels"` arm renders exactly as before when toggled.

### 11.4 Full verification (from the isolated clean branch)

```bash
npm run test-visuals        # includes promoted-parity verification: expect zero vitals_trend movement, no rebaseline
npm run test:exam-layout
npm run validate-bank -- banks/*.json
npx tsc -b --pretty false
npm run build
```

Run the `vitals_trend` test directly during iteration as needed.

---

## 12. Non-goals and invariants

This spec does **not** authorize: schema-version or `VitalsTrendSpec` changes; any new authored display flag (the variant is a *user setting*, never a per-record author field); bank edits, migration, or answer-key changes; altered vital validation envelopes or the open sanity-bound work; changed MAP recomputation or `expected_trend` semantics; unit conversion; a charting-library migration; viewport-dependent renderer bytes; loss of deterministic source-to-visual correspondence; pointer-only interaction; any change to the `"panels"` output bytes; any change to shared primitives' default output; a global visual-registry redesign. Chart, legend, readout, hidden table, and print surface all derive from the same existing typed source arrays.

---

## 13. Deliverable

A focused PR that:

1. implements §§3–8;
2. adds the §11 regressions, the dedicated Epic snapshot, and the proof-render matrix, and resolves the measured split gate;
3. keeps the `"panels"` arm byte-identical (zero promoted-parity movement, no rebaseline) and leaves shared primitives, banks, schema shapes, clinical logic, and all non-`vitals_trend` renderer bytes untouched;
4. updates `NCLEX-Question-Schema.md` and `PROJECT-HISTORY.md` as authorized, and includes — but does not write — the §10.1 `DECISIONS.md` note for Luke;
5. runs the full verification;
6. reports any genuine live-source contradiction instead of inventing a new product decision.

The desired outcome is the smallest, honest Epic-style renderer that lets the real user rapidly read multi-vital trajectory, isolate one trend, and recover exact values without scrolling — placed beside the preserved composite so the user's own experience can decide which stays.
