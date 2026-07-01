# Translation Telemetry V1.2a — Persisted Attempt History (sessionId, mode context, case-part correctness)

## 0. Relationship to V1.2b

V1.2b requires a persisted attempt history that includes `sessionId`, enough mode context to determine whether translation reveal was even possible, and — for case-study items — part-level correctness. **None of this currently exists on durable answer-attempt rows.** (`TranslationRevealEvent` already has `sessionId`; `StoredSessionSnapshot` already carries session id/mode/language-mode context. What's missing is that context landing on the persisted attempt rows themselves — `AnswerEvent` currently has only `id`, `questionId`, `wasCorrect`, `answeredAt`.) V1.2a is the minimal, additive prerequisite that adds it. **V1.2b cannot proceed past its own discovery gate until V1.2a's acceptance criteria are met.**

## 1. Scope

In scope:
- Add `sessionId`, `sessionMode`, `languageModeAtAnswer` to the existing `AnswerEvent` persisted record.
- Change `recordAnswer` to accept this context as a single object, not additional positional args (avoids argument-order bugs, keeps the call backward-compatible in spirit).
- Add a new, parallel persisted event stream carrying part-level correctness for case-study items, mirroring the existing `TranslationRevealEvent` pattern — written **only from the submission path**, never from render/display code.
- Enable session-ordinal derivation at analysis time in V1.2b (no new stored ordinal field — just the raw data needed to compute one later).

Out of scope:
- Any new UI.
- Any change to how questions are graded or scored for the learner. Correctness *values* are unchanged; only what gets *persisted* changes.
- Persisting a computed `translationRevealEligible` boolean — that's derived downstream in V1.2b from `sessionMode` + `languageModeAtAnswer`, not stored here.
- Backfilling historical `AnswerEvent` rows that predate this change. Old rows remain missing these fields and will show up as unjoinable in V1.2b's diagnostics — expected, not a defect.
- Accounts, multi-device sync, or any concept of "user" beyond the single local learner profile the app already assumes.

## 2. Discovery Phase (blocking prerequisite)

Before writing any code:

1. Confirm `submitCurrent` is the sole canonical answer-submission call site (the one with `session`, `question`, `answer`, `score`, `wasCorrect` in scope before calling `recordAnswer`). If a second submission entry point exists (e.g. keyboard-shortcut submit vs. button-click submit going through different code paths), both must get the same treatment — don't assume there's only one.
2. Confirm the `SessionMode` and `LanguageMode` type definitions, and confirm both `session.mode` and `session.languageMode` are in scope at `submitCurrent`.
3. Identify which `LanguageMode` value represents on-demand/on-tap reveal, as distinct from `"always"` (Chinese shown without a reveal action) and `"off"` (no Chinese offered — forced for test and adaptive sessions). Working assumption pending confirmation: the value is `"on-tap"`. Confirm the literal value rather than trusting this assumption.
4. Confirm whether `languageMode` can change mid-session for study-mode sessions, or whether it's fixed for the session's duration. This determines whether `languageModeAtAnswer` genuinely needs per-attempt storage (current assumption) or could instead be derived by joining `AnswerEvent.sessionId` against `StoredSessionSnapshot` in V1.2b. Not blocking — informational, worth two minutes to confirm rather than assume either way.
5. Locate every place case-study part correctness is currently computed, and identify which are render/display paths vs. the submission path:
   - `CasePartNavigator` calls `gradeQuestion(caseQuestion, caseAnswer)` to label part chips (Correct/Review) — **display only, do not persist from here.**
   - `CaseActivePart` computes `caseResult`/`caseScore` for display — **display only, do not persist from here.**
   - `submitCurrent` — **this is the persistence site.**
6. Search for any existing consumer of `AnswerEvent` that assumes at most one row per `questionId` per session (e.g. "has this question been attempted" checks, progress counters, streak logic). List them.
7. Confirm the storage layer (`storage.ts`) can add a new object store using the same pattern as `TranslationRevealEvent`. Note the current `DB_VERSION` and the IndexedDB upgrade-path mechanism, since adding a store means bumping it.

If #6 turns up consumers that would break from a second event stream keyed by `questionId`, that's fine — using a *separate* stream (§4) is specifically meant to avoid touching those consumers. Flag it anyway so the assumption is verified.

**If #5 reveals that per-part correctness can't be cleanly recomputed at `submitCurrent`** without duplicating logic that currently only lives in the render components — **stop and report** rather than either persisting from render code or expanding this into a grading-logic rewrite.

## 3. Schema Change — `AnswerEvent`

```ts
interface AnswerEvent {
  id: string;
  questionId: string;
  wasCorrect: boolean;
  answeredAt: string;
  sessionId?: string;
  sessionMode?: SessionMode;
  languageModeAtAnswer?: LanguageMode;
}
```

All three new fields optional, for backward compatibility with pre-existing rows.

**API shape.** Change `recordAnswer` to take context as an object:

```ts
recordAnswer(question.id, wasCorrect, {
  sessionId: session.id,
  sessionMode: session.mode,
  languageModeAtAnswer: session.languageMode,
});
```

Not positional args — avoids argument-order mistakes and keeps the signature legible at every call site.

## 4. Schema Addition — Case-Study Part Correctness

New parallel stream, additive only, following the existing `TranslationRevealEvent` precedent. All fields required — this stream has no legacy rows to be backward-compatible with:

```ts
interface CaseAnswerPartEvent {
  id: string;
  questionId: string;   // the case/item id
  partId: string;       // matches the partId convention TranslationRevealEvent already uses
  wasCorrect: boolean;
  sessionId: string;
  sessionMode: SessionMode;
  languageModeAtAnswer: LanguageMode;
  answeredAt: string;
}
```

**Write site: `submitCurrent`, and only `submitCurrent`.** After the existing whole-question grade is computed there, iterate `question.caseStudy.questions`, derive each part's answer via `answer.caseStudy[part.id] ?? getInitialAnswer(part)`, compute `gradeQuestion(part, partAnswer)`, and persist one `CaseAnswerPartEvent` per part. This runs **in parallel with, not instead of**, the existing whole-question `AnswerEvent` write — that write is left untouched so nothing currently reading `AnswerEvent` by `questionId` changes behavior. (V1.2b's normalization layer is responsible for not double-counting these two writes as separate standalone attempts.)

**Do not add persistence calls to `CasePartNavigator` or `CaseActivePart`.** Both already compute grading for display purposes; adding a write there would fire on every render/rerender, producing duplicate events.

- `partId` should reuse whatever convention reveal-tracking already established for case parts.
- Non-case-study questions never produce `CaseAnswerPartEvent` rows.

## 5. Non-Goals (explicit)

- No change to displayed grading, scoring, or progress for the learner.
- No backfill of historical data.
- No dedup/consolidation logic between `AnswerEvent` and `CaseAnswerPartEvent` — that's V1.2b's job.
- No changes to `TranslationRevealEvent`.
- No stored eligibility boolean — computed downstream from `sessionMode` + `languageModeAtAnswer`.
- No persistence writes from render/display components, under any circumstance.

## 6. Acceptance Criteria

- [ ] Discovery (§2) completed and documented, including the confirmed `LanguageMode` value mapping (#3), the mid-session language-mode-stability answer (#4), and the consumer list (#6)
- [ ] `recordAnswer` takes a context object (`sessionId`, `sessionMode`, `languageModeAtAnswer`), not positional args
- [ ] `AnswerEvent.sessionId`, `sessionMode`, `languageModeAtAnswer` populated at all confirmed submission call sites going forward, backward-compatible with pre-existing rows
- [ ] `CaseAnswerPartEvent` stream added, populated once per part **only from `submitCurrent`**, without altering the existing whole-question `AnswerEvent` write for those same items
- [ ] `CaseAnswerPartEvent` writes occur only from the submission path — verified `CasePartNavigator` and `CaseActivePart` contain no persistence calls
- [ ] IndexedDB version bumped and `caseAnswerPartEvents` object store created in the upgrade path
- [ ] In-memory fallback array added for file:// / IndexedDB-blocked contexts, consistent with how other stores handle this
- [ ] `recordCaseAnswerPartEvent` and `loadCaseAnswerPartEvents` implemented
- [ ] Manual/dev smoke test confirms a study answer, a test answer, an adaptive answer, and a case-study submission each persist the expected session/mode fields **after reload** (not just in-memory)
- [ ] No existing `AnswerEvent` consumer changes behavior as a result of this change (verified against the §2.6 list)
- [ ] No learner-facing UI or grading behavior changes
- [ ] `npm run build` and `npx tsc -b --pretty false` pass
