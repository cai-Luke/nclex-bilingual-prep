# Translation Telemetry V1.2b — Correctness Join & Audit Candidates

## 0. Layer & Status

- **Blocked on V1.2a** (sessionId/mode threading + case-part correctness persistence, submit-path only). Do not begin until V1.2a's acceptance criteria are met and merged.
- **Landed (v1.1, Layer A — observe):** reveal event capture, panel, export. Events include block/category/topic, elapsed_time, reveal_before_submit flag.
- **This spec (Layer B — interpret):** join reveal events to final correctness and produce ranked audit candidates. Analytic layer only — no new instrumentation, no learner-facing surface, no sampler changes.
- **Explicitly deferred (Layer C — intervene):** learner-facing summaries, sticky/default language behavior, targeted-review weighting (`scoreTargetedReviewCandidate`). V1.1 already deferred whether reveal concentration should influence scoring — V1.2b preserves that boundary.

## 1. Purpose

Turn persisted attempt history plus raw reveal events into two things a human can act on:
1. A confidence-appropriate classification of each attempt (language friction vs. content gap), described as observed facts, not inferred causes.
2. A short, ranked, deterministic list of items worth spending expensive adversarial-audit attention on, instead of sweeping the whole bank blind.

## 2. Discovery Phase (blocking prerequisite — do this before writing any join logic)

Repo state beats this spec. Before implementing anything below:

1. Inspect `src/storage.ts`, `src/types.ts`, `src/grading.ts`, and the session summary/history write path in `src/App.tsx`.
2. Confirm `AnswerEvent.sessionId` / `sessionMode` / `languageModeAtAnswer` and `CaseAnswerPartEvent` are present and populated per V1.2a's acceptance criteria.
3. Confirm the `LanguageMode` value V1.2a identified for on-demand reveal. Working assumption: `"on-tap"`, distinct from `"always"` and `"off"`.
4. Confirm the `partId` convention on `CaseAnswerPartEvent` matches `TranslationRevealEvent`'s.
5. `questionId` shape changed once already during the v1.1 case-study schema bump. Confirm it currently resolves stably and uniquely for both standalone items and case-study sub-parts.

**If V1.2a did not land as specified, or the identity convention is unclear, stop and report the gap.** Do not add new instrumentation in V1.2b unless this spec is revised first. Do not implement §4-§7 until this discovery step is complete and the join key is confirmed.

Join key rule: prefer whatever key V1.2a persisted for `AnswerEvent` and `CaseAnswerPartEvent`. Only fall back to a `caseId + partIndex` composite if no such key exists — and if you do, confirm it matches persisted-history semantics rather than being a second, parallel identity scheme.

## 3. Correctness Join

**Pre-submit reveal — exact definition.** Use `event.submittedBeforeReveal === false`. Do **not** use `answeredBeforeReveal` for this — that field describes whether an answer was already selected/ready at reveal time, not whether the question had been submitted. V1.1's existing before-submit counting already relies on `submittedBeforeReveal`; stay consistent with it.

**Reveal aggregation.** An attempt can have multiple matching reveal events (stem, choices, rationale, glossary, case stage — reveal is logged per block, one row per event). Aggregate, don't join to a single event:

```ts
matchingRevealEvents: TranslationRevealEvent[];
revealBeforeSubmitCount: number;   // count where submittedBeforeReveal === false
hadRevealBeforeSubmit: boolean;
firstRevealBeforeSubmitAt?: string;
revealedBlocks: RevealBlock[];     // unique blocks, sorted by first occurrence, stable fallback order for ties
```

**Eligibility.** Compute, don't store:

```ts
function isTranslationRevealEligible(sessionMode: SessionMode, languageModeAtAnswer: LanguageMode): boolean {
  return sessionMode === "study" && languageModeAtAnswer === "on-tap"; // confirm literal value per §2
}
```

Ineligible attempts (`eligible === false`) are excluded from the four friction buckets and from every downstream rate/ranking (§5, §6) — but not from session ordinal derivation (§5). Report their count in diagnostics.

**Attempt-centric, not reveal-event-centric.** Iterate attempts (`AnswerEvent` for standalone questions, `CaseAnswerPartEvent` for case-study parts), left-join aggregated reveal data by `(sessionId, questionId[, partId])`. Every eligible attempt produces exactly one row, with or without a reveal.

**Standalone/case-part exclusivity.** Exclude `AnswerEvent` rows whose `questionId` resolves to a top-level case-study item from the normalized attempt set — those are still written for backward compatibility per V1.2a, but must not also become standalone attempt rows. Count exclusions (see §9 — this count must be passed into the pure function, not computed by it).

**Legacy rows.** `AnswerEvent` rows missing `sessionId`, `sessionMode`, or `languageModeAtAnswer` (predating V1.2a) are excluded from `NormalizedAttempt[]` and counted as `legacyUnjoinableAttemptCount`. Do not coerce them into a fake session or a default eligibility value. Count these too (see §9).

Bucket table, applying only to eligible attempts:

| bucket enum | Description |
|---|---|
| `correct_no_reveal` | correct, no pre-submit reveal |
| `missed_no_reveal` | incorrect, no pre-submit reveal |
| `correct_after_reveal` | correct, `hadRevealBeforeSubmit` |
| `missed_after_reveal` | incorrect, `hadRevealBeforeSubmit` |

Add `itemType: "standalone" | "case_part"` to each enriched row, populated from which attempt source the row came from.

A separate, optional `interpretation` string may accompany each bucket for human-readable export context (e.g. `correct_after_reveal` -> "possible language support signal"), but the bucket itself must stay purely observational. A correct answer without reveal may still be a guess; an incorrect answer without reveal may still reflect language confusion the learner chose not to resolve via reveal. Don't let the field names claim more than the data supports.

## 4. Elapsed Time — Handling

`elapsed_time_ms` is passed through in the enriched export as a raw, clearly-labeled descriptive field. Study sessions include artifactual lengthening unrelated to language friction — interruptions, pauses for other tasks — so elapsed time is measurable but not currently trustworthy as a signal.

**Elapsed-time fields may be summarized descriptively in exports only if excluded from ranking, weighting, bucket assignment, confidence scoring, and sort order.** Not just "don't branch on it" — also don't sort by it. It stays in the data for future exploratory work only.

## 5. Fade Metric (scaffold reliance over time) — exploratory only

Purpose: surface whether reveal reliance is trending down over time, without touching sticky defaults or any UI.

- Primary aggregation level: category/topic x session-ordinal bucket, since literal question repeats are uncommon outside SRS-driven re-serving of missed items.
- `sessionBucketSize` is a parameter (default 5), not a hardcoded "1-5, 6-10" split.
- **Session ordinal is derived from the full valid attempt stream — all non-legacy attempts with a valid `sessionId` and `answeredAt`, including ineligible ones (test/adaptive/`always`-mode sessions).** Group by `sessionId`, take earliest `answeredAt`, sort. This keeps chronology honest — deriving order from eligible attempts alone would silently skip test/adaptive sessions and make the timeline look more compressed than it actually was.
- **Fade rates (numerator/denominator) are then computed from eligible attempts only**, within whichever session-ordinal bucket their true chronological position falls into. A bucket may legitimately contain zero eligible attempts (e.g. a stretch of test-mode sessions) — that row still appears with `lowSample: true` and a null rate, not hidden, consistent with how other sparse buckets are handled.
- Rows with fewer than `sessionBucketSize` eligible attempts in a bucket are included but marked `lowSample: true` — not hidden. Sparse data is still useful for dev/audit review even where it'd be too noisy for a learner-facing claim.
- **This table is descriptive only. It must not produce improvement claims, readiness claims, or learner-facing conclusions.** That restriction is what made V1.1 good; V1.2b doesn't get to quietly relax it.
- Open question: whether the SRS missed-question loop re-serves identical `questionId`s often enough to also support an item-level fade metric, in addition to category-level. Flagging, not deciding — resolve during discovery (§2) if the data density is visible there.

## 6. Audit Candidate List

- Ranking and denominators are computed over **eligible attempts only**.
- Rank by:
  1. `attemptCount >= minAuditAttempts` (default 5)
  2. `revealBeforeSubmitRate` descending
  3. `revealBeforeSubmitCount` descending
  4. `incorrectAfterRevealRate` descending
  5. `questionId` ascending (deterministic tie-break floor)
- Include both numerator and denominator per row, not just rate: `attemptCount`, `revealBeforeSubmitCount`, `revealBeforeSubmitRate`, `correctAfterRevealCount`, `missedAfterRevealCount`. A 4/5 item and a 20/25 item can share a rate — they aren't equally compelling.
- Output top N (default `topAuditCandidates = 20`).
- Case-study items rank at **part level** (one candidate row per part). Add `itemType` and `partId` (when applicable). Tie-break rules apply per-row regardless of `itemType`.
- **`stem_excerpt` is derived from the current question bank at export/summarization time — it is not stored on or copied from reveal events.** Reveal events must not carry `stem_excerpt`; that would be de facto new instrumentation and would go stale relative to bank edits. If a `questionId` no longer resolves in the current bank, emit `stem_excerpt: "[unresolved question in current bank]"` and `resolved: false` rather than dropping the row.
- `stem_excerpt` remains mandatory on every resolved row — the bilingual-divergence audit spec requires verbatim evidence and rejects paraphrase-as-evidence. This candidate list is an input to that audit chain and must preserve it.

## 7. Non-Goals (explicit)

- No changes to sampler or targeted-review weighting (`scoreTargetedReviewCandidate` untouched).
- No learner-facing UI or end-of-session summary — deferred to Layer C, pending dogfooding on a stable metric.
- No sticky/default language persistence change.
- No new translation-reveal instrumentation beyond v1.1, and no new attempt instrumentation beyond the V1.2a persisted attempt streams (`AnswerEvent` additions, `CaseAnswerPartEvent`).

## 8. Output Format

Dev-only exports (JSON/CSV), consistent with the existing panel/export mechanism:

1. **Enriched attempt rows** — normalized attempt + aggregated joined reveal data + `bucket` + `itemType` + optional `interpretation` + raw `elapsed_time_ms` (descriptive, unweighted).
2. **Audit candidate summary** — `questionId`, optional `partId`, `itemType`, category, rate + count fields per §6, `stem_excerpt`, `resolved`.
3. **Fade trend table** — category/topic x session-ordinal bucket -> reveal rate or null, `lowSample` flag.
4. **Diagnostics** — surfaces join health so bad joins can't silently disappear:
   ```ts
   diagnostics: {
     revealEventCount: number;
     attemptCount: number;
     joinedEventCount: number;
     unjoinedRevealEventCount: number;
     unjoinedAttemptCount: number;
     unresolvedQuestionCount: number;
     duplicateJoinKeyCount: number;
     attemptSourceBreakdown: {
       standalone: number;
       casePart: number;
     };
     ineligibleAttemptCount: number;
     legacyUnjoinableAttemptCount: number;
     excludedCaseTopLevelAnswerEventCount: number;
   }
   ```
   Given §2 already anticipates key instability, this is what makes that risk checkable rather than just noted.

## 9. Function Shape (for Codex)

The caller/adapter normalizes both attempt sources before calling the pure function. It also passes counts for rows the pure function cannot see because they were excluded during normalization.

```ts
interface NormalizedAttempt {
  questionId: string;
  partId?: string;
  itemType: "standalone" | "case_part";
  wasCorrect: boolean;
  sessionId: string;
  sessionMode: SessionMode;
  languageModeAtAnswer: LanguageMode;
  answeredAt: string;
}

summarizeTranslationFriction({
  attempts,          // NormalizedAttempt[] — caller has already merged AnswerEvent + CaseAnswerPartEvent,
                     // excluding case-study top-level rows and legacy-unjoinable rows
  events,            // TranslationRevealEvent[]
  questions,
  normalizationDiagnostics = {
    legacyUnjoinableAttemptCount: 0,
    excludedCaseTopLevelAnswerEventCount: 0,
  },
  minAuditAttempts = 5,
  topAuditCandidates = 20,
  sessionBucketSize = 5,
}): {
  enrichedRows;
  auditCandidates;
  fadeTrend;
  diagnostics;   // merges normalizationDiagnostics with internally-computed counts (ineligibleAttemptCount, attemptSourceBreakdown, etc.)
}
```

Eligibility, bucket assignment, and reveal aggregation are computed inside the function from fields already on `NormalizedAttempt`. The merge/normalize/exclude step for the two attempt sources stays a small adapter at the call site — the pure function stays fixture-testable, it just now also accepts the adapter's exclusion counts as an explicit input rather than trying to infer them.

Pure function, no side effects — same deterministic-transform pattern already used for the shuffler/verifier split. Testable in isolation against fixture arrays without touching the live bank or session store.

## 10. Acceptance Criteria

- [ ] V1.2a merged and its acceptance criteria confirmed met before this work begins
- [ ] Discovery phase (§2) completed and documented; V1.2a persisted attempt sources confirmed before implementation begins; no new instrumentation added unless this spec is revised
- [ ] Join-key confirmed against existing answer-history/grading convention (or composite key adopted only after confirming no existing convention applies)
- [ ] `summarizeTranslationFriction` implemented as a pure function with unit tests covering all four buckets
- [ ] `hadRevealBeforeSubmit` computed from `submittedBeforeReveal === false`; `answeredBeforeReveal` never used to define pre-submit status
- [ ] `revealedBlocks` output is deterministically ordered
- [ ] Eligibility computed from `sessionMode`/`languageModeAtAnswer`, not stored; ineligible attempts excluded from buckets, audit ranking, and fade rates — but included in fade ordinal derivation
- [ ] Enriched rows are attempt-centric: every eligible `NormalizedAttempt` produces exactly one row, with or without a matching reveal
- [ ] Case-study items produce part-level buckets and part-level audit-candidate rows, not whole-item aggregates
- [ ] Case-study top-level `AnswerEvent` rows excluded from standalone attempt rows; exclusion count passed into `summarizeTranslationFriction` via `normalizationDiagnostics` and reflected in output
- [ ] Legacy rows excluded and their count passed into `summarizeTranslationFriction` via `normalizationDiagnostics`, never coerced into a fake session
- [ ] Enriched export includes raw `elapsed_time_ms`, excluded from ranking, weighting, bucket assignment, and sort order
- [ ] Audit candidates derive `stem_excerpt` from current bank records at export time; unresolved questions marked `resolved: false` rather than dropped
- [ ] Ranking is deterministic with the documented 5-level tie-break
- [ ] Fade trend rows with low denominators are marked `lowSample: true` rather than hidden or silently dropped
- [ ] Fade-metric session ordinal derived from the full valid attempt stream, not from eligible attempts or reveal events alone
- [ ] Fade trend buckets with zero eligible attempts still appear, marked `lowSample: true`, rather than being omitted
- [ ] Export includes `diagnostics`; smoke-check verifies unjoined/duplicate counts are zero or explicitly explained
- [ ] `diagnostics.attemptSourceBreakdown` present and non-zero for both sources on a dataset containing case-study attempts
- [ ] No modifications to sampler, targeted-review logic, or any learner-facing screen
- [ ] `npm run build` and `npx tsc -b --pretty false` pass
