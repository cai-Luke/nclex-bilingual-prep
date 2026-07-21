import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const auditDir=dirname(fileURLToPath(import.meta.url)),repo=resolve(auditDir,"../.."),path=join(repo,"banks/gpt-canonical.json"),bytes=readFileSync(path),bank=JSON.parse(bytes.toString("utf8"));
const hash=(v:any)=>createHash("sha256").update(JSON.stringify(v,null,2)).digest("hex");
const receipt={capturedAt:"2026-07-21",bankPath:"banks/gpt-canonical.json",bankSha256:createHash("sha256").update(bytes).digest("hex"),metaCount:bank.meta.count,questionCount:bank.questions.length,questions:bank.questions.map((q:any,index:number)=>({index,id:q.id,payloadSha256:hash(q)}))};
writeFileSync(join(auditDir,"pre-removal-question-hashes.json"),JSON.stringify(receipt,null,2)+"\n");
console.log(JSON.stringify({bankSha256:receipt.bankSha256,metaCount:receipt.metaCount,questionCount:receipt.questionCount,uniqueIds:new Set(receipt.questions.map((x:any)=>x.id)).size},null,2));
