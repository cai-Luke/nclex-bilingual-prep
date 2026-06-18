# Hard-Case Rationale Visual Candidate Sweep

## Summary

* number of hard cases reviewed: 57
* number of embedded parts reviewed: ~100+
* number of visual candidates found: 5
* number of high / medium / low confidence candidates: 4 high / 1 medium / 0 low
* visual kinds proposed, grouped by kind: `BurnMapSpec` (1), `RhythmStripVisual` (1), `MedLabelSpec` (1), `VitalsTrendSpec` (2)
* cases with no recommended rationale visuals: 52

## High-confidence candidates

| case_id | embedded_question_id | visual_kind | proposed_count | why_visual_helps | existing_case_data_used | payload_confidence | reviewer_notes |
| ------- | -------------------- | ----------- | -------------: | ---------------- | ----------------------- | ------------------ | -------------- |
| case_burns_01 | case_burns_01_part_2 | BurnMapSpec | 1 | Visualizes Rule of Nines TBSA mapping (face, trunk, arms) | Anterior trunk, anterior arms, face burns | high | Clear mapping to formula |
| case_ami_01 | case_ami_01_q1 | RhythmStripVisual | 1 | Reinforces pattern recognition of ST elevation | ST elevation in V3-V4 | high | Strip of V3/V4 elevation |
| cs_hip_01 | cs_hip_01_q5 | MedLabelSpec | 1 | Reinforces 'Have' component of dosage calculation | Enoxaparin 40 mg/0.4 mL | high | Simple label visualization |
| cs_ngn_006_tbi | q6_1 | VitalsTrendSpec | 1 | Visualizes Cushing's triad (widening pulse pressure, bradycardia) | BP and HR values at 12:00 vs baseline | high | Classic vital sign trend |

## Medium-confidence candidates

| case_id | embedded_question_id | visual_kind | proposed_count | why_visual_helps | existing_case_data_used | payload_confidence | reviewer_notes |
| ------- | -------------------- | ----------- | -------------: | ---------------- | ----------------------- | ------------------ | -------------- |
| case_preeclampsia_magnesium_01 | preeclampsia_mag_toxicity_matrix | VitalsTrendSpec | 1 | Shows drop in RR and UO for magnesium toxicity | RR 10/min, UO 20 mL/hr | medium | Could also use IoRecordSpec for urine |

## Low-confidence / defer candidates

None

## Explicit no-visual cases

* `case_sepsis_pneumonia_01`: Textual rationales for sepsis and fluid calculations are clear without visuals.
* `case_dka_01`: Lab values and fluid resuscitation rationales are straightforward text.
* `cs_copd_01`: Prioritization of airway and meds doesn't benefit from a chart.
* `cs_ckd_01`: Dialysis prioritization is conceptual and doesn't require visual trends.
* `case_cirrhosis_01`: ABC prioritization doesn't map to existing visual kinds.
* (And the remaining 47 cases were reviewed and do not justify retrofitting per the conservative quality bar.)

## Candidate details

```json
{
  "case_id": "case_burns_01",
  "embedded_question_id": "case_burns_01_part_2",
  "embedded_question_type": "fill_in_blank",
  "candidate_confidence": "high",
  "recommended_disposition": "add_rationale_visual",
  "visual_kind": "BurnMapSpec",
  "proposed_count": 1,
  "payload_confidence": "high",
  "why_visual_helps": "Visualizing the Rule of Nines explicitly connects the 31.5% TBSA calculation to the body parts described in the prompt.",
  "existing_case_data_used": [
    "Anterior trunk (18%)",
    "Anterior arms (4.5% each)",
    "Face/anterior head (4.5%)"
  ],
  "rationale_connection": "Directly illustrates the calculation steps mentioned in the rationale.",
  "draft_visual_payloads": [],
  "review_risks": [
    "Ensure burn map visually maps strictly to 'anterior' parts mentioned"
  ],
  "notes_for_claude": "BurnMapSpec is highly effective for TBSA rationale."
}
```

```json
{
  "case_id": "case_ami_01",
  "embedded_question_id": "case_ami_01_q1",
  "embedded_question_type": "multiple_choice",
  "candidate_confidence": "high",
  "recommended_disposition": "add_rationale_visual",
  "visual_kind": "RhythmStripVisual",
  "proposed_count": 1,
  "payload_confidence": "high",
  "why_visual_helps": "Visualizes the ST elevation, helping learners recognize the pattern of anterior wall MI.",
  "existing_case_data_used": [
    "ST elevation localized to V3-V4"
  ],
  "rationale_connection": "Provides the visual pattern for the text rationale describing ST elevation.",
  "draft_visual_payloads": [],
  "review_risks": [
    "RhythmStripVisual may need to be adapted to show a specific lead (V3/V4)"
  ],
  "notes_for_claude": "Reinforces pattern recognition."
}
```

```json
{
  "case_id": "cs_hip_01",
  "embedded_question_id": "cs_hip_01_q5",
  "embedded_question_type": "fill_in_blank",
  "candidate_confidence": "high",
  "recommended_disposition": "add_rationale_visual",
  "visual_kind": "MedLabelSpec",
  "proposed_count": 1,
  "payload_confidence": "high",
  "why_visual_helps": "Shows the Enoxaparin 40 mg/0.4 mL label to visually reinforce the 'Have' portion of the dosage calculation.",
  "existing_case_data_used": [
    "Enoxaparin 40 mg/0.4 mL"
  ],
  "rationale_connection": "Matches the denominator and volume in the rationale calculation.",
  "draft_visual_payloads": [],
  "review_risks": [
    "None"
  ],
  "notes_for_claude": "Simple and effective dosage visual."
}
```

```json
{
  "case_id": "cs_ngn_006_tbi",
  "embedded_question_id": "q6_1",
  "embedded_question_type": "multiple_choice",
  "candidate_confidence": "high",
  "recommended_disposition": "add_rationale_visual",
  "visual_kind": "VitalsTrendSpec",
  "proposed_count": 1,
  "payload_confidence": "high",
  "why_visual_helps": "Visualizes Cushing's triad (widening pulse pressure, bradycardia) over time to make the pattern recognition explicit.",
  "existing_case_data_used": [
    "Bradycardia, hypertension with widening pulse pressure"
  ],
  "rationale_connection": "Shows the divergent trend of HR and BP described in the rationale.",
  "draft_visual_payloads": [],
  "review_risks": [
    "Requires plotting at least two time points (baseline vs 12:00) to show the trend"
  ],
  "notes_for_claude": "Classic use case for VitalsTrendSpec."
}
```

```json
{
  "case_id": "case_preeclampsia_magnesium_01",
  "embedded_question_id": "preeclampsia_mag_toxicity_matrix",
  "embedded_question_type": "matrix",
  "candidate_confidence": "medium",
  "recommended_disposition": "add_rationale_visual",
  "visual_kind": "VitalsTrendSpec",
  "proposed_count": 1,
  "payload_confidence": "medium",
  "why_visual_helps": "Visualizes the drop in respiratory rate (RR 10/min) and urine output as toxicity develops.",
  "existing_case_data_used": [
    "RR 10/min",
    "Urine output 20 mL in the past hour"
  ],
  "rationale_connection": "Highlights the toxicity cues mentioned in the rationale.",
  "draft_visual_payloads": [],
  "review_risks": [
    "Combining RR and UO might require two separate visuals or a combined Vitals/IO trend if supported"
  ],
  "notes_for_claude": "Could be deferred if combining UO and RR in one visual is complex."
}
```

## Final recommendation

`PROCEED_WITH_HIGH_CONFIDENCE_ONLY`

Reason: The high-confidence candidates map directly to supported visual schemas (`BurnMapSpec`, `MedLabelSpec`, `VitalsTrendSpec`, `RhythmStripVisual`) and materially improve calculation and pattern recognition teaching without needing new clinical facts. The medium confidence candidate might require complex multi-metric plotting which may not be fully supported by a single visual kind.
