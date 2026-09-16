// Production-build browser regression. No project browser dependency.
// PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node --import tsx \
//   scripts/tests/mobile-dropdown-cloze-layout.mjs --url URL --output TASK_OUTPUT
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { questionFingerprint } from '../../src/completedMemory.ts';
import { getCorrectAnswer } from '../../src/grading.ts';

const args = process.argv.slice(2);
const arg = (name) => args[args.indexOf(name) + 1];
if (!args.includes('--url') || !args.includes('--output') || !process.env.PLAYWRIGHT_MODULE) {
  throw new Error('Required: PLAYWRIGHT_MODULE=/absolute/playwright/index.mjs node --import tsx scripts/tests/mobile-dropdown-cloze-layout.mjs --url HTTP_OR_FILE_URL --output TASK_OWNED_DIRECTORY');
}
const url = new URL(arg('--url')).href;
assert(['http:', 'https:', 'file:'].includes(new URL(url).protocol));
const out = resolve(arg('--output'));
mkdirSync(join(out, 'screenshots'), { recursive: true });
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const entries = readdirSync('banks').filter((f) => f.endsWith('.json')).sort().flatMap((file) => {
  const bytes = readFileSync(join('banks', file));
  return JSON.parse(bytes).questions.map((q) => ({ q, bank: `banks/${file}`, bankSha256: sha(bytes) }));
});
const byId = (a, b) => a.q.id < b.q.id ? -1 : a.q.id > b.q.id ? 1 : 0;
const longest = (q) => Math.max(...q.dropdowns.flatMap((d) => d.options.map((o) => o.en.length)));
const witness = entries.find(({ q }) => q.id === 'gpt_format15_vasa_previa_management_dropdown');
const multi = entries.filter(({ q }) => q.itemType === 'dropdown_cloze' && q.dropdowns.length > 1 && q.id !== witness.q.id)
  .sort((a, b) => longest(b.q) - longest(a.q) || byId(a, b))[0];
const cases = entries.flatMap((e) => e.q.itemType === 'case_study' ? e.q.caseStudy.questions.filter((q) => q.itemType === 'dropdown_cloze').map((q) => ({ ...e, parent: e.q, q })) : [])
  .sort((a, b) => longest(b.q) - longest(a.q) || byId(a, b));
const caseFixture = cases[0];
const mcq = entries.filter(({ q }) => q.itemType === 'multiple_choice' && !q.visual).sort(byId)[0];
const matrix = entries.filter(({ q }) => q.itemType === 'matrix' && !q.visual).sort(byId)[0];
const fixtures = { witness, multi, case: caseFixture, mcq, matrix };
for (const e of Object.values(fixtures)) assert(e);
writeFileSync(join(out, 'fixture-manifest.json'), JSON.stringify({
  rules: { witness: 'Pinned ID', multi: 'Top-level multi-blank cloze excluding witness; descending longest EN option JS string length, then ascending stable ID', case: 'Canonical case cloze leaves; descending longest EN option JS string length, then ascending leaf ID', collateral: 'First by ascending stable ID, requested item type, no question-level visual' },
  fixtures: Object.fromEntries(Object.entries(fixtures).map(([key, e]) => [key, {
    bank: e.bank, bankSha256: e.bankSha256, parentId: e.parent?.id ?? null, leafId: e.q.id,
    contentSha256: sha(JSON.stringify(e.q)), parentContentSha256: e.parent ? sha(JSON.stringify(e.parent)) : null,
    fingerprint: questionFingerprint(e.q), parentFingerprint: e.parent ? questionFingerprint(e.parent) : null,
    longestEnglishOption: e.q.itemType === 'dropdown_cloze' ? longest(e.q) : null,
  }]))
}, null, 2) + '\n');
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE).catch((error) => { throw new Error(`Cannot load PLAYWRIGHT_MODULE: ${error.message}`); });
const profile = mkdtempSync(join(tmpdir(), 'shrimp-cloze-'));
const context = await chromium.launchPersistentContext(profile, {
  channel: 'chrome', headless: true, viewport: { width: 320, height: 740 }, deviceScaleFactor: 1,
  hasTouch: true, ignoreDefaultArgs: ['--disable-web-security'],
});
const page = context.pages()[0];
page.setDefaultTimeout(15000);
const report = { url, browser: context.browser()?.version(), userAgent: null, oracle: 'containment-v1', checks: [], console: [], status: 'RUNNING' };
page.on('pageerror', (e) => report.console.push({ type: 'pageerror', message: e.message }));
page.on('console', (m) => {
  if (['error', 'warning'].includes(m.type())) report.console.push({ type: m.type(), message: m.text(), location: m.location() });
});
const button = (name) => page.getByRole('button', { name, exact: true });
const rawStore = (name) => page.evaluate(async (storeName) => {
  const db = await new Promise((yes, no) => { const r = indexedDB.open('nclex-bilingual-prep'); r.onsuccess = () => yes(r.result); r.onerror = () => no(r.error); });
  const rows = await new Promise((yes, no) => { const r = db.transaction(storeName).objectStore(storeName).getAll(); r.onsuccess = () => yes(r.result); r.onerror = () => no(r.error); });
  db.close(); return rows;
}, name);
const session = (fixture, languageMode) => {
  const q = fixture.parent ?? fixture.q;
  return { id: `cloze-regression-${q.id}`, mode: 'study', questionIds: [q.id], poolIds: [q.id], index: 0,
    answers: {}, results: {}, scores: {}, attempts: {}, fingerprints: { [q.id]: questionFingerprint(q) },
    skippedQuestionIds: [], phase: 'questions', languageMode, title: 'Cloze regression',
    startedAt: '2026-09-16T12:00:00.000Z', updatedAt: '2026-09-16T12:00:00.000Z', launchIntent: 'ordinary', returnView: 'home', requestedCount: 1 };
};
let activeFixture;
let inSummary = false;
async function seed(fixture, { width = 320, height = 740, text = 'default', theme = 'light', language = 'on-tap' } = {}) {
  activeFixture = fixture;
  inSummary = false;
  await page.setViewportSize({ width, height });
  await page.evaluate(async ({ snapshot, settings }) => {
    localStorage.setItem('completed-memory-notice', 'dismissed');
    localStorage.setItem('nclex-settings', JSON.stringify(settings));
    const db = await new Promise((yes, no) => { const r = indexedDB.open('nclex-bilingual-prep'); r.onsuccess = () => yes(r.result); r.onerror = () => no(r.error); });
    const names = ['activeSession', 'answerEvents', 'progress', 'completedSets'];
    const tx = db.transaction(names, 'readwrite');
    for (const name of names) tx.objectStore(name).clear();
    tx.objectStore('activeSession').put(snapshot);
    await new Promise((yes, no) => { tx.oncomplete = yes; tx.onerror = () => no(tx.error); }); db.close();
  }, { snapshot: session(fixture, language), settings: { languageMode: language, themeMode: theme, textSizeMode: text, revisitMissed: true, voiceEnabled: false } });
  await page.reload();
  await button('Continue set / 继续练习').click();
  await page.locator('.session-shell').waitFor();
  assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
  assert.equal(await page.locator('html').getAttribute('data-text-size'), text);
  assert.equal(await page.locator('.app-primary-nav:visible').count(), 0);
  if (fixture.parent) {
    const index = fixture.parent.caseStudy.questions.findIndex((q) => q.id === fixture.q.id);
    await page.locator('.case-part-chip').nth(index).click();
  }
  await identity();
}
async function identity() {
  const q = activeFixture.q;
  if (inSummary) {
    const completed = (await rawStore('completedSets'))[0];
    assert(completed.entries.some((e) => e.questionId === q.id && e.status === 'submitted'));
  } else {
    const snapshot = (await rawStore('activeSession'))[0];
    assert.equal(snapshot.questionIds[snapshot.index], activeFixture.parent?.id ?? q.id);
  }
  const surface = activeFixture.parent ? page.locator('.case-active-part:visible') : page.locator('.question-card');
  assert((await surface.innerText()).includes(q.stem.en), `Rendered stem mismatch for ${q.id}`);
  if (q.itemType === 'dropdown_cloze') {
    const values = await surface.locator('.cloze-select').evaluateAll((els) => els.map((el) => [...el.options].map((o) => ({ id: o.value, en: o.textContent }))));
    const tokens = [...q.clozeStem.en.matchAll(/\{\{([^{}]+)\}\}/g)].map((m) => m[1].trim());
    assert.deepEqual(values, tokens.map((id) => [{ id: '', en: 'Choose' }, ...q.dropdowns.find((d) => d.id === id).options.map(({ id, en }) => ({ id, en }))]));
  }
}
async function containment(name) {
  await identity();
  const measurement = await page.evaluate(() => {
    const rect = (el) => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height }; };
    const label = (el) => `${el.tagName.toLowerCase()}.${String(el.className).replaceAll(' ', '.')}`;
    const visible = (el) => el.getClientRects().length > 0;
    const subjects = [...document.querySelectorAll('.cloze-panel, .cloze-line, .cloze-select, .cloze-token, .cloze-readout, .cloze-choice, .submit-button, .option-list, .matrix-panel')].filter(visible).map((el) => {
      const ancestors = []; for (let a = el.parentElement; a; a = a.parentElement) {
        const cs = getComputedStyle(a);
        ancestors.push({ element: label(a), rect: rect(a), scrollWidth: a.scrollWidth, clientWidth: a.clientWidth, overflowX: cs.overflowX, overflowY: cs.overflowY });
      }
      const parent = el.parentElement; const cs = getComputedStyle(parent); const p = parent.getBoundingClientRect();
      const content = { left: p.left + parseFloat(cs.borderLeftWidth) + parseFloat(cs.paddingLeft), right: p.right - parseFloat(cs.borderRightWidth) - parseFloat(cs.paddingRight) };
      return { element: label(el), rect: rect(el), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, content, ancestors };
    });
    return { viewport: { width: innerWidth, height: innerHeight }, dpr: devicePixelRatio, theme: document.documentElement.dataset.theme, text: document.documentElement.dataset.textSize, transport: location.protocol, root: { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }, subjects };
  });
  const failures = [];
  if (measurement.root.scrollWidth > measurement.root.clientWidth + 1) failures.push('root overflow');
  for (const s of measurement.subjects) {
    if (s.rect.left < -1 || s.rect.right > measurement.viewport.width + 1) failures.push(`${s.element}: viewport escape`);
    if (s.rect.left < s.content.left - 1 || s.rect.right > s.content.right + 1) failures.push(`${s.element}: content escape`);
    for (const a of s.ancestors) if (a.scrollWidth > a.clientWidth + 1) failures.push(`${s.element}: ancestor overflow ${a.element}`);
    for (const a of s.ancestors) if (['hidden', 'clip'].includes(a.overflowX) && /(?:cloze|question-card|app-shell)|^(html|body)\./.test(a.element)) failures.push(`${s.element}: prohibited concealment ${a.element}`);
  }
  const entry = { name, fixture: activeFixture.q.id, ...measurement, failures };
  report.checks.push(entry);
  if (failures.length) await page.screenshot({ path: join(out, 'screenshots', `${name}-FAIL.png`), fullPage: true });
  // This decisive assertion always precedes readout-specific assertions.
  assert.equal(failures.length, 0, `CONTAINMENT ${name}: ${failures.join('; ')}; root ${measurement.root.scrollWidth}/${measurement.root.clientWidth}`);
  return entry;
}
const panel = () => page.locator('.cloze-panel:visible');
const selects = () => panel().locator('.cloze-select');
const dropdownOrder = () => [...activeFixture.q.clozeStem.en.matchAll(/\{\{([^{}]+)\}\}/g)].map((m) => activeFixture.q.dropdowns.find((d) => d.id === m[1].trim()));
async function readouts({ chinese = false, submitted = false } = {}) {
  const order = dropdownOrder();
  const values = await selects().evaluateAll((els) => els.map((el) => el.value));
  assert.equal(values.length, order.length);
  for (let i = 0; i < values.length; i++) {
    const option = order[i].options.find((o) => o.id === values[i]);
    const input = selects().nth(i);
    assert.equal(await input.isDisabled(), submitted);
    const id = await input.getAttribute('aria-describedby');
    assert(id, 'select must describe its full-text readout');
    const readout = panel().locator('.cloze-readout').nth(i);
    assert.equal(await readout.getAttribute('id'), id);
    assert.equal(await page.locator(`[id="${id}"]`).count(), 1, 'readout ID must be unique');
    assert.equal(await readout.textContent(), option?.en ?? '');
    assert.equal(await readout.evaluate((el) => el.matches('.correct, .incorrect')), false);
    if (!submitted) assert.equal(await input.evaluate((el) => el.matches('.correct, .incorrect')), false);
    else assert.equal(await input.evaluate((el) => el.classList.contains('correct')), values[i] === order[i].correct);
    if (option) {
      assert(await readout.isVisible());
      const textLayout = await readout.evaluate((el) => {
        const rect = el.getBoundingClientRect(); const range = document.createRange(); range.selectNodeContents(el);
        return { scrollHeight: el.scrollHeight, clientHeight: el.clientHeight, whiteSpace: getComputedStyle(el).whiteSpace,
          fragments: [...range.getClientRects()].map((r) => ({ left: r.left, right: r.right, top: r.top, bottom: r.bottom })),
          rect: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom } };
      });
      assert(textLayout.scrollHeight <= textLayout.clientHeight + 1);
      for (const r of textLayout.fragments) assert(r.left >= textLayout.rect.left - 1 && r.right <= textLayout.rect.right + 1 && r.top >= textLayout.rect.top - 1 && r.bottom <= textLayout.rect.bottom + 1, 'Full option glyphs must fit readout');
    }
  }
  const zh = panel().locator('.chinese-line');
  assert.equal(await zh.count(), chinese ? 1 : 0);
  if (chinese) {
    assert.equal(await zh.locator('select, input, button').count(), 0);
    // ZH token order derives from its own stem, not the EN token order.
    const chosen = Object.fromEntries(order.map((d, i) => [d.id, values[i]]));
    const zhOrder = [...activeFixture.q.clozeStem.zh.matchAll(/\{\{([^{}]+)\}\}/g)].map((m) => activeFixture.q.dropdowns.find((d) => d.id === m[1].trim()));
    assert.deepEqual(await zh.locator('.cloze-token').allTextContents(), zhOrder.map((d) => d.options.find((o) => o.id === chosen[d.id])?.zh ?? '____'));
  }
  report.checks.push({ name: 'full-text-and-language', fixture: activeFixture.q.id, chinese, submitted, values });
}
async function fill(kind = 'longest') {
  for (const [i, d] of dropdownOrder().entries()) {
    const value = kind === 'correct' ? d.correct : kind === 'incorrect' ? d.options.find((o) => o.id !== d.correct).id : [...d.options].sort((a, b) => b.en.length - a.en.length)[0].id;
    await selects().nth(i).selectOption(value);
  }
}
async function neutralStores() {
  for (const name of ['answerEvents', 'progress', 'completedSets']) assert.deepEqual(await rawStore(name), [], `Selection wrote ${name}`);
  const draft = (await rawStore('activeSession'))[0];
  for (const field of ['results', 'scores', 'attempts']) assert.deepEqual(draft[field], {}, `Selection wrote ${field}`);
  return draft;
}
async function checkState(name, options = {}) {
  await containment(name); // Always before the new readout assertions.
  await readouts(options);
}
async function screenshot(name) {
  await panel().scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(out, 'screenshots', `${name}.png`), fullPage: true });
}
async function submit(kind, name, chinese = false) {
  const before = await selects().evaluateAll((els) => els.map((el) => el.value));
  assert.equal(await page.locator('.submit-button:visible').isDisabled(), false);
  await page.locator('.submit-button:visible').click();
  await page.locator('.answer-banner').waitFor();
  await checkState(name, { chinese, submitted: true });
  assert.deepEqual(await selects().evaluateAll((els) => els.map((el) => el.value)), before);
  const snapshot = (await rawStore('activeSession'))[0];
  const qid = activeFixture.parent?.id ?? activeFixture.q.id;
  assert.equal(snapshot.results[qid], kind === 'correct');
  assert(snapshot.attempts[qid].submissionId);
  assert.equal((await rawStore('answerEvents')).length, 1);
  const progress = await rawStore('progress');
  assert.equal(progress.length, 1);
  assert.equal(progress[0].needsReview, kind !== 'correct');
}
async function everyOption(name, chinese = false) {
  for (const [i, d] of dropdownOrder().entries()) {
    for (const o of d.options) {
      await selects().nth(i).selectOption(o.id);
      await checkState(`${name}-blank${i + 1}-${o.id}`, { chinese });
    }
  }
  await neutralStores();
}
async function focusProof() {
  const first = selects().first();
  await first.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  assert(await first.evaluate((el) => el === document.activeElement && el.matches(':focus-visible')));
  const proof = await first.evaluate((el) => {
    const cs = getComputedStyle(el); const expansion = parseFloat(cs.outlineWidth) + parseFloat(cs.outlineOffset); const r = el.getBoundingClientRect();
    const ring = { left: r.left - expansion, right: r.right + expansion, top: r.top - expansion, bottom: r.bottom + expansion };
    const clippingAncestors = [];
    for (let a = el.parentElement; a; a = a.parentElement) {
      const style = getComputedStyle(a); const ar = a.getBoundingClientRect();
      if (['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowX)) clippingAncestors.push({ left: ar.left, right: ar.right });
    }
    return { ring, clippingAncestors, viewport: innerWidth, outline: cs.outline, offset: cs.outlineOffset };
  });
  assert(proof.ring.left >= -1 && proof.ring.right <= proof.viewport + 1);
  for (const a of proof.clippingAncestors) assert(proof.ring.left >= a.left - 1 && proof.ring.right <= a.right + 1, 'Focus ring clipped horizontally');
  report.checks.push({ name: 'keyboard-focus-ring', ...proof });
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  assert.notEqual(await first.inputValue(), '');
  await checkState('keyboard-selected');
  // Touch-style activation of the actual native select; picker appearance is not a physical-device claim.
  await first.tap();
  await page.keyboard.press('Escape');
  await first.selectOption(dropdownOrder()[0].options[0].id);
  await checkState('touch-selected');
}
async function core() {
  for (const width of [320, 390]) for (const text of ['default', 'large']) {
    const label = `witness-${width}-${text}`;
    await seed(witness, { width, height: width === 320 ? 740 : 844, text });
    await checkState(`${label}-empty`);
    assert(await page.locator('.submit-button').isDisabled());
    if (width === 320 && text === 'default') {
      await focusProof();
      await everyOption('witness-every-option');
    }
    await fill();
    await checkState(`${label}-selected`);
    await neutralStores();
    await fill('correct');
    await submit('correct', `${label}-submitted-correct`);
    // Post-submit full Chinese keeps the selection and its disabled controls.
    await page.getByRole('button', { name: /显示完整中文/ }).click();
    await checkState(`${label}-submitted-full-chinese`, { submitted: true, chinese: true });
    if (width === 320 && text === 'default') await screenshot('witness-320-correct-chinese');
    await seed(witness, { width, height: width === 320 ? 740 : 844, text });
    await fill('incorrect');
    await submit('incorrect', `${label}-submitted-incorrect`);
  }
}
async function languageAndResume() {
  await seed(multi, { text: 'large', theme: 'dark' });
  await checkState('multi-dark-large-empty');
  await selects().first().selectOption(dropdownOrder()[0].options[0].id);
  assert(await page.locator('.submit-button').isDisabled(), 'Partial answer must remain incomplete');
  await checkState('multi-partial');
  await everyOption('multi-every-option');
  await fill();
  assert.equal(await page.locator('.submit-button').isDisabled(), false);
  await checkState('multi-full-selected');
  const before = (await neutralStores()).answers;
  await panel().getByRole('button', { name: '需要中文', exact: true }).click();
  await checkState('multi-revealed', { chinese: true });
  for (const [label, chinese] of [['EN', false], ['EN/ZH', true], ['Tap ZH', true]]) {
    await page.getByRole('group', { name: 'Chinese display' }).getByRole('button', { name: label, exact: true }).click();
    await checkState(`multi-language-${label.replace('/', '-')}`, { chinese });
    assert.deepEqual((await neutralStores()).answers, before);
  }
  await screenshot('multi-dark-large-revealed');
  await page.reload();
  await button('Continue set / 继续练习').click();
  await checkState('multi-reloaded-draft');
  assert.deepEqual((await neutralStores()).answers, before);
  await fill('correct');
  await submit('correct', 'multi-resumed-submitted');
  await seed(witness, { text: 'compact', language: 'always', width: 390, height: 844 });
  await fill();
  await checkState('witness-compact-always', { chinese: true });
  await seed(witness, { language: 'off', theme: 'dark', text: 'large' });
  await fill('incorrect');
  await checkState('witness-dark-large-off');
  await submit('incorrect', 'witness-off-submitted');
}
async function sharedContexts() {
  await seed(caseFixture, { text: 'large', language: 'always' });
  await checkState('case-empty', { chinese: true });
  await everyOption('case-every-option', true);
  await fill();
  await checkState('case-selected', { chinese: true });
  const before = (await neutralStores()).answers;
  const index = caseFixture.parent.caseStudy.questions.findIndex((q) => q.id === caseFixture.q.id);
  await page.locator('.case-part-chip').nth(index === 0 ? 1 : 0).click();
  await page.locator('.case-part-chip').nth(index).click();
  await checkState('case-returned-part', { chinese: true });
  assert.deepEqual((await neutralStores()).answers, before);
  await screenshot('case-large-selected');
  // Submit the actual case through the UI. Other parts are canonical correct answers,
  // prefilled in a disposable test draft to bound this cloze presentation test.
  const snapshot = (await rawStore('activeSession'))[0];
  snapshot.answers[caseFixture.parent.id] = getCorrectAnswer(caseFixture.parent);
  await page.evaluate(async (snapshot) => {
    const db = await new Promise((yes, no) => { const r = indexedDB.open('nclex-bilingual-prep'); r.onsuccess = () => yes(r.result); r.onerror = () => no(r.error); });
    const tx = db.transaction('activeSession', 'readwrite'); tx.objectStore('activeSession').put(snapshot);
    await new Promise((yes, no) => { tx.oncomplete = yes; tx.onerror = () => no(tx.error); }); db.close();
  }, snapshot);
  await page.reload(); await button('Continue set / 继续练习').click();
  await page.locator('.case-part-chip').nth(index).click();
  await fill('correct');
  await submit('correct', 'case-submitted-correct', true);
  await seed(witness);
  await fill('incorrect'); await submit('incorrect', 'summary-source-submission');
  await button('Finish').click();
  await page.locator('.completed-set').waitFor();
  await page.locator('.summary-review-toggle').click();
  inSummary = true;
  await checkState('summary-read-only', { submitted: true });
  await screenshot('summary-read-only');
}
async function largerAndCollateral() {
  for (const width of [780, 781, 820, 821, 1440]) {
    await seed(witness, { width, height: 900, language: 'always' });
    await fill(); await checkState(`witness-width-${width}`, { chinese: true });
    await seed(caseFixture, { width, height: 900, language: 'always' });
    await fill(); await checkState(`case-width-${width}`, { chinese: true });
    if (width === 1440) await screenshot('case-desktop');
  }
  for (const fixture of [mcq, matrix]) for (const width of [320, 821, 1440]) {
    await seed(fixture, { width, height: 900, text: 'large' });
    await containment(`${fixture.q.itemType}-collateral-${width}`);
    if (fixture.q.itemType === 'multiple_choice') {
      const before = await page.locator('.option-row:visible').count();
      await page.locator('.option-row:visible').first().click();
      assert(before > 0); assert.equal(await page.locator('.submit-button').isDisabled(), false);
    } else {
      assert(await page.locator('.matrix-table:visible').count());
      await page.locator('.matrix-table td button').first().click();
    }
    await containment(`${fixture.q.itemType}-selected-${width}`);
  }
}
async function consoleProof() {
  const manifestUrl = new URL('manifest.webmanifest', url).href;
  for (const e of report.console) {
    // Only the inherited file manifest CORS diagnostic and its URL-attributed pair.
    const inheritedCors = new URL(url).protocol === 'file:' && e.type === 'error' && e.message.startsWith(`Access to internal resource at '${manifestUrl}'`) && e.message.includes("from origin 'null' has been blocked by CORS policy");
    const inheritedPair = new URL(url).protocol === 'file:' && e.type === 'error' && e.message === 'Failed to load resource: net::ERR_FAILED' && e.location?.url === manifestUrl;
    e.allowedInheritedManifest = inheritedCors || inheritedPair;
    assert(e.allowedInheritedManifest, `Unexpected browser diagnostic: ${JSON.stringify(e)}`);
  }
}

try {
  await page.goto(url);
  await page.locator('.study-workspace').waitFor();
  report.userAgent = await page.evaluate(() => navigator.userAgent);
  await seed(witness);
  await containment('witness-320-default-empty');
  if (new URL(url).protocol === 'file:') {
    await fill('correct');
    await checkState('file-selected');
    await submit('correct', 'file-submitted-correct');
    await screenshot('file-320-submitted');
  } else {
    await core();
    await languageAndResume();
    await sharedContexts();
    await largerAndCollateral();
  }
  await consoleProof();
  report.status = 'PASS';
} catch (error) {
  report.status = 'FAIL'; report.error = error.stack; process.exitCode = 1;
  console.error(error.message);
} finally {
  writeFileSync(join(out, 'results.json'), JSON.stringify(report, null, 2) + '\n');
  await context.close(); rmSync(profile, { recursive: true, force: true });
}
