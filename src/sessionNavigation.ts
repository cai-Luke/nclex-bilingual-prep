export const findNextPendingQuestionIndex = (
  questionIds: string[],
  currentIndex: number,
  answeredQuestionIds: ReadonlySet<string>,
  skippedQuestionIds: ReadonlySet<string>,
) => {
  for (let index = currentIndex + 1; index < questionIds.length; index += 1) {
    const questionId = questionIds[index];
    if (!answeredQuestionIds.has(questionId) && !skippedQuestionIds.has(questionId)) return index;
  }
  return -1;
};

export const findFirstSkippedQuestionIndex = (
  questionIds: string[],
  skippedQuestionIds: ReadonlySet<string>,
) => questionIds.findIndex((questionId) => skippedQuestionIds.has(questionId));

export const findNextSkippedQuestionIndex = (
  questionIds: string[],
  currentIndex: number,
  skippedQuestionIds: ReadonlySet<string>,
) => {
  for (let offset = 1; offset < questionIds.length; offset += 1) {
    const index = (currentIndex + offset) % questionIds.length;
    if (skippedQuestionIds.has(questionIds[index])) return index;
  }
  return -1;
};
