# Batch 14 Remainder — Independent Claude Review Handoff

Date: 2026-07-12
Status: six bounded candidates staged in one review PR; no canonical write
Producer seat: Codex
Required checker seat: independent Claude/Sonnet

## Scope and lineage

These six candidates cover all ten actionable Batch 14 refs remaining after Candidate 14A:

| Candidate | Refs | Risk surface | Gate |
|---|---:|---|---:|
| `14B` | 1 | TACO/TRALI resolution Rule F boundary | 0 FAIL / 1 WARN |
| `14C-SVC` | 2 | SaO2/SpO2 analyte identity | 0 FAIL / 2 WARN |
| `14D-VARICEAL` | 3 | multi-stage Rule F chronology | 0 FAIL / 4 WARN |
| `14E-RESUSCITATION` | 2 | burn/PPH Rule F and authored time labels | 0 FAIL / 2 WARN |
| `14F-WARFARIN` | 1 | failed reversal chronology and authored 0600/0645 labels | 0 FAIL / 0 WARN |
| `14G-UNITLESS` | 1 | closed inferred-unit policy and visible omissions | 0 FAIL / 7 WARN |

Files are named
`EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-14{B,C-SVC,D-VARICEAL,E-RESUSCITATION,F-WARFARIN,G-UNITLESS}-2026-07-12.json`.
Candidate 14B retains its focused comparison and independent-review handoff alongside the combined
Batch 14 remainder handoff.
The deterministic field comparison against
`EXHIBIT-FLOWSHEET-MIGRATION-BATCH-14-scattered-2026-07-06.json` is
`EXHIBIT-FLOWSHEET-BATCH-14-REMAINDER-COMPARISON-2026-07-12.json`.

Six other unpromoted Batch 14 refs are intentionally non-rendering: three `skip_serial`, two empty
narrative extracts, and the warfarin admission exclusion-only record that fails current
`prior_no_current`. Failed Batch 19 is unrelated and remains excluded.

## Candidate 14B — TACO/TRALI resolution

The focused handoff
`EXHIBIT-FLOWSHEET-CODEX-TO-CLAUDECODE-CANDIDATE-14B-2026-07-12.md` enumerates the seven values,
single advisory WARN, and measurement-by-measurement Rule F disposition. It is part of this same
review PR; there is no separate competing history patch.

## Candidate 14C — SVC syndrome

Current identity rules add source-explicit ABG `sao2=94%` at baseline and `sao2=90%` at hour 12.
Pulse-ox `spo2` remains separately keyed in the vitals panel. Neither record carries Rule F tags:
baseline has no reassessment, and unchanged background oxygen at 2 L is not a new directed
intervention framing the worsening hour-12 measurements.

WARNs, one per ref: source writes `HR 92/min` / `HR 110/min`; staging uses the established implicit
vital unit `bpm`, producing the visible `/min`→`bpm` prose-normalization advisory.

Dry-run labels: baseline `Current`; stage 2 `Hour 12`. Both are source-supported.

## Candidate 14D — variceal hemorrhage

| Ref | Tagged | Untagged rationale |
|---|---|---|
| `stage1_update` | `hr`, `sbp`, `dbp`, `lactate` | `hemoglobin` is measured after the fluid bolus but the bolus targets perfusion; PRBC is ordered afterward. |
| `stage2_update` | `hr`, `sbp`, `dbp`, `rr`, `spo2`, `hemoglobin`, `lactate`, `creatinine` | `inr`, `platelets`, and `ammonia` have no preceding intervention directed at their domains. |
| `stage3_update` | `hr`, `sbp`, `dbp`, `rr`, `spo2`, `hemoglobin`, `creatinine`, `lactate` | `temp` is not targeted by prior bleeding/respiratory interventions; `ammonia` precedes new lactulose/rifaximin orders. |

Stage 2 follows EGD banding/source control, PRBC transfusion, resuscitation, airway protection, and
oxygen. Stage 3 remains chronologically after those directed interventions; stable Hgb/no further
hematemesis and room-air oxygenation are explicit outcome statements.

WARNs: each ref inherits an unscoped pediatric-marker false positive from `grade II esophageal
varices 18 months ago`; this is elapsed history, not client age. Stage 3 also WARNs for `WBC 620
cells/µL`; that is ascitic-fluid WBC from paracentesis, not a blood CBC result, so it remains
prose-only and unexcluded. All three dry-run columns infer `Current`.

## Candidate 14E — burn and postpartum resuscitation

### Burn `stage3_course`

The candidate explicitly authors a `1600` vitals column and separately evidenced `Current` labs
column, preventing the untimed labs from inheriting the earlier 1600 timestamp.

- Tagged: `hr`, `sbp`, `dbp`, `creatinine`, `hematocrit` — reassessments of hemodynamic,
  renal-perfusion, and volume domains targeted by titrated LR resuscitation.
- Untagged: `sodium`, `potassium` — no electrolyte-directed intervention precedes them.
- WARN: source `HR 100/min` is stored under accepted implicit vital unit `bpm`.

### PPH `stage_2_update`

- Tagged: `hr`, `sbp`, `dbp` — hemodynamic reassessment after massage, increased oxytocin, and
  wide-open warmed LR.
- Untagged: `rr`, `spo2` — no preceding respiratory/oxygen intervention. All five stat laboratory
  values are untagged because PRBC/TXA and additional uterotonics are only ordered afterward.
- WARN: pediatric detector sees the patient's `4.2 kg infant`; the subject is the postpartum G5P5
  client, not the infant.

PPH dry-run label is `Current`.

## Candidate 14F — warfarin deterioration

The candidate explicitly authors source-evidenced `0600` vitals and `0645` labs columns. Without
them, the legacy heuristic labels both panels `0500` from the earlier urine event.

- Tagged after held warfarin, oral vitamin K, and continuing IV normal saline: `hr`, `sbp`, `dbp`,
  `inr`, `hemoglobin`, `hematocrit`, `bun`, `creatinine`, and `lactate`.
- Untagged: `temp`, `rr`, `spo2`, and `platelets`; no directed intervention targets those domains.

This record gates with no findings. Worsening does not negate Rule F: the tag records a directed
post-intervention reassessment, not a successful response.

## Candidate 14G — unsafe premature discharge unitless panel

Current closed inference policy permits adding only `bun=38 mg/dL` and `glucose=142 mg/dL` from the
unitless source panel. Explicit-unit current `creatinine=1.8 mg/dL`, `BNP=680 pg/mL`, and ratio
`INR=1.0` remain keyed; four valid same-key prior creatinine/BNP comparisons remain excluded.

These unitless values remain visible and deliberately unkeyed because their keys have no ratified
`inferredUnit`: sodium 138, potassium 3.4, chloride 96, bicarbonate 30, Hgb 11.4, WBC 7.2,
platelets 210, and Mg 1.7. Albumin 3.0 is off-allowlist.

The gate emits seven unitless-numeric WARNs for sodium, potassium, chloride, bicarbonate, WBC,
hemoglobin, and platelets. **Gate blind spot:** it does not recognize abbreviation `Mg`, so
magnesium 1.7 produces no advisory even though it remains prose-only under the same no-inference
rule. BUN/glucose are ratified inferred units; their enclosing span contains other explicit
`mg/dL` tokens, so the span-wide unit check emits no inference advisory. Review both directly.

Rule F tags `hr`, `sbp`, `dbp`, `rr`, `spo2`, `bun`, `creatinine`, and `bnp` after four days of
directed heart-failure diuresis/hemodynamic and congestion management. Temperature, glucose, and INR
remain untagged. The source title supports the dry-run `07:15` column label.

## Applicator dry-runs and requested verdict

All ten refs validated as supplements with no `--write`; routing is six refs to
`gpt-canonical.json` and four to `hard-cases-canonical.json`. Canonical previews were inspected for
panel splits, contexts, and labels.

Return a separate PASS or BLOCK for each candidate after independently re-deriving every value,
WARN, Rule F tag, omission/exclusion, analyte identity, and column label. A disputed Rule F tag,
unit inference, or column label blocks only its bounded candidate. No canonical bank, census,
bank-review ledger, or flowsheet migration-ledger write is authorized in this review.
