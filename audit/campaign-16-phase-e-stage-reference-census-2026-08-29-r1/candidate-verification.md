# Campaign 16 Phase E R1 — Stage 1 Candidate Verification

Status: **PASS — PRODUCER CANDIDATE, NOT ACCEPTED DISPOSITION**

## Frozen authority and scope

- Owner-frozen work order: `scratch/CAMPAIGN-16-PHASE-E-STAGE-REFERENCE-SEMANTIC-CENSUS-WORK-ORDER-2026-08-29.md`.
- Stage-0 and final live SHA-256: `91e7434905f52ef90f7288def1aa6d17118c3708b7e99d76f0384bfeeafad390` — exact match.
- Live Stage-0 population: 451 `revealsAllStages` targets across 93 parent cases, derived from all 13 current bundled banks; no historical denominator was inherited.
- Frozen packet surface: 75 packets; population SHA-256 `41412491aa1eb186352328bd8ae068180eb82d6ef852a21ce6327886e6adce85`; population-summary SHA-256 `5046a6c619bba62646765c6cf7f7ea35d33ad3e58cc799307a9e64eaf0ac6351`; packet-manifest SHA-256 `82040a7145f768e1f24a9f69839f41c927e1886e811848776362a3c210662598`.
- Stage 1 only was performed. The independent checker root remains absent. No Stage 2, Stage 3, repair, bank mutation, or Phase F work occurred.

## Semantic production and receipts

- Candidate coverage is 451/451 in exact global queue order, with every frozen population identity appearing exactly once.
- All 75 packet outputs passed the Phase-E-local candidate validator before acceptance and again at final batch verification: 75/75 PASS.
- Each semantic context processed exactly one packet. No context was resumed for a different packet or received running totals, prior/future semantic output, checker output, historical semantic verdicts, calibration material, or repair proposals.
- `semantic-contexts.jsonl` contains 75/75 receipts with packet identity/hash, output hash, validation status, and the recoverable collaboration context identity. Session ID, exact inherited model identifier, and exact inherited reasoning effort were not exposed by the collaboration harness and are recorded as `null` with honest availability explanations rather than invented values.
- Receipt SHA-256: `35346807e5fb8d9ac84f17d219818bf7baad0d6d36bcaa3502bc41c416820dab`.
- Already-valid outputs were preserved across usage windows. Fresh replacement contexts were used only where a prior context produced no accepted output: packets 016–018, 035, and 064. Packets 062–063 left complete outputs before their contexts reached the usage boundary; both outputs passed the validator and were preserved rather than rerun.
- One bounded same-packet mechanical retry was used for packets 002, 003, 007, 008, and 032. Only missing/global queue identity or required empty `unsafeStageIds` formatting was corrected; semantic fields were preserved.

## Aggregate and freeze

- `candidate-adjudication.jsonl` is the exact byte concatenation of the 75 validated packet files; orchestration did not rewrite semantic rows.
- Aggregate candidate SHA-256: `9f3e952b6b187a43c80246c28b181fe59390c4ed31b68b8707f918e1fac74349`; row count 451.
- Candidate report SHA-256: `8088ef239e172d2df5f86d401c403d35620cb132f2fc4a4700819438bb5576ef`.
- Candidate freeze SHA-256: `29b4973677eb1bab82af557ffeced2e6a034bb6118dd24097c56004e9660b82c`.
- Candidate primary verdict counts: LEAK 238; NO_LEAK_COMPLETE_RECORD 105; NO_LEAK_NONANSWERING_DATA 107; REVIEW 1. Bilingual relation: PARALLEL 451. These totals were computed only after packet outputs were locked and were never supplied to semantic contexts.

## Determinism and preservation

- A fresh Stage-1 deterministic rebuild from the live banks reproduced `population.jsonl`, `population-summary.json`, `packet-manifest.json`, and all 75 packet files byte-for-byte. The Phase-E-local comparison surface was then removed.
- Final `verify-resumability.ts --through 75`: PASS; all 13 bank hashes match Stage 0, all 75 packet hashes match, all 75 accepted output hashes match their receipts, and the checker root is absent.
- Opening live-worktree/index preservation: 530/530 frozen dirty paths unchanged; every tracked opening index blob unchanged; 0 unexpected paths/statuses outside the authorized producer root.
- No bank, stage anchor, runtime/source/test/package file, ledger, history, census artifact, governance file, historical July tree, Phase A–D tree, checker root, or Git index entry was modified by Phase E.

## Verification commands

| Command or gate | Result |
|---|---|
| `npx tsx .../validate-candidate-output.ts` for every `packet-001` through `packet-075` | PASS 75/75 |
| Initial final batch wrapper using macOS `seq -w` | Invocation error before reading outputs because it emitted two-digit names such as `packet-01`; no artifact changed; corrected immediately with explicit three-digit formatting |
| Corrected final 75-packet validator batch | Exit 0, PASS 75/75 |
| Fresh `build-packets.ts --out stage1-rebuild --skip-opening` and byte comparison | Exit 0; 451 targets, 93 cases, 75 packets; core 3/3 and packets 75/75 byte-identical |
| `npm run validate-bank -- banks/*.json` | Exit 0; 13/13 explicit banks parsed and validated |
| `npm run test:audit-stage-refs` | Exit 0; in-memory and explicit-file/strict regressions passed |
| `npm run census:check` | Exit 0; `census.json is up to date`; no regeneration |
| `npx tsc -b --pretty false` | Exit 0. The Phase-E-local audit tools are outside project `include` paths and were executed directly with `tsx`; the repository TypeScript projects nevertheless compile cleanly |
| `git diff --check` | Exit 0 |
| `npx tsx .../verify-resumability.ts --through 75` | Exit 0; `PHASE_E_RESUMABILITY_PASS completed=75 next=none` |

## Inherited trap dispositions

1. **2 MiB MCP search skip — ACTIVE/HANDLED.** Bank-wide population, bytes, hashes, and preservation used direct parsing, Node, shell, and Git inspection; MCP/repository search was not used as sole authority.
2. **Census byte instability — ACTIVE/HANDLED.** `npm run census:check` passed. Census was not regenerated and byte-for-byte regeneration was not used as proof.
3. **Strict stage-ref exit 1 — ACTIVE/HANDLED.** Stage 0 captured complete non-strict and strict output before inspecting status; strict exit 1 was the expected measurement behavior for a nonzero `revealsAllStages` population, not a fabricated failure.
4. **Canonical sweep silent skip — ACTIVE/HANDLED.** Explicit `npm run validate-bank -- banks/*.json` succeeded on all 13 bank paths; Stage-0 governing measurement also used the explicit `--file` audit path for all 13 banks.
5. **Frozen 2026-08-23 bow-tie generator — N/A/HANDLED.** No prohibited generator, finalizer, stateful, or write route was invoked and no frozen lineage was written.

This terminal is a producer candidate completion claim only. It does not accept the candidate verdicts, create checker authority, close Phase E, authorize repairs, or open Phase F.

`CAMPAIGN16_PHASE_E_CANDIDATE_READY`
