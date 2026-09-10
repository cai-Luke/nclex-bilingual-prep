# Campaign 16 Phase C Revision 6 — Independent Checker Record (§9)

Seat: Claude (independent checker). Scope: work-order §9 only. Mechanical and transcriptional only —
no semantic review, no re-derivation of any verdict, no reopening of the CAND-18 adjudication.

Date: 2026-08-28
Checker root: `audit/campaign-16-phase-c-closeout-check-2026-08-28-r6/`

## 0. Preliminaries

- Read live `AGENTS.md` before any repository measurement.
- Re-hashed `scratch/CAMPAIGN-16-PHASE-C-REVISION-6-CLOSEOUT-WORK-ORDER-2026-08-28.md` from live disk:
  `2633ae59473b6087f00dd2f1cdebe00fdc93e847a6042387c099b040aa27a66c` — matches the launch-prompt
  digest exactly.

## Step 1 — Freshness assertion

Asserted `audit/campaign-16-phase-c-closeout-check-2026-08-28-r6/` did not exist (confirmed via
`ls`, which returned "No such file or directory"). Created the root only after that assertion
passed. This assertion is the checker's own and is independent of the executor's §7 step 4 guard.

**Result: PASSED.**

## Step 2 — Executor terminal status

Read `audit/campaign-16-phase-c-closeout-2026-08-28-r6/status.log` directly from the live
filesystem: content is exactly `CAMPAIGN16_PHASE_C_CLOSEOUT_READY`. The executor root also contains
all seven required §8 files (`closeout.json`, `closeout.md`, `execution-plan.md`,
`owner-adjudication.md`, `preservation.json`, `status.log`, `verification.md`).

Per the work order, `status.log` is gitignored and does not appear in
`git status --porcelain=v1 --untracked-files=all` output; this is expected and is not itself a
failure. Verified from the live filesystem (file present, correct content) and confirmed it is
included in the frozen executor inventory below.

**Result: PASSED.**

## Step 3 — Frozen executor inventory

Enumerated and SHA-256-hashed (raw file bytes, via Node `fs`/`crypto`) every file under the executor
root before any substantive comparison. Recorded in `check.json` → `frozenExecutorInventory`. 7
files, 7 hashes recorded.

## Step 4 — Independent live re-hash and re-enumeration

All of the following were re-derived from live disk independently, using `shasum -a 256` / Node
`fs.readFileSync` + `crypto.createHash('sha256')` and `git status --porcelain=v1
--untracked-files=all` via direct shell invocation — never by trusting `preservation.json`'s
self-report, and never via MCP `search_repository_files` over `banks/` (Trap 1), and never via
`git show HEAD:banks/...` (Trap 6).

### 4a. Three preserved Phase C trees

| Tree | Live file count | Recorded closing count | Inventory equal | New files | Missing files | Hash mismatches |
|---|---:|---:|---|---:|---:|---:|
| `audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/` | 247 | 247 | yes | 0 | 0 | 0 |
| `audit/campaign-16-phase-c-check-2026-08-27-r5/` | 6 | 6 | yes | 0 | 0 | 0 |
| `audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27/` | 8 | 8 | yes | 0 | 0 | 0 |

All three trees: byte-for-byte and inventory-for-inventory unchanged, independently confirmed.

### 4b. 13 bundled banks

Live directory listing of `banks/*.json` confirms exactly 13 files (no 14th bank appeared). All 13
live SHA-256 digests match both the executor's recorded closing values and the Revision-5
`closeout-preservation.json` → `bankRows` closing values cited as authority. In particular,
`banks/gpt-canonical.json` live SHA-256 =
`e4955f7b8c54e4880bd9ddb0f2f7c35881169f53051b5ed3ce21757f86287b3b`, matching the digest the work
order itself cites in §4.2.

### 4c. Revision-5 work order file

Live SHA-256 of
`scratch/CAMPAIGN-16-PHASE-C-UNPAIRED-BOWTIE-ANSWERABILITY-WORK-ORDER-2026-08-27.md` =
`74fb97e70ca5820a4e95acc62e2b0f3f54790d0eea766d2be58e8a427f924248`, matching both the executor's
recorded value and the work order's own cited digest.

### 4d. §4.3 dirty-path roster and full git status re-derivation

Re-ran `git status --porcelain=v1 --untracked-files=all` live. The executor's recorded opening
roster contains 28 paths (not the ~27 given only as authoring-time orientation in §4.3 — the
executor correctly derived the live set rather than trimming/padding to the orientation count).
For every one of those 28 paths: live status code matches the recorded opening status code, and live
raw-file-byte SHA-256 matches the recorded value. No opening path was removed.

Comparing the full live status output against an allowlist consisting of (a) the 28 opening dirty
paths, (b) the three preserved trees, (c) the executor's Revision-6 root, and (d) this checker's own
Revision-6 root: **zero unexpected paths** appeared anywhere else in the working tree. The frozen
2026-08-23 census tree does not appear in live git status at all, consistent with it being untouched.

**Step 4 overall result: PASSED — no discharge relied on `preservation.json`'s self-report; every
figure above was independently re-derived from live disk.**

## Step 5 — Content and reconciliation verification (live disk, no self-report accepted)

- **Owner text verbatim**: Extracted the blockquote from work-order §2 and the blockquote in
  `owner-adjudication.md` (14 lines each) and diffed them line-by-line. **Exact match.**
- **§3 finding stated in `closeout.md`**: confirmed present, including the explicit statement that
  the Revision-5 §12 requirement was complete independent re-derivation (not unanimity) and that it
  was met, and the explicit statement that the `CAMPAIGN16_PHASE_C_BLOCKED` terminal is superseded by
  owner adjudication and left byte-identical on disk.
- **Dissent preservation**: `closeout.md` characterizes Claude's `PASS_STANDALONE` derivation as "a
  legitimate checker dissent," states it was not withdrawn/downgraded/rewritten, and lists five
  evidence paths under `audit/campaign-16-phase-c-check-2026-08-27-r5/`. Confirmed those five paths
  exist in the live, unchanged preserved checker tree (part of the step-4 tree re-hash).
- **§5 accounting reconciliation**: Independently parsed
  `audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/report.md` (candidate-disposition table
  and "Verdict totals and combined current accounting" table) and
  `audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27-r5/adjudication.jsonl` (19 JSON Lines rows,
  parsed and tallied by `primaryVerdict`) directly — not via `preservation.json`'s
  `reconciliation` field. Both independently reproduce: unpaired 18/0/1/19, paired 20/7/4/31,
  combined 38/7/5/50, and the CAND-18 row (`gpt_format7c_exercise_hypoglycemia_bowtie`,
  `FAIL_UNSUPPORTED_TOKEN_PREMISE`, secondary `RATIONALE_ADDS_MISSING_FACT`, provenance
  `RATIONALE_ONLY`, advisory `P1`). These match `closeout.md` and `closeout.json` exactly.
  **No discrepancy; arithmetic closes.**
- **`preservation.json` internal consistency**: its recorded tree/bank/work-order/dirty-path closing
  values match the step-4 independent live re-hash in every row checked; its
  `executorClosingAllowedAdditions` enumerates exactly the seven executor-root paths (six
  status-visible plus `status.log` under `gitIgnoredPaths`), matching the live executor inventory;
  its `reservedCheckerRoot.absentAtExecutorClosing` is `true`, consistent with this checker's own
  step-1 freshness assertion.
- **Six trap dispositions in `verification.md`**: confirmed present — Trap 1 ACTIVE/HANDLED, Trap 2
  N/A, Trap 3 N/A, Trap 4 N/A, Trap 5 HANDLED, Trap 6 ACTIVE/HANDLED.
- **No prohibited surface changed, no commit/push**: live `git status` shows no change to any
  canonical bank beyond the pre-existing `gpt-canonical.json` modification already present in the
  opening dirty-path set (unchanged since opening — not a Revision-6 side effect); `PROJECT-HISTORY.md`
  and `DECISIONS.md` show no new modification; `git rev-parse HEAD` is unchanged from the executor's
  recorded closing value; `HEAD` vs `@{upstream}` ahead/behind is `0\t0`, confirming no commit and no
  push occurred during or after execution.

**Step 5 overall result: PASSED.**

## Step 6 — Executor inventory re-hash (proof the checker altered nothing)

Re-hashed all seven executor-root files at the end of this check and compared against the step-3
frozen inventory: **byte-for-byte identical, 7/7.** The checker wrote nothing into, and altered
nothing in, the executor's Revision-6 root.

## Out-of-scope compliance

This check performed no semantic review, opened no reviewer context, re-derived no verdict, and did
not relitigate CAND-18. It did not reopen Revision-5 §§7–8, did not modify the executor tree, and made
no commit or push.

## Limitations encountered

None. All required comparisons in §9 steps 1–6 were completed against live disk.

## Checker terminal status

`CAMPAIGN16_PHASE_C_CLOSEOUT_VERIFIED`

All §10.1 commission-gate conditions hold as independently verified above. This is the discharge of
the §9 checker commission only. **It is not Phase C closure.** Per work-order §10.2, Phase C closes
only when the owner, having read the §8 executor record and this §9 checker record, declares it
closed — a declaration this checker does not and cannot make.
