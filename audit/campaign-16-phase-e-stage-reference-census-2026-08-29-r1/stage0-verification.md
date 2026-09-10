# Campaign 16 Phase E R1 — Stage 0 Verification

Status: **PASS**

## Frozen authority and opening state

- Owner-frozen work order: `scratch/CAMPAIGN-16-PHASE-E-STAGE-REFERENCE-SEMANTIC-CENSUS-WORK-ORDER-2026-08-29.md`
- Live/frozen SHA-256: `91e7434905f52ef90f7288def1aa6d17118c3708b7e99d76f0384bfeeafad390` — exact match before artifact creation and at this gate.
- Repository: `/Users/holemini/Desktop/Project Shrimp`; branch `main`; HEAD `3286024bcab90c1a114811a7202d956c3e586bf4`; upstream `origin/main`; ahead/behind `0/0`.
- Both Phase E producer and checker roots were absent before the authorized producer-root creation. The checker root remains absent.
- Opening dirty state: 530 paths (29 tracked, 501 untracked), frozen with live-worktree SHA-256 and tracked index blob identity in `opening-state.json`. The Phase E producer root is intentionally excluded because it did not exist at opening.
- All 13 bundled bank raw-byte hashes and combined snapshot `540b5463f94ded8b88708f49f7e80b76ae0d560edf65d0dd75521c8962e2af0d` are frozen in `opening-state.json` and `packet-manifest.json`.

## Mechanical gates and inherited traps

1. **2 MiB MCP search skip — ACTIVE/HANDLED.** Population, bank bytes, and identity reconciliation used direct parsing, Node, and shell; MCP search was not authority.
2. **Census byte instability — ACTIVE/HANDLED.** `npm run census:check` exited 0 with `census.json is up to date.` Census was not regenerated.
3. **Strict stage-ref exit 1 — ACTIVE/HANDLED.** Complete explicit-file outputs were captured before status inspection. Non-strict emitted `WARN`/exit 0; strict emitted `FAIL`/exit 1, the required measurement behavior with a nonzero `revealsAllStages` population.
4. **Canonical sweep silent skip — ACTIVE/HANDLED.** `npm run validate-bank -- banks/*.json` exited 0 on all 13 explicit bank files, and the governing stage-reference runs used one `--file` argument per bank.
5. **Frozen bow-tie generator — N/A/HANDLED.** No 2026-08-23 bow-tie generator, opening-identity, finalizer, or write route was invoked.

`npm run test:audit-stage-refs` exited 0; both the in-memory fixtures and explicit-file/strict pathway tests passed.

## Fresh live measurement

- Successfully validated/loaded banks: **13/13**.
- `revealsAllStages`: **451** targets across **93** parent cases.
- `unresolved`: **0**.
- strict `missingRequiredAnchor`: **75**.
- Per-bank targets: Claude 58, Gemini 46, GPT 243, hard-cases 104, all nine other bundled banks 0.
- This is a fresh live derivation. Equality with Phase A's 451/93 is recorded as zero drift, not inherited authority.
- July identity-only reconciliation: 451 historical identities; additions 0; removals 0; membership/path changes 0. No historical semantic output was read or used.
- Raw-bank drift against Phase A: `banks/gpt-canonical.json` and `banks/hard-cases-canonical.json` changed as expected from later Campaign 16 phases; the other 11 bank hashes match Phase A. Current live bytes govern.

## Packet and validator freeze

- Population SHA-256: `41412491aa1eb186352328bd8ae068180eb82d6ef852a21ce6327886e6adce85`.
- Population-summary SHA-256: `5046a6c619bba62646765c6cf7f7ea35d33ad3e58cc799307a9e64eaf0ac6351`.
- Packet-manifest SHA-256: `82040a7145f768e1f24a9f69839f41c927e1886e811848776362a3c210662598`.
- Packets: **75**, with all **451** targets and all **93** parent cases kept whole.
- Limits: no ordinary packet exceeds 20 targets or 300,000 UTF-8 bytes. Twenty-seven whole single-case packets exceed the byte limit and are explicitly marked `oversizedSingleCase: true`; maximum 519,734 bytes. No evidence was truncated.
- Every packet carries current bank snapshot hashes, authored-order stages, complete target response/key/rationale/strategy, global and staged learner-visible evidence, sibling outlines without sibling keys, deterministic evidence IDs, and exact JSON source paths.
- A second Phase-E-local build reproduced `population.jsonl`, `population-summary.json`, `packet-manifest.json`, and all 75 packets byte-for-byte. The comparison surface is removed after this record.
- Candidate validator valid control: 1/1 accepted. Required synthetic negative controls: 16/16 rejected, covering missing, duplicate, extra, out-of-order, wrong identity, unknown verdict, unknown bilingual relation, foreign/cross-case/another-part evidence, undeclared stage, malformed LEAK/non-LEAK stage use, inadequate REVIEW explanation, and repeated boilerplate.

No bank, runtime/source/test/package, ledger/history/census/governance, historical July tree, work order, index, or unrelated worktree path was modified by Stage 0.

`CAMPAIGN16_PHASE_E_PACKETS_READY`
