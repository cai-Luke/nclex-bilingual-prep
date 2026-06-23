import assert from "node:assert/strict";
import { normalizeRawBankStructure } from "../../lib/raw-bank-normalization";
import { validateBankObject } from "../../src/schema";

const pair = (text: string) => ({ en: text, zh: "测试文本" });

const raw = {
  meta: {
    schemaVersion: "1.6",
    count: 99,
  },
  questions: [
    {
      id: "raw_norm_mc_01",
      itemType: "multiple_choice",
      category: "Physiological Adaptation",
      topic: "heart failure",
      difficulty: "medium",
      ngnSkill: "Analyze Cues",
      stem: pair("Which finding matters?"),
      options: [
        { id: "A", en: "Crackles", zh: "湿啰音" },
        { id: "B", en: "Warm hands", zh: "手温暖" },
        { id: "C", en: "Clear speech", zh: "语言清晰" },
      ],
      correct: ["A"],
      rationale: {
        correct: pair("Crackles indicate fluid overload."),
        byChoice: [
          { refId: "A", en: "Correct.", zh: "正确。" },
          { refId: "B", en: "Incorrect.", zh: "错误。" },
          { refId: "C", en: "Incorrect.", zh: "错误。" },
        ],
        visuals: [],
      },
      testTakingStrategy: pair("Use pulmonary cues."),
      glossary: [
        {
          term: { en: "Crackles", zh: "湿啰音" },
          definition: { zh: "肺部液体相关的异常呼吸音" },
        },
      ],
    },
    {
      id: "raw_norm_case_01",
      itemType: "case_study",
      category: "Reduction of Risk Potential",
      topic: "acute kidney injury",
      difficulty: "hard",
      stem: pair("Review the record."),
      rationale: { correct: pair("Case summary.") },
      testTakingStrategy: pair("Trend cues over time."),
      glossary: [],
      caseStudy: {
        title: pair("AKI case"),
        exhibits: [{ id: "note", title: pair("Nursing note"), content: pair("Data.") }],
        questions: [
          {
            id: "raw_norm_case_01_part_1",
            itemType: "multiple_choice",
            category: "Reduction of Risk Potential",
            topic: "acute kidney injury",
            difficulty: "hard",
            ngnSkill: "prioritizeHypotheses",
            stem: pair("Which hypothesis is highest priority?"),
            options: [
              { id: "A", en: "AKI", zh: "急性肾损伤" },
              { id: "B", en: "Stable recovery", zh: "稳定恢复" },
              { id: "C", en: "Routine finding", zh: "常规发现" },
            ],
            correct: ["A"],
            rationale: {
              correct: pair("AKI is priority."),
              byChoice: [
                { refId: "A", en: "Correct.", zh: "正确。" },
                { refId: "B", en: "Incorrect.", zh: "错误。" },
                { refId: "C", en: "Incorrect.", zh: "错误。" },
              ],
            },
            testTakingStrategy: pair("Prioritize worsening kidney function."),
            glossary: [{ en: "Acute kidney injury", zh: "急性肾损伤", def: "肾功能突然下降" }],
          },
          {
            id: "raw_norm_case_01_part_2",
            itemType: "multiple_choice",
            category: "Reduction of Risk Potential",
            topic: "acute kidney injury",
            difficulty: "hard",
            stem: pair("Which result follows?"),
            options: [
              { id: "A", en: "Creatinine rises", zh: "肌酐升高" },
              { id: "B", en: "No change", zh: "无变化" },
              { id: "C", en: "Unrelated", zh: "无关" },
            ],
            correct: ["A"],
            rationale: {
              correct: pair("Creatinine reflects renal function."),
              byChoice: [
                { refId: "A", en: "Correct.", zh: "正确。" },
                { refId: "B", en: "Incorrect.", zh: "错误。" },
                { refId: "C", en: "Incorrect.", zh: "错误。" },
              ],
            },
            testTakingStrategy: pair("Use trend data."),
            glossary: [],
          },
        ],
      },
    },
  ],
};

const before = validateBankObject(raw);
assert.equal(before.ok, false);

const result = normalizeRawBankStructure(raw);
assert.equal(result.changes.length, 6);

const normalized = result.bank as typeof raw;
assert.equal(normalized.meta.count, 2);
assert.equal(normalized.questions[0].ngnSkill, "analyze_cues");
assert.deepEqual(normalized.questions[0].glossary, [
  { termEn: "Crackles", termZh: "湿啰音", defZh: "肺部液体相关的异常呼吸音" },
]);
assert.equal(normalized.questions[0].rationale.visuals, undefined);
const caseQuestion = normalized.questions[1];
assert.equal(caseQuestion.itemType, "case_study");
assert(caseQuestion.caseStudy);
const nested = caseQuestion.caseStudy.questions[0];
assert.equal(nested.ngnSkill, "prioritize_hypotheses");
assert.deepEqual(nested.glossary, [
  { termEn: "Acute kidney injury", termZh: "急性肾损伤", defZh: "肾功能突然下降" },
]);

assert.equal(validateBankObject(normalized).ok, true);

console.log("raw-bank-normalization tests passed");
