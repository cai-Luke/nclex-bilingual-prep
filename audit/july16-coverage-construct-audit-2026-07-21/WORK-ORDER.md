# Work Order — July 16 Coverage-Batch Construct Audit

Date: 2026-07-21

Status: ready to run

## Purpose

Audit the 108 current live standalone questions in the six July 15–16 GPT coverage-balance families after the scored-format audit met its outer-ring trigger. Determine whether each current item deserves its scenario, format, response demand, and key. This is an evidence audit, not authorization to mutate banks.

## Scope

Select current top-level items in `banks/gpt-canonical.json` by these anchored prefixes, exactly 18 each:

- `^gpt_mocsic_`
- `^gpt_balance2_`
- `^gpt_balance3_`
- `^gpt_balance5_`
- `^gpt_balance6a_`
- `^gpt_balance6b_`

Expected type totals: 29 bowtie, 16 dropdown cloze, 9 fill in the blank, 31 highlight, 11 matrix, 10 ordered response, and 2 select all; total 108.

## Authority

Use current repo files and live canonical content as authority. Historical commission specs explain provenance but do not override current items. Read the six archived commission specs, current schema/grading contracts, repair records for any historically repaired scoped item, and the accepted findings from `audit/scored-format-construct-audit-2026-07-21/report.md`.

## Protocol

1. Freeze a deterministic population from one canonical-bank hash and prove byte-identical repeat output.
2. Primary-review all 108 items in batches of no more than 18. Withhold key, rationale, strategy, sources, prior verdicts, and terminal-census results during blind derivation.
3. Apply the scored-format audit's construct vocabulary and format-specific gates. In particular:
   - ordered response: derive a dependency graph and count defensible total orders;
   - dropdown: test each blank independently;
   - fill in the blank: reject acronym recall or formula transcription without clinical value;
   - bowtie: require competing conditions and coherent same-phase actions/parameters;
   - highlight: require one coherent, bounded record and response horizon;
   - matrix/select all: require independently judgeable rows/options without mechanical coupling.
4. Reveal and compare the current key/rationale. Open authoritative sources for all ordered responses, dropdowns, adverse items, narrow thresholds/classifications, or plausible competing answers. Compare all answer-bearing English/Chinese surfaces.
5. Independent non-GPT checker population: all ordered responses, dropdowns, and fill-in-blank items; all other primary FIX/RETIRE/REVIEW items; known repaired examples; and a deterministic 20% sample of remaining passes using the first SHA-256 byte of `<bankPath>|<id>|<itemType>` modulo 5 = 0.
6. Preserve all primary/checker disagreements for Luke. Luke owns retirement and replacement decisions.

Allowed primary verdicts: `PASS`, `FIX`, `RETIRE`, `REVIEW`. Use the defect classes and next-disposition vocabulary defined in `Archive/root-cleanup-2026-07-21/GPT-SCORED-FORMAT-CONSTRUCT-AUDIT-SPEC-2026-07-21.md`.

## Output boundary

All task-owned writes must remain beneath `audit/july16-coverage-construct-audit-2026-07-21/`. No bank, schema, ledger, history, census, prompt, commit, or promotion mutation is allowed.

Expected artifacts:

- `WORK-ORDER.md`
- `build-population.ts`
- `population.jsonl`
- `primary-adjudication.jsonl`
- `checker-population.jsonl`
- `checker-adjudication.jsonl`
- `batches/`
- `report.md`

## Status vocabulary

- `COMPLETE_PENDING_OWNER_DISPOSITIONS`
- `COMPLETE_NO_OPEN_DISPOSITIONS`
- `BLOCKED_POPULATION_RECONCILIATION`
- `BLOCKED_PARSE_FAILURE`
- `BLOCKED_CONCURRENT_BANK_CHANGE`
- `PARTIAL_CONTEXT_LIMIT`
- `BLOCKED_OUTPUT_CONTAMINATION`

## Acceptance gates

- exactly 108 unique current top-level rows and 18 per family;
- exact type totals reconcile;
- one primary row per item with blind derivation, key/source/bilingual checks, evidence for every adverse verdict, and format-specific graph/inference fields;
- deterministic checker population and one checker row per selected item;
- all disagreements preserved;
- population repeat output byte-identical;
- starting and ending bundled-bank hashes match;
- no write outside this audit directory and no remediation.
