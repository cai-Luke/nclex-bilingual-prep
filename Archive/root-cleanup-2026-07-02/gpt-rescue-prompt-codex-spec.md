# GPT Rescue Prompt — Codex Spec

**Date:** 2026-07-01
**Origin:** Dogfood observation (Luke) → GPT litigation note → Claude adjudication.
**Supersedes (learner-facing):** the Summary batch "Copy review prompt" action shipped Jul 1 ("Summary GPT Review Prompt" pass in `PROJECT-HISTORY.md`).

## Decision

The learner's real workflow is: answer → see it's wrong → immediately paste the item into external GPT to ask why. The shipped feature only offers a session-end batch export at Summary, which misses the rescue moment. Convert the review-prompt machinery from session-batch to **single-question / single-case-part rescue prompts**, surfaced (a) immediately after a wrong or partially-correct submit wherever the rationale renders, and (b) per-item in the Summary missed-item read-through. The Summary **batch** export is removed.

Architecture invariants unchanged: static/offline, clipboard-only, no API key, no live model call, no readiness/pass-fail language (AGENTS.md product constraints).

Three deliberate departures from the GPT litigation note, adjudicated by Claude:

1. **Summary keeps a per-item button; only the batch dies.** Test/adaptive modes do not reveal rationale mid-session, so for those modes Summary *is* the rescue moment. One button component, two mount points (post-submit rationale block; Summary per-item read-through). No mode-specific logic. **UI-density constraint:** the Summary button appears *only inside each missed item's read-through/review block* — Summary must not regain any top-level GPT action/CTA. Summary already carries stats and targeted-review entrypoints; the rescue affordance stays buried per-item.
2. **Visual items get structured-data serialization, not a bare disclaimer.** Per DECISIONS principle 6, every visual is deterministic and inspectable from structured data. Serialize `question.visual` (and case exhibit visuals) into the prompt as fenced JSON with `selfCheck` and any `meta` field stripped *recursively at all depths*, prefixed by one ZH framing line. Disclaimer-only text is the *fallback* when serialization throws. `question.meta` and all audit-only fields (principle 11) must never enter the prompt.
3. **Case-part context = cumulative visible exhibits, not just title/summary.** Use `getVisibleCaseStages` from `src/examLayout.ts` (principle 23: cumulative, fail-open) with the part; include global exhibits (always) + visible-stage exhibits (title + content, EN and ZH), with exhibit visuals serialized per departure 2. Note the common path returns *all* stages (see Case-part body) — that is intended.

**Standing UI priority (Luke, this pass):** this is the highest-value UI affordance in the app right now — the whole point is to push the learner toward stronger external models, and a copy/paste prompt is only useful if it is *immediately visible on the wrong-answer screen*, not tucked behind a menu or a secondary control. On the post-submit rationale surface for a missed item, the rescue button is **prominent and primary** (clearly visible without scrolling past the rationale, styled as a first-class action, not a subtle text link). This is a deliberate first-implementation stance; prominence can be dialed back later on user feedback, never up. The Summary per-item placement stays buried per departure 1 — the prominence directive applies to the live wrong-answer moment, which is where the learner actually is when they want it.

## Scope

### In

- Refactor `src/reviewPrompt.ts`: session-batch builder → single-target builder.
- New exported builder:
  ```ts
  buildQuestionRescuePromptText({
    question: StandaloneQuestion,
    answer: AnswerState,
    parentCase?: CaseStudyQuestion,   // present iff the target is an embedded part
    generatedAt?: Date,
  }): string
  ```
- Delete `buildReviewPromptText` and its single App.tsx call site (import confirmed at App.tsx head; locate the Summary "Copy review prompt" control from the Jul 1 pass and remove it). No dead exports remain.
- New button component (shared for both mount points), reusing the existing clipboard pattern from the Jul 1 pass: `navigator.clipboard.writeText` → success state "已复制，粘贴到 GPT。/ Copied. Paste into GPT." → fallback textarea on failure. **Inject the button explicitly into the learner rationale/review surfaces; do not bake it into a shared `RationalePanel`-type component.** Baking it into a shared rationale renderer would leak the button into Preview Lab and Developer Review, which reuse that rendering path. Pass it (or a `showRescueButton` flag + the built prompt) down explicitly from the learner Study/Summary surfaces only, gated on the not-fully-correct result. This also keeps the "fully-correct shows nothing" rule enforced at the call site where the `gradeQuestion` / `gradeStandaloneQuestion` result is already in hand.
- Convert `test:review-prompt` tests from session-batch to single-item / single-case-part coverage.

### Out (explicit non-goals, do not implement)

- Rescue-tap telemetry store. Demand is already proven by observed behavior; instrument-before-building targets unproven demand. Revisit only if we need per-topic rescue frequency.
- Per-kind pretty visual serialization (tables, ASCII charts). Generic JSON dump only.
- Any auto-open of GPT, deep links, or API integration.
- Changes to grading, SRS, storage, or session flow.

## Trigger predicate (reuse existing grading semantics)

- **Standalone (post-submit):** show button iff the item's graded result is not fully correct — i.e. the same boolean the session already stores (`gradeQuestion` = `isFullyCorrect`, principle 17). Partial credit therefore shows the button with no extra logic.
- **Case part (after aggregate case submit):** show per-part button iff `!gradeStandaloneQuestion(part, partAnswer)` — the exact predicate `flattenMissedLeaves` used; reuse it, don't reimplement. Note the part is a `CaseSubQuestion`, which is the second argument `getVisibleCaseStages` expects.
- Fully-correct answers: no button, no placeholder, no UI noise.
- Button never renders pre-submit.

## Button copy

- Standalone: **Ask GPT about this question / 让 GPT 讲讲这道题**
- Case part: **Ask GPT about this case part / 让 GPT 讲讲这个案例部分**
(Exact bilingual copy at Codex discretion if these collide with existing style; keep the verb "ask/讲" framing, not "export".)

## Prompt content contract

### Preamble

Rework the existing `PREAMBLE` from session framing ("本次练习" / "错题") to single-target framing ("这道题" / "这个案例部分"). Keep unchanged: Chinese-first instruction, English medical terms preserved with pronunciation help, the four-step teaching structure (clinical context → why correct/why not others → term list with pronunciation + example sentence → one comprehension check question), encouraging tone, and the prohibition on pass/fail readiness language. The comprehension-check step stays singular (1 question — it already is).

### Standalone item body

Reuse the existing per-type describers unchanged (`describeOptionQuestion`, `describeOrderedResponse`, `describeFillInBlank`, `describeMatrix`, `describeDropdownCloze`, `describeHighlight`, `describeBowtie`) and the existing `renderDetailedLeaf` field set:

- item type · category · topic header
- stem EN + ZH (plus clozeStem / highlight passage where applicable)
- answer breakdown (learner answer vs correct, per-choice rationales per existing logic)
- `rationale.correct` EN + ZH
- glossary terms line
- `generatedAt` line

### Case-part body (parentCase present)

- Parent case title + summary (EN + ZH) — as today.
- **Exhibits.** The clinical data lives in exhibits, and there are two independent sources — include both:
  1. **Global exhibits — always:** `parentCase.caseStudy.exhibits`. These are unconditional and do not depend on stage metadata.
  2. **Visible-stage exhibits:** call `getVisibleCaseStages(parentCase, question)` — verified live signature is `(question: CaseStudyQuestion, activeQuestion?: CaseSubQuestion)`, so the **first argument is the full `CaseStudyQuestion`, not `parentCase.caseStudy`**, and the second is the embedded part. It returns `CaseStudyStage[]`; read `stage.exhibits` off each returned stage.
- **Fail-open semantics (verified against live `src/examLayout.ts`, principle 23) — encode live behavior in tests, not this prose if they ever drift:** three branches, distinct outcomes:
  1. Case has **no stages at all** (`stages.length === 0`), or no `activeQuestion` passed → returns `[]`.
  2. Case **has stages** but the part carries **no `stageId` / `answerableAfterStageId`** → falls through to `return stages` = **all stages**. This is the *common* path: ~88% of staged cases have parts with no resolvable refs (principle 23), so most case parts will surface all stage exhibits. That matches current UI fail-open behavior and is correct.
  3. Case has stages and the part carries a ref that **resolves** → cumulative slice through that stage.
  (A ref that is *present but unresolved* also falls through to all stages, same as branch 2.)
- Because branch 1 returns `[]` and branches 2–3 can return stages, **global `parentCase.caseStudy.exhibits` must always be included as an independent source (step 1 above)** — a no-stages case yields an empty stage list, so relying on the stage path alone would carry zero clinical exhibits into the prompt for those cases. Do not "fix" any of these fallbacks; they are the invariant. Tests must assert against the live helper's actual return, not against this description.
- For each included exhibit (global + visible-stage): title EN/ZH, content EN/ZH, and any exhibit visual serialized per the visual rules below.
- Then the same standalone body for the part itself (the part is a `CaseSubQuestion` / standalone-shaped leaf; the existing describers apply unchanged).

### Visual serialization (applies to `question.visual` and exhibit visuals)

- One ZH framing line, e.g.: `这道题包含应用内绘制的图形（kind: rhythm_strip）。以下是生成该图形的结构化数据，请据此理解图形内容：`
- Fenced ` ```json ` block: the visual object with audit/internal fields stripped. **Strip recursively, not just top-level:** remove every `selfCheck` key at any depth, and remove any field named `meta` at any depth. The rule is "no audit/`selfCheck`/`meta` fields anywhere in a prompt payload," so a future nested visual shape cannot leak a check payload or keyed-answer data (principle 11). Implement as a recursive object walk (or a `JSON.stringify` replacer that drops those keys), not a shallow delete. Deterministic key order not required (prompt text, not a bank artifact).
- Never include `question.meta` or any audit-only field.
- If serialization throws: fall back to the framing line plus `（无法附上图形数据 — 我会自己描述我看到的内容。）` and continue; the button still works.

## Removal checklist

- [ ] Summary batch "Copy review prompt" control and its state removed from App.tsx.
- [ ] `buildReviewPromptText`, `flattenMissedLeaves`, `visualPointer`, and the session-summary string assembly deleted from `reviewPrompt.ts` (keep `flattenMissedLeaves`' part-grading predicate logic by reusing `gradeStandaloneQuestion` directly at the call site).
- [ ] `SessionState` import dropped from `reviewPrompt.ts` if no longer needed.
- [ ] Session-batch tests removed/converted; no orphaned fixtures.

## Acceptance criteria

1. Wrong or partially-correct standalone item in Study mode shows the rescue button in the post-submit rationale area; fully-correct shows nothing.
2. Wrong or partially-correct case part shows its rescue button in that part's rationale/review area after aggregate case submit.
3. Summary missed-item read-through shows a per-item rescue button on each missed leaf (standalone and case part); the batch action is gone.
4. Copied text contains: learner answer, correct answer, EN+ZH stem and rationale, glossary; case parts additionally contain parent title/summary and visible exhibits.
5. Visual-bearing items include the fenced JSON visual data (no `selfCheck`, no `meta`); serialization failure degrades to the disclaimer line without breaking copy.
6. Prompt is Chinese-first, preserves English medical terms, requests pronunciation, contains no pass/fail readiness language.
7. Clipboard failure surfaces the fallback textarea.
8. `npm run test:review-prompt` (converted), `npx tsc -b --pretty false`, and `npm run build` pass.
9. `PROJECT-HISTORY.md` milestone entry added; the "Product decisions" list gains: external-GPT handoff is per-question at the rationale moment (plus per-item at Summary), never a session batch.

## Notes for Codex

- Read live source first: `src/reviewPrompt.ts`, `src/examLayout.ts`, the Jul 1 Summary control in `App.tsx`, and the existing `test:review-prompt` file. This spec names behaviors and predicates; exact JSX anchors are yours.
- Do not touch `grading.ts`, `storage.ts`, `sessionSampler.ts`, or telemetry code.
- Keep the change surgical; no App.tsx architecture refactor rides along.
