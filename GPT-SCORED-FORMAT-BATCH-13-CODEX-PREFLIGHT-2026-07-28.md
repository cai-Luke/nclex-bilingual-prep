# GPT Scored-Format Batch 13 — Codex Feasibility Preflight

**Date:** 2026-07-28  
**Role:** Codex feasibility reviewer, not content producer  
**Scope:** Persist a cleared manifest and preflight report only  
**Prohibited:** Do not author question JSON, polished learner-facing stems, choices, rationales, translations, or raw bank files

## Objective

Design a small, collision-resistant scored-format roster for a later GPT authoring session. This turn ends after Codex has persisted an evidence-backed manifest that another model can follow without choosing, substituting, or materially changing constructs.

This is a hard role boundary:

- Codex decides whether a construct cleanly fits its interaction.
- Codex checks the live corpus and authoritative source before clearing it.
- GPT will author only the cleared rows in a later, separate session.
- The producer may not add, substitute, merge, split, or materially revise a cleared row.
- The producer may not change a cleared row's question ID, item type, category, topic, difficulty, NGN skill, tested decision, scenario contract, interaction contract, source scope, or correct-position plan.
- If authoring reveals that a cleared row is not safely executable, the producer must omit that row, mark it `RETURN_TO_PREFLIGHT`, and explain the blocking issue. Only a new Codex preflight may revise or replace it.
- The producer must never preserve a target count by weakening, replacing, or silently altering a row.

Codex may write terse reviewer-facing clinical facts, intended keys, evidence classes, action labels, formulas, distractor classes, and scenario boundaries as needed for feasibility proof. It must not turn them into polished learner-facing English or Chinese question copy.

Read the failed Batch 12 archive before beginning:

- `Archive/gpt-scored-format-batch-12-failed-2026-07-28/README.md`
- `Archive/gpt-scored-format-batch-12-failed-2026-07-28/GPT-SCORED-FORMAT-BATCH-12-CODEX-COMMISSION-2026-07-27.md`

## Live-repository read order

1. `AGENTS.md`
2. `docs/AGENTS-RUNBOOK.md`
3. `PROJECT-HISTORY.md`
4. `NCLEX-Question-Schema.md`
5. `BANK-CENSUS.md`
6. `BANK-REVIEW-LEDGER.md`
7. `src/types.ts`
8. `src/schema.ts`
9. `src/grading.ts`
10. `src/topics.ts`
11. `lib/canonical-routing.ts`
12. all top-level `banks/*.json`
13. all live files under `banks/banks-raw/`

Record the branch, commit, and relevant dirty-worktree state. Do not assume the local snapshot matches a remote repository.

## Recovery-batch constraints

Target 10–14 `CLEAR` standalone, nonvisual scored questions. Fewer than 10 is acceptable if fewer candidates meet the standard. Prefer quality and clean interaction fit over filling the target.

Allowed item types:

- `bowtie`
- `highlight`
- `fill_in_blank`
- `dropdown_cloze`

Do not propose `ordered_response` in this recovery batch. Batch 12 demonstrated that emergency care with concurrent or conditional actions is a poor source of forced serial order. A future ordered-response batch requires its own protocol-first feasibility exercise.

Additional hard constraints:

- no case studies;
- no visuals;
- no `multiple_choice`, `select_all`, or `matrix`;
- use only exact category/topic pairs licensed by the current `src/topics.ts`;
- use current schema vocabulary and field semantics;
- assign and lock a globally unique full question ID for every cleared row;
- do not reuse a tested equation merely by changing numbers, medication, patient, setting, output time unit, or algebraic arrangement;
- do not use a general guideline to invent an exact multi-segment highlight key;
- do not force a bowtie when the construct naturally supplies only one nursing action;
- do not clear a multi-record cloze when the records repeat one decision three times;
- exclude any candidate whose clean divergence cannot be explained in one precise sentence;
- do not retain a candidate merely to satisfy an item-type, topic, or difficulty target.

Batch-shape preferences, applied only after individual feasibility:

- prefer at least 2 cleared rows from each allowed item type;
- prefer no more than 4 cleared rows from any one item type;
- prefer no more than 3 hard rows;
- prefer medium over hard when the tested decision and reasoning burden do not justify hard difficulty.

These are roster-shape preferences, not clearance quotas. Report any deviation; never retain a weak row to satisfy them.

Use current scored-leaf topic and item-type needs only as tie-breakers after interaction fit, source support, and collision resistance. Census targets are not quotas.

## Required candidate proof

For every candidate considered, record:

1. candidate identifier and proposed full question ID;
2. exact learner decision;
3. item type, difficulty, category, topic, and NGN skill;
4. one-sentence difficulty rationale based on learner reasoning burden, not clinical severity or urgency;
5. concise coverage rationale;
6. exact scenario contract;
7. exact interaction proof;
8. closest current comparator IDs, or an explicit no-comparator result;
9. material semantic divergence;
10. search terms and corpus surfaces examined;
11. authoritative source URL and exact section;
12. the precise claim or rule each source supports;
13. disposition: `CLEAR`, `REPLACE`, or `BLOCK`;
14. concise reason for the disposition.

`REPLACE` is not a clearance state. A replacement must receive a new candidate identifier and proposed question ID and must undergo the complete proof above. It may enter the manifest only after receiving its own `CLEAR` disposition.

### Scenario-contract proof

For every candidate, lock the minimum reviewer-facing scenario envelope needed to preserve the construct:

- population;
- setting;
- required clinical facts, including exact values or timing when they are load-bearing;
- prohibited added facts that would create a second independently urgent problem or change the decision;
- prohibited answer leakage;
- source and scope boundaries.

The scenario contract should be specific enough that the later producer does not need to choose new clinical facts, but terse enough that Codex is not drafting the learner-facing item.

### Bowtie proof

Name the proposed:

- one condition;
- two non-duplicative nursing actions;
- two parameters that evaluate different necessary dimensions.

For each action and parameter, identify the exact source claim that supports it.

Reject the construct if:

- an action merely restates a monitoring parameter;
- the two actions are normally concurrent versions of the same intervention;
- the two parameters evaluate the same clinical dimension;
- the source more naturally supports only one action;
- the condition is already explicitly named in the scenario contract;
- the second action or parameter exists only to satisfy bowtie cardinality.

### Highlight proof

State the exact selection rule. Describe each intended keyed evidence class and why removing it would discard distinct decision-relevant information.

Also identify plausible near-miss evidence classes at the same decision level. Do not draft polished segments.

Reject the construct if:

- a sentence directly states the conclusion;
- a calculated or interpreted result is supplied when raw data are meant to be analyzed;
- one keyed segment makes the other keyed segments unnecessary;
- two keyed segments merely restate the same evidence;
- the source supports only a broad assessment rather than the exact selection boundary;
- no clinically plausible near-miss evidence exists.

### Fill-in-blank proof

Record a complete equation signature containing:

- exact inputs;
- formula;
- requested result;
- conversions;
- rounding;
- displayed unit;
- representative independent recomputation;
- equivalent forms searched.

Search for the complete mathematical construct, including equivalent daily/hourly, rearranged, normalized, or differently wrapped forms. Changing only values, clinical wrapper, medication, patient, setting, algebraic arrangement, or output unit is a blocking collision.

Do not add a reference threshold or clinical interpretation unless that interpretation is itself scored, necessary to the tested decision, and precisely sourced. If the item scores only the number, omit unnecessary interpretation from the contract.

### Dropdown-cloze proof

Use three genuinely independent records only when each record tests a distinct decision within one narrow subtopic. Provide a three-row evidence-partition table demonstrating that:

- each record contains all evidence needed for its own answer;
- no record or answer reveals another;
- the three records do not repeat the same decision with different patients;
- each record has plausible distractor classes at the same decision level.

For every three-record item, preassign correct-option positions so positions 1, 2, and 3 are each used exactly once. The later producer must preserve this plan. The manifest's `dropdownCorrectPositionPlan` must match the per-record position assignments.

Reject distractors based on silent unsafe compliance, personal attacks, abandonment, obviously irrelevant follow-up, impossible care settings, or other caricatures.

## Collision standard

Search:

- bundled top-level questions;
- embedded scored case-study leaves;
- all live raw drafts;
- formulas, cue clusters, action maps, thresholds, outcome decisions, and multi-record decision sets;
- not just diagnoses or surface wording.

A new population, diagnosis label, clinical setting, numerical value, medication, output unit, or prose wrapper is not semantic divergence.

For each candidate, record the actual search terms and corpus surfaces examined. Record at least one nearest comparator when a relevant family exists. If none is found, explicitly record the searches that produced no comparator and summarize why the construct appears corpus-distinct.

Known blocked Batch 12 patterns must not return:

- fetal tachysystole/minimal-variability/late-deceleration highlighting;
- pediatric maintenance-fluid equations equivalent to the existing daily calculation;
- ulipristal five-day restart/seven-day backup follow-up;
- generic bacterial-contamination transfusion response;
- generic post-ECT recovery/reflex recognition;
- palliative opioid dyspnea/toxicity;
- parenteral-nutrition refeeding bowties;
- DKA resolution/transition/overlap;
- remaining-infusion-time calculations;
- Winter's-formula expected-PaCO₂ calculations.

## Source standard

Use current authoritative primary or first-party sources: government guidance, professional guidelines, official prescribing information, or a source that owns the relevant operational standard.

Open and read the exact section. A source pin must support the keyed decision or interaction element—not merely the diagnosis, background topic, or a broader duty to assess.

A candidate may use more than one source when different key-bearing elements require separate authority. Map each condition, action, parameter, evidence class, formula rule, or record decision to the source claim that supports it.

For every source, record:

- organization;
- document;
- publication, revision, or version date when available;
- access date;
- exact section, table, recommendation, or label subsection;
- URL;
- precise supported claim;
- population and setting scope;
- material limitations or local-protocol dependencies.

Do not clear:

- an unstated numeric cutoff;
- a local threshold invented for convenience;
- a universal order derived from concurrent recommendations;
- a precise multi-key boundary inferred from general prose;
- a clinical interpretation added to an otherwise numerical item without need;
- an action, parameter, or record decision supported only by a source that establishes the diagnosis or general topic.

## Persisted deliverables

Create exactly two files:

1. `GPT-SCORED-FORMAT-BATCH-13-CODEX-PREFLIGHT-REPORT-2026-07-28.md`
2. `GPT-SCORED-FORMAT-BATCH-13-CLEARED-MANIFEST-2026-07-28.json`

The report contains every candidate considered, including blocked candidates, replaced candidates, and the full proof for every replacement.

The JSON manifest contains only `CLEAR` rows. It is the later producer's binding authorization artifact.

Use this top-level shape:

```json
{
  "manifestVersion": 1,
  "batchId": "gpt-scored-format-batch-13",
  "status": "CLEARED_FOR_SEPARATE_GPT_AUTHORING_SESSION",
  "reviewer": "Codex",
  "snapshot": {
    "branch": "",
    "commit": "",
    "relevantDirtyState": []
  },
  "authoringContract": {
    "plannedRawFilename": "gpt-format13-scored-recovery-2026-07-28.json",
    "producerMayAddRows": false,
    "producerMaySubstituteRows": false,
    "producerMayMateriallyReviseRows": false,
    "producerMayOmitUnsafeRow": true,
    "omittedRowDisposition": "RETURN_TO_PREFLIGHT"
  },
  "constraints": {
    "standaloneOnly": true,
    "noVisuals": true,
    "allowedItemTypes": [
      "bowtie",
      "highlight",
      "fill_in_blank",
      "dropdown_cloze"
    ]
  },
  "rows": [
    {
      "row": 1,
      "questionId": "gpt_format13_...",
      "itemType": "",
      "difficulty": "",
      "difficultyRationale": "",
      "category": "",
      "topic": "",
      "ngnSkill": "",
      "coverageRationale": "",
      "exactDecision": "",
      "scenarioContract": {
        "population": "",
        "setting": "",
        "requiredFacts": [],
        "prohibitedAddedFacts": [],
        "prohibitedLeakage": [],
        "scopeBoundaries": []
      },
      "interactionContract": {
        "kind": ""
      },
      "collisionSearch": {
        "searchTerms": [],
        "corpusSurfaces": [],
        "closestComparators": [
          {
            "id": "",
            "relationship": "",
            "materialDivergence": ""
          }
        ],
        "noComparatorSummary": null
      },
      "sources": [
        {
          "id": "S1",
          "organization": "",
          "document": "",
          "publicationOrVersionDate": "",
          "accessedDate": "2026-07-28",
          "section": "",
          "url": "",
          "supportedClaim": "",
          "populationScope": "",
          "settingScope": "",
          "scopeLimitations": ""
        }
      ],
      "sourceCoverage": [
        {
          "contractElement": "",
          "sourceIds": ["S1"],
          "supportedClaim": ""
        }
      ],
      "dropdownCorrectPositionPlan": null
    }
  ],
  "totals": {
    "questions": 0,
    "byItemType": {},
    "byDifficulty": {},
    "byCategory": {}
  }
}
```

If no relevant comparator is found, `closestComparators` may be empty only when `noComparatorSummary` is a non-empty string describing the unsuccessful search and why the construct appears distinct. Otherwise `noComparatorSummary` must be `null`.

Use `dropdownCorrectPositionPlan` only for dropdown rows. It must be a row-specific permutation of `[1, 2, 3]` and must exactly match the correct positions assigned to the three records inside the dropdown interaction contract.

## Required interaction-contract shapes

The manifest must use the item-type-specific shape below. Do not leave `interactionContract` as an untyped prose note.

### Bowtie manifest contract

```json
{
  "kind": "bowtie",
  "condition": {
    "label": "",
    "distinguishingEvidenceClasses": []
  },
  "actions": [
    {
      "label": "",
      "distinctFunction": "",
      "sourceIds": []
    },
    {
      "label": "",
      "distinctFunction": "",
      "sourceIds": []
    }
  ],
  "parameters": [
    {
      "label": "",
      "evaluatedDimension": "",
      "sourceIds": []
    },
    {
      "label": "",
      "evaluatedDimension": "",
      "sourceIds": []
    }
  ],
  "nonDuplicationProof": "",
  "cardinalityNotForced": true
}
```

### Highlight manifest contract

```json
{
  "kind": "highlight",
  "selectionRule": "",
  "keyedEvidenceClasses": [
    {
      "evidenceClass": "",
      "distinctContribution": "",
      "removalEffect": "",
      "sourceIds": []
    }
  ],
  "nearMissEvidenceClasses": [],
  "directConclusionExcluded": true,
  "preinterpretedResultExcluded": true
}
```

### Fill-in-blank manifest contract

```json
{
  "kind": "fill_in_blank",
  "equationSignature": {
    "inputs": [],
    "formula": "",
    "requestedResult": "",
    "conversions": [],
    "rounding": "",
    "displayedUnit": "",
    "equivalentFormsSearched": []
  },
  "workedCheck": {
    "unroundedResult": null,
    "finalResult": null
  },
  "scoredInterpretation": null,
  "sourceIds": []
}
```

If interpretation is itself scored and precisely sourced, replace `scoredInterpretation: null` with an object containing the exact interpretation, source IDs, and necessity proof.

### Dropdown-cloze manifest contract

```json
{
  "kind": "dropdown_cloze",
  "narrowSubtopic": "",
  "records": [
    {
      "record": 1,
      "testedDecision": "",
      "requiredEvidence": [],
      "plausibleDistractorClasses": [],
      "correctPosition": 1,
      "sourceIds": []
    },
    {
      "record": 2,
      "testedDecision": "",
      "requiredEvidence": [],
      "plausibleDistractorClasses": [],
      "correctPosition": 2,
      "sourceIds": []
    },
    {
      "record": 3,
      "testedDecision": "",
      "requiredEvidence": [],
      "plausibleDistractorClasses": [],
      "correctPosition": 3,
      "sourceIds": []
    }
  ],
  "independenceProof": "",
  "crossRecordLeakageCheck": "",
  "correctPositionPlan": [1, 2, 3]
}
```

The record order and correct positions may vary, but the three positions must each appear exactly once.

## Mechanical verification before finishing

Validate the manifest as JSON and mechanically verify all of the following:

- `totals.questions` equals `rows.length`;
- all item-type, difficulty, and category totals recompute exactly from `rows`;
- every full question ID is unique and does not collide with a bundled top-level question or embedded scored leaf;
- every row uses an allowed item type;
- every category, topic, difficulty, and NGN skill uses exact live vocabulary;
- every category/topic pair is licensed by the live topic table;
- every row has the correct item-type-specific interaction-contract shape;
- every `sourceCoverage.sourceIds` value resolves to a source declared in the same row;
- every dropdown plan is a permutation of `[1, 2, 3]` and matches its three record assignments;
- no manifest row has a `REPLACE` or `BLOCK` disposition;
- the planned raw filename begins with `gpt-` and routes to the expected GPT canonical lane under the live routing contract.

Report the commands or script used for JSON parsing and total recomputation. Do not modify application or gate code merely to validate this one manifest.

## Stop condition

Stop after the two preflight artifacts are written and verified.

Do not:

- create files under `banks/banks-raw/`;
- draft polished learner-facing content;
- run promotion or consolidation;
- edit canonical banks;
- update the ledger, census, project history, schema, grading, routing, gate, or application code;
- begin the GPT authoring session.

The final response should report:

- the two files created;
- cleared-row count;
- blocked and replaced candidate counts;
- exact item-type, difficulty, and category totals;
- any batch-shape preference deviations;
- the recorded repository snapshot;
- confirmation that the manifest passed JSON parsing and mechanical recomputation;
- confirmation that no raw or canonical bank was created or changed.
