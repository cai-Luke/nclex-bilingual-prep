import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { getCorrectAnswer, gradeStandaloneQuestion, scoreStandaloneQuestion } from '../../../src/grading';
import type { StandaloneQuestion } from '../../../src/types';
const root=path.resolve('audit/campaign-17-residual-successor-2026-09-12-r1');
const hash=(file:string)=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const sources=JSON.parse(fs.readFileSync(path.join(root,'phase-c/sources.json'),'utf8'));
const sourceIds=new Set(sources.map((s:{id:string})=>s.id));
let pairCount=0, positiveControls=0, negativeControls=0;
const pairs=(value:unknown):void=>{
 if(Array.isArray(value)){value.forEach(pairs);return;}
 if(!value||typeof value!=='object')return;
 const o=value as Record<string,unknown>;
 if('en' in o||'zh' in o){assert.equal(typeof o.en,'string');assert.equal(typeof o.zh,'string');assert.ok((o.en as string).trim());assert.ok((o.zh as string).trim());pairCount++;}
 assert.ok(!('visual' in o),'No visuals permitted');
 Object.values(o).forEach(pairs);
};
const ids=new Set<string>();
const batches=[];
for(let batch=1;batch<=3;batch++){
 const relative=`phase-c/raw/gpt-2026-09-12-0609-t${batch}.json`;
 const file=path.join(root,relative), bank=JSON.parse(fs.readFileSync(file,'utf8'));
 assert.equal(bank.questions.length,6);assert.equal(bank.meta.count,6);assert.equal(bank.meta.schemaVersion,'2.0');
 const evidence=JSON.parse(fs.readFileSync(path.join(root,`phase-c/evidence/batch-${batch}.json`),'utf8')).items;
 const topics=new Set<string>(),formats=new Set<string>();
 const rows=[];
 for(const q of bank.questions as StandaloneQuestion[]){
  assert.ok(!ids.has(q.id));ids.add(q.id);
  assert.match(q.id,new RegExp(`^gpt_2026_09_12_0609_t${batch}_0[1-6]$`));
  assert.ok(['highlight','fill_in_blank','dropdown_cloze','bowtie'].includes(q.itemType));
  topics.add(q.topic);formats.add(q.itemType);pairs(q);
  const ev=evidence.find((e:{id:string})=>e.id===q.id);assert.ok(ev);
  assert.ok(ev.sourceIds.length>0);for(const id of ev.sourceIds)assert.ok(sourceIds.has(id),`missing source ${id}`);
  const correct=getCorrectAnswer(q);assert.ok(gradeStandaloneQuestion(q,correct),q.id);positiveControls++;
  assert.equal(gradeStandaloneQuestion(q,{}),false,q.id);negativeControls++;
  let variants=0;
  if(q.itemType==='fill_in_blank'){
   for(const b of q.blanks){
    if(b.acceptable)for(const text of b.acceptable){const a=structuredClone(correct);a.blanks![b.id]=` ${text.toUpperCase()} `;assert.ok(gradeStandaloneQuestion(q,a));positiveControls++;variants++;}
    const bad=structuredClone(correct);bad.blanks![b.id]=b.numeric?String(b.numeric.value+b.numeric.tolerance+1):'unrelated';assert.equal(gradeStandaloneQuestion(q,bad),false);negativeControls++;
   }
  }
  if(q.itemType==='highlight'){
   const selectable=q.highlight.segments.filter(s=>s.selectable);
   assert.ok(q.highlight.correct.length<selectable.length/2,'bounded minority selection');
   for(const s of selectable.filter(s=>!q.highlight.correct.includes(s.id))){assert.equal(gradeStandaloneQuestion(q,{segments:[...q.highlight.correct,s.id]}),false);negativeControls++;}
   for(const id of q.highlight.correct){assert.equal(gradeStandaloneQuestion(q,{segments:q.highlight.correct.filter(x=>x!==id)}),false);negativeControls++;}
  }
  if(q.itemType==='dropdown_cloze'){
   for(const d of q.dropdowns)for(const o of d.options.filter(o=>o.id!==d.correct)){const a=structuredClone(correct);a.dropdowns![d.id]=o.id;assert.equal(gradeStandaloneQuestion(q,a),false);negativeControls++;}
  }
  if(q.itemType==='bowtie'){
   for(const z of ['condition','actions','parameters'] as const){
    const zone=q.bowtie[z];const keyed=z==='condition'?[q.bowtie.condition.correct]:q.bowtie[z].correct;
    for(const t of zone.tokens.filter(t=>!keyed.includes(t.id))){const a=structuredClone(correct);a.bowtie![z]![0]=t.id;assert.equal(gradeStandaloneQuestion(q,a),false);negativeControls++;}
   }
  }
  rows.push({id:q.id,topic:q.topic,category:q.category,itemType:q.itemType,score:scoreStandaloneQuestion(q,correct),acceptedTextVariantsChecked:variants,sourceIds:ev.sourceIds});
 }
 assert.ok(topics.size>=4);assert.ok(formats.size>=2);
 batches.push({batch,file:relative,sha256:hash(file),items:rows,topicCount:topics.size,formatCount:formats.size,topics:[...topics],formats:[...formats],sata:'NO_SATA'});
}
assert.equal(ids.size,18);
const result={status:'PASS_MECHANICAL_PREFLIGHT_ONLY',independentReview:false,canonicalMutation:false,items:18,batches,pairCount,positiveControls,negativeControls,limitations:['Clinical accuracy, bilingual meaning, distractor quality and unique intended answers still require producer-independent review.','Generic bias audits report INSUFFICIENT for these small format-specific candidate sets; this is not broad distributional certification.']};
fs.writeFileSync(path.join(root,'phase-c/preflight.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:result.status,items:18,pairCount,positiveControls,negativeControls,batches:batches.map(b=>({batch:b.batch,topics:b.topicCount,formats:b.formatCount}))}));
