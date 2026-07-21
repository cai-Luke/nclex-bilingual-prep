import * as fs from "fs";
import * as path from "path";

const QUEUE_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/queue.jsonl");
const BATCH_FILE = path.join(process.cwd(), "audit/terminal-sentence-semantic-census-2026-07-21/batches/batch-001.jsonl");

const TARGET_INDICES = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 69, 1731]);

const lines = fs.readFileSync(QUEUE_FILE, "utf-8").split("\n").filter(l => l.trim().length > 0);
const out = fs.createWriteStream(BATCH_FILE, { encoding: "utf-8" });

let extracted = 0;
for (const line of lines) {
  const row = JSON.parse(line);
  if (TARGET_INDICES.has(row.queueIndex)) {
    out.write(JSON.stringify(row) + "\n");
    extracted++;
  }
}
out.end();
console.log(`Extracted ${extracted} rows to batch-001.jsonl.`);
