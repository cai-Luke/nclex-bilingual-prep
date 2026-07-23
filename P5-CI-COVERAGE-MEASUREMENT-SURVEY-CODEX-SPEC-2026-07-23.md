# P5 CI Coverage Measurement Survey - Codex Commission Spec

**Date:** 2026-07-23
**Seat:** Codex (implementation / measurement). Producer seat.
**Authority:** Architect commission. Not ratified policy. This document authorizes a
measurement and inventory pass only.
**Status:** Open work order. Immutable during execution.

This file is written in plain ASCII (no em-dashes, no curly quotes) deliberately, so that
anchor text is safe for later programmatic edits.

---

## 1. Purpose

The open P5 question is whether the pull-request gate should be widened. The prior architect
handoff (`NEXT-ARCHITECT-DETERMINISTIC-HANDOFF-2026-07-16.md`, section "P5 - CI hardening
candidate") names four candidate additions and gives one binding instruction:

> Measure runtime and redundancy first.

This commission executes that instruction. It produces evidence. It does not change CI.

**The deliverable is a decision packet, not a policy change.** No workflow file is edited by
this commission. The eventual decision on each candidate is the repository owner's, taken
separately, on the evidence this commission produces.

---

## 2. Non-goals (binding)

Do not, under this commission:

1. Edit any file under `.github/workflows/`.
2. Add, remove, or reorder any CI step.
3. Add a `test:*` regression for the survey, or wire anything into `npm run test-visuals`,
   `npm run audit`, or the promotion gate.
4. Bump GitHub Actions versions, add `permissions:`/`concurrency:` blocks, or add path filters.
   Observations about these are in scope; changes are not.
5. Change the behavior, output, or default population of any existing script.
6. Write to `DECISIONS.md`, `PROJECT-HISTORY.md`, `AGENTS.md`, `CLAUDE.md`, or
   `BANK-REVIEW-LEDGER.md`.
7. Commit any defect constructed under section 7. Those live only in a throwaway worktree.
8. Modify `package.json` other than the single script addition named in section 4.

---

## 3. Inputs (read live at HEAD; do not trust this document's summaries)

Read each of these from the working tree at the commit you run on. Record the commit SHA.

- `.github/workflows/promotion-gate.yml` - the pull-request gate.
- `.github/workflows/pages.yml` - the post-merge deploy workflow (`push` to `main`).
- `package.json` - the full npm script surface.
- `scripts/audit.ts` - the aggregate gate the PR workflow calls.
- `scripts/audit/*.ts` - the audit modules `scripts/audit.ts` composes.
- `scripts/validate-bank.ts` and `scripts/audit/validate-bank.ts` - two distinct validators.
- `.gitignore` - needed before any measurement touches `dist/` or `*.tsbuildinfo`.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`.

### 3.1 Repository state and frozen measurement snapshot

This work order must be committed before execution. Start from a clean dedicated branch created
from current local `main`; report the branch, starting HEAD, upstream state, and starting changed
paths. The two raw-gate commissions named in earlier planning are already merged and are not an
active concurrency warning at this snapshot. Nevertheless, re-read live state: if HEAD, either
workflow, `package.json`, or an audited script changes after the measurement worktree is created,
stop and recreate the measurement snapshot rather than reconciling mixed inputs.

Capture `MEASURED_HEAD=$(git rev-parse HEAD)` before adding any task-owned code. Every coverage,
runtime, redundancy, and defect-construction claim in this commission is about a clean throwaway
worktree checked out at exactly `MEASURED_HEAD`. The task-owned `survey:ci-coverage` script must not
enter the pre-existing-script denominator it is measuring.

---

## 4. Deliverables

1. **`scripts/ci-coverage-survey.ts`** - the deterministic census generator (section 5).
2. **One** new `package.json` script, exactly:
   `"survey:ci-coverage": "tsx scripts/ci-coverage-survey.ts"`.
   No `test:` counterpart. No CI wiring.
3. **`audit/ci-coverage-survey-2026-07-23.manifest.json`** - machine-readable census output.
4. **`audit/ci-coverage-survey-2026-07-23.report.md`** - the human decision packet
   (sections 6 through 9).
5. **A handoff note** in the PR description stating the commit SHA measured, the hardware and
   Node version used, and any step of this spec that could not be executed as written.

---

## 5. Deterministic census (`scripts/ci-coverage-survey.ts`)

### 5.1 Unit of analysis

The census unit is the **npm script**, not the underlying module. Module-level composition
(for example, what `scripts/audit.ts` imports and runs in-process) is handled as written
analysis in section 6.2, not as census structure. Do not attempt TypeScript import-graph
resolution in the generator.

### 5.2 Extraction

The generator must accept an optional `--root <path>` input-root argument, defaulting to `.`.
All paths it inventories are resolved beneath that root. The dated manifest for this commission
must be generated against the frozen measurement worktree at `MEASURED_HEAD`, not against the live
implementation tree after the new survey script has been added. This prevents the survey from
counting itself as a pre-existing unreachable script.

For every entry in the input root's `package.json` `scripts`, record:

- `name`
- `body` (verbatim)
- `childScripts`: names referenced via `npm run <name>` in the body
- `entrypoints`: `scripts/**/*.ts` paths referenced via `tsx <path>` in the body
- `rawCommands`: any other executable invocation in the body (for example `vite build`,
  `tsc -b`)

For each workflow file, record per job and per step: step `name`, each `run:` line, and which
npm scripts each line invokes.

### 5.3 Reachability - report per workflow, never pooled

Compute the transitive closure of npm scripts invoked, **separately** for each workflow:

- `reachableFromPullRequest` - closure over `.github/workflows/promotion-gate.yml`
- `reachableFromMainPush` - closure over `.github/workflows/pages.yml`
- `unreachableFromAnyWorkflow` - the complement over all `package.json` scripts

**Do not emit a single pooled "covered by CI" count anywhere in the manifest or the report.**
A script reachable only from `pages.yml` is not covered at pull-request time, and collapsing
the two sets destroys the distinction this whole commission exists to measure. Every coverage
number in both artifacts is per-workflow or it is not reported.

Also emit `reachableFromMainPushOnly` (in `reachableFromMainPush`, not in
`reachableFromPullRequest`). That set is the direct subject matter of candidates A, B and D.

### 5.4 Provenance block (required)

The manifest must carry, at top level:

- `generatedAt` (ISO 8601)
- `inputGitSha` (`git -C <input-root> rev-parse HEAD`)
- `measurementRootKind: "throwaway_git_worktree"`
- `generatorGitSha` - the SHA of the tree the executing `scripts/ci-coverage-survey.ts` came
  from, or the literal string `"uncommitted-implementation-tree"` if it is not yet committed
- `generatorSha256` - sha256 of `scripts/ci-coverage-survey.ts` exactly as executed
- `inputs`: an array of `{ path, sha256 }` for **every** file the generator read beneath the
  frozen input root

`inputGitSha` and `generatorGitSha` will differ, by design: the analyzed root is frozen at
`MEASURED_HEAD` and does not contain the generator. Both must be recorded. A manifest carrying
only `inputGitSha` would attribute itself to a commit that does not contain the script that
produced it, which is a provenance defect of the same class as citing a source file for a
finding it does not contain. The generator is deliberately outside the `inputs` array because
it is not part of the measured surface; `generatorSha256` is how its identity is preserved.

`generatedAt` and `inputGitSha` are the **only** fields permitted to vary across different
input snapshots. Across the two required runs against the same frozen worktree, only
`generatedAt` may differ; `inputGitSha` must remain identical. Demonstrate this in the PR
description with the diff command you used.

Every citation in the report (section 6) must name a file and a line number that exists at
`inputGitSha`. A finding attributed to a file that does not contain it at that SHA is a
provenance defect and is a blocking error, independent of whether the finding is true. If the
implementation tree contains task-owned files absent from `inputGitSha`, they may be described in
the implementation receipt but may not be represented as part of the measured pre-existing
coverage surface.

---

## 6. Redundancy analysis (report section)

Written analysis, in `audit/ci-coverage-survey-2026-07-23.report.md`. Every claim carries a
`path:line` citation. State uncertainty as uncertainty; do not resolve an ambiguity by
choosing the tidier reading.

### 6.1 The duplication framing is not free

`pages.yml` triggers on `push` to `main`, that is, **after** merge. A check that exists only
there does not prevent a bad merge; it turns `main` red and blocks deploy. For every candidate
in section 7, the report must state the **present-day consequence of failure detection being
post-merge only** for that candidate, before it discusses redundancy. "Already covered by
`pages.yml`" is not by itself a finding of redundancy and must not be recorded as one.

### 6.2 Named questions to answer

Answer each of these explicitly. These are the questions; the answers are yours to determine
from the source.

1. **Two validators.** `package.json` maps `validate-bank` to `scripts/validate-bank.ts` and
   `validate:bank` to `scripts/audit/validate-bank.ts`. `pages.yml` runs the former with an
   explicit `banks/*.json` glob; `npm run audit` (the PR gate) runs the latter as Tier 0 over
   a default directory sweep. Determine whether, **for the promoted `banks/*.json` population
   specifically**, the two are equivalent in file population and in validation strictness. If
   they diverge, state exactly how and in which direction. Do not assume equivalence from the
   shared `validateBankObject` call; check the options passed and the pre-processing applied.
2. **Aggregate composition.** Enumerate what `scripts/audit.ts` runs in-process, and for each,
   its tier and whether a failure is **blocking or advisory**. An advisory check running in CI
   is not coverage in the gating sense; the report must distinguish these and must not count
   an advisory check as gate coverage.
3. **`test-visuals` contents.** Enumerate the test scripts composed into the `test-visuals`
   chain, and note that it is a `&&` chain (first failure masks the rest). State whether any
   other gate step has the same masking property.
4. **Committed generated artifacts.** Inventory every generated artifact that is committed to
   the repository (candidates to check include but are not limited to `census.json`,
   `BANK-CENSUS.md`, `docs/topic-vocabulary.md`, generated files under `audit/`, and dated
   survey manifests). For each: which command generates it, and what if anything verifies it
   is not stale. Today `npm run census:check` is one known drift check wired into the PR gate;
   confirm the complete live set rather than assuming it is the only one.

   Classify every artifact into one of these lifecycle classes before discussing a standing guard:

   - `LIVE_DERIVED_STATE` - intended to match current source continuously;
   - `ACTIVE_BASELINE` - a reviewed snapshot whose current equality is an executable invariant;
   - `DATED_HISTORICAL_EVIDENCE` - intentionally records an earlier bounded snapshot;
   - `ONE_TIME_RECEIPT` - attests to a specific completed operation or commit;
   - `UNCLEAR_REQUIRES_OWNER`.

   Do not recommend regenerating or continuously drift-checking historical evidence or one-time
   receipts merely because a script originally generated them. Candidate D applies only where the
   artifact's lifecycle makes current equality meaningful. Record the inventory method and any
   completeness limitation; generated markers, filename patterns, and `writeFile` literals are leads,
   not individually exhaustive discovery methods.
5. **Unreachable scripts.** From `unreachableFromAnyWorkflow`, identify which entries are
   genuinely intended to be on-demand tools (surveys, one-off migrations, dry-runs) versus
   regressions that plausibly should be gated. Group them; do not list ninety names flat.
6. **Typecheck/build overlap.** `npm run build` begins with `tsc -b`. State exactly which
   candidate-A coverage is subsumed by candidate B, which build-only failures remain unique to B,
   and whether A has value only as an earlier/faster failure boundary when B is present. Do not
   count the same TypeScript pass twice as independent coverage.
7. **Topic regression versus live enforcement.** For every candidate-C script, classify whether
   it protects detector/library behavior using fixtures, checks the live canonical corpus, or both.
   In particular, do not claim that adding `test:topic-license` makes live topic-license findings
   blocking unless the evaluated command actually exits nonzero on a live-corpus finding.

### 6.3 Workflow hygiene observations (report only)

Record, without changing anything: action version skew between the two workflows, absence or
presence of `permissions:` and `concurrency:` blocks, path filtering, and Node version
pinning consistency. One short subsection. These are not P5 candidates and must not be mixed
into the candidate analysis.

---

## 7. The four candidates

Give A, B, C, and D separate owner verdict lanes and do not recommend one all-or-nothing bundle.
This does **not** permit ignoring interactions. A and B require an explicit subsumption and ordered
runtime analysis because B invokes A's compiler internally. C must be decomposed by exact script and
by fixture-regression versus live-corpus effect. D is an umbrella and must be decomposed by artifact
family/lifecycle; the owner may ratify some guards and reject others.

- **A. TypeScript compilation** - `npx tsc -b --pretty false` at pull-request time.
- **B. Production build** - `npm run build` at pull-request time.
- **C. Topic regressions** - the topic vocabulary / license / population regression scripts at
  pull-request time. Name the exact script list you evaluated; derive it from live
  `package.json`, not from this document. Report one evidence sub-block per script and a separate
  live-enforcement conclusion.
- **D. Generated-artifact drift verification** - extending drift checking beyond current
  pull-request coverage to eligible `LIVE_DERIVED_STATE` and `ACTIVE_BASELINE` artifact families
  found in 6.2(4). Report one evidence sub-block per artifact family. Historical evidence and
  one-time receipts are inventory rows, not automatic guard candidates.

### 7.1 Forcing counterexample (required per candidate)

A clean corpus is not evidence that a gate is unnecessary. For A and B, and for each independently
meaningful C script or D artifact-family guard, construct a **minimal defect** in the throwaway
worktree (section 8) that:

- **(a)** the current pull-request gate step list passes, and
- **(b)** the candidate step catches.

Report, per candidate or subcandidate: the defect diff (keep it to a few lines, inline in the
report), the observed exit code and relevant output of the current gate step list, and the
observed exit code and failing output of the candidate step. Restore the frozen worktree to
`MEASURED_HEAD` between defects. Candidate-D prototype checks may use temporary scripts or shell
commands inside the throwaway worktree, but no prototype or generated mutation may enter the
commission diff.

Notes to save you time, to be verified rather than assumed:

- `tsx` strips types rather than checking them, so a type error in a module reached only by
  the application build is a plausible construction for A.
- For B, look for a defect that typechecks but fails at Vite resolution,
  `scripts/make-file-build.ts`, or `npm run validate:build-info`.
- For C, note that topic license runs advisory in the aggregate; a defect that produces an
  advisory warning but a zero exit is itself the finding.

**If no such defect can be constructed for a candidate, say so plainly.** That is a real
finding - the candidate adds no pull-request-stage coverage - and it is more valuable than a
strained construction. Do not manufacture a defect that no plausible change would introduce;
if the only construction you can find is artificial, report it as artificial and say why.

### 7.2 Per-candidate evidence block

For A and B, and for every C/D subcandidate, the report gives:

1. What it catches that the pull-request gate does not catch today.
2. Present-day consequence of that failure being detected post-merge only (per 6.1).
3. Marginal runtime, from section 8.
4. Failure modes: flakiness, network dependence, false-positive surface, sensitivity to
   unrelated changes.
5. The forcing counterexample from 7.1, or its explicit absence.
6. An optional producer-seat recommendation, marked as such.

**On recommendations.** You are the producing seat. A recommendation from the seat that
produced the evidence is weak evidence and is explicitly non-dispositive here. The census,
the runtimes, and the counterexamples are the deliverable; the recommendation is a
convenience. Do not write the report so that removing the recommendations would leave the
owner unable to decide.

---

## 8. Runtime measurement protocol

### 8.1 Isolation (binding)

Measure in a throwaway git worktree outside the live repository directory:

```
MEASURED_HEAD=$(git rev-parse HEAD)
git worktree add --detach ../Project-Shrimp-p5-ci-measure-2026-07-23 "$MEASURED_HEAD"
```

Do not nest the measurement worktree under the live repository. A nested checkout would appear as
an untracked subtree during the run and weakens the live-worktree isolation proof.

Run `npm ci` inside it. Perform all measurement and all section-7 defect construction there.
Keep the frozen worktree until the dated manifest has been generated twice and all report
citations and defect proofs are complete. Then remove it with `git worktree remove` and confirm in
the PR description that `git status` in the live worktree is byte-identical before and after the
measurement operations, apart from the deliverables in section 4 and this committed work order.

Rationale: measuring `tsc -b` and `npm run build` honestly requires deleting
`tsconfig.app.tsbuildinfo`, `tsconfig.node.tsbuildinfo`, and build output. `dist/` is present
in the live tree. Do not delete anything in the live tree; check `.gitignore` before assuming
any of these is disposable even inside the worktree, and record what you found.

### 8.2 What to measure

Measure the **marginal** cost of each step. `npm ci` is already paid by the existing gate and
is not attributed to any candidate; measure and report it once, separately, as shared cost.

Measure each of: every step currently in `promotion-gate.yml` (for baseline), plus
`npx tsc -b --pretty false`, `npm run build`, each script in candidate C's list, and each
executable drift-check prototype for an eligible candidate-D artifact family.

- Three runs each. Preserve raw elapsed milliseconds and report min / median / max to at least
  one decimal second. Whole-second-only reporting is prohibited because several focused regressions
  may complete in under one second.
- Record `node -v` and confirm whether it matches the `node-version` pinned in the workflows.
- For `tsc -b` and `npm run build`, report three **cold** runs and three **warm** runs, labeled.
  Before every cold run remove all ignored `*.tsbuildinfo` files and `dist/` inside the throwaway
  worktree. CI is cold; the cold number is the CI-relevant one.
- Measure the A/B interaction explicitly: A alone cold; B alone cold; and A followed by B, where
  B's internal `tsc -b` is warm. Report both total sequence cost and B's marginal cost after A.
  This is evidence for choosing A, B, or B without a redundant standalone A step.

### 8.3 Residual to record explicitly

Local wall-clock on this hardware is **not** GitHub Actions wall-clock. Report the numbers as
a relative cost ordering plus absolute local seconds, labeled with the hardware. Do not
extrapolate to CI minutes, do not estimate billing, and do not state a projected gate
duration. Record as an open residual that absolute CI timings must come from GitHub Actions
run logs, which this seat cannot read.

---

## 9. Report structure

`audit/ci-coverage-survey-2026-07-23.report.md`, in this order:

1. Provenance: commit SHA, date, hardware, Node version, worktree path used.
2. Per-workflow coverage summary (per 5.3; no pooled numbers).
3. Redundancy analysis (section 6), including all seven named questions and the hygiene
   subsection.
4. Runtime table (section 8), with the residual from 8.3 stated in the section, not in a
   footnote.
5. Candidate evidence blocks: A, B, each C script/live-enforcement lane, and each eligible
   D artifact-family lane (section 7.2).
6. Open residuals and anything this spec asked for that could not be executed as written.

---

## 10. Verification before handoff

Run and report the result of each:

1. `npx tsc -b --pretty false` (the new survey script must typecheck).
2. `npm run survey:ci-coverage -- --root ../Project-Shrimp-p5-ci-measure-2026-07-23`
   twice while the frozen worktree still exists; show that outputs differ only in `generatedAt`
   (and `inputGitSha` only if the frozen input SHA actually changed, which it must not during this
   commission), with the exact diff command used.
3. The full current `promotion-gate.yml` step list, unmodified, on the live tree, to confirm
   this commission's deliverables break nothing.
4. Confirmation that `.github/workflows/` is untouched (`git diff --stat` scoped to that path
   must be empty).
5. Confirmation that the `package.json` diff contains exactly one added line.

---

## 11. Handoff path after this commission

Report merges. Owner reads it and ratifies the verdict lanes separately: A, B, each C
script/live-enforcement proposal, and each eligible D artifact-family guard may land, be deferred,
or be rejected in any combination. The owner also decides whether B makes a separate A step
redundant or whether A is retained as an earlier failure boundary. Only after that ratification
does a separate implementation commission edit `.github/workflows/promotion-gate.yml`.

Spec ratification and candidate ratification are two separate decisions and must not be
collapsed. Nothing in this document authorizes a CI change.
