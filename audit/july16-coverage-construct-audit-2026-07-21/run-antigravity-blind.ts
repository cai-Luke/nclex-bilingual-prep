import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root=dirname(fileURLToPath(import.meta.url));
const batches=Array.from({length:12},(_,i)=>String(i+1).padStart(2,"0"));
const prompt=(n:string)=>`Read ONLY checker-batches/blind6-input-${n}.jsonl. You are the independent non-GPT blind checker. For each row derive concrete answer IDs before seeing any key, assess uniqueness, plausible alternatives, and whether the assigned format tests worthwhile NCLEX-RN/nursing judgment. Adversarially reject noncompeting bowties, trivial label recall, stem-disclosed total sequences, mechanical dropdown blanks, overly specialist constructs, and answer-bearing policy recitals. Write compact JSONL to checker-batches/blind6-output-${n}.jsonl, exactly one line per input row in order. Fields: populationIndex,id,blindDerivedAnswer,blindUniqueness,plausibleAlternativeAnswers,provisionalVerdict,provisionalClass,provisionalDisposition,reason. Ordered response also needs dependencyGraph and defensibleOrderCount; dropdown also needs independentInference. Verdict must be PASS/FIX/RETIRE/REVIEW. Make no other write and verify count.`;
const count=(p:string)=>readFileSync(p,"utf8").trim().split("\n").filter(Boolean).length;
function run(n:string){return new Promise<void>((resolve,reject)=>{
  const inp=join(root,"checker-batches",`blind6-input-${n}.jsonl`),out=join(root,"checker-batches",`blind6-output-${n}.jsonl`);
  if(existsSync(out)&&count(out)===count(inp)){resolve();return;}
  const log=join(root,"checker-batches",`antigravity-${n}.log`);
  const child=spawn("agy",["-p",prompt(n),"--model","gemini-3.1-pro-high","--mode","accept-edits","--effort","high","--dangerously-skip-permissions","--log-file",log,"--print-timeout","8m"],{cwd:root,stdio:["ignore","pipe","pipe"]});
  let output="";child.stdout.on("data",d=>output+=d);child.stderr.on("data",d=>output+=d);
  child.on("exit",code=>code===0&&existsSync(out)&&count(out)===count(inp)?resolve():reject(new Error(`batch ${n} failed ${code}: ${output}`)));
})}
for(let i=0;i<batches.length;i+=3) await Promise.all(batches.slice(i,i+3).map(run));
console.log("Antigravity blind checker complete: 72 rows / 12 files");
