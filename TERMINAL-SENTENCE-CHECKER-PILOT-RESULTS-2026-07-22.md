# Terminal-Sentence Independent Checker Pilot — Owner Results

Date: 2026-07-22  
Owner: Project Shrimp architect seat  
Status: pilot evaluation complete; no candidate promoted  
Scope decision: Chinese-provider models deferred by owner because of anticipated U.S. availability risk and current signup/compute constraints

## 1. Inputs evaluated

Candidate outputs were preserved unchanged beneath:

```text
audit/terminal-sentence-independent-checker-pilot-2026-07-22/
```

Evaluated candidates:

1. `gemini-3-1-pro-high`
2. `gemini-3-6-flash`
3. `gpt-5-6-sol`

Claude-family models were not piloted because Claude Sonnet produced the original census evidence and is not independent for this checker comparison.

Chinese-provider candidates were not commissioned in this round. This is an owner operational decision, not a quality judgment and not a permanent project prohibition.

Owner key and rubric:

```text
TERMINAL-SENTENCE-CHECKER-PILOT-OWNER-EVALUATION-2026-07-22.md
```

## 2. Final dispositions

| Candidate | Delivered | Defects caught | Retained correctly | Critical gates | Approx. score | Formal status |
|---|---:|---:|---:|---|---:|---|
| Gemini 3.1 Pro High | 0/64 | not scored | not scored | not attempted | not scored | `PILOT_REJECT_REVIEW_SEAT` |
| Gemini 3.6 Flash High | 64/64 | 33/35 | 23/29 | failed D and E | 75/100 | `PILOT_REJECT_REVIEW_SEAT` |
| GPT-5.6 Sol | 64/64 | 31/35 | 26/29 | passed all eight | 89/100 | `PILOT_REJECT_REVIEW_SEAT` |

No candidate meets the written promotion contract. The full checker commission should therefore route to the standard workhorse unless the owner explicitly commissions another pilot.

Scores are owner rubric judgments rather than mechanically authoritative metrics. The row thresholds and critical-gate failures independently determine the formal outcomes.

## 3. Gemini 3.1 Pro High

### Disposition

`PILOT_REJECT_REVIEW_SEAT`

The model stopped before authoring any adjudication row:

- delivered `0/64`;
- status `PILOT_PARTIAL_CONTEXT_LIMIT`;
- first unreviewed row `1 / queue 57`.

Its delivery also records creation of scratch files outside the authorized model-owned directory:

```text
pilot_rows.jsonl
pilot_context.txt
```

Even absent the context failure, that output-boundary deviation would require investigation before treating the run as conformant independent evidence.

No semantic quality inference should be made from this run.

## 4. Gemini 3.6 Flash High

### Disposition

`PILOT_REJECT_REVIEW_SEAT`

### Binary performance

- expected defect-bearing rows caught: `33/35`;
- expected retained rows preserved: `23/29`;
- false negatives: queue `147`, `162`;
- false positives: queue `2130`, `2181`, `2199`, `2226`, `2235`, `2370`.

### Critical-gate failures

#### Gate D — ordered-response compensation

Queue `1731` was flagged, but the model treated the sentence as a low-risk deletion candidate. It did not recognize that the sentence admits a clinically appropriate concurrent action was omitted to force a serial option set. The required disposition is item-design compensation with full-item review, not deletion-only cleanup.

#### Gate E — segmentation artifact

Queue `2370` was incorrectly flagged from the extracted Chinese terminal `多选）`. The full live Chinese stem contains the coherent parenthetical `（多选）`; this is an extraction boundary, not learner-facing corruption.

### Characteristic strengths

- strong recall for obvious bilingual corruption;
- caught the raw-placeholder and duplicated-cloze family;
- distinguished ordinary clinical cautions from artifact-facing `This item...` prose in several rows;
- structurally complete delivery with evidence arrays and correct packet order.

### Characteristic weaknesses

The dominant weakness is **overclassification of direct learner guidance as authorial compensation**. It flagged legitimate instructions such as:

- applying water restrictions by use and patient risk (`2130`);
- treating prescription-specific PN times as non-universal (`2181`);
- not selecting every transient post-ECT symptom (`2199`);
- not selecting ordinary hypertension alone (`2226`);
- obtaining the best of three peak-flow attempts (`2235`).

Its placeholder-family reasons were also highly repetitive and often failed to quote the separate `clozeStem` surface required to prove duplication. Removal-risk judgments were especially weak: several mixed sentences containing legitimate clinical cautions were routed to direct deletion.

Flash may be useful as a high-recall supplementary finder, but it is not safe to own final semantic disposition or deletion safety.

## 5. GPT-5.6 Sol

### Disposition

`PILOT_REJECT_REVIEW_SEAT`

This is the strongest pilot and the only candidate to pass all eight critical semantic gates. It nevertheless misses the explicit promotion thresholds:

- expected defect-bearing rows caught: `31/35`, below the required `33/35`;
- expected retained rows preserved: `26/29`, below the required `27/29`;
- false negatives exceed two;
- false positives exceed two;
- owner score is approximately `89/100`, below the `90/100` floor.

### False negatives

```text
147 — answer-bearing lithium-toxicity case-container synopsis
162 — learner-facing delegation construct/scope defense
656 — malformed Chinese “择所有适用项”
799 — malformed Chinese “择所有适用项”
```

The two Chinese misses are particularly informative. Sol correctly recognized true parenthetical segmentation artifacts at `2370` and `2440`, but overextended that defense to `656` and `799`, where the complete live Chinese stem itself is missing `选` and is genuinely malformed.

### False positives

```text
2235 — direct best-of-three peak-flow task boundary
2402 — ordinary case-container clinical-topic framing
2412 — ordinary case-container narrative-arc framing
```

The case-container contrast exposes the central residual weakness:

- Sol passed queue `147`, whose learner-visible container synopsis discloses the diagnosis and precipitating mechanism later tested;
- it flagged `2402` and `2412`, which merely describe the clinical topic or unfolding-case structure without supplying answer-bearing content.

In other words, it sometimes keys too heavily on the phrase `This case study...` and not enough on whether the sentence actually collapses later reasoning.

### Strengths

- passed every critical gate;
- excellent renderer-aware analysis of dropdown-cloze and fill-in-blank placement;
- strong full-stem bilingual/segmentation analysis;
- correctly classified queue `2425` as matrix response mechanics rather than calculation instruction;
- recognized queue `1731` as mixed authorial leakage plus item-design compensation and routed it to `FULL_ITEM_REVIEW`;
- consistently quoted live response fields, keys, rationale, matrix mode, blanks, and controls;
- generally strong removal-safety reasoning for mixed clinical/authorial sentences;
- clean structural and provenance discipline.

### Weaknesses

- four false negatives remain too many for census ownership;
- three false positives remain too many for final disposition ownership;
- answer-bearing versus merely descriptive case-container language is not reliably separated;
- bilingual segmentation reasoning can become an overgeneralized excuse for malformed Chinese;
- some defect classes are adjacent rather than exact, especially `1731`, `2228`, and `2238`.

Sol is suitable as a **second-opinion challenger** on disputed rows even though the formal rubric requires `PILOT_REJECT_REVIEW_SEAT`. It should not own the accepted finding set for this census.

## 6. Shared misses and owner-key litigation

Both complete candidates passed queue `147` and `162`.

That convergence does not automatically overturn the owner key:

- queue `147` remains a strong answer-telegraphing finding because the top-level case-container stem is learner-visible and names the diagnosis and causal mechanism before the embedded questions;
- queue `162` is the more contestable boundary. The sentence can be read either as a necessary closed-world delegation assumption or as learner-facing construct defense compensating for jurisdictional variability.

Before final remediation, queue `162` should receive explicit architect litigation rather than being treated as a trivial settled defect. This does not change either pilot score under the frozen owner key.

## 7. Routing decision

No new in-house model qualifies for the full independent-checker seat under the ratified gate.

Recommended routing:

1. preserve all candidate directories unchanged;
2. route `TERMINAL-SENTENCE-INDEPENDENT-CHECKER-SALVAGE-SPEC-2026-07-22.md` to the standard workhorse;
3. keep GPT-5.6 Sol available as a post-freeze challenger for disputed rows;
4. do not use Gemini 3.6 Flash for deletion-safety ownership;
5. do not rerun Gemini 3.1 Pro without changing the harness/context strategy;
6. treat Chinese-provider exclusion as a current operational decision, not a permanent architecture rule.

No bank mutation, commit, or push occurred during this evaluation.
