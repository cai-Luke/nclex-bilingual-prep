# Project Shrimp — Learner Shell R3 Concept A Production Implementation Work Order

**Status:** FROZEN IMPLEMENTATION ORDER — producer pass only  
**Date:** 2026-09-13  
**Implementation seat:** Codex  
**Baseline:** `main` at **`511f66b`**  
**Suggested branch:** `codex/learner-shell-r3-concept-a-r1`  
**Terminal on success:** `PROJECT_SHRIMP_LEARNER_SHELL_R3_CONCEPT_A_READY_FOR_INDEPENDENT_REVIEW`

## 0. Purpose

Implement the selected Learner Shell R3 **Concept A — F02 Descendant / Nordic Minimalist Study Space** as the real Project Shrimp learner shell.

This is a **production shell / information-architecture / presentation migration onto the existing accepted application behavior**. It is not a rewrite of Study, Review memory, storage, sampling, grading, question rendering, case rendering, bilingual behavior, or persistence.

The selected concept supplies the visual and hierarchy direction:

- quiet Study-first product shell;
- pale-stone / blue visual system;
- restrained chrome and low-shadow surfaces;
- one dominant Study action;
- Study-owned memory immediately adjacent to that action;
- three learner-level destinations: **Study · Library · Progress**;
- compact utility access rather than a broad application menu;
- mobile bottom navigation for those three learner destinations.

The production repository supplies all real behavior. Never copy the prototype's mock state engine, fake question renderer, fake settings semantics, or sample content into production.

## 1. Authority and inputs

Read in this order before editing:

1. `AGENTS.md`.
2. This work order.
3. Current `PROJECT-HISTORY.md`, especially the Sep 12 **Review/Vocabulary Omnibus, DB v7 Physical Cleanup, and Campaign 17 Phase C Integrated** milestone.
4. Current production `src/App.tsx` and `src/styles.css`.
5. Selected design reference:
   - `scratch/learner-shell-r3/concept-a/index.html`
   - `scratch/learner-shell-r3/concept-a/concept-a.css`
   - `scratch/learner-shell-r3/shared/shared.css`
   - `scratch/learner-shell-r3/evidence/screenshots/concept-a-study-shell.png`
   - `scratch/learner-shell-r3/evidence/verification-receipt.json`

On conflict, current production behavior and this work order beat prototype behavior. The prototype is a visual/hierarchy oracle only.

Do not infer requirements from older Review/Vocabulary concepts or historical product prose when current code and the Sep 12 integrated milestone disagree.

## 2. Repository isolation

The owner/default checkout currently contains unrelated concurrent archaeology artifacts. They are outside this task.

This work order is intentionally an owner-side untracked launch artifact at the time of commissioning; it is not part of baseline commit `511f66b`. Before creating the implementation worktree, read this file from the owner checkout and record its SHA-256. From the isolated worktree, continue to treat that same owner-checkout file/hash as the active work order; after any context recovery or compaction, reread it from that path. Do not stage, edit, move, or commit the owner's copy unless explicitly instructed.

Before editing:

- verify the source commit is exactly `511f66b`;
- create/use an **isolated clean worktree** from that commit on the task branch;
- do not stash, clean, reset, rename, delete, stage, or otherwise touch unrelated files in the owner's default checkout;
- do not use the default checkout as the implementation worktree;
- do not fetch/rebase/merge unrelated later work into this commission unless the owner explicitly rebinds the baseline.

If the required clean baseline cannot be established, stop and report the exact state instead of repairing the checkout.

## 3. Product model to preserve

The product is now fundamentally:

> **Study + memory around Study.**

The learner's ordinary path is:

1. open the app;
2. start or continue Study;
3. answer questions;
4. read rationales/explanations;
5. optionally keep `Revisit missed questions` enabled so current `needsReview` items can recur naturally;
6. use Saved for intentional bookmarks;
7. inspect the most recent completed ordinary Study set when useful.

The accepted Review/Vocabulary simplification is load-bearing:

- `needsReview` is the durable binary review state;
- a future full-marks attempt clears it under the accepted current implementation;
- Saved is a manual, independent bookmark state;
- Last Set is bounded completion memory, not a new historical analytics subsystem;
- remediation launches use the existing Study/session machinery;
- there is no standalone Vocabulary destination, vocabulary SRS, Review scheduler, or second memory engine to recreate.

Do not introduce readiness/pass-fail claims.

## 4. Required information architecture

### 4.1 Learner primary navigation

Replace the current broad learner nav (`Home`, `Customize`, `Progress`, `Library`, `Import`, `Settings`) with a Study-centered hierarchy.

The only persistent learner-level destinations are:

1. **Study** — the home/root learner surface;
2. **Library**;
3. **Progress**.

Rules:

- **Customize** remains real functionality but becomes a subordinate Study action, not a primary destination.
- **Import** remains real functionality but becomes a subordinate/advanced Library action, not a primary destination.
- **Settings** remains a utility destination reachable from compact header chrome; it is not a peer primary tab.
- **Preview Lab** remains low-prominence Settings/developer utility behavior and must not enter learner primary navigation.
- **Developer** remains dev-gated and must not appear in the ordinary learner IA.
- Do not add Review or Vocabulary to navigation.

Desktop may express the three destinations in compact header navigation rather than the prototype's mobile tab treatment. Keep the hierarchy unmistakable and quiet.

### 4.2 Mobile navigation

For ordinary top-level learner surfaces, provide a persistent safe-area-aware bottom navigation with exactly:

- Study
- Library
- Progress

Use the selected Concept A visual treatment as the direction, but use production icons/components and accessible labels.

**Active Study sessions are an exception:** hide the learner bottom navigation while `view === "session"`. Preserve the existing distraction-reduced mobile session shell, sticky answer/session controls, and calculator clearance. Do not create a second bottom layer competing with Submit/Next/Skip or the calculator.

Also do not force the bottom navigation into modal dialogs, Preview Lab, or Developer Review.

### 4.3 Compact header

The ordinary learner header should become materially quieter than the current six-destination header.

Required:

- compact product/Study identity;
- utility access to Settings;
- desktop access to Study / Library / Progress.

Do **not** literally implement the prototype's fake `ZH` switch or its `100/125/150/200` text-scale model. Production language behavior is session-aware and production text size is `Compact / Default / Large`.

A quick utility control may only be added if it is a direct presentation of an already-existing setting with identical semantics. No new settings/state are authorized. Prefer restraint over reproducing every prototype header button.

## 5. Study root / home redesign

The current marketing-like hero should become a quiet Study workspace.

### 5.1 Dominant action bay

The first and visually dominant surface is the current Study action.

When there is a resumable session:

- continuation is the dominant action;
- show concise factual progress from the existing session state;
- starting another set must continue to use the existing replacement-protection flow.

When there is no resumable session:

- present 10 / 25 / 50 question count selection;
- preserve the existing `Revisit missed questions` setting and exact runtime behavior;
- present one dominant `Start practice` action;
- expose `Customize` as a subordinate action.

Do not invent a second session configuration model.

### 5.2 Memory attached to Study

Immediately adjacent/subordinate to the dominant Study action, surface the existing three memory affordances:

- **Needs review** — factual count and entry to current `MemoryList` behavior;
- **Saved** — factual count and entry to current Saved behavior;
- **Last set** — bounded latest completed ordinary Study set when present.

The visual structure should descend from Concept A's memory dock rather than treating these as unrelated navigation destinations.

Do not add streaks, readiness estimates, mastery scores, due dates, SRS language, or a historical set browser.

### 5.3 Move general statistics out of the hero

The large decorative `Questions / Answered` hero metrics are not part of the selected direction. Progress already owns factual statistics. Remove or demote them from the Study root rather than preserving them as visual furniture.

## 6. Visual system

Translate Concept A's visual language into the existing production CSS architecture. Do not wholesale paste the prototype stylesheet.

### 6.1 Direction

Light mode should be recognizably based on the Concept A palette:

- pale cool canvas near `#f1f4f8`;
- white primary surfaces;
- cool raised/wash surfaces near `#f8fafc` / `#e9eef5`;
- dark navy/slate text near `#0f172a`;
- muted slate text near `#475569` / `#64748b`;
- blue primary accent centered around `#1e3a8a` with pale blue accent surfaces.

Dark mode should use the selected concept's blue-slate family rather than the current green family, approximately:

- canvas near `#0c111d`;
- surface near `#161f30`;
- raised surface near `#1c283e`;
- blue accent near `#3b82f6`.

These are design anchors, not a license to degrade current semantic contrast. Preserve or minimally adapt current success/error/warning semantics so answer correctness remains immediately legible.

### 6.2 Shape and density

- use a disciplined small radius family comparable to 4 / 8 / 12 px;
- reduce decorative shadows substantially;
- prefer borders, spacing, and surface hierarchy over elevated-card effects;
- keep typography compact and reading-oriented;
- use the existing system font stack; add no web font or external asset;
- no gradient-heavy hero treatment;
- no decorative animation requirement.

### 6.3 Clinical visuals

Do not change registered visual renderers, visual payloads, deterministic SVG contracts, or clinical display semantics.

Clinical visual surfaces that are intentionally light-locked must remain light-locked in dark mode. This task styles the surrounding application shell, not the medical renderers.

## 7. Active Study session: preserve behavior, reskin only

The prototype's question screen is not an implementation template.

Production Study must retain all current behavior, including where applicable:

- every supported item type;
- case-study part navigation and current stage-visibility behavior;
- standalone visual layouts and focused visual mode;
- bilingual language modes and on-demand reveals;
- glossary interaction;
- voice controls;
- Save/flag behavior;
- GPT rescue/copy behavior;
- rationale and per-choice explanation behavior;
- skip/revisit flow;
- Submit / Next / Finish behavior;
- mobile sticky controls;
- exam calculator, including its mobile bottom-sheet/launcher clearance;
- current persistence and resume behavior.

Allowed work inside the Study surface is presentation-only: spacing, borders, colors, density, header treatment, and other shell styling required to make it belong to Concept A.

Do not create prototype-only concepts such as a new `Key Takeaway` data field or new rationale summary.

## 8. Settings, Library, Progress, and secondary surfaces

### Library

Preserve current browsing, filtering, inspect, save, and practice behavior. Make Import accessible as a clearly secondary/advanced action from Library. Do not change import storage or collision behavior.

### Progress

Preserve factual reporting and current topic links. Restyle it into the selected shell; do not invent predictive/readiness analytics.

### Settings

Preserve current language, theme, text-size, voice, build diagnostic, and Preview Lab behavior. Restyle only. No new setting schema or persisted field.

### Needs Review / Saved / Last Set / Inspect / Summary

Preserve the accepted memory semantics and existing launch/return behavior. Give these surfaces the same visual language and clear return path to Study.

### Developer / Preview Lab

Functionality remains available under its existing gates, but it is not a visual north star for learner IA and must not distort the learner shell.

## 9. Hard scope boundary

Expected production edit surface is primarily:

- `src/App.tsx`
- `src/styles.css`

A small presentation-only component/helper or focused UI test is allowed if it clearly reduces risk or complexity.

This task must **not** change:

- `src/storage.ts`
- `src/progressMigration.ts`
- `src/sessionSampler.ts`
- `src/grading.ts`
- `src/schema.ts`
- question-bank JSON
- schema versions
- IndexedDB version or object stores
- progress/review semantics
- completion-memory semantics
- bank loading/import contracts
- renderer implementations under `src/visuals/**`
- canonical census artifacts
- package dependencies

Do not modify the R3 concept files; they are reference evidence.

Do not update `PROJECT-HISTORY.md` on the producer branch. Current project governance allows implementation history publication to wait for accepted review/integration; the publishing/merge seat owns that status entry.

## 10. Accessibility and responsive requirements

Treat these as acceptance requirements, not polish if time remains.

- visible keyboard focus on all new or moved controls;
- semantic buttons/links rather than clickable generic containers where production behavior is being touched;
- native replacement dialog semantics and focus behavior preserved;
- no horizontal page overflow at target mobile widths;
- bottom navigation respects `env(safe-area-inset-bottom)`;
- content reserves enough bottom space that the nav does not obscure controls or list rows;
- production `Large` text mode remains usable;
- browser 200% zoom must keep the replacement-dialog title and safe action immediately understandable and reachable;
- dark mode contrast remains readable;
- Chinese scaffold text must not become the dominant typographic voice over English exam content.

## 11. Required verification

### 11.1 Deterministic regression floor

Run at minimum:

```bash
npx tsc -b --pretty false
npm run test:review-memory
npm run test:session-start-guard
npm run test:session-navigation
npm run test:session-sampler
npm run test:exam-layout
npm run test:calculator
npm run test:app-update
npm run build
git diff --check
```

If implementation touches a surface with a more specific existing regression, run it as well.

No bank/content change is authorized, so do not regenerate census or bank artifacts merely to make unrelated drift disappear. If a supposedly UI-only change causes census/bank drift, stop and investigate.

### 11.2 Browser visual/behavior smoke

Use real Chrome against both development/served output where useful and the final production `file://` artifact. Record viewport, theme, and result.

At minimum cover:

**Study root / IA**
- desktop around 1440×900, light and dark;
- mobile 390×844 (or nearest exact device viewport), light and dark;
- exactly Study / Library / Progress as learner primary navigation;
- Settings reachable as utility;
- Customize subordinate to Study;
- Import subordinate to Library;
- no ordinary learner Review/Vocabulary nav;
- no page-level horizontal overflow.

**Session safety**
- resumable active session shown as dominant action;
- starting another set invokes the existing replacement dialog;
- safe/default `Keep current set` behavior remains obvious;
- Escape/cancel preserves current set;
- focus returns appropriately;
- hydration/startup wait state cannot be bypassed by the new shell.

**Study behavior**
- ordinary question select → submit → rationale → next;
- Saved/flag toggle;
- on-demand Chinese or current language control on a representative question;
- glossary interaction where available;
- GPT rescue/copy action where eligible;
- at least one standalone visual question;
- at least one case study;
- mobile sticky Submit/Next/Skip controls;
- mobile calculator launch/use/close without collision with shell chrome;
- no learner bottom nav during active Study.

**Memory surfaces**
- Needs Review entry, inspect/practice, and return;
- Saved entry, inspect/practice/remove, focus recovery, and return;
- Last Set inspection and retry/practice path;
- Summary after a newly completed set;
- counts agree with production state; no new memory state introduced.

**Utilities**
- Library filtering/inspect/practice still works;
- Import entry still works;
- Progress renders factual stats and topic navigation;
- Settings persists theme/text/language behavior exactly as before;
- update banner remains usable if forced/tested;
- Developer remains hidden without dev enablement.

**Stress**
- production Large text mode;
- browser 200% zoom on the Study root and replacement dialog;
- final `file://` build loads and navigates with no module/path errors;
- browser console has no new application warning/error attributable to the change.

Screenshots should include at least:

1. desktop Study root light;
2. desktop Study root dark;
3. mobile Study root with three-tab bottom nav;
4. mobile active Study showing the bottom nav absent and existing action controls intact;
5. Needs Review or Saved memory surface;
6. replacement dialog at stressed text/zoom.

Store task-owned evidence under a new, clearly named audit directory; do not overwrite another task's committed evidence directory.

## 12. Diff and invariance proof

Before declaring readiness:

- list every changed production file and justify it;
- prove no bank file changed;
- prove `src/storage.ts`, `src/progressMigration.ts`, `src/sessionSampler.ts`, `src/grading.ts`, and `src/schema.ts` are byte-unchanged from `511f66b`;
- confirm no package dependency changed;
- confirm no R3 concept reference file changed;
- confirm unrelated archaeology files/default-worktree state were never modified;
- inspect the final diff for accidental copy changes that would alter Study/Review semantics.

## 13. Producer receipt

Write a task-local implementation receipt under a new audit directory. Include:

- exact baseline and final commit;
- branch/worktree used;
- changed-file inventory;
- concise mapping of Concept A design elements to production surfaces;
- explicit list of prototype behaviors intentionally **not** copied;
- deterministic command results;
- browser scenario matrix and screenshot paths;
- `file://` proof;
- invariance proof from §12;
- any nonblocking visual divergences from Concept A and why production behavior required them;
- any delegated work, by seat/model and role.

Do not claim independent acceptance. Stop after the producer commit/receipt and return the terminal:

`PROJECT_SHRIMP_LEARNER_SHELL_R3_CONCEPT_A_READY_FOR_INDEPENDENT_REVIEW`

## 14. Prohibited actions

Without a new owner instruction, do not:

- merge to `main`;
- push `main`;
- deploy GitHub Pages;
- alter bank content;
- alter storage/schema/grading/sampler semantics;
- recreate retired Review/Vocabulary machinery;
- add a dependency or design framework;
- add a backend or runtime network requirement;
- force-push;
- clean/stash/reset another worktree;
- rewrite or delete unrelated evidence;
- treat visual similarity to the prototype as authority to regress production behavior.
