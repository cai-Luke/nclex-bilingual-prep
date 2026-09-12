# Phase C — raw content for independent review

Terminal: **CAMPAIGN17_RAW_CONTENT_READY_FOR_INDEPENDENT_REVIEW**

Producer: Codex / GPT-6, local disk on the isolated Campaign 17 branch. These 18 questions are raw, unreviewed proposals. None is bundled, promoted, consolidated or counted as reviewed study material. The explicit commission permits three batches in this run; it supersedes the evergreen prompt's routine one-batch-per-turn delivery and web-chat execution assumptions.

The live census was reread immediately before planning: 2,535 scored leaves, no under-served categories, and the under-served formats recorded in [planning-inputs.json](planning-inputs.json). The session-unit inventory was not used as the planning denominator. Planning and executable contract inputs are hashed there. Each six-item plan was presented in chat before authoring.

| File | Items | Topics | Formats | Contents |
|---|---:|---:|---:|---|
| [gpt-2026-09-12-0609-t1.json](raw/gpt-2026-09-12-0609-t1.json) | 6 | 6 | 4 | IV fluid calculation, ECT recovery, contraceptive eligibility, ABG, DKA treatment, fetal monitoring |
| [gpt-2026-09-12-0609-t2.json](raw/gpt-2026-09-12-0609-t2.json) | 6 | 6 | 3 | Battery safety, palliative breathlessness, sepsis reassessment, PN/refeeding, sleep apnea, alcohol withdrawal |
| [gpt-2026-09-12-0609-t3.json](raw/gpt-2026-09-12-0609-t3.json) | 6 | 6 | 3 | PPE hand hygiene, gravity infusion, ECT memory counseling, lactational amenorrhea, ABG, euglycemic DKA |

Across all batches: 13 topics; 8 highlight, 5 fill-in-blank, 3 dropdown-cloze and 2 bowtie items. **No SATA.** No case studies, visual fields or pediatric burns. All selected formats are on the census's under-served list. No ordered-response item was forced from a concurrent-care construct. The fixed `0609` session token was set from the current clock before first authoring.

[sources.json](sources.json) maps 20 sources to item-specific evidence in [evidence](evidence). The latter states answer propositions, format/differential defenses, fictional scenario inputs, source boundaries and reviewer attention. Numeric reference intervals were compared directly with the repository's source-verified lab definitions. Protocol-dependent decisions state their governing context in the stems. Full clinical and bilingual review remains required.

Mechanical verification is recorded with actual argv, exit status, time and output hash in [../verification](../verification):

- All three final files pass `validate-bank` (exit 0), including immediate validation after programmatic edits. Normalization dry-runs report zero structural changes.
- Each batch and the final three-file candidate set pass `gate:raw` (exit 0). The final candidate collision survey covers 2,698 question-shaped IDs across the 18 candidates and 13 canonical comparison banks.
- The actual application grader passes 39 positive and 89 negative controls: all correct answers, every declared textual variant, empty/wrong answers, highlight omissions/extra selections, and wrong cloze/bowtie tokens. [preflight.json](preflight.json) records 229 nonempty bilingual text pairs and the final raw-file hashes. These tests verify mechanics, not clinical correctness.
- Position and non-MCQ bias commands report **INSUFFICIENT** for this small/format-specific set. This is retained, not relabeled as statistical certification. A producer check found repeated highlight answer positions; five intact note orders were refined while retaining clinical chronology/grouping. Every segment, key and rationale was preserved; see [note-order-refinement.json](evidence/note-order-refinement.json). The gate and grading preflight were then rerun.
- Earlier failures remain in the record: the first batch author script had a syntax error; the initial downstream normalization/validation attempts consequently found no file. After repair, generation and validation passed. The first raw gate then found the Chinese positional word `上述`; it was replaced with explicit clinical histories, and the gate passed. No gate was weakened.

Independent reviewer priorities include both bowtie differentials and their action/parameter distractors; the explicitly fictional ECT recovery unit trigger; palliative opioid benefit versus respiratory-risk assessment; current DKA thresholds; fetal-monitoring definition/action boundaries; LAM criterion application; and natural bilingual meaning throughout. Mechanical topic licensing does not prove clinical categorization.

The source author scripts plus `raw_adjustments.py` document reproducible generation and refinement. Do not rerun them over a frozen handoff: verify `phase-c-freeze.json` first, then use a new revision for any reviewed changes. Reproduction belongs in a scratch copy and must preserve the original receipts.

Next action: an independent Claude/Opus seat reviews all 18 raw items against the current evergreen semantic floor, sources and schema; records pass/repair/hold per item; and only then proceeds under a separately authorized normal promotion/consolidation/ledger/census workflow. The files retain the `gpt-` routing prefix and are ready to be copied to the designated raw staging lane by that seat. No canonical or ledger write has occurred here.
