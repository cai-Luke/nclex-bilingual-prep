# DECISIONS.md Cleanup — Phase 1 Classification Survey — Codex Commission Spec

**Date:** 2026-07-24
**Seat:** Codex. Producer seat.
**Authority:** Architect commission. Classification and architecture only.
**Status:** Open work order. Immutable during execution.

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

The taxonomy is ratified separately from this commission. If it is amended before you start, read
the amended file; do not reconcile against any wording recalled from elsewhere.

---

## 3. Frozen input

Run from a clean branch. Capture `SURVEY_HEAD=$(git rev-parse HEAD)` before writing anything and
report it, the branch, upstream state, and starting changed paths. Every classification and every
citation in this commission resolves at `SURVEY_HEAD`.

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

**Resolution rules. Apply these exactly; do not extend them.**

- `principle n`, in any casing, always targets principle `n` in `DECISIONS.md`, regardless of which
  file the reference appears in.
- A bare `§n` targets section `n` of the file the reference appears in.
- `<repository path> §n` targets section `n` of the named file.
- A Markdown link resolves relative to its own source file.
- A repository path resolves only when that exact tracked path exists at `SURVEY_HEAD`.
- Anything requiring semantic inference is emitted as `ambiguous`, never guessed.

A bare `§7` inside an archived spec is that spec's section 7. It is not `DECISIONS.md` section 7,
and a resolver that assumes otherwise manufactures a citation graph rather than measuring one.

Extract from every source in section 3 every reference of the forms above. For each, record source
file, line, raw matched text, and resolved target where a target resolves.

Emit `{ from, fromLine, rawText, kind, target, resolves }` records plus, at top level:
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

Where you propose a permanent principle number or `R` identifier, propose it, applying the bootstrap
rule in taxonomy section 7. Never propose reusing a retired number and never propose renumbering an
existing one.

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
3. `git diff --stat -- DECISIONS.md CLAUDE.md AGENTS.md PROJECT-HISTORY.md` — must be empty.
4. `git diff --numstat -- package.json` — must report exactly one added line.
5. The full current pull-request gate step list, unmodified — every command exits 0.

---

## 11. Handoff

Owner reads `migration-table.md` and `findings.md` and ratifies the map, including every force
change individually. Only then does a separate phase-2 commission perform moves and compression.
Phase 3 re-derives classification independently from `DECISIONS.md` at `SURVEY_HEAD` — not from the
migration table — because a faithful compression of a wrong map passes a conformance check.

Nothing in this document authorizes a change to `DECISIONS.md`.
