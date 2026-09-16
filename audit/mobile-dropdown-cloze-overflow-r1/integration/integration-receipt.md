# Mobile dropdown-cloze R1 integration receipt

`PROJECT_SHRIMP_MOBILE_CLOZE_R1_INTEGRATED_PUBLISHED`

Date: 2026-09-16
Integration lane: deterministic Codex integration/publication seat

## Admission and authority

The owner checkout was observed on `main` at `642b0f9c8707024037709b26b764c7b21e66ddce`, with `origin/main` at the same SHA, tracked-clean, and 15 unrelated untracked paths. The accepted producer worktree was `/Users/holemini/Desktop/Project Shrimp Mobile Cloze R1`, branch `codex/mobile-dropdown-cloze-overflow-r1`, at accepted evidence tip `c521637191ce7a635cc7c2c22c2e8c4c0f077deb`, tracked/untracked-clean.

Accepted identities:

- production commit: `3cb99e6478bd8a6ff9a90f571afb98860973db4c`
- accepted evidence tip: `c521637191ce7a635cc7c2c22c2e8c4c0f077deb`
- corrected runner SHA-256: `3e661e3cc32f1e40a8a8937205c475e504051cb0cee892e23cbd24c61f320667`
- frozen R2 SHA-256: `968a575b9f2f5b2b734cc5281a992f92a09dd52c409ea7d104fd5043004d6a6e`
- owner-disposition SHA-256: `5ba74604d9052e3a5f578627f9ac709c597d421af1f3ff788a934f1b5face11b`
- integration work-order SHA-256: `9148f546201237fb6b1d778eb1517c6563675869c08377a2e0900ff860d9a12e`

The accepted evidence tip descends from the owner base and from the accepted production commit. The final tree diff from production through the accepted evidence tip contains no `src/**` changes, and a per-commit check found no `src/**` change after production. The producer worktree was clean and its tree hash matched the accepted tip.

## Integration method and equivalence

An isolated integration worktree was created at `/tmp/shrimp-mobile-cloze-r1-integration.fJCk3A` from owner `main`, on branch `codex/mobile-dropdown-cloze-r1-integration`. It was advanced with `git merge --ff-only c521637191ce7a635cc7c2c22c2e8c4c0f077deb`; no merge commit, squash, cherry-pick, rebase, or rewrite was used.

Before publication-only edits:

- integration `HEAD`: `c521637191ce7a635cc7c2c22c2e8c4c0f077deb`
- integration tree: `c3666ec0da76abaa3d867bdc97e71584a850dfe0`
- accepted producer tree: `c3666ec0da76abaa3d867bdc97e71584a850dfe0`
- `git diff --exit-code c521637191ce7a635cc7c2c22c2e8c4c0f077deb -- .`: pass
- producer worktree diff from the accepted tip: none

This proves byte-equivalence to the accepted producer tip before the two authorized publication surfaces were added.

## Publication-only changes

The final diff relative to the accepted tip is limited to:

- `PROJECT-HISTORY.md`
- `audit/mobile-dropdown-cloze-overflow-r1/integration/integration-receipt.md`
- `audit/mobile-dropdown-cloze-overflow-r1/integration/candidate-http/**`
- `audit/mobile-dropdown-cloze-overflow-r1/integration/candidate-file/**`

The last two entries are fresh task-owned browser evidence within the authorized integration directory. No bank, schema, types, grading, storage, sampler, session/navigation, calculator, census, package, or production source file was changed after accepted-tip equivalence.

## Verification

All commands ran from the integrated worktree and passed:

| Command | Result |
| --- | --- |
| `npx tsc -b --pretty false` | exit 0 |
| `npm run test:grading` | exit 0; grading tests passed |
| `npm run test:case-completeness` | exit 0; case completeness tests passed |
| `npm run test:exam-layout` | exit 0; exam layout tests passed |
| `npm run test:session-navigation` | exit 0; session navigation tests passed |
| `npm run build` | exit 0; Vite build and build-info validation passed |
| `git diff --check` | pass |

The build emitted only Vite's existing large-chunk advisory; it did not produce an application failure. No census regeneration was run because no bank or census input changed.

The accepted baseline red was not rerun because accepted-tip equivalence held, as authorized by the work order. The corrected runner was used for both final candidate smokes:

- HTTP: `PLAYWRIGHT_MODULE=/tmp/shrimp-omnibus-tools/node_modules/playwright/index.mjs node --import tsx scripts/tests/mobile-dropdown-cloze-layout.mjs --url http://127.0.0.1:4181/ --output audit/mobile-dropdown-cloze-overflow-r1/integration/candidate-http` — PASS, Chrome `152.0.7977.83`, runner hash matches, 160 checks, root `320 / 320` at the pinned 320 px witness, selected/readout and full matrix assertions passed, and 0 console diagnostics. Result: [candidate-http/results.json](candidate-http/results.json).
- `file://`: `PLAYWRIGHT_MODULE=/tmp/shrimp-omnibus-tools/node_modules/playwright/index.mjs node --import tsx scripts/tests/mobile-dropdown-cloze-layout.mjs --url file:///tmp/shrimp-mobile-cloze-r1-integration.fJCk3A/dist/index.html --output audit/mobile-dropdown-cloze-overflow-r1/integration/candidate-file` — exit 0, PASS, Chrome `152.0.7977.83`, runner hash matches, 5 checks, root `320 / 320`, selected → submitted-correct readable result, and 12 diagnostics all narrowly matched the inherited manifest CORS/`net::ERR_FAILED` pair. Result: [candidate-file/results.json](candidate-file/results.json).

The HTTP runner's result status is `PASS`; its source sets exit 1 only on the failure path, so the passing run has exit 0. The final browser evidence was written only under the integration directory and did not overwrite producer evidence.

The accepted evidence and independent review establish the final causal containment distinction: the cloze-generated subjects are strictly contained, while the unchanged `.session-shell` full-bleed extent is matched by the non-cloze witness with zero cloze-added delta. The native select remains the answer input and the neutral wrapping readout remains presentation-only. The inherited calculator overlap remains outside this commission and is not claimed repaired.

## Publication state and preservation

The publication commit is the single post-acceptance commit on the linear integration line. Its exact full SHA, together with the final local/remote `main` parity, is reported in the final publication response; it is intentionally not embedded in its own receipt commit. The pre-push local `main` and post-push `origin/main` resolve to that same final SHA after the safe fast-forward update and non-force push.

The owner default checkout was not used for implementation, evidence generation, staging, cleanup, stash, reset, move, or deletion. Its unrelated untracked material, including active P27 output, was not opened or modified. The local `main` update was a fast-forward of tracked repository state only; untracked owner material remained in place. The accepted producer worktree and evidence chain remain available and unchanged.

Calculator R3 remains pending. It becomes eligible only after this integrated and published `main` is established; no calculator work was started in this commission.
