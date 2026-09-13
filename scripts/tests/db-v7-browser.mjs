// Producer evidence using system Chrome, isolated profiles and actual historical storage writers.
// V5_SOURCE / V6_SOURCE select live worktrees. Build the accepted v6 and this v7 first.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, cpSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { build } from 'esbuild';
import { migrateProgress } from '../../src/progressMigration.ts';
import { nativeSnapshot, characterize, assertSubtraction, expectedSubtraction, assertCleanProgress, RETIRED_PROGRESS_KEYS } from './db-v7-structure.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = process.cwd();
const v5 = resolve(process.env.V5_SOURCE || '../Project Shrimp');
const v6 = resolve(process.env.V6_SOURCE || '../Project Shrimp Review Vocab R1');
const out = resolve('audit/review-vocab-omnibus-r1/db-v7-physical-cleanup-r1');
const scratch = mkdtempSync('/tmp/shrimp-db-v7-');
const live = join(scratch, 'live'); mkdirSync(live);
const sha = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
const revision = (path) => execFileSync('git', ['rev-parse', 'HEAD'], { cwd: path, encoding: 'utf8' }).trim();
assert.equal(revision(v6), 'e251dada5827a3862f5de9047326a654d64a88a5');
assert.match(readFileSync(join(v5, 'src/storage.ts'), 'utf8'), /DB_VERSION = 5/);
const checks = [], errors = [], consoleErrors = [];
const pass = (name, data = {}) => { checks.push({ name, status: 'PASS', ...data }); console.log('PASS', name); };
const save = (name, data) => writeFileSync(join(out, name + '.json'), JSON.stringify(data, null, 2) + '\n');
const bundle = async (source, name) => {
  const r = await build({ entryPoints: [source], bundle: true, write: false, format: 'iife', globalName: name, platform: 'browser' });
  return r.outputFiles[0].text;
};
const v5Code = await bundle(join(v5, 'src/storage.ts'), 'historical');
const v6Code = await bundle(join(v6, 'src/storage.ts'), 'accepted');
const v7Code = await bundle(join(root, 'src/storage.ts'), 'current');
const helpers = await build({ stdin: { contents: `export * from ${JSON.stringify(join(v6, 'src/completedMemory.ts'))};\nexport { getCorrectAnswer } from ${JSON.stringify(join(v6, 'src/grading.ts'))};`, resolveDir: root }, bundle: true, write: false, format: 'iife', globalName: 'fixtureTools', platform: 'browser' });
const helperCode = helpers.outputFiles[0].text;
const questions = JSON.parse(readFileSync('banks/gemini-canonical.json')).questions.filter((q) => q.itemType === 'multiple_choice').slice(0, 3);
const [q1, q2, q3] = questions;
let appRoot = join(root, 'dist');
const server = createServer((req, res) => {
  if (req.url === '/seed.html') { res.setHeader('Content-Type', 'text/html'); res.end('<html><title>DB v7 test fixture</title><body>Isolated storage fixture</body></html>'); return; }
  const relative = decodeURIComponent(req.url.split('?')[0]).replace(/^\//, '') || 'index.html';
  if (relative.includes('..')) { res.writeHead(400); res.end(); return; }
  try { const path = join(appRoot, relative); res.setHeader('Content-Type', path.endsWith('.js') ? 'text/javascript' : path.endsWith('.css') ? 'text/css' : path.endsWith('.json') ? 'application/json' : 'text/html'); res.end(readFileSync(path)); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const contexts = new Set();
const launch = async (profile) => {
  const ctx = await chromium.launchPersistentContext(join(scratch, profile), {
    channel: 'chrome', headless: true, viewport: { width: 1280, height: 900 },
    // Preserve normal browser security; Playwright's automation default disables it.
    ignoreDefaultArgs: ['--disable-web-security'],
  });
  contexts.add(ctx);
  return ctx;
};
const observe = (p, label) => {
  p.on('pageerror', (e) => errors.push({ label, error: e.message }));
  p.on('console', (m) => { if (m.type() === 'error') consoleErrors.push({ label, error: m.text() }); });
};
const button = (p, name) => p.getByRole('button', { name, exact: true });
const ready = async (p) => {
  await button(p, 'Start practice · 50 questions').waitFor();
  await p.waitForFunction(() => !Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Start practice · 50 questions'))?.disabled);
};
const raw = (p) => p.evaluate(nativeSnapshot);
// Pause only delivery of the committed open's success to idb. The versionchange
// transaction runs normally; a separate native connection inspects its exact result
// before the accepted app's hydration effect refreshes active.updatedAt.
async function observeUpgradeBeforeHydration(p) {
  await p.addInitScript(() => {
    window.__upgradeCommitted = false; window.__releaseOpen = [];
    const open = IDBFactory.prototype.open;
    IDBFactory.prototype.open = function (...args) {
      const r = open.apply(this, args);
      if (args[0] === 'nclex-bilingual-prep' && args[1] === 7) {
        let upgraded = false;
        const add = r.addEventListener.bind(r);
        add('upgradeneeded', () => { upgraded = true; });
        add('success', () => { if (upgraded) window.__upgradeCommitted = true; });
        r.addEventListener = (type, listener, options) => add(type, type === 'success' ? (event) => {
          if (upgraded) window.__releaseOpen.push(() => listener.call(r, event));
          else listener.call(r, event);
        } : listener, options);
      }
      return r;
    };
  });
}
async function committedMigration(p) {
  await p.waitForFunction(() => window.__upgradeCommitted && window.__releaseOpen.length > 0);
  const snapshot = await raw(p);
  await p.evaluate(() => window.__releaseOpen.splice(0).forEach((release) => release()));
  await ready(p);
  return snapshot;
}
function assertHydration(before, after) {
  const expected = structuredClone(before);
  for (const row of expected.stores.activeSession.values) {
    const actual = after.stores.activeSession.values.find((r) => r.id === row.id);
    assert.ok(actual, 'Resumable active ID remains durable');
    assert.ok(Date.parse(actual.updatedAt) >= Date.parse(row.updatedAt));
    row.updatedAt = actual.updatedAt;
  }
  assert.deepEqual(after, expected, 'Accepted startup may refresh only active.updatedAt');
}
async function genuineV5(p) {
  await p.addScriptTag({ content: v5Code });
  await p.evaluate(async (qs) => {
    const [a, b, c] = qs;
    const context = { sessionId: 'historical-v5', sessionMode: 'study', languageModeAtAnswer: 'on-tap' };
    await historical.recordAnswer(a.id, false, context); await historical.recordAnswer(a.id, true, context);
    await historical.recordAnswer(b.id, false, context); await historical.recordAnswer(c.id, false, context);
    await historical.recordAnswer('missing-from-current-bank', false, context);
    await historical.saveQuestionFlag({ questionId: a.id, flagged: true, note: 'Saved by historical writer', updatedAt: '2026-09-12T10:00:00Z' });
    await historical.saveQuestionFlag({ questionId: b.id, flagged: false, note: 'Note only, never Saved', updatedAt: '2026-09-12T10:00:00Z' });
    await historical.saveUploadedRecords([{ question: { ...a, id: 'uploaded-v5' }, sourceKind: 'uploaded', sourceLabel: 'historical fixture', importedAt: '2026-09-12T10:00:00Z', originalId: a.id }]);
    await historical.saveActiveSession({ id: 'historical-active', mode: 'study', questionIds: [a.id, b.id], poolIds: [a.id, b.id], index: 1,
      answers: { [b.id]: { optionIds: [b.correct[0]] } }, results: { [a.id]: false }, scores: { [a.id]: { earned: 0, possible: 1 } },
      skippedQuestionIds: [b.id], phase: 'skipped-review', languageMode: 'on-tap', title: 'Historical active',
      startedAt: '2026-09-12T10:00:00Z', updatedAt: '2026-09-12T10:01:00Z' });
    await historical.recordFlashcardReview('historical-term', false);
    await historical.recordLanguageMiss(a.id, true);
    await historical.recordTranslationReveal({ questionId: a.id, sessionId: 'historical-v5', block: 'stem', sessionMode: 'study', languageModeAtReveal: 'on-tap',
      itemType: a.itemType, category: a.category, topic: a.topic, elapsedMsOnQuestion: 1500, answeredBeforeReveal: false, submittedBeforeReveal: false, revealCountForQuestion: 1 });
    await historical.recordCaseAnswerPartEvent({ questionId: 'historical-case', partId: 'historical-part', wasCorrect: false,
      sessionId: 'historical-v5', sessionMode: 'study', languageModeAtAnswer: 'on-tap' });
    historical.saveSettings({ ...historical.defaultSettings, languageMode: 'on-tap', themeMode: 'dark' });
    localStorage.setItem('unrelated-preserve', 'opaque owner preference');
    localStorage.setItem('completed-memory-notice', 'dismissed');
  }, questions);
  const before = await raw(p);
  assert.equal(before.version, 5); characterize(before);
  for (const name of Object.keys(before.stores)) assert.ok(before.stores[name].values.length > 0, `${name} populated by actual writer`);
  for (const row of before.stores.progress.values)
    for (const key of RETIRED_PROGRESS_KEYS) assert.ok(Object.hasOwn(row, key), `Actual v5 writer produced ${key}`);
  return before;
}
async function makeV6(p, seedURL) {
  const actualV5 = await genuineV5(p);
  // Supplement the genuine history with one characterized damaged legacy row, to exercise diagnostics.
  await p.evaluate(async (id) => {
    const db = await new Promise((resolve) => { const r = indexedDB.open('nclex-bilingual-prep'); r.onsuccess = () => resolve(r.result); });
    const tx = db.transaction(['progress', 'answerEvents'], 'readwrite');
    const r = tx.objectStore('progress').get(id);
    r.onsuccess = () => { const row = r.result; delete row.correctStreak; tx.objectStore('progress').put(row); };
    const events = tx.objectStore('answerEvents').openCursor();
    events.onsuccess = () => { const c = events.result; if (c) { if (c.value.questionId === id) c.delete(); c.continue(); } };
    await new Promise((resolve, reject) => { tx.oncomplete = resolve; tx.onabort = () => reject(tx.error); }); db.close();
  }, q3.id);
  const diagnosticV5 = await raw(p); characterize(diagnosticV5);
  await p.goto(seedURL); // Releases the actual v5 module's connection; storage identity is unchanged.
  await p.addScriptTag({ content: v6Code }); await p.addScriptTag({ content: helperCode });
  await p.evaluate(async (qs) => {
    const [a, b, c] = qs;
    await accepted.loadProgress(); await accepted.loadActiveSession();
    const now = '2026-09-12T15:00:00Z';
    const snapshot = (id, list) => ({ id, mode: 'study', questionIds: list.map((q) => q.id), poolIds: list.map((q) => q.id), index: 0,
      answers: {}, results: {}, scores: {}, attempts: {}, fingerprints: Object.fromEntries(list.map((q) => [q.id, fixtureTools.questionFingerprint(q)])),
      phase: 'questions', skippedQuestionIds: [], languageMode: 'on-tap', title: id, startedAt: now, updatedAt: now,
      launchIntent: 'ordinary', returnView: 'home', requestedCount: list.length });
    let archive = snapshot('v6-last-set', [b]);
    if ((await accepted.saveActiveSession(archive)).durability !== 'durable') throw new Error('v6 active not durable');
    const full = await accepted.commitSubmission(archive, b.id, fixtureTools.captureAttempt(archive, b, fixtureTools.getCorrectAnswer(b)));
    if (full.durability !== 'durable') throw new Error('v6 full marks not durable');
    archive = full.value.session;
    if ((await accepted.completeSession(archive, fixtureTools.makeCompletedSet(archive, 'finished'))).durability !== 'durable') throw new Error('v6 Last set not durable');
    let active = snapshot('v6-resumable', [a, c]);
    active.answers[c.id] = fixtureTools.getCorrectAnswer(c);
    active.adaptive = { targetCount: 2, currentDifficulty: 'medium', rollingResults: [true, false], difficultyHistory: [{ questionId: a.id, difficulty: a.difficulty, correct: false }] };
    await accepted.saveActiveSession(active);
    const miss = await accepted.commitSubmission(active, a.id, fixtureTools.captureAttempt(active, a, { optionIds: [] }));
    if (miss.durability !== 'durable') throw new Error('v6 miss not durable');
    active = { ...miss.value.session, index: 1, phase: 'skipped-review', skippedQuestionIds: [c.id] };
    await accepted.saveActiveSession(active);
  }, questions);
  const before = await raw(p);
  assert.equal(before.version, 6); characterize(before);
  const a = before.stores.progress.values.find((r) => r.questionId === q1.id);
  const b = before.stores.progress.values.find((r) => r.questionId === q2.id);
  assert.equal(a.needsReview, true); assert.ok(a.correctStreak > 0);
  assert.equal(b.needsReview, false); assert.equal(b.missed, true); assert.equal(b.correctStreak, 0);
  assert.ok(before.stores.progress.values.find((r) => r.questionId === q3.id).migrationDiagnostic);
  assert.equal(before.stores.completedSets.values[0].sessionId, 'v6-last-set');
  assert.equal(before.stores.activeSession.values[0].id, 'v6-resumable');
  return { actualV5, diagnosticV5, before };
}
async function lastSetView(p, expected) {
  await p.locator('.last-set-entry').click();
  await p.getByRole('heading', { name: 'Your answers / 本次作答' }).waitFor();
  const score = expected.entries[0].attempt.score;
  assert.ok((await p.locator('.completed-set').innerText()).includes(`${score.earned} of ${score.possible} points`));
  await p.locator('.summary-review-toggle').click();
  await p.locator('.answer-banner').waitFor();
}
async function putArchive(p, archive) {
  await p.evaluate(async (archive) => {
    const db = await new Promise((resolve, reject) => { const r = indexedDB.open('nclex-bilingual-prep'); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
    const tx = db.transaction('completedSets', 'readwrite'); tx.objectStore('completedSets').put(archive);
    await new Promise((resolve, reject) => { tx.oncomplete = resolve; tx.onabort = () => reject(tx.error); }); db.close();
  }, archive);
}
let browserVersion;
try {
  const http = await launch('http-profile'); const p = http.pages()[0]; observe(p, 'http');
  browserVersion = http.browser().version();
  await p.goto(base + '/seed.html');
  const fixture = await makeV6(p, base + '/seed.html');
  save('genuine-v5-writer', fixture.actualV5); save('supplemental-diagnostic-v5', fixture.diagnosticV5); save('genuine-v6-before', fixture.before);
  pass('Actual v5 writer characterized; actual accepted v6 submissions create contradictory stale columns, diagnostic, Last set and active work', {
    historicalProgressKeyUnion: characterize(fixture.actualV5), v6ProgressKeyUnion: characterize(fixture.before),
    diagnosticSupplement: 'One actual v5 row lost correctStreak and its top-level event in a test-only native transaction; all other writer rows are unaltered.',
  });
  await observeUpgradeBeforeHydration(p);
  await p.goto(base);
  const migrated = await committedMigration(p); assertSubtraction(fixture.before, migrated); save('genuine-v7-after', migrated);
  const after = await raw(p); assertHydration(migrated, after);
  assert.equal(after.stores.progress.values.find((r) => r.questionId === q1.id).needsReview, true);
  assert.equal(after.stores.progress.values.find((r) => r.questionId === q2.id).needsReview, false);
  await p.screenshot({ path: join(out, 'http-v7-home.png') });
  pass('Chrome populated v6→v7 exact subtraction; all durable retained keys/values, store metadata, localStorage unchanged');
  await lastSetView(p, fixture.before.stores.completedSets.values[0]);
  assert.deepEqual(await raw(p), after);
  // A supplementary contrary historical outcome discriminates stored rendering from current grading.
  const contrary = structuredClone(after.stores.completedSets.values[0]);
  contrary.entries[0].attempt.result = false; contrary.entries[0].attempt.score.earned = 0;
  assert.equal(contrary.entries[0].attempt.answer.optionIds[0], q2.correct[0]);
  await putArchive(p, contrary); await p.reload(); await ready(p); await lastSetView(p, contrary);
  assert.ok((await p.locator('.completed-set').innerText()).includes('0 of 1 points'));
  await p.screenshot({ path: join(out, 'stored-outcome-control.png') });
  await putArchive(p, after.stores.completedSets.values[0]);
  pass('Existing Last set reopens read-only; supplementary correct-answer/zero-stored-points control renders stored historical outcome without regrading');
  // Old build against same committed v7 identity. Observe actual VersionError and fallback.
  const beforeOldBuild = await raw(p); assertHydration(after, beforeOldBuild);
  appRoot = join(v6, 'dist');
  await p.addInitScript(() => {
    window.__versionErrors = [];
    const open = IDBFactory.prototype.open;
    IDBFactory.prototype.open = function (...args) {
      const r = open.apply(this, args);
      r.addEventListener('error', () => window.__versionErrors.push({ requested: args[1], error: r.error?.name }));
      return r;
    };
  });
  await p.goto(base); await ready(p);
  await p.getByText(/Changes are available for this visit only/).waitFor();
  const oldErrors = await p.evaluate(() => window.__versionErrors);
  assert.ok(oldErrors.some((e) => e.requested === 6 && e.error === 'VersionError'));
  assert.deepEqual(await raw(p), beforeOldBuild);
  await p.screenshot({ path: join(out, 'v6-against-v7.png') });
  appRoot = join(root, 'dist'); await p.reload(); await ready(p); assertHydration(after, await raw(p));
  pass('Actual accepted v6 build receives VersionError and reports memory fallback; v7 and all learner data survive, v7 reopening recovers', { errors: oldErrors });
  await http.close(); contexts.delete(http);

  const direct = await launch('direct-profile'); const dp = direct.pages()[0]; observe(dp, 'direct');
  await dp.goto(base + '/seed.html'); const directBefore = await genuineV5(dp);
  await observeUpgradeBeforeHydration(dp); await dp.goto(base); const directAfter = await committedMigration(dp);
  assertSubtraction(directBefore, directAfter, migrateProgress);
  assert.equal(directAfter.stores.progress.values.find((r) => r.questionId === q1.id).needsReview, false);
  assert.equal(directAfter.stores.progress.values.find((r) => r.questionId === q2.id).needsReview, true);
  save('direct-v5-before', directBefore); save('direct-v7-after', directAfter);
  pass('Genuine direct v5→v7: accepted semantics plus before-minus-four-plus-completedSets formula; active work and retained stores exact');
  await direct.close(); contexts.delete(direct);

  const blocked = await launch('blocked-profile'); const holder = blocked.pages()[0]; observe(holder, 'holder');
  await holder.goto(base + '/seed.html'); const blockFixture = await makeV6(holder, base + '/seed.html');
  await holder.goto(base + '/seed.html');
  await holder.evaluate(async () => {
    window.__held = await new Promise((resolve) => { const r = indexedDB.open('nclex-bilingual-prep', 6); r.onsuccess = () => resolve(r.result); });
    window.__held.onversionchange = () => { window.__sawVersionChange = true; };
  });
  const bp = await blocked.newPage(); observe(bp, 'blocked');
  await bp.addInitScript(() => {
    window.__openTrace = [];
    const tracked = new WeakSet();
    const open = IDBFactory.prototype.open, close = IDBDatabase.prototype.close;
    IDBFactory.prototype.open = function (...args) {
      const r = open.apply(this, args);
      if (args[0] === 'nclex-bilingual-prep' && args[1] === 7) {
        const id = window.__openTrace.filter((e) => e.event === 'open').length;
        window.__openTrace.push({ event: 'open', id });
        for (const event of ['blocked', 'upgradeneeded', 'success', 'error']) r.addEventListener(event, () => {
          if (event === 'success') tracked.add(r.result);
          window.__openTrace.push({ event, id });
        });
      }
      return r;
    };
    IDBDatabase.prototype.close = function (...args) {
      if (tracked.has(this)) window.__openTrace.push({ event: 'close', version: this.version });
      return close.apply(this, args);
    };
  });
  await bp.goto(base); await bp.getByText(/Storage upgrade is blocked/).waitFor();
  assert.equal(await holder.evaluate(() => window.__sawVersionChange), true);
  // Read via the held connection: a new open request would queue behind the blocked upgrade.
  const heldState = await holder.evaluate(`(${nativeSnapshot.toString()})('nclex-bilingual-prep', window.__held)`);
  assert.deepEqual(heldState, blockFixture.before);
  await bp.screenshot({ path: join(out, 'blocked-upgrade.png') });
  await holder.evaluate(() => window.__held.close());
  // Do not reload: witness the already queued request finish and the accepted policy close its late handle.
  await bp.waitForFunction(() => window.__openTrace.some((e) => e.event === 'close'));
  const trace = await bp.evaluate(() => window.__openTrace);
  assert.ok(trace.find((e) => e.event === 'blocked')); assert.ok(trace.find((e) => e.event === 'success'));
  assert.ok(trace.findIndex((e) => e.event === 'success') < trace.findIndex((e) => e.event === 'close'));
  await bp.getByText(/Storage upgrade is blocked/).waitFor();
  const late = await raw(holder); assertHydration(expectedSubtraction(blockFixture.before), late);
  await bp.reload(); await ready(bp);
  assert.equal(await bp.getByText(/Storage upgrade is blocked/).count(), 0);
  assertHydration(late, await raw(bp));
  await bp.addScriptTag({ content: v7Code });
  assert.equal(await bp.evaluate(async () => (await current.saveQuestionFlag((await current.loadFlags())[Object.keys(await current.loadFlags())[0]])).durability), 'durable');
  assertHydration(late, await raw(bp));
  save('blocked-before', blockFixture.before); save('blocked-after-late-completion', late); save('blocked-trace', trace);
  pass('Real v7 blocked event, honest memory status, release without reload, queued success then close, reload and durable retry recover', { trace, note: 'The original blocked request closes on late success. A subsequently queued startup open may hydrate and refresh active.updatedAt; all other durable values remain exactly the cleanup result.' });
  await blocked.close(); contexts.delete(blocked);

  // Fixed absolute URL, profile and database identity for both actual production builds.
  const fileURL = pathToFileURL(join(live, 'index.html')).href;
  writeFileSync(join(live, 'index.html'), '<html><body>Isolated file fixture</body></html>');
  let files = await launch('file-profile'); let fp = files.pages()[0]; observe(fp, 'file');
  await fp.goto(fileURL); const fileFixture = await makeV6(fp, fileURL);
  cpSync(join(v6, 'dist'), live, { recursive: true });
  await fp.reload(); await ready(fp);
  const visibleV6 = await raw(fp); assertHydration(fileFixture.before, visibleV6);
  assert.equal(visibleV6.version, 6); assert.ok(visibleV6.stores.completedSets.values.length);
  await fp.screenshot({ path: join(out, 'file-v6-preflight.png') });
  cpSync(join(root, 'dist'), live, { recursive: true });
  await observeUpgradeBeforeHydration(fp); await fp.reload(); const fileAfter = await committedMigration(fp);
  assertSubtraction(visibleV6, fileAfter);
  await fp.screenshot({ path: join(out, 'file-v7-migrated.png') });
  await files.close(); contexts.delete(files);
  files = await launch('file-profile'); fp = files.pages()[0]; observe(fp, 'file-restart');
  await fp.goto(fileURL); await ready(fp); const restarted = await raw(fp); assertHydration(fileAfter, restarted);
  save('file-after-browser-restart', restarted);
  await lastSetView(fp, fileAfter.stores.completedSets.values[0]);
  assert.deepEqual(await raw(fp), restarted);
  await fp.screenshot({ path: join(out, 'file-restart-last-set.png') });
  await fp.reload(); await ready(fp); await button(fp, 'Continue set / 继续练习').click();
  await button(fp, 'Submit answer').waitFor();
  await fp.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find((b) => b.textContent === 'Submit answer');
    b.click(); b.click(); b.click();
  });
  await fp.locator('.answer-banner').waitFor();
  const postSubmit = await raw(fp);
  const diagnostic = postSubmit.stores.progress.values.find((r) => r.questionId === q3.id);
  assertCleanProgress(diagnostic, true);
  assert.equal(diagnostic.migrationDiagnostic, fileAfter.stores.progress.values.find((r) => r.questionId === q3.id).migrationDiagnostic);
  assert.equal(diagnostic.seen, fileAfter.stores.progress.values.find((r) => r.questionId === q3.id).seen + 1);
  assert.equal(postSubmit.stores.answerEvents.values.filter((e) => e.questionId === q3.id && e.sessionId === 'v6-resumable').length, 1);
  assert.deepEqual(postSubmit.stores.flags, fileAfter.stores.flags);
  save('file-v6-visible-before-artifact-swap', visibleV6); save('file-v7-after', fileAfter); save('file-post-submit', postSubmit);
  pass('Actual built file:// migration at fixed URL: v6 preflight visible, exact v7 subtraction, full browser restart preserves Last set/active/progress', { fileURL, profile: join(scratch, 'file-profile'), durableIndexedDB: true });
  pass('Resumed actual v6 work submits in v7 UI; triple submit gives one durable event, diagnostic row exactly seven retained keys, Saved unchanged', { durableProgressKeys: Object.keys(diagnostic).sort() });
  await button(fp, 'Finish').click();
  await fp.getByRole('heading', { name: 'Your answers / 本次作答' }).waitFor();
  const completed = await raw(fp);
  assert.equal(completed.stores.activeSession.values.length, 0);
  assert.equal(completed.stores.completedSets.values[0].sessionId, 'v6-resumable');
  await fp.screenshot({ path: join(out, 'file-completed.png') });
  // Exercise remediation through the accepted storage API and prove archive eligibility is unchanged.
  await fp.addScriptTag({ content: v7Code }); await fp.addScriptTag({ content: helperCode });
  await fp.evaluate(async (q) => {
    await current.loadActiveSession();
    const s = { id: 'post-v7-remediation', mode: 'study', questionIds: [q.id], poolIds: [q.id], index: 0,
      answers: {}, results: {}, scores: {}, attempts: {}, languageMode: 'on-tap', title: 'Remediation',
      startedAt: '2026-09-12T20:00:00Z', updatedAt: '2026-09-12T20:00:00Z', launchIntent: 'remediation', returnView: 'saved' };
    await current.saveActiveSession(s);
    const result = await current.commitSubmission(s, q.id, fixtureTools.captureAttempt(s, q, fixtureTools.getCorrectAnswer(q)));
    const retry = await current.commitSubmission(s, q.id, fixtureTools.captureAttempt(s, q, { optionIds: [] }));
    if (result.durability !== 'durable' || retry.durability !== 'durable') throw new Error('Remediation not durable');
    await current.completeSession(result.value.session, fixtureTools.makeCompletedSet(result.value.session, 'finished'));
  }, q1);
  const remediated = await raw(fp);
  assert.deepEqual(remediated.stores.completedSets, completed.stores.completedSets);
  assert.equal(remediated.stores.activeSession.values.length, 0);
  assert.deepEqual(remediated.stores.flags, completed.stores.flags);
  assert.equal(remediated.stores.progress.values.find((r) => r.questionId === q1.id).needsReview, false);
  assert.equal(remediated.stores.answerEvents.values.filter((e) => e.sessionId === 'post-v7-remediation').length, 1);
  pass('Post-migration completion archives then clears matching active; remediation and duplicate retry preserve Last set; Saved and Needs review independent');
  await files.close(); contexts.delete(files);
  assert.deepEqual(errors, []);
  save('browser-results', { status: 'PASS', browser: browserVersion, route: 'System Chrome via Playwright; dedicated persistent test profiles; no security-weakening flags',
    sources: { v5: { worktree: v5, head: revision(v5), storageSha256: sha(join(v5, 'src/storage.ts')) },
      v6: { worktree: v6, head: revision(v6), storageSha256: sha(join(v6, 'src/storage.ts')), builtIndexSha256: sha(join(v6, 'dist/index.html')) },
      v7: { worktree: root, headAtRun: revision(root), storageSha256: sha(join(root, 'src/storage.ts')), builtIndexSha256: sha(join(root, 'dist/index.html')) } },
    observation: 'Actual upgrade commits before native exact snapshot; only open-success delivery to app is held. On hydration/restart, accepted app refreshes active.updatedAt; verified separately with all other state exact.',
    base, fileURL, viewport: { width: 1280, height: 900 }, checks, pageErrors: errors, consoleErrors, profileDisposition: 'Temporary project-test profiles removed after completion' });
} catch (error) {
  save('browser-failure', { error: error.stack, checks, pageErrors: errors, consoleErrors, scratch });
  throw error;
} finally {
  for (const ctx of contexts) await ctx.close().catch(() => {});
  await new Promise((resolve) => server.close(resolve));
  rmSync(scratch, { recursive: true, force: true });
}
