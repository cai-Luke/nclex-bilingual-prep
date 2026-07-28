# DECISIONS.md Cleanup — Phase 1 Closure Pass — Codex Work Order

**Date:** 2026-07-28
**Seat:** Codex. Producer seat. Producer≠checker is a role rule, not a name rule: it attaches to
whichever model produces here. You produce; you do not gate your own output. The reconciliation
checker you write in section 5 is **not** your gate — its expected values are fixed externally by the
architect/owner contract in section 4, which is what makes it an independent mechanical null rather
than a number you derived and then agreed with.
**Authority:** Architect commission under owner ratification. Artifact repair, one new checker, and
correction of invalidated claims. Nothing else.
**Status:** Open work order. **Immutable during execution.** If you believe it is wrong, stop and
report; do not edit it and do not route around it.

**Governing contract:** `DECISIONS-CLEANUP-PHASE-1-SURVEY-CODEX-SPEC-2026-07-24.md` at the repository
root, **Amendments 1–6**. Read section 8 and Amendment 6 in full. Where this file and that spec
disagree, the spec governs and you report the conflict rather than choosing.

**Classification contract:** `DECISIONS-TAXONOMY-2026-07-24.md` at the repository root, RATIFIED
2026-07-24 including Amendments 1–2, **Amendment 3 ratified 2026-07-28**.

**Historical, not governing:** `DECISIONS-CLEANUP-PHASE-1-CORRECTION-WORK-ORDER-2026-07-24.md`
sequenced a *completed* pass. Its lines stating that principles 9/12/18/22 are unruled and that no
`P31` is minted were true when written and are now superseded by Amendment 6. **Do not reconcile
against it and do not edit it.** A completed work order is a record of what was commissioned, not a
live instruction.

---

## 1. What happened, in one paragraph

PR #88 merged on 2026-07-28, landing the phase-1 classification survey. Post-merge review found that
the deliverables misstate their own population: `inventory.md` and `migration-table.md` each contain
**80 rows** under a hand-entered total of **78**, and three enumerations in
`outline-before-after.md` drop rows (`E003`, `E074`, `E063`, `E047c`) while their hand-entered totals
stay internally plausible. Separately, the owner ruled on 2026-07-28 on the four questions the survey
correctly routed out. This pass repairs the arithmetic, records the rulings, adds a deterministic
reconciliation checker so this class of defect cannot survive again, and corrects the merged claims
the rulings invalidate. **Phase 2 does not begin until this lands cleanly.**

---

## 2. Preflight — stop conditions

All four must hold. If any fails, **stop and report it**. Do not proceed on a tree you have not
verified.

1. `git rev-parse --abbrev-ref HEAD` — record it. Work on a branch cut from `main`, named
   `codex/decisions-cleanup-phase-1-closure`.
2. `git status --porcelain` — must be **empty**. If it is not, the governance amendments may still be
   uncommitted and `HEAD` is not the baseline this order assumes.
3. `git rev-parse HEAD` — record this as **`CLOSURE_HEAD`**. This is your baseline and the only one.
   It is **not** `SURVEY_HEAD` (`f68210c`) and **not** `CORRECTION_HEAD` (`547fdea`); those are
   permanently bound to earlier passes and a token that changes referent between passes is a
   provenance trap.
4. `git log --oneline -1` and `git show --stat HEAD` — the commit at `CLOSURE_HEAD` must be
   **governance-only**, touching exactly and only:
   - `DECISIONS-TAXONOMY-2026-07-24.md`
   - `DECISIONS-CLEANUP-PHASE-1-SURVEY-CODEX-SPEC-2026-07-24.md`
   - `DECISIONS-CLEANUP-PHASE-1-CLOSURE-CODEX-WORK-ORDER-2026-07-28.md` (this file)

   A fourth path means the baseline is contaminated. Stop.

Report all four results before starting section 3.

---

## 3. The four owner rulings you are implementing

Restated here in full so you never need chat context. Amendment 6 of the survey spec is the
authority; this is a faithful restatement, and if you find any divergence between them, **the spec
governs and you report the divergence**.

**These are owner ratifications dated 2026-07-28. They are not survey findings.** Nowhere in any
artifact may they be described as something the survey discovered, concluded, or was previously
certified to support. Where a pre-2026-07-28 artifact records one of these questions as open, that
record is *correct for its date* — it is provenance, not staleness, and you do not rewrite history to
make the survey look prescient.

1. **Principles 9, 12, 18, and 22 retire.** None retains a surviving universal core under its old
   number. The four numbers remain permanently unavailable (taxonomy §7). `E040`, `E041`, `E042`,
   `E043b` archive; their `*(retire #n — provisional)*` markers become final, not provisional.
   **`E043a` is unaffected and stays live** — principle 22's `opus*` routing invariant is preserved
   independently of the prose that archives with it.
2. **`E074` takes permanent ID `P31`,** under taxonomy §7's allocation rule (Amendment 3): a newly
   ratified governing principle takes the next integer above the highest principle number ever
   assigned; retired numbers, intentionally unused numbers, and gaps are never filled or reused.
   The earlier "no `P31`" ruling is narrowed to `E037` alone. `E074` remains `P | ACTIVE | BINDING |
   STAY`, now in §4 with a permanent ID.
3. **`E047c` is reclassified.** From `X | ACTIVE | HISTORICAL | ARCHIVE` to
   **`R | ACTIVE | BINDING | STAY | EXECUTED`, permanent ID `R3`.**
   **This is the cleanup's first genuine force change** (`HISTORICAL` → `BINDING`), owner-originated
   and post-survey. The resulting permanent R-series, which you will write into every artifact:

   | ID | entry | effective date |
   |---|---|---|
   | `R1` | `E070` | 2026-07-02 |
   | `R2` | `E049` | 2026-07-05 |
   | `R3` | `E047c` | 2026-07-15 |
   | `R4` | `E072` | 2026-07-17 |
   | `R5` | `E047a` | 2026-07-24 |
   | `R6` | `E073` | 2026-07-24, later document order |

   `E072` moves `R3`→`R4`, `E047a` moves `R4`→`R5`, `E073` moves `R5`→`R6`. No R number has landed in
   `DECISIONS.md`, so this renumbering breaks no permanent identifier.
4. **`E029` remains a `P25` application.** `P | ACTIVE | BINDING | EXECUTION: PENDING`, sharing
   permanent ID `P25`, no `R` number. The `inventory.md` §4.2 reasoning stands unchanged.
5. **`E038` stays one live `I | ACTIVE | ADVISORY | STAY` entry.** Its ratified phase-2b target
   wording, recorded here as the destination and **not to be written into `DECISIONS.md` by this
   pass**:

   > Current producer assignments are operational state and must be verified against
   > `PROJECT-HISTORY.md`; changing the named producer does not alter permanent IDs, provenance
   > classification, or independent-review obligations.

   The displaced dated assignment prose is preserved verbatim in the archive at phase 2 and pointed
   at from `E038`'s evidence pointer. **This creates no archive-index row.** It is compression inside
   a surviving entry — not an additional `X` disposition, not a deletion. `E038`'s destination stays
   `STAY` and the §8 archive-index population is unaffected by it.

---

## 4. Pinned reconciliation constants (owner-ratified — do not derive these)

These are fixed externally. Your checker asserts **derived-equals-pinned**. It does not compute them,
infer them, or reconcile them against each other in place of them. A checker that derives its own
expected values and compares them only against itself certifies internal consistency, not
correctness — which is exactly how `78` survived three passes.

| quantity | pinned value |
|---|---|
| inventory rows | **80** |
| independent destination rows | **79** |
| `STAY` | **65** |
| `ARCHIVE` | **14** |
| `MERGE_INTO` | **1** |
| §4 `P` | **37** entry rows |
| §4 distinct live permanent principle numbers | **25** |
| §5 `R` | **6** |
| §6 `I` | **19** |
| §7 `T` | **3** |
| §8 `X` | **14** |

79 independent destination rows + `E037` (the sole `MERGE_INTO`, which has no independent
destination) = 80 inventory rows.

**Pinned exceptional identities.** Each is a row a total-only check has already failed to protect:

- `E003` appears in §4 under `P2`.
- `E074` appears in §4 under `P31`.
- `E063` appears in §6.
- `E047c` appears in §5 as `R3` and **nowhere** in §8.
- `E043a` appears in §6, live, and may **never** share `E043b`'s archive destination.
- `E037` is the sole `MERGE_INTO` row, targets `E039a`, `E002`, `E006`, and has no independent
  destination row.

**The 80-row population, enumerated so you can verify your parser against it:** E001–E035 (35),
E036–E038 (3), E039a/E039b (2), E040–E042 (3), E043b/E043a (2), E044–E046 (3), E047a/E047b/E047c (3),
E048–E053 (6), E054–E076 (23). Total **80**.

---

## 5. Task 2 — the deterministic reconciliation checker

**Write this first, before repairing anything.** It is the instrument; a repair verified only by the
seat that made it is not verified.

**Path:** `scripts/decisions-migration-reconcile.ts`
**Invocation:** add **exactly one line** to `package.json`'s `scripts` block, named
`reconcile:decisions-migration`, matching the invocation convention of the existing
`survey:decisions-refs` entry in that same file exactly. Do not restructure `package.json`, do not
reorder its keys, and do not add a second line.

**Inputs:** the three artifacts under `audit/decisions-cleanup-2026-07-24/` — `inventory.md`,
`migration-table.md`, `outline-before-after.md`. `migration-table.md`'s row table is the authority on
kind, status, force, destination, and permanent ID. The other two are checked against it.

**Assertions.** Every one must be implemented; every failure must be reported, not just the first;
the process must exit non-zero if any fails.

1. `migration-table.md` parses to exactly **80** unique migration IDs, and the ID set equals the
   enumeration in section 4 above.
2. Every row carries exactly one destination, drawn from `STAY`, `ARCHIVE`, or
   `MERGE_INTO <target ids>`. No bare `MERGE`. No fourth value. No row with zero or two.
3. Derived destination totals equal the pinned `STAY` / `ARCHIVE` / `MERGE_INTO` values.
4. Derived per-section populations (§4/§5/§6/§7/§8) equal the pinned values, and the count of
   distinct live permanent principle numbers in §4 equals the pinned **25**.
5. The ID sets agree exactly across all three files. Not the counts — the **sets**. Report any ID
   present in one and absent from another, in both directions, naming the ID and both files.
6. Every `STAY` row appears exactly once in the outline section its kind assigns it, and nowhere
   else. Every `ARCHIVE` row appears exactly once in outline §8, and nowhere else.
7. The sole `MERGE_INTO` row has no independent destination row anywhere in the outline; each of its
   named targets exists as its own row and carries destination `STAY`.
8. Each pinned exceptional identity in section 4 holds, asserted individually and by name, with its
   own failure message.
9. The `R` series is exactly `R1`–`R6`, contiguous, no gaps, no duplicates, mapped to the entries in
   section 3 ruling 3.
10. Totals are never accepted as a substitute for set equality. If an implementation choice would let
    assertion 3 or 4 pass while 5 fails, that implementation is wrong.

**Negative control — required, and the point of the exercise.** Run the finished checker against the
**unrepaired** artifacts at `CLOSURE_HEAD`, before any repair. It **must fail**, and it must name at
minimum: the 78-vs-80 row-count mismatch, `E003` and `E074` missing from outline §4, `E063` missing
from outline §6, and `E047c` missing from outline §8. Capture that output verbatim. A checker first
run against already-correct artifacts is not evidence that it fires. Then repair, then run it again
and capture the pass.

---

## 6. Task 1 — artifact repairs

Repair `inventory.md`, `migration-table.md`, `outline-before-after.md`, and `findings.md` to the
80-row population and the section 3 rulings. Specifically, at minimum:

- **Every hand-entered total of 78** becomes 80, with the derivation corrected. `inventory.md`'s
  stated derivation ("76 pass-1 entries + the E039a/E039b split") is arithmetically impossible for a
  table carrying four net split rows and must be replaced, not patched.
- **`outline-before-after.md` §4** gains `E003` (under `P2`) and `E074` (under `P31`) → 37 rows, 25
  permanent numbers.
- **`outline-before-after.md` §6** gains `E063` → the enumeration finally sums to its stated 19. Its
  current range notation `E054–E062, E064–E069` silently skips `E063`; prefer an explicit list or a
  range that does not require the reader to notice an omission.
- **`outline-before-after.md` §5** becomes 6 rows (`R1`–`R6`) and §8 loses `E047c` → 14.
- **`migration-table.md`'s summary** loses the stale `35 §4 + 6 §5` split — it is `36 §4 + 5 §5`
  pre-ruling and `37 §4 + 6 §5` after — and its `ARCHIVE` total moves 14 → 15 → 14 across the two
  corrections (the missed `E047c` row, then `E047c`'s promotion out of the archive). State the final
  values; do not narrate the intermediate.
- **`E047c`, `E072`, `E047a`, `E073`, `E074`** carry their new classifications and IDs in every file.
- **`findings.md` §C axis 2** replaces `OPEN OWNER QUESTION` for principles 9/12/18/22 with the
  retirement ruling, attributed to the owner and dated 2026-07-28.
- **`findings.md` §F** closes questions 1, 2, 4, and 5 with the rulings. Questions 3 (`E074`'s
  wording) and 6 (the `unqualified-basename` class) remain open and route to phase 2b.
- **`findings.md` §E** currently lists nine entries at evidence-fraction ≥55% plus `E073` at ~45% as
  a borderline candidate. If it is described anywhere as "ten at ≥55%," correct it.

This list is a floor, not a ceiling. The checker defines done. If the checker passes and some other
statement in these four files still contradicts section 3 or section 4, the statement is wrong and
you fix it.

---

## 7. Task 3 — correct the invalidated claims

The `E047c` ruling makes several merged statements false as written. Every claim that **zero force
changes survive** — in `findings.md` §A, `migration-table.md`'s header and summary, and anywhere else
it appears in the four in-scope files — must be corrected to record that exactly one force change
exists, that it is `E047c`'s `HISTORICAL` → `BINDING`, and that it is an **owner ratification of
2026-07-28, post-survey**, not something this or any earlier pass discovered or certified.

Do not soften this into "the survey identified a candidate." It did not. `inventory.md` §4.1
explicitly declined the `R` reading and routed it to the owner; that was correct conduct and should
be described as such. The owner then ruled the other way. Both facts are true and both belong in the
record.

**You may not edit the PR #88 description** — it is a GitHub artifact outside this tree and outside
your scope. Note in your handoff that it still carries the superseded "zero force-change escalations"
line so the architect seat can dispose of it.

---

## 8. Task 4 — provenance of the inherited `78`

Report where the `78` assertion entered the artifact chain, **if readily determinable** from the
files and commit history already in this repository. `git log -S` over the four artifacts and the
survey spec is the expected cost. One paragraph in `findings.md`.

**This is bounded on purpose.** If it is not readily determinable, say so and stop. Do not expand
this into a historical audit of passes 1 and 2, do not reconstruct deleted pass-1 deliverables, and
do not spend more than a single investigative pass on it. An honest "not determinable from the tree"
is a complete answer to this task.

---

## 9. Non-goals (binding)

Do not, under this commission:

1. Edit, move, reorder, retitle, renumber, compress, or delete anything in `DECISIONS.md`. This pass
   authorizes no change to it whatsoever.
2. **Regenerate `audit/decisions-cleanup-2026-07-24/reference-graph.json`, or run
   `survey:decisions-refs` against the live tree.** The graph is a measurement frozen at
   `CORRECTION_HEAD` and stays that way. Regenerating it would strand `findings.md` §G's count
   decomposition and §H's `MISSING`-class reconciliation against a corpus that no longer matches,
   while changing not one migration row. The governance amendments at `CLOSURE_HEAD` do alter the
   corpus; that is expected, accounted for, and out of scope here.
3. Edit `CLAUDE.md`, `AGENTS.md`, `PROJECT-HISTORY.md`, `NCLEX-Question-Schema.md`, or anything under
   `Archive/`.
4. Edit `DECISIONS-CLEANUP-PHASE-1-CORRECTION-WORK-ORDER-2026-07-24.md`, the survey spec, the
   taxonomy, or this file. Governance files are architect-seat. If one of them is wrong, report it.
5. Write the compressed wording of `E038`, `E074`, or any other entry. Section 3 records target
   wording as a phase-2b destination; recording is not authorization.
6. Create the archive destination file or move any content toward it.
7. Touch `scripts/decisions-reference-graph.ts`. Multiline principle extraction, section-heading
   identity capture, and dual-format principle parsing are a separate architect-authorized
   graph-hardening commission that does not exist yet.
8. Design or propose the target `DECISIONS.md` entry format. That is the prerequisite for graph
   hardening and it is not a producer-seat artifact.
9. Write the phase-2 spec, open a second pull request, or merge anything.
10. Modify `package.json` beyond the single line in section 5.
11. Touch `.github/workflows/`, any bank, schema, renderer, or runtime file.

---

## 10. Verification before handoff

Report the result of each. A self-report that a step passed is not the step.

1. `npx tsc -b --pretty false` — exit code.
2. **Checker negative control** — the verbatim failing output from section 5, captured against the
   unrepaired artifacts at `CLOSURE_HEAD`, showing it names the four known defects at minimum.
3. **Checker pass** — `npm run reconcile:decisions-migration` against the repaired artifacts, exit 0,
   full output.
4. `git diff --stat "$CLOSURE_HEAD"..HEAD -- DECISIONS.md CLAUDE.md AGENTS.md PROJECT-HISTORY.md
   NCLEX-Question-Schema.md DECISIONS-TAXONOMY-2026-07-24.md
   DECISIONS-CLEANUP-PHASE-1-SURVEY-CODEX-SPEC-2026-07-24.md` — must be **empty**. A working-tree
   diff will not do; this pass lands more than one commit and a clean tree proves only that the last
   one was clean.
5. `git diff --stat "$CLOSURE_HEAD"..HEAD -- audit/decisions-cleanup-2026-07-24/reference-graph.json`
   — must be **empty**. This is non-goal 2, enforced.
6. `git diff --name-only "$CLOSURE_HEAD"..HEAD` — must list **exactly these six paths and no
   others**:
   - `audit/decisions-cleanup-2026-07-24/inventory.md`
   - `audit/decisions-cleanup-2026-07-24/migration-table.md`
   - `audit/decisions-cleanup-2026-07-24/outline-before-after.md`
   - `audit/decisions-cleanup-2026-07-24/findings.md`
   - `scripts/decisions-migration-reconcile.ts`
   - `package.json`

   An allowlist is the check that actually enforces section 9, because a denylist cannot forbid a
   file nobody thought to name.
7. `git diff --numstat "$CLOSURE_HEAD"..HEAD -- package.json` — must report exactly `1` added line
   and `0` removed.
8. The full current pull-request gate step list from `.github/workflows/promotion-gate.yml`,
   unmodified and complete, every command exiting 0, run in the live branch checkout. `npm ci` is
   part of that list. Run it, or report it as skipped — do not run a subset and describe it as a
   complete gate run.
9. `git status --porcelain` — empty after the final commit.

**Staging discipline.** The working tree carries unrelated untracked content (an exam-calculator
spec, GPT-scored format batch 12/13 artifacts). Stage by explicit path, never `git add -A` or a
glob. A broad add puts an unrelated content workstream into this pass's commits and breaks the
section 10 item 6 allowlist you are about to certify against.

---

## 11. Handoff

Report to the architect seat:

- All four preflight results and `CLOSURE_HEAD`.
- Every section 10 item, with actual output rather than a claim about it.
- The section 8 provenance paragraph, or an explicit "not determinable from the tree."
- Anything you found that contradicts section 3 or section 4 and that you fixed under section 6's
  closing instruction, named individually.
- Anything you believe is wrong in this work order, the survey spec, or the taxonomy — reported, not
  worked around.

**Nothing in this document authorizes a change to `DECISIONS.md`.** Phase 2 begins only after this
pass lands cleanly and the architect seat has commissioned the target-format definition and the
graph-hardening pass that follow it.
