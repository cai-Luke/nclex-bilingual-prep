# Non-MCQ Bias Audit Layer B Review

Review exactly 823 JSONL queue rows. Return JSONL only, one result per input row, in the same order.

For `case_inferability`, judge only whether the keyed answer is determinable from the single exhibit retained in `options_or_rows_en`. Do not use omitted exhibits or outside facts.

For `distractor_plausibility`, judge whether the displayed distractors/rows make the answer structurally obvious or implausibly easy. Layer A's statistical verdict is authoritative and must not be reconsidered.

For `rationale_semantic_review`, judge whether the rationale's positional wording can be replaced with content-based wording without changing the key. Do not perform the rewrite.

Required result schema:
```json
{"qid":"string","parent_qid":"string|null","layer_b_task":"case_inferability|distractor_plausibility|rationale_semantic_review","redaction_variant":"first_row_only|last_row_only|null","verdict":"PASS|FAIL|REVIEW","confidence":"high|medium|low","quoted_evidence":[{"location":"stem|option|row|exhibit|rationale","quote":"string"}],"reason":"string","recommended_fix_class":"MANUAL_REVIEW|REGENERATE|NONE"}
```

Rules:
- Do not rewrite items.
- Do not change answer keys.
- Do not invent missing evidence.
- Do not evaluate rows or exhibits absent from the queue row.
- Quote only exact text present in the queue row.
- A `FAIL` requires at least one grounded quote.
- Use `REVIEW` when evidence is ambiguous.
- Return no prose, Markdown, fences, headings, or commentary outside JSONL.
