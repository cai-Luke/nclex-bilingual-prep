You are an expert NCLEX-RN item writer, a clinical-reasoning reviewer, and a professional English to Simplified-Chinese medical translator.

Generate raw NCLEX-RN practice items that use a deterministic `capnography` visual stimulus. The visual must be educationally necessary, not decorative. Output valid JSON only.

## PARAMETERS

- COUNT: 6
- CATEGORY: mixed
- DIFFICULTY: medium
- ITEM_TYPES: multiple_choice, select_all, matrix
- PRIORITIZE_SKILLS: bronchospasm recognition; esophageal versus tracheal intubation; ROSC recognition during CPR; rebreathing troubleshooting
- AVOID_SKILLS:
- ID_PREFIX: cap_gpt_2026_07_02
- SOURCE_LABEL: GPT capnography raw batch, 2026-07-02
- BATCH_TURN: 1
- BATCH_TURN_ROLE: smoke
- MAX_PLANNED_TURNS: 3

## Multi-Turn Batch Plan

This chat is planned as up to three small generation turns. Turn 1 is a smoke batch. If the user says the smoke batch looks good and asks you to continue, generate turn 2 as a fresh JSON file. If turn 2 also looks good and the user asks again, generate turn 3 as a fresh JSON file.

Each turn must produce a new standalone raw-bank JSON file, not an appended patch and not a continuation inside the prior JSON. Label the file, source label, and item IDs with the turn count:

- Turn 1 smoke: `gpt-capnography-2026-07-02-turn-01-smoke.json`; item IDs like `cap_gpt_2026_07_02_t01_001`.
- Turn 2 follow-up: `gpt-capnography-2026-07-02-turn-02.json`; item IDs like `cap_gpt_2026_07_02_t02_001`.
- Turn 3 follow-up: `gpt-capnography-2026-07-02-turn-03.json`; item IDs like `cap_gpt_2026_07_02_t03_001`.

On follow-up turns, keep the same schema and quality rules, but avoid repeating the same clinical setup, answer key pattern, and `skill_signature` from earlier turns unless the user explicitly asks for more of the same.

## Output Rules

- Produce the output as a downloadable `.json` file named according to the current turn: `gpt-capnography-2026-07-02-turn-01-smoke.json` for the smoke batch, then `gpt-capnography-2026-07-02-turn-02.json` and `gpt-capnography-2026-07-02-turn-03.json` for continuation turns.
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
    "topic": "capnography visual interpretation",
    "category": "mixed",
    "difficulty": "medium",
    "count": 6
  },
  "questions": []
}
```

Set `meta.count` to the actual number generated.

## Shared Authoring Contract

Coverage drives volume, not the other way around. Generate a small, reviewable batch that covers distinct `skill_signature` values. Do not pad the batch with decorative capnograms.

Every item must be answerable only from the combination of:

- stem
- answer choices or rows
- capnography visual

If removing the visual leaves the same answer equally clear, reject the item and generate a different one.

Every visual item must include question-level `meta`:

```json
"meta": {
  "visual_justification": "One sentence explaining what the learner must read from the capnogram that the stem does not state.",
  "source": "Authoritative source for the capnography morphology-to-meaning claim.",
  "tier": "strictest",
  "skill_signature": "cap:pattern/decision-point",
  "pattern_keyed": "normal | shark_fin | flat | rosc | rebreathing",
  "stem_disambiguators": ["specific stem fact that makes the answer unique"]
}
```

`meta` is audit-only. Do not put answer-revealing metadata into the stem, choices, captions, glossary, or rationale unless it belongs there after the learner answers.

Use English as the exam surface and Simplified Chinese as learner scaffold. Every displayed text field must include natural, clinically equivalent `en` and `zh` text. Any load-bearing disambiguator in English must be equally clear in Chinese.

`topic` must be a concise English clinical topic, not a broad dashboard bucket. Examples: `capnography after intubation`, `bronchospasm during procedural sedation`, `ROSC during CPR`, `rebreathing on anesthesia circuit`.

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
- a deterministic `visual` object with `kind: "capnography"`
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

Use only item types listed in `ITEM_TYPES`. For `capnography`, prefer:

- `multiple_choice`
- `select_all`
- `matrix`

Do not use `ordered_response`, `fill_in_blank`, `dropdown_cloze`, `highlight`, `bowtie`, or top-level `case_study` in this batch unless explicitly asked in the parameters and current schema placement allows it.

## Capnography Visual Schema

Each item must include:

```json
"visual": {
  "kind": "capnography",
  "pattern": "normal",
  "etco2": 40,
  "respiratoryRate": 16,
  "durationSec": 15,
  "caption": { "en": "Capnogram", "zh": "呼气末二氧化碳波形图" }
}
```

Allowed `pattern` values:

- `normal`
- `shark_fin`
- `flat`
- `rosc`
- `rebreathing`

Validation constraints:

- `kind` must be `capnography`.
- `etco2` is required and must be 0-150.
- If `pattern` is `flat`, `etco2` must be exactly 0.
- `respiratoryRate` is required and must be 4-60.
- `durationSec` is optional, must be 5-60 if present, and defaults to 15.
- `severity` is required only for `shark_fin`, must satisfy `0 < severity <= 1`, and is disallowed for other patterns.
- `baselineEtco2` is required only for `rebreathing`, must satisfy `0 < baselineEtco2 < etco2`, and is disallowed for other patterns.
- `rosc` is required only for `rosc`, and must include `lowEtco2`, `highEtco2`, and `stepAtSec`.
- For `rosc`, `lowEtco2` and `highEtco2` must be 0-150, `highEtco2` must be greater than `lowEtco2`, and `stepAtSec` must be inside the rendered duration.
- `caption.en` is required if a caption is present; `caption.zh` is optional but must be non-empty if present.
- The caption must not reveal the answer.

## Verified Clinical Anchors

Use these morphology-to-meaning mappings only. Cite an authoritative source in `meta.source` for each item.

- `normal`: rectangular waveform with sharp upstroke, flat alveolar plateau, quick return to baseline; EtCO2 commonly 35-45 mmHg; indicates adequate ventilation and perfusion in context.
- `shark_fin`: sloped or prolonged upstroke with loss of flat plateau; suggests obstructive/reactive airway physiology such as asthma, COPD, or bronchospasm. Steeper slope means worse obstruction.
- `flat`: absent CO2 waveform; can indicate apnea, esophageal intubation, or circuit disconnection depending on context.
- `rosc`: abrupt EtCO2 rise during CPR.
- `rebreathing`: inspiratory baseline fails to return to zero; suggests rebreathing such as exhausted CO2 absorber or faulty valve in the appropriate circuit context.

Do not create items whose only cue is the EtCO2 number. The capnogram morphology must be the load-bearing cue.

## Lane-Specific Safety Traps

Flat waveform is ambiguous. A flat strip alone cannot distinguish apnea, esophageal intubation, and circuit disconnection. The stem must include disambiguators that make only one answer correct. Example disambiguators: immediately after intubation, absent chest rise, gurgling over epigastrium, disconnected tubing, or opioid oversedation with apnea.

Shark-fin does not name a disease by itself. It signals obstruction. If the keyed answer is asthma, COPD, bronchospasm, or a specific intervention, the stem must supply the clinical context that makes the answer unique.

Include crisp-waveform distractors in obstruction items. A good distractor should be clinically plausible but would produce a crisp waveform rather than a shark-fin morphology.

Cardiac arrest with compressions and low EtCO2 is not a truly flat line unless there is no ventilation/perfusion signal. Do not confuse `flat` with the low pre-ROSC portion of `rosc`.

Rebreathing requires the elevated inspiratory baseline to matter. Do not use it for generic respiratory distress.

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
- Every question has `visual.kind: "capnography"`.
- Every capnography visual satisfies the validation constraints.
- Every visual has question-level `meta.visual_justification`.
- `pattern_keyed` matches the actual visual pattern.
- The stem and visual together make the answer unique in both English and Chinese.
- Removing the visual would make the item unanswerable or materially harder.
- Every option/row has a specific rationale.
- All `correct` ids exist.
- No learner-facing field leaks answer-only metadata.
- No placeholder text remains.
