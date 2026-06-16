import { isCanonicalTopic } from "../src/topics";

type JsonRecord = Record<string, any>;

export type TopicValidationIssue = {
  id: string;
  path: string;
  topic: string;
  category: string;
};

const visitQuestion = (question: JsonRecord, path: string, issues: TopicValidationIssue[]) => {
  if (typeof question.topic === "string" && !isCanonicalTopic(question.topic)) {
    issues.push({
      id: typeof question.id === "string" ? question.id : "(missing id)",
      path,
      topic: question.topic,
      category: typeof question.category === "string" ? question.category : "(missing category)",
    });
  }

  if (question.itemType === "case_study" && Array.isArray(question.caseStudy?.questions)) {
    question.caseStudy.questions.forEach((embedded: JsonRecord, index: number) => {
      visitQuestion(embedded, `${path}.caseStudy.questions[${index}]`, issues);
    });
  }
};

export const findNoncanonicalTopics = (bank: unknown): TopicValidationIssue[] => {
  if (typeof bank !== "object" || bank === null || !Array.isArray((bank as JsonRecord).questions)) {
    return [];
  }

  const issues: TopicValidationIssue[] = [];
  (bank as JsonRecord).questions.forEach((question: JsonRecord, index: number) => {
    visitQuestion(question, `questions[${index}]`, issues);
  });
  return issues;
};

export const formatTopicValidationIssues = (issues: readonly TopicValidationIssue[]): string[] =>
  issues.map((issue) => `${issue.path} (${issue.id}) has noncanonical topic "${issue.topic}" [${issue.category}]`);
