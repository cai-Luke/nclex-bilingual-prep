import assert from "node:assert/strict";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { captureAttempt, questionFingerprint, makeCompletedSet } from "../../src/completedMemory.ts";
import { getCorrectAnswer } from "../../src/grading.ts";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const all = readdirSync("banks")
  .filter((f) => f.endsWith(".json"))
  .flatMap((f) => JSON.parse(readFileSync(`banks/${f}`)).questions);
const qs = [...new Set(all.map((q) => q.itemType))].map((type) => all.find((q) => q.itemType === type));
const s = {
  id: "historical-grader-proof",
  mode: "study",
  questionIds: qs.map((q) => q.id),
  poolIds: qs.map((q) => q.id),
  index: 0,
  answers: {},
  results: {},
  scores: {},
  attempts: {},
  fingerprints: Object.fromEntries(qs.map((q) => [q.id, questionFingerprint(q)])),
  languageMode: "on-tap",
  title: "Historical grading proof",
  startedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  launchIntent: "ordinary",
};
for (const q of qs) {
  const a = captureAttempt(s, q, getCorrectAnswer(q));
  s.attempts[q.id] = a;
  s.results[q.id] = a.result;
  s.scores[q.id] = a.score;
}
const record = makeCompletedSet(s, "finished");
const b = await chromium.launch({ channel: "chrome", headless: true });
const p = await b.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
await p.route("**/src/grading.ts", async (route) => {
  const response = await route.fetch();
  let body = await response.text();
  for (const name of ["gradeQuestion", "scoreQuestion", "gradeStandaloneQuestion"]) {
    const token = `export const ${name} = `;
    assert.equal(body.split(token).length, 2);
    body = body.replace(
      token,
      `export const ${name} = (...args) => { if (globalThis.__forbidGrade) throw new Error('Historical regrade: ${name}'); return original_${name}(...args); }; const original_${name} = `,
    );
  }
  await route.fulfill({ response, body });
});
try {
  await p.goto("http://127.0.0.1:4181");
  await p.getByRole("button", { name: "Start practice · 50 questions", exact: true }).waitFor();
  await p.evaluate(async (record) => {
    const db = await new Promise((resolve) => {
      const r = indexedDB.open("nclex-bilingual-prep");
      r.onsuccess = () => resolve(r.result);
    });
    const tx = db.transaction(["completedSets", "activeSession"], "readwrite");
    tx.objectStore("activeSession").clear();
    tx.objectStore("completedSets").put(record);
    await new Promise((resolve) => (tx.oncomplete = resolve));
    db.close();
  }, record);
  await p.reload();
  await p.locator(".last-set-entry").waitFor();
  await p.evaluate(() => (globalThis.__forbidGrade = true));
  await p.locator(".last-set-entry").click();
  for (const row of await p.locator(".summary-review-toggle").all()) await row.click();
  assert.equal(await p.locator(".summary-review-body .question-card").count(), qs.length);
  assert.deepEqual(errors, []);
  writeFileSync(
    "audit/review-vocab-omnibus-r1/historical-grader-proof.json",
    JSON.stringify({ itemTypes: qs.map((q) => q.itemType), throwingGraderControl: true, errors }, null, 2),
  );
  console.log(
    "PASS historical viewer opens all nine item types with all current grading entrypoints set to throw",
  );
} finally {
  await b.close();
}
