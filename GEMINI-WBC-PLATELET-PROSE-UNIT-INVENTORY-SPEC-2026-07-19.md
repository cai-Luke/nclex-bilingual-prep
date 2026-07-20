# WBC / Platelet Learner-Facing Unit Residual Inventory — Gemini Research Spec

Date: 2026-07-19
Owner: Gemini in Antigravity
Status: ready to run
Mode: deterministic inventory + evidence capture only; non-mutating research task

## 1. Purpose

Inventory every learner-facing WBC or platelet count expression in the bundled canonical question banks so a later Codex task can determine whether any legacy prose should be normalized to the already-ratified display policy.

This task does **not** reopen the unit architecture. The live policy is already settled:

- WBC and platelet display is conventional-primary: `×10³/µL`.
- SI may appear secondarily in parentheses as `×10⁹/L`.
- Alternate source units remain accepted inputs, including `K/µL`, `/µL`, `/μL`, `/uL`, `/mcL`, `/mm3`, `/mm³`, `x 10^3/uL`, and `×10⁹/L`.
- Acceptance as a source unit does not by itself establish that the same token is the preferred primary presentation in authored learner-facing prose.

Read the current repo before beginning, in this order:

1. `AGENTS.md`
2. `DECISIONS.md` — the 2026-07-05 CBC-unit amendment and Gemini standing restrictions
3. `src/measurementUnitPolicy.ts`
4. `src/visuals/kinds/lab_trend/defs.ts`

Do not derive policy from this spec if any of those live files disagree with it. Record the discrepancy and stop with `BLOCKED_POLICY_DRIFT`; do not adjudicate it.

## 2. Blast-radius boundary

Gemini may create or replace only these two files:

- `audit/wbc-platelet-prose-unit-inventory-2026-07-19/manifest.jsonl`
- `audit/wbc-platelet-prose-unit-inventory-2026-07-19/report.md`

Everything else is read-only.

Explicitly prohibited:

- no edits to `banks/*.json` or `banks/banks-raw/**`
- no edits to source, tests, schema, prompts, governance, history, census, or ledgers
- no patch scripts committed to the repo
- no staging, commit, push, stash, reset, cleanup, or reformatting
- no web browsing or external clinical research
- no defect adjudication, repair disposition, or recommendation to change a specific item

The worktree may already contain unrelated changes. Record the branch, HEAD, and pre-existing changed-path list at the start. At the end, verify that the only newly created or modified paths attributable to this task are the two authorized outputs. Do not disturb pre-existing work.

## 3. Corpus and traversal

Scan the current bundled source population: every top-level `banks/*.json` file.

Parse each file as JSON and recursively traverse the complete question content, including:

- standalone questions
- case-study containers and every embedded scored leaf
- stems, options, matrix cells, bowtie text, highlights, ordered-response text, and fill/dropdown text
- case exhibits and staged exhibit content
- correct and per-choice rationales
- glossary and other displayed bilingual teaching text

Do not rely on grep alone. A token search may seed the work, but completeness must come from structural traversal of every string value in every parsed bank.

Exclude non-learner-facing data from the occurrence manifest:

- `meta` and audit-only fields
- structured-measurement `sourceUnit` fields
- renderer configuration and typed visual payload units
- IDs, topic labels, source citations, and URLs

Those source-unit/configuration fields are governed by the source-permissive policy and are not the prose residual under investigation. They may be used only to understand context.

If any canonical bank fails to parse, do not silently skip it. Produce the two output files with status `BLOCKED_PARSE_FAILURE`, identify the file and error, and label all counts as partial.

## 4. Candidate detection

Capture a string occurrence when all three conditions hold:

1. It is learner-facing under §3.
2. It refers to WBC or platelets with reasonable lexical confidence.
3. It contains an explicit numeric count or reference range, whether or not an explicit unit is present.

Use at least these analyte aliases:

- WBC: `WBC`, `white blood cell`, `white blood cells`, `white count`, `leukocyte`, `leukocytes`, `白细胞`, `白血球`
- Platelets: `platelet`, `platelets`, `platelet count`, `PLT`, `thrombocyte`, `thrombocytes`, `血小板`

Recognize spacing, Unicode, multiplication-sign, superscript, micro-symbol, and ASCII variants of at least:

- `×10³/µL`, `x10^3/uL`, `x 10^3/uL`, and close spacing variants
- `K/µL`, `K/uL`, `K/mcL`
- `/µL`, `/μL`, `/uL`, `/mcL`
- `/mm³`, `/mm3`, `cells/mm³`, `cells/mm3`, and `per mm³` forms
- `×10⁹/L`, `x10^9/L`, and close spacing variants

Also capture an analyte-linked number with no explicit unit as `MISSING_OR_IMPLICIT_UNIT`; do not infer that it is wrong.

Do not capture an isolated number merely because WBC or platelets appears somewhere else in a long string. The number and analyte must form the same clinical expression or reference range.

## 5. Mechanical classification only

Assign exactly one `formClass` to each occurrence:

- `CANONICAL_PRIMARY` — conventional-primary `×10³/µL`, no SI parenthetical
- `CANONICAL_PRIMARY_WITH_SI` — conventional-primary followed by equivalent `×10⁹/L` in parentheses
- `ALTERNATE_SOURCE_FORM_PRIMARY` — primary form uses `K/µL`, raw per-volume count, `/mm³`, or another accepted alternate
- `SI_PRIMARY_ONLY` — primary form is `×10⁹/L` with no conventional-primary form
- `NONCANONICAL_DUAL_DISPLAY` — two equivalent forms are shown, but the primary is not `×10³/µL`
- `MISSING_OR_IMPLICIT_UNIT` — analyte-linked numeric value/range has no explicit unit in that string
- `POSSIBLE_VALUE_UNIT_MISMATCH` — the displayed numbers are not mechanically equivalent under the live conversion table
- `UNRESOLVED_PARSE` — analyte identity, comparator/range structure, or unit token cannot be parsed confidently

These are inventory labels, not pass/fail verdicts. In particular, an alternate source form inside an exhibit may be intentional source-preserving prose. Gemini is not authorized to decide whether it should be changed.

For clean arithmetic only, calculate `canonicalNumericExpression`:

- raw per-volume forms (`/µL`, `/μL`, `/uL`, `/mcL`, `/mm3`, `/mm³`) divide the numeric count by 1,000 for `×10³/µL`
- `K/µL`, `×10³/µL`, and `×10⁹/L` retain the same numeric magnitude
- preserve comparators and range endpoints when the conversion is unambiguous
- do not invent rounding or significant-figure changes; use `null` when a lossless mechanical rendering is not clear

## 6. `manifest.jsonl` contract

Write one JSON object per exact learner-facing string occurrence, sorted by:

1. `bankPath`
2. `topLevelQuestionId`
3. `embeddedQuestionId` (empty string when not embedded)
4. `jsonPath`

Every row must contain:

```json
{
  "bankPath": "banks/hard-cases-canonical.json",
  "topLevelQuestionId": "...",
  "embeddedQuestionId": "... or null",
  "jsonPath": "questions[...].caseStudy.questions[...].question.options[...].text.en",
  "surface": "stem|option|rationale|exhibit|matrix|bowtie|highlight|ordered_response|cloze|glossary|other",
  "language": "en|zh|mixed|unknown",
  "analyte": "wbc|platelets|uncertain",
  "verbatimText": "exact full string from the bank",
  "matchedExpression": "the smallest complete analyte + numeric expression",
  "numericExpression": "exact numeric or range token",
  "unitExpression": "exact unit token or null",
  "formClass": "one §5 enum",
  "canonicalNumericExpression": "mechanical ×10³/µL numeric form or null",
  "counterpartJsonPath": "obvious EN/ZH counterpart path or null",
  "counterpartExpression": "counterpart analyte + numeric expression or null",
  "parityClass": "EQUIVALENT|POSSIBLE_MISMATCH|COUNTERPART_MISSING|NOT_APPLICABLE|UNRESOLVED",
  "notes": "brief evidence-only note; no repair recommendation"
}
```

Requirements:

- `verbatimText` must be copied exactly; do not normalize it.
- Include separate rows for separate JSON strings, even when English and Chinese are counterparts.
- Link obvious bilingual counterparts in both directions.
- Do not collapse repeated occurrences across a stem, option, and rationale; their paths and surfaces matter for a later patch.
- `POSSIBLE_VALUE_UNIT_MISMATCH` and `POSSIBLE_MISMATCH` require the exact conflicting expressions in `notes`.
- Valid JSONL: one compact JSON object per line, UTF-8, no surrounding array, no markdown fence.

## 7. `report.md` contract

The report must contain:

1. **Status:** `COMPLETE`, `BLOCKED_POLICY_DRIFT`, or `BLOCKED_PARSE_FAILURE`.
2. **Snapshot:** branch, HEAD, starting dirty-path list, ending dirty-path list, and confirmation that no unauthorized path was changed by this task.
3. **Authority read:** the four files from §1 and the policy Gemini observed in them.
4. **Coverage proof:** number of bank files parsed, top-level questions traversed, embedded questions traversed, and total learner-facing strings examined.
5. **Counts:** by analyte, `formClass`, bank, surface, and language.
6. **High-signal evidence queue:** every `POSSIBLE_VALUE_UNIT_MISMATCH`, bilingual `POSSIBLE_MISMATCH`, and `UNRESOLVED_PARSE`, each with bank path, IDs, JSON path, and verbatim expression.
7. **Presentation-only candidate index:** all `ALTERNATE_SOURCE_FORM_PRIMARY`, `SI_PRIMARY_ONLY`, and `NONCANONICAL_DUAL_DISPLAY` rows, grouped by question identity. This is an index, not a recommendation.
8. **Known-example check:** state whether the inventory found `cs_thyroid_storm_q4` and reproduce its relevant manifest row identifiers. Failure to find it means the traversal is incomplete and the task status must not be `COMPLETE`.
9. **Method limitations:** concise and specific.

Do not include clinical-source commentary, preferred rewrite prose, or a proposed patch plan. Codex will independently verify the inventory and own any later remediation spec or implementation.

## 8. Acceptance gate

The task is complete only when all are true:

- [ ] every top-level `banks/*.json` file was parsed and recursively traversed
- [ ] every captured row contains exact bank path, question identity, JSON path, and verbatim evidence
- [ ] English and Chinese counterparts are linked where structurally obvious
- [ ] arithmetic classification follows the live analyte-keyed conversion policy
- [ ] `cs_thyroid_storm_q4` is present in the inventory
- [ ] `manifest.jsonl` is valid, deterministically sorted JSONL
- [ ] `report.md` supplies corpus counts and the required evidence queues
- [ ] no bank, source, governance, ledger, census, or existing audit artifact was changed
- [ ] no commit or push was performed

On completion, hand back only the two output paths and a one-paragraph factual summary of counts. Do not proceed into remediation.
