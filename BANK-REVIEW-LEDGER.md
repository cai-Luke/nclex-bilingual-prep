# Bank Review Ledger

This ledger tracks which generated question banks are safe to treat as reviewed testing material. Keep this separate from `PROJECT-HISTORY.md`: history is narrative; this file is the operational checklist.

## Status Values

- `unreviewed`: Generated or imported, but not checked beyond existence.
- `schema-valid`: Passes `npm run validate-bank -- <file>`, but content has not been reviewed.
- `content-reviewed`: Content review completed; may still need edits or validation.
- `fixed-and-validated`: Review issues were fixed and the bank passes validation after fixes.
- `needs-human-clinical-review`: An item or bank has unresolved clinical/protocol ambiguity that should be checked by a qualified nurse educator or clinician before testing use.
- `rejected`: Do not use as testing material.

## Workflow

1. Generate each model batch as a raw/review candidate, preferably under `banks-raw/` or another non-bundled holding location, using a source/date/batch naming convention such as `gemini-2026-06-05-b.json`.
2. Run schema validation before content review:
   - `npm run validate-bank -- <candidate-file>.json`
3. Content-review the bank for:
   - unsafe or outdated clinical claims
   - ambiguous stems or multiple plausible keyed answers
   - contraindicated actions placed into ordered-response sequences
   - dosage-calculation errors
   - bilingual mismatches or confusing Chinese translations
   - overly absolute wording where modern protocol is conditional
4. Treat raw model output in `banks-raw/` as temporary staging. Apply fixes only to the reviewed/promoted copy or during canonical-bank consolidation, not to the raw file.
5. Re-run validation after edits.
6. Merge or promote only reviewed, valid questions into top-level `banks/*.json`; those are the files bundled into the app.
7. After merge and successful validation, delete the raw/staging source file unless there is an explicit reason to retain it.
8. Update this ledger before treating the bank as reviewed, including the deleted source filename in Merged Source Batches.

## Generation Policy

Prefer new JSON files for every Gemini batch. Do not ask Gemini to append directly to canonical bundled banks.

Gemini should be treated as a fast raw-draft generator, not a trusted canonical editor. Recent hard-case output required cleanup for placeholder distractors, generic per-choice rationales, broad/wrong topic labels, and loose adherence to canonical shape. Use the tightened generation prompt, keep batches small, stage raw output in `banks-raw/`, require cross-model review before promotion, then delete the raw file after the accepted content is merged and validated.

Reasons:

- Easier review tracking: each batch can move from `unreviewed` to `fixed-and-validated`.
- Safer rollback: a flawed batch can be rejected without untangling mixed edits.
- Cleaner coverage planning: batch prompts can target specific gaps from `npm run coverage-report`.
- Fewer merge mistakes: reviewed banks can be bundled or merged only after validation.
- Lower model-risk: Gemini-specific filler or schema drift is caught before it reaches the learner.

Appending is acceptable only after a batch is already reviewed and validated, and only as a deliberate consolidation step.

Canonical source banks use the `<model>-canonical.json` naming pattern:

- `banks/gpt-canonical.json`
- `banks/claude-canonical.json`
- `banks/gemini-canonical.json`
- `banks/hard-cases-canonical.json`
- `banks/visual-canonical.json` (dedicated home for visual-bearing items; formerly `banks/rhythm-canonical.json`)

Future Gemini output should arrive as a separate raw/review batch file, for example `banks-raw/gemini-2026-06-05-b.json`. After review and validation, the accepted questions can be deliberately consolidated into `banks/gemini-canonical.json`.

Only top-level `banks/*.json` files are bundled by the app. `banks/Pending cases/` is a holding/rejected/archive area, not a bundled source.

## Reviewed Banks

| Bank file | Source | Questions | Schema validation | Content review | Visual audit | Status | Notes |
|---|---:|---:|---|---|---|---|---|
| `banks/claude-canonical.json` | Claude | 50 | 2026-06-06: valid after gap-fill merge | 2026-06-05 pre-ledger audit + 2026-06-05 redundancy prune + 2026-06-06 gap-fill merge | N/A (no visual items) | `fixed-and-validated` | Earlier audit removed flawed enteral nutrition ordered-response item and left a 36-question baseline. The file later contained 49 valid questions; on 2026-06-05, removed 4 Claude questions that overlapped highly with GPT canonical items: `claude_a_mc_advance_directive_31`, `claude_a_or_cord_prolapse_44`, `claude_a_sata_clabsi_prevention_22`, and `claude_a_cloze_pulmonary_embolism_07`. Metadata count corrected to 45. On 2026-06-06, merged 5 reviewed gap-fill questions from `banks/banks-raw/claude-2026-06-05-gapfill-moc-pharm.json` (45→50); see Merged Source Batches. |
| `banks/gemini-canonical.json` | Gemini | 749 | 2026-06-06: valid after gap-fill consolidation | 2026-06-05 + 2026-06-06 easy-batch review + prior reviewed gap-fill consolidation | N/A (no visual items) | `fixed-and-validated` | Originally promoted from `banks/gemini-jun05-a.json` (58 q). On 2026-06-05, merged 100 q from `gemini-pending.json` (5 fixes), 30 q from `gemini-jun05-b.json` (user-reviewed), 100 q from `gemini-pending-b.json` (2 fixes), 100 q from `gemini-pending-c.json` (1 fix), 100 q from `gemini-pending-d.json` (10 fixes), and 100 q from traditional batches A-D. On 2026-06-05, performed a redundancy audit and pruned 18 redundant/flawed questions in total (2 from initial audit, 16 from second audit, including a transfusion reaction sequencing correction). On 2026-06-05, merged 79 reviewed gap-fill questions (570→649) targeting the five lowest-covered categories (BCC, SIC, RRP, HPM, PSI); see Merged Source Batches. Bumped `meta.schemaVersion` 1.0→1.1 to admit two `case_study` survivors. On 2026-06-06, merged 50 reviewed easy-tier questions (649→699) to build out the under-served easy difficulty band (easy items 35→85); see Merged Source Batches. On 2026-06-06, consolidated the 50 `gap_50_*` questions from the former standalone `banks/gap-fill-50.json` (699→749) to reduce bundled banks to the LLM-named set; these were Antigravity-sourced gap-fill items now folded under the Gemini bank for organizational simplicity. On 2026-06-06, re-contextualized two redundant THA short case studies to Open Cholecystectomy and Total Knee Arthroplasty to improve scenario diversity. |
| `banks/gpt-canonical.json` | GPT | 122 | 2026-06-05: valid | 2026-06-05 (Q98–Q122 delta) | N/A (no visual items) | `fixed-and-validated` | Previously tracked as 97 reviewed canonical questions. On 2026-06-05, Q98–Q122 (25-question delta) content-reviewed: all pass — no unsafe clinical claims, no calculation errors, no ambiguous keys, no contraindicated sequence steps, Chinese translations accurate. No fixes required. |
| `banks/hard-cases-canonical.json` | Codex/source-checked + Gemini/Claude reviewed | 42 | 2026-06-06: valid after Claude underserved-case merge | Original 19 top-level items ledgered on 2026-06-05; 10-case `cs_ngn_*` delta reviewed and cleaned up on 2026-06-05; 9-case delta reviewed and merged on 2026-06-06; 5-case Claude underserved-category delta reviewed and merged on 2026-06-06 | N/A (no visual items) | `fixed-and-validated` | Started as the schema v1.1 hard-case seed bank covering sepsis from pneumonia and preeclampsia with severe features/magnesium toxicity. On 2026-06-05, merged 17 reviewed schema-valid hard/NGN questions from `banks/Pending cases/gemini-ngn-25-2026-06-05.json` and `banks/Pending cases/gemini-complex-hard-2026-06-05.json`; excluded traditional A-D batches and rejected the noncanonical gap-fill file. Later cleanup restored specific topic labels, replaced placeholder SATA distractors, replaced generic per-choice rationales, and tightened abusive-head-trauma/autonomic-dysreflexia wording for the `cs_ngn_*` case studies. On 2026-06-06, merged 9 reviewed unfolding case studies (29→38), then 5 reviewed Claude underserved-category case studies (38→43); see Merged Source Batches. On 2026-06-06, pruned redundant sa_serotonin_syndrome_01 (43→42) which overlapped with a full case study. |
| `banks/visual-canonical.json` | Claude smoke batch + Codex review; Gemini EKG simulation batch + Claude review | 53 | 2026-06-08: valid after EKG-50 merge | 2026-06-06 rhythm-strip smoke review (3 originals, carries over) + 2026-06-08 EKG-50 content review | 2026-06-08: all 53 items verified — rendered artifact matches source data; all visuals confirmed educationally necessary (answer changes when visual is removed); `selfCheck` passes across MAP, trend, and pattern assertions | `fixed-and-validated` | First reviewed schema v1.2 visual bank. Originally 3 deterministic rhythm-strip items: sinus bradycardia identification, pulseless VT immediate actions, and new-onset atrial fibrillation finding triage. Audit report `audit/rhythm-smoke-2026-06-06.report.md`. Promotion fix corrected the pulseless VT synchronized-cardioversion rationale and softened the adenosine rationale. 2026-06-07: renamed `banks/rhythm-canonical.json` → `banks/visual-canonical.json` (the dedicated home for all visual kinds) during the U0 renderer-registry refactor; item ids and content are byte-identical, so the review status carries over. On 2026-06-08, merged 50 reviewed Gemini EKG-simulation items (3→53); see Merged Source Batches. |
| `banks/vitals-canonical.json` | Gemini U2 Vitals Trend Bank | 10 | 2026-06-08: valid | 2026-06-08 first-pass review | 2026-06-08: verified visual artifacts and selfCheck tests pass | `fixed-and-validated` | 10 schema v1.2 visual items for vitals trend integration. Patched `vit_05` to soften herniation certainty and `vit_10` to use minutes instead of hours. Replaced deprecated `timepointsHr` with `time`. |

## Merged Source Batches

| Source file | Merged into | Questions | Merge date | Notes |
|---|---|---:|---|---|
| `banks/Pending cases/gemini-ngn-25-2026-06-05.json` | `banks/hard-cases-canonical.json` | 5 | 2026-06-05 | Deleted after merge. Review fixes included CKD lab-priority keying/rationale and COPD oxygen rationale refinement. |
| `banks/Pending cases/gemini-complex-hard-2026-06-05.json` | `banks/hard-cases-canonical.json` | 12 | 2026-06-05 | Deleted after merge. Review fixes included stale metadata count, DKA initial-fluid distractor, DKA insulin-calc timing, AMI lead localization, AMI medication caveats, pediatric dehydration wording, VAP oral-care guidance, and thyroid-storm distractor wording. |
| `banks/Pending cases/gemini-trad-batch-A-2026-06-05.json` | `banks/gemini-canonical.json` | 25 | 2026-06-05 | Deleted after merge. Consisted of 13 `trad_pa` and 12 `trad_ppt` questions. |
| `banks/Pending cases/gemini-trad-batch-B-2026-06-05.json` | `banks/gemini-canonical.json` | 25 | 2026-06-05 | Deleted after merge. Consisted of `trad_batchB` questions. |
| `banks/Pending cases/gemini-trad-batch-C-2026-06-05.json` | `banks/gemini-canonical.json` | 25 | 2026-06-05 | Deleted after merge. Consisted of `trad_batchC` questions. |
| `banks/Pending cases/gemini-trad-batch-D-2026-06-05.json` | `banks/gemini-canonical.json` | 25 | 2026-06-05 | Deleted after merge. Consisted of `trad_batchD` questions. |
| `banks/gap-fill-50.json` (former standalone bundled bank) | `banks/gemini-canonical.json` | 50 of 50 | 2026-06-06 | Deleted after consolidation. Antigravity-sourced `gap_50_*` gap-fill items (13 `ordered_response`, 13 `fill_in_blank`, 12 `dropdown_cloze`, 12 `matrix`) targeting Management of Care, Basic Care and Comfort, Safety and Infection Control, and Pharmacological/Parenteral Therapies. Already content-reviewed and `fixed-and-validated` as a standalone; folded into the Gemini bank to leave only LLM-named bundled banks. No re-review or fixes needed. |
| `banks/banks-raw/easy-questions-batch-2026-06-06.json` | `banks/gemini-canonical.json` | 50 of 50 | 2026-06-06 | Deleted after merge. Easy gap-filling batch (49 `multiple_choice` + 1 `select_all`), unique `easy_*` namespace, spanning prioritization/delegation, legal-ethical, med safety, adult health, perioperative, renal/GI, anticoagulation, burns, respiratory/infection, substance use, DKA, mental health, and cardiac fundamentals. Full content review: all 50 clinically sound with correct keys (e.g. opioid OD → respiratory depression, warfarin → soft toothbrush/electric razor, heparin → aPTT, active TB → airborne precautions); no fixes required. Near-duplicate scan found only loose concept overlaps with existing harder items (different stems/options/keys), kept intentionally to populate the previously under-served easy difficulty band. |
| `banks/banks-raw/10_hard_cases.json` | `banks/hard-cases-canonical.json` | 7 of 10 | 2026-06-06 | Deleted after merge. Assorted high-acuity unfolding case studies. Promoted `case_stroke_01`, `cs_aki_01`, `cs_panc_01`, `case_burns_01`, `case_pph_01`, `case_pe_01`, `case_cirrhosis_01`; topic labels stripped/Title-Cased on promotion. Fixed `case_burns_01` Rule-of-Nines error: stem burns "entire face" (anterior head = 4.5%), so TBSA = 31.5% and Parkland = 4 × 80 × 31.5 = 10,080 mL (was keyed 36%/11,520). Dropped 3 as duplicates of existing canonical case studies: `cs_sepsis_pneumonia_01` (≈`case_sepsis_pneumonia_01`), `cs_ami_01` (≈`case_ami_01`), and `case_dka_01` (hard ID collision with existing `case_dka_01`, same scenario). |
| `banks/banks-raw/antigravity-1.1-cases.json` | `banks/hard-cases-canonical.json` | 2 of 2 | 2026-06-06 | Deleted after merge. Zero-coverage topics: `case_gbs_01` (Guillain-Barré — ascending symmetric paralysis, FVC monitoring, ABC priorities) and `case_celiac_01` (Celiac — dermatitis herpetiformis, tTG-IgA, BROW gluten grains). Content reviewed clinically sound; no fixes required. |
| `banks/banks-raw/claude-2026-06-05-gapfill-moc-pharm.json` | `banks/claude-canonical.json` | 5 of 6 | 2026-06-06 | Deleted after merge. Census-driven gap-fill targeting Management of Care and Pharmacological/Parenteral Therapies; audit report `audit/claude-2026-06-05-gapfill-moc-pharm.report.md`. Promoted `claude_jun05_moc_case_mgmt_01`, `claude_jun05_moc_referral_slp_02`, `claude_jun05_moc_quality_improvement_03`, `claude_jun05_pharm_pca_opioid_safety_04`, `claude_jun05_pharm_clozapine_teaching_05`. Dropped `claude_jun05_pharm_insulin_mixing_06`: clinically correct but redundant with bundled `gemini_d2_insulin_01`. No fixes required on survivors. |
| `banks/banks-raw/claude-2026-06-06-underserved-case-studies.json` | `banks/hard-cases-canonical.json` | 5 of 5 | 2026-06-06 | Deleted after merge. Claude schema v1.1 case-study batch targeting under-served case-study categories: chest tubes/RRP, pressure injury/BCC, C. difficile/SIC, adult immunization/HPM, and IPV/PSI. Audit report `audit/claude-2026-06-06-underserved-case-studies.report.md`. Content reviewed against current sources; no keys changed. Promotion fixes tightened chest-tube wording, C. difficile soap-and-water/PPE-sequence wording, and pneumococcal age-threshold rationale. |
| `banks/banks-raw/rhythm-smoke-2026-06-06.json` | `banks/rhythm-canonical.json` (renamed to `banks/visual-canonical.json` on 2026-06-07) | 3 of 3 | 2026-06-06 | Deleted after merge. First schema v1.2 rhythm-strip smoke batch. Promoted `rhy_sinus_brady_001`, `rhy_vtach_001`, and `rhy_afib_001`; audit report `audit/rhythm-smoke-2026-06-06.report.md`. Promotion fix corrected the pulseless VT synchronized-cardioversion rationale and softened the adenosine rationale. |
| `banks/banks-raw/ekg-simulation-50.json` | `banks/visual-canonical.json` | 50 of 50 | 2026-06-08 | Deleted after merge. Gemini EKG-simulation batch using the rhythm-strip renderer (`ekg_b1`–`ekg_b5` namespaces): 36 `multiple_choice`, 9 `select_all`, 5 `matrix`; 44 carry rhythm-strip visuals, 6 correctly omit visuals for findings the renderer cannot depict (pacing spikes, ST-elevation, U waves, low-voltage QRS). Full content review: all keys clinically sound against current guidance (2020 AHA atropine 1 mg first-line, glucagon for beta-blocker OD, adenosine rapid-push technique, pulseless VT → unsynchronized defibrillation, amiodarone 150 mg/10 min for stable VT, Mobitz II → transcutaneous pacing, complete heart block → permanent pacemaker, VFib/asystole/PEA shockable-vs-not, pacemaker failure modes, anterior STEMI = V2–V4/LAD, Beck's triad, hyper/hypokalemia and TCA-overdose ECG changes); bilingual zh fluent with glossary + testTakingStrategy on every item. Promotion fixes: dropped misleading/un-renderable decorative visuals from `ekg_b5_mc_03` (stem states QT 0.52 s but strip rendered a normal QT), `ekg_b5_mc_01` (peaked-T anticipatory item), and `ekg_b5_sata_06` (caption claimed pacing capture the renderer cannot draw); corrected `ekg_b5_mc_02` visual `rateBpm` 50→48 to match the stem. Loose-overlap (not duplicate) note: `ekg_b4_mc_04` (pulseless-VT first action, MC) and `ekg_b2_sata_09` (afib instability, SATA) test the same scenarios as canonical `rhy_vtach_001`/`rhy_afib_001` but in different item types/focus; kept intentionally. |
| `banks/banks-raw/gemini-100-consolidated.json` (+ 10 raw `gemini-{bcc,sic,rrp,hpm,psi}-batch{1,2}.json` source files) | `banks/gemini-canonical.json` | 79 of 100 | 2026-06-05 | `banks/banks-raw/` deleted after merge. Gap-fill batches targeting the five lowest-covered categories (20 q each: Basic Care and Comfort, Safety and Infection Control, Reduction of Risk Potential, Health Promotion and Maintenance, Psychosocial Integrity). Full content review found clinical content sound (all dosage calcs, lithium ranges, screening-age guidelines, and keyed answers verified). Fixes applied to survivors: `gen_bcc_batch1_8` glossary typo (吞吞困难→吞咽困难), `gen_psi_batch1_1` garbled byChoice zh (比兴→否认), and trimmed duplicated `{{1}}/{{2}}` cloze tokens out of the `gen_sic_batch1_06` and `gen_hpm_batch1_6` stems. Dropped 21 near-duplicates: 13 duplicating existing canonical items (`gen_bcc_batch2_2`, `gen_sic_batch1_01/03/04`, `gen_rrp_batch1_02/03`, `gen_rrp_batch2_04/08`, `gen_hpm_batch1_8`, `gen_hpm_batch2_2/4`, `gen_psi_batch1_5/10`) and 8 duplicating each other across the batch1/batch2 split (`gen_bcc_batch2_1/3/4/9`, `gen_sic_batch2_5/7`, `gen_hpm_batch2_8`, `gen_psi_batch1_9`). Raw per-category batch files were schema-invalid as emitted (empty `rationale.byChoice`, a few missing `stem.zh`); the consolidated copy was the fixed, schema-valid promotion source. |

## Unreviewed / Pending Banks

| Bank file | Source | Questions | Schema validation | Content review | Status | Notes |
|---|---:|---:|---|---|---|---|
| `banks/Pending cases/gemini-ngn-gap-fill-2026-06-05.json` | Gemini | 5 raw case studies | 2026-06-05: invalid (`questions must be an array`) | 2026-06-05 schema-shape review only | `rejected` | File declares `schemaVersion: "1.1"` but uses a noncanonical `caseStudies`/`type`/`answer` shape rather than the app's `meta.questions` schema. Not merged into `hard-cases-canonical.json`; would need a deliberate conversion and full content review before use. |

## Next Planned Review

- Next Gemini batch (if generated): will arrive as a new batch file; review before consolidation.
