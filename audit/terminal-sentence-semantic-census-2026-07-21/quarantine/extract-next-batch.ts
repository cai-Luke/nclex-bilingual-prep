import * as fs from "fs";
import * as path from "path";

const QUEUE_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/queue.jsonl");
const ADJ_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/adjudication.jsonl");
const BATCH_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/batches/current-batch.jsonl");

const adjLines = fs.readFileSync(ADJ_FILE, "utf-8").split("\n").filter(l => l.trim().length > 0);
const adjudicatedIndices = new Set(adjLines.map(l => JSON.parse(l).queueIndex));

const queueLines = fs.readFileSync(QUEUE_FILE, "utf-8").split("\n").filter(l => l.trim().length > 0);

const out = fs.createWriteStream(BATCH_FILE, { encoding: "utf-8" });

let extracted = 0;
for (const line of queueLines) {
  const row = JSON.parse(line);
  if (!adjudicatedIndices.has(row.queueIndex)) {
    out.write(JSON.stringify(row) + "\n");
    extracted++;
    if (extracted >= 1000) { // batch of 1000
      break;
    }
  }
}
out.end();
console.log(`Extracted ${extracted} unreviewed rows to current-batch.jsonl.`);
