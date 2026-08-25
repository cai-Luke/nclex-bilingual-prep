# Delivery Receipt — Gemini P27 Run 3, Module A Independent Check

## Checker and disposition

- Checker seat: Codex primary agent `/root`.
- Exposed model/configuration: GPT-5-based Codex; exact backend model identifier and reasoning-effort setting were not exposed to the checker.
- Terminal disposition: `GEMINI_P27_RUN3_MODULE_A_CHECK_FAIL`.
- Authority limit: Module A only; no overall P27/P31 requalification decision, campaign authorization, or Module B work.

## Exact paths

- Repository/work-order root: `/Users/holemini/Desktop/Project Shrimp/`
- Work order: `/Users/holemini/Desktop/Project Shrimp/scratch/CODEX-GEMINI-P27-RUN3-MODULE-A-INDEPENDENT-CHECK-WORK-ORDER-2026-08-25.md`
- Frozen input root: `/Users/holemini/Desktop/gemini-p27-calibration-input-2026-08-25-v2/`
- Candidate root: `/Users/holemini/Desktop/gemini-p27-preflight-requalification-run3-2026-08-25/module-a/`
- Checker output root: `/Users/holemini/Desktop/gemini-p27-run3-codex-module-a-check-2026-08-25/`
- Historical artifact 1: `/Users/holemini/Desktop/Project Shrimp/Archive/root-cleanup-2026-06-26/CLAUDE-ARCHITECT-GEMINI-AUDIT-QUALITY-HANDOFF-2026-06-26.md`
- Historical artifact 2: `/Users/holemini/Desktop/Project Shrimp/Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-25.md`

The supplied work-order hash and recomputed hash were both `bc3c18087ae7a6176c7f7b479fb249209992ac43699c465361b564dc3320fd0`.

## Frozen-package integrity

| Input | Expected SHA-256 | Startup recomputation | Final recomputation |
|---|---|---|---|
| `module-a/GEMINI-COHERENCE-CROSS-PRODUCT-SPEC.md` | `2ddeb6699bea384a58b40b8f56c7b01366bb5b8b4a4d1f84b690a0b14cda36d7` | MATCH | MATCH |
| `module-a/package-verification.md` | `eff589adc096af42f32a960d5e49ad3f3015abcbdcfb8cf84562631b5a60f615` | MATCH | MATCH |
| `module-a/pair-scope.json` | `acf45ad57aac94623e115966a88d094803435dbeb9e7b23e6cfb549fa80e1af3` | MATCH | MATCH |
| `module-a/pairs.jsonl` | `ad3858c4d8f16d65065c12ca82ad50a071d6754fb2b0ab96f26a65554534117d` | MATCH | MATCH |
| `module-a/snapshot-proof.md` | `75fbf95ef5c8249a75abe11a3efb00a869177040e06b7069ae6e8e974e1546a9` | MATCH | MATCH |

Root `PACKAGE-RECEIPT.md` startup SHA-256: `198cd4abbe80c8227ee742288b2f701e1e42fe5b77328f98beb2cd7b942dd829`.

## Candidate integrity

| Candidate artifact | Initial SHA-256 | Initial bytes | Final SHA-256 | Final bytes | Result |
|---|---|---:|---|---:|---|
| `pair-review.jsonl` | `766241510748475fc8e9c1bbbd525767bb3c291e5e33674f6225f4caabcc0cce` | 86005 | `766241510748475fc8e9c1bbbd525767bb3c291e5e33674f6225f4caabcc0cce` | 86005 | UNCHANGED |
| `report.md` | `ea990d702e15c0b3a060e5e18b009a574c079a56e3b494a291147328f9efa6f0` | 97948 | `ea990d702e15c0b3a060e5e18b009a574c079a56e3b494a291147328f9efa6f0` | 97948 | UNCHANGED |
| `verification.md` | `75cd17dd9f7d5ad521c83990609f74d9cc81e8439848366a75b71a4f8721eba9` | 3728 | `75cd17dd9f7d5ad521c83990609f74d9cc81e8439848366a75b71a4f8721eba9` | 3728 | UNCHANGED |

Candidate content was first opened at `2026-08-25T06:03:34Z`, after the blind seal.

## Seal order

1. Blind key sealed at `2026-08-25T06:03:12Z` before any candidate content was opened.
   - `01-blind-checker-key.jsonl`: `23eeb3ebc41a44a603947bc314d231588757fb0b448a85fb334e4f66ca76ebe9`, 62101 bytes.
   - `01-blind-checker-key.md`: `fc62e71668c44a4bc904cf5e7d98bdd50a99955ec20c20f15fb1216132b23fc3`, 3465 bytes.
2. Candidate comparison sealed at `2026-08-25T06:12:37Z` before any historical artifact was opened.
   - `02-candidate-comparison.jsonl`: `2bdf06f20fa69fc859905bc842aff0894f5b49a12e0503a26e41cba1192301d5`, 37884 bytes.
   - `03-template-and-pair-specificity-audit.md`: `7718afe68ffb689258245d12b7115242f8036dd81e5692174c2ab2d919082847`, 4996 bytes.
   - `04-candidate-verification-audit.md`: `2399e378615fb90e47ec0d4539f65ecb42cdbde08bcea3f234983f66128c914e`, 4928 bytes.
3. First historical answer artifact opened at `2026-08-25T06:12:57Z`; the second named artifact was opened afterward.

Post-seal recomputation reproduced every sealed hash exactly. Contamination status: `NOT_CONTAMINATED`.

## Checker-artifact hashes

| Checker artifact | SHA-256 | Bytes |
|---|---|---:|
| `00-input-and-seal-receipt.md` | `b0d16f87f51263d317b03b51a31b1a0faef7c604b0ea685c94aa166ee47bed85` | 6523 |
| `01-blind-checker-key.jsonl` | `23eeb3ebc41a44a603947bc314d231588757fb0b448a85fb334e4f66ca76ebe9` | 62101 |
| `01-blind-checker-key.md` | `fc62e71668c44a4bc904cf5e7d98bdd50a99955ec20c20f15fb1216132b23fc3` | 3465 |
| `02-candidate-comparison.jsonl` | `2bdf06f20fa69fc859905bc842aff0894f5b49a12e0503a26e41cba1192301d5` | 37884 |
| `03-template-and-pair-specificity-audit.md` | `7718afe68ffb689258245d12b7115242f8036dd81e5692174c2ab2d919082847` | 4996 |
| `04-candidate-verification-audit.md` | `2399e378615fb90e47ec0d4539f65ecb42cdbde08bcea3f234983f66128c914e` | 4928 |
| `05-historical-key-comparison.md` | `7e782b548e91ddb18d90ef29e5db3f7a8ce3f72d296779a49e3c08c0915485cf` | 4966 |
| `final-report.md` | `f21c557cf60b51b1ef5212a445524899406631a5f9862cd79f1891a0445ce800` | 8455 |
| `_tools/build_candidate_comparison.mjs` | `1be60525575653f5fcf5a6cb53db99a2bfd16ee86875430a913dfb04be159cfa` | — |
| `_tools/template_diagnostics.mjs` | `04c50fc173bf360315904e1199cfb0dd3b360aed4c053d52fa285650466dceeb` | — |
| `_tools/verify_candidate_claims.mjs` | `4fd168414191be713bb9b710ddfdb2b4772a48d36759fe240dff66da843acd00` | — |
| `_tools/template-diagnostics.json` | `f9d729bdbe4a06471aa70e9ad2fd26810db421099a517833a4680e7d9ceb4db6` | — |
| `_tools/candidate-claim-checks.json` | `ff046edc90f0b3997252035ce2c414696779ad899b9a645db6f1f0b268abd9fd` | — |

`receipt.md` cannot embed its own whole-file hash without changing that hash; its final SHA-256 is supplied with delivery.

## Repository mutation check

- Initial/final branch and commit: `main`, `3199bb0e4293f5ee0296d612ff9fdaf644c26c0b`, five commits ahead of `origin/main`.
- Initial/final status showed only the same pre-existing untracked `audit/standalone-bowtie-answerability-census-2026-08-23/`.
- Live repository mutation by checker: `NONE`.
- Candidate, frozen package, and historical artifacts were not edited.
