from edit import *
import hashlib
sha=lambda b:hashlib.sha256(b).hexdigest()
A=reviews;B=json.loads((root/'review-b.json').read_text());bankmap={r['parentCaseId']:r['bankPath'] for r in A+B};ops=[];diffs=[]
def walk(a,b,path):
 if a==b:return
 if isinstance(a,dict) and isinstance(b,dict):
  for k in sorted(set(a)|set(b)):
   if k not in a:diffs.append({'path':path+[k],'beforePresent':False,'after':b[k]})
   elif k not in b:diffs.append({'path':path+[k],'before':a[k],'afterPresent':False})
   else:walk(a[k],b[k],path+[k])
 elif isinstance(a,list) and isinstance(b,list) and len(a)==len(b):
  for i,(x,y) in enumerate(zip(a,b)):walk(x,y,path+[i])
 else:diffs.append({'path':path,'before':a,'after':b})
for f in sorted((root/'before').glob('*.json')):
 a=json.loads(f.read_text());b=json.loads((root/'after'/f.name).read_text());assert a['id']==b['id']
 if a==b:continue
 assert set(a)==set(b)
 for k in a:
  if a[k]!=b[k]:ops.append({'kind':'setValue','bankPath':bankmap[a['id']],'id':a['id'],'path':[k],'before':a[k],'after':b[k],'note':'Campaign 17 A/B producer implementation; full parent preimage frozen; independent review pending'})
 walk(a,b,[bankmap[a['id']],a['id']])
(root/'patch-manifest.json').write_text(json.dumps(ops,ensure_ascii=False,indent=2)+'\n');(root/'field-diff-manifest.json').write_text(json.dumps(diffs,ensure_ascii=False,indent=2)+'\n');print('ops',len(ops),'parents',len({o['id'] for o in ops}),'banks',sorted({o['bankPath'] for o in ops}),'field diffs',len(diffs))
