import type {
  BankEnvelope,
  BowtieQuestion,
  CaseStudyQuestion,
  Category,
  Difficulty,
  FillInBlankQuestion,
  HighlightQuestion,
  ItemType,
  MatrixQuestion,
  NgnSkill,
  OptionQuestion,
  Question,
  SchemaVersion,
  StandaloneQuestion,
  StandaloneItemType,
  TextPair,
} from "./types";
import { allowedKeySets } from "./allowedKeys";
import { getVisual, VISUAL_ITEM_TYPES, type VisualError } from "./visuals/registry";
import "./visuals/kinds"; // register every visual kind for validation (React-free)
export { rhythmClasses } from "./visuals/kinds/rhythmStrip";

export const SCHEMA_VERSION = "1.6";

export const supportedSchemaVersions = ["1.0", "1.1", "1.2", "1.3", "1.4", "1.5", "1.6"] as const satisfies readonly SchemaVersion[];

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

export const NCLEX_CATEGORY_WEIGHTS: Record<Category, number> = {
  "Management of Care": 0.18,
  "Pharmacological and Parenteral Therapies": 0.16,
  "Physiological Adaptation": 0.14,
  "Safety and Infection Control": 0.13,
  "Reduction of Risk Potential": 0.12,
  "Health Promotion and Maintenance": 0.09,
  "Psychosocial Integrity": 0.09,
  "Basic Care and Comfort": 0.09,
};

const categoryWeightEntries = categories.map((category) => [
  category,
  NCLEX_CATEGORY_WEIGHTS[category],
] as const);
for (const [category, weight] of categoryWeightEntries) {
  if (!Number.isFinite(weight) || weight <= 0) {
    throw new Error(`NCLEX category weight for "${category}" must be a positive finite number`);
  }
}
const categoryWeightTotal = categoryWeightEntries.reduce((sum, [, weight]) => sum + weight, 0);
if (Math.abs(categoryWeightTotal - 1) > 1e-9) {
  throw new Error(`NCLEX category weights must sum to 1.00; received ${categoryWeightTotal}`);
}

export const standaloneItemTypes = [
  "multiple_choice",
  "select_all",
  "ordered_response",
  "fill_in_blank",
  "matrix",
  "dropdown_cloze",
  "highlight",
  "bowtie",
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

// U+FFFD (replacement character) in any string field means encoding corruption
// (mojibake from a non-UTF-8 round-trip) — it is never legitimate content. Walk
// every nested string so the check covers options, exhibits, visual captions,
// embedded sub-questions, etc., regardless of shape. Schema validation otherwise
// only sees a "plausible" string and lets the corruption through.
const scanForReplacementChar = (value: unknown, path: string, reasons: string[]): void => {
  if (typeof value === "string") {
    if (value.includes("�")) {
      reasons.push(`${path || "question"} contains a U+FFFD replacement character (encoding corruption)`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => scanForReplacementChar(item, `${path}[${index}]`, reasons));
    return;
  }
  if (isRecord(value)) {
    for (const [key, child] of Object.entries(value)) {
      scanForReplacementChar(child, path ? `${path}.${key}` : key, reasons);
    }
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

const schemaOrder: readonly string[] = supportedSchemaVersions;
const cmpSchema = (a: string, b: string) => schemaOrder.indexOf(a) - schemaOrder.indexOf(b);

const formatVisualError = (basePath: string, err: VisualError) =>
  err.path ? `${basePath}.${err.path} ${err.message}` : `${basePath} ${err.message}`;

type ValidateQuestionOptions = {
  allowCaseStudy?: boolean;
  rejectUnknownKeys?: boolean;
};

type ValidateBankOptions = {
  rejectUnknownKeys?: boolean;
};

const keySet = (keys: readonly string[]) => new Set<string>(keys);

const unknownKeys = (
  value: unknown,
  path: string,
  objectType: string,
  allowed: ReadonlySet<string>,
  reasons: string[],
) => {
  if (!isRecord(value)) return;
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      reasons.push(`${path || objectType} has unknown key '${key}'`);
    }
  }
};

const collectTextPairUnknownKeys = (value: unknown, path: string, reasons: string[]) => {
  unknownKeys(value, path, "textPair", keySet(allowedKeySets.textPair), reasons);
};

const collectVisualUnknownKeys = (value: unknown, path: string, reasons: string[]) => {
  if (!isRecord(value)) return;
  const kind = typeof value.kind === "string" ? value.kind : "unknown";
  const kindKeys = kind in allowedKeySets.visualByKind
    ? allowedKeySets.visualByKind[kind as keyof typeof allowedKeySets.visualByKind]
    : [];
  unknownKeys(value, path, `visual:${kind}`, keySet([...allowedKeySets.visualCommon, ...kindKeys]), reasons);

  if (value.caption !== undefined) collectTextPairUnknownKeys(value.caption, `${path}.caption`, reasons);
  if (value.rosc !== undefined) unknownKeys(value.rosc, `${path}.rosc`, "rosc", keySet(allowedKeySets.rosc), reasons);
  if (value.time !== undefined) unknownKeys(value.time, `${path}.time`, "visualTime", keySet(allowedKeySets.visualTime), reasons);
  if (Array.isArray(value.series)) {
    const seriesType = kind === "lab_trend" ? "labSeries" : "vitalsSeries";
    const allowed = keySet(seriesType === "labSeries" ? allowedKeySets.labSeries : allowedKeySets.vitalsSeries);
    value.series.forEach((entry, index) => unknownKeys(entry, `${path}.series[${index}]`, seriesType, allowed, reasons));
  }
  if (Array.isArray(value.medications)) {
    value.medications.forEach((medication, index) => {
      const medicationPath = `${path}.medications[${index}]`;
      unknownKeys(medication, medicationPath, "marMedication", keySet(allowedKeySets.marMedication), reasons);
      if (isRecord(medication) && Array.isArray(medication.administrations)) {
        medication.administrations.forEach((administration, adminIndex) =>
          unknownKeys(administration, `${medicationPath}.administrations[${adminIndex}]`, "marAdministration", keySet(allowedKeySets.marAdministration), reasons),
        );
      }
    });
  }
  for (const entryKey of ["intake", "output"] as const) {
    if (Array.isArray(value[entryKey])) {
      value[entryKey].forEach((entry, index) =>
        unknownKeys(entry, `${path}.${entryKey}[${index}]`, "ioEntry", keySet(allowedKeySets.ioEntry), reasons),
      );
    }
  }
  if (value.periodLabel !== undefined) collectTextPairUnknownKeys(value.periodLabel, `${path}.periodLabel`, reasons);
  if (value.title !== undefined) collectTextPairUnknownKeys(value.title, `${path}.title`, reasons);
  if (Array.isArray(value.fields)) {
    value.fields.forEach((field, index) => unknownKeys(field, `${path}.fields[${index}]`, "medLabelField", keySet(allowedKeySets.medLabelField), reasons));
  }
  if (Array.isArray(value.settings)) {
    value.settings.forEach((setting, index) => unknownKeys(setting, `${path}.settings[${index}]`, "deviceSetting", keySet(allowedKeySets.deviceSetting), reasons));
  }
  if (Array.isArray(value.contractions)) {
    value.contractions.forEach((contraction, index) =>
      unknownKeys(contraction, `${path}.contractions[${index}]`, "fetalContraction", keySet(allowedKeySets.fetalContraction), reasons),
    );
  }
  if (Array.isArray(value.accelerations)) {
    value.accelerations.forEach((acceleration, index) =>
      unknownKeys(acceleration, `${path}.accelerations[${index}]`, "fetalAcceleration", keySet(allowedKeySets.fetalAcceleration), reasons),
    );
  }
  if (Array.isArray(value.decelerations)) {
    value.decelerations.forEach((deceleration, index) =>
      unknownKeys(deceleration, `${path}.decelerations[${index}]`, "fetalDeceleration", keySet(allowedKeySets.fetalDeceleration), reasons),
    );
  }
};

const collectQuestionMetaUnknownKeys = (value: unknown, path: string, reasons: string[]) => {
  unknownKeys(value, path, "questionMeta", keySet(allowedKeySets.questionMeta), reasons);
  if (!isRecord(value)) return;
  if (Array.isArray(value.expected_trend)) {
    value.expected_trend.forEach((entry, index) =>
      unknownKeys(entry, `${path}.expected_trend[${index}]`, "expectedTrend", keySet(allowedKeySets.expectedTrend), reasons),
    );
  }
  if (Array.isArray(value.expected_flags)) {
    value.expected_flags.forEach((entry, index) =>
      unknownKeys(entry, `${path}.expected_flags[${index}]`, "expectedFlag", keySet(allowedKeySets.expectedFlag), reasons),
    );
  }
  if (Array.isArray(value.reference_bands)) {
    value.reference_bands.forEach((entry, index) =>
      unknownKeys(entry, `${path}.reference_bands[${index}]`, "referenceBand", keySet(allowedKeySets.referenceBand), reasons),
    );
  }
};

const collectRationaleUnknownKeys = (value: unknown, path: string, reasons: string[]) => {
  unknownKeys(value, path, "rationale", keySet(allowedKeySets.rationale), reasons);
  if (!isRecord(value)) return;
  if (value.correct !== undefined) collectTextPairUnknownKeys(value.correct, `${path}.correct`, reasons);
  if (Array.isArray(value.byChoice)) {
    value.byChoice.forEach((choice, index) =>
      unknownKeys(choice, `${path}.byChoice[${index}]`, "rationaleChoice", keySet(allowedKeySets.rationaleChoice), reasons),
    );
  }
  if (Array.isArray(value.visuals)) {
    value.visuals.forEach((visual, index) => collectVisualUnknownKeys(visual, `${path}.visuals[${index}]`, reasons));
  }
};

const collectOptionsUnknownKeys = (value: unknown, path: string, reasons: string[]) => {
  if (!Array.isArray(value)) return;
  value.forEach((option, index) => unknownKeys(option, `${path}[${index}]`, "option", keySet(allowedKeySets.option), reasons));
};

const collectCaseStudyExhibitUnknownKeys = (value: unknown, path: string, reasons: string[]) => {
  unknownKeys(value, path, "caseStudyExhibit", keySet(allowedKeySets.caseStudyExhibit), reasons);
  if (!isRecord(value)) return;
  collectTextPairUnknownKeys(value.title, `${path}.title`, reasons);
  collectTextPairUnknownKeys(value.content, `${path}.content`, reasons);
  if (value.visual !== undefined) collectVisualUnknownKeys(value.visual, `${path}.visual`, reasons);
};

const collectQuestionUnknownKeys = (
  value: unknown,
  path: string,
  reasons: string[],
  options: { caseSubQuestion?: boolean } = {},
) => {
  if (!isRecord(value)) return;
  const itemType = typeof value.itemType === "string" ? value.itemType : "unknown";
  const itemTypeKeys = itemType in allowedKeySets.questionByItemType
    ? allowedKeySets.questionByItemType[itemType as ItemType]
    : [];
  const caseSubQuestionKeys = options.caseSubQuestion ? allowedKeySets.caseSubQuestion : [];
  unknownKeys(
    value,
    path,
    `question:${itemType}`,
    keySet([...allowedKeySets.questionCommon, ...itemTypeKeys, ...caseSubQuestionKeys]),
    reasons,
  );

  collectTextPairUnknownKeys(value.stem, `${path}.stem`, reasons);
  collectTextPairUnknownKeys(value.testTakingStrategy, `${path}.testTakingStrategy`, reasons);
  if (value.rationale !== undefined) collectRationaleUnknownKeys(value.rationale, `${path}.rationale`, reasons);
  if (value.visual !== undefined) collectVisualUnknownKeys(value.visual, `${path}.visual`, reasons);
  if (value.meta !== undefined) collectQuestionMetaUnknownKeys(value.meta, `${path}.meta`, reasons);
  if (Array.isArray(value.glossary)) {
    value.glossary.forEach((term, index) =>
      unknownKeys(term, `${path}.glossary[${index}]`, "glossaryTerm", keySet(allowedKeySets.glossaryTerm), reasons),
    );
  }
  if (Array.isArray(value.options)) collectOptionsUnknownKeys(value.options, `${path}.options`, reasons);
  if (Array.isArray(value.blanks)) {
    value.blanks.forEach((blank, index) => {
      const blankPath = `${path}.blanks[${index}]`;
      unknownKeys(blank, blankPath, "blank", keySet(allowedKeySets.blank), reasons);
      if (isRecord(blank)) {
        collectTextPairUnknownKeys(blank.prompt, `${blankPath}.prompt`, reasons);
        if (blank.numeric !== undefined) unknownKeys(blank.numeric, `${blankPath}.numeric`, "blankNumeric", keySet(allowedKeySets.blankNumeric), reasons);
      }
    });
  }
  if (isRecord(value.matrix)) {
    unknownKeys(value.matrix, `${path}.matrix`, "matrix", keySet(allowedKeySets.matrix), reasons);
    collectOptionsUnknownKeys(value.matrix.rows, `${path}.matrix.rows`, reasons);
    collectOptionsUnknownKeys(value.matrix.columns, `${path}.matrix.columns`, reasons);
  }
  if (Array.isArray(value.correct) && itemType === "matrix") {
    value.correct.forEach((entry, index) =>
      unknownKeys(entry, `${path}.correct[${index}]`, "matrixCorrect", keySet(allowedKeySets.matrixCorrect), reasons),
    );
  }
  if (value.clozeStem !== undefined) collectTextPairUnknownKeys(value.clozeStem, `${path}.clozeStem`, reasons);
  if (Array.isArray(value.dropdowns)) {
    value.dropdowns.forEach((dropdown, index) => {
      const dropdownPath = `${path}.dropdowns[${index}]`;
      unknownKeys(dropdown, dropdownPath, "dropdown", keySet(allowedKeySets.dropdown), reasons);
      if (isRecord(dropdown)) collectOptionsUnknownKeys(dropdown.options, `${dropdownPath}.options`, reasons);
    });
  }
  if (isRecord(value.highlight)) {
    unknownKeys(value.highlight, `${path}.highlight`, "highlight", keySet(allowedKeySets.highlight), reasons);
    if (Array.isArray(value.highlight.segments)) {
      value.highlight.segments.forEach((segment, index) =>
        unknownKeys(segment, `${path}.highlight.segments[${index}]`, "highlightSegment", keySet(allowedKeySets.highlightSegment), reasons),
      );
    }
  }
  if (isRecord(value.bowtie)) {
    unknownKeys(value.bowtie, `${path}.bowtie`, "bowtie", keySet(allowedKeySets.bowtie), reasons);
    for (const zoneName of ["condition", "actions", "parameters"] as const) {
      const zone = value.bowtie[zoneName];
      const zonePath = `${path}.bowtie.${zoneName}`;
      unknownKeys(zone, zonePath, "bowtieZone", keySet(allowedKeySets.bowtieZone), reasons);
      if (isRecord(zone)) {
        if (zone.prompt !== undefined) collectTextPairUnknownKeys(zone.prompt, `${zonePath}.prompt`, reasons);
        if (Array.isArray(zone.tokens)) {
          zone.tokens.forEach((token, index) =>
            unknownKeys(token, `${zonePath}.tokens[${index}]`, "bowtieToken", keySet(allowedKeySets.bowtieToken), reasons),
          );
        }
      }
    }
  }
  if (isRecord(value.caseStudy)) {
    const casePath = `${path}.caseStudy`;
    unknownKeys(value.caseStudy, casePath, "caseStudy", keySet(allowedKeySets.caseStudy), reasons);
    collectTextPairUnknownKeys(value.caseStudy.title, `${casePath}.title`, reasons);
    if (value.caseStudy.summary !== undefined) collectTextPairUnknownKeys(value.caseStudy.summary, `${casePath}.summary`, reasons);
    if (Array.isArray(value.caseStudy.exhibits)) {
      value.caseStudy.exhibits.forEach((exhibit, index) =>
        collectCaseStudyExhibitUnknownKeys(exhibit, `${casePath}.exhibits[${index}]`, reasons),
      );
    }
    if (Array.isArray(value.caseStudy.stages)) {
      value.caseStudy.stages.forEach((stage, index) => {
        const stagePath = `${casePath}.stages[${index}]`;
        unknownKeys(stage, stagePath, "caseStudyStage", keySet(allowedKeySets.caseStudyStage), reasons);
        if (isRecord(stage)) {
          collectTextPairUnknownKeys(stage.title, `${stagePath}.title`, reasons);
          if (stage.trigger !== undefined) collectTextPairUnknownKeys(stage.trigger, `${stagePath}.trigger`, reasons);
          if (stage.narrative !== undefined) collectTextPairUnknownKeys(stage.narrative, `${stagePath}.narrative`, reasons);
          if (Array.isArray(stage.exhibits)) {
            stage.exhibits.forEach((exhibit, exhibitIndex) =>
              collectCaseStudyExhibitUnknownKeys(exhibit, `${stagePath}.exhibits[${exhibitIndex}]`, reasons),
            );
          }
        }
      });
    }
    if (Array.isArray(value.caseStudy.questions)) {
      value.caseStudy.questions.forEach((caseQuestion, index) =>
        collectQuestionUnknownKeys(caseQuestion, `${casePath}.questions[${index}]`, reasons, { caseSubQuestion: true }),
      );
    }
  }
};

/**
 * Registry-driven visual validation. Resolves the kind module and delegates
 * structural/range checks (validate), placement (allowedItemTypes), schema-floor
 * (requiredSchemaVersion), and render-vs-answer gates (selfCheck) to it. Adding a
 * kind requires no edit here — the kind module owns its rules.
 *
 * Behavior-preserving: the composed report strings match the previous inline
 * rhythm-strip checks byte-for-byte (see scripts/tests/__snapshots__/visual-parity.json).
 *
 * `itemType` is supplied for standalone questions (enables placement check) and
 * omitted for case-study exhibits (which carry no item type). `schemaVersion` is
 * accepted for the registry-mechanics test; production schema-floor enforcement
 * stays at the bank level in validateBankObject.
 */
export const validateVisual = (
  value: unknown,
  basePath: string,
  reasons: string[],
  options: { itemType?: ItemType; schemaVersion?: string; question?: Question } = {},
) => {
  if (!isRecord(value)) {
    reasons.push(`${basePath} must be an object`);
    return;
  }
  const mod = typeof value.kind === "string" ? getVisual(value.kind) : undefined;
  if (!mod) {
    reasons.push(`${basePath}.kind is invalid`);
    return;
  }
  if (options.itemType !== undefined) {
    const allowed = mod.allowedItemTypes ?? VISUAL_ITEM_TYPES;
    if (!allowed.includes(options.itemType)) {
      reasons.push(
        mod.allowedItemTypes
          ? `visual of kind ${mod.kind} is not allowed on ${options.itemType}`
          : "visual is only supported on multiple_choice, select_all, matrix, and case-study exhibits",
      );
      return;
    }
  }
  if (options.schemaVersion !== undefined && cmpSchema(options.schemaVersion, mod.requiredSchemaVersion ?? "1.2") < 0) {
    reasons.push(`${basePath} requires schema ${mod.requiredSchemaVersion ?? "1.2"}`);
  }
  const initialReasonsLen = reasons.length;
  for (const err of mod.validate(value as never)) reasons.push(formatVisualError(basePath, err));
  if (mod.selfCheck && options.question && reasons.length === initialReasonsLen) {
    for (const err of mod.selfCheck(value as never, options.question)) reasons.push(formatVisualError(basePath, err));
  }
};

export const validateQuestion = (raw: unknown, options: ValidateQuestionOptions = {}): ValidationResult<Question> => {
  const allowCaseStudy = options.allowCaseStudy ?? true;
  const reasons: string[] = [];
  if (!isRecord(raw)) {
    return { ok: false, reasons: ["question must be an object"] };
  }

  if (options.rejectUnknownKeys === true) {
    collectQuestionUnknownKeys(raw, "question", reasons);
  }
  scanForReplacementChar(raw, "", reasons);

  if (!nonEmptyString(raw.id)) reasons.push("missing id");
  if (raw._compileManifest !== undefined) {
    reasons.push("_compileManifest is raw-only and must be stripped before canonical/import validation");
  }
  if (!enumIncludes(itemTypes, raw.itemType)) {
    reasons.push("invalid itemType");
  } else if (!allowCaseStudy && raw.itemType === "case_study") {
    reasons.push("nested case_study items are not supported");
  }
  if (!enumIncludes(categories, raw.category)) reasons.push("invalid category");
  if (!nonEmptyString(raw.topic)) {
    reasons.push("missing topic");
  } else if (/[　-〿぀-ゟ゠-ヿ㐀-䶿一-鿿豈-﫿＀-￯]/.test(raw.topic as string)) {
    reasons.push("topic must be English-only (no CJK characters)");
  }
  if (!enumIncludes(difficulties, raw.difficulty)) reasons.push("invalid difficulty");
  if (raw.ngnSkill !== undefined && !enumIncludes(ngnSkills, raw.ngnSkill)) reasons.push("invalid ngnSkill");
  addTextPairError(raw.stem, "stem", reasons);
  addTextPairError(raw.testTakingStrategy, "testTakingStrategy", reasons);
  if (raw.visual !== undefined) {
    validateVisual(raw.visual, "visual", reasons, {
      itemType: raw.itemType as ItemType,
      question: raw as unknown as Question,
    });
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
    if (raw.rationale.visuals !== undefined) {
      if (!Array.isArray(raw.rationale.visuals)) {
        reasons.push("rationale.visuals must be an array when present");
      } else if (raw.rationale.visuals.length === 0) {
        reasons.push("rationale.visuals must not be empty (omit the field for no visuals)");
      } else if (raw.rationale.visuals.length > 6) {
        reasons.push("rationale.visuals must contain at most 6 entries");
      } else {
        raw.rationale.visuals.forEach((visual, index) => {
          validateVisual(visual, `rationale.visuals[${index}]`, reasons);
        });
      }
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
  } else if (question.itemType === "highlight") {
    validateHighlight(question, reasons);
  } else if (question.itemType === "bowtie") {
    validateBowtie(question, reasons);
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
  const maxOptions = question.itemType === "select_all" || question.itemType === "ordered_response" ? 6 : 5;
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
    const correctOption = dropdown.options.find((option) => isRecord(option) && option.id === dropdown.correct);
    if (isRecord(correctOption)) {
      (["en", "zh"] as const).forEach((locale) => {
        const answer = correctOption[locale];
        if (nonEmptyString(answer) && question.clozeStem[locale].includes(answer)) {
          reasons.push(`dropdown ${dropdown.id} leaks its correct answer in clozeStem.${locale}`);
        }
      });
    }
  });
};

const validateHighlight = (question: HighlightQuestion, reasons: string[]) => {
  if (!isRecord(question.highlight)) {
    reasons.push("highlight requires highlight");
    return;
  }
  if (!Array.isArray(question.highlight.segments) || question.highlight.segments.length === 0) {
    reasons.push("highlight requires segments");
    return;
  }

  const segmentIds = new Set<string>();
  const selectableIds = new Set<string>();
  question.highlight.segments.forEach((segment, index) => {
    if (
      !isRecord(segment) ||
      !nonEmptyString(segment.id) ||
      !nonEmptyString(segment.en) ||
      !nonEmptyString(segment.zh)
    ) {
      reasons.push(`highlight.segments[${index}] requires id, en, and zh`);
      return;
    }
    if (segment.selectable !== undefined && typeof segment.selectable !== "boolean") {
      reasons.push(`highlight.segments[${index}].selectable must be boolean when present`);
    }
    if (segmentIds.has(segment.id)) reasons.push(`duplicate highlight segment id ${segment.id}`);
    segmentIds.add(segment.id);
    if (segment.selectable === true) selectableIds.add(segment.id);
  });

  if (selectableIds.size === 0) reasons.push("highlight requires at least one selectable segment");
  if (!Array.isArray(question.highlight.correct) || question.highlight.correct.length === 0) {
    reasons.push("highlight requires correct");
    return;
  }
  if (new Set(question.highlight.correct).size !== question.highlight.correct.length) {
    reasons.push("highlight correct contains duplicate ids");
  }
  question.highlight.correct.forEach((id) => {
    if (!selectableIds.has(id)) reasons.push(`highlight correct id ${id} is not a selectable segment`);
  });
  if (question.highlight.correct.length >= selectableIds.size) {
    reasons.push("highlight must include at least one selectable distractor");
  }

  const seenRationaleIds = new Set<string>();
  question.rationale.byChoice?.forEach((choice) => {
    if (seenRationaleIds.has(choice.refId)) {
      reasons.push(`rationale.byChoice contains duplicate refId ${choice.refId}`);
    }
    seenRationaleIds.add(choice.refId);
    if (!selectableIds.has(choice.refId)) {
      reasons.push(`rationale.byChoice refId ${choice.refId} is not a selectable highlight segment`);
    }
  });
};

const validateBowtie = (question: BowtieQuestion, reasons: string[]) => {
  if (!isRecord(question.bowtie)) {
    reasons.push("bowtie requires bowtie");
    return;
  }

  const allTokenIds = new Set<string>();
  const zones = [
    ["condition", question.bowtie.condition, 1],
    ["actions", question.bowtie.actions, 2],
    ["parameters", question.bowtie.parameters, 2],
  ] as const;

  for (const [zoneName, zone, correctCount] of zones) {
    if (!isRecord(zone)) {
      reasons.push(`bowtie.${zoneName} must be an object`);
      continue;
    }
    if (zone.prompt !== undefined) {
      addTextPairError(zone.prompt, `bowtie.${zoneName}.prompt`, reasons);
    }
    if (!Array.isArray(zone.tokens) || zone.tokens.length === 0) {
      reasons.push(`bowtie.${zoneName}.tokens must be a non-empty array`);
      continue;
    }

    const tokenIds = new Set<string>();
    const enTexts = new Set<string>();
    const zhTexts = new Set<string>();
    zone.tokens.forEach((token, index) => {
      if (!isRecord(token) || !nonEmptyString(token.id) || !nonEmptyString(token.en) || !nonEmptyString(token.zh)) {
        reasons.push(`bowtie.${zoneName}.tokens[${index}] requires id, en, and zh`);
        return;
      }
      if (allTokenIds.has(token.id)) reasons.push(`duplicate bowtie token id ${token.id}`);
      allTokenIds.add(token.id);
      tokenIds.add(token.id);
      if (enTexts.has(token.en)) reasons.push(`bowtie.${zoneName} has duplicate en token text ${token.en}`);
      if (zhTexts.has(token.zh)) reasons.push(`bowtie.${zoneName} has duplicate zh token text ${token.zh}`);
      enTexts.add(token.en);
      zhTexts.add(token.zh);
    });
    const correctIds = zoneName === "condition"
      ? (nonEmptyString(zone.correct) ? [zone.correct] : [])
      : (Array.isArray(zone.correct) ? zone.correct : []);
    if (zoneName === "condition" && !nonEmptyString(zone.correct)) {
      reasons.push("bowtie.condition.correct must be a token id");
    }
    if (zoneName !== "condition" && (!Array.isArray(zone.correct) || zone.correct.length !== correctCount)) {
      reasons.push(`bowtie.${zoneName}.correct must contain exactly ${correctCount} ids`);
    }
    if (new Set(correctIds).size !== correctIds.length) {
      reasons.push(`bowtie.${zoneName}.correct contains duplicate ids`);
    }
    correctIds.forEach((id) => {
      if (!tokenIds.has(id)) reasons.push(`bowtie.${zoneName}.correct id ${id} is not in that zone's tokens`);
    });
    if (zone.tokens.length <= correctCount) {
      reasons.push(`bowtie.${zoneName} must include at least one distractor`);
    }
  }

  const seenRationaleIds = new Set<string>();
  question.rationale.byChoice?.forEach((choice) => {
    if (seenRationaleIds.has(choice.refId)) {
      reasons.push(`rationale.byChoice contains duplicate refId ${choice.refId}`);
    }
    seenRationaleIds.add(choice.refId);
    if (!allTokenIds.has(choice.refId)) {
      reasons.push(`rationale.byChoice refId ${choice.refId} is not a bowtie token`);
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
  if (value.type !== undefined && !nonEmptyString(value.type)) {
    reasons.push(`${path}.type must be non-empty when present`);
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
        if (stage.trigger !== undefined) addTextPairError(stage.trigger, `caseStudy.stages[${stageIndex}].trigger`, reasons);
        if (stage.narrative !== undefined) addTextPairError(stage.narrative, `caseStudy.stages[${stageIndex}].narrative`, reasons);
        if (stage.timeOffset !== undefined && !nonEmptyString(stage.timeOffset)) {
          reasons.push(`caseStudy.stages[${stageIndex}].timeOffset must be non-empty when present`);
        }
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
    if (caseQuestion.itemType === "bowtie") {
      reasons.push(`caseStudy.questions[${index}]: bowtie may not be embedded in a case study (standalone item type)`);
      return;
    }
    if (caseQuestion.stageId !== undefined && !nonEmptyString(caseQuestion.stageId)) {
      reasons.push(`caseStudy.questions[${index}].stageId must be non-empty when present`);
    }
    if (caseQuestion.answerableAfterStageId !== undefined && !nonEmptyString(caseQuestion.answerableAfterStageId)) {
      reasons.push(`caseStudy.questions[${index}].answerableAfterStageId must be non-empty when present`);
    }
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

const hasRationaleVisuals = (question: Question): boolean => {
  if (Array.isArray(question.rationale.visuals) && question.rationale.visuals.length > 0) return true;
  if (question.itemType === "case_study") {
    return question.caseStudy.questions.some(
      (caseQuestion) => Array.isArray(caseQuestion.rationale.visuals) && caseQuestion.rationale.visuals.length > 0,
    );
  }
  return false;
};

const hasSchema16CaseFields = (question: Question): boolean => {
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
  return question.caseStudy.questions.some((caseQuestion) =>
    caseQuestion.stageId !== undefined ||
    caseQuestion.answerableAfterStageId !== undefined
  );
};

export const validateBankObject = (raw: unknown, options: ValidateBankOptions = {}): ValidationResult<BankEnvelope> => {
  const reasons: string[] = [];
  const payload = Array.isArray(raw) ? { questions: raw } : raw;

  if (!isRecord(payload)) return { ok: false, reasons: ["bank must be an object or array"] };

  if (options.rejectUnknownKeys === true) {
    unknownKeys(payload, "$", "bank", keySet(allowedKeySets.bank), reasons);
    if (payload.meta !== undefined) {
      unknownKeys(payload.meta, "$.meta", "bankMeta", keySet(allowedKeySets.bankMeta), reasons);
    }
    if (Array.isArray(payload.questions)) {
      payload.questions.forEach((question, index) =>
        collectQuestionUnknownKeys(question, `questions[${index}]`, reasons),
      );
    }
  }

  let schemaVersion: SchemaVersion | undefined;
  let meta: Record<string, unknown> | undefined;
  if (payload.meta !== undefined) {
    if (!isRecord(payload.meta)) {
      reasons.push("meta must be an object");
    } else {
      meta = payload.meta;
      if (!enumIncludes(supportedSchemaVersions, meta.schemaVersion)) {
        reasons.push(`meta.schemaVersion must be one of ${supportedSchemaVersions.join(", ")}`);
      } else {
        schemaVersion = meta.schemaVersion;
      }
    }
  }

  if (!Array.isArray(payload.questions)) {
    reasons.push("questions must be an array");
    return { ok: false, reasons };
  }
  if (meta?.count !== undefined) {
    if (typeof meta.count !== "number" || !Number.isInteger(meta.count) || meta.count < 0) {
      reasons.push("meta.count must be a non-negative integer");
    } else if (meta.count !== payload.questions.length) {
      reasons.push(`meta.count ${meta.count} does not match questions.length ${payload.questions.length}`);
    }
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
      schemaVersion !== undefined &&
      cmpSchema(schemaVersion, "1.3") < 0 &&
      (result.value.itemType === "highlight" ||
        (result.value.itemType === "case_study" &&
          result.value.caseStudy.questions.some((caseQuestion) => caseQuestion.itemType === "highlight")))
    ) {
      reasons.push(`questions[${index}]: highlight requires meta.schemaVersion 1.3`);
      return;
    }
    if (
      schemaVersion !== undefined &&
      cmpSchema(schemaVersion, "1.4") < 0 &&
      result.value.itemType === "bowtie"
    ) {
      reasons.push(`questions[${index}]: bowtie requires meta.schemaVersion 1.4`);
      return;
    }
    if (
      schemaVersion !== undefined &&
      cmpSchema(schemaVersion, "1.5") < 0 &&
      hasRationaleVisuals(result.value)
    ) {
      reasons.push(`questions[${index}]: rationale.visuals requires meta.schemaVersion 1.5`);
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
    if (
      schemaVersion !== undefined &&
      cmpSchema(schemaVersion, "1.6") < 0 &&
      hasSchema16CaseFields(result.value)
    ) {
      reasons.push(`questions[${index}]: unfolding case-study metadata requires meta.schemaVersion 1.6`);
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
