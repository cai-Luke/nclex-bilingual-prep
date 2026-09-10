# Campaign 16 Phase E — Stage 2 Checker Verification

**Stage:** Phase E Stage 2 (§9) comparison session.
**Terminal reached:** `CAMPAIGN16_PHASE_E_BLOCKED_CHECKER_SAMPLE_DISAGREEMENT`.
**Machine-readable authority:** `comparison.json`.

Every claim below was re-derived from live disk in this session. Nothing is carried on the authority of `partial-progress.json`, `RESUMPTION-NOTE.md`, or any prior session summary; those were read only as navigation hints.

## A. Pre-comparison verification — all passed before any producer file was read

| # | Gate | Result |
|---|---|---|
| 1 | Frozen work-order SHA-256 | PASS — live `scratch/CAMPAIGN-16-PHASE-E-STAGE-REFERENCE-SEMANTIC-CENSUS-WORK-ORDER-2026-08-29.md` = `91e7434905f52ef90f7288def1aa6d17118c3708b7e99d76f0384bfeeafad390`, equal to `opening-state.json` and `checker-packet-manifest.json` |
| 2 | Producer `candidate-freeze.json` identity | PASS — `29b4973677eb1bab82af557ffeced2e6a034bb6118dd24097c56004e9660b82c`, matching both `opening-state.json` and `checker-selection.json`; producer `candidate-adjudication.jsonl` = `9f3e952b6b187a43c80246c28b181fe59390c4ed31b68b8707f918e1fac74349`, unchanged since checker open and equal to the value recorded in `checker-selection.json` |
| 3 | All 13 frozen bank hashes | PASS — 13/13 bundled banks raw-byte SHA-256 equal to the Stage-0 freeze |
| 4 | All 73 checker packet hashes | PASS — 73/73 files hash and byte-length match the manifest; 73 on disk, 73 declared, no extras or omissions; packet `targetCount` sums to 259; `checker-selection.json` = `cddf2709f849548529168ea7f575165c7f2924df0bbbd892ed49e4fcd1acde3e`, equal to the manifest `selectionSha256` |
| 5 | All 73 locked review hashes and validator status | PASS — 73/73 byte-identical to their recorded hashes; every receipt `validation: PASS`; every receipt's `checkerPacket.sha256` still matches the manifest; every `rowCount` equals its packet `targetCount`; every receipt records `producerOutputExposed`, `otherCheckerOutputExposed` and `aggregateTotalsExposed` all false |
| 6 | 73 reviews ↔ 73 semantic-context receipts, 1:1 | PASS — file set equals receipt set exactly; no duplicate, orphaned or unlocked file; receipt `packetId` set equals the manifest `packetId` set |
| 7 | Exact 259-row checker coverage | PASS — 259 rows, 259 distinct `queueIndex`, no gaps or duplicates; per-packet sequence equals the frozen manifest order; every row's `packetId` matches its file; every row identity (`bankPath`, `parentCaseId`, `partId`) matches the frozen selection derivation |
| 8 | Worktree/index preservation outside the checker root | PASS — see §C |

## B. Live re-validation of the checker corpus

The checker-local validator was re-run this session, not trusted from receipts:

- `tools/validate-checker-output.ts --self-test` → `checker validator controls passed: valid 1/1, negative 18/18`;
- all 73 packets re-validated against their frozen packets → **73/73 valid, 0 failures**.

`checker-adjudication.jsonl` is a byte-exact concatenation of the 73 locked `reviews/packet-###.jsonl` files in queue order, verified by independent reconstruction. 259 rows, `queueIndex` strictly ascending, 259 distinct. SHA-256 `ed3bbc7a2eaee168412c311a41949e15f314ffc27f1612ddf1b4c1a578530838`.

## C. Repository-state preservation

- `HEAD` `3286024bcab90c1a114811a7202d956c3e586bf4`, branch `main` — both unchanged from `opening-state.json`.
- Dirty paths outside the checker root: **708 at checker open, 708 now.** 0 added, 0 removed, 0 status-code changes.
- All 708 opening dirty paths re-hashed: **0 worktree content changes** against the recorded `worktreeSha256`.
- All 708 opening index identities re-read: **0 tracked index-blob changes** (29 staged blob identities and 679 not-in-index sentinels, all matching).
- `git diff --check` clean.
- No new Git path exists outside the two owned Phase E audit roots.
- No `git add`, commit, push, merge, stash, restore, reset, checkout, clean or branch switch was performed. No bank, ledger, census, history, governance, runtime, test, package or historical audit tree was touched.

Writes this session were confined to the checker root, which §5 assigns to this stage: `checker-adjudication.jsonl`, `comparison.json`, `review.md`, `verification.md` (new), and `partial-progress.json` / `RESUMPTION-NOTE.md` (updated evidence).

## D. §9.4 application

Precondition satisfied before any producer verdict was exposed: every checker semantic row locked and hashed (73 packets, 259 rows). Producer verdicts were read only after gates 1–8 passed.

- **Full-check-routed rows (producer `LEAK` or `REVIEW`) — 239.** The locked checker verdict is the authoritative accepted disposition. 188 agreements, 51 recorded disagreements. Non-blocking by rule.
- **No-leak safety-gate rows (producer no-leak) — 20.** All 20 entered via the deterministic 10% sample; 0 via non-`PARALLEL` bilingual relation, that population being empty. 18 returned a no-leak verdict (13 exact-subclass agreements, 5 subclass disagreements which §9.4 records with the checker subclass controlling while the gate passes). **2 returned `LEAK`.**
- **Gate result: BLOCK.** queueIndex 370 (`cs_thyroid_storm_q2`, producer `NO_LEAK_COMPLETE_RECORD` → checker `LEAK`) and queueIndex 395 (`opus_tpn_case_mucositis_01_q3`, producer `NO_LEAK_NONANSWERING_DATA` → checker `LEAK`).
- **Both checker `REVIEW` rows sit on producer `LEAK` rows** (queueIndex 204, 280) and therefore fall under §9.4 third bullet: accepted `REVIEW` disposition, routed to later full-case review, **non-blocking**. Neither contributes to the block.
- Bilingual-relation disagreements: 0.

No semantic re-adjudication was performed, because §9.4 requires none — the checker verdict controls full-check-routed rows and a gate breach blocks rather than being re-adjudicated. Every comparison result is mechanical and reproducible from `checker-adjudication.jsonl` and the producer `candidate-adjudication.jsonl`.

## E. Section 7.2 inherited trap dispositions

1. **2 MiB MCP search skip — HONORED.** No claim in this session rests on MCP text search. All hashing, coverage, identity and status derivation used direct file reads, Python and `git` in the shell.
2. **Census byte instability — N/A THIS STAGE.** No census regeneration and no generated-file byte comparison occurred. `census.json` is byte-unchanged.
3. **Strict stage-ref exit 1 — N/A THIS STAGE.** No stage-reference audit was run; this stage compares frozen semantic output.
4. **Canonical sweep silent skip — N/A THIS STAGE.** No bank sweep was run; the 13 explicit bank paths frozen at Stage 0 were each hashed individually by path.
5. **Frozen bowtie generator — N/A/HANDLED.** No stateful bowtie generator or finalizer route was invoked.

## F. Deliberately not run, and why

§11 lists `npm run test:audit-stage-refs`, `npm run validate-bank -- banks/*.json`, `npm run census:check` and `npx tsc -b` as gates "before `CAMPAIGN16_PHASE_E_READY`" — the Stage 3 / closeout terminal. This session terminates at the Stage 2 blocking terminal and does not claim `CAMPAIGN16_PHASE_E_READY`, so those gates are out of scope here. They are also the class of command most likely to write to the tree, and the block makes the preservation guarantee the more valuable thing to protect. They are carried forward for whichever commission attempts closeout.

## G. Carried-forward findings

- **`checkerPacketSetSha256` non-reproducible — documentation gap, not an integrity failure.** Thirteen plain derivations were attempted this session; none reproduces the recorded `9b944b104dfa31e7d3a84418f3cc91d2e093ffb15eefe30ffb9a895e0b308c18`. All 73 constituent packet hashes independently match and the packet set is exactly complete, so the operative guarantee holds. **The frozen manifest was not mutated** to make the aggregate reproducible.
- Validator sentence-counting strictness and the non-governing Antigravity canary carry forward unchanged; see `review.md`.

## H. Stop boundary

Stage 3, Phase F, repair, bank mutation, ledger mutation, census mutation, governance mutation, commit, push and index changes were **not** begun. Per §9.4, on block the evidence is preserved and the commission returns to the owner; the checker sample was not expanded and the producer census was not rerun.
