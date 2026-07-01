# Claude Handoff: Standalone Visual Split Layout

Date: 2026-06-28  
Branch: `codex/standalone-visual-split`

## Product Call

This pass extends the exam-like split layout to standalone visual-stimulus questions only. Case studies are unchanged from PR #1.

Gate:

```ts
question.visual && question.itemType !== "case_study"
```

Included visual kinds:

- `vitals_trend`
- `lab_trend`
- `mar`
- `io_record`
- `medication_label`
- `device_screen`
- `burn_map`
- `injection_site`

Excluded/full-width visual kinds:

- `rhythm_strip`
- `capnography`
- `fetal_monitoring`

Bowtie remains naturally excluded because it has no `question.visual`; its answer diagram stays full-width.

## Implementation Notes

`QuestionCard` now detects allowlisted standalone visuals and wraps only those questions in:

- left pane: `VisualStimulus`
- right pane: stem, answer control, submit, answer banner, language-miss affordance, rationale

Excluded visual kinds keep the previous full-width `VisualStimulus` above the stem. Non-visual questions keep the previous layout.

The layout reuses `.exam-split-layout` but has standalone-specific classes:

- `.standalone-visual-card`
- `.standalone-visual-layout`
- `.standalone-visual-pane`
- `.standalone-work-pane`

Standalone split collapses to one column at `1100px`, earlier than the case-study mobile breakpoint, so dense MAR/I&O tables are not squeezed into a half-width pane on tablet-sized screens. At narrow widths, included visual wrappers use internal horizontal overflow as a guard against dense SVG/table overflow.

## Smoke IDs Used

Included kinds:

- `vitals_trend`: `vit_01`
- `lab_trend`: `gpt_u3_labtrend_2026_06_09_mc_potassium_furosemide_01`
- `mar`: `gpt_fresh_2026_06_22_vis_01`
- `io_record`: `gpt_visual_smoke_2026_06_12_fib_io_net_balance_04`
- `medication_label`: `gpt_visual_smoke_2026_06_12_fib_medlabel_heparin_rate_07`
- `device_screen`: `dev_pca_basal_opioid_naive_01`
- `burn_map`: `burn_fib_tbsa_anterior_mix_01`
- `injection_site`: `gpt_injection_smoke_2026_06_15_mc_intradermal_01`

Excluded kinds:

- `rhythm_strip`: `rhy_sinus_brady_001`
- `capnography`: `cap_01`
- `fetal_monitoring`: `fhr_gemini_smoke_2026_06_13_01`

Observed:

- included kinds render `.standalone-visual-layout` with visual/work panes at desktop width;
- excluded waveform/tracing kinds do not render standalone split and keep the full-width visual-above-stem layout;
- MAR and I/O collapse to one column below `1100px`;
- I/O visual wrapper has internal horizontal overflow enabled at narrow widths.

## Verification

Passed:

```sh
npx tsc -b --pretty false
npm run validate-bank -- banks/*.json
npm run test-visuals
npm run build
```

`npm run build` still reports the existing Vite chunk-size warning.

## Review Requests

- Review MAR/I&O ergonomics in a normal learner session, not only the dev-review console. The split collapses early, but table density is still the highest-risk visual class.
- Confirm whether Summary review should keep the standalone visual split or use read-through full-width layout later. This pass keeps split behavior anywhere `QuestionCard` renders allowlisted standalone visuals.
