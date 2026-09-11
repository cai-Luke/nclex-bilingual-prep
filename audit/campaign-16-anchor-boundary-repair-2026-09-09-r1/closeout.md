# R4 executor closeout

CAMPAIGN16_BOUNDARY_REPAIR_READY_FOR_INDEPENDENT_CONFORMANCE_CHECK

MECHANISM_REMOVED_REPAIRED_SUBSET_ONLY

**451 = 369 repairedBaseline + 16 repairedStage + 66 exceptions**

The repaired subset contains 385 rows. The 66 final exceptions remain unchanged and fail-open. No third semantic adjudication or override occurred.

## Pinned commission identity

- Access: live local disk; branch `main`; HEAD `a639b5fe7f6816e68228d7dc13d068c0c0f69e91`; upstream `origin/main`, ahead/behind `0/0`.
- Producer freeze SHA-256: `151c1327a5d9fa4decf9897200f2d336e55cea31d0f978317a7653c5c4193e4a`.
- Checker freeze SHA-256: `f506178017ce44c6b4429d2125e2542ad89eb56565c4fab82dece08b32b5ba43`.
- Frozen inventory SHA-256: `9f66750caaeead9d374742588856e2630a7fce09415bb7c2c662669a2af93e8e`.
- Work-order SHA-256: `8cd476c23f2b6cadb07ae8115fd675fbbfc3f60acb46d7a521d5d1da30b2558b`.
- All 27 producer and 27 blind checker packets remain byte-identical to their frozen hashes. The full 451-row / 93-parent identity population is preserved.

## Exact bank accounting

| Bank | Repaired baseline | Repaired stage | Exceptions | Schema before → after | P15 operations |
|---|---:|---:|---:|---|---:|
| `banks/claude-canonical.json` | 46 | 5 | 7 | 2.0 → 2.1 | 51 |
| `banks/gemini-canonical.json` | 38 | 2 | 6 | 2.0 → 2.1 | 40 |
| `banks/gpt-canonical.json` | 201 | 7 | 35 | 2.0 → 2.1 | 208 |
| `banks/hard-cases-canonical.json` | 84 | 2 | 18 | 1.8 → 2.1 | 86 |

All four banks receive accepted baseline objects; their conditional exact schema bumps preceded baseline patching. Only accepted answerableAfterStageId fields and those four schemaVersion values changed in bank data. Every other parsed field is positively proven unchanged.

| Bank | Opening SHA-256 | Final SHA-256 |
|---|---|---|
| `banks/claude-canonical.json` | `25f53ded1ac21da4ca9d211040c3f6110ebee38d72ba41d0fc64fe358ba73b71` | `9777aaad1f40ad7be449a7399e7d3706060a6a8e19d5d54909d121ab8480c69e` |
| `banks/gemini-canonical.json` | `3dc416a4652f5f5712219dde7de87b92f0697fac953750b8abb8fc0dbb976bb6` | `fd98f560f93851c82b6c691aeeb3f3897aee3c2bf7a9268d973a0c7c7fff2901` |
| `banks/gpt-canonical.json` | `d7d228afc282bd15bc730be4ca5b3d2c7c14c017bbc14f3d12a7cbccbfef0f20` | `154c31f860790d5e90f23dae2dabfd31fba32ca46cc53a38b038cc56af30d469` |
| `banks/hard-cases-canonical.json` | `5d47b79a1e63fe5f852eab7b4ab9b8db6ca7e9ec924037d5e81de8a8bb3ee3d1` | `8af1a86256278900b619f83812087dfb0e940ea349a00ceddef9fe2f079ca8e3` |

## Exceptions

All three checker MEDIUM rows and the explicit checker EXCEPTION are among the 66 final exceptions. Disjoint reason combinations:

- `PRODUCER_EXCEPTION; BOUNDARY_DISPOSITION_DISAGREEMENT`: 6.
- `CHECKER_EXCEPTION; BOUNDARY_DISPOSITION_DISAGREEMENT`: 1.
- `BOUNDARY_DISPOSITION_DISAGREEMENT`: 48.
- `CHECKER_NON_HIGH`: 2.
- `STAGE_ID_DISAGREEMENT`: 1.
- `PRODUCER_EXCEPTION; PRODUCER_BILINGUAL_UNCERTAIN; BOUNDARY_DISPOSITION_DISAGREEMENT`: 1.
- `PRODUCER_EXCEPTION; PRODUCER_NON_HIGH; BOUNDARY_DISPOSITION_DISAGREEMENT`: 6.
- `CHECKER_NON_HIGH; STAGE_ID_DISAGREEMENT`: 1.

## Verification and production identity

Full details and raw-command exceptions: [verification.md](verification.md). Structural closure, positive preservation, 69 verifier self-tests, 12 schema-tool self-tests, the required executable regressions, TypeScript, build, and census reconciliation passed. Four absent npm aliases were recorded as failures and their existing test implementations passed directly. Strict audit is an expected exception-set failure. The admitted single-row-lab-panels saved-manifest failure remains pre-existing and unmodified.

- Production aggregate SHA-256: `d0d36ea66c237c02ba8281cfe1e209d4b1410737bff8596e0f75902014f1665c`.
- Production index SHA-256: `db4c65c9309ec2ef77da3adb3ab329b811b8d19e31707c11db29466567cf5463`.
- External smoke witness: `Luke / owner`; receipt: [production-file-smoke-receipt.json](production-file-smoke-receipt.json). Full built tree and source/bank hashes unchanged after observation.

The ledger is updated. PROJECT-HISTORY.md and DECISIONS.md are unchanged. Only the four affected canonical banks, BANK-REVIEW-LEDGER.md, census.json, and BANK-CENSUS.md changed among tracked files. All unrelated worktree state, original evidence, branch, HEAD, and index remain preserved; no Git mutation occurred.

## Required review handoff

**This is the executor terminal, not acceptance.** Architect conformance review is next. The external Claude/Opus blind semantic freeze remains governing evidence. Before acceptance, the producer-independent checker must additionally confirm the exact census movement under H.3.5; the executor has fully reconciled it but has not impersonated that checker. No architect conformance review, commit, push, merge, or publication was performed.

## Receipt index

- [opening-state.json](opening-state.json)
- [commission-manifest.json](commission-manifest.json)
- [tools/verify-boundaries.ts](tools/verify-boundaries.ts)
- [producer-freeze.json](producer-freeze.json)
- [checker-freeze.json](checker-freeze.json)
- [comparison.json](comparison.json)
- [comparison.md](comparison.md)
- [comparison-freeze.json](comparison-freeze.json)
- [accepted-boundaries.jsonl](accepted-boundaries.jsonl)
- [exceptions.jsonl](exceptions.jsonl)
- [schema-floor-plan.json](schema-floor-plan.json)
- [schema-floor-receipts.json](schema-floor-receipts.json)
- [patch-plan.json](patch-plan.json)
- [patch-application-receipts.json](patch-application-receipts.json)
- [post-repair-verification.json](post-repair-verification.json)
- [bank-preservation.json](bank-preservation.json)
- [census-reconciliation.json](census-reconciliation.json)
- [production-file-smoke-build-identity.json](production-file-smoke-build-identity.json)
- [production-file-smoke-receipt.json](production-file-smoke-receipt.json)
- [worktree-preservation.json](worktree-preservation.json)
- [verification.md](verification.md)

The complete artifact SHA-256 inventory is [executor-receipt.json](executor-receipt.json). Producer/checker packet and source evidence remains in its original directories.
