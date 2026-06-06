# NCLEX Assorted Bank Generation Prompt

**Status:** Legacy/helper prompt for assorted standalone `schemaVersion: "1.0"` batches. Prefer `NCLEX-Bank-Generation-Prompt.md` for current `1.1` hard/NGN or `case_study` generation. If this prompt is used, raw output should still be reviewed before accepted content is merged or promoted into top-level `banks/*.json`. Gemini output especially should be treated as raw draft material unless a separate reviewer has checked it; do not ask Gemini to edit canonical bank files directly.

**How to use (for Luke — do NOT paste this section into the model):**

1. Pick one LLM and decide a short `BANK_ID_PREFIX`, for example `claude_jun05_a`, `gpt_jun05_a`, or `gemini_jun05_a`.
2. Copy everything below `===== COPY BELOW THIS LINE =====` into that model.
3. If you already have generated banks, paste either:
   - the full prior bank JSON/export into `EXISTING_LIBRARY_CONTEXT`, or
   - the output of `npm run coverage-report` plus a short list of recent stems.
4. Keep `COUNT` modest, usually `6-10`. Larger batches are more likely to truncate.
5. Save the returned JSON as a raw/review candidate, for example `banks-raw/claude-2026-06-05-assorted.json`, then validate and review it. After accepted questions are merged into a top-level canonical bank, rerun coverage and build:

```bash
npm run validate-bank -- banks-raw/claude-2026-06-05-assorted.json
npm run coverage-report
npm run build
```

The app automatically pulls only top-level `banks/*.json` files into the built library. Nested or raw files are not bundled. The filename stem becomes the source label inside the app, and bundled question IDs should be globally unique.

---

===== COPY BELOW THIS LINE =====

You are an expert NCLEX-RN item writer, a clinical judgment exam editor, and a professional English↔Simplified-Chinese medical translator.

Generate an assorted bank of original NCLEX-RN practice questions in valid JSON only.

## PARAMETERS

- COUNT: 8
- BANK_ID_PREFIX: replace_me_source_batch
- CATEGORY_MIX: mixed
- TOPIC_MIX: broad assorted NCLEX-RN coverage
- ITEM_TYPE_MIX: mixed
- DIFFICULTY_MIX: mixed
- PRIORITIZE_TOPICS:
- AVOID_TOPICS:

## EXISTING_LIBRARY_CONTEXT

Paste existing generated bank JSON, an exported library JSON, or a coverage report here.

If this section is blank, generate a broad assorted set and avoid common overused examples such as only heart failure, only diabetes, or only delegation.

```text
PASTE PRIOR BANKS OR COVERAGE REPORT HERE
```

## DUPLICATE-AVOIDANCE TASK

Before writing the output, silently review `EXISTING_LIBRARY_CONTEXT` and avoid making near-duplicates.

Treat a new item as too repetitive if it substantially overlaps with an existing question in any of these ways:

- same disease/process plus same nursing action or priority
- same scenario setup with only numbers or demographics changed
- same correct answer logic, even if wording is different
- same medication safety point with the same distractor pattern
- same dosage calculation structure with only the medication name changed
- same matrix rows/columns or same dropdown-cloze clinical judgment statement
- same topic already appearing many times when other NCLEX areas are underrepresented

It is acceptable to reuse an important topic if the clinical angle is clearly different. For example, `heart failure discharge teaching`, `acute pulmonary edema priority action`, and `digoxin toxicity in heart failure` are different enough. But do not produce multiple questions that all test the same low-sodium teaching point.

## ASSORTMENT REQUIREMENTS

Generate a balanced, assorted set rather than a narrow topic bank.

Unless `PRIORITIZE_TOPICS` says otherwise, spread the batch across:

- multiple NCLEX client-needs categories
- multiple body systems or nursing domains
- multiple NGN clinical judgment skills
- multiple item types from the locked schema
- easy, medium, and hard difficulty when `DIFFICULTY_MIX` is `mixed`

Preferred item type mix for a batch of 8:

- 2 `multiple_choice`
- 2 `select_all`
- 1 `ordered_response`
- 1 `fill_in_blank`
- 1 `matrix`
- 1 `dropdown_cloze`

If `COUNT` is smaller, choose the most useful subset while preserving variety. If `ITEM_TYPE_MIX` specifies exact item types, use only those.

## CONTENT REQUIREMENTS

- Follow the current NCSBN NCLEX-RN test plan and Next-Generation NCLEX clinical judgment style.
- Every item must test nursing judgment, not trivia.
- Distractors must be plausible and clinically meaningful.
- Never use placeholder text. Forbidden examples include `"Additional distractor"`, `"distractor"`, `"Distractor analysis"`, `"placeholder"`, `"TBD"`, or generic rationales that could apply to any option.
- `topic` must be a specific clinical topic, not a broad dashboard bucket such as `"Cardiovascular Disorders"` or `"Prioritization & Delegation"` unless that is truly the tested content.
- Each incorrect option must be a realistic misconception, unsafe action, wrong prioritization, wrong diagnosis, or wrong medication/class — not filler.
- The correct answer must be defensible and unambiguous.
- Avoid rare edge cases unless the rationale clearly explains why they matter.
- Avoid trick wording. Difficulty should come from clinical reasoning, prioritization, or discrimination between plausible actions.
- For dosage calculation, use realistic orders and units; include numeric tolerance when appropriate.
- For prioritization, use ABCs, safety, acute change, instability, least restrictive care, and scope/delegation principles appropriately.
- For medications, include key safety assessments, adverse effects, contraindications, teaching, or monitoring.
- For psychosocial items, use therapeutic communication and safety principles without stigmatizing language.

## BILINGUAL REQUIREMENTS

For every displayed text field, provide both:

- English in `en`
- natural Simplified Chinese in `zh`

Translations must preserve clinical meaning, not translate word-for-word. Use standard Simplified-Chinese medical/nursing terminology.

The exam-training surface is English-primary, so English must be clear, realistic NCLEX style. Chinese is a comprehension scaffold.

## RATIONALE REQUIREMENTS

Each question must include:

- `rationale.correct`: English and Chinese explanation of why the keyed answer is correct.
- `rationale.byChoice`: per-option, per-row, per-dropdown, or per-blank reasoning using the correct `refId`.
- `testTakingStrategy`: a short reusable test-taking or clinical-reasoning strategy in both languages.
- `glossary`: 2-5 key medical/nursing terms from the item with `termEn`, `termZh`, and `defZh`.

For option-based item types, `rationale.byChoice` must have one entry per option. For matrix, use one entry per row. For dropdown cloze, use one entry per dropdown. For fill-in-blank, use one entry per blank.

Every `byChoice` entry must mention the clinical reasoning for that exact choice. Do not use template language or repeat the same rationale for multiple options unless the choices are clinically identical, which they should not be.

## ID RULES

Give every question a unique readable `id`. Use a source/batch prefix so IDs remain unique after reviewed batches are consolidated into top-level canonical banks.

Use this pattern:

```text
<BANK_ID_PREFIX>_<itemtype_short>_<topic_slug>_<two_digit_number>
```

Examples:

- `claude_jun05_a_mc_preeclampsia_01`
- `gpt_jun05_a_sata_insulin_safety_02`
- `gemini_jun05_a_matrix_postop_03`

Use these item type shorts:

- `mc`
- `sata`
- `or`
- `fib`
- `matrix`
- `cloze`

Do not reuse ids from `EXISTING_LIBRARY_CONTEXT`.

## OUTPUT FORMAT — CRITICAL

Output ONLY one valid JSON object.

Do not include markdown fences.
Do not include commentary.
Do not include a duplicate-analysis report.
Do not include comments inside JSON.
Use double quotes for all JSON keys and strings.
No trailing commas.
Set `meta.count` to the actual number of questions generated.
Before final output, silently self-check that no placeholder/filler text remains, every answer id exists, every option/row/dropdown/blank has matching rationale coverage, and each topic label is specific enough to be useful in the app's topic filter.

## SCHEMA VERSION

Use `schemaVersion: "1.0"` exactly for this assorted standalone-question prompt. Use `NCLEX-Bank-Generation-Prompt.md` when generating current v1.1 hard/NGN or `case_study` banks.

Top-level object:

```json
{
  "meta": {
    "schemaVersion": "1.0",
    "exam": "NCLEX-RN",
    "topic": "assorted NCLEX-RN",
    "category": "mixed",
    "difficulty": "mixed",
    "count": 8
  },
  "questions": []
}
```

## COMMON QUESTION FIELDS

Every question must include:

```json
{
  "id": "unique string",
  "itemType": "multiple_choice | select_all | ordered_response | fill_in_blank | matrix | dropdown_cloze",
  "category": "one exact category string",
  "topic": "concise reusable topic label",
  "difficulty": "easy | medium | hard",
  "ngnSkill": "recognize_cues | analyze_cues | prioritize_hypotheses | generate_solutions | take_action | evaluate_outcomes",
  "stem": { "en": "...", "zh": "..." },
  "rationale": {
    "correct": { "en": "...", "zh": "..." },
    "byChoice": [
      { "refId": "...", "en": "...", "zh": "..." }
    ]
  },
  "testTakingStrategy": { "en": "...", "zh": "..." },
  "glossary": [
    { "termEn": "...", "termZh": "...", "defZh": "..." }
  ]
}
```

`category` must be exactly one of:

- `Management of Care`
- `Safety and Infection Control`
- `Health Promotion and Maintenance`
- `Psychosocial Integrity`
- `Basic Care and Comfort`
- `Pharmacological and Parenteral Therapies`
- `Reduction of Risk Potential`
- `Physiological Adaptation`

Question-level `category` must never be `mixed`.

## TYPE-SPECIFIC FIELDS

### `multiple_choice`

Use 3-5 options.

```json
"options": [
  { "id": "A", "en": "...", "zh": "..." },
  { "id": "B", "en": "...", "zh": "..." },
  { "id": "C", "en": "...", "zh": "..." },
  { "id": "D", "en": "...", "zh": "..." }
],
"correct": ["B"]
```

`correct` must contain exactly one option id.

### `select_all`

Use 5-6 options.

```json
"options": [
  { "id": "A", "en": "...", "zh": "..." },
  { "id": "B", "en": "...", "zh": "..." },
  { "id": "C", "en": "...", "zh": "..." },
  { "id": "D", "en": "...", "zh": "..." },
  { "id": "E", "en": "...", "zh": "..." }
],
"correct": ["A", "C", "E"]
```

`correct` must contain one or more option ids.

### `ordered_response`

Use options as orderable steps.

```json
"options": [
  { "id": "A", "en": "...", "zh": "..." },
  { "id": "B", "en": "...", "zh": "..." },
  { "id": "C", "en": "...", "zh": "..." },
  { "id": "D", "en": "...", "zh": "..." }
],
"correct": ["C", "A", "D", "B"]
```

`correct` must include every option id exactly once, in the correct order.

### `fill_in_blank`

Do not include `options`.
Do not include top-level `correct`.

```json
"blanks": [
  {
    "id": "b1",
    "prompt": { "en": "mL/hr", "zh": "毫升/小时" },
    "acceptable": ["125", "125 mL/hr"],
    "numeric": { "value": 125, "tolerance": 0, "unit": "mL/hr" }
  }
]
```

Each blank needs at least one of `acceptable` or `numeric`.

### `matrix`

```json
"matrix": {
  "rows": [
    { "id": "r1", "en": "...", "zh": "..." },
    { "id": "r2", "en": "...", "zh": "..." }
  ],
  "columns": [
    { "id": "c1", "en": "Expected", "zh": "预期" },
    { "id": "c2", "en": "Requires follow-up", "zh": "需要跟进" }
  ],
  "selectionMode": "single_per_row"
},
"correct": [
  { "rowId": "r1", "columnIds": ["c2"] },
  { "rowId": "r2", "columnIds": ["c1"] }
]
```

Use `single_per_row` or `multiple_per_row`.
`correct` must have exactly one entry per row.
For `single_per_row`, each row must have exactly one correct column id.

### `dropdown_cloze`

Do not include top-level `correct`.

```json
"clozeStem": {
  "en": "The client is most at risk for {{1}} due to {{2}}.",
  "zh": "由于 {{2}}，该患者最有可能发生 {{1}}。"
},
"dropdowns": [
  {
    "id": "1",
    "options": [
      { "id": "o1", "en": "...", "zh": "..." },
      { "id": "o2", "en": "...", "zh": "..." }
    ],
    "correct": "o1"
  },
  {
    "id": "2",
    "options": [
      { "id": "o1", "en": "...", "zh": "..." },
      { "id": "o2", "en": "...", "zh": "..." }
    ],
    "correct": "o1"
  }
]
```

Every `{{id}}` placeholder must appear in both `clozeStem.en` and `clozeStem.zh`.
Every placeholder must have a matching `dropdowns[].id`.
Every dropdown `correct` must match one of that dropdown's option ids.

## FINAL SELF-CHECK BEFORE OUTPUT

Before sending the JSON, silently verify:

- The output is one parseable JSON object.
- `questions.length` equals `meta.count`.
- Every question has non-empty `en` and `zh` text pairs.
- Every question has one exact valid category.
- No question is a near-duplicate of the existing context.
- The batch is assorted across topics, categories, item types, and difficulty.
- Option ids and correct ids match exactly.
- Ordered response `correct` is a complete permutation.
- Fill-in-blank has no top-level `correct`.
- Dropdown cloze has no top-level `correct`.
- Matrix row and column ids match exactly.

Generate the JSON now.
