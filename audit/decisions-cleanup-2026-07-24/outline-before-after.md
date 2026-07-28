# DECISIONS.md Cleanup — Phase 1 (Closure Repair) — Before/After Outline

Placement only, against taxonomy §8 (ratified through Amendment 3). Entries are `E`-IDs from
`inventory.md`. This closure repair applies the owner ratifications dated 2026-07-28 and the pinned
80-row reconciliation; it does not alter `DECISIONS.md`.

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
4. Governing principles (P)        ← 37 entry rows / 25 permanent numbers
5. Concrete rulings (R)            ← 6 entry rows (R1–R6 numbered)
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

### Authoritative destination table

This table, and only this table, defines independent destination membership for the proposed
structure. Narrative lists and examples below are explanatory and are not membership claims.

| entry ID | target section | permanent ID |
|---|---|---|
| E001 | §4 | P1 |
| E002 | §4 | P2 |
| E003 | §4 | P2 |
| E004 | §4 | P3 |
| E005 | §4 | P4 |
| E006 | §4 | P5 |
| E007 | §4 | P5 |
| E008 | §4 | P6 |
| E009 | §4 | P7 |
| E010 | §4 | P10 |
| E011 | §4 | P11 |
| E012 | §4 | P15 |
| E013 | §4 | P15 |
| E014 | §4 | P16 |
| E015 | §4 | P16 |
| E016 | §4 | P16 |
| E017 | §4 | P17 |
| E018 | §4 | P19 |
| E019 | §4 | P21 |
| E020 | §4 | P21 |
| E021 | §4 | P21 |
| E022 | §4 | P23 |
| E023 | §4 | P23 |
| E024 | §4 | P23 |
| E025 | §4 | P24 |
| E026 | §4 | P25 |
| E027 | §4 | P25 |
| E028 | §4 | P25 |
| E029 | §4 | P25 |
| E030 | §4 | P26 |
| E031 | §4 | P27 |
| E033 | §4 | P28 |
| E034 | §4 | P29 |
| E035 | §4 | P30 |
| E039a | §4 | P8 |
| E044 | §4 | P20 |
| E074 | §4 | P31 |
| E047c | §5 | R3 |
| E047a | §5 | R5 |
| E049 | §5 | R2 |
| E070 | §5 | R1 |
| E072 | §5 | R4 |
| E073 | §5 | R6 |
| E038 | §6 | *(invariant, by name)* |
| E043a | §6 | *(invariant, by name)* |
| E054 | §6 | *(invariant, by name)* |
| E055 | §6 | *(invariant, by name)* |
| E056 | §6 | *(invariant, by name)* |
| E057 | §6 | *(invariant, by name)* |
| E058 | §6 | *(invariant, by name)* |
| E059 | §6 | *(invariant, by name)* |
| E060 | §6 | *(invariant, by name)* |
| E061 | §6 | *(invariant, by name)* |
| E062 | §6 | *(invariant, by name)* |
| E063 | §6 | *(invariant, by name)* |
| E064 | §6 | *(invariant, by name)* |
| E065 | §6 | *(invariant, by name)* |
| E066 | §6 | *(invariant, by name)* |
| E067 | §6 | *(invariant, by name)* |
| E068 | §6 | *(invariant, by name)* |
| E069 | §6 | *(invariant, by name)* |
| E071 | §6 | *(invariant, by name)* |
| E045 | §7 | *(thread, by name)* |
| E046 | §7 | *(thread, by name)* |
| E047b | §7 | *(thread, by name)* |
| E032 | §8 | *(archive line)* |
| E036 | §8 | *(archive line)* |
| E039b | §8 | *(archive line)* |
| E040 | §8 | *(retire #9)* |
| E041 | §8 | *(retire #12)* |
| E042 | §8 | *(retire #18)* |
| E043b | §8 | *(retire #22)* |
| E048 | §8 | *(archive line)* |
| E050 | §8 | *(archive line)* |
| E051 | §8 | *(archive line)* |
| E052 | §8 | *(archive line)* |
| E053 | §8 | *(archive index intro)* |
| E075 | §8 | *(archive line)* |
| E076 | §8 | *(archive line)* |

### Authoritative merge table

This table, and only this table, defines merge membership. `E037` has no independent destination row.

| entry ID | targets |
|---|---|
| E037 | E039a, E002, E006 |

## Section 4 — Governing principles (P) — 37 entry rows, 25 permanent numbers

Principle numbers retained, **all 25**: 1, 2, 3, 4, 5, 6, 7, **8**, 10, 11, 15, 16, 17, 19, **20**,
21, 23, 24, 25, 26, 27, 28, 29, 30, **31**. `E037` dissolves into P2/P5/P8 and mints no number;
the owner allocated `P31` to `E074` on 2026-07-28 under taxonomy §7 Amendment 3.

| principle | entries (core + attached blocks) |
|---|---|
| P1 | E001 |
| P2 | E002, **E003** (+ E037's second rule, attached) |
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
| **P31** | **E074** |

Count of distinct numbered principles: **25**.
Count of `P`-kind entry rows across those 25 numbers (core bodies + attached application blocks,
including `E029`, repaired in the correction pass from `R` to `P`): **37.**

## Section 5 — Concrete rulings (R) — 6 entries, confirmed R1–R6

| R | entry | effective date | exec |
|---|---|---|---|
| R1 | E070 standalone-bowtie direct generation | 2026-07-02 | EXECUTED |
| R2 | E049 CBC conventional-first + SI-paren, analyte-aware | 2026-07-05 | EXECUTED |
| R3 | E047c temperature-sanity `46.5°C` ceiling | 2026-07-15 | EXECUTED |
| R4 | E072 promoted-visual-parity per-kind baseline (PR #55) | 2026-07-17 | EXECUTED |
| R5 | E047a SBP `400` / RR `150` / `spo2` `0%` ratifications | 2026-07-24 (line 339) | PENDING |
| R6 | E073 PR vs post-merge CI-coverage ratified gate list | 2026-07-24 (line 385, later document order) | PENDING |

`E029` (flowsheet-reinstatement directive) is **no longer counted here** — repaired this pass
(`inventory.md` §4.2) from an unnumbered `R` to a `P`-kind application sharing `P25`'s permanent ID,
the same pattern as `E013`/`E015`. It moved to §4 above. The alternative R-numbered reading was
recorded but not adopted; the owner confirmed on 2026-07-28 that `E029` remains a `P25` application.

R-series origin: **confirmed at R1** by architect ruling (spec §8) — the `R1..R17` inside
`Archive/root-specs-2026-07-18/structured-measurements-schema-2-0-codex-spec.md` is document-local
and reserves nothing globally.

## Section 6 — Standing invariants (I) — 19 entries

E038 (producer callout), E043a (`opus*` routing, force-preservation hazard), E054–E071 excluding
E070 (19 total). The explicit sequence includes E063.

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
E040, E041, E042, E043b, E048, E050, E051, E052, E053, E075, E076. `E047c` is not here: the owner
reclassified it to `R | STAY` on 2026-07-28. Net **−1** versus pass 1's 15:
pass 1 archived E039 whole; this pass keeps its core (E039a, §4) and archives only the lane detail
(E039b) — a like-for-like swap on the split, contributing 0 net change — while E037, which pass 1
counted as a live `STAY` row bound for a new `P31`, now has **no** archive-index line at all (it
dissolves into P2/P5/P8 rather than either staying independently or archiving), which is where the
net −1 actually comes from relative to a naive recount.

Retired principle numbers recorded in the archive index: **9, 12, 18, and 22**, by owner ratification
dated 2026-07-28. None retains a surviving universal core; all four numbers remain unavailable.
Principle 8 is restored, and E043a remains live independently of principle 22's archived prose.

## Reconciliation

| target section | count |
|---|---|
| §4 Governing principles (P) | 37 |
| §5 Concrete rulings (R) | 6 (R1–R6 numbered) |
| §6 Standing invariants (I) | 19 |
| §7 Open threads (T) | 3 |
| §8 Archive index (X) | 14 |
| **Total destination rows** | **79** |
| E037 (dissolves into P2/P5/P8 — no independent row) | 0 |
| **Total inventory rows accounted for** | **80** |

79 independent destination rows + E037's merge row = 80 inventory rows, matching `inventory.md`
and `migration-table.md`.
