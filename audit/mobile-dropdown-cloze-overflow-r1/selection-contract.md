# Admitted-base selection and bilingual contract evidence

This is producing-team source evidence, not producer-independent review or acceptance. The bounded evidence seat inspected the admitted base and wrote only this artifact; it did not change production source, create commits, inspect the held calculator commission, or read unrelated P27 material. No recursive delegation occurred.

- Work order: `/Users/holemini/Desktop/Project Shrimp/MOBILE-DROPDOWN-CLOZE-OVERFLOW-CODEX-WORK-ORDER-2026-09-16-R2.md`.
- Frozen SHA-256, checked before source work and again before this artifact: `968a575b9f2f5b2b734cc5281a992f92a09dd52c409ea7d104fd5043004d6a6e`.
- Access: disk-reading seat, isolated producer worktree `/Users/holemini/Desktop/Project Shrimp Mobile Cloze R1`, branch `codex/mobile-dropdown-cloze-overflow-r1`.
- Admitted source snapshot: `642b0f9c8707024037709b26b764c7b21e66ddce`. Initial worktree was clean.
- Admitted `src/App.tsx` blob: `8eac13d0b4f7f2631501e20c1ac5d285b7359010`; `src/styles.css` blob: `e95d261bc5713fac990ebc2bda4ef9320a521db7`.

All line references below identify that admitted commit, not post-repair line numbers. They can be reproduced with `git show 642b0f9c8707024037709b26b764c7b21e66ddce:<path> | nl -ba` from the producer worktree. The authority document, current AGENTS, relevant runbook commands, Sep 16 learner-shell milestone, and cited inherited-overflow observations were read. No new clinical claims or schema-version claims are made here.

## Select-to-read finding

**Confirmed on the admitted base:** selecting a cloze option changes the current answer draft and persists the active-session snapshot. It does not create an attempt, grade/result, AnswerEvent, progress update, or completed-set history entry. Completeness indicators may change, which is the existing behavior needed to enable Submit.

| Source location | Observed behavior |
| --- | --- |
| `src/App.tsx:3792–3825` | `ClozeLine` obtains the selected string from `selections[dropdown.id]`, controls native select `value`, and forwards only `(dropdown.id, event.target.value)` through `onSelect`. It disables the select after submission. |
| `src/App.tsx:3732,3748–3755` | `DropdownClozeControl` derives `dropdowns` from `answer.dropdowns` and copies that mapping into `onAnswer({ ...answer, dropdowns: { ...dropdowns, [dropdownId]: optionId } })`. No independent answer state or recording hook exists here. |
| `src/App.tsx:3214–3220,2992–3000,2798–2810,950–956` | The cloze callback flows through `QuestionAnswerControl`, `QuestionCard`, and `SessionView` to `updateAnswer`; submission is wired separately to `submitCurrent`. |
| `src/App.tsx:581–587` | `updateAnswer` blocks edits while submission/completion is in progress, then changes only the specified entry of `current.answers`. It does not call history, grading, progress, completion, or telemetry functions. |
| `src/App.tsx:422–428,5016–5034` | The ordinary session effect serializes and saves the active-session snapshot. Serialization includes the answers and updates the snapshot timestamp; it carries existing attempts/results/scores without creating any. |
| `src/storage.ts:271–318` | `saveActiveSession` writes only the `activeSession` store, merges already committed attempts/results, and has a memory fallback. It does not write progress, events, or completed sets. |
| `src/App.tsx:589–609` | `submitCurrent` explicitly captures the attempt and commits submission; only after that does it update progress, reload AnswerEvents, and hydrate the committed snapshot. Duplicate submits and completed/recovery sessions are guarded. |
| `src/completedMemory.ts:43–69` | `captureAttempt` creates the submission identity and timestamp, clones the answer, and computes grade/score, including per-part case results. |
| `src/storage.ts:319–406` | `commitSubmission` constructs the AnswerEvent, updates progress, adds result/score/attempt, and commits through the progress/answerEvents/activeSession transaction. Its fallback also remains a submission operation. |

Completion-history precision: durable completed-set archival is a separate explicit finish operation, not a select side effect and not literally a call inside `submitCurrent`. `finishSession`/`persistCompletion` are at `src/App.tsx:543–569`; `completeSession` at `src/storage.ts:419–462` archives ordinary Study only when at least one result already exists. `makeCompletedSet` (`src/completedMemory.ts:70–104`) can preserve other entries as `not-submitted` drafts when the learner explicitly ends that set. None of those paths is invoked by intermediate option inspection.

## Answer shape, completeness, and retention

- The source answer contract is `AnswerState.dropdowns?: Record<string, string>`; case parts use `AnswerState.caseStudy?: Record<string, AnswerState>` (`src/grading.ts:10–22`). `DropdownClozeQuestion` owns the blank IDs and ordered option objects (`src/types.ts:132–140`).
- The renderer splits the cloze stem in existing token order, resolves trimmed placeholder IDs, retains literal non-placeholder text, and retains unknown placeholders verbatim (`src/App.tsx:3792–3800`). It retains each option's ID/text and array order, with the empty `Choose` option first (`3811–3825`).
- Cloze completeness requires every dropdown to have a truthy selected value (`src/grading.ts:203`); all case parts must be complete for the case to be complete (`198–201`). Standalone Submit is disabled until completeness and is absent after submission (`src/App.tsx:2940,3011–3016`). Case Submit uses the same aggregate completeness (`3981–3991`).
- Cloze score compares selected IDs with each blank's correct ID (`src/grading.ts:123–126`). Before submission, the cloze's `statusClass` is empty; only submitted controls/tokens receive `correct`/`incorrect` (`src/App.tsx:3801–3807,3813`). A full-text readout must therefore remain neutral before submission.
- Changing the active session's language mode only replaces `languageMode` in the same session (`src/App.tsx:961`). The cloze reveal handler changes only local `revealed` state (`3740–3744`). Neither rewrites the answer.
- Persisted selected drafts reload through `loadActiveSession` and `hydrateSession` (`src/App.tsx:409–420`), with question/answer ID compatibility checks and restoration of `snapshot.answers` (`5036–5077`). This is source support for the required browser reload/resume proof; it does not replace that proof.
- Source validation is independently grounded in `src/schema.ts:893–945`: blank IDs must be unique, EN/ZH placeholders must match configured blanks, options must have IDs and both text fields, option IDs must be unique within a blank, and the correct ID must exist. No fixture should alter these contracts.

Admitted-base limitation, outside this repair: explicitly selecting `Choose` after a real option stores `dropdowns[id] = ""` through the existing callback, whereas `answerFitsQuestion` accepts only actual option IDs (`src/completedMemory.ts:163–170`). A subsequent reload of that explicitly cleared draft can therefore enter the existing recovery path (`src/App.tsx:5047–5048`). This was observed in source, not newly browser-reproduced by this evidence seat. It does not arise for a normal partially or fully selected draft containing only real selected IDs, and no storage/session change is authorized here. Preserve existing Choose semantics and report this separately if encountered; do not silently broaden the repair.

## Chinese gates and shared callers

`DropdownClozeControl` has one source-derived selection mapping for both languages (`src/App.tsx:3732,3751,3766`). Its English line is interactive; the Chinese line has no `interactive` flag or selection callback (`3748–3769`). The noninteractive line resolves the same selected option and projects the requested locale, or `____` when nothing is selected (`3803–3809`).

The admitted gate is `hasZh && (languageMode === "always" || (languageMode === "on-tap" && revealed))` (`3733–3734`). Consequently:

- `off`: Chinese cloze projection and reveal control are absent, including after an earlier reveal.
- `on-tap`: Chinese is initially absent; the `需要中文` button sets the local revealed state without changing the answer (`3740–3744,3757–3761`).
- `always`: Chinese is visible when the cloze stem has Chinese text.
- Post-submit full-Chinese reveal: `QuestionCard`'s Translate all action raises `RevealAllContext` (`2954–2964,3041–3049`); the cloze effect honors that signal only for on-tap with available Chinese (`3730–3739`). Submission by itself does not replace the on-tap gate.

Any added Chinese readout must be inside that same admitted gate. English full text must come from the existing selected option; a readout may not expose correct-option text or invent another selection state.

Case routing remains the same nested answer contract. `CaseStudyControl` keeps all part answers in `answer.caseStudy` and changes one part at a time (`src/App.tsx:3868–3869,3925–3927`). Split mode renders keyed `CaseActivePart` children, hides inactive parts, and gives each its existing answer/callback (`3955–3971`). Part navigation changes the active part ID and scroll position, not the answer mapping (`3890–3915`). `CaseActivePart` delegates back to `QuestionAnswerControl` with the parent's submitted/language state (`4280–4288`). The stacked case layout receives the same `caseAnswers` and update callback (`3929–3942`).

Read-only preview supplies `getCorrectAnswer`, `submitted`, `reviewMode`, and no-op answer/submit callbacks (`src/App.tsx:937–943`). Summary inspection supplies the stored `attempt.answer`, `submitted`, historical attempt context, and no-op callbacks (`4804–4821`). Both flow through the same `QuestionCard` and cloze renderer; disabled-after-submit and readable selected text must work for both current-answer previews and historical attempts.

## Scope of this finding

No admitted-base select-to-read blocker was found. This artifact is source evidence only. The primary producer still owns implementation integration, browser red/green, all required interaction and persistence checks, protected-path proof, and final receipt. An external checker must provide independent acceptance.
