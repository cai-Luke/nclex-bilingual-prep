# DECISIONS.md Cleanup — Phase 1 (Correction Pass) — Migration Table

78 rows (unchanged from pass 2: 76 pass-1 entries + the E039a/E039b split). **Destination is exactly
`STAY`, `ARCHIVE`, or `MERGE_INTO <target ids>`** (Amendment 5, spec §8) — there is no fourth option and
no bare `MERGE`. Pass 2 wrote `MERGE` for `E037` and stated in the open that it was not one of the two
values the spec then permitted; Amendment 5 defines `MERGE_INTO` for exactly this outcome and bounds it
with four conditions, verified below for `E037`.

**Force before / force after are stated for every row.** Two rows are flagged `⚠ MIS-FILE, NOT A
FORCE CHANGE` (unchanged from pass 2 — the spec names both by name, §8). No row in this pass carries a
genuine force-before/force-after delta requiring owner ratification.

**Repaired this pass (see `inventory.md` §4.1–§4.3 for full reasoning):** `E029` (kind `R`→`P`, no `R`
number minted — was an unnumbered-`R` taxonomy breach), `E047c` (status `REVISIT`→`ACTIVE` — was a
`REVISIT`-on-non-`T` taxonomy breach), `E037` (destination `MERGE`→`MERGE_INTO E039a, E002, E006`, with
both targets of its second rule now shown explicitly in `E002` and `E006`'s own rows rather than
asserted only in a note on `E037`'s row).

| id | heading | kind | status | force before | force after | destination | permanent ID | exec | evidence pointer | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| E001 | P1 Answer placement owned by code | P | ACTIVE | BINDING | BINDING | STAY | P1 | EXECUTED | archive (full incident) | |
| E002 | P2 Independent review scoped to judgment | P | ACTIVE | BINDING | BINDING | STAY | P2 | — | — | **carries E037's 2nd rule** (producer provenance / independent-review routing — MERGE_INTO target) |
| E003 | P2 spec-conformance/content-review split | P | ACTIVE | BINDING | BINDING | STAY | P2 | — | archive | |
| E004 | P3 Deterministic core; capped residual | P | ACTIVE | BINDING | BINDING | STAY | P3 | — | archive | |
| E005 | P4 Rationales position-agnostic, bilingual | P | ACTIVE | BINDING | BINDING | STAY | P4 | — | — | |
| E006 | P5 Generated ≠ reviewed | P | ACTIVE | BINDING | BINDING | STAY | P5 | — | — | **carries E037's 2nd rule** (producer provenance / independent-review routing — MERGE_INTO target) |
| E007 | P5 Narrowing note (named-model policy) | P | ACTIVE | AUTHORIZING | AUTHORIZING | STAY | P5 | — | E074 (§8 Gemini block) | |
| E008 | P6 Visuals deterministic; curated-image lane | P | ACTIVE | BINDING | BINDING | STAY | P6 | — | `AGENTS.md` | |
| E009 | P7 Precision over volume | P | ACTIVE | ADVISORY | ADVISORY | STAY | P7 | — | — | |
| E010 | P10 Study sessions mirror exam distribution | P | ACTIVE | BINDING | BINDING | STAY | P10 | EXECUTED | `src/schema.ts`, `src/sessionSampler.ts` | dup with E066/E075 |
| E011 | P11 Visual arithmetic machine-checked gate | P | ACTIVE | BINDING | BINDING | STAY | P11 | EXECUTED | per-kind `selfCheck` | |
| E012 | P15 Bank patches raw-scoped, declarative | P | ACTIVE | BINDING | BINDING | STAY | P15 | EXECUTED | `scripts/patch-raw.ts` | |
| E013 | P15 App: op names a field path | P | ACTIVE | BINDING | BINDING | STAY | P15 | EXECUTED | archive (dropdown_cloze evidence) | precedent for E029's ID-sharing |
| E014 | P16 Answer-pattern bias presentation-first | P | ACTIVE | BINDING | BINDING | STAY | P16 | EXECUTED | `scripts/audit/non-mcq-bias-lib.ts` | |
| E015 | P16 Amendment: canonical file not a population | P | ACTIVE | BINDING | BINDING | STAY | P16 | EXECUTED | archive (PR #48 base) | declares "no forcing incident" |
| E016 | P16 Standing authoring note | P | ACTIVE | ADVISORY | ADVISORY | STAY | P16 | — | — | |
| E017 | P17 Scoring polytomous; retention full-marks | P | ACTIVE | BINDING | BINDING | STAY | P17 | EXECUTED | — | |
| E018 | P19 Rationale visuals are explanation figures | P | ACTIVE | BINDING | BINDING | STAY | P19 | EXECUTED | `src/schema.ts` | |
| E019 | P21 Repo-reading prompts carry semantic floor | P | ACTIVE | BINDING | BINDING | STAY | P21 | — | `AGENTS.md`/`NCLEX-Question-Schema.md` | |
| E020 | P21 App: construction language off learner surface | P | ACTIVE | BINDING | BINDING | STAY | P21 | EXECUTED | `lib/producer-vocabulary-leakage.ts`, `lib/authorial-constraint-leakage.ts` | |
| E021 | P21 App: construction language functional not positional | P | ACTIVE | BINDING | BINDING | STAY | P21 | — | `audit/terminal-sentence-remediation-2026-07-22/` | |
| E022 | P23 Exam-like presentation is a renderer concern | P | ACTIVE | BINDING | BINDING | STAY | P23 | EXECUTED | `src/examLayout.ts` | |
| E023 | P23 App: sparse shape-aware allocation | P | ACTIVE | BINDING | BINDING | STAY | P23 | EXECUTED | `src/examLayout.ts` | |
| E024 | P23 App: embedded leaf planning not retirement | P | ACTIVE | BINDING | BINDING | STAY | P23 | — | archive (leaf-retirement withdrawal) | |
| E025 | P24 Structured measurements values-only | P | ACTIVE | BINDING | BINDING | STAY | P24 | EXECUTED | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`; `src/types.ts` etc. | |
| E026 | P25 Necessity is a property of the artifact | P | ACTIVE | BINDING | BINDING | STAY | P25 | — | archive (io_trend/fishbone chronology) | |
| E027 | P25 App: composite trend artifacts | P | ACTIVE (vitals_trend clause superseded by E028) | BINDING | BINDING | STAY | P25 | EXECUTED | — | |
| E028 | P25 Amendment: unified single-axis vitals_trend | P | ACTIVE | BINDING | BINDING | STAY | P25 | EXECUTED | `Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md` | |
| **E029** | P25 Implementer note (reinstate flowsheet) | **P** (was `R`) | ACTIVE | BINDING | BINDING | STAY | **P25 (application, no `R` number)** | PENDING | — | **repaired**: kind `R`→`P` — was an unnumbered-`R` taxonomy breach (taxonomy §7 permits no number only when routed to `UNCLEAR_REQUIRES_OWNER`); reclassified as an application sharing P25's ID, like E013/E015 — see `inventory.md` §4.2 for the alternative (R-numbered) reading |
| E030 | P26 Disposition suppressing a check must be checked | P | ACTIVE | BINDING | BINDING | STAY | P26 | EXECUTED | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` | |
| E031 | P27 Invariant softens only by naming its incident | P | ACTIVE | BINDING | BINDING | STAY | P27 | — | archive (rejected alternatives) | |
| E032 | P27 Most recent application (2026-07-12 pass) | X | ACTIVE | HISTORICAL | HISTORICAL | ARCHIVE | *(archive line)* | — | archive | |
| E033 | P28 Scored leaves govern planning | P | ACTIVE | BINDING | BINDING | STAY | P28 | EXECUTED | `lib/question-population.ts`, `scripts/census.ts`, `scripts/coverage-report.ts` | |
| E034 | P29 Sparse lab cardinality not a validity floor | P | ACTIVE | BINDING | BINDING | STAY | P29 | EXECUTED | survey-manifest | |
| E035 | P30 Lab reference bands adult-only; peds fail closed | P | ACTIVE | BINDING | BINDING | STAY | P30 | EXECUTED | `audit/lab-reference-range-verification-2026-07-19.md` | |
| E036 | §5 Lapse note (2026-07-18) | X | CONDITIONAL→lapsed | HISTORICAL | HISTORICAL | ARCHIVE | *(archive line)* | — | `GPT-DIRECT-CASE-PRODUCER-CONTRACT-2026-07-19.md` | live clauses already in E037/E043a |
| **E037** | §5 Two universal rules stated once | P | ACTIVE | BINDING | BINDING | **MERGE_INTO E039a, E002, E006** | ***(none — merged; spec §8 ruling 2, 2026-07-24 refuses a number)*** | — | — | rule 1 (clinical truth upstream-owned) → **E039a**; rule 2 (producer provenance / independent-review routing) → **E002 and E006** (both shown on their own rows) |
| E038 | §5 Current producer assignment callout | I | ACTIVE | ADVISORY | ADVISORY | STAY | *(invariant, by name)* | — | `PROJECT-HISTORY.md` | near-`UNCLEAR` — natural owner forbidden as destination |
| **E039a** | P8 universal core | P | ACTIVE | BINDING | BINDING | STAY | P8 (restored) | — | — | MERGE_INTO target for E037 rule 1 |
| **E039b** | P8 lane-specific detail | X | CONDITIONAL (LAPSED) | HISTORICAL | HISTORICAL | ARCHIVE | *(archive line)* | — | archive | |
| E040 | P9 CONDITIONAL skeleton English-only | X | CONDITIONAL (LAPSED) | HISTORICAL | HISTORICAL | ARCHIVE | *(retire #9 — provisional)* | — | archive | **not ruled on — open owner question** |
| E041 | P12 CONDITIONAL author-side currency | X | CONDITIONAL (LAPSED) | HISTORICAL | HISTORICAL | ARCHIVE | *(retire #12 — provisional)* | — | archive | **not ruled on — open owner question** |
| E042 | P18 CONDITIONAL fact-check/flag-review chain | X | CONDITIONAL (LAPSED) | HISTORICAL | HISTORICAL | ARCHIVE | *(retire #18 — provisional)* | — | archive | **not ruled on — open owner question** |
| E043b | P22 CONDITIONAL conditional-principle prose | X | CONDITIONAL (LAPSED) | HISTORICAL | HISTORICAL | ARCHIVE | *(retire #22 — provisional)* | — | archive | **not ruled on — open owner question**; prose only, routing split to E043a |
| E043a | P22 `opus*` routing rule (still in force) | I | ACTIVE | BINDING | BINDING | STAY | *(invariant, by name)* | EXECUTED | `scripts/audit/early-bank-semantic-layer-a.ts` | ⚠ force-preservation hazard — must not archive with E043b |
| **E044** | P20 Pronunciation/audio (PARKED) | P | PARKED | ADVISORY | ADVISORY | STAY | P20 (retained) | INACTIVE | `src/audio/normalizeForTts.ts`, `scripts/audio/build-tts-queue.ts` | number 20 retained |
| E045 | Translation-friction scoring (PARKED) | T | PARKED | ADVISORY | ADVISORY | STAY | *(thread, by name)* | — | — | unsettled question |
| E046 | test/adaptive exam-condition modes (PARKED) | T | PARKED | ADVISORY | ADVISORY | STAY | *(thread, by name)* | — | — | unsettled question |
| E047a | Vital-`sanity` SBP/RR/`spo2` ratifications | R | ACTIVE | BINDING | BINDING | STAY | **R4** | PENDING | `audit/vital-sanity-bounds-p3-stage-3-source-packet-2026-07-23.md`, `…-independent-checker-2026-07-23.md` | ⚠ **MIS-FILE, NOT A FORCE CHANGE** — status REVISIT→ACTIVE per Amendment 2; force was always BINDING |
| E047b | Vital-`sanity` DBP/MAP/temp-floor/`sao2` open | T | REVISIT | ADVISORY | ADVISORY | STAY | *(thread, by name)* | — | same packet | legitimately T under Amendment 2 |
| **E047c** | Vital-`sanity` found/temp-closed chronology | X | **ACTIVE** (was REVISIT) | HISTORICAL | HISTORICAL | ARCHIVE | *(archive line)* | — | `Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md` | **repaired**: status `REVISIT`→`ACTIVE` — was a taxonomy breach (REVISIT compatible with T only); see `inventory.md` §4.1 for the alternative (R-numbered) reading, routed to owner |
| E048 | CBC American-conventional (superseded original) | X | SUPERSEDED | HISTORICAL | HISTORICAL | ARCHIVE | *(archive line)* | — | archive | superseded by E049 |
| E049 | CBC conventional-first + SI-paren, analyte-aware | R | ACTIVE | BINDING | BINDING | STAY | R2 | EXECUTED | `src/measurementUnitPolicy.ts`; extraction-contract Rule C | ⚠ **MIS-FILE, NOT A FORCE CHANGE** — filed under SUPERSEDED heading but self-declares governing |
| E050 | Fishbone workflow-familiarity waiver (superseded) | X | SUPERSEDED | HISTORICAL | HISTORICAL | ARCHIVE | *(archive line)* | — | E026 (P25) | |
| E051 | "Vitals sanity passes every real value" (withdrawn) | X | SUPERSEDED | HISTORICAL | HISTORICAL | ARCHIVE | *(archive line)* | — | E047 (§7) | duplicates vitals-sanity story |
| E052 | Governance-markdown encoding gate (withdrawn) | X | SUPERSEDED | HISTORICAL | HISTORICAL | ARCHIVE | *(archive line)* | — | `CLAUDE.md` §filesystem | |
| E053 | §8 closing archive pointer | X | ACTIVE | HISTORICAL | HISTORICAL | ARCHIVE | *(archive index intro)* | — | `Archive/DECISIONS-ARCHIVE-2026-07-14.md` | |
| E054 | INV Runtime audio: no client-embedded secret | I | ACTIVE | BINDING | BINDING | STAY | *(invariant, by name)* | EXECUTED | GitHub Pages / Vite inlining | |
| E055 | INV Bilingual EN / zh-CN parity | I | ACTIVE | BINDING | BINDING | STAY | *(invariant, by name)* | EXECUTED | — | |
| E056 | INV `question.topic` English-only | I | ACTIVE | BINDING | BINDING | STAY | *(invariant, by name)* | EXECUTED | `validateBankObject` Tier 0 | |
| E057 | INV JSON quote hygiene parse-time gate | I | ACTIVE | BINDING | BINDING | STAY | *(invariant, by name)* | EXECUTED | `docs/AGENTS-RUNBOOK.md` | |
| E058 | INV Question IDs globally unique | I | ACTIVE | BINDING | BINDING | STAY | *(invariant, by name)* | EXECUTED | `audit:ids` | |
| E059 | INV Raw-draft prefix routing | I | ACTIVE | BINDING | BINDING | STAY | *(invariant, by name)* | EXECUTED | `lib/canonical-routing.ts` | |
| E060 | INV Canonical merges deterministic | I | ACTIVE | BINDING | BINDING | STAY | *(invariant, by name)* | EXECUTED | `npm run consolidate` | |
| E061 | INV Runtime static/offline/`file://` | I | ACTIVE | BINDING | BINDING | STAY | *(invariant, by name)* | — | — | |
| E062 | INV Schema versions ordered token, minor ≤ 9 | I | ACTIVE | BINDING | BINDING | STAY | *(invariant, by name)* | EXECUTED | `SchemaVersion` in `src/types.ts` | |
| E063 | INV Schema changes rare and deliberate | I | ACTIVE | ADVISORY | ADVISORY | STAY | *(invariant, by name)* | — | — | |
| E064 | INV Shared visual numeric helpers single def | I | ACTIVE | BINDING | BINDING | STAY | *(invariant, by name)* | EXECUTED | `src/visuals/primitives/graphPaper.ts` | |
| E065 | INV Case-study exhibit ids one namespace | I | ACTIVE | BINDING | BINDING | STAY | *(invariant, by name)* | EXECUTED | — | |
| E066 | INV Category targets are test-plan weights | I | ACTIVE | BINDING | BINDING | STAY | *(invariant, by name)* | EXECUTED | `NCLEX_CATEGORY_WEIGHTS` | dup with E010/E075 |
| E067 | INV Bank composition is a floor problem | I | ACTIVE | BINDING | BINDING | STAY | *(invariant, by name)* | EXECUTED | `floorThreshold` | |
| E068 | INV Repository-state hygiene mechanism-specific | I | ACTIVE | BINDING | BINDING | STAY | *(invariant, by name)* | — | `AGENTS.md` | |
| E069 | INV Some topics shared across categories | I | ACTIVE | BINDING | BINDING | STAY | *(invariant, by name)* | EXECUTED | `src/topics.ts` | |
| E070 | Standalone bowtie direct generation | R | ACTIVE | AUTHORIZING | AUTHORIZING | STAY | R1 | EXECUTED | — | |
| E071 | INV Highlight structural bias gate schema-level | I | ACTIVE | BINDING | BINDING | STAY | *(invariant, by name)* | EXECUTED | Tier 0 validation | |
| E072 | Promoted visual parity per-kind baseline | R | ACTIVE | BINDING | BINDING | STAY | R3 | EXECUTED | `Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md` | |
| E073 | PR vs post-merge CI coverage distinct | R | ACTIVE | AUTHORIZING | AUTHORIZING | STAY | R5 | PENDING | `audit/ci-coverage-survey-2026-07-23.report.md`, `…independent-checker.md` | |
| E074 | Gemini's standing restrictions | P | ACTIVE | BINDING | BINDING | STAY | *(no number proposed — see findings)* | — | cross-refs P3/P5/P8/P18/P22 | ⚠ flagged in `findings.md` — cites lapsed principles 8/18 in present tense |
| E075 | Study-session distribution pointer | X | ACTIVE | HISTORICAL | HISTORICAL | ARCHIVE | *(archive line)* | — | `src/schema.ts`, `src/sessionSampler.ts` | |
| E076 | Session artifacts (implemented spec pointers) | X | ACTIVE | HISTORICAL | HISTORICAL | ARCHIVE | *(archive line)* | — | multiple `Archive/…` specs | |

## Summary

| destination | rows |
|---|---|
| STAY | 63 (35 §4 + 6 §5 + 19 §6 + 3 §7) |
| ARCHIVE | 14 |
| MERGE_INTO | 1 (E037 → E039a, E002, E006) |
| **Total** | **78** |

Destination counts are unchanged from pass 2 — the two repaired rows (`E029`, `E047c`) both keep their
pass-2 destination (`STAY`, `ARCHIVE` respectively); only kind (`E029`) and status (`E047c`) changed.
`E037`'s row count is unchanged; only its destination's *label* and explicit target list changed
(`MERGE` → `MERGE_INTO E039a, E002, E006`), per Amendment 5.

**Repaired this pass (see `inventory.md` §4.1–§4.3):**
- `E029`: kind `R`→`P`, no `R` number minted — was an unnumbered-`R` taxonomy breach.
- `E047c`: status `REVISIT`→`ACTIVE` — was a `REVISIT`-on-non-`T` taxonomy breach.
- `E037`: destination `MERGE`→`MERGE_INTO E039a, E002, E006`, both targets of rule 2 now shown
  explicitly on `E002` and `E006`'s own rows.

**Genuine force-change escalations this pass: none.** Every row's force-after equals its force-before
once force is read as-written rather than as-placed — unchanged from pass 2.

**Confirmed R-series (unchanged):** R1=E070 (2026-07-02), R2=E049 (2026-07-05), R3=E072 (2026-07-17),
R4=E047a (2026-07-24), R5=E073 (2026-07-24). Two open questions about this series are routed to the
owner, not decided here (see `inventory.md` §4.1/§4.2 and `findings.md`): whether `E029` (dated
2026-07-19) or `E047c` (Luke's ratification dated 2026-07-15) should instead take an `R` number, which
would insert ahead of `E072` and/or between `E072` and `E047a`/`E073`, renumbering the confirmed series
a second time.

**Open owner questions (not decided by any ruling to date):** principles 9, 12, 18, 22 — do any of them
carry a surviving universal core like principle 8's? (E040/E041/E042/E043b, `findings.md`.) Whether
E074 (Gemini restrictions) should mint a new principle number, and whether its text needs updating in
phase 2 to stop justifying a still-ACTIVE rule by reference to two now-lapsed principle numbers
(`findings.md`). Whether E038 (producer callout) can legally live anywhere other than
`PROJECT-HISTORY.md`. Whether `E029` or `E047c` should instead be R-numbered (above).
