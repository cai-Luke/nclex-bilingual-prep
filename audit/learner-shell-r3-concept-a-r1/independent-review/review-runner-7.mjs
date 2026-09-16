/** Part 7 — real Chrome 200% zoom (browser-level scaling, not CSS), production file:// load,
 *  and the inherited manifest diagnostic comparison against baseline 511f66b. */
import fs from 'node:fs'; import path from 'node:path';
import pw from '/Users/holemini/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
const { chromium } = pw;
const OUT = path.resolve(process.argv[2]); const SHOTS = path.join(OUT, 'screenshots');
const IMPL_DIST = process.argv[3]; const BASE_DIST = process.argv[4];
const results = [], allConsole = [];
const rec = o => { results.push(o); console.log(`[${o.pass === true ? 'PASS' : o.pass === false ? 'FAIL' : 'INFO'}] ${o.scenario}${o.note ? ' — ' + o.note : ''}`); };
const settle = async (p, ms = 1500) => { await p.waitForLoadState('networkidle').catch(()=>{}); await p.waitForTimeout(ms); };
const shot = async (p, n) => { await p.screenshot({ path: path.join(SHOTS, n + '.png') }); return 'screenshots/' + n + '.png'; };
async function ensureOpen(page) {
  const d = page.locator('details.study-new-set');
  if (await d.count() && !(await d.evaluate(e => e.open))) { await page.locator('details.study-new-set > summary').click().catch(()=>{}); await page.waitForTimeout(350); }
}

// ---------- 200% zoom via Chrome's own device-scale path (browser-level, reflows like the zoom setting) ----------
{
  const s = 'chrome-200-percent-zoom';
  const browser = await chromium.launch({ channel: 'chrome', args: ['--force-device-scale-factor=2', '--window-size=1440,900'] });
  const ctx = await browser.newContext({ viewport: null });
  const page = await ctx.newPage();
  const cons = []; page.on('console', m => cons.push(m.type() + ': ' + m.text())); page.on('pageerror', e => cons.push('pageerror: ' + e.message));
  await page.goto('http://127.0.0.1:5199/'); await settle(page);
  const m1 = await page.evaluate(() => ({ cssViewport: [innerWidth, innerHeight], dpr: devicePixelRatio,
    overflow: document.documentElement.scrollWidth > innerWidth + 1 }));
  const nav = await page.$$eval('nav.app-primary-nav button', e => e.map(x => x.innerText.trim().split('\n')[0]));
  const rootShot = await shot(page, 'zoom200-study-root');
  // protected session, then the replacement dialog under 200%
  await ensureOpen(page);
  await page.locator('button.test-start').first().click({ force: true }); await settle(page, 1800);
  const c = page.locator('.question-card').locator('button, input[type=radio], input[type=checkbox], select');
  for (let i = 0, n = await c.count(); i < n; i++) { const e = c.nth(i); const t = ((await e.innerText().catch(()=> '')) || '').trim();
    if (/Submit|Skip|End set|Calculator|Save question|需要中文|^EN$|^ZH$|EN\/ZH|Tap ZH/i.test(t)) continue;
    if (await e.isVisible().catch(()=>false) && await e.isEnabled().catch(()=>false)) { await e.click({ force: true }).catch(()=>{}); break; } }
  await page.waitForTimeout(500);
  const sub = page.locator('button.submit-button').first();
  if (await sub.count() && await sub.isEnabled().catch(()=>false)) { await sub.click({ force: true }).catch(()=>{}); await page.waitForTimeout(1300); }
  const skip = page.locator('button:has-text("Skip for now")').first();
  if (await skip.count()) { await skip.click({ force: true }).catch(()=>{}); await page.waitForTimeout(900); }
  await page.reload(); await settle(page, 2400);
  await ensureOpen(page);
  await page.locator('button.test-start').first().click({ force: true }); await page.waitForTimeout(1400);
  const dv = await page.evaluate(() => { const d = document.querySelector('dialog.session-replacement-dialog'); if (!d || !d.open) return null;
    const t = d.querySelector('#session-replacement-title'), sa = d.querySelector('button.primary-action');
    const tr = t.getBoundingClientRect(), sr = sa.getBoundingClientRect();
    return { titleFullyVisible: tr.top >= 0 && tr.bottom <= innerHeight, safeFullyVisible: sr.top >= 0 && sr.bottom <= innerHeight,
      safeReachableWithoutScroll: sr.bottom <= innerHeight, titleTop: Math.round(tr.top), safeBottom: Math.round(sr.bottom),
      innerHeight, dialogScrollable: d.scrollHeight > d.clientHeight }; });
  const dlgShot = await shot(page, 'zoom200-replacement-dialog');
  rec({ scenario: s, viewport: `window 1440x900 @ --force-device-scale-factor=2`, cssViewport: m1.cssViewport, dpr: m1.dpr,
    theme: 'light', textSize: 'Default', transport: 'http:', method: "Chrome browser-level scaling via --force-device-scale-factor=2 (reflows as the zoom setting does); not CSS zoom, not a Playwright deviceScaleFactor override",
    nav, studyRootOverflow: m1.overflow, dialogMetrics: dv, console: cons, screenshots: [rootShot, dlgShot],
    pass: m1.dpr === 2 && !m1.overflow && !!dv && dv.titleFullyVisible && dv.safeFullyVisible });
  await ctx.close(); await browser.close();
}

// ---------- production file:// : implementation and baseline ----------
for (const [label, dist] of [['implementation', IMPL_DIST], ['baseline', BASE_DIST]]) {
  const s = `file-protocol-${label}`;
  const browser = await chromium.launch({ channel: 'chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const cons = [];
  page.on('console', m => cons.push({ type: m.type(), text: m.text() }));
  page.on('pageerror', e => cons.push({ type: 'pageerror', text: e.message }));
  page.on('requestfailed', r => cons.push({ type: 'requestfailed', text: `${r.url().split('/').pop()} :: ${r.failure()?.errorText}` }));
  const url = 'file://' + path.join(dist, 'index.html');
  await page.goto(url); await settle(page, 2200);
  const loaded = await page.locator('.app-shell').count();
  const nav = await page.$$eval('nav.app-primary-nav button', e => e.map(x => x.innerText.trim().split('\n')[0])).catch(()=>[]);
  const navResults = {};
  if (label === 'implementation') {
    for (const dest of ['Library', 'Progress']) {
      await page.locator(`nav.app-primary-nav button:has-text("${dest}")`).click({ force: true }).catch(()=>{});
      await settle(page, 1200); navResults[dest] = (await page.locator('main').innerText().catch(()=> '')).length > 60;
    }
    await page.locator('.header-utility').click({ force: true }).catch(()=>{}); await settle(page, 1100);
    navResults.Settings = (await page.locator('main').innerText().catch(()=> '')).length > 60;
    await page.locator('nav.app-primary-nav button:has-text("Study")').click({ force: true }).catch(()=>{}); await settle(page, 1100);
    await ensureOpen(page);
    await page.locator('button.test-start').first().click({ force: true }).catch(()=>{}); await settle(page, 2000);
    navResults.startedStudy = (await page.locator('.question-card').count()) > 0;
    await page.reload(); await settle(page, 2400);
    navResults.resumeAfterReload = (await page.locator('button.resume-action').count()) > 0;
  }
  const modulePathErrors = cons.filter(c => /Failed to load module|MIME|net::ERR_FILE|Loading module|Failed to fetch dynamically/i.test(c.text));
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'file:',
    url, appMounted: loaded > 0, nav, navigationChecks: navResults,
    consoleMessages: cons, consoleCount: cons.length, modulePathErrors,
    screenshot: await shot(page, s), pass: loaded > 0 && modulePathErrors.length === 0 });
  await ctx.close(); await browser.close();
}
fs.writeFileSync(path.join(OUT, 'browser-results-7.json'), JSON.stringify({ results, console: allConsole }, null, 2));
console.log('\nWROTE browser-results-7.json');
