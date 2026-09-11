from pathlib import Path
import json,hashlib,copy,subprocess,re
r=Path(__file__).resolve().parents[1];repo=r.parents[1]
j=lambda p:json.loads(p.read_text());h=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
old=j(r/'evidence/opening-census.json');new=j(repo/'census.json');plan=j(r/'schema-floor-plan.json');expected=copy.deepcopy(old)
changes={Path(b['bankPath']).name:b for b in plan['banks'] if b['bumpAuthorized']}
for p in expected['sessionUnits']['perFile']:
 if p['file'] in changes:
  assert p['schemaVersion']==changes[p['file']]['before'];p['schemaVersion']=changes[p['file']]['after']
groups={}
for p in expected['sessionUnits']['perFile']:
 g=groups.setdefault(p['schemaVersion'],{'questions':0,'files':[]});g['questions']+=p['questionsLength'];g['files'].append(p['file'])
expected['sessionUnits']['bySchemaVersion']=groups
assert new['inputGitSha']==j(r/'opening-state.json')['head']
expected['generatedAt']=new['generatedAt'];expected['inputGitSha']=new['inputGitSha'];assert expected==new,'CENSUS_EXCEEDS_SCHEMA_COMPOSITION'
oldmd=(r/'evidence/opening-BANK-CENSUS.md').read_text();expectedmd=oldmd.replace('Generated: '+old['generatedAt'],'Generated: '+new['generatedAt']).replace('Input Git SHA: '+old['inputGitSha'],'Input Git SHA: '+new['inputGitSha'])
for f,b in changes.items():expectedmd=expectedmd.replace('| '+f+' | '+b['before']+' |','| '+f+' | '+b['after']+' |')
def section(groups):return '\n'.join(f'- Schema v{v}: {g["questions"]} session units ({", ".join(g["files"])})' for v,g in groups.items())
expectedmd=expectedmd.replace(section(old['sessionUnits']['bySchemaVersion']),section(groups));assert expectedmd==(repo/'BANK-CENSUS.md').read_text(),'MARKDOWN_CENSUS_UNEXPECTED_DIFF'
diff=subprocess.check_output(['git','diff','--','census.json','BANK-CENSUS.md'],cwd=repo,text=True);(r/'evidence/census-reviewed.diff').write_text(diff)
receipt={'status':'PASS_EXECUTOR_DETERMINISTIC_RECONCILIATION','rule':'R4 H.3','openingCheckExitCode':j(r/'evidence/verification-census-before.json')[0]['exitCode'],'regenerateExitCode':j(r/'evidence/verification-census-generate.json')[0]['exitCode'],'schemaMovementByBank':list(changes.values()),'compositionBefore':old['sessionUnits']['bySchemaVersion'],'compositionAfter':groups,'fullJsonEqualToOpeningPlusOnlyApprovedVersionCompositionAndGeneratorMetadata':True,'fullMarkdownEqualToExpectedTransform':True,'generatorMetadataMovement':{k:{'before':old[k],'after':new[k]} for k in ['generatedAt','inputGitSha']},'questionAndContentCountDrift':False,'unchangedTotals':{k:new['sessionUnits'][k] for k in ['total','standalone','caseContainers','embeddedParts','inventoryRecords']},'scoredLeavesAndVisualArtifactsEntireObjectsUnchanged':old['scoredLeaves']==new['scoredLeaves'] and old['visualArtifacts']==new['visualArtifacts'],'artifacts':{p:{'openingSha256':h(r/'evidence'/('opening-'+p)),'finalSha256':h(repo/p)} for p in ['census.json','BANK-CENSUS.md']},'reviewedDiffSha256':h(r/'evidence/census-reviewed.diff'),'producerIndependentCheckerConfirmation':{'status':'PENDING_BEFORE_ACCEPTANCE','requiredSeat':'Claude Code / Claude Opus 5','scope':'Confirm reviewed schema-version composition matches the accepted repair; executor reconciliation does not claim this independent confirmation.'},'publication':'No Git mutation; generated artifacts prepared for later authorized publication.'}
assert receipt['openingCheckExitCode']==1 and receipt['regenerateExitCode']==0
(r/'census-reconciliation.json').write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps({'status':receipt['status'],'totals':receipt['unchangedTotals'],'onlyApprovedSchemaComposition':True},indent=2))
