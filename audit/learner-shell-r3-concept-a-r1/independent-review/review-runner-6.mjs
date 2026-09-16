/** Part 6 — replacement dialog with a genuinely PROTECTED session (submitted answer / skip),
 *  per src/sessionStartGuard.ts hasProtectedSession(). Plus Large-text dialog and 200% zoom. */
import fs from 'node:fs'; import path from 'node:path';
import pw from '/Users/holemini/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
const { chromium } = pw;
const BASE = 'http://127.0.0.1:5199/';
const OUT = path.resolve(process.argv[2]); const SHOTS = path.join(OUT, 'screenshots');
const results = [], allConsole = [];
const rec = o => { results.push(o); console.log(`[${o.pass === true ? 'PASS' : o.pass === false ? 'FAIL' : 'INFO'}] ${o.scenario}${o.note ? ' — ' + o.note : ''}`); };
let browser;
async function newPage({ width = 1440, height = 900, theme = 'light', dpr = 1, scenario = '', args } = {}) {
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
async function ensureOpen(page) {
  const d = page.locator('details.study-new-set');
  if (await d.count() && !(await d.evaluate(e => e.open))) { await page.locator('details.study-new-set > summary').click().catch(()=>{}); await page.waitForTimeout(350); }
}
const sessionSnapshot = page => page.evaluate(async () => {
  const req = indexedDB.open('nclex-bilingual-prep');
  const db = await new Promise(r => { req.onsuccess = () => r(req.result); });
  const names = [...db.objectStoreNames].filter(x => /session/i.test(x));
  const o = {};
  for (const n of names) { const tx = db.transaction(n, 'readonly');
    const rows = await new Promise(r => { const q = tx.objectStore(n).getAll(); q.onsuccess = () => r(q.result); });
    o[n] = rows.map(a => ({ id: a.sessionId ?? a.id ?? null, completed: a.completed,
      results: Object.keys(a.results ?? {}).length, answers: Object.keys(a.answers ?? {}).length,
      skipped: (a.skippedQuestionIds ?? []).length })); }
  return o;
});
/** Create a genuinely protected session: submit one answer, else skip one. */
async function seedProtected(page) {
  await page.goto(BASE); await settle(page);
  await ensureOpen(page);
  await page.locator('button.test-start').first().click({ force: true }); await settle(page, 1800);
  const c = page.locator('.question-card').locator('button, input[type=radio], input[type=checkbox], select');
  for (let i = 0, n = await c.count(); i < n; i++) { const e = c.nth(i); const t = ((await e.innerText().catch(()=> '')) || '').trim();
    if (/Submit|Skip|End set|Calculator|Save question|需要中文|Read|Copy|^EN$|^ZH$|EN\/ZH|Tap ZH/i.test(t)) continue;
    if (await e.isVisible().catch(()=>false) && await e.isEnabled().catch(()=>false)) { await e.click({ force: true }).catch(()=>{}); break; } }
  await page.waitForTimeout(500);
  const sub = page.locator('button.submit-button').first();
  if (await sub.count() && await sub.isEnabled().catch(()=>false)) { await sub.click({ force: true }).catch(()=>{}); await page.waitForTimeout(1300); }
  // guarantee protection via a skip as well
  const skip = page.locator('button:has-text("Skip for now")').first();
  if (await skip.count()) { await skip.click({ force: true }).catch(()=>{}); await page.waitForTimeout(900); }
  const snap = await sessionSnapshot(page);
  await page.reload(); await settle(page, 2400);
  return snap;
}
async function safe(n, fn) { try { await fn(); } catch (e) { rec({ scenario: n, pass: false, error: String(e).split('\n')[0], note: 'scenario threw' }); } }

browser = await chromium.launch({ channel: 'chrome' });

for (const [w, h, dpr, theme, label] of [[1440,900,1,'light','desktop'],[390,844,3,'light','mobile']]) {
  await safe(`replacement-dialog-${label}`, async () => {
    const s = `replacement-dialog-${label}`;
    const { ctx, page } = await newPage({ width: w, height: h, dpr, theme, scenario: s });
    const before = await seedProtected(page);
    const protectedNow = Object.values(before).flat().some(x => !x.completed && (x.results || x.answers || x.skipped));
    await ensureOpen(page);
    const trigger = page.locator('button.test-start').first();
    await trigger.click({ force: true }); await page.waitForTimeout(1300);
    const dlg = page.locator('dialog.session-replacement-dialog');
    const open = await dlg.evaluate(e => e.open).catch(()=>false);
    const focused = await page.evaluate(() => ({ text: (document.activeElement?.innerText||'').trim().slice(0,60), cls: String(document.activeElement?.className) }));
    const order = await page.$$eval('dialog.session-replacement-dialog .action-row button', b => b.map(x => ({ text: x.innerText.trim().split('\n')[0], cls: x.className })));
    const modal = await page.evaluate(() => { const d = document.querySelector('dialog.session-replacement-dialog'); return { isModalTop: d === document.querySelector('dialog[open]'), matchesModal: d?.matches(':modal') ?? null }; });
    const sc = await shot(page, s);
    await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
    const afterEsc = await sessionSnapshot(page);
    const openAfter = await dlg.evaluate(e => e.open).catch(()=>false);
    const focusAfter = await page.evaluate(() => ({ text: (document.activeElement?.innerText||'').trim().slice(0,40), cls: String(document.activeElement?.className), tag: document.activeElement?.tagName }));
    // Keep current set
    await ensureOpen(page);
    await page.locator('button.test-start').first().click({ force: true }); await page.waitForTimeout(1200);
    const keepBtn = page.locator('dialog.session-replacement-dialog button.primary-action');
    const keepVis = await keepBtn.isVisible().catch(()=>false);
    if (keepVis) await keepBtn.click({ force: true }).catch(()=>{});
    await page.waitForTimeout(1200);
    const afterKeep = await sessionSnapshot(page);
    const focusAfterKeep = await page.evaluate(() => ({ cls: String(document.activeElement?.className), tag: document.activeElement?.tagName }));
    rec({ scenario: s, viewport: `${w}x${h}`, dpr, theme, textSize: 'Default', transport: 'http:',
      sessionProtectedBeforeAttempt: protectedNow, sessionsBefore: before,
      dialogOpened: open, focusedOnOpen: focused, safeActionIsFirstAndPrimary: order[0]?.cls?.includes('primary-action') && /Keep current set/.test(order[0]?.text ?? ''),
      dialogButtonOrder: order, modality: modal, closedByEscape: openAfter === false,
      sessionsAfterEscape: afterEsc, escapePreservedSession: JSON.stringify(before) === JSON.stringify(afterEsc),
      focusAfterEscape: focusAfter, focusReturnedToTrigger: /test-start/.test(focusAfter.cls),
      keepVisible: keepVis, sessionsAfterKeep: afterKeep, keepPreservedSession: JSON.stringify(before) === JSON.stringify(afterKeep),
      focusAfterKeep, screenshot: sc,
      pass: protectedNow && open === true && /Keep current set/.test(focused.text) && openAfter === false
            && JSON.stringify(before) === JSON.stringify(afterEsc) && JSON.stringify(before) === JSON.stringify(afterKeep)
            && /test-start/.test(focusAfter.cls) });
    await ctx.close();
  });
}

await safe('large-text-replacement-dialog', async () => {
  const s = 'large-text-replacement-dialog';
  const { ctx, page } = await newPage({ width: 390, height: 844, dpr: 3, scenario: s });
  await page.goto(BASE); await settle(page);
  await page.evaluate(() => localStorage.setItem('nclex-settings', JSON.stringify({ languageMode: 'en', revisitMissed: true, voiceEnabled: false, themeMode: 'light', textSizeMode: 'large' })));
  const before = await seedProtected(page);
  const rootShot = await shot(page, 'large-text-study-root');
  const of1 = await overflow(page);
  await ensureOpen(page);
  await page.locator('button.test-start').first().click({ force: true }); await page.waitForTimeout(1400);
  const dv = await page.evaluate(() => { const d = document.querySelector('dialog.session-replacement-dialog'); if (!d || !d.open) return null;
    const t = d.querySelector('#session-replacement-title'), sa = d.querySelector('button.primary-action');
    const tr = t.getBoundingClientRect(), sr = sa.getBoundingClientRect();
    return { titleFullyVisible: tr.top >= 0 && tr.bottom <= innerHeight, safeFullyVisible: sr.top >= 0 && sr.bottom <= innerHeight,
      titleTop: Math.round(tr.top), safeTop: Math.round(sr.top), safeBottom: Math.round(sr.bottom), innerHeight,
      fontScale: getComputedStyle(document.documentElement).getPropertyValue('--font-scale').trim() }; });
  rec({ scenario: s, viewport: '390x844', dpr: 3, theme: 'light', textSize: 'Large', transport: 'http:',
    studyRootOverflow: of1, dialogMetrics: dv, screenshots: [rootShot, await shot(page, 'large-text-replacement-dialog')],
    pass: !of1 && !!dv && dv.titleFullyVisible && dv.safeFullyVisible });
  await ctx.close();
});

await browser.close();
fs.writeFileSync(path.join(OUT, 'browser-results-6.json'), JSON.stringify({ results, console: allConsole }, null, 2));
console.log('\nWROTE browser-results-6.json');
