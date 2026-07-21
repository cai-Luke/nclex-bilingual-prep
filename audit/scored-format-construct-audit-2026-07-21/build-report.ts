import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const auditDir=dirname(fileURLToPath(import.meta.url));
const repo=join(auditDir,"../..");
const read=(p:string)=>readFileSync(p,"utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const population=read(join(auditDir,"population.jsonl"));
const primary=read(join(auditDir,"primary-adjudication.jsonl"));
const checkerPopulation=read(join(auditDir,"checker-population.jsonl"));
const checkerAdjudication=read(join(auditDir,"checker-adjudication.jsonl"));
const terminalPath=join(repo,"audit/terminal-sentence-semantic-census-2026-07-21/quarantine/adjudication.jsonl");
const terminal=read(terminalPath);
const terminalMap=new Map(terminal.map((x:any)=>[x.topLevelQuestionId,x]));
const popById=new Map(population.map((x:any)=>[x.id,x]));
const q=(s:string)=>s.replace(/\|/g,"\\|").replace(/\n/g," ");
const count=(xs:any[],key:string)=>[...new Set(xs.map(x=>x[key]))].sort().map(v=>[String(v),xs.filter(x=>x[key]===v).length] as const);
const table=(headers:string[],rows:(string|number)[][])=>`| ${headers.join(" | ")} |\n| ${headers.map(()=>"---").join(" | ")} |\n${rows.map(r=>`| ${r.map(x=>q(String(x))).join(" | ")} |`).join("\n")}`;
const countTable=(xs:any[],key:string)=>table([key,"Count"],count(xs,key).map(([k,v])=>[k,v]));
const idList=(xs:any[])=>xs.map(x=>`- \`${x.id}\` — \`${popById.get(x.id)?.questionPath}\`; ${x.primaryClass}; ${x.nextDisposition}; evidence: “${q(x.quotedEvidence[0]||"")}”`).join("\n")||"- None.";
const ids=(xs:any[])=>xs.map(x=>`\`${x.id}\``).join(", ")||"None";
const sha=(p:string)=>createHash("sha256").update(readFileSync(p)).digest("hex");

const startHashes:Record<string,string>={
 "banks/burn-canonical.json":"5244b8d37daa49adbd1fbed7991f4ede52ded8ce710e26821841ef5e2ce3719f",
 "banks/capnography-canonical.json":"36d72a89405fe4400f27b3b8969cdbe1c51f3217151f8b2592b7f877d636f20c",
 "banks/claude-canonical.json":"b59035ecb717fd279fb9278e3ae678c1b420a6a896b9bf6ff638614f6233b5ce",
 "banks/device-canonical.json":"83d5a6ac7219524f4c528265291cbee2ed5b2f17c13fbeb3649342bae2e4aac5",
 "banks/gemini-canonical.json":"8259ffb6b12c5b3ba267566b8247207ec4fc573d536d9f78fafd5d18655b63c3",
 "banks/gpt-canonical.json":"61664a6bef854ec8d7a3a0113779a4773135724aabfdec65b970b7ac6464c5d2",
 "banks/hard-cases-canonical.json":"438c176897a41d3b7f212435e5945bd524c3f0ba5a62931eb5e85843c93d8730",
 "banks/io-canonical.json":"2ce6488e65049ba00cd9dccf889a042e0a624f224387382d564d282e147b2645",
 "banks/lab-canonical.json":"1038cb68f6b91f6a2c981562d97ad9e16179db9b1332c75725fd538595c44b05",
 "banks/mar-canonical.json":"f12c03a28ff5b52411843f84bc942b4ca5667e989194357ed2d60a394f17641e",
 "banks/medlabel-canonical.json":"cc3bd0053516fc7ea4b23e814e46f186e6d2dbf40888fa713a862c07ea2b3993",
 "banks/visual-canonical.json":"e42e2a3fa6aa349a61279e6988e250e65c2b752a6f36d33806a2671e0af0f9e4",
 "banks/vitals-canonical.json":"5154e25492bced8e4a49d763f04e25e154389c31e085bf37669651e13d411b9d"
};
const endHashes=Object.fromEntries(Object.keys(startHashes).map(p=>[p,sha(join(repo,p))]));
if(Object.keys(startHashes).some(p=>startHashes[p]!==endHashes[p])) throw new Error("BLOCKED_CONCURRENT_BANK_CHANGE");

const verdict=count(primary,"verdict");
const wave1=primary.filter((x:any)=>x.itemType==="ordered_response"||x.itemType==="dropdown_cloze");
const wave2=primary.filter((x:any)=>x.itemType!=="ordered_response"&&x.itemType!=="dropdown_cloze");
const retire=primary.filter((x:any)=>x.verdict==="RETIRE");
const full=primary.filter((x:any)=>x.nextDisposition==="FULL_ITEM_REWRITE_SAME_CONSTRUCT");
const bounded=primary.filter((x:any)=>x.nextDisposition==="BOUNDED_TEXT_REPAIR");
const multiple=primary.filter((x:any)=>x.itemType==="ordered_response"&&x.defensibleOrderCount!==1);
const oneOrder=primary.filter((x:any)=>x.itemType==="ordered_response"&&x.defensibleOrderCount===1);
const both=primary.filter((x:any)=>x.verdict!=="PASS"&&terminalMap.get(x.id)?.verdict!=="PASS");
const terminalOnly=primary.filter((x:any)=>x.verdict==="PASS"&&terminalMap.get(x.id)?.verdict!=="PASS");
const constructOnly=primary.filter((x:any)=>x.verdict!=="PASS"&&terminalMap.get(x.id)?.verdict==="PASS");
const checkerDisagreements=checkerAdjudication.filter((x:any)=>x.agreementStatus==="DISAGREE");
const checkerPartials=checkerAdjudication.filter((x:any)=>x.agreementStatus==="PARTIAL");
const checkerDisputeList=(xs:any[])=>xs.map(x=>`- \`${x.id}\` — primary ${x.primaryVerdict}/${x.primaryClass}/${x.primaryDisposition}; checker ${x.checkerVerdict}/${x.checkerClass}/${x.checkerDisposition}; ${x.disagreementExplanation}`).join("\n")||"- None.";
const endStatus=execFileSync("git",["status","--short"],{cwd:repo,encoding:"utf8"}).trim().split("\n").filter(Boolean);
const batchFiles=readdirSync(join(auditDir,"batches")).sort();
const topicRows=count(population,"topic").map(([k,v])=>[k,v]);
const byTypeVerdict=[...new Set(primary.map((x:any)=>x.itemType))].sort().flatMap(t=>["PASS","FIX","RETIRE","REVIEW"].map(v=>[t,v,primary.filter((x:any)=>x.itemType===t&&x.verdict===v).length])).filter(r=>Number(r[2])>0);
const subBatchVerdict=[...new Set(primary.map((x:any)=>x.subBatch))].sort().map(b=>[b,...["PASS","FIX","RETIRE","REVIEW"].map(v=>primary.filter((x:any)=>x.subBatch===b&&x.verdict===v).length)]);
const checkerTypeRows=[...new Set(checkerAdjudication.map((x:any)=>x.itemType))].sort().map(t=>[t,...["PASS","FIX","RETIRE","REVIEW"].map(v=>checkerAdjudication.filter((x:any)=>x.itemType===t&&x.checkerVerdict===v).length)]);
const checkerBatchRows=[...new Set(checkerAdjudication.map((x:any)=>x.subBatch))].sort().map(b=>[b,...["PASS","FIX","RETIRE","REVIEW"].map(v=>checkerAdjudication.filter((x:any)=>x.subBatch===b&&x.checkerVerdict===v).length)]);

const report=`# GPT Scored-Format Construct Audit — Final Report

## Status

\`BLOCKED_OUTPUT_CONTAMINATION\`

The primary 104-item adjudication and all 67 required independent checker adjudications are complete, but the work order cannot receive a complete status: the initial byte-identity proof created one task-owned temporary copy at \`/tmp/population-first.jsonl\`, outside the authorized audit directory. The temporary copy was removed, no repository or bank file was affected, and all durable task artifacts are inside the authorized directory; nevertheless Section 18 defines any such write as \`BLOCKED_OUTPUT_CONTAMINATION\`. Owner dispositions also remain open for retirement decisions and preserved primary/checker disagreements.

## Audit session header

- Primary auditor: OpenAI Codex, GPT-family.
- Independent checker: blind phase used Claude Code / Anthropic Opus for rows 1–36 and Google Antigravity / Gemini 3.1 Pro for rows 37–67; reveal/source/agreement phase used Google Antigravity / Gemini 3.1 Pro for rows 1–9 and Gemini CLI / Gemini 3.6 Flash for rows 10–67.
- Date: 2026-07-21.
- Branch / HEAD / upstream: \`main\` / \`c0101f55f972863bd38ef0851440f84c055e1b0b\` / \`origin/main\`, ahead 0, behind 0.
- Canonical population bank SHA-256: \`61664a6bef854ec8d7a3a0113779a4773135724aabfdec65b970b7ac6464c5d2\`.
- Population artifact SHA-256: \`${sha(join(auditDir,"population.jsonl"))}\`; a second builder run was byte-identical.
- Primary checkpoint sizes: 16, 16, 18, 18, 18, 18 (${batchFiles.map(x=>`\`${x}\``).join(", ")}).
- Starting changed paths recorded before task writes: \`GEMINI-TERMINAL-SENTENCE-SEMANTIC-CENSUS-SPEC-2026-07-21.md\`, \`GPT-SCORED-FORMAT-CONSTRUCT-AUDIT-SPEC-2026-07-21.md\`, \`LAB-TREND-EPIC-STYLE-DUAL-SERIES-MIGRATION-CODEX-SPEC-2026-07-21.md\`, and \`audit/terminal-sentence-semantic-census-2026-07-21/\`.
- Ending changed-path snapshot: ${endStatus.map(x=>`\`${q(x)}\``).join(", ")}.
- All durable task-owned writes are confined to \`audit/scored-format-construct-audit-2026-07-21/\`. Other ending untracked paths appeared independently and were not touched by this task.
- Formal exception: one task-owned repeat-proof copy was temporarily written to \`/tmp/population-first.jsonl\` and subsequently removed. This is why the status is blocked despite no project-file contamination.
- All 13 bundled-bank ending hashes exactly equal the recorded starting hashes. No bank mutation occurred.

${table(["Bank","Starting SHA-256","Ending SHA-256"],Object.keys(startHashes).map(p=>[p,startHashes[p],endHashes[p]]))}

## Population reconciliation

All 104 rows are unique, current top-level standalone scored leaves. No planned missing row was reconstructed.

### Provenance family

${countTable(population,"provenanceFamily")}

### Sub-batch

${countTable(population,"subBatch")}

### Item type

${countTable(population,"itemType")}

### Difficulty

${countTable(population,"difficulty")}

### Category

${countTable(population,"category")}

### Topic

${table(["Topic","Count"],topicRows)}

## Results

### Primary verdicts

${countTable(primary,"verdict")}

### Wave results

${table(["Wave","PASS","FIX","RETIRE","REVIEW"],[
 ["Wave 1: ordered response + dropdown",14,8,10,0],
 ["Wave 2: remaining formats",48,3,21,0],
 ["Total",62,11,31,0]
])}

### Verdict by item type

${table(["Item type","Verdict","Count"],byTypeVerdict)}

### Verdict by sub-batch

${table(["Sub-batch","PASS","FIX","RETIRE","REVIEW"],subBatchVerdict)}

### Primary class

${countTable(primary,"primaryClass")}

### Secondary class

${table(["Secondary class","Count"],count(primary.flatMap((x:any)=>x.secondaryClasses.map((secondaryClass:string)=>({secondaryClass}))),"secondaryClass"))}

### Next disposition

${countTable(primary,"nextDisposition")}

### Source check

${countTable(primary,"sourceCheck")}

### Nursing relevance

${countTable(primary,"nursingRelevance")}

### Bilingual parity

${countTable(primary,"bilingualParity")}

### Independent checker

Required checker population: 67. Blind derivations frozen: 67. Fully checked: 67.

${table(["Checker verdict","Count"],count(checkerAdjudication,"checkerVerdict"))}

${table(["Agreement status","Count"],count(checkerAdjudication,"agreementStatus"))}

${table(["Checker class","Count"],count(checkerAdjudication,"checkerClass"))}

${table(["Checker disposition","Count"],count(checkerAdjudication,"checkerDisposition"))}

${table(["Checker source verification","Count"],count(checkerAdjudication,"sourceVerificationResult"))}

${table(["Checker item type","PASS","FIX","RETIRE","REVIEW"],checkerTypeRows)}

${table(["Checker sub-batch","PASS","FIX","RETIRE","REVIEW"],checkerBatchRows)}

## High-priority queues

### RETIRE candidates (31)

${idList(retire)}

### Full-item rewrites, same construct (10)

${idList(full)}

### Bounded fixes (1)

${idList(bounded)}

### Owner or clinical review items

- No primary \`REVIEW\` rows. Owner clearance remains required after the independent checker for all 31 retirement recommendations and for every future checker disagreement.

### Primary/checker disagreements

Material disagreements (4):

${checkerDisputeList(checkerDisagreements)}

Class/disposition partial agreements (4):

${checkerDisputeList(checkerPartials)}

## Ordered-response findings

- One defensible total order: ${oneOrder.length}: ${ids(oneOrder)}.
- Multiple defensible total orders: ${multiple.length}: ${ids(multiple)}.
- Concurrent or either-order processes were confirmed in the alcohol-withdrawal, burn-perfusion, PN-transition/administration, ingestion, missed-pill, and peak-flow items.
- Unclosed branches: none confirmed in the current live versions. The avulsed-tooth stem legitimately closes the replantation branch.
- Sources supported only a partial order for the nine multiple-order items; none of their numbered educational/checklist lists established every adjacent rank.
- Ordered-response disposition: PASS 11 / FIX 8 / RETIRE 4.

## Dropdown-cloze findings

- Three items had three separate, natural, independently useful inferences: \`gpt_format10c_dmpa_late_repeat_injection\`, \`gpt_format9c_delayed_hemolytic_reaction\`, and \`gpt_format9c_noisy_respiratory_secretions\`.
- Mechanical dependency: \`gpt_format10c_latent_vs_active_tuberculosis\`.
- Invented/assembled extra inference: \`gpt_format10c_ect_continuation_maintenance_plan\`, \`gpt_format9c_pn_peripheral_central_access\`, and \`gpt_format11c_adrenal_laboratory_localization\`.
- Unsupported/circular next step: \`gpt_format11c_microcytic_anemia_localization\`.
- Overly specialist/low-value construct: \`gpt_format11c_adrenal_laboratory_localization\`, \`gpt_format11c_microcytic_anemia_localization\`, and \`gpt_format11c_water_deprivation_desmopressin_interpretation\`.
- Dropdown disposition: PASS 3 / FIX 0 / RETIRE 6.

## Remaining-format findings

${table(["Item type","Population","Adverse","Adverse rate"],[
 ["fill_in_blank",26,primary.filter((x:any)=>x.itemType==="fill_in_blank"&&x.verdict!=="PASS").length,`${(100*primary.filter((x:any)=>x.itemType==="fill_in_blank"&&x.verdict!=="PASS").length/26).toFixed(1)}%`],
 ["highlight",24,primary.filter((x:any)=>x.itemType==="highlight"&&x.verdict!=="PASS").length,`${(100*primary.filter((x:any)=>x.itemType==="highlight"&&x.verdict!=="PASS").length/24).toFixed(1)}%`],
 ["bowtie",21,primary.filter((x:any)=>x.itemType==="bowtie"&&x.verdict!=="PASS").length,`${(100*primary.filter((x:any)=>x.itemType==="bowtie"&&x.verdict!=="PASS").length/21).toFixed(1)}%`],
 ["select_all",1,0,"0.0%"]
])}

Wave 2 has 24 adverse rows out of 72 (33.3%). The dominant mechanism is calculation without clinical value, followed by specialist constructs and noncompeting/telegraphed bowties. The single select-all item passed independent-option and jurisdictional-caveat review.

## Known-example reconciliation

- \`gpt_format11c_home_peak_flow_technique\`: current item RETIRE / arbitrary serialization. True dependencies are inhalation before blow, repetition before highest-value recording; inspection/reset and standing remain either-order.
- \`gpt_format11c_microcytic_anemia_localization\`: current item RETIRE. It contains two laboratory records, not three; HbA2 already represents structural hemoglobin analysis; the cited iron-deficiency source does not establish uniquely indicated molecular confirmation.
- \`gpt_format10c_occupational_sharps_hiv_pep_sequence\`: current repaired item PASS. All ranked actions now concern the exposed nurse; source-patient testing is not serialized; baseline testing does not delay PEP; one order remains.
- \`gpt_format10b_hemodialysis_access_prompt_followup\`: current regenerated item PASS. It is limited to stenosis/dysfunction, has no contradictory simultaneous access findings, and uses one response horizon.
- \`gpt_format7c_exercise_hypoglycemia_bowtie\`: current naturalized item PASS. The deleted historical scope commentary was not re-flagged; the live bowtie has a coherent exercise-linked condition, two same-phase actions, and response-monitoring parameters.
- Count controls passed: Batch 7 = 17, Batch 10 = 17, total = 104.

## Terminal-census overlap

The primary construct file was frozen before this comparison. The available terminal-census file has one row for each scoped ID: 54 PASS and 50 FAIL. The verdict systems remain separate.

- Flagged by both: ${both.length}: ${ids(both)}.
- Terminal-only surface findings: ${terminalOnly.length}: ${ids(terminalOnly)}.
- Construct-only findings: ${constructOnly.length}: ${ids(constructOnly)}.
- Design compensation requiring more than terminal deletion includes the telegraphed ordered-response plans, specialist calculation disclaimers, invented cloze records/counterfactuals, and the peak-flow total-order demand.

## Review-process diagnosis

- Evidence: all six provenance families contain adverse primary rows; Wave 2 adverse rate is 33.3%; repeated mechanisms occur across multiple families; key comparison still matched on 103 of 104 rows despite 42 adverse construct outcomes.
- Inference: format-quota pressure likely produced weak premises and extra calculations/blanks; prior review appears to have confirmed commissioned keys more often than it derived answer spaces blind; exact source pins and full permutations were treated as stronger evidence than they are.
- Evidence: no material bilingual divergence was found. Inference: bilingual presence/parity checks could not detect defects shared by both languages.
- Conclusion: the concern is systematic within this provenance pocket, not isolated to 11C. This does not establish a defect rate for the broader bank.

## Outer-ring recommendation

The conditional trigger fired. Wave 2 has 24/72 primary adverse rows (33.3%), all retained as adverse by the checker, and the checker additionally flagged two sampled Wave 2 primary passes. Repeated mechanisms span at least three provenance families and plausibly derive from the shared format-first commission/review process. Recommend a separate work order for the defined 108-item July 16 outer ring after owner disposition. This report does not begin or authorize that audit.

## Handoff

### Owner ruling recorded 2026-07-21

- Accept the 18 \`RETIRE_WITHOUT_REPLACEMENT\` recommendations.
- Retire the other 13 current items and replace only where current coverage analysis justifies replacement.
- Quarantine all 13 checker-level \`FIX\` items for repair or adjudication; do not treat them as permanent retirements.
- Treat the removed \`/tmp\` repeat-proof copy as a process blemish, not a challenge to the audit findings.
- Proceed under a separate work order with the defined 108-item outer-ring audit.

- Primary totals: PASS 62 / FIX 11 / RETIRE 31 / REVIEW 0.
- Checked totals: PASS 23 / FIX 13 / RETIRE 31 / REVIEW 0; agreement status AGREE 59 / DISAGREE 4 / PARTIAL 4.
- Exact owner decisions required: (1) adjudicate all 31 retirement recommendations (${ids(retire)}); (2) decide replacement need for the 13 \`RETIRE_AND_REPLACE_IF_COVERAGE_NEEDED\` rows; (3) resolve four material PASS-versus-FIX disagreements (${ids(checkerDisagreements)}); (4) reconcile four class-only partials (${ids(checkerPartials)}). These queues contain 37 unique stable IDs because two class-only partials are already retirement candidates.
- Eligible bounded repair: ${ids(bounded)}.
- Full rewrite candidates: ${ids(full)}.
- Retirement candidates: ${ids(retire)}.
- Outer-ring trigger: YES.
- Artifacts: \`build-population.ts\`, \`population.jsonl\`, \`build-primary.ts\`, \`primary-adjudication.jsonl\`, \`checker-population.jsonl\`, \`checker-blind-population.jsonl\`, \`checker-blind-adjudication.jsonl\`, \`checker-adjudication.jsonl\`, \`checker-batches/\`, \`batches/\`, checker runner/build scripts, \`build-report.ts\`, and \`report.md\`.
- No bank mutation occurred, and this task changed no project file outside \`audit/scored-format-construct-audit-2026-07-21/\`.
`;

writeFileSync(join(auditDir,"report.md"),report);
console.log(JSON.stringify({status:"BLOCKED_OUTPUT_CONTAMINATION",primary:Object.fromEntries(verdict),checkerRequired:checkerPopulation.length,checkerCompleted:checkerAdjudication.length,checkerVerdict:Object.fromEntries(count(checkerAdjudication,"checkerVerdict")),agreement:Object.fromEntries(count(checkerAdjudication,"agreementStatus")),bankHashesUnchanged:true,reportSha256:createHash("sha256").update(report).digest("hex")},null,2));
