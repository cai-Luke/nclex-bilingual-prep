import type { Category, QuestionRecord, TranslationRevealEvent } from "./types";

const LEGACY_SAFETY_CATEGORY = "Safety and Infection Control";
const SAFETY_CATEGORY: Category = "Safety and Infection Prevention and Control";

const normalizeStoredCategory = (category: Category | string): Category =>
  category === LEGACY_SAFETY_CATEGORY ? SAFETY_CATEGORY : category as Category;

export const normalizeStoredQuestionRecord = (record: QuestionRecord): QuestionRecord => {
  const question = record.question;
  const category = normalizeStoredCategory(question.category);
  if (question.itemType !== "case_study") {
    return category === question.category ? record : { ...record, question: { ...question, category } };
  }

  const questions = question.caseStudy.questions.map((part) => {
    const partCategory = normalizeStoredCategory(part.category);
    return partCategory === part.category ? part : { ...part, category: partCategory };
  });
  const nestedChanged = questions.some((part, index) => part !== question.caseStudy.questions[index]);
  if (category === question.category && !nestedChanged) return record;
  return {
    ...record,
    question: {
      ...question,
      category,
      caseStudy: { ...question.caseStudy, questions },
    },
  };
};

export const normalizeStoredTranslationRevealEvent = (
  event: TranslationRevealEvent,
): TranslationRevealEvent => {
  const category = normalizeStoredCategory(event.category);
  return category === event.category ? event : { ...event, category };
};
