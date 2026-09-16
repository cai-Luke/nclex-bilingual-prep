/** Part 11 — memory semantics in the browser (work order 3 / commission 6.6):
 *  full-marks clears needsReview; Saved remove + focus recovery; remediation does not overwrite ordinary Last Set. */
import fs from 'node:fs'; import path from 'node:path';
import pw from '/Users/holemini/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
const { chromium } = pw;
const BASE = 'http://127.0.0.1:5199/';
const OUT = path.resolve(process.argv[2]); const SHOTS = path.join(OUT, 'screenshots');
const results = [], allConsole = [];
const rec = o => { results.push(o); console.log(`[${o.pass === true ? 'PASS' : o.pass === false ? 'FAIL' : 'INFO'}] ${o.scenario}${o.note ? ' — ' + o.note : ''}`); };
const settle = async (p, ms = 1400) => { await p.waitForLoadState('networkidle').catch(()=>{}); await p.waitForTimeout(ms); };
const tap = async l => { await l.scrollIntoViewIfNeeded().catch(()=>{}); await l.click({ timeout: 15000 }).catch(async () => { await l.click({ force: true }).catch(()=>{}); }); };
let browser;
async function page1(scenario) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', m => allConsole.push({ scenario, type: m.type(), text: m.text() }));
  page.on('pageerror', e => allConsole.push({ scenario, type: 'pageerror', text: e.message }));
  await page.goto(BASE); await settle(page);
  return { ctx, page };
}
const db = page => page.evaluate(async () => {
  const r = indexedDB.open('nclex-bilingual-prep'); const d = await new Promise(x => { r.onsuccess = () => x(r.result); });
  const o = {};
  for (const n of [...d.objectStoreNames]) { const tx = d.transaction(n, 'readonly');
    o[n] = await new Promise(x => { const q = tx.objectStore(n).getAll(); q.onsuccess = () => x(q.result); }); }
  return o;
});
const needsReviewIds = s => (s.progress || []).filter(p => p.needsReview).map(p => p.id ?? p.questionId);

async function safe(n, fn) { try { await fn(); } catch (e) { rec({ scenario: n, pass: false, error: String(e).split('\n')[0], note: 'threw' }); } }
browser = await chromium.launch({ channel: 'chrome' });

// ---- full-marks clears needsReview, on a single multiple-choice item ----
await safe('full-marks-clears-needs-review', async () => {
  const s = 'full-marks-clears-needs-review';
  const { ctx, page } = await page1(s);
  await tap(page.locator('nav.app-primary-nav button:has-text("Library")')); await settle(page, 1300);
  await page.locator('.filters select').nth(3).selectOption({ label: 'gpt-canonical' }).catch(()=>{}); await settle(page, 1200);
  // pick a single-best-answer row
  const rows = page.locator('.question-row');
  let target = null;
  for (let i = 0, n = Math.min(await rows.count(), 40); i < n; i++) {
    const p = (await rows.nth(i).locator('.type-pill').innerText().catch(()=> '')).trim();
    if (/single best answer/i.test(p)) { target = i; break; }
  }
  await tap(rows.nth(target).locator('button:has-text("Practice")')); await settle(page, 1800);
  // answer deliberately: pick first option, submit
  const opts = page.locator('.question-card .option-answer button, .question-card button[class*="option"]');
  const optCount = await opts.count();
  await tap(opts.first()); await page.waitForTimeout(400);
  await tap(page.locator('button.submit-button').first()); await page.waitForTimeout(1500);
  const graded = await page.evaluate(() => [...document.querySelectorAll('.question-card button')].map(b => ({ cls: b.className, txt: b.innerText.trim().slice(0,30) })).filter(x => /correct|incorrect|state-/.test(x.cls)));
  const afterFirst = await db(page);
  const nrAfterFirst = needsReviewIds(afterFirst);
  // identify the correct option index from grading classes
  const correctIdx = await page.evaluate(() => {
    const bs = [...document.querySelectorAll('.question-card .option-answer button, .question-card button[class*="option"]')];
    const i = bs.findIndex(b => /correct/.test(b.className) && !/incorrect/.test(b.className));
    return i;
  });
  // finish this single-question set, then practice the same item again and answer correctly
  const fin = page.locator('button:has-text("Finish"), button:has-text("Next"), button:has-text("End set")').first();
  if (await fin.count()) { await tap(fin); await settle(page, 1600); }
  await page.goto(BASE); await settle(page, 1600);
  await tap(page.locator('nav.app-primary-nav button:has-text("Library")')); await settle(page, 1300);
  await page.locator('.filters select').nth(3).selectOption({ label: 'gpt-canonical' }).catch(()=>{}); await settle(page, 1200);
  await tap(page.locator('.question-row').nth(target).locator('button:has-text("Practice")')); await settle(page, 1800);
  let second = null;
  if (correctIdx >= 0) {
    const o2 = page.locator('.question-card .option-answer button, .question-card button[class*="option"]');
    await tap(o2.nth(correctIdx)); await page.waitForTimeout(400);
    await tap(page.locator('button.submit-button').first()); await page.waitForTimeout(1600);
    const f2 = page.locator('button:has-text("Finish"), button:has-text("Next"), button:has-text("End set")').first();
    if (await f2.count()) { await tap(f2); await settle(page, 1700); }
    second = await db(page);
  }
  const nrAfterSecond = second ? needsReviewIds(second) : null;
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
    optionCount: optCount, correctOptionIndex: correctIdx, gradedMarkers: graded.length,
    needsReviewAfterWrongAttempt: nrAfterFirst, needsReviewAfterFullMarks: nrAfterSecond,
    clearedByFullMarks: nrAfterFirst.length > 0 && nrAfterSecond !== null && nrAfterSecond.length < nrAfterFirst.length,
    screenshot: await (async () => { await page.screenshot({ path: path.join(SHOTS, s + '.png') }); return 'screenshots/' + s + '.png'; })(),
    pass: nrAfterFirst.length > 0 && nrAfterSecond !== null && nrAfterSecond.length < nrAfterFirst.length });
  await ctx.close();
});

// ---- Saved: add, view, remove, focus recovery ----
await safe('saved-remove-focus-recovery', async () => {
  const s = 'saved-remove-focus-recovery';
  const { ctx, page } = await page1(s);
  await tap(page.locator('nav.app-primary-nav button:has-text("Library")')); await settle(page, 1300);
  const rows = page.locator('.question-row');
  for (let i = 0; i < 3; i++) await tap(rows.nth(i).locator('button[aria-label*="Save question"], button:has-text("Save question")').first());
  await page.waitForTimeout(1200);
  const afterSave = await db(page);
  const savedCount = (afterSave.flags || []).filter(f => f.flagged ?? true).length;
  await tap(page.locator('nav.app-primary-nav button:has-text("Study")')); await settle(page, 1300);
  const uiSaved = await page.evaluate(() => { const b = [...document.querySelectorAll('.study-memory-links button')][1];
    return b ? b.querySelector('.memory-count')?.innerText.trim() : null; });
  await tap(page.locator('.study-memory-links button').nth(1)); await settle(page, 1500);
  const listBefore = await page.locator('main li, main .question-row, main [class*="record"]').count();
  const removeBtn = page.locator('main button:has-text("Remove"), main button[aria-label*="Remove"]').first();
  const hasRemove = await removeBtn.count();
  let focusAfter = null, listAfter = null;
  if (hasRemove) { await tap(removeBtn); await page.waitForTimeout(1100);
    focusAfter = await page.evaluate(() => ({ tag: document.activeElement?.tagName, cls: String(document.activeElement?.className), txt: (document.activeElement?.innerText||'').trim().slice(0,30) }));
    listAfter = await page.locator('main li, main .question-row, main [class*="record"]').count(); }
  const afterRemove = await db(page);
  const savedAfter = (afterRemove.flags || []).filter(f => f.flagged ?? true).length;
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
    savedRowsInDbAfterSaving: savedCount, uiSavedCountOnStudy: uiSaved, uiMatchesDb: String(savedCount) === String(uiSaved),
    listBefore, hasRemoveControl: hasRemove > 0, listAfter, savedRowsInDbAfterRemove: savedAfter,
    focusAfterRemove: focusAfter, focusNotLostToBody: focusAfter ? focusAfter.tag !== 'BODY' : null,
    screenshot: await (async () => { await page.screenshot({ path: path.join(SHOTS, s + '.png') }); return 'screenshots/' + s + '.png'; })(),
    pass: savedCount > 0 && String(savedCount) === String(uiSaved) && hasRemove > 0 && savedAfter === savedCount - 1 });
  await ctx.close();
});

// ---- remediation must not overwrite the ordinary Last Set ----
await safe('remediation-preserves-last-set', async () => {
  const s = 'remediation-preserves-last-set';
  const { ctx, page } = await page1(s);
  // ordinary 10-question set, completed
  const ten = page.locator('.count-toggle button:has-text("10")').first();
  if (await ten.count()) await tap(ten);
  await tap(page.locator('button.test-start').first()); await settle(page, 1800);
  for (let i = 0; i < 40; i++) {
    if (!(await page.locator('button.submit-button').count())) break;
    const c = page.locator('.question-card').locator('button, input[type=radio], input[type=checkbox], select');
    for (let k = 0, n = await c.count(); k < n; k++) { const e = c.nth(k); const t = ((await e.innerText().catch(()=> '')) || '').trim();
      if (/Submit|Skip|End set|Calculator|Save question|需要中文|^EN$|^ZH$|EN\/ZH|Tap ZH/i.test(t)) continue;
      if (await e.isVisible().catch(()=>false)) { await e.click({ force: true }).catch(()=>{}); break; } }
    await page.waitForTimeout(250);
    await page.locator('button.submit-button').first().click({ force: true }).catch(()=>{}); await page.waitForTimeout(600);
    const nx = page.locator('button:has-text("Next"), button:has-text("Finish")').first();
    if (await nx.count()) { await nx.click({ force: true }).catch(()=>{}); await page.waitForTimeout(500); }
  }
  await settle(page, 1800);
  const afterOrdinary = await db(page);
  const lastSetOrdinary = (afterOrdinary.completedSets || []).map(c => ({ id: c.sessionId, title: c.title, at: c.completedAt, n: c.deliveredCount }));
  await page.goto(BASE); await settle(page, 1800);
  const lastSetUi = await page.locator('.last-set-entry').innerText().catch(()=> null);
  // launch remediation from Needs review
  await tap(page.locator('.study-memory-links button').first()); await settle(page, 1500);
  const practice = page.locator('main button:has-text("Practice")').first();
  let remediationRan = false;
  if (await practice.count()) {
    await tap(practice); await settle(page, 1800);
    for (let i = 0; i < 12; i++) {
      if (!(await page.locator('button.submit-button').count())) break;
      const c = page.locator('.question-card').locator('button, input[type=radio], input[type=checkbox], select');
      for (let k = 0, n = await c.count(); k < n; k++) { const e = c.nth(k); const t = ((await e.innerText().catch(()=> '')) || '').trim();
        if (/Submit|Skip|End set|Calculator|Save question|需要中文|^EN$|^ZH$|EN\/ZH|Tap ZH/i.test(t)) continue;
        if (await e.isVisible().catch(()=>false)) { await e.click({ force: true }).catch(()=>{}); break; } }
      await page.waitForTimeout(250);
      await page.locator('button.submit-button').first().click({ force: true }).catch(()=>{}); await page.waitForTimeout(600);
      const nx = page.locator('button:has-text("Next"), button:has-text("Finish")').first();
      if (await nx.count()) { await nx.click({ force: true }).catch(()=>{}); await page.waitForTimeout(500); }
    }
    remediationRan = true; await settle(page, 1800);
  }
  const afterRemediation = await db(page);
  const lastSetAfter = (afterRemediation.completedSets || []).map(c => ({ id: c.sessionId, title: c.title, at: c.completedAt, n: c.deliveredCount }));
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
    lastSetAfterOrdinary: lastSetOrdinary, lastSetUiText: lastSetUi, remediationRan, lastSetAfterRemediation: lastSetAfter,
    lastSetUnchanged: JSON.stringify(lastSetOrdinary) === JSON.stringify(lastSetAfter),
    screenshot: await (async () => { await page.screenshot({ path: path.join(SHOTS, s + '.png') }); return 'screenshots/' + s + '.png'; })(),
    pass: lastSetOrdinary.length > 0 && remediationRan && JSON.stringify(lastSetOrdinary) === JSON.stringify(lastSetAfter) });
  await ctx.close();
});

await browser.close();
fs.writeFileSync(path.join(OUT, 'browser-results-11.json'), JSON.stringify({ results, console: allConsole }, null, 2));
console.log('\nWROTE browser-results-11.json');
