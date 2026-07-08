# Translate-All Reveal + Post-Question Action Layout — Codex Spec

Author: Claude (architect). Target: Codex implementation. Surface: `src/App.tsx`,
`src/types.ts`, `src/translationTelemetry.ts`, `scripts/tests/translation-telemetry.ts`.
No canonical-bank, NCLEX-schema, or grading changes.

## Motivation

Observed real study behavior: the learner answers in English, then reveals the Chinese
**after submitting** (even when correct) to read the item for context. Today that means
tapping each per-block "需要中文" button one at a time, and each tap lands as a separate
`TranslationRevealEvent` (block `stem`/`choices`/…, `submittedBeforeReveal: true`). Those
post-submit reveals are a *scatter* that `summarizeTranslationFriction` discards (it keys
entirely on `submittedBeforeReveal === false`), so her dominant usage is invisible to the
analytic.

Two coupled changes:
1. **Layout:** place the two after-question actions by role — a reading toggle above the
   rationale, an escalation action below it.
2. **Feature:** add a post-submit one-tap "translate all" control that reveals every
   remaining on-tap-hidden Chinese block on the submitted surface (including the rationale)
   and records exactly one `fullQuestionReveal` event — a clean, first-class *post-answer
   comprehension* signal, distinct from pre-submit friction.

## Decisions (fixed)

- **Post-submit only.** The button never appears before submit. This keeps the pre-submit
  per-block friction signal uncontaminated — a bulk pre-submit reveal would collapse a whole
  attempt's friction into one event and muddy exactly what V1.2b measures. No pre-submit
  variant in this spec.
- **Role-based placement, not co-located.** Translate-all is a *display/reading toggle* and
  belongs at the reading entry point — above the rationale, so the learner flips translation
  on and reads straight down through a now-revealed rationale. GPT rescue is an *escalation
  CTA* and belongs below the rationale, because escalating to GPT only makes sense after the
  primary rationale has been read and found insufficient. (This is why the earlier
  "GPT button in the middle" objection does not apply to translate-all in the same slot: the
  objection was to an escalation CTA interrupting the answer→rationale flow, not to a reading
  toggle there.)
- **Translate-all reveals the rationale too.** Decided (it is the point of placing the button
  before the rationale), not optional. The reveal reaches the rationale via the shared context
  broadcast (below), so button-above / rationale-below works with no DOM adjacency required.
- **One intent = one event.** A translate-all tap records a *single* event with
  `fullQuestionReveal: true`. The child blocks it auto-reveals must **not** each emit their
  own per-block event, and `revealCountForQuestion` is bumped once, not per hidden block.
- **Scope v1 = standalone questions only.** `case_study` translate-all is deferred (the
  split chart/work + multi-part layout makes "all" ambiguous — current part? all parts?).
  Per-block reveals inside cases are unchanged. Extend later if the signal proves useful.
- **Stays out of scoring.** Do **not** wire `fullQuestionReveal` into
  `scoreTargetedReviewCandidate` / `buildTargetedReviewPool`. This is the *instrument* for
  the post-answer comprehension axis; folding it into targeted review waits on data, per the
  standing "Translation telemetry — scoring decision deferred" thread in `DECISIONS.md`.

## Change 1 — Post-question action layout

In `QuestionCard`'s `answerBody` (App.tsx, currently ~line 3110–3210), the post-submit tail
currently renders: answer-banner → language-miss-action →
`{submitted && rescuePrompt && <GptRescueButton …/>}` → `<RationalePanel …/>`.

Change to: answer-banner → language-miss-action → **`<TranslateAllButton …/>`** →
`<RationalePanel …/>` → **`{submitted && rescuePrompt && <GptRescueButton prompt={rescuePrompt} />}`**.

So:
- `TranslateAllButton` (new) renders immediately **before** `RationalePanel` (after answer
  feedback / language-miss). Visibility predicate in §2b.
- `GptRescueButton` moves to **after** `RationalePanel`. Its render condition is unchanged —
  still `submitted && rescuePrompt` (missed standalone only); only its position moves. The
  `casePartRescuePrompts` path inside `QuestionAnswerControl` is untouched.
- No shared wrapper row; each button is its own element (own container/className).

Constraints:
- Both buttons **must stay inside `answerBody`** so they remain within the
  `RevealTrackingContext.Provider` (`trackedAnswerBody`). Do **not** move either to the
  section-level `session-actions` footer — that is outside the provider and reveal recording
  would break.
- `language-miss-action` stays where it is (after the banner). Translate-all sits between it
  and the rationale — closest to the content it gates.

## Change 2 — Translate-all behavior + telemetry

### 2a. Reveal broadcast

The per-block reveal consumers own local `revealed` state. Translate-all must flip all of them
without lifting every reveal into global state. Use a minimal broadcast:

- Add `revealAllSignal: number` to `RevealTrackingContextValue` (a monotonic counter held in
  `QuestionCard` state, included in the memoized context value).
- Each on-tap consumer watches `revealAllSignal` via the context. When it increments, if
  `mode === "on-tap" && !revealed && hasZh`, set `revealed = true` **without** calling
  `recordRevealFromContext` (no per-block event — the aggregate event is recorded once by the
  button). Guard with a last-seen-signal ref so it fires once per increment and can't loop.
- Consumers to wire: `BilingualText` (this alone covers stem, choices, exhibit, case_stage,
  **and all RationalePanel reveals** — rationale.correct, per-choice rationale,
  testTakingStrategy `block="rationale"`, and glossary `block="glossary"` all render through
  `BilingualText`), the highlight answer panel, and `DropdownClozeControl`. Because RationalePanel
  reveals go through `BilingualText`, wiring `BilingualText` is what makes translate-all reveal
  the rationale — no separate RationalePanel plumbing, and DOM position of the button relative
  to the rationale is irrelevant.
- Consumers without the context (no `sessionId`/recorder) never receive a bump — fine,
  translate-all only renders in live Study where the provider exists.

### 2b. The button

`TranslateAllButton`, rendered before `RationalePanel`:

- **Visibility:** `submitted && languageMode === "on-tap" && questionHasZh && !fullRevealed`.
  - `questionHasZh`: conservative — true if `question.stem.zh` is non-empty OR any option/
    choice carries `zh`. Compute at `QuestionCard` and pass down (or hoist into the button).
  - `fullRevealed`: local one-shot `QuestionCard` state, set on click so the button
    disappears after use. Reset on question change (the existing `key={question.id}` remount
    already handles this if the state lives in `QuestionCard`).
  - Hidden entirely in `languageMode` `"always"` (already shown) and `"off"` (no ZH), and
    pre-submit.
- **onClick (in order):**
  1. Record exactly one event via a new `recordFullReveal(ctx)` helper (sibling to
     `recordRevealFromContext`): emits `{ block: "other", fullQuestionReveal: true,
     answeredBeforeReveal: ctx.answeredBeforeReveal, submittedBeforeReveal: ctx.submitted
     (=true post-submit), elapsedMsOnQuestion, revealCountForQuestion: ++ctx.revealCountRef }`.
     Increment `revealCountRef` once.
  2. Bump `revealAllSignal` so children reveal.
  3. Set `fullRevealed = true`.
- **Reveal scope:** everything still hidden on the submitted surface — stem, choices,
  exhibit/case_stage, **and** the rationale/strategy/glossary blocks. All are `BilingualText`
  consumers of the same signal, so one bump covers them at zero extra cost.
- **Copy:** bilingual, matching the `language-miss-action` style, e.g.
  `Show full Chinese / 显示完整中文`.

### 2c. Type + storage

- `src/types.ts`: add optional `fullQuestionReveal?: boolean` to `TranslationRevealEvent`.
- `src/storage.ts`: **no `DB_VERSION` bump.** `translationRevealEvents` is an id-keyed object
  store written with whole-object `put`; an added optional value field needs no migration.
  Older rows lack the field → read as `undefined` → treated as non-full. `recordTranslationReveal`
  passes the object through unchanged.

### 2d. Telemetry surfacing

- `src/translationTelemetry.ts`:
  - `summarizeTranslationRevealEvents`: add `fullRevealCount` (count of events with
    `fullQuestionReveal === true`) to `TranslationTelemetrySummary`, and **exclude**
    `fullQuestionReveal` events from the `byBlock` breakdown (they are not a per-block signal;
    they'd otherwise inflate `other`). Keep them in `totalCount`, `sessionCount`, and the
    category/topic aggregates. Add the field to the summary type.
  - `summarizeTranslationFriction`: **no behavior change required** — full reveals are
    post-submit, so `submittedBeforeReveal === true` already excludes them from
    `hadRevealBeforeSubmit`, the friction buckets, and audit-candidate scoring. Add a short
    comment (and a test, below) documenting that full reveals must never enter pre-submit
    buckets, so a future pre-submit variant can't silently regress this.
- Dev `TranslationTelemetryPanel` (App.tsx, ~2273–2420): add a `fullRevealCount` stat row
  next to "Total reveals". Raw JSON export is unchanged in shape — the new field rides along
  on each event automatically; no `exportFormatVersion` bump needed (additive, backward-safe).

## Tests

Extend `scripts/tests/translation-telemetry.ts` (`npm run test:translation-telemetry`):
- A `fullQuestionReveal: true, submittedBeforeReveal: true` event: (a) increments
  `fullRevealCount`; (b) does **not** appear in `byBlock`; (c) is **excluded** from
  `summarizeTranslationFriction` pre-submit buckets (`hadRevealBeforeSubmit` false for its
  attempt; not counted in `revealBeforeSubmitCount`); (d) determinism preserved.

## Verification

- `npm run test:translation-telemetry`
- `npx tsc -b --pretty false`
- `npm run build` (existing Vite chunk-size warning expected)
- Browser smoke (if available): live Study, on-tap, standalone item —
  - post-submit: translate-all appears **above** the rationale (after answer feedback);
    GPT rescue appears **below** the rationale, and only when the item was missed;
  - one click on translate-all reveals all hidden ZH blocks — stem, choices, **and the
    rationale below it** — the button disappears, and exactly **one** `translationRevealEvent`
    with `fullQuestionReveal: true` is recorded (per-block auto-reveals emit no events);
  - a **correct** item shows translate-all (above rationale) with no rescue;
  - `languageMode` `always`/`off` and any pre-submit state hide translate-all.

## Non-goals / guardrails

- No pre-submit translate-all variant.
- No `case_study` translate-all (v1).
- No `scoreTargetedReviewCandidate` / `buildTargetedReviewPool` change.
- Do **not** lift all per-block reveal state into a global store; use the `revealAllSignal`
  broadcast. Auto-revealed children must not emit per-block events.
- No canonical-bank or NCLEX-schema changes; `TranslationRevealEvent` is local IndexedDB
  telemetry, not bank schema.
