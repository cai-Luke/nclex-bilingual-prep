# UX-0B implementation receipt — 2026-09-11

Terminal: **UX0B_READY_FOR_REVIEW**. Implementation commit: `13efd36` on `codex/ux-0b-session-protection`, based on Luke-accepted UX-0A `d64f9f7`. No push or merge was performed. `PROJECT-HISTORY.md` publication remains deferred. No delegation was used.

## Preflight and files

[Preflight](preflight.md) records the input snapshot, all ten direct launch callers, and every active-session storage caller before editing. No bypassing constructor or post-freeze session/storage drift was found. The spec's pre-existing return-context prose limitation is documented there: runtime return context is preserved; its persistence across reload was never implemented and remains outside scope.

Changed implementation files: `src/App.tsx`, `src/styles.css`, `src/sessionStartGuard.ts`, `scripts/tests/session-start-guard.ts`, and `package.json`. This directory contains the preflight and verification evidence.

## Resulting behavior

- Protection is exactly: an existing, incomplete session with at least one result key, answer/draft key (including nested case drafts), or skipped question. An untouched or completed session is unprotected. Language changes, flags, age, and scores alone do not broaden the predicate.
- All original launch callers now use `requestSessionStart`. It holds a callback with the caller's records, mode, title, options, and original construction semantics. No seed, random draw, shuffle, sampler call, adaptive choice, session construction, return-context change, or session navigation occurs before authorization.
- The guard holds one intent and synchronously rejects further requests until cancellation or execution finishes. A startup request enters `waiting-hydration`; the actual hydrated session determines whether to show confirmation or execute. Ordinary launch controls remain available during hydration, with an accessible preparing status for the pending request.
- The native dialog says **Start a new set? / 开始新的练习吗？** and explains in English and Simplified Chinese that recorded answer history remains while the old set, drafts, and remaining questions cease to be resumable. Initial focus is **Keep current set / 保留当前练习**. That action and Escape close the dialog, clear the intent, and restore initiating focus when still mounted. **Start new set / 开始新练习** closes the dialog and runs the held intent once. Resume bypasses the gate.
- `createOrderedSessionPersistence` serializes every App active-session save/clear through one promise chain, including invalid hydration, ordinary autosave, explicit end, normal/adaptive completion, and replacement. A failed operation cannot poison subsequent queue entries.
- The construction path awaits the new snapshot's queued storage operation before publishing the new session, view, or return destination. During this interval the old surface is inert with an accessible preparing status, and old-session autosaves are suppressed. An answer submission finishing after replacement cannot attach its result to the new session; its already-recorded answer history still uses the existing storage path.
- No durable-save claim is shown. Existing memory fallback remains available when IndexedDB is unavailable.

## Automated verification

All passed against the final implementation:

- `npm run test:session-start-guard`
- `npm run test:session-navigation`
- `npx tsx scripts/tests/session-sampler.ts`
- `npm run test:storage-category-migration`
- `npx tsc -b --pretty false`
- `npm run census:check` — no drift; no regeneration
- `npm run build` — includes production direct-file rewrite and build identity validation; existing large-chunk advisory only
- `git diff --check`

The new regression injects deferred hydration/construction and two asynchronous storage barriers. While an earlier save is held, clear and replacement cannot overtake it. Releasing the old save produces `old save → clear → new save`; the new session remains invisible until its own barrier is released, then its identity is the final persisted value. It also covers cancellation with zero sampler/construction callbacks, rapid duplicate requests/confirmations, predicate boundaries, empty hydration, and recovery after errors.

## Browser verification

Chrome **152.0.7977.83**, fresh isolated contexts, production HTTP at `http://localhost:4173/`, **1440 × 1000** and **390 × 844 CSS px**. [Machine-readable results](browser-results.json) list the performed checks. The local driver remains in ignored `scratch/ux-0b/browser.mjs`; it uses existing bundled questions and isolated browser-only learner fixtures.

Performed and passed:

- No-session Study all and untouched-session replacement with Home weighted practice.
- Standalone and second-case-part draft protection; submitted adaptive work; skipped-review state without results.
- Cancel from Home, Library one-question practice, and Builder Test/Adaptive. Session snapshots remain structurally identical; Builder selections and non-session destination remain. Escape restores focus, and an immediate subsequent request works.
- Runtime Library-origin cancellation retains its Library return destination. Confirmed Home replacement changes that destination to Home.
- Confirmed Home weighted practice, Builder Study/Test/Adaptive, Library filtered Study/Test and single-question practice, and Home mistakes/answered/due paths preserve the requested populations, counts, modes, language defaults, and adaptive first-item behavior.
- A real one-question submit followed by Finish produces Summary; related practice then starts without an unfinished-work warning.
- Rapid double request and double confirmation yield one dialog, zero pre-confirmation random draws, and one new session identity.
- Actual hydration race: the browser driver delays delivery of the native IndexedDB active-session read's success event. The pending request stays unsampled until release, then discovers protected work and prompts. This is an injected browser race, not an uninstrumented manual observation.
- Immediate reload after visible replacement restores the **new** single-question session with durable IndexedDB available.
- Direct production `file://` load with IndexedDB deliberately unavailable: launch, replacement dialog, confirmation, and within-runtime Resume all work through memory fallback without page errors. No reload-durability claim is made for that context.

[Desktop dialog](desktop-replacement-dialog.png), [mobile dialog](mobile-replacement-dialog.png), and [direct-file fallback dialog](file-fallback-dialog.png) were visually inspected. The mobile dialog fits without page overflow. Page-error collections are empty. [Build identity](build-identity.json) binds the final tested production files.

Browser-driver setup was corrected to respect existing retained Builder filters, hidden inactive case parts, and the missed-item eligibility of related practice. These were harness assumptions and required no application changes.

## Preserved scope

`src/storage.ts`, persisted types, grading, sampling owners, banks, schema, renderers, census, ledger, Campaign 16 artifacts, and the unrelated ordered-response spec are unchanged. The live bank population did not move. No storage migration, scheduler rule, runtime network dependency, multiple-session feature, or new discard action was introduced.

UX-0C may follow serially under its separate view-state work order; UX-0B acceptance and publication remain separate from that implementation work.
