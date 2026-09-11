# Project Shrimp UX-0A — Learner-Surface Truthfulness and Affordance Cleanup

**Date:** 2026-09-11  
**Status:** QUEUED — SPEC FROZEN; DO NOT IMPLEMENT UNTIL THE CURRENT CAMPAIGN-16 WORKTREE IS CLOSED OR A CLEAN POST-CAMPAIGN WORKTREE IS CUT  
**Implementation seat:** Codex / coding agent  
**Change class:** learner UI / CSS only unless an explicit escalation below fires

## 0. Purpose and sequencing

Perform a narrow learner-facing cleanup of source-confirmed misleading, inert, redundant, or developer-only affordances.

This is **not** the learner-shell redesign. It is intended to establish a truthful, less confusing baseline before the later shell / information-architecture work.

Do not implement this commission in the currently dirty Campaign 16 worktree. At implementation time, work from the accepted post-campaign baseline or a clean worktree cut from it.

This commission does **not** authorize changes to session lifecycle, grading, storage contracts, question-bank content, schema, clinical content, session sampling, or `src/visuals/**`.

## 1. Source freeze and authority

This work order was prepared against local `main` at:

- HEAD: `a639b5f` (`docs(campaign16): archive Phase E census and residual evidence`)
- `src/App.tsx`, `src/styles.css`, `src/storage.ts`, and `src/types.ts`: no local diff at spec-preparation time
- the local worktree otherwise contains active Campaign 16 bank/census/audit state that is explicitly outside this commission

Before implementation:

1. Read `AGENTS.md` first.
2. Read this work order in full.
3. Re-open current `PROJECT-HISTORY.md`, relevant `DECISIONS.md`, `src/App.tsx`, and `src/styles.css`.
4. Inspect current repository/worktree state and preserve unrelated changes.

The repository remains authoritative for **current mechanical state**. This work order is authoritative for **authorized scope and product decisions**.

If a source anchor named below has materially drifted by implementation time, do not silently reinterpret the work order. Report the exact drift as `UX0A_SOURCE_DRIFT`, stop that affected item, and continue only separable items whose premises still hold.

## 2. Verified forcing findings

The following were rechecked against the live learner source while freezing this spec.

### F1 — `settings.defaultMode` has no launcher consumer

Live references are limited to:

- the Settings control in `src/App.tsx`;
- the default value in `src/storage.ts`;
- the `Settings` field in `src/types.ts`.

No Study/Test/Adaptive launcher reads it.

### F2 — Preview Lab is exposed in ordinary Settings while developer tools already have an independent gate

`src/App.tsx` exposes Developer Review and Telemetry only when `devStartup.enabled` is true. The existing startup path enables developer tools through `?dev=1` and persists the `shrimpDevTools` local-storage flag.

The Settings `Preview Lab` launcher is currently unconditional.

### F3 — GPT rescue is a copy operation

The learner labels currently read:

- `Ask GPT about this question / 让 GPT 讲讲这道题`
- `Ask GPT about this case part / 让 GPT 讲讲这个案例部分`

The implementation builds a prompt and copies it; there is no runtime GPT invocation.

The app's current learner-copy convention commonly uses a single slash-joined English / Simplified-Chinese string. This commission follows that existing convention; do not invent an i18n lookup layer.

### F4 — learner question export is labeled too broadly

The current learner control reads `Export all`, while the export path serializes question-bank content rather than learner progress, flags, SRS state, settings, or the active session.

### F5 — Summary overstates set-level correctness as mastery and contains a redundant flagged-set action

Current Summary copy uses `Mastered` for the count of fully correct responses in the just-finished set, including the score/detail lines.

The same Summary also exposes a separate `Flagged this set (...)` action in addition to the existing flagged review-scope control. The redundant action is confirmed present; this is not an implementation-time adjudication.

### F6 — submitted matrix cells remain actionable-looking no-ops

`MatrixControl.toggleCell` returns immediately when `submitted` is true, while the matrix cells remain focusable `<button>` controls with `aria-pressed` and an active-looking click target.

### F7 — the mobile global-nav CSS is unscoped and reaches case-study navigation

At `max-width: 780px`, `src/styles.css` currently applies generic rules to:

- `nav`
- `nav button`
- `nav button span`

The last rule hides all button spans with `display: none`; the same selector family can reach `.case-part-nav`, whose part identity is learner-critical.

A reusable `.sr-only` utility already exists in `src/styles.css`.

### F8 — Dashboard weak-topic actions collapse topic identity to one category

Dashboard currently constructs a `Map<topic, category>` and its weak-topic action opens Builder with that single category plus `status: "incorrect"`.

That action therefore does not operate on the named weak topic. It is also unsafe as a semantic representation for topics deliberately shared across categories: the current map retains only one category value for a repeated topic.

The existing Library already has an exact topic filter and filtered-set practice actions. This commission will reuse that surface rather than inventing a new sampler.

## 3. Authorized changes

### A1 — remove the learner-facing Default mode control

Remove the visible Settings control for `settings.defaultMode`.

Do **not**:

- make launchers begin honoring `defaultMode`;
- remove `defaultMode` from the persisted `Settings` shape;
- bump storage version;
- add a migration;
- reset an already-persisted non-default value.

The field may remain as compatibility baggage. Add a short code comment at the `Settings.defaultMode` declaration identifying it as a legacy persisted compatibility field with no learner control or launcher consumer, so a future maintainer does not "restore" the dead setting accidentally.

Remove any import that becomes unused solely because this control is gone.

### A2 — gate Preview Lab with the existing developer-tools state

Do not show the Preview Lab launcher in ordinary learner Settings.

Retain Preview Lab itself and make it reachable when the existing developer-tools gate is active. The expected developer entry remains the current `?dev=1` / persisted `shrimpDevTools` mechanism; do not invent a second developer switch.

The implementation may thread the existing developer-enabled state into `SettingsView` or use an equally small existing-pattern solution.

Do **not**:

- delete Preview Lab;
- move developer-tool instructions into learner UI;
- modify `AGENTS.md` merely to document a UI route;
- change Developer Review or Telemetry authorization semantics.

### A3 — rename GPT rescue to the operation it actually performs

Use the app's existing single-string bilingual convention.

Replace the current rescue labels with:

- `Copy question for GPT / 复制问题给 GPT`
- `Copy case part for GPT / 复制案例部分给 GPT`

Preserve exactly:

- rescue-prompt construction;
- missed-item eligibility;
- clipboard behavior;
- copy confirmation;
- fallback textarea behavior;
- offline/static operation.

Do not add a runtime model call.

### A4 — make question-export scope explicit

Change the learner-facing `Export all` wording to:

`Export questions / 导出题目`

If nearby explanatory copy would otherwise imply a learner-state backup, correct that copy narrowly as well.

Do not change the export envelope or import parser.

Do not add learner-progress export/import in this commission.

**Recorded follow-up, not authorization:** the product currently has no full learner-state backup for progress/flags/question SRS/vocab SRS/settings/active session. Renaming this control makes the current scope honest; it does not solve that separate durability question.

### A5 — correct Summary terminology and remove the confirmed duplicate flagged action

Replace set-level uses of `Mastered` with wording that describes what is actually being counted.

Use:

`Fully correct in this set`

or a grammatically compact variant where the existing line format requires it, provided it does not imply durable mastery.

Examples of intended semantic conversion:

- `Mastered 8 / 10` → `Fully correct in this set: 8 / 10`
- compact metric rows may use `Fully correct 8` when the surrounding Summary heading already makes the set scope unambiguous.

Do not change score computation, retention state, missed clearing, or SRS.

Remove the confirmed separate `Flagged this set (...)` action that duplicates the existing flagged review-scope control. Preserve the flagged review scope and its question population.

### A6 — make submitted matrix cells read-only without removing review accessibility

Do **not** solve this with the native `disabled` attribute.

After submission:

- keep matrix cells focusable so the learner can revisit selected/correct/incorrect states by keyboard or assistive technology;
- keep `aria-pressed` or the equivalent existing selection-state semantics;
- add `aria-disabled="true"` to communicate read-only state;
- ensure activation remains a no-op;
- remove hover/active affordances that imply mutability;
- use a default/non-action cursor rather than a pointer;
- preserve all submitted correctness styling.

Before submission, matrix behavior must remain equivalent from the learner's perspective.

Do not change matrix answer shape, grading, scoring, or question data.

### A7 — scope the mobile navigation rules to the global app navigation only

The current generic mobile rules for `nav`, `nav button`, and `nav button span` must no longer style arbitrary navigation regions.

Add a stable class to the global/main application navigation, for example `.app-primary-nav`, and scope the `max-width: 780px` rules to that class.

For the global-nav text labels at mobile widths, preserve the existing icon-first visual layout in this commission, but **visually hide** the text rather than using `display: none`. Reuse the existing `.sr-only` technique or equivalent CSS so each icon button retains its accessible name from its text node.

Do not add redundant `aria-label` strings when the visually hidden text already provides the accessible name.

Acceptance must prove that `.case-part-nav` retains visible part identity and is no longer affected by the global-nav grid/button/span rules.

This commission deliberately does not decide whether the later shell redesign should show full visible destination labels on mobile.

### A8 — make the Dashboard weak-topic action point to the exact topic

Do **not** preserve the current `topic → one category → historically incorrect category practice` route.

For each weak-topic row, change the action to open the existing Library with its **exact topic filter** selected.

Use learner-facing action wording such as:

`Open this topic / 打开此主题`

The resulting Library view should expose its existing exact-topic results and its existing filtered Study/Test actions. Do not add a new topic sampler.

The action must not collapse a shared topic to one arbitrary category.

Do not change Dashboard calculations or weak-topic ranking.

## 4. Preferred implementation slicing

Keep this commission reviewable. If the implementation seat is authorized to create commits, use three commits in this order. If it is not authorized to commit, preserve the same logical grouping in the diff and receipt.

### Slice 1 — learner truthfulness / visibility

Includes A1, A2, A3, A4, A5, A8.

Expected primary file: `src/App.tsx`  
Expected compatibility comment: `src/types.ts`

### Slice 2 — matrix submitted-state affordance

Includes A6 only.

Expected files: `src/App.tsx`, `src/styles.css`.

### Slice 3 — mobile nav selector containment

Includes A7 only.

Expected files: `src/App.tsx`, `src/styles.css`.

Do not mix shell/IA redesign work into any slice.

## 5. Explicit exclusions

Do not change:

- Home hierarchy or card structure;
- the number or identity of top-level destinations;
- active-session replacement behavior;
- resume semantics;
- Study/Test/Adaptive semantics;
- Builder counts or sampling;
- weighted NCLEX study sampling;
- Library one-question practice semantics;
- flashcard sequencing or SRS;
- Chinese reveal mechanics;
- translation telemetry;
- audio/TTS behavior;
- grading or retention semantics;
- storage schema or IndexedDB version;
- question banks, census, ledger, schema, or clinical content;
- `src/visuals/**`;
- update-check behavior;
- `file://` compatibility.

Do not add a progress-backup feature in this commission.

## 6. Acceptance criteria

All of the following must hold in the final candidate:

1. Ordinary Settings contains no Default mode control.
2. The legacy `defaultMode` field remains compatible with existing stored settings and has an explanatory source comment.
3. Ordinary learner Settings does not expose Preview Lab.
4. `?dev=1` continues to enable the existing developer-tool environment, and Preview Lab remains reachable there.
5. GPT rescue clearly describes a copy operation and still copies the same prompt content.
6. Question export cannot reasonably be mistaken for a full learner-state backup.
7. Summary does not call set-level full correctness `Mastered`.
8. Summary has one flagged-set review mechanism, not the current duplicate action plus scope control.
9. Submitted matrix cells remain keyboard-focusable/readable but expose read-only semantics and no mutation affordance.
10. Pre-submit matrix interaction and grading remain unchanged.
11. At a **390 × 844 CSS-pixel viewport**, global navigation retains accessible names while case-study part navigation retains visible part identity.
12. The mobile global-nav CSS no longer applies its grid/button/span rules to `.case-part-nav`.
13. A Dashboard weak-topic action opens Library filtered to that exact topic.
14. A topic shared across categories is not collapsed to one category by that action.
15. No bank, schema, grading, storage, renderer, sampler, or clinical-content behavior changes.

## 7. Verification

Per `AGENTS.md`, the minimum UI/CSS floor is:

- `npx tsc -b --pretty false`
- `npm run build`
- visual smoke of every affected surface

Also run:

- `git diff --check`
- any existing focused regression whose owned behavior is touched by the final implementation

Required browser smoke:

### Desktop learner mode

- Settings: Default mode absent; Preview Lab absent.
- Dashboard: weak-topic action lands in exact-topic Library state.
- Import/export: question export wording is explicit.
- Summary: corrected full-correct wording; no duplicate flagged action.
- Missed standalone question and missed case part: GPT-copy action and fallback behavior.
- Submitted matrix item: keyboard focus, read-only semantics, visible selected/correct/incorrect state.

### Developer mode

Launch through the existing `?dev=1` path and verify:

- Developer Review remains available;
- Telemetry remains available;
- Preview Lab remains available;
- ordinary learner behavior is otherwise unchanged.

### Mobile

Use **390 × 844 CSS px** and verify:

- global nav remains usable and programmatically named;
- no page-level horizontal overflow is introduced;
- a multi-part case still shows identifiable part labels/status;
- case Previous/Next/part controls are not restyled by the global-nav selector family.

### Production/file path

After the normal production build, perform the project's ordinary `file://` smoke sufficient to establish that this UI-only commission did not disturb direct-file loading.

## 8. Escalation rules

Stop the affected slice and report before proceeding if implementation appears to require any of:

- storage-version change;
- persisted-shape migration;
- grading change;
- question-bank mutation;
- schema change;
- new sampler behavior;
- renderer change under `src/visuals/**`;
- new runtime network/model dependency.

Do not broaden scope merely because an adjacent defect is convenient to fix.

## 9. Completion receipt

Return a concise receipt containing:

- files changed, grouped by Slice 1 / 2 / 3;
- exact learner-visible behavior changed;
- verification commands and results;
- browser-smoke surfaces and viewport(s);
- confirmation that unrelated Campaign 16 / bank / census state was untouched;
- any source drift encountered;
- any excluded follow-up issue observed but not changed.

Do not publish a `PROJECT-HISTORY.md` completion entry from an unaccepted implementation branch. Follow current repository governance after review/acceptance.

**Implementation-ready terminal after all required checks:** `UX0A_READY_FOR_REVIEW`
