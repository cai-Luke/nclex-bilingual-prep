# GPT Chat Handoff — Residual Topic Cleanup

Use this handoff for small-batch GPT chat work after the 2026-06-17 Codex topic-hygiene passes.

## Current State

- Branch: `codex/residual-topic-proposal-harness`
- Canonical writes already completed:
  - Gemini-52 approved topic writes: 51 applied, 1 already done.
  - GPT/Claude 835 first pass: 493 in-category topic updates applied.
- Permanent harness fix completed:
  - Case child category is trusted from the child's own `category`.
  - Parent/child category mismatch alone is no longer `category-untrusted`.
- Do not use Gemini for classifier/judgment passes.

## Do Not Touch Automatically

The 75 unresolved rows are Luke's manual/GPT-chat work:

- `gpt-unresolved-75-sessions.md`
- `gpt-unresolved-75.json`

Work through one session at a time. For each item return:

```text
<id> | propose | <candidateSet topic> | <one-sentence reason>
<id> | out_of_category | <canonical topic outside candidateSet> | <one-sentence reason>
<id> | abstain | null | <one-sentence reason>
```

Use `out_of_category` only when the current category is probably wrong or a topic-licensing decision is missing. Use `abstain` when no canonical topic genuinely fits.

## Codex-Ready / Generated Artifacts

### Parent Reclaim — 90

Artifact:

- `audit/residual-reclaim-parents-2026-06-17.md`

Result:

- All 90 prior `context-incomplete` rows are case-study parents with their own filter-level topic.
- None were canonical-written in the reclaim pass.
- Recommended disposition: requeue parent topic proposals using the parent's own vignette/editorial case topic, not modal child topic.

Open decision:

- Whether Luke wants parent-topic proposals classified/applied in bulk or handled separately.

### Child Guard Reclaim — 136

Artifacts:

- `audit/residual-reclaim-children-2026-06-17.input.json`
- `audit/residual-reclaim-children-2026-06-17.queue.json`
- `audit/residual-reclaim-children-2026-06-17.results.json`
- `audit/residual-reclaim-children-2026-06-17.manifest.json`
- `audit/residual-reclaim-children-2026-06-17.report.md`

Current proposal counts:

- `proposed`: 109
- `blocked-cross-category`: 4
- `unresolved`: 23
- `category-untrusted`: 0

Recommended next step:

- Luke reviews or bulk-approves the 109 proposed rows.
- Do not apply the 4 blocked rows blindly; several are likely classifier artifacts or vocabulary-gap symptoms.

### Blocked-41 Triage

Artifacts:

- `blocked-41-category-correction-worklist.md`
- `blocked-41-category-correction-worklist.json`

Claude's corrected triage:

- 14 true category corrections:
  - 6 burn items -> category `Physiological Adaptation`, topic `Burn Management`
  - 8 injection-site items -> category `Pharmacological and Parenteral Therapies`, topic `Medication Safety & Admin`
- 19 maternal items should be fixed by topic licensing, not per-item recategorization.
- 8 false positives are dropped from category correction.

Important:

- The 14 true corrections require a separate dry-run/write tool that changes `category` and `topic`.
- Existing Gemini-52 tool is topic-only and must not be reused for category writes.

## Vocabulary Decisions Needed

### D1 — Maternal-Newborn Shared Licensing

Current problem:

- `Maternal-Newborn Care & Teaching` is licensed only under `Health Promotion and Maintenance`.
- Acute fetal monitoring, severe preeclampsia, and postpartum hemorrhage are correctly in `Reduction of Risk Potential` or `Physiological Adaptation`.

Recommended decision:

- Make `Maternal-Newborn Care & Teaching` shared across:
  - `Health Promotion and Maintenance`
  - `Reduction of Risk Potential`
  - `Physiological Adaptation`

Expected effect:

- Resolves the 19 maternal blocked rows in place without changing item categories.

### D2 — Add Skin/Wound Topic

Current problem:

- No canonical topic covers pressure injury, wound, or skin care.
- This caused false Burn Management proposals and several unresolved abstentions.

Candidate topic:

- `Skin & Wound Care`

Likely category:

- `Basic Care and Comfort`

Possible future sharing:

- Consider later whether specific wound complication/procedure items need `Reduction of Risk Potential`, but start strict unless Luke decides otherwise.

Expected effect:

- Clears pressure-injury / wound / skin-care residuals without forcing them into Burn Management.

## Good GPT Batch Plan

1. Run `gpt-unresolved-75-sessions.md` S01 only.
2. Convert results into a JSON result artifact.
3. Inspect `out_of_category` rows for vocabulary/category implications.
4. Repeat S02-S10 one at a time.
5. Only after D1/D2 decisions, rerun or reinterpret affected maternal/wound rows.

## Safety Rules

- Do not reclassify already-applied 493 rows.
- Do not use old free-text topic as evidence; use stem + correct answer + rationale.
- Do not pick a least-bad candidate.
- Do not apply category changes without a category-write dry-run and exact-diff verification.
- `BANK-REVIEW-LEDGER.md` is not updated for metadata-only topic/category cleanup.
