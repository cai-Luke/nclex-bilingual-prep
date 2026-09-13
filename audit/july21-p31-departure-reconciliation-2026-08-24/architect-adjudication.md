# July 21 P31 departure — cold architect adjudication

**Seat:** Claude/Opus, cold architect, independent of the Codex/GPT-6 reconciliation seat that produced `reconciliation.jsonl` / `reconciliation.md` / `receipt.md`.
**Governing order:** `scratch/JULY21-P31-DEPARTURE-RECONCILIATION-CODEX-WORK-ORDER-2026-08-24.md`, Revision 5, §11.
**Input:** the three reconciliation deliverables, preserved in this directory as delivered from the detached worktree (`reconciliation.jsonl` verified byte-identical to the worktree copy before commit).
**Date:** 2026-09-13.

## Verification performed before ruling

I did not take the reconciliation's terminal or counts on faith. Before ruling:

- Confirmed `RECON_HEAD` (`511f66b7b7cb830649613793f0264725be25d450`) matched owner `main` at commission start, and that the detached worktree's `git status` showed only the three deliverable files, nothing else touched.
- Independently re-executed the receipt's embedded derivation script (the classification logic, not the full provenance-search portion) directly against the frozen inputs and reproduced **59 OUTCOME_CORROBORATIVE / 4 CANDIDATE_OUTCOME_DETERMINATIVE / 4 CLASS_ONLY_DIVERGENCE**, with the exact same 8 divergent IDs the deliverables report.
- Spot-checked the highest-stakes provenance citations directly against live repository files rather than trusting the report's line/commit claims:
  - `audit/campaign-16-phase-c-closeout-2026-08-28-r6/owner-adjudication.md` — confirmed it exists and accepts `FAIL_UNSUPPORTED_TOKEN_PREMISE` for `gpt_format7c_exercise_hypoglycemia_bowtie`, as claimed.
  - `BANK-REVIEW-LEDGER.md:1593` area — confirmed the Phase D twelve-ID roster includes this exact ID, as claimed.
  - `audit/campaign-16-phase-c-check-2026-08-27-r5/check.md` and `.../phase-d-check-2026-08-29-r2-retry-1/review.md` — confirmed the recorded independent-checker `PASS_STANDALONE` dissent language matches exactly.
  - The one modifying commit (`cea79bd1`) — confirmed its date and subject against `git log` directly.

These checks did not turn up any daylight between the reconciliation's claims and the live repository. I did not re-verify all 67 rows' provenance individually or re-derive the full Task C history trace myself; I relied on the reconciliation's own double-run verification (stated byte-identical on a second execution) for that portion, having confirmed its highest-stakes citations independently.

## Ruling A — historical consequence

**Finding: the July 21 seating closes as a historical process violation with no demonstrated content-integrity consequence. No `T` entry is warranted.**

Reasoning, applying the work order's own closure test to each of the four `CANDIDATE_OUTCOME_DETERMINATIVE` rows (the only rows that can be outcome-determinative; the four `CLASS_ONLY_DIVERGENCE` rows are excluded from this test by the work order's own rule and are addressed separately below):

1. **`gpt_fmtgap_2026_07_14_or_toddler_choking_16`** — primary PASS/KEEP; Gemini checker FIX. Present, unchanged since audit HEAD. The canonical state reflects the primary's disposition; Gemini's contrary recommendation was never acted on. No consequence.
2. **`gpt_format7b_circumferential_burn_perfusion`** — primary FIX; Gemini checker PASS (disagreeing in the *opposite* direction, recommending against repair). Present, unchanged. Neither verdict was acted on — the item simply was never repaired by anyone. No canonical action rests on Gemini's judgment here.
3. **`gpt_format7c_exercise_hypoglycemia_bowtie`** — primary PASS/KEEP; Gemini checker FIX. This is the one row that was later **modified** (commit `cea79bd1`, 2026-09-09, Campaign 16 Phase D). But the repair traces to an entirely separate, later chain: a Campaign 16 Phase C producer disposition (`FAIL_UNSUPPORTED_TOKEN_PREMISE`), an independent Claude checker's *dissenting* `PASS_STANDALONE` verdict preserved and recorded (not silently overridden), and an explicit 2026-08-28 owner adjudication that knowingly accepted the producer's FAIL over the Claude dissent. None of this chain cites or depends on the July 21 Gemini checker verdict — the repair that actually happened would have happened identically whether or not Gemini had ever been seated in that lane. This is independently recorded support from a later non-Gemini review and a completed owner adjudication, satisfying the work order's closure condition on its own terms.
4. **`gpt_format11a_acute_mesenteric_ischemia`** — primary PASS/KEEP; Gemini checker FIX. Present, unchanged, and additionally corroborated by an independent non-Gemini pilot review (`gpt-5.6-sol`/Codex desktop, 2026-07-22, `PASS`) agreeing with the primary against Gemini's FIX. No consequence, plus independent support for the disposition that actually stands.

Every one of the four rows that could have been outcome-determinative either (a) never had Gemini's recommendation acted upon at all, or (b) had its eventual repair independently re-derived and owner-adjudicated through a wholly separate later process. No canonical removal or repair in the bank today rests materially on unreplicated Gemini judgment from the July 21 seating. The four `CLASS_ONLY_DIVERGENCE` rows never qualify for a `T` entry by the work order's own rule (identical verdict/disposition, differing label only); three of the four additionally have later non-Gemini review references on record (of narrower, terminal-function scope, correctly not treated by the reconciliation as a renewed construct verdict — I agree with that scoping and do not extend it further here).

## Ruling B — current generation scope

**Finding: this reconciliation decides nothing about current Gemini routing, and I am not opening or implying a `P27` requalification here.**

The reconciliation surfaces 12 rows where the checker's own raw self-reported harness (`rawCheckerModelHarness`) contradicts the recorded/stamped `revealSeat` — most commonly `gemini-2.5-pro` appearing as a self-report under a row recorded as `Gemini CLI / Gemini 3.6 Flash`. Per the work order's binding non-goal (§2.8) and the reconciliation's own explicit framing, a raw self-report is a claim about how a row was produced, not authenticated execution identity. I am not treating `gemini-2.5-pro` (or any other raw value) as proof of which model executed those 12 rows, and I am not using it to infer anything about the identity of the generation involved in the 2026-06-26 forcing incident, nor about whether Gemini 3.1 Pro and Gemini 3.6 Flash are the same or successor generations under current `P31`/`P27`.

This is worth carrying forward as an open **data-hygiene** observation, not a governance ruling: roughly 18% of the 67 rows (12/67) show the historical logging pipeline's stamped harness disagreeing with the executing seat's own self-report. That is relevant context if a future `P27` requalification commission is opened for the current Gemini lane, but it does not itself authorize, motivate, or shortcut one, and I am not proposing one now.

## Disposition

- No `banks/**` mutation.
- No `DECISIONS.md` entry (per the work order's explicit instruction not to propose one; my finding is that no consequence was demonstrated, so there is nothing to record there).
- No routing or `P27` change.
- The three reconciliation deliverables plus this adjudication are preserved under version control at this path, discharging the work order's preservation requirement without needing to retain the detached worktree further for that purpose. (The detached worktree itself is left untouched; teardown is the owner's call, not mine.)

**Terminal:** `JULY21_P31_DEPARTURE_ARCHITECT_ADJUDICATED`
