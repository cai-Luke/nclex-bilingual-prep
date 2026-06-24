# GPT Generation Spec — MoC-tail + Bowtie Deepening (round 2, 2026-06-22)

**Audience:** parallel GPT chat instances (no repo access).
**Output:** raw bank JSON, emitted as a downloadable UTF-8 file. A human saves it to `banks/banks-raw/`; it is then cross-model reviewed and Claude-gated before promotion. **You generate only. You do not review, validate, or certify your own output.**

This is the **second** round into the same bank. The first round (`gpt_fresh_2026_06_22_*`, ~34 items) merged cleanly and moved the targeted gaps in the right direction; it did **not** close them. This round concentrates on the two deepest remaining holes: **Management of Care** (227 vs target 280, the dominant category gap) and the **bowtie** format (70 vs ~173 average, the deepest format gap on the board). The visual lane is intentionally dropped — those kinds are adequately seeded now.

---

## 0. How to deploy this

Open **four GPT chats**. Paste this entire document into each. Then give each chat one line:

> You are **Instance 1** (or 2 / 3 / 4). Execute your assigned block in §3 under the rules in §1–§2 and §5–§7.

**To remove all cross-lane interference, delete the three §3 blocks you do not own before pasting** — keep §0–§2, your one §3 block, and §4–§7. (Self-contained per-instance files can be supplied instead.) The avoid-list (§2) and the §5 constraints are shared and must stay; only the other instances' assignment blocks are noise.

Each instance owns a **disjoint ID namespace** and **disjoint topic×format cells**, so the four run simultaneously with zero collision risk. The `deepen` tag keeps every ID clear of the merged `fresh` batch. *(If you run this after 2026-06-22, bump the date token in your prefix; the `deepen` tag already prevents collision regardless.)* Each instance runs **multi-turn**:

- **Open every turn** by re-anchoring (one line): your ID prefix, your assigned topics, your assigned formats. This is not ceremony — as your own JSON accumulates it pushes the rules below toward the back of context and the model drifts into imitating its last items over the spec. Re-stating the lane each turn keeps the guardrails live at the front of attention.
- **Turn 1** — re-anchor, then emit your first **5–6 items** plus the running manifest (§6).
- **Turns 2…k** — re-anchor, emit the next **5–6 items**, update and **re-run** the manifest checks (§6).
- **Final turn** — produce the complete batch as a downloadable file (§7) plus the final manifest.

Do not produce all items in one turn. The per-turn manifest is what keeps bowtie zones, ordered-response framings, bilingual/position-agnostic rationale, and clean UTF-8 from drifting as the session grows.

**Do not:** exceed your target, generate any item outside your assigned cells, touch another instance's prefix, use `select_all`/`matrix` (both over-served — not in any block this round), pre-shuffle option order (§5.6), or claim your items are validated.

---

## 1. Mission & guardrails

- **schemaVersion: `1.6`** on every envelope. Standard fields only — no case-study unfolding metadata, no visuals this round.
- **Provenance lane:** output routes to the `gpt-` bank. Item IDs use `gpt_deepen_2026_06_22_<lane>_<nn>`; the saved file is `gpt-deepen-2026-06-22-<lane>.json`.
- **No self-review / no self-certification.** Producer ≠ checker.
- **Precision over volume.** A decision point too underspecified to yield one unambiguous answer is **dropped, not guessed**. Do not invent clinical facts to fill a quota.
- **Closed-world construction.** When an item turns on a protocol, threshold, or escalation rule, state that rule *inside the stem or exhibit* ("Per facility protocol, notify the provider for SpO₂ < 92%…") so the keyed answer follows from the stated rule and survives external guideline drift.

---

## 2. Targeting — what to write, what to avoid

**HARD AVOID — do not write items on these topics (saturated):**
Cardiovascular Disorders · Mental Health Disorders · Medication Safety & Admin (as a *topic label*) · **Prioritization & Delegation** · **Legal & Ethical Principles** · Transmission-Based Precautions.

(The two bolded ones are the MoC headline topics. They are *why* the MoC category is hard to fill — it must come from the **tail**, never from these.)

**Do not write any item whose category is over target** this round: Physiological Adaptation · Health Promotion and Maintenance · Basic Care and Comfort · Psychosocial Integrity. Every item you produce lands in **Management of Care**, **Pharmacological and Parenteral Therapies**, or **Safety and Infection Control** (the three under-target categories).

**Format priority:** `bowtie` is the deepest gap and three of four instances lean on it — it is also the freshness lever, since the least-used format reads as the least stale. `highlight` and `ordered_response` are the next gaps. `dropdown_cloze` fills a smaller one. No `select_all`, `matrix`, or `multiple_choice` this round.

**`topic` is English-only**, reused consistently from the lists in your block (a navigational label, not study content). No CJK in `topic`.

---

## 3. Instance assignments

Counts per format are guidance (±1 fine); the **category and topic×format grid are binding**.

### Instance 1 — MoC-tail process · highlight + ordered_response
- **ID prefix:** `gpt_deepen_2026_06_22_moc_`  ·  **file:** `gpt-deepen-2026-06-22-moc.json`
- **category (all items):** `Management of Care`
- **Topics (this instance only):** `Confidentiality & HIPAA` · `Conflict Resolution` · `Client Advocacy` · `Discharge Planning & Handoff`
- **Formats & target:** ~12 — **~7 `highlight`**, **~5 `ordered_response`**.
- **Surfaces:** incident-report excerpt · SBAR/handoff note · discharge-instruction sheet · disclosure-log entry. For `highlight`, segments are the chart/note lines; the task is "highlight the HIPAA breach / the missing handoff element / the entry that contradicts the client's stated wishes." For `ordered_response`, sequence a disclosure-response workflow, a discharge-readiness workflow, or a conflict-resolution escalation.

### Instance 2 — MoC escalation & emergency · bowtie + ordered_response
- **ID prefix:** `gpt_deepen_2026_06_22_esc_`  ·  **file:** `gpt-deepen-2026-06-22-esc.json`
- **category (all items):** `Management of Care`
- **Topics (this instance only):** `Chain of Command & Escalation` · `Disaster & Emergency Preparedness` · `Advance Directives / DNR`
- **Formats & target:** ~10 — **~6 `bowtie`**, **~4 `ordered_response`**.
- **Bowtie framing (this is how bowtie fits a process category):** the **condition** zone is a recognize-the-situation cue (a deteriorating post-op client; a mass-casualty triage scene; a client whose code status conflicts with a new order). **Actions** = escalation/command steps in nursing scope (notify the rapid-response team; apply START triage tags; verify the documented directive before acting). **Parameters** = what to report or monitor up the chain. For `ordered_response`, sequence an escalation chain or a triage/decontamination order.

### Instance 3 — Pharmacological bowtie · bowtie + dropdown_cloze
- **ID prefix:** `gpt_deepen_2026_06_22_bow_`  ·  **file:** `gpt-deepen-2026-06-22-bow.json`
- **category (all items):** `Pharmacological and Parenteral Therapies` (under target, 232 vs 249)
- **Topics:** `Anticoagulant Therapy` · `Cardiovascular & Endocrine Medications` · `Psychotropic Medications` · `Parenteral Nutrition`
- **Formats & target:** ~12 — **~8 `bowtie`** (med-centered toxicity/adverse-effect synthesis: anticoagulant over-effect, clozapine/lithium toxicity, insulin error, refeeding on TPN), **~4 `dropdown_cloze`** (cardiovascular/endocrine med reasoning).
- **Note:** keep the bowtie **condition** zone a toxicity/adverse-effect/complication; **actions** in nursing scope or framed as prescribed/protocol-directed; **parameters** nursing-monitorable.

### Instance 4 — Safety & Infection Control (non-saturated) · highlight + ordered_response + bowtie
- **ID prefix:** `gpt_deepen_2026_06_22_sic_`  ·  **file:** `gpt-deepen-2026-06-22-sic.json`
- **category (all items):** `Safety and Infection Control` (under target, 188 vs 203)
- **Topics — NOT Transmission-Based Precautions and NOT Patient & Environment Safety (saturated):** `PPE & Sterile Technique` · `Standard Precautions & Hygiene` · `Fall prevention` · `Environmental safety and equipment checks`
- **Formats & target:** ~8 — **~4 `highlight`** (spot the breach in a procedure note / environment checklist), **~2 `ordered_response`** (PPE doff sequence, sterile-field setup), **~2 `bowtie`** (a sterile-technique or equipment-hazard recognition → actions → parameters).

---

## 4. Item-type templates (schema 1.6)

Every item carries the **common fields**: `id`, `itemType`, `category` (exact controlled-vocab string), `topic` (English-only), `difficulty` (`easy|medium|hard`), optional `ngnSkill`, `stem{en,zh}`, `rationale`, `testTakingStrategy{en,zh}`, `glossary` (2–5 entries preferred; `[]` allowed). Every `{en,zh}` pair has both sides non-empty; `zh` is natural Simplified Chinese.

`rationale` = `{ "correct": {en,zh}, "byChoice": [ {refId, en, zh} ] }`. **`byChoice` is required** with one entry per option/segment/dropdown/token (`refId` points to the per-type id).

**highlight** —
```json
{ "itemType":"highlight",
  "stem":{"en":"Highlight the entry that is a HIPAA breach.","zh":"…"},
  "highlight":{
    "segments":[
      {"id":"s1","en":"0800 — handoff given to oncoming RN.","zh":"…"},
      {"id":"s2","en":"0815 — client's diagnosis discussed with visitor at bedside without consent.","zh":"…","selectable":true},
      {"id":"s3","en":"0830 — vital signs charted.","zh":"…","selectable":true}
    ],
    "correct":["s2"] } }
```
Rules: ≥1 selectable segment; **at least one selectable segment must be a distractor** (keying every selectable segment is invalid); `correct` non-empty, duplicate-free, every keyed id selectable; segments in fixed passage order.

**ordered_response** — `options` 4–6 (ids `A`,`B`,…), `correct` = a permutation of **all** option ids in correct order. No top-level extras.

**dropdown_cloze** — `clozeStem{en,zh}` with `{{id}}` placeholders present in **both** languages; `dropdowns:[{ id, options:[{id,en,zh}], correct:<own option id> }]`. No top-level `correct`.

**bowtie** (standalone only; max score fixed at 5) — three zones: `condition` (one correct, ≥3 tokens), `actions` (exactly two correct, ≥4 tokens), `parameters` (exactly two correct, ≥4 tokens). Token ids globally unique across all three zones; within a zone `en` unique and `zh` unique; each zone has ≥1 distractor.
```json
{ "itemType":"bowtie",
  "bowtie":{
    "condition":{"prompt":{"en":"Condition the client is developing","zh":"…"},
      "tokens":[{"id":"c1","en":"…","zh":"…"}],"correct":"c1"},
    "actions":{"prompt":{"en":"Two actions to take","zh":"…"},
      "tokens":[{"id":"a1","en":"…","zh":"…"}],"correct":["a1","a2"]},
    "parameters":{"prompt":{"en":"Two parameters to monitor","zh":"…"},
      "tokens":[{"id":"p1","en":"…","zh":"…"}],"correct":["p1","p2"]} } }
```

---

## 5. Hard constraints (all instances)

**5.1 Bilingual parity + clean UTF-8.** Every `{en,zh}` pair filled, both non-empty, `zh` natural. Emit clean UTF-8 and keep the bytes in the downloadable file (§7) rather than pasting through a terminal. Do not self-certify encoding: a generating model can't inspect its own output bytes, so encoding integrity (stray replacement characters and the like) is enforced downstream by a deterministic gate scan, not by you.

**5.2 Position-agnostic rationales.** Reference option/token **content** ("clozapine is held because…"), never a letter or position. Forbidden in EN *and* zh: `Option A/B/…`, "the first/second/last choice", ordinal-by-position, and the zh equivalents `选项A`, `第一个/第二个/最后一个`, `以上/上述选项`. This keeps the deterministic promotion shuffle safe.

**5.3 `topic` English-only.** CJK in `topic` fails a Tier-0 gate. Translation lives in stem/options/rationale.

**5.4 Ordered-response variation.** Vary framing across your ordered_response items (prioritization vs. procedure-sequence vs. escalation-sequence) and vary option counts (4/5/6). **No two of your ordered_response items may share a stem template.** Track templates in the manifest.

**5.5 Bowtie integrity.** Exactly one correct condition, exactly two correct actions, exactly two correct parameters; each zone ≥1 distractor; all token ids unique across zones. Keep actions in nursing scope (or explicitly prescribed/protocol-directed); keep parameters nursing-monitorable. No two of your bowties may reuse the same condition.

**5.6 Do not pre-shuffle.** Author the natural key; do not randomize or balance option positions — deterministic placement happens at promotion and will overwrite anything you do.

---

## 6. Running manifest (emit every turn)

After each turn's items, append an updated manifest. Keep it terse.

```
MANIFEST — Instance <n> — turn <t>
lane_anchor: prefix gpt_deepen_2026_06_22_<lane>_ · topics <my assigned list> · formats <my assigned list>   # restate every turn
items_so_far: <count> / target <T>
ids_used: gpt_deepen_2026_06_22_<lane>_01 … _<nn>   (sequential, no gaps)
by_format: { highlight: x, ordered_response: y, bowtie: z, dropdown_cloze: w }
by_topic: { <topic>: n, … }
ordered_templates: [ "disclosure-response", "ppe-doffing", … ]   # no repeats
bowtie_conditions: [ "clozapine toxicity", "warfarin over-anticoagulation", … ]   # no repeats
flags: <anything dropped for underspecification, with one-line reason>
```

**Run these assertions every turn** (not just at the end), against all items so far, and state the result as a one-line `checks: PASS` or name the failure: every `{en,zh}` pair non-empty · no CJK in any `topic` · no position words in any rationale (EN/zh) · no ordered_response template repeated · no bowtie condition repeated · each bowtie has 1 condition / 2 actions / 2 parameters with ≥1 distractor per zone · ids sequential and within your prefix. These are the things you can actually self-track; encoding integrity is the gate's job, not yours. Re-running them each turn is the point — it pulls the rules back to the front of attention before you write the next items. Fix any failure before continuing, and again before §7. **This tally is a per-turn sanity check, not review** — review is done by a different model and a human gate.

---

## 7. Final output (handoff)

Produce your entire batch as a **downloadable UTF-8 `.json` file** named `gpt-deepen-2026-06-22-<lane>.json` (do not paste the batch inline — a UTF-8 file keeps the bytes intact from generation to disk, eliminating the lossy-transcode step that can corrupt CJK either visibly or silently). If your interface cannot produce a downloadable file, fall back to a single fenced ```json block, but still guarantee clean UTF-8.

The file contains one envelope object:

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
  "questions": [ /* all your items */ ]
}
```

`meta.count` must equal `questions.length`. Then stop — the human routes the file through cross-model review → source-check → promote → ledger.
