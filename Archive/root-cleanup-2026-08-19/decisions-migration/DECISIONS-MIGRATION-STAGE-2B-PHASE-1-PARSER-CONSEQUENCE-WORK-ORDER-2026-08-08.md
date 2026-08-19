# Stage 2b Phase 1 — Amendment 4 parser consequence (commission §5.3)

**Date:** 2026-08-08 · **Revision:** 3 · **Seat issuing:** Architect · **Executing seat:** Codex

## 0. Identity, revision history, and immutability

**This order carries no hash slot by design.** Its authorized identity — byte length and SHA-256 — is measured externally by the owner and recorded in the owner acknowledgment, the Claude resume note, and the Codex handoff, in the form:

> Stage 2b Phase 1 work order revision 3 is authorized at `<length>` bytes / SHA-256 `<digest>`.

**This file is not edited after that measurement.** A hash written into the document it describes cannot describe the document's current bytes, because writing it changes them; that construction proves nothing and is prohibited here.

**Revision history.** Revision 1 (2026-08-08) was byte-measured during drafting at 13370 bytes, but was never externally hash-measured, never authorized, and never entered execution. It was revised in place, not superseded, on three defects found in non-author review and independently confirmed by the architect seat against the live test harness: a self-invalidating hash slot; a write allowlist that literally forbade the command this order requires; and a Step 4 table that the fail-fast harness could not produce.

Revision 2 was likewise corrected in place, before any external measurement, on two editorial defects found in the same review channel: a §3 tracked-tree description that this order's own untracked existence falsified, and an imprecise claim that revision 1 had never been measured. The revision number was advanced to 3 because two distinct byte states had been drafted under the label "revision 2," and an ambiguous revision label must not be carried into an authorized identity.

**No byte state of this order has ever been externally measured, authorized, or executed.** Every correction above was made to an unauthorized draft; no contemporaneous record was reopened and no prior authorization was disturbed.

**Immutable during execution.** Once authorized, this file is not edited. Execution notes, partial results, and status belong in the deliverable at §9, never here. If this order proves defective mid-execution, stop and return to the architect seat for a superseding revision; do not repair the order in place.

---

## 1. Authority

Stage 2a closed on 2026-08-08 by owner exact-byte ratification (`DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md`). That act authorizes Stage 2b, the closed-world mechanical implementation at commission §5–§6, and nothing else.

This order commissions **Phase 1 only**: commission §5.3, the parser consequence of ratified Amendment 4. It is the first of seven bounded phases and does not authorize any part of §5.4–§5.8 or §6.

Governing documents, in precedence order: `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md`; `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md`; the ratification record above; this order.

---

## 2. Seat and producer≠checker

Codex is the implementation producer (commission §5.1). Codex authors no constitutional wording and makes no migration disposition.

The architect seat authored this order and adjudicates the returned receipt cold against live disk. **Codex's own post-edit self-checks discharge feasibility only, never correctness.** A returned diff is not proof of persistence: every write in this order is read back from disk after it lands, and the receipt records the read-back, not the diff.

Producer≠checker attaches to the seat that produced, not to a model name.

---

## 3. Prerequisites, architect-measured cold on 2026-08-08

Verified against live disk by the architect seat before drafting. Recorded so the executing seat can detect drift, **not** so it can skip its own opening measurement.

| item | architect-measured state |
|---|---|
| Branch | `codex/decisions-migration` |
| Tracked working tree | clean — no staged or modified tracked path; untracked migration working-set artifacts present, including this work order |
| `lib/decisions-format.ts` | 47250 bytes |
| `scripts/tests/decisions-format.ts` | 35014 bytes |
| `DECISIONS-FORMAT-FIXTURES-2026-07-28.md` | 16948 bytes |
| `package.json` → `test:decisions-format` | present, `tsx scripts/tests/decisions-format.ts` |
| Fixtures implemented in the test file today | `F1`–`F13`, `M1`–`M19` |
| Fixtures **absent** from the test file today | `F14`, `F15`, `F16`, `M20`, `M21`, `M22`, `M23` |
| `F14`–`F16` / `M20`–`M23` in the fixture document | all seven present and fully specified |

**The architect seat has no SHA-256 primitive.** Byte lengths above are architect-measured; every SHA-256 in this order's opening and closing measurements is supplied by a hashing-capable seat. A length-only closeout is void wherever this order requires a SHA.

**`package.json` requires no change in this phase.** `test:decisions-format` already exists and already points at the correct file, so no conformance wiring is in scope. It is excluded from the write allowlist below even though commission §5.2 item 12 authorizes it for later phases.

---

## 4. Write allowlist, frozen at issue

Exactly three **repository** paths may be written in this phase:

1. `scripts/tests/decisions-format.ts` — limited to implementing the ratified `F14`–`F16` and `M20`–`M23` expectations and the direct regression scaffolding at §5 Step 3a required to execute them (commission §5.2 item 6).
2. `lib/decisions-format.ts` — limited to the single excision at §6 (commission §5.2 item 5).
3. `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08.md` — the deliverable at §9.

**No other repository path may be written, created, moved, renamed, or deleted.**

**Ephemeral writes outside the repository are permitted and are not branch outputs.** The existing harness creates a temporary directory under the OS temp root via `mkdtemp(join(tmpdir(), "shrimp-decisions-format-"))`, writes control files into it, runs `git init` and `git add` inside that temporary root, and removes it in a `finally` block. These are pre-existing behaviors of the command this order requires; they are authorized, they are not repository writes, and they are not to be suppressed or modified. Commission §5.2 governs branch outputs, not the process's use of `/tmp`.

**The ratified manifest is not touched.** `audit/decisions-migration-2026-07-29/target-text-manifest.md` is consumed by later phases and modified by none. Phase 1 neither reads nor writes it.

This allowlist is frozen now, before any edit executes, and is not extended mid-execution. A repository path that turns out to be necessary is a reason to stop and return to the architect, not a reason to widen the list.

No commit and no push. This phase leaves its work in the working tree for architect adjudication.

---

## 5. Execution sequence — strict ordering, load-bearing

The ordering is the substance of commission §5.3, not a convenience: the fixture expectations must be proved against the **unmodified** parser before the parser changes. Executing out of order voids the result even if every individual step succeeds.

### Step 1 — opening measurement

Record from live disk: byte length and SHA-256 of `lib/decisions-format.ts`, `scripts/tests/decisions-format.ts`, and `DECISIONS-FORMAT-FIXTURES-2026-07-28.md`; current branch; HEAD commit; `git status --porcelain`. Compare against §3 and report any divergence before proceeding.

**The §3 comparison is over tracked state only** — the branch, the absence of any staged or modified tracked path, and the three pinned byte lengths. The untracked migration working set grows by design as authorized orders and receipts land, and already contains this work order; its membership is recorded for context and is not a prerequisite. A larger or different untracked population is not a divergence and is reported as context, not as a finding.

### Step 2 — read the harness before asserting what it produces

Before running anything, read `scripts/tests/decisions-format.ts` and establish from source how the suite signals a pass, how it signals a failure, what its exit code means, where the fixture matrix is printed, and how existing fixtures such as `F13` and `M19` are declared. Record this in the receipt in the seat's own words.

This step exists because a prior task in this migration asserted what a command produced without reading the script first and was wrong. Do not skip it and do not infer the harness contract from fixture names.

### Step 3 — implement the seven fixtures, parser untouched

Transcribe the `F14`, `F15`, `F16`, `M20`, `M21`, `M22`, and `M23` expectations **from `DECISIONS-FORMAT-FIXTURES-2026-07-28.md`** into `scripts/tests/decisions-format.ts`.

- The fixture document is the **sole** source of these expectations.
- **Do not derive any expectation from parser behavior**, before or after the excision. This is commission §5.3's closing prohibition and it is absolute.
- Quote into the receipt, verbatim, the expectation lines transcribed for each of the seven, so the transcription is auditable against the fixture document without re-deriving it.
- Change no existing fixture. `F1`–`F13` and `M1`–`M19` are untouched, including their bare-assertion style.
- Do not modify `lib/decisions-format.ts` in this step.

### Step 3a — required scaffolding for the seven new fixtures

The existing fixtures are bare top-level blocks whose assertions throw immediately, and the fixture matrix is printed late in the file, after the CLI controls are built. A single failing new fixture written in that style therefore aborts the process before the remaining new fixtures execute **and** before the matrix prints anything at all. Step 4 requires a per-fixture outcome for all seven from the pre-excision run, so the naive style cannot satisfy this order.

The seven new fixtures are therefore implemented under an isolated executor, within the regression scaffolding already authorized at §4 item 1:

1. Each of the seven executes inside its own isolated capture, so that a thrown assertion is **recorded as that fixture's outcome and execution continues** to the next fixture rather than aborting the process.
2. Each records `PASS`, or `FAIL` together with the assertion message or thrown reason. A bare `FAIL` with no reason is insufficient.
3. All seven outcomes are emitted to stdout alongside the existing fixture matrix, and **the emission happens before any process-level failure is raised**, so the table survives a failing run.
4. After all seven have executed and the matrix has printed, if any of the seven recorded `FAIL`, the process raises a single deferred failure and exits non-zero.

This deferred-failure shape is permanently correct, not a temporary accommodation: post-excision all seven pass and the suite exits zero, and any future regression in these seven still fails the suite. Do not weaken any fixture's assertions to avoid a failure, and do not encode the pre-excision prediction as an assertion — the prediction is checked by the architect against the receipt, not baked into a permanent test.

Read the file back from disk after writing and confirm the seven landed.

### Step 4 — pre-excision run, recorded verbatim

Run `npm run test:decisions-format`. **Retain raw stdout and stderr verbatim in the receipt**, not a summary, together with the exit code.

Commission §5.3 item 2 states the expected pre-implementation result:

- `F14` and `F15` **fail** under the name-addressed `Original Kind: P/R` guard;
- `F16`'s wrapper/index bijection **cannot pass**, because `F14` is rejected;
- `M20`–`M23` **already pass**, because they pin rejections the current parser already produces.

A non-zero exit at this step is expected and is not itself a defect. Report the **observed** outcome and recorded reason for each of the seven against this prediction.

**If observation diverges from the prediction in any respect, stop.** Do not adjust a fixture to make the prediction come true, and do not proceed to the excision. A divergence means either the transcription is wrong or the commission's model of the parser is wrong; both are architect questions. Return the receipt with the divergence documented and the parser still unmodified.

### Step 5 — the excision

Only after Step 4 matches the prediction, perform the single excision at §6.

### Step 6 — post-excision run, recorded verbatim

Rerun `npm run test:decisions-format`. Retain raw stdout and stderr verbatim and the exit code.

Required outcome: `F14`, `F15`, `F16`, `M20`, `M21`, `M22`, and `M23` all pass, **with the existing reason codes** — no reason code added, renamed, or repurposed. `F1`–`F13` and `M1`–`M19` continue to pass, and the receipt states this explicitly rather than leaving it implied. The suite exits zero.

### Step 7 — closing measurement

Re-measure byte length and SHA-256 of both modified source files from live disk, plus branch, HEAD, and `git status --porcelain`. Confirm no repository path outside §4 changed.

---

## 6. The excision, specified exactly

In `lib/decisions-format.ts`, delete exactly this three-line block, including its trailing newline:

```
      if (originalKind && originalKind !== "I" && originalKind !== "T") {
        invalid(`Name-addressed archive wrapper cannot have Original Kind ${originalKind}`);
      }
```

Addressed by substring, not by line number. Architect-measured facts:

- It occurs **exactly once** in the file.
- It is 175 bytes including all three line terminators.
- It occupies byte range `[38508, 38683)` in the 47250-byte pre-excision file.
- Indentation is six spaces on the `if` and closing brace, eight on the `invalid` call. Line endings are LF. There is no trailing whitespace.
- **Expected post-excision length: 47075 bytes.** This is a pure deletion, so the length check is meaningful and required; the SHA-256 is required in addition, not instead.

**Why deleting the whole block is exactly "remove only the single parser guard rejecting name-addressed P/R original kinds," and not one byte wider:** `originalKind` is typed `LiveKind = "P" | "R" | "I" | "T"`, and any value outside that set is already rejected upstream by the `Invalid Original Kind` check before this branch is reached. The block therefore rejects exactly `P` and `R`. Removing it permits exactly `P` and `R` and widens nothing.

**The enclosing `else` branch remains non-empty** after the deletion — it retains the `Name-addressed archive wrapper forbids Retired ID` check, which is unaffected and must not be touched. The seam after excision reads:

```
    } else {
      if (fieldResult.values.has("Retired ID")) invalid("Name-addressed archive wrapper forbids Retired ID");
    }
```

Confirm this seam by reading the file back from disk and quote it in the receipt.

**No other parser change is authorized.** Not a refactor, not a type adjustment, not a comment, not a reordering of neighbouring checks, not a formatting pass.

---

## 7. Stop conditions

Stop and return to the architect seat, with the receipt documenting the state reached, if any of these occur:

1. Step 1 finds a divergence from §3 **in tracked state** — a different branch, any staged or modified tracked path, or a different byte length on any of the three pinned files. A change in the untracked migration working set is not a divergence and is not a stop.
2. Step 4's observed result diverges from the commission's prediction in any respect.
3. The excision substring is not found, or is found more than once.
4. Post-excision length is anything other than 47075 bytes.
5. A newly exposed failure proves a ratified fixture impossible (commission §5.3 item 5). Do not repair the fixture and do not adjust the parser further — this is expressly an architect question.
6. Any work would require writing a repository path outside §4.
7. `F1`–`F13` or `M1`–`M19` regress at Step 6.

A stop is a successful outcome of this order when its condition is met. Returning early with an accurate receipt is correct; proceeding past a stop condition is not.

---

## 8. What this order does not authorize

- Any edit to the ratified manifest, under any circumstance.
- Any repository output outside the three paths at §4.
- Any parser change beyond the single excision at §6.
- Any commit, push, branch operation, or pull-request action.
- Any work belonging to commission §5.4–§5.8 or §6.
- Reopening any Stage 2a work the ratification gate closed.

---

## 9. Deliverable

Exactly one new file:

`audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08.md`

Containing, in this order:

1. Opening measurement (Step 1), with the §3 comparison.
2. The harness contract established from source (Step 2), in the seat's own words.
3. The seven transcribed expectations, each quoted from the fixture document alongside the implementing test code, plus a description of the isolated executor built under Step 3a.
4. Raw verbatim pre-excision stdout/stderr and exit code, plus the per-fixture observed-versus-predicted table with recorded reasons (Step 4).
5. The excision as executed, with the read-back seam quoted from disk (Steps 5–6).
6. Raw verbatim post-excision stdout/stderr and exit code, with explicit confirmation that `F1`–`F13` and `M1`–`M19` still pass (Step 6).
7. Closing measurement (Step 7).
8. A single overall disposition: `PASS`, `STOPPED`, or `FAIL`, with the governing reason in one sentence.

Write the report before the first edit executes and close it only when the closing measurement is filled by a hashing-capable seat. Do not backfill a report after the fact from memory of what happened.

---

## 10. Architect adjudication

On return, the architect seat reads the receipt cold and independently re-measures live disk rather than accepting the receipt's own numbers. Phase 1 closes only on architect `ACCEPT`. Phase 2 (commission §5.4, preservation snapshot) is not issued until it does.
