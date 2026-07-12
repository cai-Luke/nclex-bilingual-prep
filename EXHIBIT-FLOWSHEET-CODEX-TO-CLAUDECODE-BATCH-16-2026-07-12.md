# Batch 16 — Independent Claude Review Handoff

Date: 2026-07-12
Status: six bounded candidates staged; no canonical write
Producer seat: Codex
Required checker seat: independent Claude/Sonnet

## Live-main reconciliation

All 20 refs in `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-16-scattered-2026-07-06.json` resolve exactly once
on live `main`; none has canonical `structuredMeasurements`. Nineteen actionable records are staged
exactly once across Candidates 16A–16F. `opus_icit_case_01/opus_icit_exhibit_stage_1` remains
non-rendering `skip_serial`: ECG/telemetry HR 104 and repeat-vitals HR 106 are distinct current
readings. The current serial heuristic does not re-confirm that prose shape, but source review does.
Failed Batch 19 is unrelated and excluded.

| Candidate | Refs | Bank(s) | Gate |
|---|---:|---|---:|
| `16A-ICIT` | 3 | hard cases | 0 FAIL / 3 WARN |
| `16B-SCC` | 3 | hard cases | 0 FAIL / 4 WARN |
| `16C-TPN-MUCOSITIS` | 4 | hard cases | 0 FAIL / 4 WARN |
| `16D-BASELINES` | 4 | Claude + hard cases | 0 FAIL / 2 WARN |
| `16E-THA` | 3 | Claude | 0 FAIL / 0 WARN |
| `16F-OPIOID` | 2 | hard cases | 0 FAIL / 2 WARN |

The exact delta from the historical artifact is recorded in
`EXHIBIT-FLOWSHEET-BATCH-16-COMPARISON-2026-07-12.json`.

## 16A — immune-checkpoint-inhibitor toxicity

The old artifact's acknowledged identity workaround is no longer valid: every source-explicit
troponin I panel/exclusion label changes from `troponin_t` to current key `troponin_i`.

Rule F: baseline has no tags. Stage 2 tags only SpO2 95%, which follows explicit oxygen titration;
the other displayed values precede the steroid/oxygen orders. Stage 3 tags HR/BP, RR/SpO2,
troponin I, BNP, AST, ALT, and total bilirubin after two pulse-dose steroid doses and oxygen support
directed at myocarditis/hepatitis and cardiac/respiratory domains. Temperature, creatinine, and
steroid-caused glucose are untagged.

The three WARNs are case-wide R9 false positives: Chinese history says immunotherapy began 3 months
ago / cancer was diagnosed 8 months ago, which the detector treats as possible pediatric age. The
client is explicitly 61. All dry-run columns are `Current`.

## 16B — spinal cord compression

Rule F is narrowed from blanket steroid/postoperative tagging. Baseline has no tags. Stage 2 tags
only HR because source explicitly attributes the lower rate to improved pain control. Stage 3 tags
only corrected calcium because source explicitly says bisphosphonate and steroids are helping.
Surgery does not tag the general vital/lab cluster, and an insulin order “in place” does not prove
administration before glucose 210.

All three refs inherit an R9 false positive from Chinese case history (“bone metastases diagnosed 8
months ago”); the client is explicitly 61. Stage 2 additionally WARNs on HR `beats/min` staged as
`bpm`. Labels: `Current`, `Current`, `Day 1`.

## 16C — TPN/mucositis

Baseline current vitals stay implicit `Current`; its coherent historical-only labs become one
explicit `6 h prior` / `6 小时前` column evidenced by the source. No empty current lab column is made.

Rule F: baseline has no tags. Stage 1 tags HR/BP, potassium, magnesium, creatinine, and lactate after
the NS bolus and administered replacements; temperature, RR/SpO2, and glucose are untagged. Stage 2
tags temperature, hemodynamics, RR/SpO2, and glucose after antibiotics, a second bolus, oxygen,
insulin, and reduced TPN. Stage 3 keeps all ten rows tagged after PICC source control, antibiotics,
insulin, replacement, resuscitation, and oxygen support/weaning.

WARNs: `exhibit_stage1` chloride is from a potassium-chloride order. `exhibit_stage3` sodium and
bicarbonate are oral-rinse medication-name hits; glucose 180–200 mg/dL is a non-scalar range and
stays prose-only. Follow-up labels are `Current`.

## 16D — mixed baseline/current records

No Rule F tags. Explicit columns prevent label contamination:

- Vancomy: current vitals and `1200` labs.
- Discharge anticoagulation: both panels `Current`; historical postoperative mentions otherwise
  produce false `Day 2`/`Day 1` labels.
- Code-status baseline: current vitals and `0530` labs.
- Suicide-precautions vitals remain implicit `Current`.

WARNs: vancomy HR `/min` → `bpm`; suicide-risk R9 is case-wide duration text (“14 months ago” / “8
months ago”), not client age (explicitly 58).

## 16E — THA discharge progression

All three records use explicit source-evidenced labels: `18 h postoperative`, `42 h postoperative`,
and `66 h postoperative`, with equivalent Chinese labels. This prevents POD2 from borrowing a future
“postoperative day 3” order and POD3 from borrowing the son's later `0900` arrival.

POD1 has no Rule F tags. POD2 and POD3 tag only creatinine after hydration/adequate intake directed
at the renal trend. Vitals, hemoglobin, and glucose remain untagged. Gate: 0 FAIL / 0 WARN.

## 16F — postoperative opioid respiratory depression

No Rule F tags. The handoff authors `0715` vitals and `0600` labs. The focused deterioration uses
explicit `Current`, preventing the heuristic from borrowing the future `1045` PRN dose time. Prior
preoperative hemoglobin remains a valid same-key `prior` exclusion. Both refs WARN on source HR
`/min` staged as `bpm`.

## Verification and requested verdict

Each candidate independently gates at 0 FAIL and applicator dry-run validates all 19 selected refs
as supplements without `--write`. Return PASS/BLOCK separately for 16A–16F after independently
re-deriving every value, WARN, Rule F tag, exclusion, analyte identity, and column label. A dispute
blocks only its bounded candidate. No canonical bank, bank-review ledger, migration ledger, or
census write is authorized in this PR.
