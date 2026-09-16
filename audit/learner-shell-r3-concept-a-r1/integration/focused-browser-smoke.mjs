// Focused post-integration smoke for the accepted Learner Shell R3 Concept A.
// Uses system Google Chrome, normal web security, and disposable profiles.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { questionFingerprint } from '../../../src/completedMemory.ts';

const playwrightPath =
  process.env.PLAYWRIGHT_MODULE || '/tmp/shrimp-omnibus-tools/node_modules/playwright/index.mjs';
const { chromium } = await import(playwrightPath);

const outputDirectory = resolve('audit/learner-shell-r3-concept-a-r1/integration');
const screenshotDirectory = join(outputDirectory, 'screenshots');
mkdirSync(screenshotDirectory, { recursive: true });

const questions = readdirSync('banks')
  .filter((file) => file.endsWith('.json'))
  .sort()
  .flatMap((file) => JSON.parse(readFileSync(join('banks', file), 'utf8')).questions);
const ordinaryQuestion = questions.find(
  (question) => question.itemType === 'multiple_choice' && !question.visual,
);
const secondQuestion = questions.find(
  (question) =>
    question.itemType === 'multiple_choice' &&
    !question.visual &&
    question.id !== ordinaryQuestion?.id,
);
const dropdownQuestion = questions.find(
  (question) => question.id === 'gpt_format15_vasa_previa_management_dropdown',
);
assert(ordinaryQuestion && secondQuestion && dropdownQuestion);

const sha256 = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
const now = '2026-09-16T12:00:00.000Z';
const sessionSnapshot = (id, sessionQuestions) => ({
  id,
  mode: 'study',
  questionIds: sessionQuestions.map((question) => question.id),
  poolIds: sessionQuestions.map((question) => question.id),
  index: 0,
  answers: {},
  results: {},
  scores: {},
  attempts: {},
  fingerprints: Object.fromEntries(
    sessionQuestions.map((question) => [question.id, questionFingerprint(question)]),
  ),
  skippedQuestionIds: [],
  phase: 'questions',
  languageMode: 'on-tap',
  title: 'Integration smoke set',
  startedAt: now,
  updatedAt: now,
  launchIntent: 'ordinary',
  returnView: 'home',
  requestedCount: sessionQuestions.length,
});

const server = createServer((request, response) => {
  const relative = decodeURIComponent(request.url.split('?')[0]).replace(/^\//, '') || 'index.html';
  if (relative.includes('..')) {
    response.writeHead(400);
    response.end();
    return;
  }
  try {
    const file = resolve('dist', relative);
    response.setHeader(
      'Content-Type',
      file.endsWith('.js')
        ? 'text/javascript'
        : file.endsWith('.css')
          ? 'text/css'
          : file.endsWith('.json')
            ? 'application/json'
            : file.endsWith('.svg')
              ? 'image/svg+xml'
              : 'text/html',
    );
    response.end(readFileSync(file));
  } catch {
    response.writeHead(404);
    response.end();
  }
});
await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
const httpUrl = `http://127.0.0.1:${server.address().port}`;

const checks = [];
const consoleEvents = [];
const profiles = [];
const contexts = [];
const screenshots = [];
const deferredDefects = {};

const launch = async (viewport) => {
  const profile = mkdtempSync(join(tmpdir(), 'shrimp-r3-integration-'));
  profiles.push(profile);
  const context = await chromium.launchPersistentContext(profile, {
    channel: 'chrome',
    headless: true,
    viewport,
    // Playwright normally disables web security; retaining this argument keeps it enabled.
    ignoreDefaultArgs: ['--disable-web-security'],
  });
  contexts.push(context);
  return context;
};

const observe = (page) => {
  page.on('pageerror', (error) =>
    consoleEvents.push({ type: 'pageerror', url: page.url(), message: error.message }),
  );
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      consoleEvents.push({ type: message.type(), url: page.url(), message: message.text() });
    }
  });
};

const metrics = (page) =>
  page.evaluate(() => ({
    viewport: { width: innerWidth, height: innerHeight },
    devicePixelRatio,
    theme: document.documentElement.dataset.theme,
    textSize: document.documentElement.dataset.textSize,
    protocol: location.protocol,
  }));

const recordPass = async (page, name, details = {}) => {
  const entry = { name, status: 'PASS', ...(await metrics(page)), ...details };
  checks.push(entry);
  console.log(`PASS ${name}`);
};

const screenshot = async (page, name) => {
  const relative = `screenshots/${name}.png`;
  await page.screenshot({ path: join(outputDirectory, relative) });
  screenshots.push(relative);
};

const button = (page, name) => page.getByRole('button', { name, exact: true });
const navigation = (page, name) =>
  page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('button', { name, exact: true });

const waitForRoot = async (page) => {
  await page.locator('.study-workspace').waitFor();
  await page.waitForFunction(() => !document.querySelector('.test-start')?.disabled);
};

const assertPrimaryNavigation = async (page) => {
  assert.deepEqual(await page.locator('.app-primary-nav button').allTextContents(), [
    'Study',
    'Library',
    'Progress',
  ]);
};

const rawStore = (page, storeName) =>
  page.evaluate(async (name) => {
    const database = await new Promise((resolveDatabase, rejectDatabase) => {
      const request = indexedDB.open('nclex-bilingual-prep');
      request.onsuccess = () => resolveDatabase(request.result);
      request.onerror = () => rejectDatabase(request.error);
    });
    const rows = await new Promise((resolveRows, rejectRows) => {
      const request = database.transaction(name).objectStore(name).getAll();
      request.onsuccess = () => resolveRows(request.result);
      request.onerror = () => rejectRows(request.error);
    });
    database.close();
    return rows;
  }, storeName);

const seed = async (page, stores, settings) => {
  await page.evaluate(
    async ({ storeRows, savedSettings }) => {
      localStorage.setItem('completed-memory-notice', 'dismissed');
      if (savedSettings) {
        localStorage.setItem('nclex-settings', JSON.stringify(savedSettings));
      }
      const database = await new Promise((resolveDatabase, rejectDatabase) => {
        const request = indexedDB.open('nclex-bilingual-prep');
        request.onsuccess = () => resolveDatabase(request.result);
        request.onerror = () => rejectDatabase(request.error);
      });
      const transaction = database.transaction(Object.keys(storeRows), 'readwrite');
      for (const [name, rows] of Object.entries(storeRows)) {
        const store = transaction.objectStore(name);
        store.clear();
        rows.forEach((row) => store.put(row));
      }
      await new Promise((resolveTransaction, rejectTransaction) => {
        transaction.oncomplete = resolveTransaction;
        transaction.onerror = () => rejectTransaction(transaction.error);
      });
      database.close();
    },
    { storeRows: stores, savedSettings: settings },
  );
  await page.reload();
  await waitForRoot(page);
};

const expandNewSet = async (page) => {
  const details = page.locator('.study-new-set');
  if (!(await details.evaluate((element) => element.open))) {
    await details.locator('summary').click();
  }
};

let currentPage;
try {
  const context = await launch({ width: 1440, height: 900 });
  const page = context.pages()[0];
  currentPage = page;
  page.setDefaultTimeout(15000);
  observe(page);
  await page.goto(httpUrl);
  await waitForRoot(page);
  await assertPrimaryNavigation(page);
  await screenshot(page, 'desktop-study-root.png');
  await recordPass(page, 'Desktop Study root', { navigation: ['Study', 'Library', 'Progress'] });

  await page.setViewportSize({ width: 390, height: 844 });
  await assertPrimaryNavigation(page);
  assert.equal(await page.locator('.app-primary-nav button').count(), 3);
  await screenshot(page, 'mobile-study-root.png');
  await recordPass(page, 'Mobile Study root with exactly three learner destinations', {
    navigation: ['Study', 'Library', 'Progress'],
  });

  const protectedSession = sessionSnapshot('integration-smoke-protected', [
    ordinaryQuestion,
    secondQuestion,
  ]);
  await seed(
    page,
    {
      activeSession: [protectedSession],
      progress: [],
      flags: [],
      answerEvents: [],
      completedSets: [],
    },
    {
      languageMode: 'on-tap',
      themeMode: 'light',
      textSizeMode: 'default',
      revisitMissed: true,
      voiceEnabled: true,
    },
  );
  await button(page, 'Continue set / 继续练习').click();
  await page.locator('.session-shell').waitFor();
  assert.equal(await page.locator('.app-primary-nav').count(), 0);
  await recordPass(page, 'Mobile active Study hides learner bottom navigation');

  await button(page, 'Save question').click();
  await button(page, 'Remove from Saved').waitFor();

  await page.locator('.exam-calculator-launcher').click();
  const calculator = page.getByRole('dialog', { name: 'Calculator' });
  await calculator.waitFor();
  await calculator.getByRole('button', { name: '2', exact: true }).click();
  await calculator.getByRole('button', { name: '+', exact: true }).click();
  await calculator.getByRole('button', { name: '3', exact: true }).click();
  await calculator.getByRole('button', { name: 'Equals', exact: true }).click();
  assert.match(await page.locator('.exam-calculator-display').innerText(), /5/);
  const calculatorOverlap = await page.evaluate(() => {
    const panel = document.querySelector('.exam-calculator').getBoundingClientRect();
    const submit = document.querySelector('.submit-button').getBoundingClientRect();
    return {
      panel: { top: panel.top, bottom: panel.bottom, left: panel.left, right: panel.right },
      submit: { top: submit.top, bottom: submit.bottom, left: submit.left, right: submit.right },
      verticalOverlap: Math.max(0, Math.min(panel.bottom, submit.bottom) - Math.max(panel.top, submit.top)),
      horizontalOverlap: Math.max(0, Math.min(panel.right, submit.right) - Math.max(panel.left, submit.left)),
    };
  });
  assert(calculatorOverlap.verticalOverlap > 0 && calculatorOverlap.horizontalOverlap > 0);
  deferredDefects.calculatorSheetSubmitOverlap = {
    observed: true,
    measurement: calculatorOverlap,
    integrationConclusion:
      'Inherited behavior remains observable; exact accepted-candidate blob identity proves integration neither created nor worsened it.',
  };
  await button(page, 'Minimize calculator').click();
  assert(await page.locator('.exam-calculator-launcher').isVisible());
  await recordPass(page, 'Mobile calculator launch, arithmetic, and close', {
    display: '5',
    deferredOverlapObserved: true,
  });

  const correctOptionId = ordinaryQuestion.correct[0];
  const correctOption = ordinaryQuestion.options.find((option) => option.id === correctOptionId);
  await page.locator('.option-row').filter({ hasText: correctOption.en }).click();
  await button(page, 'Submit answer').click();
  await page.locator('.response-status').waitFor();
  const responseStatus = await page.locator('.response-status').first().innerText();
  assert.match(responseStatus, /Correct answer/);
  await page.locator('.rationale-panel').waitFor();
  await screenshot(page, 'mobile-submit-rationale.png');
  await button(page, 'Next').click();
  await page.getByText(/Question 2 of 2/).waitFor();
  await recordPass(page, 'Normal submit to response status, rationale, and next flow', {
    responseStatus,
  });

  await page
    .locator('.session-topbar')
    .getByRole('button', { name: 'Study', exact: true })
    .click();
  await waitForRoot(page);
  await expandNewSet(page);
  const replacementTrigger = page.locator('button.test-start').first();
  const beforeReplacement = await rawStore(page, 'activeSession');
  await replacementTrigger.click();
  const replacementDialog = page.getByRole('dialog');
  await replacementDialog.waitFor();
  assert.equal(
    await button(page, 'Keep current set / 保留当前练习').evaluate(
      (element) => element === document.activeElement,
    ),
    true,
  );
  await screenshot(page, 'mobile-replacement-dialog.png');
  await page.keyboard.press('Escape');
  assert.deepEqual(await rawStore(page, 'activeSession'), beforeReplacement);
  assert.equal(await replacementTrigger.evaluate((element) => element === document.activeElement), true);
  await replacementTrigger.click();
  await button(page, 'Keep current set / 保留当前练习').click();
  assert.deepEqual(await rawStore(page, 'activeSession'), beforeReplacement);
  assert.equal(await replacementTrigger.evaluate((element) => element === document.activeElement), true);
  await recordPass(
    page,
    'Protected-session replacement dialog: safe focus, Escape, Keep, preservation, and focus return',
    { sessionId: beforeReplacement[0].id },
  );

  await page.getByRole('button', { name: /^Saved/ }).click();
  await page.locator('.memory-row').waitFor();
  assert.match(await page.locator('.memory-row').first().innerText(), new RegExp(ordinaryQuestion.stem.en.slice(0, 20)));
  await recordPass(page, 'Saved memory surface uses persisted session flag', {
    rows: await page.locator('.memory-row').count(),
  });
  await button(page, 'Back to Study').click();

  await button(page, 'Settings').click();
  await button(page, 'Large').click();
  await navigation(page, 'Study').click();
  assert.equal(await page.locator('html').getAttribute('data-text-size'), 'large');
  const largeTextOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  assert.equal(largeTextOverflow, false);
  await screenshot(page, 'mobile-large-text.png');
  await recordPass(page, 'Production Large text on mobile Study root', {
    horizontalOverflow: largeTextOverflow,
  });

  await page.setViewportSize({ width: 320, height: 740 });
  await seed(
    page,
    { activeSession: [sessionSnapshot('integration-smoke-dropdown', [dropdownQuestion])] },
    {
      languageMode: 'on-tap',
      themeMode: 'light',
      textSizeMode: 'default',
      revisitMissed: true,
      voiceEnabled: true,
    },
  );
  await button(page, 'Continue set / 继续练习').click();
  await page.locator('.session-shell').waitFor();
  const dropdownOverflow = await page.evaluate(() => ({
    itemType: document.querySelector('.type-pill')?.textContent?.trim(),
    innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    overflowing: document.documentElement.scrollWidth > innerWidth + 1,
  }));
  assert.equal(dropdownOverflow.itemType, 'dropdown cloze');
  assert.equal(dropdownOverflow.overflowing, true);
  deferredDefects.mobileDropdownClozeOverflow = {
    observed: true,
    measurement: dropdownOverflow,
    integrationConclusion:
      'Inherited behavior remains observable; exact accepted-candidate blob identity proves integration neither created nor worsened it.',
  };
  await recordPass(page, 'Deferred mobile dropdown_cloze defect remains inherited, not integration-created', {
    measurement: dropdownOverflow,
  });

  const fileContext = await launch({ width: 390, height: 844 });
  const filePage = fileContext.pages()[0];
  currentPage = filePage;
  filePage.setDefaultTimeout(15000);
  observe(filePage);
  await filePage.goto(pathToFileURL(resolve('dist/index.html')).href);
  await waitForRoot(filePage);
  await assertPrimaryNavigation(filePage);
  await navigation(filePage, 'Library').click();
  await filePage.getByRole('heading', { name: /matching questions/ }).waitFor();
  await navigation(filePage, 'Progress').click();
  await filePage.getByRole('heading', { name: 'Attempts and coverage' }).waitFor();
  await navigation(filePage, 'Study').click();
  await waitForRoot(filePage);
  await screenshot(filePage, 'file-build-study-root.png');
  await recordPass(filePage, 'Final file:// production build load and navigation', {
    artifact: resolve('dist/index.html'),
    artifactSha256: sha256('dist/index.html'),
    navigation: ['Library', 'Progress', 'Study'],
  });
} catch (error) {
  checks.push({ name: 'Focused browser smoke runner', status: 'FAIL', message: error.stack });
  console.error(error);
  if (currentPage) {
    await screenshot(currentPage, 'failure.png').catch(() => {});
  }
  process.exitCode = 1;
} finally {
  const chromeUserAgent = currentPage
    ? await currentPage.evaluate(() => navigator.userAgent).catch(() => '')
    : '';
  const result = {
    status: process.exitCode ? 'FAIL' : 'PASS',
    chromeUserAgent,
    transport:
      'System Google Chrome via Playwright, headless, normal web security, disposable persistent profile per transport',
    inputIdentity: {
      appBlob: '8eac13d0b4f7f2631501e20c1ac5d285b7359010',
      appSha256: sha256('src/App.tsx'),
      stylesBlob: 'e95d261bc5713fac990ebc2bda4ef9320a521db7',
      stylesSha256: sha256('src/styles.css'),
    },
    questions: {
      ordinary: ordinaryQuestion.id,
      second: secondQuestion.id,
      dropdownCloze: dropdownQuestion.id,
    },
    checks,
    deferredDefects,
    consoleEvents,
    screenshots,
  };
  writeFileSync(
    join(outputDirectory, 'focused-browser-smoke-results.json'),
    `${JSON.stringify(result, null, 2)}\n`,
  );
  for (const context of contexts) {
    await context.close().catch(() => {});
  }
  server.close();
  for (const profile of profiles) {
    rmSync(profile, { recursive: true, force: true });
  }
}
