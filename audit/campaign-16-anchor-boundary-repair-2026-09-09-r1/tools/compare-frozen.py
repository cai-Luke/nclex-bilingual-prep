"""R4 E.1: mechanical comparison only. Never re-derive semantic judgments."""
from pathlib import Path
import json, hashlib, subprocess, collections, datetime, shutil, itertools
ROOT=Path(__file__).resolve().parents[1]
REPO=ROOT.parents[1]
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
J=lambda p:json.loads(Path(p).read_text())
def write(name,obj):
 p=ROOT/name
 with p.open('x') as f: f.write(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
def command(*args): return subprocess.check_output(args,cwd=REPO,text=True).strip()
def decide(p,c):
 reasons=[]
 for label,x in [('PRODUCER',p),('CHECKER',c)]:
  if x['disposition']=='EXCEPTION': reasons.append(label+'_EXCEPTION')
  if x['confidence']!='HIGH': reasons.append(label+'_NON_HIGH')
  if x['bilingualRelation']!='PARALLEL': reasons.append(label+'_BILINGUAL_'+x['bilingualRelation'])
 if p['disposition']!=c['disposition']: reasons.append('BOUNDARY_DISPOSITION_DISAGREEMENT')
 elif p['disposition']=='STAGE' and p['proposedBoundary']!=c['proposedBoundary']: reasons.append('STAGE_ID_DISAGREEMENT')
 return ('EXCEPTION',reasons) if reasons else (p['disposition'],[])
def main():
 o=J(ROOT/'opening-state.json'); invpath=REPO/o['inventoryPath']; wopath=REPO/o['workOrderPath']
 pins={ROOT/'producer-freeze.json':'151c1327a5d9fa4decf9897200f2d336e55cea31d0f978317a7653c5c4193e4a',ROOT/'checker-freeze.json':'f506178017ce44c6b4429d2125e2542ad89eb56565c4fab82dece08b32b5ba43',invpath:'9f66750caaeead9d374742588856e2630a7fce09415bb7c2c662669a2af93e8e',wopath:'8cd476c23f2b6cadb07ae8115fd675fbbfc3f60acb46d7a521d5d1da30b2558b'}
 for p,h in pins.items(): assert H(p)==h,str(p)
 assert command('git','branch','--show-current')=='main'
 assert command('git','rev-parse','HEAD')=='a639b5fe7f6816e68228d7dc13d068c0c0f69e91'
 assert command('git','diff','--cached','--name-only')==''
 for p,h in J(ROOT/'evidence/opening-tracked-files.json').items(): assert H(REPO/p)==h,p
 banks={p:J(REPO/p) for p in o['banks']}
 for p,v in o['banks'].items(): assert H(REPO/p)==v['sha256'],p
 inv=[json.loads(s) for s in invpath.read_text().splitlines()]; frozen={r['rowKey']:r for r in inv}
 assert len(inv)==len(frozen)==451
 assert len({(r['bankPath'],r['parentCaseId']) for r in inv})==93
 for r in inv:
  parent=[q for q in banks[r['bankPath']]['questions'] if q['id']==r['parentCaseId']]; assert len(parent)==1
  part=[q for q in parent[0]['caseStudy']['questions'] if q['id']==r['partId']]; assert len(part)==1
  assert not {'answerableAfterStageId','stageId'} & part[0].keys()
  assert r['declaredStageIds']==[s['id'] for s in parent[0]['caseStudy']['stages']]
 seatrows={}; packetproof=[]
 fields=['rowKey','stage0QueueIndex','bankPath','parentCaseId','partId']
 for seat,packetskey in [('producer','packetReceipts'),('checker','packets')]:
  freeze=J(ROOT/(seat+'-freeze.json')); packets=freeze[packetskey]; assert len(packets)==27
  mapping={}
  for e in packets:
   assert H(ROOT/e['path'])==e['sha256']; assert H(ROOT/'source-packets'/(e['repairPacketId']+'.json'))==e['sourcePacketSha256']
   data=J(ROOT/e['path']); rows=data['rows']; expected=[r for r in inv if r['repairPacketId']==e['repairPacketId']]
   assert [r['rowKey'] for r in rows]==[r['rowKey'] for r in expected]
   for row in rows:
    assert row['rowKey'] not in mapping
    r=frozen[row['rowKey']]; assert all(row[f]==r[f] for f in fields)
    assert 'orStage' not in row
    d=row['disposition']; v=row['proposedBoundary']
    assert d in ['BASELINE','STAGE','EXCEPTION']
    assert (d=='BASELINE' and v=={'kind':'baseline'}) or (d=='STAGE' and isinstance(v,str) and v in r['declaredStageIds']) or (d=='EXCEPTION' and v is None and row['exceptionReason'])
    assert row['confidence'] in ['HIGH','MEDIUM','LOW']; assert row['bilingualRelation'] in ['PARALLEL','NOT_PARALLEL','UNCERTAIN']
    mapping[row['rowKey']]=row
   packetproof.append({'seat':seat,**e})
  assert set(mapping)==set(frozen); seatrows[seat]=mapping
 # Exhaustive E.1 truth table: 4 boundary choices x 3 confidence x 3 bilingual per seat.
 choices=[('BASELINE',{'kind':'baseline'}),('STAGE','s1'),('STAGE','s2'),('EXCEPTION',None)]
 samples=[dict(disposition=d,proposedBoundary=b,confidence=c,bilingualRelation=l) for (d,b),c,l in itertools.product(choices,['HIGH','MEDIUM','LOW'],['PARALLEL','NOT_PARALLEL','UNCERTAIN'])]
 for p,c in itertools.product(samples,repeat=2):
  expected=p['disposition'] if p['disposition'] in ['BASELINE','STAGE'] and p['disposition']==c['disposition'] and p['proposedBoundary']==c['proposedBoundary'] and p['confidence']==c['confidence']=='HIGH' and p['bilingualRelation']==c['bilingualRelation']=='PARALLEL' else 'EXCEPTION'
  assert decide(p,c)[0]==expected
 # Preserve all pre-existing commission artifacts, untracked external files, and opening bytes.
 existing={str(p.relative_to(REPO)):H(p) for p in ROOT.rglob('*') if p.is_file() and '__pycache__' not in p.parts}
 external={p:H(REPO/p) for p in command('git','ls-files','--others','--exclude-standard').splitlines() if not p.startswith(str(ROOT.relative_to(REPO))+'/')}
 write('evidence/post-freeze-resume-preservation.json',{'status':'PASS','access':'LIVE_LOCAL_DISK','verifiedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'branch':'main','head':o['head'],'aheadBehind':command('git','rev-list','--left-right','--count','HEAD...@{upstream}'),'pins':{str(p.relative_to(REPO)):h for p,h in pins.items()},'banks':o['banks'],'trackedFilesVerified':len(J(ROOT/'evidence/opening-tracked-files.json')),'existingCommissionFiles':existing,'unrelatedUntrackedFiles':external,'indexSha256':H(REPO/command('git','rev-parse','--git-path','index')),'all451PureOmission':True,'packetsVerified':packetproof})
 snapshot=ROOT/'evidence/opening-banks'; snapshot.mkdir()
 for p in banks: shutil.copyfile(REPO/p,snapshot/Path(p).name)
 for p in ['census.json','BANK-CENSUS.md']: shutil.copyfile(REPO/p,ROOT/'evidence'/('opening-'+p))
 result=[]; accepted=[]; exceptions=[]
 for r in inv:
  p=seatrows['producer'][r['rowKey']]; c=seatrows['checker'][r['rowKey']]; d,reasons=decide(p,c)
  record={f:r[f] for f in fields}; record.update(repairPacketId=r['repairPacketId'],disposition=d)
  if d=='EXCEPTION': record.update(exceptionReason='; '.join(reasons),reasonCodes=reasons)
  else: record['acceptedBoundary']=p['proposedBoundary']
  summaries={seat:{f:x[f] for f in ['disposition','proposedBoundary','confidence','bilingualRelation','exceptionReason']} for seat,x in [('producer',p),('checker',c)]}
  result.append({**record,**summaries})
  (exceptions if d=='EXCEPTION' else accepted).append({**record,**summaries})
 bybank={bank:{d:sum(r['disposition']==d and r['bankPath']==bank for r in result) for d in ['BASELINE','STAGE','EXCEPTION']} for bank in sorted({r['bankPath'] for r in inv})}
 counts=dict(collections.Counter(r['disposition'] for r in result)); reasons=dict(collections.Counter(code for r in exceptions for code in r['reasonCodes'])); combos=dict(collections.Counter(r['exceptionReason'] for r in exceptions))
 assert sum(counts.values())==451; assert sum(r['checker']['confidence']=='MEDIUM' for r in result)==3
 assert all(r['disposition']=='EXCEPTION' for r in result if r['checker']['confidence']!='HIGH' or r['checker']['disposition']=='EXCEPTION')
 summary={'total':451,'repairedBaseline':counts.get('BASELINE',0),'repairedStage':counts.get('STAGE',0),'exceptions':counts.get('EXCEPTION',0)}
 write('comparison.json',{'rule':'R4 E.1 literal deterministic exact agreement; no third semantic adjudication','inputPins':{str(p.relative_to(REPO)):h for p,h in pins.items()},'selfTestCases':len(samples)**2,'accounting':summary,'byBank':bybank,'exceptionReasonCountsOverlapping':reasons,'exceptionReasonCombinationsDisjoint':combos,'rows':result})
 for name,rows in [('accepted-boundaries.jsonl',accepted),('exceptions.jsonl',exceptions)]:
  with (ROOT/name).open('x') as f:
   for r in rows:f.write(json.dumps(r,ensure_ascii=False,separators=(',',':'))+'\n')
 md='# R4 frozen producer/checker comparison\n\nLiteral E.1 comparison only. No semantic tie-break or reinterpretation.\n\n451 = {repairedBaseline} + {repairedStage} + {exceptions}\n\n'.format(**summary)
 md+='| Bank | Accepted baseline | Accepted stage | Final exception |\n|---|---:|---:|---:|\n'+''.join(f'| {b} | {c["BASELINE"]} | {c["STAGE"]} | {c["EXCEPTION"]} |\n' for b,c in bybank.items())
 md+='\nAll three checker MEDIUM rows and the explicit checker EXCEPTION remain final exceptions. Full field-level decisions are in comparison.json; frozen reasoning is retained exclusively as evidence, without adjudication.\n\nDisjoint exception reason combinations:\n\n'+''.join(f'- {k}: {v}\n' for k,v in combos.items())
 with (ROOT/'comparison.md').open('x') as f:f.write(md)
 names=['comparison.json','comparison.md','accepted-boundaries.jsonl','exceptions.jsonl']
 write('comparison-freeze.json',{'frozenAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'beforeAnyCanonicalMutation':True,'artifacts':{n:H(ROOT/n) for n in names},'toolSha256':H(__file__),'accounting':summary,'selfTestCases':len(samples)**2,'all13BanksStillOpeningHashes':all(H(REPO/p)==o['banks'][p]['sha256'] for p in banks)})
 print(json.dumps({'status':'COMPARISON_FROZEN','accounting':summary,'byBank':bybank,'exceptionReasonCombinations':combos},indent=2))
if __name__=='__main__':main()
