import json,sys,re
R='c17-review/audit/campaign-17-residual-successor-2026-09-12-r1/phase-a/'
D={r['rowKey']:r for r in json.load(open(R+'dispositions.json'))}
def run(pid, zh=False):
    p=json.load(open(R+f'parents/{pid}.json')); cp=p['currentParent']; cs=cp['caseStudy']
    resid=[e['partId'] for e in p['frozenExceptions']]
    L=lambda o: '' if not o else (o.get('en','') if not zh else f"EN:{o.get('en','')}\nZH:{o.get('zh','')}")
    print(f"### {pid} | {cp['id']} | {p['bankPath']}  residual={resid}")
    print('TITLE:',L(cs.get('title'))); print('SUMMARY:',L(cs.get('summary'))[:900])
    for ex in cs.get('exhibits',[]) or []: print(f"\n[GLOBAL {ex['id']}] {L(ex.get('title'))}\n{L(ex.get('content'))[:1500]}")
    for s in cs.get('stages',[]):
        print(f"\n===== {s['id']} ===== {L(s.get('title'))}")
        for ex in s.get('exhibits',[]) or []: print(f"  [{ex['id']}] {L(ex.get('content'))[:1400]}")
    print('\nPARTS:',[(q['id'].split('_')[-1],q.get('itemType'),q.get('answerableAfterStageId')) for q in cs['questions']])
    for q in cs['questions']:
        if q['id'] not in resid: continue
        print(f"\n@@@@@@@@ {q['id']} ({q.get('itemType')}) ngn={q.get('ngnSkill')}")
        print('STEM:',L(q.get('stem')))
        if q.get('clozeStem'): print('CLOZE:',L(q['clozeStem']))
        for k in ('options','dropdowns','matrix','blanks'):
            if q.get(k): print(k.upper()+':',json.dumps(q[k],ensure_ascii=not zh,indent=None)[:2600])
        print('KEY:',json.dumps(q.get('correct'),ensure_ascii=False)[:500])
        print('RAT:',L(q['rationale']['correct'])[:900])
        for b in q['rationale'].get('byChoice',[]): print(f"  ({b.get('refId')}) {b.get('en','')[:220]}")
        if q.get('testTakingStrategy'): print('STRAT:',L(q['testTakingStrategy'])[:300])
    print('\n---- FROZEN + CODEX ----')
    for e in p['frozenExceptions']:
        r=D[e['rowKey']]
        print(f"[{r['partId']}] group={e.get('documentaryGroup')}")
        print(f"   C16 prod={e['producer']['disposition']}/{e['producer']['proposedBoundary']} chk={e['checker']['disposition']}/{e['checker']['proposedBoundary']}")
        for w in ('producer','checker'):
            if e[w].get('exceptionReason'): print(f"   {w}Reason: {e[w]['exceptionReason'][:340]}")
        print(f"   CODEX {r['disposition']} -> {r['proposedBoundary']} hides={r['stagesHiddenIfApproved']}")
        print(f"   hide: {r['laterInformationToHide'][:220]}")
        print(f"   work: {(r['requiredContentWork'] or '(none)')[:340]}")
        print(f"   src: {r['sourceIds']}")
run(sys.argv[1], len(sys.argv)>2)
