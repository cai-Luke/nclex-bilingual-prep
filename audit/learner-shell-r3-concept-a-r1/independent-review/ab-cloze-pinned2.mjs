/** Decisive pinned A/B: the SAME dropdown_cloze rows in both builds at 390px. */
import fs from 'node:fs'; import path from 'node:path';
import pw from '/Users/holemini/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
const { chromium } = pw;
const OUT = path.resolve(process.argv[2]);
const settle = async (p, ms = 1100) => { await p.waitForLoadState('networkidle').catch(()=>{}); await p.waitForTimeout(ms); };
const ROWS = [0, 1, 2, 3, 4];   // first five dropdown-cloze rows, same deterministic bank order in both builds
const browser = await chromium.launch({ channel: 'chrome' });
const res = {};
for (const [build, url] of [['implementation','http://127.0.0.1:5199/'], ['baseline','http://127.0.0.1:5198/']]) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(url); await settle(page, 1500);
  await page.locator('nav.app-primary-nav button:has-text("Library")').first().click({ force: true }); await settle(page, 1200);
  await page.locator('.filters select').nth(3).selectOption({ label: 'gpt-canonical' }).catch(()=>{}); await settle(page, 1100);
  const clozeIdx = await page.$$eval('.question-row', rs => rs.map((r, i) => ({ i, p: r.querySelector('.type-pill')?.innerText.trim() }))
    .filter(x => x.p === 'dropdown cloze').map(x => x.i));
  const picks = ROWS.map(k => clozeIdx[k]).filter(v => v !== undefined);
  const out = [];
  for (const i of picks) {
    await page.locator('nav.app-primary-nav button:has-text("Library")').first().click({ force: true }).catch(()=>{}); await settle(page, 900);
    await page.locator('.filters select').nth(3).selectOption({ label: 'gpt-canonical' }).catch(()=>{}); await settle(page, 900);
    await page.locator('.question-row').nth(i).locator('button:has-text("Practice")').click({ force: true }).catch(()=>{});
    await settle(page, 1400);
    const m = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, innerW: innerWidth,
      over: document.documentElement.scrollWidth > innerWidth + 1,
      widest: (() => { let b = null; for (const e of document.querySelectorAll('main *')) { const r = e.getBoundingClientRect();
        if (r.right > innerWidth + 1 && (!b || r.right > b.right)) b = { right: Math.round(r.right), cls: String(e.className).slice(0,45) }; } return b; })() }));
    out.push({ row: i, ...m });
  }
  res[build] = { clozeRowIndices: picks, measurements: out };
  console.log(build, JSON.stringify(out.map(o => `row${o.row}:over=${o.over},w=${o.scrollW}`)));
  await ctx.close();
}
await browser.close();
const rows = res.implementation.measurements.map(im => { const b = res.baseline.measurements.find(x => x.row === im.row);
  return { row: im.row, implOver: im.over, implW: im.scrollW, baseOver: b?.over, baseW: b?.scrollW,
           sameBehavior: b ? (im.over === b.over && im.scrollW === b.scrollW) : null, culprit: im.widest?.cls ?? b?.widest?.cls }; });
console.log('\nrow  impl(over,w)        baseline(over,w)     identical  culprit');
for (const r of rows) console.log(`${String(r.row).padEnd(4)} ${String(r.implOver).padEnd(5)},${String(r.implW).padEnd(6)}      ${String(r.baseOver).padEnd(5)},${String(r.baseW).padEnd(6)}      ${r.sameBehavior}      ${r.culprit ?? '-'}`);
console.log('ALL IDENTICAL:', rows.every(r => r.sameBehavior));
fs.writeFileSync(path.join(OUT, 'ab-cloze-pinned.json'), JSON.stringify({ res, rows, allIdentical: rows.every(r => r.sameBehavior) }, null, 2));
