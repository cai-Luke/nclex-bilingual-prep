# Claude Code Handoff — 2026-06-15

## Status

Luke is closing this week's work with usage nearly exhausted. Do not restart the whole regeneration program.

Completed in the latest Codex pass:

- Closed spec sections **B** and **C** from `regeneration-omissions-review-spec.md`.
- Added accepted omission ledger records for:
  - `opus_car_t_crs_2026_06_11_case_01` — DP5 accepted as merged into Q4; bank has 5 embedded items.
  - `opus2_case_code_status_01` — DP6 accepted as distributed across Q1/Q2/Q5.
- Updated forward case pipeline topology:
  - `Opus skeleton -> GPT fact-check + compile -> Gemini flag-only review -> Claude final gate`
- Converted `gemini-case-compiler-prompt.md` into the Gemini flag-only review-layer prompt.
- Updated `gpt-case-skeleton-compiler-prompt.md`, `case-skeleton-pipeline-spec.md`, `DECISIONS.md`, `Gemini.md`, `PROJECT-HISTORY.md`, and `BANK-REVIEW-LEDGER.md`.
- No canonical bank JSON was changed.

Verification already run:

```sh
npm run validate-bank -- banks/hard-cases-canonical.json banks/claude-canonical.json
npm run test:case-completeness
git diff --check
```

All passed.

## Current Git State

Expected modified files:

- `BANK-REVIEW-LEDGER.md`
- `DECISIONS.md`
- `Gemini.md`
- `PROJECT-HISTORY.md`
- `case-skeleton-pipeline-spec.md`
- `gemini-case-compiler-prompt.md`
- `gpt-case-skeleton-compiler-prompt.md`

Expected untracked files:

- `regeneration-omissions-review-spec.md` — user-provided spec; leave unless Luke asks otherwise.
- `CLAUDE-CODE-HANDOFF-2026-06-15.md` — this handoff.

## Remaining Work

Section **A** of `regeneration-omissions-review-spec.md` is still open and should be picked up later, not now:

- Triage and regenerate/retire the 13 below-floor R1 cases.
- Proposed net from the spec: 9 regenerations, 1 postpartum-preeclampsia consolidation rebuild, 3 purges.
- Use deterministic load/filter/insert/serialize for canonical bank mutations.
- Reuse original top-level `case_id` for regenerated cases.
- Route new compiled cases to the `gpt-` lane under the updated pipeline.
- Run full promotion/audit/census/build only after actual bank mutations.

Important guardrails:

- Do not hand-edit canonical JSON.
- Do not let Gemini mutate JSON; Gemini emits flags only.
- Raw generated content is not reviewed study material until validation, audit, source/content review, ledger, and census are complete.
- Keep runtime static/offline.

## Suggested Next First Step

When usage resets, start with the **A.2 triage confirmation** rather than generation:

1. Read each R1 compiled case and confirm `Regenerate`, `Consolidate`, or `Retire`.
2. Confirm whether the two generic post-op Gemini cases should be purged as proposed.
3. Only then generate/rebuild the retained set through the updated Opus -> GPT -> Gemini flags -> Claude gate flow.
