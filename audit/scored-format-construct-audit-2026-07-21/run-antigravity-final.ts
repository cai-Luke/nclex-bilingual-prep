import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root=dirname(fileURLToPath(import.meta.url));
const batches=Array.from({length:23},(_,i)=>String(i+1).padStart(2,"0"));
const prompt=(n:string)=>`You are the independent non-GPT final checker. Read ONLY checker-batches/final3-input-${n}.jsonl. Each row contains your already-frozen blind result, then the live key/rationale/strategy/source, and finally the primary audit result. Do not alter the blind derivation. First compare the frozen answer with the key and judge whether rationale/source cure or confirm the construct issue. Verify authoritative source sufficiency when the item is ordered response, dropdown, adverse, narrow-sequence/threshold/classification, or when a plausible alternative exists; distinguish factual support from exact response-demand support. Then independently assign checkerVerdict PASS/FIX/RETIRE/REVIEW, checkerClass using VALID_CONSTRUCT or the closed defect vocabulary, and checkerDisposition using KEEP/BOUNDED_TEXT_REPAIR/FULL_ITEM_REWRITE_SAME_CONSTRUCT/RETIRE_WITHOUT_REPLACEMENT/RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED/OWNER_OR_CLINICAL_ADJUDICATION. Only then compare with primary. agreementStatus must be AGREE if verdict/class/disposition materially agree, DISAGREE for PASS-versus-adverse or retirement disagreement, otherwise PARTIAL. Write exactly one compact JSON line per input row in order to checker-batches/final3-output-${n}.jsonl. Required fields: populationIndex,id,checkerModelHarness,checkerVerdict,checkerClass,checkerDisposition,keyComparison,sourceVerification,agreementStatus,disagreementExplanation,ownerDecisionRequirement,reason. Make no other write and verify output count.`;
function count(p:string){return readFileSync(p,"utf8").trim().split("\n").length}
function run(n:string){return new Promise<void>((resolve,reject)=>{
 const inp=join(root,"checker-batches",`final3-input-${n}.jsonl`),out=join(root,"checker-batches",`final3-output-${n}.jsonl`);
 if(existsSync(out)&&count(out)===count(inp)){resolve();return}
 const p=spawn("agy",["-p",prompt(n),"--model","gemini-3.6-flash-high","--mode","accept-edits","--effort","high","--dangerously-skip-permissions"],{cwd:root,stdio:["ignore","pipe","pipe"]});
 let text="";p.stdout.on("data",d=>text+=d);p.stderr.on("data",d=>text+=d);p.on("exit",code=>code===0&&existsSync(out)&&count(out)===count(inp)?resolve():reject(new Error(`batch ${n} failed ${code}: ${text}`)));
})}
for(let i=0;i<batches.length;i+=3)await Promise.all(batches.slice(i,i+3).map(run));
console.log("final checker complete: 67 rows / 23 files");
