# Translate-All Reveal — Fix-Up Spec (post-implementation review)

Author: Claude (architect). Target: Codex. Follows `translate-all-reveal-codex-spec.md`.
Companion: `default-session-mode-repoint-codex-spec.md` (read that one too; it changes which
mode the default splash button fires, and this spec assumes it lands).

Surface: `src/App.tsx`, `src/styles.css`, `src/types.ts`, `src/translationTelemetry.ts`,
`scripts/tests/translation-telemetry.ts`.

Context: **the baseline commit hashes in earlier drafts of this spec are stale.** Codex verified
that `1bde3c3` touched only structured-measurement handoff/artifact/history files, so the
telemetry and UI changes were **not** swept into it. `main` has since moved (it was `974b054`
during review and `03a66e1` at last read). The translate-all feature has already landed on
`main` — see the "Translate-All Post-Submit Reveal (Jul 8)" milestone in `PROJECT-HISTORY.md`.

**Read HEAD live. Do not trust any commit hash written in this document.** `pages.yml` deploys
by checking out pushed `main` and running `npm run build`; local `dist/` is never uploaded.

Ratified by Luke:
- Translate-all should be visible in as many environments as possible. A stricter
  exam-simulator environment may selectively disable it later.
- Default language mode stays **`on-tap`**, not `always`. `always` renders every reveal event
  impossible and would silently kill the translation instrument.
- Bowtie per-choice markers use zone-scoped labels (`S1`, `A2`, `P3`).

## 0. Pre-flight (do this first, report before changing code)

- `git status --short` and `git log --oneline -1`. Work from live HEAD, not from hashes in this
  spec.
- **Several Part A items have already landed.** Placement (A1b), the `.translate-all-action`
  style (A6), the panel `fullRevealCount` row (A7), and the `revealedBlocks` skip (A5) are
  reported present in current code. Verify each and **no-op** where already satisfied; do not
  re-implement or churn the diff. The remaining substantive work is: the repoint (separate
  spec), the dead-gate deletion (A1), the `hasQuestionLevelZh` rationale/strategy/glossary
  fallback (A1a), unconditional live-session recorder threading (A3), and the optional
  `sessionMode` / `languageModeAtReveal` fields (A4).
- Do **not** commit to or push `main`. Stage on branch `codex/translate-all-reveal` and stop.
  Promotion to `main` is the architect gate, not Codex's call (DECISIONS.md).

---

# Part A — Translate-all

## A1. Remove the dead gate

In `QuestionCard` (`src/App.tsx`, ~line 3145):

```ts
const showTranslateAll =
  submitted &&
  languageMode === "on-tap" &&
  questionHasZh &&
  !fullRevealed &&
  Boolean(revealTrackingContext);   // <-- dead: the useMemo never returns null
```

`revealTrackingContext` always returns an object, so `Boolean(...)` is always `true`. The gate
does nothing. Its author clearly intended "live Study only", which is now explicitly **not**
what we want. Replace with:

```ts
const showTranslateAll =
  submitted &&
  languageMode === "on-tap" &&
  questionHasZh &&
  !fullRevealed;
```

This is a **pure deletion of the dead clause**. Nothing else in the predicate moves.

**Do not add a `case_study` exclusion.** An earlier draft of this spec called for
`question.itemType !== "case_study"`. That was written against a stale assumption that "reveal
all" is ambiguous on a multi-part case. The shipped implementation already resolved the
ambiguity — the broadcast reaches whatever consumers are currently mounted, i.e. "all Chinese on
this rendered surface" — and `PROJECT-HISTORY.md` records the case-study extension as completed
and browser-smoke-verified. Adding the exclusion would delete documented, verified behavior.
The exclusion is **withdrawn**.

Consequences (intended): the button renders post-submit wherever `languageMode` is `on-tap` —
Study (incl. the repointed default splash session), Adaptive, the session Summary Review, the
Preview Lab, and rendered case-study surfaces. Never pre-submit, never in `always` (ZH already
on screen), never in `off` (nothing would be revealed — see A2).

`on-tap` is required, not merely preferred: `BilingualText` computes
`showZh = hasZh && (mode === "always" || (mode === "on-tap" && revealed))`, so in `off` the
broadcast would set `revealed` and still paint nothing. A visible button that does nothing is
worse than no button.

Do **not** change the `revealTrackingContext` memo to return `null` — other consumers read
`revealAllSignal` off it via `?? 0`, and `recordEvent` is already correctly gated on `sessionId`.

### A1a. `questionHasZh` — narrow extension only

`hasQuestionLevelZh` already covers every item type (stem, options, `fill_in_blank` blank
prompts, `matrix` rows **and** columns, `dropdown_cloze` cloze stem + dropdown options,
`highlight` segments, `bowtie` zone prompts + tokens, with `case_study` recursion). **Do not
rewrite it.** A GPT spec review proposed broadening it; rejected as already satisfied.

One gap is real: the predicate does not consider `rationale`, `testTakingStrategy`, or
`glossary`. Since translate-all reveals those blocks, an item with an untranslated stem but a
translated rationale would hide a button that has work to do. Add them as a final fallback
clause. Defensive — `TextPair.zh` is required, so `hasZhPair(question.stem)` short-circuits in
practice — and it must not disturb the existing early returns.

### A1b. Placement (verify, do not regress)

Already shipped per `PROJECT-HISTORY.md`. Restated so a rebase or rewrite cannot silently drop
it. In `QuestionCard`'s `answerBody`, render in this order:

1. answer banner
2. `language-miss-action`
3. **`<TranslateAllButton />`**
4. `<RationalePanel />`
5. **`{submitted && rescuePrompt && <GptRescueButton />}`**

Translate-all is a reading toggle and belongs at the reading entry point, so the learner turns
Chinese on and reads straight down through a revealed rationale. GPT rescue is an escalation
CTA and belongs below the rationale, because escalating only makes sense after the authored
rationale has been read and found insufficient.

Both must stay **inside `answerBody`**, within the `RevealTrackingContext.Provider`
(`trackedAnswerBody`). Do not move either to the section-level `session-actions` footer — that
is outside the provider and reveal recording would break. No shared wrapper row; each is its
own element. `GptRescueButton`'s render condition (`submitted && rescuePrompt`) is unchanged.

## A2. [DEFERRED — do not implement]

Originally: make `revealed` override `off` in the three on-tap consumers, so translate-all
becomes the sole ZH path in an EN-only session.

Deferred. Its only motivating case was Test mode's forced `languageMode: "off"`, and the
default splash no longer fires Test (see the repoint spec). Shipping a display-contract change
with no live driver is not worth the risk. Revisit alongside the exam-simulator spec, where the
question "should a strict environment still permit a post-submit full reveal?" is the real
decision.

## A3. Thread the recorder through all live session modes

`recordFullReveal` and `recordRevealFromContext` early-return when `ctx.sessionId` is absent,
and `QuestionCard` currently receives:

```tsx
allowLanguageMissToggle={session.mode === "study"}
sessionId={session.mode === "study" ? session.id : undefined}
onTranslationReveal={session.mode === "study" ? onTranslationReveal : undefined}
```

Pass the last two unconditionally from the live session view (`src/App.tsx` ~line 2965–2972):

```tsx
sessionId={session.id}
onTranslationReveal={onTranslationReveal}
```

Leave `allowLanguageMissToggle` alone — the repoint spec handles it.

Safety of this widening:
- `summarizeTranslationFriction` filters `enrichedRows` through
  `isTranslationRevealEligible(sessionMode, languageModeAtAnswer)` = `study && on-tap`.
  Adaptive and Test attempts remain excluded from friction buckets, audit candidates, and the
  fade trend. **No friction behavior changes.**
- Test sessions still force `languageMode: "off"`, and no reveal can fire in `off`, so
  threading `sessionId` there is a no-op today. It is correct-by-construction rather than
  correct-by-accident.
- Only the raw `summarizeTranslationRevealEvents` totals grow, to include Adaptive. Intended.

Summary Review and Preview Lab have no session; the button stays visible there and records
nothing. That is now **intentional**. Add a one-line comment at `recordFullReveal`'s `sessionId`
guard saying so.

## A4. Event contract: make reveals splittable by mode

Add two **optional, additive** fields to `TranslationRevealEvent` (`src/types.ts`):

```ts
sessionMode?: SessionMode;
languageModeAtReveal?: LanguageMode;
```

Populate both in `recordRevealFromContext` and `recordFullReveal` from new
`RevealTrackingContextValue` fields (`sessionMode`, `languageMode`), threaded from
`QuestionCard` props. Older rows lack them → `undefined`.

**No `DB_VERSION` bump.** `translationRevealEvents` is an id-keyed store written with a
whole-object `put`; optional value fields need no migration. Raw JSON export shape is
backward-safe; no `exportFormatVersion` bump.

## A5. `revealedBlocks` contamination

In `aggregateReveals` (`src/translationTelemetry.ts`), `firstSeenByBlock` iterates **all**
matching events, so a full reveal injects `"other"` into `revealedBlocks` on the enriched row.
`"other"` there is meaningless; `fullRevealCount` already carries the signal. Skip full reveals
in that derivation only:

```ts
for (const event of matchingRevealEvents) {
  if (event.fullQuestionReveal) continue;
  if (!firstSeenByBlock.has(event.block)) firstSeenByBlock.set(event.block, event);
}
```

Leave `matchingRevealEvents` and `elapsed_time_ms` as-is (raw join). `preSubmitEvents` already
correctly excludes `fullQuestionReveal`.

## A6. Missing style rule

`TranslateAllButton` renders `className="language-miss-action translate-all-action"` but
`.translate-all-action` has no rule in `src/styles.css`; it silently inherits the Vocab Rescue
box. Add a subdued rule beside `.language-miss-action` so a reading toggle reads differently
from a scoring affordance. No accent border, no `prominent` treatment — it must not compete
with `.gpt-rescue-action.prominent` below the rationale.

## A7. Panel

Dev `TranslationTelemetryPanel`: `fullRevealCount` stat row next to "Total reveals".

---

# Part B — Per-choice rationale rendering (separate commit)

Independent surface. **Commit separately from Part A.**

## B1. Raw internal refIds are leaking to the learner

`RationalePanel` (`src/App.tsx`, ~line 4650) builds:

```ts
const optionIndexById = new Map<string, number>(
  ("options" in question ? question.options : []).map((o, i) => [o.id, i] as const),
);
```

then renders `optionIndexById.has(choice.refId) ? optionMarker(...) : choice.refId`.

Bowtie has no `options` — its tokens live under `bowtie.condition|actions|parameters` — so the
map is empty and the raw refId prints: `c_valid_dnr_arrest`, `a_honor_order`, `p_last_meal`.
This affects every item type without `options`: `bowtie`, `matrix`, `dropdown_cloze`,
`highlight`, `fill_in_blank`.

Replace with `buildChoiceMarkerMap(question): Map<string, string>` resolving refId → marker:

- `multiple_choice` / `select_all` / `ordered_response`: unchanged, `optionMarker(index)` → `A`, `B`, …
- `bowtie`: **zone-scoped markers.** Zone letter from a fixed map
  `{ condition: "S", actions: "A", parameters: "P" }` — matching the headings the learner sees
  ("Situation to recognize" / "Actions to take" / "Parameters to assess/document") — plus a
  1-based index over `zone.tokens` order → `S1`, `A2`, `P3`.
- `dropdown_cloze`: `D{dropdownIndex+1}` — **dropdown-level, not option-level.**
  `NCLEX-Question-Schema.md` specifies `byChoice[].refId` → `dropdownId` for this type, and
  canonical banks use ids like `"1"`, `"2"`. Rationales are authored one-per-dropdown. Do **not**
  introduce an option-level `D{n}.{m}` marker; that would require a schema and content change.
- `matrix`: `R{rowIndex+1}` (refId → `rowId`).
- `highlight`: `H{n}`, indexed over **selectable** segments in passage order (refId → selectable
  `segmentId`; static segments are never keyed, so raw segment index would misnumber).
- `fill_in_blank`: `B{blankIndex+1}` (refId → `blankId`).

**Hard rule: never render a raw refId.** If a refId does not resolve, render **no marker** and
let the rationale text occupy the full width. An internal ID must never reach the learner.

## B2. The overlap is a CSS grid overflow

`.choice-rationales div` is `grid-template-columns: 2rem minmax(0, 1fr)` — 2rem was sized for a
single letter. An 18-character refId cannot wrap into it, overflows column 1, and paints on top
of the rationale text in column 2. That is the `c_validC_odrnrerc_at.rTrehset` artifact: the
refId and `Correct. The` occupying the same pixels. Real overlap, not a PDF artifact.

- `grid-template-columns: minmax(2rem, max-content) minmax(0, 1fr)`
- add `overflow-wrap: anywhere` to the marker cell
- delete `.choice-rationales strong { grid-row: span 2; }` — dead, there is only one row
- when there is no marker (B1 fallback), render a single-column row

## B3. Bowtie post-submit duplication

Post-submit, each token renders up to three times: in its filled slot, again as a disabled pool
token, and again in the `bowtie-key` "Correct:" list. The pool has no function after grading.

**Do not hide it with CSS.** Conditionally skip rendering `.bowtie-token-pool` entirely when
`submitted` is true. A CSS-hidden pool leaves a dozen disabled buttons in the accessibility
tree and the tab order, and a global `.bowtie-token-pool { display: none }` under any
submitted-like ancestor would fire in contexts we did not intend. Slots and the `bowtie-key`
list remain. (GPT review asked for a submitted-state class; conditional render is the stronger
form of the same fix.)

---

## Tests

`scripts/tests/translation-telemetry.ts`:
- `fullQuestionReveal: true` event does **not** appear in the enriched row's `revealedBlocks`.
- Retained: `fullRevealCount` increments; excluded from `byBlock`; excluded from
  `hadRevealBeforeSubmit` / `revealBeforeSubmitCount`; determinism preserved.
- New: a reveal event carrying `sessionMode: "adaptive"` joins an ineligible attempt and is
  absent from `enrichedRows` and `auditCandidates`, while still counting in `totalCount` /
  `fullRevealCount`.

## Verification

- `npm run test:translation-telemetry`
- `npx tsc -b --pretty false`
- `npm run validate-bank -- banks/*.json` (pages.yml runs it; failure blocks deploy)
- `npm run build`
- Browser smoke:
  - **Study / on-tap / standalone, post-submit:** button above rationale; GPT rescue below it,
    missed items only; one click reveals stem + choices + rationale; button disappears; exactly
    **one** `translationRevealEvent` with `fullQuestionReveal: true`, `sessionMode: "study"`,
    `languageModeAtReveal: "on-tap"`.
  - **`always` and `off`:** no button, any mode.
  - **Summary Review / Preview Lab (on-tap):** button visible, reveals correctly, records nothing.
  - **Case study (post-submit, on-tap):** button present on the rendered surface; one click
    reveals the rendered parts' Chinese and removes their per-block `需要中文` controls. This is
    existing shipped behavior — confirm it did **not** regress.
  - **Bowtie rationale:** markers read `S1`/`A2`/`P3`; no raw refIds anywhere; no overlapping
    text; token pool absent from the DOM after submit (not merely invisible).
  - **Unresolved-refId fallback:** force one `byChoice` entry whose `refId` matches no token,
    option, row, dropdown, blank, or selectable segment. Confirm no raw ID appears, no empty
    marker column is reserved, and the rationale text spans the full row.

## Handoff

Two commits on `codex/translate-all-reveal`:
1. Part A (App.tsx, types.ts, translationTelemetry.ts, styles.css, tests).
2. Part B (App.tsx `RationalePanel`, styles.css).

Report `git status --short` (clean) and the §0 pre-flight findings. Stop. Do not merge or push
`main`.

## Non-goals

- No pre-submit translate-all variant.
- No A2 (`revealed` overriding `off`).
- No `case_study` exclusion — withdrawn; the shipped case-study behavior stays.
- No option-level `dropdown_cloze` rationale markers, and no schema/content change to support them.
- No removal of the Test-mode `"off"` language force.
- No `scoreTargetedReviewCandidate` / `buildTargetedReviewPool` change.
- No `DB_VERSION` bump.
- No exam-simulator strict-mode feature (future, separate).
