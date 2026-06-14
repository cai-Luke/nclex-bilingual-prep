import type {
  CaseStudyQuestion,
  FillInBlankQuestion,
  ItemScore,
  MatrixQuestion,
  Question,
  StandaloneQuestion,
} from "./types";

export type AnswerState = {
  optionIds?: string[];
  blanks?: Record<string, string>;
  matrix?: Record<string, string[]>;
  dropdowns?: Record<string, string>;
  segments?: string[];
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

export const plusMinus = (selected: string[], correct: string[]): number => {
  const correctSet = new Set(correct);
  const picked = new Set(selected);
  let earned = 0;
  for (const id of picked) earned += correctSet.has(id) ? 1 : -1;
  return Math.max(0, earned);
};

const scorePlusMinus = (selected: string[], correct: string[]): ItemScore => {
  const possible = correct.length;
  const earned = plusMinus(selected, correct);
  const hasDuplicateSelection = new Set(selected).size !== selected.length;
  return {
    earned: hasDuplicateSelection ? Math.min(earned, Math.max(0, possible - 1)) : earned,
    possible,
  };
};

const blankIsCorrect = (blank: FillInBlankQuestion["blanks"][number], submitted: string) => {
  const textMatch =
    blank.acceptable?.some((acceptable) => normalizedText(acceptable) === normalizedText(submitted)) ?? false;
  const numericValue = Number.parseFloat(submitted.replace(/,/g, ""));
  const numericMatch =
    blank.numeric !== undefined &&
    Number.isFinite(numericValue) &&
    numericValue >= blank.numeric.value - blank.numeric.tolerance &&
    numericValue <= blank.numeric.value + blank.numeric.tolerance;
  return textMatch || numericMatch;
};

const scoreFillInBlank = (question: FillInBlankQuestion, answer: AnswerState): ItemScore => {
  const blanks = answer.blanks ?? {};
  const earned = question.blanks.filter((blank) => blankIsCorrect(blank, blanks[blank.id] ?? "")).length;
  return { earned, possible: question.blanks.length };
};

const scoreMatrix = (question: MatrixQuestion, answer: AnswerState): ItemScore => {
  const matrix = answer.matrix ?? {};
  const correctByRow = new Map(question.correct.map((entry) => [entry.rowId, entry.columnIds]));
  if (question.matrix.selectionMode === "single_per_row") {
    const earned = question.matrix.rows.filter((row) =>
      sameSet(matrix[row.id] ?? [], correctByRow.get(row.id) ?? []),
    ).length;
    return { earned, possible: question.matrix.rows.length };
  }
  return question.matrix.rows.reduce<ItemScore>(
    (score, row) => {
      const correct = correctByRow.get(row.id) ?? [];
      const rowScore = scorePlusMinus(matrix[row.id] ?? [], correct);
      return {
        earned: score.earned + rowScore.earned,
        possible: score.possible + rowScore.possible,
      };
    },
    { earned: 0, possible: 0 },
  );
};

export const scoreStandaloneQuestion = (question: StandaloneQuestion, answer: AnswerState): ItemScore => {
  if (question.itemType === "multiple_choice") {
    return { earned: sameSet(answer.optionIds ?? [], question.correct) ? 1 : 0, possible: 1 };
  }
  if (question.itemType === "select_all") {
    return scorePlusMinus(answer.optionIds ?? [], question.correct);
  }
  if (question.itemType === "ordered_response") {
    return { earned: sameOrdered(answer.optionIds ?? [], question.correct) ? 1 : 0, possible: 1 };
  }
  if (question.itemType === "fill_in_blank") return scoreFillInBlank(question, answer);
  if (question.itemType === "matrix") return scoreMatrix(question, answer);
  if (question.itemType === "highlight") {
    return scorePlusMinus(answer.segments ?? [], question.highlight.correct);
  }
  return {
    earned: question.dropdowns.filter((dropdown) => answer.dropdowns?.[dropdown.id] === dropdown.correct).length,
    possible: question.dropdowns.length,
  };
};

const scoreCaseStudy = (question: CaseStudyQuestion, answer: AnswerState): ItemScore =>
  question.caseStudy.questions.reduce<ItemScore>(
    (score, caseQuestion) => {
      const partScore = scoreStandaloneQuestion(
        caseQuestion,
        answer.caseStudy?.[caseQuestion.id] ?? getInitialAnswer(caseQuestion),
      );
      return {
        earned: score.earned + partScore.earned,
        possible: score.possible + partScore.possible,
      };
    },
    { earned: 0, possible: 0 },
  );

export const scoreQuestion = (question: Question, answer: AnswerState): ItemScore => {
  if (question.itemType === "case_study") return scoreCaseStudy(question, answer);
  return scoreStandaloneQuestion(question, answer);
};

export const isFullyCorrect = (score: ItemScore): boolean =>
  score.possible > 0 && score.earned === score.possible;

export const gradeStandaloneQuestion = (question: StandaloneQuestion, answer: AnswerState): boolean =>
  isFullyCorrect(scoreStandaloneQuestion(question, answer));

export const gradeQuestion = (question: Question, answer: AnswerState): boolean =>
  isFullyCorrect(scoreQuestion(question, answer));

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
  if (question.itemType === "highlight") {
    return (answer.segments?.length ?? 0) > 0;
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
  if (question.itemType === "highlight") {
    return { segments: [...question.highlight.correct] };
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
