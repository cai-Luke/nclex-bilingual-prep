# WBC / Platelet Prose Unit Inventory Report

## 1. Status

**Status:** COMPLETE

## 2. Snapshot

- **Branch:** main
- **HEAD:** abc26db55340832f960ecce8bb5b473d1523f339
- **Pre-existing changed paths:**
  - Modified:
    - `NCLEX-Question-Schema.md`
    - `PROJECT-HISTORY.md`
    - `lab-reference-range-verification-spec.md`
    - `package.json`
    - `src/visuals/kinds/lab_trend/defs.ts`
    - `src/visuals/kinds/lab_trend/index.ts`
    - `src/visuals/kinds/lab_trend/types.ts`
  - Untracked:
    - `CLAUDE-CASEPILOT-CD-HANDOFF-2026-07-19.md`
    - `GEMINI-WBC-PLATELET-PROSE-UNIT-INVENTORY-SPEC-2026-07-19.md`
    - `audit/lab-reference-range-verification-2026-07-19.md`
    - `scripts/tests/lab-trend-reference-bands.ts`
- **Newly created/modified paths attributable to this task:**
  - `audit/wbc-platelet-prose-unit-inventory-2026-07-19/manifest.jsonl`
  - `audit/wbc-platelet-prose-unit-inventory-2026-07-19/report.md`
- **Confirmation:** No unauthorized paths outside the audit subdirectory were created or modified during this execution.

## 3. Authority Read

We inspected:
1. `AGENTS.md`: Checked constitutional guidelines and constraints on static/offline builds.
2. `DECISIONS.md`: Reviewed the 2026-07-05 CBC-unit amendment (conventional-first + SI-in-parentheses).
3. `src/measurementUnitPolicy.ts`: Verified primary units are `×10³/µL` and secondary units are `×10⁹/L`.
4. `src/visuals/kinds/lab_trend/defs.ts`: Inspected registry definitions and teaching reference ranges.

Observed Policy:
- Canonical display format: primary `×10³/µL` and secondary `×10⁹/L` (optional parenthetical).
- Accepted raw units inside exhibits/source payload: `K/µL`, `/µL`, `/μL`, `/uL`, `/mcL`, `/mm3`, `/mm³`, `x 10^3/uL`, and `×10⁹/L`.

## 4. Coverage Proof

- **Bank files parsed:** 13
- **Top-level questions traversed:** 1942
- **Embedded sub-questions traversed:** 731
- **Total learner-facing strings examined:** 85930

## 5. Counts

### By Analyte
| Analyte | Occurrence Count |
|---|---|
| `platelets` | 188 |
| `wbc` | 146 |

### By Form Class
| Form Class | Occurrence Count |
|---|---|
| `ALTERNATE_SOURCE_FORM_PRIMARY` | 292 |
| `MISSING_OR_IMPLICIT_UNIT` | 33 |
| `NONCANONICAL_DUAL_DISPLAY` | 4 |
| `POSSIBLE_VALUE_UNIT_MISMATCH` | 2 |
| `CANONICAL_PRIMARY` | 2 |
| `UNRESOLVED_PARSE` | 1 |

### By Bank
| Bank Path | Occurrence Count |
|---|---|
| `banks/gpt-canonical.json` | 156 |
| `banks/hard-cases-canonical.json` | 114 |
| `banks/claude-canonical.json` | 36 |
| `banks/gemini-canonical.json` | 28 |

### By Surface
| Surface | Occurrence Count |
|---|---|
| `exhibit` | 240 |
| `stem` | 30 |
| `matrix` | 18 |
| `highlight` | 18 |
| `rationale` | 14 |
| `option` | 10 |
| `other` | 4 |

### By Language
| Language | Occurrence Count |
|---|---|
| `en` | 167 |
| `zh` | 167 |

## 6. High-Signal Evidence Queue

Every `POSSIBLE_VALUE_UNIT_MISMATCH`, bilingual `POSSIBLE_MISMATCH`, and `UNRESOLVED_PARSE` occurrence is logged below:


- **Bank Path:** `banks/claude-canonical.json`
  - **IDs:** Top-level: `opus20_case_cdiff_01` | Embedded: `opus20_case_cdiff_01_q6`
  - **JSON Path:** `questions[60].caseStudy.questions[5].testTakingStrategy.en`
  - **Matched Expression:** `WBC dropping from 18,200 to 12,400`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `Evaluate outcomes by looking at the trend, not just the absolute number. A WBC dropping from 18,200 to 12,400 is an improving trend, even if it has not yet reached the normal range (<10,000).`
  - **Notes:** Bilingual mismatch: EN "WBC dropping from 18,200 to 12,400" vs ZH "WBC 从 18,200 降至 12,400"


- **Bank Path:** `banks/claude-canonical.json`
  - **IDs:** Top-level: `opus20_case_cdiff_01` | Embedded: `opus20_case_cdiff_01_q6`
  - **JSON Path:** `questions[60].caseStudy.questions[5].testTakingStrategy.zh`
  - **Matched Expression:** `WBC 从 18,200 降至 12,400`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `通过观察趋势而不仅仅是绝对数值来评估结果。即使尚未达到正常范围（<10,000），WBC 从 18,200 降至 12,400 也是一种改善的趋势。`
  - **Notes:** Bilingual mismatch: EN "WBC 从 18,200 降至 12,400" vs ZH "WBC dropping from 18,200 to 12,400"


- **Bank Path:** `banks/gemini-canonical.json`
  - **IDs:** Top-level: `gemini_ppt_ngn_2026_06_22_q1` | Embedded: `null`
  - **JSON Path:** `questions[834].highlight.segments[5].en`
  - **Matched Expression:** `platelet count is 160,000/µL (reference range: 150,000-400,000/µL)`
  - **Form Class:** `POSSIBLE_VALUE_UNIT_MISMATCH` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `The platelet count is 160,000/µL (reference range: 150,000-400,000/µL).`
  - **Notes:** Mismatch: primary 160,000 /µL vs secondary 150,000-400,000 /µL; Bilingual mismatch: EN "platelet count is 160,000/µL (reference range: 150,000-400,000/µL)" vs ZH "血小板计数为 160,000/µL"


- **Bank Path:** `banks/gemini-canonical.json`
  - **IDs:** Top-level: `gemini_ppt_ngn_2026_06_22_q1` | Embedded: `null`
  - **JSON Path:** `questions[834].highlight.segments[5].zh`
  - **Matched Expression:** `血小板计数为 160,000/µL`
  - **Form Class:** `ALTERNATE_SOURCE_FORM_PRIMARY` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `血小板计数为 160,000/µL（参考范围：150,000-400,000/µL）。`
  - **Notes:** Bilingual mismatch: EN "血小板计数为 160,000/µL" vs ZH "platelet count is 160,000/µL (reference range: 150,000-400,000/µL)"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_case_lateral_incivility_01` | Embedded: `null`
  - **JSON Path:** `questions[302].caseStudy.exhibits[1].content.en`
  - **Matched Expression:** `WBC 7,200`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `1930 assessment: T 36.8 C, HR 78 regular, BP 152/88 left arm sitting, RR 16, SpO2 96% room air. Alert and oriented x4. Heart regular S1/S2, no S3 or murmur. Lungs clear. Trace bilateral pedal edema unchanged. Pain 0/10. Telemetry: normal sinus rhythm without ectopy. MAR: amlodipine 10 mg given at 1700; next amlodipine 0900 tomorrow. Lisinopril 20 mg given at 0900; next dose 0900 tomorrow. No PRN antihypertensive ordered. 0600 labs: Na 139, K 4.4, Cl 102, CO2 22, BUN 34, creatinine 1.6, eGFR 34, glucose 148, calcium 8.8, magnesium 1.9, phosphorus 4.2. CBC: WBC 7,200, Hgb 11.4, platelets 198,000. BNP 320, stable from 340. UA: no protein, no blood, specific gravity 1.018.`
  - **Notes:** Bilingual mismatch: EN "WBC 7,200" vs ZH "WBC 7,200"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_case_lateral_incivility_01` | Embedded: `null`
  - **JSON Path:** `questions[302].caseStudy.exhibits[1].content.en`
  - **Matched Expression:** `platelets 198,000`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `1930 assessment: T 36.8 C, HR 78 regular, BP 152/88 left arm sitting, RR 16, SpO2 96% room air. Alert and oriented x4. Heart regular S1/S2, no S3 or murmur. Lungs clear. Trace bilateral pedal edema unchanged. Pain 0/10. Telemetry: normal sinus rhythm without ectopy. MAR: amlodipine 10 mg given at 1700; next amlodipine 0900 tomorrow. Lisinopril 20 mg given at 0900; next dose 0900 tomorrow. No PRN antihypertensive ordered. 0600 labs: Na 139, K 4.4, Cl 102, CO2 22, BUN 34, creatinine 1.6, eGFR 34, glucose 148, calcium 8.8, magnesium 1.9, phosphorus 4.2. CBC: WBC 7,200, Hgb 11.4, platelets 198,000. BNP 320, stable from 340. UA: no protein, no blood, specific gravity 1.018.`
  - **Notes:** Bilingual mismatch: EN "platelets 198,000" vs ZH "血小板 198,000"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_case_lateral_incivility_01` | Embedded: `null`
  - **JSON Path:** `questions[302].caseStudy.exhibits[1].content.zh`
  - **Matched Expression:** `WBC 7,200`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `1930 评估：T 36.8 C，HR 78 次/分且规则，左臂坐位 BP 152/88，RR 16，室内空气 SpO2 96%。清醒，定向力 x4。心律规则，S1/S2，可未闻及 S3 或杂音。双肺清。双足轻度水肿，较入院无变化。疼痛 0/10。遥测：正常窦性心律，无异位搏动。MAR：1700 已给氨氯地平 10 mg；下一次为明日 0900。0900 已给赖诺普利 20 mg；下一次为明日 0900。未开立 PRN 降压药。0600 实验室：Na 139，K 4.4，Cl 102，CO2 22，BUN 34，肌酐 1.6，eGFR 34，葡萄糖 148，钙 8.8，镁 1.9，磷 4.2。CBC：WBC 7,200，Hgb 11.4，血小板 198,000。BNP 320，较 340 稳定。尿检：无蛋白、无血，尿比重 1.018。`
  - **Notes:** Bilingual mismatch: EN "WBC 7,200" vs ZH "WBC 7,200"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_case_lateral_incivility_01` | Embedded: `null`
  - **JSON Path:** `questions[302].caseStudy.exhibits[1].content.zh`
  - **Matched Expression:** `血小板 198,000`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `1930 评估：T 36.8 C，HR 78 次/分且规则，左臂坐位 BP 152/88，RR 16，室内空气 SpO2 96%。清醒，定向力 x4。心律规则，S1/S2，可未闻及 S3 或杂音。双肺清。双足轻度水肿，较入院无变化。疼痛 0/10。遥测：正常窦性心律，无异位搏动。MAR：1700 已给氨氯地平 10 mg；下一次为明日 0900。0900 已给赖诺普利 20 mg；下一次为明日 0900。未开立 PRN 降压药。0600 实验室：Na 139，K 4.4，Cl 102，CO2 22，BUN 34，肌酐 1.6，eGFR 34，葡萄糖 148，钙 8.8，镁 1.9，磷 4.2。CBC：WBC 7,200，Hgb 11.4，血小板 198,000。BNP 320，较 340 稳定。尿检：无蛋白、无血，尿比重 1.018。`
  - **Notes:** Bilingual mismatch: EN "血小板 198,000" vs ZH "platelets 198,000"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_case_neutropenic_fever_nadir_01` | Embedded: `null`
  - **JSON Path:** `questions[286].caseStudy.exhibits[1].content.en`
  - **Matched Expression:** `WBC 0.6`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `1415: client reports sudden cold, shaky feeling; visible rigors. Vitals: T 38.9 °C oral, HR 104, BP 108/68, RR 20, SpO₂ 96% room air. Skin warm/flushed over trunk; fingertips cool and slightly mottled; capillary refill 3 seconds. Mucous membranes dry with a small intact oral mucositis area on left buccal mucosa. Lungs clear. Abdomen soft, non-tender, normoactive bowel sounds. PICC site without erythema, drainage, or tenderness; dressing clean/dry/intact. Alert and oriented; feels awful. Urine output prior 4 hours: 180 mL. No perianal complaints; no rectal assessment performed. 1420 CBC: WBC 0.6 × 10³/µL, ANC 180/µL, Hgb 9.8 g/dL, platelets 112,000/µL. BMP: Na 137, K 3.9, Cl 101, CO₂ 24, BUN 18, creatinine 0.9, glucose 118. Lactate 1.4 mmol/L. UA clear, no WBCs or nitrites.`
  - **Notes:** Bilingual mismatch: EN "WBC 0.6" vs ZH "WBC 0.6"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_case_neutropenic_fever_nadir_01` | Embedded: `null`
  - **JSON Path:** `questions[286].caseStudy.exhibits[1].content.zh`
  - **Matched Expression:** `WBC 0.6`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `1415：患者报告突然觉得冷、发抖；可见寒战。生命体征：口温 38.9 °C，HR 104，BP 108/68，RR 20，室内空气 SpO₂ 96%。躯干皮肤温暖潮红；指尖发凉、轻度花斑；毛细血管再充盈 3 秒。黏膜干燥，左侧颊黏膜有一小处完整口腔黏膜炎。双肺清晰。腹部柔软、无压痛，肠鸣音正常。PICC 部位无红斑、渗液或压痛；敷料清洁、干燥、完整。神志清楚，定向力完整，自述感觉很糟。前 4 小时尿量 180 mL。无肛周不适，未进行直肠评估。1420 CBC：WBC 0.6 × 10³/µL，ANC 180/µL，Hgb 9.8 g/dL，血小板 112,000/µL。BMP：Na 137，K 3.9，Cl 101，CO₂ 24，BUN 18，肌酐 0.9，血糖 118。乳酸 1.4 mmol/L。尿检清亮，无 WBC、无亚硝酸盐。`
  - **Notes:** Bilingual mismatch: EN "WBC 0.6" vs ZH "WBC 0.6"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_case_neutropenic_fever_nadir_01` | Embedded: `gpt_case_neutropenic_fever_nadir_01_q1`
  - **JSON Path:** `questions[286].caseStudy.questions[0].highlight.segments[8].en`
  - **Matched Expression:** `WBC is 0.6`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `WBC is 0.6 × 10³/µL with ANC 180/µL during the expected chemotherapy nadir. `
  - **Notes:** Bilingual mismatch: EN "WBC is 0.6" vs ZH "WBC 为 0.6"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_case_neutropenic_fever_nadir_01` | Embedded: `gpt_case_neutropenic_fever_nadir_01_q1`
  - **JSON Path:** `questions[286].caseStudy.questions[0].highlight.segments[8].zh`
  - **Matched Expression:** `WBC 为 0.6`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `预期化疗低谷期内，WBC 为 0.6 × 10³/µL，ANC 为 180/µL。`
  - **Notes:** Bilingual mismatch: EN "WBC 为 0.6" vs ZH "WBC is 0.6"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_case_opus5_cdi_immunocompromised_01` | Embedded: `null`
  - **JSON Path:** `questions[220].caseStudy.stages[0].exhibits[2].content.en`
  - **Matched Expression:** `WBC 21,400/µL with 84% neutrophils and 6% bands (WBC was 8,200/µL two days ago)`
  - **Form Class:** `POSSIBLE_VALUE_UNIT_MISMATCH` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `Morning labs: WBC 21,400/µL with 84% neutrophils and 6% bands (WBC was 8,200/µL two days ago), hemoglobin 11.6 g/dL, platelets 204,000/µL, sodium 136 mEq/L, potassium 3.2 mEq/L (was 4.1 two days ago), chloride 98 mEq/L, bicarbonate 20 mEq/L, BUN 28 mg/dL, creatinine 1.4 mg/dL (baseline 1.1), eGFR 38 mL/min, glucose 142 mg/dL, lactate 1.6 mmol/L, albumin 2.4 g/dL, CRP 68 mg/L. Stool testing has not yet been ordered.`
  - **Notes:** Mismatch: primary 21,400 /µL vs secondary 8,200 /µL; Bilingual mismatch: EN "WBC 21,400/µL with 84% neutrophils and 6% bands (WBC was 8,200/µL two days ago)" vs ZH "WBC 21,400/µL"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_case_opus5_cdi_immunocompromised_01` | Embedded: `null`
  - **JSON Path:** `questions[220].caseStudy.stages[0].exhibits[2].content.zh`
  - **Matched Expression:** `WBC 21,400/µL`
  - **Form Class:** `ALTERNATE_SOURCE_FORM_PRIMARY` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `晨间实验室结果：WBC 21,400/µL，中性粒细胞 84%，杆状核 6%（2 天前 WBC 为 8,200/µL）；血红蛋白 11.6 g/dL；血小板 204,000/µL；钠 136 mEq/L；钾 3.2 mEq/L（2 天前 4.1）；氯 98 mEq/L；碳酸氢盐 20 mEq/L；BUN 28 mg/dL；肌酐 1.4 mg/dL（基线 1.1）；eGFR 38 mL/min；葡萄糖 142 mg/dL；乳酸 1.6 mmol/L；白蛋白 2.4 g/dL；CRP 68 mg/L。尚未开立粪便检测。`
  - **Notes:** Bilingual mismatch: EN "WBC 21,400/µL" vs ZH "WBC 21,400/µL with 84% neutrophils and 6% bands (WBC was 8,200/µL two days ago)"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_case_unsafe_premature_discharge_01` | Embedded: `null`
  - **JSON Path:** `questions[296].caseStudy.exhibits[1].content.en`
  - **Matched Expression:** `WBC 7.2`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `The client is fatigued and slightly short of breath while talking. Vital signs: T 36.8 C, HR 92 regular, BP 108/68, RR 22, SpO2 93% on room air. Weight today 78.2 kg; admission weight 84.6 kg; yesterday 79.0 kg. Fine crackles remain at the lung bases, trace bilateral pedal edema, no visible JVD at 45 degrees, warm/dry skin, capillary refill 2 seconds. She reports mild dizziness after sitting up to use the commode. No chest pain; alert and oriented. Labs: Na 138, K 3.4, Cl 96, CO2 30, BUN 38, creatinine 1.8 mg/dL (baseline outpatient 1.4; admission 1.6), glucose 142, BNP 680 pg/mL (admission 2,400; yesterday 820), Hgb 11.4, WBC 7.2, platelets 210, Mg 1.7, INR 1.0, albumin 3.0.`
  - **Notes:** Bilingual mismatch: EN "WBC 7.2" vs ZH "WBC 7.2"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_case_unsafe_premature_discharge_01` | Embedded: `null`
  - **JSON Path:** `questions[296].caseStudy.exhibits[1].content.en`
  - **Matched Expression:** `platelets 210`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `The client is fatigued and slightly short of breath while talking. Vital signs: T 36.8 C, HR 92 regular, BP 108/68, RR 22, SpO2 93% on room air. Weight today 78.2 kg; admission weight 84.6 kg; yesterday 79.0 kg. Fine crackles remain at the lung bases, trace bilateral pedal edema, no visible JVD at 45 degrees, warm/dry skin, capillary refill 2 seconds. She reports mild dizziness after sitting up to use the commode. No chest pain; alert and oriented. Labs: Na 138, K 3.4, Cl 96, CO2 30, BUN 38, creatinine 1.8 mg/dL (baseline outpatient 1.4; admission 1.6), glucose 142, BNP 680 pg/mL (admission 2,400; yesterday 820), Hgb 11.4, WBC 7.2, platelets 210, Mg 1.7, INR 1.0, albumin 3.0.`
  - **Notes:** Bilingual mismatch: EN "platelets 210" vs ZH "血小板 210"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_case_unsafe_premature_discharge_01` | Embedded: `null`
  - **JSON Path:** `questions[296].caseStudy.exhibits[1].content.zh`
  - **Matched Expression:** `WBC 7.2`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `患者疲惫，讲话时略感气短。生命体征：T 36.8 C，HR 92 次/分且规则，BP 108/68，RR 22 次/分，室内空气 SpO2 93%。今日体重 78.2 kg；入院 84.6 kg；昨日 79.0 kg。双肺底仍有细湿啰音，双足轻微水肿，45 度时无可见颈静脉怒张，皮肤温暖干燥，毛细血管再充盈 2 秒。她报告坐起使用便盆后有轻度头晕。无胸痛；意识清楚，定向力正常。实验室：Na 138，K 3.4，Cl 96，CO2 30，BUN 38，肌酐 1.8 mg/dL（门诊基线 1.4；入院 1.6），葡萄糖 142，BNP 680 pg/mL（入院 2,400；昨日 820），Hgb 11.4，WBC 7.2，血小板 210，Mg 1.7，INR 1.0，白蛋白 3.0。`
  - **Notes:** Bilingual mismatch: EN "WBC 7.2" vs ZH "WBC 7.2"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_case_unsafe_premature_discharge_01` | Embedded: `null`
  - **JSON Path:** `questions[296].caseStudy.exhibits[1].content.zh`
  - **Matched Expression:** `血小板 210`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `患者疲惫，讲话时略感气短。生命体征：T 36.8 C，HR 92 次/分且规则，BP 108/68，RR 22 次/分，室内空气 SpO2 93%。今日体重 78.2 kg；入院 84.6 kg；昨日 79.0 kg。双肺底仍有细湿啰音，双足轻微水肿，45 度时无可见颈静脉怒张，皮肤温暖干燥，毛细血管再充盈 2 秒。她报告坐起使用便盆后有轻度头晕。无胸痛；意识清楚，定向力正常。实验室：Na 138，K 3.4，Cl 96，CO2 30，BUN 38，肌酐 1.8 mg/dL（门诊基线 1.4；入院 1.6），葡萄糖 142，BNP 680 pg/mL（入院 2,400；昨日 820），Hgb 11.4，WBC 7.2，血小板 210，Mg 1.7，INR 1.0，白蛋白 3.0。`
  - **Notes:** Bilingual mismatch: EN "血小板 210" vs ZH "platelets 210"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_format10b_corrected_count_increment` | Embedded: `null`
  - **JSON Path:** `questions[705].rationale.byChoice[0].en`
  - **Matched Expression:** `Platelet increment = 32,000`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `Platelet increment = 32,000 − 8,000 = 24,000/µL. CCI = (24,000 × 1.8) ÷ 4.0 = 43,200 ÷ 4.0 = 10,800. The 30-minute value falls within the AABB 10- to 60-minute posttransfusion timing used for this calculation. A single CCI is arithmetic evidence only and does not by itself establish refractoriness.`
  - **Notes:** Bilingual mismatch: EN "Platelet increment = 32,000" vs ZH "血小板增量 = 32,000"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_format10b_corrected_count_increment` | Embedded: `null`
  - **JSON Path:** `questions[705].rationale.byChoice[0].zh`
  - **Matched Expression:** `血小板增量 = 32,000`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `血小板增量 = 32,000 − 8,000 = 24,000/µL。CCI =（24,000 × 1.8）÷ 4.0 = 43,200 ÷ 4.0 = 10,800。30 分钟结果位于 AABB 用于该计算的输注后 10–60 分钟时间窗内。单次 CCI 只是算术结果，本身不能确定输注无效。`
  - **Notes:** Bilingual mismatch: EN "血小板增量 = 32,000" vs ZH "Platelet increment = 32,000"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_format10b_corrected_count_increment` | Embedded: `null`
  - **JSON Path:** `questions[705].stem.en`
  - **Matched Expression:** `10¹¹ platelets`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `A client receives 4.0 × 10¹¹ platelets. The platelet count is 8,000/µL immediately before transfusion and 32,000/µL 30 minutes after transfusion. Body surface area is 1.8 m². Use the AABB convention: CCI = [(posttransfusion platelet count − pretransfusion platelet count) per µL × BSA in m²] ÷ platelets transfused in units of 10¹¹. Calculate the CCI and round to the nearest whole number. Enter the number only or the number followed by CCI. Do not diagnose platelet refractoriness from this single calculation.`
  - **Notes:** Bilingual mismatch: EN "10¹¹ platelets" vs ZH "10¹¹ 个血小板"


- **Bank Path:** `banks/gpt-canonical.json`
  - **IDs:** Top-level: `gpt_format10b_corrected_count_increment` | Embedded: `null`
  - **JSON Path:** `questions[705].stem.zh`
  - **Matched Expression:** `10¹¹ 个血小板`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `一名患者接受 4.0 × 10¹¹ 个血小板。输注前即刻血小板计数为 8,000/µL，输注后 30 分钟为 32,000/µL。体表面积为 1.8 m²。使用 AABB 约定：CCI =［（输注后血小板计数 − 输注前血小板计数，单位 /µL）× 体表面积 m²］÷ 以 10¹¹ 为单位的输注血小板数。计算 CCI，并四舍五入至最接近的整数。只输入数字或“数字 + CCI”。不要根据这一次计算诊断血小板输注无效。`
  - **Notes:** Bilingual mismatch: EN "10¹¹ 个血小板" vs ZH "10¹¹ platelets"


- **Bank Path:** `banks/hard-cases-canonical.json`
  - **IDs:** Top-level: `gpt_case_gbs_respiratory_compromise_01` | Embedded: `null`
  - **JSON Path:** `questions[52].caseStudy.exhibits[2].content.en`
  - **Matched Expression:** `WBC 3`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `CBC, BMP, magnesium, phosphorus, calcium, CRP, ESR, TSH, hepatic panel, urinalysis, and CK are unremarkable. MRI thoracic/lumbar spine shows no cord compression, epidural abscess, or transverse myelitis signal; mild cauda equina nerve-root enhancement is present. Lumbar puncture: opening pressure 14 cmH2O, CSF protein 98 mg/dL, CSF glucose 62 mg/dL with serum glucose 96 mg/dL, CSF WBC 3 cells/uL, CSF RBC 0, Gram stain negative. Baseline bedside pulmonary function: FVC 3.6 L (42 mL/kg; about 75% predicted) and MIP -62 cmH2O. Nerve conduction studies show prolonged distal motor latencies, reduced conduction velocities, conduction block, and prolonged F-wave latencies consistent with acute inflammatory demyelinating polyneuropathy.`
  - **Notes:** Bilingual mismatch: EN "WBC 3" vs ZH "白细胞3"


- **Bank Path:** `banks/hard-cases-canonical.json`
  - **IDs:** Top-level: `gpt_case_gbs_respiratory_compromise_01` | Embedded: `null`
  - **JSON Path:** `questions[52].caseStudy.exhibits[2].content.zh`
  - **Matched Expression:** `白细胞3`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `CBC、BMP、镁、磷、钙、CRP、ESR、TSH、肝功能、尿液分析和CK均无明显异常。胸腰椎MRI未见脊髓压迫、硬膜外脓肿或横贯性脊髓炎信号；可见轻度马尾神经根强化。腰穿：开放压14 cmH2O，CSF蛋白98 mg/dL，CSF葡萄糖62 mg/dL（血糖96 mg/dL），CSF白细胞3个/uL，CSF红细胞0，革兰染色阴性。基线床旁肺功能：FVC 3.6 L（42 mL/kg，约为预计值75%），MIP -62 cmH2O。神经传导检查显示远端运动潜伏期延长、传导速度降低、传导阻滞和F波潜伏期延长，符合急性炎性脱髓鞘性多发神经病。`
  - **Notes:** Bilingual mismatch: EN "白细胞3" vs ZH "WBC 3"


- **Bank Path:** `banks/hard-cases-canonical.json`
  - **IDs:** Top-level: `gpt_case_gbs_respiratory_compromise_01` | Embedded: `gpt_case_gbs_respiratory_compromise_01_q2`
  - **JSON Path:** `questions[52].caseStudy.questions[1].matrix.rows[0].en`
  - **Matched Expression:** `WBC 3`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `CSF protein 98 mg/dL with CSF WBC 3 cells/uL`
  - **Notes:** Bilingual mismatch: EN "WBC 3" vs ZH "白细胞3"


- **Bank Path:** `banks/hard-cases-canonical.json`
  - **IDs:** Top-level: `gpt_case_gbs_respiratory_compromise_01` | Embedded: `gpt_case_gbs_respiratory_compromise_01_q2`
  - **JSON Path:** `questions[52].caseStudy.questions[1].matrix.rows[0].zh`
  - **Matched Expression:** `白细胞3`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `CSF蛋白98 mg/dL，CSF白细胞3个/uL`
  - **Notes:** Bilingual mismatch: EN "白细胞3" vs ZH "WBC 3"


- **Bank Path:** `banks/hard-cases-canonical.json`
  - **IDs:** Top-level: `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01` | Embedded: `null`
  - **JSON Path:** `questions[56].caseStudy.stages[2].exhibits[0].content.en`
  - **Matched Expression:** `WBC 620`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `Overnight, the patient becomes confused and somnolent, opens eyes to voice, follows simple commands, believes he is at home, and develops asterixis. Vitals: HR 82, BP 108/66, RR 14, SpO2 97% room air, T 37.9 C. Hgb 7.6 g/dL is stable with no further hematemesis. Labs: creatinine 1.8 mg/dL, urine output 15 mL/hr, ammonia 124 µmol/L, lactate 1.8 mmol/L. Diagnostic paracentesis shows ascitic WBC 620 cells/µL with 78% neutrophils, absolute neutrophil count 484 cells/µL, and SAAG 1.3 g/dL. Orders include lactulose every 2 hours titrated to 3-4 bowel movements/day, rifaximin every 12 hours, holding diuretics, and urgent SBP evaluation/treatment reassessment.`
  - **Notes:** Bilingual mismatch: EN "WBC 620" vs ZH "WBC 620"


- **Bank Path:** `banks/hard-cases-canonical.json`
  - **IDs:** Top-level: `gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01` | Embedded: `null`
  - **JSON Path:** `questions[56].caseStudy.stages[2].exhibits[0].content.zh`
  - **Matched Expression:** `WBC 620`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `夜间患者出现意识混乱和嗜睡，对声音睁眼，可执行简单指令，但认为自己在家，并出现扑翼样震颤。生命体征：HR 82，BP 108/66，RR 14，室内空气SpO2 97%，T 37.9 C。Hgb 7.6 g/dL稳定，无再次呕血。化验：肌酐1.8 mg/dL，尿量15 mL/hr，氨124 µmol/L，乳酸1.8 mmol/L。诊断性腹腔穿刺显示腹水WBC 620 cells/µL，其中78%为中性粒细胞，绝对中性粒细胞计数484 cells/µL，SAAG 1.3 g/dL。医嘱包括乳果糖每2小时一次并滴定至每日3-4次排便、利福昔明每12小时一次、暂停利尿剂，以及紧急评估/重新评估SBP治疗。`
  - **Notes:** Bilingual mismatch: EN "WBC 620" vs ZH "WBC 620"


- **Bank Path:** `banks/hard-cases-canonical.json`
  - **IDs:** Top-level: `opus_car_t_crs_2026_06_11_case_01` | Embedded: `null`
  - **JSON Path:** `questions[38].caseStudy.exhibits[2].content.en`
  - **Matched Expression:** `WBC 0.3`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `Baseline labs drawn at 1000, two hours post-infusion:\nWBC 0.3 × 10³/µL\nANC 0.1 × 10³/µL\nHemoglobin 9.8 g/dL\nPlatelets 45,000/µL\nBUN 14 mg/dL\nCreatinine 0.9 mg/dL\nSodium 138 mEq/L\nPotassium 4.2 mEq/L\nChloride 102 mEq/L\nBicarbonate 24 mEq/L\nGlucose 148 mg/dL\nAST 28 U/L\nALT 32 U/L\nTotal bilirubin 0.8 mg/dL\nLDH 220 U/L\nCRP < 5 mg/L\nFerritin 320 ng/mL\nFibrinogen 310 mg/dL\nINR 1.0\nD-dimer 0.4 µg/mL FEU`
  - **Notes:** Bilingual mismatch: EN "WBC 0.3" vs ZH "白细胞计数 (WBC) 0.3"


- **Bank Path:** `banks/hard-cases-canonical.json`
  - **IDs:** Top-level: `opus_car_t_crs_2026_06_11_case_01` | Embedded: `null`
  - **JSON Path:** `questions[38].caseStudy.exhibits[2].content.zh`
  - **Matched Expression:** `白细胞计数 (WBC) 0.3`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `1000（输注后两小时）抽取的基线实验室检查结果：\n白细胞计数 (WBC) 0.3 × 10³/µL\n绝对中性粒细胞计数 (ANC) 0.1 × 10³/µL\n血红蛋白 9.8 g/dL\n血小板 45,000/µL\n血尿素氮 (BUN) 14 mg/dL\n肌酐 0.9 mg/dL\n钠 138 mEq/L\n钾 4.2 mEq/L\n氯化物 102 mEq/L\n碳酸氢盐 24 mEq/L\n葡萄糖 148 mg/dL\n谷草转氨酶 (AST) 28 U/L\n谷丙转氨酶 (ALT) 32 U/L\n总胆红素 0.8 mg/dL\n乳酸脱氢酶 (LDH) 220 U/L\nC 反应蛋白 (CRP) < 5 mg/L\n铁蛋白 320 ng/mL\n纤维蛋白原 310 mg/dL\n国际标准化比值 (INR) 1.0\nD-二聚体 0.4 µg/mL FEU`
  - **Notes:** Bilingual mismatch: EN "白细胞计数 (WBC) 0.3" vs ZH "WBC 0.3"


- **Bank Path:** `banks/hard-cases-canonical.json`
  - **IDs:** Top-level: `opus_icit_case_01` | Embedded: `null`
  - **JSON Path:** `questions[39].caseStudy.exhibits[0].content.en`
  - **Matched Expression:** `WBC 7.2`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `**ASSESSMENT FINDINGS**\nBaseline assessment on arrival: temperature 37.1 °C, heart rate 102 and regular, blood pressure 118/74, respiratory rate 20, SpO₂ 96% on room air. Heart sounds are present without murmur, rub, or gallop; lung fields are clear bilaterally. Abdomen is soft, mildly tender in the right upper quadrant on deep palpation, with no hepatomegaly appreciable at the costal margin. Skin shows faint residual erythema on the trunk from the prior rash; no new rash. Peripheral pulses are 2+ and symmetric; no peripheral edema. Telemetry at baseline shows sinus tachycardia at 102 beats per minute with normal P-wave morphology, PR interval 0.16 seconds, and QRS duration 0.09 seconds. The patient rates her chest heaviness as 3 out of 10 and states it is not pleuritic.\n\n**LABORATORY DATA**\nBaseline labs drawn this morning: WBC 7.2 × 10³/µL (differential: neutrophils 68%, lymphocytes 18%, monocytes 10%, eosinophils 4%), hemoglobin 11.8 g/dL, platelets 198 × 10³/µL, sodium 139 mEq/L, potassium 4.3 mEq/L, chloride 101 mEq/L, bicarbonate 24 mEq/L, BUN 16 mg/dL, creatinine 0.9 mg/dL, glucose 104 mg/dL, AST 88 U/L (normal up to 35), ALT 112 U/L (normal up to 40), alkaline phosphatase 95 U/L, total bilirubin 1.0 mg/dL, troponin I 0.18 ng/mL (normal < 0.04), BNP 245 pg/mL (normal < 100), CRP 3.8 mg/dL (normal < 0.5), TSH 2.1 mIU/L, LDH 310 U/L.`
  - **Notes:** Bilingual mismatch: EN "WBC 7.2" vs ZH "白细胞7.2"


- **Bank Path:** `banks/hard-cases-canonical.json`
  - **IDs:** Top-level: `opus_icit_case_01` | Embedded: `null`
  - **JSON Path:** `questions[39].caseStudy.exhibits[0].content.en`
  - **Matched Expression:** `platelets 198`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `**ASSESSMENT FINDINGS**\nBaseline assessment on arrival: temperature 37.1 °C, heart rate 102 and regular, blood pressure 118/74, respiratory rate 20, SpO₂ 96% on room air. Heart sounds are present without murmur, rub, or gallop; lung fields are clear bilaterally. Abdomen is soft, mildly tender in the right upper quadrant on deep palpation, with no hepatomegaly appreciable at the costal margin. Skin shows faint residual erythema on the trunk from the prior rash; no new rash. Peripheral pulses are 2+ and symmetric; no peripheral edema. Telemetry at baseline shows sinus tachycardia at 102 beats per minute with normal P-wave morphology, PR interval 0.16 seconds, and QRS duration 0.09 seconds. The patient rates her chest heaviness as 3 out of 10 and states it is not pleuritic.\n\n**LABORATORY DATA**\nBaseline labs drawn this morning: WBC 7.2 × 10³/µL (differential: neutrophils 68%, lymphocytes 18%, monocytes 10%, eosinophils 4%), hemoglobin 11.8 g/dL, platelets 198 × 10³/µL, sodium 139 mEq/L, potassium 4.3 mEq/L, chloride 101 mEq/L, bicarbonate 24 mEq/L, BUN 16 mg/dL, creatinine 0.9 mg/dL, glucose 104 mg/dL, AST 88 U/L (normal up to 35), ALT 112 U/L (normal up to 40), alkaline phosphatase 95 U/L, total bilirubin 1.0 mg/dL, troponin I 0.18 ng/mL (normal < 0.04), BNP 245 pg/mL (normal < 100), CRP 3.8 mg/dL (normal < 0.5), TSH 2.1 mIU/L, LDH 310 U/L.`
  - **Notes:** Bilingual mismatch: EN "platelets 198" vs ZH "血小板198"


- **Bank Path:** `banks/hard-cases-canonical.json`
  - **IDs:** Top-level: `opus_icit_case_01` | Embedded: `null`
  - **JSON Path:** `questions[39].caseStudy.exhibits[0].content.zh`
  - **Matched Expression:** `白细胞7.2`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `**评估发现**\n到达时的基线评估：体温37.1 °C，心率102次/分且规律，血压118/74 mmHg，呼吸频率20次/分，室内空气下SpO₂ 96%。心音存在，无杂音、摩擦音或奔马律；双侧肺野清晰。腹软，深触诊时右肋下有轻度压痛，肋缘下未触及肝肿大。皮肤显示躯干有既往皮疹留下的微弱残余红斑；无新发皮疹。外周搏动2+且对称；无外周水肿。基线心电监护显示窦性心动过速，心率102次/分，P波形态正常，PR间期0.16秒，QRS波时限0.09秒。患者对胸部沉重感的评分为3分（满分10分），并表示非胸膜炎性疼痛。\n\n**实验室数据**\n今晨抽取的基线实验室检查结果：白细胞7.2 × 10³/µL（分类：中性粒细胞68%，淋巴细胞18%，单核细胞10%，嗜酸性粒细胞4%），血红蛋白11.8 g/dL，血小板198 × 10³/µL，钠139 mEq/L，钾4.3 mEq/L，氯101 mEq/L，碳酸氢盐24 mEq/L，血尿素氮（BUN）16 mg/dL，肌酐0.9 mg/dL，葡萄糖104 mg/dL，AST 88 U/L（正常上限35），ALT 112 U/L（正常上限40），碱性磷酸酶95 U/L，总胆红素1.0 mg/dL，肌钙蛋白I 0.18 ng/mL（正常 < 0.04），BNP 245 pg/mL（正常 < 100），CRP 3.8 mg/dL（正常 < 0.5），TSH 2.1 mIU/L，LDH 310 U/L。`
  - **Notes:** Bilingual mismatch: EN "白细胞7.2" vs ZH "WBC 7.2"


- **Bank Path:** `banks/hard-cases-canonical.json`
  - **IDs:** Top-level: `opus_icit_case_01` | Embedded: `null`
  - **JSON Path:** `questions[39].caseStudy.exhibits[0].content.zh`
  - **Matched Expression:** `血小板198`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `**评估发现**\n到达时的基线评估：体温37.1 °C，心率102次/分且规律，血压118/74 mmHg，呼吸频率20次/分，室内空气下SpO₂ 96%。心音存在，无杂音、摩擦音或奔马律；双侧肺野清晰。腹软，深触诊时右肋下有轻度压痛，肋缘下未触及肝肿大。皮肤显示躯干有既往皮疹留下的微弱残余红斑；无新发皮疹。外周搏动2+且对称；无外周水肿。基线心电监护显示窦性心动过速，心率102次/分，P波形态正常，PR间期0.16秒，QRS波时限0.09秒。患者对胸部沉重感的评分为3分（满分10分），并表示非胸膜炎性疼痛。\n\n**实验室数据**\n今晨抽取的基线实验室检查结果：白细胞7.2 × 10³/µL（分类：中性粒细胞68%，淋巴细胞18%，单核细胞10%，嗜酸性粒细胞4%），血红蛋白11.8 g/dL，血小板198 × 10³/µL，钠139 mEq/L，钾4.3 mEq/L，氯101 mEq/L，碳酸氢盐24 mEq/L，血尿素氮（BUN）16 mg/dL，肌酐0.9 mg/dL，葡萄糖104 mg/dL，AST 88 U/L（正常上限35），ALT 112 U/L（正常上限40），碱性磷酸酶95 U/L，总胆红素1.0 mg/dL，肌钙蛋白I 0.18 ng/mL（正常 < 0.04），BNP 245 pg/mL（正常 < 100），CRP 3.8 mg/dL（正常 < 0.5），TSH 2.1 mIU/L，LDH 310 U/L。`
  - **Notes:** Bilingual mismatch: EN "血小板198" vs ZH "platelets 198"


- **Bank Path:** `banks/hard-cases-canonical.json`
  - **IDs:** Top-level: `opus_tpn_case_mucositis_01` | Embedded: `null`
  - **JSON Path:** `questions[40].caseStudy.exhibits[0].content.en`
  - **Matched Expression:** `WBC 0.3 × 10³/µL (ANC less than 100/µL)`
  - **Form Class:** `UNRESOLVED_PARSE` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `Baseline assessment at start of night shift: Temperature 38.9 °C (102.0 °F) orally (elevated from 37.2 °C twelve hours earlier), heart rate 112 and regular, blood pressure 96/58 (down from 118/72 earlier in the day), respiratory rate 22, SpO₂ 95% on room air. Weight is 64.2 kg, up 1.8 kg from admission weight of 62.4 kg. The patient is alert but appears fatigued and in significant distress from pain. Oral examination reveals confluent, deep ulcerations across the buccal mucosa, tongue, and soft palate with white-yellow pseudomembranes and areas of bleeding — consistent with World Health Organization grade IV mucositis. Lips are cracked and bleeding. Thick, ropy saliva pools in the oropharynx. The patient gags and winces when attempting to open her mouth fully. Skin is warm, flushed, and dry. The right upper arm PICC dressing is intact but the insertion site shows new erythema extending approximately 2 cm from the insertion point, with mild tenderness on palpation; no purulent drainage is visible, but the area was not erythematous at the previous dressing assessment 48 hours ago. Abdomen is soft, mildly distended, with hypoactive bowel sounds. No stool in 3 days. Peripheral edema is trace bilateral in the lower extremities. Urine output has been 120 mL over the last 8 hours (approximately 15 mL/hr), decreased from 40–50 mL/hr the day prior.\n\nBaseline labs drawn 6 hours prior to the nurse's shift: WBC 0.3 × 10³/µL (ANC less than 100/µL), hemoglobin 7.8 g/dL, platelets 18,000/µL, BUN 32 mg/dL, creatinine 1.6 mg/dL (up from baseline 1.3), sodium 138 mEq/L, potassium 3.2 mEq/L (low), chloride 101 mEq/L, bicarbonate 22 mEq/L, magnesium 1.4 mg/dL (low), phosphorus 2.8 mg/dL, calcium 8.0 mg/dL, albumin 2.1 g/dL (low), prealbumin 8 mg/dL (low, marking nutrition risk and inflammation alongside elevated CRP), blood glucose 268 mg/dL (elevated; was 312 mg/dL four hours before that), AST 42 U/L, ALT 38 U/L, total bilirubin 1.0 mg/dL, triglycerides 310 mg/dL (elevated), lactate 2.8 mmol/L (mildly elevated), C-reactive protein 14.2 mg/dL (elevated). Blood cultures were drawn from the PICC and peripherally at the time of the temperature spike but results are pending.`
  - **Notes:** Bilingual mismatch: EN "WBC 0.3 × 10³/µL (ANC less than 100/µL)" vs ZH "白细胞（WBC） 0.3"


- **Bank Path:** `banks/hard-cases-canonical.json`
  - **IDs:** Top-level: `opus_tpn_case_mucositis_01` | Embedded: `null`
  - **JSON Path:** `questions[40].caseStudy.exhibits[0].content.zh`
  - **Matched Expression:** `白细胞（WBC） 0.3`
  - **Form Class:** `MISSING_OR_IMPLICIT_UNIT` | **Parity Class:** `POSSIBLE_MISMATCH`
  - **Verbatim Text:** `夜班接班时的基线评估：口腔体温 38.9 °C（102.0 °F）（较12小时前的37.2 °C升高），心率 112 次/分且规律，血压 96/58 mmHg（较白天的118/72 mmHg下降），呼吸频率 22 次/分，室内空气下 SpO₂ 95%。体重 64.2 kg，较入院体重的 62.4 kg 增加了 1.8 kg。患者神志清醒，但显得疲乏且因疼痛而极其痛苦。口腔检查显示颊黏膜、舌和软腭有融合的深部溃疡，伴有黄白色假膜和出血区域——符合世界卫生组织（WHO）IV级黏膜炎的标准。嘴唇干裂出血。浓稠的绳状唾液在口咽部积聚。当尝试完全张口时，患者会恶心并退缩。皮肤温暖、潮红且干燥。右上臂PICC敷料完整，但穿刺部位周围出现向外延伸约 2 cm 的新发红斑，触诊有轻微压痛；未见脓性引流物，但在48小时前评估敷料时该区域并无红斑。腹部软，轻度膨隆，肠鸣音减弱。3天未排便。双下肢有极轻度的外周水肿。过去8小时尿量为 120 mL（约 15 mL/hr），较前一天的 40–50 mL/hr 减少。\n\n护士接班前6小时抽取的基线实验室检查结果：白细胞（WBC） 0.3 × 10³/µL（ANC 低于 100/µL），血红蛋白 7.8 g/dL，血小板 18,000/µL，血尿素氮（BUN） 32 mg/dL，肌酐 1.6 mg/dL（较基线 1.3 升高），钠 138 mEq/L，钾 3.2 mEq/L（偏低），氯 101 mEq/L，碳酸氢盐 22 mEq/L，镁 1.4 mg/dL（偏低），磷 2.8 mg/dL，钙 8.0 mg/dL，白蛋白 2.1 g/dL（偏低），前白蛋白 8 mg/dL（偏低，提示营养风险及伴随CRP升高的炎症状态），血糖 268 mg/dL（升高；4小时前为 312 mg/dL），AST 42 U/L，ALT 38 U/L，总胆红素 1.0 mg/dL，甘油三酯 310 mg/dL（升高），乳酸 2.8 mmol/L（轻度升高），C反应蛋白（CRP） 14.2 mg/dL（升高）。在体温飙升时已从PICC和外周抽取血培养，结果待回报。`
  - **Notes:** Bilingual mismatch: EN "白细胞（WBC） 0.3" vs ZH "WBC 0.3 × 10³/µL (ANC less than 100/µL)"


## 7. Presentation-Only Candidate Index

Index of all `ALTERNATE_SOURCE_FORM_PRIMARY`, `SI_PRIMARY_ONLY`, and `NONCANONICAL_DUAL_DISPLAY` rows, grouped by question:

- **banks/claude-canonical.json::opus_case_warfarin_bridge_01**
  - Path: `questions[61].caseStudy.exhibits[0].content.en` | Expression: `platelets 212,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[61].caseStudy.exhibits[0].content.zh` | Expression: `血小板 212,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/claude-canonical.json::opus_vanco_case_01**
  - Path: `questions[58].caseStudy.exhibits[1].content.en` | Expression: `WBC 14,800/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[58].caseStudy.exhibits[1].content.en` | Expression: `platelets 228,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[58].caseStudy.exhibits[1].content.zh` | Expression: `WBC 14,800/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[58].caseStudy.exhibits[1].content.zh` | Expression: `血小板 228,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[58].caseStudy.stages[1].exhibits[0].content.en` | Expression: `WBC 12,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[58].caseStudy.stages[1].exhibits[0].content.zh` | Expression: `WBC 12,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/claude-canonical.json::opus1_case_tha_discharge_lep_01**
  - Path: `questions[59].caseStudy.exhibits[0].content.en` | Expression: `WBC 9,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[59].caseStudy.exhibits[0].content.en` | Expression: `platelets 198,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[59].caseStudy.exhibits[0].content.zh` | Expression: `白细胞9,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[59].caseStudy.exhibits[0].content.zh` | Expression: `血小板198,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/claude-canonical.json::opus2_case_code_status_01**
  - Path: `questions[57].caseStudy.exhibits[0].content.en` | Expression: `WBC: 3,800/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[57].caseStudy.exhibits[0].content.en` | Expression: `Platelets: 112,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[57].caseStudy.exhibits[0].content.zh` | Expression: `白细胞：3,800/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[57].caseStudy.exhibits[0].content.zh` | Expression: `血小板：112,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/claude-canonical.json::opus20_case_cdiff_01**
  - Path: `questions[60].caseStudy.exhibits[0].content.en` | Expression: `WBC 18,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[60].caseStudy.exhibits[0].content.en` | Expression: `platelets 210,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[60].caseStudy.exhibits[0].content.zh` | Expression: `WBC 18,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[60].caseStudy.exhibits[0].content.zh` | Expression: `血小板 210,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[60].caseStudy.stages[2].exhibits[0].content.en` | Expression: `WBC 12,400/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[60].caseStudy.stages[2].exhibits[0].content.zh` | Expression: `WBC 12,400/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/claude-canonical.json::opus20_case_cdiff_01::opus20_case_cdiff_01_q6**
  - Path: `questions[60].caseStudy.questions[5].matrix.rows[1].en` | Expression: `White blood cell (WBC) count decreasing from 18,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[60].caseStudy.questions[5].matrix.rows[1].zh` | Expression: `白细胞 (WBC) 计数从 18,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/claude-canonical.json::opus25_case_tb_airborne_treatment_monitoring_01**
  - Path: `questions[64].caseStudy.exhibits[2].content.en` | Expression: `WBC 11,200/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[64].caseStudy.exhibits[2].content.en` | Expression: `platelets 410,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[64].caseStudy.exhibits[2].content.zh` | Expression: `WBC 11,200/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[64].caseStudy.exhibits[2].content.zh` | Expression: `血小板410,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/claude-canonical.json::opus26_case_refeeding_syndrome_01**
  - Path: `questions[65].caseStudy.exhibits[1].content.en` | Expression: `WBC 3,200/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[65].caseStudy.exhibits[1].content.en` | Expression: `platelets 130,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[65].caseStudy.exhibits[1].content.zh` | Expression: `WBC 3,200/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[65].caseStudy.exhibits[1].content.zh` | Expression: `血小板130,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/claude-canonical.json::opus27_case_ipv_prenatal_care_01**
  - Path: `questions[66].caseStudy.exhibits[1].content.en` | Expression: `platelets 218,000/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[66].caseStudy.exhibits[1].content.zh` | Expression: `血小板218,000/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gemini-canonical.json::gemini_b2_09**
  - Path: `questions[203].options[0].en` | Expression: `White blood cell (WBC) count of 2,800/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[203].options[0].zh` | Expression: `白细胞 (WBC) 计数 2,800/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gemini-canonical.json::gemini_backfill_bt_medsafe_05**
  - Path: `questions[791].rationale.byChoice[6].en` | Expression: `platelet count has recovered to at least 150,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[791].rationale.byChoice[6].zh` | Expression: `血小板计数恢复至至少 150,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[791].stem.en` | Expression: `platelet count has decreased from a baseline of 280,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[791].stem.zh` | Expression: `血小板计数已从 280,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gemini-canonical.json::gemini_c10_02**
  - Path: `questions[286].matrix.rows[1].en` | Expression: `Platelet count of 88,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[286].matrix.rows[1].zh` | Expression: `血小板计数为 88,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[286].rationale.byChoice[1].en` | Expression: `Platelets <100,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[286].rationale.byChoice[1].zh` | Expression: `血小板 <100,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gemini-canonical.json::gemini_hl_pharm_anticoag_10**
  - Path: `questions[784].highlight.segments[2].en` | Expression: `platelet count is 60,000/mm3 (60 x 10^9/L)` | Class: `NONCANONICAL_DUAL_DISPLAY`
  - Path: `questions[784].highlight.segments[2].zh` | Expression: `血小板计数为 60,000/mm3 (60 x 10^9/L)` | Class: `NONCANONICAL_DUAL_DISPLAY`
- **banks/gemini-canonical.json::gemini_ppt_ngn_2026_06_22_q1**
  - Path: `questions[834].highlight.segments[5].zh` | Expression: `血小板计数为 160,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gemini-canonical.json::gemini_u5_fib_or_2026_06_09_fib_anc_03**
  - Path: `questions[749].stem.en` | Expression: `white blood cell (WBC) count is 4,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[749].stem.zh` | Expression: `白细胞（WBC）计数为 4,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gemini-canonical.json::gen_rrp_batch2_05**
  - Path: `questions[610].matrix.rows[3].en` | Expression: `WBC Count: 8,500/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[610].matrix.rows[3].zh` | Expression: `白细胞计数：8,500/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gemini-canonical.json::gen_rrp_batch2_09**
  - Path: `questions[613].stem.en` | Expression: `platelet count of 45,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[613].stem.zh` | Expression: `血小板计数为 45,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gemini-canonical.json::opus_agvd_case_agvhd_01**
  - Path: `questions[768].caseStudy.exhibits[1].content.en` | Expression: `White blood cell count: 3,800/μL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[768].caseStudy.exhibits[1].content.en` | Expression: `Platelets: 42,000/μL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[768].caseStudy.exhibits[1].content.zh` | Expression: `白细胞计数：3,800/μL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[768].caseStudy.exhibits[1].content.zh` | Expression: `血小板：42,000/μL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gemini-canonical.json::trad_batchD_02**
  - Path: `questions[546].options[3].en` | Expression: `Platelet count of 95,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[546].options[3].zh` | Expression: `血小板计数 95,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_2026_06_13_case_delirium_uti_01**
  - Path: `questions[265].caseStudy.exhibits[1].content.en` | Expression: `WBC 14,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[265].caseStudy.exhibits[1].content.en` | Expression: `platelets 210,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[265].caseStudy.exhibits[1].content.zh` | Expression: `白细胞14,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[265].caseStudy.exhibits[1].content.zh` | Expression: `血小板210,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[265].caseStudy.stages[1].exhibits[0].content.en` | Expression: `WBC 12,800/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[265].caseStudy.stages[1].exhibits[0].content.zh` | Expression: `白细胞12,800/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[265].caseStudy.stages[2].exhibits[0].content.en` | Expression: `WBC 10,400/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[265].caseStudy.stages[2].exhibits[0].content.zh` | Expression: `白细胞10,400/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_2026_06_13_case_delirium_uti_01::gpt_2026_06_13_case_delirium_uti_01_q4**
  - Path: `questions[265].caseStudy.questions[3].matrix.rows[2].en` | Expression: `WBC decreases from 14,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[265].caseStudy.questions[3].matrix.rows[2].zh` | Expression: `白细胞从14,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_2026_06_16_case_postpartum_preeclampsia_severe_01**
  - Path: `questions[278].caseStudy.exhibits[1].content.en` | Expression: `platelets 238,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[278].caseStudy.exhibits[1].content.zh` | Expression: `血小板 238,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[278].caseStudy.stages[1].exhibits[1].content.en` | Expression: `platelets 195,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[278].caseStudy.stages[1].exhibits[1].content.zh` | Expression: `血小板 195,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_2026_06_16_case_postpartum_preeclampsia_severe_01_bowtie**
  - Path: `questions[279].stem.en` | Expression: `platelets 195,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[279].stem.zh` | Expression: `血小板 195,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_2026_06_19_case_ici_pneumonitis_01**
  - Path: `questions[284].caseStudy.exhibits[2].content.en` | Expression: `platelets 188,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[284].caseStudy.exhibits[2].content.zh` | Expression: `血小板188,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_acute_hemolytic_transfusion_reaction_01**
  - Path: `questions[280].caseStudy.exhibits[0].content.en` | Expression: `WBC 7,800/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[280].caseStudy.exhibits[0].content.en` | Expression: `platelets 218,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[280].caseStudy.exhibits[0].content.zh` | Expression: `WBC 7,800/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[280].caseStudy.exhibits[0].content.zh` | Expression: `血小板 218,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[280].caseStudy.stages[1].exhibits[0].content.en` | Expression: `platelets 104,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[280].caseStudy.stages[1].exhibits[0].content.zh` | Expression: `血小板 104,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[280].caseStudy.stages[2].exhibits[0].content.en` | Expression: `platelets 78,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[280].caseStudy.stages[2].exhibits[0].content.zh` | Expression: `血小板 78,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_acute_hemolytic_transfusion_reaction_01_bowtie**
  - Path: `questions[281].stem.en` | Expression: `platelets 104,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[281].stem.zh` | Expression: `血小板 104,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_caregiver_role_strain_dementia_01**
  - Path: `questions[344].caseStudy.exhibits[1].content.en` | Expression: `WBC 6,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[344].caseStudy.exhibits[1].content.en` | Expression: `platelets 210,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[344].caseStudy.exhibits[1].content.zh` | Expression: `WBC 6,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[344].caseStudy.exhibits[1].content.zh` | Expression: `血小板210,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_client_advocacy_refusal_01**
  - Path: `questions[300].caseStudy.exhibits[0].content.en` | Expression: `WBC 6,200/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[300].caseStudy.exhibits[0].content.en` | Expression: `platelets 188,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[300].caseStudy.exhibits[0].content.zh` | Expression: `WBC 6,200/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[300].caseStudy.exhibits[0].content.zh` | Expression: `血小板 188,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_clozapine_toxicity_01**
  - Path: `questions[304].caseStudy.exhibits[0].content.en` | Expression: `WBC 7,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[304].caseStudy.exhibits[0].content.en` | Expression: `platelets 238,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[304].caseStudy.exhibits[0].content.zh` | Expression: `WBC 7,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[304].caseStudy.exhibits[0].content.zh` | Expression: `血小板 238,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[304].caseStudy.stages[0].exhibits[0].content.en` | Expression: `WBC 6,800/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[304].caseStudy.stages[0].exhibits[0].content.zh` | Expression: `WBC 6,800/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[304].caseStudy.stages[1].exhibits[0].content.en` | Expression: `WBC 3,100/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[304].caseStudy.stages[1].exhibits[0].content.en` | Expression: `platelets 210,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[304].caseStudy.stages[1].exhibits[0].content.zh` | Expression: `WBC 3,100/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[304].caseStudy.stages[1].exhibits[0].content.zh` | Expression: `血小板 210,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_gap_2026_06_11_case_anticoag_bleeding_06**
  - Path: `questions[189].caseStudy.exhibits[0].content.en` | Expression: `platelet count was 226,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[189].caseStudy.exhibits[0].content.zh` | Expression: `血小板226,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[189].caseStudy.exhibits[1].content.en` | Expression: `platelet count 154,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[189].caseStudy.exhibits[1].content.zh` | Expression: `血小板154,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[189].caseStudy.stages[0].exhibits[0].content.en` | Expression: `platelet count 96,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[189].caseStudy.stages[0].exhibits[0].content.zh` | Expression: `血小板96,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_gap_2026_06_11_case_anticoag_bleeding_06::gpt_case_gap_2026_06_11_anticoag_fib_04**
  - Path: `questions[189].caseStudy.questions[3].stem.en` | Expression: `platelet count from baseline 226,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[189].caseStudy.questions[3].stem.zh` | Expression: `血小板从基线226,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_gap_2026_06_11_case_anticoag_bleeding_06::gpt_case_gap_2026_06_11_anticoag_matrix_01**
  - Path: `questions[189].caseStudy.questions[0].matrix.rows[2].en` | Expression: `Platelet count decreased from 226,000 to 154,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[189].caseStudy.questions[0].matrix.rows[2].zh` | Expression: `血小板由226,000降至154,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_gap_2026_06_11_case_pancreatitis_03**
  - Path: `questions[186].caseStudy.exhibits[1].content.en` | Expression: `WBC 18,500/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[186].caseStudy.exhibits[1].content.zh` | Expression: `WBC 18,500/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_gap_2026_06_11_case_tls_01**
  - Path: `questions[183].caseStudy.exhibits[0].content.en` | Expression: `WBC 48,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[183].caseStudy.exhibits[0].content.en` | Expression: `platelets 98,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[183].caseStudy.exhibits[0].content.zh` | Expression: `WBC 48,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[183].caseStudy.exhibits[0].content.zh` | Expression: `血小板 98,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_gap_2026_06_11_case_urosepsis_05**
  - Path: `questions[188].caseStudy.exhibits[1].content.en` | Expression: `WBC 22,400/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[188].caseStudy.exhibits[1].content.zh` | Expression: `WBC 22,400/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_neutropenic_fever_nadir_01**
  - Path: `questions[286].caseStudy.exhibits[1].content.en` | Expression: `platelets 112,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[286].caseStudy.exhibits[1].content.zh` | Expression: `血小板 112,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_nurse_provider_conflict_01**
  - Path: `questions[298].caseStudy.exhibits[0].content.en` | Expression: `WBC 9,200/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[298].caseStudy.exhibits[0].content.en` | Expression: `platelets 188,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[298].caseStudy.exhibits[0].content.zh` | Expression: `WBC 9,200/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[298].caseStudy.exhibits[0].content.zh` | Expression: `血小板 188,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_opus23_nat_toddler_01**
  - Path: `questions[266].caseStudy.exhibits[1].content.en` | Expression: `WBC 9,800/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[266].caseStudy.exhibits[1].content.en` | Expression: `platelets 312,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[266].caseStudy.exhibits[1].content.zh` | Expression: `WBC 9,800/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[266].caseStudy.exhibits[1].content.zh` | Expression: `血小板312,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_opus5_cdi_immunocompromised_01**
  - Path: `questions[220].caseStudy.stages[0].exhibits[2].content.en` | Expression: `platelets 204,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[220].caseStudy.stages[0].exhibits[2].content.zh` | Expression: `WBC 21,400/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[220].caseStudy.stages[0].exhibits[2].content.zh` | Expression: `血小板 204,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[220].caseStudy.stages[1].exhibits[0].content.en` | Expression: `WBC 18,600/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[220].caseStudy.stages[1].exhibits[0].content.zh` | Expression: `WBC 18,600/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[220].caseStudy.stages[2].exhibits[0].content.en` | Expression: `WBC 11,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[220].caseStudy.stages[2].exhibits[0].content.zh` | Expression: `WBC 11,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_opus5_cdi_immunocompromised_01::gpt_case_opus5_cdi_immunocompromised_01_q4**
  - Path: `questions[220].caseStudy.questions[3].matrix.rows[2].en` | Expression: `WBC decreases from 21,400/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[220].caseStudy.questions[3].matrix.rows[2].zh` | Expression: `WBC 从 21,400/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_pressure_injury_prevention_mobility_01**
  - Path: `questions[354].caseStudy.exhibits[1].content.en` | Expression: `WBC 9,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[354].caseStudy.exhibits[1].content.en` | Expression: `platelets 198,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[354].caseStudy.exhibits[1].content.zh` | Expression: `WBC 9,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[354].caseStudy.exhibits[1].content.zh` | Expression: `血小板198,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_refeeding_syndrome_tpn_01**
  - Path: `questions[306].caseStudy.exhibits[0].content.en` | Expression: `WBC 9,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[306].caseStudy.exhibits[0].content.en` | Expression: `platelets 210,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[306].caseStudy.exhibits[0].content.zh` | Expression: `WBC 9,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[306].caseStudy.exhibits[0].content.zh` | Expression: `血小板 210,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_svc_syndrome_01**
  - Path: `questions[282].caseStudy.exhibits[0].content.en` | Expression: `WBC 11,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[282].caseStudy.exhibits[0].content.en` | Expression: `platelets 268,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[282].caseStudy.exhibits[0].content.zh` | Expression: `WBC 11,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[282].caseStudy.exhibits[0].content.zh` | Expression: `血小板268,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_taco_vs_trali_01**
  - Path: `questions[288].caseStudy.exhibits[1].content.en` | Expression: `WBC 7,200/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[288].caseStudy.exhibits[1].content.en` | Expression: `platelets 188,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[288].caseStudy.exhibits[1].content.zh` | Expression: `WBC 7,200/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[288].caseStudy.exhibits[1].content.zh` | Expression: `血小板188,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_case_warfarin_mvr_2026_06_11_01**
  - Path: `questions[221].caseStudy.exhibits[1].content.en` | Expression: `platelets 188,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[221].caseStudy.exhibits[1].content.zh` | Expression: `血小板188,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[221].caseStudy.stages[2].exhibits[0].content.en` | Expression: `platelets 174,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[221].caseStudy.stages[2].exhibits[0].content.zh` | Expression: `血小板174,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_deepen_2026_06_22_b_rrp_01**
  - Path: `questions[460].highlight.segments[0].en` | Expression: `WBC 7,800/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[460].highlight.segments[0].zh` | Expression: `白细胞 7,800/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[460].highlight.segments[2].en` | Expression: `Platelets 146,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[460].highlight.segments[2].zh` | Expression: `血小板 146,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[460].rationale.byChoice[2].en` | Expression: `platelet count is well above the stated <50,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[460].rationale.byChoice[2].zh` | Expression: `血小板计数明显高于题干规定的 <50,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[460].stem.en` | Expression: `platelets <50,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[460].stem.zh` | Expression: `血小板 <50,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_deepen_2026_06_22_b_rrp_04**
  - Path: `questions[463].highlight.segments[0].en` | Expression: `WBC 10,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[463].highlight.segments[0].zh` | Expression: `白细胞 10,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_deepen_2026_06_22_bow_02**
  - Path: `questions[391].stem.en` | Expression: `platelet count has decreased from 248,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[391].stem.zh` | Expression: `血小板计数从入院时 248,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_deepen_2026_06_23_bow_02**
  - Path: `questions[478].stem.en` | Expression: `platelets 48,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[478].stem.zh` | Expression: `血小板 48,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_deepen_2026_06_23_bow_10**
  - Path: `questions[486].stem.en` | Expression: `Platelets are 210,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[486].stem.zh` | Expression: `血小板 210,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_format10a_postpartum_preeclampsia_severe_features**
  - Path: `questions[700].stem.en` | Expression: `platelets are 88,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[700].stem.zh` | Expression: `血小板为 88,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_format11a_immune_ttp**
  - Path: `questions[755].stem.en` | Expression: `Platelet count is 16,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[755].stem.zh` | Expression: `血小板计数 16,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_format11b_giant_cell_arteritis_cues**
  - Path: `questions[759].highlight.segments[5].en` | Expression: `platelet count is 520,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[759].highlight.segments[5].zh` | Expression: `血小板计数 520,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_fresh_2026_06_22_pharm_08**
  - Path: `questions[373].clozeStem.en` | Expression: `platelet count decreased from 228,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[373].clozeStem.zh` | Expression: `血小板计数从基线 228,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_opus21_case_colostomy_lep_discharge_01**
  - Path: `questions[267].caseStudy.exhibits[0].content.en` | Expression: `WBC 9,800/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[267].caseStudy.exhibits[0].content.en` | Expression: `platelets 268,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[267].caseStudy.exhibits[0].content.zh` | Expression: `WBC 9,800/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[267].caseStudy.exhibits[0].content.zh` | Expression: `血小板268,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_pharm_easy_medium_2026_06_21_b_highlight_gentamicin_toxicity_08**
  - Path: `questions[339].highlight.segments[4].en` | Expression: `White blood cell count decreased from 16,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[339].highlight.segments[4].zh` | Expression: `白细胞计数从 16,000/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::gpt_u6_matrix_cloze_2026_06_09_matrix_heparin_safety_11**
  - Path: `questions[132].matrix.rows[1].en` | Expression: `Platelet count decreased from 240,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[132].matrix.rows[1].zh` | Expression: `血小板从 240,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/gpt-canonical.json::mc_potassium_preop_notify_021**
  - Path: `questions[20].options[3].en` | Expression: `Platelets 250,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[20].options[3].zh` | Expression: `血小板 250,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::case_preeclampsia_magnesium_01**
  - Path: `questions[1].caseStudy.exhibits[1].content.en` | Expression: `Platelets: 92,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[1].caseStudy.exhibits[1].content.zh` | Expression: `血小板：92,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::case_preeclampsia_magnesium_01::preeclampsia_severe_features_sata**
  - Path: `questions[1].caseStudy.questions[0].options[4].en` | Expression: `Platelet count 92,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[1].caseStudy.questions[0].options[4].zh` | Expression: `血小板92,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[1].caseStudy.questions[0].rationale.byChoice[2].en` | Expression: `Platelets below 100,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[1].caseStudy.questions[0].rationale.byChoice[2].zh` | Expression: `血小板低于100,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::case_sepsis_pneumonia_01**
  - Path: `questions[0].caseStudy.exhibits[1].content.en` | Expression: `WBC 18,400/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[0].caseStudy.exhibits[1].content.zh` | Expression: `白细胞18,400/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::claude_cs_jun06_cdiff_sic_01**
  - Path: `questions[30].caseStudy.exhibits[0].content.en` | Expression: `WBC 14,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[30].caseStudy.exhibits[0].content.zh` | Expression: `白细胞14,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::cs_ngn_007_dic**
  - Path: `questions[24].caseStudy.exhibits[0].content.en` | Expression: `Platelets: 45,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[24].caseStudy.exhibits[0].content.zh` | Expression: `血小板：45,000/mm3` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::cs_sepsis_shock_01**
  - Path: `questions[36].caseStudy.stages[0].exhibits[0].content.en` | Expression: `White Blood Cell (WBC) Count: 18,500/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[36].caseStudy.stages[0].exhibits[0].content.zh` | Expression: `白细胞（WBC）计数：18,500/mm³` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::cs_thyroid_storm_main::cs_thyroid_storm_q4**
  - Path: `questions[33].caseStudy.questions[3].options[2].en` | Expression: `White blood cell count of 2,800/mm³ (2.8 × 10^9/L)` | Class: `NONCANONICAL_DUAL_DISPLAY`
  - Path: `questions[33].caseStudy.questions[3].options[2].zh` | Expression: `白细胞计数 2,800/mm³ (2.8 × 10^9/L)` | Class: `NONCANONICAL_DUAL_DISPLAY`
- **banks/hard-cases-canonical.json::gpt_case_aki_2026_06_16_case_prerenal_aki_hyperkalemia_01**
  - Path: `questions[64].caseStudy.exhibits[2].content.en` | Expression: `WBC 11,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[64].caseStudy.exhibits[2].content.en` | Expression: `platelets 210,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[64].caseStudy.exhibits[2].content.zh` | Expression: `WBC 11,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[64].caseStudy.exhibits[2].content.zh` | Expression: `血小板 210,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::gpt_case_gallstone_pancreatitis_01**
  - Path: `questions[50].caseStudy.exhibits[2].content.en` | Expression: `WBC 14,500/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[50].caseStudy.exhibits[2].content.en` | Expression: `platelets 238,000/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[50].caseStudy.exhibits[2].content.zh` | Expression: `WBC 14,500/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[50].caseStudy.exhibits[2].content.zh` | Expression: `血小板 238,000/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[50].caseStudy.stages[1].exhibits[0].content.en` | Expression: `WBC 19,200/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[50].caseStudy.stages[1].exhibits[0].content.zh` | Expression: `WBC 19,200/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[50].caseStudy.stages[2].exhibits[0].content.en` | Expression: `WBC 11,800/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[50].caseStudy.stages[2].exhibits[0].content.zh` | Expression: `WBC 11,800/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::gpt_case_gallstone_pancreatitis_01::gpt_case_gallstone_pancreatitis_01_q1**
  - Path: `questions[50].caseStudy.questions[0].matrix.rows[5].en` | Expression: `WBC 14,500/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[50].caseStudy.questions[0].matrix.rows[5].zh` | Expression: `WBC 14,500/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::gpt_case_gallstone_pancreatitis_01_bowtie**
  - Path: `questions[51].stem.en` | Expression: `WBC 19,200/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[51].stem.zh` | Expression: `WBC 19,200/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::gpt_case_major_burn_inhalation_fluid_creep_01**
  - Path: `questions[48].caseStudy.exhibits[2].content.en` | Expression: `WBC 14,200/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[48].caseStudy.exhibits[2].content.en` | Expression: `platelets 210,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[48].caseStudy.exhibits[2].content.zh` | Expression: `白细胞14,200/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[48].caseStudy.exhibits[2].content.zh` | Expression: `血小板210,000/uL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::gpt_case_pe_2026_06_16_case_pulmonary_embolism_01**
  - Path: `questions[54].caseStudy.exhibits[1].content.en` | Expression: `WBC 11,200/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[54].caseStudy.exhibits[1].content.en` | Expression: `platelets 198,000/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[54].caseStudy.exhibits[1].content.zh` | Expression: `WBC 11,200/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[54].caseStudy.exhibits[1].content.zh` | Expression: `血小板198,000/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[54].caseStudy.stages[1].exhibits[0].content.en` | Expression: `platelets 192,000/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[54].caseStudy.stages[1].exhibits[0].content.zh` | Expression: `血小板192,000/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01**
  - Path: `questions[56].caseStudy.exhibits[2].content.en` | Expression: `WBC 6,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[56].caseStudy.exhibits[2].content.en` | Expression: `platelets 72,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[56].caseStudy.exhibits[2].content.zh` | Expression: `WBC 6,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[56].caseStudy.exhibits[2].content.zh` | Expression: `血小板72,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[56].caseStudy.stages[1].exhibits[0].content.en` | Expression: `platelets 68,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[56].caseStudy.stages[1].exhibits[0].content.zh` | Expression: `血小板68,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01::gpt_case_variceal_hemorrhage_cirrhosis_2026_06_16_01_q1**
  - Path: `questions[56].caseStudy.questions[0].highlight.segments[13].en` | Expression: `Platelets 72,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[56].caseStudy.questions[0].highlight.segments[13].zh` | Expression: `血小板72,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[56].caseStudy.questions[0].rationale.byChoice[13].en` | Expression: `Platelets 72,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[56].caseStudy.questions[0].rationale.byChoice[13].zh` | Expression: `血小板72,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::gpt_pph_2026_06_16_case_01**
  - Path: `questions[58].caseStudy.exhibits[2].content.en` | Expression: `platelets 188,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[58].caseStudy.exhibits[2].content.zh` | Expression: `血小板 188,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[58].caseStudy.stages[1].exhibits[0].content.en` | Expression: `platelets 162,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[58].caseStudy.stages[1].exhibits[0].content.zh` | Expression: `血小板 162,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[58].caseStudy.stages[2].exhibits[0].content.en` | Expression: `platelets 148,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[58].caseStudy.stages[2].exhibits[0].content.zh` | Expression: `血小板 148,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::gpt_r1_regen_case_celiac_01**
  - Path: `questions[60].caseStudy.stages[0].exhibits[1].content.en` | Expression: `WBC 6,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[60].caseStudy.stages[0].exhibits[1].content.en` | Expression: `platelets 310,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[60].caseStudy.stages[0].exhibits[1].content.zh` | Expression: `WBC 6,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[60].caseStudy.stages[0].exhibits[1].content.zh` | Expression: `血小板310,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01**
  - Path: `questions[62].caseStudy.exhibits[1].content.en` | Expression: `platelets 188,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[62].caseStudy.exhibits[1].content.zh` | Expression: `血小板 188,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[62].caseStudy.stages[3].exhibits[0].content.en` | Expression: `platelets 174,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[62].caseStudy.stages[3].exhibits[0].content.zh` | Expression: `血小板 174,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::opus_car_t_crs_2026_06_11_case_01**
  - Path: `questions[38].caseStudy.exhibits[2].content.en` | Expression: `Platelets 45,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[38].caseStudy.exhibits[2].content.zh` | Expression: `血小板 45,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::opus_case_se_01**
  - Path: `questions[41].caseStudy.exhibits[0].content.en` | Expression: `WBC 14,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[41].caseStudy.exhibits[0].content.en` | Expression: `platelets 224,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[41].caseStudy.exhibits[0].content.zh` | Expression: `白细胞 (WBC) 14,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[41].caseStudy.exhibits[0].content.zh` | Expression: `血小板 224,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::opus_scc_case_01**
  - Path: `questions[37].caseStudy.exhibits[0].content.en` | Expression: `WBC 6,800/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[37].caseStudy.exhibits[0].content.en` | Expression: `platelets 188,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[37].caseStudy.exhibits[0].content.zh` | Expression: `白细胞6,800/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[37].caseStudy.exhibits[0].content.zh` | Expression: `血小板188,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::opus_tpn_case_mucositis_01**
  - Path: `questions[40].caseStudy.exhibits[0].content.en` | Expression: `platelets 18,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[40].caseStudy.exhibits[0].content.zh` | Expression: `血小板 18,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::opus_tpn_case_mucositis_01::opus_tpn_case_mucositis_01_q4**
  - Path: `questions[40].caseStudy.questions[3].rationale.byChoice[1].en` | Expression: `platelets at 18,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[40].caseStudy.questions[3].rationale.byChoice[1].zh` | Expression: `血小板为 18,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::opus1_case_discharge_med_rec_anticoag_01**
  - Path: `questions[42].caseStudy.exhibits[0].content.en` | Expression: `platelets 198,000/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[42].caseStudy.exhibits[0].content.zh` | Expression: `血小板198,000/mcL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::opus12_case_inpatient_suicide_risk_01**
  - Path: `questions[47].caseStudy.exhibits[2].content.en` | Expression: `WBC 14,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[47].caseStudy.exhibits[2].content.en` | Expression: `platelets 210,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[47].caseStudy.exhibits[2].content.zh` | Expression: `白细胞14,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[47].caseStudy.exhibits[2].content.zh` | Expression: `血小板210,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::opus2_case_postop_opioid_respiratory_depression_01**
  - Path: `questions[43].caseStudy.exhibits[1].content.en` | Expression: `WBC 11,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[43].caseStudy.exhibits[1].content.en` | Expression: `platelets 210,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[43].caseStudy.exhibits[1].content.zh` | Expression: `白细胞11,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[43].caseStudy.exhibits[1].content.zh` | Expression: `血小板210,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::opus4_case_postop_sbar_01**
  - Path: `questions[45].caseStudy.exhibits[1].content.en` | Expression: `WBC 13,800/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[45].caseStudy.exhibits[1].content.en` | Expression: `platelets 188,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[45].caseStudy.exhibits[1].content.zh` | Expression: `白细胞 13,800/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[45].caseStudy.exhibits[1].content.zh` | Expression: `血小板 188,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[45].caseStudy.stages[1].exhibits[0].content.en` | Expression: `WBC 16,400/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[45].caseStudy.stages[1].exhibits[0].content.zh` | Expression: `白细胞 16,400/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
- **banks/hard-cases-canonical.json::opus5_case_consent_interpreter_01**
  - Path: `questions[46].caseStudy.exhibits[2].content.en` | Expression: `WBC 7,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[46].caseStudy.exhibits[2].content.en` | Expression: `platelets 238,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[46].caseStudy.exhibits[2].content.zh` | Expression: `白细胞7,200/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`
  - Path: `questions[46].caseStudy.exhibits[2].content.zh` | Expression: `血小板238,000/µL` | Class: `ALTERNATE_SOURCE_FORM_PRIMARY`

## 8. Known-Example Check

- **cs_thyroid_storm_q4 existence check:** FOUND - matches at path `questions[33].caseStudy.questions[3].options[2].en` with verbatim expression `White blood cell count of 2,800/mm³ (2.8 × 10^9/L)`.

## 9. Method Limitations

- **Syntactic heuristics:** Proximity-based heuristic is used to bind analytes to their closest numbers in clauses. While robust, complex parenthetical nests or multi-value lists inside a single clause could lead to minor alignment issues.
- **Counterpart linkage:** Linkage relies on standard JSON text-pair path naming conventions (`.en` vs `.zh` / `.termEn` vs `.termZh`). Path topologies that do not conform to these pairs will not be linked.
