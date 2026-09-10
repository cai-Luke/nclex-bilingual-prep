# Campaign 16 Phase E — Parent-Level Calibration Sample Rationale

Date: 2026-09-08  
Commission: Whole-Parent Stage Anchor Calibration Commission  
Artifact root: `audit/campaign-16-phase-e-anchor-parent-calibration-2026-09-08-r1/`

---

## 1. Population Context & Sizing

The frozen pre-repair anchor-omission population comprises:
- **451 total affected embedded parts** across **93 distinct parent case studies** in 4 bundled banks.
- **96 rows** belong to **25 single-stage parent cases** (cardinality-1 domain where `caseStudy.stages.length === 1`).
- **355 rows** belong to **68 multi-stage parent cases** (`caseStudy.stages.length > 1`).

Under the calibration commission charter:
1. Single-stage cases (96 rows) are **not** adjudicated or repaired; their structural vs. semantic baseline question is carried forward analytically.
2. The semantic unit of analysis is the **complete multi-stage parent case**, not isolated rows.
3. A sample of **8 multi-stage parent cases** is selected deterministically from the 68 multi-stage parents to evaluate parent-level anchor recoverability, coherence, and baseline contract adequacy.

---

## 2. Sampling Stratification & Objectives

Section 2 of the commission requires representing:
1. **All four affected banks:** `claude-canonical`, `gemini-canonical`, `gpt-canonical`, `hard-cases-canonical`.
2. **Ordinary 3-stage / 6-part cases:** standard unfolding clinical scenarios.
3. **At least one 3-stage / 5-part case:** non-standard part cardinality.
4. **At least one 2-stage case:** minimal multi-stage progression.
5. **At least one 4-stage case:** maximal multi-stage progression.
6. **At least one partially affected parent with existing sibling anchors:** cases where some sibling parts already possess resolving stage anchors.
7. **At least one parent containing either Stage-2 gate-breach row 370 or 395:** cases where the Stage-2 checker breached the §9.4 no-leak gate.

Preferred bank distribution:
- `claude-canonical`: ~2 parents
- `gemini-canonical`: ~1 parent
- `gpt-canonical`: ~3 parents
- `hard-cases-canonical`: ~2 parents
Total = 8 parents.

---

## 3. Stratum Availability & Deterministic Selection Mechanics

A census of the 68 multi-stage parents across the 4 affected banks revealed:
- `claude-canonical`: 10 multi-stage parents (all 3-stage; 2 are 5-part, 8 are 6-part; all fully affected).
- `gemini-canonical`: 3 multi-stage parents (1 is 3-stage/6-part; 2 are 2-stage/4-part; all fully affected).
- `gpt-canonical`: 40 multi-stage parents (6 are 2-stage/4-part partially affected with 3 sibling anchors each; 2 are 4-stage/6-part; remaining 32 are 3-stage cases with 5 or 6 parts).
- `hard-cases-canonical`: 15 multi-stage parents (4 are 2-stage/4-part including breach row 370; 1 is 4-stage/6-part; remaining 10 are 3-stage cases including breach row 395).

Selection within each stratum was governed strictly by a reproducible mechanical rule: **lowest Stage-0 queue index (`firstQueueIndex`) among qualifying parents**. No parent was hand-picked.

### Sample Allocations:

| Sample # | Bank | Parent Case ID | First Q | Stages | Parts | Aff Parts | Represented Strata | Deterministic Selection Rule |
|---|---|---|---|---|---|---|---|---|
| **1** | `claude-canonical` | `opus2_case_code_status_01` | 1 | 3 | 5 | 5 | Claude, 3-stage / 5-part | Lowest `firstQueueIndex` in `claude-canonical` with 3 stages and 5 parts |
| **2** | `claude-canonical` | `opus_vanco_case_01` | 6 | 3 | 6 | 6 | Claude, ordinary 3-stage / 6-part | Lowest `firstQueueIndex` in `claude-canonical` with ordinary 3 stages and 6 parts |
| **3** | `gemini-canonical` | `opus_agvd_case_agvhd_01` | 59 | 3 | 6 | 6 | Gemini, ordinary 3-stage / 6-part | Lowest `firstQueueIndex` in `gemini-canonical` overall |
| **4** | `gpt-canonical` | `gpt_case_gap_2026_06_11_case_adhf_01` | 153 | 2 | 4 | 1 | GPT, partially affected (with sibling anchors), 2-stage | Lowest `firstQueueIndex` in `gpt-canonical` among partially affected parents |
| **5** | `gpt-canonical` | `gpt_case_opus5_cdi_immunocompromised_01` | 159 | 3 | 6 | 6 | GPT, ordinary 3-stage / 6-part | Lowest `firstQueueIndex` in `gpt-canonical` among ordinary 3-stage / 6-part parents |
| **6** | `gpt-canonical` | `gpt_case_warfarin_mvr_2026_06_11_01` | 165 | 4 | 6 | 6 | GPT, 4-stage / 6-part | Lowest `firstQueueIndex` in `gpt-canonical` with 4 stages |
| **7** | `hard-cases-canonical` | `cs_thyroid_storm_main` | 369 | 2 | 4 | 4 | Hard cases, Stage-2 gate-breach row 370, 2-stage | Contains breach row 370; lowest `firstQueueIndex` breach parent |
| **8** | `hard-cases-canonical` | `opus_tpn_case_mucositis_01` | 393 | 3 | 6 | 6 | Hard cases, Stage-2 gate-breach row 395, ordinary 3-stage / 6-part | Contains breach row 395; ordinary 3-stage / 6-part in hard-cases |

---

## 4. Coverage Verification Against All Prompt Criteria

1. **All four affected banks represented:**
   - `claude-canonical`: 2 parents
   - `gemini-canonical`: 1 parent
   - `gpt-canonical`: 3 parents
   - `hard-cases-canonical`: 2 parents
   *(Exact match with preferred allocation)*
2. **Ordinary 3-stage / 6-part cases:**
   - 4 cases (`opus_vanco_case_01`, `opus_agvd_case_agvhd_01`, `gpt_case_opus5_cdi_immunocompromised_01`, `opus_tpn_case_mucositis_01`) across all 4 banks.
3. **At least one 3-stage / 5-part case:**
   - `opus2_case_code_status_01` (3 stages, 5 parts).
4. **At least one 2-stage case:**
   - 2 cases (`gpt_case_gap_2026_06_11_case_adhf_01` and `cs_thyroid_storm_main`).
5. **At least one 4-stage case:**
   - `gpt_case_warfarin_mvr_2026_06_11_01` (4 stages, 6 parts).
6. **At least one partially affected parent with existing sibling anchors:**
   - `gpt_case_gap_2026_06_11_case_adhf_01` (Parts 2, 3, 4 carry legacy `stageId` anchors; Part 1 is the sole affected row).
7. **At least one parent containing either Stage-2 gate-breach row 370 or 395:**
   - Both are captured: `cs_thyroid_storm_main` contains row 370; `opus_tpn_case_mucositis_01` contains row 395.

Total sample size: **8 parent cases**, comprising **40 affected embedded parts** and **3 sibling parts** (total 43 clinical questions reviewed).
