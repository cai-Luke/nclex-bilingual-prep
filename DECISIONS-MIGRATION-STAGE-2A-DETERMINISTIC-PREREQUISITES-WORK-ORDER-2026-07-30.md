# Stage 2a Deterministic Prerequisites — Implementer Work Order (rev 2)

**Date:** 2026-07-30 · **Author:** Architect seat · **Producer:** one shell-capable, local-disk-reading seat
(Codex or Claude Code) · **Authority:** `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md` as amended by
`DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md` (RATIFIED 2026-07-30, both clauses and both
architect additions confirmed)

**Status:** authorized to run. Rev 2 applies seven owner preflight revisions; rev 1 is superseded and must
not be executed. Rev 1's repository-state check was impossible to satisfy and its sentence-count rationale
was backwards.

This work order is closed-world. Every path, command, boundary, and acceptance condition is restated inline.
Do not appeal to chat context, prior sessions, or any draft not named here.

---

## 0. Execution snapshot — verify first, stop on mismatch

**Mechanism:** local disk-reading seat only. Do not perform this work through a GitHub API view of the
repository; the artifacts this task measures are untracked and are not visible that way.

| pin | expected |
|---|---|
| Repository | `Project Shrimp` |
| Branch | `codex/decisions-migration` |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| `MIGRATION_BASELINE` | `d499cc1d0916e03830489ec9cd0324cd1a203a73` |
| Baseline `DECISIONS.md` byte length | `76314` |
| Baseline `DECISIONS.md` SHA-256 | `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` |

Print each as measured. **A branch or HEAD mismatch is a hard stop.** A baseline length or SHA-256 mismatch
is a hard stop. Resolve the full `MIGRATION_BASELINE` SHA from disk before first use; never substitute the
branch head.

---

## 1. Scope and prohibitions

**This is a read-and-measure pass. It produces numbers and one appendix. It changes no governed text.**

Authorized writes, and nothing else:

1. **create** `DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md`;
2. **append to** `DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md` — append only, existing
   bytes untouched, proven per §2.3.

You may **not**:

- edit `DECISIONS.md`, anything under `Archive/`, `lib/decisions-format.ts`, or any file under `scripts/`;
- create, edit, or begin `audit/decisions-migration-2026-07-29/target-text-manifest.md`;
- create `Archive/DECISIONS-ARCHIVE-*.md` or `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md`;
- remove the name-addressed `Original Kind: P/R` parser guard — that is Stage 2b;
- stage, commit, push, or open a pull request;
- choose, infer, or default a migration date;
- edit any of the other 22 untracked Stage 2a files, all of which are preserved working state;
- correct, improve, or comment on any statement wording. If a statement looks wrong, report it as a finding
  and change nothing.

Producer≠checker: the seat running this work order does not review the assembled manifest.

### 1.1 Concurrency

The three tasks may **measure** in parallel. They may **not write** concurrently. If you fan out to
subagents, each returns measurements only; **one coordinator alone** writes the aggregate results file and
appends the accepted E038 appendix. No subagent touches either authorized path.

---

## 2. Repository-state proof

Rev 1 required pre- and post-run `git status --porcelain` to show only two changed files. That was
impossible: this branch carries a large set of preserved untracked Stage 2a artifacts by design. Replaced
with an inventory-and-equality proof.

### 2.1 Pre-run

Record `git status --porcelain` verbatim. For **every** pre-existing untracked file it lists, record path,
byte length, and SHA-256. Do not hand-transcribe a count from this work order — enumerate what is actually
there.

At preflight the branch carried 24 untracked files and no tracked, staged, or deleted change. That figure is
orientation, not an assertion: a differing count is not itself a stop, since the set legitimately grows as
governance drafts land.

### 2.2 Post-run

Require all four:

1. every pre-existing untracked file is **byte-identical** to its pre-run length and SHA-256, with the sole
   exception of `DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md`;
2. `DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md` is the **only new
   path**;
3. **no tracked file is modified, staged, or deleted**, and nothing is staged at all;
4. no unrelated path appears.

Any failure is a hard stop, reported with the offending path and both hashes.

### 2.3 Append-only proof for the hash packet

The packet is untracked, so `git diff` proves nothing about it. Prove append-only directly:

1. before writing, record the packet's original byte length `L` and SHA-256;
2. after writing, take the first `L` bytes of the file and assert they are **byte-identical** to the
   original bytes, by hash;
3. assert the suffix beyond byte `L` contains only the E038 appendix and nothing else;
4. report `L`, both hashes, and the suffix byte length.

Do not renumber, reorder, reflow, or restate the thirteen existing spans.

---

## 3. Task 1 — E038 preservation-slice hash

### 3.1 What to measure

Source: `git show MIGRATION_BASELINE:DECISIONS.md`, treated as **bytes**, not as decoded text.

Slice: `[52641,53203)` — zero-based, half-open, byte offsets, the same convention as the thirteen wrapper
spans already in the packet.

### 3.2 What to report

1. byte length, and whether it equals `562`;
2. SHA-256 of exactly those bytes;
3. whether the final byte is `0x0a`, and whether that matches the expected `yes`;
4. the exact first 80 and last 80 decoded characters, in the format the packet already uses.

**Decode the measured slice using strict/fatal UTF-8.** A decoding failure is a hard stop: report it and
change nothing. Do not substitute U+FFFD replacement characters, do not fall back to a lenient decoder, and
do not decode byte-by-byte to route around it. The hash and length in items 1–2 are computed over raw bytes
and do not depend on decoding; decoding is required only for item 4, and a failure there means the pinned
boundary cuts a multi-byte character — an architect defect to return, not a reporting inconvenience.

### 3.3 Acceptance

Length `562` and final byte `0x0a`. The SHA-256 is an **output**, not an assertion — the architect seat has
not authored it and must not be handed a value to confirm.

**If the length is not 562, or the final byte is not `0x0a`, stop and report.** Do not adjust the offsets to
make the assertion pass. A boundary that does not land where the architect pinned it is a spec defect to
return, not an off-by-one to absorb.

### 3.4 Where it goes

A clearly separated appendix at the end of
`DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md`, titled for the E038 preservation slice and
matching the existing per-span row format. Subject to §2.3.

---

## 4. Task 2 — sentence counts over the 65 target statements

### 4.1 The authoritative counter

`countStatementSentences` in `lib/decisions-format.ts`, as it sits on disk. Import and call the real
function. Do not reimplement it, do not approximate it, do not count by eye. If it is not exported, obtain
it by the smallest possible mechanical means **without editing the file**, and state in the results how you
obtained it.

### 4.2 Extraction boundaries — pinned

| source | span |
|---|---|
| `DECISIONS-MIGRATION-STAGE-2A-PART-A-ARCHITECT-DRAFT-2026-07-29.md` | from `## 1. Candidate body text` through the last line immediately before `## 2` |
| `DECISIONS-MIGRATION-STAGE-2A-PART-B-ARCHITECT-DRAFT-2026-07-29.md` | from `## 1. Candidate body text` through the last line immediately before `## 2` |
| `DECISIONS-MIGRATION-STAGE-2A-PART-C-ARCHITECT-DRAFT-2026-07-29.md` | from `## 1. Target §5 — concrete rulings` through the last line immediately before `## 4. Candidate entry-index rows (Part C fragment of target §3)` — i.e. target-body §§1–3 |

Expected block yield: Part A 18, Part B 19, Part C 28.

**One override, with an exact boundary.** The block titled `Producer assignments are operational state,
not constitutional text` takes its statement from
`DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md` §1.2, **not** from Part C. Part C's
wording for that block is superseded.

The override span is **every nonblank physical line strictly between the opening and closing fence of the
first fenced code block following §1.2's `**Statement repaired.**` paragraph.** Fence delimiters, the fence
info string, and all surrounding explanatory prose are excluded. Assert all three of:

1. the first extracted line begins `Current producer assignments are operational state`;
2. the last extracted line ends `independent-review obligations.`;
3. **the extracted nonblank line count is exactly 3.**

Then trim each line and join with one U+0020 space per §4.3.

**Assertion 3 is not redundant, and it is the one that matters.** The block is three physical lines. An
earlier draft of this work order described it as two, and extracting only the first two lines yields a
statement truncated mid-clause at `does not alter permanent`, which the counter scores as **1 sentence rather
than the correct statement’s 2**. Both values fall within the legal 1–3 range, so §4.5 would accept the
truncated statement silently. If any of the three assertions fails, **stop and report**; do not adjust the
boundary to make an assertion pass.

18 + 19 + 28 = 65. **If you cannot extract exactly 65 statements, stop and report the discrepancy rather
than reconciling it.** Extraction ambiguity is a finding, not something to resolve by judgment.

### 4.3 Normalization — must match the parser exactly

`statementAndFieldStart` takes the physical lines after the heading up to the first blank line, **trims each
line**, and **joins them with a single U+0020 space**. Reproduce that exactly before calling
`countStatementSentences`. Do not preserve newlines, do not collapse internal whitespace beyond the trim,
and do not strip Markdown. A string that differs from the parser's by one character is a different
measurement.

### 4.4 What to report

**The target population: exactly 65 results, one per block**, keyed by block key — `P1#0`, `P2#0`, `P2#1`,
… for identifier-addressed blocks, and by exact title for name-addressed ones. This is the whole live
population; nothing else enters it.

**Separately, and explicitly labelled a control, not a row:** the superseded Part C wording for the
`Producer assignments…` block, reported beside the Part D §1.2 wording so the repair's effect on the count
is visible.

Also report the distribution across counts, and every block whose count is not in `{1,2,3}`.

### 4.5 Acceptance

Every one of the 65 counts is 1, 2, or 3. **Any count of 0 or ≥4 is a hard stop: report it and change
nothing.** Do not repair a statement to make it pass. A four-sentence statement is an architect defect to
return.

### 4.6 What you are actually guarding against — corrected

Rev 1 said hand counting "under-counts" the lowercase-start construction. That was backwards. Both
directions matter and both must be reported:

- **Parser lower than the hand count.** The parser does not treat a period followed by a lowercase or
  backticked-lowercase token as a sentence boundary, so a human reading that as two sentences **overstates**
  the parser's count. A statement the architect called three may parse as two or one. That is *legal* under
  the 1–3 grammar, so it is not a stop — but it means the architect's intended boundaries are not the ones
  the parser sees, so **report every block where your count differs from three whenever the draft asserted
  three**.
- **Parser higher than the hand count.** This is the hard-stop direction. It arises where the parser splits
  where a human did not: abbreviations, initials, or a period followed by a capitalized token a human read
  as mid-sentence. Any count ≥4 lands here.

All 65 were hand-counted. This task exists to catch a manifest defect before ratification rather than after
Stage 2b begins.

---

## 5. Task 3 — existence and trackedness verification

### 5.1 Authoritative population

`DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md` **§10.1**, the per-block
optional-field ledger, is the authoritative list of which blocks carry a present `Evidence` or `Owner`.
Read the values themselves from Parts A–D, but take **presence** from §10.1 only.

Two corrections §10.1 already encodes, stated here so a producer reading Parts A–C alone does not check a
field that no longer exists:

- **`R2#0` has no `Owner`.** The `src/measurementUnitPolicy.ts` candidate was struck. Do not check it.
- **`Producer assignments are operational state, not constitutional text` has no `Owner`.** It carries the
  single exempt future-output `Evidence` per §5.2 below.

### 5.2 The one exception

That block's `Evidence` points at the normalized migration archive, which does not exist yet by
construction. Under Amendment 1 Clause A this single path is exempt from Stage 2a existence-and-trackedness
checking, in all three places the commission imposes it (§2.2 hard stop, §4.6 item 2, §4.9 reviewer
obligation).

**Report it as `EXEMPT — Amendment 1 Clause A`. Do not create the file, do not stage it, and do not
`git add --intent-to-add` it.** Fabricating trackedness is explicitly forbidden. There is no second
exemption.

### 5.3 Mechanical dispositions

Check both existence and trackedness so the three outcomes are distinct, not conflated:

| disposition | mechanical definition |
|---|---|
| `TRACKED` | present on disk **and** appears in `git ls-files` |
| `UNTRACKED` | present on disk **and** absent from `git ls-files` |
| `MISSING` | absent from disk (trackedness not evaluated) |
| `EXEMPT` | the single path named in §5.2 |

### 5.4 What to report

A table of every present `Evidence`/`Owner` value with its owning block key, the field, the literal value,
and its disposition.

### 5.5 Acceptance

Every path `TRACKED`, except the one `EXEMPT`. Any `UNTRACKED` or `MISSING` is a hard stop under commission
§2.2 — report it and change nothing. Existence on disk was already confirmed by the architect seat on
2026-07-29; trackedness is what this task establishes, and that seat cannot.

---

## 6. Results file

Create `DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md` containing:

1. the §0 execution-snapshot pins as measured, each with pass/fail;
2. the §2.1 pre-run inventory, and the §2.2 post-run proof with all four conditions;
3. the §2.3 append-only proof;
4. Task 1 output per §3.2, with its acceptance disposition;
5. Task 2 output per §4.4, with its acceptance disposition, including the differs-from-three report of §4.6;
6. Task 3 output per §5.4, with its acceptance disposition;
7. every command run, **verbatim**, so the architect seat can re-derive rather than trust;
8. an overall disposition: `GREEN` only if §§3.3, 4.5, and 5.5 all hold and every §2 condition holds.

A null or zero result discharges feasibility only, never correctness: report what you ran, not just what you
concluded.

---

## 7. What happens next, so you do not do it

On `GREEN`, the owner binds `MIGRATION_DATE` and the architect seat assembles the manifest. **Do not bind a
date. Do not begin assembly. Do not start Stage 2b. Do not commit.** Return the results file and stop.

On any hard stop, return the results file with the failing task's evidence and stop. A stop is a successful
control, not a partial failure — do not make the obvious choice and continue.
