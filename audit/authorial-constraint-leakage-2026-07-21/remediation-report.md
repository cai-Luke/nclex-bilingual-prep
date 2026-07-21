# Authorial-Constraint Leakage Remediation Report

Final verdict: `FIXED_AND_VALIDATED`. Independent non-GPT review cleared both the original
exercise-hypoglycemia repair and the post-survey PEP residual repair.

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
- Initial forcing repair bank SHA-256: `0336d3e52ef809f6194201ba5057832428df814b4e0e6d03a80cd3522ba223f9`
- Post-survey PEP residual repair bank SHA-256: `61664a6bef854ec8d7a3a0113779a4773135724aabfdec65b970b7ac6464c5d2`

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
- Ambiguous residuals or blocked rewrites found by the configured baseline signatures: 0

All four candidate rows were adjudicated `CONFIRMED_AUTHORIAL_CONSTRAINT_LEAK`. Full field text, sentence
offsets, prompt provenance, evidence, preserved boundary, and exact replacements are recorded in
`baseline.jsonl` and `adjudication.jsonl`.

This count is not an exhaustive-recall claim. After publication, architect review found one semantic
post-survey residual in `gpt_format10c_occupational_sharps_hiv_pep_sequence`; see
`post-survey-residuals.jsonl` and `pep-residual-independent-review-handoff.md`.

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

## Post-survey PEP residual and repair

The original PEP ordered-response stem ended with:

> Place the supplied actions in order. Source-patient testing and exposed-worker testing are separate processes; do not delay indicated PEP for a source result.

The clinical no-delay rule is valid, but the sentence functioned as a producer adjudication note.
Live option B bundled exposed-worker baseline testing with source-patient testing, while option C
started PEP, thereby forcing urgent/concurrent processes into a serial B→C relationship and then
explaining that ambiguity to the learner. Architect disposition: `BLOCKED_ITEM_REWRITE`.

Direct verification against the 2025 U.S. Public Health Service guideline confirmed that PEP should
start as soon as possible, source HIV status should be determined whenever possible, PEP must not be
delayed for that status, and exposed-HCP baseline tests should be obtained as soon as possible.

Applied 14 exact EN/ZH full-field operations through
`scripts/patches/2026-07-21-pep-authorial-constraint-residual.ts` with reason:

> repair post-survey PEP authorial-constraint residual and preserve clinically concurrent urgent actions

The repaired stem asks only for the exposed nurse's care. Option B now reports the exposure and begins
occupational-health evaluation. Option C combines exposed-worker baseline collection and indicated
PEP initiation as one urgent initial-evaluation step. Source-client testing no longer appears in the
ordered actions; it remains in the rationale as a concurrent process that must not delay PEP. The
strategy now orders care by genuine time horizons. The key remains A→B→C→D→E, and no identity,
metadata, source, scoring, option/ref ID, array order, or population changes.

The patch passed dry-run, strict bilingual parity, post-write bank validation, and a final
idempotency run with zero pending writes. Independent clinical/bilingual review subsequently cleared
all 14 changed fields and re-derived the repaired A→B→C→D→E sequence as uniquely defensible.

A recursive parsed-object comparison against merged `origin/main` reported exactly the 14 declared
paths: paired stem, correct rationale, B/C per-choice rationale, strategy, and B/C option text. No
other parsed value changed. `gpt-canonical.json` remains 771 questions with `meta.count` 771; its key
remains exactly A→B→C→D→E. Census regeneration changed only the canonical content hash and preserved
1,942 session units, 2,528 scored leaves, and 199 visual artifacts.

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

Post-remediation results for the configured finite signatures were 0 candidates and 0 blockers.
`post-remediation.jsonl` is intentionally empty for that scan snapshot; it never proved exhaustive
semantic recall. The PEP item is preserved separately as a post-survey residual, and its three exact
observed construction phrases are now advisory-only signatures. Broad `do not delay` matching remains
unauthorized because it would collide with legitimate clinical teaching.

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

Post-survey PEP residual rerun also passed:

- `npx tsx scripts/tests/authorial-constraint-pep-residual.ts`
- existing authorial-constraint and producer-vocabulary focused suites
- grading and schema-bank regressions
- post-repair finite-signature survey: 0 candidates / 0 blockers
- all 13 bundled banks validated
- aggregate audit: gate passed; only the same pre-existing advisories
- coverage report and census regeneration/check with unchanged populations
- TypeScript, production build, build-identity validation, and `git diff --check`

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

That closure did not establish exhaustive semantic recall. A later architect adjudication found the
PEP residual outside the checker's trailing-sentence predicate and the configured finite signatures.
The original bowtie review remains valid.

Independent non-GPT review of the PEP residual then completed all seven handoff checks. The checker
re-derived the sequence, verified that option C does not serialize baseline testing ahead of PEP,
confirmed source-patient testing is absent from the ordered actions, reviewed all 14 changed EN/ZH
fields, verified the three exact residual signatures remain advisory-only, confirmed the report and
ledger make no exhaustive-recall claim, and personally reran `validate-bank` and the aggregate audit.
The final record is `pep-independent-review-final.md`; its verdict is `CLINICALLY_CLEARED`, and the
PEP ledger entry is closed as `fixed-and-validated`.
