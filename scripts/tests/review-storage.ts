/// <reference lib="dom" />
import "fake-indexeddb/auto";
import assert from "node:assert/strict";
import { openDB } from "idb";
import { readFileSync } from "node:fs";
import type { Question, StoredSessionSnapshot } from "../../src/types";
import { captureAttempt, makeCompletedSet, questionFingerprint } from "../../src/completedMemory";
import { getCorrectAnswer, getInitialAnswer } from "../../src/grading";
const old = await openDB("nclex-bilingual-prep", 5, {
  upgrade(db) {
    for (const [name, keyPath] of [
      ["progress", "questionId"],
      ["flags", "questionId"],
      ["activeSession", "id"],
      ["answerEvents", "id"],
      ["uploadedQuestions", "id"],
      ["flashcardProgress", "termId"],
      ["languageMisses", "questionId"],
      ["translationRevealEvents", "id"],
      ["caseAnswerPartEvents", "id"],
    ])
      db.createObjectStore(name, { keyPath });
  },
});
await old.put("progress", {
  questionId: "one-correct",
  seen: 2,
  correct: 1,
  incorrect: 1,
  correctStreak: 1,
  missed: true,
  srsDueAt: "legacy",
});
await old.put("flags", {
  questionId: "one-correct",
  flagged: false,
  note: "note retained",
  updatedAt: "yesterday",
});
old.close();
const store = await import("../../src/storage");
assert.equal((await store.loadProgress())["one-correct"].needsReview, false);
const native = await openDB("nclex-bilingual-prep");
assert.equal(native.version, 7);
assert.equal(native.objectStoreNames.contains("flashcardProgress"), false);
const { RETIRED_PROGRESS_KEYS } = await import("../../src/progressMigration");
for (const key of RETIRED_PROGRESS_KEYS)
  assert.equal(Object.hasOwn(await native.get("progress", "one-correct"), key), false);
assert.equal((await store.loadFlags())["one-correct"].flagged, false);
const bank = JSON.parse(readFileSync("banks/gemini-canonical.json", "utf8")).questions as Question[];
const q = bank.find((q) => q.itemType === "select_all" && q.correct.length > 1)!;
const snapshot = (
  id: string,
  question = q,
  intent: "ordinary" | "remediation" = "ordinary",
): StoredSessionSnapshot => ({
  id,
  mode: "study",
  questionIds: [question.id],
  poolIds: [question.id],
  index: 0,
  answers: {},
  results: {},
  scores: {},
  languageMode: "on-tap",
  startedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  title: id,
  launchIntent: intent,
  fingerprints: { [question.id]: questionFingerprint(question) },
});
let s = snapshot("partial");
await store.saveActiveSession(s);
await store.saveQuestionFlag({ questionId: q.id, flagged: true, note: "keep", updatedAt: "now" });
const partial = captureAttempt(s, q, { optionIds: q.itemType === "select_all" ? [q.correct[0]] : [] });
const results = await Promise.all(Array.from({ length: 5 }, () => store.commitSubmission(s, q.id, partial)));
assert.ok(results.every((r) => r.durability === "durable"));
assert.equal(
  (await store.loadAnswerEvents()).filter((e) => e.sessionId === s.id).length,
  1,
  "durable identity dedupes racing requests",
);
assert.equal((await store.loadProgress())[q.id].seen, 1);
assert.equal((await store.loadProgress())[q.id].needsReview, true);
assert.ok(partial.score.earned > 0 && partial.score.earned < partial.score.possible);
s = results[0].value.session;
assert.deepEqual(
  (await store.loadActiveSession())?.attempts?.[q.id].answer,
  partial.answer,
  "active answer captured atomically",
);
const archive = makeCompletedSet(s, "finished");
assert.equal((await store.completeSession(s, archive)).durability, "durable");
assert.equal(await store.loadActiveSession(), null);
assert.equal((await store.loadCompletedSet())?.sessionId, s.id);
await store.commitSubmission(s, q.id, partial);
assert.equal((await store.loadProgress())[q.id].seen, 1, "retry after completion cannot count again");
assert.equal(await native.count("activeSession"), 0, "retry cannot resurrect completed active");
s = snapshot("correct", q, "remediation");
await store.saveActiveSession(s);
const full = captureAttempt(s, q, getCorrectAnswer(q));
let committed = await store.commitSubmission(s, q.id, full);
assert.equal(committed.value.progress.needsReview, false);
assert.equal((await store.loadFlags())[q.id].flagged, true, "Saved independent of clearing");
await store.completeSession(committed.value.session, makeCompletedSet(committed.value.session, "finished"));
assert.equal((await store.loadCompletedSet())?.sessionId, "partial", "remediation cannot replace Last set");
const cq = bank.find((q) => q.itemType === "case_study")!;
s = snapshot("case-partial", cq);
await store.saveActiveSession(s);
const answer = getCorrectAnswer(cq);
if (cq.itemType === "case_study")
  answer.caseStudy![cq.caseStudy.questions[0].id] = getInitialAnswer(cq.caseStudy.questions[0]);
committed = await store.commitSubmission(s, cq.id, captureAttempt(s, cq, answer));
assert.equal(committed.value.progress.needsReview, true);
s = snapshot("case-full", cq, "remediation");
await store.saveActiveSession(s);
committed = await store.commitSubmission(s, cq.id, captureAttempt(s, cq, getCorrectAnswer(cq)));
assert.equal(committed.value.progress.needsReview, false, "whole-case clearing");
assert.ok(committed.value.attempt.parts);
// Force archive transaction abort after its put. The previous archive and active row survive together.
s = snapshot("archive-failure");
await store.saveActiveSession(s);
committed = await store.commitSubmission(s, q.id, captureAttempt(s, q, getCorrectAnswer(q)));
s = committed.value.session;
const completion = makeCompletedSet(s, "ended");
const put = IDBObjectStore.prototype.put;
IDBObjectStore.prototype.put = function (...args: Parameters<typeof put>) {
  const req = put.apply(this, args);
  if (this.name === "completedSets") this.transaction.abort();
  return req;
};
assert.equal((await store.completeSession(s, completion)).durability, "memory");
IDBObjectStore.prototype.put = put;
assert.equal(
  (await native.get("completedSets", "last")).sessionId,
  "partial",
  "failed archive keeps sole durable memory",
);
assert.ok(await native.get("activeSession", s.id), "failed archive keeps resumable record");
assert.equal((await store.completeSession(s, completion)).durability, "durable");
assert.equal(await native.count("activeSession"), 0);
assert.equal((await native.get("completedSets", "last")).sessionId, s.id);
// Denial uses the same identity rule, including concurrent calls that fail after await.
const idb = globalThis.indexedDB;
Object.defineProperty(globalThis, "indexedDB", { value: undefined, configurable: true });
s = snapshot("memory-only");
await store.saveActiveSession(s);
const before = (await store.loadProgress())[q.id].seen;
const memoryAttempt = captureAttempt(s, q, getCorrectAnswer(q));
await Promise.all(Array.from({ length: 5 }, () => store.commitSubmission(s, q.id, memoryAttempt)));
assert.equal((await store.loadProgress())[q.id].seen, before + 1);
assert.equal((await store.loadAnswerEvents()).filter((e) => e.sessionId === s.id).length, 1);
Object.defineProperty(globalThis, "indexedDB", { value: idb, configurable: true });
await store.saveActiveSession(s);
committed = await store.commitSubmission(s, q.id, memoryAttempt);
assert.equal(committed.durability, "durable");
assert.equal(committed.value.progress.seen, before + 1, "memory retry counts once durably");
console.log(
  "review storage: v5→v7, atomic duplicate events, partial/case transitions, Saved independence, archive abort/retry, denied storage passed",
);


// A failed/unobserved read cannot authorize destroying another durable active set.
const external = await openDB("nclex-bilingual-prep");
await external.clear("activeSession");
await external.put("activeSession", snapshot("unobserved-active"));
const refused = await store.saveActiveSession(snapshot("cannot-replace-unread"));
assert.equal(refused.durability, "memory");
assert.equal((await external.getAll("activeSession"))[0].id, "unobserved-active");
await external.clear("activeSession");
external.close();
console.log("review storage: unobserved durable active work is preserved");

for (const id of ["repeat-miss-1", "repeat-miss-2"]) {
  const current = snapshot(id);
  await store.saveActiveSession(current);
  const result = await store.commitSubmission(current,q.id,captureAttempt(current,q,{optionIds:[]}));
  assert.equal(result.value.progress.needsReview,true);
}
await store.saveQuestionFlag({questionId:q.id,flagged:false,note:"keep note",updatedAt:"now"});
const beforeSkip = (await store.loadProgress())[q.id];
const zero = snapshot("no-submission");await store.saveActiveSession(zero);
const previousArchive = (await native.get("completedSets","last")).sessionId;
await store.completeSession(zero,makeCompletedSet(zero,"ended"));
assert.equal((await native.get("completedSets","last")).sessionId,previousArchive);
assert.deepEqual((await store.loadProgress())[q.id],beforeSkip,'skip/draft/early end do not change Needs review');
const final = snapshot("clear-unsaved");await store.saveActiveSession(final);
const cleared = await store.commitSubmission(final,q.id,captureAttempt(final,q,getCorrectAnswer(q)));
assert.equal(cleared.value.progress.needsReview,false);assert.equal((await store.loadFlags())[q.id].flagged,false);assert.equal((await store.loadFlags())[q.id].note,"keep note");
console.log('review storage: repeated miss, skip/early end and unsaved full-marks transitions passed');
