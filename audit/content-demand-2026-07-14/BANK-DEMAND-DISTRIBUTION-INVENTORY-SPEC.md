# Codex Task: Reproducible Bank-Demand and Distribution Inventory

## Objective

Produce a reproducible, machine-grounded inventory that separates:

1. genuine learner-facing non-MCQ distribution concentration;
2. low-sample and canonical-partition artifacts in the current audit;
3. conditional content-remediation envelopes requiring architect approval;
4. mechanically supported topic × item-type × difficulty opportunities for a later standalone GPT production batch.

This is an analysis-only task with scoped artifact writes. Do not generate questions, change audit code, edit any bank, retire content, promote content, consolidate content, update a ledger, or regenerate the census.

Replace the phrase "exact targeted regeneration" with:

«exact mechanical demand envelopes and conditional simulations»

Codex may establish counts, distributions, constraints, routing consequences, and review priorities. It may not make final clinical retirement decisions or final audit-policy rulings.

---

## Required read order

Read current live disk in this order:

1. "AGENTS.md"
2. "DECISIONS.md"
3. "PROJECT-HISTORY.md"
4. "NCLEX-Question-Schema.md"
5. "BANK-CENSUS.md"
6. "scripts/census.ts"
7. "scripts/coverage-report.ts"
8. "scripts/audit/non-mcq-bias-lib.ts"
9. "scripts/audit/audit-non-mcq-bias.ts"
10. "scripts/audit-non-mcq-bias.ts"
11. "lib/shuffle.ts"
12. "lib/canonical-routing.ts"
13. "audit/non-mcq-bias-report.md"
14. all canonical banks needed to reproduce the findings

Verify every operative claim against live source rather than treating this task text or an existing generated report as authoritative.

---

## Scope and permitted writes

All newly authored files must remain under:

"audit/content-demand-2026-07-14/"

Permitted outputs:

- a reproducible generator script;
- generated JSON inventory;
- generated Markdown inventory;
- commission manifest;
- concise handoff.

Do not modify files outside that directory.

This is not literally read-only because it creates analysis artifacts. It is read-only with respect to:

- "banks/**"
- "src/**"
- "scripts/**" outside the designated audit directory
- "lib/**"
- project governance documents
- "BANK-CENSUS.md"
- "census.json"
- existing shared audit reports
- review ledgers

---

## Population definitions

Use these exact structural populations and record their reconciliation totals.

### "graded_leaves"

Contains:

- every top-level standalone question;
- every embedded case-study part.

Excludes:

- every top-level "case_study" parent container.

This mirrors the population flattened by the current non-MCQ bias audit.

Do not label this an exposure-weighted population. A standalone question and an embedded case part are not necessarily sampled with equal frequency.

### "commissionable_standalone"

Contains:

- top-level standalone questions only.

Excludes:

- case parents;
- embedded case parts.

Use this population for ranking future standalone commissions.

### "embedded_case_parts"

Contains:

- embedded case-study parts only.

Every record must include:

- "id"
- "parentCaseId"
- "parentTopic"
- "parentCategory"
- source bank

Embedded parts may be analyzed, but must never be proposed for independent retirement without explicit case-level review.

### "case_parents"

Contains:

- top-level "case_study" containers only.

Use for reconciliation and context. Do not include case parents in item-type distribution arithmetic as though they were graded leaves.

### Optional exposure views

Where useful, report separately:

- "standalone_study_pool"
- "embedded_case_part_pool"

Do not combine them into an asserted learner-exposure distribution without an explicit, code-grounded weighting model.

### Required reconciliation invariant

The output must prove:

"graded_leaves = commissionable_standalone + embedded_case_parts"

Also report:

- top-level standalone count;
- case-parent count;
- embedded-part count;
- top-level total;
- graded-leaf total;
- per-bank reconciliation.

A mismatch is a task failure.

---

## Operational sequence

1. Record:
   - "git rev-parse HEAD"
   - "git status --short"
   - active branch
2. Establish the starting-worktree baseline:
   - permit the user-authored spec itself to be untracked under the designated audit directory;
   - require no pre-existing change outside "audit/content-demand-2026-07-14/";
   - record every pre-existing path under that directory so the task attributes only subsequent changes to itself.
3. Run "npm run census:check".
4. If census check fails:
   - stop;
   - report stale generated state;
   - do not run "npm run census";
   - do not continue with recommendations based on unreconciled inputs.
5. Run "npm run audit".
   - The standing distributional warnings are advisory and may coexist with a successful aggregate gate.
6. Do not run "npm run census".
7. Avoid running the standalone bias command if doing so rewrites shared "audit/non-mcq-bias-*" artifacts.
8. Implement a reproducible generator under the designated directory that imports or faithfully reproduces the live audit computations without changing shared generated reports. The generator must itself run and capture "npm run census:check" and "npm run audit" so the provenance command exit codes are machine-recorded rather than hand-entered.
9. Run that generator with "npx tsx".
10. Run "git diff --check".
11. Confirm every changed path is under "audit/content-demand-2026-07-14/".

---

## Audit-result contract

The "AuditDisposition" contract applies to the two distributional checks in scope:

- "select_all / correct_count_distribution";
- "ordered_response / template_repetition".

Other results from "npm run audit" are recorded as verification context but do not require synthetic remediation dispositions in this artifact.

Every distributional check must distinguish its own calculation from inherited status.

For every scope and check, report:

```typescript
type AuditDisposition = {
  scopeId: string;
  population:
    | "graded_leaves"
    | "commissionable_standalone"
    | "embedded_case_parts"
    | "case_parents"
    | "canonical_bank"
    | "global_audit";
  bank: string | null;
  itemType: string;
  check: string;

  nativeVerdict: "PASS" | "FAIL" | "INSUFFICIENT";
  effectiveVerdict: "PASS" | "FAIL" | "INSUFFICIENT";
  inheritedFrom: string[];

  n: number;
  nUsable: number;

  lowN: {
    value: boolean;
    reason: string | null;
    minimumNToPossiblyPass: number | null;
    mechanicallyImpossibleToPassAtCurrentN: boolean;
  };

  metrics: Record<string, unknown>;

  disposition:
    | "no_action"
    | "content_candidate"
    | "audit_policy_review"
    | "routing_blocked"
    | "case_level_review";

  requiresClaudeRuling: boolean;
};
```

### "nativeVerdict"

The verdict produced by the scope's own observations before any inherited per-bank failure is applied.

### "effectiveVerdict"

The verdict emitted under the repository's current inheritance behavior.

### "inheritedFrom"

The exact per-bank scope IDs responsible for converting an otherwise non-failing global record into an effective failure.

Never describe an inherited global failure as a native global concentration.

For any diagnostic scope other than the repository's official "global" audit scope, "effectiveVerdict" equals "nativeVerdict" and "inheritedFrom" is empty. Inheritance is applied only where the live audit applies it.

Use this deterministic disposition mapping:

1. native "PASS" or "INSUFFICIENT" with no inherited failure → "no_action";
2. otherwise-native non-failing global converted by inheritance → "audit_policy_review", or "routing_blocked" when the responsible bank is frozen and ordinary routing cannot affect it;
3. native failure caused solely by mechanical low-n impossibility or a missing SATA boundary bin → "audit_policy_review";
4. native non-low-n concentration that can be affected by content within an authorized route → "content_candidate";
5. any embedded-part candidate → "case_level_review";
6. any proposed content action against a frozen bank → "routing_blocked".

Set "requiresClaudeRuling" to "false" only for "no_action"; set it to "true" for every other disposition.

---

## Required distribution scopes

Generate the following one-dimensional cohort views. Do not silently substitute a cross-product.

For both SATA and ordered response, calculate:

1. all "graded_leaves" globally;
2. each canonical bank over its graded leaves;
3. each category over "graded_leaves";
4. each mechanically normalized topic over "graded_leaves";
5. each difficulty over "graded_leaves";
6. "commissionable_standalone" globally;
7. "embedded_case_parts" globally.

Additionally:

- subdivide every SATA scope by each option count actually observed in that scope for diagnostics;
- subdivide every ordered-response scope by each sequence length actually observed in that scope for diagnostics.

Do not manufacture empty shape cohorts for option counts or sequence lengths absent from a diagnostic scope.

The official current-audit records remain the global and per-canonical-bank "graded_leaves" records. Category, topic, difficulty, location, option-count, and sequence-length records are diagnostic views and do not acquire inherited verdicts.

---

## Low-sample analysis

### SATA

The current audit expects every correct-count value from "1" through "options.length" to occur for every observed option count.

For each SATA option-count cohort, report:

```typescript
type SataCohort = {
  scopeId: string;
  optionCount: number;
  n: number;
  histogram: Record<string, number>;
  topCount: number | null;
  dominantCorrectCounts: number[];
  topFrequency: number;
  topShare: number | null;
  missingCounts: number[];

  minimumNToPopulateAllCurrentRuleBins: number;
  mechanicallyImpossibleToPassAtCurrentN: boolean;

  boundaryCounts: {
    oneCorrectObserved: boolean;
    allCorrectObserved: boolean;
  };

  productionDemand:
    | "none"
    | "conditional"
    | "prohibited_pending_architect";
};
```

Rules:

- "minimumNToPopulateAllCurrentRuleBins = optionCount".
- "dominantCorrectCounts" contains every tied maximum-frequency correct-count bin in numeric order; "topCount" is its first member, or null when "n == 0". "topFrequency" is the maximum cell frequency.
- When "n < optionCount", mark the cohort mechanically incapable of satisfying the current missing-bin rule.
- "SataCohort" is a diagnostic option-count subdivision. It must not be presented as the repository's native audit record, because the live audit computes one combined correct-count histogram and top share per scope while splitting only missing bins by option count.
- For a current-audit scope containing more than one observed option count, also report "minimumTotalNToPopulateAllObservedOptionCountBins = sum(observed option counts)". For the current five- and six-option shapes, that minimum is 11.
- Do not derive a production commission from a low-n per-bank SATA failure.
- Do not prescribe one-correct or all-correct SATA questions merely to populate a bin.
- Missing boundary counts "1" or "N" require architect review of whether those are desirable NCLEX-style SATA forms.
- A missing boundary bin always maps to "audit_policy_review", not "content_candidate". A SATA content candidate may arise only from a non-low-n concentration independent of boundary-bin absence.
- Report tiny-bank failures as audit behavior, not automatic content debt.
- Keep global/native and per-bank findings separate.

### Ordered-response

For each ordered-response cohort, report:

```typescript
type OrderedResponseCohort = {
  scopeId: string;
  n: number;

  sequenceLengthHistogram: Record<string, number>;
  templateHistogram: Record<string, number>;
  topTemplate: string | null;
  topTemplates: string[];
  topTemplateCount: number;
  topTemplateShare: number | null;

  minimumNForUniqueTemplatesToMeetCurrentShareLimit: number;
  mechanicallyImpossibleToPassAtCurrentN: boolean;

  meanNormalizedKendall: number | null;
  normalizedKendallHistogram: Record<string, number>;
  normalizedKendallByItem: Array<{
    itemRef: ItemRef;
    value: number;
  }>;

  templates: Array<{
    template: string;
    count: number;
    itemRefs: ItemRef[];
  }>;
};
```

Calculate:

"minimumNForUniqueTemplatesToMeetCurrentShareLimit = ceil(1 / template_repeat_max_share)"

Under the current 0.15 limit, this is 7.

If a cohort contains fewer than seven items, even perfectly unique templates cannot satisfy the current threshold. Mark that fact explicitly.

Use the live audit's three-decimal Kendall buckets. "topTemplates" contains every tied dominant template in lexical order; "topTemplate" is the first lexical member, matching the live audit's deterministic tie-break.

For "lab-canonical.json", verify whether:

- templates actually repeat;
- all four templates are distinct;
- the failure is solely caused by low "n";
- the global native cohort passes;
- the global effective failure is inherited from the lab bank.

Do not issue a lab ordered-response production commission solely from that low-n finding.

---

## Deterministic promotion shuffle

Ordered-response final templates depend on the deterministic promotion shuffle.

Current canonical banks already contain the promoted presentation order. Compute their "promotedTemplate" directly from the stored canonical "options" and "correct" arrays. Never call "shuffle()" on a canonical item: the live shuffle is not idempotent, and a second application would produce a false template.

Therefore:

- do not ask the producer to author a particular final permutation;
- do not manipulate content order to obtain one;
- do not search for, regenerate, or mutate item IDs to force a desired permutation;
- do not treat a pre-promotion option order as the final template;
- do not project a final template as certain before a stable candidate ID exists.

A future remediation manifest may specify:

- genuine clinical sequence length;
- desired semantic workflow diversity;
- avoidance of duplicating an existing clinical sequence.

It may not specify a producer-controlled final permutation.

Any projected template effect must be marked:

```typescript
type ConditionalTemplateProjection = {
  status: "conditional_pre_promotion" | "verified_post_promotion";
  candidateId: string | null;
  assumedTemplate: string | null;
  finalTemplate: string | null;
  changesNativeVerdict: boolean | null;
  changesEffectiveVerdict: boolean | null;
  caveat: string;
};
```

Final template acceptance must be checked after the actual deterministic promotion transform.

A candidate whose shuffled template does not improve the target distribution may still be good ordinary content, but it must not be counted as successful distribution remediation.

---

## Canonical routing constraints

Use live "routeCanonical" behavior and current governance.

"routeCanonical" routes a raw filename, not a visual kind or question object. Executable routing proves the destination for a supplied filename; it does not by itself authorize use of that lane.

The original per-kind canonical banks are frozen content sets, not ordinary active generation targets. New visual content routes to "visual-canonical.json".

Every simulation must apply actual routing.

Every routing-aware record must include:

```typescript
type RoutingTrace = {
  routeInputFilename: string | null;
  routeInputPrefix: string | null;
  resolvedCanonical: string | null;
  governanceAllowsRoute: boolean;
};
```

For ordinary new visual content, test a "visual-..." raw filename through "routeCanonical". Do not infer the destination from "visual.kind". A legacy "lab-..." filename still resolves mechanically to "lab-canonical.json", but governance blocks that frozen lane from ordinary generation.

Consequences that must be represented:

- a new lab-trend ordered-response question in the live visual lane routes to "visual-canonical.json";
- it may change a global native distribution;
- it cannot change "lab-canonical"'s native per-bank record;
- under current inheritance behavior, it therefore cannot by itself clear a global effective failure inherited from "lab-canonical".

For any proposed operation involving an original frozen per-kind bank, use:

```typescript
type RoutingDisposition =
  | "allowed_current_route"
  | "frozen_bank_exception_required"
  | "audit_policy_change_required"
  | "removal_only_simulation"
  | "not_executable";
```

Do not presume that an in-place replacement inside a frozen per-kind bank is authorized.

For the lab ordered-response finding, simulate separately:

1. no content change plus low-n/audit-policy disposition;
2. removal-only consequences;
3. replacement inside the frozen bank, explicitly marked as requiring an architect-approved exception;
4. ordinary additions routed to "visual-canonical", showing that they do not clear the inherited lab failure.

Do not recommend deleting useful content merely to convert a "FAIL" into "INSUFFICIENT".

---

## Item-reference schema

Use this exact shape wherever an item is referenced:

```typescript
type ItemRef = {
  id: string;
  parentCaseId: string | null;
  parentTopic: string | null;
  parentCategory: string | null;
  bank: string;

  location: "top_level_standalone" | "embedded_case_part";

  itemType: string;
  category: string;
  difficulty: string;

  topicRaw: string;
  topicNormalized: string;
  topicLabelVariants: string[];

  optionCount: number | null;
  correctCount: number | null;
  sequenceLength: number | null;
  promotedTemplate: string | null;

  visualKinds: string[];
  skillSignature: string | null;
};
```

All embedded part references must carry "parentCaseId".

For embedded parts, "parentTopic" and "parentCategory" must also be non-null. They are null for top-level standalone items.

Define:

- "skillSignature = question.ngnSkill ?? null";
- "visualKinds" as the sorted unique kinds from the leaf's direct load-bearing "question.visual" only;
- do not include "rationale.visuals" or shared parent-case exhibits in a leaf's "visualKinds";
- "topicLabelVariants" as the sorted raw variants in the same mechanical topic bucket across "graded_leaves".

If case-parent details beyond reconciliation are emitted, use a separate shape:

```typescript
type CaseParentRef = {
  id: string;
  bank: string;
  topicRaw: string;
  topicNormalized: string;
  category: string;
  difficulty: string;
  embeddedPartIds: string[];
  sharedVisualKinds: string[];
};
```

Do not force a case parent into "ItemRef"; its location is intentionally outside that leaf-only union.

---

## Topic handling

Preserve all of:

- raw topic;
- mechanically normalized topic;
- every raw label variant grouped into that mechanical bucket;
- top-level standalone count;
- embedded-part count;
- total graded-leaf count.

Mechanical topic normalization must match the current executable normalization unless the artifact explicitly declares and tests a different one.

Do not silently merge semantic synonyms.

Examples of potentially equivalent labels may be emitted as:

```typescript
type SemanticMergeProposal = {
  normalizedBuckets: string[];
  rawVariants: string[];
  reason: string;
  evidence: ItemRef[];
  requiresHumanReview: true;
};
```

Semantic merge proposals must never alter the mechanical counts used in the primary inventory.

---

## Mechanically defined review signals

Do not use undefined terms such as "near-duplicate," "dominant," or "smallest coverage loss."

### Dominant distribution cell

A cell is dominant when it has the maximum count in the exact declared cohort. Ties remain ties.

For retirement-review ordering, an item receives "dominantCellRank: 0" only when it contributes to a dominant cell in a scope whose disposition is "content_candidate". Dominance in a low-n, boundary-only, passing, or merely diagnostic cohort does not make an item distribution-relevant.

### Category surplus

Calculate against the current "NCLEX_CATEGORY_WEIGHTS" applied to the relevant declared population. Report the count and ratio; do not treat surplus as proof that an item is expendable.

Use the signed ratio:

```
categorySurplusRatio =
  (currentCategoryCount - categoryTarget) / categoryTarget
```

Positive values are surplus and negative values are shortfall. For retirement-review ordering, calculate this over "graded_leaves".

### Topic saturation

For an exact mechanically normalized topic, report:

- standalone count;
- embedded count;
- graded-leaf count;
- same-item-type count;
- same-category count;
- same-difficulty count.

There is no authoritative topic target. "Topic saturation" is a descriptive signal only.

### English-stem similarity signal

For review-priority purposes only:

1. lower-case "stem.en";
2. replace non-alphanumeric characters with spaces;
3. split on whitespace;
4. remove a fixed, recorded English stop-word set;
5. remove tokens shorter than three characters;
6. deduplicate tokens;
7. compute Jaccard similarity.

Report the maximum similarity against another item in the same mechanical topic and item type.

Calculate similarity over "graded_leaves". If no neighbor exists, emit "maxSimilarity: null" and an empty neighbor list rather than coercing the value to zero.

This is not a semantic duplicate verdict.

### Coverage-loss signal

For each hypothetical removal, calculate whether it would reduce any exact bucket from "1" to "0" for:

- mechanical topic × item type;
- category × item type;
- topic × difficulty;
- visual kind;
- skill signature, when present.

Calculate removal coverage over "graded_leaves". For an embedded part, only its direct leaf visual may disappear; shared parent-case exhibits remain and must not be counted as removed.

Use:

```typescript
type CoverageImpact = {
  dimension:
    | "topic_item_type"
    | "category_item_type"
    | "topic_difficulty"
    | "visual_kind"
    | "skill_signature";
  value: string;
  beforeCount: number;
  afterRemovalCount: number;
  becomesZero: boolean;
};
```

### Retirement-review priority

Codex does not decide retirement.

Produce a deterministic review tuple, not a clinical verdict:

1. embedded case part last;
2. contributes to a declared dominant distribution cell first;
3. higher exact topic × item-type count first;
4. higher category surplus ratio first;
5. fewer zero-producing coverage impacts first;
6. higher stem-similarity signal first;
7. item ID ascending.

Output every component of the tuple.

Encode the tuple components explicitly:

```typescript
type ReviewPriorityComponents = {
  locationRank: 0 | 1; // 0 top-level standalone, 1 embedded part
  dominantCellRank: 0 | 1; // 0 contributes to a dominant cell, 1 does not
  topicItemTypeCount: number;
  categorySurplusRatio: number;
  zeroProducingCoverageImpactCount: number;
  maxStemJaccard: number | null;
  itemId: string;
};
```

Sort by "locationRank" ascending, "dominantCellRank" ascending, "topicItemTypeCount" descending, "categorySurplusRatio" descending, "zeroProducingCoverageImpactCount" ascending, "maxStemJaccard" descending with null last, then "itemId" ascending.

Label results:

- "review_candidate"
- "case_level_review_only"
- "not_distribution_relevant"

Never label an item "retire".

---

## Remediation simulation rules

For every simulated change, report:

```typescript
type ProjectedMetricEffect = {
  targetScopeId: string;
  check: string;

  operation:
    | "remove"
    | "replace"
    | "add"
    | "audit_policy_change";

  routingDisposition: RoutingDisposition;
  routingTrace: RoutingTrace;

  assumptions: string[];

  before: {
    nativeVerdict: string;
    effectiveVerdict: string;
    n: number;
    metrics: Record<string, unknown>;
  };

  after: {
    nativeVerdict: string;
    effectiveVerdict: string;
    n: number;
    metrics: Record<string, unknown>;
  };

  conditional: boolean;
  clearsNativeFinding: boolean;
  clearsEffectiveFinding: boolean;

  requiresClaudeRuling: boolean;
};
```

A simulation must not claim to clear an effective global finding unless it accounts for all inherited failing banks.

---

## Ordinary standalone commission ranking

The ordinary expansion manifest must contain exactly 15 commissioned units, which satisfies the allowed 12–18 range, where:

"sum(count for purpose == "bank_expansion") == 15".

Distribution-remediation replacements do not count toward this total.

### Eligible item types

Ordinary expansion may rank:

- "bowtie"
- "highlight"
- "fill_in_blank"
- "ordered_response"
- "dropdown_cloze"

Do not rank ordinary:

- "multiple_choice"
- "select_all"
- "case_study"

Use "matrix" only when a specific, mechanically demonstrated format gap remains after the preferred types are considered. Mark such rows for Claude review.

### Eligibility gate

Reject a proposed cell before ranking when:

- the item type is invalid for the proposed visual kind;
- the proposal depends on a visual placement not supported by the current registry/schema;
- the proposal requires writing to a frozen canonical bank;
- the topic exists only through an unreviewed semantic merge;
- the requested format is mechanically shown to be incompatible with the topic's existing content.

When a closed-world, gradeable use is not mechanically established, retain the row only as a conditional opportunity with "requiresContentJudgment: true" and "requiresClaudeRuling: true". Do not invent the clinical scenario and do not include the row in a production-ready subset.

### Candidate universe and allocation

Construct the candidate universe deterministically:

1. take every mechanically observed "topicNormalized × category" pair in "commissionable_standalone";
2. cross each pair with the five preferred eligible item types;
3. add "matrix" candidates only if fewer than 15 preferred-type candidates survive the structural eligibility gates;
4. choose exactly one difficulty for each "topicNormalized × category × itemType" candidate using the difficulty-selection rule below;
5. rank the resulting candidates using the lexicographic target function;
6. select the first 15 candidates;
7. emit each selected row with "count: 1";
8. emit at most one row for any exact "topicNormalized × category × itemType" key.

Conditional content-judgment rows may count toward the 15-unit opportunity envelope, but must be clearly separated from any production-ready subset. If fewer than 15 candidates survive even with conditional rows, stop with an incomplete handoff rather than relaxing the gates.

For "topicRawTarget", choose the most frequent raw label for that mechanical topic in "commissionable_standalone"; break count ties lexically.

For ordinary bank-expansion rows, set "visualPolicy.mode" deterministically:

- use "no_visual" when the exact "topicNormalized × category" neighbors have no direct question visuals;
- use "optional_existing_kind" when those neighbors contain direct question visuals, with "allowedKinds" equal to the sorted intersection of observed kinds and kinds permitted on the proposed item type;
- never set "required_existing_kind" from mechanical counts alone; that mode requires Claude's content ruling.

If observed neighboring visuals exist but the permitted-kind intersection is empty, reject the visual proposal and retain only a conditional "no_visual" row requiring content judgment.

### Deterministic lexicographic target function

Do not use an unexplained weighted score.

For every eligible topic × item-type × category candidate after its single difficulty has been selected, calculate:

1. "itemTypeDeficitRatio"
2. "topicItemTypeCount"
3. "categoryShortfallRatio"
4. "topicTypeDifficultyCount"
5. "topicTotalStandaloneCount"
6. stable lexical tie-break fields

Definitions:

```
standaloneTypeTarget =
  commissionable_standalone.length / number_of_standalone_item_types

itemTypeDeficitRatio =
  max(0, standaloneTypeTarget - currentStandaloneTypeCount)
  / standaloneTypeTarget

categoryTarget =
  NCLEX_CATEGORY_WEIGHTS[category] * commissionable_standalone.length

categoryShortfallRatio =
  max(0, categoryTarget - currentStandaloneCategoryCount)
  / categoryTarget
```

"number_of_standalone_item_types" means the length of the live "standaloneItemTypes" enum, including types excluded from this ordinary expansion batch. Do not use the size of the preferred-type subset.

Count definitions use "commissionable_standalone":

- "topicItemTypeCount" is the count for the exact "topicNormalized × itemType" pair across categories;
- "topicTypeDifficultyCount" is the count for the exact "topicNormalized × itemType × selected difficulty" tuple across categories;
- "topicTotalStandaloneCount" is the total for "topicNormalized" across all standalone item types and categories.

Sort eligible cells by:

1. "itemTypeDeficitRatio" descending;
2. "topicItemTypeCount" ascending;
3. "categoryShortfallRatio" descending;
4. "topicTypeDifficultyCount" ascending;
5. "topicTotalStandaloneCount" ascending;
6. "topicNormalized" ascending;
7. "itemType" ascending;
8. "difficulty" ascending.

This is a mechanical demand ranking, not a claim that the highest row is clinically the best possible question.

Preserve all input counts used in the ranking.

### Difficulty selection

For an otherwise identical topic × item-type cell:

- prefer a difficulty absent from that exact cell;
- then prefer the least represented difficulty;
- use lexical order only as the final tie-break.

Apply this selection within the exact "topicNormalized × category × itemType" candidate before the main candidate sort. This rule selects one difficulty; it does not create three separately rankable rows.

Do not infer that "hard" is inherently more valuable.

---

## Commission-manifest schema

```typescript
type CommissionManifest = {
  provenance: Provenance;

  remediation: CommissionRow[];
  bankExpansion: CommissionRow[];

  expansionUnitCount: number;

  semanticMergeProposals: SemanticMergeProposal[];

  unresolvedArchitecturalQuestions: Array<{
    id: string;
    question: string;
    evidence: string[];
    affectedScopes: string[];
  }>;
};

type CommissionRow = {
  purpose: "distribution_remediation" | "bank_expansion";

  count: number;

  itemType: string;
  category: string;
  difficulty: string;

  topicRawTarget: string;
  topicNormalized: string;
  topicLabelVariants: string[];

  optionCount: number | null;
  correctCountEnvelope: number[] | null;
  sequenceLengthEnvelope: number[] | null;

  templateConstraint: {
    mode:
      | "none"
      | "semantic_diversity_only"
      | "post_promotion_acceptance";
    prohibitedProducerControl: boolean;
    conditionalProjection: ConditionalTemplateProjection | null;
  };

  replacementCandidateIds: ItemRef[];

  preserveCoverage: CoverageImpact[];

  avoidNeighborIds: ItemRef[];

  visualPolicy: {
    mode:
      | "no_visual"
      | "optional_existing_kind"
      | "required_existing_kind";
    allowedKinds: string[];
    placementValidated: boolean;
    governingSource: string;
  };

  mechanicalEvidence: {
    population: string;
    itemTypeDeficitRatio: number | null;
    topicItemTypeCount: number;
    categoryShortfallRatio: number | null;
    topicTypeDifficultyCount: number;
    topicTotalStandaloneCount: number;
    reviewPriorityComponents: ReviewPriorityComponents | null;
  };

  reason: string;

  projectedMetricEffects: ProjectedMetricEffect[];

  routingDisposition: RoutingDisposition;
  routingTrace: RoutingTrace;
  productionReadiness:
    | "mechanically_eligible"
    | "conditional_content_judgment";
  requiresContentJudgment: boolean;
  requiresClaudeRuling: boolean;
};
```

---

## Provenance schema

Every JSON artifact must contain:

```typescript
type Provenance = {
  artifactVersion: "1.0";
  generatedAt: string;

  headSha: string;
  branch: string;

  auditVersion: string;
  auditConfigHash: string;

  generator: {
    path: string;
    command: string;
    generatorSha256: string;
  };

  commands: Array<{
    command: string;
    exitCode: number;
    note: string;
  }>;

  inputBanks: Array<{
    path: string;
    sha256: string;
    topLevelQuestionCount: number;
    standaloneCount: number;
    caseParentCount: number;
    embeddedPartCount: number;
    gradedLeafCount: number;
  }>;

  populationDefinitions: Record<string, string>;

  reconciliation: {
    topLevelStandalone: number;
    caseParents: number;
    embeddedParts: number;
    topLevelTotal: number;
    gradedLeaves: number;
    commissionableStandalone: number;
    equationPassed: boolean;
  };
};
```

For byte reproducibility, set "generatedAt" to the HEAD commit's committer timestamp, obtained from Git, rather than wall-clock time. The value is an artifact snapshot timestamp, not a claim about when the command happened.

Populate "commands" only from commands the generator itself executes and captures. At minimum, it must capture "npm run census:check" and "npm run audit" with their real exit codes. The outer final-verification reruns are reported in the final handoff and need not be retroactively inserted into already-generated JSON.

---

## Required artifacts

### "generate-content-demand.ts"

A reproducible generator implementing the declared populations, metrics, simulations, and ranking.

It must:

- use deterministic sorting;
- use no network access;
- record hashes and provenance;
- fail on reconciliation mismatch;
- fail on unknown item types or missing required metadata rather than silently dropping records.

### "distribution-inventory.json"

Contains:

- provenance;
- population reconciliation;
- native/effective audit dispositions;
- SATA cohorts;
- ordered-response cohorts;
- complete item references;
- routing-aware simulations;
- review-priority candidates.

### "distribution-inventory.md"

Human-readable explanation separating:

- native failures;
- inherited failures;
- low-n impossibility;
- canonical-boundary artifacts;
- genuinely concentrated cohorts;
- conditional remediation envelopes;
- questions requiring Claude.

### "content-commission-manifest.json"

Conforms to the exact manifest schema above.

### "CONTENT-DEMAND-HANDOFF.md"

A concise handoff for Claude stating:

- mechanically established facts;
- audit findings that are native;
- audit findings that are inherited;
- low-n cohorts that cannot pass;
- findings blocked by canonical routing;
- candidate items requiring content review;
- the exact 15-unit ordinary expansion envelope;
- every unresolved architectural decision.

---

## Specific required conclusions to test, not assume

Confirm or refute from live disk:

1. the global ordered-response native distribution passes;
2. its current effective failure is inherited;
3. "lab-canonical" contains four ordered-response items;
4. those four items have four different promoted templates;
5. the lab failure is therefore caused by the current low-n threshold behavior rather than repeated templates;
6. ordinary new lab-trend content routes to "visual-canonical.json";
7. such additions cannot clear "lab-canonical"'s native finding;
8. small SATA banks fail primarily because all mathematically possible correct-count bins are required without a minimum-n guard.

Do not create a remediation commission from any of these claims until they are verified.

---

## Stop conditions

Stop and return an incomplete handoff rather than manufacturing recommendations when:

- census state is stale;
- population reconciliation fails;
- live audit version or config cannot be reproduced;
- current routing cannot be determined;
- an output would require a silent semantic topic merge;
- a proposed audit-clearing item would need clinically unnatural answer structure;
- an embedded part appears to require independent retirement;
- clearing a warning would require deleting useful content only to make the cohort "INSUFFICIENT";
- a projection depends on manipulating an item ID or pre-promotion order;
- changed files escape the designated audit directory.

---

## Final verification

Run:

- "npm run census:check"
- "npm run audit"
- "npx tsx audit/content-demand-2026-07-14/generate-content-demand.ts"
- rerun the generator and confirm byte-identical generated outputs, including the fixed HEAD-derived timestamp
- "git diff --check"
- "git status --short"

Report:

- HEAD SHA;
- commands and exit codes;
- reconciliation totals;
- changed-file list;
- confirmation that all changed paths are under the designated audit directory;
- confirmation that no bank, audit code, census, ledger, or governance file changed.
