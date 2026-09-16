/** Part 9 — replacement dialog under Chrome 200% zoom reflow conditions (CSS 720x450 @ DPR 2). */
import fs from 'node:fs'; import path from 'node:path';
import pw from '/Users/holemini/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
const { chromium } = pw;
const OUT = path.resolve(process.argv[2]); const SHOTS = path.join(OUT, 'screenshots');
const results = [];
const rec = o => { results.push(o); console.log(`[${o.pass === true ? 'PASS' : o.pass === false ? 'FAIL' : 'INFO'}] ${o.scenario}${o.note ? ' — ' + o.note : ''}`); };
const settle = async (p, ms = 1500) => { await p.waitForLoadState('networkidle').catch(()=>{}); await p.waitForTimeout(ms); };
const tap = async (loc) => { await loc.scrollIntoViewIfNeeded().catch(()=>{}); await loc.click({ timeout: 15000 }).catch(async () => { await loc.click({ force: true }).catch(()=>{}); }); };
async function ensureOpen(page) {
  const d = page.locator('details.study-new-set');
  if (await d.count() && !(await d.evaluate(e => e.open))) { await tap(page.locator('details.study-new-set > summary')); await page.waitForTimeout(350); }
}
const snap = page => page.evaluate(async () => {
  const r = indexedDB.open('nclex-bilingual-prep'); const db = await new Promise(x => { r.onsuccess = () => x(r.result); });
  const tx = db.transaction('activeSession', 'readonly');
  return await new Promise(x => { const q = tx.objectStore('activeSession').getAll();
    q.onsuccess = () => x(q.result.map(a => ({ id: a.sessionId, completed: a.completed, res: Object.keys(a.results || {}).length, ans: Object.keys(a.answers || {}).length, sk: (a.skippedQuestionIds || []).length }))); });
});

const browser = await chromium.launch({ channel: 'chrome' });
for (const [w, h, dpr, label, note] of [
  [720, 450, 2, 'zoom200', 'Chrome 200% zoom reflow: 1440x900 window -> CSS 720x450 @ DPR 2'],
  [360, 422, 2, 'zoom200-mobile', 'Chrome 200% zoom on a 720x844 mobile window -> CSS 360x422 @ DPR 2'],
]) {
  const s = `replacement-dialog-${label}`;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  const page = await ctx.newPage();
  const cons = []; page.on('console', m => cons.push(m.type() + ': ' + m.text())); page.on('pageerror', e => cons.push('pageerror: ' + e.message));
  await page.goto('http://127.0.0.1:5199/'); await settle(page, 2000);
  const m0 = await page.evaluate(() => ({ cssViewport: [innerWidth, innerHeight], dpr: devicePixelRatio, overflow: document.documentElement.scrollWidth > innerWidth + 1 }));
  const rootShot = await (async () => { await page.screenshot({ path: path.join(SHOTS, `${label}-study-root.png`) }); return `screenshots/${label}-study-root.png`; })();
  await ensureOpen(page);
  await tap(page.locator('button.test-start').first()); await settle(page, 2000);
  const inSession = await page.locator('.question-card').count();
  // make the session protected
  const c = page.locator('.question-card').locator('button, input[type=radio], input[type=checkbox], select');
  for (let i = 0, n = await c.count(); i < n; i++) { const e = c.nth(i); const t = ((await e.innerText().catch(()=> '')) || '').trim();
    if (/Submit|Skip|End set|Calculator|Save question|需要中文|^EN$|^ZH$|EN\/ZH|Tap ZH/i.test(t)) continue;
    if (await e.isVisible().catch(()=>false)) { await tap(e); break; } }
  await page.waitForTimeout(600);
  await tap(page.locator('button:has-text("Skip for now")').first()); await page.waitForTimeout(1300);
  const before = await snap(page);
  await page.reload(); await settle(page, 2400);
  await ensureOpen(page);
  await tap(page.locator('button.test-start').first()); await page.waitForTimeout(1500);
  const dv = await page.evaluate(() => { const d = document.querySelector('dialog.session-replacement-dialog'); if (!d || !d.open) return null;
    const t = d.querySelector('#session-replacement-title'), sa = d.querySelector('button.primary-action');
    const tr = t.getBoundingClientRect(), sr = sa.getBoundingClientRect();
    return { titleFullyVisible: tr.top >= 0 && tr.bottom <= innerHeight, safeFullyVisible: sr.top >= 0 && sr.bottom <= innerHeight,
      safeReachableWithoutScrolling: sr.bottom <= innerHeight, titleTop: Math.round(tr.top), safeTop: Math.round(sr.top),
      safeBottom: Math.round(sr.bottom), innerHeight, dialogScrollable: d.scrollHeight > d.clientHeight,
      focused: (document.activeElement?.innerText || '').trim().slice(0, 40),
      pageOverflow: document.documentElement.scrollWidth > innerWidth + 1 }; });
  await page.screenshot({ path: path.join(SHOTS, `${label}-replacement-dialog.png`) });
  await page.keyboard.press('Escape'); await page.waitForTimeout(1100);
  const after = await snap(page);
  rec({ scenario: s, viewport: `CSS ${w}x${h} @ DPR ${dpr}`, cssViewport: m0.cssViewport, dpr: m0.dpr, theme: 'light',
    textSize: 'Default', transport: 'http:', method: note,
    sessionStarted: inSession > 0, studyRootOverflow: m0.overflow, sessionsBefore: before, sessionsAfterEscape: after,
    escapePreservedSession: JSON.stringify(before) === JSON.stringify(after), dialogMetrics: dv, console: cons,
    screenshots: [rootShot, `screenshots/${label}-replacement-dialog.png`],
    pass: !m0.overflow && !!dv && dv.titleFullyVisible && dv.safeFullyVisible && !dv.pageOverflow && /Keep current set/.test(dv.focused) && JSON.stringify(before) === JSON.stringify(after) });
  await ctx.close();
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'browser-results-9.json'), JSON.stringify({ results }, null, 2));
console.log('\nWROTE browser-results-9.json');
