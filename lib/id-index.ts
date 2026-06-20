import type { BankEnvelope } from "../src/types";

export type IdLocation = { id: string; file: string; path: string };

/** Flattens top-level question ids + embedded case-study leaf ids. */
export const collectQuestionIds = (bank: BankEnvelope, file: string): IdLocation[] => {
  const out: IdLocation[] = [];
  for (const question of bank.questions) {
    out.push({ id: question.id, file, path: "top-level" });
    if (question.itemType === "case_study") {
      for (const leaf of question.caseStudy.questions) {
        out.push({ id: leaf.id, file, path: `case ${question.id} > ${leaf.id}` });
      }
    }
  }
  return out;
};
