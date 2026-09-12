"""Create a phase manifest once; subsequent invocations verify without rewriting it."""
import datetime, hashlib, json, pathlib, subprocess, sys
R=pathlib.Path(__file__).resolve().parents[1]
phase=sys.argv[1]
assert phase in ('phase-a','phase-b','phase-c','phase-d')
target=R/(phase+'-freeze.json')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
if target.exists():
 data=json.loads(target.read_text())
 for p,h in data['artifacts'].items():assert sha(R/p)==h, p
 print(json.dumps({'status':'VERIFIED','phase':phase,'files':len(data['artifacts']),'manifestSha256':sha(target)}))
else:
 files=[p for p in (R/phase).rglob('*') if p.is_file()]
 files += [p for p in (R/'tools').glob('*') if p.is_file()]
 files += [R/'opening-state.json',R/'commission.md']
 files += [p for p in (R/'verification').glob('*') if p.is_file()]
 data={'phase':phase,'frozenAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'baseHead':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'producer':'Codex / GPT-6','independentCertification':False,'canonicalMutation':False,'artifacts':{str(p.relative_to(R)):sha(p) for p in sorted(set(files))}}
 target.write_text(json.dumps(data,indent=2)+'\n')
 print(json.dumps({'status':'FROZEN','phase':phase,'files':len(data['artifacts']),'manifestSha256':sha(target)}))
