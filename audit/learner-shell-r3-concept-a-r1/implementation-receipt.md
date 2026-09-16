# Learner Shell R3 Concept A — producer implementation receipt

Status: producer verification complete; ready for independent review. This receipt does not confer independent acceptance.

## Frozen input and snapshot

- Baseline: `511f66b7b7cb830649613793f0264725be25d450`.
- Final implementation commit: `d581a66ff1a784d10e65b1b139d78c41851d45fa` (production source and task-owned verification runners).
- Branch: `codex/learner-shell-r3-concept-a-r1`.
- Worktree: `/Users/holemini/Desktop/Project Shrimp Learner Shell R3`.
- Access: disk-reading seat; isolated worktree created clean directly from the exact baseline. No later production commits were fetched, rebased, merged, or copied into the implementation.
- Active work order: `/Users/holemini/Desktop/Project Shrimp/LEARNER-SHELL-R3-CONCEPT-A-IMPLEMENTATION-WORK-ORDER-2026-09-13.md`.
- Work-order SHA-256: `521c5af27b13a774c75146c2431f210d47bea35161d44dba96d2f986b8c8e884`.
- The owner work order and the named R3 references are absent from the baseline. They were read from the owner checkout as launch/design inputs only. Their hashes, the owner's initial HEAD, status, and untracked-file hashes are preserved in [launch-snapshot.json](launch-snapshot.json).
- This receipt and generated evidence are appended in a separate evidence-only commit. That commit does not alter the final implementation or the tested build. The exact evidence revision is the commit containing this file (`git log -1 --format=%H -- audit/learner-shell-r3-concept-a-r1/implementation-receipt.md`); the handoff message also identifies it.

## Production change inventory and design mapping

| File | Change and reason |
|---|---|
| `src/App.tsx` | Replaces six-peer navigation with Study / Library / Progress; Settings stays a header utility, Customize stays under Study, Import moves under Library, and Developer moves to its existing gated Settings context. Reshapes Home into a dominant action bay and adjacent memory dock. Adds factual resume progress, retains original launch handlers, and relabels root return controls as Study. |
| `src/styles.css` | Translates Concept A's pale-stone / blue and dark blue-slate palette; removes hero/utility-grid styling and decorative card shadows; adds compact workspace/memory styling, keyboard outlines, safe-area-aware mobile navigation and bottom content clearance. Keeps the native dialog's title/actions outside its scrolling description. Fixes item-type badge text contrast in dark mode. |

Only these two production files changed. The other changes are confined to this task's audit directory: three runnable verification helpers, the launch snapshot, command logs, browser matrix, 17 screenshots, baseline console comparison, build hashes, invariance proof, and this receipt.

The Concept A action bay maps onto the existing `HomeView` callbacks. Its memory dock maps onto the existing Needs Review, Saved, and Last Set views. Statistics remain in Progress. Secondary entry/return controls still call the same production view and launch handlers. Mobile primary navigation uses one semantic navigation element with exactly three buttons; it is not rendered during active Study, Preview Lab, or Developer Review. Native modal inertness prevents background navigation from taking focus.

The new-set disclosure uses a stable initial open value: if session hydration finishes after a Start click, cancel can still return focus to the visible originating button. This is native presentation state only. No persisted preference or second configuration model was introduced.

## Prototype behavior intentionally not copied

- No mock shell/state engine, mock session progression, fake question/rationale renderer, or sample question content.
- No global fake ZH switch, percentage text-size setting, or new setting/storage field. Production language defaults, per-session modes, Compact / Default / Large text settings, theme, voice settings, and diagnostics remain authoritative.
- No separate Review/Vocabulary engine, scheduler, due dates, historical set browser, readiness/pass-fail score, streak, or mastery state.
- No new Key Takeaway field or rationale summary.
- No prototype replacement semantics. The accepted guard protects recorded work, drafts, and skips; an untouched set retains its existing direct-replacement behavior.
- No learner bottom navigation competing with active Study's sticky actions or calculator.

## Deterministic verification

All required commands passed against the final implementation commit. The execution revision and input hashes are in [deterministic-results.json](deterministic-results.json). The production build and full Chrome suite also bind to that commit and the recorded source/artifact hashes. `git diff 511f66b --check` passed at closeout.

| Command | Result | Output |
|---|---|---|
| `npx tsc -b --pretty false` | PASS (exit 0) | [01-tsc--b---pretty-false.log](01-tsc--b---pretty-false.log) |
| `npm run test:review-memory` | PASS (exit 0) | [02-test-review-memory.log](02-test-review-memory.log) |
| `npm run test:session-start-guard` | PASS (exit 0) | [03-test-session-start-guard.log](03-test-session-start-guard.log) |
| `npm run test:session-navigation` | PASS (exit 0) | [04-test-session-navigation.log](04-test-session-navigation.log) |
| `npm run test:session-sampler` | PASS (exit 0) | [05-test-session-sampler.log](05-test-session-sampler.log) |
| `npm run test:exam-layout` | PASS (exit 0) | [06-test-exam-layout.log](06-test-exam-layout.log) |
| `npm run test:calculator` | PASS (exit 0) | [07-test-calculator.log](07-test-calculator.log) |
| `npm run test:app-update` | PASS (exit 0) | [08-test-app-update.log](08-test-app-update.log) |
| `npm run build` | PASS (exit 0) | [09-build.log](09-build.log) |
| `git diff --check` | PASS (exit 0) | [10-git-diff---check.log](10-git-diff---check.log) |

No census regeneration or bank mutation was performed. Source checks found no census movement. The normal Vite large-chunk notice remains, as in the reconstructed baseline build; bundled banks and dependencies are unchanged.

## Real Chrome browser verification

System Google Chrome 152 on macOS, operated through Playwright in headless mode with disposable profiles. Normal browser web security was retained. Initial layout reconnaissance used the isolated Vite dev server. The final 28 scenario groups used the served production build and its actual `file://` artifact. Scenario results, source hashes, fixture IDs, dimensions, theme, and text setting are in [browser-results.json](browser-results.json); command output is in [browser-run.log](browser-run.log).

Tests use canonical questions selected from the frozen banks and disposable browser storage. The ordinary 10-question launcher and explicit 25-question replacement are real UI launches. Bounded canonical-question fixtures exercise submission, completion memory, visuals, case navigation, and hydration races without altering any bank or application source. Assertions inspect the actual production persistence results.

| # | Scenario group | CSS viewport / theme / production text | Transport / result |
|---|---|---|---|
| 1 | Desktop light root; exact primary IA; utility Settings; subordinate Customize; visible keyboard focus | 1440×900 · light · default | http: · PASS |
| 2 | Desktop dark root | 1440×900 · dark · default | http: · PASS |
| 3 | Dark shell sampled text contrast at least 4.5:1 | 1440×900 · dark · default | http: · PASS |
| 4 | Mobile dark root with exactly three bottom tabs | 390×844 · dark · default | http: · PASS |
| 5 | Mobile light root; fixed bottom navigation and content clearance | 390×844 · light · default | http: · PASS |
| 6 | Customize subordinate to Study; Library filtering; advanced Import entry and return | 390×844 · light · default | http: · PASS |
| 7 | Library keyboard inspect and existing single-question practice/return | 390×844 · light · default | http: · PASS |
| 8 | Actual ordinary 10-question start; resume dominant; native replacement safe default; Escape and Keep preserve ID and restore focus | 390×844 · light · default | http: · PASS |
| 9 | Explicit replacement uses the existing session machinery | 390×844 · light · default | http: · PASS |
| 10 | Mobile select/submit/rationale; Saved toggle; Chinese reveal; glossary; voice controls; GPT clipboard; sticky controls and calculator use without shell collision | 390×844 · light · default | http: · PASS |
| 11 | New ordinary set completion persists Summary and bounded Last set | 390×844 · light · default | http: · PASS |
| 12 | Needs Review factual count, inspect/practice and return | 390×844 · light · default | http: · PASS |
| 13 | Saved inspect/practice/remove; last-row focus recovery and factual independent counts | 390×844 · light · default | http: · PASS |
| 14 | Last Set inspect/retry path; full marks clears Needs review; remediation does not replace ordinary Last set | 390×844 · light · default | http: · PASS |
| 15 | Existing skip and revisit flow | 390×844 · light · default | http: · PASS |
| 16 | Standalone visual question renders in active Study | 390×844 · light · default | http: · PASS |
| 17 | Clinical visual remains light-locked in dark shell | 390×844 · dark · default | http: · PASS |
| 18 | Case study part navigation and staged chart presentation | 390×844 · dark · default | http: · PASS |
| 19 | Settings persist theme, Large text and Chinese default; resumed session keeps its own language mode | 390×844 · dark · large | http: · PASS |
| 20 | Progress factual metrics and topic navigation under Large text | 390×844 · dark · large | http: · PASS |
| 21 | 320px extra narrow root, Library and Settings with Large text | 320×740 · dark · large | http: · PASS |
| 22 | Real Chrome 200% zoom plus production Large text; root and native dialog title/safe action visible; Escape restores focus | 720×450 · dark · large | http: · PASS |
| 23 | Forced production update banner remains visible and Refresh usable | 390×844 · dark · large | http: · PASS |
| 24 | Dev-gated Preview Lab and Developer reachable through Settings; learner nav absent | 390×844 · dark · large | http: · PASS |
| 25 | Delayed learner hydration cannot be bypassed by shell launch controls | 1440×900 · light · default | http: · PASS |
| 26 | Start during active-session hydration waits, then offers safe replacement; no lost resumable session | 1440×900 · light · default | http: · PASS |
| 27 | Final production file:// loads, navigates, starts Study and resumes after reload without module/path errors | 390×844 · dark · default | file: · PASS |
| 28 | No new application console warnings/errors; file manifest CORS matches baseline exactly | 390×844 · dark · default | file: · PASS |

Chrome's native Page zoom was set to 200% through `chrome://settings/appearance`; measurements confirmed a 720×450 CSS viewport and device pixel ratio 2 within the 1440×900 browser viewport. No CSS zoom/text-scale substitute was used. The stressed dialog title and safe button were both fully visible, and cancellation restored focus. Screenshots were captured from the foreground Chrome compositor without changing layout dimensions.

Measured dark-shell text contrast in five representative surfaces ranged from 5.13:1 to 13.48:1. The new item-type badge uses the readable muted-text token. Existing correctness/error/warning color values remain byte-identical. Keyboard outlines, native-dialog focus protection, cancellation focus, delayed-hydration focus, and Saved last-row removal focus were exercised. No horizontal page overflow occurred at the tested 390px and 320px widths or the zoomed 720px layout. Bottom clearance was measured at 390×844. Safe-area expansion is encoded directly with `env(safe-area-inset-bottom)` in both navigation and content reservation; a physical notched device was not used.

### Screenshots

- [desktop-study-light](screenshots/desktop-study-light.png)
- [desktop-study-dark](screenshots/desktop-study-dark.png)
- [mobile-study-dark](screenshots/mobile-study-dark.png)
- [mobile-study-light](screenshots/mobile-study-light.png)
- [mobile-active-study](screenshots/mobile-active-study.png)
- [mobile-rationale](screenshots/mobile-rationale.png)
- [mobile-summary](screenshots/mobile-summary.png)
- [mobile-needs-review](screenshots/mobile-needs-review.png)
- [mobile-standalone-visual](screenshots/mobile-standalone-visual.png)
- [mobile-visual-dark](screenshots/mobile-visual-dark.png)
- [mobile-case-study](screenshots/mobile-case-study.png)
- [mobile-study-large-dark](screenshots/mobile-study-large-dark.png)
- [study-browser-200-percent](screenshots/study-browser-200-percent.png)
- [replacement-large-browser-200-percent](screenshots/replacement-large-browser-200-percent.png)
- [mobile-update-banner](screenshots/mobile-update-banner.png)
- [production-file-study](screenshots/production-file-study.png)
- [production-file-session](screenshots/production-file-session.png)

The primary desktop light/dark, mobile root, mobile active Study, memory surface, and stressed replacement screenshots were visually inspected by the producing seat. Clinical visuals retain their existing light-locked paper surfaces in dark mode. The full screenshot set is task-owned and does not overwrite reference evidence.

## Production file proof and inherited console message

- Artifact: `/Users/holemini/Desktop/Project Shrimp Learner Shell R3/dist/index.html`.
- HTML SHA-256: `52664538d35a4623deb3a59b0b9a259dd5cd479c4de76f1b8690b496e7c83633`.
- Build ID: `d581a66ff1a784d10e65b1b139d78c41851d45fa-2026-09-14T02:20:04.254Z`.
- Full production file hashes and tree digest: [build-manifest.json](build-manifest.json).
- Chrome loaded bundled questions, navigated Library/Progress/Settings, started Study, persisted theme, reloaded, and resumed the stored session under `file://`. There were no module/script/style/image-path failures.

Chrome emits a file-origin CORS diagnostic for `manifest.webmanifest` and its paired `net::ERR_FAILED`. This is inherited: a separately reconstructed `511f66b` production build reproduces the exact messages with normal web security, while loading the app. See [baseline-file-console.json](baseline-file-console.json), [baseline-build.log](baseline-build.log), and [baseline-file-smoke.mjs](baseline-file-smoke.mjs). The final run recorded four such messages across initial load/reload, zero new attributable console errors, and zero console warnings. The PWA-manifest behavior was left within the baseline build contract.

## Invariance and owner-checkout proof

[verify-invariance.mjs](verify-invariance.mjs) produced [invariance-proof.json](invariance-proof.json):

- All 77 protected tracked files were compared byte-for-byte with `511f66b`, with baseline/current SHA-256 values recorded.
- This includes every bank file and renderer implementation, plus storage, progress migration, sampler, grading, schema, types, bank loading/import, completion memory, session state/navigation/guard, calculator, package manifest/lockfile, canonical census artifacts, ledger, and `PROJECT-HISTORY.md`.
- All pre-return App state, effects, and handlers remain byte-identical except deletion of the unused decorative Answered-metric selector and addition of four derived navigation selectors. No session or memory handler changed.
- 43 top-level App functions are byte-unchanged, including SessionView, QuestionCard, item controls, glossary, bilingual rendering, rationale, and SummaryView. MemoryList differs only in its root-return label. Other changed functions are App, HomeView, LibraryView, and SettingsView.
- Existing semantic correctness/error/warning/evidence color tokens are byte-identical. No clinical renderer selector was changed.
- Owner HEAD and full untracked status match the launch snapshot, and every hashed owner untracked artifact/reference is unchanged. The owner work order was never staged, edited, moved, or committed. No owner file was stashed, cleaned, reset, staged, moved, or deleted.
- No dependency, R3 concept reference, bank, schema/storage version, census artifact, or project history change occurred. No deployment, main merge, push, or force-push occurred.

The final diff was inspected for accidental Study/Review copy or behavior changes. All changed learner copy concerns navigation/workspace presentation; clinical and memory semantics remain in the existing implementation.

## Deliberate visual differences and review boundary

Desktop uses compact header navigation. Active Study retains its existing reading layout and mobile sticky controls. Existing semantic pills, question controls, voice, glossary, case/visual machinery, Study-all action, and historical-notice behavior remain available. Dark primary buttons use navy text on blue to preserve contrast. The reference's fake utilities, decorative gradients, and in-session bottom navigation were not reproduced. These differences follow the frozen work order and production behavior.

No work was delegated. Implementation, evidence generation, and visual inspection were performed by the primary Codex seat (GPT-6). This producer pass is not a producer-independent review. History publication remains deferred to the accepted review/integration seat.

`PROJECT_SHRIMP_LEARNER_SHELL_R3_CONCEPT_A_READY_FOR_INDEPENDENT_REVIEW`
