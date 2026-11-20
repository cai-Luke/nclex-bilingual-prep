# Publication reconciliation — preparation receipt

**Terminal:** `PREPARED_NOT_PUBLISHED`  
**Execution date:** 2026-10-03 America/New_York; verification recorded 2026-10-04T02:32:50Z. The filename retains the work-order date.  
**Seat:** Codex primary, disk-reading, existing checkout; no delegation.  
**Review:** Workasaurus scope/Git review pending. This is preparation evidence, not content acceptance or release readiness.

## Authority and access

Governed by [the publication work order](PUBLICATION-RECONCILIATION-WORK-ORDER-2026-10-02.md) and [AGENTS.md](AGENTS.md). Luke's explicit approval in this chat authorized the preparation phase only: fetch/remote verification, preparation branch, bounded status correction, exact staging/commits, and verification. Luke separately directed that all five hash-discrepant files stay held, unchanged and excluded, while unaffected evidence proceeds.

No push, merge, publication, deployment, force operation, retirement, pruning, reset, stash, deletion, auth setup, or permission expansion was performed. No changes to other worktrees or to their branches. This receipt is an explicitly permitted **local-only, untracked handoff file**, outside the candidate commit range; it was created after the two commits so it can record their exact full IDs.

The [September 21 classification report](../Project-Shrimp-Mechanical-Closeout-Recon-2026-09-21/UNTRACKED-CLASSIFICATION.md) is **local-only, outside this repository**. The historical September 25 order at `scratch/REPO-HOUSEKEEPING-TRACKING-AND-WORKTREE-RETIREMENT-CODEX-WORK-ORDER-2026-09-25-R1.md` is **local-only, ignored**; only its §§0–3 preservation plan informed this run. Neither source was edited or copied into the candidate. Neither source authorizes follow-on actions.

## Opening and closing Git identities

| Item | Exact observed value |
|---|---|
| Checkout | `/Users/holemini/Desktop/Project Shrimp` |
| Opening branch | `main` |
| Opening HEAD and unchanged local main | `2002fde97b4641d48e630a886a7b45362d2bd267` |
| Opening upstream | `origin/main` |
| Opening cached upstream SHA | `b41a91f3419726ad3bda72464cf20dbcc0496eca` |
| Verified remote identity | `github.com/cai-Luke/nclex-bilingual-prep` |
| Fresh fetched origin/main | `b41a91f3419726ad3bda72464cf20dbcc0496eca` |
| Closing branch | `codex/publication-reconciliation-2026-10-02` |
| Closing HEAD | `65756abb8267a1aa064359e6b7186b3b103abe60` |
| Closing branch upstream | None configured |
| Comparison base for candidate review | `b41a91f3419726ad3bda72464cf20dbcc0496eca` |
| Opening origin/main...HEAD | 0 behind / 1 ahead |
| Closing origin/main...HEAD | 0 behind / 3 ahead |

Remote identity was checked from origin fetch/push configuration without printing a credential-bearing URL. Fetch was narrowly limited to main, with pruning and tag fetching disabled:

```sh
git -c fetch.prune=false -c fetch.pruneTags=false fetch --no-prune --no-tags origin refs/heads/main:refs/remotes/origin/main
```

Fetch exited 0. A later `git ls-remote --heads origin refs/heads/main refs/heads/codex/publication-reconciliation-2026-10-02` advertised only:

```text
b41a91f3419726ad3bda72464cf20dbcc0496eca refs/heads/main
```

The candidate branch was not advertised remotely. No divergence was found. Local `main` remains at the original HEAD. The preparation branch was created in the existing checkout at that exact HEAD using `git -c branch.autoSetupMerge=false switch -c codex/publication-reconciliation-2026-10-02 2002fde97b4641d48e630a886a7b45362d2bd267`.

Immediately before branch creation, HEAD, status, upstream tip, the 26 allowed original-file hashes, and the history-file hash matched the opening snapshot. No Git/git-lfs process or relevant index/ref lock was observed. Immediately after switching, the same status, all 26 file hashes and history bytes matched. The index's SHA-256 before and after the switch was exactly `197a06c7006b1d5a48a1f07eaa46007c0a9f036c0cf0116c19d177e298fa0e6d`. No linked worktree, copying, cleanup, or state reconstruction occurred.

## Complete candidate commit range

All three commits below were inspected. Only the latter two were created by this run, each using ordinary `git commit`; hooks were not bypassed.

| Commit | Role | File scope |
|---|---|---|
| `2002fde97b4641d48e630a886a7b45362d2bd267` | Existing, preserved: docs(CLAUDE.md): runtime connector discovery, provenance-scoped promotion gate, defer write verification to AGENTS | Only `CLAUDE.md`: 6 additions / 6 removals |
| `c7323ae39b846305a9f82ea173d84946e191117d` | New: docs: preserve verified Sept 12-17 publication evidence | Exactly 21 added files listed below; 2,388 insertions |
| `65756abb8267a1aa064359e6b7186b3b103abe60` | New: docs: reconcile current learner feature summary | Only `PROJECT-HISTORY.md`: one paragraph replaced; 1 insertion / 1 deletion |

Exact parent chain: remote main → existing `2002fde97b4641d48e630a886a7b45362d2bd267` → evidence `c7323ae39b846305a9f82ea173d84946e191117d` → status `65756abb8267a1aa064359e6b7186b3b103abe60`.

Review range: `b41a91f3419726ad3bda72464cf20dbcc0496eca..65756abb8267a1aa064359e6b7186b3b103abe60`. New preparation-only range: `2002fde97b4641d48e630a886a7b45362d2bd267..65756abb8267a1aa064359e6b7186b3b103abe60`.

The actual existing CLAUDE diff was compared with live DECISIONS P2, its spec-conformance application, P5, and the standing opus-prefix provenance routing. Its promotion guidance defers to those owners and expressly prevents producer-conflicted sole semantic clearance. No policy amendment was inferred or written; no P2/P5 conflict was found.

## Exact preserved and staged file set

This table is both the exact pre-commit staged set and the exact added-file set of `c7323ae39b846305a9f82ea173d84946e191117d`. All entries were added by **individual explicit paths**, without wildcard/directory staging, `git add -A`, force-add, or ignored spillover. Staged blobs and final committed blobs were checked against the opening raw-byte SHA-256 for every entry; all matched. Eight unaffected root documents, eight archaeology files, four fixture manifests, and this work order total 21 files.

| Path | Bytes | Opening = staged = committed SHA-256 |
|---|---:|---|
| `LEARNER-LEGACY-NOTICE-SUPPRESSION-CODEX-WORK-ORDER-2026-09-16-R1.md` | 11,797 | `f144f35dd641e9965697aa80a71f4aee1036e539fec1f5c39f2908e234f44ab7` |
| `LEARNER-SHELL-R3-CONCEPT-A-INTEGRATION-WORK-ORDER-2026-09-16.md` | 13,598 | `c0c8a12e117ac5da3a74cceca04698c0364dd2b77ac9c128136f0fa02b27256d` |
| `MOBILE-DROPDOWN-CLOZE-CODEX-LAUNCH-AUTHORIZATION-2026-09-16.md` | 2,724 | `8ef8eca9695eb7e9d816022c6be32e6f442e4bca4d444940cd03f7b3205ab675` |
| `MOBILE-DROPDOWN-CLOZE-OVERFLOW-CODEX-WORK-ORDER-2026-09-16-R2.md` | 17,659 | `968a575b9f2f5b2b734cc5281a992f92a09dd52c409ea7d104fd5043004d6a6e` |
| `MOBILE-DROPDOWN-CLOZE-R1-FINAL-INDEPENDENT-REVIEW-HANDOFF-2026-09-16.md` | 8,593 | `546792d949a039b86fbbd4d3a0f02c31aedd6f05b5c2248368018ab3e9447d57` |
| `MOBILE-DROPDOWN-CLOZE-R1-INTEGRATION-WORK-ORDER-2026-09-16.md` | 8,899 | `9148f546201237fb6b1d778eb1517c6563675869c08377a2e0900ff860d9a12e` |
| `MOBILE-REPAIRS-CLAUDE-AI-R2-AMENDMENT-CLOSURE-HANDOFF-2026-09-16.md` | 5,761 | `e7642ba062a6aec64dfae12699008350dd4fdfae0081aa3aa61057c4f8fbd127` |
| `MOBILE-REPAIRS-CLAUDE-AI-SPEC-REVIEW-HANDOFF-2026-09-16-R1.md` | 14,350 | `337984e475a49d03f4cb52a2efa8866af39ad44655e0dd75af405e7c7c42d459` |
| `audit/deferred-audit-archaeology-2026-09-12-flash-r1/adjudication.jsonl` | 27,955 | `5037e4373960b699d66331186a72d6992d23d5077df8f3917c19348cd31e6581` |
| `audit/deferred-audit-archaeology-2026-09-12-flash-r1/candidate-census.jsonl` | 30,173 | `67ac08b40ddab3375cc57d3c29ef0ec287392a3e747005795c25727406cecf1c` |
| `audit/deferred-audit-archaeology-2026-09-12-flash-r1/evidence-index.md` | 9,846 | `68d350cf63958fd40eb5b127e9faf085cd0d0d4d04f948e0d1efc4221897614b` |
| `audit/deferred-audit-archaeology-2026-09-12-flash-r1/report.md` | 22,936 | `d5241b6d3ebd3fdfaa4ad1aadef212286b3c1430c9980a6a3d2f75e00642dd2f` |
| `audit/deferred-audit-archaeology-2026-09-12-r1/adjudication.jsonl` | 108,297 | `21a0313038c55d6f46fb2d68db76b6106dff99e964c8d0ed5e2fb9606ac8565c` |
| `audit/deferred-audit-archaeology-2026-09-12-r1/candidate-census.jsonl` | 32,414 | `69d2c6e7ac2de41eb79d54e7b23dd5ca9c1f0863b6f927c780d59cf67bf8cfd0` |
| `audit/deferred-audit-archaeology-2026-09-12-r1/evidence-index.md` | 26,421 | `4f8b232a100782614d54aee56d02b032677d59663196f2ecfdad51a8bec172d6` |
| `audit/deferred-audit-archaeology-2026-09-12-r1/report.md` | 23,875 | `9170598e9ba5fdf6998943af2f766db0c48c79ac6cc62ed1085c8caa123373cd` |
| `audit/mobile-calculator-action-clearance-r1/integration/final-cloze-file/fixture-manifest.json` | 2,947 | `842e1899b90afde6b53762c0164d14555fafb66ad79b9dbf6faaff84b15f6d5b` |
| `audit/mobile-calculator-action-clearance-r1/integration/final-cloze-http/fixture-manifest.json` | 2,947 | `842e1899b90afde6b53762c0164d14555fafb66ad79b9dbf6faaff84b15f6d5b` |
| `audit/mobile-calculator-action-clearance-r1/integration/final-file/fixture-manifest.json` | 3,109 | `b90abf784c6d4097a104cc510c9428541813acd355fd69701cbdd8b11d84c2c3` |
| `audit/mobile-calculator-action-clearance-r1/integration/final-http/fixture-manifest.json` | 3,109 | `b90abf784c6d4097a104cc510c9428541813acd355fd69701cbdd8b11d84c2c3` |
| `PUBLICATION-RECONCILIATION-WORK-ORDER-2026-10-02.md` | 8,592 | `0c251c1b930c22262f2f3010f69da2c10b323076831c1441243ef06bd2a7b71c` |

Root files' byte sizes and displayed prefix/suffix fragments matched the classification report for these eight included documents. For archaeology/fixture files, that report contains group-level sizes/file counts rather than full per-file digests; their exact current raw-byte hashes were frozen at opening and preserved without transformation.

Historical content was inspected as dated evidence: both archaeology sets are advisory backlog records with different snapshots and conclusions, not new current-state findings. All four JSONL files parsed fully (Flash: 28 census / 28 adjudication records; R1: 29 / 29), and all four fixture manifests parsed as JSON. Secret-pattern screening across all 26 original files found no private-key block, GitHub/AWS/OpenAI token pattern or credential-bearing HTTP URL. Context screening found no apparent private patient or credential material. This is a publication screen, not a new semantic/content review or an exhaustive security certification.

The preserved Markdown's three explicit relative file links, all in the R1 report, resolve to its committed `candidate-census.jsonl`, `adjudication.jsonl`, and `evidence-index.md`. Historical inline source citations are retained verbatim: `scratch/`, absolute desktop paths, other worktree references, and excluded/held files are **local-only or historical retrieval references**, not assertions that those inputs will exist in the remote candidate. Git-ref citations identify historical objects, not current working-tree snapshots.

## Five held documents — exact discrepancies

All five remain untracked, unstaged, unchanged, and absent from both new commits and the candidate tree. Current SHA-256 was measured from raw bytes with Python hashlib and separately confirmed with `shasum -a 256`; it also matched the read-only inspection before approval. Each current byte size equals the classification report's recorded size. Each reported prefix matches, but the literal displayed suffix does not. The report supplies **abbreviated hashes only**; no full September 21 baseline digest was reconstructed or invented.

| Held path | Reported = current bytes | Report SHA-256 fragment (literal) | Current full raw-byte SHA-256 |
|---|---:|---|---|
| `LEARNER-SHELL-R3-CONCEPT-A-IMPLEMENTATION-WORK-ORDER-2026-09-13.md` | 19,618 | `521c5af2…c8884` | `521c5af27b13a774c75146c2431f210d47bea35161d44dba96d2f986b8c8e884` |
| `MOBILE-CALCULATOR-ACTION-CLEARANCE-CODEX-WORK-ORDER-2026-09-16-R3.md` | 22,322 | `e4f35dc2…cba37f` | `e4f35dc21f512e97a061b86a21150b95435e6c4a2f163bc65a45cbba4cbbc37f` |
| `MOBILE-CALCULATOR-CLAUDE-AI-R3-FINAL-CLOSURE-HANDOFF-2026-09-16.md` | 2,426 | `dc2eeef2…08345` | `dc2eeef2304c453f75d073461be915e6ccd5962f5c070812a8b9d2224b0834e5` |
| `MOBILE-CALCULATOR-R3-CODEX-LAUNCH-AUTHORIZATION-2026-09-16.md` | 4,780 | `05f376ef…5eee9` | `05f376efec5b0067cb9b31924b3aa580c991eceefc01800cf2de65e61ed7eee9` |
| `MOBILE-DROPDOWN-CLOZE-R1-OWNER-DISPOSITION-2026-09-16.md` | 7,016 | `5ba74604…934e11b` | `5ba74604d9052e3a5f578627f9ac709c597d421af1f3ff788a934f1b5face11b` |

Corroborating evidence, without resolving the hold:

- Learner Shell implementation order: the committed [launch snapshot](audit/learner-shell-r3-concept-a-r1/launch-snapshot.json) `ownerUntrackedHashes`, [invariance proof](audit/learner-shell-r3-concept-a-r1/invariance-proof.json) `owner.workOrderSha256`, and [independent review](audit/learner-shell-r3-concept-a-r1/independent-review/independent-review.md) work-order-hash section all record the same **full** hash as the current held file.
- Calculator R3 action-clearance order: committed [authority-start](audit/mobile-calculator-action-clearance-r1/authority-start.json), [authority-close](audit/mobile-calculator-action-clearance-r1/authority-close.json), [producer receipt](audit/mobile-calculator-action-clearance-r1/implementation-receipt.md), and [independent review](audit/mobile-calculator-action-clearance-r1/independent-review/independent-review.md) record the same **full** hash as the current held file.
- Dropdown-cloze owner disposition: committed [checker authority-start](audit/mobile-dropdown-cloze-overflow-r1/checker-harness-repair/authority-start.json) `authority` records the same **full** hash as the current held file.
- Calculator launch authorization: the named producer and independent-review receipts identify/read that path, but no full hash for it was found in the bounded inspected calculator authority/receipt sources.
- Calculator final-closure handoff: no matching full-hash baseline was found in those bounded inspected sources.
- `git log --all -- <the five exact held paths>` returned no committed path history in available local refs. No other worktree, qualification, benchmark, sealed, calibration, quarantine or advisory content was opened to pursue the discrepancies.

The three full-hash matches support a possible report-abbreviation/transcription problem; they do not establish the September 21 full baseline for all five or authorize including them. File-size and prefix equality alone do not prove unchanged historical bytes. **All five remain HELD_FOR_REVIEW** pending Workasaurus/owner disposition. No regeneration, normalization, amendment or silent inclusion occurred.

## Bounded current-status correction and verification

Only the top feature-summary paragraph in [PROJECT-HISTORY.md](PROJECT-HISTORY.md) changed. The corrected text describes Study, Needs review, Saved and Last set, retains resumable/custom/adaptive practice, and names the still-present Progress summary. It links to the already accepted [September 12 retirement/cleanup](PROJECT-HISTORY.md#reviewvocabulary-omnibus-db-v7-physical-cleanup-and-campaign-17-phase-c-integrated-sep-12) and [September 16 shell integration](PROJECT-HISTORY.md#learner-shell-r3-concept-a-integrated-sep-16) milestones. Both anchors were verified.

Proof surfaces checked in the unchanged opening source:

| Assertion | Source |
|---|---|
| Study is the practice workspace; sessions resume | `src/App.tsx` HomeView wiring and Study workspace/resume action |
| Needs review and Saved provide practice/remediation and bookmarks | `src/App.tsx` MemoryList routes and Study memory dock |
| Last set inspects the latest completed set's answers/rationales | `src/App.tsx` Last-set entry and completed-set review route |
| Custom sessions and adaptive practice remain | `src/App.tsx` builder and adaptive routes |
| Progress still summarizes performance | `src/App.tsx` Progress navigation and dashboard rendering |
| SRS/Vocabulary retirement is accepted and integrated | Existing September 12 milestone and September 13 owner ratification; `src/storage.ts` retired-store cleanup corroborates the removal |

The entire history file was compared with its opening committed bytes after replacing the **single exact old paragraph**; the result equals the final file. No other paragraph, milestone, schema version, clinical statement, content completion status, or owner ratification was changed. No new clinical claim, schema-version token, field shape, enum or validator claim was authored. Detailed retirement rules remain owned by the linked milestone/source rather than restated in the current summary.

Verification results:

- **PASS:** opening preconditions; authorized remote identity and fresh fetch; no divergence.
- **PASS:** no writer/lock observed at branch-switch gate; byte-identical index and evidence/history across switch.
- **PASS:** exact first staged/committed set, 21 additions; exact second staged/committed set, `M PROJECT-HISTORY.md` only.
- **PASS:** all 26 original-file hashes remain identical to opening, including every held file; all 21 committed evidence blobs match those bytes.
- **PASS:** both new commit parents and all three candidate full commit IDs verified.
- **PASS:** complete opening→candidate tree diff contains exactly those 21 additions and the single history modification. Therefore every other originally tracked file is Git-object-identical, including production code, banks, schemas/contracts, census, ledger, DECISIONS and historical milestones.
- **PASS:** history `git diff --check` before staging, staged diff check, and committed-range diff check.
- **PASS:** explicit relative evidence links and new status milestone anchors resolve; local-only historical citations and this receipt are identified above.
- **PASS:** final main advertisement unchanged; no candidate remote ref advertised; local main unchanged.
- **PASS:** no staged or unstaged tracked changes remain. Untracked state is intentionally the five held documents plus this receipt.

No application build, bank audit, census regeneration or clinical re-review was run: application/data inputs are unchanged, the authored change is prose only, and the work order calls for the docs verification path. Historical bank/validation/count claims in preserved artifacts remain their dated authors' evidence; they were not certified as current facts. Workasaurus independent scope/Git review remains pending.

## Before/after working state

Opening `git status --porcelain=v1 --untracked-files=all`; staged and unstaged tracked sets were empty:

```text
?? LEARNER-LEGACY-NOTICE-SUPPRESSION-CODEX-WORK-ORDER-2026-09-16-R1.md
?? LEARNER-SHELL-R3-CONCEPT-A-IMPLEMENTATION-WORK-ORDER-2026-09-13.md
?? LEARNER-SHELL-R3-CONCEPT-A-INTEGRATION-WORK-ORDER-2026-09-16.md
?? MOBILE-CALCULATOR-ACTION-CLEARANCE-CODEX-WORK-ORDER-2026-09-16-R3.md
?? MOBILE-CALCULATOR-CLAUDE-AI-R3-FINAL-CLOSURE-HANDOFF-2026-09-16.md
?? MOBILE-CALCULATOR-R3-CODEX-LAUNCH-AUTHORIZATION-2026-09-16.md
?? MOBILE-DROPDOWN-CLOZE-CODEX-LAUNCH-AUTHORIZATION-2026-09-16.md
?? MOBILE-DROPDOWN-CLOZE-OVERFLOW-CODEX-WORK-ORDER-2026-09-16-R2.md
?? MOBILE-DROPDOWN-CLOZE-R1-FINAL-INDEPENDENT-REVIEW-HANDOFF-2026-09-16.md
?? MOBILE-DROPDOWN-CLOZE-R1-INTEGRATION-WORK-ORDER-2026-09-16.md
?? MOBILE-DROPDOWN-CLOZE-R1-OWNER-DISPOSITION-2026-09-16.md
?? MOBILE-REPAIRS-CLAUDE-AI-R2-AMENDMENT-CLOSURE-HANDOFF-2026-09-16.md
?? MOBILE-REPAIRS-CLAUDE-AI-SPEC-REVIEW-HANDOFF-2026-09-16-R1.md
?? PUBLICATION-RECONCILIATION-WORK-ORDER-2026-10-02.md
?? audit/deferred-audit-archaeology-2026-09-12-flash-r1/adjudication.jsonl
?? audit/deferred-audit-archaeology-2026-09-12-flash-r1/candidate-census.jsonl
?? audit/deferred-audit-archaeology-2026-09-12-flash-r1/evidence-index.md
?? audit/deferred-audit-archaeology-2026-09-12-flash-r1/report.md
?? audit/deferred-audit-archaeology-2026-09-12-r1/adjudication.jsonl
?? audit/deferred-audit-archaeology-2026-09-12-r1/candidate-census.jsonl
?? audit/deferred-audit-archaeology-2026-09-12-r1/evidence-index.md
?? audit/deferred-audit-archaeology-2026-09-12-r1/report.md
?? audit/mobile-calculator-action-clearance-r1/integration/final-cloze-file/fixture-manifest.json
?? audit/mobile-calculator-action-clearance-r1/integration/final-cloze-http/fixture-manifest.json
?? audit/mobile-calculator-action-clearance-r1/integration/final-file/fixture-manifest.json
?? audit/mobile-calculator-action-clearance-r1/integration/final-http/fixture-manifest.json
```

After evidence commit: tracked sets empty; exactly the five held paths remained untracked. Before status commit: the only staged path was `M PROJECT-HISTORY.md`; no unstaged tracked path. After the status commit and receipt creation, the final state is:

```text
?? LEARNER-SHELL-R3-CONCEPT-A-IMPLEMENTATION-WORK-ORDER-2026-09-13.md
?? MOBILE-CALCULATOR-ACTION-CLEARANCE-CODEX-WORK-ORDER-2026-09-16-R3.md
?? MOBILE-CALCULATOR-CLAUDE-AI-R3-FINAL-CLOSURE-HANDOFF-2026-09-16.md
?? MOBILE-CALCULATOR-R3-CODEX-LAUNCH-AUTHORIZATION-2026-09-16.md
?? MOBILE-DROPDOWN-CLOZE-R1-OWNER-DISPOSITION-2026-09-16.md
?? PUBLICATION-RECONCILIATION-RECEIPT-2026-10-02.md
```

The receipt itself remains local-only and untracked; its creation is the only extra closing untracked path. Neither the classification report nor either held/input file was modified.

## Review boundary and next gate

This receipt and the exact candidate range are ready for Workasaurus review. No message was sent to another conversation or reviewer. Existing omnibus owner ratification remains closed; no duplicate acceptance archaeology was commissioned. Matrix/N01, advisory, active backfill, Campaign 17 parking, and physical nonzero-safe-area work were not adjudicated, merged, closed or otherwise changed.

The existing [Pages workflow](.github/workflows/pages.yml) triggers on main pushes or explicit dispatch; the [promotion workflow](.github/workflows/promotion-gate.yml) triggers on pull requests targeting main. Local commits triggered neither. No PR or CI run was created; no CI result for this unpublished candidate is claimed.

Further action requires Workasaurus review, then Luke's explicit approval of the exact repository, remote branch/ref and commit range. A prospective review-branch publication is distinct from main synchronization; a main update would trigger Pages deployment and needs its own authorization. Remote tips and local state must be rechecked then. The five held documents remain a separate disposition, and this local-only receipt is outside any presently prepared publication range.

**PREPARED_NOT_PUBLISHED**
