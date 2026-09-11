"""Finalize only after an external smoke receipt binds the unchanged built tree."""
from pathlib import Path
import json,hashlib,datetime,collections,os,configparser
r=Path(__file__).resolve().parents[1];repo=r.parents[1]
j=lambda p:json.loads(p.read_text());h=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def out(name,data):
 with (r/name).open('x') as f:f.write(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
# Owner's 2026-09-11 continuation forbids every Git operation, including read-only commands.
# Read repository metadata and compare the existing on-disk fingerprints directly.
gitdir=repo/'.git'
assert gitdir.is_dir(), 'This commission opened in the main checkout, not a redirected worktree'
def read_ref(ref):
 p=gitdir/ref
 if p.is_file(): return p.read_text().strip()
 packed=gitdir/'packed-refs'
 if packed.exists():
  for line in packed.read_text().splitlines():
   if line and not line.startswith(('#','^')):
    oid,name=line.split(' ',1)
    if name==ref:return oid
 raise AssertionError('Unresolved repository reference: '+ref)
def metadata_fingerprints():
 return {str(p.relative_to(gitdir)):h(p) for p in gitdir.rglob('*') if p.is_file() and 'objects' not in p.relative_to(gitdir).parts}
metadata_before=metadata_fingerprints()
assert (gitdir/'HEAD').read_text().strip()=='ref: refs/heads/main'
head=read_ref('refs/heads/main');upstream_head=read_ref('refs/remotes/origin/main')
config=configparser.ConfigParser(interpolation=None,strict=False);config.read(gitdir/'config')
assert config['branch "main"']['remote']=='origin'
assert config['branch "main"']['merge']=='refs/heads/main'
assert head==upstream_head
# Exact ignore rules from the pinned .gitignore. Tracked paths are checked separately,
# even where an ignore rule also matches them. This scans only for new untracked scope.
def ignored(path):
 parts=Path(path).parts
 if parts[0] in ('.git','node_modules','dist','scratch'):return True
 if len(parts)>1 and parts[0]=='banks' and parts[1] in ('_promoted','banks-raw','case_sources'):return True
 if '__pycache__' in parts or Path(path).name=='.DS_Store' or path.endswith(('.log','.tsbuildinfo','.pyc')):return True
 if parts[0]=='audit' and 'sealed' in parts:return True
 if path=='audit/stage-reference-semantic-census-2026-07-23/checker/hidden-calibration-key.jsonl':return True
 if len(parts)>1 and parts[0]=='audit' and parts[1] in ('experimental-antigravity-opus-phase-e-residual192-shadow-2026-09-02-r1','experimental-campaign16-phase-e-a1-mechanical-prototype-2026-09-03-r1','experimental-campaign16-phase-e-r2-mechanical-redteam-2026-09-03-r1','experimental-gemini-phase-e-residual192-shadow-2026-09-02-r1'):return True
 if path=='audio/manifest.queue.json' or (parts[0]=='audio' and len(parts)==2 and path.endswith('.opus')):return True
 return False
def discover_untracked(tracked):
 found=[]
 for directory,dirs,files in os.walk(repo):
  dirs[:]=[d for d in dirs if not ignored(str((Path(directory)/d).relative_to(repo)))]
  for name in files:
   path=str((Path(directory)/name).relative_to(repo))
   if path not in tracked and not ignored(path):found.append(path)
 return sorted(found)
opening=j(r/'opening-state.json');comparison=j(r/'comparison.json');preservation=j(r/'bank-preservation.json');post=j(r/'post-repair-verification.json');build=j(r/'production-file-smoke-build-identity.json')
assert preservation['status']=='PASS' and post['ok'] and post['accounting']=={'total':451,'repairedBaseline':369,'repairedStage':16,'exceptions':66,'reconciled':451}
smoke=j(r/'production-file-smoke-receipt.json');assert smoke['status']=='PASS';assert smoke['aggregateBuildIdentitySha256']==build['aggregateBuildIdentitySha256'];assert smoke['protocol']=='file://';assert smoke['artifactIdentityConfirmedByWitness'];assert len(smoke['observations'])>=4;assert all(x['status']=='PASS' for x in smoke['observations'])
# Recheck build and every bound runtime/data input after the witness. No rebuild.
files={str(p.relative_to(repo/'dist')):h(p) for p in sorted((repo/'dist').rglob('*')) if p.is_file()};assert files==build['distFilesSha256']
assert hashlib.sha256(json.dumps(files,sort_keys=True,separators=(',',':')).encode()).hexdigest()==build['aggregateBuildIdentitySha256']
for p,digest in build['sourceAndBankSha256'].items():assert h(repo/p)==digest,p
out('evidence/production-file-post-witness-recheck.json',{'status':'PASS','recheckedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'aggregateBuildIdentitySha256':build['aggregateBuildIdentitySha256'],'allDistFileHashesUnchanged':True,'allBoundSourceAndBankHashesUnchanged':True,'smokeReceiptSha256':h(r/'production-file-smoke-receipt.json')})
assert head==opening['head']
resume=j(r/'evidence/post-freeze-resume-preservation.json')
for p,digest in {**resume['existingCommissionFiles'],**resume['unrelatedUntrackedFiles'],**resume['pins']}.items():assert h(repo/p)==digest,p
assert h(gitdir/'index')==resume['indexSha256']
for f in ['comparison-freeze.json','stage3-plan-freeze.json']:
 for p,digest in j(r/f)['artifacts'].items():assert h(r/p)==digest,p
for b in preservation['banks']:assert h(repo/b['bankPath'])==b['finalSha256'],b['bankPath']
for p,v in j(r/'census-reconciliation.json')['artifacts'].items():assert h(repo/p)==v['finalSha256'],p
allowed=set(comparison['byBank'])|{'BANK-REVIEW-LEDGER.md','BANK-CENSUS.md','census.json'}
tracked=j(r/'evidence/opening-tracked-files.json'); changed=[p for p,digest in tracked.items() if h(repo/p)!=digest];assert set(changed)==allowed,changed
untracked=discover_untracked(tracked);external=[p for p in untracked if not p.startswith(str(r.relative_to(repo))+'/')];assert set(external)==set(resume['unrelatedUntrackedFiles'])
# Prior git diff --check passed before the stricter continuation; no Git is run now.
assert h(repo/'.gitignore')==tracked['.gitignore']
for path in allowed:
 for line in (repo/path).read_text().splitlines():
  assert not line.startswith(('<<<<<<< ','>>>>>>> ')), 'Unexpected conflict marker: '+path
for name in ['schema-floor-receipts.json','patch-application-receipts.json']:assert j(r/name)['status']=='PASS'
commands=[x for p in sorted((r/'evidence').glob('verification-*.json')) for x in j(p)]
missing={name for name in ['typed-baseline','typed-baseline-scanner','typed-baseline-survey','typed-baseline-ui']}
for x in commands:
 n=x['name'];code=x['exitCode'];assert h(r/x['log'])==x['logSha256']
 if n in missing:
  assert code==1 and 'Missing script: "test:'+n+'"' in (r/x['log']).read_text();assert next(y for y in commands if y['name']==n+'-direct')['exitCode']==0
 elif n in ['stage-refs-strict','census-check-before']:assert code==1
 else:assert code==0,(n,code)
assert post['remainingLeaks']==66 and post['strictOnlyMissingRequiredAnchor']==75 and post['unresolvedFindings']==0
assert j(r/'census-reconciliation.json')['finalCheckExitCode']==0
# Finish ledger's external smoke status only after the bound receipt passed.
ledger=repo/'BANK-REVIEW-LEDGER.md';text=ledger.read_text();pending='The final production build identity is frozen; the external `file://` witness observation and bound smoke receipt are pending.';assert pending in text
prefix=text.split('\n\n## Campaign 16 Phase E R4 — checked boundary repair',1)[0];assert hashlib.sha256(prefix.encode()).hexdigest()==tracked['BANK-REVIEW-LEDGER.md'], 'Pre-existing ledger content drift'
text=text.replace(pending,'The external production `file://` smoke passed for the frozen final build, including baseline global context with zero Updates and the exact accepted stage prefix; the full tree and source/bank hashes were rechecked after the witness. See the commission build-identity and smoke receipts.');ledger.write_text(text)
assert metadata_fingerprints()==metadata_before, 'Repository metadata drift during finalization'
out('worktree-preservation.json',{'status':'PASS','access':'LIVE_LOCAL_DISK','branch':'main','head':opening['head'],'upstream':opening['upstream'],'aheadBehind':'0/0 (direct identical main/origin-main refs)','indexSha256Unchanged':True,'gitMutationsPerformed':False,'changedTrackedPaths':sorted(changed),'allOtherOpeningTrackedFilesUnchanged':len(tracked)-len(changed),'allPreexistingCommissionEvidenceUnchanged':True,'allUnrelatedUntrackedFilesUnchanged':True,'semanticFreezeFilesUnchanged':True,'PROJECT_HISTORY_Unchanged':h(repo/'PROJECT-HISTORY.md')==tracked['PROJECT-HISTORY.md'],'DECISIONS_Unchanged':h(repo/'DECISIONS.md')==tracked['DECISIONS.md'],'gitDiffCheckPriorTurnExitCode':0,'gitDiffCheckRerun':False,'gitOperationsThisFinalization':0,'repositoryMetadataReadDirectly':True,'metadataFilesSha256Unchanged':metadata_before,'finalTrackedSha256':{p:h(repo/p) for p in sorted(allowed)},'untrackedExternalPreserved':resume['unrelatedUntrackedFiles']})
terminal='CAMPAIGN16_BOUNDARY_REPAIR_READY_FOR_INDEPENDENT_CONFORMANCE_CHECK';mechanism='MECHANISM_REMOVED_REPAIRED_SUBSET_ONLY'
lines=['# R4 executor verification','',terminal,'',f'**{mechanism}: 385 repaired; 66 exceptions remain.**','','## Deterministic gates','', '| Command | Recorded result | Exit |','|---|---|---:|']
for x in commands:
 n=x['name'];status='PASS'
 if n in missing:status='MISSING_NPM_ALIAS — corresponding existing test file passed directly'
 elif n=='stage-refs-strict':status='EXPECTED_FAIL — exactly 66 exception leaks; separate 75 unchanged strict-only legacy findings'
 elif n=='census-check-before':status='EXPECTED_STALE — before required census regeneration'
 lines.append('| `'+ ' '.join(x['command'])+'` | '+status+' | '+str(x['exitCode'])+' |')
lines+=['','Full stdout/stderr and command hashes are preserved in `evidence/verification-*.json` and their referenced logs. No absent npm alias is reported as a passing npm command; no package script was added. All four executable regression implementations passed.', '', '## Structural and preservation proof','',f'- Literal E.1 truth-table self-test: {j(r/"comparison-freeze.json")["selfTestCases"]} combinations passed.',f'- R4 shared-resolver structural verifier: {j(r/"evidence/post-freeze-verifier-self-test.json")["count"]} synthetic self-tests passed; final 451-row reconciliation passed.',f'- Exact metadata tool: {j(r/"evidence/schema-floor-self-test.json")["count"]} synthetic tests passed before canonical mutation; four one-field atomic receipts passed.','- Four canonical P15 patch scripts; 385 exact undefined-to-boundary operations. Opening → schema bump → predicted P15 final SHA chain passed for every bank.','- H.1 full parsed restoration proof passed for all 13 banks. All 66 exceptions unchanged, all legacy anchors unchanged, all counts/ids/stages unchanged, and no other primary anchor changed.','- Exactly 66 remaining revealsAllStages identities equal the frozen exception set. No repaired row remains in that set; no new leak lies outside the frozen population. The 75 out-of-scope missingRequiredAnchor identities match opening exactly.','- All pre-existing commission artifacts, both semantic freezes, frozen inventory, non-authorized tracked files, unrelated untracked files, branch, HEAD, and index preserved. The prior `git diff --check` passed; this finalization used direct disk fingerprints and repository metadata reads, with no Git command or operation.','','## Census','', 'Initial check failed as expected. Regenerated JSON and Markdown were compared in full against opening plus the approved schema-version transitions and generator provenance only; no count/content movement occurred. The subsequent check passed. The four bumped banks contain 1,809 session units; this is schema composition, not 1,809 repaired rows.', '', '**Producer-independent checker confirmation of census movement remains required before acceptance under H.3.5. This executor receipt reconciles the deterministic movement and does not claim that future confirmation or architect conformance.**','','## Production file smoke','',f'External witness: **{smoke["witness"]}**. Actual production `file://` build digest: `{build["aggregateBuildIdentitySha256"]}`. App and bundled load, library/practice navigation, global context with zero baseline Updates, and exact stage prefix passed. Full tree and bound source/bank hashes rechecked after the observation. Browser automation was blocked by URL security policy; no workaround was used. See the smoke receipt for the witness report.', '', '## Known pre-existing failure','', '`npm run test:single-row-lab-panels` retains **PREEXISTING_BASELINE_FAILURE_ADMITTED** at the saved-manifest equality assertion documented by `../campaign-16-phase-e-typed-baseline-support-implementation-2026-09-08-r1/verification.md`. R4 did not run, repair, regenerate, or relabel that known failed saved-manifest check. Its prior failure is not presented as a final-bank test pass.', '', '## Review boundary','', 'The producer was Codex / GPT-6 Astra. Prior Astra descendants provided producer evidence for packets 001–024 and implemented the structural verifier; the primary producing seat completed packets 025–027, integration, and freeze. These are producing-team implementation/evidence contributions. Claude Code / Claude Opus 5 is the external full blind semantic checker. Post-freeze comparison/application/verification in this resumed turn used no new delegation and no semantic adjudication.', '', 'Independent architect conformance and producer-independent census confirmation are pending acceptance gates. No commit, push, merge, publish, or history edit occurred.']
(r/'verification.md').write_text('\n'.join(lines)+'\n')
close=['# R4 executor closeout','',terminal,'',mechanism,'','**451 = 369 repairedBaseline + 16 repairedStage + 66 exceptions**','', 'The repaired subset contains 385 rows. The 66 final exceptions remain unchanged and fail-open. No third semantic adjudication or override occurred.','', '## Pinned commission identity','',f'- Access: live local disk; branch `main`; HEAD `{opening["head"]}`; upstream `origin/main`, ahead/behind `0/0`.',f'- Producer freeze SHA-256: `{resume["pins"][str((r/"producer-freeze.json").relative_to(repo))]}`.',f'- Checker freeze SHA-256: `{resume["pins"][str((r/"checker-freeze.json").relative_to(repo))]}`.',f'- Frozen inventory SHA-256: `{opening["inventorySha256"]}`.',f'- Work-order SHA-256: `{opening["workOrderSha256"]}`.','- All 27 producer and 27 blind checker packets remain byte-identical to their frozen hashes. The full 451-row / 93-parent identity population is preserved.','', '## Exact bank accounting','', '| Bank | Repaired baseline | Repaired stage | Exceptions | Schema before → after | P15 operations |','|---|---:|---:|---:|---|---:|']
for b in preservation['banks']:
 if b['bankPath'] in comparison['byBank']:close.append(f'| `{b["bankPath"]}` | {b["acceptedBaseline"]} | {b["acceptedStage"]} | {b["exceptions"]} | {b["schemaVersionBefore"]} → {b["schemaVersionAfter"]} | {b["acceptedBaseline"]+b["acceptedStage"]} |')
close+=['', 'All four banks receive accepted baseline objects; their conditional exact schema bumps preceded baseline patching. Only accepted answerableAfterStageId fields and those four schemaVersion values changed in bank data. Every other parsed field is positively proven unchanged.','', '| Bank | Opening SHA-256 | Final SHA-256 |','|---|---|---|']
for b in preservation['banks']:
 if b['bankPath'] in comparison['byBank']:close.append(f'| `{b["bankPath"]}` | `{b["openingSha256"]}` | `{b["finalSha256"]}` |')
close+=['','## Exceptions','', 'All three checker MEDIUM rows and the explicit checker EXCEPTION are among the 66 final exceptions. Disjoint reason combinations:','']+[f'- `{reason}`: {count}.' for reason,count in comparison['exceptionReasonCombinationsDisjoint'].items()]
close+=['','## Verification and production identity','', 'Full details and raw-command exceptions: [verification.md](verification.md). Structural closure, positive preservation, 69 verifier self-tests, 12 schema-tool self-tests, the required executable regressions, TypeScript, build, and census reconciliation passed. Four absent npm aliases were recorded as failures and their existing test implementations passed directly. Strict audit is an expected exception-set failure. The admitted single-row-lab-panels saved-manifest failure remains pre-existing and unmodified.', '',f'- Production aggregate SHA-256: `{build["aggregateBuildIdentitySha256"]}`.',f'- Production index SHA-256: `{build["indexSha256"]}`.',f'- External smoke witness: `{smoke["witness"]}`; receipt: [production-file-smoke-receipt.json](production-file-smoke-receipt.json). Full built tree and source/bank hashes unchanged after observation.', '', 'The ledger is updated. PROJECT-HISTORY.md and DECISIONS.md are unchanged. Only the four affected canonical banks, BANK-REVIEW-LEDGER.md, census.json, and BANK-CENSUS.md changed among tracked files. All unrelated worktree state, original evidence, branch, HEAD, and index remain preserved; no Git mutation occurred.', '', '## Required review handoff','', '**This is the executor terminal, not acceptance.** Architect conformance review is next. The external Claude/Opus blind semantic freeze remains governing evidence. Before acceptance, the producer-independent checker must additionally confirm the exact census movement under H.3.5; the executor has fully reconciled it but has not impersonated that checker. No architect conformance review, commit, push, merge, or publication was performed.', '', '## Receipt index','']
required=['opening-state.json','commission-manifest.json','tools/verify-boundaries.ts','producer-freeze.json','checker-freeze.json','comparison.json','comparison.md','comparison-freeze.json','accepted-boundaries.jsonl','exceptions.jsonl','schema-floor-plan.json','schema-floor-receipts.json','patch-plan.json','patch-application-receipts.json','post-repair-verification.json','bank-preservation.json','census-reconciliation.json','production-file-smoke-build-identity.json','production-file-smoke-receipt.json','worktree-preservation.json','verification.md']
for name in required:assert (r/name).is_file();close.append(f'- [{name}]({name})')
close+=['','The complete artifact SHA-256 inventory is [executor-receipt.json](executor-receipt.json). Producer/checker packet and source evidence remains in its original directories.']
(r/'closeout.md').write_text('\n'.join(close)+'\n')
artifacts={str(p.relative_to(r)):h(p) for p in sorted(r.rglob('*')) if p.is_file() and p.name!='executor-receipt.json' and '__pycache__' not in p.parts}
out('executor-receipt.json',{'terminal':terminal,'mechanismTerminal':mechanism,'recordedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'branch':'main','head':opening['head'],'accounting':post['accounting'],'comparisonFreezeSha256':h(r/'comparison-freeze.json'),'schemaFloorPlanSha256':h(r/'schema-floor-plan.json'),'buildIdentitySha256':build['aggregateBuildIdentitySha256'],'pins':resume['pins'],'artifactsSha256':artifacts,'finalTrackedFilesSha256':{p:h(repo/p) for p in sorted(allowed)},'independentArchitectConformance':'NOT_PERFORMED_PENDING','independentCensusConfirmation':'PENDING_BEFORE_ACCEPTANCE','publicationGitMutations':'NONE','gitOperationsThisFinalization':0})
print(json.dumps({'terminal':terminal,'mechanismTerminal':mechanism,'accounting':post['accounting'],'artifactCount':len(artifacts),'receiptSha256':h(r/'executor-receipt.json')},indent=2))
