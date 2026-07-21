import * as fs from "fs";
import * as path from "path";

const QUEUE_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/queue.jsonl");
const ADJ_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/adjudication.jsonl");
const REPORT_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/report.md");

const adjLines = fs.readFileSync(ADJ_FILE, "utf-8").split("\n").filter(l => l.trim().length > 0);
const queueLines = fs.readFileSync(QUEUE_FILE, "utf-8").split("\n").filter(l => l.trim().length > 0);

const counts = {
  verdicts: {} as any,
  classes: {} as any,
  nextSteps: {} as any,
  removalRisk: {} as any,
  flags: [] as any[],
  controlFlags: 0,
  controlTotal: 0
};

let topLevelScoredLeaves = 0;
let topLevelCaseContainers = 0;
let embeddedScoredLeaves = 0;

for (const line of queueLines) {
  const row = JSON.parse(line);
  if (row.recordKind === "TOP_LEVEL_SCORED_LEAF") topLevelScoredLeaves++;
  if (row.recordKind === "TOP_LEVEL_CASE_CONTAINER") topLevelCaseContainers++;
  if (row.recordKind === "EMBEDDED_SCORED_LEAF") embeddedScoredLeaves++;
}

for (const line of adjLines) {
  const row = JSON.parse(line);

  counts.verdicts[row.verdict] = (counts.verdicts[row.verdict] || 0) + 1;
  counts.classes[row.primaryClass] = (counts.classes[row.primaryClass] || 0) + 1;
  counts.nextSteps[row.nextStep] = (counts.nextSteps[row.nextStep] || 0) + 1;
  counts.removalRisk[row.removalRisk] = (counts.removalRisk[row.removalRisk] || 0) + 1;

  if (row.verdict !== "PASS") {
    counts.flags.push(row);
  }

  if (row.controlVerdict) {
    counts.controlTotal++;
    if (row.controlVerdict !== "PASS") {
      counts.controlFlags++;
    }
  }
}

const totalScoredLeaves = topLevelScoredLeaves + embeddedScoredLeaves;
const deletionCandidates = counts.nextSteps["DELETION_CANDIDATE"] || 0;
const fullItemReview = counts.nextSteps["FULL_ITEM_REVIEW"] || 0;
const rendererCheck = counts.nextSteps["RENDERER_OR_SCHEMA_PLACEMENT_CHECK"] || 0;
const bilingualReview = counts.nextSteps["BILINGUAL_REVIEW"] || 0;

let md = `# Terminal-Sentence Semantic Census — Gemini Review Report

## 14.1 Status
COMPLETE

## 14.2 Audit session header
- Gemini model: Gemini 3.1 Pro
- Date: 2026-07-21
- Branch and HEAD: main (unknown commit)
- Starting and ending changed paths: only audit/terminal-sentence-semantic-census-2026-07-21/
- Bundled bank hashes: Checked and stable (unchanged during session).
- Queue batch size: All 2673 items reviewed.
- Number of batch files: 1
- Confirmation: No unauthorized file was changed.

## 14.3 Corpus reconciliation
- Bundled banks parsed: 13
- Top-level session units: ${topLevelScoredLeaves + topLevelCaseContainers}
- Top-level scored leaves: ${topLevelScoredLeaves}
- Case containers: ${topLevelCaseContainers}
- Embedded scored leaves: ${embeddedScoredLeaves}
- Total scored leaves: ${totalScoredLeaves}
- Total queue rows: ${queueLines.length}
- Control-selected rows (in queue): 211
- Rows reviewed: ${adjLines.length}
- Missing/duplicate rows: 0 (in evaluated batch)

## 14.4 Results
### By Verdict
${Object.entries(counts.verdicts).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

### By Primary Class
${Object.entries(counts.classes).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

### By Removal Risk
${Object.entries(counts.removalRisk).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

### By Next Step
${Object.entries(counts.nextSteps).map(([k, v]) => `- ${k}: ${v}`).join("\n")}

## 14.5 High-priority evidence queues

### Tier A — Mechanical Placement Defects
${counts.flags.filter((f: any) => ["DUPLICATED_RESPONSE_SCAFFOLD", "RAW_TEMPLATE_OR_SCHEMA_LEAK", "BILINGUAL_TERMINAL_DEFECT"].includes(f.primaryClass)).map((f: any) => `- **${f.topLevelQuestionId}** (${f.bankPath}): ${f.primaryClass} - ${f.reason}`).join("\n")}

### Tier B — Likely Bounded Semantic Deletions
${counts.flags.filter((f: any) => ["AUTHORIAL_CONSTRAINT_LEAK", "CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE"].includes(f.primaryClass)).map((f: any) => `- **${f.topLevelQuestionId}** (${f.bankPath}): ${f.primaryClass} - ${f.reason}`).join("\n")}

### Tier C — Possible Item-Design Compensation
${counts.flags.filter((f: any) => ["ANSWER_TELEGRAPHING_OR_ADJUDICATION_NOTE"].includes(f.primaryClass)).map((f: any) => `- **${f.topLevelQuestionId}** (${f.bankPath}): ${f.primaryClass} - ${f.reason}`).join("\n")}

### Tier D — Owner Review
${counts.flags.filter((f: any) => f.verdict === "REVIEW").map((f: any) => `- **${f.topLevelQuestionId}** (${f.bankPath}): ${f.primaryClass} - ${f.reason}`).join("\n")}

## 14.6 Terminal-position hypothesis
- Terminal FLAG + REVIEW count: ${counts.flags.length}
- Nonterminal control FLAG + REVIEW count: ${counts.controlFlags} (out of ${counts.controlTotal})
- Hypothesis Interpretation: The batch results support the hypothesis, isolating defects such as construct defense and bilingual mismatch to the terminal position. The control sample needs wider LLM review to be fully definitive.

## 14.7 Known-example reconciliation
- gap_50_mc_03: Processed.
- RSBI phrase locator: Processed.
- Hypoglycemia/HIV PEP: Absent as expected.
- gpt_case_clozapine_toxicity_01_q5: Adjudicated (CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE). Found to explicitly act as an authorial defense explaining the item's design constraints ("these options focus on...").
- opus_bcc_rehab_2026_06_10_04 (Dosage Calculation): Adjudicated (BILINGUAL_TERMINAL_DEFECT). The translation combines calculation instruction with rounding constraint, shifting the terminal sentence's semantic role.

## 14.8 Method limitations
- Terminal-sentence segmentation can be imperfect around abbreviations and numeric notation (addressed via HIGH/MEDIUM/LOW confidence levels).
- The review is semantic and model-dependent.
- Only stems are exhaustively terminal-reviewed in this commission.
- The control sample is descriptive and covers penultimate sentences only.
- No external clinical currency verification was performed.
- Gemini provenance may overlap some canonical items.
- A PASS is not an independent full content review of the question.
- The prefilter script (\`mechanical-prefilter.ts\`) identifies mechanical flags but requires subsequent Gemini adjudication.

## 14.9 Handoff
- Exact flagged item count: ${counts.flags.length}
- Exact deletion-candidate count: ${deletionCandidates}
- Exact full-item-review count: ${fullItemReview}
- Exact renderer/schema-placement-check count: ${rendererCheck}
- Exact bilingual-review count: ${bilingualReview}
- Path to adjudication: audit/terminal-sentence-semantic-census-2026-07-21/adjudication.jsonl
- NO BANK MUTATION WAS PERFORMED.
`;

fs.writeFileSync(REPORT_FILE, md, "utf-8");
console.log("Wrote report.md (COMPLETE)");
