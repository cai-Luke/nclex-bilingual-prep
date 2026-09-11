# Campaign 16 R4 — Architect conformance review

Date: 2026-09-11
Scope: post-executor conformance and next-step recommendation.
Disposition: implementation conformance supported by inspected source, diffs, and execution evidence; final acceptance remains pending only the H.3.5 independent census confirmation.
This report is not a new semantic adjudication, a replacement checker freeze, a publication authorization, or a claim that every original finding is repaired.

## 1. Access, evidence, and limits

The review used the Desktop_Repositories connector to read the live local Project Shrimp working tree, not the GitHub copy. Live branch inspection reported main tracking origin/main. The most recent commit was a639b5f; the executor's full recorded HEAD is a639b5fe7f6816e68228d7dc13d068c0c0f69e91. No remote fetch was performed.

The live status showed seven unstaged tracked modifications: the four affected canonical banks, BANK-REVIEW-LEDGER.md, census.json, and BANK-CENSUS.md. The commission artifacts and frozen inventory are additional local untracked evidence. The review inspected the complete returned diffs of all seven tracked files.

Other inspected material includes the live AGENTS.md, DECISIONS.md, current PROJECT-HISTORY.md status, R4 work order, executable boundary/type/schema/audit contracts, standard P15 patch engine, raw gate, the comparison and patch orchestration implementations, schema bump implementation and receipts, preservation implementation and receipt, structural verifier core and result summary, census reconciliation implementation and receipt, finalizer, executor manifest, verification records, the four direct typed-baseline regression logs, smoke/build/recheck receipts, all 66 exception records, and both frozen semantic packets for repair-019. The checker freeze's disclosed limitations were also reviewed.

The connector does not provide general shell execution. I did not rerun the test suite, recompute every live file hash, inspect all source parents semantically, or rehash all 54 frozen semantic packets. Execution results and byte-preservation assertions are attributed to their recorded evidence; the current diff and source review are independent observations. This is not a second 451-row content review. The conformance inspection itself changed no bank, build, ledger, census artifact, source file, or Git state. This report is subsequently being recorded as a new review artifact inside the existing commission directory.

Commission-relative paths below refer to:
audit/campaign-16-anchor-boundary-repair-2026-09-09-r1/

Governing work order:
scratch/CAMPAIGN-16-PHASE-E-451-BOUNDARY-REPAIR-WORK-ORDER-2026-09-09-R4.md

## 2. Executive conclusion

Keep the 385 repairs. I found no implementation defect in the inspected material that justifies reverting them, reopening the frozen judgments, or repeating the full semantic commission.

The executor correctly claims only:
451 = 369 repairedBaseline + 16 repairedStage + 66 exceptions.
The repair fraction of this frozen population is 85.37%; this is not an estimate of clinical correctness or freedom from all answer leakage.

One acceptance matter remains: Claude/Opus must supply the explicitly required independent census confirmation. The owner has confirmed that the recorded production smoke receipt accurately reflects the checks actually performed.

After this matter is closed, R4 should be accepted and serialized as partial remediation, with the 66 exceptions retained explicitly. Work on those exceptions should be a separate, bounded successor task.

Sources: R4 §§E.1–K; closeout.md; comparison.md; bank-preservation.json; census-reconciliation.json; production-file-smoke-receipt.json.

## 3. Conformance findings

### 3.1 The comparison implements the frozen acceptance rule

tools/compare-frozen.py validates row identities and the legal boundary representations, then applies the two-seat rule mechanically. Disagreement, either explicit exception, either non-HIGH confidence, or either non-PARALLEL bilingual relation produces an exception. Same-disposition STAGE judgments must name the same exact stage. No third model judgment or post-freeze explanation can rescue an otherwise rejected row.

comparison-freeze.json records the four required comparison artifacts frozen before canonical mutation. The comparator's recorded self-test covers 1,296 combinations of boundary/confidence/parity states. The implementation does not use narrative persuasiveness to override the acceptance predicate.

The three checker MEDIUM rows and one checker EXCEPTION are retained among the final exceptions. The documented repair-012 confidence amendment was before the complete checker freeze and reduced eligibility; the superseded hash is retained. The metadata-only orientation exposure and uniquely resolvable abbreviated stage references in evidence prose are disclosed limitations, not demonstrated producer-judgment contamination.

Conclusion: no E.1 override or third adjudication found in the inspected comparison implementation and receipts.

Sources: R4 §E.1; tools/compare-frozen.py; comparison-freeze.json; exceptions.jsonl; checker-freeze.json.

### 3.2 Canonical mutation remained narrow

| Bank | Baseline | Stage | Exceptions | Field additions |
|---|---:|---:|---:|---:|
| claude-canonical.json | 46 | 5 | 7 | 51 |
| gemini-canonical.json | 38 | 2 | 6 | 40 |
| gpt-canonical.json | 201 | 7 | 35 | 208 |
| hard-cases-canonical.json | 84 | 2 | 18 | 86 |
| Total | 369 | 16 | 66 | 385 |

The live bank diff contains the authorized primary-anchor additions and four schemaVersion changes, with the associated JSON comma/formatting changes. I found no stem, option, answer, rationale, ID, stage, or legacy-anchor edit in that diff.

The live type and validator support the exact typed baseline object at the approved schema floor. The four receiving banks each contain accepted baseline rows, so all four conditional floor changes are justified. The schema-floor receipts and patch receipts form the expected opening → bumped → patched sequence for each bank.

tools/bump-schema-floor.ts requires a single authorized bank, exact opening hash and version, positive baseline population, validation, restoration equality, and atomic write. The recorded synthetic tests cover 12 cases. The standard scripts/patch-raw.ts supplies the exact undefined precondition and unique ID selectors for part-field additions; it was not broadened to edit envelopes.

Conclusion: the inspected implementation and actual diff respect §§B/F. The runtime/schema implementation itself remains unchanged.

Sources: live bank diff; src/types.ts; src/schema.ts; src/caseVisibilityBoundary.ts; tools/bump-schema-floor.ts; tools/stage3-plan.ts; tools/stage3-apply.ts; schema-floor-receipts.json; patch-application-receipts.json.

### 3.3 Preservation is a positive equality proof

tools/verify-preservation.ts does more than count repaired fields. It restores the permitted changes in a copy of each final parsed bank and checks equality with the opening bank, separately checks every exception part, compares legacy anchors and topology, and verifies that no outside primary anchor changed.

The recorded result checks all 13 banks, with nine byte-identical and four changing only within the authorized surface. It also reconciles the remaining audit identities to the 66 exception identities.

The structural verifier uses the live shared boundary classifier/resolver and checks the exact accepted mapping, legacy-field absence, stage-list preservation, and the repaired/exception partition. It explicitly does not pretend to prove semantic correctness or replace full preservation.

Conclusion: the proof design matches R4 §§G/H.1. The observed tracked diff is consistent with the recorded proof, although I did not independently execute it in this connector session.

Sources: tools/verify-preservation.ts; bank-preservation.json; tools/verify-boundaries.ts; post-repair-verification.json; live diff.

### 3.4 Verification deviations were disclosed appropriately

The four named typed-baseline npm aliases are absent from the pinned package.json. The executor logged the literal command failures and ran the existing implementations directly:
```text
scripts/tests/typed-baseline.ts
scripts/tests/typed-baseline-scanner.ts
scripts/tests/typed-baseline-survey.ts
scripts/tests/typed-baseline-ui.ts
```

I read the recorded successful direct-run logs. This is a work-order command-name defect handled transparently, not four hidden failed regressions. Adding aliases was not necessary to satisfy the substantive test obligation and would have expanded the change surface.

The strict stage audit remains an expected failure because 66 revealsAllStages findings remain. The separate 75 missingRequiredAnchor findings are legacy-primary conformance debt: the live audit distinguishes them from fail-open leakage because the legacy anchor still resolves. They must not be presented as another 75 equivalent leak cases.

The single-row-lab-panels saved-manifest failure remains an explicitly admitted pre-existing failure. The executor did not rerun it here or relabel it as a passing final-bank test.

Conclusion: no reason found to repeat the full suite merely for ceremony. Preserve the precise recorded exceptions and direct-command equivalence.

Sources: package.json; evidence/verification-tests.json; evidence/typed-baseline*-direct.log; verification.md; scripts/audit/audit-stage-refs.ts; R4 §H.2.

### 3.5 Census movement is correct on the inspected diff, but the named independent gate is still open

The live census diff changes four per-bank schema values and the corresponding version grouping, plus normal generated timestamp/input-commit metadata.

Before: schema 1.2 = 77 session units; schema 2.0 = 1,800; schema 1.8 = 66.
After: schema 1.2 = 77; schema 2.1 = 1,809; schema 2.0 = 57.

The four moved banks contain 96 + 874 + 773 + 66 = 1,809 session units. This number describes entire bank envelopes, not the number of repaired embedded parts. Total session units remain 1,943; standalone items 1,798; case containers 145; embedded parts 731; inventory records 2,674.

tools/reconcile-census.py constructs an expected after-image from the opening census plus the approved changes, then compares the complete JSON and Markdown, rather than accepting arbitrary regenerated output.

The receipt nevertheless records the producer-independent census confirmation as pending before acceptance, with Claude Code / Claude Opus 5 named. This architect review does not impersonate that seat. The remaining assignment is small: independently confirm the version movement, accepted-baseline justification, unchanged counts, and final input identities. It is not a new semantic census.

Sources: live census.json and BANK-CENSUS.md diff; tools/reconcile-census.py; census-reconciliation.json; R4 §H.3.5.

## 4. Production smoke provenance confirmed

The on-disk production-file-smoke-receipt.json records Luke as the external witness, approximate observation time 2026-09-11 00:23 ET, Chrome, no rebuild, and PASS for all four criteria. Its build digest is d0d36ea66c237c02ba8281cfe1e209d4b1410737bff8596e0f75902014f1665c. The executor records a subsequent unchanged-built-tree/source/bank hash check.

After this conformance review initially questioned whether the assistant-authored reporting template had exceeded the observation actually performed, Luke explicitly confirmed that the template was accurate: he had clicked through the site and performed the recorded smoke checks. The on-disk receipt therefore correctly represents the owner's observation.

No corrective addendum, repeat smoke, rebuild, or re-binding is required. The smoke gate is satisfied and is not a remaining acceptance dependency.

Sources: owner confirmation in the commissioning conversation; production-file-smoke-receipt.json; production-file-smoke-build-identity.json; evidence/production-file-post-witness-recheck.json; R4 §H.5.

## 5. What the 66 exceptions mean

The following is a documentary regrouping of the frozen exception records, not a new verdict on any boundary.

| Mutually exclusive group | Rows |
|---|---:|
| Baseline-versus-stage disagreement | 48 |
| Different stage IDs | 2 |
| At least one explicit semantic EXCEPTION | 14 |
| Exact stage agreement rejected only for checker MEDIUM confidence | 2 |
| Total | 66 |

One of the two different-stage-ID rows also has checker MEDIUM confidence. The 14 explicit exceptions comprise 13 producer exceptions and one checker exception. Of the 48 baseline/stage disagreements, 44 are producer STAGE versus checker BASELINE and four run the other direction.

The 66 rows occupy 38 parents: four Claude-bank parents, five Gemini-bank parents, 17 GPT-bank parents, and 12 hard-cases parents. Any successor content work should therefore retain parent-whole context rather than treat them as 66 isolated prompts.

### 5.1 The dominant disagreement is about the status of information in the part

The two frozen repair-019 packets show the distinction directly. For the clozapine case q2, the producer requires the chart update to establish which findings actually occurred. The checker treats the values repeated in the choices as sufficient input for interpretation against baseline comparators. For the lateral-incivility q3, the producer treats the exact charted notification threshold as necessary to support the complete keyed proposition; the checker treats the restated symptomatic situation as enough for the priority judgment.

Neither pair is resolved by counting votes. A successor needs to distinguish:
- classification of stipulated or hypothetical findings supplied by a stem, matrix row, segment, or choice;
- deciding which proposed findings or interpretations are true of the current patient, which may require the chart;
- a later stage that supplies necessary observations;
- a later stage that supplies the answer or confirmation instead.

An answer option is not automatically an established chart fact. Conversely, a genuinely hypothetical classification question need not wait for the chart to confirm that its proposed finding occurred. This is the diagnostic issue to investigate, not a new blanket boundary rule.

I am not changing either frozen judgment or asserting a new accepted boundary.

Sources: exceptions.jsonl; producer/repair-019.json; checker/repair-019.json.

### 5.2 Explicit content concerns deserve a separate source-checking queue

The 14 explicit-exception records include concerns about unsupported clinical premises, bilingual timing differences, conflicting rationale statements, an incorrect stage reference, an ambiguous ordering key, and a nutrition-route distinction. Examples are the cirrhosis q2 rationale inconsistency, the COPD teaching Stage 1/Stage 2 reference, and the mucositis/TPN question's distinction between enteral feeding and oral swallowing.

These are recorded concerns, not newly verified medical errors in this report. They should not be suppressed as mere anchor disagreement or blindly “fixed” from this prose. The successor should confirm each concern from the complete current parent and authoritative clinical sources where applicable, then propose a bilingual repair with independent review.

Changing an anchor cannot solve every kind of content ambiguity. Nor is lowering confidence requirements retroactively an appropriate way to turn exceptions into repairs.

Sources: exceptions.jsonl; R4 §§A/B/E.1; DECISIONS.md P5/P8/P15/P23.

### 5.3 Structural repair does not imply full answer-leakage closure

Of the 385 repaired parts, 369 use baseline. This is legitimate within the accepted representation; it is not itself evidence of a bug. The checker also records title-level disclosures and repeated content in part surfaces. R4 prohibited rewriting those surfaces.

Therefore the accepted claim is narrower than “385 questions are now leak-free.” The repair removes the missing-anchor fail-open path for 385 identities. It does not certify every title, option, sibling part, or progression interaction, and it does not introduce true per-part locked unfolding.

Sources: checker-freeze.json limitations; R4 §§A/B/G/K; DECISIONS.md P23; src/examLayout.ts.

## 6. Recommended sequence

### A. Complete the remaining acceptance matter

Obtain Claude/Opus's H.3.5 census review against the current final bank/census identities. The production smoke provenance is confirmed and requires no further action. Do not reopen the 451-row judgments.

### B. Close and serialize R4 as partial remediation

Once those conditions are satisfied, record final acceptance and update PROJECT-HISTORY.md in the authorized publishing pass. Keep the 66 exceptions and the explicit subset-only mechanism terminal. Commit/push/publication require a separate owner authorization; this review supplies none.

Before assembling a remotely reviewable package, check evidence coverage. The live .gitignore excludes *.log, scratch/, and dist/. The current executor manifest refers to log files; the work order is under scratch/. A normal add of currently untracked directories is not proof that every linked evidentiary input will be available remotely. Use an explicit evidence inventory or preserved archive as appropriate, without adding unrelated scratch material or sealed controls. Keep the original hash-bearing evidence intact.

### C. Treat the residual as a separate bounded content task

Start with a parent-grouped triage inventory for the 66 rows, using the existing two-sided evidence. Give the explicit content concerns first source-checking priority. For the boundary-disagreement group, name the exact missing proposition or source of ambiguity before deciding whether an anchor-only repair is defensible.

Where the item needs changed wording, context, key, or rationale, commission that change explicitly with fresh independent review. Preserve the old R4 result as history. Do not graft a third adjudicator onto E.1, use Gemini shadow output as governing acceptance, or apply a universal baseline/stage rule.

Current project policy favors repairing/replacing an embedded part in its parent context; deleting isolated leaves or retiring whole parents requires the applicable separate authority and justification. This is not authorization to remove content.

### D. Keep unrelated maintenance distinct

The 75 legacy-only primary-anchor findings, missing npm aliases, known saved-manifest drift, and learner-interface polish should not be smuggled into R4. After serialization, give selected maintenance or UI work a clean branch/worktree and bounded verification. The remaining 66 need not keep the completed 385 in a perpetual dirty-worktree commission.

## 7. Decision boundary

Recommended disposition:
- Engineering/spec execution: satisfactory on the inspected evidence; no new implementation blocker identified.
- Full R4 acceptance: pending independent census confirmation only.
- Scope closure: repaired subset only, 385 repaired and 66 unchanged exceptions.
- Clinical correctness / complete leakage removal: not certified.
- New semantic adjudication, bank mutation, census regeneration, or publication: not authorized by this report.

The practical next agent assignment is the bounded Claude/Opus census confirmation, not another full-model opinion on all 451 rows.
