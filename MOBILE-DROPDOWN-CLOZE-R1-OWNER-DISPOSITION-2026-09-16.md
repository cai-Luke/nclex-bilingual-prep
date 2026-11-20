# Project Shrimp — Mobile Dropdown-Cloze R1 Owner Disposition

**Date:** 2026-09-16  
**Authority:** owner/architect disposition of the blocked R1 producer return.  
**Applies to:** `MOBILE-DROPDOWN-CLOZE-OVERFLOW-CODEX-WORK-ORDER-2026-09-16-R2.md` and the preserved producer branch/worktree `codex/mobile-dropdown-cloze-overflow-r1` / `./Project Shrimp Mobile Cloze R1`.  
**Original frozen work-order SHA-256:** `968a575b9f2f5b2b734cc5281a992f92a09dd52c409ea7d104fd5043004d6a6e`.  
**Blocked evidence tip received:** `4e22688c5d35b31aac1a29ead8b888bddfe9c0bf`.  
**Tested partial commit received:** `3cb99e6478bd8a6ff9a90f571afb98860973db4c`.

This file is a narrow owner amendment to the R2 acceptance oracle. It does **not** authorize any shell redesign, calculator work, publication, or history update. The accepted R2 work order remains the governing scope except where this disposition explicitly narrows the ancestor-width oracle below.

## Disposition

The producer block is accepted as a valid stop. The remaining `section.session-shell` `scrollWidth > clientWidth` condition is classified as an **inherited intentional full-bleed shell extent**, not as unresolved cloze overflow, because the preserved evidence establishes all of the following at the same 320×740 conditions:

1. admitted-base cloze root overflow reproduces at `1302 / 320`;
2. the partial candidate root is contained at `320 / 320`;
3. the candidate `.session-shell` remains `310 / 299`;
4. the same `.session-shell` `310 / 299` condition exists on a non-cloze MCQ on both admitted base and candidate;
5. the measured cause is the unchanged negative horizontal margins of the mobile session top bar and bottom action bar, whose own bounds extend to the viewport while remaining inside the root viewport;
6. temporarily removing those bar margins clears the shell-local excess without changing the original baseline cloze root defect.

**Do not repair or alter those shell gutters in this commission.** They are outside the cloze defect and are not made in-scope by this disposition.

## Amended containment oracle

R2 §4A's requirement that every ancestor through `documentElement` independently satisfy `scrollWidth <= clientWidth + 1` is replaced for this commission by the following causal containment rule.

For every visible cloze-generated subject (`.cloze-panel`, `.cloze-line`, `.cloze-choice`, `.cloze-select`, `.cloze-token`, `.cloze-readout`) in every required test state:

1. **Root stays strict.** `document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1` remains mandatory.
2. **Subject stays strict.** Each subject's own `scrollWidth <= clientWidth + 1`, and its bounding rect lies within `[0, innerWidth]` ±1 CSS px.
3. **Ancestor viewport containment stays strict.** At the current scroll position, the subject's horizontal rect must lie inside each ancestor's horizontal client box ±1 CSS px. A subject hidden beyond an ancestor's visible horizontal client area is a failure even if the root width is green.
4. **No concealment waiver.** `overflow-x: hidden/clip`, transforms, text shrinking, or a new cloze horizontal scroller remain forbidden exactly as in R2. Existing intentional scroll containers elsewhere are not a cloze pass unless the cloze subject itself satisfies items 1–3.
5. **Inherited full-bleed ancestor exception.** An ancestor may have `scrollWidth > clientWidth + 1` without failing only when the producer proves, at the same viewport/theme/text mode, that:
   - a canonical non-cloze control rendered in the same active-Study shell has the same ancestor condition;
   - the cloze candidate does not increase that ancestor's `scrollWidth - clientWidth` above the non-cloze control by more than 1 CSS px;
   - the root remains non-overflowing; and
   - the excess is attributable to unchanged non-cloze shell/layout descendants, not to a cloze subject or a new task-owned shared-layout change.
6. **No generic allowlist.** Do not hard-code `.session-shell` as automatically exempt. The runner must record the matched non-cloze witness and the measured delta for every exception actually exercised. An unmatched or enlarged ancestor excess remains a failure.

This amendment preserves the original purpose of C2: a green root cannot hide a cloze control inside an inner scroller or clipped ancestor. It removes only the false-positive assumption that an ancestor's aggregate `scrollWidth` must be zero-excess when unchanged full-bleed siblings intentionally extend beyond that ancestor's own client box.

## Red/green consequence

The original baseline red remains valid and unchanged: the pinned cloze witness must fail the strict root/subject containment oracle because of the true `1302 / 320` cloze width defect.

The candidate may proceed only if it passes the amended causal oracle above. The producer must retain the original blocked evidence and add a new post-disposition result; do not rewrite historical blocked artifacts into a fictitious pass.

The same runner source must still be used for the final baseline/candidate red-green comparison after the oracle amendment, with the amended runner hash recorded for both invocations. Baseline failure must occur on the original cloze containment defect, not on absence of new readout DOM or another unrelated condition.

## Resume authority

Resume the **existing preserved producer worktree and branch**. Do not restart from `main` and do not discard the partial commits/evidence.

Authorized next actions:

- amend only the task-owned browser runner/evidence needed to implement this owner disposition;
- continue the previously incomplete R2 browser matrix;
- make additional production changes only if the remaining R2 matrix exposes an actual in-scope cloze defect;
- rerun the required deterministic checks after any further production change;
- preserve the original blocked receipt/evidence and write a clear continuation/addendum receipt or update the producer receipt with an explicit dated owner-disposition section that does not erase the prior block;
- maintain all R2 protected-path and independence requirements.

Not authorized:

- changing `.session-topbar`, `.session-actions`, session-shell gutters, learner navigation, calculator geometry, or other inherited shell layout merely to satisfy the old raw ancestor-width assertion;
- weakening root/subject containment;
- skipping the remaining browser matrix;
- push, merge, deploy, `PROJECT-HISTORY.md` update, or calculator commission work.

## Required terminal

If the amended causal oracle and the rest of R2 now pass:

`PROJECT_SHRIMP_MOBILE_CLOZE_R1_READY_FOR_INDEPENDENT_REVIEW`

If another genuine acceptance failure remains:

`PROJECT_SHRIMP_MOBILE_CLOZE_R1_BLOCKED`

Return the new tested production commit if changed, final evidence tip, amended runner SHA-256 used identically for baseline/candidate, completed browser-matrix summary, and receipt path. Independent acceptance remains mandatory after a successful producer return.
