# Early-Bank Semantic Audit Campaign

Durable handoff for the campaign governed by `early-bank-semantic-audit-spec.md`
and `NCLEX_Audit_Spec.md`. Canonical banks remain read-only during proposal
sessions.

## Current State

- Phase: Phase A coherence pilot closed; proceed to Phase B coherence in
  bounded, provenance-split batches. Currency remainder is closed.
- Last completed pass: Phase A coherence pilot closeout and polish patch,
  2026-06-25.
- Return package: `audit/early-bank-semantic/CLAUDE-RETURN-INDEX.md`
- Command: `npm run audit:early-bank-semantic`
- Regression: `npm run test:early-bank-semantic`
- Queue: `audit/early-bank-semantic/layer-a-queue.jsonl`
- Summary: `audit/early-bank-semantic/layer-a-summary.json`
- Canonical edits: 2026-06-25 Phase A coherence-polish patch applied two
  minor, key-preserving fixes in `banks/gemini-canonical.json`:
  `gemini_c9_01` EN/ZH rationale option letter B->A and `gap_50_sic_03` ZH
  `流液`->`流感`.
- Layer A baseline regenerated after the concurrent bank additions; Phase A
  used `coherence/2026-06-24.slice.json`.

## Scope Reconciliation

The four current text banks contain 1,652 top-level and embedded inventory
records. The audit spec's 1,608 figure
and the campaign's earlier baselines are stale against the current 2026-06-13
bank state. Layer A preserves both case-study containers and embedded parts so
paths and coverage remain explicit.

## Layer A Baseline

- Inventory records: 1,692
- High provenance: 803
- Medium provenance: 624
- Low provenance: 265
- Queue rows: 1,312
- Unique queued IDs: 1,136
- Currency rows: 273
- Coherence rows: 1,039

Currency rows by cluster:

| Cluster | All tiers | High provenance |
|---|---:|---:|
| Immunization / screening | 66 | 20 |
| Isolation / precautions | 63 | 45 |
| Anticoagulation | 50 | 22 |
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
| 2026-06-13-Currency-07 | currency / OG | Medium-provenance GPT: immunization_screening (11) + isolation_precautions (12), 23 IDs | complete: 0 FIX, 2 REVIEW, 21 no finding | `currency/07-medium-gpt-screening-isolation.report.md` | `currency/07-medium-gpt-screening-isolation.manifest.jsonl` |
| 2026-06-13-Currency-08 | currency / OG | Medium-provenance GPT: anticoagulation (5), dka_insulin (2), sepsis (1), stroke (4), burn_parkland (3), 15 IDs | complete: 0 FIX, 0 REVIEW, 15 no finding | `currency/08-medium-gpt-medication-resuscitation.report.md` | `currency/08-medium-gpt-medication-resuscitation.manifest.jsonl` (empty) |
| Phase B | provenance mapping | 30 mixed hard-case IDs from Layer A currency queue | complete: 0 claude_eligible — all blocked (17 BLOCKED_PRODUCER_CONFLICT, 13 BLOCKED_PROVENANCE_UNKNOWN) | — | `currency/09-mixed-provenance-map.jsonl` |
| 2026-06-13-Currency-10 | currency / OG adjudication | Two Session 07 REVIEW findings plus provenance check for 13 unknown hard-case rows | complete: 1 FIX, 1 dismissed, 13 remain blocked | `currency/10-claude-return-adjudication.report.md` | `currency/10-claude-return-adjudication.manifest.jsonl` |
| 2026-06-13-Currency-11 | currency / OG human adjudication | 13 provenance-unknown hard-case records | complete: 13 retain as-is, 0 actioned | `currency/11-gemini-13-human-adjudication.report.md` | none |
| 2026-06-13-Currency-12 | approved execution | Sessions 01-05 and 10: 32 human-approved FIX rows | complete: 32 applied, 290 exact field edits | `currency/12-approved-execution.report.md` | `currency/12-approved-execution.manifest.jsonl` |
| 2026-06-24/25-Phase-A-Coherence | coherence pilot + currency remainder | 109 unique items / 156 candidate pairs plus 5 Opus currency exception rows | complete: 117 DISMISS, 2 minor FIX applied, 0 blocker/major/source_check/hold/discard | `../../ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md`; `currency/13-opus-currency-claude-exception.report.md` | `coherence/ADVERSARIAL-AUDIT-2026-06-24.manifest.jsonl`; `currency/13-opus-currency-claude-exception.manifest.jsonl` |

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

## Session 10 Result

- Promoted `gpt_canonical_cloze_neutropenia_038` to a HIGH-confidence FIX:
  replace automatic Protective Environment placement and categorical raw-food
  avoidance with Standard Precautions, strict hand hygiene, avoidance of sick
  contacts, and safe handling of produce.
- Dismissed the `gpt_canonical_or_ppe_doffing_104` REVIEW. CDC's general
  Isolation Precautions figure uses the item's sequence: gloves, eye
  protection, gown, mask or respirator, then hand hygiene.
- Confirmed through the initial commit and ledger that the 13 unknown
  hard-case rows have no surviving per-item producer chain. They remain blocked
  because an OpenAI/Codex adjudicator cannot establish independent review.
- Layer A regenerated at 1,652 inventory records, 1,317 queue rows, and 1,127
  unique queued IDs.
- The one-row manifest passed exact before-state and EN/ZH pairing checks; the
  actioned item resolved in the Review Console with bilingual answer reveal.
- Layer A regression, bundled-bank validation, and the production build passed.
- Canonical banks edited: none.

## Next Turn

1. Assign the remaining 17 producer-conflict Phase B rows to a reviewer whose
   producer and final-review chain does not conflict with each case.

## Session 12 Result

- Luke accepted all 32 proposals in `PROPOSAL-REVIEW-PACKET.md`.
- Applied 290 exact field edits to 29 Gemini, 2 Claude, and 1 GPT question.
- The applicator validated every current `before` value before writing and
  emitted `currency/12-approved-execution.manifest.jsonl`.
- Removed the byte-identical duplicate `opus_case_warfarin_bridge_01` container
  from `hard-cases-canonical.json`; the reviewed canonical copy remains in
  `claude-canonical.json`, as recorded by the bank ledger. Global IDs are unique.
- Post-correction Layer A baseline, including concurrent reviewed bank
  additions: 1,692 inventory records, 1,312 queue rows, and 1,136 unique queued
  IDs.
- The semantic fixes did not change counts; duplicate cleanup changed
  `hard-cases-canonical.json` from 58 to 57 top-level questions.
- Review Console found all 32 corrected IDs with bilingual content and answer
  reveal.
- Layer A, schema-bank, coverage, census freshness, bundled-bank validation,
  promotion audit, and production build checks passed.

## Session 11 Result

- Luke reviewed the advisory result for all 13 provenance-unknown hard-case
  records and approved all 13 to remain unchanged.
- The only possible concern was `case_dka_01_q5`: an IV insulin bolus is not
  necessary in every DKA pathway, but the item supplies a valid provider order
  and tests the correct `60 kg × 0.1 units/kg = 6 units` calculation.
- The item does not teach that a bolus is universally required, so the concern
  was dismissed.
- Canonical banks edited: none.

## Completion Rules

- Reports and manifests are proposals only.
- Every OG action needs verbatim bank evidence and a current authoritative
  source; otherwise use `REVIEW`.
- Every proposed cure must update English and Chinese together.
- Do not apply canonical edits until Luke approves a manifest.
