# N01 resolving-anchor answerability — independent method review

**Reviewing seat:** Claude/Opus, cold, independent of the Codex/GPT-6 producer seat.
**Producer:** `codex/overnight-n01-2026-09-13`, commit `f3b52f2`, baseline `511f66b`.
**Scope:** Method review only. No bank mutation. The remaining 441 resolving leaves are **not** dispatched by this review.

## What I checked

- Independently recomputed the calibration's own row counts from `calibration-primary-v1.jsonl`: 41 rows, class distribution 25 `ANSWERABLE_AT_BOUNDARY` / 7 `ANSWER_SPACE_OR_KEY_DEFECT` / 6 `ANSWER_SUPPLIED_BY_VISIBLE_INFORMATION` / 1 `CONTENT_SHARED_SURFACE_REPAIR_REQUIRED` / 1 `MISSING_REQUIRED_INFORMATION` / 1 `INSUFFICIENT_EVIDENCE` — matches the report exactly.
- Read the single `INSUFFICIENT_EVIDENCE` / source-legal-hold row directly (`gpt_case_unsafe_assignment_01_q6`): the rationale asserts nurses must never document that an incident report was filed because of privilege, without specifying a jurisdiction. That is a genuine unresolved legal-scope question (incident-report privilege is jurisdiction-specific in the US), not a dodge — correctly held rather than adjudicated.
- Read the actual `opus3_iv_potassium_safety_case_01` rows (the work order's named motivating sibling case): q1 and q5 are exactly the ones carrying I2/I3 conflict tags in the raw data, consistent with the report's narrative description rather than a post-hoc gloss.
- Spot-verified the visibility-boundary technical claims against live source: `src/App.tsx:4024` (`hidden={caseQuestion.id !== activeQuestion?.id}`) and the `<section>` at `:4305` receiving that `hidden` prop — confirmed inactive sibling parts genuinely carry the HTML `hidden` attribute as claimed, not asserted without grounding.
- Read `instrument-v2-proposal.md` in full against each of the three named conflicts.

## Assessment of the three method questions

**1. Does the instrument cleanly distinguish boundary sufficiency from key/answer-space/shared-content/disclosure/sibling-dependency defects?** Not yet, and the calibration is honest about that rather than papering over it. I1 (established protocol/prior teaching as legitimate input vs. disclosure of the target conclusion), I2 (a quoted/proposed statement in a response option treated as a verified patient fact vs. an unverified premise), and I3 (a summary that pre-labels findings vs. one that supplies legitimate context) are real, recurring conflations — 11 of 41 rows (27%) carry a competing V1 reading, and I independently confirmed several of the cited examples are genuine rather than cherry-picked edge cases.

**2. Is V2's proposed fix adequate, or hand-wavy?** It is concrete and directly targeted at each named conflict, not generic tightening:
- I1 is addressed by §1's "freeze the functional target before viewing the key" plus §3's "preserve legitimate established diagnoses/orders when learners must match patient facts to them" — this gives a specific rule (established plan as an *input to compare against*, not as *the answer itself*) rather than leaving the two cases distinguishable only by feel.
- I2 is addressed by §2's given/proposition/candidate-claim taxonomy, which explicitly separates "a quoted proposed report is a candidate claim whose truth must be independently supported by the visible chart" from "a stated scenario fact is a given" — this is exactly the missing rule that let potassium q5 and the unsafe-assignment quoted-delay row get read two ways under V1.
- I3 is addressed by §3's reproducible disclosure test (remove the suspect authored conclusion, check whether the answer remains derivable from raw facts) — this converts a subjective "does this feel like disclosure" call into a comparison anyone can rerun and get the same answer from.

**3. Was the calibration's parent selection and boundary reconstruction adequate?** Yes on both counts I checked directly: the 8-parent purposive sample deliberately spans typed-baseline, primary-string, and legacy-resolving boundary kinds and multiple content shapes (the work order's own listed criteria), and the visibility-boundary claims trace to real, verifiable source lines rather than assumed behavior.

## Ruling

**`RECALIBRATE_BEFORE_EXPANSION`**

Not `ADMIT_EXPANSION_AS_WRITTEN` — I1/I2/I3 are real, and expanding V1 across the remaining 441 leaves would propagate the same ~27% conflict rate, most consequentially into rows where a quoted/proposed statement (I2) or a pre-labeled summary (I3) could get silently routed to the wrong primary class rather than flagged.

Not `REJECT_INSTRUMENT` — 30 of 41 rows (73%) classify without dispute, the closed-taxonomy-with-precedence design and the required-field list are sound, the calibration correctly declined to force decisions on ambiguous rows just to hit a clean number, and V2's proposed fixes are specific rather than a vague promise to "be more careful."

Not `ADMIT_EXPANSION_WITH_AMENDMENTS` — applying V2's rules inline while expanding into all 441 leaves in the same pass would be exactly the "silently changing a census midstream" failure mode the producer's own proposal explicitly warns against. A rule that has not yet been tested against the same calibration set it was designed to fix should not be trusted on 441 new leaves in its first outing.

**Smallest useful next calibration:** re-run V1's same 8 frozen parents (42 leaves, 41 eligible) under V2's rules, applying them twice without further edits to check self-consistency (the proposal's own step 5), and confirm that the 11 previously-conflicted leaves now route to a single, defensible class each under the new target/premise contract and disclosure-comparison test. If that re-run is clean, admission to the remaining 441 leaves is reasonable without a third calibration round. If new conflation surfaces, freeze a V3 and repeat — do not expand on a rule that has not yet demonstrated it resolves the problem it was written to fix.

No bank mutation. The 441 remaining leaves are not dispatched by this review, consistent with the governing commission's explicit instruction.

`RESOLVING_ANCHOR_ANSWERABILITY_R1_METHOD_REVIEW_COMPLETE`
