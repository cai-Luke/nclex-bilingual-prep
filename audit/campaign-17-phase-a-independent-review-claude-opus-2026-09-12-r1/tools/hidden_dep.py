import json,re,sys
R='c17-review/audit/campaign-17-residual-successor-2026-09-12-r1/phase-a/'
ds=json.load(open(R+'dispositions.json'))
pk={e['packetId']:e for e in json.load(open(R+'parent-index.json'))}
NUM=re.compile(r'\d+(?:\.\d+)?')
def txt(o,acc):
    if isinstance(o,dict):
        for k,v in o.items():
            if k in ('id','refId','itemType','category','ngnSkill','difficulty','topic'): continue
            txt(v,acc)
    elif isinstance(o,list):
        for v in o: txt(v,acc)
    elif isinstance(o,str): acc.append(o)
    return acc
out=[]
for r in ds:
    pid=r['packetId']; p=json.load(open(R+f'parents/{pid}.json')); cs=p['currentParent']['caseStudy']
    stages=cs.get('stages',[]); ids=[s['id'] for s in stages]
    b=r['proposedBoundary']
    if b is None: continue
    if b=='baseline': vis=[]
    elif b in ids: vis=ids[:ids.index(b)+1]
    else: continue
    hid=[s for s in ids if s not in vis]
    if not hid: continue
    # text visible at boundary = parent-level + global exhibits + visible stages
    visacc=txt({k:v for k,v in cs.items() if k!='questions' and k!='stages'},[])
    visacc+=txt(p['currentParent'].get('stem'),[])
    for s in stages:
        if s['id'] in vis: visacc+=txt(s,[])
    hidacc=[]
    for s in stages:
        if s['id'] in hid: hidacc+=txt(s,[])
    visnums=set(); [visnums.update(NUM.findall(t)) for t in visacc]
    hidnums=set(); [hidnums.update(NUM.findall(t)) for t in hidacc]
    q=[x for x in cs['questions'] if x['id']==r['partId']][0]
    qacc=txt({k:v for k,v in q.items() if k!='glossary'},[])
    qnums=set(); [qnums.update(NUM.findall(t)) for t in qacc]
    # numbers the part cites that appear ONLY in hidden stages
    stranded=sorted(n for n in qnums & hidnums if n not in visnums and len(n)>0)
    if stranded:
        out.append((r['disposition'],pid,r['partId'],b,hid,stranded))
out.sort()
for d,pid,part,b,hid,st in out:
    print(f'{d:<30} {pid} {part}')
    print(f'    boundary={b} hides={hid} stranded_numbers={st}')
print('\nrows with stranded numeric references:',len(out))
