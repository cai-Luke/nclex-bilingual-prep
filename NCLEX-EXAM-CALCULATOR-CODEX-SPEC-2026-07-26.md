# NCLEX Exam Calculator — Codex Implementation Spec

**Date:** 2026-07-26  
**Status:** Approved implementation task  
**Owner:** Codex implementation seat  
**Change class:** Learner-facing UI / CSS with a small pure TypeScript calculation model  
**Priority:** Bounded polish task; implement, verify, and report rather than producing another design memo

## 1. Mission

Add a basic exam-style calculator that a learner can open during an active question session without obscuring the question's fact pattern or a load-bearing clinical visual in its default desktop position.

The calculator is an exam-condition utility, not a dosage helper. It must perform ordinary arithmetic only. It must never insert an answer, interpret units, recommend a formula, expose calculation history, or alter grading.

The initial desktop placement is the lower-right portion of the question workspace. It is acceptable for the open calculator to cover lower answer choices temporarily. It is not acceptable for the default open state to cover the stem, the top portion of a case fact pattern, or the left-side clinical visual on the target desktop layout.

## 2. Preflight and repository hygiene

Read in this order before editing:

1. `AGENTS.md`
2. `PROJECT-HISTORY.md`
3. `src/App.tsx`
4. `src/styles.css`
5. `src/examLayout.ts`
6. `package.json`

Inspect the live worktree before making changes.

At the time this spec was written, the repository was on branch `codex/authorial-constraint-leakage-survey` with an unrelated modified file:

- `audit/authorial-constraint-leakage/consolidated-report.md`

Do not edit, revert, reformat, stage, or include that file in a calculator commit. Do not run a destructive reset, automatic stash, checkout, or branch switch to make the tree appear clean. Work around unrelated edits and report them unchanged.

The repository is the source of truth. If implementation details have moved since this spec was written, adapt to the current code while preserving the product decisions and acceptance criteria below.

## 3. Hard scope boundary

### In scope

- A reusable learner-facing calculator component.
- A pure TypeScript arithmetic state model with deterministic tests.
- Live-session integration for study, test, and adaptive sessions.
- A small Preview Lab control that renders the same production calculator component for inspection.
- Responsive desktop and mobile presentation.
- Pointer dragging on desktop, with viewport clamping.
- Keyboard and accessibility behavior.
- `PROJECT-HISTORY.md` status update after the feature lands.

### Out of scope

- No question-bank edits.
- No schema, grading, import, loading, session-sampling, or progress changes.
- No calculator telemetry.
- No `localStorage` or IndexedDB persistence.
- No answer-field autofill or clipboard-to-answer affordance.
- No dosage formulas, conversion tools, dimensional analysis, drug references, or nursing hints.
- No scientific functions, percentages, square roots, exponents, parentheses, memory keys, or expression history.
- No resizable desktop window in V1.
- No attempt to cosmetically clone Pearson VUE or reproduce proprietary calculator artwork.
- No new UI framework or dependency.

## 4. Product decisions

### 4.1 Availability

Show the calculator only during an active live question session:

- study sessions;
- test sessions;
- adaptive sessions.

Do not show it on Home, Builder, Library, Dashboard, Import, Settings, Summary/Review, or the developer review console.

Preview Lab may expose a developer-only `Show calculator` toggle so the production component can be inspected beside bundled questions. Do not build a separate calculator mock for Preview Lab.

### 4.2 Default desktop placement and size

Use a fixed-position floating panel anchored to the lower-right side of the app's wide session workspace.

Starting geometry:

- width: `18rem` (approximately 288 CSS px at the root size);
- expected natural height: approximately `22.5rem` to `24rem` (roughly 360–384 px), determined by the display, header, and five keypad rows;
- lower inset: `1rem`;
- right inset should align to the right edge of the centered 1,400 px session main area rather than blindly hugging an ultrawide browser edge.

A suitable CSS starting point is:

```css
right: max(1rem, calc((100vw - 1400px) / 2 + 1rem));
bottom: 1rem;
width: 18rem;
```

The panel opens upward and leftward from a compact launcher in the same lower-right position. The launcher should not jump to a different screen region when the panel opens or closes.

The existing desktop session layout uses a wide main area and may reserve approximately 600 px for a calculation visual on the left. The 18 rem panel is deliberately narrow enough to remain inside the right work region in ordinary split layouts.

### 4.3 Desktop movement

The panel must be draggable by its header on pointer-capable desktop layouts.

Requirements:

- default placement remains lower-right;
- dragging is limited to the viewport;
- maintain at least an 8 px visible margin on every side;
- the entire header and close/minimize control must remain reachable;
- re-clamp after browser resize or orientation change;
- dragging must not select page text;
- clicking keypad controls must never initiate a drag;
- no resize handles in V1.

The default position must remain usable without dragging. Dragging is an escape hatch for unusual questions, not a prerequisite.

### 4.4 Mobile presentation

At the current mobile breakpoint (`max-width: 780px`), do not use a draggable floating desktop window. Render the calculator as a bottom sheet.

Starting behavior:

- width: approximately `calc(100vw - 1rem)`;
- centered horizontally;
- maximum height: `min(70dvh, 30rem)`;
- keys and display remain fully usable without horizontal scrolling;
- launcher sits above the sticky session action bar and safe-area inset;
- open sheet may cover answer choices temporarily;
- close/minimize control remains visible at all times;
- no page-width overflow.

Use the real browser viewport for mobile smoke testing. Preview Lab's embedded mobile canvas alone is insufficient to prove a fixed-position or bottom-sheet overlay.

### 4.5 Layering

The calculator must appear above normal session content, the sticky mobile session actions, and the sticky case footer. A modest explicit z-index above the current session chrome is appropriate.

A full-screen visual-focus `<dialog>` must still appear above the calculator. Native dialog top-layer behavior may satisfy this without calculator-specific code; verify it rather than assuming.

### 4.6 Session and question lifecycle

The calculator is temporary scratch work.

- Opening and minimizing preserve the current value.
- Changing only the active part inside the same case-study container preserves calculator arithmetic and position.
- Advancing to a different top-level `question.id` clears the arithmetic state and minimizes the panel.
- Starting or hydrating a different session clears arithmetic and restores the default position.
- Position may persist in React state for the current session only.
- Do not write calculator state or position to persistent storage.

Mounting with a reset key based on `session.id` and the current top-level `question.id` is acceptable. A case subpart must not create a different reset key.

## 5. Calculator interaction model

Implement a conventional immediate-execution four-function calculator, not a free-form expression parser.

This means operations are evaluated as entered from left to right:

- `2 + 3 × 4 =` produces `20`, not `14`.

### 5.1 Required controls

Use a four-column keypad with this conceptual layout:

| Row | Controls |
|---|---|
| 1 | `C`, `±`, Backspace, `÷` |
| 2 | `7`, `8`, `9`, `×` |
| 3 | `4`, `5`, `6`, `−` |
| 4 | `1`, `2`, `3`, `+` |
| 5 | `0` spanning two columns, `.`, `=` |

The visual glyphs may use `×`, `÷`, and `−`, while the pure model may use internal operator tokens.

Use `C` for clear-all. Do not add a separate clear-entry key in V1.

### 5.2 Arithmetic semantics

Implement and test these rules explicitly:

- Initial display is `0`.
- Digit entry replaces the initial zero.
- Prevent meaningless leading zero chains.
- Decimal entry from zero produces `0.`.
- Permit only one decimal point in the active entry.
- `±` toggles the sign of the active entry or displayed result.
- Backspace removes one character from the active entry.
- Backspacing a one-character entry returns to `0`.
- Pressing an operator after entering an operand stores the operand and waits for the next one.
- Pressing another operator before entering the second operand replaces the pending operator rather than evaluating with an unintended value.
- When a pending operation and second operand exist, pressing another operator evaluates the pending operation and chains from the result.
- `=` evaluates the pending operation.
- Repeated `=` reapplies the most recent completed operator and operand.
- After `=`, entering a digit starts a new calculation.
- After `=`, entering an operator continues from the displayed result.
- Division by zero displays `Error`.
- `C` recovers from `Error` to `0`.
- A digit pressed while `Error` is shown may start a fresh calculation.
- Non-finite results or unsupported overflow display `Error` rather than leaking `Infinity` or `NaN`.

### 5.3 Numeric formatting

Keep the display predictable for nursing arithmetic:

- normalize common binary floating-point artifacts so `0.1 + 0.2` displays `0.3`;
- round computed results to no more than 12 significant digits;
- remove unnecessary trailing zeros;
- remove a trailing decimal point after evaluation;
- do not insert thousands separators in the calculator display;
- avoid scientific notation for ordinary NCLEX-scale values;
- cap manual entry at a reasonable display-safe length, preferably 12 significant digits excluding sign and decimal point;
- never silently truncate the left side of a typed number.

Keep the numeric normalization in the pure model, not scattered through React event handlers.

## 6. Keyboard behavior

Keyboard support must be scoped to the calculator, not global to the page.

When focus is inside the open calculator, support:

- digits `0–9`;
- decimal point;
- `+`, `-`, `*`, `/`;
- `Enter` and `=` for equals;
- `Backspace` for backspace;
- `Delete` for clear-all;
- `Escape` to minimize the calculator.

Prevent the browser default only for keys the calculator actually handles.

Do not attach a window-level handler that intercepts typing in a fill-in-the-blank answer field or other question control. A learner must be able to enter an answer normally even while the calculator is open.

## 7. Accessibility

- Use a labelled non-modal calculator region or `role="dialog"` with `aria-modal="false"`.
- Provide an accessible name such as `Calculator`.
- Launcher needs `aria-label="Open calculator"` and an equivalent tooltip/title.
- Minimize/close control needs an explicit accessible label.
- Backspace needs an accessible label even if represented by an icon.
- Render the display as an `<output>` or equivalent with `aria-live="polite"`.
- Key targets must be at least 44 × 44 CSS px; 46–48 px is preferable.
- Preserve visible keyboard focus using the existing project focus variables/patterns.
- On open, move focus into the calculator in a predictable way without trapping it.
- On minimize, return focus to the launcher when practical.
- Do not create a modal focus trap; the learner must be able to move between calculator and question.
- Pointer drag is optional input. All arithmetic and minimizing must remain keyboard accessible.

## 8. Recommended implementation shape

Use current repository patterns, but the expected file boundary is:

### `src/examCalculator.ts`

Pure state model and deterministic helpers. No DOM and no React.

A reducer-like state may contain fields equivalent to:

```ts
type CalculatorState = {
  display: string;
  accumulator: number | null;
  pendingOperator: CalculatorOperator | null;
  waitingForOperand: boolean;
  lastOperator: CalculatorOperator | null;
  lastOperand: number | null;
  error: boolean;
};
```

Exact field names are not binding. The behavior in §5 is binding.

### `src/ExamCalculator.tsx`

Reusable launcher, panel, display, keypad, keyboard handling, desktop drag, mobile presentation, focus return, and viewport clamping.

Keep arithmetic decisions in `examCalculator.ts`; the component should dispatch calculator actions rather than implement competing arithmetic logic.

### `src/App.tsx`

- Import and mount the calculator inside the active `SessionView` surface.
- Use the current top-level question and session identifiers to implement the reset semantics.
- Add a small Preview Lab `Show calculator` control and render the same component there.
- Reuse the existing Lucide icon dependency; a `Calculator` icon is appropriate.
- Do not refactor unrelated portions of the monolithic file as part of this task.

### `src/styles.css`

Add calculator-specific styles using existing variables and plain CSS. Support light and dark themes through the current variables; do not hard-code a second unrelated theme system.

### `scripts/tests/exam-calculator.ts`

Direct TypeScript regression test for the pure model.

### `package.json`

Add a focused script such as:

```json
"test:calculator": "tsx scripts/tests/exam-calculator.ts"
```

Do not add a third-party calculator, drag, or testing dependency for this feature.

## 9. Required pure-model regression cases

At minimum, prove the following sequences. Use the same action interface the React component uses.

1. Initial state displays `0`.
2. `1200 ÷ 100 = 12`.
3. `4 × 60 × 28 ÷ 2 ÷ 8 = 420`.
4. `360 + 240 + 500 + 100 − 560 − 60 = 580`.
5. `6 × 0.2 + 0.2 = 1.4`.
6. `250 ÷ 125 × 60 = 120`.
7. `0.1 + 0.2 = 0.3`, with no floating artifact.
8. Decimal-point duplication is rejected.
9. Leading zeros remain normalized.
10. `±` works on an entry and on a completed result.
11. Backspace reduces an entry and returns a one-character entry to zero.
12. A second operator entered before the next operand replaces the pending operator.
13. Repeated equals reapplies the previous operation.
14. A digit after equals starts a new calculation.
15. An operator after equals continues from the result.
16. Division by zero produces `Error`.
17. Clear recovers from `Error`.
18. Digit entry can recover from `Error` as a fresh calculation if that behavior is implemented.
19. Manual digit cap is enforced without corrupting the display.
20. Non-finite/overflow output fails closed as `Error`.

Avoid tests that merely call an internal arithmetic helper while bypassing the user action state machine.

## 10. Visual-smoke matrix

Use current bundled questions in Preview Lab and a real live session. These IDs existed when the spec was written and provide representative arithmetic layouts:

| Surface | Question ID | Why it matters |
|---|---|---|
| Plain dosage FIB | `claude_a_fib_dopamine_drip_05` | Long calculation stem with no visual; checks ordinary lower-right overlap. |
| Medication label split | `medlbl_heparin_infusion_rate_001` | Label must remain visible on the left while calculating 12 mL/hr. |
| Burn-map split | `burn_fib_parkland_rate_arm_trunk_genitalia_04` | Multi-step Parkland calculation; checks that the load-bearing diagram remains unobstructed. |
| I&O split | `io_fib_hf_net_balance_01` | Data table remains visible while summing and subtracting. |
| Device screen split | `dev_pca_max_dose_basal_01` or `dev_infusion_duration_vtbi_01` | Checks compact device visual plus decimal/time arithmetic. |
| Case study | Any current bundled case with multiple parts and chart exhibits | Checks parent-question reset semantics, sticky case footer, and chart visibility. |

If an ID has moved or been retired, select the current equivalent from the same canonical bank and record the substitute.

### Desktop proof viewports

At minimum inspect:

- 1280 × 800 — primary 13-inch-laptop constraint;
- 1440 × 900 — ordinary larger desktop.

At default lower-right placement, verify:

- the stem remains readable;
- the left-side load-bearing visual remains fully readable;
- the visual enlarge control remains reachable;
- no horizontal page scroll is introduced;
- the calculator can cover lower answer choices without breaking them;
- minimizing immediately restores the covered answer region;
- drag cannot lose the panel beyond a viewport edge;
- browser resize re-clamps the panel;
- switching case parts preserves arithmetic;
- advancing to a new top-level question clears and minimizes;
- visual-focus mode appears above the calculator.

### Mobile proof viewport

Inspect approximately 390 × 844 in a real responsive browser viewport.

Verify:

- launcher does not sit beneath the sticky session action bar;
- bottom sheet fits without horizontal scrolling;
- display and every key remain reachable;
- safe-area padding is respected;
- close/minimize is always visible;
- answer-field typing is not intercepted by calculator keyboard handling;
- opening and closing do not shift the entire question width;
- no fixed-overlay artifact remains after navigating to another view.

## 11. Acceptance criteria

The task is complete only when all of the following are true:

1. A learner can open a basic calculator during any active study, test, or adaptive question.
2. The default 1280 × 800 desktop placement leaves the stem and left visual unobstructed on the representative split calculation questions.
3. The calculator is approximately 18 rem wide with comfortably sized keys.
4. Desktop dragging works and is clamped to the viewport.
5. Mobile uses a bottom sheet rather than the desktop drag window.
6. Arithmetic follows the immediate-execution rules in this spec.
7. Keyboard handling is calculator-scoped and does not hijack question inputs.
8. Arithmetic and position persist across case-study parts but reset at a new top-level question/session as specified.
9. The feature writes no progress, telemetry, or persistent calculator storage.
10. No schema, grading, bank, or clinical-content files change.
11. Light and dark themes both remain legible.
12. Pure model regressions pass.
13. TypeScript and the production build pass.
14. Visual smoke is recorded in the implementation walkthrough.
15. `PROJECT-HISTORY.md` accurately records the landed feature and verification.

## 12. Minimum verification

Run:

```bash
npm run test:calculator
npx tsc -b --pretty false
npm run build
```

Then complete the visual-smoke matrix in §10.

This is a UI/CSS change with a local pure model. Do not run the full bank promotion pipeline merely because calculation questions are used for smoke testing. Escalate only if implementation unexpectedly touches schema, grading, loading, banks, or renderer code.

## 13. Deliverable and walkthrough

Implement the feature rather than returning another proposed plan.

In the final Codex walkthrough, report:

- files changed;
- arithmetic model chosen and any deliberate behavior interpretation;
- desktop and mobile placement behavior;
- reset/persistence behavior;
- exact commands run and results;
- representative question IDs visually inspected;
- any remaining limitation or follow-up worth owner review;
- confirmation that `audit/authorial-constraint-leakage/consolidated-report.md` and all other unrelated edits were left untouched.

Do not push unless Luke explicitly requests it. If committing, stage only calculator-related implementation files, the focused test/script change, and the `PROJECT-HISTORY.md` update; never sweep unrelated worktree changes into the commit.
