import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { questionFingerprint } from "../../src/completedMemory.ts";
import { getCorrectAnswer } from "../../src/grading.ts";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.OMNIBUS_URL || "http://127.0.0.1:4182";
const out = "audit/review-vocab-omnibus-r1";
const q = JSON.parse(readFileSync("banks/burn-canonical.json")).questions.find(
  (q) => q.id === "burn_mc_resuscitation_threshold_02",
);
const browser = await chromium.launch({ channel: "chrome", headless: true });
const checks = [];
const pass = (name, data = {}) => {
  checks.push({ name, ...data });
  console.log("PASS", name);
};
const snapshot = (id) => ({
  id,
  mode: "study",
  questionIds: [q.id],
  poolIds: [q.id],
  index: 0,
  answers: { [q.id]: getCorrectAnswer(q) },
  results: {},
  scores: {},
  attempts: {},
  fingerprints: { [q.id]: questionFingerprint(q) },
  skippedQuestionIds: [],
  phase: "questions",
  languageMode: "on-tap",
  title: id,
  startedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  launchIntent: "ordinary",
  returnView: "home",
  requestedCount: 1,
});
const button = (p, name) => p.getByRole("button", { name, exact: true });
async function rows(p, name) {
  return p.evaluate(async (name) => {
    const db = await new Promise((resolve, reject) => {
      const r = indexedDB.open("nclex-bilingual-prep");
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    const rows = await new Promise((resolve, reject) => {
      const r = db.transaction(name).objectStore(name).getAll();
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    db.close();
    return rows;
  }, name);
}
async function seed(p, s) {
  await p.evaluate(async (s) => {
    localStorage.setItem("completed-memory-notice", "dismissed");
    const db = await new Promise((resolve) => {
      const r = indexedDB.open("nclex-bilingual-prep");
      r.onsuccess = () => resolve(r.result);
    });
    const tx = db.transaction("activeSession", "readwrite");
    tx.objectStore("activeSession").clear();
    tx.objectStore("activeSession").put(s);
    await new Promise((resolve) => (tx.oncomplete = resolve));
    db.close();
  }, s);
  await p.reload();
  await button(p, "Continue set / 继续练习").click();
}
try {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(base);
  await button(p, "Start practice · 50 questions").waitFor();
  await seed(p, snapshot("previous"));
  await button(p, "Submit answer").click();
  await p.locator(".answer-banner").waitFor();
  await button(p, "Finish").click();
  await p.getByRole("heading", { name: "Your answers / 本次作答" }).waitFor();
  await seed(p, snapshot("archive-abort"));
  await button(p, "Submit answer").click();
  await p.locator(".answer-banner").waitFor();
  await p.evaluate(() => {
    window.__nativePut = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      const req = window.__nativePut.apply(this, args);
      if (this.name === "completedSets") this.transaction.abort();
      return req;
    };
  });
  await button(p, "Finish").click();
  await p
    .getByText("This set is available for this visit only. It could not be saved on this device.")
    .waitFor();
  assert.equal((await rows(p, "completedSets"))[0].sessionId, "previous");
  assert.equal((await rows(p, "activeSession"))[0].id, "archive-abort");
  await p.screenshot({ path: `out/review-failure.png`.replace("out", out) });
  await p.evaluate(() => (IDBObjectStore.prototype.put = window.__nativePut));
  await button(p, "Retry save").click();
  await button(p, "Retry save").waitFor({ state: "hidden" });
  assert.equal((await rows(p, "completedSets"))[0].sessionId, "archive-abort");
  assert.equal((await rows(p, "activeSession")).length, 0);
  assert.deepEqual(errors, []);
  pass(
    "Browser archive abort preserves previous durable Last set and active record; idempotent Retry save succeeds",
  );
  // Delayed hydration gates all starts, then uses uploaded records and migrated/current progress.
  await p.addInitScript(() => {
    if (localStorage.getItem("hold-hydration") !== "yes") return;
    window.__releases = [];
    const get = IDBObjectStore.prototype.getAll;
    IDBObjectStore.prototype.getAll = function (...args) {
      const req = get.apply(this, args);
      if (["progress", "flags", "uploadedQuestions"].includes(this.name)) {
        const add = req.addEventListener.bind(req);
        req.addEventListener = (type, listener, options) =>
          add(
            type,
            type === "success" ? (e) => window.__releases.push(() => listener.call(req, e)) : listener,
            options,
          );
      }
      return req;
    };
  });
  await p.evaluate(() => localStorage.setItem("hold-hydration", "yes"));
  await p.reload();
  await button(p, "Start practice · 50 questions").waitFor();
  assert.equal(await button(p, "Start practice · 50 questions").isDisabled(), true);
  await p.evaluate(() => {
    localStorage.removeItem("hold-hydration");
    window.__releases.splice(0).forEach((f) => f());
  });
  await button(p, "Start practice · 50 questions").waitFor();
  await p.waitForFunction(
    () =>
      !Array.from(document.querySelectorAll("button")).find((b) =>
        b.textContent.includes("Start practice · 50 questions"),
      )?.disabled,
  );
  pass("Learner hydration barrier disables session starts until durable progress, flags and uploads load");
  await ctx.close();
  // Hold the old version open in another tab so the actual browser sends onblocked.
  const blocked = await browser.newContext();
  const holder = await blocked.newPage();
  await holder.route("**/seed-empty", (r) =>
    r.fulfill({ body: "<html>seed</html>", contentType: "text/html" }),
  );
  await holder.goto(`${base}/seed-empty`);
  await holder.evaluate(async () => {
    window.__oldDb = await new Promise((resolve) => {
      const r = indexedDB.open("nclex-bilingual-prep", 5);
      r.onupgradeneeded = () => {
        for (const [name, key] of [
          ["progress", "questionId"],
          ["flags", "questionId"],
          ["activeSession", "id"],
          ["answerEvents", "id"],
          ["uploadedQuestions", "id"],
          ["flashcardProgress", "termId"],
          ["languageMisses", "questionId"],
          ["translationRevealEvents", "id"],
          ["caseAnswerPartEvents", "id"],
        ])
          r.result.createObjectStore(name, { keyPath: key });
      };
      r.onsuccess = () => resolve(r.result);
    });
  });
  const bp = await blocked.newPage();
  await bp.goto(base);
  await bp.getByText(/Storage upgrade is blocked/).waitFor();
  await bp.screenshot({ path: `${out}/blocked-upgrade.png` });
  await holder.evaluate(() => window.__oldDb.close());
  await bp.reload();
  await button(bp, "Start practice · 50 questions").waitFor();
  assert.equal(await bp.getByText(/Storage upgrade is blocked/).count(), 0);
  pass("Real blocked DB v5→v6 upgrade is explicit, closes cleanly and recovers on reload");
  await blocked.close();
  // Built file URL with real durable IndexedDB, completion and reload.
  const files = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const fp = await files.newPage();
  const fileErrors = [];
  fp.on("pageerror", (e) => fileErrors.push(e.message));
  await fp.goto(`file://${resolve("dist/index.html")}`);
  await button(fp, "Start practice · 50 questions").waitFor();
  await seed(fp, snapshot("file-primary"));
  await button(fp, "Submit answer").click();
  await fp.locator(".answer-banner").waitFor();
  await button(fp, "Finish").click();
  await fp.getByRole("heading", { name: "Your answers / 本次作答" }).waitFor();
  assert.equal((await rows(fp, "completedSets"))[0].sessionId, "file-primary");
  await fp.reload();
  await fp.locator(".last-set-entry").click();
  await fp.getByRole("heading", { name: "Your answers / 本次作答" }).waitFor();
  await fp.locator(".summary-review-toggle").click();
  assert.equal(await fp.locator(".answer-banner").count(), 1);
  assert.equal((await rows(fp, "answerEvents")).length, 1);
  await fp.screenshot({ path: `${out}/file-completed.png` });
  assert.deepEqual(fileErrors, []);
  pass("Built file://: bundled bank, durable submit, Last set archive and full reload rendering", {
    durableIndexedDB: true,
  });
  await files.close();
  // Storage denied by throwing property getters, as well as file protocol.
  const denied = await browser.newContext();
  await denied.addInitScript(() => {
    Object.defineProperty(window, "indexedDB", {
      get() {
        throw new DOMException("Denied", "SecurityError");
      },
    });
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Denied", "SecurityError");
      },
    });
  });
  const dp = await denied.newPage();
  const deniedErrors = [];
  dp.on("pageerror", (e) => deniedErrors.push(e.message));
  await dp.goto(`file://${resolve("dist/index.html")}`);
  await button(dp, "Start practice · 50 questions").waitFor();
  await dp.getByText(/Changes are available for this visit only/).waitFor();
  await button(dp, "Start practice · 50 questions").click();
  await dp.locator(".session-shell").waitFor();
  await button(dp, "End set").click();
  await dp.getByRole("heading", { name: "Your answers / 本次作答" }).waitFor();
  await dp
    .getByText("This set is available for this visit only. It could not be saved on this device.")
    .waitFor();
  assert.deepEqual(deniedErrors, []);
  pass("Built file:// with IndexedDB and localStorage denied remains usable and explicitly memory-only");
  await denied.close();
  writeFileSync(`${out}/lifecycle-browser-results.json`, JSON.stringify({ checks }, null, 2));
} finally {
  await browser.close();
}
