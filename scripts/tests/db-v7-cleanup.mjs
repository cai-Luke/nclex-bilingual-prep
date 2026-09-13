import 'fake-indexeddb/auto';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { openDB } from 'idb';
import { migrateProgress } from '../../src/progressMigration.ts';
import { captureAttempt, makeCompletedSet, questionFingerprint } from '../../src/completedMemory.ts';
import { getCorrectAnswer } from '../../src/grading.ts';
import { nativeSnapshot, characterize, assertSubtraction, assertCleanProgress, currentStores, retiredStores,
  RETIRED_PROGRESS_KEYS, databaseName } from './db-v7-structure.mjs';
const scenario = process.argv[2];
const evidence = (suffix, value) => {
  if (process.env.DB_V7_RESULTS) writeFileSync(join(dirname(process.env.DB_V7_RESULTS), `deterministic-${scenario}-${suffix}.json`), JSON.stringify(value, null, 2) + '\n');
};
if (!scenario) {
  const cases = ['all', 'some', 'none', 'direct', 'fresh', 'rollback-update', 'rollback-delete',
    'rollback-semantic', 'missing-current-store', 'unknown-store', 'unknown-property', 'negative-control', 'normal-write'];
  const results = cases.map((name) => {
    const r = spawnSync(process.execPath, ['--import', 'tsx', import.meta.filename, name], { encoding: 'utf8' });
    process.stdout.write(r.stdout); process.stderr.write(r.stderr);
    assert.equal(r.status, 0, name);
    return { name, status: 'PASS', output: r.stdout.trim() };
  });
  if (process.env.DB_V7_RESULTS) writeFileSync(process.env.DB_V7_RESULTS, JSON.stringify({ results }, null, 2) + '\n');
  process.exit(0);
}
const q = JSON.parse(readFileSync('banks/gemini-canonical.json')).questions.find((q) => q.itemType === 'multiple_choice');
const session = (id, intent = 'ordinary') => ({ id, mode: 'study', questionIds: [q.id], poolIds: [q.id], index: 0,
  answers: {}, results: {}, scores: {}, attempts: {}, fingerprints: { [q.id]: questionFingerprint(q) },
  languageMode: 'on-tap', title: id, startedAt: '2026-09-12T12:00:00Z', updatedAt: '2026-09-12T12:00:00Z',
  launchIntent: intent, returnView: 'home', phase: 'questions', skippedQuestionIds: [], requestedCount: 1 });
const active = session('active');
const oldVersion = ['direct', 'rollback-semantic'].includes(scenario) ? 5 : 6;
if (scenario !== 'fresh') {
  const included = scenario === 'none' ? [] : scenario === 'some' ? retiredStores.slice(0, 2) : retiredStores;
  const db = await openDB(databaseName, oldVersion, { upgrade(db) {
    for (const name of [...currentStores.filter((s) => (oldVersion >= 6 || s !== 'completedSets') && (scenario !== 'missing-current-store' || s !== 'flags')), ...included,
      ...(scenario === 'unknown-store' ? ['uncharacterized'] : [])]) {
      db.createObjectStore(name, { keyPath: name === 'flashcardProgress' ? 'termId' :
        ['progress', 'flags', 'languageMisses'].includes(name) ? 'questionId' : 'id' });
    }
  } });
  const legacy = Object.fromEntries(RETIRED_PROGRESS_KEYS.map((k, i) => [k, i]));
  Object.assign(legacy, { missed: true, correctStreak: 1 });
  for (const [id, fields, truth] of [[q.id, legacy, true], ['b-partial', { missed: true }, false], ['c-clean', {}, false]]) {
    await db.put('progress', { questionId: id, seen: 2, correct: 1, incorrect: 1,
      ...(oldVersion >= 6 ? { needsReview: truth } : {}), ...fields,
      ...(id === q.id ? { migrationDiagnostic: 'accepted diagnostic', lastSeenAt: '2026-09-12T12:00:00Z' } : {}),
      ...(scenario === 'unknown-property' && id === 'c-clean' ? { unknownMetadata: { preserve: true } } : {}) });
  }
  await db.put('activeSession', active);
  if (db.objectStoreNames.contains('flags')) {
  await db.put('flags', { questionId: q.id, flagged: true, note: 'Saved note', updatedAt: 'then' });
  await db.put('flags', { questionId: 'note-only', flagged: false, note: 'not Saved', updatedAt: 'then' });
  }
  await db.put('uploadedQuestions', { id: 'uploaded', sourceKind: 'uploaded', sourceLabel: 'fixture', question: { ...q, id: 'uploaded' } });
  await db.put('answerEvents', { id: 'ordinary-event', questionId: q.id, wasCorrect: false, answeredAt: '2026-09-12T12:00:00Z' });
  if (oldVersion >= 6) {
    const previous = session('previous');
    const attempt = captureAttempt(previous, q, getCorrectAnswer(q));
    await db.put('completedSets', makeCompletedSet({ ...previous, results: { [q.id]: attempt.result },
      scores: { [q.id]: attempt.score }, attempts: { [q.id]: attempt } }, 'finished'));
  }
  for (const name of included) await db.put(name, { id: name, questionId: name, termId: name, payload: { retainedUntilUpgrade: true } });
  db.close();
}
const before = scenario === 'fresh' ? null : await nativeSnapshot();
let successfulUpdates = 0, successfulDeletes = 0;
const update = IDBCursor.prototype.update;
const drop = IDBDatabase.prototype.deleteObjectStore;
if (scenario.startsWith('rollback')) {
  IDBCursor.prototype.update = function (...args) {
    if (scenario !== 'rollback-delete' && successfulUpdates >= 1) throw new Error('Injected after successful progress mutation');
    const req = update.apply(this, args);
    req.addEventListener('success', () => successfulUpdates++);
    return req;
  };
  IDBDatabase.prototype.deleteObjectStore = function (...args) {
    if (scenario === 'rollback-delete' && successfulDeletes >= 1) throw new Error('Injected after successful retired-store deletion');
    drop.apply(this, args); successfulDeletes++;
  };
}
if (scenario === 'negative-control') {
  // Deliberately broken, test-only upgrade: the timer lets a partial v7 commit.
  let lateError;
  const opened = await new Promise((resolve, reject) => {
    const r = indexedDB.open(databaseName, 7);
    r.onupgradeneeded = async () => {
      r.result.deleteObjectStore(retiredStores[0]);
      await new Promise((resolve) => setTimeout(resolve, 30));
      try { r.result.deleteObjectStore(retiredStores[1]); } catch (e) { lateError = e.name; }
    };
    r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error);
  });
  opened.close();
  await new Promise((resolve) => setTimeout(resolve, 50));
  const partial = await nativeSnapshot();
  assert.equal(partial.version, 7); assert.equal(lateError, 'InvalidStateError');
  assert.throws(() => assertSubtraction(before, partial), /Exact store subtraction/);
  evidence('rejected-partial', { before, partial, lateError, verifierRejected: true });
  console.log('PASS negative-control: committed partial v7 after foreign timer; native structural verifier rejects it');
  process.exit(0);
}
const store = await import('../../src/storage.ts');
let status;
store.subscribePersistence((s) => { status = s; });
await store.loadProgress();
if (scenario.startsWith('rollback') || scenario.startsWith('unknown') || scenario === 'missing-current-store') {
  assert.equal(status.durability, 'memory');
  const rolledBack = await nativeSnapshot();
  assert.deepEqual(rolledBack, before, 'Entire old-version database restored, including active, Last set and retired contents');
  evidence('rollback', { before, rolledBack, successfulUpdates, successfulDeletes, persistence: status });
  if (scenario.startsWith('unknown') || scenario === 'missing-current-store') {
    console.log(`PASS ${scenario}: abort, no uncharacterized data removed`);
    process.exit(0);
  }
  assert.ok(successfulUpdates >= 1);
  if (scenario === 'rollback-delete') assert.equal(successfulDeletes, 1);
  IDBCursor.prototype.update = update; IDBDatabase.prototype.deleteObjectStore = drop;
  await store.loadProgress(); assert.equal(status.durability, 'durable');
}
const after = await nativeSnapshot();
if (scenario.startsWith('rollback')) evidence('retry', after);
if (before) assertSubtraction(before, after, migrateProgress);
else { assert.equal(after.version, 7); assert.deepEqual(Object.keys(after.stores).sort(), [...currentStores].sort()); }
if (scenario === 'direct') {
  assert.equal(after.stores.progress.values.find((r) => r.questionId === q.id).needsReview, false);
  assert.ok(after.stores.progress.values.find((r) => r.questionId === 'b-partial').migrationDiagnostic);
}
if (scenario === 'normal-write') {
  await store.loadActiveSession();
  const attempt = captureAttempt(active, q, getCorrectAnswer(q));
  const results = await Promise.all(Array.from({ length: 5 }, () => store.commitSubmission(active, q.id, attempt)));
  assert.ok(results.every((r) => r.durability === 'durable'));
  const submitted = await nativeSnapshot();
  const row = submitted.stores.progress.values.find((r) => r.questionId === q.id);
  assertCleanProgress(row, true); assert.equal(row.migrationDiagnostic, 'accepted diagnostic');
  evidence('post-submission', submitted);
  assert.equal(row.seen, 3); assert.equal(row.needsReview, false);
  assert.equal(submitted.stores.answerEvents.values.filter((e) => e.sessionId === active.id).length, 1);
  assert.deepEqual(submitted.stores.flags, before.stores.flags);
  const s = results[0].value.session, completion = makeCompletedSet(s, 'finished');
  const put = IDBObjectStore.prototype.put;
  let archivePutSucceeded = false;
  IDBObjectStore.prototype.put = function (...args) {
    const r = put.apply(this, args);
    if (this.name === 'completedSets') r.addEventListener('success', () => {
      archivePutSucceeded = true; this.transaction.abort();
    });
    return r;
  };
  assert.equal((await store.completeSession(s, completion)).durability, 'memory');
  assert.ok(archivePutSucceeded); assert.deepEqual(await nativeSnapshot(), submitted);
  IDBObjectStore.prototype.put = put;
  assert.equal((await store.completeSession(s, completion)).durability, 'durable');
  let durable = await nativeSnapshot();
  assert.equal(durable.stores.activeSession.values.length, 0);
  assert.deepEqual(durable.stores.completedSets.values, [completion]);
  const remedy = session('remediation', 'remediation'); await store.saveActiveSession(remedy);
  const committed = await store.commitSubmission(remedy, q.id, captureAttempt(remedy, q, { optionIds: [] }));
  await store.completeSession(committed.value.session, makeCompletedSet(committed.value.session, 'finished'));
  assert.deepEqual((await nativeSnapshot()).stores.completedSets, durable.stores.completedSets);
  // Previously absent optionals are not invented by cleanup; normal submit adds its timestamp only.
  const plainQ = { ...q, id: 'c-clean' }, plain = { ...session('plain'), questionIds: ['c-clean'], poolIds: ['c-clean'] };
  await store.saveActiveSession(plain);
  await store.commitSubmission(plain, plainQ.id, captureAttempt(plain, plainQ, getCorrectAnswer(plainQ)));
  const plainRow = (await nativeSnapshot()).stores.progress.values.find((r) => r.questionId === plainQ.id);
  assertCleanProgress(plainRow); assert.equal(Object.hasOwn(plainRow, 'migrationDiagnostic'), false);
}
const stable = await nativeSnapshot();
// New module instances request v7 again; instrumentation proves no upgrade, write, or delete.
let upgrades = 0, writes = 0;
const create = IDBDatabase.prototype.createObjectStore, put = IDBObjectStore.prototype.put;
IDBDatabase.prototype.createObjectStore = function (...args) { upgrades++; return create.apply(this, args); };
IDBCursor.prototype.update = function (...args) { writes++; return update.apply(this, args); };
IDBObjectStore.prototype.put = function (...args) { writes++; return put.apply(this, args); };
for (let i = 0; i < 3; i++) {
  const reopened = await import(`../../src/storage.ts?reopen=${i}`);
  assert.notEqual(reopened.loadProgress, store.loadProgress, 'A fresh storage module performs each reopen');
  await reopened.loadProgress(); assert.deepEqual(await nativeSnapshot(), stable);
}
assert.equal(upgrades, 0); assert.equal(writes, 0);
console.log(`PASS ${scenario}: exact native state, ${successfulUpdates} pre-fault updates / ${successfulDeletes} pre-fault deletions, retry/repeated-open invariant`);
