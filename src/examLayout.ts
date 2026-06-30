import type {
  CaseStudyQuestion,
  CaseStudyStage,
  CaseSubQuestion,
  Question,
  QuestionVisual,
} from "./types";

// Standalone visual kinds that render in the exam-style split layout.
// Excluded by design: rhythm_strip, capnography, fetal_monitoring, mar, and
// io_record because their geometry or density does not fit the narrow pane.
export const STANDALONE_SPLIT_VISUAL_KINDS: ReadonlySet<QuestionVisual["kind"]> = new Set([
  "vitals_trend",
  "lab_trend",
  "medication_label",
  "device_screen",
  "burn_map",
  "injection_site",
]);

export const usesStandaloneVisualSplit = (question: Question): boolean =>
  question.itemType !== "case_study" &&
  question.visual !== undefined &&
  STANDALONE_SPLIT_VISUAL_KINDS.has(question.visual.kind);

// Stage visibility is cumulative and fail-open so the UI never hides clinically
// necessary chart data when staged-case metadata is absent or unresolved.
export const getVisibleCaseStages = (
  question: CaseStudyQuestion,
  activeQuestion?: CaseSubQuestion,
): CaseStudyStage[] => {
  const stages = question.caseStudy.stages ?? [];
  if (!activeQuestion || stages.length === 0) return [];
  const stageIndexById = new Map(stages.map((stage, index) => [stage.id, index] as const));
  const answerableAfterStageIndex =
    activeQuestion.answerableAfterStageId !== undefined
      ? stageIndexById.get(activeQuestion.answerableAfterStageId)
      : undefined;
  if (answerableAfterStageIndex !== undefined) {
    return stages.slice(0, answerableAfterStageIndex + 1);
  }
  const stageIndex = activeQuestion.stageId !== undefined ? stageIndexById.get(activeQuestion.stageId) : undefined;
  if (stageIndex !== undefined) {
    return stages.slice(0, stageIndex + 1);
  }
  return stages;
};
