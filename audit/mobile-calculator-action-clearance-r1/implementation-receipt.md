# Mobile calculator / Study action clearance R1 — R3 producer receipt

`PROJECT_SHRIMP_MOBILE_CALCULATOR_R1_READY_FOR_INDEPENDENT_REVIEW`

Producer verification is complete. Independent acceptance, integration, and publication remain separate work. Nothing was pushed, merged, or deployed; `PROJECT-HISTORY.md` was not edited.

## Authority and exact snapshot

- Owner launch: `/Users/holemini/Desktop/Project Shrimp/MOBILE-CALCULATOR-R3-CODEX-LAUNCH-AUTHORIZATION-2026-09-16.md`.
- Unchanged owner work order: `/Users/holemini/Desktop/Project Shrimp/MOBILE-CALCULATOR-ACTION-CLEARANCE-CODEX-WORK-ORDER-2026-09-16-R3.md`.
- R3 SHA-256 at launch and close: **`e4f35dc21f512e97a061b86a21150b95435e6c4a2f163bc65a45cbba4cbbc37f`**.
- Execution base: **`adcbff3baedf61461ba73b14b7d029f8324c8bfc`**. Owner HEAD, local `main`, and remote-tracking `origin/main` matched this exact commit at launch and close. This reports observed refs, not an assumption about unobserved remote changes.
- Planning `642b0f9c8707024037709b26b764c7b21e66ddce` is an ancestor; it was not used as the execution base. Intervening production changes are the accepted cloze App/CSS repair, with no calculator production changes.
- Accepted cloze production: `3cb99e6478bd8a6ff9a90f571afb98860973db4c`; accepted evidence: `c521637191ce7a635cc7c2c22c2e8c4c0f077deb`; both are ancestors of the execution base. The Sep 16 history closeout and [integration receipt](../mobile-dropdown-cloze-overflow-r1/integration/integration-receipt.md) establish the completed dependency. The calculator specification acceptance and execution authority come from the owner's launch authorization.
- Access: disk-reading, isolated branch **`codex/mobile-calculator-action-clearance-r1`**, worktree **`/Users/holemini/Desktop/Project-Shrimp-calculator-r1`**, created directly from the exact execution base.
- Tested production/test commit: **`3fac6f1a26a217d9108f7ec1ba3b29562570451a`**. The production build's `buildId` begins with this full SHA; artifact hashes are in [deterministic-results.json](deterministic-results.json).
- The final evidence tip is reported in the final handoff and obtainable with `git rev-parse HEAD` on this retained producer branch. Its hash is intentionally not embedded in itself. Task-owned command logs are explicitly tracked despite the repository-wide log ignore rule.

[Launch snapshot](authority-start.json), [close snapshot](authority-close.json), and [baseline build identity](baseline-build-identity.json) retain the exact inputs and status metadata. The disposable baseline reconstruction remains at `/tmp/shrimp-calculator-execution-base`, with a clean tracked tree at the admitted base.

## Cause and bounded implementation

The original mobile sheet was fixed at bottom zero, while Submit and the lower Study actions also occupied the bottom viewport. It used `overflow: hidden` with a height cap. The final admitted-base 667×375 probe records a 262.5px panel with 379px scroll content, and Equals at y=440.875–484.875 outside the 375px viewport. The existing sticky top bar was also constrained by the session grid's end on long cases; the open-sheet contract needs it reachable throughout that scroll range.

Only five production/test paths changed:

| File | Change |
| --- | --- |
| `src/styles.css` | Adds 90 lines scoped to the mobile calculator and active Study calculator state. Closed Study launcher is in flow below the top bar. Open Study uses a measured bottom action reservation, with End/Skip and Submit in distinct columns; top bar is fixed while open. Adds content padding and bounded calculator-body scrolling. Reclaims display/keypad outer spacing while preserving text, display height, and 44px keys. Reduced height retains a 4rem band for case navigation. |
| `src/ExamCalculatorPanel.tsx` | Adds one root ref, the layout-hook import/call, and a body wrapper around the unchanged display/keypad. Retains dialog semantics, all keys, dispatches, focus/minimize/Escape handlers, desktop drag/clamp, and state lifetime. |
| `src/useCalculatorLayout.ts` | Ephemeral mobile/open-only measurement of actual top-bar, action, Submit, and panel heights. Resize and child-list observation handle text/wrapping, submission, and resizing. Cleanup cancels the frame, disconnects both observers, removes listeners and all four inline properties on close, desktop crossover, and unmount. Preview has no Study shell and receives no reservation. |
| `scripts/tests/mobile-calculator-clearance.mjs` | Explicit URL/output regression with canonical identity assertions, tier thresholds, actual activation-element targeting, typed overlap, five-point hit testing, explicit reach steps, and pre-pointer scroll checks. |
| `scripts/tests/mobile-calculator-desktop.mjs` | Bounded desktop/crossover/Preview helper imported by that runner. |

All other additions are task-owned evidence under this directory. `App.tsx` is byte-identical to the execution base; no handler, condition, cloze function, or calculator mount key changed. The Study key remains `session.id` plus parent `question.id`. There is no landscape side dock, global clipping, body lock, persisted layout state, or arithmetic change.

The geometry uses the current action-row height plus an 8px gap as the sheet bottom reserve. The safe inset enters that action row and Submit positioning once, then the measured action height feeds the sheet bounds. Normal portrait keeps the complete keypad visible. Below 650px height, the sheet body scrolls below its reachable header; case controls can be scrolled through the retained 64px band, while answers use the authorized minimize/read-or-answer/reopen cycle.

## Red/green and oracle

The baseline was reproduced before production editing in [baseline-initial](baseline-initial/results.json). The final byte-identical runner was then executed against the admitted-base production build and the candidate:

| Run | Exit / status | Decisive result |
| --- | --- | --- |
| [Final baseline HTTP](baseline-final/results.json) | 1 / `OVERLAP` | Ready Submit, intersection **348.4375 × 43.59375 CSS px**; all five samples hit calculator descendants; `scrollY` **0 → 0**. No Submit click attempted. |
| [Final candidate HTTP](candidate-http/results.json) | 0 / PASS | **2,264** records; decisive Submit clears geometry/hits before its unforced click; all required scenario groups pass. |
| [Final candidate file](candidate-file/results.json) | 0 / PASS | **93** records; ready Submit, arithmetic, minimize/focus, ordinary submit → Next, second question reset/submission → Finish. |

Runner SHA-256 for all three: **`5b253be8bceab1f554d5156e1fa3a05cc7f6aa5399f078051949a6fbad26736e`**. The imported helper hash is recorded separately in each result. Exact commands/exits are in [browser-invocations.json](browser-invocations.json).

The oracle requires a present, nonzero, in-viewport target, rectangle separation within the specified 1px intersection tolerance, and target/descendant hits at center and 4px inside all four corners. A foreign hit is typed `OVERLAP`. Measurements precede clicks. Every decisive ordinary pointer action records both sampled `scrollY` and actual capturing `pointerdown` `scrollY`; all **433** final HTTP pointer samples match. Handler-driven scroll after submission/navigation/focus is recorded separately, not used to manufacture reachability. Explicit document/matrix/keypad scroll-to-reach operations are separately logged. No forced clicks or direct handlers are used.

Answer targets are the actual `.option-row` role-button, matrix cell button, native select, or ordered-response button, not a wrapping matrix row. Selects receive an ordinary pointer activation and native control selection. Large answer-only fallback is chosen only when the actual activation element exceeds the positive band. The 320px Large witness measures **174.15625px** against **170.6875px**; value `5` and pending `+` survive minimize → answer → reopen. Reduced case answer cycles supply additional state-survival proof. Top-bar and Study actions never receive that fallback.

## Fixtures and browser matrix

[Fixture manifest](candidate-http/fixture-manifest.json) records bank SHA-256, canonical object SHA-256, IDs and runtime fingerprints for:

- `claude_a_mc_acute_mi_01` and `claude_a_mc_dabigatran_teaching_03` — `banks/claude-canonical.json`.
- Accepted cloze `gpt_format15_vasa_previa_management_dropdown` — `banks/gpt-canonical.json`.
- `claude_a_matrix_anticoagulant_monitoring_16` — `banks/claude-canonical.json`.
- Real case `opus_psi_caregiver_2026_06_10_01`, parts `01a` through `01f` (full IDs/fingerprints in manifest) — `banks/claude-canonical.json`.

Fixture seeding destroys the live app page before writing disposable storage. Parent fingerprint, current session ID/index, exact rendered canonical stem, active case-part stem and requested viewport/theme/text are asserted. No owner browser profile or progress was used. The complete case starts from a canonical complete draft, exercises every activation control of every active part with ordinary controls, navigates all six parts, and submits through the existing Submit all parts handler.

System Google Chrome **152.0.7977.83**, headless Playwright, ordinary web security, separate disposable profiles; DPR 1 and viewport/touch capability emulated. These are real browser layout and interaction measurements, not physical iOS/Android tests.

| Group | Final result |
| --- | --- |
| 390×844 Default / Large | PASS; band **275.671875px** in the initial disabled/ready ordinary state; complete keypad without internal scrolling. |
| 320×740 Default / Large | PASS; band **170.6875px**. Default exceeds 6rem=96px. Large has positive band and the authorized oversize-answer fallback. |
| Core states | Closed launcher, disabled and ready Submit, open/close/reopen, submitted Next/Finish, last answer activation, complete ordinary two-question flow. |
| 390×568 / 667×375 | PASS; **64px band**. Scroll body 239/303px and 69/303px respectively; every key including the last row receives geometry/hit checks and an unforced click. Header/minimize remain visible. |
| Case/content | Matrix, cloze and six-part case; wrapping part chips; top/middle/end document scrolling; complete-case submission and post-submit navigation. Reduced 667×375 case also passes, with navigation controls remaining in the 64px band. |
| Appearance | Persisted dark + Large matrix; Compact cloze; root width bounded throughout. |
| Crossover / desktop | 780/781 and 820/821 with an open real-case panel, then mobile. Desktop `:has` selector matches with **320px** right padding. 1440×900 drag and both viewport clamps pass. The accepted case stays one column; the 820/821 distinction is chart overflow/footer behavior, which is checked. |
| Preview / exit | Narrow Preview pointer `2 + 3 = 5`, minimize/focus return, no Study action reservation. Study exit clears reservation; Skip and End set also execute with the calculator open. |
| Lifetime | Opening focus; Escape/minimize launcher focus without abandonment; keyboard `2 + 3 = 5` without submission; pending operator survives fallback; next question resets; same-parent part navigation retains calculation; draft survives reload with no result/AnswerEvent. |
| HTTP / offline | Calculator and accepted cloze runners pass both transports. |

[Matrix summary](browser-matrix-summary.json) links the raw tier/state observations. The final viewport captures were visually inspected, including narrow Default/Large, dark matrix, reduced landscape/case, simulated inset, and offline states; desktop/Preview captures were also inspected by the bounded contributor.

## Safe-area and diagnostic classification

- **Actual computed environment:** `env(safe-area-inset-bottom)` is **0px** in this system Chrome environment at every tested viewport. That is not nonzero-safe-area proof.
- **Simulated:** 24px overrides only `--calculator-safe-bottom`, whose production default is the real `env(...)`. Normal 390×844 band changes by exactly **24px**, from 275.671875 to 251.671875. Reduced 390×568 retains a 64px band and its body viewport decreases from 239 to 215px. Action padding, Submit bounds, and measured sheet reservation are recorded. This exercises the same path without double counting.
- **Unverified:** physical-device/browser nonzero safe-area behavior. R3 permits this honestly disclosed limitation; no such hardware proof is claimed.

Final HTTP has zero warnings/errors. Calculator file evidence has six diagnostics (three inherited manifest CORS/`net::ERR_FAILED` pairs); cloze file evidence has twelve (six pairs). Each is matched to the exact `manifest.webmanifest` request and the inherited CORS signature; no other diagnostic is allowed.

## Deterministic and protected-path floor

All required commands exited 0 against the tested commit; full logs and artifact hashes are in [deterministic-results.json](deterministic-results.json):

- `npx tsc -b --pretty false`
- `npm run test:calculator`
- `npm run test:exam-layout`
- `npm run test:case-completeness`
- `npm run test:session-navigation`
- `npm run test:session-start-guard`
- `npm run build`
- `git diff --check`

The build emitted the existing Vite large-chunk advisory. No bank/census regeneration was performed.

The unchanged accepted cloze runner (`3e661e3cc32f1e40a8a8937205c475e504051cb0cee892e23cbd24c61f320667`) passes [HTTP, 160 checks](cloze-http/results.json) and [file, 5 checks](cloze-file/results.json). Its accepted causal containment assertions and fixtures were not modified.

Focused new-hook DOM integration checks are exercised by the clearance runner and reproducibly verified by `node audit/mobile-calculator-action-clearance-r1/assert-layout-evidence.mjs`: 70 post-submit samples show measured Submit height reset to zero, eight desktop samples show mobile offsets removed, close/exit cleanup passes, and the same-path inset/pointer-scroll assertions pass. Result: [layout-helper-checks.json](layout-helper-checks.json).

[Protected proof](protected-scope.json), generated by [verify-scope.mjs](verify-scope.mjs), proves **4,457 protected tracked paths** equal to the execution base by Git object and SHA-256 bytes, including arithmetic, all banks/visuals, schema/types/grading, storage/migrations, sampler/session/navigation/start guard, completed memory, import/loading, packages, census, history and all prior evidence. Allowed production bytes are also bound to the exact tested commit. Function/AST comparison proves all App functions/handlers/gates/cloze and the mount key unchanged. Original panel keys, reducer wiring, keyboard/focus/minimize effects and drag/clamp functions match; only the exact new root ref/hook and body wrapper/ref are excluded as presentation additions. Seven mutation guards validate the proof machinery. No unexpected paths were found.

## Owner preservation, development evidence, and contributors

Owner checkout remains at the execution base, tracked-clean. Both full untracked metadata inventories contain **1,124 entries**, with no added/removed status entry. This is metadata equality only; unrelated owner/P27 contents were not opened, hashed, staged, altered, stashed, moved, deleted, or cleaned. The owner-side R3 bytes match the launch hash.

Development evidence is retained separately and is not presented as acceptance proof. `baseline-height/` was an invalid early viewport setup: the replacement page inherited 390×844. `baseline-height-corrected/` is the actual 667×375 admitted-base observation. The final runner asserts viewport identity. Earlier candidate runs exposed and resolved narrow Default answer fit, action-bar interception of case Submit, long-case sticky top-bar reach, and launcher reach setup. An early desktop helper incorrectly expected two case columns at 821px; source inspection corrected it to the existing chart/footer breakpoint. The final baseline/candidate runs use identical current runner bytes.

Primary Codex producer performed implementation, main regression, final execution, integration of evidence and receipt. Two bounded descendants under R3 §7/current AGENTS contributed: `protected_scope` supplied **evidence tooling** for path/AST proof; `desktop_preview_tests` supplied **test implementation and evidence** for desktop/crossover/Preview. Both inherited the primary Codex model/seat; no model override or recursive delegation was used, and the exact backend model ID was not independently exposed by their tool results. Neither contribution is producer-independent review.

## Independent reviewer reproduction and stop

From the retained producer worktree, serve candidate `dist` and the exact-base `dist` on separate ports, then use fresh output directories with the commands in [browser-invocations.json](browser-invocations.json). Both runners accept explicit HTTP or file URLs and output paths via `PLAYWRIGHT_MODULE`; no project browser dependency was added. Use `--witness-only` for the baseline typed-overlap reproduction. The new runner's full candidate path supplies the remaining R3 matrix.

The independent checker still must review code and fixture/oracle assertions, rerun baseline and candidate, and write at least one separate decisive measurement probe as R3 requires. This producer stops at committed implementation/tests/evidence and does not perform acceptance, push, merge, deployment, history publication, or another defect repair.
