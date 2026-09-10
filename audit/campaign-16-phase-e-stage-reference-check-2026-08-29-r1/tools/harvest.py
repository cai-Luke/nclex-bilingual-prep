#!/usr/bin/env python3
"""Validate + lock every unlocked review file present. Never touches an already-locked one."""
import json,glob,os,sys,subprocess
CK='/Users/holemini/Desktop/Project Shrimp/audit/campaign-16-phase-e-stage-reference-check-2026-08-29-r1/'
sys.path.insert(0,CK+'tools')
from importlib import import_module
lr=import_module('lock-review'.replace('-','_')) if os.path.exists(CK+'tools/lock_review.py') else None
if lr is None:
    import importlib.util
    spec=importlib.util.spec_from_file_location('lockreview',CK+'tools/lock-review.py')
    lr=importlib.util.module_from_spec(spec); spec.loader.exec_module(lr)
agent={}
for l in open(CK+'dispatch-log.jsonl',encoding='utf-8'):
    l=l.strip()
    if not l: continue
    d=json.loads(l)
    if 'packetId' in d and 'agentId' in d: agent[d['packetId']]=d['agentId']
locked={json.loads(l)['packetId'] for l in open(CK+'semantic-contexts.jsonl',encoding='utf-8') if l.strip()}
res=[]
for f in sorted(glob.glob(CK+'reviews/*.jsonl')):
    pid=os.path.basename(f)[:-6]
    if pid in locked: continue
    r=lr.lock(pid,agent.get(pid),False,None)
    res.append(r); print(json.dumps(r,ensure_ascii=False))
if not res: print('nothing to harvest')
man=json.load(open(CK+'checker-packet-manifest.json'))
recs=[json.loads(l) for l in open(CK+'semantic-contexts.jsonl',encoding='utf-8') if l.strip()]
print(f"PROGRESS {len(recs)}/{len(man['packets'])} packets, {sum(x['output']['rowCount'] for x in recs)}/{man['targetCount']} rows")
