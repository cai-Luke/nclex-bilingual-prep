# R4 execution checkpoint — external smoke pending

The deterministic post-freeze executor work is complete. The required executor terminal has **not** been claimed: the external production file smoke is awaiting the owner report.

451 = 369 repairedBaseline + 16 repairedStage + 66 exceptions

385 rows were repaired with exact frozen agreement; 66 exception parts are unchanged. Four conditional schema bumps and four canonical P15 patches completed. All positive preservation checks and required executable regression implementations passed. Strict audit failure is exactly the 66 exceptions, with 75 unchanged out-of-scope legacy-only findings. Census drift was captured, regenerated, inspected against the exact allowed composition, and checked successfully. Ledger updated; history, governance, index, branch and HEAD unchanged.

The four work-order typed-baseline npm aliases do not exist in the pinned package manifest. Their literal failures are logged and the corresponding existing test files passed directly. No alias was added or failure hidden. The admitted single-row-lab-panels saved-manifest failure remains known and unmodified.

## Remaining executor step

Complete [manual-file-smoke-checklist.md](manual-file-smoke-checklist.md) on the frozen production build. Browser automation was denied by the browser URL security policy; no workaround was attempted. After the witness report, record the bound receipt and run the prepared `tools/finalize-executor.py`, which rechecks the full build and all preservation evidence before writing the executor terminal artifacts.

Build aggregate SHA-256: `d0d36ea66c237c02ba8281cfe1e209d4b1410737bff8596e0f75902014f1665c`.
Index SHA-256: `db4c65c9309ec2ef77da3adb3ab329b811b8d19e31707c11db29466567cf5463`.

## Subsequent independent review boundary

Architect conformance is not performed by this executor. Producer-independent checker confirmation of the exact census movement remains required before acceptance under H.3.5. The deterministic census reconciliation and full blind semantic checker freeze are ready for that review. No Git operation is authorized by this checkpoint.

## Evidence

- [comparison.json](comparison.json), [comparison-freeze.json](comparison-freeze.json)
- [accepted-boundaries.jsonl](accepted-boundaries.jsonl), [exceptions.jsonl](exceptions.jsonl)
- [schema-floor-plan.json](schema-floor-plan.json), [schema-floor-receipts.json](schema-floor-receipts.json)
- [patch-plan.json](patch-plan.json), [patch-application-receipts.json](patch-application-receipts.json)
- [post-repair-verification.json](post-repair-verification.json), [bank-preservation.json](bank-preservation.json)
- [census-reconciliation.json](census-reconciliation.json)
- [production-file-smoke-build-identity.json](production-file-smoke-build-identity.json)
- Captured commands and raw logs: `evidence/verification-*.json` and their referenced log paths.
