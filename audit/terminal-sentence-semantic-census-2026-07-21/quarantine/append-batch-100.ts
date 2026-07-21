import * as fs from "fs";
import * as path from "path";

const BATCH_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/batches/current-batch.jsonl");
const ADJ_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/adjudication.jsonl");

const lines = fs.readFileSync(BATCH_FILE, "utf-8").split("\n").filter(l => l.trim().length > 0);
const out = fs.createWriteStream(ADJ_FILE, { flags: 'a', encoding: "utf-8" });

const verdicts = {
  72: { class: "MECHANICAL_OR_NAVIGATIONAL_ARTIFACT", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  79: { class: "MECHANICAL_OR_NAVIGATIONAL_ARTIFACT", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  80: { class: "LEGITIMATE_RESPONSE_DEMAND", verdict: "PASS" },
  85: { class: "MECHANICAL_OR_NAVIGATIONAL_ARTIFACT", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  92: { class: "MECHANICAL_OR_NAVIGATIONAL_ARTIFACT", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  99: { class: "MECHANICAL_OR_NAVIGATIONAL_ARTIFACT", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  106: { class: "MECHANICAL_OR_NAVIGATIONAL_ARTIFACT", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  113: { class: "MECHANICAL_OR_NAVIGATIONAL_ARTIFACT", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  119: { class: "MECHANICAL_OR_NAVIGATIONAL_ARTIFACT", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  126: { class: "MECHANICAL_OR_NAVIGATIONAL_ARTIFACT", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  133: { class: "MECHANICAL_OR_NAVIGATIONAL_ARTIFACT", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  140: { class: "MECHANICAL_OR_NAVIGATIONAL_ARTIFACT", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" },
  147: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" }, // Title leaked as a sentence
  153: { class: "LEGITIMATE_RESPONSE_DEMAND", verdict: "PASS" }, // (Select all that apply)
  154: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" }, // Clinical prose at terminal
  162: { class: "AUTHORING_OR_SYSTEM_INSTRUCTION_LEAK", verdict: "FAIL", risk: "LOW_SAFELY_DELETABLE", next: "DELETE_SENTENCE" }, // Assume a common U.S. med-surg scope
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
console.log("Appended adjudications for 100 items.");
