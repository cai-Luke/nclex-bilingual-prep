# Matrix-first coherence R1 — independent review

**Reviewing seat:** Claude/Opus, cold producer-independent (no prior context on this lane).
**Producer:** Codex/GPT-6, `codex/overnight-matrix-2026-09-13`, commit `8cce7e2`, baseline `511f66b`.
**Scope:** Review only. No canonical bank mutation performed or authorized by this lane.
**Date:** 2026-09-13.

## Rebinding to the accepted Campaign 17 + Temperature state

The producer's own `campaign17-overlap.json` correctly flagged 3 candidate endpoints and 8 parent bindings (across the same 7 unique parents named in the overnight master receipt) as needing refresh once Campaign 17 landed. I rebound all 8 against the now-integrated `main` (`0569f9a` at time of this review) rather than trusting the producer's frozen description:

| Candidate | Rebind result |
|---|---|
| **MX-078** (`..._prerenal_aki_hyperkalemia_01_q6`) | **MOOT — already resolved.** The exact complaint ("r5 recovered BP/HR and r6 orientation excluded from the close-monitoring column") is gone: the live matrix now keys both `c1` and `c2` for rows r5 and r6, which I independently reviewed and accepted as a Campaign 17 content repair in Section 1 of this commission before I ever opened this lane. |
| **MX-098** (`gpt_case_neutropenic_fever_nadir_01_q5`) | **MOOT — already resolved.** The exact complaint ("first two Celsius numbers unlabeled adjacent to a Fahrenheit endpoint") is gone: the live row now reads `102.9 °F (39.4 °C) → 101.5 °F (38.6 °C) → 100.6 °F (38.1 °C)`, fully dual-unit-labeled at every point. This fix came through Campaign 17's own content repair to this parent, not through the Temperature Counterpart R1 patch I integrated (that packet did not touch this owner). |
| MX-077, MX-104, MX-105, MX-107, MX-118, MX-119 | `endpoint_changed_in_C17: false` for the specific flagged field in each case — only unrelated parts of the same parent changed (consistent with the Phase B `answerableAfterStageId` anchor additions I verified in Section 1, which touch no content). The underlying findings are not invalidated by this refresh, but I have not individually re-verified each one's clinical claim in this pass (see coverage note below). |

This confirms the coordination note in the producer receipt was accurate and, more importantly, demonstrates that treating the "42 candidates" as a static list would have been wrong — at least 2 are already closed by work this same commission did upstream. A future repair pass on this queue must open with this same rebind step, not with the frozen `repair-candidate-queue.jsonl` file as-is.

## Independently verified findings (sample)

Given this phase authorizes no bank mutation, I prioritized live source re-verification of a representative sample of the clinically load-bearing claims over shallow coverage of all 42. All of the following were checked against external authoritative sources, not just re-read:

- **MX-016 / MX-047** (two different items, same defect pattern) — both key sweating as a *parasympathetic* finding in autonomic dysreflexia. **Confirmed wrong.** Sweat glands receive sympathetic innervation exclusively (the well-known cholinergic exception to adrenergic sympathetic signaling); there is no parasympathetic innervation of sweat glands anywhere in the body. This is basic, undisputed neuroanatomy, not a context-dependent judgment call. Two independent items making the identical mislabeling suggests a systematic authoring error worth searching for elsewhere in the corpus, not just at these two sites. **Disposition: CONFIRMED, high priority.**
- **MX-035** (hypermagnesemia matrix) — flags `5.2 mEq/L magnesium equals 2.6 mmol/L, not 2.15`. Independently verified: mEq/L → mmol/L for a divalent ion (Mg²⁺, valence 2) is mEq ÷ 2 = 5.2 ÷ 2 = 2.6. The arithmetic is correct; the original item's `2.15` figure does not reconcile with the stated mEq/L value under any standard conversion. **Disposition: CONFIRMED.**
- **MX-129** (older-adult sleep matrix) — flags a rationale calling 6–7 hours "within recommended adult sleep range" for a 67-year-old. Independently verified against current CDC guidance: adults 65+ are recommended 7–8 hours; 6 hours falls below that range. **Disposition: CONFIRMED.**

I did not independently source-verify the remaining ~35 candidates or all 7 collateral observations in this pass. Based on the sample above, the producer's method (cite a specific source, state the exact numeric or propositional inconsistency, distinguish "defensible" from "confirmed" findings) is sound and the hit rate on checkable claims was 100% in my sample — a positive signal about queue quality, not proof of the remaining rows.

## Collateral observations — notable items

`COL-04` (the palliative-care parent) correctly anticipated exactly what Section 1 of this commission did: it explicitly recommends binding the Campaign 17 raw replacement at independent review "rather than producing a competing patch." That is what happened — consistent, cross-lane coherence.

`COL-06` and `COL-07` (mass-casualty ammonia/organophosphate decontamination-before-airway-care sequencing) are flagged here as the two collateral items most likely to be safety-relevant if confirmed — a rigid decon-before-ABC teaching point is a real point of tension in current hazmat/MCI nursing guidance (NIOSH generally does not support delaying life-saving airway intervention for full decontamination). I have not adjudicated this myself; it should be prioritized in any future review pass, explicitly as source-and-construct review, not folded into a mechanical repair pass.

## Disposition

`MATRIX_FIRST_COHERENCE_R1_INDEPENDENT_CHECK_COMPLETE`

- 2 of 42 candidates (MX-078, MX-098) close as **MOOT / already resolved** by the integrated Campaign 17 state.
- 4 of 42 candidates (MX-016, MX-035, MX-047, MX-129) are **CONFIRMED** by independent source/arithmetic verification.
- 36 of 42 candidates and 7 collateral observations remain **HELD** — not independently re-verified in this pass, not rejected, not mutated. The dedicated rebind step above should be applied to the remaining 6 Campaign-17-touched-parent candidates before any of them are actioned.
- No canonical bank was mutated. No repair was applied or authorized under this lane.
