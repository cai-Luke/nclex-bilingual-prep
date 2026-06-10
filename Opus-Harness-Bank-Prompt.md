# NCLEX-RN Bilingual Bank Generation — Opus Harness Brief (text items)

Return only the JSON bank, nothing else.

## PARAMETERS

* COUNT: 6
* CATEGORY: Basic Care and Comfort
* TOPIC: pressure injury prevention in rehabilitation
* ITEM_TYPES: matrix, dropdown_cloze, ordered_response, fill_in_blank
* DIFFICULTY: medium
* PRIORITIZE_TOPICS: pressure injury prevention, mobility assistance, urinary incontinence skin care, nutrition support, fall prevention, assistive devices
* AVOID_TOPICS: Physiological Adaptation, multiple_choice, select_all, vaccine schedules, cancer screening ages, rare diseases, detailed medication dosing
- BANK_ID_PREFIX: opus_bcc_rehab_2026_06_10

## ROLE
You are an expert NCLEX-RN item writer and a professional English↔Simplified-Chinese medical translator. Write to the current NCSBN NCLEX-RN test plan and Next-Generation NCLEX (NGN) clinical-judgment style — the NCJMM sequence: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, evaluate outcomes. Assume standard US RN scope of practice.

## CONTENT RULES
- Produce COUNT original items matching the PARAMETERS. Emit only the item types listed in ITEM_TYPES.
- Every displayed string is bilingual: provide `en` AND `zh` for the stem, every answer element, all rationale, the strategy, and every glossary entry. `zh` is natural Simplified-Chinese clinical language — convey meaning, never translate word-for-word.
- Distractors must be clinically plausible: a real misconception, an unsafe action, a wrong priority, or a wrong drug/class. No filler. Banned anywhere: placeholder text such as "distractor", "TBD", "placeholder", or a rationale generic enough to fit any option.
- `topic` is the specific clinical entity tested (e.g. "autonomic dysreflexia", "blood transfusion reaction"), never a broad bucket like "cardiovascular disorders". `topic` is English-only.
- `rationale.correct` explains why the keyed answer is correct. `rationale.byChoice` has one entry per option / row / dropdown / blank, each explaining that exact element's clinical reasoning. `byChoice` is required for option types.
- `glossary`: 2–5 key terms, each `{ termEn, termZh, defZh }` where `defZh` is a one-line Chinese definition.
- Give each item a unique, readable `id` prefixed with a source/batch token so ids stay unique after batches merge (e.g. `opus-hf-01`).
- PRIORITIZE_TOPICS / AVOID_TOPICS are soft weights, not hard filters. Ignore them if blank.
- Use Chinese quotation marks “ ” inside Chinese strings, never straight inner double quotes

## SCHEMA (schemaVersion 1.1 — follow exactly; this brief has no visual stimuli)

Top-level object:
```
{
  "meta": { "schemaVersion": "1.1", "exam": "NCLEX-RN", "topic": "<echo TOPIC>", "category": "<echo CATEGORY>", "difficulty": "<echo DIFFICULTY>", "count": <number produced> },
  "questions": [ <Question>, ... ]
}
```

Common fields on EVERY question:
```
{
  "id": "unique string",
  "itemType": "multiple_choice | select_all | ordered_response | fill_in_blank | matrix | dropdown_cloze | case_study",
  "category": "<one exact category string>",
  "topic": "specific clinical entity (English only)",
  "difficulty": "easy | medium | hard",
  "ngnSkill": "optional: recognize_cues | analyze_cues | prioritize_hypotheses | generate_solutions | take_action | evaluate_outcomes",
  "stem": { "en": "...", "zh": "..." },
  "rationale": { "correct": { "en": "...", "zh": "..." }, "byChoice": [ { "refId": "<id>", "en": "...", "zh": "..." } ] },
  "testTakingStrategy": { "en": "...", "zh": "..." },
  "glossary": [ { "termEn": "...", "termZh": "...", "defZh": "..." } ]
}
```

`category` — EXACTLY one of these strings (verbatim; "mixed" allowed only at meta level, never on a question):
`Management of Care` | `Safety and Infection Control` | `Health Promotion and Maintenance` | `Psychosocial Integrity` | `Basic Care and Comfort` | `Pharmacological and Parenteral Therapies` | `Reduction of Risk Potential` | `Physiological Adaptation`

Type-specific answer fields:
- **multiple_choice**: `"options": [ {id,en,zh} × 3–5 ]`, `"correct": ["B"]` (exactly one id). `byChoice` one entry per option.
- **select_all**: `"options": [ × 5–6 ]`, `"correct": [ one or more ids ]`. `byChoice` one entry per option.
- **ordered_response**: `"options": [ … ]`, `"correct": [ every option id in the correct order ]` (a permutation of all ids — same set, no repeats, no omissions). `byChoice` one entry per option.
- **fill_in_blank**: NO `options`, NO top-level `correct`. `"blanks": [ { "id":"b1", "prompt":{en,zh}, "acceptable":["125","125 mL/hr"], "numeric":{"value":125,"tolerance":0,"unit":"mL/hr"} } ]` — each blank needs `acceptable[]` and/or `numeric`.
- **matrix**: `"matrix": { "rows":[{id,en,zh}], "columns":[{id,en,zh}], "selectionMode":"single_per_row | multiple_per_row" }`, `"correct": [ {"rowId":"r1","columnIds":["c2"]} ]` — one entry per row; `single_per_row` ⇒ exactly one `columnId`. `byChoice` keyed by `rowId`.
- **dropdown_cloze**: NO top-level `correct`. `"clozeStem": {en,zh}` containing `{{id}}` placeholders that appear in BOTH languages; `"dropdowns": [ { "id":"1", "options":[{id,en,zh}], "correct":"<one of this dropdown's own option ids>" } ]`. `byChoice` keyed by dropdown id.
- **case_study** (only if listed in ITEM_TYPES): NO top-level `options`/`correct`. `"caseStudy": { "title":{en,zh}, "summary":{en,zh}, "exhibits":[ {id,title:{en,zh},content:{en,zh}} ≥1 ], "stages":[ {id,title:{en,zh},exhibits:[…]} ](optional), "questions":[ 2–6 full standalone items ] }`. Each embedded question is one of the six standalone types with its own complete common fields, rationale, strategy, glossary, and answer fields. Embedded ids must be unique and differ from the parent id. Case-level `rationale.correct` summarizes the whole case; each embedded item carries its own graded rationale. Aim for 4–6 embedded items that walk the NCJMM sequence.

Worked `multiple_choice` example (shape reference — do not reuse this content):
```json
{
  "id": "opus-hf-01",
  "itemType": "multiple_choice",
  "category": "Physiological Adaptation",
  "topic": "acute pulmonary edema",
  "difficulty": "medium",
  "ngnSkill": "take_action",
  "stem": {
    "en": "A client with acute decompensated heart failure develops pink frothy sputum and an SpO2 of 86% on room air. Which action should the nurse take first?",
    "zh": "一名急性失代偿性心力衰竭患者出现粉红色泡沫样痰，吸入室内空气时血氧饱和度为86%。护士应首先采取哪项措施？"
  },
  "options": [
    { "id": "A", "en": "Place the client in high Fowler's position and apply oxygen", "zh": "将患者置于高半卧位并给予吸氧" },
    { "id": "B", "en": "Administer the scheduled oral furosemide dose", "zh": "给予已排定的口服呋塞米" },
    { "id": "C", "en": "Obtain a 12-lead ECG", "zh": "采集12导联心电图" },
    { "id": "D", "en": "Draw blood for a BNP level", "zh": "抽血检测BNP水平" }
  ],
  "correct": ["A"],
  "rationale": {
    "correct": {
      "en": "Pink frothy sputum with hypoxemia signals acute pulmonary edema; upright positioning plus oxygen address breathing first and reduce preload.",
      "zh": "粉红色泡沫样痰伴低氧血症提示急性肺水肿；直立体位加吸氧可优先改善呼吸并降低前负荷。"
    },
    "byChoice": [
      { "refId": "A", "en": "Correct: airway/breathing and preload reduction take priority in flash pulmonary edema.", "zh": "正确：急性肺水肿时优先保障气道/呼吸并降低前负荷。" },
      { "refId": "B", "en": "Oral furosemide is too slow and the wrong route for acute edema; IV is given after oxygenation.", "zh": "口服呋塞米起效太慢且途径不当；应在改善氧合后再静脉给药。" },
      { "refId": "C", "en": "An ECG is useful but does not address the immediate hypoxemia.", "zh": "心电图有价值，但不能解决当前的低氧血症。" },
      { "refId": "D", "en": "BNP confirms the diagnosis later; it is not a first action in a desaturating client.", "zh": "BNP用于后续诊断确认，不是低氧患者的首要措施。" }
    ]
  },
  "testTakingStrategy": {
    "en": "Use the ABCs: when the client is hypoxemic, pick the option that fixes breathing before diagnostics.",
    "zh": "运用ABC原则：患者低氧时，先选择改善呼吸的措施，再做检查。"
  },
  "glossary": [
    { "termEn": "pulmonary edema", "termZh": "肺水肿", "defZh": "液体积聚于肺泡，导致气体交换受损。" },
    { "termEn": "preload", "termZh": "前负荷", "defZh": "心室舒张末期承受的容量负荷。" }
  ]
}
```

## OUTPUT FORMAT — CRITICAL
- Output ONLY the single JSON object. No markdown fences, no preamble, no text after.
- ASCII double quotes for all keys and strings. No trailing commas. No comments. Must be valid, parseable JSON.
- Set `meta.count` to the actual number of questions produced.
- Keep the batch modest so the JSON is not truncated mid-output (≈5–8 standalone items, or 1–2 `case_study` items).

## SELF-CHECK (silent, before emitting)
- No placeholder or filler text anywhere.
- Both `en` and `zh` present and non-empty on every text pair.
- Every option / row / dropdown / blank has its matching `byChoice` (or per-element rationale).
- Every `correct` id exists; `multiple_choice` `correct` has exactly one id; `ordered_response` `correct` is a full permutation of all option ids.
- `dropdown_cloze` `{{id}}` placeholders appear in both languages and match the `dropdowns`.
- `topic` is specific and English-only; `category` is one of the eight exact strings.
