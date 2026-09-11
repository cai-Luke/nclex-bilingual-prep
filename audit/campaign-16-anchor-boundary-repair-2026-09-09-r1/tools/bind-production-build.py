from pathlib import Path
import json,hashlib,datetime,subprocess
r=Path(__file__).resolve().parents[1];repo=r.parents[1];dist=repo/'dist'
h=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
files={str(p.relative_to(dist)):h(p) for p in sorted(dist.rglob('*')) if p.is_file()}
aggregate=hashlib.sha256(json.dumps(files,sort_keys=True,separators=(',',':')).encode()).hexdigest()
sources={str(p.relative_to(repo)):h(p) for base in ['src','lib','public'] for p in sorted((repo/base).rglob('*')) if p.is_file()}
for p in sorted((repo/'banks').glob('*.json')):sources[str(p.relative_to(repo))]=h(p)
for name in ['package.json','package-lock.json','vite.config.ts','scripts/make-file-build.ts']:
 p=repo/name
 if p.exists():sources[name]=h(p)
build=json.loads((r/'evidence/verification-build.json').read_text())[0];assert build['exitCode']==0
receipt={'status':'BUILD_FROZEN_FOR_PRODUCTION_FILE_SMOKE','timestamp':datetime.datetime.now(datetime.timezone.utc).isoformat(),'branch':subprocess.check_output(['git','branch','--show-current'],cwd=repo,text=True).strip(),'head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo,text=True).strip(),'worktreeUncommitted':True,'buildCommand':'npm run build','buildExitCode':0,'buildLogSha256':build['logSha256'],'indexPath':str(dist/'index.html'),'fileUrl':(dist/'index.html').as_uri(),'indexSha256':files['index.html'],'distFilesSha256':files,'sourceAndBankSha256':sources,'aggregateDigestAlgorithm':'SHA-256 of UTF-8 JSON(distFilesSha256), sorted keys, compact separators, no trailing newline','aggregateBuildIdentitySha256':aggregate,'scope':'Actual final production dist, bundled canonical repaired data; no synthetic fixture and no rebuild after witness.'}
with (r/'production-file-smoke-build-identity.json').open('x') as f:f.write(json.dumps(receipt,indent=2)+'\n')
print(json.dumps({k:receipt[k] for k in ['fileUrl','indexSha256','aggregateBuildIdentitySha256']},indent=2))
