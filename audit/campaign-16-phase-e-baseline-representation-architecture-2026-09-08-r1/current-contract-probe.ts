// Investigation of unchanged live functions only. No proposed resolver or patch operations.
import { getVisibleCaseStages } from '../../src/examLayout';
import { validateBankObject } from '../../src/schema';
import { toExportEnvelope, importQuestionsFromText } from '../../src/bankImport';
import { findStageReferenceFindings } from '../../scripts/audit/audit-stage-refs';
import assert from 'node:assert/strict';
const pair = { en: 'Fixture.', zh: '测试。' };
const leaf = (id: string, refs = {}) => ({id,itemType:'fill_in_blank',category:'Management of Care',topic:'fixture',difficulty:'medium',stem:pair,blanks:[{id:'b1',prompt:pair,acceptable:['1']}],rationale:{correct:pair},testTakingStrategy:pair,glossary:[],...refs});
const token = '@@case-baseline';
const inputs = [
 ['absent', {}], ['empty', {answerableAfterStageId:''}], ['whitespace', {answerableAfterStageId:' '}],
 ['null', {answerableAfterStageId:null}], ['number', {answerableAfterStageId:0}], ['object', {answerableAfterStageId:{kind:'baseline'}}],
 ['ordinary', {answerableAfterStageId:'s1'}], ['proposed-token-currently-unknown', {answerableAfterStageId:token}],
 ['unknown', {answerableAfterStageId:'typo'}], ['stale', {answerableAfterStageId:'deleted_s3'}],
 ['legacy', {stageId:'s1'}], ['unknown-primary-valid-legacy', {answerableAfterStageId:'typo',stageId:'s1'}],
 ['invalid-primary-valid-legacy', {answerableAfterStageId:null,stageId:'s1'}],
 ['literal-baseline-currently-unknown', {answerableAfterStageId:'baseline'}],
 ['token-in-legacy', {stageId:token}], ['token-real-stage-collision', {answerableAfterStageId:token}],
] as const;
const results = inputs.map(([name,refs]) => {
 const stages = ['s1','s2'].map((id,i)=>({id:name==='token-real-stage-collision'&&i===0?token:id,title:pair,exhibits:[{id:'ex'+i,title:pair,content:pair}]}));
 const q:any={...leaf('case'),itemType:'case_study',caseStudy:{title:pair,exhibits:[{id:'global',title:pair,content:pair}],stages,questions:[leaf('p1',refs),leaf('p2',{answerableAfterStageId:'s2'})]}};
 delete q.blanks;
 const bank:any={meta:{schemaVersion:'1.6',count:1},questions:[q]};
 const validation=validateBankObject(bank,{rejectUnknownKeys:true,requireMeta:true});
 const findings=findStageReferenceFindings([{file:'fixture',bank}],{strict:true}).filter(f=>f.partId==='p1').map(f=>f.kind);
 const visible=getVisibleCaseStages(q,q.caseStudy.questions[0]).map(s=>s.id);
 if(name==='ordinary') { assert.deepEqual(visible,['s1']); assert.equal(validation.ok,true); }
 if(name==='proposed-token-currently-unknown') assert.equal(validation.ok,true);
 if(name==='unknown'||name==='proposed-token-currently-unknown') assert.deepEqual(visible,['s1','s2']);
 if(name==='unknown-primary-valid-legacy') assert.deepEqual(visible,['s1']);
 if(name==='null') assert.equal(validation.ok,false);
 const exported=toExportEnvelope([q]);
 const imported=importQuestionsFromText(JSON.stringify(bank),new Set(),'probe');
 return {name,refs,validation:validation.ok?'PASS':validation.reasons,directStrictFindings:findings,visible,exportFloor:exported.meta?.schemaVersion,imported:imported.summary.imported};
});
const synthetic:any={...leaf('case'),itemType:'case_study',caseStudy:{title:pair,exhibits:[{id:'global',title:pair,content:pair}],stages:[{id:'empty-baseline',title:pair,exhibits:[]}],questions:[leaf('p1'),leaf('p2')]}};
const syntheticValidation=validateBankObject({meta:{schemaVersion:'1.6',count:1},questions:[synthetic]});
assert.equal(syntheticValidation.ok,false);
console.log(JSON.stringify({note:'Observed unchanged live code; malformed direct findings bypass CLI validation for diagnosis, not an accepted gate result.',results,syntheticValidation},null,2));
