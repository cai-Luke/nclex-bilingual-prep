import type { BankEnvelope, CaseStudyQuestion, CaseSubQuestion, SchemaVersion } from "../../src/types";
const pair = (text: string) => ({ en: text, zh: `测试：${text}` });
export const baselinePart = (id: string): CaseSubQuestion => ({
  id, itemType: "fill_in_blank", category: "Management of Care",
  topic: "Prioritization & Delegation", difficulty: "medium",
  stem: pair(`Fixture ${id}`), blanks: [{ id: "b1", prompt: pair("Enter one"), acceptable: ["1"] }],
  rationale: { correct: pair("Fixture rationale") }, testTakingStrategy: pair("Use the provided record"), glossary: [],
  answerableAfterStageId: { kind: "baseline" },
});
export const typedBaselineCase = (): CaseStudyQuestion => ({
  id: "typed_baseline_case", itemType: "case_study", category: "Management of Care",
  topic: "Prioritization & Delegation", difficulty: "medium",
  stem: pair("Synthetic boundary fixture"), rationale: { correct: pair("Fixture rationale") },
  testTakingStrategy: pair("Use the provided record"), glossary: [],
  caseStudy: {
    title: pair("BASELINE TITLE"), summary: pair("BASELINE SUMMARY"),
    exhibits: [{ id: "global", title: pair("GLOBAL EXHIBIT"), content: pair("GLOBAL CONTEXT") }],
    stages: ["s1", "s2", "s3"].map(id => ({ id, title: pair(`UPDATE ${id}`),
      exhibits: [{ id: `ex_${id}`, title: pair(`STAGED EXHIBIT ${id}`), content: pair(`STAGED CONTENT ${id}`) }] })),
    questions: [baselinePart("typed_baseline_part_1"), baselinePart("typed_baseline_part_2")],
  },
});
export const typedBaselineBank = (schemaVersion: SchemaVersion = "2.1"): BankEnvelope => ({
  meta: { schemaVersion, count: 1 }, questions: [typedBaselineCase()],
});
