# Claude Lane — Adversarial Semantic Audit Findings — 2026-06-24

Lane-scoped findings for the Claude coherence track (per
`Archive/root-cleanup-2026-06-26/claude-code-coherence-audit-spec.md`). Findings-only; no canonical writes.
Sub-sessions are appended here in harm order; this file is merged into the
shared `ADVERSARIAL-AUDIT-FINDINGS-2026-06-24.md` at final aggregation.

---

## Sub-session 1 — `delegation_scope`

```
AUDIT SESSION HEADER
====================
Session ID         : 2026-06-24-Claude-Coherence-delegation_scope
Reviewing model    : Claude (Opus)
Track              : coherence (DC/AK lead; RI/SC/BD ride-along; redundancy note)
Cluster            : delegation_scope
Total in Scope     : 42 unique items across 66 candidate pairs
Banks              : gemini-canonical.json, gpt-canonical.json (read-only)
Producer basis     : every pair is gemini×gemini, gpt×gpt, or gemini×gpt; Claude
                     is a non-producer for both ends of all 66 pairs (clean lane).
Canonical writes   : none
Audit Categories   : DC, AK, RI, SC, BD, redundancy
Total Findings     : 2 (both minor, single-item RI/BD; both FIX/patch)
  HIGH confidence  : 2
  MEDIUM confidence: 0
  LOW confidence   : 0
DC/AK result       : NULL — no cross-item contradiction met the evidentiary
                     standard across all 66 pairs.
Redundancy         : 2 near-duplicate clusters noted, both DISMISS/keep (varied
                     scenarios = legitimate spaced practice, not strictly dominated).
```

### Scope composition (why the cluster is heterogeneous)

The `delegation_scope` concept seed pulled in five adjacent sub-topics that all
turn on "who may do what": (a) UAP delegation MC/SATA, (b) LPN/LVN scope MC/SATA,
(c) team-member assignment matrices, (d) prioritization / "assess-first" items,
and (e) disaster START/triage and transmission-based isolation matrices (pulled
in through `gap_50_sic_03`). DC/AK was judged within and across these sub-topics;
RI/SC/BD was judged on every item.

### DC / AK — null result (verbatim basis)

No two items teach incompatible delegation, triage, or isolation rules. The
scope boundaries are stated consistently across all 42 items:

- **UAP** ← standardized, predictable tasks for *stable* clients: ambulation of
  an assessed/stable client (`easy_prioritization_02`, `gemini_c9_08`,
  `gpt_u6_matrix_cloze_2026_06_09_matrix_delegation_scope_04` r1), routine vitals
  on a stable client (`mc_delegation_uap_vitals_001` "A", `gemini_c9_08` "A",
  `gemini_moc_ngn_2026_06_22_q8` "D"), I&O recording (`gemini_moc_ngn_2026_06_22_q8`
  "A"), clean-catch specimen (`gemini_p8_02` "D", `gemini_c9_08` "F"), emptying/
  measuring drainage (`gemini_jun05_a_mc_delegation_21` "B"), bed bath/hygiene
  (`trad_batchB_01` "C"), repositioning per a posted plan
  (`gpt_case_gap_2026_06_11_pressure_ltc_part_3_mc_delegate` "A"). Every item
  **excludes** assessment, teaching, medication administration, and feeding a
  high-aspiration-risk client from UAP (`trad_batchB_01` "B",
  `gemini_c9_08` "E").
- **LPN/LVN** ← routine care for *stable, predictable* clients: scheduled oral/
  SubQ/IM meds (`easy_prioritization_04` "A", `gemini_b10_02` "A",
  `gemini_c3_01` "A", `trad_batchB_02` "A"), sterile dressing change on a stable
  wound (`gemini_b10_02` "B", `gemini_c3_01` "B", `trad_batchB_02` "B"),
  suctioning an *established* tracheostomy (`gemini_c3_01` "D", `trad_batchB_02`
  "D"), reinforcing RN-initiated teaching, and monitoring/data collection on
  stable clients. Every item **reserves for the RN** the initial assessment, care
  planning, initial/complex teaching, and high-risk delivery — and the two items
  that test IV push agree it is outside LPN scope: `gemini_b10_02` excludes "a
  bolus dose of intravenous morphine" ("IV push medications, especially opioids,
  are typically reserved for RNs") and `trad_batchB_02` excludes "an intravenous
  (IV) push medication for pain" ("IV push medications are generally outside the
  standard NCLEX scope for LPNs"). Titration is uniformly RN (`gemini_c3_07` "A"
  oxygen titration excluded; `gemini_p8_08` "C" vasopressor titration excluded).
- **Disaster triage (START/ESI)** is internally consistent: a client who is
  apneic after airway repositioning is expectant/black, never immediate
  (`gpt_canonical_sata_disaster_triage_037` "D",
  `gemini_c9_01` "B", `gemini_jun05_a_matrix_disaster_triage_27` r2,
  `gpt_case_mass_casualty_start_triage_01_q1` casualty_a/g); RR > 30, poor
  perfusion, or altered mental status is red. No two triage items key the same
  physiology differently.
- **Transmission-based isolation** (`gap_50_sic_03`, `gemini_sic_ngn_2026_06_21_q8`,
  `gpt_u6_matrix_cloze_2026_06_09_matrix_infection_precautions_02`) agree: TB =
  Airborne; influenza/pertussis = Droplet; MRSA/C. difficile = Contact;
  disseminated VZV = Airborne + Contact; localized covered zoster in an
  immunocompetent host = Standard; severe neutropenia = Protective. The three
  matrices use **local** column IDs, so there is no cross-item answer-key collision.

**Alternative Interpretation (DC/AK):** Every pair reconciles cleanly by
personnel level, client acuity/stability, and the tested construct (delegate vs.
assess-first vs. triage-tag vs. isolation-category). Because reconciliation is
stronger than any conflict claim on every pair, the DC/AK disposition is
DISMISS/keep — consistent with the already-accepted Gemini adjudication and the
Codex lane.

### CONCERN #1 — RI — `gemini_c9_01` (gemini-canonical.json `questions[365]`)

**Category:** RI (internal inconsistency). **Severity:** minor. **Confidence:** HIGH.

The summary `rationale.correct` names the wrong option letter while correctly
describing the keyed answer's content.

- **Keyed answer:** `correct: ["A"]` — option A is "A client with an open
  pneumothorax and a respiratory rate of 34 breaths/minute."
- **Summary rationale (verbatim):** "**B** is assigned a 'Red' tag because an
  open pneumothorax is a life-threatening respiratory emergency that requires
  immediate intervention (e.g., occlusive dressing) but is survivable with prompt
  care." — but option **B** is "a client with a severe head injury, no
  spontaneous respirations, and a GCS score of 3."
- **Per-choice rationale (verbatim, both correct):** `byChoice[A]`: "Red tag
  (Immediate): Open pneumothorax compromises breathing and requires immediate
  attention." `byChoice[B]`: "Black tag (Expectant): A client with no spontaneous
  respirations and a severe head injury is unlikely to survive…"

**Conflict claim:** The summary sentence's leading letter ("B") contradicts the
keyed answer (A) and the per-choice rationale (A = Red, B = Black). A learner who
anchors on the summary letter could mis-map "Red" to the head-injury client.

**Alternative Interpretation (Reconciliation):** This is a transposed option
letter, not a clinical error. The clinical reasoning, the key, and both
per-choice rationales are correct and mutually consistent; only the one summary
letter is wrong. The keyed answer does **not** change.

**Disposition:** FIX / patch (EN summary letter "B" → "A"). `needsHumanReview =
false` (key unchanged). Minor severity because the per-choice rationale already
disambiguates.

### CONCERN #2 — BD — `gap_50_sic_03` (gemini-canonical.json `questions[725]`)

**Category:** BD (bilingual — ZH lexical error). **Severity:** minor. **Confidence:** HIGH.

The Chinese rationale renders "Influenza" as a non-word.

- **EN (verbatim):** "Influenza requires Droplet precautions."
- **ZH (verbatim):** "流液需要飞沫传播预防措施。" — "流液" is not a disease term;
  the intended word is "流感" (influenza). The droplet-precaution mapping
  ("飞沫传播预防措施") is correct.

**Conflict claim:** A Chinese-reading learner sees a garbled disease name in the
summary rationale.

**Alternative Interpretation (Reconciliation):** Per AGENTS check 13 / pilot §4,
a BD finding requires a *clinical meaning change* (who/what/timing/route/value).
Here the precaution category is unchanged and correct, and the matrix row mapping
(influenza → droplet) is intact, so this is a single-character ZH typo, not a
clinical divergence — minor polish, not `major`/`blocker`.

**Disposition:** FIX / patch (ZH "流液" → "流感"). `needsHumanReview = false`.

### SC — null result

No stem cueing or answer leakage was found. The prioritization and triage stems
describe scenarios without telegraphing the keyed option.

### Redundancy — noted, DISMISS/keep

Two near-duplicate clusters of ≥3 surfaced; neither is strictly dominated, so
both are kept:

1. **"Assess-first" prioritization** — `easy_prioritization_01`, `gemini_p8_01`,
   `gemini_p8_06`, `trad_batchB_03` (plus `easy_prioritization_03`): same
   ABC/priority construct, but each uses distinct clinical scenarios. Legitimate
   spaced practice.
2. **START red-tag identification** — `gemini_c9_01`, `gemini_p8_05`,
   `gemini_gap_case_disaster_triage_05_q1`, and the START matrices
   (`gemini_jun05_a_matrix_disaster_triage_27`,
   `gpt_case_mass_casualty_start_triage_01_q1`): same algorithm, different
   incidents (train derailment / explosion / mass casualty) and item formats.
   Varied practice, not redundant in the harmful sense.

No `discard` is recommended for either cluster (pilot §4 "No UWorld overfitting"
+ §6 — only strictly-dominated duplicates retire).

### Sub-session 1 remediation queue (delegation_scope)

- **discard / retire (CUT):** none.
- **patch (FIX, minor):** CONCERN #1 (`gemini_c9_01`, ZH/EN: EN summary letter
  "B"→"A"); CONCERN #2 (`gap_50_sic_03`, ZH "流液"→"流感"). Both are text-only,
  key-preserving, batchable polish — not blocker/major, so no urgent repair spec.
- **source_check:** none (all dispositions are internal; no guideline-dependent
  adjudication required — the delegation/triage/isolation rules cited are
  standard NCSBN/ANA scope and CDC transmission categories, used only to confirm
  *consistency*, not to break a contradiction).
- **hold:** none.
- **minor polish:** the two patch items above.
- **housekeeping:** none.

*Scale-or-stop is deferred to the final aggregation step (after isolation_mode
and potassium/insulin sub-sessions and the Opus currency exception land).*

---

## Sub-session 2 — `isolation_mode`

```
AUDIT SESSION HEADER
====================
Session ID         : 2026-06-24-Claude-Coherence-isolation_mode
Reviewing model    : Claude (Opus)
Track              : coherence (DC/AK lead; RI/SC/BD ride-along; redundancy note)
Cluster            : isolation_mode
Total in Scope     : 26 unique items across 55 candidate pairs
Banks              : gemini-canonical.json, gpt-canonical.json (read-only)
Producer basis     : every pair is gemini×gemini, gpt×gpt, or gemini×gpt; Claude
                     is a non-producer for both ends of all 55 pairs (clean lane).
Canonical writes   : none
Audit Categories   : DC, AK, RI, SC, BD, redundancy
Total Findings     : 0 actioned (zero-finding sub-session)
  HIGH confidence  : 0
  MEDIUM confidence: 0
  LOW confidence   : 0
DC/AK result       : NULL — no cross-item contradiction met the evidentiary standard.
RI/SC/BD result    : NULL — no actionable single-item defect.
Redundancy         : high topical density (transmission categories + PPE
                     sequencing) but each item is a distinct scenario/format; no
                     strictly-dominated duplicate. DISMISS/keep.
```

### DC / AK — null result (verbatim basis)

This cluster has the highest topical density in the slice (transmission-based
precautions + PPE don/doff order), so it is the strongest test for an answer-key
collision. The keyed transmission categories are identical across every item:

- **Airborne** = pulmonary TB (negative-pressure AIIR, fit-tested N95, door
  closed, client surgical mask for transport): `easy_resp_infect_02` ("D"),
  `trad_batchD_14` ("A","B","C"), `gemini_d10_05`, `gen_sic_batch2_2`,
  `mc_airborne_tb_precautions_004` ("A"), `gemini_jun05_a_sata_airborne_precautions_03`,
  `gpt_gap_jun11_sata_tb_airborne_precautions_01`, `gpt_hl_sic_airborne_tb_08`,
  `gemini_sic_ngn_2026_06_21_q6`, `gemini_sic_ngn_2026_06_21_q15` ("B" excluded
  from droplet). Every TB item rejects a surgical mask for staff and keeps the
  door closed — no item keys TB as droplet.
- **Droplet** = meningococcal meningitis / pertussis / Hib / Mycoplasma
  (surgical mask on entry, private room, continue ≥24 h after effective
  antimicrobials): `gemini_b4_01` ("D"), `gemini_b4_08` ("B"), `trad_batchB_16`
  ("C"), `gpt_canonical_matrix_meningitis_precautions_105`,
  `gpt_gap_jun11_sata_meningococcal_droplet_03` ("A","B","C","E"),
  `gemini_sic_ngn_2026_06_21_q15` ("A","C","D","F"). The "≥24 h after effective
  antibiotics" stop-rule is stated identically in
  `gpt_gap_jun11_sata_meningococcal_droplet_03` "C" and
  `gemini_sic_ngn_2026_06_21_q15` byChoice[A].
- **Contact** = MRSA wound (gown + gloves, surgical mask is *not* the main
  measure): `gemini_b9_06`, `gpt_case_infection_control_clustered_care_01_q3`
  ("q3_f" surgical-mask-as-main rejected).
- **Airborne + Contact** = varicella (negative-pressure room + N95 for
  susceptible staff + gown/gloves): `gpt_gap_jun11_sata_varicella_precautions_02`
  ("F" droplet-alone rejected), consistent with `gemini_sic_ngn_2026_06_21_q15`
  byChoice[E].

The **gown/gloves-for-airborne distinction is keyed consistently**, not
contradictorily: TB-airborne-only items do *not* require routine gown/gloves
(`gemini_jun05_a_sata_airborne_precautions_03` "D" rejected — "regardless of body
fluid exposure"), whereas varicella (airborne **+ contact**) *does*
(`gpt_gap_jun11_sata_varicella_precautions_02` "D" keyed). Different organisms,
correct different keys — coherent, not conflicting.

**PPE sequence consistency (positive coherence):** All three donning items key
*gown → mask → goggles → gloves* (`gap_50_sic_01`, `gemini_b10_05`,
`gemini_jun05_a_or_ppe_donning_56`, the last prefixing hand hygiene); all four
doffing items key *gloves → goggles → gown → mask*
(`gap_50_sic_02`, `gemini_p1_03`, `gen_sic_batch2_3`, and `gemini_sic_ngn_2026_06_21_q1`
in its combined-step airborne variant). No item keys an opposing order.

**Alternative Interpretation (DC/AK):** Every pair reconciles by organism and PPE
step; the cluster is internally and mutually consistent. DISMISS/keep, in line
with the Gemini and Codex lanes.

### Two near-conflicts examined and dismissed

1. **Doffing variant — `gemini_sic_ngn_2026_06_21_q1` vs the other doffing items.**
   q1 removes "gloves **and gown** inside the room" as one step, then goggles,
   then the N95 outside; the others remove gloves first and the gown third (after
   goggles). Both are CDC-published doffing sequences (the "gown + gloves
   together" variant vs "gloves first"); neither item is the same question with an
   opposite key. Reconciliation strong → DISMISS (Hedge Rule). Worth a future
   style note only if the bank wants a single canonical doffing order.
2. **`trad_batchD_14` "ensure available" vs `gemini_jun05_a_sata_airborne_precautions_03`
   "wear for all interactions."** `trad_batchD_14` keys gown/gloves as PPE to
   *ensure available* for an airborne client; `gemini_jun05` rejects wearing
   gown/gloves *for every interaction regardless of fluid exposure*. These answer
   different questions (stocking vs universal donning) and are reconcilable;
   `trad_batchD_14` byChoice[B] ("Gloves are part of standard precautions for all
   client contact") is a mild imprecision, not a misteaching. LOW / minor →
   DISMISS.

### Redundancy — noted, DISMISS/keep

The cluster is topically dense (≥3 TB-airborne items; ≥3 meningococcal-droplet
items; ≥3 PPE-sequence items), but each is a distinct scenario or item format
(MC / SATA / matrix / ordered_response / dropdown_cloze / highlight). None is
strictly dominated; varied practice across formats is pedagogically valuable. No
`discard`.

### Sub-session 2 remediation queue (isolation_mode)

- **discard / retire:** none.
- **patch:** none.
- **source_check:** none (transmission categories and the 24-hour droplet
  stop-rule are standard CDC content, cited only to confirm consistency).
- **hold:** none.
- **minor polish:** none actioned (the two near-conflicts above are DISMISS;
  a single canonical doffing order is an optional future style choice, not a
  defect).
- **housekeeping:** none.

---

## Sub-session 3 — `potassium_replacement` + `insulin_hypoglycemia`

```
AUDIT SESSION HEADER
====================
Session ID         : 2026-06-24-Claude-Coherence-potassium+insulin
Reviewing model    : Claude (Opus)
Track              : coherence (DC/AK lead; RI/SC/BD ride-along; redundancy note)
Clusters           : potassium_replacement, insulin_hypoglycemia (combined)
Total in Scope     : 33 unique items across 28 candidate pairs
Banks              : gemini-canonical.json, gpt-canonical.json, hard-cases-canonical.json,
                     claude-canonical.json (read-only)
Producer basis     : all pairs are gemini/gpt-provenance for both ends. The
                     opus_* / opus3_* / opus24_* items are Opus-skeleton cases,
                     GPT-provenance per DECISIONS principle 22, so Claude is a
                     non-producer. Two opus3 leaves (q3/q5) additionally carry a
                     prior Claude *promotion* review; auditing them here is in
                     scope because coherence is a RELATIONAL cross-item judgment
                     (does A contradict B), not the single-item re-review that
                     blocked them for currency (per the lane spec). Their
                     single-item currency is handled separately in the Opus
                     currency exception.
Canonical writes   : none
Audit Categories   : DC, AK, RI, SC, BD, OG, redundancy
Total Findings     : 0 actioned. 1 near-conflict documented and DISMISSED.
  HIGH confidence  : 0
  MEDIUM confidence: 0
  LOW confidence   : 1 (DISMISS)
DC/AK result       : NULL — no actionable contradiction. Highest-stakes cluster
                     (IV potassium, hyperkalemia treatment, insulin, refeeding,
                     digoxin) and internally consistent.
Source posture     : guideline-sensitive content, but every disposition is
                     DISMISS/keep — no FIX adjudicated against a guideline — so no
                     dated source is required (pilot §4). The peripheral-KCl
                     thresholds below are cited only to confirm internal
                     consistency.
```

### DC / AK — null result (verbatim basis)

The pharmacology/electrolyte teaching is consistent across all 33 items:

- **Hyperkalemia management sequence** is identical everywhere: stabilize the
  myocardium with **calcium first**, then **insulin + dextrose** to shift,
  then **removal** (SPS / dialysis), with continuous ECG and post-insulin
  glucose monitoring — `gemini_c1_01` ("D" calcium gluconate first),
  `gemini_b9_10`, `gpt_case_aki_…_q4`, `gpt_case_aki_…_q5`,
  `gpt_case_gap_2026_06_11_aki_or_03`, `gpt_case_gap_2026_06_11_case_tls_01_q3`,
  `gpt_deepen_2026_06_23_bow_06`. No item gives potassium for hyperkalemia
  (`gpt_deepen_2026_06_23_bow_06` "q06_a_potassium" rejected).
- **Hyperkalemia ECG**: tall peaked T waves as the earliest change
  (`gemini_p4_06` "B", `trad_pa_05` "D"), with U waves / ST depression assigned
  to *hypo*kalemia in both — consistent.
- **IV-potassium safety** (high-alert): pump-controlled, telemetry, IV-site
  assessment, full verification, **never IV push** —
  `opus3_iv_potassium_safety_case_01_q5` ("D" IV-push rejected),
  `opus24_case_elder_neglect_med_mismanagement_01_q4` ("D" IV-push rejected),
  `opus_case_lithium_toxicity_q4` ("C" gravity-drip rejected). The peripheral
  **limit is keyed consistently from both sides**: 10 mEq/100 mL over 1 h is
  taught as safe (`opus24_…_q4`), while 20 mEq/100 mL over 1 h
  (`opus_case_lithium_toxicity_q4`) and 40 mEq over 2 h = 20 mEq/h
  (`opus3_…_q3`) are taught as exceeding usual peripheral limits and requiring
  clarification.
- **DKA / insulin**: regular insulin IV for DKA (`easy_dka_01` "B", with a
  correct caveat that aspart may also be given IV); replace potassium **before**
  insulin when K is already low because insulin shifts K intracellularly
  (`gemini_d10_03`); fluids-first priority (`gemini_p5_10`, `gemini_p7_06` for
  HHS). This is consistent with — not contradicted by — the hyperkalemia items'
  use of insulin to *lower* K: different potassium states, same mechanism.
- **Insulin mixing**: air→NPH, air→Regular, draw Regular, draw NPH ("clear
  before cloudy") in both `gap_50_ppt_05` and `gemini_d2_insulin_01` ("D").
- **Insulin hypoglycemia**: awake + able to swallow → 15 g fast carbohydrate →
  recheck in 15 min → do not give more insulin / do not leave alone / do not
  ambulate — `gpt_deepen_2026_06_22_b_pharm_05`, `…_bow_05`,
  `gpt_deepen_2026_06_23_bow_09`, and both
  `gpt_pharm_easy_medium_2026_06_21_*_bowtie_insulin_hypoglycemia_05/06`.
- **Refeeding syndrome** (low phos/K/Mg after restarting calories → slow/hold
  calories, replace electrolytes, monitor; do not advance, do not bolus insulin):
  `gpt_deepen_2026_06_22_bow_07`, `gpt_deepen_2026_06_23_bcc_01`,
  `gpt_fresh_2026_06_22_pharm_06` — consistent.
- **Digoxin toxicity** (hold for HR < 60 or K < 3.5; hypokalemia potentiates
  toxicity; yellow halos / nausea / bradycardia): `gpt_deepen_2026_06_22_b_pharm_03`,
  `gpt_fresh_2026_06_22_pharm_07` — consistent.

**Alternative Interpretation (DC/AK):** Every pair reconciles by the clinical
state (hyper- vs hypo-kalemia, DKA vs hypoglycemia) and the shared, correctly
keyed mechanisms. DISMISS/keep.

### Near-conflict examined and DISMISSED (LOW) — KCl 20 mEq/100 mL

`gpt_pharm_easy_medium_2026_06_21_a_fib_kcl_rate_04` (gpt-canonical
`questions[324]`) presents "potassium chloride 20 mEq diluted in 100 mL normal
saline … over 2 hours by pump" as a routine rate calculation (answer 50 mL/h =
10 mEq/h) with **no route stated and no safety claim about the concentration**.
`opus_case_lithium_toxicity_q4` (claude-canonical `questions[67].caseStudy.questions[3]`)
keys the same **20 mEq/100 mL** concentration as one that "exceed[s] the unit's
usual peripheral limit (typically 10 mEq/100 mL)" and must be held/clarified.

**Conflict claim:** a learner could read 20 mEq/100 mL as both "routine" and
"exceeds the peripheral limit."

**Alternative Interpretation (Reconciliation):** the calc item makes **no
peripheral claim** — it explicitly says "the potassium amount is important for
safety verification, but the pump rate comes from volume divided by time," and
its **rate (10 mEq/h) is within** the peripheral limit. 20 mEq/100 mL is a real
premixed concentration that is appropriate centrally and within some facility
peripheral ranges; the lithium case's "10 mEq/100 mL" is explicitly the *usual*
facility limit. The two items answer different questions (arithmetic vs
peripheral-safety judgment), so reconciliation is stronger than the conflict.
**LOW confidence → DISMISS** (Hedge Rule). No dated source needed because nothing
is adjudicated against a guideline.

**Optional polish (not actioned):** if the bank wants every KCl item to model
the conservative peripheral concentration, the calc item could specify "via
central line" or use 10 mEq/100 mL. This is a style-consistency choice, not a
defect — `recommendedAction = keep`.

### RI / SC / BD / OG — null

No internal inconsistency, stem cueing, bilingual divergence, or stale-guideline
finding met the evidentiary standard. The ZH renderings are faithful, the
dosage-calculation answers are arithmetically correct (`…a_fib_kcl_rate_04`:
100 mL ÷ 2 h = 50 mL/h; `opus3_…_q3`: 40 mEq ÷ 2 h = 20 mEq/h), and the keyed
guideline content (calcium-first, peripheral-KCl limits, 15 g/15-min
hypoglycemia rule, digoxin hold parameters) is current standard nursing
practice.

### Redundancy — noted, DISMISS/keep

Two dense bowtie families (≥3 each): insulin-hypoglycemia (`…_bow_05`,
`…_bow_09`, `…_bowtie_05`, `…_bowtie_06`) and refeeding syndrome (`…_bow_07`,
`…_bcc_01`, `…_pharm_06`). Each uses distinct stems, tokens, and decoy
parameters; none is strictly dominated. Varied NGN-format practice — keep.

### Sub-session 3 remediation queue (potassium + insulin)

- **discard / retire:** none.
- **patch:** none.
- **source_check:** none — guideline-sensitive content, but all DISMISS/keep, so
  no source-gated action (pilot §4).
- **hold:** none.
- **minor polish:** the optional KCl-concentration consistency note above
  (DISMISS / keep — surfaced for Luke's awareness, not queued as a defect).
- **housekeeping:** none.

---
