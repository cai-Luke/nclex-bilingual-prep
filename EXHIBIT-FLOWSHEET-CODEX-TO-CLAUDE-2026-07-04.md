# Exhibit Flowsheet — Codex to Claude Handoff

Date: 2026-07-04
Scope: implementation + extraction pass for the amended exhibit-flowsheet smoke/blind protocol.

## Files for Claude

- `EXHIBIT-FLOWSHEET-SMOKE-EXTRACTION-V2-2026-07-04.json`
- `EXHIBIT-FLOWSHEET-BLIND-CASES-2026-07-04.json`
- `EXHIBIT-FLOWSHEET-BLIND-ANSWERKEY-2026-07-04.json`
- `EXHIBIT-FLOWSHEET-BLIND-EXTRACTION-2026-07-04.json`
- `scripts/exhibit-flowsheet-gate.ts`
- `scripts/tests/exhibit-flowsheet-gate.ts`

Producer/extractor separation was preserved: a separate generator instance wrote the blind cases and
held-back answer key. Codex extraction used only the blind cases file; the answer key was not read
before `EXHIBIT-FLOWSHEET-BLIND-EXTRACTION-2026-07-04.json` was written and gated.

## Gate Changes Completed

- Added package scripts:
  - `flowsheet-gate`
  - `test:flowsheet-gate`
- Gate supports `--blind <cases.json>` flat fixture input.
- Gate exports internals behind an `isMain` guard for tests.
- `sourceSpan` is required on `panel[]` and `excludedValues[]`.
- Serial detection is generalized beyond BP and includes military chart times such as `0800`.
- GATE 2 source sweep is advisory WARN-only; supplied exclusions are still hard-validated.
- GATE 4 dimensional sanity catches CBC source-unit scale errors.
- `unitAliases[]` must correspond to an existing keyed panel label.
- `sourceUnit` is checked against source text unless it is an allowed implicit vital unit (`hr`, `rr`, `sbp`, `dbp`, `map`).

## Smoke V2 Gate Output

Command:
```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-SMOKE-EXTRACTION-V2-2026-07-04.json
```

Output:
```text
OK   opus_tpn_case_mucositis_01/exhibit_baseline [extract]
OK   opus_case_lithium_toxicity_01/exhibit_admission [extract]
OK   opus_scc_case_01/exh_stage3 [extract]
OK   opus1_case_tha_discharge_lep_01/pod2_update [extract]
OK   gpt_2026_06_16_case_postpartum_preeclampsia_severe_01/stage3_reassessment [skip_serial]
OK   case_preeclampsia_magnesium_01/toxicity_assessment [extract]

EXHIBIT-FLOWSHEET-SMOKE-EXTRACTION-V2-2026-07-04.json: 6 records, 0 FAIL, 0 WARN
```

Targeted smoke regressions:
- Panel 1 platelets now use `sourceUnit: "/µL"` and gate cleanly.
- Panel 6 post-labetalol BP is keyed with `context: "post_intervention"` and gate cleanly.

## Blind Gate Output

Command:
```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-BLIND-EXTRACTION-2026-07-04.json --blind EXHIBIT-FLOWSHEET-BLIND-CASES-2026-07-04.json
```

Output:
```text
OK   blind_01/triage-note [extract]
OK   blind_02/postop-check [extract]
OK   blind_03/clinic-recheck [extract]
OK   blind_04/dehydration-update [extract]
OK   blind_05/anemia-observation [extract]
OK   blind_06/cellulitis-reassessment [extract]
OK   blind_07/oncology-phone [extract]
OK   blind_08/contrast-observation [skip_serial]
OK   blind_09/viral-reassessment [skip_serial]
OK   blind_10/postpartum-reassessment [extract]
OK   blind_11/renal-lab-review [extract]
OK   blind_12/pneumonia-admission [extract]

EXHIBIT-FLOWSHEET-BLIND-EXTRACTION-2026-07-04.json: 12 records, 0 FAIL, 0 WARN
```

## Verification

```text
npm run flowsheet-gate
→ printed usage and exited 2, as expected

npm run test:flowsheet-gate
→ exhibit-flowsheet-gate tests passed

npx tsc -b --pretty false
→ clean

npm run test-visuals
→ passed all visual test suites
```

## Cost Signal

Junior-model extraction effort was low-to-moderate: the amended record shape was mechanical once
`sourceUnit`, `skip_serial`, and post-intervention context were explicit. The blind extraction
completed in one pass and required no gate-driven repair before handoff.

## Claude Adjudication Targets

Use `EXHIBIT-FLOWSHEET-BLIND-ANSWERKEY-2026-07-04.json` to score:
- current-vs-prior/trend selection,
- out-of-scope silence,
- serial lane selection,
- post-intervention context tagging,
- unit-scale source-unit discipline.

The deterministic gate found no structural, containment, source-unit, serial-shape, or dimensional
sanity issues in either the smoke v2 or blind extraction.
