# DECISIONS.md Cleanup — Phase 1 (Correction Pass) — Before/After Outline

Placement only, against taxonomy §8 (ratified). Entries are `E`-IDs from `inventory.md`. Updated this
pass only where `E029`'s kind repair (`R`→`P`, `inventory.md` §4.2) moves its section; everything else
is unchanged from pass 2.

## Current structure (at `CORRECTION_HEAD`)

| # | Current section | Entry rows |
|---|---|---|
| 1 | Purpose and authority boundaries | *(structural)* |
| 2 | Status vocabulary | *(structural)* |
| 3 | Decision index (2026-07-18) | *(structural)* |
| 4 | Active constitutional principles | E001–E035 |
| 5 | Conditional lane contracts (LAPSED 2026-07-18) | E036–E043 |
| 6 | Parked architecture | E044–E046 |
| 7 | Revisit queue | E047 |
| 8 | Superseded rulings and forcing-incident history | E048–E053 |
| — | Reference appendices | E054–E076 |

## Proposed structure (taxonomy §8) — populated

```
1. How to read this document      ← today's §1 (+ compression rule)         [structural]
2. Status vocabulary               ← today's §2 (unchanged)                  [structural]
3. Entry index                     ← today's §3, regenerated                 [structural]
4. Governing principles (P)        ← 36 entry rows / 24 permanent numbers
5. Concrete rulings (R)            ← 5 entry rows (R1–R5 numbered; E029 moved to §4 — see below)
6. Standing invariants (I)         ← 19 entries
7. Open threads (T)                ← 3 entries (unsettled questions only)
8. Archive index (X)               ← 14 entries
```

Today's §5 (conditional lane contracts) and §6 (parked architecture) dissolve, but **not
uniformly**, per taxonomy §8: a parked item routes by its own kind — E044 (a settled, PARKED
principle) stays in §4 carrying `PARKED`/`EXECUTION:INACTIVE`; E045/E046 (unsettled questions parked
behind a resumption trigger) become §7 threads. A lapsed lane contract becomes an archive index line
*unless* a universal core is ratified to remain — principle 8 is the one entry in §5 for which that
happened.

## Section 4 — Governing principles (P) — 36 entry rows, 24 permanent numbers

Principle numbers retained, **all 24**: 1, 2, 3, 4, 5, 6, 7, **8**, 10, 11, 15, 16, 17, 19, **20**,
21, 23, 24, 25, 26, 27, 28, 29, 30 — pass 1's 22 live numbers plus **8** (restored) and **20**
(retained rather than retired). No `P31`, no `P32`: E037 dissolves into P2/P5/P8;
E074 (Gemini restrictions) is proposed to attach as an appendix-level cross-lane rule under its own
name rather than mint a new number (taxonomy gives no bootstrap mechanism for minting new principle
numbers during this migration — only the R-series has one — so this row is flagged in `findings.md`
rather than silently numbered).

| principle | entries (core + attached blocks) |
|---|---|
| P1 | E001 |
| P2 | E002 (+ E037's second rule, attached) |
| P3 | E004 |
| P4 | E005 |
| P5 | E006, E007 (+ E037's second rule, attached) |
| P6 | E008 |
| P7 | E009 |
| **P8** | **E039a (restored — new)** |
| P10 | E010 |
| P11 | E011 |
| P15 | E012, E013 |
| P16 | E014, E015, E016 |
| P17 | E017 |
| P19 | E018 |
| **P20** | **E044 (retained, not retired — new)** |
| P21 | E019, E020, E021 |
| P23 | E022, E023, E024 |
| P24 | E025 |
| P25 | E026, E027, E028, **E029 (application, repaired from `R` — inventory.md §4.2)** |
| P26 | E030 |
| P27 | E031 |
| P28 | E033 |
| P29 | E034 |
| P30 | E035 |

Count of distinct numbered principles: **24** (P8 and P20 restored/retained beyond pass 1's 22).
Count of `P`-kind entry rows across those 24 numbers (core bodies + attached application blocks,
including `E029`, repaired this pass from `R` to `P` — `inventory.md` §4.2): **36.**

## Section 5 — Concrete rulings (R) — 5 entries, confirmed R1–R5

| R | entry | effective date | exec |
|---|---|---|---|
| R1 | E070 standalone-bowtie direct generation | 2026-07-02 | EXECUTED |
| R2 | E049 CBC conventional-first + SI-paren, analyte-aware | 2026-07-05 | EXECUTED |
| R3 | E072 promoted-visual-parity per-kind baseline (PR #55) | 2026-07-17 | EXECUTED |
| R4 | E047a SBP `400` / RR `150` / `spo2` `0%` ratifications | 2026-07-24 (line 339) | PENDING |
| R5 | E073 PR vs post-merge CI-coverage ratified gate list | 2026-07-24 (line 385) | PENDING |

`E029` (flowsheet-reinstatement directive) is **no longer counted here** — repaired this pass
(`inventory.md` §4.2) from an unnumbered `R` to a `P`-kind application sharing `P25`'s permanent ID,
the same pattern as `E013`/`E015`. It moved to §4 above. An alternative reading (R-numbered, dated
2026-07-19, which would insert between R3 and R4 and renumber the confirmed series) is recorded but
not adopted — `findings.md` §F.5.

R-series origin: **confirmed at R1** by architect ruling (spec §8) — the `R1..R17` inside
`Archive/root-specs-2026-07-18/structured-measurements-schema-2-0-codex-spec.md` is document-local
and reserves nothing globally.

## Section 6 — Standing invariants (I) — 19 entries

E038 (producer callout, contested — see findings), E043a (`opus*` routing, force-preservation
hazard), E054–E062, E064–E069, E071 (19 total, unchanged from pass 1's set).

## Section 7 — Open threads (T) — 3 entries (down from pass 1's 5)

Amendment 1/2 remove two entries from this section: E029 (settled-but-unbuilt; reclassified `R` in
pass 2, repaired this pass to `P` sharing `P25`'s ID — `inventory.md` §4.2) and E044 (now `P`,
settled-but-parked). Only genuinely unsettled questions remain:

| entry | thread | named next action |
|---|---|---|
| E045 | translation-friction scoring | dogfooding shows miss-predictive reveal concentration |
| E046 | `test`/`adaptive` exam-condition modes | spec as real exam sim, or remove |
| E047b | DBP/MAP ceiling sourcing pass; `temp` floor; `sao2` provisional | bounded sourcing pass (no number chosen) |

## Section 8 — Archive index (X) — 14 entries (down from pass 1's 15)

E032, E036, **E039b (new — P8's lane-specific detail, replacing pass 1's fully-archived E039)**,
E040, E041, E042, E043b, E048, E050, E051, E052, E053, E075, E076. Net **−1** versus pass 1's 15:
pass 1 archived E039 whole; this pass keeps its core (E039a, §4) and archives only the lane detail
(E039b) — a like-for-like swap on the split, contributing 0 net change — while E037, which pass 1
counted as a live `STAY` row bound for a new `P31`, now has **no** archive-index line at all (it
dissolves into P2/P5/P8 rather than either staying independently or archiving), which is where the
net −1 actually comes from relative to a naive recount.

Retired principle numbers this cleanup would record in the archive index: **none new.** Principle 8
is restored (not retired); principles 9, 12, 18, 22 remain provisionally retired pending the owner's
answer to the open question in `findings.md` — they are **not** re-numbered or reused regardless of
that answer (taxonomy §7). Only 13, 14 (already intentionally unused) stay off the live document.

## Reconciliation

| target section | count |
|---|---|
| §4 Governing principles (P) | 36 (includes E029, repaired this pass — see above) |
| §5 Concrete rulings (R) | 5 (R1–R5 numbered) |
| §6 Standing invariants (I) | 19 |
| §7 Open threads (T) | 3 |
| §8 Archive index (X) | 14 |
| **Total destination rows** | **77** |
| E037 (dissolves into P2/P5/P8 — no independent row) | 0 |
| **Total inventory rows accounted for** | **78** |

77 destination rows + E037's merge (0 independent rows) = 78, matching `inventory.md`'s 78-row
table exactly. This is the authoritative reconciliation; `migration-table.md` carries the same
78-row-in, 77-row-out accounting per entry.
