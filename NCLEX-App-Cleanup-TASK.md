# NCLEX App Pre-Publish UI Cleanup — Task Spec (for Codex)

**Status:** Draft v2 — ready to implement
**Scope:** UI/UX only. Five areas: **Library**, **Session Builder**, **Vocab flashcards**, the post-session **Summary** action, and **Mobile session focus**. No changes to the question schema, bank content, grading, storage shape, or adaptive engine.
**Companion docs:** `NCLEX-Prep-SPEC.md` (app), `NCLEX-Question-Schema.md` (data contract).
**Primary file:** `src/App.tsx` (single-file React app, ~2.4k lines). Supporting types in `src/types.ts`, enums in `src/schema.ts`, persistence in `src/storage.ts`.

---

## 0. Why

We're cleaning the app up before publishing. Five usability defects, each with a product decision already made by the owner (don't re-litigate these — implement them):

1. **Library** is read-only and awkward — you can't get into a question from it.
2. **Vocab flashcards** always start at "A" and walk alphabetically across all 44 topics at once.
3. **Session Builder** exposes too many knobs the learner doesn't care about, and only lets you pick **one** topic when there are 44.
4. **Summary** currently encourages exact replay of just-missed questions; for a learner doing short sessions between patients, a fresh related set is more useful than immediate answer recall.
5. **Mobile sessions** waste too much vertical space on global navigation and chrome. The target learner is likely to do questions on a phone while commuting or between patients, where bilingual stems/answers need the screen more than app-wide menu access does.

Decisions already locked (see each section for detail):
- Library: **clicking a question practices that one question** (interactive, scored).
- Session Builder: strip down to **multi-select topics + status pool** (+ mode). Remove difficulty, question type, source, category, and the count/order controls.
- Flashcards: **shuffle the deck each session**, make the **topic picker primary** ("topic-first"), and replace machine-coded "Due only" phrasing with learner-facing "Ready now" language.
- Summary: replace exact replay with **Practice related** (fresh questions from missed topic(s), unseen-first, excluding items just served).
- Mobile session focus: on mobile-width screens, active sessions should feel like a compact question reader. Suppress app-wide navigation during sessions, minimize metadata/chrome, and keep progression controls thumb-friendly.

---

## 1. Library — make questions directly practiceable

**Current state:** `LibraryView` (`src/App.tsx` ~L788–892) renders a filtered list of `question-row` articles. Each row shows the stem, category/topic/difficulty/source, a flag toggle, and status pills (Due / Missed / correct-seen). Rows are **inert** — the only way to actually do a question is the whole-set **Study** / **Test** buttons in the header. There is no way to open a single item.

**Goal:** Clicking/tapping a question row opens that **one** question in the real interactive question UI — the learner can answer it, submit, see correct/incorrect + the bilingual rationale, flag it, and have the attempt recorded to progress exactly like an in-session answer. When they're done, they return to the Library (with their filters intact), not to Home.

### Recommended implementation
Reuse the existing session machinery rather than building a parallel one-off answer flow — `QuestionCard` already encapsulates answering, submitting, grading display, rationale, flagging, and voice, and `submitCurrent` already records progress + answer events. Spinning up a **single-question study session** is the lowest-risk path and keeps behavior identical to normal practice.

Concretely:
1. Extend `startSession` options with a transient return target, e.g. `{ count?: number; order?: SessionOrder; returnView?: View }`, defaulting to `"home"`. Store that target in local component state such as `sessionReturnView`. This is UI state only; do **not** persist it in the active-session storage snapshot.
2. Add a helper on `App`, e.g. `practiceOne(record: QuestionRecord)`, that calls the existing session machinery:
   ```ts
   startSession([record], "study", record.question.stem.en, {
     order: "sequential",
     returnView: "library",
   });
   ```
3. Make each Library `question-row` activate `practiceOne(record)` on click and keyboard Enter/Space. Avoid invalid nested buttons: either keep the row as `<article role="button" tabIndex={0}>` with keyboard handling, or split the row into a primary clickable area plus a separate flag button. **Keep the flag toggle working without triggering practice** — stop propagation from the flag control.
4. **Return-to-origin:** today `SessionView` exit goes to `"home"` (`onExit={() => setView("home")}`, ~L524) and `finishSession`/summary flow to `"summary"` → Home. Wire `SessionView`'s `onExit` and `SummaryView`'s return button to use `sessionReturnView`. Normal sessions started elsewhere keep `"home"`.
5. Use return-aware labels where practical. A Library-launched session should not show a button labeled "Home" if it returns to Library; use "Library" / "Back to Library" / "Done" as fits the existing UI.
6. The 1-question session still flows through Summary on finish — that's acceptable and consistent. The Summary return button returns to Library via the mechanism above.

### Acceptance
- From Library, clicking any row opens that exact question, fully interactive, scored, with rationale on submit.
- Flagging from a Library row still works and does **not** open the question.
- Exiting or finishing the single-question session lands back on **Library** with the same filters still applied.
- Return labels are not misleading; Library-origin practice should not display "Home" for a control that returns to Library.
- Whole-set Study / Test buttons are unchanged.

> If you judge a single-question session to be too heavy (e.g. the Summary screen feels wrong for one item), an acceptable alternative is rendering `QuestionCard` in an in-Library overlay wired to a local copy of the submit/record logic. Prefer the session-reuse approach unless it forces worse code.

---

## 2. Session Builder — strip to essentials, multi-topic

**Current state:** `SessionBuilderView` (`src/App.tsx` ~L658–786) with `BuilderFilters` (~L99–114) and `applyBuilderFilters` (~L2210–2225). It exposes: mode (study/test/adaptive), Category, **single** Topic, Difficulty, Item type, Status pool, Source, Count, Order. The single-topic limit is the flagged defect (44 topics exist; the learner often wants several).

**Goal — the builder shows exactly these controls:**
1. **Mode** — study / test / adaptive (keep as-is, the segmented `builder-mode` group).
2. **Topics — multi-select** across all 44 topics (replaces the single-topic dropdown). Empty selection = all topics.
3. **Status pool** — all / unseen / answered / incorrect / flagged / due (keep as-is).

**Remove from the UI:** Category, Difficulty, Item type, Source, Count, Order.

### Data / logic changes
- **`BuilderFilters` type** — redefine to only what's used. Suggested:
  ```ts
  type BuilderFilters = {
    topics: string[];           // empty = all topics
    status: SessionStatusFilter;
    mode: SessionMode;
  };
  const blankBuilderFilters: BuilderFilters = { topics: [], status: "all", mode: "study" };
  ```
  Drop the `extends Filters` inheritance for the builder so removed fields don't linger. (Leave the shared `Filters` type — Library still uses category/topic/difficulty/source single-select; don't touch that.)
- **`applyBuilderFilters`** — rewrite to filter on `topics` (membership: `topics.length === 0 || topics.includes(record.question.topic)`) + the existing `status` logic. Remove the `applyFilters(...)` call and the `itemType` branch.
- **Count / order removal — define the default session length explicitly:**
  - Study / Test: serve **25 questions, shuffled** (capped to pool size — if fewer than 25 match, serve them all). No count input. Define this as a single named constant, e.g. `const DEFAULT_SESSION_COUNT = 25;`, and pass it as `count` to `startSession`. Do not pass the removed `builderFilters.count` or `builderFilters.order`. `startSession` already shuffles when `order !== "sequential"` and already clamps `count` to the pool length (~L229), so a small pool just yields its full size. Users can "End set" early at any point.
  - Adaptive: keep the existing internal default target of **75** (capped to pool size) — `startAdaptiveSession` already defaults to 75 when `count` is undefined (~L225). Don't pass `DEFAULT_SESSION_COUNT` in adaptive mode; let it fall through to 75.
  - > 25-for-study/test and 75-for-adaptive are the product calls behind removing the count control. Both are single constants, trivial to change later — call them out in the PR description.
- **Builder summary line** (~L763–768): drop the "{count} will be served" / "pool smaller than count" copy. Replace with pool size, e.g. "{records.length} questions in pool" (the header already shows this — keep the summary minimal or remove redundant lines).
- **Call-site fixups (important — these pass the old single `topic`):**
  - `onStart` (~L453–459): drop `builderFilters.count` / `builderFilters.order`. For study/test, pass `{ count: DEFAULT_SESSION_COUNT }`. For adaptive, pass no count and let `startAdaptiveSession` keep its default target of 75.
  - `DashboardView` → `onPracticeTopic` (~L469) passes `{ topic, status, mode, count }`. Change to `{ topics: [topic], status, mode }`.
  - `onPracticeUnseen` / `onPracticeFlagged` (~L470–471): drop `count`, keep `status`/`mode`.
  - `openBuilder` (~L367–370) merges overrides into `blankBuilderFilters` — fine once the type/shape matches.

### Multi-select UI
Don't use a native multi-`<select>` (poor mobile UX). Use a **topic chip/checkbox grid**: render all 44 topics (`uniqueSorted(allRecords.map(r => r.question.topic))`, already computed at ~L671) as toggle chips; selected chips highlight; an "All topics" affordance clears the selection. Match existing styles (`type-pill` / `builder-*` classes in `src/styles.css`); add minimal CSS if needed. Keep it keyboard-accessible.

### Acceptance
- Builder shows only Mode, multi-select Topics, and Status pool. No category/difficulty/item-type/source/count/order controls remain.
- Selecting 3 topics yields a pool = union of those topics (intersected with status). Zero topics selected = all topics.
- Starting study/test serves 25 shuffled questions (or the full pool if fewer than 25 match); adaptive still targets 75 (capped).
- Dashboard "practice this topic / unseen / flagged" deep-links still land in the builder correctly with the new shape.
- No dead references to removed `BuilderFilters` fields anywhere; `tsc -b` is clean.

---

## 3. Vocab flashcards — shuffle + topic-first

**Current state:** `buildFlashcardDeck` (`src/App.tsx` ~L2267–2311) returns terms **sorted alphabetically by `termEn`**. `FlashcardsView` (~L1016–1108) walks `filteredDeck` by incrementing `index`, so every session starts at "A" and marches A→Z across **all** topics at once. Filters (Category, Topic) and a "Due only" toggle exist but are secondary, and order is always alphabetical. The phrase "Due only" is also too implementation-shaped for the target learner; it is not obvious that it means unseen cards plus cards ready for review.

**Goal:**
1. **Shuffle each session** — when the view mounts and whenever the filter selection changes, present the filtered deck in **random** order, not alphabetical. (Leave `buildFlashcardDeck`'s alphabetical sort as the stable source order; do the randomization at the view layer.)
2. **Topic-first** — make the **Topic** picker the primary, most prominent control so a learner naturally studies one topic at a time instead of the whole glossary. Category becomes secondary; Topic sits first/top and visually emphasized.
3. **Rename "Due only"** — replace the learner-facing label with **"Ready now"**. It still represents the same study queue behavior: unseen cards plus cards ready for spaced review.

### Implementation notes
- Add a shuffled session deck held in state, regenerated in the **existing** `useEffect` that already fires on filter changes (~L1042–1045). It currently resets `index`/`revealed`; also recompute a shuffled order there. Don't reshuffle on every render (that would reorder cards mid-review). A `useState<FlashcardTerm[]>` set inside that effect reads cleanly here.
- Snapshot the filtered/shuffled flashcard deck on entry and when Topic/Category/Ready-now changes. Grading a card should **not** remove/reorder cards mid-session even if its spaced-review status changes after review. Stability matters more than live filtering while the learner is in the deck.
- The Ready-now / category / topic **filtering** stays exactly as is before the snapshot/shuffle. Only the learner-facing label and the order change.
- **Topic-first layout:** in the `flashcard-filters` row (~L1067–1070), put **Topic** first and give it visual primacy (e.g. full-width / larger, or a labeled "Studying: <topic>" emphasis), with Category secondary. Keep both functional. Light CSS in `src/styles.css` is fine; keep it consistent with the existing filter styling.

### Acceptance
- Entering Vocab does **not** reliably start at the same alphabetical card; order is randomized per entry.
- Changing Topic/Category/Ready-now reshuffles and resets to the first card of the new selection.
- Cards do **not** reorder or disappear while you flip/grade within a selection.
- Topic is the visually dominant control; selecting a topic scopes the deck to it.
- "Ready now", flip/reveal, and the Again/Got-it grading (`recordFlashcardReview` via `onReview`) all still work.

---

## 4. Completion screen — "Practice related" replaces exact replay

**Current state:** `SummaryView` (`src/App.tsx` ~L2095–2199) shows results, a **Home** button, and a **"Review missed"** button wired (in `App`, ~L532) to `onReviewMisses={() => startSession(missedRecords, "study", "Review mistakes")}`. That pulls from global historical misses and can replay items the learner just missed. For a 25-question session that just ended, exact replay is low-value: the learner remembers the specific answer from a minute ago. We want to reinforce the *concept*, not the item.

**Goal:** Replace Summary's "Review missed" action with **"Practice related"** — a fresh study session drawn from the **same topic(s)** the learner missed *this session*, **prioritizing unseen questions**, and **excluding every item just served**. This tests whether the concept stuck rather than short-term recall.

### Pool construction
Compute in `App` (it has `allRecords` + `progress`); pass the resulting pool + handler to `SummaryView`. Do **not** use global `missedRecords` for this action; it includes historical missed questions and is intentionally reserved for Home's cross-session "Review mistakes" flow. For the just-completed `session`:
1. **Missed topics:** `missedTopics = unique(session.questions.filter(q => session.results[q.id] === false).map(q => q.topic))`. (Empty when the learner missed nothing → action disabled, same as today's `missed.length === 0`.)
2. **Exclude what was just served:** `servedIds = new Set(session.questions.map(q => q.id))` — exclude *all* served items this session, not only the missed ones.
3. **Candidates:** `allRecords` where `missedTopics.includes(record.question.topic)` and `!servedIds.has(record.question.id)`.
4. **Unseen-first ordering:** partition candidates into unseen (`(progress[id]?.seen ?? 0) === 0`) vs already-seen; the pool order is `shuffle(unseen)` followed by `shuffle(seen)`. Take up to `DEFAULT_SESSION_COUNT` (25).
5. **Start it:** `startSession(relatedPool, "study", "Practice related", { count: DEFAULT_SESSION_COUNT, order: "sequential" })`. Use `order: "sequential"` so `startSession` **preserves the unseen-first order** instead of re-shuffling it away (it reshuffles on the default `"random"` order). The pool is already randomized within each partition.

### UI / wiring
- Replace the `onReviewMisses` prop/handler with `onPracticeRelated`. Relabel the button **"Practice related"** (the `RotateCcw` icon is fine).
- **Disabled state:** disable when the related pool is empty — i.e. no missed topics, or every related question was already served this session. Pass the computed pool (or its length) into `SummaryView` so it can disable accurately; don't rely on the local `missed.length` alone (a topic with nothing left to serve must also disable).
- Leave the **missed-questions list** at the bottom of Summary as-is (read-only stem + topic). We deliberately are **not** making those tappable — replaying the exact item is the thing we're moving away from.
- **Do not touch** Home's existing "Review mistakes" button (~L620–623) — that's the cross-session, all-mistakes replay and stays as-is. This change is scoped to the post-session Summary only.

### Acceptance
- Finishing a session with misses shows **"Practice related"**; clicking it starts a study session of **different** questions from the missed topic(s), none of which were in the session just completed, unseen ones first.
- Got everything right (or no related questions remain) → the button is disabled.
- Small-bank safety: if a missed topic has only a few unserved questions, the session is just that many (capped naturally by pool size); no crash, no duplicates.

---

## 5. Mobile session focus — give questions the screen

**Current state:** On mobile (`src/styles.css` `@media (max-width: 780px)`), the global header stacks vertically: brand row, then a 4-column icon nav. Inside a session, `SessionView` then renders its own topbar, and that topbar also stacks vertically. This leaves too much of the first viewport consumed by app chrome before the learner reaches the bilingual stem and answer choices.

**Goal:** During active sessions on mobile, the question and answer area should dominate the screen. The app-wide menu is not important mid-question; progress, return, language, and submit/next are.

### Recommended implementation
- **Suppress global app header/nav during active sessions on mobile.** Keep the header/nav unchanged on Home, Builder, Dashboard, Vocab, Library, Import, Settings, and Summary. For `view === "session"`, add a class or data attribute to the app shell/header so CSS can hide the global header at mobile widths only. Desktop sessions can keep the current header.
- **Use a compact session topbar.** Keep a return-aware back control (Home vs Library depending on `sessionReturnView`), session title/progress, and language control, but make the mobile layout dense enough that it does not become a second full header. Avoid wrapping into several tall rows if possible.
- **Make progression thumb-friendly.** On mobile, keep the primary action area (`Submit answer`, `Next`, `Finish`) sticky near the bottom with safe-area padding. `End set` should remain available but visually secondary.
- **Reduce in-session chrome on mobile.** Tighten `question-card` padding/shadow/border cost at mobile widths. Preserve readability, but spend fewer pixels on framing.
- **Trim metadata in-session on mobile.** The bilingual stem, answers, rationale, and glossary matter more than item metadata. Show only the most useful compact signals (e.g. item type and flag/review/due as needed); hide or de-emphasize category/topic/difficulty metadata on small screens.
- **Do not add a bottom global nav inside sessions.** It still steals vertical space and increases accidental exits. Navigation can remain available outside sessions.

### Acceptance
- On a phone-width viewport, active sessions do not show the global app header/nav.
- The first viewport of a mobile session shows materially more question/answer content than before.
- Submit/Next/Finish are easy to reach on mobile and do not cover answer content in an unusable way.
- Return behavior remains correct for normal sessions and Library-launched single-question sessions.
- Desktop layout is not degraded.

---

## 6. Out of scope / do not touch
- Question schema, bank JSON, validator, grading logic, adaptive difficulty engine, storage record shapes.
- Library's category/topic/difficulty/source **single-select** filters (`Filters` type) — unchanged.
- Settings, Import, Dashboard internals (other than the `onPracticeTopic` shape fix in §2).
- Home's "Review mistakes" button and the global `missedRecords` replay flow (§4 only changes the Summary action).
- No new dependencies.

## 7. Definition of done
- `npm run build` (`tsc -b && vite build && ...`) passes with no type errors and no unused-symbol warnings from removed fields.
- Manual smoke per the acceptance lists in §1–§5, including at least one mobile-width session check.
- PR description calls out the two intentional default decisions: (a) single-question Library practice routes through the Summary screen, (b) builder serves **25** shuffled questions for study/test (`DEFAULT_SESSION_COUNT`) and 75 for adaptive now that the count control is gone — both single constants, easy to revisit.
- PR description also notes §4: the Summary "Review missed" exact-replay is replaced by "Practice related" (same missed topic(s), unseen-first, excludes items just served); Home's cross-session replay is untouched.
- Diff stays UI-layer; no churn in schema/storage/grading files.
