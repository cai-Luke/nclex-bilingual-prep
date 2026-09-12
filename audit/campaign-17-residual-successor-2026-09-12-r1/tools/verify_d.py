import pathlib,json,hashlib,collections
R=pathlib.Path(__file__).resolve().parents[1];D=R/'phase-d'
records=json.loads((D/'candidates.json').read_text());assert len(records)==3
assert len({r['id'] for r in records})==3
required=['id','disposition','asset','sourcePublisher','pageUrl','assetPageUrl','assetLocator','originalUrl','creatorCredit','license','file','privacy','clinicalConstruct','clinicalEvidence','necessity','altTextDraft','nextAction']
for r in records:
 for k in required:assert r.get(k),f'{r["id"]}:{k}'
 for k in ['name','evidenceUrl','locator','scopeReason','commercial','derivatives','attributionDraft']:assert r['license'].get(k),f'{r["id"]}:license:{k}'
 for k in ['observation','consentScope','metadata','remainingRisk']:assert r['privacy'].get(k),f'{r["id"]}:privacy:{k}'
 assert all(r['altTextDraft'].get(k) for k in ['en','zh'])
 assert r['disposition'] in ['ACQUIRE_CANDIDATE','HOLD_RIGHTS','REJECT']
counts=dict(collections.Counter(r['disposition'] for r in records));assert counts=={'ACQUIRE_CANDIDATE':1,'HOLD_RIGHTS':1,'REJECT':1}
scope=json.loads((D/'scope.json').read_text())
for name,h in scope['inputs'].items():assert hashlib.sha256(pathlib.Path(name).read_bytes()).hexdigest()==h,name
assert not [p for p in R.rglob('*') if p.suffix.lower() in ['.jpg','.jpeg','.png','.webp','.pdf','.gif']],'No clinical binary assets in campaign'
print(json.dumps({'status':'PASS_RECORD_COMPLETENESS_AND_SCOPE','records':3,'dispositions':counts,'repositoryInputHashes':len(scope['inputs']),'clinicalOrLegalCertification':False}))
