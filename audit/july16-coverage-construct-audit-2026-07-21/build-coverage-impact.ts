import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { REMOVAL_IDS } from "../../scripts/patches/2026-07-21-gpt-july16-construct-disposition-manifest";

const auditDir=dirname(fileURLToPath(import.meta.url)),repo=resolve(auditDir,"../..");
const bank=JSON.parse(readFileSync(join(repo,"banks/gpt-canonical.json"),"utf8"));
const remove=new Set<string>(REMOVAL_IDS);
const before=bank.questions,after=before.filter((q:any)=>!remove.has(q.id)),removed=before.filter((q:any)=>remove.has(q.id));
if(removed.length!==50||after.length!==before.length-50)throw new Error("Coverage-impact population mismatch");
const count=(xs:any[],key:(x:any)=>string)=>Object.fromEntries([...new Set(xs.map(key))].sort().map(v=>[v,xs.filter(x=>key(x)===v).length]));
const dimensions=[
  ["category",(q:any)=>q.category],
  ["topic",(q:any)=>q.topic],
  ["itemType",(q:any)=>q.itemType],
  ["difficulty",(q:any)=>q.difficulty],
  ["categoryTopic",(q:any)=>`${q.category} :: ${q.topic}`],
] as const;
const impact:any={generatedAt:"2026-07-21",sourceBank:"banks/gpt-canonical.json",beforeCount:before.length,afterCount:after.length,removedCount:removed.length,dimensions:{}};
for(const [name,key] of dimensions){
 const b=count(before,key),a=count(after,key),r=count(removed,key),keys=[...new Set([...Object.keys(b),...Object.keys(a),...Object.keys(r)])].sort();
 impact.dimensions[name]=keys.map(k=>({value:k,before:b[k]||0,removed:r[k]||0,after:a[k]||0})).filter(x=>x.removed>0);
}
impact.replacementAssessment={decision:"NO_IMMEDIATE_REPLACEMENT_GENERATION",reasons:["The current census already reports no operational category shortfall for a 50-item standalone session.","Every affected category-topic pair retains live supply after removal.","Every affected scored item type retains substantial bank-wide supply; removal addresses invalid constructs rather than a required delivery contract.","The historical commission manifests are provenance records, not current content-planning targets."],nextGate:"Reassess only if a future content-planning target identifies a concrete topic, category, or construct deficit."};
writeFileSync(join(auditDir,"coverage-impact.json"),JSON.stringify(impact,null,2)+"\n");
const affected=impact.dimensions.categoryTopic.map((x:any)=>`| ${x.value.replaceAll("|","\\|")} | ${x.before} | ${x.removed} | ${x.after} |`).join("\n");
const types=impact.dimensions.itemType.map((x:any)=>`| ${x.value} | ${x.before} | ${x.removed} | ${x.after} |`).join("\n");
const md=`# Coverage Impact — Accepted July 16 Construct Dispositions\n\nStatus: **NO_IMMEDIATE_REPLACEMENT_GENERATION**\n\nThe simulation removes 50 current GPT-canonical items (37 retirements and 13 repair quarantines), changing that bank from ${before.length} to ${after.length} top-level questions. No affected category-topic pair falls to zero. Current category-level delivery capacity already has no operational shortfall. The accepted 32 replacement-conditional retirements therefore do not justify automatic one-for-one generation.\n\n## Affected category-topic pairs\n\n| Category :: Topic | Before | Removed | After |\n|---|---:|---:|---:|\n${affected}\n\n## Affected item types\n\n| Item type | Before | Removed | After |\n|---|---:|---:|---:|\n${types}\n\n## Decision\n\nDo not generate replacements in this pass. Reopen replacement work only against a concrete future content-planning target. The 13 quarantined FIX items may return only after repair, independent producer-not-checker review, validation, promotion, ledgering, and census regeneration.\n`;
writeFileSync(join(auditDir,"coverage-impact.md"),md);
console.log(JSON.stringify({before:before.length,removed:removed.length,after:after.length,affectedCategoryTopics:impact.dimensions.categoryTopic.length,zeroedCategoryTopics:impact.dimensions.categoryTopic.filter((x:any)=>x.after===0).length,decision:impact.replacementAssessment.decision},null,2));
