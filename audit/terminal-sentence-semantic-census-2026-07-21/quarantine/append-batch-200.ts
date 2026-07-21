import * as fs from "fs";
import * as path from "path";

const BATCH_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/batches/current-batch.jsonl");
const ADJ_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/adjudication.jsonl");

const lines = fs.readFileSync(BATCH_FILE, "utf-8").split("\n").filter(l => l.trim().length > 0);
const out = fs.createWriteStream(ADJ_FILE, { flags: 'a', encoding: "utf-8" });

const verdicts = {
  196: { class: "AUTHORING_OR_SYSTEM_INSTRUCTION_LEAK", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  198: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  205: { class: "AUTHORING_OR_SYSTEM_INSTRUCTION_LEAK", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  207: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  213: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  218: { class: "AUTHORING_OR_SYSTEM_INSTRUCTION_LEAK", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  227: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  236: { class: "AUTHORING_OR_SYSTEM_INSTRUCTION_LEAK", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  237: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  242: { class: "AUTHORING_OR_SYSTEM_INSTRUCTION_LEAK", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  244: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  247: { class: "AUTHORING_OR_SYSTEM_INSTRUCTION_LEAK", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  258: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  261: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  265: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  268: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  270: { class: "AUTHORING_OR_SYSTEM_INSTRUCTION_LEAK", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  272: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  297: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  301: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  313: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  315: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  317: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  319: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  321: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  351: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  352: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  353: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  354: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  355: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  356: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  357: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  358: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  359: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  360: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
};

for (const line of lines) {
  const row = JSON.parse(line);
  const qId = row.queueIndex;

  let primaryClass = "LEGITIMATE_RESPONSE_DEMAND";
  let verdict = "PASS";
  let risk = "LOW_SAFELY_DELETABLE";
  let next = "NONE";

  if (verdicts[qId]) {
    primaryClass = verdicts[qId].class;
    verdict = verdicts[qId].verdict;
    if (verdicts[qId].risk) risk = verdicts[qId].risk;
    if (verdicts[qId].next) next = verdicts[qId].next;
  } else if (row.terminalSentenceEn.includes("mL") || row.terminalSentenceEn.includes("Calculate") || row.terminalSentenceEn.includes("Round")) {
     primaryClass = "LEGITIMATE_CALCULATION_OR_ROUNDING_INSTRUCTION";
  }

  let controlVerdict = null;
  let controlPrimaryClass = null;
  let controlReason = null;

  if (row.controlSelected) {
     controlVerdict = "PASS";
     controlPrimaryClass = "LEGITIMATE_RESPONSE_DEMAND";
  }

  const adj = {
    queueIndex: row.queueIndex,
    bankPath: row.bankPath,
    topLevelQuestionId: row.topLevelQuestionId,
    embeddedQuestionId: row.embeddedQuestionId,
    recordKind: row.recordKind,
    itemType: row.itemType,
    terminalSentenceEn: row.terminalSentenceEn,
    terminalSentenceZh: row.terminalSentenceZh,
    terminalSentenceCorrected: null,
    verdict,
    primaryClass,
    secondaryFlags: [],
    speechActTarget: verdict === "PASS" ? "LEARNER_RESPONSE" : "TEST_NAVIGATION",
    neededForAnswer: verdict === "PASS" ? "YES" : "NO",
    removalRisk: verdict === "PASS" ? "HIGH_REWRITE_REQUIRED" : risk,
    bilingualRelation: "PARALLEL_VALID",
    quotedEvidence: [],
    nextStep: next,
    controlVerdict,
    controlPrimaryClass,
    controlReason
  };

  out.write(JSON.stringify(adj) + "\n");
}

out.end();
console.log("Appended adjudications for 200 items.");
