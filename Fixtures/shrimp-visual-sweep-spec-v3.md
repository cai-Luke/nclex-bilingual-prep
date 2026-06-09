# Project Shrimp — Visual Conversion & Human Review Sweep Spec v3

**For:** Gemini large-context / Gemini CLI
**Pass type:** Read-only audit and triage
**No rewriting. No generation. No canonical edits.**

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

Use only this renderer enum:

```json
[
  "ecg_rhythm_strip",
  "fetal_monitor_tracing",
  "chest_tube_drainage",
  "burn_body_map",
  "wound_stage_diagram",
  "lab_panel",
  "vitals_trend",
  "intake_output_chart",
  "mar",
  "device_settings_screen",
  null
]
```

Do not invent renderers.

Do not assign a renderer unless a specific present datum could be displayed by that renderer.

Bad:

```json
"renderer_justification": "Wound characteristics mentioned"
```

Good:

```json
"renderer_justification": "The row text says \"yellow slough covering the wound bed,\" which a wound-stage diagram could replace with visual wound-bed findings."
```

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
  "qid": "string",
  "source_file_or_bank": "string",
  "item_type": "multiple_choice | select_all | ordered_response | fill_in_blank | matrix | dropdown_cloze | case_study | case_study_part",
  "parent_qid": "string or null",

  "category": "string",
  "topic": "string",
  "difficulty": "easy | medium | hard | null",

  "flag_type": "visual_replace_candidate | visual_parallel_candidate | human_review | redundancy_candidate",
  "priority": "high | medium | low",

  "target_renderer": "ecg_rhythm_strip | fetal_monitor_tracing | chest_tube_drainage | burn_body_map | wound_stage_diagram | lab_panel | vitals_trend | intake_output_chart | mar | device_settings_screen | null",
  "visual_value": "essential | helpful | none",

  "quoted_evidence": [
    {
      "location": "stem | option | row | column | dropdown | blank | exhibit | rationale.correct | rationale.byChoice",
      "quote": "exact verbatim text"
    }
  ],

  "the_tell": "exact quoted descriptor(s), or null",
  "renderer_justification": "specific present datum the renderer would display, or why renderer is null",

  "answer_key_trust": "high | medium | low | not_assessed",
  "trust_evidence": "specific note referencing the key and rationale; must not be generic",

  "ambiguity_risk": "low | medium | high",
  "ambiguity_evidence": "specific reason; must not be generic",

  "recommended_action": "replace_text_item_with_visual | add_parallel_visual_item | human_review_before_action | possible_duplicate_review | leave_after_review",
  "action_rationale": "one specific sentence grounded in quoted evidence",

  "possible_duplicate_qids": ["qid"],
  "duplicate_claim": "string or null",

  "needs_human_review": true
}
```

Every emitted row must have:

* `needs_human_review: true`
* at least one `quoted_evidence` entry
* a non-generic `action_rationale`
* a correct `item_type` copied from the actual item shape
* `parent_qid` for case-study embedded parts

If any of these are missing, the run is invalid.

## 7. Visual value rules

### `essential`

Use `essential` only when:

* the item contains a textual descriptor that gives away a clinical interpretation, and
* the core task is identifying that finding, and
* a visual would force interpretation instead of recall.

Example logic:

* Text says “irregularly irregular rhythm” and asks what rhythm or complication is present.
* Text says “peaked T waves” and asks what electrolyte problem is likely.
* Text says “variable decelerations” and asks what fetal-monitoring pattern is present.
* Text says “yellow slough” or “nonblanchable erythema” and asks for wound/pressure-injury staging.

### `helpful`

Use `helpful` when:

* a visual would add realism or NGN-style interpretation, but
* the existing text item still independently tests useful reasoning.

Example logic:

* Text tests priority action after a chest-tube output change; visual could add drainage appearance/volume trend.
* Text tests whether an IV pump setting is safe; device screen could make the item more realistic.
* Text tests I&O interpretation; chart could make the item more authentic but not necessary.

### `none`

Use `none` only for an emitted row when the reason for emitting is human review or redundancy rather than visual conversion.

Do not emit ordinary `none_leave` rows.

## 8. Human-review triggers

Emit `human_review` rows when a question looks suspicious even if it is not a visual candidate.

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

Only emit `redundancy_candidate` when two or more specific question IDs have:

* same clinical concept, and
* same answer logic, and
* substantially overlapping correct-answer reasoning.

Sharing a renderer is not redundancy.

Sharing a category is not redundancy.

Sharing a disease topic is not redundancy.

Text similarity alone is not redundancy.

A cluster is invalid if it groups unrelated case studies or only says “near-duplicate stem logic based on text similarity.”

For each redundancy candidate, write a concrete duplicate claim:

Good:

```text
Both items ask the nurse to recognize a transfusion reaction and stop the transfusion first before notifying the provider.
```

Bad:

```text
Near-duplicate stem logic based on text similarity.
```

## 10. Per-batch summary schema

Each batch must output:

```json
{
  "batch_id": "string",
  "items_read": 0,
  "rows_emitted": 0,
  "counts_by_flag_type": {
    "visual_replace_candidate": 0,
    "visual_parallel_candidate": 0,
    "human_review": 0,
    "redundancy_candidate": 0
  },
  "counts_by_renderer": {
    "ecg_rhythm_strip": 0,
    "fetal_monitor_tracing": 0,
    "chest_tube_drainage": 0,
    "burn_body_map": 0,
    "wound_stage_diagram": 0,
    "lab_panel": 0,
    "vitals_trend": 0,
    "intake_output_chart": 0,
    "mar": 0,
    "device_settings_screen": 0,
    "null": 0
  },
  "gate_results": {
    "all_rows_have_quotes": true,
    "all_rows_need_human_review_true": true,
    "item_type_not_constant": true,
    "ambiguity_risk_not_constant_unless_explained": true,
    "no_generic_renderer_justifications": true,
    "no_random_review_flags": true,
    "no_text_similarity_only_clusters": true
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
  "counts_by_flag_type": {
    "visual_replace_candidate": 0,
    "visual_parallel_candidate": 0,
    "human_review": 0,
    "redundancy_candidate": 0
  },
  "counts_by_priority": {
    "high": 0,
    "medium": 0,
    "low": 0
  },
  "counts_by_renderer": {
    "ecg_rhythm_strip": 0,
    "fetal_monitor_tracing": 0,
    "chest_tube_drainage": 0,
    "burn_body_map": 0,
    "wound_stage_diagram": 0,
    "lab_panel": 0,
    "vitals_trend": 0,
    "intake_output_chart": 0,
    "mar": 0,
    "device_settings_screen": 0,
    "null": 0
  },
  "top_review_queue": [
    {
      "qid": "string",
      "flag_type": "string",
      "priority": "high | medium | low",
      "why": "specific quoted reason, not random sample"
    }
  ],
  "global_gate_results": {
    "jsonl_valid": true,
    "all_required_fields_present": true,
    "all_rows_have_quotes": true,
    "no_missing_needs_human_review": true,
    "item_type_not_constant": true,
    "ambiguity_risk_not_constant_unless_explained": true,
    "no_generic_trust_notes": true,
    "no_generic_renderer_justifications": true,
    "no_random_review_flags": true,
    "no_text_similarity_only_clusters": true,
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
* Every row has `needs_human_review: true`.
* Every row has at least one exact quote.
* `item_type` reflects the actual item.
* Case-study parts include `parent_qid`.
* No ordinary `none_leave` rows are emitted.
* No random review flags exist.
* No duplicate cluster is based only on text similarity.
* Renderer justification names the exact displayed datum.
* Trust evidence references the key/rationale specifically.
* The top review queue is evidence-based.
* Counts reconcile.

Output the files only after this self-check.
