from pathlib import Path
import json,hashlib,subprocess,datetime
out=Path(__file__).resolve().parent
root=Path.cwd()
def read(name):return json.loads((out/name).read_text())
def write(name,obj):(out/name).write_text(json.dumps(obj,indent=2,ensure_ascii=False)+'\n')
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest() if Path(p).is_file() else None
def git(*args):return subprocess.check_output(['git',*args]).decode()
now=datetime.datetime.now(datetime.timezone.utc).isoformat()
opening=read('opening-state.json');identity=read('production-file-smoke-build-identity.json');m=read('implementation-manifest.json');checks=read('post-witness-identity-recheck.json')
assert checks['passed']
currentTree={str(p.relative_to('dist')):sha(p) for p in sorted(Path('dist').rglob('*')) if p.is_file()}
currentDigest=hashlib.sha256(json.dumps(currentTree,sort_keys=True,separators=(',',':')).encode()).hexdigest()
assert currentDigest==identity['aggregateBuildIdentitySha256']=='0b2e2bce6a5cd964d23749a74512e429da8418cfc124272dfa9fb9ee62d5b925'
assert currentTree==identity['distFilesSha256']
assert all(sha(p)==h for p,h in identity['finalAuthorizedSourcesSha256'].items())
protected=[p for p,h in opening['hashes'].items() if p not in identity['finalAuthorizedSourcesSha256'] and sha(p)!=h]
assert not protected
banks={str(p):sha(p) for p in sorted(Path('banks').rglob('*')) if p.is_file()}
assert banks==opening['banks']
branch=git('branch','--show-current').strip();head=git('rev-parse','HEAD').strip();upstream=git('rev-parse','--abbrev-ref','@{upstream}').strip()
assert (branch,head,upstream)==(opening['branch'],opening['head'],opening['upstream'])
currentUntracked=set(filter(None,git('ls-files','--others','--exclude-standard','-z').split('\0')))
new=currentUntracked-set(opening['untracked'])
relativeOut=str(out.relative_to(root))
unauthorized=sorted(p for p in new if p not in identity['finalAuthorizedSourcesSha256'] and not p.startswith(relativeOut+'/') and not p.startswith('dist/'))
assert not unauthorized
before=read('opening-stage-reference-audit.json');after=read('final-stage-reference-audit.json')
assert before==after and len(after['findings'])==451
survey=read('final-survey-baseline-recheck.json')
assert survey['generatedSha256']=='6e4a5cc93a4f943f75d91fc1707bad44abf5ebd376e843ee5dc21d9072f398dc'
assert sha('audit/single-row-lab-panels-survey-2026-07-18/survey-manifest.json')==survey['savedSha256']=='f042bd39094e543ab30d6a6dd87081b1ebdead6d7182fa07711ebb53d0552942'
write('production-file-smoke-receipt.json',{
 'status':'PASS','witness':'Luke','witnessRole':'External manual production-file smoke witness; not the P2 implementation-conformance checker',
 'observedAt':'2026-09-09T21:00:00-04:00','observedTimeApproximate':True,'witnessTimeVerbatim':'2026-09-09, ~9:00 PM ET','recordedAt':now,
 'absolutePath':identity['indexPath'],'witnessArtifactPathVerbatim':'./Project Shrimp/dist/index.html','protocol':'file://',
 'resolvedFileUrl':'file:///Users/holemini/Desktop/Project%20Shrimp/dist/index.html','urlProvenance':'Resolved from the agreed absolute local path and witness-confirmed file protocol; witness did not paste the full address string.',
 'browser':{'name':'Chrome','version':'152'},'aggregateBuildIdentitySha256':currentDigest,'indexSha256':identity['indexSha256'],
 'observations':[
  {'criterion':'actual production file opened locally','status':'PASS','observation':'Luke confirmed the current frozen dist/index.html was opened directly under file:// without rebuilding or changing it.'},
  {'criterion':'application shell renders','status':'PASS','observation':'The app rendered normally.'},
  {'criterion':'bundled data loads','status':'PASS','observation':'Bundled question content loaded.'},
  {'criterion':'ordinary interaction works','status':'PASS','observation':'Luke navigated into the ordinary question flow and normal use worked.'},
  {'criterion':'no blocking path/module/asset failure','status':'PASS','observation':'No path, module, asset, or question-loading failure prevented normal use.'}],
 'artifactIdentityConfirmedByWitness':True,'artifactIdentityStatement':'Luke explicitly identified this aggregate build digest and confirmed opening the current frozen production file without rebuilding or changing it. Producer post-witness full-tree/source recheck matches that identity.',
 'postWitnessIdentityReceipt':'post-witness-identity-recheck.json','evidenceSource':'Luke’s explicit external smoke report in this task on 2026-09-09; self-reported manual observation, not producer browser observation.'})
write('bank-preservation.json',{'timestamp':now,'reference':'Original opening-worktree bytes, not HEAD','fileCount':len(banks),'openingHashes':opening['banks'],'closingHashes':banks,'changedPaths':[],'passed':True})
preservation={'timestamp':now,'reference':'Original opening-state.json; no rebaselining','openingManifestSha256':sha(out/'opening-state.json'),'preExistingPathsChecked':len(opening['hashes']),
 'protectedAndUnrelatedPathsChecked':len(opening['hashes'])-sum(p in opening['hashes'] for p in identity['finalAuthorizedSourcesSha256']),
 'unrelatedChangedPaths':protected,'unauthorizedNewUntrackedPaths':unauthorized,'authorizedChangedPaths':[p for p in identity['finalAuthorizedSourcesSha256'] if p in opening['hashes']],
 'newAuthorizedSourceTestPaths':[p for p in identity['finalAuthorizedSourcesSha256'] if p not in opening['hashes']],
 'newCommissionPaths':sorted(p for p in new if p.startswith(relativeOut+'/')),'buildOutputSurface':'dist/** generated by the required normal build, authorized by continuation 1',
 'banksUnchanged':True,'historicalSurveyUnchanged':True,'auditFindingsAndDetailsIdentical':True,'openingFindingCount':451,'closingFindingCount':451,
 'branch':branch,'head':head,'upstream':upstream,'branchHeadUpstreamUnchanged':True,'passed':True}
write('preservation.json',preservation)
write('stage-reference-final-comparison.json',{'timestamp':now,'openingFile':'opening-stage-reference-audit.json','finalFile':'final-stage-reference-audit.json','openingFileSha256':sha(out/'opening-stage-reference-audit.json'),'finalFileSha256':sha(out/'final-stage-reference-audit.json'),'openingCount':451,'finalCount':451,'exactFindingObjectsEqual':before['findings']==after['findings'],'aggregateResultAndDetailsEqual':before['result']==after['result'],'status':'PASS'})
(out/'final-worktree-status.txt').write_text(git('status','--porcelain=v1','--branch','--untracked-files=all'))
trackedChanges=preservation['authorizedChangedPaths']
(out/'implementation-tracked-diff.patch').write_text(git('diff','--',*trackedChanges))
r=read('test-results.json')
r.extend([
 {'phase':'post-witness-final','command':'SHA-256 complete production tree and final authorized source/test/document recheck against frozen build identity','exitCode':0,'status':'PASS','result':'All 12 production files and all final recorded implementation inputs match Luke’s witnessed build.','receipt':'post-witness-identity-recheck.json'},
 {'phase':'post-witness-final','command':'External witness opens exact production dist/index.html using file://','exitCode':None,'status':'PASS','result':'Luke, Chrome 152, approximately 2026-09-09 21:00 ET. All five required observations passed; explicit build identity attested and producer-rechecked.','receipt':'production-file-smoke-receipt.json'},
 {'phase':'post-witness-final','command':'Compare final aggregate stage-reference findings and full result/detail to original opening capture','exitCode':0,'status':'PASS','result':'Exact equality; 451 findings.','receipt':'stage-reference-final-comparison.json'},
 {'phase':'post-witness-final','command':'Original opening-byte bank/protected-path preservation, unauthorized untracked inventory, branch/HEAD/upstream verification','exitCode':0,'status':'PASS','result':'All 16 bank files and protected/unrelated opening paths preserved; no unauthorized new paths; main/HEAD/upstream unchanged.','receipt':'preservation.json'}])
write('test-results.json',r)
required=['npm run test:schema-bank','TMPDIR=/tmp/ npm run test:audit-stage-refs','npm run test:raw-gate','npm run test:exam-layout','npm run test:review-prompt','npm run test:single-row-lab-panels','npm run test:promote','npm run test:consolidate','npx tsx scripts/tests/registry-mechanics.ts','npm run test:shuffle','npm run test:raw-bank-normalization','npm run test:presentation-normalization','npm run test:storage-category-migration','npm run test:audit-validate-bank','npm run test:validate-sweep','npm run test:rationale-visual-schema-floor',
 'TYPED_BASELINE_RECEIPTS='+relativeOut+' npx tsx scripts/tests/typed-baseline.ts','npx tsx scripts/tests/typed-baseline-ui.ts','npx tsx scripts/tests/typed-baseline-scanner.ts','npx tsx scripts/tests/typed-baseline-survey.ts',
 'npm run validate-bank -- banks/*.json','npm run audit','npm run census:check','npx tsc -b --pretty false','npm run build','git diff --check',
 'External witness opens exact production dist/index.html using file://','Compare final aggregate stage-reference findings and full result/detail to original opening capture','Original opening-byte bank/protected-path preservation, unauthorized untracked inventory, branch/HEAD/upstream verification',
 'SHA-256 complete production tree and final authorized source/test/document recheck against frozen build identity','npx tsx '+relativeOut+'/check-final-survey.ts']
matrix=[]
for cmd in required:
 matches=[row for row in r if row['command']==cmd];assert matches,cmd
 row=dict(matches[-1]);row['status']=row.get('status','PASS' if row['exitCode']==0 else 'FAIL');matrix.append(row)
 assert row['status']=='PASS' or (cmd=='npm run test:single-row-lab-panels' and row['status']=='PREEXISTING_BASELINE_FAILURE_ADMITTED' and row['exitCode']==1),row
summary={state:sum(row['status']==state for row in matrix) for state in ['PASS','PREEXISTING_BASELINE_FAILURE_ADMITTED','FAIL','NOT_RUN']}
assert summary['PREEXISTING_BASELINE_FAILURE_ADMITTED']==1 and summary['FAIL']==summary['NOT_RUN']==0
write('final-verification-matrix.json',{'timestamp':now,'summary':summary,'results':matrix,'exceptionAuthority':'verification-continuation-order-2.md','historicalRunsRetainedIn':'test-results.json'})
m['status']='READY_FOR_INDEPENDENT_CHECK';m['finalizedAt']=now;m['independentCheckReady']=True;m['finalBuildIdentity']=currentDigest;m['finalSourcesSha256']=identity['finalAuthorizedSourcesSha256'];m['changedFiles']=[{'path':p,'openingSha256':opening['hashes'][p],'currentSha256':h} for p,h in identity['finalAuthorizedSourcesSha256'].items() if p in opening['hashes']];m['newSourceTests']=[{'path':p,'sha256':h} for p,h in identity['finalAuthorizedSourcesSha256'].items() if p not in opening['hashes']];m['continuation2']['smokeStatus']='PASS';m['verificationSummary']=summary;m['admittedException']={'command':'npm run test:single-row-lab-panels','status':'PREEXISTING_BASELINE_FAILURE_ADMITTED','exitCode':1,'authority':'verification-continuation-order-2.md','proof':'opening-survey-drift-proof.json','finalRecheck':'final-survey-baseline-recheck.json'};m['independentReview']={'status':'PENDING','required':'Genuinely independent disk-reading seat under R2 §U/P2; producer and descendants cannot supply it.'};m['ownerAcceptance']=False;write('implementation-manifest.json',m)
lines=['# Verification — ready for independent conformance check','',
 'Producer verification is complete under frozen R2 and the two continuation dispositions. There is exactly one admitted non-green mandatory command. This packet does not claim independent review, owner acceptance, merge approval, deployment, or a repaired 451-row population.','',
 '## Final verification matrix','',
 '| Command or check | Status | Exit |','|---|---|---|']
for row in matrix:lines.append('| `'+row['command']+'` | '+row['status']+' | '+('N/A — manual witness' if row['exitCode'] is None else str(row['exitCode']))+' |')
lines.extend(['','Full commands, logs and historical attempts are retained in `test-results.json`; the final resolved matrix is `final-verification-matrix.json`. Historical NOT_RUN/blocked entries and the corrected initial importer-fixture error remain historical records rather than current dispositions.','',
 '## Explicit survey-baseline exception','',
 '`npm run test:single-row-lab-panels` remains red: exit 1 at its existing saved-manifest equality assertion. It is PREEXISTING_BASELINE_FAILURE_ADMITTED under continuation order 2, never PASS. Read-only reconstruction with hash-verified opening generator/schema/allowed-key sources and unchanged bank inputs produced the same survey bytes as the final implementation. The generated SHA-256 remains `6e4a5cc93a4f943f75d91fc1707bad44abf5ebd376e843ee5dc21d9072f398dc`; the protected saved manifest remains `f042bd39094e543ab30d6a6dd87081b1ebdead6d7182fa07711ebb53d0552942`. The 40 differing survey fields predate this commission. No corpus-versus-saved-artifact semantic disposition was made.','',
 'Neither the saved artifact nor banks were modified to force green. The original test file is restored to its opening bytes; only the new synthetic proof moved to `scripts/tests/typed-baseline-survey.ts`. That independent fixture passes through actual embedded survey evidence collection and serialization and preserves the exact typed object. The checker must independently assess the opening/current equivalence proof, not rely on this producer narrative.','',
 '## Bound external production-file smoke','',
 'Luke reported PASS in Chrome 152 at approximately 2026-09-09 21:00 ET. He opened the current production file directly with file://, confirmed normal rendering and bundled questions, navigated the ordinary question flow, and saw no blocking path/module/asset/question-loading failure. He explicitly confirmed no rebuild or alteration and identified build `'+currentDigest+'`.','',
 'The post-witness SHA-256 recheck matches every file in the complete 12-file production tree and every recorded final source/test/schema-document input. `dist/index.html` remains `'+identity['indexSha256']+'`. The manual witness supplies production compatibility evidence only; it does not satisfy P2. No prohibited browser route was retried and no SSR/HTTP/synthetic result substituted for this observation.','',
 '## Preservation and final audit','',
 'All 16 bank files and all protected/unrelated opening paths are byte-identical to original opening-state.json. This includes the dirty canonical banks, census artifacts, ledger, governance, GeminiPrompt.md, parked repair order, July survey artifact and frozen Campaign 16 evidence. No unauthorized new untracked path exists outside commission/source/test/build surfaces. Final stage-reference finding objects and full aggregate result/details exactly equal opening: 451 findings. Branch main, HEAD '+head+' and upstream origin/main are unchanged.','',
 'SCHEMA_VERSION and the ordinary authoring default remain 2.0; 2.1 is supported only as the typed-baseline feature floor. No live bank floor, storage migration, frozen-row assignment or clinical content change was made. No census regeneration, commit, push, merge, stash, reset, clean, branch/worktree switch or deployment was performed. The optional P15 fixture was not exercised.','',
 '## Independent handoff','',
 'The implementation is local and uncommitted. A disk-reading checker must inspect frozen R2, both continuation orders, current source diff/new files, original opening preservation, admitted-exception proof and final build/smoke binding. Producer: Codex primary seat, no delegated contributions. Independent review and owner disposition remain pending.'])
(out/'verification.md').write_text('\n'.join(lines)+'\n')
(out/'closeout.md').write_text('''# Campaign 16 typed-baseline support — READY FOR INDEPENDENT CHECK

Producer implementation and verification are complete under frozen R2 plus the two owner/architect continuation dispositions. This is readiness for external conformance review only.

All required verification is PASS except the single exact `npm run test:single-row-lab-panels` saved-manifest failure, recorded as PREEXISTING_BASELINE_FAILURE_ADMITTED (exit 1) under continuation order 2. Opening/current survey equivalence and final generated/saved hashes remain exact. The new typed-baseline survey-object proof passes independently. No historical artifact or bank was changed to force the failed gate green.

Luke’s actual production file smoke passed in Chrome 152 at approximately 2026-09-09 21:00 ET. The post-witness complete production-tree and implementation-input hashes match the frozen witnessed build. Final stage-reference population and details exactly equal the opening 451 findings. Original-byte bank and protected/unrelated-path preservation, new-path inventory, branch/HEAD/upstream and final diff checks pass.

See `verification.md`, `final-verification-matrix.json`, `production-file-smoke-build-identity.json`, `production-file-smoke-receipt.json`, `post-witness-identity-recheck.json`, `stage-reference-final-comparison.json`, `bank-preservation.json`, and `preservation.json`.

Earlier stops and their evidence remain in historical receipts and handoffs. The independent checker must assess the survey-baseline exception and conformance itself. The producer and any fresh producer context are not independent checkers. Luke’s file-smoke witness role does not constitute P2 review.

No frozen-row semantic assignments or live bank changes occurred. SCHEMA_VERSION/default authoring remains 2.0. No commit, push, merge, census regeneration, deployment, bank publication or owner closure is claimed or authorized. The work remains uncommitted on main at HEAD '''+head+'''.
''')
print(json.dumps({'status':m['status'],'matrix':summary,'banksPreserved':len(banks),'stageReferenceFindings':451,'buildIdentity':currentDigest},indent=2))
