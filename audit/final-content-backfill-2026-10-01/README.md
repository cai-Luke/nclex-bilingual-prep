# Final content backfill — R2 commissioning

**Commissioning basis approved with Claude's amendments. Eight active candidate decisions; one raw file; one consolidated independent review assignment.** Start local execution at [SOL-WORK-ORDER.md](SOL-WORK-ORDER.md). Question authoring and content acceptance have not occurred.

R2 adopts the review supplied by Luke on October 1, 2026. FB-07 and FB-08 are closed now. The first six remain the production priorities; FB-09 and FB-10 each receive at most 15 minutes of source searching. Use the actual surviving count, with at most one standalone item per active decision. Six to eight is expected; fewer or zero is a valid outcome. Dropped rows create no replacement slots or follow-on batch.

## Current state and the local preflight

The original discovery used pushed commit [`b41a91f3419726ad3bda72464cf20dbcc0496eca`](https://github.com/cai-Luke/nclex-bilingual-prep/commit/b41a91f3419726ad3bda72464cf20dbcc0496eca). All 13 bank downloads matched their Git blob identities and byte lengths, and the actual repository collector reproduced 1,967 session units and 2,553 scored leaves: 1,822 standalone plus 731 embedded. The 145 case containers are separate from scored leaves. [baseline.json](baseline.json) preserves that discovery snapshot.

**Claude's live-disk receipt, supplied by Luke:** local main is that baseline plus unpushed `2002fde`, touching only `CLAUDE.md`; tracked files are clean; raw is empty; canonical bank bytes match the discovery snapshot. Relevant local overlap work is in the `deferred-audit-archaeology` reports. Other untracked material is unrelated September work orders.

**Astra's direct observations in this revision:** the Desktop connector still returned internal errors at its root. GitHub main remained exactly `b41a91f`; remote `CLAUDE.md` still contained the older blanket final-gate wording. Astra has not read the exact `2002fde` diff or the local archaeology reports and has not pushed that commit.

The local work order therefore begins by reading the actual rule diff, publishing the already-existing commit through the normal local Git path, and confirming the synchronized execution baseline. It then performs the bounded archaeology overlap skim. This is a concrete execution preflight; it does not reopen the 36-search discovery or authorize a broad remediation audit. Do not reconstruct the new rule from the receipt, and do not author while remote instructions still omit it.

The census's Management 290 / Pharm 325 figures are **session-unit** counts. Its content-planning counts are 381 / 410 **scored leaves**. They describe different populations, not a bank discrepancy. The repository's floor policy governs; neither population creates a balancing quota.

## Commissioned roster

The [candidate register](candidate-register.json) retains all ten historical rows, with eight active and two explicitly closed. Every active row preserves the actual nearby question IDs/paths and the decision boundary to challenge.

| ID | R2 disposition | Decision |
|---|---|---|
| FB-01 | First pass | Authorized newborn transfer under the stated unit process. |
| FB-02 | First pass | Occupational protection during hazardous-drug body-fluid handling. |
| FB-03 | First pass | Low-vision physical orientation and independent object use. |
| FB-04 | First pass | Actual dressing assistance with unilateral weakness. |
| FB-05 | First pass | Home application/replacement of one named prescribed patch. |
| FB-06 | First pass | Eye-drop administration return demonstration. |
| FB-07 | Closed; no replacement | Unit safety-rate comparison. |
| FB-08 | Closed; no replacement | Evidence applicability to bedside practice. |
| FB-09 | Conditional; 15 minutes | Ear-irrigation eligibility, with an applicable clinical source. |
| FB-10 | Conditional; 15 minutes | EVD setup after repositioning, with an applicable current device source. |

The closure of FB-07/08 is a scope decision, not a finding that QI or evidence use is outside NCLEX. Their unresolved topic fit and limited incremental value do not justify vocabulary work in this closeout campaign. Existing-bank topic reporting is advisory, but the prospective [raw gate](../../scripts/raw-gate.ts) blocks exact vocabulary/category-license findings. Use accurate existing labels for the surviving items.

[SOURCES.md](SOURCES.md) distinguishes inspected authority from incomplete leads. First-pass status is not source clearance. In particular, source the actual low-vision technique rather than assuming a universal clock method; match dressing guidance to the scenario; and use one named patch product's instructions. A simple bedside decision does not need a padded sequence or extra clinical claims.

## Execution and review

The standing [evergreen prompt](../../gpt-evergreen-generation-prompt.md) explicitly says no per-batch Claude spec is required. [DECISIONS.md](../../DECISIONS.md) P2/P5/P21 and [the runbook](../../docs/AGENTS-RUNBOOK.md) preserve the direct generation lane, semantic floor and independent review/promotion requirements. Claude's generic seat-specific “spec-first” wording does not introduce a separate generation gate. The Sol work order is the bounded commission.

Author the survivors in **one** `banks/banks-raw/gpt-final-backfill-2026-10-01-r2.json`. The `gpt-` filename route was checked against [the routing source](../../lib/canonical-routing.ts). Set `meta.count` to the actual number of questions. Normalize, validate and run `gate:raw` against that complete combined file; individual checks do not substitute for the combined gate.

Use the actual learner-content provenance and the live post-`2002fde` rules to select the independent checker. GPT-produced clinical content is planned for a producer-independent Claude review. Claude's commissioning advice is not clinical acceptance of drafts. The review assignment must independently test each draft against its named canonical neighbors and relevant archaeology findings; the producer's novelty rationale is an argument to examine, not an accepted premise.

One review assignment does not promise first-attempt acceptance. Any blocking findings still require correction and review of final bytes through the established route. Sol stops at a reviewable raw handoff. Review, promotion, audit, consolidation, ledger timing and census movement remain governed by the normal pipeline; this commission does not authorize Sol to self-accept or promote before review.

## Evidence and verification

The original [retrieval evidence](retrieval-evidence.json), [baseline](baseline.json) and [verification record](verification.json) remain unchanged from [the discovery commit](https://github.com/cai-Luke/nclex-bilingual-prep/commit/5604696130e8ff6374d09ab290341e8590e05944). The verification record's packet hashes refer to that original commit, not the amended README/register/source notes. It records 36 searches, 72 count checks, 72 complete matching-ID-set checks and 30 nearest-reference resolutions with no mismatch. These remain producing-team checks; Claude did not rerun them.

[amendment-receipt.json](amendment-receipt.json) records R2's scope and document checks. Canonical content, schema, runtime, census, global project rules and review ledgers are not changed by this revision. The incidental `gap_50_mc_13` timing defect remains in separate remediation; it earns no backfill item here.

Close every active row with one accepted addition or a specific disposition ending its generation attempt. For a conditional row whose source cannot be established within its timebox, record `SOURCE_NOT_ESTABLISHED_IN_TIMEBOX` and close it for this campaign. That describes the bounded search outcome rather than asserting that no source exists anywhere. Separate remediation continues under its own work orders.
