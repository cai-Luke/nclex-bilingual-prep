# Final content backfill R2 — Sol execution

**Implementation seat:** Codex / content producer and bounded local preparation  
**Model:** GPT-5.6 Sol  
**Reasoning effort:** high  
**Independent review:** Actual content provenance under live `CLAUDE.md`, `DECISIONS.md` P2/P5 and the standing lane; planned GPT drafts go to a producer-independent Claude seat outside the producing delegation tree.  
**Date:** 2026-10-01  
**Mode:** Local preflight, source verification, one raw batch and review handoff. Stop before independent acceptance or promotion.

## 0. Commission and scope

Execute the amended commissioning basis in this directory. Author at most one standalone item for each surviving FB-01–FB-06 and each source-qualified FB-09/FB-10. **FB-07 and FB-08 are closed.** Do not reopen them, add vocabulary, replace dropped rows, or create another batch to recover unused slots.

Read live `AGENTS.md` first, then the relevant current history, `CLAUDE.md`, `DECISIONS.md`, runbook, schema/type/validator sources, this README/register and source notes. The attached or pushed baseline is orientation until the local preflight below is satisfied. Apply the existing evergreen semantic floor; its explicit no-per-batch-Claude-spec rule permits this direct commission. Keep schema and runtime changes outside this task.

## 1. Publish the existing rule and establish the execution baseline

Owner repository: `/Users/holemini/Desktop/Project Shrimp`.

Claude reported local `main` at unpushed `2002fde`, one commit after `b41a91f3419726ad3bda72464cf20dbcc0496eca`; only `CLAUDE.md` changed. It reportedly replaces blanket Claude-final-gate wording with provenance-scoped routing. Astra could verify only that GitHub still had the older main. **Read the actual commit and live file; do not recreate or infer the amendment from this description.**

Inspect the current branch, working tree, staged changes, origin tracking and the complete `2002fde` diff. Resolve and record its full SHA. If it is the described existing documentation-only main tip and remote is still its parent, publish that existing commit through the normal local Git path, without force or rewriting it. Confirm the remote contains it before authoring. Do not publish additional unrelated work as part of this step. If the reported state has changed, identify the difference and resolve only what this commission covers; an inability to establish or synchronize the rule blocks authoring.

Preserve the owner's unrelated untracked files. Create an isolated production branch/worktree from reconciled main and integrate this documentation-only commissioning branch there. Record the execution HEAD, rule commit, worktree and origin state. Keep production changes out of the owner checkout.

Confirm the canonical bank tree against the discovery baseline and inspect the actual raw population, including ignored files. Claude reported identical canonical bytes and empty raw. If those facts hold, reuse the existing discovery rather than repeat its bank-wide searches. Locate the `deferred-audit-archaeology` reports and skim only for findings or pending repairs relevant to the eight active decisions and their named neighbors. Record any overlap that defeats a candidate. Do not reopen unrelated September work orders or launch a broader remediation audit.

## 2. Settle sources and the survivor roster

Use `candidate-register.json` for the decision boundaries and exact neighbor locations. Read the relevant current questions, including keys/rationales and parent context when necessary. Resolve source and semantic overlap before treating a row as admitted.

FB-09 and FB-10 each receive **one source-search period of at most 15 minutes**. Record start/end times and the sources inspected. A current device IFU means the applicable manufacturer's current published instructions; do not impose an invented publication-year cutoff. FB-10 still requires device-specific support and a suitable clinical authority for the eventual scenario. The pediatric guideline marked under review is not sufficient clearance by itself.

At the time limit, either retain the conditional decision with the needed source support or close it as `SOURCE_NOT_ESTABLISHED_IN_TIMEBOX`. Do not extend the search, substitute another topic, reserve a later batch, or imply that this scoped outcome proves no adequate source exists anywhere. Settle both conditional rows before freezing the combined batch.

For the first six, verify the actual keyed technique and every consequential clinical claim. In particular:

- Newborn security must test transport authority under a stated process, not another generic identity-band check.
- Hazardous-drug body fluids must test prevention of occupational chemical exposure; establish the applicable protocol and avoid a universal excretion interval.
- Low vision must test physical orientation and independent use; source the selected method rather than presume a universal clock-face technique.
- Dressing must test the actual assistance; choose MC or cloze if that faithfully captures the decision without a padded sequence.
- The patch must be one named already-prescribed product, using that product's instructions.
- Eye drops must test an observed administration error, with product-specific details verified if used.

Use truthful existing category/topic labels. Select formats after fixing the decision; the routine six-item/diversity defaults do not justify distorting a candidate. Six to eight additions is an expectation, not a minimum. A candidate defeated by existing coverage or unsupported sources closes without a replacement.

## 3. Produce one reviewable raw file

Target: `banks/banks-raw/gpt-final-backfill-2026-10-01-r2.json` in the isolated production worktree. The `gpt-` filename prefix routes to the GPT canonical bank under the inspected `lib/canonical-routing.ts`; recheck the live source. Do not overwrite an unrelated existing file with this name.

Serialize one bank envelope with the actual surviving count and globally unique IDs. Read the live schema/types rather than copying shape from prose. Follow the existing English/Simplified-Chinese semantic floor, including closed-world scenarios, useful distractors, per-choice reasoning and clinical parity. Keep producer instructions off the learner surface. Do not introduce visuals, cases or new schema/runtime work.

Use the existing programmatic raw-editing procedure. Run normalization in dry-run mode, inspect changes before any `--write`, then validate and gate the **complete final combined file**:

```sh
npm run normalize-raw-bank -- banks/banks-raw/gpt-final-backfill-2026-10-01-r2.json
npm run validate-bank -- banks/banks-raw/gpt-final-backfill-2026-10-01-r2.json
npm run gate:raw -- --file banks/banks-raw/gpt-final-backfill-2026-10-01-r2.json
```

Resolve failures within the commissioned content and preserve the checks applicable to the final bytes. Record the final raw SHA-256. If no candidates survive, produce the disposition receipt without an empty raw bank.

## 4. One independent review assignment

Prepare one consolidated Claude review handoff for the actual final raw file, subject to the **live provenance-scoped routing rule**. Record the real authors of learner-facing clinical content and substantive revisions. The producer or its delegation tree cannot provide the required independent acceptance. This work order and Claude's commissioning advice do not accept any generated question.

The reviewer must independently inspect the drafts' clinical/source accuracy, bilingual parity, answer validity and novelty. For novelty, read the named canonical neighbors and relevant archaeology evidence directly and decide whether each draft exercises a distinct keyed decision. Do not inherit the producer's gap verdict or accept a changed setting/wording as sufficient. Keep this in the single ordinary content-review assignment; no separate calibration or novelty-review campaign is commissioned.

One assignment does not guarantee acceptance on its first attempt. Any blockers must be resolved under the existing rules on final reviewable bytes before promotion. Point the reviewer to the exact raw path and hash. Raw files may be gitignored; a pushed handoff alone does not transmit their contents. Ensure the assigned local reviewer can access the exact file, or use the project's established exact-file transfer procedure.

## 5. Deliver and stop

Keep the raw file available for review. Save a concise producer receipt and consolidated reviewer handoff under this commission's production evidence directory, and update the register with survivor/closed dispositions. Include:

- Execution HEAD/worktree, full rule-commit SHA and confirmation it is published.
- Bank-baseline comparison and the bounded archaeology overlap result.
- Actual included IDs, candidate mapping, sources, nearest references and conditional-search dispositions/times.
- Final raw filename/count/SHA-256, actual provenance and mechanical command results.
- The planned provenance-compliant reviewer and the requirement for that reviewer's own novelty judgment.

Commit/push the task-owned durable evidence through the normal workflow. Preserve unrelated work and the raw draft. Do not change canonical banks, regenerate census, record questions as reviewed, or run promotion/consolidation in this producer phase. The independently accepted batch will later use the existing full pipeline and ledger-before-raw-deletion rule.

Return one terminal:

- `FINAL_BACKFILL_R2_RAW_READY_FOR_INDEPENDENT_REVIEW`
- `FINAL_BACKFILL_R2_CLOSED_WITHOUT_ADDITIONS`
- `FINAL_BACKFILL_R2_BLOCKED` — with the concrete unresolved prerequisite and work already completed.

SEND TO: Codex — GPT-5.6 Sol — high
