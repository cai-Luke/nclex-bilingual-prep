# IV-Fluid Calculation Category Audit

Status: **current-HEAD review complete; metadata migration held for one topic-vocabulary architecture decision**

Git SHA audited: `1a483807e5ea475dd65868680117965903ec3e0f`

Authority: `docs/source-records/NCSBN-2026-NCLEX-RN-TEST-PLAN.md`, especially the verified Appendix A pointers to **Dosage Calculations** (medication administration, p. 39) and **Parenteral/Intravenous Therapies** (mathematics and nursing procedures for IV therapy, p. 40). The Burn Management ruling in `TOPIC-VOCABULARY-DECISIONS.md` supplies the already-ratified project precedent: calculating prescribed non-medication parenteral therapy is Pharmacological and Parenteral Therapies; the disease context does not control the category.

The referenced `IV-FLUID-CALCULATION-CATEGORY-AUDIT-HANDOFF.md` does not exist in repository history. That missing proposed handoff did not block the audit because the active source record, current banks, and ratified Burn boundary contain the necessary classification contract. It does block inventing an unreviewed replacement topic name.

## Scope and method

Burn Management is closed and excluded from this collateral pass. Candidate discovery recursively inspected standalone questions and embedded case leaves for non-medication IV fluid volume, rate, duration, remaining-volume, and prescribed weight-based fluid arithmetic. Every candidate was then read semantically; keyword matches involving medication infusions, enteral feeding, intake/output totals, urine-output thresholds, or management decisions were not silently treated as IV-fluid calculations.

Ten records required a written disposition: nine prescribed-IV arithmetic items and one nearby fluid-balance item carrying the medication-scoped `Dosage Calculations` topic. No stem, key, rationale, category, or topic was changed in this audit.

## Findings

| ID | Bank | Current category | Current topic | Finding | Required metadata direction |
|---|---|---|---|---|---|
| `claude_a_fib_iv_drip_rate_25` | claude-canonical.json | Pharmacological and Parenteral Therapies | Dosage Calculations | Non-medication LR manual drip-rate arithmetic | Keep category; move to the new non-medication IV-therapy calculation topic once named |
| `dev_infusion_duration_vtbi_01` | device-canonical.json | Pharmacological and Parenteral Therapies | Dosage Calculations | Generic IV pump VTBI/rate duration arithmetic; no medication dose | Keep category; move to the new non-medication IV-therapy calculation topic once named |
| `gap_50_ppt_10` | gemini-canonical.json | Pharmacological and Parenteral Therapies | Dosage Calculations | Non-medication normal-saline manual drip-rate arithmetic | Keep category; move to the new non-medication IV-therapy calculation topic once named |
| `gemini_p6_iv_01` | gemini-canonical.json | Pharmacological and Parenteral Therapies | Dosage Calculations | Non-medication saline pump-rate arithmetic | Keep category; move to the new non-medication IV-therapy calculation topic once named |
| `gemini_p6_iv_02` | gemini-canonical.json | Pharmacological and Parenteral Therapies | Dosage Calculations | Non-medication LR manual drip-rate arithmetic | Keep category; move to the new non-medication IV-therapy calculation topic once named |
| `gemini_p6_iv_03` | gemini-canonical.json | Pharmacological and Parenteral Therapies | Dosage Calculations | Remaining-volume arithmetic for a generic IV infusion | Keep category; move to the new non-medication IV-therapy calculation topic once named |
| `gemini_jun05_b_fib_pediatric_04` | gemini-canonical.json | Reduction of Risk Potential | Pediatric & Adolescent Health | Computes a prescribed maintenance-IV-fluid requirement; the key is parenteral-therapy mathematics | Retag category to Pharmacological and Parenteral Therapies; move to the new topic |
| `gpt_2026_07_03_2114_t1_06_dka_fluid_fib` | gpt-canonical.json | Physiological Adaptation | Diabetic Ketoacidosis (DKA) | Applies a supplied DKA order-set coefficient to compute first-hour prescribed IV fluid | Retag category to Pharmacological and Parenteral Therapies; move to the new topic |
| `sepsis_pneumonia_fluid_calc` | hard-cases-canonical.json | Physiological Adaptation | Sepsis & Septic Shock | Embedded leaf computes the prescribed LR bolus from a supplied mL/kg order | Retag category to Pharmacological and Parenteral Therapies; move to the new topic; do not inherit the case container's category |
| `gemini_jun05_b_fib_fluid_03` | gemini-canonical.json | Physiological Adaptation | Dosage Calculations | Not prescribed-IV arithmetic: it totals intake and output to compute net fluid balance | Remove from `Dosage Calculations`; separately adjudicate the monitoring construct between the existing fluid-support/risk-potential lanes |

## Reconciliation

- Prescribed non-medication IV-therapy arithmetic: **9**
- Category already correct, topic wrong: **6**
- Category and topic both require correction: **3**
- Adjacent non-IV fluid-balance topic residual: **1**
- Total reviewed rows: **10**

The nine-item IV set is internally consistent under the ratified keyed-activity rule. The only remaining judgment inside the ten-row review is the final category/topic home for the separate net-fluid-balance item.

## Architecture decision required before implementation

The project has no canonical topic that accurately names non-medication Parenteral/Intravenous Therapies mathematics under Pharmacological and Parenteral Therapies. `Dosage Calculations` is medication-scoped at the active authority, and widening it would erase the exact boundary this audit was commissioned to repair. `Nutritional & Fluid Support` is a Basic Care and Comfort topic and would also misstate the keyed construct.

Recommended architecture: add a new STRICT Pharmacological and Parenteral Therapies topic named **`IV Therapy Calculations`** (or an architect-approved equivalent), route the nine rows above to it, and retain medication dose/rate calculations under `Dosage Calculations`. The name and durable boundary need a short taxonomy ruling before any canonical-bank migration.

Until that ruling exists, no safe canonical patch can be complete: category-only edits would immediately create topic-license mismatches, while topic-only edits would preserve three known category errors.
