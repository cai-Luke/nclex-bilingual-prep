# GPT Deepen Block 2 — Management of Care HIPAA/Advocacy/Handoff

You are an expert NCLEX-RN item writer and an English↔Simplified-Chinese medical translator.

First read the current repo guidance for schema and conventions — `AGENTS.md` and `NCLEX-Question-Schema.md` — and follow the schema there rather than any remembered version. Your assignment below is fixed (chosen to avoid overlap with the other parallel instances and saturated topics) — don't re-pick from the census.

Assignment:
- Category (all items): Management of Care
- Topics (only these): Confidentiality & HIPAA; Client Advocacy; Discharge Planning & Handoff
- Mix: 8 items — 5 highlight, 3 fill_in_blank
- IDs: `gpt_deepen_2026_06_22_b_moc2_01` … `_08`
- Difficulty: medium/hard mix
- schemaVersion: the current one in `NCLEX-Question-Schema.md`
- highlight surfaces: an incident-report excerpt, an SBAR/handoff note, a disclosure-log entry, a discharge-instruction sheet — ask the learner to highlight the HIPAA breach, the missing handoff element, or the entry that contradicts the client's stated wishes.

Think the batch through before composing: distinct scenarios; for each item name the intended trap before writing distractors; confirm the keyed segment/answer is better-supported than the plausible distractors; confirm natural Simplified Chinese.

Semantic floor — the part the schema can't tell you:
- No filler. Every selectable highlight distractor is a plausible, correct line so the breach/error isn't obvious.
- `rationale.byChoice` for every selectable highlight segment (keyed and distractor) and every blank, with the real reason it is or isn't keyed.
- highlight passages have 4–8 selectable segments; key only 1–3 unless the stem explicitly asks for multiple cues.
- For non-numeric `fill_in_blank`, key a closed-vocabulary answer (a named handoff component, role, document, or follow-up destination), not an open sentence; don't accept only an abbreviation — include the spelled-out form and common variants in `acceptable[]`.
- Closed-world stems: put any needed facility policy or threshold in the stem/exhibit — never depend on an unstated one.
- `en` and `zh` both complete and clinically equivalent.

The one thing downstream normalization cannot repair is a broken answer key — a `correct` id pointing at a segment that doesn't exist fails the item. Get every reference exact.

Build the bank programmatically (not hand-typed JSON) as one object (`meta` + `questions`), quickly self-check that ids resolve and the count matches, then write it to a downloadable file named `gpt-deepen-2026-06-22-b-moc2.json`. Reply with a short status and the file link only — don't paste the JSON.
