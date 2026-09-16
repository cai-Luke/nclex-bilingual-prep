/** Part 10 — genuine dark mode (data-theme via themeMode setting, the app's only dark switch):
 *  Study root desktop/mobile, L1 cold load, and clinical-visual light-lock (work order 6.3). */
import fs from 'node:fs'; import path from 'node:path';
import pw from '/Users/holemini/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
const { chromium } = pw;
const BASE = 'http://127.0.0.1:5199/';
const OUT = path.resolve(process.argv[2]); const SHOTS = path.join(OUT, 'screenshots');
const results = [], allConsole = [];
const rec = o => { results.push(o); console.log(`[${o.pass === true ? 'PASS' : o.pass === false ? 'FAIL' : 'INFO'}] ${o.scenario}${o.note ? ' — ' + o.note : ''}`); };
const settle = async (p, ms = 1500) => { await p.waitForLoadState('networkidle').catch(()=>{}); await p.waitForTimeout(ms); };
const tap = async l => { await l.scrollIntoViewIfNeeded().catch(()=>{}); await l.click({ timeout: 15000 }).catch(async () => { await l.click({ force: true }).catch(()=>{}); }); };
const DARK = { languageMode: 'en', revisitMissed: true, voiceEnabled: false, themeMode: 'dark', textSizeMode: 'default' };
let browser;
async function darkPage({ width = 1440, height = 900, dpr = 1, scenario = '' }) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr });
  const page = await ctx.newPage();
  page.on('console', m => allConsole.push({ scenario, type: m.type(), text: m.text() }));
  page.on('pageerror', e => allConsole.push({ scenario, type: 'pageerror', text: e.message }));
  await page.goto(BASE); await settle(page, 1200);
  await page.evaluate(s => localStorage.setItem('nclex-settings', JSON.stringify(s)), DARK);
  await page.reload(); await settle(page, 1900);
  return { ctx, page };
}
async function ensureOpen(page) {
  const d = page.locator('details.study-new-set');
  if (await d.count() && !(await d.evaluate(e => e.open))) { await tap(page.locator('details.study-new-set > summary')); await page.waitForTimeout(350); }
}

browser = await chromium.launch({ channel: 'chrome' });

// --- dark Study roots ---
for (const [w, h, dpr, label] of [[1440,900,1,'desktop'],[390,844,3,'mobile']]) {
  const s = `dark-root-${label}`;
  const { ctx, page } = await darkPage({ width: w, height: h, dpr, scenario: s });
  const theme = await page.evaluate(() => ({ dataTheme: document.documentElement.dataset.theme,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    appBg: getComputedStyle(document.documentElement).getPropertyValue('--app-bg').trim(),
    surface: getComputedStyle(document.documentElement).getPropertyValue('--surface').trim(),
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
    colorScheme: getComputedStyle(document.documentElement).colorScheme }));
  const nav = await page.$$eval('nav.app-primary-nav button', e => e.map(x => x.innerText.trim().split('\n')[0]));
  await page.screenshot({ path: path.join(SHOTS, `${s}.png`) });
  rec({ scenario: s, viewport: `${w}x${h}`, dpr, theme: 'dark (data-theme)', textSize: 'Default', transport: 'http:',
    themeTokens: theme, nav, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
    screenshot: `screenshots/${s}.png`,
    pass: theme.dataTheme === 'dark' && theme.appBg === '#0c111d' && theme.surface === '#161f30' && theme.accent === '#3b82f6' && nav.length === 3 });
  await ctx.close();
}

// --- L1 cold load in genuine dark ---
{
  const s = 'L1-cold-load-dark';
  const { ctx, page } = await darkPage({ scenario: s });
  await ensureOpen(page);
  await tap(page.locator('button.test-start').first()); await settle(page, 2000);
  await tap(page.locator('button:has-text("Skip for now")').first()); await page.waitForTimeout(1200);
  await page.reload(); await settle(page, 2400);
  const cold = await page.evaluate(() => { const d = document.querySelector('details.study-new-set');
    return { open: d?.open, hasResume: !!document.querySelector('button.resume-action'), dataTheme: document.documentElement.dataset.theme }; });
  await page.screenshot({ path: path.join(SHOTS, `${s}-after-cold-reload.png`) });
  await tap(page.locator('nav.app-primary-nav button:has-text("Library")')); await settle(page, 1100);
  await tap(page.locator('nav.app-primary-nav button:has-text("Study")')); await settle(page, 1100);
  const remount = await page.evaluate(() => ({ open: document.querySelector('details.study-new-set')?.open }));
  await page.screenshot({ path: path.join(SHOTS, `${s}-after-remount.png`) });
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'dark (data-theme)', textSize: 'Default', transport: 'http:',
    afterColdReload: cold, afterRemount: remount, divergence: cold.open !== remount.open,
    screenshots: [`screenshots/${s}-after-cold-reload.png`, `screenshots/${s}-after-remount.png`], pass: null,
    note: `cold=${cold.open} remount=${remount.open} resume=${cold.hasResume}` });
  await ctx.close();
}

// --- clinical visual light-lock in genuine dark mode ---
{
  const s = 'visual-light-lock-dark';
  const { ctx, page } = await darkPage({ scenario: s });
  await tap(page.locator('nav.app-primary-nav button:has-text("Library")')); await settle(page, 1400);
  await page.locator('.filters select').nth(3).selectOption({ label: 'burn-canonical' }).catch(()=>{});
  await settle(page, 1400);
  await tap(page.locator('.question-row').first().locator('button:has-text("Practice")'));
  await settle(page, 2000);
  const probe = await page.evaluate(() => {
    const host = document.querySelector('.rhythm-strip-svg');
    const svg = document.querySelector('.question-card svg');
    const card = document.querySelector('.question-card');
    return { dataTheme: document.documentElement.dataset.theme,
      hostFound: !!host, hostClass: host?.className ?? null,
      hostColorScheme: host ? getComputedStyle(host).colorScheme : null,
      hostBackground: host ? getComputedStyle(host).backgroundColor : null,
      hostBorder: host ? getComputedStyle(host).borderTopColor : null,
      svgPresent: !!svg,
      cardBackground: card ? getComputedStyle(card).backgroundColor : null };
  });
  await page.screenshot({ path: path.join(SHOTS, `${s}.png`) });
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'dark (data-theme)', textSize: 'Default', transport: 'http:',
    lightLock: probe, screenshot: `screenshots/${s}.png`,
    pass: probe.dataTheme === 'dark' && probe.hostFound && probe.hostColorScheme === 'light'
          && probe.hostBackground === 'rgb(255, 248, 250)' && probe.svgPresent });
  await ctx.close();
}

await browser.close();
fs.writeFileSync(path.join(OUT, 'browser-results-10.json'), JSON.stringify({ results, console: allConsole }, null, 2));
console.log('\nWROTE browser-results-10.json');
