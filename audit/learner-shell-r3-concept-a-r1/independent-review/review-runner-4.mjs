/** Independent browser review runner, part 4 — remaining scenarios, each isolated. */
import fs from 'node:fs'; import path from 'node:path';
import pw from '/Users/holemini/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.js';
const { chromium } = pw;
const BASE = 'http://127.0.0.1:5199/';
const OUT = path.resolve(process.argv[2]); const SHOTS = path.join(OUT, 'screenshots');
fs.mkdirSync(SHOTS, { recursive: true });
const results = [], allConsole = [];
const rec = o => { results.push(o); console.log(`[${o.pass === true ? 'PASS' : o.pass === false ? 'FAIL' : 'INFO'}] ${o.scenario}${o.note ? ' — ' + o.note : ''}`); };
let browser;
async function newPage({ width = 1440, height = 900, theme = 'light', dpr = 1, scenario = '' } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, colorScheme: theme });
  const page = await ctx.newPage();
  page.on('console', m => allConsole.push({ scenario, type: m.type(), text: m.text() }));
  page.on('pageerror', e => allConsole.push({ scenario, type: 'pageerror', text: e.message }));
  page.on('requestfailed', r => allConsole.push({ scenario, type: 'requestfailed', text: `${r.url()} :: ${r.failure()?.errorText}` }));
  return { ctx, page };
}
const settle = async (p, ms = 1300) => { await p.waitForLoadState('networkidle').catch(()=>{}); await p.waitForTimeout(ms); };
const shot = async (p, n) => { const f = path.join(SHOTS, n + '.png'); await p.screenshot({ path: f }); return 'screenshots/' + n + '.png'; };
const overflow = p => p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
async function startSet(page) {
  const d = page.locator('details.study-new-set');
  if (await d.count() && !(await d.evaluate(e => e.open))) await page.locator('details.study-new-set > summary').click().catch(()=>{});
  await page.locator('button.test-start').first().click({ force: true });
  await settle(page, 1700);
}
async function pickChoice(page) {
  const c = page.locator('.question-card').locator('button, input[type=radio], input[type=checkbox], select');
  const n = await c.count();
  for (let i = 0; i < n; i++) { const e = c.nth(i); const t = ((await e.innerText().catch(()=> '')) || '').trim();
    if (/Submit|Skip|End set|Calculator|Save question|需要中文|Read|Copy|^EN$|^ZH$|EN\/ZH|Tap ZH/i.test(t)) continue;
    if (await e.isVisible().catch(()=>false) && await e.isEnabled().catch(()=>false)) { await e.click({ force: true }).catch(()=>{}); return true; } }
  return false;
}
const sessionIds = page => page.evaluate(async () => {
  const req = indexedDB.open('nclex-bilingual-prep');
  const db = await new Promise(r => { req.onsuccess = () => r(req.result); });
  const o = {};
  for (const n of [...db.objectStoreNames].filter(x => /session/i.test(x))) {
    const tx = db.transaction(n, 'readonly');
    o[n] = await new Promise(r => { const q = tx.objectStore(n).getAll(); q.onsuccess = () => r(q.result.map(a => a.sessionId ?? a.id ?? null)); }); }
  return o;
});
async function safe(name, fn) { try { await fn(); } catch (e) { rec({ scenario: name, pass: false, error: String(e).split('\n')[0], note: 'scenario threw' }); } }

browser = await chromium.launch({ channel: 'chrome' });

// --- replacement dialog: default focus + Escape (desktop & mobile) ---
for (const [w, h, dpr, label] of [[1440,900,1,'desktop'],[390,844,3,'mobile']]) {
  await safe(`replacement-dialog-escape-${label}`, async () => {
    const s = `replacement-dialog-escape-${label}`;
    const { ctx, page } = await newPage({ width: w, height: h, dpr, scenario: s });
    await page.goto(BASE); await settle(page); await startSet(page); await pickChoice(page); await page.waitForTimeout(900);
    const before = await sessionIds(page);
    await page.reload(); await settle(page, 2200);
    await page.locator('details.study-new-set > summary').click().catch(()=>{}); await page.waitForTimeout(400);
    await page.locator('button.test-start').first().click({ force: true }); await page.waitForTimeout(1100);
    const dlg = page.locator('dialog.session-replacement-dialog');
    const open = await dlg.evaluate(e => e.open).catch(()=>false);
    const focused = await page.evaluate(() => ({ text: (document.activeElement?.innerText||'').trim(), cls: document.activeElement?.className }));
    const sc = await shot(page, s);
    await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
    const after = await sessionIds(page);
    const openAfter = await dlg.evaluate(e => e.open).catch(()=>false);
    const focusAfter = await page.evaluate(() => ({ text: (document.activeElement?.innerText||'').trim().slice(0,40), cls: String(document.activeElement?.className), tag: document.activeElement?.tagName }));
    rec({ scenario: s, viewport: `${w}x${h}`, dpr, theme: 'light', textSize: 'Default', transport: 'http:',
      dialogOpened: open, focusedOnOpen: focused, closedByEscape: openAfter === false,
      sessionsBefore: before, sessionsAfterEscape: after, escapePreservedSession: JSON.stringify(before) === JSON.stringify(after),
      focusAfterEscape: focusAfter, screenshot: sc,
      pass: open && /Keep current set/.test(focused.text) && openAfter === false && JSON.stringify(before) === JSON.stringify(after) });
    await ctx.close();
  });
}
// --- replacement dialog: Keep current set button (fresh context) ---
await safe('replacement-dialog-keep', async () => {
  const s = 'replacement-dialog-keep';
  const { ctx, page } = await newPage({ scenario: s });
  await page.goto(BASE); await settle(page); await startSet(page); await pickChoice(page); await page.waitForTimeout(900);
  const before = await sessionIds(page);
  await page.reload(); await settle(page, 2200);
  await page.locator('details.study-new-set > summary').click().catch(()=>{}); await page.waitForTimeout(400);
  await page.locator('button.test-start').first().click({ force: true }); await page.waitForTimeout(1200);
  const keep = page.locator('dialog.session-replacement-dialog button.primary-action');
  const vis = await keep.isVisible().catch(()=>false);
  await keep.click({ force: true }); await page.waitForTimeout(1100);
  const after = await sessionIds(page);
  const stillOnStudy = await page.locator('.study-workspace').count();
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
    keepVisible: vis, sessionsBefore: before, sessionsAfterKeep: after,
    keepPreservedSession: JSON.stringify(before) === JSON.stringify(after), remainedOnStudy: stillOnStudy > 0,
    screenshot: await shot(page, s), pass: vis && JSON.stringify(before) === JSON.stringify(after) });
  await ctx.close();
});
// --- hydration guard ---
await safe('hydration-startup-guard', async () => {
  const s = 'hydration-startup-guard';
  const { ctx, page } = await newPage({ scenario: s });
  await page.route('**/*', async r => { await new Promise(x => setTimeout(x, 150)); r.continue(); });
  await page.goto(BASE); await page.waitForTimeout(250);
  const first = await page.evaluate(() => ({ startDisabled: document.querySelector('button.test-start')?.disabled ?? null,
    headerInert: document.querySelector('header.app-header')?.hasAttribute('inert') ?? null }));
  for (let i = 0; i < 6; i++) { await page.locator('button.test-start').first().click({ force: true }).catch(()=>{}); await page.waitForTimeout(120); }
  await settle(page, 2600);
  const ids = await sessionIds(page);
  const n = Object.values(ids).flat().filter(Boolean).length;
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http: (throttled 150ms/request)',
    atFirstPaint: first, sessionsAfter6Clicks: ids, sessionRowCount: n, screenshot: await shot(page, s), pass: n <= 1 });
  await ctx.close();
});
// --- question behavior ---
await safe('question-behavior', async () => {
  const s = 'question-behavior';
  const { ctx, page } = await newPage({ scenario: s });
  await page.goto(BASE); await settle(page); await startSet(page);
  await pickChoice(page); await page.waitForTimeout(400);
  await page.locator('button.submit-button').first().click({ force: true }); await page.waitForTimeout(1400);
  const rationale = await page.locator('[class*="rationale"]').count();
  const zhBtn = page.locator('button:has-text("需要中文")').first();
  let zhRevealed = null;
  if (await zhBtn.count()) { await zhBtn.click({ force: true }).catch(()=>{}); await page.waitForTimeout(600);
    zhRevealed = await page.evaluate(() => !!document.querySelector('[lang="zh-Hans"]')); }
  const glossary = await page.locator('[class*="glossary"]').count();
  const gpt = await page.locator('button:has-text("GPT"), [class*="gpt"]').count();
  const saveBtn = page.locator('button[aria-label*="Save question"]').first();
  const savedOk = await saveBtn.count() ? (await saveBtn.click({ force: true }).then(()=>true).catch(()=>false)) : false;
  await page.waitForTimeout(700);
  const sc = await shot(page, 'question-rationale');
  const next = page.locator('button:has-text("Next"), button:has-text("Finish")').first();
  const had = await next.count(); if (had) { await next.click({ force: true }); await page.waitForTimeout(1000); }
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
    rationaleShown: rationale > 0, zhRevealed, glossaryNodes: glossary, gptControls: gpt, savedToggled: savedOk,
    advancedToNext: had > 0 && (await page.locator('.question-card').count()) > 0, screenshot: sc,
    pass: rationale > 0 && had > 0 });
  await ctx.close();
});
// --- visual item (dark light-lock) and case study ---
for (const [theme, source, want, s] of [['dark','burn-canonical','visual','visual-item-dark'],['light','claude-canonical','case','case-study']]) {
  await safe(s, async () => {
    const { ctx, page } = await newPage({ theme, scenario: s });
    await page.goto(BASE); await settle(page);
    await page.locator('nav.app-primary-nav button:has-text("Library")').click(); await settle(page, 1300);
    await page.locator('.filters select').nth(3).selectOption({ label: source }).catch(()=>{});
    await settle(page, 1300);
    const rows = page.locator('.question-row'); const n = Math.min(await rows.count(), 30);
    let found = false, detail = null;
    for (let i = 0; i < n; i++) {
      const pill = (await rows.nth(i).locator('.type-pill').innerText().catch(()=> '')).trim();
      if (want === 'case' && !/case/i.test(pill)) continue;
      await rows.nth(i).locator('button:has-text("Practice")').click({ force: true }).catch(()=>{});
      await settle(page, 1700);
      const svg = await page.locator('.question-card svg').count();
      const caseN = await page.locator('[class*="case"]').count();
      if (want === 'visual' && svg > 0) { found = true; detail = 'svgNodes=' + svg; break; }
      if (want === 'case' && caseN > 0) { found = true; detail = 'caseNodes=' + caseN; break; }
      await page.locator('nav.app-primary-nav button:has-text("Library")').click({ force: true }).catch(()=>{});
      await settle(page, 1000);
      await page.locator('.filters select').nth(3).selectOption({ label: source }).catch(()=>{}); await settle(page, 900);
    }
    const lock = await page.evaluate(() => [...document.querySelectorAll('.question-card svg')].slice(0,2).map(nd => {
      const h = nd.closest('[class]'); const cs = getComputedStyle(h || nd);
      return { host: String(h?.className).slice(0,50), colorScheme: cs.colorScheme, bg: cs.backgroundColor }; }));
    const partNav = await page.locator('[class*="part"]').count();
    rec({ scenario: s, viewport: '1440x900', dpr: 1, theme, textSize: 'Default', transport: 'http:',
      targetFound: found, detail, lightLockProbe: lock, casePartNodes: partNav,
      screenshot: await shot(page, s), pass: found });
    await ctx.close();
  });
}
// --- settings persistence + dev gating ---
await safe('settings-persistence', async () => {
  const s = 'settings-persistence';
  const { ctx, page } = await newPage({ scenario: s });
  await page.goto(BASE); await settle(page);
  await page.locator('.header-utility').click(); await settle(page, 1300);
  const g = page.locator('main .segmented'); const gc = await g.count();
  for (let i = 0; i < gc; i++) { const b = g.nth(i).locator('button'); const c = await b.count();
    if (c > 1) { await b.nth(c - 1).click({ force: true }).catch(()=>{}); await page.waitForTimeout(400); } }
  const afterSet = await page.evaluate(() => localStorage.getItem('nclex-settings'));
  const sc = await shot(page, 'settings-view');
  const devBtn = await page.locator('main button:has-text("Developer")').count();
  const plBtn = await page.locator('main button:has-text("Preview Lab")').count();
  await page.reload(); await settle(page, 2000);
  const afterReload = await page.evaluate(() => localStorage.getItem('nclex-settings'));
  const root = await page.evaluate(() => ({ dataTheme: document.documentElement.getAttribute('data-theme'),
    cls: document.documentElement.className, fontScale: getComputedStyle(document.documentElement).getPropertyValue('--font-scale') }));
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'varied', transport: 'http:',
    settingsAfterChange: afterSet, afterReload, persisted: afterSet === afterReload, rootAfterReload: root,
    developerEntryWithoutDev: devBtn, previewLabEntryWithoutDev: plBtn, screenshot: sc,
    pass: afterSet === afterReload && devBtn === 0 });
  await ctx.close();
});
// --- dev-enabled surfaces + L3 exits ---
await safe('dev-gated-and-L3-exits', async () => {
  const s = 'dev-gated-and-L3-exits';
  const { ctx, page } = await newPage({ scenario: s });
  await page.goto(BASE + '?dev=1'); await settle(page, 2200);
  const navInDev = await page.locator('nav.app-primary-nav').count();
  const brandVis = await page.locator('.brand').isVisible().catch(()=>false);
  const utilVis = await page.locator('.header-utility').isVisible().catch(()=>false);
  const sc = await shot(page, 'developer-console-dev-enabled');
  if (brandVis) { await page.locator('.brand').click({ force: true }); await settle(page, 1300); }
  const backOnStudy = await page.locator('.study-workspace').count();
  await page.locator('.header-utility').click(); await settle(page, 1300);
  const devEntry = await page.locator('main button:has-text("Developer")').count();
  const pl = page.locator('main button:has-text("Preview Lab")').first();
  let plNav = null, plBrand = null, plExit = null;
  if (await pl.count()) { await pl.click({ force: true }); await settle(page, 1700);
    plNav = await page.locator('nav.app-primary-nav').count();
    plBrand = await page.locator('.brand').isVisible().catch(()=>false);
    const back = page.locator('main button:has-text("Back"), .back-action').first();
    if (await back.count()) await back.click({ force: true }).catch(()=>{});
    else if (plBrand) await page.locator('.brand').click({ force: true }).catch(()=>{});
    await settle(page, 1300); plExit = (await page.locator('.study-workspace, .filters, main').count()) > 0; }
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
    learnerNavInDeveloper: navInDev, brandVisibleInDeveloper: brandVis, settingsUtilityInDeveloper: utilVis,
    exitedDeveloperToStudy: backOnStudy > 0, developerEntryInSettings: devEntry,
    learnerNavInPreviewLab: plNav, brandVisibleInPreviewLab: plBrand, previewLabExitOk: plExit,
    screenshot: sc, pass: navInDev === 0 && brandVis && backOnStudy > 0 && devEntry > 0 });
  await ctx.close();
});
// --- L2 customize filter reset ---
await safe('L2-customize-filter-reset', async () => {
  const s = 'L2-customize-filter-reset';
  const { ctx, page } = await newPage({ scenario: s });
  await page.goto(BASE); await settle(page);
  await page.locator('.study-workspace button:has-text("Customize")').click(); await settle(page, 1500);
  const sel = page.locator('main select').first();
  const opts = await sel.evaluate(e => [...e.options].map(o => o.value));
  const chosen = opts.length > 1 ? opts[1] : null;
  if (chosen) { await sel.selectOption(chosen); await page.waitForTimeout(800); }
  const inBuilder = await sel.inputValue().catch(()=>null);
  await page.locator('.back-action').first().click({ force: true }).catch(()=>{}); await settle(page, 1300);
  await page.locator('.study-workspace button:has-text("Customize")').click(); await settle(page, 1500);
  const re = await page.locator('main select').first().inputValue().catch(()=>null);
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
    chosen, valueInBuilder: inBuilder, valueAfterReentry: re,
    filtersResetOnReentry: chosen !== null && inBuilder === chosen && re !== chosen,
    screenshot: await shot(page, s), pass: null, note: `chose=${chosen} inBuilder=${inBuilder} reentry=${re}` });
  await ctx.close();
});
// --- library / import / progress ---
await safe('library-import-progress', async () => {
  const s = 'library-import-progress';
  const { ctx, page } = await newPage({ scenario: s });
  await page.goto(BASE); await settle(page);
  await page.locator('nav.app-primary-nav button:has-text("Library")').click(); await settle(page, 1400);
  const before = await page.locator('.question-row').count();
  await page.locator('.filters select').nth(2).selectOption({ label: 'hard' }).catch(()=>{}); await settle(page, 1300);
  const after = await page.locator('.question-row').count();
  await page.locator('.question-row').first().click({ force: true }); await settle(page, 1400);
  const inspected = (await page.locator('main').innerText().catch(()=> '')).length > 80;
  const sc1 = await shot(page, 'library-inspect');
  await page.locator('nav.app-primary-nav button:has-text("Library")').click({ force: true }).catch(()=>{}); await settle(page, 1200);
  await page.locator('.library-utilities button').first().click({ force: true }); await settle(page, 1500);
  const inImport = /Import/i.test(await page.locator('main').innerText().catch(()=> ''));
  const back = page.locator('.back-action').first(); const hasBack = await back.count();
  if (hasBack) { await back.click({ force: true }); await settle(page, 1300); }
  const returned = (await page.locator('.question-row').count()) > 0;
  const sc2 = await shot(page, 'import-view');
  await page.locator('nav.app-primary-nav button:has-text("Progress")').click(); await settle(page, 1500);
  const ptext = await page.locator('main').innerText().catch(()=> '');
  rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
    rowsBeforeFilter: before, rowsAfterHardFilter: after, filterChanged: before !== after, inspectOpened: inspected,
    importReachedFromLibrary: inImport, backToLibraryPresent: hasBack > 0, returnedToLibrary: returned,
    progressHasNumbers: /\d/.test(ptext), screenshots: [sc1, sc2, await shot(page, 'progress-view')],
    pass: before > 0 && inspected && inImport && hasBack > 0 && returned && /\d/.test(ptext) });
  await ctx.close();
});
// --- Large text: Study root + replacement dialog ---
await safe('large-text-study-and-dialog', async () => {
  const s = 'large-text-study-and-dialog';
  const { ctx, page } = await newPage({ width: 390, height: 844, dpr: 3, scenario: s });
  await page.goto(BASE); await settle(page);
  await page.evaluate(() => localStorage.setItem('nclex-settings', JSON.stringify({ languageMode: 'en', revisitMissed: true, voiceEnabled: false, themeMode: 'light', textSizeMode: 'large' })));
  await page.reload(); await settle(page, 1900);
  const rootShot = await shot(page, 'large-text-study-root');
  const of1 = await overflow(page);
  await startSet(page); await pickChoice(page); await page.waitForTimeout(900);
  await page.reload(); await settle(page, 2300);
  await page.locator('details.study-new-set > summary').click().catch(()=>{}); await page.waitForTimeout(400);
  await page.locator('button.test-start').first().click({ force: true }); await page.waitForTimeout(1200);
  const dv = await page.evaluate(() => { const d = document.querySelector('dialog.session-replacement-dialog'); if (!d || !d.open) return null;
    const t = d.querySelector('#session-replacement-title'), sa = d.querySelector('button.primary-action');
    const tr = t.getBoundingClientRect(), sr = sa.getBoundingClientRect();
    return { titleVisible: tr.top >= 0 && tr.bottom <= innerHeight, safeVisible: sr.top >= 0 && sr.bottom <= innerHeight,
             titleTop: Math.round(tr.top), safeBottom: Math.round(sr.bottom), innerHeight }; });
  rec({ scenario: s, viewport: '390x844', dpr: 3, theme: 'light', textSize: 'Large', transport: 'http:',
    studyRootOverflow: of1, dialogMetrics: dv, screenshots: [rootShot, await shot(page, 'large-text-replacement-dialog')],
    pass: !of1 && !!dv && dv.titleVisible && dv.safeVisible });
  await ctx.close();
});
await browser.close();
fs.writeFileSync(path.join(OUT, 'browser-results-4.json'), JSON.stringify({ results, console: allConsole }, null, 2));
console.log('\nWROTE browser-results-4.json');
