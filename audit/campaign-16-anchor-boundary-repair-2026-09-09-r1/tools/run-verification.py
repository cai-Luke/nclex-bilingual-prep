"""Capture R4 gates without modifying repository tooling or normalizing known failures."""
import json,subprocess,hashlib,datetime,sys
from pathlib import Path
r=Path(__file__).resolve().parents[1]; repo=r.parents[1]
mode=sys.argv[1]
banks=sorted(str(p.relative_to(repo)) for p in (repo/'banks').glob('*.json'))
required=['audit-stage-refs','exam-layout','case-completeness','audit-ids','audit-references','raw-gate','schema-bank','typed-baseline','typed-baseline-scanner','typed-baseline-survey','typed-baseline-ui']
commands={
 'gates':[('validate-bank',['npm','run','validate-bank','--',*banks]),('audit',['npm','run','audit']),*[('stage-refs-'+Path(b).stem,['npm','run','audit:stage-refs','--','--file',b]) for b in banks],('stage-refs-strict',['npm','run','audit:stage-refs','--','--strict',*[x for b in banks for x in ['--file',b]]])],
 'tests':[(name,['npm','run','test:'+name]) for name in required]+[(name+'-direct',['npx','tsx','scripts/tests/'+name+'.ts']) for name in required if name.startswith('typed-baseline')]+[('tsc',['npx','tsc','-b','--pretty','false'])],
 'build':[('build',['npm','run','build'])],
 'census-before':[('census-check-before',['npm','run','census:check'])],
 'census-generate':[('census-generate',['npm','run','census'])],
 'census-after':[('census-check-after',['npm','run','census:check'])],
}
receipts=[]
for name,cmd in commands[mode]:
 start=datetime.datetime.now(datetime.timezone.utc).isoformat(); log=r/'evidence'/(name+'.log'); assert not log.exists(),log
 with log.open('x') as f: p=subprocess.run(cmd,cwd=repo,stdout=f,stderr=subprocess.STDOUT)
 receipt={'name':name,'command':cmd,'exitCode':p.returncode,'startedAt':start,'finishedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'log':str(log.relative_to(r)),'logSha256':hashlib.sha256(log.read_bytes()).hexdigest()}
 receipts.append(receipt);(r/'evidence'/('verification-'+mode+'.json')).write_text(json.dumps(receipts,indent=2)+'\n');print(name,p.returncode,flush=True)
