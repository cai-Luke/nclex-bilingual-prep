# Terminal-Sentence Independent Checker — Salvage Commission Final Report

## 14.1 Final status

`CHECKER_BLOCKED_CONCURRENT_BANK_CHANGE`

The semantic commission did not begin. The frozen queue snapshot and the current live bundled banks do not identify the same review population: `banks/gpt-canonical.json` has changed from the queue-recorded SHA-256, and five rows selected by the required deterministic PASS sample no longer exist in the live bank. The sample cannot be reduced, replaced, or reselected after its results are known. Completing only the remaining rows would violate the coverage and live-item requirements.

### Standard-workhorse owner waiver

The owner explicitly routed this commission to Codex under the salvage spec's standard-workhorse waiver. No newly piloted model qualified for the full checker seat; Claude-family review was not considered sufficiently independent from the Sonnet producer; and the remaining external pilots were incomplete or operationally unavailable. The checker is OpenAI GPT-5.6 (`gpt-5.6-sol`) in the Codex desktop harness, not Claude-family. This waiver permits Codex routing only. It does not relax coverage, direct evidence, provenance, sampling, producer-conflict, or acceptance requirements, and none were relaxed here.

## 14.2 Mechanical evidence

- Branch: `main`
- HEAD throughout this run: `0be2540d9d3b88d0737cd03e7536ff6eb057d5f8`
- Starting changed paths: the seven pre-existing untracked paths recorded in `mechanical-reconciliation.json`; no tracked change was present.
- Ending changed paths: those same seven pre-existing paths plus this new model-owned directory. No pre-existing file changed.
- Queue: 2,673 rows and 2,673 unique queue indices.
- Sonnet delivery: 42 numerically ordered batch files and 2,673 delivered rows; no missing, duplicate, extra, or out-of-order queue indices.
- Sonnet-to-queue terminal-string mismatches: nine rows — 597, 598, 765, 1150, 1352, 1470, 1690, 1783, and 1806.
- Sonnet evidence-shape violation: 305 rows, exactly queue indices 2,369–2,673, use strings instead of evidence-object arrays.
- Sonnet delivery-method inconsistency: `delivery.md` denies a semantic generator/classifier while also disclosing per-batch Python builders that assembled semantic dispositions into JSONL. This remains recorded as nonconformance and was not resolved by assumption.
- Bank hashes: 12 of 13 match their queue snapshots. `banks/gpt-canonical.json` does not: queue SHA-256 `61664a6bef854ec8d7a3a0113779a4773135724aabfdec65b970b7ac6464c5d2`; live SHA-256 `2a3bb79809e1407e8c915965e6212898c58dc721ceb54de701e5e2b374e0e389`.
- Live selected identities: 605 of 610 are present and their EN/ZH stems match the queue. Five deterministic-sample identities are absent:
  - 2052 — `gpt_balance2_2026_07_15_or_psychotropic_medications_10`
  - 2073 — `gpt_balance3_2026_07_16_hl_disaster_emergency_preparedness_13`
  - 2096 — `gpt_mocsic_2026_07_15_dc_disaster_emergency_preparedness_18`
  - 2109 — `gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13`
  - 2127 — `gpt_balance6a_2026_07_16_bt_perioperative_care_13`

Mechanical status is `BLOCKED_CONCURRENT_BANK_CHANGE`. Semantic analysis stopped because the spec requires every sampled row to be reopened as a complete live item; the five absent items make that impossible and prohibit a valid deterministic-sample-only false-negative rate.

## 14.3 Checker population

The frozen deduplicated population contains 610 rows; zero received semantic adjudication. Selection-reason counts overlap by design:

| Selection reason | Count |
|---|---:|
| `CALIBRATION_GATE` | 8 |
| `DETERMINISTIC_PASS_SAMPLE` | 265 |
| `DROPDOWN_CLOZE_DUPLICATED_SURFACE` | 8 |
| `DUPLICATED_RESPONSE_SURFACE_SIGNAL` | 6 |
| `FILL_IN_BLANK_ORDINARY_STEM_PLACEHOLDER` | 2 |
| `KNOWN_MISSED_FAMILY_EXPANSION` | 13 |
| `NONCONFORMANT_TAIL` | 305 |
| `RAW_PLACEHOLDER_SIGNAL` | 16 |
| `SONNET_FLAG` | 33 |
| `SONNET_NON_NONE_NEXT_STEP` | 33 |

Completed checker rows: 0. First unreviewed queue index: 1.

## 14.4 Sonnet versus checker

Sonnet delivered 2,640 `PASS` and 33 `FLAG` rows, with no `REVIEW` rows. Full Sonnet class counts are machine-readable in `mechanical-reconciliation.json`.

Because zero semantic rows were completed, checker disposition, final verdict/class, bank, item-type, record-kind, removal-risk, next-step, producer-conflict, repair-eligibility, and false-negative-family counts are all zero for completed checker output. No comparison inference was made from Sonnet's labels.

## 14.5 Calibration and known-condition reconciliation

No independent semantic disposition was issued for the duplicated dropdown-cloze surfaces, fill-in-blank raw placeholders, bilingual sentence-boundary control, queue index 1,731, queue index 2,413, RSBI or related calculation disclaimers, or the malformed 2,369–2,673 range. They remain mandatory in the frozen 610-row population. Mechanical selection was completed; direct review was not begun after the blocking snapshot condition was proven.

## 14.6 False-negative assessment

- Deterministic sample size: 265.
- Deterministic sample completed: 0.
- Forced/expanded PASS rows completed: 0.
- Confirmed passes: 0.
- Missed flags: 0 observed; not assessed.
- Missed reviews: 0 observed; not assessed.
- Segmentation artifacts: 0.
- Unresolved semantic rows: 610 unreviewed.
- Overall reviewed-PASS miss rate: not calculable (denominator 0).
- Deterministic-sample-only miss rate: not calculable (denominator 0).
- Expansions performed: mechanical population selection only; no semantic expansion was completed.
- Salvage criteria met: no.

The deterministic sample cannot be completed because five selected live items are absent. Replacing them or recomputing the sample would alter the prescribed population after observation.

## 14.7 Accepted queues

No semantic queue was accepted:

- Exact mechanical repairs: 0.
- Bounded semantic repairs: 0.
- Full-item review: 0.
- Bilingual review: 0.
- Renderer/schema investigation: 0.
- Owner decision: 0.
- Dismissed or retained rows: 0.

The five absent deterministic-sample identities require a synchronized queue/live-bank owner decision before recommission. This report does not authorize mutation or remediation.

## 14.8 Handoff

Outputs:

- `audit/terminal-sentence-independent-checker-2026-07-22/gpt-5-6-sol/mechanical-reconciliation.json`
- `audit/terminal-sentence-independent-checker-2026-07-22/gpt-5-6-sol/checker-population.jsonl`
- `audit/terminal-sentence-independent-checker-2026-07-22/gpt-5-6-sol/sample-manifest.jsonl`
- `audit/terminal-sentence-independent-checker-2026-07-22/gpt-5-6-sol/checker-adjudication.jsonl`
- `audit/terminal-sentence-independent-checker-2026-07-22/gpt-5-6-sol/confirmed-findings.jsonl`
- `audit/terminal-sentence-independent-checker-2026-07-22/gpt-5-6-sol/deferred-and-dismissed.jsonl`
- `audit/terminal-sentence-independent-checker-2026-07-22/gpt-5-6-sol/final-report.md`
- `audit/terminal-sentence-independent-checker-2026-07-22/gpt-5-6-sol/delivery.md`
- `audit/terminal-sentence-independent-checker-2026-07-22/gpt-5-6-sol/mechanical-reconcile-and-sample.ts`

Confirmed-finding count: 0. Observed false-negative count: 0 from zero reviewed PASS rows; the actual count is undetermined. Producer-conflict count: 0 adjudicated.

No bank mutation occurred. The architect must independently authorize any remediation work order, and no remediation may begin from this blocked delivery.
