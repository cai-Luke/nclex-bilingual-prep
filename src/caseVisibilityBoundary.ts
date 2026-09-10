import type { CaseSubQuestion, Question } from "./types";

/** Exact JSON boundary; unknown stored values are never coerced into baseline. */
export const isCaseBaselineBoundary = (value: unknown): value is { kind: "baseline" } =>
  typeof value === "object" && value !== null && !Array.isArray(value) &&
  Object.keys(value).length === 1 && Object.prototype.propertyIsEnumerable.call(value, "kind") &&
  (value as { kind?: unknown }).kind === "baseline";

export type BoundaryFieldClassification =
  | { kind: "absent" }
  | { kind: "baseline" }
  | { kind: "resolving-string"; index: number }
  | { kind: "unresolved-string"; value: string }
  | { kind: "malformed" };

export const classifyCaseBoundary = (
  value: unknown,
  stageIds: readonly string[],
  primary = true,
): BoundaryFieldClassification => {
  if (value === undefined) return { kind: "absent" };
  if (primary && isCaseBaselineBoundary(value)) return { kind: "baseline" };
  if (typeof value !== "string") return { kind: "malformed" };
  // Match the historical Map resolver's last-index behavior for stored duplicate IDs.
  const index = stageIds.lastIndexOf(value);
  return index < 0 ? { kind: "unresolved-string", value } : { kind: "resolving-string", index };
};

export type CaseBoundaryResolution =
  | { kind: "no-part" | "no-stages" | "baseline" | "fail-open" }
  | { kind: "prefix"; index: number; field: "answerableAfterStageId" | "stageId" };

export const resolveCaseVisibilityBoundary = (
  part: { answerableAfterStageId?: unknown; stageId?: unknown } | undefined,
  stageIds: readonly string[],
): CaseBoundaryResolution => {
  if (!part) return { kind: "no-part" };
  if (stageIds.length === 0) return { kind: "no-stages" };
  const primary = classifyCaseBoundary(part.answerableAfterStageId, stageIds);
  if (primary.kind === "baseline") return { kind: "baseline" };
  if (primary.kind === "resolving-string") return { kind: "prefix", index: primary.index, field: "answerableAfterStageId" };
  const legacy = classifyCaseBoundary(part.stageId, stageIds, false);
  if (legacy.kind === "resolving-string") return { kind: "prefix", index: legacy.index, field: "stageId" };
  return { kind: "fail-open" };
};

export const hasTypedCaseBaseline = (question: Question): boolean =>
  question.itemType === "case_study" &&
  question.caseStudy.questions.some(part => isCaseBaselineBoundary(part.answerableAfterStageId));

export const formatCaseVisibilityBoundary = (value: CaseSubQuestion["answerableAfterStageId"]): string =>
  value === undefined ? "none" : typeof value === "string" ? value : JSON.stringify(value);
