/// <reference lib="dom" />
import 'fake-indexeddb/auto';
import assert from 'node:assert/strict';
import { openDB } from 'idb';
const db=await openDB('nclex-bilingual-prep',5,{upgrade(db){db.createObjectStore('progress',{keyPath:'questionId'});db.createObjectStore('answerEvents',{keyPath:'id'});}});
const row={questionId:'legacy',seen:2,correct:1,incorrect:1,correctStreak:1,missed:true};
await db.put('progress',row);db.close();
const update=IDBCursor.prototype.update;
IDBCursor.prototype.update=function(){throw new DOMException('Injected migration write failure','QuotaExceededError');};
const {loadProgress}=await import('../../src/storage');
assert.deepEqual(await loadProgress(),{});
const failed=await openDB('nclex-bilingual-prep');assert.equal(failed.version,5);assert.deepEqual(await failed.get('progress','legacy'),row);assert.equal(failed.objectStoreNames.contains('completedSets'),false);failed.close();
IDBCursor.prototype.update=update;
assert.equal((await loadProgress()).legacy.needsReview,false);
const retried=await openDB('nclex-bilingual-prep');assert.equal(retried.version,6);retried.close();
console.log('migration write failure: v5 transaction rolls back intact, then v6 retry succeeds without unhandled rejection');
