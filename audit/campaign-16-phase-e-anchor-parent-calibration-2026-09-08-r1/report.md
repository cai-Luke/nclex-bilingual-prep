# Campaign 16 Phase E — Parent-Level Stage Anchor Calibration Commission Report

**Date:** 2026-09-08  
**Commission:** Read-Only Anchor Parent Calibration Commission  
**Operating Seat:** Gemini 3.8 Flash (High) — Primary Coding & Analysis Seat  
**Output Root:** `audit/campaign-16-phase-e-anchor-parent-calibration-2026-09-08-r1/`  
**Governance:** Subordinate to `AGENTS.md` and `DECISIONS.md`; no bank mutation, no patch execution, no ledger update, no census regeneration.

---

## Executive Summary & Owner Decision Trigger

This read-only calibration commission evaluated whether historical stage-anchor omissions across multi-stage case studies can be recovered efficiently and coherently at the **whole-parent-case level**. 

A deterministic sample of **8 multi-stage parent cases** (spanning **40 affected embedded parts** and 3 sibling parts across all 4 affected banks) was subjected to whole-case clinical and structural analysis.

### Primary Decision Token:
```
CAMPAIGN16_ANCHOR_CALIBRATION_BASELINE_CONTRACT_GAP
```

### Core Findings:
1. **The baseline contract gap is real, prevalent, and architectural:** Exactly **4 of the 8 sampled parents (50.0%)** contain embedded questions that test the client's baseline admission or emergency triage state, where all necessary cues reside in global exhibits and the first declared entry in `caseStudy.stages[]` represents a later deterioration, provider orders, or intervention.
2. **Current schema cannot represent baseline answerability:** Under `src/types.ts` and `src/schema.ts`, `answerableAfterStageId` must match one of `caseStudy.stages[].id`. Forcing the first declared stage ID onto baseline questions either explicitly leaks the correct nursing action (e.g. in `opus2_case_code_status_01` Q1 and `gpt_case_warfarin_mvr_2026_06_11_01` Q1–Q2) or prematurely exposes subsequent acute deterioration (e.g. in `gpt_case_gap_2026_06_11_case_adhf_01` Q1).
3. **Stage-2 gate breaches are successfully neutralized by correct historical anchors:** Both Phase E Stage-2 gate-breach rows (row 370 in `cs_thyroid_storm_main` and row 395 in `opus_tpn_case_mucositis_01`) were fully recovered. In both cases, anchoring the item to its true decision stage (`stage_0830` and `stage_2` respectively) suppresses the subsequent stage narrative that was leaking the answer.
4. **Single-stage cases share this defect:** Targeted inspection of single-stage cases (e.g., in `gemini-canonical`) confirmed that single declared stages also frequently represent future follow-up notes (e.g., 3 months later, 4 hours later), meaning that forcing a single stage ID onto baseline questions is semantically misleading.
5. **R3 repair work order is contradicted by evidence:** R3's core premises—that Tier 1 is deterministic and rendering-neutral, and that all 451 rows can be repaired by setting an existing stage ID without schema alteration—are falsified by live data.

---

## 1. Exact 8-Parent Sample Manifest

The 8 multi-stage parent cases were selected deterministically from the 68 multi-stage parents in the frozen 451-row population according to the criteria in Section 2 of the commission charter:

| Sample # | Bank | Parent Case ID | Stages | Parts | Aff Parts | Represented Strata | Deterministic Selection Rule |
|---|---|---|---|---|---|---|---|
| **1** | `claude-canonical.json` | `opus2_case_code_status_01` | 3 | 5 | 5 | Claude, 3-stage / 5-part | Lowest `firstQueueIndex` (1) in `claude-canonical` with 3 stages and 5 parts |
| **2** | `claude-canonical.json` | `opus_vanco_case_01` | 3 | 6 | 6 | Claude, ordinary 3-stage / 6-part | Lowest `firstQueueIndex` (6) in `claude-canonical` with ordinary 3 stages and 6 parts |
| **3** | `gemini-canonical.json` | `opus_agvd_case_agvhd_01` | 3 | 6 | 6 | Gemini, ordinary 3-stage / 6-part | Lowest `firstQueueIndex` (59) in `gemini-canonical` overall |
| **4** | `gpt-canonical.json` | `gpt_case_gap_2026_06_11_case_adhf_01` | 2 | 4 | 1 | GPT, partially affected (with sibling anchors), 2-stage | Lowest `firstQueueIndex` (153) in `gpt-canonical` among partially affected parents |
| **5** | `gpt-canonical.json` | `gpt_case_opus5_cdi_immunocompromised_01` | 3 | 6 | 6 | GPT, ordinary 3-stage / 6-part | Lowest `firstQueueIndex` (159) in `gpt-canonical` among ordinary 3-stage / 6-part parents |
| **6** | `gpt-canonical.json` | `gpt_case_warfarin_mvr_2026_06_11_01` | 4 | 6 | 6 | GPT, 4-stage / 6-part | Lowest `firstQueueIndex` (165) in `gpt-canonical` with 4 stages |
| **7** | `hard-cases-canonical.json` | `cs_thyroid_storm_main` | 2 | 4 | 4 | Hard cases, Stage-2 gate breach row 370, 2-stage | Contains breach row 370; lowest `firstQueueIndex` (369) breach parent |
| **8** | `hard-cases-canonical.json` | `opus_tpn_case_mucositis_01` | 3 | 6 | 6 | Hard cases, Stage-2 gate breach row 395, ordinary 3-stage / 6-part | Contains breach row 395; lowest `firstQueueIndex` (393) breach parent |

The full machine-readable manifest is recorded in [`sample-manifest.json`](sample-manifest.json).

---

## 2. Number of Affected Parts Reviewed

- **Total affected embedded parts reviewed:** **40 parts** across 8 parents.
- **Pre-existing sibling parts reviewed:** **3 parts** (in `gpt_case_gap_2026_06_11_case_adhf_01`).
- **Total clinical questions reviewed in full context:** **43 questions**.

---

## 3. Whole-Parent Recoverability Distribution

| Category | Parent Count | Percentage | Parent Case IDs |
|---|---|---|---|
| **Fully Recoverable** | 4 | 50.0% | `opus_vanco_case_01`, `opus_agvd_case_agvhd_01`, `gpt_case_opus5_cdi_immunocompromised_01`, `opus_tpn_case_mucositis_01` |
| **Partially Recoverable** | 0 | 0.0% | — |
| **Structurally Unrepresentable (Baseline Gap)** | 4 | 50.0% | `opus2_case_code_status_01`, `gpt_case_gap_2026_06_11_case_adhf_01`, `gpt_case_warfarin_mvr_2026_06_11_01`, `cs_thyroid_storm_main` |
| **Semantically Ambiguous** | 0 | 0.0% | — |
| **Total** | **8** | **100.0%** | |

---

## 4. Part-Level Disposition Distribution

Across all 40 affected parts:

| Disposition | Part Count | Percentage | Description |
|---|---|---|---|
| `ANCHOR_RECOVERED` | 35 | 87.5% | Clear, clinically justified declared stage anchor recovered without answer leakage |
| `BASELINE_BEFORE_FIRST_STAGE` / `NO_VALID_DECLARED_STAGE` | 5 | 12.5% | Part tests baseline/intake state; first declared stage is future data; no valid stage exists |
| `AMBIGUOUS_BOUNDARY` | 0 | 0.0% | Boundary between adjacent stages cannot be resolved clinically |
| `WOULD_CHANGE_ANSWER_CORRECTNESS` | 0 | 0.0% | Re-anchoring alters answer validity |
| `OTHER_BLOCKED` | 0 | 0.0% | Any other blocking condition |
| **Total** | **40** | **100.0%** | |

The 5 parts exhibiting `BASELINE_BEFORE_FIRST_STAGE`:
1. `opus2_case_code_status_q1` (queueIndex 1)
2. `gpt_case_gap_2026_06_11_adhf_matrix_01` (queueIndex 153)
3. `gpt_case_warfarin_mvr_2026_06_11_01_q1` (queueIndex 165)
4. `gpt_case_warfarin_mvr_2026_06_11_01_q2` (queueIndex 166)
5. `cs_thyroid_storm_q1` (queueIndex 369)

---

## 5. Baseline-Before-First-Stage Findings

The calibration surfaced a major structural pattern across the question bank:

### The Authoring Pattern:
Authors frequently structured unfolding case studies by placing the **initial clinical assessment, triage vitals, and admission labs into global exhibits** (`caseStudy.exhibits`). They then used `caseStudy.stages[]` strictly for subsequent updates:
- In `gpt_case_gap_2026_06_11_case_adhf_01`, `caseStudy.stages[]` contains only `adhf_stage2` ("Thirty minutes later") and `adhf_stage3` ("After initial treatment").
- In `opus2_case_code_status_01`, `stage_1` begins with the covering provider being paged and responding at 0800, while Q1 tests the immediate nursing response to the patient's verbal refusal upon admission at 0700.
- In `gpt_case_warfarin_mvr_2026_06_11_01`, `stage_1_1400` details the orders written by cardiology and the nursing actions taken regarding naproxen, while Q1 and Q2 test what the nurse should do during admission medication reconciliation.

### Why Existing Schema Cannot Represent This:
Under Schema 1.6:
- `part.answerableAfterStageId` must match an entry in `caseStudy.stages[].id`.
- If `part.answerableAfterStageId` is populated with the first declared stage, `src/examLayout.ts` `getVisibleCaseStages` returns `stages.slice(0, 1)`, immediately rendering that first stage.
- In `opus2_case_code_status_01`, `stage_1` literally states that the nurse documented capacity, recorded verbatim statements, and paged the provider—which is the exact correct answer to Q1!
- In `gpt_case_warfarin_mvr_2026_06_11_01`, `stage_1_1400` literally states that the nurse held warfarin and notified the provider of naproxen use, giving away Q1 and Q2!
- In `gpt_case_gap_2026_06_11_case_adhf_01`, revealing `adhf_stage2` gives the learner acute pulmonary edema data (pink frothy sputum) before they have analyzed the initial admission crackles and orthopnea!

**Conclusion:** These 5 items cannot be given an anchor from `caseStudy.stages[]` without corrupting the test construct. They represent an authentic **contract gap**: the absence of a formal representation for "answerable at baseline, with zero stages revealed."

---

## 6. Producer/Checker Agreement & Independence Status

Under `AGENTS.md` (*Delegation and Review Independence*) and `DECISIONS.md` P2/P5:
> "A producer/orchestrator's delegation tree cannot supply its own producer-independent checker under `DECISIONS.md` P2/P5; another model, a fresh context, or a separately spawned nominal reviewer does not establish independence. Delegated substantive judgment may contribute within the producing team without satisfying an external independence gate."

The commission charter explicitly directs:
> "If no eligible independent checker is available in this session, complete and freeze the producer side and stop before pretending independence exists."

### Status:
- The producer adjudications across all 8 parents were derived and locked into [`producer-adjudications.json`](producer-adjudications.json) and [`locked-producer-freeze.json`](locked-producer-freeze.json) with SHA-256:
  `73d36b6c5a0e937b2ca70e21fd2cdaaf4996b3dc5d79db312e075fac6837bb17`.
- No independent external checker was available within this single-model execution session.
- Simulating an independent check via a subagent was rejected as a violation of project governance.
- Independent checker evaluation remains **pending execution by an eligible external seat** (e.g. Claude or an uncoupled Codex session).

---

## 7. Forensic Case Analyses: Gate Breaches & Unrepresentability

### A. Stage-2 Gate-Breach Neutralization: Row 370 (`cs_thyroid_storm_main`)
- **Background:** In Phase E Stage 2, row 370 (`cs_thyroid_storm_q2`) breached the gate because the checker identified that under fail-open, `stage_1200` leaked the answer.
- **Forensic Finding:** Q2 asks the learner to order the administration of medications prescribed at 0830 (propranolol, PTU, Lugol's iodine, hydrocortisone). In `stage_1200`, the exhibit narrative states:
  *"The client has received IV fluids, propranolol, PTU, Lugol's iodine, and hydrocortisone as prescribed."*
  Under fail-open, `stage_1200` is visible, directly handing the learner the ordered-response answer.
- **Recovery:** When Q2 is anchored to `stage_0830`, `stage_1200` is hidden. The learner sees only the 0830 orders and must deduce the pharmacological sequence independently. The leak is 100% neutralized.

### B. Stage-2 Gate-Breach Neutralization: Row 395 (`opus_tpn_case_mucositis_01`)
- **Background:** Row 395 (`opus_tpn_case_mucositis_01_q3`) breached the gate when the checker identified that `stage_3` leaked the clinical intervention sequence.
- **Forensic Finding:** Q3 asks the nurse to sequence interventions when a PICC blood culture flags positive before a peripheral culture at Stage 2. In `stage_3`, the exhibit confirms CRBSI, removes the PICC, places a new line, and maintains glycemic control and TPN. Under fail-open, revealing `stage_3` gives away this exact sequence.
- **Recovery:** When Q3 is anchored to `stage_2`, `stage_3` is hidden. The leak is 100% neutralized.

### C. Structural Unrepresentability: The 6 Partially Affected ADHF Cases (`gpt-canonical`)
All 6 partially affected parents in `gpt-canonical` (`gpt_case_gap_2026_06_11_case_*`) follow the identical structure:
- `caseStudy.stages[]` contains only `_stage2` and `_stage3`.
- Parts 2, 3, and 4 already carry legacy `stageId` anchors pointing to `_stage2` or `_stage3`.
- Part 1 is a matrix assessing baseline admission triage.
- Part 1 has no anchor because the author had no stage to point to. Anchoring Part 1 to `_stage2` would display Stage 2 acute deterioration on Part 1, destroying the clinical progression.

### D. Clinically Justified Non-Monotonic Vector: `gpt_case_opus5_cdi_immunocompromised_01`
- Part 4 tests Stage 2 monitoring findings and anchors to `stage2`.
- Part 5 is an ordered-response item that explicitly asks: *"Place the nursing actions in the safest order for the initial response to the Stage 1 findings."*
- Semantically, Part 5 requires only Stage 1 data and can be answered immediately after `stage1`.
- Vector: `[ stage1, stage1, stage1, stage2, stage1, stage3 ]`.
- This proves the commission's premise: non-monotonic vectors exist and can be clinically legitimate when authors position retrospective or process-ordering items later in an item bank.

---

## 8. Analytical Assessment of 68-Parent Scaling

Scaling a manual or model-driven 68-parent semantic repair under the existing R3 mechanism is **not proportionate and not viable**.

1. **High rate of structural impossibility:** With 50% of sampled parents lacking a declared stage for baseline questions, any attempt to force stage IDs onto the remaining 60 parents will either:
   - Cause widespread new answer leakages by exposing future stages prematurely, or
   - Force arbitrary anchoring that violates unfolding exam realism.
2. **High cognitive friction:** Each case requires deep whole-case context reading (triage, labs, exhibits, narratives, stems, options). Attempting this across 68 parents (355 parts) without a schema that can represent baseline answerability is a recipe for churn and regression.

---

## 9. Sufficiency of the Existing Anchor Representation

**The existing anchor representation is NOT sufficient.**

`src/types.ts` defines `answerableAfterStageId?: string`.  
`src/schema.ts` and `findStageReferenceFindings` enforce that `answerableAfterStageId` must resolve to an existing `caseStudy.stages[].id`.  
`src/examLayout.ts` `getVisibleCaseStages` resolves by returning `stages.slice(0, stageIdx + 1)`.

This design has a fundamental architectural flaw:
- It assumes that the client's journey begins at `stages[0]`.
- But in NCLEX case studies, the journey almost always begins at **Baseline Admission** (before any stage update occurs).
- When authors put baseline data in `caseStudy.exhibits` and reserve `caseStudy.stages[]` for updates (Day 2, 30 minutes later, post-intervention), there is **no valid stage ID** to represent the state where *zero stages are revealed*.

---

## 10. Analytical Finding on the 96 Single-Stage Rows (Section 8)

Inspection of single-stage cases in `gemini-canonical` (e.g. `gemini_gap_case_hypertension_lifestyle_02`, `gemini_gap_case_palliative_care_03`) confirms:
- In `gemini_gap_case_hypertension_lifestyle_02`, the global exhibit is "Outpatient Progress Note (Baseline)", while its sole declared stage is "3-Month Follow-Up Note". Parts 1 and 2 test baseline DASH diet education.
- In `gemini_gap_case_palliative_care_03`, the global exhibit is "Hospice Admission Assessment", while its sole declared stage is "Nursing Progress Note (4 Hours Later)". Part 1 tests immediate dyspnea medication at admission.
- Structurally forcing `answerableAfterStageId` to the single declared stage (as R3 Tier 1 proposed) creates a false semantic record that baseline intake questions require 3-month or 4-hour follow-up data.

---

## 11. Recommended Owner Next Step

### Recommendation:
1. **Formally retire and supersede the parked R3 repair work order.** Its premise that anchor repair is a purely additive data-entry task without schema changes is disproven.
2. **Do not launch a large-scale 68-parent repair under Schema 1.6.**
3. **Commission a targeted Schema / Renderer enhancement (Schema 1.7 candidate):**
   - Permit `answerableAfterStageId: null` or `"baseline"` to explicitly represent: *"Answerable at baseline; zero declared stages revealed; global exhibits only."*
   - Update `getVisibleCaseStages` in `src/examLayout.ts` so that `answerableAfterStageId === null` or `"baseline"` returns `[]` (empty stages array, revealing only global exhibits).
   - Update `findStageReferenceFindings` in `scripts/audit/audit-stage-refs.ts` to recognize `null` / `"baseline"` as a valid, non-leaking resolving anchor.
4. Once that baseline contract gap is closed in the schema and renderer, all baseline items (including the 5 identified here and the 6 partially affected GPT parents) can be cleanly, deterministically, and safely resolved without answer leakage.

---

## 12. Pre-existing Repository Preservation Check

`git status --short` was verified before and after this commission. No pre-existing bank, source, script, schema, ledger, census, or history file was modified. All outputs were written exclusively to `audit/campaign-16-phase-e-anchor-parent-calibration-2026-09-08-r1/`.

```
No bank mutation.
No patch generation.
No ledger entry.
No census regeneration.
No R3 execution.
No residual-192 semantic census.
```
