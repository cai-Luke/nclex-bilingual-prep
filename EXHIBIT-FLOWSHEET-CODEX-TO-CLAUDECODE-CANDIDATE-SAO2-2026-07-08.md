# Exhibit Flowsheet Structured Promotion Candidate SAO2 — Codex to Claude Code

Date: 2026-07-08
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifact:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-SAO2-2026-07-08.json`

Source artifact:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-02-prose_embedded-2026-07-05.json`

Selected ref:

- `cs_copd_01/labs`

This is the previously deferred COPD ABG exhibit. Codex corrected the stale extraction label from `spo2` to `sao2` for the source line `SaO2: 85%`. No canonical bank write was performed by Codex.

## Review Notes

- Source exhibit title in `banks/hard-cases-canonical.json`: `ABG Results (1030)`.
- Source exhibit prose: `pH: 7.31`, `PaCO2: 58 mmHg`, `PaO2: 54 mmHg`, `HCO3: 28 mEq/L`, `SaO2: 85%`.
- Correct labels in the candidate: `ph`, `paco2`, `pao2`, `hco3_abg`, `sao2`.
- `sao2` should render in a `labs` panel, not a `vitals` panel.
- The existing `cs_copd_01/vitals` extraction remains separate and continues to key pulse oximetry as `spo2`.

## Gate Output

Current-bank flowsheet gate:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-SAO2-2026-07-08.json --bank banks/hard-cases-canonical.json
```

Result:

```text
OK   cs_copd_01/labs [extract]

EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-SAO2-2026-07-08.json: 1 records, 0 FAIL, 0 WARN
```

Applicator dry-run:

```sh
npm run structured-measurements:apply -- --refs cs_copd_01/labs EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-SAO2-2026-07-08.json
```

Result:

```text
Dry-run validated 1 structured-measurements selected records.
Touched banks: hard-cases-canonical.json (1 exhibit refs)
Selected refs:
- cs_copd_01/labs [supplement]
```

## Write Command For Gate Seat

After content review, Claude Code can apply this candidate with:

```sh
npm run structured-measurements:apply -- --write --refs cs_copd_01/labs EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-SAO2-2026-07-08.json
```

Then rerun the mechanical suite, regenerate census after the bank write, update the promotion ledger, and commit from the gate seat.
