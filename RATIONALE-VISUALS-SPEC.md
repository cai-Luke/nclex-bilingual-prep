# RATIONALE-VISUALS-SPEC.md — explanation visuals on `rationale` (schema `1.5`)

**Status:** ready for implementation (Codex).
**Schema bump:** `1.4 → 1.5`. Additive, core-touching (changes the `Rationale` type). Land on a clean tree.
**Scope owner split:** Codex implements; this spec is the contract. Content/authoring prompt changes are **out of scope here** (next session — see §8).

---

## 1. Decision (litigation closed)

Add an optional, **answer-revealed** explanation-visual slot to the rationale, distinct from the load-bearing `question.visual` stimulus slot.

- **Shape:** `rationale.visuals?: QuestionVisual[]`, 1–6 entries. Empty array is **invalid** (fail loud); absence means "no visuals."
- **Scope (v1):** reuse the existing visual kinds only. **No** new union members, **no** AI-generated or bespoke art, **no** per-`byChoice`/per-row/per-dropdown attachment.
- **Validation mode:** the **exhibit invocation path** — structural `validate` only; **no** placement check and **no** `selfCheck`. (See §3; this is the load-bearing correction — do **not** reuse the `question.visual` validation path.)
- **Render:** stacked figures, after `rationale.correct`, before the `byChoice` "Per choice" block; bilingual captions via the existing `VisualStimulus` dispatcher.

### Why exhibit-mode, not the stimulus path

The stimulus path is `validateVisual(visual, path, reasons, { itemType, question })`. Both options are wrong here:

- `itemType` triggers the **placement check** (`allowedItemTypes` / `VISUAL_ITEM_TYPES`), which restricts visuals to `multiple_choice | select_all | matrix`. Every item type has a rationale, so running it would silently reject explanation visuals on `ordered_response`, `fill_in_blank`, `dropdown_cloze`, `highlight`, and `bowtie`.
- `question` triggers `selfCheck`, the arithmetic/answer-coupling gate. An explanation figure is *meant* to reveal the answer (threshold drawn in, abnormality annotated); `selfCheck` would impose a gate that contradicts the figure's purpose.

Case-study exhibits already validate visuals in exactly the mode we want — `validateVisual(value.visual, path, reasons)` with no `itemType`, no `question`. We invoke that same mode from the rationale. The tradeoff is explicit: with `selfCheck` off, nothing mechanical catches a rationale figure whose numbers contradict the rationale text — that correctness burden moves to the promotion/cross-model gate (see Appendix B).

---

## 2. Type changes — `src/types.ts`

**2a.** Extend `SchemaVersion`:

```ts
export type SchemaVersion = "1.0" | "1.1" | "1.2" | "1.3" | "1.4" | "1.5";
```

**2b.** Add `visuals` to `Rationale` (`QuestionVisual` is already imported in this file):

```ts
export type Rationale = {
  correct: TextPair;
  byChoice?: RationaleChoice[];
  visuals?: QuestionVisual[];
};
```

No other type changes. `CommonQuestion.rationale` already carries the new field for every item type, including embedded case-study questions, for free.

---

## 3. Validation — `src/schema.ts`

**3a.** Bump the constants:

```ts
export const SCHEMA_VERSION = "1.5";

export const supportedSchemaVersions =
  ["1.0", "1.1", "1.2", "1.3", "1.4", "1.5"] as const satisfies readonly SchemaVersion[];
```

**3b.** In `validateQuestion`, inside the existing `if (!isRecord(raw.rationale)) { ... } else { ... }` block, **after** the `byChoice` checks, add the `visuals` checks. Exhibit mode — no `itemType`, no `question`:

```ts
if (raw.rationale.visuals !== undefined) {
  if (!Array.isArray(raw.rationale.visuals)) {
    reasons.push("rationale.visuals must be an array when present");
  } else if (raw.rationale.visuals.length === 0) {
    reasons.push("rationale.visuals must not be empty (omit the field for no visuals)");
  } else if (raw.rationale.visuals.length > 6) {
    reasons.push("rationale.visuals must contain at most 6 entries");
  } else {
    raw.rationale.visuals.forEach((visual, index) => {
      validateVisual(visual, `rationale.visuals[${index}]`, reasons);
    });
  }
}
```

Notes:
- Passing no `options` to `validateVisual` means placement and `selfCheck` are both skipped (the `if (options.itemType !== undefined)` and `if (mod.selfCheck && options.question ...)` guards). Structural `mod.validate` still runs, so a malformed spec (bad `kind`, out-of-range field) still fails.
- The per-kind `requiredSchemaVersion` floor (default `1.2`) is **not** enforced here, matching how `question.visual` is handled in `validateQuestion` (schema-floor enforcement lives at the bank level). The `1.5` feature floor in 3c subsumes every kind's `1.2` floor.

**3c.** Bank-level schema floor — `validateBankObject`. Add a detector near the other helpers:

```ts
const hasRationaleVisuals = (q: Question): boolean => {
  if (Array.isArray(q.rationale.visuals) && q.rationale.visuals.length > 0) return true;
  if (q.itemType === "case_study") {
    return q.caseStudy.questions.some(
      (cq) => Array.isArray(cq.rationale.visuals) && cq.rationale.visuals.length > 0,
    );
  }
  return false;
};
```

Then, in the `payload.questions.forEach(...)` loop, **after** the existing `bowtie requires 1.4` clause and **before** the `visual requires 1.2` clause, add:

```ts
if (
  schemaVersion !== undefined &&
  cmpSchema(schemaVersion, "1.5") < 0 &&
  hasRationaleVisuals(result.value)
) {
  reasons.push(`questions[${index}]: rationale.visuals requires meta.schemaVersion 1.5`);
  return;
}
```

Walking embedded case-study questions matters: each embedded question carries its own `rationale`, so the `1.5` floor must descend into them. A bare-array import (`schemaVersion === undefined`) is ungated, consistent with the existing visual clause.

---

## 4. Render — `src/App.tsx`

`RationalePanel` is the single render site (it serves both standalone review and the case-study "Part rationale"). `VisualStimulus` is already imported in this file.

**4a.** Add `languageMode` to `RationalePanel`'s props:

```ts
function RationalePanel({
  question,
  title = "Rationale",
  voiceEnabled = false,
  languageMode,
}: {
  question: Question;
  title?: string;
  voiceEnabled?: boolean;
  languageMode: LanguageMode;
}) {
```

**4b.** Render the visuals between the `correct` `.dual-copy` block and the `byChoice` block:

```tsx
<div className="dual-copy">
  <p>{question.rationale.correct.en}</p>
  <p lang="zh-Hans">{question.rationale.correct.zh}</p>
</div>

{question.rationale.visuals && question.rationale.visuals.length > 0 && (
  <div className="rationale-visuals">
    {question.rationale.visuals.map((visual, index) => (
      <VisualStimulus key={index} visual={visual} languageMode={languageMode} />
    ))}
  </div>
)}

{choiceRationales.length > 0 && (
  /* ...existing "Per choice" block unchanged... */
)}
```

Optional (GPT's suggestion): when `length > 1`, wrap each in a small `Explanation figure N` label. `VisualStimulus` already renders the kind's own `caption`, so a numeric label risks double-captioning — leave it out of v1 unless review wants it.

**4c.** Thread `languageMode` at **every** `RationalePanel` call site. There are at least two:

- Case-study part rationale (confirmed): `CaseStudyControl` already has `languageMode` in scope —
  `<RationalePanel question={caseQuestion} title="Part rationale" voiceEnabled={voiceEnabled} languageMode={languageMode} />`
- Standalone review (inferred, not visually confirmed in this pass): the main question-review render. Add `languageMode={languageMode}` there too; `languageMode` is already in scope wherever the panel is rendered for a live session.

> Implementer check: grep `App.tsx` for `<RationalePanel` and confirm the prop is added to **all** occurrences. The component now requires it.

**4d.** Optional CSS — `src/styles.css`. A light spacing rule; the existing `.rhythm-strip` figure styling carries the rest:

```css
.rationale-visuals { display: flex; flex-direction: column; gap: 0.75rem; margin: 0.5rem 0; }
```

**4e.** Do **not** change `hasVisualStimulus` in v1. The custom-session "Questions with images" filter remains stimulus/exhibit-only (`question.visual`, case exhibits, staged exhibits, and embedded case stimuli). `rationale.visuals` are post-answer explanation figures, not pre-answer image stimuli.

---

## 5. Fixtures / tests

- `npm run test-visuals` — unaffected (no kind module changes). Confirm still green.
- `npm run test:schema-bank` — owns the rationale-visual shape/floor fixtures.
- Visual-parity snapshot — the stimulus path is untouched; confirm no diff.
- Add schema fixtures:
  - **valid:** a `multiple_choice` with `rationale.visuals` length 1; another length 6; one on a non-stimulus item type (e.g. `ordered_response`) to prove placement is *not* enforced.
  - **invalid:** `rationale.visuals: []` → `must not be empty`; length 7 → `at most 6`; a member with a bad `kind` → structural failure surfaced as `rationale.visuals[0] ...`.
  - **bank floor:** a bank at `schemaVersion: "1.4"` with a `rationale.visuals` item → `requires meta.schemaVersion 1.5`; same content at `"1.5"` → passes; the same via an **embedded** case-study question to exercise the walk.
- `npm run validate-bank -- banks/*.json` — existing canonical banks have no `rationale.visuals`; must still pass under `1.5` (additive).
- `npm run build`.

---

## 6. Acceptance checklist

- [ ] `SchemaVersion` and `supportedSchemaVersions` include `1.5`; `SCHEMA_VERSION === "1.5"`.
- [ ] `Rationale.visuals?` typed; compiles.
- [ ] `validateQuestion` validates `visuals` in exhibit mode (no placement, no `selfCheck`); empty/over-6/non-array rejected with the exact messages above.
- [ ] `validateBankObject` rejects `rationale.visuals` below `1.5`, including embedded case questions; passes at `1.5`; ungated for bare arrays.
- [ ] `RationalePanel` renders stacked visuals between `correct` and `byChoice`; `languageMode` threaded at all call sites.
- [ ] `hasVisualStimulus` remains stimulus/exhibit-only; rationale visuals do not affect the "Questions with images" filter.
- [ ] All existing banks validate unchanged; visual-parity snapshot unchanged.

---

## 7. Appendices

- **Appendix A** — `NCLEX-Question-Schema.md` edits (paste-ready).
- **Appendix B** — `DECISIONS.md` amendment (paste-ready).

---

## 8. Deferred / next session (not in this spec)

- **Generator/authoring prompt contract** for `rationale.visuals` (the "use only when a deterministic figure materially improves the post-answer explanation; prefer zero over a weak visual; multiples only for a true sequence/comparison/progression" rule). This is content-lane work and follows the existing raw → cross-model review → promote → ledger pipeline.
- **Retrofitting** explanation visuals onto existing canonical rationales (Luke flagged for review next session).
- **Per-`byChoice` visuals** — real future want (UWorld illustrates individual distractors); deferred, multiplies schema/render/review surface.

---

# Appendix A — `NCLEX-Question-Schema.md` edits (paste-ready)

**A1. Header line.** Replace the version sentence at the top:

> **schemaVersion: `1.5` — current.** `1.0` standalone-question banks, `1.1` case-study banks, `1.2` visual banks, `1.3` highlight banks, and `1.4` bowtie banks remain supported. Do not change shapes without bumping `schemaVersion` and writing a migration.

**A2. Bank envelope.** In the paragraph listing accepted versions, append:

> Standalone `bowtie` requires `"1.4"`. `rationale.visuals` (explanation visuals) requires `"1.5"`.

And set the example `meta.schemaVersion` to `"1.5"`.

**A3. `rationale` shape.** Replace the rationale shape block with:

```json
{
  "correct": { "en": "why the keyed answer(s) are correct", "zh": "..." },
  "byChoice": [
    { "refId": "A", "en": "why this choice is right/wrong", "zh": "..." }
  ],
  "visuals": [
    { "kind": "lab_trend", "...": "an existing visual kind, answer-revealed" }
  ]
}
```

And append to the prose under that block:

> `rationale.visuals` (schema `1.5`, optional) is an array of **1–6** explanation visuals shown after the answer is revealed. See *Rationale explanation visuals* below. Omit the field for none; an empty array is invalid.

**A4. New subsection** — insert after the `rationale` shape discussion, before the visual-stimulus section:

> ### Rationale explanation visuals — schema `1.5`
>
> `rationale.visuals` carries deterministic figures that **teach the explanation**, distinct from the load-bearing `question.visual` stimulus. They render after `rationale.correct`, before the per-choice block, only once the item is submitted.
>
> - **Shape:** array of **1–6** entries, each an existing visual `kind` (same `QuestionVisual` union). No new kinds, no AI-generated/bespoke art. Empty array invalid; absence = none.
> - **Answer-revealed, by design.** The necessity rule (*"removing the visual must change the answer"*) and the caption-neutrality rule do **not** apply here — an explanation figure may annotate the finding, draw the threshold, or name the abnormality. Its validity test is instead: *does it materially clarify the post-answer explanation?* That is a human review-gate judgment, not a machine check.
> - **Validation:** structural only (exhibit mode). Placement restrictions (`allowedItemTypes`) and `selfCheck` arithmetic/answer-coupling gates are **not** run, so a rationale visual is permitted on any item type and is not required to be load-bearing. Each kind's structural `validate` still applies.
> - **Not in v1:** per-`byChoice`/per-row/per-dropdown attachment; visuals inside `rationale.byChoice[]`.

**A5. Validation rules list.** Add a bullet to the importer/commit-time list:

> - **rationale.visuals:** present in a bank below schema `"1.5"`; not an array; empty array; more than 6 entries; or any entry failing its kind's structural validation. (Placement and `selfCheck` are intentionally not enforced for rationale visuals.)

---

# Appendix B — `DECISIONS.md` amendment (paste-ready)

Add under **Standing principles**, as an extension of principle 6:

> **Principle 6 extension — explanation visuals are the necessity-rule exemption, governed by a clarity test (schema 1.5).** `rationale.visuals` adds a second, **answer-revealed** visual slot on the rationale, distinct from the load-bearing `question.visual` stimulus. The two slots invert each other: the stimulus is valid only if removing it changes the answer (principle 6); an explanation visual is valid only if it *clarifies the already-revealed rationale*, and by construction fails the necessity test. So the necessity gate and the caption-neutrality rule are **suspended** for this slot — an explanation figure may annotate the finding, draw the threshold, or name the abnormality.
>
> Mechanically, this reuses the case-exhibit validation mode: structural `validate` runs; the `selfCheck` arithmetic/answer-coupling gate and the `allowedItemTypes` placement check are **not** invoked (validate the visual with no `itemType` and no `question`). Consequence, stated rather than assumed: with `selfCheck` off, **nothing deterministic catches a rationale figure whose numbers contradict the rationale text** — that correctness burden moves to the promotion/cross-model review gate, consistent with principle 3 (deterministic core for what's checkable; review for the semantic residual). Scope stays closed in v1: existing kinds only, no new union members, no AI/bespoke art, no per-`byChoice` attachment.
>
> **Authoring rule (no visual spam):** generators add `rationale.visuals` only when a deterministic figure materially improves the post-answer explanation; prefer zero visuals over a weak one; use multiple visuals only for a true sequence, comparison, or before/after progression. (Prompt contract is a separate content-lane deliverable; it does not gate the schema/render change.)

Optionally add to **Other standing invariants**:

> - Explanation visuals (`rationale.visuals`, schema 1.5) validate in exhibit mode — structural only, no `selfCheck`, no placement restriction; they are answer-revealed and exempt from the visual-necessity and caption-neutrality rules. Correctness of the figure-vs-rationale is a review-gate responsibility, not a script one.
