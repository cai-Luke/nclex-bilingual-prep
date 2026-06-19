# Oncology Case Reclassification Dry Run

Generated: 2026-06-18T23:25:39.762Z
Mode: dry-run only
Canonical bank writes: none
Topic vocabulary writes: none
Classifier: openai/gpt-5-codex-in-harness (non-Gemini)

## Guard Summary

- Exact diffs are category/topic only: yes
- Proposed topic license validation errors: 0
- Out-of-scope AGVHD/CAR-T/ICI/TLS child rows emitted: 0
- Canonical writes performed: no
- Marked handled for general parent pass: `opus_agvd_case_agvhd_01`, `opus_car_t_crs_2026_06_11_case_01`, `opus_scc_case_01`, `opus_tpn_case_mucositis_01`, `opus_icit_case_01`, `gpt_case_gap_2026_06_11_case_tls_01`

## Counts

- totalRecords: 12
- operationAParentRows: 6
- operationBSccChildRows: 6
- proposed: 8
- carriedForward: 2
- notOncologyConstruct: 2
- topicOnly: 7
- categoryAndTopic: 1
- abstain: 4
- validationErrors: 0

## Operation A - Parent Rows

| Status | Decision | Bank | ID | Current category | Current topic | Proposed category | Proposed topic | Reason |
|---|---|---|---|---|---|---|---|---|
| proposed | topic_only | gemini-canonical.json | `opus_agvd_case_agvhd_01` | Physiological Adaptation | Acute Graft-Versus-Host Disease | Physiological Adaptation | Oncology & Immunotherapy Complications | Parent/case clinical subject is acute GVHD after transplant; oncology topic is licensed under the existing Physiological Adaptation category. |
| proposed | topic_only | hard-cases-canonical.json | `opus_car_t_crs_2026_06_11_case_01` | Reduction of Risk Potential | CAR-T cytokine release syndrome and ICANS monitoring | Reduction of Risk Potential | Oncology & Immunotherapy Complications | Parent/case clinical subject is CAR-T CRS/ICANS monitoring; oncology topic is licensed under the existing Reduction of Risk Potential category. |
| proposed | topic_only | hard-cases-canonical.json | `opus_scc_case_01` | Physiological Adaptation | Malignant Spinal Cord Compression | Physiological Adaptation | Oncology & Immunotherapy Complications | Parent/case clinical subject is malignant spinal cord compression from metastatic cancer; oncology topic is licensed under the existing Physiological Adaptation category. |
| proposed | topic_only | hard-cases-canonical.json | `opus_tpn_case_mucositis_01` | Physiological Adaptation | Mucositis TPN and CRBSI | Physiological Adaptation | Oncology & Immunotherapy Complications | Verified oncology framing from source: AML induction chemotherapy with profound neutropenia and grade IV chemotherapy-induced mucositis; oncology topic is licensed under the existing Physiological Adaptation category. |
| proposed | category_and_topic | hard-cases-canonical.json | `opus_icit_case_01` | Pharmacological and Parenteral Therapies | Immune Checkpoint Inhibitor Myocarditis | Physiological Adaptation | Oncology & Immunotherapy Complications | Parent/case clinical subject is immune checkpoint inhibitor myocarditis; current Pharmacological category does not license Oncology, so propose Physiological Adaptation plus Oncology topic. |
| proposed | topic_only | gpt-canonical.json | `gpt_case_gap_2026_06_11_case_tls_01` | Reduction of Risk Potential | tumor lysis syndrome | Reduction of Risk Potential | Oncology & Immunotherapy Complications | Parent/case clinical subject is tumor lysis syndrome during chemotherapy for high-burden lymphoma; oncology topic is licensed under the existing Reduction of Risk Potential category. |

## Operation B - SCC Child Rows

| Status | Decision | ID | Current category | Current topic | Proposed category | Proposed topic | Reason |
|---|---|---|---|---|---|---|---|
| proposed | topic_only | `opus_scc_case_01_q1` | Physiological Adaptation | Endocrine & Neurological Disorders | Physiological Adaptation | Oncology & Immunotherapy Complications | Recognition item explicitly asks for the oncologic emergency and keys malignant spinal cord compression. |
| proposed | topic_only | `opus_scc_case_01_q2` | Physiological Adaptation | Endocrine & Neurological Disorders | Physiological Adaptation | Oncology & Immunotherapy Complications | Immediate dexamethasone for confirmed MSCC is time-critical oncologic-emergency management rather than generic neuro assessment. |
| carried-forward | abstain | `opus_scc_case_01_q3` | Physiological Adaptation | Endocrine & Neurological Disorders | Physiological Adaptation |  | Bladder retention plus perineal numbness tests neurologic/autonomic pathway interpretation; keep current Endocrine & Neurological Disorders in this oncology pass. |
| not_oncology_construct | abstain | `opus_scc_case_01_q4` | Physiological Adaptation | Endocrine & Neurological Disorders | Physiological Adaptation |  | Preoperative preparation for decompression tests perioperative/legal/safety workflow more than oncology recognition; no oncology move proposed in this scoped pass. |
| not_oncology_construct | abstain | `opus_scc_case_01_q5` | Physiological Adaptation | Endocrine & Neurological Disorders | Physiological Adaptation |  | Family prognosis response tests therapeutic communication and scope boundaries, not oncology complication recognition. |
| carried-forward | abstain | `opus_scc_case_01_q6` | Physiological Adaptation | Endocrine & Neurological Disorders | Physiological Adaptation |  | Postoperative outcome evaluation tests serial neurologic recovery versus persistent spinal cord dysfunction; keep current Endocrine & Neurological Disorders in this oncology pass. |

## Exact Diff Preview

| ID | Path | Before | After |
|---|---|---|---|
| `opus_agvd_case_agvhd_01` | banks/gemini-canonical.json:questions.768.topic | Acute Graft-Versus-Host Disease | Oncology & Immunotherapy Complications |
| `opus_car_t_crs_2026_06_11_case_01` | banks/hard-cases-canonical.json:questions.38.topic | CAR-T cytokine release syndrome and ICANS monitoring | Oncology & Immunotherapy Complications |
| `opus_scc_case_01` | banks/hard-cases-canonical.json:questions.37.topic | Malignant Spinal Cord Compression | Oncology & Immunotherapy Complications |
| `opus_tpn_case_mucositis_01` | banks/hard-cases-canonical.json:questions.40.topic | Mucositis TPN and CRBSI | Oncology & Immunotherapy Complications |
| `opus_icit_case_01` | banks/hard-cases-canonical.json:questions.39.category | Pharmacological and Parenteral Therapies | Physiological Adaptation |
| `opus_icit_case_01` | banks/hard-cases-canonical.json:questions.39.topic | Immune Checkpoint Inhibitor Myocarditis | Oncology & Immunotherapy Complications |
| `gpt_case_gap_2026_06_11_case_tls_01` | banks/gpt-canonical.json:questions.183.topic | tumor lysis syndrome | Oncology & Immunotherapy Complications |
| `opus_scc_case_01_q1` | banks/hard-cases-canonical.json:questions.37.caseStudy.questions.0.topic | Endocrine & Neurological Disorders | Oncology & Immunotherapy Complications |
| `opus_scc_case_01_q2` | banks/hard-cases-canonical.json:questions.37.caseStudy.questions.1.topic | Endocrine & Neurological Disorders | Oncology & Immunotherapy Complications |

## Stop Gate

No canonical writes were performed. Luke approval is required before applying any proposed category/topic updates.
