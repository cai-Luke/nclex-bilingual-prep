# GPT Gap-Fill Spec — Safety / Management / Psychosocial / Health Promotion (2026-06-11)

**Status:** Ready for GPT  
**Target raw file:** `banks-raw/gpt-gap-jun11-safety-mgmt.json` → merge into `gpt-canonical.json`  
**Schema version:** 1.2  
**Count:** 10  
**BANK_ID_PREFIX:** `gpt_gap_jun11`

## Coverage context (run 2026-06-11, 1164 total questions)

Category counts vs target 145.5 each:

| Category | Count | Deficit |
|---|---:|---:|
| Safety and Infection Control | 127 | −18.5 |
| Management of Care | 130 | −15.5 |
| Psychosocial Integrity | 131 | −14.5 |
| Health Promotion and Maintenance | 132 | −13.5 |
| Basic Care and Comfort | 135 | −10.5 |
| Reduction of Risk Potential | 139 | −6.5 |

Item type counts vs target 166 each:

| Type | Count | Deficit |
|---|---:|---:|
| `fill_in_blank` | 107 | −59 |
| `ordered_response` | 111 | −55 |
| `dropdown_cloze` | 130 | −36 |
| `matrix` | 147 | −19 |

## Allocation for this batch (10 items)

| Category | Count | Suggested item types |
|---|---:|---|
| Safety and Infection Control | 3 | 1 OR, 1 FIB, 1 SATA |
| Management of Care | 2 | 1 OR, 1 dropdown_cloze |
| Psychosocial Integrity | 2 | 1 dropdown_cloze, 1 MC |
| Health Promotion and Maintenance | 2 | 1 FIB, 1 matrix |
| Basic Care and Comfort | 1 | 1 OR |

## Specific topic targets per category

### Safety and Infection Control
- **Restraint monitoring protocol** (`ordered_response`, hard): Sequence for safely managing a vest restraint — least-restrictive alternatives attempted first, provider order obtained, explanation to patient/family, assessments every 2 hours, ROM exercises, documentation, reassessment for continued need.
- **CAUTI prevention bundle** (`fill_in_blank`, medium): Nurse calculates appropriate daily reassessment timing; one blank for evidence-based bundle element (e.g., daily catheter necessity review), one blank for minimum catheter-removal timing per IDSA guidance.
- **Active TB airborne precautions** (`select_all`, medium): Patient admitted with suspected active pulmonary TB — select all nursing actions that are correct. Five defensible correct answers: place in a negative-pressure/AII room; staff wear fit-tested N-95 or higher respirator; patient wears surgical mask during transport out of the room; keep room door closed; notify infection control. Distractors: standard precautions alone; surgical mask sufficient for staff; droplet precautions room.

### Management of Care
- **SBAR handoff sequence** (`ordered_response`, easy): Arrange the four SBAR elements in correct order when handing off a deteriorating patient, with each step containing realistic clinical language.
- **Teach-back for discharge readiness** (`dropdown_cloze`, hard): Nurse completes discharge education with a patient newly diagnosed with heart failure on a sodium-restricted diet and daily weights. Four-slot cloze: method nurse uses to evaluate understanding {{1}} because it {{2}}; if the patient cannot demonstrate the skill, the nurse should {{3}} because {{4}}. (Management of Care framing — patient education effectiveness, not Legal & Ethical.)

### Psychosocial Integrity
- **Anticipatory grief — therapeutic response** (`dropdown_cloze`, medium): 71-year-old with terminal COPD says, "I've lived a full life but I'm scared I'll be in pain at the end." Cloze tests best nursing response {{1}} because the response demonstrates {{2}}; the nurse correctly avoids {{3}} because {{4}}.
- **Body image disturbance post-colostomy** (`multiple_choice`, medium): Two weeks post-surgery patient states "I can never go back to normal." Priority nursing action among: acknowledge and explore feelings; reassure patient the stoma is temporary; provide educational pamphlet; refer immediately to psychiatry.

### Health Promotion and Maintenance
- **Colorectal cancer screening — average risk** (`fill_in_blank`, easy): Per current USPSTF recommendation, at what age should screening begin for an average-risk adult? And what is the recommended interval for a normal colonoscopy result?
- **Lifestyle counseling for prediabetes** (`matrix`, medium): For a patient newly diagnosed with prediabetes (A1C 5.8%), classify each recommendation as "evidence-based lifestyle modification" or "not recommended / no benefit": 150 min/week moderate aerobic exercise, at least 5–7% body weight reduction if overweight, metformin initiation without lifestyle trial, eliminating all dietary carbohydrates, Mediterranean-style diet, structured diabetes prevention program referral.

### Basic Care and Comfort
- **Non-pharmacological pain management sequencing** (`ordered_response`, easy): After a patient reports 6/10 musculoskeletal pain and rates pharmacologic tolerance as adequate, arrange the non-pharmacological bundle steps in priority order: reassessment at 30–60 minutes, position change to a therapeutic alignment, cold/heat application based on pain type, guided breathing or distraction, documentation of intervention and response.

## Constraints

**Avoid these over-represented topics** (already saturated):
- Mental Health Disorders (n=61), Prioritization & Delegation (47), Legal & Ethical Principles (45), Maternal-Newborn Care (43), Cardiovascular Disorders (43), Dosage Calculations (41), Medication Safety & Admin (40), Patient & Environment Safety (39)

The Management of Care items in this batch (SBAR, teach-back) are framed as care coordination and patient education effectiveness — not as legal/ethical scenarios — so they do not conflict with the above.

Do NOT generate near-duplicates of existing items with those topics.

**Difficulty mix:** 3 easy, 5 medium, 2 hard.

---

## Prompt (copy everything below this line into GPT)

---

You are an expert NCLEX-RN item writer, a clinical judgment exam editor, and a professional English↔Simplified-Chinese medical translator.

Generate a targeted bank of original NCLEX-RN practice questions in valid JSON only.

## PARAMETERS

- COUNT: 10
- BANK_ID_PREFIX: gpt_gap_jun11
- ITEM_TYPE_MIX: 3 ordered_response, 2 fill_in_blank, 2 dropdown_cloze, 1 matrix, 1 multiple_choice, 1 select_all
- DIFFICULTY_MIX: 3 easy, 5 medium, 2 hard

## CATEGORY TARGETS

Write exactly:
- 3 items in Safety and Infection Control
- 2 items in Management of Care
- 2 items in Psychosocial Integrity
- 2 items in Health Promotion and Maintenance
- 1 item in Basic Care and Comfort

## TOPIC GUIDANCE

Write one item per topic below. Use the suggested item type unless a different type tests the clinical judgment better — but preserve the overall item-type counts above.

1. **Restraint monitoring protocol** (Safety and Infection Control, ordered_response, hard) — Sequence for managing a vest/limb restraint correctly: least-restrictive alternatives, provider order, patient/family explanation, 2-hour assessments including ROM exercises, documentation, and reassessment for continued need.
2. **CAUTI prevention bundle** (Safety and Infection Control, fill_in_blank, medium) — Nurse reinforces evidence-based catheter-associated UTI prevention. Use 2 blanks: one for the single most effective prevention measure (removing unnecessary catheters), one for maximum acceptable assessment interval per evidence-based bundle (daily).
3. **Active pulmonary TB — airborne precautions** (Safety and Infection Control, select_all, medium) — Patient admitted with suspected active pulmonary TB. Select all correct nursing actions. Five correct answers: place in a negative-pressure/AII room; staff wear fit-tested N-95 or higher respirator; patient wears surgical mask when leaving the room; keep room door closed at all times; notify infection control. Include 2–3 plausible distractors (e.g., surgical mask alone adequate for staff; droplet precaution room; contact precautions sufficient).
4. **SBAR handoff** (Management of Care, ordered_response, easy) — Four SBAR elements in correct order when handing off a deteriorating patient. Each step contains realistic clinical content.
5. **Teach-back for discharge readiness** (Management of Care, dropdown_cloze, hard) — Nurse completing discharge education with a heart failure patient on sodium restriction and daily weights. Four-slot cloze: method to evaluate understanding {{1}} because it {{2}}; if patient cannot demonstrate, nurse should {{3}} because {{4}}.
6. **Anticipatory grief — therapeutic response** (Psychosocial Integrity, dropdown_cloze, medium) — 71-year-old with terminal COPD: "I'm scared I'll be in pain at the end." Four-slot cloze: best initial response {{1}}, communication principle demonstrated {{2}}, response to avoid {{3}}, reason to avoid it {{4}}.
7. **Body image disturbance — post-colostomy** (Psychosocial Integrity, multiple_choice, medium) — Two weeks post-op patient states "I can never go back to normal." Priority nursing action among 4 plausible options.
8. **Colorectal cancer screening — average risk** (Health Promotion and Maintenance, fill_in_blank, easy) — USPSTF recommends initiating screening at age {{1}} for average-risk adults; the recommended interval for a normal screening colonoscopy result is {{2}} years.
9. **Prediabetes lifestyle modification** (Health Promotion and Maintenance, matrix, medium) — Newly diagnosed prediabetes (A1C 5.8%). Classify 5–6 recommendations as "Evidence-based lifestyle modification" or "Not recommended / no added benefit": 150 min/week moderate aerobic exercise; 5–7% weight reduction if overweight; immediate metformin without lifestyle trial; eliminating all dietary carbohydrates; referral to structured diabetes prevention program; Mediterranean-style diet.
10. **Non-pharmacological pain management** (Basic Care and Comfort, ordered_response, easy) — Patient reports 6/10 musculoskeletal pain; analgesics adequate. Arrange 5-step non-pharmacological bundle in priority order: reassessment at 30–60 min, position change to therapeutic alignment, cold/heat application based on pain type, guided relaxation or distraction, documentation of intervention and response.

## AVOID TOPICS

Do not write about: Mental Health Disorders, Prioritization & Delegation, Legal & Ethical Principles, Maternal-Newborn Care, Cardiovascular Disorders, Dosage Calculations, Medication Safety & Administration, Patient & Environment Safety.

The Management of Care items in this batch (SBAR handoff, teach-back) are framed as care coordination and patient education effectiveness — keep that framing. Do not drift them toward legal/ethical scenarios.

Do not produce near-duplicates: same disease + same nursing action, same scenario with only demographics changed, same correct-answer logic with different wording, same medication point with same distractor pattern.

## CONTENT REQUIREMENTS

- Follow the current NCSBN NCLEX-RN test plan and Next-Generation NCLEX clinical judgment style.
- Every item tests nursing judgment, not trivia.
- Distractors must be plausible and clinically meaningful — realistic misconceptions, unsafe actions, wrong prioritizations.
- `topic` must be a specific clinical topic (e.g., "CAUTI Prevention Bundle" not "Safety and Infection Control").
- The correct answer must be defensible and unambiguous.
- Avoid trick wording; difficulty comes from clinical reasoning.
- For psychosocial items, use therapeutic communication principles without stigmatizing language.

## BILINGUAL REQUIREMENTS

For every displayed text field, provide both:
- English in `en`
- Natural Simplified Chinese in `zh`

Translations must preserve clinical meaning. Use standard Simplified-Chinese medical/nursing terminology. English is primary; Chinese is a comprehension scaffold.

## RATIONALE REQUIREMENTS

Each question must include:
- `rationale.correct`: English and Chinese explanation of why the keyed answer is correct.
- `rationale.byChoice`: per-option (MC/SATA), per-row (matrix), per-step (OR), per-dropdown (cloze), or per-blank (FIB) reasoning using the correct `refId`.
- `testTakingStrategy`: a short reusable strategy in both languages.
- `glossary`: 2–4 key medical/nursing terms with `termEn`, `termZh`, `defZh`.

Every `byChoice` entry must give the specific clinical reasoning for that exact choice.

## ID RULES

Pattern: `gpt_gap_jun11_<type_short>_<topic_slug>_01`

Type shorts: mc, sata, or, fib, matrix, cloze

Examples:
- `gpt_gap_jun11_or_restraint_monitoring_01`
- `gpt_gap_jun11_fib_cauti_prevention_01`
- `gpt_gap_jun11_cloze_advance_directive_01`

## OUTPUT FORMAT — CRITICAL

Output ONLY one valid JSON object. No markdown fences. No commentary. No comments inside JSON. Double quotes only. No trailing commas. Set `meta.count` to 10.

Before final output silently verify: parseable JSON, 10 questions, every `en`/`zh` pair non-empty, every answer id exists in options/rows/dropdowns, ordered_response `correct` is a complete permutation of option ids, fill_in_blank has no top-level `correct`, dropdown_cloze has no top-level `correct`, matrix row/column ids match exactly, no placeholder text.

## SCHEMA VERSION

Use `schemaVersion: "1.2"` (required for bilingual fields and ngnSkill).

Top-level envelope:

```json
{
  "meta": {
    "schemaVersion": "1.2",
    "exam": "NCLEX-RN",
    "topic": "Safety / Management / Psychosocial / Health Promotion gap-fill",
    "category": "mixed",
    "difficulty": "mixed",
    "count": 10
  },
  "questions": []
}
```

## COMMON QUESTION FIELDS

```json
{
  "id": "unique string",
  "itemType": "multiple_choice | select_all | ordered_response | fill_in_blank | matrix | dropdown_cloze",
  "category": "one exact category string",
  "topic": "concise specific topic label",
  "difficulty": "easy | medium | hard",
  "ngnSkill": "recognize_cues | analyze_cues | prioritize_hypotheses | generate_solutions | take_action | evaluate_outcomes",
  "stem": { "en": "...", "zh": "..." },
  "rationale": {
    "correct": { "en": "...", "zh": "..." },
    "byChoice": [{ "refId": "...", "en": "...", "zh": "..." }]
  },
  "testTakingStrategy": { "en": "...", "zh": "..." },
  "glossary": [{ "termEn": "...", "termZh": "...", "defZh": "..." }]
}
```

`category` must be exactly one of: `Management of Care`, `Safety and Infection Control`, `Health Promotion and Maintenance`, `Psychosocial Integrity`, `Basic Care and Comfort`, `Pharmacological and Parenteral Therapies`, `Reduction of Risk Potential`, `Physiological Adaptation`.

## TYPE-SPECIFIC FIELDS

### `multiple_choice`
4 options (A–D). `correct` contains exactly one option id.

### `select_all`
5–6 options. `correct` contains 2 or more option ids.

### `ordered_response`
4–5 options representing all steps to sequence. `correct` lists every option id exactly once in correct order.

### `fill_in_blank`
No top-level `correct`. Use `blanks` array:
```json
"blanks": [
  { "id": "b1", "prompt": { "en": "...", "zh": "..." }, "acceptable": ["45", "age 45"], "numeric": { "value": 45, "tolerance": 0, "unit": "years" } }
]
```

### `matrix`
```json
"matrix": {
  "rows": [{ "id": "r1", "en": "...", "zh": "..." }],
  "columns": [{ "id": "c1", "en": "...", "zh": "..." }],
  "selectionMode": "single_per_row"
},
"correct": [{ "rowId": "r1", "columnIds": ["c1"] }]
```

### `dropdown_cloze`
No top-level `correct`. Placeholders `{{1}}` `{{2}}` etc. must appear in both `clozeStem.en` and `clozeStem.zh`. Each dropdown has its own `correct` field matching one of its own option ids:
```json
"clozeStem": { "en": "The nurse should {{1}} because {{2}}.", "zh": "护士应该 {{1}}，因为 {{2}}。" },
"dropdowns": [
  { "id": "1", "options": [{ "id": "o1", "en": "...", "zh": "..." }], "correct": "o1" }
]
```

Generate the JSON now.
