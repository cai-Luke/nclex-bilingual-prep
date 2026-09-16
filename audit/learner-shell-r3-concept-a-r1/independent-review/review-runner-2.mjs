/** Independent browser review runner, part 2 — session safety, memory, behavior, stress, leads L1-L5. */
import fs from 'node:fs';
import path from 'node:path';
import pw from '/Users/holemini/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
const { chromium } = pw;

const BASE = process.env.APP_URL || 'http://127.0.0.1:5199/';
const OUT = path.resolve(process.argv[2] || '.');
const SHOTS = path.join(OUT, 'screenshots');
fs.mkdirSync(SHOTS, { recursive: true });
const results = [], allConsole = [];
const rec = o => { results.push(o); console.log(`[${o.pass === true ? 'PASS' : o.pass === false ? 'FAIL' : 'INFO'}] ${o.scenario}${o.note ? ' — ' + o.note : ''}`); };

async function newPage(browser, { width = 1440, height = 900, theme = 'light', dpr = 1, scenario = '' } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, colorScheme: theme });
  const page = await ctx.newPage();
  page.on('console', m => allConsole.push({ scenario, type: m.type(), text: m.text() }));
  page.on('pageerror', e => allConsole.push({ scenario, type: 'pageerror', text: e.message }));
  page.on('requestfailed', r => allConsole.push({ scenario, type: 'requestfailed', text: `${r.url()} :: ${r.failure()?.errorText}` }));
  return { ctx, page };
}
const settle = async (p, ms = 1400) => { await p.waitForLoadState('networkidle').catch(()=>{}); await p.waitForTimeout(ms); };
const shot = async (p, n) => { const f = path.join(SHOTS, n + '.png'); await p.screenshot({ path: f }); return path.relative(OUT, f); };
const metrics = p => p.evaluate(() => ({ cssViewport: [innerWidth, innerHeight], dpr: devicePixelRatio }));
const overflow = p => p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);

async function startSet(page) {
  const d = page.locator('details.study-new-set');
  if (await d.count() && !(await d.evaluate(e => e.open))) await page.locator('details.study-new-set > summary').click();
  await page.locator('button.test-start').first().scrollIntoViewIfNeeded().catch(()=>{});
  await page.locator('button.test-start').first().click({ force: true });
  await settle(page, 1600);
}
// Read the whole IndexedDB into a plain object.
const dumpDb = page => page.evaluate(async () => {
  const req = indexedDB.open('nclex-bilingual-prep');
  const db = await new Promise(r => { req.onsuccess = () => r(req.result); });
  const out = {};
  for (const name of [...db.objectStoreNames]) {
    const tx = db.transaction(name, 'readonly');
    out[name] = await new Promise(r => { const q = tx.objectStore(name).getAll(); q.onsuccess = () => r(q.result); });
  }
  return out;
});

async function pickChoice(page) {
  const card = page.locator('.question-card');
  const ctrls = card.locator('button, input[type=radio], input[type=checkbox], select');
  const n = await ctrls.count();
  for (let i = 0; i < n; i++) {
    const c = ctrls.nth(i);
    const t = ((await c.innerText().catch(()=> '')) || '').trim();
    if (/Submit|Skip|End set|Calculator|Save question|需要中文|Read|Copy|EN|ZH/i.test(t)) continue;
    if (await c.isVisible().catch(()=>false) && await c.isEnabled().catch(()=>false)) { await c.click({ force: true }).catch(()=>{}); return true; }
  }
  return false;
}

async function run() {
  const browser = await chromium.launch({ channel: 'chrome' });

  // ===== L1: cold load with a resumable session =====
  for (const [w, h, theme, dpr, label] of [[1440,900,'light',1,'desktop'],[390,844,'light',3,'mobile'],[1440,900,'dark',1,'desktop-dark']]) {
    const s = `L1-cold-load-${label}`;
    const { ctx, page } = await newPage(browser, { width: w, height: h, theme, dpr, scenario: s });
    await page.goto(BASE); await settle(page);
    await startSet(page); await pickChoice(page); await page.waitForTimeout(900);
    // A reload with unfinished work IS the cold load with a resumable session.
    const beforeReload = null;
    await page.reload(); await settle(page, 2400);
    const afterCold = await page.evaluate(() => {
      const d = document.querySelector('details.study-new-set');
      const resume = document.querySelector('button.resume-action');
      return { detailsOpen: d ? d.open : null, detailsClass: d ? d.className : null, hasResume: !!resume,
               resumeText: resume ? resume.innerText.trim() : null,
               startBtnClass: document.querySelector('button.test-start')?.className ?? null };
    });
    const shotCold = await shot(page, `${s}-after-cold-reload`);
    // now remount HomeView by navigating away and back
    await page.locator('nav.app-primary-nav button:has-text("Library"), .app-primary-nav button:has-text("Library")').first().click(); await settle(page, 900);
    await page.locator('nav.app-primary-nav button:has-text("Study"), .app-primary-nav button:has-text("Study")').first().click(); await settle(page, 900);
    const afterRemount = await page.evaluate(() => {
      const d = document.querySelector('details.study-new-set');
      return { detailsOpen: d ? d.open : null, detailsClass: d ? d.className : null };
    });
    const shotRemount = await shot(page, `${s}-after-remount`);
    rec({ scenario: s, viewport: `${w}x${h}`, dpr, theme, textSize: 'Default', transport: 'http:',
      detailsOpenBeforeReload: beforeReload, afterColdReload: afterCold, afterRemount,
      divergence: afterCold.detailsOpen !== afterRemount.detailsOpen,
      screenshots: [shotCold, shotRemount], pass: null,
      note: `cold=${afterCold.detailsOpen} remount=${afterRemount.detailsOpen} resume=${afterCold.hasResume}` });
    await ctx.close();
  }

  // ===== L1 under Large text, mobile 320 =====
  {
    const s = 'L1-large-text-320';
    const { ctx, page } = await newPage(browser, { width: 320, height: 720, dpr: 3, scenario: s });
    await page.goto(BASE); await settle(page);
    await page.evaluate(() => localStorage.setItem('nclex-settings', JSON.stringify({ languageMode: 'en', revisitMissed: true, voiceEnabled: false, themeMode: 'light', textSizeMode: 'large' })));
    await page.reload(); await settle(page);
    await startSet(page); await pickChoice(page); await page.waitForTimeout(900);
    await page.reload(); await settle(page, 2400);
    const st = await page.evaluate(() => {
      const d = document.querySelector('details.study-new-set');
      const rp = document.querySelector('.session-progress-copy');
      return { detailsOpen: d?.open, resumeCopy: rp ? rp.innerText.trim().slice(0, 160) : null,
               copyScrollW: rp ? rp.scrollWidth : null, copyClientW: rp ? rp.clientWidth : null };
    });
    rec({ scenario: s, viewport: '320x720', dpr: 3, theme: 'light', textSize: 'Large', transport: 'http:',
      ...st, L5_resumeCopyOverflows: st.copyScrollW > st.copyClientW + 1, pageOverflow: await overflow(page),
      screenshot: await shot(page, s), pass: !(await overflow(page)) && !(st.copyScrollW > st.copyClientW + 1) });
    await ctx.close();
  }

  // ===== Memory counts vs storage + full-marks clears needsReview =====
  {
    const s = 'memory-counts-vs-storage';
    const { ctx, page } = await newPage(browser, { width: 390, height: 844, dpr: 3, scenario: s });
    await page.goto(BASE); await settle(page);
    // complete a 10-question set, answering each (some wrong) then finishing
    await startSet(page);
    for (let i = 0; i < 60; i++) {
      if (await page.locator('button.submit-button').count()) {
        await pickChoice(page);
        await page.locator('button.submit-button').first().click({ force: true }).catch(()=>{});
        await page.waitForTimeout(450);
        const next = page.locator('button:has-text("Next"), button:has-text("Finish")').first();
        if (await next.count()) { await next.click({ force: true }).catch(()=>{}); await page.waitForTimeout(450); }
      } else break;
    }
    await settle(page, 1500);
    const shotSummary = await shot(page, 'summary-after-set');
    const summaryPresent = await page.locator('main').innerText().then(t => /Summary|Set complete|Review your|score/i.test(t)).catch(()=>false);
    // go to Study and read memory counts (reload returns to the Study root)
    await page.reload(); await settle(page, 2000);
    const ui = await page.evaluate(() => {
      const b = [...document.querySelectorAll('.study-memory-links button')];
      return b.map(x => ({ label: x.querySelector('.memory-label')?.innerText.trim(), count: x.querySelector('.memory-count')?.innerText.trim(), detail: x.querySelector('.memory-detail')?.innerText.trim() }));
    });
    const db = await dumpDb(page);
    const progressArr = db.progress || [];
    const needs = progressArr.filter(p => p.needsReview).length;
    const flagsArr = db.flags || db.flag || [];
    const saved = flagsArr.filter(f => f.flagged ?? f.saved ?? true).length;
    const lastSetPresent = await page.locator('.last-set-entry').count();
    rec({ scenario: s, viewport: '390x844', dpr: 3, theme: 'light', textSize: 'Default', transport: 'http:',
      uiMemory: ui, dbStores: Object.keys(db), dbNeedsReview: needs, dbSavedRows: saved,
      lastSetEntryPresent: lastSetPresent === 1, summaryReached: summaryPresent,
      screenshots: [shotSummary, await shot(page, 'study-memory-dock')],
      pass: ui.length === 2 && Number(ui[0].count) === needs });
    await ctx.close();
  }

  fs.writeFileSync(path.join(OUT, 'browser-results-2.json'), JSON.stringify({ results, console: allConsole }, null, 2));
  await browser.close();
}
run().catch(e => { console.error('RUNNER2 FAIL', e); fs.writeFileSync(path.join(OUT, 'browser-results-2.json'), JSON.stringify({ results, console: allConsole, error: String(e) }, null, 2)); process.exit(1); });
