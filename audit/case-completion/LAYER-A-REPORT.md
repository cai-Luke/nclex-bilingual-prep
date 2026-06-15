# Case Completion Reconciliation — Layer A

Generated: 2026-06-15T16:27:26.909Z
Skeleton sources: 27
JSON cases: 116
JSON parse failures: 0

## Opus-Origin Buckets

- P1: 0
- P2: 2
- P2-unconfirmed: 0
- R1: 0
- needs-layer-b-dp-parse: 0
- tolerated: 3
- full: 22

## Count Distribution

| population/lane | 2 | 3 | 4 | 5 | 6 | 7+ |
|---|---:|---:|---:|---:|---:|---:|
| canonical/opus-skeleton | 0 | 0 | 0 | 5 | 21 | 0 |
| canonical/claude | 0 | 0 | 5 | 0 | 0 | 0 |
| canonical/legacy-direct | 5 | 4 | 6 | 17 | 0 | 0 |
| canonical/gpt | 1 | 0 | 16 | 20 | 2 | 0 |
| canonical/gemini | 2 | 0 | 10 | 0 | 0 | 0 |
| raw/legacy-direct | 1 | 0 | 0 | 0 | 0 | 0 |
| raw/opus-skeleton | 0 | 0 | 0 | 0 | 1 | 0 |

## Gemini Queue

Rows requiring capped join confirmation or DP alignment: 2

| priority | case | emitted | skeleton DP | join | candidate |
|---|---|---:|---:|---|---|
| P2 | opus_car_t_crs_2026_06_11_case_01 | 5 | 6 | title_slug | Archive/case_sources/OpusCarT.md |
| P2 | opus2_case_code_status_01 | 5 | 6 | filename_slug | Archive/case_sources/Opus2.md |

Layer A does not authorize recompilation from a fuzzy or topic-only match. Gemini may confirm alignment and identify missing DPs, but must not edit any source or bank file. Claude performs final review.
