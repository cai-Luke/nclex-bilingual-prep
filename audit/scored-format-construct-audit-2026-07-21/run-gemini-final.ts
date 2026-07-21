import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root=dirname(fileURLToPath(import.meta.url));
const batches=Array.from({length:23},(_,i)=>String(i+1).padStart(2,"0"));
const prompt=`You are the independent non-GPT final checker. Stdin is compact JSONL. Each row contains an already-frozen blind result, then the live key/rationale/strategy/source, and finally the primary audit result. Do not alter the blind derivation. First compare frozen answer with key and decide whether rationale/source cure or confirm any construct issue. Distinguish factual support from exact response-demand support. Then assign checkerVerdict PASS/FIX/RETIRE/REVIEW; checkerClass must be VALID_CONSTRUCT or a closed audit defect class; checkerDisposition must be KEEP/BOUNDED_TEXT_REPAIR/FULL_ITEM_REWRITE_SAME_CONSTRUCT/RETIRE_WITHOUT_REPLACEMENT/RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED/OWNER_OR_CLINICAL_ADJUDICATION. Only then compare with primary. agreementStatus AGREE only if verdict/class/disposition materially agree, DISAGREE for PASS-versus-adverse or retirement disagreement, otherwise PARTIAL. Return ONLY compact JSONL one line per input row, no markdown. Fields: populationIndex,id,checkerModelHarness,checkerVerdict,checkerClass,checkerDisposition,keyComparison,sourceVerification,agreementStatus,disagreementExplanation,ownerDecisionRequirement,reason.`;
function count(p:string){return readFileSync(p,"utf8").trim().split("\n").length}
function run(n:string){return new Promise<void>((resolve,reject)=>{
 const inp=join(root,"checker-batches",`final3-input-${n}.jsonl`),out=join(root,"checker-batches",`final3-output-${n}.jsonl`),input=readFileSync(inp,"utf8");
 if(existsSync(out)&&count(out)===count(inp)){resolve();return}
 const p=spawn("gemini",["--skip-trust","--approval-mode","plan","-o","text","-p",prompt],{cwd:root,stdio:["pipe","pipe","pipe"]});
 let stdout="",stderr="";p.stdout.on("data",d=>stdout+=d);p.stderr.on("data",d=>stderr+=d);p.stdin.end(input);
 p.on("exit",code=>{try{
  if(code!==0)throw new Error(`exit ${code}: ${stderr}`);
  const parsed=stdout.split("\n").map(x=>x.trim()).filter(x=>x.startsWith("{")).map(JSON.parse);
  const expected=input.trim().split("\n").map(JSON.parse);
  if(parsed.length!==expected.length)throw new Error(`count ${parsed.length}/${expected.length}; ${stdout}`);
  expected.forEach((x,i)=>{if(x.id!==parsed[i].id||x.populationIndex!==parsed[i].populationIndex)throw new Error(`identity ${n}/${i}`)});
  writeFileSync(out,parsed.map(JSON.stringify).join("\n")+"\n");resolve();
 }catch(e){reject(e)}});
})}
for(let i=0;i<batches.length;i+=3)await Promise.all(batches.slice(i,i+3).map(run));
console.log("final checker complete: 67 rows / 23 files");
