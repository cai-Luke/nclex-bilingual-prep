# Claude Phase B Routing Blocker Handoff — 2026-06-25

Purpose: return Phase B coherence work to Claude/Luke because Codex hit the
explicit stop condition in `PHASE-B-COHERENCE-HANDOFF-2026-06-25.md`.

## What Codex Completed

Implemented the durable reviewer-routing fix in
`scripts/audit/build-audit-batch.ts`:

- `Reviewer` is now `claude | gpt-5 | gemini | needs-provenance`.
- `mixed` producer pairs route to `needs-provenance`, not `gpt-5`.
- `claude×gpt` pairs route to `gemini`.
- `reviewer_split` now includes `gemini_pairs` and
  `needs_provenance_pairs`.
- The artifact now includes top-level `needs_provenance_pairs`.
- CLI summary prints all four reviewer buckets.

Updated `scripts/tests/build-audit-batch.ts` to lock in the corrected Phase A
behavior:

- Phase A still has 109 unique items and 156 candidate pairs.
- Corrected split is `claude=149`, `gpt-5=5`, `gemini=2`,
  `needs-provenance=0`.
- The two former false `gpt-5` pairs are now Gemini-routed:
  - `claude_moc_deleg_matrix_08` ↔ `gpt_canonical_matrix_scope_assignment_050`
  - `claude_moc_lpn_deleg_hl_b01` ↔ `gpt_hl_moc_lpn_scope_05`

Regenerated the Phase A slice at:

- `audit/early-bank-semantic/coherence/2026-06-24.slice.json`

Generated the Phase B slice at:

- `audit/early-bank-semantic/coherence/2026-06-25-phaseB.slice.json`

## Verification Run

Commands:

```sh
npm run audit:early-bank-semantic
npm run test:build-batch
npx tsx scripts/audit/build-audit-batch.ts \
  --clusters mi_chest_pain,stroke_escalation,digoxin_hold,lithium_toxicity,dialysis_complications,fetal_heart_rate,pressure_injury,hipaa_disclosure \
  --label 2026-06-25-phaseB \
  --out audit/early-bank-semantic/coherence/2026-06-25-phaseB.slice.json
npm run build
```

Results:

- `npm run audit:early-bank-semantic` passed and rewrote
  `audit/early-bank-semantic/layer-a-queue.jsonl`.
- `npm run test:build-batch` passed.
- `npm run build` passed with the existing large chunk warning.
- Phase B slice generation completed, but failed the handoff oracle below.

## Stop Condition Hit

`PHASE-B-COHERENCE-HANDOFF-2026-06-25.md` says to continue only if the Phase B
slice reports:

- `unique_item_count`: 99
- `candidate_pair_count`: 113
- `reviewer_split`: `claude=89`, `gpt-5=7`, `gemini=2`,
  `needs-provenance=15`

The current regenerated slice reports:

- `unique_item_count`: 93
- `candidate_pair_count`: 104
- `reviewer_split`: `claude=81`, `gpt-5=6`, `gemini=2`,
  `needs-provenance=15`

Per the spec, Codex did not proceed to `codex.phaseB.findings.md` or
`codex.phaseB.manifest.jsonl`.

## Specific Diagnostic

The missing GPT-5 lane pair from Claude's handoff table is:

- `claude_a_mc_ng_tube_placement_23` ↔ `gen_rrp_batch1_09`

Both rows exist in `audit/early-bank-semantic/layer-a-queue.jsonl`, and they are
paired with each other.

Current queue facts:

- `gen_rrp_batch1_09` has `concept cluster: dialysis_complications`.
- `claude_a_mc_ng_tube_placement_23` does **not** have
  `concept cluster: dialysis_complications`; it only has:
  - `topic/answer similarity pair`
  - `redundancy cluster size >= 3`

Current `build-audit-batch.ts` behavior includes a pair in a selected concept
cluster only when **both** ends have that same selected concept cluster. Under
that rule, the `claude_a_mc_ng_tube_placement_23` ↔ `gen_rrp_batch1_09` pair is
excluded.

Codex tested the obvious relaxed rule, "include every peer of a selected
concept-cluster seed." That does recover the missing GPT-5 pair, but it
overshoots the handoff oracle:

- Relaxed-rule result: 116 items / 133 pairs
- Split: `claude=102`, `gpt-5=7`, `gemini=3`, `needs-provenance=21`

So the handoff oracle does not match either:

1. the existing strict shared-cluster rule, or
2. the broad one-sided cluster-seed peer rule.

## Decision Needed

Claude/Luke should clarify the intended Phase B slice rule:

- Keep the strict shared-cluster rule and revise the oracle/table to 104 pairs,
  93 items, and 6 GPT-5 pairs.
- Add a narrower exception/worklist that includes selected one-sided
  concept-seed pairs, including `claude_a_mc_ng_tube_placement_23` ↔
  `gen_rrp_batch1_09`, without admitting the full 133-pair relaxed set.
- Or provide the exact 113-pair manifest/selection rule used to derive the
  original oracle.

Until that is decided, the Codex Phase B review lane should remain paused.

## Current Git State Notes

Pre-existing/user changes before Codex work included:

- Modified: `audit/early-bank-semantic/CAMPAIGN-STATUS.md`
- Untracked: `PHASE-B-COHERENCE-HANDOFF-2026-06-25.md`
- Untracked: `audit/early-bank-semantic/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md`

Additional untracked Gemini lane files appeared during the session but were not
created by Codex's Phase B work:

- `audit/early-bank-semantic/coherence/lanes/gemini.findings.md`
- `audit/early-bank-semantic/coherence/lanes/gemini.manifest.jsonl`

Codex-created or Codex-modified files:

- `scripts/audit/build-audit-batch.ts`
- `scripts/tests/build-audit-batch.ts`
- `audit/early-bank-semantic/coherence/2026-06-24.slice.json`
- `audit/early-bank-semantic/coherence/2026-06-25-phaseB.slice.json`
- `CLAUDE-PHASE-B-ROUTING-BLOCKER-HANDOFF-2026-06-25.md`
