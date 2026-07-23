# Raw Gate — Commission 2: Candidate Orchestrator and Promotion Enforcement

Date: 2026-07-23

Seat: Codex (implementation)

Status: **architect work order — not yet launched**

Repository: `nclex-bilingual-prep` (Project Shrimp)

---

## 0. Purpose and authority

Commission 1 landed the explicit-file substrate. This commission completes the two-part raw-gate job by adding a candidate-local, read-only `gate:raw` orchestrator and making `npm run promote` consume it before writing any staged file.

This is a policy-bearing tooling change. It changes which raw candidates may proceed to staging, so the full schema/data-contract verification path in `AGENTS.md` applies.

Read first:

1. `AGENTS.md`
2. `docs/AGENTS-RUNBOOK.md`
3. `RAW-GATE-COMMISSION-1-AUDIT-SCOPE-PARAMETERIZATION-CODEX-SPEC-2026-07-23.md`
4. `scripts/promote.ts`
5. `scripts/audit.ts`
6. every runner named in §4
7. `lib/raw-bank-normalization.ts`
8. `lib/case-completeness.ts`
9. `lib/presentation-normalization.ts`
10. `lib/shuffle.ts`
11. `lib/canonical-routing.ts`
12. `lib/question-population.ts`
13. `src/bankImport.ts`
14. `src/schema.ts`

Live source wins over this document on current symbol shape. If a named symbol or behavior no longer exists as described, stop and report the exact discrepancy before implementation.

### Repository state

This is a disk-reading implementation seat. Start from a clean dedicated branch created from current `main`, report the starting HEAD and branch, preserve unrelated work, and do not merge to `main`. Do not assume `origin/main` and local `main` are identical.

### History publication

Do not write `PROJECT-HISTORY.md` during implementation. Under the current `AGENTS.md` rule, the accepted/merged publishing seat records the landed status. Note the deferral in the receipt.

---

## 1. Required outcome

Add:

```sh
npm run gate:raw -- --file banks/banks-raw/<candidate>.json [--file ...]
```

The command must:

- inspect exactly the selected raw candidates;
- write nothing to the repository;
- evaluate the exact deterministic form that `promote` would stage, not the producer-authored option order;
- separate per-candidate verdicts from candidate-set verdicts;
- block raw-only shape debt, structural defects, ID collisions, stage leakage/nonconformance, exact topic-license defects, producer/checker leakage, positional failures, and enforced mechanical non-MCQ bias;
- retain distributional and manual non-MCQ findings as advisory;
- return nonzero when either a candidate lane or the candidate-set lane fails.

Then change `npm run promote` so it:

1. discovers the same sorted raw JSON population it uses today;
2. runs the raw gate programmatically over that exact set;
3. writes **nothing** if the gate fails;
4. stages the exact prepared promotion output returned by the passing gate rather than reparsing and independently rebuilding it.

There is no bypass around `gate:raw` inside `promote`.

---

## 2. Non-goals

Do not:

- change any canonical-bank no-argument audit result or `npm run audit` verdict;
- add a clinical, source-scope, bilingual-semantic, duplicate-premise, or producer-independent content-review check;
- treat a passing raw gate as reviewed content or as permission to consolidate;
- modify `scripts/audit/audit-integrity.ts`;
- change canonical bank content, schema versions, census artifacts, ledgers, or review status;
- regenerate or normalize a source raw file silently;
- make distributional non-MCQ findings blocking;
- retroactively apply the new stage-anchor floor to canonical banks;
- broaden this into a general workflow engine or watcher.

The gate is a deterministic pre-promotion floor. Independent content/source review remains mandatory under principle 5.

---

## 3. One shared promotion-preview preparation path

Create one shared preparation function used by both `gate:raw` and `promote`. The exact file/module split is implementation-owned, but there must be only one transformation owner.

For each selected raw file, in this order:

1. Read and parse with `parseBankText`.
2. Run `normalizeRawBankStructure` in memory.
3. If normalization reports any change, fail the candidate. Report every proposed change and instruct the operator to review and run `npm run normalize-raw-bank -- --write <file>` separately. Do not audit or stage the normalized clone, and do not write the source.
4. Run `checkCaseCompileManifests` against the raw object. Any failure blocks.
5. Strip valid `_compileManifest` fields with `stripCompileManifests`.
6. Validate with the same strict repository profile `promote` currently owns:

```ts
validateBankObject(value, {
  rejectUnknownKeys: true,
  requireMeta: true,
})
```

7. Apply the deterministic `shuffle` to every top-level question.
8. Apply `normalizeBankPresentations` to the shuffled bank.
9. Validate the prepared promotion-preview bank again with the same strict profile.
10. Serialize with the same canonical serializer used for staged banks.

A prepared candidate therefore represents the exact bytes and object shape eligible for `banks/_promoted/`.

### Raw-format rulings

- A bare array is invalid at the repository boundary because `meta.schemaVersion` is required.
- A valid `_compileManifest` remains accepted for historical raw compatibility, is checked, and is stripped from the promotion preview.
- An invalid `_compileManifest` blocks.
- Normalizer-repairable shape is still a gate failure until the source file itself has been deliberately normalized and reviewed.
- Raw preparation must not mutate the parsed source object in a way that can leak back to disk.

### Suggested returned shape

The implementation may choose names, but `runRawGate` must make the exact prepared outputs available to `promote`, including at least:

- first caller-supplied display path;
- resolved source path;
- source filename;
- routed canonical filename;
- validated prepared `BankEnvelope`;
- exact serialized staged text.

Deduplicate candidates by resolved path while preserving the first caller spelling.

---

## 4. Existing checks to reuse

Do not reimplement their detection logic. Reuse these landed Commission 1 runners or their existing pure cores against the prepared promotion previews:

- `runValidateBank`
- `runAuditReferences`
- `runAuditPositions`
- `runAuditIds`
- `runAuditTopicLicense`
- `runAuditProducerVocabulary`
- `runAuditAuthorialConstraintLeakage`
- `runAuditStageRefs`
- `runAuditNonMcqBiasOnBanks`

Because several runners are file-scoped while the prepared candidates are in memory, the implementation may use either:

- a temporary projection/mirror outside the repository, deleted in `finally`; or
- a narrow in-memory adapter that delegates to the existing analyzers/result builders.

Constraints whichever mechanism is chosen:

- no audit logic may be copied into the orchestrator;
- the repository remains byte-unchanged during `gate:raw`;
- output and returned results use original candidate labels, never temporary paths;
- temporary artifacts, if used, live outside the repository and are deleted on success and failure;
- every audit consumes the exact prepared promotion-preview content, not the unshuffled raw object;
- default/no-argument runner behavior remains unchanged.

---

## 5. Candidate-local lane

After every selected candidate prepares successfully, run these checks separately for each candidate so failures remain attributable:

| Check | Raw-gate policy |
|---|---|
| Raw preparation | Blocking |
| Promotion eligibility (§6) | Blocking |
| `validate:bank` on prepared preview | Blocking on `FAIL` |
| `audit:references` | Blocking on `FAIL` |
| `audit:producer-vocabulary` | Blocking on `FAIL` |
| `audit:authorial-constraint-leakage` | Blocking on `FAIL` |
| `audit:stage-refs` under raw policy (§7) | Blocking on any finding |
| `audit:topic-license` under raw policy (§8) | Blocking on any finding |

Use `gateVerdict` or an equally small deterministic adapter; do not create a second general verdict framework.

A preparation failure is Tier 0 for this command. Collect preparation failures for all selected candidates, then stop before downstream audits. Do not report a candidate-set PASS over a partial surviving subset.

---

## 6. Promotion eligibility preflight

For every candidate filename:

1. `routeCanonical(filename)` must resolve. An unknown route blocks before staging.
2. Load the routed canonical bank when it exists and validate it with the strict repository profile.
3. A missing routed canonical file is allowed; `consolidate` already supports creating a new canonical within a registered route.
4. If the candidate schema version is higher than the existing routed canonical version under `schemaVersionAtLeast`, block before staging. This replaces the current `promote` warning that knowingly creates an artifact `consolidate` cannot merge.
5. A lower or equal candidate schema version follows the existing consolidation rule and is allowed.

This is not a schema migration mechanism. The operator must bump a canonical deliberately in a separate reviewed change.

---

## 7. Stage-reference fatality policy for raw candidates

Run the existing pure `findStageReferenceFindings` analysis with `{ strict: true }` against each prepared candidate.

Do **not** infer the raw verdict from `runAuditStageRefs({ strict: true })` status alone. The underlying runner returns `FAIL` only when a `revealsAllStages` finding is present; `unresolved` and `missingRequiredAnchor` findings can remain `WARN` even in strict mode. The orchestrator must inspect the returned finding population by `kind` and fail when **any** finding exists.

For a case with declared stages, every embedded part must carry a resolving primary `answerableAfterStageId`.

The raw gate blocks all three existing finding kinds:

- `unresolved` — including an unresolved primary anchor that currently falls back to a resolving legacy `stageId`;
- `revealsAllStages` — neither anchor resolves and the renderer exposes the complete unfolding case;
- `missingRequiredAnchor` — a legacy `stageId` resolves but the required primary anchor is absent.

An unstaged case with no declared stages does not require stage anchors and remains valid.

Do **not** change the canonical no-argument `audit:stage-refs` policy. Its current legacy-corpus WARN behavior and aggregate nonfatality remain unchanged. Raw-gate fatality is an orchestrator policy applied only to selected new candidates.

---

## 8. Topic-license fatality policy for raw candidates

`audit:topic-license` remains advisory in the canonical aggregate because it reports historical corpus debt and cannot enforce semantic boundaries inside SHARED licenses.

For a new raw candidate, however, either mechanically proven finding is blocking:

- noncanonical topic vocabulary;
- category/topic license mismatch.

Build the raw-policy result from the existing pure `analyzeTopicLicenses` output (or an adapter over that same row-level analysis), not by parsing the aggregate runner's prose. When findings exist:

- return a raw-gate `FAIL`;
- set `failures` to the unique finding IDs;
- render each finding's candidate label, JSON path, issue, category, topic, and licensed categories;
- retain the existing limitation that SHARED-topic clinical boundaries remain semantic-review work.

A clean candidate remains `PASS`. Do not claim that this proves the clinical category choice among categories legitimately licensed for a SHARED topic. That remains producer-independent semantic review.

---

## 9. Candidate-set lane

Run these checks once over the complete prepared candidate set:

| Check | Population | Raw-gate policy |
|---|---|---|
| `audit:ids` | all candidates versus one another and current canonical banks | Blocking on candidate-attributable collision |
| `audit:positions` | all scored multiple-choice leaves in the candidate set | Blocking on `FAIL`; `INSUFFICIENT` allowed |
| non-MCQ mechanical axis | exact prepared candidates, preserving per-candidate and global records | Blocking when `isMechanicalBiasEnforced()` is true |
| non-MCQ distributional axis | exact prepared candidates | Advisory `WARN` only |
| non-MCQ manual axis | exact prepared candidates | Advisory `WARN` only |

### ID policy

Use the Commission 1 two-population contract. Candidate↔candidate and candidate↔canonical collisions fail. Comparison-only canonical collisions do not poison the candidate verdict. Preserve top-level and embedded location evidence.

### Multiple-choice position population

Commission 1 preserved the legacy top-level-only behavior and explicitly deferred this decision.

For `gate:raw`, include every scored multiple-choice leaf:

- standalone top-level MC questions;
- embedded case-study MC parts;
- exclude case-study containers.

Use `collectScoredLeaves` or the equivalent shared population owner. Add a narrow options flag or pure-input path for this population; do not change the no-argument canonical sweep, whose top-level-only output must remain identical.

### Exact presentation requirement

Position and non-MCQ mechanical checks must inspect the post-shuffle, presentation-normalized previews. Running them against producer-authored raw order would rediscover the known correct-first habit that promotion is designed to repair and would not test the actual staged artifact.

### Existing diagnostic override

Preserve `BIAS_GATE_ENFORCE_MECHANICAL=0` exactly as currently defined by `isMechanicalBiasEnforced`. Default promotion remains enforcing. Do not invent another override.

---

## 10. Public runner and CLI

Add an options-driven, process-independent runner. Exact type names are implementation-owned, but the public contract is:

```ts
runRawGate({
  files: string[],
  comparisonFiles?: string[], // test/injection seam; default current canonical banks
})
```

Requirements:

- `files` is required and non-empty;
- missing, unreadable, malformed, non-JSON, or schema-invalid selected files fail loud;
- candidate paths are deduplicated by resolved identity;
- the first caller spelling is the display label;
- candidate order is deterministic;
- the returned object contains candidate-lane results, candidate-set results, overall exit code, and prepared outputs for `promote`;
- the runner does not read `process.argv`, write files in the repository, mutate `process.exitCode`, or print.

Standalone CLI:

```sh
npm run gate:raw -- --file <path> [--file <path> ...]
```

- `--file` is repeatable.
- No files, unknown flags, missing values, and whitespace-only values exit 1.
- Print one deterministic section per candidate, then one candidate-set section, then an overall verdict.
- `FAIL` exits 1; a pass with WARN/INSUFFICIENT exits 0.
- Use `process.exitCode`; do not call `process.exit()` after asynchronous output.
- Never print a temporary projection path.

Add `gate:raw` and `test:raw-gate` package scripts.

---

## 11. `promote` integration

Refactor `scripts/promote.ts` around the raw-gate runner.

Required behavior:

1. Read and sort `banks/banks-raw/*.json` as today.
2. If none exist, preserve the current nonzero behavior.
3. Call `runRawGate` once with the complete discovered set.
4. Print the same structured gate report the standalone CLI uses.
5. If the overall result fails:
   - exit nonzero;
   - do not create `banks/_promoted/` if absent;
   - do not alter any pre-existing staged file;
   - do not stage passing siblings from a mixed candidate set.
6. If the gate passes:
   - create the staging directory;
   - write the exact serialized prepared output returned by the gate;
   - retain the current deterministic filename and success-line behavior where practical.

Remove duplicated preparation and non-MCQ enforcement from `promote`; the shared preparation path and raw gate become their single owners. Do not reparse, reshuffle, or renormalize a candidate after the gate has passed.

`audit:integrity` remains the post-staging equality proof and must pass on every newly staged output.

---

## 12. Required tests

Add focused unit/integration coverage. Temporary repositories and files must live outside the real repository and be removed in `finally`.

### A. Preparation and raw-format tests

1. Valid envelope prepares and returns deterministic serialized output.
2. A second preparation of the same bytes is identical.
3. Normalizer-detectable drift blocks and lists proposed changes; source bytes remain unchanged.
4. Valid `_compileManifest` is checked and stripped from the preview.
5. Invalid `_compileManifest` blocks.
6. Bare array blocks for missing repository metadata.
7. Missing, unreadable, malformed, and schema-invalid files block.
8. Alias path spellings deduplicate while retaining the first display spelling.
9. Unknown filename route blocks.
10. Candidate schema higher than an existing routed canonical blocks before staging.
11. A missing canonical within a registered route is allowed.

### B. Candidate-local policy tests

12. Clean text-only candidate passes.
13. Reference hazard blocks.
14. HIGH producer-vocabulary leakage blocks.
15. Blocking authorial-constraint leakage blocks.
16. Topic-license finding is promoted from advisory to raw-gate failure with exact ID/file/path evidence.
17. Multiple topic-license findings return unique finding IDs and preserve issue/category/topic/licensed-category detail.
18. A SHARED licensed category/topic pair is not falsely rejected by the mechanical gate.

### C. Stage-reference matrix

19. Staged case with resolving `answerableAfterStageId` on every part passes.
20. Missing primary anchor with resolving legacy `stageId` blocks.
21. Unresolved primary anchor with resolving legacy `stageId` blocks.
22. Neither anchor resolving blocks.
23. Unstaged case without anchors passes.
24. Canonical no-argument `audit:stage-refs` output and verdict remain unchanged.

### D. Candidate-set tests

25. Candidate↔candidate ID collision blocks with both locations.
26. Candidate↔canonical ID collision blocks with both locations.
27. Comparison-only collision is ignored.
28. Embedded case-part IDs participate.
29. Position sample includes embedded MC leaves in raw-gate mode.
30. Canonical/no-argument `audit:positions` remains top-level-only and unchanged.
31. Position audit sees post-shuffle order, not raw producer order.
32. Enforced mechanical non-MCQ failure blocks.
33. Distributional-only warning does not block.
34. `BIAS_GATE_ENFORCE_MECHANICAL=0` preserves the existing observe-only behavior.

### E. Read-only and CLI tests

35. `gate:raw` leaves every selected raw file byte-identical.
36. It creates or changes no path under `banks/`, `banks/_promoted/`, census, or ledger files.
37. Any external temporary projection is deleted on pass and failure.
38. No temporary path appears in returned details or CLI output.
39. CLI argument and exit-code matrix passes.
40. Candidate and candidate-set sections are deterministic under repeated runs.

### F. Promotion integration tests

41. A failing candidate produces no staged write.
42. In a mixed set, one failure prevents every write.
43. Pre-existing staged files remain byte-identical after gate failure.
44. A passing set stages exact raw-gate serialized output.
45. `integrityForFile` returns `checked` with zero failures for that output.
46. For an input that passes both the old promoter's structural floor and the new raw policy, staged bytes remain identical to the old promoter's output.
47. Existing `test:promote` fixtures that use mechanically invalid placeholder metadata (currently the noncanonical topic `fixture`) are corrected to a canonical licensed topic/category pair before they are used as passing controls; their prior acceptance is not preserved.
48. `promote` cannot bypass the raw gate by calling the old inline path.

---

## 13. Compatibility and verification

Before editing, capture outside the repository:

- current `npm run audit` stdout/stderr/exit code;
- no-argument results for every modified existing runner;
- staged output bytes from a temporary compatibility fixture whose metadata passes both the current promoter and the new raw policy. Do not use a fixture with the noncanonical topic `fixture` as the passing baseline.

After implementation, prove:

- `npm run audit` is unchanged;
- canonical/no-argument runner results are unchanged;
- promotion transformation bytes are unchanged for the same policy-clean input;
- the only intentional acceptance changes are the new raw-candidate policies and automatic promotion enforcement. Test-only placeholder metadata may be corrected where it is intentionally rejected by those policies.

Run and report:

```sh
npm run test:raw-gate
npm run test:promote
npm run test:audit-positions
npm run test:audit-stage-refs
npm run test:audit-ids
npm run test:non-mcq-bias
npm run test:audit-scope-cli
npm run validate-bank -- banks/*.json
npm run audit
npx tsc -b --pretty false
npm run census:check
npm run build
git diff --check
```

Also run every other focused test for an existing module changed by the implementation and the command steps in `.github/workflows/promotion-gate.yml` that are affected by the diff.

Do **not** run `npm run census`; no census movement is expected. A `census:check` failure is blocking evidence to investigate.

### Bank-impact statement

This floor is prospective and raw-candidate-local. Confirm in the receipt that:

- no canonical bank is rewritten or newly failed by the ordinary aggregate;
- whatever canonical stage-reference advisories exist at execution time remain advisory and are not fed through raw policy; the previously observed count of approximately 451 is orientation only and must not be treated as a reconciliation target;
- no census population or bundled bank count changes.

---

## 14. Allowed and frozen files

Expected implementation surface:

- new raw-gate core/CLI module(s);
- one shared raw-candidate/promotion-preview preparation module;
- `scripts/promote.ts`;
- `scripts/audit/audit-positions.ts` only as needed for the scored-leaf option;
- focused tests and test utilities;
- `package.json`;
- `docs/AGENTS-RUNBOOK.md` for the exact command and automatic promotion behavior.

Potentially allowed only when required by the chosen reuse mechanism:

- narrow adapters in the Commission 1 runner modules or their existing scanner libraries, provided no default behavior changes.

Frozen unless a live contradiction forces a stop-and-report:

- `scripts/audit.ts`;
- `scripts/audit/audit-integrity.ts`;
- all files under `banks/`;
- `BANK-REVIEW-LEDGER.md`;
- `census.json` and `BANK-CENSUS.md`;
- `AGENTS.md`, `DECISIONS.md`, `CLAUDE.md`, `NCLEX-Question-Schema.md`;
- `PROJECT-HISTORY.md` during implementation;
- this work order.

Do not touch the stage-reference semantic-census artifacts or hidden calibration material.

---

## 15. Receipt

Return a compact implementation receipt containing:

- starting HEAD, branch, and starting worktree status;
- files changed and one-line purpose each;
- shared preparation function name and exact ordered stages;
- proof that normalization-required candidates fail without source mutation;
- raw-only `_compileManifest` behavior;
- candidate-local and candidate-set check lists with blocking/advisory classification;
- stage-reference and topic-license policy adapters;
- scored-leaf MC position implementation and proof of unchanged canonical default;
- exact `promote` call path showing gate-before-write and gate-output consumption;
- no-write failure proof, including preservation of pre-existing staged files;
- before/after compatibility results;
- every command in §13 with status;
- confirmation that no canonical bank, ledger, census, schema, or history file changed;
- confirmation that temporary artifacts were external, cleaned, and never leaked into output;
- any live-code contradiction or deliberately omitted out-of-scope improvement.

Independent review remains required before merge.

---

## 16. Acceptance checklist

- [ ] `gate:raw` exists and requires explicit non-empty candidate selection
- [ ] One shared preparation path owns raw parse → normalization-drift check → manifest check/strip → strict validation → shuffle → presentation normalization → final validation/serialization
- [ ] `gate:raw` is repository-read-only
- [ ] Audits inspect exact prepared promotion previews
- [ ] Candidate-local and candidate-set verdict lanes are separate
- [ ] Unknown route and too-high candidate schema block before staging
- [ ] Raw stage-reference policy blocks `unresolved`, `revealsAllStages`, and `missingRequiredAnchor`
- [ ] Raw topic-license findings block with exact row-level evidence while SHARED semantic boundaries remain review work
- [ ] Candidate-set IDs compare candidates with one another and canonicals
- [ ] Raw-gate MC positions include embedded scored leaves; canonical default remains unchanged
- [ ] Mechanical non-MCQ policy and diagnostic override remain consistent with `isMechanicalBiasEnforced`
- [ ] Distributional/manual non-MCQ findings remain advisory
- [ ] `promote` calls the gate before any write and consumes exact passing output
- [ ] Mixed-set failure stages nothing
- [ ] `audit:integrity` remains untouched and passes on staged output
- [ ] No temporary path leaks; external temp artifacts are always deleted
- [ ] `npm run audit` and no-argument runner behavior remain unchanged
- [ ] No bank, ledger, census, schema, or `PROJECT-HISTORY.md` change
- [ ] Policy-clean promotion transformation bytes are unchanged; obsolete passing fixtures are corrected rather than grandfathered
- [ ] Full focused verification passes
- [ ] Independent review pending
