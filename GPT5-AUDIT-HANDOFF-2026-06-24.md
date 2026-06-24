# GPT5-AUDIT-HANDOFF-2026-06-24.md

Handoff for the adversarial semantic audit after the Layer A calibration and
batch-draw gate.

## Gate status

- Codex batch-draw setup passed local verification.
- Claude independently gated the emitted artifact and reported **PASS**.
- Slice artifact:
  `audit/early-bank-semantic/coherence/2026-06-24.slice.json`
- Slice self-check:
  - `unique_item_count`: 109
  - `candidate_pair_count`: 156
  - `reviewer_split.claude_pairs`: 149
  - `reviewer_split.gpt5_pairs`: 7
  - `gpt5_carveout_ids`:
    - `claude_moc_assignment_mc_14`
    - `claude_moc_deleg_matrix_08`
    - `claude_moc_deleg_uap_hl_01`
    - `claude_moc_lpn_deleg_hl_b01`
    - `claude_moc_supervision_hl_b04`

## Decision needed

Five Opus currency rows have no clean model auditor after DECISIONS principle 22.

Rows:

- `opus1_case_discharge_med_rec_anticoag_01_q3`
- `opus1_case_discharge_med_rec_anticoag_01_q5`
- `opus3_iv_potassium_safety_case_01`
- `opus3_iv_potassium_safety_case_01_q4`
- `opus3_iv_potassium_safety_case_01_q5`

Reason:

- Principle 22 makes Opus skeleton cases GPT-provenance for review-conflict
  routing, so GPT-5 auditing these rows would be self-review.
- Claude also has final-review conflict on these single-item currency rows.
- Therefore neither GPT-5 nor Claude is a clean model auditor for this small
  currency set.

Recommended call:

- Hold these five rows for human spot-check.
- Do not include them in either GPT-5 or Claude model-audit lane.
- Keep the 12 non-Opus currency rows in the GPT-5 package.

## GPT-5 package

Use findings-only mode. No canonical writes.

Authoritative format:

- `adversarial-audit-phase-a-pilot-spec.md` sections 3-5
- Output findings report:
  `ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md`
- Output manifest:
  `audit/early-bank-semantic/coherence/ADVERSARIAL-AUDIT-2026-06-24.manifest.jsonl`

### Coherence lane: 7 pairs

All seven pairs are `delegation_scope` and touch a genuine Claude-authored
`claude_moc_*` item. Full paths/banks are in
`audit/early-bank-semantic/coherence/2026-06-24.slice.json` by filtering
`pairs[].reviewer === "gpt-5"`.

- `claude_moc_assignment_mc_14` <-> `gemini_p8_08`
- `claude_moc_deleg_matrix_08` <-> `gpt_canonical_matrix_scope_assignment_050`
- `claude_moc_deleg_uap_hl_01` <-> `claude_moc_lpn_deleg_hl_b01`
- `claude_moc_deleg_uap_hl_01` <-> `claude_moc_supervision_hl_b04`
- `claude_moc_deleg_uap_hl_01` <-> `gemini_hl_moc_delegation_02`
- `claude_moc_lpn_deleg_hl_b01` <-> `gpt_hl_moc_lpn_scope_05`
- `claude_moc_supervision_hl_b04` <-> `gemini_hl_sic_precautions_06`

### Currency lane: 12 rows

Use the open Phase B currency rows from
`audit/early-bank-semantic/CLAUDE-RETURN-INDEX.md` section 5, excluding the five
Opus rows listed in Decision needed.

Rows to keep in GPT-5 package:

- `cs_sepsis_shock_01`
- `cs_sepsis_shock_01_part_1`
- `cs_sepsis_shock_01_part_2`
- `cs_sepsis_shock_01_part_3`
- `cs_stemi_vfib_04`
- `cs_stemi_vfib_04_part_2`
- `cs_stemi_vfib_04_part_3`
- `case_stroke_01`
- `case_stroke_01_q1`
- `case_stroke_01_q2`
- `case_stroke_01_q3`
- `case_burns_01_part_2`

## Claude lane note

Claude can proceed with the 149-pair coherence lane as harm-ordered
sub-sessions: delegation, then isolation, then potassium plus insulin.

The coherence lane includes Opus potassium items such as
`opus3_iv_potassium_safety_case_01_q3` and
`opus3_iv_potassium_safety_case_01_q5`. This is acceptable under the current
interpretation because coherence is a relational cross-item judgment, not the
same single-item currency re-review that created the conflict. If a stricter
interpretation is desired, exclude those pairs explicitly before the pilot.

## Verification already run

```sh
npm run audit:early-bank-semantic
npm run test:early-bank-semantic
npm run audit:build-batch
npm run test:build-batch
npm run build
```

`npm run build` passed with the existing large chunk warning.
