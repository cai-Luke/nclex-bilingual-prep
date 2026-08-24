# Independent review handoff — nine-month well-child standalone bow-tie

## Scope and snapshot

- Target: `gpt_case_nine_month_well_child_safety_01_bowtie`
- Bank: `banks/gpt-canonical.json`
- Repair seat: Codex; this seat must not content-clear its own correction.
- Local snapshot at implementation: branch `main`, HEAD `0179fb2223c3329fab182fd84685fb3657ab2613`, with the repair intentionally uncommitted.
- Patch: `scripts/patches/2026-08-23-nine-month-well-child-bowtie-answerability.ts`
- Canonical reason: `repair standalone answerability of nine-month well-child acetaminophen bowtie`

## Review disposition

The first independent Claude content review returned `NEEDS_FIX` for exactly one remaining leak:
`bowtie.actions.tokens[id=act_defer_teaching].en` and `.zh` said “the one-month follow-up” / “1 个月
随访,” inheriting a follow-up presupposition from the companion-case framing. The accepted correction
is limited to those two token-text leaves: “a follow-up visit in one month” / “1 个月后的随访就诊.”
The key, token ID, rationale, cardinalities, companion case, 5 mL issue, and every other question remain
unchanged.

After the correction, the same independent Claude seat re-ran the complete eight-point checklist and
returned **`APPROVE_FOR_APPLY`**. It explicitly confirmed that the five keyed targets remain
independently derivable from the standalone stem without the companion case and that the prior
`act_defer_teaching` finding is closed. The companion-case 5 mL versus 8.9 kg inconsistency remains a
separate, non-blocking clinical-currency finding outside this repair.

Read the complete repaired item from the live bank:

```sh
jq '.questions[] | select(.id == "gpt_case_nine_month_well_child_safety_01_bowtie")' banks/gpt-canonical.json
```

For a key-blind first pass, remove the three key structures and rationales before re-deriving the five
targets from the stem alone:

```sh
jq '.questions[] | select(.id == "gpt_case_nine_month_well_child_safety_01_bowtie")
  | del(.bowtie.condition.correct, .bowtie.actions.correct, .bowtie.parameters.correct, .rationale)' \
  banks/gpt-canonical.json
```

Do not consult the companion `case_study` until standalone answerability has been adjudicated.

## Expected five-target key (compare only after re-derivation)

- Condition: `cond_knowledge_deficit`
- Actions: `act_assess_apap`, `act_teach_apap_measurement`
- Parameters: `param_apap_return_demo`, `param_safe_storage`

The center pool contains 3 tokens; actions and parameters each contain 4. All 11 tokens have one unique
bilingual `rationale.byChoice` entry.

## Review questions

Return `APPROVE_FOR_APPLY` only if all of the following independently pass:

1. The complete repaired stem supports every one of the five keyed targets without the companion case.
2. All three condition tokens are understandable and rankable. Caregiver role strain is a plausible
   competing hypothesis, while the dosing/storage facts more directly support knowledge deficit; the
   disclosed facts do not force a neglect conclusion.
3. Both keyed actions are single-purpose, clinically safe, and within nursing scope. Missing timing,
   frequency, total exposure, or overlapping-product information must not delay consultation.
4. The item does not declare that the reported 15 mL administration itself proves toxic poisoning or
   acute hepatic failure.
5. Both keyed parameters directly evaluate the teaching in this item: accurate dose measurement and
   medicine storage out of Liam's reach and sight.
6. Neither distractor pool requires hidden cow's-milk, hemoglobin, lead, ASQ-3, safe-sleep, car-seat,
   food-preparation, partner-behavior, or other companion-case facts merely to understand it.
7. The condition, all 4 action tokens, all 4 parameter tokens, all 11 by-choice explanations, overall
   rationale, strategy, and English/Simplified-Chinese response demands are clinically and semantically
   equivalent.
8. All renamed token IDs resolve in the three keys and rationale references, and the five-point grading
   construct is unchanged.

If any check fails, return `NEEDS_FIX` with the exact field path, quoted current text, clinical or
translation concern, and proposed correction. Otherwise return `APPROVE_FOR_APPLY` and state that the
five keys were re-derived without consulting the companion case.

## Clinical source evidence

- [AAP: Acetaminophen Dosing Tables for Fever and Pain in Children](https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Acetaminophen-for-Fever-and-Pain.aspx) (updated 2026-01-30): use the child's weight and clinician guidance; an oral syringe is the most accurate liquid-medicine device; use labeled directions and the product dosing syringe.
- [AAP: How to Use Liquid Medicines for Children](https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Using-Liquid-Medicines.aspx): use an appropriately marked dosing tool, preferably an oral syringe; ask the caregiver to show the intended amount; follow the directions exactly.
- [FDA: Acetaminophen](https://www.fda.gov/drugs/safe-use-over-counter-pain-relievers-and-fever-reducers/acetaminophen): identify and do not exceed the directed pediatric dose, avoid overlapping acetaminophen products, and use the device supplied with the liquid product.
- [Poison Control: Get help online or by phone](https://www.poison.org/how-to-get-help-from-poison-control): case-specific guidance uses substance, amount, age/weight, route, symptoms, and time since exposure; suspected poisoning warrants immediate expert help rather than waiting for symptoms.
- [Poison Control: Medication errors](https://www.poison.org/articles/medication-errors): medication-error consultation needs the medicine name, amount, time, age, and weight.
- [CDC: Up and Away Campaign Resources](https://www.cdc.gov/medication-safety/php/toolkit/index.html): medicines and medicine-containing purses or bags should be kept out of young children's reach and sight, with safety caps relocked.

These sources support measurement, exposure assessment/consultation, and storage claims. They do not
establish an item-specific toxic dose; the repair intentionally supplies no toxic threshold or poisoning
diagnosis.
