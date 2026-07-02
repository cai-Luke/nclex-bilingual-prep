# Summary GPT Handoff — "Copy review prompt"

Status: spec-ready for Codex. Litigated by Claude 2026-06-30 against live `SummaryView`/`grading.ts`/`types.ts`/`storage.ts`; amended 2026-06-30 to the Chinese-first tutor framing after Luke supplied the target user's actual GPT workflow; hardened 2026-06-30 after a Codex pre-implementation review (schema-completeness gaps); closed out 2026-06-30 after a final GPT pre-implementation pass caught a module-cycle risk, an incomplete visual-leaf detection rule, and a real ambiguity in the choice-breakdown/locale design. Chain: Claude v1 (English-first bilingual review) → GPT amendment (Chinese-first framing, adopted) → Codex pre-implementation review (schema-completeness gaps, adopted) → GPT closing pre-implementation review (adopted below) → Claude is the version below, implementation-ready. No bank, schema, or grading semantics change.

## Goal

Add a "Copy review prompt" action to `SummaryView` that assembles the just-completed session's missed content — question, correct answer, rationale, and glossary — plus light session context into one Markdown-formatted text block, and copies it to the clipboard. The learner pastes this into an external GPT conversation for supplemental review. This is a client-side text-assembly feature only.

## Non-goals

- No in-app AI call, API key, or network request of any kind — stays inside the existing static/offline/`file://` invariant (`AGENTS.md` Product Constraints).
- No change to grading, storage, targeted review, or session state shape.
- No dump of full case-study exhibits — only the leaf sub-questions actually missed, with the parent case referenced by title only.
- No new pass/fail or readiness language beyond what `SummaryView` already shows.
- No configurable prompt language/style. The preamble below is hardcoded to a Chinese-first Mandarin-tutor framing — this feature is deliberately single-user-specific (per Luke), not a general product setting. Revisit only if a second differently-configured learner is ever a real scenario.
- No text description of `question.visual` data. Visual items are load-bearing by construction (principle 6 in `DECISIONS.md` — every promoted visual item's answer depends on the visual, or the item wouldn't have passed the promotion gate), and this repo has no existing per-kind "visual → text" serializer across its 11 visual kinds (waveforms like `rhythm_strip`/`capnography`/`fetal_monitoring` especially resist a faithful text description). Hand-writing 11 kind-specific serializers, or worse, letting the receiving GPT guess at chart data it never saw, is out of scope for this pass and risks confidently-wrong clinical explanations — the one place this repo is explicit that correctness beats completeness ("clinical-safety and data-contract correctness trump implementation polish"). Missed leaves carrying a `visual` are excluded from full detail blocks and listed as compact pointers instead (see §1). Revisit only as a dedicated future spec if this exclusion turns out to gut real usefulness — instrument first, per the same principle governing Sprint D.

## Data flow

New pure module `src/reviewPrompt.ts` (same extraction discipline as `src/sessionSampler.ts` / `src/examLayout.ts` — keeps `App.tsx` from growing further and gives this a testable seam):

```ts
export const buildReviewPromptText = (params: {
  session: SessionState;
  generatedAt?: Date; // defaults to new Date()
}): string
```

### 1. Flatten to "missed leaf items"

Each leaf carries the actual answerable `StandaloneQuestion` (not the wrapping case, when applicable) plus its own answer, so every later step is uniform regardless of whether the leaf is a top-level question or an embedded case part:

```ts
type ReviewLeaf = {
  standalone: StandaloneQuestion; // top-level question, or the specific embedded case part
  answer: AnswerState;
  parentCaseId?: string;
  parentCaseTitle?: TextPair;
  parentCaseSummary?: TextPair; // question.caseStudy.summary, if present
};
```

For each `question` in `session.questions` where `session.results[question.id] === false`:

- If `question.itemType !== "case_study"`: one leaf = `{ standalone: question, answer: session.answers[question.id] ?? getInitialAnswer(question) }`.
- If `question.itemType === "case_study"`: for each `part` in `question.caseStudy.questions`:
  - `partAnswer = session.answers[question.id]?.caseStudy?.[part.id] ?? getInitialAnswer(part)`
  - `partCorrect = gradeStandaloneQuestion(part, partAnswer)` (reuse `grading.ts`, already exported)
  - Include a leaf only where `partCorrect === false`: `{ standalone: part, answer: partAnswer, parentCaseId: question.id, parentCaseTitle: question.caseStudy.title, parentCaseSummary: question.caseStudy.summary }`.

This is exhaustive by construction: `scoreCaseStudy` sums part `earned/possible`, and `isFullyCorrect` on the case requires every part to itself be full-marks, so an aggregate-missed case always has at least one part-level miss to surface.

**Visual split.** Partition the flattened leaves into `detailedLeaves` and `visualLeaves` (see the visual non-goal above). `detailedLeaves` get the full per-leaf block in §3; `visualLeaves` get a single compact pointer line each in the session header (§4), not a full block. A leaf is a `visualLeaf` when **either**:
- `standalone.visual !== undefined` (the leaf's own direct visual — covers top-level standalone visuals and per-part visuals on embedded case questions uniformly, both inherit `visual?: QuestionVisual` from `CommonQuestion`), **or**
- `parentCaseId !== undefined` and the parent case has any exhibit or stage visual anywhere (`question.caseStudy.exhibits?.some(e => e.visual) || question.caseStudy.stages?.some(s => s.exhibits?.some(e => e.visual))`).

The second condition is a closing-hardening fix (a GPT catch): the original rule only checked the leaf's own `.visual`, missing case-study chart/stage/exhibit visuals a part might depend on without carrying its own `visual` field — confirmed there's at least one live case with stage-exhibit visuals and non-visual embedded parts. Per this repo's stage-visibility rule (`DECISIONS.md` principle 23, cumulative and fail-open), a case's exhibits/stage-exhibits are visible to any part at or after that stage, often effectively all parts — so rather than trying to map "which specific stage-exhibit does this specific missed part actually depend on" (a real content-quality gap the repo itself already documents as unsolved: "only ~12 of 102 staged cases have clean part→stage mappings"), the conservative and correct default is: if the parent case has *any* exhibit/stage visual, treat every missed leaf from that case as a `visualLeaf` pointer rather than risk a detailed block that's silently missing the chart it depends on. This can only ever exclude leaves that would otherwise get a (possibly incomplete) detail block — it never fabricates content, consistent with the rest of this spec's posture.

If the flattened list is empty, nothing renders (see UI wiring — button stays disabled). The button's `disabled` check stays `missed.length === 0` (the pre-flatten top-level count) since a non-empty `missed` always yields at least one leaf.

### 2. `describeChoiceBreakdown(leaf: ReviewLeaf): string`

**Signature change (closing hardening — a GPT catch):** dropped the `locale` parameter entirely. It was a leftover from the earlier `describeCorrectAnswer(locale)` design, which made sense when the function returned pure single-language text — it doesn't fit here, because §2's own inline `en — zh` per-line convention already makes every line bilingual. Calling this twice under separate "Answer breakdown — EN" / "答题详情 — ZH" headers (the earlier design) would have produced two near-duplicate blocks, since each call already contained both languages. Now there's exactly one call, rendered under one bilingual header (see §3) — removes the ambiguity rather than papering over it.

Replaces the earlier `describeCorrectAnswer` design after Codex's pre-implementation review correctly flagged two gaps against live `src/types.ts`/`src/grading.ts`: (a) the preamble already asks the receiving GPT to explain why *other* choices weren't optimal, which is impossible without listing what those choices were, and (b) omitting the learner's own selection turns this into a generic answer-key dump instead of "why was *your* reasoning wrong," which is the actual value of a personalized review. Both gaps close with the same fix: render the full choice space with correctness/selection state, not just the final answer. Everything rendered here is schema-truth (option text, `.correct` flags, `answer` state, `rationale.byChoice`) plus the app's own recorded answer state — nothing invented, keeping this a pure projection like the rest of the module.

**Markers:** `✓` = correct, `→` = what she selected/wrote. Each choice-list line pairs `en — zh` inline (a deliberate, noted exception to the rest of the block's separate-EN/ZH-paragraph convention — doubling a multi-line list would bloat it for no gain a paragraph doesn't have; both languages are still fully present per line).

**Targeted `rationale.byChoice` inclusion, by item type:** `multiple_choice` / `select_all` only — include a choice's `byChoice` entry when it's correct, or when she selected it and it's wrong (the union of "the right answer" and "her actual mistake"); skip `byChoice` for distractors she never touched, since with 4–6+ options that's often irrelevant reference material, not personalized review. Every other type (`ordered_response`, `fill_in_blank`, `matrix`, `dropdown_cloze`, `highlight`, `bowtie`) includes `byChoice` for every available `refId` unconditionally — their choice pools are naturally small (a handful of steps/rows/blanks/tokens), so "targeted" filtering has no real payoff there and just adds a second code path for no reason.

| itemType | rendering |
|---|---|
| `multiple_choice` / `select_all` | One line per option: `[✓][→] <option.en> — <option.zh>` (markers present/absent per state). Targeted `byChoice` lines follow. |
| `ordered_response` | Two labeled sequences, since order (not membership) is what's being compared: `Correct order: 1) <en>—<zh> 2) ...` and `Her order: 1) <en>—<zh> 2) ...` (always differs from correct, by construction — `ordered_response` scores boolean via exact-sequence match, so a missed leaf's order is never equal to `correct`). Full `byChoice` per option follows (unconditional, see above). |
| `fill_in_blank` | Per blank: `Blank <i> — correct: <value/unit or acceptable[0]> · she wrote: "<answer.blanks[id] trimmed, or '(left blank)'>"`. `acceptable`/`numeric` have no dedicated `zh` field (values are numbers or English drug/lab terms) and her submitted text isn't translated either — no `zh` variant is fabricated. Full `byChoice` per `blankId` follows. |
| `matrix` | Per row: `<row.en>—<row.zh> — correct: <col list en—zh> · she selected: <col list en—zh, or '(none)'>`. Full `byChoice` per `rowId` follows. |
| `dropdown_cloze` | Per dropdown, in declared order: `Blank <i> — correct: <option.en>—<option.zh> · she selected: <selected option, or '(not answered)'>`. Full `byChoice` per `dropdownId` follows. Requires `clozeStem` — see §3. |
| `highlight` | `Correct: <en—zh segments joined>` / `Her selection: <en—zh segments she picked, or '(none selected)'>`. Full `byChoice` per `segmentId` follows. Requires the reconstructed passage — see §3. |
| `bowtie` | Per zone (condition/actions/parameters): `<Zone> — token pool: <en—zh per token>` / `<Zone> — correct: <en—zh>` / `<Zone> — she chose: <en—zh, or '(not answered)'>`. Full `byChoice` per token id follows. |

Suggest a fixture-based test (`scripts/tests/review-prompt.ts`, wired to a new `npm run test:review-prompt`) covering one case per `itemType` × at least one "she got it wrong" and one "she left it blank/unanswered" variant, using real ids from a canonical bank where practical. Explicitly assert: the `multiple_choice`/`select_all` targeting rule (an untouched wrong distractor's `byChoice` text does not appear in output; a selected-wrong distractor's does); that `fill_in_blank` output never contains a translated variant of the value; and that `ordered_response`'s two sequences are never identical for a leaf that reached this renderer at all.

### 3. Per-leaf Markdown block

Only `detailedLeaves` (no `visual`) get a block; `visualLeaves` are excluded here and listed separately in §4.

```
### <n>. <formatItemType(standalone.itemType)> · <standalone.category> · <standalone.topic>[ · from case: <parentCaseTitle.en>]
[*Case context: <parentCaseSummary.en> — <parentCaseSummary.zh>* — only when parentCaseSummary is present]

**Question source — EN:** <standalone.stem.en>
**题目原文 — ZH:** <standalone.stem.zh>

[dropdown_cloze only]
**Fill-in sentence — EN:** <standalone.clozeStem.en>
**填空句 — ZH:** <standalone.clozeStem.zh>

[highlight only — reconstructed passage, segments joined in declared order with a single space]
**Passage — EN:** <highlight.segments.map(s => s.en).join(" ")>
**文段 — ZH:** <highlight.segments.map(s => s.zh).join(" ")>

**Answer breakdown / 答题详情:**
<describeChoiceBreakdown(leaf)>

**Rationale source — EN:** <standalone.rationale.correct.en>
**解析原文 — ZH:** <standalone.rationale.correct.zh>

**English terms to practice:** <termEn> (<termZh> — <defZh>); <termEn> (<termZh> — <defZh>)...
```

Omit the "English terms to practice" line entirely when `standalone.glossary` is empty. Reuse `formatItemType` from the new `src/itemTypes.ts` module (see §2's signature-change note and *UI wiring/Files touched* below — **not** exported from `App.tsx`, per a closing-hardening fix). Category/topic/item-type labels stay English (unchanged, same as v1) — these are navigational/exam-vocabulary labels, not clinical prose.

**Resolved judgment call (was flagged in v1):** v1 defaulted to a generic EN-primary bilingual block and flagged the EN/ZH balance as the one open question in this spec. Real usage settled it the other way — both languages are still present (nothing here drops ZH, so the "bilingual is an invariant" house style still holds), but the block is now explicitly source material *for* the Chinese-first preamble in §4, not a standalone EN-first review in its own right. Both EN and ZH source text stay in the block (not just ZH) so the receiving GPT has verified dual-language ground truth to explain from, rather than reconstructing meaning from one language alone — this avoids the receiving model drifting or mistranslating, keeping the app's role strictly "supply verified schema-truth facts," never "generate an explanation." The `describeChoiceBreakdown` upgrade in §2 extends the same principle to the choices themselves.

### 4. Preamble + session header (prepended once)

Adopting GPT's proposed preamble verbatim — it correctly targets the real workflow Luke described (ask for clinical correlation in Mandarin → understand the miss → practice saying the English terms), keeps the app itself generating zero clinical prose (the preamble only *instructs* the receiving GPT; all clinical content in the per-leaf blocks is still verbatim schema text), and explicitly restates the app's own no-pass/fail-language and no-shaming constraints for the receiving assistant:

```md
你正在帮助一位准备 NCLEX-RN 的中文母语学习者复习她刚做错的题目。

请主要用简体中文解释，但重要的医学、护理、药物、症状、诊断和考试关键词请保留英文原词。目标不是翻译整题，而是帮助她理解临床逻辑，并能开口读出关键英文术语。

请按每道错题这样讲解：

1. 先用中文说明这题在临床上对应什么情况，也就是为什么护士需要关心这个问题。
2. 用中文解释为什么正确答案对；必要时简短解释为什么其他选择不优先或不安全。
3. 把关键英文医学词列出来，给出：
   - English term
   - 简体中文意思
   - 简单发音提示（用普通人能读出来的英文近似音，不需要 IPA）
   - 一个很短的英文例句，帮助她知道临床对话中怎么说
4. 最后用中文问 1 个检查理解的小问题。

语气要鼓励、耐心、具体。不要评价她是否会通过考试，不要使用羞辱、吓人或 pass/fail readiness 语言。

## 本次练习摘要
- 模式：<session.mode>
- 已作答：<answered> · 做错：<missed.length> 题 · 跳过：<skipped>
- 错题涉及的类别：<distinct categories among missed leaves, comma-joined — category values stay English, same reasoning as above>
- 生成时间：<generatedAt, human-readable local format>
[only when visualLeaves.length > 0]
- 另有 <visualLeaves.length> 道题包含图表/心电图等视觉资料，需要在软件内查看，此处未展开：<one line per visual leaf — "<formatItemType> · <topic> · <visual.kind>", comma- or line-joined>
[only when detailedLeaves.length === 0 && visualLeaves.length > 0 — closing-hardening addition, a GPT product note: makes the "nothing to work with" state explicit rather than implicit, so the receiving GPT doesn't proceed as if it has full context for a session it actually knows nothing detailed about]
- **本次做错的题目全部依赖图表/心电图等视觉资料，以上仅列出题号和类别，没有可展开的详细内容 — 请直接在软件内复习这些题目。**

## 错题详情（共 <detailedLeaves.length> 处[，另 <visualLeaves.length> 处见上方图表提示]）
```

The session-summary header and section labels were flipped to Chinese too (not part of GPT's literal proposal, but a direct extension of it) so the whole document reads as one coherent Chinese-first artifact rather than switching back to English for the meta-context sitting directly under a Chinese preamble — category/topic *values* stay English regardless (they're exam vocabulary, per the resolved-judgment-call note above). Per-leaf blocks follow, separated by `---`.

**Count-unit fix (Codex pre-implementation review):** `做错：<missed.length>` is the top-level session count — same unit as `已作答`/`跳过`, matching what `SummaryView` already shows the learner elsewhere, so it's left alone. The itemized heading below it is a *different* unit (flattened leaves, §1) and previously used the ambiguous "共 <N> 题" wording pulled from the flattened total; Codex correctly flagged that a missed case study counts as one in `missed.length` but can contribute several leaves, so the two numbers can legitimately differ and "题" (questions) overclaimed precision. Fixed by: labeling the heading count as `detailedLeaves.length` specifically (exactly matching the number of blocks that actually follow, never a larger flattened total that includes undetailed visual leaves), using "处" (a neutral "item/spot" counter) instead of "题", and calling out the visual-leaf count separately rather than folding it into either number silently.

**Explicitly out of scope, confirmed against `AGENTS.md`/`DECISIONS.md`:** the app does not generate pronunciation cues, IPA, or example sentences itself — those are requested *of* the receiving GPT in the preamble, never computed locally. This keeps `buildReviewPromptText` a pure schema→string projection with zero invented content, consistent with principle 3 (deterministic core, LLM only for the irreducible semantic residual) and the same reasoning that already parked in-app audio generation in favor of exactly this GPT-conversation workflow (see `DECISIONS.md`, "Audio generation — deprioritized 2026-06-22").

## UI wiring (`src/App.tsx`, `SummaryView`)

- **`formatItemType` moves to a new tiny pure module, `src/itemTypes.ts`** (closing-hardening fix, a GPT catch — supersedes the earlier "export it from `App.tsx`" plan). Exporting it from `App.tsx` would create a module cycle: `App.tsx` imports `buildReviewPromptText` from `reviewPrompt.ts`, and `reviewPrompt.ts` would import `formatItemType` back from `App.tsx` — a two-file import cycle that's fragile under ESM/bundler semantics even when it happens to work. Moving the function (unchanged body) into its own module and importing it from both `App.tsx` and `reviewPrompt.ts` removes the cycle entirely rather than hoping it resolves cleanly.
- New icon imports: `Copy`, `Check` from `lucide-react` (already a dependency).
- New button in the hero `action-row`, between "Practice related" and "Review missed terms":
  ```tsx
  <button type="button" onClick={handleCopyPrompt} disabled={missed.length === 0}>
    {copyState === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
    <span>{copyState === "copied" ? "Copied!" : "Copy review prompt"}</span>
  </button>
  ```
  `disabled={missed.length === 0}` reuses the `missed` array `SummaryView` already computes — valid as a proxy because missed leaves only ever come from missed top-level questions.
- Compute the prompt text once, not inline per render or per click: `const reviewPromptText = useMemo(() => buildReviewPromptText({ session }), [session]);` at component scope, used by both the clipboard handler and the fallback textarea. This fixes a real bug Codex's pre-implementation review caught: the original draft called `buildReviewPromptText({ session })` fresh inside the fallback textarea's `value` prop, which would re-run `new Date()` (via the default `generatedAt`) on every unrelated re-render (e.g. `expandedIds` toggling elsewhere in `SummaryView`), so the fallback textarea could silently show a different `generatedAt` timestamp than whatever was actually attempted for clipboard copy. One memoized value, read by both paths, closes that gap.
- Local state: `const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle")`.
- Handler:
  ```ts
  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(reviewPromptText);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("manual");
    }
  };
  ```
- Fallback (clipboard API can be unavailable under restricted/`file://` contexts, same concern that already drives the try/catch pattern throughout `storage.ts`): when `copyState === "manual"`, render a `<textarea readOnly value={reviewPromptText} onFocus={(e) => e.currentTarget.select()} />` below the action row with a one-line note ("Clipboard access isn't available here — select the text above and copy manually"). Keep this visually minimal, reusing existing input/textarea styling rather than introducing new visual language.

## Files touched

- `src/itemTypes.ts` (new, pure — `formatItemType` relocated here unchanged, to avoid the `App.tsx` ↔ `reviewPrompt.ts` module cycle)
- `src/reviewPrompt.ts` (new, pure)
- `scripts/tests/review-prompt.ts` (new, recommended given the added itemType/answer-state coverage surface — see §2's test note) + `package.json` script `test:review-prompt`
- `src/App.tsx` (import `formatItemType` from `src/itemTypes.ts` instead of defining it locally; SummaryView: button, memoized `reviewPromptText`, handler, fallback textarea, two icon imports)
- `src/styles.css` (minor: fallback textarea styling only; no new visual system)

## Verification

- `npx tsc -b --pretty false`
- `npm run test:review-prompt` (if added)
- `npm run build`
- Browser smoke: a Study/Preview-Lab session with at least one missed standalone item, one missed case-study part, and (if available in the fixture pool) one missed visual-carrying item → confirm button enabled; clipboard content structure (preamble, session header including the visual-leaf pointer line, per-item blocks, bilingual pairs, `clozeStem`/highlight-passage lines present only for those item types, choice-breakdown markers matching what was actually answered, targeted vs. full `byChoice` inclusion per §2's rule, glossary line present/absent correctly); disabled state when nothing missed; the manual-fallback textarea path on a simulated clipboard failure showing the identical `generatedAt` as whatever the clipboard attempt used.
- No bank/schema/grading files touched, so `npm run validate-bank` / `npm run audit` aren't required by this change, though harmless to run.
