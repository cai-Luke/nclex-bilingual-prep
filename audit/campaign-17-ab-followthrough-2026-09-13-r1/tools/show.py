import json,sys,pathlib
root=pathlib.Path(__file__).resolve().parents[1]; reviews=json.loads((root/'review-a.json').read_text())
for n in map(int,sys.argv[1:]):
 rs=[r for r in reviews if r['packetId']==f'parent-{n:02}'];q=json.loads((root/'before'/f"{rs[0]['parentCaseId']}.json").read_text()); ids={r['partId'] for r in rs}
 print('\nPARENT',n,q['id'])
 def walk(x,path=''):
  if isinstance(x,dict):
   for k,v in x.items():
    if k not in ['structuredMeasurements','questions']:walk(v,path+'/'+k)
  elif isinstance(x,list):
   for i,v in enumerate(x):walk(v,path+'/'+str(i))
  else: print(path,':',x)
 walk({k:v for k,v in q.items() if k not in ['rationale','glossary','testTakingStrategy']})
 for p in q['caseStudy']['questions']:
  if p['id'] in ids: print('TARGET',json.dumps(p,ensure_ascii=False))
  else: print('SIBLING',json.dumps({k:v for k,v in p.items() if k not in ['glossary','testTakingStrategy','rationale']},ensure_ascii=False))
