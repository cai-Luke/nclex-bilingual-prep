# Project Shrimp — Visual Conversion & Human Review Sweep Spec v3

**For:** Gemini large-context / Gemini CLI
**Pass type:** Read-only content-mining and triage
**Task Ownership:** This is suitable as a Gemini/CLI read-only sweep. Gemini may identify and rank candidates, but must not edit canonical bank files, generate final replacement items, or make final clinical-review decisions. Codex is not needed unless a tooling gap is discovered. Claude/GPT/human review should handle final acceptance, clinical judgment, and promotion decisions.
**No rewriting. No generation. No canonical edits. Do not propose new renderer kinds. Do not request schema changes. Do not promote content.**

## 0. Purpose

This pass identifies question-bank items that are worth human review for either:

1. Visual conversion potential
2. Visual parallel-item potential
3. Bad or uncertain audit/model judgment
4. Possible redundancy with another item

The output is a human-review worklist, not an authoritative decision list.

Precision matters more than volume. A short list of 25 defensible candidates is better than 300 rows of weak templated metadata.

## 1. Why v3 exists

Prior sweeps failed in two different ways:

* v1 structurally collapsed: disposition was templated from value, trust was constant, tells only appeared on essentials, and clusters were renderer/null groupings.
* v2 improved surface structure but still had signs of cosmetic compliance:

  * Generic `trust_note` values
  * Generic `renderer_justification` values
  * Constant or near-constant ambiguity assessment
  * Incorrect `ngn_item_type`
  * Missing required fields
  * Redundancy clusters based on text similarity rather than same concept plus same answer logic
  * “Random sample” review flags instead of evidence-based review flags

v3 narrows the task and requires quoted evidence for every emitted row.

## 2. Inputs required

You must have the full question objects, not a stem-only export.

For each item you review, you need access to:

* `id`
* `itemType`
* `category`
* `topic`
* `difficulty`
* stem / cloze stem / case exhibits
* all options, rows, columns, dropdown choices, blanks
* correct answer key
* rationale.correct
* rationale.byChoice
* visual field, if present
* case-study parent and embedded parts, if applicable

If you do not have full question objects, stop and output:

```json
{
  "status": "stopped",
  "reason": "Full question objects were not available; v3 cannot assess visual conversion, trust, or redundancy from stems alone."
}
```

## 3. Batch rule

Process the bank in batches of 25–40 top-level items.

Do not run one monolithic pass over the entire bank.

For each batch, emit:

* `batch_manifest.jsonl`
* `batch_summary.json`

After all batches are done, concatenate the JSONL files and merge summaries.

Do not let later batches change earlier batch decisions unless you are doing a separate explicit reconciliation pass.

## 4. Renderer enum

The visual renderer roadmap is complete. Use only the currently supported visual kinds:

```json
[
  "rhythm_strip",
  "capnography",
  "vitals_trend",
  "lab_trend",
  "mar",
  "io_record",
  "medication_label",
  "device_screen",
  "fetal_monitoring",
  "burn_map",
  "null"
]
```

Do not invent renderers.

Do not assign a renderer unless a specific present datum could be displayed by that renderer.

Bad:

```json
"visual_necessity_claim": "Wound characteristics mentioned"
```

Good:

```json
"visual_necessity_claim": "The row text says \"yellow slough covering the wound bed,\" which a wound-stage diagram could replace with visual wound-bed findings."
```

## 4b. Visual Necessity & Current Lane Rules

For each reviewed question, determine whether a visual would be educationally necessary, not merely decorative.

A visual is **necessary** only if removing it would make the item unanswerable or materially change the clinical reasoning. If the stem already contains all information needed to answer, mark the visual kind as `null` unless the item could support a genuinely new parallel visual-dependent question.

### Current Lane Rules

* Adult `burn_map` content is open.
* Pediatric `burn_map` content is blocked unless an explicit later spec says otherwise.
* `fetal_monitoring` content is open only under strict NICHD/AWHONN/ACOG wording constraints.
* Do not recommend routine oxygen administration as a default correct action for normoxic fetal-monitoring patients.
* Medication label, device screen, MAR, I/O, and dosage/infusion items are high-risk and require human review after triage.

## 5. Output philosophy

Do not emit a row for every question.

Emit only rows that are actionable:

* visual conversion candidate
* visual parallel candidate
* review needed because key/rationale looks questionable
* review needed because the audit judgment is uncertain
* genuine near-duplicate candidate

If an item has no visual or review value, omit it from `manifest.jsonl`.

The summary should still report how many items were read.

## 6. Required manifest schema

Each emitted JSONL row must be one JSON object with this exact shape:

```json
{
  "question_id": "string",
  "current_item_type": "multiple_choice | select_all | ordered_response | fill_in_blank | matrix | dropdown_cloze | case_study | case_study_part",
  "current_topic": "string",

  "candidate_visual_kind": "rhythm_strip | capnography | vitals_trend | lab_trend | mar | io_record | medication_label | device_screen | fetal_monitoring | burn_map | null",
  "recommendation": "convert_existing_item | create_parallel_visual_item | reject_visual_decorative | reject_visual_out_of_scope | needs_human_review",

  "visual_necessity_claim": "one sentence explaining why the visual would be load-bearing",
  "quoted_evidence": "exact quoted text from the stem/options/rationale supporting the recommendation",
  
  "risk_tier": "low | medium | high",
  "content_lane_status": "open | blocked | unknown",
  "reasoning_notes": "concise explanation, no rewriting",
  "do_not_generate": true
}
```

Every emitted row must have:

* `do_not_generate: true`
* at least one exact quote in `quoted_evidence`
* a non-generic `visual_necessity_claim` or `reasoning_notes`
* a correct `current_item_type` copied from the actual item shape

If any of these are missing, the run is invalid.

## 7. Recommendation rules

### `convert_existing_item`

Use only when:

* the item contains a textual descriptor that gives away a clinical interpretation, and
* the core task is identifying that finding, and
* a visual would force interpretation instead of recall.

Example logic:

* Text says “irregularly irregular rhythm” and asks what rhythm or complication is present.
* Text says “peaked T waves” and asks what electrolyte problem is likely.
* Text says “variable decelerations” and asks what fetal-monitoring pattern is present.

### `create_parallel_visual_item`

Use when:

* a visual would add realism or NGN-style interpretation, but
* the existing text item still independently tests useful reasoning.

Example logic:

* Text tests priority action after a chest-tube output change; visual could add drainage appearance/volume trend.
* Text tests whether an IV pump setting is safe; device screen could make the item more realistic.
* Text tests I&O interpretation; chart could make the item more authentic but not necessary.

### `reject_visual_decorative` & `reject_visual_out_of_scope`

Use only for an emitted row when the reason for emitting is human review rather than visual conversion, but you still need to log the rejection of the visual idea.

## 8. Human-review triggers

Emit rows with `recommendation: needs_human_review` when a question looks suspicious even if it is not a visual candidate.

Use this for:

* answer key/rationale mismatch
* rationale that contradicts the correct answer
* broad or over-absolute clinical claim
* unsafe ordered-response sequence
* suspicious bilingual divergence
* item looks clinically correct but too ambiguous for exam use
* audit agent is uncertain and can quote the exact reason

Do not emit “random sample” review flags.

Every human-review row must quote the exact text that caused concern.

## 9. Redundancy rules

*(If tracking redundancy, add specific reasoning_notes detailing the redundancy. Sharing a concept is not redundancy unless answer logic overlaps heavily.)*

## 10. Per-batch summary schema

Each batch must output:

```json
{
  "batch_id": "string",
  "items_read": 0,
  "rows_emitted": 0,
  "counts_by_recommendation": {
    "convert_existing_item": 0,
    "create_parallel_visual_item": 0,
    "reject_visual_decorative": 0,
    "reject_visual_out_of_scope": 0,
    "needs_human_review": 0
  },
  "counts_by_renderer": {
    "rhythm_strip": 0,
    "capnography": 0,
    "vitals_trend": 0,
    "lab_trend": 0,
    "mar": 0,
    "io_record": 0,
    "medication_label": 0,
    "device_screen": 0,
    "fetal_monitoring": 0,
    "burn_map": 0,
    "null": 0
  },
  "gate_results": {
    "all_rows_have_quotes": true,
    "all_rows_do_not_generate_true": true,
    "no_generic_justifications": true
  },
  "gate_notes": [
    "string"
  ]
}
```

## 11. Final merged summary schema

After all batches:

```json
{
  "status": "usable | rejected",
  "items_read": 0,
  "rows_emitted": 0,
  "counts_by_recommendation": {
    "convert_existing_item": 0,
    "create_parallel_visual_item": 0,
    "reject_visual_decorative": 0,
    "reject_visual_out_of_scope": 0,
    "needs_human_review": 0
  },
  "counts_by_risk_tier": {
    "high": 0,
    "medium": 0,
    "low": 0
  },
  "counts_by_renderer": {
    "rhythm_strip": 0,
    "capnography": 0,
    "vitals_trend": 0,
    "lab_trend": 0,
    "mar": 0,
    "io_record": 0,
    "medication_label": 0,
    "device_screen": 0,
    "fetal_monitoring": 0,
    "burn_map": 0,
    "null": 0
  },
  "top_review_queue": [
    {
      "question_id": "string",
      "recommendation": "string",
      "risk_tier": "high | medium | low",
      "why": "specific quoted reason, not random sample"
    }
  ],
  "global_gate_results": {
    "jsonl_valid": true,
    "all_required_fields_present": true,
    "all_rows_have_quotes": true,
    "counts_reconcile": true
  },
  "rejection_reasons": []
}
```

If any global gate fails, set:

```json
"status": "rejected"
```

Do not claim the run is usable if the manifest is structurally valid but semantically generic.

## 12. Generic phrase ban

The following phrases are forbidden in final output because they are signs of templating:

* “Finding described”
* “Wound characteristics mentioned”
* “I&O records mentioned”
* “Device settings described”
* “Rationale is coherent”
* “Key and rationale align”
* “Near-duplicate stem logic based on text similarity”
* “Random sample for review”
* “Visual adds realism”
* “Text item remains useful”

You may express those ideas only if you attach specific quoted evidence.

## 13. Self-check before final output

Before emitting final files, verify:

* JSONL parses.
* Every row has `do_not_generate: true`.
* Every row has at least one exact quote.
* `current_item_type` reflects the actual item.
* No duplicate cluster is based only on text similarity.
* Visual necessity claim names the exact displayed datum.
* The top review queue is evidence-based.
* Counts reconcile.

Output the files only after this self-check.
