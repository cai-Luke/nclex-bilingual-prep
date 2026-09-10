# Verification — ready for independent conformance check

Producer verification is complete under frozen R2 and the two continuation dispositions. There is exactly one admitted non-green mandatory command. This packet does not claim independent review, owner acceptance, merge approval, deployment, or a repaired 451-row population.

## Final verification matrix

| Command or check | Status | Exit |
|---|---|---|
| `npm run test:schema-bank` | PASS | 0 |
| `TMPDIR=/tmp/ npm run test:audit-stage-refs` | PASS | 0 |
| `npm run test:raw-gate` | PASS | 0 |
| `npm run test:exam-layout` | PASS | 0 |
| `npm run test:review-prompt` | PASS | 0 |
| `npm run test:single-row-lab-panels` | PREEXISTING_BASELINE_FAILURE_ADMITTED | 1 |
| `npm run test:promote` | PASS | 0 |
| `npm run test:consolidate` | PASS | 0 |
| `npx tsx scripts/tests/registry-mechanics.ts` | PASS | 0 |
| `npm run test:shuffle` | PASS | 0 |
| `npm run test:raw-bank-normalization` | PASS | 0 |
| `npm run test:presentation-normalization` | PASS | 0 |
| `npm run test:storage-category-migration` | PASS | 0 |
| `npm run test:audit-validate-bank` | PASS | 0 |
| `npm run test:validate-sweep` | PASS | 0 |
| `npm run test:rationale-visual-schema-floor` | PASS | 0 |
| `TYPED_BASELINE_RECEIPTS=audit/campaign-16-phase-e-typed-baseline-support-implementation-2026-09-08-r1 npx tsx scripts/tests/typed-baseline.ts` | PASS | 0 |
| `npx tsx scripts/tests/typed-baseline-ui.ts` | PASS | 0 |
| `npx tsx scripts/tests/typed-baseline-scanner.ts` | PASS | 0 |
| `npx tsx scripts/tests/typed-baseline-survey.ts` | PASS | 0 |
| `npm run validate-bank -- banks/*.json` | PASS | 0 |
| `npm run audit` | PASS | 0 |
| `npm run census:check` | PASS | 0 |
| `npx tsc -b --pretty false` | PASS | 0 |
| `npm run build` | PASS | 0 |
| `git diff --check` | PASS | 0 |
| `External witness opens exact production dist/index.html using file://` | PASS | N/A — manual witness |
| `Compare final aggregate stage-reference findings and full result/detail to original opening capture` | PASS | 0 |
| `Original opening-byte bank/protected-path preservation, unauthorized untracked inventory, branch/HEAD/upstream verification` | PASS | 0 |
| `SHA-256 complete production tree and final authorized source/test/document recheck against frozen build identity` | PASS | 0 |
| `npx tsx audit/campaign-16-phase-e-typed-baseline-support-implementation-2026-09-08-r1/check-final-survey.ts` | PASS | 0 |

Full commands, logs and historical attempts are retained in `test-results.json`; the final resolved matrix is `final-verification-matrix.json`. Historical NOT_RUN/blocked entries and the corrected initial importer-fixture error remain historical records rather than current dispositions.

## Explicit survey-baseline exception

`npm run test:single-row-lab-panels` remains red: exit 1 at its existing saved-manifest equality assertion. It is PREEXISTING_BASELINE_FAILURE_ADMITTED under continuation order 2, never PASS. Read-only reconstruction with hash-verified opening generator/schema/allowed-key sources and unchanged bank inputs produced the same survey bytes as the final implementation. The generated SHA-256 remains `6e4a5cc93a4f943f75d91fc1707bad44abf5ebd376e843ee5dc21d9072f398dc`; the protected saved manifest remains `f042bd39094e543ab30d6a6dd87081b1ebdead6d7182fa07711ebb53d0552942`. The 40 differing survey fields predate this commission. No corpus-versus-saved-artifact semantic disposition was made.

Neither the saved artifact nor banks were modified to force green. The original test file is restored to its opening bytes; only the new synthetic proof moved to `scripts/tests/typed-baseline-survey.ts`. That independent fixture passes through actual embedded survey evidence collection and serialization and preserves the exact typed object. The checker must independently assess the opening/current equivalence proof, not rely on this producer narrative.

## Bound external production-file smoke

Luke reported PASS in Chrome 152 at approximately 2026-09-09 21:00 ET. He opened the current production file directly with file://, confirmed normal rendering and bundled questions, navigated the ordinary question flow, and saw no blocking path/module/asset/question-loading failure. He explicitly confirmed no rebuild or alteration and identified build `0b2e2bce6a5cd964d23749a74512e429da8418cfc124272dfa9fb9ee62d5b925`.

The post-witness SHA-256 recheck matches every file in the complete 12-file production tree and every recorded final source/test/schema-document input. `dist/index.html` remains `92025bdb98ee2ce4019fa08f7bcd7c041b75780e992f1b22d4df08b3b3b87135`. The manual witness supplies production compatibility evidence only; it does not satisfy P2. No prohibited browser route was retried and no SSR/HTTP/synthetic result substituted for this observation.

## Preservation and final audit

All 16 bank files and all protected/unrelated opening paths are byte-identical to original opening-state.json. This includes the dirty canonical banks, census artifacts, ledger, governance, GeminiPrompt.md, parked repair order, July survey artifact and frozen Campaign 16 evidence. No unauthorized new untracked path exists outside commission/source/test/build surfaces. Final stage-reference finding objects and full aggregate result/details exactly equal opening: 451 findings. Branch main, HEAD 3286024bcab90c1a114811a7202d956c3e586bf4 and upstream origin/main are unchanged.

SCHEMA_VERSION and the ordinary authoring default remain 2.0; 2.1 is supported only as the typed-baseline feature floor. No live bank floor, storage migration, frozen-row assignment or clinical content change was made. No census regeneration, commit, push, merge, stash, reset, clean, branch/worktree switch or deployment was performed. The optional P15 fixture was not exercised.

## Independent handoff

The implementation is local and uncommitted. A disk-reading checker must inspect frozen R2, both continuation orders, current source diff/new files, original opening preservation, admitted-exception proof and final build/smoke binding. Producer: Codex primary seat, no delegated contributions. Independent review and owner disposition remain pending.
