/** Part 14 — L4: on desktop the header persists during active Study; leaving via brand or Settings
 *  must preserve the session and resume must return correctly. */
import fs from 'node:fs'; import path from 'node:path';
import pw from '/Users/holemini/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
const { chromium } = pw;
const BASE = 'http://127.0.0.1:5199/';
const OUT = path.resolve(process.argv[2]); const SHOTS = path.join(OUT, 'screenshots');
const results = [], allConsole = [];
const rec = o => { results.push(o); console.log(`[${o.pass === true ? 'PASS' : o.pass === false ? 'FAIL' : 'INFO'}] ${o.scenario}${o.note ? ' — ' + o.note : ''}`); };
const settle = async (p, ms = 1400) => { await p.waitForLoadState('networkidle').catch(()=>{}); await p.waitForTimeout(ms); };
const tap = async l => { await l.scrollIntoViewIfNeeded().catch(()=>{}); await l.click({ timeout: 12000 }).catch(async () => { await l.click({ force: true }).catch(()=>{}); }); };
const snap = page => page.evaluate(async () => {
  const r = indexedDB.open('nclex-bilingual-prep'); const d = await new Promise(x => { r.onsuccess = () => x(r.result); });
  const tx = d.transaction('activeSession', 'readonly');
  return await new Promise(x => { const q = tx.objectStore('activeSession').getAll();
    q.onsuccess = () => x(q.result.map(a => ({ id: a.sessionId, idx: a.index, completed: a.completed,
      res: Object.keys(a.results || {}).length, sk: (a.skippedQuestionIds || []).length }))); });
});
const browser = await chromium.launch({ channel: 'chrome' });
for (const [exitVia, sel] of [['brand', '.brand'], ['settings-utility', '.header-utility']]) {
  const s = `L4-desktop-exit-via-${exitVia}`;
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', m => allConsole.push({ scenario: s, type: m.type(), text: m.text() }));
  page.on('pageerror', e => allConsole.push({ scenario: s, type: 'pageerror', text: e.message }));
  await page.goto(BASE); await settle(page);
  const d = page.locator('details.study-new-set');
  if (await d.count() && !(await d.evaluate(e => e.open))) await tap(page.locator('details.study-new-set > summary'));
  await tap(page.locator('button.test-start').first()); await settle(page, 1900);
  // record real work
  const rows = page.locator('.question-card .option-row');
  if (await rows.count()) { await tap(rows.first()); await page.waitForTimeout(300);
    await tap(page.locator('button.submit-button').first()); await page.waitForTimeout(1100);
    const nx = page.locator('button:has-text("Next")').first(); if (await nx.count()) { await tap(nx); await page.waitForTimeout(800); } }
  else { await tap(page.locator('button:has-text("Skip for now")').first()); await page.waitForTimeout(900); }
  const headerVisible = await page.evaluate(() => {
    const h = document.querySelector('header.app-header');
    return { display: getComputedStyle(h).display, brandVisible: !!document.querySelector('.brand')?.getBoundingClientRect().width,
             utilityVisible: !!document.querySelector('.header-utility')?.getBoundingClientRect().width,
             learnerNavPresent: !!document.querySelector('nav.app-primary-nav') }; });
  const before = await snap(page);
  await tap(page.locator(sel).first()); await settle(page, 1500);
  const leftSession = (await page.locator('.question-card').count()) === 0;
  const afterLeave = await snap(page);
  // return to Study root and resume
  await tap(page.locator('.brand').first()).catch(()=>{}); await settle(page, 1300);
  const resumeBtn = page.locator('button.resume-action');
  const hasResume = await resumeBtn.count();
  let resumedOk = null, afterResume = null;
  if (hasResume) { await tap(resumeBtn.first()); await settle(page, 1800);
    resumedOk = (await page.locator('.question-card').count()) > 0; afterResume = await snap(page); }
  await page.screenshot({ path: path.join(SHOTS, s + '.png') });
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
    headerDuringActiveStudy: headerVisible, sessionBeforeLeaving: before, leftActiveStudy: leftSession,
    sessionAfterLeaving: afterLeave, sessionPreservedOnLeave: JSON.stringify(before) === JSON.stringify(afterLeave),
    resumeControlPresent: hasResume > 0, resumedIntoSession: resumedOk, sessionAfterResume: afterResume,
    sessionUnchangedByResume: afterResume ? JSON.stringify(before) === JSON.stringify(afterResume) : null,
    screenshot: 'screenshots/' + s + '.png',
    pass: headerVisible.display !== 'none' && headerVisible.learnerNavPresent === false && leftSession
          && JSON.stringify(before) === JSON.stringify(afterLeave) && hasResume > 0 && resumedOk === true });
  await ctx.close();
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'browser-results-14.json'), JSON.stringify({ results, console: allConsole }, null, 2));
console.log('\nWROTE browser-results-14.json');
