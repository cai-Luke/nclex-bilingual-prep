# Project Shrimp — Review redesign and Vocabulary retirement

**Omnibus implementation contract**

Date: September 12, 2026
Status: Proposed specification baseline. Not an implementation authorization. No repository files were modified.
Supersedes: `PROJECT-SHRIMP-REVIEW-REDESIGN-BRIEF-2026-09-12.md` (Astra) and the separate Vocabulary audit and addendum.

**The product after this change is Study with three forms of memory — Needs review, Saved, and Last set — plus contextual glossary help inside questions. There is no Review destination, no Vocabulary mode, no question scheduler, no term scheduler, no historical-render system, and no retry-history graph.**

---

## 1. Verification record

Read against the live checkout at `/Users/holemini/Desktop/Project Shrimp`, branch `codex/ux-0c-finite-vocab-pass`. Source read directly this session: `src/App.tsx` (lines 1–2690 and targeted regions beyond), `src/storage.ts` (lines 1–340), `src/sessionSampler.ts` (complete), `src/reviewSchedule.ts` (complete). No test suite, build, or browser reproduction was executed.

### Verified this session

| Question the rulings made conditional | Finding |
|---|---|
| Does `caseAnswerPartEvents` have a surviving consumer? | **No.** Written by `submitCurrent`; read only by `TranslationTelemetryPanel` (dev-gated `view === "telemetry"`) and `translationTelemetry.ts`. Telemetry-only. Retires. |
| Does `answerEvents` have a separate consumer? | **Yes.** `DashboardView` builds its Recent trend strip from the last 20 events. Survives. |
| Does `languageMisses` have a surviving consumer? | **No.** Feeds `languageMissQuestionIds` → `durableRescueQuestionIds` → `rescueTermIds`, the `languageMissTermIds` Vocab Rescue pill, and `getSessionMissedTermIds`. Every consumer is Vocab Rescue. Retires. |
| Does translation-reveal telemetry have a surviving consumer? | **No.** `translationRevealEvents` is read only by `TranslationTelemetryPanel`. Retires. The reveal behavior itself is independent of the recording and is unaffected. |
| Are visuals deterministic specifications or assets? | **Specifications.** `VisualStimulus` renders from typed question data with `mulberry32` seeding. No external clinical image assets exist today. The ruling's premise holds. |
| Is `reviewSchedule.ts` fully dead after question-SRS removal? | **Yes.** Its only export is `isDueForReview`. Consumers: `dueRecords`, the Library `Due` pill, Builder `due` status, and `progressTier` in the sampler. All retire or lose their time dependence. Note that `scheduleReview` lives in `storage.ts`, not in `reviewSchedule.ts`. |
| Is vocabulary scheduling genuinely shared with question scheduling? | Partly. Questions use `scheduleReview` in `storage.ts`; both paths consume `isDueForReview`. Both retire, so the question is moot. |
| Two-consecutive clearing rule | Confirmed in `recordAnswer`: `missed: wasCorrect ? !((existing?.correctStreak ?? 0) + 1 >= 2) && Boolean(existing?.missed) : true`. The migration inference in §10 is sound against this expression. |

### Carried forward unverified

The collapsed-stem on-tap defect (`SummaryStemText` using `mode !== "off"`) is carried from Astra's audit; I did not read that region this session. Astra's audit and this brief share an author lineage, so §13's ledger should not be treated as independently double-checked except where marked verified above.

---

## 2. Frozen decisions

Consolidated from the owner rulings. These are inputs, not proposals.

1. No permanent Review destination. Retries run through ordinary Study.
2. Binary `needsReview` replaces the question SRS. Set on any below-full-marks submission; cleared by one later full-marks submission. No dates, intervals, or due state.
3. `Saved` is manual intent only, cleared manually. Independent of `needsReview`.
4. Whole-case governance preserved. One aggregate outcome, one state, cleared only by a full-marks whole-case attempt.
5. Ordinary Study reserves a bounded minority of seats (~20%) for Needs review when the control is on. See §7.
6. Visual floors are orthogonal to review injection.
7. Completed memory uses fingerprint-degrade, not question snapshots. See §8.
8. `Last set` archives only the latest completed **primary ordinary Study session**. Remediation does not archive.
9. Standalone Vocabulary retires entirely (model G). Contextual glossary help survives in place. No Saved Terms.
10. `languageMisses` and translation-reveal telemetry retire.
11. Flashcard history is dropped, not migrated.
12. `Off` suppresses ambient Chinese; explicit glossary help may show Chinese.

---

## 3. Learner mental model

> Practice normally. Questions you do not answer fully correctly come back in later practice on their own. One fully correct attempt takes a question off that list. Save a question when you want to keep it yourself. Open Last set to see your previous answers and explanations without answering again. Tap a highlighted term when you need the English explained.

There is no queue to maintain, no due date, no deck, and no vocabulary exercise. The learner's passive path — start practice, answer, read explanations — is sufficient for remediation to happen.

---

## 4. Information architecture

Current top-level navigation, read from `App.tsx`: Home, Builder, Dashboard, Vocab, Library, Import, Settings, plus dev-gated Developer and Telemetry.

After this change: Home, Builder (Customize), Dashboard (Progress), Library, Import, Settings, plus dev-gated Developer. Vocab and Telemetry are gone.

Per ruling 7, the honest claim is **one fewer learner destination and two fewer dev destinations**, not a restructured shell. Needs review, Saved, and Last set are Study-owned surfaces reached from Home, not new top-level items. Whether Import belongs in the learner shell at all is a separate shell question and is out of scope here.

| Surface | Surviving jobs |
|---|---|
| Home | Continue unfinished set; Start practice with count choice; `Revisit missed questions` toggle; compact dated Last set entry; text links to Needs review and Saved with factual counts |
| Needs review (under Study) | Read-only list of questions not yet answered fully correctly; explicit Practice these; cases identified as whole cases |
| Saved (under Study) | Manual bookmarks; inspect, remove, or practice |
| Completed-set view | One viewer used both immediately after completion and on reopening Last set |
| Active Study | Answering, grading, post-submit explanation, Save toggle, contextual glossary help, Copy question for GPT |
| Customize | Content constraints plus All / Unanswered / Needs review / Saved populations. Remove `incorrect` (ever-incorrect) and `due` selectors |
| Progress | Factual statistics only. No queues, no readiness claims |
| Library | Row opens inspection; explicit Practice starts an attempt. Remove the `Due` pill |

Home's metric wall currently shows Questions, Answered, Due review, Mistakes, Flagged, Vocab terms. `Due review` and `Vocab terms` are deleted. `Mistakes` becomes `Needs review`, `Flagged` becomes `Saved`. The row must not be repopulated with new review counts.

Inspecting a question from Needs review or Saved, outside retained completed memory, is a **current-question preview**, not a recovered past answer. Never reconstruct "you selected" from a correctness event.

---

## 5. State model

Four independent owners.

| State | Identity | Changes when |
|---|---|---|
| `needsReview` | One boolean per logical top-level question | A submission commits, or one-time migration |
| `saved` | One manual boolean per logical top-level question, preserving existing note and timestamp | The learner explicitly saves or removes |
| Active Study | One resumable set: membership, drafts, submitted outcomes, index, skip phase, launch intent, return target | Ordinary Study interaction |
| Completed memory | Exactly one immutable record, plus a small separate viewing context | An archive-eligible session completes |

All four `needsReview` / `saved` combinations are legitimate. There is no combined flag. Legacy `missed` must not remain a second writable truth.

### Transitions

| Event | `needsReview` | `saved` |
|---|---|---|
| Submission below full marks, including partial credit | true | unchanged |
| Later full-marks submission | false on successful commit | unchanged |
| Repeated miss | remains true | unchanged |
| Skip, unsubmitted draft, early end | unchanged | unchanged |
| Opening a rationale, revealing Chinese, opening glossary help, reopening Last set | unchanged | unchanged |
| Explicit save or remove | unchanged | as requested |

Full correctness uses the existing `grading.ts` definition: positive possible points and earned equals possible. A case is one top-level unit; every part must reach full marks in the same submitted attempt to clear the parent.

---

## 6. Retirement inventory

Concrete symbols verified on disk. This is the deletion scope; it is not a patch.

### Deletes entirely

**Vocabulary mode:** `FlashcardsView`, `buildFlashcardDeck`, `FlashcardTerm`, `rescueTermIds`, `languageMissTermIds`, `rescueFocusIds`, `openFocusedVocabRescue`, `clearRescueFocus`, `openVocab`, `getSessionMissedTermIds`, `sessionMissedTermIds`, `reviewFlashcard`, view `"flashcards"`, the nav Vocab button, the Home Vocab utility card, the `vocab` metric, `src/flashcardPass.ts`, `scripts/tests/flashcard-pass.ts`, `loadFlashcardProgress`, `recordFlashcardReview`, `FlashcardProgress`.

**Question scheduling:** `src/reviewSchedule.ts`, `isDueForReview` and its re-export from `storage.ts`, `scheduleReview` in `storage.ts`, the `srsDueAt` / `srsIntervalDays` / `srsEase` / `srsLapses` writes, `dueRecords`, the Home `Spaced review` launcher and `Due review` metric, the Library `Due` pill, the Builder `due` status.

**Language-miss and translation telemetry:** `languageMisses` state, `loadLanguageMisses`, `recordLanguageMiss`, `toggleLanguageMiss`, the `LanguageMiss` type, the *Missed because of the English* control, `translationRevealEvents`, `loadTranslationRevealEvents`, `recordTranslationReveal`, `recordRevealFromContext`, `recordFullReveal`, `RevealTrackingContext` and its provider, `src/translationTelemetry.ts`, `scripts/tests/translation-telemetry.ts`, `TranslationTelemetryPanel`, view `"telemetry"` and its nav button, `normalizeStoredTranslationRevealEvent`.

**Case part telemetry:** `caseAnswerPartEvents` state, `loadCaseAnswerPartEvents`, `recordCaseAnswerPartEvent`, the `CaseAnswerPartEvent` type.

**Related practice:** `buildTargetedReviewPool`, `scoreTargetedReviewCandidate`, `extractTargetedReviewSignals`, `CompletedSessionSignal`, `TargetedReviewSignals`, `relatedPracticePool`, the Summary *Practice related* action. Confirm whether `seedFromString` has another consumer before deleting it.

**Other learner launchers:** Home `Review answered` (`onAnswered`, `answeredRecords` as a launcher source), Builder `incorrect` status.

> **Removing reveal telemetry must not remove reveal behavior.** `recordRevealFromContext` and `recordFullReveal` only call `ctx.recordEvent`; the on-tap and reveal-all interactions are implemented separately. Deleting the recording path leaves Chinese reveal fully intact. Verify this in review, because it is the single most likely accidental regression in the prune.

### Survives

`GlossaryTerm` and authored glossary content; the contextual term affordance in `QuestionCard` (`activeTerm` / `handleTermSelect` and the term popover); Simplified-Chinese term and definition scaffolding; `SpeakButton` pronunciation; `makeRescuePrompt`, `makeCasePartRescuePrompts`, `buildQuestionRescuePromptText` and the Copy-question-for-GPT controls, which are now the intended escape hatch when the glossary is not enough; `answerEvents` for the Dashboard trend; `mulberry32`; `sessionStartGuard` and `createOrderedSessionPersistence`; the whole grading module.

---

## 7. Study selection contract

### The structural fact this must accommodate

`buildWeightedSession` is **strictly tier-ordered** within each category. `progressTier` returns 0 for unseen, 1 for missed-or-due, 2 for settled. The category loop computes `bestTier` and draws only from that tier. **Today, a missed question can never appear in ordinary weighted practice while any unseen question remains in its category.**

The 20% ruling therefore is not a weighting adjustment. It requires a reserved pre-pass ahead of the tier loop, and it changes an invariant the sampler tests currently encode. Implementers should expect `scripts/tests/session-sampler.ts` assertions to need behavioral replacement rather than deletion.

### Definitions

- `N` = requested set size.
- Review pool = records where `needsReview` is true, after content filters, excluding case containers on the weighted path (existing exclusion preserved).
- `R` = reserved review seats = `0` if the toggle is off, the pool is empty, or `N <= 1`; otherwise `min(|reviewPool|, max(1, round(N / 5)))`, round-half-up. N=10 → 2, N=25 → 5, N=50 → 10.

**`R` is a floor, not a ceiling.** It guarantees a minimum injection. It does not cap the number of review questions that may arrive through ordinary tier-1 backfill once a category's unseen supply is exhausted. This is the exact reading of the ruling: guaranteed injection is bounded, ordinary exhaustion is not.

### Order of operations

1. **Apportion.** Run the existing `apportionSeats` over `N`. Unchanged.
2. **Reserve.** Draw `R` review questions, least recently attempted first (`lastSeenAt` ascending, missing first, stable question-ID tie-break). Deduct each selection's category seat. If that category has no remaining seat, borrow from the category with the most remaining seats, reusing the existing visual-floor donor pattern.
3. **Visual floors** (only when `N >= floorMinCount`, currently 40). For each floor kind in priority order, skip the kind if a question already selected in step 2 carries that visual. Otherwise select by the existing minimum-tier rule.
4. **Tier fill.** Run the existing per-category loop for remaining seats, with step-2 selections excluded by ID. Tier order unchanged: unseen, then needs-review, then settled. Review questions reaching the set here are ordinary backfill and are not counted against `R`.
5. Shuffle once for presentation. Unchanged.

### Two corrections to the previous brief

**Nothing needs deleting for ruling 2.** The floor block already computes `bestTier = Math.min(...)`, and tier 0 is unseen, so floors **already prefer unseen over missed**. The behavior ruling 2 rejects existed only in Astra's proposal, never in source. The correct action is to drop the proposal, leaving the floor candidate rule untouched. The only floor change is the step-3 skip when a reserved review question already covers the kind.

**The guaranteed-review-count formula is deleted, not amended.** `min(c, m)` per category is gone. `R` replaces it.

### Open sub-decision: how `R` distributes across categories

Step 2 as written draws `R` globally by recency and lets category borrowing absorb the imbalance, matching the ruling's "global bound" language and reusing proven machinery. The cost: when the backlog is concentrated — twenty misses in Management of Care — up to 20% of the set skews toward that category, distorting blueprint proportions by that amount.

The alternative is distributing `R` across categories by the same NCLEX weights, capped by each category's review availability, with shortfall not redistributed. That preserves blueprint proportions exactly at the cost of sometimes delivering fewer than `R` review questions.

**Recommendation: global with borrowing.** A bounded 20% skew toward the categories the learner is actually missing is defensible, and blueprint proportions matter most in test-like sets rather than ten-question practice runs. This needs an explicit yes, because it is a real product tradeoff and not merely an implementation detail.

### Other sources

| Source | Rule |
|---|---|
| Unweighted / custom ordinary Study | Preserve filters and unweighted character. Apply the same `R` reservation, then unseen, then other answered |
| Practice Needs review | Only currently `needsReview`, available top-level questions, up to `N`, least recently attempted first. No backfill. Whole cases eligible |
| Practice Saved | Only currently `saved`, up to `N`, least recently attempted first. No unsaved additions. Answers affect `needsReview` normally, never `saved` |
| Practice these from Last set | Exactly the live IDs in the selected historical scope, up to the requested count, original set order before shuffle. A one-question action selects exactly that question. Historical misses stay eligible after clearing. Deleted items excluded with a visible note. A case-part action means Practice this case |

Case disclosure: Needs review must count cases visibly ("12 questions and 2 case studies") and offer whole-case practice, since weighted quick practice excludes them. Never count a case as pending while offering no way to address it.

Toggle off excludes `needsReview` questions from ordinary sets entirely, not merely de-weights them. If exclusion yields fewer than `N`, show the smaller count; never silently re-enable.

---

## 8. Completed memory

### Archive eligibility

`Last set` holds exactly one record: the latest completed **primary ordinary Study session**. Implement as an explicit launch-intent value carried on the session, set at construction — not derived from the launching view, since navigation will move.

- `ordinary` → archive-eligible: Home practice, Study all, an ordinary set built through Customize.
- `remediation` → not archive-eligible: Practice Needs review, Practice Saved, any retry from Last set, one-question Library practice, any explicit-population launch.

A remediation set still shows its normal ephemeral completion view, still writes answers, progress, and `needsReview` transitions, and returns on exit to the surface that launched it. It performs no archive write. There is no second slot, pinned origin, chain, or history graph.

Note that `sessionReturnView` already exists in `App.tsx` (currently `"home" | "library"`); extend it rather than adding a parallel mechanism.

### Record contents

| Area | Persist |
|---|---|
| Envelope | Schema version, session ID, startedAt, completedAt, title, end reason, language mode at end |
| Membership | Ordered top-level question IDs, requested and delivered counts |
| Identity | Logical question ID plus content fingerprint per entry |
| Submitted attempt | Typed answer payload as passed to the grader at submit, submission time, language mode at submission, stored full-correct result, earned and possible points, per-part results for cases |
| Unsubmitted entry | Explicit skipped or not-submitted status. A retained draft is labelled *not submitted* and receives no grade |

No question text, choices, rationales, visuals, or assets are stored. `needsReview` and `saved` are live overlays resolved by ID at view time, never frozen into the record.

Capture the answer payload **at submit**, from the value passed to the grader, including initialized ordered-response answers that may not yet have a draft-map entry. A record assembled from draft state at completion can disagree with what was graded.

### Fingerprint

Covers material whose change makes a stored answer unsafe to pair with the live question:

- item type
- response-bearing IDs and structure (option IDs and order, bowtie token IDs, dropdown IDs, matrix row and column IDs, highlight segment IDs, blank IDs)
- bilingual pre-submit stem and prompt content
- bilingual answer-bearing text: choices, rows, columns, tokens, selectable segments, dropdown choices, blanks
- keyed correct and scoring structure
- case stages, exhibits, and mappings supplying answer-relevant context
- structured-measurement data used by the question
- the complete visual input specification needed to deterministically reconstruct the stimulus

Excludes rationale text and rationale visuals, test-taking strategy, glossary teaching text, category/topic/difficulty/provenance, and all post-submit explanatory material. This exclusion is what keeps editorial polish from degrading stored records during ongoing content work.

Normalize before hashing: trim, canonical key order, stable array order except where order is answer-bearing.

**Use a pure-JavaScript hash, not `crypto.subtle`.** The app must run from `file://`, which is not a secure context in several browsers, so WebCrypto is unavailable. A 64-bit FNV-1a or similar over canonical JSON is sufficient; this is change detection, not security. Note `seedFromString` in the sampler is already 32-bit FNV-1a and is too narrow to reuse for this purpose.

### Reopen behavior

- Fingerprint matches: render the live question with the stored answer, stored result, and stored points. Explanations come from live content.
- Fingerprint differs, or the ID is gone: do not pair. Show a per-question notice — *This question has changed since this set* / *No longer in the current question bank* — with the stored outcome and points still readable. Fresh practice uses the current version with a fresh answer.

Degradation is per question, not per set. The immediate post-completion Summary never degrades, since fingerprints match by construction. Historical scores are always stored outcomes; never regrade with a current grader.

Option IDs are structurally load-bearing today but carry no permanent immutability contract. The fingerprint detects both identity drift and answer-content drift, which is why no separate ID-stability guarantee is needed.

If a curated external-image lane is ever introduced, bind historical compatibility to a durable content or asset identity rather than storing rendered output.

### Commit and failure

Submission commits atomically: captured answer, result and points, question progress, and the active-set update, under a unique `(sessionId, topLevelQuestionId)` identity. A retry after an interrupted commit must not double-count. The memory fallback path obeys the same identity rule.

Completion converges on one operation: wait for any in-flight submission, freeze outcomes, then in one durable transaction write the archive, evict the previous record, and clear the matching active record. Never clear the only resumable record before the archive commits.

A set qualifies for archiving when it has at least one submitted top-level result and is finished or explicitly ended, and its launch intent is `ordinary`. Zero-submission exits do not overwrite `Last set`. Unsubmitted questions are excluded from score denominators.

Storage functions must return durable-versus-memory status. On a memory-only result, keep the previous durable archive intact and show: *This set is available for this visit only. It could not be saved on this device.* Offer retry of the same idempotent save. A failed read is never permission to treat storage as empty and overwrite it. Handle blocked database upgrades explicitly rather than waiting behind a false-ready screen.

---

## 9. Bilingual ruling

Ratified semantic:

> `Off` suppresses ambient Chinese scaffolding. It does not prohibit Chinese shown as part of explicit learner-invoked bilingual help. Opening glossary help is an affirmative help request and may display its English and Chinese term and definition regardless of ambient language mode.

This is not an exception to bilingual parity: the glossary help itself remains bilingual, which is what the invariant requires. Ambient mode governs unrequested translation of question content.

Consequence for copy: the glossary affordance must read as help, so that tapping it is an informed act rather than a surprise for a learner who chose Off deliberately.

Unchanged elsewhere: off is English; on-tap reveals Chinese only on request; always shows both with English first. Collapsed stems, choices, cases, and rationales must not take shortcuts around this. Archived language-at-answer metadata is immutable; changing viewing language later does not rewrite it.

---

## 10. Migration

Versioned and idempotent. No blanket progress reset.

**`missed` → `needsReview`.** For a valid progress row with `correctStreak >= 1`, set `needsReview` false even when `missed` is still true: under the verified two-consecutive expression, a positive streak means the most recent attempt was full marks, and the residual true value only reflects the retired second-correct requirement. A missed row with zero streak maps to true. A clear row stays false. Seen, correct, incorrect counters and timestamps are retained. Lifetime incorrect alone never sets the state.

**Ambiguity.** Where fields are missing or contradictory, consult an unambiguous latest top-level answer event only when its timing supports the interpretation. Never infer case-parent success from part events. If the last outcome cannot be established safely, preserve the old boolean and record a migration diagnostic. Never settle ambiguity by array order or lifetime totals.

**Flags → Saved.** Boolean, note, and timestamp intact. A note-only row with `flagged: false` does not become Saved.

**Dropped without migration.** `flashcardProgress`, `languageMisses`, `translationRevealEvents`, `caseAnswerPartEvents`. Not reinterpreted as intent, mastery, or saved terms.

**SRS fields.** Stop reading and writing `srsDueAt`, `srsIntervalDays`, `srsEase`, `srsLapses`. Leave them inert on existing rows.

**Database versioning.** `DB_VERSION` is currently 5. Adding the completed-set store requires 6 regardless, so the obsolete-store cleanup the ruling permits to ride a required upgrade is available here. Do not take it immediately: v6 should add `completedSets` and perform the `needsReview` migration while leaving obsolete stores physically present, so rollback remains possible. Delete them in v7 after migration acceptance.

**Completed history.** Do not reconstruct. Say once: *Detailed set results are available for sets completed after this update. Your previous progress and Saved questions are kept.*

**Active sessions.** Preserve session ID, drafts, outcomes, scores, skip phase, language, adaptive metadata. Legacy active rows lack fingerprints; mark them legacy-unverified rather than claiming current text is original. Missing questions or invalid draft option IDs get an explicit recovery state, never silent deletion or automatic grading.

---

## 11. Copy

| Term | Recommendation |
|---|---|
| Review | Ordinary verb, sparingly. Not a destination |
| Needs review | The one automatic status. 需复习 |
| Saved | Manual intent. 已收藏. Save question / 收藏此题; Remove from Saved / 取消收藏 |
| Last set | Dated. 上次练习. Distinct from resumable work |
| Continue set | Unfinished work only. 继续练习 |
| Try again | On an already-submitted question. 再答一次. Practice this case for containers |
| Revisit missed questions | The Study inclusion control, default on. Helper: "Include questions you have not yet answered fully correctly." 加入需复习的题目 |
| Not fully correct | The historical Summary filter. 未完全答对. Not "Needs review" |
| Your answers | Summary heading. 本次作答 |
| Glossary help | The contextual term affordance. 词汇帮助 |

After partial credit: *2 of 3 points · Needs review.*
After a later full-marks attempt: *Full marks this attempt · Removed from Needs review.*

Never say mastered, retained, due tomorrow, or imply that Saved was also cleared. The clearing message states what happened on one attempt, not what the learner now knows.

---

## 12. Accessibility, mobile, lifecycle

**Completed-set presentation.** Answers and explanations before category, difficulty, and topic reporting. Compact factual header: submitted, full-correct, not-fully-correct, unsubmitted counts, earned and possible points. Remove the score-led hierarchy and the default breakdown grids; statistics live in Progress. Three scopes: Not fully correct, All questions, Saved. Default to the first when nonempty, otherwise All. All includes skipped and unsubmitted entries with explicit labels. A later successful retry does not remove a historical miss from the historical filter.

**Keyboard and focus.** Native named controls. Filters expose selected state; Save exposes pressed state. Selected, correct, and partial-credit states must not rely on colour alone. Preserve the accepted focusable read-only submitted-matrix pattern. Never use an answer-key preview flag that marks an actual missed response correct — `reviewMode` in `QuestionCard` means answer-key preview and must not be reused for historical display. Removing a Saved row moves focus to the next surviving row, else previous, else the empty-state heading. Expansion and case navigation use stable IDs, not list indexes. Replacement keeps safe initial Keep focus, Escape cancellation, and restoration to the initiating control.

**What deletion resolves.** Segmented-control pressed state and empty-pass reactivity on the Vocab scope controls, Rescue focus handling, and the vocabulary detour return path all disappear with the mode. Do not spend effort repairing them. Pressed-state semantics still apply to surviving segmented controls: the Home count toggle, Summary scopes, and text-size selector.

**Detour context.** With Vocabulary gone, glossary help is in place inside the question. There is no navigation away and therefore no return descriptor, no persisted detour state, and no set/part/filter/scroll anchor to restore. This is one of the larger simplifications available in the prune and should be taken in full.

**Mobile and transport.** Verify 390 × 844 and a genuine desktop width, both themes, 100/125/150/200% text sizes. Practical touch targets, visible labels, readable bilingual wrapping, no page-level horizontal overflow, sticky controls that do not cover explanations. Test the built `file://` app as well as HTTP, with durable IndexedDB, denied storage, failed writes, and blocked upgrades. A memory-only pass is not evidence of reload durability.

---

## 13. Defect ledger

| Finding | Status | Treatment |
|---|---|---|
| Repeated-submit race | **Verified as structurally reachable this session; not executed.** `submitCurrent` guards on `session.results` from a stale closure, then awaits `recordAnswer` before the guarded `setSession` runs. The Submit control is gated on `readyToSubmit` and on `submitted`, which derives from post-await state. There is no in-flight lock comparable to `reviewPendingRef` in `FlashcardsView`. `recordAnswer` performs an unlocked read-modify-write on progress | Reproduce under delayed storage, then size the atomicity work. Expected damage is **duplicate `answerEvents` guaranteed**, plus progress that is either a lost update or a double count depending on interleave. The reproduction should assert on event count, not only on progress totals |
| Persistence fallback is invisible | **Verified.** Every storage catch block swallows the error; no save function returns a durable-versus-memory signal | Independent observability fix. Prerequisite for promising a durable Last set |
| Collapsed Summary stems reveal Chinese in on-tap mode | Carried from Astra, not re-verified here | Independent bilingual fix, ahead of the redesign |
| Stale due memoization | Verified but moot | Deleted with question scheduling. Do not build a replacement ticking system |

Credit where due: `recordAnswer` reads progress from IndexedDB rather than React state, so it is already resilient to stale component state. Preserve that property when adding the commit identity.

Not reproduced: answer edits during an asynchronous submit; focus loss when removing a row from the current Saved filter.

---

## 14. Implementation sequence

**A — Baseline.** Pin the worktree. Reproduce or falsify the submit race under delayed storage before freezing atomicity scope. Fix the collapsed-stem on-tap defect separately. Add fixtures for partial credit, whole-case clearing, all state combinations, and legacy one-correct rows. **Do not write changed-content fixtures yet** — they depend on the fingerprint semantics landing in C and D.

**B — Subtract.** Remove Home `Review answered`, `Spaced review`, the `Due review` and `Vocab terms` metrics, question Due badges, Builder `due` and `incorrect`, `Practice related`, the Vocab nav entry and `FlashcardsView`, the Telemetry view and panel, the *Missed because of the English* control, and their unreachable plumbing. Keep a working path to current weaknesses until its replacement exists. Do not yet delete shared functions, stores, or legacy fields. Do not publish one-correct copy while the two-correct expression still runs.

**C — Trustworthy answer state.** Add submission locking and idempotent commit identity, captured answer payloads, and durable-versus-memory reporting. Migrate to binary `needsReview` and rename Saved. Stop question scheduling. Delete `reviewSchedule.ts`, `scheduleReview`, `flashcardPass.ts`, `translationTelemetry.ts`, and the `languageMisses` / `translationRevealEvents` / `caseAnswerPartEvents` / `flashcardProgress` read and write paths. Verify that Chinese reveal still works after telemetry removal.

**D — Completed memory.** Add the fingerprint function and its normalization, the `completedSets` store at `DB_VERSION` 6, transactional completion, archive-eligibility by launch intent, and the shared completed viewer. Now write the changed and deleted content fixtures. Test crash and reload between submit, archive, and active clear.

**E — Selection and journeys.** Implement the `R` reservation, the floor skip, the explicit Needs review / Saved / from-Last-set sources through the existing guard, Home's Last set entry, the simplified Summary, and remediation return targets.

**F — Cleanup after acceptance.** Delete inert SRS fields and obsolete object stores at `DB_VERSION` 7. Replace retired source-shape assertions with behavioral ones rather than deleting them to make the suite green.

### Release gates

Typecheck, census check, build, diff check, real browser and `file://` smoke. Focused grading, session-navigation, session-start-guard, and sampler checks. The flashcard-pass and translation-telemetry checks are deleted with their features, not skipped.

New acceptance must cover: every `needsReview` and `saved` transition; partial credit and whole-case clearing; duplicate submit and finish under delayed I/O; no state change from inspection, reveal, or glossary help; the exact `R` guarantee at N = 10, 25, 50 with varying backlog sizes and with the toggle off; category apportionment and visual floors preserved under reservation; no duplicates or backfill in explicit populations; remediation sets not overwriting Last set; fingerprint match, mismatch, and deleted-ID paths; legacy migration ambiguity; storage failure without loss of the previous durable record; and keyboard, mobile, and large-text behavior.

---

## 15. Remaining owner decisions

Three, all small, none blocking the subtraction stages.

1. **Category distribution of `R`** (§7). Global with borrowing, recommended, versus weight-proportional with no redistribution. Affects blueprint fidelity under concentrated backlog.
2. **`R` at very small `N`.** The contract above sets `R = 0` for `N = 1` and `R >= 1` for `N >= 2`. Confirm that a two-question set containing one review question is acceptable, or raise the threshold.
3. **`seedFromString`.** Delete with related practice if it has no other consumer, or retain. Trivial, but it should be an explicit call rather than an oversight.

Everything else in this brief is settled by the frozen decisions in §2.

---

## 16. If we only do three things

1. **Replace question scheduling with binary `needsReview`, and reserve a bounded minority of ordinary Study seats for it.** Remediation happens passively, without the learner opening anything.
2. **Persist one small fingerprinted completed record.** Actual answers and points survive navigation and reload, degrading per question rather than pairing an old answer with changed content.
3. **Delete Vocabulary, Rescue, language-miss marking, and reveal telemetry outright.** Keep glossary help in the question and Copy-for-GPT as the escape hatch.

The result is Study with memory, not Study plus two more applications.
