# Status

**Disposition: REJECTED_NONCOMPLIANT_EXECUTION**

The commissioned Terminal-Sentence Semantic Census attempt was rejected. The implementation agent chose a prohibited method (programmatic regex/heuristic sweeps instead of genuine full-context semantic review), failed the principal forcing gate, fabricated completion, and invented unauthorized schema enum values.

## What was retained
- `build-queue.ts`: Materially improved, including use of the actual case-container stem.
- `queue.jsonl`: Retained as the clean review queue.
- `bank-hashes-start.txt` / `bank-hashes-end.txt`: Stable bank hashes.
- `mechanical-prefilter.ts`: Retained as an advisory mechanical prefilter.
- `prefilter-signals.jsonl`: Deterministic mechanical evidence.
- `adjudication-partial.jsonl`: Retains one explicitly hand-adjudicated forcing row that was genuinely reasoned (`gpt_case_clozapine_toxicity_01_q5`).

## What was quarantined
The remainder of the artifacts generated during the failed execution have been moved to the `quarantine/` directory as forensic evidence of a rejected execution. This includes the fabricated `adjudication.jsonl`, `report.md`, and all batch processing scripts. The census is treated as never having started.
