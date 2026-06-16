# Topic Vocabulary — Decision Worksheet

Companion to `TOPIC-VOCABULARY-HYGIENE-SPEC.md`. This is Luke's mark-up sheet, not an agent artifact.

## What this is

The **candidate canonical set**, reconciled from `scripts/standardize-topics.ts` and
`scripts/cleanup-topic-metadata.ts` — which turned out to define the *same* ~45 strings, so there is
almost nothing to reconcile. Your job here is two binary-ish passes, not authoring:

1. **Confirm or rename** each topic (default = keep the name as-is).
2. **Class**: mark each `STRICT` (one category only) or `SHARED` (allowed under listed categories).
   This drives the Phase 3 topic×category licensing in the spec.

This set is a *candidate*, not proven-exhaustive. The Layer 3 migration dry-run is what proves
coverage: any live topic that doesn't map to one of these lands on the unresolved list, which is how
you'll discover a genuinely missing topic. **Alias and tail→canonical mappings are not decided here**
— they come from the dry-run report.

Legend: proposed class is a suggestion to accept or flip. Fill the **Call** column with `keep` /
a new name, and confirm or change the class.

## Management of Care

| Topic | Proposed class | Call |
|---|---|---|
| Prioritization & Delegation | STRICT | |
| Legal & Ethical Principles | STRICT | |
| Client Advocacy | STRICT | |
| Confidentiality & HIPAA | STRICT | |
| Discharge Planning & Handoff | STRICT — see judgment calls | |
| Conflict Resolution | STRICT | |

## Safety and Infection Control

| Topic | Proposed class | Call |
|---|---|---|
| Patient & Environment Safety | STRICT — see judgment calls | |
| Transmission-Based Precautions | STRICT | |
| Standard Precautions & Hygiene | STRICT | |
| PPE & Sterile Technique | STRICT | |
| Disaster & Emergency Preparedness | STRICT | |

## Health Promotion and Maintenance

| Topic | Proposed class | Call |
|---|---|---|
| Maternal-Newborn Care & Teaching | STRICT | |
| Pediatric & Adolescent Health | STRICT | |
| Pediatric & Toddler Safety | STRICT | |
| Adult Health & Wellness | STRICT | |
| Reproductive & Endocrine Health | STRICT | |
| Chronic Disease Management & Lifestyle | STRICT | |

## Psychosocial Integrity

| Topic | Proposed class | Call |
|---|---|---|
| Therapeutic Communication | STRICT — see judgment calls | |
| Mental Health Disorders | STRICT | |
| Substance Use & Withdrawal | STRICT | |
| Suicide & Crisis Intervention | STRICT | |
| Electroconvulsive Therapy (ECT) | STRICT | |

## Basic Care and Comfort

| Topic | Proposed class | Call |
|---|---|---|
| Nutritional & Fluid Support | STRICT | |
| Mobility & Immobility | STRICT | |
| Elimination & Comfort | STRICT | |
| Sleep & Rest | STRICT | |
| Palliative & Supportive Care | SHARED? — see judgment calls | |

## Pharmacological and Parenteral Therapies

| Topic | Proposed class | Call |
|---|---|---|
| Dosage Calculations | STRICT | |
| Medication Safety & Admin | SHARED? — see judgment calls | |
| Anticoagulant Therapy | STRICT | |
| Cardiovascular & Endocrine Medications | STRICT | |
| Psychotropic Medications | STRICT | |
| Parenteral Nutrition | STRICT | |

## Reduction of Risk Potential

| Topic | Proposed class | Call |
|---|---|---|
| Laboratory & Diagnostic Tests | SHARED? — see judgment calls | |
| ABG & Acid-Base Interpretation | STRICT | |
| Perioperative Care | STRICT | |
| Procedural Complications & Dialysis | STRICT | |

## Physiological Adaptation

| Topic | Proposed class | Call |
|---|---|---|
| Cardiovascular Disorders | STRICT | |
| Respiratory & Infectious Disorders | STRICT | |
| Renal & Gastrointestinal Disorders | STRICT | |
| Endocrine & Neurological Disorders | STRICT | |
| Electrolyte Imbalances | STRICT | |
| Diabetic Ketoacidosis (DKA) | STRICT | |
| Sepsis & Septic Shock | STRICT | |
| Burn Management | STRICT | |

## Judgment calls (the only ones that aren't near-automatic)

These are the topics where a single clinical concept legitimately spans categories. Decide STRICT
(force one category) or SHARED (list the allowed categories). Defaulting them STRICT risks false
failures in Phase 3; defaulting SHARED loosens the gate.

1. **Medication Safety & Admin** — proposed SHARED `[Pharmacological, Safety and Infection Control]`.
   High-alert med safety surfaces under Safety; admin/effects under Pharmacological.
2. **Laboratory & Diagnostic Tests** — proposed SHARED `[Reduction of Risk Potential, Pharmacological]`.
   Drug-level labs (INR, lithium, vancomycin trough) are keyed here from pharm items.
3. **Palliative & Supportive Care** — proposed SHARED `[Basic Care and Comfort, Pharmacological]`?
   Pain comfort vs analgesic management. Or keep pain *meds* under Medication Safety and make this STRICT.
4. **Discharge Planning & Handoff** — proposed STRICT `Management of Care`. Discharge *teaching* should
   route to Chronic Disease Management & Lifestyle, not here. Confirm the split.
5. **Patient & Environment Safety** — proposed STRICT `Safety and Infection Control`. Falls/safety
   teaching in Health Promotion items would then need a different topic. Confirm.
6. **Therapeutic Communication** — proposed STRICT `Psychosocial Integrity`. Interpreter/handoff
   communication in MoC items would route elsewhere. Confirm.

## Open structural questions (optional, for next chat)

- Is the ~45-topic granularity right, or too coarse/fine anywhere? (e.g. should rhythm-strip / EKG
  content have its own topic, or stay under Cardiovascular Disorders?)
- Any canonical topic with near-zero live items that should be dropped, or any tail cluster big enough
  to deserve promotion to canonical? — answerable from the migration dry-run, not guessable here.
