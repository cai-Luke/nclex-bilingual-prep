# GPT Generation Spec — Fresh-Surfaces Batch (2026-06-22)

**Audience:** parallel GPT chat instances (no repo access).
**Output:** raw bank JSON, emitted in chat. A human saves it to `banks/banks-raw/`; it is then cross-model reviewed and Claude-gated before promotion. **You generate only. You do not review, validate, or certify your own output.**

---

## 0. How to deploy this

Open **four GPT chats**. Paste this shared document plus exactly one instance assignment block into each chat. Then give each chat one line:

> You are **Instance 1** (or 2 / 3 / 4). Execute your assigned block in §3 under the rules in §1–§2 and §5–§7.

To remove all cross-lane interference, keep only the §3 block owned by that instance. The avoid-list (§2) and the §5 constraints are shared and must stay; only the other instances' assignment blocks are noise.

Each instance owns a **disjoint ID namespace** and **disjoint topic×format cells**, so the four can run simultaneously with zero collision risk. Each runs **multi-turn**:

- **Open every turn** by re-anchoring (one line): your ID prefix, your assigned topics, your assigned formats. This is not ceremony — as your own JSON accumulates it pushes the rules below toward the back of context, and the model drifts into imitating its last items over the spec. Re-stating the lane each turn keeps the guardrails live at the front of attention.
- **Turn 1** — re-anchor, then emit your first 3–4 items **plus the running manifest (§6)**.
- **Turns 2…k** — re-anchor, emit the next 3–4 items, update and **re-run** the manifest checks (§6).
- **Final turn** — emit the complete envelope JSON (§7) for all your items, plus the final manifest.

Do not try to produce all items in one turn. The per-turn manifest is the mechanism that keeps SATA counts, ordered-response framings, bilingual/position-agnostic rationale, and visual arithmetic from drifting as the session grows.

**Do not:** write more than your target count, generate any item outside your assigned cells, touch another instance's ID prefix, pre-shuffle option order (§5.7), or claim your items are validated. A clean tally in your manifest is a sanity pass, **not** review — review is done by a different model and a human gate.

---

## 1. Mission & guardrails

This batch exists to **de-stale a 1524-item bank**, not to add raw volume. Freshness comes from (a) under-developed *formats* and (b) under-target *topic tails* — never from repeating saturated material.

- **schemaVersion: `1.6`** on every envelope. These items use standard fields only — no case-study unfolding metadata.
- **Provenance lane:** all output routes to the `gpt-` bank. Item IDs use `gpt_fresh_2026_06_22_<lane>_<nn>`; the saved file is `gpt-fresh-2026-06-22-<lane>.json`.
- **No self-review / no self-certification.** Producer ≠ checker.
- **Precision over volume.** A decision point too underspecified to yield one unambiguous answer is **dropped, not guessed**. Do not invent clinical facts to fill a quota.
- **Closed-world construction.** When an item turns on a protocol, threshold, or guideline value, state that rule *inside the stem or exhibit* ("Per unit protocol, notify the provider for urine output < 30 mL/hr…") so the keyed answer follows from the stated rule and survives external guideline drift. This is the primary defense against currency error.

---

## 2. Targeting — what to write, what to avoid

The bank is over-supplied in a handful of topics and two formats, and under-target in one category's *tail* plus the non-MC formats. Hit the gaps; stay off the saturated cells.

**HARD AVOID — do not write items on these topics (already saturated):**
Cardiovascular Disorders · Mental Health Disorders · Medication Safety & Admin (as a *topic label*) · Prioritization & Delegation · Legal & Ethical Principles · Transmission-Based Precautions.

**Do not add to the over-served category** Physiological Adaptation. Avoid net-new PhysAdapt items entirely in this batch.

**Format priority (most-starved first):** `bowtie` and `highlight` are at less than half the bank average — route here whenever the topic supports it. Then `ordered_response`, `fill_in_blank`, `dropdown_cloze`. **Use `matrix` and `select_all` sparingly** — both are already over-served; only where the content genuinely needs them.

**`topic` is English-only** and must be reused consistently (a navigational label, not study content). No CJK in `topic`. Keep to the existing topic vocabulary named in your block.

---

## 3. Instance assignment

Paste exactly one instance assignment block here.

---

## 4. Item-type templates (schema 1.6, lifted from the contract)

Every item carries the **common fields**: `id`, `itemType`, `category` (exact string from the controlled vocab), `topic` (English-only), `difficulty` (`easy|medium|hard`), optional `ngnSkill`, `stem{en,zh}`, `rationale`, `testTakingStrategy{en,zh}`, `glossary` (2–5 entries preferred, `[]` allowed). All `{en,zh}` pairs require both non-empty; `zh` is natural Simplified Chinese, not literal.

`rationale` = `{ "correct": {en,zh}, "byChoice": [ {refId, en, zh} ] }`. **`byChoice` is required for option types** (one per option). `refId` points to the per-type id (optionId / rowId / dropdownId / blankId / highlight segmentId / bowtie token id).

**multiple_choice** — `options` 3–5 (ids `A`,`B`,…), `correct` = array with exactly one id.

**select_all** — like MC, `options` 5–6, `correct` = one-or-more ids. (See SATA spread rule §5.4.)

**ordered_response** — `options` 4–6, `correct` = a permutation of **all** option ids in correct order. No top-level extras.

**fill_in_blank** — no `options`, no top-level `correct`. `blanks: [{ id, prompt{en,zh}, acceptable?: [str], numeric?: {value, tolerance, unit} }]`. Each blank needs `acceptable` or `numeric` (or both).

**matrix** — `matrix: { rows:[{id,en,zh}], columns:[{id,en,zh}], selectionMode: "single_per_row"|"multiple_per_row" }`, `correct: [{rowId, columnIds:[…]}]`, exactly one entry per row (`single_per_row` ⇒ `columnIds` length 1).

**dropdown_cloze** — `clozeStem{en,zh}` with `{{id}}` placeholders present in **both** languages; `dropdowns:[{ id, options:[{id,en,zh}], correct:<own option id> }]`. No top-level `correct`.

**highlight** (schema 1.3+) —
```json
{ "itemType":"highlight",
  "stem":{"en":"Highlight the findings that require immediate follow-up.","zh":"…"},
  "highlight":{
    "segments":[
      {"id":"s1","en":"0800 note:","zh":"0800 记录："},
      {"id":"s2","en":"BP 138/82.","zh":"血压 138/82。","selectable":true},
      {"id":"s3","en":"Urine output 12 mL over 4 hours.","zh":"4 小时尿量 12 毫升。","selectable":true}
    ],
    "correct":["s3"] } }
```
Rules: ≥1 selectable segment; **at least one selectable segment must be a distractor** (keying every selectable segment is invalid); `correct` non-empty, duplicate-free, every keyed id is selectable; segment order is fixed passage order.

**bowtie** (schema 1.4+, standalone only) — three zones: `condition` (one correct, ≥3 tokens), `actions` (exactly two correct, ≥4 tokens), `parameters` (exactly two correct, ≥4 tokens). Token ids globally unique across all three zones; within a zone, `en` unique and `zh` unique; each zone has ≥1 distractor. Max score is fixed at 5.
```json
{ "itemType":"bowtie",
  "bowtie":{
    "condition":{"prompt":{"en":"Most likely condition","zh":"最可能的病情"},
      "tokens":[{"id":"c1","en":"…","zh":"…"}],"correct":"c1"},
    "actions":{"prompt":{"en":"Actions to take","zh":"应采取的措施"},
      "tokens":[{"id":"a1","en":"…","zh":"…"}],"correct":["a1","a2"]},
    "parameters":{"prompt":{"en":"Parameters to monitor","zh":"应监测的指标"},
      "tokens":[{"id":"p1","en":"…","zh":"…"}],"correct":["p1","p2"]} } }
```

---

## 5. Hard constraints (all instances)

**5.1 Bilingual parity.** Every learner-facing `{en,zh}` pair filled, both non-empty. `zh` reads as natural Simplified Chinese.

**5.2 Position-agnostic rationales.** A rationale references option **content** ("furosemide is held because…"), never a letter or position. Forbidden in EN *and* zh: `Option A/B/…`, "the first/second/last choice", ordinal-by-position, and the zh equivalents `选项A`, `第一个/第二个/最后一个`, `以上/上述选项`. This makes the deterministic promotion shuffle safe.

**5.3 `topic` English-only.** CJK in `topic` fails a Tier-0 gate. Translation lives in stem/options/rationale, never the topic label.

**5.4 SATA spread (select_all only).** Spread `correct` counts across the legal `2…N−1` range. With 5 options use counts in {2,3,4}; with 6 use {2,3,4,5}. **No single count may exceed ~50% of your instance's select_all items.** Declare the running tally in your manifest.

**5.5 Ordered-response variation.** Vary the framing across your ordered_response items — prioritization vs. procedure-sequence vs. escalation-sequence — and vary option counts (4/5/6). **No two of your ordered_response items may share a stem template.** Track templates in the manifest.

**5.6 Visual necessity + arithmetic (Instance 3).** For every visual item:
- **Load-bearing:** the answer must be unresolvable without the visual. If the stem already states the value the learner would read off the visual, the visual is decorative and the item is invalid.
- `meta.visual_justification` (non-empty) is **required**, plus `meta.tier`, `meta.source`, `meta.skill_signature`, `meta.stem_disambiguators`.
- **Caption never reveals the answer.** No verdict, no computed value, no diagnosis in any caption/title/field.
- **MAR** — no arithmetic. Provide `meta.keyed_cells` (each resolving to a real `(medication,time)` cell) and/or non-null `meta.keyed_relationship`. Statuses: `given|held|due|missed|late|not_given`.
- **medication_label** — `order.unit` must equal `visual.amountUnit` (no cross-unit conversion). Compute:
  `concentration_per_ml = amount / perQty` (perUnit mL) · `volume_to_administer_ml = order.value / (amount/perQty)` · `rate_ml_per_hr = order.value / (amount/perQty)` · `quantity_to_administer_tablets|capsules = order.value / (amount/perQty)`. Round to `order.round` (default 1). If you key `concentration_per_ml`, set `showDerivedConcentration:false`.
  *Worked example:* heparin `amount 25000 units / perQty 250 mL` ⇒ 100 units/mL; order `dose_rate 1000 units/hr` ⇒ `rate_ml_per_hr = 1000/100 = 10`.
- **device_screen** — use only these clean derivations: `max_demands_1h = floor(60 / lockout_min)` · `max_dose_1h_mg = max_demands_1h × demand_dose (+ basal_rate only if mode includes basal)` · `infusion_duration_min = vtbi_ml / rate_ml_hr × 60` · `infusion_volume_ml = rate_ml_hr × duration_min / 60`. Round per `meta.round` (default 0). Avoid `delivered_dose_total_mg` (needs shift_hours bookkeeping — out of scope for this batch).
- Put every keyed value in `meta.derived_values_keyed` **and** show the one-line arithmetic in your manifest so the gate can verify it fast.

**5.7 Do not pre-shuffle.** Author the natural key; do **not** try to randomize or balance option positions. Deterministic position assignment happens at promotion. Worrying about answer placement is not your job and will be overwritten.

---

## 6. Running manifest (emit every turn)

After each turn's items, append an updated manifest block. Keep it terse.

```text
MANIFEST — Instance <n> — turn <t>
lane_anchor: prefix gpt_fresh_2026_06_22_<lane>_ · topics <my assigned list> · formats <my assigned list>   # restate every turn
items_so_far: <count> / target <T>
ids_used: gpt_fresh_2026_06_22_<lane>_01 … _<nn>   (sequential, no gaps)
by_format: { highlight: x, ordered_response: y, bowtie: z, … }
by_topic: { <topic>: n, … }
sata_count_tally: { 2: a, 3: b, 4: c }        # select_all only; none > 50%
ordered_templates: [ "priority-action", "ppe-doffing", … ]   # no repeats
visual_arithmetic:                              # Instance 3 only
  - gpt_fresh_2026_06_22_vis_03 medication_label rate_ml_per_hr = 1000 / (25000/250) = 10
flags: <anything dropped for underspecification, with one-line reason>
```

**Run these assertions every turn** (not just at the end), against the items emitted so far: every `{en,zh}` pair non-empty · no CJK in any `topic` · no position words in any rationale (EN/zh) · SATA tally respects the 50% cap · no ordered_response template repeated · (Instance 3) every `derived_values_keyed` matches its shown arithmetic · ids sequential and within your prefix. State the result as a one-line `checks: PASS` or name the failure. Re-running them each turn is the point — it pulls the rules back to the front of attention before you write the next items. Fix any failure before continuing, and again before emitting §7. **This tally is a per-turn sanity check, not review** — review is done by a different model and a human gate.

---

## 7. Final output (handoff)

Emit one envelope object — your entire batch — in a single fenced `json` block:

```json
{
  "meta": {
    "schemaVersion": "1.6",
    "exam": "NCLEX-RN",
    "topic": "mixed",
    "category": "<your category, or \"mixed\" for Instance 3>",
    "difficulty": "mixed",
    "count": <questions.length>
  },
  "questions": [ /* all your items */ ]
}
```

`meta.count` must equal `questions.length`. Save target: `banks/banks-raw/gpt-fresh-2026-06-22-<lane>.json`. Then stop — the human routes it through cross-model review → source-check → visual audit → promote → ledger.
