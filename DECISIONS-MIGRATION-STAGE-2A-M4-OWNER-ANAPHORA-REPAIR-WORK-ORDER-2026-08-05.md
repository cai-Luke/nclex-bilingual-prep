# Stage 2a — M4 `Owner` anaphora repair work order

**Date:** 2026-08-05 · **Authoring seat:** Architect · **Revision:** 3

**Class: review return.** This order is not a continuation of
`DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-VERIFICATION-CODEX-WORK-ORDER-2026-08-04.md` revision 4 or of
`DECISIONS-MIGRATION-STAGE-2A-M6-REPAIR-COMPLETION-CODEX-WORK-ORDER-2026-08-04.md`. Architect editing
under both of those orders is closed and stays closed. Every edit authorized below is authorized by
**this** order and by no other, under a fresh authorization identity recorded at §1.3 before the first
repair edit.

**Origin.** Codex's deterministic verification
(`audit/decisions-migration-2026-07-29/M6-REPAIR-VERIFICATION-2026-08-04.md`) returned 0 BLOCKER,
0 REQUIRED REPAIR, 3 ADVISORY and is accepted as complete within its commissioned scope. The GPT
confirming read returned **REVISE, narrowly**: one defect class, three records. Everything else in the
confirming-read scope cleared — the remaining twelve repaired `Evidence` dispositions, the nineteen-record
exclusion triage, M6's repaired doctrine and counts, the two numeric prose corrections, and resume-note
rulings 33 and 34.

---

## 0. Revision history

**Revision 1 — 2026-08-05, superseded, never hashed, never executed.** Three owner-returned defects, all
accepted: it certified `M4.4` / `P2#1`'s `same reason` inheritance as sound on the merits while
simultaneously requiring every disposition to state its ground in its own terms, which are incompatible
positions; its V5 compared item-10 backticked path mentions rather than the governed field-path
population; and its `M4.3` acceptance test admitted enforcement *"or by no tracked path,"* which is the
separate `NO-EXECUTABLE-OWNER` ground.

**Revision 2 — 2026-08-05, superseded, never hashed, never executed. Measured at `30630` bytes; no
SHA-256 was taken and none may be inferred.** Two further defects, both accepted:

1. **V10 over-adjudicated `M4.4`.** Its wording — reported *"as expected-present, not as a defect"* — is
   broader than §3.3's reservation and reads as the negative merits ruling §3.3 deliberately withholds.
   Corrected at §9.
2. **The §5.4 failure path was not executable.** §5.4 required the feasibility outcome recorded whether it
   passed or failed and §11 stopped execution on failure, but §8 defined only a success-shaped repair
   report whose surfaces do not exist after a pre-edit stop. Resolved by running the gate before freezing
   the order rather than by adding a branch: the gate passed, and the unused branch is eliminated. See
   §5.4.

**Revision 3 — this revision.** Carries the V10 correction, the completed `M4.3` feasibility gate as a
recorded pre-freeze finding, and the removal of the failure branch. **A prior architect statement that
revision 3 had been written to disk was made before the write was issued and was wrong**; the correction
is recorded here rather than only in chat, because a claimed write is exactly the class of self-report
this governance treats as discharging nothing until read back from disk.

Four calls confirmed across revisions and unchanged: ruling 35 is new rather than an edit to ruling 33;
semantic agreement between M4 prose and M6 classification belongs to the confirming read rather than to
deterministic verification; the substring-boundary analysis at §4 is correct and load-bearing; and
`M4.3`'s classification was not reversed — the prior `Evidence` repair orphaned an `Owner` reason whose
merits its neighbour had been carrying.

---

## 1. Identity, authorization, and the bar on editing

### 1.1 Repository state, pinned

| item | value |
|---|---|
| Repository | `Project Shrimp`, local worktree |
| Branch | `codex/decisions-migration` |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| `MIGRATION_BASELINE` | `d499cc1d0916e03830489ec9cd0324cd1a203a73` |
| `DECISIONS.md` | `76314` / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`, byte-identical to baseline |

### 1.2 Pre-repair artifact identities, pinned

Both values below are Codex measurements taken at
`audit/decisions-migration-2026-07-29/M6-REPAIR-VERIFICATION-2026-08-04.md` and are re-measured as the
first act of execution, not assumed.

| path | bytes | physical lines | SHA-256 |
|---|---:|---:|---|
| `audit/decisions-migration-2026-07-29/target-text-manifest.md` | `313733` | `5935` | `bc01e0be8d4ed291e0fe1ab21ccae088ff96be08a5ab50f129c1b5fcb771c264` |
| `DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md` | `59782` | `851` | `7395262c1772a945957a1f1d735af1dd1f9335c970400a2f6bb6c2099778f18d` |

The three existing `.frozen` snapshots stay untouched at `312411`, `308092`, and `55424`. Literal
`2026-08-11` count in the manifest at this state: `63`. Exactly one `@@ASSEMBLY_CURSOR@@`, terminal.

### 1.3 The authorization identity — recorded before the first repair edit

The architect seat has no hashing primitive. **No repair edit authorized by this order may be made until
a seat that can hash has returned this file's byte length and SHA-256 at revision 3 and those values are
transcribed into the repair report's §1.** A digest this seat produced, inferred, or copied forward would
satisfy the form of this section and prove nothing.

**Revisions 1 and 2 carry no identity and must not be hashed or executed.** Revision 2's measured `30630`
bytes are stale and are recorded at §0 only as the identity of a superseded draft.

The same identity is re-measured after the last repair edit. Opening and closing values must be equal;
inequality is a BLOCKER, because it means the instrument governing the edits is not the instrument
verified against them. This is the two-hash rule as applied at revision 4 §1.2 and discharged at
`M6-REPAIR-REPORT-2026-08-04.md` §9.

**This order is immutable from the moment its revision-3 identity is taken.** A defect found after that
point is repaired by an amended order carrying a new identity, never by editing these bytes mid-execution.

---

## 2. The defect

The repair applied on 2026-08-04 replaced the item-10 `Evidence` prose at fifteen records. At `M4.3`,
`M4.7`, and `M4.11` that prose is immediately followed by an `Owner` disposition reading
`` `Owner` — `OMIT`; same reason. ``

The `Owner` bytes did not move, and the revision-4 byte allowlist correctly reported them unchanged.
But `same reason` is an anaphor whose referent is the `Evidence` clause immediately before it, and that
clause was replaced. Each `Owner` disposition now inherits an `Evidence`-specific ground that does not
support its `Owner` classification at M6.3:

| record | block | current antecedent, in substance | M6.3 `Owner` ground | why the inheritance fails |
|---|---|---|---|---|
| `M4.3` | `P2#0` | no `Evidence` candidate was proposed | `NO-SINGLE-OWNER` | the absence of a proposed candidate is not a reason that no single path owns the whole statement |
| `M4.7` | `P5#0` | `BANK-REVIEW-LEDGER.md` is an operational record rather than an evidentiary source | `NOT-AN-AUTHORITY, PARTIAL-OWNERSHIP` | the antecedent carries the authority limb but states no partial-ownership limb; the statement reaches beyond what the ledger or the promotion machinery owns |
| `M4.11` | `P8#0` | the evidentiary material survives only in archived text | `NO-SINGLE-OWNER` | archive-only evidence does not establish that the cross-seat authoring contract lacks a singular live owner |

**This is standing ruling 33's defect reached through shared prose rather than through a shared register
row.** Ruling 33 repaired the vocabulary so that a register row can never serve two fields with different
tests. It did not reach the case where two dispositions share one *sentence*. §6 closes that.

**Note on `M4.3` specifically, because it changes how the defect should be read.** The pre-repair
`Evidence` prose at `M4.3` read that the rule spans governance practice across every seat and no single
tracked path supports the complete statement — which is an `Owner`-shaped reason, and is closer to the
reason the `Owner` field needs than to an `Evidence` ground. The 2026-08-04 repair correctly moved that
field to a true `Evidence` ground and in doing so orphaned the `Owner`. **The `Owner` disposition was not
reversed and no classification is being revisited here; its stated ground was carried by a neighbour that
has since moved.** All three dispositions remain `OMIT`.

---

## 3. Scope — exactly what is open

### 3.1 Open

Exactly three substrings, one per record, each being the item-10 `Owner` disposition:

1. `M4.3` / `P2#0`
2. `M4.7` / `P5#0`
3. `M4.11` / `P8#0`

Plus the four resume-note surfaces at §7 and the repair report at §8.

### 3.2 Closed — every other byte

Immutable under this order, and a change to any of them is a BLOCKER:

- **All fifteen repaired `Evidence` dispositions**, byte-for-byte, including the three at `M4.3`, `M4.7`,
  and `M4.11` that sit immediately before an opened substring.
- Every other byte of `M4.3`, `M4.7`, and `M4.11` — items 1–9, 11–14, and the remainder of item 10.
- All sixty-two other M4 records, `M4.4` included.
- **All of M6**, including §M6.1's ground table, §M6.3's 110 rows, §M6.4's governed field-path population,
  §M6.7, and §M6.10's counts.
- M0–M3, M5, and `## M7.` to end of file.
- The three `.frozen` snapshots.
- `DECISIONS.md`, which is not touched at any point in Stage 2a.
- Every prior work order, review file, receipt, and report, including the two 2026-08-04 orders and
  `M6-REPAIR-REPORT-2026-08-04.md`. The repair report of §8 is a **new** file.
- Every resume-note byte outside the four allowlisted surfaces at §7, including rulings 1–34 verbatim and
  the explicitly immutable M4.64–M4.66 batch-record sentence.

### 3.3 `M4.4` / `P2#1` — reserved without adjudication

`M4.4` also carries `` `Owner` — `OMIT`; same reason. `` Its `Evidence` was **not** among the fifteen
repaired, so no antecedent moved beneath it. **It is therefore outside the causal surface of this review
return**, which is the reason it is not opened — and that is the whole of the reason.

**This order takes no position on whether `M4.4`'s inheritance is sound.** It is neither cleared on the
merits nor recorded as a defect. It is reserved, without adjudication, for the full 65-record, 13-wrapper
constitutional review, which is the pass with authority over records no repair has touched.

Recorded so the reservation is not mistaken for a finding either way: M6.3 grounds both its `Evidence` row
(4) and its `Owner` row (5) as `ARCHIVE-ONLY`, a **both**-field ground under §M6.1 — but a shared
classifier does not make the antecedent *prose* field-neutral, and that prose turns on what no tracked file
*carries*, which is `Evidence`-shaped substance. That tension is the reserved question. It is not resolved
here, and no seat may treat this paragraph as having resolved it.

Widening this order past the review return would be the same defect class the return exists to catch.

---

## 4. Substring boundaries — read this before the first edit

Revision 4 §2 fixed the convention that **the whitespace preceding a disposition belongs to the preceding
substring.** Applied here, that convention has two consequences, and missing either one silently breaks an
immutable surface:

1. The whitespace and line break between the end of the `Evidence` clause and `` `Owner` `` belongs to the
   **`Evidence`** substring, which is immutable. **The opened substring begins at the backtick of
   `` `Owner` ``.** Re-wrapping that leading whitespace to accommodate longer `Owner` prose would edit a
   closed surface.
2. The whitespace between the end of the `Owner` clause and `` `Execution` `` belongs to the **`Owner`**
   substring and is therefore inside the opened region. The opened substring ends immediately before the
   backtick of `` `Execution` ``.

Consequences for authoring:

- The replacement `Owner` prose wraps within the lines it already begins on and may add lines before
  `` `Execution` ``. It must not move `` `Execution` `` onto a line whose leading whitespace differs from
  the record's existing four-space continuation indent.
- Item 10 is prose, not a target field line. M4.1's one-physical-line rule governs the exact field lines
  at item 9 and does not apply here; wrapping is permitted and expected.
- `edit_file` is atomic across its `edits` array. Every `oldText` anchor is copied from a live read taken
  immediately before the call, and a `dryRun` is executed and inspected before the live call. One
  mismatched anchor aborts all edits in the call; re-measure before any retry.

---

## 5. Derivation requirement for the three replacement reasons

### 5.1 The requirement

Each replacement reason is **self-contained**. It states the ground for omitting `Owner` at that record
without referring to the `Evidence` clause, to another record, or to any other disposition. `same reason`,
`as above`, `likewise`, `for the same ground`, and every equivalent cross-field back-reference are
prohibited in the replacement bytes.

Each reason is **derived**, not assembled. Insert no M6.1 ground token into the manifest prose: the record
states the reason in its own terms — what this statement's operative limbs are and where they are or are
not carried — and M6.3's ground cell is what classifies it. A reason that reads as a ground token spelled
out in words satisfies the form and abandons the job.

Each reason is derived from **two** sources and both are read live before authoring: the record's own item
8 statement bytes and item 12 rationale, and the M6.1 definition of the ground M6.3 assigns that row.
Deriving from the ground alone produces a generic sentence that would fit any record sharing the token.

**Ruling 32 applies.** Where a reason would assert something about what a live tracked path does or does
not carry, that assertion is checked against the live path before it is written, or the reason is stated
at a level the record's own material already establishes. A confident claim about a path this seat has not
read is not available.

### 5.2 The grounds, transcribed from live M6.3 and M6.1

| record | block | M6.3 row | field | candidate | ground |
|---|---|---:|---|---|---|
| `M4.3` | `P2#0` | 3 | `Owner` | — | `NO-SINGLE-OWNER` |
| `M4.7` | `P5#0` | 11 | `Owner` | `BANK-REVIEW-LEDGER.md` | `NOT-AN-AUTHORITY, PARTIAL-OWNERSHIP` |
| `M4.11` | `P8#0` | 19 | `Owner` | — | `NO-SINGLE-OWNER` |

M6.1 definitions, transcribed verbatim from the live manifest:

- `NO-SINGLE-OWNER` — `Owner` only — Distinct tracked paths independently enforce distinct operative
  limbs, so no one path owns the rule. The one-path grammar admits no concatenation.
- `PARTIAL-OWNERSHIP` — `Owner` only — One candidate owns some operative limbs, but another operative limb
  has its own independent enforcement surface elsewhere. Standing rulings 11 and 28. A candidate is **not**
  disqualified merely because it cannot enforce a rationale, classification, or explanatory clause.
- `NOT-AN-AUTHORITY` — both — The candidate is a tracked file, but is an implementation script, artifact,
  data file, or operational record rather than a source carrying evidence or a path owning the rule.

**The adjacent ground that must not be drifted into**, transcribed for the same reason:

- `NO-EXECUTABLE-OWNER` — `Owner` only — The entry decides a practice, disposition, or scope boundary that
  no path executes.

`NO-SINGLE-OWNER` and `NO-EXECUTABLE-OWNER` are different grounds with different facts behind them. A
reason asserting that *nothing tracked carries this* is `NO-EXECUTABLE-OWNER` prose. A reason asserting
that *several tracked things each carry part of this and none carries all of it* is `NO-SINGLE-OWNER`
prose. Writing the first under a row classified as the second reproduces the defect this order exists to
repair, one field over.

### 5.3 Per-record acceptance test

The reason at `M4.7` must state **both** limbs its ground pair requires. A reason carrying only the
authority limb reproduces the defect this order exists to repair.

| record | the reason is accepted only if it establishes |
|---|---|
| `M4.3` | that distinct tracked surfaces independently carry distinct operative limbs of the statement while none carries the complete statement — not merely that no candidate was named, and not that no tracked path carries the rule at all |
| `M4.7` | (a) that `BANK-REVIEW-LEDGER.md` records what the pipeline did rather than owning the rule, **and** (b) that at least one operative limb binds beyond what the ledger or the promotion machinery enforces |
| `M4.11` | that the contract's limbs attach at different authoring and transformation stages, so no single live path owns the whole statement — not that the supporting evidence is archived |

All three dispositions remain `OMIT`. A ground repair that changed a disposition would be a new
classification decision and is outside this order.

### 5.4 `M4.3` feasibility gate — EXECUTED 2026-08-05 before this revision was frozen; result PASS

`NO-SINGLE-OWNER` is a factual claim about live tracked surfaces, so it was tested before the order was
frozen rather than left as a runtime branch. The read was read-only and made no repository change.
**Revision 2's conditional failure branch is eliminated as unnecessary, not waived.**

**Paths read live:** `AGENTS.md` in full; `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md`;
`gpt-evergreen-generation-prompt.md`; plus repository-wide searches under three separate vocabularies.

**Limb-to-surface mapping found:**

| operative limb of the `P2#0` statement | live tracked surface carrying it |
|---|---|
| judgment-dependent work requires independent review | `AGENTS.md` — the risk-tiered minimum-verification table, and its bank-content row requiring the full promotion pipeline including `producer≠checker review` |
| purely mechanical work may self-certify against a deterministic check with an independent null | `AGENTS.md` — the same table's reduced tiers, with the census-drift procedure supplying the independent null through `npm run census:check` against the committed generated artifacts |
| every active generation lane declares producer provenance and independent-review routing | **not `AGENTS.md`**, which is silent on it. Carried per lane: `gpt-evergreen-generation-prompt.md` declares its producer restriction and routes review and promotion to a named non-producer seat; `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md`, marked active, declares its producer seat and routes verification to a separate non-producer checker |

**Disposition.** Distinct tracked paths independently carry distinct operative limbs and none carries the
complete statement. `NO-SINGLE-OWNER` is supported; M6.3 row 3 stands; no classification commission is
owed. The replacement reason at `M4.3` is derived from this mapping at edit time. **This section supplies
verified inputs and deliberately does not contain the replacement prose**, which belongs to the repair
report.

**One dating uncertainty, recorded rather than resolved.** `gpt-evergreen-generation-prompt.md` notes as
of 2026-07-18 that no direct case-study generation lane is spec'd; the producer contract is dated
2026-07-19 and declares itself active. The later document is read as the current state, but the finding
does not depend on it: discounting the contract entirely still leaves `AGENTS.md` and the evergreen prompt
as two distinct paths carrying different limbs. Flagged to the confirming read at §10.

**The false negative, recorded because it is this workstream's cleanest instance of ruling 34.** A bounded
exact-phrase search for the lane-declaration language returned hits only in `DECISIONS.md` at the legacy
`E037` rule and in Stage 2a working artifacts, and none in any enforcement surface. That result was
recorded at revision 2 as a candidate signal suggesting the gate might fail. It was wrong: the two
surfaces that actually carry the limb use none of the searched words. A mechanical search over governance
prose yields a candidate population and never a finding population, and **that holds for absence exactly
as it holds for presence** — a seat that had treated the empty result as a finding would have opened a
classification commission against a correctly classified row.

---

## 6. Standing ruling 35 — authorized, and the ground for adding rather than extending

**Exactly one new standing ruling is authorized: ruling 35.** No other ruling is added, and rulings 1–34
are byte-identical. A finding that warrants ruling status beyond this one arrives by amended order.

**Decision: a new ruling, not an extension of 33.** Grounds:

1. Ruling 33's rule sentence is register-scoped — the vocabulary carries the field as data and a register
   row is never shared between two fields. The defect here lives in reasoning prose, where there is no row
   and no column to carry the field.
2. Ruling 33 is a dated finding with its own evidence and repair. Rewriting it on 2026-08-05 would blur
   what the 2026-08-04 pre-handoff review of M6 actually found, and the rulings in the resume note are an
   append-only record of findings, not a maintained taxonomy. Ruling 34 was added beside 33 on exactly
   this reasoning rather than folded into it.
3. The generalizable lesson differs. Ruling 33's payoff is that the defect became script-findable. Ruling
   35's payoff is a limit on what a byte allowlist can prove, which is a verification-design lesson and
   binds a different seat at a different step.

### 6.1 Required limbs of ruling 35

1. **The rule.** A field disposition never states its ground by reference to another field's disposition
   where the two fields have different eligibility tests. `Evidence` and `Owner` have different tests —
   target §1 and standing ruling 23 — so a reason written for one is never inherited by the other through
   an anaphor. Governed reasoning is self-contained at the level an allowlist can open, because an
   allowlist's unit is the substring.
2. **The mechanism, named exactly.** An anaphor makes a disposition's meaning depend on bytes outside
   itself. When the antecedent is edited under an allowlist that opens it and closes the anaphor, the
   allowlist reports the dependent bytes unchanged and is correct about the bytes and wrong about the
   meaning.
3. **The verification consequence, which is the sharp end.** *A byte-identity proof over a substring
   proves the substring did not move; it does not prove the substring still says what it said.* Where an
   allowlist opens text that another closed substring depends on, byte identity is not sufficient
   evidence and a reading seat must adjudicate the pair. State that the 2026-08-04 verification was
   **correct within its commission** and that the gap lived in the commission's design, not in its
   execution — the same shape as the observation at `M6-REPAIR-REPORT-2026-08-04.md` §8.3.
4. **What the ruling does not license.** It distinguishes the defect this repair addresses — an anaphor
   whose antecedent was *replaced beneath it* — from an anaphor whose antecedent is unchanged, which this
   review return did not reach and which the ruling does not by itself adjudicate. **The ruling must not
   certify any surviving `same reason` construction as satisfying limb 1.** Requiring self-contained field
   reasoning and clearing an inherited reason are incompatible positions, and the ruling takes only the
   first. Where an unchanged anaphor exists, the ruling identifies it as owed an adjudication, not as
   settled in either direction. **No worked counterexample is stated**, because the ruling authorized here
   has none it can certify.
5. **The enforcement limb.** Ruling 34 governs this ruling's own application: a search for `same reason`
   or an equivalent construction returns a candidate population, never a finding population. Each candidate
   is adjudicated on its record's own two grounds and its actual antecedent prose, with a stated ground for
   every exclusion.
6. **Provenance.** Found 2026-08-05 by the GPT confirming read of the M6 repair, at `M4.3`, `M4.7`, and
   `M4.11`.

---

## 7. Resume-note allowlist — exactly four surfaces

| id | surface | change |
|---|---|---|
| S1 | after ruling 34, before the `## MIGRATION_DATE` heading | insert ruling 35 per §6.1. Nothing else in the rulings list is touched; the note must carry `33.`, `34.`, `35.` and no `36.` |
| S2 | the `**Updated:**` line only | set to the calendar date on which the repair lands, in `America/New_York`; unchanged if that equals the value already present. The `**Seat:**` value on the same physical line is immutable |
| S3 | the `## Next session — start here` block | replace the M6-verification next action with this order's actual next action: the three `Owner` repairs, the §9 Codex verification, the GPT confirming read, and the standing bar on the derived date-occurrence report. Retain the routing list, the schedule constraint, the three unratified delegation clauses, and the hashing-primitive note |
| S4 | the `## Cursor` section's two exact spans | record the M6 repair as verified, the confirming read as REVISE-narrowly, and this repair as the open item. Everything from `Prior context,` onward is immutable |

The `M4.4` reservation at §3.3 is carried into S3 as an item owed to the full constitutional review. It is
recorded there as reserved and unadjudicated, in those terms, and not as a cleared record.

---

## 8. Repair report

The architect seat writes exactly one new file:
`audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-REPAIR-REPORT-2026-08-05.md`.

It carries: §1 the revision-3 authorization identity measured before the first edit; §2 the pre-repair
identities re-measured, not transcribed; §3 the three replacement substrings verbatim with the derivation
for each, `M4.3`'s derived against the §5.4 limb-to-surface mapping; §4 ruling 35 as written; §5 the
resume-note surfaces as applied; §6 architect-measured post-repair state, labelled as the producer's
self-report; §7 the closing authorization measurement.

**Every figure the architect seat produces in that report discharges nothing.** Byte length is measurable
on this connector; SHA-256 is not, and none is claimed. The report is the producer's evidence, not proof
of correctness. **A write is not evidence of itself:** every edit is read back from disk before it is
reported as applied.

---

## 9. Codex verification commission

Executed after the repair report exists. One deliverable:
`audit/decisions-migration-2026-07-29/M4-OWNER-ANAPHORA-VERIFICATION-2026-08-05.md`. No repair, no
staging, no commit, no push, no stash, reset, clean, or checkout. That file is the sole authorized write.

| # | proof | disposition |
|---:|---|---|
| V1 | exactly three substrings changed in the manifest, and they are the item-10 `Owner` dispositions at `M4.3`, `M4.7`, `M4.11` | PASS / FAIL |
| V2 | the fifteen repaired `Evidence` substrings are byte-identical to their post-2026-08-04 state, with the three adjacent to an opened region reported individually | PASS / FAIL |
| V3 | all of M6 is byte-identical, reported as a whole-section digest and separately for §M6.1, §M6.3 rows 3, 11, and 19, §M6.4, §M6.7, and §M6.10 | PASS / FAIL |
| V4 | optional-field populations unchanged: per-field `OMIT` counts across all 65 M4 records equal to pre-repair | PASS / FAIL |
| V5 | governed field-path population unchanged, derived independently from the present item-9 `Evidence` and `Owner` field values across all 65 records before and after repair: `20` governed field instances; `19` distinct governed paths; `src/schema.ts` the only path appearing twice; `18` paths requiring tracked verification; exactly one future-output exemption, `E038`'s `Evidence`, equal byte-for-byte to M0.1's normalized archive filename; and exact set equality with the unchanged M6.4 population | PASS / FAIL |
| V6 | manifest strict UTF-8, `U+FFFD` 0, CRLF 0, bare CR 0, final LF present, exactly one `@@ASSEMBLY_CURSOR@@` and terminal, literal `2026-08-11` count `63`, plus measured byte length, physical line count, and SHA-256 | PASS / FAIL |
| V7 | resume note: rulings 1–34 byte-identical individually; exactly ruling 35 added; reversing S1–S4 reproduces the pre-repair note byte-for-byte; measured byte length, line count, SHA-256 | PASS / FAIL |
| V8 | **this order at revision 3**, byte length and SHA-256 measured at the start and at the end of verification and equal to the value recorded in repair report §1. The header reads `**Revision:** 3`; revisions 1 and 2 are superseded and are not the verification subject | PASS / FAIL |
| V9 | `DECISIONS.md` byte-identical to `MIGRATION_BASELINE`; branch and HEAD unchanged; `git status --porcelain` shows untracked Stage 2a paths only, zero staged, zero modified tracked | PASS / FAIL |
| V10 | zero occurrences of `same reason` remain in the item-10 blocks of `M4.3`, `M4.7`, `M4.11`; the occurrence at `M4.4` survives and is reported as expected-present and **outside V10's finding population; its presence is not a V10 failure, and its merits remain reserved and unadjudicated under §3.3** | PASS / FAIL |

**D1 — diagnostic, not a gate.** Report the before-and-after multiset of backticked repository-path
mentions across all M4 item-10 blocks, with any difference attributed to a specific record. Item-10
mentions are rejected candidates and explanatory prose, not the governed field population, and a correct
self-contained `M4.7` reason may legitimately name `BANK-REVIEW-LEDGER.md` again. **A difference is a
BLOCKER only if it falls outside the three opened `Owner` substrings**, in which case it is already a V1
failure. Inside them it is reported and passed through to §10.

**One requested proof is withheld from this commission by architect ruling.** The GPT return asked that
verification prove *M6 remains byte-identical and still agrees with the repaired M4 reasons.* The first
half is V3 and is deterministic. **The second half is not a deterministic question and is not commissioned
here.** Whether a replacement reason expresses the ground M6.3 assigns it is a reading judgment; a
deterministic seat can only test for token presence, and §5.1 prohibits inserting the tokens, so a token
test would score the correct output as a failure. Agreement is adjudicated at §10 by the reading seat.
Asking a deterministic seat for it would return a number that looks like evidence and is not.

Any finding beyond the ten rows and one diagnostic above is reported as ADVISORY and repaired under a
further order, not under this one.

---

## 10. GPT confirming read

After V1–V10 clear. Scope:

1. The three replacement `Owner` reasons: self-contained; derived rather than token-assembled; each
   satisfying its §5.3 acceptance test; `M4.7` carrying both limbs; `M4.3` carrying `NO-SINGLE-OWNER`
   substance rather than `NO-EXECUTABLE-OWNER` substance.
2. **Agreement between each repaired reason and its M6.3 ground and M6.1 definition** — the judgment
   withheld from §9.
3. The §5.4 limb-to-surface mapping: whether the named paths are current enforcement surfaces rather than
   archived examples, historical evidence, or repeated prose, and whether they support the claim the
   `M4.3` reason makes. The dating uncertainty recorded at §5.4 is expressly in scope.
4. Ruling 35 against the required limbs at §6.1, including limb 4's prohibition on certifying any
   surviving anaphor.
5. That §3.3's reservation of `M4.4` is carried as reserved-and-unadjudicated, in the repair report and in
   resume-note S3, and is nowhere written as cleared.

**No later migration step begins before that read clears.** In particular the derived date-occurrence
report is not generated, and ratification is not sought.

---

## 11. Blockers

Execution stops and returns to the architect seat on any of: a §1.2 identity mismatch at re-measurement;
an inequality between the opening and closing measurements of this order; any change to a §3.2 surface;
a `dryRun` whose diff touches bytes outside the three opened substrings; a replacement reason that cannot
be supported by the §5.4 limb-to-surface mapping or by an equivalent live read recorded in the repair
report; a proposed reason that cannot be derived without asserting an unverified fact about a live path;
or any finding that would require a sixteenth `Evidence` repair, a change to an M6.3 ground, or a change
to the M6.4 population.

The `M4.3` feasibility gate is **not** among these blockers. It was executed before this revision was
frozen and returned PASS at §5.4; there is no runtime branch left for it to fail.

**Deadline context, not authority.** `MIGRATION_DATE` is bound to `2026-08-11`. Schedule pressure
authorizes nothing: a step skipped to meet the date is a defect carried into a ratified constitution,
and Amendment 1 Clause B is the cheaper failure.
