# Bank Census — 2026-06-09

Generated from actual `banks/*.json` repo state. All counts are from disk; do not trust `PROJECT-HISTORY.md` or `BANK-REVIEW-LEDGER.md` snapshot values until this document confirms them.

---

## 1 — Active Bundled Banks (top-level `banks/*.json`)

All seven files are loaded by `src/banks.ts` via `import.meta.glob("../banks/*.json")`. No metadata/actual-count mismatches found.

| File | schemaVersion | meta.count | questions.length | Mismatch |
|---|---|---|---|---|
| `capnography-canonical.json` | 1.2 | 7 | 7 | — |
| `claude-canonical.json` | 1.0 | 50 | 50 | — |
| `gemini-canonical.json` | 1.1 | 749 | 749 | — |
| `gpt-canonical.json` | 1.0 | 122 | 122 | — |
| `hard-cases-canonical.json` | 1.2 | 46 | 46 | — |
| `visual-canonical.json` | 1.2 | 53 | 53 | — |
| `vitals-canonical.json` | 1.2 | 10 | 10 | — |

**Total bundled: 1 037 top-level questions.**

### Stale-documentation note

`capnography-canonical.json` is fully bundled and validated but was **omitted** from the "Current canonical banks" list in `PROJECT-HISTORY.md`. The `BANK-REVIEW-LEDGER.md` likewise has no entry for it. Both files are corrected below (§9).

---

## 2 — Non-Bundled / Staging Files

| Location | Contents | Status |
|---|---|---|
| `banks/banks-raw/` | `librarycontext.md` only (no JSON bank files) | Not a bank; no staging content present |
| `banks/Pending cases/` | Directory does not exist | All pending batches were merged and deleted per ledger |

No nested `.json` banks exist anywhere under `banks/**` outside the seven top-level files.

---

## 3 — Global Bundled Counts

### Totals

| Metric | Count |
|---|---|
| Top-level questions | **1 037** |
| Case-study top-level items | 39 |
| Embedded case-study parts | 155 |
| Graded items total (standalone + embedded) | **1 192** |

### By itemType

| itemType | Count |
|---|---|
| multiple_choice | 396 |
| select_all | 180 |
| matrix | 129 |
| dropdown_cloze | 115 |
| ordered_response | 90 |
| fill_in_blank | 88 |
| case_study | 39 |

### By category

| Category | Count |
|---|---|
| Physiological Adaptation | 203 |
| Pharmacological and Parenteral Therapies | 134 |
| Management of Care | 123 |
| Psychosocial Integrity | 117 |
| Safety and Infection Control | 117 |
| Reduction of Risk Potential | 116 |
| Basic Care and Comfort | 114 |
| Health Promotion and Maintenance | 113 |

### By difficulty

| Difficulty | Count |
|---|---|
| medium | 516 |
| hard | 387 |
| easy | 134 |

### By source file

| File | Count |
|---|---|
| gemini-canonical | 749 |
| visual-canonical | 53 |
| gpt-canonical | 122 |
| hard-cases-canonical | 46 |
| claude-canonical | 50 |
| vitals-canonical | 10 |
| capnography-canonical | 7 |

### By schema version

| schemaVersion | Questions | Files |
|---|---|---|
| 1.2 | 116 | capnography-canonical, hard-cases-canonical, visual-canonical, vitals-canonical |
| 1.1 | 749 | gemini-canonical |
| 1.0 | 172 | claude-canonical, gpt-canonical |

---

## 4 — Visual Inventory

### Totals

| Metric | Count |
|---|---|
| Top-level questions with `visual` | 61 |
| Case-study stage exhibits with `visual` | 1 |
| **Total visuals (coverage-report)** | **62** |

### By visual kind

| Kind | Count | Source bank(s) |
|---|---|---|
| rhythm_strip | 44 | visual-canonical only |
| vitals_trend | 11 | vitals-canonical (10) + hard-cases-canonical stage exhibit (1) |
| capnography | 7 | capnography-canonical only |
| lab_trend | 0 | renderer implemented (U3); no content yet |
| mar | 0 | renderer implemented (U4); no content yet |

### Visual counts by source file

| Source | rhythm_strip | vitals_trend | capnography |
|---|---|---|---|
| visual-canonical | 44 | — | — |
| vitals-canonical | — | 10 | — |
| capnography-canonical | — | — | 7 |
| hard-cases-canonical (stage exhibit) | — | 1 | — |

### Visual separation convention

Each visual kind lives in its own bank file:
- `rhythm_strip` → `visual-canonical.json`
- `vitals_trend` → `vitals-canonical.json`
- `capnography` → `capnography-canonical.json`

The one vitals_trend visual in `hard-cases-canonical.json` (`cs_thyroid_storm_main`, stage `stage_1200`, exhibit `ex_trend_1200`) is an exception: a case-study exhibit visual embedded inline because the visual is integral to the unfolding case narrative. This is the intended and reviewed design.

### rhythm_strip item IDs (44)

`rhy_sinus_brady_001`, `rhy_vtach_001`, `rhy_afib_001`, `ekg_b1_mc_01` – `ekg_b1_mc_10` (10), `ekg_b2_mc_01` – `ekg_b2_matrix_10` (10), `ekg_b3_mc_01` – `ekg_b3_matrix_10` (10), `ekg_b4_mc_01` – `ekg_b4_matrix_10` (10), `ekg_b5_mc_02`

### capnography item IDs (7)

`cap_01`, `cap_02`, `cap_03`, `cap_04`, `cap_05`, `cap_08`, `cap_10`

### vitals_trend item IDs (11)

`vit_01` – `vit_10` (in vitals-canonical); `ex_trend_1200` exhibit inside `cs_thyroid_storm_main` (in hard-cases-canonical)

### Rhythm-strip sub-type breakdown (from coverage-report)

| Rhythm | Count |
|---|---|
| sinus_brady | 6 |
| afib | 5 |
| vtach | 4 |
| sinus_tach | 4 |
| svt | 4 |
| avb_3 | 3 |
| avb_1 | 3 |
| vfib | 3 |
| avb_2_mobitz2 | 2 |
| avb_2_mobitz1 | 2 |
| pvc | 2 |
| sinus | 2 |
| asystole | 2 |
| aflutter | 2 |

---

## 5 — Case-Study Inventory

39 top-level case studies; 155 embedded graded parts.

| ID | Topic | Embedded parts | Bank |
|---|---|---|---|
| `gen_rrp_batch1_10` | Respiratory & Infectious Disorders | 2 | gemini-canonical |
| `gen_rrp_batch2_10` | Perioperative Care | 2 | gemini-canonical |
| `case_sepsis_pneumonia_01` | Sepsis & Septic Shock | 4 | hard-cases-canonical |
| `case_preeclampsia_magnesium_01` | Maternal-Newborn Care & Teaching | 4 | hard-cases-canonical |
| `cs_copd_01` | Respiratory & Infectious Disorders | 5 | hard-cases-canonical |
| `cs_ckd_01` | Procedural Complications & Dialysis | 5 | hard-cases-canonical |
| `cs_asthma_01` | Pediatric & Adolescent Health | 5 | hard-cases-canonical |
| `cs_schiz_01` | Mental Health Disorders | 5 | hard-cases-canonical |
| `cs_hip_01` | Perioperative Care | 5 | hard-cases-canonical |
| `case_dka_01` | Diabetic Ketoacidosis (DKA) | 5 | hard-cases-canonical |
| `case_ami_01` | Cardiovascular Disorders | 5 | hard-cases-canonical |
| `cs_ngn_001_anorexia` | Anorexia Nervosa / Refeeding Syndrome | 5 | hard-cases-canonical |
| `cs_ngn_002_disaster` | Disaster Triage / Chemical Exposure | 5 | hard-cases-canonical |
| `cs_ngn_003_child_abuse` | Child Abuse / Non-Accidental Trauma | 5 | hard-cases-canonical |
| `cs_ngn_004_blood` | Blood Transfusion Reaction (Hemolytic/TRALI) | 5 | hard-cases-canonical |
| `cs_ngn_005_bipolar` | Bipolar I - Acute Manic Episode | 5 | hard-cases-canonical |
| `cs_ngn_006_tbi` | Traumatic Brain Injury (TBI) / Cushing's Triad | 5 | hard-cases-canonical |
| `cs_ngn_007_dic` | Disseminated Intravascular Coagulation (DIC) | 5 | hard-cases-canonical |
| `cs_ngn_008_peds` | Pyloric Stenosis vs. Intussusception | 5 | hard-cases-canonical |
| `cs_ngn_009_serotonin` | Serotonin Syndrome vs. NMS | 5 | hard-cases-canonical |
| `cs_ngn_010_ad` | Autonomic Dysreflexia | 5 | hard-cases-canonical |
| `case_stroke_01` | Ischemic Stroke | 3 | hard-cases-canonical |
| `cs_aki_01` | Acute Kidney Injury | 3 | hard-cases-canonical |
| `cs_panc_01` | Acute Pancreatitis | 2 | hard-cases-canonical |
| `case_burns_01` | Severe Burns | 2 | hard-cases-canonical |
| `case_pph_01` | Postpartum Hemorrhage | 2 | hard-cases-canonical |
| `case_pe_01` | Pulmonary Embolism | 3 | hard-cases-canonical |
| `case_cirrhosis_01` | Cirrhosis With Esophageal Varices | 3 | hard-cases-canonical |
| `case_gbs_01` | Guillain-Barré Syndrome | 2 | hard-cases-canonical |
| `case_celiac_01` | Celiac Disease | 2 | hard-cases-canonical |
| `claude_cs_jun06_chest_tube_rrp_01` | Chest Tube Management | 4 | hard-cases-canonical |
| `claude_cs_jun06_pressure_injury_bcc_01` | Pressure Injury Staging and Prevention | 4 | hard-cases-canonical |
| `claude_cs_jun06_cdiff_sic_01` | Clostridioides difficile and Contact Precautions | 4 | hard-cases-canonical |
| `claude_cs_jun06_adult_immunization_hpm_01` | Adult Immunization and Preventive Screening | 4 | hard-cases-canonical |
| `claude_cs_jun06_ipv_screening_psi_01` | Intimate Partner Violence Screening and Support | 4 | hard-cases-canonical |
| `cs_thyroid_storm_main` | Thyroid Storm | 4 | hard-cases-canonical |
| `cs_adhf_pulm_edema_01` | Acute Decompensated Heart Failure (ADHF) | 4 | hard-cases-canonical |
| `cs_stemi_vfib_04` | Acute Myocardial Infarction and Ventricular Fibrillation | 4 | hard-cases-canonical |
| `cs_sepsis_shock_01` | Septic Shock from Urosepsis | 4 | hard-cases-canonical |

### Near-duplicate case topics (within hard-cases-canonical)

| Group | IDs | Note |
|---|---|---|
| Sepsis/shock | `case_sepsis_pneumonia_01`, `cs_sepsis_shock_01` | Different presentations (pneumonia vs urosepsis); intentional diversity |
| Cardiac arrest | `case_ami_01`, `cs_stemi_vfib_04` | Different focus (AMI management vs STEMI/VFib ACLS); intentional |
| Thyroid storm | `cs_thyroid_storm_main` (case study), `sa_thyroid_storm_01` (standalone select_all) | Different formats; case study adds vitals_trend; acceptable |
| Perioperative | `cs_hip_01`, `gen_rrp_batch2_10` | Different surgeries (TKA re-contextualized); acceptable |

No true duplicates detected in the case topic space.

---

## 6 — Duplicate-Risk Data

### Duplicate question IDs across all bundled banks

**Zero duplicate IDs found.** All 1 037 top-level question IDs and embedded case-study question IDs are globally unique.

### Repeated visual topics to avoid in future generation

The following rhythm-strip types are already well-covered and should not be prioritized:

- sinus_brady (6), afib (5), vtach (4), sinus_tach (4), svt (4)

Under-covered rhythms for future visual content:
- aflutter (2), asystole (2), pvc (2), sinus (2), avb_2_mobitz1 (2), avb_2_mobitz2 (2), avb_1 (3), avb_3 (3), vfib (3)
- lab_trend: 0 items (renderer ready)
- mar: 0 items (renderer ready)

### High-density standalone topics (avoid in new generation unless a novel angle exists)

From `npm run coverage-report` AVOID_TOPICS list:
- Mental Health Disorders (61)
- Prioritization & Delegation (47)
- Legal & Ethical Principles (45)
- Maternal-Newborn Care & Teaching (43)
- Cardiovascular Disorders (43)
- Dosage Calculations (41)
- Medication Safety & Admin (40)
- Patient & Environment Safety (39)

---

## 7 — Verification Results (2026-06-09)

All commands run from repo root.

| Command | Result |
|---|---|
| `npm run validate-bank -- banks/*.json` | **PASS** — all 7 banks OK |
| `npm run coverage-report` | **PASS** — 1 037 total, 145 unique topics |
| `npm run test-visuals` | **PASS** — 5 kind(s): rhythm_strip, capnography, vitals_trend, lab_trend, mar; 6 test suites green |
| `npm run build` | **PASS** — clean TypeScript compile + Vite build |

---

## 8 — Coverage Snapshot (from `npm run coverage-report`)

```
Files scanned: capnography-canonical.json, claude-canonical.json, gemini-canonical.json,
               gpt-canonical.json, hard-cases-canonical.json, visual-canonical.json, vitals-canonical.json
Total questions: 1037
Unique normalized topics: 145

Category Counts:
  Health Promotion and Maintenance:        113
  Basic Care and Comfort:                  114
  Reduction of Risk Potential:             116
  Psychosocial Integrity:                  117
  Safety and Infection Control:            117
  Management of Care:                      123
  Pharmacological and Parenteral Therapies: 134
  Physiological Adaptation:               203

Item Type Counts:
  case_study:       39
  fill_in_blank:    88
  ordered_response: 90
  dropdown_cloze:   115
  matrix:           129
  select_all:       180
  multiple_choice:  396

Visual Counts (total 62):
  capnography:  7
  lab_trend:    0
  mar:          0
  rhythm_strip: 44
  vitals_trend: 11
```

---

## 9 — Gemini Context Block

Use this block when beginning a new Gemini generation session for Project Shrimp.

```
## Project Shrimp — Active Bank State (census 2026-06-09)

### Active bundled banks (7 files, all in banks/*.json)
- capnography-canonical.json   — 7 q  (schema 1.2; capnography visual items)
- claude-canonical.json        — 50 q  (schema 1.0; general bilingual)
- gemini-canonical.json        — 749 q (schema 1.1; general bilingual)
- gpt-canonical.json           — 122 q (schema 1.0; general bilingual)
- hard-cases-canonical.json    — 46 q  (schema 1.2; case studies + hard standalones)
- visual-canonical.json        — 53 q  (schema 1.2; rhythm_strip visual items)
- vitals-canonical.json        — 10 q  (schema 1.2; vitals_trend visual items)

TOTAL: 1 037 top-level questions; 155 embedded case-study parts; 62 visual stimuli

### Category balance (target ~130 each; 1037/8 = 129.6)
Under-served (generate toward):
  Health Promotion and Maintenance:  113 (-17)
  Basic Care and Comfort:            114 (-16)
  Reduction of Risk Potential:       116 (-14)
  Psychosocial Integrity:            117 (-13)
  Safety and Infection Control:      117 (-13)
  Management of Care:                123  (-7)

Over-served (avoid unless high-value angle):
  Physiological Adaptation:          203 (+73)

### Item-type balance (target ~148 each; 1037/7 = 148.1)
Under-served:
  case_study:       39  (-109) — hardest to generate safely; stage raw in banks-raw/
  fill_in_blank:    88  (-60)
  ordered_response: 90  (-58)
  dropdown_cloze:  115  (-33)
  matrix:          129  (-19)

Over-served:
  multiple_choice: 396 (+248)
  select_all:      180  (+32)

### Visual content gaps
- lab_trend: 0 questions (renderer fully implemented — U3 done)
- mar: 0 questions (renderer fully implemented — U4 done)
- Rhythm strips: under-covered types: aflutter, asystole, pvc, sinus, avb_2_mobitz1,
  avb_2_mobitz2, avb_1, avb_3, vfib (each ≤3)

### Duplicate-prone topics — DO NOT generate more without a novel angle
Mental Health Disorders (61), Prioritization & Delegation (47),
Legal & Ethical Principles (45), Maternal-Newborn Care & Teaching (43),
Cardiovascular Disorders (43), Dosage Calculations (41),
Medication Safety & Admin (40), Patient & Environment Safety (39)

### Generation target recommendation
Best next batches by impact:
1. lab_trend visual items (0 → 10–15): use lab_trend renderer spec in NCLEX-Question-Schema.md;
   target Physiological Adaptation, RRP, BCC
2. fill_in_blank / ordered_response / dropdown_cloze non-visual targeting HPM, BCC, RRP, PSI, SIC
3. mar visual items (0 → 5–10): use mar renderer spec; target Pharmacological and Parenteral Therapies
4. Additional case_study items for low-count clinical topics (AKI, pancreatitis, burns, GBS, celiac)

### Generation rules (invariants)
- All output to banks-raw/<model>-<date>-<batch>.json (NEVER directly to canonical banks)
- Every question bilingual (stem.en + stem.zh, all rationale, testTakingStrategy, glossary)
- Schema version 1.2 for any item using a visual; 1.1 minimum for case studies
- Raw generated content is NOT reviewed study material until: validate-bank passes,
  cross-model content review completed, audit report written, promoted to canonical bank
- Do not claim reviewed status for any banks-raw/ content
```
