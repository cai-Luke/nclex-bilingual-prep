# Translation Telemetry V1.2a — Persisted Attempt History (sessionId + Case-Part Correctness)

## 0. Relationship to V1.2b

V1.2 (now V1.2b) requires a persisted attempt history that includes `sessionId` and, for case-study items, part-level correctness. Neither currently exists — Codex's discovery pass on V1.2 confirmed this directly. V1.2a is the minimal, additive prerequisite that creates them. **V1.2b cannot proceed past its own discovery gate until V1.2a's acceptance criteria are met.**

## 1. Scope

In scope:
- Add `sessionId` to the existing `AnswerEvent` persisted record.
- Add a new, parallel persisted event stream carrying part-level correctness for case-study items, mirroring the existing `TranslationRevealEvent` pattern (a new array alongside `AnswerEvent`, not a replacement for it).
- Enable session-ordinal derivation at analysis time in V1.2b (no new stored ordinal field here — just the raw data needed to compute one later).

Out of scope:
- Any new UI.
- Any change to how questions are graded or scored for the learner. Correctness *values* are unchanged; only what gets *persisted* changes.
- Backfilling historical `AnswerEvent` rows that predate this change. Old rows remain `sessionId: undefined` and will show up as unjoined in V1.2b's diagnostics — expected, not a defect.
- Accounts, multi-device sync, or any concept of "user" beyond the single local learner profile the app already assumes.

## 2. Discovery Phase (blocking prerequisite)

Before writing any code:

1. Confirm the exact field name and shape of the live session identifier available in `App.tsx` at the point `recordAnswer(question.id, wasCorrect)` is called (`activeSession.id` or equivalent). Confirm it's stable for the duration of one session.
2. Confirm whether case-study part correctness is already computed in-memory somewhere in the answering flow (e.g., per-part grading logic that currently only feeds into the eventual whole-question `recordAnswer` call), or whether it needs to be computed for the first time. Locate the exact call site(s).
3. Search for any existing consumer of `AnswerEvent` that assumes at most one row per `questionId` per session (e.g. "has this question been attempted" checks, progress counters, streak logic). List them.
4. Confirm the storage layer (`storage.ts`) can add a new persisted array using the same pattern as `TranslationRevealEvent` without additional migration machinery.

If #3 turns up consumers that would break from a second event stream keyed by `questionId`, that's fine — the point of using a *separate* stream (§4) is specifically to avoid touching those consumers. Flag it anyway so the assumption is verified, not assumed.

**If #2 reveals that per-part correctness isn't computed at a clean point in the flow** — i.e. it would require restructuring the case-study state machine rather than just adding a write call — **stop and report** rather than expanding this into a grading-logic rewrite. That is a materially different and larger piece of work than V1.2a is scoped for.

## 3. Schema Change — `AnswerEvent.sessionId`

```ts
interface AnswerEvent {
  id: string;
  questionId: string;
  wasCorrect: boolean;
  answeredAt: string;
  sessionId?: string; // NEW — optional, for backward compatibility with pre-existing rows
}
```

At the `recordAnswer` call site(s) identified in discovery, thread through the current session's id. This should be a one-line change per call site — no restructuring.

## 4. Schema Addition — Case-Study Part Correctness

New parallel stream, additive only, following the existing `TranslationRevealEvent` precedent:

```ts
interface CaseAnswerPartEvent {
  id: string;
  questionId: string;   // the case/item id
  partId: string;       // reuses whatever convention TranslationRevealEvent already established
  wasCorrect: boolean;
  sessionId: string;
  answeredAt: string;
}
```

- Written once per part, at the point each part is graded — **in parallel with, not instead of**, the existing whole-question `AnswerEvent` write. The existing whole-question write is left untouched so nothing currently reading `AnswerEvent` by `questionId` changes behavior.
- `partId` should reuse whatever convention reveal-tracking already established for case parts, so V1.2b can join `TranslationRevealEvent`, `CaseAnswerPartEvent`, and bank case-part records on one consistent key.
- Non-case-study questions never produce `CaseAnswerPartEvent` rows — this stream exists only for case items.

## 5. Non-Goals (explicit)

- No change to displayed grading, scoring, or progress for the learner — this only adds parallel persistence, it doesn't touch what the learner sees.
- No backfill of historical data.
- No dedup/consolidation logic between `AnswerEvent` and `CaseAnswerPartEvent` — that's V1.2b's join layer's job, not this spec's.
- No changes to `TranslationRevealEvent`.

## 6. Acceptance Criteria

- [ ] Discovery (§2) completed and documented, including the consumer list from #3
- [ ] `AnswerEvent.sessionId` added, populated at all existing write sites going forward, confirmed backward-compatible with pre-existing rows
- [ ] `CaseAnswerPartEvent` stream added, populated once per part on case-study items, without altering the existing whole-question `AnswerEvent` write for those same items
- [ ] No existing `AnswerEvent` consumer changes behavior as a result of this change (verified against the §2.3 list)
- [ ] No learner-facing UI or grading behavior changes
- [ ] `npm run build` and `npx tsc -b --pretty false` pass
