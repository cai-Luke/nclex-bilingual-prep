# Early-Bank Semantic Audit: Proposal Review Packet

## Purpose

Human adjudication packet for the 32 active `FIX` proposals from currency
Sessions 01-05 and 10.

This packet is a decision aid. The session JSONL manifests remain the exact
execution source of truth. No proposal is approved merely because it appears
here, and no canonical bank should be edited until Luke records a decision.

Decision vocabulary:

- `ACCEPT` — apply the proposal exactly as manifested.
- `REVISE` — accept the clinical issue but change the proposed cure.
- `REJECT` — retain the canonical item as-is.
- `HOLD` — defer pending another source or expert review.

Superseded Session 07 `REVIEW` rows are excluded. Session 10 already dismissed
the PPE doffing concern and promoted the neutropenia concern to the active FIX
listed in Batch 6.

## Reconciliation

| Batch | Theme | Proposals |
|---|---|---:|
| 1 | Screening and colonoscopy preparation | 4 |
| 2 | Isolation, meningitis, and neutropenia | 10 |
| 3 | Anticoagulation and DKA/insulin | 7 |
| 4 | Sepsis, dysphagia, hypertension, and enalapril | 8 |
| 5 | Hip replacement and metoprolol | 2 |
| 6 | GPT neutropenia cloze | 1 |
| **Total** |  | **32** |

## Batch 1: Screening and Colonoscopy

Raw manifest:
`currency/01-immunization-screening.manifest.jsonl`

### 1. `gemini_c5_09`

**Issue:** A 25-year-old screening SATA teaches annual blood-pressure screening
for every low-risk young adult and STI screening based on sexual activity
alone.

**Proposed cure:** Keep both keyed concepts but qualify them:

- BP every 3-5 years when age 18-39, prior readings are normal, and risk is not
  increased.
- At age 25 or older, chlamydia/gonorrhea screening when increased-risk factors
  are present.

**Sources:** USPSTF hypertension screening; CDC STI screening.

**Decision:** `ACCEPT`

### 2. `gemini_c5_04`

**Issue:** Morning-colonoscopy sequence ends with universal NPO after midnight
and omits split dosing.

**Proposed cure:** Extend the sequence into procedure morning: first PEG portion
in the evening; second portion begins 4-6 hours before colonoscopy and finishes
at least 2 hours before it.

**Source:** 2025 U.S. Multi-Society Task Force bowel-preparation guidance.

**Decision:** `ACCEPT`

### 3. `trad_batchD_04`

**Issue:** SATA treats 24 hours of clear liquids and 6-8 hours of complete NPO
as universal.

**Proposed cure:** Use the prescribed low-residue or clear-liquid day-before
plan and individualized anesthesia fasting instructions; clear liquids may
generally continue until 2 hours before sedation in otherwise healthy clients.

**Sources:** 2025 U.S. Multi-Society Task Force; ASA fasting guidance.

**Decision:** `ACCEPT`

### 4. `gemini_p3_03`

**Issue:** Key requires 24-48 hours of clear liquids and explains a blanket
6-8-hour NPO rule.

**Proposed cure:** Key a prescribed day-before diet plus split-dose preparation.
Turn the universal midnight clear-liquid cutoff into a distractor and explain
individualized fasting.

**Sources:** 2025 U.S. Multi-Society Task Force; ASA fasting guidance.

**Decision:** `ACCEPT`

## Batch 2: Isolation, Meningitis, and Neutropenia

Raw manifest:
`currency/02-isolation-precautions.manifest.jsonl`

### 5. `gap_50_sic_04`

**Issue:** Varicella is classified as Airborne only.

**Proposed cure:** Add an `Airborne + Contact Precautions` matrix column and key
varicella to it.

**Source:** CDC varicella guidance.

**Decision:** `ACCEPT`

### 6. `gemini_jun05_a_sata_cdiff_precautions_12`

**Issue:** C. difficile explanations make soap-and-water and bleach universal
requirements.

**Proposed cure:** Add outbreak context, use soap and water as preferred in
outbreak/high-endemic settings or visibly soiled hands, and replace bleach with
a facility-approved sporicidal disinfectant.

**Source:** CDC CDI and Isolation Precautions guidance.

**Decision:** `ACCEPT`

### 7. `gen_sic_batch2_10`

**Issue:** C. difficile cloze universally requires soap and water plus bleach.

**Proposed cure:** Add outbreak/enhanced-policy context and replace
bleach-specific wording with a facility-approved sporicidal disinfectant.

**Source:** CDC CDI and Isolation Precautions guidance.

**Decision:** `ACCEPT`

### 8. `gap_50_sic_05`

**Issue:** Matrix rationale says soap and water is always required for
C. difficile.

**Proposed cure:** Narrow the row to soap-and-water use after glove removal
during a C. difficile outbreak and update the rationale accordingly.

**Source:** CDC CDI guidance.

**Decision:** `ACCEPT`

### 9. `trad_batchB_16`

**Issue:** Droplet precautions are taught through an obsolete minimum-distance
question.

**Proposed cure:** Replace the distance question with mask-on-entry teaching;
the correct answer becomes `Put on a surgical mask upon entry`.

**Source:** CDC Isolation Precautions guidance.

**Decision:** `ACCEPT`

### 10. `gemini_b4_01`

**Issue:** Correct surgical-mask key is retained, but its rationale uses an
obsolete 3-foot trigger.

**Proposed cure:** Change rationale only: personnel don a mask upon room or
patient-space entry.

**Source:** CDC Isolation Precautions guidance.

**Decision:** `ACCEPT`

### 11. `gemini_b4_08`

**Issue:** Correct patient-mask transport key is retained, but rationale repeats
a 3-6-foot staff-distance rule.

**Proposed cure:** Change rationale only: mask personnel on room entry and mask
the patient during necessary transport.

**Source:** CDC Isolation Precautions guidance.

**Decision:** `ACCEPT`

### 12. `gemini_b4_02`

**Issue:** Suspected bacterial meningitis sequence delays antibiotics until
after lumbar puncture and includes unnecessary nasopharyngeal cultures.

**Proposed cure:** Obtain ordered blood cultures without delaying treatment,
then administer antibiotics before lumbar puncture when LP would cause delay.
Key changes from `A,B,D,C` to `A,B,C,D`.

**Sources:** WHO meningitis guidance; NICE NG240.

**Decision:** `ACCEPT`

### 13. `gemini_d7_07`

**Issue:** Neutropenia discharge teaching requires antibacterial soap and
excludes fresh produce.

**Proposed cure:** Use ordinary soap and warm water; permit fresh produce after
thorough washing or peeling. Add the revised produce option to the SATA key.

**Sources:** NCI infection guidance; ONS infection-prevention guidance.

**Decision:** `ACCEPT`

### 14. `gap_50_sic_11`

**Issue:** Correct ANC `<500` threshold is framed as automatically requiring a
formal Protective Environment.

**Proposed cure:** Preserve the ANC calculation/threshold but remove automatic
Protective Environment teaching; describe severe neutropenia as high infection
risk requiring individualized prevention measures.

**Sources:** CDC Protective Environment guidance; NCI ANC guidance.

**Decision:** `ACCEPT`

## Batch 3: Anticoagulation and DKA

Raw manifest:
`currency/03-anticoagulation-dka-insulin.manifest.jsonl`

### 15. `gemini_c8_07`

**Issue:** Teaches `INR >1.5` as a paracentesis bleeding cutoff in cirrhosis.

**Proposed cure:** Replace the nonexistent INR target with a fibrinogen
calculation/threshold item keyed to `100 mg/dL`; explain that INR alone does not
predict procedural bleeding in cirrhosis.

**Source:** AASLD peri-procedural bleeding guidance.

**Decision:** `ACCEPT`

### 16. `gemini_p4_04`

**Issue:** Makes vitamin K routine for warfarin-associated INR 5.2 without
bleeding.

**Proposed cure:** Add active major bleeding to the scenario so vitamin K and
rapid reversal are clinically supported.

**Source:** ASH anticoagulation guidance.

**Decision:** `ACCEPT`

### 17. `gemini_p8_07`

**Issue:** Uses the older DKA insulin-delay potassium threshold of
`3.3 mEq/L`.

**Proposed cure:** Update the threshold and associated teaching to
`3.5 mEq/L`.

**Source:** 2024 international hyperglycemic-crisis consensus.

**Decision:** `ACCEPT`

### 18. `easy_dka_01`

**Issue:** Rationale says regular insulin is the only insulin that can be given
intravenously.

**Proposed cure:** Keep regular insulin as the expected DKA answer but remove
the universal claim; note that other insulin products such as insulin aspart
may be administered IV under appropriate supervision and protocols.

**Source:** FDA insulin-aspart labeling.

**Decision:** `ACCEPT`

### 19. `trad_batchD_02`

**Issue:** A low platelet count during heparin is described as independently
indicating HIT.

**Proposed cure:** Preserve report/hold safety teaching but describe the result
as thrombocytopenia requiring evaluation for HIT using percentage fall, timing,
thrombosis, and other causes.

**Sources:** FDA heparin labeling; ASH HIT guidance.

**Decision:** `ACCEPT`

### 20. `gemini_d1_08_cloze_dka_mgmt`

**Issue:** Correctly adds dextrose below 250 mg/dL but says its purpose is to
prevent cerebral edema and sequences potassium teaching poorly.

**Proposed cure:** Explain that dextrose prevents hypoglycemia while insulin
continues until ketoacidosis resolves; state that potassium is assessed and
corrected before insulin when below 3.5.

**Source:** 2024 international hyperglycemic-crisis consensus.

**Decision:** `ACCEPT`

### 21. `gemini_p5_10`

**Issue:** Same DKA explanation error: dextrose is attributed to cerebral-edema
prevention and potassium-first safety is unclear.

**Proposed cure:** Retain the key, correct the dextrose purpose, and add the
pre-insulin potassium assessment/hold rule.

**Source:** 2024 international hyperglycemic-crisis consensus.

**Decision:** `ACCEPT`

## Batch 4: Sepsis, Dysphagia, Hypertension, and Enalapril

Raw manifest:
`currency/04-remaining-high-harm.manifest.jsonl`

### 22. `gemini_c10_01`

**Issue:** A 72-year-old septic-shock item keys 0.9% saline and MAP
`>65 mmHg`.

**Proposed cure:** Key a balanced crystalloid and an initial MAP target of
`60-65 mmHg` for the older adult; retain norepinephrine for persistent
hypotension.

**Source:** 2026 Surviving Sepsis Campaign.

**Decision:** `ACCEPT`

### 23. `gemini_d10_02`

**Issue:** Matrix labels individual hypoperfusion findings as independently
indicating sepsis or septic shock.

**Proposed cure:** Relabel columns as concerning or not concerning for organ
dysfunction/hypoperfusion, without treating any one finding as diagnostic.

**Sources:** 2026 Surviving Sepsis Campaign; Sepsis-3.

**Decision:** `ACCEPT`

### 24. `gemini_d3_01`

**Issue:** Universal chin-down instruction for post-stroke dysphagia.

**Proposed cure:** Add a swallowing evaluation and individualized plan that
specifically recommends chin-down posture.

**Sources:** 2026 AHA/ASA stroke guidance; ASHA dysphagia guidance.

**Decision:** `ACCEPT`

### 25. `gemini_jun05_a_mc_dysphagia_29`

**Issue:** Universal chin-down/thickened-liquid teaching without an assessed
swallowing plan.

**Proposed cure:** Make the stem state that the swallowing evaluation recommends
chin-down posture and align rationale with individualized care.

**Sources:** 2026 AHA/ASA stroke guidance; ASHA dysphagia guidance.

**Decision:** `ACCEPT`

### 26. `gemini_jun05_b_cloze_dysphagia_19`

**Issue:** Upright positioning and chin-down are presented together as universal
rules.

**Proposed cure:** Retain upright positioning while making chin-down explicitly
part of this client's assessed individualized plan.

**Sources:** 2026 AHA/ASA stroke guidance; ASHA dysphagia guidance.

**Decision:** `ACCEPT`

### 27. `gen_bcc_batch1_8`

**Issue:** SATA universally applies chin-down, stronger-side food placement,
straw avoidance, and liquid restrictions.

**Proposed cure:** Add an individualized plan identifying unilateral oral
weakness and prescribed chin-down posture; make straw/liquid decisions depend
on that plan.

**Sources:** 2026 AHA/ASA stroke guidance; ASHA dysphagia guidance.

**Decision:** `ACCEPT`

### 28. `easy_adult_health_03`

**Issue:** `Starting weightlifting` is a distractor implying resistance exercise
is inappropriate for hypertension.

**Proposed cure:** Narrow it to `unsupervised maximal-effort weightlifting`;
explain that regular aerobic and resistance exercise are recommended.

**Source:** 2025 AHA/ACC high-blood-pressure guidance.

**Decision:** `ACCEPT`

### 29. `gemini_b2_04`

**Issue:** Universal instruction to remain in bed for 3 hours after first-dose
enalapril.

**Proposed cure:** Teach slow position changes and reporting dizziness or
fainting; use risk-based dose selection and supervised BP observation rather
than routine bed rest.

**Source:** FDA Vasotec labeling.

**Decision:** `ACCEPT`

## Batch 5: Hip Replacement and Metoprolol

Raw manifest:
`currency/05-medium-claude-high-harm.manifest.jsonl`

### 30. `claude_a_mc_hip_replacement_21`

**Issue:** Standard posterior hip precautions are presented as automatic after
every posterior-approach replacement.

**Proposed cure:** Add that the surgeon's orders specify standard posterior hip
precautions; retain the avoidance of flexion beyond 90 degrees, internal
rotation, and adduction past midline.

**Sources:** AAOS OrthoInfo; 2024 systematic review.

**Decision:** `ACCEPT`

### 31. `claude_a_mc_metoprolol_assessment_10`

**Issue:** Teaches pulse `<60/min` as a universal metoprolol hold rule and
checks pulse without BP.

**Proposed cure:** Assess heart rate and blood pressure, then compare both with
patient-specific prescribed hold and notification parameters.

**Source:** FDA Lopressor labeling.

**Decision:** `ACCEPT`

## Batch 6: GPT Neutropenia Cloze

Raw manifest:
`currency/10-claude-return-adjudication.manifest.jsonl`

### 32. `gpt_canonical_cloze_neutropenia_038`

**Issue:** ANC 400 automatically keys a private Protective Environment and
categorically prohibits fresh flowers and all raw produce.

**Proposed cure:** Key Standard Precautions with strict hand hygiene and
avoidance of sick visitors and unwashed produce. Explain that formal Protective
Environment indications are narrower and properly washed or peeled produce is
not categorically prohibited.

**Sources:** CDC Protective Environment guidance; NCI neutropenia guidance.

**Decision:** `ACCEPT`

## Decision Log

Record decisions here as batches are reviewed:

| # | ID | Decision | Revision note |
|---:|---|---|---|
| 1 | `gemini_c5_09` | `ACCEPT` | |
| 2 | `gemini_c5_04` | `ACCEPT` | |
| 3 | `trad_batchD_04` | `ACCEPT` | |
| 4 | `gemini_p3_03` | `ACCEPT` | |
| 5 | `gap_50_sic_04` | `ACCEPT` | |
| 6 | `gemini_jun05_a_sata_cdiff_precautions_12` | `ACCEPT` | |
| 7 | `gen_sic_batch2_10` | `ACCEPT` | |
| 8 | `gap_50_sic_05` | `ACCEPT` | |
| 9 | `trad_batchB_16` | `ACCEPT` | |
| 10 | `gemini_b4_01` | `ACCEPT` | |
| 11 | `gemini_b4_08` | `ACCEPT` | |
| 12 | `gemini_b4_02` | `ACCEPT` | |
| 13 | `gemini_d7_07` | `ACCEPT` | |
| 14 | `gap_50_sic_11` | `ACCEPT` | |
| 15 | `gemini_c8_07` | `ACCEPT` | |
| 16 | `gemini_p4_04` | `ACCEPT` | |
| 17 | `gemini_p8_07` | `ACCEPT` | |
| 18 | `easy_dka_01` | `ACCEPT` | |
| 19 | `trad_batchD_02` | `ACCEPT` | |
| 20 | `gemini_d1_08_cloze_dka_mgmt` | `ACCEPT` | |
| 21 | `gemini_p5_10` | `ACCEPT` | |
| 22 | `gemini_c10_01` | `ACCEPT` | |
| 23 | `gemini_d10_02` | `ACCEPT` | |
| 24 | `gemini_d3_01` | `ACCEPT` | |
| 25 | `gemini_jun05_a_mc_dysphagia_29` | `ACCEPT` | |
| 26 | `gemini_jun05_b_cloze_dysphagia_19` | `ACCEPT` | |
| 27 | `gen_bcc_batch1_8` | `ACCEPT` | |
| 28 | `easy_adult_health_03` | `ACCEPT` | |
| 29 | `gemini_b2_04` | `ACCEPT` | |
| 30 | `claude_a_mc_hip_replacement_21` | `ACCEPT` | |
| 31 | `claude_a_mc_metoprolol_assessment_10` | `ACCEPT` | |
| 32 | `gpt_canonical_cloze_neutropenia_038` | `ACCEPT` | |

## Execution Gate

After all 32 decisions are recorded:

1. Build an approved execution manifest containing only accepted/revised rows.
2. Revalidate every selector and exact `before` value against current banks.
3. Apply canonical corrections with an explicit reason.
4. Inspect actioned IDs in the Review Console.
5. Update `BANK-REVIEW-LEDGER.md`.
6. Run bank validation, full audit, census regeneration/check, and build.
