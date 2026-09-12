import json,re
R='c17-review/audit/campaign-17-residual-successor-2026-09-12-r1/phase-a/'
pk={e['packetId']:e for e in json.load(open(R+'parent-index.json'))}
NUM=re.compile(r'\d+(?:\.\d+)?')
hits=[]
def chk(o,path,pid,scope):
    if isinstance(o,dict):
        if isinstance(o.get('en'),str) and isinstance(o.get('zh'),str):
            a=NUM.findall(o['en']); b=NUM.findall(o['zh'])
            # multiset compare
            from collections import Counter
            ca,cb=Counter(a),Counter(b)
            if ca!=cb:
                only_en=sorted((ca-cb).elements()); only_zh=sorted((cb-ca).elements())
                hits.append((pid,scope,path,only_en,only_zh,o['en'][:100],o['zh'][:100]))
        for k,v in o.items(): chk(v,path+'.'+k,pid,scope)
    elif isinstance(o,list):
        for i,v in enumerate(o): chk(v,f'{path}[{i}]',pid,scope)
for pid,e in pk.items():
    p=json.load(open(R+f'parents/{pid}.json')); cs=p['currentParent']['caseStudy']
    resid={x['partId'] for x in p['frozenExceptions']}
    chk(cs.get('title'),'title',pid,'GLOBAL'); chk(cs.get('summary'),'summary',pid,'GLOBAL')
    chk(cs.get('exhibits'),'globalExhibits',pid,'GLOBAL')
    chk(cs.get('stages'),'stages',pid,'STAGE')
    for q in cs['questions']:
        if q['id'] in resid: chk({k:v for k,v in q.items() if k!='glossary'},'part',pid,'PART:'+q['id'])
print('EN/ZH numeric mismatches:',len(hits))
for h in hits:
    print(f'\n{h[0]} [{h[1]}] {h[2]}\n   only_EN={h[3]} only_ZH={h[4]}\n   EN: {h[5]}\n   ZH: {h[6]}')
