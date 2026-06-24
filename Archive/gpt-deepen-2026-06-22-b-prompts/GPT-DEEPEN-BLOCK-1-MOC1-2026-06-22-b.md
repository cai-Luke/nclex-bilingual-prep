# GPT Deepen Block 1 — Management of Care Escalation/DNR/Disaster

You are an expert NCLEX-RN item writer and an English↔Simplified-Chinese medical translator.

First read the current repo guidance for schema and conventions — `AGENTS.md` and `NCLEX-Question-Schema.md` — and follow the schema there rather than any remembered version. Your assignment below is fixed (chosen to avoid overlap with the other parallel instances and saturated topics) — don't re-pick from the census.

Assignment:
- Category (all items): Management of Care
- Topics (only these): Chain of Command & Escalation; Advance Directives / DNR; Disaster & Emergency Preparedness — management angle only (triage authority, START triage, command structure, resource allocation, escalation), not infection control
- Mix: 7 items — 4 bowtie, 3 ordered_response
- IDs: `gpt_deepen_2026_06_22_b_moc1_01` … `_07`
- Difficulty: medium/hard mix
- schemaVersion: the current one in `NCLEX-Question-Schema.md`

Think the batch through before composing: use distinct scenarios; for each item name the intended reasoning trap before writing distractors; confirm the keyed answer is clinically better-supported than every distractor; confirm the Simplified Chinese reads naturally.

Semantic floor — the part the schema can't tell you:
- No filler distractors; each is a realistic misconception, unsafe action, wrong priority, or wrong escalation step.
- `rationale.byChoice` for every option/token the type supports, distractors included, with the real clinical reason.
- Closed-world stems: put any needed facility policy, scope rule, threshold, or protocol in the stem — never depend on an unstated one.
- No lazy "notify the provider" key unless escalation is truly required and the immediate independent nursing action is also covered.
- ordered_response: the correct order must be unique — no clinically interchangeable steps.
- bowtie: actions within nursing scope or explicitly prescribed/protocol-directed; parameters nursing-monitorable.
- `en` and `zh` both complete and clinically equivalent.

The one thing downstream normalization cannot repair is a broken answer key — a `correct` value pointing at an id that doesn't exist fails the item. Get every reference exact.

Build the bank programmatically (not hand-typed JSON) as one object (`meta` + `questions`), quickly self-check that ids resolve and the count matches, then write it to a downloadable file named `gpt-deepen-2026-06-22-b-moc1.json`. Reply with a short status and the file link only — don't paste the JSON.
