# Campaign 16 Phase E — Independent Checker Report

Date: 2026-09-08
Repository HEAD at freeze: `3286024bcab90c1a114811a7202d956c3e586bf4`
Checker artifact root: `audit/campaign-16-phase-e-anchor-parent-calibration-check-2026-09-08-r1/`
Producer artifact root (read-only, not modified): `audit/campaign-16-phase-e-anchor-parent-calibration-2026-09-08-r1/`

---

## 1. Primary disposition

### `BASELINE_GAP_INDEPENDENTLY_CONFIRMED`

The checker's own, independently-frozen adjudication of the 8 sampled multi-stage parent cases (40 affected embedded parts) identifies qualifying `BASELINE_BEFORE_FIRST_STAGE` findings in **4 of the 8 sampled parents** — twice the ≥2-parent threshold set by the owner question in Section 8 of the work order:

- `opus2_case_code_status_01` (claude-canonical) — 1 baseline part
- `gpt_case_gap_2026_06_11_case_adhf_01` (gpt-canonical) — 1 baseline part
- `gpt_case_warfarin_mvr_2026_06_11_01` (gpt-canonical) — 2 baseline parts
- `cs_thyroid_storm_main` (hard-cases-canonical) — 1 baseline part

Per the work order, this disposition means only that the sampled population independently demonstrates an ordinary declared-stage-only repair representation is insufficient for at least some affected rows, and that the current R3 repair architecture must not be launched unchanged. **It does not, on its own, authorize a sentinel, schema change, renderer change, null value, repair, or population-wide prevalence estimate** — those remain owner decisions, informed by but not dictated by this pilot.

---

## 2. Blinding / provenance statement

Before writing `checker-adjudications.json`, `checker-adjudications.md`, and `checker-freeze.json`, the checker read only:

- `audit/campaign-16-phase-e-anchor-parent-calibration-2026-09-08-r1/sample-manifest.json`
- `audit/campaign-16-phase-e-anchor-parent-calibration-2026-09-08-r1/sample-rationale.md`

from the producer directory (both explicitly permitted pre-freeze). `raw-case-data.json` in that directory was **not** read; instead, case content for all 8 sampled parents was independently pulled directly from the live canonical banks (`banks/claude-canonical.json`, `banks/gemini-canonical.json`, `banks/gpt-canonical.json`, `banks/hard-cases-canonical.json`) via `jq` extraction by parent id, per the explicit permission in Section 3 of the work order to read sampled parents directly from their live canonical banks.

None of the prohibited files (`producer-adjudications.json`, `producer-adjudications.md`, `locked-producer-freeze.json`, `locked-comparison.md`, `calibration-summary.json`, `report.md`) were read, grepped, searched via Git/object databases, or inferred from any derivative summary before the freeze. The full statement, file digests, and repository HEAD are recorded in `checker-freeze.json`.

The producer session's own artifacts (`locked-comparison.md`) record that it had explicitly **not** performed a checker comparison itself ("Independent checker comparison remains pending execution by an eligible external seat") and had refused to simulate one — this checker run, executed as a wholly separate session with its own blind derivation, fills that pending role.

---

## 3. Frozen checker counts

| | Count |
|---|---|
| Sampled parents | 8 |
| Affected parts adjudicated | 40 |
| BASELINE_BEFORE_FIRST_STAGE | 5 |
| AMBIGUOUS | 1 |
| STAGE:\<id\> (specific declared-stage anchor) | 34 |
| Parents with ≥1 BASELINE_BEFORE_FIRST_STAGE part | 4 of 8 |

Full per-part vector and evidence: `checker-adjudications.json` / `checker-adjudications.md`.

---

## 4. Baseline-gap evidence by qualifying parent

**`opus2_case_code_status_01` — `opus2_case_code_status_q1`.** Stem anchored "At 0700"; the patient's refusal statement and 0700 vitals/labs are in the always-visible top-level exhibits. Declared `stage_1` narrates the nurse *already having* documented capacity and verbatim statements — the correct answer — plus later provider-paging events. Revealing `stage_1` before the learner answers spoils the answer and discloses information past 0700.

**`gpt_case_gap_2026_06_11_case_adhf_01` — `gpt_case_gap_2026_06_11_adhf_matrix_01`.** All five matrix rows are drawn verbatim from the two top-level baseline exhibits (ED triage, initial diagnostics). The declared stage list has no "stage1" — the first declared stage (`adhf_stage2`) is a materially later deterioration event (30 minutes on, SpO2 84%, pink frothy sputum) that is not needed to classify the baseline triage findings and would blur the "current deterioration" reference point the stem asks about.

**`gpt_case_warfarin_mvr_2026_06_11_01` — `gpt_case_warfarin_mvr_2026_06_11_01_q1` and `_q2`.** Both stems are anchored to the 1030 admission encounter and cite only the top-level admission/assessment exhibits. Declared `stage_1_1400` narrates that the warfarin was *already* held and that the nurse *already* notified the provider of the naproxen exposure — both are the correct answers to Q1 and Q2 respectively. Revealing `stage_1_1400` first spoils both answers.

**`cs_thyroid_storm_main` — `cs_thyroid_storm_q1`.** Stem explicitly restricted to "the client's initial 0800 triage presentation"; all four matrix rows are top-level baseline vitals/assessment data, classifiable using general knowledge of hyperthyroidism vs. thyroid-storm presentations without any stage disclosure. Declared `stage_0830` discloses confirmatory labs (TSH, Free T4) and the treatment-order sequence tested in the very next embedded question (`cs_thyroid_storm_q2`) — none of which is needed to analyze the 0800 triage picture.

In every one of the 5 baseline findings, the pattern is the same: the part's own stem anchors it to a time point at or before the case's global/baseline material, and the first declared stage's content either narrates the correct nursing action as an already-completed fact (answer leakage) or discloses materially later clinical state than the question needs (premature exposure). No case in the sample was called `BASELINE_BEFORE_FIRST_STAGE` on the basis of general clinical plausibility alone without a concrete leak/exposure mechanism identified in that parent's own text.

One additional part (`cs_thyroid_storm_q3` / row 371) was returned `AMBIGUOUS` rather than assigned a specific stage, because its listed supportive interventions are not clearly gated behind either declared stage and the stem itself spans the full 0800–1200 window without anchoring to one stage. This is not a baseline-gap finding; it reflects a case where the repository content did not support a unique defensible earliest boundary without guessing (P8).

---

## 5. Comparison with producer after reveal

Full detail in `comparison.json` / `comparison.md`. Summary:

- **Part-level exact agreement: 39 / 40 (97.5%).** The single disagreement (`cs_thyroid_storm_q3` / row 371) is checker `AMBIGUOUS` vs. producer `STAGE:stage_0830` (HIGH confidence). Both sides agree this part is **not** a baseline case — the disagreement concerns exact stage choice, not the more fundamental baseline/no-baseline question.
- **Parent-level exact agreement on "does this parent contain ≥1 baseline part": 8 / 8 (100%).**
- **Shared baseline findings: 5 of 5** — the checker and producer identified the identical five parts as `BASELINE_BEFORE_FIRST_STAGE`, with no producer-only or checker-only baseline findings.
- Both gate-breach rows named in the sampling charter (row 370, row 395) resolve identically between checker and producer (`stage_0830` and `stage_2` respectively), and both sides independently confirm the prior audit's premise that anchoring those two rows to their named stage hides the later stage that would otherwise leak the answer.

This is a high-agreement, substantively converged result: two independently-derived adjudications, produced from separate blind reads of the same live case content, reached the same primary conclusion and the same specific parts.

---

## 6. Live schema/type/renderer contract findings

The work order asked that three things be verified rather than assumed, and kept distinct:

1. **Schema/type acceptance.** `src/types.ts` declares `answerableAfterStageId?: string` on `CaseSubQuestion` — a plain optional string with no enum or reference-type constraint. `src/schema.ts`'s `validateCaseStudyQuestion` (lines ~1194–1198) checks only that `stageId`/`answerableAfterStageId`, when present, are non-empty strings. **Neither the type system nor `validateBankObject`/`validateQuestion` requires `answerableAfterStageId` to match a member of `caseStudy.stages[].id`.** A string that names no declared stage passes schema validation.

2. **Renderer resolution behavior.** `src/examLayout.ts`'s `getVisibleCaseStages` is documented in its own comment as "cumulative and fail-open." If `answerableAfterStageId` is present but does not resolve to a declared stage id (via `stageIndexById.get`), the function falls through to check `stageId`; if that also does not resolve, it returns **all** stages, not zero stages. So an anchor value that fails to match a declared stage does not degrade to "baseline/nothing visible" — it degrades to "everything visible," which is the opposite of the visibility boundary this pilot is calibrating. `src/App.tsx`'s `CaseChartPane` independently confirms that the top-level `caseStudy.exhibits` array (baseline "Client record") renders unconditionally, separately from the stage-gated "Updates" section — so a genuine baseline/pre-stage state is a real, distinguishable rendering state in the live UI; it is simply not one any existing field value can currently select for a *staged* part.

3. **A separate raw-promotion gate, not the schema, currently enforces stage-id membership.** `scripts/audit/audit-stage-refs.ts` (`findStageReferenceFindings`, self-documented as "Advisory") is invoked with `{ strict: true }` from `scripts/raw-gate.ts` and its result is treated as **blocking** ("every finding kind is blocking") for raw case-study promotion: a staged part whose `stageId`/`answerableAfterStageId` does not resolve to a declared `caseStudy.stages[].id` fails `audit:stage-refs:raw-policy` at the promotion gate, distinct from schema/type validation. This is a real, live, blocking constraint — but it lives in the raw-promotion pipeline, not in `src/schema.ts` as the producer's `report.md` states ("Under `src/types.ts` and `src/schema.ts`, `answerableAfterStageId` must match one of `caseStudy.stages[].id`"). That specific attribution is inaccurate; the substantive conclusion the producer draws from it (that today's contract offers no accepted way to represent "answerable before the first stage" for a staged part) is independently corroborated by the checker's own reading, just via a different, more precise mechanism.

4. **No existing reserved baseline/pre-stage representation was found anywhere in the live contract.** A repository-wide check for a "baseline" or null-stage sentinel token in `src/schema.ts`, `src/examLayout.ts`, `src/types.ts`, and `scripts/audit/audit-stage-refs.ts` returned no matches. If a staged part is intended to be answerable using only baseline material, there is currently no field value that both (a) passes the raw-promotion gate's stage-membership requirement and (b) causes the renderer to show zero declared stages. Assigning such a part the first declared stage id is schema-valid and promotion-gate-valid, but — per the evidence in Section 4 above — can leak the answer or expose materially later information.

This checker draws no conclusion from these findings about what representation (if any) should be added; per Section 9 of the work order, no schema version, sentinel design, or renderer change is proposed or implied to be authorized by this observation.

---

## 7. What this experiment does and does not establish

**Establishes:**
- In this specific 8-parent, 40-part sample, 4 parents contain at least one part whose defensible earliest visibility boundary is before the first declared stage, independently confirmed by two separately-derived adjudications with 100% parent-level and 97.5% part-level agreement.
- The live contract currently has no accepted way to represent that boundary for a staged part without either failing the raw-promotion gate (an unresolved anchor) or exposing more than intended (an anchor forced to the first declared stage, which the fail-open renderer would then reveal in full alongside whatever else that stage narrates).
- The specific leak/exposure mechanism was independently identified and evidenced, part by part, not inferred from stage-count patterns or general clinical plausibility.

**Does not establish:**
- The prevalence of this gap across the full frozen population of 451 affected rows / 93 parents. The sample was drawn deterministically by stratum (per `sample-rationale.md`), not randomly, and 8 of 68 multi-stage parents (and none of the 25 single-stage parents) is not a basis for a population-wide rate estimate.
- That the 25 single-stage parents / 96 rows exhibit the same gap. The producer's `calibration-summary.json` raises a similar concern there ("single-stage cases frequently use global exhibits for baseline admission data while their sole declared stage represents a future follow-up") but this checker's charter and sample were scoped to the 68 multi-stage parents only, and this report draws no conclusion about the single-stage tier.
- Any specific repair, sentinel value, schema version, or renderer change. That determination is explicitly out of scope for this checker (Section 9 of the work order) and remains an owner decision.
- That R3 as currently scoped must be redesigned in any particular way — only that it must not be launched unchanged against parts whose correct boundary this pilot shows can be structurally unrepresentable under the existing declared-stage-only contract.

---

## 8. Recommended owner fork

Per the work order's Section 10 decision fork, and because the primary disposition above is `BASELINE_GAP_INDEPENDENTLY_CONFIRMED`:

**Stop R3 as currently scoped, and commission a narrow, separately-chartered investigation into a baseline-representation architecture change**, informed by (but not pre-decided by) Section 6's contract findings above. Any such investigation should itself specify its own read/write scope and independent-review routing per `AGENTS.md`/`DECISIONS.md`, rather than inheriting authority from this checker run.

---

## Files produced by this checker run

- `checker-adjudications.json`
- `checker-adjudications.md`
- `checker-freeze.json`
- `comparison.json`
- `comparison.md`
- `report.md` (this file)

No file outside `audit/campaign-16-phase-e-anchor-parent-calibration-check-2026-09-08-r1/` was created or modified by this checker run.
