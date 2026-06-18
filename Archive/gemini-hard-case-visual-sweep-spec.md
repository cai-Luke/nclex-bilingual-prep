# Gemini Task — Hard-Case Rationale Visual Candidate Sweep

## Purpose

You are reviewing the hard-case NCLEX bank to identify high-value opportunities for `rationale.visuals` under schema `1.5`.

This is a **candidate sweep only**. Do not edit bank JSON. Do not rewrite rationales. Do not mutate files. Your job is to produce a structured report of where explanation visuals would materially improve post-answer teaching.

## Background

The project now supports:

```ts
rationale.visuals?: QuestionVisual[]
```

These visuals are shown **after the answer is revealed**, between `rationale.correct` and the per-choice rationale block. They are explanation figures, not question stimuli.

Important distinction:

* `question.visual` is load-bearing stimulus material.
* `rationale.visuals` are answer-revealed teaching figures.

For this sweep, rationale visuals must use only existing deterministic visual kinds already supported by the repo. Do not invent new visual kinds, new anatomy art, raster images, or bespoke illustrations.

## Primary target

Audit:

```text
banks/hard-cases-canonical.json
```

Focus on top-level `case_study` questions and their embedded case-study parts.

If the repo has additional clearly named hard-case canonical banks, you may mention them as possible future scope, but do not expand the sweep unless explicitly instructed.

## Non-goals

Do not:

* edit JSON files
* produce a full replacement bank
* add `rationale.visuals` directly
* rewrite stems, exhibits, answers, or rationales
* create new visual kinds
* propose AI-generated medical art
* attach visuals inside `rationale.byChoice[]`
* attach visuals per option, per row, per dropdown, or per blank
* use visuals for decoration only
* recommend a visual just because the question topic is visualizable

## Visual eligibility rule

Recommend `rationale.visuals` only when a deterministic figure materially improves the learner’s understanding of the explanation.

Good candidates include:

1. **Trend interpretation**

   * lab trends
   * vital-sign trends
   * I/O trends
   * fetal-monitoring trends
   * capnography or device-screen interpretation if already supported

2. **Calculation or threshold teaching**

   * burn TBSA/Parkland-style explanation
   * medication-label dose reasoning
   * lab threshold comparison
   * urine output / renal perfusion reasoning

3. **Before/after or progression**

   * deterioration over stages
   * response to intervention
   * worsening respiratory/renal/hemodynamic pattern

4. **Pattern recognition**

   * rhythm strip
   * fetal tracing
   * device screen
   * medication label
   * MAR / administration record
   * I/O record

5. **Sequence/comparison**

   * multiple panels that clarify why one interpretation is correct
   * comparison of expected vs concerning trend
   * sequential figures that explain unfolding clinical change

Poor candidates include:

* purely psychosocial communication items
* legal/ethical items where the visual would be decorative
* delegation/scope questions without meaningful data display
* rationales already fully clear without a figure
* visuals that would require new art or an unsupported visual kind
* visuals whose data would need invented clinical facts not already present in the case

## Existing visual-kind constraint

Before proposing any payload, inspect the repo’s current `QuestionVisual` union and visual schema docs. Use only existing supported visual kinds.

If you are not confident about the exact payload shape for a visual kind, still list the candidate, but set:

```json
"payload_confidence": "low"
```

and describe the intended figure in prose instead of fabricating a detailed schema.

## Required sweep method

For each hard case:

1. Identify the top-level case ID and title/topic.
2. Review each embedded question.
3. Read the stem, exhibits/stage data, correct answer, and rationale.
4. Decide whether a rationale visual would materially improve explanation.
5. If yes, propose the minimum useful visual set.
6. If no, do not force one.

A case may receive:

* zero candidates
* one candidate
* multiple candidates, if different embedded parts need different explanation figures

Prefer restraint. A short high-confidence list is better than a long weak list.

## Required output

Produce one Markdown report with the following sections.

# Hard-Case Rationale Visual Candidate Sweep

## Summary

Include:

* number of hard cases reviewed
* number of embedded parts reviewed
* number of visual candidates found
* number of high / medium / low confidence candidates
* visual kinds proposed, grouped by kind
* cases with no recommended rationale visuals

## High-confidence candidates

Use this exact table format:

| case_id | embedded_question_id | visual_kind | proposed_count | why_visual_helps | existing_case_data_used | payload_confidence | reviewer_notes |
| ------- | -------------------- | ----------- | -------------: | ---------------- | ----------------------- | ------------------ | -------------- |

## Medium-confidence candidates

Same table format.

## Low-confidence / defer candidates

Same table format, but include why this should probably be deferred.

## Explicit no-visual cases

List cases reviewed where no rationale visual is recommended, with a one-sentence reason.

## Candidate details

For each candidate, provide this structured block:

```json
{
  "case_id": "",
  "embedded_question_id": "",
  "embedded_question_type": "",
  "candidate_confidence": "high | medium | low",
  "recommended_disposition": "add_rationale_visual | defer | do_not_add",
  "visual_kind": "",
  "proposed_count": 1,
  "payload_confidence": "high | medium | low",
  "why_visual_helps": "",
  "existing_case_data_used": [
    ""
  ],
  "rationale_connection": "",
  "draft_visual_payloads": [
    {}
  ],
  "review_risks": [
    ""
  ],
  "notes_for_claude": ""
}
```

Rules for `draft_visual_payloads`:

* Include draft payloads only when the exact existing visual schema is clear.
* Do not invent unsupported fields.
* Do not invent new patient data.
* If a figure needs data not present in the case, do not propose the payload; mark the candidate low confidence or reject it.
* Captions, if included, should be bilingual and explanation-oriented.
* Captions may reveal the answer because rationale visuals are answer-revealed.

## Review-risk flags

Flag any candidate that may need Claude review for:

* clinical currency
* threshold accuracy
* arithmetic correctness
* mismatch between figure data and rationale text
* bilingual caption risk
* possible visual spam
* unsupported visual kind
* duplicate teaching value with an existing question visual or exhibit

## Final recommendation

End with one of:

1. `PROCEED_WITH_HIGH_CONFIDENCE_ONLY`
2. `PROCEED_WITH_HIGH_AND_MEDIUM`
3. `DO_NOT_RETROFIT_YET`

Add a brief reason.

## Quality bar

Be conservative.

A good output might find only 5–15 strong candidates. Zero candidates is acceptable if the hard-case bank does not justify retrofitting.

Do not try to make every hard case visual.
