# Stage 2a derived date-occurrence report — step 3: surface mapping

**Seat:** Architect (Claude) · **Date:** 2026-08-07 · **Class:** step-3 mapping. No manifest byte edited.

Authorized by the architect adjudication of `DATE-OCCURRENCE-CENSUS-2026-08-07.md` (ACCEPT), per `M7.5` step 3. This
file assigns every census occurrence to exactly one concrete surface ID within one family. It generates no report bytes,
validates no exclusivity claim, and does not begin step 4.

## 1. Frozen identities

| item | value |
|---|---|
| Manifest | `314811` / `33821e548cd576eae33609931af8cffd0e6e3b9771a693df968bd758d5c5580c` |
| Census receipt | `60122` / `a7231030b7d837deb8a216004ae44f21eb2145b924756ae1a5631735d849f8f8` |
| Census work order | `21074` / `682829127c57d773faee2a4c270ef6115c6014a05851d498cd45bfc90baa1c03` |
| `DECISIONS.md` | `76314` / `b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e` |
| Owner-bound `MIGRATION_DATE` | `2026-08-18` |
| Population | 288 occurrences |

All three artifact identities above were measured independently by the architect seat at step-3 opening and matched.

## 2. Census carry-forward and the seven-row `section` exception

The census is accepted as the authoritative step-3 population. One exception carries forward from its adjudication:

**Occurrences 1–7 carry `section=M0` in the census TSV, and that value is not derivable.** Those spans sit at physical
lines 13–16, in the manifest front matter; `## M0. Header pins` does not begin until line 26. Their innermost enclosing
heading is the unlabeled document title at line 1, for which the census order's §2.5.7 rule defines no value. This is a
post-execution application of **standing ruling 39** — a requested field whose rule was not total over the actual
population. No new ruling is minted and no census repair is required.

**`section` is therefore non-authoritative for occurrences 1–7 and is retained in this file as carried data only.** Those
seven were mapped from byte offsets and full context read against the manifest. Every other locator in the census —
`start`, `end`, `line`, `col`, `literal`, `record_item`, `container`, `context` — was independently re-derived by the
architect seat across all 288 rows with zero disagreements, and is relied on without qualification.

## 3. Dispositions taken under `M7.4`

`M7.4` returns to this seat any token no family claims, and bars defaulting to fixed on the grounds that a token is not
obviously dependent. 191 occurrences were unclaimed by `F1`–`F8`. They are disposed here as three new fixed families,
`F9`–`F11`, each with an affirmative ground stated at §4. `M7.3` already makes the `F` set expandable families rather
than hand-counted rows, so no manifest edit and no new owner act is required to expand it.

**Affirmative evidence that no unclaimed span is dependent, rather than a default.** Three independent checks:

1. The superseded binding `2026-08-11` has **zero** occurrences in the manifest. No surface retained a stale render, so
   the dependent population cannot be under-counted by staleness.
2. The bound literal `2026-08-18` has exactly **63** occurrences, and the semantic mapping at §5 — assigned from section,
   item number, the `archived` phrase, and the `.md#` filename/slug boundary, never from the literal — partitions those
   63 into `32/9/18/2/1/1`. That equals the `D1`–`D6` cardinality established at the 2026-08-06 rebinding.
3. The only non-bound spans inside an `Archive/DECISIONS-ARCHIVE-*` filename carry `2026-07-14`, the prior archive that
   `F2` expressly fixes. No other archive-filename surface exists at a non-bound value.

**`F5` is eight occurrences, not four.** Part D §8.1's count of four omitted the M5.6 duplicate block, exactly as the
parallel dependent family `D3` expands to nine per-record plus nine duplicated. Per `M7.3` a family-level count is not
authority and no repair follows from the stale number.

**Occurrence 257 is excluded from `F5` and assigned to `F11`.** It sits in the sentence beginning `**The four retirement
phrases do not move.**` — a governance statement *about* the four phrases, not one of them. Stated rather than implied,
per the `M7.2` exclusion discipline.

**`F7` and `F8` are zero-occurrence families in this census.** `F7`'s digests carry no ISO token and `F8`'s directory
name does not appear in the population. Both are reported as measured zero and neither is repaired; an empty provisional
family is not a defect.

## 4. Family register

| family | disposition | occurrences | definition and ground |
|---|---|---:|---|
| `D1` | dependent | 32 | Normalized archive filename, every occurrence other than the more specifically assigned D5 span (M7.2 exclusion). |
| `D2` | dependent | 9 | The nine non-retiring wrappers' item-4 `Date` field — the archival date. |
| `D3` | dependent | 18 | The nine `archived <MIGRATION_DATE>` index phrases, per-record and again in the M5.6 duplicate block. |
| `D4` | dependent | 2 | Archive preamble title and body prose (M5.2). |
| `D5` | dependent | 1 | `E038` item-9 `Evidence` value at M4.45, under Amendment 1 Clause A. |
| `D6` | dependent | 1 | Manifest header `MIGRATION_DATE` binding declaration — bound-value span only (M7.2a). |
| `F1` | fixed | 3 | `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` filename-internal spans. Ratified literal in Amendment 4 §3.3 and taxonomy §9. |
| `F2` | fixed | 3 | `Archive/DECISIONS-ARCHIVE-2026-07-14.md` filename-internal spans. Prior archive, never edited. |
| `F3` | fixed | 4 | The four retiring wrappers' item-4 `Date` field. Historical retirement date, ratified 2026-07-28. |
| `F4` | fixed | 4 | The four M5.7 register retirement-date cells. Historical fact. |
| `F5` | fixed | 8 | The `retired 2026-07-28` index phrases — four per-record and four in the M5.6 duplicate block. Historical fact. |
| `F6` | fixed | 10 | Anchor-slug spans, i.e. any span following `.md#` on its line. No anchor contains the migration date. |
| `F7` | fixed | 0 | `MIGRATION_BASELINE` and the thirteen span hashes. Zero occurrences: hex digests carry no ISO date token. |
| `F8` | fixed | 0 | The `audit/decisions-migration-2026-07-29/` directory name. Zero occurrences in this population. |
| `F9` | fixed | 80 | Historical-fact dates naming when a governed event occurred: E-record item-9 `Date` fields, wrapper item-3 heading unit dates, wrapper item-8 index-entry unit dates, and their M5.6 duplicates. Fixed because each states when a decision, lapse, supersession, or withdrawal happened; an event is dated when it occurred and does not move when MIGRATION_DATE moves. |
| `F10` | fixed | 42 | Source-artifact filename and directory-path dates: any span forming part of a `*.md`/`*.json` filename stem or a `dir-YYYY-MM-DD/` path component, excluding the archive filenames already claimed by D1, D5, F1, and F2. Fixed because each names an artifact that already exists on disk under that exact name; renaming is not a function of MIGRATION_DATE. |
| `F11` | fixed | 71 | Manifest governance-prose dates: dates in this manifest's own construction and rationale text, including item-12 source-to-target rationale, the M0 front-matter ratification and owner-act dates, the M6 register prose, and statements about other date surfaces. Fixed because each records when a governance act occurred or cites a historical fact; per M7.2a an owner act is dated when it happened and does not move when the value it bound moves. |

**Dependent 63 · fixed 225 · total 288.** Every family is expanded to concrete rows at §5; no count is asserted at
family level except as a sum of those rows.

## 5. Authoritative mapping

One row per occurrence, 288 rows, each carrying exactly one `surface_id` unique across the whole table. `section` is
carried from the census and is non-authoritative for occurrences 1–7 per §2.

```tsv
occ	start	end	line	col	literal	section	record_item	family	surface_id	context
1	1026	1036	13	72	2026-07-29	M0	-	F10	F10.1	**Seat:** Architect · **Commission:** `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md`, RATIFIED 2026-07-29
2	1051	1061	13	97	2026-07-29	M0	-	F11	F11.1	**Seat:** Architect · **Commission:** `DECISIONS-MIGRATION-COMMISSION-2026-07-29.md`, RATIFIED 2026-07-29
3	1121	1131	14	60	2026-07-29	M0	-	F10	F10.2	**Amendment:** `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md`, RATIFIED 2026-07-30, Clauses A and B in force
4	1146	1156	14	85	2026-07-30	M0	-	F11	F11.2	**Amendment:** `DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md`, RATIFIED 2026-07-30, Clauses A and B in force
5	1215	1225	15	33	2026-08-18	M0	-	D6	D6.1	**`MIGRATION_DATE`:** bound to `2026-08-18` by Luke (owner) on 2026-08-06; record at
6	1246	1256	15	64	2026-08-06	M0	-	F11	F11.3	**`MIGRATION_DATE`:** bound to `2026-08-18` by Luke (owner) on 2026-08-06; record at
7	1326	1336	16	59	2026-08-06	M0	-	F10	F10.3	`DECISIONS-MIGRATION-STAGE-2A-MIGRATION-DATE-SUPERSESSION-2026-08-06.md`
8	2400	2410	41	82	2026-07-29	M0.1	-	F10	F10.4	| Authoritative pre-migration graph | `audit/decisions-reference-graph-hardening-2026-07-29/pre-migration-reference-graph.json` |
9	2511	2521	42	63	2026-07-24	M0.1	-	F10	F10.5	| Historical phase-1 graph, frozen | `audit/decisions-cleanup-2026-07-24/reference-graph.json` |
10	2615	2625	43	70	2026-08-18	M0.1	-	D1	D1.1	| Normalized migration archive filename | `Archive/DECISIONS-ARCHIVE-2026-08-18.md` |
11	2700	2710	44	69	2026-07-29	M0.1	-	F1	F1.1	| Preservation snapshot filename | `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` |
12	2776	2786	45	60	2026-07-14	M0.1	-	F2	F2.1	| Prior archive, never edited | `Archive/DECISIONS-ARCHIVE-2026-07-14.md` |
13	3213	3223	57	23	2026-07-24	M0.2	-	F10	F10.6	| `DECISIONS-TAXONOMY-2026-07-24.md` | `05f9bcd` | `docs: apply decisions migration amendment 4` |
14	3325	3335	58	36	2026-07-28	M0.2	-	F10	F10.7	| `DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md` | `05f9bcd` | `docs: apply decisions migration amendment 4` |
15	3431	3441	59	30	2026-07-28	M0.2	-	F10	F10.8	| `DECISIONS-FORMAT-FIXTURES-2026-07-28.md` | `05f9bcd` | `docs: apply decisions migration amendment 4` |
16	3601	3611	60	94	2026-07-29	M0.2	-	F10	F10.9	| Amendment 4 source text | `DECISIONS-ARCHIVE-PRESERVATION-AND-WRAPPER-ADDRESSING-AMENDMENT-2026-07-29.md` | RATIFIED 2026-07-29 |
17	3627	3637	60	120	2026-07-29	M0.2	-	F11	F11.4	| Amendment 4 source text | `DECISIONS-ARCHIVE-PRESERVATION-AND-WRAPPER-ADDRESSING-AMENDMENT-2026-07-29.md` | RATIFIED 2026-07-29 |
18	6606	6616	109	218	2026-07-29	M0.4	-	F11	F11.5	| H8 | Amendment 4 committed on `main` before creation of `codex/decisions-migration` — chronology disposition `PASS` / `FAIL` / `UNPROVEN` | `PASS` — `main` reached `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` at `2026-07-29 11:57:20 -0400`; the branch was created from that commit at `2026-07-29 12:21:42 -0400`; `main` preceded branch creation by `24 minutes 22 seconds` |
19	6678	6688	109	290	2026-07-29	M0.4	-	F11	F11.6	| H8 | Amendment 4 committed on `main` before creation of `codex/decisions-migration` — chronology disposition `PASS` / `FAIL` / `UNPROVEN` | `PASS` — `main` reached `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5` at `2026-07-29 11:57:20 -0400`; the branch was created from that commit at `2026-07-29 12:21:42 -0400`; `main` preceded branch creation by `24 minutes 22 seconds` |
20	9037	9047	141	69	2026-07-29	M1	-	F10	F10.10	Sibling drafts `DECISIONS-MIGRATION-STAGE-2A-PART-A-ARCHITECT-DRAFT-2026-07-29.md` through `PART-D` are
21	13344	13354	213	21	2026-07-24	M3	-	F10	F10.11	`DECISIONS-TAXONOMY-2026-07-24.md` and rendered into grammar by
22	13421	13431	214	34	2026-07-28	M3	-	F10	F10.12	`DECISIONS-FORMAT-ARCHITECT-SPEC-2026-07-28.md`; the summaries here orient a reader and settle nothing.
23	17103	17113	268	25	2026-07-30	M4	-	F11	F11.7	`H8` returned `PASS` on 2026-07-30. The assembly pause recorded here is discharged and its language is
24	19781	19791	332	13	2026-06-09	M4.2	9	F9	F9.1	- **Date:** 2026-06-09
25	21753	21763	384	13	2026-07-18	M4.3	9	F9	F9.2	- **Date:** 2026-07-18
26	24471	24481	453	13	2026-07-09	M4.4	9	F9	F9.3	- **Date:** 2026-07-09
27	25238	25248	467	49	2026-07-09	M4.4	12	F11	F11.8	12. **Source-to-target rationale:** carries the 2026-07-09 extension that splits spec-conformance
28	26725	26735	506	13	2026-06-12	M4.5	9	F9	F9.4	- **Date:** 2026-06-12
29	28750	28760	558	13	2026-06-09	M4.6	9	F9	F9.5	- **Date:** 2026-06-09
30	30493	30503	607	13	2026-07-18	M4.7	9	F9	F9.6	- **Date:** 2026-07-18
31	31775	31785	628	56	2026-07-30	M4.7	12	F11	F11.9	    "generation" and "independent-" by owner ruling of 2026-07-30; it is not byte-identical to `P2#0`'s,
32	33172	33182	676	13	2026-06-26	M4.8	9	F9	F9.7	- **Date:** 2026-06-26
33	35395	35405	729	13	2026-07-14	M4.9	9	F9	F9.8	- **Date:** 2026-07-14
34	37670	37680	783	13	2026-06-09	M4.10	9	F9	F9.9	- **Date:** 2026-06-09
35	38391	38401	798	31	2026-06-09	M4.10	12	F11	F11.10	    compression. The date is `2026-06-09` per the ratified `P7` date correction, not the legacy document
36	39604	39614	834	13	2026-07-24	M4.11	9	F9	F9.10	- **Date:** 2026-07-24
37	40879	40889	855	18	2026-07-24	M4.11	12	F11	F11.11	    The date is `2026-07-24`, fixed by the date-provenance addendum, which supersedes the base
38	40975	40985	856	19	2026-07-28	M4.11	12	F11	F11.12	    provenance's `2026-07-28` on the ground that the later act concerned identifier allocation rather
39	42734	42744	907	13	2026-07-14	M4.12	9	F9	F9.11	- **Date:** 2026-07-14
40	45159	45169	963	13	2026-06-12	M4.13	9	F9	F9.12	- **Date:** 2026-06-12
41	47338	47348	1016	13	2026-06-10	M4.14	9	F9	F9.13	- **Date:** 2026-06-10
42	49646	49656	1071	13	2026-07-22	M4.15	9	F9	F9.14	- **Date:** 2026-07-22
43	52284	52294	1130	13	2026-07-14	M4.16	9	F9	F9.15	- **Date:** 2026-07-14
44	54644	54654	1186	13	2026-07-15	M4.17	9	F9	F9.16	- **Date:** 2026-07-15
45	56816	56826	1240	13	2026-07-15	M4.18	9	F9	F9.17	- **Date:** 2026-07-15
46	58852	58862	1292	13	2026-06-14	M4.19	9	F9	F9.18	- **Date:** 2026-06-14
47	61580	61590	1351	13	2026-07-16	M4.20	9	F9	F9.19	- **Date:** 2026-07-16
48	64365	64375	1411	13	2026-06-22	M4.21	9	F9	F9.20	- **Date:** 2026-06-22
49	67252	67262	1472	13	2026-07-14	M4.22	9	F9	F9.21	- **Date:** 2026-07-14
50	69901	69911	1529	13	2026-07-21	M4.23	9	F9	F9.22	- **Date:** 2026-07-21
51	72409	72419	1586	13	2026-07-22	M4.24	9	F9	F9.23	- **Date:** 2026-07-22
52	75030	75040	1644	13	2026-07-14	M4.25	9	F9	F9.24	- **Date:** 2026-07-14
53	76237	76247	1664	67	2026-07-30	M4.25	12	F11	F11.13	    reviewed Part B draft and are restored on reviewer rulings of 2026-07-30: the deferral, `flags`,
54	77712	77722	1702	13	2026-07-19	M4.26	9	F9	F9.25	- **Date:** 2026-07-19
55	80087	80097	1757	13	2026-07-22	M4.27	9	F9	F9.26	- **Date:** 2026-07-22
56	81384	81394	1777	26	2026-07-22	M4.27	12	F11	F11.14	    enumeration, and the 2026-07-22 owner withdrawal are compressed out and remain discoverable through
57	82878	82888	1816	13	2026-07-14	M4.28	9	F9	F9.27	- **Date:** 2026-07-14
58	83074	83084	1821	52	2026-07-03	M4.28	10	F10	F10.13	    `OMIT`; `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` is expressly attached to rule F's
59	86536	86546	1886	13	2026-07-03	M4.29	9	F9	F9.28	- **Date:** 2026-07-03
60	86706	86716	1890	52	2026-07-03	M4.29	10	F10	F10.14	    `OMIT`; `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` governs flowsheet extraction
61	88146	88156	1910	53	2026-07-03	M4.29	12	F11	F11.15	    corrected here.** The provenance report labels `2026-07-03` `RATIFIED_RECORD` from fixture `F02`;
62	88275	88285	1911	80	2026-07-29	M4.29	12	F11	F11.16	    a parser fixture is not an effective-date authority, and the correction of 2026-07-29 holds the
63	89941	89951	1952	13	2026-07-18	M4.30	9	F9	F9.29	- **Date:** 2026-07-18
64	91612	91622	1978	5	2026-07-18	M4.30	12	F11	F11.17	    2026-07-18 unit-pure multi-panel geometry and its panel-exclusive reference bands are superseded
65	93222	93232	2017	13	2026-07-19	M4.31	9	F9	F9.30	- **Date:** 2026-07-19
66	93460	93470	2023	27	2026-07-19	M4.31	10	F10	F10.15	    `Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md`.
67	93520	93530	2023	87	2026-07-19	M4.31	10	F10	F10.16	    `Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md`.
68	95102	95112	2045	25	2026-07-29	M4.31	12	F11	F11.18	    both drafts and the 2026-07-29 review that accepted them.** The cited spec disclaims being this
69	96996	97006	2087	13	2026-07-19	M4.32	9	F9	F9.31	- **Date:** 2026-07-19
70	99681	99691	2146	13	2026-07-14	M4.33	9	F9	F9.32	- **Date:** 2026-07-14
71	99877	99887	2151	52	2026-07-03	M4.33	10	F10	F10.17	    `OMIT`; `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` is expressly attached to the flowsheet
72	102512	102522	2207	13	2026-07-10	M4.34	9	F9	F9.33	- **Date:** 2026-07-10
73	103659	103669	2226	37	2026-07-12	M4.34	12	F11	F11.19	    forcing-incident narrative. The 2026-07-12 application paragraph is not carried here at all: it
74	105379	105389	2266	13	2026-07-16	M4.35	9	F9	F9.34	- **Date:** 2026-07-16
75	108131	108141	2325	13	2026-07-18	M4.36	9	F9	F9.35	- **Date:** 2026-07-18
76	108310	108320	2327	53	2026-07-18	M4.36	9	F10	F10.18	- **Evidence:** `audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json`
77	111086	111096	2387	13	2026-07-19	M4.37	9	F9	F9.36	- **Date:** 2026-07-19
78	111241	111251	2389	57	2026-07-19	M4.37	9	F10	F10.19	- **Evidence:** `audit/lab-reference-range-verification-2026-07-19.md`
79	114142	114152	2451	13	2026-06-26	M4.38	9	F9	F9.37	- **Date:** 2026-06-26
80	115259	115269	2470	48	2026-07-18	M4.38	12	F11	F11.20	    and `P22` are dropped as superseded by the 2026-07-18 lane retirement, and `P5` is cited
81	117332	117342	2515	13	2026-07-02	M4.39	9	F9	F9.38	- **Date:** 2026-07-02
82	120615	120625	2580	13	2026-07-05	M4.40	9	F9	F9.39	- **Date:** 2026-07-05
83	120811	120821	2585	52	2026-07-03	M4.40	10	F10	F10.20	    `OMIT`; `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` was the candidate and is expressly
84	124237	124247	2650	13	2026-07-15	M4.41	9	F9	F9.40	- **Date:** 2026-07-15
85	124286	124296	2651	39	2026-07-19	M4.41	9	F10	F10.21	- **Evidence:** `Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md`
86	125383	125393	2671	49	2026-07-28	M4.41	12	F11	F11.21	    `EXECUTED` and permanent identifier `R3` on 2026-07-28, after the survey. This is the cleanup's
87	126679	126689	2684	31	2026-07-15	M4.41	12	F11	F11.22	    provenance report labels `2026-07-15` with confidence `FIXED` from fixture `F04`; a parser fixture
88	126924	126934	2686	70	2026-07-15	M4.41	12	F11	F11.23	    of the source's own `Luke's sign-off and architect ratification: 2026-07-15`, and the date byte is
89	127008	127018	2687	51	2026-07-29	M4.41	12	F11	F11.24	    unchanged. This is the standing correction of 2026-07-29 applied to this row.
90	129687	129697	2739	13	2026-07-17	M4.42	9	F9	F9.41	- **Date:** 2026-07-17
91	129736	129746	2740	39	2026-07-19	M4.42	9	F10	F10.22	- **Evidence:** `Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md`
92	129795	129805	2740	98	2026-07-16	M4.42	9	F10	F10.23	- **Evidence:** `Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md`
93	133454	133464	2808	13	2026-07-24	M4.43	9	F9	F9.42	- **Date:** 2026-07-24
94	137392	137402	2879	13	2026-07-24	M4.44	9	F9	F9.43	- **Date:** 2026-07-24
95	140902	140912	2942	13	2026-07-28	M4.45	9	F9	F9.44	- **Date:** 2026-07-28
96	140956	140966	2943	44	2026-08-18	M4.45	9	D5	D5.1	- **Evidence:** `Archive/DECISIONS-ARCHIVE-2026-08-18.md`
97	143900	143910	2982	27	2026-07-28	M4.45	12	F11	F11.25	    **Date provenance.** `2026-07-28` is the owner override recorded in the 2026-07-29 GPT review of the
98	143950	143960	2982	77	2026-07-29	M4.45	12	F11	F11.26	    **Date provenance.** `2026-07-28` is the owner override recorded in the 2026-07-29 GPT review of the
99	144045	144055	2983	67	2026-07-18	M4.45	12	F11	F11.27	    date-provenance report, not the report's own row 44 value of `2026-07-18`. The target block is the
100	144548	144558	2990	38	2026-07-31	M4.45	12	F11	F11.28	    pre-ratification supersession of 2026-07-31, and no unresolved token survives in this record. The
101	145873	145883	3006	62	2026-07-31	M4.45	14	F11	F11.29	      a defect in the spans, and it is corrected here on the 2026-07-31 non-author review.
102	147057	147067	3038	13	2026-07-18	M4.46	9	F9	F9.45	- **Date:** 2026-07-18
103	148179	148189	3052	55	2026-07-31	M4.46	10	F11	F11.30	    reviewer rather than as a settled correction. The 2026-07-31 non-author review concurred, and added
104	150898	150908	3088	27	2026-07-18	M4.46	12	F11	F11.31	    **Date provenance.** `2026-07-18`, provenance class `RATIFIED_RECORD` from the lane-lapse record,
105	152531	152541	3127	13	2026-06-22	M4.47	9	F9	F9.46	- **Date:** 2026-06-22
106	155087	155097	3165	27	2026-06-22	M4.47	12	F11	F11.32	    **Date provenance.** `2026-06-22`, provenance class `GIT_INTRODUCTION`. Git history against
107	155256	155266	3167	6	2026-06-22	M4.47	12	F11	F11.33	    `2026-06-22T18:14:46-04:00`, as the introduction of the runtime-audio invariant itself: no runtime
108	155836	155846	3173	75	2026-07-29	M4.47	12	F11	F11.34	    A parser fixture is not an effective-date authority, per the ratified 2026-07-29 `P7` date
109	156138	156148	3178	53	2026-06-22	M4.47	12	F11	F11.35	    pronunciation-audio principle as "Deprioritized 2026-06-22", but that establishes a date for `P20`,
110	157191	157201	3211	13	2026-06-09	M4.48	9	F9	F9.47	- **Date:** 2026-06-09
111	158738	158748	3236	27	2026-06-09	M4.48	12	F11	F11.36	    **Date provenance.** `2026-06-09`, provenance class `GIT_INTRODUCTION`; the initial constitution
112	159785	159795	3269	13	2026-06-10	M4.49	9	F9	F9.48	- **Date:** 2026-06-10
113	162139	162149	3305	27	2026-06-10	M4.49	12	F11	F11.37	    **Date provenance.** `2026-06-10`, provenance class `GIT_INTRODUCTION`; the commit that introduced
114	163373	163383	3340	13	2026-06-13	M4.50	9	F9	F9.49	- **Date:** 2026-06-13
115	165742	165752	3376	27	2026-06-13	M4.50	12	F11	F11.38	    **Date provenance.** `2026-06-13`, provenance class `GIT_INTRODUCTION`; the commit that recorded the
116	166865	166875	3410	13	2026-07-14	M4.51	9	F9	F9.50	- **Date:** 2026-07-14
117	168655	168665	3440	27	2026-07-14	M4.51	12	F11	F11.39	    **Date provenance.** `2026-07-14`, provenance class `GIT_INTRODUCTION`; the constitutional rewrite
118	170055	170065	3477	13	2026-07-09	M4.52	9	F9	F9.51	- **Date:** 2026-07-09
119	172293	172303	3512	27	2026-07-09	M4.52	12	F11	F11.40	    **Date provenance.** `2026-07-09`, provenance class `RATIFIED_RECORD`; pre-compression governance
120	173393	173403	3546	13	2026-06-19	M4.53	9	F9	F9.52	- **Date:** 2026-06-19
121	174428	174438	3566	27	2026-06-19	M4.53	12	F11	F11.41	    **Date provenance.** `2026-06-19`, provenance class `GIT_INTRODUCTION`; the hardened promotion and
122	175557	175567	3600	13	2026-06-09	M4.54	9	F9	F9.53	- **Date:** 2026-06-09
123	177295	177305	3628	27	2026-06-09	M4.54	12	F11	F11.42	    **Date provenance.** `2026-06-09`, provenance class `GIT_INTRODUCTION`; the initial constitution
124	178686	178696	3664	13	2026-07-09	M4.55	9	F9	F9.54	- **Date:** 2026-07-09
125	180568	180578	3694	27	2026-07-09	M4.55	12	F11	F11.43	    **Date provenance.** `2026-07-09`, provenance class `RATIFIED_RECORD`; the pre-compression source
126	181545	181555	3727	13	2026-06-09	M4.56	9	F9	F9.55	- **Date:** 2026-06-09
127	182799	182809	3748	27	2026-06-09	M4.56	12	F11	F11.44	    **Date provenance.** `2026-06-09`, provenance class `GIT_INTRODUCTION`; the initial constitution
128	183829	183839	3781	13	2026-06-12	M4.57	9	F9	F9.56	- **Date:** 2026-06-12
129	185502	185512	3810	27	2026-06-12	M4.57	12	F11	F11.45	    **Date provenance.** `2026-06-12`, provenance class `GIT_INTRODUCTION`; the commit that introduced
130	186701	186711	3845	13	2026-07-13	M4.58	9	F9	F9.57	- **Date:** 2026-07-13
131	188421	188431	3875	27	2026-07-13	M4.58	12	F11	F11.46	    **Date provenance.** `2026-07-13`, provenance class `RATIFIED_RECORD`; the pre-compression source
132	188517	188527	3876	21	2026-07-13	M4.58	12	F11	F11.47	    calls this the `2026-07-13` ruling and records the shared namespace together with the
133	189755	189765	3911	13	2026-06-12	M4.59	9	F9	F9.58	- **Date:** 2026-06-12
134	192027	192037	3946	27	2026-06-12	M4.59	12	F11	F11.48	    **Date provenance.** `2026-06-12`, provenance class `GIT_INTRODUCTION`; the commit that aligned
135	193365	193375	3982	13	2026-07-10	M4.60	9	F9	F9.59	- **Date:** 2026-07-10
136	195215	195225	4014	27	2026-07-10	M4.60	12	F11	F11.49	    **Date provenance.** `2026-07-10`, provenance class `GIT_INTRODUCTION`; the commit that introduced
137	196473	196483	4049	13	2026-07-23	M4.61	9	F9	F9.60	- **Date:** 2026-07-23
138	199065	199075	4086	27	2026-07-23	M4.61	12	F11	F11.50	    **Date provenance.** `2026-07-23`, provenance class `GIT_INTRODUCTION`; the commit that introduced
139	200350	200360	4122	13	2026-06-18	M4.62	9	F9	F9.61	- **Date:** 2026-06-18
140	202892	202902	4160	27	2026-06-18	M4.62	12	F11	F11.51	    **Date provenance.** `2026-06-18`, provenance class `GIT_INTRODUCTION`; the commit that ratified the
141	204313	204323	4196	13	2026-06-14	M4.63	9	F9	F9.62	- **Date:** 2026-06-14
142	207697	207707	4242	27	2026-06-14	M4.63	12	F11	F11.52	    **Date provenance.** `2026-06-14`, provenance class `GIT_INTRODUCTION`; the commit that introduced
143	209011	209021	4278	13	2026-07-01	M4.64	9	F9	F9.63	- **Date:** 2026-07-01
144	211714	211724	4319	27	2026-07-01	M4.64	12	F11	F11.53	    **Date provenance.** `2026-07-01`, provenance class `RATIFIED_RECORD`; the pre-compression decision
145	213130	213140	4355	13	2026-07-09	M4.65	9	F9	F9.64	- **Date:** 2026-07-09
146	215374	215384	4390	27	2026-07-09	M4.65	12	F11	F11.54	    **Date provenance.** `2026-07-09`, provenance class `GIT_INTRODUCTION`; the commit that introduced
147	216680	216690	4425	13	2026-07-24	M4.66	9	F9	F9.65	- **Date:** 2026-07-24
148	220955	220965	4481	73	2026-07-24	M4.66	12	F11	F11.55	    **Date provenance, established from substantive source evidence.** `2026-07-24`, provenance class
149	221166	221176	4483	83	2026-07-24	M4.66	12	F11	F11.56	    history. `S29` is the baseline at line 339, which states that Stage 3 closed `2026-07-24` and
150	221417	221427	4486	56	2026-07-24	M4.66	12	F11	F11.57	    `35b968e9dab9fb071ccffc5497283f9cb138df1b`, dated `2026-07-24`, the combined vitals and CI record,
151	221822	221832	4491	70	2026-07-24	M4.66	12	F11	F11.58	    merely permitting it. Row 42 dates `R5#0` / `E047a` to the same `2026-07-24` from the same `S29`
152	222598	222608	4500	45	2026-07-24	M4.66	12	F11	F11.59	    date. The `Date` field is untouched at `2026-07-24`.
153	227781	227791	4581	25	2026-08-18	M5.2	-	D4	D4.1	# DECISIONS archive — 2026-08-18 cleanup migration
154	227863	227873	4583	53	2026-08-18	M5.2	-	D4	D4.2	Material condensed out of `DECISIONS.md` during the 2026-08-18 target-grammar migration. Each
155	228133	228143	4586	28	2026-07-14	M5.2	-	F2	F2.2	`Archive/DECISIONS-ARCHIVE-2026-07-14.md` remains the record of the earlier 2026-07-14
156	228182	228192	4586	77	2026-07-14	M5.2	-	F11	F11.60	`Archive/DECISIONS-ARCHIVE-2026-07-14.md` remains the record of the earlier 2026-07-14
157	229088	229098	4605	75	2026-07-29	M5.2	-	F1	F1.2	**The snapshot filename does not move.** `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` is a ratified
158	230583	230593	4625	54	2026-07-28	M5.3	-	F10	F10.24	(`DECISIONS-CLEANUP-PHASE-1-CLOSURE-CODEX-WORK-ORDER-2026-07-28.md` §3 item 5) requires the displaced
159	232043	232053	4649	45	2026-07-29	M5.3	-	F10	F10.25	`DECISIONS-MIGRATION-COMMISSION-AMENDMENT-1-2026-07-29.md`, which is exhausted by this single use. It is
160	232861	232871	4664	35	2026-07-14	M5.4	-	F2	F2.3	files. `Archive/DECISIONS-ARCHIVE-2026-07-14.md` remains the record of the 2026-07-14
161	232902	232912	4664	76	2026-07-14	M5.4	-	F11	F11.61	files. `Archive/DECISIONS-ARCHIVE-2026-07-14.md` remains the record of the 2026-07-14
162	233009	233019	4665	97	2026-08-18	M5.4	-	D1	D1.2	architectural-constitution pass and is not edited by this migration. `Archive/DECISIONS-ARCHIVE-2026-08-18.md`
163	233165	233175	4667	38	2026-07-29	M5.4	-	F1	F1.3	at. `Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md` is a one-time byte-identical snapshot of this file at
164	234857	234867	4692	45	2026-07-28	M5.5	-	F11	F11.62	The four ID-addressed wrappers carry `Date: 2026-07-28`, the historical retirement date ratified on that
165	235360	235370	4703	67	2026-07-12	M5.5.1	3	F9	F9.66	### Most recent application of P27 and its rejected alternatives (2026-07-12 pass)
166	235502	235512	4712	13	2026-08-18	M5.5.1	4	D2	D2.1	- **Date:** 2026-08-18
167	235974	235984	4724	67	2026-07-12	M5.5.1	8	F9	F9.67	- **Most recent application of P27 and its rejected alternatives (2026-07-12 pass)** — condensed application and its standing rejection history, archived 2026-08-18.
168	236064	236074	4724	157	2026-08-18	M5.5.1	8	D3	D3.1	- **Most recent application of P27 and its rejected alternatives (2026-07-12 pass)** — condensed application and its standing rejection history, archived 2026-08-18.
169	236105	236115	4725	30	2026-08-18	M5.5.1	8	D1	D1.3	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#most-recent-application-of-p27-and-its-rejected-alternatives-2026-07-12-pass`
170	236180	236190	4725	105	2026-07-12	M5.5.1	8	F6	F6.1	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#most-recent-application-of-p27-and-its-rejected-alternatives-2026-07-12-pass`
171	236691	236701	4733	99	2026-07-12	M5.5.1	12	F11	F11.63	    universal core, which stays live. The archived unit carries two historical components — the 2026-07-12
172	237186	237196	4745	46	2026-07-18	M5.5.2	3	F9	F9.68	### Forward case-generation lane lapse note (2026-07-18)
173	237323	237333	4754	13	2026-08-18	M5.5.2	4	D2	D2.2	- **Date:** 2026-08-18
174	237781	237791	4766	46	2026-07-18	M5.5.2	8	F9	F9.69	- **Forward case-generation lane lapse note (2026-07-18)** — section-level lapse disposition, archived 2026-08-18.
175	237841	237851	4766	106	2026-08-18	M5.5.2	8	D3	D3.2	- **Forward case-generation lane lapse note (2026-07-18)** — section-level lapse disposition, archived 2026-08-18.
176	237882	237892	4767	30	2026-08-18	M5.5.2	8	D1	D1.4	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#forward-case-generation-lane-lapse-note-2026-07-18`
177	237936	237946	4767	84	2026-07-18	M5.5.2	8	F6	F6.2	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#forward-case-generation-lane-lapse-note-2026-07-18`
178	238971	238981	4795	13	2026-08-18	M5.5.3	4	D2	D2.3	- **Date:** 2026-08-18
179	239655	239665	4808	122	2026-08-18	M5.5.3	8	D3	D3.3	- **Lane-specific detail of P8 (forward case-generation pipeline)** — lapsed lane detail of a live principle, archived 2026-08-18.
180	239696	239706	4809	30	2026-08-18	M5.5.3	8	D1	D1.5	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#lane-specific-detail-of-p8-forward-case-generation-pipeline`
181	240726	240736	4837	13	2026-07-28	M5.5.4	4	F3	F3.1	- **Date:** 2026-07-28
182	241206	241216	4850	90	2026-07-28	M5.5.4	8	F5	F5.1	- **P9 The case skeleton is English-only** — lapsed conditional lane contract, retired 2026-07-28.
183	241247	241257	4851	30	2026-08-18	M5.5.4	8	D1	D1.6	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p9-the-case-skeleton-is-english-only`
184	242185	242195	4878	13	2026-07-28	M5.5.5	4	F3	F3.2	- **Date:** 2026-07-28
185	242703	242713	4891	125	2026-07-28	M5.5.5	8	F5	F5.2	- **P12 Author-side currency via closed-world construction and routed flags** — lapsed conditional lane contract, retired 2026-07-28.
186	242744	242754	4892	30	2026-08-18	M5.5.5	8	D1	D1.7	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p12-author-side-currency-via-closed-world-construction-and-routed-flags`
187	243595	243605	4918	13	2026-07-28	M5.5.6	4	F3	F3.3	- **Date:** 2026-07-28
188	244093	244103	4931	105	2026-07-28	M5.5.6	8	F5	F5.3	- **P18 Fact-check and flag-only review are chain steps** — lapsed conditional lane contract, retired 2026-07-28.
189	244134	244144	4932	30	2026-08-18	M5.5.6	8	D1	D1.8	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p18-fact-check-and-flag-only-review-are-chain-steps`
190	244987	244997	4958	13	2026-07-28	M5.5.7	4	F3	F3.4	- **Date:** 2026-07-28
191	245505	245515	4971	125	2026-07-28	M5.5.7	8	F5	F5.4	- **P22 Opus skeleton cases are GPT-provenance for review-conflict purposes** — lapsed conditional lane contract, retired 2026-07-28.
192	245546	245556	4972	30	2026-08-18	M5.5.7	8	D1	D1.9	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p22-opus-skeleton-cases-are-gpt-provenance-for-review-conflict-purposes`
193	246544	246554	4991	55	2026-07-05	M5.5.8	3	F9	F9.70	### CBC American-conventional unit ruling (superseded 2026-07-05)
194	246681	246691	5000	13	2026-08-18	M5.5.8	4	D2	D2.4	- **Date:** 2026-08-18
195	247253	247263	5013	55	2026-07-05	M5.5.8	8	F9	F9.71	- **CBC American-conventional unit ruling (superseded 2026-07-05)** — superseded original ruling, archived 2026-08-18.
196	247308	247318	5013	110	2026-08-18	M5.5.8	8	D3	D3.4	- **CBC American-conventional unit ruling (superseded 2026-07-05)** — superseded original ruling, archived 2026-08-18.
197	247349	247359	5014	30	2026-08-18	M5.5.8	8	D1	D1.10	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#cbc-american-conventional-unit-ruling-superseded-2026-07-05`
198	247412	247422	5014	93	2026-07-05	M5.5.8	8	F6	F6.3	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#cbc-american-conventional-unit-ruling-superseded-2026-07-05`
199	247787	247797	5021	74	2026-07-05	M5.5.8	12	F11	F11.64	    and the *Original ruling* paragraph and stops before the *Amendment (2026-07-05)* paragraph, which is
200	248208	248218	5032	43	2026-07-06	M5.5.9	3	F9	F9.72	### Fishbone workflow-familiarity waiver (2026-07-06, superseded)
201	248357	248367	5041	13	2026-08-18	M5.5.9	4	D2	D2.5	- **Date:** 2026-08-18
202	248812	248822	5053	43	2026-07-06	M5.5.9	8	F9	F9.73	- **Fishbone workflow-familiarity waiver (2026-07-06, superseded)** — superseded ad hoc waiver, archived 2026-08-18.
203	248877	248887	5053	108	2026-08-18	M5.5.9	8	D3	D3.5	- **Fishbone workflow-familiarity waiver (2026-07-06, superseded)** — superseded ad hoc waiver, archived 2026-08-18.
204	248918	248928	5054	30	2026-08-18	M5.5.9	8	D1	D1.11	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#fishbone-workflow-familiarity-waiver-2026-07-06-superseded`
205	248969	248979	5054	81	2026-07-06	M5.5.9	8	F6	F6.4	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#fishbone-workflow-familiarity-waiver-2026-07-06-superseded`
206	249815	249825	5080	13	2026-08-18	M5.5.10	4	D2	D2.6	- **Date:** 2026-08-18
207	250358	250368	5092	111	2026-08-18	M5.5.10	8	D3	D3.6	- **Withdrawn claim that vital sanity bounds pass every real value** — withdrawn characterization, archived 2026-08-18.
208	250399	250409	5093	30	2026-08-18	M5.5.10	8	D1	D1.12	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#withdrawn-claim-that-vital-sanity-bounds-pass-every-real-value`
209	251084	251094	5110	50	2026-07-09	M5.5.11	3	F9	F9.74	### Withdrawn governance-markdown encoding gate (2026-07-09)
210	251221	251231	5119	13	2026-08-18	M5.5.11	4	D2	D2.7	- **Date:** 2026-08-18
211	251691	251701	5131	50	2026-07-09	M5.5.11	8	F9	F9.75	- **Withdrawn governance-markdown encoding gate (2026-07-09)** — withdrawn ruling with its named reasoning error, archived 2026-08-18.
212	251767	251777	5131	126	2026-08-18	M5.5.11	8	D3	D3.7	- **Withdrawn governance-markdown encoding gate (2026-07-09)** — withdrawn ruling with its named reasoning error, archived 2026-08-18.
213	251808	251818	5132	30	2026-08-18	M5.5.11	8	D1	D1.13	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#withdrawn-governance-markdown-encoding-gate-2026-07-09`
214	251866	251876	5132	88	2026-07-09	M5.5.11	8	F6	F6.5	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#withdrawn-governance-markdown-encoding-gate-2026-07-09`
215	252839	252849	5160	13	2026-08-18	M5.5.12	4	D2	D2.8	- **Date:** 2026-08-18
216	253423	253433	5172	115	2026-08-18	M5.5.12	8	D3	D3.8	- **Study-session distribution pointer to code** — appendix pointer condensed out of a live principle, archived 2026-08-18.
217	253464	253474	5173	30	2026-08-18	M5.5.12	8	D1	D1.14	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#study-session-distribution-pointer-to-code`
218	254583	254593	5202	13	2026-08-18	M5.5.13	4	D2	D2.9	- **Date:** 2026-08-18
219	255122	255132	5214	91	2026-08-18	M5.5.13	8	D3	D3.9	- **Session artifacts implemented-spec pointer list** — appendix pointer list, archived 2026-08-18.
220	255163	255173	5215	30	2026-08-18	M5.5.13	8	D1	D1.15	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#session-artifacts-implemented-spec-pointer-list`
221	256300	256310	5235	67	2026-07-12	M5.6	-	F9	F9.76	- **Most recent application of P27 and its rejected alternatives (2026-07-12 pass)** — condensed application and its standing rejection history, archived 2026-08-18.
222	256390	256400	5235	157	2026-08-18	M5.6	-	D3	D3.10	- **Most recent application of P27 and its rejected alternatives (2026-07-12 pass)** — condensed application and its standing rejection history, archived 2026-08-18.
223	256431	256441	5236	30	2026-08-18	M5.6	-	D1	D1.16	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#most-recent-application-of-p27-and-its-rejected-alternatives-2026-07-12-pass`
224	256506	256516	5236	105	2026-07-12	M5.6	-	F6	F6.6	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#most-recent-application-of-p27-and-its-rejected-alternatives-2026-07-12-pass`
225	256568	256578	5237	46	2026-07-18	M5.6	-	F9	F9.77	- **Forward case-generation lane lapse note (2026-07-18)** — section-level lapse disposition, archived 2026-08-18.
226	256628	256638	5237	106	2026-08-18	M5.6	-	D3	D3.11	- **Forward case-generation lane lapse note (2026-07-18)** — section-level lapse disposition, archived 2026-08-18.
227	256669	256679	5238	30	2026-08-18	M5.6	-	D1	D1.17	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#forward-case-generation-lane-lapse-note-2026-07-18`
228	256723	256733	5238	84	2026-07-18	M5.6	-	F6	F6.7	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#forward-case-generation-lane-lapse-note-2026-07-18`
229	256856	256866	5239	122	2026-08-18	M5.6	-	D3	D3.12	- **Lane-specific detail of P8 (forward case-generation pipeline)** — lapsed lane detail of a live principle, archived 2026-08-18.
230	256897	256907	5240	30	2026-08-18	M5.6	-	D1	D1.18	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#lane-specific-detail-of-p8-forward-case-generation-pipeline`
231	257061	257071	5241	90	2026-07-28	M5.6	-	F5	F5.5	- **P9 The case skeleton is English-only** — lapsed conditional lane contract, retired 2026-07-28.
232	257102	257112	5242	30	2026-08-18	M5.6	-	D1	D1.19	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p9-the-case-skeleton-is-english-only`
233	257278	257288	5243	125	2026-07-28	M5.6	-	F5	F5.6	- **P12 Author-side currency via closed-world construction and routed flags** — lapsed conditional lane contract, retired 2026-07-28.
234	257319	257329	5244	30	2026-08-18	M5.6	-	D1	D1.20	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p12-author-side-currency-via-closed-world-construction-and-routed-flags`
235	257510	257520	5245	105	2026-07-28	M5.6	-	F5	F5.7	- **P18 Fact-check and flag-only review are chain steps** — lapsed conditional lane contract, retired 2026-07-28.
236	257551	257561	5246	30	2026-08-18	M5.6	-	D1	D1.21	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p18-fact-check-and-flag-only-review-are-chain-steps`
237	257742	257752	5247	125	2026-07-28	M5.6	-	F5	F5.8	- **P22 Opus skeleton cases are GPT-provenance for review-conflict purposes** — lapsed conditional lane contract, retired 2026-07-28.
238	257783	257793	5248	30	2026-08-18	M5.6	-	D1	D1.22	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p22-opus-skeleton-cases-are-gpt-provenance-for-review-conflict-purposes`
239	257924	257934	5249	55	2026-07-05	M5.6	-	F9	F9.78	- **CBC American-conventional unit ruling (superseded 2026-07-05)** — superseded original ruling, archived 2026-08-18.
240	257979	257989	5249	110	2026-08-18	M5.6	-	D3	D3.13	- **CBC American-conventional unit ruling (superseded 2026-07-05)** — superseded original ruling, archived 2026-08-18.
241	258020	258030	5250	30	2026-08-18	M5.6	-	D1	D1.23	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#cbc-american-conventional-unit-ruling-superseded-2026-07-05`
242	258083	258093	5250	93	2026-07-05	M5.6	-	F6	F6.8	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#cbc-american-conventional-unit-ruling-superseded-2026-07-05`
243	258137	258147	5251	43	2026-07-06	M5.6	-	F9	F9.79	- **Fishbone workflow-familiarity waiver (2026-07-06, superseded)** — superseded ad hoc waiver, archived 2026-08-18.
244	258202	258212	5251	108	2026-08-18	M5.6	-	D3	D3.14	- **Fishbone workflow-familiarity waiver (2026-07-06, superseded)** — superseded ad hoc waiver, archived 2026-08-18.
245	258243	258253	5252	30	2026-08-18	M5.6	-	D1	D1.24	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#fishbone-workflow-familiarity-waiver-2026-07-06-superseded`
246	258294	258304	5252	81	2026-07-06	M5.6	-	F6	F6.9	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#fishbone-workflow-familiarity-waiver-2026-07-06-superseded`
247	258427	258437	5253	111	2026-08-18	M5.6	-	D3	D3.15	- **Withdrawn claim that vital sanity bounds pass every real value** — withdrawn characterization, archived 2026-08-18.
248	258468	258478	5254	30	2026-08-18	M5.6	-	D1	D1.25	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#withdrawn-claim-that-vital-sanity-bounds-pass-every-real-value`
249	258595	258605	5255	50	2026-07-09	M5.6	-	F9	F9.80	- **Withdrawn governance-markdown encoding gate (2026-07-09)** — withdrawn ruling with its named reasoning error, archived 2026-08-18.
250	258671	258681	5255	126	2026-08-18	M5.6	-	D3	D3.16	- **Withdrawn governance-markdown encoding gate (2026-07-09)** — withdrawn ruling with its named reasoning error, archived 2026-08-18.
251	258712	258722	5256	30	2026-08-18	M5.6	-	D1	D1.26	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#withdrawn-governance-markdown-encoding-gate-2026-07-09`
252	258770	258780	5256	88	2026-07-09	M5.6	-	F6	F6.10	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#withdrawn-governance-markdown-encoding-gate-2026-07-09`
253	258896	258906	5257	115	2026-08-18	M5.6	-	D3	D3.17	- **Study-session distribution pointer to code** — appendix pointer condensed out of a live principle, archived 2026-08-18.
254	258937	258947	5258	30	2026-08-18	M5.6	-	D1	D1.27	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#study-session-distribution-pointer-to-code`
255	259085	259095	5259	91	2026-08-18	M5.6	-	D3	D3.18	- **Session artifacts implemented-spec pointer list** — appendix pointer list, archived 2026-08-18.
256	259126	259136	5260	30	2026-08-18	M5.6	-	D1	D1.28	  `Archive/DECISIONS-ARCHIVE-2026-08-18.md#session-artifacts-implemented-spec-pointer-list`
257	259257	259267	5263	64	2026-07-28	M5.6	-	F11	F11.65	**The four retirement phrases do not move.** The four `retired 2026-07-28` phrases are historical
258	259768	259778	5275	18	2026-07-28	M5.7	-	F4	F4.1	| P9 | RETIRED | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p9-the-case-skeleton-is-english-only` |
259	259808	259818	5275	58	2026-08-18	M5.7	-	D1	D1.29	| P9 | RETIRED | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p9-the-case-skeleton-is-english-only` |
260	259880	259890	5276	19	2026-07-28	M5.7	-	F4	F4.2	| P12 | RETIRED | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p12-author-side-currency-via-closed-world-construction-and-routed-flags` |
261	259920	259930	5276	59	2026-08-18	M5.7	-	D1	D1.30	| P12 | RETIRED | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p12-author-side-currency-via-closed-world-construction-and-routed-flags` |
262	260101	260111	5279	19	2026-07-28	M5.7	-	F4	F4.3	| P18 | RETIRED | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p18-fact-check-and-flag-only-review-are-chain-steps` |
263	260141	260151	5279	59	2026-08-18	M5.7	-	D1	D1.31	| P18 | RETIRED | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p18-fact-check-and-flag-only-review-are-chain-steps` |
264	260228	260238	5280	19	2026-07-28	M5.7	-	F4	F4.4	| P22 | RETIRED | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p22-opus-skeleton-cases-are-gpt-provenance-for-review-conflict-purposes` |
265	260268	260278	5280	59	2026-08-18	M5.7	-	D1	D1.32	| P22 | RETIRED | 2026-07-28 | `Archive/DECISIONS-ARCHIVE-2026-08-18.md#p22-opus-skeleton-cases-are-gpt-provenance-for-review-conflict-purposes` |
266	263671	263681	5328	51	2026-07-29	M5.8	-	F10	F10.26	`DECISIONS-MIGRATION-STAGE-2A-ARCHIVE-SPAN-HASHES-2026-07-29.md` and were not recomputed from `git show`
267	265665	265675	5359	28	2026-08-04	M6.0	-	F11	F11.66	**The field-test repair of 2026-08-04.** As first authored, this section's ground vocabulary collapsed the
268	266112	266122	5363	60	2026-07-31	M6.0	-	F11	F11.67	single-test formulation as a legacy-prose defect, repaired 2026-07-31. The vocabulary at §M6.1 is now
269	284709	284719	5559	75	2026-07-22	M6.3	-	F10	F10.27	| 42 | `E021` | `P21#2` | Evidence | `audit/terminal-sentence-remediation-2026-07-22/` | NOT-A-PATH | `OMIT` | M4.24 |
270	285338	285348	5566	77	2026-07-03	M6.3	-	F10	F10.28	| 49 | `E025` | `P24#0` | Evidence | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` | CLAUSE-SCOPED | `OMIT` | M4.28 |
271	285630	285640	5568	77	2026-07-03	M6.3	-	F10	F10.29	| 51 | `E026` | `P25#0` | Evidence | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` | NOT-AN-AUTHORITY | `OMIT` | M4.29 |
272	286039	286049	5572	60	2026-07-19	M6.3	-	F10	F10.30	| 55 | `E028` | `P25#2` | Evidence | `Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md` | WRONG-AUTHORITY | `OMIT` | M4.31 |
273	286099	286109	5572	120	2026-07-19	M6.3	-	F10	F10.31	| 55 | `E028` | `P25#2` | Evidence | `Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md` | WRONG-AUTHORITY | `OMIT` | M4.31 |
274	286466	286476	5576	77	2026-07-03	M6.3	-	F10	F10.32	| 59 | `E030` | `P26#0` | Evidence | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` | CLAUSE-SCOPED | `OMIT` | M4.33 |
275	287687	287697	5588	76	2026-07-03	M6.3	-	F10	F10.33	| 71 | `E049` | `R2#0` | Evidence | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` | CLAUSE-SCOPED | `OMIT` | M4.40 |
276	288079	288089	5591	90	2026-07-23	M6.3	-	F10	F10.34	| 74 | `E047a` | `R5#0` | Evidence | `audit/vital-sanity-bounds-p3-stage-3-source-packet-2026-07-23.md`, `audit/vital-sanity-bounds-p3-stage-3-independent-checker-2026-07-23.md` | NO-SINGLE-EVIDENCE-SOURCE | `OMIT` | M4.43 |
277	288153	288163	5591	164	2026-07-23	M6.3	-	F10	F10.35	| 74 | `E047a` | `R5#0` | Evidence | `audit/vital-sanity-bounds-p3-stage-3-source-packet-2026-07-23.md`, `audit/vital-sanity-bounds-p3-stage-3-independent-checker-2026-07-23.md` | NO-SINGLE-EVIDENCE-SOURCE | `OMIT` | M4.43 |
278	288370	288380	5593	63	2026-07-23	M6.3	-	F10	F10.36	| 76 | `E073` | `R6#0` | Evidence | `audit/ci-coverage-survey-2026-07-23.report.md`, `audit/ci-coverage-survey-2026-07-23.independent-checker.md` | NO-SINGLE-EVIDENCE-SOURCE | `OMIT` | M4.44 |
279	288419	288429	5593	112	2026-07-23	M6.3	-	F10	F10.37	| 76 | `E073` | `R6#0` | Evidence | `audit/ci-coverage-survey-2026-07-23.report.md`, `audit/ci-coverage-survey-2026-07-23.independent-checker.md` | NO-SINGLE-EVIDENCE-SOURCE | `OMIT` | M4.44 |
280	293964	293974	5643	43	2026-07-18	M6.4	-	F10	F10.38	| 5 | `audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json` | Evidence | `P29#0` | M4.36 |
281	294074	294084	5644	47	2026-07-19	M6.4	-	F10	F10.39	| 6 | `audit/lab-reference-range-verification-2026-07-19.md` | Evidence | `P30#0` | M4.37 |
282	294148	294158	5645	29	2026-07-19	M6.4	-	F10	F10.40	| 7 | `Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md` | Evidence | `R3#0` | M4.41 |
283	294328	294338	5647	29	2026-07-19	M6.4	-	F10	F10.41	| 9 | `Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md` | Evidence | `R4#0` | M4.42 |
284	294387	294397	5647	88	2026-07-16	M6.4	-	F10	F10.42	| 9 | `Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md` | Evidence | `R4#0` | M4.42 |
285	299666	299676	5719	42	2026-08-04	M6.7	-	F11	F11.68	The population grew from eight to ten on 2026-08-04. `P4#0` and `P7#0` were added: their draft registers
286	302167	302177	5741	60	2026-08-04	M6.7	-	F11	F11.69	have their item-10 `Evidence` reasoning repaired under the 2026-08-04 work order, so their grounds are
287	308550	308560	5846	85	2026-07-30	M7	-	F11	F11.70	yet exist. The **model** those rows must follow is fixed now, by owner direction of 2026-07-30, and
288	311458	311468	5889	38	2026-07-31	M7.2a	-	F11	F11.71	**Disposition, by owner direction of 2026-07-31:** a distinct date-dependent family claims that span.
```

## 6. Self-checks

| check | result |
|---|---|
| Rows | 288 |
| Unique surface IDs | 288 |
| Every occurrence mapped exactly once | PASS |
| Every surface ID used exactly once | PASS |
| Family sums equal row count | PASS |
| Dependent partition equals established `32/9/18/2/1/1` | PASS |
| Manifest bytes edited | 0 |

## 7. Unmeasured

Exclusivity and coverage validation, derived-report bytes, embedded-report equality, Stage 2b readiness, owner
ratification, and constitutional-content correctness are **unmeasured** here. They belong to steps 4–6 and to the
commission review, and are not cleared by this mapping.

