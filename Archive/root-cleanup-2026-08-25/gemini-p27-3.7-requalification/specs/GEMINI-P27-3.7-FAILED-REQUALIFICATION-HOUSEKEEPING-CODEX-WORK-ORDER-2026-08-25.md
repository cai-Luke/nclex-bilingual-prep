# Project Shrimp — Gemini 3.7 Flash P27 Failed-Requalification Housekeeping Work Order

**Date:** 2026-08-25  
**Seat:** Codex housekeeping / archival closeout  
**Purpose:** close the failed Gemini 3.7 Flash P27 requalification cleanly, preserve the evidence required for future successor requalification, remove disposable calibration debris from live `scratch/`, and leave the repository ready for a separate historical Pair 40 audit  
**Clinical judgment:** none  
**Governance change:** none  
**Pair 40 adjudication/repair:** explicitly out of scope

---

## 0. Starting facts

Current repository was last observed at:

- branch: `main`
- HEAD: `3199bb0e4293f5ee0296d612ff9fdaf644c26c0b`
- relation: `main...origin/main [ahead 5]`
- only visible non-P27 untracked work: `audit/standalone-bowtie-answerability-census-2026-08-23/`

If HEAD has moved when you start, do not reset or rewrite history. Record the actual opening state and continue only if the P27 surfaces below remain intact and there is no overlap with unrelated work.

The authoritative checker result is:

`GEMINI_P27_RUN3_MODULE_A_CHECK_FAIL`

The failed Run 3 checker receipt is externally staged at:

`$HOME/Desktop/gemini-p27-run3-codex-module-a-check-2026-08-25/receipt.md`

Returned receipt SHA-256:

`8a8432c149ca0cfca5577adcaa0d707094b3b41959745ac9e40d76a45ca1963d`

This housekeeping task does **not** reconsider that result.

---

## 1. Non-authority and protected surfaces

Do not modify, delete, move, normalize, regenerate, or stage any of the following:

- `banks/**`
- `BANK-REVIEW-LEDGER.md`
- `PROJECT-HISTORY.md`
- `DECISIONS.md`
- `AGENTS.md`
- any schema/runtime/source file
- `audit/standalone-bowtie-answerability-census-2026-08-23/**`
- the historical Pair 40 item or either endpoint of that pair
- any June historical audit artifact except copying an already-existing file into the closeout archive if this work order explicitly names it; no such copy is required here
- any external P27 evidence directory listed in §3

Do not perform the Pair 40 audit, inspect the current canonical version of Pair 40, repair any item, or decide whether the June adjudication was wrong. The only permitted Pair 40 statement in this task is the factual one already present in the independent checker report: it is an unresolved historical-audit discrepancy requiring a separate work order.

Do not perform Module B or search for the missing Batch 13 supplement.

Do not alter P31/P27 governance. Existing policy already leaves Gemini restricted after failed requalification.

---

## 2. Required opening inventory

Before changing anything:

1. Record branch, HEAD, ahead/behind, staged/unstaged/untracked status.
2. Confirm the standalone bow-tie audit tree is pre-existing and preserve it byte-untouched.
3. Inventory all P27/Gemini-3.7 calibration surfaces in live repo `scratch/` and on Desktop.
4. Hash all durable evidence files before moving/copying them.
5. Write the opening inventory to the eventual closeout receipt.

At minimum, locate these live-repo scratch surfaces:

```text
scratch/GEMINI-P27-CONTENT-PREFLIGHT-REQUALIFICATION-WORK-ORDER-2026-08-24.md
scratch/GEMINI-P27-CALIBRATION-PACKAGE-CODEX-WORK-ORDER-2026-08-25.md
scratch/GEMINI-P27-CALIBRATION-PACKAGE-V2-CORRECTION-CODEX-WORK-ORDER-2026-08-25.md
scratch/CODEX-GEMINI-P27-RUN3-MODULE-A-INDEPENDENT-CHECK-WORK-ORDER-2026-08-25.md
scratch/GEMINI-P27-3.7-FAILED-REQUALIFICATION-HOUSEKEEPING-CODEX-WORK-ORDER-2026-08-25.md
scratch/build_module_a.py
scratch/generate_module_a_docs.py
scratch/verify_module_a.py
scratch/pair_dump/
scratch/gemini-p27-preflight-requalification-2026-08-24/
```

If additional clearly related P27 scratch artifacts exist, inventory them before classifying them as durable or disposable. Do not delete an unrecognized file merely because its name resembles this campaign.

---

## 3. External evidence — preserve in place

The following external surfaces are evidence and must remain byte-unchanged at their existing paths during this task:

```text
$HOME/Desktop/gemini-p27-calibration-input-2026-08-25/
$HOME/Desktop/gemini-p27-calibration-input-2026-08-25-v2/
$HOME/Desktop/gemini-p27-preflight-requalification-run2-2026-08-25/
$HOME/Desktop/gemini-p27-preflight-requalification-run3-2026-08-25/
$HOME/Desktop/gemini-p27-run3-codex-module-a-check-2026-08-25/
$HOME/Desktop/GEMINI-P27-RUN3-FRESH-SESSION-LAUNCH-2026-08-25.md
```

Also preserve any additional external `gemini-p27*` run directory discovered during inventory unless it is clearly a duplicate temporary directory and you can prove it is safe to remove. Default is **preserve**.

Known anchor hashes/receipts:

- V1 package receipt: `d42489021d93ae9ed164dbf3f5733543a9ea798bdefc8e0a320b9e6515a50060`
- V2 package receipt: `198cd4abbe80c8227ee742288b2f701e1e42fe5b77328f98beb2cd7b942dd829`
- Run 3 candidate:
  - `module-a/pair-review.jsonl` — `766241510748475fc8e9c1bbbd525767bb3c291e5e33674f6225f4caabcc0cce`
  - `module-a/report.md` — `ea990d702e15c0b3a060e5e18b009a574c079a56e3b494a291147328f9efa6f0`
  - `module-a/verification.md` — `75cd17dd9f7d5ad521c83990609f74d9cc81e8439848366a75b71a4f8721eba9`
- Run 3 checker final report: `f21c557cf60b51b1ef5212a445524899406631a5f9862cd79f1891a0445ce800`
- Run 3 checker receipt: returned SHA `8a8432c149ca0cfca5577adcaa0d707094b3b41959745ac9e40d76a45ca1963d`
- Run 3 checker work order: `bc3c18087ae7a6176c7f7b479fb249209992ac43699c465361b564dc3320fd0`

Recompute the hashes you can and record any mismatch. A mismatch in durable evidence is a blocker: stop rather than archiving altered evidence under the known result.

Do **not** move these external directories into the repository. In particular, do not commit the full V1/V2 historical-repo export.

---

## 4. Create a durable repository archive

Create:

`Archive/root-cleanup-2026-08-25/gemini-p27-3.7-requalification/`

Required structure:

```text
Archive/root-cleanup-2026-08-25/gemini-p27-3.7-requalification/
  CLOSEOUT.md
  EXTERNAL-EVIDENCE-MANIFEST.md
  specs/
  run1/
  run2/
  run3/
  checker/
```

The goal is to preserve a compact, reviewable forcing record without importing the giant calibration packages.

### 4.1 `specs/`

Move the completed P27 work-order lineage out of live `scratch/` into `specs/`, preserving bytes:

- `GEMINI-P27-CONTENT-PREFLIGHT-REQUALIFICATION-WORK-ORDER-2026-08-24.md`
- `GEMINI-P27-CALIBRATION-PACKAGE-CODEX-WORK-ORDER-2026-08-25.md`
- `GEMINI-P27-CALIBRATION-PACKAGE-V2-CORRECTION-CODEX-WORK-ORDER-2026-08-25.md`
- `CODEX-GEMINI-P27-RUN3-MODULE-A-INDEPENDENT-CHECK-WORK-ORDER-2026-08-25.md`
- this housekeeping work order itself after execution is otherwise complete

Copy the external fresh-session launch note into `specs/` while leaving the external original unchanged:

- `GEMINI-P27-RUN3-FRESH-SESSION-LAUNCH-2026-08-25.md`

For every moved/copied file, record source path, archive path, pre/post hash, and byte size.

### 4.2 `run1/`

Move the entire existing live-repo Run 1 directory:

`scratch/gemini-p27-preflight-requalification-2026-08-24/`

into archive `run1/` preserving all bytes and relative structure.

Run 1 is historical evidence even though its Module A baseline was invalid. Do not prune it internally.

### 4.3 `run2/`

Copy only the compact Run 2 evidence needed to preserve the non-blind/provisional chronology; leave the external originals unchanged.

At minimum copy:

- `final-receipt.md`
- `identity-receipt.md`
- `module-a/verification.md`

If there is a small run-level contamination/isolation note that materially explains Run 2 status, copy it too. Do not copy redundant large generated prose unless needed to establish chronology.

`CLOSEOUT.md` must explicitly record that Run 2 was not accepted as blind requalification evidence because it was executed in continuing candidate context and substantially reproduced prior candidate prose; this is a controller disposition, not a candidate self-finding.

### 4.4 `run3/`

Copy, preserving external originals:

- `identity-receipt.md`
- `final-receipt.md`
- `module-a/pair-review.jsonl`
- `module-a/report.md`
- `module-a/verification.md`

These are the definitive fresh-session candidate artifacts checked by Codex.

### 4.5 `checker/`

Copy, preserving external originals:

- `00-input-and-seal-receipt.md`
- `01-blind-checker-key.jsonl`
- `01-blind-checker-key.md`
- `02-candidate-comparison.jsonl`
- `03-template-and-pair-specificity-audit.md`
- `04-candidate-verification-audit.md`
- `05-historical-key-comparison.md`
- `final-report.md`
- `receipt.md`

Do not copy `_tools/` unless a copied report actually depends on an unrecorded algorithm detail that cannot be understood from the report itself. The external checker directory remains the complete execution evidence.

### 4.6 `EXTERNAL-EVIDENCE-MANIFEST.md`

Record every preserved external directory/file, its purpose, and the strongest available receipt/root hashes. Explicitly state that the external evidence remains in place and was not modified by housekeeping.

Include at least:

- V1 calibration package — packaging history
- V2 calibration package — authoritative corrected Module A frozen package; Module B missing supplement state
- Run 2 — provisional/non-blind candidate run
- Run 3 — definitive fresh candidate run
- Codex checker — definitive independent Module A disposition
- Run 3 fresh-session launch note

Do not claim a directory root hash if none was actually computed.

---

## 5. Write `CLOSEOUT.md`

This is the durable human-readable closure record.

It must state, compactly and factually:

### Candidate and target

- Gemini 3.7 Flash / `gemini-3.7-flash`
- attempted P27 requalification for content-generation preflight judgment
- P31 restriction remains in force because requalification did not succeed
- no direct-canonical-edit authority was ever in scope

### Run chronology

1. **Run 1 — invalid historical baseline**
   - candidate used current canonical items instead of the frozen historical package for Module A
   - Module B correctly stopped because the exact Batch 13 supplement was absent
   - preserved as evidence, not scored as a pass

2. **Run 2 — non-blind/provisional**
   - corrected V2 historical package supplied
   - candidate output substantially reproduced prior-run prose because execution continued in prior conversational context
   - not accepted as independent blind requalification evidence
   - Module B still blocked on missing exact supplement

3. **Run 3 — definitive fresh-session Module A**
   - isolated fresh context
   - 46/46 pairs produced
   - candidate distribution: 0 contradiction / 31 reconcilable / 15 no-shared-decision

4. **Independent Codex checker**
   - blind key sealed before candidate artifact was opened
   - candidate comparison sealed before held historical answer artifacts were opened
   - terminal: `GEMINI_P27_RUN3_MODULE_A_CHECK_FAIL`
   - checker counts: 15 MAJOR, 23 MINOR, 8 NONE; verdict agreement 36/46
   - widespread unsupported/mutated EN/ZH rule extraction and false corpus-wide traceability PASS
   - old verbatim boilerplate signature improved, but functional pair-specific/source-fidelity failure remained

### Module B

State only:

- exact historical Batch 13 supplement remained unrecovered
- no substitute was used
- Module B was never completed
- after Module A failed, no further Module B replay is commissioned for this Gemini 3.7 requalification

### Pair 40 follow-up boundary

State exactly that the blind Codex checker independently identified an **unresolved historical discrepancy at Pair 40** involving a frozen key/rationale reversal and disagreement with the 2026-06 historical zero-contradiction adjudication.

Do not decide whether the current canonical bank is affected. Do not repair it. End this subsection with:

`FOLLOW_UP_REQUIRED: PAIR_40_HISTORICAL_AUDIT_DEFECT`

### Governance disposition

State:

- this closeout makes **no new governance rule**;
- P27 already requires successor generations to inherit restricted routing until successful requalification;
- P31 therefore remains binding for Gemini 3.7 Flash's content-judgment/preflight lane;
- a future separately identifiable Gemini successor may still be tested under P27 using a new bounded requalification;
- Run 3 and its checker become part of the durable forcing record for that future evaluation.

Do not edit `DECISIONS.md` merely to restate this.

---

## 6. Remove disposable live `scratch/` machinery

Only after the durable archive is complete and hash-verified, delete these disposable Run 1 helper surfaces from live `scratch/`:

```text
scratch/build_module_a.py
scratch/generate_module_a_docs.py
scratch/verify_module_a.py
scratch/pair_dump/
```

Before deletion, verify that none contains unique substantive evidence not already present in archived Run 1 artifacts. If a helper contains unique evidence rather than reproducible machinery, preserve that evidence in `run1/` and explain why.

After the moves/deletions, there should be no active Gemini P27 calibration machinery left in live `scratch/` except unrelated work not owned by this task.

Do not use broad patterns such as `rm -rf scratch/*P27*`.

---

## 7. Verification before commit

Verify all of the following:

1. Archive tree exists and all required files parse/read.
2. Archived copies/moves match source hashes exactly where byte identity is required.
3. External V1/V2/Run2/Run3/checker evidence remains unchanged at original paths.
4. Run 3 candidate hashes still equal the known hashes in §3.
5. Checker receipt/final report still equal their known hashes.
6. No canonical bank/schema/runtime/governance file changed.
7. `DECISIONS.md` is byte-unchanged.
8. `PROJECT-HISTORY.md` and `BANK-REVIEW-LEDGER.md` are byte-unchanged.
9. Bow-tie audit tree is byte-untouched.
10. No Pair 40 endpoint/content was edited.
11. No Module B recovery search was performed.
12. Live `scratch/` no longer contains the completed P27 work-order lineage, Run 1 directory, or disposable Module A helper scripts/pair dump.
13. `git diff --check` passes for task-owned changes.
14. `git status` contains only:
    - task-owned archive/move/deletion changes intended for this closeout; and
    - the same pre-existing unrelated bow-tie audit paths.

If unrelated state changes during execution, preserve it and report it rather than absorbing it into this commit.

---

## 8. Commit boundary

Stage **only** this housekeeping closeout.

Expected task-owned tracked changes are limited to:

- new archive files under `Archive/root-cleanup-2026-08-25/gemini-p27-3.7-requalification/**`
- removals/moves of completed P27 files from `scratch/` if those surfaces are tracked/visible to Git

Do not stage the standalone bow-tie audit.

Commit with subject:

`docs(audit): close failed Gemini 3.7 P27 requalification`

Do not push.

If the repo's ignore policy means some scratch removals are not represented in Git, that is fine; record filesystem cleanup separately in the receipt and commit the durable archive only.

---

## 9. Required closeout receipt

Write before commit under the archive:

`HOUSEKEEPING-RECEIPT.md`

It must include:

- opening branch/HEAD/status
- final branch/HEAD/status
- exact commit SHA created by this task
- all archived source→destination mappings
- pre/post hashes and byte sizes for preserved evidence
- list of deleted disposable files/directories
- list of preserved external evidence paths
- explicit statement that external evidence was not modified
- explicit statement that Pair 40 was not adjudicated or repaired
- explicit statement that no governance/content/ledger/history edits were made
- explicit statement that the bow-tie audit was untouched
- archive root path
- terminal token

Authorized success token:

`GEMINI_P27_37_FAILED_REQUALIFICATION_HOUSEKEEPING_COMPLETE`

Blocked token:

`GEMINI_P27_37_FAILED_REQUALIFICATION_HOUSEKEEPING_BLOCKED`

If any known evidence hash mismatches, do not continue with cleanup; return the blocked token with the mismatching path/hash.
