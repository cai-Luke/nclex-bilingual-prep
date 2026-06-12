import { createHash } from "node:crypto";
import type {
  DropdownClozeQuestion,
  MatrixQuestion,
  OrderedResponseQuestion,
  Question,
  SelectAllQuestion,
  StandaloneQuestion,
} from "../../src/types";
import { checkQuestionReferences } from "./audit-references";

export const NON_MCQ_BIAS_CONFIG = {
  audit_version: "2.0.0",
  min_expected_count: 5,
  chi2_alpha: 0.01,
  max_cell_deviation_pp: 8,
  sata_count_degeneracy: 0.70,
  sata_missing_count_fails: true,
  ordered_min_mean_kendall: 0.35,
  template_repeat_max_share: 0.15,
  example_cap: 3,
} as const;

const CONFIG_TEXT = JSON.stringify(NON_MCQ_BIAS_CONFIG);
export const NON_MCQ_BIAS_CONFIG_HASH = createHash("sha256").update(CONFIG_TEXT).digest("hex");

export type BiasVerdict = "PASS" | "FAIL" | "INSUFFICIENT";
export type BiasSeverity = "none" | "minor" | "major" | "critical";
export type BiasFixClass =
  | "SHUFFLE_AT_PROMOTION"
  | "REGENERATE"
  | "RATIONALE_REPAIR"
  | "MANUAL_REVIEW"
  | "NONE";
export type AuditedItemType = "select_all" | "ordered_response" | "dropdown_cloze" | "matrix";

export type BiasRecord = {
  audit_version: string;
  config_hash: string;
  bank: string;
  item_type: AuditedItemType;
  check: string;
  layer: "A";
  n: number;
  n_usable: number;
  statistic: number | null;
  p_value: number | null;
  max_deviation_pp: number | null;
  verdict: BiasVerdict;
  severity: BiasSeverity;
  fix_class: BiasFixClass;
  example_item_ids: string[];
  metrics: Record<string, unknown>;
};

export type BiasBankInput = {
  id: string;
  questions: Question[];
};

export type BiasReport = {
  audit_version: string;
  config_hash: string;
  records: BiasRecord[];
};

type ScoredId = { id: string; score: number };
type UniformObservation = { id: string; index: number };

const ITEM_TYPES: AuditedItemType[] = [
  "select_all",
  "ordered_response",
  "dropdown_cloze",
  "matrix",
];

function flattenQuestions(questions: Question[]): StandaloneQuestion[] {
  return questions.flatMap((question) =>
    question.itemType === "case_study"
      ? question.caseStudy.questions
      : [question],
  );
}

function round(value: number, digits = 12): number {
  return Number(value.toFixed(digits));
}

function logGamma(value: number): number {
  const coefficients = [
    676.5203681218851,
    -1259.1392167224028,
    771.3234287776531,
    -176.6150291621406,
    12.507343278686905,
    -0.13857109526572012,
    9.984369578019572e-6,
    1.5056327351493116e-7,
  ];
  if (value < 0.5) {
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * value)) - logGamma(1 - value);
  }
  const z = value - 1;
  let sum = 0.9999999999998099;
  for (let i = 0; i < coefficients.length; i++) sum += coefficients[i] / (z + i + 1);
  const t = z + coefficients.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(sum);
}

function regularizedGammaQ(a: number, x: number): number {
  if (x <= 0) return 1;
  const epsilon = 1e-14;
  const floor = 1e-300;
  const maxIterations = 200;

  if (x < a + 1) {
    let ap = a;
    let term = 1 / a;
    let sum = term;
    for (let i = 1; i <= maxIterations; i++) {
      ap += 1;
      term *= x / ap;
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * epsilon) break;
    }
    const p = sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
    return Math.max(0, Math.min(1, 1 - p));
  }

  let b = x + 1 - a;
  let c = 1 / floor;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i <= maxIterations; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < floor) d = floor;
    c = b + an / c;
    if (Math.abs(c) < floor) c = floor;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < epsilon) break;
  }
  return Math.max(0, Math.min(1, Math.exp(-x + a * Math.log(x) - logGamma(a)) * h));
}

function chiSquarePValue(statistic: number, degreesOfFreedom: number): number {
  return regularizedGammaQ(degreesOfFreedom / 2, statistic / 2);
}

function examples(scored: ScoredId[]): string[] {
  return [...scored]
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id))
    .slice(0, NON_MCQ_BIAS_CONFIG.example_cap)
    .map(({ id }) => id);
}

function baseRecord(
  bank: string,
  itemType: AuditedItemType,
  check: string,
  values: Omit<BiasRecord, "audit_version" | "config_hash" | "bank" | "item_type" | "check" | "layer">,
): BiasRecord {
  return {
    audit_version: NON_MCQ_BIAS_CONFIG.audit_version,
    config_hash: NON_MCQ_BIAS_CONFIG_HASH,
    bank,
    item_type: itemType,
    check,
    layer: "A",
    ...values,
  };
}

function uniformRecord(
  bank: string,
  itemType: AuditedItemType,
  check: string,
  categoryCount: number,
  observations: UniformObservation[],
  fixClass: BiasFixClass,
): BiasRecord {
  const counts = Array<number>(categoryCount).fill(0);
  for (const observation of observations) counts[observation.index] += 1;
  const n = observations.length;
  const expected = n / categoryCount;

  if (n === 0 || expected < NON_MCQ_BIAS_CONFIG.min_expected_count) {
    return baseRecord(bank, itemType, check, {
      n,
      n_usable: n,
      statistic: null,
      p_value: null,
      max_deviation_pp: null,
      verdict: "INSUFFICIENT",
      severity: "none",
      fix_class: "NONE",
      example_item_ids: [],
      metrics: { category_count: categoryCount, counts, expected_count: round(expected) },
    });
  }

  const statistic = counts.reduce((sum, count) => sum + ((count - expected) ** 2) / expected, 0);
  const pValue = chiSquarePValue(statistic, categoryCount - 1);
  const maxDeviationPp = Math.max(
    ...counts.map((count) => Math.abs(count / n - 1 / categoryCount) * 100),
  );
  const verdict =
    pValue < NON_MCQ_BIAS_CONFIG.chi2_alpha &&
    maxDeviationPp > NON_MCQ_BIAS_CONFIG.max_cell_deviation_pp
      ? "FAIL"
      : "PASS";
  const itemScores = observations.map((observation) => ({
    id: observation.id,
    score: Math.abs(counts[observation.index] / n - 1 / categoryCount),
  }));

  return baseRecord(bank, itemType, check, {
    n,
    n_usable: n,
    statistic: round(statistic),
    p_value: round(pValue),
    max_deviation_pp: round(maxDeviationPp),
    verdict,
    severity: verdict === "FAIL" ? "major" : "none",
    fix_class: verdict === "FAIL" ? fixClass : "NONE",
    example_item_ids: verdict === "FAIL" ? examples(itemScores) : [],
    metrics: { category_count: categoryCount, counts, expected_count: round(expected) },
  });
}

function rationaleRecord(
  bank: string,
  itemType: AuditedItemType,
  questions: StandaloneQuestion[],
): BiasRecord {
  const hazards = questions.flatMap((question) => {
    const finding = checkQuestionReferences(question);
    return finding && finding.hazards.length > 0
      ? [{ id: question.id, fields: finding.hazards }]
      : [];
  });
  const verdict = hazards.length > 0 ? "FAIL" : questions.length > 0 ? "PASS" : "INSUFFICIENT";
  return baseRecord(bank, itemType, "rationale_shuffle_hazard", {
    n: questions.length,
    n_usable: questions.length,
    statistic: null,
    p_value: null,
    max_deviation_pp: null,
    verdict,
    severity: verdict === "FAIL" ? "major" : "none",
    fix_class: verdict === "FAIL" ? "RATIONALE_REPAIR" : "NONE",
    example_item_ids: hazards.slice(0, NON_MCQ_BIAS_CONFIG.example_cap).map(({ id }) => id),
    metrics: { hazard_count: hazards.length, hazards },
  });
}

function absentShapeRecord(
  bank: string,
  itemType: AuditedItemType,
  check: string,
): BiasRecord {
  return baseRecord(bank, itemType, check, {
    n: 0,
    n_usable: 0,
    statistic: null,
    p_value: null,
    max_deviation_pp: null,
    verdict: "INSUFFICIENT",
    severity: "none",
    fix_class: "NONE",
    example_item_ids: [],
    metrics: { reason: "No eligible item shape was present." },
  });
}

function sataRecords(
  bank: string,
  questions: SelectAllQuestion[],
  optionCounts: number[],
): BiasRecord[] {
  const countHistogram = new Map<number, number>();
  for (const question of questions) {
    countHistogram.set(question.correct.length, (countHistogram.get(question.correct.length) ?? 0) + 1);
  }
  const topCount = Math.max(0, ...countHistogram.values());
  const topShare = questions.length > 0 ? topCount / questions.length : 0;
  const missingByOptionCount: Record<string, number[]> = {};
  for (const optionCount of [...new Set(questions.map((question) => question.options.length))].sort((a, b) => a - b)) {
    const observed = new Set(
      questions
        .filter((question) => question.options.length === optionCount)
        .map((question) => question.correct.length),
    );
    missingByOptionCount[String(optionCount)] = Array.from(
      { length: optionCount },
      (_, index) => index + 1,
    ).filter((count) => !observed.has(count));
  }
  const hasMissing = Object.values(missingByOptionCount).some((counts) => counts.length > 0);
  const countFail =
    questions.length > 0 &&
    (topShare > NON_MCQ_BIAS_CONFIG.sata_count_degeneracy ||
      (NON_MCQ_BIAS_CONFIG.sata_missing_count_fails && hasMissing));
  const countVerdict = questions.length === 0 ? "INSUFFICIENT" : countFail ? "FAIL" : "PASS";
  const countExamples = questions
    .filter((question) => question.correct.length === [...countHistogram.entries()]
      .sort((left, right) => right[1] - left[1] || left[0] - right[0])[0]?.[0])
    .map((question) => question.id)
    .sort()
    .slice(0, NON_MCQ_BIAS_CONFIG.example_cap);

  const records = [
    baseRecord(bank, "select_all", "correct_count_distribution", {
      n: questions.length,
      n_usable: questions.length,
      statistic: questions.length > 0 ? round(topShare) : null,
      p_value: null,
      max_deviation_pp: null,
      verdict: countVerdict,
      severity: countVerdict === "FAIL" ? "major" : "none",
      fix_class: countVerdict === "FAIL" ? "REGENERATE" : "NONE",
      example_item_ids: countVerdict === "FAIL" ? countExamples : [],
      metrics: {
        histogram: Object.fromEntries([...countHistogram.entries()].sort((a, b) => a[0] - b[0])),
        top_share: round(topShare),
        missing_by_option_count: missingByOptionCount,
      },
    }),
  ];

  if (optionCounts.length === 0) {
    records.push(absentShapeRecord(bank, "select_all", "correct_option_position"));
  }
  for (const optionCount of optionCounts) {
    const observations = questions
      .filter((question) => question.options.length === optionCount)
      .flatMap((question) => {
        const correct = new Set(question.correct);
        return question.options.flatMap((option, index) =>
          correct.has(option.id) ? [{ id: question.id, index }] : [],
        );
      });
    records.push(
      uniformRecord(
        bank,
        "select_all",
        `correct_option_position_n${optionCount}`,
        optionCount,
        observations,
        "SHUFFLE_AT_PROMOTION",
      ),
    );
  }
  records.push(rationaleRecord(bank, "select_all", questions));
  return records;
}

function normalizedKendall(question: OrderedResponseQuestion): number {
  const presentedIndex = new Map(question.options.map((option, index) => [option.id, index]));
  const sequence = question.correct.map((id) => presentedIndex.get(id) ?? 0);
  let inversions = 0;
  for (let i = 0; i < sequence.length; i++) {
    for (let j = i + 1; j < sequence.length; j++) {
      if (sequence[i] > sequence[j]) inversions += 1;
    }
  }
  const pairs = sequence.length * (sequence.length - 1) / 2;
  return pairs === 0 ? 0 : inversions / pairs;
}

function permutationTemplate(question: OrderedResponseQuestion): string {
  const correctRank = new Map(question.correct.map((id, index) => [id, index]));
  return question.options.map((option) => correctRank.get(option.id) ?? -1).join(",");
}

function orderedRecords(bank: string, questions: OrderedResponseQuestion[]): BiasRecord[] {
  const distances = questions.map((question) => ({ id: question.id, value: normalizedKendall(question) }));
  const mean = distances.length > 0
    ? distances.reduce((sum, item) => sum + item.value, 0) / distances.length
    : 0;
  const scrambleVerdict =
    questions.length === 0
      ? "INSUFFICIENT"
      : mean < NON_MCQ_BIAS_CONFIG.ordered_min_mean_kendall
        ? "FAIL"
        : "PASS";
  const histogram = Object.fromEntries(
    [...new Set(distances.map(({ value }) => round(value, 3)))]
      .sort((a, b) => a - b)
      .map((bucket) => [
        bucket.toFixed(3),
        distances.filter(({ value }) => round(value, 3) === bucket).length,
      ]),
  );

  const templateGroups = new Map<string, string[]>();
  for (const question of questions) {
    const template = permutationTemplate(question);
    templateGroups.set(template, [...(templateGroups.get(template) ?? []), question.id]);
  }
  const sortedTemplates = [...templateGroups.entries()]
    .sort((left, right) => right[1].length - left[1].length || left[0].localeCompare(right[0]));
  const topTemplateShare = questions.length > 0 ? (sortedTemplates[0]?.[1].length ?? 0) / questions.length : 0;
  const templateVerdict =
    questions.length === 0
      ? "INSUFFICIENT"
      : topTemplateShare > NON_MCQ_BIAS_CONFIG.template_repeat_max_share
        ? "FAIL"
        : "PASS";

  return [
    baseRecord(bank, "ordered_response", "scramble_depth", {
      n: questions.length,
      n_usable: questions.length,
      statistic: questions.length > 0 ? round(mean) : null,
      p_value: null,
      max_deviation_pp: null,
      verdict: scrambleVerdict,
      severity: scrambleVerdict === "FAIL" ? "major" : "none",
      fix_class: scrambleVerdict === "FAIL" ? "SHUFFLE_AT_PROMOTION" : "NONE",
      example_item_ids: scrambleVerdict === "FAIL"
        ? examples(distances.map(({ id, value }) => ({ id, score: 1 - value })))
        : [],
      metrics: { mean_normalized_kendall: round(mean), distance_histogram: histogram },
    }),
    baseRecord(bank, "ordered_response", "template_repetition", {
      n: questions.length,
      n_usable: questions.length,
      statistic: questions.length > 0 ? round(topTemplateShare) : null,
      p_value: null,
      max_deviation_pp: null,
      verdict: templateVerdict,
      severity: templateVerdict === "FAIL" ? "major" : "none",
      fix_class: templateVerdict === "FAIL" ? "REGENERATE" : "NONE",
      example_item_ids: templateVerdict === "FAIL"
        ? [...(sortedTemplates[0]?.[1] ?? [])].sort().slice(0, NON_MCQ_BIAS_CONFIG.example_cap)
        : [],
      metrics: {
        top_template_share: round(topTemplateShare),
        template_histogram: Object.fromEntries(sortedTemplates.map(([key, ids]) => [key, ids.length])),
      },
    }),
    rationaleRecord(bank, "ordered_response", questions),
  ];
}

function dropdownRecords(
  bank: string,
  questions: DropdownClozeQuestion[],
  optionCounts: number[],
): BiasRecord[] {
  const records = optionCounts.map((optionCount) => {
    const observations = questions.flatMap((question) =>
      question.dropdowns
        .filter((dropdown) => dropdown.options.length === optionCount)
        .map((dropdown) => ({
          id: question.id,
          index: dropdown.options.findIndex((option) => option.id === dropdown.correct),
        }))
        .filter(({ index }) => index >= 0),
    );
    return uniformRecord(
      bank,
      "dropdown_cloze",
      `correct_index_n${optionCount}`,
      optionCount,
      observations,
      "SHUFFLE_AT_PROMOTION",
    );
  });
  if (optionCounts.length === 0) {
    records.push(absentShapeRecord(bank, "dropdown_cloze", "correct_index"));
  }
  records.push(rationaleRecord(bank, "dropdown_cloze", questions));
  return records;
}

function matrixRecords(
  bank: string,
  questions: MatrixQuestion[],
  columnCounts: number[],
  rowCounts: number[],
): BiasRecord[] {
  const records: BiasRecord[] = [];
  if (columnCounts.length === 0) {
    records.push(absentShapeRecord(bank, "matrix", "correct_column"));
  }
  for (const columnCount of columnCounts) {
    const observations = questions
      .filter((question) => question.matrix.columns.length === columnCount)
      .flatMap((question) => {
        const indexById = new Map(question.matrix.columns.map((column, index) => [column.id, index]));
        return question.correct.flatMap((entry) =>
          entry.columnIds.flatMap((columnId) => {
            const index = indexById.get(columnId);
            return index === undefined ? [] : [{ id: question.id, index }];
          }),
        );
      });
    records.push(
      uniformRecord(
        bank,
        "matrix",
        `correct_column_n${columnCount}`,
        columnCount,
        observations,
        "SHUFFLE_AT_PROMOTION",
      ),
    );
  }
  if (rowCounts.length === 0) {
    records.push(absentShapeRecord(bank, "matrix", "correct_row"));
  }
  for (const rowCount of rowCounts) {
    const observations = questions
      .filter((question) => question.matrix.rows.length === rowCount)
      .flatMap((question) => {
        const indexById = new Map(question.matrix.rows.map((row, index) => [row.id, index]));
        return question.correct.flatMap((entry) => {
          const index = indexById.get(entry.rowId);
          return index === undefined
            ? []
            : entry.columnIds.map(() => ({ id: question.id, index }));
        });
      });
    records.push(
      uniformRecord(
        bank,
        "matrix",
        `correct_row_n${rowCount}`,
        rowCount,
        observations,
        "SHUFFLE_AT_PROMOTION",
      ),
    );
  }

  const eligible = questions.filter(
    (question) => question.matrix.selectionMode === "single_per_row" && question.matrix.rows.length > 1,
  );
  const sameColumn = eligible.filter((question) => {
    const columns = question.correct.map((entry) => entry.columnIds[0]);
    return columns.length > 1 && new Set(columns).size === 1;
  });
  const share = eligible.length > 0 ? sameColumn.length / eligible.length : 0;
  const verdict =
    eligible.length === 0
      ? "INSUFFICIENT"
      : share > NON_MCQ_BIAS_CONFIG.template_repeat_max_share
        ? "FAIL"
        : "PASS";
  records.push(
    baseRecord(bank, "matrix", "all_rows_same_column", {
      n: questions.length,
      n_usable: eligible.length,
      statistic: eligible.length > 0 ? round(share) : null,
      p_value: null,
      max_deviation_pp: null,
      verdict,
      severity: verdict === "FAIL" ? "major" : "none",
      fix_class: verdict === "FAIL" ? "SHUFFLE_AT_PROMOTION" : "NONE",
      example_item_ids: verdict === "FAIL"
        ? sameColumn.map((question) => question.id).sort().slice(0, NON_MCQ_BIAS_CONFIG.example_cap)
        : [],
      metrics: { repeated_item_count: sameColumn.length, repeated_item_share: round(share) },
    }),
  );
  records.push(rationaleRecord(bank, "matrix", questions));
  return records;
}

function analyzeOneBank(
  bank: string,
  questions: StandaloneQuestion[],
  shapes: {
    sataOptions: number[];
    dropdownOptions: number[];
    matrixColumns: number[];
    matrixRows: number[];
  },
): BiasRecord[] {
  const byType = Object.fromEntries(
    ITEM_TYPES.map((itemType) => [
      itemType,
      questions.filter((question) => question.itemType === itemType),
    ]),
  ) as Record<AuditedItemType, StandaloneQuestion[]>;
  return [
    ...sataRecords(bank, byType.select_all as SelectAllQuestion[], shapes.sataOptions),
    ...orderedRecords(bank, byType.ordered_response as OrderedResponseQuestion[]),
    ...dropdownRecords(bank, byType.dropdown_cloze as DropdownClozeQuestion[], shapes.dropdownOptions),
    ...matrixRecords(
      bank,
      byType.matrix as MatrixQuestion[],
      shapes.matrixColumns,
      shapes.matrixRows,
    ),
  ];
}

function recordSort(left: BiasRecord, right: BiasRecord): number {
  const bankOrder = left.bank === "global" ? 1 : right.bank === "global" ? -1 : left.bank.localeCompare(right.bank);
  return bankOrder ||
    ITEM_TYPES.indexOf(left.item_type) - ITEM_TYPES.indexOf(right.item_type) ||
    left.check.localeCompare(right.check);
}

export function auditNonMcqBias(inputs: BiasBankInput[]): BiasReport {
  const banks = [...inputs]
    .map((bank) => ({
      id: bank.id,
      questions: flattenQuestions(bank.questions).sort((left, right) => left.id.localeCompare(right.id)),
    }))
    .sort((left, right) => left.id.localeCompare(right.id));
  const globalQuestions = banks.flatMap((bank) => bank.questions);
  const shapes = {
    sataOptions: [...new Set(globalQuestions.flatMap((question) =>
      question.itemType === "select_all" ? [question.options.length] : [],
    ))].sort((a, b) => a - b),
    dropdownOptions: [...new Set(globalQuestions.flatMap((question) =>
      question.itemType === "dropdown_cloze"
        ? question.dropdowns.map((dropdown) => dropdown.options.length)
        : [],
    ))].sort((a, b) => a - b),
    matrixColumns: [...new Set(globalQuestions.flatMap((question) =>
      question.itemType === "matrix" ? [question.matrix.columns.length] : [],
    ))].sort((a, b) => a - b),
    matrixRows: [...new Set(globalQuestions.flatMap((question) =>
      question.itemType === "matrix" ? [question.matrix.rows.length] : [],
    ))].sort((a, b) => a - b),
  };

  const perBank = banks.flatMap((bank) => analyzeOneBank(bank.id, bank.questions, shapes));
  const global = analyzeOneBank("global", globalQuestions, shapes).map((record) => {
    const matching = perBank.filter(
      (candidate) => candidate.item_type === record.item_type && candidate.check === record.check,
    );
    const failedBanks = matching.filter((candidate) => candidate.verdict === "FAIL");
    if (failedBanks.length === 0 || record.verdict === "FAIL") return record;
    return {
      ...record,
      verdict: "FAIL" as const,
      severity: "major" as const,
      fix_class: failedBanks[0].fix_class,
      example_item_ids: [...new Set(failedBanks.flatMap((candidate) => candidate.example_item_ids))]
        .sort()
        .slice(0, NON_MCQ_BIAS_CONFIG.example_cap),
      metrics: {
        ...record.metrics,
        inherited_per_bank_failures: failedBanks.map((candidate) => candidate.bank).sort(),
      },
    };
  });

  return {
    audit_version: NON_MCQ_BIAS_CONFIG.audit_version,
    config_hash: NON_MCQ_BIAS_CONFIG_HASH,
    records: [...perBank, ...global].sort(recordSort),
  };
}

export function formatNonMcqBiasReport(report: BiasReport): string {
  const lines = [
    `Non-MCQ Structural Bias Audit v${report.audit_version}`,
    `CONFIG sha256: ${report.config_hash}`,
    "",
    "Bank / item type / check                         Verdict       n   Fix",
    "--------------------------------------------------------------------------",
  ];
  for (const record of report.records) {
    const label = `${record.bank} / ${record.item_type} / ${record.check}`;
    lines.push(
      `${label.padEnd(51)} ${record.verdict.padEnd(12)} ${String(record.n_usable).padStart(4)}  ${record.fix_class}`,
    );
  }
  const failures = report.records.filter((record) => record.verdict === "FAIL");
  lines.push("", `Findings: ${failures.length} FAIL, ${report.records.filter((r) => r.verdict === "INSUFFICIENT").length} INSUFFICIENT`);
  for (const fixClass of ["RATIONALE_REPAIR", "SHUFFLE_AT_PROMOTION", "REGENERATE"] as const) {
    const matching = failures.filter((record) => record.fix_class === fixClass);
    if (matching.length === 0) continue;
    lines.push("", `${fixClass}:`);
    for (const record of matching) {
      const ids = record.example_item_ids.length > 0 ? ` [${record.example_item_ids.join(", ")}]` : "";
      lines.push(`  ${record.bank} / ${record.item_type} / ${record.check}${ids}`);
    }
  }
  return lines.join("\n");
}
