# Project Shrimp — Mobile Calculator / Study Action Clearance Repair

**Status:** DRAFT R3 — Claude.ai R2 closure defect and final owner decision incorporated; NOT an execution authorization.  
**Date:** 2026-09-16  
**Producer:** Codex; suggested seat GPT-5.6 Sol / high.  
**Lane:** Presentation and ephemeral layout coordination only.  
**Planning snapshot:** `642b0f9c8707024037709b26b764c7b21e66ddce`.  
**Execution dependency:** the cloze repair has been independently accepted and integrated; resolve the execution base under §2.  
**Suggested branch:** `codex/mobile-calculator-action-clearance-r1`.  
**Evidence directory:** `audit/mobile-calculator-action-clearance-r1/`.

Claude.ai specification review is complete through the R2 closure pass. This R3 incorporates the final answer-control target clarification and owner fallback decision below. Implementation requires a later owner launch/freeze. This is not permission to repair both mobile defects in one branch or to reopen the accepted learner shell.

## 1. Outcome and recorded defect

Keep the existing nonmodal mobile calculator usable without covering the learner's active Submit or session-navigation controls. This is a layout repair, not a change to calculation, grading, session lifetime, or navigation semantics.

The accepted integration evidence supplies a concrete witness:

| Condition / measurement | Recorded value |
|---|---|
| Question | `claude_a_mc_acute_mi_01` in a two-question ordinary Study fixture |
| Viewport / appearance | 390×844 CSS px, DPR 1, light, Default, on-tap |
| Open calculator rectangle | left 8, right 382, top 462.625, bottom 844 |
| Submit rectangle | left 20.78125, right 369.21875, top 730.8125, bottom 774.40625 |
| Intersection | 348.4375 px horizontal × 43.59375 px vertical |

Sources: `audit/learner-shell-r3-concept-a-r1/integration/focused-browser-smoke-results.json`, the adjacent runner/receipt, and `audit/learner-shell-r3-concept-a-r1/independent-review/independent-review.md` §6 N8. Those numbers are historical observations, not new measurements by this specification's author. The original witness's Submit was not yet enabled; the repair must also demonstrate a genuinely enabled, clickable Submit.

At the planning snapshot, `.exam-calculator` is fixed at z-index 20 and mobile bottom 0; the mobile Submit is sticky above the session-actions row at z-index 3. The sheet's CSS caps height but its general rule uses `overflow: hidden`. Source inspection establishes these conditions, not a fully proven remedy. Trace the actual panel/action layout before selecting the smallest fix.

## 2. Authority, execution base, and isolation

Read current `AGENTS.md`, this order, the accepted learner-shell milestone, the cited evidence, the accepted cloze repair/review/integration receipts, and the calculator/session presentation code. Relevant source is `src/ExamCalculatorPanel.tsx`, calculator/session CSS, and the `SessionView`, `QuestionCard`, and `CaseStudyControl` integration points in `src/App.tsx`. Read `src/examCalculator.ts` as the read-only arithmetic authority and `src/examLayout.ts` as read-only layout-routing authority.

**Serial baseline rule:** do not launch this producer until the cloze repair is independently accepted and integrated into `main`. At owner launch, create the new isolated branch from that accepted `main` and record its full SHA as `EXECUTION_BASE`, plus the accepted cloze commits and review. The planning snapshot is not a command to check out stale cloze code. This baseline rule can be reviewed/frozen before the future cloze commit exists.

Verify the planning commit is an ancestor and inspect intervening relevant changes. The expected predecessor is the accepted cloze repair plus its evidence/history. An unreviewed cloze producer branch is not an admissible base. Unexpected conflicting production work requires owner disposition; do not merge or reconcile it opportunistically. Compare protected files against the recorded `EXECUTION_BASE`, not obsolete pre-cloze hashes.

Record this work order's path/hash and re-read after compaction. Preserve its owner-side untracked copy. Record owner HEAD/status before and after; perform all work in the isolated worktree. Do not read, alter, stage, stash, clean, reset, or remove P27 audition material or any unrelated default-checkout files. Report concurrent untracked growth accurately. Use `git worktree remove` for disposable Git worktrees; retain the producer worktree for review.

## 3. Presentation decision and scope

The proposed product contract is **coexistence in normal portrait**, with a bounded reduced-height fallback rather than a second calculator product. On normal mobile portrait, the learner can use the open calculator and activate the currently applicable Study actions without first closing it. On the reduced-height tier defined in §4B, top-bar and Study action targets still remain uncovered, while question/answer controls may use an explicit minimize → read/answer → reopen workflow. Keep `role="dialog"` / `aria-modal="false"`, the mobile bottom-sheet product, existing action labels and handlers, and the hidden learner bottom navigation during active Study.

**Owner decisions.** The normal-portrait minimum `band` at Default text is **6rem**; Large requires only positive separation as specified below. Reduced-height screens may rely on minimize/reopen to reach question and answer controls, provided calculator state survives that cycle. The same minimize → answer → reopen fallback is authorized for **answer controls only** in normal portrait at Large text when the available positive band is shorter than the answer control's actual activation element. Study action targets and top-bar controls do not receive that fallback and must remain uncovered. `667×375` remains the existing bottom-sheet product for R1; a landscape side-dock is out of scope and would require a separate owner decision.

Prefer CSS. A small, session-scoped measurement/ref hook or pure geometry helper is allowed if needed to handle the actual changing sheet/action heights. It must be ephemeral, clean up observers/listeners/styles on close and unmount, and not create persisted settings or a general overlay manager. Do not hard-code the old 43.6 px overlap as the fix.

| Path | Authorized scope |
|---|---|
| `src/styles.css` | Calculator sheet/launcher bounds, internal scrolling, and narrowly scoped Study action/content clearance. Preserve unrelated shell/theme/clinical selectors. |
| `src/ExamCalculatorPanel.tsx` | Presentation refs, measured bounds, internal scroll wrappers, and ephemeral layout coordination. Keep arithmetic, existing keys, focus/minimize, and desktop drag semantics. |
| `src/App.tsx` | Minimal presentation hooks/classes/refs at `SessionView`, `QuestionCard`, or `CaseStudyControl` if necessary. Preserve control existence conditions, keys, callbacks, readiness, and navigation logic. |
| `src/calculatorLayout.ts` or `src/useCalculatorLayout.ts` | At most the narrowly justified new layout helper(s); no state-engine or contract migration. |
| `scripts/tests/mobile-calculator-clearance.mjs` | Repeatable browser regression, with tightly scoped test-only helper(s) as needed. |
| `audit/mobile-calculator-action-clearance-r1/**` | New task-owned evidence and receipt. |

No edits to cloze rendering or its accepted regression, clinical visual renderers, banks, schema/types, grading, storage, migrations, sampler, session-navigation/start-guard logic, completed memory, import/loading, arithmetic reducer, packages, census artifacts, or accepted historical evidence. Do not alter the learner-shell IA, apply page-wide clipping, or move arithmetic/state into `App()`.

## 4. Acceptance contract

### A. Measured clearance, not z-index concealment

At mobile widths (the existing 780 px breakpoint), the open sheet and closed launcher must not cover applicable visible Submit, Submit all parts, case-part navigation, session actions such as Skip/Next/Finish, or the sticky session top bar's controls (exit/back and language mode). Also include every answer control of the current question or active case part, reachable according to §4B, including the last answer control. For answer controls, the target is the control's activation element (its input, button, or select, or its clickable label/container when that is the actual hit target), scrolled into the band; the §5 geometry and sample points apply to that activation element, not to an entire wrapping option/matrix row that merely contains it. In normal portrait at Large text, if the available band is shorter than that activation element, the minimize → answer → reopen fallback applies to answer controls only. Do not move the overlap from Submit to the lower action row, top bar, answer surface, or calculator keypad.

For each visible target, record rectangles and calculate:

```text
intersectionWidth  = max(0, min(panel.right, target.right) - max(panel.left, target.left))
intersectionHeight = max(0, min(panel.bottom, target.bottom) - max(panel.top, target.top))
```

Require no positive-area intersection beyond 1 CSS px rounding tolerance. Also establish that the target exists, has a nonzero rectangle, is within the current viewport when tested, and receives ordinary pointer/keyboard activation. Use hit testing and real unforced clicks, not `force: true` or direct handler invocation. An offscreen, hidden, removed, disabled-to-avoid-use, or pointer-disabled action is not a passing repair. Preserve legitimately disabled readiness states and separately test enabled states.

Test top/middle/end scroll positions on long content. Actions that normally require scrolling need not become permanently fixed at page load, but they must be scrollable into a usable, nonoverlapped position while the calculator remains open. In the normal portrait witness, the existing visible Submit must not simply be pushed out of reach.

### B. Tiered viewport and safe-area behavior

Define `band = sheet.top − topbar.bottom` with the sheet open. Preserve the existing keypad touch-target sizes; do not globally shrink text or keys to fit.

**Normal portrait — 390×844 and 320×740, Default and Large.** The full keypad is visible without internal scrolling. At Default text require `band >= 6rem`; at Large require `band > 0`. All applicable Study action targets and top-bar controls remain uncovered. At Default text, answer-control activation elements remain ordinarily reachable while the calculator stays open. At Large text, they also remain reachable while open when the positive band can contain the activation element; when it cannot, answer controls alone may use minimize → answer → reopen, with calculator state preservation proved as in the reduced-height tier.

**Reduced height — 390×568 and 667×375.** Keep the existing bottom-sheet product; do not introduce a side-docked landscape variant in this commission. The sheet must fit between the sticky top bar and the Study action reservation. The calculator header and minimize control stay fixed/reachable; the display and keypad use bounded internal scrolling when needed, with every calculator key reachable and no cut-off last row. `band` may be `0`. In this tier, question and answer controls may be reached through **minimize → read/answer → reopen** rather than while the full sheet remains open. The receipt must prove the displayed value and pending operator survive that minimize/reopen cycle. Study action targets and top-bar controls themselves remain uncovered in every tier.

No trapped scrolling, permanent body scroll lock, horizontal overflow, or hidden action target is acceptable. If a tier's threshold cannot be met, stop for owner disposition rather than silently change the threshold or product behavior.

Preserve safe-area clearance without double counting it. Validate normal and reduced-height viewports and, where feasible, a nonzero bottom inset. A test-only 24 px inset exercise is acceptable only if it demonstrably feeds the same layout-reservation path as the real inset; label it simulated. A mobile viewport with computed inset 0 is **not** proof of nonzero-safe-area behavior. If that branch cannot be exercised, disclose the remaining gap for independent review rather than claim it passed.

### C. Keep interaction and lifetime behavior

Opening focuses the calculator; minimize and Escape restore focus to its launcher. Pointer and keyboard arithmetic remain unchanged; `2 + 3 = 5` is the browser smoke, while existing reducer tests cover the arithmetic contract. Enter/Equals while operating the calculator must not submit the question; Escape must not abandon the session.

Minimize/reopen retains the current calculation as before. Preserve the current calculator mount key in Study (`session.id` plus parent `question.id`): advancing to another question/session resets it as the existing implementation does; navigating parts of the same parent case must not acquire a new reset behavior. Geometry observers/offsets must not survive close, navigation, or unmount or alter persisted answers.

Do not change the visibility/readiness/handler of Submit, Submit all parts, Skip, Next, Finish, or the case-part controls. Complete an ordinary question with the calculator open, and a complete case through its existing submit path, using normal actions. Keep the active-session protection and finite-pass rules intact.

### D. Contain the repair's reach

Desktop remains draggable and clamped; do not disable dragging or impose the mobile sheet globally. The 781–820 px interval uses desktop calculator behavior while the case layout remains narrow; test this crossover rather than assuming the breakpoints are identical. At desktop widths, require no new regression relative to baseline, not a new guarantee that a deliberately user-dragged overlay can never cover content. At widths ≥781 px, explicitly confirm that the existing `.question-card` right-side reservation selector using `:has(… .exam-calculator)` still matches and produces its intended reserve if the producer changes any calculator class or wrapper.

The shared Preview Lab calculator must still open, calculate, and minimize without reserving space for nonexistent Study action rows. Leaving Study removes any clearance reservation. The accepted cloze width repair must continue to pass.

## 5. Bounded test matrix and executable regression

Pin the original ordinary-question witness and second question `claude_a_mc_dabigatran_teaching_03`, the accepted cloze witness, one matrix item, and one real multi-part case. Record exact bank/parent/part IDs and fingerprints; assert the rendered identity/state before measuring. Use canonical content unchanged in disposable test profiles. Do not use the owner's progress or browser profile.

Cover the following groups pairwise, not every possible cross-product:

| Group | Required coverage |
|---|---|
| Core geometry | 390×844 and 320×740, Default and Large: launcher closed, open sheet, unsubmitted-disabled and ready Submit, post-submit Next/Finish, and close/reopen. |
| Case / content | Ordinary, matrix, accepted cloze, and case with wrapping part controls; scroll top/middle/end; ready Submit all parts and post-submit case navigation. |
| Height / appearance | 390×568 and 667×375 reduced-height probes; record whether `EXECUTION_BASE` already clips or internally hides keypad/display content at 667×375 before repair; one dark + Large run; one Compact run; the inset exercise described in §4B. |
| Breakpoints | Open-panel resize across 780/781 and 820/821 px, then return to mobile; no stale offsets or offscreen panel. |
| Desktop / Preview | 1440×900 open/drag/clamp/minimize; one narrow Preview Lab calculation; exit to Study root with no leftover reservation. |
| Lifetime | Keyboard arithmetic/Escape, focus return, submit while open, next-question reset, same-parent part navigation, and draft/session persistence. |
| Offline | Final `file://` build: ready ordinary Submit with calculator open and clear, arithmetic, submit → next, and minimize/focus return. |

The required mobile geometry checks include actual visible targets and ordinary hit testing. Persist raw rectangles, viewport/visual-viewport measurements, computed relevant offsets, open state, theme/text/inset conditions, and screenshots for the failing baseline and repaired candidate.

Create `scripts/tests/mobile-calculator-clearance.mjs` with target-URL and explicit output-directory arguments. Resolve existing or isolated external Playwright tooling through `PLAYWRIGHT_MODULE`; do not change project dependencies. Use system Chrome, ordinary web security, and disposable profiles. Record the actual browser/transport and whether a condition was emulated. Dark theme is established by persisted `themeMode` / `data-theme`, not only `colorScheme`.

**Red/green requirement:** the decisive assertion is geometric plus hit-testing, and it runs before any click:

1. Reach a genuinely ready state with the calculator closed by selecting/completing the answer; then open the calculator.
2. Record panel/sheet and target rectangles at the current scroll position and compute the intersections from §4A.
3. Sample `document.elementFromPoint` at the target center and at points 4 CSS px inside each corner. Each sample must resolve to the target itself or a descendant of that target; a hit outside the target subtree is typed `OVERLAP`.
4. Only after geometry and hit testing pass, perform an ordinary unforced click with a short actionability timeout.

Record `scrollY` before and after each decisive sample. A scroll change caused by Playwright auto-scroll invalidates that sample, except during an explicit scroll-to-reach step that is separately recorded. On `EXECUTION_BASE`, the expected red is a typed `OVERLAP` with recorded rectangles/hits. A click timeout without a prior recorded `OVERLAP` does not count as reproduction. The identical repair assertion must pass against the candidate. Missing fixtures, hidden/offscreen controls, navigation errors, or tool failures do not count as baseline reproduction. If the admitted base no longer exhibits the defect, report that evidence rather than manufacture a patch.

The old integration runner is not a repair oracle: it deliberately requires positive overlap, has historical hard-coded blob identities, and overwrites its old evidence paths. Inspect and reuse only appropriate setup/fixture logic in the new runner. Do not modify the old runner or turn the old evidence into a fictitious repair pass.

For `file://` console attribution, allowlist only the inherited manifest failure signature already recorded by the accepted integration: a `manifest.webmanifest` CORS diagnostic and its paired `net::ERR_FAILED`. Match it narrowly to the manifest request; do not ignore console errors wholesale. Any other new warning/error remains evidence to investigate.

## 6. Verification and protected behavior

Capture logs and exit codes for:

```bash
npx tsc -b --pretty false
npm run test:calculator
npm run test:exam-layout
npm run test:case-completeness
npm run test:session-navigation
npm run test:session-start-guard
npm run build
git diff --check
```

Run the new clearance regression plus the accepted cloze regression on the final candidate. Run targeted helper tests if new geometry code is added. Existing `test:calculator` tests reducer arithmetic, and `test:exam-layout` tests routing/stage visibility; neither proves DOM clearance. Do not substitute them for browser evidence.

Show protected-path object/hash equality against `EXECUTION_BASE`, including the arithmetic reducer, banks/visuals, data/session engines, package/census files, and prior evidence. If App presentation wiring changes, provide a function-bounded diff or AST-based comparison proving handlers, gates, and cloze functions are unchanged. If panel code changes, enumerate the positioning-only changes and prove no reducer/key/lifetime/focus behavior was silently replaced. No routine bank/census regeneration or replay of the entire old shell review is required.

## 7. Receipt, external review, and stopping

Write `audit/mobile-calculator-action-clearance-r1/implementation-receipt.md` with work-order hash, exact execution base and accepted cloze dependency, producer/branch/worktree, source-grounded cause, changed files, geometry strategy, red/green evidence, fixture manifest, commands/results, browser matrix, actual versus simulated inset/viewport coverage, offline result, focus/lifetime proof, protected-path proof, owner-checkout preservation, and limitations. Identify tested production commit and final evidence tip; do not attempt a self-referential commit hash.

Bounded implementation/evidence delegation is allowed under current `AGENTS.md`; no recursive delegation. Disclose actual contributors. The producer's delegation tree cannot supply the producer-independent checker. The independent checker reads the new runner's assertions and fixture-identity checks, reruns it against both `EXECUTION_BASE` and the candidate, and takes at least one decisive witness measurement with a probe the checker writes independently rather than reusing the producer runner. Independent code review and reproduction of the decisive clearance/interaction checks are still required; acceptance of the old shell does not accept this new code.

Commit the bounded repair/tests/evidence on the producer branch and stop. Do not update `PROJECT-HISTORY.md`, push, merge into `main`, deploy, clean another worktree, repair another defect, or resolve an unrelated integration conflict.

Success terminal: `PROJECT_SHRIMP_MOBILE_CALCULATOR_R1_READY_FOR_INDEPENDENT_REVIEW`  
Blocked terminal: `PROJECT_SHRIMP_MOBILE_CALCULATOR_R1_BLOCKED`

Necessary out-of-scope changes, inadmissible base, unavailable required proof, regression, or unmet acceptance are blocking: report the specific gap and preserve the worktree. An environment limit is not an automatic waiver. If the cloze commission is withdrawn, ends BLOCKED, or is not independently accepted/integrated, this calculator order remains held; only an explicit owner amendment may release it against then-current `main`. No implementation launch is authorized by this draft.
