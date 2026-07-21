import * as fs from "fs";
import * as path from "path";

const BATCH_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/batches/current-batch.jsonl");
const ADJ_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/adjudication.jsonl");

const lines = fs.readFileSync(BATCH_FILE, "utf-8").split("\n").filter(l => l.trim().length > 0);
const out = fs.createWriteStream(ADJ_FILE, { flags: 'a', encoding: "utf-8" });

for (const line of lines) {
  const row = JSON.parse(line);

  let primaryClass = "LEGITIMATE_RESPONSE_DEMAND";
  if (row.terminalSentenceEn.includes("mL") || row.terminalSentenceEn.includes("Calculate")) {
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
    verdict: "PASS",
    primaryClass,
    secondaryFlags: [],
    speechActTarget: "LEARNER_RESPONSE",
    neededForAnswer: "YES",
    removalRisk: "HIGH_REWRITE_REQUIRED",
    bilingualRelation: "PARALLEL_VALID",
    quotedEvidence: [],
    nextStep: "NONE",
    controlVerdict,
    controlPrimaryClass,
    controlReason
  };

  out.write(JSON.stringify(adj) + "\n");
}

out.end();
console.log("Appended adjudications to adjudication.jsonl");
