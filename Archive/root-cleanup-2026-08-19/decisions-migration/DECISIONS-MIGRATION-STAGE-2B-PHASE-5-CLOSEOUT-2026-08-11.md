# Stage 2b Phase 5 — architect closeout (commission §5.7)

**Date:** 2026-08-11 · **Seat:** Architect · **Disposition: ACCEPT**

## 1. What is closed

Commission §5.7 — the target reconciliation checker — is complete. `scripts/decisions-migration-target-reconcile.ts`
is implemented, wired as `reconcile:decisions-migration-target`, and verified to reconcile target
`DECISIONS.md` and the normalized migration archive against the four governing authorities: the ratified
Stage 2a manifest, ratified Amendment 2, ratified Amendment 3 (by explicit scope statement), and ratified
Amendment 4 §6.

Phase 5 closed on two passes rather than one. The original implementation returned `PASS` and was found
defective on independent review; a narrow location-binding repair was commissioned, executed, and accepted;
and the order §9 independent-execution prerequisite was then discharged separately. All three records are
preserved.

Phase 5 closes on architect `ACCEPT`. **Phase 6 (commission §5.8, conformance wiring) is not thereby
authorized for commissioning.** It remains a separately commissioned phase, issued only after this
closeout.

## 2. Instruments and receipts

| instrument / receipt | identity / result |
|---|---|
| `DECISIONS-MIGRATION-STAGE-2B-PHASE-5-RECONCILIATION-CHECKER-WORK-ORDER-2026-08-11.md` | revision 2, `33073` bytes / SHA-256 `75cc6db647afd6f8e6e0950ac885ba5c7b225489bb73b03236d81f3eca66ceac` |
| `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-TARGET-RECONCILE-REPORT-2026-08-11.md` | `PASS` — **defective; preserved unchanged as the contemporaneous record, never closure evidence.** SHA-256 `d1faf387c451346aec4311e6a041f4f29e62f7546d8b80070bad479c5079b195` |
| `DECISIONS-MIGRATION-STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-WORK-ORDER-2026-08-11.md` | revision 1, `31308` bytes / SHA-256 `fd252a87340e0dc44c71d35a4342bd7cd47a4547e31714f8c75a604b246e34f4` |
| `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-REPORT-2026-08-11.md` | `PASS` — SHA-256 `9c5c09b0f53e09f4baca3a5ad1ba97ff95313882adc6d85765aca3837393168f` |
| `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-SECTION-9-INDEPENDENT-EXECUTION-RECORD-2026-08-11.md` | `ACCEPT` — owner-shell non-producer execution; carries the corrected byte-0 operand ruling |
| `scripts/decisions-migration-target-reconcile.ts` (live) | `47448` bytes / SHA-256 `bd89de205fa873f8f65824e607a950c68dfe33cdc926dc1317e1d63b7aac2639` |
| `package.json` (live) | `8542` bytes; exactly one added script key |

## 3. The two defects that forced the repair, and how each was closed

**Finding A — location-blind structural verification.** The original checker verified Amendment 2's eight
structural surfaces, and the manifest M5.4 and M5.6 payloads, by global occurrence count. That predicate
establishes only that an expected payload exists somewhere in the document; a mutation of a governed
surface accompanied by relocation of the pristine payload elsewhere would pass. The §3 table header,
separator, and declared-total line retained incidental location-bound parser cover, but the §3 introduction,
the four §§4–7 heading/transition surfaces, target §8's structural introduction, and the M5.6 archive-index
block had none.

Closed by the repair, which locates each of ten governed surfaces from independent target structure —
parser-exposed line numbers plus a local top-level-section locator — and compares that located surface
exactly to its authority payload, with global uniqueness retained as an additional duplicate-detection
assertion rather than as location proof. Independently demonstrated closed by the §9 compensated-relocation
control: global uniqueness `PASS` alongside location-bound `FAIL`, which the original implementation could
not have produced.

**Finding B — unproven untracked-set delta.** The original receipt's Step 6 evidence used default
`git status --porcelain`, which collapses a wholly-untracked directory into one entry. Because
`audit/decisions-migration-2026-07-29/` is wholly untracked, no file-level change beneath it was
observable. The architect seat confirmed the collapse arithmetically: a file-level census returned 71
individually-visible untracked paths, one of which was the new checker, so the opening set under default
porcelain was 70 individual paths plus one collapsed directory entry — exactly the receipt's reported `71`.

Closed prospectively rather than retrospectively. The opening state no longer existed, so the repair order
required `git status --porcelain=v1 --untracked-files=all` at both ends of its own execution with
two-directional exact set comparison, and §9 repeated that comparison and extended it to SHA-256 coverage
over seventeen governed inputs — because an already-`M` or already-`??` path can change bytes without
changing status.

## 4. Independent architect verification, cold against live disk

This seat adjudicated from live disk rather than from any receipt's narrative, from Codex's self-report, or
from GPT's review — the latter noted, its two findings independently confirmed before acceptance, and not
relied on as the §9 null.

1. **The checker was read in full against the location-binding invariant**, and the parser was read to
   establish what the repair could and could not rely on: `sectionByLine()` is private, so the local
   structural slicer was required rather than optional; `LiveEntry.section`, `LiveEntry.line`,
   `EntryIndexRow.line`, `EntryIndex.declaredTotalLine`, and `ArchiveIndexLine.line` are the exposed
   anchors; and `parseDecisionsDocument` reads headings only in sections 4–8, so a trailing scratch `## 9.`
   section produces no parse issue — which is what makes the control's "Reports 1–8 remain PASS" assertion
   sound rather than hopeful.
2. **Extraction boundaries were verified against the actual authority payloads** before the repair order
   was issued: Amendment 2 §2.1's fence includes the `## 3. Entry index` heading, §2.3's four fences each
   include their `## N.` heading, manifest M5.4 runs from the `## 8.` heading through the
   `Archive index — thirteen wrappers…` line, and M5.6 is 26 lines of label/pointer pairs with no
   surrounding blanks.
3. **`package.json`'s single added line was confirmed arithmetically** at byte level, `8443 + 99 = 8542`,
   independent of any reported diff.
4. **Frozen identities were re-measured**, and the §9 run reproduced all seventeen governed SHA-256 values
   from a shell this seat does not have, including `DECISIONS.md` at `56964` / `3dc5dbc0c6ac…c26f4a8`
   unchanged from Phase 4 closeout.

## 5. Byte-0 operand ruling

A one-byte transcript divergence stopped the first §9 attempt and was adjudicated on corrected facts. The
leading LF is emitted by npm's own run-script launcher banner, not by any capture wrapper; a prior architect
explanation to the contrary is withdrawn as factually wrong; and the order's §5 comparison was itself
under-specified, having compared a raw capture against a markdown transcription without an extraction rule.
The operand is now the raw capture with the launcher LF excluded by asserted delimitation, with both
identities recorded. Full reasoning, and the withdrawal of proposed standing Rule 40, are at §1 of the §9
record.

## 6. Disposition

**Stage 2b Phase 5: ACCEPT.** Commission §5.7 closed. **Phase 6 (commission §5.8, conformance wiring)
remains uncommissioned**, pending a separate architect-issued work order after this closeout. The original
Phase 5 `PASS` receipt is never cited as closure evidence.
