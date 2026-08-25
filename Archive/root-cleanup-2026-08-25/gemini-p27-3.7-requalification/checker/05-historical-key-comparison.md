# Phase V — Post-Blind Historical-Key Comparison

## Reveal order

The blind key was sealed at `2026-08-25T06:03:12Z`. Candidate comparison artifacts `02`, `03`, and `04` were sealed at `2026-08-25T06:12:37Z`. The first held historical artifact was opened at `2026-08-25T06:12:57Z`, only after both seals.

Held artifacts opened:

- `Archive/root-cleanup-2026-06-26/CLAUDE-ARCHITECT-GEMINI-AUDIT-QUALITY-HANDOFF-2026-06-26.md`
- `Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-25.md`

No blind or candidate-comparison artifact was changed after reveal.

## Sealed independent verdicts versus historical adjudication

The historical artifacts adjudicate all 46 Gemini-lane pairs as dismissals and state that the full 104-pair Phase B audit contained zero contradictions. They do not expose a complete pair-by-pair `RECONCILABLE` versus `NULL-COHERENCE` classification in the two held documents, so comparison is made at the outcome-determinative contradiction/dismiss level.

- Sealed independent key: 1 `CONTRADICTION`, 21 `RECONCILABLE`, 24 `NO_SHARED_DECISION`.
- Historical adjudication: 0 contradictions; all 46 dismiss.
- Agreement at contradiction/dismiss level: 45/46.
- Visible disagreement: pair 40, `claude_cs_jun06_pressure_injury_bcc_01` × `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03`.

The blind pair-40 finding is not rewritten to match history. The V2 frozen Item B matrix defines `c2 = Supports prevention` and `c1 = Increases risk`, but its `correct` array assigns immobility, wet linens, 25% intake, and nonblanchable redness to `c2`, and the posted turning schedule to `c1`. Its EN/ZH rationale states the opposite, consistent with Item A. That is an explicit key-versus-rationale clinical contradiction in the supplied historical record. The held documents' zero-contradiction conclusion therefore conflicts with the frozen bytes examined in this check.

## Run 3 versus historical adjudication

Run 3 has 0 `CONTRADICTION` verdicts, 31 `RECONCILABLE`, and 15 `NO_SHARED_DECISION`. At the contradiction/dismiss level it agrees with the held historical outcome on all 46 pairs. That convergence does not validate Run 3 on its own face: it repeats the historical no-contradiction bottom line while independently missing the explicit pair-40 key/rationale reversal.

## Historically documented mechanism versus Run 3

The old incident documented two signature defects:

1. one reconciliation paragraph pasted verbatim across all 46 pairs; and
2. every Part B reconciliation importing unrelated pressure-injury and MI references.

Run 3 avoids those literal signatures:

- all 46 combined reconciliation blocks are exact-text unique;
- no foreign full scoped item ID occurs in a reasoning field;
- the reproduced average Jaccard is low, and the highest-overlap blocks were not themselves evidence of noun swapping.

Run 3 nevertheless reproduces the functional failure mechanism in a less literal form. Pairs 17, 19–21, 25, 35, and 43 use broad “discharge,” “transitional care,” “newborn care,” “fluid-balance nursing,” or “complementary phases” reasoning in place of an exact shared decision. Pairs 21–25, 29, and 35 import semantic clinical material absent from the scoped record. Pair 40 again reaches dismissal without actually testing the candidate key against the supplied rationale. Thus lexical variation removes the obvious stamp but does not establish pair-specific contradiction testing.

## New failure mechanisms revealed by the blind check

The historical handoff states that the old Gemini “teaches” lines were accurate and only the reconciliation step was boilerplate. Run 3 adds failures not captured by that description:

- Item-derived rule extraction itself is unreliable. Examples include fabricated phototherapy protocols, rotavirus/isolation management, newborn car-seat/water-heater/bulb-syringe teaching, altered opioid vital signs, and unprovided dialysis fluid restrictions.
- EN and ZH often reproduce the same unsupported addition, creating bilingual consistency without source fidelity.
- The candidate's own verifier materially mislabels a semantic hard gate as passed: “all rules traceable” is false, despite mechanically correct row/ID/enum/lexical checks.
- A real internal key/rationale contradiction is missed at pair 40. This is both a Run 3 defect and a disagreement with the historical adjudication, not an inference from the old expected result.

## Post-blind conclusion

Historical comparison strengthens, rather than changes, the sealed assessment: Run 3 avoids exact-copy boilerplate but remains untrustworthy for Module A because domain-level reasoning and unsupported source attribution still substitute for pair-specific evidence. Its perfect agreement with the historical all-dismiss outcome is not persuasive where the supplied frozen bytes expose a contradiction that both the historical adjudication and Run 3 missed.
