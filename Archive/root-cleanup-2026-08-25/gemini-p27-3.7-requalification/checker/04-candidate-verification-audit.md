# Phase IV — Audit of Candidate `verification.md`

The mechanical checker used for this audit is preserved at `_tools/verify_candidate_claims.mjs`, with results in `_tools/candidate-claim-checks.json`. Lexical results are independently reproduced by `_tools/template_diagnostics.mjs`.

| Candidate verification claim | Classification | Independent result |
|---|---|---|
| Exactly 46 rows | TRUE | Parsed 46 JSONL records. |
| Global numbering is unique and sequential 1–46 | TRUE | Exact sequence 1 through 46. |
| Part A has 31 rows numbered 1–31 and Part B has 15 rows numbered 1–15 | TRUE | Exact local sequences and part labels. |
| Pair identity and order exactly match frozen `pairs.jsonl` | TRUE | Zero pair-number/item-ID/order mismatches. |
| All 16 required fields are non-null and non-empty | TRUE | Zero missing or empty required fields. |
| Verdict, confidence, and boolean enums/types are valid; distribution is 31/15/0, all HIGH, all source checks false | TRUE | Mechanical values match the report. This validates representation, not the semantic correctness of the verdicts or confidence. |
| Zero unrelated scoped item IDs appear in reasoning fields; 68 unique scoped IDs are isolated to authorized rows | TRUE | Literal full-ID search found zero foreign scoped-ID hits across 68 unique IDs. This guard cannot detect semantic contamination without a copied literal ID. |
| All 46 reconciliation blocks are globally unique | TRUE | 46 exact unique combined blocks. Exact uniqueness does not establish pair-specific reasoning. |
| All English and Chinese keyed rules directly trace to the frozen stems, keys, and rationales | FALSE | Multiple concrete rows disprove the corpus-wide claim; examples below. |
| Average Jaccard 0.0843, maximum 0.3256 at 15/37, and the listed greater-than-0.25 pairs | TRUE | Independently reproduced under Unicode lowercase unique-token Jaccard across all 1,035 pairs. |
| Lexical diagnostics establish semantic independence | TRUE as a disclaimer that they do **not** establish it | The candidate expressly limits them to supporting diagnostics and reserves semantic judgment for the independent checker. No contrary mechanical-proof claim appears. |

## Source-traceability counterexamples

The hard-gate traceability statement is false. Independent frozen-byte comparison found, among others:

- Pair 16: candidate Item B introduces antipsychotic generation/class taxonomy, clozapine's comparative EPS liability, agranulocytosis framing, and boxed warnings absent from the scoped record, then uses them to create a shared adverse-effect decision.
- Pair 21: candidate Item B substitutes an invented home-health/language-concordance plan—including remote interpreter services, translated-material arrangements, ostomy-clinic scheduling, and interpreter availability for calls—for the frozen ostomy discharge-readiness leaf.
- Pair 22: candidate Item A adds pregnancy, advanced HIV, and allergy contraindications not in the MMR item; Item B replaces return precautions with rotavirus isolation and management content absent from the dehydration leaf.
- Pairs 23–25: candidate Item A repeatedly adds phototherapy management to a physiologic-jaundice classification item. Pair 25's Item B also adds car-seat, water-heater, and bulb-syringe teaching absent from the safe-sleep item.
- Pair 29: candidate Item A changes the frozen RR 7/difficult-to-arouse presentation into RR 6/unresponsive/SpO2 84% and specifies IV naloxone although those facts are not in the record.
- Pair 35: candidate Item A adds sodium/fluid restriction and prevention of interdialytic overload/uremic complications, while Item B adds peripheral edema; these additions manufacture a broad fluid-balance reconciliation.
- Pair 41: candidate Item B adds heel offloading and moisture barriers to a matrix that contains neither, then calls all listed rules identical across the two items.

Chinese versions repeat the same unsupported or mutated content in these rows, so bilingual parallelism does not cure traceability.

## Semantic contamination beyond the literal-ID guard

The literal scoped-ID isolation claim is mechanically true but incomplete. Semantic contamination is present without literal IDs at pairs 21–25, 29, and 35: distinctive clinical content absent from the current frozen record appears as item-derived rules, sometimes resembling broader case material or familiar textbook content. Exact-block uniqueness likewise coexists with broad domain-level substitutions at pairs 17, 19, 20, 21, 25, 35, and 43.

## Conclusion

The candidate verifier reliably proves basic shape, identity, enums, exact block uniqueness, and its reported lexical statistics. It materially fails the Module A hard gate by marking corpus-wide source traceability `PASS` despite numerous unsupported and mutated EN/ZH rules. The false traceability pass is substantive, not a limitation of presentation.
