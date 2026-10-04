# Project Shrimp — Context Handoff to Claude.ai: Two Mobile Repair Specifications

**Audience:** Claude.ai, external specification reviewer.  
**Date:** 2026-09-16.  
**Requested work:** one bounded review of the two attached/on-disk draft work orders.  
**Not requested:** implementation, a new learner-shell review, browser execution, publication, P27 audition work, or an orchestration/agent-launch setup.

Luke wants Codex to do the implementation and expensive verification, with Claude used for genuinely independent judgment. Review the scope and acceptance design now; do not spend tokens reconstructing the entire project or repeat the completed Claude Code review.

## 1. Inputs and access boundary

Review these two **DRAFT R1** files together:

1. `MOBILE-DROPDOWN-CLOZE-OVERFLOW-CODEX-WORK-ORDER-2026-09-16-R1.md`
2. `MOBILE-CALCULATOR-ACTION-CLEARANCE-CODEX-WORK-ORDER-2026-09-16-R1.md`

Local owner repository: `/Users/holemini/Desktop/Project Shrimp`.

The drafts and this handoff are owner-side untracked documents, with portable Markdown copies supplied for attachment. They are **not committed or pushed**. Read the supplied attachments or the explicit local paths; do not claim that a GitHub-only view contains them. A seat with only GitHub access and no attached/disk inputs must wait for those inputs to be made accessible through an authorized route; this handoff does not authorize a push. With only attachments and no source access, review internal consistency but label source-dependent checks unverified.

Identify your access mechanism and the repository snapshot you can actually see. For source-dependent judgments, use current `AGENTS.md` and the source at the planning snapshot below; an older uploaded AGENTS copy is not the current authority. After context recovery, re-open these active drafts instead of relying on a saved summary.

## 2. What is already closed

The **Learner Shell R3 Concept A** redesign is independently accepted, integrated, and published. The owner supplied Claude Code's final publication receipt. Local source inspection for this drafting pass found the same tip in the commit log:

`main @ 642b0f9c8707024037709b26b764c7b21e66ddce`

Relevant history, with the shorthand corrected into forward ancestry:

| Role | Commit |
|---|---|
| Pre-shell baseline | `511f66b7b7cb830649613793f0264725be25d450` |
| Accepted shell implementation | `d581a66ff1a784d10e65b1b139d78c41851d45fa` |
| Producer evidence | `154d8520fcb0f183472994424acd42cdb64b817f` |
| Claude Code independent review | `6ae35a65a584c5ed8be3df5e3fc0cad5603b8693` |
| Current-main integration base at that time | `f30224ec156984cebf64c1ef28802d2f02c6dcd1` |
| No-ff integration merge | `2082ee3142d1a4dde4d0292f2d006e3fa2082d5b` |
| Integration evidence/history tip, then published | `642b0f9c8707024037709b26b764c7b21e66ddce` |

There was an integration merge (`2082ee3`); publication then fast-forwarded `main` to the already-prepared tip without creating another merge. The old return's phrase “no merge commit” referred to that publication step, not to the absence of the integration merge.

The accepted shell's production edit surface was exactly `src/App.tsx` and `src/styles.css`. The original implementations of the cloze controls, session handlers, and calculator were preserved. The accepted source identities were:

```text
src/App.tsx     8eac13d0b4f7f2631501e20c1ac5d285b7359010
src/styles.css  e95d261bc5713fac990ebc2bda4ef9320a521db7
```

Claude Code supplied the independent review. Codex/Sol subsequently did mechanical integration, the ten-command floor, focused browser smoke, and history/evidence; Claude Code gated and published. The new drafts do not disturb that closure. No new deployment or cleanup is authorized here.

Do not reopen L1–L6 or E1. The old E2 `file://` manifest CORS diagnostic was later reproduced during integration and remains inherited/nonblocking. Do not rename old `.png.png` evidence files. Do not revive retired Review/Vocabulary features from stale introductory project prose; the accepted Sep 12 and Sep 16 milestones describe the relevant product state.

## 3. Why two repairs exist

The independent review deliberately left two inherited defects outside the redesign's authorized scope. The Sep 16 history milestone explicitly retains both for separate narrow commissions.

### A. Dropdown-cloze page overflow

The integration runner pinned `gpt_format15_vasa_previa_management_dropdown`. At 320×740, light / Default / on-tap, its active Study page measured root `scrollWidth = 1302` against `innerWidth = 320`.

The current relevant implementation is **inside App.tsx**, not the registered medical visual renderer tree:

- `DropdownClozeControl` (around line 3716 at the planning snapshot) renders an interactive English `ClozeLine`, and an optional noninteractive Chinese projection of the same selections.
- `ClozeLine` (around line 3775) parses the existing blank tokens and emits native `<select>` controls; Chinese selected text uses `.cloze-token`.
- `src/styles.css` has `.cloze-select { display: inline-block; width: auto; min-width: 10rem; margin: 0 0.25rem; ... }` with no local maximum width, and inline-flex `.cloze-token`.

The draft directs Codex to identify the actual intrinsic-width/container mechanism rather than assume those source conditions alone prove the cause. It permits scoped wrapping/sizing and, if necessary, a small full-text presentation derived from existing options. It does not permit rewriting/shortening clinical choices or replacing the answer engine.

**Review focus:** no overflow must not become “the text is clipped, but the page width is green.” A long choice's full meaning must remain readable by ordinary touch/keyboard interaction before submission. Chinese gating and submitted/review behavior must remain intact.

### B. Calculator covers Submit

The integration witness used `claude_a_mc_acute_mi_01` at 390×844. The open calculator covered the full 43.59375 px height of the measured Submit rectangle, with 348.4375 px horizontal intersection. The old witness measured a disabled Submit; the new order additionally requires an enabled action and an unforced real click.

Relevant code:

- `src/ExamCalculatorPanel.tsx`: nonmodal dialog; local reducer/open/position state; focus on open; minimize/Escape returns focus to launcher; desktop drag/clamp.
- `SessionView` keys it by `session.id` and the parent `question.id`; Preview Lab also uses the same component.
- `.exam-calculator` is fixed at z-index 20. At widths ≤780 px it is bottom-aligned with `max-height: min(70dvh, 30rem)`; its general style has `overflow: hidden`.
- Mobile `.session-active .submit-button` is sticky above the bottom session-actions row. Case footer layout changes at 820/821 px, which is not the calculator's 780/781 px breakpoint.

**Proposed product contract for review:** preserve the nonmodal calculator and allow calculator/Study actions to coexist, rather than fix overlap by hiding actions or forcing dismissal. Minimal ephemeral geometry coordination is permitted when CSS cannot handle changing heights. Short screens may use bounded internal scrolling, not smaller keypad targets. Desktop drag and question-keyed reset behavior are preserved.

## 4. Evidence quality traps already accounted for

The old integration smoke is a **preservation test**, not a repair test: it explicitly asserts positive calculator overlap and positive cloze overflow and labels those inherited observations PASS. It also writes into the accepted evidence directory and hard-codes old blob IDs. Both new orders require their own output paths and repair assertions; the same repair assertion must fail on the unmodified admitted baseline and pass on the candidate.

Do not use `independent-review/ab-cloze-pinned.json` as the decisive failing fixture. The inspected JSON records five row-index comparisons with **no overflow in either build**. It supports equal behavior for those measured rows, not a 1302 px failure. Its companion runner uses row positions and catches some navigation failures. This observation does not reopen the old review: the new commission has a stronger, explicitly identified positive witness in the integration evidence and must assert actual rendered identity.

Likewise, `test:calculator` tests the arithmetic reducer and `test:exam-layout` tests visual routing/stage visibility. They do not test DOM intersections. The new browser runner must measure geometry, actual visibility, and action hit targets.

Normal mobile viewport emulation with a zero computed safe-area inset is not proof of nonzero-inset behavior. A device-native select popup is not necessarily represented in an ordinary page screenshot or DOM-width assertion. Both drafts require honest attribution of automated, simulated, native, and unverified coverage instead of fabricated device claims.

## 5. Proposed sequencing and governance

**Order 1 → independent implementation review → authorized integration → Order 2 → independent implementation review → authorized integration.**

Both repairs may touch the shared stylesheet and App presentation. Serial execution avoids competing edits and lets calculator clearance be verified with repaired cloze geometry. Order 1 is proposed against the published planning snapshot. Order 2's execution base is resolved later from accepted `main` containing Order 1; it must not branch from an unreviewed cloze producer tip or enforce obsolete pre-cloze App/CSS hashes.

Current `AGENTS.md` permits bounded delegation within an authorized lane, but a producer/orchestrator's descendants cannot supply the producer-independent checker. Different model names or a fresh context do not repair that boundary. Codex owns code, tests, browser work, and its producer receipt. Claude.ai's task here is specification review, not producer implementation or final code acceptance. Later review must inspect the actual new changes and reproduce decisive tests; the old two-blob mechanical-integration gate is not enough once code intentionally changes.

The drafts use the UI/CSS verification path plus targeted grading/case/session/calculator regressions. They keep banks, medical visuals, data contracts, dependencies, and state engines unchanged. They do not commission global audits or census regeneration. Producer branches defer `PROJECT-HISTORY.md` updates to accepted integration, as current governance requires.

The P27 audition is unrelated and ongoing. Its files, sealed material, invocation state, and worktrees are outside this review. Do not inspect or modify them. Claude Code still has no ability to dispatch Codex in the prior setup; do not make this review depend on adding a launch bridge.

## 6. Requested review and compact return

Review the drafts once for these concrete questions:

1. Are the scopes sufficient to repair the actual defects without permitting a broader rewrite or touching forbidden state/content paths?
2. Does the cloze contract prevent truncation, unreadable native choices, bilingual leakage, and broken case/review use?
3. Is calculator coexistence feasible under the stated normal/short viewports, with visible actionable controls, keyboard/focus, correct lifetime, and explicit safe-area limitations?
4. Do baseline admission and serial execution preserve accepted work without creating a circular or impossible future-commit requirement?
5. Will the tests actually fail on the identified defect rather than pass on the wrong screen, disabled/offscreen controls, stale IDs, or a preservation-test inversion?
6. Are verification and independence sufficient but bounded? Remove needless ceremony; do not weaken a decisive guard merely to make the runner green.

Return a separate verdict for each order: **ACCEPT**, **ACCEPT WITH REQUIRED AMENDMENTS**, or **BLOCKED**. For a required amendment, cite the section and provide the smallest concrete replacement/addition and its reason. Separate required changes from optional suggestions. Also give a single verdict on the serial routing and identify any genuine owner product decision that remains.

Do not rewrite both documents wholesale, run the old 30+ scenario review, implement a repair, launch an agent, commit/push anything, or pronounce either defect fixed. The owner/architect will incorporate accepted amendments, freeze the work orders, and issue the Codex launch separately.

## 7. Narrow source index

All paths are relative to Project Shrimp unless absolute above:

| Source | Read for |
|---|---|
| `AGENTS.md` | Current authority, access-mechanism rule, recovery, risk floor, independence, history publication. |
| `PROJECT-HISTORY.md` → “Learner Shell R3 Concept A Integrated (Sep 16)” | Closed redesign and two deferred repairs. |
| `audit/learner-shell-r3-concept-a-r1/integration/integration-receipt.md` | Integration provenance and verification, not a new repair. |
| `audit/learner-shell-r3-concept-a-r1/integration/focused-browser-smoke-results.json` | Positive witnesses, IDs, exact conditions, rectangles. |
| `audit/learner-shell-r3-concept-a-r1/integration/focused-browser-smoke.mjs` | Fixture setup and preservation assertions; inspect, do not rerun into its old output directory. |
| `audit/learner-shell-r3-concept-a-r1/independent-review/independent-review.md` §6 N7/N8 | Inherited/out-of-scope classification. |
| `audit/learner-shell-r3-concept-a-r1/independent-review/ab-cloze-pinned.json` | Negative row-index A/B evidence; not the failing fixture. |
| `src/App.tsx` → cloze functions and SessionView/QuestionCard/CaseStudyControl | Rendering, bilingual/selection semantics, shared contexts, action wiring. |
| `src/styles.css` → cloze/calculator/mobile action/case-footer blocks | Current geometry and breakpoint interaction. |
| `src/ExamCalculatorPanel.tsx`, `src/examCalculator.ts`, `src/examLayout.ts` | Presentation versus protected arithmetic/routing boundary. |
| `package.json`, `scripts/tests/exam-calculator.ts`, `scripts/tests/exam-layout.ts` | Real commands and what the existing tests do not cover. |

The drafting pass read these relevant live sources/evidence and the current commit log. It did **not** execute either repair, rerun the browser witnesses, fetch remote state, or verify a deployed website. Keep those distinctions in your return.
