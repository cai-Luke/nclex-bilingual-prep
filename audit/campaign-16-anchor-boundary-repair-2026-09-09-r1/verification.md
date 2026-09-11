# R4 executor verification

CAMPAIGN16_BOUNDARY_REPAIR_READY_FOR_INDEPENDENT_CONFORMANCE_CHECK

**MECHANISM_REMOVED_REPAIRED_SUBSET_ONLY: 385 repaired; 66 exceptions remain.**

## Deterministic gates

| Command | Recorded result | Exit |
|---|---|---:|
| `npm run build` | PASS | 0 |
| `npm run census:check` | PASS | 0 |
| `npm run census:check` | EXPECTED_STALE — before required census regeneration | 1 |
| `npm run census` | PASS | 0 |
| `npm run validate-bank -- banks/burn-canonical.json banks/capnography-canonical.json banks/claude-canonical.json banks/device-canonical.json banks/gemini-canonical.json banks/gpt-canonical.json banks/hard-cases-canonical.json banks/io-canonical.json banks/lab-canonical.json banks/mar-canonical.json banks/medlabel-canonical.json banks/visual-canonical.json banks/vitals-canonical.json` | PASS | 0 |
| `npm run audit` | PASS | 0 |
| `npm run audit:stage-refs -- --file banks/burn-canonical.json` | PASS | 0 |
| `npm run audit:stage-refs -- --file banks/capnography-canonical.json` | PASS | 0 |
| `npm run audit:stage-refs -- --file banks/claude-canonical.json` | PASS | 0 |
| `npm run audit:stage-refs -- --file banks/device-canonical.json` | PASS | 0 |
| `npm run audit:stage-refs -- --file banks/gemini-canonical.json` | PASS | 0 |
| `npm run audit:stage-refs -- --file banks/gpt-canonical.json` | PASS | 0 |
| `npm run audit:stage-refs -- --file banks/hard-cases-canonical.json` | PASS | 0 |
| `npm run audit:stage-refs -- --file banks/io-canonical.json` | PASS | 0 |
| `npm run audit:stage-refs -- --file banks/lab-canonical.json` | PASS | 0 |
| `npm run audit:stage-refs -- --file banks/mar-canonical.json` | PASS | 0 |
| `npm run audit:stage-refs -- --file banks/medlabel-canonical.json` | PASS | 0 |
| `npm run audit:stage-refs -- --file banks/visual-canonical.json` | PASS | 0 |
| `npm run audit:stage-refs -- --file banks/vitals-canonical.json` | PASS | 0 |
| `npm run audit:stage-refs -- --strict --file banks/burn-canonical.json --file banks/capnography-canonical.json --file banks/claude-canonical.json --file banks/device-canonical.json --file banks/gemini-canonical.json --file banks/gpt-canonical.json --file banks/hard-cases-canonical.json --file banks/io-canonical.json --file banks/lab-canonical.json --file banks/mar-canonical.json --file banks/medlabel-canonical.json --file banks/visual-canonical.json --file banks/vitals-canonical.json` | EXPECTED_FAIL — exactly 66 exception leaks; separate 75 unchanged strict-only legacy findings | 1 |
| `npm run test:audit-stage-refs` | PASS | 0 |
| `npm run test:exam-layout` | PASS | 0 |
| `npm run test:case-completeness` | PASS | 0 |
| `npm run test:audit-ids` | PASS | 0 |
| `npm run test:audit-references` | PASS | 0 |
| `npm run test:raw-gate` | PASS | 0 |
| `npm run test:schema-bank` | PASS | 0 |
| `npm run test:typed-baseline` | MISSING_NPM_ALIAS — corresponding existing test file passed directly | 1 |
| `npm run test:typed-baseline-scanner` | MISSING_NPM_ALIAS — corresponding existing test file passed directly | 1 |
| `npm run test:typed-baseline-survey` | MISSING_NPM_ALIAS — corresponding existing test file passed directly | 1 |
| `npm run test:typed-baseline-ui` | MISSING_NPM_ALIAS — corresponding existing test file passed directly | 1 |
| `npx tsx scripts/tests/typed-baseline.ts` | PASS | 0 |
| `npx tsx scripts/tests/typed-baseline-scanner.ts` | PASS | 0 |
| `npx tsx scripts/tests/typed-baseline-survey.ts` | PASS | 0 |
| `npx tsx scripts/tests/typed-baseline-ui.ts` | PASS | 0 |
| `npx tsc -b --pretty false` | PASS | 0 |

Full stdout/stderr and command hashes are preserved in `evidence/verification-*.json` and their referenced logs. No absent npm alias is reported as a passing npm command; no package script was added. All four executable regression implementations passed.

## Structural and preservation proof

- Literal E.1 truth-table self-test: 1296 combinations passed.
- R4 shared-resolver structural verifier: 69 synthetic self-tests passed; final 451-row reconciliation passed.
- Exact metadata tool: 12 synthetic tests passed before canonical mutation; four one-field atomic receipts passed.
- Four canonical P15 patch scripts; 385 exact undefined-to-boundary operations. Opening → schema bump → predicted P15 final SHA chain passed for every bank.
- H.1 full parsed restoration proof passed for all 13 banks. All 66 exceptions unchanged, all legacy anchors unchanged, all counts/ids/stages unchanged, and no other primary anchor changed.
- Exactly 66 remaining revealsAllStages identities equal the frozen exception set. No repaired row remains in that set; no new leak lies outside the frozen population. The 75 out-of-scope missingRequiredAnchor identities match opening exactly.
- All pre-existing commission artifacts, both semantic freezes, frozen inventory, non-authorized tracked files, unrelated untracked files, branch, HEAD, and index preserved. The prior `git diff --check` passed; this finalization used direct disk fingerprints and repository metadata reads, with no Git command or operation.

## Census

Initial check failed as expected. Regenerated JSON and Markdown were compared in full against opening plus the approved schema-version transitions and generator provenance only; no count/content movement occurred. The subsequent check passed. The four bumped banks contain 1,809 session units; this is schema composition, not 1,809 repaired rows.

**Producer-independent checker confirmation of census movement remains required before acceptance under H.3.5. This executor receipt reconciles the deterministic movement and does not claim that future confirmation or architect conformance.**

## Production file smoke

External witness: **Luke / owner**. Actual production `file://` build digest: `d0d36ea66c237c02ba8281cfe1e209d4b1410737bff8596e0f75902014f1665c`. App and bundled load, library/practice navigation, global context with zero baseline Updates, and exact stage prefix passed. Full tree and bound source/bank hashes rechecked after the observation. Browser automation was blocked by URL security policy; no workaround was used. See the smoke receipt for the witness report.

## Known pre-existing failure

`npm run test:single-row-lab-panels` retains **PREEXISTING_BASELINE_FAILURE_ADMITTED** at the saved-manifest equality assertion documented by `../campaign-16-phase-e-typed-baseline-support-implementation-2026-09-08-r1/verification.md`. R4 did not run, repair, regenerate, or relabel that known failed saved-manifest check. Its prior failure is not presented as a final-bank test pass.

## Review boundary

The producer was Codex / GPT-6 Astra. Prior Astra descendants provided producer evidence for packets 001–024 and implemented the structural verifier; the primary producing seat completed packets 025–027, integration, and freeze. These are producing-team implementation/evidence contributions. Claude Code / Claude Opus 5 is the external full blind semantic checker. Post-freeze comparison/application/verification in this resumed turn used no new delegation and no semantic adjudication.

Independent architect conformance and producer-independent census confirmation are pending acceptance gates. No commit, push, merge, publish, or history edit occurred.
