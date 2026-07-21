import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root=dirname(fileURLToPath(import.meta.url));
const read=(name:string)=>readFileSync(join(root,name),"utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const primary=read("primary-adjudication.jsonl");
const checker=read("checker-adjudication.jsonl");
const disagreements=new Map(checker.filter((x:any)=>x.agreementStatus!=="AGREE").map((x:any)=>[x.id,x]));

const rows=primary.map((p:any)=>{
  const c:any=disagreements.get(p.id);
  return {
    populationIndex:p.populationIndex,
    id:p.id,
    itemType:p.itemType,
    ownerDecisionSource:c?"CHECKER_ADDITION_ACCEPTED":"PRIMARY_RECOMMENDATION_ACCEPTED",
    ownerVerdict:c?c.checkerVerdict:p.verdict,
    ownerClass:c?c.checkerClass:p.primaryClass,
    ownerDisposition:c?c.checkerDisposition:p.nextDisposition,
    ownerDecisionDate:"2026-07-21",
    ownerDecision:"ACCEPTED",
  };
});

if(rows.length!==108||new Set(rows.map((x:any)=>x.id)).size!==108)throw new Error("Owner disposition reconciliation failed");
writeFileSync(join(root,"owner-dispositions.jsonl"),rows.map(JSON.stringify).join("\n")+"\n");
const count=(key:string)=>Object.fromEntries([...new Set(rows.map((x:any)=>x[key]))].sort().map(v=>[v,rows.filter((x:any)=>x[key]===v).length]));
console.log(JSON.stringify({rows:rows.length,verdict:count("ownerVerdict"),disposition:count("ownerDisposition"),checkerAdditions:[...disagreements.keys()]},null,2));
