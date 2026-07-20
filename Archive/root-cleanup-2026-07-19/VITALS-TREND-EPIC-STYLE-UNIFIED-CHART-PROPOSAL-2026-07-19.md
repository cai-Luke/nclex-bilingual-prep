# Vitals Trend — Epic-Style Unified Interactive Chart Proposal

**Date:** 2026-07-19  
**Status:** Product proposal for one architect litigation pass; not an implementation spec  
**Architecture owner:** Luke  
**Requested next seat:** Claude Architect — challenge the premise, resolve the open decisions, and return a formal Codex plan if the direction survives  
**Scope:** `vitals_trend` presentation only; no bank, schema, grading, clinical-range, or answer-key change is proposed here

## 1. Why revisit the just-landed composite

The current `vitals_trend` repair solved real defects: clipped legends, indistinguishable SBP/DBP lines, mixed-unit axes, overlapping reference bands, and lack of an exact-value surface. It did so by splitting the visual into unit-pure panels and adding a renderer-derived flowsheet table.

That implementation is correct and readable, but it is also tall: the forcing composite is approximately 600×1108 and the seven-series shape approximately 600×1132. The kind consequently left the standalone split layout and now occupies a large full-width block above the question.

A subsequent comparison to Epic's real vitals-trend presentation suggests a simpler product model may outperform the unit-pure composite for this use case:

- one compact chart contains every vital-sign trend;
- one shared numeric y-axis is used without a unit title;
- exact value and unit are recovered interactively at a timepoint;
- hovering a legend item emphasizes that vital and suppresses the others;
- blood pressure is treated as one conceptual legend item that emphasizes both systolic and diastolic lines.

Epic accepts the known limitation that small temperature changes are difficult to see on the shared scale. That limitation may be preferable to permanently dedicating an entire panel and large vertical surface to temperature.

This proposal asks whether Project Shrimp should intentionally adopt that compact interaction model rather than continue optimizing the three-panel-plus-table composite.

## 2. Product intent proposed for ratification

### 2.1 One unified plotting surface

Render every present `vitals_trend` series in one chart with one common x-axis and one common numeric y-axis.

- No split hemodynamic, respiratory/oxygenation, or temperature panels.
- No left/right unit-family axes.
- No y-axis unit title.
- The y-axis communicates raw numeric position only; the legend and interactive readout carry vital identity and units.
- Timepoints remain aligned exactly because there is only one plot.

This is not a claim that unlike units are mathematically comparable. It is an intentional clinical-overview presentation optimized for the questions the artifact is meant to answer: what changed, when it changed, and which measurements moved together.

### 2.2 Exact timestamp readout

Pointer hover, keyboard focus, or touch selection of a timepoint should reveal one consolidated readout for that vertical time column.

Example:

```text
2 hr
BP 114/72 mmHg
HR 110 bpm
MAP 86 mmHg
RR 24/min
SpO₂ 94%
Temperature 39.1 °C
```

Requirements:

- The entire vertical time column should be targetable; the learner should not need to hit a small circle precisely.
- A visible guide line should identify the selected timepoint.
- The readout should include every present vital at that timestamp, not merely the nearest series.
- BP should display as `SBP/DBP mmHg` when both are present; individually present pressure series remain separately named.
- Values must come directly from the same `VitalsTrendSpec` source arrays with existing `fmtNum` behavior. No recomputation, unit conversion, or second authored payload.
- Hover may be transient; click/tap should pin the readout until another timepoint or a clear action is selected.

### 2.3 Legend-driven series emphasis

The legend should be interactive rather than merely descriptive.

- Hover or keyboard focus on an ordinary vital keeps that trend fully prominent and suppresses the opacity of all unrelated trends.
- Hover or focus on `Blood pressure` emphasizes both SBP and DBP together.
- The SBP/DBP solid-versus-dashed distinction should remain so the pair is still legible in monochrome.
- Moving pointer/focus away restores the complete overview unless the learner pinned the selection by click/tap.
- Click/tap should pin one legend emphasis on touch devices; selecting it again or using a clear action restores all series.
- Legend emphasis must never recompute or animate the y-scale. Only opacity/emphasis changes; geometry remains fixed.

The conceptual legend vocabulary should probably be:

1. Heart rate
2. Blood pressure — grouped SBP + DBP
3. MAP, when present
4. Respiratory rate
5. SpO₂
6. Temperature

Claude should adjudicate whether MAP belongs beside or inside the blood-pressure group. The current proposal prefers a separate MAP entry because it is an independently plotted and potentially independently tested series.

### 2.4 Compactness is a first-order objective

The target should return `vitals_trend` to roughly one conventional chart-height visual rather than a thousand-unit vertical document. Exact dimensions belong to measured proof, but the intended result is close to the original compact trend footprint while retaining the repaired legend and BP distinction.

If the compact renderer passes ordinary-view proof at the measured standalone split width, `vitals_trend` may be reconsidered for the split allowlist. Re-entry is not automatic: principle 23 still requires a measured proof render rather than an assumption based on nominal dimensions.

## 3. Y-axis proposal: zero-based with a deterministic adaptive ceiling

A permanently fixed 0–200 scale is simple, stable, and similar to the observed Epic presentation, but it can waste vertical range for a patient whose maximum value is near 120–130. Luke is open to an adaptive upper bound—for example, a normotensive record could top out at 140.

Proposed invariant:

- Lower bound remains fixed at `0`.
- One upper bound is selected from the complete visual before rendering.
- The bound remains stable during all hover, focus, tap, and legend-suppression states.
- Every present raw value, including both BP components, participates in selection.
- The highest point receives visible headroom and never touches the plot ceiling.
- The result uses a small approved set of clinically legible round bounds, not an arbitrary maximum such as 137 or 173.

Candidate—not yet ratified—bucket set:

```text
120, 140, 160, 180, 200, 240, 300
```

Candidate selection rule:

> Add a modest deterministic headroom allowance to the highest raw plotted value, then choose the smallest approved bucket that contains it.

The architect should challenge and formalize:

- the minimum permitted ceiling (`120` versus `140`);
- the headroom rule (fixed units versus percentage);
- whether `240` is useful or `250` better matches existing MAP authoring limits;
- handling of a valid value at or near the current 300 renderer ceiling;
- whether a one-series temperature/RR visual should use the same universal buckets or retain a kind-local narrow exception.

The proposal favors one rule for all multi-vital records and does not currently seek a temperature-specific secondary axis. The loss of temperature resolution is acknowledged rather than hidden.

## 4. Temperature: accepted limitation, not a surprise defect

A shared raw scale makes clinically meaningful temperature movement visually subtle, especially in Celsius. Epic has the same limitation.

The proposed mitigation is interaction, not another axis:

- exact temperature and unit in the timestamp readout;
- legend emphasis to suppress other lines;
- retained point markers;
- optional persistent point labels only if proof shows the readout is insufficient.

A question whose keyed task is specifically to quantify a small temperature change may not be a good fit for this universal overview renderer unless the exact interactive readout is available and clearly discoverable. If real content review finds that such items exist, resolve them as a content-fit or dedicated-presentation question rather than reintroducing a permanent temperature panel by default.

The renderer currently supports both Celsius and Fahrenheit even though the prior live inventory contained no Fahrenheit record. The shared raw scale therefore places equivalent temperatures at different y positions depending on source unit. That is an explicit consequence of the Epic-style model and must be accepted, rejected, or mitigated on the record by the architect rather than overlooked.

## 5. What happens to the flowsheet table

The consolidated timepoint readout duplicates the exact-value affordance for which the visible flowsheet table was added. The compact proposal therefore leans toward removing the permanently visible table.

However, hover-only exact values would be inaccessible or incomplete for keyboard, touch, screen-reader, print, and no-pointer contexts. Claude should choose one of these routes:

### Route A — interactive readout replaces the visible table

- Keyboard-focusable timepoint targets expose the same consolidated values.
- Touch pinning is fully supported.
- Screen-reader semantics expose a structured textual equivalent.
- Print receives either an expanded static value table or an explicit print fallback.
- No visible flowsheet remains in ordinary use.

### Route B — compact chart plus collapsible values table

- Ordinary first frame remains compact.
- A `Show values` control reveals the current renderer-derived table on demand.
- Print may force the table open.
- This is easier to make accessible but introduces another learner control and preserves some vertical expansion.

### Route C — compact chart plus visually hidden semantic table

- A structured HTML or SVG-accessible equivalent exists for assistive technology but is not displayed.
- Pointer/touch users rely on the interactive readout.
- This avoids ordinary visual bulk but requires careful proof that the hidden structure is actually navigable and not duplicate noise.

The proposal does not ratify a route. It does reject a pointer-hover-only implementation with no keyboard/touch/accessibility equivalent.

## 6. Current architecture conflicts the formal plan must resolve

### 6.1 The visual registry is static-SVG-only

`VisualKindModule.renderSvg` currently returns a pure deterministic SVG string. `VisualStimulus` inserts it with `dangerouslySetInnerHTML`; there is no kind-specific React interaction surface.

Legend fading alone could potentially be encoded through SVG classes/data attributes and CSS, but pinned touch state and a consolidated timestamp readout likely require runtime state and event handling.

Claude should choose the narrowest architecture that preserves the registry's deterministic static-render contract for every other kind. Candidate directions include:

- a `vitals_trend`-specific interactive wrapper around deterministic SVG markup;
- an optional registry interaction/render-component capability with a static SVG fallback;
- delegated event handling in `VisualStimulus` keyed only to `data-kind="vitals_trend"` and deterministic data attributes;
- a separate pure layout/model builder consumed by both static parity SVG and the interactive React surface.

A global redesign of every visual renderer is not justified by this proposal.

### 6.2 Figure-wide click currently opens focus mode

`VisualGraphic` assigns the figure's click to `openVisual`. Any legend or timepoint tap would therefore open the focus dialog unless propagation or activation ownership changes.

The formal plan must define the interaction hierarchy. The preferred product behavior is:

- legend and timepoint interactions do not open focus mode;
- the explicit `Enlarge visual` button remains available;
- clicking non-interactive chart background may either open focus or do nothing, but it must not interfere with timepoint selection;
- ordinary and focus presentations preserve the same emphasis/readout behavior where feasible.

### 6.3 Deterministic parity still matters

The static base rendering must remain deterministic from `VitalsTrendSpec`. Runtime hover/pin state should not alter the committed parity bytes or require viewport-dependent SVG generation.

The formal plan should state what parity hashes:

- the neutral base SVG;
- any deterministic interaction affordance markup/data attributes;
- but not transient hover or pinned runtime state.

A scoped `vitals_trend` parity rebaseline will again be required if renderer bytes change. Bank identities must not change.

## 7. Reference bands

The current composite shows adult reference bands only in one-series panels; all known promoted records previously inventoried contained at least two series, so the dense live population generally shows none.

On a unified shared-unitless chart, simultaneous reference bands for unlike vitals would be misleading and visually noisy. Proposed rule:

- multi-series unified chart: no reference bands;
- one-series chart: current adult/flag behavior may remain, because the y-axis then has only one vital identity even if no unit title is shown;
- pediatric suppression and explicit-true validation remain unchanged.

Claude should verify whether preserving one-series bands creates any interaction or axis-label contradiction. No new clinical ranges are authorized.

## 8. Non-goals and invariants

This proposal does **not** authorize:

- schema-version or `VitalsTrendSpec` changes;
- new authored display flags;
- bank edits, migration, answer-key changes, or content repair;
- altered vital validation envelopes or the open sanity-bound work;
- changed MAP recomputation or `expected_trend` semantics;
- unit conversion;
- a general charting-library migration;
- viewport-dependent renderer bytes;
- loss of deterministic source-to-visual correspondence;
- pointer-only interaction with no keyboard/touch equivalent.

The chart, legend, readout, and any fallback value surface must all derive from the same existing typed source arrays.

## 9. Questions for the architect's litigation pass

Claude should explicitly answer these before writing the Codex implementation spec:

1. Does the one-axis Epic model produce a clinically acceptable overview despite unlike units sharing numeric space?
2. Is accepting poor temperature geometry a reasonable trade for compactness, or does the current item population contain temperature-dependent constructs that make it unsafe?
3. Should the visible flowsheet be removed, collapsed, or retained in some contexts?
4. What is the narrowest interaction architecture compatible with the static deterministic visual registry?
5. How should keyboard, touch, screen-reader, print, ordinary, focus, Summary, Developer Review, and Preview Lab surfaces behave?
6. What exact adaptive-ceiling algorithm should be ratified, and what synthetic boundary fixtures prove it?
7. Should blood pressure be one legend entry for SBP/DBP while MAP stays separate?
8. Should `vitals_trend` re-enter the standalone split allowlist if the measured compact proof passes?
9. Does the figure-wide focus activation need a kind-specific exception, or should the shared focus interaction be revised more generally?
10. Which current principle-25 composite wording becomes stale if the visible table and panel architecture are retired, and should the new architecture amend that application or record it as superseded?

## 10. Requested architect deliverable

Return one of:

### A. Reject

Explain which product or architecture constraint defeats the proposal and why the current unit-pure composite should remain.

### B. Accept with amendments

Record the final product decisions, especially scale, table/accessibility disposition, interaction architecture, focus-mode conflict, and governance treatment; then produce a closed-world Codex implementation spec with measured proof and exact parity scope.

### C. Prototype-first hold

If the central readability trade cannot be decided from source inspection, commission a bounded proof prototype using the forcing six-series item, full seven-series item, `{hr,temp}` staged exhibit, pediatric record, Celsius and synthetic Fahrenheit temperature, keyboard, touch, and 1280×727 / 390×844 surfaces. The prototype must not mutate banks or be treated as the implementation.

The desired outcome is not fidelity to Epic for its own sake. It is the smallest renderer that lets the learner rapidly recognize multi-vital trajectory, isolate one trend when needed, and recover exact values without scrolling through a thousand-unit visual.
