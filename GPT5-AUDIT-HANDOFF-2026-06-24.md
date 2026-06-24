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

Resolution (Luke, 2026-06-24):

- These five rows go to **Claude** as least-conflicted: principle 22 makes them
  GPT-provenance (so GPT-5 would self-review), and the prior Claude final review
  is the weaker conflict against GPT's clinical ownership. See
  `CLAUDE-OPUS-CURRENCY-HANDOFF-2026-06-24.md`.
- They are not in the GPT-5 package.

## GPT-5 / Codex package

Findings-only. No canonical writes. No rewritten JSON.

**Read first, in order:** `AGENTS.md` →
`Archive/root-specs-2026-06-18/NCLEX_Audit_Spec.md` (parent — the Finding §6 /
Single-Question Concern §7 format and evidentiary standards §4 / hallucination
guards §5 live here, not in the pilot spec) →
`Archive/early-bank-semantic-audit-spec.md` (campaign) →
`adversarial-audit-phase-a-pilot-spec.md` (pilot — severity axis §3, citation
rules §4, manifest schema §5).

Cross-cutting rules:
- **OG/currency findings require a dated authoritative source** (body + year +
  the specific value); no source → `recommendedAction = source_check`,
  `needsHumanReview = true`, never assert from model knowledge.
- **Jurisdiction:** the coherence pairs are delegation/scope-heavy. Anchor any
  scope-of-practice call on **NY RN licensure** (the app's jurisdiction); a
  divergence that is merely NY-vs-other-state is `source_check` +
  `needsHumanReview`, not a contradiction finding.

**Lane-scoped outputs** (Gemini is already complete and accepted by Luke;
Claude Code will run last and merge all lanes, so write only your lane's files):
- Findings: `audit/early-bank-semantic/coherence/lanes/codex.findings.md`
- Manifest: `audit/early-bank-semantic/coherence/lanes/codex.manifest.jsonl`

Use the Finding §6 / Concern §7 format from the parent spec and the manifest
schema from pilot §5.

### Coherence lane: 5 pairs (GPT-5 / Codex)

Five of the original seven `delegation_scope` pairs are clean for a GPT-family
reviewer (each touches a Claude-authored `claude_moc_*` item and the other end
is Gemini- or Claude-produced, never GPT). Full paths/banks are in
`audit/early-bank-semantic/coherence/2026-06-24.slice.json`.

- `claude_moc_assignment_mc_14` <-> `gemini_p8_08`
- `claude_moc_deleg_uap_hl_01` <-> `claude_moc_lpn_deleg_hl_b01`
- `claude_moc_deleg_uap_hl_01` <-> `claude_moc_supervision_hl_b04`
- `claude_moc_deleg_uap_hl_01` <-> `gemini_hl_moc_delegation_02`
- `claude_moc_supervision_hl_b04` <-> `gemini_hl_sic_precautions_06`

### Re-routed to Gemini (flag-only) — NOT in this package

Two pairs are `claude_moc` (Claude) × `gpt_*` (GPT-generated): Claude is
conflicted on the `claude_moc` end and GPT-5/Codex is conflicted on the
GPT-generated end (generation conflict, stronger than promotion-review). Only
Gemini is non-producer for both. The slice's `reviewer: "gpt-5"` label on these
is superseded; `build-audit-batch` needs a third-reviewer branch for claude×gpt
pairs in Phase B.

- `claude_moc_deleg_matrix_08` <-> `gpt_canonical_matrix_scope_assignment_050`
- `claude_moc_lpn_deleg_hl_b01` <-> `gpt_hl_moc_lpn_scope_05`

Status: Gemini completed these two pairs and Luke accepted the recommendations
recorded in `ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md` plus
`audit/early-bank-semantic/coherence/ADVERSARIAL-AUDIT-2026-06-24.manifest.jsonl`.
Both pairs were dismissed/kept; Codex should not re-audit or rewrite them.

### Currency lane: 7 rows (live paths)

The Phase B currency rows in `CLAUDE-RETURN-INDEX.md` section 5 were indexed on
the 2026-06-13 baseline. Against the regenerated bank, the surviving
GPT-5-auditable rows and their **current** paths are:

| id | bank | path |
|---|---|---|
| `cs_sepsis_shock_01` | `hard-cases-canonical.json` | `questions[36]` |
| `cs_sepsis_shock_01_part_1` | `hard-cases-canonical.json` | `questions[36].caseStudy.questions[0]` |
| `cs_sepsis_shock_01_part_2` | `hard-cases-canonical.json` | `questions[36].caseStudy.questions[1]` |
| `cs_sepsis_shock_01_part_3` | `hard-cases-canonical.json` | `questions[36].caseStudy.questions[2]` |
| `cs_stemi_vfib_04` | `hard-cases-canonical.json` | `questions[35]` |
| `cs_stemi_vfib_04_part_2` | `hard-cases-canonical.json` | `questions[35].caseStudy.questions[1]` |
| `cs_stemi_vfib_04_part_3` | `hard-cases-canonical.json` | `questions[35].caseStudy.questions[2]` |

**Obsolete — not in the GPT-5 package:** `case_stroke_01` (+ `_q1/_q2/_q3`) and
`case_burns_01_part_2` no longer exist in the bank; they were removed/superseded
since the 2026-06-13 baseline. Their stroke/burn currency concern is now carried
by new GPT-generated items (`gpt_stroke_2026_06_16_..._warfarin_01`,
`gpt_case_major_burn_inhalation_fluid_creep_01`), which are GPT-provenance
(GPT-5-conflicted) and belong to the separate currency-delta screening of the
~360 new items, not this producer-conflict closeout.

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
