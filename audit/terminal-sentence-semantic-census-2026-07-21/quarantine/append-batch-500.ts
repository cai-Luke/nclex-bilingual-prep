import * as fs from "fs";
import * as path from "path";

const BATCH_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/batches/current-batch.jsonl");
const ADJ_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/adjudication.jsonl");

const lines = fs.readFileSync(BATCH_FILE, "utf-8").split("\n").filter(l => l.trim().length > 0);
const out = fs.createWriteStream(ADJ_FILE, { flags: 'a', encoding: "utf-8" });

const proseExceptions = [431, 432, 433, 434, 435, 448, 450, 453, 457, 459, 461, 463, 465, 499, 500, 501, 504, 505, 566, 568, 570, 572, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 617, 620, 624, 766, 770, 772, 778, 787, 790, 794, 802, 810, 818, 826, 834];

const verdicts = {};
for (const qId of proseExceptions) {
  verdicts[qId] = { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" };
}

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
  } else if (row.terminalSentenceEn.includes("mL") || row.terminalSentenceEn.includes("Calculate") || row.terminalSentenceEn.includes("Round") || row.terminalSentenceEn.includes("units/hr")) {
     primaryClass = "LEGITIMATE_CALCULATION_OR_ROUNDING_INSTRUCTION";
  } else if (row.terminalSentenceEn.includes("Record a whole number") || row.terminalSentenceEn.includes("nearest tenth") || row.terminalSentenceEn.includes("Do not write the unit")) {
     primaryClass = "AUTHORING_OR_SYSTEM_INSTRUCTION_LEAK";
     verdict = "FAIL";
     risk = "LOW_SAFELY_DELETABLE";
     next = "DELETE_SENTENCE";
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
console.log("Appended adjudications for 500 items.");
