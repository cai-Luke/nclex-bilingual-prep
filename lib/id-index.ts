import type { BankEnvelope } from "../src/types";
import { collectQuestionPopulation } from "./question-population";

export type IdLocation = { id: string; file: string; path: string };

/** Flattens top-level question ids + embedded case-study leaf ids. */
export const collectQuestionIds = (bank: BankEnvelope, file: string): IdLocation[] => {
  return collectQuestionPopulation(bank).map(({ question, kind, parentId, path }) => ({
    id: question.id,
    file,
    path:
      kind === "embedded_scored_leaf"
        ? `${path} (case ${parentId} > ${question.id})`
        : `${path} (${kind})`,
  }));
};
