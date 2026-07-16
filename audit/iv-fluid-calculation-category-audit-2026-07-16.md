# IV-Fluid Calculation Category Audit

Status: **architect-ratified and implemented**

Authority: `docs/source-records/NCSBN-2026-NCLEX-RN-TEST-PLAN.md`, especially the verified Appendix A pointers to **Dosage Calculations** (medication administration, p. 39) and **Parenteral/Intravenous Therapies** (mathematics and nursing procedures for IV therapy, p. 40). The binding taxonomy is recorded in `TOPIC-VOCABULARY-DECISIONS.md`.

## Scope and method

Burn Management remained closed and was excluded from this collateral pass. Candidate discovery recursively inspected standalone questions and embedded case leaves for non-medication IV-fluid volume, rate, duration, remaining-volume, and prescribed weight-based fluid arithmetic. Every candidate was then read semantically; medication infusions, enteral feeding, intake/output totals, urine-output thresholds, and management decisions were not silently treated as IV-fluid calculations.

The architect ratified the exact canonical topic `IV Fluid Calculations`, its STRICT Pharmacological and Parenteral Therapies license, and the nine-item execution manifest. The migration changed metadata only; stems, keys, and rationales were not changed.

## Executed manifest

| ID | Bank | Previous category | Previous topic | Finding | Executed disposition |
|---|---|---|---|---|---|
| `claude_a_fib_iv_drip_rate_25` | claude-canonical.json | Pharmacological and Parenteral Therapies | Dosage Calculations | Non-medication LR manual drip-rate arithmetic | Topic changed to `IV Fluid Calculations` |
| `dev_infusion_duration_vtbi_01` | device-canonical.json | Pharmacological and Parenteral Therapies | Dosage Calculations | Generic IV pump VTBI/rate duration arithmetic; no medication dose | Topic changed to `IV Fluid Calculations` |
| `gap_50_ppt_10` | gemini-canonical.json | Pharmacological and Parenteral Therapies | Dosage Calculations | Non-medication normal-saline manual drip-rate arithmetic | Topic changed to `IV Fluid Calculations` |
| `gemini_p6_iv_01` | gemini-canonical.json | Pharmacological and Parenteral Therapies | Dosage Calculations | Non-medication saline pump-rate arithmetic | Topic changed to `IV Fluid Calculations` |
| `gemini_p6_iv_02` | gemini-canonical.json | Pharmacological and Parenteral Therapies | Dosage Calculations | Non-medication LR manual drip-rate arithmetic | Topic changed to `IV Fluid Calculations` |
| `gemini_p6_iv_03` | gemini-canonical.json | Pharmacological and Parenteral Therapies | Dosage Calculations | Remaining-volume arithmetic for a generic IV infusion | Topic changed to `IV Fluid Calculations` |
| `gemini_jun05_b_fib_pediatric_04` | gemini-canonical.json | Reduction of Risk Potential | Pediatric & Adolescent Health | Computes a prescribed maintenance-IV-fluid requirement | Category changed to Pharmacological and Parenteral Therapies; topic changed to `IV Fluid Calculations` |
| `gpt_2026_07_03_2114_t1_06_dka_fluid_fib` | gpt-canonical.json | Physiological Adaptation | Diabetic Ketoacidosis (DKA) | Computes first-hour prescribed IV fluid from a supplied coefficient | Category changed to Pharmacological and Parenteral Therapies; topic changed to `IV Fluid Calculations` |
| `sepsis_pneumonia_fluid_calc` | hard-cases-canonical.json | Physiological Adaptation | Sepsis & Septic Shock | Embedded leaf computes a prescribed LR bolus from a supplied mL/kg order | Category changed to Pharmacological and Parenteral Therapies; topic changed to `IV Fluid Calculations` |

## Separate fluid-balance residual

`gemini_jun05_b_fib_fluid_03` is not part of the nine-item migration. It totals intake and output to compute net fluid balance; the AKI context is not load-bearing. It moved from Physiological Adaptation / `Dosage Calculations` to Basic Care and Comfort / `Nutritional & Fluid Support`.

## Reconciliation

- Prescribed non-medication IV-fluid arithmetic: **9**
- Category already correct, topic corrected: **6**
- Category and topic corrected: **3**
- Separate net-fluid-balance residual: **1**
- Total reviewed rows: **10**

`IV Fluid Calculations` is reserved for prescribed non-medication IV-fluid arithmetic. `Dosage Calculations` remains medication-only. Stable clinical rollups retain their domain routes, and the mere presence of an IV does not route administration or safety content into the arithmetic topic.
