import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { runAuditReferences } from "../audit/audit-references";
import { runWidenedReferences } from "../audit/audit-references-widened";
import type { CaseStudyQuestion, DropdownClozeQuestion, Question } from "../../src/types";
import {
  createAuditScopeFixtures,
  makeBank,
  makeQuestion,
  withUnreadableFile,
} from "../test-utils/audit-scope-fixtures";

const fixture = await createAuditScopeFixtures();
try {
  let result = await runAuditReferences({ files: [fixture.validA] });
  assert.equal(result.status, "PASS");

  result = await runAuditReferences({ files: [fixture.validA, fixture.validB] });
  assert.equal(result.status, "PASS");

  for (const path of [fixture.missing, fixture.malformed, fixture.schemaInvalid]) {
    result = await runAuditReferences({ files: [path] });
    assert.equal(result.status, "FAIL");
    assert.match(result.detail, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  result = await runAuditReferences({ files: [fixture.validA, fixture.aliasForValidA] });
  assert.equal(result.status, "PASS");
  assert.equal((await runAuditReferences({ files: [] })).status, "FAIL");

  const findingPath = join(fixture.directory, "reference-finding.json");
  await writeFile(
    findingPath,
    JSON.stringify(makeBank(makeQuestion("reference_finding", { rationale: "Option B is correct." }))),
  );
  result = await runAuditReferences({ files: [findingPath] });
  assert.equal(result.status, "FAIL");
  assert.match(result.detail, new RegExp(`${findingPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}: reference_finding:`));

  const unreadable = await withUnreadableFile(
    fixture.unreadable,
    () => runAuditReferences({ files: [fixture.unreadable] }),
  );
  if (unreadable.unreadableWasEnforced) assert.equal(unreadable.value.status, "FAIL");
} finally {
  await fixture.cleanup();
}

console.log("audit-references tests passed");

function makeWidenedQuestion(...args: Parameters<typeof makeQuestion>) {
  const question = makeQuestion(...args);
  for (const choice of question.rationale.byChoice ?? []) choice.en = "Reason for this response.";
  return question;
}

const widenedFixture = await createAuditScopeFixtures();
try {
  const file = join(widenedFixture.directory, "widened.json");
  const noHeldOutIds = new Set<string>();
  async function scan(question: Question, heldOutIds = noHeldOutIds) {
    await writeFile(file, JSON.stringify(makeBank(question)));
    const old = await runAuditReferences({ files: [file] });
    const widened = await runWidenedReferences([file], heldOutIds);
    assert.deepEqual(widened.loadFailures, [], question.id);
    return { old, widened };
  }

  const positive: Array<{ question: Question; field: string; token: string; rule?: string }> = [];
  for (const [id, locale, prose, token] of [
    ["letter-e", "en", "😀 Consider (E).", "E"],
    ["letter-f", "en", "Consider Option F.", "F"],
    ["wide-parens", "zh", "请考虑（C）。", "C"],
    ["zh-option-e", "zh", "请考虑选项E。", "E"],
    ["wide-latin", "en", "Consider (Ｃ).", "Ｃ"],
    ["mixed-left", "en", "Consider （C).", "C"],
    ["mixed-right", "zh", "请考虑(C）。", "C"],
  ] as const) {
    const question = makeWidenedQuestion(id);
    question.rationale.correct[locale] = prose;
    positive.push({ question, field: `rationale.correct.${locale}`, token });
  }
  for (const [locale, prose, token] of [["en", "Option F.", "F"], ["zh", "选项E。", "E"]] as const) {
    const question = makeWidenedQuestion(`strategy-${locale}`);
    question.testTakingStrategy[locale] = prose;
    positive.push({ question, field: `testTakingStrategy.${locale}`, token });
  }

  const { options: _options, correct: _correct, ...common } = makeWidenedQuestion("reference_case");
  const container: CaseStudyQuestion = {
    ...common,
    itemType: "case_study",
    caseStudy: {
      title: { en: "Example case", zh: "示例病例" },
      exhibits: [{ id: "notes", title: { en: "Notes", zh: "记录" }, content: { en: "Notes.", zh: "记录。" } }],
      questions: [makeWidenedQuestion("reference_case_part_1"), makeWidenedQuestion("reference_case_part_2")],
    },
    rationale: { correct: { en: "Review (A).", zh: "回顾。" } },
  };
  positive.push({ question: container, field: "rationale.correct.en", token: "A" });

  const nested = structuredClone(container);
  nested.rationale.correct.en = "Review progress.";
  nested.caseStudy.questions[0].rationale.byChoice![0].zh = "请考虑（Ｆ）。";
  positive.push({ question: nested, field: "caseStudy.questions[0].rationale.byChoice[0].zh", token: "Ｆ" });

  const captioned = makeWidenedQuestion("caption");
  captioned.rationale.visuals = [{ kind: "rhythm_strip", rhythm: "sinus", rateBpm: 75, caption: { en: "See (C)." } }];
  positive.push({ question: captioned, field: "rationale.visuals[0].caption.en", token: "C" });

  const stored = makeWidenedQuestion("stored-id");
  stored.options[0].id = stored.correct[0] = stored.rationale.byChoice![0].refId = "step+2";
  stored.rationale.correct.en = "Option step+2 is correct.";
  positive.push({ question: stored, field: "rationale.correct.en", token: "step+2", rule: "STORED_ID" });

  const assertion = makeWidenedQuestion("width-key");
  assertion.options[0].id = assertion.correct[0] = assertion.rationale.byChoice![0].refId = "Ｂ";
  assertion.rationale.correct.en = "Option Ｂ is correct.";
  positive.push({ question: assertion, field: "rationale.correct.en", token: "Ｂ" });

  for (const { question, field, token, rule = "DISPLAY_LETTER" } of positive) {
    const { old, widened } = await scan(question);
    assert.equal(old.status, "PASS", question.id);
    assert.equal(widened.status, "FAIL", question.id);
    assert.equal(widened.occurrences.length, 1, question.id);
    const [hit] = widened.occurrences;
    assert.equal(hit.field, field, question.id);
    assert.equal(hit.matchedToken, token, question.id);
    assert.ok(hit.rules.some((value) => value === rule), question.id);
    if (question.id === "letter-e") assert.deepEqual([hit.start, hit.end], [13, 14]);
    if (question.id === "width-key") assert.deepEqual(hit.assertedKey, { DISPLAY_LETTER: "MISMATCH", STORED_ID: "MATCH" });
    if (question.id === "stored-id") assert.deepEqual(hit.assertedKey, { STORED_ID: "MATCH" });
  }

  const negatives = [
    makeWidenedQuestion("legal-citation", { rationale: "Read 42 CFR 482.13(c)(5)." }),
    makeWidenedQuestion("measurement"),
    makeWidenedQuestion("unbound-id", { rationale: "Consider option step+2." }),
  ];
  negatives[0].options[0].id = negatives[0].correct[0] = negatives[0].rationale.byChoice![0].refId = "c";
  negatives[0].options[1].id = negatives[0].rationale.byChoice![1].refId = "5";
  negatives[1].rationale.correct.zh = "保持在指定水平以上，并在另一指标以下。";
  for (const question of negatives) {
    const { old, widened } = await scan(question);
    assert.equal(old.status, "PASS", question.id);
    assert.equal(widened.status, "PASS", question.id);
  }

  const legacy = makeWidenedQuestion("legacy", { rationale: "Option A is correct. Consider (A), (A), and the option listed below." });
  const legacyResult = await scan(legacy);
  assert.equal(legacyResult.old.status, "FAIL");
  assert.equal(legacyResult.widened.status, "FAIL");
  assert.deepEqual(legacyResult.widened.occurrences.map(({ matchedToken, rules }) => [matchedToken, rules]), [
    ["A", ["DISPLAY_LETTER", "STORED_ID"]],
    ["A", ["DISPLAY_LETTER", "STORED_ID"]],
    ["A", ["DISPLAY_LETTER", "STORED_ID"]],
    ["option listed below", ["POSITIONAL_CUE"]],
  ]);
  const boundary = await scan(makeWidenedQuestion("legacy-boundary", { rationale: "ＺOption A." }));
  assert.equal(boundary.old.status, "FAIL");
  assert.equal(boundary.widened.occurrences.length, 1);

  const list = makeWidenedQuestion("option-list", { rationale: "Compare options E and F." });
  list.rationale.correct.zh = "对比选项Ｅ、Ｆ。";
  const listResult = await scan(list);
  assert.equal(listResult.old.status, "PASS");
  assert.equal(listResult.widened.status, "FAIL");
  assert.deepEqual(listResult.widened.occurrences.map(({ matchedToken }) => matchedToken), ["E", "F", "Ｅ", "Ｆ"]);

  const internal = makeWidenedQuestion("internal-token");
  internal.options[0].id = internal.correct[0] = internal.rationale.byChoice![0].refId = "o2";
  internal.rationale.correct.en = "Compare o2 with the other responses.";
  internal.rationale.correct.zh = "请核对ｏ２的内容。";
  internal.testTakingStrategy.en = "The dropdown 1 wording is outside a cloze item.";

  const cloze: DropdownClozeQuestion = {
    ...common,
    id: "top-level-cloze",
    itemType: "dropdown_cloze",
    clozeStem: { en: "Complete {{slot}}.", zh: "填写{{slot}}。" },
    dropdowns: [{ id: "slot", options: [{ id: "o2", en: "Example", zh: "示例" }], correct: "o2" }],
    rationale: { correct: { en: "Check (o2 for dropdown 1).", zh: "核对（下拉菜单１的o2）。" } },
  };
  const clozeCase: CaseStudyQuestion = {
    ...container,
    rationale: { correct: { en: "Review progress.", zh: "回顾。" } },
    caseStudy: {
      ...container.caseStudy,
      questions: [{
        ...cloze,
        id: "embedded-cloze",
        rationale: {
          correct: { en: "Review Dropdown 2.", zh: "核对下拉框２，第三个下拉菜单和第六个下拉框。" },
          byChoice: [{ refId: "slot", en: "Check o2.", zh: "核对o2。" }],
        },
      }, makeWidenedQuestion("cloze-sibling")],
    },
  };
  for (const [question, expected] of [
    [internal, [
      ["rationale.correct.en", "o2", "INTERNAL_TOKEN"],
      ["rationale.correct.zh", "ｏ２", "INTERNAL_TOKEN"],
    ]],
    [cloze, [
      ["rationale.correct.en", "o2", "INTERNAL_TOKEN"],
      ["rationale.correct.en", "dropdown 1", "DROPDOWN_INDEX"],
      ["rationale.correct.zh", "下拉菜单１", "DROPDOWN_INDEX"],
      ["rationale.correct.zh", "o2", "INTERNAL_TOKEN"],
    ]],
    [clozeCase, [
      ["caseStudy.questions[0].rationale.correct.en", "Dropdown 2", "DROPDOWN_INDEX"],
      ["caseStudy.questions[0].rationale.correct.zh", "下拉框２", "DROPDOWN_INDEX"],
      ["caseStudy.questions[0].rationale.correct.zh", "第三个下拉菜单", "DROPDOWN_INDEX"],
      ["caseStudy.questions[0].rationale.correct.zh", "第六个下拉框", "DROPDOWN_INDEX"],
      ["caseStudy.questions[0].rationale.byChoice[0].en", "o2", "INTERNAL_TOKEN"],
      ["caseStudy.questions[0].rationale.byChoice[0].zh", "o2", "INTERNAL_TOKEN"],
    ]],
  ] as const) {
    const { old, widened } = await scan(question);
    assert.equal(old.status, "PASS", question.id);
    assert.equal(widened.status, "FAIL", question.id);
    assert.deepEqual(widened.occurrences.map(({ field, matchedToken, rules }) =>
      [field, matchedToken, ...rules]), expected, question.id);
    for (const hit of widened.occurrences) {
      assert.equal(hit.classification, "OPTION_REFERENCE");
      assert.equal(hit.excerpt?.slice(hit.start, hit.end), hit.matchedToken);
      if (question === clozeCase) assert.equal(hit.nestedId, "embedded-cloze");
    }
  }
  const repeatedRule = structuredClone(cloze);
  repeatedRule.rationale.correct = { en: "Review (o2).", zh: "回顾（ｏ２）。" };
  const repeatedResult = await scan(repeatedRule);
  assert.equal(repeatedResult.old.status, "PASS");
  assert.equal(repeatedResult.widened.status, "FAIL");
  assert.deepEqual(repeatedResult.widened.occurrences.map(({ rules }) => rules),
    [["STORED_ID", "INTERNAL_TOKEN"], ["STORED_ID", "INTERNAL_TOKEN"]]);

  const unboundInternal = makeWidenedQuestion("unbound-internal-token", { rationale: "Check O2 saturation and o2." });
  unboundInternal.rationale.correct.zh = "核对ｏ２与氧饱和度。";
  const internalCaseSensitive = structuredClone(internal);
  internalCaseSensitive.rationale.correct = { en: "Check O2 saturation and xo2.", zh: "核对Ｏ２和o2x。" };
  for (const question of [unboundInternal, internalCaseSensitive]) {
    const { old, widened } = await scan(question);
    assert.equal(old.status, "PASS", question.id);
    assert.equal(widened.status, "PASS", question.id);
  }
  console.log("B-1 null: 4 old PASS / widened FAIL; 2 old PASS / widened PASS");

  // Containment binds at parent level, including both sibling parts and the container.
  const protectedCase = structuredClone(nested);
  protectedCase.rationale.correct.en = "Consider (E).";
  protectedCase.caseStudy.questions[1].testTakingStrategy.en = "Option A is correct.";
  const redacted = await scan(protectedCase, new Set([protectedCase.id]));
  assert.equal(redacted.widened.occurrences.length, 3);
  assert.ok(redacted.widened.occurrences.every((hit) =>
    hit.containment === "HELD_OUT_REDACTED" && !("excerpt" in hit) && !("assertedKey" in hit)));
  assert.equal(redacted.widened.occurrences[1].nestedId, "reference_case_part_1");
  assert.equal(redacted.widened.occurrences[2].nestedId, "reference_case_part_2");

  const long = makeWidenedQuestion("long-excerpt");
  long.testTakingStrategy.en = `Start ${"word ".repeat(20)}(E) ${"more ".repeat(20)}end.`;
  const bounded = (await scan(long)).widened.occurrences[0].excerpt!;
  assert.ok(bounded.includes("(E)"));
  assert.ok(bounded.split(/\s+/).length <= 20);
  const table = makeWidenedQuestion("non-option", { rationale: "See Table (E)." });
  assert.equal((await scan(table)).widened.occurrences[0].classification, "NON_OPTION_TOKEN");

  for (const [path, reason] of [
    [widenedFixture.missing, "UNREADABLE"],
    [widenedFixture.malformed, "INVALID_JSON"],
    [widenedFixture.schemaInvalid, "INVALID_SCHEMA"],
  ] as const) {
    const old = await runAuditReferences({ files: [path] });
    const widened = await runWidenedReferences([widenedFixture.validA, path], noHeldOutIds);
    assert.equal(old.status, "FAIL");
    assert.equal(widened.status, "FAIL");
    assert.deepEqual(widened.loadFailures, [{ file: path, reason }]);
  }
  assert.equal((await runWidenedReferences([], noHeldOutIds)).status, "FAIL");
  await writeFile(widenedFixture.validA, JSON.stringify(makeBank(makeWidenedQuestion("alias"))));
  const deduped = await runWidenedReferences([widenedFixture.validA, widenedFixture.aliasForValidA], noHeldOutIds);
  assert.equal(deduped.banks.length, 1);
  assert.equal(deduped.status, "PASS");

  const directory = join(widenedFixture.directory, "unreadable-as-bank.json");
  await mkdir(directory);
  assert.equal((await runAuditReferences({ files: [directory] })).status, "FAIL");
  const unreadable = await runWidenedReferences([directory], noHeldOutIds);
  assert.equal(unreadable.status, "FAIL");
  assert.deepEqual(unreadable.loadFailures, [{ file: directory, reason: "UNREADABLE" }]);

  console.log(`R2 null: ${positive.length + 1} old PASS / widened FAIL; ${negatives.length} old PASS / widened PASS`);
  console.log("R2 regressions: legacy, offsets, live-key comparison, excerpts, held-out siblings and fail-closed selection passed");
} finally {
  await widenedFixture.cleanup();
}
