import subprocess,json,pathlib,time,hashlib,datetime
out=pathlib.Path(__file__).resolve().parent
opening=json.loads((out/'opening-state.json').read_text())
def sha(path):return hashlib.sha256(pathlib.Path(path).read_bytes()).hexdigest()
def record(command,p,log,seconds):
 (out/log).write_text(p.stdout)
 results=json.loads((out/'test-results.json').read_text());results.append({'phase':'continuation-2-final','command':command,'exitCode':p.returncode,'status':'PASS' if p.returncode==0 else 'FAIL','seconds':round(seconds,2),'log':log,'result':p.stdout[-1800:]});(out/'test-results.json').write_text(json.dumps(results,indent=2)+'\n')
commands=['npm run validate-bank -- banks/*.json','npm run audit','npm run census:check','npx tsc -b --pretty false','npm run build','git diff --check']
for i,cmd in enumerate(commands,1):
 t=time.monotonic();p=subprocess.run(cmd,shell=True,text=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);record(cmd,p,f'continuation-2-final-{i:02}.log',time.monotonic()-t);print(cmd,'EXIT',p.returncode,p.stdout[-600:],flush=True)
 if p.returncode:break
 if cmd=='npm run build':
  tree={str(p.relative_to('dist')):sha(p) for p in sorted(pathlib.Path('dist').rglob('*')) if p.is_file()}
  manifest=json.loads((out/'implementation-manifest.json').read_text())
  candidates={r['path'] for r in manifest['changedFiles']+manifest['newSourceTests']}|{'scripts/tests/typed-baseline-survey.ts'}
  sources={p:sha(p) for p in sorted(candidates) if p not in opening['hashes'] or sha(p)!=opening['hashes'][p]}
  identity={'timestamp':datetime.datetime.now(datetime.timezone.utc).isoformat(),'branch':subprocess.check_output(['git','branch','--show-current']).decode().strip(),'head':subprocess.check_output(['git','rev-parse','HEAD']).decode().strip(),'worktreeUncommitted':True,'statement':'Local uncommitted implementation; no commit or publication performed.','buildCommand':cmd,'buildExitCode':p.returncode,'indexPath':str(pathlib.Path('dist/index.html').resolve()),'indexSha256':tree['index.html'],'distFilesSha256':tree,'finalAuthorizedSourcesSha256':sources,'aggregateDigestAlgorithm':'SHA-256 of UTF-8 JSON(distFilesSha256), sorted keys, compact separators, no trailing newline','aggregateBuildIdentitySha256':hashlib.sha256(json.dumps(tree,sort_keys=True,separators=(',',':')).encode()).hexdigest()}
  (out/'production-file-smoke-build-identity.json').write_text(json.dumps(identity,indent=2)+'\n');print('BUILD IDENTITY',identity['aggregateBuildIdentitySha256'],flush=True)
