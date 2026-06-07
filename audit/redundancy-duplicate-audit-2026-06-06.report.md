# NCLEX Question Bank — Adversarial Audit Report

AUDIT SESSION HEADER
====================
Session ID         : 2026-06-06-Batch-1
Questions Audited  : gpt_canonical_or_chest_tube_disconnect_052, gemini_jun05_a_or_chest_tube_disconnection_13, gemini_b10_07, gemini_p1_03, gap_50_sic_02, gen_sic_batch2_3, gpt_canonical_or_ppe_doffing_104, trad_ppt_08, gap_50_ppt_07, gemini_p3_06, gap_50_bcc_02, sa_parkland_01, gemini_p6_burn_01, gemini_b7_02
Total in Scope     : 14
Audit Categories   : AK, DC, RI
Total Findings     : 5
  HIGH confidence  : 4
  MEDIUM confidence: 1
  LOW confidence   : 0
Null Ranges        : gemini_b7_02: no findings

---

FINDING #1
Category: AK

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENCE A
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question ID    : gpt_canonical_or_chest_tube_disconnect_052
Full Stem      : A client's chest tube disconnects from the drainage system. Place the nurse's actions in the correct order.
Correct Answer : A, B, C, D (where option A is Place the distal end of the chest tube in sterile water., B is Assess the client's respiratory status., C is Prepare or obtain a new drainage system., D is Notify the provider after emergency actions are underway.)
Distractors    : None
Rationale      : The immediate priority is restoring a water seal by placing the tube end in sterile water. Then assess breathing, replace the system, and notify the provider.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENCE B
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question ID    : gemini_jun05_a_or_chest_tube_disconnection_13
Full Stem      : A client with a left pneumothorax has a chest tube connected to a closed water-seal drainage system. While turning the client, the chest tube accidentally becomes disconnected from the drainage tubing. Place the nursing actions in the correct sequential order.
Correct Answer : A, B, C, D (where option A is Immerse the distal end of the chest tube in a bottle of sterile water., B is Assess the client's breath sounds and respiratory effort., C is Notify the healthcare provider of the event., D is Obtain and set up a new sterile chest drainage system.)
Distractors    : None
Rationale      : The immediate priority when a chest tube disconnects from its system is to submerge the distal end in 2 cm of sterile water (A). This acts as a temporary water seal and prevents air from rushing back into the pleural space, causing a tension pneumothorax. Next, the nurse should immediately assess the client's respiratory status (B). Following assessment, the provider should be notified (C), and finally, a new sterile drainage system should be prepared and connected (D).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFLICT CLAIM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
What lesson does Question A teach?
Question A teaches that obtaining a new drainage system must precede notifying the provider.

What lesson does Question B teach?
Question B teaches that notifying the provider must precede obtaining a new drainage system.

Why are these lessons mutually exclusive?
A student cannot hold both beliefs simultaneously because they dictate opposite priorities for the third and fourth steps of the exact same clinical emergency protocol (setting up a new drainage system vs. notifying the healthcare provider). If the student selects notification first, they will fail Question A; if they select setting up the system first, they will fail Question B.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTERNATIVE INTERPRETATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Could both questions be correct in different contexts?
One could argue that in Question A, the provider is notified "after emergency actions are underway" which may imply that setting up the new system is part of the emergency setup, whereas in Question B, the provider is notified immediately after initial stabilization and assessment. However, they represent the identical clinical scenario and the conflict is a pedantic sequencing discrepancy rather than a valid clinical distinction.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFIDENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[x] HIGH   — Conflict holds even under the best-faith reconciliation.
[ ] MEDIUM — Conflict is probable but a plausible reconciliation exists.
[ ] LOW    — Conflict is possible but reconciliation is stronger than the claim.

Justification: The questions test the same clinical emergency and require the student to submit mutually exclusive priority sequences for the final two actions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[x] FIX    — Contradiction confirmed; one question must be corrected or removed.
[ ] REVIEW — Human expert review required before any action.
[ ] DISMISS — Insufficient evidence or reconciliation is stronger than the claim.

Action notes: Modify the correct sequence and option text of gpt_canonical_or_chest_tube_disconnect_052 to align with gemini_jun05_a_or_chest_tube_disconnection_13 (i.e. notify the provider before preparing the new system). Additionally, prune gemini_b10_07 as it is a complete duplicate of gemini_jun05_a_or_chest_tube_disconnection_13.

---

FINDING #2
Category: RI

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENCE A
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question ID    : trad_ppt_08
Full Stem      : A client is receiving a continuous intravenous infusion of heparin for deep vein thrombosis. Which laboratory value should the nurse monitor to evaluate the effectiveness of the therapy?
Correct Answer : Activated partial thromboplastin time (aPTT)
Distractors    : Prothrombin time (PT), International Normalized Ratio (INR), Platelet count
Rationale      : aPTT is used to monitor heparin therapy. PT and INR (Options A and B) are used to monitor warfarin. While platelet count (Option D) is monitored for heparin-induced thrombocytopenia (HIT), it does not measure the effectiveness of the anticoagulation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENCE B
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question ID    : gap_50_ppt_07
Full Stem      : A client is receiving a continuous intravenous heparin infusion for a deep vein thrombosis. The nurse should monitor the client's {{1}} to assess therapeutic effectiveness and adjust the infusion rate, while keeping {{2}} available as the antidote.
Correct Answer : Dropdown 1: activated partial thromboplastin time (aPTT), Dropdown 2: protamine sulfate
Distractors    : Dropdown 1: prothrombin time (PT) and International Normalized Ratio (INR), Dropdown 2: phytonadione (vitamin K)
Rationale      : Continuous IV heparin therapy is monitored using the aPTT lab value, with a therapeutic range typically 1.5 to 2.5 times the control value. The specific reversal agent (antidote) for heparin is protamine sulfate. PT/INR and Vitamin K are associated with warfarin therapy.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFLICT CLAIM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
What lesson does Question A teach?
Question A teaches that aPTT is the specific laboratory value monitored to assess the effectiveness of continuous intravenous heparin therapy.

What lesson does Question B teach?
Question B teaches that the student should identify aPTT as the laboratory test and protamine sulfate as the antidote for heparin therapy, but it leaks these correct answers within its own rendered clozeStem text.

Why are these lessons mutually exclusive?
While the clinical facts are identical, the items represent a major test-design conflict. Question B contains the correct answers written in plain text in its clozeStem ("activated partial thromboplastin time (aPTT)" and "protamine sulfate"), which negates the need for the student to know the facts tested in Question A.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTERNATIVE INTERPRETATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Could both questions be correct in different contexts?
No, the leakage of correct answers inside the clozeStem of Question B is a database generation error and cannot be reconciled as a valid test-design choice.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFIDENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[x] HIGH   — Conflict holds even under the best-faith reconciliation.
[ ] MEDIUM — Conflict is probable but a plausible reconciliation exists.
[ ] LOW    — Conflict is possible but reconciliation is stronger than the claim.

Justification: The clozeStem of gap_50_ppt_07 is structurally bugged and reveals the correct answers in plain text.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[x] FIX    — Contradiction confirmed; one question must be corrected or removed.
[ ] REVIEW — Human expert review required before any action.
[ ] DISMISS — Insufficient evidence or reconciliation is stronger than the claim.

Action notes: Fix the clozeStem in gap_50_ppt_07 to remove the explicit answers and use placeholders: "The nurse should monitor the client's {{1}} and keep {{2}} available as the antidote."

---

FINDING #3
Category: RI

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENCE A
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question ID    : gemini_p3_06
Full Stem      : When teaching a client with left-sided weakness how to use a cane, the nurse should instruct the client to hold the cane on the ________ side.
Correct Answer : right / unaffected / stronger / strong
Distractors    : None
Rationale      : A cane should be held on the unaffected (stronger) side to provide balance and support for the opposite weak side.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENCE B
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question ID    : gap_50_bcc_02
Full Stem      : A client who is recovering from a right-sided stroke with left-sided weakness is being instructed on how to use a single-ended cane. The nurse should instruct the client to hold the cane on the {{1}} side and advance the cane together with the {{2}} leg.
Correct Answer : Dropdown 1: right (strong) side, Dropdown 2: left (weak) leg
Distractors    : Dropdown 1: left (weak) side, Dropdown 2: right (strong) leg
Rationale      : A cane should be held on the unaffected (right/strong) side to widen the base of support and share the weight with the weaker limb. The cane and the affected (left/weak) leg should advance together to maintain balance, followed by the stronger leg.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFLICT CLAIM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
What lesson does Question A teach?
Question A teaches that a client with left-sided weakness must hold a cane on the unaffected (right/strong) side of the body.

What lesson does Question B teach?
Question B teaches that a client with left-sided weakness must hold the cane on the right side and advance it with the left leg, but it explicitly leaks these correct answers in its own clozeStem text.

Why are these lessons mutually exclusive?
The clinical content is identical, but the design is inconsistent: the student is asked to recall the correct cane-holding side in Question A, while Question B provides the exact answers in plain text inside its clozeStem ("hold the cane on the right (strong) side {{1}} and advance the cane together with the left (weak) leg {{2}}"), spoiling the test item.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTERNATIVE INTERPRETATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Could both questions be correct in different contexts?
No, the leakage of answers in the clozeStem of Question B is a generation defect and cannot be reconciled.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFIDENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[x] HIGH   — Conflict holds even under the best-faith reconciliation.
[ ] MEDIUM — Conflict is probable but a plausible reconciliation exists.
[ ] LOW    — Conflict is possible but reconciliation is stronger than the claim.

Justification: The clozeStem of gap_50_bcc_02 is bugged and directly leaks the keyed answers in the question text.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[x] FIX    — Contradiction confirmed; one question must be corrected or removed.
[ ] REVIEW — Human expert review required before any action.
[ ] DISMISS — Insufficient evidence or reconciliation is stronger than the claim.

Action notes: Fix the clozeStem in gap_50_bcc_02 to use proper placeholders: "The nurse should instruct the client to hold the cane on the {{1}} and advance the cane together with the {{2}}."

---

FINDING #4
Category: DC

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENCE A
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question ID    : gemini_p1_03
Full Stem      : The nurse is leaving a client's room where contact and droplet precautions were in place. Place the steps for removing personal protective equipment (PPE) in the correct order.
Correct Answer : A, B, C, D (where A is Gloves, B is Goggles or face shield, C is Gown, D is Mask or respirator)
Distractors    : None
Rationale      : The standard sequence for doffing PPE is gloves, followed by goggles/face shield, then gown, and finally mask/respirator.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENCE B
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question ID    : gap_50_sic_02
Full Stem      : A nurse is exiting the room of a client who is on airborne and contact precautions. Sequence the steps for removing personal protective equipment (PPE) in the correct order, from first to last (standard CDC recommendation).
Correct Answer : A, B, C, D (where A is Gloves, B is Goggles or face shield, C is Gown, D is Mask or respirator (remove outside the room))
Distractors    : None
Rationale      : According to standard CDC guidelines, the sequence for removing PPE is: 1. Gloves (most contaminated), 2. Goggles or face shield, 3. Gown, 4. Mask or respirator (always removed outside the client room for airborne precautions). Hand hygiene must be performed between steps if hands become contaminated.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFLICT CLAIM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
What lesson does Question A teach?
Question A teaches that the sequence for removing gloves, goggles, gown, and mask when exiting a contact/droplet precautions room is Gloves -> Goggles -> Gown -> Mask.

What lesson does Question B teach?
Question B teaches the exact same sequence (Gloves -> Goggles -> Gown -> Mask) for exiting a room under contact/airborne precautions.

Why are these lessons mutually exclusive?
While the clinical facts are consistent, they represent a direct duplication of clinical testing concepts within the same question bank, offering no distinct educational value or testing variation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTERNATIVE INTERPRETATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Could both questions be correct in different contexts?
Yes, they are both correct and test standard CDC doffing guidelines. The only variation is the isolation context (droplet/contact vs. airborne/contact, requiring the mask to be removed outside the room for airborne), but the ordering of the physical items remains identical.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFIDENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] HIGH   — Conflict holds even under the best-faith reconciliation.
[x] HIGH   — Conflict holds even under the best-faith reconciliation. (Duplicate/redundant items)
[ ] MEDIUM — Conflict is probable but a plausible reconciliation exists.
[ ] LOW    — Conflict is possible but reconciliation is stronger than the claim.

Justification: The items are identical doffing-sequence ordered-response questions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[x] FIX    — Contradiction confirmed; one question must be corrected or removed.
[ ] REVIEW — Human expert review required before any action.
[ ] DISMISS — Insufficient evidence or reconciliation is stronger than the claim.

Action notes: Prune the redundant gen_sic_batch2_3 (another duplicate) and consolidate gap_50_sic_02 and gemini_p1_03 to reduce question bank bloat.

---

FINDING #5
Category: DC

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENCE A
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question ID    : sa_parkland_01
Full Stem      : A 70 kg client has sustained partial-thickness burns to 30% of the body. Using the Parkland formula (4 mL/kg/%TBSA), calculate the total fluid volume to be infused in the first 8 hours.
Correct Answer : 4200
Distractors    : None
Rationale      : Total (24h) = 4 mL * 70 kg * 30 = 8,400 mL. First 8 hours = 50% of total = 4,200 mL.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVIDENCE B
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Question ID    : gemini_p6_burn_01
Full Stem      : A client weighing 154 lbs has sustained 40% total body surface area (TBSA) burns. Using the Parkland formula (4 mL/kg/%TBSA), calculate the total fluid resuscitation volume required in the first 24 hours. (Round to the nearest whole number).
Correct Answer : 11200
Distractors    : None
Rationale      : The Parkland formula is calculated as 4 mL × weight in kg × %TBSA. First, convert weight to kg: 154 lbs / 2.2 = 70 kg. Then, calculate the volume: 4 mL × 70 kg × 40 = 11,200 mL.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFLICT CLAIM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
What lesson does Question A teach?
Question A teaches that a client with a mass of 70 kg and 30% TBSA burns requires 4,200 mL of fluid in the first 8 hours of resuscitation.

What lesson does Question B teach?
Question B teaches that a client weighing 154 lbs (which is exactly 70 kg) and having 40% TBSA burns requires 11,200 mL of fluid in the first 24 hours of resuscitation.

Why are these lessons mutually exclusive?
While mathematically consistent, the items represent a major duplication of the identical clinical scenario parameters (70 kg client, Parkland formula, fill-in-the-blank math calculation) within the same question bank, which dilutes clinical scenario diversity.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTERNATIVE INTERPRETATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Could both questions be correct in different contexts?
Yes, they test different phases of the resuscitation (first 8 hours vs. first 24 hours) and use slightly different formats (pounds to kilograms conversion required in B). Thus, they are technically non-contradictory.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONFIDENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] HIGH   — Conflict holds even under the best-faith reconciliation.
[x] MEDIUM — Conflict is probable but a plausible reconciliation exists.
[ ] LOW    — Conflict is possible but reconciliation is stronger than the claim.

Justification: The questions are mathematically consistent but highly redundant because they use the same base client weight (70 kg) and Parkland formula.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] FIX    — Contradiction confirmed; one question must be corrected or removed.
[x] REVIEW — Human expert review required before any action.
[ ] DISMISS — Insufficient evidence or reconciliation is stronger than the claim.

Action notes: Human expert should review whether to retain both or diversify the client weights and burn percentages to offer a wider variety of calculations.
