# Project Shrimp UX-0B R1 — Startup Data Freshness Correction

**Date:** 2026-09-11
**Status:** READY FOR CODEX — bounded correction to completed UX-0B implementation
**Implementation seat:** Codex / coding agent
**Change class:** session lifecycle + learner UI; no schema, bank, grading, sampler-rule, persisted-shape, or renderer change authorized
**Parent:** `UX-0B-ACTIVE-SESSION-REPLACEMENT-PROTECTION-CODEX-SPEC-2026-09-11.md`
**Review inputs:** `audit/ux-0abc-architect-review-2026-09-11/architect-review.md` plus owner-supplied Claude live-code review on 2026-09-11

## 0. Purpose and disposition

Correct one post-review startup race in UX-0B without reopening the accepted replacement-dialog or ordered-persistence design.

The current gate correctly waits for active-session hydration, but a request issued before the application's initial learner-data hydration completes can retain two stale inputs:

1. the `performSessionStart` closure can retain that render's empty `progress` object; and
2. `requestedRecords` can be frozen before uploaded records have loaded, so an All/Home population can be bundled-only.

The highest-value affected launches are the Home quick-practice action (`weighting: "nclex"`) and Home Study all. This is a first-draw correctness defect, not answer-history loss. The active-session ordered-write mechanism remains in scope only for regression preservation.

This successor does **not** authorize learner-shell redesign. It is intended to land before shell integration because it touches the same Home/request-session call sites.

## 1. Source and worktree preflight

The review was performed against local `codex/ux-0c-finite-vocab-pass` at HEAD `4a0e589`, whose final UX-0C implementation is `893fcb4` and whose UX-0B implementation is `13efd36` in its ancestry.

The current worktree contains unrelated modified non-MCQ audit artifacts plus unrelated untracked review/spec files. **Do not implement in that dirty tree.** Cut a clean worktree/branch from the reviewed committed baseline (`4a0e589` unless current repo history establishes an explicitly accepted successor) and preserve every unrelated file.

Before editing:

1. read `AGENTS.md`;
2. read the parent UX-0B work order;
3. read this successor in full;
4. read current `src/App.tsx`, `src/sessionStartGuard.ts`, `src/storage.ts`, `scripts/tests/session-start-guard.ts`, and the 0B implementation receipt/browser evidence;
5. re-run the direct session-launch and active-session save/clear caller inventories;
6. record exact branch/HEAD and any source drift.

If launch topology materially changed after the reviewed baseline, stop the affected part as `UX0B_R1_SOURCE_DRIFT` rather than improvising around it.

## 2. Confirmed forcing mechanism

At the reviewed snapshot:

- initial learner state is loaded in one `Promise.all` containing uploaded records, question progress, flags, language misses, answer events, case-part events, translation events, and flashcard progress;
- `uploadedLoaded` becomes true only when that initial `Promise.all` resolves;
- active-session hydration begins only after `uploadedLoaded` becomes true;
- `requestSessionStart(records, mode, title, options)` copies the caller's current `records` and stores a callback in the stable `createSessionStartGuard` instance;
- that callback references the `performSessionStart` function from the render in which the request occurred;
- `performSessionStart` reads that render's `progress` for both NCLEX-weighted sampling and the ordinary unseen-first/seen-second ordering;
- Home quick practice passes `allRecords` plus `weighting: "nclex"`;
- Home Study all passes `allRecords` through the ordinary unseen/seen path.

Therefore a cold-start click before learner-data hydration can later execute after active-session hydration while still using the earlier render's progress and bundled-only record population.

The parent 0B browser race delayed only the `activeSession` read after learner data had already loaded. That proof remains valid for active-session protection, but it does not cover this earlier startup-data boundary.

## 3. Product ruling — add an explicit learner-data readiness boundary

### 3.1 Required rule

**No learner session-construction request may be accepted before the initial learner-data hydration represented by `uploadedLoaded` is complete.**

This successor explicitly narrows/supersedes parent UX-0B §6 only for the phase **before learner-data hydration**. During that phase, session-creating controls may be unavailable because the record/progress populations are not yet trustworthy.

This must not be silent:

- expose a short accessible startup status such as `Loading study data / 正在加载学习数据…`;
- session-creating buttons/rows must communicate their unavailable state through ordinary control semantics;
- ordinary non-session navigation and settings do not need to be globally disabled merely because study data is loading.

Once `uploadedLoaded` is true but active-session hydration is still unresolved, the parent 0B deferred-intent behavior remains authoritative: one request may be accepted, must consume zero draw state while waiting, and must evaluate the hydrated saved session before construction.

### 3.2 Defensive gate

Do not rely solely on disabled button props. `requestSessionStart` itself must refuse a session-start request while learner data is not ready.

This is a correctness boundary, not merely presentation.

### 3.3 Controls to cover

Audit every direct learner session constructor caller from the live preflight. At minimum, the readiness state must reach the currently visible session-creating surfaces:

- Home quick practice;
- Home Study all;
- Home Review mistakes / Review answered / Spaced review (even though their current pre-hydration populations usually make them disabled already);
- Builder Study/Test/Adaptive Start;
- Library filtered Study/Test;
- Library one-question practice rows;
- any other direct caller found by the required search.

The current tenth direct caller, Summary `Practice related`, is explicitly **outside** the learner-data readiness gate. Summary requires an already-existing completed session and is not reachable before initial learner-data/session hydration. Preserve its existing launch semantics and do not add a meaningless startup-disabled state there unless live topology has materially changed.

Controls that merely navigate (for example opening Builder, Dashboard, Settings, Library, or Vocab) are not session constructors and need not be disabled under this rule.

### 3.4 Do not over-engineer a second fix unless mechanically necessary

If the readiness boundary is implemented correctly, requests cannot be created from the pre-hydration render, so both the stale `progress` closure and bundled-only `requestedRecords` defects are removed at their common cause.

This conclusion depends on one explicit ordering invariant in the current initial-load completion callback: **`setUploadedLoaded(true)` must remain the final state update in that hydration batch.** Every learner-data state used by session population/sampling (`uploadedRecords`, `progress`, flags and the other initial stores) must be scheduled before the readiness flag is opened. Therefore the earliest render in which `uploadedLoaded === true` must already carry the hydrated sampling/catalog inputs.

Preserve that ordering deliberately. Add a short source comment at the readiness-opening call site stating that it must remain last because session construction is gated on it. Do not move the readiness update earlier or split the initial loaders into independently opening effects without replacing this invariant with an equally strong explicit barrier. The completion receipt must confirm that the ordering invariant remains true in the final implementation.

Do **not** automatically add both a mutable `performSessionStartRef` and a declarative intent architecture merely because they were suggested during review. A late-bound executor or descriptor remains authorized only if Codex demonstrates a surviving stale-input path after the readiness boundary or it materially simplifies deterministic proof without broadening architecture.

Prefer the smallest mechanism that proves the invariant.

## 4. Preserve parent UX-0B behavior exactly after readiness

Do not regress any of the following:

- protected-state predicate;
- one pending request at a time;
- zero draw/session construction before active-session authorization;
- safe initial focus in the replacement dialog;
- Escape = Keep current set;
- focus restoration to the initiating control when it remains mounted;
- cancel side-effect freedom;
- exact confirmed launch semantics;
- immediate-reload durability proof when IndexedDB is available;
- one ordered active-session save/clear lane;
- suppression of ordinary session autosaves while guard status is `"starting"`, so a replaced/old session cannot enqueue a duplicate save during the replacement-owned persistence interval;
- new-session persistence completion before the new session becomes visible;
- file-protocol memory fallback behavior and absence of false durability claims.

Do not change Home quick practice from Study mode merely because its current prop is named `onTest`.

## 5. Record-population semantics

The repair must not turn "freshness" into an excuse to change which set the learner asked for.

After readiness:

- Home All/weighted paths see the hydrated combined bundled + uploaded catalog;
- weighted practice uses current hydrated `progress` under the existing sampler rules;
- ordinary Study all retains the existing unseen-first/seen-second behavior;
- Library uses the learner's current filter state;
- Builder uses the learner's current Builder filter state;
- a one-question Library request remains that exact selected question;
- Summary related practice remains its current derived pool;
- requested count/order/weighting/mode/title/return destination are unchanged.

Do not merge current-mistakes and historical-incorrect semantics. Home `missed` and Builder `incorrect > 0` remain distinct populations.

## 6. RNG/test seam ruling

The production implementation does **not** require a new RNG abstraction merely to satisfy this correction.

For deterministic browser proof it is acceptable to stub/intercept global `Math.random()` and `Date.now()` in the isolated test context, as the existing 0B browser harness already instruments global randomness. The weighted seed is derived inline from both globals, so any controlled-global proof must install both stubs **before the learner activation that requests the launch**, not only immediately before eventual construction.

Do not make exact weighted question-ID/order equality across separate browser contexts the primary acceptance oracle. That is brittle to unrelated RNG consumption. Prefer to capture/prove the hydrated `progress` input at the weighted-sampler boundary (through bounded test instrumentation or a tiny extracted pure seam) and pair it with a behavioral property check showing that a seeded seen/due item receives its hydrated treatment. Exact deterministic output comparison may be supplementary if the harness can guarantee identical RNG call sequences.

If Codex extracts a tiny pure ordering/sampling-input helper with injected RNG/time because that makes a durable regression cleaner, that is authorized. Do not change `buildWeightedSession` output rules or introduce a new sampler policy.

## 7. IndexedDB blocked-upgrade observation — explicitly separate

The live storage layer's `openDB(DB_NAME, 5, { upgrade })` currently has no `blocked` / `blocking` handling. A future version upgrade can therefore wait on another tab that still owns an older connection.

**Do not fold a timeout-to-memory fallback into this R1 correction.** That changes persistence semantics and can create divergent in-memory versus IndexedDB state, which is a larger durability decision than the startup draw defect being repaired here.

No `src/storage.ts` edit is authorized by this successor. Record the blocked-upgrade observation as a separate follow-up. If Codex believes R1 cannot be made correct without editing storage behavior, stop with `UX0B_R1_STORAGE_ESCALATION` and explain why.

This ruling does not deny the liveness issue; it keeps the correction from silently trading a rare wait for possible learner-state divergence.

The readiness boundary makes that rare blocked/open-hang failure more visible: session launch controls can remain unavailable indefinitely while learner data never resolves. R1 may therefore add a **presentation-only delayed liveness message** in `App.tsx`/CSS, with no storage fallback or forced readiness. After a bounded delay (5 seconds is the default), the startup status may change to factual actionable copy such as: `Study data is taking longer to load. If this continues, close other open copies of the app and refresh. / 学习数据加载时间较长。如果一直没有完成，请关闭其他已打开的本应用页面并刷新。` The timer must not set `uploadedLoaded`, cancel IndexedDB work, switch to memory persistence, or otherwise change storage semantics. If this small message is not implemented, record the liveness UX as explicitly deferred rather than silently ignoring it.

## 8. Focus-return preservation for the forthcoming shell work

The existing parent 0B contract stores the focused initiating element and restores focus on Keep/Escape when it is still mounted. This correction must retain that proof.

Add evidence sufficient for the later shell commission to treat the following as a binding integration constraint:

- relocating/remounting a launch control while a replacement request is pending must not be assumed harmless;
- the final shell must either keep the initiating element mounted through cancellation or deliberately provide an equivalent focus-restoration target.

Do not redesign the shell in this task.

## 9. Required deterministic acceptance scenarios

### Learner-data readiness

1. Cold start with initial learner-data read deliberately held: Home quick-practice and Study-all controls cannot issue a request; no dialog, draw, session construction, view change, or active-session overwrite occurs.
2. The learner sees an accessible loading/status explanation rather than an unexplained inert launcher.
3. Navigate to Builder before learner-data hydration completes: Builder Start cannot issue a session request.
4. Navigate to Library before learner-data hydration completes: filtered Study/Test and one-question practice cannot issue a session request.
5. Release learner-data hydration: launch controls become available without reload.

### Fresh progress and record population

6. Seed at least one previously seen bundled question and at least one unseen bundled question. Under controlled randomness, Home Study all launched after the held hydration resolves must match the equivalent post-hydration launch's unseen/seen treatment.
7. Home NCLEX-weighted quick practice after delayed learner-data hydration must prove that the weighted sampler receives the hydrated `progress` map, not the startup-empty object, using bounded test instrumentation or a pure seam. Pair that input assertion with at least one behavioral property check for a seeded seen/due item under controlled randomness/time. If global stubs are used, install both `Math.random` and `Date.now` before activation. Exact cross-context question-ID/order equality is optional supplementary evidence, not the required oracle.
8. Seed at least one valid uploaded question before reload. After hydration, Home Study all must include it in the resulting session population; no pre-hydration bundled-only snapshot may survive into the launch.
9. Any status-filtered/filtered launch used for proof must derive from hydrated progress/flags and the current filters, not startup-empty state.

### Parent 0B preservation

10. After learner data is ready, deliberately hold active-session hydration. One launch request is accepted; no draw occurs before release.
11. Release to a protected session: one confirmation appears. Keep/Escape preserves the old session and restores focus to the initiator when mounted.
12. Release to no/untouched session: the held request executes exactly once.
13. Rapid duplicate activation still produces one pending request and one eventual launch.
14. Confirmed replacement still survives immediate reload when durable IndexedDB is available.
15. Delayed earlier active-session save still cannot overtake replacement; final persisted identity is the new session.
16. Production `file://` behavior remains nonfatal through the existing fallback path.

### Owner target-device timing check — informative, not a Codex blocker

Because this correction intentionally refuses session-start activation until learner data is trustworthy, the product cost depends on the real cold-start hydration window. Before shell integration is accepted, Luke should measure at least one ordinary cold start on the learner's target phone with her current uploaded-bank/progress volume and note the approximate time from app visibility to launch readiness. This is not an implementation acceptance gate Codex can satisfy without the target device. Treat a consistently sub-second interval as ordinary startup behavior; if the unavailable window is routinely noticeable (roughly 1–1.5 seconds or longer), revisit whether dropping the first tap remains the desired product behavior in a separate owner decision rather than silently changing R1's correctness boundary.

## 10. Verification floor

Run against the final candidate:

- `npm run test:session-start-guard`
- `npm run test:session-navigation`
- `npx tsx scripts/tests/session-sampler.ts`
- `npm run test:storage-category-migration`
- `npm run test:flashcard-pass`
- `npx tsc -b --pretty false`
- `npm run census:check`
- `npm run build`
- `git diff --check`

Extend the focused/browser proof so the new learner-data hydration scenarios above are durable evidence. Re-run the existing parent 0B browser scenarios whose behavior is touched by the final implementation, especially Home weighted practice, Study all, delayed active-session hydration, cancel/focus, duplicate activation, immediate reload, delayed save ordering, and file fallback.

Use production HTTP and the ordinary production `file://` path. Include 390 × 844 CSS px for the startup/loading and replacement-dialog learner surfaces if their presentation changes.

Do not regenerate census artifacts unless `census:check` unexpectedly proves drift; this correction is not expected to move census inputs.

## 11. Expected files and exclusions

Expected implementation files:

- `src/App.tsx`;
- possibly `src/styles.css` for a small visible loading treatment;
- existing focused test/evidence files as needed.

A tiny helper/test extraction is permitted if it materially improves proof.

Do not change:

- `src/storage.ts` under this work order;
- IndexedDB version or object-store shapes;
- `StoredSessionSnapshot`;
- bank content, schema, census population, grading, clinical content, renderers;
- sampler rules;
- Vocab pass/SRS behavior;
- 0A learner-surface decisions;
- shell/IA hierarchy;
- update-check behavior;
- file-protocol architecture.

## 12. Completion receipt

Return:

- branch/HEAD and clean-worktree preflight;
- all direct session-start callers found;
- exact readiness mechanism and every control it covers, including confirmation that Summary `Practice related` remains intentionally outside the startup gate unless topology changed;
- proof that `requestSessionStart` itself rejects pre-hydration requests;
- confirmation that `setUploadedLoaded(true)` remains the final state update in the initial learner-data hydration batch, with the requested source comment preserving that invariant;
- delayed learner-data proof method;
- controlled weighted and Study-all comparison results;
- uploaded-question population proof;
- parent 0B preservation results including focus restoration and ordered persistence;
- all verification command results;
- HTTP/mobile/file browser scenarios actually performed;
- confirmation that storage, banks, schema, grading, sampler rules, renderers, census, and unrelated worktree state were untouched;
- any source drift/escalation;
- the separate blocked-IndexedDB follow-up observation.

Do not publish `PROJECT-HISTORY.md` from an unaccepted correction branch.

**Terminal:** `UX0B_R1_STARTUP_DATA_FRESHNESS_READY_FOR_REVIEW`
