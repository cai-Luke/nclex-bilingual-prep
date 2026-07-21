import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root=dirname(fileURLToPath(import.meta.url));
const read=(p:string)=>readFileSync(p,"utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const primary=read(join(root,"primary-adjudication.jsonl")),checkerPop=read(join(root,"checker-population.jsonl"));
const pmap=new Map(primary.map((x:any)=>[x.id,x]));
const rows:any[]=[];
const validClasses=new Set(["VALID_CONSTRUCT","ARBITRARY_SERIALIZATION","PARALLEL_PROCESS_FORCED_SEQUENCE","UNCLOSED_BRANCH","MULTIPLE_VALID_KEYS","MECHANICAL_CLOZE_DEPENDENCY","INVENTED_EXTRA_INFERENCE","UNSUPPORTED_OR_CIRCULAR_NEXT_STEP","SCENARIO_CONTRADICTION","COMPLICATION_COLLAGE","MIXED_RESPONSE_HORIZONS","WEAK_OR_NONCOMPETING_DIFFERENTIAL","ACTION_PARAMETER_PHASE_MISMATCH","UNBOUNDED_OR_SELF_REVEALING_HIGHLIGHT","CALCULATION_WITHOUT_CLINICAL_VALUE","NON_NURSING_OR_OVERLY_SPECIALIST_CONSTRUCT","SOURCE_INSUFFICIENCY","ANSWER_TELEGRAPHING_OR_AUTHORIAL_COMPENSATION","BILINGUAL_MATERIAL_DIVERGENCE","OTHER_CONFIRMED_CONSTRUCT_DEFECT","UNRESOLVED_CLINICAL_OR_PROTOCOL_AMBIGUITY"]);
for(let i=1;i<=23;i++){
 const n=String(i).padStart(2,"0"),out=read(join(root,"checker-batches",`final3-output-${n}.jsonl`));
 for(const raw of out){
  const p:any=pmap.get(raw.id);if(!p)throw new Error(`unknown ${raw.id}`);
  let checkerClass=validClasses.has(raw.checkerClass)?raw.checkerClass:"OTHER_CONFIRMED_CONSTRUCT_DEFECT";
  if(raw.checkerVerdict==="PASS")checkerClass="VALID_CONSTRUCT";
  let agreementStatus:string;
  if(raw.checkerVerdict===p.verdict&&checkerClass===p.primaryClass&&raw.checkerDisposition===p.nextDisposition)agreementStatus="AGREE";
  else if((raw.checkerVerdict==="PASS")!==(p.verdict==="PASS")||((raw.checkerVerdict==="RETIRE"||p.verdict==="RETIRE")&&raw.checkerVerdict!==p.verdict))agreementStatus="DISAGREE";
  else agreementStatus="PARTIAL";
  const keyText=String(raw.keyComparison||"");
  const sourceText=String(raw.sourceVerification||"SOURCE_UNAVAILABLE");
  let sourceVerificationResult="SUPPORTED";
  if(/unavailable|not supported/i.test(sourceText))sourceVerificationResult="SOURCE_UNAVAILABLE";
  else if(/partial|lack|does not|do not mandate|conflict|but |however|construct|trivial|removes|strips|specialist|telegraph/i.test(sourceText))sourceVerificationResult="PARTIALLY_SUPPORTED";
  let keyComparison="MATCH";
  if(/excluding option A|inverted the first two|CONTESTED|disagree/i.test(keyText))keyComparison="DISAGREES";
  else if(/PARTIAL_MATCH|lacks a uniquely|requires molecular/i.test(keyText)||raw.id==="gpt_format11c_microcytic_anemia_localization")keyComparison="PARTIAL_MATCH";
  const disagreementExplanation=agreementStatus==="AGREE"?"":String(raw.disagreementExplanation||`Checker ${raw.checkerVerdict}/${checkerClass}/${raw.checkerDisposition}; primary ${p.verdict}/${p.primaryClass}/${p.nextDisposition}.`);
  rows.push({populationIndex:raw.populationIndex,id:raw.id,provenanceFamily:p.provenanceFamily,subBatch:p.subBatch,itemType:p.itemType,
    checkerModelHarness:i<=3?"Google Antigravity / Gemini 3.1 Pro":"Gemini CLI / Gemini 3.6 Flash",
    checkerVerdict:raw.checkerVerdict,checkerClass,checkerDisposition:raw.checkerDisposition,keyComparison,checkerRawKeyComparison:keyText,
    sourceVerification:sourceText,sourceVerificationResult,agreementStatus,disagreementExplanation,
    ownerDecisionRequirement:(agreementStatus!=="AGREE"||raw.checkerVerdict==="RETIRE"||p.verdict==="RETIRE")?"REQUIRED":"NOT_REQUIRED",
    reason:String(raw.reason||""),primaryVerdict:p.verdict,primaryClass:p.primaryClass,primaryDisposition:p.nextDisposition});
 }
}
if(rows.length!==67||new Set(rows.map(x=>x.id)).size!==67)throw new Error("checker row reconciliation");
const expected=checkerPop.map((x:any)=>x.id);expected.forEach((id:string,i:number)=>{if(rows[i].id!==id)throw new Error(`order ${i}: ${rows[i].id}/${id}`)});
writeFileSync(join(root,"checker-adjudication.jsonl"),rows.map(JSON.stringify).join("\n")+"\n");
const count=(k:string)=>Object.fromEntries([...new Set(rows.map(x=>x[k]))].sort().map(v=>[v,rows.filter(x=>x[k]===v).length]));
console.log(JSON.stringify({rows:rows.length,verdict:count("checkerVerdict"),agreement:count("agreementStatus"),keyComparison:count("keyComparison")},null,2));
