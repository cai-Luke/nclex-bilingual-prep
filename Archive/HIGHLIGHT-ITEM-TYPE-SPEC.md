# HIGHLIGHT-ITEM-TYPE-SPEC

> Archived implementation spec. Highlight is already implemented. For current authoring and validation rules, use `NCLEX-Question-Schema.md`, `src/types.ts`, `src/schema.ts`, and `src/grading.ts`.

**Status:** ready for implementation, **after** `PARTIAL-CREDIT-SCORING-SPEC` lands.
**Schema impact:** new item type → **schema bump to `1.3`** (new JSON shape, migration note required).
**Depends on:** the `+/-` scoring path from `PARTIAL-CREDIT-SCORING-SPEC` (highlight reuses it unchanged).

---

## 1. What this adds

The NGN **Highlight: Text** item: the learner is shown a passage (a nurses' note, shift report, etc.) and clicks the words/phrases/sentences that meet a stated criterion ("Highlight the findings that require immediate follow-up"). Scored `+/-` — over-highlighting lowers the score. This is one of the most common case-study item types, so as a `StandaloneItemType` it nests inside `case_study.questions` for free.

Highlight reuses the existing **bilingual-parallel-object** parity model and the **`+/-` grading path** already built for `select_all`, so the only genuinely new surface is the data shape, its validation, and the click-to-select UI. The **Highlight: Table** variant is out of scope (deferred).

---

## 2. Data model — flat bilingual segments

Parity is structural: `en` and `zh` ride the same segment object (like `options`), so there is no cross-language span alignment. The passage is an ordered list of segments; some are static connective text, some are selectable; `correct` keys the selectable subset.

```jsonc
{
  "id": "hl_aki_01",
  "itemType": "highlight",
  "category": "Reduction of Risk Potential",
  "topic": "acute kidney injury",          // English-only (Tier-0 invariant)
  "difficulty": "medium",
  "ngnSkill": "analyze_cues",
  "stem": {                                  // the instruction / criterion
    "en": "Highlight the findings that require immediate follow-up.",
    "zh": "标出需要立即跟进的发现。"
  },
  "highlight": {
    "segments": [
      { "id": "s1", "en": "0800 nursing note:", "zh": "0800 护理记录：" },                 // static (selectable defaults false)
      { "id": "s2", "en": "Blood pressure 138/82", "zh": "血压 138/82", "selectable": true }, // selectable distractor
      { "id": "s3", "en": "Urine output 12 mL over 4 hours", "zh": "4 小时尿量 12 毫升", "selectable": true }, // keyed
      { "id": "s4", "en": "Potassium 6.4 mEq/L", "zh": "血钾 6.4 mEq/L", "selectable": true }  // keyed
    ],
    "correct": ["s3", "s4"]
  },
  "rationale": {
    "correct": { "en": "...", "zh": "..." },
    "byChoice": [                            // optional; refId = selectable segment id
      { "refId": "s2", "en": "Normal BP; not the priority cue.", "zh": "..." },
      { "refId": "s3", "en": "Oliguria signals worsening AKI.", "zh": "..." },
      { "refId": "s4", "en": "Critical hyperkalemia needs immediate action.", "zh": "..." }
    ]
  },
  "testTakingStrategy": { "en": "...", "zh": "..." },
  "glossary": []
}
```

- `stem` carries the instruction/criterion; `highlight.segments` is the passage to act on.
- `selectable` is optional, default `false`. Static segments render as plain text and cannot be clicked.
- `correct` is the keyed subset of **selectable** segment ids.
- `rationale.byChoice` follows the existing non-option-type rule: encouraged (one entry per selectable segment, `refId` = selectable segment id), may be omitted if `rationale.correct` fully explains.

---

## 3. `src/types.ts`

```ts
export type StandaloneItemType =
  | "multiple_choice" | "select_all" | "ordered_response"
  | "fill_in_blank" | "matrix" | "dropdown_cloze"
  | "highlight";                                   // new

export type SchemaVersion = "1.0" | "1.1" | "1.2" | "1.3"; // new

export type HighlightSegment = {
  id: string;
  en: string;
  zh: string;
  selectable?: boolean;   // default false
};

export type HighlightQuestion = CommonQuestion & {
  itemType: "highlight";
  highlight: {
    segments: HighlightSegment[];
    correct: string[];     // ids of selectable segments that are keyed
  };
};

export type StandaloneQuestion =
  | MultipleChoiceQuestion | SelectAllQuestion | OrderedResponseQuestion
  | FillInBlankQuestion | MatrixQuestion | DropdownClozeQuestion
  | HighlightQuestion;                              // new
```

`AnswerState` (in `grading.ts`) gains the selected-segment set:

```ts
export type AnswerState = {
  optionIds?: string[];
  blanks?: Record<string, string>;
  matrix?: Record<string, string[]>;
  dropdowns?: Record<string, string>;
  segments?: string[];          // new — selected selectable-segment ids
  caseStudy?: Record<string, AnswerState>;
};
```

---

## 4. Validation (`src/schema.ts` — `validateHighlight`)

Add `"highlight"` to `standaloneItemTypes`. Bump version constants (§6). Wire a `validateHighlight` branch into `validateQuestion`. Rules:

- `highlight` must be an object with a `segments` array (≥1) and a `correct` array.
- Each segment: non-empty `id`, non-empty `en`, non-empty `zh`; `selectable` if present must be boolean.
- Segment `id`s unique.
- At least one **selectable** segment (`selectable === true`).
- `correct`: non-empty; no duplicates; every id ∈ the set of selectable segment ids (a `correct` id that is missing or non-selectable fails loud).
- **Non-degenerate gate:** at least one selectable segment is **not** in `correct` (i.e. `correct.length < #selectable`). An item where every selectable segment is keyed is "highlight everything," is trivially guessable, and breaks the point of `+/-` scoring. Fail it. (Deliberate content-quality constraint, analogous to requiring distractors on `select_all`.)
- Bilingual parity needs no extra check — `en`/`zh` are on the same object, enforced by the per-segment non-empty rule.
- `rationale.byChoice` is optional and need **not** cover every segment. But if present, each `refId` must point to a **selectable** segment id, with no duplicate `refId`s. (The common-field validator already checks `refId`/`en`/`zh` non-empty; this adds the id-resolves-to-a-selectable-segment check, catching broken rationales without forcing full coverage.)

Add the corresponding lines to the schema doc's **Validation rules** section: highlight is invalid if it lacks `segments`/`correct`, has no selectable segment, has a `correct` id absent from selectable segments, has duplicate segment ids, or keys every selectable segment.

---

## 5. Grading (`src/grading.ts`)

Highlight is a `+/-` type — reuse `plusMinus` from the scoring spec:

```ts
// inside scoreStandaloneQuestion
if (q.itemType === "highlight") {
  return { earned: plusMinus(a.segments ?? [], q.highlight.correct), possible: q.highlight.correct.length };
}
```

Answer-state plumbing:

```ts
// getInitialAnswer(highlight) → {}
// getCorrectAnswer(highlight) → { segments: [...q.highlight.correct] }
// getAnswerCompleteness(highlight) → (a.segments?.length ?? 0) > 0   // at least one selection
```

Retention boolean falls out of `isFullyCorrect` automatically: full marks = selected exactly the keyed segments with no extras.

---

## 6. Schema-version floor (`src/schema.ts`)

- `SCHEMA_VERSION = "1.3"`.
- `supportedSchemaVersions` += `"1.3"`; `schemaOrder` / `cmpSchema` array += `"1.3"`.
- In `validateBankObject`, add a floor guard mirroring the `case_study`→1.1 and visual→1.2 checks: a `highlight` item in a bank declaring `schemaVersion` `"1.0"`/`"1.1"`/`"1.2"` fails with `questions[i]: highlight requires meta.schemaVersion 1.3`.
- **The floor must be recursive.** Highlight nests in `case_study.questions`, so the guard has to fire for both a top-level `itemType === "highlight"` **and** a `case_study` whose `caseStudy.questions` contains any `highlight`. This is the same pattern as the existing visual floor guard, but on a different sub-structure: the visual guard walks `caseStudy.exhibits[]` / `caseStudy.stages[].exhibits[]`, whereas highlight walks `caseStudy.questions[]`. Don't copy the visual guard's exhibit-walk and miss the questions-walk — otherwise a `1.2` case-study bank with an embedded highlight is wrongly admitted.
- Visuals still default to `requiredSchemaVersion "1.2"`; a `1.3` bank satisfies that (1.3 ≥ 1.2), so nothing about visual gating changes.

---

## 7. UI contract (`src/App.tsx`)

- Render `highlight.segments` in order. Static segments → inline text. Selectable segments → clickable inline spans that toggle membership in `answer.segments`.
- Respect `languageMode` exactly like other bilingual text; each segment carries `en`/`zh`.
- **Whitespace:** the renderer joins adjacent segments with a single inline space (segments do not encode their own leading/trailing spaces). Authoring rule to keep this clean: punctuation stays inside the segment it attaches to (e.g. a finding segment includes its trailing period), so the space-join never produces `dyspnea , tachycardia`. If an author ever needs tight punctuation adjacency to a selectable token, they fold the punctuation into that segment rather than splitting it out. (A future per-segment `noLeadingSpace` flag could handle exotic cases, but it is out of v1 scope — YAGNI.)
- **Accessibility:** render selectable segments as real toggles — `<button type="button">` (or an element with equivalent keyboard behavior), toggled by click / Enter / Space, with `aria-pressed` reflecting the highlighted state. Cheap to do while the UI is already being touched.
- Pre-submit: toggling highlights/unhighlights a span. Post-submit: reveal keyed-correct vs. selected (selected-and-keyed, selected-not-keyed, keyed-not-selected), and show `earned / possible` from `scoreQuestion`. The item is marked for review unless full marks (per the scoring spec's retention rule).
- No option shuffle applies (highlight has no `options`); segment order is fixed passage order. Highlight is therefore exempt from `lib/shuffle.ts` / the option-position audits; its only structural-bias surface (keying every selectable segment) is closed by the §4 non-degenerate gate.

---

## 8. `NCLEX-Question-Schema.md` edits

- Add `highlight` to the `itemType` enum row in **Common fields**.
- New per-type subsection **"8. `highlight` — highlight in context (text)"**: the data model from §2, the validation rules from §4, and the `+/-` grading note.
- Bank-envelope versioning note: add "`highlight` requires `1.3`."
- **Grading** section (already rewritten by the scoring spec): add the `highlight` line — `+/-` per selectable segment, floored at 0, `possible` = number of keyed segments.
- **Notes**: move `highlight` out of "intentionally not in v1.2"; record that `bowtie` remains out until a `1.4` bump.

---

## 9. Touch-point checklist ("add an item type")

Unlike a visual kind (append-only), an item type edits the shared core:

1. `src/types.ts` — `StandaloneItemType` += `"highlight"`; `HighlightSegment` + `HighlightQuestion`; `StandaloneQuestion` union; `SchemaVersion` += `"1.3"`.
2. `src/grading.ts` — `AnswerState.segments`; `highlight` branch in `scoreStandaloneQuestion`; `getInitialAnswer`/`getCorrectAnswer`/`getAnswerCompleteness` branches.
3. `src/schema.ts` — `standaloneItemTypes` += `"highlight"`; version constants (§6); `validateHighlight` + branch wiring; bank-floor guard.
4. `src/App.tsx` — highlight render + click-to-select (§7).
5. `NCLEX-Question-Schema.md` — per §8.
6. Audit / census — `highlight` enters the item-type enumeration (uniform item-type balance target includes it); the **dormant `highlight` checks** in the non-MCQ bias and adversarial audit specs now activate — review what they key on before treating their silence as a pass (mirrors the `DECISIONS.md` "Dormant audit checks" note).
7. Generation lane — new `hl_*` content lane (disjoint id prefix). Authoring constraints: instruction lives in `stem`; include ≥1 selectable distractor; never key every selectable segment; bilingual parity per segment; `+/-`-aware design (penalty for over-highlighting). Runs the standard raw → cross-model review → promote → ledger pipeline.
8. Tests — validation fixtures (valid; invalid: missing `segments`/`correct`, no selectable segment, `correct` id non-selectable/absent, duplicate ids, all-selectable-keyed degenerate, empty `zh`, `byChoice` `refId` pointing at a non-selectable/unknown segment); grading (full → `{n,n}`; partial; over-selection floored to 0); schema-floor (a `highlight` item in a `1.2` bank fails — top-level **and** embedded in a `case_study`).
9. `PROJECT-HISTORY.md` — after landing, flip the schema-current entry to `1.3`, mark `highlight` implemented, and record `bowtie` as still deferred to `1.4`. Read the live file first; it is the status map (and currently records `1.2` current / highlight+bowtie out of scope) and may have drifted.

---

## 10. Out of scope

- Highlight: Table variant.
- Any offset/span-in-running-text model (segments are the unit of selection).
- Partial credit beyond `+/-` (no rationale/dyad linking).
- Carrying a `visual` on a highlight item — structurally allowed by `CommonQuestion`, but no visual kind currently opts into `highlight` placement, so it is inert; no special handling.
