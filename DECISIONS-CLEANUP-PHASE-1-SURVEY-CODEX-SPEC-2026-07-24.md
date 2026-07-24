# DECISIONS.md Cleanup — Phase 1 Classification Survey — Codex Commission Spec

**Date:** 2026-07-24
**Seat:** Codex. Producer seat.
**Authority:** Architect commission. Classification and architecture only.
**Status:** Open work order. Immutable during execution.
**Amended:** 2026-07-24 — Amendments 1 through 4, recorded in section 12. Pass 1 returned 2026-07-24
and these amendments reopen the commission for a second pass. Read the amended body; do not reconcile
against any wording recalled from the first pass.

---

## 1. Purpose

`DECISIONS.md` has accumulated evidence, method, measurements, and litigation chronology inside
entries that should state a rule and point at their support. This is phase 1 of a three-phase
cleanup: **classify and propose, do not change.** Phase 2 performs moves and compression against a
ratified map. Phase 3 is an independent check.

This commission makes **no semantic edit, no status change, no renumbering, no deletion, and no
move.** It writes only the new files named in section 4.

---

## 2. Classification contract

`DECISIONS-TAXONOMY-2026-07-24.md` at the repository root is the classification contract. Read it
first and classify against it exactly.

Do not restate its class definitions in your deliverables, do not extend them, and do not invent an
additional class. If an entry does not fit any class, classify it `UNCLEAR_REQUIRES_OWNER` and say
in one sentence what makes it unfittable. That row is a finding, not a failure.

The taxonomy is ratified separately from this commission, and its ratification is a **precondition**
of this one. Before classifying anything, confirm that `DECISIONS-TAXONOMY-2026-07-24.md` carries a
ratified status. If it reads `Proposed`, stop and report that — do not classify against an unratified
contract. Pass 1 did exactly that, the contract was then amended twice, and every classification it
produced had to be discarded.

**This precondition is now satisfied:** the taxonomy was ratified 2026-07-24 including Amendments 1
and 2. Read it at its current state on disk. Amendment 1 separates kind, status, and execution state;
Amendment 2 narrows `REVISIT` to unsettled threads. Both change how entries you already classified
must now classify. Do not reconcile against any wording recalled from pass 1.

---

## 3. Frozen input

Run from a clean branch. Capture `SURVEY_HEAD=$(git rev-parse HEAD)` before writing anything and
report it, the branch, upstream state, and starting changed paths. Every classification and every
citation in this commission resolves at `SURVEY_HEAD`.

**`SURVEY_HEAD` must contain the ratified governance text.** The taxonomy and this spec are both
root-level `*.md` files and are therefore *inside* the reference-graph corpus defined below. If
either is still uncommitted when the frozen worktree is cut, the graph measures their pre-amendment
text and silently reports on documents that no longer exist. The second pass begins from a tree that
carries both as uncommitted modifications, so this ordering is not optional:

1. Branch `survey/decisions-cleanup-phase-1`, carrying the current changes.
2. Preserve the pass-1 generator by copying it **outside the repository** — it is the basis for the
   rewrite, not scrap. Then remove it and the five stale pass-1 deliverables from the tree, and
   revert the uncommitted `package.json` line.
3. Commit the ratified taxonomy and this amended spec, and nothing else.
4. Confirm `git status --porcelain` is empty. Capture that commit as `SURVEY_HEAD`.
5. Rewrite the resolver, starting from the preserved pass-1 file. Re-add the `package.json` line and
   run the section 10 negative control.
6. Commit the rewritten generator and the `package.json` line. This is the generator that produces
   the graph and it must be committed **before** any graph is generated — see Amendment 3.
7. Run the committed generator from the live branch checkout, with `--root` pointed at a detached
   worktree at `SURVEY_HEAD`.
8. Regenerate the five deliverables and commit them separately.
9. Push the branch and open a draft pull request. Nothing goes to `main`.

This yields the dual provenance section 6 requires: `inputGitSha` is the clean governance commit,
`generatorGitSha` is the later generator commit.

Primary subject: `DECISIONS.md`.

Reference-graph sources: `DECISIONS.md`, `CLAUDE.md`, `AGENTS.md`, `PROJECT-HISTORY.md`,
`NCLEX-Question-Schema.md`, every tracked `*.md` at the repository root, and every tracked `*.md`
under `docs/` and `Archive/`.

Create a detached read-only worktree at `SURVEY_HEAD` outside the live repository directory, and run
both reference-graph passes against it. Remove it after the graph is generated twice and confirm the
live worktree is unchanged apart from the deliverables in section 4.

---

## 4. Deliverables

All under `audit/decisions-cleanup-2026-07-24/`:

1. `inventory.md` — every current entry, classified (section 5).
2. `reference-graph.json` — deterministic citation graph (section 6).
3. `outline-before-after.md` — current structure beside the proposed structure (section 7).
4. `migration-table.md` — per-entry destination and force (section 8).
5. `findings.md` — conflicts, duplications, and anything the taxonomy could not classify.

Plus `scripts/decisions-reference-graph.ts` and exactly one added `package.json` line:
`"survey:decisions-refs": "tsx scripts/decisions-reference-graph.ts"`. No `test:` counterpart, no CI
wiring.

---

## 5. Entry inventory

**Entry boundaries.** An entry is a numbered principle, a named amendment or application block
under a principle, a bullet in a standing-invariant list, a parked or revisit item, or a superseded
ruling. Where a heading covers several separable rules, split them and say so. Where you split, the
migration table must show every fragment, because a fragment is exactly what gets lost in a move.

Assign each entry a stable ID `E001`, `E002`, ... in document order at `SURVEY_HEAD`. These IDs are
survey-local scaffolding and are not the permanent identifiers of taxonomy section 7.

Per entry, record:

- `id`, current section, current heading, first line number at `SURVEY_HEAD`
- proposed **kind**, **status**, **force** (taxonomy sections 3, 4, 5)
- **byte length**, and an estimate of how much is reproduced evidence, method, measurement, or
  chronology rather than statement of the rule
- whether it names a **forcing incident**, and where that incident is preserved
- **evidence pointers** and **executable owners** it already carries
- whether any factual claim in it is **contradicted by the executable owner it names** — flag only,
  do not correct

Classify what is written, not what you believe was intended. Where the current wording supports two
readings, record both and route the row to the owner rather than choosing the tidier one.

---

## 6. Reference graph (`scripts/decisions-reference-graph.ts`)

This is the mechanical part of the commission and the null the phase-3 checker will use. It must be
deterministic and must not depend on classification judgment. The generator accepts `--root <path>`
and is run against the frozen worktree from section 3, never against the live tree.

**Targeting rules — what a reference points at. Apply these exactly; do not extend them.**

- `principle n`, in any casing, always targets principle `n` in `DECISIONS.md`, regardless of which
  file the reference appears in. Match singular and plural forms carrying one or more integers
  joined by `,`, `and`, `&`, or `/` — "principles 3, 5, 8, 18, 22" and "principle 8/18" — and emit
  one record per integer. A sub-part suffix targets its parent: `principle 27(d)` is principle 27.
  The literal word `principle` or `principles` is required; a bare number list is not a reference.
  This grammar is part of the rule, not an extension of it. Pass 1 inferred it unprompted and was
  right to: without it, `principle 8/18` yields only principle 8 and drops the lapsed half of the
  exact citation that motivates the `LAPSED` queue below.
- A bare `§n` targets section `n` of the file the reference appears in.
- `<repository path> §n` targets section `n` of the named file.
- A Markdown link targets a path resolved relative to its own source file.
- A bare repository path targets that path.
- Anything requiring semantic inference is emitted as `ambiguous`, never guessed.

**Resolution — whether the target exists. This applies to every targeting rule above, not only to
paths.**

`resolves: true` means *the thing pointed at was found at `SURVEY_HEAD`*. It never means "the
reference was successfully parsed." A record whose `resolves` value is a constant is not a
measurement, and a graph built that way cannot serve as the phase-3 null, because phase 3 re-derives
against it.

The generator therefore builds and uses four indexes over the frozen root:

1. principle numbers actually defined in `DECISIONS.md`, each tagged live or lapsed/superseded;
2. numbered sections actually present in each source file;
3. Markdown heading anchors actually present in each source file;
4. tracked paths (as pass 1 already did).

Resolution and liveness are **separate facts and must not be collapsed.** `resolves` records whether
the target exists. `targetState` records whether it is live. A citation to a lapsed principle does
resolve — its target is right there — and whether that citation is *correct* depends on the sentence
using it, which is not a question a generator can answer.

- **`resolves: true`, `targetState: LIVE`** — the target exists and is live.
- **`resolves: true`, `targetState: LAPSED`** — the target exists but is not live: a principle that
  is `SUPERSEDED`, or `CONDITIONAL` on a lane that has lapsed.
- **`resolves: false`, `targetState: MISSING`** — the target does not exist: an undefined principle
  number, an absent section number, an absent anchor, an untracked path.
- **`resolves: false`, `targetState: NOT_APPLICABLE`** — `ambiguous` and `link-external` records,
  which have no repository target to check. Keep these out of the unresolved defect list, as pass 1
  correctly did.

Report the `LAPSED` set as its own **review queue, not a defect list.** Most of this corpus is
`Archive/`, and an archived sentence recording that a lapsed principle governed a retired lane is a
correct historical citation. Marking those unresolved would make this graph useless in the opposite
direction from pass 1. A checker sorts the queue into:

1. valid historical citations — no action;
2. stale present-tense authority claims — a real defect;
3. citations whose target has a surviving universal core that this migration restores.

Category 3 is not hypothetical, and it is also the trap. At `SURVEY_HEAD`, `DECISIONS.md` is
unrewritten: principle 8 still sits physically inside the conditional group that lapsed 2026-07-18.
The graph must therefore emit **both** halves of the Gemini entry's "principle 8/18" as
`resolves: true, targetState: LAPSED`. The owner ruling in section 8 authorizes phase 2 to restore
principle 8's universal core; it does not retroactively edit the frozen input. Record principle 8 in
the review queue as category 3 — a lapsed target whose core is ratified for restoration — and
principle 18 as an open owner question. Only a post-phase-2 graph will mark 8 `LIVE`.

**Do not overlay any section 8 ruling onto this graph.** Section 8 decides what should be; the
generator measures what is. The same question is open for 9, 12, and 22, and this queue is how it
gets surfaced rather than guessed — which is the argument for building the lane at all: it finds the
entries whose authority quietly lapsed underneath them.

Pass 1 hardcoded `resolves: true` for every `principle n` and every bare `§n`, and checked only file
existence for `<path> §n` and for anchors — 1,514 of 5,380 resolved records, 28%, were assertions
rather than measurements. That was a faithful reading of this section as originally written; the
section, not the implementation, was the defect.

A bare `§7` inside an archived spec is that spec's section 7. It is not `DECISIONS.md` section 7,
and a resolver that assumes otherwise manufactures a citation graph rather than measuring one.

Extract from every source in section 3 every reference of the forms above. For each, record source
file, line, raw matched text, and resolved target where a target resolves.

Emit `{ from, fromLine, rawText, kind, target, resolves, targetState }` records plus, at top level:
`generatedAt`, `inputGitSha`, `generatorGitSha`, `generatorSha256`, and `inputs[] { path, sha256 }`.
`inputGitSha` is the frozen root's SHA and will differ from `generatorGitSha` by design, exactly as
in the P5 survey. `generatedAt` is the only field permitted to vary between two runs against the
same frozen root; demonstrate that with the exact diff command you used.

Report unresolved and ambiguous references separately. An unresolved reference at `SURVEY_HEAD` is a
pre-existing defect, not something this commission introduced, and must be labelled as such.

---

## 7. Before/after outline

Two outlines side by side: the current section structure, and the structure in taxonomy section 8
populated with the entries you propose for each section. Counts per section. No prose argument for
the structure — it is already ratified; this is placement only.

---

## 8. Migration table

One row per entry ID. Columns:

| id | heading | kind | status | force before | force after | destination | permanent ID proposed | evidence pointer | notes |

**Destination** is exactly one of: `STAY` or `ARCHIVE`. There is no third option.

`STAY` means the body remains live and may be compressed in phase 2. `ARCHIVE` means the displaced
body is preserved verbatim in the archive. An evidence document is a **pointer**, never a
destination: phase 2 may replace reproduced evidence inside a live entry with a link to it, but the
displaced governance wording still goes to the archive. Nothing is discharged by asserting that
another document already covers it.

`PROJECT-HISTORY.md` is not an available destination. Do not propose it for any row.

**Force before and force after must be stated for every row, including `STAY` rows.** Any row where
they differ is escalated in `findings.md` under its own heading, with the sentence or clause whose
binding force changes quoted exactly. These are owner ratifications and phase 2 must not execute
them without one.

**`force before` means the force the entry's own text carries, not the force a reader would infer
from where it currently sits.** A live binding rule mis-filed under a `SUPERSEDED` heading has force
before `BINDING`; it does not have force before `HISTORICAL` because of the heading above it. Where
placement and wording disagree, the wording governs and the disagreement is reported as a mis-file in
`findings.md`, not as a force change.

This distinction is load-bearing in both directions. Recording a force change that is really a
placement repair manufactures an owner ratification for a decision already taken — pass 1 did this
twice, for the CBC unit-display amendment and for the stage-3 vital-sanity ratifications, both of
which self-declare as governing in their own text. Cleanup repairs placement; it never re-mints a
ratification, and it must never appear to.

Where you propose a permanent principle number or `R` identifier, propose it, applying the bootstrap
rule in taxonomy section 7. Never propose reusing a retired number and never propose renumbering an
existing one.

**Owner rulings binding on this pass.** Settled by Luke 2026-07-24. Do not re-derive them and do not
propose alternatives:

1. **Principle 8 is de-conditionalized and retained under number 8.** Its universal core — clinical
   truth and answer logic have an explicit upstream owner, and downstream translation, compilation,
   formatting, and review may read them but never silently invent or alter them — survives the lapse
   of the forward case-generation lane. Its lane-specific detail (Opus skeleton shape, compiler
   topology, optional synthesis zones) archives. This is the first application of the taxonomy's
   section 4 `CONDITIONAL` carve-out.
2. **No `P31` is minted.** E037's first rule is principle 8's core and returns to it. E037's second
   rule — every active lane declares producer provenance and independent-review routing — is an
   application of principles 2 and 5 and attaches there. Neither mints a number.

**Architect ruling, same date.** The permanent `R` series begins at `R1`. The `R1..R17` in
`Archive/root-specs-2026-07-18/structured-measurements-schema-2-0-codex-spec.md` are document-local
and reserve nothing globally; this was verified against that file, not inferred. Propose `R` numbers
per the taxonomy section 7 bootstrap and drop the *(R-origin pending)* marks. The archived shorthand
"Amendment 3A/R17" should eventually be expanded to that exact document pointer, but not by this
commission.

**Principles 9, 12, 18, and 22 are not ruled on.** Each may or may not have a surviving universal
core. Classify them as written and route the question to the owner. Do not extend ruling 1 to them by
analogy — that the carve-out exists is not evidence that it applies.

---

## 9. Non-goals (binding)

Do not, under this commission:

1. Edit, move, reorder, retitle, renumber, compress, or delete anything in `DECISIONS.md`.
2. Edit `CLAUDE.md`, `AGENTS.md`, `PROJECT-HISTORY.md`, `NCLEX-Question-Schema.md`, or any file
   under `Archive/`.
3. Change any entry's status tag, or correct any factual claim you find stale — flag it instead.
4. Create the archive destination file or move any content toward it.
5. Modify `package.json` beyond the single line in section 4.
6. Touch `.github/workflows/`, any bank, schema, renderer, or runtime file.
7. Write the phase-2 spec, or propose the compressed wording of any entry. Phase 1 says where things
   go and what force they carry, never how they will read afterwards.

---

## 10. Verification before handoff

Report the result of each:

1. `npx tsc -b --pretty false` — exit code.
2. `npm run survey:decisions-refs -- --root <frozen worktree path>` twice; show the two-run diff
   command and its empty output.
3. `git diff --stat "$SURVEY_HEAD"..HEAD -- DECISIONS.md CLAUDE.md AGENTS.md PROJECT-HISTORY.md
   NCLEX-Question-Schema.md` — must be empty. A working-tree diff will not do: this pass lands three
   commits, and a clean working tree proves only that the last one was clean.
4. `git diff --numstat "$SURVEY_HEAD"..HEAD -- package.json` — must report exactly
   `1\t0\tpackage.json`.
5. The full current pull-request gate step list, unmodified and complete — every command exits 0.
   Run it in the live branch checkout, never in the detached measurement worktree, which is
   read-only and carries no installed dependencies. `npm ci` is part of that list. Pass 1 skipped it
   because dependencies were already installed and then reported that nothing was left unexecuted;
   those two statements cannot both stand. Run it, or report it as skipped and do not claim a
   complete gate run.
6. **Resolver negative control.** Demonstrate that the amended resolver returns `MISSING` for a
   dangling principle number, a dangling section number, and a dangling heading anchor, and `LAPSED`
   for a reference to a lapsed principle. The `LAPSED` record must carry `resolves: true` — that
   pairing is the correction Amendment 2 makes and the one most likely to be implemented backwards.
   Build this on a throwaway fixture outside the corpus — section 9 forbids editing `DECISIONS.md`,
   and a clean corpus is not evidence that a tripwire fires. Report the fixture, the records it
   produced, and its deletion.
7. `git diff --name-only "$SURVEY_HEAD"..HEAD` — must list exactly seven paths and no others: the
   five section 4 deliverables, `scripts/decisions-reference-graph.ts`, and `package.json`. This is
   the check that actually enforces section 9, because an allowlist cannot be satisfied by a file a
   denylist forgot to name. Then `git status --porcelain` — must be empty after the final commit.

---

## 11. Handoff

Owner reads `migration-table.md` and `findings.md` and ratifies the map, including every force
change individually. Only then does a separate phase-2 commission perform moves and compression.
Phase 3 re-derives classification independently from `DECISIONS.md` at `SURVEY_HEAD` — not from the
migration table — because a faithful compression of a wrong map passes a conformance check.

Nothing in this document authorizes a change to `DECISIONS.md`.

---

## 12. Amendment record

**Amendment 1 — 2026-07-24, architect seat. Three corrections, all to this spec's own defects.**

Pass 1 executed this commission as written, verified cleanly against section 10, and returned. The
review that followed found the inventory sound and three of the instructions it followed unsound.

1. **Section 6 defined targeting and called it resolution.** It specified what each reference form
   points at, made existence-checking conditional in one rule out of six, and then described
   unresolved references as pre-existing defects — which only means something if `resolves: false`
   marks a dangling citation. Amendment 1 separates targeting from resolution, requires the four
   indexes, and adds `targetState` with a `LAPSED` value.
2. **Section 8 never said what `force before` measures.** Pass 1 read it as force-as-placed, which
   is defensible and which converted two placement repairs into force-change escalations. Amendment 1
   defines it as force-as-written.
3. **Section 2 treated taxonomy ratification as someone else's business.** It was a precondition and
   this spec did not say so, so 76 entries were classified against a contract still marked
   `Proposed` — a contract that has since been amended in a way that changes how three of those
   entries classify. Amendment 1 makes ratification a gate.

What survives pass 1 unchanged and must not be re-derived from scratch: the 76-entry inventory with
its boundaries, byte lengths, and evidence-fraction estimates; the E043/E047 splits; the E049
mis-file; the duplication findings; and the location of the historical `R1..R17` series inside
`Archive/root-specs-2026-07-18/structured-measurements-schema-2-0-codex-spec.md`, which establishes
that those identifiers are document-local and that the permanent `R` series may begin at `R1`.

What does not survive: every kind, status, and force assignment, because the contract they were
rendered against has changed.

**Amendment 2 — 2026-07-24, architect seat. Liveness separated from resolution; owner rulings
recorded.**

Amendment 1 made a lapsed target `resolves: false`. That was the same conflation it had just
corrected elsewhere: existence and liveness are two facts, and collapsing them would have marked
every correct archival citation — an archived spec recording that principle 18 governed its retired
lane — as a broken reference, across a corpus that is mostly `Archive/`. Amendment 2 sets `resolves`
to mean existence alone, moves liveness entirely into `targetState`, adds `NOT_APPLICABLE`, and makes
the `LAPSED` set a review queue rather than a defect list.

Amendment 2 also records in section 8 the owner rulings that followed taxonomy ratification
(principle 8 retained, no `P31`) and the architect ruling on the `R`-series origin, so that this pass
does not re-litigate them.

**Amendment 3 — 2026-07-24, architect seat. Commit ordering and principle-list grammar.**

Two defects in the reopened commission, both caught before the implementer ran.

1. **The commit order was incoherent.** The handoff said to commit the pass-1 generator first, in
   order to retire the `uncommitted-implementation-tree` sentinel, and then rewrite the resolver.
   Rewriting after committing makes the file dirty again and the sentinel returns; it would also
   have given a permanent commit to an implementation whose only purpose was to be replaced. The
   generator is now rewritten first and committed second, before any graph is generated. Section 3
   carries the full ordering, including the step that was missing entirely: the ratified taxonomy
   and this spec must be committed *before* `SURVEY_HEAD` is captured, because both are root-level
   `*.md` files inside the graph corpus and would otherwise be frozen in their pre-amendment state.
2. **Section 6 could not catch its own motivating example.** The targeting rule said `principle n`
   while the defect it exists to surface is `principle 8/18`. A literal compliant implementation
   would emit principle 8 and drop 18 — the lapsed half. Pass 1 widened this grammar on its own
   initiative and documented the choice; Amendment 3 promotes that judgment into the contract so the
   second pass need not re-make it, and bounds it so it does not widen further.

Neither correction changes a classification, a force definition, or a resolution semantic.

**Amendment 4 — 2026-07-24, architect seat. Frozen-input purity and commit-range verification.**

Amendment 3 restructured the pass into three commits and did not reconcile section 10 with it. Items
3, 4 and 7 had been written for a single-commit world and had all quietly become vacuous: an empty
working-tree diff proves nothing once the work is committed, and `package.json` reads clean rather
than `1 0` once the generator commit lands. All three are now commit-range checks against
`$SURVEY_HEAD..HEAD`, plus a positive allowlist of the seven paths this pass may touch.

Section 6 separately invited the implementer to overlay the section 8 ruling on principle 8 onto the
frozen-input graph and mark it `LIVE`. At `SURVEY_HEAD`, principle 8 is still lapsed on disk. The
ruling authorizes a phase-2 restoration; it does not edit the past. Both halves of "principle 8/18"
are mechanically `LAPSED`, and the difference between them belongs to the review queue rather than
to the generator.

Both defects are the same one this cleanup keeps turning up: two things that must stay orthogonal
got collapsed. Kind and work state. Placement and status. Existence and liveness. Now ruling and
measurement. The generator measures what is, section 8 decides what should be, and neither may be
written in terms of the other.
