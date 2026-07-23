# Terminal-Sentence Independent Checker Pilot — Owner Evaluation

Date: 2026-07-22  
Owner: Project Shrimp architect seat  
Status: owner-only evaluation protocol  
Candidate visibility: prohibited until candidate output is frozen

## 1. Purpose

Evaluate repeated candidate-model runs of:

```text
TERMINAL-SENTENCE-INDEPENDENT-CHECKER-PILOT-SPEC-2026-07-22.md
```

This file is not candidate input. Do not reveal it, summarize its expected outcomes, or allow a candidate to inspect another model's output before that candidate's own `pilot-adjudication.jsonl` and `delivery.md` are frozen.

The pilot measures:

- recall for real learner-surface defects;
- restraint around legitimate clinical and response instructions;
- ability to distinguish authorial construction language from direct learner guidance;
- renderer-aware placeholder reasoning;
- bilingual and segmentation judgment;
- removal-safety judgment;
- evidence discipline;
- compliance with direct-review provenance.

Speed and verbosity are not scored.

## 2. Evaluation status of this key

The outcome key below is the architect's current adjudication based on live items, the renderer, the governing audit distinction, and the completed Sonnet review inspection.

It is an evaluation key, not a canonical bank mutation decision. A candidate disagreement with a noncritical row may expose a weakness in this key and should be litigated before final scoring when the candidate supplies materially stronger live-disk evidence.

Critical gates are not softened merely because a model writes persuasive prose.

## 3. Expected binary outcomes

### 3.1 Expected defect-bearing rows — 35

```text
57, 147, 162, 226, 656, 702, 735, 799,
888, 890, 892, 902, 904, 905, 920, 921,
922, 931, 932, 933, 1103, 1108, 1486, 1492,
1731, 2123, 2176, 2178, 2185, 2190, 2219, 2228,
2231, 2238, 2413
```

Expected candidate verdict is normally `FLAG`.

`REVIEW` receives partial credit only when the candidate identifies the correct defect mechanism and removal-safety uncertainty. An unqualified `PASS` receives no credit.

### 3.2 Expected retained rows — 29

```text
69, 2115, 2130, 2166, 2175, 2177, 2179, 2181,
2189, 2192, 2199, 2211, 2212, 2221, 2224, 2226,
2227, 2230, 2232, 2235, 2370, 2402, 2412, 2425,
2433, 2438, 2440, 2477, 2493
```

Expected candidate verdict is `PASS`.

A `REVIEW` may receive partial credit on a genuinely difficult boundary row when the candidate correctly identifies the legitimate function and states the unresolved distinction. A `FLAG` receives no binary-outcome credit unless owner re-adjudication changes this key.

## 4. Expected defect families

### 4.1 Typographic and bilingual terminal defects

```text
57, 226, 656, 702, 735, 799
```

Acceptable primary classes:

- `BILINGUAL_TERMINAL_DEFECT`
- `OTHER_CONFIRMED_TERMINAL_DEFECT`

The candidate must identify the actual corrupt or mistranslated learner-facing text. Generic “translation issue” prose is insufficient.

### 4.2 Answer telegraphing

```text
147
```

Expected primary class:

- `ANSWER_TELEGRAPHING_OR_ADJUDICATION_NOTE`

The candidate should verify that the case-container stem is learner-visible and that it supplies the diagnosis/mechanism later tested by embedded items.

### 4.3 Construct defense and authorial leakage

```text
162, 2123, 2176, 2178, 2185, 2190, 2219, 2231, 2238, 2413
```

Acceptable primary classes depend on row function:

- `CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE`
- `AUTHORIAL_CONSTRAINT_LEAK`
- `REDUNDANT_META_DISCLAIMER`

For queue index 2,413, the matrix response operation is legitimate, but the parenthetical about a framework being “still tested on the NCLEX-RN” is test-facing authorial commentary. Accept:

- `FLAG` with a defect class and bounded-removal or rationale-relocation analysis; or
- `REVIEW` only when the candidate clearly isolates the parenthetical as the contested span.

An unqualified PASS treating the parenthetical as an ordinary clinical fact fails the gate.

### 4.4 Raw template and duplicated response surfaces

```text
888, 890, 892, 902, 904, 905, 920, 921,
922, 931, 932, 933, 1103, 1108, 1486, 1492
```

Acceptable primary classes:

- `RAW_TEMPLATE_OR_SCHEMA_LEAK`
- `DUPLICATED_RESPONSE_SCAFFOLD`

Secondary use of the other class is often appropriate.

The candidate must reason from item type and rendered field:

- ordinary dropdown-cloze `stem` renders separately from `clozeStem`;
- ordinary fill-in-blank `stem` displays brace placeholders literally.

A brace-only explanation without renderer/field reasoning receives reduced class/evidence credit.

### 4.5 Item-design compensation

```text
1731, 2228
```

Expected primary class:

- `ITEM_DESIGN_COMPENSATION`

Acceptable secondary class:

- `CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE`

Queue index 1,731 must recognize that the sentence admits a clinically appropriate concurrent action was omitted because the options were forced into a serial sequence. Expected removal risk is at least `POSSIBLE_AMBIGUITY`; expected next step is `FULL_ITEM_REVIEW`.

Queue index 2,228 must recognize that “near-misses” describes distractor construction rather than clinical-world content.

## 5. Critical semantic gates

A candidate is not eligible for the full checker seat when any critical gate fails, regardless of aggregate score.

### Gate A — bilingual sentence-boundary restraint

Queue index 69 must remain PASS. The Chinese terminal contains the fuller calculation request while English isolates the rounding sentence; the complete stems preserve the same task.

### Gate B — dropdown duplication

Queue index 890 must be FLAG. The candidate must identify ordinary stem duplication of the functional cloze response surface.

### Gate C — fill-in-blank renderer behavior

Queue indices 1,486 and 1,492 must be FLAG. Raw brace placeholders in ordinary fill-in-blank stems render literally.

### Gate D — ordered-response compensation

Queue index 1,731 must not be PASS. The candidate must identify item-design compensation or, at minimum, escalate the sentence for full-item review on that basis.

### Gate E — segmentation artifacts

Queue indices 2,370 and 2,440 must not be flagged merely because the extracted Chinese terminal begins or ends with an unmatched parenthesis. The candidate must inspect the full live stem and recognize the coherent learner surface.

### Gate F — test-facing parenthetical

Queue index 2,413 must not receive an unqualified PASS. The candidate must isolate the NCLEX-facing commentary as defective or genuinely mixed.

### Gate G — response-format classification

Queue index 2,425 must be PASS and should be classified as `LEGITIMATE_RESPONSE_DEMAND`, not calculation/rounding. “Each row may have more than one correct category” describes matrix mechanics.

### Gate H — bilingual segmentation across two questions

Queue index 2,438 must remain PASS when the complete Chinese stem contains both English questions across penultimate and terminal spans.

## 6. High-value retained contrasts

These rows test whether the candidate overgeneralizes from self-reference, restrictions, or clinical cautions.

### Direct clinical or interpretation cautions

```text
2166, 2175, 2211, 2212, 2230, 2232
```

These sentences constrain over-interpretation of a score, dimension, ratio, or calculated result without discussing how “this item” was constructed. Expected PASS.

### Governing facts and calculation constraints

```text
2115, 2177, 2189, 2192, 2221, 2224, 2493
```

These are legitimate scenario facts, protocols, rounding instructions, safety rules, or closed-world calculation boundaries. Expected PASS.

### Direct response restrictions

```text
2130, 2179, 2181, 2199, 2226, 2227, 2235, 2433, 2477
```

These speak directly to what the learner must do with the supplied clinical task or response interface. They do not explain how the author constructed a key. Expected PASS.

### Case-container framing

```text
2402, 2412
```

These describe the clinical topic or narrative arc of a learner-visible case container. They may be removable stylistically, but they are not author/checker leakage. Expected PASS.

## 7. Structural and provenance gates

Before semantic scoring, verify:

- exactly 64 JSONL rows;
- exact pilot order and ordinals;
- no missing, duplicate, or extra indices;
- exact queue identities and terminal strings;
- valid closed enums;
- every `quotedEvidence` is an array of evidence objects;
- all selected controls are populated and all unselected controls are null;
- every row records approved inspection depth;
- output exists only in the candidate's model-owned directory;
- `delivery.md` identifies the exact model/harness/version;
- blind-boundary confirmation is present;
- no semantic classifier, generator, packaging script, verdict map, or bulk default was used;
- no existing file was changed;
- no commit or push occurred.

Any of these is an automatic non-promotion condition:

- prior semantic material was read;
- another candidate's output was read;
- semantic rows were packaged from code-authored dictionaries;
- evidence strings replace the required evidence arrays;
- missing rows were defaulted or copied;
- the model/harness cannot be identified precisely.

A structurally complete but provenance-contaminated run may be retained as an experiment but is not independent evidence.

## 8. Scoring rubric — 100 points

### 8.1 Binary row outcomes — 64 points

Award per row:

- 1 point for the expected PASS or FLAG outcome;
- 0.5 points for REVIEW when the row is defect-bearing and the reason identifies the correct mechanism but removal safety remains uncertain;
- 0.5 points for REVIEW on a retained boundary row only when the reason correctly states the legitimate function and a real unresolved issue;
- 0 otherwise.

Do not award partial credit for vague uncertainty.

### 8.2 Class, removal-risk, and next-step quality — 16 points

Score these 16 anchors, one point each:

```text
147, 162, 890, 1486, 1492, 1731, 2123, 2176,
2178, 2185, 2190, 2219, 2228, 2231, 2238, 2425
```

Award the point when the candidate:

- selects an appropriate primary class;
- identifies the correct speech-act target;
- does not recommend unsafe deletion;
- routes full-item, bilingual, or renderer review appropriately.

For 2,425, award the point for PASS plus `LEGITIMATE_RESPONSE_DEMAND` and an appropriate response-format explanation.

### 8.3 Evidence and reasoning — 10 points

Evaluate across the packet:

- exact live-disk quotes;
- local context sufficient to prove function or removal risk;
- renderer evidence where required;
- full-stem evidence for segmentation claims;
- item-specific reasons rather than stock templates;
- no invented facts or unsupported clinical assertions.

Suggested scoring:

- 9–10: consistently specific and auditable;
- 7–8: strong with a few thin rows;
- 4–6: mixed, formulaic, or insufficient context;
- 1–3: mostly superficial;
- 0: evidence contract not meaningfully followed.

### 8.4 Structural and provenance discipline — 10 points

- 4 points: exact schema, identities, order, and control handling;
- 3 points: blind boundary and direct-review provenance preserved;
- 2 points: output isolation and delivery record complete;
- 1 point: concise, truthful stop/completion reporting.

Any automatic non-promotion condition in §7 caps this section at zero and blocks promotion regardless of total.

## 9. Promotion thresholds

### `PILOT_PROMOTE_TO_FULL_CHECKER`

Require all:

- score at least 90/100;
- every critical semantic gate passes;
- at least 33 of 35 expected defect-bearing rows are FLAG/acceptable REVIEW;
- at least 27 of 29 expected retained rows are PASS/acceptable REVIEW;
- exact structural compliance;
- direct-review provenance intact;
- no unresolved model-identity or producer-conflict issue that prevents the intended full commission.

### `PILOT_SECOND_OPINION_ONLY`

Use when:

- score is 80–89; or
- one noncritical family remains weak; or
- the model is useful at finding defects but too permissive or too aggressive for final ownership; or
- model-family provenance prevents it from independently clearing part of the corpus.

This model may be used to challenge the full checker but does not own the accepted finding set.

### `PILOT_REJECT_REVIEW_SEAT`

Use when:

- score is below 80;
- any critical gate fails;
- false positives exceed 2 of 29 retained rows;
- false negatives exceed 2 of 35 defect-bearing rows;
- output/provenance is contaminated;
- reasons show phrase matching rather than contextual semantic review;
- renderer or bilingual boundaries are not understood.

## 10. Ranking multiple candidate models

When two candidates both qualify, rank them by:

1. critical-gate performance;
2. fewer false negatives;
3. fewer false positives;
4. safer removal-risk and next-step judgments;
5. stronger live-disk evidence;
6. better distinction between authorial leakage and legitimate direct guidance;
7. more truthful handling of uncertainty;
8. cleaner structural/provenance compliance.

Do not rank by prose length, confidence, completion speed, brand reputation, or how closely a model imitates Sonnet's wording.

## 11. Post-freeze evaluation procedure

For each candidate:

1. preserve its model-owned directory unchanged;
2. verify delivery and blind-boundary claims;
3. run mechanical structural checks;
4. score binary outcomes without editing the output;
5. inspect critical gates manually against live disk;
6. score class/removal/next-step anchors;
7. score evidence and provenance;
8. record one promotion status;
9. write a short comparison note outside candidate directories;
10. do not reveal another candidate's row-level output before remaining candidates freeze theirs.

If a candidate exposes a persuasive error in this owner key, update this file only after owner adjudication, record the changed row and reason, and rescore every candidate consistently.

## 12. Handoff after qualification

A promoted candidate receives:

```text
TERMINAL-SENTENCE-INDEPENDENT-CHECKER-SALVAGE-SPEC-2026-07-22.md
```

The pilot output is not reused as full-checker adjudication. The promoted model must re-open every overlapping row in the full commission and write fresh checker evidence in the full output directory.

A candidate receiving `PILOT_SECOND_OPINION_ONLY` may later review disputed rows after the primary checker freezes its output, but it must not contaminate the primary checker beforehand.

If no new model qualifies, route the full salvage commission to the standard workhorse without weakening the contract.