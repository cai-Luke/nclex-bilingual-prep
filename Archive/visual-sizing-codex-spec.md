# Visual Sizing — Natural-Size Caps for Data-Dense Visual Stimuli (Codex spec, 2026-06-23)

## Problem

Data-dense visual stimuli (MAR, I&O flowsheet, device screen, medication label, burn map, vitals/lab trend) render far larger than their design size, so the full fact pattern no longer fits in one viewport. The learner reads the visual, scrolls down to the stem and options, then scrolls back up to re-check the parameters. On a phone the same rule forces a horizontal scrollbar on visuals that are intrinsically narrow.

## Root cause

Every visual renders through one rule in `src/styles.css`:

```css
.rhythm-strip-svg svg {
  display: block;
  width: 100%;
  min-width: 36rem;   /* 576px floor on EVERY kind */
  height: auto;
}
```

The renderers emit each root `<svg>` with a `viewBox` but **no intrinsic pixel `width`/`height`** (verified across all kinds — e.g. `device_screen`/`medication_label` emit `viewBox="0 0 360 H"`, `mar`/`io_record` `"0 0 600 H"`, `burn_map`/`injection_site` `"0 0 480 360"`, `vitals_trend`/`lab_trend` `"0 0 600 300"`). With no intrinsic width, `width: 100%` stretches each SVG to the full question-card column (~1050px on desktop) and `height: auto` scales the height to match the viewBox aspect ratio. For the compact kinds that is a 1.5×–3× upscale — a 360-wide device screen blown up to ~1050px is ~3× tall — so the visual alone can exceed a viewport. The blanket `min-width: 36rem` additionally forces even a 360-wide panel past phone width, triggering the horizontal scrollbar.

The calibrated ECG/CO₂ tracings (`rhythm_strip` ~990px for a 6 s strip, `capnography`) are *not* the problem — they legitimately need width, their grid is mm-calibrated, and they carry few parameters. They must keep their current behavior.

## Fix (CSS + one-line dispatcher edit; no renderer changes)

Render each non-tracing visual at roughly its **design width**, capped to the column, centered, never upscaled, with no forced `min-width`. Leave the tracings exactly as they are.

This is contained to two files. **No renderer is touched, so the SVG output is byte-identical and the parity snapshots in `scripts/tests/__snapshots__/visual-parity.json` stay valid** — `npm run test-visuals` is unaffected.

### Change 1 — tag the wrapper with the visual kind

`src/visuals/VisualStimulus.tsx`. The dispatcher already has `visual.kind` (a controlled union string). Add it as a class on the existing inner div:

```diff
-      <div className="rhythm-strip-svg" dangerouslySetInnerHTML={{ __html: svg }} />
+      <div className={`rhythm-strip-svg vis-${visual.kind}`} dangerouslySetInnerHTML={{ __html: svg }} />
```

No other TSX change. (Rationale explanation visuals also render through this dispatcher, so they inherit the same caps — desired.)

### Change 2 — per-kind size rules

`src/styles.css`. Keep the existing `.rhythm-strip-svg` and `.rhythm-strip-svg svg` base rules **unchanged** (they remain the tracing behavior: `width:100%; min-width:36rem; height:auto;` inside an `overflow-x:auto` wrapper). Append an override block for the non-tracing kinds:

```css
/* Data-dense visuals render at their design size, capped to the reading
   column and centered — never upscaled, and no forced min-width that would
   trigger a horizontal scrollbar on narrow screens. Tracings (rhythm_strip,
   capnography, fetal_monitoring) are intentionally excluded: they keep the
   base rule's min-width + horizontal scroll so the mm-calibrated time axis
   stays legible. */
.rhythm-strip-svg.vis-device_screen,
.rhythm-strip-svg.vis-medication_label,
.rhythm-strip-svg.vis-mar,
.rhythm-strip-svg.vis-io_record,
.rhythm-strip-svg.vis-burn_map,
.rhythm-strip-svg.vis-injection_site,
.rhythm-strip-svg.vis-vitals_trend,
.rhythm-strip-svg.vis-lab_trend {
  overflow-x: visible;
}

.rhythm-strip-svg.vis-device_screen svg,
.rhythm-strip-svg.vis-medication_label svg {
  min-width: 0;
  max-width: 22.5rem;   /* viewBox width 360px */
  margin-inline: auto;
}

.rhythm-strip-svg.vis-burn_map svg,
.rhythm-strip-svg.vis-injection_site svg {
  min-width: 0;
  max-width: 30rem;     /* viewBox width 480px */
  margin-inline: auto;
}

.rhythm-strip-svg.vis-mar svg,
.rhythm-strip-svg.vis-io_record svg,
.rhythm-strip-svg.vis-vitals_trend svg,
.rhythm-strip-svg.vis-lab_trend svg {
  min-width: 0;
  max-width: 37.5rem;   /* viewBox width 600px */
  margin-inline: auto;
}
```

### How it resolves

For a capped kind the base `width: 100%; height: auto` still applies, so the SVG fills the container **up to** its `max-width`, then `margin-inline: auto` centers it. `min-width: 0` removes the 576px floor. Result: on desktop each visual renders at its natural design width (no upscaling, fits beside the stem); on a phone it scales *down* to fit with no horizontal scrollbar. The viewBox preserves the aspect ratio for the auto height in every case.

Cap = viewBox width per kind, so there is zero upscaling and no gratuitous downscaling on desktop:

| kind | viewBox width | cap |
|------|--------------:|----:|
| device_screen, medication_label | 360 | 22.5rem |
| burn_map, injection_site | 480 | 30rem |
| mar, io_record, vitals_trend, lab_trend | 600 | 37.5rem |
| rhythm_strip, capnography, fetal_monitoring | ~900+ (varies) | *unchanged — keep min-width 36rem + scroll* |

## Verify

- `npm run test-visuals` — must stay green; SVG bytes and the parity snapshots are untouched (no renderer changed).
- `npm run build` — passes.
- Manual: open one item of each non-tracing kind via the dev review console (`?dev=1`) at a desktop width and at a ~390px width. Each should render at natural size (desktop) / shrink to fit with no horizontal scrollbar (mobile), with the stem and options reachable without scrolling past a single oversized figure. Confirm `rhythm_strip` and `capnography` still show the calibrated grid at full size with horizontal scroll on mobile.

## Non-goals / deferred

- **No renderer changes, no viewBox changes, no snapshot regeneration.** The fix is purely presentational.
- **Tracings keep upscaling slightly on very wide desktops** (they have no intrinsic px width, so `width:100%` fills the column). Capping them precisely would require emitting `width`/`height` on the tracing root `<svg>` — which *would* change the SVG bytes and force a parity-snapshot regen. Deferred unless the tracings themselves are reported as oversized.
- **Visual-beside-stem two-column layout on wide screens** is a separate, larger change; hold it until the sizing cap alone is tested against her actual screens.
