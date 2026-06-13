import assert from "node:assert/strict";
import {
  findFirstSkippedQuestionIndex,
  findNextPendingQuestionIndex,
  findNextSkippedQuestionIndex,
} from "../../src/sessionNavigation";

const questionIds = ["q1", "q2", "q3", "q4"];

assert.equal(
  findNextPendingQuestionIndex(questionIds, 0, new Set(["q2"]), new Set(["q1", "q3"])),
  3,
  "main Study navigation must bypass answered and explicitly skipped questions",
);
assert.equal(
  findNextPendingQuestionIndex(questionIds, 1, new Set(["q2", "q4"]), new Set(["q3"])),
  -1,
  "main Study navigation must report exhaustion when only skipped questions remain",
);
assert.equal(
  findFirstSkippedQuestionIndex(questionIds, new Set(["q3", "q1"])),
  0,
  "skipped review must return to the earliest deferred question in session order",
);
assert.equal(
  findFirstSkippedQuestionIndex(questionIds, new Set()),
  -1,
  "skipped review must report an empty deferred set",
);
assert.equal(
  findNextSkippedQuestionIndex(questionIds, 2, new Set(["q1", "q3"])),
  0,
  "skipping again during deferred review must wrap to the next skipped question",
);
assert.equal(
  findNextSkippedQuestionIndex(questionIds, 2, new Set(["q3"])),
  -1,
  "the current deferred question must not select itself as the next question",
);

console.log("session navigation tests passed");
