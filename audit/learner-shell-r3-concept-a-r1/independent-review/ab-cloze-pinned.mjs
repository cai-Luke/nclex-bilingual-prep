/** Pinned per-row A/B: identical dropdown_cloze items in baseline vs implementation at 390px. */
import fs from 'node:fs'; import path from 'node:path';
import pw from '/Users/holemini/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
const { chromium } = pw;
const OUT = path.resolve(process.argv[2]);
const settle = async (p, ms = 1200) => { await p.waitForLoadState('networkidle').catch(()=>{}); await p.waitForTimeout(ms); };
const browser = await chromium.launch({ channel: 'chrome' });
const byBuild = {};
for (const [build, url] of [['baseline','http://127.0.0.1:5198/'], ['implementation','http://127.0.0.1:5199/']]) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  const page = await ctx.newPage();
  await page.goto(url); await settle(page, 1600);
  await page.locator('nav.app-primary-nav button:has-text("Library")').first().click({ force: true }); await settle(page, 1400);
  await page.locator('.filters select').nth(3).selectOption({ label: 'gpt-canonical' }).catch(()=>{});
  await settle(page, 1300);
  // collect dropdown-cloze row indices (deterministic bank order, identical in both builds)
  const idx = await page.$$eval('.question-row', rows => rows.map((r, i) => ({ i, pill: r.querySelector('.type-pill')?.innerText.trim(), stem: r.innerText.trim().slice(0, 50) }))
    .filter(x => x.pill === 'dropdown cloze').slice(0, 8));
  const out = [];
  for (const { i, stem } of idx) {
    await page.locator('nav.app-primary-nav button:has-text("Library")').first().click({ force: true }).catch(()=>{});
    await settle(page, 1000);
    await page.locator('.filters select').nth(3).selectOption({ label: 'gpt-canonical' }).catch(()=>{});
    await settle(page, 1000);
    await page.locator('.question-row').nth(i).locator('button:has-text("Practice")').click({ force: true }).catch(()=>{});
    await settle(page, 1500);
    const m = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, innerW: innerWidth,
      over: document.documentElement.scrollWidth > innerWidth + 1,
      widest: (() => { let b = null; for (const e of document.querySelectorAll('main *')) { const r = e.getBoundingClientRect();
        if (r.right > innerWidth + 1 && (!b || r.right > b.right)) b = { right: Math.round(r.right), cls: e.className?.toString().slice(0,50) }; } return b; })() }));
    out.push({ row: i, stem, ...m });
  }
  byBuild[build] = out;
  console.log(build, JSON.stringify(out.map(o => ({ row: o.row, over: o.over, w: o.scrollW }))));
  await ctx.close();
}
await browser.close();
const rows = byBuild.baseline.map((b, k) => { const i = byBuild.implementation[k];
  return { row: b.row, stem: b.stem, baselineOver: b.over, baselineW: b.scrollW, implOver: i?.over, implW: i?.scrollW, identical: b.over === i?.over && b.scrollW === i?.scrollW }; });
console.log('\nPER-ROW COMPARISON:');
for (const r of rows) console.log(`row${String(r.row).padEnd(4)} baseline over=${String(r.baselineOver).padEnd(5)} w=${String(r.baselineW).padEnd(5)} | impl over=${String(r.implOver).padEnd(5)} w=${String(r.implW).padEnd(5)} | identical=${r.identical}`);
console.log('ALL IDENTICAL:', rows.every(r => r.identical));
fs.writeFileSync(path.join(OUT, 'ab-cloze-pinned.json'), JSON.stringify({ byBuild, rows, allIdentical: rows.every(r => r.identical) }, null, 2));
