import assert from "node:assert/strict";
import {
  createOrderedSessionPersistence,
  createSessionStartGuard,
  hasProtectedSession,
  type SessionStartStatus,
} from "../../src/sessionStartGuard";

const untouched = { answers: {}, results: {}, skippedQuestionIds: [] };
const draft = { ...untouched, answers: { q1: { optionIds: ["b"] } } };
const caseDraft = { ...untouched, answers: { case1: { caseStudy: { part2: { optionIds: ["b"] } } } } };
assert.equal(hasProtectedSession(null), false);
assert.equal(hasProtectedSession(untouched), false);
for (const session of [draft, caseDraft, { ...untouched, results: { q1: false } }, { ...untouched, skippedQuestionIds: ["q1"] }]) {
  assert.equal(hasProtectedSession(session), true);
  assert.equal(hasProtectedSession({ ...session, completed: true }), false);
}
const merelyChangedPreferences = { ...untouched, languageMode: "always", flags: { q1: true }, scores: { q1: { earned: 1, possible: 1 } }, startedAt: "2000-01-01" };
assert.equal(hasProtectedSession(merelyChangedPreferences), false, "preferences, age, flags and scores alone are not protected work");

const deferred = () => {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => { resolve = done; });
  return { promise, resolve };
};
const flush = () => new Promise<void>((resolve) => setImmediate(resolve));
const statuses: SessionStartStatus[] = [];
const errors: unknown[] = [];
const guard = createSessionStartGuard({ onStatusChange: status => statuses.push(status), onError: error => errors.push(error) });
let constructions = 0;
let draws = 0;
const intent = async () => { draws += 1; constructions += 1; };

assert.equal(guard.request(intent, null), true);
assert.equal(guard.status, "waiting-hydration");
assert.equal(guard.request(async () => { throw new Error("duplicate intent must not run"); }, null), false);
await flush();
assert.equal(draws, 0, "a hydration-delayed request must not draw or construct early");
guard.resolveHydration(caseDraft);
assert.equal(guard.status, "confirming");
assert.equal(constructions, 0);
assert.equal(guard.cancel(), true);
assert.equal(guard.status, "idle");
await guard.confirm();
assert.equal(draws, 0, "cancel must not call the sampler or session constructor");

assert.equal(guard.request(intent, draft), true, "a request immediately after cancel must work");
const confirmed = guard.confirm();
assert.equal(guard.request(intent, draft), false, "pending remains locked while execution finishes");
await Promise.all([confirmed, guard.confirm(), guard.confirm()]);
assert.equal(constructions, 1, "rapid confirmation must execute the held intent once");
assert.equal(guard.status, "idle");
assert.equal(guard.request(intent, untouched), true);
await flush();
assert.equal(constructions, 2, "an untouched session needs no confirmation");
assert.equal(guard.request(intent, { ...draft, completed: true }), true);
await flush();
assert.equal(constructions, 3, "completed sessions need no confirmation");
assert.equal(guard.request(intent, null), true);
await flush();
assert.equal(constructions, 4, "no-session launch needs no confirmation");
assert.equal(errors.length, 0);
assert.deepEqual(statuses.slice(0, 3), ["waiting-hydration", "confirming", "idle"]);

const emptyHydrationGuard = createSessionStartGuard({ onStatusChange: () => {}, onError: error => { throw error; } });
let emptyHydrationLaunches = 0;
emptyHydrationGuard.request(async () => { emptyHydrationLaunches += 1; }, null);
assert.equal(emptyHydrationLaunches, 0);
emptyHydrationGuard.resolveHydration(null);
emptyHydrationGuard.resolveHydration(null);
await flush();
assert.equal(emptyHydrationLaunches, 1, "empty hydration releases the held intent exactly once");

// Hold an older storage operation open, enqueue clear and replacement, then release
// each barrier. Final persisted identity and visibility are observed independently.
const olderSave = deferred();
const replacementSave = deferred();
const events: string[] = [];
let persisted: string | null = null;
let visible: string | null = "old";
const persistence = createOrderedSessionPersistence<string>({
  save: async id => {
    events.push(`begin:${id}`);
    if (id === "old") await olderSave.promise;
    if (id === "new") await replacementSave.promise;
    persisted = id;
    events.push(`end:${id}`);
  },
});
const oldWrite = persistence.save("old");
await flush();
const clear = persistence.run(async () => { persisted = null; events.push("clear"); });
const replacementGuard = createSessionStartGuard({ onStatusChange: () => {}, onError: error => { throw error; } });
replacementGuard.resolveHydration(draft);
replacementGuard.request(async () => {
  await persistence.save("new");
  visible = "new";
}, draft);
const replacing = replacementGuard.confirm();
await flush();
assert.deepEqual(events, ["begin:old"]);
assert.equal(visible, "old", "replacement must remain invisible behind the earlier storage operation");
assert.equal(replacementGuard.cancel(), false, "an authorized in-flight replacement cannot be cancelled halfway");
olderSave.resolve();
await Promise.all([oldWrite, clear]);
await flush();
assert.deepEqual(events, ["begin:old", "end:old", "clear", "begin:new"]);
assert.equal(visible, "old", "queue insertion alone must not expose a session before its own write completes");
replacementSave.resolve();
await replacing;
assert.equal(persisted, "new", "an earlier delayed save must not become the final active snapshot");
assert.equal(visible, "new");
assert.equal(replacementGuard.status, "idle");
assert.deepEqual(events, ["begin:old", "end:old", "clear", "begin:new", "end:new"]);

const failure = new Error("injected failure");
const recovery = createOrderedSessionPersistence<string>({
  save: async id => { if (id === "fail") throw failure; persisted = id; },
});
await assert.rejects(recovery.save("fail"), error => error === failure);
await recovery.save("recovered");
assert.equal(persisted, "recovered", "a failed operation must not poison the ordering lane");
const failedGuard = createSessionStartGuard({ onStatusChange: () => {}, onError: error => errors.push(error) });
failedGuard.resolveHydration(null);
failedGuard.request(async () => { throw failure; }, null);
await flush();
assert.equal(failedGuard.status, "idle");
assert.deepEqual(errors, [failure]);
assert.equal(failedGuard.request(intent, null), true, "a failed launch must release pending intent");
await flush();

console.log("session start guard tests passed: protected work, deferred intents, hydration, duplicates, cancellation, ordered persistence and failure recovery");
