# UX-0C implementation receipt — 2026-09-11

Terminal: **UX0C_READY_FOR_REVIEW**. Final implementation commit: `893fcb4` on `codex/ux-0c-finite-vocab-pass`, based on completed UX-0B implementation/evidence `efbc6c7`. Main implementation is `83d6549`; the final commit corrects the singular completion count. UX-0A, UX-0B, and UX-0C were implemented serially. No delegation, push, or merge was performed. Acceptance and `PROJECT-HISTORY.md` publication remain pending for UX-0B/0C.

## Files and pass model

Changed implementation files: `src/App.tsx`, `src/flashcardPass.ts`, `scripts/tests/flashcard-pass.ts`, and `package.json`. Existing CSS classes suffice. This directory contains [preflight](preflight.md), browser results, screenshots, and build identity.

The view stores `{ key, passCardIds: readonly string[], passIndex }`; the shuffled ID array is frozen with `Object.freeze`. A live `deckById` map supplies card content. Current-card lookup has no modulo and returns no ID at completion.

The exact key is `JSON.stringify([scope, category, topic, readyNow, scope === "rescue" ? [...effectiveRescueIds].sort() : null])`. A changed key builds a new eligible ID list from the existing filters/due predicate, shuffles once using the existing shuffle, and resets index/reveal. Same-key reconciliation returns the identical pass, including after progress/catalog updates or effect replay. Rescue membership is excluded from All identity.

Vocab waits for the existing learner-data hydration before its first mount. A progress write cannot rebuild the active pass. Review actions have a synchronous duplicate guard while the existing asynchronous review write completes. A write finishing after a deliberate filter change cannot advance the newly created pass.

## Behavior

- **Again:** calls the unchanged failed-review path, then advances once without reinsertion. Browser storage evidence confirms the existing 20-minute due delay, counters, ease, interval, and lapse update.
- **Got it:** calls the unchanged successful-review path, then advances once. The browser verifies the existing second-success three-day schedule and matching counters/ease/lapses. Neither action changes the frozen remaining membership/order or total.
- **Completion:** after exactly the nonempty pass length of grading actions, shows `Review complete / 本轮复习完成`, the factual reviewed count, and `Start another pass / 再来一轮`. No card is resolved, and the index cannot wrap. One card uses the singular English count.
- **Restart:** builds a new frozen pass using current progress and the current named filters. Ready-now restart can be empty; ready-off restart may include recently reviewed cards. Empty-before-start and completed-nonempty states remain distinct.
- **Navigation:** leaving Vocab ends its ephemeral pass. Ordinary re-entry uses current progress and the existing default/filter/focus behavior. No IDs, index, reveal state, or pass filters are persisted.
- **Rescue:** Summary's supplied focus subset remains temporary. Scope All and ordinary Vocab re-entry clear that focus through the existing callbacks. Durable Rescue membership derivation is unchanged. Membership changes rebuild Rescue but leave an unchanged All pass intact.

## Automated verification

Passed:

- `npm run test:flashcard-pass`
- `npx tsc -b --pretty false`
- `npm run build` — including production direct-file rewrite and build identity validation; existing large-chunk advisory only
- `npm run census:check` — no drift and no regeneration; census inputs are unchanged by the final singular-copy correction
- `git diff --check`

The deterministic helper regression covers one/N-card completion, out-of-range completion without wrap, both review outcomes advancing without reinsertion, frozen ID/order identity across progress writes, every named key input, All isolation from Rescue churn, one shuffle per new pass, repeated effect reconciliation, current-progress restart, due-time eligibility, fresh entry, and empty states.

## Browser verification

Chrome **152.0.7977.83**, isolated contexts, production HTTP at `http://localhost:4173/`, desktop **1440 × 1000** and mobile **390 × 844 CSS px**. [Machine-readable results](browser-results.json) bind the performed checks to the final build. [Build identity](build-identity.json) records its SHA-256 file hashes. The local driver is in ignored `scratch/ux-0c/browser.mjs`; browser-only learner fixtures derive terms from existing bundled banks.

All work-order acceptance scenarios are covered by the focused regression and these performed browser checks:

| Scenarios | Performed proof |
| --- | --- |
| 1–7, 17–19 | Exact one-card Again completion; saved failed schedule; successful one-card filtered review; ready-on empty restart and ready-off repeat; no card after completion. |
| 2–4, 8–10 | Twelve unique cards, exactly twelve persisted reviews, frozen header total, eleven initial shuffle draws and zero further draws while grading, then completion with twelve reviewed. |
| 11–14 | Category, topic, readiness, and scope changes reset position and create the requested population; reveal resets. |
| 15, 22 | Summary opens its three-term subset from a six-term durable Rescue universe. Direct ordinary navigation away/re-entry yields all six; a separate handoff verifies All clears focus before returning to durable Rescue. |
| 16 | While an All pass is at card 2 of 15, a delayed language-miss removal empties Rescue membership. All keeps the same position, card, total, and shuffle count. |
| 20–21 | Leave at card 7 of 12; re-enter at card 1 of six currently eligible cards. Complete those six, leave, and re-enter the ordinary empty state. |
| 23–25 | Live Rescue membership becoming empty shows the existing Rescue-specific explanation; nonempty Rescue with a nonmatching topic shows ordinary empty; All with no eligible cards has no phantom card or completion claim. |

The membership-change scenarios delay delivery of the native IndexedDB language-miss deletion's success event while navigating through the actual UI. A separate delayed native flashcard-progress read proves initial Vocab displays its loading status with no pass/shuffle until hydration finishes. These are injected browser timing scenarios, not uninstrumented manual observations.

The mobile smoke covers flipped card content, position header, grading controls, completion, restart, and empty state without horizontal overflow. [Card](mobile-card.png), [position at page top](mobile-card-progress.png), [completion](mobile-complete.png), and [empty](mobile-empty.png) screenshots were visually inspected, along with the desktop surfaces.

The actual production `file://` page loads Vocab and grades a filtered one-card pass with IndexedDB deliberately unavailable. It completes, restarts under ready-off, and switches to empty under ready-on using the recorded memory-fallback schedule. No runtime/page errors occurred in HTTP or direct-file contexts. No reload-durability claim is made for memory fallback.

The browser harness initially counted two startup random calls as shuffle calls; the counter boundary was corrected to begin after app startup. This was a harness assumption and did not require a runtime change.

## Scope and escalation

No `UX0C_SOURCE_DRIFT` or `UX0C_STORAGE_ESCALATION` occurred. `src/storage.ts`, `src/reviewSchedule.ts`, SRS math, IndexedDB shape/version, glossary/Rescue derivation, question progress, banks, schema, grading, renderers, census, ledger, and unrelated Campaign 16 state are untouched. The unrelated untracked ordered-response spec remains untouched.
