# Project Shrimp UX-0C — Finite Vocab Review Pass

**Date:** 2026-09-11  
**Status:** QUEUED — SPEC FROZEN; DO NOT IMPLEMENT UNTIL THE CURRENT CAMPAIGN-16 WORKTREE IS CLOSED OR A CLEAN POST-CAMPAIGN WORKTREE IS CUT  
**Implementation order:** logically independent from UX-0A/0B, but default to serial execution after the campaign to minimize `src/App.tsx` merge noise  
**Implementation seat:** Codex / coding agent  
**Change class:** learner UI / view-state only; no storage-contract or scheduler change authorized

## 0. Purpose

Make one Vocab / flashcard review run behave as a finite, understandable pass through a frozen set of cards.

The current view presents a selected deck as `N cards ready`, but its index wraps with modulo arithmetic and therefore returns to the first card after the final card is graded. This commission removes that endless-loop behavior while preserving the existing flashcard SRS calculations exactly.

This is not a redesign of Vocab, not a new scheduler, and not a new learning algorithm.

## 1. Source freeze and authority

This work order was prepared against local `main` at:

- HEAD: `a639b5f` (`docs(campaign16): archive Phase E census and residual evidence`)
- `src/App.tsx`, `src/styles.css`, `src/storage.ts`, `src/reviewSchedule.ts`, and `src/types.ts`: no local diff at spec-preparation time
- the worktree otherwise contains active Campaign 16 bank/census/audit state that is explicitly outside this commission

Before implementation:

1. Read `AGENTS.md` first.
2. Read this work order in full.
3. Re-open current `PROJECT-HISTORY.md`, relevant `DECISIONS.md`, `src/App.tsx`, `src/storage.ts`, and the current review-schedule helpers.
4. Inspect repository/worktree state and preserve unrelated changes.

The repository remains authoritative for **current mechanical state**. This work order is authoritative for **authorized scope and product decisions**.

If the Vocab deck-construction or flashcard-review path named below has materially drifted by implementation time, report the exact drift as `UX0C_SOURCE_DRIFT`, stop the affected slice, and continue only separable work whose premises still hold.

## 2. Verified forcing behavior

At spec freeze, `FlashcardsView` in `src/App.tsx`:

- owns local `category`, `topic`, `readyNow`, `scope`, `sessionDeck`, `index`, and `revealed` state;
- derives the active card with:

  `sessionDeck[index % Math.max(1, sessionDeck.length)]`

- increments `index` after either `Again` or `Got it`;
- rebuilds and reshuffles the deck when its current deck-defining controls change;
- labels the frozen-looking population as `N cards ready`.

Therefore, once `index === sessionDeck.length`, the modulo expression returns card 1 and the pass never terminates.

The underlying flashcard scheduling path is separate. `recordFlashcardReview` in `src/storage.ts` uses the shared scheduling calculation. At spec freeze, a failed review (`Again`) schedules the card **20 minutes** in the future; a remembered review follows the existing increasing interval/ease behavior.

Do not alter those calculations.

## 3. Product ruling for this commission — `Again` does not re-enter the same pass

This commission deliberately does **not** append an `Again` card to the end of the current pass.

Reason:

- the existing scheduler already gives a failed card a 20-minute due time;
- immediately re-inserting it into the current pass would create a new short-term relearning policy that does not currently exist in the scheduler;
- this commission is intended to correct the view lifecycle, not silently override scheduling semantics.

Therefore:

- `Again` records the existing lapse/schedule update and advances to the next card in the frozen pass;
- `Got it` records the existing successful review/schedule update and advances to the next card;
- neither action re-adds the card to the current pass;
- a failed card becomes eligible again according to the existing due-time rules, or sooner only if the learner explicitly chooses a scope that ignores due status (for example the existing non-`Ready now` path).

Do not reinterpret `Again` as an immediate retry in this commission.

A future deliberate relearning-step feature would require its own product decision and scheduler design.

## 4. Required pass model — freeze membership and order by card ID

Do not rely on a dependency array accidentally keeping the current array stable.

Materialize the active review pass explicitly as a frozen ordered array of **card IDs** held in view state.

The implementation may use different local names, but the architecture must be equivalent to:

- current live card catalog / `deck` — source of card content;
- `passCardIds: string[]` — frozen membership and order for the active pass;
- `passIndex: number` — current position;
- current card resolved by `passCardIds[passIndex]` against a live `deckById` map.

Do not store duplicate flashcard content as the pass identity when IDs suffice.

### 4.1 Why IDs

Membership/order and live card content are separate concerns.

- The pass decides **which cards and in what order**.
- The current card catalog provides **what those cards currently display**.

A progress write must not redefine pass membership merely because review state changed.

### 4.2 No modulo

Remove modulo-based card lookup from the pass.

Completion must be detected before dereferencing an out-of-range index.

`passIndex >= passCardIds.length` with a nonempty started pass is a normal completed state, not an empty-deck error and not permission to wrap.

## 5. Exact deck key and rebuild policy

The pass may be rebuilt only when the learner deliberately changes a deck-defining input or explicitly starts another pass.

The named deck-defining inputs are:

1. `scope` (`rescue` / `all`);
2. `category`;
3. `topic`;
4. `readyNow`;
5. the effective Rescue focus/membership identity **when `scope === "rescue"`**.

The implementation should derive an explicit deck/pass key from those values.

For `scope === "all"`, Rescue-focus/membership churn must not rebuild an otherwise unchanged All pass.

The source card catalog may be included as an availability input for beginning a new pass, but a progress write to a reviewed card must not reorder, shrink, expand, or restart the active pass.

### 5.1 Starting a pass

When the pass key changes:

1. apply the current filters to the live card catalog and current review progress;
2. materialize the eligible card IDs;
3. shuffle exactly once using the existing local shuffle behavior;
4. store the resulting ID array as the new frozen pass;
5. reset `passIndex` to 0;
6. reset card-reveal state.

### 5.2 During a pass

After the pass has started:

- review progress updates may change whether a card would be due **for a future pass**;
- those updates must not change the current `passCardIds` array;
- the current pass total must not drift;
- grading card N must move to N+1 or completion, never to a reshuffled card chosen from a recomputed population.

## 6. Pass progress and header truthfulness

Replace the current `N cards ready` header with pass-oriented progress.

While reviewing a nonempty active pass, show a clear position such as:

`Card 3 of 12 / 第 3 张，共 12 张`

or an equivalent existing-style bilingual presentation.

The total is the frozen pass length, not a live recomputation of how many cards are currently due after each grading action.

Do not add scores, percentages, streaks, XP, daily targets, or mastery claims.

The position counter is navigation/status information, not gamification.

## 7. Completion state

After the final card is graded:

- do not resolve another card;
- do not wrap to card 1;
- render an explicit completion state.

Use:

`Review complete / 本轮复习完成`

and a short factual count, for example:

`12 cards reviewed / 已复习 12 张卡片`

Do not describe the pass as mastered, passed, or completed successfully in a performance sense.

### 7.1 Definite next action

The completion state must include one explicit action:

`Start another pass / 再来一轮`

Activating it:

1. re-evaluates the current named filters against **current** review progress;
2. creates a new frozen pass from the currently eligible cards;
3. shuffles that new pass once;
4. starts at card 1 if any cards are eligible;
5. otherwise enters the normal zero-card state.

This action does not bypass `Ready now` and does not force not-yet-due failed cards back into the deck.

If `Ready now` is off, the existing all-matching-card behavior remains applicable.

## 8. Empty state versus completed state

Keep these states distinct.

### Empty before a pass

If the selected filters produce zero eligible cards before a pass begins, show the existing appropriate empty-state meaning:

- no Rescue terms yet; or
- no cards match the current filters / no cards are ready under the selected filters.

Do not call that state `Review complete` unless the learner actually completed a nonempty pass.

### Completed pass

Completion means the learner graded every card in the frozen nonempty pass.

The completion panel remains visible until:

- a deck-defining control changes;
- `Start another pass` is activated; or
- the learner navigates away.

## 9. Navigation-away / re-entry ruling

The active Vocab pass is **ephemeral view state**, not resumable application state.

If the learner navigates away from Vocab mid-pass, that pass ends.

Returning to Vocab creates a **fresh pass** from the then-current review progress and the existing ordinary Vocab entry defaults / Rescue-focus rules.

Do not persist:

- pass IDs;
- pass index;
- card reveal state;
- Vocab filters solely for the purpose of resuming a pass.

This commission intentionally does not add flashcard-session persistence.

The implementation receipt must demonstrate this behavior rather than allowing it to be an accidental consequence of component mount/unmount structure.

## 10. Preserve existing Rescue behavior

Preserve the current distinction between:

- durable Rescue terms derived from current mistakes/language misses; and
- the temporary session-focused Rescue subset handed off from Summary.

Preserve the existing behavior whereby ordinary Vocab navigation clears the one-shot `rescueFocusIds` focus, while Summary can open Vocab focused on a supplied term subset.

Changing scope to `All` must continue to clear the focused Rescue subset through the existing callback.

Do not change how Rescue term membership is derived.

## 11. Preserve existing SRS semantics exactly

Do not change `recordFlashcardReview` or the shared scheduling math.

Preserve exactly:

- seen counts;
- correct/incorrect counts;
- correct streak;
- ease changes;
- interval-day calculation;
- lapse counting;
- due-time calculation;
- current memory fallback behavior;
- IndexedDB shape/version.

No `src/storage.ts` edit should be necessary.

If implementation concludes otherwise, stop and report `UX0C_STORAGE_ESCALATION` before broadening scope.

## 12. Explicit exclusions

Do not add or change:

- a new SRS algorithm;
- immediate `Again` relearning steps;
- leech handling;
- bury/suspend controls;
- card editing;
- mastery labels;
- daily goals;
- streaks/gamification;
- flashcard-session persistence;
- Home or primary navigation;
- learner-state export/import;
- question SRS;
- language-miss semantics;
- glossary derivation;
- question banks;
- schema;
- grading;
- clinical content;
- `src/visuals/**`.

Do not redesign the overall Vocab surface beyond what is necessary to make pass state and completion honest.

## 13. Required acceptance scenarios

Demonstrate all of the following against the final candidate.

### Finite-pass basics

1. Eligible snapshot contains exactly 1 card → show `Card 1 of 1` → grade once → completion state.
2. Eligible snapshot contains N cards → exactly N grading actions → completion state.
3. Final grading action never returns to card 1.
4. `passIndex === passCardIds.length` renders completion without an undefined-card crash.

### Review actions

5. `Again` writes the existing failed-review schedule and advances; it does not reinsert the card into the same pass.
6. `Got it` writes the existing successful-review schedule and advances; it does not alter membership/order of remaining cards.
7. A failed card's due time continues to follow the existing scheduler; this commission introduces no new interval.

### Frozen identity

8. Grade a card and allow `flashcardProgress` to update → remaining `passCardIds` and their order remain unchanged.
9. A live due-count change caused by grading does not change the frozen pass total shown in the progress header.
10. No card appears twice in one pass unless duplicate IDs already existed upstream; duplicate upstream IDs are not created by this view.

### Deck-key changes

11. Change category → new pass built from the new category and index resets.
12. Change topic → new pass built from the new topic and index resets.
13. Toggle `Ready now` → new pass built under the new due filter and index resets.
14. Change Rescue / All scope → new pass built under the requested scope and index resets.
15. Session-focused Rescue opens only its supplied focus set, subject to the existing filters/due behavior.
16. Rescue membership change does not restart an active `All` pass merely because the Rescue set changed.

### Completion and restart

17. Complete a pass → `Review complete / 本轮复习完成` is shown with the frozen reviewed count.
18. Activate `Start another pass` immediately with identical filters and `Ready now` on → current progress is re-evaluated; if no cards are now due, the normal zero-card state is shown rather than recycling the completed snapshot.
19. With `Ready now` off, `Start another pass` uses the existing all-matching-card semantics and may legitimately produce another pass containing recently reviewed cards.

### Navigation lifecycle

20. Navigate away at card 7 of 12 → return to Vocab → a fresh pass begins; the prior position is not resumed.
21. Navigate away after completion → return to Vocab → a fresh pass is derived from current state, not the stale completed snapshot.
22. Ordinary Vocab re-entry does not preserve a stale one-shot Summary Rescue focus beyond the app's existing focus-clearing behavior.

### Empty states

23. Rescue scope with no Rescue terms → retain a Rescue-specific empty explanation.
24. Nonempty Rescue universe but current filters produce zero cards → show ordinary no-matching/no-ready state, not `Review complete`.
25. All scope with zero eligible cards → no crash and no phantom card.

## 14. Preferred implementation structure

Keep the change structural and small.

Expected primary implementation:

- `src/App.tsx` — `FlashcardsView` pass state and completion rendering;
- `src/styles.css` — only minimal completion/progress presentation if existing classes are insufficient.

Authorized if it materially improves deterministic proof:

- one small pure helper such as `src/flashcardPass.ts` owning pass construction/state transitions;
- one focused regression under `scripts/tests/`;
- `package.json` only to wire that focused test.

Do not extract a general state-management architecture.

## 15. Focused regression

Add a deterministic focused regression if the implementation extracts pass logic. Preferred name:

- `scripts/tests/flashcard-pass.ts`
- package script `test:flashcard-pass`

The test should prove at minimum:

- no modulo/wrap behavior;
- 1-card and N-card completion;
- final index is a completed state rather than another card;
- `Again` advances without reinsertion;
- `Got it` advances without reinsertion;
- pass membership/order does not change when a progress object changes after pass creation;
- named deck-key changes create a new pass;
- `All` pass identity does not include Rescue membership unnecessarily;
- explicit restart re-evaluates current eligibility rather than replaying the stale completed ID array.

If no helper is extracted, provide an equally deterministic focused proof rather than relying solely on manual clicking.

## 16. Verification

Per `AGENTS.md`, the UI/CSS minimum floor applies so long as storage/data contracts remain untouched:

- `npx tsc -b --pretty false`
- `npm run build`
- visual smoke of the affected Vocab surface

Also run:

- `npm run census:check`
- `git diff --check`
- any new focused `test:flashcard-pass` regression added by this commission

Because the existing SRS owner is intentionally unchanged, do not edit/rebaseline storage merely to satisfy this work order.

### Browser smoke

Cover at minimum:

- ordinary All scope;
- Rescue scope;
- session-focused Rescue handoff from Summary;
- `Ready now` on and off;
- category filter;
- topic filter;
- one-card pass;
- multi-card pass;
- `Again` on a card;
- `Got it` on a card;
- completion state;
- immediate `Start another pass` under identical filters;
- zero-card restart result;
- navigate-away mid-pass and return;
- mobile Vocab presentation at 390 × 844 CSS px.

After the normal production build, perform the project's ordinary `file://` smoke sufficient to establish that Vocab still loads and grades cards without runtime/storage errors.

## 17. Sequencing with UX-0A / UX-0B

UX-0C is semantically independent from active-session replacement and most 0A truthfulness changes.

However, all three commissions touch the large `src/App.tsx` file. Default project sequencing is therefore:

1. finish / close Campaign 16;
2. UX-0A;
3. UX-0B;
4. UX-0C;
5. larger learner-shell / IA redesign.

Luke may explicitly authorize isolated parallel worktrees later, but this spec does not require or recommend parallel implementation merely to consume agent capacity.

## 18. Escalation rules

Stop the affected work and report before proceeding if implementation appears to require:

- edit to `src/storage.ts`;
- IndexedDB version change;
- persisted flashcard-pass state;
- changed SRS timing/math;
- changed Rescue derivation;
- grading or question-progress changes;
- bank/schema mutation;
- renderer changes under `src/visuals/**`;
- runtime network/model dependency.

Do not broaden scope because an adjacent Vocab feature is convenient to add.

## 19. Completion receipt

Return a concise receipt containing:

- files changed;
- pass-ID representation used;
- exact deck/pass key implemented;
- confirmation that progress writes cannot rebuild the current pass;
- exact `Again` behavior;
- exact completion behavior;
- exact `Start another pass` behavior;
- exact navigation-away/re-entry behavior;
- verification commands/results;
- browser-smoke scenarios actually performed;
- confirmation that `src/storage.ts`, SRS math, banks, schema, and unrelated Campaign 16 state were untouched;
- any source drift or escalation encountered.

Do not publish a `PROJECT-HISTORY.md` completion entry from an unaccepted implementation branch. Follow current repository governance after review/acceptance.

**Implementation-ready terminal after all required checks:** `UX0C_READY_FOR_REVIEW`
