import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root=dirname(fileURLToPath(import.meta.url));
const rows:any[]=[];
for(let i=1;i<=23;i++){
  const n=String(i).padStart(2,"0");
  const input=readFileSync(join(root,"checker-batches",`blind3-input-${n}.jsonl`),"utf8").trim().split("\n").map(JSON.parse);
  const output=readFileSync(join(root,"checker-batches",`blind3-output-${n}.jsonl`),"utf8").trim().split("\n").map(JSON.parse);
  if(input.length!==output.length) throw new Error(`count mismatch ${n}`);
  input.forEach((x,j)=>{if(x.populationIndex!==output[j].populationIndex||x.id!==output[j].id)throw new Error(`identity mismatch ${n}/${j}`)});
  rows.push(...output.map(x=>({...x,checkerModelHarness:i<=12?"Claude Code / Anthropic Opus":"Google Antigravity / Gemini 3.1 Pro",phase:"BLIND_FROZEN_BEFORE_REVEAL"})));
}
writeFileSync(join(root,"checker-blind-adjudication.jsonl"),rows.map(JSON.stringify).join("\n")+"\n");
console.log(`frozen ${rows.length} blind checker rows`);
