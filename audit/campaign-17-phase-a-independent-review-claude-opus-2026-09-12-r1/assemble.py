import json,glob,sys
R='c17-review/audit/campaign-17-residual-successor-2026-09-12-r1/phase-a/'
ds={r['rowKey']:r for r in json.load(open(R+'dispositions.json'))}
bypart={(r['packetId'],r['partId']):r for r in ds.values()}
pk={e['packetId']:e for e in json.load(open(R+'parent-index.json'))}
rows=[]
for f in sorted(glob.glob('adj/p*.json')):
    for rec in json.load(open(f)):
        k=(rec['packetId'],rec['partId'])
        if k not in bypart: print('!! UNKNOWN',k); continue
        src=bypart[k]
        rec['rowKey']=src['rowKey']
        rec['sourceParentSha256']=pk[rec['packetId']]['currentParentSha256']
        rec['codexProposedDisposition']=src['disposition']
        rec['codexProposedBoundary']=src['proposedBoundary']
        rows.append(rec)
seen={}
for r in rows:
    if r['rowKey'] in seen: print('!! DUP',r['rowKey'])
    seen[r['rowKey']]=1
print('assembled rows:',len(rows),'unique:',len(seen))
missing=[k for k in ds if k not in seen]
print('remaining rows to adjudicate:',len(missing))
if len(sys.argv)>1 and sys.argv[1]=='write':
    json.dump(rows,open('adj/ASSEMBLED.json','w'),ensure_ascii=False,indent=1)
    print('written')
