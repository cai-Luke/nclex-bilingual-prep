# Independent Content Review — Producer Vocabulary Leakage Remediation

Date: 2026-07-21
Reviewer: Claude (independent, non-GPT checker seat)
Reviewing: Codex's `PRODUCER-VOCABULARY-LEAKAGE-REMEDIATION-CODEX-SPEC-2026-07-21.md` implementation
Final disposition: **REVIEWED — naturalized with follow-up correction**

## Scope of this review

Read the work order, Codex's remediation report, both manifests, the shared lexicon/traversal
(`lib/producer-vocabulary-leakage.ts`), the Tier-1 audit, the declarative patch script, the focused
tests, and the full bank diffs. Independently re-verified (not just re-read Codex's claims):

- test suite and Tier-1 audit both PASS on live disk;
- patch is idempotent (second dry run: zero pending writes across all four banks);
- ICI-colitis stool arithmetic (baseline 1, current 6, +5) and temperature conversion
  (`38.3 °C → 100.94 °F`, displayed `100.9 °F`) are correct in both languages;
- no ID, answer-key, scoring, category, topic, difficulty, `ngnSkill`, source, visual,
  structured-measurement, exhibit, stage, or question-count drift — confirmed via `git diff`
  inspection of every touched bank and via `npm run census` / `census:check`;
- all 5 stem items and all 3 `testTakingStrategy` items match the spec's required wording and
  preserve their embedded protocol/threshold/sequence construct;
- governance additions to `AGENTS.md` and `DECISIONS.md` are compact and correctly avoid
  reintroducing lapsed principle 12.

## Findings

Codex's mechanical sweep and hand-naturalization were correct as far as the finite 30-item HIGH
baseline and 15-row bare-`lane` annex went — that part reproduces exactly and is not in question.
The gap was **bilingual parity and adjacent-phrase coverage within already-touched fields**: the
lexicon is deliberately a finite exact-phrase list (per the work order's own instruction against
generic regexes), so it cannot self-detect paraphrases or an un-mirrored translation. That
detection is exactly what an independent content read is for, and a targeted sweep for the same
defect class with different wording turned up 10 additional occurrences across 9 items:

| # | Item | Field | Defect |
|---|---|---|---|
| 1 | `gpt_format9c_noisy_respiratory_secretions` | `rationale.byChoice[3].zh` | ZH kept literal `来源支持` ("source-supported") after paired EN was naturalized |
| 2 | `gpt_format7b_inpatient_alcohol_withdrawal_pathway` | `testTakingStrategy.zh` | ZH kept `封闭式流程`; this is one of the 3 explicitly named strategy items |
| 3 | `gpt_format10c_parenteral_nutrition_discontinuation_plan` | `stem.zh` | ZH kept `封闭式停用方案`; one of the 5 explicitly named stem items |
| 4 | `gpt_deepen_2026_06_23_cue_02` | `rationale.correct.zh` | ZH kept `封闭式升级规则` |
| 5 | `gpt_mocsic_2026_07_15_or_confidentiality_hipaa_08` | `rationale.correct.zh` | ZH kept `封闭式顺序` |
| 6 | `gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13` | `testTakingStrategy.zh` | ZH kept `封闭规则` |
| 7 | `gpt_balance6a_2026_07_16_or_procedural_complications_dialysis_14` | `rationale.correct.zh` | ZH kept `封闭流程` |
| 8 | `gpt_balance5_2026_07_16_hl_disaster_emergency_preparedness_13` | `rationale.byChoice[q13_s7]` | **Both** EN (`closed information pathway`) and ZH (`封闭的信息通道`) unfixed — a sibling occurrence inside an item the remediation otherwise touched |
| 9 | `gpt_format10c_pediatric_rabies_pep_sequence` | `rationale.correct` | **Both** EN (`in this closed scenario`) and ZH (`封闭情境`) unfixed — entirely outside the original 30/15 baseline |
| 10 | `io_matrix_prerenal_aki_recheck_04` | `testTakingStrategy.zh` | ZH kept `封闭条件阈值`; one of the 3 explicitly named strategy items — found on a second post-fix sweep |

Items 2, 3, and 10 are especially notable: they are three of the eight items the work order names
explicitly by ID with required English wording, and their Chinese counterparts were still not
naturalized despite the ledger's claim that "English/Chinese parity was checked mechanically and by
the Codex implementation seat."

## Disposition

Rather than hand this back for a second Codex round, applied the fix directly (small, mechanical,
in the same declarative style already established):

- `scripts/patches/2026-07-21c-producer-vocabulary-parity-followup.ts` — 10 `setValue` ops across
  items 1–9 (dry-run verified against a scratch copy before touching the canonical bank; applied via
  `--allow-canonical --reason`).
- `scripts/patches/2026-07-21d-producer-vocabulary-parity-followup-2.ts` — 1 `setValue` op for item
  10, found on the post-fix residual sweep.
- Extended `lib/producer-vocabulary-leakage.ts`'s HIGH lexicon with exact-phrase patterns for all
  ten confirmed leaks (`closed scenario`, `closed information pathway/channel`, `来源支持`,
  `封闭式升级规则`, `封闭式顺序`, `封闭式流程`, `封闭式(停用)?方案`, `封闭规则`, `封闭流程`,
  `封闭的信息通道`, `封闭情境`, `封闭条件阈值`) so recurrence is caught mechanically. Verified these
  do not false-positive on legitimate clinical Chinese (`封闭式提问` closed-ended question,
  `系统封闭`/closed drainage system, `封闭空间火灾` enclosed-space fire, etc.) with explicit negative
  test cases.
- Extended `scripts/tests/producer-vocabulary-leakage.ts` with assertions for all new patterns plus
  the two negative (legitimate-usage) cases.

## Post-fix verification (rerun by reviewer)

- `npx tsx scripts/tests/producer-vocabulary-leakage.ts` — PASS
- `npx tsx scripts/producer-vocabulary-leakage-manifest.ts` — PASS; 1,942 items, 0 HIGH, 0 bare-lane
- `npx tsx scripts/audit/audit-producer-vocabulary.ts` — PASS
- `npm run validate-bank -- banks/*.json` — PASS, all 13 banks
- `npm run audit` — GATE PASSED (same pre-existing INSUFFICIENT/stage-ref advisories as Codex's run,
  unrelated to this patch); `audit:producer-vocabulary` PASS
- `npm run coverage-report` / `npm run census` / `npm run census:check` — PASS, same populations
  (1,942 session units, 2,528 scored leaves, 199 visual artifacts)
- `npx tsc -b --pretty false` — clean
- `npm run build` — PASS (same pre-existing large-chunk advisory)
- Exhaustive post-fix grep for `封闭`/`来源支持`/`closed[- ]world`/`closed scenario`/
  `closed information` across all bundled banks — remaining hits are all legitimate clinical usage
  (closed drainage systems, closed-ended questions, enclosed-space fires); no leaked internal
  vocabulary remains.

## Process note (non-blocking)

Codex's diff also touched `scripts/patch-raw.ts` (extended the `PathSegment` union from `{id}`-only
to `{id} | {refId}`, needed because most target fields are `rationale.byChoice[]` entries keyed by
`refId`) and, as a mechanical follow-on, `scripts/patches/2026-07-20-wbc-platelet-prose-unit-normalization.ts`
(updated its local selector-matching to the same two-key shape). Neither change was called out in
the remediation report. Reviewed both diffs: the `PathSegment` extension is backward-compatible
(existing `{id}` selectors are unaffected) and the WBC/platelet follow-on is a pure compile-compatibility
change with no behavior difference. Confirmed via full test/build/audit rerun. Not reverted — this
review's own follow-up patches depend on the `{refId}` selector support — but worth naming so future
patch authors know shared `patch-raw.ts` changes should be called out explicitly even when low-risk.

## Verdict

Codex's mechanical scaffolding (shared lexicon, traversal, declarative patch engine, Tier-1 gate,
tests) is sound and now stays in place as the standing regression guard. The five stem items, three
strategy items, and ICI-colitis dual-unit/stool-arithmetic repair are all correct as delivered. The
bilingual-parity gap identified above is fixed. This entry may be cleared to reviewed.
