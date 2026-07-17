import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import {
  collectVisualRefs,
  validateBankObject,
  type VisualRef,
} from "../src/schema";
import type { Question } from "../src/types";

export type CarrierRoute =
  | "top-level-question"
  | "embedded-leaf"
  | "parent-case-container";

export type PromotedVisualRecord = {
  parityId: string;
  bank: string;
  ref: VisualRef;
  carrierQuestion: Question;
  carrierQuestionId: string;
  carrierRoute: CarrierRoute;
};

export type PromotedBankInput = {
  bank: string;
  raw: unknown;
};

export const parityId = (ref: VisualRef): string => {
  switch (ref.location) {
    case "question": return ref.parentQuestionId;
    case "questionRationale": return `${ref.parentQuestionId}#rat${ref.locationIndex}`;
    case "caseExhibit": return `${ref.parentQuestionId}#ex${ref.locationIndex}`;
    case "caseStageExhibit": return `${ref.parentQuestionId}#st${ref.stageIndex}ex${ref.locationIndex}`;
    case "caseQuestion": return ref.ownerId;
    case "caseQuestionRationale": return `${ref.ownerId}#rat${ref.locationIndex}`;
  }
};

const carrierFor = (
  question: Question,
  ref: VisualRef,
): { carrierQuestion: Question; carrierRoute: CarrierRoute } => {
  switch (ref.location) {
    case "question":
    case "questionRationale":
      return { carrierQuestion: question, carrierRoute: "top-level-question" };
    case "caseExhibit":
    case "caseStageExhibit":
      if (question.itemType !== "case_study") {
        throw new Error(`${ref.location} ${parityId(ref)} has no parent case container`);
      }
      return { carrierQuestion: question, carrierRoute: "parent-case-container" };
    case "caseQuestion":
    case "caseQuestionRationale": {
      if (question.itemType !== "case_study") {
        throw new Error(`${ref.location} ${parityId(ref)} has no embedded case leaf`);
      }
      const leaf = question.caseStudy.questions.find((candidate) => candidate.id === ref.ownerId);
      if (leaf === undefined) {
        throw new Error(`${ref.location} ${parityId(ref)} cannot resolve embedded leaf ${ref.ownerId}`);
      }
      return { carrierQuestion: leaf, carrierRoute: "embedded-leaf" };
    }
  }
};

export const buildPromotedVisualRecords = (
  banks: PromotedBankInput[],
): PromotedVisualRecord[] => {
  const records: PromotedVisualRecord[] = [];
  const seen = new Map<string, { bank: string; ownerId: string }>();

  for (const { bank, raw } of [...banks].sort((left, right) =>
    left.bank < right.bank ? -1 : left.bank > right.bank ? 1 : 0
  )) {
    const result = validateBankObject(raw, { requireMeta: true });
    if (!result.ok) {
      throw new Error(`promoted visual parity: ${bank} failed validation: ${result.reasons.join("; ")}`);
    }

    for (const question of result.value.questions) {
      for (const ref of collectVisualRefs(question)) {
        const id = parityId(ref);
        const prior = seen.get(id);
        if (prior !== undefined) {
          throw new Error(
            `promoted visual parity: duplicate parityId ${id} in ${prior.bank} (${prior.ownerId}) and ${bank} (${ref.ownerId})`,
          );
        }
        const { carrierQuestion, carrierRoute } = carrierFor(question, ref);
        seen.set(id, { bank, ownerId: ref.ownerId });
        records.push({
          parityId: id,
          bank,
          ref,
          carrierQuestion,
          carrierQuestionId: carrierQuestion.id,
          carrierRoute,
        });
      }
    }
  }

  return records.sort((left, right) =>
    left.parityId < right.parityId ? -1 : left.parityId > right.parityId ? 1 : 0
  );
};

export const loadPromotedVisualRecords = async (
  bankDir: string = "banks",
): Promise<PromotedVisualRecord[]> => {
  const bankFiles = (await readdir(bankDir))
    .filter((file) => file.endsWith(".json"))
    .sort();
  const banks = await Promise.all(bankFiles.map(async (bank) => {
    const text = await readFile(join(bankDir, bank), "utf8");
    try {
      return { bank, raw: JSON.parse(text) as unknown };
    } catch (error) {
      throw new Error(
        `promoted visual parity: ${bank} failed JSON parse: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }));
  return buildPromotedVisualRecords(banks);
};
