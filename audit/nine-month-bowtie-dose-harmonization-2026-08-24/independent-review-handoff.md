# Independent review handoff — nine-month standalone bow-tie dose harmonization

## Scope

- Target: `gpt_case_nine_month_well_child_safety_01_bowtie` in `banks/gpt-canonical.json`.
- Baseline: local disk branch `main`, HEAD `a237d18f1b6aea277681cf3522239b793cad859c`.
- Producer: Codex. This seat must not clear its own correction.
- Requested checker: the same independent non-GPT Claude seat that reviewed the companion repair.
- Patch: `scripts/patches/2026-08-24-nine-month-bowtie-dose-harmonization.ts`.
- Reason: `harmonize nine-month standalone bowtie acetaminophen reference dose with independently source-corrected companion case`.
- Historical answerability patch: unchanged; SHA-256 before/live
  `55ce5856f16612207a85015bfd427973a22a9167dc953bdc424ba8d6b574eb95`.
- Unrelated work to preserve: the existing `DECISIONS.md` modification and
  `STANDALONE-BOWTIE-ANSWERABILITY-AUDIT-SPEC-2026-08-23.md`.

Status: **APPROVED by independent non-GPT content review**.

## Source and family adjudication

The independently reviewed companion case at `a237d18` documents Liam at 8.9 kg/about 19.6 lb and
uses 3.75 mL. The current [AAP page](https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Acetaminophen-for-Fever-and-Pain.aspx)
and linked [AAP chart](https://downloads.aap.org/HC/EN/Acetaminophen_Pictographic_Dosing_Chart_download.pdf)
map 18–23 lb (8–10 kg) to 3.75 mL of infants' acetaminophen 160 mg/5 mL. This pass harmonizes the
standalone's stated clinic-table amount; it does not reopen the prior answerability redesign.

## Deterministic inventory and mutation surface

The preflight recursively inspected every string leaf. Its reference-dose predicate counted `5 mL`
only when not numerically prefixed and not part of `/5 mL`, thereby excluding the valid `15 mL`
history and `160 mg/5 mL` concentration. It found exactly eight expected leaves containing ten
reference-dose occurrences and no additional leaf:

- `stem.en` — 1 occurrence
- `stem.zh` — 1 occurrence
- `bowtie.actions.tokens[id=act_teach_apap_measurement].en` — 1 occurrence
- `bowtie.actions.tokens[id=act_teach_apap_measurement].zh` — 1 occurrence
- `rationale.correct.en` — 2 occurrences
- `rationale.correct.zh` — 2 occurrences
- `rationale.byChoice[refId=act_teach_apap_measurement].en` — 1 occurrence
- `rationale.byChoice[refId=act_teach_apap_measurement].zh` — 1 occurrence

Each full learner-facing leaf has an exact `before`/`after` guard. Replacing `3.75 mL` with `5 mL`
in each changed post-patch leaf reproduces its baseline value exactly; no other wording changed.

## Invariants already proved mechanically

- Exactly one top-level payload changed: the standalone bow-tie.
- Exactly the eight paths above changed.
- Companion SHA-256 before/live:
  `290aab010b64873560377f84aa5001a0b8d14b1d2d01cfaedec96f5dc23a6f0f`.
- All 759 non-target GPT payloads aggregate SHA-256 before/live:
  `81b12d3038dd3f4f406302fa1c7efb87b46793d194154eb55778a05c8ba30e4f`.
- Keys remain: condition `cond_knowledge_deficit`; actions `act_assess_apap` and
  `act_teach_apap_measurement`; parameters `param_apap_return_demo` and `param_safe_storage`.
- Cardinality remains 3 conditions / 4 actions / 4 parameters; the correct answer still scores 5/5.
- Token IDs, rationale refs, metadata, strategy, glossary, and ID order are unchanged.
- EN/ZH dose-occurrence counts are paired 1/1, 1/1, 2/2, and 1/1 across the four bilingual fields.
- No stale standalone reference-dose `5 mL` remains. The two valid `160 mg/5 mL` concentration
  occurrences and all reported `15 mL` history remain.

## Checker questions

Return `APPROVE_FOR_APPLY` only if all checks pass:

1. Reconfirm from the current AAP source and committed companion that 3.75 mL is the one family dose.
2. Compare the standalone at `a237d18` with the live item and confirm all eight changes are only
   `5 mL` → `3.75 mL`, with no answerability wording or clinical logic altered.
3. Re-derive the five keyed targets without trusting the stored key. Confirm the changed number does
   not alter the previously approved condition, actions, parameters, or 5-point scoring construct.
4. Confirm the `160 mg/5 mL` concentration and Danielle's 15 mL exposure history remain intact and
   clinically distinguishable from the 3.75 mL reference dose.
5. Confirm EN/Simplified-Chinese parity in all four bilingual field pairs.
6. Confirm the companion and all 759 non-target GPT payloads match the hashes above, and confirm the
   historical answerability patch was not rewritten.

If any check fails, return `NEEDS_FIX` with the exact path, quoted live text, concern, and proposed
correction. Otherwise return `APPROVE_FOR_APPLY`, list the independently re-derived five targets, and
state that family dose consistency and EN/ZH parity are confirmed.

## Final independent-review disposition

Claude returned `APPROVE_FOR_APPLY`. The checker independently compared the live item against
`a237d18`, confirmed exactly eight changed leaves and no other semantic movement, and re-derived the
five targets before opening the stored key: `cond_knowledge_deficit`; `act_assess_apap` and
`act_teach_apap_measurement`; `param_apap_return_demo` and `param_safe_storage`. The 3/4/4 pools remain
rankable and the five-point construct remains intact.

The checker reconfirmed 3.75 mL as the accepted family reference dose, verified that `160 mg/5 mL`
remains the concentration and 15 mL remains Danielle's reported exposure, and found no changed or
unchanged clinical logic made inaccurate by the harmonization. EN/ZH parity passes. The companion case
remains byte-identical to `a237d18`; all 759 non-target GPT payloads remain unchanged; and the historical
answerability patch remains byte-identical. Family dose consistency is now closed.
