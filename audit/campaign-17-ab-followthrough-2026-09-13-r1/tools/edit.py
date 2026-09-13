import json,pathlib,copy
root=pathlib.Path(__file__).resolve().parents[1]; reviews=json.loads((root/'review-a.json').read_text())
def load(n):
 r=next(r for r in reviews if r['packetId']==f'parent-{n:02}');return json.loads((root/'after'/f"{r['parentCaseId']}.json").read_text())
def save(q): (root/'after'/f"{q['id']}.json").write_text(json.dumps(q,ensure_ascii=False,indent=2)+'\n')
def part(q,suffix): return next(p for p in q['caseStudy']['questions'] if p['id'].endswith(suffix))
def obj(a,id,key='id'): return next(v for v in a if v[key]==id)
def pair(en,zh):return {'en':en,'zh':zh}
def bi(o,en,zh):o.update(pair(en,zh))
def rep(o,key,before,after):
 assert o[key].count(before)==1,(key,before,o[key]);o[key]=o[key].replace(before,after)
def content(q,stage=0,ex=0):return q['caseStudy']['stages'][stage]['exhibits'][ex]['content']
def anchor(p,value): p['answerableAfterStageId']={'kind':'baseline'} if value=='baseline' else value
