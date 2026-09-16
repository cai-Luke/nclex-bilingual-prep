/** Part 12 — corrected memory-semantics checks: full-marks clears needsReview; ordinary Last Set
 *  survives a remediation launch. Options are radio/checkbox inputs, not buttons. */
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
/** Choose the first answer input; returns how many inputs existed. */
async function chooseFirst(page) {
  const rows = page.locator('.question-card .option-row');
  const n = await rows.count();
  if (n) await tap(rows.first());
  return n;
}
async function submitAndAdvance(page) {
  const sub = page.locator('button.submit-button').first();
  if (await sub.count()) { await tap(sub); await page.waitForTimeout(1100); }
  const nx = page.locator('button:has-text("Next"), button:has-text("Finish")').first();
  if (await nx.count()) { await tap(nx); await page.waitForTimeout(800); return true; }
  return false;
}
async function page1(scenario) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', m => allConsole.push({ scenario, type: m.type(), text: m.text() }));
  page.on('pageerror', e => allConsole.push({ scenario, type: 'pageerror', text: e.message }));
  await page.goto(BASE); await settle(page);
  return { ctx, page };
}
async function safe(n, fn) { try { await fn(); } catch (e) { rec({ scenario: n, pass: false, error: String(e).split('\n')[0], note: 'threw' }); } }
browser = await chromium.launch({ channel: 'chrome' });

// ---- full-marks clears needsReview on a single multiple-choice item ----
await safe('full-marks-clears-needs-review', async () => {
  const s = 'full-marks-clears-needs-review';
  const { ctx, page } = await page1(s);
  const openRow0 = async () => {
    await tap(page.locator('nav.app-primary-nav button:has-text("Library")')); await settle(page, 1300);
    await page.locator('.filters select').nth(3).selectOption({ label: 'gpt-canonical' }).catch(()=>{}); await settle(page, 1200);
    await tap(page.locator('.question-row').nth(0).locator('button:has-text("Practice")')); await settle(page, 1800);
  };
  await openRow0();
  const optCount = await chooseFirst(page);
  await tap(page.locator('button.submit-button').first()); await page.waitForTimeout(1500);
  // read grading: which option is correct, and was our pick wrong?
  const grading = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.question-card .option-row')];
    return rows.map((l, i) => ({ i, cls: l.className, status: (l.querySelector('.response-status')?.innerText || '').trim() }));
  });
  const correctIdx = grading.findIndex(g => /^Correct answer$|·\s*Correct answer$/.test(g.status) || (/Correct answer/.test(g.status) && !/Selected/.test(g.status)));
  const pickedWrong = grading.some(g => /Selected/.test(g.status) && /Not correct/.test(g.status));
  const fin = page.locator('button:has-text("Finish"), button:has-text("Next"), button:has-text("End set")').first();
  if (await fin.count()) { await tap(fin); await settle(page, 1700); }
  const afterWrong = nrIds(await db(page));
  // retry the same item, answering correctly
  let afterCorrect = null;
  if (correctIdx >= 0) {
    await page.goto(BASE); await settle(page, 1500);
    await openRow0();
    const rows2 = page.locator('.question-card .option-row');
    await tap(rows2.nth(correctIdx)); await page.waitForTimeout(400);
    await tap(page.locator('button.submit-button').first()); await page.waitForTimeout(1500);
    const f2 = page.locator('button:has-text("Finish"), button:has-text("Next"), button:has-text("End set")').first();
    if (await f2.count()) { await tap(f2); await settle(page, 1800); }
    afterCorrect = nrIds(await db(page));
  }
  await page.screenshot({ path: path.join(SHOTS, s + '.png') });
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
    optionRows: optCount, gradingRows: grading, correctOptionIndex: correctIdx, firstAttemptWasWrong: pickedWrong,
    needsReviewAfterWrongAttempt: afterWrong, needsReviewAfterFullMarks: afterCorrect,
    clearedByFullMarks: afterCorrect !== null && afterWrong.length > 0 && afterCorrect.length < afterWrong.length,
    screenshot: 'screenshots/' + s + '.png',
    pass: pickedWrong && afterWrong.length > 0 && afterCorrect !== null && afterCorrect.length < afterWrong.length });
  await ctx.close();
});

// ---- ordinary Last Set survives a remediation launch ----
await safe('remediation-preserves-last-set', async () => {
  const s = 'remediation-preserves-last-set';
  const { ctx, page } = await page1(s);
  const ten = page.locator('.count-toggle button:has-text("10")').first();
  if (await ten.count()) await tap(ten);
  await tap(page.locator('button.test-start').first()); await settle(page, 1900);
  for (let i = 0; i < 14; i++) {
    if (!(await page.locator('button.submit-button').count())) break;
    if (!(await chooseFirst(page))) { await tap(page.locator('button:has-text("Skip for now")').first()); await page.waitForTimeout(700); continue; }
    await submitAndAdvance(page);
  }
  await settle(page, 2000);
  const afterOrdinary = await db(page);
  const lastOrdinary = (afterOrdinary.completedSets || []).map(c => ({ id: c.sessionId, title: c.title, at: c.completedAt, n: c.deliveredCount }));
  await page.goto(BASE); await settle(page, 1900);
  const lastSetUi = await page.locator('.last-set-entry').innerText().catch(()=> null);
  const nrBefore = nrIds(afterOrdinary);
  // remediation from Needs review
  await tap(page.locator('.study-memory-links button').first()); await settle(page, 1600);
  const practice = page.locator('main button:has-text("Practice")').first();
  let ran = false;
  if (await practice.count()) {
    await tap(practice); await settle(page, 1900);
    for (let i = 0; i < 6; i++) {
      if (!(await page.locator('button.submit-button').count())) break;
      if (!(await chooseFirst(page))) break;
      await submitAndAdvance(page);
    }
    ran = true; await settle(page, 2000);
  }
  const afterRem = await db(page);
  const lastAfter = (afterRem.completedSets || []).map(c => ({ id: c.sessionId, title: c.title, at: c.completedAt, n: c.deliveredCount }));
  await page.goto(BASE); await settle(page, 1700);
  await page.screenshot({ path: path.join(SHOTS, s + '.png') });
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
    ordinarySetCompleted: lastOrdinary.length > 0, lastSetAfterOrdinary: lastOrdinary, lastSetUiText: lastSetUi,
    needsReviewAfterOrdinary: nrBefore.length, remediationRan: ran, lastSetAfterRemediation: lastAfter,
    lastSetUnchangedByRemediation: JSON.stringify(lastOrdinary) === JSON.stringify(lastAfter),
    screenshot: 'screenshots/' + s + '.png',
    pass: lastOrdinary.length > 0 && ran && JSON.stringify(lastOrdinary) === JSON.stringify(lastAfter) });
  await ctx.close();
});

await browser.close();
fs.writeFileSync(path.join(OUT, 'browser-results-12.json'), JSON.stringify({ results, console: allConsole }, null, 2));
console.log('\nWROTE browser-results-12.json');
