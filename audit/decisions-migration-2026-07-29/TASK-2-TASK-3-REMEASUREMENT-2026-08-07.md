# Task 2 / Task 3 remeasurement against the repaired manifest

## Authorization identity

- Work order: `DECISIONS-MIGRATION-STAGE-2A-TASK-2-TASK-3-REMEASUREMENT-WORK-ORDER-2026-08-07.md`
- Revision: 1, immutable and owner-acknowledged
- Independently measured byte length: **10411**
- Independently measured SHA-256: **`7ec62168150d243112b28a13c12d3ed3bb25bdfa109874c67b635534d52b566c`**

## Opening identity verification

| item | measured value | expected | result |
|---|---|---|---|
| Branch | `codex/decisions-migration` | same | PASS |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` | same | PASS |
| Manifest | 314811 bytes / `e99335567d157a86f8f2b6f178b7222bf86ccfe15e5f827da5a03864c1d04b31` | same | PASS |
| `DECISIONS.md` | 76314 bytes / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | same | PASS |
| `DECISIONS.md` vs `MIGRATION_BASELINE` | byte-identical; baseline has the same length and SHA-256 | byte-identical | PASS |
| Tracked worktree diff | none | none | PASS |
| Staged diff | none | none | PASS |

## Opening `git status --porcelain`

```text
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-BLOCK-GROUPING-WORKSHEET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CANDIDATE-REGIONS-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-ADDENDUM-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-RECEIPT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-WORK-ORDER-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-COMPLETION-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-FRESH-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-FRESH-REVIEW-NARROW-RECOMMISSION-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-GPT-DETERMINISTIC-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-HEADER-MEASUREMENT-WORK-ORDER-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-CONFIRMING-READ-RERUN-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-RESERVATION-RECORDING-REPAIR-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4.35-EXCLUSIVITY-REPAIR-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-M4.4-ADJACENT-WHITESPACE-REPAIR-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-COMPLETION-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-PRE-CENSUS-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-VERIFICATION-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-MANIFEST-SCAFFOLD-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-BINDING-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-07-31.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-P7-DATE-CORRECTION-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-A-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-AUTHORING-WORK-ORDER-2026-07-31.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PATH-CANDIDATE-WORKSHEET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-TASK-2-TASK-3-REMEASUREMENT-WORK-ORDER-2026-08-07.md
?? audit/decisions-migration-2026-07-29/
```

Only untracked Stage 2a paths are present; there are no modified tracked files and no staged changes.

## Task 2 — complete 65-record sentence-count remeasurement

### Script-source line item

The exported `countStatementSentences` in `lib/decisions-format.ts` was read before the harness. Its actual boundary test scans punctuation runs containing `.`, `?`, or `!`; skips decimal-internal period runs and recognized abbreviations; skips closing ASCII/curly quotes, apostrophes, backticks, parentheses, and brackets; and counts a boundary only at end-of-string or after whitespace when the next non-whitespace character is Unicode uppercase (or no character remains).

The harness extracted only the exact payload inside each M4 record's item-8 `text` fence and passed that payload directly to the real exported function. It did not pass the fence, item label, heading, fields, rationale, or any other bytes.

### Results

- Full 65-record distribution: **1=4 / 2=23 / 3=37 / 4=1**.
- M4.2–M4.44 subset distribution (43 records): **2=10 / 3=32 / 4=1**.
- Outside `{1,2,3}`: **M4.35 / P28#0, count 4**.
- First character is a backtick: **none**.
- Comparison with 2026-08-04: **M4.35 changed from 3 to 4; the other 64 records are unchanged**.

M4.35's exact item-8 statement now has four boundaries:

```text
Content-planning reports measure what is scored: standalone top-level questions plus embedded
case-study questions, excluding case-study containers, with each embedded leaf contributing its own
category, topic, item type, and difficulty, and parent-case metadata never standing as evidence
about a leaf. Generation prompt parameters draw only from this same scored-leaf population. Delivery and
inventory reports measure what can be served, on the top-level session-unit population, and their capacity warnings never change the content-planning denominator,
while visual inventory is a third, recursive artifact population rather than an alias for either
question denominator. A `case_study` is a delivery container and may not enter equal-average
scored-item-type targets unless a case-cadence target is separately ratified.
```

This is a **REQUIRED REPAIR** finding under the work order. It is reported only; no wording or manifest byte was changed.

### Raw Task 2 stdout

```text
TASK2_SCRIPT_BOUNDARY=punctuation run .?!; skip decimal-internal runs and recognized abbreviations; skip closing quotes/apostrophes/backticks/parentheses/brackets; count only at end-of-string or after whitespace when next non-whitespace is Unicode uppercase (or no character remains)
TASK2_HARNESS_INPUT=exact item-8 text-fence payload only; no fence, item label, heading, fields, or other bytes
TASK2	M4.2	`P1#0`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.3	`P2#0`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.4	`P2#1`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.5	`P3#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.6	`P4#0`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.7	`P5#0`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.8	`P5#1`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.9	`P6#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.10	`P7#0`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.11	`P8#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.12	`P10#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.13	`P11#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.14	`P15#0`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.15	`P15#1`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.16	`P16#0`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.17	`P16#1`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.18	`P16#2`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.19	`P17#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.20	`P19#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.21	`P20#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.22	`P21#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.23	`P21#1`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.24	`P21#2`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.25	`P23#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.26	`P23#1`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.27	`P23#2`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.28	`P24#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.29	`P25#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.30	`P25#1`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.31	`P25#2`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.32	`P25#3`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.33	`P26#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.34	`P27#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.35	`P28#0`	count=4	prior=3	comparison=CHANGED	first_char_backtick=no
TASK2	M4.36	`P29#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.37	`P30#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.38	`P31#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.39	`R1#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.40	`R2#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.41	`R3#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.42	`R4#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.43	`R5#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.44	`R6#0`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.45	`Producer assignments are operational state, not constitutional text`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.46	`Deterministic review routing for promoted opus-prefixed case IDs`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.47	`Runtime audio carries no client-embedded secret`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.48	`Bilingual English and Simplified Chinese parity on all displayed text`	count=1	prior=1	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.49	`Topic labels are English-only`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.50	`JSON quote hygiene is a parse-time gate`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.51	`Question IDs are globally unique across bundled banks`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.52	`Raw-draft filename prefix routes to its canonical bank`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.53	`Canonical merges are deterministic and gated`	count=1	prior=1	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.54	`Runtime stays static, offline, and file-protocol compatible`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.55	`Schema versions are an ordered token, not semver`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.56	`Schema changes are rare and deliberate`	count=1	prior=1	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.57	`Shared visual numeric helpers have a single definition`	count=1	prior=1	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.58	`Case-study exhibit IDs share one namespace`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.59	`Category targets are the current test-plan weights`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.60	`Bank composition is a floor problem, not a balance problem`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.61	`Repository-state hygiene is mechanism-specific`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.62	`Some topics are deliberately shared across categories`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.63	`Highlight's structural bias gate is schema-level`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.64	`Translation-friction scoring`	count=2	prior=2	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.65	`Exam-condition test and adaptive modes`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2	M4.66	`Unresolved vital sanity bounds`	count=3	prior=3	comparison=UNCHANGED	first_char_backtick=no
TASK2_DISTRIBUTION_FULL=1=4 / 2=23 / 3=37 / 4=1
TASK2_DISTRIBUTION_M4_2_TO_44=2=10 / 3=32 / 4=1
TASK2_OUTSIDE_1_2_3=M4.35:count=4
TASK2_FIRST_CHAR_BACKTICK=none
TASK2_CHANGED=M4.35:3->4
TASK2_UNCHANGED=M4.2,M4.3,M4.4,M4.5,M4.6,M4.7,M4.8,M4.9,M4.10,M4.11,M4.12,M4.13,M4.14,M4.15,M4.16,M4.17,M4.18,M4.19,M4.20,M4.21,M4.22,M4.23,M4.24,M4.25,M4.26,M4.27,M4.28,M4.29,M4.30,M4.31,M4.32,M4.33,M4.34,M4.36,M4.37,M4.38,M4.39,M4.40,M4.41,M4.42,M4.43,M4.44,M4.45,M4.46,M4.47,M4.48,M4.49,M4.50,M4.51,M4.52,M4.53,M4.54,M4.55,M4.56,M4.57,M4.58,M4.59,M4.60,M4.61,M4.62,M4.63,M4.64,M4.65,M4.66
TASK2_UNCHANGED_COUNT=64
```

## Task 3 — complete governed field-path re-derivation

The population below was derived independently from item 9 of all 65 live M4 records. M6 and prior receipts were not used to construct it.

### Population and comparison

- Field instances: **20** — unchanged from 2026-08-04.
- Distinct paths: **19** — unchanged.
- Repeated path: **`src/schema.ts`, exactly 2 instances** — unchanged and still the only repeat.
- Population 1: **18 distinct paths requiring tracked verification; all 18 TRACKED; zero UNTRACKED**.
- Population 2: **one EXEMPT path**, E038/M4.45 Evidence.
- Population 2 changed from the stale `Archive/DECISIONS-ARCHIVE-2026-08-11.md` value to **`Archive/DECISIONS-ARCHIVE-2026-08-18.md`**. The live E038 value is byte-equal to the current M0.1 pin; no `2026-08-11` path remains in this governed population.

### Raw Task 3 stdout

```text
TASK3_INSTANCE	M4.2	`P1#0`	Owner	lib/shuffle.ts
TASK3_INSTANCE	M4.14	`P15#0`	Owner	scripts/patch-raw.ts
TASK3_INSTANCE	M4.17	`P16#1`	Owner	scripts/audit/non-mcq-bias-lib.ts
TASK3_INSTANCE	M4.26	`P23#1`	Owner	src/examLayout.ts
TASK3_INSTANCE	M4.36	`P29#0`	Evidence	audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json
TASK3_INSTANCE	M4.37	`P30#0`	Evidence	audit/lab-reference-range-verification-2026-07-19.md
TASK3_INSTANCE	M4.41	`R3#0`	Evidence	Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md
TASK3_INSTANCE	M4.41	`R3#0`	Owner	src/measurementAllowlist.ts
TASK3_INSTANCE	M4.42	`R4#0`	Evidence	Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md
TASK3_INSTANCE	M4.45	`Producer assignments are operational state, not constitutional text`	Evidence	Archive/DECISIONS-ARCHIVE-2026-08-18.md
TASK3_INSTANCE	M4.49	`Topic labels are English-only`	Owner	src/schema.ts
TASK3_INSTANCE	M4.50	`JSON quote hygiene is a parse-time gate`	Evidence	docs/AGENTS-RUNBOOK.md
TASK3_INSTANCE	M4.51	`Question IDs are globally unique across bundled banks`	Owner	scripts/audit/audit-ids.ts
TASK3_INSTANCE	M4.52	`Raw-draft filename prefix routes to its canonical bank`	Owner	lib/canonical-routing.ts
TASK3_INSTANCE	M4.53	`Canonical merges are deterministic and gated`	Owner	scripts/consolidate.ts
TASK3_INSTANCE	M4.57	`Shared visual numeric helpers have a single definition`	Owner	src/visuals/primitives/graphPaper.ts
TASK3_INSTANCE	M4.58	`Case-study exhibit IDs share one namespace`	Owner	src/schema.ts
TASK3_INSTANCE	M4.60	`Bank composition is a floor problem, not a balance problem`	Owner	src/sessionSampler.ts
TASK3_INSTANCE	M4.61	`Repository-state hygiene is mechanism-specific`	Owner	AGENTS.md
TASK3_INSTANCE	M4.62	`Some topics are deliberately shared across categories`	Owner	src/topics.ts
TASK3_PATH	lib/shuffle.ts	TRACKED	git_ls_files_exit=0	stdout="lib/shuffle.ts"	stderr=""
TASK3_PATH	scripts/patch-raw.ts	TRACKED	git_ls_files_exit=0	stdout="scripts/patch-raw.ts"	stderr=""
TASK3_PATH	scripts/audit/non-mcq-bias-lib.ts	TRACKED	git_ls_files_exit=0	stdout="scripts/audit/non-mcq-bias-lib.ts"	stderr=""
TASK3_PATH	src/examLayout.ts	TRACKED	git_ls_files_exit=0	stdout="src/examLayout.ts"	stderr=""
TASK3_PATH	audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json	TRACKED	git_ls_files_exit=0	stdout="audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json"	stderr=""
TASK3_PATH	audit/lab-reference-range-verification-2026-07-19.md	TRACKED	git_ls_files_exit=0	stdout="audit/lab-reference-range-verification-2026-07-19.md"	stderr=""
TASK3_PATH	Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md	TRACKED	git_ls_files_exit=0	stdout="Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md"	stderr=""
TASK3_PATH	src/measurementAllowlist.ts	TRACKED	git_ls_files_exit=0	stdout="src/measurementAllowlist.ts"	stderr=""
TASK3_PATH	Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md	TRACKED	git_ls_files_exit=0	stdout="Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md"	stderr=""
TASK3_PATH	Archive/DECISIONS-ARCHIVE-2026-08-18.md	EXEMPT	git_ls_files=NOT_RUN
TASK3_PATH	src/schema.ts	TRACKED	git_ls_files_exit=0	stdout="src/schema.ts"	stderr=""
TASK3_PATH	docs/AGENTS-RUNBOOK.md	TRACKED	git_ls_files_exit=0	stdout="docs/AGENTS-RUNBOOK.md"	stderr=""
TASK3_PATH	scripts/audit/audit-ids.ts	TRACKED	git_ls_files_exit=0	stdout="scripts/audit/audit-ids.ts"	stderr=""
TASK3_PATH	lib/canonical-routing.ts	TRACKED	git_ls_files_exit=0	stdout="lib/canonical-routing.ts"	stderr=""
TASK3_PATH	scripts/consolidate.ts	TRACKED	git_ls_files_exit=0	stdout="scripts/consolidate.ts"	stderr=""
TASK3_PATH	src/visuals/primitives/graphPaper.ts	TRACKED	git_ls_files_exit=0	stdout="src/visuals/primitives/graphPaper.ts"	stderr=""
TASK3_PATH	src/sessionSampler.ts	TRACKED	git_ls_files_exit=0	stdout="src/sessionSampler.ts"	stderr=""
TASK3_PATH	AGENTS.md	TRACKED	git_ls_files_exit=0	stdout="AGENTS.md"	stderr=""
TASK3_PATH	src/topics.ts	TRACKED	git_ls_files_exit=0	stdout="src/topics.ts"	stderr=""
TASK3_INSTANCE_COUNT=20
TASK3_DISTINCT_PATH_COUNT=19
TASK3_REPEATED_PATHS=src/schema.ts:2
TASK3_POPULATION1_COUNT=18
TASK3_POPULATION1_UNTRACKED=none
TASK3_POPULATION2_COUNT=1
TASK3_M0_1_PIN=Archive/DECISIONS-ARCHIVE-2026-08-18.md
TASK3_E038_VALUE=Archive/DECISIONS-ARCHIVE-2026-08-18.md
TASK3_CLAUSE_A_EQUAL=PASS
TASK3_STALE_2026_08_11_SURFACE=none
TASK3_COMPARISON_2026_08_04=instances:UNCHANGED;distinct:UNCHANGED;repeat:UNCHANGED;population2_path:CHANGED_2026-08-11_TO_2026-08-18
```

## Findings

| class | count | result |
|---|---:|---|
| BLOCKER | 0 | No identity mismatch, Population-1 untracked path, Clause A mismatch, or stale `2026-08-11` governed path. |
| REQUIRED REPAIR | 1 | M4.35/P28#0 returns 4 sentence boundaries; target grammar permits only 1–3. Reported only; no repair performed. |
| ADVISORY | 0 | No advisory finding. |

The zero BLOCKER and ADVISORY results discharge only the measurements represented by those rows; they do not establish constitutional correctness. The REQUIRED REPAIR prevents this Task 2 remeasurement from returning clean.

## Unmeasured / intentionally not performed

The derived date-occurrence report, Stage 2b, post-assembly deterministic verification, owner ratification, and any repair were not measured or begun. This report does not claim those surfaces are absent or clear. The commission-required constitutional-content review is separate and was not reopened.

## Closeout identity verification

| item | closing measurement | result |
|---|---|---|
| Work order | 10411 bytes / `7ec62168150d243112b28a13c12d3ed3bb25bdfa109874c67b635534d52b566c` | PASS — equal to acknowledged opening identity |
| Manifest | 314811 bytes / `e99335567d157a86f8f2b6f178b7222bf86ccfe15e5f827da5a03864c1d04b31` | PASS — unchanged |
| `DECISIONS.md` | 76314 bytes / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` | PASS — unchanged |
| Branch | `codex/decisions-migration` | PASS — unchanged |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` | PASS — unchanged |
| Tracked worktree diff | none | PASS |
| Staged diff | none | PASS |

## Post-report `git status --porcelain`

```text
?? DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-BLOCK-GROUPING-WORKSHEET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CANDIDATE-REGIONS-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-ADDENDUM-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DATE-PROVENANCE-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-CODEX-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREP-RECEIPT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-WORK-ORDER-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-COMPLETION-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-FRESH-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-FRESH-REVIEW-NARROW-RECOMMISSION-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-FULL-CONSTITUTIONAL-REVIEW-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-GPT-DETERMINISTIC-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-HANDOFF-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-HEADER-MEASUREMENT-WORK-ORDER-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-LIVE-SOURCE-PACKET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-ANAPHORA-REPAIR-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-OWNER-CONFIRMING-READ-RERUN-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4-RESERVATION-RECORDING-REPAIR-WORK-ORDER-2026-08-05.md
?? DECISIONS-MIGRATION-STAGE-2A-M4.35-EXCLUSIVITY-REPAIR-WORK-ORDER-2026-08-07.md
?? DECISIONS-MIGRATION-STAGE-2A-M4.4-ADJACENT-WHITESPACE-REPAIR-WORK-ORDER-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-COMPLETION-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-PRE-CENSUS-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-VERIFICATION-CODEX-WORK-ORDER-2026-08-04.md
?? DECISIONS-MIGRATION-STAGE-2A-MANIFEST-SCAFFOLD-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-BINDING-2026-07-30.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-07-31.md
?? DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-08-06.md
?? DECISIONS-MIGRATION-STAGE-2A-P7-DATE-CORRECTION-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-A-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-B-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-AUTHORING-WORK-ORDER-2026-07-31.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-C-GPT-REVIEW-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-PATH-CANDIDATE-WORKSHEET-2026-07-29.md
?? DECISIONS-MIGRATION-STAGE-2A-TASK-2-TASK-3-REMEASUREMENT-WORK-ORDER-2026-08-07.md
?? audit/decisions-migration-2026-07-29/
```

The post-report snapshot again contains only untracked Stage 2a paths. No tracked or staged file changed, and the sole authorized report remains untracked.
