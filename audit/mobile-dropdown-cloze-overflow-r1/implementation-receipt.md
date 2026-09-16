# Mobile dropdown-cloze R1 — blocked producer receipt

`PROJECT_SHRIMP_MOBILE_CLOZE_R1_BLOCKED`

This is an incomplete producer implementation preserved for owner disposition. It is **not ready for independent acceptance**. The unmodified baseline fails for the pinned cloze width defect; the partial candidate removes root overflow but still fails the unchanged R2 ancestor oracle. No acceptance, integration, publication, or deployment is claimed.

## Authority and snapshot

- Authority: owner launch `MOBILE-DROPDOWN-CLOZE-CODEX-LAUNCH-AUTHORIZATION-2026-09-16.md` and accepted `MOBILE-DROPDOWN-CLOZE-OVERFLOW-CODEX-WORK-ORDER-2026-09-16-R2.md`, both read from `/Users/holemini/Desktop/Project Shrimp/` without editing them.
- Work-order SHA-256, first authority gate and close recheck: `968a575b9f2f5b2b734cc5281a992f92a09dd52c409ea7d104fd5043004d6a6e`.
- Admitted base: `642b0f9c8707024037709b26b764c7b21e66ddce`. Local owner HEAD/main and live remote `refs/heads/main` matched at admission. The commit is the Sep 16 learner-shell integration publication. No rebind was needed.
- Admission blobs: App `8eac13d0b4f7f2631501e20c1ac5d285b7359010`; CSS `e95d261bc5713fac990ebc2bda4ef9320a521db7`.
- Access: disk-reading isolated worktree `/Users/holemini/Desktop/Project Shrimp Mobile Cloze R1`.
- Branch: `codex/mobile-dropdown-cloze-overflow-r1`.
- Tested partial production/test commit: `3cb99e6478bd8a6ff9a90f571afb98860973db4c`.
- The final evidence commit is reported by the task's final response and `git rev-parse HEAD`; its own SHA is intentionally not embedded here.
- Start/close authority and owner status: [authority-start.json](authority-start.json), [authority-close.json](authority-close.json). Owner HEAD stayed at the admitted base and had no tracked diff at either observation. Untracked status is recorded as metadata only; no content equality or absence of concurrent growth is asserted. No owner files were staged, edited, stashed, reset, or cleaned.

## Stop condition and evidence

R2 §4A requires `scrollWidth <= clientWidth + 1` for **every ancestor** of each select/token/readout through the document root. The cloze candidate's first required empty-state check fails that exact requirement on `section.session-shell`, even though the root, cloze panel, and select bounds now fit.

At 320×740, DPR 1, real system Chrome **152.0.7977.83**, HTTP, actual `data-theme=light`, `data-text-size=default`, on-tap Chinese unrevealed:

| Build / fixture | Root scroll/client width | Session-shell scroll/client width | Result |
| --- | --- | --- | --- |
| Admitted base, pinned witness | 1302 / 320 | 1292 / 299 | Red: cloze/root width defect |
| Partial candidate, pinned witness | 320 / 320 | 310 / 299 | Red: inherited ancestor extent |
| Admitted base, non-cloze MCQ | 320 / 320 | 310 / 299 | Same inherited shell extent |
| Partial candidate, same MCQ | 320 / 320 | 310 / 299 | Same inherited shell extent |

The mobile shell's **top bar and bottom action bar** both use negative horizontal margins to extend from the 299.21875 px session box to the 320 px viewport. At the candidate, their measured bounds are `[0, 320]`; the session bounds are `[10.390625, 309.609375]`. Those sibling extents contribute to the session's scroll width. Relevant unchanged source is `.session-active .session-topbar` and `.session-shell > .session-actions` in `src/styles.css` (candidate lines 3402 and 3475).

The task-owned [ancestor diagnostic](ancestor-diagnostic.mjs) verifies fixture identity by exact canonical stem and seeded session identity, then measures both builds and the non-cloze control. In a **temporary browser-only causal probe**, zeroing both bars' horizontal margins changes candidate-cloze and baseline/candidate-MCQ session width to **299 / 299**, while the root remains **320 / 320**. Restoring their styles restores **310 / 299**. Changing only the top bar leaves the bottom bar's extent, so it does not clear the failure. The baseline cloze remains 1302 / 320 even with both bar margins removed, separating the original cloze defect from the remaining shell condition. Results: [ancestor-diagnostic.json](ancestor-diagnostic.json).

No such bar change was made to source. These probes are diagnostic evidence, not a passing candidate. The producer stopped under §7's unresolved acceptance failure/out-of-scope condition: the allowed CSS work is cloze sizing/wrapping and necessary container minimum sizing; changing the inherited top/bottom shell gutter geometry or granting an exception to the explicit every-ancestor oracle requires owner disposition. The oracle was not weakened, ancestors were not skipped, and overflow was not concealed. The shared-ancestor allowance was considered; it does not clearly authorize altering the intentional sibling bar margins solely to satisfy this inherited non-cloze extent.

## Partial implementation

Only three implementation/test files changed:

- `src/App.tsx`: only `ClozeLine`. A neutral wrapping readout derives directly from the selected existing option, has an ID referenced by `aria-describedby`, and is empty for Choose. Each native select remains controlled by the original callback and disabled-after-submit flag. Added accessible blank labels. No new answer state or Chinese reveal logic.
- `src/styles.css`: only cloze rules. Zero panel grid minimum, contained choice/select sizing with inline margins accounted for, natural text wrapping, and wrapping Chinese tokens. No shared ancestor, shell, calculator, matrix, or visual rule changed.
- `scripts/tests/mobile-dropdown-cloze-layout.mjs`: new explicit-URL/output browser runner, resolving Playwright through `PLAYWRIGHT_MODULE`, using system Chrome with ordinary security and disposable profiles. The containment oracle precedes all new readout assertions.

Source-grounded original cause: native selects sized to long option text; their intrinsic width propagated through the cloze panel's automatic grid minimum. The baseline first select measured **1239.59375 px**, at left **41.78125** and right **1281.375**. Candidate select bounds and every ancestor's measurements are retained in results JSON.

The readout/state/language/case/offline sections of the runner are implementation scaffolding that was **not reached or proven** because the first containment check stops the run. This receipt does not describe them as passed. Further implementation or test repair may still be needed after the owner resolves the scope/oracle conflict.

## Same-oracle result and fixtures

The final baseline and candidate invocations use byte-identical runner SHA-256 `91e784bdcf23f1f5ad2d4a61e09657268e4cb1800077903aafae5fcffd4a79f9`; both exit **1**. Baseline red is the required containment failure, not missing readout DOM, failed navigation, or a timeout. Candidate green was **not achieved**.

- [Final invocation/exit records](browser-invocations.json).
- [Baseline results](baseline-final/results.json) and [candidate results](candidate-final/results.json), including root width, all offending element rectangles, and ancestor width chains.
- [Baseline screenshot](baseline-final/screenshots/witness-320-default-empty-FAIL.png) and [candidate screenshot](candidate-final/screenshots/witness-320-default-empty-FAIL.png).
- [Fixture manifest](candidate-final/fixture-manifest.json): exact bank paths, parent/leaf IDs, bank/content SHA-256, runtime fingerprints, and deterministic selection rules. The additional standalone maximizes longest EN option length among multi-blank clozes, excluding the witness; the case leaf maximizes it among real canonical case cloze leaves; ID breaks ties. MCQ/matrix use ascending stable ID with no question-level visual. Only witness and diagnostic MCQ have browser measurements at this blocked stop.
- The baseline was reproduced **before production edits**, recorded in `baseline-initial/` and `baseline-initial.log`; its production dist was copied to `/tmp/shrimp-cloze-baseline-dist` before rebuilding candidate. The final baseline run uses that same unmodified baseline artifact with the final runner. Initial/development failures are retained, not overwritten.

## Verification and invariance

Evidence-format closeout: the first staged evidence diff check reported trailing blank log lines and blank context lines inside the saved patch. Terminal log whitespace was normalized without changing diagnostic text, and the scope script now saves a zero-context production diff. The final base-to-candidate diff check passes.

All mandated deterministic commands passed, with exit codes/logs in [verification.json](verification.json): TypeScript, grading, case completeness, exam layout, session navigation, production build, and diff check. After committing the partial production/test change, the production build passed again (`tested-commit-build.log`), and the final candidate browser run used that build.

Scope proof: [protected-paths.json](protected-paths.json), generated by [verify-scope.mjs](verify-scope.mjs). All **4,283 tracked files outside the allowlist** retain their admitted Git object inventory. Explicit tree/blob identities cover banks, clinical visuals, schema/types/grading, storage/migration, sampler/session state/navigation/start guard, completed memory, bank loading/import, calculator source/panel, package files, census artifacts, accepted evidence, and project history. TypeScript AST ranges prove all App bytes outside the allowed function declarations are unchanged; only `ClozeLine` differs. Lossless PostCSS comparison proves all CSS outside seven cloze selectors is unchanged. [Production diff](production.diff) is included. No dependency/package, census, bank, history, or accepted evidence mutation.

The admitted selection invariant was source-confirmed: selection persists only the active draft; submission creates attempt/event/progress. Exact call-chain and bilingual/shared-context evidence is in [selection-contract.md](selection-contract.md). This source trace is not a substitute for the uncompleted browser interaction matrix. That artifact also notes a pre-existing source-level cleared-Choose reload limitation; no storage changes were attempted.

Uncompleted required evidence: 390 px and text-mode matrix; partial/full answers and correct/incorrect submissions; all-option full-text reading; language/reveal transitions; case navigation and Summary; keyboard/touch/focus; reload/resume; breakpoint/desktop probes; matrix collateral; and final file-transport selection/submission. These are blocked, not waived. No physical native-picker observation was made. The candidate screenshot still shows the held calculator over the tall question/Submit region; calculator geometry and its separate defect are not repaired or claimed closed.

## Reproduction

From the preserved producer worktree, use an existing external Playwright installation and available project dependencies (this worktree uses an ignored `node_modules` symlink to the existing installation; no dependency was added):

```sh
npm run build
python3 -m http.server 4181 --bind 127.0.0.1 --directory dist
```

In another terminal:

```sh
PLAYWRIGHT_MODULE=/tmp/shrimp-omnibus-tools/node_modules/playwright/index.mjs node --import tsx scripts/tests/mobile-dropdown-cloze-layout.mjs --url http://127.0.0.1:4181 --output audit/mobile-dropdown-cloze-overflow-r1/reviewer-candidate
node audit/mobile-dropdown-cloze-overflow-r1/verify-scope.mjs --out audit/mobile-dropdown-cloze-overflow-r1/reviewer-scope.json
```

Serve the preserved baseline build with `python3 -m http.server 4182 --bind 127.0.0.1 --directory /tmp/shrimp-cloze-baseline-dist`, then run the same candidate runner with `--url http://127.0.0.1:4182 --output audit/mobile-dropdown-cloze-overflow-r1/reviewer-baseline`. For independently rebuilt baseline evidence, create a disposable detached worktree at the admitted base, build it, and point the final producer runner at that served build; remove a disposable Git worktree only with `git worktree remove`. Do not mutate the owner checkout or accepted evidence. The diagnostic expects the baseline at 4182 and candidate at 4181 and can be rerun with the same `PLAYWRIGHT_MODULE` and `node --import tsx audit/mobile-dropdown-cloze-overflow-r1/ancestor-diagnostic.mjs`.

No push, merge, deploy, `PROJECT-HISTORY.md` update, calculator repair, or independent acceptance occurred. The final producer worktree remains available.

## Delegation disclosure

The primary Codex producer implemented source/tests and performed browser/command evidence. One bounded subagent (`selection_evidence`, inherited Codex producer model/seat; the exact underlying runtime model ID was not exposed by the collaboration tool) supplied **evidence**, not implementation or independent review: source tracing and the AST/CSS/protected-path proof script/artifacts. No recursive delegation or nominal independent checker was used. An actual external acceptance seat remains required after this blocked scope issue is resolved and all required evidence is completed.
