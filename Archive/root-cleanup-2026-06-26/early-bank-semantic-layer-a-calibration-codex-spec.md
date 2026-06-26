# early-bank-semantic-layer-a-calibration-codex-spec.md

Micro-spec. Concept/currency calibration of the Layer A prefilter
(`scripts/audit/early-bank-semantic-layer-a.ts`) before the coherence pilot
slice is drawn. Edit only that file and its regression test
(`scripts/tests/early-bank-semantic-layer-a.ts`). **Do not** touch canonical
banks. **Do not** run the adversarial pilot. Layer A stays routing-only — no
verdicts, no severity, no clinical claims.

Follows the accepted spec-1 implementation. Three calibration fixes + a
regression guard, then regen.

## 1. Tighten the `pressure_injury` concept regex

The current clause `stage (?:i{1,4}|[1-4])` matches generic staging language
(cancer, CKD, hypertension), inflating `pressure_injury` to 127 concept rows.
Replace the `pressure_injury` entry's `pattern` in `CONCEPT_RULES` with:

```
/\b(?:pressure (?:injury|ulcer)|braden|unstageable|deep tissue (?:pressure )?injury|stage (?:i{1,4}|[1-4]) pressure)\b/i
```

Requirement: preserve real pressure-injury hits ("stage III pressure ulcer",
deep tissue injury, Braden, unstageable, "pressure injury/ulcer") while dropping
bare generic "stage II / stage 3 / stage IV" and bare "deep tissue". Equivalent
wording is fine if it meets that bar (the test in §4 enforces it).

## 2. Move `restraints_fall` from concept → currency

As a concept cluster it emitted zero pair rows (concept rows require a Jaccard
pair); restraint/fall framing drifts with regulation and is better surfaced by
keyword match for an OG/currency review than by pair formation.

- Remove `"restraints_fall"` from the `ConceptCluster` union and its entry from
  `CONCEPT_RULES`.
- Add `"restraints_fall"` to the `CurrencyCluster` union.
- Add to `CURRENCY_RULES`, harm rank **79** (safety/regulatory review surface,
  just below `bp_targets`):

```
{
  cluster: "restraints_fall",
  pattern: /\b(?:restraint|seclusion|sitter|fall (?:precaution|risk)|bed alarm|side rail)\b/i,
  harmRank: 79,
},
```

## 3. Move `neutropenic_precautions` from concept → currency

Emitted only 4 concept-pair rows; protective-environment/infection-control
guidance is a better OG/currency-review surface (it already produced a
source-dependent REVIEW in campaign Session 07).

- Remove `"neutropenic_precautions"` from the `ConceptCluster` union and its
  entry from `CONCEPT_RULES`.
- Add `"neutropenic_precautions"` to the `CurrencyCluster` union.
- Add to `CURRENCY_RULES`, harm rank **87** (infection-control adjacent, just
  below `isolation_precautions` at 88):

```
{
  cluster: "neutropenic_precautions",
  pattern: /\b(?:neutropeni\w*|absolute neutrophil|protective environment|reverse isolation)\b/i,
  harmRank: 87,
},
```

After §2–§3, `CONCEPT_RULES` has 12 clusters and `CURRENCY_RULES` has 11. The
two moved patterns are unchanged from their concept-era form. Multi-cluster
overlap (e.g. a neutropenic item also matching `isolation_precautions`) is
expected and emits one currency row per matched cluster — unchanged behavior.

## 4. Regression guard (test)

The defect in §1 recurs silently if a later edit re-broadens the regex, and the
current test can't catch it because the matching logic isn't reachable in
isolation. Make it reachable and pin it:

- Refactor the inline concept-matching in `loadItems` into an exported pure
  helper, e.g.:

  ```
  export const matchConceptClusters = (searchText: string): ConceptCluster[] =>
    CONCEPT_RULES.filter(({ pattern }) => pattern.test(searchText)).map(
      ({ cluster }) => cluster,
    );
  ```

  Use it in `loadItems` so behavior is identical.
- Add assertions to `scripts/tests/early-bank-semantic-layer-a.ts`:

  ```
  // pressure_injury must not match generic staging language
  assert(!matchConceptClusters("Stage II breast cancer staging").includes("pressure_injury"));
  assert(!matchConceptClusters("Stage 3 chronic kidney disease").includes("pressure_injury"));
  // but must still match real pressure-injury content
  assert(matchConceptClusters("Stage III pressure ulcer on the sacrum").includes("pressure_injury"));
  assert(matchConceptClusters("Braden scale risk assessment").includes("pressure_injury"));
  ```
- Update the `recordedBaseline` snapshot comment values to the regenerated
  `inventory_count` / `queue_row_count` / `unique_queued_items` (documentation
  only; it is `void`-ed, not asserted).

The existing structural invariants stay (determinism, byte-stability, no-skip
guarantee on the largest topic group, concept-cluster presence,
`delegation_scope`/`isolation_mode` rows > 0, harm-rank variance, currency rows
present). None reference the two moved clusters, so they hold unchanged.

## 5. Regenerate and report

```
npm run audit:early-bank-semantic
npm run test:early-bank-semantic
```

Report the regenerated `inventory_count`, `queue_row_count`,
`unique_queued_items`, `rows_by_track`, `currency_rows_by_cluster`,
`concept_rows_by_cluster`, `coherence_rows_by_reason`. Do not commit; Claude
gates the diff.

Expected: `pressure_injury` drops substantially from 127 (to roughly the
low-tens of genuine hits); `restraints_fall` and `neutropenic_precautions`
appear under `currency_rows_by_cluster` and are gone from
`concept_rows_by_cluster`; coherence row total falls modestly (the ~127
pressure_injury false positives and the two moved concept seeds no longer
generate concept pairs); currency row total rises by the keyword matches for the
two new clusters. Layer A remains deterministic routing only.
