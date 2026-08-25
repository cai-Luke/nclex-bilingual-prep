# Final Report — Gemini P27 Run 3, Module A Independent Check

## Result

`GEMINI_P27_RUN3_MODULE_A_CHECK_FAIL`

Run 3 does not satisfy the Module A contract on its own face. Fifteen pairs carry `MAJOR` findings. The decisive defects include broad domain labels substituted for exact shared decisions, unsupported clinical content presented as item-derived, semantic cross-pair/general-knowledge contamination, a materially mutated clozapine rechallenge rule, a materially rewritten opioid presentation, a false corpus-wide source-traceability verification claim, and a missed real contradiction at pair 40.

This is a Module A checker disposition only. No overall P27/P31 requalification decision was made, no current campaign lane was authorized, and Module B was not performed.

## Counts

| Measure | Result |
|---|---:|
| Blind checker verdicts | 1 `CONTRADICTION`; 21 `RECONCILABLE`; 24 `NO_SHARED_DECISION` |
| Candidate verdicts | 0 `CONTRADICTION`; 31 `RECONCILABLE`; 15 `NO_SHARED_DECISION` |
| Exact verdict agreement | 36/46 |
| `MAJOR` findings | 15 |
| `MINOR` findings | 23 |
| `OBSERVATION` findings | 0 |
| `NONE` findings | 8 |

## All non-`NONE` pair findings

### Major

- Pair 16 — manufactures a shared psychotropic adverse-effect decision and imports unsupported class/EPS/agranulocytosis/boxed-warning content.
- Pair 17 — “complementary discharge planning” is a domain label, not an exact common decision.
- Pair 19 — broad safe-discharge reasoning and a mutated failed-teach-back/cognitive-barrier rule.
- Pair 20 — conflates disease teaching with interpreter-mediated communication and mutates qualified to certified interpreter.
- Pair 21 — replaces an ostomy readiness leaf with an invented home-health/interpreter/clinic plan.
- Pair 22 — fabricates MMR contraindications and replaces dehydration return precautions with rotavirus/isolation management.
- Pair 23 — invents phototherapy and feeding details to manufacture a neonatal bilirubin/nutrition reconciliation.
- Pair 24 — again substitutes phototherapy for the jaundice-classification item and mutates obstetric warning cues.
- Pair 25 — combines invented phototherapy and absent car-seat/water-heater/bulb-syringe teaching under generic newborn care.
- Pair 28 — changes “rechallenge generally avoided” into an absolute “must not be restarted” rule used in reconciliation.
- Pair 29 — rewrites RR 7/difficult arousal/no SpO2 as RR 6/unresponsive/SpO2 84% with IV naloxone, then reasons from those inventions.
- Pair 35 — imports renal fluid restrictions and peripheral edema to create a broad fluid-balance shared decision.
- Pair 40 — misses the explicit frozen key/rationale reversal and incorrectly reports identical harmony.
- Pair 41 — adds heel offloading and moisture barriers to Item B and uses the false overlap to claim identical rules.
- Pair 43 — calls wound staging and Braden risk assessment complementary phases although they do not constrain the same decision.

### Minor

- Pair 1 — unsupported adult label for the acetaminophen arithmetic item.
- Pair 2 — unsupported pharmacologic class labels in otherwise correct independent calculations.
- Pair 5 — changes impending respiratory failure to impending arrest.
- Pair 6 — adds a general newborn HR range absent from the pair.
- Pair 7 — Chinese Item B wording is less exact about inflammatory warmth.
- Pair 8 — overstates parathyroid damage, active hematoma, and life-threatening status.
- Pair 10 — adds predictable pharmacokinetics and vitamin-K-antagonist classification.
- Pair 11 — adds “fatal” to the lactic-acidosis risk.
- Pair 12 — adds catheterization, bimanual massage, and an unsupported midline label.
- Pair 13 — adds vitals and a broader documentation step to the medication-error workflow.
- Pair 15 — adds complex-carbohydrate/protein composition and the “Rule of 15” label.
- Pair 18 — adds adult status and overcharacterizes a CPS discharge-plan leaf.
- Pair 26 — imprecisely groups CRP with cardiac enzymes.
- Pair 27 — adds a hematology consult absent from Item B.
- Pair 30 — adds substance-abuse/federal/public-bystander wording.
- Pair 32 — adds constricting clothing and drops the pacemaker item's four-week timing.
- Pair 34 — adds avoiding blood draws to the dialysis leaf.
- Pair 36 — adds flank pain and renal-tubule hemoglobin precipitation.
- Pair 38 — calls the inner cannula reusable without frozen support.
- Pair 39 — attributes LAD/anatomical details to Item A that are not item-A-derived.
- Pair 42 — adds intact fascia to the Stage 3 reconciliation.
- Pair 45 — adds a venous-congestion mechanism and attributes Item-B-only rules to both cases.
- Pair 46 — calls differing repositioning schedules identical and treats Item-B-only dietitian support as shared.

## Source traceability

Each EN and ZH candidate rule was checked against its scoped frozen item and allowed parent context.

| Rule field | Supported | Partial | Unsupported | Mutated |
|---|---:|---:|---:|---:|
| Item A EN | 31 | 9 | 5 | 1 |
| Item A ZH | 31 | 9 | 5 | 1 |
| Item B EN | 19 | 18 | 5 | 4 |
| Item B ZH | 18 | 19 | 5 | 4 |

Across 92 EN rules, 50 are fully supported and 42 are partial, unsupported, or mutated. Across 92 ZH rules, 49 are fully supported and 43 are partial, unsupported, or mutated. EN/ZH agreement frequently repeats the same unsupported addition; bilingual consistency is not source fidelity.

No external clinical research was needed to establish these findings. The failures are visible by comparing candidate claims with the supplied frozen bytes.

## Pair-specificity and template conclusion

Deterministic diagnostics found 0 exact duplicate combined blocks, 0 repeated exact six-token openings, an average pairwise Jaccard of 0.084303, and a maximum of 0.325581. Manual review found the highest-overlap clusters mostly explainable by shared source items or legitimate stylistic repetition.

Those diagnostics do not rescue the work product. Domain-level substitutions remain at pairs 17, 19–21, 25, 35, and 43, and semantic content absent from the current pair appears at pairs 21–25, 29, and 35. Run 3 avoids the old exact-copy signature but still fails pair-specific semantic judgment.

## Candidate-verification conclusion

The candidate verifier is correct about row count, numbering, pair identity/order, field completeness, enum/type validity, literal foreign-ID isolation, exact block uniqueness, and its Jaccard statistics. Its disclaimer also correctly says lexical variation does not prove semantic independence.

Its hard-gate claim that all EN/ZH rules are traceable is false. Concrete counterexamples exist at pairs 16, 21–25, 29, 35, and 41, among others. Literal scoped-ID isolation did not detect semantic contamination, and exact block uniqueness did not detect broad domain-level reasoning. The resulting traceability `PASS` is materially false.

## Post-blind historical comparison

The held historical artifacts say the old Gemini lane and human adjudication dismissed all 46 pairs and document the old Gemini failure as identical reconciliation boilerplate, including unrelated pressure-injury and MI content in Part B.

At the contradiction/dismiss level, the sealed blind key agrees with that historical adjudication on 45/46 pairs and disagrees at pair 40. The disagreement remains preserved: the frozen matrix labels `c2` as “Supports prevention” and `c1` as “Increases risk,” while the correct mapping assigns the four risk cues to `c2` and the turning schedule to `c1`; the EN/ZH rationale states the reverse. Run 3 agrees with the historical all-dismiss result on all 46 but misses this frozen defect.

Run 3 removes the old verbatim boilerplate signature yet reproduces its functional failure—reconciliation without exact pair-specific testing—and introduces additional failures in the item-rule summaries themselves and in the self-verifier's semantic traceability claim.

## Final rationale

The work product cannot be trusted without independent re-research. The combination of 15 major findings, one missed contradiction, nine false shared-decision calls, widespread unsupported EN/ZH rule extraction, semantic contamination, and a materially false traceability verification claim fails the Module A hard gates. A plausible or historically convergent bottom line does not cure an unsupported evidence chain.
