# NCLEX App Pre-Publish UI Cleanup — Task Spec (for Codex)

**Status:** Draft v1 — ready to implement
**Scope:** UI/UX only. Three areas: **Library**, **Session Builder**, **Vocab flashcards**. No changes to the question schema, bank content, grading, storage shape, or adaptive engine.
**Companion docs:** `NCLEX-Prep-SPEC.md` (app), `NCLEX-Question-Schema.md` (data contract).
**Primary file:** `src/App.tsx` (single-file React app, ~2.4k lines). Supporting types in `src/types.ts`, enums in `src/schema.ts`, persistence in `src/storage.ts`.

---

## 0. Why

We're cleaning the app up before publishing. Three usability defects, each with a product decision already made by the owner (don't re-litigate these — implement them):

1. **Library** is read-only and awkward — you can't get into a question from it.
2. **Vocab flashcards** always start at "A" and walk alphabetically across all 44 topics at once.
3. **Session Builder** exposes too many knobs the learner doesn't care about, and only lets you pick **one** topic when there are 44.

Decisions already locked (see each section for detail):
- Library: **clicking a question practices that one question** (interactive, scored).
- Session Builder: strip down to **multi-select topics + status pool** (+ mode). Remove difficulty, question type, source, category, and the count/order controls.
- Flashcards: **shuffle the deck each session** and make the **topic picker primary** ("topic-first").

---

## 1. Library — make questions directly practiceable

**Current state:** `LibraryView` (`src/App.tsx` ~L788–892) renders a filtered list of `question-row` articles. Each row shows the stem, category/topic/difficulty/source, a flag toggle, and status pills (Due / Missed / correct-seen). Rows are **inert** — the only way to actually do a question is the whole-set **Study** / **Test** buttons in the header. There is no way to open a single item.

**Goal:** Clicking/tapping a question row opens that **one** question in the real interactive question UI — the learner can answer it, submit, see correct/incorrect + the bilingual rationale, flag it, and have the attempt recorded to progress exactly like an in-session answer. When they're done, they return to the Library (with their filters intact), not to Home.

### Recommended implementation
Reuse the existing session machinery rather than building a parallel one-off answer flow — `QuestionCard` already encapsulates answering, submitting, grading display, rationale, flagging, and voice, and `submitCurrent` already records progress + answer events. Spinning up a **single-question study session** is the lowest-risk path and keeps behavior identical to normal practice.

Concretely:
1. Add a helper on `App`, e.g. `practiceOne(record: QuestionRecord)`, that calls the existing `startSession([record], "study", record.question.stem.en, { order: "sequential" })`.
2. Make each Library `question-row` activate `practiceOne(record)` on click (and keyboard Enter/Space for a11y — the row should be a real `<button>`/have `role="button"` + `tabIndex={0}`). **Keep the flag toggle working without triggering practice** — stop propagation on the flag button's `onClick` (it currently lives inside the row at ~L872–880).
3. **Return-to-origin:** today `SessionView` exit goes to `"home"` (`onExit={() => setView("home")}`, ~L524) and `finishSession`/summary flow to `"summary"` → Home. Add a small piece of state, e.g. `const [sessionReturnView, setSessionReturnView] = useState<View>("home")`. `practiceOne` (and only it) sets it to `"library"`. Wire `SessionView`'s `onExit` and `SummaryView`'s `onHome` to use `sessionReturnView` instead of the hardcoded `"home"`. Normal sessions started elsewhere keep `"home"` (reset `sessionReturnView` to `"home"` in `startSession` / the home-screen entry points so it doesn't leak).
4. The 1-question session still flows through Summary on finish — that's acceptable and consistent. The Summary "Home" button returns to Library via the mechanism above.

### Acceptance
- From Library, clicking any row opens that exact question, fully interactive, scored, with rationale on submit.
- Flagging from a Library row still works and does **not** open the question.
- Exiting or finishing the single-question session lands back on **Library** with the same filters still applied.
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
  - Study / Test: serve **25 questions, shuffled** (capped to pool size — if fewer than 25 match, serve them all). No count input. Define this as a single named constant, e.g. `const DEFAULT_SESSION_COUNT = 25;`, and pass it as `count` to `startSession`. `startSession` already shuffles when `order !== "sequential"` and already clamps `count` to the pool length (~L229), so a small pool just yields its full size. Users can "End set" early at any point.
  - Adaptive: keep the existing internal default target of **75** (capped to pool size) — `startAdaptiveSession` already defaults to 75 when `count` is undefined (~L225). Don't pass `DEFAULT_SESSION_COUNT` in adaptive mode; let it fall through to 75.
  - > 25-for-study/test and 75-for-adaptive are the product calls behind removing the count control. Both are single constants, trivial to change later — call them out in the PR description.
- **Builder summary line** (~L763–768): drop the "{count} will be served" / "pool smaller than count" copy. Replace with pool size, e.g. "{records.length} questions in pool" (the header already shows this — keep the summary minimal or remove redundant lines).
- **Call-site fixups (important — these pass the old single `topic`):**
  - `onStart` (~L453–459): drop `count`/`order` from the `startSession` options.
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

**Current state:** `buildFlashcardDeck` (`src/App.tsx` ~L2267–2311) returns terms **sorted alphabetically by `termEn`**. `FlashcardsView` (~L1016–1108) walks `filteredDeck` by incrementing `index`, so every session starts at "A" and marches A→Z across **all** topics at once. Filters (Category, Topic) and a "Due only" toggle exist but are secondary, and order is always alphabetical.

**Goal:**
1. **Shuffle each session** — when the view mounts and whenever the filter selection changes, present the filtered deck in **random** order, not alphabetical. (Leave `buildFlashcardDeck`'s alphabetical sort as the stable source order; do the randomization at the view layer.)
2. **Topic-first** — make the **Topic** picker the primary, most prominent control so a learner naturally studies one topic at a time instead of the whole glossary. Category becomes secondary; Topic sits first/top and visually emphasized.

### Implementation notes
- Add a shuffled view of the filtered deck held in state, regenerated in the **existing** `useEffect` that already fires on `[category, topic, dueOnly, deck.length]` (~L1042–1045) — it currently resets `index`/`revealed`; also recompute a shuffled order there. Don't reshuffle on every render (that would reorder cards mid-review) — only on mount + filter change. A `useState<FlashcardTerm[]>` set inside that effect, or a `useMemo` keyed by the filter tuple, both work; pick whichever reads cleanly. Apply `shuffle(...)` (the helper already exists at ~L123).
- The due-only / category / topic **filtering** stays exactly as is (still applied before shuffle). Only the **order** changes.
- **Topic-first layout:** in the `flashcard-filters` row (~L1067–1070), put **Topic** first and give it visual primacy (e.g. full-width / larger, or a labeled "Studying: <topic>" emphasis), with Category secondary. Keep both functional. Light CSS in `src/styles.css` is fine; keep it consistent with the existing filter styling.

### Acceptance
- Entering Vocab does **not** reliably start at the same alphabetical card; order is randomized per entry.
- Changing Topic/Category/Due-only reshuffles and resets to the first card of the new selection.
- Cards do **not** reorder while you flip/grade within a selection.
- Topic is the visually dominant control; selecting a topic scopes the deck to it.
- "Due only", flip/reveal, and the Again/Got-it grading (`recordFlashcardReview` via `onReview`) all still work.

---

## 4. Completion screen — "Practice related" replaces exact replay

**Current state:** `SummaryView` (`src/App.tsx` ~L2095–2199) shows results, a **Home** button, and a **"Review missed"** button wired (in `App`, ~L532) to `onReviewMisses={() => startSession(missedRecords, "study", "Review mistakes")}` — which **replays the exact questions** the learner just missed. For a 25-question session that just ended, replay is low-value: the learner remembers the specific answer from a minute ago. We want to reinforce the *concept*, not the item.

**Goal:** Replace Summary's "Review missed" action with **"Practice related"** — a fresh study session drawn from the **same topic(s)** the learner missed *this session*, **prioritizing unseen questions**, and **excluding every item just served**. This tests whether the concept stuck rather than short-term recall.

### Pool construction
Compute in `App` (it has `allRecords` + `progress`); pass the resulting pool + handler to `SummaryView`. For the just-completed `session`:
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

## 5. Out of scope / do not touch
- Question schema, bank JSON, validator, grading logic, adaptive difficulty engine, storage record shapes.
- Library's category/topic/difficulty/source **single-select** filters (`Filters` type) — unchanged.
- Settings, Import, Dashboard internals (other than the `onPracticeTopic` shape fix in §2).
- Home's "Review mistakes" button and the global `missedRecords` replay flow (§4 only changes the Summary action).
- No new dependencies.

## 6. Definition of done
- `npm run build` (`tsc -b && vite build && ...`) passes with no type errors and no unused-symbol warnings from removed fields.
- Manual smoke per the acceptance lists in §1–§4.
- PR description calls out the two intentional default decisions: (a) single-question Library practice routes through the Summary screen, (b) builder serves **25** shuffled questions for study/test (`DEFAULT_SESSION_COUNT`) and 75 for adaptive now that the count control is gone — both single constants, easy to revisit.
- PR description also notes §4: the Summary "Review missed" exact-replay is replaced by "Practice related" (same missed topic(s), unseen-first, excludes items just served); Home's cross-session replay is untouched.
- Diff stays UI-layer; no churn in schema/storage/grading files.
