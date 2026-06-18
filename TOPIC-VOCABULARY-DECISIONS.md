# Topic Vocabulary — Decision Worksheet

Companion to `Archive/root-specs-2026-06-18/TOPIC-VOCABULARY-HYGIENE-SPEC.md`.

## What this is

The canonical set, reconciled from `scripts/standardize-topics.ts` and
`scripts/cleanup-topic-metadata.ts` — which turned out to define the *same* ~45 strings, so there was
almost nothing to reconcile. Luke's final calls are recorded here:

1. **Confirm or rename** each topic (default = keep the name as-is).
2. **Class**: mark each `STRICT` (one category only) or `SHARED` (allowed under listed categories).
   This drives the Phase 3 topic×category licensing in the spec.

This set is canonical. Live-bank migration is conservative: **lexical aliases write** (each
category-license-checked); **semantic aliases and the gated LLM proposal pass only suggest** until
reviewed and approved into an execution manifest. See `Archive/root-specs-2026-06-18/TOPIC-VOCABULARY-HYGIENE-SPEC.md` Layer 3.

## Management of Care

| Topic | Proposed class | Call |
|---|---|---|
| Prioritization & Delegation | STRICT | keep; STRICT |
| Legal & Ethical Principles | STRICT | keep; STRICT |
| Client Advocacy | STRICT | keep; STRICT |
| Confidentiality & HIPAA | STRICT | keep; STRICT |
| Discharge Planning & Handoff | STRICT — see judgment calls | keep; STRICT |
| Conflict Resolution | STRICT | keep; STRICT |

## Safety and Infection Control

| Topic | Proposed class | Call |
|---|---|---|
| Patient & Environment Safety | STRICT — see judgment calls | keep; STRICT |
| Transmission-Based Precautions | STRICT | keep; STRICT |
| Standard Precautions & Hygiene | STRICT | keep; STRICT |
| PPE & Sterile Technique | STRICT | keep; STRICT |
| Disaster & Emergency Preparedness | STRICT | keep; STRICT |

## Health Promotion and Maintenance

| Topic | Proposed class | Call |
|---|---|---|
| Maternal-Newborn Care & Teaching | STRICT | keep; STRICT |
| Pediatric & Adolescent Health | STRICT | keep; STRICT |
| Pediatric & Toddler Safety | STRICT | keep; STRICT |
| Adult Health & Wellness | STRICT | keep; STRICT |
| Reproductive & Endocrine Health | STRICT | keep; STRICT |
| Chronic Disease Management & Lifestyle | STRICT | keep; STRICT |

## Psychosocial Integrity

| Topic | Proposed class | Call |
|---|---|---|
| Therapeutic Communication | STRICT — see judgment calls | keep; STRICT |
| Mental Health Disorders | STRICT | keep; STRICT |
| Substance Use & Withdrawal | STRICT | keep; STRICT |
| Suicide & Crisis Intervention | STRICT | keep; STRICT |
| Electroconvulsive Therapy (ECT) | STRICT | keep; STRICT |

## Basic Care and Comfort

| Topic | Proposed class | Call |
|---|---|---|
| Nutritional & Fluid Support | STRICT | keep; STRICT |
| Mobility & Immobility | STRICT | keep; STRICT |
| Elimination & Comfort | STRICT | keep; STRICT |
| Sleep & Rest | STRICT | keep; STRICT |
| Palliative & Supportive Care | SHARED? — see judgment calls | keep; STRICT Basic Care and Comfort |

## Pharmacological and Parenteral Therapies

| Topic | Proposed class | Call |
|---|---|---|
| Dosage Calculations | STRICT | keep; STRICT Pharmacological |
| Medication Safety & Admin | SHARED? — see judgment calls | keep; SHARED Pharmacological + Safety/Infection Control |
| Anticoagulant Therapy | STRICT | keep; STRICT |
| Cardiovascular & Endocrine Medications | STRICT | keep; STRICT |
| Psychotropic Medications | STRICT | keep; STRICT |
| Parenteral Nutrition | STRICT | keep; STRICT |

## Reduction of Risk Potential

| Topic | Proposed class | Call |
|---|---|---|
| Laboratory & Diagnostic Tests | SHARED? — see judgment calls | keep; SHARED Reduction of Risk Potential + Pharmacological |
| ABG & Acid-Base Interpretation | STRICT | keep; STRICT |
| Perioperative Care | STRICT | keep; STRICT |
| Procedural Complications & Dialysis | STRICT | keep; STRICT |

## Physiological Adaptation

| Topic | Proposed class | Call |
|---|---|---|
| Cardiovascular Disorders | STRICT | keep; STRICT |
| Respiratory & Infectious Disorders | STRICT | keep; STRICT |
| Renal & Gastrointestinal Disorders | STRICT | keep; STRICT |
| Endocrine & Neurological Disorders | STRICT | keep; STRICT |
| Electrolyte Imbalances | STRICT | keep; STRICT |
| Diabetic Ketoacidosis (DKA) | STRICT | keep; STRICT |
| Sepsis & Septic Shock | STRICT | keep; STRICT |
| Burn Management | STRICT | keep; STRICT |

## Judgment calls (the only ones that aren't near-automatic)

These were the topics where a single clinical concept legitimately spans categories. Final calls:

1. **Medication Safety & Admin** — SHARED `[Pharmacological, Safety and Infection Control]`.
   High-alert med safety surfaces under Safety; admin/effects under Pharmacological.
2. **Laboratory & Diagnostic Tests** — SHARED `[Reduction of Risk Potential, Pharmacological]`.
   Drug-level labs (INR, lithium, vancomycin trough) are keyed here from pharm items.
3. **Palliative & Supportive Care** — STRICT `Basic Care and Comfort`. Analgesic dosing/opioid
   safety/toxicity routes to Medication Safety & Admin; comfort/goals-of-care route here.
4. **Discharge Planning & Handoff** — STRICT `Management of Care`. Discharge teaching routes to the
   clinical topic, not here.
5. **Patient & Environment Safety** — STRICT `Safety and Infection Control`.
6. **Therapeutic Communication** — STRICT `Psychosocial Integrity`. Handoff/interpreter communication
   routes to Management of Care topics when that is the actual tested construct.
7. **Dosage Calculations** — STRICT `Pharmacological and Parenteral Therapies`. Classifier should
   reserve this for actual calculation/numeric dose work, not broad medication safety.

## Approved additions (locked)

Surfaced by the migration residual — a cluster with no clean canonical home. **Approved in the
walkthrough and wired into `src/topics.ts`.**

- **`Caregiver Role Strain & Family Coping`** — **approved; locked.** SHARED `[Psychosocial Integrity,
  Management of Care]` (the MoC side only for referrals, respite, discharge resources, home health,
  support groups, or care coordination). Its three aliases (`caregiver strain`, `caregiver burden and
  family adaptation`, `family coping after new chronic illness diagnosis`) sit in the **lexical** write
  tier. Named narrowly on purpose: **not** `Family Support` (which would vacuum every
  peds/OB/psych/hospice/chronic-illness/teaching item).
- **Grief routing (resolved, revised):** grief is a clinical context, not a stable topic by itself.
  Route grief items by the construct actually tested: grief-vs-depression assessment to **Mental
  Health Disorders**, therapeutic grief responses to **Therapeutic Communication**, and active
  self-harm or safety-crisis findings to **Suicide & Crisis Intervention**. The prior
  `grief and loss` / `grief communication` semantic aliases to Suicide & Crisis Intervention were
  removed because they overrode this construct-based routing.

## Review holds from Gemini semantic pass (Jun 16)

- `gemini_u5_fib_or_2026_06_09_fib_tbsa_04`: corrected category from Safety and Infection Control to
  Physiological Adaptation; topic resolves to **Burn Management**.
- `gemini_u5_fib_or_2026_06_09_fib_gcs_01`: **Laboratory & Diagnostic Tests** is a licensed
  Reduction of Risk Potential compromise for GCS scoring, but the fit is weak and should be reviewed
  if an assessment/monitoring topic is added later.
- `gemini_u5_fib_or_2026_06_09_or_trach_12`: **Procedural Complications & Dialysis** is a licensed
  Reduction of Risk Potential compromise for endotracheal suctioning steps; review if the RRP topic
  vocabulary gains a cleaner procedure/monitoring home.

## Residual rerun decisions (Jun 18)

- **Skin & Wound Care sharing:** share across Basic Care and Comfort, Reduction of Risk Potential,
  and Safety and Infection Control. The residual rerun produced eight wound/pressure-injury
  vocabulary-gap flags where moving rows to BCC solely to reach the topic would distort the tested
  Client Needs category.
- **Transfusion & Blood Products:** add a shared topic across Safety and Infection Control,
  Pharmacological and Parenteral Therapies, Reduction of Risk Potential, and Physiological
  Adaptation. Use it for transfusion reactions, blood-product indications, and product-role
  questions that otherwise scatter into cardiovascular, lab, or procedural catchalls.

## Open structural questions (optional, for next chat)

- Is the ~45-topic granularity right, or too coarse/fine anywhere? (e.g. should rhythm-strip / EKG
  content have its own topic, or stay under Cardiovascular Disorders?)
- Any canonical topic with near-zero live items that should be dropped, or any tail cluster big enough
  to deserve promotion to canonical? — answerable from the migration dry-run, not guessable here.
