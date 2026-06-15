import type { Question } from "../src/types";

export type CompileManifest = {
  skeletonDpCount: number;
  skeletonHasBowtie: boolean;
  emittedItemCount: number;
  emittedBowtie: boolean;
  omittedDps: Array<{ dp: number; reason: string }>;
  bowtieOmissionReason?: string;
};

export type CompileManifestFailure = {
  caseId: string;
  reasons: string[];
};

type ManifestCase = Extract<Question, { itemType: "case_study" }> & {
  _compileManifest?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isPositiveInteger = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value > 0;

const parseManifest = (value: unknown, reasons: string[]): CompileManifest | null => {
  if (!isRecord(value)) {
    reasons.push("_compileManifest must be an object");
    return null;
  }
  if (!isPositiveInteger(value.skeletonDpCount)) {
    reasons.push("_compileManifest.skeletonDpCount must be a positive integer");
  }
  if (typeof value.skeletonHasBowtie !== "boolean") {
    reasons.push("_compileManifest.skeletonHasBowtie must be boolean");
  }
  if (!isPositiveInteger(value.emittedItemCount)) {
    reasons.push("_compileManifest.emittedItemCount must be a positive integer");
  }
  if (typeof value.emittedBowtie !== "boolean") {
    reasons.push("_compileManifest.emittedBowtie must be boolean");
  }
  if (!Array.isArray(value.omittedDps)) {
    reasons.push("_compileManifest.omittedDps must be an array");
  } else {
    value.omittedDps.forEach((entry, index) => {
      if (!isRecord(entry) || !isPositiveInteger(entry.dp) || !nonEmptyString(entry.reason)) {
        reasons.push(`_compileManifest.omittedDps[${index}] requires positive integer dp and non-empty reason`);
      }
    });
  }
  if (value.bowtieOmissionReason !== undefined && !nonEmptyString(value.bowtieOmissionReason)) {
    reasons.push("_compileManifest.bowtieOmissionReason must be non-empty when present");
  }
  if (reasons.length > 0) return null;
  return value as unknown as CompileManifest;
};

const slug = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

const findSiblingBowties = (
  caseQuestion: ManifestCase,
  questions: Question[],
  manifestCaseCount: number,
) => {
  const bowties = questions.filter((question) => question.itemType === "bowtie");
  const strict = bowties.filter((question) => question.id.startsWith(`${caseQuestion.id}_`));
  if (strict.length > 0) return strict;
  const topicMatches = bowties.filter((question) => slug(question.topic) === slug(caseQuestion.topic));
  if (topicMatches.length === 1) return topicMatches;
  if (manifestCaseCount === 1 && bowties.length === 1) return bowties;
  return [];
};

export const checkCaseCompileManifests = (raw: unknown): CompileManifestFailure[] => {
  if (!isRecord(raw) || !Array.isArray(raw.questions)) return [];
  const questions = raw.questions as Question[];
  const manifestCases = questions.filter(
    (question): question is ManifestCase =>
      isRecord(question) && question.itemType === "case_study" && "_compileManifest" in question,
  );

  return manifestCases.flatMap((caseQuestion) => {
    const reasons: string[] = [];
    const manifest = parseManifest(caseQuestion._compileManifest, reasons);
    if (!manifest) return [{ caseId: String(caseQuestion.id ?? "unknown"), reasons }];

    const actualItemCount = Array.isArray(caseQuestion.caseStudy?.questions)
      ? caseQuestion.caseStudy.questions.length
      : 0;
    const siblingBowties = findSiblingBowties(caseQuestion, questions, manifestCases.length);
    const actualBowtie = siblingBowties.length === 1;

    if (manifest.skeletonDpCount !== 6) {
      reasons.push(`skeletonDpCount must be 6 for forward case-skeleton output; received ${manifest.skeletonDpCount}`);
    }
    if (manifest.emittedItemCount !== actualItemCount) {
      reasons.push(`emittedItemCount ${manifest.emittedItemCount} does not match caseStudy.questions.length ${actualItemCount}`);
    }
    if (manifest.emittedBowtie !== actualBowtie) {
      reasons.push(`emittedBowtie ${manifest.emittedBowtie} does not match actual sibling bowtie presence ${actualBowtie}`);
    }

    const omittedDpNumbers = manifest.omittedDps.map((entry) => entry.dp);
    if (new Set(omittedDpNumbers).size !== omittedDpNumbers.length) {
      reasons.push("omittedDps contains duplicate dp values");
    }
    omittedDpNumbers.forEach((dp) => {
      if (dp > manifest.skeletonDpCount) {
        reasons.push(`omittedDps dp ${dp} exceeds skeletonDpCount ${manifest.skeletonDpCount}`);
      }
    });
    if (manifest.emittedItemCount + manifest.omittedDps.length !== manifest.skeletonDpCount) {
      reasons.push(
        `emittedItemCount ${manifest.emittedItemCount} + omittedDps ${manifest.omittedDps.length} must equal skeletonDpCount ${manifest.skeletonDpCount}`,
      );
    }
    if (actualItemCount < 6 && manifest.omittedDps.length !== 6 - actualItemCount) {
      reasons.push(`every unit of the six-item target shortfall must have one omittedDps entry`);
    }
    if (manifest.skeletonHasBowtie && !manifest.emittedBowtie && !nonEmptyString(manifest.bowtieOmissionReason)) {
      reasons.push("bowtieOmissionReason is required when an authored bowtie is omitted");
    }
    if (!manifest.skeletonHasBowtie && manifest.emittedBowtie) {
      reasons.push("emittedBowtie may not be true when skeletonHasBowtie is false");
    }
    if (siblingBowties.length > 1) {
      reasons.push(`multiple sibling bowtie candidates found: ${siblingBowties.map((question) => question.id).join(", ")}`);
    }

    return reasons.length > 0 ? [{ caseId: caseQuestion.id, reasons }] : [];
  });
};

export const stripCompileManifests = (raw: unknown): unknown => {
  if (!isRecord(raw) || !Array.isArray(raw.questions)) return raw;
  return {
    ...raw,
    questions: raw.questions.map((question) => {
      if (!isRecord(question) || !("_compileManifest" in question)) return question;
      const { _compileManifest: _ignored, ...stripped } = question;
      return stripped;
    }),
  };
};
