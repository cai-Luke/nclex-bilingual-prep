# Stage 2b Phase 1 — architect closeout (commission §5.3)

**Date:** 2026-08-08 · **Seat:** Architect · **Disposition: ACCEPT**

## 1. What is closed

Commission §5.3, the parser consequence of ratified Amendment 4, is complete. The single name-addressed
`Original Kind: P/R` rejection guard is removed from `lib/decisions-format.ts`, the ratified `F14`–`F16`
and `M20`–`M23` fixtures are implemented in `scripts/tests/decisions-format.ts`, and the before/after
transition required by §5.3 items 2 and 4 was observed in the mandated order.

Phase 1 closes on architect `ACCEPT`. Phase 2 (commission §5.4, preservation snapshot) is thereby
authorized for commissioning.

## 2. The instrument chain, in order

| instrument | identity | outcome |
|---|---|---|
| `DECISIONS-MIGRATION-STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-WORK-ORDER-2026-08-08.md` | revision 3, `18112` bytes / SHA-256 `e870e05304481120ad610a0d9da3f4e677b68356d111cbd8c93fadda7fb88095` | issued; not defective; immutable |
| `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08.md` | — | `STOPPED` on the frozen order's own §7 condition 2; closed, accurate, not reopened |
| `DECISIONS-MIGRATION-STAGE-2B-PHASE-1-F16-CORRECTION-WORK-ORDER-2026-08-08.md` | revision 2, `13236` bytes / SHA-256 `c7d29a7d984eabd1fa14812ea989da78748b55f0c2712f261d4a602205959cbf` | narrow correction plus resumption authority |
| `audit/decisions-migration-2026-07-29/STAGE-2B-PHASE-1-PARSER-CONSEQUENCE-REPORT-2026-08-08-RESUMPTION.md` | — | `PASS` |

The STOP was a control operating correctly, not a failure. F16's pre-excision run produced an unpredicted
`MISSING_DECLARED_TOTAL` finding; execution halted before the excision with the parser untouched, proven
by that receipt's closing measurement matching its own opening measurement. Root cause was an
`rows: []` scaffolding construction in the F16 fixture — a test-scaffolding defect, orthogonal to F16's
actual archive-index/wrapper subject — not a commission, fixture-document, frozen-order, or parser defect.

## 3. Independent architect measurement against live disk

Measured by this seat cold, not read back from the receipt's own numbers.

| item | independently measured | receipt claim | result |
|---|---|---|---|
| Branch | `codex/decisions-migration` | same | match |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` | same | match |
| Staged paths | none | none | match |
| Modified tracked paths | exactly `lib/decisions-format.ts`, `scripts/tests/decisions-format.ts` | same | match |
| `lib/decisions-format.ts` | `47075` bytes / SHA-256 `10e59335d02eb90163b465570c4e467323d3ff9d224585774e264846590fe1e4` | same | match |
| `scripts/tests/decisions-format.ts` | `41335` bytes / SHA-256 `251b55697b202845e805201c7f972c54bac2688e9156b6ba598e11454a75d15f` | same | match |
| Excised error string, live parser | `0` occurrences repo-wide under `lib/` | deleted | match |
| Surviving seam check | `Name-addressed archive wrapper forbids Retired ID` present, `lib/decisions-format.ts:1186` | unaffected | match |
| Post-excision length arithmetic | `47250 − 175 = 47075` | `47075` | match |

The excision is a pure deletion of exactly the specified three-line block; nothing adjacent moved. The
enclosing `else` branch remains non-empty, retaining the `Retired ID` check as the order required.

**Fixture transition, as recorded in the resumption receipt and consistent with every measurement above.**
Pre-excision: `F1`–`F13` PASS, `F14` FAIL on the P guard, `F15` FAIL on the R guard, `F16` FAIL solely on
F14's P-guard rejection with no residual `MISSING_DECLARED_TOTAL`, `M1`–`M19` and `M20`–`M23` pass, exit 1.
Post-excision: `F14`–`F16` PASS, `M20`–`M23` PASS on their existing reason codes, `F1`–`F13` and
`M1`–`M19` unregressed, negative and repaired controls behave, final `decisions-format tests passed`,
exit 0. No reason code was added, renamed, or repurposed.

## 4. Allowlist conformance

The resumption produced a fourth repository path beyond the frozen order's three-path §4 allowlist. This
is authorized, not drift: the correction instrument's §2 states a complete three-item allowlist for the
resumption — the test file, the parser excision, and the separately named `-RESUMPTION` report — and
freezes it **before** any repair executes, per the standing requirement that allowlists are frozen before
repair rather than widened after it. The instrument's §3 states the deliverable-path supersession
explicitly in the resuming instrument rather than editing the frozen order's bytes or leaving the change
to inference. Live disk shows no path written outside the union of the two frozen allowlists.

## 5. Recorded notes — no action required by this closeout

1. **Architect-seat hashing primitive.** The frozen order's §3 recorded that this seat had no SHA-256
   primitive and that a length-only closeout is void where a SHA is required. That constraint did not
   bind this adjudication: this seat reproduced both closing digests independently by hashing byte-exact
   copies of the two files. The copy pipeline's fidelity is not assumed — it is demonstrated by its
   having reproduced two independently produced digests exactly. Where the primitive is available it is
   used; where it is not, the length-only prohibition stands unchanged.
2. **Ratified manifest carries a stale self-description.** `target-text-manifest.md` opens with a
   `CANDIDATE, NOT RATIFIED` banner, and those bytes are inside the ratified identity
   `332579` / `818be99a…`. Authority is established by
   `DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md`, which ratifies an external byte identity,
   not by the file's description of itself; the banner is stale self-description, not an operative
   clause. **Disposition: recorded, not repaired.** Editing it would destroy the ratified identity and
   force re-ratification, which is a strictly worse outcome than a known-stale banner. Any later seat
   reading that banner should treat this note as controlling.
3. **Commit sequencing remains open.** Phase 1 left its output uncommitted in the working tree by its own
   §4. Commission §9 requires commits that preserve review boundaries within one atomic pull request.
   Nothing about that is decided here; it is flagged so it is not discovered late.

## 6. Disposition

**Stage 2b Phase 1: ACCEPT.** Parser consequence closed. Phase 2 (commission §5.4) is authorized for
commissioning. No Stage 2a work is reopened. No contemporaneous record is reopened.
