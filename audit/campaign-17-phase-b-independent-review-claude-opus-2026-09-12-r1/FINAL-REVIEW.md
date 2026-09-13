# Campaign 17 Phase B — Independent Review Receipt

**Terminal:** `CAMPAIGN17_PHASE_B_INDEPENDENT_REVIEW_COMPLETE`
**Review seat:** Claude Opus 5 (Claude Code), producer-independent
**Date:** 2026-09-12
**Pinned producer source:** `816272456fdf7062c5c62ed9845ac3f8166938df` (`codex/campaign-17-residual-successor-2026-09-12`)
**Phase-B snapshot:** `7e1c0dafab75e6dbf2309397c2d721f815a6bef1`
**Review branch:** `review/campaign-17-phase-a-independent-claude-opus-2026-09-12-r1`, continued from `8dbcae9`. The Phase-A artifacts are unchanged; their manifest verifies 56/56.

## Result

| | Count |
|---|---|
| Rows adjudicated | 75 / 75 |
| Parents screened | 19 / 19 |
| Banks | 3 |
| `MECHANICAL_MIGRATION_ACCEPT` | **75** |
| `MECHANICAL_MIGRATION_REJECT` | 0 |
| `MECHANICAL_REVIEW_HOLD` | 0 |
| `BOUNDARY_REVIEW_REQUIRED` | 0 parents / 0 rows |
| `BOUNDARY_SANITY_NO_OBVIOUS_DEFECT` | 19 parents / 75 rows |
| Producer disagreements | 0 |

All 75 rows satisfy the mechanical predicate. Each row's proposed operation adds `answerableAfterStageId` with the same currently resolving legacy `stageId` string. That operation preserves the selected stage boundary and the learner-visible stage prefix under the frozen source topology.

## 1. Freeze and identity

- The producer HEAD equals origin and its worktree is clean.
- The Phase-B freeze manifest verifies 53/53, both on disk and via `git show` at `8162724`. Phase-B artifacts show no diff between `7e1c0da` and `8162724`.
- `banks/`, `src/`, `scripts/` and `lib/` show no diff between the accepted base `d895d85` and `8162724`.
- The survey's code hashes match 7/7. The opening-state preservation groups all match: banks 13/13, Campaign 16 293/293, authority 11/11.
- The live `audit-stage-refs --strict` rerun exits **1** with **0 unresolved / 66 revealsAllStages / 75 missingRequiredAnchor**. That exit is expected because the canonical banks are intentionally still unrepaired. It is neither a review failure nor a passing canonical state. The output is identical to the producer's receipt apart from npm's run header.

## 2. Population, independently derived

My evaluator loads all 13 banks the way the canonical sweep does (`parseBankText` plus `validateBankObject({rejectUnknownKeys:true})`) and calls the live `findStageReferenceFindings({strict:true})`.

- The result is 75 rows: 6 in `claude-canonical`, 34 in `gpt-canonical`, 35 in `hard-cases-canonical`. They fall under 19 parents.
- The plan's identity set equals this population in both directions.
- There is no row-level or parent-level overlap with the 66 Phase-A rows.

## 3. Mechanical predicate, from live source

Traced consumers:
- `caseVisibilityBoundary.ts` (resolver)
- `examLayout.ts:getVisibleCaseStages`, which feeds the exam layout, the stacked layout via `stagesOverride`, PreviewLab and `reviewPrompt.ts`
- `schema.ts` and `bankImport.ts` (`hasSchema16CaseFields`, which checks both fields)
- `allowedKeys.ts` (both fields allowed)
- `audit-stage-refs.ts`, and the `raw-gate.ts` finding renderer

**Why equivalence holds.** `classifyCaseBoundary` treats a string the same way in the primary and legacy positions: `stageIds.lastIndexOf(value)`. The primary is consulted first and wins only when it resolves.

- **Before:** the primary is absent, so the legacy string resolves at index *i* and the resolver returns `prefix(i, field:"stageId")`.
- **After:** the identical string is in the primary position, so it resolves at the same *i* and the resolver returns `prefix(i, field:"answerableAfterStageId")`.

Only the diagnostic `field` changes. `getVisibleCaseStages` ignores `field`.

**Other consumers.** No learner-path code keys off the new field's presence:
- Shuffle seeds are ID-based.
- No content hashing of questions exists in `src/`.
- `reviewPrompt` consumes only the visible prefix.
- The only raw display of the field is the authoring PreviewLab readout (`App.tsx:2338`), which will show the value instead of "none".

**Per-row predicate.** Every clause passed on every row:

- **P1** Membership in the live strict population.
- **P2** The primary key is not an own property of the part.
- **P3** Legacy `stageId` is a non-empty string that resolves, with unique stage IDs and unambiguous resolution.
- **P4** The proposed value is identical to the legacy value, compared as UTF-8 bytes.
- **P5** The live resolver selects the same index before and after (legacy field before, primary field after) and matches the recorded resolutions.
- **P6** `getVisibleCaseStages` payloads are deep-equal, and the recorded visible/hidden IDs and payload hash reconcile.
- **P7** Each bank validates after mutation. The raw diff is exactly one added key, with no key-order drift.
- **P8** Legacy `stageId` is retained.
- **P9** Deleting only the added key restores deep and serialized equality.
- **P10** The pointer shape is correct, the parent/part identity matches, and the operation is `add` with `before.present=false`.
- **P11** Bank file bytes, parent, part, topology and visible-payload hashes match the plan.

**Whole proposal, in memory.**
- The three banks still validate.
- Strict counts go from 0/66/75 to 0/66/0, and the 66 `revealsAllStages` findings are deep-equal before and after.
- The raw diff is exactly the 75 planned adds.
- Across all 645 staged parts in the three banks, no visible prefix changed.

## 4. Controls

One positive control passes. All 22 adversarial controls are rejected, each on its expected clause(s):

- **Primary already present:** identical value, `null`, stale string, typed baseline.
- **Legacy defects:** absent, stale.
- **Topology:** duplicate IDs, reversed order.
- **Plan defects:** pointer retargeted to a sibling, a different valid stage, a near-identical value (trailing space).
- **Malformed primary:** baseline with an extra key, array, number, empty string, `{kind:"Baseline"}`.
- **Content or part changes:** learner content changed alongside the add, legacy deleted by the migration, part deleted, part substituted, stale bank hash, changed stage payload.

Two controls show that exact equality carries the proof, not prefix equality:
- **C11:** a non-resolving primary silently falls back to legacy, so the visible prefix is unchanged, yet the value is not the legacy string.
- **C14:** deleting legacy while adding the primary leaves the resolver output unchanged.

Both are rejected only by the value-equality and one-key-diff clauses. See `machine/evaluator-controls.json`.

## 5. 19-parent boundary sanity screen

**Method.** Two passes, both bounded to obvious internal dependencies (not clinical re-adjudication):
1. An automated screen (`tools/boundary_screen.py`) flags numbers or times the part cites that occur only in hidden stages, plus "Stage N" references that point to a hidden stage.
2. I read every parent's stages and all 75 population parts in full.

**Result.** No parent shows a stranded value, order, therapy, finding or timestamp. No visible material contradicts a value in a way caused by the boundary. No "Stage N" reference points to a hidden stage, and no anchor is plainly inconsistent with its item's text.

- All 11 automated hits are false positives: cloze placeholders `{{2}}`/`{{3}}`, "Stage 1" in a stem, values the stem itself supplies, or a number inside a distractor.
- The hidden-only values are keyed answers the boundary correctly withholds. Examples: burn q1's 31.5% TBSA appears only in stage2, and PE stage3's intermediate-risk classification is hidden from q2/q4.
- Recurring pattern in the `gpt_case_gap_*` family: ordered-response parts anchored at stage2 include "administer the prescribed X", which appears as started only in the stage3 trigger. That is anticipated-action sequencing, and stage2 is the defensible boundary.
- Two anchors are over-inclusive but answer-neutral: gallstone q1 ("admission data only") at stage_1, and PPH q1 at stage_1.

The calibration counterexample `opus3_iv_potassium_safety_case_01` is outside this population and was not added.

**Incidental observations, outside scope and not caused by any boundary.** These are recorded for a separate content lane, not adjudicated here:

1. `gpt_case_major_burn_inhalation_fluid_creep_01_q2`: the highlight segments quote BP 88/58, HR 130/min and "awake but anxious". None of these appears anywhere in the parent. The global 0640 data gives BP 90/60, HR 125, "conscious but confused".
2. `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_q1` and `_q2`: the highlight segments and distractors quote glucose 102 mg/dL, capillary refill 3 s and clear breath sounds. None of these appears in any exhibit.
3. `gpt_case_gallstone_pancreatitis_01_q4`: the rationale argues against "immediate CT for necrosis" and a "falling hematocrit" choice. Neither is among the six options.
4. `gpt_case_major_burn_inhalation_fluid_creep_01_q3`: the stem states 31.5% TBSA, which is the key for sibling q1. Whether a learner sees it depends on sibling rendering (`CaseActivePart` has a `hidden` prop), which I did not verify.
5. `gpt_case_gap_2026_06_11_case_pancreatitis_03` fib_04: the visible panc_stage3 exhibit shows urine output 38 mL/hr, which equals the computed answer. The answer is computable from the stem, and the rationale deliberately compares against this value.

## 6. Producer comparison

This comparison was done after the independent judgment above; see `producer-comparison.json`.

- **Agreement.** All 75 dispositions agree. Producer holds are 0, and so are mine. All 75 plan rows reconcile field-for-field.
- **Producer tool rerun.** I reran `legacy_survey.ts` in a disposable detached worktree at `8162724`, because the tool writes into `phase-b/`. It exited 0, and its outputs are byte-identical to the freeze.
- **N1 (integration-relevant).** The producer's `applyInMemory` never enforces the recorded `bankSha256`, `stageTopologySha256` or `visiblePayloadSha256` against the source. It checks parent/part hashes and an in-memory bank hash against its own load. An integration seat should enforce the bank-bytes and topology preconditions. All three match at `8162724`.
- **N2–N4 (informational).** The producer validated with default options rather than `rejectUnknownKeys`. Its "changed boundary" control uses a non-resolving string. Its learner-content control mutates a location outside the target parent. My controls C10, C11 and C13 cover the stronger cases.

## 7. Not authorized by this review

- Applying the 75-field migration, or any canonical bank write.
- Certifying the clinical content, or any historical boundary beyond the bounded obvious-dependency screen.
- Any Phase-A repair, Phase-C promotion or Phase-D work.
- Changes to the ledger, census, `PROJECT-HISTORY.md`, Campaign 16 evidence, or runtime/schema/audit code.
- Closing Campaign 17.

A separately authorized integration seat may implement the plan. It must enforce source preconditions (including N1) and run the normal gates and census procedure.

## Artifacts

- **Top level:** `REVIEW-STATE.json`, `row-adjudication.jsonl` (75 records), `parent-boundary-sanity.json` (19 records), `freeze-and-identity-receipt.json`, `producer-comparison.json`, `MANIFEST.json`
- **`tools/`:**
  - `evaluate.mts`: the independent predicate, whole-proposal check and controls
  - `boundary_screen.py`
- **`machine/`:**
  - `evaluator-rows.json`, `evaluator-whole.json`, `evaluator-controls.json`
  - `screen.json`
  - the reviewer-derived population lists (75 and 66)
  - the strict audit rerun output
