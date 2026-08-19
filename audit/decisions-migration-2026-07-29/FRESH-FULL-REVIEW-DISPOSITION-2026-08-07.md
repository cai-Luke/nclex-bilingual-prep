# Fresh full constitutional review — tranche F and disposition

## Opening identity and authority

- Work order, revision 1: **12023 bytes / SHA-256 `07e8c6dbc5f792d592a7b4b88dcf154eb3f5ef70657e9b3f91758658351e5250`**.
- Fresh subject measurement: `audit/decisions-migration-2026-07-29/target-text-manifest.md`, **314811 bytes / SHA-256 `e99335567d157a86f8f2b6f178b7222bf86ccfe15e5f827da5a03864c1d04b31`**.
- Branch: `codex/decisions-migration`; HEAD: `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`.
- Population: **Tranche F — M5.1–M5.4, all of M6, and whole-manifest checks F1–F9**.
- This is a fresh structural and cross-cutting review. The prior full-review disposition and tranche outputs were read only as historical defect provenance; no prior clearance was used.

## M5 structural surfaces

| check | fresh result | disposition |
|---|---|---|
| M5.1 archive shape/order/separators | PASS | The 13 wrappers are in ascending source-byte order; each wrapper has the required heading, fixed field order, preserved body, and independently verified separator of 1 LF, 2 LFs, or none as pinned. |
| M5.2 archive preamble | PASS | The E038 preserved prose is in the pre-wrapper preamble construction, outside wrapper bodies; its current manifest pin is `[52641,53203)`, 562 bytes, SHA-256 `d5603bebbc00308c04f938279960c2873a849ae1c622419a7095c0bf3789c3cf`. |
| M5.3 E038 construction / Clause A | PASS | The one future-output `Evidence` value equals the normalized archive filename pin exactly; it is exempt, not missing, and no placeholder/trackedness fabrication occurred. The source slice boundary excludes the packet’s following blank line as required. |
| M5.4 E053 structural introduction | PASS | Target §8 contains the structural archive/retired-identifiers introduction; it has no wrapper, index line, or register row, and it names the three preservation files without changing the archive-source count. |

## M6 field and omission surfaces

| check | fresh result | measured/current result |
|---|---|---|
| M6.0–M6.1 field tests | PASS | Evidence and Owner use separate tests; no Owner-only ground appears on Evidence and no Evidence-only ground appears on Owner. Rationale is not treated as a carrier. |
| M6.2 optional-field ledger | PASS | 65 live blocks × 5 optional fields = 325 slots; 68 present and 257 omitted; `Authorized` 2/63, `Not authorized` 4/61, `Evidence` 6/59, `Owner` 14/51, `Execution` 42/23. |
| M6.3 Evidence/Owner omission register | PASS | Exactly 110 rows; every row is `OMIT`; all rows identify source, block, field, candidate label, ground, disposition, and owning record. Ten rows are first grounded at M6 and are separately checked. |
| M6.4 governed present paths | PASS | 20 field instances across 19 distinct paths; 18 distinct paths are tracked; one path is the exact E038 future-output filename exception. |
| M6.5 rejected co-candidate | PASS | The sole rejected populated-field co-candidate is `scripts/promote.ts` for P1 Owner; `lib/shuffle.ts` remains the singular owner. |
| M6.6 non-Evidence/Owner omissions | PASS | The 63/2 Authorized, 61/4 Not-authorized, and 23/42 Execution omission/presence counts match the live ledger and frozen classifications. |
| M6.7 first-grounded rows | PASS | Exactly 10 register rows are first grounded at M6; the field-specific Evidence/Owner distinction is preserved. |
| M6.8 draft divergences | PASS | Exactly 7 recorded divergences are treated as manifest-governed adjudications, not as unreviewed draft drift. |
| M6.9 no-register surfaces | PASS | Wrappers, E053, E037, M5.7, and structural prose correctly generate no Evidence/Owner omission rows. |
| M6.10 derived counts/ground vocabulary | PASS | 15 grounds; 6 Owner-only, 4 Evidence-only, 5 both; the listed row/token distributions agree with the live register. |

## Whole-manifest checks

### F1 — entry-index count and row contact — PASS

The manifest’s M0.3 accounting declares 65 live blocks, 65 entry-index rows, and declared total 65. Independent enumeration of the current M4 index rows returns exactly 65. Each row was compared with the corresponding M4 heading/summary in the current subject; no row is missing, duplicated, or out of the adopted block order.

### F2 — live composition — PASS

Independent enumeration returns exactly **37 `P` blocks across 25 distinct live P identifiers, 6 `R` blocks, 19 `I` blocks, and 3 `T` blocks**. The sum is 65.

### F3 — P/R grouping and attachment ordinals — PASS

The P cores are in ascending identifier order, attachments are contiguous beneath their core, and attachment ordinals are contiguous from `#1` through the recorded maximum. R entries are contiguous and ascending `R1`–`R6`. No attachment is detached from its core or assigned to another identifier.

### F4 — title uniqueness and addressing shape — PASS

The 22 live name-addressed `I`/`T` titles are unique; the 13 wrapper labels are unique; the combined name-addressed title population has no duplicate; no wrapper label begins with a reserved `P<n>` or `R<n>` shape; every wrapper label matches its M5.6 index label and corresponding heading-derived anchor.

### F5 — I:/T: citation matcher — PASS

The current manifest contains one operative `I:` citation, `I: `Runtime audio carries no client-embedded secret``, in the P20 statement. Its bytes are physically intact and resolve exactly to the M4.47 name-addressed title. No unresolved `T:` citation is present.

### F6 — present Evidence/Owner paths — PASS

All 20 present `Evidence`/`Owner` instances were checked against the live tracked path set. Nineteen distinct paths are represented; 18 are tracked. The sole exception is E038’s future-output normalized archive filename, whose exact equality to the M0.1 pin was verified. No other path receives the exception.

### F7 — exact 80-row reconciliation — PASS

The fresh reconciliation is **80 rows exactly**: 65 live M4 records + 13 M5.5 wrappers + structural E053 + merge-only E037. E037 has no independent target block and its two rules are carried in P2#0/P5#0 and P8#0 as pinned. E053 has no wrapper/index/register row as required.

### F8 — retired and never-assigned register — PASS

M5.7 is exactly:

- `P9`, `P12`, `P18`, `P22` — `RETIRED`, each dated `2026-07-28` and pointing to its ID-addressed wrapper;
- `P13`, `P14` — `NEVER ASSIGNED`, with em-dash date and pointer cells.

The four ID-addressed wrappers agree with those four retired rows; no live entry carries a listed retired/never-assigned identifier.

### F9 — repository and Stage 2b boundary — PASS

At review opening, the pinned branch was `codex/decisions-migration`, HEAD was `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`, the tracked worktree and index were clean, and live `DECISIONS.md` was byte-identical to the baseline at **76314 bytes / SHA-256 `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e`**. The Stage 2b path set was read only; no parser, target assembly, archive, snapshot, reconciliation, project-history, workflow, or package mutation was initiated by this review. Closing equality of these pins is required by §9 and is measured after this sixth receipt.

## Fresh review outcome

- Tranche A: 18/18 CLEAR.
- Tranche B: 19/19 CLEAR.
- Tranche C: 18/18 CLEAR.
- Tranche D: 10/10 CLEAR.
- Tranche E: 13/13 CLEAR; M5.6/M5.7 correspondence CLEAR.
- Tranche F: M5 and M6 surfaces plus F1–F9 PASS.
- No FINDING or QUESTION was raised in this fresh run. Sentence-count grammar, Task 2, Task 3, the derived date-occurrence report, Stage 2b, and owner ratification remain outside this commission and were not begun.

## Overall disposition

**ACCEPT**

This disposition accepts the current closed manifest for the commissioned fresh full constitutional review only. It authorizes no repair, no target or source-file mutation, no existing-receipt edit, no Stage 2b implementation, and no subsequent task execution.
