/** A/B mobile session horizontal-overflow sweep: baseline (:5198) vs implementation (:5199). */
import fs from 'node:fs'; import path from 'node:path';
import pw from '/Users/holemini/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
const { chromium } = pw;
const OUT = path.resolve(process.argv[2]); const SHOTS = path.join(OUT, 'screenshots');
const settle = async (p, ms = 1200) => { await p.waitForLoadState('networkidle').catch(()=>{}); await p.waitForTimeout(ms); };
const browser = await chromium.launch({ channel: 'chrome' });
const report = [];
for (const [build, url] of [['baseline','http://127.0.0.1:5198/'], ['implementation','http://127.0.0.1:5199/']]) {
  for (const width of [390, 320]) {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 3 });
    const page = await ctx.newPage();
    await page.goto(url); await settle(page, 1600);
    const d = page.locator('details.study-new-set');
    if (await d.count() && !(await d.evaluate(e => e.open))) await page.locator('details.study-new-set > summary').click();
    await page.locator('button.test-start').first().click({ force: true }); await settle(page, 1800);
    const seen = [];
    for (let q = 0; q < 14; q++) {
      const m = await page.evaluate(() => {
        const pill = document.querySelector('.type-pill')?.innerText.trim() ?? null;
        const over = document.documentElement.scrollWidth > innerWidth + 1;
        let widest = null;
        if (over) for (const e of document.querySelectorAll('main *')) { const r = e.getBoundingClientRect();
          if (r.right > innerWidth + 1 && (!widest || r.right > widest.right)) widest = { right: Math.round(r.right), cls: e.className?.toString().slice(0,50), tag: e.tagName }; }
        return { pill, over, scrollW: document.documentElement.scrollWidth, innerW: innerWidth, widest };
      });
      seen.push(m);
      if (m.over) await page.screenshot({ path: path.join(SHOTS, `ab-${build}-${width}-overflow-q${q}-${(m.pill||'x').replace(/\W+/g,'_')}.png`) });
      const skip = page.locator('button:has-text("Skip for now")').first();
      if (!(await skip.count())) break;
      await skip.click({ force: true }).catch(()=>{}); await page.waitForTimeout(700);
    }
    const overflowing = seen.filter(s => s.over);
    report.push({ build, width, questionsChecked: seen.length, overflowCount: overflowing.length,
      overflowTypes: [...new Set(overflowing.map(o => o.pill))], samples: overflowing.slice(0, 6), allPills: seen.map(s => s.pill) });
    console.log(`${build.padEnd(15)} w=${width} checked=${seen.length} overflow=${overflowing.length} types=${JSON.stringify([...new Set(overflowing.map(o=>o.pill))])}`);
    await ctx.close();
  }
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'ab-session-overflow.json'), JSON.stringify(report, null, 2));
