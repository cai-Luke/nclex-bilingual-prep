# Case-Study Part-Selector Footer + Option Marker — Codex Spec (rev 2)

Presentation-only pass. Two independent fixes surfaced during dogfooding on a 14" MBP (Chrome), reproduced from `src/App.tsx` + `src/styles.css` at current HEAD. Desktop-first; **mobile is explicitly out of scope this pass.** Rev 2 incorporates GPT pre-implementation review (all five points accepted; adjudication in session log).

## Non-goals / invariants (do not touch)

- No changes to grading, scoring, storage, schema, sampler, bank content, or `getVisibleCaseStages` / stage-visibility logic.
- No change to submit *gating* (`readyToSubmit`, `showTopLevelSubmit`, `getAnswerCompleteness`) — only where the submit control is *rendered*.
- Leave the mobile stacked layout and the existing `@media (max-width: 780px)` / `(max-width: 820px)` session-footer behavior alone. All new desktop-only rules are gated `@media (min-width: 821px)`; do not edit inside the existing mobile blocks.
- Keep the `file://` build path intact; plain CSS only (no Tailwind).

---

## Fix A — Option marker leaks internal ids

**Bug.** The choice list prints the raw option slug (`opt_bun`, `opt_serum_potassium`, …) into a fixed 2rem grid cell; it overflows and overlaps the choice text. Same leak post-submit in the per-choice rationale.

**Decision.** Replace the raw id with a display **letter by option index** (A, B, C, …), used in the option list, the per-choice rationale, and the option `SpeakButton` aria-labels so all three stay mapped. **Invariant (scoped):** for option-based surfaces (MC/SATA option rows, their SpeakButton labels, and per-choice rationales whose `refId` maps to a top-level option), never render a raw option id — visually or via accessible name. Where a `byChoice.refId` does *not* map to a top-level option (matrix rows, dropdown ids, blank ids, etc.), preserve the existing raw-`refId` fallback for this presentation-only pass; a broader rationale-label taxonomy is out of scope. (`question.options` display order is already the deterministic promoted order, so index-lettering is stable and identical across surfaces.)

### A1. Add a marker helper

Near the other small render helpers (top of the component module, e.g. beside `formatItemType` usage), add:

```ts
function optionMarker(index: number): string {
  // A, B, C … Z, then fall back to a number for the (never-in-practice) 27th+ option.
  return index < 26 ? String.fromCharCode(65 + index) : String(index + 1);
}
```

### A2. Option list (currently `src/App.tsx` ~3705–3740)

Add the index to the map and render the letter instead of the id.

`oldText`:
```
      {question.options.map((option) => {
        const selected = selectedIds.includes(option.id);
```
`newText`:
```
      {question.options.map((option, optionIndex) => {
        const selected = selectedIds.includes(option.id);
```

`oldText`:
```
            <span className="option-id">{option.id}</span>
```
`newText`:
```
            <span className="option-id">{optionMarker(optionIndex)}</span>
```

### A3. SpeakButton aria-label (same block) — **required, not optional**

The aria-label is learner-facing for screen-reader users; it must not leak the slug either.

`oldText`:
```
              <SpeakButton text={option.en} enabled={voiceEnabled} label={`Read option ${option.id}`} />
```
`newText`:
```
              <SpeakButton text={option.en} enabled={voiceEnabled} label={`Read option ${optionMarker(optionIndex)}`} />
```

There are **two** occurrences of the `Read option ${option.id}` label in this component (the `ordered_response` branch ~3681 and the MC/SATA branch ~3738). Letter both; the ordered branch maps over `question.options` with an index already available (add one if not).

### A4. Per-choice rationale (currently `src/App.tsx` ~4655–4665)

Map each `choice.refId` back to its option index; letter it when it resolves, otherwise fall back to the raw `refId` (preserves current behavior for non-option refIds).

Immediately before `<div className="choice-rationales">`, build a lookup:

```ts
const optionIndexById = new Map<string, number>(
  ("options" in question ? question.options : []).map((option, index) => [option.id, index] as const),
);
```

Then:

`oldText`:
```
                <strong>{choice.refId}</strong>
```
`newText`:
```
                <strong>{optionIndexById.has(choice.refId) ? optionMarker(optionIndexById.get(choice.refId)!) : choice.refId}</strong>
```

**Alternative Luke may pick instead of lettering:** delete the `.option-id` span entirely and drop the `2rem` marker track from `.option-row` (`grid-template-columns: 1.5rem minmax(0, 1fr) auto`, and the mobile variant `1.25rem minmax(0, 1fr) auto`), and drop the `<strong>` in the rationale. Implement lettering by default; only do this if Luke says "just hide it."

---

## Fix B — Move the part selector to a sticky bottom footer (desktop)

**Bug.** In the live split case layout the navigator renders at the **top** of the work pane, between the client chart and the question, as a tall multi-row block (Prev/Next + counter, "N of M complete", wrapping chip grid). It pushes the question below the fold and makes it impossible to see the chart and the question together. (It also currently renders with its content jammed into the right ~40% and a dead left half — not reproducible from on-disk CSS, so treat the rendered result, not the file, as ground truth and verify in-browser.)

**Target (outcome-based).** Relocate the navigator **and** the "Submit all parts" control out of the top of the work pane into a **sticky bottom bar** that pins to the viewport bottom while the case card is on screen. Required outcome: **compact (single visual row at typical desktop widths, wrapping allowed when tight), horizontal, full case-study content width, bottom-sticky**, with Submit at the far right. The exact inline ordering may preserve the existing `CasePartNavigator` control grouping (e.g. `‹ Previous · Part 1 of 4 · Next ›` as one group, then the chip run, then the complete-count, then Submit); do **not** split the component's markup just to interleave chips between Previous and Next.

With the block gone from the middle, the chart pane and the active question sit together.

### B1. JSX — move the toolbar below the parts (`src/App.tsx` ~4085–4130)

In the split branch of the case renderer, the current order inside `<div className="exam-split-work-pane" ref={workPaneRef}>` is: `case-work-toolbar` → mapped `CaseActivePart`s. Reorder so the toolbar comes **after** the parts, and add a `case-work-footer` modifier class.

- Move the entire `<div className="case-work-toolbar"> … </div>` block (the `CasePartNavigator` + the `showTopLevelSubmit && …` submit button) to render **after** the `{caseQuestions.map(…)}` block.
- Change its class to `className="case-work-toolbar case-work-footer"`.
- Everything it references (`readyToSubmit`, `showTopLevelSubmit`, `onSubmit`, `selectActivePart`, `activeQuestion`, `caseAnswers`, `submitted`) is in the same function scope, so the move is pure reordering — no prop threading.
- Leave the `CaseStudyStackedLayout` (mobile/stacked) branch untouched.

**Full-width note + fallback.** In the live case card, `.split-case-card .exam-split-layout` overrides the split grid to a single-column chart-over-work layout, so `.exam-split-work-pane` — and therefore the footer — should already span the full case-study content width. However, the rendered right-cluster in the dogfooding screenshots is not explained by on-disk CSS, so after implementing verify in-browser that `.case-work-footer` spans the full split case content width. If it renders constrained (right column / partial width), relocate the toolbar one level up as a sibling after the split layout inside the `split-case-card` article, or give it `grid-column: 1 / -1` if it remains inside a multi-column grid. **The acceptance criterion is the source of truth: the footer must use the full case-study content width.**

### B2. CSS — footer bar (`src/styles.css`)

Current `.case-work-toolbar` is a top-sticky stack (`position: sticky; top: 5.25rem; display: grid; …`). Add a footer modifier and make the navigator horizontal **only in the footer, only at desktop widths**. Prefer flex for the bar so it is robust to whatever grid-track behavior produced the current right-cluster. **All of the following goes inside a `@media (min-width: 821px)` block:**

```css
@media (min-width: 821px) {
  .case-work-footer {
    position: sticky;
    top: auto;
    bottom: 0;
    z-index: 3;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.6rem 0.85rem;
    margin-top: 0.85rem;
    padding: 0.6rem 0.85rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--sticky-bg);
    backdrop-filter: blur(10px);
    box-shadow: 0 -10px 28px rgba(40, 55, 70, 0.14);
  }

  /* Navigator becomes a single horizontal row inside the footer. */
  .case-work-footer .case-part-nav {
    display: flex;
    flex: 1 1 auto;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 0.75rem;
    min-width: 0;
    border: 0;
    border-radius: 0;
    padding: 0;
    background: transparent;
  }

  .case-work-footer .case-part-nav-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* "N of M parts complete" reads as an inline label, not its own row. */
  .case-work-footer .case-part-nav-summary {
    white-space: nowrap;
  }

  /* Chips: one compact horizontal run, no tall wrapping grid. */
  .case-work-footer .case-part-chip-list {
    display: flex;
    flex: 1 1 auto;
    flex-wrap: wrap;
    gap: 0.4rem;
    min-width: 0;
  }

  .case-work-footer .case-part-chip {
    min-height: 2.4rem;
    padding: 0.3rem 0.6rem;
  }

  /* Submit sits at the far right of the bar rather than full-bleed. */
  .case-work-footer .case-submit-button {
    justify-self: auto;
    margin-left: auto;
    flex: 0 0 auto;
  }

  /* The pinned footer overlays scrolling content; clear the last rows. */
  .split-case-card .exam-split-work-pane {
    padding-bottom: 4.5rem; /* ≈ footer height + margin; tune to actual rendered height */
  }
}
```

And the explicit mobile safety override (outside the desktop block):

```css
@media (max-width: 820px) {
  .case-work-footer {
    position: static;
    box-shadow: none;
  }
}
```

- Keep the submit button's disabled/`title` behavior; only its position changes.
- Scroll behavior: the part-switch effect still scrolls the work pane to top on part change (fine — desirable). Leave the `.exam-split-work-pane { scroll-margin-top: 5.25rem; }` rule and the `previousActivePartId` / `workPane.scrollIntoView` effect logic **unchanged**; only reduce `scroll-margin-top` if browser smoke shows an obvious over-scroll now that no top toolbar exists.

### B3. Desktop scoping — enforced, not assumed

The `(min-width: 821px)` wrapper plus the `(max-width: 820px)` static override above make "mobile untouched" enforceable. At ≤820px the element falls back to the existing base `.case-work-toolbar` styles plus the static override; the mobile stacked layout (which has no navigator) is unaffected. Confirm in smoke that nothing at ≤820px renders a broken sticky bar.

---

## Verification

- `npx tsc -b --pretty false` — clean.
- `npm run build` — green (existing Vite chunk-size warning is expected).
- Browser smoke (desktop ~1280×800 and a narrower ~1000px desktop width):
  - A live split case study shows the client chart and the active question stem in the viewport together; the part selector is a bottom bar, not a block in the middle.
  - The selector bar spans the full case-study content width (no dead left half / right-cluster). If not, apply the B1 fallback and re-verify.
  - Bar is compact and horizontal; Prev/Next/counter, chip run, complete-count, and Submit all on the bar; Submit stays disabled until all parts complete and enables correctly.
  - Switching parts via chips and Prev/Next scrolls the question into view and does not hide the last rows behind the footer.
  - Option rows show A/B/C/D markers (no `opt_*` text, no overlap); post-submit "Per choice" rationale shows the same letters; VoiceOver/accessibility-tree spot check confirms option SpeakButtons announce "Read option A/B/…" with no slug.
  - At ≤820px nothing is visually broken (bar goes static; stacked layout unchanged).
- No `banks/*` changes; `npm run validate-bank` not required for this pass.

## Decisions (settled — Claude + GPT concur)

1. Option marker: **letters** (hide-entirely alternative retained above only as a Luke override).
2. Submit control: **in the footer**.
3. Chart cap: **stays `max-height: 40vh`** this pass; judge again after the navigator block is out of the middle.
