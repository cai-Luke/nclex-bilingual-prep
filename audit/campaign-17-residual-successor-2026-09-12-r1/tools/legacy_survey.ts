/** Proposed migration only. All mutations are in-memory clones; canonical files are read-only. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,readdirSync,writeFileSync,mkdirSync} from 'node:fs';
import {findStageReferenceFindings} from '../../../scripts/audit/audit-stage-refs';
import {validateBankObject} from '../../../src/schema';
import {resolveCaseVisibilityBoundary} from '../../../src/caseVisibilityBoundary';
import {getVisibleCaseStages} from '../../../src/examLayout';

const R='audit/campaign-17-residual-successor-2026-09-12-r1';
const sha=(x:string|Buffer)=>createHash('sha256').update(x).digest('hex');
const canonical=(x:any):any=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const hash=(x:any)=>sha(JSON.stringify(canonical(x)));
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const write=(p:string,x:any)=>writeFileSync(`${R}/phase-b/${p}`,JSON.stringify(x,null,2)+'\n');
// Sequential commission: refuse to start the survey until A has a verified freeze.
const frozenA=read(`${R}/phase-a-freeze.json`);
for(const [p,h] of Object.entries(frozenA.artifacts))assert.equal(sha(readFileSync(`${R}/${p}`)),h,`Phase A drift: ${p}`);
const opening=read(`${R}/opening-state.json`);
for(const group of ['bankHashes','campaign16Hashes','authorityHashes'])for(const [p,h] of Object.entries(opening[group]))assert.equal(sha(readFileSync(p)),h,p);
const banks=readdirSync('banks').filter(f=>f.endsWith('.json')).sort().map(f=>({file:`banks/${f}`,bank:read(`banks/${f}`)}));
for(const b of banks)assert.equal(validateBankObject(b.bank).ok,true,b.file);
const strict=findStageReferenceFindings(banks,{strict:true});
const legacy=strict.filter(f=>f.kind==='missingRequiredAnchor');
const defaultBefore=findStageReferenceFindings(banks);
const aid=(f:any)=>[f.file??f.bankPath,f.parentId??f.parentCaseId,f.partId].join('|');
assert.deepEqual(strict.filter(f=>f.kind!=='missingRequiredAnchor'),defaultBefore);
const aIds=new Set(read(`${R}/phase-a/live-findings.json`).map(aid));
assert.ok(legacy.every(f=>!aIds.has(aid(f))),'Phase A/B identity overlap');

function eligible(parent:any,part:any){
 assert.ok(!Object.hasOwn(part,'answerableAfterStageId'),'primary is not absent');
 assert.equal(typeof part.stageId,'string');assert.ok(part.stageId.trim());
 const ids=parent.caseStudy.stages?.map((s:any)=>s.id)??[];
 assert.ok(ids.length>0);assert.equal(new Set(ids).size,ids.length,'ambiguous topology');
 assert.equal(ids.filter((x:string)=>x===part.stageId).length,1,'legacy does not resolve uniquely');
 assert.deepEqual(resolveCaseVisibilityBoundary(part,ids),{kind:'prefix',index:ids.indexOf(part.stageId),field:'stageId'});
}
const plans:any[]=[];const semantic:any[]=[];const parents=new Map<string,any>();
for(const f of legacy){
 const b=banks.find(b=>b.file===f.file)!;const qi=b.bank.questions.findIndex((q:any)=>q.id===f.parentId);const parent=b.bank.questions[qi];
 const pi=parent.caseStudy.questions.findIndex((p:any)=>p.id===f.partId);const part=parent.caseStudy.questions[pi];
 try{eligible(parent,part);}catch(error){semantic.push({finding:f,reason:String(error),disposition:'REQUIRES_SEPARATE_REVIEW'});continue;}
 const next=structuredClone(part);next.answerableAfterStageId=part.stageId;
 const ids=parent.caseStudy.stages.map((s:any)=>s.id);const before=resolveCaseVisibilityBoundary(part,ids);const after=resolveCaseVisibilityBoundary(next,ids);
 assert.deepEqual(getVisibleCaseStages(parent,part),getVisibleCaseStages(parent,next));
 assert.deepEqual(after,{kind:'prefix',index:ids.indexOf(part.stageId),field:'answerableAfterStageId'});
 plans.push({identity:aid(f),bankPath:f.file,parentCaseId:f.parentId,partId:f.partId,bankSha256:sha(readFileSync(f.file)),parentSha256:hash(parent),partSha256:hash(part),stageTopology:ids,stageTopologySha256:hash(ids),operation:{op:'add',path:`/questions/${qi}/caseStudy/questions/${pi}/answerableAfterStageId`,before:{present:false},value:part.stageId},preserveLegacyStageId:part.stageId,beforeResolution:before,afterResolution:after,visibleStageIds:getVisibleCaseStages(parent,part).map(s=>s.id),hiddenStageIds:ids.slice(ids.indexOf(part.stageId)+1),visiblePayloadSha256:hash(getVisibleCaseStages(parent,part)),classification:'DETERMINISTIC_SAME_VALUE_REPRESENTATION_CANDIDATE',semanticBoundaryCertification:false});
 parents.set(`${f.file}|${f.parentId}`,{bankPath:f.file,parentSha256:hash(parent),currentParent:parent});
}
function applyInMemory(input:any[],rows:any[]){
 assert.equal(rows.length,plans.length,'plan population changed');
 assert.deepEqual([...rows.map(x=>x.identity)].sort(),plans.map(x=>x.identity).sort(),'plan identity population changed');
 const output=structuredClone(input);
 for(const p of rows){
  const b=input.find(b=>b.file===p.bankPath);assert.ok(b);
  // JSON object hashes also catch changed whitespace-independent content in supplied clones.
  assert.equal(hash(b.bank),hash(banks.find(b=>b.file===p.bankPath)!.bank),'bank content drift');
  const original=b.bank.questions.find((q:any)=>q.id===p.parentCaseId);assert.ok(original);assert.equal(hash(original),p.parentSha256,'parent drift');
  const oldpart=original.caseStudy.questions.find((q:any)=>q.id===p.partId);assert.ok(oldpart);assert.equal(hash(oldpart),p.partSha256,'part drift');eligible(original,oldpart);
  assert.equal(p.operation.value,oldpart.stageId,'migration changes boundary value');
  const qi=b.bank.questions.indexOf(original),pi=original.caseStudy.questions.indexOf(oldpart);
  assert.equal(p.operation.path,`/questions/${qi}/caseStudy/questions/${pi}/answerableAfterStageId`,'wrong target path');
  assert.equal(p.operation.op,'add');assert.deepEqual(p.operation.before,{present:false});
  const target=output.find((b:any)=>b.file===p.bankPath)!.bank.questions[qi].caseStudy.questions[pi];
  assert.ok(!Object.hasOwn(target,'answerableAfterStageId'),'duplicate operation');target.answerableAfterStageId=p.operation.value;
 }
 return output;
}
function preserveAndCompare(afterBanks:any[]){
 const stripped=structuredClone(afterBanks);
 for(const p of plans){
  const parent=stripped.find((b:any)=>b.file===p.bankPath).bank.questions.find((q:any)=>q.id===p.parentCaseId);
  const part=parent.caseStudy.questions.find((q:any)=>q.id===p.partId);assert.equal(part.answerableAfterStageId,p.operation.value);delete part.answerableAfterStageId;
 }
 assert.deepEqual(stripped,banks,'non-anchor payload changed');
 for(const b of afterBanks){
  assert.equal(validateBankObject(b.bank).ok,true,`after schema: ${b.file}`);
  const old=banks.find(o=>o.file===b.file)!;
  b.bank.questions.forEach((parent:any,qi:number)=>{
   if(parent.itemType!=='case_study')return;
   parent.caseStudy.questions.forEach((part:any,pi:number)=>assert.deepEqual(getVisibleCaseStages(old.bank.questions[qi],old.bank.questions[qi].caseStudy.questions[pi]),getVisibleCaseStages(parent,part),`visibility drift: ${part.id}`));
  });
 }
 assert.deepEqual(findStageReferenceFindings(afterBanks),defaultBefore,'default behavior/output changed');
 assert.deepEqual(findStageReferenceFindings(afterBanks,{strict:true}),strict.filter(f=>!plans.some(p=>p.identity===aid(f)&&f.kind==='missingRequiredAnchor')),'unexpected strict finding delta');
}
const proposed=applyInMemory(banks,plans);preserveAndCompare(proposed);
// Negative controls deliberately violate eligibility, preconditions, scope or preservation.
const controls:string[]=[];
function rejects(name:string,fn:()=>unknown){assert.throws(fn,undefined,name);controls.push(name);}
const first=plans[0];assert.ok(first,'no deterministic candidate found');
const baseParent=banks.find(b=>b.file===first.bankPath)!.bank.questions.find((q:any)=>q.id===first.parentCaseId);
const basePart=baseParent.caseStudy.questions.find((q:any)=>q.id===first.partId);
for(const value of [null,'stale-primary',{kind:'baseline'}])rejects(`present primary ${JSON.stringify(value)}`,()=>eligible(baseParent,{...basePart,answerableAfterStageId:value}));
rejects('unresolved legacy',()=>eligible(baseParent,{...basePart,stageId:'absent-stage'}));
rejects('missing legacy',()=>eligible(baseParent,{...basePart,stageId:undefined}));
const dup=structuredClone(baseParent);dup.caseStudy.stages.push(structuredClone(dup.caseStudy.stages[0]));rejects('duplicate stage topology',()=>eligible(dup,basePart));
rejects('dropped plan',()=>applyInMemory(banks,plans.slice(1)));
const wrong=structuredClone(plans);wrong[0].operation.value='different-stage';rejects('changed proposed boundary',()=>applyInMemory(banks,wrong));
const reordered=structuredClone(banks);const rp=reordered.find((b:any)=>b.file===first.bankPath).bank.questions.find((q:any)=>q.id===first.parentCaseId);rp.caseStudy.stages.reverse();
rejects('reordered live topology',()=>applyInMemory(reordered,plans));
const changed=structuredClone(proposed);changed[0].bank.questions[0].stem={en:'changed',zh:'改变'};rejects('learner content mutation',()=>preserveAndCompare(changed));
const lost=structuredClone(proposed);const lp=lost.find((b:any)=>b.file===first.bankPath).bank.questions.find((q:any)=>q.id===first.parentCaseId);delete lp.caseStudy.questions.find((q:any)=>q.id===first.partId).stageId;rejects('legacy deletion',()=>preserveAndCompare(lost));
const lostPart=structuredClone(proposed);lostPart.find((b:any)=>b.file===first.bankPath).bank.questions.find((q:any)=>q.id===first.parentCaseId).caseStudy.questions.pop();rejects('part deletion',()=>preserveAndCompare(lostPart));
// Prove the field is not universally equivalent: a DIFFERENT resolving primary overrides legacy.
const ids=baseParent.caseStudy.stages.map((s:any)=>s.id);const other=ids.find((id:string)=>id!==basePart.stageId);assert.ok(other);
assert.notDeepEqual(getVisibleCaseStages(baseParent,basePart),getVisibleCaseStages(baseParent,{...basePart,answerableAfterStageId:other}));controls.push('different resolving primary changes visible prefix');
const malformed=structuredClone(banks);malformed.find((b:any)=>b.file===first.bankPath).bank.questions.find((q:any)=>q.id===first.parentCaseId).caseStudy.questions.find((q:any)=>q.id===first.partId).answerableAfterStageId={kind:'baseline',extra:true};
assert.equal(validateBankObject(malformed.find((b:any)=>b.file===first.bankPath).bank).ok,false);controls.push('validator rejects malformed primary object');
mkdirSync(`${R}/phase-b`,{recursive:true});
write('live-strict-findings.json',strict);write('patch-plan.json',plans);write('semantic-holds.json',semantic);write('parents.json',Array.from(parents.values()));
const counts=(rows:any[])=>Object.fromEntries([...new Set(rows.map(x=>x.kind))].map(k=>[k,rows.filter(x=>x.kind===k).length]));
write('survey.json',{terminal:'CAMPAIGN17_LEGACY_PRIMARY_SURVEY_READY',phaseAFrozenSha256:sha(readFileSync(`${R}/phase-a-freeze.json`)),liveStrictCounts:counts(strict),legacyRows:legacy.length,legacyParents:new Set(legacy.map(x=>x.file+'|'+x.parentId)).size,deterministicCandidates:plans.length,semanticHolds:semantic.length,affectedBanks:[...new Set(plans.map(p=>p.bankPath))],schemaVersions:Object.fromEntries(banks.filter(b=>plans.some(p=>p.bankPath===b.file)).map(b=>[b.file,b.bank.meta.schemaVersion])),proposedStrictCounts:counts(findStageReferenceFindings(proposed,{strict:true})),defaultFindingPayloadUnchanged:true,allCurrentPartVisibleStagePayloadsUnchanged:true,allNonAddedValuesUnchanged:true,noSchemaVersionChange:true,legacyValuesRetained:true,negativeControls:controls,independentReviewStillRequired:true,canonicalMutation:false,clinicalOrBoundaryCorrectnessCertified:false,codeHashes:Object.fromEntries(['src/types.ts','src/schema.ts','src/caseVisibilityBoundary.ts','src/examLayout.ts','src/bankImport.ts','src/allowedKeys.ts','scripts/audit/audit-stage-refs.ts'].map(p=>[p,sha(readFileSync(p))]))});
for(const group of ['bankHashes','campaign16Hashes','authorityHashes'])for(const [p,h] of Object.entries(opening[group]))assert.equal(sha(readFileSync(p)),h,p);
console.log(JSON.stringify(read(`${R}/phase-b/survey.json`),null,2));
