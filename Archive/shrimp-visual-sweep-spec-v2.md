# Project Shrimp — Visual Conversion & Redundancy Sweep Spec (v2)

**For:** Gemini (large-context triage pass)
**Pass type:** Read-only audit. **No rewriting, no generation.**
**Governing principle:** Precision over volume. When uncertain, flag for human review — never force a disposition or inflate a bucket.

---

## 0. Why v2 (read this first)

The v1 run produced a structurally invalid manifest. It must not happen again. Specifically:

- **Disposition was a 1:1 function of value** across all 316 rows (essential→replace, helpful→add_parallel, none→leave). The two-axis design was ignored; disposition was templated, not reasoned.
- **`base_item_trust` was the constant `"high"` on every row.** The field was never actually assessed.
- **`the_tell` was populated only on the 3 essentials.** It was used to annotate conclusions, not to reach them.
- **Redundancy clusters were renderer-groupings**, keyed as `cluster_{renderer}`, including a junk `cluster_null` of unrelated items sharing only a null renderer.

v2 reorders the procedure so these fields are *inputs to* the judgment rather than decorations on it, and adds rejection gates that catch templating.

---

## 1. Scope (narrowed from v1)

This pass decides one of three dispositions per item: **`replace` · `add_parallel` · `leave`.**

`gap_generate` is **removed** from this pass. A read-only sweep over existing items cannot discover gaps (gaps are absences); doing so requires a separate pass against an NGN coverage blueprint. Do not emit `gap_generate`.

---

## 2. Inputs

- **The full question objects** — stem, all options, the answer key, and the rationale. **Not** stem excerpts. `base_item_trust` and the "does the visual test something the text doesn't" judgment are unknowable from a stem alone; if you only have stems, stop and say so rather than defaulting the fields.
- Renderer registry enum (pin to actual U0 registry before running):

```
RENDERER_ENUM = [
  "ecg_rhythm_strip", "fetal_monitor_tracing", "chest_tube_drainage",
  "burn_body_map", "wound_stage_diagram", "lab_panel", "vitals_trend",
  "intake_output_chart", "mar", "device_settings_screen", null
]
```

- **Process the bank in batches of ~25–40 items, not one monolithic context.** Uniform templating across hundreds of rows is the large-context laziness failure mode; small batches force per-item attention. Emit records per batch and concatenate.

---

## 3. Hard prohibitions

- Do not rewrite any question or draft replacement content.
- Do not generate new questions.
- Do not invent renderers outside `RENDERER_ENUM`.
- Do not assign a `target_renderer` unless the finding that renderer would display is a **datum actually present in the question**. An I&O chart on a warfarin-teaching SATA item is a mis-assignment — set `null` instead. Record why in `renderer_justification`.

---

## 4. Procedure — in this order, per item

The order matters. Value and disposition are *derived from* evidence gathered in earlier steps, not asserted.

1. **Extract `the_tell`.** Quote the exact phrase(s) in the stem/options that name a clinical finding (e.g. "irregularly irregular," "peaked T waves," "variable decelerations," "slough," "widening pulse pressure"). If no finding descriptor exists, `the_tell: null`. Do this for *every* item before scoring value.
2. **Assign `target_renderer` + `renderer_justification`.** Name the specific datum the renderer would display. If none, `null`.
3. **Derive `visual_value` from the tell:**
   - `essential` — a tell exists **and** it is the finding the question is testing (the text hands over the answer). A visual converts recall → interpretation.
   - `helpful` — either a tell exists but is incidental (not the tested point), or no tell but a visual adds realism/NGN format to a legitimately text-answerable item.
   - `none` — a visual adds nothing (delegation, therapeutic communication, ethics, prioritization, pharm teaching with no renderable datum).
4. **Assess `base_item_trust` against the key + rationale** (not the stem): is the answer key correct and the rationale sound? `high / medium / low`. A constant value across a batch is invalid — if you cannot distinguish trust levels you lack the full item (see §2).
5. **Decide `disposition` with a text-grounded reason:**
   - `replace` — `essential` value, `base_item_trust: high`, and the stem is a disguised-recall item. The `disposition_rationale` must reference the specific stem text being made redundant.
   - `add_parallel` — the text item independently tests something the visual version wouldn't (name it in the rationale, e.g. "text tests prioritization reasoning; visual would test rhythm ID"). Set `concept_pair_id`.
   - `leave` — `none` value, **or** `essential`/`helpful` value with `base_item_trust` below high (note that a clean regeneration, not an in-place rewrite, may be warranted).

---

## 5. Anti-degeneracy gates (the run is REJECTED if any fire)

Before emitting, verify and report each:

- **Disposition independence:** disposition is NOT a 1:1 function of value. If every `essential` is `replace` and every `helpful` is `add_parallel` with no exceptions, you templated — redo with full items.
- **Trust variance:** `base_item_trust` is not constant across the manifest.
- **Tell coverage:** `the_tell` is non-null on a meaningful share of `helpful`/`essential` items, not only the essentials.
- **Renderer integrity:** no `target_renderer` assigned without a `renderer_justification` naming a present datum.
- **Cluster integrity:** no `redundancy_cluster_id` derived from a renderer name; no cluster keyed on `null`.

Report the result of each gate in `summary.json.gates`.

---

## 6. Redundancy clustering

Cluster only **genuine near-duplicates**: same concept *and* same answer logic, differing in surface wording. Use pairwise comparison of concept + key.
- **Forbidden:** clustering on shared `target_renderer`. Sharing a renderer is not redundancy.
- **Forbidden:** any cluster of items whose only commonality is `null` renderer.
- Items with no near-duplicate get `redundancy_cluster_id: null` and are NOT clustered together.

---

## 7. Output

### 7.1 `manifest.jsonl` — one record per candidate

```json
{
  "qid": "string",
  "category": "string",
  "ngn_item_type": "case_study | matrix_grid | trend | cloze_dropdown | bowtie | standalone | null",
  "the_tell": "exact quoted descriptor(s), or null",
  "target_renderer": "one of RENDERER_ENUM",
  "renderer_justification": "the present datum the renderer would display, or why null",
  "visual_value": "essential | helpful | none",
  "ambiguity_risk": "low | medium | high",
  "ambiguity_note": "one line",
  "base_item_trust": "high | medium | low",
  "trust_note": "one line referencing the key/rationale",
  "disposition": "replace | add_parallel | leave",
  "disposition_rationale": "one line grounded in the item's text",
  "concept_pair_id": "string if add_parallel, else null",
  "redundancy_cluster_id": "string if genuine near-dup, else null",
  "needs_human_review": true
}
```

### 7.2 `summary.json`

```json
{
  "totals": { "items_read": 0, "candidates": 0 },
  "gates": {
    "disposition_independent": true,
    "trust_variance": true,
    "tell_coverage_ok": true,
    "renderer_integrity": true,
    "cluster_integrity": true
  },
  "value_by_disposition": { "essential_replace": 0, "helpful_add_parallel": 0, "...": 0 },
  "by_category": { "category": 0 },
  "by_renderer": { "renderer": 0 },
  "redundancy_clusters": [ { "cluster_id": "...", "qids": ["..."], "shared_concept": "..." } ],
  "top_review_flags": [ { "qid": "...", "why": "..." } ]
}
```

> The decision you care about lives in `value_by_disposition.essential_replace` vs `helpful_add_parallel`, and in `by_renderer` (read after discounting any renderer whose `renderer_justification` entries look strained). All five `gates` must be `true` for the run to be usable.

---

## 8. Self-check before emitting

- Procedure run in §4 order; value and disposition derived, not asserted.
- All five §5 gates pass and are reported in `summary.json.gates`.
- Every `essential` has a non-null `the_tell`; tells also appear across `helpful` items.
- No `replace` with `base_item_trust` below `high`.
- No renderer without a justification; no cluster keyed on renderer or null.
- Counts in `summary.json` reconcile with `manifest.jsonl`.
