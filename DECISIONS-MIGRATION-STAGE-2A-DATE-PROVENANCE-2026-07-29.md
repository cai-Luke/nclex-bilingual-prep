# DECISIONS migration Stage 2a — live-entry date provenance

**Date of research:** 2026-07-29  
**Seat:** Codex deterministic/research preparation  
**Status:** Non-authoritative provenance report for architect use. This report does not author target statements or alter governed files.

## 1. Result

All 65 live target blocks are present exactly once below, in the requested order. No row is unresolved and no source conflict was found.

The proposed date is the effective date of the substantive rule carried by the target block, not the migration date, current wording date, classification date, or permanent-ID allocation date. For a multi-source block, the date is the maximum effective date among the substantive contributions actually retained in that block.

### Counts

| measure | count |
|---|---:|
| Live rows | 65 |
| `EXPLICIT_SOURCE` | 30 |
| `RATIFIED_RECORD` | 10 |
| `PROJECT_HISTORY` | 0 |
| `GIT_INTRODUCTION` | 25 |
| `OWNER_REQUIRED` | 0 |
| `FIXED` confidence | 6 |
| `HIGH` confidence | 59 |
| `MEDIUM` confidence | 0 |
| `OWNER_REQUIRED` confidence | 0 |

## 2. Provenance table

Evidence keys are expanded in §3. “Churn rejected” keys are expanded in §4.

| # | block key | source E-ID(s) | proposed Date | class | exact supporting source / calculation | churn rejected | confidence |
|---:|---|---|---|---|---|---|---|
| 1 | P1#0 | E001 | 2026-06-09 | GIT_INTRODUCTION | G01 — initial constitution introduced deterministic code-owned answer placement and the D-at-3% forcing incident | C14, C28, C29 | HIGH |
| 2 | P2#0 | E002 + E037 rule 2 | 2026-07-18 | EXPLICIT_SOURCE | S01. Merge: E002 narrowed `2026-07-14`; E037 rule 2 became lane-independent when the source lane lapsed `2026-07-18`; max = `2026-07-18` | C19, C28, C29 | HIGH |
| 3 | P2#1 | E003 | 2026-07-09 | EXPLICIT_SOURCE | S02 — “spec-conformance/content-review split (2026-07-09 extension)” | C14, C28, C29 | HIGH |
| 4 | P3#0 | E004 | 2026-06-12 | GIT_INTRODUCTION | G02 — added the offline deterministic queue/ingest boundary and prohibition on live integration, the latest substantive contribution retained in E004 | C14, C28, C29 | HIGH |
| 5 | P4#0 | E005 | 2026-06-09 | GIT_INTRODUCTION | G01 — initial constitution introduced bilingual, position-agnostic rationales | C14, C28, C29 | HIGH |
| 6 | P5#0 | E006 + E037 rule 2 | 2026-07-18 | EXPLICIT_SOURCE | S03. Merge: E006 narrowed `2026-07-14`; E037 rule 2 became lane-independent on `2026-07-18`; max = `2026-07-18` | C19, C28, C29 | HIGH |
| 7 | P5#1 | E007 | 2026-06-26 | EXPLICIT_SOURCE | S04 — the retained named-model policy includes the June 26 demotion from every content-judgment audit lane; this is the latest substantive restriction in the attachment | C14, C28, C29 | HIGH |
| 8 | P6#0 | E008 | 2026-07-14 | EXPLICIT_SOURCE | S05 — “narrowed 2026-07-14 — resolves a direct conflict with `AGENTS.md`” | C28, C29 | HIGH |
| 9 | P7#0 | E009 | 2026-06-18 | RATIFIED_RECORD | F01 — hand-authored fixed fixture date | C14, C28, C29 | FIXED |
| 10 | P8#0 | E039a + E037 rule 1 | 2026-07-28 | RATIFIED_RECORD | R01. Merge: the upstream-truth rule predates the lane lapse, but the surviving P8 core was substantively restored and de-conditionalized by the owner on `2026-07-28`; max = `2026-07-28` | C29 only | HIGH |
| 11 | P10#0 | E010 | 2026-07-14 | EXPLICIT_SOURCE | S06 — “narrowed 2026-07-14”; this is the current Study/exam-sim separation | C28, C29 | HIGH |
| 12 | P11#0 | E011 | 2026-06-12 | GIT_INTRODUCTION | G03 — introduced the machine-checked visual-arithmetic rule; the same-date burn-map expansion completed the enumerated arithmetic surface | C14, C28, C29 | HIGH |
| 13 | P15#0 | E012 | 2026-06-10 | GIT_INTRODUCTION | G04 — introduced the raw-scoped declarative patch engine, canonical override fence, and no arbitrary-mutate rule | C14, C28, C29 | HIGH |
| 14 | P15#1 | E013 | 2026-07-22 | EXPLICIT_SOURCE | S07 — “Application — a declarative op names a field path, not a record (2026-07-22)” | C23, C28, C29 | HIGH |
| 15 | P16#0 | E014 | 2026-07-14 | EXPLICIT_SOURCE | S08 — core “narrowed 2026-07-14”; the later population change is separately represented by P16#1 | C28, C29 | HIGH |
| 16 | P16#1 | E015 | 2026-07-15 | EXPLICIT_SOURCE | S09 — “Amendment to 16 (2026-07-15)” | C28, C29 | HIGH |
| 17 | P16#2 | E016 | 2026-07-15 | GIT_INTRODUCTION | S10 — commit `b4fcd487ff91c5de3e2e805c29633bc4adad58fe` introduced the standing authoring note with the July 15 amendment and carries its surviving authoring consequence | C28, C29 | HIGH |
| 18 | P17#0 | E017 | 2026-06-14 | GIT_INTRODUCTION | G05 — introduced polytomous scoring and full-marks retention | C14, C28, C29 | HIGH |
| 19 | P19#0 | E018 | 2026-07-16 | GIT_INTRODUCTION | G06 — the current block carries the later full-schema/census population separation added on July 16; max over the June 15 core and July 16 contribution = `2026-07-16` | C19, C28, C29 | HIGH |
| 20 | P20#0 | E044 | 2026-06-22 | EXPLICIT_SOURCE | S11 — “Deprioritized 2026-06-22 on real user feedback” establishes the current PARKED/INACTIVE form | C14, C28, C29 | HIGH |
| 21 | P21#0 | E019 | 2026-07-14 | EXPLICIT_SOURCE | S12 — “narrowed 2026-07-14” | C28, C29 | HIGH |
| 22 | P21#1 | E020 | 2026-07-21 | EXPLICIT_SOURCE | S13 — application explicitly dated `2026-07-21` | C28, C29 | HIGH |
| 23 | P21#2 | E021 | 2026-07-22 | EXPLICIT_SOURCE | S14 — application explicitly dated `2026-07-22` | C23, C28, C29 | HIGH |
| 24 | P23#0 | E022 | 2026-07-14 | GIT_INTRODUCTION | G07 — the constitutional rewrite first assembled the current renderer/identity/grading and fail-open visibility rule; earlier presentation commits did not carry the complete current governing form | C28, C29 | HIGH |
| 25 | P23#1 | E023 | 2026-07-19 | EXPLICIT_SOURCE | S15 — “Application — sparse shape-aware allocation (2026-07-19)” | C28, C29 | HIGH |
| 26 | P23#2 | E024 | 2026-07-22 | EXPLICIT_SOURCE | S16 — application and owner withdrawal explicitly dated `2026-07-22` | C23, C28, C29 | HIGH |
| 27 | P24#0 | E025 | 2026-07-14 | EXPLICIT_SOURCE | S17 — current structured-measurement rule “narrowed 2026-07-14” | C28, C29 | HIGH |
| 28 | P25#0 | E026 | 2026-07-03 | RATIFIED_RECORD | F02 — hand-authored fixed fixture date | C09, C14, C28, C29 | FIXED |
| 29 | P25#1 | E027 | 2026-07-18 | EXPLICIT_SOURCE | F03 / S18 — fixed fixture and source both identify the composite readability application as `2026-07-18` | C19, C28, C29 | FIXED |
| 30 | P25#2 | E028 | 2026-07-19 | EXPLICIT_SOURCE | S19 — amendment explicitly dated `2026-07-19` | C28, C29 | HIGH |
| 31 | P25#3 | E029 | 2026-07-19 | GIT_INTRODUCTION | S20 — commit `ec394fdc8177a3a66b8194e4b76e271044338251` introduced the implementer directive with the July 19 ratified model; R02 confirms the application reading without resetting its date | C24, C28, C29 | HIGH |
| 32 | P26#0 | E030 | 2026-07-14 | EXPLICIT_SOURCE | S21 — current generalized rule “narrowed 2026-07-14” | C28, C29 | HIGH |
| 33 | P27#0 | E031 | 2026-07-10 | GIT_INTRODUCTION | G08 — introduced the incident-naming ratchet as a governing rule; the July 12 pass was a separate application later archived | C12, C14, C28, C29 | HIGH |
| 34 | P28#0 | E033 | 2026-07-16 | EXPLICIT_SOURCE | S22 — “ratified 2026-07-16” | C28, C29 | HIGH |
| 35 | P29#0 | E034 | 2026-07-18 | EXPLICIT_SOURCE | S23 — “ratified 2026-07-18” | C19, C28, C29 | HIGH |
| 36 | P30#0 | E035 | 2026-07-19 | EXPLICIT_SOURCE | S24 — “ratified 2026-07-19” | C20, C28, C29 | HIGH |
| 37 | P31#0 | E074 | 2026-06-26 | EXPLICIT_SOURCE | S04 — the latest substantive restriction is the June 26 audit-lane demotion; owner allocation of P31 on July 28 was identifier repair, not a new rule | C28, C29 | HIGH |
| 38 | R1#0 | E070 | 2026-07-02 | EXPLICIT_SOURCE | S25 — standalone bowtie ruling explicitly dated `2026-07-02` | C14, C28, C29 | HIGH |
| 39 | R2#0 | E049 | 2026-07-05 | EXPLICIT_SOURCE | S26 — governing analyte-aware amendment explicitly dated `2026-07-05` | C14, C28, C29 | HIGH |
| 40 | R3#0 | E047c | 2026-07-15 | EXPLICIT_SOURCE | F04 / S27 — fixed fixture; “Luke's sign-off and architect ratification: 2026-07-15” | C24, C28, C29 | FIXED |
| 41 | R4#0 | E072 | 2026-07-17 | EXPLICIT_SOURCE | S28 — promoted visual parity baseline “closed 2026-07-17, PR #55” | C19, C28, C29 | HIGH |
| 42 | R5#0 | E047a | 2026-07-24 | EXPLICIT_SOURCE | S29 — “Stage 3 closed 2026-07-24 with three per-side ratifications” | C28, C29 | HIGH |
| 43 | R6#0 | E073 | 2026-07-24 | EXPLICIT_SOURCE | S30 — ruling explicitly “ratified 2026-07-24” | C28, C29 | HIGH |
| 44 | Current producer assignment | E038 | 2026-07-18 | EXPLICIT_SOURCE | S31 — “as of 2026-07-18, GPT-5.6 Sol is the current producer…” | C28, C29 | HIGH |
| 45 | `opus*` deterministic review routing | E043a | 2026-07-18 | RATIFIED_RECORD | R03 — the lane-lapse record expressly preserved the `opus*` rule as active and separated it from lapsed P22; the earlier routing implementation remains evidence, but the current invariant form became effective on lapse | C19, C28, C29 | HIGH |
| 46 | Runtime audio carries no client-embedded secret | E054 | 2026-06-22 | RATIFIED_RECORD | F05 — hand-authored fixed fixture date | C14, C28, C29 | FIXED |
| 47 | Bilingual EN / zh-CN parity | E055 | 2026-06-09 | GIT_INTRODUCTION | G01 — initial constitution recorded bilingual parity as a standing invariant | C14, C28, C29 | HIGH |
| 48 | `question.topic` is English-only | E056 | 2026-06-10 | GIT_INTRODUCTION | G09 — introduced the English-only topic gate as the deterministic response to CJK-erasing normalization risk | C14, C28, C29 | HIGH |
| 49 | JSON quote hygiene is a parse-time gate | E057 | 2026-06-13 | GIT_INTRODUCTION | G10 — introduced fail-loud curly-quote recovery and programmatic JSON editing after the recorded corruption incidents | C14, C28, C29 | HIGH |
| 50 | Question IDs are globally unique | E058 | 2026-07-14 | GIT_INTRODUCTION | G07 — first recorded the complete current scope, including embedded case-study leaves and the `audit:ids` gate | C28, C29 | HIGH |
| 51 | Raw-draft prefix routing | E059 | 2026-07-09 | RATIFIED_RECORD | R04 — pre-compression governance explicitly records the July 9 clarification that frozen per-kind canonicals are not active targets and `visual-canonical.json` is the sole live visual target | C14, C28, C29 | HIGH |
| 52 | Canonical merges are deterministic | E060 | 2026-06-19 | GIT_INTRODUCTION | G11 — hardened promotion/consolidation path introduced the deterministic routed, validated, collision-checked merge rule | C14, C28, C29 | HIGH |
| 53 | Runtime stays static/offline/`file://` | E061 | 2026-06-09 | GIT_INTRODUCTION | G01 — initial constitution recorded the static/offline runtime invariant | C14, C28, C29 | HIGH |
| 54 | Schema versions are ordered tokens | E062 | 2026-07-09 | RATIFIED_RECORD | R05 — pre-compression source says “2026-07-09, Luke ruling” and records the minor-≤9 rule plus the single legal comparator | C14, C28, C29 | HIGH |
| 55 | Schema changes are rare and deliberate | E063 | 2026-06-09 | GIT_INTRODUCTION | G01 — initial constitution recorded this standing invariant | C14, C28, C29 | HIGH |
| 56 | Shared visual numeric helpers have one definition | E064 | 2026-06-12 | GIT_INTRODUCTION | G03 — introduced shared `fmtNum`/`roundTo` in the first arithmetic consumer; the invariant's same-value/same-rounding semantics originate in that change | C14, C28, C29 | HIGH |
| 57 | Case-study exhibit IDs share one namespace | E065 | 2026-07-13 | RATIFIED_RECORD | R06 — pre-compression source explicitly calls this the `2026-07-13 ruling` and records the shared namespace plus empty-opening-exhibits consequence | C14, C28, C29 | HIGH |
| 58 | Category targets are test-plan weights | E066 | 2026-06-12 | GIT_INTRODUCTION | G12 — aligned coverage targets with the NCLEX weight map, establishing the single-map project-wide rule | C14, C28, C29 | HIGH |
| 59 | Bank composition is a floor problem | E067 | 2026-07-10 | GIT_INTRODUCTION | G08 — introduced the floor-not-balance correction and tied it to `floorThreshold`; later compression did not change the rule | C12, C14, C28, C29 | HIGH |
| 60 | Repository-state hygiene is mechanism-specific | E068 | 2026-07-23 | GIT_INTRODUCTION | G13 — introduced the current GitHub-reading versus disk-reading distinction and no-state-equivalence rule | C28, C29 | HIGH |
| 61 | Some topics are shared across categories | E069 | 2026-06-18 | GIT_INTRODUCTION | G14 — ratified the Skin/Wound and Transfusion shared-topic mappings; the July 16 edit only renamed the category to its current canonical label | C16, C28, C29 | HIGH |
| 62 | Highlight structural bias gate is schema-level | E071 | 2026-06-14 | GIT_INTRODUCTION | G05 — introduced highlight validation, including the selectable-distractor requirement and meaningful passage order | C26, C14, C28, C29 | HIGH |
| 63 | Translation-friction scoring | E045 | 2026-07-01 | RATIFIED_RECORD | R07 — the pre-compression decision index explicitly dates the parked thread “Jul 1” and preserves its dogfooding trigger | C14, C28, C29 | HIGH |
| 64 | `test` / `adaptive` exam-condition modes | E046 | 2026-07-09 | GIT_INTRODUCTION | G15 — introduced the half-exam placeholder finding and the decide-to-spec-or-remove thread | C14, C28, C29 | HIGH |
| 65 | DBP and MAP ceiling sourcing | E047b | 2026-07-24 | RATIFIED_RECORD | F06 — hand-authored fixed thread fixture date; S29 records the same Stage-3 closure and bounded sourcing authorization | C28, C29 | FIXED |

## 3. Evidence catalog

### Explicit source and fixture evidence

- **S01:** `DECISIONS.md` at `d499cc1d0916e03830489ec9cd0324cd1a203a73`, lines 90–95 and 300–305: “narrowed 2026-07-14”; “Lapse note (2026-07-18)”; universal rule 2.
- **S02:** same baseline, line 95: “spec-conformance/content-review split (2026-07-09 extension).”
- **S03:** same baseline, lines 103–106 and 300–305: E006 narrowed `2026-07-14`; universal rule 2 survives the `2026-07-18` lapse.
- **S04:** same baseline, line 387: Gemini restrictions include “demoted from every content-judgment audit lane (Jun 26…).”
- **S05:** same baseline, lines 108–111: P6 “narrowed 2026-07-14.”
- **S06:** same baseline, lines 116–119: P10 “narrowed 2026-07-14.”
- **S07:** same baseline, lines 127–131: field-path application dated `2026-07-22`.
- **S08:** same baseline, lines 133–136: P16 core “narrowed 2026-07-14.”
- **S09:** same baseline, lines 138–143: “Amendment to 16 (2026-07-15).”
- **S10:** same baseline, line 145; introduced in commit `b4fcd487ff91c5de3e2e805c29633bc4adad58fe` with the July 15 amendment.
- **S11:** same baseline, lines 326–329: “Deprioritized 2026-06-22.”
- **S12:** same baseline, lines 159–160: P21 “narrowed 2026-07-14.”
- **S13:** same baseline, line 162: application dated `2026-07-21`.
- **S14:** same baseline, lines 164–168: application dated `2026-07-22`.
- **S15:** same baseline, lines 177–184: application dated `2026-07-19`.
- **S16:** same baseline, lines 186–190: application and withdrawal dated `2026-07-22`.
- **S17:** same baseline, lines 192–197: P24 “narrowed 2026-07-14.”
- **S18:** same baseline, line 204: first applied by the `2026-07-18` composite readability repair.
- **S19:** same baseline, line 206: amendment dated `2026-07-19`.
- **S20:** same baseline, line 208, introduced by `ec394fdc8177a3a66b8194e4b76e271044338251` on `2026-07-19` as the implementation consequence of the ratified unified model.
- **S21:** same baseline, lines 210–213: P26 “narrowed 2026-07-14.”
- **S22:** same baseline, lines 220–225: P28 “ratified 2026-07-16.”
- **S23:** same baseline, lines 227–242: P29 “ratified 2026-07-18.”
- **S24:** same baseline, lines 244–296: P30 “ratified 2026-07-19.”
- **S25:** same baseline, line 382: standalone bowtie ruling dated `2026-07-02`.
- **S26:** same baseline, line 347: governing amendment dated `2026-07-05`.
- **S27:** same baseline, line 339: temperature ceiling “closed 2026-07-15” and “Luke's sign-off and architect ratification: 2026-07-15.”
- **S28:** same baseline, line 384: promoted parity baseline “closed 2026-07-17, PR #55.”
- **S29:** same baseline, line 339: “Stage 3 closed 2026-07-24” and DBP/MAP bounded sourcing authorization.
- **S30:** same baseline, line 385: CI-coverage ruling “ratified 2026-07-24.”
- **S31:** same baseline, line 307: current producer assignment “as of 2026-07-18.”

- **F01:** `DECISIONS-FORMAT-FIXTURES-2026-07-28.md`, lines 65–76: P7 date `2026-06-18`.
- **F02:** same file, lines 36–53: P25 core date `2026-07-03`.
- **F03:** same file, lines 87–101: P25 composite-trend attachment date `2026-07-18`.
- **F04:** same file, lines 110–125: R3 date `2026-07-15`.
- **F05:** same file, lines 135–151: runtime-audio invariant date `2026-06-22`.
- **F06:** same file, lines 157–170: DBP/MAP sourcing thread date `2026-07-24`.

### Ratified records

- **R01:** `DECISIONS-TAXONOMY-2026-07-24.md`, lines 77 and 271–274, plus `audit/decisions-cleanup-2026-07-24/outline-before-after.md`, lines 145–151 and 216–224: de-conditionalized principles return ACTIVE; P8 is restored; E037 rule 1 lands in E039a. The closure applies owner ratifications dated `2026-07-28`.
- **R02:** `audit/decisions-cleanup-2026-07-24/outline-before-after.md`, lines 180–188: E029 remains a P25 application by owner confirmation on `2026-07-28`; that classification repair does not replace its July 19 substantive directive date.
- **R03:** `DECISIONS.md` at the baseline, lines 298–322: lane lapse dated `2026-07-18`, with `opus*` routing expressly “unaffected and stays in force”; P22's lane prose lapses separately.
- **R04:** `DECISIONS.md` at `16204246485963ea2317f9f659a2c7a2e1cbbdf7^`, line 227: explicit `2026-07-09` clarification of fixed prefix routing, frozen per-kind sets, and the sole live visual target.
- **R05:** same pre-compression source, line 230: “2026-07-09, Luke ruling” for ordered version tokens, minor ≤ 9, and `schemaVersionAtLeast`.
- **R06:** same pre-compression source, line 233: “2026-07-13 ruling” for the shared exhibit-ID namespace and empty top-level exhibit allowance.
- **R07:** same pre-compression source, decision index “Parked until trigger”: “Translation-friction scoring (Jul 1)” with its dogfooding trigger.

### Git-introduction evidence

- **G01:** `e8716a796e434ae706ad948207d333ed42e0a422`, local date `2026-06-09`, `feat(banks): promote 4 high-acuity case studies to hard-cases-canonical`. The new `DECISIONS.md` substantively introduced P1, P3's deterministic core, P4, P5's floor, P6's original floor, P7, bilingual parity, global IDs, static/offline runtime, and rare/deliberate schema changes. Only the rows citing G01 rely on the exact contribution named in their row.
- **G02:** `a661f21f53bbee90145877366594103ae67a5050`, local date `2026-06-12`, `feat: add deterministic audit handoff workflows`. Diff adds the offline queue/prompt, returned-JSONL validation, Layer-A non-mutation, and no live API/network rule to P3.
- **G03:** `cc68d80d3f3753b70391b9b47c4e0e1af3ca869a`, local date `2026-06-12`, `Implement U6 medication label visuals`. Diff introduces the machine-checked visual arithmetic rule and shared numeric helpers; `95f0cb73540f0358ba13acf649fbd443d6db6f28` expands the enumerated arithmetic surface to burn maps on the same local date.
- **G04:** `6e5085207d760cc554fdefb1743f5c8c59fd023c`, local date `2026-06-10`, `feat: promote reviewed banks, add patch-raw engine, census tooling`. Diff adds P15 with raw-only writes, explicit canonical override/reason, declarative before→after ops, and no arbitrary mutation.
- **G05:** `36cb51c0d4f3da049c103847002a080e2b30099e`, local date `2026-06-14`, `Add partial-credit scoring and highlight items`. Diff substantively adds polytomous scoring/full-marks retention and highlight's structural validity rule.
- **G06:** `d80105dddd85fe79cfdbb531b8bac19d71c006a5`, local date `2026-07-16`, `P0: cover rationale visuals in schema-floor traversal (#54)`. Diff adds the full-schema six-location traversal and preserves the separately ratified narrower census population.
- **G07:** `16204246485963ea2317f9f659a2c7a2e1cbbdf7`, local date `2026-07-14`, `docs: rework DECISIONS.md into an architectural constitution`. For the rows citing it, the diff first establishes the complete current governing form (P23 core or embedded-leaf ID scope), rather than merely compressing an already-equivalent rule.
- **G08:** `fe41312cf30a9757544d3a1aca199d960729b4df`, local date `2026-07-10`, `docs: ratify schema 2.0 amendment and governance`. Diff introduces the incident-naming ratchet and the floor-not-balance correction as governing rules.
- **G09:** `193edd234a463c048a8e00c1a5928ecfbf89b91d`, local date `2026-06-10`, `feat(banks): add lab-canonical + mar-canonical; expand gemini + gpt banks`. Diff introduces the English-only topic gate after identifying CJK-erasing normalization risk.
- **G10:** `b3a68e890988ca7155dcc8113881b3a36ddf6826`, local date `2026-06-13`, `Consolidate banks, fix promote pipeline, add curly-quote recovery tooling`. Diff records the quote-corruption modes and the fail-loud, programmatic-edit rule.
- **G11:** `644778fcf3324c91ca3bac3df61151525cc1ed6f`, local date `2026-06-19`, `Land hardened promotion gate; promote unsafe-assignment float-nurse case (gpt 291→293)`. Diff establishes the deterministic, gated canonical consolidation and strengthened global-ID path.
- **G12:** `4b13c34e2503d47eda8aacc487b7c8c4334ede90`, local date `2026-06-12`, `Align coverage targets with NCLEX weights (#9)`. Diff makes the test-plan weight map authoritative for generation coverage as well as study sampling.
- **G13:** `1d5c9c27c5f491e9a16e730db932cc3d775490ee`, local date `2026-07-23`, `Clarify governance verification and repository-state rules`. Diff replaces the over-broad clean/pushed rule with the current mechanism-specific GitHub-reading/disk-reading contract.
- **G14:** `7547a766a42e9a838cff9b55ddc7c24242fd623d`, local date `2026-06-18`, `Share wound and transfusion topics`. Diff ratifies both shared-topic mappings. `5d2676c25197ff6f55cd53d4168b07cc58aa16d5` on July 16 only renames “Safety and Infection Control” to its canonical current label; it does not change the mapping.
- **G15:** `688f250e2dfa20a3f4a95fd64e9496f8ea1ab53b`, local date `2026-07-09`, `Record session mode and translate-all architecture notes`. Diff establishes that `test`/`adaptive` are half-exam placeholders pending a decision to fully specify or remove them.

## 4. Later commits examined and rejected as non-date-resetting

- **C09:** `45791ef2fe077bb0798982116ee03bdf019affcf`, `2026-07-09`, first compressed wording for P25. Rejected for P25#0 because the fixed effective decision predates this prose at `2026-07-03`.
- **C12:** `3247ad305945d0f6a7f05ced6fb46fc99844fe4e`, `2026-07-12`, documentation consolidation/application work. It did not replace P27's July 10 ratchet or the bank-floor correction.
- **C14:** `16204246485963ea2317f9f659a2c7a2e1cbbdf7`, `2026-07-14`, constitutional compression. Rejected where it only restructured or compressed an already-binding rule. It is accepted only for rows where its diff first establishes the current substantive form.
- **C16:** `5d2676c25197ff6f55cd53d4168b07cc58aa16d5`, `2026-07-16`, category-vocabulary rename. It changes the canonical category label, not the shared-topic decision.
- **C19:** `6b29ed2419251e5d7f59b6702892f8538e177c4b`, `2026-07-19`, archive/compression updates. Rejected where it only archived specs or restated a prior effective date.
- **C20:** `018f7b0b4541a941b7f55101755d3cea49294649`, `2026-07-20`, verification follow-up. It re-verifies P30's magnesium override but does not replace the July 19 governing range decision.
- **C23:** `4e86c3d736e3912e1b486026fbf6992ff864f60f`, `2026-07-23`, commit carrying July 22 terminal-sentence rulings. The recorded effective date is July 22, not the later commit date.
- **C24:** `35b968e9dab9fb071ccffc5497283f9cb138df1b`, `2026-07-24`, combined vitals/CI record. It is substantive for R5, R6, and E047b, but editorial consolidation for the already-ratified July 15 R3 and July 19 E029 directive.
- **C26:** `a5d30b42c70670235b1a27e50d8a967ecdb2dbee`, `2026-06-26`, highlight audit calibration. It does not change the schema-level at-least-one-distractor invariant.
- **C28:** `3f2839962c937753c0e8954fdecb338f731685c5`, `2026-07-28`, phase-1 closure artifacts and owner classifications. Classification, R-series bootstrap, attachment grouping, and P31 allocation do not reset substantive dates. Exceptions are applied where the owner act itself changed governing force/status, notably P8 restoration/de-conditionalization.
- **C29:** `05f9bcdddf9ce92f80bcd05fb5c4c5399fd466d5`, `2026-07-29`, migration Amendment 4 and grammar prerequisites. This is migration/format authority, not a blanket live-entry effective date.

## 5. Method

I started from the frozen baseline and ratified 65-block grouping, then followed the evidence hierarchy:

1. explicit effective-date language in the source entry;
2. hand-authored fixtures and owner-ratified classification/closure records;
3. tracked history records;
4. Git introduction of the substantive rule.

For Git-derived rows I used full-history `git log -S`/`-G`, blame at the migration baseline, and parent diffs. A commit was accepted only when its diff introduced or substantively changed the rule carried by the target block. A commit was rejected when it merely compressed prose, moved an entry, repaired an identifier/classification, updated a path or category label, allocated an R/P number, or prepared the migration grammar.

Multi-source calculations were performed independently per block. P2#0 and P5#0 take the maximum of their July 14 narrowed cores and E037 rule 2's July 18 lane-independent effective date. P8#0 takes July 28 because restoration/de-conditionalization is a substantive status/force change, not mere relocation. R3 remains July 15 because the July 28 R-series bootstrap and force-classification repair did not replace the temperature ruling itself. P31 remains June 26 because its July 28 identifier allocation did not alter the standing restrictions.

## 6. Unresolved or conflicting rows

None.

No fixed fixture is contradicted. P2's fixed fixture remains the date of the narrowed E002 core before assembly; the assembled P2#0 block moves to July 18 only because the handoff expressly requires the later E037 substantive contribution to be included in the merge-date calculation.

## 7. Completeness and order verification

- P section: 37 rows — P1 through P31 in numeric permanent-ID order, with 12 attachments immediately after their core.
- R section: 6 rows — R1 through R6.
- I section: 19 rows — E038, E043a, E054–E069, E071, in ratified outline order.
- T section: 3 rows — E045, E046, E047b.
- Total: `37 + 6 + 19 + 3 = 65`.
- Every block key is present exactly once.
- No P9, P12, P18, or P22 live block appears; P13 and P14 are absent as never assigned.
