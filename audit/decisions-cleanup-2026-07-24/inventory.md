# DECISIONS.md Cleanup — Phase 1 (Correction Pass) — Entry Inventory

**Commission:** `DECISIONS-CLEANUP-PHASE-1-SURVEY-CODEX-SPEC-2026-07-24.md` (Amendments 1–5)
**Correction sequencing:** `DECISIONS-CLEANUP-PHASE-1-CORRECTION-WORK-ORDER-2026-07-24.md`
**Contract:** `DECISIONS-TAXONOMY-2026-07-24.md` — **RATIFIED 2026-07-24 by Luke, including Amendments 1–2.**
**This is classify-and-propose. Nothing in `DECISIONS.md` is edited, moved, renumbered, retagged, or deleted.**

## What survives from pass 2, what this pass rebuilds

Pass 2 was refused at architect review on six defects (Amendment 5, spec §12): three were the spec's
own (fixed by Amendment 5), three were producer defects (the generator's Oxford-comma/`.tsx`/extension
bugs; `E047c`'s taxonomy breach; `E029`'s unnumbered-`R` breach). **Not scrap:** the 78-entry boundary
set (the E039a/E039b split, the E047a/E047b/E047c split), the mis-file corrections on E047a and E049,
the dual-provenance handling, the R-series bootstrap (R1=E070, R2=E049, R3=E072), and the frozen-input
ordering all anchor this pass unchanged. What this pass rebuilds: the reference graph (regenerated from
the corrected generator, §3 of the correction work order), the two flagged classifications (§4.1/§4.2
below), E037's destination (§4.3), the LAPSED review queue (now a two-axis partition, §5), and — the
field Amendment 5 specifically requires **not** be carried forward as "preserved from an earlier pass"
— every evidence field below, re-derived in full from `DECISIONS.md` at `CORRECTION_HEAD` itself.

## Frozen input

| Field | Value |
|---|---|
| `CORRECTION_HEAD` | `547fdea695ed55df5afbf2260bb6a4502258ccba` — the commit carrying only the amended survey spec (Amendment 5) and the correction work order |
| `generatorGitSha` (final) | `5c77b153855b308761d2b5da1e99d33ad6da99a9` — the final corrected-generator commit used for the deliverables below (`69a8034` and `04800f4` were superseded by the tracked-index-precedence fix before this graph's final regeneration) |
| `SURVEY_HEAD` (historical, unchanged) | `f68210ceb62e42d7f028157629a770faf02eab42` — pass 2's baseline; not reused here (spec §3a) |
| Branch | `survey/decisions-cleanup-phase-1` |
| Push target | this branch, draft PR #88 — **nothing goes to `main`** |
| `DECISIONS.md` | byte-identical at `35b968e`, `f68210c`, and `CORRECTION_HEAD` (confirmed: `git diff --stat 35b968e..HEAD -- DECISIONS.md` is empty) — every line number and byte length below is exact, not estimated from a stale snapshot |

## Legend

- **Kind** (taxonomy §3): `P` governing principle · `R` concrete ruling · `I` standing invariant ·
  `T` open thread (unsettled question only — Amendment 2) · `X` archived.
- **Status** (taxonomy §4): the five existing tags, decoupled from kind.
- **Force** (taxonomy §5): `BINDING` · `AUTHORIZING` · `ADVISORY` · `HISTORICAL` — force-as-written.
- **Exec** (taxonomy §4a): `EXECUTED` · `PENDING` · `INACTIVE` · `—` (omitted).

## Classification table

| id | § | line | heading (abbrev) | kind | status | force | exec | Δ pass 2 |
|---|---|---|---|---|---|---|---|---|
| E001 | 4 | 87 | P1 Answer placement owned by code | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E002 | 4 | 90 | P2 Independent review scoped to judgment (core) | P | ACTIVE | BINDING | — | unchanged (carries E037's 2nd rule) |
| E003 | 4 | 95 | P2 Kept: spec-conformance/content-review split | P | ACTIVE | BINDING | — | unchanged |
| E004 | 4 | 97 | P3 Deterministic core; LLM capped residual | P | ACTIVE | BINDING | — | unchanged |
| E005 | 4 | 100 | P4 Rationales position-agnostic, bilingual | P | ACTIVE | BINDING | — | unchanged |
| E006 | 4 | 103 | P5 Generated ≠ reviewed (core) | P | ACTIVE | BINDING | — | unchanged (carries E037's 2nd rule) |
| E007 | 4 | 106 | P5 Narrowing note (named-model restrictions) | P | ACTIVE | AUTHORIZING | — | unchanged |
| E008 | 4 | 108 | P6 Visuals deterministic; curated-image lane | P | ACTIVE | BINDING | — | unchanged |
| E009 | 4 | 113 | P7 Precision over volume | P | ACTIVE | ADVISORY | — | unchanged |
| E010 | 4 | 116 | P10 Study sessions mirror exam distribution | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E011 | 4 | 121 | P11 Visual arithmetic machine-checked gate | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E012 | 4 | 124 | P15 Bank patches raw-scoped, declarative (core) | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E013 | 4 | 127 | P15 Application: op names a field path (2026-07-22) | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E014 | 4 | 133 | P16 Answer-pattern bias presentation-first (core) | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E015 | 4 | 138 | P16 Amendment: canonical file not a population (2026-07-15) | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E016 | 4 | 145 | P16 Standing authoring note | P | ACTIVE | ADVISORY | — | unchanged |
| E017 | 4 | 147 | P17 Scoring polytomous; retention full-marks | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E018 | 4 | 150 | P19 Rationale visuals are explanation figures | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E019 | 4 | 159 | P21 Repo-reading prompts carry semantic floor (core) | P | ACTIVE | BINDING | — | unchanged |
| E020 | 4 | 162 | P21 App: construction language off learner surface | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E021 | 4 | 164 | P21 App: construction language functional not positional | P | ACTIVE | BINDING | — | unchanged |
| E022 | 4 | 170 | P23 Exam-like presentation is a renderer concern (core) | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E023 | 4 | 177 | P23 App: sparse shape-aware allocation | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E024 | 4 | 186 | P23 App: embedded leaf planning not retirement | P | ACTIVE | BINDING | — | unchanged |
| E025 | 4 | 192 | P24 Structured measurements values-only | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E026 | 4 | 199 | P25 Necessity is a property of the artifact (core) | P | ACTIVE | BINDING | — | unchanged |
| E027 | 4 | 204 | P25 App: composite trend artifacts | P | ACTIVE (vitals_trend clause superseded by E028) | BINDING | EXECUTED | unchanged |
| E028 | 4 | 206 | P25 Amendment: unified single-axis vitals_trend | P | ACTIVE | BINDING | EXECUTED | unchanged |
| **E029** | 4 | 208 | P25 Implementer note (reinstate flowsheet) | **P** | ACTIVE | BINDING | **PENDING** | **repaired — see §4.2**: kind `R`→`P`, no `R` number; shares permanent ID **P25** as an application, like E013/E015 |
| E030 | 4 | 210 | P26 Disposition suppressing a check must be checked | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E031 | 4 | 215 | P27 Invariant softens only by naming its incident (core) | P | ACTIVE | BINDING | — | unchanged |
| E032 | 4 | 218 | P27 Most recent application (2026-07-12 pass) | X | ACTIVE | HISTORICAL | — | unchanged |
| E033 | 4 | 220 | P28 Scored leaves govern planning | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E034 | 4 | 227 | P29 Sparse lab cardinality not a validity floor | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E035 | 4 | 244 | P30 Lab reference bands adult-only; peds fail closed | P | ACTIVE | BINDING | EXECUTED | unchanged |
| E036 | 5 | 300 | §5 Lapse note (2026-07-18) | X | CONDITIONAL→lapsed | HISTORICAL | — | unchanged |
| E037 | 5 | 302 | §5 Two universal rules stated once | P | ACTIVE | BINDING | — | **destination repaired — see §4.3**: `MERGE_INTO E039a, E002, E006` |
| E038 | 5 | 307 | §5 Current producer assignment callout | I | ACTIVE | ADVISORY | — | unchanged |
| **E039a** | 5 | 309 | P8 universal core | P | ACTIVE | BINDING | — | unchanged |
| **E039b** | 5 | 309 | P8 lane-specific detail | X | CONDITIONAL (LAPSED) | HISTORICAL | — | unchanged |
| E040 | 5 | 312 | P9 CONDITIONAL skeleton English-only | X | CONDITIONAL (LAPSED) | HISTORICAL | — | unchanged — not ruled on |
| E041 | 5 | 315 | P12 CONDITIONAL author-side currency | X | CONDITIONAL (LAPSED) | HISTORICAL | — | unchanged — not ruled on |
| E042 | 5 | 318 | P18 CONDITIONAL fact-check/flag-review chain | X | CONDITIONAL (LAPSED) | HISTORICAL | — | unchanged — not ruled on |
| E043b | 5 | 321 | P22 CONDITIONAL conditional-principle prose | X | CONDITIONAL (LAPSED) | HISTORICAL | — | unchanged — not ruled on |
| E043a | 5 | 321 (via §5 note l.300) | P22 `opus*` routing rule (still in force) | I | ACTIVE | BINDING | EXECUTED | unchanged — force-preservation hazard |
| **E044** | 6 | 326 | P20 Pronunciation/audio (PARKED) | P | PARKED | ADVISORY | INACTIVE | unchanged — number 20 retained |
| E045 | 6 | 331 | Translation-friction scoring (PARKED) | T | PARKED | ADVISORY | — | unchanged |
| E046 | 6 | 333 | test/adaptive exam-condition modes (PARKED) | T | PARKED | ADVISORY | — | unchanged |
| E047a | 7 | 339 | Vital-`sanity` SBP/RR/`spo2` ratifications | R | ACTIVE | BINDING | PENDING | unchanged — **R4** |
| E047b | 7 | 339 | Vital-`sanity` DBP/MAP/temp-floor/`sao2` open sides | T | REVISIT | ADVISORY | — | unchanged |
| **E047c** | 7 | 339 | Vital-`sanity` found/temp-closed chronology | **X** | **ACTIVE** | HISTORICAL | **EXECUTED** | **repaired — see §4.1**: status `REVISIT`→`ACTIVE` (taxonomy breach fixed); kind/force/destination unchanged |
| E048 | 8 | 343 | CBC American-conventional (superseded original) | X | SUPERSEDED | HISTORICAL | — | unchanged |
| E049 | 8 | 347 | CBC conventional-first + SI-paren, analyte-aware | R | ACTIVE | BINDING | EXECUTED | unchanged — **R2** |
| E050 | 8 | 349 | Fishbone workflow-familiarity waiver (superseded) | X | SUPERSEDED | HISTORICAL | — | unchanged |
| E051 | 8 | 351 | "Vitals sanity passes every real value" (withdrawn) | X | SUPERSEDED | HISTORICAL | — | unchanged |
| E052 | 8 | 353 | Governance-markdown encoding gate (withdrawn) | X | SUPERSEDED | HISTORICAL | — | unchanged |
| E053 | 8 | 359 | §8 closing archive pointer | X | ACTIVE | HISTORICAL | — | unchanged |
| E054 | app | 366 | INV Runtime audio: no client-embedded secret | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E055 | app | 367 | INV Bilingual EN / zh-CN parity | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E056 | app | 368 | INV `question.topic` English-only | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E057 | app | 369 | INV JSON quote hygiene parse-time gate | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E058 | app | 370 | INV Question IDs globally unique | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E059 | app | 371 | INV Raw-draft prefix routing | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E060 | app | 372 | INV Canonical merges deterministic | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E061 | app | 373 | INV Runtime static/offline/`file://` | I | ACTIVE | BINDING | — | unchanged |
| E062 | app | 374 | INV Schema versions ordered token, minor ≤ 9 | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E063 | app | 375 | INV Schema changes rare and deliberate | I | ACTIVE | ADVISORY | — | unchanged |
| E064 | app | 376 | INV Shared visual numeric helpers single def | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E065 | app | 377 | INV Case-study exhibit ids one namespace | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E066 | app | 378 | INV Category targets are test-plan weights | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E067 | app | 379 | INV Bank composition is a floor problem | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E068 | app | 380 | INV Repository-state hygiene mechanism-specific | I | ACTIVE | BINDING | — | unchanged |
| E069 | app | 381 | INV Some topics shared across categories | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E070 | app | 382 | Standalone bowtie may be generated directly | R | ACTIVE | AUTHORIZING | EXECUTED | unchanged — **R1** |
| E071 | app | 383 | INV Highlight structural bias gate schema-level | I | ACTIVE | BINDING | EXECUTED | unchanged |
| E072 | app | 384 | Promoted visual parity per-kind baseline | R | ACTIVE | BINDING | EXECUTED | unchanged — **R3** |
| E073 | app | 385 | PR vs post-merge CI coverage distinct | R | ACTIVE | AUTHORIZING | PENDING | unchanged — **R5** |
| E074 | app | 387 | Gemini's standing restrictions | P | ACTIVE | BINDING | — | unchanged — flagged, see §6 below |
| E075 | app | 389 | Study-session distribution pointer | X | ACTIVE | HISTORICAL | — | unchanged |
| E076 | app | 391 | Session artifacts (implemented spec pointers) | X | ACTIVE | HISTORICAL | — | unchanged |

**78 rows** (unchanged from pass 2).

## §4.1 — E047c status repair (taxonomy breach)

Pass 2 recorded `E047c` as `X | REVISIT`. Taxonomy §4 makes `REVISIT` compatible with `T` only. Its own
wording (line 339, the "Amendment 3A/R17... temp closed 2026-07-15" clause through "Luke's sign-off and
architect ratification: 2026-07-15") describes a **closed, ratified, already-implemented** disposition —
the temp sanity ceiling itself (`46.5°C`, `VITAL_SANITY_MAX_OVERRIDES.temp`) — not an open question. It
is not a thread. I changed **status only**, `REVISIT` → `ACTIVE`, matching the precedent already accepted
elsewhere in this same table for an archived-but-settled application record (`E032`, kind `X` / status
`ACTIVE` / force `HISTORICAL`). Kind (`X`), force (`HISTORICAL`), and destination (`ARCHIVE`) are
unchanged, per the work order's instruction not to touch them absent a wording requirement.

**Reading recorded, not chosen unilaterally:** the temp-ceiling value itself is arguably closer to a
concrete ruling (kind `R`, matching `E047a`'s treatment for the sibling SBP/RR/`spo2` values) than to
archived chronology. I did not make that change, because (a) pass 2's own label for this row —
"found/temp-closed **chronology**" — frames it as historical narrative, not an operative disposition in
its own right, and (b) promoting it to `R` would date it 2026-07-15 (Luke's sign-off), which sits
**before** `E072` (2026-07-17) in the R-series bootstrap and would renumber the entire confirmed series
(R1..R5) a second time, unprompted by anything in this pass's commission. §4.2 already does this once,
on the work order's explicit instruction, for `E029`; doing it again here on my own initiative is exactly
the kind of unilateral targeting/classification widening §3.5 warns against. **Routed to the owner as an
open question in `findings.md`**, not decided here.

## §4.2 — E029 repair (unnumbered `R` breach)

Pass 2 recorded `E029` as kind `R`, unnumbered, attached in prose to `P25` — a taxonomy §7 breach (an
unnumbered ruling is permitted only when routed to `UNCLEAR_REQUIRES_OWNER`). Its actual text: *"the
tested `epic` build used the hidden-table (Route C) disposition, so reinstate the visible flowsheet so
shipped code matches this ratified model."* This directs **catching code up to an already-ratified
model** — the model itself was decided in `E028`'s Amendment (2026-07-19) — not a new decision fixing a
value. Taxonomy's own kind test for `R` ("settles specified items and generalizes to nothing further")
fails: `E029` settles nothing new. The taxonomy's kind test for a settled-but-unbuilt decision
("stays `P`, `R`, or `I` and carries `EXECUTION: PENDING`... unbuilt is not undecided") matches exactly.

**Reclassified `P`, sharing permanent ID `P25`** (no new number), execution `PENDING` — the same pattern
already accepted in this table for `E013` ("P15 Application...", ID `P15`) and `E015` ("P16 Amendment...",
ID `P16`). This resolves the breach without an R-series renumbering.

**Alternative reading, recorded per the work order's instruction to state it:** `E029` could instead take
an `R` number in date order (2026-07-19), which would insert between `E072` (R3, 2026-07-17) and
`E047a`/`E073` (2026-07-24), becoming the new R4 and shifting `E047a`→R5, `E073`→R6. Both dispositions
are defensible; I chose the application reading because it is directly precedented twice already in this
table and because the entry's own wording states it settles nothing new. Recorded in `findings.md` for
the owner to override if they read it differently.

## §4.3 — E037 `MERGE_INTO` (Amendment 5 destination)

Owner ruling (spec §8, ratified 2026-07-24 — the ruling that names `MERGE_INTO`'s refusal of a number):
`E037`'s first rule ("clinical truth and answer logic have an explicit upstream owner...") returns to
principle 8's restored core, **E039a**. Its second rule ("every active generation lane declares producer
provenance and independent-review routing") is an application of principles 2 and 5 and attaches to
**E002** and **E006**. Verifying the four conditions:

1. **Owner ruling on record** — yes, spec §8 ruling 2, quoted above.
2. **Every target named, each its own `STAY` row** — `E039a` (STAY, P8 restored), `E002` (STAY, P2),
   `E006` (STAY, P5) — all three appear above with destination `STAY`.
3. **No permanent ID proposed** — `*(none — merged)*`, naming the ruling that refuses it: spec §8
   ruling 2, 2026-07-24 ("No `P31` is minted").
4. **Every rule accounted for in a named target, force before/after stated** — rule 1 → `E039a` only.
   Rule 2 → **both** `E002` and `E006` (the work order's own text: *"Both must land in a named target
   row... and you must show that in the table"*) — `E002` and `E006`'s notes columns in
   `migration-table.md` now each name `E037`'s second rule explicitly, rather than asserting the mapping
   only in a note on `E037`'s own row. Force before `BINDING`, force after `BINDING` (unchanged — the
   content stays live, nothing is displaced).

`E037`'s own row: destination **`MERGE_INTO E039a, E002, E006`**.

## Re-derived evidence fields (Amendment 5 §5.1)

**Methodology, stated because Amendment 5 withdraws "preserved from pass 1/2" as an acceptable value:**
byte length is measured from `DECISIONS.md` at `CORRECTION_HEAD` directly — each entry's UTF-8 byte
length is its own text span (from its stated line to immediately before the next entry's line, trimmed
of trailing whitespace), with two corrections: (a) a span is capped before any intervening `##` section
heading it would otherwise swallow (affects `E035`, `E043b`, `E046`, `E053`); (b) five entries share a
physical paragraph with siblings (`E036`/`E043a` inside line 300; `E039a`/`E039b` inside lines 309–310;
`E047a`/`E047b`/`E047c` inside line 339) and are split at sentence boundaries, verified against which
entry pass 2's own Detail section already cited each sentence as belonging to (e.g., `E047a`'s
`EXECUTION: PENDING` citation of "a later implementation commission may add the ratified SBP and RR
ceiling overrides" fixes that sentence to `E047a`, not `E047b`). **Evidence-fraction** is a rough
estimate (low/moderate/high) of how much of the span is reproduced evidence, method, measurement, or
chronology versus statement of the rule. **Contradiction-flag** was checked by grep against the named
executable owner for every entry whose text states a checkable numeric or enum constant; this is a
targeted sample, not an exhaustive re-verification of every claim in all 78 entries against all source
code — the sampled set (below) found zero contradictions.

| id | bytes | evidence-fraction | forcing incident | evidence pointer | executable owner | contradiction |
|---|---|---|---|---|---|---|
| E001 | 792 | moderate (~35%) | Y — D-correct-at-~3% audit finding; archived | — | `lib/shuffle.ts`, `scripts/promote.ts` | not checked |
| E002 | 840 | low (~10%) | N | — | — | not checked |
| E003 | 930 | moderate (~45%) | Y — `>150s` aPTT / `parseMeasurementValue` comparator-strip; "full narrowing rationale... archive" | archive (unnamed path) | `parseMeasurementValue` | not checked |
| E004 | 885 | low (~15%) | N | archive (topic-licensing rulings) | — | not checked |
| E005 | 406 | low (~5%) | N | — | — | not checked |
| E006 | 421 | low (~10%) | N | — | — | not checked |
| E007 | 346 | low (~10%) | N | §8 (E074) | — | not checked |
| E008 | 1100 | low (~15%) | N | — | — | not checked |
| E009 | 230 | low (~5%) | N | — | — | not checked |
| E010 | 1043 | moderate (~40%) | N | — | `src/schema.ts` (`NCLEX_CATEGORY_WEIGHTS`), `src/sessionSampler.ts` | not checked |
| E011 | 1131 | moderate (~20%) | N | — | per-kind `selfCheck` (unnamed paths) | not checked |
| E012 | 462 | low (~10%) | N | — | `scripts/patch-raw.ts` | not checked |
| E013 | 1886 | high (~55%) | Y — 7 `dropdown_cloze` items, language-asymmetric anchor collision | — | `scripts/patch-raw.ts` (`path` segment array) | not checked |
| E014 | 1446 | moderate (~25%) | N (design rationale, not incident) | — | `scripts/audit/non-mcq-bias-lib.ts` | not checked |
| E015 | 2644 | high (~65%) | **N — explicit disclaimer**: "no forcing incident is recorded" | PR #48 evidence base (archive) | `scripts/audit/non-mcq-bias-lib.ts` | **checked — matches** (`audit_version 2.1.0`, `max_cell_deviation_pp: 8`, `sata_count_degeneracy: 0.70`, `sata_count_min_n: 8`, `scramble_min_n: 8`, `template_repeat_max_share: 0.15` all confirmed verbatim in source) |
| E016 | 300 | low (~10%) | N | — | — | not checked |
| E017 | 452 | low (~10%) | N | — | — | not checked |
| E018 | 1007 | moderate (~25%) | N | — | `src/schema.ts` | not checked |
| E019 | 1038 | moderate (~20%) | N | — | `AGENTS.md` / `NCLEX-Question-Schema.md` (cross-doc, not code) | not checked |
| E020 | 1112 | moderate (~30%) | N | — | `lib/producer-vocabulary-leakage.ts`, `lib/authorial-constraint-leakage.ts` | not checked |
| E021 | 2324 | high (~70%) | Y — PEP `ordered_response` item, RSBI item, `gap_50_mc_03` raw-placeholder defect | `audit/terminal-sentence-remediation-2026-07-22/` | — | not checked |
| E022 | 1474 | moderate (~20%) | N | — | `src/examLayout.ts` | not checked |
| E023 | 726 | low (~15%) | N | — | `src/examLayout.ts` | not checked |
| E024 | 1799 | moderate (~35%) | Y — 2026-07-22 withdrawn leaf-retirement authorization | — | — | not checked |
| E025 | 1808 | moderate (~30%) | N | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` | `src/types.ts`, `src/schema.ts`, `src/measurementAllowlist.ts`, `src/measurementUnitPolicy.ts` | not checked |
| E026 | 1345 | moderate (~20%) | N (chronology archived, not restated) | archive (io_trend/fishbone) | — | not checked |
| E027 | 1157 | low (~15%) | N | — | — | not checked |
| E028 | 1947 | moderate (~40%) | Y — concluded A/B experiment, real-user preference | `Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md` | `vitalsChartStyle` setting | not checked |
| E029 | 346 | low (~10%) | N | — | — | not checked |
| E030 | 1513 | high (~45%) | Y — 16 `reason: "prior"` exclusions deleted a baseline electrolyte panel, gated clean | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`, migration archive | — | not checked |
| E031 | 917 | moderate (~40%) | Y (names four: D-correct-3%, two quote-hygiene incidents, `roundTo`, producer≠checker) | archive (rejected alternatives) | — | not checked |
| E032 | 931 | high (~70%) | N (itself a closed-application record) | archive (rejected-alternative reasoning) | — | not checked |
| E033 | 1864 | moderate (~35%) | N (names PR #51/#52 reason, not a failure incident) | — | `lib/question-population.ts`, `scripts/census.ts`, `scripts/coverage-report.ts` | not checked |
| E034 | 2911 | high (~65%) | N (survey adjudication, not a failure) | `Archive/root-cleanup-2026-07-19/SINGLE-ROW-LAB-PANELS-P4-SURVEY-SPEC-2026-07-18.md`, `audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json` | — | not checked |
| E035 | 3374 | high (~75%) | N (ratification record, not a failure) | `audit/lab-reference-range-verification-2026-07-19.md` | `src/visuals/kinds/lab_trend/defs.ts`, `.../index.ts` | **checked — matches** (magnesium 1.7–2.3, glucose 65–139, anion gap 7–15, BNP 0–100 all confirmed verbatim in `defs.ts`; temp ceiling 46.5 confirmed in `src/measurementAllowlist.ts`) |
| E036 | 498 | low (~15%) | N | `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md` | — | not checked |
| E037 | 652 | low (~5%) | N | — | — | not checked |
| E038 | 561 | low (~15%) | N | `PROJECT-HISTORY.md` (verify, not assumed timeless) | — | not checked |
| E039a | 456 (est., split of shared 309–310 span) | low (~10%) | N | — | — | not checked |
| E039b | 629 (est., split of shared 309–310 span) | moderate (~20%) | N | — | — | not checked |
| E040 | 497 | low (~15%) | N | — | — | not checked |
| E041 | 790 | moderate (~25%) | N | — | — | not checked |
| E042 | 536 | low (~15%) | N | — | — | not checked |
| E043b | 769 | moderate (~30%) | N | — | `scripts/audit/early-bank-semantic-layer-a.ts` (matcher regex named) | not checked |
| E043a | 642 (embedded in line 300, split from E036) | moderate (~20%) | N | — | `scripts/audit/early-bank-semantic-layer-a.ts` | not checked |
| E044 | 1137 | moderate (~35%) | N (deprioritization, not a failure) | — | `src/audio/normalizeForTts.ts`, `scripts/audio/build-tts-queue.ts` | not checked |
| E045 | 379 | low (~15%) | N | — | — | not checked |
| E046 | 511 | low (~15%) | N | — | — | not checked |
| E047a | 697 (est., split of shared line 339) | moderate (~25%) | N | `audit/vital-sanity-bounds-p3-stage-3-source-packet-2026-07-23.md`, `...-independent-checker-2026-07-23.md` | — | not checked |
| E047b | 703 (est., split of shared line 339) | low (~20%) | N | same packet | — | not checked |
| E047c | 1787 (est., split of shared line 339) | high (~70%) | **Y — the entry's own incident: Amendment 3A/R17, found 2026-07-10, temp ceiling closed 2026-07-15, sourced to Slovis et al. 1982** | `Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md` | `src/measurementAllowlist.ts` (`VITAL_SANITY_MAX_OVERRIDES.temp`) | **checked — matches** (46.5 confirmed verbatim) |
| E048 | 609 | moderate (~30%) | N | — | — | not checked |
| E049 | 1095 | moderate (~30%) | N | extraction-contract Rule C | `src/measurementUnitPolicy.ts` | not checked |
| E050 | 350 | low (~15%) | N | E026 (P25) | — | not checked |
| E051 | 479 | moderate (~45%) | N (counter-evidence named, not a new incident) | E047 (§7) | — | not checked |
| E052 | 1754 | high (~60%) | N (reasoning-error analysis, not a new incident) | `CLAUDE.md` §filesystem | — | not checked |
| E053 | 248 | low (~10%) | N | `Archive/DECISIONS-ARCHIVE-2026-07-14.md` | — | not checked |
| E054 | 434 | moderate (~35%) | N (categorical GitHub Pages reasoning) | — | GitHub Pages / Vite inlining behavior | not checked |
| E055 | 52 | none (0%) | N | — | — | not checked |
| E056 | 182 | low (~20%) | N | — | `validateBankObject` Tier 0 | not checked |
| E057 | 315 | low (~15%) | N | `docs/AGENTS-RUNBOOK.md` | — | not checked |
| E058 | 127 | low (~10%) | N | — | `audit:ids` | not checked |
| E059 | 476 | moderate (~30%) | N | — | `lib/canonical-routing.ts` | not checked |
| E060 | 107 | low (~10%) | N | — | `npm run consolidate` | not checked |
| E061 | 100 | none (0%) | N | — | — | not checked |
| E062 | 513 | moderate (~30%) | N | — | `src/types.ts` (`SchemaVersion`) | **checked — matches** (union tops out at `"1.9"` before `"2.0"`, consistent with "minor never exceeds 9") |
| E063 | 41 | none (0%) | N | — | — | not checked |
| E064 | 156 | low (~10%) | N | — | `src/visuals/primitives/graphPaper.ts` | not checked |
| E065 | 208 | low (~10%) | N | — | — | not checked |
| E066 | 299 | low (~15%) | N | — | `NCLEX_CATEGORY_WEIGHTS` | not checked |
| E067 | 352 | low (~15%) | N | — | `floorThreshold` | not checked |
| E068 | 349 | low (~15%) | N | `AGENTS.md` | — | not checked |
| E069 | 549 | moderate (~35%) | N (two worked examples, not a failure) | — | `src/topics.ts` | not checked |
| E070 | 667 | moderate (~40%) | Y — case-origination requirement mis-scoped | — | — | not checked |
| E071 | 422 | low (~20%) | N | — | Tier 0 validation | not checked |
| E072 | 965 | moderate (~40%) | N (rebaseline procedure detail) | — | `scripts/tests/__snapshots__/visual-parity-promoted/` | not checked |
| E073 | 1035 | high (~45%) | N (ratified/rejected list, not a failure) | `audit/ci-coverage-survey-2026-07-23.report.md`, `...independent-checker.md` | — | not checked |
| E074 | 696 | moderate (~30%) | N (names Jun 26 Gemini demotion, not restated in detail) | — | — | **flagged — see findings.md**: cites lapsed principles 8/18 in present tense to justify a still-ACTIVE rule |
| E075 | 293 | low (~10%) | N | — | `src/schema.ts`, `src/sessionSampler.ts` | not checked |
| E076 | 829 | high (~70%, mostly pointer list) | N | multiple `Archive/…` specs | — | not checked |
