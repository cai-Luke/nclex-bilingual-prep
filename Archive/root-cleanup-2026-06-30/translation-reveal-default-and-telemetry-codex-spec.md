# Translation-Reveal Default Flip + Reveal Telemetry — Codex Spec

Status: ready for implementation
Author: Claude (adjudicated against live repo state, 2026-06-30)
Input: Luke's product-direction handoff, drafted via GPT, pasted in chat (no repo access — see Adjudication)
Chain: GPT product direction (no repo read) → Claude adjudication against live `src/` → Codex implementation

## Why this spec differs from the pasted handoff

The handoff was written without filesystem access to this repo. Its core premise — that English-first-with-Chinese-on-demand needs to be *built* — is wrong for about 70% of what it asks for: **it already exists.** What's actually broken is one default value and the complete absence of telemetry on the reveal action. This spec keeps the genuinely new work (telemetry) and cuts everything that's already shipped, so Codex doesn't re-implement live code.

Read `CLAUDE.md` → `AGENTS.md` → `PROJECT-HISTORY.md` → `DECISIONS.md` before touching anything below; this spec assumes that context and doesn't repeat it.

## Adjudication

| Handoff ask | Verdict | Why |
|---|---|---|
| Add `en_with_zh_reveal` as a new language mode | **REJECT — already exists** | `LanguageMode = "off" \| "on-tap" \| "always"` (`src/types.ts`). `"on-tap"` *is* English-first-with-reveal. |
| Make it the default | **ACCEPT** | `defaultSettings.languageMode` in `src/storage.ts` is `"always"`. This is the actual bug — new users/sessions start in always-bilingual, not on-tap. One-line fix, Phase 1 below. |
| Demote `en_only`/`en_zh_always` into "Advanced language settings" | **REJECT** | `SettingsView` already renders all three (`Off`/`On tap`/`Always`) as a single flat `<select>`, not a primary always-visible chooser. There's nothing to demote it from. Restructuring this into a nested "Advanced" section adds UI surface for no behavioral gain — the default-value fix is what was actually fighting Luke. |
| Per-block reveal control, "Show Chinese"/"Hide Chinese" | **REJECT — already shipped, and finer-grained than asked** | `BilingualText` (the component every stem/option/exhibit/case-stage/rationale/glossary pair renders through) already does instance-local `useState` reveal, gated on `mode === "on-tap"`. Independent per text block, not per question. Button text is `需要中文` (Chinese-only, not bilingual-labeled) — see minor fix below. No "Hide" — reveal is one-way per question (resets on next question via `key={question.id}`), which matches the handoff's own fallback ("Acceptable: one-way reveal for the current question"). Leave as-is. |
| Open Q1 (block vs. question granularity) | **Resolved** | Block-level, already shipped. |
| Open Q2 (reversible reveal) | **Resolved** | One-way, already shipped, matches the accepted fallback. No change. |
| Open Q3 (rationale ZH hidden by default too) | **Resolved** | Yes — `RationalePanel` only mounts after `submitted`, and its `BilingualText` instances follow the same on-tap gating. Reveals inside it are post-submit by construction. |
| Open Q4 (hide reveal button when ZH is missing) | **ACCEPT, small fix** | `BilingualText`/`HighlightControl` currently render the reveal button even when `pair.zh` is empty. Canonical banks won't hit this (DECISIONS.md principle 9 — CJK-presence is a fail-loud gate before promotion), but user-uploaded banks aren't gated the same way. One-line guard. |
| `recordStudyEvent({...})` generic polymorphic event helper | **REJECT** | No such abstraction exists. The established pattern is one dedicated IndexedDB store + one recorder function per event kind — `answerEvents`/`recordAnswer`, `languageMisses`/`recordLanguageMiss`. A third one-off case doesn't justify introducing a new generic shape; it'd be the only polymorphic store in the file. Use a dedicated `translationRevealEvents` store, mirrored exactly on `recordAnswer`'s shape. |
| `timestamp: number` (epoch ms) in the event schema | **REJECT, use ISO string** | Every other event/progress timestamp in this codebase (`AnswerEvent.answeredAt`, `QuestionProgress.lastSeenAt`, `LanguageMiss.markedAt`) is `new Date().toISOString()`. Match the convention. |
| Pre-submit vs. post-submit, immediate vs. late reveal interpretation rules | **ACCEPT** | Good distinction, cheap to capture given data already in scope (see Data contract). Dashboard interpretation prose itself is out of scope for this pass — store the data, don't build the read side yet (Phase 4 stays deferred, per the handoff's own escape hatch). |
| Local-only, no server, additive to existing storage | **ACCEPT** | Already how this app works; nothing to decide. |

## Corrected scope

### Phase 1 — Default flip (the actual fix)

In `src/storage.ts`:

```ts
export const defaultSettings: Settings = {
  languageMode: "on-tap",   // was "always"
  ...
};
```

That's it for the default. No new `LanguageMode` union member, no settings-page restructuring.

Confirm this doesn't fight existing forced overrides — it doesn't:
- Test mode: `languageMode: mode === "test" ? "off" : settings.languageMode` (App.tsx, session creation) — unaffected, still forces `"off"`. Matches the standing product decision in `PROJECT-HISTORY.md` ("Chinese is off by default in Test mode").
- Adaptive mode: hardcoded `languageMode: "off"` at session creation — unaffected.
- Existing users with a saved `languageMode` in `localStorage` under `nclex-settings` keep their saved value (`loadSettings` spreads `defaultSettings` first, then the stored JSON over it) — the default only affects first-run / never-configured state. No migration needed.

Minor fix, same phase: in `BilingualText` and `HighlightControl` (the two components with the inline-reveal button), only render the `需要中文` button when the pair actually has Chinese content:

```ts
const hasZh = (pair.zh ?? "").trim().length > 0;
// ...
{languageMode === "on-tap" && !revealed && hasZh && (
  <button className="inline-reveal" type="button" onClick={() => setRevealed(true)}>
    需要中文
  </button>
)}
```

Use `pair.zh ?? ""`, not bare `pair.zh.trim()` — `TextPair.zh` is typed as required `string`, so this is belt-and-suspenders, but uploaded-bank validation is intentionally forgiving (AGENTS.md) and shouldn't be allowed to crash a question render over a malformed field.

(Bilingual button label — `需要中文 / Show Chinese` — is a fine polish if Codex wants it, but it's cosmetic; don't block the patch on it.)

### Phase 2 — Per-block reveal state

**Nothing to build.** Already shipped in `BilingualText` (used for stem/options/exhibits/case-stage title+trigger+narrative/rationale/glossary) and duplicated locally in `HighlightControl`. Confirmed by direct read of `src/App.tsx` (current line numbers, will drift — search for `mode === "on-tap"` to relocate): the per-instance `revealed` state and `showZh` derivation appear at four sites, all structurally identical. Do not refactor these into a single shared hook as part of this patch — out of scope, and they're small enough that the duplication isn't costing anything.

### Phase 3 — Reveal telemetry (the real net-new work)

No reveal-event recording exists today. This is the only substantial implementation work in this spec. It is **distinct from and additive to** the existing `LanguageMiss` self-report (`src/storage.ts` `recordLanguageMiss`, the "Missed because of the English / 是英文卡住了" button from Vocab Rescue Phase 1) — that's a manual, post-hoc, one-per-question flag the learner sets themselves; this is a passive, automatic, per-reveal-action log. Don't merge the two stores or conflate the two signals in code or naming.

#### Data contract — `src/types.ts`

```ts
export type RevealBlock =
  | "stem"
  | "choices"
  | "exhibit"
  | "case_stage"
  | "rationale"
  | "glossary"
  | "other";

export type TranslationRevealEvent = {
  id: string;
  sessionId: string;
  questionId: string;        // top-level question.id — case_study uses the case's own id, never the embedded leaf id
  partId?: string;           // embedded case-study leaf id (caseQuestion.id), when the reveal happened inside a case part
  block: RevealBlock;
  itemType: ItemType;
  category: Category;
  topic: string;
  revealedAt: string;        // ISO, via new Date().toISOString() — matches AnswerEvent.answeredAt
  elapsedMsOnQuestion: number;
  answeredBeforeReveal: boolean;
  submittedBeforeReveal: boolean;
  revealCountForQuestion: number;
};
```

`itemType`/`category`/`topic` source rule: for a standalone question, the top-level `question`'s own fields. For a reveal inside a case-study embedded part, the **leaf's** (`caseQuestion.itemType`/`.category`/`.topic`) fields, not the parent case's — the leaf is itself a full `StandaloneQuestion` with independent metadata (`src/types.ts`, `CaseSubQuestion`). For a reveal in case-level chrome (the case's own `stem`/`title`/`summary`/top exhibits, before any part is in scope), use the parent case question's own fields and omit `partId`.

`submittedBeforeReveal` source rule: the `submitted` boolean already threaded to every block-rendering component. For case-study parts this is the **aggregate** case submit state (one `AnswerState.caseStudy`, one submit — DECISIONS.md principle 23), not a per-part value; there is no per-part submit state in this app and this spec does not add one.

`answeredBeforeReveal` source rule: `getAnswerCompleteness(question, answer)` — already computed once per `QuestionCard` render as `readyToSubmit`, and already computed per-part inside `CaseActivePart` as `complete`. Reuse these existing values; don't add new completeness logic. This is a render-time snapshot, not a live re-derivation — if a learner selects an answer and taps reveal in the same instant, before React commits the re-render, the event can log the prior value. Accepted: this is sub-render-cycle noise with no real analytics impact, and re-deriving completeness fresh inside the reveal handler (off a ref to the latest `answer` rather than the closed-over render value) would be exactly the kind of new completeness logic this rule says not to invent. Don't add it.

#### Storage — `src/storage.ts`

Mirror `answerEvents` exactly. Bump `DB_VERSION` 3 → 4 and add the store in `upgrade()`:

```ts
if (!db.objectStoreNames.contains("translationRevealEvents"))
  db.createObjectStore("translationRevealEvents", { keyPath: "id" });
```

Add `translationRevealEvents: { key: string; value: TranslationRevealEvent }` to the `PrepDb` interface, an in-memory `memoryTranslationRevealEvents: TranslationRevealEvent[] = []` fallback array, and two functions shaped exactly like `recordAnswer`/`loadAnswerEvents`:

```ts
export const recordTranslationReveal = async (
  event: Omit<TranslationRevealEvent, "id" | "revealedAt">,
): Promise<TranslationRevealEvent> => {
  const full: TranslationRevealEvent = {
    ...event,
    id: `${event.questionId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    revealedAt: new Date().toISOString(),
  };
  memoryTranslationRevealEvents.push(full);
  try {
    const db = await getDb();
    await db.put("translationRevealEvents", full);
  } catch {
    // In-memory fallback already captured the event.
  }
  return full;
};

export const loadTranslationRevealEvents = async (): Promise<TranslationRevealEvent[]> => {
  try {
    const db = await getDb();
    const records = await db.getAll("translationRevealEvents");
    return records.sort((left, right) => left.revealedAt.localeCompare(right.revealedAt));
  } catch {
    return memoryTranslationRevealEvents;
  }
};
```

This is purely additive — no existing store schema changes, no `StoredSessionSnapshot` changes, no export/import format changes. IndexedDB version bumps in this codebase have already happened once for an additive store (`languageMisses`, Vocab Rescue Phase 1) with no migration fallout; same shape here.

#### Wiring — `src/App.tsx`

Don't thread a new prop through every `BilingualText`/`HighlightControl` call site (there are ~40+, across stem/options/exhibits/case-stage/rationale/glossary/bowtie-token rendering) — that's exactly the "broad architecture rewrite" `AGENTS.md` says to avoid for a focused UX/storage patch.

Instead: a small React context, provided once per active question.

```ts
type RevealTrackingContextValue = {
  questionId: string;
  sessionId: string;
  partId?: string;
  itemType: ItemType;
  category: Category;
  topic: string;
  submitted: boolean;
  answeredBeforeReveal: boolean;
  questionLoadedAtRef: React.MutableRefObject<number>;
  revealCountRef: React.MutableRefObject<number>;
  onReveal?: (block: RevealBlock) => void;
};
const RevealTrackingContext = React.createContext<RevealTrackingContextValue | null>(null);
```

- `QuestionCard` wraps `answerBody` in a `RevealTrackingContext.Provider` for standalone-question and case-level (no active part) blocks, using its own `question.id`/`submitted`/`readyToSubmit`. A `useRef(Date.now())` reset via a `useEffect` keyed on `question.id` (or just allocate fresh inside the component body, since `key={question.id}` already remounts `QuestionCard` per question in the session view) supplies `questionLoadedAtRef`. A sibling `useRef(0)` supplies `revealCountRef`, incremented inside `onReveal` before recording.
- `CaseActivePart` nests its **own** `RevealTrackingContext.Provider`, overriding `partId = caseQuestion.id`, `itemType`/`category`/`topic` from `caseQuestion`, `answeredBeforeReveal` from its already-computed `complete`, while inheriting `questionId`/`sessionId`/`submitted`/`questionLoadedAtRef` from the outer case-level provider (or accept them as props — either is fine, just don't duplicate the elapsed-time clock per part; one clock per question view, not per part).
- `BilingualText` and `HighlightControl` each gain one new prop: `block: RevealBlock` (the only thing call sites need to supply explicitly — they already know their own role). Each currently has two independent inline `onClick={() => setRevealed(true)}` handlers — the `english-line` span's onClick and the `inline-reveal` button's onClick. They're siblings in the DOM (not nested), so there's no event-bubbling double-fire today; the actual risk is maintenance, not bubbling — two separately-written handlers doing the same thing means a side effect added to one and not the other silently drifts. Centralize into one `handleReveal()` defined once per component:

```ts
const handleReveal = () => {
  if (revealed) return;
  setRevealed(true);
  onRevealBlock?.(block); // from context, see below
};
```

and call `handleReveal` from both the span onClick and the button onClick, instead of duplicating `setRevealed(true)` plus the new telemetry call in two places. The `if (revealed) return` guard is what actually prevents a double-record, not DOM structure — keep it even though bubbling isn't the live risk here.
- `onReveal` itself lives at the session-view level (next to `onToggleLanguageMiss`), wired only when `!reviewMode`:

```ts
const recordReveal = (ctx: RevealTrackingContextValue, block: RevealBlock) => {
  ctx.revealCountRef.current += 1;
  void recordTranslationReveal({
    sessionId: ctx.sessionId,
    questionId: ctx.questionId,
    partId: ctx.partId,
    block,
    itemType: ctx.itemType,
    category: ctx.category,
    topic: ctx.topic,
    elapsedMsOnQuestion: Date.now() - ctx.questionLoadedAtRef.current,
    answeredBeforeReveal: ctx.answeredBeforeReveal,
    submittedBeforeReveal: ctx.submitted,
    revealCountForQuestion: ctx.revealCountRef.current,
  }).then(async () => setTranslationRevealEvents(await loadTranslationRevealEvents()));
};
```

`setTranslationRevealEvents`/`translationRevealEvents` at the `App` level, loaded in the same `Promise.all` startup block as `answerEvents`, following that exact precedent (state, load-on-mount, refresh-after-record).

#### Gating — do not record outside real study sessions

`QuestionCard` is reused in `reviewMode` (Summary, Developer Review) and the new Settings Preview Lab (full-width hidden preview view — no real `sessionId`, no progress writes by design). Recording reveal events from those surfaces pollutes the signal this feature exists to capture ("does live English block real-time comprehension"), not "did someone click around in a review screen."

Only provide a non-null `onReveal` (i.e., only construct the `RevealTrackingContext` with a working `onReveal`) when `!reviewMode` and a real session exists. Mirror the existing `allowLanguageMissToggle={session.mode === "study"}` gate placement — same call site, same pattern. Test/adaptive sessions self-exclude already since `languageMode` is forced `"off"` there and `on-tap`'s reveal affordance never renders.

### Phase 4 — Dashboard summary

**Deferred, per the handoff's own fallback** ("If this adds too much risk, just store the event data now and defer visualization"). Store the data (Phase 3 above is sufficient); do not build `DashboardView` aggregation in this patch. `loadTranslationRevealEvents()` is already a complete, ready-to-consume read path for whenever that's wanted.

## Verification

```sh
npx tsc -b --pretty false
npm run validate-bank -- banks/*.json
npm run build
```

No bank content changes in this patch, so `npm run validate-bank` is a no-op sanity check, not a real gate here — it's listed because it's part of the standing verification baseline, not because this patch touches bank JSON.

Manual smoke (no automated test framework covers IndexedDB/React reveal wiring here; follow the existing manual-smoke convention used for storage/UI passes):

1. Fresh `localStorage` (clear `nclex-settings`) → start a Study session → confirm English-only by default, `需要中文` button present on stem.
2. Tap reveal on the stem → confirm Chinese appears, button disappears, and (via dev console / DB inspection) a `translationRevealEvents` record was written with `block: "stem"`, `revealCountForQuestion: 1`, plausible `elapsedMsOnQuestion`.
3. Reveal a second block (an option) on the same question → confirm `revealCountForQuestion: 2` on that event, independent `block` value.
4. Submit the question, then reveal something inside the rationale → confirm `submittedBeforeReveal: true`, `block: "rationale"`.
5. Enter a case study, switch to part 2, reveal something inside it → confirm `partId` is the part's own id and `questionId` is the case's top-level id, `itemType`/`category`/`topic` match the part, not the case.
6. Open Settings → Preview Lab, reveal something there → confirm **no** event is written.
7. Switch Settings → Chinese display → Always; start a new session → confirm no reveal button (already-shown Chinese, nothing to reveal) and no events fire.
8. Resume an existing in-progress session created before this patch → confirm it still loads (no `StoredSessionSnapshot` shape change, so this should be a non-issue, but confirm).
9. Export/import a progress backup if that flow exists → confirm unaffected (new store isn't part of any export payload).

## Acceptance criteria (corrected)

- New/never-configured users default to on-tap (English-first, Chinese revealed per block on demand) in Study mode.
- Test and adaptive modes remain forced to English-only, unchanged.
- Existing users with a saved language preference are unaffected.
- Reveal button never renders for a block with empty/missing Chinese text.
- Every reveal action in a live (non-review) **Study** session writes one `TranslationRevealEvent` with correct `questionId`/`partId`/`block`/`itemType`/`category`/`topic`/timing/submit-state/count. (Test and adaptive sessions force `languageMode: "off"` at session creation, so `on-tap` never renders there and this event structurally cannot fire in those modes under this spec — not a gate Codex needs to add, just what "live session" cashes out to today. If Test mode ever gains reveal support, that's a separate product decision, not an extension of this patch.)
- No event is written from Summary, Developer Review, or Preview Lab.
- No changes to `StoredSessionSnapshot`, export/import shape, grading, or bank content.
- `npx tsc -b --pretty false`, `npm run validate-bank -- banks/*.json`, `npm run build` all pass.

## Files Codex will touch

- `src/types.ts` — add `RevealBlock`, `TranslationRevealEvent`.
- `src/storage.ts` — default flip, `DB_VERSION` bump, new store, `recordTranslationReveal`/`loadTranslationRevealEvents`.
- `src/App.tsx` — `RevealTrackingContext`, provider placement in `QuestionCard`/`CaseActivePart`, `block` prop on `BilingualText`/`HighlightControl` call sites, empty-`zh` guard on the reveal button, `translationRevealEvents` state + load effect, `recordReveal` wiring at the session-view level gated on `!reviewMode`.

No schema, bank, grading, or visual-renderer files are touched by this patch.
