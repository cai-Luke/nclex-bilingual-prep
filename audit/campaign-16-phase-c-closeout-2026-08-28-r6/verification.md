# Campaign 16 Phase C Revision 6 Executor Verification

Date: 2026-08-28  
Seat: Codex executor, §§7–8 only

All commands ran from `/Users/holemini/Desktop/Project Shrimp`. All bank and artifact reads used live working-tree filesystem bytes.

## §7 execution sequence

### Step 1 — live constitutional file

Command:

```sh
sed -n '1,260p' AGENTS.md
```

Emitted result: the complete live `AGENTS.md` text through its final `Working Style` bullet.  
Exit code: `0`.

### Step 2 — Revision-6 self-hash gate

Command:

```sh
shasum -a 256 scratch/CAMPAIGN-16-PHASE-C-REVISION-6-CLOSEOUT-WORK-ORDER-2026-08-28.md
```

Emitted result:

```text
2633ae59473b6087f00dd2f1cdebe00fdc93e847a6042387c099b040aa27a66c  scratch/CAMPAIGN-16-PHASE-C-REVISION-6-CLOSEOUT-WORK-ORDER-2026-08-28.md
```

Exit code: `0`. Exact match to the launch digest.

### Step 3 — work order read in full

Commands:

```sh
sed -n '1,320p' scratch/CAMPAIGN-16-PHASE-C-REVISION-6-CLOSEOUT-WORK-ORDER-2026-08-28.md
sed -n '321,700p' scratch/CAMPAIGN-16-PHASE-C-REVISION-6-CLOSEOUT-WORK-ORDER-2026-08-28.md
```

Emitted result: the complete Revision-6 text from its title through `SEND TO`.  
Exit codes: `0`, `0`.

### Step 4 — freshness gate

Command:

```sh
for p in audit/campaign-16-phase-c-closeout-2026-08-28-r6 audit/campaign-16-phase-c-closeout-check-2026-08-28-r6; do if [ -e "$p" ]; then echo "EXISTS $p"; exit 1; else echo "ABSENT $p"; fi; done
```

Emitted result:

```text
ABSENT audit/campaign-16-phase-c-closeout-2026-08-28-r6
ABSENT audit/campaign-16-phase-c-closeout-check-2026-08-28-r6
```

Exit code: `0`.

### Step 5 — repository identity

Command:

```sh
set -e
pwd
git branch --show-current
git rev-parse HEAD
campaign_upstream_ref=$(git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}')
printf '%s\n' "$campaign_upstream_ref"
git rev-list --left-right --count "$campaign_upstream_ref"...HEAD
```

Emitted result:

```text
/Users/holemini/Desktop/Project Shrimp
main
3286024bcab90c1a114811a7202d956c3e586bf4
origin/main
0	0
```

Exit code: `0`. The same values were observed at executor closing.

### Step 6 — opening dirty-path roster

Command:

```sh
git status --porcelain=v1 --untracked-files=all
```

Emitted result: 28 non-preserved-tree paths after excluding the three §4.1 roots. Every opening path, exact two-character status code, and raw-byte digest is in `preservation.json` → `dirtyPathSet.openingRows`.  
Exit code: `0`.

The opening snapshot used Node `fs.readFileSync` plus `crypto.createHash('sha256')` on each live filesystem path. It emitted `dirtyRowCount: 28` and wrote the rows to the executor preservation record.

### Step 7 — opening preserved-tree inventories

Command implementation:

```text
Node recursive fs.readdirSync({withFileTypes:true}) walk, lexically sorted per directory;
for each regular file: sha256(fs.readFileSync(path)); non-regular entries throw.
```

Emitted result:

```text
Revision-5 producer: 247 files
Revision-5 checker: 6 files
Revision-4 failed run: 8 files
```

Exit code: `0`. All 261 opening path/digest rows are in `preservation.json`.

### Step 8 — banks and predecessor work order

Command:

```sh
shasum -a 256 banks/*.json scratch/CAMPAIGN-16-PHASE-C-UNPAIRED-BOWTIE-ANSWERABILITY-WORK-ORDER-2026-08-27.md
```

Emitted result:

```text
5244b8d37daa49adbd1fbed7991f4ede52ded8ce710e26821841ef5e2ce3719f  banks/burn-canonical.json
36d72a89405fe4400f27b3b8969cdbe1c51f3217151f8b2592b7f877d636f20c  banks/capnography-canonical.json
25f53ded1ac21da4ca9d211040c3f6110ebee38d72ba41d0fc64fe358ba73b71  banks/claude-canonical.json
83d5a6ac7219524f4c528265291cbee2ed5b2f17c13fbeb3649342bae2e4aac5  banks/device-canonical.json
3dc416a4652f5f5712219dde7de87b92f0697fac953750b8abb8fc0dbb976bb6  banks/gemini-canonical.json
e4955f7b8c54e4880bd9ddb0f2f7c35881169f53051b5ed3ce21757f86287b3b  banks/gpt-canonical.json
8068c6917e53257a31c7299454c213f61bea62e61d7cf185cb1a09386f4e4862  banks/hard-cases-canonical.json
2ce6488e65049ba00cd9dccf889a042e0a624f224387382d564d282e147b2645  banks/io-canonical.json
1038cb68f6b91f6a2c981562d97ad9e16179db9b1332c75725fd538595c44b05  banks/lab-canonical.json
f12c03a28ff5b52411843f84bc942b4ca5667e989194357ed2d60a394f17641e  banks/mar-canonical.json
cc3bd0053516fc7ea4b23e814e46f186e6d2dbf40888fa713a862c07ea2b3993  banks/medlabel-canonical.json
e42e2a3fa6aa349a61279e6988e250e65c2b752a6f36d33806a2671e0af0f9e4  banks/visual-canonical.json
5154e25492bced8e4a49d763f04e25e154389c31e085bf37669651e13d411b9d  banks/vitals-canonical.json
74fb97e70ca5820a4e95acc62e2b0f3f54790d0eea766d2be58e8a427f924248  scratch/CAMPAIGN-16-PHASE-C-UNPAIRED-BOWTIE-ANSWERABILITY-WORK-ORDER-2026-08-27.md
```

Exit code: `0`. The 13 bank digests equal the Revision-5 closing `bankRows` values.

### Step 9 — executor root and deliverables

Command/action: created only `audit/campaign-16-phase-c-closeout-2026-08-28-r6/` and wrote the seven §8 files.  
Emitted result: the complete seven-path filesystem inventory is recorded in `preservation.json` → `executorClosingAllowedAdditions.paths`.  
Exit code: `0`.

### Step 10 / §5 — mechanical accounting reconciliation

Command implementation:

```text
Node JSON.parse of all 19 adjudication.jsonl lines plus Markdown-table parsing of the
Revision-5 report's Candidate dispositions and Verdict totals sections; compare candidate IDs
and primary verdicts row-for-row, count verdicts, check CAND-18 fields, and assert arithmetic.
```

Emitted result:

```json
{
  "status": "PASS",
  "reportRowCount": 19,
  "adjudicationRowCount": 19,
  "rowForRowPrimaryAgreement": true,
  "unpaired": { "PASS_STANDALONE": 18, "FAIL_HIDDEN_CASE_DEPENDENCY": 0, "FAIL_UNSUPPORTED_TOKEN_PREMISE": 1, "other": 0, "total": 19 },
  "paired": { "PASS_STANDALONE": 20, "FAIL_HIDDEN_CASE_DEPENDENCY": 7, "FAIL_UNSUPPORTED_TOKEN_PREMISE": 4, "other": 0, "total": 31 },
  "combined": { "PASS_STANDALONE": 38, "FAIL_HIDDEN_CASE_DEPENDENCY": 7, "FAIL_UNSUPPORTED_TOKEN_PREMISE": 5, "other": 0, "total": 50 },
  "cand18ExactFields": true,
  "arithmeticCloses": true
}
```

Exit code: `0`. No semantic verdict was recomputed.

### Step 11 / §4 — closing preservation comparison

Command implementation:

```text
Repeat the Step-6/7/8 filesystem enumeration and SHA-256 procedures; compare every opening
path/status/digest, every preserved-tree inventory and digest, all 13 banks, and the predecessor
work order; require all new Git-visible paths to be under the executor root; inspect the executor
root itself to enumerate all seven files; assert the reserved checker root absent.
```

Emitted result:

```json
{
  "status": "PASS",
  "preservedTrees": {
    "revision5Producer": { "opening": 247, "closing": 247, "inventoryEqual": true, "allRowsUnchanged": true },
    "revision5Checker": { "opening": 6, "closing": 6, "inventoryEqual": true, "allRowsUnchanged": true },
    "revision4FailedRun": { "opening": 8, "closing": 8, "inventoryEqual": true, "allRowsUnchanged": true }
  },
  "banks": "13/13 unchanged",
  "predecessorWorkOrderUnchanged": true,
  "openingDirtyPaths": "28/28 status+digest unchanged",
  "executorAllowedAdditions": 7,
  "unexpectedAdditions": 0,
  "removedOpeningPaths": 0,
  "reservedCheckerRootAbsent": true
}
```

Exit code: `0`.

`status.log` is ignored by the repository's Git rules, so it does not appear in porcelain output. It was enumerated from the executor root's live filesystem inventory and independently confirmed ignored with `git check-ignore -q`; the other six executor files are Git-visible untracked paths. This accounts for all seven allowed additions without weakening the outside-root allowlist.

### Step 12 — executor terminal

Command/action: write the authorized executor terminal to `status.log`, `closeout.md`, and `closeout.json` only.  
Emitted result: `CAMPAIGN16_PHASE_C_CLOSEOUT_READY`.  
Exit code: `0`.

## §4 preservation disposition

- Revision-5 producer tree: 247/247 paths present; inventory equal; every raw-byte digest equal.
- Revision-5 checker tree: 6/6 paths present; inventory equal; every raw-byte digest equal.
- Revision-4 failed-run tree: 8/8 paths present; inventory equal; every raw-byte digest equal.
- Bundled banks: 13/13 match both opening and Revision-5 closing values.
- Revision-5 work order: opening and closing SHA-256 `74fb97e70ca5820a4e95acc62e2b0f3f54790d0eea766d2be58e8a427f924248`.
- Opening unrelated dirty paths: 28/28 preserve exact path, two-character status code, and raw-byte digest.
- Allowed additions: exactly the seven executor-root files listed in `preservation.json`; no outside-root addition or removal.
- Reserved checker root: absent at executor closing.
- Frozen 2026-08-23 census tree: not written.

## Charter trap dispositions

- Trap 1 — **ACTIVE / HANDLED**: MCP repository search was prohibited over `banks/`. Shell `shasum -a 256` and Node filesystem `fs.readFileSync`/SHA-256 were used.
- Trap 2 — **N/A**: no census was generated, regenerated, checked, or compared.
- Trap 3 — **N/A**: `audit:stage-refs` was not invoked.
- Trap 4 — **N/A**: the canonical sweep was not invoked.
- Trap 5 — **HANDLED**: the pinned generator entrypoints `generateArtifacts()`, `openingIdentity()`, `assertFrozenBanks()`, and `finalize-and-verify` were not invoked. The Revision-5 `run.ts` and `test.ts` were not invoked.
- Trap 6 — **ACTIVE / HANDLED**: every bank read came from live working-tree filesystem bytes. No Git-object bank read was used.

## Scope checks

No canonical bank, answer key, rationale, token text, metadata, schema, runtime, ledger status, census artifact, governance file, `PROJECT-HISTORY.md`, or `DECISIONS.md` changed. No commit, push, census operation, semantic re-adjudication, or §9 checker work occurred.
