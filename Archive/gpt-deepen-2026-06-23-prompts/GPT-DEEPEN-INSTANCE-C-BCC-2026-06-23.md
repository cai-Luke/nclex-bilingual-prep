# GPT Deepen Prompt — Instance C / bcc (2026-06-23)

Paste this entire file into one GPT chat. It includes the shared rules plus only this instance's assignment block.


**Audience:** parallel GPT chat instances *with* GitHub read access to `AGENTS.md` and `NCLEX-Question-Schema.md` (per DECISIONS principle 21). Defer all per-format *shape* to those docs; this spec carries only targeting + the semantic floor.
**Output:** raw bank JSON. A human saves it to `banks/banks-raw/`; it is later reviewed, validated, and promoted by other tools/people. **Generate only. Do not review, validate, or certify your own output.**

This is the third deepening batch. Rounds 1–2 (2026-06-22) closed the Management-of-Care tail and seeded bowtie/highlight on MoC / Pharm / SIC. Those landed (`gpt-canonical` 357 → 468). The census still shows the **format mix** as the dominant defect: `multiple_choice` 440 vs `bowtie` 95 and `highlight` 97 (item-type average 181.7). This round attacks only that — bowtie and highlight — on the topic cells the live coverage report flags, in their natural clinical homes.

---

## 0. How to use this prompt

Paste this entire file into one GPT chat. Then say:

> You are Instance <n>. Execute your assigned §3 block under the shared rules. You have repo read access — pull `NCLEX-Question-Schema.md` for exact shapes before emitting.

Run multi-turn, not one dump:

- Each turn starts with one anchor line: ID prefix, assigned topics, assigned formats.
- Each content turn emits about 5 items, then a brief manifest.
- Final turn emits the complete JSON envelope as a downloadable artifact.

Do not generate outside your assigned category/topic/format cells. Do not touch another instance's ID prefix. Do not pre-shuffle answer positions. Do not claim validation or review.

---

## 1. Mission

- `schemaVersion`: `1.6` (bowtie needs ≥1.4, highlight ≥1.3; the gpt-canonical floor is 1.6, so declare 1.6).
- Provenance lane: `gpt-` → routes to `gpt-canonical.json` (`CANONICAL_PREFIXES` in `lib/canonical-routing.ts`). If a maintainer reassigns generation to Gemini, change the prefix to `gemini-` and the file/ID stems accordingly; nothing else changes.
- ID pattern: `gpt_deepen_2026_06_23_<lane>_<nn>`
- File pattern: `gpt-deepen-2026-06-23-<lane>.json`
- **Formats this round: `bowtie` and `highlight` only.** No `multiple_choice`, `select_all`, `matrix`, `ordered_response`, `dropdown_cloze`, `fill_in_blank`, case-study metadata, or visuals. (fib/dropdown/ordered backfill on the diagnostic topics is the *next* batch, deliberately held out to keep this review pass tractable.)
- Closed-world stems: if an item turns on a threshold, protocol, lab cutoff, or escalation rule, state that rule inside the stem so the keyed answer survives external guideline drift.
- If a cell is underspecified or the format fits poorly, drop the item rather than force it — note the drop in the manifest.

---

## 2. Targeting

### Why these cells (grounding: `census.json` / `BANK-CENSUS.md`, generated 2026-06-23)

All eight Client-Needs categories already sit inside NCSBN's ±3 percentage-point tolerance, so category breadth is effectively saturated. The real gap is format: bowtie/highlight are at ~½ the item-type average. So this round is format-first. Cells are chosen to add bowtie/highlight **where the format is a genuine clinical fit** and, secondarily, to nudge the under-target categories (`Reduction of Risk Potential` −10, `Safety and Infection Control` −11, `Pharmacological and Parenteral Therapies` −11) toward their targets.

Two deliberate, accepted trade-offs (stated so review doesn't re-litigate them):
- **Bowtie's structural home is diagnostic synthesis**, which lives in `Physiological Adaptation` — already the most over-target category (+35). Bowtie placement there is capped at 4 items (lands ~+39, still under the ~49-item tolerance band).
- **Highlight's home is cue recognition**, which lands disproportionately in `Basic Care and Comfort` / `Psychosocial Integrity` (both slightly over target but with wide headroom). Accepted: the format defect is the real one, and these categories stay well inside tolerance after the batch.
- **Management of Care is not targeted** this round. Its −30 category gap is entirely inside saturated topics (`Prioritization & Delegation`, `Legal & Ethical Principles`, `Confidentiality & HIPAA` — all near or in AVOID), so chasing the number means piling onto saturated topics. It stays within tolerance; left as an accepted residual.

### Hard avoid — saturated topic labels (do not use as `topic`)

`Cardiovascular Disorders` · `Mental Health Disorders` · `Medication Safety & Admin` · `Prioritization & Delegation` · `Legal & Ethical Principles` · `Transmission-Based Precautions` · `Procedural Complications & Dialysis`

`topic` must be English-only and must match the exact label assigned in your §3 block.

---

## 3. Instance assignment

### Instance C — lane `bcc` — bowtie + highlight, Basic Care & Comfort — target 10

Anchor: prefix `gpt_deepen_2026_06_23_bcc_` · formats `bowtie` and `highlight` · distinct conditions/passages.

| id | topic (exact) | category | format | seed |
|----|---------------|----------|--------|------|
| _01 | Nutritional & Fluid Support | Basic Care and Comfort | bowtie | refeeding syndrome vs hyperglycemia vs fluid overload |
| _02 | Nutritional & Fluid Support | Basic Care and Comfort | highlight | enteral/TPN safety cues needing action (residuals, line, glucose) |
| _03 | Elimination & Comfort | Basic Care and Comfort | bowtie | bowel obstruction vs paralytic ileus vs constipation |
| _04 | Elimination & Comfort | Basic Care and Comfort | highlight | urinary-retention / catheter findings needing intervention |
| _05 | Mobility & Immobility | Basic Care and Comfort | bowtie | VTE / pulmonary embolism from immobility vs musculoskeletal pain vs anxiety |
| _06 | Mobility & Immobility | Basic Care and Comfort | highlight | immobility-complication cues (skin, respiratory, circulatory) |
| _07 | Sleep & Rest | Basic Care and Comfort | highlight | unsafe-sedation / sleep-hygiene findings to follow up |
| _08 | Sleep & Rest | Basic Care and Comfort | bowtie | obstructive sleep apnea vs central apnea vs primary insomnia |
| _09 | Palliative & Supportive Care | Basic Care and Comfort | bowtie | opioid-induced complication vs disease progression vs reversible cause |
| _10 | Palliative & Supportive Care | Basic Care and Comfort | highlight | uncontrolled-symptom / goals-of-care-mismatch cues |

Format mix: bowtie ×5, highlight ×5, all BCC.

**Batch totals:** 15 bowtie + 15 highlight = 30 items across 3 lanes. Conditions must be distinct across all 15 bowties (Instance A + C bowties share one pool — do not repeat a condition).

## 4. Item shape

Pull the exact `bowtie` and `highlight` structures from `NCLEX-Question-Schema.md` (§ Per-type structure 8–9). Do not restate schema shape from memory. The non-negotiable floor the docs leave to review:

- **Bowtie:** condition = exactly 1 correct of ≥3 tokens; actions = exactly 2 correct of ≥4; parameters = exactly 2 correct of ≥4. ≥1 distractor per zone. Token ids globally unique across the three zones. Actions stay in nursing scope or are explicitly prescribed/protocol-directed; parameters must be nursing-monitorable. Distractors are *plausible* competing conditions / wrong-but-tempting actions / irrelevant-but-related parameters — never filler.
- **Highlight:** ordered bilingual `segments`; ≥1 selectable distractor; never key every selectable segment; keyed ids must be selectable; passage order is clinically meaningful and fixed. The selection criterion lives in `stem`.
- Common: all `{en,zh}` pairs filled with natural Simplified Chinese (not word-for-word); `glossary` may be `[]` but 2–5 terms preferred; `ngnSkill` optional but encouraged (bowtie → usually `take_action`/`prioritize_hypotheses`; highlight → `recognize_cues`/`analyze_cues`).

---

## 5. Quality rules

- Bilingual parity on every learner-facing field.
- **Position-agnostic rationales** — never `Option A`, `the first choice`, `选项A`, `第一个`, `以上`, etc. Reference token/segment *content*.
- Per-token / per-segment rationale in `rationale.byChoice` where practical (required reading for review).
- Closed-world stems for any threshold/protocol/cutoff.
- Distinct bowtie conditions across the whole batch; distinct highlight passages.
- Do not pre-shuffle option/token order (promotion owns the shuffle).
- `topic` English-only, exact label from your block.

---

## 6. Brief manifest (after each turn)

```text
MANIFEST — Instance <n> — turn <t>
lane_anchor: prefix gpt_deepen_2026_06_23_<lane>_ · topics <assigned> · formats <assigned>
items_so_far: <count> / target 10
ids_used: gpt_deepen_2026_06_23_<lane>_01 … _<nn>
by_format: { bowtie: x, highlight: y }
by_topic: { <topic>: n }
bowtie_conditions: [ ... ]   # must stay distinct
checks: PASS or name the issue to fix before continuing
```

The manifest is a self-check, not review or validation.

---

## 7. Final output

Final turn emits one complete JSON envelope in a fenced `json` block:

```json
{
  "meta": {
    "schemaVersion": "1.6",
    "exam": "NCLEX-RN",
    "topic": "mixed",
    "category": "<dominant category for your lane, or 'mixed'>",
    "difficulty": "mixed",
    "count": <questions.length>
  },
  "questions": []
}
```

`meta.count` must equal `questions.length`. Save target: `banks/banks-raw/gpt-deepen-2026-06-23-bcc.json`.

Then stop. Cross-model review, source-checking, validation, promotion, and ledger updates happen downstream.

---

## 8. Downstream (maintainer / Claude gate — not the generator)

Standard pipeline per `AGENTS.md`: stage the three files in `banks/banks-raw/` → cross-model content review (the generating model never reviews its own batch) → `npm run normalize-raw-bank -- <file>` (review report) → `npm run promote` → `npm run audit` → `npm run consolidate` into `gpt-canonical.json` → delete raw drafts → `BANK-REVIEW-LEDGER.md` + `npm run census`.

Post-batch projection: bowtie 95 → 110, highlight 97 → 112; RRP/SIC/Pharm each move ~2–4 toward target. This is batch 1 of ~2–3 needed to bring both formats to ~180. The held-out next batch is `fill_in_blank` / `dropdown_cloze` / `ordered_response` on the diagnostic topics (DKA, Electrolyte Imbalances, Renal & GI, Burn, Reproductive & Endocrine) that the PRIORITIZE list pairs with those formats.
