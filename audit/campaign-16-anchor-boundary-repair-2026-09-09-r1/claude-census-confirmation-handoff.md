# R4 — bounded independent census confirmation handoff

Prepared: 2026-09-11
Recipient: Claude Code / Claude Opus 5, the already-declared external R4 checker.
Purpose: discharge the remaining R4 §H.3.5 census-confirmation obligation.
This is a proposed launch instruction for owner relay, not a claim that the task has already run.

## Source and opening state

Use live local disk at ~/Desktop/Project Shrimp. Read live AGENTS.md first, then reopen:
scratch/CAMPAIGN-16-PHASE-E-451-BOUNDARY-REPAIR-WORK-ORDER-2026-09-09-R4.md

Commission:
audit/campaign-16-anchor-boundary-repair-2026-09-09-r1/

Also read the post-executor architect review now recorded in the same commission:
architect-conformance-review.md

The executor has reached CAMPAIGN16_BOUNDARY_REPAIR_READY_FOR_INDEPENDENT_CONFORMANCE_CHECK. Both semantic sides are fully frozen, so the old pre-freeze blindness restrictions no longer prevent reading comparison or accepted mappings. You are not being asked to revise your semantic judgments.

Reconfirm the branch, HEAD, index, and worktree before relying on recorded evidence. Expected branch main; recorded HEAD a639b5fe7f6816e68228d7dc13d068c0c0f69e91. Expected seven tracked modifications are the four repaired banks, BANK-REVIEW-LEDGER.md, census.json, and BANK-CENSUS.md. Additional review artifacts may legitimately have been added after the executor terminal; identify them instead of deleting or overwriting them. Read-only Git inspection is permitted for this review; no Git mutation is authorized.

Record the executor-receipt.json hash at entry. Recompute the relevant file identities locally rather than merely copying the receipt's assertions. In particular, bind accepted-boundaries.jsonl, comparison-freeze.json, schema-floor-plan.json, schema-floor-receipts.json, opening/final census artifacts, and final affected bank data to the reviewed executor package. Investigate any mismatch before declaring confirmation.

Recorded semantic pins:
- producer-freeze.json: 151c1327a5d9fa4decf9897200f2d336e55cea31d0f978317a7653c5c4193e4a
- checker-freeze.json: f506178017ce44c6b4429d2125e2542ad89eb56565c4fab82dece08b32b5ba43
- frozen inventory: 9f66750caaeead9d374742588856e2630a7fce09415bb7c2c662669a2af93e8e
- R4 work order: 8cd476c23f2b6cadb07ae8115fd675fbbfc3f60acb46d7a521d5d1da30b2558b

## Review, not regeneration

Read the live accepted mapping, schema-floor evidence, census-reconciliation.json, the census generator's relevant implementation, and both current census diffs. Use the preserved opening census copies under evidence/. Confirm their opening identities against the package evidence and committed opening artifacts where available.

Independently establish that:
1. Each of the four bumped banks actually receives accepted typed-baseline rows and that the approved before/after version is applied.
2. Each affected bank's per-file census counts remain unchanged.
3. The only substantive census movement is the four authorized schema-version transitions and the version grouping they imply.
4. Generator provenance changes are accurate and separate from content changes.
5. The complete remaining census JSON/Markdown content, not just headline totals, is unchanged outside the authorized transform.
6. A read-only npm run census:check succeeds against the current reviewed inputs. Do not run npm run census.
7. The evidence is unchanged while reviewed, apart from your new review outputs.

Expected repaired accounting for reconciliation, not a desired result to force:
451 = 369 baseline + 16 stage + 66 exceptions.

Expected version movement:
- claude-canonical.json: 2.0 → 2.1; 96 session units; 46 accepted baseline rows.
- gemini-canonical.json: 2.0 → 2.1; 874 session units; 38 accepted baseline rows.
- gpt-canonical.json: 2.0 → 2.1; 773 session units; 201 accepted baseline rows.
- hard-cases-canonical.json: 1.8 → 2.1; 66 session units; 84 accepted baseline rows.

Expected final grouping: schema 1.2 = 77 session units; 2.0 = 57; 2.1 = 1,809. Total remains 1,943. Scored/content populations and visual inventories must not drift.

## Outputs and prohibitions

Write only a new checker-owned census-review directory under the commission, choosing a fresh revision suffix if the proposed path already exists. Produce a human-readable receipt and a machine-readable receipt recording:
- reviewer seat and independence;
- branch/HEAD/worktree snapshot;
- relevant recomputed input/output hashes;
- exact reviewed version and count movement;
- checks actually executed and their results;
- CONFIRMED or NOT_CONFIRMED, with specific reasons;
- preservation statement and remaining acceptance limitations.

Do not edit the executor's frozen manifest, comparison, accepted mappings, exceptions, semantic freezes, census receipt, banks, runtime, package scripts, census files, ledger, history, or governance. Do not run the patch/bump/planning/finalization tools again. Do not rerun all 451 semantic judgments. Do not resolve any of the 66 exceptions. No commit, push, merge, checkout, stash, reset, clean, or publication.

The owner has confirmed that the existing production smoke receipt accurately records the checks actually performed. The smoke gate is therefore not part of this census-review assignment.

Stop after the census confirmation receipt. Do not claim full R4 acceptance or authority to publish.
