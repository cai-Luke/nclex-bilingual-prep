import * as fs from "fs";
import * as path from "path";

const QUEUE_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/queue.jsonl");
const PREFILTER_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/prefilter-signals.jsonl");

function generatePrefilter(row: any) {
  const terminalEn = row.terminalSentenceEn || "";
  const signals = row.mechanicalSignals || {};

  let suggestedFlags: string[] = [];

  if (row.topLevelQuestionId === "gap_50_mc_03" || signals.exactEnglishTerminalRepeatedElsewhereInItem) {
    suggestedFlags.push("DUPLICATED_RESPONSE_SCAFFOLD");
  }
  if (terminalEn.includes("This item asks only for") || /(sole readiness criterion|sole criterion)/i.test(terminalEn)) {
    suggestedFlags.push("CONSTRUCT_SCOPE_OR_SOURCE_DEFENSE");
  }
  if (signals.terminalContainsRawPlaceholder) {
    suggestedFlags.push("RAW_TEMPLATE_OR_SCHEMA_LEAK");
  }
  if (/(do not independently prescribe|do not alter|do not independently|only the provider)/i.test(terminalEn)) {
    suggestedFlags.push("AUTHORIAL_CONSTRAINT_LEAK");
  }
  if (/(do not delay indicated PEP|are separate processes)/i.test(terminalEn)) {
    suggestedFlags.push("ANSWER_TELEGRAPHING_OR_ADJUDICATION_NOTE");
  }
  if (!signals.bilingualSentenceAlignmentMatch) {
    suggestedFlags.push("BILINGUAL_TERMINAL_DEFECT");
  }

  return {
    queueIndex: row.queueIndex,
    suggestedFlags,
    prefilterEvidence: "Mechanically seeded based on regex and structural signals. Requires Gemini semantic review for verdict."
  };
}

async function main() {
  const lines = fs.readFileSync(QUEUE_FILE, "utf-8").split("\n").filter(l => l.trim().length > 0);
  const out = fs.createWriteStream(PREFILTER_FILE, { encoding: "utf-8" });

  for (const line of lines) {
    const row = JSON.parse(line);
    const pre = generatePrefilter(row);
    out.write(JSON.stringify(pre) + "\n");
  }

  out.end();
  console.log(`Generated prefilter signals for ${lines.length} rows.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
