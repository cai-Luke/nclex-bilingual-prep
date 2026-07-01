# Rhythm Strip Pacemaker Backfill Audit - 2026-07-01

Purpose: visual audit artifacts for the three canonical pacemaker backfill replacements merged into `banks/visual-canonical.json`.

## Replacement Map

- `ekg_b5_mc_04` retired -> `ekg_pacer_failure_to_capture_2026_07_01`
- `ekg_b5_mc_05` retired -> `ekg_pacer_failure_to_sense_2026_07_01`
- `ekg_b5_matrix_10` retired -> `ekg_pacer_failure_to_pace_2026_07_01`

## Render Evidence

Rendered SVG and PNG artifacts are in `rendered/`.

- `rendered/contact-sheet.png` stacks all three canonical replacement strips for quick visual inspection.
- Individual SVG/PNG pairs are named by replacement question ID.

Visual inspection result: failure to capture shows pacer spikes with intermittent absent QRS response; failure to sense shows pacer spikes occurring despite intrinsic activity; failure to pace shows a prolonged interval without pacer spikes despite the programmed lower-rate context.

## Verification

- `npm run validate-bank -- banks/visual-canonical.json` passed after consolidation.
- `npm run audit` passed before consolidation with the raw draft and promoted artifact present.
- Clinical cue definitions were cross-checked against NCBI/StatPearls pacemaker malfunction review.
