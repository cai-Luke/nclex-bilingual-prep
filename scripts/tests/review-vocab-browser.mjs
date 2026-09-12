// Run after build, with a preview server. PLAYWRIGHT_MODULE may point to a local installation.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { questionFingerprint, captureAttempt } from "../../src/completedMemory.ts";
import { getCorrectAnswer, getInitialAnswer } from "../../src/grading.ts";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.OMNIBUS_URL || "http://127.0.0.1:4182";
const out = "audit/review-vocab-omnibus-r1";
mkdirSync(out, { recursive: true });
const questions = readdirSync("banks")
  .filter((f) => f.endsWith(".json"))
  .flatMap((f) => JSON.parse(readFileSync(`banks/${f}`)).questions);
const q = questions.find((q) => q.id === "burn_mc_resuscitation_threshold_02");
const caseQ = questions.find((q) => q.id === "opus2_case_code_status_01");
const ordered = questions.find((q) => q.itemType === "ordered_response");
const partial = questions.find((q) => q.itemType === "select_all" && q.correct.length > 1);
const matrix = questions.find((q) => q.itemType === "matrix");
const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
page.setDefaultTimeout(12000);
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const checks = [];
const pass = (name, data = {}) => {
  checks.push({ name, ...data });
  console.log("PASS", name);
};
const nav = (name) =>
  page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name, exact: true });
const btn = (name) => page.getByRole("button", { name, exact: true });
const shot = (name) => page.screenshot({ path: `${out}/${name}.png`, fullPage: false });
const snapshot = (id, question = q, extra = {}) => ({
  id,
  mode: "study",
  questionIds: [question.id],
  poolIds: [question.id],
  index: 0,
  answers: {},
  results: {},
  scores: {},
  attempts: {},
  fingerprints: { [question.id]: questionFingerprint(question) },
  skippedQuestionIds: [],
  phase: "questions",
  languageMode: "on-tap",
  title: id,
  startedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  launchIntent: "ordinary",
  returnView: "home",
  requestedCount: 1,
  ...extra,
});
async function read(store) {
  return page.evaluate(async (name) => {
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
  }, store);
}
async function seed(stores, settings = { languageMode: "on-tap", revisitMissed: true }) {
  await page.evaluate(
    async ({ stores, settings }) => {
      localStorage.setItem("nclex-settings", JSON.stringify(settings));
      localStorage.setItem("completed-memory-notice", "dismissed");
      const db = await new Promise((resolve) => {
        const r = indexedDB.open("nclex-bilingual-prep");
        r.onsuccess = () => resolve(r.result);
      });
      const tx = db.transaction(Object.keys(stores), "readwrite");
      for (const [name, rows] of Object.entries(stores)) {
        const st = tx.objectStore(name);
        st.clear();
        rows.forEach((row) => st.put(row));
      }
      await new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      db.close();
    },
    { stores, settings },
  );
  await page.reload();
  await btn("Start practice · 50 questions").waitFor();
}
async function resume(s) {
  await seed({ activeSession: [s] });
  await btn("Continue set / 继续练习").click();
  await page.locator(".session-shell").waitFor();
}
async function archiveMiss(id = "primary-miss", question = q) {
  const wrong = getInitialAnswer(question);
  if (question.itemType === "multiple_choice")
    wrong.optionIds = [question.options.find((o) => !question.correct.includes(o.id)).id];
  await resume(snapshot(id, question, { answers: { [question.id]: wrong } }));
  await btn(question.itemType === "case_study" ? "Submit all parts" : "Submit answer").click();
  await page.locator(".answer-banner").waitFor();
  await btn("Finish").click();
  await page.getByRole("heading", { name: "Your answers / 本次作答" }).waitFor();
}
try {
  await page.goto(base);
  await btn("Start practice · 50 questions").waitFor();
  assert.equal(await nav("Vocab").count(), 0);
  assert.equal(await nav("Review").count(), 0);
  assert.equal(await nav("Telemetry").count(), 0);
  await nav("Progress").waitFor();
  await nav("Customize").waitFor();
  pass("Retired destinations absent; Customize and factual Progress survive");
  // Queue a long-lived transaction ahead of the app submission, delaying real durable I/O.
  await seed({
    activeSession: [snapshot("delayed-submit", { ...q }, { answers: { [q.id]: getCorrectAnswer(q) } })],
    progress: [],
    answerEvents: [],
    completedSets: [],
  });
  await btn("Continue set / 继续练习").click();
  await page.evaluate(async () => {
    const db = await new Promise((resolve) => {
      const r = indexedDB.open("nclex-bilingual-prep");
      r.onsuccess = () => resolve(r.result);
    });
    const tx = db.transaction(["progress", "answerEvents", "activeSession"], "readwrite");
    const st = tx.objectStore("progress");
    const until = performance.now() + 650;
    function keep() {
      const r = st.get("delay");
      r.onsuccess = () => {
        if (performance.now() < until) keep();
      };
    }
    keep();
    tx.oncomplete = () => db.close();
  });
  await btn("Submit answer").evaluate((el) => {
    el.click();
    el.click();
    el.click();
  });
  await page.locator(".answer-banner").waitFor();
  assert.equal((await read("answerEvents")).length, 1);
  assert.equal((await read("progress"))[0].seen, 1);
  const committed = (await read("activeSession"))[0];
  assert.ok(committed.attempts[q.id]);
  await page.reload();
  await btn("Continue set / 继续练习").click();
  await page.locator(".answer-banner").waitFor();
  assert.equal(await btn("Submit answer").count(), 0);
  assert.equal((await read("answerEvents")).length, 1);
  await btn("Finish").click();
  await page.getByRole("heading", { name: "Your answers / 本次作答" }).waitFor();
  assert.equal((await read("completedSets")).length, 1);
  assert.equal((await read("activeSession")).length, 0);
  pass("Delayed triple submit: one durable answerEvent; captured answer and result survive crash/reload", {
    eventCount: 1,
    delayMs: 650,
  });
  await archiveMiss();
  assert.equal(
    await page.locator(".summary-review-toggle .chinese-line").count(),
    0,
    "collapsed Summary on-tap stays English",
  );
  const primary = (await read("completedSets"))[0];
  assert.equal(primary.sessionId, "primary-miss");
  await page.locator(".summary-review-toggle").click();
  assert.ok(await page.locator(".summary-review-body .inline-reveal").count());
  await page.locator(".summary-review-body .stem .inline-reveal").click();
  assert.ok(await page.locator(".summary-review-body .stem .chinese-line").count());
  const reveal = page.getByRole("button", { name: /Translate all|显示全部中文|Show all Chinese/ });
  if (await reveal.count()) await reveal.first().click();
  await page
    .locator('.completed-set [aria-label="Chinese display"]')
    .getByRole("button", { name: "EN", exact: true })
    .click();
  const term = page.locator(".summary-review-body .term-button").first();
  if (await term.count()) {
    await term.click();
    assert.ok(await page.locator(".term-popover").isVisible());
  }
  assert.equal(
    (await read("answerEvents")).filter((e) => e.sessionId === "primary-miss").length,
    1,
    "inspection/reveal/glossary never submit",
  );
  await shot("desktop-completed");
  pass(
    "Collapsed Summary fix, on-tap reveal and explicit glossary help in ambient Off survive telemetry removal",
  );
  await btn("Try again").click();
  await page.locator(".session-shell").waitFor();
  assert.equal((await read("activeSession"))[0].launchIntent, "remediation");
  await page
    .locator(".option-row")
    .filter({ hasText: q.options.find((o) => q.correct.includes(o.id)).en })
    .click();
  await btn("Submit answer").click();
  await page.locator(".answer-banner").waitFor();
  await btn("Finish").click();
  await page.getByRole("heading", { name: "Your answers / 本次作答" }).waitFor();
  assert.equal((await read("completedSets"))[0].sessionId, "primary-miss");
  assert.equal((await read("progress")).find((p) => p.questionId === q.id).needsReview, false);
  await nav("Home").click();
  await page.locator(".last-set-entry").click();
  assert.equal(
    await page.locator(".summary-review-item").count(),
    1,
    "historical miss remains after current clearing",
  );
  pass("Remediation clears Needs review without replacing Last set; historical Not fully correct remains");
  // Compatibility mismatch and deletion degrade per entry while stored score remains readable.
  const mismatched = structuredClone(primary);
  mismatched.entries[0].fingerprint = "changed";
  mismatched.entries.push({ ...structuredClone(primary.entries[0]), questionId: "deleted-fixture" });
  await seed({ completedSets: [mismatched], activeSession: [] });
  await page.locator(".last-set-entry").click();
  await page.getByText("This question has changed since this set", { exact: true }).waitFor();
  await page.getByText("No longer in the current question bank", { exact: true }).waitFor();
  assert.equal(await page.locator(".question-card").count(), 0);
  assert.equal(await btn("Try again").count(), 1);
  pass("Changed fingerprint and deleted ID degrade individually; only live IDs offered for retry");
  // Saved removal focus and whole-case population.
  const flags = [q, caseQ].map((question) => ({
    questionId: question.id,
    flagged: true,
    updatedAt: "2026-09-12",
  }));
  await seed({
    flags,
    progress: [{ questionId: caseQ.id, seen: 1, correct: 0, incorrect: 1, needsReview: true }],
    activeSession: [],
  });
  await page.getByRole("button", { name: /^Saved \/ 已收藏/ }).click();
  await page.getByRole("button", { name: "Remove from Saved", exact: true }).first().click();
  await page.waitForTimeout(60);
  assert.equal(await page.locator(".question-inspect").evaluate((el) => el === document.activeElement), true);
  await page.getByRole("button", { name: "Remove from Saved", exact: true }).click();
  await page.waitForTimeout(60);
  assert.equal(
    await page
      .getByRole("heading", { name: "Saved / 已收藏" })
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await nav("Home").click();
  await page.getByRole("button", { name: /^Needs review \/ 需复习/ }).click();
  await page.getByText("0 questions and 1 case studies", { exact: true }).waitFor();
  await page.getByRole("button", { name: /^Practice these/ }).click();
  assert.deepEqual((await read("activeSession"))[0].questionIds, [caseQ.id]);
  pass("Saved removal keyboard focus; explicit Needs review offers whole cases without backfill");
  // Guard preservation: draft, safe initial focus, Escape and initiating focus restoration.
  await resume(snapshot("guard", { ...q }, { answers: { [q.id]: getCorrectAnswer(q) } }));
  await nav("Home").click();
  const start = btn("Start practice · 50 questions");
  await start.click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  assert.equal(
    await btn("Keep current set / 保留当前练习").evaluate((el) => el === document.activeElement),
    true,
  );
  await page.keyboard.press("Escape");
  assert.equal(await start.evaluate((el) => el === document.activeElement), true);
  assert.equal((await read("activeSession"))[0].id, "guard");
  await start.click();
  await btn("Start new set / 开始新练习").click();
  await page.locator(".session-shell").waitFor();
  assert.notEqual((await read("activeSession"))[0].id, "guard");
  pass("Replacement guard preserves drafts, safe focus, Escape restoration and confirmed persistence");
  // Library row opens inspection; only its named Practice action starts an attempt.
  await seed({ activeSession: [] });
  await nav("Library").click();
  await page.getByRole("combobox", { name: /^Topic/ }).selectOption(q.topic);
  const row = page
    .locator("article.question-row")
    .filter({ has: page.getByRole("heading", { name: q.stem.en, exact: true }) });
  await row.click();
  await page.getByText("Current question preview · No previous answer is shown.").waitFor();
  assert.equal((await read("activeSession")).length, 0);
  await btn("Practice this question").click();
  assert.equal((await read("activeSession"))[0].launchIntent, "remediation");
  pass("Library inspection is read-only; explicit practice launches remediation");
  // Partial-credit and complete whole-case UI; final initialized order is captured even without draft entry.
  await resume(
    snapshot("partial-ui", partial, { answers: { [partial.id]: { optionIds: [partial.correct[0]] } } }),
  );
  await btn("Submit answer").click();
  await page.locator(".answer-banner").waitFor();
  assert.equal((await read("progress")).find((p) => p.questionId === partial.id).needsReview, true);
  await resume(snapshot("whole-case", caseQ, { answers: { [caseQ.id]: getCorrectAnswer(caseQ) } }));
  await btn("Submit all parts").click();
  await page.locator(".answer-banner").waitFor();
  assert.equal((await read("progress")).find((p) => p.questionId === caseQ.id).needsReview, false);
  await btn("Finish").click();
  await page.locator(".summary-review-toggle").click();
  assert.ok(await page.locator(".case-question").count());
  await shot("desktop-completed-case");
  await resume(snapshot("initialized-order", ordered));
  await btn("Submit answer").click();
  await page.locator(".answer-banner").waitFor();
  assert.deepEqual((await read("activeSession"))[0].attempts[ordered.id].answer, getInitialAnswer(ordered));
  pass("Partial credit, whole-case clearing and no-draft initialized ordered-response capture in browser");
  await resume(snapshot("matrix-keyboard", matrix, { answers: { [matrix.id]: getCorrectAnswer(matrix) } }));
  await btn("Submit answer").click();
  await page.locator(".answer-banner").waitFor();
  const cell = page.locator(".matrix-table td button").first();
  assert.equal(await cell.getAttribute("aria-disabled"), "true");
  const pressed = await cell.getAttribute("aria-pressed");
  await cell.focus();
  await page.keyboard.press("Space");
  assert.equal(await cell.getAttribute("aria-pressed"), pressed);
  assert.equal(await cell.evaluate((el) => el === document.activeElement), true);
  pass("Submitted matrix cells remain keyboard-focusable, named and read-only");

  // Missing ID and malformed draft must keep the durable record and expose recovery.
  await resumeRecovery(snapshot("missing", { ...q }, { questionIds: ["deleted-active"] }));
  await resumeRecovery(snapshot("invalid-draft", q, { answers: { [q.id]: { optionIds: ["missing"] } } }));
  pass("Deleted active ID and invalid draft show recovery without silent deletion");
  // Responsive surfaces at specified browser text scaling and both themes.
  await archiveMiss("layout-primary");
  await nav("Home").click();
  for (const theme of ["light", "dark"])
    for (const scale of [100, 125, 150, 200])
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
        await page.evaluate(
          ({ theme, scale }) => {
            document.documentElement.dataset.theme = theme;
            document.documentElement.style.fontSize = `${(16 * scale) / 100}px`;
          },
          { theme, scale },
        );
        assert.ok(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          `${theme} ${scale}% ${width}: Home overflow`,
        );
        await page.locator(".last-set-entry").click();
        await page.locator(".summary-review-toggle").click();
        assert.ok(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          `${theme} ${scale}% ${width}: Summary overflow`,
        );
        if (scale === 200 && width === 390) await shot(`mobile-${theme}-200`);
        await nav("Home").click();
      }
  pass("390×844 and desktop; both themes; 100/125/150/200% text without page overflow");
  assert.deepEqual(errors, [], "no page errors");
  writeFileSync(`${out}/browser-results.json`, JSON.stringify({ checks, errors }, null, 2));
} finally {
  await browser.close();
}
async function resumeRecovery(s) {
  await seed({ activeSession: [s] });
  await btn("Continue set / 继续练习").click();
  await page.getByRole("heading", { name: "This set needs recovery" }).waitFor();
  assert.equal((await read("activeSession"))[0].id, s.id);
}
