# Burn Management Topic Audit — Review Artifact (42-row candidate population)

Status: **SUPERSEDED — historical record. Do not execute from this file.**

Superseded 2026-07-16 by
[`BURN-MANAGEMENT-TOPIC-AUDIT-GATE-HANDOFF-2026-07-16.md`](BURN-MANAGEMENT-TOPIC-AUDIT-GATE-HANDOFF-2026-07-16.md),
which carries the independent gate ruling (40 accepted · 1 held · 1 revised), the architect closeout,
and the execution receipt. **That handoff is the active Burn Management boundary. This file is the
proposal it adjudicated**, retained for provenance.

**What survives.** The 42-row population and its per-row adjudication — independently re-derived by
the gate seat from live stems, keys, and rationales across a recursive traversal of all bundled banks.
Also the worklist-defect analysis (traversal_miss 6 · topic_drift_miss 6) and the two-stage
population-helper contract.

**What does not survive.**

- **Row 23** (`gpt_visual_smoke_2026_06_12_matrix_burn_regions_03`) was held at the gate and then
  **retired from delivered study material** by architect ratification. It is no longer in
  `banks/gpt-canonical.json`; the exact payload is archived outside the bundled-bank path. This file's
  proposed topic reroute for it was not executed.
- **Row 34** (`gemini_d9_10`) was **revised** by the gate — routed out to `Cardiovascular Disorders`
  rather than retained under Burn Management as proposed here.
- **The corpus-wide SHARED-topic comparison** in "Proposed license" below — the claim that Burn
  Management would be the first genuinely exercised construct-boundary SHARED topic, and the
  accompanying Transfusion / Skin & Wound / Oncology usage figures — was derived from a **partial
  6-of-13-bank working copy**. It was contextual, not dispositive, and fed no row ruling, but its
  provenance is inadequate. **Do not rely on it.** Any corpus-wide topic/license figure must be
  regenerated from a single named HEAD across all 13 bundled banks.

Produced 2026-07-16 (architect seat). Superseded the 29-item worklist in
`BURN-MANAGEMENT-TOPIC-AUDIT-HANDOFF.md` (see "Worklist defects").

Category authority: `docs/source-records/NCSBN-2026-NCLEX-RN-TEST-PLAN.md`. Every
`test_plan_activity_basis` below is a page pointer into that record's linked PDF. **Adjudicators
must open the PDF at the cited page and read the statement — do not adjudicate from this file's
characterizations.**

## Why this is a *candidate* population, not the Burn Management population

The 42 rows are everything with a plausible claim to the Burn Management rollup. Some should not
receive it. `burn_rollup_eligible` is adjudicated per row and is **independent of** category:
a burn-context item can be correctly categorized and still belong under a different topic
(`trad_batchD_19`), and an item can carry the topic today and have no burn content at all
(`gpt_case_gbs_respiratory_compromise_01_q1`).

## Proposed license (provisional — this artifact is the evidence, not the ruling)

`Burn Management` → SHARED `[Physiological Adaptation, Reduction of Risk Potential,
Pharmacological and Parenteral Therapies]`.

The NCSBN category definitions **establish scope, and they overlap** — a complication of a
life-threatening burn injury falls inside both RRP's and PA's definitions. The definitions do not by
themselves resolve where an item lands. **The exact keyed nursing activity resolves it**, and a stem
verb is not the keyed activity: read what the key actually scores (see the adjudication note in
`docs/source-records/NCSBN-2026-NCLEX-RN-TEST-PLAN.md`). Classify from the key, never from the verb:

| Keyed nursing activity | Category |
|---|---|
| Compute/schedule prescribed parenteral burn-resuscitation therapy (volume, allocation, rate, elapsed-time correction, arithmetic verification) — whether the coefficient is supplied or recalled | **Pharm** |
| TBSA estimation/quantification without a treatment decision; focused assessment; **recognition of a potential complication without keyed management**; surveillance; trend interpretation; evaluation of resuscitation/treatment *response* | **RRP** |
| Burn pathophysiology; emergency intervention; initiating/changing resuscitation; treating burn shock or airway compromise; managing fluid creep or an established complication | **PA** |

The severity of the burn does **not** by itself pull an item to PA — a focused assessment remains a
focused assessment when the condition is life-threatening. Rows 26–28 are where this bites.

**Durable precedent this would set:** category follows the keyed nursing activity; topic follows the
stable clinical rollup; clinical context alone does not determine category. This belongs in
`TOPIC-VOCABULARY-DECISIONS.md` as taxonomy policy, **not** `DECISIONS.md` — it is an application
record, not a constitutional principle.

> **[SUPERSEDED — PARTIAL-CORPUS PROVENANCE. Do not rely on this paragraph.]** The figures below were
> computed over a 6-of-13-bank working copy and must not be cited. Regenerate from a single named HEAD
> across all 13 bundled banks before reusing any of it.
>
> Note for the gate seat: if ratified, this becomes the project's **first genuinely exercised
> construct-boundary SHARED topic**. `Transfusion & Blood Products` is licensed for 4 categories and
> uses 1; `Skin & Wound Care` licensed for 3, uses 1; `Oncology & Immunotherapy Complications` is
> licensed `[PA, RRP]` but its RRP items are all leaves of a single CAR-T case — whole-case tagging,
> not a construct boundary. There is **no precedent to lean on**. The boundary wording above will be
> cited by every future SHARED proposal, so it warrants more scrutiny than the verdict.

## Worklist defects (root cause — flagged, repair is out of scope here)

The handoff's 29-item worklist missed 13 of these 42 (42 − 29) — two defect mechanisms plus one
non-defect:

- **`traversal_miss` (6)** — the extractor did not recurse into case-study leaves. It caught
  `..._01_bowtie` but not `..._01_q1`–`q5` of the same case, nor the GBS leaf.
- **`topic_drift_miss` (6)** — the extractor matched `topic == "Burn Management"` exactly, so it is
  structurally blind to burn items whose topic drifted to free-text micro-descriptions
  (`adult burn TBSA estimation`, `burn Parkland calculation verification`, …). **Three of these live
  in `burn-canonical.json` itself** — the dedicated burn bank is 5/8 canonical-topic. Exact matching
  is blind precisely to the most-likely-mistagged population.
- **`semantic` (1, not a defect)** — `trad_batchD_19` carries a legitimate non-burn topic
  (`Nutritional & Fluid Support`) and surfaced only via content matching. No topic-based extraction
  should have found it, and it is proposed `burn_rollup_eligible: no`. Counted here only to reconcile
  29 → 42.

Repair contract for Codex (out of scope for this artifact): stage 1 = deterministic recursive
extraction of exact-topic items, reusing the traversal that already backs global-ID enforcement;
stage 2 = explicit semantic-residual review of off-canonical topic strings and clinical-context
candidates. **Stage 2 stays judgment work.** Do not build a keyword "burn detector" — that
reproduces the `gpt_case_gbs_respiratory_compromise_01_q1` failure ("burning pain" → Burn Management)
in executable form.

## Out of scope for this artifact (flagged, not actioned)

1. **Safety-category rename.** 2026 plan renames `Safety and Infection Control` →
   `Safety and Infection Prevention and Control`. Project enum carries the retired 2023 name. Affects
   rows 39–40 below only in label, not semantics.
2. **Substance-misuse terminology update.**
3. **IV-fluid calculation category audit** — planned; handoff not yet commissioned. To be scoped by
   Codex from freshly regenerated reports at a single named HEAD. See non-dispositive appendix.
4. **Recursive worklist tooling repair** → Codex, mechanical.

---

## Execution manifest — 42 rows, one per canonical item/leaf ID

`SB` = selection_basis: `exact` (exact canonical topic) · `leaf` (embedded leaf, recursive) ·
`drift` (off-canonical burn micro-topic) · `semantic` (burn-context candidate) · `fp` (false-positive
semantic match).
`WD` = worklist_defect: `none` · `trav` (traversal_miss) · `drift` (topic_drift_miss).
`Elig` = burn_rollup_eligible.

**Category abbreviations — executable `proposed_category` values.** The `→ cat` column below is
abbreviated for width. Every abbreviation resolves to a **current project enum value**, not to an
NCSBN section name:

| Abbrev | Project enum value to write to `category` |
|---|---|
| PA | `Physiological Adaptation` |
| RRP | `Reduction of Risk Potential` |
| Pharm | `Pharmacological and Parenteral Therapies` |
| Safety | **`Safety and Infection Control`** |
| BCC | `Basic Care and Comfort` |

**Executor warning.** The `test_plan_section` values in the adjudication detail name sections of the
NCSBN 2026 document, where the subcategory is titled *Safety and Infection Prevention and Control*.
That string is a **source pointer, not a category value — do not write it to `category`.** The rename
is a separate migration (see "Out of scope" #1); **no row in this manifest depends on it**, and this
manifest must execute cleanly against the enum as it stands today.

| # | id | cur. cat | cur. topic | SB | WD | → cat | → topic | Elig | Conf | Action |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `sa_parkland_01` | PA | Burn Management | exact | none | **Pharm** | Burn Management | yes | high | cat retag |
| 2 | `gemini_p6_burn_02` | Pharm | Burn Management | exact | none | Pharm | Burn Management | yes | high | keep |
| 3 | `gemini_p6_burn_01` | RRP | Burn Management | exact | none | **Pharm** | Burn Management | yes | high | cat retag |
| 4 | `gemini_p6_burn_03` | RRP | Burn Management | exact | none | **Pharm** | Burn Management | yes | high | cat retag |
| 5 | `gemini_p6_burn_04` | RRP | Burn Management | exact | none | **Pharm** | Burn Management | yes | med | cat retag + source note |
| 6 | `gemini_b7_02` | RRP | Burn Management | exact | none | **Pharm** | Burn Management | yes | high | cat retag |
| 7 | `gemini_d9_07` | PA | Burn Management | exact | none | **Pharm** | Burn Management | yes | high | cat retag |
| 8 | `gemini_jun05_a_fib_parkland_burn_47` | RRP | Burn Management | exact | none | **Pharm** | Burn Management | yes | med | cat retag |
| 9 | `gemini_jun05_b_fib_burn_06` | RRP | Burn Management | exact | none | **Pharm** | Burn Management | yes | high | cat retag |
| 10 | `gpt_2026_07_03_1344_t1_05` | PA | Burn Management | exact | none | **Pharm** | Burn Management | yes | high | cat retag |
| 11 | `gpt_case_major_burn_inhalation_fluid_creep_01_q3` | PA | Burn Management | leaf | trav | **Pharm** | Burn Management | yes | high | cat retag |
| 12 | `burn_fib_parkland_total_posterior_03` | PA | Burn Management | exact | none | **Pharm** | Burn Management | yes | med | cat retag |
| 13 | `burn_fib_parkland_rate_arm_trunk_genitalia_04` | PA | Burn Management | exact | none | **Pharm** | Burn Management | yes | med | cat retag |
| 14 | `burn_fib_parkland_first8h_leg_arm_08` | PA | Burn Management | exact | none | **Pharm** | Burn Management | yes | med | cat retag |
| 15 | `burn_sata_parkland_chain_06` | PA | Burn Management | exact | none | **Pharm** | Burn Management | yes | med | cat retag |
| 16 | `burn_matrix_parkland_values_05` | RRP | burn Parkland calculation verification | drift | drift | **Pharm** | **Burn Management** | yes | med | cat retag + topic reroute |
| 17 | `gpt_visual_smoke_2026_06_12_fib_burn_parkland_rate_01` | RRP | adult burn resuscitation Parkland calculation | drift | drift | **Pharm** | **Burn Management** | yes | high | cat retag + topic reroute |
| 18 | `gemini_u5_fib_or_2026_06_09_fib_tbsa_04` | PA | Burn Management | exact | none | **RRP** | Burn Management | yes | med | cat retag |
| 19 | `gpt_case_major_burn_inhalation_fluid_creep_01_q1` | PA | Burn Management | leaf | trav | **RRP** | Burn Management | yes | med | cat retag |
| 20 | `burn_fib_tbsa_anterior_mix_01` | RRP | adult burn TBSA estimation | drift | drift | RRP | **Burn Management** | yes | high | topic reroute |
| 21 | `burn_mc_posterior_tbsa_07` | RRP | adult burn posterior surface TBSA | drift | drift | RRP | **Burn Management** | yes | high | topic reroute |
| 22 | `gpt_visual_smoke_2026_06_12_mc_burn_tbsa_02` | BCC | adult Rule of Nines TBSA estimation | drift | drift | **RRP** | **Burn Management** | yes | high | cat retag + topic reroute |
| 23 | `gpt_visual_smoke_2026_06_12_matrix_burn_regions_03` | RRP | adult Rule of Nines region recognition | drift | drift | RRP | **Burn Management** | contested | low | topic reroute — HOLD |
| 24 | `gemini_b7_05` | RRP | Burn Management | exact | none | RRP | Burn Management | yes | high | keep |
| 25 | `gemini_b7_08` | RRP | Burn Management | exact | none | RRP | Burn Management | yes | high | keep |
| 26 | `gpt_fmtgap_2026_07_14_hl_burn_inhalation_06` | PA | Burn Management | exact | none | **RRP** | Burn Management | yes | **low** | **CONTESTED** |
| 27 | `gpt_case_major_burn_inhalation_fluid_creep_01_q2` | PA | Burn Management | leaf | trav | PA | Burn Management | yes | **low** | **CONTESTED** |
| 28 | `gpt_deepen_2026_06_23_bow_03` | RRP | Burn Management | exact | none | **PA** | Burn Management | yes | med | cat retag — dissent |
| 29 | `easy_burns_01` | PA | Burn Management | exact | none | PA | Burn Management | yes | high | keep |
| 30 | `easy_burns_02` | PA | Burn Management | exact | none | PA | Burn Management | yes | high | keep |
| 31 | `gemini_c10_08` | PA | Burn Management | exact | none | PA | Burn Management | yes | high | keep |
| 32 | `gemini_d9_01` | PA | Burn Management | exact | none | PA | Burn Management | yes | high | keep |
| 33 | `gemini_d9_04` | PA | Burn Management | exact | none | PA | Burn Management | yes | high | keep |
| 34 | `gemini_d9_10` | PA | Burn Management | exact | none | PA | Burn Management | yes | **low** | **CONTESTED** |
| 35 | `burn_mc_resuscitation_threshold_02` | PA | Burn Management | exact | none | PA | Burn Management | yes | high | keep |
| 36 | `gpt_case_major_burn_inhalation_fluid_creep_01_q4` | PA | Burn Management | leaf | trav | PA | Burn Management | yes | high | keep |
| 37 | `gpt_case_major_burn_inhalation_fluid_creep_01_q5` | PA | Burn Management | leaf | trav | PA | Burn Management | yes | high | keep |
| 38 | `gpt_case_major_burn_inhalation_fluid_creep_01_bowtie` | PA | Burn Management | exact | none | PA | Burn Management | yes | high | keep |
| 39 | `gpt_fmtgap_2026_07_14_or_dry_chemical_burn_15` | PA | Burn Management | exact | none | **Safety** | **Patient & Environment Safety** | **no** | med | cat retag + topic reroute |
| 40 | `easy_burns_03` | Safety | Burn Management | exact | none | Safety | **Standard Precautions & Hygiene** | **no** | med | topic reroute |
| 41 | `trad_batchD_19` | BCC | Nutritional & Fluid Support | semantic | none | BCC | Nutritional & Fluid Support | **no** | med | no change |
| 42 | `gpt_case_gbs_respiratory_compromise_01_q1` | PA | Burn Management | leaf | trav | PA | **Endocrine & Neurological Disorders** | **no** | high | topic reroute |

**Counts** — reconciled against live disk 2026-07-16: 42 rows, 42 unique IDs, no duplicates, every ID
confirmed present on disk. Each tally below sums to 42; if an edit breaks that, the manifest is unsafe
to execute.

- **Proposed categories:** Pharm 17 · RRP 9 · **PA 13** · Safety 2 · BCC 1 = 42.
  PA includes rows 27 and 28, and row 42 — the GBS leaf, whose *category* is already correct and which
  is routed out of the rollup by *topic* only. Category count ≠ rollup membership.
- **Routed out of the rollup** (`Elig: no`): 4 (rows 39–42). Plus 1 contested (row 23).
- **Actions:** keep 12 · cat retag 17 (incl. row 5 source note, row 28 dissent) ·
  cat retag + topic reroute 4 · topic reroute 5 (incl. row 23 HOLD) · no change 1 ·
  contested-pending 3 (rows 26, 27, 34) = 42.
- **Confidence:** high 25 · med 13 · low 4 = 42.
- **Worklist defects:** none 30 · traversal_miss 6 · topic_drift_miss 6 = 42.

---

## Adjudication detail

Block numbers correspond 1:1 to manifest rows.

### Rows 1–17 — prescribed fluid computation → Pharmacological and Parenteral Therapies

**Construct:** compute/schedule prescribed parenteral burn-resuscitation therapy.
**test_plan_section:** Pharmacological and Parenteral Therapies → *Parenteral/Intravenous Therapies*,
**p. 40**.
**test_plan_activity_basis:** applying mathematics/nursing procedures when caring for a client
receiving intravenous therapy.
**Not** *Dosage Calculations* (p. 39) — that sub-heading is scoped to medication administration, and
Parkland is not a medication dose. This distinction is load-bearing and is the reason the topic stays
`Burn Management` rather than migrating to the `Dosage Calculations` topic.

Governing finding: **16 of 17 supply the coefficient in the stem** ("Using the Parkland formula
(4 mL × kg × %TBSA…)"), so the keyed competency is extract-TBSA → apply-supplied-formula → compute.
The supplied coefficient made the classification obvious but **is not the rule** — the rule is that
the learner calculates prescribed IV therapy without deciding whether it should be initiated,
changed, or judged adequate. Row 8 is the lone recall variant and classifies identically.

- **1 `sa_parkland_01`** — keyed: 70 kg, 30% TBSA, supplied Parkland → first-8h volume (number).
  Conf high.
- **2 `gemini_p6_burn_02`** — keyed: 80 kg, 30% TBSA, supplied → 600 mL/hr. Already Pharm; this row
  was the *only* Pharm item in the population and was cited as drift by the original proposal. It is
  not drift — it is the sole correctly categorized calc item. Conf high.
- **3 `gemini_p6_burn_01`** — keyed: 154 lb, 40% TBSA, supplied → 24h total. Conf high.
- **4 `gemini_p6_burn_03`** — keyed: 60 kg, 50% TBSA, supplied → windowed rate. Conf high.
- **5 `gemini_p6_burn_04`** — keyed: peds 20 kg, 25% TBSA, **3 mL/kg/%TBSA supplied as a provider
  order** → 1,500 mL. *review_note:* not Parkland; a modified coefficient. Because the order supplies
  it, the item asserts no clinical claim about standard-of-care and is answerable as written — GPT's
  requested source-hold is largely defused by the framing. Retained as a **note, not a block**. Gate
  seat should confirm the framing reads as facility-order-specific. Conf med.
- **6 `gemini_b7_02`** — keyed: 70 kg, 40% TBSA, burn 0800 / arrival 1000, supplied → 933.33 mL/hr.
  Elapsed-time correction is the difficulty; still IV-therapy mathematics. Conf high.
- **7 `gemini_d9_07`** — keyed: 80 kg, 50% TBSA, burn 1200 / arrival 1400, supplied → rate. Conf high.
- **8 `gemini_jun05_a_fib_parkland_burn_47`** — keyed: 176 lb, 30% TBSA, **coefficient NOT supplied**
  → first-8h volume. *review_note:* the population's only recall variant. Recalling a coefficient and
  multiplying is still IV-therapy mathematics, not managing altered physiology — but this is the one
  row where a reviewer could argue the competency differs. Conf med.
- **9 `gemini_jun05_b_fib_burn_06`** — keyed: 70 kg, 30% TBSA, supplied → first-8h volume. Clinically
  identical to row 1; currently RRP while row 1 is PA. This pair is the clearest single proof that
  the live PA/RRP split is provenance drift, not taxonomy. Conf high.
- **10 `gpt_2026_07_03_1344_t1_05`** — keyed: 70 kg, 30% TBSA; **the provider's order supplies the
  formula and the 8h/16h phasing** → volume/rate. The strongest row in the population for Pharm: it
  is literally "calculate a prescribed IV-fluid volume." Conf high.
- **11 `..._fluid_creep_01_q3`** — keyed: supplied Parkland estimate → 24h volume + initial rate.
  *review_note:* **case-bound is not category evidence.** This leaf computes; later leaves in the same
  case manage. It classifies from its own keyed task. Conf high.
- **12 `burn_fib_parkland_total_posterior_03`** · **13 `..._rate_arm_trunk_genitalia_04`** ·
  **14 `..._first8h_leg_arm_08`** — keyed: read shaded diagram → TBSA → supplied Parkland → volume/rate.
  *review_note:* these carry a **load-bearing visual**; the TBSA input is read from the diagram, so
  each contains an embedded RRP-flavored assessment step subordinate to a Pharm keyed answer. The
  keyed answer is a single number (the fluid), so Pharm. Flagged because a reviewer may reasonably
  see a two-construct item. Conf med.
- **15 `burn_sata_parkland_chain_06`** — keyed: select-all over a Parkland reasoning chain (visual
  TBSA → volume → half → rate). *review_note:* multi-statement format; every keyed statement is an
  arithmetic assertion. Conf med.
- **16 `burn_matrix_parkland_values_05`** — keyed: matrix verifying another nurse's worksheet values
  (72 kg, visual 31.5% TBSA → 9,072 / 4,536 / 567 mL/hr). *review_note:* arithmetic **verification**,
  not computation. Still Parenteral/IV mathematics. A reviewer could argue Safety
  (*verify appropriateness and accuracy of a treatment order*, p. 24) — noted, not adopted: the keyed
  task is checking arithmetic, not judging order appropriateness. `topic_drift_miss`. Conf med.
- **17 `gpt_visual_smoke_..._fib_burn_parkland_rate_01`** — keyed: 70 kg, visual TBSA, supplied
  traditional Parkland → rate. `topic_drift_miss`. Conf high.

### Rows 18–23 — TBSA estimation / focused assessment → Reduction of Risk Potential

**Construct:** quantify burn extent without a treatment decision.
**test_plan_section:** Reduction of Risk Potential → *System-Specific Assessments*, **p. 44**
(performing focused assessments).
**Live-bank note:** pure TBSA estimation currently sits RRP in 3 places and PA in 1. The June
`gemini_u5_fib_or_..._tbsa_04` correction *into* PA — cited by the prior ruling — is the **minority**
position at 1-vs-3 and is proposed for reversal here. Gate seat should weigh that this artifact
overturns a prior architect ruling on the strength of population evidence the prior ruling lacked.

- **18 `gemini_u5_fib_or_2026_06_09_fib_tbsa_04`** — keyed: Rule of Nines → 27%, stops. *review_note:*
  **this row reverses the Jun 16 Gemini-pass correction.** Conf med.
- **19 `..._fluid_creep_01_q1`** — keyed: Rule of Nines → 31.5% TBSA. Case-bound ≠ PA. Conf med.
- **20 `burn_fib_tbsa_anterior_mix_01`** — keyed: visual → 27% TBSA. Category already RRP; topic
  drifted. `topic_drift_miss`, in `burn-canonical.json`. Conf high.
- **21 `burn_mc_posterior_tbsa_07`** — keyed: visual → 36% TBSA to document. `topic_drift_miss`, in
  `burn-canonical.json`. Conf high.
- **22 `gpt_visual_smoke_..._mc_burn_tbsa_02`** — keyed: visual → 13.5% TBSA. Currently **BCC**, which
  is indefensible for TBSA quantification under any reading. `topic_drift_miss`. Conf high.
- **23 `gpt_visual_smoke_..._matrix_burn_regions_03`** — keyed: for each region, is it shaded?
  **HOLD — `burn_rollup_eligible: contested`.** *review_note:* this may not test a nursing construct
  at all. The keyed task is diagram region-reading with no TBSA arithmetic, no percentage, and no
  clinical decision — closer to a visual-renderer smoke test (its `visual_smoke` id lineage supports
  that reading) than an NCLEX item. Recommend the gate seat decide whether it belongs in a delivered
  bank at all before deciding its topic. Conf low.

### Rows 24–25 — resuscitation-adequacy surveillance → Reduction of Risk Potential

**Construct:** evaluate whether a treatment is working.
**test_plan_section:** RRP → *Changes/Abnormalities in Vital Signs* (**p. 42**) and *Potential for
Complications of Diagnostic Tests/Treatments/Procedures* (**pp. 43–44**).
**test_plan_activity_basis:** assessing and responding to changes/trends in vital signs; evaluating
client responses to procedures and treatments.
These two rows are the load-bearing evidence that RRP is a **genuine construct** in this population
rather than drift — they are why the license needs RRP at all.

- **24 `gemini_b7_05`** — keyed: UOP 25 mL/hr vs 0.5 mL/kg/hr target → inadequate resuscitation.
  Evaluating a treatment's response. Already RRP; no change. Conf high.
- **25 `gemini_b7_08`** — keyed: UOP/MAP/HR/sensorium matrix → adequate vs inadequate resuscitation.
  Already RRP; no change. Conf high.

### Rows 26–28 — inhalation injury: three items, three separate dispositions

Per architect instruction, **no blanket disposition**. Each classifies from its exact keyed task.
The relevant tension: RRP owns *focused/system-specific assessment* (p. 44) — which can support RRP
**even when the underlying condition is life-threatening** — while PA owns *emergency care
procedures* and *managing impaired ventilation/oxygenation* (p. 46).

- **26 `gpt_fmtgap_2026_07_14_hl_burn_inhalation_06`** — **standalone highlight. CONTESTED,
  proposed RRP, conf low.**
  Exact keyed task: *highlight the findings that indicate high risk for inhalation injury and
  impending upper-airway edema.* The learner identifies cues. **No action is keyed.** The distractors
  are non-specific findings (extremity burn, pain score, mildly elevated BP), so the item discriminates
  cue-recognition only.
  *For RRP:* pure focused assessment (p. 44); "high risk for" is risk identification, which is the RRP
  definition's core.
  *For PA (current):* recognizing signs/symptoms of complications **and intervening** (p. 46) — but the
  intervention half is absent from the key.
  *Dissent:* GPT provisionally read this RRP; the architect's earlier reading blanket-moved it to PA
  with row 28. **Both prior readings were wrong to bundle it.** Gate seat: does an unactioned
  highlight of a life-threatening cue-set satisfy RRP's focused-assessment statement, or does PA's
  recognize-and-intervene statement claim it despite no keyed intervention?
- **27 `gpt_case_major_burn_inhalation_fluid_creep_01_q2`** — **case highlight. CONTESTED, proposed PA
  (no change), conf low.**
  Exact keyed task: *highlight the findings that support impending upper-airway obstruction
  **requiring emergent intubation rather than continued observation on a non-rebreather mask**.*
  Materially different from row 26 despite the identical format: the stem frames cue-recognition
  **in service of an explicit management discrimination** between two named airway paths. What the
  learner *does* is highlight; what the item *discriminates* is a management decision.
  *review_note:* this is exactly the row where format and construct diverge. If the gate seat holds
  that keyed task = the physical action (highlight), this is RRP and should move. If keyed task = the
  discrimination the item scores, it is PA and stays. **Rows 26 and 27 should be adjudicated together
  and may legitimately land in different categories** — that divergence is the finding, not a defect.
  `traversal_miss`.
- **28 `gpt_deepen_2026_06_23_bow_03`** — **bowtie. Proposed PA, conf med. DISSENT: GPT read RRP.**
  Exact keyed task: condition = *inhalation injury with impending airway compromise*; **actions =
  high-flow oxygen + early airway-team involvement**; plus monitoring parameters. **The key includes
  emergency airway actions**, which satisfies the architect's stated bowtie rule and PA's *perform
  emergency care procedures* / *manage impaired ventilation/oxygenation* (p. 46).
  *review_note 1:* the architect's earlier one-line summary ("recognize cue") collapsed a three-part
  key — GPT was right to predict exactly this failure mode for bowties.
  *review_note 2 (content, non-dispositive):* the stem supplies its own decision rule ("*the item rule
  says visible soot plus hoarseness … is an airway emergency even when SpO₂ is not yet low*"). This is
  correct closed-world discipline, but it parallels the supplied-coefficient finding: the item hands
  over the rule it tests. Coverage signal only.

### Rows 29–38 — acute instability, pathophysiology, active management → Physiological Adaptation

**test_plan_section:** PA → *Alterations in Body Systems* (pp. 46–47), *Fluid and Electrolyte
Imbalances* (p. 47), *Hemodynamics* (p. 48).
**test_plan_activity_basis:** performing emergency care procedures; managing a client with fluid and
electrolyte imbalance; managing alteration in hemodynamics/tissue perfusion; identifying
pathophysiology related to an acute condition.

- **29 `easy_burns_01`** — keyed: ED priority in severe burn → airway/ABCs. Emergency care. Conf high.
- **30 `easy_burns_02`** — keyed: prevent hypovolemic shock in first 24h → aggressive IV resuscitation.
  *review_note:* names resuscitation as the intervention but keys **no number** — decision, not
  computation. This is the clean contrast case against rows 1–17 and is worth the gate seat's
  attention as the boundary's best illustration. Conf high.
- **31 `gemini_c10_08`** — keyed: matrix, resuscitation (emergent) vs acute phase interventions.
  Illness-phase management. Conf high.
- **32 `gemini_d9_01`** — keyed: low UOP + tachycardia + hypotension → **increase the LR rate**.
  *review_note:* the sharpest boundary pair in the population — same UOP data as rows 24–25, but this
  keys *changing* the resuscitation (PA) where they key *judging* it (RRP). If the gate seat rejects
  the boundary, this pair is where it breaks. Conf high.
- **33 `gemini_d9_04`** — keyed: expected physiologic changes in first 24h (capillary permeability,
  fluid shift, K⁺ release, lactic acid). Pathophysiology. Conf high.
- **34 `gemini_d9_10`** — **CONTESTED, proposed PA (no change), conf low.** Keyed: match lab
  abnormality to mechanism — ↑Hct = plasma loss/hemoconcentration; procalcitonin = bacterial sepsis;
  troponin/BNP = cardiac. *For PA:* *identify pathophysiology related to an acute condition* (p. 46) —
  the key explains **why**. *For RRP:* *Laboratory Values* (p. 43) — monitoring/comparing labs.
  *review_note:* turns on whether the keyed task is explaining a mechanism (PA) or interpreting a lab
  (RRP). Read as mechanism because no threshold or action is keyed. Genuinely close.
- **35 `burn_mc_resuscitation_threshold_02`** — keyed: visual → 27% TBSA ≥ stated 20% protocol
  threshold → **initiate** formal IV resuscitation. *review_note:* contains TBSA assessment **and**
  arithmetic, but keys an initiation decision, so PA. The three-way contrast with rows 12–14 (same
  visual, keys a number → Pharm) and row 18 (same estimation, stops → RRP) is the single best
  demonstration that the boundary is operable on real items. Conf high.
- **36 `..._fluid_creep_01_q4`** — keyed: UOP 35 vs 40–80 target → **increase infusion per protocol**,
  reassess hourly. Changing resuscitation. `traversal_miss`. Conf high.
- **37 `..._fluid_creep_01_q5`** — keyed: UOP 110–120 + crackles + rising peak airway pressures +
  abdominal girth + tense hands → **reduce infusion, notify, monitor**. Established-complication
  management. `traversal_miss`. Conf high.
- **38 `..._fluid_creep_01_bowtie`** — keyed: condition = fluid creep / over-resuscitation; actions +
  monitoring parameters. Conf high.

### Rows 39–42 — route out of the Burn Management rollup

- **39 `gpt_fmtgap_2026_07_14_or_dry_chemical_burn_15`** — keyed: ordered-response dry-chemical decon
  sequence — protect staff → remove/contain clothing and jewelry → brush off dry powder → then
  irrigate (safety sheet confirms non-water-reactive). Construct: decontamination / hazardous-materials
  procedure. **Proposed Safety** → *Handling Hazardous and Infectious Materials*, **p. 25** (following
  procedures for handling biohazardous and hazardous materials). `burn_rollup_eligible: no` — the burn
  is the context, the keyed competency is hazmat decon. *review_note:* this row was **recategorized
  into PA and promoted on 2026-07-15** as part of the batch this audit was deferred from. Proposing to
  move it again; the gate seat should confirm the July 15 promotion did not rest on reasoning this
  artifact has not seen. Conf med.
- **40 `easy_burns_03`** — keyed: burn = loss of skin barrier → **strict hand hygiene** to prevent
  cross-contamination. Construct: infection prevention. Category **Safety already correct**; topic
  reroute only → *Standard Precautions & Hygiene*. **Proposed test_plan_section:** Safety →
  *Standard Precautions/Transmission-Based Precautions/Surgical Asepsis*, **p. 26** (applying
  principles of infection prevention incl. hand hygiene). *review_note:* keeping this under Burn
  Management would force **Safety into the license** for a single item whose keyed competency is
  generic hand hygiene. Conf med.
- **41 `trad_batchD_19`** — keyed: full-thickness burn → encourage **protein** for wound healing
  (hypermetabolic state). **No change proposed.** Category BCC correct (*Nutrition and Oral
  Hydration*, **pp. 36–37**); topic `Nutritional & Fluid Support` correct.
  `burn_rollup_eligible: no`. *review_note:* the deliberate counter-example to semantic vacuuming.
  Burn-specific nutrition **is** genuine burn content, so a reviewer may argue for the rollup — but
  admitting it forces **BCC into the license** for one item. The cost/benefit favors leaving it.
  Selection basis `semantic`: it surfaced only via content matching, not via any topic. Conf med.
- **42 `gpt_case_gbs_respiratory_compromise_01_q1`** — **not a burn item.** Keyed: Guillain-Barré —
  Campylobacter → ascending areflexic paralysis → foot drop → respiratory monitoring. "Burn" appears
  only as a paresthesia descriptor ("tingling and **burning** pain"), which is near-certainly what an
  autotagger keyed on. Category **PA already correct**; topic reroute → **`Endocrine & Neurological
  Disorders`** (disorder and tested progression are neurological). `burn_rollup_eligible: no`.
  *review_note:* clean bug, independent of the license outcome; could be fixed ahead of the rest.
  `traversal_miss` — the handoff never saw it. Conf high.

---

## Appendix — collateral evidence (NON-DISPOSITIVE, not part of this execution manifest)

Per architect ruling 2026-07-16, these are **not** burn rows and must not be executed from this file.
They exist because the keyed-task rule clarified here applies elsewhere. Follow-up: **IV-fluid
calculation category audit — planned, handoff not yet commissioned.**

> **[PARTIAL-CORPUS PROVENANCE.]** The counts in this appendix were computed over a 6-of-13-bank
> working copy. The three named IDs are **leads to re-measure**, not findings. The off-license count
> must be regenerated from a single named HEAD across all 13 bundled banks.

| id | current | note |
|---|---|---|
| `sepsis_pneumonia_fluid_calc` | PA / Sepsis & Septic Shock | prescription supplies 30 mL/kg → number. Supplied-coefficient arithmetic in PA. |
| `gpt_2026_07_03_2114_t1_06_dka_fluid_fib` | PA / Diabetic Ketoacidosis (DKA) | order set supplies 15 mL/kg → number. Same shape. |
| `gemini_jun05_b_fib_pediatric_04` | RRP / Pediatric & Adolescent Health | Holliday-Segar supplied → maintenance volume. Same shape, third category. |
| `Dosage Calculations` topic | STRICT Pharm | **12 off-license items** (10 BCC, 1 PA, 1 Safety), incl. `gemini_jun05_b_fib_fluid_03` at `category: PA` + `topic: Dosage Calculations` — a flat license violation. Confirms topic×category is unenforced. |

**Provenance of these three rows matters:** they were originally offered by the architect as evidence
*for* PA (a live pattern of disease-specific fluid math sitting in PA under the disease topic). The
supplied-coefficient test then showed all three supply the coefficient — so they are not a pattern
supporting PA, they are three more instances of the same drift the burn ruling corrects. **The burn
ruling does not depend on them.** They are listed so the collateral audit inherits the finding, not
so this artifact can lean on it.

## Gate-seat checklist

1. Re-derive each row against live disk. Do not accept this file's keyed-task characterizations —
   read the stems.
2. Open the linked PDF at each cited page. Do not accept this file's activity-statement
   characterizations.
3. **Adjudicate rows 26 + 27 together** (highlight format, divergent keyed tasks). They may split.
4. Rule on row 28 (architect proposes PA / GPT proposed RRP).
5. Rule on rows 23 (bank-eligibility hold) and 34 (mechanism vs lab interpretation).
6. Confirm row 18 is a deliberate reversal of the Jun 16 ruling and is warranted.
7. Confirm row 39's July 15 promotion carried no reasoning absent from this artifact.
8. Rule on rows 12–15 (visual TBSA subordinate to a Pharm answer — one construct or two?).
9. Confirm the boundary wording, which becomes precedent for all future SHARED proposals.
10. Producer≠checker: the architect authored this audit and must not gate it or promote its patches.
