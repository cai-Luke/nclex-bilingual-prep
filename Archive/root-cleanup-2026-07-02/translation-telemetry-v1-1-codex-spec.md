# Translation Telemetry V1.1 — hidden diagnostic + export

Status: spec-ready for Codex, implementation-ready. Litigated by Claude 2026-06-30 against live `storage.ts`/`App.tsx`/`types.ts`; hardened 2026-06-30 after GPT review; hardened again after a Codex pre-implementation review caught a real doc-drift bug in `DECISIONS.md` and a CSS selector-scope risk; closed out 2026-06-30 after a final GPT pass found no remaining concerns beyond a slightly-awkward test-case description, fixed below. Chain: Claude v1 → GPT reviewed (export envelope, null-safe/deterministic aggregation, verify-before-build caveat, smoke-test hygiene, docs) → Claude adjudicated and independently verified the reveal-path question rather than deferring it, correcting one of GPT's own suggestions in the process → Codex pre-implementation review (`DECISIONS.md` had been written as if this spec were already implemented — fixed on the file directly, see below; `.category-breakdown div` is a descendant selector, not scoped to direct children — addressed in §3) → Claude adjudicated, all accepted → GPT closing pass (test-case framing fix, adopted below) → Claude is the version below. No IndexedDB schema change — reuses the existing `translationRevealEvents` store shipped in the Jun 30 "Translation Reveal Default and Telemetry Foundation" pass verbatim.

## Goal

The app has recorded real `TranslationRevealEvent` rows (topic/category/block, elapsed time on question, before/after submit, reveal count) since the telemetry foundation landed, but the data is loaded and then discarded — `const [, setTranslationRevealEvents] = useState<TranslationRevealEvent[]>([])` never reads its own state. This spec makes that data visible (aggregate panel) and exportable (raw JSON), gated behind the existing hidden dev-tools flag, so real usage can inform — later — whether language friction should influence targeted review.

## Non-goals (explicit)

- **Does not touch `src/sessionSampler.ts`.** Whether to fold a language-friction term into `scoreTargetedReviewCandidate` / `buildTargetedReviewPool` is a *future* decision gated on real dogfooding data existing — see the `DECISIONS.md` open-thread entry accompanying this spec. This spec builds the instrument only, per the standing "instrument before building" principle (features without proven demand ship the observation tool first, not the full feature).
- No data-clearing/retention UI.
- No per-session filter in v1 — the panel aggregates across all locally stored events. Add filtering later only if raw volume makes the aggregate unreadable.
- No new IndexedDB store or `TranslationRevealEvent` field.

## Pre-implementation verification (done — do not re-derive)

GPT flagged, correctly, that the spec's premise (real events are actually being recorded across the paths that matter) should be checked against live source rather than assumed from the Jun 30 milestone prose, per the repo's own "read live files before acting" rule. Verified directly against the current `App.tsx` rather than left as a to-do for Codex:

- Every `<BilingualText>` call site (22 total) passes an explicit `block` prop — `stem` (question stem, both top-level and embedded case parts), `choices` (options, dropdown-cloze prompt, matrix rows/columns, bowtie tokens), `exhibit` (case exhibit title/content), `case_stage` (case title/summary/stage trigger/narrative), `rationale` (rationale.correct, per-choice, testTakingStrategy), and `glossary` (glossary strip). `"other"` is `BilingualText`'s default and is currently unreachable dead weight — fine, it's the correct catch-all for a future block type, not a bug.
- `HighlightControl` and `DropdownClozeControl` each keep their own local `revealed` state and call `recordRevealFromContext(revealTracking, "choices")` directly (not through `BilingualText`) — both wired correctly.
- Case-study embedded parts get their own nested `RevealTrackingContext.Provider` that overrides `partId` (to the embedded part's id), `itemType`/`category`/`topic` (to the part's own values, not the parent case's), and `answeredBeforeReveal`/`submitted`, while `questionId` and `sessionId` fall through unchanged from the parent — so a reveal on an embedded part is correctly attributed to `{ questionId: <top-level case id>, partId: <part id> }`, matching the `TranslationRevealEvent` type exactly.

All seven code paths write real events today. Nothing here blocks or changes scope — it just means Codex can build the panel against the confirmed contract instead of re-verifying it.

**One data-quality note surfaced by this check, relevant to interpreting the raw export, not just the in-app aggregate:** `answeredBeforeReveal` (`getAnswerCompleteness` at reveal time) is a weaker signal than it looks for `ordered_response` — `getInitialAnswer` for that type already returns every option id in default order, which `getAnswerCompleteness` treats as "complete" before the learner has touched anything. So `answeredBeforeReveal` reads `true` from the very first render on ordered-response items, not just once genuinely answered. `submittedBeforeReveal` (`ctx.submitted`, true only after the question has actually been graded) doesn't have this quirk — it's `false` uniformly across every item type until real submission. This is why the aggregate panel's before-submit metric uses `submittedBeforeReveal`, not `answeredBeforeReveal` (see §3 below) — a correction to GPT's literal suggestion, which proposed `answeredBeforeReveal === false`.

## Design

### 1. Unlock the already-loaded state

In `App()`:
```ts
// before
const [, setTranslationRevealEvents] = useState<TranslationRevealEvent[]>([]);
// after
const [translationRevealEvents, setTranslationRevealEvents] = useState<TranslationRevealEvent[]>([]);
```
Everything else in the load effect (`loadTranslationRevealEvents()` on mount, `recordTranslationRevealEvent` refreshing it after each write) is already correct and unchanged. The net-new surface area here is genuinely small — the data pipeline already exists end-to-end.

### 2. New dev-only view

Mirror the existing `devStartup.enabled` / `"review"` pattern exactly (same file, same gate):

- Extend the `View` union with `"telemetry"`.
- Nav button, dev-gated like the existing "Review" button:
  ```tsx
  {devStartup.enabled && (
    <button className={view === "telemetry" ? "active" : ""} type="button" onClick={() => setView("telemetry")}>
      <Activity aria-hidden="true" />
      <span>Telemetry</span>
    </button>
  )}
  ```
  (new `Activity` icon import from `lucide-react`)
- Render block, same double-guard as the existing Review console (`devStartup.enabled` checked again at render, not just at nav-button visibility — defense in depth so the panel can never render for a learner who never opened `?dev=1`):
  ```tsx
  {view === "telemetry" && devStartup.enabled && (
    <TranslationTelemetryPanel events={translationRevealEvents} />
  )}
  ```

### 3. `TranslationTelemetryPanel` component

Placement: alongside `DeveloperReviewConsole` in `App.tsx` is fine; extracting to its own file is also fine. Low stakes, Codex's call.

- Header: `"Developer only"` eyebrow + `"Translation telemetry"` heading + one line: "Local reveal-tap history. Not visible to learners; nothing here is sent anywhere automatically."
- Empty state when `events.length === 0`: `"No reveal events recorded yet."`
- Summary line: total event count, earliest/latest `revealedAt` (formatted as a local date range), distinct session count (`new Set(events.map(e => e.sessionId)).size`).
- Three aggregate tables, matching `.category-breakdown`'s visual language (border, padding, flex-row) but rendered under a **new dedicated class**, not literal `.category-breakdown` reuse — a Codex pre-implementation review correctly flagged that `.category-breakdown div { display:flex; justify-content:space-between; padding:0.85rem; border:1px solid var(--border); ... }` in `styles.css` is a *descendant* selector (no `>`), so it styles every nested `<div>` at any depth, not just direct row children. `.category-breakdown`'s existing shape is also only a 2-column `<span>label</span><strong>value</strong>` row; these tables carry 3–4 data points per row (count, avg time, before-submit share), which doesn't fit that shape anyway. Use a small new class (e.g. `.telemetry-row`) with the same visual language and `<span>` for any nested sub-values — avoids the selector-bleed risk entirely rather than instructing "don't nest a `<div>`" as a fragile rule to remember on every future edit.
  1. **By block** — group by `event.block`; count + share of total.
  2. **By category** — group by `event.category`; count, average `elapsedMsOnQuestion` in seconds (render `—` when unavailable, never `0s`), and before-submit share: fraction where `submittedBeforeReveal === false`, i.e. revealed before the question was graded — the sharper, uniform-across-item-types cut for "friction while answering" vs. ordinary post-submit rationale/glossary browsing (see the verification note above on why this is `submittedBeforeReveal` and not `answeredBeforeReveal`).
  3. **By topic** — same shape as (2), sorted by count descending then topic label ascending (deterministic tie-break, not insertion order), capped to the top 15 rows (topic is free text with a long tail; an unbounded table isn't useful here).
- Export button, reusing the existing `exportNotes`/`exportAll` Blob+anchor pattern verbatim:
  ```ts
  const exportTelemetry = () => {
    const blob = new Blob(
      [JSON.stringify({ exportFormatVersion: 1, exportedAt: new Date().toISOString(), eventCount: events.length, events }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `shrimp-translation-telemetry-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  ```
  Full raw fidelity, not a re-export of the in-app aggregate — the point of the export is offline analysis (spreadsheet, notebook, or handing the file to a model for a deeper pass), where the in-app tables are just for a quick glance. Adopting GPT's suggestion to version and count-stamp the envelope, with one change: `schemaVersion` is renamed to `exportFormatVersion`. This repo's `schemaVersion` already means something specific and load-bearing (the bank-content `SchemaVersion` union in `NCLEX-Question-Schema.md`/`types.ts`, a string like `"1.6"`) — reusing the exact same key name on an unrelated numeric export-format counter risks someone reading a future telemetry file and mis-parsing it as bank schema metadata. Same substance GPT asked for, collision-free name.

### 4. Pure aggregation helpers

New `src/translationTelemetry.ts`, not inlined JSX reducers — same extraction discipline as `sessionSampler.ts`/`examLayout.ts`, and it means a later scoring spec (the deferred half of this task) can import the same aggregation instead of recomputing it inside the sampler:

```ts
export const summarizeTranslationRevealEvents = (events: TranslationRevealEvent[]): {
  totalCount: number;
  sessionCount: number;
  earliest?: string;
  latest?: string;
  byBlock: Array<{ block: RevealBlock; count: number }>;
  byCategory: Array<{ category: Category; count: number; avgElapsedMs?: number; beforeSubmitShare: number }>;
  byTopic: Array<{ topic: string; count: number; avgElapsedMs?: number; beforeSubmitShare: number }>; // top 15
}
```

Hardening requirements (adopted from GPT's review, all cheap and consistent with this repo's existing defensive-coding posture in `storage.ts`):

- **Deterministic ordering.** Every group array sorts by `count` descending, then by its label (`block`/`category`/`topic` string) ascending as the tie-break — never insertion order, so the panel renders identically across refreshes and any future fixture/test snapshot stays stable.
- **No `NaN`/`0`-as-real-data.** `avgElapsedMs` is `number | undefined`: average only over finite `elapsedMsOnQuestion` values in the group, and return `undefined` (not `0` or `NaN`) when the group has zero finite values to average. The panel renders `—` for `undefined`, never a fake `0s`. `beforeSubmitShare` is `0` (not `NaN`) when a group's `count` is `0`.
- **`topic` fallback.** Use the literal `event.topic` string; fall back to `"Unknown topic"` only if it's empty after `.trim()` — defensive against forgiving uploaded-bank data (uploads validate more loosely than bundled banks per `AGENTS.md`), not expected for bundled canonical content where `topic` is a required non-empty field.

## Files touched

- `src/App.tsx` (unlock state, `View` union, nav button, render block, new `TranslationTelemetryPanel` component, `Activity` icon import)
- `src/translationTelemetry.ts` (new, pure)
- `scripts/tests/translation-telemetry.ts` (new — covers the properties `summarizeTranslationRevealEvents` explicitly promises: deterministic count-desc/label-asc ordering on a multi-event input; the `"Unknown topic"` blank-string fallback; the top-15 topic cap; and, per a GPT closing-review fix, `summarizeTranslationRevealEvents([])` — fully empty input — producing `{ totalCount: 0, sessionCount: 0, byBlock: [], byCategory: [], byTopic: [] }` with no `NaN` anywhere. **Note:** the earlier framing of this test as "`avgElapsedMs`/`beforeSubmitShare` undefined/zero on an empty group" doesn't correspond to a real reachable state — the helper only ever emits group entries for categories/topics/blocks that actually appear in `events`, so there's no way to produce a `count: 0` group in the output to inspect. The empty-*input* case (`events = []`, yielding zero groups total) is the correct, reachable test for the same underlying null-safety guarantee.) + `package.json` script `test:translation-telemetry`
- `src/styles.css` (a small new class for the telemetry rows — see §3; not a `.category-breakdown` reuse)

## Verification

- `npx tsc -b --pretty false`
- `npm run test:translation-telemetry`
- `npm run build`
- Browser smoke with `?dev=1`: **clear the browser's `translationRevealEvents` IndexedDB store first (Application tab → IndexedDB → `nclex-bilingual-prep` → delete the store, or use a fresh profile)** so accumulated dev-session reveal taps from earlier manual testing don't make the aggregate counts look wrong — then confirm the Telemetry nav button and panel appear only with the dev flag set; run a live Study session with a handful of on-tap reveals across at least two categories; confirm the aggregate counts match what was actually tapped; confirm export downloads valid JSON matching the envelope shape above; confirm nothing telemetry-related surfaces anywhere in the non-dev learner UI (Settings, Summary, Preview Lab) with `?dev=1` absent and `shrimpDevTools` unset.
- No bank/schema/sampler files touched, so `npm run validate-bank` / `npm run audit` aren't required by this change.
- `DECISIONS.md`'s translation-telemetry open thread has already been corrected (2026-06-30, in response to the Codex pre-implementation review) to say "specified, not yet implemented" rather than "shipped" — update it again once this actually lands, this time to record real completion per the normal convention, and add the `PROJECT-HISTORY.md` milestone entry alongside it (matching the existing per-pass convention, e.g. the Jun 30 "Translation Reveal Default and Telemetry Foundation" entry).

## What this does not decide

Whether reveal-before-submit concentration in specific topics/categories is real signal (vs. flat noise) and whether it should feed `scoreTargetedReviewCandidate` is explicitly deferred — see the accompanying `DECISIONS.md` open-thread entry. This spec's only job is making the existing recorded data visible and exportable.
