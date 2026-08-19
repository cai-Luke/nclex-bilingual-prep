# DECISIONS Migration — Stage 2a Block Grouping and Order Worksheet

**Date:** 2026-07-29  
**Seat:** GPT deterministic preparation  
**Status:** Non-authoritative structural worksheet. It derives grouping from the ratified outline but does not ratify final body/index order or heading bytes.

## 1. What is fixed and what is not

Fixed by the target format and ratified classification:

- exactly one `###` core per live P/R permanent identifier;
- additional blocks sharing that identifier are `####` attachments under the core;
- block keys are `<ID>#0` for the core and `<ID>#1..n` for attachments in document order;
- I/T entries are name-addressed and cannot take attachments;
- the target population is 37 P blocks, 6 R blocks, 19 I entries, and 3 T entries.

Not yet pinned by the architect manifest:

- exact target body/index order;
- exact titles and summaries;
- whether the source-grouping order below is adopted byte-for-byte;
- attachment titles and final statement/field bytes.

The scaffold's current stub sequence follows the outline's destination-membership table, which is not itself a final-order ruling.

## 2. P grouping derived from the ratified outline

The source row described as the durable numbered principle is the strong core candidate; application, amendment, narrowing-note, standing-note, or implementer-note rows sharing its number are attachment candidates.

| P ID | block key | source | structural role candidate |
|---|---|---|---|
| P1 | P1#0 | E001 | core |
| P2 | P2#0 | E002 (+ E037 rule 2) | core |
| P2 | P2#1 | E003 | attachment — spec-conformance/content-review split |
| P3 | P3#0 | E004 | core |
| P4 | P4#0 | E005 | core |
| P5 | P5#0 | E006 (+ E037 rule 2) | core |
| P5 | P5#1 | E007 | attachment — named-model policy narrowing |
| P6 | P6#0 | E008 | core |
| P7 | P7#0 | E009 | core |
| P8 | P8#0 | E039a (+ E037 rule 1) | core, restored universal principle |
| P10 | P10#0 | E010 | core |
| P11 | P11#0 | E011 | core |
| P15 | P15#0 | E012 | core |
| P15 | P15#1 | E013 | attachment — field-path application |
| P16 | P16#0 | E014 | core |
| P16 | P16#1 | E015 | attachment — population amendment |
| P16 | P16#2 | E016 | attachment — standing authoring note |
| P17 | P17#0 | E017 | core |
| P19 | P19#0 | E018 | core |
| P20 | P20#0 | E044 | core, PARKED / INACTIVE |
| P21 | P21#0 | E019 | core |
| P21 | P21#1 | E020 | attachment — learner-surface application |
| P21 | P21#2 | E021 | attachment — functional-not-positional application |
| P23 | P23#0 | E022 | core |
| P23 | P23#1 | E023 | attachment — sparse shape-aware allocation |
| P23 | P23#2 | E024 | attachment — embedded-leaf application |
| P24 | P24#0 | E025 | core |
| P25 | P25#0 | E026 | core |
| P25 | P25#1 | E027 | attachment — composite trend artifacts, excluding superseded vitals geometry |
| P25 | P25#2 | E028 | attachment — unified `vitals_trend` amendment |
| P25 | P25#3 | E029 | attachment — pending visible-flowsheet implementation |
| P26 | P26#0 | E030 | core |
| P27 | P27#0 | E031 | core |
| P28 | P28#0 | E033 | core |
| P29 | P29#0 | E034 | core |
| P30 | P30#0 | E035 | core |
| P31 | P31#0 | E074 | core |

Reconciliation: 25 P cores + 12 P attachments = 37 P blocks.

## 3. R grouping

Every live ruling has one block and therefore one core. No R attachment is classified.

| R ID | block key | source | effective date / state |
|---|---|---|---|
| R1 | R1#0 | E070 | 2026-07-02 / EXECUTED |
| R2 | R2#0 | E049 | 2026-07-05 / EXECUTED |
| R3 | R3#0 | E047c | 2026-07-15 / EXECUTED |
| R4 | R4#0 | E072 | 2026-07-17 / EXECUTED |
| R5 | R5#0 | E047a | 2026-07-24 / PENDING |
| R6 | R6#0 | E073 | 2026-07-24, later legacy document order / PENDING |

Reconciliation: 6 R cores + 0 R attachments = 6 R blocks.

## 4. Name-addressed blocks

### Standing invariants — 19

E038, E043a, E054, E055, E056, E057, E058, E059, E060, E061, E062, E063, E064, E065, E066, E067, E068, E069, E071.

Each takes one `### <exact title>` block. Exact title is its citation identity and must be unique and durable.

### Open threads — 3

E045, E046, E047b.

Each takes one `### <exact title>` block. No attachments are permitted.

## 5. Clearest candidate body/index order

The grammar requires only that body and index orders agree. It does not separately mandate sorting. The clearest human-facing candidate, consistent with the section-specific outline tables, is:

1. §4: P1 through P31 in numeric permanent-ID order, with each ID's attachments immediately after its core in the source-grouping order above;
2. §5: R1 through R6 in numeric permanent-ID order;
3. §6: the 19 I entries in the ratified outline/source order listed above;
4. §7: E045, E046, E047b;
5. §8: archive index and register in the exact architect-pinned order.

Under that candidate, the §4 source sequence would be:

E001; E002, E003; E004; E005; E006, E007; E008; E009; E039a; E010; E011; E012, E013; E014, E015, E016; E017; E018; E044; E019, E020, E021; E022, E023, E024; E025; E026, E027, E028, E029; E030; E031; E033; E034; E035; E074.

The §5 source sequence would be:

E070; E049; E047c; E072; E047a; E073.

**Architect action required:** explicitly adopt this order or pin another exact order in the authoritative manifest. Do not leave the choice to implementation, and do not silently inherit the scaffold's membership-table order.

## 6. Checks after architect selection

- exactly one `###` core for each of the 25 live P IDs and six live R IDs;
- every P attachment appears immediately beneath the correct core and uses the same permanent ID;
- attachment ordinals in body and index agree;
- 65 index rows equal 65 body blocks in the same order;
- name-addressed I/T titles match index summaries byte-for-byte;
- no P9, P12, P18, or P22 live block exists;
- P13 and P14 remain never assigned;
- allocation union remains contiguous through P31 and R6.
