# Unresolved Topic Handoff — Residual Rerun

Date: 2026-06-18

Scope: the two rows still unresolved after the consolidated residual rerun, Luke-approved wound sharing, and Luke-approved `Transfusion & Blood Products` topic addition.

Do not write canonical banks from this handoff. The goal is a researched recommendation for the next exact dry-run adjustment.

## Current Dry-Run State

Source packet:

- `audit/residual-rerun-2026-06-18.dry-run.md`
- `audit/residual-rerun-2026-06-18.manifest.json`
- `audit/residual-rerun-2026-06-18.decisions.json`

Summary after review corrections:

- total rows: 237
- proposed: 170
- carried-forward: 65
- vocabulary gaps: 0
- unresolved: 2
- category-and-topic proposals: 66

Unresolved IDs:

- `gpt_case_premium_next_case_occupational_exposure_vaccine_04_fib_supplies`
- `q9_2`

## Decision Question 1 — Vaccine Clinic Supply Calculation

ID: `gpt_case_premium_next_case_occupational_exposure_vaccine_04_fib_supplies`

Location:

- `banks/gpt-canonical.json`
- path: `questions.180.caseStudy.questions.4`
- parent: `gpt_case_premium_next_case_occupational_exposure_vaccine_04`

Current metadata:

- category: `Management of Care`
- topic: `resource management for vaccination clinic supplies`
- item type: `fill_in_blank`
- residual status: `unresolved`
- current licensed candidate set for Management of Care:
  - `Prioritization & Delegation`
  - `Legal & Ethical Principles`
  - `Client Advocacy`
  - `Confidentiality & HIPAA`
  - `Discharge Planning & Handoff`
  - `Conflict Resolution`
  - `Caregiver Role Strain & Family Coping`

Question stem:

```text
The next clinic is expected to administer 118 vaccines. Safety syringes are supplied in boxes of 50. What is the minimum number of full boxes needed? Enter a number only.
```

Correct answer: `3`

Rationale:

```text
Two boxes provide only 100 syringes, which is not enough for 118 vaccines. Three boxes provide 150 syringes, so 3 full boxes are needed.
```

Parent case context:

- parent category/topic: `Safety and Infection Control` / `occupational exposure and sharps safety`
- parent stem: a nurse coordinates infection-prevention follow-up after a sharps injury during a community vaccination clinic.
- sibling topics already resolved:
  - needlestick ordered response: `Standard Precautions & Hygiene`
  - sharps practice matrix: `PPE & Sterile Technique`
  - QI recommendation SATA: `Standard Precautions & Hygiene`
  - exposure-management cloze: `Standard Precautions & Hygiene`

Why it stayed unresolved:

The row is a supply-packaging/rounding calculation embedded in a sharps-safety case. `Management of Care` has no clean resource/supplies/logistics topic. Forcing it to `Prioritization & Delegation` would probably over-broaden that topic; moving it to `Pharmacological and Parenteral Therapies / Dosage Calculations` may be plausible because it is numeric, but it is not a dose, rate, time, or medication amount calculation.

Research task for chat:

1. Decide whether this row should:
   - stay `Management of Care` and create/share a topic such as `Resource Management & Supplies`, or
   - move to an existing topic, likely `Prioritization & Delegation`, `Patient & Environment Safety`, `Standard Precautions & Hygiene`, or `Dosage Calculations`, or
   - stay manually unresolved because it is an awkward standalone logistics calculation.
2. Use NCLEX Client Needs framing, not just surface words. Is supply acquisition for enough safety syringes best considered Management of Care resource allocation, infection-control safety infrastructure, or a calculation topic?
3. If proposing a new/shared topic, specify exact topic name and licensed categories.

Suggested starting hypothesis:

Keep category as `Management of Care`. If this pattern appears elsewhere, add a shared topic like `Resource Management & Supplies` under `Management of Care` and possibly `Safety and Infection Control`. If it is a one-off, leaving it unresolved may be better than creating a new topic for one row.

## Decision Question 2 — Serotonin Syndrome vs NMS Distinction

ID: `q9_2`

Location:

- `banks/hard-cases-canonical.json`
- path: `questions.26.caseStudy.questions.1`
- parent: `cs_ngn_009_serotonin`

Current metadata:

- category: `Pharmacological and Parenteral Therapies`
- topic: `SS vs NMS Distinction`
- item type: `multiple_choice`
- residual status: `unresolved`
- current licensed candidate set for Pharmacological and Parenteral Therapies:
  - `Dosage Calculations`
  - `Anticoagulant Therapy`
  - `Cardiovascular & Endocrine Medications`
  - `Psychotropic Medications`
  - `Parenteral Nutrition`
  - `Medication Safety & Admin`
  - `Laboratory & Diagnostic Tests`
  - `Transfusion & Blood Products`

Question stem:

```text
What is the hallmark physical exam difference between the two?
```

Options:

- A: `Pupils: Dilated in NMS, constricted in Serotonin`
- B: `Reflexes: Hyperreflexia in Serotonin, Hyporeflexia/Rigidity in NMS`
- C: `Fever: Only present in NMS`

Correct answer: B

Rationale:

```text
Neuromuscular hyperactivity (clonus/hyperreflexia) defines serotonin syndrome, while 'lead-pipe' rigidity defines NMS.
```

Parent case context:

- parent category/topic: `Pharmacological and Parenteral Therapies` / `Serotonin Syndrome vs. NMS`
- parent stem: differentiate and manage life-threatening drug reactions.
- sibling topics already resolved:
  - `q9_1`: `Medication Safety & Admin`
  - `q9_3`: `Medication Safety & Admin`
  - `q9_4`: `Medication Safety & Admin`
  - `q9_5`: still `Physiological Adaptation` / `NMS Renal Risk` in the current bank, parent pass pending

Why it stayed unresolved:

The item tests differential recognition of two medication-induced hyperthermic syndromes. Existing Pharmacological topics are either broad (`Medication Safety & Admin`, `Psychotropic Medications`) or unrelated. `Psychotropic Medications` is tempting because both conditions may arise from psychiatric medications, but serotonin syndrome and NMS are adverse drug syndromes rather than medication-class teaching. `Medication Safety & Admin` is broad but may be acceptable if no separate adverse-reaction topic is desired.

Research task for chat:

1. Decide whether this should resolve to:
   - `Medication Safety & Admin`
   - `Psychotropic Medications`
   - a new/shared topic such as `Adverse Drug Reactions & Toxicity`
   - a narrower new/shared topic such as `Serotonin Syndrome & Neuroleptic Malignant Syndrome`
2. Check whether other hyperthermic/toxicity rows in the bank would also use the proposed topic, including:
   - `q9_1` Serotonin Syndrome Recognition
   - `q9_3` NMS antidote
   - `q9_4` hyperthermic syndrome interventions
   - `vit_10` malignant hyperthermia after anesthetic exposure
   - other toxicity rows if found in the bank
3. If proposing a new/shared topic, specify exact topic name and licensed categories. Likely categories to consider: `Pharmacological and Parenteral Therapies`, `Physiological Adaptation`, and possibly `Safety and Infection Control`.

Suggested starting hypothesis:

If the goal is to avoid excessive topic growth, use `Medication Safety & Admin` for `q9_2` and keep the broader adverse-reaction/toxicity discussion for a later vocabulary pass. If the bank has enough toxicity/adverse-reaction rows, `Adverse Drug Reactions & Toxicity` may be cleaner than forcing all of them into medication administration.

## Expected Output From Chat Review

Please return a compact decision object for each unresolved ID:

```json
[
  {
    "id": "gpt_case_premium_next_case_occupational_exposure_vaccine_04_fib_supplies",
    "recommendation": "topic_only | category_and_topic | vocabulary_gap | leave_unresolved",
    "proposedCategory": "only if changing or confirming category",
    "proposedTopic": "canonical or proposed new topic",
    "topicLicensing": ["categories if proposing a new/shared topic"],
    "reason": "one concise evidence-backed sentence",
    "confidence": "high | medium | low"
  },
  {
    "id": "q9_2",
    "recommendation": "topic_only | category_and_topic | vocabulary_gap | leave_unresolved",
    "proposedCategory": "only if changing or confirming category",
    "proposedTopic": "canonical or proposed new topic",
    "topicLicensing": ["categories if proposing a new/shared topic"],
    "reason": "one concise evidence-backed sentence",
    "confidence": "high | medium | low"
  }
]
```

