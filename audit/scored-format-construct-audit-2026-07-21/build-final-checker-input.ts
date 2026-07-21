import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root=dirname(fileURLToPath(import.meta.url));
const read=(p:string)=>readFileSync(p,"utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const population=read(join(root,"population.jsonl"));
const primary=read(join(root,"primary-adjudication.jsonl"));
const checker=read(join(root,"checker-population.jsonl"));
const pmap=new Map(population.map((x:any)=>[x.id,x]));
const amap=new Map(primary.map((x:any)=>[x.id,x]));
const all:any[]=[];
for(let i=1;i<=23;i++){
 const n=String(i).padStart(2,"0"),blind=read(join(root,"checker-batches",`blind3-output-${n}.jsonl`));
 for(const b of blind){
  const q:any=pmap.get(b.id),a:any=amap.get(b.id);
  if(!q||!a)throw new Error(`missing ${b.id}`);
  all.push({populationIndex:b.populationIndex,id:b.id,itemType:q.itemType,blind:b,currentKey:q.currentKey,rationale:q.rationale,testTakingStrategy:q.testTakingStrategy,sourceMetadata:q.sourceMetadata,primary:{verdict:a.verdict,primaryClass:a.primaryClass,secondaryClasses:a.secondaryClasses,nextDisposition:a.nextDisposition,reason:a.reason}});
 }
}
if(all.length!==67||new Set(all.map(x=>x.id)).size!==67)throw new Error("checker final input reconciliation");
const expected=new Set(checker.map((x:any)=>x.id));if(all.some(x=>!expected.has(x.id)))throw new Error("unexpected checker id");
for(let i=0;i<all.length;i+=3){
 const n=String(i/3+1).padStart(2,"0"),b=all.slice(i,i+3);
 writeFileSync(join(root,"checker-batches",`final3-input-${n}.jsonl`),b.map(JSON.stringify).join("\n")+"\n");
}
console.log("final checker inputs: 67 rows / 23 files");
