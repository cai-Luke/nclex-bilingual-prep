# Campaign 16 Phase E — Locked Vector Comparison & Independence Attestation

Date: 2026-09-08  
Commission: Whole-Parent Stage Anchor Calibration Commission  
Artifact root: `audit/campaign-16-phase-e-anchor-parent-calibration-2026-09-08-r1/`

---

## 1. Producer Freeze Attestation

In accordance with Section 5 of the commission charter, the producer has independently derived and frozen the complete anchor vectors for all 8 sampled parent cases without reference to any checker output.

- **Producer Seat:** Gemini 3.8 Flash (High) — Primary Coding & Analysis Seat
- **Frozen Artifact:** `audit/campaign-16-phase-e-anchor-parent-calibration-2026-09-08-r1/producer-adjudications.json`
- **Locked SHA-256:** `73d36b6c5a0e937b2ca70e21fd2cdaaf4996b3dc5d79db312e075fac6837bb17`
- **Total Parents Adjudicated:** 8
- **Total Affected Parts Adjudicated:** 40

### Frozen Producer Vectors:

| Sample # | Bank | Parent Case ID | Stages | Affected Parts | Frozen Producer Vector | Producer Recoverability |
|---|---|---|---|---|---|---|
| **1** | `claude-canonical` | `opus2_case_code_status_01` | 3 | 5 | `[ BASELINE_BEFORE_FIRST_STAGE, stage_1, stage_2, stage_3, stage_3 ]` | `STRUCTURALLY_UNREPRESENTABLE_BASELINE_GAP` |
| **2** | `claude-canonical` | `opus_vanco_case_01` | 3 | 6 | `[ stage_1_infusion_reaction, stage_1_infusion_reaction, stage_2_trough_monitoring, stage_2_trough_monitoring, stage_3_aki_tinnitus, stage_3_aki_tinnitus ]` | `FULLY_RECOVERABLE` |
| **3** | `gemini-canonical` | `opus_agvd_case_agvhd_01` | 3 | 6 | `[ stage_1, stage_1, stage_2, stage_2, stage_2, stage_3 ]` | `FULLY_RECOVERABLE` |
| **4** | `gpt-canonical` | `gpt_case_gap_2026_06_11_case_adhf_01` | 2 | 1 | `[ BASELINE_BEFORE_FIRST_STAGE, adhf_stage2*, adhf_stage2*, adhf_stage3* ]` *(Part 1 is the sole affected row; Parts 2-4 are existing sibling anchors)* | `STRUCTURALLY_UNREPRESENTABLE_BASELINE_GAP` |
| **5** | `gpt-canonical` | `gpt_case_opus5_cdi_immunocompromised_01` | 3 | 6 | `[ stage1, stage1, stage1, stage2, stage1, stage3 ]` | `FULLY_RECOVERABLE` |
| **6** | `gpt-canonical` | `gpt_case_warfarin_mvr_2026_06_11_01` | 4 | 6 | `[ BASELINE_BEFORE_FIRST_STAGE, BASELINE_BEFORE_FIRST_STAGE, stage_1_1400, stage_3_0645, stage_3_1200, stage_3_1200 ]` | `STRUCTURALLY_UNREPRESENTABLE_BASELINE_GAP` |
| **7** | `hard-cases-canonical` | `cs_thyroid_storm_main` | 2 | 4 | `[ BASELINE_BEFORE_FIRST_STAGE, stage_0830, stage_0830, stage_1200 ]` | `STRUCTURALLY_UNREPRESENTABLE_BASELINE_GAP` |
| **8** | `hard-cases-canonical` | `opus_tpn_case_mucositis_01` | 3 | 6 | `[ stage_1, stage_1, stage_2, stage_2, stage_3, stage_3 ]` | `FULLY_RECOVERABLE` |

---

## 2. Independent Checker Governance Boundary

Section 5 of the commission mandates:
> "The calibration needs genuine producer != checker independence.  
> ... Use an eligible independent semantic seat under current live governance. If no eligible independent checker is available in this session, complete and freeze the producer side and stop before pretending independence exists."

Under `AGENTS.md` (*Delegation and Review Independence*) and `DECISIONS.md` P2/P5:
> "A producer/orchestrator's delegation tree cannot supply its own producer-independent checker under `DECISIONS.md` P2/P5; another model, a fresh context, or a separately spawned nominal reviewer does not establish independence. Delegated substantive judgment may contribute within the producing team without satisfying an external independence gate."

### Attestation:
1. The current session is executed by a single primary agent seat (Gemini).
2. No separate, external, authorized semantic checker seat (e.g., Claude or an independent Codex seat operating in an uncoupled execution session) was attached or reachable under live platform constraints.
3. In strict compliance with `AGENTS.md` and the commission instructions, this seat **refuses to manufacture simulated independence** by spawning a subagent or evaluating its own work under a different persona.
4. The producer adjudications are complete, fully derived, and cryptographically frozen above.
5. Independent checker comparison remains **pending execution by an eligible external seat**.

---

## 3. Pre-Comparison Summary & Standalone Producer Findings

Even prior to checker comparison, the producer calibration establishes load-bearing architectural findings:

1. **4 of the 8 sampled parents (50%)** exhibit `BASELINE_BEFORE_FIRST_STAGE` / `NO_VALID_DECLARED_STAGE` on at least one part (`opus2_case_code_status_01`, `gpt_case_gap_2026_06_11_case_adhf_01`, `gpt_case_warfarin_mvr_2026_06_11_01`, `cs_thyroid_storm_main`).
2. In all 4 of these parents, the initial questions assess the baseline admission/triage state, while the first declared stage in `caseStudy.stages[]` represents future clinical progression (provider orders, acute deterioration, or interventions).
3. Revealing that first stage to a learner answering a baseline question either explicitly leaks the correct nursing action (e.g. `opus2_case_code_status_01` Q1, `gpt_case_warfarin_mvr_2026_06_11_01` Q1-Q2) or exposes subsequent clinical deterioration prematurely (e.g. `gpt_case_gap_2026_06_11_case_adhf_01` Q1).
4. Because the current schema strictly requires `answerableAfterStageId` to match one of `caseStudy.stages[].id`, these baseline items are **structurally unrepresentable** under the existing contract without either corrupting the clinical timeline or leaking answers.
5. This fulfills the trigger condition for:
   `CAMPAIGN16_ANCHOR_CALIBRATION_BASELINE_CONTRACT_GAP`
