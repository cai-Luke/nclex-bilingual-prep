# OPUS-SKELETON-RETROFIT-SPEC

**Status:** implemented (Jun 14). Archived. See `PROJECT-HISTORY.md` "Case-Skeleton Pipeline Retrofit to Schema 1.4" milestone for what landed.

**Implementation amendments (recorded here before archiving):**

- **File parity:** at time of retrofit, `opus-case-skeleton-prompt.md` and `opus-case-skeleton-prompt.txt` were **not** identical — `.txt` was the more complete canonical version with 7 additional instruction sections. `.md` was synced to `.txt` first, then both received the retrofit additions.
- **Section count (§3.3):** this spec said "Update the prompt's '11 sections' references to '12.'" The live `.txt` file had **9 SECTIONS TO PRODUCE** (not 11) at time of retrofit; the "11-section" figure appeared only in the Gemini compiler prompt's intro line, where it was stale. After adding BOW-TIE SYNTHESIS the author prompt has **10 sections** (not 12). The compiler prompt reference was changed to count-free wording ("the sectioned prose from the Opus hub prompt") per Luke's direction. Where the spec below says "11 sections → 12," read the implemented outcome as "9 sections → 10 in the author prompt; compiler reference changed to count-free."
- **§8 touch-point checklist item 7 (PROJECT-HISTORY.md):** milestone drafted against the live file at execution, per house style. Content-pipeline retrofit recorded as a new milestone.

**Original spec follows unchanged below this amendment block.**

---

**Original status:** planning artifact, ready for hand-off. Recommended branch accepted; ready for implementation hand-off.
**Touches:** `opus-case-skeleton-prompt.md` **and** `opus-case-skeleton-prompt.txt` (identical content, both are the live author prompt — the `.txt` is the harness-paste variant), `gemini-case-compiler-prompt.md`, `gpt-case-skeleton-compiler-prompt.md`, `case-skeleton-pipeline-spec.md`, `DECISIONS.md`. No `src/` change — the schema work (highlight 1.3, bowtie 1.4) already landed.
**Preflight (read live, do not trust this spec's snapshots):** `PROJECT-HISTORY.md` (schema-current entry, NGN item-type set), `BOWTIE-ITEM-TYPE-SPEC.md` §2/§4/§8a/§9.8, `HIGHLIGHT-ITEM-TYPE-SPEC.md` §1/§2/§4, `DECISIONS.md` principles 8/9/12 and the highlight/bowtie open-thread note.

---

## 0. Why now

The case-skeleton pipeline (Opus authors English prose → GPT/Gemini fact-check + compile → Claude reviews) was specced against **schema 1.2** with the six legacy standalone types plus `case_study`, and a text-or-three-visual exhibit menu. Since then, all landed on Jun 14:

- Schema is **1.4** current.
- `highlight` (1.3) and `bowtie` (1.4) shipped. The committed NGN item-type set is now complete.
- The visual renderer surface completed (U10 `injection_site`, 11 kinds).

Both compiler prompts still hard-code `"schemaVersion": "1.2"` in the envelope, the contract table, and the self-check, and neither emits `highlight` or `bowtie`. So a skeleton-derived case (a) would promote at a **sub-floor** version, and (b) cannot exercise the two highest-value NGN formats — the synthesis capstone and cue-recognition — even though the case skeleton is the ideal raw material for both. This retrofit brings the author↔compiler contract current. It is a **prompt + contract** change only; no code.

The smoke-test content for the newly opened visual lanes (incl. `inj_*`) stays deferred until after this retrofit, per Luke.

---

## 1. Invariants this retrofit must not break

These are the load-bearing constraints from `DECISIONS.md`. Every edit below is built to preserve them; call them out in the prompt edits so a future agent doesn't regress them.

1. **Author writes clinical truth in English prose only — no JSON, no second language** (principles 8, 9). Nothing in this retrofit asks Opus for structure or Chinese.
2. **The compiler never adjudicates medicine** (principle 8): it never decides which action is correct, never introduces a clinical claim absent from the skeleton, and sources distractors from the skeleton's enumerated material. This is the constraint that drives the §3.2 decision.
3. **Producer ≠ checker across the chain** (principles 2, 5, 18): author (Opus), clinical fact-checker (GPT *or* Gemini), compiler (the opposite model), final reviewer (Claude) stay distinct roles.
4. **Closed-world currency + sentinel block** (principle 12): the author states answer-bearing protocols/thresholds as in-case orders; currency doubt rides the single `---REVIEWER-CURRENCY-NOTES---` block; the compiler strips it. The new section adds no new meta-commentary channel.
5. **CJK-presence gate** (principle 9): all `zh` generated downstream; a missing `zh` or English-left-in-`zh` fails loud before review. New bilingual surfaces (bowtie tokens, highlight segments) extend the gate's field list — see §6.
6. **Visuals deterministic, data-derived, necessary; necessity judged downstream** (principles 6, 11). The retrofit does **not** widen the compiler's visual menu — see §5.

---

## 2. Workstream A — contract to schema 1.4 (mechanical, mandatory)

A skeleton-compiled bank may now contain a `case_study` (floor 1.1; 1.3 if it embeds a highlight) **and/or** a standalone `bowtie` (floor 1.4). Emitting the envelope at **`1.4`** satisfies every floor (1.4 ≥ all), so the rule is simply: **skeleton-compiled banks declare `meta.schemaVersion = "1.4"`.** Forward-safe and unambiguous.

In **both** `gemini-case-compiler-prompt.md` and `gpt-case-skeleton-compiler-prompt.md`, replace every `"1.2"` / "schema-1.2" with `"1.4"` in: the title/intro line, the envelope JSON block, the contract-table heading, and the self-check line (`meta.schemaVersion` is exactly `"1.4"`). No other meaning changes in this workstream.

`meta.count` semantics also change — see §3.1.

---

## 3. Workstream B — bowtie capstone (the core ask)

### 3.1 The standalone-only collision and its resolution

`bowtie` is **standalone-only**: `validateCaseStudy` rejects an embedded bowtie (`BOWTIE-ITEM-TYPE-SPEC.md` §4 — the real exam never embeds it). But the pipeline compiles one skeleton into **one `case_study`**. You therefore cannot add a bowtie as a seventh embedded question.

**Resolution:** one skeleton compiles to a bank object with **up to two top-level questions** — the `case_study` cluster (as today) **plus** an optional standalone `bowtie` that synthesizes the same case. Consequences:

- `meta.count` is the count of **top-level** questions: `1` (case only) or `2` (case + bowtie).
- The bowtie is a separate item: it **cannot reference the case_study's exhibits**. Its `stem` carries a **self-contained, condensed synthesis vignette** (the resolved picture up to the synthesis moment), enough to place the three zones without the reader needing the case_study.
- The bowtie is the **capstone**: it draws on the resolved condition, the priority actions, and the evaluate-outcomes markers — it spans the NCJMM arc. Tag `ngnSkill: "take_action"` (the dominant skill; `BOWTIE-ITEM-TYPE-SPEC.md` §2).
- **Optional, author's call.** Not every case yields a clean 1/2/2 synthesis with defensible distractors. Per principle 8 (underspecified → dropped, not guessed), the bowtie is emitted only when the case genuinely supports one; otherwise the bank holds the case_study alone.

### 3.2 Decision — author-side synthesis section accepted

`BOWTIE-ITEM-TYPE-SPEC.md` §9 item 8 claims this retrofit needs **"no author-prompt change"**: condition ← primary-problem DP, actions ← take-action DPs, parameters ← evaluate-outcomes DP, distractor pools ← COMMON NURSING ERRORS.

**That mapping is incomplete on two of the three zones, and following it forces the compiler to adjudicate medicine.** The bowtie needs, per zone, a keyed set **and a distractor pool**:

| Zone | Keyed (skeleton has it) | Distractor pool | Present in current skeleton? |
|---|---|---|---|
| condition (1) | primary-problem DP names it | **plausible competing diagnoses** (the differential) | **No.** COMMON NURSING ERRORS are wrong *actions*, not wrong *diagnoses*. The skeleton has no enumerated differential. |
| actions (2) | take-action DPs' correct actions | nursing-error actions (COMMON NURSING ERRORS) | Errors: yes. But **which two** actions are *the* priority pair is a prioritization *selection* among possibly-many take-action DPs — itself an NCJMM judgment. |
| parameters (2) | evaluate-outcomes DP names confirming markers | **tempting-but-irrelevant monitoring parameters** | **No.** Nowhere in the current skeleton. |

The two "No" cells and the action-selection are clinical content. Letting the compiler invent the differential, invent the irrelevant-parameter pool, and pick the priority action pair is exactly the compiler "deciding or altering which action is correct" and "introducing clinical claims absent from the skeleton" that principle 8 and both compiler prompts' hard boundary forbid. The condition zone is the worst place to delegate: the whole item turns on "most likely experiencing," so inventing the differential risks a distractor that is *also* defensible or implausibly wrong.

**Decision: add the bounded author section in §3.3.** It keeps all four clinical choices (the condition + its competing diagnoses, the two priority actions, the two parameters + the irrelevant ones) with the author — the irreducible semantic residual principles 3/8 reserve for the expensive model — while staying English prose with no JSON or Chinese. It is small (one section), optional, and disturbs no existing section mapping.

**Implementation note:** `BOWTIE-ITEM-TYPE-SPEC.md` §9.8 is forward-looking content-lane guidance, not an archived spec, so leaving its "no author-prompt change, principle 8 preserved" mapping intact means the repo carries a live contradiction with this spec and a future agent will resurrect the bad mapping from the bowtie doc in isolation. Patch §9.8 in place — an erratum line or a replacement of the mapping — pointing at the author-side synthesis logic chosen here. On the touch list (§8).

### 3.3 New author section (paste-ready)

Add to `opus-case-skeleton-prompt.md` **and** `opus-case-skeleton-prompt.txt`, as a new final section after **EXPECTED LEARNING OBJECTIVES** (so existing section→field mappings are untouched). *(Implementation note: the live file had 9 SECTIONS TO PRODUCE, not 11 as this spec assumed; adding BOW-TIE SYNTHESIS makes it 10, not 12. The compiler prompt's "11-section" reference was changed to count-free wording. See amendment block above.)* Add it to the SECTIONS list and the WORKED EXAMPLE (write a TLS bow-tie consistent with that case).

> **BOW-TIE SYNTHESIS** *(optional — include only if the case resolves into one clean synthesis moment with a defensible single most-likely condition, exactly two priority actions, and exactly two parameters to monitor, each with plausible wrong alternatives. If the case does not support all of that, omit this section entirely; do not force it.)*
>
> Name the stage at which the full picture has resolved, then give the synthesis as plain prose:
>
> - *Most likely condition* — the single condition the client is most likely experiencing, stated unambiguously.
> - *Plausible competing conditions* — two conditions the data makes tempting but the case rules out. For each, one phrase on why it is the wrong call here. These are the wrong answers for the condition, so they must be genuinely plausible from the vignette, not absurd.
> - *Two priority actions* — the two nursing actions that are *the* priorities at this moment, stated as nursing actions or clearly prescribed/protocol-directed ones (monitor, notify the provider, prepare, initiate the protocol, implement precautions, reassess). Not provider-scope ordering/prescribing/diagnosing. If the case has more candidate actions, choose the two that are the priority pair and say which.
> - *Two wrong actions* — two actions that are tempting errors at this moment (draw from your COMMON NURSING ERRORS or add equally plausible ones), each with one phrase on why it is unsafe or the wrong priority.
> - *Two parameters to monitor* — the two findings that best evaluate whether the client is improving, deteriorating, or responding to the plan at this synthesis moment. (This is the evaluate-outcomes step — it tracks the client's trajectory, which is broader than the physiologic response to any one action, so it works even when a priority action is "notify the provider," "prepare for transfer," or "implement precautions.")
> - *Two irrelevant parameters* — two parameters a student might monitor that are not the right way to evaluate the client here, each with one phrase on why it is irrelevant or not the priority.

Voice/discipline: identical to every other section — English prose, no JSON, no Chinese, no tables, no meta-commentary. Currency doubt about any synthesis claim still rides the existing `---REVIEWER-CURRENCY-NOTES---` block, not inline.

### 3.4 Compiler mapping for the bowtie (both compiler prompts)

Add a **BOW-TIE SYNTHESIS → standalone `bowtie`** block to the contract table and a short build rule in both prompts. The compiler assembles, never decides:

| BOW-TIE SYNTHESIS field | `bowtie` target |
|---|---|
| Most likely condition | `condition.tokens` (keyed) + `condition.correct` |
| Plausible competing conditions (×2) | `condition.tokens` (distractors); their "why wrong" → `rationale.byChoice` |
| Two priority actions | `actions.tokens` (keyed) + `actions.correct` (exactly 2) |
| Two wrong actions | `actions.tokens` (distractors); "why" → `rationale.byChoice` |
| Two parameters to monitor | `parameters.tokens` (keyed) + `parameters.correct` (exactly 2) |
| Two irrelevant parameters | `parameters.tokens` (distractors); "why" → `rationale.byChoice` |
| Named synthesis stage + resolved picture | `stem` (self-contained condensed vignette; English + `zh`) |

Build rules for the compiler block:

- Emit the bowtie as a **second top-level question**, not embedded. Bump `meta.count` to 2. If the skeleton has no BOW-TIE SYNTHESIS section, emit only the case_study (count 1) — never fabricate a synthesis.
- **Malformed synthesis → omit the bowtie, never repair it.** If the section is present but does not yield a clean item — ambiguous or implausible competing conditions, a keyed action that is provider-scope (ordering/prescribing/diagnosing), fewer distractors than the zone needs, duplicate tokens, or anything other than an unambiguous 1/2/2 — emit only the case_study and drop the bowtie. This is principle 8's drop-don't-guess applied to the synthesis. It **overrides the GPT compiler's general clinical-repair latitude**: repairing a bowtie zone (inventing a third competing condition, picking two of three listed actions, reframing a provider-scope action into RN scope, deduplicating by rewording) *is* adjudicating medicine, which is exactly the boundary the bowtie must not cross. Light prose tidying of a sound 1/2/2 is fine; reconstructing a broken one is not.
- Fixed **1 / 2 / 2** keyed counts; token ids globally unique across all three zones; ≥1 distractor per zone (the section supplies 2 per zone → 3/4/4 tokens, meeting the `BOWTIE-ITEM-TYPE-SPEC.md` §8a density target). Within-zone display text must be unique per language.
- `ngnSkill: "take_action"`. `category` from the case's primary entity. `topic` English-only.
- **Relax the conflicting self-check assertions.** Both compiler prompts' final self-checks currently assert "exactly one top-level `case_study`" and "`meta.count` is `1`." A correct case+bowtie fails those as written. Change them to: 1–2 top-level questions (one `case_study`, optionally one standalone `bowtie`); `meta.count` equals the top-level count; the bowtie, if present, is top-level and **not** embedded.
- **Do not pre-shuffle** the token order. Zone shuffling is owned by `lib/shuffle.ts` at promotion (`BOWTIE-ITEM-TYPE-SPEC.md` §9.4; `DECISIONS.md` principle 1) — the compiler emits in any order and promotion permutes with keys preserved by id.
- `rationale.byChoice` should cover **every** token for reviewed bowtie content (`BOWTIE-ITEM-TYPE-SPEC.md` §8a — the distractors are where the teaching lives). The author's per-distractor "why" phrases supply this directly; keyed-token rationale comes from the DP rationales.
- All `zh` generated here (principle 9). `stem`, every token's `en`/`zh`, zone `prompt.en`/`zh`, every rationale `en`/`zh` are must-be-bilingual surfaces.

### 3.5 Ids, routing, shuffle

- **Routing:** bowtie has **no dedicated canonical** (`BOWTIE-ITEM-TYPE-SPEC.md` §9.8). The standalone bowtie lands in the **same raw file** the compiler emits and routes by the compiler-model prefix (`gemini-` or `gpt-`) per `CANONICAL_PREFIXES` in `scripts/promote.ts`. No new lane, no `bt_`/`bowtie-` canonical.
- **Ids:** `<case_id>_bowtie` (or `<PREFIX>_bowtie_<topic_slug>_NN`) — globally unique, top-level, never an embedded `_qN` id.
- **Pipeline:** the raw file (now holding case_study + bowtie) runs the standard `banks/banks-raw/` → `npm run promote` (shuffle + validate) → `npm run audit` → merge → ledger flow, unchanged.

---

## 4. Workstream C — highlight (lighter co-beneficiary)

`highlight` (1.3) **nests in `case_study.questions` for free** (`HIGHLIGHT-ITEM-TYPE-SPEC.md` §1). A recognize/analyze-cues decision point over a passage is the canonical highlight use, so this is mostly a compiler affordance with a one-line author note — no new author section.

### 4.1 Item-type menu (both compiler prompts)

Add to the ITEM-TYPE SELECTION list:

- *recognize/analyze cues — click the findings in a passage that meet a criterion (require follow-up, are abnormal, are relevant)* → `highlight`

Embedded, scored `+/-` (over-selection penalized), instruction in `stem`, passage in `highlight.segments`, keyed subset in `highlight.correct`.

### 4.2 Author note (not a new section)

Fold one line into the **ASSESSMENT FINDINGS** guidance (and reference it from KEY DECISION POINTS) in both Opus prompt files:

> For at least one recognize-cues / analyze-cues decision point, make sure the relevant findings passage lists the keyed (abnormal/relevant) findings **alongside at least one normal or irrelevant co-finding**, so a downstream highlight item has a real distractor and never keys every finding.

This is the minimal hook the compiler needs to satisfy the **non-degenerate gate** (`HIGHLIGHT-ITEM-TYPE-SPEC.md` §4: at least one selectable segment must be unkeyed). The worked example already does this (normal temp 37.4 °C listed beside the keyed K⁺ 7.1 / phosphorus 8.4) — make it deliberate, not incidental. Unlike the bowtie differential, the keyed cues already live in the recognize-cues DP, so no further author marking is required.

### 4.3 Compiler mapping for highlight

- `stem` ← the criterion ("Highlight the findings that require immediate follow-up"), English + `zh`.
- `highlight.segments` ← the passage, **segmented by the compiler** (one finding/clause per selectable segment, static connective text non-selectable). Segmenting is mechanical; the compiler invents no findings.
- `highlight.correct` ← the keyed-cue subset the author named in the DP. The co-present normal/irrelevant findings become unkeyed selectable distractors.
- Punctuation stays inside its segment (`HIGHLIGHT-ITEM-TYPE-SPEC.md` §7 space-join rule). Segment order is fixed passage order; highlight is **shuffle-exempt** (no options).
- All `zh` generated here, per segment (principle 9).
- **Compiler self-check (segmentation granularity):** each *selectable* segment must hold exactly one finding/clause, and **no single selectable segment may mix a keyed finding with an unkeyed one** — lumping "K⁺ 7.1 and temp 37.4" into one selectable chunk makes the segment simultaneously right and wrong and the item unanswerable. Schema can't catch this (it has no finding boundaries), so it is a compile-time discipline. Parity needs no array-alignment check: per `HIGHLIGHT-ITEM-TYPE-SPEC.md` §2, `en` and `zh` ride the **same** segment object under one shared `id` (there are no parallel EN/ZH arrays to desync), so the only parity risk is an empty or untranslated `zh` on a segment — already caught by the per-segment non-empty rule and the CJK gate (§6).

---

## 5. Visuals — explicitly out of scope for this retrofit

The bowtie retrofit needs no visual change, and widening the compiler's visual menu now would violate the gating discipline (`VISUAL-STIMULI-ROADMAP.md`: a decorative-capable renderer attracts misuse; necessity is judged downstream, `DECISIONS.md` principle 6/11). **Leave both compilers' visual menus as-is.** The author keeps supplying complete serial data across stages; the compiler keeps defaulting to text exhibits and emitting only `lab_trend`/`vitals_trend`/`mar` where a DP turns on the carried relationship.

Two things to record as **separate, optional follow-ups** (do not bundle):

- **Menu expansion.** With the renderer surface complete, the compiler menu *could* later admit `io_record` (fluid-balance DPs), `device_screen` (pump-setting DPs), `medication_label`/`burn_map` (dose/TBSA DPs), etc., each only where the DP is load-bearing on the relationship. That is its own decision under the same load-bearing + faithfully-carriable + necessity-downstream test, not a freebie here.
- **Menu disagreement to reconcile when touched.** `gpt-case-skeleton-compiler-prompt.md` lists `rhythm_strip` in its visual menu; `gemini-case-compiler-prompt.md` does not. Reconcile the two menus whenever either is next edited.

---

## 6. Implementation follow-ups (deterministic; flag, don't hand-wave)

- **Census / coverage recursion.** The pipeline already flagged recursing into `case_study.questions[]` for topic/category tallies (intersects open `census.ts` work). The standalone bowtie adds a wrinkle: a skeleton now yields **up to two top-level items**. Confirm `coverage-report.ts` and `census.ts` (a) count the top-level bowtie as its own item, and (b) still recurse the case_study — otherwise a case+bowtie reads as one item and the bowtie's `topic`/`category` is lost.
- **CJK-presence gate field list.** The gate from principle 9 (still open) must cover the new bilingual surfaces: `bowtie.{condition,actions,parameters}.tokens[].{en,zh}`, `bowtie.{condition,actions,parameters}.prompt.{en,zh}`, the bowtie `stem.{en,zh}`, and `highlight.segments[].{en,zh}`. The inverse topic-CJK Tier-0 gate already covers `topic`.
- **Both author-prompt files.** `opus-case-skeleton-prompt.md` and `opus-case-skeleton-prompt.txt` carry identical content (verified). The §3.3 section and §4.2 line land in **both**; the `.txt` is what the no-tools institutional hub actually consumes.
- **`case-skeleton-pipeline-spec.md`** still describes a schema-1.2, text-exhibit, one-case_study-per-skeleton world. Update its architecture diagram and contract table to reflect 1.4, the optional standalone bowtie, the highlight item type, and the count-may-be-2 rule — or it will mislead the next agent.
- **`DECISIONS.md` addition** (§7).
- **`PROJECT-HISTORY.md` (post-landing).** It is the living status map and updates when "the active scope moves" — a content-pipeline retrofit qualifies even though no code changes (the schema-current `1.4` entry already flipped when the bowtie/highlight code landed). After the prompts are patched, add a milestone recording that the case-skeleton pipeline now emits bowtie capstones and highlight cue items at `1.4`. Per house style, draft the entry at execution against the live file, not speculatively here.

---

## 7. `DECISIONS.md` — proposed addition

> **The case-skeleton author may emit a bow-tie synthesis; the standalone bowtie is a sibling top-level item, not an embedded one.** A skeleton compiles to a `case_study` cluster and, when the case resolves into a clean 1/2/2 synthesis, an optional standalone `bowtie` capstone — two top-level items in one raw bank object (`meta.count` 1 or 2). Bowtie is standalone-only (it cannot embed in the case_study), so its `stem` restates a self-contained synthesis vignette. The author supplies the synthesis in English prose (most-likely condition + two competing conditions; two priority actions + two wrong actions; two confirming parameters + two irrelevant parameters); the compiler assembles the three zones and translates, never choosing the condition, the priority pair, or the distractor differential itself. This extends principle 8 to the synthesis zone whose distractor pools (the differential, the irrelevant parameters) the prior skeleton did not carry — keeping those clinical choices with the author rather than the weaker-supervised compiler. Banks declare `schemaVersion 1.4`.

---

## 8. Touch-point checklist

1. `opus-case-skeleton-prompt.md` + `opus-case-skeleton-prompt.txt` — add **BOW-TIE SYNTHESIS** section (§3.3), the highlight author note (§4.2), update "11 sections" → "12", extend the WORKED EXAMPLE.
2. `gemini-case-compiler-prompt.md` — 1.2→1.4 (§2); bowtie mapping + build rules (§3.4); highlight menu + mapping (§4.1, §4.3); `meta.count` 1-or-2; self-check updates.
3. `gpt-case-skeleton-compiler-prompt.md` — same edits as (2), mirrored into its style (it produces a downloadable `.json`).
4. `case-skeleton-pipeline-spec.md` — update to 1.4 / optional bowtie / highlight / count-2 (§6).
5. `BOWTIE-ITEM-TYPE-SPEC.md` §9.8 — erratum or replacement of the "no author-prompt change" mapping, pointing at the author-side synthesis section. Required, or the repo carries a contradiction.
6. `DECISIONS.md` — add the entry in §7.
7. `PROJECT-HISTORY.md` — post-landing milestone for the pipeline retrofit (§6); draft against the live file at execution.
8. Implementation (separate from prompt edits): census/coverage recursion + bowtie counting; CJK-gate field list (§6).

## 9. Out of scope

- Any `src/` change — highlight (1.3) and bowtie (1.4) already shipped.
- Widening the compiler visual menu; reconciling the rhythm_strip menu disagreement (flagged §5, not done here).
- Visual smoke content for the new lanes (`inj_*` etc.) — deferred by Luke until after this retrofit.
- A dedicated bowtie canonical bank — bowtie rides the `gemini-`/`gpt-` lanes (§3.5).
- Configurable bowtie counts, embedded bowtie, drag-and-drop — all out per `BOWTIE-ITEM-TYPE-SPEC.md` §10.
