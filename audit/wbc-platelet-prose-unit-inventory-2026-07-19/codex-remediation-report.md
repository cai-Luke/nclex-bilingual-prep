# Codex WBC / Platelet Prose Unit Remediation Report

Date: 2026-07-20  
Verdict: `COMPLETE`

## Repository boundary

- Branch: `main`
- Starting HEAD: `abc26db55340832f960ecce8bb5b473d1523f339`
- Starting staged paths: none
- Starting canonical-bank modifications: none
- Starting modified paths: `NCLEX-Question-Schema.md`, `PROJECT-HISTORY.md`,
  `lab-reference-range-verification-spec.md`, `package.json`, and the three live
  `src/visuals/kinds/lab_trend/{defs,index,types}.ts` files.
- Starting untracked paths: the CasePilot handoff, this task's handoff, Gemini inventory spec,
  lab-reference audit, Gemini/Sonnet WBC inventory directory, and the lab-trend reference-band test.
- Task-attributable ending paths: four canonical banks, `BANK-REVIEW-LEDGER.md`, refreshed
  `BANK-CENSUS.md` / `census.json`, the audit/test/patch scripts, and the `codex-*` artifacts in this
  directory.
- The pre-existing `PROJECT-HISTORY.md` and unrelated lab-trend/reference-range changes were not
  edited, stashed, reset, reformatted, or absorbed.

## Live authority and policy

Read `AGENTS.md`, `docs/AGENTS-RUNBOOK.md`, `DECISIONS.md`, `PROJECT-HISTORY.md`,
`src/measurementUnitPolicy.ts`, `src/measurementAllowlist.ts`, and
`src/visuals/kinds/lab_trend/defs.ts` before mutation. Live policy matched the handoff:

- WBC and platelet canonical display: `×10³/µL`.
- Raw `/µL`, `/μL`, `/uL`, `/mcL`, `/mm3`, and `/mm³` counts scale by `0.001`.
- `x 10^3/uL`, `×10³/µL`, `K/µL`, and `×10⁹/L` preserve numeric magnitude.

No policy-drift stop condition was present.

## Authoritative corrected inventory

Gemini's 334 parsed rows (252 unique paths) were used only as locator evidence. Its `COMPLETE`
verdict was rejected because the structural traversal omitted `rationale.correct`, admitted
non-blood/non-count quantities, misparsed spaced canonical units and dual displays, applied the wrong
factor to `x 10^3/uL`, polluted parity results, and did not meet the required sort key.

The independent recursive traversal produced 392 occurrence rows across 274 unique learner-facing
paths. It retained 251 of Gemini's 252 candidate paths; the one removed path was a non-count platelet
percentage/day mnemonic rather than a patient count expression. On corrected row granularity, 365
rows were found on seed-linked path/analyte pairs and 27 were independent discoveries. The traversal
found 21 occurrences across 19 `rationale.correct` paths and includes all 17 paths in Sonnet's missed
surface list.

### Occurrence counts

| Dimension | Counts |
|---|---|
| Analyte | platelets 224; WBC 168 |
| Language | EN 194; ZH 198 |
| Bank | claude 44; gemini 51; gpt 181; hard-cases 116 |
| Surface | exhibit 250; rationale 36; stem 36; matrix 26; highlight 22; option 10; other 8; cloze 4 |
| Form | alternate source 347; canonical primary 12; noncanonical dual display 8; missing/implicit 21; canonical-magnitude noncanonical token 2; unresolved explicit natural-language unit 2 |
| Occurrence disposition | normalize explicit 345; normalize token only 14; preserve implicit 17; exclude non-blood 9; exclude non-count 5; blocked 2 |

Path aggregation produced 274 non-overlapping dispositions: 247 `NORMALIZE_EXPLICIT`, 4
`NORMALIZE_TOKEN_ONLY`, 10 `PRESERVE_IMPLICIT`, 6 `EXCLUDE_NON_BLOOD`, 5
`EXCLUDE_NON_COUNT`, and 2 `BLOCKED_CONTEXT`.

The corrected manifest is lexicographically sorted by bank, top-level ID, embedded ID (null as an
empty string), JSON path, and occurrence index. Repeated expressions retain deterministic offsets and
occurrence indices.

## Owner-adjudicated residual closure

The pre-owner-adjudication inventory's two blocked rows were the same bilingual platelet
transfusion-threshold fact in
`opus_agvd_case_agvhd_01`:

- `banks/gemini-canonical.json` `questions[768].caseStudy.summary.en`:
  `platelet transfusion threshold of ten thousand per microliter`
- `banks/gemini-canonical.json` `questions[768].caseStudy.summary.zh`:
  `血小板输注阈值为1万/微升`

These explicit natural-language value/unit forms were outside the live parser's accepted source
tokens. The owner subsequently adjudicated the exact bilingual normalization without widening the
parser. `scripts/patches/2026-07-20-wbc-platelet-natural-language-residual.ts` applied only:

- `platelet transfusion threshold of ten thousand per microliter` →
  `platelet transfusion threshold of 10 ×10³/µL`
- `血小板输注阈值为1万/微升` → `血小板输注阈值为 10 ×10³/µL`

The excluded population includes CSF, ascitic, and urine WBC expressions plus corrected-count-
increment and other non-patient-count arithmetic. Implicit/unitless displays remain untouched.

## Canonical patch

The frozen disposition plan generated 251 exact full-string `before` → `after` `replaceText`
operations in `scripts/patches/2026-07-20-wbc-platelet-prose-unit-normalization.ts`. Stable top-level
question IDs and semantic nested ID selectors were used wherever available. Canonical mutation ran
only through `runPatch` in `--allow-canonical` mode with reason:

> normalize learner-facing WBC and platelet prose to the ratified conventional display policy

Affected banks and path counts:

- `banks/claude-canonical.json`: 24 paths
- `banks/gemini-canonical.json`: 37 paths, including the 2 owner-adjudicated summary residuals
- `banks/gpt-canonical.json`: 112 paths
- `banks/hard-cases-canonical.json`: 80 paths

Together the two declarative patches normalized 361 explicit occurrences: 150 WBC and 211 platelet
occurrences. There were 126 EN and 127 ZH changed paths. The one one-sided path is a ZH-only threshold absent from its EN
rationale; no content was invented in the shorter locale. All structurally same-fact bilingual
measurements were paired and numerically equivalent.

## Exact-diff and parity proof

Parsed HEAD bank objects were compared recursively with post-write objects. The actual changed JSON
path set exactly equaled the original 251 authorized disposition paths, and the owner-adjudicated
follow-up added exactly the two declared `caseStudy.summary` paths. No array length/order, key set,
question/embedded ID, answer/scoring field, category/topic/item type/difficulty, exhibit/stage/visual,
structured measurement, or metadata value changed. Top-level and embedded populations were
unchanged. Git reports 253 line replacements (253 insertions / 253 deletions), matching the combined
path set.

Each changed substring is generated from analyte-keyed live conversion factors. Comparators, range
endpoints, current/prior values, and all non-scoped surrounding bytes were preserved. The focused
tests prove the result-plus-reference-range and current-plus-prior-timepoint cases independently.
The `cs_thyroid_storm_q4` option and `rationale.correct` both now contain `2.8 ×10³/µL`.

## Residual closure and idempotency

The final post-write structural scan produced 386 occurrences and zero `BLOCKED_CONTEXT`,
`NORMALIZE_EXPLICIT`, or `NORMALIZE_TOKEN_ONLY` rows globally. Remaining path dispositions are 249
`ALREADY_CANONICAL`, 11 `PRESERVE_IMPLICIT`, 9 `EXCLUDE_NON_BLOOD`, and 5 `EXCLUDE_NON_COUNT`.
The original bulk patch and the owner-adjudicated residual patch both report `bankWritesRequired: 0`
on dry run.

The original Gemini manifest/report and Sonnet checker report remained byte-identical:

- `manifest.jsonl`: `07b1dc85d603ded269676ae6e6ca259a71b99c58fe06f0c9e014a1af8259e6f0`
- `report.md`: `0d9e97dfa006944ce8800d4dcb9f75cf5f788e5d5edd3efb31f2b46f2106787f`
- `sonnet-check.md`: `3c4651f7613c7a88a6354c31d5b3d59e901ad1a96fd0ab3438572e748521d738`

## Verification

Passed:

- `npx tsx scripts/tests/wbc-platelet-prose-unit-remediation.ts`
- `npx tsx scripts/audit/wbc-platelet-prose-unit-remediation.ts --post`
- exact-diff proof for the original 251-path plan plus the exact paired 2-path owner-adjudicated patch
- post-application dry runs for both patch applicators (`bankWritesRequired: 0`)
- `npm run test:measurement-allowlist`
- `npm run test:structured-measurements`
- `npm run validate-bank -- banks/*.json` (all 13 banks)
- `npm run audit` (exit 0; 2,673 globally unique IDs; pre-existing integrity-insufficient and
  advisory stage/distribution findings remain outside this prose-only correction)
- `npm run coverage-report`
- `npm run census`
- `npm run census:check`
- `npx tsc -b --pretty false`
- `npm run build` (only the existing large-chunk advisory)
- `git diff --check`

Census population remained exactly 1,942 session units, 2,528 scored leaves, and 199 visual
artifacts. `BANK-CENSUS.md` and `census.json` changed only in generated timestamp/input-HEAD metadata;
all population data remained unchanged.

## Final verdict

`COMPLETE`: every scoped explicit blood-CBC WBC/platelet unit expression is canonical; the
owner-adjudicated natural-language pair is closed; exact diffs, bilingual parity, residual closure,
and idempotency are proved.
