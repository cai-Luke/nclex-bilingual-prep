import assert from "node:assert/strict";
import {
  normalizeStoredQuestionRecord,
  normalizeStoredTranslationRevealEvent,
} from "../../src/categoryMigration";
import { normalizeLegacyImportedCategory } from "../../src/bankImport";
import type { QuestionRecord, TranslationRevealEvent } from "../../src/types";

const legacyCategory = "Safety and Infection Control";
const nextCategory = "Safety and Infection Prevention and Control";
const common = {
  difficulty: "medium",
  stem: { en: "fixture", zh: "fixture" },
  rationale: { correct: { en: "fixture", zh: "fixture" } },
  testTakingStrategy: { en: "fixture", zh: "fixture" },
  glossary: [],
};
const record = {
  sourceKind: "uploaded",
  sourceLabel: "fixture",
  question: {
    ...common,
    id: "case",
    itemType: "case_study",
    category: legacyCategory,
    topic: "Patient & Environment Safety",
    caseStudy: {
      title: { en: "fixture", zh: "fixture" },
      exhibits: [],
      questions: [{
        ...common,
        id: "part",
        itemType: "multiple_choice",
        category: legacyCategory,
        topic: "Patient & Environment Safety",
        options: [{ id: "a", en: "a", zh: "a" }, { id: "b", en: "b", zh: "b" }],
        correct: ["a"],
      }],
    },
  },
} as unknown as QuestionRecord;

const normalized = normalizeStoredQuestionRecord(record);
assert.equal(normalized.question.category, nextCategory);
assert.equal(
  normalized.question.itemType === "case_study"
    ? normalized.question.caseStudy.questions[0].category
    : null,
  nextCategory,
);

const event = {
  id: "event",
  sessionId: "session",
  questionId: "question",
  block: "stem",
  itemType: "multiple_choice",
  category: legacyCategory,
  topic: "Patient & Environment Safety",
  revealedAt: "2026-07-16T00:00:00.000Z",
  elapsedMsOnQuestion: 1,
  answeredBeforeReveal: false,
  submittedBeforeReveal: false,
  revealCountForQuestion: 1,
} as unknown as TranslationRevealEvent;
assert.equal(normalizeStoredTranslationRevealEvent(event).category, nextCategory);
assert.equal(
  (normalizeLegacyImportedCategory({ category: legacyCategory }) as { category: string }).category,
  nextCategory,
);

console.log("storage category migration tests passed");
