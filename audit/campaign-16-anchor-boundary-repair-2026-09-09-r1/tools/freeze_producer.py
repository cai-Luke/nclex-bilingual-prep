"""Validate the producer-only artifact graph, optionally freeze all 27 packets.
Does not select boundaries, accept judgments, run a checker, or change banks.
"""
import argparse
import datetime
import hashlib
import json
import subprocess
from pathlib import Path
from producer_io import ROOT, digest, validate_rows

REPO=ROOT.parents[1]
read=lambda p:json.loads(Path(p).read_text())

def reconcile(require_complete=False):
    opening=read(ROOT/'opening-state.json')
    manifest=read(ROOT/'commission-manifest.json')
    assert digest(REPO/opening['workOrderPath'])==opening['workOrderSha256']==manifest['workOrderSha256']
    assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=REPO,text=True).strip()==opening['head']
    assert subprocess.check_output(['git','branch','--show-current'],cwd=REPO,text=True).strip()==opening['branch']
    assert subprocess.check_output(['git','rev-parse',opening['upstream']],cwd=REPO,text=True).strip()==opening['upstreamHead']
    tracked=read(ROOT/'evidence/opening-tracked-files.json')
    changed=[p for p,h in tracked.items() if not (REPO/p).is_file() or digest(REPO/p)!=h]
    assert not changed, f'CAMPAIGN16_BOUNDARY_REPAIR_BLOCKED_WORKTREE_DRIFT: {changed}'
    status=subprocess.check_output(['git','status','--porcelain=v1','--untracked-files=all'],cwd=REPO,text=True)
    allowed_prefix=str(ROOT.relative_to(REPO))+'/'
    for line in status.splitlines():
        p=line[3:]
        assert line.startswith('?? ') and (p.startswith(allowed_prefix) or p==opening['inventoryPath']), f'CAMPAIGN16_BOUNDARY_REPAIR_BLOCKED_WORKTREE_DRIFT: {line}'
    live_banks={str(p.relative_to(REPO)):digest(p) for p in sorted((REPO/'banks').glob('*.json'))}
    assert live_banks=={p:v['sha256'] for p,v in opening['banks'].items()}, 'CAMPAIGN16_BOUNDARY_REPAIR_BLOCKED_FINGERPRINT_MISMATCH'
    assert digest(REPO/opening['inventoryPath'])==opening['inventorySha256']
    inventory=[json.loads(l) for l in (REPO/opening['inventoryPath']).read_text().splitlines()]
    assert len(inventory)==451 and len({(r['bankPath'],r['parentCaseId']) for r in inventory})==93
    assert opening['packets']==manifest['packets']
    packets=manifest['packets']
    assert len(packets)==27 and sum(p['rowCount'] for p in packets)==451
    expected_paths={f"{p['repairPacketId']}.json" for p in packets}
    assert {p.name for p in (ROOT/'producer').glob('*.json')}<=expected_paths
    completed=[]
    all_rows=[]
    for assignment in packets:
        pid=assignment['repairPacketId']
        assert assignment['producer']=='Codex / GPT-6 Astra'
        assert assignment['checker']=='Claude Code / Claude Opus 5'
        frozen=[r for r in inventory if r['repairPacketId']==pid]
        assert len(frozen)==assignment['rowCount'] and 6<=len(frozen)<=20
        source_path=ROOT/'source-packets'/f'{pid}.json'
        source=read(source_path)
        bank=read(REPO/assignment['bankPath'])
        parents=[q for q in bank['questions'] if q['id'] in assignment['parentCaseIds']]
        assert source['inventoryRows']==frozen
        assert source['parents']==parents
        assert len(parents)==len(assignment['parentCaseIds'])
        assert source['bankSha256']==opening['banks'][assignment['bankPath']]['sha256']
        out=ROOT/'producer'/f'{pid}.json'
        if not out.exists():
            assert not require_complete, f'missing packet {pid}'
            continue
        receipt_path=ROOT/'producer-support'/f'{pid}-freeze.json'
        if not receipt_path.exists() and not require_complete:
            continue  # A producing agent may still be completing its exclusive write.
        packet=read(out)
        assert packet['repairPacketId']==pid and packet['producer']==assignment['producer']
        assert packet['role']=='PRODUCER_SEMANTIC_RECONSTRUCTION' and packet['independentReview'] is False
        assert packet['sourcePacketSha256']==digest(source_path)
        assert packet['workOrderSha256']==manifest['workOrderSha256']
        assert packet['parentCaseIds']==assignment['parentCaseIds']
        validate_rows(pid,packet['rows'])
        receipt=read(receipt_path)
        assert receipt['sha256']==digest(out) and receipt['bytes']==out.stat().st_size
        assert receipt['rowCount']==len(packet['rows']) and receipt['parentCount']==len(packet['parentCaseIds'])
        completed.append(dict(repairPacketId=pid,path=str(out.relative_to(ROOT)),sha256=digest(out),rowCount=len(packet['rows']),parentCount=len(packet['parentCaseIds']),receiptSha256=digest(receipt_path),sourcePacketSha256=digest(source_path)))
        all_rows.extend(packet['rows'])
    assert len({r['rowKey'] for r in all_rows})==len(all_rows)
    if require_complete:
        assert len(completed)==27 and len(all_rows)==451
        assert {r['rowKey'] for r in all_rows}=={r['rowKey'] for r in inventory}
        for name in ('checker-freeze.json','comparison.json','comparison.md','accepted-boundaries.jsonl','exceptions.jsonl','patch-plan.json','schema-floor-plan.json'):
            assert not (ROOT/name).exists(), f'producer boundary crossed: {name}'
        assert not (ROOT/'checker').exists() or not list((ROOT/'checker').iterdir())
        assert read(ROOT/'evidence/verifier-self-test.json')['pass'] is True
        verifier_evidence=read(ROOT/'evidence/verifier-self-test.json')
        assert digest(ROOT/'tools/verify-boundaries.ts')==verifier_evidence['toolSha256']
        assert all(digest(REPO/p)==h for p,h in verifier_evidence['sourceSha256'].items())
    return dict(status='COMPLETE_PRODUCER_RECONCILIATION' if require_complete else 'PRODUCER_PROGRESS',rows=len(all_rows),parents=len({(r['bankPath'],r['parentCaseId']) for r in all_rows}),packets=len(completed),expectedRows=451,expectedParents=93,expectedPackets=27,all13BanksUnchanged=True,allOpeningTrackedFilesUnchanged=True,sourceSnapshotsEqualLiveParents=True,packetReceipts=completed)

def handoff(opening, freeze_sha):
    text=f'''# External blind-checker handoff — producer freeze only

Commission root: `{ROOT.relative_to(REPO)}/`

Work order: `{opening['workOrderPath']}`  
Work-order SHA-256: `{opening['workOrderSha256']}`

Opening local-disk state: branch `main`, HEAD `{opening['head']}`, configured upstream `origin/main` at the same commit, ahead/behind `0/0`. The opening index and worktree were clean. Read-only remote inspection confirmed the pre-commission push. No Git mutation operation was performed after opening.

Access snapshot: these producer artifacts are local and uncommitted. The external checker must use this explicit local disk snapshot; a GitHub-only reader cannot see the new commission artifacts. Reconfirm the listed source hashes and repository state before beginning the blind pass.

Mandatory preflight: PASS. The builder reproduced inventory SHA-256 `{opening['inventorySha256']}`; preflight self-tests passed 15/15. The live preflight matched every one of the 13 pinned bank hashes, all 451 unique row identities and 93 parent cases, pure-omission shape, and exact declared stage lists. See `evidence/inventory-build.json`, `evidence/preflight-self-test.json`, and `evidence/preflight.json`.

Complete producer reconciliation: **451 rows / 93 parents / 27 original packets**, with zero missing, duplicate, added, or split-parent identities. All 27 source packets still equal the live whole-parent objects. All 13 banks and all pre-existing tracked files remain byte-unchanged. The four affected row populations remain 58 Claude-bank, 46 Gemini-bank, 243 GPT-bank, and 104 hard-cases-bank rows.

Producer freeze: `producer-freeze.json`  
Producer freeze SHA-256: `{freeze_sha}`  
Every producer packet has its own hash and freeze receipt. The freeze manifest exposes identity counts and hashes only; it contains no adjudication distribution or row reasoning.

The new read-only `tools/verify-boundaries.ts` passed 69 synthetic self-tests, application TypeScript and a focused strict TypeScript check. Its default/missing-input guards fail closed. This is future structural-verification tooling, not evidence of repaired banks or independent semantic acceptance.

Producer provenance: Codex / GPT-6 Astra. Bounded Astra descendants supplied the verifier implementation and producer semantic evidence for packets 001–009, 010–018 and 019–024. The primary Astra seat reconstructed packets 025–027 and recorded opening state, source snapshots, producer IO/reconciliation and the complete freeze. All belong to one producing tree; these contributions are implementation and producer evidence, not independent review. **Only external Claude Code / Claude Opus 5 is the declared independent content checker.** No checker context has been started or supplied producer judgments by this commission.

## Files the blind checker MAY read before its complete freeze

Use an allowlisted read scope; do not search the entire commission or this producing conversation.

- This `external-checker-handoff.md`, `opening-state.json`, `commission-manifest.json`, `producer-freeze.json` and `producer-freeze.sha256` (hash metadata only; do not open producer packets to recompute their hashes yet).
- `source-packets/repair-001.json` through `source-packets/repair-027.json`: whole-parent live-source copies plus frozen identity rows, with no adjudications.
- Live canonical `banks/*.json`; the exact frozen inventory at `{opening['inventoryPath']}`; its `build-inventory.ts` and `preflight-verify.ts` for mechanical provenance only. R4 supersedes the old string-only post-repair rule.
- The R4 work order named above; `AGENTS.md`; the R4-required principles/routing in `DECISIONS.md`; `PROJECT-HISTORY.md`; `NCLEX-Question-Schema.md`; `BANK-REVIEW-LEDGER.md`; `BANK-CENSUS.md`; and `docs/AGENTS-RUNBOOK.md`.
- The accepted executable contract: `src/types.ts`, `src/schema.ts`, `src/caseVisibilityBoundary.ts`, `src/examLayout.ts`, `src/allowedKeys.ts`, `src/App.tsx`, `src/bankImport.ts`, `scripts/audit/audit-stage-refs.ts`, `scripts/raw-gate.ts`, `scripts/patch-raw.ts`, and `package.json`.
- `audit/campaign-16-phase-e-typed-baseline-support-implementation-2026-09-08-r1/independent-review-receipt.md` for the already accepted support-only contract.
- Commission `tools/verify-boundaries.ts` and `evidence/verifier-self-test.json` (synthetic tests only), plus `evidence/source-fingerprints.json`, `evidence/inventory-build.json`, `evidence/preflight-self-test.json`, and `evidence/preflight.json`.

## Files/directories the blind checker MUST NOT read until all checker packets are frozen

- The entire commission `producer/` directory, including all 27 producer adjudication packets.
- The entire commission `producer-support/` directory, including drafts, extraction/reasoning notes, authoring scripts and per-packet receipts that share that directory.
- This producing task's conversation, descendant conversations, messages, tool-output transcripts, or any extracted producer summaries, proposed boundaries, exception lists or disposition counts.
- Any other commission artifact not explicitly allowlisted above if it might expose producer judgments. Do not use directory-wide content searches that cross the exclusion boundaries.
- Prior Phase E semantic leak verdicts and parent-calibration adjudications are unnecessary for the blind pass and are excluded from this handoff's pre-freeze reading scope.

The checker must independently reconstruct **all 451 rows / 93 parents** using the earliest legitimate learner-visible boundary and R4's baseline/stage/exception domain, with bilingual relation and confidence recorded per row. Freeze and hash all 27 checker packets before producer outputs are revealed. This producer handoff provides no final accepted mappings, no bank changes, no schemaVersion changes, no patch files, no census/ledger/history updates, and no independent acceptance claim. Any comparison, acceptance or mutation belongs to a subsequent authorized stage after the blind checker freeze.
'''
    with (ROOT/'external-checker-handoff.md').open('x') as f:f.write(text)

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--freeze',action='store_true')
    args=parser.parse_args()
    result=reconcile(args.freeze)
    if args.freeze:
        opening=read(ROOT/'opening-state.json')
        artifact=dict(result,frozenAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),commissionRoot=str(ROOT.relative_to(REPO)),workOrderSha256=opening['workOrderSha256'],openingHead=opening['head'],openingStateSha256=digest(ROOT/'opening-state.json'),commissionManifestSha256=digest(ROOT/'commission-manifest.json'),inventorySha256=opening['inventorySha256'],producer='Codex / GPT-6 Astra',externalChecker='Claude Code / Claude Opus 5',independentAcceptance=False,stage='PRODUCER_FREEZE_ONLY',verifierSha256=digest(ROOT/'tools/verify-boundaries.ts'),verifierSelfTestSha256=digest(ROOT/'evidence/verifier-self-test.json'))
        path=ROOT/'producer-freeze.json'
        with path.open('x') as f:f.write(json.dumps(artifact,indent=2)+'\n')
        with (ROOT/'producer-freeze.sha256').open('x') as f:f.write(digest(path)+'  producer-freeze.json\n')
        handoff(opening,digest(path))
        print(json.dumps(dict(freezeSha256=digest(path),rows=result['rows'],parents=result['parents'],packets=result['packets'])))
    else:
        print(json.dumps({k:v for k,v in result.items() if k!='packetReceipts'},indent=2))
