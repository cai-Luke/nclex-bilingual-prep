/** A/B: baseline 511f66b (:5198) vs implementation d581a66 (:5199) on pinned questions.
 *  Determines whether mobile horizontal overflow and calculator/submit overlap are inherited. */
import fs from 'node:fs'; import path from 'node:path';
import pw from '/Users/holemini/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
const { chromium } = pw;
const OUT = path.resolve(process.argv[2]); const SHOTS = path.join(OUT, 'screenshots');
const BUILDS = { baseline: 'http://127.0.0.1:5198/', implementation: 'http://127.0.0.1:5199/' };
const settle = async (p, ms = 1400) => { await p.waitForLoadState('networkidle').catch(()=>{}); await p.waitForTimeout(ms); };
const out = [];

async function probe(browser, build, url, source, wantPill) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const page = await ctx.newPage();
  const cons = [];
  page.on('console', m => cons.push(m.type() + ': ' + m.text()));
  page.on('pageerror', e => cons.push('pageerror: ' + e.message));
  await page.goto(url); await settle(page, 1600);
  await page.locator('nav.app-primary-nav button:has-text("Library")').first().click({ force: true }); await settle(page, 1400);
  const sels = page.locator('.filters select');
  // Source is the 4th select in both builds
  await sels.nth(3).selectOption({ label: source }).catch(()=>{});
  await settle(page, 1300);
  const rows = page.locator('.question-row');
  const n = Math.min(await rows.count(), 60);
  let picked = null;
  for (let i = 0; i < n; i++) {
    const pill = (await rows.nth(i).locator('.type-pill').innerText().catch(()=> '')).trim();
    if (pill.toLowerCase().replace(/\s+/g,'_') === wantPill) {
      const stem = (await rows.nth(i).innerText().catch(()=> '')).trim().slice(0, 60);
      await rows.nth(i).locator('button:has-text("Practice")').click({ force: true });
      await settle(page, 1800); picked = { index: i, pill, stem }; break;
    }
  }
  const m = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth, innerW: innerWidth,
    bodyScrollW: document.body.scrollWidth,
    overflowing: document.documentElement.scrollWidth > innerWidth + 1,
    widest: (() => { let best = null;
      for (const e of document.querySelectorAll('main *')) { const r = e.getBoundingClientRect();
        if (r.right > innerWidth + 1 && (!best || r.right > best.right)) best = { right: r.right, cls: e.className?.toString().slice(0,60), tag: e.tagName }; }
      return best; })(),
  }));
  await page.screenshot({ path: path.join(SHOTS, `ab-${build}-${wantPill}.png`) });
  // calculator overlap
  let calc = null;
  const L = page.locator('.exam-calculator-launcher').first();
  if (await L.count()) {
    await L.click({ force: true }); await page.waitForTimeout(900);
    calc = await page.evaluate(() => {
      const p = document.querySelector('.exam-calculator'); const s = document.querySelector('button.submit-button');
      if (!p || !s) return { panel: !!p, submit: !!s };
      const a = p.getBoundingClientRect(), b = s.getBoundingClientRect();
      return { panelRect: { top: a.top, bottom: a.bottom }, submitRect: { top: b.top, bottom: b.bottom },
               verticalOverlap: !(a.top >= b.bottom - 1 || a.bottom <= b.top + 1) };
    });
    await page.screenshot({ path: path.join(SHOTS, `ab-${build}-${wantPill}-calc.png`) });
  }
  await ctx.close();
  return { build, source, wantPill, picked, metrics: m, calculator: calc, console: cons };
}

const browser = await chromium.launch({ channel: 'chrome' });
for (const [pill, source] of [['dropdown_cloze','gpt-canonical'], ['matrix','gpt-canonical'], ['multiple_choice','gpt-canonical']]) {
  for (const [build, url] of Object.entries(BUILDS)) {
    const r = await probe(browser, build, url, source, pill);
    out.push(r);
    console.log(`${build.padEnd(15)} ${pill.padEnd(16)} picked=${r.picked ? 'row' + r.picked.index : 'NONE'} overflow=${r.metrics.overflowing} scrollW=${r.metrics.scrollW} widest=${JSON.stringify(r.metrics.widest)} calcOverlap=${r.calculator?.verticalOverlap}`);
  }
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'ab-baseline-vs-impl.json'), JSON.stringify(out, null, 2));
