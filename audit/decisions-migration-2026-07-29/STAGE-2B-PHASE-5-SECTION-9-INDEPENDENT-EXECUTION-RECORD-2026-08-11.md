# Stage 2b Phase 5 — §9 independent-execution record

**Date:** 2026-08-11 · **Seat:** Architect (record) · **Executor:** Owner local shell · **Result: ACCEPT**

## 1. Byte-0 operand ruling — corrected on the independent evidence

The Phase 5 location-binding repair order's §5 required the repaired checker's canonical zero-argument
output to be compared byte-for-byte against the transcript preserved in the original Phase 5 receipt, and
its stop condition 7 made any divergence a stop returning to the architect seat for adjudication. That stop
fired on the first independent attempt: a direct owner-shell `npm run reconcile:decisions-migration-target
> file 2>&1` produced `1906` bytes / SHA-256
`8ccb40e7a92090fa0de7f9e9b182e6bec60039e000cb977bc5965951a2cd343c`, against a preserved reference of
`1905` / `29efcc7c0f2318a51f9dac52d63c454c2ac624c9a81a8377fe694e159aa25c75`. The difference is byte 0, one
LF.

**The prior architect explanation is withdrawn.** An earlier adjudication of this same one-byte difference
held that the LF was "capture-wrapper framing" — a byte contributed by an execution channel outside the
invoked command. That explanation was asserted without measurement and is **factually wrong**. The byte is
reproduced by a plain local shell redirection with no wrapper, tee, or model execution layer present. It is
emitted by npm's own run-script launcher banner, which precedes the `> pkg@version script` lines, and it
therefore precedes any byte written by `tsx` or by the checker itself. The repair receipt's wording — "the
command wrapper emitted one conventional leading LF before the npm banner" — is superseded as an
explanation of provenance. That receipt is a closed contemporaneous record and is **not edited**; this
section is the correction.

**A "historically defined gate transcript boundary" is also rejected.** The original Phase 5 receipt's
fenced block begins at the banner `>` because a markdown transcription cannot faithfully carry a leading
blank line, not because any instrument delimited it there. Treating that as a pre-existing governed
boundary would retroactively canonize a transcription artifact in order to make a fail-closed gate pass.

**What was actually defective is the order's own comparison.** §5 compared a raw command capture against a
transcript embedded in a markdown document without specifying an extraction rule between them. Those are
different objects. The comparison was not well-posed, and that defect belongs to the architect seat that
issued the order.

**Ruling.** For §5 and stop condition 7, the operand is the raw command capture with npm's launcher LF
excluded by explicit, asserted delimitation, and **both identities are recorded as separate quantities**.
This is a new ruling on corrected facts, effective for the rerun; it does not amend the frozen order and
claims no pre-existing boundary. The rerun instrument asserts that byte 0 is exactly `0x0a` and that byte 1
is not, so a future change to npm's banner shape fires the gate rather than being silently absorbed.

**The substantive requirement is satisfied and provably so.** The checker can neither emit nor suppress
npm's banner; its own output begins after it; and the `1905`-byte suffix is byte-identical to the preserved
transcript. `AGENTS.md`'s audit/maintenance-tooling requirement of explicit proof that a maintenance
tool's default behavior and output are unchanged is discharged at byte level by a non-producer seat.

**Proposed standing Rule 40 is withdrawn and is not recorded.** Its wording rested on the falsified
capture-channel premise. Any successor rule must be redrafted against the launcher/transcript-boundary
facts above and approved by the owner before it is treated as law. It also cannot be written into
`DECISIONS.md` while the migration is open: that file is pinned at `56964` / `3dc5dbc0c6ac…c26f4a8` and is
the checker's canonical input, so a new entry would break Phase 5 and contradict Phase 4's accepted target.
Any such rule is a queued post-migration write.

## 2. Instrument and executor

The §9 instrument was authored by the architect seat and written to `/tmp/shrimp-phase5-s9.sh` as a
complete script, then executed as a file rather than pasted as a statement stream into an interactive
shell. This shape is deliberate: an earlier attempt used a pre-pasted stream whose fail-closed `exit 2`
terminated the interactive child shell, after which the terminal continued feeding the remainder of the
paste into the parent zsh from the home directory. Everything in that earlier terminal after the `ABORT`
line is post-abort paste spillover — wrong working directory, undefined `abort`, undefined `$OUT`,
attempted root-level writes that failed read-only — and is **not** §9 evidence. Repository state was
re-read afterward and showed no damage. The atomic form removes that failure mode entirely: `exit 2`
terminates only the script process.

Executor: the owner's local `bash-3.2` shell on the repository host. The owner produced neither the checker
nor the repair. All scratch writes were confined to `/tmp`; the repository was read-only throughout.

## 3. Opening measurement

| item | measured |
|---|---|
| Branch | `codex/decisions-migration` |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| Opening `git status --porcelain=v1 --untracked-files=all` | 127 lines |
| Repaired checker | `47448` bytes / SHA-256 `bd89de205fa873f8f65824e607a950c68dfe33cdc926dc1317e1d63b7aac2639` |

Seventeen governed inputs were hashed at opening. Values, verbatim:

```text
3dc5dbc0c6acbfe4f74fa353b80d53c7feeec4f5ada0a42d7b9773f26c26f4a8  DECISIONS.md
e75e979ea121fa1a697861f8de4a4527f07ef2d8b7ed1f4d299bf504163e873c  Archive/DECISIONS-ARCHIVE-2026-08-18.md
b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e  Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md
818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2  audit/decisions-migration-2026-07-29/target-text-manifest.md
4cb16995cf8810bcf3ee65ffb07dc32a14a4fb5b0c4adc8ba5bbb2a2a535e9f4  DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-STRUCTURAL-SURFACES-2026-08-08.md
9a1a3a898bf847d8dbe760c7aba702f3a3c3c3381c760bba989ffa5b8542944e  DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-ASSEMBLY-JOINS-2026-08-08.md
5d70d7f61ef1243a70ea59b8de0aee7b25dada45672ee93e203e808dfff14827  DECISIONS-ARCHIVE-PRESERVATION-AND-WRAPPER-ADDRESSING-AMENDMENT-2026-07-29.md
cfae5a898c1520173d835af5d0e29b4c0bfd2b135a40fb4335de82b34da1333e  audit/decisions-cleanup-2026-07-24/inventory.md
89a2812dc955a61e45723bf6c242e247f467df71c7daa301b4fde2fcae1a4535  audit/decisions-cleanup-2026-07-24/migration-table.md
3821323c711866e655fd25b044add86c33cdc859762a4aa6f62d522ff158440e  audit/decisions-cleanup-2026-07-24/outline-before-after.md
10e59335d02eb90163b465570c4e467323d3ff9d224585774e264846590fe1e4  lib/decisions-format.ts
8f0ade576da1515e7400b7f6c54990b4ae71ea2cd5b1846b7f788d71ab4af582  package.json
be8f258b6d0145b91a5e4605f920c84e668a0396742b3fb88773c0bcbb5f8420  scripts/decisions-migration-reconcile.ts
bd89de205fa873f8f65824e607a950c68dfe33cdc926dc1317e1d63b7aac2639  scripts/decisions-migration-target-reconcile.ts
fd252a87340e0dc44c71d35a4342bd7cd47a4547e31714f8c75a604b246e34f4  DECISIONS-MIGRATION-STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-WORK-ORDER-2026-08-11.md
d1faf387c451346aec4311e6a041f4f29e62f7546d8b80070bad479c5079b195  audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-TARGET-RECONCILE-REPORT-2026-08-11.md
9c5c09b0f53e09f4baca3a5ad1ba97ff95313882adc6d85765aca3837393168f  audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-5-LOCATION-BINDING-REPAIR-REPORT-2026-08-11.md
```

## 4. §9 requirement 1 — historical reconciliation rerun

`npm run reconcile:decisions-migration`, exit `0`. Substantive output:

```
DECISIONS migration reconciliation passed.
inventory=80; independent=79; STAY=65; ARCHIVE=14; MERGE_INTO=1
sections: §4=37 (25 permanent numbers), §5=6, §6=19, §7=3, §8=14

```

## 5. §9 requirement 2 — target reconciliation rerun, and the established-gate output proof

`npm run reconcile:decisions-migration-target`, exit `0`. The canonical zero-argument run emitted no `Structural diagnostics [TEST]` line, confirming the test-only diagnostic surface is gated on an override flag and is absent from default behavior.

| operand bytes SHA-256     |        |                                                                    |
| ------------------------- | ------ | ------------------------------------------------------------------ |
| Raw direct npm capture    | `1906` | `8ccb40e7a92090fa0de7f9e9b182e6bec60039e000cb977bc5965951a2cd343c` |
| Delimited gate transcript | `1905` | `29efcc7c0f2318a51f9dac52d63c454c2ac624c9a81a8377fe694e159aa25c75` |

Delimitation was asserted, not assumed: byte 0 measured `0x0a`, byte 1 measured `0x3e` (the `>` opening npm's banner), confirming exactly one launcher LF and that nothing beyond it was excluded. The delimited transcript is byte-identical to the transcript preserved in the original Phase 5 receipt. **The repaired checker, carrying materially stronger internal predicates, emits the identical default output as the implementation it replaced.**

Reports 1–8 all `[PASS]`; `Amendment 2 surfaces [PASS]`; `Amendment 3 joins [SCOPE]`; `Amendment 4 E053 [PASS]`; `DECISIONS target reconciliation passed.`

## 6. §9 requirement 3 — independently constructed negative control

A compensated-relocation control was constructed against an ephemeral `/tmp` copy through the checker's documented three-flag test-only interface. The canonical §4 transition's final nonblank line was mutated by replacing its terminal `.` with `X`, preserving line count and parser structure; a synthetic trailing `## 9. Negative-control scratch` section was appended carrying one pristine copy of the exact ratified Amendment 2 §4 payload behind a `SENTINEL:` prefix, so that the payload remains an exact substring of the target text while its leading `## 4` does not begin a physical line and cannot become a second structural section heading.

Fixture anchors, derived structurally: §4 heading line 158; first §4 entry line 165; mutated line 163; pristine payload 6 lines.

Control exit `1`, with exactly one emitted failure:

```
FAIL: Amendment 2 surfaces: §4 heading/transition: location-bound target bytes differ from ratified Amendment 2 §2.3

```

Discriminating verdicts, verbatim:

```
Structural diagnostics [TEST] — required sections unique [PASS]; Amendment 2 location-bound [FAIL]; Amendment 2 global uniqueness [PASS]; M5.4 location-bound [PASS]; M5.4 global uniqueness [PASS]; M5.6 location-bound [PASS]; M5.6 global uniqueness [PASS]; parsed §8 archive-index count [PASS] (13).

```

Reports 1–8 all remained `[PASS]`; `Amendment 4 E053` remained `[PASS]`; required-section uniqueness remained `[PASS]`.

**This is the substantive proof that Finding A is closed.** The pair — global uniqueness `PASS` alongside location-bound `FAIL` — establishes that the *original* Phase 5 implementation would have passed this fixture, because its predicate was satisfied by the relocated pristine copy, while the repaired implementation fails it at the governed location. The defect is demonstrated closed by a fixture that would have defeated the prior code, executed by a seat that produced neither.

## 7. §9 requirement 4 — restoration and no-mutation evidence

All seventeen governed SHA-256 values re-measured at closing were identical to §3, compared by full diff in both directions. The closing `git status --porcelain=v1 --untracked-files=all` path/status set was identical to the opening set, compared in both directions. Nothing was staged, committed, pushed, moved, renamed, or deleted. `package.json` and the original Phase 5 receipt are byte-unchanged.

## 8. Recorded limits of this record

Two limits are stated rather than implied, so a later seat does not read more independence into this record than it carries.

1. **`npx tsc -b --pretty false`** **was not re-run under this instrument.** It is not among the four §9 independence requirements, and `tsx` strips types without checking them, so the constitutional TypeScript check for the repaired checker remains **producer-attested** from the location-binding repair receipt and is not independently reproduced here.
2. **The §9 instrument and its control fixture were authored by the architect seat, which also adjudicates this record.** The separation that governs is preserved — the architect authored neither the checker nor the repair implementation, GPT cold-reviewed the repaired checker, and the owner executed — and a mis-built fixture would have tripped the script's fail-closed assertions rather than passing quietly. The overlap is recorded because it is real, not because it defeats the separation.

## 9. Disposition

**§9 independent execution: ACCEPT.** All four requirements of the Phase 5 revision-2 order §9 are discharged by a non-producer executor, with fail-closed assertions rather than diagnostic display, and with opening/closing preservation proved over governed bytes as well as paths.
