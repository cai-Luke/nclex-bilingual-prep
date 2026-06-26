# Gemini Review Spec: claude×gpt Cross-Product Coherence Pairs (Phase B)

## Objective

Perform a relational **coherence** audit of the 31 cross-product pairs listed in
*Exact Scope*, each pairing a Claude-produced item with a GPT-produced item that
the Layer A similarity/redundancy pass flagged as touching a shared clinical
concept. The audit question is singular and relational:

> Do the two items in a pair teach **mutually contradictory** rules, keys, or
> safety thresholds for the same clinical decision?

Review canonical content; never edit it. This is advisory output for Luke's
human adjudication.

## Why Gemini, and the conflict status (read carefully)

These pairs route to Gemini because **no other model reviewer is producer-clean**
on them: the Claude end is conflicted for Claude (principle 22 — `claude_moc_*`
and other `claude_*` items are Claude-produced, not prose-only Opus cases), and
the GPT end is conflicted for GPT-5 (generation conflict). Gemini authored
**neither** end of any of these 31 pairs (every end is `claude_*` or
`gpt_*`/gpt-canonical; verified against the Layer A queue), so this pass **does**
satisfy producer≠checker (principle 2) for these specific pairs — unlike the
prior `GEMINI-13-ITEM-REVIEW-SPEC.md` currency pass, which could not claim that.

Nonetheless:

- This is **flag-only**. Gemini never mutates JSON, keys, ids, rationale, or
  Chinese text (principle 8 extension, principle 5). Output is an issue list.
- Luke reads and adjudicates **every** returned finding and judges whether the
  review itself was sufficiently rigorous before any of it is actioned.
- Canonical banks, ledger, census, history, campaign status, and source files
  are read-only.

## Read First (in order)

1. `AGENTS.md`
2. `Archive/root-specs-2026-06-18/NCLEX_Audit_Spec.md` — **parent spec**; the
   Finding §6 / Single-Question Concern §7 format, evidentiary standards §4, and
   hallucination guards §5 live here, not in the pilot spec.
3. `Archive/early-bank-semantic-audit-spec.md` — campaign.
4. `adversarial-audit-phase-a-pilot-spec.md` — pilot; **severity axis §3,
   citation rules §4, manifest schema §5** (used below).
5. `NCLEX-Question-Schema.md` — item-type shapes.
6. `banks/claude-canonical.json` and `banks/gpt-canonical.json`.

The Layer A queue is routing evidence only. A similarity pairing is **not** a
finding; many of these pairs will reconcile to no contradiction.

## Exact Scope — 31 pairs (audit unit = the pair)

Claude end first, then GPT end. `caseStudy.questions[n]` paths are embedded case
leaves — read the parent case container for exhibits/stage context before
judging.

| # | Claude item (bank `claude-canonical.json`) | GPT item (bank `gpt-canonical.json`) | shared cluster |
|---|---|---|---|
| 1 | `claude_a_fib_amoxicillin_pediatric_15` `questions[12]` (fill_in_blank) | `fib_acetaminophen_tablets_027` `questions[26]` (fill_in_blank) | — |
| 2 | `claude_a_fib_dopamine_drip_05` `questions[3]` (fill_in_blank) | `gpt_canonical_fib_heparin_rate_033` `questions[32]` (fill_in_blank) | — |
| 3 | `claude_a_fib_dopamine_drip_05` `questions[3]` (fill_in_blank) | `gpt_pharm_easy_medium_2026_06_21_a_fib_heparin_rate_01` `questions[321]` (fill_in_blank) | — |
| 4 | `claude_a_matrix_anticoagulant_monitoring_16` `questions[13]` (matrix) | `gpt_u6_matrix_cloze_2026_06_09_matrix_heparin_safety_11` `questions[132]` (matrix) | — |
| 5 | `claude_a_matrix_asthma_06` `questions[4]` (matrix) | `gpt_canonical_matrix_asthma_exacerbation_065` `questions[64]` (matrix) | — |
| 6 | `claude_a_matrix_neonatal_assessment_46` `questions[40]` (matrix) | `gpt_canonical_matrix_newborn_findings_045` `questions[44]` (matrix) | — |
| 7 | `claude_a_matrix_wound_assessment_26` `questions[22]` (matrix) | `gpt_canonical_matrix_wound_assessment_077` `questions[76]` (matrix) | — |
| 8 | `claude_a_matrix_wound_assessment_26` `questions[22]` (matrix) | `gpt_u6_matrix_cloze_2026_06_09_matrix_post_thyroidectomy_complications_03` `questions[124]` (matrix) | — |
| 9 | `claude_a_matrix_wound_assessment_26` `questions[22]` (matrix) | `matrix_postop_findings_028` `questions[27]` (matrix) | — |
| 10 | `claude_a_mc_dabigatran_teaching_03` `questions[2]` (multiple_choice) | `mc_warfarin_bleeding_teaching_018` `questions[17]` (multiple_choice) | — |
| 11 | `claude_a_mc_metformin_contrast_13` `questions[10]` (multiple_choice) | `gpt_deepen_2026_06_22_bow_10` `questions[400]` (dropdown_cloze) | — |
| 12 | `claude_a_mc_postpartum_fundus_41` `questions[36]` (multiple_choice) | `gpt_canonical_cloze_postpartum_hemorrhage_044` `questions[43]` (dropdown_cloze) | fetal_heart_rate |
| 13 | `claude_a_or_iv_push_safety_14` `questions[11]` (ordered_response) | `gpt_canonical_or_medication_error_084` `questions[83]` (ordered_response) | — |
| 14 | `claude_a_or_iv_push_safety_14` `questions[11]` (ordered_response) | `gpt_canonical_or_telephone_order_110` `questions[109]` (ordered_response) | — |
| 15 | `claude_a_or_iv_push_safety_14` `questions[11]` (ordered_response) | `or_hypoglycemia_actions_026` `questions[25]` (ordered_response) | — |
| 16 | `claude_a_sata_eps_haloperidol_12` `questions[9]` (select_all) | `gpt_case_clozapine_toxicity_01_q2` `questions[305].caseStudy.questions[1]` (select_all) | — |
| 17 | `claude_a_sata_hf_discharge_02` `questions[1]` (select_all) | `gpt_case_gap_2026_06_11_community_resources_part_3_sata_actions` `questions[161].caseStudy.questions[2]` (select_all) | — |
| 18 | `claude_a_sata_hf_discharge_02` `questions[1]` (select_all) | `gpt_case_opus23_nat_toddler_01_q5` `questions[267].caseStudy.questions[4]` (select_all) | — |
| 19 | `claude_a_sata_hf_discharge_02` `questions[1]` (select_all) | `gpt_case_unsafe_premature_discharge_01_q4` `questions[297].caseStudy.questions[3]` (select_all) | — |
| 20 | `claude_a_sata_hf_discharge_02` `questions[1]` (select_all) | `gpt_opus21_case_colostomy_lep_discharge_01_q2` `questions[268].caseStudy.questions[1]` (select_all) | — |
| 21 | `claude_a_sata_hf_discharge_02` `questions[1]` (select_all) | `gpt_opus21_case_colostomy_lep_discharge_01_q6` `questions[268].caseStudy.questions[5]` (select_all) | — |
| 22 | `claude_a_sata_mmr_vaccine_48` `questions[42]` (select_all) | `gpt_gap_2026_06_12_nonmcq_balanced_b_case_peds_dehydration_03_q5` `questions[256].caseStudy.questions[4]` (select_all) | isolation_mode |
| 23 | `claude_a_sata_neonatal_jaundice_42` `questions[37]` (select_all) | `gpt_canonical_sata_breastfeeding_085` `questions[84]` (select_all) | — |
| 24 | `claude_a_sata_neonatal_jaundice_42` `questions[37]` (select_all) | `gpt_canonical_sata_pregnancy_warning_signs_053` `questions[52]` (select_all) | — |
| 25 | `claude_a_sata_neonatal_jaundice_42` `questions[37]` (select_all) | `sata_newborn_safety_teaching_008` `questions[7]` (select_all) | — |
| 26 | `claude_jun05_pharm_clozapine_teaching_05` `questions[49]` (select_all) | `gpt_case_clozapine_toxicity_01_q2` `questions[305].caseStudy.questions[1]` (select_all) | — |
| 27 | `claude_jun05_pharm_clozapine_teaching_05` `questions[49]` (select_all) | `gpt_case_clozapine_toxicity_01_q4` `questions[305].caseStudy.questions[3]` (select_all) | — |
| 28 | `claude_jun05_pharm_clozapine_teaching_05` `questions[49]` (select_all) | `gpt_case_clozapine_toxicity_01_q6` `questions[305].caseStudy.questions[5]` (select_all) | — |
| 29 | `claude_jun05_pharm_pca_opioid_safety_04` `questions[48]` (multiple_choice) | `gpt_canonical_cloze_opioid_safety_094` `questions[93]` (dropdown_cloze) | — |
| 30 | `claude_moc_hipaa_breach_hl_b03` `questions[85]` (highlight) | `gpt_deepen_2026_06_22_moc_01` `questions[413]` (highlight) | delegation_scope, hipaa_disclosure |
| 31 | `claude_moc_hipaa_breach_hl_b03` `questions[85]` (highlight) | `gpt_deepen_2026_06_22_moc_11` `questions[423]` (highlight) | hipaa_disclosure |

**Excluded — already adjudicated in the Phase A pilot (do NOT re-audit):**
`claude_moc_deleg_matrix_08` × `gpt_canonical_matrix_scope_assignment_050` and
`claude_moc_lpn_deleg_hl_b01` × `gpt_hl_moc_lpn_scope_05`. Both were
dismissed/kept by Luke.

Several Claude items recur across pairs (e.g. `claude_a_sata_hf_discharge_02` in
6 pairs, `claude_a_or_iv_push_safety_14` and `claude_a_matrix_wound_assessment_26`
in 3 each). Read each recurring item once; judge each **pair** independently.

## What counts as a coherence finding

Primary category: **`DC`** — direct cross-item contradiction. File a finding
only when both items address a **genuinely shared decision** and their keyed
answers or taught rules are **mutually exclusive** — one cannot be correct
without making the other wrong.

Three outcomes, and only the first is a finding:

1. **Contradiction (`DC`, file it):** same clinical decision, incompatible keys
   or taught thresholds. State both keyed rules verbatim (EN + ZH) and why they
   cannot both hold.
2. **Reconcilable (`DISMISS`):** the apparent tension resolves under a real
   distinction — different client acuity, different personnel level (UAP vs
   LPN vs RN), different care stage, different drug/route, or a stated
   closed-world order. Record the reconciliation; do not file.
3. **No shared decision (`DISMISS`, `findingRef: NULL-COHERENCE`):** the pair was
   matched on item-type/format or surface keywords but tests different concepts
   with no rule that could contradict (expected for several dose-calculation and
   format-twin pairs here). One line is enough.

Ride-along categories (`RI` rationale-vs-key, `AK` key-vs-data, `BD` EN/ZH
divergence, arithmetic/dose) only when the defect **blocks** the coherence
judgment for that pair; this is not a single-item currency or redundancy pass.

**Jurisdiction (NY RN).** Scope-of-practice and delegation pairs (notably #30,
#31, and any UAP/LPN/RN keying) anchor on **New York RN licensure** — the app's
jurisdiction. A divergence that is merely NY-vs-other-state is **not** a
contradiction: mark `recommendedAction = source_check`, `needsHumanReview = true`,
and state the jurisdictional dependency rather than asserting one item wrong.

## Required Method (per pair)

1. Retrieve both items in full (stem, options, key, rationale EN+ZH; for case
   leaves, the parent exhibits/stage/timeline).
2. Identify the shared clinical decision, if any. If none → `NULL-COHERENCE`.
3. State each item's keyed rule and the rationale sentence that carries it.
4. Test the strongest reconciliation (acuity / level / stage / route /
   closed-world order / jurisdiction) **before** filing.
5. File `DC` only if a genuine contradiction survives. Provide the Strongest
   Alternative Interpretation for every filed finding.
6. For a contradiction, do **not** assume which side is wrong. Unless one item is
   plainly wrong against a **dated authoritative source** (body + year + value +
   URL), set `verdict = REVIEW`, `needsHumanReview = true` — which item to change
   is Luke's call. Propose a bilingual cure only when a single side is
   source-provably wrong.
7. Check EN and ZH independently.
8. Return no finding when the pair is coherent. Do not manufacture output to fill
   the batch (principle 7: five evidenced findings beat thirty probable ones).

## Severity, confidence, verdict

- **Severity** (pilot §3): independent harm-if-real axis — `blocker` / `major` /
  `minor`. A keyed safety contradiction (dose, anticoagulation, isolation,
  delegation safety) is at least `major`; a teaching-emphasis mismatch is
  `minor`.
- **Confidence:** `HIGH` / `MEDIUM` / `LOW`. A `LOW`-confidence concern that
  survives no reconciliation is still a `DISMISS`.
- **Verdict:** `DC`-contradiction → usually `REVIEW` (+ `needsHumanReview`),
  or `FIX` only with a dated source proving one side wrong; otherwise `DISMISS`.
  `source_check` for jurisdictional divergence.

## Output — two lane-scoped files (write only these)

Claude Code merges all lanes later; write only your lane.

**1. Report:** `audit/early-bank-semantic/coherence/lanes/gemini.findings.md`

Start with:

```text
AUDIT SESSION HEADER
====================
Session ID        : 2026-06-25-Gemini-Coherence-CrossProduct
Reviewing Model   : [exact Gemini model + version]
Producer basis    : Gemini non-producer for both ends of all 31 pairs (claude_* and gpt_* only); producer≠checker satisfied. Advisory for Luke's adjudication.
Pairs in scope    : 31 (claude×gpt cross-product; 2 pilot pairs excluded)
Categories        : DC primary; RI/AK/BD/arith only where they block the coherence call
Total findings    : [N]  (HIGH [n] / MEDIUM [n] / LOW [n])
No-finding pairs   : [list pair numbers]
```

For each filed finding: both IDs + banks + paths; verbatim EN+ZH keyed rules for
both items; the specific incompatibility; parent-case context if a leaf; dated
source if claiming one side wrong; Strongest Alternative Interpretation;
severity + confidence + verdict. Group HIGH → MEDIUM → LOW, then DISMISS
reconciliations, then the explicit no-finding pair list. Under ~3,000 words.

**2. Manifest:** `audit/early-bank-semantic/coherence/lanes/gemini.manifest.jsonl`

One row **per item per pair** (so each pair emits two rows cross-referencing via
`pairId`), using the pilot §5 schema exactly — all 17 fields on every row:

```json
{"itemId":"","parentId":null,"bank":"","path":"","itemType":"","pairId":"","categoryCode":"DC","severity":"minor","confidence":"LOW","verdict":"DISMISS","recommendedAction":"keep","needsHumanReview":false,"finding":"","evidence":"","source":null,"reviewingModel":"gemini-<version>","findingRef":"NULL-COHERENCE"}
```

- `pairId` = the other item's id (the partner in this pair).
- `parentId` = the case container id for embedded leaves, else `null`.
- `recommendedAction` ∈ `keep` | `source_check` | `revise` (advisory; never an
  applied edit).
- `findingRef` ties the two rows of a pair together (e.g. `DC-07`), or
  `NULL-COHERENCE` for no-shared-decision dismissals.
- Every row must parse; emit a row for **every** item in **every** scoped pair,
  including dismissals, so the merge has full coverage.

## Prohibited

- Do not edit any file; do not mutate JSON, keys, ids, rationale, or Chinese
  text, even to "fix" a contradiction.
- Do not write outside the two lane files above; do not touch ledger, census,
  history, or campaign status.
- Do not re-audit the 2 excluded pilot pairs; do not broaden beyond the 31.
- Do not cite another question bank, prep site, model output, or blog as
  clinical authority; use primary guidance (body + year + URL) only.
- Do not infer facts absent from an item; do not call a pair coherent merely
  because both items were previously promoted.

## Final Self-Check

- [ ] All 31 pairs considered; the 2 pilot pairs were not.
- [ ] Each filed `DC` states both keyed rules verbatim (EN+ZH) and why they are
      mutually exclusive.
- [ ] Strongest reconciliation tested before every filing.
- [ ] No contradiction assumes which side is wrong without a dated source.
- [ ] NY-RN jurisdiction divergences marked `source_check`, not `DC`.
- [ ] Manifest emits 2 rows per pair, all 17 fields, every line parses.
- [ ] No-finding pairs explicitly listed; counts reconcile to 31 pairs.
- [ ] No file was edited; the report states it is advisory for Luke.

## Part B — Provenance-ambiguous pairs (added 2026-06-25, Luke's routing decision)

15 additional pairs where one end is `producer: "mixed"` (a prefix-less
hard-cases item whose true producer is not deterministically known). No model
reviewer can be asserted producer-clean, so this is a **purely advisory** pass:
Luke adjudicates **every** pair, and producer≠checker is satisfied at the Luke
level, not the model level (the Session-11 precedent in
`GEMINI-13-ITEM-REVIEW-SPEC.md`).

**Producer-basis caveat — read before trusting any non-flag.** For **8 of the 15**
the non-`mixed` end is **gemini-produced**, so Gemini reviews partly its own
output; its "no contradiction" verdict on those is the weakest signal and Luke
reviews them independently regardless. The other 7 (`mixed×gpt` / `claude×mixed`)
Gemini reviews clean. The table marks which is which.

Method, verdicts, severity, the NY-RN rule, and the manifest schema are identical
to Part A. Emit Part B rows into the **same** `gemini.manifest.jsonl` but prefix
`findingRef` with `PROVB-` so Luke can separate them, and note the provenance
ambiguity in each row's `finding`. In the report header, label Part B advisory
and do **not** assert producer≠checker for it.

| # | basis | A | B | cluster |
|---|---|---|---|---|
| 1 | ⚠ mixed×gemini | `cs_ckd_01_q3` `hard-cases questions[3].caseStudy.questions[2]` | `gemini_jun05_a_sata_pacemaker_41` `gemini questions[39]` | dialysis_complications |
| 2 | ⚠ mixed×gemini | `cs_ckd_01_q3` (same) | `trad_batchD_08` `gemini questions[552]` | dialysis_complications |
| 3 | ⚠ mixed×gemini | `cs_ckd_01_q3` | `trad_batchD_10` `gemini questions[554]` | dialysis_complications |
| 4 | ⚠ mixed×gemini | `cs_ckd_01_q3` | `trad_batchD_20` `gemini questions[564]` | dialysis_complications |
| 5 | ⚠ mixed×gemini | `cs_ckd_01_q3` | `trad_batchD_24` `gemini questions[568]` | dialysis_complications |
| 6 | ⚠ mixed×gemini | `cs_ckd_01_q5` `hard-cases questions[3].caseStudy.questions[4]` | `gemini_c8_08` `gemini questions[362]` | dialysis_complications |
| 7 | clean (claude×mixed) | `claude_a_sata_tracheostomy_09` `claude questions[6]` | `cs_ckd_01_q3` `hard-cases questions[3].caseStudy.questions[2]` | dialysis_complications |
| 8 | ⚠ mixed×gemini | `cs_stemi_vfib_04_part_1` `hard-cases questions[35].caseStudy.questions[0]` | `gemini_b1_04` `gemini questions[180]` | mi_chest_pain |
| 9 | clean (mixed×gpt) | `claude_cs_jun06_pressure_injury_bcc_01` `hard-cases questions[29]` | `gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03` `gpt questions[244]` | pressure_injury |
| 10 | clean (mixed×gpt) | `claude_cs_jun06_pressure_injury_bcc_01_part_2` `hard-cases questions[29].caseStudy.questions[1]` | `gpt_canonical_matrix_pressure_injury_040` `gpt questions[39]` | pressure_injury |
| 11 | ⚠ mixed×gemini | `claude_cs_jun06_pressure_injury_bcc_01_part_4` `hard-cases questions[29].caseStudy.questions[3]` | `gemini_d8_10` `gemini questions[463]` | pressure_injury |
| 12 | clean (mixed×gpt) | `claude_cs_jun06_pressure_injury_bcc_01_part_4` (same) | `opus_bcc_rehab_2026_06_10_01` `claude-canonical questions[50]` (producer gpt) | pressure_injury |
| 13 | clean (mixed×gpt) | `claude_cs_jun06_pressure_injury_bcc_01` `questions[29]` | `gpt_case_gap_2026_06_11_case_pressure_injury_ltc_04` `gpt questions[164]` | pressure_injury |
| 14 | clean (mixed×gpt) | `claude_cs_jun06_pressure_injury_bcc_01` `questions[29]` | `gpt_case_premium_2026_06_10_case04_pressure_injury_rehab` `gpt questions[145]` | pressure_injury |
| 15 | clean (mixed×gpt) | `claude_cs_jun06_pressure_injury_bcc_01_part_2` `questions[29].caseStudy.questions[1]` | `gpt_case_gap_2026_06_11_pressure_ltc_part_2_sata_plan` `gpt questions[164].caseStudy.questions[1]` | pressure_injury |

Pairs 9/13/14 and 10/15 share the `claude_cs_jun06_pressure_injury_bcc_01` case — read that container once. Total Gemini scope across Part A + Part B: 46 pairs.
