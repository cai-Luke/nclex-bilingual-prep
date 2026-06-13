# Rhythm-Strip Audit Proposal

AUDIT SESSION HEADER
====================
Session ID         : 2026-06-13-Rhythm-1
Questions Audited  : ekg_b1_matrix_09, ekg_b1_mc_01, ekg_b1_mc_02, ekg_b1_mc_04, ekg_b1_mc_05, ekg_b1_mc_06, ekg_b1_mc_08, ekg_b1_mc_10, ekg_b1_sata_03, ekg_b1_sata_07, ekg_b2_matrix_10, ekg_b2_mc_01, ekg_b2_mc_02, ekg_b2_mc_03, ekg_b2_mc_04, ekg_b2_mc_05, ekg_b2_mc_07, ekg_b2_mc_08, ekg_b2_sata_06, ekg_b2_sata_09, ekg_b3_matrix_10, ekg_b3_mc_01, ekg_b3_mc_02, ekg_b3_mc_03, ekg_b3_mc_04, ekg_b3_mc_05, ekg_b3_mc_06, ekg_b3_mc_07, ekg_b3_mc_09, ekg_b3_sata_08, ekg_b4_matrix_10, ekg_b4_mc_01, ekg_b4_mc_02, ekg_b4_mc_03, ekg_b4_mc_04, ekg_b4_mc_05, ekg_b4_mc_06, ekg_b4_mc_08, ekg_b4_sata_07, ekg_b4_sata_09, ekg_b5_mc_02, rhy_afib_001, rhy_sinus_brady_001, rhy_vtach_001
Total in Scope     : 44
Audit Categories   : NEC, RED, OG
Total Findings     : 29
  HIGH confidence  : 25
  MEDIUM confidence: 4
  LOW confidence   : 0
Null Ranges        : Layer-A-clean retained items: ekg_b2_matrix_10, ekg_b2_mc_07, ekg_b3_matrix_10, ekg_b4_matrix_10, ekg_b4_mc_06, rhy_afib_001, rhy_vtach_001

Verdicts: 25 CUT, 4 CURE, 15 KEEP, 0 REVIEW.
Retained set: 19 items.

The JSONL manifest is the action proposal. Canonical bank content was not edited.

## Current-Guidance Check

No OG verdict was required. The 2025 American Heart Association adult algorithms retain:

- atropine 1 mg IV, repeated every 3-5 minutes to 3 mg total;
- shock-first VF/pulseless-VT sequencing with epinephrine every 3-5 minutes after the second shock loop;
- amiodarone 150 mg over 10 minutes as an antiarrhythmic infusion option for stable wide-QRS tachycardia.

Sources:

- https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-Bradycardia-250514.pdf
- https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-CA-250527.pdf
- https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-Tachycardia-250514.pdf
