# Quarantined Question Forge batch — independent review and promotion receipt

- **Date:** 2026-09-11
- **Candidate:** `banks/banks-raw/gpt-2026-08-30-1642-t1.json` (6 items, schema 2.0)
- **Candidate SHA-256:** `9f0ec549e35ef9c50244298a3a77bd016d1e78d7706533e37747ad16bd1daa0c` (unchanged from intake; not hand-edited)
- **Producer:** external Question Forge GPT instance, 2026-08-30
- **Independent reviewer / promotion seat:** Claude Code / Claude Opus 5
- **Provenance rule satisfied:** producer was a GPT instance; reviewer is non-GPT. Producer ≠ checker.
- **Disposition:** **PROMOTED** into `banks/gpt-canonical.json`.

This receipt discharges the condition carried by
`audit/quarantined-content-intake-2026-09-11-r1.md` and its terminal receipt:
"Fresh independent non-GPT semantic and source review is required before promotion,
consolidation, ledgering, or canonical use."

## Deterministic gates (re-run independently, not inherited from the intake receipt)

| Gate | Result |
|---|---|
| `validate-bank` (candidate) | PASS (6 questions) |
| `gate:raw --file <candidate>` | RAW GATE PASSED |
| `normalize-raw-bank` (dry run) | 0 structural changes; already normalized |
| `promote` | 6 items → `banks/_promoted/` |
| `consolidate` | `773 + 6 = 779` → `gpt-canonical.json`; staged file consumed |
| `audit` (aggregate) | GATE PASSED (warnings present) |
| `census:check` | up to date after regeneration |
| `validate-bank -- banks/*.json` | all banks OK |
| `tsc --noEmit` | exit 0 |
| `test:grading`, `test:schema-bank`, `test:audit-ids`, `test:consolidate` | PASS |

`audit:positions` and both `audit:non-mcq-bias` subchecks returned `INSUFFICIENT` on the
candidate: the batch contains no multiple-choice items and six items is below the
distributional threshold. `INSUFFICIENT` is recorded as absence of evidence, not as PASS.

The two aggregate-audit warnings (`audit:stage-refs`, `audit:non-mcq-bias:distributional`)
are pre-existing: the 66 frozen Campaign 16 exceptions and a `visual-canonical` `select_all`
spread. Neither references any newly promoted ID; grep for `gpt_2026_08_30_1642` across the
full audit output returns 0 matches.

## Continuity

The pre-promotion `gpt-canonical.json` hash `154c31f860790d5e90f23dae2dabfd31fba32ca46cc53a38b038cc56af30d469`
matches the final Campaign 16 Phase E R4 hash recorded in `BANK-REVIEW-LEDGER.md`, confirming
promotion began from the accepted post-R4 state. Final hash after merge:
`a4b7d10a7c0a0e6bdb9bbbc4cb34c726a889ee35b6340171e6015f6e8af27004`.

## Diff verification

Verified structurally rather than by gate result alone: exactly 6 IDs added, 0 removed,
**0 pre-existing questions modified**, pre-existing order preserved, the 6 additions appended
at the tail, `meta.count` 773 → 779, `meta.schemaVersion` unchanged at 2.1. Shuffle fidelity was
checked per item — correct-answer *text* is identical before and after the deterministic shuffle
for every item (ordered sequence, both dropdown pairs, the highlight correct set, and both
fill-in-blank acceptable/numeric payloads).

## Semantic review — 6/6 accepted

Bilingual parity swept programmatically: 0 defects across every `en`/`zh` pair
(no missing `zh`, no `zh` lacking Han characters, no `zh` equal to `en`); all glossary
entries carry `termEn`/`termZh`/`defZh`.

| # | ID suffix | Type | Finding |
|---|---|---|---|
| 01 | `two_challenge` | fill_in_blank | Closed-world; TeamSTEPPS named in stem. Answer unambiguous. Grading accepts text or numeric, and `acceptable` covers `二`/`两` for the zh surface. ACCEPT |
| 02 | `caregiver_willingness` | dropdown_cloze | Currency flag **neutralized**: the governing policy is quoted in the stem, so the item does not depend on live CMS discharge-planning rule currency. Distractors non-filler. ACCEPT |
| 03 | `oxytocin_tachysystole_sequence` | ordered_response | Currency flag **neutralized**: the standing order is quoted verbatim in the stem and the correct sequence maps to it exactly. The oxygen confound is preempted (SpO2 98% on room air; no O2 option offered). Tachysystole definition correct. ACCEPT |
| 04 | `abg_specimen_integrity` | highlight | Closed-world; all three rejection criteria stated in the stem. 3 correct / 3 selectable distractors. ACCEPT |
| 05 | `cu_iud_ec_window` | fill_in_blank | Only externally-dependent item. **Source-verified against CDC U.S. SPR 2024** (MMWR 2024;73(3), Aug 6 2024): Cu-IUD may be placed within 5 days of the first act of unprotected intercourse. The ovulation-based branch is explicitly excluded by the stem, so the single finite answer holds. ACCEPT |
| 06 | `opioid_constipation_prevention` | dropdown_cloze | Scheduled stimulant laxative at opioid initiation; docusate-alone correctly rejected; titration target of one unforced BM every 1–2 days correct. Obstruction/impaction/diarrhea excluded in stem. ACCEPT |

Five of six items are closed-world — each supplies its own governing rule, so they do not
decay with guideline currency. Only item 05 depends on an external authority, and that
authority was checked against the live CDC source rather than recalled.

## Independent duplicate check

Beyond the mechanical `audit:ids` collision gate (2680 IDs, no collisions), the two nearest
semantic neighbors in the destination bank were read in full:

- `gpt_case_nurse_provider_conflict_01` (case_study) uses "CUS/two-challenge language" as one
  option in a conflict-recognition task. Item 01 is a finite-recall fill-in-blank. Different
  format, different task; the existing glossary definition **agrees with** item 01's rationale.
- `gpt_deepen_2026_06_23_bow_04` (bowtie) shares the 39-weeks/oxytocin setting and overlapping
  interventions, but tests condition recognition, not sequencing per a supplied protocol.

Neither is a functional duplicate and neither contradicts the new items.

## Observation carried forward (not a promotion blocker)

The deterministic shuffle presented item 03 as `B,A,C,D,E` against a correct sequence of
`A,B,C,D,E`, leaving 3 of 5 tokens already in final position — the raw authored order
(`D,B,E,A,C`) was better scrambled. This sits in the unfavorable tail but inside the existing
distribution: across 188 `ordered_response` items in the canonical banks the mean fixed-position
fraction is 0.220, 10 items are at or above 60%, and **3 are fully pre-sorted (100%)**.

No hand-edit was made. Hand-patching deterministic pipeline output would violate the
no-hand-edit/no-hand-merge invariant, and the distributional bias gate is `INSUFFICIENT` at this
batch size rather than failing. Recorded as candidate successor work: a shuffle-quality floor for
`ordered_response` presentation order, which would also address the 3 fully pre-sorted legacy items.
