# UX-0A / 0B / 0C architect review and shell proposal

Date: 2026-09-11
Reviewer: GPT-6 Astra Pro, disk-reading review seat
Reviewed snapshot: local `codex/ux-0c-finite-vocab-pass`, HEAD `4a0e589`; final application implementation `893fcb4`.

## Disposition

- **UX-0A: retain acceptance.** The UX-0B preflight records Luke's prior acceptance. This review found no reason to reopen it.
- **UX-0B: return for one bounded startup-input correction (B1).** The central guard and ordered persistence design are sound in the reviewed paths; the deferred callback can still use pre-hydration progress.
- **UX-0C: recommend acceptance.** The implementation follows the frozen pass, Again, completion, restart, and ephemeral navigation rulings.
- **Combined merge/publication: hold for B1.** This is not a request to redo the three commissions.
- **Shell proposal work: go.** Production shell integration should follow B1's correction and acceptance of the combined baseline.

These are review recommendations, not a merge, push, owner acceptance, or PROJECT-HISTORY publication. This note authorizes no implementation itself.

## Evidence and limits

Read AGENTS.md, all three frozen work orders, current PROJECT-HISTORY.md, current App.tsx launch/state/Home/Builder/Library/Dashboard/Vocab/Settings/Summary paths, both new helpers and focused regressions, the implementation receipts and browser-results JSON, the 0B preflight and actual browser driver, and the final 0C build identity. Inspected the mobile Home, Vocab progress/card, and replacement-dialog screenshots. Reviewed the relevant shell CSS.

Codex reports the required focused regressions, TypeScript, build, census checks where required, and HTTP/file-protocol browser checks passing. Those command and full-browser runs were not rerun by this reviewer on the Mac. The reviewer independently executed the isolated deterministic B1 source-level reproduction described below. It models separate render scopes and uses the current guard runtime; it is not an end-to-end React/browser test.

The worktree already contains four unrelated modified non-MCQ audit artifacts and the untracked ordered-response shuffle spec. They were not changed. No application source, bank, schema, storage, sampler, renderer, census, or history file was changed by this review.

## B1 — deferred launch retains pre-hydration progress

Severity: medium correctness issue; return for correction before unconditional 0B acceptance. This is not evidence that the replacement dialog loses recorded answers or that the ordered persistence queue is broken.

Source anchors at the reviewed snapshot:

- `src/App.tsx:423-455`: learner-data loading populates progress after startup.
- `src/App.tsx:524-530`: active-session hydration subsequently resolves the guard.
- `src/App.tsx:567-578`: requestSessionStart saves a callback referencing this render's performSessionStart.
- `src/App.tsx:594-614`: that function uses this render's progress for weighted sampling and unseen-first partitioning.
- `src/sessionStartGuard.ts`: the pending callback is intentionally held unchanged until execution.

A request made before the initial learner-data load completes waits correctly for the saved active session. However, waiting does not refresh the pending function's closed-over progress. Later renders create new functions; they do not update the old callback. Thus the launch may run after hydration while still treating previously answered questions as unseen.

The paired isolated reproduction uses the same two-question pool and deterministic shuffle. With one previously seen and one unseen question, the queued-before-hydration request produces `[seen-question, unseen-question]`; the same request made from the hydrated render produces `[unseen-question, seen-question]`. This reproduces both with no saved active session and with a protected draft requiring confirmation. No draw occurs before authorization, so the current no-early-draw checks do not detect the defect.

The actual 0B browser driver delays only the `activeSession` read. It waits until that read is intercepted, requests a launch, releases the read, then cancels. By then the separate learner-data Promise.all has completed. It therefore does not cover a launch held across progress hydration or inspect the resulting sample in that case.

### Bounded correction target

Preserve the learner's requested mode, count, order, weighting, title, explicit selection, and return destination, but separate them from incomplete startup data. Execute using hydrated sampling inputs, rather than the initial render's empty progress. A declarative pending intent or a narrowly late-bound executor is acceptable; a general state-management rewrite is not needed.

The repair should also explicitly test hydration-dependent source populations, especially uploaded questions and status-filtered pools. Do not blindly replace a frozen explicit selection with an unrelated current selection. Distinguish the learner's fixed request from catalog/progress data that had not yet loaded.

Do not fix this by disabling all launchers during startup, allowing sampling before authorization, changing weighting rules, adding session slots, or modifying persisted shapes.

Required new proof: delay initial progress loading (not only activeSession); request a known launch; verify zero construction/draws while blocked; release hydration; execute; compare eligible population and unseen/seen treatment to the equivalent post-hydration request under controlled randomness. Cover protected and unprotected hydration, cancellation, and duplicate activation. Preserve the existing ordered-write and immediate-reload proofs. Run the relevant 0B verification floor after the correction.

The adjacent `session-start-closure-repro.mjs` is an isolated review reproducer for the current failure, not the final application regression. It can run with `node audit/ux-0abc-architect-review-2026-09-11/session-start-closure-repro.mjs`.

## What should be retained

### 0A

The source and evidence support the narrow truthfulness changes: the dead Default mode learner control is gone without deleting its compatibility field; Preview Lab uses the existing developer gate; GPT actions describe copying; question export does not claim to back up progress; Summary uses full-correct terminology and one flagged scope. The exact-topic Dashboard callback resets other Library filters rather than reducing a shared topic to one category. The mobile navigation evidence retains accessible global names and visible case-part identity.

The broader Dashboard heading `Mastery and coverage` remains a known out-of-scope copy issue, not an undisclosed failure of the Summary-specific task.

### 0B

The protected predicate does not warn on an untouched session. Construction is centralized, pending requests are synchronously locked, cancellation clears the intent, the safe action receives focus, and Escape follows cancellation. All reviewed active-session save/clear sites use the ordered coordinator; the new snapshot is awaited before the replacement is published. The current-session identity check prevents an old asynchronous submission from attaching its result to a different new session.

Codex's preflight correction is justified: `sessionReturnView` is runtime state and is not serialized by toStoredSession. Preserving runtime return context rather than expanding the storage contract was the appropriate scope decision. Do not claim return-destination persistence across reload.

### 0C

The view owns a frozen ordered ID array, resolves content through a live map, and has no modulo wrap. The key includes scope/category/topic/readiness and Rescue membership only in Rescue scope. Same-key progress writes do not rebuild the pass. Review writes have duplicate protection and cannot advance a newly changed pass. Completion, empty state, and explicit restart are distinct; re-entry mounts a fresh pass after learner data has loaded.

The frozen spec explicitly rules that Again schedules later and advances without same-pass reinsertion. Implementing that ruling is correct even though an earlier product discussion considered a different policy. The recorded browser evidence includes the existing failed-review delay and successful scheduling behavior; this commission did not need a new relearning algorithm.

## Shell: recommended product direction

Refresh the application chrome and action hierarchy, not the learning engine. The current mobile Home screenshot shows seven icon-only destinations, repeated branding, a large promotional heading, six counters, competing Resume/new-set emphasis, and large utility cards duplicating navigation. The Vocab screenshot also spends substantial vertical space on chrome and filters before grading controls. These are observations about recorded fixtures, not measurements of the learner's real progress.

### Navigation proposal

Use four labeled primary destinations:

| Proposed learner label | Existing destination / behavior |
| --- | --- |
| Practice / 练习 | Home; Custom set opens the existing Builder |
| Vocabulary / 词汇 | Existing Vocab entry with its focus-clearing behavior |
| Library / 题库 | Existing Library and exact-topic routing |
| Progress / 进度 | Existing Dashboard calculations |

Keep Settings and question import/export as secondary utilities. Question management remains reachable without inventing a new authorization gate. Preserve the existing developer gate for Developer Review, Telemetry, and Preview Lab.

Do not delete Study all, Review answered, or other valid launch paths simply because they are demoted. Grouping an action under Custom set must not silently replace its callback with Builder's different launch semantics.

### Home proposal

When a set exists, lead with a compact Continue card containing factual existing session information and an unmistakable Resume action. Put new-set creation below it; retain the replacement gate. When no set exists, the existing weighted quick practice launcher becomes primary, retaining its count choices and default.

Place current mistakes and due-review entry points nearby as separate existing actions. Move broad inventory/performance counters to a compact secondary summary or Progress. Remove the oversized promotional hero and duplicate utility-card grid. This is not a new combined review queue, daily plan, recommendation engine, or mastery score.

### Two presentation variants, one behavior contract

**A — compact-header refresh:** four visible labeled destinations, minimal restructuring, compact Home. This is the lower-churn alternative.

**B — study workspace (recommended):** the same four destinations in a desktop side navigation, with a compact labeled mobile navigation and task-first Home. Settings/question management stay secondary. Preserve the wide question workspace; do not permanently subtract a large sidebar from case charts or visual items. Active-session chrome may be reduced only while retaining the existing exit/return actions and access to the rest of the app.

Do not commission a dashboard-first concept with new charts, streaks, goals, readiness estimates, or decorative pseudo-features. Compare two runnable variants on the same accepted behavior baseline, plus the incumbent as a reference, rather than running multiple unrestricted full-app rewrites.

## Shell constraints that must be in the eventual implementation brief

1. Preserve all 0A/0B/0C behavior. No new session constructor outside the guard; no storage/SRS/sampler/grading/schema/bank change; no clinical renderer or case visibility change; no runtime model/API dependency.
2. Preserve actual mode semantics. Home's recommended launcher invokes Study, despite its internal onTest prop name. Styling or renaming it must not turn it into Test.
3. Display effective set size separately from pool size without changing selection. Builder's ordinary launch currently requests 50; Adaptive defaults to a 75 target, each bounded by the available pool. Derive displayed counts from the same launch inputs, rather than duplicating a second count policy.
4. Preserve distinctions between existing populations. Home current mistakes uses the missed flag; Builder's incorrect filter uses historical incorrect counts. Do not imply those are identical sets. Exact-topic Dashboard routing must remain exact.
5. Preserve English-first question presentation, toggleable Chinese scaffolding, audio, light/dark themes, text-size controls, and production file-protocol behavior. Primary mobile destinations should have visible labels, not merely accessible hidden names.
6. Scope shell styling. Do not use a broad global nav/button override that again reaches case navigation, submitted matrix states, or correctness styling. Preserve the existing wide examination surface and check sticky offsets and overlays.
7. Keep the current active-session and Vocab lifecycles intact when rearranging components. Do not accidentally remount Vocab on a decorative layout toggle or make it resumable through shell state.
8. Keep import/export honest: question export is not a learner-state backup. Keep full learner-state backup as a separate durability commission. Rename Dashboard's mastery heading to a factual practice-history/coverage heading in the explicitly authorized copy scope.

## Comparison and acceptance

Before evaluating colors, use identical fixture states and ask the learner to continue an unfinished set, launch a small new set, find mistakes, open an exact weak topic, reach Vocabulary, complete a pass, and cancel an accidental replacement. Verify destinations and semantics, not only clickability.

Require 390×844 mobile and representative desktop checks, light/dark, large text, keyboard focus, visible destination labels, no page overflow, no obscured grading controls, and preserved case-part identity. The ordinary primary Home action should be visible without scrolling at the agreed default mobile viewport. The final 0B correction must be integrated before either proposal is considered a publishable shell candidate.

Recommended sequence: correct and verify B1; accept/publish the combined UX baseline through the authorized seat; freeze shell behavior and navigation; compare A and B; let Luke and the learner choose; integrate only the chosen presentation with focused regression checks.
