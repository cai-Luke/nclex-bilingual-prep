# Structured Measurements Comparator Sweep

Date: 2026-07-09

Scope: canonical `structuredMeasurements` written before the Candidate 12 patch, covering the already-promoted Candidate 02A through Candidate 11B lineage in the current bundled banks.

Check: every `structuredMeasurements.panels[].rows[].values[].value` in `banks/*.json` was scanned for comparator/censored-value symbols `<`, `>`, `<=`, `>=`, `≤`, or `≥`.

Result: **0 hits**.

Notes:

- No canonical repair was performed.
- Candidate 12B's staged `ptt` value `>200` was not canonical at the time of this sweep and was moved to `excludedValues` with `reason: "comparator"` in the then-current Candidate 12B artifact. Schema 2.0 later superseded that exclusion with a typed `bound` entry.

## Required staged-and-held extension — 2026-07-11

Scope required by the Schema 2.0 sequencing gate:

- `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-01-clean_kv-2026-07-05.json`
- the 19 supplement-lane staged artifacts `EXHIBIT-FLOWSHEET-MIGRATION-BATCH-02` through `-20`
  (`prose_embedded`, `scattered`, `serial`, and `serial-redo`)
- the 12G, 12T, and 13H hold artifacts

The scan loaded every JSON record and inspected only authorable measurement `value` fields in
`panel[]` and `excludedValues[]` for `[<>≤≥]`. Comparator tokens occurring only in prose or
`sourceSpan` were deliberately not counted: thresholds, reference ranges, and non-measurement
statements do not require `bound` unless the staged measurement value itself is censored.

| Scope | Files | Records | Panel values | Excluded values | Existing `bound` entries | Comparator-bearing `value` hits |
|---|---:|---:|---:|---:|---:|---:|
| Clean-KV bucket | 1 | 2 | 14 | 1 | 0 | 0 |
| Supplement bucket | 19 | 364 | 1,834 | 86 | 1 | 0 |
| Holds 12G / 12T / 13H | 3 | 11 | 118 | 1 | 0 | 0 |

**Result: zero records need a new `bound` field.** The one existing bound entry is already correctly
encoded in Batch 12:
`gpt_case_gap_2026_06_11_case_anticoag_bleeding_06/anticoag_deterioration`, with scalar
`ptt.value: "200"` and `bound: ">"` against source `aPTT >200 seconds`.

The three 13H-successor records whose source prose contains comparator symbols remain non-candidates:

- toddler assessment: capillary refill `<2 seconds` (not an allowlisted structured measurement);
- refeeding baseline: facility K/phosphate/Mg replacement thresholds;
- refeeding Stage 3: repeat-Mg protocol threshold `<1.5`, not a patient result.

No artifact was rewritten by this sweep. This closes the report-only comparator prerequisite for
13H re-staging.
