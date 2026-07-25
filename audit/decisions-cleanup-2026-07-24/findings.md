# DECISIONS.md Cleanup — Phase 1 (Pass 2) — Findings

Conflicts, duplications, the LAPSED review queue, the resolved-count delta against pass 1, resolver
scope, and the verification record. **Nothing here edits `DECISIONS.md`.**

`SURVEY_HEAD = f68210ceb62e42d7f028157629a770faf02eab42` (governance-doc commit).
`generatorGitSha = 575f65fa532dabb4286b5279033fc54c5261ea15` (generator commit, later by design).

---

## A. Corrections to pass 1's own errors (not owner ratifications)

Two rows pass 1 recorded as force-change escalations are not force changes. The spec's own amendment
record names both explicitly (§8): *"pass 1 did this twice, for the CBC unit-display amendment and
for the stage-3 vital-sanity ratifications, both of which self-declare as governing in their own
text... Cleanup repairs placement; it never re-mints a ratification, and it must never appear to."*

### A1 — E049 (CBC conventional-first + SI-paren) — mis-file, not force change

Sits under a §8 heading tagged `Status: SUPERSEDED`, but its own text (line 347) reads in the
present, governing voice: *"The governing rule is **analyte-aware**..."* Force-as-written was always
`BINDING`. The correct repair is **placement** (move out of the superseded section into §5 rulings as
`R2`), not an owner ratification of a force change.

### A2 — E047a (SBP `400` / RR `150` / `spo2` `0%`) — mis-file, not force change

Sits inside a `§7 Revisit queue` bullet, but its own text (line 339) reads: *"Stage 3 closed
2026-07-24 with three per-side ratifications."* Under Amendment 2, `REVISIT` is `T`-only — a settled
ruling does not inherit a queue's status by sitting inside it. The correct repair is **status**
(`REVISIT`→`ACTIVE`) and **kind-location** (moves to §5 as `R4`), not a force ratification. Force-
as-written was always `BINDING`.

**Net result: zero force-change escalations survive into this pass's migration table.** Every
force-before equals its force-after once force is read from the entry's own wording rather than from
where it currently sits.

---

## B. Structural corrections (kind was doing work-state's job — Amendment 1)

### B1 — E044 (principle 20) — retained, not retired

Pass 1 filed the parked audio principle as a thread, which — under the taxonomy as first written —
would have retired principle number 20. This is Amendment 1's own motivating example: *"An entry
demoted from rule to thread because its implementation is pending has been silently weakened."* E044
is `P`/`PARKED`/`ADVISORY`/`EXECUTION:INACTIVE`, and principle number **20 stays live**.

### B2 — E029 (flowsheet implementer note) — a ruling, not a thread

Pass 1 read "not architect-gated" as "optional." Re-read against the taxonomy's kind test: what to
build is fully decided (*"reinstate the visible flowsheet so shipped code matches this ratified
model. No further architect input is required"*) — only the build is outstanding. Reclassified
`R`/`ACTIVE`/`BINDING`/`EXECUTION:PENDING`. This is a correction to my own pass-1 reading; the
taxonomy amendments made it visible by forcing an execution-state determination on every row, but the
misreading itself predates the amendments.

### B3 — Principle 8 restored (E039 → E039a/E039b)

First application of the taxonomy's `CONDITIONAL` carve-out (owner ruling, spec §8). The universal
core — clinical truth and answer logic have an explicit upstream owner; downstream steps may read but
never invent or alter them — is de-conditionalized, keeps number 8, returns to `ACTIVE`. Lane-
specific detail (Opus skeleton shape, compiler topology, optional synthesis-zone mechanics) archives
as `E039b`. This is a genuine content restoration, not a placement repair: pass 1 archived principle
8 in full; it is now half-restored to live governance.

### B4 — No `P31` (E037 dissolves)

Owner ruling: E037's first rule duplicates principle 8's now-restored core (dedupe, not a separate
home); its second rule is an application of principles 2 and 5 and attaches there. `MERGE`
destination — the one row in this migration that is neither `STAY` nor `ARCHIVE`.

---

## C. The LAPSED review queue, sorted (spec §6 — "a review queue, not a defect list")

116 references at `SURVEY_HEAD` resolve to a principle number that exists but is currently lapsed
(principles 8, 9, 12, 18, 22 — all five sit under the "Conditional lane contracts... LAPSED
2026-07-18" heading in the frozen `DECISIONS.md` text, which this generator measures and does not
edit). Breakdown by target: **principle 8 — 39**, **principle 9 — 18**, **principle 12 — 19**,
**principle 18 — 17**, **principle 22 — 23**.

The spec requires principle 8's citations be recorded as category 3, principle 18's as an open owner
question, and (§6, closing) the same question extended to 9, 12, and 22. Every one of the 116 was
read in context (50 from non-`Archive/` sources — the highest-scrutiny set, since a stale claim would
most plausibly live in currently-read governance prose, not a retired spec — plus a full file-level
sweep of the remaining 66 `Archive/` citations for anomalies).

### Category 1 — valid historical citations (no action): **66 of 116**

All 66 `Archive/`-sourced lapsed citations. Every one sits in a spec that either predates the
2026-07-18 lapse (describing the then-active pipeline) or **is** the retirement spec itself
(`Archive/root-specs-2026-07-18/OPUS-SKELETON-RETIREMENT-CODEX-SPEC-2026-07-18.md`, 4 citations).
Largest single source: `Archive/opus-skeleton-retrofit-spec.md` (18 citations) — a pre-retirement
spec for the lane those principles governed. No anomalies found in a full file-level sweep (28
distinct files, none dated or worded as if the lane were still active).

### Category 2 — stale present-tense authority claims (a real defect): **0 of 116**

None found. Every non-`Archive/` citation (50 total, individually inspected) reads correctly for a
lapsed target:

- **`PRODUCER-VOCABULARY-LEAKAGE-REMEDIATION-CODEX-SPEC-2026-07-21.md`** (3 citations to principle
  12) is a *model* of correct handling, not a defect: *"`DECISIONS.md` principle 12 is lapsed with
  the retired skeleton-generation lane and is not the authority for this repair"* and *"without
  reintroducing lapsed principle 12."* It cites the lapsed principle by name precisely in order to
  disclaim its authority.
- **`PROJECT-HISTORY.md:1545`** (citations to 8, 9, 12, 18) records the 2026-07-14 documentation pass
  that *created* the conditional grouping — a past-tense chronology entry, not a current claim.
- The remaining 46 non-`Archive/` citations are within `DECISIONS.md`, `DECISIONS-TAXONOMY-2026-07-
  24.md`, and `DECISIONS-CLEANUP-PHASE-1-SURVEY-CODEX-SPEC-2026-07-24.md` themselves — meta-
  discussion of the citation grammar and the owner rulings that are the subject of this very survey,
  not authority claims about a currently-binding principle 8/9/12/18/22.

### Category 3 — surviving universal core, restoration ratified: **39 of 116**

All 39 citations to **principle 8**. Owner ruling (spec §8) restores its universal core under number
8. Every one of these citations — whether read historically (in `Archive/`) or as live cross-
reference (in `DECISIONS.md` §5's own lapse note, or in the taxonomy/spec discussing the ruling
itself) — will read correctly once principle 8 is marked `LIVE` by a post-phase-2 graph. No action
needed on the citations themselves; the *target's* status changes, not the citing text.

### Open owner question (not sorted into 1/2/3 — spec §6, extended to 9, 12, 18, 22): **77 of 116**

Citations to principles **9 (18), 12 (19), 18 (17), 22 (23)**. Individually, every one of them reads
as category 1 (valid historical or correct self-aware lapsed-citation, per the inspection above) —
**but** whether the *target* itself has a surviving core like principle 8's is explicitly not decided
by any ruling to date (spec §8: *"Principles 9, 12, 18, and 22 are not ruled on... Do not extend
ruling 1 to them by analogy."*). This is routed to the owner as a standing question, not resolved
here: **does any of 9, 12, 18, or 22 have a universal-core fragment worth restoring, the way
principle 8's did?** A quick read of each suggests candidates worth asking about specifically:
principle 9's CJK-presence gate (English-only skeleton, bilingual concentrated downstream) and
principle 18's "fact-check/currency and flag-review are chain steps, not optional asides" both read
as generalizable beyond the retired lane; principle 12's closed-world-construction mechanism and
principle 22's `opus*`-routing rule are more lane-specific (and 22's routing fragment is *already*
independently preserved live as `E043a`, regardless of what happens to principle 22 itself — see D
below).

---

## D. Force-preservation hazard (unchanged from pass 1, still live): E043a

E043 (P22) is bound for the archive as a lapsed conditional principle, but E036 (the §5 lapse note,
line 300) states the `opus*` case-ID routing in `scripts/audit/early-bank-semantic-layer-a.ts` *"is
unaffected and stays in force."* The split holds: **E043a** (routing, `I`/`ACTIVE`/`BINDING`,
`EXECUTED`) stays independently of whatever the open question above decides about principle 22 itself
(`E043b`, archived). If phase 2 archives P22 as a single unit, a binding invariant is silently
downgraded.

---

## E. Duplications (compression-rule candidates — taxonomy §2, unchanged from pass 1)

- **Category-weighting told three times:** P10 (E010), the "Category targets" invariant (E066), and
  the "Study-session distribution" pointer (E075) — all three point at `NCLEX_CATEGORY_WEIGHTS`/
  `src/sessionSampler.ts`.
- **Vitals-`sanity` told across §3/§7/§8:** the §3 decision-index REVISIT bullet paraphrases E047; §8
  carries E051, a withdrawn characterization of the same subject E047a/b/c now supersede in effect.
  Phase 2 regenerates §3 as a one-line-per-entry index rather than porting these paraphrases.
- **High reproduced-evidence entries (evid% ≥ 55, compression headroom — byte lengths unchanged from
  pass 1):** E035 (P30, 3.4 KB), E047 cluster (3.2 KB), E015, E021, E028, E034, E013, E052, E036.

---

## F. Open owner questions (this pass's complete list)

1. **Do principles 9, 12, 18, or 22 have a surviving universal core?** (§C above.) Not decided; not
   analogized from principle 8's restoration.
2. **Should E074 (Gemini's standing restrictions) mint a new principle number?** It reads as
   principle-grade (a durable, future-dispute-settling cross-lane rule per taxonomy §3's test), but
   the taxonomy gives no bootstrap mechanism for minting a *new* principle number during this
   migration — only the `R`-series has one (§7's bootstrap is explicitly "for existing rulings").
   Proposing a number here would be inventing a mechanism the ratified contract doesn't provide.
   Routed to the owner rather than guessed.
3. **E038 (current-producer callout)** — near-`UNCLEAR_REQUIRES_OWNER`, unchanged from pass 1: its
   natural owner is `PROJECT-HISTORY.md`, which taxonomy §9 forbids as a destination for this work.
   `STAY`-as-pointer is the least-wrong legal option, not a clean answer.

---

## G. Reference graph — resolved-count delta against pass 1's 5,380

Pass 1 hardcoded `resolves: true` for every `principle` record (532) and every bare `section` record
(982) — 1,514 of 5,380 resolved records (28%) were assertions, not measurements (spec §6, quoting the
exact figure). This pass measures every kind against one of four indexes. Full per-kind accounting,
reconstructed from both runs' `counts.byKind` and verified to reproduce pass 1's reported 5,380
exactly:

| kind | pass 1 resolved | pass 2 resolved (live+lapsed) | Δ | why |
|---|---|---|---|---|
| principle | 532 (hardcoded) | 569 (453 live + 116 lapsed) | **+37** | corpus grew (amended spec/taxonomy cite more principles); every principle-kind reference in the whole corpus targets a *defined* number (0 `MISSING`) — the correction here is reclassification (116 flagged `LAPSED`, a review queue, not a defect), not a resolution drop |
| section | 982 (hardcoded) | 838 | **−144** | **the real correction** — 144 bare `§n` citations previously blanket-asserted now measure against actual per-file section indexes and don't find the section they claim (breakdown: §H below) |
| path-section | 32 (path-only check) | 30 | **−2** | now also requires the *target file's* section index to contain `n`, not just that the file exists |
| link | 57 | 57 | **0** | anchor-existence checking added; no citation in the corpus was flipped by it |
| path | 3,777 (of 6,615 total) | 3,792 (of 6,633 total) | **+15** | +18 new path references from corpus growth; resolution logic itself unchanged |
| link-external, ambiguous | 0, 0 | 0, 0 | 0 | unchanged (`NOT_APPLICABLE`, correctly excluded from resolved) |
| **Total** | **5,380** | **5,286** | **−94** | 37 − 144 − 2 + 0 + 15 = **−94**, matches exactly |

**Where it moved:** the net −94 is not a regression — it is dominated by one real correction (−144 on
`section`) that the reclassification-driven gains (+37 principle, +15 path) only partly offset. The
`section` correction is exactly the class of defect Amendment 1 exists to expose: pass 1's hardcoded
`resolves:true` was hiding it entirely.

### H. What the 144 (+2 path-section) newly-exposed `MISSING` section references actually are

A sample-based read (not exhaustive — precision over volume, taxonomy §2/principle 7) found three
distinct patterns, all genuine boundary effects of the literal targeting grammar, not resolver bugs:

1. **External regulatory citations reusing the `§` glyph.** `PROJECT-HISTORY.md` lines 1357/1383 read
   *"current 45 CFR § 46.116(b)(8)"* and *"45 CFR § 164.524(b)(2)(i)"* — real federal-code citations
   inside clinical-content prose, extracted by the literal `§\s*(\d+)` rule (spec §6: *"Apply these
   exactly; do not extend them"*) as if they were local section 46/164 references. False-positive
   *extraction*, not a document defect — flagged, not special-cased, since excluding it would require
   exactly the semantic inference the spec forbids.
2. **Decimal subsection notation truncated to an integer.** `PROJECT-HISTORY.md:315` reads *"Covers
   §6.1 assertions 1–20 and §6.2..."* — the regex captures `6` from `§6.1`, and `PROJECT-HISTORY.md`
   has no local numbered section 6 (it is a chronological log, not a numbered-section document), so
   it measures `MISSING`. Same class as (1): a real boundary of the literal grammar, correctly
   labelled per spec §6's "pre-existing defect" language, not a false document defect.
3. **A reversed `§n of <path>` construction split across a line break.** `PROJECT-HISTORY.md:919-920`
   reads *"ratified as §20 of\n`VITAL-SANITY-BOUNDS-P3-SURVEY-ARCHITECT-SPEC-2026-07-17.md`"* — the
   ambiguous-form regex (which correctly catches the single-line version, e.g. `DECISIONS.md:339`)
   operates per line and cannot see across a line wrap, so `§20` here falls through to the bare-
   section rule and measures `MISSING`, while the path on the next line is extracted separately as an
   unrelated (resolving) `path` reference. **Extraction-boundary limitation, not fixed in this pass**
   — the generator's targeting rules operate line-by-line per spec §6's literal reading, and joining
   arbitrary prose across line wraps risks false-positive merges elsewhere (table rows, adjacent
   unrelated sentences) that would be a worse defect than the one it fixes. Flagged for a future
   commission, not corrected here (correcting the resolver mid-survey, as done for the principle-30
   header, was justified only because that fix made a *definitional* index — principle liveness —
   complete; this one is a targeting-grammar scope question the spec's Amendment 3 explicitly bounded
   rather than left open).

No exhaustive per-citation remediation list is produced for the 144 — this is a phase-1 survey
reporting defect *classes* with evidence, per the standing precision-over-volume grading standard,
not a phase-2 or content-fix commission.

---

## I. Verification record (spec §10, Amendment 4 — commit-range, not working-tree)

Filled in immediately below this section once the deliverables commit lands; see the end-of-turn
report for the executed results (tsc, two-run diff, `$SURVEY_HEAD..HEAD` diffs for the five protected
files and for `package.json`, the full PR-gate step list including `npm ci`, the resolver negative
control, and the seven-path `--name-only` allowlist check).

---

## J. Non-goals honored (spec §9)

No edit/move/reorder/retitle/renumber/compress/delete in `DECISIONS.md`; no edit to `CLAUDE.md`,
`AGENTS.md`, `PROJECT-HISTORY.md`, `NCLEX-Question-Schema.md`, or anything under `Archive/`; no status
tag changed and no stale claim corrected in place (flagged only, throughout); no archive file created
and no content moved toward one; `package.json` changed by exactly the one authorized line across the
whole commit range; no `.github/workflows/`, bank, schema, renderer, or runtime file touched; no
phase-2 spec, no proposed compressed wording.
