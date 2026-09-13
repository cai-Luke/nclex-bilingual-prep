// Shared native/durable verifier. No application loader or memory fallback is used.
import assert from 'node:assert/strict';
import { RETIRED_PROGRESS_KEYS } from '../../src/progressMigration.ts';
export { RETIRED_PROGRESS_KEYS };
export const retiredStores = ['flashcardProgress', 'languageMisses', 'translationRevealEvents', 'caseAnswerPartEvents'];
export const currentStores = ['uploadedQuestions', 'progress', 'activeSession', 'flags', 'answerEvents', 'completedSets'];
export const retainedKeys = ['questionId', 'seen', 'correct', 'incorrect', 'needsReview', 'migrationDiagnostic', 'lastSeenAt'];
export const databaseName = 'nclex-bilingual-prep';
// Serializable as a page.evaluate function; uses the browser's native IndexedDB APIs.
export async function nativeSnapshot(name = 'nclex-bilingual-prep', connection) {
  const request = (r) => new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
  const db = connection ?? await request(indexedDB.open(name));
  try {
    const names = Array.from(db.objectStoreNames);
    const tx = db.transaction(names);
    const done = new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onabort = () => reject(tx.error);
    });
    const pairs = await Promise.all(names.map(async (name) => {
      const s = tx.objectStore(name);
      const [keys, values] = await Promise.all([request(s.getAllKeys()), request(s.getAll())]);
      return [name, { keyPath: s.keyPath, autoIncrement: s.autoIncrement,
        indexes: Array.from(s.indexNames).map((name) => {
          const i = s.index(name);
          return { name, keyPath: i.keyPath, unique: i.unique, multiEntry: i.multiEntry };
        }), keys, values }];
    }));
    await done;
    return { version: db.version, stores: Object.fromEntries(pairs),
      localStorage: typeof localStorage === 'undefined' ? {} :
        Object.fromEntries(Object.keys(localStorage).sort().map((k) => [k, localStorage.getItem(k)])) };
  } finally { if (!connection) db.close(); }
}
export function characterize(before) {
  const union = [...new Set(before.stores.progress.values.flatMap(Object.keys))].sort();
  assert.ok(Object.keys(before.stores).every((s) => [...currentStores, ...retiredStores].includes(s)), 'Unexpected historical store');
  assert.ok(union.every((k) => [...retainedKeys, ...RETIRED_PROGRESS_KEYS].includes(k)), 'Unexpected historical progress property');
  return union;
}
export function assertCleanProgress(row, exact = false) {
  for (const key of RETIRED_PROGRESS_KEYS) assert.equal(Object.hasOwn(row, key), false, `Retired property ${key}`);
  assert.ok(Object.keys(row).every((key) => retainedKeys.includes(key)));
  if (exact) assert.deepEqual(Object.keys(row).sort(), [...retainedKeys].sort());
}
export function expectedSubtraction(before, semanticMigration) {
  characterize(before);
  const expected = structuredClone(before);
  expected.version = 7;
  for (const name of retiredStores) delete expected.stores[name];
  if (before.version < 6) {
    assert.ok(semanticMigration, 'Direct-upgrade verifier requires accepted semantic migration');
    expected.stores.completedSets = { keyPath: 'id', autoIncrement: false, indexes: [], keys: [], values: [] };
  }
  expected.stores.progress.values = expected.stores.progress.values.map((original) => {
    const row = before.version < 6 ? semanticMigration(original, before.stores.answerEvents.values) : original;
    for (const key of RETIRED_PROGRESS_KEYS) delete row[key];
    return row;
  });
  return expected;
}
export function assertSubtraction(before, after, semanticMigration) {
  const expected = expectedSubtraction(before, semanticMigration);
  assert.deepEqual(Object.keys(after.stores).sort(), Object.keys(expected.stores).sort(), 'Exact store subtraction');
  assert.deepEqual(after, expected, 'Only authorized physical subtraction (plus accepted pre-v6 semantics)');
  after.stores.progress.values.forEach((row) => assertCleanProgress(row));
}
