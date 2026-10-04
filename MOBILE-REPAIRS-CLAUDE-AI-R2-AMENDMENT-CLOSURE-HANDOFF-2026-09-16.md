# Project Shrimp — Claude.ai R2 Amendment-Closure Handoff

**Audience:** Claude.ai specification reviewer  
**Date:** 2026-09-16  
**Task:** bounded confirmation that the required R1 amendments were incorporated correctly.  
**Not requested:** implementation, browser execution, reopening Learner Shell R3, P27 work, or a fresh broad specification review.

## 1. Inputs

Review only these two revised owner-side untracked drafts:

1. `MOBILE-DROPDOWN-CLOZE-OVERFLOW-CODEX-WORK-ORDER-2026-09-16-R2.md`
2. `MOBILE-CALCULATOR-ACTION-CLEARANCE-CODEX-WORK-ORDER-2026-09-16-R2.md`

The prior R1 review returned `ACCEPT WITH REQUIRED AMENDMENTS` for both and `ACCEPT` for serial routing. The owner/architect accepted all required amendment groups C1–C3, K1–K3, and S1. Optional suggestions were incorporated where they improved deterministic evidence without broadening the repair.

Current tracked planning snapshot remains `main @ 642b0f9c8707024037709b26b764c7b21e66ddce` unless live disk has legitimately advanced. These work orders remain untracked and are not execution authorizations until the owner freezes/launches them.

Do not inspect the unrelated P27 audition material.

## 2. Owner decisions now closed

### Cloze O1 — select-to-read

**Decision:** allowed.

Live source was checked before this decision. `updateAnswer()` updates `session.answers`; the active-session persistence effect saves that unsubmitted draft through `saveActiveSession()`. Progress rows, `AnswerEvent`, submitted attempts, result/scoring state, and completion history are created only through `commitSubmission()` after Submit. Therefore an intermediate cloze selection may be used to reveal a wrapping full-text readout without creating attempt telemetry or grading history. The selection is still a resumable draft, which is intentional.

R2 requires Codex to confirm that this invariant still holds at the admitted execution base; if it has changed, Codex must stop rather than silently rely on this owner decision.

### Calculator O2 — viewport contract

Owner decisions:

- **Normal portrait band:** `band = sheet.top − topbar.bottom >= 6rem` at Default text for 390×844 and 320×740. Large text requires `band > 0`.
- **Reduced-height fallback:** 390×568 and 667×375 may use minimize → read/answer → reopen for question/answer controls. Calculator display and pending operator must survive the cycle. Study action targets and top-bar controls themselves remain uncovered.
- **Landscape:** 667×375 remains the existing mobile bottom-sheet product. A side-docked calculator is out of scope for R1.

These are product decisions, not values for the producer to redefine.

## 3. Required amendments incorporated

### Cloze

- **C1:** in-page full-text selected-option readout is now the automated acceptance path when the contained native select cannot show the full selected text; it is associated to the select, neutral before submission, empty on `Choose`, and Chinese follows existing language gates. Native-picker observation is supplemental only.
- **C2:** containment is measurable per select/token/readout rectangle and every ancestor through `documentElement` (`scrollWidth <= clientWidth + 1`).
- **C3:** baseline red must be the containment failure itself, recorded before readout-specific assertions, with root/offending-control/ancestor geometry.

### Calculator

- **K1:** target set now includes sticky top-bar controls and every answer control of the current question/part, including the last answer control, under the tiered reachability rules.
- **K2:** explicit normal-portrait vs reduced-height tier contract is now written with the owner-set 6rem band and minimize fallback.
- **K3:** red/green now measures geometry and `elementFromPoint` hit testing before any unforced click, records `scrollY`, invalidates auto-scroll-tainted samples, and requires a typed `OVERLAP` on the execution base.

### Both

- **S1:** independent checker must read the runner assertions/fixture identity, rerun base + candidate, and take at least one decisive witness measurement using a checker-written probe.

## 4. Optional suggestions incorporated

- Cloze fixture selection must record a deterministic rule so the checker can re-derive the additional long/multi-blank fixture.
- `file://` console attribution narrowly allowlists only the inherited `manifest.webmanifest` CORS diagnostic plus its paired `net::ERR_FAILED`; no blanket console suppression.
- Calculator records whether the admitted baseline already clips/hides keypad/display content at 667×375.
- Calculator checker confirms the desktop ≥781px `:has(... .exam-calculator)` question-card reservation still matches if wrappers/classes change.
- Serial routing now states that a withdrawn/BLOCKED/unintegrated cloze commission leaves the calculator order held unless the owner explicitly rebinds it.

The DevTools safe-area override suggestion was **not promoted to a required contract** because its availability was unverified. The existing order already requires honest attribution of real versus simulated inset coverage.

## 5. Requested return

Do not re-review the entire design. Confirm only whether the R2 text faithfully closes the prior required amendments and owner decisions without introducing a new contradiction.

Return:

- `CLOZE_R2: ACCEPT` or a concrete transcription/logic defect;
- `CALCULATOR_R2: ACCEPT` or a concrete transcription/logic defect;
- `SERIAL_ROUTING: ACCEPT` or a concrete defect;
- identify any **new** unresolved owner decision only if the R2 text actually creates one.

If the R2 text correctly implements your prior required amendments, say so and stop. Do not propose a new round of optional polish merely because another formulation is possible.
