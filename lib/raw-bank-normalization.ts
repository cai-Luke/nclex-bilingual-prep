import type { BankEnvelope } from "../src/types";

export type RawNormalizationChange = {
  questionId?: string;
  path: string;
  from?: unknown;
  to?: unknown;
  note: string;
};

export type RawNormalizationResult = {
  bank: unknown;
  changes: RawNormalizationChange[];
};

const NGN_SKILL_BY_NORMALIZED: Record<string, string> = {
  recognize_cues: "recognize_cues",
  analyze_cues: "analyze_cues",
  prioritize_hypotheses: "prioritize_hypotheses",
  generate_solutions: "generate_solutions",
  take_action: "take_action",
  evaluate_outcomes: "evaluate_outcomes",
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const cloneJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const normalizeToken = (value: string): string =>
  value
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const normalizeNgnSkill = (value: unknown): string | undefined => {
  if (!nonEmptyString(value)) return undefined;
  return NGN_SKILL_BY_NORMALIZED[normalizeToken(value)];
};

const pickString = (...values: unknown[]): string | undefined => {
  for (const value of values) {
    if (nonEmptyString(value)) return value.trim();
  }
  return undefined;
};

const pickNestedString = (value: unknown, key: "en" | "zh"): string | undefined =>
  isRecord(value) ? pickString(value[key]) : undefined;

const normalizeGlossaryTerm = (term: unknown): Record<string, string> | undefined => {
  if (!isRecord(term)) return undefined;
  const termEn = pickString(
    term.termEn,
    term.en,
    term.termEnglish,
    term.english,
    pickNestedString(term.term, "en"),
  );
  const termZh = pickString(
    term.termZh,
    term.zh,
    term.termChinese,
    term.chinese,
    pickNestedString(term.term, "zh"),
  );
  const defZh = pickString(
    term.defZh,
    term.definitionZh,
    term.chineseDefinition,
    pickNestedString(term.definition, "zh"),
    pickNestedString(term.def, "zh"),
    term.definition,
    term.def,
  );
  if (!termEn || !termZh || !defZh) return undefined;
  return { termEn, termZh, defZh };
};

const normalizeQuestion = (
  question: unknown,
  path: string,
  changes: RawNormalizationChange[],
): unknown => {
  if (!isRecord(question)) return question;
  const id = nonEmptyString(question.id) ? question.id : undefined;

  if (question.ngnSkill !== undefined) {
    const normalized = normalizeNgnSkill(question.ngnSkill);
    if (normalized && normalized !== question.ngnSkill) {
      changes.push({
        questionId: id,
        path: `${path}.ngnSkill`,
        from: question.ngnSkill,
        to: normalized,
        note: "normalized NGN skill enum spelling/casing",
      });
      question.ngnSkill = normalized;
    }
  }

  if (Array.isArray(question.glossary)) {
    const nextGlossary = question.glossary.map((term) => normalizeGlossaryTerm(term) ?? term);
    if (JSON.stringify(nextGlossary) !== JSON.stringify(question.glossary)) {
      changes.push({
        questionId: id,
        path: `${path}.glossary`,
        note: "normalized glossary terms to { termEn, termZh, defZh }",
      });
      question.glossary = nextGlossary;
    }
  }

  if (isRecord(question.rationale) && Array.isArray(question.rationale.visuals) && question.rationale.visuals.length === 0) {
    delete question.rationale.visuals;
    changes.push({
      questionId: id,
      path: `${path}.rationale.visuals`,
      from: [],
      note: "removed empty optional rationale.visuals array",
    });
  }

  if (question.itemType === "case_study" && isRecord(question.caseStudy) && Array.isArray(question.caseStudy.questions)) {
    question.caseStudy.questions = question.caseStudy.questions.map((caseQuestion, index) =>
      normalizeQuestion(caseQuestion, `${path}.caseStudy.questions[${index}]`, changes),
    );
  }

  return question;
};

export function normalizeRawBankStructure(raw: unknown): RawNormalizationResult {
  const bank = cloneJson(raw);
  const changes: RawNormalizationChange[] = [];
  const questions = Array.isArray(bank)
    ? bank
    : isRecord(bank) && Array.isArray(bank.questions)
      ? bank.questions
      : undefined;

  if (!questions) return { bank, changes };

  questions.forEach((question, index) => {
    questions[index] = normalizeQuestion(question, `questions[${index}]`, changes);
  });

  if (isRecord(bank) && isRecord(bank.meta) && typeof bank.meta.count === "number" && bank.meta.count !== questions.length) {
    changes.push({
      path: "meta.count",
      from: bank.meta.count,
      to: questions.length,
      note: "corrected meta.count to match questions.length",
    });
    bank.meta.count = questions.length;
  }

  return { bank: bank as BankEnvelope | unknown[], changes };
}

export function serializeRawBank(bank: unknown): string {
  return `${JSON.stringify(bank, null, 2)}\n`;
}
