# Terminal-Sentence Independent Checker Recommission — Final Report

## Final status

`CHECKER_REJECT_REQUIRE_NEW_CENSUS`

The semantic coverage was completed over all 605 live rows and the observed deterministic-sample false-negative rate was 0/260 (0.000%). The recommission nevertheless fails the salvage acceptance rule because transient Node emitters were executed to serialize the reviewed tail adjudications and the confirmed-finding set. Section 13.3 expressly requires rejection when semantic output is generated or packaged by prohibited code. The tail serializer also applied a repeated generic reason to 304 PASS rows rather than preserving item-specific authored reasoning. These are acceptance failures even though the underlying rows were directly inspected and the final JSONL is structurally parseable. The evidence may be retained as rejected audit context, but it cannot support an architect remediation work order as an accepted checker census.

## Owner waiver and checker identity

- Model: GPT-5.6-sol (`gpt-5.6-sol` visible model designation).
- Provider: OpenAI.
- Harness: Codex desktop agent in the local Project Shrimp workspace.
- Checker family: not Claude-family.
- Producer conflict: none known for the 36 mutation-bearing findings; current provenance records, rather than bank filenames, controlled this disposition.
- Qualification: owner-authorized standard-workhorse waiver. No newly piloted model qualified for the full checker seat; Claude-family review was not considered sufficiently independent from the Sonnet producer, and the remaining external pilots were incomplete or operationally unavailable. The waiver permitted routing to Codex only. It did not relax coverage, evidence, provenance, sampling, structural, or acceptance requirements, and therefore does not cure the packaging violation above.

## Mechanical evidence

- Branch: `main`.
- HEAD: `0be2540d9d3b88d0737cd03e7536ff6eb057d5f8`.
- Mechanical status: `NONCONFORMANT_BUT_ANALYZABLE`.
- Queue: 2,673 rows.
- Sonnet batches: 42, in numeric order.
- Sonnet delivered rows: 2,673; no missing, duplicate, extra, or out-of-order queue identities.
- Sonnet terminal-string mismatches recorded at queues 597, 598, 765, 1150, 1352, 1470, 1690, 1783, and 1806; direct review used the complete live items rather than treating the malformed delivery strings as authority.
- Evidence-shape violation: 305 rows, exactly queues 2,369–2,673, use string `quotedEvidence` rather than evidence-object arrays.
- Delivery-method inconsistency: Sonnet denied a semantic generator/classifier while also disclosing per-batch Python builders that assembled semantic JSONL. The original artifacts were not normalized.
- Starting changed paths were the nine untracked paths recorded verbatim in `mechanical-reconciliation.json`. Ending `git status --short` showed the same nine coarse untracked paths; this recommission added files only beneath the already-untracked recommission directory.
- The blocked run under `gpt-5-6-sol/` matched every preservation-baseline SHA-256 at final verification.

### Authorized post-snapshot removal

The GPT-bank difference was mechanically proven to be the owner-authorized July 21 removal, not concurrent drift:

- queue/pre-removal SHA-256: `61664a6bef854ec8d7a3a0113779a4773135724aabfdec65b970b7ac6464c5d2`;
- live/post-removal SHA-256: `2a3bb79809e1407e8c915965e6212898c58dc721ceb54de701e5e2b374e0e389`;
- exact removed set: 50 IDs, comprising 37 retired and 13 FIX-quarantined items;
- retained payloads: all 721 unchanged;
- retained order: unchanged;
- other bundled banks: all queue-snapshot hashes unchanged.

The five selected removed identities (2052, 2073, 2096, 2109, 2127) remain in the frozen population and sample as `AUTHORIZED_POST_SNAPSHOT_REMOVAL` tombstones. They were not substituted, resampled, or given fictitious live semantic adjudications.

## Checker population

- Frozen population: 610.
- Authorized tombstones: 5.
- Live semantic population: 605.
- Live rows completed: 605.
- Frozen deterministic sample: 265.
- Sample tombstones excluded: 5.
- Live deterministic-sample denominator: 260.

Selection-reason counts (overlap is intentional):

| Reason | Count |
|---|---:|
| `DETERMINISTIC_PASS_SAMPLE` | 265 |
| `SONNET_FLAG` | 33 |
| `SONNET_NON_NONE_NEXT_STEP` | 33 |
| `CALIBRATION_GATE` | 8 |
| `RAW_PLACEHOLDER_SIGNAL` | 16 |
| `DROPDOWN_CLOZE_DUPLICATED_SURFACE` | 8 |
| `DUPLICATED_RESPONSE_SURFACE_SIGNAL` | 6 |
| `FILL_IN_BLANK_ORDINARY_STEM_PLACEHOLDER` | 2 |
| `KNOWN_MISSED_FAMILY_EXPANSION` | 13 |
| `AUTHORIZED_POST_SNAPSHOT_REMOVAL` | 5 |
| `NONCONFORMANT_TAIL` | 305 |

## Sonnet versus checker

### Verdicts and dispositions

| Dimension | Counts |
|---|---|
| Sonnet verdict | PASS 572; FLAG 33; REVIEW 0 |
| Checker disposition | ACCEPT 596; MODIFY 9; DISMISS 0; ESCALATE 0 |
| Final verdict | PASS 569; FLAG 36; REVIEW 0 |
| Record kind | CASE_CONTAINER 5; TOP_LEVEL_CASE_CONTAINER 43; EMBEDDED_SCORED_LEAF 207; TOP_LEVEL_SCORED_LEAF 350 |
| Removal risk | LOW 43; POSSIBLE_AMBIGUITY 50; HIGH_REWRITE_REQUIRED 512 |
| Next step | NONE 569; DELETION_CANDIDATE 2; FULL_ITEM_REVIEW 13; BILINGUAL_REVIEW 4; RENDERER_OR_SCHEMA_PLACEMENT_CHECK 16; OWNER_ADJUDICATION 1 |
| Producer conflict | NONE_KNOWN 605 |
| Repair eligibility | NO_CHANGE 569; EXACT_MECHANICAL_REPAIR 20; FULL_ITEM_REVIEW_ONLY 13; BILINGUAL_REVIEW_ONLY 1; RENDERER_OR_SCHEMA_INVESTIGATION 2 |

Final classes: LEGITIMATE_RESPONSE_DEMAND 498; LEGITIMATE_CALCULATION_OR_ROUNDING_INSTRUCTION 39; LEGITIMATE_CLINICAL_FACT 26; LEGITIMATE_CLIENT_QUOTE_OR_TEACHING 2; LEGITIMATE_GOVERNING_PROTOCOL_OR_ORDER 2; LEGITIMATE_OTHER 2; DUPLICATED_RESPONSE_SCAFFOLD 6; RAW_TEMPLATE_OR_SCHEMA_LEAK 10; CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE 11; ITEM_DESIGN_COMPENSATION 2; BILINGUAL_TERMINAL_DEFECT 4; ANSWER_TELEGRAPHING_OR_ADJUDICATION_NOTE 1; AUTHORIAL_CONSTRAINT_LEAK 1; OTHER_CONFIRMED_TERMINAL_DEFECT 1.

Bank counts: burn 8; capnography 7; Claude 20; device 8; Gemini 126; GPT 120; hard-cases 205; I/O 8; lab 20; MAR 8; medication-label 8; visual 57; vitals 10.

Item-type counts: bowtie 25; case_study 48; dropdown_cloze 67; fill_in_blank 50; highlight 21; matrix 83; multiple_choice 176; ordered_response 49; select_all 86.

False-negative families: item-design compensation 1 (1731); construct-scope defense 1 (2235); authorial/exam-process leak 1 (2413).

## Calibration and known-condition reconciliation

- Duplicated dropdown-cloze surfaces: confirmed where ordinary stems duplicate functional `clozeStem`; routed as exact mechanical or placement repairs.
- Fill-in-blank raw placeholders: queues 1486 and 1492 confirmed as literal ordinary-stem leaks requiring renderer/schema investigation rather than deletion.
- Bilingual sentence-boundary control: queue 80 is a segmentation artifact; the complete live stem is parallel and legitimate.
- Queue 1731: Sonnet false negative. The sentence admits omitted neutropenic precautions and defends the option set's serial design; final class `ITEM_DESIGN_COMPENSATION` with construct-scope secondary flag.
- Queue 2413: Sonnet false negative. “still tested on the NCLEX-RN” is test-facing authorial commentary; deletion candidate.
- RSBI and related calculation disclaimers: self-referential “this item/question asks only” surfaces were confirmed and routed to full-item review. Queue 2181 was retained as a legitimate client-specific governing-prescription boundary.
- Malformed tail 2,369–2,673: all 305 live rows were reopened and inspected; queue 2413 was the sole newly confirmed defect. The original Sonnet string evidence was not normalized. The checker tail output is rejected procedurally because it was serialized by prohibited code and used a repeated generic reason for 304 PASS rows.

## False-negative assessment

- Reviewed Sonnet PASS rows: 572.
- `CONFIRMED_PASS`: 568.
- `SEGMENTATION_ARTIFACT`: 1 (queue 80).
- `MISSED_FLAG`: 3 (1731, 2235, 2413).
- `MISSED_REVIEW`: 0.
- `UNRESOLVED`: 0.
- Overall reviewed-PASS miss rate: 3/572 = 0.5245%.
- Live deterministic sample: 260.
- Deterministic-sample misses: 0.
- Deterministic-sample-only false-negative rate: 0/260 = 0.000%.
- Forced/expanded Sonnet-PASS review: 8 unique rows (7 outside sample/tail, 1 overlapping the tail).
- Expansion completed: raw-placeholder/renderer relations; duplicated dropdown surfaces; full item-design-compensation and construct-defense phrase family; all 305 tail rows; calibration and forcing controls.

The numerical and coverage thresholds were met. Salvage criteria were not met because prohibited semantic packaging code was executed and item-specific reason provenance was not retained for most tail PASS rows. Under §13.3, rejection is mandatory.

## Accepted queues (evidence only; no remediation authorization)

- Exact mechanical repair (20): 57, 147, 656, 702, 799, 888, 890, 892, 902, 904, 905, 920, 921, 922, 931, 932, 933, 1103, 1108, 2413.
- Bounded semantic repair: none.
- Full-item review (13): 162, 735, 1731, 2123, 2176, 2178, 2185, 2190, 2219, 2228, 2231, 2235, 2238.
- Bilingual review (1 repair-eligibility row): 226. Four rows carry a bilingual-review next step because related bilingual defects were retained as visible findings.
- Renderer/schema investigation (2): 1486, 1492.
- Owner-decision repair eligibility: none.
- Retained/dismissed explanatory rows: 569 final PASS rows; specifically preserved in `deferred-and-dismissed.jsonl` are queue 80 (segmentation artifact) and queue 2181 (legitimate client-specific protocol boundary).

## Handoff

Outputs are under `audit/terminal-sentence-independent-checker-2026-07-22/gpt-5-6-sol-recommission/`:

- `mechanical-reconciliation.json`
- `checker-population.jsonl`
- `sample-manifest.jsonl`
- `checker-adjudication.jsonl`
- `confirmed-findings.jsonl`
- `deferred-and-dismissed.jsonl`
- `final-report.md`
- `delivery.md`

Confirmed findings: 36. Checker-discovered false negatives: 3. Producer conflicts: 0.

No bank, runtime, schema, prompt, governance, history, ledger, queue, Sonnet batch, or prior audit artifact was mutated. No commit or push occurred. Because the final status is rejection, the architect must not authorize remediation from this set as an accepted checker census; any remediation work order still requires independent architect authorization after a conformant new census.
