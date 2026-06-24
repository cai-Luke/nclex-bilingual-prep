# Unknown Key Gate Report

## Phase 1 Manifest Summary

Source anchors: the allowed-key manifest is defined at `src/allowedKeys.ts:3`; direct object key sets include common question keys at `src/allowedKeys.ts:6`, case subquestion keys at `src/allowedKeys.ts:31`, case-study object keys at `src/allowedKeys.ts:47`, and visual kind keys at `src/allowedKeys.ts:75`. The scanner records JSON source lines at `scripts/scan-unknown-keys.ts:35`, records unknown keys at `scripts/scan-unknown-keys.ts:124`, scans only `*-canonical.json` files at `scripts/scan-unknown-keys.ts:551`, and writes this report at `scripts/scan-unknown-keys.ts:567`. Existing promote ordering already strips compile manifests before validation at `scripts/promote.ts:53`.

Scanned 13 canonical bank files: `burn-canonical.json`, `capnography-canonical.json`, `claude-canonical.json`, `device-canonical.json`, `gemini-canonical.json`, `gpt-canonical.json`, `hard-cases-canonical.json`, `io-canonical.json`, `lab-canonical.json`, `mar-canonical.json`, `medlabel-canonical.json`, `visual-canonical.json`, `vitals-canonical.json`.

Total off-schema key occurrences: 15.
Distinct off-schema keys: `bankIdPrefix`, `correct`, `en`, `generatedAt`, `glossary`, `id`, `lane`, `overview`, `rationale`, `testTakingStrategy`.
Affected banks: `gpt-canonical.json`, `hard-cases-canonical.json`, `io-canonical.json`.

**Interpretation (amended 2026-06-21 after Schema 1.6).** The scanner is functioning correctly. The former dominant Bucket 1 case-study metadata findings have cleared after Schema 1.6 typed them. Remaining findings are the small cleanup/provenance tail: misnested caseStudy fields, duplicate rationale-choice ids, one matrix-level duplicate `correct`, one glossary stray `en`, one legacy `overview`, and three bank-meta provenance keys.

Canonical is not currently clean under the Phase 1 scanner's allowed-key manifest.

## Per-Bank Counts

| Bank | Off-schema key occurrences |
|---|---:|
| `burn-canonical.json` | 0 |
| `capnography-canonical.json` | 0 |
| `claude-canonical.json` | 0 |
| `device-canonical.json` | 0 |
| `gemini-canonical.json` | 0 |
| `gpt-canonical.json` | 3 |
| `hard-cases-canonical.json` | 9 |
| `io-canonical.json` | 3 |
| `lab-canonical.json` | 0 |
| `mar-canonical.json` | 0 |
| `medlabel-canonical.json` | 0 |
| `visual-canonical.json` | 0 |
| `vitals-canonical.json` | 0 |

## Full Manifest

| Location | Object id | JSON path | Object type | Unknown key | Count |
|---|---|---|---|---|---:|
| `gpt-canonical.json:55503` | `gpt_case_unsafe_assignment_01` | `$.questions[291].caseStudy` | `caseStudy` | `glossary` | 1 |
| `gpt-canonical.json:55493` | `gpt_case_unsafe_assignment_01` | `$.questions[291].caseStudy` | `caseStudy` | `rationale` | 1 |
| `gpt-canonical.json:55499` | `gpt_case_unsafe_assignment_01` | `$.questions[291].caseStudy` | `caseStudy` | `testTakingStrategy` | 1 |
| `hard-cases-canonical.json:1133` | `cs_copd_01_q1` | `$.questions[2].caseStudy.questions[0].rationale.byChoice[0]` | `rationaleChoice` | `id` | 1 |
| `hard-cases-canonical.json:1139` | `cs_copd_01_q1` | `$.questions[2].caseStudy.questions[0].rationale.byChoice[1]` | `rationaleChoice` | `id` | 1 |
| `hard-cases-canonical.json:1145` | `cs_copd_01_q1` | `$.questions[2].caseStudy.questions[0].rationale.byChoice[2]` | `rationaleChoice` | `id` | 1 |
| `hard-cases-canonical.json:1151` | `cs_copd_01_q1` | `$.questions[2].caseStudy.questions[0].rationale.byChoice[3]` | `rationaleChoice` | `id` | 1 |
| `hard-cases-canonical.json:1157` | `cs_copd_01_q1` | `$.questions[2].caseStudy.questions[0].rationale.byChoice[4]` | `rationaleChoice` | `id` | 1 |
| `hard-cases-canonical.json:1163` | `cs_copd_01_q1` | `$.questions[2].caseStudy.questions[0].rationale.byChoice[5]` | `rationaleChoice` | `id` | 1 |
| `hard-cases-canonical.json:26451` | `gpt_pph_2026_06_16_case_01_q5` | `$.questions[58].caseStudy.questions[4].matrix` | `matrix` | `correct` | 1 |
| `hard-cases-canonical.json:14750` | `opus_tpn_case_mucositis_01_q3` | `$.questions[40].caseStudy.questions[2].glossary[0]` | `glossaryTerm` | `en` | 1 |
| `hard-cases-canonical.json:19489` | `opus12_case_inpatient_suicide_risk_01` | `$.questions[47].caseStudy` | `caseStudy` | `overview` | 1 |
| `io-canonical.json:11` | `(bank)` | `$.meta` | `bankMeta` | `bankIdPrefix` | 1 |
| `io-canonical.json:9` | `(bank)` | `$.meta` | `bankMeta` | `generatedAt` | 1 |
| `io-canonical.json:10` | `(bank)` | `$.meta` | `bankMeta` | `lane` | 1 |

## Phase 2 Patch Summary

Not implemented in this pass. The only code added here is the reusable allowed-key manifest and the non-mutating Phase 1 scan script.

When Phase 2 is approved, the A1 reject gate should import the same allowed-key manifest in `src/schema.ts` and run after `stripCompileManifests` in the promote path. That ordering is already present because `scripts/promote.ts` calls `validateBankObject(stripCompileManifests(raw))`.

## Classification

**Bucket 1 — unfolding-case structure (cleared by Schema 1.6).**
`stageId`, `answerableAfterStageId`, `trigger`, `narrative`, `timeOffset`, and exhibit `type` are now typed and whitelisted as additive Schema 1.6 metadata.

**Bucket 2 — whitelist omission (cleared 2026-06-21).**
`pattern_keyed` on capnography `meta` was added to `allowedKeySets.questionMeta`; the scan dropped from 134 to 127 findings and `capnography-canonical.json` now reports 0.

**Bucket 3 — genuine strays, low-risk strip candidates.**
Six `cs_copd_01_q1` rationale entries carry duplicate `id` beside `refId`; one `gpt_pph_2026_06_16_case_01_q5` matrix object carries a duplicate nested `correct`; one glossary term on `opus_tpn_case_mucositis_01_q3` carries stray `en`; `gpt_case_unsafe_assignment_01` has misnested `rationale`, `glossary`, and `testTakingStrategy` inside `caseStudy`; `opus12_case_inpatient_suicide_risk_01` carries one legacy `overview` TextPair inside `caseStudy`.

**Bucket 4 — bank-meta provenance decision.**
`generatedAt`, `bankIdPrefix`, and `lane` exist on `io-canonical.json` bank `meta`; decide whether to type a provenance block or strip them like compile-only metadata.

## Residual Decision

Schema 1.6 has cleared the A1 structural blocker. A1 is still not ready until the remaining 15 findings are resolved or explicitly typed: decide keep-vs-strip for Bucket 4 provenance and clean or ratify each Bucket 3 tail item.
