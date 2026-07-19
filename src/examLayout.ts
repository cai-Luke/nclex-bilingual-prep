import type {
  CaseStudyQuestion,
  CaseStudyStage,
  CaseSubQuestion,
  Question,
  QuestionVisual,
} from "./types";

// Standalone visual kinds that render in the exam-style split layout.
// Excluded by design: rhythm_strip, capnography, fetal_monitoring, and mar —
// their geometry or density does not fit the narrow pane. io_record rejoined
// after compacting its SVG geometry (see visuals/kinds/io_record/index.ts).
// vitals_trend left the allowlist after its 600x1108 composite proof at
// 1280x727/800 showed that the sticky split stranded the flowsheet below the
// page's reachable scroll range; it now uses the existing full-width route.
// io_trend joined after the U11 proof render measured 600x452 (4 intervals)
// and 600x504 (6 intervals), within the measured split envelope (DECISIONS.md
// principle 23).
export const STANDALONE_SPLIT_VISUAL_KINDS: ReadonlySet<QuestionVisual["kind"]> = new Set([
  "lab_trend",
  "medication_label",
  "device_screen",
  "burn_map",
  "injection_site",
  "io_record",
  "io_trend",
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
