# Campaign 16 Phase C — Revision 5 report

Terminal producer status: **READY FOR INDEPENDENT CLAUDE CHECK**. The Phase C terminal token is issued only after the independent exit gate passes.

## Authority and method

- Frozen Revision-5 work-order raw file-byte SHA-256: `74fb97e70ca5820a4e95acc62e2b0f3f54790d0eea766d2be58e8a427f924248` — exact match at launch and producer closeout.
- Phase B state: uncommitted working-tree publication bytes on branch `main`, HEAD `3286024bcab90c1a114811a7202d956c3e586bf4`, upstream `origin/main`, ahead/behind `0	0`.
- The frozen-spec clean-bank precondition was explicitly inverted under Revision-5 §3.1: the dirty GPT bank was expected, and identity was governed by bytes.
- All bank reads used working-tree filesystem bytes, never `git show HEAD:<bank>`. The corrected §4.3 presence/absence proof used a Node `JSON.parse` walk over the working-tree GPT bank.
- Payload convention: `sha256(stableJson(q, 0)); recursively sorted object keys; compact JSON.stringify; trailing newline`.
- Schema adaptation: every population row retains null companion fields and null `pairingRule`, plus `unpairedReason: "NO_ELIGIBLE_SIBLING_CASE"`; no fictitious companion or pairing rule was introduced.
- Semantic lane: 19 isolated GPT-5.6 Sol/high contexts, two sequential turns in each context, 38 sealed turns total. No candidate batching or cross-candidate semantic context was used.

## Bank identity gate

| Bank | Expected raw-byte SHA-256 | Observed raw-byte SHA-256 | Result |
|---|---|---|---|
| banks/burn-canonical.json | `5244b8d37daa49adbd1fbed7991f4ede52ded8ce710e26821841ef5e2ce3719f` | `5244b8d37daa49adbd1fbed7991f4ede52ded8ce710e26821841ef5e2ce3719f` | MATCH |
| banks/capnography-canonical.json | `36d72a89405fe4400f27b3b8969cdbe1c51f3217151f8b2592b7f877d636f20c` | `36d72a89405fe4400f27b3b8969cdbe1c51f3217151f8b2592b7f877d636f20c` | MATCH |
| banks/claude-canonical.json | `25f53ded1ac21da4ca9d211040c3f6110ebee38d72ba41d0fc64fe358ba73b71` | `25f53ded1ac21da4ca9d211040c3f6110ebee38d72ba41d0fc64fe358ba73b71` | MATCH |
| banks/device-canonical.json | `83d5a6ac7219524f4c528265291cbee2ed5b2f17c13fbeb3649342bae2e4aac5` | `83d5a6ac7219524f4c528265291cbee2ed5b2f17c13fbeb3649342bae2e4aac5` | MATCH |
| banks/gemini-canonical.json | `3dc416a4652f5f5712219dde7de87b92f0697fac953750b8abb8fc0dbb976bb6` | `3dc416a4652f5f5712219dde7de87b92f0697fac953750b8abb8fc0dbb976bb6` | MATCH |
| banks/gpt-canonical.json | `e4955f7b8c54e4880bd9ddb0f2f7c35881169f53051b5ed3ce21757f86287b3b` | `e4955f7b8c54e4880bd9ddb0f2f7c35881169f53051b5ed3ce21757f86287b3b` | MATCH |
| banks/hard-cases-canonical.json | `8068c6917e53257a31c7299454c213f61bea62e61d7cf185cb1a09386f4e4862` | `8068c6917e53257a31c7299454c213f61bea62e61d7cf185cb1a09386f4e4862` | MATCH |
| banks/io-canonical.json | `2ce6488e65049ba00cd9dccf889a042e0a624f224387382d564d282e147b2645` | `2ce6488e65049ba00cd9dccf889a042e0a624f224387382d564d282e147b2645` | MATCH |
| banks/lab-canonical.json | `1038cb68f6b91f6a2c981562d97ad9e16179db9b1332c75725fd538595c44b05` | `1038cb68f6b91f6a2c981562d97ad9e16179db9b1332c75725fd538595c44b05` | MATCH |
| banks/mar-canonical.json | `f12c03a28ff5b52411843f84bc942b4ca5667e989194357ed2d60a394f17641e` | `f12c03a28ff5b52411843f84bc942b4ca5667e989194357ed2d60a394f17641e` | MATCH |
| banks/medlabel-canonical.json | `cc3bd0053516fc7ea4b23e814e46f186e6d2dbf40888fa713a862c07ea2b3993` | `cc3bd0053516fc7ea4b23e814e46f186e6d2dbf40888fa713a862c07ea2b3993` | MATCH |
| banks/visual-canonical.json | `e42e2a3fa6aa349a61279e6988e250e65c2b752a6f36d33806a2671e0af0f9e4` | `e42e2a3fa6aa349a61279e6988e250e65c2b752a6f36d33806a2671e0af0f9e4` | MATCH |
| banks/vitals-canonical.json | `5154e25492bced8e4a49d763f04e25e154389c31e085bf37669651e13d411b9d` | `5154e25492bced8e4a49d763f04e25e154389c31e085bf37669651e13d411b9d` | MATCH |

The GPT expected value came from the literal Revision-5 §3.2 identity `e4955f7b8c54e4880bd9ddb0f2f7c35881169f53051b5ed3ce21757f86287b3b`, corroborated by `audit/campaign-16-phase-b-recovery-2026-08-27/status-stage-3.log` lines 117 and 145. The other 12 expected hashes came from `audit/campaign-16-phase-a-baseline-2026-08-26/baseline.json` → `campaignBaselineFileByteSha256`. Result: **13/13 MATCH**.

## Population and deterministic gates

- Live `_bowtie` suffix roster: **50**.
- Paired complement: **31** = 30 `EXACT` + 1 `ORDINAL_SUFFIX`.
- Phase C unpaired population: **19** `NO_ELIGIBLE_SIBLING_CASE` rows.
- Delta against Phase A: additions **0**, removals **0**; both ID lists are empty.
- Structural precondition: **19/19 PASS** at 3/4/4 tokens and 1/2/2 canonical keys.
- Deterministic sibling-absence probe: **0 hits** across 145 live case-study IDs.
- Paired-disposition preservation: **31/31 MATCH**. This is the explicit warrant for the combined current 50-item disposition below.

### Corrected `_bt_` falsification

| ID | Live question.id count | Absent from live `_bowtie` suffix roster |
|---|---:|---|
| gpt_balance6a_2026_07_16_bt_perioperative_care_13_r2 | 1 | YES |
| gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14_r2 | 1 | YES |

The historical pre-repair IDs `gpt_balance6a_2026_07_16_bt_perioperative_care_13` and `gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14` each have live `question.id` count 0, as expected after Phase B's `_r2` minting.

### Unpaired payload preservation

| Candidate ID | Phase-A payload SHA-256 | Live payload SHA-256 | Result |
|---|---|---|---|
| gpt_2026_07_03_2114_t1_01_co_exposure_bowtie | `d52f20663ce537cee595d9e46dee04c69b4de4a78f63ab885679101f797b5bd3` | `d52f20663ce537cee595d9e46dee04c69b4de4a78f63ab885679101f797b5bd3` | MATCH |
| gpt_2026_07_03_2114_t2_01_cdiff_spores_bowtie | `156c37fb872d72e4dcc1c03422222699e844d6c07c46c28c3a3646e612575949` | `156c37fb872d72e4dcc1c03422222699e844d6c07c46c28c3a3646e612575949` | MATCH |
| gpt_2026_07_03_2114_t2_02_imminent_suicide_bowtie | `db0f561af76d4e1cb5de422662fad579f58e81a0ef068d8d68500fa29668e4cb` | `db0f561af76d4e1cb5de422662fad579f58e81a0ef068d8d68500fa29668e4cb` | MATCH |
| gpt_format13_last_bowtie | `ab06ae7bf9bae8cf39c3ab315030d14b88c077c149343fe1c0b9f590262924fc` | `ab06ae7bf9bae8cf39c3ab315030d14b88c077c149343fe1c0b9f590262924fc` | MATCH |
| gpt_format13_mh_bowtie | `b84e2dfc09ca8a6b46501e792bae2261fab64c1f46ffabc559a1ba0aa126bccb` | `b84e2dfc09ca8a6b46501e792bae2261fab64c1f46ffabc559a1ba0aa126bccb` | MATCH |
| gpt_format13_pd_peritonitis_bowtie | `1917fc5c2d0bf9e47dc370fe0c3e761f68ac155fde9c4ae290b87096e46a6095` | `1917fc5c2d0bf9e47dc370fe0c3e761f68ac155fde9c4ae290b87096e46a6095` | MATCH |
| gpt_format14_hcm_bowtie | `b88ed0482d9d7f6d8d39b143b457657ad9243bc138f2b9e7d4622c2dfa07d75f` | `b88ed0482d9d7f6d8d39b143b457657ad9243bc138f2b9e7d4622c2dfa07d75f` | MATCH |
| gpt_format15_acquired_methemoglobinemia_bowtie | `48f90bfa36cb3f7e0b65f637a8ae9de80c35257eac4f812b3373018d4a727777` | `48f90bfa36cb3f7e0b65f637a8ae9de80c35257eac4f812b3373018d4a727777` | MATCH |
| gpt_format15_cardiac_tamponade_bowtie | `14b942965319b128382b879025356dbac3d13561d392c5ece80ef5e21244fb14` | `14b942965319b128382b879025356dbac3d13561d392c5ece80ef5e21244fb14` | MATCH |
| gpt_format15_ect_prolonged_seizure_bowtie | `c0d8638519d80fc1b6bd8a23ae0ec2a5cd5ec094611d15c83d26632f9306367a` | `c0d8638519d80fc1b6bd8a23ae0ec2a5cd5ec094611d15c83d26632f9306367a` | MATCH |
| gpt_format15_meningococcemia_bowtie | `6ecd999b61f1b17d953b1e54820b3047afabd1e88392e09fb4e8d4163e65cd2b` | `6ecd999b61f1b17d953b1e54820b3047afabd1e88392e09fb4e8d4163e65cd2b` | MATCH |
| gpt_format15_palliative_malignant_bowel_obstruction_bowtie | `238dd73803862f44c357109bde8cced485f0479c27667466b24b5e9c336e036d` | `238dd73803862f44c357109bde8cced485f0479c27667466b24b5e9c336e036d` | MATCH |
| gpt_format15_severe_asthma_bowtie | `b5000b34fcdead37f242f2294f6c95246011d7635b757bb03e0c0618c627159d` | `b5000b34fcdead37f242f2294f6c95246011d7635b757bb03e0c0618c627159d` | MATCH |
| gpt_format15_sickle_acute_chest_bowtie | `124a53eb198eb035ac98b83ef256ad7e2bd8c72424af90e8a783f951229af698` | `124a53eb198eb035ac98b83ef256ad7e2bd8c72424af90e8a783f951229af698` | MATCH |
| gpt_format15_splenic_sequestration_bowtie | `cad98e7f2d181e8141bee5db89a7142dc8f2ddfbb09f6937ee53312b44779423` | `cad98e7f2d181e8141bee5db89a7142dc8f2ddfbb09f6937ee53312b44779423` | MATCH |
| gpt_format15_transfusion_anaphylaxis_bowtie | `1157de9021406a663da1d8649f6654de20f4e6322fa73f7c8ad4354a46a6188b` | `1157de9021406a663da1d8649f6654de20f4e6322fa73f7c8ad4354a46a6188b` | MATCH |
| gpt_format15_vasa_previa_bleeding_bowtie | `1f9dbd06dd65e1c2f010b94372f32d6a23420264b5651663d770ac55edd77920` | `1f9dbd06dd65e1c2f010b94372f32d6a23420264b5651663d770ac55edd77920` | MATCH |
| gpt_format7c_exercise_hypoglycemia_bowtie | `df41a515bafd2325afb0a63fa1b3050ae5d6c6165213af41314d8e3e8dc8ad81` | `df41a515bafd2325afb0a63fa1b3050ae5d6c6165213af41314d8e3e8dc8ad81` | MATCH |
| gpt_format7c_heart_failure_action_plan_bowtie | `20cdfd9a06862487c399ca4e36c2de9e76ebf1d16d5267721e47fb4df8db877f` | `20cdfd9a06862487c399ca4e36c2de9e76ebf1d16d5267721e47fb4df8db877f` | MATCH |

## Four-row pilot and scale-up

- Pilot (CAND-01…04): 4/4 completed; verdicts {"PASS_STANDALONE":4}.
- Scale-up (CAND-05…19): 15/15 completed; verdicts {"PASS_STANDALONE":14,"FAIL_UNSUPPORTED_TOKEN_PREMISE":1}.
- Frozen bank snapshot was rechecked 13/13 immediately before the first scale-up dispatch.

## Candidate dispositions

| Candidate ID | Companion | Pairing | Primary verdict | Secondary flags | Stage-1 alignment | Stage-2 exact match |
|---|---|---|---|---|---|---|
| gpt_2026_07_03_2114_t1_01_co_exposure_bowtie | null | null | PASS_STANDALONE | — | FULL | true |
| gpt_2026_07_03_2114_t2_01_cdiff_spores_bowtie | null | null | PASS_STANDALONE | — | PARTIAL | true |
| gpt_2026_07_03_2114_t2_02_imminent_suicide_bowtie | null | null | PASS_STANDALONE | — | FULL | true |
| gpt_format13_last_bowtie | null | null | PASS_STANDALONE | — | FULL | true |
| gpt_format13_mh_bowtie | null | null | PASS_STANDALONE | — | FULL | true |
| gpt_format13_pd_peritonitis_bowtie | null | null | PASS_STANDALONE | — | FULL | true |
| gpt_format14_hcm_bowtie | null | null | PASS_STANDALONE | — | FULL | true |
| gpt_format15_acquired_methemoglobinemia_bowtie | null | null | PASS_STANDALONE | — | PARTIAL | true |
| gpt_format15_cardiac_tamponade_bowtie | null | null | PASS_STANDALONE | — | PARTIAL | true |
| gpt_format15_ect_prolonged_seizure_bowtie | null | null | PASS_STANDALONE | — | FULL | true |
| gpt_format15_meningococcemia_bowtie | null | null | PASS_STANDALONE | — | PARTIAL | true |
| gpt_format15_palliative_malignant_bowel_obstruction_bowtie | null | null | PASS_STANDALONE | DISTRACTOR_PATIENT_FACT_INVENTION | PARTIAL | true |
| gpt_format15_severe_asthma_bowtie | null | null | PASS_STANDALONE | — | PARTIAL | true |
| gpt_format15_sickle_acute_chest_bowtie | null | null | PASS_STANDALONE | — | PARTIAL | true |
| gpt_format15_splenic_sequestration_bowtie | null | null | PASS_STANDALONE | — | FULL | true |
| gpt_format15_transfusion_anaphylaxis_bowtie | null | null | PASS_STANDALONE | — | FULL | true |
| gpt_format15_vasa_previa_bleeding_bowtie | null | null | PASS_STANDALONE | — | FULL | true |
| gpt_format7c_exercise_hypoglycemia_bowtie | null | null | FAIL_UNSUPPORTED_TOKEN_PREMISE | RATIONALE_ADDS_MISSING_FACT | PARTIAL | true |
| gpt_format7c_heart_failure_action_plan_bowtie | null | null | PASS_STANDALONE | — | FULL | true |

All 19 Stage-2 selections matched the canonical five-target set after order-insensitive opaque-label mapping. This selection agreement is diagnostic only; it did not substitute for the standalone support judgment. Stage-1 alignment separately records free-generation agreement before pools were visible.

## Verdict totals and combined current accounting

| Population | PASS | Hidden-case dependency | Unsupported token premise | Other verdicts | Total |
|---|---:|---:|---:|---:|---:|
| Unpaired Phase C | 18 | 0 | 1 | 0 | 19 |
| Preserved paired | 20 | 7 | 4 | 0 | 31 |
| Combined current `_bowtie` | 38 | 7 | 5 | 0 | 50 |

Unsupported-premise descriptive rates: **1/19 = 5.26%** for the unpaired population; **4/31 = 12.90%** for the preserved paired population. These are small denominators and descriptive only. No confidence interval, significance test, or generative-versus-harvest conclusion is authorized or asserted.

## Non-PASS defect

| Candidate ID | Affected token | Primary verdict | Exact defect | Provenance | Advisory |
|---|---|---|---|---|---|
| gpt_format7c_exercise_hypoglycemia_bowtie | A3 | FAIL_UNSUPPORTED_TOKEN_PREMISE | The keyed action presupposes an existing client-specific hypoglycemia treatment plan and access to rapid carbohydrate; the stem establishes neither. | RATIONALE_ONLY | P1 |

The rationale and test-taking strategy introduce the missing “existing plan” premise. Under the frozen instrument, provenance cannot rescue a standalone omission.

## Bounded provenance

| Candidate ID | Token | Missing fact | Classification | Necessary for rankability | Checked surfaces |
|---|---|---|---|---|---|
| gpt_2026_07_03_2114_t1_01_co_exposure_bowtie | C2 | Opioid exposure with findings such as respiratory depression and miosis | UNSUPPORTED_ANYWHERE_CHECKED | NO | candidate stem (English and Chinese); candidate rationale.correct (English and Chinese); candidate rationale.byChoice (English and Chinese); candidate testTakingStrategy (English and Chinese); candidate glossary; explicitly linked historical sources (none recorded) |
| gpt_format13_mh_bowtie | A2 | Evidence of infection or sepsis requiring cultures and empiric antibiotics as the primary response | UNSUPPORTED_ANYWHERE_CHECKED | NO | candidate stem (English and Chinese); candidate rationale.correct (English and Chinese); candidate rationale.byChoice (English and Chinese); candidate testTakingStrategy (English and Chinese); candidate glossary; explicitly linked historical sources (none recorded) |
| gpt_format13_mh_bowtie | C2 | Hypotension, bronchospasm, urticaria, angioedema, or another acute hypersensitivity manifestation | UNSUPPORTED_ANYWHERE_CHECKED | NO | candidate stem (English and Chinese); candidate rationale.correct (English and Chinese); candidate rationale.byChoice (English and Chinese); candidate testTakingStrategy (English and Chinese); candidate glossary; explicitly linked historical sources (none recorded) |
| gpt_format13_mh_bowtie | C3 | Known thyrotoxicosis or compatible thyroid history and supporting manifestations such as goiter, tremor, gastrointestinal symptoms, or preoperative hyperthyroid findings | UNSUPPORTED_ANYWHERE_CHECKED | NO | candidate stem (English and Chinese); candidate rationale.correct (English and Chinese); candidate rationale.byChoice (English and Chinese); candidate testTakingStrategy (English and Chinese); candidate glossary; explicitly linked historical sources (none recorded) |
| gpt_format13_mh_bowtie | P2 | A suspected perioperative anaphylactic reaction for which serum tryptase would provide diagnostic support | UNSUPPORTED_ANYWHERE_CHECKED | NO | candidate stem (English and Chinese); candidate rationale.correct (English and Chinese); candidate rationale.byChoice (English and Chinese); candidate testTakingStrategy (English and Chinese); candidate glossary; explicitly linked historical sources (none recorded) |
| gpt_format13_mh_bowtie | P3 | Suspected bacteremia, sepsis, or another infectious process warranting blood cultures | UNSUPPORTED_ANYWHERE_CHECKED | NO | candidate stem (English and Chinese); candidate rationale.correct (English and Chinese); candidate rationale.byChoice (English and Chinese); candidate testTakingStrategy (English and Chinese); candidate glossary; explicitly linked historical sources (none recorded) |
| gpt_format13_pd_peritonitis_bowtie | C1 | Constipation, reduced drain volume, or catheter outflow dysfunction | UNSUPPORTED_ANYWHERE_CHECKED | NO | candidate stem (English and Chinese); candidate rationale.correct (English and Chinese); candidate rationale.byChoice (English and Chinese); candidate testTakingStrategy (English and Chinese); candidate glossary; explicitly linked historical sources (none recorded) |
| gpt_format13_pd_peritonitis_bowtie | C2 | Exit-site erythema, tenderness, swelling, or purulent drainage | UNSUPPORTED_ANYWHERE_CHECKED | NO | candidate stem (English and Chinese); candidate rationale.correct (English and Chinese); candidate rationale.byChoice (English and Chinese); candidate testTakingStrategy (English and Chinese); candidate glossary; explicitly linked historical sources (none recorded) |
| gpt_format14_hcm_bowtie | P4 | No ionized calcium result, major albumin abnormality, acid-base concern, or other need for separate ionized-calcium tracking is provided. | UNSUPPORTED_ANYWHERE_CHECKED | NO | candidate stem (English and Chinese); candidate rationale.correct (English and Chinese); candidate rationale.byChoice (English and Chinese); candidate testTakingStrategy (English and Chinese); candidate glossary; explicitly linked historical sources (none recorded) |
| gpt_format15_palliative_malignant_bowel_obstruction_bowtie | A4 | No octreotide order, hyoscine trial history, or requirement to administer octreotide immediately before hyoscine is provided. | UNSUPPORTED_ANYWHERE_CHECKED | NO | candidate stem (English and Chinese); candidate rationale.correct (English and Chinese); candidate rationale.byChoice (English and Chinese); candidate testTakingStrategy (English and Chinese); candidate glossary; explicitly linked historical sources (none recorded) |
| gpt_format7c_exercise_hypoglycemia_bowtie | A3 | Confirmation that the client already has an established hypoglycemia plan and access to rapid carbohydrate. | RATIONALE_ONLY | YES | candidate stem (English and Chinese); candidate rationale.correct (English and Chinese); candidate rationale.byChoice (English and Chinese); candidate testTakingStrategy (English and Chinese); candidate glossary; explicitly linked historical sources (none recorded) |

No corpus-wide search or sibling substitution was performed. `FAIL_HIDDEN_CASE_DEPENDENCY` and `SIBLING_CASE_IMPORTED` remained unreachable, consistent with the zero-hit structural probe.

## Collateral and advisory routing

- Bilingual, clinical-currency, and nursing-scope collateral: no concrete concern recorded in the narrow §13 pass.
- `gpt_format15_palliative_malignant_bowel_obstruction_bowtie` remains PASS with `DISTRACTOR_PATIENT_FACT_INVENTION` / P2: non-keyed A4 presupposes an unestablished octreotide order and sequence but remains clearly rejectable.
- The single P1 finding and the P2 distractor finding route to Phase D for owner/architect prioritization. No repair was performed.

## Historical calibration

**NOT RERUN — OWNER DECISION F1.** The inherited semantic instrument already demonstrated sensitivity on that exact historical control; the Phase C novelty was the null-companion harness and bounded provenance adaptation, neither exercised by the paired historical control.

## Preservation statement

No canonical bank, answer key, ledger status, schema, runtime, `DECISIONS.md`, `PROJECT-HISTORY.md`, census artifact, or unrelated dirty path was changed by this commission. The complete failed Revision-4 tree remained byte-identical. Detailed proof is in `closeout-preservation.json` and `verification.md`.
