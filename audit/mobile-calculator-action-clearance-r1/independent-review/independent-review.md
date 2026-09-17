# Mobile calculator / Study action clearance R1: independent review

`PROJECT_SHRIMP_MOBILE_CALCULATOR_R1_INDEPENDENT_ACCEPT`

**Checker seat:** Claude Code / Claude Opus 5 (`claude-opus-5`), in a fresh context separate from the Codex producer and its delegates.
**Date:** 2026-09-17
**Mode:** independent acceptance review under R3 §7. Review evidence only; no production or test files were modified. Nothing was pushed, merged, deployed, or recorded in `PROJECT-HISTORY.md`.

## 1. Snapshot and authority

| Item | Value | How it was checked |
|---|---|---|
| Governing order | `MOBILE-CALCULATOR-ACTION-CLEARANCE-CODEX-WORK-ORDER-2026-09-16-R3.md` | Read in full from the owner checkout |
| R3 SHA-256 | `e4f35dc21f512e97a061b86a21150b95435e6c4a2f163bc65a45cbba4cbbc37f` | `shasum -a 256` at start and at close; matches both times |
| Launch authorization | `MOBILE-CALCULATOR-R3-CODEX-LAUNCH-AUTHORIZATION-2026-09-16.md` | Read in full |
| Execution base | `adcbff3baedf61461ba73b14b7d029f8324c8bfc` | Owner HEAD at start and close; `merge-base --is-ancestor` base → `3fac6f1` holds |
| Tested production commit | `3fac6f1a26a217d9108f7ec1ba3b29562570451a` | Ancestor of the evidence tip |
| Reviewed evidence tip | `1a2afd78b1a4e1762fc21b8eb4090f7a960176d8` | Producer worktree HEAD. `git status --porcelain` is empty at start and close |
| Evidence-only commits | `3fac6f1..1a2afd7` touch only `audit/mobile-calculator-action-clearance-r1/**` | `git diff --stat 3fac6f1 1a2afd7 -- . ':!audit/mobile-calculator-action-clearance-r1'` is empty, so the evidence-tip build has the same production bytes as the tested commit |
| Review branch / worktree | `claude/mobile-calculator-action-clearance-r1-review` at `/Users/holemini/Desktop/Project Shrimp Calculator R1 Review`, created from `1a2afd7` | |

## 2. Scope (independent)

`git diff --name-only adcbff3 1a2afd7` lists exactly these five paths outside the new evidence directory:

- `src/styles.css` (+90, appended at the end of the file)
- `src/ExamCalculatorPanel.tsx`
- `src/useCalculatorLayout.ts` (new)
- `scripts/tests/mobile-calculator-clearance.mjs` (new)
- `scripts/tests/mobile-calculator-desktop.mjs` (new)

Because a Git diff lists every changed path, this independently proves that every other tracked path is object-identical to the base. As spot checks, I compared blob object IDs between base and tip for `src/App.tsx`, `src/examCalculator.ts`, `src/examLayout.ts`, `src/grading.ts`, `src/schema.ts`, `src/types.ts`, `src/storage.ts`, `src/sessionState.ts`, `package.json`, `package-lock.json`, `census.json`, `banks/claude-canonical.json`, `banks/gpt-canonical.json`, the accepted cloze runner, `PROJECT-HISTORY.md`, and the cloze integration receipt. All are SAME. Under `audit/`, the diff contains only additions (`A`) inside the new task directory, so no prior evidence was modified.

The producer's `verify-scope.mjs` builds its proof from `git ls-tree -r` object and byte comparison against the hard-coded base, with an allowlist that matches R3 §3. That construction agrees with my direct check. I did not rely on its AST claims, because App.tsx is object-identical and the panel diff was read in full (§3).

## 3. Code review

### `src/ExamCalculatorPanel.tsx`

The diff adds one import, a `rootRef`, one `useCalculatorLayout(rootRef, open, isMobile)` call, `ref={rootRef}` on the existing root, and a `.exam-calculator-body` wrapper around the unchanged display and keypad. Reducer wiring, key definitions and dispatches, focus, minimize and Escape handlers, drag and clamp, and the `aria` attributes are untouched. The Study mount key in App.tsx (`${session.id}:${question.id}`) is unchanged, since App.tsx is object-identical.

**Desktop side effect of the wrapper.** At desktop sizes `.exam-calculator` is a grid, so wrapping two grid children could have shifted spacing. My probe measured the open desktop panel at 1440×900 on the exact base and on the candidate. Panel, display, keypad, and Equals rectangles are identical to the sub-pixel, and the `.question-card` `:has()` reserve stays at `320px` in both (`probe/base-desktop.json` vs `probe/candidate-full.json`, scenario 3).

### `src/useCalculatorLayout.ts`

- **`.session-shell` resolution.** Study renders `<ExamCalculator>` only in the main `SessionView` return, as a direct child of `section.session-shell` (App.tsx ~2780–2838). The skipped-prompt and legacy-submitted shells do not mount it. Preview mounts it outside any `.session-shell` (App.tsx 2224), so `closest()` returns null and the hook exits early. The Preview run confirms that no offsets were inherited.
- **`.submit-button` resolution.** Across all of `src`, the class occurs only twice. One is the ordinary Submit, rendered only when `!submitted && !reviewMode && itemType !== "case_study"`. The other is the case "Submit all parts", rendered once per case in `.case-work-footer`, outside the per-part `hidden` containers, and only when `showTopLevelSubmit` (unsubmitted, non-review). These conditions are mutually exclusive, so a Study shell holds at most one `.submit-button`. The hook therefore cannot pick a stale, hidden, other-part, or unrelated Submit. `:scope > .session-actions` and `:scope > .session-topbar` are likewise unique direct children.
- **Re-measurement.** A subtree `childList` MutationObserver catches Submit removal and action-button swaps. A ResizeObserver on each measured element catches text wrapping, and `window`/`visualViewport` resize listeners catch viewport changes. All of these funnel through one rAF-coalesced `measure()`, which also unobserves elements that have left the DOM. The measured sheet height feeds only shell `padding-bottom`, and the actions and Submit heights feed the sheet position one way, so no feedback cycle exists. The adversarial probe (§6) confirms that the values track the live DOM.
- **Cleanup.** Effect dependencies are `open` and `mobile`, and the key remount covers question and session changes. Cleanup cancels the pending frame, disconnects both observers, removes both listeners, and removes all four inline properties. My probe observed an empty shell `style` after minimizing and after crossing to 800px. The producer's records show the same after exit (`exit-cleans-reservation`), after crossover close (`crossover-close-cleanup`), and on every minimize (`STALE_OFFSETS_CLOSE` assertion).
- **Persistence, answers, navigation.** The hook reads rectangles and writes only inline custom properties. There are no state, storage, or handler references.

### Mobile CSS

- Every new rule sits inside `@media (max-width: 780px)`. Apart from two neutral rules on `.exam-calculator` and `.exam-calculator-body` (grid rows and bounded body scroll), each rule is scoped to `.session-shell` and the open-calculator `:has()` state, so desktop and closed Study are unaffected. Specificity of `.session-shell:has(> .exam-calculator-root.is-open)` is (0,3,0), which beats the existing `.session-active .session-shell` and `.session-active .submit-button` rules as intended.
- **Fixed top bar, actions, and Submit.** Shell `padding-top` equals the measured top-bar height. `padding-bottom` equals sheet height plus action reserve plus 1rem. Long content can therefore scroll into the band above the sheet and below the top bar, rather than sitting permanently beneath the fixed layers. This is shown by 48 top/middle/end geometry records on the long case, and by the case Submit all parts at `scrollY` 3816 and 4949 clearing with five inside hits.
- **Safe-area routing.** In the open state, every consumer of the safe area reads `--calculator-safe-bottom`: action padding, action min-height, and Submit bottom. The sheet's own `env()` padding is zeroed, and the sheet sits above the measured actions, so the inset is not counted twice.
- **34% Submit column.** This is presentation only; the handler, label, and disabled state are unchanged. At 320px with a wrapped label, Submit is 91.6px tall, and the measured actions min-height and sheet position follow it with zero overlap (§6).
- **Closed launcher.** It moves into grid row 2 (static, right-aligned below the top bar), so it cannot cover content. Consequence: when closed, it scrolls with the page instead of floating. R3 does not require a persistently visible launcher, so this is not a defect. It is noted as a product observation (§10).

No code-review finding rises to an R3 defect.

## 4. Producer oracle audit

I read `scripts/tests/mobile-calculator-clearance.mjs` (runner SHA-256 `5b253be8…6736e`, identical to the producer's recorded hash) and the desktop helper.

| R3 requirement | Finding |
|---|---|
| Canonical fixture identity before measuring | `seed()` asserts theme, text size, and exact viewport, then calls `identity()`. `identity()` checks stored `questionIds[index]`, the fingerprint against `questionFingerprint(q)`, the rendered canonical `stem.en`, and the visible active case-part stem. `measure()` calls `identity()` before every geometry record. |
| Actual activation element | `.option-row` (role button), `.matrix-table td button`, `.cloze-select`, `.blank-input-row input`, `.order-buttons button`. Not wrapping rows. |
| Intersection with 1px tolerance | `max(0, min(right) − max(left))` on both axes. Overlap is typed only when both exceed 1px, and the check is skipped only for targets inside the calculator. |
| Center + four 4px-inset `elementFromPoint` checks | Implemented. A hit counts only if the element is the target or contains it (`el === hit \|\| el.contains(hit)`). Any foreign hit throws typed `OVERLAP`. |
| Measure before pointer | `checkedClick` runs `measure` → `assertClear` → click. Nothing is clicked if the assertion throws. |
| No forced or synthetic activation | No `force`, `dispatchEvent`, or `el.click()` anywhere. The three unchecked `.click()` calls are pre-open setup: Continue set twice, plus the witness answer selection made while the calculator is closed, which R3 §5 step 1 allows. |
| `scrollY` accounting | `measure` brackets with `scrollY`, and `assertClear` requires equal values. `checkedClick` installs a capture-phase `pointerdown` listener and asserts the `scrollY` at pointerdown equals the pre-click value, which directly catches Playwright auto-scroll. Scroll-to-reach operations are separate `explicit-scroll` records. |
| Large-text answer fallback | `reach()` minimizes only when `answer && (reduced \|\| (text === "large" && height > band))`. Otherwise it asserts `height <= band + 1`. `layout()` measures top-bar, action, and Submit targets with no fallback path. |
| Safe area | The actual value comes from a `position:fixed; height: env(safe-area-inset-bottom)` probe element. The simulated value is 24px, applied only via `--calculator-safe-bottom`, and each run is labeled actual or simulated. `SAFE_AREA_PATH` asserts action padding equals 0.65rem plus the applied variable. |
| `file://` allowlist | Allowed only when the protocol is `file:`, the message starts with `Access to manifest at '<exact manifest URL>'` and contains the CORS signature, plus the paired `net::ERR_FAILED` whose `location.url` is the manifest URL. The pair counts must be equal. Any other diagnostic fails the run. |

**Raw-record audit of my fresh candidate HTTP run.** The 2,264 records break down as 1,145 `geometry`, 420 `ordinary-click`, 357 `explicit-scroll`, 45 `tier`, 55 `answer-minimize-fallback`, 57 `explicit-keypad-scroll`, 84 `explicit-matrix-scroll`, 13 `native-select-activation`, 13 keyboard arithmetic, 48 desktop/crossover/Preview, and the remainder seeds and milestone records. They are real measurements and activations, not bookkeeping. Checked independently of the runner's own asserts:

- 0 of 1,145 geometry records change `scrollY`.
- 0 of 420 clicks have a pointerdown `scrollY` different from the pre-click value.
- Re-applying the R3 predicate (nonzero, in viewport, no >1×>1 intersection for non-calculator targets, five inside hits) to all 1,145 records yields 0 violations.
- Normal-portrait answer fallbacks occur only at `normal-320-large` (activation element 174.15625px vs band 170.6875px). Every other fallback label is `case-reduced-leaf-*`. None applies to a top-bar or action target.

The runner is a valid oracle for R3.

## 5. Fresh reproduction (independent builds)

**Environment.** System Google Chrome 152.0.7977.83, headless; Playwright 1.63.0 from `~/.npm/_npx/e41f203b7505f1fb`, independent of the producer's `/tmp/shrimp-omnibus-tools`; DPR 1 CSS-viewport emulation.

- **Exact base.** Fresh detached worktree at `adcbff3` in the checker scratchpad, tracked tree clean. `node_modules` was cloned from the owner checkout (package files are object-identical base↔tip). Built with `npm run build`, exit 0; `dist/index.html` SHA-256 `ed80de96…cb09`. Served at `http://127.0.0.1:4286/`. The producer's `/tmp/shrimp-calculator-execution-base` was not used.
- **Candidate.** `npm run build` in the review worktree at `1a2afd7`, exit 0; `dist/index.html` SHA-256 `723b58c4…6865`. Served at `http://127.0.0.1:4285/`, with `file://` from the same `dist`.

| Run (fresh output directory) | Exit / status | Decisive content |
|---|---|---|
| `producer-runner-base-witness/` (`--witness-only`, base) | 1 / **`OVERLAP`** | Enabled Submit; panel 8,382,462.625,844; Submit 20.78125,369.21875,730.8125,774.40625; intersection **348.4375 × 43.59375**; all 5 hits on calculator keypad or keys; `scrollY` 0→0; no Submit click recorded. This is a geometric red, not a timeout. |
| `producer-runner-candidate-http/` | 0 / PASS, **2,264** records, 0 diagnostics | Full R3 matrix (§4, §7) |
| `producer-runner-candidate-file/` | 0 / PASS, **93** records | Ordinary witness intersection 111.8 × 0 with 5 inside hits; `file-normal` ready Submit clears at `scrollY` 589; submit → Next → second → Finish; 6 diagnostics, all 3 allowlisted manifest pairs |
| `cloze-regression-http/` (accepted cloze runner, unchanged, SHA `3e661e3c…0667`) | 0 / PASS, **160** checks | Accepted cloze behavior intact |

Commands:

```bash
PLAYWRIGHT_MODULE=/Users/holemini/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs \
  node --import tsx scripts/tests/mobile-calculator-clearance.mjs --url http://127.0.0.1:4286/ \
  --output audit/mobile-calculator-action-clearance-r1/independent-review/producer-runner-base-witness --witness-only
# same with --url http://127.0.0.1:4285/ --output …/producer-runner-candidate-http
# same with --url "file://$PWD/dist/index.html" --output …/producer-runner-candidate-file
# node --import tsx scripts/tests/mobile-dropdown-cloze-layout.mjs --url http://127.0.0.1:4285/ --output …/cloze-regression-http
```

## 6. Review-owned probe

Source: `probe/independent-clearance-probe.mjs`. I wrote it for this review. It imports no producer test code; it uses only app source for `questionFingerprint` and `getCorrectAnswer`, and its own seeding, rectangle, hit, and scroll logic. Raw output: `probe/base-decisive.json`, `probe/candidate-full.json`, `probe/base-desktop.json`.

### Scenario 1: decisive original witness (390×844, light, Default, ready Submit)

| | Exact base | Candidate |
|---|---|---|
| Submit enabled before open | true | true |
| Panel (l, r, t, b) | 8, 382, 462.625, 844 | 8, 382, 390.234375, 747.609375 |
| Submit (l, r, t, b) | 20.78125, 369.21875, 730.8125, 774.40625 | 267.8125, 379.609375, 766.015625, 833.609375 |
| Intersection w × h | **348.4375 × 43.59375** | **111.796875 × 0** (18.4px vertical separation) |
| Center / TL / TR / BL / BR hits | keypad / `4` / `−` / `1` / `+` (all foreign) | all inside Submit |
| `scrollY` before / after measure | 0 / 0 | 0 / 0 |
| Unforced click | not attempted (gate failed) | clicked; pointerdown `scrollY` 0 = pre-click 0; answer banner rendered; calculator still open |

The base reproduces the R3 §1 historical rectangles exactly, and the candidate clears them.

### Scenario 2: adversarial check of the hook's measurements (candidate, real case `opus_psi_caregiver_2026_06_10_01`)

At each step, all four inline custom properties were compared with the live `getBoundingClientRect().height` of the current elements (tolerance 0.5px), and the pairwise overlap areas of panel, actions, Submit, and top bar were computed.

| Step | measured = actual | Values (actions / topbar / submit / sheet) | Overlap areas |
|---|---|---|---|
| open at 390×844 | ✔ | 88.39 / 114.56 / 67.59 / 357.38 | all 0 |
| resize to 320 (Submit column narrows, label wraps) | ✔ | 112.39 / 114.56 / **91.59** / 357.38 | all 0 |
| top-bar EN/ZH activation (ordinary click) | ✔ | unchanged | all 0 |
| crossover to 800 (desktop) | inline props **removed** | — | — |
| back to 320 | ✔ (re-measured) | 112.39 / 114.56 / 91.59 / 357.38 | all 0 |
| decisive gate on Submit all parts at `scrollY` 4949 | intersection 88 × 0, 5/5 inside hits, no scroll change; unforced click, pointerdown `scrollY` unchanged | | |
| post-submit (Submit removed from DOM) | ✔ | **65.38** / 114.56 / **0** / 357.38; actions now full width | all 0; post-submit Finish clears the 5-point gate |
| minimize | shell inline style empty | | |

The Submit height, actions reservation, and sheet position all follow the current DOM through wrap, crossover, and submission, with no stale geometry.

### Scenario 3: desktop wrapper regression

The 1440×900 open panel geometry is identical on base and candidate (§3).

## 7. Load-bearing cases confirmed from raw candidate records

| R3 case | Raw evidence (candidate HTTP unless stated) |
|---|---|
| 390×844 ready ordinary Submit | Probe scenario 1; runner `ordinary-ready-open-submit` |
| 320×740 Default / Large | `tier` band 170.6875 at Default (> 6rem = 96) and at Large (> 0); keypad body 303/303 with no internal scroll |
| 320 Large answer-only fallback | `normal-320-large-answer-0`: 174.15625 > 170.6875; state `5` / `Pending operator: +` restored after reopen |
| 390×568 reduced | Band 64; body 239/303; each of the 19 keys scrolled into view and checked by geometry, hits, and click, including the last row (57 keypad records across the three reduced runs) |
| 667×375 reduced landscape | Band 64; body 69/303; every key checked; header and minimize control reachable (screenshot inspected) |
| Real case with wrapping chips and Submit all parts | Six parts navigated; every leaf activation element checked; Submit all parts clears at `scrollY` 3816 (320 Large) and 1868 (reduced) |
| Top / middle / end on long content | 48 case geometry records plus ordinary, matrix, and cloze top/middle/end `layout()` passes |
| 780/781 and 820/821 crossover | `desktop-crossover-panel`: 780 mobile sheet; 781, 820, 821 desktop 288px panel; return to 390 mobile; `crossover-close-cleanup` all four properties empty |
| Desktop drag / clamp | Interior drag; top-left clamp at 8,8; bottom-right clamp at 1432,892 |
| Preview Lab | `preview-no-study-reservation`: `studyActions` 0, no inherited offsets; `2 + 3 = 5`; focus returns |
| Calculation / focus / reset lifetime | Keyboard `2+3` Enter gives `5` with no submission; Escape returns focus to launcher without leaving the session; next question resets to `0`/none; same-parent part navigation keeps `5`/`+`; draft survives reload with no AnswerEvent |
| Final `file://` ordinary flow | `producer-runner-candidate-file` PASS 93 |
| Accepted cloze regression | `cloze-regression-http` PASS 160 (the producer's cloze `file://` PASS 5 was not rerun; HTTP alone exercises the unchanged layout assertions) |
| Dark + Large, Compact | `matrix-dark-large` and `cloze-compact` pass; screenshots inspected |

Screenshots inspected: `normal-320-large-ready`, `short-landscape`, `case-post-submit`.

## 8. Deterministic reruns (candidate evidence tip, production bytes = `3fac6f1`)

| Command | Exit | Log |
|---|---|---|
| `npx tsc -b --pretty false` | 0 | `logs/cand-tsc.log` |
| `npm run test:calculator` | 0 ("Exam calculator regressions passed.") | `logs/cand-test-calculator.log` |
| `npm run build` | 0 | `logs/cand-build.log` |
| `git diff --check adcbff3 3fac6f1` and the worktree `git diff --check` | 0 / 0 | `logs/cand-diff-check.log` |

The base build log is `logs/base-build.log`. Code review and browser reproduction raised no concern that needed wider verification.

## 9. Safe-area classification

- **Actual:** the computed `env(safe-area-inset-bottom)` is 0px at every tested viewport. That is not evidence for a nonzero inset.
- **Simulated (24px):** applied through `--calculator-safe-bottom`, the same variable every open-state consumer reads (§3). The normal 390×844 band moves by exactly 24px (275.671875 → 251.671875). The reduced 390×568 band stays at 64 while the body shrinks 239 → 215. The `SAFE_AREA_PATH` assertion held on every tier.
- **Unverified:** nonzero safe-area behavior on a physical device. R3 §4B permits disclosing this gap, and it is disclosed.

## 10. Limitations and non-blocking observations

- Every browser result is a CSS-viewport emulation in desktop Chrome, not a physical iOS or Android device.
- At 667×375 the open scroll body is 69px, showing roughly the display alone, so every key requires scrolling inside the body. R3 §4B explicitly allows bounded internal scrolling in the reduced tier, and every key passed geometry, hit, and click checks. The producer kept a 4rem band so case navigation can scroll into view, where R3 allows a band of 0. This is a usability observation, not an R3 defect.
- While the calculator is open, a narrow strip of page content shows between the 66% action bar and the fixed 34% Submit. The two do not overlap and hit tests are clean, so this is cosmetic.
- The closed launcher now sits in document flow below the top bar instead of floating, so mid-page it needs a scroll to the top to reach. R3 does not require a persistently visible launcher, so this is outside R3.
- I did not rerun the accepted cloze `file://` runner, the remaining four `test:*` commands, or the scope-proof mutation guards. Their inputs are unchanged (object-identical) and no concrete concern arose.
- **Owner checkout:** HEAD `adcbff3`, with the same 16 top-level `git status --short` entries at start and close. I made no writes there; only Git worktree metadata was added and `node_modules` was read to clone it. The full untracked-file count is now 1,188, against the producer's earlier 1,124. I did not record that count at my own start, and the difference reflects concurrent owner-side work that I did not open or touch.
- The retained producer worktree is unmodified (HEAD `1a2afd7`, clean).

## 11. Disposition

The R3 contract is independently established. Scope is bounded, the code review found no defect, the producer oracle is valid, the base shows a fresh typed geometric `OVERLAP`, the candidate passes the full matrix over HTTP and `file://`, the review-owned probe shows red on base and green on the candidate, the hook's measurements track the current DOM through transitions, desktop and Preview are unaffected, and the cloze regression passes.

**`PROJECT_SHRIMP_MOBILE_CALCULATOR_R1_INDEPENDENT_ACCEPT`**

Control returns to the owner for integration and publication.
