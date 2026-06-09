# Project Shrimp — Visual Conversion & Redundancy Sweep Spec

**For:** Gemini (large-context triage pass)
**Pass type:** Read-only audit. **No rewriting, no generation.** Output is a scored manifest that downstream judgment-grade tooling (Claude/Codex) executes against.
**Governing principle:** Precision over volume (per the existing audit spec). When uncertain, flag for human review — do **not** force a disposition or inflate the "essential" bucket.

---

## 1. Inputs

- The full question bank (~966 items, schema 1.0).
- The schema definition (so you can read stems, options, answer keys, rationales, tags).
- The **renderer registry enum** below. Pin this to the actual U0 registry before running — do not invent renderer names that aren't in it.

```
RENDERER_ENUM = [
  "ecg_rhythm_strip",
  "fetal_monitor_tracing",
  "chest_tube_drainage",
  "burn_body_map",
  "wound_stage_diagram",
  "lab_panel",          # NGN-style exhibit
  "vitals_trend",       # NGN trend item
  "intake_output_chart",
  "mar",                # medication administration record
  "device_settings_screen",
  null                  # no renderer applies
]
```

> If a question would benefit from a visual that has **no renderer in the registry**, set `target_renderer: null` and put the proposed renderer in `disposition_rationale`. That's a signal for the roadmap, not a license to assume it exists.

---

## 2. What you must NOT do

- Do not rewrite any question. Do not draft replacement stems, options, or rationales.
- Do not generate new questions.
- Do not validate whether a renderer *can* produce the correct image — that's a separate step. You only flag **ambiguity risk** (see rubric).
- Do not score on vibes. Every `essential` rating must be backed by a quoted `the_tell`.

---

## 3. Two-axis rubric

Score each candidate on **value** and **disposition** independently. Value measures whether a visual helps; disposition measures what to do about it. They are not the same axis.

### Axis A — visual_value

| Value | Criterion |
|---|---|
| `essential` | The stem contains an explicit descriptor that *hands over the finding the question is testing* (e.g. "irregularly irregular," "variable decelerations are present," "exposed subcutaneous tissue," "intermittent tidaling"). A visual converts a recall item into an interpretation item. **Must quote the descriptor in `the_tell`.** |
| `helpful` | A visual adds realism or NGN format diversity, but the text item is legitimately answerable as written and tests the intended concept without giving it away. |
| `none` | A visual adds nothing (delegation, therapeutic communication, ethics, prioritization, pharm teaching). |

### Axis B — disposition

| Disposition | When |
|---|---|
| `replace` | `essential` value **and** `base_item_trust` is high **and** the text stem is a disguised-recall item. Rewrite in place; the visual *is* the upgrade. |
| `add_parallel` | The text item is itself good and tests something the visual version wouldn't (e.g. reasoning chain, not recognition). Create a second visual item testing the same concept from a different angle. **Must set `concept_pair_id`** so the trainer can treat the pair as one concept and not overweight it. |
| `gap_generate` | The category/concept is underrepresented or absent in the bank and warrants a net-new visual item rather than a conversion. |
| `leave` | `none` value, or `essential`/`helpful` value but `base_item_trust` is low enough that rewrite-in-place would inherit a bad key — flag in rationale that a clean regeneration may be warranted. |

---

## 4. Sweep targeting

Surface candidates by scanning stems (and where relevant, options/rationale) for:

`ECG · telemetry · rhythm · AFib · flutter · pressure injury · wound · stage · burn · rule of nines · fetal · contraction · deceleration · variable · late · chest tube · tidaling · water seal · x-ray · radiograph · monitor · strip · drainage · MAR · intake · output · I&O · lab · trend · vital · pump · syringe · insulin`

Treat this as a recall filter, not a precision filter — over-include into the candidate set, then let the rubric and `needs_human_review` cull it. NGN-exhibit candidates (lab panels, vitals trends, I&O, MAR) should be rated against the same value rubric as the strips; do not auto-demote them to `helpful` just because they aren't a waveform.

---

## 5. Output

Emit two artifacts.

### 5.1 `manifest.jsonl` — one record per candidate

```json
{
  "qid": "string",
  "category": "string (existing taxonomy)",
  "ngn_item_type": "case_study | matrix_grid | trend | cloze_dropdown | bowtie | standalone | null",
  "stem_excerpt": "<= 240 chars",
  "the_tell": "exact quoted descriptor that hands over the finding, or null",
  "visual_value": "essential | helpful | none",
  "target_renderer": "one of RENDERER_ENUM",
  "ambiguity_risk": "low | medium | high",
  "ambiguity_note": "one line — e.g. 'strip could render as flutter vs AFib'",
  "base_item_trust": "high | medium | low",
  "disposition": "replace | add_parallel | gap_generate | leave",
  "disposition_rationale": "one line",
  "concept_pair_id": "string if add_parallel, else null",
  "redundancy_cluster_id": "string if near-duplicate of other items, else null",
  "needs_human_review": true
}
```

### 5.2 `summary.json` — the decision layer

This is what gets read first to answer "rewrite vs. generate next week."

```json
{
  "totals": { "candidates_surfaced": 0, "after_cull": 0 },
  "value_by_disposition": {
    "essential_replace": 0,
    "essential_add_parallel": 0,
    "essential_gap_generate": 0,
    "helpful_add_parallel": 0,
    "...": 0
  },
  "by_category": { "category": count },
  "by_renderer": { "renderer": count },
  "redundancy_clusters": [
    { "cluster_id": "...", "qids": ["...", "..."], "note": "near-dup on X" }
  ],
  "top_review_flags": [ { "qid": "...", "why": "..." } ]
}
```

> `by_renderer` is the highest-value rollup: it tells you which renderer, built first after U0, unlocks the most conversions. That sets your post-U0 build order, not a guess.

---

## 6. Redundancy clustering (folded into the same pass)

While reading each item, cluster near-duplicates (same concept + same answer logic, differing only in surface wording). Assign shared `redundancy_cluster_id`. This is the audit-for-redundancy step you were going to run separately — do it here, once, on the same read.

---

## 7. Self-check before emitting

- Every `essential` has a non-null `the_tell` quoting the stem.
- No `target_renderer` outside `RENDERER_ENUM`.
- No item marked `replace` with `base_item_trust: low` (should be `leave` + rationale, or `gap_generate`).
- Every `add_parallel` has a `concept_pair_id`.
- `needs_human_review: true` on anything where value and disposition weren't both clearly determinable. Bias toward flagging.
- `summary.json` counts reconcile with `manifest.jsonl` row counts.
