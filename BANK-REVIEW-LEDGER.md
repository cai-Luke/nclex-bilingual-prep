# Bank Review Ledger

This ledger tracks which generated question banks are safe to treat as reviewed testing material. Keep this separate from `PROJECT-HISTORY.md`: history is narrative; this file is the operational checklist.

## Status Values

- `unreviewed`: Generated or imported, but not checked beyond existence.
- `schema-valid`: Passes `npm run validate-bank -- <file>`, but content has not been reviewed.
- `content-reviewed`: Content review completed; may still need edits or validation.
- `fixed-and-validated`: Review issues were fixed and the bank passes validation after fixes.
- `needs-human-clinical-review`: An item or bank has unresolved clinical/protocol ambiguity that should be checked by a qualified nurse educator or clinician before testing use.
- `rejected`: Do not use as testing material.

## Workflow

1. Generate each model batch as a raw/review candidate, preferably under `banks-raw/` or another non-bundled holding location, using a source/date/batch naming convention such as `gemini-2026-06-05-b.json`.
2. Run schema validation before content review:
   - `npm run validate-bank -- <candidate-file>.json`
3. Content-review the bank for:
   - unsafe or outdated clinical claims
   - ambiguous stems or multiple plausible keyed answers
   - contraindicated actions placed into ordered-response sequences
   - dosage-calculation errors
   - bilingual mismatches or confusing Chinese translations
   - overly absolute wording where modern protocol is conditional
4. Preserve raw model output when it is in `banks-raw/`; apply fixes only to the reviewed/promoted copy or during canonical-bank consolidation.
5. Re-run validation after edits.
6. Merge or promote only reviewed, valid questions into top-level `banks/*.json`; those are the files bundled into the app.
7. Update this ledger before treating the bank as reviewed.

## Generation Policy

Prefer new JSON files for every Gemini batch. Do not ask Gemini to append directly to canonical bundled banks.

Gemini should be treated as a fast raw-draft generator, not a trusted canonical editor. Recent hard-case output required cleanup for placeholder distractors, generic per-choice rationales, broad/wrong topic labels, and loose adherence to canonical shape. Use the tightened generation prompt, keep batches small, preserve raw output in `banks-raw/`, and require cross-model review before promotion.

Reasons:

- Easier review tracking: each batch can move from `unreviewed` to `fixed-and-validated`.
- Safer rollback: a flawed batch can be rejected without untangling mixed edits.
- Cleaner coverage planning: batch prompts can target specific gaps from `npm run coverage-report`.
- Fewer merge mistakes: reviewed banks can be bundled or merged only after validation.
- Lower model-risk: Gemini-specific filler or schema drift is caught before it reaches the learner.

Appending is acceptable only after a batch is already reviewed and validated, and only as a deliberate consolidation step.

Canonical source banks use the `<model>-canonical.json` naming pattern:

- `banks/gpt-canonical.json`
- `banks/claude-canonical.json`
- `banks/gemini-canonical.json`
- `banks/hard-cases-canonical.json`

Future Gemini output should arrive as a separate raw/review batch file, for example `banks-raw/gemini-2026-06-05-b.json`. After review and validation, the accepted questions can be deliberately consolidated into `banks/gemini-canonical.json`.

Only top-level `banks/*.json` files are bundled by the app. `banks/Pending cases/` is a holding/rejected/archive area, not a bundled source.

## Reviewed Banks

| Bank file | Source | Questions | Schema validation | Content review | Status | Notes |
|---|---:|---:|---|---|---|---|
| `banks/claude-canonical.json` | Claude | 45 | 2026-06-05: valid after GPT/Claude redundancy prune | 2026-06-05 pre-ledger audit + 2026-06-05 redundancy prune | `fixed-and-validated` | Earlier audit removed flawed enteral nutrition ordered-response item and left a 36-question baseline. The file later contained 49 valid questions; on 2026-06-05, removed 4 Claude questions that overlapped highly with GPT canonical items: `claude_a_mc_advance_directive_31`, `claude_a_or_cord_prolapse_44`, `claude_a_sata_clabsi_prevention_22`, and `claude_a_cloze_pulmonary_embolism_07`. Metadata count corrected to 45. |
| `banks/gemini-canonical.json` | Gemini | 570 | 2026-06-05: valid after redundancies prune | 2026-06-05 | `fixed-and-validated` | Originally promoted from `banks/gemini-jun05-a.json` (58 q). On 2026-06-05, merged 100 q from `gemini-pending.json` (5 fixes), 30 q from `gemini-jun05-b.json` (user-reviewed), 100 q from `gemini-pending-b.json` (2 fixes), 100 q from `gemini-pending-c.json` (1 fix), 100 q from `gemini-pending-d.json` (10 fixes), and 100 q from traditional batches A-D. On 2026-06-05, performed a redundancy audit and pruned 18 redundant/flawed questions in total (2 from initial audit, 16 from second audit, including a transfusion reaction sequencing correction). |
| `banks/gpt-canonical.json` | GPT | 122 | 2026-06-05: valid | 2026-06-05 (Q98–Q122 delta) | `fixed-and-validated` | Previously tracked as 97 reviewed canonical questions. On 2026-06-05, Q98–Q122 (25-question delta) content-reviewed: all pass — no unsafe clinical claims, no calculation errors, no ambiguous keys, no contraindicated sequence steps, Chinese translations accurate. No fixes required. |
| `banks/hard-cases-canonical.json` | Codex/source-checked + Gemini reviewed | 29 | 2026-06-05: valid after `cs_ngn_*` cleanup | Original 19 top-level items ledgered on 2026-06-05; 10-case `cs_ngn_*` delta reviewed and cleaned up on 2026-06-05 | `fixed-and-validated` | Started as the schema v1.1 hard-case seed bank covering sepsis from pneumonia and preeclampsia with severe features/magnesium toxicity. On 2026-06-05, merged 17 reviewed schema-valid hard/NGN questions from `banks/Pending cases/gemini-ngn-25-2026-06-05.json` and `banks/Pending cases/gemini-complex-hard-2026-06-05.json`; excluded traditional A-D batches and rejected the noncanonical gap-fill file. Current filesystem state has 29 top-level items, including 10 `cs_ngn_*` case studies from `banks-raw/gemini-2026-06-05-hard-cases.json`; cleanup restored specific topic labels, replaced placeholder SATA distractors, replaced generic per-choice rationales, and tightened abusive-head-trauma/autonomic-dysreflexia wording. |

## Merged Source Batches

| Source file | Merged into | Questions | Merge date | Notes |
|---|---|---:|---|---|
| `banks/Pending cases/gemini-ngn-25-2026-06-05.json` | `banks/hard-cases-canonical.json` | 5 | 2026-06-05 | Deleted after merge. Review fixes included CKD lab-priority keying/rationale and COPD oxygen rationale refinement. |
| `banks/Pending cases/gemini-complex-hard-2026-06-05.json` | `banks/hard-cases-canonical.json` | 12 | 2026-06-05 | Deleted after merge. Review fixes included stale metadata count, DKA initial-fluid distractor, DKA insulin-calc timing, AMI lead localization, AMI medication caveats, pediatric dehydration wording, VAP oral-care guidance, and thyroid-storm distractor wording. |
| `banks/Pending cases/gemini-trad-batch-A-2026-06-05.json` | `banks/gemini-canonical.json` | 25 | 2026-06-05 | Deleted after merge. Consisted of 13 `trad_pa` and 12 `trad_ppt` questions. |
| `banks/Pending cases/gemini-trad-batch-B-2026-06-05.json` | `banks/gemini-canonical.json` | 25 | 2026-06-05 | Deleted after merge. Consisted of `trad_batchB` questions. |
| `banks/Pending cases/gemini-trad-batch-C-2026-06-05.json` | `banks/gemini-canonical.json` | 25 | 2026-06-05 | Deleted after merge. Consisted of `trad_batchC` questions. |
| `banks/Pending cases/gemini-trad-batch-D-2026-06-05.json` | `banks/gemini-canonical.json` | 25 | 2026-06-05 | Deleted after merge. Consisted of `trad_batchD` questions. |

## Unreviewed / Pending Banks

| Bank file | Source | Questions | Schema validation | Content review | Status | Notes |
|---|---:|---:|---|---|---|---|
| `banks/Pending cases/gemini-ngn-gap-fill-2026-06-05.json` | Gemini | 5 raw case studies | 2026-06-05: invalid (`questions must be an array`) | 2026-06-05 schema-shape review only | `rejected` | File declares `schemaVersion: "1.1"` but uses a noncanonical `caseStudies`/`type`/`answer` shape rather than the app's `meta.questions` schema. Not merged into `hard-cases-canonical.json`; would need a deliberate conversion and full content review before use. |

## Next Planned Review

- Next Gemini batch (if generated): will arrive as a new batch file; review before consolidation.
