# June 13 Matrix Swap Regression Repair Report

## Candidate identity

- Worktree: `/Users/holemini/Desktop/shrimp-matrix-swap-repair-2026-08-25`
- Branch: `codex/june13-matrix-swap-regression-repair-2026-08-25`
- Base HEAD: `3c33c03afc6bb06ab1f98cc772b13cae274f55a8`
- Origin defect: `91ab9606269d4e5a82b4bf613234c06db5830276`
- Exact oracle: `91ab960^` = `b3a68e890988ca7155dcc8113881b3a36ddf6826`
- Preflight: PASS — 8/8 targets occurred exactly once, reproduced the exact uniform swap, retained a compatible scoring construct and bilingual rationale direction, and were safe to restore.
- Sealed preflight SHA-256: `6933e048f7ad797c0b443d5cac12715322d11c75c94505739e18e4b0806f4158`

## Exact mutation surface

Only the five `correct[].columnIds[0]` scalar values on each of the eight named matrix leaves changed (40 scalar values total). Row IDs, row/column definitions, stems, EN/ZH rationales, category/topic metadata, sources, glossary, ordering, every other child, and all other questions are unchanged. The repair was applied by `scripts/patches/2026-08-25-june13-matrix-swap-regression-repair.ts` using exact-before/exact-after guards and stable embedded child selectors.

### `gpt_gap_2026_06_12_nonmcq_balanced_case_post_fall_ltc_02_q2`

| Row / cue | Keyed before | Keyed after | Existing rationale direction |
|---|---|---|---|
| r1 / new disorientation | Document and monitor | Escalate promptly | Change from baseline may indicate an acute head injury or delirium. |
| r2 / post-fall emesis | Document and monitor | Escalate promptly | Vomiting after a fall is a concerning neurologic sign. |
| r3 / unequal pupils | Document and monitor | Escalate promptly | Anisocoria after a fall requires prompt escalation. |
| r4 / shortened, externally rotated leg | Document and monitor | Escalate promptly | This pattern suggests a possible hip fracture. |
| r5 / small nonbleeding abrasion | Escalate promptly | Document and monitor | This local injury should be documented but is not the urgent change. |

### `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q1`

| Row / cue | Keyed before | Keyed after | Existing rationale direction |
|---|---|---|---|
| r1 / needs two staff to turn | Supports prevention | Increases risk | Immobility increases sustained pressure. |
| r2 / incontinence and damp linens | Supports prevention | Increases risk | Moisture increases skin-breakdown risk. |
| r3 / 25% meal intake | Supports prevention | Increases risk | Protein-calorie deficit impairs tissue tolerance and healing. |
| r4 / nonblanchable sacral redness | Supports prevention | Increases risk | Nonblanchable redness is early pressure-injury evidence. |
| r5 / posted turning schedule | Increases risk | Supports prevention | Scheduled turning reduces pressure duration. |

### `gpt_gap_2026_06_12_nonmcq_balanced_case_delirium_family_04_q1`

| Row / cue | Keyed before | Keyed after | Existing rationale direction |
|---|---|---|---|
| r1 / hearing aids absent | Supports orientation | Increases delirium risk | Reduced sensory input increases confusion risk. |
| r2 / visible clock and calendar | Increases delirium risk | Supports orientation | Time/date cues support orientation. |
| r3 / severe sleep disruption | Supports orientation | Increases delirium risk | Poor sleep increases delirium risk. |
| r4 / familiar photos | Increases delirium risk | Supports orientation | Familiar images and voices support orientation. |
| r5 / PRN diphenhydramine | Supports orientation | Increases delirium risk | Anticholinergic exposure may worsen confusion. |

### `gpt_gap_2026_06_12_nonmcq_balanced_b_case_interpreter_consent_02_q2`

| Row / cue | Keyed before | Keyed after | Existing rationale direction |
|---|---|---|---|
| r1 / English-only instructions | Supports discharge readiness | Requires follow-up before discharge | Instructions must be understandable to the client or caregiver. |
| r2 / qualified phone interpreter | Requires follow-up before discharge | Supports discharge readiness | Qualified interpreter access supports accurate teach-back. |
| r3 / unsafe aspirin teach-back | Supports discharge readiness | Requires follow-up before discharge | The response is unsafe and demonstrates failed understanding. |
| r4 / no responsible adult confirmed | Supports discharge readiness | Requires follow-up before discharge | Adult supervision is needed after sedation. |
| r5 / post-sedation drowsiness | Supports discharge readiness | Requires follow-up before discharge | Drowsiness affects learning and safe discharge planning. |

### `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_contact_diarrhea_09`

| Row / cue | Keyed before | Keyed after | Existing rationale direction |
|---|---|---|---|
| r1 / gown and gloves before contact | Needs correction | Appropriate contact-precautions action | Gown and gloves reduce contact contamination. |
| r2 / reuse unclean stethoscope | Appropriate action | Needs correction | Unclean shared equipment can transmit organisms. |
| r3 / remove PPE before exit and clean hands | Needs correction | Appropriate contact-precautions action | Removal before exit prevents environmental spread. |
| r4 / mask for every routine interaction | Appropriate action | Needs correction | A routine mask is not required without splash or another indication. |
| r5 / disinfect surfaces and equipment | Needs correction | Appropriate contact-precautions action | Environmental cleaning reduces transmission. |

### `gpt_gap_2026_06_12_nonmcq_balanced_b_matrix_stroke_rehab_10`

| Row / cue | Keyed before | Keyed after | Existing rationale direction |
|---|---|---|---|
| r1 / upright for meals | Requires follow-up | Supports safe rehabilitation progression | Upright positioning lowers aspiration risk. |
| r2 / thin water through straw | Supports safe progression | Requires follow-up before implementation | Thin liquid and straw use may be unsafe with dysphagia. |
| r3 / check food pocketing | Requires follow-up | Supports safe rehabilitation progression | Pocketing can cause choking or aspiration. |
| r4 / supervised transfer with gait belt | Requires follow-up | Supports safe rehabilitation progression | Supervised assistive transfer supports mobility and reduces falls. |
| r5 / rush meals | Supports safe progression | Requires follow-up before implementation | Rushing increases aspiration risk. |

### `gpt_2026_06_13_case_delirium_uti_01_q1`

| Row / cue | Keyed before | Keyed after | Existing rationale direction |
|---|---|---|---|
| r1 / abrupt 36-hour change | Supports baseline dementia | Supports acute delirium | Rapid change over hours to days is a delirium cue. |
| r2 / positive CAM and fluctuation | Supports baseline dementia | Supports acute delirium | Inattention and fluctuating consciousness support delirium. |
| r3 / baseline word-finding pauses | Supports acute delirium | Supports baseline dementia | This is the client's documented chronic baseline. |
| r4 / febrile symptomatic UTI findings | Supports baseline dementia | Supports acute delirium | Infection is a reversible acute delirium precipitant. |
| r5 / prior mild Alzheimer dementia | Supports acute delirium | Supports baseline dementia | The diagnosis establishes chronic baseline rather than the abrupt syndrome. |

### `gpt_2026_06_13_case_delirium_uti_01_q4`

| Row / cue | Keyed before | Keyed after | Existing rationale direction |
|---|---|---|---|
| r1 / creatinine and BUN improve | Continue monitoring / not fully resolved | Interventions are working | Improving renal markers support resolving prerenal injury. |
| r2 / urine output and color improve | Continue monitoring / not fully resolved | Interventions are working | The trend shows better hydration and renal perfusion. |
| r3 / temperature and WBC improve | Continue monitoring / not fully resolved | Interventions are working | Defervescence and lower WBC show treatment response. |
| r4 / CAM remains positive | Interventions are working | Continue monitoring / not fully resolved | Persistent delirium requires continued safety planning. |
| r5 / only half a meal tolerated | Interventions are working | Continue monitoring / not fully resolved | Incomplete intake remains a recovery and discharge risk. |

The q4 r3 row received only the accepted `018f7b0` WBC notation normalization after the oracle (`14,200/µL → 14.2 ×10³/µL`; `10,400/µL → 10.4 ×10³/µL`, both languages). That value-equivalent notation edit did not change the row's response-to-treatment construct.

## No-op target disposition

- `fhr_gemini_smoke_2026_06_13_06`: `NO_OP_TARGET_CORRECT`.
- `io_matrix_prerenal_aki_recheck_04`: `NO_OP_TARGET_CORRECT`.

Both remained unmodified. Their exact locations, committed net no-op evidence, key/rationale comparisons, and runtime-sequencing limitation are recorded in `no-op-target-review.md`.

## Verification results

- Machine scope assertion `AUTHORIZED_EIGHT_COLUMNIDS_ONLY`: PASS — 8 changed scored leaves, 40 changed scalar paths, all repaired keys equal the oracle, all target non-`correct` fields unchanged.
- Canonical patch in-process validation and disk reread: PASS (760 top-level GPT questions); strict parity: no warnings.
- `npm run validate-bank -- banks/*.json`: PASS, all 13 banks.
- `npm run audit`: exit 0; Tier 0/1 gates pass, with the expected no-raw-draft `audit:integrity` notice and the established 451 stage-reference advisories.
- `npm run test:grading`: PASS (includes matrix scoring behavior).
- `npm run test:schema-bank`, `test:audit-integrity`, `test:audit-ids`, `test:presentation-normalization`, `test:case-completeness`, and `test:audit-references`: PASS.
- `npm run coverage-report`: PASS; inventory unchanged at 1,930 session units, 2,516 scored leaves, 340 matrix leaves, and 199 visual artifacts.
- `npm run census:check`: PASS; no census movement and no regeneration.
- `npx tsc -b --pretty false`: PASS.
- `npm run build`: PASS, including file-compatible build generation and build-identity validation; only the existing chunk-size advisory appeared.

## Boundaries and handoff

`BANK-REVIEW-LEDGER.md` was left unchanged. Its enumerated status vocabulary has no state for a canonical correction whose required independent checker is still pending, and the recent targeted-correction precedents were ledgered only after independent review completed. Adding a new pseudo-status would misrepresent established policy. The acceptance seat must add the bounded correction entry after independent acceptance, recording the eight IDs, defect/oracle commits, forensic package, accepted repair commit, and completed checker chain. `PROJECT-HISTORY.md`, `DECISIONS.md`, `scripts/patch-matrix.py`, both no-op targets, census artifacts, historical June audit records, and governance/process materials were not modified.

Historical June audit correction and process changes remain pending and were not performed. Independent acceptance is still required: `INDEPENDENT_CHECK_REQUIRED`.
