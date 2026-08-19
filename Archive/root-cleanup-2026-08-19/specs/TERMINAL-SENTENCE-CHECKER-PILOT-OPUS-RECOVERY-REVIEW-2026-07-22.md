# Terminal-Sentence Independent Checker Pilot — Opus Recovery Review

Date: 2026-07-22  
Owner: Project Shrimp architect seat  
Status: late-discovered candidate output inspected; structurally invalid pilot

## 1. Candidate output inspected

Preserved unchanged at:

```text
audit/terminal-sentence-independent-checker-pilot-2026-07-22/claude-opus-4-thinking/
```

Files present:

```text
pilot-adjudication.jsonl
delivery.md
```

The output was not merely partial. It contains 64 adjudication rows and a completed delivery report. File metadata shows the JSONL was written between approximately 18:02 and 18:03 UTC on 2026-07-22.

## 2. Decisive structural failure

The pilot specification required these queue indices, beginning:

```text
57, 69, 147, 162, 226, ...
```

Opus delivered:

```text
58, 70, 148, 163, 227, ...
```

The same relationship holds for every ordinal:

```text
delivered queueIndex = required queueIndex + 1
```

All 64 assigned rows were therefore substituted with the immediately following queue row. This is consistent with an off-by-one extraction error, likely confusion between a one-based `queueIndex` and a zero-based line/array position. The exact mechanism is an inference; the observed +1 substitution across all 64 rows is certain.

Consequences:

- 64 required rows were missing;
- 64 unassigned rows were extra;
- exact packet order and queue identities failed;
- seven of eight critical gates were not actually attempted;
- the delivery report incorrectly presented the run as a complete 64-row adjudication without reporting the missing and extra indices required by the contract.

Formal disposition:

```text
PILOT_REJECT_REVIEW_SEAT
```

This is an automatic structural non-promotion. The semantic score for the intended packet is undefined.

## 3. Accidental overlap with the intended packet

Because some assigned indices are adjacent to other assigned indices, 16 delivered queue indices also occur somewhere in the intended packet:

```text
905, 921, 922, 932, 933,
2176, 2177, 2178, 2179, 2190,
2212, 2227, 2228, 2231, 2232, 2413
```

These rows were reviewed under the wrong `pilotOrdinal`, so they cannot repair structural compliance. They can still provide a limited semantic sample.

### Defect-bearing overlaps

The owner key marks 11 of the overlap rows as defect-bearing:

```text
905, 921, 922, 932, 933,
2176, 2178, 2190, 2228, 2231, 2413
```

Opus flagged all 11. It correctly recognized:

- raw template and duplicated dropdown-cloze surfaces;
- explicit `This item/question...` authorial language;
- the retinal-detachment `near-misses` distractor-construction note;
- the NCLEX-facing SIRS parenthetical.

### Retained overlaps

The owner key marks five overlap rows as PASS:

```text
2177, 2179, 2212, 2227, 2232
```

Opus dispositions:

```text
2177 — PASS
2179 — FLAG
2212 — REVIEW
2227 — REVIEW
2232 — REVIEW
```

It therefore retained only 1 of 5 outright. The three REVIEW rows contained thoughtful clinical-boundary reasoning and could receive partial credit under the owner rubric, but the pattern is still too cautious for final disposition ownership. Queue 2179 was a clear false positive: the same-visit HRIG/day-0 vaccine grouping is legitimate ordered-response guidance under the frozen key.

A generous overlap-only binary score would be approximately 13.5/16 after REVIEW partial credit. This sample is strongly biased toward obvious defect families and does not substitute for the assigned packet.

## 4. Qualitative assessment of the wrong-packet work

Strengths visible in the adjacent-row review:

- detailed item-specific reasons rather than one-line labels;
- good renderer reasoning for raw braces in ordinary `stem` versus functional `clozeStem`;
- generally careful removal-risk analysis;
- correct isolation of the defective NCLEX-facing parenthetical at queue 2413;
- willingness to use REVIEW for genuinely mixed clinical cautions.

Weaknesses visible in the adjacent-row review:

- over-caution around legitimate clinical interpretation limits;
- a tendency to treat direct response constraints as item-design compensation;
- only five of the intended raw-template family were encountered because the wrong rows were selected;
- the completed delivery report failed to reconcile its output identities against the fixed packet.

The semantic work is substantially more serious than the failed Gemini 3.1 Pro run, which produced no rows. It is not evidence that Opus completed most of the requested pilot: it completed a different 64-row shadow packet.

## 5. Routing implication

Do not resume this file in place or splice corrected rows into it. Preserve it as a failed experiment.

A valid rerun would require:

1. a fresh model-owned directory;
2. explicit extraction by matching the queue object's `queueIndex` field, not by treating the requested number as a line or array position;
3. a deterministic preflight asserting that the selected indices exactly equal the frozen 64-index list before semantic review begins;
4. fresh direct review of all 64 intended rows;
5. no reuse of these semantic dispositions.

Given the stated harness instability and the availability of the standard workhorse, this output does not justify delaying the full salvage commission. It does suggest that a clean Opus rerun could be informative later if the harness becomes reliable.

No candidate output, bank, source file, or existing results report was modified during this recovery review.
