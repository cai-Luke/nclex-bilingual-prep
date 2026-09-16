# Learner Shell R3 Concept A — independent review

**Status:** independent review complete (checker pass only)
**Review seat:** Claude Code (local shell), Claude Opus 5
**Producer seat under review:** Codex (GPT-6), primary seat
**Date:** 2026-09-15
**Mandate:** determine independently whether the completed implementation satisfies its frozen work order. No production code was modified.

---

## 1. Identity and integrity

| Item | Value |
|---|---|
| Frozen baseline | `511f66b7b7cb830649613793f0264725be25d450` |
| Implementation under review | `d581a66ff1a784d10e65b1b139d78c41851d45fa` |
| Producer evidence commit (full SHA) | `154d8520fcb0f183472994424acd42cdb64b817f` |
| Review branch | `claude/learner-shell-r3-concept-a-r1-review` |
| Review worktree | `/Users/holemini/Desktop/Project Shrimp Learner Shell R3 Review` |
| Baseline comparison worktree (throwaway, detached) | `/Users/holemini/Desktop/Project Shrimp R3 Baseline Throwaway` @ `511f66b` |

**Work-order hash.** Measured `shasum -a 256` of
`/Users/holemini/Desktop/Project Shrimp/LEARNER-SHELL-R3-CONCEPT-A-IMPLEMENTATION-WORK-ORDER-2026-09-13.md`:

```
521c5af27b13a774c75146c2431f210d47bea35161d44dba96d2f986b8c8e884
```

Expected: `521c5af27b13a774c75146c2431f210d47bea35161d44dba96d2f986b8c8e884` — **MATCH**. Re-measured identical at closeout.

**Commit topology, verified from git objects.** `codex/learner-shell-r3-concept-a-r1` → `154d852`; its parent is `d581a66`; `d581a66`'s parent is `511f66b`. Confirmed at start and at closeout.

**Producer immutability.** Producer branch SHA `154d8520fcb0f183472994424acd42cdb64b817f` at start **and** at closeout — unchanged. Producer worktree `git status --porcelain=v1 --untracked-files=all` was empty at start and at closeout. The producer branch and worktree were never checked out, committed to, rebased, amended, or reset by this seat.

**Owner checkout.** HEAD `f30224ec156984cebf64c1ef28802d2f02c6dcd1` at start **and** at closeout — unchanged.

The owner's untracked status is **not** byte-identical between the two snapshots, and this must be read precisely (`owner-status-delta.txt`):

- nothing was removed from the start snapshot;
- no tracked file was modified (every delta line carries the `??` code);
- all 319 added entries lie inside `audit/gemini-p27-content-judgment-requalification-2026-09-13-r2/`, the unrelated concurrent P27 requalification lane that the commission itself flagged as out of scope.

**No file in the owner checkout was created, edited, staged, moved, stashed, cleaned, reset or deleted by this seat.** The growth is attributable to the concurrent P27 lane running in parallel with this review, not to it. Snapshots: `owner-status-start.txt`, `owner-status-end.txt`, `owner-status-delta.txt`.

---

## 2. Diff and invariance — derived independently from git objects

The producer's `verify-invariance.mjs` was **not** executed and is not relied on as proof. Everything below was re-derived from git objects and from an AST-based comparator written for this review (`function-compare.mjs`).

### 2.1 Changed-file inventory

`git diff --name-status 511f66b d581a66`:

| Status | Path | Justification |
|---|---|---|
| M | `src/App.tsx` | Learner IA and Study-root restructure. Expected surface, work order §9. |
| M | `src/styles.css` | Concept A palette/shape/density translation. Expected surface, work order §9. |
| A | `audit/learner-shell-r3-concept-a-r1/baseline-file-smoke.mjs` | Task-owned verification helper, permitted by §11.2. |
| A | `audit/learner-shell-r3-concept-a-r1/browser-smoke.mjs` | Task-owned verification helper. |
| A | `audit/learner-shell-r3-concept-a-r1/verify-invariance.mjs` | Task-owned verification helper. |

No other path changed. No production file outside the two declared files was touched.

`git diff --name-status d581a66 154d852`: **36 paths, every one under `audit/learner-shell-r3-concept-a-r1/`** (logs, JSON evidence, receipt, 17 screenshots). The evidence commit is genuinely evidence-only, so the tested build equals `d581a66`. Running the deterministic floor from `154d852` is therefore valid.

### 2.2 Protected-path invariance (blob SHAs)

Every protected path is **byte-identical** between `511f66b` and `d581a66`, proven by equal blob/tree object IDs (`invariance-independent.json`):

| Path | Blob (both revisions) |
|---|---|
| `src/storage.ts` | `e00acd25cc24…` |
| `src/progressMigration.ts` | `cdb0b3988ade…` |
| `src/sessionSampler.ts` | `deeea8a07c4b…` |
| `src/grading.ts` | `9b8b4ffcc2ac…` |
| `src/schema.ts` | `8295463e6c53…` |
| `src/types.ts` | `d415d089272c…` |
| `src/banks.ts` | `8f864863b053…` |
| `src/bankImport.ts` | `b7ff03ba27f7…` |
| `src/completedMemory.ts` | `5b09d3c372b5…` |
| `src/sessionState.ts` | `d6aa8f5d6b5d…` |
| `src/sessionNavigation.ts` | `854012b51c69…` |
| `src/sessionStartGuard.ts` | `1832b2fb70bb…` |
| `src/examCalculator.ts` | `72f7ea4b3154…` |
| `src/ExamCalculatorPanel.tsx` | `75959f7a486e…` |
| `src/examLayout.ts` | `666bee82b6ee…` |
| `package.json` | `bfe7124f6d2c…` |
| `package-lock.json` | `619990b540ab…` |
| `census.json` | `19cafeb5205d…` |
| `BANK-CENSUS.md` | `e1f135dda718…` |
| `banks-provenance.json` | `e077841dde8d…` |
| `BANK-REVIEW-LEDGER.md` | `b7bb64792f97…` |
| `PROJECT-HISTORY.md` | `5c076ebd88ad…` |

Whole-tree object IDs, identical in both revisions:

| Tree | Object |
|---|---|
| `banks/` | `102eb36f5e1e…` |
| `src/visuals/` | `958bc056b913…` |

`scratch/learner-shell-r3/**` is tracked in **neither** revision, as expected. No dependency changed. `PROJECT-HISTORY.md` was correctly left untouched on the producer branch (§9).

### 2.3 Mechanical function and handler comparison

Comparison was performed with the TypeScript compiler API, extracting each top-level function declaration and each declaration inside `App()` by AST node range and hashing the exact source text.

> Method note: a first attempt used brace matching and mis-parsed functions with destructured parameters, understating the diff. That comparator was discarded; all figures below come from the AST comparator, which reproduces the producer's numbers exactly.

**Top-level functions: 48 in both revisions — 43 byte-identical, 5 changed.**

Byte-identical (43) includes every load-bearing rendering and session surface: `SessionView`, `QuestionCard`, `QuestionAnswerControl`, `BowtieControl`, `HighlightControl`, `OptionAnswerControl`, `FillInBlankControl`, `MatrixControl`, `DropdownClozeControl`, `ClozeLine`, `CaseStudyControl`, `CaseStudyStackedLayout`, `CaseChartPane`, `CasePartNavigator`, `CaseActivePart`, `CaseExhibit`, `BilingualText`, `GlossaryText`, `SpeakButton`, `ReadAllButton`, `TranslateAllButton`, `GptRescueButton`, `RationalePanel`, `SummaryView`, `DraftAnswer`, `SummaryStemText`, `SessionBuilderView`, `DashboardView`, `ImportView`, `PreviewLab`, `DeveloperReviewConsole`, `AppUpdateBanner`, `Metric`, and others.

Changed (5):

| Function | Change | Assessment |
|---|---|---|
| `App` | Navigation shell, view chrome, prop wiring | Expected |
| `HomeView` | Study action bay + memory dock | Expected |
| `LibraryView` | Adds subordinate `Import a bank` action | Work order §4.1 |
| `SettingsView` | Adds dev-gated `Developer` entry | Work order §4.1 |
| `MemoryList` | **Single line**: `<button onClick={onHome}>Home</button>` → `Back to Study` | Work order §8 (clear return path to Study) |

The producer's claim that `MemoryList` "differs only in its root-return label" is **exactly correct** — verified as a one-line diff.

**Inside `App()`: 71 declarations byte-identical, 1 removed, 4 added, 0 modified.**

Every session and memory handler is **byte-identical**: `requestSessionStart`, `keepCurrentSet`, `confirmSessionStart`, `performSessionStart`, `performAdaptiveSessionStart`, `persistCompletion`, `finishSession`, `retryCompletion`, `updateAnswer`, `submitCurrent`, `skipCurrent`, `reviewSkippedQuestions`, `goNext`, `toggleFlag`, `openBuilder`, `practiceOne`, `updateSettings`, plus every `useEffect` and every piece of state, and the memos `allRecords`, `recordsById`, `filteredRecords`, `builderRecords`, `missedRecords`, `flaggedRecords`.

The complete pre-`return` region diff is exactly, and only:

```diff
-  const answeredRecords = useMemo(
-    () => allRecords.filter((record) => (progress[record.question.id]?.seen ?? 0) > 0),
-    [progress, allRecords],
-  );
+  const showLearnerNavigation = view !== "session" && view !== "previewLab" && view !== "review";
+  const primaryView = view === "inspect" ? inspectionReturn : view === "summary" ? sessionReturnView : view;
+  const studySelected = ["home", "builder", "needsReview", "saved", "lastSet"].includes(primaryView);
+  const librarySelected = primaryView === "library" || primaryView === "import";
```

`answeredRecords` fed only the removed hero `Answered` metric, whose removal is required by §5.3. The load-bearing claim holds.

### 2.4 `src/styles.css`

- **Semantic state tokens byte-identical** in both the light and the dark block: every `--state-correct-*`, `--state-incorrect-*`, `--state-flagged-*`, `--state-missed-*`, `--state-selected-*`, `--panel-warn-*`, `--evidence-*`, `--hard-surface` value is unchanged (sorted-set diff empty). Answer correctness remains exactly as legible as at baseline.
- **No clinical-renderer or light-lock selector changed.** The `.rhythm-strip*` block, including `.rhythm-strip-svg { color-scheme: light; … background: #fff8fa; }` and every `.vis-*` rule, is byte-identical.
- **Palette matches the §6.1 anchors precisely.** Light `--accent: #1e3a8a`, `--accent-surface: #eff6ff`. Dark `--app-bg: #0c111d`, `--surface: #161f30`, `--surface-muted: #1c283e`, `--accent: #3b82f6`.
- **The claimed item-type badge dark-contrast fix is presentation-only**: `.type-pill { color: var(--badge-bg) }` → `color: var(--text-muted)`. One colour property; no layout, state or semantic effect.
- Mobile bottom navigation is safe-area-aware on all sides, and bottom content reservation (`padding-bottom: calc(6rem + env(safe-area-inset-bottom))`) is correctly scoped to `.learner-navigation main`, so it does not apply during active Study.

### 2.5 Learner-visible copy

Every changed string concerns navigation/workspace presentation: `Home` → `Back to Study` (×3 sites), `NCLEX Bilingual Prep` → `Study NCLEX-RN`, new eyebrow/heading/`Around your Study`/memory detail lines, `Import a bank`, `Developer`, `Back to Library`. **No clinical, grading, rationale, Review or memory semantic string changed.** Chinese scaffold strings were moved into `<span lang="zh-Hans" class="shell-scaffold">`, which is an improvement against §10, not a regression.

---

## 3. Deterministic floor — rerun independently

Run in the review worktree at `154d852` (valid: §2.1 established the evidence commit is evidence-only), after `npm ci`. Logs in `logs/`.

| Command | Exit | Log |
|---|---|---|
| `npx tsc -b --pretty false` | 0 | `logs/01-tsc.log` |
| `npm run test:review-memory` | 0 | `logs/02-review-memory.log` |
| `npm run test:session-start-guard` | 0 | `logs/03-session-start-guard.log` |
| `npm run test:session-navigation` | 0 | `logs/04-session-navigation.log` |
| `npm run test:session-sampler` | 0 | `logs/05-session-sampler.log` |
| `npm run test:exam-layout` | 0 | `logs/06-exam-layout.log` |
| `npm run test:calculator` | 0 | `logs/07-calculator.log` |
| `npm run test:app-update` | 0 | `logs/08-app-update.log` |
| `npm run build` | 0 | `logs/09-build.log` |
| `git diff 511f66b d581a66 --check` | 0 | — |

After `npm run build`, `git status --porcelain=v1` showed only this review's own untracked directory. **No tracked-file drift; no census or bank movement.** `package.json`/`package-lock.json` were not modified.

---

## 4. Independent browser review

System **Google Chrome 152** driven through Playwright 1.63 with `channel: "chrome"`, normal web security, a disposable profile per scenario, canonical bundled questions only. Runners were written for this review (`review-runner*.mjs`, `ab-*.mjs`); the producer's `browser-smoke.mjs` was not reused or executed. No bank or source file was mutated. Raw results: `browser-results-1.json` … `browser-results-14.json`; 79 screenshots in `screenshots/`.

### 4.1 Scenario matrix

| Scenario | Viewport | DPR | Theme | Text | Transport | Result |
|---|---|---|---|---|---|---|
| Desktop Study root | 1440×900 | 1 | light | Default | http: | PASS |
| Desktop root, IA/overflow pass¹ | 1440×900 | 1 | light¹ | Default | http: | PASS |
| Mobile Study root | 390×844 | 3 | light | Default | http: | PASS |
| Mobile root, IA/overflow pass¹ | 390×844 | 3 | light¹ | Default | http: | PASS |
| Narrow root | 320×720 | 3 | light | Default | http: | PASS |
| **Dark** Study root (`data-theme`) | 1440×900 | 1 | **dark** | Default | http: | PASS |
| **Dark** Study root (`data-theme`) | 390×844 | 3 | **dark** | Default | http: | PASS |
| Mobile active Study: nav absent, sticky controls, calculator | 390×844 | 3 | light | Default | http: | PASS |
| Replacement dialog (protected session) | 1440×900 | 1 | light | Default | http: | PASS |
| Replacement dialog (protected session) | 390×844 | 3 | light | Default | http: | PASS |
| Replacement dialog, Large text | 390×844 | 3 | light | **Large** | http: | PASS |
| Replacement dialog, 200% zoom reflow | CSS 720×450 | 2 | light | Default | http: | PASS |
| Replacement dialog, 200% zoom reflow (mobile) | CSS 360×422 | 2 | light | Default | http: | PASS |
| Hydration/startup guard (throttled 150 ms/request, 6 rapid launches) | 1440×900 | 1 | light | Default | http: | PASS |
| Question flow: select → submit → rationale → next, Saved, ZH reveal, glossary, GPT | 1440×900 | 1 | light | Default | http: | PASS |
| Standalone visual item | 1440×900 | 1 | light | Default | http: | PASS |
| **Clinical visual light-lock in dark shell** | 1440×900 | 1 | **dark** | Default | http: | PASS |
| Case study (part navigation / exhibit) | 1440×900 | 1 | light | Default | http: | PASS |
| Summary after completed set; memory counts vs IndexedDB | 390×844 | 3 | light | Default | http: | PASS |
| Full marks clears Needs review | 1440×900 | 1 | light | Default | http: | PASS |
| Saved remove + focus recovery | 1440×900 | 1 | light | Default | http: | PASS |
| Remediation does not overwrite ordinary Last Set | 1440×900 | 1 | light | Default | http: | PASS |
| Settings persistence across reload; dev hidden | 1440×900 | 1 | light | varied | http: | PASS |
| Dev-gated Preview Lab + Developer with `?dev=1`; L3 exits | 1440×900 | 1 | light | Default | http: | PASS |
| Library filter / inspect / Import entry and return / Progress | 1440×900 | 1 | light | Default | http: | PASS |
| Large text Study root | 390×844 | 3 | light | **Large** | http: | PASS |
| L1 cold load vs remount | 1440×900 / 390×844 | 1 / 3 | light + dark | Default + Large | http: | INFO (see N1) |
| L2 Customize filter reset | 1440×900 | 1 | light | Default | http: | INFO (see N2) |
| L4 desktop header exit via brand | 1440×900 | 1 | light | Default | http: | PASS |
| L4 desktop header exit via Settings | 1440×900 | 1 | light | Default | http: | PASS |
| Production `file://` load, navigate, start, reload, resume | 1440×900 | 1 | light | Default | **file:** | PASS |
| Baseline `511f66b` `file://` comparison | 1440×900 | 1 | light | Default | **file:** | PASS |

¹ **Correction, stated plainly:** two early scenarios were requested with Playwright's `colorScheme: "dark"`. This application derives dark mode **only** from `data-theme`, set from the persisted `themeMode` setting; it contains no `prefers-color-scheme` rule. Those two runs therefore rendered in **light** theme and are recorded above as light. They remain valid as IA/overflow checks at their viewports. All genuine dark-mode verification is the `data-theme` rows, produced by seeding `themeMode: "dark"`.

### 4.2 Key results

**Primary IA (work order §4).** Learner primary navigation is exactly `["Study","Library","Progress"]` at every viewport and transport tested. Settings is a single `.header-utility` control, not a peer tab. Customize appears only inside the Study workspace; Import appears only inside Library (`.library-utilities`). No Review, Vocabulary or Developer entry appears anywhere in the ordinary learner shell — confirmed both by navigation labels and by scanning rendered body text. Mobile shows exactly three fixed bottom tabs, safe-area padded, and content stays clear of the bar on Study, Library and Progress after scrolling to the end of each. No page-level horizontal overflow at 1440, 720, 390 or 320 px on the shell surfaces.

**Session safety (§5.1, §10).** With a genuinely *protected* session (`hasProtectedSession` requires a recorded result, draft answer or skip), starting another set opens the native `<dialog>`; it matches `:modal` and is the top-layer dialog. `Keep current set / 保留当前练习` is both the **first** action and the only `primary-action`, and is **focused on open**. Escape closes the dialog and preserves the active session **exactly** — full snapshot equality including session id, `results`, `answers` and `skippedQuestionIds` counts — and returns focus to the originating `button.test-start`. The `Keep current set` button preserves the session identically. Verified on desktop, mobile, under Large text, and under 200% zoom reflow.

**Hydration guard.** With every request delayed 150 ms and the start control clicked six times during hydration, exactly **one** active session row exists afterwards. No resumable session was lost and the barrier could not be bypassed by the new shell.

**Memory semantics (§3).** UI counts are read from real storage: the Study `Needs review` count equals the count of `progress` rows with `needsReview` in IndexedDB, and the `Saved` count equals the flag rows (3 = 3). Concretely verified: `mc_airborne_tb_precautions_004` entered Needs review on a wrong attempt and was **cleared by a subsequent full-marks attempt**; Saved removal decrements storage 3 → 2 and returns focus to a real control (`button.question-inspect`, not `BODY`); and an ordinary Last Set (`session-1789518358301-f2cadt`, "Practice · 10 questions", 10 delivered) was **unchanged** by a subsequent remediation launch. No new memory state, no streaks, readiness, mastery, due dates or historical set browser.

**Clinical visuals (§6.3).** In a genuine dark shell (`data-theme="dark"`, canvas `#0c111d`), the burn-map clinical visual host `.rhythm-strip-svg` computes `color-scheme: light` with background `rgb(255, 248, 250)` and renders as a light paper surface with fully legible shading. Light-lock holds.

**Accessibility stress.** Large text (`--font-scale: 1.16`): Study root has no overflow and the dialog title and safe action are fully within the viewport. 200% zoom: at CSS 720×450 @ DPR 2 and CSS 360×422 @ DPR 2, the dialog title and safe action are fully visible and reachable without scrolling, the dialog does not need to scroll, and there is no page overflow.

**Method note on 200% zoom (honest statement of what was done).** A first attempt used `--force-device-scale-factor=2`; measurement showed it kept a 1440 px CSS viewport, so it did **not** reflow and was discarded. The recorded result reproduces Chrome's 200% zoom **layout conditions** — CSS viewport halved to 720×450 with DPR 2, which is what a 1440×900 window at 200% presents — driven through Playwright. Chrome's zoom menu is not reachable from automation; this is the reflow-equivalent, not a DPR-only substitute, and the substantive requirement (title and safe action immediately visible and reachable) is met under those conditions.

**`file://` production artifact.** `dist/index.html` mounts, navigates Library / Progress / Settings, starts Study, reloads and resumes the stored session. No module, script, style or image path errors.

**Console attribution.** Across every scenario, both transports, both themes and both builds, the total captured page and browser diagnostics is **0** (`console-attribution.json`) — no `console` messages, no `pageerror`, no `requestfailed`, and no CDP `Log.entryAdded` or `Network.loadingFailed` entries. There is therefore **no new console output attributable to this change**.

### 4.3 Inherited-diagnostic comparison (commission §6.4)

The baseline `511f66b` was built in a separate detached throwaway worktree (`npm ci`, `npm run build`, exit 0) and loaded under the same Chrome and settings.

The producer reports a `file://` CORS diagnostic for `manifest.webmanifest` plus a paired `net::ERR_FAILED`, four messages in the final run, claimed inherited. **I could not reproduce any such message in either build** — zero entries, with capture through page `console`/`pageerror`/`requestfailed` *and* the CDP `Log` and `Network` domains.

What I can verify directly supports the "inherited" characterization regardless: both builds ship the identical `<link rel="manifest" href="./manifest.webmanifest" />` and byte-identical 466-byte `manifest.webmanifest`, and neither build produced any module/script/style/image path failure. The diagnostic is therefore structurally identical between baseline and implementation. The specific message text and count remain **unverified in this environment** (Chrome 152 + Playwright capture), and are recorded as such rather than confirmed. Nothing here is blocking.

---

## 5. Visual review

Compared against `scratch/learner-shell-r3/concept-a/index.html`, `concept-a.css`, `shared/shared.css` and the reference screenshots, plus the producer's 17 screenshots.

Concept A is **credibly translated, not merely recoloured**:

- **One dominant Study action.** With a resumable session, `Continue set / 继续练习` is a filled navy `primary-action` directly under a `Continue your practice` heading; the competing `Start practice` control is a plain outlined button (the `primary-action` class is deliberately dropped when a session is active). With no session, `Start practice · N questions` is the single filled action.
- **Memory attached around Study.** `Around your Study` sits beside/below the action bay with Needs review and Saved as large factual counts and Last set beneath — structurally the reference's memory dock, not peer navigation.
- **Low-shadow, border-and-spacing surfaces**, small radius family (4/8/12 px), compact reading typography, system font stack, no gradients, no web fonts.
- **Dark blue-slate family** exactly on the §6.1 anchors.
- **Chinese scaffold never dominant:** shell Chinese is wrapped in `<span lang="zh-Hans" class="shell-scaffold">` and renders smaller and lighter than the English exam content.

Prototype-only behaviour was **not** copied: no fake `ZH` switch, no `100/125/150/200` percentage text scale, no mock state or question engine, no `Key Takeaway` field, no streaks, readiness, mastery, due dates or historical set browser. The prototype's four header utilities are correctly reduced to a single Settings control per §4.3.

Deliberate, work-order-sanctioned divergences: desktop expresses the three destinations in compact header navigation (explicitly permitted by §4.1); Concept A's `Discard unfinished session and start over…` link is replaced by the real replacement-protection flow; the prototype's `8/10 (80% correct)` Last-set score is replaced by factual date/count/title, correctly avoiding readiness claims.

My screenshots include desktop root light and dark, mobile root light and dark with three tabs, mobile active Study with nav absent, the memory dock, Saved/Needs review surfaces, the replacement dialog under Large text and under 200% zoom, the dark light-locked clinical visual, and L1 before/after remount.

---

## 6. Findings

### BLOCKING

**None.**

### EVIDENCE DIVERGENCE

**E1 — The receipt's 200% zoom method description is not internally consistent.**
The receipt states zoom "was set to 200% through `chrome://settings/appearance`" and that "screenshots were captured from the foreground Chrome compositor", while the same section states the suite was "operated through Playwright in **headless** mode". Headless Chrome has no foreground compositor and `chrome://settings` is not operable there. The *measured conditions* the receipt reports — 720×450 CSS viewport at DPR 2 inside a 1440×900 viewport — are correct and are exactly the conditions under which I independently confirmed the requirement passes. Substantively confirmed; the procedural description should not be relied on as written. Not blocking.

**E2 — The inherited `file://` manifest diagnostic could not be reproduced.**
The receipt reports four `manifest.webmanifest` CORS / `net::ERR_FAILED` messages and an exact baseline match. I observed **zero** such messages in either build through both page-level and CDP capture (§4.3). The structural inputs are byte-identical between builds, so the "inherited" conclusion is consistent with what I can verify, but the message count and text are unverified here rather than confirmed. Not blocking; it conceals no work-order requirement, since my own `file://` verification passed independently.

No other divergence from the producer receipt was found. Its load-bearing invariance claims — 43 byte-unchanged top-level functions, `MemoryList` differing only in its root-return label, only `App`/`HomeView`/`LibraryView`/`SettingsView` otherwise changed, pre-`return` region changed only by the `answeredRecords` removal plus four derived selectors, semantic tokens byte-identical, no clinical renderer selector changed, no dependency/bank/census/history change — were each **independently reproduced and confirmed**.

### NONBLOCKING

**N1 (lead L1) — Cold-load expanded launcher. CONFIRMED, NONBLOCKING.**
`HomeView` stores `useRef(!activeSession)` as the `<details className="study-new-set">` open state. `HomeView` mounts before active-session hydration, so on a cold load or reload with a resumable session the disclosure renders **expanded**; after a later remount it renders **collapsed**. Reproduced on desktop light, desktop dark, mobile, and at 320 px under Large text — `open=true` cold versus `open=false` after remount in every case.

Classified against §5.1 ("continuation is the dominant action"): **not a violation.** In the expanded state `Continue set / 继续练习` remains the sole filled `primary-action` immediately under the `Continue your practice` heading, while `Start practice` renders as a plain secondary button — the dominance relationship is preserved, verified in screenshots. The cost is extra vertical length and an inconsistent disclosure state between cold load and remount.

The `useRef` is deliberate and load-bearing: it keeps the value stable across re-renders so React does not fight the user's native toggling, which is what allows the replacement dialog to return focus to a still-visible `button.test-start` — behaviour I verified passes (§4.2). Any future change here must preserve that focus-return guarantee. Recommended, at owner discretion and **not** required for acceptance: capture the initial value after hydration resolves rather than at first mount.

**N2 (lead L2) — Customize no longer preserves builder filters. CONFIRMED, NONBLOCKING.**
Baseline had two builder entries: top-nav Customize called `openBuilder(builderFilters)` (preserving filters) and `HomeView` called `openBuilder()` (resetting). `openBuilder(overrides = {})` spreads `{...blankBuilderFilters, ...overrides}`, so the no-argument form resets. §4.1 **requires** removing Customize from primary navigation, and the surviving Study-subordinate entry behaves exactly as the baseline `HomeView` entry always did. Empirically confirmed: a filter set to `unseen` inside the builder reads back as `all` on re-entry. This is an accepted consequence of the mandated IA change, not a regression of the surviving control. Recorded for owner awareness.

**N3 (lead L3) — Preview Lab and Developer lose learner navigation on desktop as well as mobile. CONFIRMED, NONBLOCKING.**
`showLearnerNavigation` excludes `session`, `previewLab` and `review` at all widths. Usable exit paths were verified with `?dev=1`: the brand button and the Settings utility remain visible in Developer Review, and clicking the brand returns to the Study root. Consistent with §4.1 (Preview Lab and Developer must not enter or distort learner IA).

**N4 (lead L4) — Desktop keeps the header during active Study; mobile hides it. CONFIRMED, NONBLOCKING and correct.**
On desktop during `view === "session"` the header renders with brand and Settings but **no** learner navigation; on mobile `header.app-header` computes `display: none`. Leaving active Study via either the brand **or** the Settings utility preserves the session **exactly** (identical id, index, results and skip counts before and after), the resume control is present on return, and resuming re-enters the session unchanged. This satisfies §4.2's distraction-reduced mobile session shell while keeping a desktop escape hatch.

**N5 (lead L5) — Resume copy overflow. NOT REPRODUCED.**
The resume progress line renders `activeSession.title`, and single-question practice sessions use the full English stem as the title. At 320 px under production Large text I measured no page overflow and no overflow of `.session-progress-copy` (`scrollWidth` ≤ `clientWidth`). The copy wraps. No finding.

**N6 (lead L6) — Screening data superseded.** The prior pass's matching file sizes and constant −57 line offset are consistent with but prove nothing about invariance; §2 supersedes them with blob SHAs and AST comparison.

**N7 — Horizontal overflow on `dropdown_cloze` items in an active session. INHERITED, not introduced.**
Some `dropdown_cloze` questions push the session card wider than the viewport at 390 px and 320 px, stretching `.primary-action.submit-button` (e.g. `scrollWidth` 856 vs 390). **Baseline `511f66b` exhibits the same defect with the same culprit element** (e.g. 681 vs 320 at 320 px), and `ClozeLine` / `DropdownClozeControl` are byte-identical between revisions. Pinned A/B on five identical `dropdown_cloze` items in both builds produced identical measurements in every case. This is pre-existing content-renderer behaviour outside this task's scope (§6.3 forbids changing clinical/question renderers), not a §10 regression. Worth an owner follow-up as separate work.

**N8 — Calculator bottom sheet overlaps the sticky submit control. INHERITED, not introduced.**
When open on mobile, the calculator panel vertically overlaps `button.submit-button`. Measured identical in baseline and implementation across `dropdown_cloze`, `matrix` and `multiple_choice` items. The work order's concern — a second bottom layer competing with Submit/Next/Skip or the calculator — is satisfied: the learner bottom navigation is **absent** during active Study, and the calculator opens, computes and closes without collision with shell chrome.

### Lead dispositions

| Lead | Disposition |
|---|---|
| L1 | **Confirmed** — NONBLOCKING (N1); not a §5.1 violation |
| L2 | **Confirmed** — NONBLOCKING (N2); accepted consequence of §4.1 |
| L3 | **Confirmed** — NONBLOCKING (N3); exits verified |
| L4 | **Confirmed** — NONBLOCKING (N4); session preservation verified both exits |
| L5 | **Refuted** — no overflow at 320 px under Large text |
| L6 | **Superseded** — replaced by blob-SHA and AST proof (§2) |

---

## 7. Delegation disclosure

**Nothing was delegated.** Every step — isolation, git-object derivation, the AST comparator, the deterministic floor, all browser runners, the baseline A/B builds and comparisons, visual inspection, and this artifact — was performed directly by this seat, Claude Code running Claude Opus 5. No subagent, task agent, workflow or other model was invoked at any point.

---

## 8. Final disposition

The implementation satisfies its frozen work order. The required information architecture is exactly as specified; the protected behavioural surface is provably byte-unchanged; every session and memory handler is byte-identical; the deterministic floor passes independently; the accessibility requirements — native dialog semantics with a focused safe default, focus return, Large text, 200% zoom reflow, safe-area-aware mobile navigation, dark-mode contrast, light-locked clinical visuals — were independently verified in real Chrome; and Concept A is credibly translated without importing prototype-only behaviour.

No finding requires a production-code change. The two evidence divergences concern the accuracy of the producer's method description and one unreproducible inherited diagnostic; neither conceals an unverified work-order requirement, because both surfaces were independently verified here and passed. The two inherited defects (N7, N8) are present identically at `511f66b` and lie outside this task's permitted edit surface.

`PROJECT_SHRIMP_LEARNER_SHELL_R3_CONCEPT_A_INDEPENDENT_ACCEPT`
