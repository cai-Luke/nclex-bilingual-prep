# Project Shrimp UX-0B — Active-Session Replacement Protection

**Date:** 2026-09-11  
**Status:** QUEUED — SPEC FROZEN; DO NOT IMPLEMENT UNTIL THE CURRENT CAMPAIGN-16 WORKTREE IS CLOSED OR A CLEAN POST-CAMPAIGN WORKTREE IS CUT  
**Implementation order:** after accepted UX-0A unless Luke explicitly supersedes that order  
**Implementation seat:** Codex / coding agent  
**Change class:** session lifecycle + learner UI; no schema, bank, grading, or persisted-shape change authorized

## 0. Purpose

Prevent a learner from accidentally replacing meaningful unfinished work in the application's one resumable active session.

Project Shrimp intentionally has one active resumable session. Preserve that architecture. This commission adds a replacement gate and makes its persistence ordering provable; it does **not** create session history, multiple slots, cloud sync, or a new session-management product.

This work protects actual learner work product rather than merely changing labels. Treat it as a separate reviewable lifecycle diff from UX-0A.

## 1. Source freeze and authority

This work order was prepared against local `main` at:

- HEAD: `a639b5f` (`docs(campaign16): archive Phase E census and residual evidence`)
- `src/App.tsx`, `src/sessionState.ts`, `src/sessionNavigation.ts`, `src/storage.ts`, and `src/styles.css`: no local diff at spec-preparation time
- the worktree otherwise contains active Campaign 16 bank/census/audit state that is explicitly outside this commission

Before implementation:

1. Read `AGENTS.md` first.
2. Read this work order in full.
3. Re-open current `PROJECT-HISTORY.md`, relevant `DECISIONS.md`, `src/App.tsx`, `src/sessionState.ts`, `src/sessionNavigation.ts`, and `src/storage.ts`.
4. Inspect current repository/worktree state and preserve unrelated changes.

The repository remains authoritative for **current mechanical state**. This work order is authoritative for **authorized scope and product decisions**.

If the launch topology, active-session persistence path, or session shape named below has materially drifted by implementation time, do not silently reinterpret the work order. Report the exact drift as `UX0B_SOURCE_DRIFT`, stop that affected slice, and continue only separable work whose premises still hold.

## 2. Verified current launch topology

At spec freeze, every learner action that directly creates a session reaches one common function in `src/App.tsx`:

`startSession(records, mode, title, options)`

Adaptive construction is delegated from that function to `startAdaptiveSession`; no learner call site constructs a session inline.

Verified direct launch families are:

1. Home — Study all questions.
2. Home — recommended NCLEX-weighted practice count.
3. Home — Review mistakes.
4. Home — Review answered questions.
5. Home — Spaced review.
6. Session Builder — Study/Test/Adaptive start.
7. Library — filtered Study.
8. Library — filtered Test.
9. Library — one-question practice via `practiceOne`, which itself calls `startSession`.
10. Summary — Practice related.

Dashboard practice actions currently open Builder rather than constructing a session, so they inherit the Builder launch path.

Before the first edit, re-run the caller search. If a new direct session constructor or bypassing caller exists, report it before implementation rather than adding a one-off warning at that call site.

## 3. Verified current active-session behavior

The current application:

- hydrates uploaded records first, then asynchronously calls `loadActiveSession()`;
- stores at most one active-session snapshot;
- writes the active snapshot whenever the live `session` state changes after hydration;
- clears the active snapshot when a session completes or is explicitly ended;
- exposes `End set` during an ordinary active session and `End session` from the skipped-question prompt.

Therefore replacement is **not** the learner's only way to leave an unwanted session. Do not add a new discard-session product flow in this commission.

The current snapshot contains submitted-answer results and scores, unsubmitted answer drafts, skip state, phase, index, language mode, return context, and adaptive state as represented by the existing session/storage contracts. Do not widen those contracts here.

## 4. Protected-state definition

Do **not** warn merely because a session object exists.

A session is protected when all of the following are true:

1. a session exists;
2. it is not completed; and
3. the learner has invested meaningful set-local work, defined for this commission as at least one of:
   - at least one submitted result exists (`session.results` nonempty);
   - at least one answer/draft entry exists (`session.answers` nonempty), including case-part drafts;
   - at least one question is in the session skip list (`session.skippedQuestionIds` nonempty).

An untouched just-created session with no submitted result, no draft entry, and no skipped question is **not protected** and may be replaced without confirmation.

Do not broaden the protected predicate to language-mode changes, mere session age, flags, or the existence of the session object alone.

## 5. Required launch architecture — deferred intent

The replacement gate must be centralized. Do not add independent confirmation logic to Home, Builder, Library, Summary, or individual buttons.

### 5.1 Split request from execution

Preserve one actual unguarded session-construction path containing the current launch semantics. The exact names are implementation-local, but the architecture must be equivalent to:

- `requestSessionStart(intent)` — lifecycle gate;
- `performSessionStart(...)` — the existing actual session creation behavior;
- `performAdaptiveSessionStart(...)` — adaptive creation if retained as a helper.

Existing callers should continue to request their exact launch, but creation must occur only through an intent held by the gate.

### 5.2 Intent requirements

The pending intent must capture the **identical launch the caller requested**. Nothing that can alter the resulting set or caller state may execute before authorization.

Before confirmation, do not:

- seed a draw;
- call `Math.random()` for the requested draw;
- shuffle records;
- invoke `buildWeightedSession`;
- choose the first adaptive item;
- construct a `SessionState`;
- change `sessionReturnView`;
- change `view` to `session`;
- clear or overwrite the current active snapshot.

This prevents a cancelled request from consuming or perturbing draw state even if current samplers are otherwise pure.

### 5.3 One pending request at a time

Maintain at most one pending session-start intent.

While one request is awaiting hydration or learner disposition, repeated/rapid launcher activation must not create additional dialogs, replace the pending intent, consume another random draw, or start multiple sessions.

After either Cancel/Keep or confirmed replacement resolves, pending state must be fully cleared so a later request works normally.

## 6. Hydration race — resolve inside the gate

A launch request made before active-session hydration resolves must not outrun discovery of a saved session.

Do **not** solve this by leaving ordinary launch controls silently disabled during startup.

Required behavior:

1. accept the launch request as one pending deferred intent;
2. wait for the existing active-session hydration to resolve;
3. evaluate the protected-state predicate against the hydrated session;
4. either execute immediately or open the replacement confirmation.

If implementation adds visible waiting state, expose it accessibly (for example `aria-busy`) rather than presenting an unexplained disabled control. A visible waiting affordance is optional; the lifecycle behavior is not.

No requested draw may be constructed while hydration is unresolved.

## 7. Confirmation UI

Use a small in-app native `<dialog>` confirmation local to the learner application shell. Do not use `window.confirm`, and do not introduce a modal framework.

The repository already uses native `<dialog>` patterns for focused visual inspection; no reusable general confirmation component currently exists. Do not modify `src/visuals/**` to obtain this behavior.

### 7.1 Required meaning

The dialog must explain the actual consequence accurately:

- already-recorded answer history/progress remains recorded;
- the current set will cease to be the resumable set;
- unsubmitted drafts and the remaining set context will no longer be resumable after replacement.

Do not say or imply that all progress is deleted.

Use English first with Simplified-Chinese parity, consistent with the rest of the learner UI.

Suggested copy may be refined for naturalness without changing meaning:

**Title**  
`Start a new set?`  
`开始新的练习吗？`

**Body**  
`You have unfinished work in the current set. Recorded answer history will stay, but this set — including unsubmitted drafts and remaining questions — will no longer be resumable.`  
`当前练习还有未完成内容。已记录的答题历史会保留，但当前练习（包括未提交的草稿和剩余题目）将无法再继续。`

**Safe action**  
`Keep current set / 保留当前练习`

**Destructive action**  
`Start new set / 开始新练习`

### 7.2 Dialog behavior

- Initial focus goes to the safe action.
- Escape/cancel is equivalent to `Keep current set`.
- Cancel closes the dialog, clears the pending intent, and leaves learner/application state unchanged.
- On cancel, restore focus to the initiating control when that control is still mounted.
- Confirm closes the dialog and executes the held intent exactly once.
- Rapid activation produces one dialog and one eventual launch.

Do not add confirmation to Resume. Resume is never a replacement.

## 8. Ordered active-session persistence

Confirmation alone is insufficient if an earlier asynchronous active-session write can land after the replacement.

At spec freeze, `App.tsx` is the only caller of `loadActiveSession`, `saveActiveSession`, and `clearActiveSession`. `saveActiveSession` and `clearActiveSession` are asynchronous, and current callers intentionally do not await them.

### 8.1 Required invariant

After this commission, active-session save/clear operations initiated by the application must have one explicit ordering mechanism so the final persisted active session reflects invocation order.

A confirmed replacement must not expose the new session as successfully launched until the new active-session snapshot has been placed **after all earlier queued active-session operations** and that write has completed through the existing storage abstraction.

The preferred bounded implementation is an App-level ordered promise queue/coordinator around the existing `saveActiveSession` / `clearActiveSession` functions. Route every active-session save/clear call in `App.tsx` through it, including:

- invalid-hydration cleanup;
- ordinary autosave;
- explicit `finishSession` clear;
- adaptive completion clear;
- normal completion clear;
- confirmed replacement persistence.

A tiny extracted helper is acceptable if it materially improves deterministic testing.

### 8.2 Storage boundary

No edit to IndexedDB schema, `DB_VERSION`, `StoredSessionSnapshot`, or the `activeSession` object-store shape is authorized.

An edit to `src/storage.ts` is **not expected**. If the implementation concludes that ordered replacement cannot be made correct without changing storage internals or persisted shape, stop and report `UX0B_STORAGE_ESCALATION` rather than broadening scope.

### 8.3 No false durability claim

The existing storage abstraction may fall back to memory where IndexedDB is unavailable, including some `file://` contexts. Do not add `Saved locally`, `Safely saved`, or any other claim of durable persistence.

## 9. Cancellation invariants

Cancelling replacement must be side-effect free with respect to both the active session and the requested launch.

Preserve the current session's:

- `id`;
- mode;
- question list and pool IDs;
- current index;
- answers/drafts;
- results and scores;
- skipped-question IDs;
- phase;
- language mode;
- adaptive state;
- resumability;
- `sessionReturnView`.

Also preserve the learner's current non-session destination. For example, cancelling from Builder leaves the learner in Builder; cancelling from Library leaves the learner in Library.

The cancelled requested launch must not have generated or shuffled a set.

## 10. Confirmed replacement invariants

After confirmation, the requested new session must preserve every pre-commission launch semantic:

- same source record population;
- same requested count;
- same order option;
- same NCLEX weighting behavior where requested;
- same unseen-first behavior where applicable;
- same Study/Test/Adaptive semantics;
- same language startup behavior;
- same adaptive target count and first-item logic;
- same title;
- same requested return destination.

The replacement gate changes **when** construction is permitted, not **what** construction does.

Do not make the protected-session predicate influence sampling.

## 11. Explicit non-goals

Do not add:

- multiple resumable sessions;
- named session slots;
- completed-session history;
- cloud synchronization;
- learner-state export/import;
- a new discard-session command;
- a new router/state-management library;
- a modal framework;
- new sampler rules;
- new adaptive behavior;
- new readiness/pass-fail claims;
- bank, schema, grading, clinical-content, or renderer changes.

Do not redesign Home or the learner shell in this commission.

The existing `End set` / `End session` affordance is sufficient to keep an unwanted current set from becoming sticky; broader wording/hierarchy belongs to the later shell/IA work.

## 12. Required implementation preflight receipt

Before editing, record in the implementation receipt or task notes:

1. current commit/worktree identity;
2. the current session-construction chokepoint by file/function;
3. every direct caller of that chokepoint;
4. every current `saveActiveSession` / `clearActiveSession` caller;
5. whether any source drift from §§2–3 exists.

If all verified topology remains as frozen here, proceed without further product adjudication.

## 13. Acceptance scenarios

Demonstrate all applicable scenarios against the final candidate.

### Unprotected start

1. No active session → ordinary Home launch starts normally without a dialog.
2. Existing untouched session with no result, no draft entry, and no skipped question → new launch replaces it without a dialog.

### Protected work

3. Unsubmitted standalone answer draft → new launch requests confirmation.
4. Unsubmitted case-study draft in any part → new launch requests confirmation.
5. At least one submitted answer → new launch requests confirmation.
6. Study session with skipped-question state but no submitted result → new launch requests confirmation.
7. Adaptive session with prior answered work → new launch requests confirmation.

### Cancel

8. Cancel from Home → current active session and return context remain byte/structurally equivalent at the session-state level.
9. Cancel from Library one-question practice request → Library remains visible and the old session remains resumable.
10. Cancel from Builder Test/Adaptive request → Builder selections remain and the old session remains resumable.
11. Cancel, then immediately request the same launch again → a fresh confirmation works; there is no stuck pending intent.
12. Escape/cancel behaves the same as the safe button and restores focus when possible.

### Confirm

13. Confirm Home weighted practice → requested count/weighting is unchanged and a new session starts once.
14. Confirm Library single-question practice → exactly that question starts with `returnView: "library"`.
15. Confirm Builder Adaptive → existing adaptive target and first-item semantics are unchanged.
16. Confirm Summary related practice after an actually completed prior session → no false unfinished-session warning occurs.

### Return-context edge case

17. Start a session from Library, leave it unfinished, navigate to Home without ending it, request a new Home session:
    - Cancel preserves the old session's Library return context.
    - Confirm creates the new Home-origin session with Home return context.

### Duplicate/race protection

18. Rapid double activation while a protected session exists → one pending intent, one dialog, and at most one resulting new session.
19. Inject or otherwise deterministically simulate delayed hydration → a launch request made before hydration completes waits, then evaluates the hydrated session before any draw is constructed.
20. Confirm replacement and reload **immediately after the new session is visibly launched** → the new session, not the replaced session, is the resumable session when durable IndexedDB is available.
21. Deterministically delay an earlier active-session save so that it overlaps replacement → ordered persistence still leaves the new session as the final active snapshot.

### Fallback storage

22. In a context where IndexedDB is unavailable, replacement still behaves correctly for the current runtime through the existing memory fallback. Do not claim reload durability in that context.

## 14. Verification

This is more than a cosmetic UI change. Do not classify it as CSS-only merely because most implementation may remain in `App.tsx`.

### Required focused automated checks

Run:

- `npm run test:session-navigation`
- `npx tsx scripts/tests/session-sampler.ts`
- `npm run test:storage-category-migration`
- `npx tsc -b --pretty false`
- `npm run census:check`
- `npm run build`
- `git diff --check`

### New regression

Add a focused deterministic regression for the replacement guard / ordered persistence behavior. Prefer:

- `scripts/tests/session-start-guard.ts`
- package script `test:session-start-guard`

The regression should cover, without requiring real clinical bank mutation:

- protected-state predicate;
- untouched-session non-protection;
- deferred intent executes zero times on cancel and once on confirm;
- duplicate pending requests do not multiply execution;
- hydration-delayed request cannot execute early;
- cancelled request performs no sampler/session-construction callback;
- active-session persistence operations execute in required order under injected asynchronous delays;
- replacement's final persisted identity wins after an earlier delayed save.

A small pure/helper extraction to make this deterministic is authorized. Do not extract general application state architecture.

### Browser smoke

Cover at minimum:

- Home weighted practice;
- Study all;
- current mistakes/due review path;
- Builder Study/Test/Adaptive;
- Library filtered Study/Test;
- Library one-question practice;
- Summary related practice;
- standalone draft cancellation;
- case-study draft cancellation;
- skipped-review state;
- adaptive state;
- rapid double activation;
- keyboard focus and Escape behavior of the dialog.

For the hydration race, use an injected/dev-only delay or deterministic harness; do not claim it was manually proven if no delay was actually introduced.

For persistence ordering, reproduce the delayed-write case deterministically and also perform the immediate-reload browser smoke where the environment provides durable IndexedDB.

### Production/file path

After the normal production build, perform the project's ordinary `file://` smoke sufficient to establish:

- the app still loads directly;
- session launch works;
- replacement dialog works;
- the existing in-memory fallback remains nonfatal if durable storage is unavailable.

Do not overstate file-protocol persistence if the browser blocks IndexedDB.

## 15. Likely files

Expected primary files:

- `src/App.tsx`
- `src/styles.css`

Authorized if useful for bounded deterministic proof:

- one small session-start/persistence helper under `src/`;
- one focused test under `scripts/tests/`;
- `package.json` only to wire that focused test command.

`src/storage.ts` and persisted types are not expected to change.

## 16. Escalation rules

Stop the affected work and report before proceeding if the implementation appears to require:

- IndexedDB version change;
- `StoredSessionSnapshot` shape change;
- migration of existing session data;
- change to grading, progress, or retention semantics;
- change to sampler output rules;
- bank or schema mutation;
- renderer changes under `src/visuals/**`;
- a runtime network/model dependency;
- multi-session storage.

Do not broaden scope because an adjacent session UX issue is convenient to fix.

## 17. Completion receipt

Return a concise receipt containing:

- files changed;
- preflight chokepoint/caller inventory;
- exact protected-state predicate implemented;
- exact dialog behavior and copy;
- mechanism used to defer session construction;
- mechanism used to prevent duplicate pending launches;
- mechanism used to await hydration;
- **mechanism that prevents an earlier in-flight active-session save from becoming the final persisted snapshot after replacement**;
- verification commands and results;
- browser-smoke scenarios actually performed;
- delayed-hydration and delayed-save proof method;
- immediate-reload persistence result and whether durable IndexedDB was available;
- confirmation that unrelated Campaign 16 / bank / census state was untouched;
- any source drift or escalation encountered.

Do not publish a `PROJECT-HISTORY.md` completion entry from an unaccepted implementation branch. Follow current repository governance after review/acceptance.

**Implementation-ready terminal after all required checks:** `UX0B_READY_FOR_REVIEW`
