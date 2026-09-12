import json,sys,textwrap
R='/private/tmp/claude-501/-Users-holemini-Desktop-Project-Shrimp/32f09f80-d04f-4fa3-9af9-bc63811ab489/scratchpad/c17-review/audit/campaign-17-residual-successor-2026-09-12-r1/phase-a/'
def bi(o,ind=''):
    if o is None: return ind+'(none)'
    if isinstance(o,str): return ind+o
    en=o.get('en',''); zh=o.get('zh','')
    return ind+'EN: '+en.replace('\n','\n'+ind+'    ')+'\n'+ind+'ZH: '+zh.replace('\n','\n'+ind+'    ')
def load(pid): return json.load(open(R+f'parents/{pid}.json'))
def show(pid, what='all', only=None):
    p=load(pid); cp=p['currentParent']; cs=cp['caseStudy']
    rows={e['rowKey']:e for e in p['frozenExceptions']}
    resid={e['partId'] for e in p['frozenExceptions']}
    if what in ('all','ctx'):
        print(f"### PACKET {pid} | parent {cp['id']} | bank {p['bankPath']}")
        print(f"# residual parts: {sorted(resid)}")
        print(f"\n## PARENT-LEVEL\ncategory={cp.get('category')} topic={cp.get('topic')} diff={cp.get('difficulty')} itemType={cp.get('itemType')}")
        print('TITLE:\n'+bi(cs.get('title'),'  '))
        print('SUMMARY:\n'+bi(cs.get('summary'),'  '))
        if cp.get('stem'): print('PARENT STEM:\n'+bi(cp['stem'],'  '))
        for ex in cs.get('exhibits',[]) or []:
            print(f"\n[GLOBAL EXHIBIT {ex.get('id')}]"); print(bi(ex.get('title'),'  ')); print(bi(ex.get('content'),'  '))
        print('\n## STAGES (in order)')
        for i,s in enumerate(cs.get('stages',[])):
            print(f"\n===== STAGE[{i}] id={s.get('id')} =====")
            print(bi(s.get('title'),'  '))
            for ex in s.get('exhibits',[]) or []:
                print(f"  [EX {ex.get('id')}] "); print(bi(ex.get('title'),'    ')); print(bi(ex.get('content'),'    '))
    if what in ('all','parts'):
        print('\n## PARTS')
        for q in cs.get('questions',[]):
            if only and q['id'] not in only: continue
            mark=' <<< RESIDUAL ROW' if q['id'] in resid else ''
            print(f"\n----- PART {q['id']} ({q.get('itemType')}) {mark}")
            print(f"  anchors: answerableAfterStageId={q.get('answerableAfterStageId')!r} stageId={q.get('stageId')!r}")
            print(f"  ngnSkill={q.get('ngnSkill')} topic={q.get('topic')}")
            print('  STEM:\n'+bi(q.get('stem'),'    '))
            for k in ('options','choices','blanks','columns','rows','tokens','segments','dropdowns','statements','causes','actions','findings'):
                if q.get(k) is not None: print(f'  {k}: '+json.dumps(q[k],ensure_ascii=False,indent=1)[:4000])
            for k in ('correct','correctAnswer','key','answer','correctOrder'):
                if q.get(k) is not None: print(f'  {k}: '+json.dumps(q[k],ensure_ascii=False)[:2000])
            r=q.get('rationale') or {}
            if r.get('correct'): print('  RATIONALE.correct:\n'+bi(r['correct'],'    '))
            if r.get('byChoice'):
                for bc in r['byChoice']:
                    print(f"    [{bc.get('refId')}] "+bi({k:bc.get(k,'') for k in ('en','zh')},'      ').strip())
            if q.get('glossary'): print('  glossary: '+json.dumps(q['glossary'],ensure_ascii=False)[:800])
if __name__=='__main__':
    a=sys.argv
    show(a[1], a[2] if len(a)>2 else 'all', set(a[3].split(',')) if len(a)>3 else None)
