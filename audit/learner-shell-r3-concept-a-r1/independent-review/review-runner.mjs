/**
 * Independent browser review runner — Learner Shell R3 Concept A.
 * Written for the review seat; deliberately NOT derived from the producer's browser-smoke.mjs.
 * Drives system Google Chrome via Playwright (channel: "chrome"), disposable profiles,
 * normal web security, canonical bundled questions only. Mutates no bank or source file.
 */
import fs from 'node:fs';
import path from 'node:path';
import pw from '/Users/holemini/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
const { chromium } = pw;

const BASE = process.env.APP_URL || 'http://127.0.0.1:5199/';
const OUT = path.resolve(process.argv[2] || '.');
const SHOTS = path.join(OUT, 'screenshots');
fs.mkdirSync(SHOTS, { recursive: true });

const results = [];
const allConsole = [];

function rec(o) { results.push(o); console.log(`[${o.pass === true ? 'PASS' : o.pass === false ? 'FAIL' : 'INFO'}] ${o.scenario}${o.note ? ' — ' + o.note : ''}`); }

async function newPage(browser, { width = 1440, height = 900, theme = 'light', dpr = 1, scenario = '' } = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height }, deviceScaleFactor: dpr, colorScheme: theme,
  });
  const page = await ctx.newPage();
  page.on('console', m => allConsole.push({ scenario, type: m.type(), text: m.text() }));
  page.on('pageerror', e => allConsole.push({ scenario, type: 'pageerror', text: e.message }));
  page.on('requestfailed', r => allConsole.push({ scenario, type: 'requestfailed', text: `${r.url()} :: ${r.failure()?.errorText}` }));
  return { ctx, page };
}

const settle = async (p, ms = 1400) => { await p.waitForLoadState('networkidle').catch(()=>{}); await p.waitForTimeout(ms); };

async function shot(page, name) { const f = path.join(SHOTS, name + '.png'); await page.screenshot({ path: f, fullPage: false }); return path.relative(OUT, f); }

const navLabels = p => p.$$eval('nav.app-primary-nav button', els => els.map(e => e.innerText.trim().split('\n')[0]));
const overflow = p => p.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, inner: window.innerWidth, overflowing: document.documentElement.scrollWidth > window.innerWidth + 1 }));
const metrics = p => p.evaluate(() => ({ cssViewport: [window.innerWidth, window.innerHeight], dpr: window.devicePixelRatio }));

// Expand the "Start another set" disclosure if collapsed, then start.
async function startSet(page) {
  const d = page.locator('details.study-new-set');
  if (await d.count() && !(await d.evaluate(e => e.open))) await page.locator('details.study-new-set > summary').click();
  await page.locator('button.test-start').click();
  await settle(page, 1600);
}

async function answerCurrent(page) {
  const opts = page.locator('.question-card button[class*="option"], .question-card .option-answer button, .question-card label');
  // generic: click first enabled choice control inside the card
  const choice = page.locator('.question-card').locator('button, input[type=radio], input[type=checkbox]');
  const n = await choice.count();
  for (let i = 0; i < n; i++) {
    const c = choice.nth(i);
    const txt = ((await c.innerText().catch(()=> '')) || '').trim();
    if (/Submit|Skip|End set|Calculator|Save question|EN|ZH|中文|Read|Copy/i.test(txt)) continue;
    if (await c.isEnabled().catch(()=>false)) { await c.click({ force: true }).catch(()=>{}); break; }
  }
  await page.waitForTimeout(350);
}

async function run() {
  const browser = await chromium.launch({ channel: 'chrome' });

  // ---------- S1/S2 desktop root, light + dark ----------
  for (const theme of ['light', 'dark']) {
    const s = `desktop-root-${theme}`;
    const { ctx, page } = await newPage(browser, { theme, scenario: s });
    await page.goto(BASE); await settle(page);
    const nav = await navLabels(page);
    const util = await page.$$eval('.header-utility', e => e.map(x => x.innerText.trim()));
    const body = await page.innerText('body');
    const forbidden = ['Vocabulary', 'Developer'].filter(w => new RegExp(`\\b${w}\\b`).test(body));
    const reviewNav = nav.some(l => /Review|Vocab/i.test(l));
    const of = await overflow(page);
    rec({ scenario: s, viewport: '1440x900', dpr: 1, theme, textSize: 'Default', transport: 'http:',
      nav, headerUtility: util, forbiddenWordsInBody: forbidden, overflow: of,
      customizeOnStudy: await page.locator('.study-workspace button:has-text("Customize")').count(),
      screenshot: await shot(page, s),
      pass: JSON.stringify(nav) === JSON.stringify(['Study','Library','Progress']) && util.join() === 'Settings' && !reviewNav && !of.overflowing && forbidden.length === 0 });
    await ctx.close();
  }

  // ---------- S3/S4/S5 mobile roots ----------
  for (const [w, h, theme] of [[390,844,'light'],[390,844,'dark'],[320,720,'light']]) {
    const s = `mobile-${w}-root-${theme}`;
    const { ctx, page } = await newPage(browser, { width: w, height: h, theme, dpr: 3, scenario: s });
    await page.goto(BASE); await settle(page);
    const nav = await navLabels(page);
    const of = await overflow(page);
    const navBox = await page.locator('nav.app-primary-nav').boundingBox();
    const padBottom = await page.evaluate(() => getComputedStyle(document.querySelector('main')).paddingBottom);
    // obscuring check across the three primary destinations
    const obscured = {};
    for (const dest of ['Study','Library','Progress']) {
      await page.locator(`nav.app-primary-nav button:has-text("${dest}")`).click(); await settle(page, 900);
      const last = await page.evaluate(() => {
        const els = [...document.querySelectorAll('main button, main a, main li, main tr')].filter(e => e.offsetParent !== null);
        const e = els[els.length - 1]; if (!e) return null;
        const r = e.getBoundingClientRect(); return { bottom: r.bottom, text: (e.innerText||'').trim().slice(0,40) };
      });
      const nb = await page.locator('nav.app-primary-nav').boundingBox();
      // scroll to end then re-measure
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(400);
      const lastAfter = await page.evaluate(() => {
        const els = [...document.querySelectorAll('main button, main a, main li, main tr')].filter(e => e.offsetParent !== null);
        const e = els[els.length - 1]; if (!e) return null;
        const r = e.getBoundingClientRect(); return { bottom: r.bottom, text: (e.innerText||'').trim().slice(0,40) };
      });
      obscured[dest] = { lastRowBottomAfterScroll: lastAfter?.bottom, navTop: nb?.y, clear: lastAfter && nb ? lastAfter.bottom <= nb.y + 1 : null, text: lastAfter?.text };
    }
    await page.locator('nav.app-primary-nav button:has-text("Study")').click(); await settle(page, 800);
    rec({ scenario: s, viewport: `${w}x${h}`, dpr: 3, theme, textSize: 'Default', transport: 'http:',
      nav, tabCount: nav.length, navFixedBottom: navBox ? Math.round(navBox.y + navBox.height) >= h - 2 : null,
      mainPaddingBottom: padBottom, overflow: of, contentClearOfNav: obscured,
      screenshot: await shot(page, s),
      pass: nav.length === 3 && JSON.stringify(nav) === JSON.stringify(['Study','Library','Progress']) && !of.overflowing
            && Object.values(obscured).every(o => o.clear !== false) });
    await ctx.close();
  }

  fs.writeFileSync(path.join(OUT, 'browser-results-1.json'), JSON.stringify({ results, console: allConsole }, null, 2));
  await browser.close();
}
run().catch(e => { console.error('RUNNER FAIL', e); process.exit(1); });
