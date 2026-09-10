# Campaign 16 Phase C Verification — Blocked

Terminal status: `CAMPAIGN16_PHASE_C_BLOCKED`

## Launch and repository state

- Live `AGENTS.md` was read before the work-order digest was computed.
- Frozen work-order raw file-byte SHA-256: expected and observed `d9716c00e27e22f0fd70f8517af7bafcbec85861676869d00bba1690c6af2337`; **PASS**, exit 0.
- Repository: `/Users/holemini/Desktop/Project Shrimp`; branch `main`; HEAD `3286024bcab90c1a114811a7202d956c3e586bf4`; upstream `origin/main`; ahead/behind `0/0`.
- Phase B state: uncommitted working-tree publication bytes. The dirty GPT bank was allowed under the frozen §3.1 inversion.
- Population reads used parsed working-tree filesystem bytes, never `git show HEAD:<bank>`.

## Ordered gates and exact commands

### §3.2 bank identity

Command run:

```sh
node -e 'const fs=require("fs"),crypto=require("crypto"),path=require("path"); const base=JSON.parse(fs.readFileSync("audit/campaign-16-phase-a-baseline-2026-08-26/baseline.json","utf8")).campaignBaselineFileByteSha256; const files=fs.readdirSync("banks").filter(x=>x.endsWith(".json")).sort().map(x=>`banks/${x}`); if(files.length!==13) throw new Error(`expected 13 banks, observed ${files.length}`); const out=[]; for(const f of files){const observed=crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex"); const expected=f==="banks/gpt-canonical.json"?"e4955f7b8c54e4880bd9ddb0f2f7c35881169f53051b5ed3ce21757f86287b3b":base[f]; const match=observed===expected; out.push({bankPath:f,expected,observed,match}); if(!match) process.exitCode=1;} console.log(JSON.stringify({status:process.exitCode?"FAIL":"PASS",bankCount:files.length,rows:out},null,2));'
```

Emitted status: `PASS`, 13/13 exact matches. Process exit code: `0`.

The 12 non-GPT expected values came from `audit/campaign-16-phase-a-baseline-2026-08-26/baseline.json` → `campaignBaselineFileByteSha256`. GPT matched the work-order literal `e4955f7b8c54e4880bd9ddb0f2f7c35881169f53051b5ed3ce21757f86287b3b`, corroborated at `audit/campaign-16-phase-b-recovery-2026-08-27/status-stage-3.log` lines 117 and 145.

### §§4.1, 4.2, and 4.3

Command run:

```sh
npx tsx audit/campaign-16-phase-c-unpaired-bowtie-2026-08-27/run.ts generate
```

The command loads all 13 banks from the working tree; imports only pure `derivePopulation`, `stableJson`, and `sha256`; and evaluates gates in frozen order. It passed §4.1 at 50 total suffix rows, 31 paired (30 `EXACT`, 1 `ORDINAL_SUFFIX`), 19 unpaired, with zero Phase A roster additions/removals. It passed §4.2 at 19/19 payload-hash matches under `sha256(stableJson(q, 0))`, where stable JSON sorts keys, uses compact `JSON.stringify`, and appends one newline. It then emitted `§4.3 _bt_ falsification gate failed`. Process exit code: `1`.

Exact failing-row evidence commands:

```sh
rg -n 'gpt_balance6a_2026_07_16_bt_perioperative_care_13|gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14' banks/gpt-canonical.json
node -e 'const fs=require("fs");const b=JSON.parse(fs.readFileSync("banks/gpt-canonical.json","utf8"));const ids=["gpt_balance6a_2026_07_16_bt_perioperative_care_13","gpt_balance6b_2026_07_16_bt_procedural_complications_dialysis_14"];const suffix=b.questions.filter(q=>q.itemType==="bowtie"&&q.id.endsWith("_bowtie")).map(q=>q.id);for(const id of ids){const rows=b.questions.filter(q=>q.id===id);console.log(JSON.stringify({id,exactMatches:rows.length,itemTypes:rows.map(q=>q.itemType),absentFromSuffixRoster:!suffix.includes(id)}))}'
```

Emitted evidence: both frozen exact IDs had `exactMatches: 0` and were absent from the suffix roster; `rg` found only `_r2` live IDs at lines 142176 and 142623. Process exit code: `0`.

### §§4.4, 4.5, and 4.6

Not run. The §4.3 stop was terminal and execution did not continue to the sibling-absence, paired-preservation, or fixed-shape gates.

### §6 nullable manifest and §7 blind packets

The adapted TypeScript harness was created and encodes all companion fields and `pairingRule` as null literals plus `unpairedReason`. Packet-generation code projects only the permitted learner-facing fields. Generation was not reached because §4.3 stopped the same command before artifact emission. Focused tests and repeatability were not run after the terminal blocker.

No semantic context was created. Pilot, scale-up, Phase-E standalone comparison, bounded provenance, bilingual/clinical collateral, and Claude checking were not run.

## Charter traps

- Trap 1: handled with `rg` and Node parsing over the large GPT bank; no MCP search was used.
- Trap 2: `N/A`; no census generation or checking ran.
- Trap 3: `N/A`; no stage-reference audit ran.
- Trap 4: `N/A`; no canonical sweep ran.
- Trap 5: handled. The pinned generator, `openingIdentity`, `assertFrozenBanks`, and `finalize-and-verify` were not invoked; only the three permitted pure helpers were imported.
- Trap 6: handled. All bank reads used working-tree filesystem bytes, not `git show HEAD:<bank>`.

## Closeout preservation proof

The closeout read-only comparison emitted:

```json
{
  "outsideStatusExactMatch": true,
  "allOpeningDirtyFileBytesPreserved": true,
  "decisionsPreserved": true,
  "banks13of13Preserved": true
}
```

Process exit code: `0`. All 28 pre-existing dirty files retained their opening byte hashes and porcelain statuses. All 13 bank files retained their Phase C opening expected identities. `DECISIONS.md` retained SHA-256 `ec80e287a726ad4114a198b67e89d3647e3c23dc82f153984e81e346067e21df`. No staging operation, commit, push, stash, restore, clean, bank mutation, or Phase D action occurred.
