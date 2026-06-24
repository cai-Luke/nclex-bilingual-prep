# GPT Deepen Batch — Instance Blocks (2026-06-22)

Paste exactly one of these into §3 of `GPT-DEEPEN-SHARED-SPEC-2026-06-22.md`.

---

## Instance 1 — MoC-tail process · highlight + ordered_response

You are Instance 1. Execute only this assignment.

- ID prefix: `gpt_deepen_2026_06_22_moc_`
- File: `gpt-deepen-2026-06-22-moc.json`
- Category for all items: `Management of Care`
- Target: about 12 items
- Formats: about 7 `highlight`, about 5 `ordered_response`
- Topics:
  - `Confidentiality & HIPAA`
  - `Conflict Resolution`
  - `Client Advocacy`
  - `Discharge Planning & Handoff`

Useful surfaces:

- incident-report excerpt
- SBAR/handoff note
- discharge-instruction sheet
- disclosure-log entry

For `highlight`, use chart/note lines. Ask the learner to highlight the HIPAA breach, missing handoff element, or entry that contradicts the client’s stated wishes.

For `ordered_response`, sequence a disclosure-response workflow, discharge-readiness workflow, handoff workflow, or conflict-resolution escalation.

Turn anchor:

```text
prefix gpt_deepen_2026_06_22_moc_ · topics Confidentiality & HIPAA, Conflict Resolution, Client Advocacy, Discharge Planning & Handoff · formats highlight, ordered_response
```

---

## Instance 2 — MoC escalation & emergency · bowtie + ordered_response

You are Instance 2. Execute only this assignment.

- ID prefix: `gpt_deepen_2026_06_22_esc_`
- File: `gpt-deepen-2026-06-22-esc.json`
- Category for all items: `Management of Care`
- Target: about 10 items
- Formats: about 6 `bowtie`, about 4 `ordered_response`
- Topics:
  - `Chain of Command & Escalation`
  - `Disaster & Emergency Preparedness`
  - `Advance Directives / DNR`

Bowtie framing for this process category:

- `condition`: recognize the situation, such as a deteriorating client needing escalation, a mass-casualty triage scene, or a code-status/order conflict.
- `actions`: escalation or command steps in nursing scope, such as activating rapid response, applying START triage, or verifying the documented directive before acting.
- `parameters`: what to report, reassess, or monitor up the chain.

For `ordered_response`, sequence escalation, triage, decontamination, or advance-directive workflows.

Turn anchor:

```text
prefix gpt_deepen_2026_06_22_esc_ · topics Chain of Command & Escalation, Disaster & Emergency Preparedness, Advance Directives / DNR · formats bowtie, ordered_response
```

---

## Instance 3 — Pharmacological bowtie · bowtie + dropdown_cloze

You are Instance 3. Execute only this assignment.

- ID prefix: `gpt_deepen_2026_06_22_bow_`
- File: `gpt-deepen-2026-06-22-bow.json`
- Category for all items: `Pharmacological and Parenteral Therapies`
- Target: about 12 items
- Formats: about 8 `bowtie`, about 4 `dropdown_cloze`
- Topics:
  - `Anticoagulant Therapy`
  - `Cardiovascular & Endocrine Medications`
  - `Psychotropic Medications`
  - `Parenteral Nutrition`

Bowtie focus:

- anticoagulant over-effect
- clozapine toxicity
- lithium toxicity
- insulin error
- endocrine-med adverse effect
- refeeding risk or TPN complication

Keep bowtie `condition` as a toxicity, adverse effect, or complication. Actions must be nursing-scope or explicitly prescribed/protocol-directed. Parameters must be nursing-monitorable.

Use `dropdown_cloze` for concise cardiovascular/endocrine medication reasoning.

Turn anchor:

```text
prefix gpt_deepen_2026_06_22_bow_ · topics Anticoagulant Therapy, Cardiovascular & Endocrine Medications, Psychotropic Medications, Parenteral Nutrition · formats bowtie, dropdown_cloze
```

---

## Instance 4 — Safety & Infection Control non-saturated · highlight + ordered_response + bowtie

You are Instance 4. Execute only this assignment.

- ID prefix: `gpt_deepen_2026_06_22_sic_`
- File: `gpt-deepen-2026-06-22-sic.json`
- Category for all items: `Safety and Infection Control`
- Target: about 8 items
- Formats: about 4 `highlight`, about 2 `ordered_response`, about 2 `bowtie`
- Topics:
  - `PPE & Sterile Technique`
  - `Standard Precautions & Hygiene`
  - `Fall prevention`
  - `Environmental safety and equipment checks`

Do not write `Transmission-Based Precautions` or `Patient & Environment Safety`.

For `highlight`, use a procedure note or environment checklist and ask the learner to identify the breach.

For `ordered_response`, use PPE doffing, sterile-field setup, post-fall response, or equipment-safety workflow.

For `bowtie`, use sterile-technique breach recognition or equipment-hazard recognition as the condition, with immediate nursing actions and monitoring/reporting parameters.

Turn anchor:

```text
prefix gpt_deepen_2026_06_22_sic_ · topics PPE & Sterile Technique, Standard Precautions & Hygiene, Fall prevention, Environmental safety and equipment checks · formats highlight, ordered_response, bowtie
```
