# Phase III — Template and Pair-Specificity Audit

## Scope and method

This audit used the 46 candidate `strongestReconciliation + reconciliationTest` blocks. The deterministic diagnostic script is preserved at `_tools/template_diagnostics.mjs`; its result is `_tools/template-diagnostics.json`.

The transparent similarity method lowercases each combined block, extracts Unicode letter/number tokens, converts them to unique-token sets, and computes pairwise Jaccard intersection/union. Punctuation and word frequency are discarded. These measurements are diagnostics only and do not establish semantic independence.

## Deterministic results

- Rows: 46.
- Pairwise comparisons: 1,035.
- Exact duplicate combined blocks: 0.
- Repeated identical six-token openings: 0.
- Average pairwise Jaccard: 0.084303.
- Maximum pairwise Jaccard: 0.325581, pairs 15 and 37.
- Pairs above 0.25: 15/37 (0.325581), 33/36 (0.291667), 14/36 (0.282609), 36/38 (0.272727), 7/9 (0.263889), and 33/38 (0.260870).

Repeated conclusion vocabulary is common despite exact-block uniqueness: 15 blocks use “both items”; 29 use both “Item A” and “Item B”; 20 contain a totalizing phrase such as “fully,” “completely,” “entirely,” “identical,” “zero conflict,” “zero contradiction,” or “harmonious.” The explicit word “complementary” appears in pairs 17, 25, and 43.

These figures reproduce the candidate verifier's reported Jaccard average, maximum, and greater-than-0.25 list under the stated tokenizer.

## Manual review of highest-overlap clusters

- Pair 15 / pair 37: the overlap is stylistic. Both correctly dismiss unrelated ordered/procedural topics, but the actual item rules differ and remain identifiable. No noun-swapped semantic defect was found from the overlap alone.
- Pairs 33, 36, and 38: repeated wording is substantially explained by their shared dialysis item and the valid conclusion that the paired second item is unrelated. The second-item facts remain pair-specific. Pair 36 nevertheless contains a source-traceability embellishment; that is not a template finding.
- Pair 14 / pair 36: the similarity comes from generic “different scenario/no shared decision” language. The underlying rules are distinct and recognizable, so this is stylistic repetition rather than semantic substitution.
- Pair 7 / pair 9: both reuse the same wound-assessment item and compare expected early drainage with postoperative complications. Their overlap is clinically legitimate.
- Pairs 40, 44, and 46: overlap is expected because the records concern related pressure-injury cases. Lexical similarity does not detect the decisive defect at pair 40, where the candidate ignores the frozen matrix key/rationale reversal.

## Manual pair-specificity failures

Exact uniqueness did not prevent domain-swapped reasoning. The material failures are semantic:

- Pair 16 manufactures a common psychotropic-adverse-effect decision by importing drug-class and adverse-effect facts absent from the scoped records.
- Pairs 17, 19, 20, and 21 treat “discharge planning,” “discharge readiness,” or “transitional care” as an exact decision even though the items constrain different actions. Pair 21 further replaces an ostomy discharge-readiness leaf with an invented home-health/interpreter plan.
- Pairs 23 and 25 construct neonatal-care reconciliations from invented phototherapy and newborn-safety facts rather than the frozen leaves.
- Pair 35 turns dialysis access/diet teaching and hypervolemia findings into one broad “fluid balance nursing” decision by adding sodium/fluid restriction and interdialytic-overload prevention absent from Item A.
- Pair 43 explicitly calls wound staging and Braden risk assessment “complementary phases” of pressure-injury practice. That is a shared domain, not a shared clinical decision.
- Pair 40 reports complete harmony without testing Item B's keyed matrix mapping against its own rationale, thereby missing the real contradiction.

The repeated totalizing phrases become substantively problematic at pairs 40, 41, 44, and 46 because “identical,” “completely,” or “match completely” overstates partially overlapping rules. Pair 41 is material: the candidate adds heel offloading and moisture barriers to Item B and uses those additions to claim identical teaching. Pair 46 is less severe but still obscures a fixed q2h schedule versus an individualized schedule.

## Conclusion

The corpus is not an exact-copy template corpus: no combined block is duplicated, the top lexical clusters have understandable causes, and several repeated structures are legitimate. It nevertheless fails pair-specific semantic judgment. Multiple reconciliations substitute a broad care domain for the required exact decision, and several use unsupported, semantically imported facts to create the claimed overlap. Exact text uniqueness and low average Jaccard therefore do not establish de novo or trustworthy reasoning.
