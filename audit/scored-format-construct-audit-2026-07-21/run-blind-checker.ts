import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root=dirname(fileURLToPath(import.meta.url));
const batches=Array.from({length:23},(_,i)=>String(i+1).padStart(2,"0"));
const prompt=(n:string)=>`Read ONLY checker-batches/blind3-input-${n}.jsonl. You are a non-GPT independent content checker. For each row derive the answer IDs before any key, assess uniqueness, plausible alternatives, and whether the assigned format tests worthwhile NCLEX-RN/nursing judgment. Adversarially reject noncompeting bowties, trivial vocabulary or formula transcription, arbitrary total sequences, mechanical or invented dropdown blanks, and incoherent highlights. Write compact JSONL to checker-batches/blind3-output-${n}.jsonl, exactly one line per input row in input order. Fields: populationIndex,id,blindDerivedAnswer,blindUniqueness,plausibleAlternativeAnswers,provisionalVerdict,provisionalClass,provisionalDisposition,reason. Ordered response also needs dependencyGraph and defensibleOrderCount; dropdown also needs independentInference. Verdict must be PASS/FIX/RETIRE/REVIEW. Do not read or write anything else.`;

function run(n:string){return new Promise<void>((resolve,reject)=>{
  const out=join(root,"checker-batches",`blind3-output-${n}.jsonl`);
  const expected=readFileSync(join(root,"checker-batches",`blind3-input-${n}.jsonl`),"utf8").trim().split("\n").length;
  if(existsSync(out)&&readFileSync(out,"utf8").trim().split("\n").length===expected){resolve();return;}
  const p=spawn("claude",["-p",prompt(n),"--model","opus","--effort","medium","--permission-mode","acceptEdits","--allowedTools","Read","--allowedTools","Write","--no-session-persistence"],{cwd:root,stdio:["ignore","pipe","pipe"]});
  let err="";p.stderr.on("data",d=>err+=d);p.on("exit",code=>code===0?resolve():reject(new Error(`batch ${n} exit ${code}: ${err}`)));
})}
for(let i=0;i<batches.length;i+=4) await Promise.all(batches.slice(i,i+4).map(run));
for(const n of batches){
  const input=readFileSync(join(root,"checker-batches",`blind3-input-${n}.jsonl`),"utf8").trim().split("\n").length;
  const out=join(root,"checker-batches",`blind3-output-${n}.jsonl`);
  if(!existsSync(out)) throw new Error(`missing ${out}`);
  const output=readFileSync(out,"utf8").trim().split("\n").length;
  if(input!==output) throw new Error(`count mismatch ${n}: ${input}/${output}`);
}
console.log("blind checker complete: 67 rows / 23 files");
