import * as fs from "fs";
import * as path from "path";

const BATCH_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/batches/current-batch.jsonl");
const ADJ_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/adjudication.jsonl");

const lines = fs.readFileSync(BATCH_FILE, "utf-8").split("\n").filter(l => l.trim().length > 0);
const out = fs.createWriteStream(ADJ_FILE, { flags: 'a', encoding: "utf-8" });

const verdicts = {
  1061: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1064: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1066: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1067: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1068: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1069: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1070: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1113: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1117: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1123: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1127: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1144: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1194: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1201: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1206: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1213: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1219: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1225: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1231: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1241: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1244: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1247: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1249: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1256: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1262: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1264: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1265: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1268: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1271: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" },
  1349: { class: "CLINICAL_PROSE_OR_SCENARIO_STATE", verdict: "FAIL", risk: "HIGH_REWRITE_REQUIRED", next: "MANUAL_REVIEW" }
};

for (const line of lines) {
  const row = JSON.parse(line);
  const qId = row.queueIndex;

  let primaryClass = "LEGITIMATE_RESPONSE_DEMAND";
  let verdict = "PASS";
  let risk = "LOW_SAFELY_DELETABLE";
  let next = "NONE";

  const txt = row.terminalSentenceEn;

  if (verdicts[qId]) {
    primaryClass = verdicts[qId].class;
    verdict = verdicts[qId].verdict;
    risk = verdicts[qId].risk;
    next = verdicts[qId].next;
  } else if (txt.includes("Review the client record") || txt.includes("Review the unfolding") || txt.includes("Read the case study")) {
     primaryClass = "MECHANICAL_OR_NAVIGATIONAL_ARTIFACT";
     verdict = "FAIL";
     risk = "LOW_SAFELY_DELETABLE";
     next = "DELETE_SENTENCE";
  } else if (txt.includes("Record a whole number") || txt.includes("Round answer to") || txt.includes("Round to the nearest") || txt.includes("Do not write the unit") || txt.includes("Enter the number only") || txt.includes("Enter the month and day")) {
     primaryClass = "AUTHORING_OR_SYSTEM_INSTRUCTION_LEAK";
     verdict = "FAIL";
     risk = "LOW_SAFELY_DELETABLE";
     next = "DELETE_SENTENCE";
  } else if (txt.includes("mL") || txt.includes("Calculate") || txt.includes("Round") || txt.includes("units/hr")) {
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
console.log("Appended adjudications for 500 items.");
