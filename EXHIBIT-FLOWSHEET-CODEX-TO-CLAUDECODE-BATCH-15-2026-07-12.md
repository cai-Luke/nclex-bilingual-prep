# Batch 15 — Independent Claude Review Handoff

Date: 2026-07-12
Status: five bounded candidates staged; no canonical write
Producer seat: Codex
Required checker seat: independent Claude/Sonnet

## Live-main reconciliation

The authoritative Batch 15 source is
`EXHIBIT-FLOWSHEET-MIGRATION-BATCH-15-scattered-2026-07-06.json`. All 20 refs resolve exactly once
against live `main`; none already carries canonical `structuredMeasurements`. Seventeen actionable
extract records are staged exactly once across Candidates 15A–15E. Three records remain deliberately
non-rendering `skip_serial` dispositions:

- `gpt_stroke_2026_06_16_case_acute_ischemic_stroke_warfarin_01/baseline_assessment`: initial BP
  188/104 and repeat manual BP 186/102 are distinct current readings.
- `opus_case_se_01/exhibit_baseline`: fingerstick glucose 142 and lab glucose 148 are distinct current
  readings.
- `opus_case_se_01/exhibit_stage_1`: post-oxygen SpO2 92% and repeat-vitals SpO2 93% are distinct
  current readings.

The current gate's serial heuristic does not re-confirm those three shapes and WARNs on the original
batch, but the source distinctions remain explicit. They are excluded from promotion inputs rather
than converted into ambiguous single-column tables. Failed Batch 19 is unrelated and excluded.

| Candidate | Refs | Bank | Gate |
|---|---:|---|---:|
| `15A-PPH-STROKE` | 4 | `hard-cases-canonical.json` | 0 FAIL / 4 WARN |
| `15B-AGVHD` | 5 | `gemini-canonical.json` | 0 FAIL / 7 WARN |
| `15C-CAR-T` | 4 | `hard-cases-canonical.json` | 0 FAIL / 0 WARN |
| `15D-LITHIUM` | 2 | `claude-canonical.json` | 0 FAIL / 1 WARN |
| `15E-STATUS-EPILEPTICUS` | 2 | `hard-cases-canonical.json` | 0 FAIL / 2 WARN |

The exact deterministic delta from the 2026-07-06 artifact is recorded in
`EXHIBIT-FLOWSHEET-BATCH-15-COMPARISON-2026-07-12.json`.

## 15A — PPH and stroke

Rule F was narrowed measurement by measurement:

- PPH Stage 3: `hr`/`sbp`/`dbp` and `hemoglobin`/`hematocrit` remain tagged after uterine source
  control, TXA, resuscitation, and the plateau in active blood loss. `rr`/`spo2` are untagged because
  the source only co-locates the current oxygen setting; `platelets`/`inr`/`ptt` are untagged because
  no preceding intervention directly targets those measurements.
- Stroke team update: no tags; the values precede the new thrombectomy workup.
- Post-thrombectomy neuro-ICU arrival: only `sbp`/`dbp` remain tagged, after source-explicit
  nicardipine titration. Thrombectomy does not make the entire vital cluster post-intervention.
- ICH management: no tags; INR/Hgb/platelets are drawn before vitamin K/PCC are ordered.

WARN inventory:

1. `gpt_pph_2026_06_16_case_01/stage_3_update` — R9 pediatric marker is the 4.2 kg infant, not the
   postpartum client.
2. `.../stage_3_post_procedure_baseline` — source HR uses `/min`; staging uses accepted `bpm`.
3. `.../stage_4_ich_management` — blood-pressure mention is the future SBP <140 order, not a current
   resulted BP.
4. The same Stage 4 ref — `potassium` is a false lexical hit on “vitamin K 10 mg,” not a potassium
   result.

All four dry-run columns are `Current`.

## 15B — acute GVHD

Baseline labs, baseline presentation, and Stage 1 carry no Rule F tags. Stage 2 occurs after
methylprednisolone and initiated LR: `hr`/`sbp`/`dbp` plus `creatinine`/`bun` are volume/perfusion
reassessments, and `total_bilirubin`/`alt`/`ast` reassess steroid-treated hepatic GVHD. Temperature,
respiratory rows, electrolytes, glucose, and hemoglobin are untagged; their directed replacement,
insulin, and transfusion orders occur only after the displayed measurements.

Stage 3 is explicitly 48 hours after ruxolitinib and after Stage-2 fluids, K/Mg replacement, insulin,
and PRBC. Tagged rows are `temp`, `hr`/`sbp`/`dbp`, `potassium`, `magnesium`, `total_bilirubin`, `alt`,
`creatinine`, `bun`, `glucose`, and `hemoglobin`. `rr`/`spo2` remain untagged because there was no
respiratory/oxygen intervention.

WARN inventory:

1. `exhibit_labs_01` — “lactate” matches lactate dehydrogenase, not serum lactate.
2. `exhibit_presentation_01` — HR `beats/min` → staged `bpm`.
3. `exhibit_stage1_01` — HR `beats/min` → staged `bpm`.
4. `exhibit_stage1_01` — bilirubin 2.0–3.0 mg/dL is a disease-staging criterion, not a patient result.
5. `exhibit_stage2_01` — HR `beats/min` → staged `bpm`.
6. `exhibit_stage2_01` — chloride hit comes from the later potassium-chloride order, not a chloride
   result.
7. `exhibit_stage3_01` — HR `beats/min` → staged `bpm`.

All five dry-run columns are `Current`.

## 15C — CAR-T / CRS

The first three records carry no Rule F tags. In `ex6`, tocilizumab, dexamethasone, fluid boluses,
and oxygen support explicitly precede reassessment. Temperature, hemodynamics, respiratory rows,
creatinine, AST, and ALT remain tagged; potassium is untagged because no directed potassium
intervention precedes the value. The valid same-key trend exclusions in `ex6` remain single-column
staging, not explicit multi-column data.

The gate is clean. Dry-run labels are `1000`, `Current`, `Current`, and `Current`. `ex4` requires
source-evidenced explicit `Current` columns for both panel kinds: the legacy heuristic otherwise
mislabels the later deterioration vitals and stat labs as `1600` from the historical sentence “felt
fine at the 1600 assessment.” No inferred label is used for that explicit record.

## 15D — lithium toxicity

Admission is untagged. At 1200, sodium, creatinine, and BUN remain tagged after aggressive normal
saline hydration and renal-clearance management. Potassium is untagged because replacement is
ordered only after the displayed lab value.

WARN: `opus_case_lithium_toxicity_01/exhibit_stage2` matches `chloride` only inside the later
potassium-chloride order. Dry-run labels are `0800` and `1200`. The admission baseline creatinine
0.9 remains a valid same-key `prior` exclusion beside current creatinine 1.9.

## 15E — status epilepticus

Stage 2 measurements precede RSI/intubation/midazolam and are untagged. Stage 3 follows cooling,
intubation/mechanical ventilation, seizure termination, and increased isotonic fluids. Tagged rows:
temperature; RR/SpO2; lactate; creatinine; and the ABG pH/PaCO2/PaO2/HCO3 cluster. HR/BP are untagged
because stabilization alone does not establish a directed hemodynamic intervention; potassium is
untagged because monitoring/etiology is not treatment directed at that value.

WARNs: both `exhibit_stage_2` and `exhibit_stage_3` trigger the BMP-bicarbonate synonym advisory;
each source value is explicitly ABG bicarbonate and is correctly keyed as `hco3_abg`. Both dry-run
columns are `Current`.

## Verification and requested verdict

Each candidate independently gates at 0 FAIL and applicator dry-run validates every selected ref as
a supplement without `--write`. Review the five candidates independently and return PASS/BLOCK per
candidate after re-deriving every value, WARN, omission/exclusion, Rule F tag, and column label. A
dispute blocks only its bounded candidate. No canonical bank, bank-review ledger, migration ledger,
or census write is authorized in this PR.
