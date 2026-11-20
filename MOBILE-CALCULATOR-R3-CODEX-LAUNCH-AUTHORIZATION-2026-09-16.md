# Project Shrimp — Mobile Calculator R3 Codex Launch Authorization

**Date:** 2026-09-16  
**Authority:** owner launch authorization after calculator R3 specification acceptance and completed cloze integration/publication.  
**Authorized producer:** Codex.  
**Governing work order:** `MOBILE-CALCULATOR-ACTION-CLEARANCE-CODEX-WORK-ORDER-2026-09-16-R3.md`.  
**Execution base:** `adcbff3baedf61461ba73b14b7d029f8324c8bfc` (`main` / `origin/main`, published cloze closeout).  
**Accepted cloze production:** `3cb99e6478bd8a6ff9a90f571afb98860973db4c`.  
**Accepted cloze evidence tip:** `c521637191ce7a635cc7c2c22c2e8c4c0f077deb`.  
**Cloze integration receipt:** `audit/mobile-dropdown-cloze-overflow-r1/integration/integration-receipt.md`.  

Claude.ai returned `CALCULATOR_R3: ACCEPT`. The serial routing requirement is now satisfied: cloze R1 was independently accepted, integrated, and published, and current `main` is the exact execution base above.

This file authorizes execution of calculator R3 only. It does not amend the reviewed R3 contract except to bind §2 `EXECUTION_BASE` to the SHA above and to convert the reviewed draft into an executable owner order. The R3 work-order bytes themselves remain read-only.

## Launch gates

Before implementation:

1. Read current `AGENTS.md`, this authorization, the complete R3 work order, `PROJECT-HISTORY.md`'s Sep 16 cloze closeout, and the cloze integration receipt.
2. Compute and record the exact SHA-256 of the owner-side R3 work-order file. Re-read it after any context compaction. A later byte mismatch is an authority failure, not permission to silently continue.
3. Verify `adcbff3baedf61461ba73b14b7d029f8324c8bfc` is current accepted `main` and `origin/main` for the launch snapshot, and create the isolated producer worktree/branch from exactly that commit. Do not use the older planning snapshot `642b0f9` as the execution base.
4. Confirm the accepted cloze production/evidence lineage is present on the execution base and that no unreviewed calculator work is already present.
5. Record owner checkout tracked/untracked status without opening or modifying unrelated untracked material. In particular, do not inspect, stage, stash, clean, move, delete, or otherwise touch active P27 output or other owner-side work orders.
6. Reproduce the calculator overlap on the unmodified execution base using the R3 typed geometry/hit-test oracle before production editing. The red must be the actual `OVERLAP` condition required by §5, not a click timeout or fixture/setup failure.

## Execution authority

Execute the complete R3 contract, including:

- normal-portrait coexistence at 390×844 and 320×740;
- Default-text `band >= 6rem` and Large-text positive-band contract;
- answer-control activation-element targeting and the accepted Large-text minimize fallback when the activation element cannot fit the positive band;
- reduced-height 390×568 and 667×375 minimize/read-or-answer/reopen behavior with calculator value and pending-operator preservation;
- uncovered Study actions and top-bar controls in every tier;
- geometry plus five-point `elementFromPoint` hit testing before unforced clicks;
- scroll-position accounting that rejects Playwright auto-scroll as decisive evidence;
- safe-area evidence honestly classified as actual, simulated, or unverified;
- desktop 781–820 crossover, desktop drag/clamp, Preview Lab, lifetime/focus/reset behavior, ordinary/case submission, accepted cloze regression, and final `file://` proof;
- all deterministic checks and protected-path/object-equality proof in §6;
- a complete implementation receipt under `audit/mobile-calculator-action-clearance-r1/`.

Prefer the smallest presentation-only repair. Do not change arithmetic, grading, persistence, answer readiness, navigation semantics, cloze behavior, banks, schema/types, package files, census, or unrelated shell architecture. Do not broaden into a side-dock redesign.

## Producer boundary

Commit bounded production/tests/evidence on the producer branch and stop. Do not update `PROJECT-HISTORY.md`, push, merge, deploy, modify the owner checkout, clean another worktree, or begin another defect. The producer/delegation tree cannot provide the independent checker.

Success terminal:

`PROJECT_SHRIMP_MOBILE_CALCULATOR_R1_READY_FOR_INDEPENDENT_REVIEW`

Blocked terminal:

`PROJECT_SHRIMP_MOBILE_CALCULATOR_R1_BLOCKED`

On success report at minimum: R3 work-order SHA-256, exact execution base, branch/worktree, baseline typed-overlap witness, tested production commit, final evidence tip, changed-file list, geometry strategy, required matrix summary, HTTP/offline results, cloze-regression result, deterministic verification, protected-path proof, safe-area proof classification, and receipt path.
