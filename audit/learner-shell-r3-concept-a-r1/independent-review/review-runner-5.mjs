/** Part 5 — replacement dialog (corrected disclosure handling), Large text, case study, 200% zoom. */
import fs from 'node:fs'; import path from 'node:path';
import pw from '/Users/holemini/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
const { chromium } = pw;
const BASE = 'http://127.0.0.1:5199/';
const OUT = path.resolve(process.argv[2]); const SHOTS = path.join(OUT, 'screenshots');
const results = [], allConsole = [];
const rec = o => { results.push(o); console.log(`[${o.pass === true ? 'PASS' : o.pass === false ? 'FAIL' : 'INFO'}] ${o.scenario}${o.note ? ' — ' + o.note : ''}`); };
let browser;
async function newPage({ width = 1440, height = 900, theme = 'light', dpr = 1, scenario = '' } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, colorScheme: theme });
  const page = await ctx.newPage();
  page.on('console', m => allConsole.push({ scenario, type: m.type(), text: m.text() }));
  page.on('pageerror', e => allConsole.push({ scenario, type: 'pageerror', text: e.message }));
  page.on('requestfailed', r => allConsole.push({ scenario, type: 'requestfailed', text: `${r.url()} :: ${r.failure()?.errorText}` }));
  return { ctx, page };
}
const settle = async (p, ms = 1300) => { await p.waitForLoadState('networkidle').catch(()=>{}); await p.waitForTimeout(ms); };
const shot = async (p, n) => { await p.screenshot({ path: path.join(SHOTS, n + '.png') }); return 'screenshots/' + n + '.png'; };
const overflow = p => p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
// Open the disclosure only if it is closed (it may already be open on a cold load — see L1).
async function ensureOpen(page) {
  const d = page.locator('details.study-new-set');
  if (await d.count() && !(await d.evaluate(e => e.open))) { await page.locator('details.study-new-set > summary').click().catch(()=>{}); await page.waitForTimeout(350); }
}
async function startSet(page) { await ensureOpen(page); await page.locator('button.test-start').first().click({ force: true }); await settle(page, 1700); }
async function pickChoice(page) {
  const c = page.locator('.question-card').locator('button, input[type=radio], input[type=checkbox], select');
  for (let i = 0, n = await c.count(); i < n; i++) { const e = c.nth(i); const t = ((await e.innerText().catch(()=> '')) || '').trim();
    if (/Submit|Skip|End set|Calculator|Save question|需要中文|Read|Copy|^EN$|^ZH$|EN\/ZH|Tap ZH/i.test(t)) continue;
    if (await e.isVisible().catch(()=>false) && await e.isEnabled().catch(()=>false)) { await e.click({ force: true }).catch(()=>{}); return true; } }
  return false;
}
const sessionIds = page => page.evaluate(async () => {
  const req = indexedDB.open('nclex-bilingual-prep');
  const db = await new Promise(r => { req.onsuccess = () => r(req.result); });
  const o = {};
  for (const n of [...db.objectStoreNames].filter(x => /session/i.test(x))) { const tx = db.transaction(n, 'readonly');
    o[n] = await new Promise(r => { const q = tx.objectStore(n).getAll(); q.onsuccess = () => r(q.result.map(a => a.sessionId ?? a.id ?? null)); }); }
  return o;
});
// Bring the app to Study root with a resumable, partially answered session.
async function seedResumable(page) {
  await page.goto(BASE); await settle(page); await startSet(page); await pickChoice(page); await page.waitForTimeout(900);
  const before = await sessionIds(page);
  await page.reload(); await settle(page, 2300);
  return before;
}
async function safe(n, fn) { try { await fn(); } catch (e) { rec({ scenario: n, pass: false, error: String(e).split('\n')[0], note: 'scenario threw' }); } }

browser = await chromium.launch({ channel: 'chrome' });

for (const [w, h, dpr, label] of [[1440,900,1,'desktop'],[390,844,3,'mobile']]) {
  await safe(`replacement-dialog-${label}`, async () => {
    const s = `replacement-dialog-${label}`;
    const { ctx, page } = await newPage({ width: w, height: h, dpr, scenario: s });
    const before = await seedResumable(page);
    await ensureOpen(page);
    const trigger = page.locator('button.test-start').first();
    const triggerCls = await trigger.getAttribute('class');
    await trigger.click({ force: true }); await page.waitForTimeout(1200);
    const dlg = page.locator('dialog.session-replacement-dialog');
    const open = await dlg.evaluate(e => e.open).catch(()=>false);
    const focused = await page.evaluate(() => ({ text: (document.activeElement?.innerText||'').trim().slice(0,60), cls: String(document.activeElement?.className) }));
    const order = await page.$$eval('dialog.session-replacement-dialog .action-row button', b => b.map(x => ({ text: x.innerText.trim(), cls: x.className })));
    const sc = await shot(page, s);
    await page.keyboard.press('Escape'); await page.waitForTimeout(1100);
    const after = await sessionIds(page);
    const openAfter = await dlg.evaluate(e => e.open).catch(()=>false);
    const focusAfter = await page.evaluate(() => ({ text: (document.activeElement?.innerText||'').trim().slice(0,40), cls: String(document.activeElement?.className), tag: document.activeElement?.tagName }));
    // Keep current set path, same context
    await ensureOpen(page);
    await page.locator('button.test-start').first().click({ force: true }); await page.waitForTimeout(1100);
    const keepVisible = await page.locator('dialog.session-replacement-dialog button.primary-action').isVisible().catch(()=>false);
    await page.locator('dialog.session-replacement-dialog button.primary-action').click({ force: true }).catch(()=>{});
    await page.waitForTimeout(1100);
    const afterKeep = await sessionIds(page);
    rec({ scenario: s, viewport: `${w}x${h}`, dpr, theme: 'light', textSize: 'Default', transport: 'http:',
      triggerClass: triggerCls, dialogOpened: open, focusedOnOpen: focused, dialogButtonOrder: order,
      closedByEscape: openAfter === false, sessionsBefore: before, afterEscape: after, afterKeep,
      escapePreservedSession: JSON.stringify(before) === JSON.stringify(after),
      keepPreservedSession: JSON.stringify(before) === JSON.stringify(afterKeep),
      focusAfterEscape: focusAfter, focusReturnedToTrigger: /test-start/.test(focusAfter.cls), keepVisible,
      screenshot: sc,
      pass: open === true && /Keep current set/.test(focused.text) && openAfter === false
            && JSON.stringify(before) === JSON.stringify(after) && JSON.stringify(before) === JSON.stringify(afterKeep) });
    await ctx.close();
  });
}

await safe('large-text-study-and-dialog', async () => {
  const s = 'large-text-study-and-dialog';
  const { ctx, page } = await newPage({ width: 390, height: 844, dpr: 3, scenario: s });
  await page.goto(BASE); await settle(page);
  await page.evaluate(() => localStorage.setItem('nclex-settings', JSON.stringify({ languageMode: 'en', revisitMissed: true, voiceEnabled: false, themeMode: 'light', textSizeMode: 'large' })));
  await page.reload(); await settle(page, 1900);
  const rootShot = await shot(page, 'large-text-study-root');
  const of1 = await overflow(page);
  await startSet(page); await pickChoice(page); await page.waitForTimeout(900);
  await page.reload(); await settle(page, 2300);
  await ensureOpen(page);
  await page.locator('button.test-start').first().click({ force: true }); await page.waitForTimeout(1300);
  const dv = await page.evaluate(() => { const d = document.querySelector('dialog.session-replacement-dialog'); if (!d || !d.open) return null;
    const t = d.querySelector('#session-replacement-title'), sa = d.querySelector('button.primary-action');
    const tr = t.getBoundingClientRect(), sr = sa.getBoundingClientRect();
    return { titleVisible: tr.top >= 0 && tr.bottom <= innerHeight, safeVisible: sr.top >= 0 && sr.bottom <= innerHeight,
             titleTop: Math.round(tr.top), safeTop: Math.round(sr.top), safeBottom: Math.round(sr.bottom), innerHeight, fontScale: getComputedStyle(document.documentElement).getPropertyValue('--font-scale') }; });
  rec({ scenario: s, viewport: '390x844', dpr: 3, theme: 'light', textSize: 'Large', transport: 'http:',
    studyRootOverflow: of1, dialogMetrics: dv, dialogOverflow: await overflow(page),
    screenshots: [rootShot, await shot(page, 'large-text-replacement-dialog')],
    pass: !of1 && !!dv && dv.titleVisible && dv.safeVisible });
  await ctx.close();
});

await safe('case-study', async () => {
  const s = 'case-study';
  const { ctx, page } = await newPage({ scenario: s });
  await page.goto(BASE); await settle(page);
  await page.locator('nav.app-primary-nav button:has-text("Library")').click(); await settle(page, 1400);
  await page.locator('.filters select').nth(3).selectOption({ label: 'claude-canonical' }).catch(()=>{}); await settle(page, 1300);
  const pills = await page.$$eval('.question-row', rs => rs.map((r, i) => ({ i, p: r.querySelector('.type-pill')?.innerText.trim() })));
  const casePills = pills.filter(x => /case/i.test(x.p || ''));
  let found = false, detail = null;
  if (casePills.length) {
    await page.locator('.question-row').nth(casePills[0].i).locator('button:has-text("Practice")').click({ force: true });
    await settle(page, 1900);
    const nav = await page.locator('[class*="case-part"], [class*="part-nav"]').count();
    const exhibit = await page.locator('[class*="exhibit"]').count();
    found = (await page.locator('.question-card').count()) > 0;
    detail = { partNavNodes: nav, exhibitNodes: exhibit };
    // try advancing a part
    const partBtns = page.locator('[class*="part"] button');
    if (await partBtns.count() > 1) { await partBtns.nth(1).click({ force: true }).catch(()=>{}); await page.waitForTimeout(800); }
  }
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
    distinctPills: [...new Set(pills.map(x => x.p))], casePillRows: casePills.length, targetFound: found, detail,
    screenshot: await shot(page, s), pass: found });
  await ctx.close();
});

await browser.close();
fs.writeFileSync(path.join(OUT, 'browser-results-5.json'), JSON.stringify({ results, console: allConsole }, null, 2));
console.log('\nWROTE browser-results-5.json');
