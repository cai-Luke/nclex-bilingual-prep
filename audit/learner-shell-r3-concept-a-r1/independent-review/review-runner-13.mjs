/** Part 13 — memory semantics, final: guarantee a wrong first attempt, then full marks;
 *  and complete an ordinary set via End set, then confirm a remediation launch leaves Last Set intact. */
import fs from 'node:fs'; import path from 'node:path';
import pw from '/Users/holemini/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
const { chromium } = pw;
const BASE = 'http://127.0.0.1:5199/';
const OUT = path.resolve(process.argv[2]); const SHOTS = path.join(OUT, 'screenshots');
const results = [], allConsole = [];
const rec = o => { results.push(o); console.log(`[${o.pass === true ? 'PASS' : o.pass === false ? 'FAIL' : 'INFO'}] ${o.scenario}${o.note ? ' — ' + o.note : ''}`); };
const settle = async (p, ms = 1400) => { await p.waitForLoadState('networkidle').catch(()=>{}); await p.waitForTimeout(ms); };
const tap = async l => { await l.scrollIntoViewIfNeeded().catch(()=>{}); await l.click({ timeout: 12000 }).catch(async () => { await l.click({ force: true }).catch(()=>{}); }); };
let browser;
const db = page => page.evaluate(async () => {
  const r = indexedDB.open('nclex-bilingual-prep'); const d = await new Promise(x => { r.onsuccess = () => x(r.result); });
  const o = {};
  for (const n of [...d.objectStoreNames]) { const tx = d.transaction(n, 'readonly');
    o[n] = await new Promise(x => { const q = tx.objectStore(n).getAll(); q.onsuccess = () => x(q.result); }); }
  return o;
});
const nrIds = s => (s.progress || []).filter(p => p.needsReview).map(p => p.id ?? p.questionId).sort();
const grading = page => page.evaluate(() => [...document.querySelectorAll('.question-card .option-row')]
  .map((l, i) => ({ i, status: (l.querySelector('.response-status')?.innerText || '').trim() })));
async function page1(scenario) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', m => allConsole.push({ scenario, type: m.type(), text: m.text() }));
  page.on('pageerror', e => allConsole.push({ scenario, type: 'pageerror', text: e.message }));
  await page.goto(BASE); await settle(page);
  return { ctx, page };
}
async function openLibraryRow(page, idx) {
  await tap(page.locator('nav.app-primary-nav button:has-text("Library")')); await settle(page, 1200);
  await page.locator('.filters select').nth(3).selectOption({ label: 'gpt-canonical' }).catch(()=>{}); await settle(page, 1100);
  await tap(page.locator('.question-row').nth(idx).locator('button:has-text("Practice")')); await settle(page, 1700);
}
async function finishSingle(page) {
  const f = page.locator('button:has-text("Finish"), button:has-text("Next"), button:has-text("End set")').first();
  if (await f.count()) { await tap(f); await settle(page, 1700); }
}
async function safe(n, fn) { try { await fn(); } catch (e) { rec({ scenario: n, pass: false, error: String(e).split('\n')[0], note: 'threw' }); } }
browser = await chromium.launch({ channel: 'chrome' });

await safe('full-marks-clears-needs-review', async () => {
  const s = 'full-marks-clears-needs-review';
  const { ctx, page } = await page1(s);
  let chosenRow = null, correctIdx = null, wrongIdx = null, nrAfterWrong = null;
  // find a multiple-choice row where we can make a deliberately wrong first attempt
  for (const row of [0, 3, 4, 5, 6, 7]) {
    await page.goto(BASE); await settle(page, 1300);
    await openLibraryRow(page, row);
    const rows = page.locator('.question-card .option-row');
    if (!(await rows.count())) continue;
    await tap(rows.first()); await page.waitForTimeout(350);
    await tap(page.locator('button.submit-button').first()); await page.waitForTimeout(1500);
    const g = await grading(page);
    const ci = g.findIndex(x => /Correct answer/.test(x.status));
    const wasWrong = g.some(x => /Selected/.test(x.status) && /Not correct/.test(x.status));
    await finishSingle(page);
    if (wasWrong) { chosenRow = row; correctIdx = ci; wrongIdx = 0; nrAfterWrong = nrIds(await db(page)); break; }
    // first option was correct here; try a different row (progress for this item is now clean)
  }
  let nrAfterFull = null;
  if (chosenRow !== null && correctIdx >= 0) {
    await page.goto(BASE); await settle(page, 1400);
    await openLibraryRow(page, chosenRow);
    await tap(page.locator('.question-card .option-row').nth(correctIdx)); await page.waitForTimeout(400);
    await tap(page.locator('button.submit-button').first()); await page.waitForTimeout(1500);
    const g2 = await grading(page);
    await finishSingle(page);
    nrAfterFull = nrIds(await db(page));
    await page.goto(BASE); await settle(page, 1500);
    await page.screenshot({ path: path.join(SHOTS, s + '.png') });
    var secondGrading = g2;
  }
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
    libraryRowUsed: chosenRow, wrongOptionIndex: wrongIdx, correctOptionIndex: correctIdx,
    needsReviewAfterWrongAttempt: nrAfterWrong, needsReviewAfterFullMarks: nrAfterFull,
    clearedByFullMarks: nrAfterWrong && nrAfterFull && nrAfterWrong.length > 0 && nrAfterFull.length < nrAfterWrong.length,
    screenshot: 'screenshots/' + s + '.png',
    pass: !!nrAfterWrong && nrAfterWrong.length > 0 && !!nrAfterFull && nrAfterFull.length < nrAfterWrong.length });
  await ctx.close();
});

await safe('remediation-preserves-last-set', async () => {
  const s = 'remediation-preserves-last-set';
  const { ctx, page } = await page1(s);
  const ten = page.locator('.count-toggle button:has-text("10")').first();
  if (await ten.count()) await tap(ten);
  await tap(page.locator('button.test-start').first()); await settle(page, 1900);
  // answer what we can, then End set to complete the ordinary set
  for (let i = 0; i < 8; i++) {
    const rows = page.locator('.question-card .option-row');
    if (await rows.count()) { await tap(rows.first()); await page.waitForTimeout(300);
      await tap(page.locator('button.submit-button').first()); await page.waitForTimeout(900);
      const nx = page.locator('button:has-text("Next"), button:has-text("Finish")').first();
      if (await nx.count()) { await tap(nx); await page.waitForTimeout(700); } }
    else { await tap(page.locator('button:has-text("Skip for now")').first()); await page.waitForTimeout(700); }
  }
  const endSet = page.locator('button:has-text("End set")').first();
  if (await endSet.count()) { await tap(endSet); await settle(page, 2200); }
  const confirmFinish = page.locator('button:has-text("Finish"), button:has-text("End set")').first();
  if (await confirmFinish.count()) { await tap(confirmFinish); await settle(page, 2200); }
  const afterOrdinary = await db(page);
  const lastOrdinary = (afterOrdinary.completedSets || []).map(c => ({ id: c.sessionId, title: c.title, at: c.completedAt, n: c.deliveredCount }));
  await page.goto(BASE); await settle(page, 1900);
  const lastSetUi = await page.locator('.last-set-entry').innerText().catch(()=> null);
  const nrBefore = nrIds(afterOrdinary);
  let ran = false;
  await tap(page.locator('.study-memory-links button').first()); await settle(page, 1600);
  const practice = page.locator('main button:has-text("Practice")').first();
  if (await practice.count()) {
    await tap(practice); await settle(page, 1900);
    for (let i = 0; i < 5; i++) {
      const rows = page.locator('.question-card .option-row');
      if (!(await rows.count())) break;
      await tap(rows.first()); await page.waitForTimeout(300);
      await tap(page.locator('button.submit-button').first()); await page.waitForTimeout(900);
      const nx = page.locator('button:has-text("Next"), button:has-text("Finish")').first();
      if (await nx.count()) { await tap(nx); await page.waitForTimeout(700); }
    }
    const e2 = page.locator('button:has-text("End set")').first();
    if (await e2.count()) { await tap(e2); await settle(page, 2000); }
    ran = true;
  }
  const afterRem = await db(page);
  const lastAfter = (afterRem.completedSets || []).map(c => ({ id: c.sessionId, title: c.title, at: c.completedAt, n: c.deliveredCount }));
  await page.goto(BASE); await settle(page, 1700);
  await page.screenshot({ path: path.join(SHOTS, s + '.png') });
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
    ordinarySetCompleted: lastOrdinary.length > 0, lastSetAfterOrdinary: lastOrdinary, lastSetUiText: lastSetUi,
    needsReviewCount: nrBefore.length, remediationRan: ran, lastSetAfterRemediation: lastAfter,
    lastSetUnchangedByRemediation: JSON.stringify(lastOrdinary) === JSON.stringify(lastAfter),
    screenshot: 'screenshots/' + s + '.png',
    pass: lastOrdinary.length > 0 && ran && JSON.stringify(lastOrdinary) === JSON.stringify(lastAfter) });
  await ctx.close();
});

await browser.close();
fs.writeFileSync(path.join(OUT, 'browser-results-13.json'), JSON.stringify({ results, console: allConsole }, null, 2));
console.log('\nWROTE browser-results-13.json');
