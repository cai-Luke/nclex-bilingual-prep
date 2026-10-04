# Evidence index — Deferred Audit Archaeology R1

All findings are advisory archaeology. Paths below are relative to `/Users/holemini/Desktop/Project Shrimp` unless absolute. A `git:<ref>:<path>` entry means the committed object obtained by `git show <ref>:<path>`, not a file assumed present on main. Complete source lists and per-family qualifications are in `adjudication.jsonl`; initial historical leads remain in `candidate-census.jsonl`.

## Snapshot and coverage

- Active commission: `/Users/holemini/.codex/attachments/f0f5b256-ccae-427c-b3ae-0eb5795a4bfe/pasted-text.txt`.
- Opening clean checkout: `review/db-v7-physical-cleanup-claude-2026-09-12-r1 @ bc76e6bac45b399bbf3ce370c3c052735f2ba3c0`.
- Observed external checkout: `main @ d895d851ae5c7b4c29aab74534bf4d4ad44f42e0`.
- Final evidence baseline: `main @ 511f66b7b7cb830649613793f0264725be25d450`.
- Final complete-bank reader capture: **2026-09-13 03:45:12 UTC**. After compaction, all 13 raw bank fingerprints below were rechecked and unchanged.
- Main integration/history: `PROJECT-HISTORY.md:55`. It records DB-v7 acceptance, 18-item Phase-C promotion, and the unfiled omnibus acceptance receipt; its A/B “unreviewed” statement is qualified by the separate committed independent reviews below.
- Campaign 17 producer: `816272456fdf7062c5c62ed9845ac3f8166938df`, local worktree `/Users/holemini/Desktop/Project Shrimp Campaign 17`.
- Campaign 17 independent A/B: `19ae7a7`, branch `review/campaign-17-phase-a-independent-claude-opus-2026-09-12-r1`. These receipts are independent work found by archaeology, not independent review performed by this seat.
- DB-v7 independent receipt: `6dd0150`, now included in main.
- No remote freshness claim: local cached refs and disk/git objects only; no fetch, checkout, commit or push by this seat.

All `banks/*.json` were fully read, parsed and passed the existing strict `validateBankObject` reader from `src/schema.ts`. Counting adds top-level `questions` and each case's `caseStudy.questions`; 145 containers are excluded from scored leaves. Result: **1,967 top-level units + 731 embedded leaves = 2,698 inventory objects; 2,553 scored leaves**. There were no duplicate inventory IDs.

| Bank | Raw bytes | Top-level | Embedded | Raw-byte SHA-256 |
|---|---:|---:|---:|---|
| `banks/burn-canonical.json` | 35,551 | 8 | 0 | `5244b8d37daa49adbd1fbed7991f4ede52ded8ce710e26821841ef5e2ce3719f` |
| `banks/capnography-canonical.json` | 31,101 | 7 | 0 | `36d72a89405fe4400f27b3b8969cdbe1c51f3217151f8b2592b7f877d636f20c` |
| `banks/claude-canonical.json` | 1,173,407 | 96 | 70 | `9777aaad1f40ad7be449a7399e7d3706060a6a8e19d5d54909d121ab8480c69e` |
| `banks/device-canonical.json` | 37,982 | 8 | 0 | `83d5a6ac7219524f4c528265291cbee2ed5b2f17c13fbeb3649342bae2e4aac5` |
| `banks/gemini-canonical.json` | 3,771,078 | 874 | 86 | `fd98f560f93851c82b6c691aeeb3f3897aee3c2bf7a9268d973a0c7c7fff2901` |
| `banks/gpt-canonical.json` | 7,038,003 | 797 | 329 | `2fffca3fd74c38b140d09cf45d88cfc9ee3d88ed3ee2609c5812b1b5eed73fd1` |
| `banks/hard-cases-canonical.json` | 2,095,068 | 66 | 246 | `8af1a86256278900b619f83812087dfb0e940ea349a00ceddef9fe2f079ca8e3` |
| `banks/io-canonical.json` | 44,756 | 8 | 0 | `2ce6488e65049ba00cd9dccf889a042e0a624f224387382d564d282e147b2645` |
| `banks/lab-canonical.json` | 115,364 | 20 | 0 | `1038cb68f6b91f6a2c981562d97ad9e16179db9b1332c75725fd538595c44b05` |
| `banks/mar-canonical.json` | 51,056 | 8 | 0 | `f12c03a28ff5b52411843f84bc942b4ca5667e989194357ed2d60a394f17641e` |
| `banks/medlabel-canonical.json` | 31,725 | 8 | 0 | `cc3bd0053516fc7ea4b23e814e46f186e6d2dbf40888fa713a862c07ea2b3993` |
| `banks/visual-canonical.json` | 305,002 | 57 | 0 | `e42e2a3fa6aa349a61279e6988e250e65c2b752a6f36d33806a2671e0af0f9e4` |
| `banks/vitals-canonical.json` | 51,848 | 10 | 0 | `5154e25492bced8e4a49d763f04e25e154389c31e085bf37669651e13d411b9d` |

These hashes identify raw file bytes, including whitespace and final newline. They are not question payload, Git blob, manifest, or aggregate packet hashes.

## Claim-to-proof map

| Important claim | Sources / stable identities | Current comparison and limit |
|---|---|---|
| Residual-192 / 451 must stay closed | DA-01 owner closeout and R4 final acceptance | Direct owner disposition: resource failure did not prove infeasibility; structural repair removed the semantic census's remediation value. No reopening inference. |
| 66 exceptions remain; successor already reviewed | DA-02 exception manifest; independent A report at `git:19ae7a7` | Exact 66 parent/part joins; 38 distinct complete parents equal R4 `4a11687`. Current findings by bank: Claude 7, Gemini 6, GPT 35, hard-cases 18. Independent disposition totals 17 anchor / 47 content / 2 replacement. Four boundary entries still require content-level decisions. |
| 75 legacy-primary entries already mechanically reviewed | DA-03 independent B report; `findStageReferenceFindings` | 75 current `missingRequiredAnchor` rows / 19 parents; Claude 6, GPT 34, hard-cases 35. Independent report accepts all 75 same-value primary additions. Implementation is not present in current bank payloads. |
| New sibling sufficiency concern | Independent A `FINAL-REVIEW.md:86`; `opus3_iv_potassium_safety_case_01` and its q1–q5 in complete current bank map | Structural confirmation only: five typed-baseline siblings, zero global exhibits. Semantic concern is attributed to that checker. Current 104 staged parents / 548 staged leaves minus 66 fail-open = 482 resolving leaves. |
| 16 temperature counterpart occurrences still exist | DA-04 historical manifest/report; current pure temperature reader | Join owning ID + language + locator suffix after stripping the unstable top-level question index. Exact 16-locator set, 12 owners (11 case parents, one standalone). All locators retained in DA-04. 88,008 inspected fields / 494 temperature occurrences. No new translation cure or clinical adjudication. |
| 1,472 coherence pairs lack this lineage's review record | DA-05 queue and every `audit/early-bank-semantic/coherence/**/*.jsonl` | Queue has 1,783 coherence IDs; 1,782 live. Deduplicate undirected candidate/recommended-pair endpoints: 1,639 total, 1,638 live. Union exact `itemId/pairId` review identities: 234; intersection with live pairs: 166. Difference 1,472; 193 have a matrix endpoint. No claim of absence from every other historical review. |
| Repaired matrix regression supports a targeted revival | DA-05 forensic review/addendum; DA-15 August repair | Historical Pair 40 parent dismissal did not evaluate the child's key; the child-versus-`gemini_b9_05` route lacked review. All eight cured current answer mappings equal `e23962e`. Equality checks keys only, not unrelated prose. |
| Terminal semantic census was not accepted | DA-07 delivery/status/salvage; `gpt-5-6-sol-recommission/final-report.md` alongside listed delivery | 2,673 primary rows; Gemini pilot 0/64 at context limit; 605 checker rows and 260-sample claim ended `CHECKER_REJECT_REQUIRE_NEW_CENSUS`. Later 35-row remediation closes its own changes. P21's current functional definition constrains any new commission. |
| Current Layer-B record gap is 736 tasks | DA-11 current pure builder and old results | Current 1,465 tasks = 2×731 case tasks + 3 distractor tasks. Join `(qid, task, variant ?? null)`: 729 current matches to 823 old rows, 736 unmatched. Identity coverage is not current payload clearance; old exhibit ablation differs from stage visibility. |
| Tapered flowsheet migration is closed | DA-08 ledger and Batch 19/20 adjudications | Resolve all 125 exhibit references from batches 04–09 and 16 in current global/stage exhibits: 125 present; 71 structured with literal ledger references, 54 nonrendering. Existing migration gate is not reissued as a semantic audit. |
| Inner ring remedy status differs from outer closure | DA-13 populations and inner `checker-adjudication.jsonl` | Inner 104 IDs all present, 95 completeItem-equal. Checker adverse set: 13 FIX + 31 RETIRE = 44; all present, 36 completeItem-equal. Outer 108: 58 same IDs present, 57 completeItem-equal. Owner/P31 disposition reconciliation remains a separate question. |
| Provenance / Newest already implemented | DA-17; `git show a233214` | Live script, test, package commands and `src/App.tsx` Newest behavior, checked as implementation evidence. No UI rerun was needed for this read-only backlog classification. |
| Single-row survey maintenance is not clinical audit debt | DA-18 builder/test/saved manifest | Current pure survey yields 24 candidates: 11 one-series lab trends + 13 one-row structured panels. Fresh serialization differs from saved artifact. Current structured-lab count 126, lab-trend count 20. No regeneration performed. |
| Fishbone block was absent populations | DA-20 proof report/population | Proof records 126 panels: CBC 5, BMP 14, expanded 5, NO 102; two required fuller template categories absent. Historical proof block does not establish resource failure. No clinical template thresholds invented here. |
| Topics and bowtie exclusions have later closure | DA-23/24 | Current `src/topics.ts` canonical/declared-license check: 0 mismatches among 2,698 objects, not clinical assignment certification. Paired roster resolves 31 candidates + 31 companions; separate Phase-C R5 roster resolves 19/19 candidate IDs. Combined historical 50 is not all 164 current bowties. |
| Phase-B specific confirmation remains unlocated | DA-25 `status-stage-3.log`, publication freeze and later ledger/history | Publication and content review exist; exact independent post-regeneration census-confirmation act has no located closing receipt in the inspected lineage. Later aggregate census success is insufficient evidence. DA-25 alone is marked incomplete. |
| P31 reconciliation remains draft | DA-29 R5 draft and inner checker artifacts | Work order explicitly not frozen; scopes 104 original IDs, 67 checker rows and 23 raw checker files. No execution terminal found in the inspected paths/git lineage. Absence is bounded to that inspected evidence, not private owner decisions. |

## Comparison register

The archaeology does not compare unrelated digest conventions. Direct object comparisons below deliberately avoid historical hash transformations.

| Historical artifact/object | Historical value / method | Current object / method | Comparable? Result |
|---|---|---|---|
| R4-era GPT file, explicitly reproduced in `audit/quarantined-content-intake-2026-09-11-r1-independent-review-and-promotion.md:42` | `154c31f860790d5e90f23dae2dabfd31fba32ca46cc53a38b038cc56af30d469`; raw-file-byte SHA-256 | Final `banks/gpt-canonical.json`; raw-file SHA-256 `2fffca3fd74c38b140d09cf45d88cfc9ee3d88ed3ee2609c5812b1b5eed73fd1` | Yes, file-byte domains. Different files: +6 reviewed intake and +18 Phase-C items since 773-item R4 bank. Inequality is not evidence of exception-payload drift. |
| Post-six-item intake GPT, same receipt line 45 | `a4b7d10a7c0a0e6bdb9bbbc4cb34c726a889ee35b6340171e6015f6e8af27004`; raw-file SHA-256, also observed at d895d85 | Same final raw file/hash above | Yes. Later 18-item promotion explains the new bank snapshot; this is not a per-question unchangedness proof. |
| 13-bank capture at 03:45:12 | Raw SHA-256 values in table above | Final reread of all same paths with Python `hashlib.sha256(path.read_bytes())` | Yes; all 13 equal on final recheck. |
| R4 66 exception parents from `git show 4a11687:banks/<name>` | No historical digest used; complete parsed parent objects | Complete current parent object by stable ID; parsed-object deep equality without field removal | Direct comparable objects; all 38 distinct parents equal, covering all 66 exception rows. Git ref is retrieval identity, not a payload digest. |
| Inner/outer construct `population.jsonl` | `completeItem` parsed JSON, historical digest ignored | Complete current object by ID; recursive parsed-object equality | Comparable payloads. Inner 95/104 equal; adverse subset 36/44 equal; outer 57/58 live same-ID objects equal. No domain mismatch. |
| Single-row saved `survey-manifest.json` | Complete UTF-8 saved bytes; no digest used | Current builder output via `serializeSingleRowLabPanelsSurvey` (`JSON.stringify(..., null, 2) + newline`) | Same intended serialized-artifact domain. Direct string inequality only; no field-level clinical claim. |
| Historical checker packet-set rollup discussed in DA-01 closeout | Previously reported non-reproducible rollup convention; not reconstructed in this run | No comparable current packet-set hash constructed | **No comparison performed.** Neither current bank SHA nor Git SHA substituted for that rollup. No drift conclusion. |

## Read-only reproduction notes

Run from the recorded repository root. These describe the reader operations used; they do not authorize dispatch of the recommended semantic audits or regeneration of historical artifacts.

1. **Complete bank universe:** enumerate sorted top-level `banks/*.json`; read every byte; parse `questions`; add each `caseStudy.questions` child; assert unique IDs. Keep filename, ID, owning parent and current locator. Hash raw bytes separately from parsed payloads.
2. **References:** import `findStageReferenceFindings` from `scripts/audit/audit-stage-refs.ts` and call it with fully parsed banks. Its implementation and `src/caseVisibilityBoundary.ts` own the primary/legacy/fail-open semantics. DA-02/03 preserve the exact current finding identities.
3. **Temperature:** call only the exported `scanBundledTemperatureProse` from `scripts/audit/temperature-prose-unit-survey.ts`; join its residuals as described above. Do not run a write-mode CLI.
4. **Coherence:** full-file parse the saved Layer-A JSONL; select coherence entries and their recommended pair IDs, sort each pair's two IDs and deduplicate. Form the historical review set from every nested coherence JSONL row carrying `itemId` and `pairId`; union, then intersect the live endpoint set. Count matrix endpoints from current objects.
5. **Layer B:** use the pure current builder `buildLayerBQueue` in `scripts/audit/non-mcq-bias-layer-b.ts` with the current report from its shared library. Compare task keys with the complete old JSONL. Do not invoke the generator CLI, which would overwrite historical queue artifacts.
6. **Payloads:** obtain R4 banks from local git objects, parse, and join parent IDs; compare complete objects. Construct-ring comparisons join `completeItem` to current complete item. Matrix cure comparison restricts itself explicitly to `correct`.
7. **Single-row:** import `buildSingleRowLabPanelsSurvey` and `serializeSingleRowLabPanelsSurvey` without invoking CLI main; compare to the existing saved manifest in memory. No test-directed regeneration.
8. **Runtime:** pure TypeScript imports were run with `TSX_DISABLE_CACHE=1 node --import tsx --input-type=module` and stdin. A prior `tsx -e` top-level-await failure was an invocation incompatibility, not a bank-read failure.
9. **Source discovery:** `rg`/tracked-file and git-history searches supplied leads. A separate full mechanical Markdown pass enumerated 990 relevant files, 816 with hits and 7,954 keyword lines. This is a discovery metric; all bank assertions used the full-file methods above.

No aggregate audit, browser suite, build, census regeneration, promotion, content review or repair was commissioned or performed by this run. Strict parsing and existing pure readers establish current populations for the archaeology.

## Per-family source index

### DA-01 — Stage-reference semantic census and residual-192 R1/R2/R3 lineage

- `scratch/CAMPAIGN-16-PHASE-E-RESIDUAL-192-OWNER-CLOSEOUT-DISPOSITION-2026-09-08.md`
- `audit/campaign-16-anchor-boundary-repair-2026-09-09-r1/final-acceptance.md`

### DA-02 — Campaign 16 surviving boundary exceptions

- `audit/campaign-16-anchor-boundary-repair-2026-09-09-r1/exceptions.jsonl`
- `audit/campaign-16-anchor-boundary-repair-2026-09-09-r1/final-acceptance.md`
- `/Users/holemini/Desktop/Project Shrimp Campaign 17/audit/campaign-17-residual-successor-2026-09-12-r1/HANDOFF.md`
- `git:19ae7a7:audit/campaign-17-phase-a-independent-review-claude-opus-2026-09-12-r1/FINAL-REVIEW.md`

### DA-03 — Legacy primary-anchor findings outside Campaign 16

- `audit/campaign-16-anchor-boundary-repair-2026-09-09-r1/verification.md`
- `git:19ae7a7:audit/campaign-17-phase-b-independent-review-claude-opus-2026-09-12-r1/FINAL-REVIEW.md`
- `src/caseVisibilityBoundary.ts`
- `scripts/audit/audit-stage-refs.ts`

### DA-04 — Temperature bilingual counterpart residual / Phase F

- `audit/temperature-prose-unit-survey-2026-07-21/manifest.jsonl`
- `audit/temperature-prose-unit-survey-2026-07-21/residual-adjudication-report.md`
- `scripts/audit/temperature-prose-unit-survey.ts`

### DA-05 — Early-bank coherence candidate coverage beyond bounded pilots

- `audit/early-bank-semantic/CAMPAIGN-STATUS.md`
- `audit/june13-matrix-swap-regression-2026-08-25/forensic-review/03-audit-workflow-analysis.md`
- `audit/early-bank-semantic/layer-a-queue.jsonl`
- `Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-25-ADDENDUM-2026-08-25.md`
- `scripts/audit/early-bank-semantic-layer-a.ts`

### DA-06 — Early-bank currency and mixed-provenance remainder

- `audit/early-bank-semantic/CAMPAIGN-STATUS.md`
- `audit/early-bank-semantic/currency/12-approved-execution.report.md`
- `audit/early-bank-semantic/currency/13-opus-currency-claude-exception.report.md`

### DA-07 — Terminal-sentence census and rejected independent salvage

- `audit/terminal-sentence-sonnet-review-2026-07-21/delivery.md`
- `audit/terminal-sentence-independent-checker-pilot-2026-07-22/gemini-3-1-pro-high/delivery.md`
- `audit/terminal-sentence-independent-checker-2026-07-22/gpt-5-6-sol-recommission/delivery.md`
- `TERMINAL-SENTENCE-INDEPENDENT-CHECKER-SALVAGE-SPEC-2026-07-22.md`
- `audit/terminal-sentence-remediation-2026-07-22/delivery.md`

### DA-08 — Flowsheet extraction tapered checker coverage and skip-class semantics

- `EXHIBIT-FLOWSHEET-MIGRATION-LEDGER-2026-07-05.md`
- `Archive/exhibit-flowsheet-migration-2026-07-13/EXHIBIT-FLOWSHEET-MIGRATION-BATCH-19-ADJUDICATION-2026-07-06.md`
- `Archive/exhibit-flowsheet-migration-2026-07-13/EXHIBIT-FLOWSHEET-MIGRATION-BATCH-20-ADJUDICATION-2026-07-06.md`

### DA-09 — WBC/platelet ordinary-row sampled inventory checker

- `audit/wbc-platelet-prose-unit-inventory-2026-07-19/sonnet-check.md`
- `audit/wbc-platelet-prose-unit-inventory-2026-07-19/codex-remediation-report.md`
- `audit/wbc-platelet-prose-unit-inventory-2026-07-19/codex-corrected-manifest.jsonl`
- `scripts/audit/wbc-platelet-prose-unit-remediation.ts`

### DA-10 — Implicit or missing WBC/platelet unit prose

- `audit/wbc-platelet-prose-unit-inventory-2026-07-19/codex-remediation-report.md`
- `scripts/audit/wbc-platelet-prose-unit-remediation.ts`

### DA-11 — Non-MCQ Layer B inferability and sampled distractor review

- `audit/non-mcq-bias-layer-b-results.jsonl`
- `audit/non-mcq-bias-final-report.md`
- `scripts/audit/non-mcq-bias-layer-b.ts`
- `scripts/audit/non-mcq-bias-lib.ts`

### DA-12 — Visual-kind structural statistical audit

- `Archive/Fixtures/non-mcq-bias-audit-spec.md`
- `scripts/audit/non-mcq-bias-lib.ts`

### DA-13 — Scored-format construct inner and July 16 outer-ring review

- `audit/scored-format-construct-audit-2026-07-21/report.md`
- `audit/july16-coverage-construct-audit-2026-07-21/report.md`
- `audit/july16-coverage-construct-audit-2026-07-21/bank-implementation-closeout.md`
- `scratch/JULY21-P31-DEPARTURE-RECONCILIATION-CODEX-WORK-ORDER-2026-08-24.md`

### DA-14 — Case-completion semantic residual: CAR-T and code-status

- `audit/case-completion/FINAL-ARCHITECTURE-REPORT.md`
- `BANK-REVIEW-LEDGER.md`

### DA-15 — June 13 deferred Priority-2 matrix independent verification

- `audit/june13-matrix-swap-regression-2026-08-25/independent-acceptance/`
- `audit/june13-matrix-swap-regression-2026-08-25/repair-report.md`
- `Archive/root-cleanup-2026-07-03/ADVERSARIAL-AUDIT-FINDINGS-2026-06-25-ADDENDUM-2026-08-25.md`

### DA-16 — Rhythm visual debt after token-budget handoff

- `Archive/root-cleanup-2026-07-02/rhythm-strip-pacemaker-overlay-codex-spec.md`
- `audit/rhythm-strip-bucket-1b-conversions-2026-07-01/README.md`
- `PROJECT-HISTORY.md`
- `src/visuals/kinds/rhythmStrip.ts`

### DA-17 — Bank provenance and Preview Lab Newest negative control

- `scratch/PREVIEW-LAB-NEWEST-ADDITIONS-CODEX-WORK-ORDER-2026-08-21.md`
- `scripts/bank-provenance.ts`
- `scripts/tests/bank-provenance.ts`
- `package.json`
- `src/App.tsx`

### DA-18 — Single-row lab survey stale saved-manifest baseline

- `audit/single-row-lab-panels-survey-2026-07-18/`
- `scripts/single-row-lab-panels-survey.ts`
- `scripts/tests/single-row-lab-panels.ts`

### DA-19 — Automated browser regression coverage when tooling available

- `scripts/tests/db-v7-browser.mjs`
- `audit/ux-0b-r1-2026-09-11/implementation-receipt.md`
- `audit/review-vocab-omnibus-r1/db-v7-physical-cleanup-r1/independent-review/verdict.md`

### DA-20 — Fishbone lab-presentation proof-render fast-follow

- `scratch/FISHBONE-LAB-PRESENTATION-PROOF-RENDER-WORK-ORDER-2026-08-19.md`
- `audit/fishbone-proof-render-2026-08-19/proof-report.md`
- `audit/fishbone-proof-render-2026-08-19/population.json`

### DA-21 — Vital-sanity source survey and R5 implementation prerequisite

- `scratch/R5-VITAL-SANITY-PRODUCTION-IMPLEMENTATION-WORK-ORDER-2026-08-19.md`
- `src/measurementAllowlist.ts`
- `audit/vital-sanity-bounds-survey-2026-08-19-post-r5/`

### DA-22 — CI coverage survey and R6 gate expansion

- `audit/ci-coverage-survey-2026-07-23.report.md`
- `scratch/R6-CI-EXECUTION-STATUS-CLOSEOUT-WORK-ORDER-2026-08-20.md`
- `.github/workflows/promotion-gate.yml`

### DA-23 — Topic residual and Burn Management category audit

- `audit/topic-license-adjudication-2026-07-16.report.md`
- `TOPIC-VOCABULARY-DECISIONS.md`
- `audit/topic-license-adjudication-2026-07-16.manifest.json`
- `src/topics.ts`

### DA-24 — Standalone bowtie paired census and initially excluded unpaired ring

- `audit/standalone-bowtie-answerability-census-2026-08-23/report.md`
- `audit/campaign-16-phase-c-closeout-2026-08-28-r6/closeout.md`
- `BANK-REVIEW-LEDGER.md`
- `audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/population.jsonl`

### DA-25 — Quarantined FIX content recovery / census checker follow-through

- `audit/quarantined-content-intake-2026-09-11-r1-terminal-receipt.md`
- `audit/campaign-16-phase-b-recovery-2026-08-27/status-stage-3.log`
- `audit/campaign-16-phase-b-recovery-2026-08-27/publication-freeze.json`
- `audit/quarantined-content-intake-2026-09-11-r1-independent-review-and-promotion.md`

### DA-26 — Sampled governance cleanup versus full migration review

- `audit/decisions-migration-2026-07-29/FRESH-FULL-REVIEW-DISPOSITION-2026-08-07.md`
- `audit/decisions-migration-2026-07-29/INDEPENDENT-CONTENT-REVIEW-2026-08-18.md`

### DA-27 — Finite-signature leakage audits versus semantic coverage

- `audit/authorial-constraint-leakage-2026-07-21/remediation-report.md`
- `audit/producer-vocabulary-leakage-2026-07-21/codex-remediation-report.md`
- `audit/producer-vocabulary-leakage-2026-07-21/independent-review-report.md`

### DA-28 — Current DB v7 deferred cleanup and independent review control

- `audit/review-vocab-omnibus-r1/implementation-receipt.md`
- `audit/review-vocab-omnibus-r1/db-v7-physical-cleanup-r1/implementation-receipt.md`
- `audit/review-vocab-omnibus-r1/db-v7-physical-cleanup-r1/independent-review/verdict.md`
- `PROJECT-HISTORY.md`

### DA-29 — July 21 P31 checker-seat departure reconciliation

- `scratch/JULY21-P31-DEPARTURE-RECONCILIATION-CODEX-WORK-ORDER-2026-08-24.md`
- `audit/scored-format-construct-audit-2026-07-21/checker-adjudication.jsonl`
- `audit/scored-format-construct-audit-2026-07-21/population.jsonl`
- `audit/scored-format-construct-audit-2026-07-21/checker-batches/`

## Operations and preservation

- Execution began **2026-09-13 03:29:05 UTC**.
- Final elapsed-time and preservation observation: **2026-09-13 04:02:32 UTC; about 33 minutes 27 seconds from the first tool clock to final validation**.
- **29** candidate families; **29** classifications; **28** complete current-state checks; **one** incomplete specific-receipt question (DA-25). One high-value revival, two possible revivals; all ten allowed classifications are tabulated in the report, including zero-count categories.
- **One context compaction.** Recovery reread the exact active pasted work order, branch/HEAD/status/diff and already-written artifacts; retained prior verification only after confirming relevant live inputs. External branch/integration changes were independently detected and reconciled before that recovery.
- Large GPT/Gemini files were fully read. No large-file input limitation. Broad Markdown/file-list and JSONL display outputs exceeded the tool-output budget; these were not used for absence proofs. Narrow source reads and direct programmatic parsing supplied the final facts.
- Major inefficiencies: broad keyword/file-list noise, duplicate lineage artifacts, tool-output truncation, mutable shared checkout, and retrieval of successor evidence from separate local branches. No exact token/dollar measurement is claimed.
- Stage A's first 28 records were written before Stage B; DA-29 is explicitly a late discovery recorded before its own adjudication. Every census/adjudication ID has a one-to-one counterpart.
- Only the four requested files were written by this seat in `audit/deferred-audit-archaeology-2026-09-12-r1/`. The neighboring `audit/deferred-audit-archaeology-2026-09-12-flash-r1/` appeared concurrently and was left untouched and unused as evidence.
- Final preservation check: **HEAD remained 511f66b7b7cb830649613793f0264725be25d450; tracked diff against HEAD was empty; all 13 bank fingerprints matched the recorded baseline; only the two isolated untracked archaeology directories appeared in status. Exactly the four requested files exist in this seat’s directory. All 29 candidate/adjudication IDs join one-to-one, all cited evidence paths resolve, and every revival row includes workload and independent-checking requirements**.
- No delegation; no independent-checker role claimed; no canonical/raw bank, production code, governance or review-status edits; no commits/pushes.

