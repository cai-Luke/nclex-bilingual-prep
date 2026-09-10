# Campaign 16 Phase E Stage 2 — Resumption Note

**Status:** STAGE 2 COMPLETE AND **BLOCKED**. All 73 checker packets / 259 rows were collected, validated, hashed and locked; the §9.4 comparison against producer verdicts has now been performed and the no-leak safety gate **fails**.

**Terminal claimed:** `CAMPAIGN16_PHASE_E_BLOCKED_CHECKER_SAMPLE_DISAGREEMENT`

`CAMPAIGN16_PHASE_E_CHECK_COMPLETE` is not available. Stage 3 is not authorized. Machine-readable state is `comparison.json` and `partial-progress.json`; they are the authority over this prose.

## Why it is blocked

Two of the 20 checker-selected producer no-leak rows returned `LEAK`. Under §9.4 second bullet that blocks Phase E closeout rather than being patched row-by-row, because it demonstrates a producer false-negative inside the 192-row population that was to be accepted without full checking. §12 lists the same condition as a stop condition.

- **queueIndex 370** · packet-062 · `banks/hard-cases-canonical.json` · `cs_thyroid_storm_main` / `cs_thyroid_storm_q2` — producer `NO_LEAK_COMPLETE_RECORD` → checker `LEAK` on `stage_1200`.
- **queueIndex 395** · packet-066 · `banks/hard-cases-canonical.json` · `opus_tpn_case_mucositis_01` / `opus_tpn_case_mucositis_01_q3` — producer `NO_LEAK_NONANSWERING_DATA` → checker `LEAK` on `stage_3`.

Both entered the checker via the deterministic 10% sample. Evidence and both seats' reasoning are in `review.md`.

## The two checker REVIEW rows are resolved and are NOT the blockers

Both sit on **producer `LEAK`** rows, so §9.4 third bullet applies: accepted `REVIEW` disposition meaning the stage boundary is genuinely unrecoverable, routed to later full-case review, **non-blocking**.

- queueIndex 204 · packet-035 · `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03_q4`
- queueIndex 280 · packet-048 · `gpt_case_mass_casualty_start_triage_01_q5`

## Comparison result

259 selected rows: **201 exact agreements, 58 disagreements** — 51 recorded disagreements on full-check-routed rows (checker controls, non-blocking), 5 no-leak subclass disagreements (checker subclass controls, gate still passes), **2 blocking no-leak gate breaches**. Zero bilingual-relation disagreements. Accepted dispositions: `LEAK` 190, `NO_LEAK_NONANSWERING_DATA` 56, `NO_LEAK_COMPLETE_RECORD` 11, `REVIEW` 2.

Dominant direction is producer over-calling leakage: 48 producer `LEAK` rows downgraded to no-leak and 2 to `REVIEW`, against 2 producer no-leak rows upgraded to `LEAK`.

## Verified live at this boundary (all passed)

Work-order SHA `91e7434905f5…`; producer `candidate-freeze.json` `29b4973677eb…`; 13/13 bank hashes; 73/73 packet hashes; 73/73 locked review hashes with every receipt `PASS` and blinding asserted; 73 reviews ↔ 73 receipts 1:1; exact 259-row coverage with no gaps or duplicates; §9.1 selection independently re-derived to the identical 259-row set; validator self-test 18/18 negative controls and 73/73 packets re-validated live.

Preservation: HEAD `3286024`, branch `main`, 708 dirty paths outside the checker root at open and at close, 0 added, 0 removed, 0 status-code changes, 0 worktree content changes, 0 tracked index-blob changes, `git diff --check` clean. Writes confined to the checker root.

## Artifacts now present

`checker-adjudication.jsonl` (259 rows, byte-exact concatenation of the locked reviews in queue order), `comparison.json`, `review.md`, `verification.md`. Stage 3 artifacts do **not** exist and must not be created under this terminal.

## What the next seat does

Nothing, without a new owner commission. §9.4 on block: preserve the evidence and return to the owner. This commission may **not** expand the checker sample or rerun the producer census. `review.md` → *What the owner decides* lays out the visible options without taking one.

## Known documentation gap (unchanged, not an integrity finding)

`checkerPacketSetSha256` is not reproducible from any plain derivation of the per-packet hashes; 13 candidate derivations were tried and none matches. All 73 individual packet hashes match and the set is exactly complete, so the operative guarantee holds. **The frozen manifest was not mutated.**

## Notes carried forward

- **Validator sentence counting.** The generic validator splits on `.` `!` `?`, so a period-bearing abbreviation inflates the count. One bounded mechanical retry was used on packet-001; no verdict, stage list, evidence ID, bilingual relation or identity changed.
- **Antigravity canary.** Non-governing, never imported, never exposed to any semantic context.
- **Harvest before dispatch.** Relevant only if collection ever reopens: validate and lock complete-but-unlocked files in `reviews/` before spawning anything new.
