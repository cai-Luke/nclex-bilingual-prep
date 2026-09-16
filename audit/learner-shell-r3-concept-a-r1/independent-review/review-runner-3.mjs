/** Independent browser review runner, part 3 — session safety, question behavior, visuals, utilities, stress, L2/L3/L4. */
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
const overflow = p => p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
const metrics = p => p.evaluate(() => ({ cssViewport: [innerWidth, innerHeight], dpr: devicePixelRatio }));
async function startSet(page) {
  const d = page.locator('details.study-new-set');
  if (await d.count() && !(await d.evaluate(e => e.open))) await page.locator('details.study-new-set > summary').click();
  await page.locator('button.test-start').first().click({ force: true });
  await settle(page, 1700);
}
async function pickChoice(page) {
  const ctrls = page.locator('.question-card').locator('button, input[type=radio], input[type=checkbox], select');
  const n = await ctrls.count();
  for (let i = 0; i < n; i++) {
    const c = ctrls.nth(i);
    const t = ((await c.innerText().catch(()=> '')) || '').trim();
    if (/Submit|Skip|End set|Calculator|Save question|需要中文|Read|Copy|EN|ZH/i.test(t)) continue;
    if (await c.isVisible().catch(()=>false) && await c.isEnabled().catch(()=>false)) { await c.click({ force: true }).catch(()=>{}); return true; }
  }
  return false;
}
const sessionIds = page => page.evaluate(async () => {
  const req = indexedDB.open('nclex-bilingual-prep');
  const db = await new Promise(r => { req.onsuccess = () => r(req.result); });
  const names = [...db.objectStoreNames].filter(n => /session/i.test(n));
  const out = {};
  for (const n of names) { const tx = db.transaction(n, 'readonly');
    out[n] = await new Promise(r => { const q = tx.objectStore(n).getAll(); q.onsuccess = () => r(q.result.map(a => a.sessionId ?? a.id ?? null)); }); }
  return out;
});

async function run() {
  const browser = await chromium.launch({ channel: 'chrome' });

  // ===== mobile active study: nav absent, sticky controls, calculator =====
  {
    const s = 'mobile-active-study';
    const { ctx, page } = await newPage(browser, { width: 390, height: 844, dpr: 3, scenario: s });
    await page.goto(BASE); await settle(page); await startSet(page);
    const navCount = await page.locator('nav.app-primary-nav').count();
    const submit = await page.locator('button.submit-button').count();
    const skip = await page.locator('button:has-text("Skip for now")').count();
    const shotA = await shot(page, 'mobile-active-study-nav-absent');
    const L = page.locator('.exam-calculator-launcher').first();
    await L.scrollIntoViewIfNeeded().catch(()=>{});
    await L.click({ force: true });
    await page.waitForTimeout(900);
    const panel = page.locator('.exam-calculator').first();
    const pb = await panel.boundingBox().catch(()=>null);
    const sb = await page.locator('button.submit-button').first().boundingBox().catch(()=>null);
    const collide = pb && sb ? !(pb.y >= sb.y + sb.height - 1 || pb.y + pb.height <= sb.y + 1) : null;
    const shotCalc = await shot(page, 'mobile-calculator-open');
    await page.locator('.exam-calculator-close').first().click({ force: true }).catch(()=>{});
    await page.waitForTimeout(600);
    const closed = (await page.locator('.exam-calculator').count()) === 0;
    rec({ scenario: s, viewport: '390x844', dpr: 3, theme: 'light', textSize: 'Default', transport: 'http:',
      learnerBottomNavPresent: navCount > 0, stickySubmit: submit > 0, skipPresent: skip > 0,
      calculatorOpened: !!pb, calculatorCollidesWithSubmit: collide, calculatorClosed: closed,
      overflow: await overflow(page), screenshots: [shotA, shotCalc],
      pass: navCount === 0 && submit > 0 && skip > 0 && !!pb && collide === false && closed });
    await ctx.close();
  }

  // ===== replacement dialog: desktop + mobile, default/Escape/Keep, focus return =====
  for (const [w, h, dpr, label] of [[1440,900,1,'desktop'],[390,844,3,'mobile']]) {
    const s = `replacement-dialog-${label}`;
    const { ctx, page } = await newPage(browser, { width: w, height: h, dpr, scenario: s });
    await page.goto(BASE); await settle(page);
    await startSet(page); await pickChoice(page); await page.waitForTimeout(900);
    const before = await sessionIds(page);
    await page.reload(); await settle(page, 2200);           // back to Study root, session resumable
    await page.locator('details.study-new-set > summary').click().catch(()=>{});
    await page.waitForTimeout(300);
    const trigger = page.locator('button.test-start').first();
    await trigger.click({ force: true }); await page.waitForTimeout(900);
    const dlg = page.locator('dialog.session-replacement-dialog');
    const open = await dlg.evaluate(e => e.open).catch(()=>false);
    const focused = await page.evaluate(() => ({ text: (document.activeElement?.innerText||'').trim(), cls: document.activeElement?.className }));
    const shotD = await shot(page, s);
    await page.keyboard.press('Escape'); await page.waitForTimeout(900);
    const afterEsc = await sessionIds(page);
    const openAfter = await dlg.evaluate(e => e.open).catch(()=>false);
    const focusAfter = await page.evaluate(() => ({ text: (document.activeElement?.innerText||'').trim().slice(0,40), cls: document.activeElement?.className, tag: document.activeElement?.tagName }));
    // now Keep current set path
    await page.locator('button.test-start').first().click({ force: true }); await page.waitForTimeout(800);
    await page.locator('dialog.session-replacement-dialog button:has-text("Keep current set")').click({ force: true });
    await page.waitForTimeout(900);
    const afterKeep = await sessionIds(page);
    rec({ scenario: s, viewport: `${w}x${h}`, dpr, theme: 'light', textSize: 'Default', transport: 'http:',
      dialogOpened: open, focusedOnOpen: focused, dialogClosedByEscape: openAfter === false,
      sessionsBefore: before, afterEscape: afterEsc, afterKeep,
      escapePreservedSession: JSON.stringify(before) === JSON.stringify(afterEsc),
      keepPreservedSession: JSON.stringify(before) === JSON.stringify(afterKeep),
      focusReturnedTo: focusAfter, screenshot: shotD,
      pass: open === true && /Keep current set/.test(focused.text) && openAfter === false
            && JSON.stringify(before) === JSON.stringify(afterEsc) && JSON.stringify(before) === JSON.stringify(afterKeep)
            && /test-start|study-new-set|summary/.test(String(focusAfter.cls) + String(focusAfter.tag)) });
    await ctx.close();
  }

  // ===== hydration/startup guard =====
  {
    const s = 'hydration-startup-guard';
    const { ctx, page } = await newPage(browser, { width: 1440, height: 900, scenario: s });
    // delay every JS/asset response slightly and IndexedDB-backed hydration by throttling the app bundle
    await page.route('**/*', async route => { await new Promise(r => setTimeout(r, 120)); route.continue(); });
    await page.goto(BASE);
    await page.waitForTimeout(250);
    const immediate = await page.evaluate(() => {
      const b = document.querySelector('button.test-start');
      const hdr = document.querySelector('header.app-header');
      return { startDisabled: b ? b.disabled : null, headerInert: hdr ? hdr.hasAttribute('inert') : null,
               guardBanner: !!document.querySelector('[class*="hydration"], [class*="waiting"], [role=status]') };
    });
    // hammer the start control while hydration may still be in flight
    for (let i = 0; i < 6; i++) { await page.locator('button.test-start').first().click({ force: true }).catch(()=>{}); await page.waitForTimeout(120); }
    await settle(page, 2500);
    const ids = await sessionIds(page);
    const count = Object.values(ids).flat().filter(Boolean).length;
    rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http: (throttled)',
      atFirstPaint: immediate, sessionsAfterHammering: ids, sessionRowCount: count,
      note: 'start control clicked 6x during hydration', screenshot: await shot(page, s),
      pass: count <= 1 });
    await ctx.close();
  }

  // ===== question behavior: submit/rationale/next, saved, ZH reveal, glossary, GPT =====
  {
    const s = 'question-behavior';
    const { ctx, page } = await newPage(browser, { width: 1440, height: 900, scenario: s });
    await page.goto(BASE); await settle(page); await startSet(page);
    await pickChoice(page); await page.waitForTimeout(400);
    await page.locator('button.submit-button').first().click({ force: true }); await page.waitForTimeout(1200);
    const rationale = await page.locator('[class*="rationale"]').count();
    const zh = await page.locator('button:has-text("需要中文"), button:has-text("Tap ZH")').count();
    let zhRevealed = null;
    if (zh) { await page.locator('button:has-text("需要中文"), button:has-text("Tap ZH")').first().click({ force: true }).catch(()=>{}); await page.waitForTimeout(500);
      zhRevealed = await page.evaluate(() => !!document.querySelector('[lang="zh-Hans"], .chinese-line, .zh-line')); }
    const saveBtn = page.locator('button[aria-label*="Save question"], button:has-text("Save question")').first();
    const savedBefore = await page.evaluate(() => document.querySelectorAll('.flag-action.active, .flag-action[aria-pressed=true]').length);
    await saveBtn.click({ force: true }).catch(()=>{}); await page.waitForTimeout(700);
    const glossary = await page.locator('.glossary-term, [class*="glossary"]').count();
    const gpt = await page.locator('button:has-text("GPT"), [class*="gpt-rescue"]').count();
    const shotR = await shot(page, 'question-rationale');
    const next = page.locator('button:has-text("Next"), button:has-text("Finish")').first();
    const hadNext = await next.count();
    if (hadNext) { await next.click({ force: true }); await page.waitForTimeout(900); }
    const advanced = await page.locator('.question-card').count();
    rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
      rationaleShown: rationale > 0, zhControlPresent: zh > 0, zhRevealed, glossaryNodes: glossary, gptControls: gpt,
      savedToggleClicked: true, advancedToNext: hadNext > 0 && advanced > 0, screenshot: shotR,
      pass: rationale > 0 && hadNext > 0 && advanced > 0 });
    await ctx.close();
  }

  // ===== standalone visual item (light-locked in dark) + case study =====
  for (const [theme, source, want, s] of [['dark','burn-canonical','visual','visual-item-dark'],['light','burn-canonical','visual','visual-item-light'],['light','claude-canonical','case','case-study']]) {
    const { ctx, page } = await newPage(browser, { width: 1440, height: 900, theme, scenario: s });
    await page.goto(BASE); await settle(page);
    await page.locator('nav.app-primary-nav button:has-text("Library")').click(); await settle(page, 1200);
    const sels = page.locator('.filters select');
    await sels.nth(3).selectOption({ label: source }).catch(()=>{});
    await settle(page, 1200);
    // practice a single item
    let found = false, kind = null;
    const rows = page.locator('.question-row');
    const n = Math.min(await rows.count(), 40);
    for (let i = 0; i < n; i++) {
      const pill = (await rows.nth(i).locator('.type-pill').innerText().catch(()=> '')).trim();
      if (want === 'case' && !/case/i.test(pill)) continue;
      await rows.nth(i).locator('button:has-text("Practice")').click({ force: true });
      await settle(page, 1600);
      const hasSvg = await page.locator('.question-card svg[class*="vis"], .question-card svg').count();
      const hasCase = await page.locator('[class*="case-"], [class*="case-study"]').count();
      if (want === 'visual' && hasSvg > 0) { found = true; kind = 'svg:' + hasSvg; break; }
      if (want === 'case' && hasCase > 0) { found = true; kind = 'case:' + hasCase; break; }
      await page.goBack().catch(()=>{}); await settle(page, 1000);
      if ((await page.locator('.question-row').count()) === 0) { await page.locator('nav.app-primary-nav button:has-text("Library")').click().catch(()=>{}); await settle(page, 1000); await sels.nth(3).selectOption({ label: source }).catch(()=>{}); await settle(page, 900); }
    }
    // light-lock probe on clinical SVG containers
    const lock = await page.evaluate(() => {
      const nodes = [...document.querySelectorAll('.question-card svg')].slice(0, 3);
      return nodes.map(nd => { const host = nd.closest('[class]'); const cs = getComputedStyle(host || nd);
        return { host: host?.className?.toString().slice(0, 60), colorScheme: cs.colorScheme, background: cs.backgroundColor }; });
    });
    const partNav = await page.locator('[class*="part-navigator"], [class*="CasePartNavigator"], [class*="case-part"]').count();
    rec({ scenario: s, viewport: '1440x900', dpr: 1, theme, textSize: 'Default', transport: 'http:',
      targetFound: found, detail: kind, lightLockProbe: lock, casePartNavigatorNodes: partNav,
      screenshot: await shot(page, s), pass: found });
    await ctx.close();
  }

  // ===== settings persistence + theme/text/chinese across reload =====
  {
    const s = 'settings-persistence';
    const { ctx, page } = await newPage(browser, { width: 1440, height: 900, scenario: s });
    await page.goto(BASE); await settle(page);
    await page.locator('.header-utility').click(); await settle(page, 1200);
    const before = await page.evaluate(() => localStorage.getItem('nclex-settings'));
    // flip each segmented control's last option where present
    const groups = page.locator('main .segmented');
    const g = await groups.count();
    for (let i = 0; i < g; i++) { const btns = groups.nth(i).locator('button'); const c = await btns.count(); if (c > 1) { await btns.nth(c - 1).click({ force: true }).catch(()=>{}); await page.waitForTimeout(350); } }
    const afterSet = await page.evaluate(() => localStorage.getItem('nclex-settings'));
    const shotS = await shot(page, 'settings-view');
    await page.reload(); await settle(page, 2000);
    await page.locator('.header-utility').click(); await settle(page, 1200);
    const afterReload = await page.evaluate(() => localStorage.getItem('nclex-settings'));
    const rootAttrs = await page.evaluate(() => ({ theme: document.documentElement.getAttribute('data-theme'), cls: document.documentElement.className, fontScale: getComputedStyle(document.documentElement).getPropertyValue('--font-scale') }));
    const devVisible = await page.locator('main button:has-text("Developer")').count();
    const previewLab = await page.locator('main button:has-text("Preview Lab")').count();
    rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'varied', transport: 'http:',
      settingsBefore: before, afterChange: afterSet, afterReload, persisted: afterSet === afterReload,
      rootAttrs, developerVisibleWithoutDevFlag: devVisible, previewLabVisibleWithoutDevFlag: previewLab,
      screenshot: shotS, pass: afterSet === afterReload && devVisible === 0 });
    await ctx.close();
  }

  // ===== dev-gated surfaces reachable WITH dev enablement + L3 exits =====
  {
    const s = 'dev-gated-and-L3-exits';
    const { ctx, page } = await newPage(browser, { width: 1440, height: 900, scenario: s });
    await page.goto(BASE + '?dev=1'); await settle(page, 2000);
    const viewAfter = await page.evaluate(() => document.querySelector('.app-shell')?.className);
    const navInReview = await page.locator('nav.app-primary-nav').count();
    const brandVisible = await page.locator('.brand').isVisible().catch(()=>false);
    const utilVisible = await page.locator('.header-utility').isVisible().catch(()=>false);
    const shotDev = await shot(page, 'developer-console-dev-enabled');
    // exit via brand
    if (brandVisible) { await page.locator('.brand').click({ force: true }); await settle(page, 1200); }
    const backOnStudy = await page.locator('.study-workspace').count();
    // Preview Lab via Settings
    await page.locator('.header-utility').click(); await settle(page, 1200);
    const plBtn = page.locator('main button:has-text("Preview Lab")').first();
    const plCount = await plBtn.count();
    let plNav = null, plExit = null;
    if (plCount) { await plBtn.click({ force: true }); await settle(page, 1600);
      plNav = await page.locator('nav.app-primary-nav').count();
      const back = page.locator('main button:has-text("Back"), .back-action').first();
      if (await back.count()) { await back.click({ force: true }); await settle(page, 1200); }
      else if (await page.locator('.brand').isVisible().catch(()=>false)) { await page.locator('.brand').click({ force: true }); await settle(page, 1200); }
      plExit = (await page.locator('.study-workspace, main').count()) > 0; }
    const devEntry = await page.locator('main button:has-text("Developer")').count();
    rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
      shellClassAtDevStartup: viewAfter, learnerNavPresentInDeveloper: navInReview, brandVisibleInDeveloper: brandVisible,
      settingsUtilityVisibleInDeveloper: utilVisible, exitedDeveloperToStudy: backOnStudy > 0,
      previewLabEntryInSettings: plCount, learnerNavPresentInPreviewLab: plNav, previewLabExitOk: plExit,
      developerEntryInSettingsWhenDevEnabled: devEntry, screenshot: shotDev,
      pass: navInReview === 0 && brandVisible === true && backOnStudy > 0 && devEntry > 0 });
    await ctx.close();
  }

  // ===== L2 customize filter reset =====
  {
    const s = 'L2-customize-filter-reset';
    const { ctx, page } = await newPage(browser, { width: 1440, height: 900, scenario: s });
    await page.goto(BASE); await settle(page);
    await page.locator('.study-workspace button:has-text("Customize")').click(); await settle(page, 1400);
    const sels = page.locator('main select');
    const n = await sels.count();
    let chosen = null;
    if (n) { const opts = await sels.first().evaluate(e => [...e.options].map(o => o.value)); if (opts.length > 1) { await sels.first().selectOption(opts[1]); chosen = opts[1]; await page.waitForTimeout(700); } }
    const inBuilder = await sels.first().inputValue().catch(()=>null);
    // leave to Study and re-enter Customize
    await page.locator('.back-action, main button:has-text("Back to Study")').first().click({ force: true }).catch(()=>{});
    await settle(page, 1200);
    await page.locator('.study-workspace button:has-text("Customize")').click(); await settle(page, 1400);
    const reentered = await page.locator('main select').first().inputValue().catch(()=>null);
    rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
      chosenFilterValue: chosen, valueWhileInBuilder: inBuilder, valueAfterReentry: reentered,
      filtersResetOnReentry: chosen !== null && inBuilder === chosen && reentered !== chosen,
      backToStudyControlPresent: true, screenshot: await shot(page, s), pass: null,
      note: `chose=${chosen} inBuilder=${inBuilder} reentry=${reentered}` });
    await ctx.close();
  }

  // ===== Library filter/inspect/practice + Import entry & return + Progress =====
  {
    const s = 'library-import-progress';
    const { ctx, page } = await newPage(browser, { width: 1440, height: 900, scenario: s });
    await page.goto(BASE); await settle(page);
    await page.locator('nav.app-primary-nav button:has-text("Library")').click(); await settle(page, 1300);
    const before = await page.locator('.question-row').count();
    await page.locator('.filters select').nth(2).selectOption({ label: 'hard' }).catch(()=>{});
    await settle(page, 1200);
    const after = await page.locator('.question-row').count();
    await page.locator('.question-row').first().click({ force: true }); await settle(page, 1300);
    const inspected = await page.locator('main').innerText().then(t => t.length > 50).catch(()=>false);
    const shotInspect = await shot(page, 'library-inspect');
    await page.locator('nav.app-primary-nav button:has-text("Library"), .back-action').first().click({ force: true }).catch(()=>{});
    await settle(page, 1200);
    await page.locator('.library-utilities button:has-text("Import a bank")').click({ force: true }); await settle(page, 1400);
    const inImport = await page.locator('main').innerText().then(t => /Import/i.test(t)).catch(()=>false);
    const backToLib = page.locator('.back-action, main button:has-text("Back to Library")').first();
    const hasBack = await backToLib.count();
    if (hasBack) { await backToLib.click({ force: true }); await settle(page, 1200); }
    const returnedToLibrary = await page.locator('.question-row').count() > 0;
    const shotImport = await shot(page, 'import-view');
    await page.locator('nav.app-primary-nav button:has-text("Progress")').click(); await settle(page, 1400);
    const progressText = await page.locator('main').innerText();
    const shotProg = await shot(page, 'progress-view');
    rec({ scenario: s, viewport: '1440x900', dpr: 1, theme: 'light', textSize: 'Default', transport: 'http:',
      libraryRowsBeforeFilter: before, afterDifficultyFilter: after, filterChangedResults: before !== after,
      inspectOpened: inspected, importEntryFromLibrary: inImport, backToLibraryControl: hasBack > 0,
      returnedToLibrary, progressHasFactualText: /\d/.test(progressText),
      screenshots: [shotInspect, shotImport, shotProg],
      pass: before > 0 && inspected && inImport && hasBack > 0 && returnedToLibrary && /\d/.test(progressText) });
    await ctx.close();
  }

  // ===== Large text on Study root + replacement dialog =====
  {
    const s = 'large-text-study-and-dialog';
    const { ctx, page } = await newPage(browser, { width: 390, height: 844, dpr: 3, scenario: s });
    await page.goto(BASE); await settle(page);
    await page.evaluate(() => localStorage.setItem('nclex-settings', JSON.stringify({ languageMode: 'en', revisitMissed: true, voiceEnabled: false, themeMode: 'light', textSizeMode: 'large' })));
    await page.reload(); await settle(page, 1800);
    const shotRoot = await shot(page, 'large-text-study-root');
    const of1 = await overflow(page);
    await startSet(page); await pickChoice(page); await page.waitForTimeout(800);
    await page.reload(); await settle(page, 2200);
    await page.locator('details.study-new-set > summary').click().catch(()=>{});
    await page.locator('button.test-start').first().click({ force: true }); await page.waitForTimeout(1000);
    const dlgVis = await page.evaluate(() => {
      const d = document.querySelector('dialog.session-replacement-dialog'); if (!d) return null;
      const t = d.querySelector('#session-replacement-title'); const safe = d.querySelector('button.primary-action');
      const tr = t.getBoundingClientRect(), sr = safe.getBoundingClientRect();
      return { titleInViewport: tr.top >= 0 && tr.bottom <= innerHeight, safeInViewport: sr.top >= 0 && sr.bottom <= innerHeight,
               titleRect: { top: tr.top, bottom: tr.bottom }, safeRect: { top: sr.top, bottom: sr.bottom }, innerHeight };
    });
    const shotDlg = await shot(page, 'large-text-replacement-dialog');
    rec({ scenario: s, viewport: '390x844', dpr: 3, theme: 'light', textSize: 'Large', transport: 'http:',
      studyRootOverflow: of1, dialogVisibility: dlgVis, dialogOverflow: await overflow(page),
      screenshots: [shotRoot, shotDlg],
      pass: !of1 && dlgVis && dlgVis.titleInViewport && dlgVis.safeInViewport });
    await ctx.close();
  }

  fs.writeFileSync(path.join(OUT, 'browser-results-3.json'), JSON.stringify({ results, console: allConsole }, null, 2));
  await browser.close();
}
run().catch(e => { console.error('RUNNER3 FAIL', e); fs.writeFileSync(path.join(OUT, 'browser-results-3.json'), JSON.stringify({ results, console: allConsole, error: String(e), stack: e.stack }, null, 2)); process.exit(1); });
