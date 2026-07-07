# Exhibit Flowsheet Structured Promotion Candidate 02A — Codex to Claude Code

Date: 2026-07-07
Producer: Codex
Promotion gate: Claude Code

## Scope

Candidate artifact:

- `EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-02A-2026-07-07.json`

Source artifact:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-02-prose_embedded-2026-07-05.json`

Selected refs:

- `claude_cs_jun06_cdiff_sic_01/assessment`
- `cs_ngn_001_anorexia/ex_001_labs`
- `cs_ngn_004_blood/ex_004_vitals`
- `cs_ngn_007_dic/ex_007_labs`
- `cs_ngn_010_ad/ex_010_vitals`

All five are supplement-path records. No canonical bank write was performed by Codex.

## Deliberate Exclusions

- Already-promoted proof refs from Batch 02 were excluded.
- Empty-panel records were excluded.
- `cs_copd_01/labs` was excluded because the staged artifact predates the `sao2`/`spo2` split and keys source `SaO2` as `spo2`; it needs re-extraction before promotion.

## Gate Output

Current-bank flowsheet gate:

```sh
npm run flowsheet-gate -- EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-02A-2026-07-07.json --bank banks/hard-cases-canonical.json
```

Result:

```text
OK   claude_cs_jun06_cdiff_sic_01/assessment [extract]
OK   cs_ngn_001_anorexia/ex_001_labs [extract]
OK   cs_ngn_004_blood/ex_004_vitals [extract]
OK   cs_ngn_007_dic/ex_007_labs [extract]
OK   cs_ngn_010_ad/ex_010_vitals [extract]

EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-02A-2026-07-07.json: 5 records, 0 FAIL, 0 WARN
```

Applicator dry-run:

```sh
npm run structured-measurements:apply -- --refs claude_cs_jun06_cdiff_sic_01/assessment,cs_ngn_001_anorexia/ex_001_labs,cs_ngn_004_blood/ex_004_vitals,cs_ngn_007_dic/ex_007_labs,cs_ngn_010_ad/ex_010_vitals EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-02A-2026-07-07.json
```

Result:

```text
Dry-run validated 5 structured-measurements selected records.
Touched banks: hard-cases-canonical.json (5 exhibit refs)
Selected refs:
- claude_cs_jun06_cdiff_sic_01/assessment [supplement]
- cs_ngn_001_anorexia/ex_001_labs [supplement]
- cs_ngn_004_blood/ex_004_vitals [supplement]
- cs_ngn_007_dic/ex_007_labs [supplement]
- cs_ngn_010_ad/ex_010_vitals [supplement]
```

Mechanical suite run by Codex:

```sh
npm run test:structured-measurements
npm run test:measurement-allowlist
npx tsc -b --pretty false
npm run validate-bank -- banks/*.json
npm run scan-unknown-keys
npm run census:check
npm run build
```

Results:

- All passed.
- `scan-unknown-keys` reported 0 off-schema key occurrences; generated report was removed.
- `build` passed with the existing Vite large-chunk warning.

## Write Command For Gate Seat

After content review, Claude Code can apply this candidate with:

```sh
npm run structured-measurements:apply -- --write --refs claude_cs_jun06_cdiff_sic_01/assessment,cs_ngn_001_anorexia/ex_001_labs,cs_ngn_004_blood/ex_004_vitals,cs_ngn_007_dic/ex_007_labs,cs_ngn_010_ad/ex_010_vitals EXHIBIT-FLOWSHEET-STRUCTURED-PROMOTION-CANDIDATE-02A-2026-07-07.json
```

Then rerun the mechanical suite, regenerate census after the bank write, update the promotion ledger, and commit from the gate seat.
