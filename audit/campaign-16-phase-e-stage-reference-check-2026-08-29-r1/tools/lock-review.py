#!/usr/bin/env python3
"""Validate, hash, freeze one checker review and append its honest semantic-context receipt.
Refuses to relock a packet whose recorded hash still matches (immutability of completed packets)."""
import json, hashlib, subprocess, sys, os, datetime
CK='/Users/holemini/Desktop/Project Shrimp/audit/campaign-16-phase-e-stage-reference-check-2026-08-29-r1/'
def sha(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for c in iter(lambda: f.read(1<<20),b''): h.update(c)
    return h.hexdigest()
def receipts():
    p=CK+'semantic-contexts.jsonl'
    if not os.path.exists(p): return []
    return [json.loads(l) for l in open(p,encoding='utf-8') if l.strip()]

def lock(pid, agent_id, retry_used, notes=None):
    out=CK+f'reviews/{pid}.jsonl'
    if not os.path.exists(out): return {'packetId':pid,'status':'MISSING_OUTPUT'}
    ex=[r for r in receipts() if r['packetId']==pid]
    if ex and ex[-1]['output']['sha256']==sha(out) and ex[-1]['validation']=='PASS':
        return {'packetId':pid,'status':'ALREADY_LOCKED_UNCHANGED'}
    r=subprocess.run(['npx','tsx',CK+'tools/validate-checker-output.ts','--packet',pid,'--input',out],
                     capture_output=True,text=True,cwd='/Users/holemini/Desktop/Project Shrimp')
    ok = r.returncode==0
    if not ok:
        return {'packetId':pid,'status':'VALIDATION_FAIL','errors':r.stderr.strip().splitlines()[:12]}
    rows=[json.loads(l) for l in open(out,encoding='utf-8') if l.strip()]
    man=json.load(open(CK+'checker-packet-manifest.json'))
    pk=next(p for p in man['packets'] if p['packetId']==pid)
    rec={
      'receiptVersion':'1.0','packetId':pid,
      'checkerPacket':{'path':pk['path'],'sha256':pk['sha256'],'targetCount':pk['targetCount']},
      'output':{'path':f'reviews/{pid}.jsonl','sha256':sha(out),'rowCount':len(rows)},
      'validation':'PASS','validator':'tools/validate-checker-output.ts',
      'validatorStdout':r.stdout.strip(),
      'boundedMechanicalRetryUsed':retry_used,
      'semanticContext':{
        'isolation':'one fresh Claude subagent context, exactly one checker packet',
        'harness':'Claude Code Agent tool, subagent_type "claude"',
        'agentId':agent_id,
        'sessionId':None,
        'model':None,
        'reasoningEffort':None,
        'metadataAvailability':'The Agent harness did not expose the resolved model identifier, session id, or reasoning-effort setting to the orchestration seat. Recorded as null rather than invented. The subagent was spawned with no model override, so it inherits the orchestration model unless a default subagent model is configured for this installation; that resolution was not observable here.'},
      'producerOutputExposed':False,
      'otherCheckerOutputExposed':False,
      'aggregateTotalsExposed':False,
      'lockedAtUtc':datetime.datetime.now(datetime.UTC).strftime('%Y-%m-%dT%H:%M:%SZ'),
    }
    if notes: rec['notes']=notes
    with open(CK+'semantic-contexts.jsonl','a',encoding='utf-8') as f:
        f.write(json.dumps(rec,ensure_ascii=False)+'\n')
    return {'packetId':pid,'status':'LOCKED','sha256':rec['output']['sha256'],'rows':len(rows)}

if __name__=='__main__':
    pid=sys.argv[1]; agent=sys.argv[2] if len(sys.argv)>2 else None
    retry=(len(sys.argv)>3 and sys.argv[3]=='retry')
    note=sys.argv[4] if len(sys.argv)>4 else None
    print(json.dumps(lock(pid,agent,retry,note),ensure_ascii=False))
