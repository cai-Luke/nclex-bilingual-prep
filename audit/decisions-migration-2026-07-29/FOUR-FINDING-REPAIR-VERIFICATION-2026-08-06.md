# Stage 2a — four-finding repair verification

**Date:** 2026-08-06/07 · **Verifier:** Codex

**Overall disposition: FAIL.** The live manifest contains the four recorded final repair spans and
all non-hash invariants below pass, but reversing those spans in memory does not reproduce the pinned
pre-repair identity. No repair was made, and the fresh full constitutional review was not started.

## Inputs and identities

- Completion order: `DECISIONS-MIGRATION-STAGE-2A-FOUR-FINDING-REPAIR-COMPLETION-WORK-ORDER-2026-08-06.md`
- Repair report: `audit/decisions-migration-2026-07-29/FOUR-FINDING-REPAIR-REPORT-2026-08-06.md`
- Live manifest: `audit/decisions-migration-2026-07-29/target-text-manifest.md`
- Live manifest measurement: `314810` bytes; SHA-256 `72ae9a0a81295a6c4f7565ae1140a0e36e5852874df0cbc37bf46e339d2be5ab`

## Required checks

| # | Check | Result | Evidence |
|---:|---|---|---|
| 1 | Independently remeasure the completion order | **PASS** | `15192` bytes; SHA-256 `a7e755dcc32b0649d006781037c1abfb31db762233abdcf662a9bba6bf806383`, exactly matching the opening identity. |
| 2 | Live manifest contains only the four final repaired spans | **PASS** | `M4.3 / P2#0`, final `M4.4 / P2#1`, `M4.5 / P3#0`, and `M4.35 / P28#0` each matched exactly once; each original text was absent from live text; the superseded intermediate `M4.4` formulation matched 0 times. |
| 3 | Reverse exactly those four final spans in memory, each exactly once | **PASS for the exact-once operation; FAIL as an original-null proof** | All four reversal targets matched exactly once in memory. The resulting byte sequence is not the pinned pre-repair null; see check 5. |
| 4 | Reverse `M4.4` directly to the original clause | **PASS** | Reversed directly from the final clause to `` `Owner` — `OMIT`; same reason. ``. The superseded intermediate formulation was not used as a reversal target and is absent from live text. |
| 5 | Reconstructed bytes equal `314491` / `9d3283086a93daa3e0925ff539f9d98d5914cc9955035f129f3178329804fe5a` | **FAIL** | In-memory reconstruction measured `314495` bytes with SHA-256 `bbb7933fb84876eb915dbc5b28f3b467c5c8c242a4db516de0f1d86b74b3fc3f`. The recorded span deltas total 315 bytes, while the live-to-pinned-null delta is 319 bytes: an unexplained 4-byte discrepancy remains. |
| 6 | `M4.38 / P31#0` byte-identical to the reconstructed null | **PASS** | Live and reconstructed candidate slices are both `3153` bytes with SHA-256 `de87d24dde297dab2fdb752cbae64f08da3bd51576bd065228a21d8fd805cc05`. |
| 7 | All of M6 byte-identical to the reconstructed null | **PASS** | Live and reconstructed candidate M6 slices are both `44022` bytes with SHA-256 `e556ddfacde029ef78defef696a634d1644e8af44896a036d3451b3f953edf8f`. |
| 8 | Zero `same reason` occurrences remain in live M4 | **PASS** | Whole-word phrase count is 0. A raw substring search returns 1 only because unchanged R6 text contains `same reasoning`; that is not the phrase `same reason`. |
| 9 | Encoding and terminal-cursor invariants | **PASS** | Strict UTF-8; U+FFFD `0`; CRLF `0`; bare CR `0`; final LF present; exactly one `@@ASSEMBLY_CURSOR@@`, terminal; physical lines `5946`. |
| 10 | `DECISIONS.md` remains byte-identical to `MIGRATION_BASELINE` | **PASS** | `76314` bytes; SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`, matching the pinned baseline; `git diff --quiet -- DECISIONS.md` exited 0. |
| 11 | Branch and HEAD remain fixed | **PASS** | Branch `codex/decisions-migration`; HEAD `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`. |
| 12 | No unauthorized repository mutation during verification | **PASS** | Before and after writing this deliverable, `git status --porcelain=v1` had 40 lines and the normalized digest was `d24d0b3f53990a94dcd76f8bebedd5e457ec166f748dae2483059936f04869e4`; tracked and staged diffs remained empty. The audit directory grew from 22 to 23 files, exactly by this deliverable. |
| 13 | Process/documentation defect is disclosed accurately | **PASS** | The repair report explicitly states that the opening identity was genuinely returned and acknowledged before the `M4.4` edit, but the report was created afterward (`M4.4` at `2026-08-07T01:32:38Z`; report first created at `2026-08-07T01:34:00Z`). This is recorded as a documentation-location and sequencing defect, not converted into contemporaneous compliance with completion-order §5 steps 2–3. |

## Verification conclusion

The bounded final-span inventory, direct `M4.4` reversal rule, M4/M6 locality checks, encoding checks,
baseline check, branch/HEAD check, and process disclosure all pass. The verification is nevertheless
**FAIL** because the required in-memory reconstruction does not equal the pinned pre-repair byte
identity. This deliverable makes no attempt to repair or explain away the 4-byte discrepancy.
