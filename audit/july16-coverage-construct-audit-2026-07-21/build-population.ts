import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
type R=Record<string,any>;
const bankPath="banks/gpt-canonical.json",outputPath="audit/july16-coverage-construct-audit-2026-07-21/population.jsonl";
const families=[
 {pattern:/^gpt_mocsic_/,provenanceFamily:"MOC_SIC_COVERAGE_BATCH"},
 {pattern:/^gpt_balance2_/,provenanceFamily:"COVERAGE_BALANCE_BATCH_2"},
 {pattern:/^gpt_balance3_/,provenanceFamily:"COVERAGE_BALANCE_BATCH_3"},
 {pattern:/^gpt_balance5_/,provenanceFamily:"COVERAGE_BALANCE_BATCH_5"},
 {pattern:/^gpt_balance6a_/,provenanceFamily:"COVERAGE_BALANCE_BATCH_6A"},
 {pattern:/^gpt_balance6b_/,provenanceFamily:"COVERAGE_BALANCE_BATCH_6B"}
];
const expectedTypes={bowtie:29,dropdown_cloze:16,fill_in_blank:9,highlight:31,matrix:11,ordered_response:10,select_all:2};
const count=(xs:string[])=>xs.reduce((o:Record<string,number>,x)=>(o[x]=(o[x]||0)+1,o),{});
function structure(q:R):R{switch(q.itemType){
 case"ordered_response":case"select_all":return{options:q.options};
 case"fill_in_blank":return{blanks:q.blanks.map(({acceptable,numeric,...x}:R)=>x)};
 case"highlight":return{segments:q.highlight.segments};
 case"bowtie":return{condition:q.bowtie.condition.tokens,actions:q.bowtie.actions.tokens,parameters:q.bowtie.parameters.tokens};
 case"dropdown_cloze":return{clozeStem:q.clozeStem,dropdowns:q.dropdowns.map(({correct,...x}:R)=>x)};
 case"matrix":return{rows:q.matrix.rows,columns:q.matrix.columns,selectionMode:q.matrix.selectionMode};
 default:throw Error(`unexpected type ${q.itemType}`)}}
function key(q:R):R{switch(q.itemType){
 case"ordered_response":case"select_all":return{correct:q.correct};
 case"fill_in_blank":return{blanks:q.blanks.map((x:R)=>({id:x.id,acceptable:x.acceptable,numeric:x.numeric}))};
 case"highlight":return{correct:q.highlight.correct};
 case"bowtie":return{condition:q.bowtie.condition.correct,actions:q.bowtie.actions.correct,parameters:q.bowtie.parameters.correct};
 case"dropdown_cloze":return{dropdowns:q.dropdowns.map((x:R)=>({id:x.id,correct:x.correct}))};
 case"matrix":return{correct:q.correct};
 default:throw Error(`unexpected type ${q.itemType}`)}}
const bytes=readFileSync(resolve(bankPath)),bankSha256=createHash("sha256").update(bytes).digest("hex"),bank=JSON.parse(bytes.toString("utf8"));
const selected=bank.questions.flatMap((question:R,questionIndex:number)=>{const family=families.find(f=>f.pattern.test(question.id));return family?[{question,questionIndex,family}]:[]});
if(selected.length!==108)throw Error(`population ${selected.length}/108`);
if(new Set(selected.map((x:R)=>x.question.id)).size!==108)throw Error("duplicate id");
for(const f of families)if(selected.filter((x:R)=>x.family.provenanceFamily===f.provenanceFamily).length!==18)throw Error(`family count ${f.provenanceFamily}`);
if(JSON.stringify(Object.entries(count(selected.map((x:R)=>x.question.itemType))).sort())!==JSON.stringify(Object.entries(expectedTypes).sort()))throw Error(`type counts ${JSON.stringify(count(selected.map((x:R)=>x.question.itemType)))}`);
const rows=selected.map(({question:q,questionIndex,family}:R,i:number)=>({populationIndex:i+1,bankPath,bankSha256,questionIndex,questionPath:`questions[${questionIndex}]`,id:q.id,provenanceFamily:family.provenanceFamily,subBatch:family.provenanceFamily,itemType:q.itemType,category:q.category,topic:q.topic,difficulty:q.difficulty,ngnSkill:q.ngnSkill,stem:q.stem,responseStructure:structure(q),currentKey:key(q),rationale:q.rationale,testTakingStrategy:q.testTakingStrategy,glossary:q.glossary||[],sourceMetadata:q.meta?.source??q.source??null,completeItem:q}));
writeFileSync(resolve(outputPath),rows.map((x:R)=>JSON.stringify(x)).join("\n")+"\n");
console.log(JSON.stringify({outputPath,bankSha256,count:rows.length,types:count(rows.map((x:R)=>x.itemType))}));
