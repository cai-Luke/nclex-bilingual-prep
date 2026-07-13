# Batch 18 — Independent Claude Review Handoff

Date: 2026-07-13
Status: two bounded candidates staged; no canonical write
Producer seat: Codex
Required checker seat: independent Claude/Sonnet

## Live-main reconciliation

All six Batch 18 refs resolve exactly once on current `main`; none is already promoted. Four
actionable refs are staged once across 18A/18B. Two records remain intentionally non-rendering:

- `opus_vanco_case_01/background_orders`: history/orders only. Its old prior-only creatinine 1.6
  exclusion is invalid under `prior_no_current`; the chronic baseline remains intact in prose.
- `opus2_case_postop_opioid_respiratory_depression_01/background_orders`: history, orders, and clock
  times only, with no current vital/lab result.

Failed Batch 19 is unrelated and excluded. The deterministic field delta is recorded in
`EXHIBIT-FLOWSHEET-BATCH-18-COMPARISON-2026-07-13.json`.

| Candidate | Refs | Banks | Gate |
|---|---:|---|---:|
| `18A-LABS` | 2 | Gemini + hard cases | 0 FAIL / 3 WARN |
| `18B-RESPONSE` | 2 | hard cases + Claude | 0 FAIL / 0 WARN |

## 18A — laboratory identity and population

`gemini_gap_case_pyloric_stenosis_01/ex2_labs` now authors `population: "peds_infant"` from the
case's explicit 6-week-old client. “Carbon Dioxide (HCO3): 34 mEq/L” remains chemistry
`bicarbonate`, not `hco3_abg`: the exhibit is titled “Serum Chemistries,” groups the value with
Na/K/Cl, and contains no arterial/ABG context. pH remains separately keyed. No Rule F tags occur.

WARNs:

1. Pyloric R9 case-context advisory: the pediatric age is in the case summary rather than local
   exhibit text; authored `peds_infant` is truthful and independently source-supported.
2. Pyloric HCO3/ABG synonym advisory: verified serum chemistry identity as above.
3. Celiac R9 advisory: “six months” is symptom duration in the case summary, not age; the client is
   explicitly 28 and adult/default population is correct.

Both dry-run columns are `Current`.

## 18B — treatment-response boundary

Burn `stage1_course` retains the SpO2 `post_intervention` tag: the same record places the client on
100% NRB oxygen and subsequently reports SpO2 94% on that device. An explicit source-evidenced
`Current` column prevents unrelated fire/intubation clock times (0600/0640/0725) from becoming the
measurement label.

C. difficile `exhibit_stage3` removes all eleven inherited Rule F tags. Under the 2026-07-13
no-carry-forward ruling, a later record must connect its own measurements to the earlier
intervention; this record merely presents repeat labs/vitals and recovery findings. The only explicit
cross-stage causal sentence concerns barrier cream and an unkeyed wound finding. Prior treatment
chronology or clinical plausibility does not tag the displayed cluster.

Both refs gate clean and dry-run as supplements; the C. difficile column is `Current`.

## Verification and requested verdict

Both candidates independently gate at 0 FAIL and applicator dry-run validates all four refs without
`--write`. Return PASS/BLOCK separately for 18A and 18B after re-deriving every value, WARN,
population, analyte identity, Rule F tag, omission, and column label. No canonical bank, bank-review
ledger, migration ledger, or census write is authorized in this PR.
