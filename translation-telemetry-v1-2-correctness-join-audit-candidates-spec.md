# Translation Telemetry V1.2b — Correctness Join & Audit Candidates

## 0. Layer & Status

- **Blocked on V1.2a** (sessionId threading + case-part correctness persistence). Do not begin implementation until V1.2a's acceptance criteria are met and merged.
- **Landed (v1.1, Layer A — observe):** reveal event capture, panel, export. Events include block/category/topic, elapsed_time, reveal_before_submit flag, session_count.
- **This spec (Layer B — interpret):** join reveal events to final correctness and produce ranked audit candidates. Analytic layer only — no new instrumentation, no learner-facing surface, no sampler changes.
- **Explicitly deferred (Layer C — intervene):** learner-facing summaries, sticky/default language behavior, targeted-review weighting (`scoreTargetedReviewCandidate`). V1.1 already deferred whether reveal concentration should influence scoring — V1.2b preserves that boundary.

## 1. Purpose

Turn persisted attempt history plus raw reveal events into two things a human can act on:
1. A confidence-appropriate classification of each attempt (language friction vs. content gap), described as observed facts, not inferred causes.
2. A short, ranked, deterministic list of items worth spending expensive adversarial-audit attention on, instead of sweeping the whole bank blind.

## 2. Discovery Phase (blocking prerequisite — do this before writing any join logic)

Repo state beats this spec. Before implementing anything below:

1. Inspect `src/storage.ts`, `src/types.ts`, `src/grading.ts`, and the session summary/history write path in `src/App.tsx`.
2. Confirm `AnswerEvent.sessionId` and `CaseAnswerPartEvent` are present and populated per V1.2a's acceptance criteria.
3. Confirm the `partId` convention used by `CaseAnswerPartEvent` matches the one `TranslationRevealEvent` already uses, so the three-way join (reveal events, part-level correctness, bank records) resolves on one consistent key.
4. `questionId` shape changed once already during the v1.1 case-study schema bump. Confirm it currently resolves stably and uniquely for both standalone items and case-study sub-parts.

**If V1.2a did not land as specified, or the identity convention is unclear, stop and report the gap.** Do not add new instrumentation in V1.2b unless this spec is revised first. Do not implement §4-§7 until this discovery step is complete and the join key is confirmed.

Join key rule: prefer whatever key V1.2a persisted for `AnswerEvent` and `CaseAnswerPartEvent`. Only fall back to a `caseId + partIndex` composite if no such key exists — and if you do, confirm it matches persisted-history semantics rather than being a second, parallel identity scheme.

## 3. Correctness Join

Enriched rows are built by **iterating attempts, not reveal events.** Attempt sources: `AnswerEvent` for standalone questions, `CaseAnswerPartEvent` for case-study parts. For each attempt, left-join a matching reveal event on `(sessionId, questionId[, partId])`. **Every attempt produces exactly one row**, whether or not a reveal event exists for it — this is what makes `correct_no_reveal` and `missed_no_reveal` possible at all.

Produce four buckets, described as observed facts rather than inferred causes:

| bucket enum | Description |
|---|---|
| `correct_no_reveal` | correct, no reveal-before-submit event |
| `missed_no_reveal` | incorrect, no reveal-before-submit event |
| `correct_after_reveal` | correct, reveal-before-submit occurred |
| `missed_after_reveal` | incorrect, reveal-before-submit occurred |

Add `itemType: "standalone" | "case_part"` to each enriched row, populated from which attempt source the row came from.

A separate, optional `interpretation` string may accompany each bucket for human-readable export context (e.g. `correct_after_reveal` -> "possible language support signal"), but the bucket itself must stay purely observational. A correct answer without reveal may still be a guess; an incorrect answer without reveal may still reflect language confusion the learner chose not to resolve via reveal. Don't let the field names claim more than the data supports.

## 4. Elapsed Time — Handling

`elapsed_time_ms` is passed through in the enriched export as a raw, clearly-labeled descriptive field. Study sessions include artifactual lengthening unrelated to language friction — interruptions, pauses for other tasks — so elapsed time is measurable but not currently trustworthy as a signal.

**Elapsed-time fields may be summarized descriptively in exports only if excluded from ranking, weighting, bucket assignment, confidence scoring, and sort order.** Not just "don't branch on it" — also don't sort by it. It stays in the data for future exploratory work only.

## 5. Fade Metric (scaffold reliance over time) — exploratory only

Purpose: surface whether reveal reliance is trending down over time, without touching sticky defaults or any UI.

- Primary aggregation level: category/topic x session-ordinal bucket, since literal question repeats are uncommon outside SRS-driven re-serving of missed items.
- `sessionBucketSize` is a parameter (default 5), not a hardcoded "1-5, 6-10" split.
- Rows with fewer than `sessionBucketSize` attempts in a bucket are included but marked `lowSample: true` — not hidden. Sparse data is still useful for dev/audit review even where it'd be too noisy for a learner-facing claim.
- **This table is descriptive only. It must not produce improvement claims, readiness claims, or learner-facing conclusions.** That restriction is what made V1.1 good; V1.2b doesn't get to quietly relax it.
- Session ordinal is derived from the **attempt stream** (`AnswerEvent`, which exists for every session), not from `TranslationRevealEvent` (which only exists for sessions containing a reveal). Group by `sessionId`, take each session's earliest `answeredAt`, sort. Deriving from reveal events alone would bias the ordinal toward sessions that happened to contain a reveal — deriving from the full attempt stream avoids that.
- Open question: whether the SRS missed-question loop re-serves identical `questionId`s often enough to also support an item-level fade metric, in addition to category-level. Flagging, not deciding — resolve during discovery (§2) if the data density is visible there.

## 6. Audit Candidate List

- Rank by:
  1. `attemptCount >= minAuditAttempts` (default 5)
  2. `revealBeforeSubmitRate` descending
  3. `revealBeforeSubmitCount` descending
  4. `incorrectAfterRevealRate` descending
  5. `questionId` ascending (deterministic tie-break floor)
- Include both numerator and denominator per row, not just rate: `attemptCount`, `revealBeforeSubmitCount`, `revealBeforeSubmitRate`, `correctAfterRevealCount`, `missedAfterRevealCount`. A 4/5 item and a 20/25 item can share a rate — they aren't equally compelling.
- Output top N (default `topAuditCandidates = 20`).
- Case-study items produce one audit-candidate row per part (using `CaseAnswerPartEvent` + matching reveals), not one row per case. Add `itemType` and `partId` (when applicable) to the candidate row shape so a reviewer can tell a standalone-question candidate from a specific case-part candidate. Ranking and tie-break rules apply per-row regardless of `itemType`.
- **`stem_excerpt` is derived from the current question bank at export/summarization time — it is not stored on or copied from reveal events.** Reveal events must not carry `stem_excerpt`; that would be de facto new instrumentation and would go stale relative to bank edits. If a `questionId` no longer resolves in the current bank, emit `stem_excerpt: "[unresolved question in current bank]"` and `resolved: false` rather than dropping the row.
- `stem_excerpt` remains mandatory on every resolved row — the bilingual-divergence audit spec requires verbatim evidence and rejects paraphrase-as-evidence. This candidate list is an input to that audit chain and must preserve it.

## 7. Non-Goals (explicit)

- No changes to sampler or targeted-review weighting (`scoreTargetedReviewCandidate` untouched).
- No learner-facing UI or end-of-session summary — deferred to Layer C, pending dogfooding on a stable metric.
- No sticky/default language persistence change.
- No new event instrumentation beyond what v1.1 already captures (this explicitly includes: reveal events do not gain a `stem_excerpt` field).

## 8. Output Format

Dev-only exports (JSON/CSV), consistent with the existing panel/export mechanism:

1. **Enriched attempt rows** — normalized attempt + optional joined reveal event + `bucket` + `itemType` + optional `interpretation` + raw `elapsed_time_ms` (descriptive, unweighted).
2. **Audit candidate summary** — `questionId`, optional `partId`, `itemType`, category, rate + count fields per §6, `stem_excerpt`, `resolved`.
3. **Fade trend table** — category/topic x session-ordinal bucket -> reveal rate, `lowSample` flag.
4. **Diagnostics** — surfaces join health so bad joins can't silently disappear:
   ```
   diagnostics: {
     revealEventCount: number;
     attemptCount: number;
     joinedEventCount: number;
     unjoinedRevealEventCount: number;
     unjoinedAttemptCount: number;
     unresolvedQuestionCount: number;
     duplicateJoinKeyCount: number;
     attemptSourceBreakdown: {
       standalone: number;   // AnswerEvent-derived attempt count
       casePart: number;     // CaseAnswerPartEvent-derived attempt count
     };
   }
   ```
   Given §2 already anticipates key instability, this is what makes that risk checkable rather than just noted.

## 9. Function Shape (for Codex)

```ts
interface NormalizedAttempt {
  questionId: string;
  partId?: string;       // present only for case_part attempts
  itemType: "standalone" | "case_part";
  wasCorrect: boolean;
  sessionId: string;
  answeredAt: string;
}

summarizeTranslationFriction({
  attempts,          // NormalizedAttempt[] — caller merges AnswerEvent + CaseAnswerPartEvent
  events,            // TranslationRevealEvent[]
  questions,
  minAuditAttempts = 5,
  topAuditCandidates = 20,
  sessionBucketSize = 5,
}): {
  enrichedRows;
  auditCandidates;
  fadeTrend;
  diagnostics;
}
```

Where `attempts` = normalized persisted attempt rows (confirmed to exist via §2 discovery), `questions` = flattened bank records / case-study parts used to derive `stem_excerpt` at export time. Normalize both attempt sources into one shape *before* calling the pure function; the merge/normalize step is a small adapter at the call site, not inside the pure function. This keeps `summarizeTranslationFriction` grain-agnostic and easy to unit test with plain fixtures.

Pure function, no side effects — same deterministic-transform pattern already used for the shuffler/verifier split. Testable in isolation against fixture arrays without touching the live bank or session store.

## 10. Acceptance Criteria

- [ ] V1.2a merged and its acceptance criteria confirmed met before this work begins
- [ ] Discovery phase (§2) completed and documented; V1.2a persisted attempt sources confirmed before implementation begins; no new instrumentation added unless this spec is revised
- [ ] Join-key confirmed against existing answer-history/grading convention (or composite key adopted only after confirming no existing convention applies)
- [ ] `summarizeTranslationFriction` implemented as a pure function with unit tests covering all four buckets
- [ ] Enriched rows are attempt-centric: every `NormalizedAttempt` produces exactly one row, with or without a matching reveal
- [ ] Case-study items produce part-level buckets and part-level audit-candidate rows, not whole-item aggregates
- [ ] Enriched export includes raw `elapsed_time_ms`, excluded from ranking, weighting, bucket assignment, and sort order
- [ ] Audit candidates derive `stem_excerpt` from current bank records at export time; unresolved questions marked `resolved: false` rather than dropped
- [ ] Ranking is deterministic with the documented 5-level tie-break
- [ ] Fade trend rows with low denominators are marked `lowSample: true` rather than hidden or silently dropped
- [ ] Fade-metric session ordinal derived from the full attempt stream, not from reveal events alone
- [ ] Export includes `diagnostics`; smoke-check verifies unjoined/duplicate counts are zero or explicitly explained
- [ ] `diagnostics.attemptSourceBreakdown` present and non-zero for both sources on a real dataset containing case-study attempts
- [ ] No modifications to sampler, targeted-review logic, or any learner-facing screen
- [ ] `npm run build` and `npx tsc -b --pretty false` pass
