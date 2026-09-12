import json,re,collections
R='c17-review/audit/campaign-17-residual-successor-2026-09-12-r1/phase-a/'
ds=json.load(open(R+'dispositions.json'))
pk={e['packetId']:e for e in json.load(open(R+'parent-index.json'))}
STOP=set('the a an of in for and or to with is are be by on at as from that this these those client patient nurse should which what best most first now after before during per not no all any each other more less than then when while because require requires required using use used provide provides provided ensure ensures assess assesses monitor monitors care plan stage findings finding option options select apply applies applicable'.split())
def words(t):
    return {w for w in re.findall(r"[A-Za-z][A-Za-z\-']{4,}", t.lower()) if w not in STOP}
out=[]
for r in ds:
    pid=r['packetId']; p=json.load(open(R+f'parents/{pid}.json')); cs=p['currentParent']['caseStudy']
    q=[x for x in cs['questions'] if x['id']==r['partId']][0]
    # keyed option texts
    keyed=[]
    cor=q.get('correct')
    if isinstance(cor,list) and cor and isinstance(cor[0],str):
        ids=set(cor)
        for o in q.get('options',[]) or []:
            if o['id'] in ids: keyed.append(o.get('en',''))
    for d in q.get('dropdowns',[]) or []:
        c=d.get('correct')
        for o in d.get('options',[]):
            if o['id']==c: keyed.append(o.get('en',''))
    if not keyed: continue
    kw=set()
    for t in keyed: kw|=words(t)
    if not kw: continue
    # sibling stems + title + summary (always-rendered surfaces outside this part)
    surf={}
    if cs.get('title'): surf['TITLE']=cs['title'].get('en','')
    for s in cs['questions']:
        if s['id']==r['partId']: continue
        surf['STEM:'+s['id'].split('_')[-1]]=s['stem'].get('en','')
    hits=collections.defaultdict(set)
    for name,txt in surf.items():
        ov=kw & words(txt)
        if ov: hits[name]=ov
    if hits:
        out.append((r['disposition'],pid,r['partId'],dict(hits)))
out.sort()
for d,pid,part,h in out:
    strong={k:sorted(v) for k,v in h.items() if len(v)>=2 or any(len(w)>8 for w in v)}
    if not strong: continue
    print(f'{d:<30}{pid} {part}')
    for k,v in strong.items(): print(f'      {k}: {v}')
print('\nrows with keyed-answer vocabulary echoed on an always-rendered surface outside the part:',len([1 for d,p,pa,h in out]))
