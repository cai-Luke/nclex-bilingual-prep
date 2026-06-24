# GPT Deepen — Self-Contained Parallel Blocks (round 3, 2026-06-22-b)

**Trusted-agent version.** Composition is left to the model, schema to the repo, promotion to the pipeline. Each block is a complete prompt: copy ONE block, paste into ONE GPT instance (which has GitHub read access to the repo), let it reason, then drop the downloaded `.json` file into `banks/banks-raw/`. Run all four in parallel.

What changed from the guardrail-heavy revision, and why: per-format shape rules are gone — `NCLEX-Question-Schema.md` documents them, the instances read it, and minimal prompts have already produced schema-valid content, so restating shape just bought brittleness. What stays inline is the semantic floor the schema can't infer, plus one sentence about answer-key references (the only thing downstream normalization cannot repair). This is a deliberate experiment: if the schema-error rate rises, the shape lines are a cheap re-add — but the bet is that content quality and scenario diversity improve more than schema errors cost, and schema errors are the cheaper failure to fix.

Note on capability: these instances read the repo but cannot run `npm run validate-bank` or write to disk (no runnable checkout; disk-write was a bust). So the blocks ask for a downloadable file and an in-chat self-check, not an executed validation. The real gate is your pipeline after the file lands.

Targeting from `census.json` (2026-06-22T22:11Z, SHA 1b9594b) `PRIORITIZE_TOPICS`. Big gaps: Management of Care −53, then Pharmacological −17 and Reduction of Risk −8; bowtie −103 and highlight −98 by format. Assignments below are fixed to avoid cross-instance overlap and the saturated topics (Cardiovascular Disorders, Mental Health Disorders, Medication Safety & Admin, Prioritization & Delegation, Legal & Ethical, Transmission-Based Precautions). IDs carry `_b_` so they can't collide with the earlier `gpt_deepen_2026_06_22_*` items.

| Block | Category | Topics | Formats | n | File |
|------|----------|--------|---------|---|------|
| 1 | Management of Care | Chain of Command & Escalation · Advance Directives / DNR · Disaster & Emergency Preparedness | bowtie ×4, ordered_response ×3 | 7 | `gpt-deepen-2026-06-22-b-moc1.json` |
| 2 | Management of Care | Confidentiality & HIPAA · Client Advocacy · Discharge Planning & Handoff | highlight ×5, fill_in_blank ×3 | 8 | `gpt-deepen-2026-06-22-b-moc2.json` |
| 3 | Pharmacological and Parenteral Therapies | Anticoagulant Therapy · Cardiovascular & Endocrine Medications | ordered_response ×3, fill_in_blank ×2, dropdown_cloze ×2 | 7 | `gpt-deepen-2026-06-22-b-pharm.json` |
| 4 | Reduction of Risk Potential | Procedural Complications & Dialysis · Laboratory & Diagnostic Tests · Perioperative Care | highlight ×4, bowtie ×3 | 7 | `gpt-deepen-2026-06-22-b-rrp.json` |

If a file comes back truncated or short on count, drop that block to 5–6 items rather than thinning the per-distractor rationale.

---

===== BLOCK 1 — COPY FROM HERE =====

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

===== BLOCK 1 — COPY TO HERE =====

---

===== BLOCK 2 — COPY FROM HERE =====

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

===== BLOCK 2 — COPY TO HERE =====

---

===== BLOCK 3 — COPY FROM HERE =====

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

===== BLOCK 3 — COPY TO HERE =====

---

===== BLOCK 4 — COPY FROM HERE =====

You are an expert NCLEX-RN item writer and an English↔Simplified-Chinese medical translator.

First read the current repo guidance for schema and conventions — `AGENTS.md` and `NCLEX-Question-Schema.md` — and follow the schema there rather than any remembered version. Your assignment below is fixed (chosen to avoid overlap with the other parallel instances and saturated topics) — don't re-pick from the census.

Assignment:
- Category (all items): Reduction of Risk Potential
- Topics (only these): Procedural Complications & Dialysis; Laboratory & Diagnostic Tests; Perioperative Care
- Mix: 7 items — 4 highlight, 3 bowtie
- IDs: `gpt_deepen_2026_06_22_b_rrp_01` … `_07`
- Difficulty: medium/hard mix
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

===== BLOCK 4 — COPY TO HERE =====
