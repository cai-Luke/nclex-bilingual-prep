# NCLEX Bank Generation Prompt (portable, model-agnostic)

**How to use (this section is for you, Luke — do NOT paste it into the model):**

1. Open any frontier chat model (Claude, GPT, Gemini, etc.).
2. Edit the **PARAMETERS** block below to what you want this batch to cover.
3. Copy everything from the `===== COPY BELOW THIS LINE =====` marker to the end, paste, send.
4. The model returns a JSON object. Save it as **`banks-raw/<source>-<YYYY-MM-DD>.json`** — one file per model per batch, e.g. `banks-raw/claude-2026-06-05.json`, `banks-raw/gpt-2026-06-05.json`. If a model produces a second batch the same day, add a suffix: `banks-raw/claude-2026-06-05-cardiac.json`. Then run the audit pass (promotes vetted questions into `banks/`) and rebuild + sync, or upload in-app.

**Practical notes:**
- Keep `COUNT` modest — **5–8 per batch** for standalone questions, or **1–2 per batch** for `case_study`. Chat UIs cap output length; a big batch can get truncated mid-JSON and won't import. Run the prompt several times to build a bigger bank.
- Some models still wrap output in ```json fences or add a sentence of preamble despite instructions. The app's importer is built to tolerate that (strips fences, finds the JSON), so don't worry if it isn't pristine.
- **Source label comes from the filename**, so don't ask the model which model it is (self-ID is unreliable) — just save it under the right `<source>-<date>` name. However, the app stores progress by `question.id`, so use source/batch-prefixed IDs that stay unique after accepted questions are merged into top-level bundled banks.
- `PRIORITIZE_TOPICS` / `AVOID_TOPICS` are optional and only matter once you have a sizable bank. The coverage tool reads top-level `/banks/*.json` and fills these in for you to steer generation toward gaps; until then, leave them blank.
- `NCLEX-Question-Schema.md` is authoritative. This portable prompt is a compact authoring aid, not a replacement for the schema doc or validator. Current authoring should use `schemaVersion: "1.6"`; older `1.0`–`1.5` banks remain import-compatible for their historical shapes.
- **Gemini caution:** Gemini can be fast and useful for raw volume, but recent hard-case output showed it needs strict guard rails: it may produce placeholder distractors, generic rationales, broad/wrong topic labels, or noncanonical shapes if asked loosely. Keep Gemini batches small, save them only under `banks-raw/`, and never let Gemini append directly to canonical `banks/*.json`. Use a non-generator reviewer before promotion. Other models can contribute too — save each under its own `<source>-<date>` file. Don't use the same model to both generate and review a batch.

---

===== COPY BELOW THIS LINE =====

You are an expert NCLEX-RN item writer and a professional English↔Simplified-Chinese medical translator.

## PARAMETERS
- COUNT: 2
- CATEGORY: mixed            // one NCLEX client-needs category, or "mixed"
- TOPIC: high-acuity unfolding case studies
- ITEM_TYPES: case_study     // any of: multiple_choice, select_all, ordered_response, fill_in_blank, matrix, dropdown_cloze, highlight, bowtie, case_study
- DIFFICULTY: hard           // easy | medium | hard | mixed
- INCLUDE_VISUALS: no        // no | a current deterministic visual kind from NCLEX-Question-Schema.md. Treat visual output as raw review material.
- PRIORITIZE_TOPICS:         // optional: comma-separated under-covered topics to lean into (leave blank if none)
- AVOID_TOPICS:              // optional: comma-separated over-covered topics to de-emphasize, NOT hard-exclude (leave blank if none)

## TASK
Generate COUNT original NCLEX-RN practice questions matching the parameters above. For EVERY question, provide complete English text AND a faithful, natural Simplified-Chinese translation of ALL displayed text: the stem, every answer element (options, rows, columns, dropdown choices, or blank prompts as the type requires), and all rationale.

## CONTENT REQUIREMENTS
- Follow the current NCSBN NCLEX-RN test plan and Next-Generation NCLEX (NGN) style. Questions should exercise clinical judgment: recognizing and analyzing cues, prioritizing, taking action, and evaluating outcomes.
- Distractors must be clinically plausible, not obviously wrong.
- Never use placeholder text. Forbidden examples include `"Additional distractor"`, `"distractor"`, `"Distractor analysis"`, `"placeholder"`, `"TBD"`, or generic rationales that could apply to any option.
- `topic` must be the specific clinical topic being tested, not a broad dashboard bucket. Good: `"Pyloric Stenosis vs. Intussusception"`, `"Autonomic Dysreflexia"`, `"Blood Transfusion Reaction"`. Bad: `"Cardiovascular Disorders"`, `"Mental Health Disorders"`, `"Prioritization & Delegation"` unless that is truly the clinical content.
- Each answer option must be meaningful on its own. If an option is incorrect, make it a realistic misconception, unsafe action, wrong prioritization, wrong diagnosis, or wrong medication/class — not filler.
- Answers are **type-specific** — follow the per-type structure in the SCHEMA section exactly. (Option types use a `correct` array of option ids; `fill_in_blank` uses `blanks[]` with `acceptable`/`numeric` and has NO top-level `correct`; `matrix` uses `correct: [{rowId, columnIds}]`; `dropdown_cloze` puts `correct` inside each dropdown.)
- Each rationale must explain WHY the correct answer is correct (`rationale.correct`) AND, in `rationale.byChoice`, why each individual choice is right or wrong, in clinical-reasoning terms. `byChoice[].refId` points to the option / row / dropdown / blank id as defined per type. Do not write reusable template text; every `byChoice` entry must mention the actual clinical reasoning for that exact choice.
- If generating `case_study`, each case should include shared clinical exhibits and 4–6 embedded standalone items that together exercise the NCJMM sequence: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, and evaluate outcomes. Embedded questions may use current standalone item types except `bowtie`.
- If INCLUDE_VISUALS is not `no`, add deterministic `visual` objects only where the current schema allows that visual kind. Do not add raster images, image URLs, base64 images, or AI-generated medical images. The visual must be inspectable data, clinically consistent with the keyed answer, load-bearing, and treated as raw material until human review checks the parameters, rendered artifact, and clinical reasoning.
- If a rhythm-strip visual is used to ask rhythm identification, the `caption` must not reveal the rhythm name or diagnosis.
- Translations must convey clinical meaning naturally — do not translate word-for-word. Use standard Simplified-Chinese medical/nursing terminology.
- `glossary`: list the key medical/nursing terms appearing in the item, each with the English term, its Simplified-Chinese term, and a one-line Chinese definition.
- Give every question a unique, readable `id`; include a source/batch/topic prefix when possible so IDs remain unique after reviewed batches are consolidated into canonical banks.
- If PRIORITIZE_TOPICS is non-empty, weight the set toward those topics. If AVOID_TOPICS is non-empty, generate fewer items on those topics — this is a soft bias, not a ban; they may still appear occasionally. If both are blank, ignore them and cover TOPIC normally.

## OUTPUT FORMAT — CRITICAL
- Output ONLY a single JSON object matching the SCHEMA below.
- Do NOT wrap it in markdown code fences. Do NOT write any text before or after the JSON.
- Use standard ASCII double quotes for all keys and string delimiters. No trailing commas. No comments. The output must be valid, parseable JSON.

## SCHEMA (schemaVersion 1.6 — follow exactly; `NCLEX-Question-Schema.md` is authoritative)

Top-level object:
{
  "meta": { "schemaVersion": "1.6", "exam": "NCLEX-RN", "topic": "<echo TOPIC>", "category": "<echo CATEGORY>", "difficulty": "<echo DIFFICULTY>", "count": <number generated> },
  "questions": [ <Question>, ... ]
}

Every Question has these COMMON fields:
{
  "id": "unique string",
  "itemType": "one of: multiple_choice | select_all | ordered_response | fill_in_blank | matrix | dropdown_cloze | highlight | bowtie | case_study",
  "category": "EXACTLY one of: Management of Care | Safety and Infection Control | Health Promotion and Maintenance | Psychosocial Integrity | Basic Care and Comfort | Pharmacological and Parenteral Therapies | Reduction of Risk Potential | Physiological Adaptation",
  "topic": "concise reusable label, e.g. heart failure",
  "difficulty": "easy | medium | hard",
  "ngnSkill": "optional, one of: recognize_cues | analyze_cues | prioritize_hypotheses | generate_solutions | take_action | evaluate_outcomes",
  "stem": { "en": "...", "zh": "..." },
  "rationale": {
    "correct": { "en": "why the answer is correct", "zh": "..." },
    "byChoice": [ { "refId": "<option/row/dropdown/blank id>", "en": "...", "zh": "..." } ]
  },
  "testTakingStrategy": { "en": "...", "zh": "..." },
  "glossary": [ { "termEn": "...", "termZh": "...", "defZh": "..." } ]
}

## VISUAL STIMULUS (optional schemaVersion 1.2+)

Only include `visual` when INCLUDE_VISUALS names a current deterministic visual kind. The example below is only the `rhythm_strip` shape; for `capnography`, `vitals_trend`, `lab_trend`, `mar`, `io_record`, `medication_label`, `device_screen`, `fetal_monitoring`, `burn_map`, or `injection_site`, follow `NCLEX-Question-Schema.md`.

Current variant:
{
  "visual": {
    "kind": "rhythm_strip",
    "rhythm": "sinus | sinus_brady | sinus_tach | afib | aflutter | svt | avb_1 | avb_2_mobitz1 | avb_2_mobitz2 | avb_3 | pvc | vtach | vfib | asystole",
    "rateBpm": 75,
    "durationSec": 6,
    "seed": 42,
    "calibrationPulse": true,
    "prSec": 0.16,
    "qrsSec": 0.08,
    "qtSec": 0.36,
    "caption": { "en": "Lead II rhythm strip", "zh": "II导联心律条" }
  }
}

Rules:
- Visual placement is per kind. The global default is `multiple_choice`, `select_all`, and `matrix`, plus case-study exhibits; some arithmetic/trend kinds also allow other item types as documented in `NCLEX-Question-Schema.md`.
- Case-study exhibits keep required `title` and `content`; add optional `visual` beside them.
- `rateBpm` is required. Use 20-300 except `vfib` and `asystole`, where 0-300 is allowed because rate is nominal.
- `durationSec` must be 3-12 when present; default 6.
- `seed` must be a non-negative integer when present; vary it across items so strips are not identical.
- Optional intervals must be consistent with the keyed answer and inside validator bounds: `prSec` 0.06-0.40 seconds, `qrsSec` 0.04-0.24 seconds, and `qtSec` 0.16-0.70 seconds.
- `atrialRateBpm` (20-400) and `conductionRatio` (integer 1-8) are only for atrial flutter / AV-dissociation strips where atrial and ventricular rates differ. Omit them on every other rhythm — do not copy them onto a sinus, afib, or vtach strip.
- Never let `caption` reveal the answer.

Then ADD the type-specific fields:

- multiple_choice: "options": [ {"id":"A","en":"...","zh":"..."}, ... 3-5 ], "correct": ["B"]  (exactly one id). byChoice: one entry per option.
- select_all: "options": [ ... 5-6 ], "correct": ["A","C",...]  (one OR MORE ids). byChoice: one per option.
- ordered_response: "options": [ {"id":"A",...}, ... ], "correct": ["C","A","D","B"]  (ALL option ids in correct order — a permutation of every option).
- fill_in_blank: NO "options", NO top-level "correct". Instead: "blanks": [ { "id":"b1", "prompt":{"en":"mL/hr","zh":"..."}, "acceptable":["125","125 mL/hr"], "numeric":{"value":125,"tolerance":0,"unit":"mL/hr"} } ]  (each blank needs acceptable[] and/or numeric).
- matrix: "matrix": { "rows":[{"id":"r1","en":"...","zh":"..."}], "columns":[{"id":"c1","en":"...","zh":"..."}], "selectionMode":"single_per_row | multiple_per_row" }, "correct": [ {"rowId":"r1","columnIds":["c2"]}, ... ]  (one entry per row; single_per_row => exactly one columnId). byChoice keyed by rowId.
- dropdown_cloze: NO top-level "correct". "stem" holds scenario; ADD "clozeStem": {"en":"... {{1}} ... {{2}} ...","zh":"... {{1}} ... {{2}} ..."} with {{id}} placeholders in BOTH languages, and "dropdowns": [ {"id":"1","options":[{"id":"o1","en":"...","zh":"..."},...],"correct":"o1"}, ... ]. byChoice keyed by dropdown id.
- highlight: ADD "highlight": { "segments":[{"id":"s1","en":"...","zh":"...","selectable":true}], "correct":["s1"] }. Correct ids must be selectable segment ids and at least one selectable distractor must remain.
- bowtie: standalone only. ADD "bowtie": { "condition":{"tokens":[...],"correct":"c1"}, "actions":{"tokens":[...],"correct":["a1","a2"]}, "parameters":{"tokens":[...],"correct":["p1","p2"]} }. Token ids must be unique across zones; condition keys exactly 1, actions 2, parameters 2.
- case_study: NO top-level "options" or "correct". ADD "caseStudy": { "title":{"en":"...","zh":"..."}, "summary":{"en":"...","zh":"..."}, "exhibits":[{"id":"triage","title":{"en":"...","zh":"..."},"content":{"en":"chart-like data","zh":"..."}}], "stages":[{"id":"stage_1","title":{"en":"...","zh":"..."},"exhibits":[{"id":"update","title":{"en":"...","zh":"..."},"content":{"en":"new data","zh":"..."}}]}], "questions":[ <full standalone Question>, ... ] }. Exhibits may include optional `visual` objects. Embedded questions may use current standalone item types except bowtie and must include their own full common fields, rationales, strategy, glossary, and type-specific answer fields.

RULES:
- Only emit the itemTypes listed in ITEM_TYPES. Do not invent other shapes.
- If ITEM_TYPES includes `case_study`, every top-level question may be a case study; each case study should contain 4–6 embedded standalone questions.
- Both "en" and "zh" are required and non-empty on every text pair.
- `category` must be one of the 8 exact strings above (never "mixed" on a question).
- Set "meta.count" to the actual number of questions you produced.
- Before final output, silently self-check that there is no placeholder/filler text, every option has a matching `byChoice` entry, each `byChoice` entry refers to the real option text, all `correct` ids exist, and every question-level `topic` is specific rather than a broad category label.

Generate the JSON now.
