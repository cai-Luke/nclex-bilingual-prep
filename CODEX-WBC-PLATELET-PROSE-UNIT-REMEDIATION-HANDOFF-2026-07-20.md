# Codex Handoff — WBC / Platelet Learner-Facing Prose Unit Remediation

Date: 2026-07-20  
Owner: Codex  
Status: ready to execute  
Mode: deterministic inventory repair → fail-closed disposition → declarative canonical patch → full bank verification

## Purpose

Close the residual learner-facing WBC and platelet unit-format drift under the already-ratified measurement policy.

This task does **not** reopen unit architecture and does not require an architect decision. The governing policy is already settled and implemented:

- WBC and platelet canonical display unit: `×10³/µL`
- Accepted source forms remain analyte-aware and source-permissive.
- Raw per-volume counts such as `/µL`, `/uL`, `/mcL`, `/mm3`, and `/mm³` convert by `× 0.001` into the canonical display magnitude.
- `K/µL`, `x 10^3/uL`, `×10³/µL`, and `×10⁹/L` retain the same numeric magnitude.
- Equivalent SI parentheticals are optional policy-wise, but this normalization pass should prefer the compact canonical expression alone unless preserving the parenthetical has a specific learner-facing purpose.

The existing Gemini artifact is useful only as a locator seed. It is not an approved execution manifest and its `COMPLETE` verdict is rejected.

## Read first, in order

1. `AGENTS.md`
2. `docs/AGENTS-RUNBOOK.md`
3. `DECISIONS.md`
   - principle 2: deterministic work may self-certify only against an independent mechanical null
   - principle 7: precision over volume
   - principle 15: canonical patches are declarative and precondition-checked
   - the 2026-07-05 CBC-unit amendment in the superseded-rulings section
4. `PROJECT-HISTORY.md` — current implementation status only; do not overwrite unrelated live edits
5. `src/measurementUnitPolicy.ts`
6. `src/measurementAllowlist.ts`
7. `src/visuals/kinds/lab_trend/defs.ts`
8. `GEMINI-WBC-PLATELET-PROSE-UNIT-INVENTORY-SPEC-2026-07-19.md`
9. `audit/wbc-platelet-prose-unit-inventory-2026-07-19/manifest.jsonl`
10. `audit/wbc-platelet-prose-unit-inventory-2026-07-19/report.md`
11. `audit/wbc-platelet-prose-unit-inventory-2026-07-19/sonnet-check.md`

Live executable policy wins over every report or handoff. If the live WBC/platelet canonical unit or conversion factors disagree with the policy stated above, stop with `BLOCKED_POLICY_DRIFT`; do not improvise a replacement policy.

## Starting-worktree rule

The worktree is already dirty with unrelated lab-trend/reference-range work and several untracked handoffs/audit artifacts. Record branch, HEAD, staged paths, unstaged paths, and untracked paths before beginning.

Do not stash, reset, clean, reformat, overwrite, or absorb unrelated changes. In particular, do not touch the currently modified lab-trend source files, `package.json`, `NCLEX-Question-Schema.md`, `lab-reference-range-verification-spec.md`, or the pre-existing `PROJECT-HISTORY.md` edits as a ride-along.

If any `banks/*.json` file is already modified when Codex begins, stop and report the overlap before generating or applying a canonical patch.

## Evidence already established — use, but do not trust beyond its proved boundary

Sonnet independently established that Gemini’s 334-row JSONL is a useful candidate queue:

- all 334 objects parse
- all recorded JSON paths resolve
- recorded `verbatimText` is reliable on the reviewed population
- the ordinary raw per-volume conversion sample was correct
- the known `cs_thyroid_storm_q4` option was found
- Gemini stayed inside its write boundary

Sonnet also established that the artifact is not suitable as direct patch input:

- `rationale.correct` was not traversed; 17 paths were missed
- 10 or more out-of-scope rows entered the queue
- `x 10^3/uL` was converted incorrectly by a factor of 1,000
- spaced `× 10³/µL` forms were not parsed as units
- reference ranges and historical comparisons were misread as conflicting conversions
- four dual displays were truncated before their SI parentheticals
- bilingual parity classifications were heavily polluted
- sort order violated the commissioned key

Do not line-edit Gemini’s manifest into apparent correctness. Reuse its paths and exact strings as candidate evidence, then independently regenerate the authoritative inventory from the banks.

## Scope

### In scope

Learner-facing **blood CBC** WBC and platelet count expressions in every bundled top-level `banks/*.json` file, including:

- standalone stems and prompts
- answer options
- matrix, highlight, bowtie, ordered-response, and cloze text
- case exhibits and staged exhibits
- embedded scored leaves
- `rationale.correct`
- per-choice rationales
- displayed glossary or teaching text
- explicit result values, thresholds, comparators, trends, and reference ranges
- English and Simplified Chinese surfaces

### Out of scope

- CSF, ascitic, pleural, peritoneal, urine, synovial, or other non-blood WBC counts
- platelet transfusion product quantities or doses
- corrected-count-increment arithmetic as a quantity distinct from a patient platelet count
- ANC or other differential counts unless the same exact expression also contains an independently scoped WBC count
- RBC counts, hemoglobin, hematocrit, or any other analyte
- medication doses, infusion rates, weights, intake/output, timing, or non-laboratory quantities
- `meta`, source citations, URLs, IDs, topic/category labels, audit-only fields
- typed visual configuration, structured-measurement values, and `sourceUnit` fields
- adding units to genuinely implicit/unitless values in this pass
- clinical threshold, answer-key, distractor, translation, or rationale rewrites beyond exact unit-format normalization

## Authorized normalization

This pass may mutate only explicit WBC/platelet count expressions whose conversion is exact under the live analyte-keyed policy.

Use exact canonical typography:

```text
<value> ×10³/µL
```

Examples:

- `2,800/mm³` → `2.8 ×10³/µL`
- `45,000/µL` → `45 ×10³/µL`
- `WBC 6.8 x 10^3/uL` → `WBC 6.8 ×10³/µL`
- `8.5 ×10⁹/L` → `8.5 ×10³/µL`
- `150,000-400,000/µL` → `150-400 ×10³/µL`
- `2,800/mm³ (2.8 ×10⁹/L)` → `2.8 ×10³/µL`

Formatting rules:

1. Preserve the exact clinical magnitude.
2. Preserve comparators, range endpoints, trends, and timepoint distinctions.
3. Do not invent trailing zeroes or additional significant figures.
4. Strip thousands separators only as required by the exact `÷1000` conversion.
5. Normalize ASCII `x`, spacing variants, superscript variants, and micro-symbol variants to `×10³/µL`.
6. Do not append a redundant `×10⁹/L` parenthetical by default.
7. When a noncanonical primary already has an equivalent SI parenthetical, replace the complete dual display with the compact canonical form.
8. Normalize every in-scope WBC/platelet occurrence in a changed string, not merely the first match.
9. Do not modify adjacent ANC, differential percentage, hemoglobin, chemistry, vital-sign, or medication expressions.
10. Use the same canonical Latin unit token on EN and ZH surfaces.

A current value and a historical value are separate valid measurements, not competing conversions. A result and its reference range are separate valid numeric structures, not a mismatch. Convert each scoped expression independently while preserving those relationships.

## Phase 1 — authoritative structural inventory

Implement a deterministic structural traversal over every parsed top-level `banks/*.json` file. Grep may seed tests but cannot establish completeness.

The traversal must:

- visit every string value recursively
- include `rationale.correct` and per-choice rationales explicitly
- retain top-level and embedded question identity
- retain exact JSON path and complete `verbatimText`
- identify every scoped analyte expression in a string, including multiple occurrences and multiple timepoints
- classify specimen context before treating a WBC expression as blood CBC
- exclude non-learner-facing branches by path, not merely by token heuristics
- preserve an occurrence offset or deterministic occurrence index so repeated expressions in one string cannot collapse

Create a reproducible audit script. Do not wire it into the already modified `package.json`; invoke it directly with `tsx` in this task.

Recommended path:

- `scripts/audit/wbc-platelet-prose-unit-remediation.ts`

The script must be read-only with respect to banks. It may generate audit artifacts and a declarative patch plan, but it must not contain an arbitrary canonical-bank mutation path.

### Corrected occurrence manifest

Write:

- `audit/wbc-platelet-prose-unit-inventory-2026-07-19/codex-corrected-manifest.jsonl`

One row per distinct analyte expression occurrence. At minimum include:

```json
{
  "bankPath": "banks/hard-cases-canonical.json",
  "topLevelQuestionId": "...",
  "embeddedQuestionId": null,
  "jsonPath": "questions[...].caseStudy.questions[...].rationale.correct.en",
  "surface": "rationale",
  "language": "en",
  "analyte": "wbc",
  "specimenContext": "blood_cbc",
  "verbatimText": "exact complete bank string",
  "occurrenceIndex": 0,
  "matchedExpression": "WBC count of 2,800/mm³",
  "numericExpression": "2,800",
  "unitExpression": "/mm³",
  "formClass": "ALTERNATE_SOURCE_FORM_PRIMARY",
  "canonicalExpression": "WBC count of 2.8 ×10³/µL",
  "counterpartJsonPath": "...zh",
  "parityClass": "EQUIVALENT",
  "candidateSource": "gemini_seed|independent_traversal|both",
  "notes": "mechanical evidence only"
}
```

Sort lexicographically by:

1. `bankPath`
2. `topLevelQuestionId`
3. `embeddedQuestionId` with null treated as empty string
4. `jsonPath`
5. `occurrenceIndex`

The corrected manifest is authoritative for this task. The original Gemini files and Sonnet report are provenance and must remain byte-unchanged.

## Phase 2 — path-level disposition and patch plan

Multiple occurrences may share one JSON string. Aggregate the corrected occurrence rows into one disposition row per unique `(bankPath, jsonPath)` so no canonical field receives overlapping patch operations.

Write:

- `audit/wbc-platelet-prose-unit-inventory-2026-07-19/codex-dispositions.jsonl`

Every corrected occurrence must land in exactly one of these dispositions:

- `NORMALIZE_EXPLICIT` — explicit in-scope unit expression can be converted exactly
- `NORMALIZE_TOKEN_ONLY` — numeric magnitude is already canonical but unit typography/token is not exact canonical display
- `ALREADY_CANONICAL` — exact canonical primary form; no mutation
- `PRESERVE_IMPLICIT` — blood CBC number lacks an explicit unit; no mutation in this pass
- `EXCLUDE_NON_BLOOD` — non-blood specimen
- `EXCLUDE_NON_COUNT` — transfusion dose, CCI arithmetic, or another non-patient-count quantity
- `EXCLUDE_NON_LEARNER_FACING` — source/config/audit branch
- `BLOCKED_CONTEXT` — a safe mechanical disposition cannot be established

Each path-level row must contain:

- the full exact `before` string
- the full proposed `after` string or null
- all occurrence IDs covered by the row
- the disposition
- a concise deterministic reason
- EN/ZH counterpart path and whether paired mutation is required
- exact changed substrings

Rules:

- Do not include `BLOCKED_CONTEXT` in the patch plan.
- A blocked row does not block independently safe rows.
- Do not mutate `PRESERVE_IMPLICIT`, exclusions, or `ALREADY_CANONICAL` rows.
- When EN and ZH contain the same clinical fact, normalize both in the same patch set.
- Do not invent content missing from one locale merely to make surface lengths identical.
- If a structurally paired locale contains the same measurement but the proposed values or units do not reconcile, move both paths to `BLOCKED_CONTEXT`.

### Required canaries

The focused test and report must prove at least these behaviors against live banks or synthetic fixtures:

1. `cs_thyroid_storm_q4` option and `rationale.correct` are both found.
2. `2,800/mm³ (2.8 ×10⁹/L)` becomes `2.8 ×10³/µL`.
3. `WBC 6.8 x 10^3/uL` remains numerically `6.8`, not `0.0068`.
4. Spaced `× 10³/µL` is recognized and token-normalized.
5. A result plus a reference range is not classified as a conversion mismatch.
6. A current result plus a prior timepoint is not classified as a conversion mismatch.
7. `gen_rrp_batch2_05` and `gen_rrp_batch2_09` dual displays include their SI parentheticals in the matched boundary before normalization.
8. `rationale.correct` produces nonzero inventory and includes the 17 paths Sonnet identified at the checked snapshot, unless live-bank drift is explicitly reconciled.
9. CSF and ascitic WBC counts are excluded.
10. Platelet transfusion quantity and CCI arithmetic are excluded.
11. Identical or translated-equivalent EN/ZH measurements are not called mismatches merely because the surrounding language differs.
12. Output ordering matches the declared sort key.

Recommended focused test path:

- `scripts/tests/wbc-platelet-prose-unit-remediation.ts`

Do not add a package script in this dirty worktree; run it directly with `tsx`.

## Phase 3 — declarative canonical patch

Generate a declarative patch script from the approved path-level dispositions:

- `scripts/patches/2026-07-20-wbc-platelet-prose-unit-normalization.ts`

Requirements:

- use `replaceText` and `runPatch` from `scripts/patch-raw.ts`
- one exact full-string `before` → `after` operation per changed JSON path
- locate records by stable question ID and semantic nested selectors where supported; do not rely solely on array indexes
- combine all replacements for one string into one operation
- include a note naming the scoped analytes and stating that values/relationships/answer logic are preserved
- dry-run first
- fail closed on any stale precondition, duplicate target path, missing ID, or unmatched `before` string
- do not implement an arbitrary object mutator

Canonical mutation is authorized only through:

```sh
tsx scripts/patches/2026-07-20-wbc-platelet-prose-unit-normalization.ts \
  --allow-canonical \
  --reason "normalize learner-facing WBC and platelet prose to the ratified conventional display policy"
```

Before applying, the dry run must report:

- affected banks
- changed JSON-path count
- changed EN/ZH path counts
- changed occurrence count by analyte and source form
- zero blocked rows included
- zero unpaired same-fact bilingual changes

If the patch plan is not completely determined by the corrected manifest and dispositions, do not apply it. Leave ambiguous rows untouched and report them.

## Exact-diff gate

Capture parsed bank objects before and after the canonical patch.

Assert all of the following:

1. The changed JSON-path set equals the `NORMALIZE_EXPLICIT` + `NORMALIZE_TOKEN_ONLY` path set exactly.
2. No unplanned bank path changes.
3. No question or embedded-leaf ID changes.
4. No `correct`, `correctOrder`, `correctByBlank`, scoring, category, topic, item type, difficulty, exhibit identity, stage identity, visual, structured measurement, or metadata change.
5. No array reordering or whole-bank serialization churn beyond the exact changed strings and required bank metadata serialization behavior.
6. Every changed string preserves all non-scoped surrounding text byte-for-byte.
7. Every changed numeric expression is mechanically equivalent under `src/measurementUnitPolicy.ts`.
8. All same-fact bilingual pairs are reconciled.
9. Top-level and embedded question counts are unchanged.

Do not accept a green TypeScript build as evidence for this gate; the build does not inspect prose semantics or patch coverage.

## Post-write residual scan and idempotency

Run the structural inventory again after the patch.

The second run must show:

- zero remaining `NORMALIZE_EXPLICIT` or `NORMALIZE_TOKEN_ONLY` rows among the paths actually authorized for this pass
- all changed rows now classify as `ALREADY_CANONICAL`
- only `PRESERVE_IMPLICIT`, explicit exclusions, and documented `BLOCKED_CONTEXT` rows remain
- a second patch dry run produces zero writes
- `cs_thyroid_storm_q4` option and rationale now use `2.8 ×10³/µL`

If a safe explicit-unit residual remains, the task is not complete. If only blocked or deliberately deferred implicit-unit rows remain, report them without expanding scope.

## Ledger and documentation

A canonical patch requires a `BANK-REVIEW-LEDGER.md` entry under principle 15. Record:

- patch reason
- affected canonical bank files
- changed string-path count
- WBC and platelet occurrence counts
- exact normalization policy
- confirmation that implicit/unitless values were deferred
- confirmation that no clinical values, thresholds, answers, or scoring changed
- corrected manifest, disposition manifest, patch script, and remediation report paths
- verification commands and verdicts

Do not modify the already-dirty `PROJECT-HISTORY.md` in this task. The ledger entry plus the remediation report are sufficient closeout records for this bounded correction.

## Verification floor

Run, at minimum:

```sh
tsx scripts/tests/wbc-platelet-prose-unit-remediation.ts
tsx scripts/audit/wbc-platelet-prose-unit-remediation.ts
npm run test:measurement-allowlist
npm run test:structured-measurements
npm run validate-bank -- banks/*.json
npm run audit
npm run coverage-report
npm run census
npm run census:check
npx tsc -b --pretty false
npm run build
git diff --check
```

Also run the patch script in dry-run mode after application and prove zero writes.

Expected invariant: census/question counts do not change. If `census.json` or `BANK-CENSUS.md` changes only because generated metadata is refreshed, inspect and explain it; no content-population delta is expected.

## Remediation report

Write:

- `audit/wbc-platelet-prose-unit-inventory-2026-07-19/codex-remediation-report.md`

Include:

1. branch, HEAD, starting and ending dirty-path lists
2. live authority files read and policy observed
3. Gemini seed count and explicit statement that its `COMPLETE` verdict was rejected
4. corrected inventory counts by analyte, form, surface, language, bank, and disposition
5. reconciliation against Gemini: retained candidates, corrected classifications, false positives removed, and independently found omissions
6. every `BLOCKED_CONTEXT` row with verbatim evidence
7. canonical patch counts and affected banks
8. exact-diff proof
9. bilingual parity proof
10. post-write residual and idempotency proof
11. full command results
12. final verdict: `COMPLETE`, `COMPLETE_WITH_BLOCKED_RESIDUALS`, or `BLOCKED`

`COMPLETE_WITH_BLOCKED_RESIDUALS` is acceptable only when every applied change is mechanically proved and all remaining rows are explicitly listed without mutation.

## Stop conditions

Stop without canonical mutation if:

- live unit policy has drifted
- any canonical bank is already modified at task start
- the corrected traversal cannot establish full learner-facing coverage
- the patch requires changing a clinical threshold, answer key, distractor meaning, or translation substance
- proposed same-fact EN/ZH values do not mechanically reconcile
- the declarative patch cannot represent the changes without arbitrary mutation
- exact before/after preconditions do not match live disk

Do **not** stop merely because some rows are ambiguous. Exclude those rows from the safe patch, record them as `BLOCKED_CONTEXT`, and complete the independently mechanical subset.

## Exit conditions

- [ ] Gemini artifacts preserved unchanged and used only as a candidate seed
- [ ] authoritative structural traversal includes `rationale.correct`
- [ ] corrected manifest is valid, sorted JSONL
- [ ] every occurrence has exactly one disposition
- [ ] non-blood and non-count quantities are excluded
- [ ] implicit/unitless mentions remain untouched
- [ ] all applied conversions derive from live analyte-keyed policy
- [ ] EN/ZH same-fact edits are paired and mechanically equivalent
- [ ] canonical patch uses declarative `patch-raw --allow-canonical --reason`
- [ ] exact-diff gate passes
- [ ] post-write residual scan and idempotency pass
- [ ] full bank validation/audit/census/build path passes
- [ ] `BANK-REVIEW-LEDGER.md` records the canonical correction
- [ ] unrelated dirty work remains untouched
- [ ] no commit or push unless Luke separately instructs it

No further Claude/architect loop is required for the mechanical conversions authorized here. Any row that exceeds this contract remains unmodified and is surfaced in the remediation report rather than adjudicated by Codex.