import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { findIdCollisions, runAuditIds } from "../audit/audit-ids";
import type { BankEnvelope, Question, SchemaVersion, StandaloneQuestion } from "../../src/types";
import {
  createAuditScopeFixtures,
  makeBank,
  makeQuestion,
  withUnreadableFile,
} from "../test-utils/audit-scope-fixtures";

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

const fixture = await createAuditScopeFixtures();
try {
  let result = await runAuditIds({ candidates: [fixture.validA], comparison: [] });
  assert.equal(result.status, "PASS");

  result = await runAuditIds({ candidates: [fixture.validA, fixture.validB], comparison: [] });
  assert.equal(result.status, "PASS");
  assert.match(result.detail, /2 explicitly selected candidate file/);

  for (const path of [fixture.missing, fixture.malformed, fixture.schemaInvalid]) {
    result = await runAuditIds({ candidates: [path], comparison: [] });
    assert.equal(result.status, "FAIL");
    assert.match(result.detail, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  result = await runAuditIds({ candidates: [fixture.validA], comparison: [fixture.missing] });
  assert.equal(result.status, "FAIL", "comparison load problems must fail loud");
  assert.match(result.detail, new RegExp(fixture.missing.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  result = await runAuditIds({
    candidates: [fixture.validA],
    comparison: [fixture.aliasForValidA],
  });
  assert.equal(result.status, "PASS");
  assert.match(result.detail, /0 comparison file/);

  result = await runAuditIds({
    candidates: [fixture.validA, fixture.aliasForValidA],
    comparison: [],
  });
  assert.equal(result.status, "PASS");
  assert.match(result.detail, /1 explicitly selected candidate file/);

  assert.equal((await runAuditIds({ candidates: [] })).status, "FAIL");
  assert.equal((await runAuditIds({ comparison: [] })).status, "FAIL");

  const candidateOne = join(fixture.directory, "candidate-one.json");
  const candidateTwo = join(fixture.directory, "candidate-two.json");
  const comparisonOne = join(fixture.directory, "comparison-one.json");
  const comparisonTwo = join(fixture.directory, "comparison-two.json");
  await Promise.all([
    writeFile(candidateOne, JSON.stringify(makeBank(makeQuestion("candidate_dup")))),
    writeFile(candidateTwo, JSON.stringify(makeBank(makeQuestion("candidate_dup")))),
    writeFile(comparisonOne, JSON.stringify(makeBank(makeQuestion("comparison_dup")))),
    writeFile(comparisonTwo, JSON.stringify(makeBank(makeQuestion("comparison_dup")))),
  ]);

  result = await runAuditIds({ candidates: [candidateOne, candidateTwo], comparison: [] });
  assert.equal(result.status, "FAIL");
  assert.match(result.detail, new RegExp(candidateOne.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(result.detail, new RegExp(candidateTwo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  await writeFile(comparisonOne, JSON.stringify(makeBank(makeQuestion("candidate_dup"))));
  result = await runAuditIds({ candidates: [candidateOne], comparison: [comparisonOne] });
  assert.equal(result.status, "FAIL");
  assert.match(result.detail, /questions\.0 \(top_level_scored_leaf\)/);
  assert.match(result.detail, new RegExp(candidateOne.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(result.detail, new RegExp(comparisonOne.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  await Promise.all([
    writeFile(comparisonOne, JSON.stringify(makeBank(makeQuestion("comparison_only_dup")))),
    writeFile(comparisonTwo, JSON.stringify(makeBank(makeQuestion("comparison_only_dup")))),
  ]);
  result = await runAuditIds({
    candidates: [fixture.validA],
    comparison: [comparisonOne, comparisonTwo],
  });
  assert.equal(result.status, "PASS", "comparison-only collisions must not poison the candidate verdict");
  assert.doesNotMatch(result.detail, /comparison_only_dup/);

  const embeddedCandidate = join(fixture.directory, "embedded-candidate.json");
  const embeddedComparison = join(fixture.directory, "embedded-comparison.json");
  const embeddedCase = {
    id: "case_parent",
    itemType: "case_study",
    category: "Pharmacological and Parenteral Therapies",
    topic: "IV Fluid Calculations",
    difficulty: "medium",
    stem: text,
    rationale: { correct: text },
    testTakingStrategy: text,
    glossary: [],
    caseStudy: {
      title: text,
      exhibits: [{ id: "ex1", title: text, content: text }],
      questions: [makeQuestion("embedded_dup"), makeQuestion("embedded_unique")],
    },
  } as Question;
  await Promise.all([
    writeFile(embeddedCandidate, JSON.stringify(makeBank(embeddedCase))),
    writeFile(embeddedComparison, JSON.stringify(makeBank(makeQuestion("embedded_dup")))),
  ]);
  result = await runAuditIds({
    candidates: [embeddedCandidate],
    comparison: [embeddedComparison],
  });
  assert.equal(result.status, "FAIL");
  assert.match(result.detail, /questions\.0\.caseStudy\.questions\.0 \(case case_parent > embedded_dup\)/);

  const unreadable = await withUnreadableFile(
    fixture.unreadable,
    () => runAuditIds({ candidates: [fixture.unreadable], comparison: [] }),
  );
  if (unreadable.unreadableWasEnforced) assert.equal(unreadable.value.status, "FAIL");
} finally {
  await fixture.cleanup();
}

console.log("audit-ids tests passed");
