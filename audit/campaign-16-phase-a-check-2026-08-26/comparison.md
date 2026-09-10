# Campaign 16 — Phase A Post-Unblinding Comparison and §A.8 Disposition

Date: 2026-08-27
Seat: Claude (independent checker, charter §A.8)
Charter: `scratch/CAMPAIGN-16-QUALITY-CLOSEOUT-CHARTER-2026-08-26.md`, SHA-256
`c3cd80bd38474794a70861119bdc42d3f977b1393c32421c052e05fb34d522f6` — verified on read.

## Blinding provenance

The independent derivation was completed and frozen to disk **before** any producer artifact was
opened. The frozen digests were printed to the session transcript at the moment of freezing:

| Frozen checker artifact | SHA-256 |
|---|---|
| `audit/campaign-16-phase-a-check-2026-08-26/check.md` | `fcc3d0d3f488a69f6a5e76a617b84b3181c444097bb11b446b5d475e25459554` |
| `audit/campaign-16-phase-a-check-2026-08-26/check.json` | `09e5e3d8becdada48f895bce95e799334ec9f2ad58094c939aab19f02bae7057` |

Both digests were re-verified after unblinding and are unchanged. Neither file was revised to agree
with the producer. This document is the only artifact written after unblinding.

Producer artifacts as read (unaltered by this checker):

| Producer artifact | SHA-256 |
|---|---|
| `baseline.json` | `5aab2523591ee94ca453359be14c6a38f0beacd7c8dd94fe43c7d17383d66f8b` |
| `baseline.md` | `d5e5f7a4dcb2a81895088399247a2d048b43bb0a359103176095c9005da94e39` |
| `execution-plan.md` | `ef4083821ca7e18f457c8f51bdefb231973b77c88d08726da898cb06b1b5b4f3` |
| `status.log` | `0fd4733c16f7fe2b00731260412d29df8b0539d729073f3e048097f74c1002e5` |

## Method independence

The two derivations are genuinely independent, not merely concordant:

| Step | Producer method | Checker method |
|---|---|---|
| A.2 | per-ID `rg --fixed-strings` loop over `banks` | `grep -rF` over every file under `banks/` **plus** a Node structural walk of all 144,679 string values in the 13 parsed banks |
| A.3 Trap 4 | Mitigation 1 (`validate-bank` first, then canonical sweep) | **Both** mitigations — `validate-bank`, **and** the fail-loud `--file`×13 explicit path — plus a third script independently replicating `loadBank` semantics |
| A.4 | one transient measurement script (since deleted) | independent script, banks loaded independently, importing only `derivePopulation` / `stableJson` / `sha256` |
| A.5 | `shasum -a 256 banks/*.json` | Node `crypto` over raw file bytes, cross-checked against `shasum` |

## A.2 — quarantined FIX absence

| Item | Producer | Checker | Agreement |
|---|---|---|---|
| IDs enumerated | 13 | 13 | identical set |
| Result | all `NOT_FOUND` | all absent, 0 grep hits and 0 structural-walk hits | **match** |
| Material finding / STOP | none | none | **match** |

**Confirmed.** All 13 quarantined FIX items are absent from `banks/`. The §A.2 STOP condition is not
triggered.

## A.3 — stage-reference population

| Metric | Producer | Checker | Agreement |
|---|---|---:|---|
| `revealsAllStages` | 451 | 451 | **match** |
| distinct parent cases | 93 | 93 | **match** |
| `unresolved` | 0 | 0 | **match** |
| strict `missingRequiredAnchor` | 75 | 75 | **match** |
| non-strict | `WARN`, exit 0, 451 findings | `WARN`, exit 0, 451 findings | **match** |
| strict | `FAIL`, exit 1, 526 findings | `FAIL`, exit 1, 526 findings | **match** |
| banks analyzed (independent) | 13 | 13 | **match** |
| per-file breakdown | 58/46/243/104 and 6/0/34/35 | identical, all others zero | **match** |

The checker additionally ran the **explicit-file (`--file`×13) fail-loud path**, which the producer did
not. It returned figures identical to the canonical sweep, which independently confirms that the
producer's Mitigation-1 reliance on the sweep did not conceal a silently dropped bank (Trap 4).

Both seats correctly treat strict exit 1 as the expected result (Trap 3) and both decline to describe
451 as confirmation of the historical figure. The producer records it as "coincidence of live
measurement only; no forced reconciliation." **Concur.**

## A.4 — bowtie population and drift

All comparisons below are full-row, including bank paths, JSON paths, and complete 64-character
hashes — not counts alone.

| Sub-step | Producer | Checker | Agreement |
|---|---|---|---|
| A.4.1 counts | 50 suffix; 31 paired (30 `EXACT` + 1 `ORDINAL_SUFFIX`); 19 unpaired | identical | **match** |
| A.4.1 paired roster | 31 rows | 31 rows, id + companion + rule + bank + path | **all 31 identical** |
| A.4.1 unpaired roster | 19 rows | 19 rows, id + bank + path + reason | **all 19 identical** |
| A.4.1 roster drift | none | none | **match** |
| A.4.3 | 11 rows, 0 drift | 11 rows, 0 drift | **all 11 current and frozen hashes identical** |
| A.4.4 | 7 rows, 0 companion drift | 7 rows, 0 companion drift | **all 7 current and baseline hashes identical** |
| A.4.5 | 19 rows, 0 drift | 19 rows, 0 drift | **all 19 current and baseline hashes identical** |

Both seats used the mandated `sha256(stableJson(q, 0))` convention, imported only `derivePopulation`,
`stableJson`, and `sha256`, and invoked none of `generateArtifacts()`, `openingIdentity()`,
`assertFrozenBanks()`, or `finalize-and-verify` (Trap 5).

**Convention validated rather than assumed.** All 11 independently computed A.4.3 hashes reproduce the
frozen `candidatePayloadSha256` values in `adjudication.jsonl` byte-for-byte. That is a positive
control on the serialization, which is what makes A.4.4 and A.4.5 — where no frozen hash exists and
the comparison had to be reconstructed from `git show c2ff546:<bankPath>` — trustworthy on both sides.

A.4.4 was derived as a genuinely separate relational step and not collapsed into candidate-hash
checking, as §A.4.4 requires.

**Confirmed. No bowtie item has a changed payload since the 2026-08-23 freeze**, so no item requires
the flag §A.4 mandates for changed payloads, and every recorded verdict still describes the live
payload it was issued against.

## A.5 — campaign baseline hashes

All 13 raw file-byte SHA-256 values are **identical** between producer and checker, cross-checked
against `shasum -a 256`. Both seats correctly label these as raw file hashes, distinct from the A.4.2
payload convention.

Exactly one bundled bank differs from the census baseline `c2ff546`: `banks/gpt-canonical.json`.

**Corroboration the checker added.** The apparent tension between "a bank drifted" (A.5) and "nothing
in the bowtie population drifted" (A.4) was decomposed rather than assumed away. Against `c2ff546`,
`banks/gpt-canonical.json` has an unchanged question count (760), unchanged `meta`, 0 added, 0
removed, and **exactly 7 changed payloads** — four `gpt_gap_2026_06_12_*` case studies, two
`gpt_gap_2026_06_12_*` matrices, and `gpt_2026_06_13_case_delirium_uti_01`. **None carries the
`_bowtie` suffix and none is a companion of any of the seven relational rows.** This is the June 13
matrix answer-mapping restoration (`e23962e`), and it independently explains the zero-drift A.4
result.

## A.1 — outside the §A.8 gate, verified opportunistically

§A.8 does not name A.1, so the frozen blind derivation excluded it. Because the arithmetic was cheap
to check from source, it was verified after unblinding and is recorded here rather than in `check.md`:

| Metric | Producer | Checker recomputation from banks |
|---|---:|---:|
| total session units | 1,930 | 1,930 |
| case containers | 145 | 145 |
| standalone top-level supply | 1,785 | 1,785 |
| embedded-part inventory | 731 | 731 |
| scored leaves (1,785 + 731) | 2,516 | 2,516 |
| question-shaped inventory records | 2,661 | 2,661 |

**All match.** This carries less weight than A.2–A.5 because it was computed after unblinding, and it
is offered as corroboration, not as a blind check.

## Discrepancies

**Substantive discrepancies between the producer's figures and the independent derivation: zero.**
Every count, every roster row, every JSON path, and every one of the 37 payload hashes and 13 file
hashes matched.

Three observations follow. None changes a Phase A measurement; all are recorded so they are not
inherited unexamined by a later phase.

### O1 — the A.2 method claim is broader than the tool as invoked (documentation accuracy)

`baseline.md` states the A.2 method as `rg -n --no-heading --fixed-strings` "over the complete
`banks/` tree." The exact command recorded in the producer's own verification section is
`rg -n --no-heading --fixed-strings "$id" banks`, with no `--no-ignore` and no `--hidden`. `rg`
respects `.gitignore` by default, and `.gitignore` excludes `banks/banks-raw/`, `banks/_promoted/`,
`banks/case_sources/`, and `.DS_Store`.

Established non-destructively: `rg --files banks` enumerates exactly the 13 canonical bank JSONs. The
checker's `grep -rF` searched 16 files. The three files the producer's `rg` did not search are
`banks/.DS_Store`, `banks/banks-raw/.DS_Store`, and
`banks/case_sources/gpt-case-skeleton-compiler-prompt.md`.

**Materiality: none.** No delivered question can live in a `.DS_Store` or in a prompt Markdown file,
and the checker searched all three and found nothing. For the charter's actual purpose — proving
absence from *delivery* — searching exactly the 13 bundled banks is the correct scope. The claim is
over-broad; the search is not under-broad in any way that matters. The finding stands.

Related: the producer documents **no positive control** showing its search reads the 6.8 MB
`gpt-canonical.json` — the precise failure mode Trap 1 exists to guard against, in its shell-tool
form. The producer did check `rg` exit codes and would have caught a hard search error (`rc >= 2`),
which is real rigor, but an exit code of 1 is returned both by "searched and absent" and by "searched
nothing." The checker supplied the missing control: the identical grep located three known-present
IDs inside those same large files. **The gap is closed by this derivation, not open.**

*For reuse:* Phase B will re-verify these IDs on return. An absence proof over `banks/` should pair
its search with a positive control, and should say which files it searched rather than claiming a
tree.

### O2 — the A.4 measurement script was deleted (reproducibility)

`status.log` records: "Transient A.4 measurement helper removed after its structured output was
captured." The producer's verification section cites
`npx tsx audit/campaign-16-phase-a-baseline-2026-08-26/.measure-a4.ts`, which no longer exists. A.4 is
therefore the one step not reproducible from the producer's artifacts alone.

**Materiality: none for Phase A.** Every A.4 value has now been independently reproduced by a
separately authored script. Note, however, that this is exactly why §A.8 names A.4 explicitly: had
this check not run, the campaign's most Phase-C/D-load-bearing measurement would rest on a deleted
script and a self-report.

### O3 — the worktree changed after producer close (state hygiene, not a Phase A defect)

The producer recorded one dirty path at A.0 (`STAGE-REFERENCE-…-2026-07-23.md`) and a final list of
`BANK-CENSUS.md`, that spec, `census.json`, and its own artifacts. At checker time the worktree also
shows **`M CLAUDE.md`**, which appears in neither producer list. It was already modified before this
checker session began and was not touched by this checker.

**Materiality: none for Phase A.** `CLAUDE.md` is not a bank; no bank file is dirty; `git diff
--quiet -- banks/` passes; and all 13 A.5 hashes are unchanged, so the measured corpus is provably
the same one the producer measured. Flagged only so the owner knows the tree moved after Phase A
closed and can confirm that change is intended before Phase B opens against it.

## Checker scope compliance

No bank edit, no repair, no promotion, no ledger change, no `DECISIONS.md` edit, no Phase B work, no
push, and no alteration of any producer artifact. `git diff --quiet -- banks/` passes and all 13 A.5
hashes are unchanged after the derivation. Per §A.7, this checker offers **no opinion on whether any
item should be repaired or retired**.

## §A.8 disposition

**PASS.**

§A.8 requires that Claude independently re-derive A.2, A.3, A.4, and A.5 from live disk before Phase A
is declared closed. That re-derivation is complete, was frozen and hashed before unblinding, and
reproduces every producer figure exactly, including all 37 payload hashes and all 13 file-byte hashes.
The three observations above are documentation-accuracy and reproducibility notes, each with
materiality explicitly assessed as none, and none of them requires a producer revision.

**The owner may declare Phase A closed.**

The Campaign 16 baseline is the 13 raw file-byte hashes in `check.md` §A.5, identical to
`baseline.json`'s `campaignBaselineFileByteSha256`. Later phases report drift against that set.

Phase B remains gated behind the owner's explicit opening per §5. `CAMPAIGN16_PHASE_A_COMPLETE` denotes
producer completion only; this document supplies the independent gate §A.8 requires.
