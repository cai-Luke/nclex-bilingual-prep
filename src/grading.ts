import type { CaseStudyQuestion, FillInBlankQuestion, MatrixQuestion, OptionQuestion, Question, StandaloneQuestion } from "./types";

export type AnswerState = {
  optionIds?: string[];
  blanks?: Record<string, string>;
  matrix?: Record<string, string[]>;
  dropdowns?: Record<string, string>;
  caseStudy?: Record<string, AnswerState>;
};

const sameOrdered = (left: string[], right: string[]) =>
  left.length === right.length && left.every((value, index) => value === right[index]);

const sameSet = (left: string[], right: string[]) => {
  if (left.length !== right.length) return false;
  if (new Set(left).size !== left.length) return false;
  const rightSet = new Set(right);
  return left.every((value) => rightSet.has(value));
};

const normalizedText = (value: string) => value.trim().toLowerCase();

const gradeOptionQuestion = (question: OptionQuestion, answer: AnswerState) => {
  const selected = answer.optionIds ?? [];
  if (question.itemType === "ordered_response") return sameOrdered(selected, question.correct);
  return sameSet(selected, question.correct);
};

const gradeFillInBlank = (question: FillInBlankQuestion, answer: AnswerState) => {
  const blanks = answer.blanks ?? {};
  return question.blanks.every((blank) => {
    const submitted = blanks[blank.id] ?? "";
    const textMatch =
      blank.acceptable?.some((acceptable) => normalizedText(acceptable) === normalizedText(submitted)) ?? false;
    const numericValue = Number.parseFloat(submitted.replace(/,/g, ""));
    const numericMatch =
      blank.numeric !== undefined &&
      Number.isFinite(numericValue) &&
      numericValue >= blank.numeric.value - blank.numeric.tolerance &&
      numericValue <= blank.numeric.value + blank.numeric.tolerance;
    return textMatch || numericMatch;
  });
};

const gradeMatrix = (question: MatrixQuestion, answer: AnswerState) => {
  const matrix = answer.matrix ?? {};
  return question.correct.every((entry) => sameSet(matrix[entry.rowId] ?? [], entry.columnIds));
};

export const gradeStandaloneQuestion = (question: StandaloneQuestion, answer: AnswerState) => {
  if (
    question.itemType === "multiple_choice" ||
    question.itemType === "select_all" ||
    question.itemType === "ordered_response"
  ) {
    return gradeOptionQuestion(question, answer);
  }
  if (question.itemType === "fill_in_blank") return gradeFillInBlank(question, answer);
  if (question.itemType === "matrix") return gradeMatrix(question, answer);
  return question.dropdowns.every((dropdown) => answer.dropdowns?.[dropdown.id] === dropdown.correct);
};

const gradeCaseStudy = (question: CaseStudyQuestion, answer: AnswerState) =>
  question.caseStudy.questions.every((caseQuestion) =>
    gradeStandaloneQuestion(caseQuestion, answer.caseStudy?.[caseQuestion.id] ?? getInitialAnswer(caseQuestion)),
  );

export const gradeQuestion = (question: Question, answer: AnswerState) => {
  if (question.itemType === "case_study") return gradeCaseStudy(question, answer);
  return gradeStandaloneQuestion(question, answer);
};

export const getAnswerCompleteness = (question: Question, answer: AnswerState): boolean => {
  if (question.itemType === "multiple_choice" || question.itemType === "select_all") {
    return (answer.optionIds?.length ?? 0) > 0;
  }
  if (question.itemType === "ordered_response") {
    return sameSet(answer.optionIds ?? [], question.options.map((option) => option.id));
  }
  if (question.itemType === "fill_in_blank") {
    return question.blanks.every((blank) => (answer.blanks?.[blank.id] ?? "").trim().length > 0);
  }
  if (question.itemType === "matrix") {
    return question.matrix.rows.every((row) => (answer.matrix?.[row.id]?.length ?? 0) > 0);
  }
  if (question.itemType === "case_study") {
    return question.caseStudy.questions.every((caseQuestion) =>
      getAnswerCompleteness(caseQuestion, answer.caseStudy?.[caseQuestion.id] ?? getInitialAnswer(caseQuestion)),
    );
  }
  return question.dropdowns.every((dropdown) => Boolean(answer.dropdowns?.[dropdown.id]));
};

export const getInitialAnswer = (question: Question): AnswerState => {
  if (question.itemType === "ordered_response") {
    return { optionIds: question.options.map((option) => option.id) };
  }
  if (question.itemType === "case_study") {
    return {
      caseStudy: Object.fromEntries(
        question.caseStudy.questions.map((caseQuestion) => [caseQuestion.id, getInitialAnswer(caseQuestion)]),
      ),
    };
  }
  return {};
};

export const getCorrectAnswer = (question: Question): AnswerState => {
  if (
    question.itemType === "multiple_choice" ||
    question.itemType === "select_all" ||
    question.itemType === "ordered_response"
  ) {
    return { optionIds: [...question.correct] };
  }
  if (question.itemType === "fill_in_blank") {
    return {
      blanks: Object.fromEntries(
        question.blanks.map((blank) => [
          blank.id,
          blank.numeric ? String(blank.numeric.value) : (blank.acceptable?.[0] ?? ""),
        ]),
      ),
    };
  }
  if (question.itemType === "matrix") {
    return {
      matrix: Object.fromEntries(question.correct.map((entry) => [entry.rowId, [...entry.columnIds]])),
    };
  }
  if (question.itemType === "case_study") {
    return {
      caseStudy: Object.fromEntries(
        question.caseStudy.questions.map((caseQuestion) => [caseQuestion.id, getCorrectAnswer(caseQuestion)]),
      ),
    };
  }
  return {
    dropdowns: Object.fromEntries(question.dropdowns.map((dropdown) => [dropdown.id, dropdown.correct])),
  };
};
