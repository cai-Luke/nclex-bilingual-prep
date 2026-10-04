# Project Shrimp — publication reconciliation
**Implementation seat:** Codex / repository publication preparation
**Model:** GPT-5.6 Sol
**Reasoning effort:** high
**Independent review:** Workasaurus checks scope and returned Git evidence; existing content-review independence remains binding. This is not a content-acceptance run.
**Date:** 2026-10-02
**Mode:** DRAFT FOR OWNER APPROVAL. No execution, staging, commit, push, merge, deployment, or worktree retirement is authorized merely by this file.

## 0. Goal and why an execution seat would be needed
Make accepted local governance and already-completed evidence visible to remote-reading agents without merging active experiments or declaring release readiness. Workasaurus has done live connector reconnaissance. The remaining execution needs full Git graph/diff/index access, a fresh remote check, exact staging, and publication verification. Connector status uses cached tracking refs; its commit helper disables hooks. A narrowly approved local Git run is preferable to using that helper or commissioning another broad audit.

Smallest sufficient run: this primary checkout only; preserve existing commit 2002fde, prepare one historical-evidence commit and one bounded current-status correction, then return the exact candidate for review. Do not execute the old housekeeping order wholesale.

## 1. Observed opening snapshot
Observed 2026-10-02 about 23:00 UTC:
- Desktop/Project Shrimp: main at 2002fde, one ahead of cached origin/main, no tracked working edits.
- Fresh GitHub main: b41a91f3419726ad3bda72464cf20dbcc0496eca.
- 2002fde is titled "docs(CLAUDE.md): runtime connector discovery, provenance-scoped promotion gate, defer write verification to AGENTS".
- 25 individual untracked files at the reconnaissance snapshot: 13 root work-order/handoff documents; eight files in two deferred-archaeology directories; four calculator fixture manifests. These match the 19 path groups in the earlier housekeeping commission.
- This publication order was written **after** that snapshot and is therefore one additional untracked file in the live checkout. Its presence alone is not drift from the observed baseline.
- The current-status introduction still advertises dashboard/glossary SRS despite accepted later retirement.
- Existing scratch/REPO-HOUSEKEEPING-TRACKING-AND-WORKTREE-RETIREMENT-CODEX-WORK-ORDER-2026-09-25-R1.md already specifies historical preservation. Its broad retirement/pruning steps are NOT imported here.
- The remote codex/final-content-backfill-2026-10-01 packet is a separate published branch, previously observed at 86488d75ccaee94b083be542890308cb494d017b. Its directory is absent from this primary main checkout. Absence here is not lost work; do not recreate or merge it.
- Matrix/N01 has numerous untracked tooling and staged-review artifacts in its separate worktree. Status metadata was inspected, not its staged answers. Excluded from this publication.
- Campaign17 branch is one ahead of its cached upstream; preserve it and the owner-parking decision without merging the entire branch.

## 2. Reference and file boundaries
Read AGENTS.md, CLAUDE.md; PROJECT-HISTORY.md current status and September 12–17 accepted milestones; src/App.tsx and src/storage.ts only to verify current UI/storage statements.
Read the September 25 housekeeping order §§0–3 as historical plan, and ../Project-Shrimp-Mechanical-Closeout-Recon-2026-09-21/UNTRACKED-CLASSIFICATION.md. Neither authorizes its other operations.
For 2002fde inspect the actual commit diff and the cited DECISIONS.md P2/P5 provenance rules; do not reconstruct a policy amendment.

May preserve unchanged, after review:
- The exact 13 root LEARNER-/MOBILE- documents enumerated in the classification report (no wildcard staging).
- audit/deferred-audit-archaeology-2026-09-12-flash-r1/{adjudication.jsonl,candidate-census.jsonl,evidence-index.md,report.md}
- audit/deferred-audit-archaeology-2026-09-12-r1/{adjudication.jsonl,candidate-census.jsonl,evidence-index.md,report.md}
- audit/mobile-calculator-action-clearance-r1/integration/{final-cloze-file,final-cloze-http,final-file,final-http}/fixture-manifest.json
- This order.
May edit: PROJECT-HISTORY.md current-status paragraph only; add a short dated publication entry if needed to record precisely what was preserved. May create PUBLICATION-RECONCILIATION-RECEIPT-2026-10-02.md.
Do not touch: production code, banks, schemas, census, ledger, DECISIONS.md, scratch history, other worktrees, active backfill, advisory, N01, qualification/benchmark/sealed/calibration/quarantine content. Do not delete, prune, reset, stash, force-push, rebase, or use git add -A.

## 3. Preparation steps, only after owner approves this run
1. Record branch, full HEAD, staged/unstaged/untracked state and exact upstream. If a staged change or different HEAD exists, stop and return the drift; do not disturb it.
2. Verify remote identity and inspect live origin/main with existing authorized credentials. Do not expose credential-bearing remote URLs. No auth setup or permission expansion. A fresh fetch without prune may be used when launch approval covers preparation; record fetched SHA. Stop on divergence or unexpected remote.
3. Inspect every commit that would be newly published, not just the working diff. Confirm 2002fde changes only CLAUDE.md and remains subordinate to P2/P5. Stop on policy conflict.
4. Expand the 19 legacy path groups to exact files; compare the 13 root sizes with the earlier report, check content and references, and screen for secrets/private material. Changed/missing files are held for review, not silently included or regenerated. Historical evidence remains dated; it is not rerun or promoted to current policy.
5. After confirming there is no concurrent writer, create and switch the **existing checkout** to a new non-protected preparation branch at the verified local HEAD, preserving the current index and working-tree contents byte-for-byte. Do not create a clean linked worktree and then reconstruct or copy the untracked evidence into it. Preserve the exact evidence set unchanged, using explicit paths. Do not clean the working tree to make it look tidy. If the branch switch would interfere with another writer or alter the working state, stop.
6. Separate commit: correct only the demonstrably obsolete top current-status feature paragraph. Describe Study / Needs review / Saved / Last set and link to accepted retirement milestones. Do not change schema versions, historical milestone prose, clinical statements, or content completion status. If proof does not match, omit this correction and report.
7. Return staged/commit file lists, full commit IDs, before/after status, base/upstream identity, held paths, and verification. Mark PREPARED_NOT_PUBLISHED. No further work until architect review.

## 4. Verification / acceptance
- Existing production code, banks and contracts unchanged from opening snapshot.
- Exact evidence inclusion and no hidden/ignored spillover.
- Every current-status assertion tied to current source or accepted receipt. Follow AGENTS.md docs verification; no blanket application build for unchanged application source. No new clinical/schema/version claim.
- Readable links resolve or are explicitly marked local-only. No claim that Matrix/N01, advisory, backfill or physical safe-area work is closed.
- Existing omnibus owner ratification stays closed; no duplicate acceptance archaeology.
- Successful preparation does not mean published or learner-release-ready.

## 5. Publication gate and evidence
After Workasaurus reviews the returned candidate, Luke must explicitly approve the exact remote repository, branch/ref and commit range. Proposed destination is the existing cai-Luke/nclex-bilingual-prep repository; review branch first if main update is not explicitly approved. Inspect repository workflows before pushing and stop if the selected ref would trigger an unapproved deployment or other consequential action. No new repo, visibility change, force push, tags, or branch deletion.
Immediately before a permitted push, recheck remote tip and local status. A changed/diverged remote stops the operation; no automatic conflict resolution. Confirm the advertised remote ref equals the intended full SHA after the push, report relevant CI for that SHA, and distinguish review-branch publication from main synchronization. A main merge/update requires its own explicit approval if not already covered.
Return to Workasaurus before any follow-on execution.

SEND TO, IF APPROVED: Codex — GPT-5.6 Sol — high
