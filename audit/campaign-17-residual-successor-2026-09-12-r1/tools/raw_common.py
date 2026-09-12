"""Author new raw objects and serialize safely. No canonical or promoted outputs."""
import hashlib,json,pathlib,re
R=pathlib.Path(__file__).resolve().parents[1]
TOKEN='0609'
def pair(en,zh):
 en=re.sub(r'([A-Za-z])(\d)',r'\1 \2',en)
 en=re.sub(r'(\d)([A-Za-z])',r'\1 \2',en)
 return {'en':en,'zh':zh}
def token(id,en,zh):return {'id':id,**pair(en,zh)}
def reason(id,en,zh):return {'refId':id,**pair(en,zh)}
def term(en,zh,definition):return {'termEn':en,'termZh':zh,'defZh':definition}
def question(batch,n,kind,category,topic,skill,stem,correct,strategy,glossary,bychoice,difficulty='medium'):
 return dict(id=f'gpt_2026_09_12_{TOKEN}_t{batch}_{n:02d}',itemType=kind,category=category,topic=topic,difficulty=difficulty,ngnSkill=skill,stem=pair(*stem),rationale={'correct':pair(*correct),'byChoice':bychoice},testTakingStrategy=pair(*strategy),glossary=glossary)
def save(batch,questions,evidence):
 assert len(questions)==6 and len({q['topic'] for q in questions})>=4 and len({q['itemType'] for q in questions})>=2
 out=R/'phase-c/raw';out.mkdir(parents=True,exist_ok=True)
 p=out/f'gpt-2026-09-12-{TOKEN}-t{batch}.json'
 bank=dict(meta=dict(schemaVersion='2.0',exam='NCLEX-RN',topic='Campaign 17 priority-topic expansion',category='mixed',difficulty='mixed',count=6),questions=questions)
 p.write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
 e=R/'phase-c/evidence';e.mkdir(exist_ok=True)
 (e/f'batch-{batch}.json').write_text(json.dumps({'rawFile':str(p.relative_to(R)),'producer':'Codex / GPT-6','status':'RAW_UNREVIEWED','items':evidence},ensure_ascii=False,indent=2)+'\n')
 print(f'Wrote {p}:6 raw items; independent review pending')
