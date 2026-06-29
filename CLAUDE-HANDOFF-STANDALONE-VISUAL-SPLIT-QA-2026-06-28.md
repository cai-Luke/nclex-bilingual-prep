# Claude Handoff — Standalone Visual Split QA

Date: 2026-06-28  
Branch: `codex/standalone-visual-split-qa`

## Scope

This is the PR 2.1 QA/hardening pass for the standalone visual split layout.

No bank content, grading, storage, or schema behavior changed.

## Fixes Made

- Fixed the standalone split layout not actually splitting.
  - Root cause: `.standalone-visual-layout` had grid columns but inherited no `display: grid`.
  - Fix: add `display: grid` to shared `.exam-split-layout`.
  - Case-study split was less exposed because its wrapper also had `.case-study-panel { display: grid; }`.
- Removed `mar` and `io_record` from `STANDALONE_SPLIT_VISUAL_KINDS`.
  - Browser measurements showed the desktop visual pane is 384 px wide in the learner session.
  - MAR/I&O are dense tabular visuals; keeping them full-width is more readable and aligns with the earlier concern about not squeezing table stimuli.
- Removed the now-unused `mar`/`io_record` narrow-width rules under `.standalone-visual-pane`.

## Current Split Allowlist

Standalone split now applies to:

```ts
vitals_trend
lab_trend
medication_label
device_screen
burn_map
injection_site
```

Standalone split does not apply to:

```ts
mar
io_record
rhythm_strip
capnography
fetal_monitoring
bowtie
non-visual questions
```

## Smoke Table

Smoke was run through learner one-question Library sessions at desktop width (`1440x900`) unless noted.

| Visual kind | Smoke ID | Expected layout | Result | Notes |
| --- | --- | --- | --- | --- |
| `vitals_trend` | `vit_01` | Split | Pass | Visual pane 384 px; work pane ~675 px; same-row split. |
| `lab_trend` | `gpt_u3_labtrend_2026_06_09_mc_potassium_furosemide_01` | Split | Pass | Same-row split. |
| `medication_label` | `gpt_visual_smoke_2026_06_12_fib_medlabel_heparin_rate_07` | Split | Pass | 360 px label fits the visual pane. |
| `device_screen` | `dev_pca_basal_opioid_naive_01` | Split | Pass | 360 px device screen fits the visual pane. |
| `burn_map` | `burn_fib_tbsa_anterior_mix_01` | Split | Pass | Same-row split; diagram scales to pane width. |
| `injection_site` | `gpt_injection_smoke_2026_06_15_mc_intradermal_01` | Split | Pass | Same-row split; cross-section scales to pane width. |
| `mar` | `gpt_fresh_2026_06_22_vis_01` | Full-width | Pass | Removed from split; renders above stem at 600 px. |
| `io_record` | `gpt_visual_smoke_2026_06_12_fib_io_net_balance_04` | Full-width | Pass | Removed from split; renders above stem at 600 px. |
| `rhythm_strip` | `rhy_sinus_brady_001` | Full-width | Pass | No split wrapper; tracing min-width 576 px and horizontal overflow preserved. |
| `capnography` | `cap_01` | Full-width | Pass | No split wrapper; tracing min-width 576 px and horizontal overflow preserved. |
| `fetal_monitoring` | `fhr_gemini_smoke_2026_06_13_01` | Full-width | Pass | No split wrapper; tracing min-width 576 px and horizontal overflow preserved. |
| Bowtie | `opus_case_lithium_toxicity_bowtie` | Full-width normal card | Pass | No split wrapper; bowtie panel present. |
| Non-visual | `claude_a_mc_acute_mi_01` | Normal card | Pass | No visual pane or split wrapper. |

Narrow fallback smoke at `1024x768`:

- Included split kinds stack (`sameRow: false`) because the `max-width: 1100px` media rule applies.
- `mar` remains full-width and out of the standalone split path.

Commands:

- `npx tsc -b --pretty false`
- `npm run validate-bank -- banks/*.json`
- `npm run test-visuals`
- `npm run build`

Notes:

- `npm run build` still has the existing Vite chunk-size warning.

## Recommendation

Keep MAR/I&O out of standalone split unless a later design pass gives table visuals a wider first-column mode or a dedicated table expansion affordance. The split works well for squarish/vertical visuals, but the current 384 px desktop visual pane is too tight for dense table cognition.

## Review Requests

1. Confirm the reduced allowlist is acceptable: six split kinds instead of eight.
2. Confirm whether `vitals_trend` and `lab_trend` should stay split at 384 px, or whether PR 2.2 should raise the split breakpoint / visual-pane minimum.
3. Confirm whether Developer Review’s narrower content column should intentionally stack standalone split visuals even on a wide viewport.
