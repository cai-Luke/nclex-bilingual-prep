# Terminal-Sentence Independent Checker Pilot — Delivery Summary

**Model slug:** `claude-opus-4-thinking`
**Queue source:** `audit/terminal-sentence-semantic-census-2026-07-21/queue.jsonl`
**Queue row count:** 64
**Adjudication row count:** 64
**Git branch:** `main`
**Git HEAD:** `0be2540d9d3b88d0737cd03e7536ff6eb057d5f8`
**Blind boundary honoured:** Yes — did not read `audit/terminal-sentence-sonnet-review-2026-07-21/**`
**Files modified outside output directory:** None (read-only operation)

---

## Verdict Distribution

| Verdict | Count | Percentage |
|---------|-------|------------|
| PASS    | 48    | 75.0%      |
| FLAG    | 12    | 18.8%      |
| REVIEW  | 4     | 6.3%       |

## Primary Class Distribution

| Primary Class | Count |
|---|---|
| LEGITIMATE_RESPONSE_DEMAND | 40 |
| DUPLICATED_RESPONSE_SCAFFOLD | 5 |
| AMBIGUOUS_TERMINAL_FUNCTION | 4 |
| AUTHORIAL_CONSTRAINT_LEAK | 4 |
| LEGITIMATE_CLINICAL_FACT | 4 |
| LEGITIMATE_CALCULATION_OR_ROUNDING_INSTRUCTION | 3 |
| ANSWER_TELEGRAPHING_OR_ADJUDICATION_NOTE | 1 |
| CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE | 1 |
| ITEM_DESIGN_COMPENSATION | 1 |
| LEGITIMATE_GOVERNING_PROTOCOL_OR_ORDER | 1 |

## Defect Clusters

### Cluster 1: `dropdown_cloze` stem–clozeStem duplication (5 FLAGs)

**Rows:** 14, 16, 17, 19, 20 (ordinals)
**Question IDs:** `gap_50_bcc_05`, `gap_50_sic_08`, `gap_50_sic_09`, `gap_50_ppt_07`, `gap_50_ppt_08`
**Bank:** `gemini-canonical.json`

All five items share the same structural defect: the ordinary `stem` field's terminal sentence contains `{{1}}` and `{{2}}` cloze placeholders that render **literally as raw braces** to the learner. The `DropdownClozeControl` renderer only replaces `{{n}}` tokens in `clozeStem`, not in `stem`. The learner therefore sees:
1. The raw-brace text in the `stem` area (via `BilingualText`)
2. The functional dropdown controls in the `clozeStem` area (via `ClozeLine`)

In most cases, the stem's terminal sentence is identical or near-identical to the `clozeStem`, making it a duplicate of the response scaffold with a template leak.

**Recommended next step:** `RENDERER_OR_SCHEMA_PLACEMENT_CHECK` — audit all `dropdown_cloze` items for stem sentences containing `{{n}}` tokens and either remove them from `stem` or move the clinical context from `stem` to a location that doesn't render raw tokens.

### Cluster 2: `"This item/question"` authorial constraint pattern (4 FLAGs)

**Rows:** 31, 33, 38, 50 (ordinals)
**Question IDs:** `gpt_format10b_free_water_deficit`, `gpt_format10b_rapid_shallow_breathing_index`, `gpt_format8a_pf_ratio`, `gpt_format11b_pediatric_oxygenation_index`
**Bank:** `gpt-canonical.json`

All four items use meta-referential language ("This item asks only for…", "This item tests arithmetic only", "This question asks only for…") that addresses the test artifact rather than the clinical world. Each contains a valid clinical caution (e.g., "a ratio alone does not diagnose ARDS") but delivers it through authorial framing. The penultimate sentence in each case already provides the calculation instruction. These could be naturalized to remove the meta-referential construction language while preserving the clinical caution.

**Recommended next step:** `FULL_ITEM_REVIEW` — rewrite terminal sentences to remove "This item/question" framing while preserving clinical cautions.

### Cluster 3: Ambiguous boundary between clinical caution and item-scope defense (4 REVIEWs)

**Rows:** 42, 47, 49, 51 (ordinals)
**Question IDs:** `gpt_format9b_montevideo_units`, `gpt_format11b_rutherford_iib_limb_threat`, `gpt_format11b_giant_cell_arteritis_cues`, `gpt_format11b_ankle_brachial_index`
**Bank:** `gpt-canonical.json`

These sentences contain clinically valid cautions but also function as construct-scope boundaries. Unlike the Cluster 2 pattern, they do **not** use explicit meta-referential language ("This item…"). Instead they use phrases like "from this number alone", "do not infer the class from pain alone", "do not diagnose from an inflammatory marker alone". The boundary between legitimate clinical teaching and authorial scope defense is genuinely ambiguous.

**Recommended next step:** `OWNER_ADJUDICATION` — these require a human judgment call about whether the sentences serve the learner's clinical understanding or primarily defend the item's construct scope.

### Single defect: Answer-telegraphing distractor design note (1 FLAG)

**Row:** 48 (ordinal)
**Question ID:** `gpt_format11b_retinal_detachment_emergency_cues`
**Bank:** `gpt-canonical.json`

The sentence "Stable longstanding findings are included as near-misses" tells the learner how the distractors were constructed. "Near-misses" is distractor-construction vocabulary. The Chinese translation `近似干扰项` makes the authorial provenance even more explicit.

**Recommended next step:** `DELETION_CANDIDATE` — remove the sentence entirely. The learner should distinguish urgent from stable findings based on clinical knowledge.

### Single defect: Construct-scope defense via NCLEX-RN reference (1 FLAG)

**Row:** 57 (ordinal)
**Question ID:** `cs_sepsis_shock_01` / `cs_sepsis_shock_01_part_1`
**Bank:** `hard-cases-canonical.json`

The parenthetical "(a foundational infection-response framework still tested on the NCLEX-RN)" defends the use of SIRS criteria by referencing exam coverage. The core matrix response demand is legitimate; only the parenthetical is construction language.

**Recommended next step:** `FULL_ITEM_REVIEW` — remove or shorten the parenthetical while keeping the SIRS classification instruction.

### Single defect: Item-design compensation for format limitation (1 FLAG)

**Row:** 34 (ordinal)
**Question ID:** `gpt_format10c_pediatric_rabies_pep_sequence`
**Bank:** `gpt-canonical.json`

"Keep human rabies immune globulin (HRIG) and the day-0 vaccine together as one same-visit milestone" compensates for the ordered-response format's limitation: it cannot represent simultaneous events. The sentence is needed for answer validity but addresses the test format rather than clinical reality.

**Recommended next step:** `FULL_ITEM_REVIEW` — consider whether the ordered-response format is appropriate for this clinical sequence, or rewrite option C to make the same-visit nature self-evident.

## Control Sentence Review

8 rows had `controlSelected = true`. All 8 control sentences received `PASS` verdicts:

| Ordinal | QueueIndex | Control Sentence Summary | Control Class |
|---|---|---|---|
| 1 | 58 | "Which statements should the nurse include in the education?" | LEGITIMATE_RESPONSE_DEMAND |
| 25 | 1493 | "The nurse is counseling a sedentary adult about physical activity…" | LEGITIMATE_CLINICAL_FACT |
| 29 | 2131 | Facility respiratory-protection pathway procedural steps | LEGITIMATE_GOVERNING_PROTOCOL_OR_ORDER |
| 35 | 2180 | "During urgent occupational-health evaluation, the clinician determines…" | LEGITIMATE_CLINICAL_FACT |
| 36 | 2182 | "If treatment remains necessary after 6 months, sessions may be spaced…" | LEGITIMATE_CLINICAL_FACT |
| 40 | 2193 | "The client is not known to be hypoxemic." | LEGITIMATE_CLINICAL_FACT |
| 48 | 2228 | "Highlight only the findings that require urgent retinal evaluation…" | LEGITIMATE_RESPONSE_DEMAND |
| 51 | 2232 | "Calculate the right ankle–brachial index and round to two decimal places." | LEGITIMATE_CALCULATION_OR_ROUNDING_INSTRUCTION |

## Inspection Depth Summary

| Depth | Count |
|---|---|
| QUEUE_AND_LIVE_ITEM | 55 |
| QUEUE_LIVE_ITEM_AND_RENDERER | 9 |

Renderer-depth inspection was used for all `dropdown_cloze` items (to confirm `DropdownClozeControl` does not replace `{{n}}` tokens in `stem`) and the `fill_in_blank` CDC hand-washing item (to confirm `FillInBlankControl` renders `____` literally from stem and inputs from `blanks[]`).

## Output Files

```
audit/terminal-sentence-independent-checker-pilot-2026-07-22/claude-opus-4-thinking/
├── pilot-adjudication.jsonl   (64 rows, validated)
└── delivery.md                (this file)
```
