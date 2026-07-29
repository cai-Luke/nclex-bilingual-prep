# DECISIONS.md Reference-Graph Hardening — Codex Work Order

**Date:** 2026-07-29
**Seat:** Codex. Producer seat. Producer≠checker is a role rule, not a name rule: it attaches to
whichever model produces here. You produce; you do not gate your own output. The architect seat owns
this commission and performs the independent post-production check.
**Authority:** Architect commission under owner ratification 2026-07-29. Named as the required
successor pass by `DECISIONS-CLEANUP-PHASE-1-CLOSURE-CODEX-WORK-ORDER-2026-07-28.md` §9 non-goal 7
and §11, and by `DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md` §8 assertion 9 and §9 non-goal 3.
**Status:** Open work order. Clarified 2026-07-29 after producer preflight; the clarification does
not rebind `MIGRATION_BASELINE`. **Immutable during execution.** If you believe it is wrong, stop
and report; do not edit it and do not route around it.

**Governing contracts.** All at the repository root.

- `DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md` — RATIFIED 2026-07-28, together with
  `DECISIONS-FORMAT-FIXTURES-2026-07-28.md`. Governs the target grammar, identity, the retired
  register and its graph mapping, and the shared-parser rule. On any disagreement about grammar or
  identity it governs and you report the divergence rather than choosing.
- `DECISIONS-TAXONOMY-2026-07-24.md` — RATIFIED including Amendments 1–3. Governs kinds, statuses,
  forces, and identifier allocation.
- `DECISIONS-CLEANUP-PHASE-1-CLOSURE-CODEX-WORK-ORDER-2026-07-28.md` — completed. **Historical, not
  governing**, except that its §9 non-goal 2 freeze on the phase-1 measurement artifact remains in
  force and is restated and extended in §7 below.

**Boundary.** This work order exclusively governs scope, sequencing, writable paths, and verification
for the hardening pass. It authorizes no migration, no edit to `DECISIONS.md`, and no production or
CI wiring.

---

## 1. What this pass is for, in one paragraph

`scripts/decisions-reference-graph.ts` is bound end to end to the pre-migration `DECISIONS.md`
format. Its principle index parses `**N. … Status: TAG**` bold headers; against the ratified target
grammar it returns an empty map, which would silently reclassify every principle citation in the
corpus as `MISSING`. It synthesizes targets as `DECISIONS.md#principle-25`, which the format spec
§1 rules is not a permanent citation. It recognizes no `P`/`R` identifier token as a citation at
all. It has no `RETIRED` target state. It reimplements grammar the shared parser now owns. This pass
makes the generator format-aware in both directions, binds `MIGRATION_BASELINE`, and produces the
pre-migration measurement that the later migration commission verifies against. **Migration does not
begin until this lands cleanly and the architect seat has accepted it.**

---

## 2. The landing freeze — ratified by the owner 2026-07-29

From the moment `MIGRATION_BASELINE` is bound (§3 step 2) until the migration commission and its
independent verification are complete:

- No unrelated commits or pull-request merges to `main`.
- No edits to `DECISIONS.md` except the commissioned migration itself.
- No bank generation follow-through, review, repair, promotion, consolidation, ledger update, or
  census regeneration.
- The current raw bank remains held in place and untouched until this arc closes.
- No unrelated schema, UI, renderer, audit, documentation, or maintenance work lands during the
  interval.
- Only commits belonging to reference-graph hardening, baseline measurement, migration,
  conformance/reference verification, and bounded review repairs may land.

The freeze is owner-enforced, not producer-enforced. You do not police it. It is stated here because
it is the precondition that makes `MIGRATION_BASELINE` permanent, and because it changes the
staging-discipline calculus of the prior pass: unrelated in-flight work is no longer expected to land
alongside you. Stage by explicit path anyway.

---

## 3. Sequencing — the token binding

`MIGRATION_BASELINE` is not a token you choose. Format spec §4.2: it is the pre-migration measurement
baseline, **bound by this commission and permanent thereafter**, and it is written into the `Origin`
field of every archive wrapper the migration will create. It is already hard-coded as a literal in
`lib/decisions-format.ts` and in the ratified fixtures.

The order is fixed:

1. The architect seat commits this work order to `main`. Nothing else lands in that commit.
2. **That commit's SHA is `MIGRATION_BASELINE`.** The architect seat records it. You read it; you do
   not assign it.
3. The architect seat may land bounded governance clarifications under the §2 freeze before
   implementation begins. The last such clarification commit is `HARDENING_COMMISSION_HEAD`.
   It does not alter, replace, or rebind `MIGRATION_BASELINE`.
4. You implement on a branch cut from `HARDENING_COMMISSION_HEAD`, named
   `codex/decisions-reference-graph-hardening`.
5. You commit the implementation. The tree must be clean and the generator file must be tracked and
   unmodified before any measurement run (§8 ruling 5).
6. You run the hardened generator against a **detached worktree checked out at
   `MIGRATION_BASELINE`**, writing to the new output path in §6.
7. You commit the produced artifact.

Steps 5 and 6 are in that order and not the reverse. `generatorGitSha` in the manifest is computed by
`generatorGitSha()` in the existing script, which returns the literal string
`uncommitted-implementation-tree` whenever `git status --porcelain=v1` on the generator path is
non-empty. That sentinel is unacceptable provenance for the authoritative artifact.

---

## 4. Preflight — stop conditions

All five must hold. If any fails, **stop and report it**.

1. `git rev-parse --abbrev-ref HEAD` — record it.
2. `git status --porcelain` — must be **empty**.
3. Record both values the architect seat gives you. `git rev-parse HEAD` must equal
   `HARDENING_COMMISSION_HEAD`, and
   `git merge-base --is-ancestor "$MIGRATION_BASELINE" HEAD` must exit 0. Prove
   `DECISIONS.md` is byte-identical between `MIGRATION_BASELINE` and `HEAD`. `MIGRATION_BASELINE`
   remains the input token and is **not** `SURVEY_HEAD` (`f68210c`), **not** `CORRECTION_HEAD`
   (`547fdea`), and **not** `CLOSURE_HEAD`. A token that changes referent between passes is a
   provenance trap.
4. **Governing-contract integrity, verified by content and not by SHA.** All must hold at `HEAD`:
   - `DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md` status line contains `**RATIFIED 2026-07-28 by
     Luke (owner)`, and its §4.2 contains the sentence beginning `` `Origin` names a token, never a
     SHA. ``
   - `DECISIONS-FORMAT-FIXTURES-2026-07-28.md` exists at the repository root.
   - `lib/decisions-format.ts` exports `parseDecisionsDocument`, `parseRetiredIdentifierRegister`,
     and `checkDecisionsFormat`, and declares `RetiredIdentifierRow` with a `graphState` field typed
     `"RETIRED" | "MISSING"`.
   - `DECISIONS-TAXONOMY-2026-07-24.md` contains `**Allocation (Amendment 3).**`.
5. `audit/decisions-cleanup-2026-07-24/reference-graph.json` exists and is tracked. Record its
   `sha256`. It is the frozen phase-1 measurement and you will prove at §9 that you did not touch it.

Report all five before starting §5.

---

## 5. Scope — what the generator must become

### 5.1 The definition index becomes dual-mode, through the shared layer

The generator currently builds its principle index with a private `buildPrincipleIndex(decisionsText)`
that parses bold `**N. …**` headers and reads liveness from `Status:` tokens and enclosing `## …`
section headings. Format spec §6 forbids a second grammar authority: the conformance checker and the
reference graph both consume `lib/decisions-format.ts` and neither reimplements the grammar.

Therefore:

- **Target mode** reads live definitions through the existing exported
  `parseDecisionsDocument(text, source)`.
- **Legacy mode** reads pre-migration definitions through a **new, clearly named, pure legacy-only
  adapter added to `lib/decisions-format.ts`**. Move the existing `buildPrincipleIndex` logic there;
  do not leave a copy behind in the script. The adapter is pure — text and explicit context in,
  data out; no filesystem, git, process exit, or implicit global state, matching the §6 constraint
  on that module.
- **The legacy adapter must be exported under a distinct legacy-only name and must not be reachable
  from `checkDecisionsFormat` or from any code path the target-format conformance checker can call.**
  A legacy-format document must never be able to pass the target-format checker because both parsers
  share a module. Add a regression that fails if the conformance entry point ever consumes legacy
  output.
- The generator selects mode by inspecting the document it was handed, not by a flag the caller
  guesses at, and records the selected mode in the manifest. If a document satisfies neither
  grammar, that is a hard error, not an empty index.

The selection rule is closed:

1. Call `parseDecisionsDocument` first. A **target-format surface is observed** when any one of the
   following is nonempty or true: `index.present`, `entries`, `archiveIndex`, `retiredIdentifiers`,
   or `issues`.
2. When a target-format surface is observed, the document is target-intent. Run
   `checkDecisionsFormat`; it must return `ok: true`, and the parsed live-definition set must be
   nonempty. Otherwise fail closed as malformed target format. **Never fall back to legacy mode
   after observing a target-format surface.**
3. When no target-format surface is observed, call the distinct legacy adapter. A nonempty legacy
   definition set selects legacy mode. An empty set is an unrecognized-document hard error.

This commission intentionally tightens the conformance checker: `checkDecisionsFormat` must emit the
existing `MISSING_DECLARED_TOTAL` finding when the required target entry index is absent, as well as
when the index is present but has no valid declared-total line. Do not add a new reason code. This
ensures the legacy `DECISIONS.md` cannot return `ok: true` from the target-format checker merely
because both its target index and target entry population are empty.

An empty definition index must always be a hard error. The specific failure this pass exists to
prevent is a silently empty index producing a plausible-looking graph in which every principle
citation reads `MISSING`.

### 5.2 Citation extraction becomes dual-format, permanently

Format spec §1: `P25` is canonical for new writing; `principle 25` must remain resolvable
indefinitely, because `Archive/` is never rewritten under taxonomy §9. This is a permanent dual
grammar, not a migration-window compatibility shim.

- Retain the existing `principle n` grammar exactly as corrected, including the comma/`and`/`&`/`/`
  list form and the Oxford-comma case. Do not re-derive it; it is already correct and was corrected
  once at cost.
- Add canonical identifier citation extraction for tokens matching `^(P|R)\d+$` as whole words.
- Scan derived-identifier shapes before canonical identifiers and consume the full derived span.
  `P25.1` or `P25a` produces one derived-identifier record and must never also produce a resolved
  `P25` citation from the same bytes.
- A parsed identity surface is not a citation to itself. In target `DECISIONS.md`, do not emit
  canonical-reference records from live-entry headings, entry-index ID cells, or retired-register
  ID cells. In the archive document, do not emit them from archive-wrapper headings or archive-index
  labels. This exclusion is structural and limited to parser-identified declaration surfaces; an
  example or discussion of `P25` elsewhere in the corpus remains a reference candidate.
- Both forms resolve against the same definition index and produce the same target string for the
  same referent. `principle 25` and `P25` must be indistinguishable in the resolved output except in
  `rawText`. Assert this equivalence directly.
- Derived identifier tokens (`P25.1`, `P25a`, or equivalent) are **detected across the whole corpus**
  and reported as their own record class. This discharges format spec §8 assertion 9, which pins
  per-document detection to the conformance checker and defers full-corpus detection here.

### 5.3 Target synthesis

Format spec §1: the graph resolves an identifier citation to a synthetic target such as
`DECISIONS.md#P25`, never against the Markdown-anchor index, and a Markdown anchor link into a
`DECISIONS.md` entry heading is not a valid permanent citation.

- Replace the current `` `${PRINCIPLE_HOME}#principle-${n}` `` synthesis with the ratified synthetic
  form for both `P` and `R`.
- A Markdown anchor link whose target is a `DECISIONS.md` entry heading resolves as an invalid
  citation, distinguishably reported. It is not silently treated as a working link.

### 5.4 Target states

The `TargetState` union gains `RETIRED`. The ratified mapping is already implemented in the shared
parser: `RetiredIdentifierRow.graphState` is `"RETIRED"` for a `RETIRED` disposition and `"MISSING"`
for `NEVER ASSIGNED`. **Consume that field. Do not recompute the mapping in the generator.**

Per §8 ruling 1, `LAPSED` is legacy-mode-only. In target mode `LAPSED` is unreachable — live entries
never carry `SUPERSEDED` under format spec §2.4, and retirement is expressed through the register.
Emitting `LAPSED` in target mode is a defect; assert against it.

### 5.5 The two anchor algorithms are both correct and must not be unified

This is a real divergence on live disk and the most likely place for a quiet regression.

- `lib/decisions-format.ts` has a private `markdownHeadingAnchor(heading)` that lowercases, replaces
  each maximal run of non-Unicode-letter/digit characters with one hyphen, and trims. This is the
  algorithm format spec §1 ratifies **for `DECISIONS.md` entry-heading detection and archive-pointer
  resolution**, and the spec explicitly rejects the obsolete double-hyphen lookalike.
- `scripts/decisions-reference-graph.ts` has a private `slugify(headingText)` that strips
  `` ` ``, `*`, `_`, `~`, deletes remaining non-letter/digit/hyphen/space characters, then collapses
  whitespace runs to hyphens. This approximates GitHub's rendered-anchor behavior and is what
  corpus-wide Markdown link resolution requires.

They disagree on any heading containing intra-word punctuation. Both are correct in their own domain.
**Do not unify them, and do not "fix" one to match the other.** Keep corpus-wide link resolution on
the graph's GitHub-style algorithm and `DECISIONS.md`/archive anchor work on the ratified
run-collapsing algorithm. Add a named regression asserting that the two produce different output for
at least one heading containing an apostrophe, so that a future unification breaks a test rather than
a measurement.

### 5.6 I/T name-addressed citations

Ratified §8 rulings 2 and 3:

- I/T title-reference extraction and resolution are **inactive at `MIGRATION_BASELINE`**. Those
  titles do not exist as headings in the pre-migration document, so activating the lane there would
  report every I/T citation as `MISSING` for a reason that is not a defect.
- In target mode, the only I/T citation grammar is:

  ```text
  I: `<exact invariant title>`
  T: `<exact thread title>`
  ```

  The kind letter is uppercase and case-sensitive, followed by a literal colon, exactly one ASCII
  space, and a backtick fence of one or more backticks on the same line. The closing fence is the
  identical run; authors choose a fence longer than every backtick run inside the title. The
  candidate title is the nonempty byte sequence between the fences. The prefix must begin at line
  start or immediately after ASCII whitespace or `(`, `[`, or `{`. The closing fence must be
  followed by line end, ASCII whitespace, or one of `. , ; : ! ? ) ] }` (spaces in this list are
  explanatory, not additional accepted bytes). Extraction does not first consult the known-title
  index, so a syntactically valid unknown title reaches the zero-match lane. Bare prose, a bare
  backticked title, lowercase `i:`/`t:`, alternate spacing, quotation marks, and Markdown anchors are
  not I/T citations. No trimming, case folding, Unicode normalization, punctuation normalization,
  or whitespace normalization is permitted.
- Kind is part of the lookup. An `I:` candidate searches only invariant definitions and a `T:`
  candidate searches only thread definitions.
- In target mode, resolution is **exact, bounded, deterministic title matching only**. Never fuzzy
  matching, never partial titles, never semantic similarity, never inference from nearby prose.
- Exactly one exact match resolves.
- Zero exact matches is `MISSING`.
- Multiple exact matches is a **fail-closed index/conformance defect**, reported as such and exiting
  non-zero. It is not an `ambiguous` reference and never a fuzzy-resolution opportunity. Format spec
  §3 already makes a title collision a checker failure, so this branch cannot occur in a conformant
  document; if it occurs, the document is wrong.
- Markdown anchors are never permitted to become I/T identity by side effect. Exact title remains
  their identity.
- The synthetic target preserves that identity without using a Markdown slug:
  `DECISIONS.md#I:<exact title>` or `DECISIONS.md#T:<exact title>`.

The title fragility of name-addressed entries is a standing accepted risk under format spec §1. This
pass does not solve it and proposes no taxonomy or target-entry-format amendment. The syntax above
is reference-graph citation grammar only.

---

## 6. Output paths — and the frozen artifact

`scripts/decisions-reference-graph.ts` currently hard-codes:

```ts
const OUTPUT_PATH = "audit/decisions-cleanup-2026-07-24/reference-graph.json";
```

and writes with `writeFileSync(resolve(OUTPUT_PATH), …)`, which resolves against the process working
directory. **Running the hardened generator from the repository root would overwrite the frozen
phase-1 measurement.** That is the concrete accident this section prevents.

Required:

1. Remove the hard-coded constant. The output path becomes a **required** explicit CLI argument
   (`--out <path>`), alongside the existing required `--root <path>`. There is no default. Resolve a
   relative `--out` against the generator checkout's repository root, never against the measurement
   `--root` and never against an arbitrary process working directory. The resolved output must remain
   inside the generator checkout and outside the detached measurement worktree; otherwise fail closed
   before creating a directory or file.
2. The generator **refuses to write** to any path resolving to
   `audit/decisions-cleanup-2026-07-24/reference-graph.json`, and exits non-zero with a named error.
   This is a hard-coded prohibition on that one path, not a general heuristic.
3. This pass's artifact is written to:

   `audit/decisions-reference-graph-hardening-2026-07-29/pre-migration-reference-graph.json`

4. The frozen phase-1 artifact is **not** superseded as a measurement. Its generator is obsolete for
   current use; its measurement remains valid for the corpus and the questions it originally
   measured, and `findings.md` §G and §H reconcile against it exactly. Three artifacts will exist by
   the end of the arc and none overwrites another: the phase-1 historical null, this pre-migration
   baseline, and a later post-migration verification graph produced by the migration commission.
5. Add exactly one line to `package.json`'s `scripts` block, named `graph:decisions-refs`, invoking
   the hardened generator and matching the invocation convention of the existing
   `survey:decisions-refs` entry in that same file. **Do not remove or repoint
   `survey:decisions-refs`** — it names the phase-1 invocation and is referenced by completed
   governance. Do not restructure `package.json` and do not reorder its keys.

---

## 7. Manifest requirements

The manifest keeps its existing shape and adds:

- `formatMode` — `"legacy"` or `"target"`, as selected in §5.1.
- `inputGitSha` — must equal `MIGRATION_BASELINE` for this pass's artifact.
- `generatorGitSha` — must be a real SHA. The `uncommitted-implementation-tree` sentinel fails
  acceptance.
- `measurementRootKind` — retained; the run is against a detached worktree.
- Counts by target state including `RETIRED`.
- `ReferenceKind` gains the exact literals `"derived-identifier"` and
  `"invalid-anchor-citation"`. These are kinds, not `MissingClass` values. Their records carry
  `class: null`, `resolves: false`, and `targetState: "NOT_APPLICABLE"`. A derived-identifier record
  carries `target: null`; an invalid-anchor-citation record retains the normalized literal link
  target in `target` for diagnosis.
- `counts.derivedIdentifier` and `counts.invalidAnchorCitation` are required integer fields and equal
  the corresponding `counts.byKind` values. The two `counts.byKind` keys are present even when their
  value is zero. No new top-level record arrays are required; the records remain in `references`.

`generatedAt` remains the only field permitted to vary between two runs against the same frozen root.

---

## 8. The five ratified rulings, restated

Owner-ratified 2026-07-29. Restated in full so you never need chat context.

1. **`LAPSED` is legacy-mode-only.** In target mode, retired identifiers resolve as `RETIRED` and
   `NEVER ASSIGNED` resolves as `MISSING`.
2. **I/T title-reference extraction and resolution are inactive at `MIGRATION_BASELINE`**; they
   become active only against the target-format document.
3. **In target mode, zero exact I/T title matches is `MISSING`.** Multiple exact matches are a
   fail-closed index/conformance defect, not an `ambiguous` reference, and never a fuzzy-resolution
   opportunity.
4. **The legacy definition adapter may live beside the target parser in `lib/decisions-format.ts`,
   but it must be exported and consumed through a distinct legacy-only path that the target-format
   conformance checker cannot call.**
5. **The hardened generator must be committed and clean before either baseline measurement run.** The
   `uncommitted-implementation-tree` sentinel is unacceptable provenance for the authoritative
   artifact.

---

## 9. Fixtures and negative controls

Fixtures come before the implementation, per the discipline the format commission established: a
fixture whose expected result was produced by running the parser is not a fixture.

Add the dedicated sibling test `scripts/tests/decisions-reference-graph.ts` and place every case in
this section there. Run it directly as `npx tsx scripts/tests/decisions-reference-graph.ts`; do not
add a second package-script line, because §6 item 5 and §11 item 9 reserve the pass's sole
`package.json` addition for `graph:decisions-refs`. Leave `scripts/tests/decisions-format.ts`
unchanged; the new suite may call the public conformance entry point to prove the legacy adapter is
unreachable from it. Cover at minimum:

1. Legacy adapter parses a legacy fixture correctly and returns liveness for both the
   `Status: TAG` form and the `CONDITIONAL` lane form.
2. Target parser returns the correct definition set for a target-format fixture.
3. Legacy adapter is unreachable from the conformance entry point.
4. Missing target index yields `MISSING_DECLARED_TOTAL`; the closed mode-selection rule in §5.1
   chooses target intent without legacy fallback, and an empty definition index is a hard error in
   both modes.
5. `principle 25` and `P25` resolve identically.
6. `RETIRED` and `NEVER ASSIGNED` map to `RETIRED` and `MISSING` respectively, read from
   `graphState`.
7. `LAPSED` is unreachable in target mode.
8. I/T extraction is inactive in legacy mode. In target mode, pin every delimiter, boundary,
   case-sensitivity, and no-normalization rule in §5.6; exact-one resolves, zero is `MISSING`, and
   two is a fail-closed defect with non-zero exit. Bare title prose does not extract.
9. Derived identifier tokens are detected corpus-wide, consume their full span, and do not also emit
   a canonical citation for the prefix.
10. Canonical identifiers on parser-identified declaration surfaces are not emitted as citations;
    the same token in ordinary prose remains a reference candidate.
11. A Markdown anchor citation into a `DECISIONS.md` entry heading is reported as invalid.
12. The two anchor algorithms diverge on a heading containing an apostrophe (§5.5).
13. The generator refuses to write to the frozen phase-1 path (§6 item 2), rejects output inside the
    detached measurement root, and resolves a relative `--out` against the generator checkout.
14. Derived identifiers and invalid `DECISIONS.md` entry anchors use the exact `ReferenceKind`,
    `class`, `targetState`, `target`, and count fields pinned in §7.

**Negative control — required.** Construct a corpus fixture in which the hardened generator, run in
the wrong mode, would return an empty definition index. It must fail loudly and name the condition.
Capture the output verbatim. A checker first run against already-correct input is not evidence that
it fires.

**Two-run determinism — required.** Run the generator twice against the same detached worktree at
`MIGRATION_BASELINE` and diff the two artifacts with `generatedAt` stripped. The diff must be empty.
Capture both the command and its output. Note that this check is only meaningful after §3 step 5,
because a dirty generator file changes `generatorGitSha` independently of the corpus.

---

## 10. Non-goals (binding)

Do not, under this commission:

1. Edit, move, reorder, retitle, renumber, compress, or delete anything in `DECISIONS.md`. This pass
   authorizes no change to it whatsoever.
2. Perform, begin, or stage any part of the migration. No archive file is created and no content
   moves.
3. Write to, regenerate, or modify `audit/decisions-cleanup-2026-07-24/reference-graph.json` or any
   of the four artifacts beside it.
4. Edit the taxonomy, the format spec, the format fixtures, the survey spec, the correction work
   order, the closure work order, or this file. Governance files are architect-seat. If one is wrong,
   report it.
5. Edit `CLAUDE.md`, `AGENTS.md`, `PROJECT-HISTORY.md`, `NCLEX-Question-Schema.md`, or anything under
   `Archive/`.
6. Change the ratified target grammar, or add any kind, status, force, execution state, field, or
   identifier rule.
7. Unify the two anchor algorithms (§5.5).
8. Wire anything into `.github/workflows/` or into the production gate. Format spec §9 non-goal 6
   holds until migration.
9. Modify `package.json` beyond the single line in §6 item 5.
10. Touch any bank, schema, renderer, or runtime file.
11. Open a second pull request or merge anything.

---

## 11. Verification before handoff

Report the result of each. A self-report that a step passed is not the step.

1. `npx tsc -b --pretty false` — exit code.
2. `npm run test:decisions-format` and `npx tsx scripts/tests/decisions-reference-graph.ts` — both
   exit codes and actual output; the second command must cover every case in §9.
3. The §9 negative control, verbatim.
4. The §9 two-run determinism diff, with the command shown.
5. The measurement run: the exact command, the detached-worktree path, and the resulting manifest's
   `inputGitSha`, `generatorGitSha`, `formatMode`, and full `counts` block.
6. `sha256` of `audit/decisions-cleanup-2026-07-24/reference-graph.json`, matching the value recorded
   at §4 preflight item 5.
7. `git diff --stat "$MIGRATION_BASELINE"..HEAD -- DECISIONS.md CLAUDE.md AGENTS.md
   PROJECT-HISTORY.md NCLEX-Question-Schema.md DECISIONS-TAXONOMY-2026-07-24.md
   DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md DECISIONS-FORMAT-FIXTURES-2026-07-28.md
   DECISIONS-CLEANUP-PHASE-1-SURVEY-CODEX-SPEC-2026-07-24.md
   DECISIONS-CLEANUP-PHASE-1-CLOSURE-CODEX-WORK-ORDER-2026-07-28.md
   audit/decisions-cleanup-2026-07-24/` — must be **empty**. A working-tree diff will not do; this
   pass lands more than one commit.
8. `git diff --name-only "$HARDENING_COMMISSION_HEAD"..HEAD` — must list **exactly** these paths and
   no others:
   - `scripts/decisions-reference-graph.ts`
   - `lib/decisions-format.ts`
   - `scripts/tests/decisions-reference-graph.ts`
   - `package.json`
   - `audit/decisions-reference-graph-hardening-2026-07-29/pre-migration-reference-graph.json`

   An allowlist is the check that actually enforces §10, because a denylist cannot forbid a file
   nobody thought to name.
9. `git diff --numstat "$HARDENING_COMMISSION_HEAD"..HEAD -- package.json` — must report exactly `1`
   added line and `0` removed.
10. The full current pull-request gate step list from `.github/workflows/promotion-gate.yml`,
    unmodified and complete, every command exiting 0, run in the live branch checkout. `npm ci` is
    part of that list. Run it, or report it as skipped — do not run a subset and describe it as a
    complete gate run.
11. `git status --porcelain` — empty after the final commit.

**Staging discipline.** Stage by explicit path, never `git add -A` and never a glob.

---

## 12. Handoff

Report to the architect seat:

- All five preflight results and both the `MIGRATION_BASELINE` and
  `HARDENING_COMMISSION_HEAD` values you read.
- Every §11 item, with actual output rather than a claim about it.
- The mode-selection rule you implemented in §5.1, stated precisely enough to be reviewed without
  reading the diff.
- Anything you found that contradicts the format spec, the taxonomy, or this work order — reported,
  not worked around.
- Anything you believe is wrong in this work order.

**Nothing in this document authorizes a change to `DECISIONS.md` or any part of the migration.**
Migration begins only after this pass lands cleanly, the architect seat has completed its independent
check, and the migration commission is written.
