# Terminal-Sentence Remediation — Reopen Commission Report (R1–R5)

Date: 2026-07-22
Seat: Claude Code (reopen commission, §8 of `TERMINAL-SENTENCE-REMEDIATION-WORK-ORDER-2026-07-22.md`)
Authority: **read-only evidence production.** No bank/`src`/`lib`/`scripts` mutation; no commit/push; no finding added or removed; queue 2235 untouched.
Companion data: `reopen-evidence.jsonl` (35 objects, queue order, one per manifest row).

All evidence below was read from live disk at HEAD via local shell (not the 2 MiB-capped connector). Line numbers are not used as anchors; matches are on text.

---

## Completion-gate status

| Requirement | Status |
|---|---|
| All 35 rows have live evidence (R1) | ✅ complete |
| R2 decides every G2 row | ✅ complete — 11 `OP-B`, 3 `OP-C` |
| R3 corpus `fill_in_blank` count | ✅ complete — 2 items, both on-manifest |
| R4 confirms §3.4 stem render not item-type gated | ✅ **CONFIRMED** |
| R5 anchors for all 35, uniqueness asserted | ✅ complete — **no anchor failures** |

The commission's completion gate is met. Provisional operation classes are now decided (below). Result returns to the architect seat for the owner-ratification packet — **not** to implementation.

---

## R1 — Reopen of all 35 rows

- **Every manifest question id exists on live disk** in the bank named by the manifest.
- **Embedded records confirmed:** queue 1731 resolves to `gpt_case_clozapine_toxicity_01_q5` under `caseStudy.questions[]`; queue 2413 resolves to `cs_sepsis_shock_01_part_1`. Queue 147's finding is on the **container** `stem` (`opus_case_lithium_toxicity_01`), no embedded id required.
- **Live item type matches the manifest for all 35 rows.**
- Full verbatim `stem.en`/`stem.zh` (and `clozeStem` for `dropdown_cloze`, `blanks[]` for `fill_in_blank`, `dropdowns[]` for the cloze rows) are captured per row in `reopen-evidence.jsonl`.

### Census → live-disk reconciliation (no divergence)

For all 35 rows the mechanical terminal-sentence extraction in `audit/terminal-sentence-semantic-census-2026-07-21/quarantine/adjudication.jsonl` is present **verbatim** on live disk (`terminalSentence{En,Zh}` occurs exactly once in the live `stem`). The `topLevelQuestionId`/`embeddedQuestionId` also match the manifest for every row. **No row shows a mechanical-extraction ↔ disk divergence** — the flagged stem spans are byte-stable at HEAD relative to the 2026-07-21 census. The authorized 50-ID snapshot removal (per the snapshot addendum) did not perturb any of these 35 spans.

### Checker-quote provenance (`quoteProvenance`, per language)

Comparing the **rejected checker** (`.../gpt-5-6-sol-recommission/checker-adjudication.jsonl`) `quotedEvidence` at `stem.en`/`stem.zh` against live disk:

- **EN: 35/35 VERBATIM.**
- **ZH: 33 VERBATIM, 1 RECONSTRUCTED, 1 no `stem.zh` quote (queue 147).**
- The single reconstructed zh quote is **queue 2413** — exactly the row §4 identified. Live zh = `…经典SIRS标准（一个在NCLEX-RN中仍会考核的基础性感染反应框架）…`; checker zh = `NCLEX-RN 考试中仍会考查的基础感染反应框架` (differs in ≥4 places).

**Measured residual:** the §4 "1-in-4" zh-defect rate was 2413 being that one row. Across all 35 rows the rejected-checker zh quotes reconstruct at 1/34 (~3%), **not higher** than the four-row sample implied. The anchor discipline of §4 still stands — checker quotes are never mutation anchors — but the corpus-wide unreliability is bounded, and every anchor a future mutation needs is available verbatim from live disk (below).

---

## R2 — `OP-B` vs `OP-C` for every G2 `dropdown_cloze` row (decision, not recommendation)

**Result: 11 `OP-B`, 3 `OP-C`.**

The literal §7B/G2 test ("remove the flagged terminal *sentence*; non-empty remainder in both languages?") is **insufficient on its own** for the whole-stem-duplicate rows. On 1103 and 1108 the entire `stem` is byte-identical to `clozeStem` (all sentences duplicated, `{{…}}` tokens included). The census terminal *sentence* is only the last sentence, so removing it leaves a non-empty remainder — but that remainder is itself still a full `clozeStem` duplicate carrying live placeholders. The literal test returns `OP-B`; the honest answer, per §7B/G2's own words ("the whole stem is the leak → `OP-C`"), is `OP-C`.

**Decision rule applied:** `OP-C` if (`stem` == `clozeStem` in either language) **or** (removing the terminal span empties either language); otherwise `OP-B`. Both the literal and corrected results are recorded per row in the evidence file (`R2_literal_decision`, `R2_decision`, `R2_divergesFromLiteral`, `stem_equals_cloze_{en,zh}`).

| Queue | ID | §7 hyp | literal R2 | stem==cloze | **R2 DECISION** | vs hyp |
|---|---|---|---|---|---|---|
| 888 | gap_50_mc_01 | OP-B? | OP-B | no | **OP-B** | confirms |
| 890 | gap_50_mc_03 | OP-C? | OP-B | no | **OP-B** | **RECLASSIFIES → mechanical** |
| 892 | gap_50_mc_05 | OP-C? | OP-B | no | **OP-B** | **RECLASSIFIES → mechanical** |
| 902 | gap_50_bcc_02 | OP-B? | OP-B | no | **OP-B** | confirms |
| 904 | gap_50_bcc_04 | OP-B? | OP-B | no | **OP-B** | confirms |
| 905 | gap_50_bcc_05 | OP-B? | OP-B | no | **OP-B** | confirms |
| 920 | gap_50_sic_07 | OP-B? | OP-B | no | **OP-B** | confirms |
| 921 | gap_50_sic_08 | OP-C? | OP-B | no | **OP-B** | **RECLASSIFIES → mechanical** |
| 922 | gap_50_sic_09 | OP-B? | OP-C | no | **OP-C** | **RECLASSIFIES → owner-gated** |
| 931 | gap_50_ppt_06 | OP-C? | OP-B | no | **OP-B** | **RECLASSIFIES → mechanical** |
| 932 | gap_50_ppt_07 | OP-B? | OP-B | no | **OP-B** | confirms |
| 933 | gap_50_ppt_08 | OP-B? | OP-B | no | **OP-B** | confirms |
| 1103 | gemini_hpm_ngn_2026_06_22_q3 | OP-C? | OP-B | **yes** | **OP-C** | confirms (via whole-dup, not literal) |
| 1108 | gemini_hpm_ngn_2026_06_22_q8 | OP-C? | OP-B | **yes** | **OP-C** | confirms (via whole-dup, not literal) |

**Five rows move off the §7 hypothesis:**
- **890, 892, 921, 931 — de-escalated `OP-C?` → `OP-B`.** Each has a distinct preceding clinical scenario sentence that is *not* present in `clozeStem` (e.g. 931 carries the full morphine-waste dosing scenario; 921 the brachytherapy scenario). Deleting the duplicated terminal instruction leaves that scenario intact and non-empty in both languages. These are mechanical, gated only on the non-empty proof plus the G2 preconditions (§7B/G2 items 1–4).
- **922 — escalated `OP-B?` → `OP-C`.** The stem is a single instruction sentence (`After administering an intramuscular injection, the nurse should immediately {{1}} and dispose … without {{2}}.`) that duplicates `clozeStem`; there is no separable clinical scenario, so removal empties the field. Requires owner-ratified replacement text.

**1103 / 1108 warning for the mutation phase:** because `stem` == `clozeStem` exactly, an `OP-C` replacement must author *new* clinical-setup text, not merely trim — and G2 precondition 2 (`clozeStem` byte-identical before/after) must hold, so the replacement lands only in `stem`.

**Net for the owner-ratification packet:** G2 collapses from "6 owner-gated / 8 mechanical (provisional)" to **3 owner-gated (`OP-C`: 922, 1103, 1108) / 11 mechanical (`OP-B`)**.

---

## R3 — Corpus-wide `fill_in_blank` items with `{{…}}` in `stem`

Scanned all **13** `*-canonical.json` banks (including embedded case questions): **214** `fill_in_blank` items total; **exactly 2** carry `{{…}}` in `stem`:

- `gpt_gap_jun11_fib_scabies_precautions_03` (queue 1486)
- `gpt_gap_jun11_fib_lung_cancer_screening_03` (queue 1492)

Both are the manifest G3 rows. **No off-manifest recurrence.** This sizes the F1/F2 fork in §7B/G3: the affected population is exactly two items, so **F1 (content-side rewrite) has a two-row blast radius** and there is no corpus-wide inline-binding population that would force F2. No §9 litigation input arises from R3.

(Both rows' `blanks[]` are captured in the evidence file. Each blank already carries a self-contained `prompt` pair and `acceptable`/`numeric` bindings, so `blanks[].prompt` can carry the response demand under F1 without schema change.)

---

## R4 — §3.4 confirmed: generic `stem` render is NOT item-type gated

Read the enclosing component in `src/App.tsx`:

- The generic `stem` block lives in `answerBody` (a `<div className="stem-row">` rendering `<BilingualText pair={question.stem} … />` and `<SpeakButton text={question.stem.en} …/>`), defined inside function **`QuestionCard`**.
- `answerBody` is wrapped as `trackedAnswerBody` and rendered in **both** branches of `QuestionCard`'s return: the standalone-visual-split layout (`<div className="standalone-work-pane">{trackedAnswerBody}</div>`) and the default layout (`<>… {trackedAnswerBody}</>`).
- **No item-type condition gates the stem block.** The only item-type branching in `QuestionCard`'s render is a `case_study && split` CSS class name and the standalone-visual-split layout selection — neither suppresses the stem. The `dropdown_cloze` body (`clozeStem`) is rendered separately inside `QuestionAnswerControl`.

**Conclusion:** a `dropdown_cloze` item presents **both** `stem` and `clozeStem` to the learner. The G2 duplication/leak premise holds. §3.4 is confirmed from the enclosing component, closing residual #3.

---

## R5 — Anchor re-derivation and uniqueness (all 35 rows)

**No anchor failures.** For every row the flagged span (as it appears on live disk) occurs **exactly once** in its `stem` field. Architect-verified specifics:

- **Queue 57 (`OP-A`):** the substring `indicates D correct latch` occurs once in `stem.en`; `question.correct` is **not** `["D"]` (`correctIsD:false`) — the §7A telegraphing precondition holds.
- **Queue 147 (`OP-C`):** the flagged span is the entire `stem` field in both languages (`wholeField_en`/`wholeField_zh` true) — deletion impossible, replacement required, consistent with the §7A reclassification.
- **Queue 2413 (`OP-B`, boundary):** both boundary anchors occur once in `stem.en` — B1 `(a foundational infection-response framework still tested on the NCLEX-RN)` and the B2 drop-clause `still tested on the NCLEX-RN`. **The zh anchor must be taken from live disk** (`…（一个在NCLEX-RN中仍会考核的基础性感染反应框架）…`); the checker zh quote is reconstructed and must never anchor a mutation.

Full 35-row anchor + provenance table:

| Q | id | itemType | census→disk | EN anchor occ | ZH anchor occ | chkEN | chkZH |
|---|---|---|---|---|---|---|---|
| 57 | claude_a_mc_breastfeeding_latch_47 | multiple_choice | match | 1 | 1 | VERBATIM | VERBATIM |
| 147 | opus_case_lithium_toxicity_01 | case_study | match | 1 | 1 | VERBATIM | none |
| 162 | claude_moc_deleg_matrix_08 | matrix | match | 1 | 1 | VERBATIM | VERBATIM |
| 226 | gemini_jun05_a_mc_lithium_toxicity_36 | multiple_choice | match | 1 | 1 | VERBATIM | VERBATIM |
| 656 | gemini_d9_02 | select_all | match | 1 | 1 | VERBATIM | VERBATIM |
| 702 | trad_batchB_14 | multiple_choice | match | 1 | 1 | VERBATIM | VERBATIM |
| 735 | trad_batchC_25 | multiple_choice | match | 1 | 1 | VERBATIM | VERBATIM |
| 799 | gen_rrp_batch2_02 | select_all | match | 1 | 1 | VERBATIM | VERBATIM |
| 888 | gap_50_mc_01 | dropdown_cloze | match | 1 | 1 | VERBATIM | VERBATIM |
| 890 | gap_50_mc_03 | dropdown_cloze | match | 1 | 1 | VERBATIM | VERBATIM |
| 892 | gap_50_mc_05 | dropdown_cloze | match | 1 | 1 | VERBATIM | VERBATIM |
| 902 | gap_50_bcc_02 | dropdown_cloze | match | 1 | 1 | VERBATIM | VERBATIM |
| 904 | gap_50_bcc_04 | dropdown_cloze | match | 1 | 1 | VERBATIM | VERBATIM |
| 905 | gap_50_bcc_05 | dropdown_cloze | match | 1 | 1 | VERBATIM | VERBATIM |
| 920 | gap_50_sic_07 | dropdown_cloze | match | 1 | 1 | VERBATIM | VERBATIM |
| 921 | gap_50_sic_08 | dropdown_cloze | match | 1 | 1 | VERBATIM | VERBATIM |
| 922 | gap_50_sic_09 | dropdown_cloze | match | 1 | 1 | VERBATIM | VERBATIM |
| 931 | gap_50_ppt_06 | dropdown_cloze | match | 1 | 1 | VERBATIM | VERBATIM |
| 932 | gap_50_ppt_07 | dropdown_cloze | match | 1 | 1 | VERBATIM | VERBATIM |
| 933 | gap_50_ppt_08 | dropdown_cloze | match | 1 | 1 | VERBATIM | VERBATIM |
| 1103 | gemini_hpm_ngn_2026_06_22_q3 | dropdown_cloze | match | 1 | 1 | VERBATIM | VERBATIM |
| 1108 | gemini_hpm_ngn_2026_06_22_q8 | dropdown_cloze | match | 1 | 1 | VERBATIM | VERBATIM |
| 1486 | gpt_gap_jun11_fib_scabies_precautions_03 | fill_in_blank | match | 1 | 1 | VERBATIM | VERBATIM |
| 1492 | gpt_gap_jun11_fib_lung_cancer_screening_03 | fill_in_blank | match | 1 | 1 | VERBATIM | VERBATIM |
| 1731 | gpt_case_clozapine_toxicity_01_q5 | ordered_response | match | 1 | 1 | VERBATIM | VERBATIM |
| 2123 | gpt_balance6a_2026_07_16_mx_discharge_planning_handoff_09 | matrix | match | 1 | 1 | VERBATIM | VERBATIM |
| 2176 | gpt_format10b_free_water_deficit | fill_in_blank | match | 1 | 1 | VERBATIM | VERBATIM |
| 2178 | gpt_format10b_rapid_shallow_breathing_index | fill_in_blank | match | 1 | 1 | VERBATIM | VERBATIM |
| 2185 | gpt_format8a_haloperidol_qtcf | fill_in_blank | match | 1 | 1 | VERBATIM | VERBATIM |
| 2190 | gpt_format8a_pf_ratio | fill_in_blank | match | 1 | 1 | VERBATIM | VERBATIM |
| 2219 | gpt_format9c_pn_peripheral_central_access | dropdown_cloze | match | 1 | 1 | VERBATIM | VERBATIM |
| 2228 | gpt_format11b_retinal_detachment_emergency_cues | highlight | match | 1 | 1 | VERBATIM | VERBATIM |
| 2231 | gpt_format11b_pediatric_oxygenation_index | fill_in_blank | match | 1 | 1 | VERBATIM | VERBATIM |
| 2238 | gpt_format11c_water_deprivation_desmopressin_interpretation | dropdown_cloze | match | 1 | 1 | VERBATIM | VERBATIM |
| 2413 | cs_sepsis_shock_01_part_1 | matrix | match | 1 | 1 | VERBATIM | RECONSTRUCTED |

`census→disk = match` means the mechanical census terminal span is present verbatim (occ ≥ 1) in the live stem. `EN/ZH anchor occ = 1` means the flagged span is unique in the stem field (safe single-shot anchor). `chkEN`/`chkZH` = rejected-checker quote provenance (`none` = checker did not quote that field).

Anchor discipline reminder for the mutation phase: even though every anchor is unique in the `stem` field today, §4 rule 1 still applies — re-read each `oldText` from live disk immediately before its operation, since any prior row's edit can shift offsets (line numbers, never text, drift).

---

## G-group live-disk confirmations (supporting R1)

- **G1 (226, 656, 702, 799):** all zh defects confirmed live. 226 `地高辛锂中毒` (digoxin erroneously inserted before "lithium toxicity"; en clean → clinical-terminology correction w/ sign-off). 656 `（择所有适用项。）` and 799 `（择所有适用项）` — both missing the leading `选` (malformed SATA instruction). 702 `艰难克罗替尼` (should be `艰难梭菌` for *C. difficile*).
- **G4/G5 construct-defense (162, 735, 1731, 2123, 2176, 2178, 2185, 2190, 2219, 2228, 2231, 2238):** every flagged self-referential/scope-defense terminal sentence is present live and `wholeField=false` (a non-empty stem survives its removal), so bare deletion is schema-safe — but per §7B/G4 the operation is relocate/renaturalize (owner-gated), not delete.
- **735:** confirmed the internal bilingual construct inconsistency — zh stem uses `《健康中国 2030》（此处对应美国 Healthy People 2030）` where en reads `Healthy People 2030`; `OP-G` full-item review still required.

---

## LIT-3 (§9) — RESOLVED: no off-manifest recurrence of the 656/799 signature

Scanned all 13 banks for the malformed SATA token `择所有适用项` **not** immediately preceded by `选`. **Exactly 2 occurrences, both on-manifest (656, 799).** The defect does not recur outside the manifest. LIT-3 requires no owner litigation.

(LIT-1 and LIT-2 are unchanged by this commission; both were architect-verified and are recorded in the work order. This seat did not read `caseStudy.summary` beyond confirming LIT-1's line references remain the architect's finding — it is out of the read-only R1–R5 scope and was not re-adjudicated.)

---

## Residuals (unchanged in substance; two narrowed)

1. **Corpus remains uncleared.** These 35 rows are the accepted subset of a rejected census; deciding their classes clears nothing corpus-wide. No downstream artifact may state otherwise.
2. **Checker zh unreliability is bounded, not eliminated** — measured at 1/34 across the manifest (2413 only), but §4's "never anchor on checker quotes" rule stands; live disk is the sole authority.
3. **Narrowed:** residual #3 (§3.4 inferred from two render sites) is **closed** by R4 — the generic stem render is confirmed ungated from the enclosing component.
4. **Narrowed:** the `OP-B`/`OP-C` split is now decided (11/3) rather than hypothesized, with five rows moved off the §7 provisional split and one row (922) escalated to owner ratification.
5. **This is evidence, not authorization.** No bank/src/scripts file was modified; nothing was committed or pushed. The result returns to the architect seat for the owner-ratification packet.
