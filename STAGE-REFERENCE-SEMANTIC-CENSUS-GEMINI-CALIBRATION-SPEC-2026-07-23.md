# Stage-Reference Semantic Census — Deterministic Packet Build and Gemini Calibration

Date: 2026-07-23
Architect seat: GPT-5.6 Thinking
Status: **Stage A materialized; Gemini dispatch held for the frozen hidden-key attestation**
Purpose: classify the existing `revealsAllStages` advisory population without treating every fail-open case as an actual learner-answer leak

---

## 1. Commission summary

Project Shrimp currently reports a legacy population of case-study parts for which neither `answerableAfterStageId` nor `stageId` resolves. The live renderer is cumulative and fail-open: when neither anchor resolves, every declared case stage is visible for that part.

The current audit describes these rows as `revealsAllStages`, but the mechanical warning does **not** establish that every row leaks an answer. Some legacy cases may intentionally present a complete chart. Some expose later-looking information that does not help answer the active part. Others may reveal a diagnosis, treatment response, priority action, trend, or outcome that materially collapses the reasoning the part was meant to test.

This commission creates a complete deterministic evidence population and then assigns only the irreducible semantic comparison to Gemini:

> Given this part's exact response demand and key, does any stage exposed by the fail-open branch materially help the learner answer the part?

The work is deliberately split:

1. **Stage A — deterministic preparation, owned by Codex.** Build the complete population, case-grouped evidence packets, packet validator, and calibration input. No semantic verdicts.
2. **Stage B — blind Gemini calibration.** Gemini reviews exactly 32 preselected target parts and writes one bounded classification per target. It cannot build scripts, alter the packet, inspect prior adjudications, or declare that it passed.
3. **Stage C — external scoring.** The owner and a non-Gemini checker score the frozen calibration output. Failure stops the commission. Passing authorizes the full candidate census.
4. **Stage D — full Gemini candidate census.** Fresh Gemini sessions process frozen case-grouped packets. Gemini produces candidate evidence, not final accepted dispositions.
5. **Stage E — deterministic reconciliation and capped independent review.** Code reconciles all rows. A non-Gemini checker reviews every Gemini `LEAK` and `REVIEW` row plus a deterministic sample of `NO_LEAK` rows.

No bank mutation, anchor insertion, case rewrite, fatal audit flip, governance change, commit, push, or merge is authorized by this specification.

---

## 2. Governing live behavior

The executable owners are:

- `src/examLayout.ts` — `getVisibleCaseStages`;
- `scripts/audit/audit-stage-refs.ts` — `StageReferenceFinding` and the canonical sweep;
- `scripts/tests/audit-stage-refs.ts` — renderer-path fixtures.

Current behavior to re-read from live disk before implementation:

1. If `answerableAfterStageId` resolves, stages `0..resolvedIndex` are visible.
2. Otherwise, if `stageId` resolves, stages `0..resolvedIndex` are visible.
3. Otherwise, all stages are visible.
4. A final-stage anchor is not a leak merely because all stages are visible.
5. An unstaged case has no staged information to hide.
6. The ordinary aggregate audit remains advisory; this commission does not change its fatality.

The current repository history reports 451 pre-existing `revealsAllStages` findings across the bundled banks, with zero unresolved references and zero `missingRequiredAnchor` findings in that snapshot. **That number is orientation only. Stage A must rederive the population from the current live banks and must not force reconciliation to 451 if the corpus has changed.**

Architectural boundaries:

- `DECISIONS.md` principle 23: stage presentation is a renderer concern; the case remains one top-level session question.
- `DECISIONS.md` principle 28: embedded parts are scored content-planning units, but the case is the delivery container.
- `DECISIONS.md` principle 3: code owns the complete population and mechanical null; model judgment is restricted to the capped semantic residual.
- `DECISIONS.md` principle 7: exact evidence and honest uncertainty outrank finding volume.

---

## 3. Role boundaries

### 3.1 Stage A producer: Codex

Codex may:

- read the complete repository;
- write task-local scripts and artifacts only under the authorized audit directory;
- reuse current parsing, schema validation, question population, structured-measurement serialization, visual stripping, and stage-reference utilities;
- run deterministic verification commands;
- prepare the blind calibration input.

Codex may not:

- assign a semantic leak verdict;
- insert or recommend stage anchors;
- edit a bank;
- decide that a complete-chart presentation is clinically appropriate;
- generate the external calibration key;
- score Gemini's output.

### 3.2 Stage B/D semantic worker: Gemini

Gemini receives only:

- this specification's Gemini-facing sections;
- `AGENTS.md`;
- the exact frozen packet or calibration input assigned for that run.

Gemini may:

- read the supplied case packet;
- classify each assigned target part directly from the complete packet evidence;
- cite packet-owned evidence IDs;
- use `REVIEW` when the intended stage boundary cannot be recovered safely.

Gemini may not:

- search other audit directories for prior dispositions;
- read the calibration key or external scoring notes;
- write or execute a classifier, regex sweep, prefilter, summarizer, validator, packet builder, append script, or report generator;
- assign defaults and override an exception list;
- infer a target count from prior reports;
- edit any packet or existing file;
- browse the web;
- recommend exact anchor mutations or rewrite learner-facing content;
- claim that the candidate census is independently accepted.

### 3.3 Calibration/checker seat

The owner plus one non-Gemini checker own:

- the hidden calibration key;
- calibration scoring;
- all final semantic acceptance;
- review of every candidate `LEAK` and `REVIEW` row;
- the deterministic sample of candidate `NO_LEAK` rows;
- any later implementation specification.

The same Gemini run may not score or revise itself after the key is revealed.

---

## 4. Authorized paths and blast radius

All task-owned artifacts live under:

```text
audit/stage-reference-semantic-census-2026-07-23/
```

Stage A expected artifacts:

```text
audit/stage-reference-semantic-census-2026-07-23/build-packets.ts
audit/stage-reference-semantic-census-2026-07-23/validate-gemini-output.ts
audit/stage-reference-semantic-census-2026-07-23/population.jsonl
audit/stage-reference-semantic-census-2026-07-23/population-summary.json
audit/stage-reference-semantic-census-2026-07-23/packet-manifest.json
audit/stage-reference-semantic-census-2026-07-23/packets/packet-###.json
audit/stage-reference-semantic-census-2026-07-23/calibration/selection-manifest.json
audit/stage-reference-semantic-census-2026-07-23/calibration/calibration-input.json
audit/stage-reference-semantic-census-2026-07-23/calibration/selection-review.md
audit/stage-reference-semantic-census-2026-07-23/calibration/shards/calibration-shard-###.json
audit/stage-reference-semantic-census-2026-07-23/calibration/hidden-key-freeze-attestation.template.json
audit/stage-reference-semantic-census-2026-07-23/calibration/hidden-key-freeze-attestation.json
audit/stage-reference-semantic-census-2026-07-23/preparation-delivery.md
```

Gemini calibration outputs:

```text
audit/stage-reference-semantic-census-2026-07-23/gemini/calibration-shards/calibration-shard-###.jsonl
audit/stage-reference-semantic-census-2026-07-23/gemini/calibration-shards/calibration-shard-###-run.json
audit/stage-reference-semantic-census-2026-07-23/gemini/calibration-output.jsonl
audit/stage-reference-semantic-census-2026-07-23/gemini/calibration-run.md
```

Only after calibration passes, full-run outputs may be created:

```text
audit/stage-reference-semantic-census-2026-07-23/gemini/batches/packet-###.jsonl
audit/stage-reference-semantic-census-2026-07-23/gemini/delivery.md
audit/stage-reference-semantic-census-2026-07-23/adjudication-candidate.jsonl
audit/stage-reference-semantic-census-2026-07-23/candidate-report.md
```

Everything else is read-only.

Explicit prohibitions:

- no changes to `banks/**`;
- no changes to `src/**`, `lib/**`, `scripts/**`, package scripts, CI, schema, runtime, tests, prompts, ledgers, census, history, or governance;
- no cleanup of unrelated untracked files;
- no commit, push, branch switch, merge, stash, reset, or worktree normalization;
- no external clinical research;
- no output outside the authorized audit directory.

At task start and end, record branch, HEAD, changed paths, and SHA-256 hashes of every bundled `banks/*.json` file. A bank hash change during Stage A or any Gemini run is a hard stop: `BLOCKED_CONCURRENT_BANK_CHANGE`.

---

## 5. Stage A — deterministic population

### 5.1 Source population

Parse and strictly validate every bundled top-level `banks/*.json` file using current repository utilities.

Call the existing stage-reference finding logic rather than recreating the renderer rule by prose. Select exactly the live findings whose kind is:

```text
revealsAllStages
```

One target row corresponds to one unique tuple:

```text
bankPath | parentCaseId | embeddedPartId
```

If the same tuple is emitted more than once, fail. If an audit finding cannot be resolved back to exactly one live parent case and embedded part, fail.

Do not include:

- `unresolved` findings as separate semantic targets;
- `missingRequiredAnchor` findings;
- unstaged cases;
- parts whose primary or legacy anchor resolves;
- standalone questions;
- case containers as target rows.

The packet must still preserve any unresolved anchor state attached to a selected target because it is relevant provenance, but the semantic unit is the unique target part.

### 5.2 Population order

Sort deterministically by:

1. bundled bank filename;
2. top-level case index within the bank;
3. embedded part index within the case;
4. parent case ID;
5. embedded part ID.

Assign `queueIndex` starting at `1` after sorting.

A second run against unchanged bank hashes must reproduce `population.jsonl`, `population-summary.json`, `packet-manifest.json`, every packet byte, and the calibration input byte-for-byte.

### 5.3 `population.jsonl` minimum fields

Each compact row must include:

```json
{
  "queueIndex": 1,
  "bankPath": "banks/example-canonical.json",
  "bankSha256": "...",
  "parentCaseId": "case_id",
  "partId": "case_part_id",
  "casePath": "questions[12]",
  "partPath": "questions[12].caseStudy.questions[2]",
  "partOrdinal": 3,
  "casePartCount": 6,
  "itemType": "matrix",
  "anchorState": {
    "answerableAfterStageId": {"status": "absent"},
    "stageId": {"status": "absent"}
  },
  "declaredStageIds": ["baseline", "follow_up"],
  "rendererVisibleStageIds": ["baseline", "follow_up"],
  "packetId": "packet-001"
}
```

Identity, paths, ordinals, anchor states, and stage IDs must be derived from live parsed objects, not regex over serialized JSON.

---

## 6. Stage A — case-grouped evidence packets

### 6.1 Grouping and size

Keep every target from the same parent case in the same packet. Never split one case across packets.

Pack complete cases in deterministic order until adding the next case would exceed either limit:

- 20 target parts; or
- 300,000 UTF-8 bytes in the final compact packet JSON.

An oversized single case receives its own packet and must be reported as `oversizedSingleCase: true`; it is not silently truncated.

The packet builder must not omit evidence merely to meet the byte limit.

### 6.2 Packet structure

Each packet is one JSON object:

```json
{
  "packetVersion": "1.0",
  "packetId": "packet-001",
  "bankSnapshotSha256": "...",
  "targetCount": 8,
  "cases": []
}
```

Each case appears once and contains:

- bank path and bank hash;
- parent case ID and exact JSON path;
- case stem, title, and optional summary in English and Chinese;
- all global exhibits;
- all declared stages in authored order;
- every stage title and every stage exhibit;
- all embedded part outlines in authored order;
- complete evidence for each target part;
- one packet-local evidence catalog.

### 6.3 Learner-visible stage projection

Each stage exhibit must preserve all learner-visible information:

- title EN/ZH;
- prose content EN/ZH;
- serialized structured measurements EN/ZH using the current serializer;
- visual data with audit-only `meta` and `selfCheck` recursively removed, following the established rescue-prompt stripping behavior;
- exact stage and exhibit IDs;
- authored order.

Do not reduce a visual to its kind name. A graph, tracing, table, device, MAR, I/O record, structured lab panel, or other visual may contain the cue that causes or disproves leakage.

Do not use OCR or a screenshot-derived paraphrase. Preserve typed source data.

### 6.4 Target-part response projection

For every target part, include the complete keyed response surface appropriate to its item type:

- MC/SATA/ordered response: all options EN/ZH and exact `correct` IDs/order;
- fill-in-blank: every blank prompt, acceptable strings, numeric value, tolerance, and unit;
- matrix: all rows, columns, selection mode, and exact row-to-column key;
- dropdown cloze: `clozeStem`, every dropdown, all options, and exact key;
- highlight: every selectable/nonselectable segment and exact correct IDs;
- bowtie: prompts, all token pools, and exact condition/action/parameter keys;
- question visual, if present, stripped only of audit-only `meta`/`selfCheck`;
- `rationale.correct` EN/ZH;
- `rationale.byChoice` EN/ZH when present;
- `testTakingStrategy` EN/ZH.

The purpose is not to let Gemini re-grade the item. The key and rationale are supplied so it can determine whether an exposed stage directly reveals or strongly cues the intended answer.

### 6.5 Sibling-part outline

For every embedded part in the case, including non-target parts, include a compact outline:

- ordinal;
- ID;
- item type;
- stem EN/ZH;
- `answerableAfterStageId` and `stageId` values or null.

Do not include sibling answer keys unless the sibling is itself a target. The outline exists only to show authored progression and neighboring anchor patterns.

### 6.6 Evidence catalog

Free-form quotations caused prior model outputs to invent, reconstruct, or incompletely cite evidence. This commission uses packet-owned evidence IDs.

Every atomic learner-visible or key-bearing field needed for adjudication must be entered into an `evidenceCatalog` with:

```json
{
  "evidenceId": "case.case_id.stage.follow_up.exhibit.labs.structured.en.4",
  "surface": "STAGE",
  "stageId": "follow_up",
  "language": "en",
  "jsonPath": "questions[12].caseStudy.stages[1].exhibits[0]...",
  "text": "Serum potassium: 6.3 mEq/L"
}
```

Allowed `surface` values:

- `CASE_CONTEXT`
- `GLOBAL_EXHIBIT`
- `STAGE`
- `PART_STEM`
- `PART_RESPONSE`
- `PART_KEY`
- `PART_RATIONALE`
- `SIBLING_OUTLINE`

Rules:

1. Evidence IDs are deterministic and unique within the packet.
2. `text` is exact source text or a deterministic typed serialization.
3. English and Chinese receive separate evidence IDs.
4. Structured measurement rows become atomic evidence entries.
5. Visual scalar/object facts may be represented as stable JSON-pointer/value strings.
6. No LLM-authored paraphrase enters the catalog.
7. The packet validator must prove every target's referenced evidence IDs belong to its case.

Gemini cites evidence IDs rather than reproducing quotations. This makes nonexistent evidence mechanically rejectable.

---

## 7. Stage A — packet validation

`validate-gemini-output.ts` must validate both calibration and full-run outputs.

It must reject:

- missing, duplicate, extra, or out-of-order queue indices;
- identity fields that do not exactly match the population;
- unknown enum values;
- evidence IDs absent from the assigned packet;
- evidence IDs belonging to another case;
- `unsafeStageIds` not declared by the case;
- a `LEAK` row with no unsafe stage;
- a `LEAK` row without at least one stage evidence ID and one part/key/rationale evidence ID;
- any non-`LEAK` row with nonempty `unsafeStageIds`;
- a `REVIEW` row with an empty ambiguity explanation;
- empty or duplicated boilerplate reasons;
- any output path outside the authorized directory.

A reason string repeated verbatim on more than two rows in the same packet is a validation failure. This does not guarantee semantic quality; it prevents bulk-template substitution from masquerading as direct review.

The validator does **not** decide whether a semantic verdict is correct.

---

## 8. Closed Gemini adjudication contract

### 8.1 Review question

For each assigned target, answer in this order:

1. What exact clinical decision or response is this part testing?
2. Which currently visible stage facts are necessary to answer it?
3. Does any other exposed stage fact directly reveal the key, disclose the diagnosis/outcome, eliminate meaningful distractors, provide the post-intervention result, or otherwise materially reduce the reasoning required?
4. Is the case intentionally asking from a complete record, making full-stage visibility appropriate?
5. If the intended boundary cannot be recovered from the case, is `REVIEW` safer than certainty?
6. Is the leak parallel in English and Chinese, or present materially in only one language?

Do not classify from missing anchors alone. Every assigned row is already mechanically known to be fail-open.

### 8.2 Verdict vocabulary

Every row receives exactly one `verdict`:

- `LEAK`
  - at least one exposed stage materially helps answer the active part by disclosing or strongly cueing the keyed decision;
- `NO_LEAK_COMPLETE_RECORD`
  - the case or part intentionally asks the learner to reason from the complete staged record, or all declared stages function as the initial available chart for this part;
- `NO_LEAK_NONANSWERING_DATA`
  - later-looking stage data is exposed, but it does not materially help answer this part;
- `REVIEW`
  - the intended progression or dependency cannot be determined safely from the packet.

Do not invent additional verdicts.

### 8.3 Bilingual relation vocabulary

Every row receives exactly one `bilingualRelation`:

- `PARALLEL`
- `EN_ONLY_LEAK`
- `ZH_ONLY_LEAK`
- `MATERIAL_DIVERGENCE`
- `UNRESOLVED`

Sentence-count or punctuation differences alone are not material divergence.

### 8.4 Required output fields

Write one compact JSON object per target, in assigned order:

```json
{
  "queueIndex": 1,
  "packetId": "packet-001",
  "bankPath": "banks/example-canonical.json",
  "parentCaseId": "case_id",
  "partId": "part_id",
  "verdict": "LEAK",
  "testedDecision": "Identify the priority response to worsening respiratory status.",
  "requiredStageIds": ["baseline"],
  "unsafeStageIds": ["post_intervention"],
  "partEvidenceIds": [
    "case.case_id.part.part_id.response.key",
    "case.case_id.part.part_id.rationale.correct.en"
  ],
  "stageEvidenceIds": [
    "case.case_id.stage.post_intervention.exhibit.response.content.en"
  ],
  "bilingualRelation": "PARALLEL",
  "reason": "The post-intervention stage states that the keyed action resolved the deterioration, which confirms the intended priority before the learner answers the part. Baseline data alone supports the original inference without that outcome disclosure."
}
```

Requirements:

- `testedDecision`: one item-specific sentence, maximum 30 words;
- `requiredStageIds`: stages the part actually needs, or `[]` when global/baseline context alone is sufficient;
- `unsafeStageIds`: nonempty only for `LEAK`;
- `partEvidenceIds`: 1–4 IDs from part stem, response, key, or rationale;
- `stageEvidenceIds`: 1–6 IDs from the most relevant stages;
- `reason`: 1–3 item-specific sentences;
- no replacement prose;
- no exact anchor recommendation;
- no bank operation;
- no confidence score;
- no aggregate totals inside batch files.

For `NO_LEAK_NONANSWERING_DATA`, cite the most plausible exposed stage cue and explain why it does not resolve the tested decision.

For `NO_LEAK_COMPLETE_RECORD`, cite the case/part language or stage structure establishing that the complete record is the intended evidence surface.

For `REVIEW`, cite the conflicting evidence and state exactly what boundary cannot be recovered.

---

## 9. Stage B — blind 32-row calibration

### 9.1 Calibration selection

After the complete population and packets are frozen, the architect/checker selects exactly 32 target rows.

Selection must be case-diverse and include, where available:

- early, middle, and closing parts;
- two-stage and multi-stage cases;
- prose-only, structured-measurement, and visual-bearing stages;
- direct outcome disclosure;
- diagnosis or condition disclosure;
- action/priority disclosure;
- trend/comparator disclosure;
- complete-record controls;
- exposed but nonanswering future-data controls;
- genuinely ambiguous progression.

No class labels, target distribution, prior verdicts, or owner rationale appear in `calibration-input.json`.

The 32 rows must span at least 12 parent cases unless the current population cannot support that requirement. No parent case contributes more than four calibration targets.

The architect records the selected identities in `calibration/selection-manifest.json`; Codex then materializes `calibration-input.json` from that frozen manifest without adding or interpreting rows. The selection manifest is part of the deterministic rebuild surface.

The hidden key is authored independently after packet freeze by the owner plus one non-Gemini checker. It must not exist in any path Gemini is permitted to read before the run.

Before the first calibration shard is dispatched, those owners must freeze the complete 32-row key and write `calibration/hidden-key-freeze-attestation.json` from the committed template. The attestation records only the frozen key's row count, SHA-256, owners, timestamp, and snapshot identities; it does not contain verdicts or reveal the key's location. Codex validates the attestation mechanically but does not read or score the hidden key. Absence or mismatch is:

```text
CALIBRATION_BLOCKED_HIDDEN_KEY_NOT_FROZEN
```

### 9.2 Gemini read boundary

Calibration uses one fresh Gemini session per shard, processed in the exact order listed by `calibration/calibration-input.json` (currently `calibration-shard-001` through `calibration-shard-009`). A session may read only:

1. `AGENTS.md`;
2. Sections 1, 3.2, 4, 8, 9, and 10 of this specification;
3. `calibration/calibration-input.json`, or the exact aggregate identity metadata for its assigned shard copied without interpretation;
4. its one exact `calibration/shards/calibration-shard-###.json`.

Gemini must not read:

- prior stage-reference reports;
- terminal-sentence pilot evaluations;
- prior model capability evaluations;
- the hidden calibration key;
- `calibration/selection-manifest.json`, `calibration/selection-review.md`, or the hidden-key freeze attestation;
- `population.jsonl` outside the selected rows;
- any other calibration shard;
- other packets;
- any prior calibration-shard output or run record;
- any prior Gemini batch output.

### 9.3 Calibration output

Each fresh shard session writes exactly:

```text
gemini/calibration-shards/calibration-shard-###.jsonl
gemini/calibration-shards/calibration-shard-###-run.json
```

The shard-local JSONL contains one candidate row per assigned target in shard order. The shard-local run record is one JSON object containing only:

- exact `calibrationShardId`;
- exact model selector and backend/model ID if visible;
- harness;
- date;
- branch and HEAD if available;
- input row count for that shard;
- output row count;
- shard-local identity/order reconciliation result;
- confirmation that no helper script or classifier was written or executed;
- confirmation that no existing file was modified;
- one status:
  - `CALIBRATION_SHARD_DELIVERY_COMPLETE`
  - `CALIBRATION_SHARD_PARTIAL_CONTEXT_LIMIT`
  - `CALIBRATION_SHARD_BLOCKED_INPUT_RECONCILIATION`
  - `CALIBRATION_SHARD_BLOCKED_OUTPUT_CONTAMINATION`

Gemini may not self-score or claim promotion.

### 9.4 Deterministic calibration reconciliation

After each shard session returns, Codex validates its JSONL with:

```text
tsx audit/stage-reference-semantic-census-2026-07-23/validate-gemini-output.ts \
  --mode calibration-shard \
  --shard calibration-shard-### \
  --input audit/stage-reference-semantic-census-2026-07-23/gemini/calibration-shards/calibration-shard-###.jsonl
```

Codex does not edit or semantically correct a shard output. When all shard JSONL and run records validate, the deterministic reconciler:

1. concatenates the shard JSONL files in aggregate shard order without changing any row;
2. writes `gemini/calibration-output.jsonl`;
3. validates the aggregate 32/32 with `--mode calibration`;
4. compiles the nine shard-local factual run records plus deterministic reconciliation facts into `gemini/calibration-run.md`.

The aggregate run record contains the per-shard model/harness/date/count/status metadata, total input and output row counts, aggregate identity/order reconciliation, branch and HEAD, and one status:

- `CALIBRATION_DELIVERY_COMPLETE`
- `CALIBRATION_PARTIAL_CONTEXT_LIMIT`
- `CALIBRATION_BLOCKED_INPUT_RECONCILIATION`
- `CALIBRATION_BLOCKED_OUTPUT_CONTAMINATION`

Gemini is never asked to summarize sessions it did not participate in. Concatenation and run-record compilation confer no semantic acceptance.

---

## 10. Stage C — external calibration gates

The Gemini candidate is authorized for the full census only when every gate passes.

### Mechanical gates

- 32/32 rows delivered exactly once and in order;
- zero unknown enums;
- zero invented or cross-case evidence IDs;
- zero identity drift;
- zero output contamination;
- zero helper-classifier or proxy-adjudication code;
- zero repeated boilerplate beyond the validator allowance.

### Semantic gates

- at least 29/32 exact verdict agreement with the frozen key;
- zero misses on any calibration row designated a **principal direct-answer leak** by the key;
- no more than two false-positive `LEAK` verdicts across all keyed no-leak controls;
- zero cases where the cited stage evidence contradicts Gemini's stated reason;
- zero `LEAK` rows routed solely from the absence of an anchor;
- zero complete-record controls labeled `LEAK` merely because later timestamps exist;
- every keyed ambiguous row may be answered `REVIEW`; forced certainty on an ambiguous row counts as disagreement;
- all evidence IDs used in a semantically correct row must actually support the stated dependency, not merely occur in the same case.

The checker records a short failure analysis by error type:

- evidence selection;
- answer-dependency reasoning;
- complete-record overclassification;
- false reassurance from nonanswering data;
- bilingual interpretation;
- instruction adherence.

If any gate fails:

```text
CALIBRATION_REJECT_FULL_CENSUS
```

Preserve the calibration output unchanged and stop. Do not tune the prompt against the same 32 rows and rerun under the same pilot claim. A later rerun requires a new calibration set.

If all gates pass:

```text
CALIBRATION_PASS_AUTHORIZE_CANDIDATE_CENSUS
```

Passing authorizes candidate evidence production only. It does not make Gemini the final disposition owner.

---

## 11. Stage D — full candidate census

### 11.1 Dispatch protocol

Use one fresh Gemini session per packet.

Each session receives only:

- the Gemini-facing contract in Section 8;
- one frozen `packets/packet-###.json`;
- its exact output path.

Do not provide previous batch outputs, running verdict totals, expected class balance, or the calibration key.

The packet's own case grouping is the unit of context. Do not split or merge packets after calibration passes; any packet regeneration invalidates the calibration snapshot and requires rechecking hashes and packet identity.

### 11.2 Batch output

Each packet writes exactly one file:

```text
gemini/batches/packet-###.jsonl
```

The deterministic validator must pass before the next packet is accepted. A mechanically invalid packet output is returned once for bounded correction of format/identity only. The model is not shown semantic scoring or aggregate totals.

If a session cannot complete the assigned packet directly, it returns:

```text
PACKET_PARTIAL_CONTEXT_LIMIT
```

with the first unreviewed queue index. It must not manufacture remaining rows.

### 11.3 Gemini delivery

After all packet files exist and validate, Gemini may write only a compact `gemini/delivery.md` containing:

- exact model/harness;
- packet count;
- input target count;
- output target count;
- missing/duplicate/extra count;
- first unreviewed target, if any;
- bank-hash stability confirmation supplied by the deterministic harness;
- status:
  - `CANDIDATE_CENSUS_DELIVERY_COMPLETE`
  - `CANDIDATE_CENSUS_PARTIAL`
  - `CANDIDATE_CENSUS_BLOCKED_RECONCILIATION`

No findings summary or remediation proposal belongs in Gemini's delivery.

---

## 12. Stage E — deterministic reconciliation and checker residual

After all full-run packet outputs validate:

1. concatenate them in `queueIndex` order into `adjudication-candidate.jsonl`;
2. prove every live population row appears exactly once;
3. re-run Stage A and prove the population and packets are byte-identical;
4. re-hash every bank and prove snapshot stability;
5. produce deterministic counts by verdict, bank, case, item type, part ordinal, stage count, and bilingual relation;
6. write `candidate-report.md` clearly labeled **Gemini candidate evidence — not accepted disposition**.

The independent checker population is:

- every Gemini `LEAK` row;
- every Gemini `REVIEW` row;
- every row with `EN_ONLY_LEAK`, `ZH_ONLY_LEAK`, `MATERIAL_DIVERGENCE`, or `UNRESOLVED`;
- a deterministic 10% sample of all Gemini no-leak rows, selected by SHA-256 over:

```text
stage-ref-check|<bankPath>|<parentCaseId>|<partId>
```

Include a no-leak row when the first unsigned hash byte modulo 10 equals `0`.

The checker re-derives each selected disposition from the frozen packet. It does not merely compare Gemini's prose with itself.

Only the checker/owner output may establish:

- accepted actual-leak population;
- accepted no-leak population;
- cases requiring full case review;
- whether a deterministic anchor migration is possible;
- whether any case needs rewrite or retirement;
- whether the advisory can become fatal for future content;
- a later implementation work order.

---

## 13. Precision boundaries for Gemini

### 13.1 A later timestamp is not automatically a leak

A case may provide the complete chart and ask the learner to interpret it retrospectively. A stage titled `Follow-up` or containing a later time does not itself prove answer leakage.

### 13.2 Additional data is not automatically useful data

An exposed lab, medication administration, progress note, or outcome is a leak only when it materially helps answer the active part. Unrelated later information belongs under `NO_LEAK_NONANSWERING_DATA`.

### 13.3 Strong cueing counts even without verbatim answer text

A stage may leak by:

- naming the diagnosis the learner is asked to infer;
- documenting that the keyed intervention was performed or effective;
- revealing deterioration that makes one priority action uniquely correct;
- showing a trend or comparator that the active part asks the learner to calculate or recognize;
- eliminating otherwise plausible distractors.

The answer need not appear word-for-word.

### 13.4 Rationale agreement is not independent proof

The rationale is supplied to identify the intended inference and key dependency. Do not label a stage as safe merely because its language differs from the rationale, and do not label it a leak merely because both mention the same topic.

### 13.5 Complete-record intent must be evidenced

Use `NO_LEAK_COMPLETE_RECORD` only when the case/part wording, stage structure, or authored progression supports the conclusion that the complete record is intentionally available for that part. Do not use it as a convenient default for difficult cases.

### 13.6 Unrecoverable intent belongs in `REVIEW`

Legacy cases may not contain enough metadata to reconstruct where a part was intended to become answerable. When both a leak and no-leak reading remain plausible, preserve the ambiguity instead of inventing an anchor boundary.

---

## 14. Stage A verification floor

Before handing any packet to Gemini, Codex must run and record:

- strict validation of every bundled bank;
- current `npm run test:audit-stage-refs` or its exact current package-script equivalent;
- current stage-reference canonical sweep;
- population uniqueness and live-object resolution;
- evidence-ID uniqueness;
- packet target reconciliation;
- packet byte-limit and complete-case grouping checks;
- calibration selection-manifest uniqueness and calibration-input reconciliation;
- calibration shard count/size/hash/order and complete-case reconciliation;
- architect selection-reason absence from every Gemini-facing file;
- hidden-key freeze attestation presence and snapshot reconciliation before dispatch;
- byte-identical second build from the same frozen selection manifest;
- bank-hash stability;
- `git diff --check` limited to task-owned files.

Because this is an audit-artifact implementation, Codex must also test synthetic validator failures for:

- missing target;
- duplicate target;
- extra target;
- wrong identity;
- unknown verdict;
- foreign evidence ID;
- cross-case evidence ID;
- undeclared unsafe stage;
- `LEAK` without supporting evidence;
- no-leak with unsafe stages;
- `REVIEW` with unsafe stages;
- repeated boilerplate reason.

Do not add a package script unless separately authorized. Task-local commands are sufficient.

---

## 15. Stop conditions

Use these exact statuses:

- `BLOCKED_PARSE_OR_SCHEMA_FAILURE`
- `BLOCKED_POPULATION_RECONCILIATION`
- `BLOCKED_EVIDENCE_PROJECTION_FAILURE`
- `BLOCKED_PACKET_RECONCILIATION`
- `BLOCKED_CONCURRENT_BANK_CHANGE`
- `BLOCKED_OUTPUT_CONTAMINATION`
- `CALIBRATION_BLOCKED_HIDDEN_KEY_NOT_FROZEN`
- `CALIBRATION_PARTIAL_CONTEXT_LIMIT`
- `CALIBRATION_REJECT_FULL_CENSUS`
- `PACKET_PARTIAL_CONTEXT_LIMIT`
- `CANDIDATE_CENSUS_PARTIAL`

Never force completion by:

- dropping oversized cases;
- omitting visuals or structured measurements;
- collapsing multiple target parts into one verdict;
- treating missing anchors as semantic proof;
- defaulting all legacy cases to complete-record intent;
- converting `REVIEW` to `NO_LEAK` to reduce checker work;
- regenerating packets after seeing Gemini's totals without invalidating the run.

---

## 16. Preparation delivery contract

When Stage A is complete, Codex returns only:

1. paths to the population, summary, packet manifest, packet directory, calibration input, validator, and preparation delivery;
2. live target count and parent-case count;
3. packet count and calibration row/case count;
4. byte-identical rebuild result;
5. bank-hash stability result;
6. confirmation that Gemini has not yet been run and no semantic verdict was authored;
7. confirmation that no file outside the authorized audit directory changed.

Do not begin Gemini calibration automatically. The owner dispatches the candidate model after reviewing the frozen packet shape.

---

## 17. What success would establish

A successful calibration and candidate census would establish only that the selected Gemini model can perform this narrow task under the tested convention:

- one finite case packet at a time;
- a complete deterministic evidence surface;
- one closed semantic comparison per target;
- evidence selected by packet-owned IDs;
- no repository navigation burden;
- no autonomous scripting or census construction;
- no deletion-safety or implementation authority;
- external scoring and capped independent review.

It would **not** establish that Gemini is a general Project Shrimp audit seat, a clinical checker, a source-verification owner, a content promoter, or a safe author of case-stage mutations.
