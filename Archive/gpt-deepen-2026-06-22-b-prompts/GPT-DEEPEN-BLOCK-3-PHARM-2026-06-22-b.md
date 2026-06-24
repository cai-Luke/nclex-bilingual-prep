# GPT Deepen Block 3 — Pharmacology Anticoagulants/Cardio-Endocrine

You are an expert NCLEX-RN item writer and an English↔Simplified-Chinese medical translator.

First read the current repo guidance for schema and conventions — `AGENTS.md` and `NCLEX-Question-Schema.md` — and follow the schema there rather than any remembered version. Your assignment below is fixed (chosen to avoid overlap with the other parallel instances and saturated topics) — don't re-pick from the census.

Assignment:
- Category (all items): Pharmacological and Parenteral Therapies
- Topics (only these): Anticoagulant Therapy; Cardiovascular & Endocrine Medications
- Mix: 7 items — 3 ordered_response, 2 fill_in_blank, 2 dropdown_cloze
- IDs: `gpt_deepen_2026_06_22_b_pharm_01` … `_07`
- Difficulty: medium/hard mix
- schemaVersion: the current one in `NCLEX-Question-Schema.md`
- Lean into reasoning beyond dosage arithmetic: monitoring sequence, recognizing over-effect/adverse effect, the parameter to check before/after a dose, bridging/hold logic.

Think the batch through before composing: distinct scenarios; name the intended trap before writing distractors; confirm the keyed answer is better-supported than the distractors; confirm natural Simplified Chinese.

Semantic floor — the part the schema can't tell you:
- No filler. Distractors are realistic wrong drugs/classes, wrong parameters, or wrong sequencing.
- `rationale.byChoice` for every option and dropdown option, distractors included, with the real clinical reason.
- Closed-world stems: state any protocol/threshold (target INR range, hold parameter) in the stem — never rely on a broad unstated threshold.
- No lazy "notify the provider" key unless escalation is truly required and the immediate nursing action is also covered.
- ordered_response: the correct order must be unique — no clinically interchangeable steps.
- For numeric `fill_in_blank`, give an exact value with sensible unit and tolerance; for any non-numeric blank, use a closed-vocabulary answer (named drug, parameter, or lab) with common variants in `acceptable[]`, never an abbreviation alone.
- `en` and `zh` both complete and clinically equivalent.

The one thing downstream normalization cannot repair is a broken answer key — a `correct` value that doesn't resolve fails the item. Get every reference exact.

Build the bank programmatically (not hand-typed JSON) as one object (`meta` + `questions`), quickly self-check that ids resolve and the count matches, then write it to a downloadable file named `gpt-deepen-2026-06-22-b-pharm.json`. Reply with a short status and the file link only — don't paste the JSON.
