# GPT Scored-Format Batch 12 — Failed Raw Batch Archive

**Archived:** 2026-07-28  
**Disposition:** Quarantined; never promotion-ready  
**Canonical impact:** None

## Contents

- `GPT-SCORED-FORMAT-BATCH-12-CODEX-COMMISSION-2026-07-27.md` — the commission that produced the batch
- `gpt-format12a-bowtie-highlight-2026-07-27.json` — 5 raw questions
- `gpt-format12b-highlight-fib-2026-07-27.json` — 6 raw questions
- `gpt-format12c-ordered-dropdown-2026-07-27.json` — 6 raw questions

These files were moved from the repository root and `banks/banks-raw/`. They are retained for provenance and workflow analysis, not as a source of reviewed study material.

## Why the batch was quarantined

The live raw gate failed all three candidate files. Eight questions used noncanonical or mismatched topic labels. The authored difficulty mix also drifted from the cleared-row target: the delivered batch contained 3 easy, 5 medium, and 9 hard questions.

Producer-independent review classified the 17 constructs as:

- 6 worth retaining only after targeted correction;
- 4 requiring substantial revision;
- 7 requiring a rebuild or block.

The major content findings were:

- a near-exact fetal-highlight collision;
- a repeated pediatric-maintenance equation;
- a repeated ulipristal follow-up decision;
- substantial transfusion-reaction overlap;
- three ordered-response items that forced overlapping or conditional emergency care into artificial serial order;
- highlight keys that were redundant, directly revealed, or not source-defined;
- weak or caricatured distractors;
- eight of nine dropdown answers placed first;
- two Fahrenheit-first policy violations.

## Workflow lesson

The commission contained useful interaction-fit and collision rules, but made the producer responsible for clearing its own preflight and did not persist an externally approved roster. No Stage A roster, comparator receipt, interaction-fit artifact, or post-gate drift audit was delivered.

Future scored-format batches should use separate turns and roles:

1. Codex performs feasibility review and persists a machine-readable cleared manifest.
2. GPT authors only the rows in that manifest.
3. A mechanical manifest-lock check rejects category, topic, difficulty, item-type, or row drift.
4. Codex performs post-generation awkwardness and interaction-fit review.
5. A producer-independent clinical/source/bilingual checker decides promotion eligibility.

No question from this archive should be copied into a live raw bank without a new collision search, source review, interaction-fit review, and explicit authorization.
