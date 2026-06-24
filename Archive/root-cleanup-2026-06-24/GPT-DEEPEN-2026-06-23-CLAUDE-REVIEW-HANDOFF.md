# GPT Deepen 2026-06-23 — Claude Review Handoff

## Scope

Three raw GPT batches are staged for final content review and promotion-gate work:

- `banks/banks-raw/gpt-deepen-2026-06-23-bow.json` — 10 `bowtie`
- `banks/banks-raw/gpt-deepen-2026-06-23-cue.json` — 10 `highlight`
- `banks/banks-raw/gpt-deepen-2026-06-23-bcc.json` — 5 `bowtie` + 5 `highlight`

The earlier short Instance A output was degenerate/partial and has been moved out of raw intake:

- `Archive/degenerate-raw-2026-06-24/gpt-deepen-2026-06-23-bow-degenerate-partial.json`

Do not promote the archived partial; it duplicates `_01`-`_05` ids from the new bow file.

## Deterministic Checks Already Run

Passed:

```sh
npm run validate-bank -- \
  banks/banks-raw/gpt-deepen-2026-06-23-bow.json \
  banks/banks-raw/gpt-deepen-2026-06-23-cue.json \
  banks/banks-raw/gpt-deepen-2026-06-23-bcc.json

npm run normalize-raw-bank -- banks/banks-raw/gpt-deepen-2026-06-23-bow.json
npm run normalize-raw-bank -- banks/banks-raw/gpt-deepen-2026-06-23-cue.json
npm run normalize-raw-bank -- banks/banks-raw/gpt-deepen-2026-06-23-bcc.json
```

Results:

- all three validate cleanly
- all three report `0 structural change(s); already normalized; validation passed`
- quick positional-language grep found no true option-letter hazards; only benign words like "choices" in de-escalation text

## Quick Clinical Screen

No local hard blockers found. Please perform the normal Claude final clinical/content review before promotion.

Items to adjudicate closely:

- `gpt_deepen_2026_06_23_bow_01`: COPD ABG is keyed as `Acute respiratory acidosis`. Because HCO3 is 29 in a COPD client, consider whether "acute-on-chronic respiratory acidosis" would be more precise, or whether the closed-world protocol/rationale makes the current wording acceptable.
- `gpt_deepen_2026_06_23_bow_05`: keyed condition is `Early septic shock from infection-related vasodilation`. The stem uses a closed-world sepsis protocol trigger (`MAP < 65 or lactate >= 2`) and has hypotension, oliguria, confusion, and lactate 3.4. Consider whether the condition label should be softened to "sepsis with shock/hypoperfusion" to avoid formal Sepsis-3 septic-shock wording.
- `gpt_deepen_2026_06_23_bow_06`: one keyed monitoring parameter is blood glucose after insulin-dextrose therapy, while insulin-dextrose is not one of the two keyed actions. The rationale says glucose monitoring is needed "if used." This is clinically plausible after hyperkalemia shifting therapy, but confirm it is not too indirect for the bowtie parameter zone.
- `gpt_deepen_2026_06_23_cue_04`: prior medication-overdose attempt 8 months ago is keyed as an acute suicide-risk cue. It is a strong risk factor, but may be less "acute" than the plan/means/preparatory behavior/command hallucination cues. Consider whether the stem criterion supports keying history.
- `gpt_deepen_2026_06_23_cue_10`: restraint item is closed-world policy based. The provider order from 2310 until 0700 is marked acceptable because the stem only says "time-limited provider order"; if you want a stricter violent/self-destructive restraint standard, this may need a duration cap in the stem.
- `gpt_deepen_2026_06_23_bcc_07`: keys evening caffeine as requiring follow-up alongside sedation/respiratory/fall-risk cues. This is reasonable for sleep hygiene but slightly softer than the safety triggers; confirm the stem criterion is broad enough.
- `gpt_deepen_2026_06_23_bcc_09`: combined condition token `Opioid-induced neurotoxicity or over-sedation` matches the stem protocol. Confirm the palliative-care action wording preserves comfort goals and does not imply abrupt analgesia withdrawal except when sedation remains unsafe and provider direction is pending.

Source anchors used in the quick screen:

- CDC urgent maternal warning signs: heavy bleeding soaking one or more pads in an hour, severe headache/vision symptoms, fever/foul discharge, leg pain/swelling, chest pain/trouble breathing.
- HealthyChildren/AAP and NHTSA car-seat guidance: toddlers remain rear-facing as long as possible until the seat height/weight limit.
- CPSC anti-scald guidance: 120 F water-heater setting may be needed to reduce tap-water scald risk.
- ACOG/AWHONN fetal-monitoring guidance: late deceleration timing; intrauterine resuscitation includes lateral positioning, IV fluid bolus, and reducing/stopping oxytocin when indicated.
- CDC sepsis core elements: low blood pressure/elevated lactate supports fluid resuscitation and sepsis escalation measures.
- NCBI/StatPearls hyperkalemia summary: calcium stabilizes cardiac membranes first when ECG changes/arrhythmias are present.
- Joint Commission/CMS restraint references: restraint/seclusion orders must be time-limited; violent/self-destructive restraint orders have shorter maximums (commonly 4 hours for adults), while nonviolent medical restraints may follow facility policy/time-limited order rules.
- Palliative Care Network / NIH references on opioid-induced neurotoxicity: hallucinations, confusion, myoclonus, sedation risk; management includes assessment, treating contributors, opioid adjustment/rotation, and safety.

## Promotion Notes

If Claude approves/fixes content:

1. Keep only the three intended raw files in `banks/banks-raw/`.
2. Run the standard flow from `AGENTS.md`:

```sh
npm run normalize-raw-bank -- banks/banks-raw/<file>.json
npm run promote
npm run audit
npm run consolidate -- --dry-run
npm run consolidate
npm run validate-bank -- banks/*.json
npm run coverage-report
npm run census
npm run build
```

3. Delete consumed raw drafts after merge and record the three source files in `BANK-REVIEW-LEDGER.md`.
