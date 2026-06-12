import { deterministicShuffle } from "./shuffle";
import { validateBankObject } from "../src/schema";
import type {
  BankEnvelope,
  DropdownClozeQuestion,
  MatrixQuestion,
  Option,
  OptionQuestion,
  Question,
  StandaloneQuestion,
} from "../src/types";

export type PresentationComponent =
  | "multiple_choice.options"
  | "select_all.options"
  | "ordered_response.options"
  | "dropdown_cloze.options"
  | "matrix.columns";

export type NormalizationChange = {
  questionId: string;
  component: PresentationComponent;
  componentId?: string;
};

export type NormalizationResult = {
  bank: BankEnvelope;
  changes: NormalizationChange[];
  skippedUnsafe: number;
};

const byId = <T extends { id: string }>(left: T, right: T) =>
  left.id < right.id ? -1 : left.id > right.id ? 1 : 0;

function normalizeById<T extends { id: string }>(
  values: readonly T[],
  seedMaterial: string,
): T[] {
  return deterministicShuffle([...values].sort(byId), seedMaterial);
}

function sameOrder(left: readonly Option[], right: readonly Option[]): boolean {
  return left.length === right.length && left.every((value, index) => value.id === right[index]?.id);
}

function optionSeed(question: OptionQuestion): string {
  return [question.id, question.itemType, "options"].join("\u001f");
}

function normalizeOptionQuestion(
  question: OptionQuestion,
  changes: NormalizationChange[],
): OptionQuestion {
  const options = normalizeById(question.options, optionSeed(question));
  if (!sameOrder(question.options, options)) {
    changes.push({
      questionId: question.id,
      component: `${question.itemType}.options`,
    });
  }
  return { ...question, options };
}

function normalizeDropdown(
  question: DropdownClozeQuestion,
  changes: NormalizationChange[],
): DropdownClozeQuestion {
  return {
    ...question,
    dropdowns: question.dropdowns.map((dropdown) => {
      const options = normalizeById(
        dropdown.options,
        [question.id, question.itemType, "dropdown.options", dropdown.id].join("\u001f"),
      );
      if (!sameOrder(dropdown.options, options)) {
        changes.push({
          questionId: question.id,
          component: "dropdown_cloze.options",
          componentId: dropdown.id,
        });
      }
      return { ...dropdown, options };
    }),
  };
}

function normalizeMatrix(
  question: MatrixQuestion,
  changes: NormalizationChange[],
): MatrixQuestion {
  const columns = normalizeById(
    question.matrix.columns,
    [question.id, question.itemType, "matrix.columns"].join("\u001f"),
  );
  if (!sameOrder(question.matrix.columns, columns)) {
    changes.push({
      questionId: question.id,
      component: "matrix.columns",
    });
  }
  return {
    ...question,
    matrix: {
      ...question.matrix,
      columns,
    },
  };
}

function normalizeStandalone(
  question: StandaloneQuestion,
  changes: NormalizationChange[],
): StandaloneQuestion {
  if (
    question.itemType === "multiple_choice" ||
    question.itemType === "select_all" ||
    question.itemType === "ordered_response"
  ) {
    return normalizeOptionQuestion(question, changes);
  }
  if (question.itemType === "dropdown_cloze") {
    return normalizeDropdown(question, changes);
  }
  if (question.itemType === "matrix") {
    return normalizeMatrix(question, changes);
  }
  return question;
}

function normalizeQuestion(question: Question, changes: NormalizationChange[]): Question {
  if (question.itemType !== "case_study") {
    return normalizeStandalone(question, changes);
  }
  return {
    ...question,
    caseStudy: {
      ...question.caseStudy,
      questions: question.caseStudy.questions.map((nested) => normalizeStandalone(nested, changes)),
    },
  };
}

function canonicalizePresentation(question: Question): Question {
  if (question.itemType === "case_study") {
    return {
      ...question,
      caseStudy: {
        ...question.caseStudy,
        questions: question.caseStudy.questions.map((nested) =>
          canonicalizePresentation(nested) as StandaloneQuestion),
      },
    };
  }
  if (
    question.itemType === "multiple_choice" ||
    question.itemType === "select_all" ||
    question.itemType === "ordered_response"
  ) {
    return { ...question, options: [...question.options].sort(byId) };
  }
  if (question.itemType === "dropdown_cloze") {
    return {
      ...question,
      dropdowns: question.dropdowns.map((dropdown) => ({
        ...dropdown,
        options: [...dropdown.options].sort(byId),
      })),
    };
  }
  if (question.itemType === "matrix") {
    return {
      ...question,
      matrix: {
        ...question.matrix,
        columns: [...question.matrix.columns].sort(byId),
      },
    };
  }
  return question;
}

function semanticProjection(bank: BankEnvelope): string {
  return JSON.stringify({
    ...bank,
    questions: bank.questions.map(canonicalizePresentation),
  });
}

export function assertNormalizationInvariants(
  before: BankEnvelope,
  after: BankEnvelope,
): void {
  const beforeValidation = validateBankObject(before);
  if (!beforeValidation.ok) {
    throw new Error(`Input bank failed validation:\n${beforeValidation.reasons.join("\n")}`);
  }
  const afterValidation = validateBankObject(after);
  if (!afterValidation.ok) {
    throw new Error(`Normalized bank failed validation:\n${afterValidation.reasons.join("\n")}`);
  }
  if (semanticProjection(before) !== semanticProjection(after)) {
    throw new Error("Normalization changed data outside permitted presentation-array order.");
  }
}

export function normalizeBankPresentations(bank: BankEnvelope): NormalizationResult {
  const changes: NormalizationChange[] = [];
  const normalized: BankEnvelope = {
    ...bank,
    questions: bank.questions.map((question) => normalizeQuestion(question, changes)),
  };
  assertNormalizationInvariants(bank, normalized);
  return {
    bank: normalized,
    changes,
    skippedUnsafe: 0,
  };
}

export function serializeBank(bank: BankEnvelope): string {
  return `${JSON.stringify(bank, null, 2)}\n`;
}
