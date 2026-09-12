"""Print complete current parent and both residual judgments without JSON whitespace."""
import json,pathlib,sys
r=pathlib.Path(__file__).resolve().parents[1]
section='all'
args=sys.argv[1:]
if args and args[0].startswith('--'):
 section=args.pop(0)[2:]
for arg in args:
 p=json.loads((r/'phase-a/parents'/f'parent-{int(arg):02d}.json').read_text())
 print(p['packetId'],p['parentCaseId'])
 parent=p['currentParent']
 if section=='context':
  parent=json.loads(json.dumps(parent));parent['caseStudy'].pop('questions')
 if section in ['all','context']:print('CURRENT PARENT:',json.dumps(parent,ensure_ascii=False,separators=(',',':')))
 if section in ['parts','parts1','parts2']:
  qs=parent['caseStudy']['questions'];qs=qs[:3] if section=='parts1' else qs[3:] if section=='parts2' else qs
  for q in qs:print(json.dumps(q,ensure_ascii=False,separators=(',',':')))
 for seat,rows in (p['frozenJudgments'].items() if section in ['all','evidence'] else []):
  print('FROZEN',seat)
  for row in rows:print(json.dumps(row['judgment'],ensure_ascii=False,separators=(',',':')))
