import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root=dirname(fileURLToPath(import.meta.url));
const read=(name:string)=>readFileSync(join(root,name),"utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const population=read("population.jsonl"),primary=read("primary-adjudication.jsonl"),checker=read("checker-adjudication.jsonl"),sourceAccess=read("source-access.jsonl"),owner=read("owner-dispositions.jsonl");
const sha=(name:string)=>createHash("sha256").update(readFileSync(join(root,name))).digest("hex");
const group=(rows:any[],key:string)=>Object.fromEntries([...new Set(rows.map(x=>x[key]))].sort().map(v=>[v,rows.filter(x=>x[key]===v).length]));
const matrix=(rows:any[],rowKey:string,colKey:string)=>{
 const rs=[...new Set(rows.map(x=>x[rowKey]))].sort(),cs=[...new Set(rows.map(x=>x[colKey]))].sort();
 return {rs,cs,lines:rs.map(r=>`| ${r} | ${cs.map(c=>rows.filter(x=>x[rowKey]===r&&x[colKey]===c).length).join(" | ")} |`),head:`| ${rowKey} | ${cs.join(" | ")} |\n|---|${cs.map(()=>"---:").join("|")}|`};
};
const family=matrix(primary,"provenanceFamily","verdict"),type=matrix(primary,"itemType","verdict");
const adverse=primary.filter(x=>x.verdict!=="PASS"),disagreements=checker.filter(x=>x.agreementStatus!=="AGREE");
const reachable=new Map<string,any>();for(const row of sourceAccess)for(const a of row.access)reachable.set(a.url,a);
const reachableCount=[...reachable.values()].filter(x=>x.ok).length,unavailableCount=[...reachable.values()].filter(x=>!x.ok).length;
const esc=(s:any)=>String(s).replaceAll("|","\\|").replaceAll("\n"," ");
const adverseTable=adverse.map(x=>`| ${x.populationIndex} | \`${x.id}\` | ${x.itemType} | ${x.verdict} | ${x.primaryClass} | ${x.nextDisposition} | ${esc(x.reason)} |`).join("\n");
const disagreementTable=disagreements.map(x=>`| ${x.populationIndex} | \`${x.id}\` | ${x.primaryVerdict} | ${x.checkerVerdict} | ${x.checkerClass} | ${x.checkerDisposition} | ${esc(x.disagreementExplanation)} |`).join("\n");
const keyException=checker.find(x=>x.keyComparison!=="MATCH");
const bankHashes=`burn-canonical.json 5244b8d37daa49adbd1fbed7991f4ede52ded8ce710e26821841ef5e2ce3719f
capnography-canonical.json 36d72a89405fe4400f27b3b8969cdbe1c51f3217151f8b2592b7f877d636f20c
claude-canonical.json b59035ecb717fd279fb9278e3ae678c1b420a6a896b9bf6ff638614f6233b5ce
device-canonical.json 83d5a6ac7219524f4c528265291cbee2ed5b2f17c13fbeb3649342bae2e4aac5
gemini-canonical.json 8259ffb6b12c5b3ba267566b8247207ec4fc573d536d9f78fafd5d18655b63c3
gpt-canonical.json 61664a6bef854ec8d7a3a0113779a4773135724aabfdec65b970b7ac6464c5d2
hard-cases-canonical.json 438c176897a41d3b7f212435e5945bd524c3f0ba5a62931eb5e85843c93d8730
io-canonical.json 2ce6488e65049ba00cd9dccf889a042e0a624f224387382d564d282e147b2645
lab-canonical.json 1038cb68f6b91f6a2c981562d97ad9e16179db9b1332c75725fd538595c44b05
mar-canonical.json f12c03a28ff5b52411843f84bc942b4ca5667e989194357ed2d60a394f17641e
medlabel-canonical.json cc3bd0053516fc7ea4b23e814e46f186e6d2dbf40888fa713a862c07ea2b3993
visual-canonical.json e42e2a3fa6aa349a61279e6988e250e65c2b752a6f36d33806a2671e0af0f9e4
vitals-canonical.json 5154e25492bced8e4a49d763f04e25e154389c31e085bf37669651e13d411b9d`;

const report=`# July 15–16 GPT Coverage-Batch Construct Audit

Date: 2026-07-21
Status: **COMPLETE_NO_OPEN_DISPOSITIONS**

## Executive finding

The 108-item outer ring is not broadly clinically corrupt. The adverse findings cluster in question construction:

- **16 noncompetitive bowties** turn an already-established problem into a decorative 1/2/2 differential;
- **10 ordered-response items** state their own exact sequence in the stem and then ask the learner to reproduce it;
- **8 repairable items** disclose answer-bearing policies or protocols in the stem;
- **5 fill-in items** test low-value labels or a supplied classification;
- **1 dropdown** has a mechanically dependent second blank; and
- **1 dropdown** adds an overly specialist delta-gap/corrected-bicarbonate construct.

Primary result: **67 PASS / 8 FIX / 33 RETIRE**. Of the 33 retirements, **5 are without replacement** and **28 require replacement only if coverage analysis justifies it**. The eight FIX items are repair/adjudication candidates, not permanent-retirement recommendations.

The independent non-GPT checker materially agreed with **all 41 primary adverse findings**. It raised **9 additional owner-facing disagreements** on primary PASS items: five dropdown repairs and four fill-in retirements. It matched 71 of 72 live keys; the sole mismatch was the synonymous response “escalation pathway” versus keyed “chain of command,” which supports the item's scoring-vulnerability retirement rather than exposing a clinical error.

Luke accepted every primary recommendation and all nine checker additions on 2026-07-21. The final owner disposition is **58 KEEP / 13 FIX / 37 RETIRE**. Of the retirements, **5 require no replacement** and **32 were replacement-conditional on coverage analysis**. All 13 FIX items were removed from delivery and preserved in a repair quarantine rather than permanently retired.

The accepted disposition was subsequently implemented in \`banks/gpt-canonical.json\`, reducing it from 771 to 721 questions. The 37 retired payloads and 13 repair-quarantined payloads are recoverable under \`Archive/gpt-july16-construct-dispositions-2026-07-21/\`. Coverage analysis found no zeroed category-topic pair and no operational 50-question category shortfall, so no immediate replacement generation was justified.

## Final owner ruling

Accepted on 2026-07-21:

- all 33 primary RETIRE recommendations;
- all 8 primary FIX recommendations;
- all 5 checker-added bounded dropdown repairs; and
- all 4 checker-added fill-in retirements.

Final disposition totals:

| Owner disposition | Count |
|---|---:|
${Object.entries(group(owner,"ownerDisposition")).map(([k,v])=>`| ${k} | ${v} |`).join("\n")}

The completed coverage analysis resolved all 32 conditional-replacement decisions as \`NO_IMMEDIATE_REPLACEMENT_GENERATION\`. Future content planning may still address the bank's ordinary format/topic priorities, but those are not one-for-one obligations created by these retirements.

## Frozen population

- Bank: \`banks/gpt-canonical.json\`
- Frozen bank SHA-256: \`61664a6bef854ec8d7a3a0113779a4773135724aabfdec65b970b7ac6464c5d2\`
- Population: 108 unique current top-level questions, exactly 18 in each of six anchored families.
- Population SHA-256: \`${sha("population.jsonl")}\`
- Determinism: rerunning \`build-population.ts\` produced byte-identical output.
- Item types: ${Object.entries(group(population,"itemType")).map(([k,v])=>`${k} ${v}`).join(", ")}.
- Difficulty: ${Object.entries(group(population,"difficulty")).map(([k,v])=>`${k} ${v}`).join(", ")}.

## Primary results by family

${family.head}
${family.lines.join("\n")}

## Primary results by item type

${type.head}
${type.lines.join("\n")}

## Primary disposition totals

| Disposition | Count |
|---|---:|
${Object.entries(group(primary,"nextDisposition")).map(([k,v])=>`| ${k} | ${v} |`).join("\n")}

## Checker lane

- Deterministic checker population: 72 items.
- Inclusion: all 10 ordered responses, all 16 dropdowns, all 9 fill-ins, all other primary adverse items, and a deterministic 20% SHA-256 sample of remaining primary passes.
- Scoped item-specific historical repair records found: none; the known-repaired gate was therefore empty rather than silently substituted.
- Blind checker: Antigravity CLI, Gemini 3.1 Pro High; primary verdict, key, rationale, strategy, and source withheld.
- Reveal checker: Gemini CLI, Gemini 3.6 Flash; frozen blind result preserved, then compared with live key/rationale/source and primary finding.
- Checker result: ${Object.entries(group(checker,"checkerVerdict")).map(([k,v])=>`${k} ${v}`).join(" / ")}.
- Agreement: ${Object.entries(group(checker,"agreementStatus")).map(([k,v])=>`${k} ${v}`).join(" / ")}.
- Key comparison: ${Object.entries(group(checker,"keyComparison")).map(([k,v])=>`${k} ${v}`).join(" / ")}.

## Source and bilingual checks

- Source metadata was revealed only after blind derivation. All ordered responses, dropdowns, and adverse items received a source comparison.
- The audit enumerated 61 unique cited URLs across 54 required source-check rows. Automated access reached 45; 16 returned access barriers, stale paths, or timeout. Access results are preserved in \`source-access.jsonl\`; an access failure was not treated as proof that a claim was false.
- Representative authoritative text was opened directly for HIPAA timing/minimum-necessary rules, CDC injection safety, OSHA respiratory protection, ASRA LAST response, NICE fetal monitoring, and ISPD peritoneal-dialysis guidance. These checks supported the factual content while leaving the construct defects intact.
- Primary bilingual comparison found \`MATERIAL_MATCH\` for all 108 items. Neither checker lane identified a material English/Chinese divergence.

## Primary adverse findings

| # | ID | Type | Verdict | Primary class | Disposition | Evidence-backed reason |
|---:|---|---|---|---|---|---|
${adverseTable}

## Preserved primary/checker disagreements

| # | ID | Primary | Checker | Checker class | Checker disposition | Disagreement |
|---:|---|---|---|---|---|---|
${disagreementTable}

## Key-comparison exception

${keyException ? `- \`${keyException.id}\`: blind checker derived “escalation pathway”; live key is “chain of command.” The checker still agreed with RETIRE/OTHER_CONFIRMED_CONSTRUCT_DEFECT/RETIRE_WITHOUT_REPLACEMENT because synonymous free-text answers demonstrate the exact-label scoring defect.` : "- None."}

## Verification and boundary proof

- Branch/head at audit start and close: \`main\` / \`c0101f55f972863bd38ef0851440f84c055e1b0b\`; upstream divergence \`0 0\`.
- Six primary batch files contain 18 rows each; no batch exceeds the 18-item limit.
- Twelve blind checker batches and twelve reveal batches reconcile to 72 unique checker rows.
- Primary artifact: 108 rows and 108 unique IDs.
- Checker artifact: 72 rows and 72 unique IDs, in checker-population order.
- Starting and ending bundled-bank SHA-256 values for the evidence-collection phase were identical:

\`\`\`text
${bankHashes}
\`\`\`

- Evidence-collection writes were beneath \`audit/july16-coverage-construct-audit-2026-07-21/\`; the later owner-authorized implementation also changed the canonical bank, generated census/coverage artifacts, recorded governance closeout, and wrote the recoverable archive.
- No \`/tmp\` output was used.
- Concurrent unrelated untracked paths were observed and left untouched.
- Owner acceptance is recorded in \`owner-dispositions.jsonl\`. Implementation details and post-removal proofs are recorded in \`bank-implementation-closeout.md\`, \`coverage-impact.json\`, and \`post-removal-verification.json\`.

## Artifact manifest

- \`WORK-ORDER.md\`
- \`build-population.ts\`, \`population.jsonl\`
- \`build-primary.ts\`, \`primary-adjudication.jsonl\`, \`batches/\`
- \`checker-population.jsonl\`, \`checker-blind-population.jsonl\`
- \`run-antigravity-blind.ts\`, \`build-final-checker-input.ts\`, \`run-gemini-final.ts\`
- \`checker-batches/\`, \`build-checker-adjudication.ts\`, \`checker-adjudication.jsonl\`
- \`check-source-access.ts\`, \`source-access.jsonl\`
- \`build-owner-dispositions.ts\`, \`owner-dispositions.jsonl\`
- \`archive-owner-dispositions.ts\`, \`build-coverage-impact.ts\`, \`capture-pre-removal-hashes.ts\`, \`verify-post-removal.ts\`
- \`coverage-impact.json\`, \`coverage-impact.md\`, \`pre-removal-question-hashes.json\`, \`post-removal-verification.json\`
- \`bank-implementation-closeout.md\`
- \`build-report.ts\`, \`report.md\`
`;
writeFileSync(join(root,"report.md"),report);
console.log(JSON.stringify({status:"COMPLETE_NO_OPEN_DISPOSITIONS",population:population.length,primary:group(primary,"verdict"),checker:group(checker,"checkerVerdict"),owner:group(owner,"ownerVerdict"),disagreements:disagreements.length,reportSha256:createHash("sha256").update(report).digest("hex")},null,2));
