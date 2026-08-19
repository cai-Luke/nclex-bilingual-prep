# Stage 2b Phase 1 — F16 scaffolding correction and resumption

**Date:** 2026-08-08 · **Revision:** 2 · **Seat issuing:** Architect · **Executing seat:** Codex

## 0. Identity and relationship to the frozen Phase 1 order

**This instrument does not amend, replace, or reopen** `DECISIONS-MIGRATION-STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-WORK-ORDER-2026-08-08.md`, revision 3, authorized at `18112` bytes / SHA-256 `e870e05304481120ad610a0d9da3f4e677b68356d111cbd8c93fadda7fb88095`. That order is not defective, closed correctly on its own STOP condition, and remains untouched and immutable. This instrument authorizes exactly one narrow correction inside work that order's own §4 item 1 and §5 Step 3a already permitted, and directs a resumption of execution using that order's unchanged Steps 4–9. Where this instrument is silent, the frozen order governs.

**This instrument carries no hash slot for the same reason revision 3 of the parent order carries none:** writing a hash into a document changes the bytes that hash would have to describe. Authorized identity — byte length and SHA-256 — is measured externally and recorded in the resume note, not inside this file. This file is not edited after that measurement.

**Revision history.** Revision 1 was drafted and, before any external measurement, corrected in place on two non-author-review findings: an allowlist that literally forbade the parser excision and new report file this instrument's own later sections required, and a false claim that the deliverable specification was unchanged when §5 in fact names a new path. The revision number was advanced to 2 because two distinct byte states had been drafted under the label "revision 1," and — exactly as on the parent order — an ambiguous revision label is not carried into an authorized identity. No byte state of this instrument has been externally measured, authorized, or executed.

**The prior STOPPED report is not reopened.** `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08.md` stands as a closed, accurate contemporaneous record of a correctly-terminated execution attempt. This resumption produces a new, separately named deliverable per §5 below.

## 1. Architect adjudication of the STOP, stated so Codex does not re-derive it

The STOP was the frozen order's own §7 stop condition 2 firing correctly: F16's pre-excision run returned an unpredicted `MISSING_DECLARED_TOTAL` finding alongside the predicted P-guard rejection. Execution halted before Step 5; the parser was never touched, confirmed by the receipt's closing measurement matching its opening measurement byte-for-byte. This was the correct response to a genuine divergence, not a process failure.

**Independent root-cause verification, performed by the architect seat against live `lib/decisions-format.ts` and live `scripts/tests/decisions-format.ts`, not accepted from any receipt's narrative:**

`buildDecisions()` builds the entry-index section as `${tableRows}${total}` where, for `rows: []`, `tableRows` is the empty string and `total` begins with a literal `\n\n`. This produces **two** consecutive blank lines between the table separator row and `**Declared total:**` — confirmed by direct trace of the template literal's output. `parseEntryIndex()` (`lib/decisions-format.ts`), on breaking its row-reading loop at the first blank line, advances across **exactly one** blank line before testing for the declared-total line. With two consecutive blank lines, that test lands on the second blank line, not on `**Declared total:** 0 entry blocks.`, so `declaredTotal` stays `undefined`. `checkDecisionsFormat()` then correctly raises `MISSING_DECLARED_TOTAL` per its own stated rule. Populated-row fixtures (e.g. `F11`, already passing) do not hit this: a non-empty `tableRows` closes the gap so exactly one blank line separates the last row from the declared-total line, which is what `parseEntryIndex()` expects.

**Disposition, stated for the record:**

- Commission, fixture document, or frozen order defect: **NO.**
- Parser defect: **NO.**
- Test-scaffolding defect, isolated to the F16 block's `rows: []` construction: **YES.**

The defect is orthogonal to F16's actual subject — the archive-index/wrapper join between `f16` and `f14` — which never executed far enough to be exercised meaningfully, since the extra finding was produced before that join's own correctness could be assessed. The fix below leaves the join's inputs (`f16`, `f14`, `archiveSource`) byte-identical to what the frozen order's §5 Step 3 already transcribed and pinned.

## 2. Authorized correction — one substitution, one file

**Full write allowlist for this resumption, stated explicitly rather than left to inference across sections:**

1. `scripts/tests/decisions-format.ts` — only the F16 scaffolding substitution specified below.
2. `lib/decisions-format.ts` — only the frozen order's own exact three-line excision at its §6, and only if the fresh Step 4 run at §4 below reproduces the original prediction exactly. Not authorized otherwise.
3. `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08-RESUMPTION.md` — the new deliverable at §5.

**No other repository path may be written, created, moved, renamed, or deleted under this instrument.** The frozen order's own §4 item 1 already authorized item 1 above for F14–F16/M20–M23 scaffolding; this correction stays inside that same authorization. Items 2 and 3 are this resumption's own explicit extension of that allowlist, not implicit consequences of some other clause.

Locate the F16 isolated fixture block. Its current, defective form on live disk:

```ts
runIsolatedFixture("F16", () => {
  const result = checkDecisionsFormat({
    decisionsText: buildDecisions({ rows: [], section8: f16 }),
    archiveText: f14,
    archiveSource: "Archive/DECISIONS-ARCHIVE-<date>.md",
  });
```

Replace only the `decisionsText:` line — the two lines after it (`archiveText`, `archiveSource`) and everything from `assert.equal(result.ok, true, ...)` onward are unchanged and untouched:

```ts
runIsolatedFixture("F16", () => {
  const result = checkDecisionsFormat({
    decisionsText: buildDecisions({
      rows: [{ kind: "I", summary: "Runtime audio carries no client-embedded secret" }],
      i: [f5],
      section8: f16,
    }),
    archiveText: f14,
    archiveSource: "Archive/DECISIONS-ARCHIVE-<date>.md",
  });
```

**Why this exact substitution, verified by the architect seat before authorizing it, so Codex is not asked to trust an unverified claim:**

- `f5` is the file's own existing, already-fixture-proven block (`### Runtime audio carries no client-embedded secret`, `Kind: I`, `Status: ACTIVE`, `Force: BINDING`) — reusing it introduces no new prose to review.
- The row's `kind: "I"` matches `f5`'s `Kind: I`. The row's `status` and `force` are left at `buildDecisions()`'s defaults (`ACTIVE`, `BINDING`), which match `f5`'s own `Status` and `Force` fields exactly — no `INDEX_BODY_MISMATCH` metadata disagreement.
- The row's `summary` is byte-identical to `f5`'s title, so `parseEntryIndex()`'s row `blockKey` (`"—"` addressing → `blockKey = summary`) matches the parsed body entry's `blockKey` (name-addressed → `blockKey = title`) exactly — no `INDEX_BODY_MISMATCH` key disagreement, no `INDEX_ORDER_MISMATCH`.
- With one row, `buildDecisions()`'s default `declaredTotal` is `options.rows.length = 1`, matching the one body entry parsed from `i: [f5]` — no `DECLARED_TOTAL_MISMATCH`. The single non-empty table row closes the blank-line gap described in §1, so `parseEntryIndex()` now finds `**Declared total:** 1 entry blocks.` where it expects it.
- `ALLOCATION_GAP` only evaluates `P`/`R`-prefixed identifiers; an `I`-kind, name-addressed entry does not participate.
- This isolated `checkDecisionsFormat()` call passes no `trackedPaths`, so `f5`'s `Owner` field cannot trigger `UNTRACKED_PATH` regardless of its value.
- `f16`, `f14`, and `archiveSource` are unchanged, so every assertion after `result.ok` — addressing, label, blockKey/title match, pointer file, pointer anchor, absent register row — is unaffected and still tests exactly what the frozen order's §5 Step 3 transcribed from the ratified fixture document.

Read the file back from disk after writing and confirm the substitution landed and that no other line in the F16 block moved.

## 3. What this correction does not authorize

- No change to `F14`, `F15`, `M20`–`M23`, or any other existing fixture.
- No change to `lib/decisions-format.ts`. The parser remains untouched until a fresh Step 4 run under §4 below reproduces the frozen order's original prediction exactly.
- No change to the seven transcribed expectations themselves — only to the incidental entry-index population `F16`'s own scaffolding builds around an unchanged `archiveText`/`section8`.
- No change to the frozen Phase 1 order's own bytes, allowlist, stop conditions, or excision specification — those govern this resumption exactly as written at that order's §4–§8. **This instrument does supersede one clause of that order for the scope of this resumption only:** the frozen order's §4 item 3 and §9 named the deliverable as `STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08.md`. That file is the closed STOPPED report and is not reused for this resumption's output. For this resumption only, the deliverable path is the one named at §5 below. The frozen order's own bytes are not edited to reflect this — the supersession is stated here, in this resuming instrument, not silently assumed.

## 4. Resumption sequence

1. **Opening measurement.** Re-measure `lib/decisions-format.ts`, `scripts/tests/decisions-format.ts` (before this correction's edit), branch, and tracked-tree cleanliness from live disk. Confirm both pinned identities are unchanged since the STOPPED report's own closing measurement:
   - `lib/decisions-format.ts` — `47250` bytes / SHA-256 `46b5f8c2d13203a155484bb5947acd7086a0d15a8f6c3066ce353cc103a7c256`.
   - `scripts/tests/decisions-format.ts` — `41230` bytes / SHA-256 `ad8cacbd0b96abc24a022a0c48d4271bc0f832a6a1fb7f20a29588359c126ea5`, the exact state carrying Codex's first-run `F14`–`F16`/`M20`–`M23` implementation with only the defective F16 scaffolding still in place.

   If either has changed, stop and report; do not proceed. This resumption is authorized only against this exact prior state — it is not authorized to apply the §2 substitution to some other version of the test file that happens to still contain an F16 block matching the §2 locator text.
2. Apply the §2 substitution. Read back and confirm.
3. **Fresh pre-excision run** — `npm run test:decisions-format`. Retain raw stdout and stderr verbatim, exactly as the frozen order's §5 Step 4 requires. `F1`–`F13` and `M1`–`M19` must still pass. `F14` and `F15` are still expected to fail under the unmodified P/R guard, exactly as before. `F16` is now expected to fail **solely** on the same P-guard rejection `F14` demonstrates — the frozen order's original prediction ("F16 cannot pass because F14 is rejected") — with **no** additional `MISSING_DECLARED_TOTAL` or any other unpredicted finding. `M20`–`M23` are still expected to pass.
4. **If the fresh run matches this prediction exactly**, proceed through the frozen order's §5 Steps 5–7 and §6 unchanged: the single three-line excision in `lib/decisions-format.ts`, the post-excision rerun (all seven new fixtures plus `F1`–`F13`/`M1`–`M19` passing, suite exits zero), and the closing measurement.
5. **If the fresh run diverges from this prediction in any respect** — including but not limited to a different F16 failure mode, a regression in any previously-passing fixture, or any change outside the F16 block — stop under the frozen order's own §7 stop conditions and report. Do not attempt a second scaffolding change without returning to the architect seat.

## 5. Deliverable

Exactly one new file, distinct from the STOPPED report so that record stays closed:

`audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08-RESUMPTION.md`

Structured identically to the frozen order's §9 (opening measurement, harness contract restated only if anything about it changed, the seven expectations — noting explicitly that only F16's incidental scaffolding changed and quoting the corrected code, pre-excision run verbatim with the fixture-by-fixture prediction table, the excision and read-back seam if reached, post-excision run verbatim if reached, closing measurement, overall disposition), plus one additional opening line naming this correction instrument and the STOPPED report it resumes from, so a future reader has the full chain without needing chat history.

Overall disposition is `PASS`, `STOPPED`, or `FAIL`, exactly as the frozen order defines them.

## 6. Architect adjudication

On return, the architect seat reads the resumption report cold, independently re-measures live disk, and adjudicates. Phase 1 as a whole closes only on architect `ACCEPT` of a `PASS` disposition here. Phase 2 remains uncommissioned until then.
