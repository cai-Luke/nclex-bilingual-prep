# Raw Gate — Commission 1: Audit Scope Parameterization

Date: 2026-07-23

Revision: **4 — pre-launch amendment.** Revision 4 refreshes the worktree/branch requirement, corrects the
`audit-ids` default-error row, strengthens CLI test obligations, makes the scope-prose
check contextual, broadens the baseline capture, and rules on the `PROJECT-HISTORY.md`
conflict. Revisions 1 through 3 were never launched and are superseded in full; do not
implement from them.

Note for reviewers: the three path spellings in section 8 are correct as written. A prior
review reported the third as `./Project Shrimp/banks/foo.json`; the file does not contain
that string. Verify with a byte-exact tool before reporting a defect in this document.

Seat: Codex (implementation)

Status: **work order — immutable during execution**

Repository: `nclex-bilingual-prep` (Project Shrimp)

---

## 0. How to read this document

This spec is **closed-world**. Every path, symbol, signature, default, and acceptance
condition needed to execute it is restated inline. Do not rely on chat history, prior
sessions, model memory, or another document's summary of these files. Where this spec
states a current fact about live code, verify it against the file before relying on it;
if live code and this spec disagree, **stop and report the discrepancy** rather than
implementing either version.

Do not write to `DECISIONS.md`, `PROJECT-HISTORY.md`, `AGENTS.md`, `CLAUDE.md`,
`BANK-REVIEW-LEDGER.md`, `NCLEX-Question-Schema.md`, `census.json`, `BANK-CENSUS.md`,
this spec, any file under `banks/`, or any prompt/contract markdown. This commission
changes TypeScript under `scripts/` and `lib/`, adds test files under `scripts/tests/`,
and adds `package.json` script entries. Nothing else.

### Governance: `PROJECT-HISTORY.md` is deliberately deferred

`AGENTS.md` says to update `PROJECT-HISTORY.md` when a meaningful implementation pass
lands. This commission still forbids writing it, and that is a deliberate ruling, not an
oversight or a constitutional violation.

Reason: a pass has not *landed* until it clears independent review and Luke merges it.
Writing the history entry at implementation time would record as landed something that has
not cleared the gate, and would have the producer author its own status record — the same
weak evidence as a self-issued receipt. The history entry is therefore deferred to the
publishing pass after merge, and is Luke's to author or delegate. Note the deferral in the
receipt; do not write the file.

### Worktree and branch protection

**Required starting state.** This work order deliberately pins **no commit hash.** A spec
cannot name the hash of the commit that contains it: committing this file changes `HEAD`,
and editing the file to name the new hash changes it again. Verify state instead.

Before any edit, confirm all three:

- the worktree is clean;
- the current branch is `main`;
- the checked-out copy of this work order is **Revision 4**.

If any of the three is false, **stop and report** rather than proceeding. Record the
current `HEAD` in the receipt, then create the implementation branch from that HEAD.

The `audit/stage-reference-semantic-census-2026-07-23/` tree supports a separate
blind-scoring commission in progress; its hidden calibration key remains ignored by git.
Destroying, exposing, or committing changes to any of it would invalidate that commission.

Therefore:

- Record `git status --short` and the current branch name before making any edit, and
  include both in the receipt.
- Preserve every pre-existing staged, unstaged, and untracked path outside this commission
  exactly as found.
- Do **not** run `git clean`, `git reset`, `git stash`, or broad `checkout` / `restore`
  commands. Do not stage unrelated paths.
- Do **not** read, move, modify, or commit anything under
  `audit/stage-reference-semantic-census-2026-07-23/`.
- The receipt must distinguish this commission's changes from pre-existing worktree entries.

**Branch: authorized.** Create one dedicated branch from the current checked-out `main`
HEAD, before the baseline capture in §11, and do all work on it. Do not rebase, merge, or
switch to any other branch, and do not merge to `main` — Luke holds merge authority.
Report the branch name and the HEAD it was created from in the receipt.

---

## 1. Purpose

Seven audit runner functions currently sweep a hardcoded bank directory and expose no way
to scope a run to an explicitly chosen set of files. A later commission will add a
candidate-local, read-only pre-promotion gate (`gate:raw`) that must call these runners
against specific raw draft files rather than the canonical directory.

This commission adds that scoping capability. It adds **no new checks, no new policy, and
no new verdict semantics.**

### Explicit non-purpose

This commission does **not** implement `gate:raw`. It does not change what any check
considers a failure. It does not change results for existing no-argument invocations. It
does not touch `scripts/audit/audit-integrity.ts`, `scripts/promote.ts`,
`scripts/audit/audit-stage-refs.ts`, or `scripts/audit/audit-non-mcq-bias.ts`.

If, while implementing, you find yourself reasoning about promotion policy, stage-anchor
fatality, bias enforcement, distributional verdicts, or raw-format preprocessing —
**you have left scope.** Stop and report.

---

## 2. Read before implementing

Read these files in full. They are the live authority for the shapes this commission
touches:

1. `scripts/audit/audit-stage-refs.ts` — the closest existing model for the loader
   separation this commission needs. Read this first and completely.
2. `scripts/audit/types.ts` — the `AuditResult` and `CheckStatus` contracts.
3. `scripts/audit.ts` — the aggregate that calls every runner with no arguments.
4. `scripts/audit/validate-bank.ts`
5. `scripts/audit/audit-references.ts`
6. `scripts/audit/audit-positions.ts`
7. `scripts/audit/audit-ids.ts`
8. `scripts/audit/audit-topic-license.ts`
9. `scripts/audit/audit-producer-vocabulary.ts`
10. `scripts/audit/audit-authorial-constraint-leakage.ts`
11. `lib/producer-vocabulary-leakage.ts`
12. `lib/authorial-constraint-leakage.ts`
13. `lib/id-index.ts`
14. `lib/question-population.ts`
15. `lib/pipeline-paths.ts`
16. `src/schema.ts` and `src/bankImport.ts` — for `validateBankObject` and `parseBankText`
    option shapes. Do not assume validator options; read them.
17. `.github/workflows/` — the repository command steps must remain green.

---

## 3. Structural requirements

Revision 1 mandated a rigid four-layer pattern for every module. That mandate was wrong:
`validate-bank.ts` cannot analyze an "already-loaded bank object" because parsing and
validation *are* its check, and the two leakage loaders deliberately live in `lib/`. The
actual requirements are narrower.

**R1 — Options-driven, process-independent runners.** Every public runner takes an options
object with a default of `{}`, does not read `process.argv`, does not call `process.exit`,
does not mutate `process.exitCode`, and returns an `AuditResult`. Argv parsing, console
output, and exit handling live only in the standalone entry-point block.

**R2 — Reuse, do not invent.** Reuse existing pure analyzers where they already exist. Do
**not** extract or export a new pure analyzer solely to satisfy this commission. Explicit
loading may remain in the owning library where the current architecture already delegates
loading there (`lib/producer-vocabulary-leakage.ts`, `lib/authorial-constraint-leakage.ts`).

**R3 — The fail-loud / skip asymmetry.** This is the substantive requirement and it
survives every relaxation above:

> A **default directory sweep** keeps whatever skip behavior it has today. An
> **explicit-file loader must never skip.** A missing, unreadable, unparseable, or
> schema-invalid explicitly-requested file is a `FAIL` with the reason reported, because
> silently skipping a file the caller named could conceal the defect they asked about.

Current default-sweep behavior that must be preserved unchanged and must **not** carry
into explicit mode:

| Module | Current default-sweep behavior on a bad file |
|---|---|
| `validate-bank.ts` | records it as a `failures` entry (already fail-loud; keep in both modes) |
| `audit-references.ts` | `if (!result.ok) continue;` plus bare `catch {}` — silent skip |
| `audit-positions.ts` | `if (!result.ok) continue;` plus bare `catch {}` — silent skip |
| `audit-ids.ts` | `readdir` failure → `INSUFFICIENT`; per-file `readFile` / `parseBankText` failure → **throws** (the read sits outside any `try`); schema-invalid file → early `FAIL` return naming the file. See §7. |
| `audit-topic-license.ts` | early `{ error }` return → `INSUFFICIENT` (fail-loud; keep) |
| `scanBundledBanks` | **throws** |
| `scanBundledAuthorialConstraints` | **throws** |

For the two lib scanners, the explicit-file path must convert a scanner exception into an
`AuditResult` with `status: "FAIL"` and the reason in `detail`. The existing default-mode
throw behavior stays exactly as it is.

`audit-positions.ts` deserves special attention: a silently skipped file there does not
merely lose findings, it **shrinks the sample population and changes the statistic.** Its
explicit-file loader must fail loud for that reason specifically.

---

## 4. Scope: the seven modules

| # | File | Exported runner | Current default source | Mechanism |
|---|---|---|---|---|
| 1 | `scripts/audit/validate-bank.ts` | `runValidateBank()` | `banks/` | local `const PROMOTED_DIR = "banks"` |
| 2 | `scripts/audit/audit-references.ts` | `runAuditReferences()` | `banks/` | local `const PROMOTED_DIR = "banks"` |
| 3 | `scripts/audit/audit-positions.ts` | `runAuditPositions()` | `banks/` | local `const PROMOTED_DIR = "banks"` |
| 4 | `scripts/audit/audit-ids.ts` | `runAuditIds()` | `banks/` | imported `CANONICAL_DIR` from `lib/pipeline-paths` |
| 5 | `scripts/audit/audit-topic-license.ts` | `runAuditTopicLicense()` | `banks/` | imported `CANONICAL_DIR` from `lib/pipeline-paths` |
| 6 | `scripts/audit/audit-producer-vocabulary.ts` | `runAuditProducerVocabulary()` | `banks/` | `lib/producer-vocabulary-leakage.ts` → `scanBundledBanks(directory = "banks")` |
| 7 | `scripts/audit/audit-authorial-constraint-leakage.ts` | `runAuditAuthorialConstraintLeakage()` | `banks/` | `lib/authorial-constraint-leakage.ts` → `scanBundledAuthorialConstraints(directory = "banks")` |

### Already parameterized — do not modify

- `scripts/audit/audit-stage-refs.ts` — `runAuditStageRefs({ files?, strict? })`
- `scripts/audit/audit-non-mcq-bias.ts` — `runAuditNonMcqBias({ paths? })`, plus pure
  `runAuditNonMcqBiasOnBanks(banks)` and `runAuditNonMcqBiasOnQuestions(id, questions)`

### Deliberately excluded — do not modify

`scripts/audit/audit-integrity.ts` is **out of scope.** It compares each file in
`banks/banks-raw/` against a same-named counterpart in `banks/_promoted/` and asserts the
latter equals shuffle-plus-presentation-normalization of the former. Its `missingPromoted`
outcome is counted and reported but never pushed into `failures`, because a not-yet-staged
draft is not a defect at that phase. It is a **post-staging** equality proof, not a
candidate-local pre-promotion check. Its pure core `integrityForFile(draftText,
promotedText)` already accepts text rather than paths and performs no disk I/O, so it
needs no parameterization for any future caller. **Leave this file untouched.**

---

## 5. Frozen surfaces

### Path constants

The seven modules reach `banks/` through four different mechanisms (local `PROMOTED_DIR`,
imported `CANONICAL_DIR`, and two lib-level default parameters). This is inconsistent, and
unifying them is **explicitly out of scope.** Consolidating shared path constants is a
behavior-neutral refactor that touches modules beyond this commission and would make the
compatibility proof in §11 harder. Preserve each module's existing default-source
mechanism exactly as found.

### File-label conventions — default sweeps only

Each module attaches a `bank` / `bankPath` / `file` label to its findings, and these
conventions already differ: `scanBundledBanks` uses `basename(file)`, while
`scanBundledAuthorialConstraints` uses `join(directory, basename(file))`. **In default
sweep mode, preserve each convention exactly.**

**In explicit-file mode, use the first caller-supplied path spelling as the display
label.** Basename labeling is unsafe there, because different directories can contain the
same filename and arbitrary selected files must remain distinguishable.

### Validation profiles

The explicit-file loaders use **each module's existing validator options, unchanged.**
Read them from the source; do not assume. Note the consequence: several paths currently
require canonical-style metadata (`requireMeta: true`) and reject raw-only fields such as
`_compileManifest` under `rejectUnknownKeys: true`. Some historical raw formats will
therefore not pass through these runners in explicit mode.

**That is acceptable and intended for this commission.** Raw-only stripping,
compile-manifest handling, and any separate raw validation profile belong to Commission 2.
Do not introduce raw preprocessing here.

### Scope-descriptive prose

Several existing result and report strings describe the canonical population by name.
These become false when the same runner is pointed at selected raw files:

| Module | Current string |
|---|---|
| `audit-topic-license` report | `Status: report-only advisory generated from the current canonical banks.` |
| `audit-producer-vocabulary` | `... across N learner-facing canonical items.` |
| `audit-positions` | `No multiple_choice items found in the promoted bank.` |
| `audit-ids` | `All N bundled question IDs are globally unique across N file(s).` and `N duplicate question ID(s) found across bundled banks.` |

Rule: **default-mode prose remains unchanged. Explicit-file mode must accurately describe
the selected scope and must not call it canonical, promoted, or bundled.** This is
presentation only; it does not alter verdict semantics, statuses, or `failures` arrays.

The topic-license report needs particular treatment:

- with no `--file`: preserve the current report byte-for-byte;
- with `--file`: identify the input as explicitly selected files and identify that scope
  in the report;
- never emit "current canonical banks" in a selected-file report.

An optional rendering parameter such as `scopeDescription` is a reasonable implementation,
but the design is yours.

### `audit-positions` population

`runAuditPositions` currently examines **only top-level `multiple_choice` questions.** It
does not recurse into embedded case-study parts, so a direct-case file containing embedded
MC items can legitimately return `INSUFFICIENT`. **Preserve the current top-level-only
population.** Whether embedded MC parts should enter a raw-gate position distribution is a
Commission 2 policy decision. Do not repair it here; note it in the receipt.

---

## 6. Contract — the six single-scope modules

Modules 1, 2, 3, 5, 6, 7 take a single optional file-list scope. Use these exact type
names:

```ts
export type RunValidateBankOptions = { files?: string[] };
export type RunAuditReferencesOptions = { files?: string[] };
export type RunAuditPositionsOptions = { files?: string[] };
export type RunAuditTopicLicenseOptions = { files?: string[] };
export type RunAuditProducerVocabularyOptions = { files?: string[] };
export type RunAuditAuthorialConstraintLeakageOptions = { files?: string[] };
```

Each `files` field carries this doc comment:

```
/** Audit exactly these file paths instead of sweeping the default directory.
 *  Fails loud: a missing, unreadable, unparseable, or schema-invalid selected
 *  file is never silently skipped. */
```

Required behavior:

- `files === undefined` → current default directory sweep, unchanged in every respect:
  same status, same finding order, same `failures` array, same substantive `detail`, same
  handling of a missing or unreadable directory.
- **`files: []` → the runner returns `AuditResult` with `status: "FAIL"`** and a reason
  naming the empty selection. This obligation belongs to the runner, not the CLI, because
  Commission 2 will call these functions programmatically. The CLI parser passes
  `files: undefined` when no `--file` appears — it must never pass `[]`.
- `files` non-empty → load exactly those paths, in the order given, deduplicated per §8.
- Every module keeps its existing `AuditResult.name` string. Do not rename checks.

### Module-specific notes

**`validate-bank.ts` (1).** Its per-file `try/catch` already records read/parse failures as
`failures` entries rather than skipping; preserve in both modes. Its
`readdir(PROMOTED_DIR)` is **not** wrapped in `try/catch`, unlike sibling modules that
return `INSUFFICIENT` on a missing directory. Preserve that difference; do not "fix" it.

**`audit-references.ts` (2).** Reuse the existing pure
`checkQuestionReferences(q: Question): ItemFailure | null`. It already recurses into
case-study parts. The runner currently **discards file identity** after loading —
`ItemFailure` carries no filename. In explicit mode, the `detail` must identify which
selected file each item failure came from. Default-mode `detail` stays exactly as it is.

**`audit-positions.ts` (3).** Reuse `analyzeGroup`; do not extract a new bank-level
analyzer. This runner returns `failures: []` in every branch and produces a histogram over
the whole population — it has no per-item or per-file findings and must not acquire any.

**`audit-topic-license.ts` (5).** Reuse the existing pure `analyzeTopicLicenses(banks)`;
its `TopicLicenseFinding` already carries a `file` field. Preserve the `{ files, banks,
error }` loader shape on directory failure. The ordinary no-argument `WARN` summary
reports aggregate counts only — keep it byte-for-byte. In explicit mode the analysis and
any generated report must preserve each finding's file label.

**`audit-producer-vocabulary.ts` (6) and `audit-authorial-constraint-leakage.ts` (7).**
These delegate entirely to lib scanners. Parameterize **the lib scanners**; do not build a
parallel traversal in `scripts/audit/`. Both libs already expose a pure per-question core:

- `lib/producer-vocabulary-leakage.ts` →
  `scanQuestionForProducerVocabulary(question: Question, bank: string): LeakageOccurrence[]`
- `lib/authorial-constraint-leakage.ts` →
  `scanQuestionForAuthorialConstraints(question: Question, bankPath: string): AuthorialConstraintCandidate[]`

Add a file-list entry point beside each existing directory sweep — `scanSelectedBanks(files:
string[])` and `scanSelectedAuthorialConstraints(files: string[])` — that loads the given
paths and calls the existing pure per-question scanner. Keep
`scanBundledBanks(directory = "banks")` and
`scanBundledAuthorialConstraints(directory = "banks")` signatures and behavior intact,
including their current throw-on-validation-failure. Preserve the aggregate counters each
scan returns (`canonicalItemsScanned`, `banksScanned`, `topLevelQuestionsScanned`,
`scoredLeavesScanned`) and compute them the same way on the file-list path. Preserve
`sortAuthorialConstraintCandidates` ordering.

---

## 7. Contract — `audit-ids.ts` (module 4), two populations

This module does **not** take a single `files?` scope. A single scope would produce a
silent false negative: it would answer only "do these candidates collide with each other"
and would **pass a raw candidate whose IDs collide with a canonical bank** — the single
most important thing a pre-promotion ID check must catch.

```ts
export type RunAuditIdsOptions = {
  /** Files whose IDs are being evaluated. Findings attribute to these. */
  candidates?: string[];

  /** Files checked for collisions against the candidates.
   *  Defaults to the current canonical sweep of banks/*.json. */
  comparison?: string[];
};

export async function runAuditIds(options: RunAuditIdsOptions = {}): Promise<AuditResult>;
```

### The central invariant — reproduce this comment verbatim in the source

```
A candidate-scoped ID audit reports a collision only when at least one colliding
location belongs to the candidate population. Comparison-only collisions are outside
the candidate verdict and must not poison every subsequent candidate run.
```

### Required behavior

- **No options** → preserve the current canonical sweep of `CANONICAL_DIR` exactly. Its
  four default error behaviors are **frozen as found**; do not normalize them:
  - unreadable canonical directory → `INSUFFICIENT` (the `readdir` is inside a `try`);
  - malformed or unreadable canonical **file** → the promise **rejects/throws**, because
    `readFile` and `parseBankText` sit outside any `try` block. Do not wrap them to make
    this a returned `FAIL`; that would be a silent semantic change to default behavior.
  - schema-invalid canonical file → early returned `FAIL` naming the file;
  - any explicit candidate/comparison load problem → returned `FAIL` (new behavior, this
    commission).
- **Argument validation, at the runner:**
  - `candidates: []` → `FAIL`.
  - `comparison` supplied without `candidates` → `FAIL`.
  - `comparison: []` with non-empty `candidates` → **legal**; means candidate-to-candidate
    checking only.
  - `comparison` omitted with non-empty `candidates` → defaults to the canonical
    `banks/*.json` listing.
- **Strict loading for both populations.** A missing, unreadable, malformed, or
  schema-invalid file in *either* set fails loudly. Skipping any file could conceal a
  collision.
- **Detect across the union, report by candidate membership.** Build the collision map
  over candidates ∪ comparison using the existing pure
  `findIdCollisions(banks: Array<{ bank: BankEnvelope; file: string }>): IdLocation[][]`,
  then filter to groups containing at least one location whose file belongs to the
  candidate population. Do not reimplement collision detection.
  - candidate ↔ candidate collision → **FAIL**
  - candidate ↔ comparison collision → **FAIL**
  - collision wholly inside comparison → **not reported, not attributed, not a failure**
- **Preserve full location evidence.** The `detail` must show which candidate path and
  JSON path collided with which comparison path and JSON path. `findIdCollisions` returns
  `IdLocation[]` groups via `collectQuestionIds` from `lib/id-index.ts`, which carries
  `id`, `file`, and `path`; render all of it.
- Keep `AuditResult.name` as `"audit:ids"`.

---

## 8. Path identity and deduplication

Literal-string deduplication is insufficient. All of these name the same file:

```
banks/foo.json
./banks/foo.json
/Users/holemini/Desktop/Project Shrimp/banks/foo.json
```

Loading it twice would double-count findings and, in `audit-ids.ts`, manufacture a
spurious self-collision. Therefore, for every module in explicit-file mode:

- Use `resolve(path)` as the **deduplication key** and, for `audit-ids.ts`, as the
  **population-membership key**.
- Preserve the **first caller-supplied spelling** as the explicit-mode display label
  (see §5).
- In `audit-ids.ts`, when a resolved path appears in both populations, **candidate
  membership wins** and the path is removed from the comparison set, so a file never
  collides with itself.
- Never determine candidate membership from `basename`. Different directories can contain
  the same filename.

---

## 9. CLI wrappers

Each of the seven modules gains argv parsing in its standalone entry-point block only,
following the `parseCliArgs` shape in `audit-stage-refs.ts`:

- Modules 1, 2, 3, 6, 7: `--file <path>` (repeatable).
- Module 4 (`audit-ids.ts`): `--candidate <path>` and `--comparison <path>`, both repeatable.
- Module 5 (`audit-topic-license.ts`): **must preserve the existing `--output=<path>`
  syntax**, and additionally accept repeatable `--file <path>`. Both may be supplied
  together. With `--file`, the generated report is produced from the selected files. With
  no `--file`, the canonical report is produced exactly as today.
- A flag with a missing or whitespace-only value throws with a clear message and exits 1.
- No arguments → current default behavior and current exit semantics, unchanged.

**Intentional behavior change, to be stated in the receipt:** unknown arguments now throw
and exit 1. `audit-topic-license.ts`'s current `runCli` silently ignores any argument that
is not `--output=`; after this change it will reject unknown arguments. This is deliberate
— a scoped gate must not silently ignore a mistyped `--file`.

### Exit codes

Add, for every standalone CLI in this commission:

> A returned `AuditResult` with `status: "FAIL"` exits 1. `PASS`, `WARN`, and
> `INSUFFICIENT` exit 0.

Wrappers implement failure status by assigning `process.exitCode = 1` and then returning
from a parse-error branch or falling through naturally after result output. They must not
call `process.exit()` after writing output, because forced termination can truncate
asynchronous stdout or stderr. Successful execution must not explicitly assign exit code
0; it falls through naturally.

This does not alter any existing no-argument exit behavior; it defines the new
explicit-file failure path. It matters most for `audit-topic-license.ts`, whose advisory
CLI never encounters `FAIL` today and currently sets no failure exit code at all — without
this rule a correct implementation could print `[FAIL] audit:topic-license` and still exit
0, which would be invisible to any caller.

### Entry-point guard hardening

Three modules currently guard their standalone block with a substring test on
`process.argv[1]`:

```ts
if (process.argv[1]?.includes("validate-bank"))    // scripts/audit/validate-bank.ts
if (process.argv[1]?.includes("audit-references")) // scripts/audit/audit-references.ts
if (process.argv[1]?.includes("audit-positions"))  // scripts/audit/audit-positions.ts
```

**This is hardening, not repair of a live defect.** No current import path causes a
cross-entry-point firing: `scripts/validate-bank.ts` does not import
`scripts/audit/validate-bank.ts`, so `npm run validate-bank` never evaluates the audit
module's guard. But all three modules are about to start parsing arguments, and a substring
match is not a module identity test — a future import from a process whose `argv[1]`
happens to contain the substring would enter the CLI wrapper and could throw on an
unknown argument.

Replace all three with an exact module identity check, matching the form the other four
modules already use:

```ts
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
```

(`audit-stage-refs.ts`, `audit-ids.ts`, and `audit-topic-license.ts` use the equivalent
`process.argv[1] === fileURLToPath(import.meta.url)` form; either is acceptable, but be
consistent within a file.) Do not modify the four modules that already use an exact guard.

Keep `npm run validate-bank` in the verification set as a plain regression check.

---

## 10. Tests

Existing test files: `scripts/tests/audit-ids.ts`, `scripts/tests/audit-topic-license.ts`,
`scripts/tests/producer-vocabulary-leakage.ts`,
`scripts/tests/authorial-constraint-leakage.ts`. There is no test file for `validate-bank`,
`audit-references`, or `audit-positions` — create them.

For **each** of the seven modules:

1. one valid explicitly selected file;
2. multiple explicitly selected files;
3. a selected path that does not exist → loud failure, not a skip;
4. a selected file containing malformed JSON → loud failure;
5. a selected file that is schema-invalid → loud failure;
5b. a selected file that exists but is **unreadable** → loud failure. If the environment
    cannot produce an unreadable file (for example, tests running as root), report that in
    the receipt rather than silently omitting the case;
6. two spellings of the same path (`banks/x.json` and `./banks/x.json`) resolve to one
   load;
7. `{ files: [] }` (or `{ candidates: [] }`) returns `status: "FAIL"` from the **runner**;
8. default no-argument invocation unchanged (see §11).

**Attribution obligations are module-specific.** Revision 1's universal "a finding in file
B is reported against file B" was impossible for `audit-positions`, which has no per-file
findings at all. Replace with:

- `validate-bank`, `producer-vocabulary`, `authorial-constraint-leakage`, `audit-ids`:
  exact selected-path attribution on findings.
- `audit-references`: explicit-mode `detail` identifies the selected file for each item
  failure; default-mode `detail` unchanged.
- `audit-topic-license`: selected-file analysis and any generated report preserve each
  finding's `file` label; no-argument summary unchanged.
- `audit-positions`: prove that **only** the selected files contribute to the histogram
  and the sample count, and that a selected file which fails to load produces `FAIL`
  rather than being dropped from the population. **No per-file attribution requirement.**

For `audit-ids.ts` additionally:

9. candidate ↔ candidate collision → FAIL;
10. candidate ↔ comparison collision → FAIL, with both locations rendered;
11. duplicate IDs wholly inside `comparison` → **not** reported and **not** a failure;
12. a path supplied in both sets is treated as a candidate and does not self-collide,
    including when the two sets spell it differently;
13. `comparison: []` with non-empty candidates runs candidate-only and does not error;
14. `comparison` without `candidates` → FAIL;
15. embedded case-study leaf IDs participate in collision detection (`collectQuestionIds`
    already recurses; prove it still does through the candidate path).

### CLI-level subprocess tests — all seven wrappers

§9 imposes a uniform CLI contract, so the proof must be uniform too. Add a table-driven
subprocess test covering **every one of the seven wrappers**, not just topic-license:

- malformed selected file → exit 1;
- unknown flag → exit 1;
- flag with a missing value → exit 1;
- flag with a whitespace-only value → exit 1;
- a run yielding `PASS`, `WARN`, or `INSUFFICIENT` → exit 0.

Drive these as real child processes so the exit code is observed, not inferred from a
runner return value.

For `audit-topic-license.ts` additionally:

16. `--output=<path>` alone still produces the canonical report, byte-for-byte;
17. `--output=<path>` together with `--file` produces a report from the selected files;
18. an unknown argument throws;
19. a malformed selected file makes the standalone CLI exit nonzero.

### Scope-prose coverage — contextual, not a word ban

For the four modules listed in §5 under *Scope-descriptive prose*:

20. explicit-file mode does not describe the **scanned population** as canonical, promoted,
    or bundled;
21. default no-argument output still contains its original wording unchanged.

These words are not banned outright. `audit-topic-license.ts` legitimately uses "canonical"
to describe the **topic vocabulary** ("exact canonical topic vocabulary membership"), which
remains true regardless of which files were scanned. Assert on population-describing
phrases, not on bare word occurrence.

Use temporary fixture files under a test-local temp directory; do not add fixtures to
`banks/` or `banks/banks-raw/`. Clean up after the run.

Add a `package.json` script entry for every test file lacking one, following the existing
`test:<name>` convention. Report which entries you added and which already existed. Do not
remove or rename existing entries.

---

## 11. Compatibility acceptance

"Byte-identical output" is **not** the standard, because internal path labeling may
legitimately change. The standard is:

1. **Live baseline capture.** Before making any edit, and on the new branch, capture all of
   the following to a temporary location **outside the repository** (e.g. the system temp
   directory — never inside the working tree, which §0 forbids):
   - the seven no-argument `AuditResult` objects, serialized;
   - the seven standalone CLI invocations: stdout, stderr, and exit code;
   - `npm run audit` output and exit code;
   - the canonical topic-license report generated with a **fixed** `inputGitSha` so the
     volatile field does not defeat comparison.

   After implementation, re-run all four and prove equality against the capture. Compare
   **before any commit changes `HEAD`**, since the report embeds a git SHA. Delete the
   temporary capture afterward and state in the receipt that you did. This one-time live
   comparison is separate from, and additional to, the permanent fixture tests in §10.
2. Each standalone default CLI invocation produces unchanged status, unchanged finding
   order, unchanged exit code, and unchanged substantive `detail` text.
3. `npm run audit` produces unchanged output and an unchanged final verdict.
   `scripts/audit.ts` calls all seven runners with no arguments; that call site must not
   need editing. **If you find yourself editing `scripts/audit.ts`, you have changed a
   default — stop and report.**
4. All pre-existing `npm run test:*` scripts pass.
5. Explicit-file paths fail loudly rather than inheriting default-sweep skip behavior.
6. `npx tsc -b --pretty false` is clean.

---

## 12. Verification commands

Run and record output for all of:

```
npx tsc -b --pretty false
npm run validate-bank -- banks/*.json
npm run validate:bank
npm run audit
npm run audit:topic-license
npm run census:check
npm run build
```

Plus every `npm run test:*` script, including the ones you add. Also run the repository
command steps that `.github/workflows/` invokes — the build/test/lint steps, **not**
deployment or artifact-upload actions — and confirm they stay green.

**Do not run `npm run census`.** It rewrites `census.json` and `BANK-CENSUS.md`, which §0
forbids, and running it immediately before `census:check` would regenerate the expected
artifact and then compare it against itself, masking any drift. `npm run census:check` is
the non-writing drift check this commission needs; it strips the volatile `generatedAt`
and `inputGitSha` fields and compares the stable payload only. A clean `census:check` is
the expected result, since nothing regenerable changes here.

**Do not run `npm run promote`, `npm run consolidate`, or anything else that writes to
`banks/`, `banks/_promoted/`, or `BANK-REVIEW-LEDGER.md`.**

---

## 13. Receipt

Return a compact receipt, not diffs:

- files changed, one line each on what changed;
- for each of the seven runners: the exact options type name, and confirmation that the
  no-argument `AuditResult` deep-equals the §11.1 live baseline capture;
- confirmation that the temporary baseline capture lived outside the repository and was
  deleted;
- entry-point guard hardening: before/after for all three substring-guarded modules, plus
  confirmation that `npm run validate:bank` and `npm run validate-bank` both behave
  correctly;
- `audit-topic-license`: confirmation that `--output=` still works alone, works with
  `--file`, and that unknown-argument rejection is the only intentional CLI behavior
  change;
- test files added, test cases per module, `package.json` entries added vs. already present;
- full output status of every command in §12;
- confirmation that `audit-positions` remains top-level-only and that no raw preprocessing
  or validation-profile change was introduced;
- the recorded starting `HEAD`, `git status --short`, and the name of the branch you
  created from it, with this commission's changes clearly separated from anything
  pre-existing;
- confirmation that nothing under `audit/stage-reference-semantic-census-2026-07-23/` was
  touched, and that no merge to `main` was attempted;
- confirmation that the `PROJECT-HISTORY.md` entry was deliberately deferred to the
  post-merge publishing pass and not written;
- the CLI subprocess matrix result for all seven wrappers, and whether an unreadable-file
  fixture was producible in this environment;
- confirmation that explicit-file output describes the selected scope and does not call it
  canonical, promoted, or bundled, while default-mode prose is unchanged;
- any place where live code contradicted this spec, quoted exactly;
- any check you were tempted to add and did not, because it was out of scope.

---

## 14. Acceptance checklist

- [ ] Seven runners accept an explicit scope; `audit-integrity.ts`, `audit-stage-refs.ts`,
      `audit-non-mcq-bias.ts`, and `promote.ts` untouched
- [ ] Exact options type names from §6 and §7 used
- [ ] `runAuditIds` implements the two-population contract with the verbatim invariant
      comment from §7
- [ ] Comparison-only collisions are not attributed to candidates and do not fail a
      candidate run
- [ ] Empty-selection rejection lives in the **runner**, not only the CLI parser
- [ ] `resolve(path)` used as dedup and membership key; first caller spelling used as the
      explicit-mode label; default-sweep labels unchanged
- [ ] Explicit-file loaders fail loud on missing / unreadable / malformed / schema-invalid;
      lib-scanner exceptions converted to `FAIL` in explicit mode only
- [ ] Existing pure analyzers reused; no new analyzer extracted solely for this commission
- [ ] `audit-topic-license` `--output=<path>` preserved and composable with `--file`
- [ ] All three substring entry-point guards replaced with exact module identity checks
- [ ] `audit-positions` remains top-level-only with no per-file attribution
- [ ] Existing validator options unchanged; no raw preprocessing introduced
- [ ] Path constants **not** consolidated
- [ ] Live no-argument `AuditResult` deep-equal for all seven; temp capture outside repo,
      then deleted
- [ ] `scripts/audit.ts` unedited
- [ ] `npm run audit` output and verdict unchanged
- [ ] `npm run census` **not** run; `npm run census:check` clean
- [ ] All tests pass; `tsc -b` clean; `build` succeeds
- [ ] No bank, schema, census, prompt, or governance file changed
- [ ] No `gate:raw`, no verdict/fatality policy, no bias-enforcement change
- [ ] Standalone CLIs exit 1 on `FAIL` and 0 on `PASS` / `WARN` / `INSUFFICIENT`; proven at
      CLI level for `audit-topic-license`
- [ ] Explicit-file prose describes the selected scope; no `canonical` / `promoted` /
      `bundled` population wording in explicit mode; default prose unchanged
- [ ] Pre-existing worktree entries preserved; no `git clean` / `reset` / `stash` / broad
      `checkout`; nothing under `audit/stage-reference-semantic-census-2026-07-23/` touched
- [ ] `audit-ids` default error behaviors frozen: `readdir` → `INSUFFICIENT`, file read /
      parse → still throws, schema-invalid → returned `FAIL`
- [ ] CLI subprocess matrix passes for all seven wrappers
- [ ] Scope-prose assertions target population descriptions, not bare word occurrence
- [ ] Baseline capture covers runners, CLI outputs and exit codes, `npm run audit`, and the
      fixed-SHA topic-license report; compared before any commit moved `HEAD`
- [ ] Starting state verified (clean, on `main`, Revision 4 checked out); work done on a
      dedicated branch from that HEAD; no merge to `main`
- [ ] `PROJECT-HISTORY.md` deferred, not written
- [ ] Independent review still pending
