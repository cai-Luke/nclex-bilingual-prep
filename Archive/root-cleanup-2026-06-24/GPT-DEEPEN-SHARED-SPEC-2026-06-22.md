# GPT Generation Spec — MoC-tail + Bowtie Deepening (round 2, 2026-06-22)

**Audience:** parallel GPT chat instances with no repo access.
**Output:** raw bank JSON. A human saves it to `banks/banks-raw/`; it is later reviewed, validated, and promoted by other tools/people. **Generate only. Do not review, validate, or certify your own output.**

This is the second GPT batch for 2026-06-22. The goal is not bulk volume; it is to deepen the two remaining gaps: **Management of Care tail topics** and the **bowtie** format. No visual items in this round.

---

## 0. How to use this prompt

Paste this shared spec plus exactly one §3 instance block into a GPT chat. Then say:

> You are Instance <n>. Execute your assigned §3 block under the shared rules.

Run multi-turn instead of one giant dump:

- Each turn starts with one anchor line: ID prefix, assigned topics, assigned formats.
- Each content turn emits about 5–6 items, then a brief manifest.
- Final turn emits the complete JSON envelope for all items as a downloadable artifact.

Do not generate outside your assigned category/topic/format cells. Do not touch another instance's ID prefix. Do not pre-shuffle answer positions. Do not claim validation or review.

---

## 1. Mission

- `schemaVersion`: `1.6`
- Provenance lane: `gpt-`
- ID pattern: `gpt_deepen_2026_06_22_<lane>_<nn>`
- File pattern: `gpt-deepen-2026-06-22-<lane>.json`
- Standard standalone items only: no case-study unfolding metadata, no visuals.
- Use closed-world stems for local rules: if an item depends on a threshold, policy, escalation rule, or protocol, state it inside the stem/exhibit.
- If a decision point is underspecified, drop it instead of guessing.

---

## 2. Targeting

Avoid these saturated topics:

- `Cardiovascular Disorders`
- `Mental Health Disorders`
- `Medication Safety & Admin` as a topic label
- `Prioritization & Delegation`
- `Legal & Ethical Principles`
- `Transmission-Based Precautions`

Avoid these over-target categories entirely:

- `Physiological Adaptation`
- `Health Promotion and Maintenance`
- `Basic Care and Comfort`
- `Psychosocial Integrity`

Allowed categories this round:

- `Management of Care`
- `Pharmacological and Parenteral Therapies`
- `Safety and Infection Control`

Allowed formats this round:

- `bowtie`
- `highlight`
- `ordered_response`
- `dropdown_cloze`

Do not use `select_all`, `matrix`, or `multiple_choice` in this batch.

`topic` must be English-only and must match one of the topics in your assignment block.

---

## 3. Instance assignment

Paste exactly one instance block here.

---

## 4. Item Templates

Every item needs these common fields:

```json
{
  "id": "...",
  "itemType": "...",
  "category": "...",
  "topic": "...",
  "difficulty": "easy|medium|hard",
  "ngnSkill": "...",
  "stem": { "en": "...", "zh": "..." },
  "rationale": {
    "correct": { "en": "...", "zh": "..." },
    "byChoice": [
      { "refId": "...", "en": "...", "zh": "..." }
    ]
  },
  "testTakingStrategy": { "en": "...", "zh": "..." },
  "glossary": []
}
```

`ngnSkill` is optional. `glossary` may be `[]`, though 2–5 useful terms are preferred.

All learner-facing `{en,zh}` pairs must be filled. Chinese should be natural Simplified Chinese, not literal word-for-word translation.

### highlight

```json
{
  "itemType": "highlight",
  "highlight": {
    "segments": [
      { "id": "s1", "en": "0800 — handoff given to oncoming RN.", "zh": "0800 — 已向接班护士交班。" },
      { "id": "s2", "en": "0815 — client diagnosis discussed with a visitor without consent.", "zh": "0815 — 未经同意向访客讨论患者诊断。", "selectable": true },
      { "id": "s3", "en": "0830 — vital signs charted.", "zh": "0830 — 已记录生命体征。", "selectable": true }
    ],
    "correct": ["s2"]
  }
}
```

Rules: at least one selectable distractor; keyed segment IDs must be selectable; preserve passage order.

### ordered_response

Use 4–6 options. `correct` is a permutation of all option IDs in the correct order.

```json
{
  "itemType": "ordered_response",
  "options": [
    { "id": "A", "en": "...", "zh": "..." },
    { "id": "B", "en": "...", "zh": "..." }
  ],
  "correct": ["B", "A"]
}
```

### dropdown_cloze

Use `{{id}}` placeholders in both English and Chinese cloze stems. Each dropdown has its own `correct` option ID. No top-level `correct`.

```json
{
  "itemType": "dropdown_cloze",
  "clozeStem": {
    "en": "The nurse should {{action}} and monitor {{parameter}}.",
    "zh": "护士应{{action}}，并监测{{parameter}}。"
  },
  "dropdowns": [
    {
      "id": "action",
      "options": [
        { "id": "a1", "en": "...", "zh": "..." },
        { "id": "a2", "en": "...", "zh": "..." }
      ],
      "correct": "a1"
    }
  ]
}
```

### bowtie

Standalone only. Three zones:

- `condition`: exactly one correct token, at least 3 tokens
- `actions`: exactly two correct tokens, at least 4 tokens
- `parameters`: exactly two correct tokens, at least 4 tokens

Each zone needs at least one distractor. Token IDs must be unique across all zones.

```json
{
  "itemType": "bowtie",
  "bowtie": {
    "condition": {
      "prompt": { "en": "Condition the client is developing", "zh": "患者正在发生的情况" },
      "tokens": [
        { "id": "c1", "en": "...", "zh": "..." }
      ],
      "correct": "c1"
    },
    "actions": {
      "prompt": { "en": "Two actions to take", "zh": "应采取的两项措施" },
      "tokens": [
        { "id": "a1", "en": "...", "zh": "..." }
      ],
      "correct": ["a1", "a2"]
    },
    "parameters": {
      "prompt": { "en": "Two parameters to monitor", "zh": "应监测的两项指标" },
      "tokens": [
        { "id": "p1", "en": "...", "zh": "..." }
      ],
      "correct": ["p1", "p2"]
    }
  }
}
```

---

## 5. Quality Rules

Keep these tight:

- Bilingual parity: every learner-facing English field has a natural Simplified Chinese counterpart.
- Position-agnostic rationales: do not say “Option A,” “the first choice,” “the last choice,” `选项A`, `第一个`, `最后一个`, or similar position references.
- Topics are English-only.
- Bowtie actions stay in nursing scope or are explicitly prescribed/protocol-directed.
- Bowtie parameters must be nursing-monitorable.
- Do not reuse the same bowtie condition within your batch.
- Vary ordered-response framing and option counts when possible.
- Do not pre-shuffle option order.

---

## 6. Brief Manifest

After each generation turn, append:

```text
MANIFEST — Instance <n> — turn <t>
lane_anchor: prefix gpt_deepen_2026_06_22_<lane>_ · topics <assigned topics> · formats <assigned formats>
items_so_far: <count> / target <T>
ids_used: gpt_deepen_2026_06_22_<lane>_01 … _<nn>
by_format: { highlight: x, ordered_response: y, bowtie: z, dropdown_cloze: w }
by_topic: { <topic>: n }
ordered_templates: [ ... ]
bowtie_conditions: [ ... ]
checks: PASS or name the issue to fix before continuing
```

The manifest is only a self-check, not review or validation.

---

## 7. Final Output

Final turn emits one complete JSON envelope in a fenced `json` block:

```json
{
  "meta": {
    "schemaVersion": "1.6",
    "exam": "NCLEX-RN",
    "topic": "mixed",
    "category": "<your category>",
    "difficulty": "mixed",
    "count": <questions.length>
  },
  "questions": []
}
```

`meta.count` must equal `questions.length`.

Save target: `banks/banks-raw/gpt-deepen-2026-06-22-<lane>.json`.

Then stop. Review, source-checking, validation, promotion, and ledger updates happen downstream.
