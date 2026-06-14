# Currency Audit — Session 11
## Human Adjudication of 13 Hard-Case Records

**Session ID:** 2026-06-13-Currency-11
**Track:** currency / OG adjudication
**Reviewer:** Luke, human product owner
**Date:** 2026-06-13
**Scope:** 13 records listed in `GEMINI-13-ITEM-REVIEW-SPEC.md`
**Canonical banks edited:** No

## Result

| Disposition | Count |
|---|---:|
| Retain as-is | 13 |
| FIX | 0 |
| REVIEW | 0 |
| CUT | 0 |

The advisory review produced one possible concern:
`case_dka_01_q5` in `hard-cases-canonical.json` at
`questions[7].caseStudy.questions[4]`.

The item states that the provider orders a regular-insulin bolus of
`0.1 units/kg` followed by an infusion and asks the learner to calculate the
ordered bolus for a 60 kg client. Although an IV insulin bolus is not strictly
necessary in every current DKA treatment pathway, the item does not claim that
it is universally required. It supplies a valid provider order and tests the
calculation `60 kg × 0.1 units/kg = 6 units`.

**Human adjudication:** retain as-is. The context-dependent clinical concern
does not invalidate the calculation exercise, answer key, or rationale.

The remaining 12 scoped records can also stand without changes.

## No-Action IDs

- `cs_hip_01_q5`
- `case_dka_01`
- `case_dka_01_q1`
- `case_dka_01_q2`
- `case_dka_01_q3`
- `case_dka_01_q4`
- `case_dka_01_q5`
- `case_sepsis_pneumonia_01`
- `sepsis_pneumonia_cues_matrix`
- `sepsis_pneumonia_actions_order`
- `sepsis_pneumonia_fluid_calc`
- `sepsis_pneumonia_outcomes_cloze`
- `sa_parkland_01`

No action manifest was created because no patch or cut was approved.
