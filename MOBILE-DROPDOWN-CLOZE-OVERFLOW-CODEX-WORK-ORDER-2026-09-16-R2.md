# Project Shrimp — Mobile Dropdown-Cloze Overflow Repair

**Status:** DRAFT R2 — Claude.ai required amendments and owner decisions incorporated; NOT an execution authorization.  
**Date:** 2026-09-16  
**Producer:** Codex; suggested seat GPT-5.6 Sol / high.  
**Lane:** Presentation-only repair of the inherited dropdown-cloze width defect.  
**Planning / proposed execution baseline:** `642b0f9c8707024037709b26b764c7b21e66ddce`.  
**Suggested branch:** `codex/mobile-dropdown-cloze-overflow-r1`.  
**Evidence directory:** `audit/mobile-dropdown-cloze-overflow-r1/`.

Claude.ai specification review is complete. This R2 incorporates every required amendment plus the owner decisions recorded below. Implementation begins only after owner launch/freeze. This document proposes a new repair commission; it does not reopen or amend the accepted learner-shell commission.

## 1. Outcome and evidence

A learner must be able to read and answer a `dropdown_cloze` question on a narrow screen without the question, native select, selected text, or Submit control widening the page. Preserve all choice text, selection behavior, bilingual gates, answer identity, and grading behavior.

The accepted integration evidence records a concrete failing witness:

| Input / condition | Recorded value |
|---|---|
| Question ID | `gpt_format15_vasa_previa_management_dropdown` |
| Viewport | 320 × 740 CSS px, DPR 1 |
| Theme / text / language | light / Default / on-tap, Chinese initially unrevealed |
| Surface | active Study, production build served over HTTP |
| Root width | `document.documentElement.scrollWidth = 1302`; `innerWidth = 320` |

Sources: `audit/learner-shell-r3-concept-a-r1/integration/focused-browser-smoke-results.json`, its adjacent `focused-browser-smoke.mjs`, and `audit/learner-shell-r3-concept-a-r1/independent-review/independent-review.md` §6 N7. These are historical observations, not measurements newly performed by this specification's author. Reproduce on the admitted repair baseline before editing; do not require the exact old pixel count across a different browser build.

Source reconnaissance at the planning snapshot found `DropdownClozeControl` and `ClozeLine` in **`src/App.tsx`**, not `src/visuals/`. The native `.cloze-select` currently has `width: auto`, `min-width: 10rem`, inline margins, and no local maximum-width rule. `.cloze-token` is inline-flex. Intrinsic select width, token wrapping, and the containing grid's minimum sizing are investigation leads, not a pre-established root-cause verdict.

## 2. Authority, admission, and isolation

Read current `AGENTS.md`, this order, the Sep 16 learner-shell milestone in `PROJECT-HISTORY.md`, the cited evidence, the two cloze functions, their callers, and the relevant CSS. Use `src/types.ts`, `src/schema.ts`, and `src/grading.ts` directly for any fixture/answer-contract question; do not copy a remembered schema. Read applicable model-specific instructions and the runbook sections needed for the actual work.

At launch, record this order's path and SHA-256 and re-read it after compaction. The owner-side copy is read-only and remains untracked unless separately authorized. A version/hash mismatch after freezing requires clarification of authority, not a silent edit.

Establish an isolated clean worktree at the proposed baseline. Verify the baseline commit exists and is the accepted learner-shell publication. Initial source identities at that commit are:

- `src/App.tsx`: Git blob `8eac13d0b4f7f2631501e20c1ac5d285b7359010`.
- `src/styles.css`: Git blob `e95d261bc5713fac990ebc2bda4ef9320a521db7`.

These are **admission identities**, not required post-repair hashes. If live `main` has advanced, inspect intervening changes to relevant production inputs before work. Do not silently discard newer code, import another unreviewed branch, or rebind the baseline; report a conflicting baseline for owner disposition. Unrelated audit-only additions do not justify a new review of the old shell.

Record owner HEAD and tracked/untracked status at start and close. Do not implement in, stage, stash, clean, reset, or otherwise modify the default checkout. In particular, do not read or touch the unrelated P27 audition material under `audit/gemini-p27-content-judgment-requalification-2026-09-13-r2/`. Concurrent status growth is not a defect and must not be described as byte-unchanged. Use `git worktree remove` for disposable Git worktrees; leave the final producer worktree available for review.

## 3. Allowed change surface

Prefer the smallest CSS correction that satisfies the whole contract, not just the root-width assertion.

| Path | Authorized scope |
|---|---|
| `src/styles.css` | Cloze-specific sizing/wrapping and narrowly scoped container minimum-sizing needed to contain cloze. Account for margins and box sizing. |
| `src/App.tsx` | Presentation/accessibility changes confined to `DropdownClozeControl` and `ClozeLine`; minimal wrapper classes or a full-text readout when needed. Preserve existing selection and reveal logic. |
| `scripts/tests/mobile-dropdown-cloze-layout.mjs` | New repeatable browser regression runner; optional tightly named test-only fixture/helper alongside it. |
| `audit/mobile-dropdown-cloze-overflow-r1/**` | New task-owned evidence and implementation receipt. |

A shared ancestor selector may change only with demonstrated necessity and a focused non-cloze collateral check. Do not reformat `App.tsx`, extract unrelated components, or modernize other item controls.

Preserve the native select as the answer input. A small, accessible, wrapping text presentation associated with the same blank/options is allowed when width containment would otherwise hide meaning. It must derive from the existing option text and selection, not introduce another answer state or a new custom combobox framework.

Forbidden: bank edits; choice shortening/paraphrase/reordering; schema/type/grading/storage/sampler/import changes; clinical visual renderer changes; dependencies; learner-shell navigation or palette redesign; calculator geometry changes; historical evidence edits; history publication on the producer branch. All paths outside this allowlist are read-only absent a new owner instruction.

## 4. Acceptance contract

### A. Width containment without concealment

For the witness and the bounded fixture set below, in each required rendered state:

- root `scrollWidth <= clientWidth + 1` CSS px;
- the cloze panel, controls/tokens, and visible Submit control fit the containing content area and viewport, allowing 1 px measurement rounding;
- no cloze-generated horizontal page scrolling, negative-left escape, clipped focus ring, or required text hidden outside an ancestor;
- for each cloze select, token, and full-text readout, its bounding rect lies within `[0, innerWidth]` ±1 CSS px; for every ancestor from that element through `documentElement`, `scrollWidth <= clientWidth + 1`;
- ordinary vertical wrapping/scrolling is acceptable.

Do not satisfy this with `overflow-x: hidden/clip` on the page, app shell, question card, or cloze content; reduced global text size; transforms that shrink the question; fixed device-specific widths; or a new horizontal-scrolling cloze panel. Do not alter the intentional scroll/light-lock rules of clinical visuals or matrix tables.

### B. Full text remains usable

Every option's full existing English text must be readable through ordinary learner interaction **before submission**, including long distinguishing suffixes. The selected choice must remain inspectable after selection and after submission. Chinese text, when legitimately revealed, must wrap without causing the same defect.

The automated acceptance path is in-page. When the closed native select cannot show its complete selected text within the contained width, render a wrapping full-text readout of the currently selected English option for that blank. The readout is derived from the existing option object, associated with its select (for example with `aria-describedby`), neutral before submission (no correctness styling or correct-option disclosure), and empty in the `Choose` state. Any Chinese readout follows the same `off` / `on-tap` / `always` gate as the Chinese projection. Observations of a native picker on a physical device are supplemental; their absence is not a missing required proof.

**Owner decision — select-to-read is accepted.** A learner does not need every long option simultaneously expanded in-page before choosing it. Selecting an option in the current runtime changes and persists only the resumable unsubmitted active-session draft; progress, `AnswerEvent`, attempt identity, correctness, and completion history are created only by the submission path. Therefore an intermediate selection may be used to inspect that option's full readout before submission. Codex must confirm this invariant on the admitted base; if selection has acquired additional telemetry/history side effects by launch time, stop rather than silently rely on this decision.

### C. Existing answer and bilingual semantics

Preserve blank/option IDs, token order and fallback behavior, the `Choose` state, controlled selection callbacks, disabled-after-submit behavior, completeness, and correctness styling. English remains the interactive answer surface. Chinese remains a noninteractive projection of the same selection: hidden in `off`, initially gated in `on-tap`, and visible in `always` when present. Preserve explicit reveal and post-submit full-Chinese behavior.

Demonstrate a partial answer remaining incomplete, a complete answer enabling Submit, correct and incorrect submissions, selection retention after changing language/revealing Chinese, and a reload/resume of an unsubmitted draft. Existing persisted answer shapes must not change. Shared use inside a case part and in submitted/read-only review must remain correct.

### D. Preserve the surrounding app

No learner bottom navigation during active Study; no change to session protection, finite-pass behavior, Needs review, Saved, Last set, scoring, or rationale content. The separately commissioned calculator overlap may remain; do not repair it here or claim it is closed because one question became shorter. Record any incidental geometry change honestly.

## 5. Bounded reproduction and regression coverage

Create a fixture manifest with exact bank path, parent/leaf IDs where applicable, and content fingerprints/hashes. Verify the rendered question identity before measuring. Do not use a Library row number or randomized first match as the identity assertion.

Use the pinned failing standalone item, one additional standalone item exercising multiple blanks/long labels, and one real case parent with a cloze part. Select the additional fixtures from the admitted canonical bank; no bank mutation. Record the deterministic selection rule in the fixture manifest (for example: among eligible multi-blank items, maximize the longest English option length, then break ties by stable question ID) so the independent checker can re-derive the fixture. A neutral test-only long-text stress fixture may supplement, but not replace, the canonical witness. Cover a non-cloze multiple-choice control and a matrix surface for collateral containment checks.

Required coverage, arranged pairwise rather than a full Cartesian product:

| Group | Required check |
|---|---|
| Core width | Witness at 320×740 and 390×844; Default and Large; empty, selected, submitted-correct, submitted-incorrect. Exercise partially/fully selected states on the multi-blank fixture. |
| Language / text | On-tap before/after reveal, `always`, `off`; long selected EN and revealed ZH; one Compact smoke; dark + Large at 320 px. |
| Shared contexts | Real case cloze part in active Study, part navigation with draft retention, and one submitted/read-only inspection or Summary surface. |
| Larger layouts | 780/781 and 820/821 px width probes, plus 1440×900 desktop; check the cloze and nearest container, not every app screen. |
| Interaction | Keyboard select/focus, pointer/touch-style use, full-text reading path, incomplete/complete/submit, and draft reload/resume. |
| Offline | Final `file://` artifact: pinned cloze selection → submit → readable result and no root overflow at 320 px. |

Run real system Chrome with ordinary security and disposable profiles. Record actual browser, viewport, DPR, theme, text mode, transport, fixture, and state. Browser emulation is not proof of a physical Android/iOS picker; distinguish automated DOM/layout checks from any actual native-picker observation. Use actual `data-theme`/persisted `themeMode`, not Playwright's color-scheme setting, to establish dark mode.

The new runner must accept a target URL (HTTP or file) and an explicit task-owned output directory. Resolve Playwright from an existing external installation or isolated test tooling via `PLAYWRIGHT_MODULE`; add no project dependency and change no package file. Fail clearly when tooling is missing. Document its exact invocation.

**Red/green requirement:** run the same repair assertion against the unmodified baseline and the candidate. The decisive red/green oracle is the §4A containment assertion and it must run before any readout-specific assertion. The baseline record must show that containment assertion failing, with measured root width plus the offending select/token rectangle and ancestor widths; a later failure caused merely by the new readout DOM being absent does not count as the red. The baseline must fail for the identified width defect, not a timeout, absent fixture, failed navigation, or missing DOM. The candidate must pass. Record both. A reproduction that disappears requires investigation/reporting, not a fabricated failing test.

Do not rerun the old integration smoke as the repair oracle: it explicitly asserts that cloze overflow remains present, writes into accepted evidence, and hard-codes old input blobs. Reuse only inspected fixture/setup logic in the new runner. Do not swallow a failed navigation/selection and then measure an unrelated screen. Screenshots complement measurements; they are not the only assertion.

For `file://` console attribution, allowlist only the inherited manifest failure signature already recorded by the accepted integration: a `manifest.webmanifest` CORS diagnostic and its paired `net::ERR_FAILED`. Match it narrowly to the manifest request; do not ignore console errors wholesale. Any other new warning/error remains evidence to investigate.

## 6. Verification and invariance

Run and capture exit codes and logs:

```bash
npx tsc -b --pretty false
npm run test:grading
npm run test:case-completeness
npm run test:exam-layout
npm run test:session-navigation
npm run build
git diff --check
```

Also run the new browser regression against baseline and candidate as above. If a changed presentation path creates a concrete additional risk, run the relevant focused regression. Do not rerun the full learner-shell independent matrix or regenerate census/bank artifacts by rote.

Show the final diff and object/hash equality from the admitted base for `banks/`, `src/visuals/`, schema/types/grading, storage/migration, sampler/session-state/navigation/start-guard, completed-memory, bank loading/import, calculator source/panel, package files, census artifacts, and existing accepted evidence. If `App.tsx` changes, supply a bounded function diff or AST-based proof that changes are confined to §3; do not use a brace-counting comparator. Explain any shared CSS rule change and its collateral evidence.

## 7. Receipt, review boundary, and stop

Write `audit/mobile-dropdown-cloze-overflow-r1/implementation-receipt.md`: work-order hash, admitted base, branch/worktree, source-grounded cause, changed files, actual fix, fixture manifest, baseline failure and candidate success, command logs, browser matrix/measurements, full-text and bilingual proof, before/after screenshots, protected-path proof, owner-checkout preservation, and limitations. Include a small reproducible command set for the external reviewer.

Commit implementation/tests and then evidence as needed. Identify the tested production commit and final evidence tip without trying to embed a commit's own SHA in itself. Do not publish acceptance or update `PROJECT-HISTORY.md`; the post-review integration seat owns that.

Bounded implementation/evidence delegation is permitted under current `AGENTS.md`; descendants inherit this scope, disclose their contributions, and may not provide the producer-independent check. No recursive delegation is authorized here. The external checker must independently inspect the changed code and reproduce the decisive repair/regression checks. The checker reads the new runner's assertions and fixture-identity checks, reruns it against both the admitted base and the candidate, and takes at least one witness measurement with a probe the checker writes independently rather than reusing the producer runner. The old shell's blob-equivalence gate is not sufficient for new repair code.

Stop for inadmissible baseline, necessary out-of-scope edits, unavailable required proof, regression, or unresolved acceptance failure. Do not push, merge into `main`, deploy, clean other worktrees, or begin the calculator repair under this commission.

Success terminal: `PROJECT_SHRIMP_MOBILE_CLOZE_R1_READY_FOR_INDEPENDENT_REVIEW`  
Blocked terminal: `PROJECT_SHRIMP_MOBILE_CLOZE_R1_BLOCKED`

**Proposed sequence:** independent cloze review and authorized integration precede the calculator commission. No implementation launch is authorized by this draft.
