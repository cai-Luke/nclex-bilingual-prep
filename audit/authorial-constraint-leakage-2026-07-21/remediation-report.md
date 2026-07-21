# Authorial-Constraint Leakage Remediation Report

Final verdict: `REVIEWED_AND_READY_TO_PUBLISH`.

## Snapshot and scope

- Starting branch: `main`
- Starting HEAD: `408a4706c5878bd0991c8baf88b5807bf0bb9091`
- Upstream: `origin/main`; ahead/behind `0/0`
- Starting tracked dirty paths: none
- Starting untracked path: `AUTHORIAL-CONSTRAINT-LEAKAGE-CODEX-SPEC-2026-07-21.md`
- Ending task-owned modified paths: `AGENTS.md`, `BANK-CENSUS.md`, `BANK-REVIEW-LEDGER.md`,
  `DECISIONS.md`, `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md`, `GeminiPrompt.md`,
  `NCLEX-Bank-Generation-Prompt.md`, `PROJECT-HISTORY.md`, `banks/gpt-canonical.json`,
  `census.json`, `gpt-evergreen-generation-prompt.md`, and `scripts/audit.ts`, plus the new survey,
  audit, test, patch, and report artifacts listed by this report.
- The original `AUTHORIAL-CONSTRAINT-LEAKAGE-CODEX-SPEC-2026-07-21.md` is retained as this task's
  governing work order. Ending unrelated untracked path preserved untouched:
  `LAB-TREND-EPIC-STYLE-DUAL-SERIES-MIGRATION-CODEX-SPEC-2026-07-21.md`.
- Bundled population: 13 top-level bank files, 1,942 top-level questions, 2,528 scored leaves
- Forcing bank starting SHA-256: `cdb2ce9b06c759cf33e0d507904da9de26bbc132e1321d3ba2479d91b095f370`
- Forcing bank ending SHA-256: `0336d3e52ef809f6194201ba5057832428df814b4e0e6d03a80cd3522ba223f9`

The shared `collectLearnerFacingFields()` traversal includes standalone and embedded stems, response
tokens, case/stage/exhibit prose, rationales, strategies, prompts, titles, captions, and glossary
text. It excludes `meta`, audit/provenance/compile blocks, answer keys, numeric specifications, stable
IDs/references, enum/configuration values, and source strings. This reuses the existing rendered-prose
boundary; no second recursive learner-surface definition was introduced.

## Forcing item

Exactly one live match was found:

- Bank: `banks/gpt-canonical.json`
- Top-level ID: `gpt_format7c_exercise_hypoglycemia_bowtie`
- Embedded ID: none
- Item type: `bowtie`
- Paths: `stem.en`, `stem.zh`, `testTakingStrategy.en`, `testTakingStrategy.zh`
- Source metadata: CDC DSMES plus ADA Standards of Care in Diabetes—2026 sections 5, 6, and 7
- Key structure: 1 condition, 2 actions, 2 parameters

The item remains unambiguous without the disclaimer. `act_hypo_safety` treats a current episode via
the existing hypoglycemia plan and rapid carbohydrate. `act_team_plan` collaborates with the diabetes
prescriber/DSMES team on a future individualized exercise-day carbohydrate/medication plan.
`act_raise_insulin` remains an explicitly independent increase and remains incorrect. The correct
rationale and strategy continue to explain that dose changes require the prescribed plan or clinical
team. No keyed token directs the learner to select or prescribe a dose independently.

## Prompt provenance and inventory

Inspected active or portable producer instructions:

- `GeminiPrompt.md`: exact forcing provenance — “Do not imply that a nurse independently prescribes,
  diagnoses, performs surgery, inserts invasive provider-level devices, or changes medication orders
  without protocol/order support.”
- `gpt-evergreen-generation-prompt.md`: active closed-world semantic floor and producer self-check.
- `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md`: active private-blueprint and learner-surface
  leakage controls.
- `NCLEX-Bank-Generation-Prompt.md`: portable general bank-generation contract.

The finite provenance map lives in `lib/authorial-constraint-leakage.ts`. Unattributed candidate
shapes are marked `UNATTRIBUTED_CONSTRAINT_SHAPE`; the survey never invents producer provenance.

Baseline results:

- Total candidates: 4 occurrences in 1 distinct item and 1 bank
- By family: Family A direct scope constraint 2; Family D observed Chinese counterpart 2; Families B/C 0
- By surface: `TASK_STEM_OR_INSTRUCTION` 2; `TEST_TAKING_STRATEGY` 2; every other class 0
- By language: English 2; Simplified Chinese 2
- By producer prefix: `gpt_` 4
- Confirmed leaks: 4 paths in 1 item
- Ambiguous residuals or blocked rewrites: 0

Both candidate rows were adjudicated `CONFIRMED_AUTHORIAL_CONSTRAINT_LEAK`. Full field text, sentence
offsets, prompt provenance, evidence, preserved boundary, and exact replacements are recorded in
`baseline.jsonl` and `adjudication.jsonl`.

## Exact repair and preservation proof

Applied declaratively through
`scripts/patches/2026-07-21-authorial-constraint-naturalization.ts` and `scripts/patch-raw.ts` with
reason:

> remove learner-facing authorial constraint leakage while preserving nursing-scope logic in choices and rationales

Changed paths:

1. `gpt_format7c_exercise_hypoglycemia_bowtie` `stem.en`: removed only “Do not independently
   prescribe an insulin dose.” The English stem now ends with the complete bowtie response demand.
2. The same item's `stem.zh`: removed only “不要自行开立胰岛素剂量。” The Chinese stem now ends with
   its equivalent complete response demand.
3. The same item's `testTakingStrategy.en`: replaced the appended prescription-change constraint with
   ordinary reasoning guidance to use the existing hypoglycemia plan for immediate safety and involve
   the diabetes team in future exercise planning.
4. The same item's `testTakingStrategy.zh`: applied the meaning-equivalent strategy naturalization.

A recursive parsed-object comparison against `HEAD:banks/gpt-canonical.json` reported exactly four
differences: `questions[692].stem.en`, `questions[692].stem.zh`,
`questions[692].testTakingStrategy.en`, and `questions[692].testTakingStrategy.zh`. The ordinary Git
diff likewise contains only those four full-string replacements in the bank. No array length or order changed. No ID,
item type, category, topic, difficulty, `ngnSkill`, source, key, token/ref ID, scoring, visual,
structured measurement, exhibit, or stage changed. `meta.count` and the top-level question length both
remain 771. The project populations remain 1,942 session units, 2,528 scored leaves, and 199 visual
artifacts. Generated census files changed only their recorded `gpt-canonical.json` content hash.

English/Chinese clinical facts and response demands remain equivalent. Both surfaces received the
same deletion; strict patch parity produced no warning. The scope boundary remains explicit in the
choices, correct rationale, per-choice rationale for `act_raise_insulin`, and strategy.

The dry run succeeded before each canonical application tranche (paired stems, then the grammar-found
paired strategies). The final post-apply rerun reported “Pending paths: 0; zero writes,” proving patch
idempotency; on a clean starting snapshot the finalized script declares all four exact operations.

## Prospective controls

The Tier-1 blocker is intentionally narrow: on task-stem/instruction or test-strategy surfaces only,
it blocks the confirmed `Do not independently <finite provider-level verb>` and `without independently
<finite provider-level gerund>` shapes plus the two exact observed Chinese counterparts. The
provider-level verb set is finite and prompt-derived. Broader
scope-construction and checker-directive shapes remain standalone-survey candidates only. Options,
rationales, client teaching, and legitimate Management of Care scope questions do not fail
mechanically.

Governance was updated in `AGENTS.md` and the principle-21 construction-language application in
`DECISIONS.md`. The four inspected active/portable producer prompts now require scope boundaries to be
embodied in scenario, choices, and rationale and require a pre-delivery learner-surface scan. The
existing producer-vocabulary lexicon and audit were not renamed, weakened, or broadened.

Post-remediation results: 0 candidates, 0 blockers, 0 advisory residuals. `post-remediation.jsonl` is
therefore intentionally empty.

## Verification

Passed:

- `npx tsx scripts/tests/authorial-constraint-leakage.ts`
- `npx tsx scripts/authorial-constraint-leakage-survey.ts`
- post-remediation survey to `post-remediation.jsonl`
- standalone authorial-constraint audit: `PASS`
- `npx tsx scripts/tests/producer-vocabulary-leakage.ts`
- `npm run validate-bank -- banks/*.json` (13/13)
- `npm run audit` (`GATE PASSED`; new Tier-1 audit `PASS`)
- `npm run coverage-report`
- `npm run census`
- `npm run census:check`
- `npx tsc -b --pretty false`
- `npm run build` and build-identity validation
- `git diff --check`

Expected pre-existing/nonblocking audit output remains: no raw drafts for the integrity comparison;
451 legacy case-stage `revealsAllStages` advisories; and the pre-existing non-MCQ distributional
advisory. The Vite large-chunk advisory is unchanged.

## Independent-review closure

Independent non-GPT review completed 2026-07-21. The checker directly verified the exact four-field
bank diff against the adjudication preimages/results; re-read the full live bowtie and confirmed its
1/2/2 key and retained scope boundary; independently scanned bundled task/strategy surfaces for
prohibition-shaped leakage; inspected bilingual parity, blocker/negative-test coverage, prompt and
governance diffs, and Tier-1 wiring; and reran the complete verification floor successfully. The
ledger is closed as `REVIEWED` / `fixed-and-validated`.

The checker run temporarily overwrote `baseline.jsonl` with the empty post-fix survey output. Before
publication, Codex restored the four original deterministic baseline rows from the already-recorded
exact evidence; `post-remediation.jsonl` remains the intentionally empty live result.
