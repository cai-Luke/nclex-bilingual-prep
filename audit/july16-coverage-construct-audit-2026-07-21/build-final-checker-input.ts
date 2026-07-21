import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root=dirname(fileURLToPath(import.meta.url));
const read=(p:string)=>readFileSync(p,"utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const population=read(join(root,"population.jsonl")),primary=read(join(root,"primary-adjudication.jsonl")),checker=read(join(root,"checker-population.jsonl"));
const pmap=new Map(population.map((x:any)=>[x.id,x])),amap=new Map(primary.map((x:any)=>[x.id,x]));
const all:any[]=[];
for(let i=1;i<=12;i++) for(const blind of read(join(root,"checker-batches",`blind6-output-${String(i).padStart(2,"0")}.jsonl`))){
  const q:any=pmap.get(blind.id),a:any=amap.get(blind.id);if(!q||!a)throw new Error(`Missing ${blind.id}`);
  all.push({populationIndex:blind.populationIndex,id:blind.id,itemType:q.itemType,blind,currentKey:q.currentKey,rationale:q.rationale,testTakingStrategy:q.testTakingStrategy,sourceMetadata:q.sourceMetadata,primary:{verdict:a.verdict,primaryClass:a.primaryClass,nextDisposition:a.nextDisposition,reason:a.reason}});
}
if(all.length!==72||new Set(all.map(x=>x.id)).size!==72)throw new Error("Final checker input reconciliation");
checker.forEach((x:any,i:number)=>{if(all[i].id!==x.id)throw new Error(`Order ${i}`)});
for(let i=0;i<all.length;i+=6)writeFileSync(join(root,"checker-batches",`final6-input-${String(i/6+1).padStart(2,"0")}.jsonl`),all.slice(i,i+6).map(JSON.stringify).join("\n")+"\n");
console.log("Final checker inputs: 72 rows / 12 files");
