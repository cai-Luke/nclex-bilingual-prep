# GPT Gap-Fill Spec — Reduction of Risk Potential / Basic Care and Comfort (2026-06-12)

**Status:** Ready for GPT  
**Target raw file:** `banks-raw/gpt-gap-jun12-rrp-bcc.json` → merge into `gpt-canonical.json`  
**Schema version:** 1.2  
**Count:** 10  
**BANK_ID_PREFIX:** `gpt_gap_jun12`

## Coverage context (post-jun11, 1194 total questions)

Category counts vs target 149.3 each:

| Category | Count | Deficit |
|---|---:|---:|
| Management of Care | 136 | −13.3 |
| Safety and Infection Control | 136 | −13.3 |
| Psychosocial Integrity | 137 | −12.3 |
| Basic Care and Comfort | 138 | −11.3 |
| Health Promotion and Maintenance | 138 | −11.3 |
| Reduction of Risk Potential | 139 | −10.3 |

Item type counts vs target 170.6 each:

| Type | Count | Deficit |
|---|---:|---:|
| `case_study` | 84 | −86.6 |
| `fill_in_blank` | 113 | −57.6 |
| `ordered_response` | 120 | −50.6 |
| `dropdown_cloze` | 136 | −34.6 |
| `matrix` | 150 | −20.6 |

The jun11 batches targeted Safety/Management/Psychosocial/HPM. **This batch focuses on RRP and BCC**, the two categories that received the least coverage in that pass, plus one MoC item to continue closing that gap.

## Allocation for this batch (10 items)

| Category | Count | Item types |
|---|---:|---|
| Reduction of Risk Potential | 5 | 2 FIB, 1 OR, 1 matrix, 1 cloze |
| Basic Care and Comfort | 4 | 1 FIB, 1 OR, 1 matrix, 1 cloze |
| Management of Care | 1 | 1 OR |

**Item type tally:** 3 `ordered_response`, 3 `fill_in_blank`, 2 `matrix`, 2 `dropdown_cloze`  
**Difficulty mix:** 2 easy, 5 medium, 3 hard

## Specific topic targets per category

### Reduction of Risk Potential (5)

1. **Blood transfusion reaction — recognition and response** (`ordered_response`, hard): A patient develops fever, chills, and flank pain 15 minutes into a packed red blood cell transfusion. Sequence all nursing actions: stop the transfusion immediately and disconnect the blood tubing at the hub; maintain IV access and begin infusing 0.9% NaCl through new tubing; notify the provider and charge nurse; return the blood bag and original tubing to the blood bank with a completed transfusion reaction report; obtain blood specimens and a urine sample per protocol; document the reaction, all actions taken, and the client's response.

2. **Post-surgical drain output monitoring** (`fill_in_blank`, medium): Client returns from open abdominal surgery with a Jackson-Pratt drain. Two blanks: (1) the minimum assessment frequency for drain output during the first 24 hours post-op; (2) the type of drainage that warrants immediate provider notification if it appears suddenly after the first post-op hour.

3. **NPUAP pressure injury staging** (`matrix`, medium): Six wound descriptions; classify each as Stage 1, Stage 2, Stage 3, Stage 4, Deep Tissue Injury (DTI), or Unstageable. Use two-column format: "Stage 1 or 2 (superficial, intact or partial thickness)" vs "Stage 3, 4, DTI, or Unstageable (full-thickness or cannot be staged)." Include one closed blister with purple discoloration (DTI), one intact but non-blanchable erythema (Stage 1), one shallow open ulcer with red-pink wound bed (Stage 2), one full-thickness wound with visible subcutaneous tissue (Stage 3), and one wound with visible tendon/bone (Stage 4), and one wound covered entirely with stable eschar obscuring wound depth (Unstageable).

4. **VTE prophylaxis in post-operative patient** (`dropdown_cloze`, hard): Patient is day 1 post total knee arthroplasty. Four-slot cloze: the nurse's priority action on finding the sequential compression device (SCD) not applied is {{1}} because {{2}}; if the patient refuses pharmacologic VTE prophylaxis (low-molecular-weight heparin), the nurse should {{3}} because {{4}}.

5. **Post-thoracentesis assessment** (`fill_in_blank`, medium): After a nurse-assisted thoracentesis for pleural effusion, two blanks: (1) the primary early complication the nurse monitors for, assessed by auscultating breath sounds on the affected side and monitoring oxygen saturation; (2) the earliest point at which a post-procedure chest radiograph is typically expected (expressed as hours or a time window).

---

### Basic Care and Comfort (4)

6. **Enteral tube feeding — tolerance monitoring** (`fill_in_blank`, medium): A client receiving continuous gastric tube feeding develops abdominal distension, nausea, and reports feeling full. Two blanks: (1) the minimum gastric residual volume that, per current evidence-based practice, should prompt the nurse to hold a continuous tube feeding and notify the provider; (2) the minimum head-of-bed elevation (in degrees) the nurse must maintain during enteral feeding and for at least 30–60 minutes after an intermittent feed to reduce aspiration risk.

7. **Bowel management for hospital-acquired constipation** (`ordered_response`, easy): A client on day 3 of hospitalization after elective hip replacement has not had a bowel movement. Arrange the nursing interventions in the correct order from least invasive to most invasive: assess last bowel movement, usual pattern, and contributing factors (diet, opioids, immobility); increase fluid intake to 2000–2500 mL/day as tolerated and offer high-fiber foods; promote early ambulation and physical activity as cleared by the orthopedic team; administer prescribed stool softener (docusate sodium); administer prescribed stimulant laxative if no result after 24 hours of the above.

8. **Peripheral IV phlebitis — VIP scale assessment and response** (`matrix`, medium): Five peripheral IV site findings; classify each as "Continue IV and reassess per policy" or "Discontinue IV, restart at new site, and notify provider if systemic signs." Findings: no redness, no swelling, no pain (grade 0); faint erythema with slight swelling at the site with mild pain on palpation (grade 1); marked pain at site with erythema and swelling along the vein (grade 2); palpable venous cord extending 3 cm from the insertion site with erythema and swelling (grade 3); palpable venous cord >3 cm from site with purulent discharge at the insertion point (grade 4).

9. **Post-operative urinary retention assessment** (`dropdown_cloze`, hard): A client is 6 hours post-op from abdominal hysterectomy and has not voided. The nurse uses a bladder scanner and obtains a reading of 420 mL. Four-slot cloze: the nurse should first {{1}} because {{2}}; if the client still cannot void after the initial nursing intervention, the nurse should {{3}} because {{4}}.

---

### Management of Care (1)

10. **Near-miss medication error — incident report sequence** (`ordered_response`, medium): A nurse discovers a near-miss medication error: the wrong dose of metoprolol was selected in the automated dispenser but was caught before administration. Arrange the nursing actions in the correct order: assess the client and confirm no harm occurred; complete an institutional incident (occurrence) report in the electronic safety reporting system; notify the charge nurse and the prescribing provider; document the clinical assessment findings in the medical record (without referencing the incident report in the chart notes); participate in debrief or root-cause review if initiated by the unit manager.

---

## Constraints

**Avoid these over-represented topics** (already saturated):
- Mental Health Disorders (n=61), Prioritization & Delegation (47), Legal & Ethical Principles (45), Maternal-Newborn Care (43), Cardiovascular Disorders (43), Dosage Calculations (41), Medication Safety & Admin (40), Patient & Environment Safety (39)

**Do not near-duplicate from the jun11 batches:**  
CAUTI prevention, restraint monitoring, TB/varicella/meningococcal/norovirus/scabies precautions, SBAR handoff, teach-back, colorectal/cervical/lung cancer screening, prediabetes lifestyle, osteoporosis, physical activity counseling, anticipatory grief, caregiver strain, body image (colostomy, amputation), cultural humility, spiritual distress, sterile dressing change, dysphagia mealtime, oral care xerostomia, non-pharmacological pain sequencing, needlestick exposure, care conference coordination, critical result communication.

**Avoid:** Braden Scale risk factor domains as row-level content (a Braden matrix is already in `claude-canonical`). Use NPUAP staging classification instead (different skill).

---

## Second-priority track (next after this batch)

**Case study gap is the dominant structural deficit: 84 current vs 171 target (−87).**

Case study distribution by category reveals two critical gaps:

| Category | Case studies | Notes |
|---|---:|---|
| Physiological Adaptation | 25 | Largest, but category is already over-represented |
| Psychosocial Integrity | 14 | Near target |
| Health Promotion and Maintenance | 13 | Near target |
| Basic Care and Comfort | 11 | Adequate |
| Reduction of Risk Potential | 11 | Adequate |
| Safety and Infection Control | 6 | Moderate gap |
| **Management of Care** | **2** | **Critical gap** |
| **Pharmacological and Parenteral Therapies** | **2** | **Critical gap** |

Next case study session should generate 5–6 items targeting MoC (2–3), PPT (2), SIC (1). Suggested MoC topics: care coordination for complex discharge with social barriers; nursing advocacy for a client whose concerns are dismissed; safe handoff to a rehabilitation unit. Suggested PPT: adverse drug reaction recognition (non-cardiovascular), anticoagulation monitoring in a patient with renal impairment. GPT can generate these; Opus pipeline preferred for the hard clinical PPT items.

---

## Prompt (copy everything below this line into GPT)

---

You are an expert NCLEX-RN item writer, a clinical judgment exam editor, and a professional English↔Simplified-Chinese medical translator.

Generate a targeted bank of original NCLEX-RN practice questions in valid JSON only.

## PARAMETERS

- COUNT: 10
- BANK_ID_PREFIX: gpt_gap_jun12
- ITEM_TYPE_MIX: 3 ordered_response, 3 fill_in_blank, 2 matrix, 2 dropdown_cloze
- DIFFICULTY_MIX: 2 easy, 5 medium, 3 hard

## CATEGORY TARGETS

Write exactly:
- 5 items in Reduction of Risk Potential
- 4 items in Basic Care and Comfort
- 1 item in Management of Care

## TOPIC GUIDANCE

Write one item per topic below. Use the suggested item type unless a different type tests the clinical judgment better — but preserve the overall item-type counts above.

1. **Blood transfusion reaction — recognition and response** (Reduction of Risk Potential, ordered_response, hard) — Patient develops fever, chills, and flank pain 15 minutes into a packed red blood cell transfusion. Sequence all six nursing actions: stop the transfusion/disconnect at hub; maintain IV access with NS through new tubing; notify provider and charge nurse; return blood + tubing to blood bank with completed reaction report; obtain blood and urine specimens per protocol; document all actions and client response.

2. **Post-surgical drain output monitoring** (Reduction of Risk Potential, fill_in_blank, medium) — Client post open abdominal surgery with a Jackson-Pratt drain. Blank 1: minimum frequency to assess drain output during the first 24 hours post-op. Blank 2: the type of drainage that warrants immediate provider notification if it appears suddenly after the first post-op hour (answer: bright red / sanguineous hemorrhagic output or sudden cessation/significant increase — be specific and clinically unambiguous).

3. **NPUAP pressure injury staging — simplified two-column matrix** (Reduction of Risk Potential, matrix, medium) — Six wound descriptions; classify each as "Stage 1 or 2 (superficial or partial-thickness)" or "Stage 3, 4, DTI, or Unstageable (full-thickness or cannot be staged)." Include: intact non-blanchable erythema on intact skin (Stage 1); shallow open ulcer with red-pink wound bed (Stage 2); full-thickness wound with visible but not exposed subcutaneous fat (Stage 3); wound with exposed tendon or bone (Stage 4); intact purple or maroon discoloration with intact skin — deep tissue pressure injury (DTI); wound bed obscured entirely by stable, non-removable eschar (Unstageable).

4. **VTE prophylaxis in post-operative patient** (Reduction of Risk Potential, dropdown_cloze, hard) — Day 1 post total knee arthroplasty. Four-slot cloze: priority action when the sequential compression device is found not applied {{1}} because {{2}}; if the client refuses pharmacologic prophylaxis (LMWH), nurse should {{3}} because {{4}}.

5. **Post-thoracentesis assessment** (Reduction of Risk Potential, fill_in_blank, medium) — After a thoracentesis for pleural effusion. Blank 1: primary early complication assessed by breath sounds and SpO₂ on the affected side (answer: pneumothorax). Blank 2: expected timing for the post-procedure chest radiograph (answer: within 1–4 hours; acceptable: 1 hour, 2 hours, 4 hours, up to 4 hours).

6. **Enteral tube feeding — tolerance monitoring** (Basic Care and Comfort, fill_in_blank, medium) — Client on continuous gastric tube feeding develops abdominal distension, nausea, and fullness. Blank 1: minimum gastric residual volume that should prompt holding the feeding and notifying the provider (per current evidence: 250 mL for two consecutive readings or 500 mL single reading — pick the most defensible threshold and state it clearly). Blank 2: minimum head-of-bed elevation during enteral feeding to reduce aspiration risk (30–45 degrees; acceptable: 30 degrees, 45 degrees).

7. **Bowel management for hospital-acquired constipation** (Basic Care and Comfort, ordered_response, easy) — Client day 3 post elective hip replacement has not had a bowel movement. Arrange five interventions from least invasive to most invasive: assess bowel history and contributing factors (opioids, diet, immobility); increase fluid intake and offer high-fiber foods as tolerated; promote ambulation as cleared by the surgical team; administer prescribed stool softener; administer prescribed stimulant laxative if no result after 24 hours.

8. **Peripheral IV phlebitis — VIP scale and response** (Basic Care and Comfort, matrix, medium) — Five peripheral IV site findings; classify each as "Continue IV and reassess per policy" or "Discontinue IV and restart at new site." Include a grade 0 finding (no signs), a grade 1 finding (faint erythema, mild pain), a grade 2 finding (marked pain with erythema and swelling), a grade 3 finding (palpable venous cord with erythema and swelling extending from the site), and a grade 4 finding (venous cord with purulent discharge at the insertion point).

9. **Post-operative urinary retention** (Basic Care and Comfort, dropdown_cloze, hard) — Client 6 hours post abdominal hysterectomy has not voided; bladder scan = 420 mL. Four-slot cloze: first nursing action {{1}} because {{2}}; if initial intervention fails and client still cannot void, nurse should {{3}} because {{4}}.

10. **Near-miss medication error — incident report sequence** (Management of Care, ordered_response, medium) — Wrong dose selected in automated dispenser; caught before administration. Sequence five actions: assess client and confirm no harm; complete an institutional incident/occurrence report in the safety reporting system; notify charge nurse and prescribing provider; document clinical assessment in the medical record (noting the incident report is NOT referenced in the chart note); participate in debrief or root-cause review if initiated by the manager.

## AVOID TOPICS

Do not write about: Mental Health Disorders, Prioritization & Delegation, Legal & Ethical Principles, Maternal-Newborn Care, Cardiovascular Disorders, Dosage Calculations, Medication Safety & Administration, Patient & Environment Safety.

Do not near-duplicate from recent batches: CAUTI prevention, restraint monitoring, TB/varicella/meningococcal/norovirus/scabies precautions, SBAR handoff, teach-back, colorectal/cervical/lung cancer screening, prediabetes lifestyle, osteoporosis prevention, physical activity counseling, anticipatory grief, caregiver strain, body image (colostomy/amputation), cultural humility, spiritual distress, sterile dressing change, dysphagia mealtime, oral care for xerostomia, non-pharmacological pain management, needlestick exposure, care conference coordination, critical result closed-loop communication.

Do not use the Braden Scale six-domain classification as row content for any matrix — a Braden matrix already exists in the bank.

## CONTENT REQUIREMENTS

- Follow the current NCSBN NCLEX-RN test plan and Next-Generation NCLEX clinical judgment style.
- Every item tests nursing judgment, not trivia.
- Distractors must be plausible and clinically meaningful — realistic misconceptions, unsafe actions, wrong prioritizations.
- `topic` must be a specific clinical topic string, not a category name.
- The correct answer must be defensible and unambiguous.
- Avoid trick wording; difficulty comes from clinical reasoning.
- For the incident-report item: frame this as a quality/safety reporting process — not a legal/ethical scenario about liability or malpractice.
- For the post-op urinary retention cloze: ensure the 420 mL bladder scan reading is referenced in the stem so the cloze answer is clinically grounded.

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

Pattern: `gpt_gap_jun12_<type_short>_<topic_slug>_01`

Type shorts: mc, sata, or, fib, matrix, cloze

Examples:
- `gpt_gap_jun12_or_transfusion_reaction_01`
- `gpt_gap_jun12_fib_drain_monitoring_01`
- `gpt_gap_jun12_matrix_pressure_injury_staging_01`

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
    "topic": "Reduction of Risk Potential / Basic Care and Comfort gap-fill",
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

### `ordered_response`
4–6 options representing all steps to sequence. `correct` lists every option id exactly once in correct order.

### `fill_in_blank`
No top-level `correct`. Use `blanks` array:
```json
"blanks": [
  { "id": "b1", "prompt": { "en": "...", "zh": "..." }, "acceptable": ["every", "valid", "string"], "numeric": { "value": 42, "tolerance": 0, "unit": "hours" } }
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
