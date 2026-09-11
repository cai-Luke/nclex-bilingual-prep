# External blind-checker handoff — producer freeze only

Commission root: `audit/campaign-16-anchor-boundary-repair-2026-09-09-r1/`

Work order: `scratch/CAMPAIGN-16-PHASE-E-451-BOUNDARY-REPAIR-WORK-ORDER-2026-09-09-R4.md`  
Work-order SHA-256: `8cd476c23f2b6cadb07ae8115fd675fbbfc3f60acb46d7a521d5d1da30b2558b`

Opening local-disk state: branch `main`, HEAD `a639b5fe7f6816e68228d7dc13d068c0c0f69e91`, configured upstream `origin/main` at the same commit, ahead/behind `0/0`. The opening index and worktree were clean. Read-only remote inspection confirmed the pre-commission push. No Git mutation operation was performed after opening.

Access snapshot: these producer artifacts are local and uncommitted. The external checker must use this explicit local disk snapshot; a GitHub-only reader cannot see the new commission artifacts. Reconfirm the listed source hashes and repository state before beginning the blind pass.

Mandatory preflight: PASS. The builder reproduced inventory SHA-256 `9f66750caaeead9d374742588856e2630a7fce09415bb7c2c662669a2af93e8e`; preflight self-tests passed 15/15. The live preflight matched every one of the 13 pinned bank hashes, all 451 unique row identities and 93 parent cases, pure-omission shape, and exact declared stage lists. See `evidence/inventory-build.json`, `evidence/preflight-self-test.json`, and `evidence/preflight.json`.

Complete producer reconciliation: **451 rows / 93 parents / 27 original packets**, with zero missing, duplicate, added, or split-parent identities. All 27 source packets still equal the live whole-parent objects. All 13 banks and all pre-existing tracked files remain byte-unchanged. The four affected row populations remain 58 Claude-bank, 46 Gemini-bank, 243 GPT-bank, and 104 hard-cases-bank rows.

Producer freeze: `producer-freeze.json`  
Producer freeze SHA-256: `151c1327a5d9fa4decf9897200f2d336e55cea31d0f978317a7653c5c4193e4a`  
Every producer packet has its own hash and freeze receipt. The freeze manifest exposes identity counts and hashes only; it contains no adjudication distribution or row reasoning.

The new read-only `tools/verify-boundaries.ts` passed 69 synthetic self-tests, application TypeScript and a focused strict TypeScript check. Its default/missing-input guards fail closed. This is future structural-verification tooling, not evidence of repaired banks or independent semantic acceptance.

Producer provenance: Codex / GPT-6 Astra. Bounded Astra descendants supplied the verifier implementation and producer semantic evidence for packets 001–009, 010–018 and 019–024. The primary Astra seat reconstructed packets 025–027 and recorded opening state, source snapshots, producer IO/reconciliation and the complete freeze. All belong to one producing tree; these contributions are implementation and producer evidence, not independent review. **Only external Claude Code / Claude Opus 5 is the declared independent content checker.** No checker context has been started or supplied producer judgments by this commission.

## Files the blind checker MAY read before its complete freeze

Use an allowlisted read scope; do not search the entire commission or this producing conversation.

- This `external-checker-handoff.md`, `opening-state.json`, `commission-manifest.json`, `producer-freeze.json` and `producer-freeze.sha256` (hash metadata only; do not open producer packets to recompute their hashes yet).
- `source-packets/repair-001.json` through `source-packets/repair-027.json`: whole-parent live-source copies plus frozen identity rows, with no adjudications.
- Live canonical `banks/*.json`; the exact frozen inventory at `audit/campaign-16-phase-e-anchor-omission-inventory-2026-09-08-r1/frozen-inventory.jsonl`; its `build-inventory.ts` and `preflight-verify.ts` for mechanical provenance only. R4 supersedes the old string-only post-repair rule.
- The R4 work order named above; `AGENTS.md`; the R4-required principles/routing in `DECISIONS.md`; `PROJECT-HISTORY.md`; `NCLEX-Question-Schema.md`; `BANK-REVIEW-LEDGER.md`; `BANK-CENSUS.md`; and `docs/AGENTS-RUNBOOK.md`.
- The accepted executable contract: `src/types.ts`, `src/schema.ts`, `src/caseVisibilityBoundary.ts`, `src/examLayout.ts`, `src/allowedKeys.ts`, `src/App.tsx`, `src/bankImport.ts`, `scripts/audit/audit-stage-refs.ts`, `scripts/raw-gate.ts`, `scripts/patch-raw.ts`, and `package.json`.
- `audit/campaign-16-phase-e-typed-baseline-support-implementation-2026-09-08-r1/independent-review-receipt.md` for the already accepted support-only contract.
- Commission `tools/verify-boundaries.ts` and `evidence/verifier-self-test.json` (synthetic tests only), plus `evidence/source-fingerprints.json`, `evidence/inventory-build.json`, `evidence/preflight-self-test.json`, and `evidence/preflight.json`.

## Files/directories the blind checker MUST NOT read until all checker packets are frozen

- The entire commission `producer/` directory, including all 27 producer adjudication packets.
- The entire commission `producer-support/` directory, including drafts, extraction/reasoning notes, authoring scripts and per-packet receipts that share that directory.
- This producing task's conversation, descendant conversations, messages, tool-output transcripts, or any extracted producer summaries, proposed boundaries, exception lists or disposition counts.
- Any other commission artifact not explicitly allowlisted above if it might expose producer judgments. Do not use directory-wide content searches that cross the exclusion boundaries.
- Prior Phase E semantic leak verdicts and parent-calibration adjudications are unnecessary for the blind pass and are excluded from this handoff's pre-freeze reading scope.

The checker must independently reconstruct **all 451 rows / 93 parents** using the earliest legitimate learner-visible boundary and R4's baseline/stage/exception domain, with bilingual relation and confidence recorded per row. Freeze and hash all 27 checker packets before producer outputs are revealed. This producer handoff provides no final accepted mappings, no bank changes, no schemaVersion changes, no patch files, no census/ledger/history updates, and no independent acceptance claim. Any comparison, acceptance or mutation belongs to a subsequent authorized stage after the blind checker freeze.
