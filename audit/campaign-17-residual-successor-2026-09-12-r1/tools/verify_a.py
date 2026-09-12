"""Read-only packet/preservation verification with rejection controls; no clinical certification."""
import collections, copy, hashlib, json, pathlib
R=pathlib.Path(__file__).resolve().parents[1]
REPO=R.parents[1]
def read(p): return json.loads(p.read_text())
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def objsha(o): return hashlib.sha256(json.dumps(o,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def ident(e): return(e.get('bankPath',e.get('file')),e.get('parentCaseId',e.get('parentId')),e['partId'])
def exact(a,b):
 assert len(a)==len(set(a))==len(b)==len(set(b)) and set(a)==set(b), 'population mismatch/duplicate'
def preservation():
 o=read(R/'opening-state.json')
 for group in ['bankHashes','campaign16Hashes','authorityHashes']:
  for p,h in o[group].items(): assert sha(REPO/p)==h, f'preservation failure: {p}'
 assert set(o['bankHashes'])=={str(p.relative_to(REPO)) for p in (REPO/'banks').glob('*.json')}
 old=REPO/'audit/campaign-16-anchor-boundary-repair-2026-09-09-r1'
 assert set(o['campaign16Hashes'])=={str(p.relative_to(REPO)) for p in old.rglob('*') if p.is_file()}
 return {g:len(o[g]) for g in ['bankHashes','campaign16Hashes','authorityHashes']}
def packetcheck(p):
 assert objsha(p['currentParent'])==p['currentParentSha256'], 'parent hash mismatch'
 bank=read(REPO/p['bankPath'])
 actual=next(q for q in bank['questions'] if q['id']==p['parentCaseId'])
 assert actual==p['currentParent'], 'live parent drift'
 for seat,rows in p['frozenJudgments'].items():
  for r in rows:
   assert sha(REPO/r['sourcePath'])==r['sourceSha256']
   src=read(REPO/r['sourcePath'])
   assert r['judgment']==next(e for e in src['rows'] if e['rowKey']==r['judgment']['rowKey'])
def dispositioncheck(rows,packets,sources):
 expected=[e['rowKey'] for p in packets for e in p['frozenExceptions']]
 exact([x['rowKey'] for x in rows],expected)
 lookup={e['rowKey']:p for p in packets for e in p['frozenExceptions']}
 allowed={'ANCHOR_ONLY_REPAIR_CANDIDATE','CONTENT_REPAIR_REQUIRED','REPLACEMENT_CANDIDATE','REVIEW_HOLD'}
 sourceids={s['id'] for s in sources};assert len(sourceids)==len(sources)
 for x in rows:
  assert x['disposition'] in allowed and x['deterministic'] is False
  for k in ['answerProposition','establishingSurfaces','laterInformationToHide','boundaryDefense','authority']: assert x[k].strip()
  assert set(x['sourceIds'])<=sourceids,'unresolved source'
  p=lookup[x['rowKey']];assert x['sourceParentSha256']==p['currentParentSha256']
  assert (x['bankPath'],x['parentCaseId'])==(p['bankPath'],p['parentCaseId'])
  stages=[s['id'] for s in p['currentParent']['caseStudy']['stages']];b=x['proposedBoundary']
  assert b in stages or b in ('baseline',None)
  if x['disposition']=='ANCHOR_ONLY_REPAIR_CANDIDATE': assert b is not None and not x['requiredContentWork']
  else: assert x['requiredContentWork'].strip()
  visible=[] if b=='baseline' else stages[:stages.index(b)+1] if b else None
  hidden=stages if b=='baseline' else stages[stages.index(b)+1:] if b else None
  assert x['stagesVisibleIfApproved']==visible and x['stagesHiddenIfApproved']==hidden
def main():
 preservationcounts=preservation()
 packets=[read(p) for p in sorted((R/'phase-a/parents').glob('*.json'))]
 assert len(packets)==38
 for p in packets:packetcheck(p)
 frozen=[json.loads(l) for l in (REPO/'audit/campaign-16-anchor-boundary-repair-2026-09-09-r1/exceptions.jsonl').read_text().splitlines()]
 live=read(R/'phase-a/live-findings.json');exact(list(map(ident,live)),list(map(ident,frozen)))
 assert len(live)==66 and all(x['kind']=='revealsAllStages' for x in live)
 rows=read(R/'phase-a/dispositions.json');sources=read(R/'phase-a/sources.json')
 dispositioncheck(rows,packets,sources)
 controls=[]
 def rejects(name,fn):
  try:fn()
  except (AssertionError,StopIteration):controls.append(name)
  else:raise AssertionError('negative control unexpectedly accepted: '+name)
 rejects('dropped identity',lambda:exact(list(map(ident,live))[1:],list(map(ident,frozen))))
 rejects('duplicate identity',lambda:exact(list(map(ident,live))+[ident(live[0])],list(map(ident,frozen))))
 mutated=copy.deepcopy(packets[0]);mutated['currentParent']['stem']='altered'
 rejects('mutated parent',lambda:packetcheck(mutated))
 rejects('missing disposition',lambda:dispositioncheck(rows[1:],packets,sources))
 mutated=copy.deepcopy(rows);mutated[0]['sourceIds']=['unknown-source']
 rejects('unresolved source',lambda:dispositioncheck(mutated,packets,sources))
 mutated=copy.deepcopy(rows);mutated[0]['proposedBoundary']='nonexistent'
 rejects('nonexistent proposed stage',lambda:dispositioncheck(mutated,packets,sources))
 mutated=copy.deepcopy(rows);mutated[0]['deterministic']=True
 rejects('unsupported deterministic claim',lambda:dispositioncheck(mutated,packets,sources))
 summary=dict(rows=len(rows),parents=len(packets),sources=len(sources),dispositions=dict(collections.Counter(x['disposition'] for x in rows)),preservation=preservationcounts,negativeControls=controls,clinicalCertification=False)
 print(json.dumps(summary,indent=2))
if __name__=='__main__':main()
