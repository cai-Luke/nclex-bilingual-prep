import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { QUARANTINE_FIX_IDS, RETIRE_IDS, REMOVAL_IDS } from "../../scripts/patches/2026-07-21-gpt-july16-construct-disposition-manifest";

const auditDir=dirname(fileURLToPath(import.meta.url));
const repo=resolve(auditDir,"../..");
const bankPath=join(repo,"banks/gpt-canonical.json");
const archiveDir=join(repo,"Archive/gpt-july16-construct-dispositions-2026-07-21");
const bank=JSON.parse(readFileSync(bankPath,"utf8"));
const owner=readFileSync(join(auditDir,"owner-dispositions.jsonl"),"utf8").trim().split("\n").map(JSON.parse);
const ownerMap=new Map(owner.map((x:any)=>[x.id,x]));
const primary=readFileSync(join(auditDir,"primary-adjudication.jsonl"),"utf8").trim().split("\n").map(JSON.parse);
const checker=readFileSync(join(auditDir,"checker-adjudication.jsonl"),"utf8").trim().split("\n").map(JSON.parse);
const primaryMap=new Map(primary.map((x:any)=>[x.id,x]));
const checkerMap=new Map(checker.map((x:any)=>[x.id,x]));
const questionMap=new Map(bank.questions.map((q:any)=>[q.id,q]));
const payloadHash=(q:any)=>createHash("sha256").update(JSON.stringify(q,null,2)).digest("hex");
const bankHash=createHash("sha256").update(readFileSync(bankPath)).digest("hex");

if(bankHash!=="61664a6bef854ec8d7a3a0113779a4773135724aabfdec65b970b7ac6464c5d2")throw new Error(`Unexpected pre-removal bank hash ${bankHash}`);
if(REMOVAL_IDS.some(id=>!questionMap.has(id)))throw new Error("At least one removal ID is absent from the frozen bank");

function build(ids:readonly string[],kind:"RETIRE"|"FIX_QUARANTINE"){
  return ids.map(id=>{
    const q:any=questionMap.get(id),o:any=ownerMap.get(id),p:any=primaryMap.get(id),c:any=checkerMap.get(id);
    if(!q||!o)throw new Error(`Missing archive input ${id}`);
    return {id,kind,ownerClass:o.ownerClass,ownerDisposition:o.ownerDisposition,auditReason:o.ownerDecisionSource==="CHECKER_ADDITION_ACCEPTED"?c?.reason:p?.reason,payloadSha256:payloadHash(q),question:q};
  });
}

mkdirSync(archiveDir,{recursive:true});
const retired={archivedAt:"2026-07-21",sourceBank:"banks/gpt-canonical.json",sourceBankSha256:bankHash,auditReport:"audit/july16-coverage-construct-audit-2026-07-21/report.md",status:"owner-accepted retirement",count:RETIRE_IDS.length,items:build(RETIRE_IDS,"RETIRE")};
const quarantined={archivedAt:"2026-07-21",sourceBank:"banks/gpt-canonical.json",sourceBankSha256:bankHash,auditReport:"audit/july16-coverage-construct-audit-2026-07-21/report.md",status:"non-bundled repair quarantine; not reviewed study material",count:QUARANTINE_FIX_IDS.length,items:build(QUARANTINE_FIX_IDS,"FIX_QUARANTINE")};
writeFileSync(join(archiveDir,"retired-items.json"),JSON.stringify(retired,null,2)+"\n");
writeFileSync(join(archiveDir,"quarantined-fix-items.json"),JSON.stringify(quarantined,null,2)+"\n");
const manifest={archivedAt:"2026-07-21",sourceBankSha256:bankHash,retiredCount:retired.count,quarantinedFixCount:quarantined.count,retiredFileSha256:createHash("sha256").update(readFileSync(join(archiveDir,"retired-items.json"))).digest("hex"),quarantinedFileSha256:createHash("sha256").update(readFileSync(join(archiveDir,"quarantined-fix-items.json"))).digest("hex"),retiredPayloads:retired.items.map((x:any)=>({id:x.id,payloadSha256:x.payloadSha256})),quarantinedPayloads:quarantined.items.map((x:any)=>({id:x.id,payloadSha256:x.payloadSha256}))};
writeFileSync(join(archiveDir,"manifest.json"),JSON.stringify(manifest,null,2)+"\n");
console.log(JSON.stringify({archiveDir,bankHash,retired:retired.count,quarantined:quarantined.count,manifestSha256:createHash("sha256").update(readFileSync(join(archiveDir,"manifest.json"))).digest("hex")},null,2));
