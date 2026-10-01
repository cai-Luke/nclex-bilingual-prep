# Final content backfill — October 1, 2026

**Status: discovery kickoff. Ten provisional decisions; at most one new standalone item per admitted decision. Begin with FB-01 through FB-06.** This is a finite roster, not a ten-item quota or a claim that these are the last ten gaps in the entire bank.

The campaign earns additions through a missing nursing decision, evidence against nearby existing questions, and the normal review/promotion path. A dropped candidate leaves an unused slot. Separate remediation continues under its existing work orders.

## What is established

Discovery used the pushed `main` snapshot at [`b41a91f3419726ad3bda72464cf20dbcc0496eca`](https://github.com/cai-Luke/nclex-bilingual-prep/commit/b41a91f3419726ad3bda72464cf20dbcc0496eca), committed September 17. All 13 canonical bank downloads matched the Git blob identity and byte length. The repository's actual population collector reproduced the committed census counts and distributions.

| Population | Recomputed count |
|---|---:|
| Session units | 1,967 |
| Standalone scored items | 1,822 |
| Case containers | 145 |
| Embedded scored items | 731 |
| Total scored leaves | 2,553 |

Case containers are not extra scored items. The inspected census has no shortage for the current 50-question standalone session. Canonical presence does not provide a new clinical-correctness or review-eligibility verdict. See [baseline.json](baseline.json) for exact bank hashes, source identities, distributions and the checks performed.

**The current Mac worktree was unavailable.** Its unpublished bank changes, raw work and active remediation may defeat these candidates. The September 13 census timestamp remains unchanged; recomputing its numbers against a pushed snapshot does not establish freshness of the local worktree. No question has been authored, admitted or promoted by this kickoff, and no independent content acceptance has occurred.

## Finite roster

The [candidate register](candidate-register.json) contains each decision's exact nearby IDs and paths, query references, source work, design boundary and disposition fields. All ten currently remain `PROVISIONAL_DISCOVERY`.

| ID | Priority | Decision to investigate | Distinction that must survive authoring |
|---|---|---|---|
| FB-01 | First pass | Authorized newborn transfer | Verify the requesting person's authority to take custody under the stated unit process. Patient identification alone does not close it. |
| FB-02 | First pass | Hazardous-drug body-fluid handling | Prevent staff chemical exposure before a routine care task. Generic infectious-fluid precautions and neutropenia teaching are already covered. |
| FB-03 | First pass | Low-vision physical orientation | Help the client locate and independently use the physical environment. Accessible instructions and generic fall precautions already exist. |
| FB-04 | First pass | Dressing with unilateral weakness | Select the actual dressing assistance. Identifying an OT referral or safe feeding support is different. |
| FB-05 | First pass | Prescribed patch self-administration | Evaluate home application/replacement for one named product. Current patch neighbors concern MRI preparation or treatment selection. |
| FB-06 | First pass | Eye-drop return demonstration | Recognize an observable delivery or contamination error. Eye disease recognition and emergency irrigation are represented. |
| FB-07 | Conditional | Compare unit safety rates | Compare observed rates with consistent exposure denominators. Do not infer causation from a before/after comparison. Topic mapping is unresolved. |
| FB-08 | Conditional | Evidence applicability | Match evidence to the clinical question and population. Avoid research-methods trivia. Topic mapping is unresolved; novelty is less certain. |
| FB-09 | Conditional | Ear-irrigation eligibility | Resolve procedure eligibility with a perforation history. Exact clinical criteria need an applicable source. |
| FB-10 | Conditional | EVD setup after repositioning | Maintain the prescribed device setup before trusting measurements. Current adult/device-specific sourcing remains unresolved. |

The first six are priorities for source checking and authoring after current-state reconciliation, not six source-approved questions. Their final formats and topics follow the actual decision. The dressing decision may need only MC or cloze; it does not justify padding an ordered sequence. The patch decision must use a named product's instructions. Protocol facts belong in clinical context, not learner-facing authoring disclaimers.

### Topic routing

The current vocabulary has no natural QI or evidence-appraisal label. FB-07 and FB-08 retain `TOPIC_MAPPING_UNRESOLVED`; an older QI item's `Prioritization & Delegation` tag does not justify forcing new content into that topic.

Existing-bank topic reporting is advisory, but the prospective [`rawTopicResult`](https://github.com/cai-Luke/nclex-bilingual-prep/blob/b41a91f3419726ad3bda72464cf20dbcc0496eca/scripts/raw-gate.ts) turns exact vocabulary or category-license findings into blocking failures. A truthful existing mapping or an ordinary reviewed vocabulary addition can resolve this. The inspected rules do not create a separate owner-only approval requirement. Other candidate topic labels are provisional semantic suggestions, not acceptance.

## What the evidence supports

[retrieval-evidence.json](retrieval-evidence.json) retains 36 runnable regexes, their complete matching-ID sets, rejected ideas and the search method. Searches covered all categories, all 2,553 scored leaves and 145 case aggregates. The English index recursively included stems, options, rationales and other English fields. Case aggregates included parent context and embedded text; their counts overlap the leaf counts.

The producing team read the full nearby questions and relevant parent context. A separate producing-team verification reran all 36 expressions, checked 72 hit counts and 72 complete ID sets, and resolved all 30 cited nearest bank/path references. It found no discrepancies. These checks establish retrieval fidelity, not comprehensive semantic absence or independent clinical acceptance.

Examples of proposals rejected by existing coverage include inhaler technique, antiseizure adherence, peritoneal-dialysis infection/contamination response, hearing accommodations, aphasia aids, feeding adaptations, delegation follow-up, research withdrawal and downtime records. Campaign 17's promoted material also closes several historical leads. A missing word, absent drug name, low format count or blank `ngnSkill` label does not by itself create a backfill obligation.

Historical replacement-conditional retirements are not automatic generation debt. One incidental observation about `gap_50_mc_13` is recorded solely for reconciliation with remediation: its test-taking strategy calls a 24-hour reporting interval universal despite an unspecified institutional policy. This packet supplies no correction or replacement credit.

## Execute through the existing lane

This packet specifies the decisions and evidence. Current repository instructions still control execution: [AGENTS.md](../../AGENTS.md), [DECISIONS.md](../../DECISIONS.md), [the runbook](../../docs/AGENTS-RUNBOOK.md), [the schema](../../NCLEX-Question-Schema.md), and [the evergreen semantic floor](../../gpt-evergreen-generation-prompt.md). No new approval stage, renderer, schema version or census policy is introduced.

1. **Reconcile the execution baseline.** Read current instructions and remediation status in the live repository. Compare current banks and pending work with the pinned snapshot and check the ten decisions for overlap. Record which survive. Preserve unrelated work and drop duplicates or unsupported candidates without replacements. Do not run the unattended evergreen prompt against the stale September 13 census or refresh its timestamp merely to bypass its freshness check.

2. **Prepare an isolated production worktree.** Begin with surviving FB-01–FB-06 decisions. Verify the exact clinical sources in [SOURCES.md](SOURCES.md) before choosing keys. Read the current schema and routing source, use unique IDs and routable filenames, and serialize task-owned JSON under `banks/banks-raw/`. Use the standing GPT authoring lane and semantic floor. There is no per-batch Claude-spec prerequisite. Choose topics and formats honestly; diversity targets cannot manufacture new decisions or misleading labels.

3. **Make the actual drafts reviewable.** Run normalization as a dry run first, inspect proposed changes before `--write`, then validate and gate the task-owned files. The raw gate accepts repeated `--file` arguments. Repair JSON through the runbook's programmatic procedure. Preserve the exact final bytes and producer provenance for review. Ignored raw files are not visible to a remote checker merely because the branch was pushed.

   ```sh
   npm run normalize-raw-bank -- banks/banks-raw/<file>.json
   npm run validate-bank -- banks/banks-raw/<file>.json
   npm run gate:raw -- --file banks/banks-raw/<file>.json
   ```

4. **Obtain the standing independent content review.** Route GPT-produced drafts to a producer-independent Claude seat under the established lane. Review includes source and clinical accuracy, novelty against the named neighbors, the semantic floor and bilingual parity. The orchestrator's delegation tree cannot supply this acceptance. Final repaired bytes must retain a reviewable chain and pass applicable checks.

5. **Promote and consolidate normally.** Inspect the isolated raw/staging population first: `promote` scans the complete raw JSON population. Keep the raw and promoted copies through the pre-consolidation integrity audit. Use the runbook sequence below, then validate/audit the resulting canonicals. Update the ledger after successful consolidation/audit and before deleting raw drafts, recording source filenames and the actual review chain.

   ```sh
   npm run promote
   npm run audit
   npm run consolidate -- --dry-run
   npm run consolidate
   ```

6. **Record accepted movement and close each row.** Apply the existing final verification tier. When census movement is expected, run `census:check`, regenerate, inspect the `census.json`/`BANK-CENSUS.md` diff, and check again. The producer-independent checker confirms that movement matches the reviewed additions. Record the result in the normal ledger/history and this register. With no expected movement, use `census:check` without cosmetic regeneration.

This campaign starts with text standalone items. Cases, visual production and frozen-set remediation stay with their existing lanes; this is not a new project-wide ban. The [2026 NCLEX-RN plan](https://www.nclex.com/files/2026_RN_Test%20Plan_English-F.pdf) anchors the content decisions, while [NCSBN's FAQ](https://www.nclex.com/faqs.page) supplies no fixed item-format percentages. The repository's floor policy controls; numerical symmetry creates no additional scope.

## Closeout

Finish when each of the ten rows either has one independently reviewed, normally promoted standalone item or an explicit disposition ending that generation attempt. Record the accepted item ID or the evidence for dropping, deferring or classifying the row as existing coverage/remediation. Unused slots and changing census averages do not reopen the roster. This closeout does not certify comprehensive blueprint coverage or discharge separate remediation.

## Contribution and verification record

GPT/Astra producing-team seats handled blueprint research, Management/Safety discovery, Foundations discovery, Clinical discovery and governance challenge. Root integrated the packet and verified the pushed bank identities/census. A Clinical-seat follow-up reran retrieval and reference mechanics. All these contributions are evidence or producing-team judgment; none satisfies the external producer-independent review gate.

This commit contains documentation and evidence only. No bank, raw draft, runtime, schema, generated census, review ledger or project rule is changed. Application tests and promotion commands were not run against the partial snapshot. [verification.json](verification.json) records the bounded checks that were actually performed.
