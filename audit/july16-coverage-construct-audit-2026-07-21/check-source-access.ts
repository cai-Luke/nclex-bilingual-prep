import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root=dirname(fileURLToPath(import.meta.url));
const read=(p:string)=>readFileSync(p,"utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const population=read(join(root,"population.jsonl")),primary=read(join(root,"primary-adjudication.jsonl"));
const required=new Set(primary.filter((x:any)=>x.verdict!=="PASS"||x.itemType==="ordered_response"||x.itemType==="dropdown_cloze").map((x:any)=>x.id));
const rows:any[]=[];
for(const p of population.filter((x:any)=>required.has(x.id))){
  const urls=[...String(p.sourceMetadata||"").matchAll(/https?:\/\/[^\s;,]+/g)].map(m=>m[0].replace(/[.)]+$/,""));
  rows.push({populationIndex:p.populationIndex,id:p.id,itemType:p.itemType,sourceMetadata:p.sourceMetadata,urls});
}
const unique=[...new Set(rows.flatMap(x=>x.urls))];
const access=new Map<string,any>();
for(let i=0;i<unique.length;i+=8){
  await Promise.all(unique.slice(i,i+8).map(async url=>{
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
    try{const response=await fetch(url,{redirect:"follow",signal:controller.signal,headers:{"user-agent":"Project-Shrimp-audit-source-access/1.0"}});access.set(url,{url,status:response.status,ok:response.ok,finalUrl:response.url});await response.body?.cancel();}
    catch(error){access.set(url,{url,status:null,ok:false,error:error instanceof Error?error.message:String(error)});}
    finally{clearTimeout(timer);}
  }));
}
const out=rows.map(x=>({...x,access:x.urls.map((u:string)=>access.get(u))}));
writeFileSync(join(root,"source-access.jsonl"),out.map(JSON.stringify).join("\n")+"\n");
console.log(JSON.stringify({rows:out.length,uniqueUrls:unique.length,reachable:[...access.values()].filter(x=>x.ok).length,non2xxOrUnavailable:[...access.values()].filter(x=>!x.ok).length},null,2));
