# Learner-Facing Temperature Prose Unit Survey

Date: 2026-07-21

Final verdict: **SURVEY_COMPLETE_WITH_REVIEW_RESIDUALS**

## Repository snapshot

- Starting branch: `main`
- Starting HEAD: `1b64425ce8640b91ea596141d774cf2d7d4c9816`
- Upstream: `origin/main` (ahead 0, behind 0)
- Starting staged paths: none
- Starting unstaged paths: `BANK-CENSUS.md`, `BANK-REVIEW-LEDGER.md`, `PROJECT-HISTORY.md`, `banks/gpt-canonical.json`, `census.json`
- Starting untracked paths: `TEMPERATURE-PROSE-UNIT-SURVEY-CODEX-SPEC-2026-07-21.md`, `audit/temperature-prose-unit-survey-2026-07-21/`, `scripts/audit/temperature-prose-unit-survey.ts`, `scripts/patches/2026-07-21-gpt-hemodialysis-access-coherence.ts`, `scripts/tests/temperature-prose-unit-survey.ts`
- Ending survey worktree state: ` M BANK-CENSUS.md`, ` M BANK-REVIEW-LEDGER.md`, ` M PROJECT-HISTORY.md`, ` M banks/gpt-canonical.json`, ` M census.json`, `?? TEMPERATURE-PROSE-UNIT-SURVEY-CODEX-SPEC-2026-07-21.md`, `?? audit/temperature-prose-unit-survey-2026-07-21/`, `?? scripts/audit/temperature-prose-unit-survey.ts`, `?? scripts/patches/2026-07-21-gpt-hemodialysis-access-coherence.ts`, `?? scripts/tests/temperature-prose-unit-survey.ts`

Luke confirmed that the only pre-existing bank mutation was the completed regeneration of `gpt_format10b_hemodialysis_access_prompt_followup`. The stable live `banks/gpt-canonical.json` SHA-256 was `ec3bf6db4a7de6cc3985436ce4ddd30882f0d0b4751699dc0f74fc81ccc5b004`; no writer changed it during the bounded rerun. The survey used that live validated bank snapshot while leaving the regeneration's bank, ledger, history, census, and patch paths untouched.

## Authority and executable policy

Read `AGENTS.md`, `docs/AGENTS-RUNBOOK.md`, `DECISIONS.md`, `PROJECT-HISTORY.md`, `NCLEX-Question-Schema.md`, `src/measurementUnitPolicy.ts`, `src/structuredMeasurements.ts`, `scripts/tests/structured-measurements.ts`, `lib/question-population.ts`, the WBC/platelet precedent, and both completed producer-vocabulary remediation reports. Live policy observed: primary `°F`, secondary `°C`, mode `paren`. The prose rule is present in `AGENTS.md`; no policy drift was found.

## Population and traversal contract

Scanned 13 validated bundled top-level banks, 1942 top-level session units, 2528 scored leaves, and 87047 explicitly enumerated learner-facing string fields. The bank files were: `banks/burn-canonical.json`, `banks/capnography-canonical.json`, `banks/claude-canonical.json`, `banks/device-canonical.json`, `banks/gemini-canonical.json`, `banks/gpt-canonical.json`, `banks/hard-cases-canonical.json`, `banks/io-canonical.json`, `banks/lab-canonical.json`, `banks/mar-canonical.json`, `banks/medlabel-canonical.json`, `banks/visual-canonical.json`, `banks/vitals-canonical.json`.

Included stems, item-type display text, options, rationales, strategies, glossary text, case titles/summaries, displayed stage text, and global/staged exhibit titles and content. Excluded bank/question metadata, IDs and answer keys, provenance/audit branches, structured measurements, question/rationale/exhibit visual payloads, and typed vitals-trend values. Prose beside a typed temperature remained included.

## Results

- Total temperature-prose occurrences: **488**
- Distinct owning items: **137**
- Coexisting with an excluded typed temperature: **169**
- Safe mechanical subset: **468**
- Review/preserve residuals: **15**
- Already canonical: **5**

### Live-bank locator reconciliation

The ICI-colitis prose is present as `100.9 °F (38.3 °C)` and is already canonical. The DKA exhibit's authored prose is `99.1°F (37.3°C)` and therefore classifies `SAFE_NORMALIZE_DUAL_TOKENS`; its adjacent typed structured-temperature display renders canonical spacing but is excluded by contract.

### By bank

| Value | Count |
|---|---:|
| banks/claude-canonical.json | 49 |
| banks/gemini-canonical.json | 73 |
| banks/gpt-canonical.json | 247 |
| banks/hard-cases-canonical.json | 117 |
| banks/vitals-canonical.json | 2 |

### By producer prefix/family

| Value | Count |
|---|---:|
| case | 3 |
| claude | 8 |
| cs | 22 |
| easy | 2 |
| gemini | 58 |
| gpt | 266 |
| opus | 68 |
| opus1 | 9 |
| opus12 | 2 |
| opus2 | 4 |
| opus20 | 6 |
| opus22 | 3 |
| opus25 | 5 |
| opus26 | 8 |
| opus27 | 1 |
| opus4 | 10 |
| opus5 | 2 |
| sa | 2 |
| trad | 5 |
| vit | 4 |

### By surface

| Value | Count |
|---|---:|
| bowtie | 2 |
| case_exhibit | 122 |
| case_summary | 10 |
| cloze_stem | 2 |
| dropdown_option | 2 |
| glossary | 2 |
| highlight_segment | 66 |
| matrix_row | 31 |
| option | 26 |
| rationale_by_choice | 42 |
| rationale_correct | 14 |
| staged_exhibit | 127 |
| stem | 42 |

### By language

| Value | Count |
|---|---:|
| en | 237 |
| zh | 251 |

### By quantity kind

| Value | Count |
|---|---:|
| ABSOLUTE_TEMPERATURE | 482 |
| TEMPERATURE_DELTA | 6 |

### By numeric shape

| Value | Count |
|---|---:|
| COMPARATOR | 38 |
| SCALAR | 450 |

### By presentation class

| Value | Count |
|---|---:|
| CELSIUS_ONLY | 332 |
| DUAL_C_FIRST | 69 |
| DUAL_F_FIRST | 60 |
| FAHRENHEIT_ONLY | 18 |
| MALFORMED_OR_MISMATCHED_DUAL | 9 |

### By disposition

| Value | Count |
|---|---:|
| ALREADY_CANONICAL | 5 |
| REVIEW_DUAL_VALUE_MISMATCH | 9 |
| REVIEW_TEMPERATURE_DELTA | 6 |
| SAFE_ADD_CELSIUS | 14 |
| SAFE_ADD_FAHRENHEIT_AND_REORDER | 330 |
| SAFE_NORMALIZE_DUAL_TOKENS | 55 |
| SAFE_REORDER_EXISTING_DUAL | 69 |

### Safe subset by conversion type

| Value | Count |
|---|---:|
| SAFE_ADD_CELSIUS | 14 |
| SAFE_ADD_FAHRENHEIT_AND_REORDER | 330 |
| SAFE_NORMALIZE_DUAL_TOKENS | 55 |
| SAFE_REORDER_EXISTING_DUAL | 69 |

### EN/ZH parity

| Value | Count |
|---|---:|
| COUNTERPART_MISSING_TEMPERATURE | 16 |
| EQUIVALENT_SAME_PRESENTATION | 470 |
| NO_STRUCTURAL_COUNTERPART | 2 |

## Review residuals

- REVIEW_DUAL_VALUE_MISMATCH: 9
- REVIEW_TEMPERATURE_DELTA: 6

### Dual-value mismatch evidence

- `temp-00036`: `38.3 C（101.0 F）`; residuals=[0.060000000000002274], tolerances=[0.05].
- `temp-00123`: `38.3 °C (101.0 °F)`; residuals=[0.060000000000002274], tolerances=[0.05].
- `temp-00124`: `38.3°C（101.0°F）`; residuals=[0.060000000000002274], tolerances=[0.05].
- `temp-00231`: `≥ 38.3 °C (101.0 °F)`; residuals=[0.060000000000002274], tolerances=[0.05].
- `temp-00234`: `≥ 38.3 °C（101.0 °F）`; residuals=[0.060000000000002274], tolerances=[0.05].
- `temp-00256`: `38.3 °C (101.0 °F)`; residuals=[0.060000000000002274], tolerances=[0.05].
- `temp-00257`: `超过 38.3 °C（101.0 °F）`; residuals=[0.060000000000002274], tolerances=[0.05].
- `temp-00457`: `39.2 °C (103.6 °F)`; residuals=[1.039999999999992], tolerances=[0.05].
- `temp-00459`: `39.2 °C（103.6 °F）`; residuals=[1.039999999999992], tolerances=[0.05].

## Examples

### Already canonical

- `temp-00352` — `100.9 °F (38.3 °C)` in `banks/gpt-canonical.json` / `questions[732].highlight.segments[5].en`
- `temp-00390` — `104.2 °F (40.1 °C)` in `banks/hard-cases-canonical.json` / `questions[33].caseStudy.exhibits[0].content.en`
- `temp-00391` — `104.2 °F (40.1 °C)` in `banks/hard-cases-canonical.json` / `questions[33].caseStudy.exhibits[0].content.zh`

### Safe mechanical

- `temp-00001` — `36°C (96.8°F)` in `banks/claude-canonical.json` / `questions[40].matrix.rows[2].en`
- `temp-00002` — `36°C（96.8°F）` in `banks/claude-canonical.json` / `questions[40].matrix.rows[2].zh`
- `temp-00003` — `36°C` in `banks/claude-canonical.json` / `questions[40].rationale.byChoice[2].en`

### Temperature delta

- `temp-00094` — `0.5°F` in `banks/gemini-canonical.json` / `questions[782].rationale.byChoice[0].en`
- `temp-00095` — `>1.8°F` in `banks/gemini-canonical.json` / `questions[782].rationale.byChoice[0].en`
- `temp-00096` — `1°C` in `banks/gemini-canonical.json` / `questions[782].rationale.byChoice[0].en`

### Ambiguous or unit-missing

- None in this snapshot.

### Excluded typed-contract canary

Synthetic traversal tests place the same `40°C` literal at `questions[0].meta.source`, `questions[0].caseStudy.exhibits[0].structuredMeasurements...value`, and `questions[0].caseStudy.exhibits[0].visual...values`; all three are excluded. The paired learner-visible rationale and exhibit-content paths are included, and the exhibit rows record `coexistsWithTypedTemperature: true`.

## Determinism and mutation boundary

The focused test covers parsing, absolute and delta arithmetic, structural inclusion/exclusion, bilingual pairing, ordering, and byte-stable serialization. The survey was run twice against the same bank snapshot and the four generated artifacts were byte-identical. No canonical bank, governance file, renderer, schema, ledger, census, or package script was modified.

## Recommended next step

Use the 468-row safe subset as the closed input to a separately commissioned declarative migration, and adjudicate the 15 residual rows before authorizing any content mutation. This report applies no patch.
