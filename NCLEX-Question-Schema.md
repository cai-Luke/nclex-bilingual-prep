# NCLEX Bank — Canonical Question Schema

**schemaVersion: `1.2` — current.** This is the single source of truth. The app's TS type, the validator, and the generation prompt all implement this verbatim. `1.0` standalone-question banks remain supported. `1.1` case-study banks remain supported. Do not change shapes without bumping `schemaVersion` and writing a migration.

---

## Bank envelope

A generated bank is one JSON object:

```json
{
  "meta": {
    "schemaVersion": "1.2",
    "exam": "NCLEX-RN",
    "topic": "echo of the requested topic",
    "category": "echo of the requested category, or 'mixed'",
    "difficulty": "echo of the requested difficulty",
    "count": 6
  },
  "questions": [ /* Question objects */ ]
}
```

The importer also accepts a bare `[ ... ]` array of Question objects (no envelope). When present, `meta.schemaVersion` must be `"1.0"`, `"1.1"`, or `"1.2"`. `case_study` requires `"1.1"` or later. `visual` requires `"1.2"` when a bank envelope declares a schema version.

---

## Common fields (every Question, all types)

| field | type | required | notes |
|---|---|---|---|
| `id` | string | yes | unique within the bank; top-level bundled banks should be globally unique across each other because app state keys by `question.id`; uploaded imports regenerate collisions |
| `itemType` | enum | yes | `multiple_choice` \| `select_all` \| `ordered_response` \| `fill_in_blank` \| `matrix` \| `dropdown_cloze` \| `case_study` |
| `category` | enum | yes | one of the 8 client-needs subcategories (below), or `"mixed"` only at `meta` level — a question is always one specific category |
| `topic` | string | yes | free text, e.g. `"heart failure"`; keep concise + reusable for coverage tallying |
| `difficulty` | enum | yes | `easy` \| `medium` \| `hard` |
| `ngnSkill` | enum | optional | `recognize_cues` \| `analyze_cues` \| `prioritize_hypotheses` \| `generate_solutions` \| `take_action` \| `evaluate_outcomes` |
| `stem` | `{ en, zh }` | yes | scenario / question text, both languages |
| `rationale` | object | yes | see below |
| `testTakingStrategy` | `{ en, zh }` | yes | short strategy note, both languages |
| `glossary` | `[ { termEn, termZh, defZh } ]` | yes | key terms in the item; may be empty `[]` but prefer 2–5 |
| `visual` | object | optional | schema `1.2`; supported on `multiple_choice`, `select_all`, and `matrix` only; renders above the stem |

**`category` controlled vocabulary (use these exact strings):**
`Management of Care`, `Safety and Infection Control`, `Health Promotion and Maintenance`, `Psychosocial Integrity`, `Basic Care and Comfort`, `Pharmacological and Parenteral Therapies`, `Reduction of Risk Potential`, `Physiological Adaptation`.

**`rationale` shape:**
```json
{
  "correct": { "en": "why the keyed answer(s) are correct", "zh": "..." },
  "byChoice": [
    { "refId": "A", "en": "why this choice is right/wrong", "zh": "..." }
  ]
}
```
`byChoice[].refId` points to the relevant per-type identifier:
- option types → `optionId`
- `matrix` → `rowId`
- `dropdown_cloze` → `dropdownId`
- `fill_in_blank` → `blankId`

`byChoice` is **required for option types** (one entry per option). For other types it's encouraged (one per row / dropdown / blank) but may be omitted if `rationale.correct` fully explains it.

All `{ en, zh }` pairs require both languages non-empty. `zh` is natural Simplified Chinese, not literal word-for-word.

---

## Optional visual stimulus — schema `1.2`

Visuals are deterministic data, not image files. A question or case-study exhibit may carry an optional `visual` object. The app renders the visual locally as SVG from the stored parameters, with no raster assets, runtime API calls, or external files.

Supported locations:
- Top-level or embedded `multiple_choice`, `select_all`, and `matrix` questions.
- `case_study.caseStudy.exhibits[]` and `caseStudy.stages[].exhibits[]`.

Unsupported locations:
- `ordered_response`, `fill_in_blank`, `dropdown_cloze`, and the `case_study` parent object itself.

  (Placement is per-kind. The set above is the global default; a future kind may opt into a different `allowedItemTypes`.)

### Visual framework (kind-agnostic)

Every visual `kind` is a self-contained module under `src/visuals/kinds/<kind>.ts` registered in a shared registry. The kind-agnostic files — `src/App.tsx` (renders through one `VisualStimulus` dispatcher), `src/schema.ts` (validates through the registry), `scripts/validate-bank.ts`, and `scripts/coverage-report.ts` — iterate the registry and never special-case a kind. A kind module exposes a contract:

- `validate(spec) → VisualError[]` — structural + range validation of the spec **alone**; this is what the per-kind "Validation rules" below enumerate.
- `selfCheck?(spec, question) → VisualError[]` — optional cross-consistency check of render-vs-answer (arithmetic gates: I&O totals, label dose, Parkland volume). Waveforms generally have none; `rhythm_strip` has none.
- `renderSvg(spec) → string` — pure, deterministic, XML-escaped SVG. No `Math.random` (seed the shared PRNG from `spec.seed ?? 0`), no `Date`/`performance`, no DOM, no network, no module-level mutable state. Route all coordinate numbers through the shared fixed-decimal formatter so float formatting can't drift; XML-escape any free text (only `caption` today).
- `requiredSchemaVersion?` / `allowedItemTypes?` — default to `"1.2"` and the global placement set above; a kind overrides only if it differs.
- `fixtures` — colocated valid + invalid examples the generic conformance harness runs automatically.

The compile-time spec union (`QuestionVisual`) is assembled in one barrel (`src/visuals/types.ts`) with **append-only** single-line additions; that union line is the only shared compile-time touch-point.

### Adding a new visual kind (checklist)

1. Create `src/visuals/kinds/<kind>.ts`: declare `interface <Kind>Visual { kind: "<kind>"; ... }`, implement `validate` / `renderSvg` / optional `selfCheck`, define `fixtures`, and call `registerVisual(<kind>Module)`.
2. Reuse `src/visuals/primitives/` (`prng`, `graphPaper`, `escapeXml`, and later `chart`/`table`) — do not re-implement scaling or PRNG.
3. Add `| <Kind>Visual` to the union in `src/visuals/types.ts` (append-only).
4. Add `import "./<kind>";` to `src/visuals/kinds/index.ts` (append-only registration barrel).
5. Add a per-kind subsection here (params, vocab, validation rules, caption rule).
6. Run `npm run test-visuals` + `npm run validate-bank -- banks/*.json` + `npm run coverage-report` + `npm run build`.
7. (Then, separately) generate questions via the kind's content lane → review → promote → ledger.

If a step requires editing `App.tsx`, `schema.ts`, `validate-bank.ts`, or `coverage-report.ts`, the framework was under-generalized — fix the framework, not the kind.

### Kind: `rhythm_strip`

```json
{
  "visual": {
    "kind": "rhythm_strip",
    "rhythm": "sinus",
    "rateBpm": 75,
    "durationSec": 6,
    "seed": 42,
    "calibrationPulse": true,
    "prSec": 0.16,
    "qrsSec": 0.08,
    "qtSec": 0.36,
    "caption": { "en": "Lead II rhythm strip" }
  }
}
```

`rhythm` controlled vocabulary:
`sinus`, `sinus_brady`, `sinus_tach`, `afib`, `aflutter`, `svt`, `avb_1`, `avb_2_mobitz1`, `avb_2_mobitz2`, `avb_3`, `pvc`, `vtach`, `vfib`, `asystole`.

Validation rules:
- `kind` must be `"rhythm_strip"`.
- `rateBpm` is required. It must be 20–300, except `vfib` and `asystole` may use 0–300 because the renderer treats rate as nominal for those rhythms.
- `durationSec`, if present, must be 3–12. Default is 6.
- `seed`, if present, must be a non-negative integer. Default is 0.
- `calibrationPulse`, if present, must be boolean. Default is true.
- `atrialRateBpm`, if present, must be 20–400.
- `conductionRatio`, if present, must be an integer from 1–8.
- `prSec`, if present, must be 0.06–0.40 seconds.
- `qrsSec`, if present, must be 0.04–0.24 seconds.
- `qtSec`, if present, must be 0.16–0.70 seconds.
- `caption.en`, if caption is present, is required. `caption.zh` is optional but must be non-empty if present.

The `caption` must never reveal the answer. For example, do not caption a strip `"Atrial fibrillation"` on an item asking the learner to identify atrial fibrillation.

### Kind: `capnography`

```json
{
  "visual": {
    "kind": "capnography",
    "pattern": "shark_fin",
    "etco2": 45,
    "respiratoryRate": 20,
    "durationSec": 15,
    "severity": 0.8,
    "caption": { "en": "Capnogram" }
  }
}
```

`pattern` controlled vocabulary:
`normal`, `shark_fin`, `flat`, `rosc`, `rebreathing`.

Validation rules:
- `kind` must be `"capnography"`.
- `pattern` must be one of the 5 allowed patterns.
- `etco2` is required, must be 0–150. If `pattern` is `flat`, must be exactly 0.
- `respiratoryRate` is required, must be 4–60.
- `durationSec`, if present, must be 5–60. Default is 15.
- `severity` is required for `shark_fin`, strictly `0 < severity <= 1`, and disallowed for other patterns.
- `baselineEtco2` is required for `rebreathing`, strictly `0 < baselineEtco2 < etco2`, and disallowed for other patterns.
- `rosc` object is required for `rosc` (with `lowEtco2`, `highEtco2`, `stepAtSec` properties), and disallowed for other patterns.
- `caption.en`, if caption is present, is required. `caption.zh` is optional but must be non-empty if present.

### Kind: `vitals_trend`

```json
{
  "visual": {
    "kind": "vitals_trend",
    "timepointsHr": [0, 4, 8],
    "series": [
      { "vital": "hr", "values": [85, 100, 120] },
      { "vital": "map", "values": [90, 75, 60] }
    ],
    "caption": { "en": "Vital signs flow sheet over 8 hours" }
  }
}
```

`VitalKey` controlled vocabulary:
`hr`, `sbp`, `dbp`, `map`, `rr`, `spo2`, `temp`.

Validation rules:
- `kind` must be `"vitals_trend"`.
- `timepointsHr` is required, must be a strictly increasing array of finite numbers.
- `series` is required, must contain at least one series. No duplicate `vital` keys allowed.
- Each `series.values` array must have the exact same length as `timepointsHr`.
- Values must be within sensible physiologic ranges per vital.
- If `map`, `sbp`, and `dbp` are all provided, `map` must satisfy `dbp <= map <= sbp` across all points.
- `tempUnit`, if present, must be `"C"` or `"F"`.
- `selfCheck` verifies that provided `map` values exactly match the computed `MAP = Math.round(DBP + (SBP - DBP) / 3)`.
- `selfCheck` verifies any `expectedTrend` metadata provided in the question accurately reflects the data array.
- `caption.en`, if caption is present, is required. `caption.zh` is optional but must be non-empty if present.
---

## Per-type structure

### 1. `multiple_choice` — single best answer
```json
{
  "id": "mc_hf_01", "itemType": "multiple_choice",
  "category": "Physiological Adaptation", "topic": "heart failure", "difficulty": "medium",
  "stem": { "en": "...", "zh": "..." },
  "options": [
    { "id": "A", "en": "...", "zh": "..." },
    { "id": "B", "en": "...", "zh": "..." },
    { "id": "C", "en": "...", "zh": "..." },
    { "id": "D", "en": "...", "zh": "..." }
  ],
  "correct": ["B"],
  "rationale": { "correct": {"en":"...","zh":"..."}, "byChoice": [ {"refId":"A","en":"...","zh":"..."}, {"refId":"B","en":"...","zh":"..."}, {"refId":"C","en":"...","zh":"..."}, {"refId":"D","en":"...","zh":"..."} ] },
  "testTakingStrategy": {"en":"...","zh":"..."},
  "glossary": [ {"termEn":"afterload","termZh":"后负荷","defZh":"心室收缩时必须克服的阻力"} ]
}
```
- `options`: 3–5 items, ids `A`,`B`,`C`,…
- `correct`: array with **exactly one** optionId.

### 2. `select_all` — SATA / multiple response
Same shape as `multiple_choice` but:
- `options`: 5–6.
- `correct`: array of **one or more** optionIds (no fixed count).

### 3. `ordered_response` — prioritization / drag-to-order
```json
{
  "itemType": "ordered_response",
  "options": [ {"id":"A","en":"step ...","zh":"..."}, {"id":"B",...}, {"id":"C",...}, {"id":"D",...} ],
  "correct": ["C","A","D","B"]
}
```
- `correct`: **every** optionId, listed in the correct order. Must be a permutation of all option ids (same set, no repeats, no omissions).

### 4. `fill_in_blank` — numeric (dosage calc) or short text
```json
{
  "itemType": "fill_in_blank",
  "stem": { "en": "Order: 500 mg in 250 mL over 2 h. Infuse at how many mL/hr?", "zh": "..." },
  "blanks": [
    {
      "id": "b1",
      "prompt": { "en": "mL/hr", "zh": "毫升/小时" },
      "acceptable": ["125", "125 mL/hr"],
      "numeric": { "value": 125, "tolerance": 0, "unit": "mL/hr" }
    }
  ]
}
```
- **No `options`.** No top-level `correct`.
- `blanks`: usually length 1; array allows multiple.
- Each blank needs **at least one** of `acceptable` (string match, trimmed + case-insensitive) or `numeric` (`value` ± `tolerance`, optional `unit`). If `numeric` present, the grader parses the entered number and accepts within tolerance.

### 5. `matrix` — grid / matrix multiple-choice
Rows are statements/findings; columns are categories. Each row gets a selection.
```json
{
  "itemType": "matrix",
  "matrix": {
    "rows": [ {"id":"r1","en":"Crackles in lung bases","zh":"肺底湿啰音"}, {"id":"r2",...} ],
    "columns": [ {"id":"c1","en":"Expected","zh":"预期"}, {"id":"c2","en":"Unexpected","zh":"非预期"} ],
    "selectionMode": "single_per_row"
  },
  "correct": [ {"rowId":"r1","columnIds":["c2"]}, {"rowId":"r2","columnIds":["c1"]} ]
}
```
- `selectionMode`: `single_per_row` (radio per row, `columnIds` length 1) or `multiple_per_row` (checkboxes, `columnIds` length ≥1).
- `correct`: exactly one entry per row; every `rowId` must exist in `matrix.rows`, every `columnId` in `matrix.columns`.

### 6. `dropdown_cloze` — drop-down rationale / cloze
```json
{
  "itemType": "dropdown_cloze",
  "stem": { "en": "scenario context ...", "zh": "..." },
  "clozeStem": {
    "en": "The client is most at risk for {{1}} due to {{2}}.",
    "zh": "由于 {{2}}，该患者最有可能发生 {{1}}。"
  },
  "dropdowns": [
    { "id": "1", "options": [ {"id":"o1","en":"hypokalemia","zh":"低钾血症"}, {"id":"o2","en":"hyperkalemia","zh":"高钾血症"} ], "correct": "o1" },
    { "id": "2", "options": [ {"id":"o1","en":"loop diuretic use","zh":"袢利尿剂使用"}, {"id":"o2","en":"beta blocker use","zh":"β受体阻滞剂使用"} ], "correct": "o1" }
  ]
}
```
- `clozeStem`: both languages, with `{{id}}` placeholders matching each `dropdowns[].id`. Placeholders must appear in both `en` and `zh`.
- Each dropdown's `correct` is one of its own option ids. No top-level `correct`.

### 7. `case_study` — unfolding NGN case container
`case_study` is a top-level `1.1+` item type for harder NGN practice. It presents shared chart/exhibit data once, then asks 2–6 embedded standalone questions that reuse the existing six item types.

```json
{
  "id": "case_sepsis_01",
  "itemType": "case_study",
  "category": "Physiological Adaptation",
  "topic": "sepsis from pneumonia",
  "difficulty": "hard",
  "stem": { "en": "Review the client record and answer the case-study items.", "zh": "..." },
  "caseStudy": {
    "title": { "en": "Unfolding case: suspected sepsis", "zh": "..." },
    "summary": { "en": "Brief case setup", "zh": "..." },
    "exhibits": [
      {
        "id": "triage",
        "title": { "en": "0730 triage note", "zh": "..." },
        "content": { "en": "Vital signs, history, labs, etc.", "zh": "..." },
        "visual": { "kind": "rhythm_strip", "rhythm": "sinus", "rateBpm": 75 }
      }
    ],
    "stages": [
      {
        "id": "stage_0815",
        "title": { "en": "0815 update", "zh": "..." },
        "exhibits": [
          {
            "id": "new_labs",
            "title": { "en": "New results", "zh": "..." },
            "content": { "en": "...", "zh": "..." }
          }
        ]
      }
    ],
    "questions": [
      { "id": "case_sepsis_01_part_1", "itemType": "matrix", "...": "full standalone question shape" },
      { "id": "case_sepsis_01_part_2", "itemType": "ordered_response", "...": "full standalone question shape" }
    ]
  },
  "rationale": { "correct": { "en": "Case-level clinical reasoning summary", "zh": "..." } },
  "testTakingStrategy": { "en": "...", "zh": "..." },
  "glossary": []
}
```

- `caseStudy.exhibits`: required, at least one exhibit. Use concise chart-like content; newline-separated vitals/labs are allowed.
- `caseStudy.exhibits[].visual`: optional schema `1.2` visual stimulus. Exhibit `title` and `content` remain required even when a visual is present.
- `caseStudy.stages`: optional unfolding updates, each with at least one exhibit.
- `caseStudy.questions`: 2–6 embedded standalone questions. Embedded questions must be one of the six v1.0 item types and must include their own full common fields, rationale, strategy, and glossary.
- Embedded question ids must be unique within the case and differ from the parent case id.
- Case-level `rationale.correct` summarizes the whole case. Each embedded question carries the detailed graded rationale.

---

## Validation rules (importer + commit-time check)

An item is **invalid → skipped and reported** (never partially rendered) if any apply:
- Missing `id`, `itemType`, `stem.en`, `stem.zh`, `rationale.correct.en/zh`, `testTakingStrategy.en/zh`.
- `category` not in the controlled vocabulary; `difficulty`/`itemType`/`ngnSkill` not in their enums.
- Any required `{ en, zh }` pair with an empty string.
- **option types:** missing `options` or `correct`; a `correct` id not present in `options`; `multiple_choice` `correct` length ≠ 1; `ordered_response` `correct` not a permutation of all option ids.
- **fill_in_blank:** missing `blanks`, or a blank with neither `acceptable` nor `numeric`.
- **matrix:** missing `matrix.rows`/`matrix.columns`/`correct`; a `rowId`/`columnId` not found; `single_per_row` with a `columnIds` length ≠ 1.
- **dropdown_cloze:** a `{{id}}` in `clozeStem` with no matching dropdown (or vice versa); a dropdown `correct` not among its options; placeholders missing from `zh`.
- **case_study:** `meta.schemaVersion` is `"1.0"`; missing `caseStudy.exhibits`; fewer than 2 or more than 6 embedded questions; an embedded question is another `case_study`; embedded ids are duplicated.
- **visual:** present in a versioned bank below schema `"1.2"`; placed on an unsupported item type; unknown visual `kind`; invalid rhythm class; out-of-range rate, duration, interval, seed, atrial rate, or conduction ratio.

Report format: `"imported N of M; skipped K (reasons...)"`.

---

## Grading (app must implement consistently)

- `multiple_choice`: correct iff selected == the single `correct` id.
- `select_all`: correct iff selected set == `correct` set exactly (NCLEX gives no partial credit on SATA; the app may optionally show "x of y" but scores it all-or-nothing).
- `ordered_response`: correct iff submitted order == `correct` order exactly.
- `fill_in_blank`: per blank, correct iff matches an `acceptable` (trim + lowercase) OR (if `numeric`) parsed value within `value ± tolerance`. All blanks must pass.
- `matrix`: correct iff every row's selected `columnIds` set == the `correct` entry for that row.
- `dropdown_cloze`: correct iff every dropdown's selection == its `correct`.
- `case_study`: correct iff every embedded question is correct. The app also shows each part's correct/review status and rationale after submission.

---

## Notes

- `highlight` / enhanced hot-spot and `bowtie` are still intentionally not in v1.2. Adding them later = a `1.x` bump with new type blocks.
- `case_study` is the v1.1 hard-mode container for multi-part unfolding practice. It deliberately reuses v1.0 embedded item types instead of introducing new grading rules.
- IDs: any unique string is fine. A readable convention like `<type>_<topicslug>_<n>` helps debugging but isn't required.
- Keep `topic` strings consistent across batches (e.g., always `"heart failure"`, not sometimes `"CHF"`) so the coverage tool tallies cleanly. Minor variants can be fuzzy-grouped by the tool.
