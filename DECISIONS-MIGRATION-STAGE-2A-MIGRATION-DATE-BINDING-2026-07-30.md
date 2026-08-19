# DECISIONS migration Stage 2a — `MIGRATION_DATE` binding

> **SUPERSEDED 2026-07-31.** The candidate `2026-07-31` bound below was superseded by the owner on
> 2026-07-31 under pre-ratification candidate supersession; `MIGRATION_DATE` is now `2026-08-11`. See
> `DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-07-31.md`. This file is retained
> unaltered below as the historical record of the 2026-07-30 owner act and is not rewritten. Its §1
> binding and §3 resolved-surface table are historical, not current.

**Owner act date:** 2026-07-30 · **Seat:** Architect (recording only; the selection is the owner's)
**Authority:** `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md` Clause B §2.2, RATIFIED 2026-07-30
**Sequence position:** Amendment 1 §6 item 5, the last prerequisite before manifest assembly

## 1. The binding

> **`MIGRATION_DATE` = `2026-07-31`.** Bound by Luke (owner) on 2026-07-30. Not defaulted, not inferred,
> not selected by any seat.

Prerequisites 12.1–12.4 of `DECISIONS-MIGRATION-STAGE-2A-PART-D-ARCHITECT-DRAFT-2026-07-29.md` were
`GREEN` before this act:

| item | discharged by |
|---|---|
| 12.1 E038 preservation-slice hash | `DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md` appendix; proof in the results file §2.3 and §3 |
| 12.2 mechanical sentence counts | Results file §4 — 65 results, distribution 1=5 / 2=25 / 3=35, none outside {1,2,3} |
| 12.3 trackedness | Results file §5 — 24 `TRACKED`, 1 `EXEMPT` under Clause A, 0 `UNTRACKED`, 0 `MISSING` |
| 12.4 Amendment 1 | RATIFIED 2026-07-30 by Luke, both clauses and both architect additions |

Results file: `DECISIONS-MIGRATION-STAGE-2A-DETERMINISTIC-PREREQUISITES-RESULTS-2026-07-30.md`, overall
disposition `GREEN`, producer Codex.

## 2. What the date means, and what it does not

Clause B §2.2 defines `MIGRATION_DATE` as the `America/New_York` calendar date of the **author timestamp**
of the Stage 2b content commit that first contains the migrated `DECISIONS.md` and the normalized migration
archive. Committer timestamp is explicitly not the anchor.

This is a **verification predicate, not a derivation.** The binding above is the owner's candidate. The
predicate is checked against the actual commit, and re-checked at the final pre-merge state of the branch,
because history rewriting can move even the author timestamp. If the predicate fails at any point before
merge, the date is rebound under Clause B or the migration stops. It is never reconciled by editing the
filename alone.

## 3. Surfaces this binding resolves

Part D §8.1's inventory, resolved against `2026-07-31`. This table records the values; it does **not**
satisfy Clause B. The assembled manifest must still resolve each surface ID to concrete locators in its own
bytes and carry the derived occurrence report proving the four conditions in Clause B §2.2.

| ID | resolved value |
|---|---|
| D1 | `Archive/DECISIONS-ARCHIVE-2026-07-31.md`, every occurrence |
| D2 | The nine non-retiring wrappers' `Date` field — E032, E036, E039b, E048, E050, E051, E052, E075, E076 — becomes `2026-07-31`, superseding the provisional `2026-07-29` |
| D3 | The nine archive-index archival phrases read `archived 2026-07-31` |
| D4 | Archive preamble title `# DECISIONS archive — 2026-07-31 cleanup migration`, and the body phrase `during the 2026-07-31 target-grammar migration` |
| D5 | E038 `Evidence` becomes `` `Archive/DECISIONS-ARCHIVE-2026-07-31.md` ``, under Clause A |

## 4. Surfaces this binding must not touch

A uniform re-date breaks ratified bytes. Part D §14 item 3 names this the highest-risk assembly step.

| ID | surface | why fixed |
|---|---|---|
| F1 | `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` | Ratified literal in Amendment 4 §3.3 item 1 and taxonomy §9 |
| F2 | `Archive/DECISIONS-ARCHIVE-2026-07-14.md` | Prior archive, never edited |
| F3 | The four retiring wrappers' `Date` — E040, E041, E042, E043b — `2026-07-28` | Historical retirement date |
| F4 | The four retired-register dates — `2026-07-28` | Historical fact |
| F5 | The four `retired 2026-07-28` index phrases | Historical fact |
| F6 | Every anchor | No anchor contains the migration date |
| F7 | `MIGRATION_BASELINE` `d499cc1d0916e03830489ec9cd0324cd1a203a73` and all thirteen span hashes | Content identity, not dates |
| F8 | The `audit/decisions-migration-2026-07-29/` directory name | The commission's own ratified path |

## 5. Rebinding trigger and cost

Clause B exists so that an honest date is safe to pick. If the Stage 2b content commit's author date is not
`2026-07-31` in `America/New_York`, a rebinding requires, in order:

1. a manifest-only rebinding commit, landed **before** the Stage 2b content commit;
2. an exact owner-ratified diff limited to the bytes §3 above authorizes as date-dependent, and nothing else;
3. a replacement manifest SHA-256, superseding the earlier one as the ratified authority;
4. both manifest hashes, both ratification records, and the rebinding act itself recorded in the migration receipt.

Regeneration on a rebinding covers, at minimum: the normalized archive filename and preamble, the migrated
`DECISIONS.md`, the post-migration reference-graph artifact of commission §6.1, the target reconcile run, the
live conformance run, and the receipt. A rebinding after the §8 independent review has returned `ACCEPT`
sends the date-only diff and the regenerated derived report back to that reviewer, and reopens nothing else.

Rebinding is permitted until repository conformance is accepted. After that, a date change requires a new
commission. The owner selects and ratifies any replacement date; the architect seat performs the
deterministic re-render; Codex never edits ratified manifest bytes.

## 6. What this unblocks, and what it does not

Assembly of the candidate `audit/decisions-migration-2026-07-29/target-text-manifest.md` may now begin. That
deliverable must, per Part D §14 items 9 and 10:

- inline all four Parts A–D, including the per-block source-boundary rationales and source spans Parts A–C
  left to assembly, with no pointer to a sibling draft file surviving;
- carry no surviving `<MIGRATION_DATE>` token;
- carry the Clause B date-surface inventory resolved to concrete locators, and the derived occurrence report;
- apply the two carried Part C corrections (`R2#0` `Owner` struck; E038 `Owner` struck, statement repaired,
  `Evidence` pinned);
- sweep every stale Amendment 1 lifecycle phrase — the amendment is RATIFIED, and the draft still reads
  "pending ratification" in seven places.

This binding ratifies no entry wording. The exact manifest bytes still require GPT independent review under
commission §8 and Luke's exact-byte ratification under commission §12 before any Stage 2b work begins.
