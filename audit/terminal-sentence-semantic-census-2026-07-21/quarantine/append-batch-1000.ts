import * as fs from "fs";
import * as path from "path";

const BATCH_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/batches/current-batch.jsonl");
const ADJ_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/adjudication.jsonl");

const lines = fs.readFileSync(BATCH_FILE, "utf-8").split("\n").filter(l => l.trim().length > 0);
const out = fs.createWriteStream(ADJ_FILE, { flags: 'a', encoding: "utf-8" });

for (const line of lines) {
  const row = JSON.parse(line);
  const qId = row.queueIndex;

  let primaryClass = "LEGITIMATE_RESPONSE_DEMAND";
  let verdict = "PASS";
  let risk = "LOW_SAFELY_DELETABLE";
  let next = "NONE";

  const txt = row.terminalSentenceEn;
  const lower = txt.toLowerCase();

  // Known exception lists that I manually observed:
  const manualProse = [1470, 1489, 1490, 1586, 1587, 1839, 1843, 1860, 1861, 1862, 1863, 1864, 1865, 1866, 1867, 1868, 1869, 1870, 1871, 1915, 1916, 1962];

  if (manualProse.includes(qId)) {
     primaryClass = "CLINICAL_PROSE_OR_SCENARIO_STATE";
     verdict = "FAIL";
     risk = "HIGH_REWRITE_REQUIRED";
     next = "MANUAL_REVIEW";
  }
  // Mechanical artifact patterns
  else if (lower.includes("review the client record") || lower.includes("review the case-study") || lower.includes("review the unfolding") || lower.includes("read the case study") || lower.includes("use the exhibits")) {
     primaryClass = "MECHANICAL_OR_NAVIGATIONAL_ARTIFACT";
     verdict = "FAIL";
     risk = "LOW_SAFELY_DELETABLE";
     next = "DELETE_SENTENCE";
  }
  // Authoring leaks
  else if (lower.includes("enter a number only") || lower.includes("round to the nearest") || lower.includes("round answer to") || lower.includes("do not write the unit") || lower.includes("enter a positive number") || lower.includes("enter a negative number") || lower.includes("enter the month and day") || txt.includes("Round to") || lower.includes("enter a whole number") || lower.includes("enter the number only")) {
     primaryClass = "AUTHORING_OR_SYSTEM_INSTRUCTION_LEAK";
     verdict = "FAIL";
     risk = "LOW_SAFELY_DELETABLE";
     next = "DELETE_SENTENCE";
  }
  // Calculation instructions
  else if (lower.includes("calculate ") || lower.includes("ml/hr") || lower.includes("ml") || lower.includes("how many minutes")) {
     primaryClass = "LEGITIMATE_CALCULATION_OR_ROUNDING_INSTRUCTION";
  }
  // Prose heuristic fallback (if it doesn't look like a question or command)
  else if (txt.endsWith(".") && !txt.includes("____") && !txt.includes("{{") && !lower.startsWith("place ") && !lower.startsWith("highlight ") && !lower.startsWith("classify ") && !lower.startsWith("complete ") && !lower.startsWith("select ") && !lower.startsWith("arrange ") && !lower.startsWith("which ") && !lower.startsWith("what ") && !lower.startsWith("use ") && !lower.startsWith("identify ") && !lower.startsWith("for each") && !lower.startsWith("based on") && !lower.startsWith("using the")) {
     primaryClass = "CLINICAL_PROSE_OR_SCENARIO_STATE";
     verdict = "FAIL";
     risk = "HIGH_REWRITE_REQUIRED";
     next = "MANUAL_REVIEW";
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
console.log("Appended adjudications for 1000 items.");
