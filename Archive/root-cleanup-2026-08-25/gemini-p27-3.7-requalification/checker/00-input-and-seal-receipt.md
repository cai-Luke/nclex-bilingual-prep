# Input and Seal Receipt

## Startup boundary

- Checker: Codex, primary agent `/root`; model identity/configuration exposed to the checker: GPT-5-based Codex, exact backend model and reasoning setting not exposed.
- Disk snapshot: branch `main`, commit `3199bb0e4293f5ee0296d612ff9fdaf644c26c0b`; local branch was five commits ahead of `origin/main` at startup.
- Unrelated pre-existing repository state: untracked `audit/standalone-bowtie-answerability-census-2026-08-23/`; preserved and excluded.
- Startup metadata captured: `2026-08-25T05:52:24Z`.
- Work-order supplied SHA-256: `bc3c18087ae7a6176c7f7b479fb249209992ac43699c465361b564dc3320fd0`.
- Work-order recomputed SHA-256: `bc3c18087ae7a6176c7f7b479fb249209992ac43699c465361b564dc3320fd0` (`MATCH`).
- Contamination status at startup: `NOT_CONTAMINATED`. No Run 3 candidate content, earlier Gemini run, held historical answer artifact, later retrospective summary, or P31 answer-bearing artifact had been opened, grepped, parsed, summarized, or searched.

## Frozen V2 package hash gate

| Input | Expected SHA-256 | Recomputed SHA-256 | Result |
|---|---|---|---|
| `module-a/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md` | `2ddeb6699bea384a58b40b8f56c7b01366bb5b8b4a4d1f84b690a0b14cda36d7` | `2ddeb6699bea384a58b40b8f56c7b01366bb5b8b4a4d1f84b690a0b14cda36d7` | MATCH |
| `module-a/package-verification.md` | `eff589adc096af42f32a960d5e49ad3f3015abcbdcfb8cf84562631b5a60f615` | `eff589adc096af42f32a960d5e49ad3f3015abcbdcfb8cf84562631b5a60f615` | MATCH |
| `module-a/pair-scope.json` | `acf45ad57aac94623e115966a88d094803435dbeb9e7b23e6cfb549fa80e1af3` | `acf45ad57aac94623e115966a88d094803435dbeb9e7b23e6cfb549fa80e1af3` | MATCH |
| `module-a/pairs.jsonl` | `ad3858c4d8f16d65065c12ca82ad50a071d6754fb2b0ab96f26a65554534117d` | `ad3858c4d8f16d65065c12ca82ad50a071d6754fb2b0ab96f26a65554534117d` | MATCH |
| `module-a/snapshot-proof.md` | `75fbf95ef5c8249a75abe11a3efb00a869177040e06b7069ae6e8e974e1546a9` | `75fbf95ef5c8249a75abe11a3efb00a869177040e06b7069ae6e8e974e1546a9` | MATCH |

- Root `PACKAGE-RECEIPT.md` recomputed SHA-256: `198cd4abbe80c8227ee742288b2f701e1e42fe5b77328f98beb2cd7b942dd829`.
- Frozen-package gate result: `PASS`; Phase I authorized.

## Candidate pre-open metadata

Captured without opening, grepping, parsing, summarizing, or searching candidate contents:

| Candidate artifact | Initial SHA-256 | Initial byte size |
|---|---|---:|
| `pair-review.jsonl` | `766241510748475fc8e9c1bbbd525767bb3c291e5e33674f6225f4caabcc0cce` | 86005 |
| `report.md` | `ea990d702e15c0b3a060e5e18b009a574c079a56e3b494a291147328f9efa6f0` | 97948 |
| `verification.md` | `75cd17dd9f7d5ad521c83990609f74d9cc81e8439848366a75b71a4f8721eba9` | 3728 |

- First Run 3 candidate content opened: `2026-08-25T06:03:34Z`, after Seal 1 was written.

## Seal ledger

### Seal 1 — blind checker key

- Order event: after governance/frozen-package review and 46/46 independent adjudication; before any Run 3 candidate content was opened.
- Mechanical gate: 46 parseable rows; unique and complete pair numbers 1–46; projected part/local numbering and item identities matched `pair-scope.json`; required fields nonempty; enums valid.
- Seal time: `2026-08-25T06:03:12Z`.
- `01-blind-checker-key.jsonl`: SHA-256 `23eeb3ebc41a44a603947bc314d231588757fb0b448a85fb334e4f66ca76ebe9`; 62101 bytes.
- `01-blind-checker-key.md`: SHA-256 `fc62e71668c44a4bc904cf5e7d98bdd50a99955ec20c20f15fb1216132b23fc3`; 3465 bytes.
- Blind distribution at seal: `CONTRADICTION` 1; `RECONCILABLE` 21; `NO_SHARED_DECISION` 24.
- Candidate-open authorization: granted only after this receipt entry was written. The two blind-key artifacts are now immutable; any correction would require a separately versioned file preserving these bytes.

### Seal 2 — pre-reveal candidate artifacts

- Order event: after all 46 candidate rows, `report.md`, and `verification.md` were compared against the sealed blind key and frozen bytes; before either held historical answer artifact was opened.
- Mechanical gate: `02` contains 46 parseable records in exact pair order with all required comparison fields and valid enums; deterministic diagnostics cover all 1,035 pairwise reconciliation-block combinations; candidate-verification mechanical claims were independently recomputed.
- Seal time: `2026-08-25T06:12:37Z`.
- `02-candidate-comparison.jsonl`: SHA-256 `2bdf06f20fa69fc859905bc842aff0894f5b49a12e0503a26e41cba1192301d5`; 37884 bytes.
- `03-template-and-pair-specificity-audit.md`: SHA-256 `7718afe68ffb689258245d12b7115242f8036dd81e5692174c2ab2d919082847`; 4996 bytes.
- `04-candidate-verification-audit.md`: SHA-256 `2399e378615fb90e47ec0d4539f65ecb42cdbde08bcea3f234983f66128c914e`; 4928 bytes.
- Candidate comparison summary at seal: verdict agreement 36/46; severities `MAJOR` 15, `MINOR` 23, `OBSERVATION` 0, `NONE` 8.
- Historical-reveal authorization: granted only after this receipt entry was written. Artifacts `02`, `03`, and `04` are now immutable; any correction would require separately versioned files preserving these bytes.

### Historical reveal

- First held historical artifact opened: `2026-08-25T06:12:57Z`.
- First path opened: `/Users/holemini/Desktop/Project Shrimp/Archive/root-cleanup-2026-06-26/CLAUDE-ARCHITECT-GEMINI-AUDIT-QUALITY-HANDOFF-2026-06-26.md`.
- Second authorized path opened afterward: `/Users/holemini/Desktop/Project Shrimp/Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-25.md`.
- Ordering result: `COMPLIANT`; both pre-reveal seals preceded historical access.
- Contamination status after reveal: `NOT_CONTAMINATED`; no prohibited answer-bearing artifact was opened before authorization.

## Final integrity checks

- Final integrity check time: `2026-08-25T06:15:19Z`.
- Frozen V2 hashes reproduced unchanged at final check: `MATCH` for all five governed Module A inputs.
- Run 3 candidate artifacts reproduced their initial hashes and byte sizes exactly: `UNCHANGED` for `pair-review.jsonl`, `report.md`, and `verification.md`.
- Sealed blind-key and pre-reveal comparison artifacts remained byte-for-byte unchanged after their respective seals.
- Final repository state remained `main` at `3199bb0e4293f5ee0296d612ff9fdaf644c26c0b`, five commits ahead of `origin/main`, with only the same pre-existing untracked `audit/standalone-bowtie-answerability-census-2026-08-23/` shown by `git status`.
- Live-repository mutation by this checker: `NONE`.
- Overall P27/P31 decision or campaign authorization: `NONE`.
- Module B performed: `NO`.
