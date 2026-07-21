# Authorial-Constraint Leakage Candidate Summary

Snapshot: `main` at `408a4706c5878bd0991c8baf88b5807bf0bb9091`, with 13 bundled banks, 1,942 top-level questions, and 2,528 scored leaves.

The configured deterministic baseline contains 4 occurrences in 1 item and 1 bank. Two occur on `TASK_STEM_OR_INSTRUCTION` surfaces and two on `TEST_TAKING_STRATEGY`: two English Family A direct scope constraints and their observed Chinese Family D counterparts. All four are confirmed authorial-constraint leaks and eligible for the narrow prospective blocker. No Family B or C candidates or ambiguous residuals were found by the configured baseline signatures.

Producer-prefix count: `gpt_` 4 occurrences. Language count: English 2, Simplified Chinese 2. Exact evidence and offsets are preserved in `baseline.jsonl`; adjudications and exact replacements are in `adjudication.jsonl`.

## Post-survey semantic residual

Architect review subsequently found a second affected item outside the configured signatures:
`gpt_format10c_occupational_sharps_hiv_pep_sequence`. Its “supplied actions” wording and final
separate-processes/do-not-delay sentence exposed an ordering adjudication and concealed a deeper
construct defect: source-patient testing and exposed-worker baseline testing/PEP initiation had been
forced into one serial action list. This is recorded in `post-survey-residuals.jsonl` and repaired as
`BLOCKED_ITEM_REWRITE`; independent review remains pending.

The survey is deterministic over its finite signatures, not exhaustive recall over all semantically
equivalent authorial/checker constructions.
