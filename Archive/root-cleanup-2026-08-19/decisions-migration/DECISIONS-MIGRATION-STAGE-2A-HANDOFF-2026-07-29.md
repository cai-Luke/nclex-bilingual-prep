# DECISIONS Migration — Stage 2a Handoff

**Date:** 2026-07-29 · **From:** architect seat (chat, no shell) · **To:** next agent seat (with repo + shell)
**Status:** Handoff. No migration write has occurred. No branch has been created.

This document is closed-world. Do not rely on prior chat context.

---

## 1. Why this handoff exists

The architect chat seat has **no shell access to the repository** and **no branch-creation tool**. Its
git surface is limited to status, log, ahead/behind, working-tree diff, add, commit, push, plus
file reads and writes. It therefore cannot:

- create `codex/decisions-migration`;
- run `git show MIGRATION_BASELINE:DECISIONS.md`;
- compute SHA-256 or byte offsets.

Stage 2a's archive-wrapper records require exact baseline byte spans and hashes, so the numeric
derivation must be done by a seat that can execute. The architect will not synthesize those values
by reading the file into context and re-emitting it: `DECISIONS.md` is ~76 KB dense with non-ASCII
(`§`, `—`, `≤`, `₂`, `°`, `→`, `χ²`), and a hash computed over a re-typed copy would certify bytes
that may not be the real ones. Commission §5.5 verifies each pinned hash before writing a body, so a
round-tripped hash either hard-fails the migration or silently certifies a corrupted span.

---

## 2. Verification provenance — read this before trusting any prior report

Earlier in the originating session, a shell tool appeared to return git and test output. The owner
has since stated the environment never had working shell access. That contradiction cannot be
resolved from here, so **every shell-derived claim from that session is to be treated as unverified
by the architect seat.**

### 2.1 Still sound — derived from file reads and git metadata tools only

- Commit graph and linearity on `main`; `d499cc1`, `4f9154d`, `6518d64`, `eb0e02e`, `b5d0027`,
  `5b30046`, `05f9bcd` are ancestors in that order.
- Tracked worktree clean; this handoff is the sole untracked file. `main` is ahead of `origin/main` by 2 and behind 0.
- Repository path history shows `35b968e` (2026-07-24) as the most recent commit touching `DECISIONS.md`; no later commit through `05f9bcd` touches that path.
- Source review of `scripts/decisions-reference-graph.ts`, `lib/decisions-format.ts`, and
  `scripts/tests/decisions-reference-graph.ts`: extraction precedence ordering, exact-span
  declaration suppression, dual ratified/GitHub anchor population, and the adversarial content of
  the regression suite.
- `scripts/decisions-migration-reconcile.ts` hard-pins
  `destinations: { STAY: 65, ARCHIVE: 14, MERGE_INTO: 1 }` and `sections: { 4:37, 5:6, 6:19, 7:3, 8:14 }`
  and validates the frozen phase-1 artifacts against themselves.
- Contents of the taxonomy, format spec, fixtures, migration table, outline, amendment, and
  commission.

### 2.2 Must be re-run before the migration is trusted

None of the following was independently confirmed by any non-shell tool. Each currently rests on
**Codex's producer report alone**, which is precisely what producer≠checker exists to prevent:

1. Five-path allowlist across `e2c7da6..b5d0027`.
2. Protected-baseline diff emptiness.
3. `package.json` +1/−0.
4. Frozen phase-1 artifact SHA-256 `42cdc8369b5db1dc24ddb9624d1832705c7c22337b20eca5246b4d745466c937`.
5. Pre-migration artifact manifest counts and internal consistency (443 / 12,477 / 6,029 live /
   206 lapsed / 6,201 missing / 41 N-A / 7 derived / 0 invalid-anchor).
6. Two-run determinism and fresh-run reproduction of the committed artifact.
7. `tsc -b`, `test:decisions-format`, the reference-graph suite, `npm run audit`, `census:check`.
8. The 451 advisory `revealsAllStages` count.

**One exception now independently corroborated without relying on mtime:** repository path history shows `35b968e` (2026-07-24) as the latest commit touching `DECISIONS.md`, while `MIGRATION_BASELINE` `d499cc1` and every later commit through `05f9bcd` leave that path untouched. The tracked worktree has no modification to `DECISIONS.md`. This supports the baseline invariant, which the shell-capable agent must still confirm directly with `git diff <full MIGRATION_BASELINE SHA> -- DECISIONS.md` before deriving spans.

**Required action:** re-run §2.2 items 1–8 and record results in the migration receipt before Stage
2b lands. If any fails, stop and return to the architect — the hardening pass's acceptance was
partly grounded in unverifiable output and does not carry independent weight on those points.

---

## 3. Repository state at handoff

- Branch `main`, head `05f9bcd`; tracked worktree clean; ahead of `origin/main` by 2 unpushed commits.
- `5b30046` — ratify Amendment 4 and the staged migration commission.
- `05f9bcd` — apply Amendment 4 to taxonomy, format spec, and hand-authored fixtures.
- `MIGRATION_BASELINE = d499cc1` (resolve the full 40-character SHA from disk before use; never use
  the abbreviation as a command argument).
- Untracked: this handoff file.

**Governing documents, all on `main`:**

- `DECISIONS-ARCHIVE-PRESERVATION-AND-WRAPPER-ADDRESSING-AMENDMENT-2026-07-29.md` (ratified)
- `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md` (ratified)
- `DECISIONS-TAXONOMY-2026-07-24.md`, `DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md`,
  `DECISIONS-FORMAT-FIXTURES-2026-07-28.md` (all as amended by `05f9bcd`)
- `audit/decisions-cleanup-2026-07-24/` — frozen; never edit

---

## 4. Immediate next actions, in order

1. Verify §3 independently: branch, head, cleanliness, ahead-count, full baseline SHA.
2. Confirm `git diff d499cc1 -- DECISIONS.md` is empty. If not, **stop**.
3. Create `codex/decisions-migration` from `05f9bcd`.
4. Run the span-and-hash pass in §5 against `git show <full MIGRATION_BASELINE SHA>:DECISIONS.md`.
   Do not read the working tree.
5. Return the §5 output to the architect seat for the Stage 2a manifest.
6. Separately, re-run §2.2 items 1–8 and record the results.

Do not begin Stage 2b. Do not touch `DECISIONS.md`, the parser guard, or any governed file. Stage 2b
is authorized only after the Stage 2a manifest is owner-ratified (commission §4.9, §12 gate 3).

---

## 5. The span-and-hash pass

### 5.1 Population — 13 archive wrapper records

Per commission §3 and Amendment 4 §6, the normalized archive carries **13 wrappers and 13
archive-index lines**. `E053` is excluded — it becomes structural target-§8 introduction prose with
no wrapper and no index line. Re-derive this list from
`audit/decisions-cleanup-2026-07-24/migration-table.md` and `outline-before-after.md` rather than
trusting the summary below.

| # | Source ID | Legacy home | Addressing | Notes |
|---|---|---|---|---|
| 1 | `E032` | §4, under principle 27 | name | **embedded fragment**; P27 stays live |
| 2 | `E036` | §5 lapse note | name | **embedded fragment** |
| 3 | `E039b` | §5, inside principle 8's body | name | **embedded fragment**; P8 restored live |
| 4 | `E040` | §5, principle 9 | **ID** | `Retired ID: P9` |
| 5 | `E041` | §5, principle 12 | **ID** | `Retired ID: P12` |
| 6 | `E042` | §5, principle 18 | **ID** | `Retired ID: P18` |
| 7 | `E043b` | §5, principle 22 | **ID** | `Retired ID: P22`; `E043a` stays live in §6 |
| 8 | `E048` | §8 superseded rulings | name | `Original Kind: R`; never held an R number |
| 9 | `E050` | §8 superseded rulings | name | |
| 10 | `E051` | §8 superseded rulings | name | |
| 11 | `E052` | §8 superseded rulings | name | |
| 12 | `E075` | Reference appendices | name | **embedded fragment** |
| 13 | `E076` | Reference appendices | name | **embedded fragment** |

Only records 4–7 retire an identifier. All others are name-addressed under Amendment 4 Clause B and
produce **no** retired-register row.

### 5.2 What to produce

This pass performs **no boundary judgment**. For each of the 13, emit a candidate region with
generous context so the architect can set the exact boundary:

1. The containing section heading, verbatim.
2. Byte offset of the start of the containing block.
3. **40 lines of context** before and after the candidate region, with per-line byte offsets.
4. Total file byte length and SHA-256 of the whole baseline file.

Report offsets as **byte** offsets into the raw baseline blob, not character or line indices. State
the encoding (expected UTF-8) and whether the file ends with a trailing newline.

The architect then returns exact first/last line anchors plus boundary rationale, and a second pass
converts anchors to final offsets, byte lengths, and per-body SHA-256.

### 5.3 Why anchors before offsets

A reviewer can check "does this entry really end at this quoted line" by eye. Nobody can eyeball
whether offset 41,207 is correct. Commission §4.9 requires the reviewer to independently reproduce
all 13 slices, so the boundary must be stated in a human-checkable form as well as a numeric one.
The manifest still pins offsets, lengths, and hashes as §4.7 requires — this only orders the
derivation.

---

## 6. Stage 2a manifest contract — the parts a producer seat must not decide

Restated from commission §4. The architect authors all of this; no implementation seat proposes
alternate text.

- Exact heading bytes, exact 1–3 sentence statement bytes, exact field lines in the fixed order
  (`Kind`, `Status`, `Force`, `Date`, `Authorized`, `Not authorized`, `Evidence`, `Owner`,
  `Execution`), and an explicit `OMIT` for every absent optional field.
- Core-versus-attachment identity and attachment ordinals.
- `Evidence`/`Owner` resolved to exactly one tracked repository path, or `OMIT` with a reason.
  Commands, symbols, prose labels, and enum names are never paths.
- Archive labels: unique, and never beginning `P<n> ` or `R<n> ` — that shape is reserved for
  ID-addressed index entries and will be rejected `HEADING_SHAPE`. Worked renamings:
  `E032` → `Most recent application of P27 (2026-07-12 pass)`;
  `E039b` → `Lane-specific detail of P8 (forward case-generation pipeline)`.
- Boundary rationale is mandatory for the five embedded fragments: `E032`, `E036`, `E039b`, `E075`,
  `E076`.

### 6.1 Pinned target counts

65 live blocks (37 `P` + 6 `R` + 19 `I` + 3 `T`) · 65 entry-index rows · 13 wrappers · 13
archive-index lines · 6 retired-register rows (`P9`/`P12`/`P18`/`P22` `RETIRED`; `P13`/`P14`
`NEVER ASSIGNED`) · 25 distinct live `P` numbers · `R1`–`R6`. Allocation unions contiguous `P1`–`P31`
and `R1`–`R6`. Reconciliation: 65 + 13 + 1 (`E053` structural) + 1 (`E037` `MERGE_INTO`) = 80.

---

## 7. Standing constraints

- `audit/decisions-cleanup-2026-07-24/` is frozen. `scripts/decisions-migration-reconcile.ts` keeps
  its historical 65/14/1 pins and must continue to pass. The new target reconciler is a separate
  script with its own independently pinned 65/13/1/1 null.
- `Archive/DECISIONS-ARCHIVE-2026-07-14.md` is untouched.
- The preservation snapshot `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` is created from
  `git show MIGRATION_BASELINE:DECISIONS.md`, never from the working tree, and is never parsed by
  the conformance checker and never given a §8 index line.
- Exactly one parser change is authorized in Stage 2b: removal of the guard rejecting
  `Original Kind: P`/`R` on a name-addressed archive wrapper. Fixture expectations must never be
  derived from the modified parser.
- Nothing is pushed or merged until all gates pass and independent review accepts.
