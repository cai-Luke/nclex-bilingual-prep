import assert from "node:assert/strict";
import { validateBankObject } from "../../src/schema";

const validEmptyBank = {
  meta: {
    schemaVersion: "1.0",
    count: 0,
  },
  questions: [],
};

assert.equal(validateBankObject(validEmptyBank).ok, true);
assert.equal(validateBankObject([]).ok, true);

const staleCount = validateBankObject({
  ...validEmptyBank,
  meta: {
    ...validEmptyBank.meta,
    count: 1,
  },
});
assert.equal(staleCount.ok, false);
if (!staleCount.ok) {
  assert(staleCount.reasons.includes("meta.count 1 does not match questions.length 0"));
}

const invalidCount = validateBankObject({
  ...validEmptyBank,
  meta: {
    ...validEmptyBank.meta,
    count: 0.5,
  },
});
assert.equal(invalidCount.ok, false);
if (!invalidCount.ok) {
  assert(invalidCount.reasons.includes("meta.count must be a non-negative integer"));
}

console.log("bank schema tests passed");
