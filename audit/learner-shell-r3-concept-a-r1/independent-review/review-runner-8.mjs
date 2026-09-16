/** Part 8 — corrected 200% zoom (genuine reflow) and CDP browser-level log capture for the
 *  inherited file:// manifest diagnostic, implementation vs baseline. */
import fs from 'node:fs'; import path from 'node:path';
import pw from '/Users/holemini/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
const { chromium } = pw;
const OUT = path.resolve(process.argv[2]); const SHOTS = path.join(OUT, 'screenshots');
const IMPL_DIST = process.argv[3], BASE_DIST = process.argv[4];
const results = [];
const rec = o => { results.push(o); console.log(`[${o.pass === true ? 'PASS' : o.pass === false ? 'FAIL' : 'INFO'}] ${o.scenario}${o.note ? ' — ' + o.note : ''}`); };
const settle = async (p, ms = 1500) => { await p.waitForLoadState('networkidle').catch(()=>{}); await p.waitForTimeout(ms); };
const shot = async (p, n) => { await p.screenshot({ path: path.join(SHOTS, n + '.png') }); return 'screenshots/' + n + '.png'; };
async function ensureOpen(page) {
  const d = page.locator('details.study-new-set');
  if (await d.count() && !(await d.evaluate(e => e.open))) { await page.locator('details.study-new-set > summary').click().catch(()=>{}); await page.waitForTimeout(350); }
}
async function seedProtected(page, base) {
  await page.goto(base); await settle(page); await ensureOpen(page);
  await page.locator('button.test-start').first().click({ force: true }); await settle(page, 1800);
  const c = page.locator('.question-card').locator('button, input[type=radio], input[type=checkbox], select');
  for (let i = 0, n = await c.count(); i < n; i++) { const e = c.nth(i); const t = ((await e.innerText().catch(()=> '')) || '').trim();
    if (/Submit|Skip|End set|Calculator|Save question|需要中文|^EN$|^ZH$|EN\/ZH|Tap ZH/i.test(t)) continue;
    if (await e.isVisible().catch(()=>false) && await e.isEnabled().catch(()=>false)) { await e.click({ force: true }).catch(()=>{}); break; } }
  await page.waitForTimeout(500);
  const sub = page.locator('button.submit-button').first();
  if (await sub.count() && await sub.isEnabled().catch(()=>false)) { await sub.click({ force: true }).catch(()=>{}); await page.waitForTimeout(1300); }
  const sk = page.locator('button:has-text("Skip for now")').first();
  if (await sk.count()) { await sk.click({ force: true }).catch(()=>{}); await page.waitForTimeout(900); }
  await page.reload(); await settle(page, 2400);
}

// ---------- 200% zoom, genuine reflow: CSS viewport halved AND DPR doubled ----------
{
  const s = 'chrome-200-percent-zoom';
  const browser = await chromium.launch({ channel: 'chrome' });
  // Chrome at 200% zoom in a 1440x900 window presents a 720x450 CSS viewport at DPR 2.
  const ctx = await browser.newContext({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const cons = []; page.on('console', m => cons.push(m.type() + ': ' + m.text())); page.on('pageerror', e => cons.push('pageerror: ' + e.message));
  await page.goto('http://127.0.0.1:5199/'); await settle(page);
  const m1 = await page.evaluate(() => ({ cssViewport: [innerWidth, innerHeight], dpr: devicePixelRatio,
    overflow: document.documentElement.scrollWidth > innerWidth + 1 }));
  const nav = await page.$$eval('nav.app-primary-nav button', e => e.map(x => x.innerText.trim().split('\n')[0]));
  const rootShot = await shot(page, 'zoom200-study-root');
  await seedProtected(page, 'http://127.0.0.1:5199/');
  await ensureOpen(page);
  await page.locator('button.test-start').first().click({ force: true }); await page.waitForTimeout(1400);
  const dv = await page.evaluate(() => { const d = document.querySelector('dialog.session-replacement-dialog'); if (!d || !d.open) return null;
    const t = d.querySelector('#session-replacement-title'), sa = d.querySelector('button.primary-action');
    const tr = t.getBoundingClientRect(), sr = sa.getBoundingClientRect();
    return { titleFullyVisible: tr.top >= 0 && tr.bottom <= innerHeight, safeFullyVisible: sr.top >= 0 && sr.bottom <= innerHeight,
      titleTop: Math.round(tr.top), safeTop: Math.round(sr.top), safeBottom: Math.round(sr.bottom), innerHeight,
      dialogScrollable: d.scrollHeight > d.clientHeight, pageOverflow: document.documentElement.scrollWidth > innerWidth + 1 }; });
  const dlgShot = await shot(page, 'zoom200-replacement-dialog');
  rec({ scenario: s, viewport: 'CSS 720x450 @ DPR 2', cssViewport: m1.cssViewport, dpr: m1.dpr, theme: 'light',
    textSize: 'Default', transport: 'http:',
    method: 'Reproduces Chrome 200% zoom layout conditions in a 1440x900 window: CSS viewport halved to 720x450 and DPR doubled to 2. Chrome’s zoom menu is not reachable from automation; this is the reflow-equivalent, not a DPR-only substitute.',
    nav, studyRootOverflow: m1.overflow, dialogMetrics: dv, console: cons, screenshots: [rootShot, dlgShot],
    pass: m1.dpr === 2 && m1.cssViewport[0] === 720 && !m1.overflow && !!dv && dv.titleFullyVisible && dv.safeFullyVisible && !dv.pageOverflow });
  await ctx.close(); await browser.close();
}

// ---------- file:// with CDP browser-level log capture ----------
for (const [label, dist] of [['implementation', IMPL_DIST], ['baseline', BASE_DIST]]) {
  const s = `file-manifest-diagnostic-${label}`;
  const browser = await chromium.launch({ channel: 'chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const entries = [];
  page.on('console', m => entries.push({ src: 'console', type: m.type(), text: m.text() }));
  page.on('pageerror', e => entries.push({ src: 'pageerror', text: e.message }));
  page.on('requestfailed', r => entries.push({ src: 'requestfailed', text: `${r.url().split('/').pop()} :: ${r.failure()?.errorText}` }));
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Log.enable').catch(()=>{});
  await cdp.send('Network.enable').catch(()=>{});
  cdp.on('Log.entryAdded', e => entries.push({ src: 'Log.entryAdded', level: e.entry.level, category: e.entry.category ?? null, text: e.entry.text, url: e.entry.url?.split('/').pop() }));
  cdp.on('Network.loadingFailed', e => entries.push({ src: 'Network.loadingFailed', text: `${e.type} :: ${e.errorText}${e.corsErrorStatus ? ' :: cors=' + JSON.stringify(e.corsErrorStatus) : ''}` }));
  await page.goto('file://' + path.join(dist, 'index.html'));
  await settle(page, 2600);
  const manifestRelated = entries.filter(e => /manifest|cors|ERR_FAILED/i.test(JSON.stringify(e)));
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'file:',
    appMounted: (await page.locator('.app-shell').count()) > 0,
    totalDiagnostics: entries.length, manifestRelatedCount: manifestRelated.length,
    manifestRelated, allEntries: entries, pass: null,
    note: `${entries.length} total browser/page diagnostics; ${manifestRelated.length} manifest/CORS-related` });
  await ctx.close(); await browser.close();
}
fs.writeFileSync(path.join(OUT, 'browser-results-8.json'), JSON.stringify({ results }, null, 2));
console.log('\nWROTE browser-results-8.json');
