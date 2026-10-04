# Project Shrimp — Learner legacy-notice suppression (R1)

**Status:** DRAFT for Claude specification review and sequencing; not an implementation launch.  
**Date:** 2026-09-16.  
**Owner decision:** Remove confusing legacy/provenance warnings from ordinary learner practice. Preserve internal provenance and answer-history safeguards.  
**Routing:** Claude reviews this bounded specification and chooses its place among the other small learner-shell repairs. Codex implements only after owner launch; independent implementation review and publication remain separate.

## 1. Source basis and correction to the initial diagnosis

The drafting seat used read-only Desktop repository access to `/Users/holemini/Desktop/Project Shrimp`. The observed branch was `main`, with the latest commit `642b0f9` (Learner Shell R3 Concept A integration). Status showed unrelated untracked work; the inspected tracked source had no diff. This is a local planning snapshot, not a fresh remote/deployment verification.

The actual passive notice in `src/App.tsx:2796` is:

> Legacy set: original question content is unverified. Previous outcomes are preserved.

Its condition is `!session.fingerprints[question.id]`. It concerns missing saved-session fingerprint evidence, **not** a question's clinical-review status or whether its bank predates a review campaign. Suppressing its presentation must not manufacture fingerprint evidence, turn an unknown match into a verified one, or certify bank content.

The adjacent submitted-answer fallback and the completed-set compatibility checks have functional purposes: preventing an unverifiable historical answer from being presented against today's question as though the pairing were established. Keep those behaviors; use neutral availability language instead of alarming provenance language.

Current source locators, to relocate by symbol/text after intervening work:

| Source | Relevant responsibility |
|---|---|
| `AGENTS.md`; `PROJECT-HISTORY.md`, Sep 16 learner-shell milestone | Current governance, accepted shell, UI verification floor, deferred mobile defects. |
| `src/App.tsx:2773–2774` | `submitted && !session.attempts[question.id]` fallback. |
| `src/App.tsx:2796–2797` | Passive fingerprint notice, immediately before `HistoricalAttemptContext.Provider`. |
| `src/App.tsx:4746–4784`, `SummaryView` | Compatibility, historical result/status display, and legacy/deleted/changed notices. |
| `src/App.tsx:5016–5064`, `toStoredSession` / `hydrateSession` | Preserved snapshots and recovery for missing questions, known fingerprint mismatches, and incompatible answer IDs. |
| `src/completedMemory.ts`, `src/sessionState.ts` | Fingerprints, attempts, legacy outcomes, compatibility, and new-session initialization; read-only. |
| `package.json` | Existing verification commands below. |

The drafting pass read current governance, the completed-memory and session-state modules, the App tail containing Summary/hydration, targeted App search hits, and the mobile-repair review handoff. It did not read all of App, execute browser tests, or modify application code.

## 2. Required presentation changes — three bounded locations

### A. Remove the passive active-session notice

Delete the conditional paragraph quoted above from `SessionView`. Do not replace it with a toast, badge, tooltip, footer, collapsed disclosure, onboarding notice, dismissal control, or Settings preference. Remove its DOM output rather than hiding it with CSS or leaving screen-reader-only warning text. Leave no empty wrapper or reserved spacing.

This applies wherever that shared session presentation is used. Do not add new mode-specific behavior.

### B. Keep the legacy submitted-answer fallback, with neutral copy

Under the existing `submitted && !session.attempts[question.id]` condition, replace only the heading and explanatory copy:

**Heading:** `Answer details unavailable`

**Body:** `Your recorded result is kept. Detailed review is unavailable for this earlier answer.`

Keep the fallback itself and every existing navigation/action behavior. Do not render a replacement answer form, reconstruct an attempt, regrade the historical result, or enable another submission to bypass the fallback.

### C. Neutralize only the legacy branch in completed-set review

For `compatibility === "legacy-unverified"`, replace the technical explanation with:

`Detailed review is unavailable for this earlier question.`

Render this as ordinary explanatory text, not a warning band. Keep it at the existing fallback location. Do not claim that an answer was submitted or a result exists: this compatibility branch can also be reached by an unsubmitted entry without a fingerprint.

Preserve the existing `deleted` and `changed` copy and warning presentation. Preserve the `paired`/expanded-review conditions, recorded results/scores, question identity display, and existing practice/save controls. Do not expose current question details as verified historical review.

These locations currently use English UI copy. Preserve that localization behavior; do not introduce new translation infrastructure or alter the question's English/Chinese controls in this pass.

## 3. Non-negotiable preservation boundary

This is a presentation-only change, not a session migration or content-quality commission.

- Preserve fingerprint generation/comparison, `entryCompatibility`, `answerFitsQuestion`, attempt capture, legacy classifications/outcomes, historical pairing, recovery, submission idempotency, and ordinary save/resume behavior. No fingerprint or attempt backfill; no additional storage writes. Existing writes caused by a genuine new submission remain unchanged.
- Do not edit banks, question IDs/content/keys, schema/types, grading, storage/migrations, session construction/sampling, import/export, medical visual renderers, provenance records, review ledgers, or census artifacts. Do not remove questions from the learner pool or change promotion/eligibility rules.
- Preserve actual functional notices: unsaved/memory-only work and Retry save, changed/deleted questions, incompatible saved answers, recovery, import/load errors, and app-update notices. Do not hide, delete, or globally restyle `.warning-band`.

No new dev/provenance panel, setting, dependency, network call, or generalized notice framework is needed. Existing internal evidence remains the provenance mechanism. Preserve static/offline operation and the production `file://` path.

## 4. Authorized edit surface and execution boundary

Expected production change: the three presentation locations in `src/App.tsx`. Reuse ordinary text styling; a narrowly scoped rule in `src/styles.css` is allowed only if genuinely needed. Focused test files and new task-owned evidence may be added, preferably under `audit/learner-legacy-notices-r1/`. Do not overwrite older receipts, screenshots, or test output.

At launch, reread this order and current `AGENTS.md`; record the actual branch/HEAD and scoped diff. Preserve unrelated tracked and untracked work. Use the accepted base selected by the routing seat, not an unreviewed neighboring producer branch. A newer accepted base is expected and is not itself a blocker; locate the same presentation responsibilities there.

A required change to protected state/data behavior is a scope issue to report, not permission to silently expand this order. If another task already implemented these changes, report the overlap instead of duplicating them.

## 5. Acceptance and verification

Use isolated browser fixtures/profile data, never the learner's real saved session. Pin the rendered question/session identity so a fresh session or wrong screen cannot accidentally satisfy a missing-warning assertion.

1. **Decisive before/after witness.** Restore an older session with an unsubmitted question, absent fingerprint, and valid draft IDs, with no existing recovery trigger. The same assertion that the passive warning is absent must fail on the admitted baseline and pass on the candidate. Confirm the fingerprint is still absent before any new submission. Check DOM/accessibility exposure and absence of an empty warning-sized gap; a source-string search alone is insufficient.
2. **Historical behavior.** Exercise the submitted-without-attempt fallback and legacy completed-set review. New neutral text appears; old technical text and legacy-only warning styling do not. Recorded full/not-full outcomes and scores remain unchanged. An unsubmitted legacy completed entry still says Not submitted and gains no result. Unverifiable historical question/answer details remain withheld; no duplicate submission or answer-event/progress write is introduced.
3. **Compatibility and warning controls.** A matched modern attempt still opens normal detailed review. Known fingerprint mismatch, deleted-question, and invalid-answer-ID recovery remain intact. Changed/deleted Summary notices retain their existing treatment. Exercise a memory-only/save-failure control to establish that the functional notice and Retry save were not globally suppressed.
4. **Ordinary learner flow and layout.** Confirm resume, answering, genuine submission, navigation, and completed-set access still work; stored data changes only as the existing actions require. Inspect affected surfaces at 390×844 and 1280×800, with representative light/dark and English/on-tap Chinese coverage. No full Cartesian matrix or complete shell re-review is required. Check the production build, not only Vite development. Preserve `file://` behavior; distinguish any direct file-browser coverage from structural checks or a tool limitation.

Run the focused regression/browser witness, then:

```sh
npm run test:review-memory
npm run test:session-navigation
npx tsc -b --pretty false
npm run build
git diff --check
```

This remains the UI/CSS verification tier plus focused history-preservation checks. No bank audit, clinical re-review, visual parity rebaseline, DB cleanup, or census regeneration is commissioned. Do not weaken existing semantic assertions to make the notice removal pass. Do not reopen unrelated admitted cloze/calculator defects; report any newly introduced regression separately.

## 6. Sequencing and return

This change has no functional dependency on the mobile cloze or calculator repairs, but shares `App.tsx` and potentially CSS. Claude should place it at an explicit serial checkpoint in that queue, without disturbing an in-progress freeze/review or silently amending the other orders. Keep its diff separately identifiable; verify any shared layout evidence against the eventual accepted combination rather than reusing stale screenshots.

The two neighboring orders are `MOBILE-DROPDOWN-CLOZE-OVERFLOW-CODEX-WORK-ORDER-2026-09-16-R1.md` and `MOBILE-CALCULATOR-ACTION-CLEARANCE-CODEX-WORK-ORDER-2026-09-16-R1.md`. Their own accepted amendments and sequencing remain authoritative for those tasks. This draft does not prescribe a new order for them.

**Claude's requested return now:** ACCEPT / ACCEPT WITH REQUIRED AMENDMENTS / BLOCKED, only necessary amendments, and the proposed queue position. No implementation or agent launch from this draft alone.

**Implementer's later return:** actual base/final identity, changed files, before/after witness, command/browser results and limitations, and confirmation that historical compatibility and functional warnings remain unchanged. A passing producer return ends `LEARNER_LEGACY_NOTICES_READY_FOR_INDEPENDENT_REVIEW`; it is not independent acceptance. Follow current governance for producer-independent review. Publish the `PROJECT-HISTORY.md` status entry after acceptance/integration, not as an already-accepted producer claim. No push, merge, deployment, or unrelated cleanup is authorized by this order.
