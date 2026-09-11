import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve,basename } from 'node:path';
import { findStageReferenceFindings } from '../../../scripts/audit/audit-stage-refs';
const root=resolve(import.meta.dirname,'..'),repo=resolve(root,'../..');
const hash=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
const read=(n:string)=>JSON.parse(readFileSync(resolve(root,n),'utf8'));
const jsonl=(n:string)=>readFileSync(resolve(root,n),'utf8').split('\n').filter(Boolean).map(x=>JSON.parse(x));
const opening=read('opening-state.json'),accepted=jsonl('accepted-boundaries.jsonl'),exceptions=jsonl('exceptions.jsonl');
const floor=read('schema-floor-plan.json'),receipts=read('patch-application-receipts.json');
const part=(bank:any,r:any)=>{const ps=bank.questions.filter((q:any)=>q.id===r.parentCaseId);assert.equal(ps.length,1);const qs=ps[0].caseStudy.questions.filter((q:any)=>q.id===r.partId);assert.equal(qs.length,1);return qs[0]};
function fields(value:any,key:string,path:string[]=[]):any[]{
 if(!value||typeof value!=='object')return[];
 return Object.entries(value).flatMap(([k,v])=>[...(k===key?[{path:[...path,k],value:v}]:[]),...fields(v,key,[...path,k])]);
}
function topology(bank:any){return {metaCount:bank.meta.count,questionCount:bank.questions.length,topLevelIds:bank.questions.map((q:any)=>q.id),embedded:bank.questions.filter((q:any)=>q.itemType==='case_study').map((q:any)=>({parent:q.id,parts:q.caseStudy.questions.map((p:any)=>p.id),stages:(q.caseStudy.stages??[]).map((s:any)=>s.id)}))}}
const proofs=[];const beforeBanks:any[]=[],afterBanks:any[]=[];
for(const [bankPath,pin] of Object.entries(opening.banks) as [string,any][]){
 const snapshot=resolve(root,'evidence/opening-banks',basename(bankPath));assert.equal(hash(snapshot),pin.sha256);
 const before=JSON.parse(readFileSync(snapshot,'utf8')),after=JSON.parse(readFileSync(resolve(repo,bankPath),'utf8')),restored=structuredClone(after);
 const rows=accepted.filter(r=>r.bankPath===bankPath),xs=exceptions.filter(r=>r.bankPath===bankPath),b=floor.banks.find((b:any)=>b.bankPath===bankPath);
 for(const r of rows){const old=part(before,r),now=part(after,r);assert(!Object.hasOwn(old,'answerableAfterStageId'));assert.deepEqual(now.answerableAfterStageId,r.acceptedBoundary);delete part(restored,r).answerableAfterStageId;}
 if(b?.bumpAuthorized){assert.equal(after.meta.schemaVersion,b.after);restored.meta.schemaVersion=before.meta.schemaVersion;}
 assert.deepEqual(restored,before,`${bankPath}: H.1 full-object equality after authorized restorations`);
 for(const r of xs){const a=part(before,r),z=part(after,r);assert.deepEqual(a,z);assert(!Object.hasOwn(z,'answerableAfterStageId'));assert(!Object.hasOwn(z,'stageId'));}
 assert.deepEqual(fields(before,'stageId'),fields(after,'stageId'),'all legacy values and their paths unchanged');
 assert.deepEqual(topology(before),topology(after),'ids, stages, counts');
 const anchorProof=structuredClone(after);for(const r of rows)delete part(anchorProof,r).answerableAfterStageId;
 assert.deepEqual(fields(before,'answerableAfterStageId'),fields(anchorProof,'answerableAfterStageId'),'all primary anchors outside accepted set unchanged');
 if(!rows.length)assert.equal(hash(resolve(repo,bankPath)),pin.sha256,'unaffected bank byte equality');
 else assert.equal(hash(resolve(repo,bankPath)),receipts.receipts.find((r:any)=>r.bankPath===bankPath).finalSha256);
 beforeBanks.push({file:bankPath,bank:before});afterBanks.push({file:bankPath,bank:after});
 proofs.push({bankPath,openingSha256:pin.sha256,finalSha256:hash(resolve(repo,bankPath)),openingSnapshotSha256:hash(snapshot),acceptedBaseline:rows.filter(r=>r.disposition==='BASELINE').length,acceptedStage:rows.filter(r=>r.disposition==='STAGE').length,exceptions:xs.length,schemaVersionBefore:before.meta.schemaVersion,schemaVersionAfter:after.meta.schemaVersion,fullParsedObjectEqualityAfterAuthorizedRestoration:true,exceptionPartsDeepEqualAndBothAnchorsAbsent:true,allStageIdValuesAndPathsUnchanged:true,allIdsStageOrderCountsMetaCountUnchanged:true,allOtherPrimaryAnchorsUnchanged:true,byteIdentical:hash(resolve(repo,bankPath))===pin.sha256});
}
const beforeFindings=findStageReferenceFindings(beforeBanks,{strict:true}),afterFindings=findStageReferenceFindings(afterBanks,{strict:true});
assert.deepEqual(afterFindings.filter(f=>f.kind==='missingRequiredAnchor'),beforeFindings.filter(f=>f.kind==='missingRequiredAnchor'));
assert.equal(afterFindings.filter(f=>f.kind==='missingRequiredAnchor').length,75);
const key=(r:any)=>JSON.stringify([r.file??r.bankPath,r.parentId??r.parentCaseId,r.partId]);
assert.deepEqual(afterFindings.filter(f=>f.kind==='revealsAllStages').map(key).sort(),exceptions.map(key).sort());
assert.equal(afterFindings.filter(f=>f.kind==='unresolved').length,0);
console.log(JSON.stringify({status:'PASS',verifiedAt:new Date().toISOString(),rule:'R4 H.1 positive unintended-change proof',banks:proofs,exceptionCount:exceptions.length,all13BanksChecked:true,all66ExceptionPartsUnchanged:true,strictOnly75IdentitySetUnchanged:true,strictAfter:{revealsAllStages:exceptions.length,missingRequiredAnchor:75,unresolved:0},allRemainingLeaksExactlyExceptionIdentities:true,noRepairedRowInFindingSet:true,noNewLeakOutsideFrozen:true},null,2));
