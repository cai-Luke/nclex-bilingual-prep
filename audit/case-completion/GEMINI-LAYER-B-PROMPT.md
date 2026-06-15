# Gemini Layer B — Case Completion Alignment

Use only the rows in `gemini-layer-b-queue.jsonl`. This is a capped classification task.

For each row:
1. Read the compiled case and every listed candidate skeleton.
2. Confirm exactly one skeleton match, or return `join_verdict: "unresolved"`.
3. If matched, align numbered skeleton decision points to emitted embedded items.
4. Return only missing decision points and whether any authored bowtie is a clean 1/2/2 source.
5. Do not rewrite JSON, edit skeleton prose, propose clinical cures, or mutate files.

Output one JSON object per input row:

```json
{"case_id":"...","join_verdict":"confirmed|rejected|unresolved","skeleton_path":"...|null","join_evidence":"brief","missing_dps":[{"dp_index":1,"dp_skill":"recognize_cues","dp_summary":"brief"}],"bowtie_source_valid":"yes|no|not_present","notes":"brief"}
```

Claude is the final reviewer. A Gemini confirmation is advisory and does not itself authorize promotion.
