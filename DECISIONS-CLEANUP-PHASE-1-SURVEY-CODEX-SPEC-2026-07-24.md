# DECISIONS.md Cleanup — Phase 1 Classification Survey — Codex Commission Spec

**Date:** 2026-07-24
**Seat:** Codex. Producer seat.
**Authority:** Architect commission. Classification and architecture only.
**Status:** Open work order. Immutable during execution.
**Amended:** 2026-07-24 — Amendments 1 through 5, recorded in section 12. Pass 1 returned 2026-07-24.
Pass 2 returned 2026-07-24 and was refused at architect review. Amendment 5 reopens the commission
for a **correction pass**, sequenced by `DECISIONS-CLEANUP-PHASE-1-CORRECTION-WORK-ORDER-2026-07-24.md`
at the repository root. Read the amended body; do not reconcile against any wording recalled from
either earlier pass.

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

### 3a. Correction-pass baseline: `CORRECTION_HEAD` (Amendment 5)

The nine-step ordering above was written for pass 2 and is spent. Amendment 5 changed this spec, and
this spec is a root-level `*.md` file and therefore **inside** the corpus below. A third pass
measured at pass 2's `SURVEY_HEAD` (`f68210c`) would measure a spec that no longer exists — the
exact defect Amendment 3 corrected once already.

**The correction pass therefore has its own baseline, under its own name.** `SURVEY_HEAD` is not
recaptured, redefined, or reused. It remains bound to `f68210c` permanently, because the committed
pass-2 artifacts cite it and a token that silently changes referent between passes is a provenance
trap of exactly the kind this document keeps finding.

1. Branch `survey/decisions-cleanup-phase-1`, carrying the pass-2 commits.
2. Commit the Amendment-5 spec and
   `DECISIONS-CLEANUP-PHASE-1-CORRECTION-WORK-ORDER-2026-07-24.md`, **and nothing else**. Confirm
   `git status --porcelain` is empty. Capture that commit as
   `CORRECTION_HEAD=$(git rev-parse HEAD)` and report it.
3. Correct the generator. Run the section 10 verification, including items 6, 8, and 9, before
   generating any graph. Commit the corrected generator.
4. Create a detached read-only worktree at `CORRECTION_HEAD` outside the live repository directory.
   Run the committed generator from the live branch checkout with `--root` pointed at that
   worktree. Generate twice, show the two-run diff, remove the worktree, and confirm the live
   worktree is unchanged apart from the section 4 deliverables.
5. Regenerate `reference-graph.json` first, then recompute every count, queue, and delta in the
   other four deliverables from the regenerated artifact. Commit the five deliverables.

**Token mapping, exhaustive.** For the correction pass:

- **Sections 5, 6, 7, and 11** — `SURVEY_HEAD` reads `CORRECTION_HEAD`. These are the places the
  token denotes the frozen measurement root: entry line numbers, the resolution baseline, and the
  phase-3 re-derivation input.
- **Section 10** — items 3, 4, and 7 are already written as `CORRECTION_HEAD`. No mapping needed.
- **The nine-step ordering earlier in this section, and its `SURVEY_HEAD` captures** — **superseded
  by section 3a for this pass.** It is retained as the record of how pass 2 was cut, not as an
  instruction. Do not execute it, and do not apply the mapping to it.
- **Section 12** — historical. Those occurrences record what passes 1 and 2 did and continue to
  refer to `f68210c`.

`inputGitSha` in the regenerated graph is `CORRECTION_HEAD`; `generatorGitSha` remains the later
generator commit.

**`DECISIONS.md` is byte-identical at `35b968e`, `f68210c`, and `CORRECTION_HEAD`** — it was last
modified at `35b968e`, which precedes all of them. Every entry boundary, line number, and byte
length established in pass 2 therefore survives the rebaseline exactly. Confirm this with
`git diff --stat 35b968e..HEAD -- DECISIONS.md` and report the empty result rather than taking it on
trust.

**The two governance files added at `CORRECTION_HEAD` are inside the corpus by design, not by
accident.** Both are tracked root-level `*.md`, both are therefore reference-graph sources, and
their citations are measured like any others — the same treatment pass 2 correctly gave this spec's
own text. Their expected contribution is stated in section 6 so that a count delta against pass 2 is
attributed in advance rather than discovered and mistaken for a regression.

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

**Amendment 5 — these fields are re-derived, not carried forward.** Amendment 1 recorded the pass-1
byte lengths, evidence-fraction estimates, forcing incidents, evidence pointers, executable owners,
and contradiction flags as surviving material that must not be re-derived from scratch. Section 3
step 2 then ordered the only artifact holding them deleted. That prohibition is withdrawn: re-derive
every field in the list above, in full, for every entry, into `inventory.md` itself. "Preserved from
an earlier pass" is not an acceptable value for any field here, because the earlier pass's
deliverables exist in no tree and no commit. `DECISIONS.md` is byte-identical at `35b968e`,
`f68210c`, and this pass's `CORRECTION_HEAD`, so every boundary, line number, and byte length is
re-derivable exactly, and the pass-2 classification table anchors the work.

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

**Expected contribution of the two governance files added at `CORRECTION_HEAD` (Amendment 5).**
These figures were measured under the corrected principle grammar *before* section 3a was written,
so the spec's own row will have risen. Re-measure at `CORRECTION_HEAD` and report the actual
figures; these exist to be reconciled against, never adopted.

| source | principle records | distinct principles targeted | bare `§n` |
|---|---|---|---|
| `DECISIONS-CLEANUP-PHASE-1-SURVEY-CODEX-SPEC-2026-07-24.md` | ≥ 45 | 2, 3, 5, 8, 9, 12, 18, 20, 22, 27 | ≥ 1 |
| `DECISIONS-CLEANUP-PHASE-1-CORRECTION-WORK-ORDER-2026-07-24.md` | 22 | 2, 5, 6, 8, 9, 12, 18, 22, 25 | 1 |

Of these, at least 36 and 18 respectively target principles 8, 9, 12, 18, and 22 — all `LAPSED` at
`CORRECTION_HEAD`. The `LAPSED` review queue will therefore grow by **at least 54 records that are
governance text about the lapse**, not citations whose authority lapsed underneath them. They are
structurally category 1: self-aware, correct, requiring no action. **Segregate them in the queue.** A
review queue whose majority is this commission discussing itself has stopped surfacing the thing it
was built to surface, and the growth is an artifact of measuring the instrument alongside the
object — not a finding.

---

## 7. Before/after outline

Two outlines side by side: the current section structure, and the structure in taxonomy section 8
populated with the entries you propose for each section. Counts per section. No prose argument for
the structure — it is already ratified; this is placement only.

---

## 8. Migration table

One row per entry ID. Columns:

| id | heading | kind | status | force before | force after | destination | permanent ID proposed | evidence pointer | notes |

**Destination** is exactly one of: `STAY`, `ARCHIVE`, or `MERGE_INTO <target ids>`. There is no
fourth option, and `MERGE_INTO` is bounded by the four conditions below.

`STAY` means the body remains live **as its own entry** and may be compressed in phase 2. `ARCHIVE`
means the displaced body is preserved verbatim in the archive. An evidence document is a
**pointer**, never a destination: phase 2 may replace reproduced evidence inside a live entry with a
link to it, but the displaced governance wording still goes to the archive. Nothing is discharged by
asserting that another document already covers it.

`MERGE_INTO <target ids>` means the entry's content stays live but the entry loses independent
standing: its rules are absorbed into the named target entries and it has no post-compression body
of its own. It is not a softer `ARCHIVE` — nothing is displaced — and it is not `STAY` with
explanatory notes, because a phase-2 seat executing `STAY` preserves a standing entry and would mint
the identifier the merge exists to refuse. Four conditions, all required:

1. An **owner ruling on the record** removes the entry's independent standing. `MERGE_INTO` is never
   a classifier's tidying judgment and is never proposed on the classifier's own initiative.
2. Every target id is named explicitly and appears as its own row in this table with destination
   `STAY`. A merge into an `ARCHIVE` row, or into a row that does not exist, is a defect.
3. No permanent ID is proposed. The `permanent ID proposed` cell reads `*(none — merged)*` and names
   the ruling that refuses the number.
4. Force before and force after are still stated, and **every rule the entry carries is accounted for
   in exactly one target.** A rule that lands in no target has been deleted, not merged, and that is
   the failure this destination is most likely to hide.

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
2. **No `P31` is minted for `E037`.** E037's first rule is principle 8's core and returns to it.
   E037's second rule — every active lane declares producer provenance and independent-review
   routing — is an application of principles 2 and 5 and attaches there. Neither mints a number.
   **Narrowed 2026-07-28 (Amendment 6):** this ruling is about `E037` alone and was never a bar on
   the number itself. `P31` is allocated to `E074` under taxonomy section 7's allocation rule
   (taxonomy Amendment 3, 2026-07-28).

**Architect ruling, same date.** The permanent `R` series begins at `R1`. The `R1..R17` in
`Archive/root-specs-2026-07-18/structured-measurements-schema-2-0-codex-spec.md` are document-local
and reserve nothing globally; this was verified against that file, not inferred. Propose `R` numbers
per the taxonomy section 7 bootstrap and drop the *(R-origin pending)* marks. The archived shorthand
"Amendment 3A/R17" should eventually be expanded to that exact document pointer, but not by this
commission.

**Principles 9, 12, 18, and 22 retire — ruled 2026-07-28 (Amendment 6).** None retains a surviving
universal core under its old number. The four numbers remain permanently unavailable under taxonomy
section 7. `E043a` is unaffected and stays live: principle 22's `opus*` routing invariant is
preserved independently of the prose that archives with it.

Ruling 1's carve-out is still not extended by analogy — these four are ruled on their own text, not
because principle 8's outcome suggests anything about them. This question was genuinely open through
the correction pass, and every artifact produced before 2026-07-28 correctly records it as unruled.
That is provenance, not staleness: it is not to be rewritten as though the survey decided it.

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
3. `git diff --stat "$CORRECTION_HEAD"..HEAD -- DECISIONS.md CLAUDE.md AGENTS.md PROJECT-HISTORY.md
   NCLEX-Question-Schema.md` — must be empty. A working-tree diff will not do: this pass lands three
   commits, and a clean working tree proves only that the last one was clean.
4. `git diff --numstat "$CORRECTION_HEAD"..HEAD -- package.json` — must report **no change**. The
   `survey:decisions-refs` line landed in pass 2 and sits below `CORRECTION_HEAD`; this pass adds no
   `package.json` line. A `1\t0\tpackage.json` result here means the line was added a second time.
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
7. `git diff --name-only "$CORRECTION_HEAD"..HEAD` — must list exactly six paths and no others: the
   five section 4 deliverables and `scripts/decisions-reference-graph.ts`. `package.json` is **not**
   in this range — its single line landed in pass 2, below `CORRECTION_HEAD`. The Amendment-5 spec
   and the correction work order are also below `CORRECTION_HEAD` by the section 3a ordering and
   must not appear. This is the check that actually enforces section 9, because an allowlist cannot
   be satisfied by a file a denylist forgot to name. Then `git status --porcelain` — must be empty
   after the final commit.
8. **Extended negative control (Amendment 5).** Beyond item 6, the throwaway fixture must demonstrate
   correct handling of each of: an Oxford-comma principle list (`principles 8, 9, 12, 18, and 22` —
   all five integers emitted); a `.tsx` path; a tracked `.css` path; a same-stem `.ts`/`.tsx` pair,
   proving the `.tsx` reference resolves to the `.tsx` file and not the `.ts` one; an unqualified
   basename whose file exists under a directory; a glob (`banks/*-canonical.json`); a relative path;
   and a `<path> §n` reference. Report the fixture, the records it produced, and its deletion.
9. **`MISSING`-class reconciliation (Amendment 5).** Every `MISSING` record is assigned **by the
   generator, deterministically, not by hand** to exactly one class: `absent-tracked-path`,
   `unqualified-basename`, `glob-or-pattern`, `external-law-section`, `decimal-subsection`,
   `line-wrap-grammar`, or `other`. Emit the class on the record and per-class totals under `counts`,
   and report those totals. `other` is a finding, not a remainder: name every record in it. This
   exists because a `MISSING` total that falls from 3,023 to some smaller uninterpreted number is not
   evidence of a corrected resolver.

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

**Amendment 5 — 2026-07-24, architect seat. Pass 2 refused at review: a destroyed input, a missing
destination state, and an unmeasured resolver.**

Pass 2 executed the amended commission, verified cleanly against section 10, and returned. Architect
review refused it on six defects. Three are this spec's own, and the correction pass must not be
sent out carrying them as producer findings.

1. **Section 5 required fields whose only source this spec destroyed.** Amendment 1 listed the
   pass-1 byte lengths, evidence-fraction estimates, forcing incidents, evidence pointers,
   executable owners, and contradiction flags as material that survives and "must not be re-derived
   from scratch." Section 3 step 2 then ordered the five pass-1 deliverables removed from the tree
   before `SURVEY_HEAD` was cut, preserving only the generator outside the repository. The two
   instructions cannot both be satisfied. Pass 2 complied with each as far as either could be
   complied with, carried the classification fields, and recorded the rest as preserved-but-not-
   reproduced — pointing at an artifact that exists in no tree and no commit. The loss is real and
   the cause is here. Section 5 now requires full re-derivation and withdraws the prohibition.
2. **Section 8's destination enum had no state for the outcome its own owner ruling requires.**
   Ruling 2 dissolves E037: its first rule returns to principle 8's core, its second attaches to
   principles 2 and 5, and no `P31` is minted. `STAY` cannot express that — a phase-2 seat executing
   `STAY` preserves E037 as a standing entry and mints exactly the number the ruling refuses — and
   `ARCHIVE` cannot either, because the content stays live. Pass 2 introduced `MERGE`, stated in the
   open that it was not one of the two permitted values, and gave the correct reason. The diagnosis
   was right; the unilateral enum extension was not. The defect is that section 8 left no third
   state and no escape hatch on the destination axis while section 2 provides exactly such an
   escape, `UNCLEAR_REQUIRES_OWNER`, on the classification axis. Section 8 now defines
   `MERGE_INTO <target ids>` and bounds it with four conditions.
3. **Section 6 was read as authorizing an extension taxonomy, and nothing measured the result.** The
   bare-path rule says a bare repository path targets that path, resolved against the tracked-path
   index. The pass-2 generator instead recognized path-like tokens by a closed extension list
   (`md|ts|tsx|json|ya?ml`), which is not in this spec and which fails in two directions at once.
   Regex alternation is leftmost-first, so `ts` matches before `tsx` is tried and every `.tsx` path
   in the corpus truncates: `src/App.tsx` became `src/App.ts`, a file that does not exist, 82 times.
   Tokens outside the list — `src/styles.css`, live in the in-scope root `AGENTS.md` — were not
   extracted at all. Unqualified basenames and glob fragments were extracted as though they were
   repository paths. The result: 3,023 of 8,326 records `MISSING`, of which roughly 2,492 of the
   2,841 missing path records are extraction artifacts, every one of them labelled a pre-existing
   defect under this section's closing instruction. Section 10 now requires an extended negative
   control and a deterministic per-class reconciliation of the entire `MISSING` population, because
   this spec asked for a null and accepted an unaudited aggregate as evidence that it had one.

Separately and not a spec defect: the principle-list grammar Amendment 3 promoted into the contract
was implemented as `,`-or-`and`, not `,`-then-`and`, so every Oxford-comma list drops its final
integer — ten occurrences in scope, five of them dropping principle 22, which understates the
`LAPSED` review queue. Two classifications also breach the ratified taxonomy: `E047c` carries
`X | REVISIT` where section 4 makes `REVISIT` compatible with `T` alone, and `E029` is an unnumbered
`R`, which taxonomy section 7 permits only when the row is routed to `UNCLEAR_REQUIRES_OWNER`.

What survives pass 2: the 78-entry boundary set including the E039a/E039b split, the frozen-input
ordering and dual provenance, the mis-file corrections on E047a and E049, the retention of principle
20, and the substantive reading of the principle-8 carve-out. The classification table is the anchor
for the correction pass, not scrap.

4. **Amendment 5 changed this spec, and this spec is inside the corpus it defines.** The correction
   pass cannot measure at pass 2's `SURVEY_HEAD`. Section 3a defines `CORRECTION_HEAD` as its own
   baseline under its own name, leaving `SURVEY_HEAD` permanently bound to `f68210c` because the
   committed pass-2 artifacts cite it and a token that changes referent between passes is a
   provenance trap. Section 10 items 3, 4, and 7 now range over `$CORRECTION_HEAD..HEAD`, and item
   7's allowlist drops from seven paths to six — the `package.json` line landed in pass 2 and sits
   below the new baseline. Section 6 states the two new governance files' expected contribution to
   the graph in advance, including the roughly 54 additional `LAPSED` records they introduce by
   discussing the lapse, so that growth is attributed rather than mistaken for a regression. This is
   the third time the ordering has needed correcting for one reason: the governance text is both the
   instrument and the measured object. Section 3a states the token mapping exhaustively so a fourth
   pass does not rediscover it.

The pattern holds for a fifth time. Preservation and deletion. Ruling and enum. Extraction and
resolution. Each pass has found a place where this spec asked one seat to hold two incompatible
things, and each time the producer complied with both as far as it could and the seam showed up in
the artifact rather than in the instruction.

**Amendment 6 — 2026-07-28, owner ratification. The inventory is 80 rows, not 78; four rulings; the
reconciliation constants are pinned.**

PR #88 merged. Post-merge review found that the deliverables' population is misstated at their own
foundation. `inventory.md`'s classification table and `migration-table.md` each contain **80 rows**
— E001–E035 (35), E036–E038 (3), E039a/E039b (2), E040–E042 (3), E043b/E043a (2), E044–E046 (3),
E047a/E047b/E047c (3), E048–E053 (6), E054–E076 (23) — under a hand-entered total of 78. The
derivation `inventory.md` states for that total, "76 pass-1 entries + the E039a/E039b split," cannot
be reconciled with a table carrying four net split rows. The figure is inherited: it precedes the
correction pass and was carried forward unchecked by every pass that touched it.

Three enumerations lost rows while their hand-entered totals stayed internally plausible:
`outline-before-after.md` §4 omits `E003` and `E074` while claiming 36 (its list sums to 35); §6
omits `E063` while claiming 19 (its list sums to 18); §8 omits `E047c` while claiming 14.
`migration-table.md`'s summary further reports the pre-repair split `35 §4 + 6 §5`, contradicting the
`E029` repair announced three lines below it in the same file.

This is the survey's own recurring failure shape arriving in the accounting layer: a count-based
check passes while the enumeration a phase-2 executor would actually build from is short. `E063` — a
live standing invariant — would have been silently dropped from the migrated document.

**Owner rulings, 2026-07-28.** These are ratifications, not survey findings, and are not to be
presented as anything the survey discovered or was previously certified to support.

1. **Principles 9, 12, 18, and 22 retire. None retains a surviving universal core under its old
   number.** P9's CJK-presence mechanism does not generalize beyond the retired lane and bilingual
   parity already has an independent standing invariant with an executable owner; P12's frozen,
   tool-less author arrangement is specific to that authoring topology; P18's fact-check →
   compilation → flag-only → Claude chain is the retired pipeline, and the universal review
   obligations survive under P2 and P5; P22's prose is pipeline-specific, and `E043a` independently
   preserves the still-operative `opus*` routing invariant, which stays live. The four numbers
   remain permanently unavailable (taxonomy §7).
2. **`E074` takes `P31`,** under taxonomy Amendment 3's allocation rule (2026-07-28). The earlier
   "no `P31`" ruling is narrowed to its actual subject: `E037` mints no number because it dissolves
   into `P8`, `P2`, and `P5`. It was never a bar on the number itself. `E074`'s wording is to be
   compressed in phase 2b so the surviving named-model restriction is grounded in its evidence and
   in P3/P5 rather than in the retired forward-case-lane topology it presently invokes.
3. **`E047c` is reclassified `X | ACTIVE | HISTORICAL | ARCHIVE` → `R | ACTIVE | BINDING | STAY |
   EXECUTED`, permanent ID `R3`.** Its own span carries the closed, owner-ratified, implemented
   `46.5°C` ceiling; that is a concrete ruling on the same footing as `E047a`'s treatment of the
   sibling vital-sanity values. `inventory.md` §4.1 declined this reading only because adopting it
   would renumber the R-series without owner authority. That authority is supplied here.
   **This is the cleanup's first genuine force change** (`HISTORICAL` → `BINDING`). It is
   owner-originated and post-survey. Every merged statement certifying that zero force changes
   survive — in `findings.md`, `migration-table.md`, and the PR #88 description — is now false as
   written and must be corrected to record this change and its provenance.
   The resulting permanent series: **R1** `E070` · **R2** `E049` · **R3** `E047c` · **R4** `E072` ·
   **R5** `E047a` · **R6** `E073`.
4. **`E029` remains a `P25` application.** The §4.2 reasoning stands: it directs implementation to
   catch up to an already-ratified model and settles nothing new. `P25 | ACTIVE | BINDING |
   EXECUTION: PENDING`, no `R` number.
5. **`E038` stays one live `I | ACTIVE | ADVISORY | STAY` entry**, rewritten to the durable rule:
   *"Current producer assignments are operational state and must be verified against
   `PROJECT-HISTORY.md`; changing the named producer does not alter permanent IDs, provenance
   classification, or independent-review obligations."* The displaced dated assignment prose is
   preserved verbatim in the archive and pointed at from `E038`'s evidence pointer. **This creates
   no archive-index row.** It is compression inside a surviving entry — not an additional `X`
   disposition, not a deletion.

**Pinned reconciliation constants.** These are owner-ratified expectations, fixed here before any
checker is written or run. A checker that derives its own expected values and compares them only
against itself certifies internal consistency, not correctness — which is precisely how `78`
survived three passes. The derived populations must equal these:

| quantity | pinned value |
|---|---|
| inventory rows | **80** |
| independent destination rows | **79** |
| `STAY` | **65** |
| `ARCHIVE` | **14** |
| `MERGE_INTO` | **1** |
| §4 `P` | **37** entry rows / **25** live permanent principle numbers |
| §5 `R` | **6** |
| §6 `I` | **19** |
| §7 `T` | **3** |
| §8 `X` | **14** |

Totals are insufficient on their own; exact ID sets must agree across `inventory.md`,
`migration-table.md`, and `outline-before-after.md`. The following identities are pinned explicitly,
because each is a row that a total-only check has already failed to protect:

- `E003` and `E074` appear in §4. `E074`'s permanent ID is `P31`.
- `E063` appears in §6.
- `E047c` appears in §5 as `R3` and **nowhere** in §8.
- `E043a` remains live in §6 and may **never** share `E043b`'s archive destination.
- `E037` is the sole `MERGE_INTO` row and has no independent destination.

**Supersession.** Where section 8's pre-existing text states that principles 9, 12, 18, and 22 are
not ruled on, or states "no `P31` is minted" without qualification, Amendment 6 governs. Section 8's
rulings on principle 8's retention, on `E037`'s dissolution, and on the `R`-series origin at `R1` are
unchanged.

The sixth instance of the same pattern, one layer up: every prior amendment separated two things a
single field had collapsed — kind and work state, placement and status, existence and liveness,
ruling and measurement. This one separates **consistency and correctness**. A reconciliation that
checks only whether a document agrees with itself will ratify a coherent, wrong number indefinitely.
