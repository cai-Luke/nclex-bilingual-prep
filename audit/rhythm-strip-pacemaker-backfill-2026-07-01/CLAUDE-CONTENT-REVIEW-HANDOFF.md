# Claude Content Review Handoff - Pacemaker Backfill

Date: 2026-07-01
Priority: low, per Luke. This is a follow-up content review handoff, not a blocker for the live push.

## Scope

Three reviewed text-only pacemaker items were retired and replaced with visual rhythm-strip items after the pacemaker overlay renderer landed:

| Retired ID | Replacement ID | Target |
|---|---|---|
| `ekg_b5_mc_04` | `ekg_pacer_failure_to_capture_2026_07_01` | Failure to capture |
| `ekg_b5_mc_05` | `ekg_pacer_failure_to_sense_2026_07_01` | Failure to sense / R-on-T risk |
| `ekg_b5_matrix_10` | `ekg_pacer_failure_to_pace_2026_07_01` | Failure to pace |

## What Changed

- Old IDs were removed from `banks/visual-canonical.json`.
- New IDs were promoted through the raw -> promote -> audit -> consolidate path, then the raw source was deleted.
- Stems were rewritten so the rendered rhythm strip carries the ECG finding instead of the prose stating it before answer selection.
- `banks/visual-canonical.json` was bumped to schema `1.7` because pacer-bearing `rhythm_strip` visuals now have a bank-level schema floor.

## Review Ask

When time permits, review the three replacement items for:

- Clinical accuracy of the pacemaker finding and dangerous-condition language.
- Fairness: the stem should not leak the finding, but the visual plus stem should make the keyed answer reasonably inferable.
- Bilingual parity in stems, options, rationales, strategies, and glossary.
- Visual necessity: if the strip is removed, the answer should no longer be directly recoverable from the pre-answer text alone.

## Evidence Already Collected

- Structural validation passed.
- `npm run audit` passed before consolidation with the raw draft and promoted artifact present.
- Final full-bank validation, visual tests, census check, audit, and build passed after consolidation.
- Render evidence is in this folder under `rendered/`; `contact-sheet.png` stacks all three replacement strips.
- Clinical cue definitions were cross-checked against NCBI/StatPearls pacemaker malfunction review.
