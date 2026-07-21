import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root=dirname(fileURLToPath(import.meta.url));
const batches=Array.from({length:23},(_,i)=>String(i+1).padStart(2,"0"));
const prompt=(n:string)=>`Read ONLY checker-batches/blind3-input-${n}.jsonl. You are the independent non-GPT blind checker. For each row derive concrete answer IDs before seeing any key, assess uniqueness, plausible alternatives, and whether the assigned format tests worthwhile NCLEX-RN/nursing judgment. Adversarially reject noncompeting bowties, trivial vocabulary/formula transcription, arbitrary total sequences, mechanical/invented dropdown blanks, and incoherent highlights. Write compact JSONL to checker-batches/blind3-output-${n}.jsonl, exactly one line per input row in order. Fields: populationIndex,id,blindDerivedAnswer,blindUniqueness,plausibleAlternativeAnswers,provisionalVerdict,provisionalClass,provisionalDisposition,reason. Ordered response also needs dependencyGraph and defensibleOrderCount; dropdown also needs independentInference. Verdict must be PASS/FIX/RETIRE/REVIEW. Use a closed audit defect class when adverse. Make no other write and verify count.`;
function count(p:string){return readFileSync(p,"utf8").trim().split("\n").length}
function run(n:string){return new Promise<void>((resolve,reject)=>{
 const inp=join(root,"checker-batches",`blind3-input-${n}.jsonl`),out=join(root,"checker-batches",`blind3-output-${n}.jsonl`);
 if(existsSync(out)&&count(out)===count(inp)){resolve();return}
 const p=spawn("agy",["-p",prompt(n),"--model","gemini-3.1-pro-high","--mode","accept-edits","--effort","high","--dangerously-skip-permissions"],{cwd:root,stdio:["ignore","pipe","pipe"]});
 let text="";p.stdout.on("data",d=>text+=d);p.stderr.on("data",d=>text+=d);p.on("exit",code=>code===0&&existsSync(out)&&count(out)===count(inp)?resolve():reject(new Error(`batch ${n} failed ${code}: ${text}`)));
})}
for(let i=0;i<batches.length;i+=3)await Promise.all(batches.slice(i,i+3).map(run));
console.log("blind checker complete: 67 rows / 23 files");
