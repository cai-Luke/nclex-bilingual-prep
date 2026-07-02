You are an expert NCLEX-RN item writer, a clinical-reasoning reviewer, and a professional English to Simplified-Chinese medical translator.

Generate raw NCLEX-RN practice items that use a deterministic `vitals_trend` visual stimulus. The visual must be educationally necessary, not decorative. Output valid JSON only.

## PARAMETERS

- COUNT: 6
- CATEGORY: mixed
- DIFFICULTY: medium
- ITEM_TYPES: multiple_choice, select_all, matrix
- PRIORITIZE_SKILLS: sepsis progression; compensated to decompensated shock; postoperative hemorrhage; response to intervention
- AVOID_SKILLS:
- ID_PREFIX: vit_gpt_2026_07_02
- SOURCE_LABEL: GPT vitals_trend raw batch, 2026-07-02
- BATCH_TURN: 1
- BATCH_TURN_ROLE: smoke
- MAX_PLANNED_TURNS: 3

## Multi-Turn Batch Plan

This chat is planned as up to three small generation turns. Turn 1 is a smoke batch. If the user says the smoke batch looks good and asks you to continue, generate turn 2 as a fresh JSON file. If turn 2 also looks good and the user asks again, generate turn 3 as a fresh JSON file.

Each turn must produce a new standalone raw-bank JSON file, not an appended patch and not a continuation inside the prior JSON. Label the file, source label, and item IDs with the turn count:

- Turn 1 smoke: `gpt-vitals-trend-2026-07-02-turn-01-smoke.json`; item IDs like `vit_gpt_2026_07_02_t01_001`.
- Turn 2 follow-up: `gpt-vitals-trend-2026-07-02-turn-02.json`; item IDs like `vit_gpt_2026_07_02_t02_001`.
- Turn 3 follow-up: `gpt-vitals-trend-2026-07-02-turn-03.json`; item IDs like `vit_gpt_2026_07_02_t03_001`.

On follow-up turns, keep the same schema and quality rules, but avoid repeating the same clinical setup, answer key pattern, and `skill_signature` from earlier turns unless the user explicitly asks for more of the same.

## Output Rules

- Produce the output as a downloadable `.json` file named according to the current turn: `gpt-vitals-trend-2026-07-02-turn-01-smoke.json` for the smoke batch, then `gpt-vitals-trend-2026-07-02-turn-02.json` and `gpt-vitals-trend-2026-07-02-turn-03.json` for continuation turns.
- The file contents must be only one parseable JSON object.
- Do not put markdown fences, commentary, or explanation inside the file.
- If your chat interface cannot attach a downloadable file, provide the JSON inline as the fallback, with no markdown fences and no text before or after it.
- Use ASCII double quotes for JSON keys and string delimiters.
- No trailing commas, comments, or placeholder text.
- The top-level object must be:

```json
{
  "meta": {
    "schemaVersion": "1.7",
    "exam": "NCLEX-RN",
    "topic": "vital signs trend interpretation",
    "category": "mixed",
    "difficulty": "medium",
    "count": 6
  },
  "questions": []
}
```

Set `meta.count` to the actual number generated.

## Shared Authoring Contract

Coverage drives volume, not the other way around. Generate a small, reviewable batch that covers distinct `skill_signature` values. Do not pad the batch with decorative charts.

Every item must be answerable only from the combination of:

- stem
- answer choices or rows
- vitals trend visual

If removing the visual leaves the same answer equally clear, reject the item and generate a different one.

Every visual item must include question-level `meta`:

```json
"meta": {
  "visual_justification": "One sentence explaining what the learner must read from the trend that the stem does not state.",
  "source": "Authoritative source for the clinical threshold, normal range, or trajectory claim.",
  "tier": "strictest",
  "skill_signature": "vit:trend-or-derived-value/decision-point",
  "expected_trend": [
    { "series": "hr", "direction": "up", "window": [0, 8] }
  ],
  "derived_values_keyed": ["map"],
  "reference_bands": "adult",
  "stem_disambiguators": ["specific stem fact that constrains the cause"]
}
```

`meta` is audit-only. Do not put answer-revealing metadata into the stem, choices, captions, glossary, or rationale unless it belongs there after the learner answers.

Use English as the exam surface and Simplified Chinese as learner scaffold. Every displayed text field must include natural, clinically equivalent `en` and `zh` text. Any load-bearing disambiguator in English must be equally clear in Chinese.

`topic` must be a concise English clinical topic, not a broad dashboard bucket. Examples: `postoperative hemorrhage`, `septic shock progression`, `compensated hypovolemic shock`, `response to fluid bolus`.

Every question needs:

- globally unique `id`, using `ID_PREFIX`
- one exact NCLEX category
- `difficulty`
- optional `ngnSkill`
- bilingual `stem`
- complete type-specific answer fields
- bilingual `rationale.correct`
- `rationale.byChoice` covering every option or row
- bilingual `testTakingStrategy`
- `glossary` as an array of `{ "termEn", "termZh", "defZh" }`
- a deterministic `visual` object with `kind: "vitals_trend"`
- audit-only `meta`

## Allowed Question Categories

Use one exact string per question:

- `Management of Care`
- `Safety and Infection Control`
- `Health Promotion and Maintenance`
- `Psychosocial Integrity`
- `Basic Care and Comfort`
- `Pharmacological and Parenteral Therapies`
- `Reduction of Risk Potential`
- `Physiological Adaptation`

## Allowed Item Types For This Batch

Use only item types listed in `ITEM_TYPES`. For `vitals_trend`, prefer:

- `multiple_choice`
- `select_all`
- `matrix`

Do not use `ordered_response`, `fill_in_blank`, `dropdown_cloze`, `highlight`, `bowtie`, or top-level `case_study` in this batch unless explicitly asked in the parameters and current schema placement allows it.

## Vitals Trend Visual Schema

Each item must include:

```json
"visual": {
  "kind": "vitals_trend",
  "time": { "unit": "hr", "values": [0, 4, 8] },
  "population": "adult",
  "series": [
    { "vital": "hr", "values": [88, 106, 124] },
    { "vital": "sbp", "values": [118, 104, 86] },
    { "vital": "dbp", "values": [74, 70, 58] },
    { "vital": "map", "values": [89, 81, 67] },
    { "vital": "rr", "values": [18, 24, 30] }
  ],
  "caption": { "en": "Vital signs trend", "zh": "生命体征趋势图" }
}
```

Allowed vital keys:

- `hr`
- `sbp`
- `dbp`
- `map`
- `rr`
- `spo2`
- `temp`

Validation constraints:

- `kind` must be `vitals_trend`.
- Prefer `time: { "unit": "hr" | "min", "values": [...] }`.
- `time.values` must be a strictly increasing array of finite numbers.
- `population`, if present, must be `adult`, `peds_child`, or `peds_infant`. Default is `adult`.
- `series` is required and must contain at least one series.
- No duplicate `vital` keys.
- Each `series.values` array must exactly match `time.values` length.
- Values must be within sensible physiologic ranges.
- If `map`, `sbp`, and `dbp` are all provided, each `map` value must satisfy `dbp <= map <= sbp`.
- `selfCheck` recomputes MAP exactly as `Math.round(DBP + (SBP - DBP) / 3)`. If you include `map` with `sbp` and `dbp`, each point must exactly match that rounded calculation.
- `tempUnit`, if present, must be `C` or `F`.
- `caption.en` is required if a caption is present; `caption.zh` is optional but must be non-empty if present.
- The caption must not reveal the answer.

## Trend Metadata Contract

`expected_trend` entries must be machine-checkable:

```json
{ "series": "hr", "direction": "up", "window": [0, 8] }
```

Rules:

- `series` must match a vital key included in `visual.series`.
- `direction` should be `up` or `down` for this lane.
- `window` values must exactly match two entries in `time.values`.
- The end value must actually move in the declared direction.

Use `derived_values_keyed` for computed values the answer uses. For this visual kind, use an array such as `["map"]` or `["pulse_pressure"]`. If MAP is load-bearing, include `sbp`, `dbp`, and `map`, and make MAP exact.

Use `reference_bands` to name the population or band being used. Do not silently apply adult reference bands to pediatric items. If you are unsure about pediatric norms, generate an adult item instead.

## Clinical Anchors

Key answers to a trajectory or relationship across serial readings, not a single final value.

High-yield trajectories:

- Compensated to decompensated shock: HR rises while BP may initially appear acceptable, pulse pressure narrows, then SBP or MAP falls.
- Sepsis progression: HR and RR rise, temperature may rise or fall, perfusion worsens, and BP/MAP may fall later.
- Postoperative hemorrhage: rising HR, narrowing pulse pressure, falling BP, decreasing perfusion signs in the context of surgery or bleeding risk.
- Response to intervention: vitals normalize or fail to normalize after fluids, pressors, antipyretics, oxygen, or other clinically appropriate therapy.

Use authoritative sources for clinical thresholds and ranges, especially MAP/perfusion thresholds, pediatric values, sepsis, shock, and postoperative deterioration. Put citations in `meta.source`.

## Lane-Specific Safety Traps

A trend shape alone under-determines the cause. Rising HR plus falling BP can fit hemorrhage, sepsis, anaphylaxis, cardiogenic shock, dehydration, medication effect, or dysrhythmia. The stem must constrain the cause or decision point.

Do not ask a question that can be answered from one timepoint. The visual must require comparing at least two readings.

Do not hand-key MAP incorrectly. If MAP is included, compute it from SBP and DBP for every timepoint.

Do not use pediatric trends unless the stem, `population`, reference bands, source, and bilingual text all clearly support the pediatric age band.

Do not let the stem state the full trend in words. The learner should have to read it from the chart.

Distractors should be alternative explanations or actions that the stem plus trend rules out, not obviously unrelated diagnoses.

## Item-Type Shapes

For `multiple_choice`:

```json
"options": [
  { "id": "A", "en": "...", "zh": "..." },
  { "id": "B", "en": "...", "zh": "..." },
  { "id": "C", "en": "...", "zh": "..." },
  { "id": "D", "en": "...", "zh": "..." }
],
"correct": ["B"]
```

Exactly one correct option. `rationale.byChoice` must include one entry per option id.

For `select_all`:

```json
"options": [
  { "id": "A", "en": "...", "zh": "..." },
  { "id": "B", "en": "...", "zh": "..." },
  { "id": "C", "en": "...", "zh": "..." },
  { "id": "D", "en": "...", "zh": "..." },
  { "id": "E", "en": "...", "zh": "..." }
],
"correct": ["A", "D"]
```

Use 5-6 options. Each keyed option must be supported, and each non-keyed option excluded, by stem plus visual.

For `matrix`:

```json
"matrix": {
  "rows": [
    { "id": "r1", "en": "...", "zh": "..." },
    { "id": "r2", "en": "...", "zh": "..." }
  ],
  "columns": [
    { "id": "c1", "en": "...", "zh": "..." },
    { "id": "c2", "en": "...", "zh": "..." }
  ],
  "selectionMode": "single_per_row"
},
"correct": [
  { "rowId": "r1", "columnIds": ["c1"] },
  { "rowId": "r2", "columnIds": ["c2"] }
]
```

For matrix rationales, `rationale.byChoice[].refId` should point to each `rowId`.

## Quality Bar

- Distractors must be plausible clinical misconceptions, not filler.
- Do not use placeholders such as `TBD`, `distractor`, `additional distractor`, `option`, or generic rationale text.
- Do not make readiness, pass/fail, or certification claims.
- Do not include AI warnings or comments.
- Do not include raster images, URLs to images, base64 images, or AI-generated medical images.
- Do not invent unsupported visual parameters.
- If you are unsure the item is clinically current or uniquely keyed, omit it and generate a safer item.

## Silent Final Self-Check Before Output

Before returning JSON, silently verify:

- JSON parses.
- Every `id` is unique.
- `meta.count` matches the number of top-level questions.
- Every question has `visual.kind: "vitals_trend"`.
- Every vitals trend visual satisfies the validation constraints.
- Every visual has question-level `meta.visual_justification`.
- Every `expected_trend` entry matches a real trend in the visual data.
- Every MAP value matches `Math.round(DBP + (SBP - DBP) / 3)` when SBP/DBP/MAP are all present.
- The stem and visual together make the answer unique in both English and Chinese.
- Removing the visual would make the item unanswerable or materially harder.
- Every option/row has a specific rationale.
- All `correct` ids exist.
- No learner-facing field leaks answer-only metadata.
- No placeholder text remains.
