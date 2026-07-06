# Exhibit Flowsheet Migration Batch 16 Adjudication Queue

Date: 2026-07-06
Bucket: `scattered`
Manifest slice: next 20 uncovered refreshed-`scattered` refs after Batch 15, using
`EXHIBIT-FLOWSHEET-MANIFEST-2026-07-05.json` after the ABG completeness-pattern refresh
Artifact: `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-16-scattered-2026-07-06.json`

## Gate Result

Command:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-MIGRATION-BATCH-16-scattered-2026-07-06.json
```

Result:

- 20 records
- 0 FAIL
- 9 WARN

WARN classes:

- Serial-lane advisory:
  - `opus_icit_case_01/opus_icit_exhibit_stage_1` is staged `skip_serial` for two same-window current
    HR readings (`104` on ECG/telemetry and repeat vitals `106`).
- Prose-normalization candidates:
  - HR source text written as `/min` or `beats/min` but staged with implicit `bpm`.
- No-value / name-collision advisory mentions:
  - `opus_tpn_case_mucositis_01/exhibit_stage1`: potassium chloride order, not a chloride lab.
  - `opus_tpn_case_mucositis_01/exhibit_stage3`: sodium bicarbonate mouth rinse is not serum sodium or
    bicarbonate; glucose is a range (`180–200 mg/dL`), not a scalar flowsheet value.

## Sampling

Sampling mode: tapered `scattered` batch after two consecutive clean 100% batches.

Seed: `batch16-scattered-2026-07-06`

25% seeded random sample:

- 4 `opus_icit_case_01/opus_icit_exhibit_stage_3`
- 7 `opus_scc_case_01/exh_stage3`
- 12 `opus_vanco_case_01/baseline_assessment_labs`
- 18 `opus2_case_code_status_01/exhibit_baseline`
- 19 `opus2_case_postop_opioid_respiratory_depression_01/handoff_assessment_labs`

Always-sampled additions:

- 1 `opus_icit_case_01/opus_icit_exhibit_baseline` — `unitAliases` and compact CBC source units.
- 2 `opus_icit_case_01/opus_icit_exhibit_stage_1` — `skip_serial`.
- 3 `opus_icit_case_01/opus_icit_exhibit_stage_2` — `excludedValues` and `post_intervention`.
- 4 `opus_icit_case_01/opus_icit_exhibit_stage_3` — `excludedValues` and `post_intervention`.
- 5 `opus_scc_case_01/exh_baseline` — CBC `/µL` source units.
- 6 `opus_scc_case_01/exh_stage2` — `post_intervention`.
- 7 `opus_scc_case_01/exh_stage3` — `excludedValues` and `post_intervention`.
- 8 `opus_tpn_case_mucositis_01/exhibit_baseline` — `excludedValues`, `unitAliases`, and CBC units.
- 9 `opus_tpn_case_mucositis_01/exhibit_stage1` — `excludedValues` and `post_intervention`.
- 10 `opus_tpn_case_mucositis_01/exhibit_stage2` — `post_intervention`.
- 11 `opus_tpn_case_mucositis_01/exhibit_stage3` — `post_intervention` and scalar-omitted glucose
  range.
- 12 `opus_vanco_case_01/baseline_assessment_labs` — CBC `/µL` source units.
- 13 `opus1_case_discharge_med_rec_anticoag_01/baseline_record` — platelet `/mcL` source unit.
- 14 `opus1_case_tha_discharge_lep_01/pod1_update` — `post_intervention`.
- 15 `opus1_case_tha_discharge_lep_01/pod2_update` — `post_intervention`.
- 16 `opus1_case_tha_discharge_lep_01/pod3_update` — `post_intervention`.
- 18 `opus2_case_code_status_01/exhibit_baseline` — CBC `/µL` source units.
- 19 `opus2_case_postop_opioid_respiratory_depression_01/handoff_assessment_labs` —
  `excludedValues` and CBC `/µL` source units.

Total checker-seat sample: 18 of 20 records.

## Sample Surface

| # | exhibitRef | Extractor disposition | Gate | Review note |
|---:|---|---|---|---|
| 1 | `opus_icit_case_01/opus_icit_exhibit_baseline` | Keyed baseline vitals and labs | OK | Always-sampled due to unitAliases/CBC units; same-value telemetry HR 102 keyed once. |
| 2 | `opus_icit_case_01/opus_icit_exhibit_stage_1` | `skip_serial` | WARN | ECG HR 104 and repeat-vitals HR 106 are differing current same-parameter readings. |
| 3 | `opus_icit_case_01/opus_icit_exhibit_stage_2` | Keyed repeat labs/vitals and post-oxygen SpO2; excluded prior troponin/SpO2 | OK | Always-sampled due to `excludedValues` and Rule F. |
| 4 | `opus_icit_case_01/opus_icit_exhibit_stage_3` | Keyed post-steroid vitals/labs; excluded prior troponin | OK | Random + always-sampled due to `excludedValues`/Rule F. |
| 5 | `opus_scc_case_01/exh_baseline` | Keyed baseline vitals and labs | OK | Always-sampled due to CBC `/µL`; neuro strength/reflex/bladder scan out of scope. |
| 6 | `opus_scc_case_01/exh_stage2` | Keyed post-dexamethasone vitals, glucose, corrected calcium | WARN | HR `beats/min` candidate; neuro/pain/PCA quantities out of scope. |
| 7 | `opus_scc_case_01/exh_stage3` | Keyed postop vitals/glucose/labs; excluded prior Hgb/calcium trends | OK | Random + always-sampled due to `excludedValues`/Rule F. |
| 8 | `opus_tpn_case_mucositis_01/exhibit_baseline` | Keyed baseline vitals/labs; excluded prior temp/BP/Cr/glucose | OK | Always-sampled due to exclusions and CBC unit aliases. |
| 9 | `opus_tpn_case_mucositis_01/exhibit_stage1` | Keyed post-bolus vitals/stat labs; excluded pre-bolus temp/BP/HR | WARN | Potassium chloride order triggers chloride advisory. |
| 10 | `opus_tpn_case_mucositis_01/exhibit_stage2` | Keyed post-intervention vitals and glucose | OK | Insulin/TPN rates and culture timing out of scope. |
| 11 | `opus_tpn_case_mucositis_01/exhibit_stage3` | Keyed post-source-control labs/vitals; left glucose range unkeyed | WARN | Sodium bicarbonate rinse name-collision and non-scalar glucose range. |
| 12 | `opus_vanco_case_01/baseline_assessment_labs` | Keyed baseline vitals and labs | WARN | Random + CBC units; HR `/min` candidate; eGFR/albumin out of scope. |
| 13 | `opus1_case_discharge_med_rec_anticoag_01/baseline_record` | Keyed discharge vitals and labs | OK | Platelets `/mcL`; PT/eGFR and medication doses out of scope. |
| 14 | `opus1_case_tha_discharge_lep_01/pod1_update` | Keyed POD1 vitals/repeat labs | OK | Always-sampled due to post-op `post_intervention` context. |
| 15 | `opus1_case_tha_discharge_lep_01/pod2_update` | Keyed POD2 vitals/Cr/Hgb | OK | Always-sampled due to post-op `post_intervention` context. |
| 16 | `opus1_case_tha_discharge_lep_01/pod3_update` | Keyed POD3 vitals/Cr/Hgb/glucose | OK | Always-sampled due to post-op `post_intervention` context. |
| 18 | `opus2_case_code_status_01/exhibit_baseline` | Keyed baseline vitals and CBC/BUN/Cr | OK | Random + CBC units; albumin/LDH out of scope. |
| 19 | `opus2_case_postop_opioid_respiratory_depression_01/handoff_assessment_labs` | Keyed handoff vitals/labs; excluded preop Hgb | WARN | Random + always-sampled; HR `/min` candidate. |

Unsampled records:

- 17 `opus12_case_inpatient_suicide_risk_01/stage2_precautions_sweep` — plain vital-sign extract.
- 20 `opus2_case_postop_opioid_respiratory_depression_01/stage_0830_findings` — plain focused vital-sign
  extract, with HR `/min` prose-normalization advisory only.

## Checker-Seat Adjudication (Claude, 2026-07-06)

Independent review of all 18 sampled records against live `caseStudy.exhibits`/`stages[].exhibits`
content, pulled fresh from the default gate banks (`opus_icit_case_01`, `opus_scc_case_01`, and
`opus_tpn_case_mucositis_01` in `banks/hard-cases-canonical.json`; `opus_vanco_case_01`,
`opus1_case_tha_discharge_lep_01`, and `opus2_case_code_status_01` in `banks/claude-canonical.json`).
Also spot-checked the 2 unsampled records (17, 20) since the source was already pulled — both are
plain vital-sign extracts that match source exactly.

**Verdict: zero confirmed selection errors, zero re-dispositions.**

- Row 2 (`opus_icit_case_01/opus_icit_exhibit_stage_1`): correct `skip_serial` — ECG-reported HR 104
  and repeat-vitals HR 106 are two differing current readings for the same client in one exhibit.
- Row 3 (`opus_icit_case_01/opus_icit_exhibit_stage_2`): SpO2 93% (room air) → 95% is correctly
  excluded as `prior` rather than treated as an ambiguous Rule D duplicate, because the exhibit gives
  an explicit intervention→result frame ("titrates oxygen to 3 L/min... achieving SpO₂ 95%"), unlike
  the two independently-stated vitals checks that trigger genuine Rule D serial elsewhere (e.g. Batch
  15's SE case). The distinction holds up: causal before/after framing is `prior`/`trend`; two
  unconnected "current" snapshots is Rule D.
- Row 11 (`opus_tpn_case_mucositis_01/exhibit_stage3`): correctly caught two traps in one exhibit — a
  stated glucose *range* ("180–200 mg/dL") is left unkeyed as non-scalar, and "sodium bicarbonate
  rinses" (an oral-care medication) is correctly not read as sodium or bicarbonate lab values.
- Rows 9, 19: "potassium chloride" order and BMP `CO2` → `bicarbonate` mapping both behave as expected
  from prior batches; no values fabricated or omitted.
- Content-semantics note (non-blocking, not a Batch 16 error): `measurementAllowlist` has only one
  `troponin_t` key (`refBand.high` 0.01 ng/mL) used for every troponin reference in the repo. The
  `opus_icit_case_01` exhibits in this batch consistently state "troponin I" with the source's own
  stated normal cutoff of <0.04 ng/mL, which the schema doesn't distinguish from Troponin T. The
  extractor is correctly and consistently following the existing allowlist as-is — this is a schema-level
  gap, not a producer error — but it's relevant background for the already-deferred reference-range-
  verification product decision, so it's recorded here rather than acted on.

**Disposition: Batch 16 is clean.** Tapered 25% + always-sampled checker-seat sampling continues for
future `scattered` batches.

After this artifact, refreshed manifest coverage is:

- `prose_embedded`: 143/149 covered, 6 uncovered
- `scattered`: 135/152 covered, 17 uncovered
- `serial`: 5/33 covered, 28 uncovered
