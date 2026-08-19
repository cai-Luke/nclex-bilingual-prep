# DECISIONS Migration — Stage 2a Evidence/Owner Path Candidate Worksheet

**Date:** 2026-07-29  
**Seat:** GPT deterministic preparation  
**Status:** Non-authoritative worksheet. It resolves path-shaped source references and obvious symbols; it does not decide whether any optional field appears in the manifest.

## 1. Rules for use

The target grammar permits at most one backticked repository path on each present `Evidence` or `Owner` line. Optional fields may be omitted. A command, symbol, prose label, directory, combined pseudo-path, or list of paths is not a legal value.

This worksheet distinguishes:

- **UNIQUE CANDIDATE** — one concrete path is directly named or clearly owns the referenced symbol;
- **MULTI-PATH / PARTIAL OWNER** — more than one path owns distinct parts of the entry; architect must select one truthful path per field or omit;
- **INVALID SHORTHAND** — the migration-table value cannot be copied into a field;
- **NO CLEAN CANDIDATE** — omission is the safe default unless architect review finds a truthful single owner/evidence path.

File existence was checked from the live Desktop repository for the unusual evidence documents and by direct repository search for code symbols. A later shell-capable review must still prove every selected value is tracked with `git ls-files --error-unmatch` or equivalent.

## 2. Unique or directly resolved candidates

| Source entry | candidate path | likely role | basis / caution |
|---|---|---|---|
| E001 | `lib/shuffle.ts` | Owner | Source text explicitly names the deterministic shuffle owner. |
| E008 | `AGENTS.md` | Evidence | Existing constitutional curated-image allowance; no curated-image executable lane exists. Do not mislabel it as an implemented Owner. |
| E012 | `scripts/patch-raw.ts` | Owner | Exact patch mechanism. |
| E014 | `scripts/audit/non-mcq-bias-lib.ts` | Owner | Exact live constants and audit policy implementation. |
| E018 | `src/schema.ts` | Owner | Shared full-schema visual projection and rationale-visual validation. |
| E022 | `src/examLayout.ts` | Owner | Split eligibility / layout behavior. |
| E023 | `src/examLayout.ts` | Owner | Sparse shape-aware allocation. |
| E028 | `Archive/root-cleanup-2026-07-19/VITALS-TREND-EPIC-STYLE-UNIFIED-CHART-CODEX-SPEC-2026-07-19.md` | Evidence | Ratified unified-chart disposition. |
| E030 | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` | Evidence | Owns the extraction-semantics amendment behind P26. |
| E034 | `audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json` | Evidence | Exact survey manifest exists. |
| E035 | `audit/lab-reference-range-verification-2026-07-19.md` | Evidence | Per-analyte reference-band verification record. |
| E038 | `PROJECT-HISTORY.md` | Owner or Evidence | Source itself says current producer assignment is verified there and not assumed timeless from DECISIONS. Architect must decide the truthful field label. |
| E043a | `scripts/audit/early-bank-semantic-layer-a.ts` | Owner | Implements the `opus*` matcher, producer, and tier routing. |
| E047c | `Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md` | Evidence | Exact temperature-ceiling derivation/spec exists. Executable Owner may instead be `src/measurementAllowlist.ts`. |
| E056 | `src/schema.ts` | Owner | `validateBankObject` is exported here; topic CJK rejection lives here. |
| E057 | `docs/AGENTS-RUNBOOK.md` | Evidence or Owner | Exact quote-repair mechanics are documented here; parse-time implementation may warrant a code Owner instead. |
| E058 | `scripts/audit/audit-ids.ts` | Owner | Resolved from package command `audit:ids`. |
| E059 | `lib/canonical-routing.ts` | Owner | Exact `CANONICAL_PREFIXES` source of truth. |
| E060 | `scripts/consolidate.ts` | Owner | Resolved from package command `consolidate`. |
| E062 | `src/types.ts` | Owner | `SchemaVersion` union lives here. Comparison behavior may instead point to `src/schema.ts`; architect must preserve the statement's actual scope. |
| E064 | `src/visuals/primitives/graphPaper.ts` | Owner | Single definitions of `fmt`, `fmtNum`, and `roundTo`. |
| E065 | `src/schema.ts` | Owner | Whole-case exhibit-ID uniqueness enforcement is implemented here. |
| E066 | `src/schema.ts` | Owner | `NCLEX_CATEGORY_WEIGHTS` is defined here. |
| E067 | `src/sessionSampler.ts` | Owner | `floorThreshold` viability behavior is implemented here. |
| E068 | `AGENTS.md` | Owner | Binding repository-state requirements live there by the entry's own statement. |
| E069 | `src/topics.ts` | Owner | Deliberately cross-category topic licensing. |
| E071 | `src/schema.ts` | Owner | Highlight distractor validation is implemented here (`highlight must include at least one selectable distractor`). |
| E072 | `Archive/root-cleanup-2026-07-19/PROMOTED-VISUAL-PARITY-EXPANSION-ARCHITECT-SPEC-2026-07-16.md` | Evidence | Ratified parity expansion and rebaseline contract. |

## 3. Multi-path or partial-owner cases

These cannot be copied as combined values. Architect must choose a truthful single path for each field, use separate `Evidence` and `Owner` fields where that division is accurate, or omit.

| Source entry | concrete candidates | issue |
|---|---|---|
| E010 | `src/schema.ts`; `src/sessionSampler.ts` | Weights are defined in the first; draw/floor/diversity behavior in the second. A natural split is Evidence/Owner only if the final compressed statement actually covers both. |
| E019 | `AGENTS.md`; `NCLEX-Question-Schema.md` | Source says repo-reading prompts defer shape to both. Combined `AGENTS.md/NCLEX-Question-Schema.md` is illegal. |
| E020 | `lib/producer-vocabulary-leakage.ts`; `lib/authorial-constraint-leakage.ts` | Two separate leakage mechanisms own different classes. One path cannot truthfully own both unless the statement is narrowed. |
| E025 | `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md`; `src/types.ts`; `src/schema.ts`; `src/measurementAllowlist.ts`; `src/measurementUnitPolicy.ts` | Evidence contract and several executable owners. Select based on the exact final statement; do not concatenate. |
| E033 | `lib/question-population.ts`; `scripts/census.ts`; `scripts/coverage-report.ts` | Three distinct consumers/owners. `lib/question-population.ts` is the shared traversal candidate, but it does not alone own every reporting consequence. |
| E044 | `src/audio/normalizeForTts.ts`; `scripts/audio/build-tts-queue.ts` | Normalization and queue construction are distinct. Entry is parked, so `Execution: INACTIVE` does not require pretending one file owns the whole architecture. |
| E047a | `audit/vital-sanity-bounds-p3-stage-3-source-packet-2026-07-23.md`; `audit/vital-sanity-bounds-p3-stage-3-independent-checker-2026-07-23.md`; `src/measurementAllowlist.ts` | Source packet and checker are separate evidence; implementation is pending, so the current code path is not yet the owner of the ratified values. |
| E047b | `audit/vital-sanity-bounds-p3-stage-3-source-packet-2026-07-23.md`; `audit/vital-sanity-bounds-p3-stage-3-independent-checker-2026-07-23.md` | Open thread may need one evidence pointer or no optional path. No executable Owner exists for unresolved values. |
| E049 | `src/measurementUnitPolicy.ts`; `EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md` | First owns display/conversion policy; second supports extraction Rule C. A truthful Evidence/Owner split is possible if statement scope matches. |
| E054 | `src/App.tsx`; `src/audio/normalizeForTts.ts`; `AGENTS.md` | `src/App.tsx` contains the runtime `speechSynthesis` fallback; normalization owns pre-generated assets; AGENTS states the policy. No one path obviously owns both no-secret and fallback limbs. |
| E073 | `audit/ci-coverage-survey-2026-07-23.report.md`; `audit/ci-coverage-survey-2026-07-23.independent-checker.md` | Two evidence records, one field. Select one canonical evidence path or omit; do not use an ellipsis abbreviation. |

## 4. Invalid shorthand that must not enter governed fields

| Source entry | shorthand | resolved status |
|---|---|---|
| E003, E004, E013, E015, E021, E024, E026, E031 | `archive`, `archive (...)`, or an audit directory | Not a single tracked file. The preservation snapshot/archive index supplies historical discoverability separately; optional field may be omitted. |
| E007 | `E074 (§8 Gemini block)` | Cross-reference identity, not a path. |
| E011 | `per-kind selfCheck` | Symbol/family of implementations, not one path. |
| E034 | `survey-manifest` | Resolved above to the exact survey manifest path; do not retain shorthand. |
| E050 | `E026 (P25)` | Entry identity, not a path. |
| E051 | `E047 (§7)` | Entry identity, not a path. |
| E054 | `GitHub Pages / Vite inlining` | Platform/prose label, not a path. Concrete candidates are listed in §3. |
| E056 | `validateBankObject Tier 0` | Symbol/label. Resolved above to `src/schema.ts`. |
| E058 | `audit:ids` | Command. Resolved above to `scripts/audit/audit-ids.ts`. |
| E060 | `npm run consolidate` | Command. Resolved above to `scripts/consolidate.ts`. |
| E066 | `NCLEX_CATEGORY_WEIGHTS` | Symbol. Resolved above to `src/schema.ts`. |
| E067 | `floorThreshold` | Symbol. Resolved above to `src/sessionSampler.ts`. |
| E071 | `Tier 0 validation` | Layer label. Resolved above to `src/schema.ts`. |
| E074 | `cross-refs P3/P5/P8/P18/P22` | Entry references, not a path; P18/P22 also retire in the target. The final P31 statement must be grounded in current P3/P5 and producer/checker restrictions rather than the retired lane topology. |

## 5. No-clean-candidate defaults

The following records have no obvious necessary single-path optional field in the frozen table/source packet. Omission is safer than inventing an owner, though architect review may identify a truthful path after the exact statement is written:

- E002, E005, E006, E009, E016, E017, E027, E029, E039a;
- E045, E046;
- E055, E061, E063;
- E070;
- E074.

Archive wrappers do not use live `Evidence` or `Owner` fields. Their required `Origin` field follows the separate fixed grammar and is not part of this worksheet.

## 6. Architect workflow

For each completed statement:

1. decide whether an optional path field is necessary at all;
2. select at most one truthful tracked path for `Evidence` and at most one for `Owner`;
3. verify that the selected path supports the exact compressed statement, not merely some source paragraph nearby;
4. pin `OMIT` for every absent optional field;
5. add every rejected or unresolved candidate to the manifest-level omission register;
6. have the shell-capable independent reviewer prove each selected path is tracked.

This worksheet must not be copied wholesale into the authoritative manifest; it is a review aid only.
