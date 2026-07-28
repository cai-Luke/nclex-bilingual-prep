# DECISIONS.md Cleanup — Phase 1 Correction Pass — Implementation Work Order

**Date:** 2026-07-24
**Seat:** Implementation / producer seat. **Routed to Claude Code for this pass** (pass 2 ran in
Codex). Producer≠checker is a role rule, not a name rule: it attaches to whichever model produces
here, so nothing about this routing relaxes the separation. You produce; you do not gate your own
output.
**Authority:** Architect commission. Sequencing and defect list only.
**Status:** Open work order. Immutable during execution.
**Governing contract:** `DECISIONS-CLEANUP-PHASE-1-SURVEY-CODEX-SPEC-2026-07-24.md` at the
repository root, Amendments 1–5. **Read it in full first.** This file sequences a correction pass
against that spec; it does not restate it and does not override it. Where this file and the spec
disagree, the spec governs and you report the conflict rather than choosing.

**Classification contract:** `DECISIONS-TAXONOMY-2026-07-24.md` at the repository root, RATIFIED
2026-07-24 by Luke including Amendments 1–2.

---

## 1. What happened, in one paragraph

Pass 2 executed the commission, verified cleanly against spec section 10, opened draft PR #88 from
branch `survey/decisions-cleanup-phase-1`, and was refused at architect review on six defects. Three
were the spec's own and are now fixed in it by Amendment 5. Three are producer defects and are
listed in section 4 below. The pass-2 classification work is **not** scrap: the 78-entry boundary
set, the E039a/E039b split, the mis-file corrections on E047a and E049, the dual-provenance
handling, and the frozen-input ordering all survive and anchor this pass. What must be rebuilt is
the resolver, everything computed from it, and the inventory fields Amendment 5 restores.

Do not re-litigate the owner rulings in spec section 8. They are settled: principle 8 is
de-conditionalized and retained under number 8; no `P31` is minted; the permanent `R` series begins
at `R1`; principles 9, 12, 18, and 22 are not ruled on and their questions route to the owner.

---

## 2. Ordering

### 2.0 Preflight — stop conditions (check before reading further, and before any implementation)

All four must hold. If any fails, **stop and report it**; do not proceed on a tree you have not
verified.

1. `git rev-parse --abbrev-ref HEAD` — must be `survey/decisions-cleanup-phase-1`.
2. `git status --porcelain` — must be **empty**. If it is not, the governance files may still be
   uncommitted and `HEAD` is not the baseline this order assumes.
3. `git rev-parse HEAD` — record this as `CORRECTION_HEAD`. This is your baseline. It is **not**
   `83f8dc6` and **not** `f68210c`; if `HEAD` is either of those, the governance commit has not
   landed and you must stop.
4. `git diff --name-only 83f8dc6..HEAD` — must list **exactly these two paths and nothing else**:
   - `DECISIONS-CLEANUP-PHASE-1-SURVEY-CODEX-SPEC-2026-07-24.md`
   - `DECISIONS-CLEANUP-PHASE-1-CORRECTION-WORK-ORDER-2026-07-24.md`

   A third path means the governance commit was not governance-only and the baseline is
   contaminated. A missing path means one of the two amendments is not committed. Either way, stop.

Report all four results before starting section 2.1.

### 2.1 Sequence

The amended spec and this work order are both root-level `*.md` files and are therefore **inside**
the reference-graph corpus defined by spec section 3. If either is uncommitted when the frozen
worktree is cut, the graph measures text that no longer exists. This is the defect Amendment 3
corrected once already.

**Step 0 is not yours.** The owner commits the two governance files as the governance-only
`CORRECTION_HEAD` before you are launched, because the owner holds commit and merge authority on this
repository. Section 2.0 is how you confirm it happened. If preflight fails, stop — do not commit the
governance files yourself and do not work around a contaminated baseline.

`SURVEY_HEAD` is never recaptured or redefined. It stays permanently bound to the pass-2 commit
`f68210c`, which the committed pass-2 artifacts cite; a baseline token that changes referent between
passes is a provenance trap. Spec section 3a defines `CORRECTION_HEAD` and gives the exhaustive token
mapping. Your work begins at step 1:

1. Correct the generator (section 3). Run the section 6 verification, including items 6, 8, and 9 of
   spec section 10 — the extended negative control and the `MISSING`-class reconciliation — **before
   generating any graph against the corpus.**
2. Commit the corrected generator.
3. Create a detached read-only worktree at `CORRECTION_HEAD` outside the live repository directory.
   Run the committed generator from the live branch checkout with `--root` pointed at that worktree.
   Generate twice, show the two-run diff, remove the worktree, and confirm the live worktree is
   unchanged apart from the section 4 deliverables.
4. Regenerate `reference-graph.json` first. Recompute every count, queue, and delta in the other
   four deliverables **from the regenerated artifact**, never from pass-2 numbers.
5. Re-derive the inventory fields (section 5), repair the two classifications (section 4), apply
   `MERGE_INTO` to E037 (section 4), and rewrite the LAPSED queue (section 5).
6. Commit the five deliverables. Push to `survey/decisions-cleanup-phase-1`, which updates the
   existing draft PR #88 — do not open a second one. Nothing goes to `main`, and you do not merge.

`DECISIONS.md` was last modified at `35b968e`, which precedes `f68210c`. It is byte-identical at
`35b968e`, at `f68210c`, at current `HEAD`, and at `CORRECTION_HEAD`. Every entry boundary,
line number, and byte length from pass 2 therefore remains exactly valid. Confirm this yourself with
`git diff --stat 35b968e..HEAD -- DECISIONS.md` and report the empty result; do not take it on
trust from this file.

**Expect the graph's totals to move for reasons that are not defects.** The corpus now contains the
amended spec and this work order, both of which cite principles and paths. A count delta against
pass 2 is not evidence of anything by itself. Report deltas with their cause attributed.

---

## 3. Generator defects to fix

File: `scripts/decisions-reference-graph.ts`. Four defects, all in extraction.

**3.1 — Oxford-comma principle lists drop their final integer.**

The Amendment 3 grammar requires one record per integer in lists joined by `,`, `and`, `&`, or `/`.
The committed regex is

```
/\bprinciples?\s+(\d+(?:\s*(?:,|and|&|\/)\s*\d+)*)/gi
```

which treats the separators as alternatives and so cannot match a comma *followed by* a conjunction.
Verified behavior:

```
"principles 8, 9, 12, 18, and 22"  ->  matched "principles 8, 9, 12, 18"   // 22 dropped
"principles 6 and 25"              ->  [6, 25]                              // correct
"principle 8/18"                   ->  [8, 18]                              // correct
```

Ten in-scope occurrences carry this form, in `DECISIONS.md` (lines 300 and 302), `PROJECT-HISTORY.md`
(1544, 1545), `MAR-TABLE-READABILITY-ARCHITECT-SPEC-2026-07-20.md` (19),
`TERMINAL-SENTENCE-INDEPENDENT-CHECKER-SALVAGE-SPEC-2026-07-22.md` (91), the survey spec itself
(291), `Archive/root-specs-2026-07-18/OPUS-SKELETON-RETIREMENT-CODEX-SPEC-2026-07-18.md` (5), and
`Archive/root-cleanup-2026-07-19/VITALS-TREND-COMPOSITE-READABILITY-ARCHITECT-SPEC-2026-07-18.md`
(20) and `…-PRIORITY-HANDOFF-2026-07-18.md` (35). Five of the dropped integers are principle 22,
which is `LAPSED`, so the pass-2 `LAPSED` queue of 116 is understated. Do not hardcode against this
list — fix the grammar and let the corpus report itself.

**3.2 — `.tsx` paths truncate to `.ts`.**

```
const KNOWN_EXT = "md|ts|tsx|json|ya?ml";
```

Regex alternation is leftmost-first, not longest-match, so `ts` matches before `tsx` is tried:

```
"see src/App.tsx"  ->  ["src/App.ts"]     // src/App.tsx is tracked; src/App.ts does not exist
```

82 records point at the nonexistent `src/App.ts`. This is worse than a miscount: if any stem ever
exists as both `.ts` and `.tsx`, a `.tsx` citation resolves `true` against the wrong file, and the
graph reports a confident wrong target instead of a visible gap. No such collision exists in `src/`
today; that is luck, not a guarantee.

**3.3 — the extension allowlist is not in the contract.**

Spec section 6 says a bare repository path targets that path, resolved against the tracked-path
index (index 4). It authorizes no extension taxonomy. `src/styles.css` is referenced in the in-scope
root `AGENTS.md` at line 46 and was never extracted at all.

**Fix 3.2 and 3.3 together, by removing the extension list rather than extending it.** Recognize
path-like tokens structurally and resolve them against the tracked-path index. The index is the
authority on what is a repository path; a hand-maintained extension list is a second, silently
diverging authority — which is the failure this pass exists to correct.

**3.4 — unqualified basenames and glob fragments extracted as repository paths.**

```
"the gpt-canonical.json bank"      ->  ["gpt-canonical.json"]   // prose mention; file is banks/gpt-canonical.json
"the `banks/*-canonical.json`"     ->  ["-canonical.json"]      // fragment; `*` is outside the token charset
```

A bare *filename* is not a bare *repository path*. 2,338 of the 2,841 missing path records have no
directory component at all; 73 are glob fragments. Together with 3.2 these account for roughly 2,492
of the 2,841 — and spec section 6 requires every unresolved record to be labelled a pre-existing
defect, so pass 2 asserted approximately 2,500 defects that are extraction artifacts.

Decide and document how an unqualified basename is handled: it is not a repository path and it is
not nothing. `ambiguous` with `NOT_APPLICABLE` is the likely correct disposition, since resolving it
to a unique tracked file requires exactly the semantic inference section 6 forbids guessing at — but
state your reading, and if you conclude the contract does not settle it, say so and route it rather
than choosing.

**3.5 — do not fix anything else in extraction without an amendment.**

The `MISSING` reconciliation in section 6 will surface at least two further extraction questions:
external-law citations (`45 CFR § 46.116(b)(8)` — the bare-`§n` rule harvests `46` as a section of
the source file) and decimal subsections. **Classify them; do not silently change the targeting
rules to suppress them.** Report them in `findings.md` as proposed amendments with your recommended
wording. Pass 2's largest defect began as a reasonable-looking unilateral narrowing of a targeting
rule, and the way that does not recur is that targeting changes come from the architect seat.

---

## 4. Classification and table repairs

**4.1 — E047c breaches the ratified taxonomy.** It is classified `X | REVISIT`. Taxonomy section 4
makes `REVISIT` compatible with `T` alone: a revisit queue is a location, not a status, and a
settled or archived entry does not acquire `REVISIT` by sitting inside one. Pass 2 applied this
correctly to E047a and E047b in the same bullet and left E047c inheriting its status from the old
section heading. Re-derive E047c's status from its own wording. Do not change its kind, force, or
destination unless its wording requires it, and say which if so.

**4.2 — E029 is an unnumbered `R`.** Taxonomy section 6 requires a permanent ID on every live entry
and section 7 gives rulings the permanent `R1`, `R2`, … series. The bootstrap permits assigning no
number in exactly one case: where a ruling is undated or its ordering is disputed, in which case the
row **routes to `UNCLEAR_REQUIRES_OWNER`**. Pass 2 assigned no number and did not route it, recording
`*(unnumbered, attached to P25)*` instead. Both available dispositions are acceptable; choose on the
wording and say why:

- it is a concrete ruling, in which case it takes an `R` number in date order — note that its
  2026-07-19 origin would place it ahead of the 2026-07-24 rulings and shift the proposed `R4`/`R5`,
  and if you conclude the ordering is disputed, route it to `UNCLEAR_REQUIRES_OWNER`; or
- it is an application attached to P25 rather than a concrete ruling, in which case it is not `R`
  and takes no number.

**4.3 — E037 takes `MERGE_INTO`.** Amendment 5 defines `MERGE_INTO <target ids>` in spec section 8
with four binding conditions. Restate E037's row against it. `MERGE` as pass 2 wrote it is retired.
Verify condition 4 explicitly: E037 carries two rules, the first returning to principle 8's core
(E039a) and the second attaching to principles 2 and 5. Both must land in a named target row whose
destination is `STAY`, and you must show that in the table rather than assert it in a note.

---

## 5. Deliverable repairs

**5.1 — restore the section 5 evidence fields.** Amendment 5 withdraws the prohibition on
re-derivation. `inventory.md` must carry, per entry, in the file itself: byte length; an estimate of
how much is reproduced evidence, method, measurement, or chronology rather than statement of the
rule; whether it names a forcing incident and where that incident is preserved; the evidence
pointers and executable owners it already carries; and whether any factual claim in it is
contradicted by the executable owner it names — flag only, never correct. "Preserved from pass 1" is
not an acceptable value: those deliverables exist in no tree and no commit.

**5.2 — rewrite the LAPSED queue as two axes.** Pass 2 presented 116 lapsed references as a sort
into three categories and then reported 66 + 0 + 39 category members plus 77 "open owner question"
references — 182 against a population of 116 — because Category 1 (`Archive/`-sourced) cuts across
Category 3 (principle-8) and the 77, which are themselves individually Category 1. Overlapping sets
are not a sort. Present two separate axes, each a genuine partition of the corrected total:

1. **Citation-context disposition** — valid historical citation / stale present-tense authority
   claim / restoration-dependent.
2. **Target-level owner question** — restore a surviving universal core, or archive completely.

Recompute both from the regenerated graph. The corrected total will not be 116.

---

## 6. Verification before handoff

Run every item in spec section 10 as amended, items 1 through 9, and report each result. Items 8 and
9 are new and are the ones this pass exists to satisfy:

- **Item 8, extended negative control.** A throwaway fixture outside the corpus, covering an
  Oxford-comma principle list, a `.tsx` path, a tracked `.css` path, a same-stem `.ts`/`.tsx` pair,
  an unqualified basename whose file exists under a directory, a glob, a relative path, and a
  `<path> §n` reference — plus the item 6 controls (dangling principle number, dangling section
  number, dangling anchor, and a `LAPSED` reference carrying `resolves: true`). Report the fixture,
  the records it produced, and its deletion. A clean corpus is not evidence that a tripwire fires.
- **Item 9, `MISSING`-class reconciliation.** Generator-assigned, deterministic, one class per
  record, per-class totals in `counts`. `other` is a finding: name every record in it.

Item 5 is the full pull-request gate step list, unmodified and complete, including `npm ci`, run in
the live branch checkout and never in the detached measurement worktree. Run it, or report it as
skipped — do not report a complete gate run either way round.

Item 7's allowlist is now **six paths** over `$CORRECTION_HEAD..HEAD`: the five deliverables and
`scripts/decisions-reference-graph.ts`. `package.json` is **not** in the range — its single
`survey:decisions-refs` line landed in pass 2 and sits below `CORRECTION_HEAD`, so item 4 must show
no change to it rather than the `1\t0` pass 2 reported. The Amendment-5 spec and this work order are
also below `CORRECTION_HEAD` by the section 2 ordering and must not appear in that range.

---

## 7. Non-goals (binding)

Spec section 9 applies unchanged and in full. Restated because it is the boundary this pass is most
likely to cross while fixing things:

1. Do not edit, move, reorder, retitle, renumber, compress, or delete anything in `DECISIONS.md`.
2. Do not edit `CLAUDE.md`, `AGENTS.md`, `PROJECT-HISTORY.md`, `NCLEX-Question-Schema.md`, or any
   file under `Archive/` — including to repair a citation this pass proves is broken. Flag it.
3. Do not change any entry's status tag in `DECISIONS.md`, or correct any stale factual claim.
4. Do not create the archive destination file or move content toward it.
5. Do not modify `package.json` beyond the single existing `survey:decisions-refs` line.
6. Do not touch `.github/workflows/`, any bank, schema, renderer, or runtime file.
7. Do not write the phase-2 spec or propose the compressed wording of any entry.
8. Do not amend the spec or the taxonomy. Both are architect-seat documents. Propose; do not edit.
9. Do not merge, and do not open a second pull request.

---

## 8. Handoff

Return with: `CORRECTION_HEAD`, the section 6 verification results, the `MISSING`-class table,
the reconciliation of the two governance files' actual graph contribution against the expected
figures in spec section 6,
the count deltas against pass 2 with causes attributed, and any row you routed to
`UNCLEAR_REQUIRES_OWNER`. The owner then reads `migration-table.md` and `findings.md` and ratifies
the map, including every force change individually. Nothing in this document authorizes a change to
`DECISIONS.md`.
