# Exhibit Flowsheet Migration Ledger

This ledger tracks staged values-only extraction batches. These artifacts are not canonical bank
content, do not add `structuredMeasurements`, and do not render.

| Batch | Bucket | Records | Gate result | Adjudication | Disposition |
|---|---|---:|---|---|---|
| 01 | `clean_kv` | 2 | 0 FAIL / 0 WARN | Clean-KV proof batch reviewed in implementation handoff | Staged proof artifact ready |
| 02 | `prose_embedded` | 20 | 0 FAIL / 9 WARN after source-unit-laundering gate fix | 100% independent Opus adjudication clean; no selection errors | First clean full-adjudication prose batch |
| 03 | `prose_embedded` | 20 | 0 FAIL / 6 WARN | 100% independent checker-seat adjudication (Claude Code) clean; no selection errors | Second consecutive clean full-adjudication prose batch — sampling may taper to 25% + always-sampled for future `prose_embedded` batches |
| 04 | `prose_embedded` | 20 | 0 FAIL / 13 WARN | Tapered 10-record (25% + always-sampled) independent checker-seat adjudication clean; no selection errors | Staged; sampling stays tapered at 25% + always-sampled for future `prose_embedded` batches |
| 05 | `prose_embedded` | 20 | 0 FAIL / 9 WARN | Tapered 10-record (25% + always-sampled) independent checker-seat adjudication clean; no selection errors | Staged; sampling stays tapered |
| 06 | `prose_embedded` | 20 | 0 FAIL / 9 WARN | Tapered 9-record (25% + always-sampled) independent checker-seat adjudication clean; no selection errors — includes first live `post_intervention` (Rule F) firings, both correct | Staged; sampling stays tapered |
| 07 | `prose_embedded` | 20 | 0 FAIL / 2 WARN | Tapered 9-record (25% + always-sampled) independent checker-seat adjudication clean; no selection errors | Staged; sampling stays tapered |
| 08 | `prose_embedded` | 20 | 0 FAIL / 9 WARN | Tapered 12-record (25% + always-sampled) independent checker-seat adjudication clean; no selection errors | Staged; sampling stays tapered |
| 09 | `prose_embedded` | 5 | 0 FAIL / 5 WARN | Tapered 3-record (25% + always-sampled) independent checker-seat adjudication clean; no selection errors | **`prose_embedded` bucket complete** — 145/145 panels staged and adjudicated, zero selection errors across all 9 batches. Next: `scattered` bucket (160 panels) |
| 10 | `scattered` | 20 | 0 FAIL / 13 WARN | 100% independent checker-seat adjudication clean; no selection errors | First `scattered` ramp batch staged. One item escalated (Rule D scope for closely-spaced confirmatory BP readings), not a selection error — see `EXHIBIT-FLOWSHEET-ESCALATION-rule-d-closely-spaced-readings-2026-07-05.md`. First of two required 100% `scattered` batches |
