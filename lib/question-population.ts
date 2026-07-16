import type { BankEnvelope, Question, StandaloneQuestion } from "../src/types";

export type QuestionPopulationKind =
  | "top_level_case_container"
  | "top_level_scored_leaf"
  | "embedded_scored_leaf";

export type QuestionPopulationRecord = {
  question: Question | StandaloneQuestion;
  kind: QuestionPopulationKind;
  parentId: string | null;
  path: string;
};

/**
 * Enumerates every question-shaped record without confusing case containers
 * with the scored questions nested inside them.
 */
export const collectQuestionPopulation = (bank: BankEnvelope): QuestionPopulationRecord[] => {
  const records: QuestionPopulationRecord[] = [];

  for (const [questionIndex, question] of bank.questions.entries()) {
    const topLevelPath = `questions.${questionIndex}`;
    if (question.itemType !== "case_study") {
      records.push({
        question,
        kind: "top_level_scored_leaf",
        parentId: null,
        path: topLevelPath,
      });
      continue;
    }

    records.push({
      question,
      kind: "top_level_case_container",
      parentId: null,
      path: topLevelPath,
    });
    for (const [leafIndex, leaf] of question.caseStudy.questions.entries()) {
      records.push({
        question: leaf,
        kind: "embedded_scored_leaf",
        parentId: question.id,
        path: `${topLevelPath}.caseStudy.questions.${leafIndex}`,
      });
    }
  }

  return records;
};

/** Standalone top-level questions plus embedded case-study questions. */
export const collectScoredLeaves = (questions: readonly Question[]): StandaloneQuestion[] =>
  questions.flatMap((question) =>
    question.itemType === "case_study" ? question.caseStudy.questions : [question],
  );
