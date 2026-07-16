import type { BankEnvelope, Question, QuestionVisual, StandaloneQuestion } from "../src/types";

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

export type VisualArtifactSource =
  | "question"
  | "case_exhibit"
  | "case_stage_exhibit"
  | "embedded_leaf";

export type VisualArtifactRecord = {
  visual: QuestionVisual;
  ownerId: string;
  parentSessionUnitId: string;
  source: VisualArtifactSource;
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

/**
 * Enumerates visual artifacts recursively. This population is independent of
 * both session units and scored leaves: case exhibits and staged exhibits are
 * artifacts even though they are not question records.
 */
export const collectVisualArtifacts = (questions: readonly Question[]): VisualArtifactRecord[] => {
  const artifacts: VisualArtifactRecord[] = [];

  for (const question of questions) {
    if (question.visual) {
      artifacts.push({
        visual: question.visual,
        ownerId: question.id,
        parentSessionUnitId: question.id,
        source: "question",
      });
    }
    if (question.itemType !== "case_study") continue;

    for (const exhibit of question.caseStudy.exhibits) {
      if (exhibit.visual) {
        artifacts.push({
          visual: exhibit.visual,
          ownerId: question.id,
          parentSessionUnitId: question.id,
          source: "case_exhibit",
        });
      }
    }
    for (const stage of question.caseStudy.stages ?? []) {
      for (const exhibit of stage.exhibits) {
        if (exhibit.visual) {
          artifacts.push({
            visual: exhibit.visual,
            ownerId: question.id,
            parentSessionUnitId: question.id,
            source: "case_stage_exhibit",
          });
        }
      }
    }
    for (const leaf of question.caseStudy.questions) {
      if (leaf.visual) {
        artifacts.push({
          visual: leaf.visual,
          ownerId: leaf.id,
          parentSessionUnitId: question.id,
          source: "embedded_leaf",
        });
      }
    }
  }

  return artifacts;
};
