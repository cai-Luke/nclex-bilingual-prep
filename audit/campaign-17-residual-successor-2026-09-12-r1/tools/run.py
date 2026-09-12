"""Run an exact argv, retain output and real return code; never treats failure as pass."""
import sys, subprocess, pathlib, json, datetime, hashlib
root=pathlib.Path(__file__).resolve().parents[1]
label=sys.argv[1]; argv=sys.argv[2:]
folder=root/'verification'; folder.mkdir(exist_ok=True)
started=datetime.datetime.now(datetime.timezone.utc).isoformat()
p=subprocess.run(argv,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
out=folder/(label+'.txt'); out.write_bytes(p.stdout)
receipt={'argv':argv,'cwd':str(pathlib.Path.cwd()),'startedAt':started,'finishedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'exitCode':p.returncode,'output':str(out.relative_to(root)),'outputSha256':hashlib.sha256(p.stdout).hexdigest()}
(folder/(label+'.json')).write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps(receipt)); print(p.stdout.decode(errors='replace')[-1600:])
sys.exit(p.returncode)
