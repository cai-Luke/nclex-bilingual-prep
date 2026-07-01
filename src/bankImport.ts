import { validateQuestion } from "./schema";
import type { BankEnvelope, ImportSummary, Question, QuestionRecord } from "./types";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const extractJsonCandidate = (input: string) => {
  const trimmed = input.trim();
  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .replace(/`{3,}/g, "")
    .trim();

  const start = [...unfenced]
    .map((char, index) => ({ char, index }))
    .find((item) => item.char === "{" || item.char === "[");
  if (!start) throw new Error("No JSON object or array found.");

  const opener = start.char;
  const closer = opener === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  let escaping = false;

  for (let index = start.index; index < unfenced.length; index += 1) {
    const char = unfenced[index];
    if (inString) {
      if (escaping) {
        escaping = false;
      } else if (char === "\\") {
        escaping = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }
    if (char === "\"") {
      inString = true;
    } else if (char === opener) {
      depth += 1;
    } else if (char === closer) {
      depth -= 1;
      if (depth === 0) return unfenced.slice(start.index, index + 1);
    }
  }

  throw new Error("JSON was truncated before the top-level object closed.");
};

export const parseBankText = (input: string): unknown => JSON.parse(extractJsonCandidate(input));

export const getRawQuestions = (raw: unknown): unknown[] => {
  if (Array.isArray(raw)) return raw;
  if (isObject(raw) && Array.isArray(raw.questions)) return raw.questions;
  throw new Error("Expected a bank object with questions[] or a bare array.");
};

export const importQuestionsFromText = (
  input: string,
  existingIds: Set<string>,
  sourceLabel: string,
): { records: QuestionRecord[]; summary: ImportSummary } => {
  const raw = parseBankText(input);
  const questions = getRawQuestions(raw);
  const importedAt = new Date().toISOString();
  const seenIncoming = new Set<string>();
  const records: QuestionRecord[] = [];
  const summary: ImportSummary = {
    imported: 0,
    total: questions.length,
    skipped: [],
    regeneratedIds: [],
  };

  questions.forEach((rawQuestion, index) => {
    const result = validateQuestion(rawQuestion);
    const rawId = isObject(rawQuestion) && typeof rawQuestion.id === "string" ? rawQuestion.id : undefined;
    if (!result.ok) {
      summary.skipped.push({ index, id: rawId, reasons: result.reasons });
      return;
    }
    if (seenIncoming.has(result.value.id)) {
      summary.skipped.push({ index, id: result.value.id, reasons: [`duplicate id ${result.value.id} within import`] });
      return;
    }
    seenIncoming.add(result.value.id);
    const question = cloneQuestion(result.value);
    const originalId = question.id;
    if (existingIds.has(question.id)) {
      question.id = regenerateId(question.id, existingIds);
      summary.regeneratedIds.push({ from: originalId, to: question.id });
    }
    existingIds.add(question.id);
    records.push({
      question,
      sourceKind: "uploaded",
      sourceLabel: sourceLabel.trim() || "Uploaded",
      importedAt,
      originalId,
    });
    summary.imported += 1;
  });

  return { records, summary };
};

const cloneQuestion = (question: Question): Question => JSON.parse(JSON.stringify(question)) as Question;

const regenerateId = (id: string, existingIds: Set<string>) => {
  const safeBase = id.replace(/[^a-zA-Z0-9_-]+/g, "_").slice(0, 48) || "imported_question";
  let next = `${safeBase}_imported_${Date.now()}`;
  let suffix = 1;
  while (existingIds.has(next)) {
    next = `${safeBase}_imported_${Date.now()}_${suffix}`;
    suffix += 1;
  }
  return next;
};

const hasVisual = (question: Question) => {
  if (question.visual !== undefined) return true;
  if (question.itemType !== "case_study") return false;
  return (
    question.caseStudy.exhibits.some((exhibit) => exhibit.visual !== undefined) ||
    question.caseStudy.stages?.some((stage) => stage.exhibits.some((exhibit) => exhibit.visual !== undefined)) ||
    question.caseStudy.questions.some((caseQuestion) => caseQuestion.visual !== undefined)
  );
};

const hasHighlight = (question: Question) =>
  question.itemType === "highlight" ||
  (question.itemType === "case_study" &&
    question.caseStudy.questions.some((caseQuestion) => caseQuestion.itemType === "highlight"));

const hasBowtie = (question: Question) => question.itemType === "bowtie";

const hasRationaleVisuals = (question: Question) => {
  if (Array.isArray(question.rationale.visuals) && question.rationale.visuals.length > 0) return true;
  if (question.itemType !== "case_study") return false;
  return question.caseStudy.questions.some(
    (caseQuestion) => Array.isArray(caseQuestion.rationale.visuals) && caseQuestion.rationale.visuals.length > 0,
  );
};

const hasSchema16CaseFields = (question: Question) => {
  if (question.itemType !== "case_study") return false;
  if (question.caseStudy.exhibits.some((exhibit) => exhibit.type !== undefined)) return true;
  if (question.caseStudy.stages?.some((stage) =>
    stage.trigger !== undefined ||
    stage.narrative !== undefined ||
    stage.timeOffset !== undefined ||
    stage.exhibits.some((exhibit) => exhibit.type !== undefined)
  )) {
    return true;
  }
  return question.caseStudy.questions.some(
    (caseQuestion) => caseQuestion.stageId !== undefined || caseQuestion.answerableAfterStageId !== undefined,
  );
};

const hasPacerRhythmVisual = (visual: Question["visual"]) =>
  visual?.kind === "rhythm_strip" && "pacer" in visual && visual.pacer !== undefined;

const hasPacerRhythmStrip = (question: Question) => {
  if (hasPacerRhythmVisual(question.visual)) return true;
  if (question.itemType !== "case_study") return false;
  return (
    question.caseStudy.exhibits.some((exhibit) => hasPacerRhythmVisual(exhibit.visual)) ||
    question.caseStudy.stages?.some((stage) => stage.exhibits.some((exhibit) => hasPacerRhythmVisual(exhibit.visual))) ||
    question.caseStudy.questions.some((caseQuestion) => hasPacerRhythmVisual(caseQuestion.visual))
  );
};

export const toExportEnvelope = (questions: Question[]): BankEnvelope => ({
  meta: {
    schemaVersion: questions.some(hasPacerRhythmStrip)
      ? "1.7"
      : questions.some(hasSchema16CaseFields)
      ? "1.6"
      : questions.some(hasRationaleVisuals)
      ? "1.5"
      : questions.some(hasBowtie)
        ? "1.4"
        : questions.some(hasHighlight)
          ? "1.3"
          : questions.some(hasVisual)
            ? "1.2"
            : questions.some((question) => question.itemType === "case_study")
              ? "1.1"
              : "1.0",
    exam: "NCLEX-RN",
    topic: "exported library",
    category: "mixed",
    difficulty: "mixed",
    count: questions.length,
  },
  questions,
});
