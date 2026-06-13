# Early-Bank Semantic Audit Campaign

Durable handoff for the campaign governed by `early-bank-semantic-audit-spec.md`
and `NCLEX_Audit_Spec.md`. Canonical banks remain read-only during proposal
sessions.

## Current State

- Phase: OpenAI currency pass paused at the producer-mismatch boundary; all
  High-provenance and all eligible Medium Claude/Gemini items are complete.
- Last completed pass: remaining Medium-provenance Claude anticoagulation and
  discharge-planning review on 2026-06-13.
- Command: `npm run audit:early-bank-semantic`
- Regression: `npm run test:early-bank-semantic`
- Queue: `audit/early-bank-semantic/layer-a-queue.jsonl`
- Summary: `audit/early-bank-semantic/layer-a-summary.json`
- Canonical edits: none.

## Scope Reconciliation

The four current text banks contain 1,163 top-level items and 482 embedded
case-study parts, for 1,645 inventory records. The audit spec's 1,608 figure
and the campaign's earlier baselines are stale against the current 2026-06-13
bank state. Layer A preserves both case-study containers and embedded parts so
paths and coverage remain explicit.

## Layer A Baseline

- Inventory records: 1,645
- High provenance: 803
- Medium provenance: 583
- Low provenance: 259
- Queue rows: 1,301
- Unique queued IDs: 1,127
- Currency rows: 271
- Coherence rows: 1,030

Currency rows by cluster:

| Cluster | All tiers | High provenance |
|---|---:|---:|
| Immunization / screening | 65 | 20 |
| Isolation / precautions | 61 | 45 |
| Anticoagulation | 51 | 22 |
| DKA / insulin | 27 | 16 |
| Sepsis | 19 | 3 |
| Stroke | 23 | 8 |
| Burn / Parkland | 17 | 11 |
| BP targets | 5 | 4 |
| ACLS | 3 | 0 |

Layer A is routing only. Keyword matches, similarity pairs, and redundancy
groups are not findings, clinical judgments, or action recommendations.

## Session Ledger

| Session | Track | Scope | Status | Report | Manifest |
|---|---|---|---|---|---|
| Layer A | deterministic | Four text banks | complete | summary JSON | queue JSONL |
| 2026-06-13-Currency-01 | currency / OG | High-provenance immunization and screening, 20 IDs | complete: 4 FIX, 16 no finding | `currency/01-immunization-screening.report.md` | `currency/01-immunization-screening.manifest.jsonl` |
| 2026-06-13-Currency-02 | currency / OG | High-provenance isolation and precautions, 45 IDs | complete: 10 FIX, 35 no finding | `currency/02-isolation-precautions.report.md` | `currency/02-isolation-precautions.manifest.jsonl` |
| 2026-06-13-Currency-03 | currency / OG | High-provenance anticoagulation (22) plus DKA/insulin (16), 38 IDs | complete: 7 FIX, 31 no finding | `currency/03-anticoagulation-dka-insulin.report.md` | `currency/03-anticoagulation-dka-insulin.manifest.jsonl` |
| 2026-06-13-Currency-04 | currency / OG | Remaining High-provenance clusters: sepsis (3), stroke (8), burn/Parkland (11), BP targets (4), ACLS (0); 26 IDs | complete: 8 FIX, 18 no finding | `currency/04-remaining-high-harm.report.md` | `currency/04-remaining-high-harm.manifest.jsonl` |
| 2026-06-13-Currency-05 | currency / OG | Medium-provenance Claude/Gemini non-GPT slice, 8 IDs | complete: 2 FIX, 6 no finding | `currency/05-medium-claude-high-harm.report.md` | `currency/05-medium-claude-high-harm.manifest.jsonl` |
| 2026-06-13-Currency-06 | currency / OG | Remaining eligible Medium-provenance Claude case parts, 4 IDs | complete: 0 FIX, 4 no finding | `currency/06-medium-opus-anticoagulation.report.md` | empty action manifest |

## Session 01 Result

- Reviewing model: OpenAI GPT-5.4; producer mismatch satisfied for the
  Gemini-provenance batch.
- Four HIGH-confidence `OG` cures proposed:
  - `gemini_c5_09`: correct age/risk conditions for BP and STI screening.
  - `gemini_c5_04`: replace overnight-only colonoscopy preparation with a
    split-dose sequence.
  - `trad_batchD_04`: remove universal 24-hour clear-liquid and 6–8-hour
    complete-NPO rules.
  - `gemini_p3_03`: replace 24–48-hour clear-liquid preparation and blanket
    fasting language with current diet/split-dose guidance.
- Sources: USPSTF hypertension and chlamydia/gonorrhea recommendations, CDC
  STI screening recommendations, 2025 U.S. Multi-Society Task Force bowel
  preparation guidance, and ASA fasting guidance.
- Review Console: all four actioned IDs resolved and rendered with bilingual
  evidence and answer reveal.
- Manifest validation: 4 rows, 46 exact field edits; every English edit has a
  Chinese pair and every `before` value matches canonical JSON.
- Canonical edits: none.

## Session 02 Result

- Reviewing model: OpenAI GPT-5.4; producer mismatch satisfied for the
  Gemini-provenance batch.
- Ten HIGH-confidence `OG` cures proposed:
  - Correct varicella from Airborne-only to Airborne plus Contact.
  - Replace universal C. difficile soap/bleach mandates with
    outbreak-sensitive hand-hygiene wording and facility-approved sporicidal
    disinfection.
  - Replace obsolete droplet-distance mask rules with mask-on-entry source
    control.
  - Reorder suspected bacterial meningitis care so antibiotics are not
    delayed for lumbar puncture.
  - Replace antibacterial-soap and categorical fresh-produce neutropenia
    advice with ordinary handwashing and current food-safety guidance.
  - Remove the implication that ANC below 500 automatically requires a CDC
    Protective Environment.
- Sources: CDC Transmission-Based Precautions and Isolation Appendix A,
  CDC CDI training, CDC chickenpox guidance, CDC Protective Environment
  guidance, NCI infection/neutropenia and chemotherapy guidance, Oncology
  Nursing Society infection-prevention guidance, WHO meningitis guidance,
  NICE NG240, and the NCI ANC definition.
- Review Console: all ten actioned IDs resolved and rendered with bilingual
  evidence and answer reveal.
- Manifest validation: 10 rows, 86 exact field edits; every English edit has
  a Chinese pair and every `before` value matches canonical JSON.
- Canonical edits: none.

## Session 03 Result

- Reviewing model: OpenAI GPT-5.4; producer mismatch satisfied for the
  Gemini-provenance batch.
- Seven HIGH-confidence `OG` cures proposed:
  - Replace a nonexistent cirrhosis/paracentesis INR cutoff with the
    source-supported fibrinogen threshold.
  - Add active major bleeding to a warfarin-reversal item that otherwise
    makes vitamin K routine for INR 5.2.
  - Update the DKA insulin-hold potassium threshold from 3.3 to 3.5 mEq/L.
  - Remove the universal claim that regular insulin is the only insulin that
    can be administered intravenously.
  - Distinguish reportable thrombocytopenia from a diagnosis of HIT.
  - Correct two DKA explanations so dextrose below 250 mg/dL is taught as
    preventing hypoglycemia while insulin continues, with potassium assessed
    before insulin.
- Sources: AASLD peri-procedural bleeding guidance, ASH anticoagulation and
  HIT guidance, FDA heparin and insulin-aspart labels, and the 2024
  international hyperglycemic-crisis consensus report.
- Review Console: all seven actioned IDs resolved and rendered with bilingual
  evidence and answer reveal.
- Manifest validation: 7 rows, 43 exact field edits; every English edit has a
  Chinese pair and every `before` value matches canonical JSON.
- Canonical edits: none.

## Session 04 Result

- Reviewing model: OpenAI GPT-5.4; producer mismatch satisfied for the
  Gemini-provenance batch.
- Eight HIGH-confidence `OG` cures proposed:
  - Update a 72-year-old septic-shock item to balanced crystalloid and the
    current age-specific initial MAP range of 60-65 mmHg.
  - Relabel three hypoperfusion findings so they prompt urgent evaluation
    without independently diagnosing sepsis or septic shock.
  - Correct four post-stroke dysphagia items that teach chin-down posture,
    thickened liquids, straw avoidance, or food placement as universal rules
    rather than individualized swallowing-plan interventions.
  - Preserve resistance training as an evidence-based hypertension
    intervention while narrowing an unsafe maximal-effort distractor.
  - Replace universal three-hour bed rest after first-dose enalapril with
    orthostatic-safety teaching and risk-based observation.
- Sources: 2026 Surviving Sepsis Campaign, Sepsis-3 criteria, 2026 AHA/ASA
  acute ischemic stroke guidance, ASHA adult dysphagia guidance, 2025
  AHA/ACC high-blood-pressure guidance, and FDA Vasotec labeling.
- The eight traditional Parkland calculations were retained because each
  explicitly names the `4 mL/kg/%TBSA` formula, satisfying the established
  project wording rule despite newer ABA starting-volume guidance.
- Review Console: all eight actioned IDs resolved and rendered with bilingual
  evidence and answer reveal.
- Manifest validation: 8 rows, 82 exact field edits; every English edit has a
  Chinese pair and every `before` value matches canonical JSON.
- High-provenance currency total: 129 unique IDs audited across four sessions,
  with 29 FIX proposals and 100 no-finding dispositions.
- Canonical edits: none.

## Session 05 Result

- Reviewing model: OpenAI GPT-5.4; producer mismatch satisfied for the five
  Claude and three Gemini items.
- Two HIGH-confidence `OG` cures proposed:
  - Make traditional posterior hip precautions conditional on the surgeon's
    individualized postoperative orders rather than automatic after every
    posterior-approach replacement.
  - Replace a universal metoprolol `pulse <60/min` hold rule with heart-rate
    and blood-pressure assessment against prescribed administration
    parameters.
- Six IDs produced no finding: current dabigatran teaching, pediatric
  influenza antipyretic safety, SLP dysphagia referral, BMI calculation,
  abdominal assessment order, and adult Rule-of-Nines TBSA.
- Sources: AAOS OrthoInfo, a 2024 posterior-THA precautions systematic review,
  current FDA Lopressor and Pradaxa labeling, CDC influenza guidance, and
  current dysphagia practice guidance.
- Review Console: both actioned IDs resolved and rendered with bilingual
  evidence and answer reveal.
- Manifest validation: 2 rows, 16 exact field edits; every English edit has a
  Chinese pair and every `before` value matches canonical JSON.
- Layer A was regenerated as the in-scope banks expanded during these
  sessions. The current baseline is 1,645 inventory records, 1,301 queue rows,
  and 1,127 unique queued IDs.
- Canonical edits: none.

## Session 06 Result

- Reviewing model: OpenAI GPT-5.4; producer mismatch satisfied for four
  Claude-produced case-study parts.
- No finding met the action threshold. The items correctly handle failed
  teach-back, qualified language support, multidisciplinary discharge
  planning, rivaroxaban safety, and C. difficile Contact Precautions.
- Current FDA labeling supports rivaroxaban 10 mg once daily for 35 days after
  hip replacement and permits the 10 mg dose with or without food. The case
  appropriately requires reporting and handoff of the renal trend rather than
  independent nursing discontinuation.
- Sources: 2025 FDA Xarelto labeling, HHS Section 1557 language-access
  provisions, AHRQ teach-back guidance, CMS discharge-planning guidance, and
  current CDC C. difficile and hand-hygiene guidance.
- Manifest validation: zero action rows. Review Console inspection was not
  required because no patch or cut is proposed.
- Canonical edits: none.

## Next Turn

1. Do not continue the Medium currency track with the current OpenAI reviewer.
   The 68 remaining unique IDs are 38 GPT-produced and 30 mixed-producer.
2. Route the 38 GPT IDs to Gemini or another non-OpenAI reviewer with web
   access.
3. Resolve the actual producer of the 30 mixed hard-case IDs from source
   history before assigning them, or use a reviewer known not to have
   contributed to any of them.
4. Alternatively, begin the coherence track only after confirming its queued
   candidates also satisfy producer != checker.

## Completion Rules

- Reports and manifests are proposals only.
- Every OG action needs verbatim bank evidence and a current authoritative
  source; otherwise use `REVIEW`.
- Every proposed cure must update English and Chinese together.
- Do not apply canonical edits until Luke approves a manifest.
