import assert from "node:assert/strict";
import {
  advanceFlashcardPass,
  createFlashcardPass,
  currentFlashcardId,
  flashcardPassKey,
  isFlashcardPassComplete,
  reconcileFlashcardPass,
  type FlashcardPassFilters,
} from "../../src/flashcardPass";

const now = new Date("2026-09-11T12:00:00Z");
const future = "2026-09-11T12:20:00Z";
const deck = [
  { id: "a", categories: ["one"], topics: ["alpha"] },
  { id: "b", categories: ["one", "two"], topics: ["beta"] },
  { id: "c", categories: ["two"], topics: ["alpha"] },
];
const filters: FlashcardPassFilters = { scope: "all", category: "all", topic: "all", readyNow: true, rescueIds: new Set(["a", "b"]) };
let shuffles = 0;
const shuffle = (ids: string[]) => { shuffles += 1; return [...ids].reverse(); };
const inputs = { deck, progress: {}, filters, shuffle, now };

const one = createFlashcardPass({ ...inputs, deck: deck.slice(0, 1) });
assert.equal(currentFlashcardId(one), "a");
assert.equal(isFlashcardPassComplete(one), false);
const oneComplete = advanceFlashcardPass(one);
assert.equal(oneComplete.passIndex, 1);
assert.equal(isFlashcardPassComplete(oneComplete), true);
assert.equal(currentFlashcardId(oneComplete), undefined);
assert.equal(advanceFlashcardPass(oneComplete), oneComplete, "completion must not wrap or continue advancing");

let pass = createFlashcardPass(inputs);
const frozenIds = pass.passCardIds;
assert.deepEqual(frozenIds, ["c", "b", "a"]);
assert.equal(Object.isFrozen(frozenIds), true);
const reviewed: Array<{ id: string; remembered: boolean }> = [];
const progress: Record<string, { srsDueAt?: string }> = {};
const shufflesAtStart = shuffles;
for (const remembered of [false, true, true]) {
  const id = currentFlashcardId(pass)!;
  reviewed.push({ id, remembered });
  progress[id] = { srsDueAt: future };
  const afterWrite = reconcileFlashcardPass(pass, { ...inputs, progress });
  assert.equal(afterWrite, pass, "a progress write cannot rebuild the pass");
  pass = advanceFlashcardPass(afterWrite);
  assert.equal(pass.passCardIds, frozenIds, "Again and Got it both advance without changing membership or order");
}
assert.deepEqual(reviewed.map(review => review.id), ["c", "b", "a"]);
assert.equal(new Set(reviewed.map(review => review.id)).size, 3);
assert.equal(isFlashcardPassComplete(pass), true);
assert.equal(currentFlashcardId(pass), undefined);
assert.equal(shuffles, shufflesAtStart, "progress writes and grading never reshuffle");

const allWithNewRescue = { ...filters, rescueIds: new Set(["c"]) };
assert.equal(flashcardPassKey(allWithNewRescue), flashcardPassKey(filters));
assert.equal(reconcileFlashcardPass(pass, { ...inputs, filters: allWithNewRescue }), pass, "Rescue churn cannot restart All");
const changedCatalog = [...deck.map(card => ({ ...card, termEn: "updated content" })), { id: "d", categories: ["one"], topics: ["alpha"] }];
assert.equal(reconcileFlashcardPass(pass, { ...inputs, deck: changedCatalog }), pass, "live catalog content/availability cannot replace frozen identity");

for (const [change, expected] of [
  [{ category: "one" }, ["b", "a"]],
  [{ topic: "alpha" }, ["c", "a"]],
  [{ scope: "rescue" as const }, ["b", "a"]],
  [{ readyNow: false }, ["c", "b", "a"]],
] as const) {
  const before = shuffles;
  const next = reconcileFlashcardPass(pass, { ...inputs, filters: { ...filters, ...change } });
  assert.notEqual(next, pass);
  assert.equal(next.passIndex, 0);
  assert.deepEqual(next.passCardIds, expected);
  assert.equal(shuffles, before + 1, "one deliberate key change shuffles once");
  assert.equal(reconcileFlashcardPass(next, { ...inputs, filters: { ...filters, ...change }, progress }), next);
  assert.equal(shuffles, before + 1, "repeated reconciliation, including StrictMode effect replay, cannot reshuffle");
}

const rescueFilters: FlashcardPassFilters = { ...filters, scope: "rescue" };
assert.equal(flashcardPassKey(rescueFilters), flashcardPassKey({ ...rescueFilters, rescueIds: new Set(["b", "a"]) }), "membership identity ignores set iteration order");
const rescuePass = createFlashcardPass({ ...inputs, filters: rescueFilters });
const changedRescue = reconcileFlashcardPass(rescuePass, { ...inputs, filters: { ...rescueFilters, rescueIds: new Set(["c"]) } });
assert.deepEqual(changedRescue.passCardIds, ["c"]);
assert.equal(changedRescue.passIndex, 0);

const restarted = createFlashcardPass({ ...inputs, progress });
assert.deepEqual(restarted.passCardIds, [], "explicit restart must re-evaluate the now-not-due cards");
assert.equal(isFlashcardPassComplete(restarted), false, "an empty new pass is not completed work");
assert.equal(currentFlashcardId(restarted), undefined);
assert.equal(reconcileFlashcardPass(pass, { ...inputs, progress }), pass, "completed panel remains until an explicit change or restart");
const ignoreDue = createFlashcardPass({ ...inputs, progress, filters: { ...filters, readyNow: false } });
assert.deepEqual(ignoreDue.passCardIds, ["c", "b", "a"]);
assert.deepEqual(createFlashcardPass({ ...inputs, progress, now: new Date(future) }).passCardIds, ["c", "b", "a"], "future passes follow the existing due predicate");
for (const emptyInputs of [
  { ...inputs, deck: [] },
  { ...inputs, filters: { ...rescueFilters, rescueIds: new Set<string>() } },
  { ...inputs, filters: { ...rescueFilters, topic: "nonmatching" } },
]) {
  const empty = createFlashcardPass(emptyInputs);
  assert.equal(currentFlashcardId(empty), undefined);
  assert.equal(isFlashcardPassComplete(empty), false);
  assert.equal(advanceFlashcardPass(empty), empty);
}
assert.deepEqual(reconcileFlashcardPass(null, { ...inputs, progress }).passCardIds, [], "fresh view entry creates a new pass from current eligibility");

console.log("flashcard pass tests passed: finite completion, frozen IDs/order, exact keys, progress isolation, restart eligibility and empty states");
