# GPT Deepen Block 4 — Reduction of Risk Procedures/Labs/Periop

You are an expert NCLEX-RN item writer and an English↔Simplified-Chinese medical translator.

First read the current repo guidance for schema and conventions — `AGENTS.md` and `NCLEX-Question-Schema.md` — and follow the schema there rather than any remembered version. Your assignment below is fixed (chosen to avoid overlap with the other parallel instances and saturated topics) — don't re-pick from the census.

Assignment:
- Category (all items): Reduction of Risk Potential
- Topics (only these): Procedural Complications & Dialysis; Laboratory & Diagnostic Tests; Perioperative Care
- Mix: 7 items — 4 highlight, 3 bowtie
- IDs: `gpt_deepen_2026_06_22_b_rrp_01` … `_07`
- Difficulty: medium/hard mix
- schemaVersion: the current one in `NCLEX-Question-Schema.md`
- highlight surfaces: a lab/diagnostic result panel (highlight the critical value or result requiring escalation), a pre-procedure/pre-op checklist (highlight the missing or unsafe step), a post-procedure note (highlight the complication cue). bowtie conditions: recognizing a procedure or dialysis complication (disequilibrium, access/air complication, post-op hemorrhage, compartment syndrome, contrast reaction).

Think the batch through before composing: distinct scenarios; name the intended trap before writing distractors; confirm the keyed answer is better-supported than the distractors; confirm natural Simplified Chinese.

Semantic floor — the part the schema can't tell you:
- No filler. Selectable highlight distractors are plausible normal/expected lines; bowtie distractor tokens are realistic wrong actions/parameters.
- `rationale.byChoice` for every selectable highlight segment (keyed and distractor) and every bowtie token, with the real clinical reason.
- highlight passages have 4–8 selectable segments; key only 1–3 unless the stem explicitly asks for multiple cues.
- No lazy "notify the provider" key unless escalation is truly required and the immediate independent nursing action is also covered.
- Closed-world stems: state critical-value thresholds or protocol triggers in the stem/exhibit; never depend on an unstated one.
- bowtie: actions within nursing scope or explicitly prescribed/protocol-directed; parameters nursing-monitorable.
- `en` and `zh` both complete and clinically equivalent.

The one thing downstream normalization cannot repair is a broken answer key — a `correct` value that doesn't resolve to a real segment or token fails the item. Get every reference exact.

Build the bank programmatically (not hand-typed JSON) as one object (`meta` + `questions`), quickly self-check that ids resolve and the count matches, then write it to a downloadable file named `gpt-deepen-2026-06-22-b-rrp.json`. Reply with a short status and the file link only — don't paste the JSON.
