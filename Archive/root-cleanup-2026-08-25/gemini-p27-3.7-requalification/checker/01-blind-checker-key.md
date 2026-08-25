# Phase I Blind Checker Key Summary

## Blindness and method

This key was derived only from the governing material and the frozen V2 Module A package at historical snapshot `59664cacfe4cfbd43d212f84c5d164a09557c958`. The Gemini Run 3 candidate contents and held historical answer artifacts remained unopened throughout Phase I. No current bank contents or external clinical sources were used.

All 46 scoped rows were reviewed independently. For embedded leaves, parent material was used only to interpret that leaf. For scoped case containers, rules were derived from the container's actual keyed embedded questions. Broad shared domains such as discharge teaching, vascular access, newborn care, device care, or pressure-injury care were not treated as shared clinical decisions by themselves.

## Verdict distribution

| Verdict | Count |
|---|---:|
| `CONTRADICTION` | 1 |
| `RECONCILABLE` | 21 |
| `NO_SHARED_DECISION` | 24 |
| **Total** | **46** |

## Outcome-determinative blind finding

Pair 40 is a contradiction. In `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q1`, the matrix columns are `c1 = Increases risk` and `c2 = Supports prevention`, but the frozen `correct` array assigns immobility, wet linens, 25% meal intake, and nonblanchable sacral redness to `c2`, and assigns the posted turning schedule to `c1`. Its own rationale states the reverse. The paired Claude case teaches the clinically coherent classifications: immobility, moisture, poor intake, and skin breakdown are risks, while repositioning supports prevention.

No acuity, stage, population, route, jurisdiction, or closed-world distinction resolves those opposite keyed classifications. Treating the GPT rationale or its later coherent leaves as a repair would overwrite the frozen outcome-determinative key, so the contradiction remains visible.

## Reconciliation boundaries

The most consequential reconciliations were:

- Pair 12: a boggy fundus displaced to the right supports voiding first, while heavy bleeding with a boggy fundus above the umbilicus supports fundal massage first and prescribed oxytocin next.
- Pair 39: anterior STEMI with sympathetic activation supports tachycardia in the supplied case, while inferior-wall MI can support bradycardia/AV-node effects; infarct location and mechanism resolve the apparent rate conflict.
- Pair 42: eschar that completely obscures the wound base is unstageable, while visible subcutaneous fat despite some slough and no exposed deeper structures is Stage 3.
- Pairs 44 and 46: a fixed at-least-q2h repositioning instruction for one bedbound client and an individualized repositioning schedule for another do not conflict because the latter supplies no opposing interval.

Pairs 11, 39, 44, and 46 carry `MEDIUM` confidence because the boundary between a shared decision and contextual variation is closer; the frozen records nevertheless permit adjudication without an external source check. All other rows carry `HIGH` confidence. No row required external sourcing to preserve or adjudicate the frozen-record rules.

## Mechanical verification

- JSONL parseability: pass.
- Rows: 46.
- Unique/global numbering: exactly 1–46 in order.
- Part/local numbering and item identities: byte-for-byte metadata match to `pair-scope.json` after projection.
- Required fields: complete on every row.
- Verdict and confidence enums: valid on every row.
- Nonempty EN/ZH rules and reconciliation fields: 46/46.
