import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root=dirname(fileURLToPath(import.meta.url)),read=(p:string)=>readFileSync(p,"utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const primary=read(join(root,"primary-adjudication.jsonl")),checkerPop=read(join(root,"checker-population.jsonl")),pmap=new Map(primary.map((x:any)=>[x.id,x]));
const validClasses=new Set(["VALID_CONSTRUCT","WEAK_OR_NONCOMPETING_DIFFERENTIAL","ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION","MECHANICAL_CLOZE_DEPENDENCY","NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT","OTHER_CONFIRMED_CONSTRUCT_DEFECT","MULTIPLE_VALID_KEYS","SOURCE_INSUFFICIENCY","BILINGUAL_MATERIAL_DIVERGENCE"]);
const validDispositions=new Set(["KEEP","BOUNDED_TEXT_REPAIR","FULL_ITEM_REWRITE_SAME_CONSTRUCT","RETIRE_WITHOUT_REPLACEMENT","RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED","OWNER_OR_CLINICAL_ADJUDICATION"]);
const rows:any[]=[];
for(let i=1;i<=12;i++)for(const raw of read(join(root,"checker-batches",`final6-output-${String(i).padStart(2,"0")}.jsonl`))){
  const p:any=pmap.get(raw.id);if(!p)throw new Error(`Unknown ${raw.id}`);
  let cls=validClasses.has(raw.checkerClass)?raw.checkerClass:"OTHER_CONFIRMED_CONSTRUCT_DEFECT";if(raw.checkerVerdict==="PASS")cls="VALID_CONSTRUCT";
  let disp=validDispositions.has(raw.checkerDisposition)?raw.checkerDisposition:(raw.checkerVerdict==="PASS"?"KEEP":"OWNER_OR_CLINICAL_ADJUDICATION");
  let agreement:string;if(raw.checkerVerdict===p.verdict&&cls===p.primaryClass&&disp===p.nextDisposition)agreement="AGREE";else if((raw.checkerVerdict==="PASS")!==(p.verdict==="PASS")||((raw.checkerVerdict==="RETIRE"||p.verdict==="RETIRE")&&raw.checkerVerdict!==p.verdict))agreement="DISAGREE";else agreement="PARTIAL";
  const sourceText=String(raw.sourceVerification||"SOURCE_UNAVAILABLE"),keyText=String(raw.keyComparison||"");
  const sourceResult=/not supported|unavailable/i.test(sourceText)?"SOURCE_UNAVAILABLE":/partial|does not|construct|telegraph|specialist|but|however/i.test(sourceText)?"PARTIALLY_SUPPORTED":"SUPPORTED";
  const keyComparison=/disagree|mismatch|not match/i.test(keyText)?"DISAGREES":/partial/i.test(keyText)?"PARTIAL_MATCH":"MATCH";
  rows.push({populationIndex:raw.populationIndex,id:raw.id,provenanceFamily:p.provenanceFamily,subBatch:p.subBatch,itemType:p.itemType,checkerModelHarness:"Antigravity Gemini 3.1 Pro blind / Gemini CLI 3.6 Flash reveal",checkerVerdict:raw.checkerVerdict,checkerClass:cls,checkerDisposition:disp,keyComparison,checkerRawKeyComparison:keyText,sourceVerification:sourceText,sourceVerificationResult:sourceResult,agreementStatus:agreement,disagreementExplanation:agreement==="AGREE"?"":String(raw.disagreementExplanation||`Checker ${raw.checkerVerdict}/${cls}/${disp}; primary ${p.verdict}/${p.primaryClass}/${p.nextDisposition}.`),ownerDecisionRequirement:(agreement!=="AGREE"||raw.checkerVerdict==="RETIRE"||p.verdict==="RETIRE")?"REQUIRED":"NOT_REQUIRED",reason:String(raw.reason||""),primaryVerdict:p.verdict,primaryClass:p.primaryClass,primaryDisposition:p.nextDisposition});
}
if(rows.length!==72||new Set(rows.map(x=>x.id)).size!==72)throw new Error("Checker reconciliation");checkerPop.forEach((x:any,i:number)=>{if(rows[i].id!==x.id)throw new Error(`Order ${i}`)});
writeFileSync(join(root,"checker-adjudication.jsonl"),rows.map(JSON.stringify).join("\n")+"\n");
const count=(k:string)=>Object.fromEntries([...new Set(rows.map(x=>x[k]))].sort().map(v=>[v,rows.filter(x=>x[k]===v).length]));
console.log(JSON.stringify({rows:rows.length,verdict:count("checkerVerdict"),agreement:count("agreementStatus"),keyComparison:count("keyComparison")},null,2));
