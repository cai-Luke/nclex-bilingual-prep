# Stage 2b — resumption note for 2026-08-18

**Date:** 2026-08-12 · **Seat:** Architect · **Status:** Standing continuity artifact, not an instrument.

This note exists so that nothing below has to be reconstructed from chat. It records state and pins
authorities; it authorizes nothing and rules on nothing that was not already ruled.

---

## 1. Where the migration stands

**Stage 2b Phase 6: ACCEPT**, adjudicated 2026-08-12. Closeout at
`DECISIONS-MIGRATION-STAGE-2B-PHASE-6-CLOSEOUT-2026-08-12.md`.

Commission §5.8 (permanent conformance wiring) is closed. Stage 2b Phases 1–6 are all formally closed. The
migration is **not** at repository-conformance acceptance and is not near merge; see §5.

| item | value |
|---|---|
| Branch | `codex/decisions-migration` |
| HEAD | `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` |
| Commits made on the branch so far | **none** — every accepted Stage 2a and Stage 2b output is still uncommitted in the worktree |
| `MIGRATION_DATE` | `2026-08-18`, bound by owner act 2026-08-06 |
| Governing authority for that date | `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md` Clause B §2.2 |

## 2. `MIGRATION_DATE`, read from the ratified text rather than from summary

Amendment 1 Clause B §2.2, operative text, verified against live disk on 2026-08-12:

> `MIGRATION_DATE` is the `YYYY-MM-DD` calendar date, in `America/New_York`, of the **author timestamp** of
> the Stage 2b content commit that first contains the migrated `DECISIONS.md` and the normalized migration
> archive.

Four consequences a resuming seat must not re-derive from memory:

1. **The governed fact is the author timestamp of one specific commit**, not the wall-clock date on which
   anyone is working, and not the date assumed from conversation. At resumption, verify the calendar date
   of that commit's author timestamp in `America/New_York` — `git log -1 --date=iso-strict --format=%ad` on
   the content commit, evaluated in that zone — rather than trusting the session's apparent date.
2. **The predicate must be re-checked at the final pre-merge state of the branch**, because history
   rewriting can move the timestamp. Clause B says so expressly. Note which commands actually move it: a
   plain rebase and `git commit --amend` both **preserve** the original author timestamp, while
   `--reset-author` replaces it with the current time, as do `git rebase --ignore-date` and any explicit
   `--date` override. The recheck is required regardless of which commands were used, because Clause B
   does not condition it on the mechanism.
3. **If the predicate fails, the date is rebound under Clause B or the migration stops.** It is never
   reconciled by editing the archive filename alone. Rebinding is a bounded owner act requiring a
   manifest-only rebinding commit landed *before* the content commit, an owner-ratified date-only diff, a
   replacement manifest SHA-256, and regeneration of every date-dependent downstream artifact.
4. **Current owner plan: use the natural 2026-08-18 author timestamp.** Do not artificially set the author
   date unless separately authorized by the owner. The architect seat's recorded reasoning, offered as
   advice rather than as a rule: artificially dating the commit satisfies the mechanical predicate, but it
   leaves a permanent author/committer divergence visible to `git log --format=fuller` inside the one
   artifact this migration exists to make forensically clean, and Clause B §2.1's forcing incident treats
   the date as *describing* the migration commit. A binding prohibition, if one is wanted, requires its own
   instrument; this note does not create one.

**Therefore the content commit is to be made on 2026-08-18, `America/New_York`.** Waiting is the cheapest
of the three available routes by a wide margin.

## 3. The current state is intentional, not broken

- `Archive/DECISIONS-ARCHIVE-2026-08-18.md` is **untracked**, at `13997` bytes. This is correct. Tracking
  it is a content-commit act and was expressly unauthorized by every phase so far.
- `npm run conform:decisions` therefore **exits 1**, with exactly one finding:

  ~~~text
  [FAIL] UNTRACKED_PATH DECISIONS.md:792 assertion=15 block=Producer assignments are operational state, not constitutional text — Evidence path is not tracked: Archive/DECISIONS-ARCHIVE-2026-08-18.md
  ~~~

  This is the required Phase 6 result and evidence that tracked-path validation is live. **An exit `0`
  today would be the alarming outcome**, not the good one, because it would mean the gate step is inert.
- Repository conformance is **not accepted**.
- The **Amendment 1 rebinding window remains open** and stays open until repository conformance is
  accepted.
- `.github/workflows/promotion-gate.yml` now runs both DECISIONS commands as a gate-blocking step. Any PR
  opened from this branch before the content commit will show a red gate. That is expected, not a
  regression.

## 4. Standing instruction for the interval

**The migration worktree is to remain untouched until resumption.** No edits to `DECISIONS.md`, the
normalized archive, the preservation snapshot, the ratified manifest, `lib/decisions-format.ts`,
`scripts/decisions-format-conform.ts`, either reconciliation checker, `scripts/tests/decisions-format.ts`,
`package.json`, or `.github/workflows/promotion-gate.yml`.

Unrelated bank-promotion and content work is **not part of this migration** and occurs in a separate branch
or worktree. It must not touch `package.json`, or the content commit stops being a clean diff against the
current state.

**Backup advisory.** The normalized archive, the preservation snapshot, the ratified manifest, and every
governance receipt are untracked and exist on no remote. Parking multiplies the window in which the entire
evidence base of this migration lives in exactly one place. A cold copy of the worktree to a location
*outside* the repository is advisable; copying anything *into* the repository is not.

## 5. What is still owed after the content commit

Phase 6 closure was the last *wiring* phase, not the last phase. Still outstanding under the ratified
commission:

| owed | authority | state |
|---|---|---|
| The four-commit sequence of §9 | commission §9 | drafted, not frozen — see `DECISIONS-MIGRATION-STAGE-2B-CONTENT-COMMIT-WORK-ORDER-DRAFT-2026-08-12.md` |
| Post-migration reference-graph artifact and two-run determinism | §6, §6.5, §7.1 items 5–6 | not begun; artifact not on disk |
| `PROJECT-HISTORY.md` closeout | §5.2 item 11 | not begun |
| Full repository gate run | §7.2 | not begun |
| Independent constitutional content review of all 65 statements, 13 wrapper boundaries, E053, and E037's three-target merge | §8 | not begun; **barred to the Claude seat**, which authored the statements — route to GPT or Codex |
| `audit/decisions-migration-2026-07-29/MIGRATION-RECEIPT.md` | §10 | does not exist |

## 6. Seat and tooling reminders

- The architect seat has no SHA-256 primitive through the filesystem connectors. Digests come from the
  owner's shell (`shasum -a 256`); byte lengths from `get_file_info` are the substitute, and a length-only
  closeout is void wherever a SHA is required.
- Use `git status --porcelain=v1 --untracked-files=all`. The default `--porcelain` collapses wholly
  untracked directories and must never be used as preservation evidence.
- The file-level census was `133` immediately before the Phase 6 closeout was written. This note and the
  draft work order add to it. **Re-measure at resumption; do not carry a count forward from here.**
- `target-text-manifest.md` opens with a stale `CANDIDATE, NOT RATIFIED` banner. Authority is
  `DECISIONS-MIGRATION-STAGE-2A-RATIFICATION-2026-08-08.md`, which ratifies an external byte identity.
  Cite the ratification record, never the banner. Do not repair the banner — editing it would destroy the
  ratified identity `332579` / `818be99a…`.
- Access time is **not** probative of execution in this repository; tsx transform caching leaves sources
  unmodified since first run with frozen atimes. Adjudicated at Phase 6 closeout §4.

## 7. Continuity artifacts

The Stage 2a resume note at `DECISIONS-MIGRATION-STAGE-2A-CLAUDE-RESUME-NOTE-2026-07-29.md` remains the
authoritative carrier of the 40+ standing rulings and is not superseded by this note. This note covers only
the Phase 6 → content-commit interval.
