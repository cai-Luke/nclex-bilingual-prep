# early-bank-semantic-layer-a-enhancement-codex-spec.md

Codex implementation spec. Enhances the deterministic Layer A prefilter
(`scripts/audit/early-bank-semantic-layer-a.ts`) ahead of the first coherence
audit batch. Layer A stays **routing-only** — no clinical judgment, no verdicts
(campaign spec §4, Appendix B). Every change here is deterministic metadata or
candidate-assembly. Canonical banks are read-only.

Governing docs: `Archive/root-specs-2026-06-18/NCLEX_Audit_Spec.md` (parent),
`Archive/early-bank-semantic-audit-spec.md` (campaign), `DECISIONS.md`
principles 2/3.

## Why

Two defects block a useful coherence run off the current queue:

1. **The pair builder silently drops the densest topics.** `buildPairMap`
   skips any normalized-topic group with `length > 40`
   (`if (group.length < 2 || group.length > 40) return;`). At the 2026-06-13
   baseline (1,692 records) that was near-inert. At the current ~2,386 graded
   items, several normalized topics exceed 40 — within a single Client-Needs
   category the census already shows Mental Health Disorders 63,
   Prioritization & Delegation 55, Legal & Ethical 51, Patient & Environment
   Safety 44, Transmission-Based Precautions 42, and project-wide groups are at
   least that large. Those are exactly where `DC`/`AK` contradictions
   concentrate, and they get **zero** similarity pairs. The 40-cap is a
   precision guard that the Jaccard gate already does better; as a coverage
   gate it is a bug.

2. **No cross-topic concept clustering.** Pairing keys on `normalized_topic`
   only. A contradiction about potassium-replacement safety or digoxin-hold
   parameters that appears under two *different* topic strings (or two
   different banks) is never paired. Cross-bank/cross-topic contradiction is
   the highest-yield non-obvious finding class (campaign §2, §3 Track 2) and
   the topic-only grouping can't reach it.

The queue is also stale: `gpt-canonical` 242 → 498, `gemini-canonical`
771 → 874, `claude-canonical` 60 → 97 since the last Layer A run. The regen at
the end of this spec rebuilds it.

## Scope

Edit `scripts/audit/early-bank-semantic-layer-a.ts` and its regression test
`scripts/tests/early-bank-semantic-layer-a.ts`. No other source changes. Do
**not** touch canonical banks, the campaign reports, or the manifest/findings
schema (severity lives in the pilot spec, not here — Layer A assigns no
severity).

## Change 1 — Concept clusters (curated, cross-topic)

Add a curated high-harm concept map, parallel in shape to the existing
`CURRENCY_RULES`. These are the clinically tight, cross-topic clusters where a
contradiction is high-value (GPT review point 6; campaign §2 "cluster around
concepts").

Add a `ConceptCluster` string-literal union and a `CONCEPT_RULES` array of
`{ cluster: ConceptCluster; pattern: RegExp; harmTier: number }`. Starter set
(refine patterns as needed; keep them anchored with `\b` and case-insensitive):

| cluster | harmTier | pattern (starter) |
|---|---:|---|
| `delegation_scope` | 25 | `delegat\|assign\|unlicensed assistive\|\buap\b\|\blpn\b\|\blvn\b\|scope of practice\|charge nurse\|float pool` |
| `isolation_mode` | 25 | `airborne\|droplet\|contact precaution\|negative[- ]pressure\|\bn95\b\|tuberculosis\|c\.? ?diff\|\bmrsa\b\|\bvre\b\|measles\|varicella\|pertussis\|meningitis` |
| `potassium_replacement` | 25 | `potassium\|\bkcl\b\|hyperkalemia\|hypokalemia\|iv potassium` |
| `insulin_hypoglycemia` | 25 | `insulin\|hypoglycemia\|blood glucose\|sliding scale\|\bd50\b\|dextrose 50\|glucagon` |
| `mi_chest_pain` | 25 | `chest pain\|myocardial infarction\|\bstemi\b\|\bnstemi\b\|troponin\|acute coronary\|angina\|nitroglycerin` |
| `stroke_escalation` | 25 | `stroke\|\bcva\b\|\btia\b\|\bnihss\b\|thrombectomy\|alteplase\|tenecteplase\|last known well` |
| `digoxin_hold` | 20 | `digoxin\|lanoxin\|digitalis\|dig(?:oxin)? level` |
| `lithium_toxicity` | 20 | `lithium` |
| `dialysis_complications` | 20 | `dialysis\|hemodialysis\|peritoneal dialysis\|av fistula\|\bgraft\b\|disequilibrium\|dwell\|effluent` |
| `fetal_heart_rate` | 20 | `fetal heart rate\|\bfhr\b\|(?:late\|early\|variable) decelerat\|variability\|uterine\|tocod?ynamometer\|contraction pattern` |
| `restraints_fall` | 20 | `restraint\|seclusion\|\bsitter\b\|fall (?:precaution\|risk)\|bed alarm\|side rail` |
| `neutropenic_precautions` | 20 | `neutropeni\|absolute neutrophil\|protective environment\|reverse isolation` |
| `pressure_injury` | 15 | `pressure (?:injury\|ulcer)\|braden\|deep tissue\|unstageable\|stage (?:i{1,4}\|[1-4])\b` |
| `hipaa_disclosure` | 15 | `\bhipaa\b\|confidential\|disclosure\|privacy\|protected health information\|\bphi\b\|release of information` |

Overlap with `CURRENCY_RULES` regexes (isolation, stroke, insulin) is
**intentional**: an item may be both a currency-OG candidate and a
concept-pair candidate. They route to different tracks and do not collide.

Compute `concept_clusters: ConceptCluster[]` per item in `loadItems` exactly as
`currency_clusters` is computed (test each `CONCEPT_RULES.pattern` against the
existing `searchText` = `${topic} ${stem.en}`). Add `concept_clusters` to
`SemanticInventoryItem`, thread it through `inventoryFields`, and include it on
every queue row.

## Change 2 — De-cap and concept-shard the pair builder

Rework `buildPairMap` so no group is dropped for size. Add a single shard
helper and a max-group constant:

```
const MAX_PAIR_GROUP = 60;
```

Pairing now has three contributors feeding the same de-duplicated `pairMap`
(the existing `addPair` + Set dedup is unchanged):

- **(a) Topic-similarity pairs (existing, de-capped).** Group by
  `normalized_topic`. For each group with `length >= 2`: if
  `length <= MAX_PAIR_GROUP`, pair pairwise under the existing Jaccard gate
  (`stemSimilarity >= 0.28 || answerSimilarity >= 0.34`) — unchanged. If
  `length > MAX_PAIR_GROUP`, **shard** the group (helper below) and apply the
  same Jaccard gate within each shard. Replaces the `> 40` skip.
- **(b) Concept pairs (new).** Group all items by `concept_cluster` (one group
  per `ConceptCluster`, an item in N concept clusters joins N groups). Within
  each group, pair under the same Jaccard gate, sharding any group with
  `length > MAX_PAIR_GROUP`. This is the cross-topic / cross-bank contradiction
  engine. Record the concept on the pair's routing reason (see Change 3).
- **(c) skill_signature pairs (existing, unchanged).** All-pairs within a
  `skill_signature` group, no gate.

Shard helper — deterministic, no item ever dropped:

```
// Partition an oversized group into sub-groups each <= MAX_PAIR_GROUP where
// possible, by a deterministic secondary key, then tertiary. Items are never
// discarded; a residual sub-group that is still > MAX after both keys is kept
// whole (its pairwise cost is bounded — see Notes).
const shardGroup = (group: LoadedItem[]): LoadedItem[][] => {
  if (group.length <= MAX_PAIR_GROUP) return [group];
  // secondary key: first concept cluster (sorted) || "_none"
  // tertiary key: item_type
  // bucket deterministically; sort buckets by key; within bucket sort by id
  // (items already arrive id-sorted from loadItems)
};
```

The Jaccard gate stays the precision filter throughout. Sharding only bounds
comparison count; it must not remove any item from consideration. Determinism
is mandatory (the test asserts byte-stable output) — iterate clusters and
shards in sorted key order, items in `id` order.

## Change 3 — Concept-weighted coherence harm rank + routing reasons

Two edits in `buildSemanticLayerA`, where coherence rows are emitted:

1. **Routing reasons.** Today a coherence row records
   `"topic/answer similarity pair"` and/or `"redundancy cluster size >= 3"`.
   Add, for each concept cluster the item belongs to that contributed a pair,
   `"concept cluster: <name>"`. Keep existing reasons. `routing_reasons` must
   stay non-empty for every emitted row (test invariant).
2. **Harm rank.** Coherence rows are currently flat at
   `50 + provenanceBonus(tier)`, so the coherence queue has no clinical
   ordering — GPT review point 5. Change to:

   ```
   harm_rank: 50 + provenanceBonus(item.provenance_tier) + conceptHarm(item)
   ```

   where `conceptHarm` is the **max** `harmTier` over the item's
   `concept_clusters` (0 if none). This sorts delegation / isolation /
   potassium / insulin / MI / stroke coherence rows above generic redundancy,
   giving the pilot a harm-first draw. Currency rows are unchanged; currency
   and coherence harm ranges may now overlap, which is harmless because the
   pilot selects on `track === "coherence"` explicitly and the existing
   `trackOrder` tiebreaker still orders exact ties currency-first.

## Change 4 — Summary additions

In `writeSemanticLayerA`'s `summary`, add:

- `concept_rows_by_cluster`: `countBy` over coherence rows' concept clusters
  (an item with multiple concepts counts once per concept it carries a pair
  for). Mirror the existing `currency_rows_by_cluster` shape.
- `coherence_rows_by_reason`: counts of the three routing-reason families
  (`similarity_pair`, `concept_pair`, `redundancy_cluster`) so the pilot can
  size its slice.

Keep the existing summary fields. The pilot reads this summary to pick its
batch.

## Change 5 — Regression test (`scripts/tests/early-bank-semantic-layer-a.ts`)

The current test hard-pins the stale baseline and **will break on regen** by
design. Replace the brittle pins with structural invariants plus a single
re-pinned, clearly-labelled snapshot:

- **Keep:** the five `provenanceTierFor` assertions; determinism + byte
  stability (`secondQueue === firstQueue`, `secondSummary === firstSummary`,
  `deepEqual(second.rows, first.rows)`); the in-scope-bank assertion; the
  every-row-has-a-routing-reason assertion; the
  immunization/screening currency-candidate existence assertion; the
  coherence-pairs-exist assertion.
- **Remove:** `first.inventory.length === 1692`,
  `first.rows.length === 1312`, `first.summary.unique_queued_items === 1136`,
  and the exact `currency_rows_by_cluster` deepEqual. These are now recorded as
  a soft snapshot (below), not invariants.
- **Re-pin as a labelled snapshot** (update on every intentional regen; this is
  documentation, not a guard): after running, set the new
  `inventory.length`, `rows.length`, `unique_queued_items` to the regenerated
  values with a comment `// Recorded baseline — update on intentional regen`.
- **Add invariants:**
  - every inventory item and every queue row has a `concept_clusters` array
    (possibly empty);
  - `summary.concept_rows_by_cluster` is non-empty and includes
    `delegation_scope` and `isolation_mode`;
  - at least one coherence row carries a `"concept cluster: ..."` routing
    reason (proves the concept pass emits);
  - **no-skip guarantee:** pick the largest `normalized_topic` group in the
    inventory; assert at least one coherence row exists for an item in that
    group (proves the de-cap/shard reaches the densest topic — would fail
    under the old `> 40` skip);
  - coherence `harm_rank` is not constant
    (`new Set(coherenceRows.map(r => r.harm_rank)).size > 1`), proving concept
    weighting applied;
  - currency-track rows still exist and currency `harm_rank` ≥ the coherence
    base (sanity that currency wasn't reweighted).

## Run

```
npm run audit:early-bank-semantic   # regenerates queue + summary (read-only re: banks)
npm run test:early-bank-semantic    # must pass with the new invariants
```

Then report (do not commit canonical or census changes — Luke runs
`npm run census` / `census:check` at execution time): the regenerated
`inventory_count`, `queue_row_count`, `unique_queued_items`,
`rows_by_track`, `currency_rows_by_cluster`, `concept_rows_by_cluster`, and
`coherence_rows_by_reason`. Claude gates the diff before Luke acts.

## Notes / boundaries

- Layer A remains routing-only. No verdicts, no severity, no clinical claims.
- Determinism is load-bearing (byte-stable test). Sort every iteration by a
  stable key; never rely on `Map`/`Set` insertion order across a non-sorted
  source.
- `MAX_PAIR_GROUP = 60` is a comparison-budget guard, not a correctness one;
  the Jaccard gate owns precision. A residual shard still > 60 after concept +
  item_type keys is kept whole — at the current bank the worst case is a few
  thousand comparisons, negligible. Do not reintroduce a drop.
- Currency/concept assignment is a content lever: the two rule arrays share a
  shape, so moving a cluster between `CURRENCY_RULES` and `CONCEPT_RULES` is a
  one-line change if Luke reclassifies one later (see the open question in the
  chat handoff: `restraints_fall` and `neutropenic_precautions` sit in concept
  here but have a plausible currency/regulatory-drift case).
