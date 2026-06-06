import type {
  BankEnvelope,
  CaseStudyQuestion,
  Category,
  Difficulty,
  FillInBlankQuestion,
  ItemType,
  MatrixQuestion,
  NgnSkill,
  OptionQuestion,
  Question,
  RhythmClass,
  RhythmStripVisual,
  SchemaVersion,
  StandaloneQuestion,
  StandaloneItemType,
  TextPair,
} from "./types";

export const SCHEMA_VERSION = "1.2";

export const supportedSchemaVersions = ["1.0", "1.1", "1.2"] as const satisfies readonly SchemaVersion[];

export const categories = [
  "Management of Care",
  "Safety and Infection Control",
  "Health Promotion and Maintenance",
  "Psychosocial Integrity",
  "Basic Care and Comfort",
  "Pharmacological and Parenteral Therapies",
  "Reduction of Risk Potential",
  "Physiological Adaptation",
] as const satisfies readonly Category[];

export const standaloneItemTypes = [
  "multiple_choice",
  "select_all",
  "ordered_response",
  "fill_in_blank",
  "matrix",
  "dropdown_cloze",
] as const satisfies readonly StandaloneItemType[];

export const itemTypes = [
  ...standaloneItemTypes,
  "case_study",
] as const satisfies readonly ItemType[];

export const difficulties = ["easy", "medium", "hard"] as const satisfies readonly Difficulty[];

export const ngnSkills = [
  "recognize_cues",
  "analyze_cues",
  "prioritize_hypotheses",
  "generate_solutions",
  "take_action",
  "evaluate_outcomes",
] as const satisfies readonly NgnSkill[];

export const rhythmClasses = [
  "sinus",
  "sinus_brady",
  "sinus_tach",
  "afib",
  "aflutter",
  "svt",
  "avb_1",
  "avb_2_mobitz1",
  "avb_2_mobitz2",
  "avb_3",
  "pvc",
  "vtach",
  "vfib",
  "asystole",
] as const satisfies readonly RhythmClass[];

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; reasons: string[] };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isTextPair = (value: unknown): value is TextPair =>
  isRecord(value) && nonEmptyString(value.en) && nonEmptyString(value.zh);

const addTextPairError = (value: unknown, path: string, reasons: string[]) => {
  if (!isTextPair(value)) {
    reasons.push(`${path}.en and ${path}.zh are required`);
  }
};

const enumIncludes = <T extends string>(values: readonly T[], value: unknown): value is T =>
  typeof value === "string" && values.includes(value as T);

const optionIds = (question: OptionQuestion) => new Set(question.options.map((option) => option.id));

const sameSet = (left: string[], right: string[]) => {
  if (left.length !== right.length) return false;
  const rightSet = new Set(right);
  return left.every((item) => rightSet.has(item));
};

const extractPlaceholders = (value: string) => {
  const matches = value.matchAll(/\{\{([^{}]+)\}\}/g);
  return Array.from(matches, (match) => match[1].trim());
};

const addBoundedNumberError = (
  value: unknown,
  path: string,
  min: number,
  max: number,
  reasons: string[],
  options: { integer?: boolean } = {},
) => {
  if (value === undefined) return;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    reasons.push(`${path} must be a number`);
    return;
  }
  if (options.integer && !Number.isInteger(value)) reasons.push(`${path} must be an integer`);
  if (value < min || value > max) reasons.push(`${path} must be between ${min} and ${max}`);
};

const validateVisual = (value: unknown, path: string, reasons: string[]) => {
  if (!isRecord(value)) {
    reasons.push(`${path} must be an object`);
    return;
  }
  if (value.kind !== "rhythm_strip") {
    reasons.push(`${path}.kind is invalid`);
    return;
  }
  if (!enumIncludes(rhythmClasses, value.rhythm)) reasons.push(`${path}.rhythm is invalid`);

  const rhythm = value.rhythm as RhythmClass | undefined;
  const minRate = rhythm === "vfib" || rhythm === "asystole" ? 0 : 20;
  addBoundedNumberError(value.rateBpm, `${path}.rateBpm`, minRate, 300, reasons);
  if (value.rateBpm === undefined) reasons.push(`${path}.rateBpm is required`);
  addBoundedNumberError(value.durationSec, `${path}.durationSec`, 3, 12, reasons);
  addBoundedNumberError(value.seed, `${path}.seed`, 0, Number.MAX_SAFE_INTEGER, reasons, { integer: true });
  addBoundedNumberError(value.atrialRateBpm, `${path}.atrialRateBpm`, 20, 400, reasons);
  addBoundedNumberError(value.conductionRatio, `${path}.conductionRatio`, 1, 8, reasons, { integer: true });
  addBoundedNumberError(value.prSec, `${path}.prSec`, 0.06, 0.4, reasons);
  addBoundedNumberError(value.qrsSec, `${path}.qrsSec`, 0.04, 0.24, reasons);
  addBoundedNumberError(value.qtSec, `${path}.qtSec`, 0.16, 0.7, reasons);

  if (value.calibrationPulse !== undefined && typeof value.calibrationPulse !== "boolean") {
    reasons.push(`${path}.calibrationPulse must be a boolean`);
  }
  if (value.caption !== undefined) {
    if (!isRecord(value.caption) || !nonEmptyString(value.caption.en)) {
      reasons.push(`${path}.caption.en is required when caption is present`);
    } else if (value.caption.zh !== undefined && !nonEmptyString(value.caption.zh)) {
      reasons.push(`${path}.caption.zh must be non-empty when present`);
    }
  }
};

export const validateQuestion = (raw: unknown, options: { allowCaseStudy?: boolean } = {}): ValidationResult<Question> => {
  const allowCaseStudy = options.allowCaseStudy ?? true;
  const reasons: string[] = [];
  if (!isRecord(raw)) {
    return { ok: false, reasons: ["question must be an object"] };
  }

  if (!nonEmptyString(raw.id)) reasons.push("missing id");
  if (!enumIncludes(itemTypes, raw.itemType)) {
    reasons.push("invalid itemType");
  } else if (!allowCaseStudy && raw.itemType === "case_study") {
    reasons.push("nested case_study items are not supported");
  }
  if (!enumIncludes(categories, raw.category)) reasons.push("invalid category");
  if (!nonEmptyString(raw.topic)) reasons.push("missing topic");
  if (!enumIncludes(difficulties, raw.difficulty)) reasons.push("invalid difficulty");
  if (raw.ngnSkill !== undefined && !enumIncludes(ngnSkills, raw.ngnSkill)) reasons.push("invalid ngnSkill");
  addTextPairError(raw.stem, "stem", reasons);
  addTextPairError(raw.testTakingStrategy, "testTakingStrategy", reasons);
  if (raw.visual !== undefined) {
    if (raw.itemType === "multiple_choice" || raw.itemType === "select_all" || raw.itemType === "matrix") {
      validateVisual(raw.visual, "visual", reasons);
    } else {
      reasons.push("visual is only supported on multiple_choice, select_all, matrix, and case-study exhibits");
    }
  }

  if (!isRecord(raw.rationale)) {
    reasons.push("missing rationale");
  } else {
    addTextPairError(raw.rationale.correct, "rationale.correct", reasons);
    if (raw.rationale.byChoice !== undefined && !Array.isArray(raw.rationale.byChoice)) {
      reasons.push("rationale.byChoice must be an array when present");
    }
    if (Array.isArray(raw.rationale.byChoice)) {
      raw.rationale.byChoice.forEach((choice, index) => {
        if (!isRecord(choice) || !nonEmptyString(choice.refId) || !nonEmptyString(choice.en) || !nonEmptyString(choice.zh)) {
          reasons.push(`rationale.byChoice[${index}] requires refId, en, and zh`);
        }
      });
    }
  }

  if (!Array.isArray(raw.glossary)) {
    reasons.push("glossary must be an array");
  } else {
    raw.glossary.forEach((term, index) => {
      if (!isRecord(term) || !nonEmptyString(term.termEn) || !nonEmptyString(term.termZh) || !nonEmptyString(term.defZh)) {
        reasons.push(`glossary[${index}] requires termEn, termZh, and defZh`);
      }
    });
  }

  if (reasons.length > 0) return { ok: false, reasons };

  const question = raw as Question;

  if (question.itemType === "multiple_choice" || question.itemType === "select_all" || question.itemType === "ordered_response") {
    validateOptionQuestion(question, reasons);
  } else if (question.itemType === "fill_in_blank") {
    validateFillInBlank(question, reasons);
  } else if (question.itemType === "matrix") {
    validateMatrix(question, reasons);
  } else if (question.itemType === "dropdown_cloze") {
    validateDropdownCloze(question, reasons);
  } else if (question.itemType === "case_study") {
    validateCaseStudy(question, reasons);
  }

  return reasons.length > 0 ? { ok: false, reasons } : { ok: true, value: question };
};

const isStandaloneQuestion = (question: Question): question is StandaloneQuestion => question.itemType !== "case_study";

const validateOptionQuestion = (question: OptionQuestion, reasons: string[]) => {
  if (!Array.isArray(question.options) || question.options.length === 0) {
    reasons.push("option type requires options");
    return;
  }
  const minOptions = question.itemType === "select_all" ? 5 : 3;
  const maxOptions = question.itemType === "select_all" ? 6 : 5;
  if (question.options.length < minOptions || question.options.length > maxOptions) {
    reasons.push(`${question.itemType} requires ${minOptions}-${maxOptions} options`);
  }
  const seen = new Set<string>();
  question.options.forEach((option, index) => {
    if (!isRecord(option) || !nonEmptyString(option.id) || !nonEmptyString(option.en) || !nonEmptyString(option.zh)) {
      reasons.push(`options[${index}] requires id, en, and zh`);
      return;
    }
    if (seen.has(option.id)) reasons.push(`duplicate option id ${option.id}`);
    seen.add(option.id);
  });

  if (!Array.isArray(question.correct) || question.correct.length === 0) {
    reasons.push("option type requires correct");
    return;
  }
  const ids = optionIds(question);
  question.correct.forEach((id) => {
    if (!ids.has(id)) reasons.push(`correct id ${id} is not in options`);
  });
  if (new Set(question.correct).size !== question.correct.length) reasons.push("correct contains duplicate ids");
  if (question.itemType === "multiple_choice" && question.correct.length !== 1) {
    reasons.push("multiple_choice correct must contain exactly one id");
  }
  if (question.itemType === "ordered_response" && !sameSet(question.correct, question.options.map((option) => option.id))) {
    reasons.push("ordered_response correct must be a permutation of every option id");
  }

  const byChoiceIds = new Set(question.rationale.byChoice?.map((choice) => choice.refId));
  if (byChoiceIds.size !== question.options.length || question.options.some((option) => !byChoiceIds.has(option.id))) {
    reasons.push("option types require one rationale.byChoice entry per option");
  }
};

const validateFillInBlank = (question: FillInBlankQuestion, reasons: string[]) => {
  if (!Array.isArray(question.blanks) || question.blanks.length === 0) {
    reasons.push("fill_in_blank requires blanks");
    return;
  }
  const seenBlankIds = new Set<string>();
  question.blanks.forEach((blank, index) => {
    if (!isRecord(blank)) {
      reasons.push(`blanks[${index}] must be an object`);
      return;
    }
    if (!nonEmptyString(blank.id)) reasons.push(`blanks[${index}] requires id`);
    if (nonEmptyString(blank.id)) {
      if (seenBlankIds.has(blank.id)) reasons.push(`duplicate blank id ${blank.id}`);
      seenBlankIds.add(blank.id);
    }
    addTextPairError(blank.prompt, `blanks[${index}].prompt`, reasons);
    const hasAcceptable = Array.isArray(blank.acceptable) && blank.acceptable.some(nonEmptyString);
    const hasNumeric =
      isRecord(blank.numeric) &&
      typeof blank.numeric.value === "number" &&
      typeof blank.numeric.tolerance === "number";
    if (!hasAcceptable && !hasNumeric) reasons.push(`blanks[${index}] requires acceptable or numeric`);
  });
};

const validateMatrix = (question: MatrixQuestion, reasons: string[]) => {
  if (!isRecord(question.matrix) || !Array.isArray(question.matrix.rows) || !Array.isArray(question.matrix.columns)) {
    reasons.push("matrix requires rows and columns");
    return;
  }
  if (question.matrix.selectionMode !== "single_per_row" && question.matrix.selectionMode !== "multiple_per_row") {
    reasons.push("matrix.selectionMode is invalid");
  }
  const rowIds = new Set<string>();
  const columnIds = new Set<string>();
  question.matrix.rows.forEach((row, index) => {
    if (!isRecord(row) || !nonEmptyString(row.id) || !nonEmptyString(row.en) || !nonEmptyString(row.zh)) {
      reasons.push(`matrix.rows[${index}] requires id, en, and zh`);
      return;
    }
    if (rowIds.has(row.id)) reasons.push(`duplicate matrix row id ${row.id}`);
    rowIds.add(row.id);
  });
  question.matrix.columns.forEach((column, index) => {
    if (!isRecord(column) || !nonEmptyString(column.id) || !nonEmptyString(column.en) || !nonEmptyString(column.zh)) {
      reasons.push(`matrix.columns[${index}] requires id, en, and zh`);
      return;
    }
    if (columnIds.has(column.id)) reasons.push(`duplicate matrix column id ${column.id}`);
    columnIds.add(column.id);
  });
  if (!Array.isArray(question.correct) || question.correct.length !== question.matrix.rows.length) {
    reasons.push("matrix correct requires exactly one entry per row");
    return;
  }
  const correctRowIds = new Set<string>();
  question.correct.forEach((entry, index) => {
    if (!isRecord(entry)) {
      reasons.push(`matrix correct[${index}] must be an object`);
      return;
    }
    if (!rowIds.has(entry.rowId)) reasons.push(`matrix correct[${index}] has unknown rowId`);
    if (correctRowIds.has(entry.rowId)) reasons.push(`matrix correct has duplicate rowId ${entry.rowId}`);
    correctRowIds.add(entry.rowId);
    if (!Array.isArray(entry.columnIds) || entry.columnIds.length === 0) {
      reasons.push(`matrix correct[${index}] requires columnIds`);
      return;
    }
    if (new Set(entry.columnIds).size !== entry.columnIds.length) {
      reasons.push(`matrix correct[${index}] contains duplicate columnIds`);
    }
    entry.columnIds.forEach((columnId) => {
      if (!columnIds.has(columnId)) reasons.push(`matrix correct[${index}] has unknown columnId ${columnId}`);
    });
    if (question.matrix.selectionMode === "single_per_row" && entry.columnIds.length !== 1) {
      reasons.push(`matrix single_per_row row ${entry.rowId} must have exactly one columnId`);
    }
  });
  rowIds.forEach((rowId) => {
    if (!correctRowIds.has(rowId)) reasons.push(`matrix correct is missing rowId ${rowId}`);
  });
};

const validateDropdownCloze = (question: Question, reasons: string[]) => {
  if (question.itemType !== "dropdown_cloze") return;
  addTextPairError(question.clozeStem, "clozeStem", reasons);
  if (!isTextPair(question.clozeStem)) return;
  if (!Array.isArray(question.dropdowns) || question.dropdowns.length === 0) {
    reasons.push("dropdown_cloze requires dropdowns");
    return;
  }
  const dropdownIds = new Set<string>();
  question.dropdowns.forEach((dropdown, index) => {
    if (!isRecord(dropdown) || !nonEmptyString(dropdown.id)) {
      reasons.push(`dropdowns[${index}] requires id`);
      return;
    }
    if (dropdownIds.has(dropdown.id)) reasons.push(`duplicate dropdown id ${dropdown.id}`);
    dropdownIds.add(dropdown.id);
  });
  const enPlaceholders = extractPlaceholders(question.clozeStem.en);
  const zhPlaceholders = extractPlaceholders(question.clozeStem.zh);
  const allPlaceholders = new Set([...enPlaceholders, ...zhPlaceholders]);
  dropdownIds.forEach((id) => {
    if (!enPlaceholders.includes(id) || !zhPlaceholders.includes(id)) reasons.push(`dropdown placeholder ${id} must appear in en and zh`);
  });
  allPlaceholders.forEach((id) => {
    if (!dropdownIds.has(id)) reasons.push(`placeholder ${id} has no matching dropdown`);
  });
  question.dropdowns.forEach((dropdown, index) => {
    if (!isRecord(dropdown) || !nonEmptyString(dropdown.id)) return;
    if (!Array.isArray(dropdown.options) || dropdown.options.length === 0) {
      reasons.push(`dropdowns[${index}] requires options`);
      return;
    }
    const ids = new Set<string>();
    dropdown.options.forEach((option, optionIndex) => {
      if (!isRecord(option) || !nonEmptyString(option.id) || !nonEmptyString(option.en) || !nonEmptyString(option.zh)) {
        reasons.push(`dropdowns[${index}].options[${optionIndex}] requires id, en, and zh`);
        return;
      }
      if (ids.has(option.id)) reasons.push(`dropdown ${dropdown.id} has duplicate option id ${option.id}`);
      ids.add(option.id);
    });
    if (!nonEmptyString(dropdown.correct) || !ids.has(dropdown.correct)) {
      reasons.push(`dropdown ${dropdown.id} correct id is not in options`);
    }
  });
};

const validateCaseStudyExhibit = (value: unknown, path: string, seenIds: Set<string>, reasons: string[]) => {
  if (!isRecord(value)) {
    reasons.push(`${path} must be an object`);
    return;
  }
  if (!nonEmptyString(value.id)) {
    reasons.push(`${path} requires id`);
  } else if (seenIds.has(value.id)) {
    reasons.push(`duplicate case exhibit id ${value.id}`);
  } else {
    seenIds.add(value.id);
  }
  addTextPairError(value.title, `${path}.title`, reasons);
  addTextPairError(value.content, `${path}.content`, reasons);
  if (value.visual !== undefined) validateVisual(value.visual, `${path}.visual`, reasons);
};

const validateCaseStudy = (question: CaseStudyQuestion, reasons: string[]) => {
  if (!isRecord(question.caseStudy)) {
    reasons.push("case_study requires caseStudy");
    return;
  }
  addTextPairError(question.caseStudy.title, "caseStudy.title", reasons);
  if (question.caseStudy.summary !== undefined) addTextPairError(question.caseStudy.summary, "caseStudy.summary", reasons);

  const seenExhibitIds = new Set<string>();
  if (!Array.isArray(question.caseStudy.exhibits) || question.caseStudy.exhibits.length === 0) {
    reasons.push("caseStudy.exhibits must include at least one exhibit");
  } else {
    question.caseStudy.exhibits.forEach((exhibit, index) =>
      validateCaseStudyExhibit(exhibit, `caseStudy.exhibits[${index}]`, seenExhibitIds, reasons),
    );
  }

  if (question.caseStudy.stages !== undefined) {
    if (!Array.isArray(question.caseStudy.stages)) {
      reasons.push("caseStudy.stages must be an array when present");
    } else {
      const seenStageIds = new Set<string>();
      question.caseStudy.stages.forEach((stage, stageIndex) => {
        if (!isRecord(stage)) {
          reasons.push(`caseStudy.stages[${stageIndex}] must be an object`);
          return;
        }
        if (!nonEmptyString(stage.id)) {
          reasons.push(`caseStudy.stages[${stageIndex}] requires id`);
        } else if (seenStageIds.has(stage.id)) {
          reasons.push(`duplicate case stage id ${stage.id}`);
        } else {
          seenStageIds.add(stage.id);
        }
        addTextPairError(stage.title, `caseStudy.stages[${stageIndex}].title`, reasons);
        if (!Array.isArray(stage.exhibits) || stage.exhibits.length === 0) {
          reasons.push(`caseStudy.stages[${stageIndex}].exhibits must include at least one exhibit`);
        } else {
          const stageExhibitIds = new Set<string>();
          stage.exhibits.forEach((exhibit, exhibitIndex) =>
            validateCaseStudyExhibit(
              exhibit,
              `caseStudy.stages[${stageIndex}].exhibits[${exhibitIndex}]`,
              stageExhibitIds,
              reasons,
            ),
          );
        }
      });
    }
  }

  if (!Array.isArray(question.caseStudy.questions) || question.caseStudy.questions.length < 2) {
    reasons.push("caseStudy.questions must include at least two embedded questions");
    return;
  }
  if (question.caseStudy.questions.length > 6) {
    reasons.push("caseStudy.questions should not contain more than six embedded questions");
  }

  const seenQuestionIds = new Set<string>();
  question.caseStudy.questions.forEach((caseQuestion, index) => {
    const result = validateQuestion(caseQuestion, { allowCaseStudy: false });
    if (!result.ok) {
      reasons.push(`caseStudy.questions[${index}]: ${result.reasons.join("; ")}`);
      return;
    }
    if (!isStandaloneQuestion(result.value)) {
      reasons.push(`caseStudy.questions[${index}] must be a standalone item type`);
      return;
    }
    if (seenQuestionIds.has(result.value.id)) {
      reasons.push(`caseStudy.questions[${index}]: duplicate embedded question id ${result.value.id}`);
      return;
    }
    if (result.value.id === question.id) {
      reasons.push(`caseStudy.questions[${index}]: embedded question id must differ from parent id`);
    }
    seenQuestionIds.add(result.value.id);
  });
};

export const validateBankObject = (raw: unknown): ValidationResult<BankEnvelope> => {
  const reasons: string[] = [];
  const payload = Array.isArray(raw) ? { questions: raw } : raw;

  if (!isRecord(payload)) return { ok: false, reasons: ["bank must be an object or array"] };

  let schemaVersion: SchemaVersion | undefined;
  if (payload.meta !== undefined) {
    if (!isRecord(payload.meta)) {
      reasons.push("meta must be an object");
    } else if (!enumIncludes(supportedSchemaVersions, payload.meta.schemaVersion)) {
      reasons.push(`meta.schemaVersion must be one of ${supportedSchemaVersions.join(", ")}`);
    } else {
      schemaVersion = payload.meta.schemaVersion;
    }
  }

  if (!Array.isArray(payload.questions)) {
    reasons.push("questions must be an array");
    return { ok: false, reasons };
  }

  const seen = new Set<string>();
  const questions: Question[] = [];
  payload.questions.forEach((question, index) => {
    const result = validateQuestion(question);
    if (!result.ok) {
      reasons.push(`questions[${index}]: ${result.reasons.join("; ")}`);
      return;
    }
    if (schemaVersion === "1.0" && result.value.itemType === "case_study") {
      reasons.push(`questions[${index}]: case_study requires meta.schemaVersion 1.1`);
      return;
    }
    if (
      (schemaVersion === "1.0" || schemaVersion === "1.1") &&
      (result.value.visual !== undefined ||
        (result.value.itemType === "case_study" &&
          (result.value.caseStudy.exhibits.some((exhibit) => exhibit.visual !== undefined) ||
            result.value.caseStudy.stages?.some((stage) => stage.exhibits.some((exhibit) => exhibit.visual !== undefined)))))
    ) {
      reasons.push(`questions[${index}]: visual requires meta.schemaVersion 1.2`);
      return;
    }
    if (seen.has(result.value.id)) {
      reasons.push(`questions[${index}]: duplicate question id ${result.value.id}`);
      return;
    }
    seen.add(result.value.id);
    questions.push(result.value);
  });

  if (reasons.length > 0) return { ok: false, reasons };
  return { ok: true, value: { ...(payload as BankEnvelope), questions } };
};

export const formatValidationReasons = (reasons: string[]) => reasons.join("\n");
