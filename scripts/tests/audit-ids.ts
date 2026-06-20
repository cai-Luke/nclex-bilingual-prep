import assert from "node:assert/strict";
import { findIdCollisions } from "../audit/audit-ids";
import type { BankEnvelope, Question, SchemaVersion, StandaloneQuestion } from "../../src/types";

const text = { en: "Fixture.", zh: "\u6d4b\u8bd5\u3002" };

const question = (id: string): StandaloneQuestion => ({
  id,
  itemType: "fill_in_blank",
  category: "Management of Care",
  topic: "fixture",
  difficulty: "medium",
  stem: text,
  blanks: [{ id: "b1", prompt: text, acceptable: ["1"] }],
  rationale: { correct: text },
  testTakingStrategy: text,
  glossary: [],
});

const caseStudy = (id: string, leafIds: [string, string]): Question => ({
  id,
  itemType: "case_study",
  category: "Management of Care",
  topic: "fixture",
  difficulty: "medium",
  stem: text,
  rationale: { correct: text },
  testTakingStrategy: text,
  glossary: [],
  caseStudy: {
    title: text,
    exhibits: [{ id: "ex1", title: text, content: text }],
    questions: leafIds.map(question),
  },
});

const bank = (questions: Question[], schemaVersion: SchemaVersion = "1.1"): BankEnvelope => ({
  meta: { schemaVersion, exam: "NCLEX-RN", topic: "fixture", count: questions.length },
  questions,
});

let collisions = findIdCollisions([
  { file: "a.json", bank: bank([question("dup")]) },
  { file: "b.json", bank: bank([question("dup")]) },
]);
assert.equal(collisions.length, 1);
assert.equal(collisions[0][0].id, "dup");

collisions = findIdCollisions([
  { file: "a.json", bank: bank([caseStudy("case_a", ["leaf_dup", "leaf_a"])]) },
  { file: "b.json", bank: bank([caseStudy("case_b", ["leaf_dup", "leaf_b"])]) },
]);
assert.equal(collisions.length, 1);
assert.equal(collisions[0][0].id, "leaf_dup");

collisions = findIdCollisions([
  { file: "a.json", bank: bank([question("cross_dup")]) },
  { file: "b.json", bank: bank([caseStudy("case_b", ["cross_dup", "leaf_b"])]) },
]);
assert.equal(collisions.length, 1);
assert.equal(collisions[0][0].id, "cross_dup");

collisions = findIdCollisions([
  { file: "a.json", bank: bank([question("a")]) },
  { file: "b.json", bank: bank([caseStudy("case_b", ["b1", "b2"])]) },
]);
assert.deepEqual(collisions, []);

console.log("audit-ids tests passed");
