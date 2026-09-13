"""Phase-B bounded boundary-sanity screen (reviewer-authored).

For each strict missingRequiredAnchor row, take the legacy stageId boundary as the
visible prefix and flag obvious internal dependencies of the part's own learner text
(stem, cloze/highlight text, options/rows/columns/tokens) on hidden stages:
  - numeric values / clock times cited by the part that occur only in hidden stages
  - explicit "Stage N" / "阶段N" references whose referenced stage is hidden
Also dumps a readable per-parent view for human reading.
Usage: python3 boundary_screen.py <sourceRoot> <rows.txt> <outDir>
"""
import json, re, sys, os
SRC, ROWS, OUT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)
rows = [l.split() for l in open(ROWS) if l.strip()]
NUM = re.compile(r'(?<![\w.])\d+(?:[.:]\d+)?(?![\w])')
STAGEREF = re.compile(r'(?:\bstage\s*(\d+)\b|阶段\s*(\d+)|第\s*(\d+)\s*阶段)', re.I)
SKIPKEYS = {'id', 'refId', 'itemType', 'category', 'ngnSkill', 'difficulty', 'topic', 'stageId',
            'answerableAfterStageId', 'glossary', 'rationale', 'testTakingStrategy', 'selfCheck',
            'meta', 'correct', 'correctAnswer', 'correctOrder', 'answer', 'key', 'score', 'scoring',
            'visual', 'structuredMeasurements', 'kind', 'type'}

def text(o, acc, skip=SKIPKEYS):
    if isinstance(o, dict):
        for k, v in o.items():
            if k in skip: continue
            text(v, acc, skip)
    elif isinstance(o, list):
        for v in o: text(v, acc, skip)
    elif isinstance(o, str): acc.append(o)
    return acc

def nums(strs):
    s = set()
    for t in strs: s.update(NUM.findall(t))
    return s

def allstr(o):
    return json.dumps(o, ensure_ascii=False)

banks = {}
def bank(path):
    if path not in banks: banks[path] = json.load(open(os.path.join(SRC, path), encoding='utf-8'))
    return banks[path]

by_parent = {}
for f, parent, part in rows:
    by_parent.setdefault((f, parent), []).append(part)

results = []
dump = []
for (f, pid), parts in sorted(by_parent.items()):
    b = bank('banks/' + f)
    p = next(q for q in b['questions'] if q['id'] == pid)
    cs = p['caseStudy']; stages = cs.get('stages', []); ids = [s['id'] for s in stages]
    glob = text({k: v for k, v in cs.items() if k not in ('questions', 'stages')}, []) + text(p.get('stem'), [])
    # include structured measurement / visual data as visible-number sources (numbers only)
    globnum_extra = nums([allstr({k: v for k, v in cs.items() if k not in ('questions', 'stages')})])
    stage_txt = {s['id']: text(s, []) for s in stages}
    stage_num = {s['id']: nums([allstr(s)]) for s in stages}
    dump.append(f"\n{'#'*100}\n# {f} | {pid} | stages={ids}\n# population parts: {parts}")
    dump.append("TITLE: " + cs['title']['en'] + " / " + cs['title']['zh'])
    if cs.get('summary'): dump.append("SUMMARY EN: " + cs['summary']['en'] + "\nSUMMARY ZH: " + cs['summary']['zh'])
    for ex in cs.get('exhibits', []):
        dump.append(f"[GLOBAL {ex.get('id')}] {ex['title']['en']}\n  EN: {ex['content']['en']}\n  ZH: {ex['content']['zh']}")
    for i, s in enumerate(stages):
        dump.append(f"\n=== STAGE[{i}] {s['id']} :: {s['title']['en']} / {s['title']['zh']} " + (f"t={s.get('timeOffset')}" if s.get('timeOffset') else ''))
        for k in ('trigger', 'narrative'):
            if s.get(k): dump.append(f"  {k} EN: {s[k]['en']}\n  {k} ZH: {s[k]['zh']}")
        for ex in s.get('exhibits', []):
            dump.append(f"  [EX {ex.get('id')}] {ex['title']['en']}\n    EN: {ex['content']['en']}\n    ZH: {ex['content']['zh']}")
            if ex.get('structuredMeasurements'): dump.append("    SM: " + allstr(ex['structuredMeasurements'])[:1500])
    prows = []
    for q in cs['questions']:
        inpop = q['id'] in parts
        anchor = q.get('stageId')
        dump.append(f"\n--- PART {q['id']} ({q['itemType']}) stageId={anchor!r} aasi={q.get('answerableAfterStageId')!r} {'<<< POPULATION' if inpop else ''}")
        qt = text(q, [])
        dump.append("  LEARNER TEXT:\n    " + "\n    ".join(t.replace('\n', ' ') for t in qt))
        keyish = {k: q[k] for k in ('correct', 'correctAnswer', 'correctOrder', 'answer', 'key') if k in q}
        if keyish: dump.append("  KEY: " + allstr(keyish)[:1200])
        if q.get('rationale', {}).get('correct'):
            dump.append("  RATIONALE EN: " + q['rationale']['correct']['en'][:900])
        if not inpop: continue
        if anchor not in ids:
            prows.append({'partId': q['id'], 'error': 'legacy not resolving'}); continue
        vi = ids.index(anchor); vis = ids[:vi + 1]; hid = ids[vi + 1:]
        visnum = nums(glob) | globnum_extra
        for s in vis: visnum |= stage_num[s]
        hidnum = set()
        for s in hid: hidnum |= stage_num[s]
        qnum = nums(qt)
        stranded = sorted(n for n in qnum & hidnum if n not in visnum)
        refs = []
        for t in qt:
            for m in STAGEREF.finditer(t):
                n = int(next(g for g in m.groups() if g))
                refs.append({'ref': m.group(0), 'n': n})
        # stage-N refs: flag if n-th stage (1-based) is hidden, or index n (0-based) hidden
        hidden_refs = [r for r in refs if (r['n'] - 1 >= vi + 1 and r['n'] - 1 < len(ids))]
        prows.append({'partId': q['id'], 'legacyStageId': anchor, 'visibleStageIds': vis, 'hiddenStageIds': hid,
                      'strandedNumbers': stranded, 'stageRefs': refs, 'stageRefsPointingHidden': hidden_refs,
                      'lastStage': not hid})
    results.append({'bank': 'banks/' + f, 'parentCaseId': pid, 'stageTopology': ids, 'populationParts': parts, 'rows': prows})

json.dump(results, open(os.path.join(OUT, 'screen.json'), 'w'), ensure_ascii=False, indent=1)
open(os.path.join(OUT, 'parents-dump.txt'), 'w').write("\n".join(dump))
print('parents', len(results), 'rows', sum(len(r['rows']) for r in results))
for r in results:
    for x in r['rows']:
        flag = x.get('strandedNumbers') or x.get('stageRefsPointingHidden')
        print(f"{r['parentCaseId'][:55]:<55} {x['partId'][-12:]:<12} b={x.get('legacyStageId')} vis={len(x.get('visibleStageIds',[]))}/{len(r['stageTopology'])} "
              f"stranded={x.get('strandedNumbers')} hidRefs={[h['ref'] for h in x.get('stageRefsPointingHidden',[])]}" + ('  <<' if flag else ''))
