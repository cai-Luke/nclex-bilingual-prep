# Default Session Mode Repoint — Codex Spec

Author: Claude (architect). Target: Codex. Companion to
`translate-all-reveal-fixup-codex-spec.md` (land this one **first**; the fixup spec assumes it).

Surface: `src/App.tsx` only. No schema, bank, grading, or telemetry-contract changes.

**Baseline: work from live HEAD.** Commit hashes in these specs are stale — `main` was
`1bde3c3` when the fixup spec was drafted, `974b054` at GPT review, and `03a66e1` at last read.
Codex confirmed `1bde3c3` touched only structured-measurement handoff/artifact/history files, so
no telemetry or UI change was swept into it. Do not rewrite history. Line numbers below are
approximate; verify against the file.

**Do not commit to or push `main`.** Stage on `codex/default-session-mode-repoint` and stop.
Promotion is the architect gate, not Codex's call (DECISIONS.md).

## Motivation

The home splash fires a **Test** session:

```tsx
onTest={(count) => startSession(allRecords, "test", `Test · ${count} questions`, { count, weighting: "nclex" })}
```

It is the recommended, zero-configuration entry point: NCLEX-weighted, 50 questions, no
selections required. It is, in practice, the casual study mode.

But `mode === "test"` differs from `"study"` in five places, and **not** in the one place the
name implies:

| Behavior | `study` | `test` |
|---|---|---|
| `languageMode` at creation (~509) | `settings.languageMode` | forced `"off"` |
| `allowLanguageMissToggle` (~2965) | `true` | `false` → Vocab Rescue never populates |
| `sessionId` / `onTranslationReveal` (~2971–2972) | passed | `undefined` → **zero reveal telemetry** |
| Skip + skipped-review phase (~2986, 5319, 5324) | yes | no |
| `isLast` computation (~2927) | pending/skipped aware | index-based |
| **Answer + rationale shown immediately after submit** | **yes** | **yes** |

Test mode does not hide the answer, the rationale, the per-choice breakdown, or the score. It is
not an exam simulator. It is Study with every instrument switched off.

Worse: `isTranslationRevealEligible(sessionMode, languageModeAtAnswer)` is
`study && on-tap` — the ratified gate on the entire translation-friction analytic. **The default
splash button fires the one mode that gate excludes.** Reveal telemetry, the friction analytic,
and Vocab Rescue have all been dark on the learner's primary path.

The fix is to repoint the splash at the mode that already has the semantics we want, not to
patch Test's language default. `mode: "test"` is retained, untouched, as the seed for a future
exam-simulator feature.

## Decisions (fixed, ratified by Luke)

- The default splash session becomes `mode: "study"`, keeping `{ count, weighting: "nclex" }`.
- Skip / skipped-review comes along with it and is **wanted** in a casual study set.
- Default language mode is `settings.languageMode` (ships as `on-tap`). **Not** `always` —
  in `always` nothing is ever hidden, so no reveal event can fire and the instrument dies.
- `isTranslationRevealEligible` is **not** touched. It stays `study && on-tap` exactly as
  ratified. This repoint is precisely what makes that gate meaningful again.
- `mode: "test"` remains in the codebase, reachable from the custom/builder screen, with its
  `"off"` force intact. It is a placeholder pending the exam-simulator spec.

## Change

`src/App.tsx`, home splash handler (~line 854):

```tsx
onTest={(count) =>
  startSession(allRecords, "study", `Practice · ${count} questions`, { count, weighting: "nclex" })
}
```

`startSession` applies `weighting: "nclex"` before the mode branch, so blueprint weighting is
mode-agnostic and carries over unchanged. Verify this by reading `startSession` (~line 477)
rather than assuming.

Copy on the launcher (`HomeView`, ~line 1090–1108) should stop calling it a test:

- button label: `Start test · {n} questions` → `Start practice · {n} questions`
- heading `Answer {testCount}, then review` — unchanged, still accurate
- eyebrow `Recommended` — unchanged
- session title: `Test · {n} questions` → `Practice · {n} questions`

Do **not** rename the `testCount` / `testCounts` / `onTest` identifiers. That is a cosmetic
sweep with real diff cost and no behavior change; leave it for whoever specs the simulator.

Leave the builder's Test button (~line 919, `startSession(filteredRecords, "test", "Filtered test set")`)
firing `"test"`. It is an explicit user selection, and it keeps `mode: "test"` live.

## Consequences to expect (do not "fix" these)

- The 50-question set no longer ends at question 50 if items were skipped; the skipped-review
  phase runs first. This is intended.
- The language tabs now open on `on-tap` (EN with tap-to-reveal) instead of EN-only.
- "Missed because of the English" appears on missed items, and Vocab Rescue begins populating.
- Reveal events begin recording on the default path, and attempts from it now satisfy
  `isTranslationRevealEligible`.

## Data continuity (report, do not remediate)

Historical sessions stamped `sessionMode: "test"` remain permanently excluded from
`enrichedRows`, `auditCandidates`, and `fadeTrend`. The friction instrument starts populating
from the cutover, so the earliest `fadeTrend` session buckets will show a step change rather
than a trend. Do not backfill, do not rewrite stored events, do not special-case old sessions.
Note it in the handoff so it is not later mistaken for a behavior change in the learner.

## Verification

- `npx tsc -b --pretty false`
- `npm run build`
- Browser smoke:
  - Splash button starts a session whose topbar reads `Practice · 50 questions`, opens on the
    **Tap ZH** tab, and offers **Skip for now** pre-submit.
  - Item distribution still reflects NCLEX blueprint weighting (spot-check the category mix
    against `BANK-CENSUS.md`).
  - Post-submit on a missed item: "Missed because of the English" toggle present.
  - Post-submit: translate-all button present (requires the fixup spec).
  - Tapping a per-block `需要中文` records a `translationRevealEvent` with
    `sessionMode: "study"`.
  - **End-of-session transition (GPT review, accepted).** Skip 2–3 items, answer the rest, and
    confirm the session advances into the skipped-review phase and then to the summary. `isLast`
    is computed differently for `study` (~2927) and the skipped-phase machine (~5319, 5324) runs
    only for `study`. This transition is where mode repoints break; smoke it explicitly.
  - Builder → Test still starts an EN-only session with no skip and no reveal telemetry.
  - Resume of an in-flight pre-cutover `test` session still behaves as `test`.

## Handoff

Single commit on `codex/default-session-mode-repoint`. Land before
`codex/translate-all-reveal`. Report `git status --short` (clean). Do **not** merge or push
`main` — the architect gates promotion.

## Non-goals

- No change to `isTranslationRevealEligible`.
- No removal or reshaping of `mode: "test"`.
- No exam-simulator feature.
- No identifier rename sweep.
- No backfill of historical telemetry.

---

# DECISIONS.md entry — DRAFT, awaiting Luke's exact wording

Not written to `DECISIONS.md`. Per standing rule, that document is not edited without exact
wording confirmed. Proposed text:

> ## Default session mode is Study, not Test
>
> **Decision.** The home splash's recommended zero-configuration session (NCLEX-weighted, N
> questions) runs as `mode: "study"`. `mode: "test"` is retained but is not the default path.
>
> **Rationale.** `mode: "test"` never hid the answer, rationale, or score — it differed from
> Study only by forcing `languageMode: "off"`, suppressing the Vocab Rescue language-miss
> toggle, withholding `sessionId` from the reveal recorder, and disabling Skip. Because
> `isTranslationRevealEligible` is `study && on-tap`, pointing the default entry point at Test
> meant the translation-friction analytic, all reveal telemetry, and Vocab Rescue were dark on
> the learner's primary path. Repointing the splash restores the instruments without
> re-litigating the eligibility gate.
>
> **Default language mode is `on-tap`, never `always`.** In `always`, no text is ever hidden, so
> no `TranslationRevealEvent` can fire. Defaulting the app to `always` would silently destroy
> the translation instrument. `on-tap` is the only default under which reveal telemetry exists.
>
> **Consequence.** Attempts recorded under `sessionMode: "test"` before this change are
> permanently ineligible for friction analysis. The `fadeTrend` series begins at the cutover.
>
> **Open thread — revisit `mode: "test"`.** Test mode is now an unused placeholder with a
> half-exam shape: it forces EN-only but still reveals the answer and rationale immediately
> after each submit. It must be specced as a real exam simulator (deferred feedback, no
> translate-all, no Vocab Rescue, strict language mode) or removed. Until then it is reachable
> only from the builder. Deferred decision: whether a strict exam environment should still
> permit a post-submit full translation reveal — see `translate-all-reveal-fixup-codex-spec.md`
> §A2 (deferred).
