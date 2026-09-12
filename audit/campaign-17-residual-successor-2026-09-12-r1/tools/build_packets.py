import json, hashlib, pathlib, collections, subprocess
R=pathlib.Path('audit/campaign-17-residual-successor-2026-09-12-r1')
OLD=pathlib.Path('audit/campaign-16-anchor-boundary-repair-2026-09-09-r1')
def read(p): return json.loads(pathlib.Path(p).read_text())
def sha(p): return hashlib.sha256(pathlib.Path(p).read_bytes()).hexdigest()
def object_sha(o): return hashlib.sha256(json.dumps(o,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def write(p,o): p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(o,ensure_ascii=False,indent=2)+'\n')
def identity(e): return (e.get('bankPath',e.get('file')),e.get('parentCaseId',e.get('parentId')),e['partId'])
frozen=[json.loads(s) for s in (OLD/'exceptions.jsonl').read_text().splitlines()]
live=read(R/'phase-a/live-findings.json')
assert len(set(map(identity,frozen)))==len(frozen)==66
assert set(map(identity,frozen))==set(map(identity,live))
checks=[]
for name,key in [('producer-freeze','packetReceipts'),('checker-freeze','packets')]:
 for p in read(OLD/(name+'.json'))[key]:
  assert sha(OLD/p['path'])==p['sha256'],p['path']
  checks.append({'path':str(OLD/p['path']),'sha256':p['sha256']})
for p,h in read(OLD/'comparison-freeze.json')['artifacts'].items(): assert sha(OLD/p)==h
groups=collections.Counter(); parents=collections.defaultdict(list)
for e in frozen:
 p,c=e['producer'],e['checker']
 if 'EXCEPTION' in [p['disposition'],c['disposition']]:g='explicit_semantic_exception'
 elif {p['disposition'],c['disposition']}=={'BASELINE','STAGE'}:g='baseline_stage_disagreement'
 elif p['proposedBoundary']!=c['proposedBoundary']:g='different_stage_ids'
 else:
  assert p['disposition']==c['disposition']=='STAGE' and p['confidence']=='HIGH' and c['confidence']=='MEDIUM'
  g='exact_stage_checker_medium'
 e['documentaryGroup']=g;groups[g]+=1;parents[(e['bankPath'],e['parentCaseId'])].append(e)
assert dict(groups)=={'explicit_semantic_exception':14,'baseline_stage_disagreement':48,'different_stage_ids':2,'exact_stage_checker_medium':2}
banks={str(p):read(p) for p in pathlib.Path('banks').glob('*.json')}
index=[]
order=sorted(parents,key=lambda k:(not any(e['documentaryGroup']=='explicit_semantic_exception' for e in parents[k]),k))
for n,(bank,pid) in enumerate(order,1):
 es=parents[(bank,pid)]; current=next(q for q in banks[bank]['questions'] if q['id']==pid)
 judgments={}; original=None
 for seat in ['producer','checker']:
  rows=[]
  for e in es:
   path=OLD/seat/(e['repairPacketId']+'.json');d=read(path)
   row=next(r for r in d['rows'] if r['rowKey']==e['rowKey'])
   assert identity(row)==identity(e)
   for key in ['disposition','proposedBoundary','confidence','bilingualRelation','exceptionReason']:assert row[key]==e[seat][key]
   rows.append({'sourcePath':str(path),'sourceSha256':sha(path),'judgment':row})
  judgments[seat]=rows
 for e in es:
  sp=OLD/'source-packets'/(e['repairPacketId']+'.json');original=next(q for q in read(sp)['parents'] if q['id']==pid)
  livepart=next(q for q in current['caseStudy']['questions'] if q['id']==e['partId'])
  oldpart=next(q for q in original['caseStudy']['questions'] if q['id']==e['partId'])
  assert livepart==oldpart,e['partId']
 packet={'packetId':f'parent-{n:02d}','bankPath':bank,'bankSha256':sha(bank),'parentCaseId':pid,'currentParentSha256':object_sha(current),'currentParent':current,'frozenExceptions':es,'frozenJudgments':judgments,'residualPartsEqualCampaign16':True,'priorParentSource':str(sp),'priorParentSourceSha256':sha(sp)}
 path=R/'phase-a/parents'/f'parent-{n:02d}.json';write(path,packet)
 index.append({k:packet[k] for k in ['packetId','bankPath','parentCaseId','currentParentSha256']}|{'path':str(path.relative_to(R)),'rows':[e['rowKey'] for e in es],'explicitConcerns':sum(e['documentaryGroup']=='explicit_semantic_exception' for e in es)})
write(R/'phase-a/parent-index.json',index)
write(R/'phase-a/reconciliation.json',{'status':'EXACT_IDENTITY_MATCH','liveRows':len(live),'frozenRows':len(frozen),'parents':len(parents),'documentaryGroups':dict(groups),'missing':[],'added':[],'all66ResidualPartsEqualFrozenSources':True,'verifiedJudgmentPacketHashes':checks,'exceptionFileSha256':sha(OLD/'exceptions.jsonl'),'phaseBPopulationIncluded':False})
snapshot=R/'opening-state.json'
if not snapshot.exists():
 write(snapshot,{'access':'LOCAL_DISK','branch':subprocess.check_output(['git','branch','--show-current'],text=True).strip(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'upstream':'origin/main','openingAheadBehind':[0,0],'cleanBeforeCommissionArtifacts':True,'originalWorktreePreserved':'/Users/holemini/Desktop/Project Shrimp','bankHashes':{p:sha(p) for p in sorted(banks)},'campaign16Hashes':{str(p):sha(p) for p in sorted(OLD.rglob('*')) if p.is_file()},'authorityHashes':{p:sha(p) for p in ['AGENTS.md','PROJECT-HISTORY.md','DECISIONS.md','NCLEX-Question-Schema.md','BANK-CENSUS.md','BANK-REVIEW-LEDGER.md','src/types.ts','src/schema.ts','src/caseVisibilityBoundary.ts','src/examLayout.ts','scripts/audit/audit-stage-refs.ts']}})
print(json.dumps({'rows':len(frozen),'parents':len(parents),'groups':dict(groups),'verifiedFrozenPackets':len(checks)}))
for p in index:print(p['packetId'],p['parentCaseId'],'rows',len(p['rows']),'explicit',p['explicitConcerns'])
