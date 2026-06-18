# Summary Review Screen — Codex Implementation Spec

**Status:** ready for implementation (incorporates GPT pre-implementation review)
**Scope:** `src/App.tsx` only (plus minor `src/styles.css`). No schema change, no storage change, no new view/route.
**Author intent:** turn the end-of-session `SummaryView` from a scoreboard into a review surface. All data needed is already in the in-memory `session` object at summary time (`questions`, `answers`, `results`, `scores`) — no refetch, no storage round-trip.

Anchor all edits to the live on-disk text (files are co-edited between sessions; in-context snapshots go stale). Dry-run before applying.

---

## Background (current behavior)

`SummaryView` (in `src/App.tsx`) currently renders: a score hero, a counts line, correct/total by category, correct/total by difficulty, the adaptive difficulty-trajectory dots, and a **missed list** of plain `<article className="question-row">` rows showing only `question.stem.en` + `question.topic`. The missed rows are static — there is no way to see the rationale, the learner's own answer, or the correct answer without leaving for the Library. That dead end is the problem this spec fixes.

`SummaryView` is currently rendered from the `view === "summary"` block and receives only `session`, `onHome`, `homeLabel`, `relatedCount`, `onPracticeRelated`.

`QuestionCard` already supports read-only rendering. Rendered with `submitted={true}` and **`reviewMode` left false**, while being passed the learner's actual answer, it shows: the answer banner (Correct / Review this one), the learner's selection vs. the correct answer (the per-control `statusClass` logic handles this for every item type), the partial-credit line for SATA, and the full `RationalePanel` (correct rationale + per-choice + strategy + glossary + any `rationale.visuals`). All answer controls are disabled when `submitted` is true. This is exactly the review we want — **do not set `reviewMode`** (that path hides the learner's pick and forces the "Correct answer shown" banner).

The existing answered/missed derivations in `SummaryView` are correct and must be reused as-is:

```ts
const answeredQuestions = session.questions.filter((q) =>
  Object.prototype.hasOwnProperty.call(session.results, q.id),
);
const missed = session.questions.filter((q) => session.results[q.id] === false);
```

Do **not** rewrite `answeredQuestions` as `session.questions.filter((q) => session.results[q.id])` — `results[id]` is `false` for missed items, so that form silently drops every wrong answer. Skipped/unanswered items are absent from `session.results` and are therefore excluded from all three scope lists for free.

---

## Changes

### 1. Thread new props into `SummaryView`

In the `view === "summary"` render block, also pass:

- `flags={flags}`
- `onToggleFlag={toggleFlag}`
- `voiceEnabled={settings.voiceEnabled}`
- `defaultLanguageMode={session.languageMode}` (test sessions force `"off"`; that's fine as a seed — the screen gets its own toggle, see #4)

Extend the `SummaryView` prop type accordingly: `flags: Record<string, QuestionFlag>`, `onToggleFlag: (questionId: string) => void`, `voiceEnabled: boolean`, `defaultLanguageMode: LanguageMode`.

### 2. Per-topic breakdown (in addition to category/difficulty)

Alongside the existing `byCategory` / `byDifficulty` reducers, add a `byTopic` reducer over `answeredQuestions` keyed on `question.topic` (same `{ total, correct }` shape). Render it as a third `category-breakdown` block.

- **Heading:** "Topics from this set" — **not** "Weak topics." This is a single-session recap, not a mastery label; one miss does not prove a weakness.
- **Sort:** worst accuracy first, secondary sort `total desc`, so a real run of misses outranks a noisy 0/1.
- No minimum-attempts gate.

### 3. Replace the static missed list with expandable review cards

Replace the current `missed.map(... <article className="question-row">)` block with a list of expandable rows.

**Row container — use the existing `interactive-row` pattern from `LibraryView`, not a `<button>` wrapper.** The header will contain `BilingualText` (which can itself emit an inline `需要中文` reveal `<button>` in on-tap mode); nesting a button inside a button is invalid and the clicks would conflict. So:

- Container is a `div` with `role="button"`, `tabIndex={0}`, `onClick` toggling expansion, and an `onKeyDown` handling Enter/Space (mirror the existing `LibraryView` row exactly).
- Any inner interactive element (the `BilingualText` reveal, a flag button if added to the header) calls `event.stopPropagation()` so it does not also toggle expansion — again as `LibraryView` already does for its flag button.

**Collapsed header** shows the existing pill(s) + the stem rendered via `BilingualText` with the local `languageMode` (so it follows the ZH toggle — not hardcoded `question.stem.en`) + `question.topic`, a result indicator (Missed / Correct), and an expand affordance (chevron).

**Expanded body** renders:

```tsx
<QuestionCard
  question={question}
  answer={session.answers[question.id] ?? getInitialAnswer(question)}
  submitted
  result={session.results[question.id]}
  languageMode={languageMode}            // local state, see #4
  flagged={flags[question.id]?.flagged ?? false}
  voiceEnabled={voiceEnabled}
  onAnswer={() => undefined}
  onSubmit={() => undefined}
  onToggleFlag={() => onToggleFlag(question.id)}
/>
```

`getInitialAnswer`, `QuestionCard`, `LanguageTabs` are all already imported/defined in `App.tsx`. Case-study items work unchanged through this path (the answer object carries `caseStudy`; per-part rationales render).

**Expansion state — immutable `Set` update, no in-place mutation:**

```ts
setExpandedIds((prev) => {
  const next = new Set(prev);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
});
```

This single mechanism delivers items 1 (rationale), 2 (picked vs. correct), and the in-card flag affordance for item 5.

### 4. Scope toggle + language toggle on the review list

- **Scope toggle** (`segmented`, reuse existing class) with three options:

  ```
  Missed only | All answered | Flagged
  ```

  Drive a local `reviewScope` state. List source per scope: `"missed"` → `missed`; `"answered"` → `answeredQuestions`; `"flagged"` → `answeredQuestions.filter((q) => flags[q.id]?.flagged)`. Default `"missed"`. All three only contain items present in `session.results`.
- **Language toggle:** local `const [languageMode, setLanguageMode] = useState<LanguageMode>(defaultLanguageMode)` with a `LanguageTabs` control in the review-list header. Reviewing rationale bilingually is the core purpose of the app, so the summary must allow EN/ZH even when the session itself ran in `"off"`.

### 5. Flagged-this-set surfacing

If any item in `answeredQuestions` is currently flagged, show a small "Flagged this set (N)" affordance near the review-list header. Tapping it sets `reviewScope = "flagged"` (no auto-expand). In-card flag toggle is already wired via #3, so a learner can flag/unflag while reviewing; unflagging the last one simply empties the flagged scope.

---

## Out of scope (do not implement here)

- `rationale` / Saunders external **references** — requires a schema bump (1.6), generation-contract change, and bank backfill. Tracked separately; decision on whether it's worth doing is pending.
- Any change to SRS scheduling, `recordAnswer`, storage, or `reviewSchedule.ts`.
- A full re-entry "review session" with its own phase/navigation. The scope toggle in #4 is the intended substitute.
- Adaptive trajectory section — leave as is.

---

## Constraints / house rules

- **Bilingual invariant:** every new piece of learner-facing text ships EN + ZH. The collapsed header stem (#3) and the toggle (#4) must drive ZH through the existing `BilingualText` / `RationalePanel` paths. No new English-only strings in the rationale/answer/header surface. (UI chrome labels like "Missed only" follow existing app convention.)
- **No new aggregate rescoring.** The score hero / `pointTotals` already read from stored `session.scores` — keep that; do not re-derive session totals by calling `scoreQuestion` at the summary level (avoids drift). Note: the expanded `QuestionCard` calls `scoreQuestion` internally per card to render the partial-credit line — that is expected and must not be suppressed.
- **Finite-lifetime tool:** keep it lean. Reuse existing classes (`category-breakdown`, `question-list`, `segmented`, `interactive-row`, `question-row`, `type-pill`, `missed-pill`). Add only the minimal CSS for the expand/collapse affordance and expanded-card spacing.
- Read-only review: all handlers passed to `QuestionCard` in the list are no-ops except `onToggleFlag`. Do not write learner progress from the summary.

## Verification

- `npm run build` and lint clean (TypeScript: new props typed, no `any`).
- `npm run test-visuals` still green (no renderer touched; confirm nothing imported broke).
- Manual: finish a **test** session with at least one miss and one SATA partial → score hero unchanged; "Topics from this set" block present, worst-first with `total desc` tiebreak; expanding a missed item shows the learner's pick marked incorrect, the correct answer marked, and the rationale; language toggle flips the expanded card **and the collapsed header stem** to ZH; "All answered" reveals correct items too.
- Manual: under "All answered", expand a **correct** item → it shows the learner's selection marked correct with the "Correct" banner, **not** the generic "Correct answer shown" review banner (this catches an accidental `reviewMode`).
- Manual: flag from inside an expanded card → flag persists to the Library; "Flagged" scope and the "Flagged this set (N)" count reflect it; unflagging the last item empties the flagged scope without error.
- Manual: finish a **study** session with skips → summary unaffected by skip state; counts line unchanged; skipped-without-result items appear in none of the three scopes.
