# Producer Vocabulary Leakage Remediation Report

Date: 2026-07-21  
Final implementation verdict: `READY_FOR_INDEPENDENT_CONTENT_REVIEW`

## Repository isolation and authority

- Starting branch: `main`
- Starting HEAD: `98fbf9ecc08c016b5d128af02e79838e9a0d1f83`
- Starting dirty paths: only untracked `PRODUCER-VOCABULARY-LEAKAGE-REMEDIATION-CODEX-SPEC-2026-07-21.md`
- No `banks/*.json` file was modified at task start; the canonical-overlap stop condition did not apply.
- An unrelated untracked `TEMPERATURE-PROSE-UNIT-SURVEY-CODEX-SPEC-2026-07-21.md` appeared during the work and was left untouched.
- Authority read before mutation: `AGENTS.md`, `docs/AGENTS-RUNBOOK.md`, `DECISIONS.md`, `PROJECT-HISTORY.md`, `NCLEX-Question-Schema.md`, `src/types.ts`, `src/schema.ts`, `scripts/audit.ts`, `scripts/audit/audit-references.ts`, `lib/question-population.ts`, `scripts/patch-raw.ts`, the architect manifest, and every live affected field.
- `PROJECT-HISTORY.md` was not edited, per the work order.

The architect artifact `producer-vocabulary-leakage-manifest.json` remains byte-identical in the worktree (`git diff` empty). Its SHA-256 is `6b81cb2c22f51839e421ef46d3967ba60787e80dd965db34ab33b0ee0a22834e`.

## Baseline reconciliation

The independent structural sweep in `codex-baseline.json` reproduced the architect baseline exactly:

- 1,942 canonical top-level items scanned across 13 bundled banks;
- 30 distinct HIGH-confidence items;
- item-tier split: five stem, three `testTakingStrategy`-only, and 22 rationale-only;
- 42 HIGH occurrences across 37 distinct learner-facing paths;
- 15 advisory bare-`lane` occurrences across 14 distinct paths.

The shared executable owner is `lib/producer-vocabulary-leakage.ts`. It uses finite English patterns for `source-pinned`, `source-supported`, `closed-world`, direct `cross* … lane` constructions, and the observed compound-lane phrases, plus the exact Chinese string `来源限定`. Bare `lane` is reported separately and cannot affect the blocking verdict.

Traversal begins with validated question objects and covers top-level and embedded question prose, case titles/summaries/stages/exhibits, rationales, strategies, glossary text, item-type content, and learner-visible nested labels. It excludes metadata/provenance, `_compileManifest`, answer keys, IDs/ref IDs, schema and enum values, accepted-answer configuration, and non-rendered internal configuration strings. Focused regression proves that `meta.source` is excluded while the same phrase in learner-visible rationale text fails.

## Dispositions and canonical patch

The declarative applicator is `scripts/patches/2026-07-21-producer-vocabulary-naturalization.ts`. It uses exact full-string `before`/`after` operations through `scripts/patch-raw.ts`, locates top-level and embedded items by stable IDs, locates rationale choices by stable `refId`, rejects duplicate paths, and fails closed on missing targets or stale preconditions. Dry run preceded the authorized invocation.

Authorized reason: `naturalize learner-facing producer vocabulary and repair the ICI-colitis dual-unit temperature display`.

The patch changed 62 exact string paths across 32 top-level items:

| Dimension | Count |
|---|---:|
| `burn-canonical.json` | 1 path |
| `gpt-canonical.json` | 59 paths |
| `hard-cases-canonical.json` | 1 path |
| `io-canonical.json` | 1 path |
| English | 50 paths |
| Simplified Chinese | 12 paths |
| rationale | 38 paths |
| stem | 9 paths |
| `testTakingStrategy` | 6 paths |
| highlight segments | 6 paths |
| cloze stem | 3 paths |

All five stem items retained their embedded protocol, sequence, threshold, or route-selection construct. All three strategy leaks were naturalized. Rationale-only HIGH fields used bounded substitutions that retained the same facts, values, relationships, sequence, and conclusion. All 15 architect annex rows were reviewed and naturalized, including the two annex-only items. The 49 unique HIGH/annex source paths were dispositioned; the remaining changes are paired-language parity edits and the specifically authorized ICI clarification/temperature fields.

## ICI-colitis proof

For `gpt_format8c_ici_colitis_escalation`:

- usual baseline is now explicit: one formed stool daily;
- current day is now explicit: six watery stools total;
- the arithmetic remains five stools above baseline (`6 - 1 = 5`);
- the infection caveat moved from the task instruction to the rationale: infectious causes must be evaluated before immune-mediated colitis is confirmed;
- `38.3 °C × 9/5 + 32 = 100.94 °F`, displayed at the preserved one-decimal precision as `100.9 °F (38.3 °C)` in English and `100.9 °F（38.3 °C）` in Chinese;
- highlight segment IDs and keyed selection remain `s2`, `s3`, `s4`, `s5`, `s6`.

The other note facts remain unchanged: blood and mucus, new lower-abdominal cramping, orthostatic dizziness/dry mouth, unchanged mild fatigue, and a soft abdomen without guarding or rebound.

## Exact-diff and parity proof

A parsed-object reconstruction began with each affected bank at starting HEAD, applied only the 62 declared `before`→`after` values, and compared the complete result with the live post-patch bank. It passed for all four banks. This proves no unplanned value, question ID, answer key, option/segment/ref ID, scoring field, category, topic, difficulty, item type, `ngnSkill`, source, visual, structured measurement, exhibit, stage, array order, or surrounding text changed. Per-bank question counts stayed 8, 771, 66, and 8 respectively.

Every changed English/Chinese pair was compared for the same values, thresholds, timing, actions, and selected/unselected meaning. Chinese was changed only where necessary to remove the same label, preserve parity after the ICI clarification, or naturalize the PN criteria language. This is implementation-seat parity review only; the independent checker still owns final clinical and bilingual clearance.

## Residuals and idempotency

`codex-post-remediation.json` records:

- 1,942 canonical items scanned;
- zero HIGH occurrences and zero HIGH items;
- zero advisory bare-`lane` residuals.

A second patch dry run reported zero pending paths and zero writes for all four banks. The focused regression passed, including the live-bank zero-HIGH assertion, nested-case/exhibit traversal, rationale and strategy coverage, `meta.source` exclusion, annex-only behavior, duplicate-hit evidence, and shared-lexicon ownership.

## Verification

- `npx tsx scripts/tests/producer-vocabulary-leakage.ts` — PASS
- `npx tsx scripts/producer-vocabulary-leakage-manifest.ts` — PASS; post manifest written
- patch dry run before apply — PASS; 62 pending paths
- authorized canonical patch — PASS; 62 paths applied
- second patch dry run — PASS; zero pending paths/writes
- parsed exact-diff and ICI arithmetic/conversion gate — PASS
- `npm run test:highlight` — PASS
- `npm run validate-bank -- banks/*.json` — PASS; all 13 banks
- `npm run audit` — gate passed; new Tier-1 check PASS, 2,673 IDs unique. The standing integrity `INSUFFICIENT` result (no raw drafts) and 451 stage-reference advisory findings remain unrelated to this patch.
- `npm run coverage-report` — PASS; 1,942 session units, 2,528 scored leaves, 199 visual artifacts
- `npm run census` — PASS; same populations
- `npm run census:check` — PASS
- `npx tsc -b --pretty false` — PASS
- `npm run build` — PASS; existing large-chunk advisory only
- `git diff --check` — PASS

`census.json` and `BANK-CENSUS.md` changed only in generated timestamp/input-HEAD metadata; all population counts are unchanged.

## Handoff

The non-GPT checker must review every changed learner-facing field, especially the five stems, three strategies, all Chinese changes, the ICI stool arithmetic/infection-caveat placement/temperature display, the rationale substitutions, and all 15 bare-`lane` annex rows. Until that review lands, the bank-content disposition is not `COMPLETE`; it remains `READY_FOR_INDEPENDENT_CONTENT_REVIEW` / `AWAITING_INDEPENDENT_CONTENT_REVIEW`.
