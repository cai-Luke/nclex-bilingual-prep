"""Programmatic, idempotent raw-only note-order refinement after authoring.

Moves intact bilingual segments, preserving ids, keys, rationales and clinical facts.
Never rewrites or touches a canonical bank. Run after author scripts when reproducing.
"""
from pathlib import Path
import hashlib,json,subprocess,sys
R=Path(__file__).resolve().parents[1]
orders={
 (1,3):(['s2','s4','s1','s3','s5'],'Own neurologic/vascular history, then family and other histories.'),
 (2,1):(['s1','s4','s3','s5','s2'],'Home walk observations from storage to devices and used-battery handling.'),
 (2,5):(['s1','s3','s2','s5','s4'],'Bedtime routine/environment, nocturnal observations, then daytime consequences.'),
 (2,6):(['s5','s1','s3','s2','s4'],'Earlier anxiety report, ongoing physical symptoms, then new orientation/perception findings.'),
 (3,4):(['s5','s1','s2','s3','s4'],'Contraceptive goal, postpartum age/menses, then daytime and overnight feeding.'),
}
receipts=[]
for batch in (1,2,3):
 p=R/f'phase-c/raw/gpt-2026-09-12-0609-t{batch}.json';raw=p.read_bytes();bank=json.loads(raw);changes=[]
 for (b,n),(order,why) in orders.items():
  if b!=batch:continue
  q=bank['questions'][n-1];segments=q['highlight']['segments'];before=[s['id'] for s in segments];lookup={s['id']:s for s in segments}
  assert set(before)=={'intro',*order}
  q['highlight']['segments']=[lookup['intro'],*[lookup[id] for id in order]]
  changes.append({'id':q['id'],'before':before,'after':['intro',*order],'reason':why,'preserved':'Each entire segment object, key list, rationale, and every other field.'})
 p.write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
 result=subprocess.run(['npm','run','validate-bank','--',str(p)],check=False)
 assert result.returncode==0,f'Immediate post-edit validation failed: {p}'
 receipts.append({'file':str(p.relative_to(R)),'beforeSha256':hashlib.sha256(raw).hexdigest(),'afterSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'changes':changes,'validationExit':result.returncode})
(R/'phase-c/evidence/note-order-refinement.json').write_text(json.dumps(receipts,ensure_ascii=False,indent=2)+'\n')
print('Refined five intact note orders; immediate validation passed for each touched raw bank.')
