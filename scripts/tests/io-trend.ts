import type { Question } from "../../src/types";
import { toExportEnvelope } from "../../src/bankImport";
import { collectAllVisuals, validateBankObject } from "../../src/schema";
import {
  ioTrendModule,
  renderIoTrendSvg,
  selfCheckIoTrend,
  validateIoTrend,
} from "../../src/visuals/kinds/io_trend";
import type { IoTrendSpec } from "../../src/visuals/kinds/io_trend/types";
import { measureDocTable, renderDocTable, type DocTableInput } from "../../src/visuals/primitives/table";

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const codes = (errors: ReturnType<typeof validateIoTrend>) => errors.map((error) => error.code);

const spec: IoTrendSpec = {
  kind: "io_trend",
  time: { unit: "hr", values: [4, 8, 12, 16] },
  binLabels: [{ en: "0400" }, { en: "0800" }, { en: "1200" }, { en: "1600" }],
  intervals: [
    { intakeMl: 300, outputMl: 150 },
    { intakeMl: 250, outputMl: 220 },
    { intakeMl: 200, outputMl: 400 },
    { intakeMl: 200, outputMl: 480 },
  ],
  showCumulativeNet: true,
  periodLabel: { en: "Postoperative I/O trend" },
};

const questionWithMeta = (meta: Record<string, unknown>) => ({ meta }) as unknown as Question;

for (const { malformed, code } of [
  { malformed: { kind: "io_record", time: { unit: "hr", values: [1, 2] }, intervals: [{ intakeMl: 1, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }] }, code: "invalid_kind" },
  { malformed: { kind: "io_trend", intervals: [] }, code: "time_invalid" },
  { malformed: { kind: "io_trend", time: { unit: "day", values: [1, 2] }, intervals: [{ intakeMl: 1, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }] }, code: "invalid_time_unit" },
  { malformed: { kind: "io_trend", time: { unit: "hr", values: [1, "x"] }, intervals: [{ intakeMl: 1, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }] }, code: "timepoint_not_number" },
  { malformed: { kind: "io_trend", time: { unit: "hr", values: [2, 1] }, intervals: [{ intakeMl: 1, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }] }, code: "timepoints_not_increasing" },
  { malformed: { kind: "io_trend", time: { unit: "hr", values: [1] }, intervals: [{ intakeMl: 1, outputMl: 0 }] }, code: "too_few_timepoints" },
  { malformed: { kind: "io_trend", time: { unit: "hr", values: [1, 2] }, intervals: null }, code: "intervals_invalid" },
  { malformed: { kind: "io_trend", time: { unit: "hr", values: [1, 2] }, intervals: [{ intakeMl: 1, outputMl: 0 }] }, code: "intervals_length_mismatch" },
  { malformed: { kind: "io_trend", time: { unit: "hr", values: [1, 2] }, intervals: [{ intakeMl: 1.5, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }] }, code: "invalid_volume" },
  { malformed: { kind: "io_trend", time: { unit: "hr", values: [1, 2] }, intervals: [{ intakeMl: 20_000, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }] }, code: "volume_out_of_range" },
  { malformed: { kind: "io_trend", time: { unit: "hr", values: [1, 2] }, intervals: [{ intakeMl: 0, outputMl: 0 }, { intakeMl: 0, outputMl: 0 }] }, code: "no_volumes" },
  { malformed: { kind: "io_trend", time: { unit: "hr", values: [1, 2] }, intervals: [{ intakeMl: 1, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }], binLabels: [{ en: "1" }] }, code: "bin_labels_length_mismatch" },
  { malformed: { kind: "io_trend", time: { unit: "hr", values: [1, 2] }, intervals: [{ intakeMl: 1, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }], binLabels: [{ en: "1" }, { en: "" }] }, code: "bin_label_en_required" },
  { malformed: { kind: "io_trend", time: { unit: "hr", values: [1, 2] }, intervals: [{ intakeMl: 1, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }], binLabels: [{ en: "1" }, { en: "2", zh: "" }] }, code: "bin_label_zh_empty" },
  { malformed: { kind: "io_trend", time: { unit: "hr", values: [1, 2] }, intervals: [{ intakeMl: 1, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }], showCumulativeNet: "yes" }, code: "invalid_show_cumulative_net" },
  { malformed: { kind: "io_trend", time: { unit: "hr", values: [1, 2] }, intervals: [{ intakeMl: 1, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }], periodLabel: { en: "" } }, code: "period_label_en_required" },
  { malformed: { kind: "io_trend", time: { unit: "hr", values: [1, 2] }, intervals: [{ intakeMl: 1, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }], periodLabel: { en: "x", zh: "" } }, code: "period_label_zh_empty" },
  { malformed: { kind: "io_trend", time: { unit: "hr", values: [1, 2] }, intervals: [{ intakeMl: 1, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }], caption: { en: "" } }, code: "caption_en_required" },
  { malformed: { kind: "io_trend", time: { unit: "hr", values: [1, 2] }, intervals: [{ intakeMl: 1, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }], caption: { en: "x", zh: "" } }, code: "caption_zh_empty" },
] as const) {
  assert(codes(validateIoTrend(malformed as unknown as IoTrendSpec)).includes(code), `expected validation code ${code}`);
}

const svg = renderIoTrendSvg(spec);
assert(renderIoTrendSvg(spec) === svg, "rendering must be deterministic");
assert(svg.includes('data-kind="io_trend"'), "render must identify the visual kind");
assert(svg.includes('data-role="overlay-line"'), "cumulative net overlay should render when requested");
assert(svg.includes(">−300<"), "render must include signed final cumulative net");

const validSelfCheck = selfCheckIoTrend(spec, questionWithMeta({
  visual_justification: "The learner must compare interval intake and output and track cumulative net balance.",
  collapse_test: "Removing the graph/table prevents identifying the cumulative negative crossover.",
  derived_values_keyed: {
    net_by_interval_ml: [150, 30, -200, -280],
    cumulative_net_ml: [150, 180, -20, -300],
    final_cumulative_net_ml: -300,
  },
  expected_trend: [{ series: "output", direction: "up", window: [8, 16] }],
  crossover: { series: "cumulative_net", index: 2, from: "positive", to: "negative" },
}));
assert(validSelfCheck.length === 0, `correct arithmetic/trend/crossover should pass: ${JSON.stringify(validSelfCheck)}`);

assert(
  selfCheckIoTrend(spec, questionWithMeta({
    visual_justification: "The learner must derive the interval nets.",
    collapse_test: "The visual is required.",
    derived_values_keyed: { net_by_interval_ml: [150] },
  })).some((error) => error.code === "self_check_keyed_length_mismatch"),
  "wrong keyed array length must fail",
);

assert(
  selfCheckIoTrend(spec, questionWithMeta({
    visual_justification: "The learner must derive the interval nets.",
    collapse_test: "The visual is required.",
    derived_values_keyed: { net_by_interval_ml: [150, 31, -200, -280] },
  })).some((error) => error.code === "self_check_net_mismatch"),
  "wrong interval net must fail",
);

assert(
  selfCheckIoTrend(spec, questionWithMeta({
    visual_justification: "The learner must derive the cumulative nets.",
    collapse_test: "The visual is required.",
    derived_values_keyed: { cumulative_net_ml: [150, 180, -21, -300] },
  })).some((error) => error.code === "self_check_cumulative_mismatch"),
  "wrong cumulative net must fail",
);

assert(
  selfCheckIoTrend(spec, questionWithMeta({
    visual_justification: "The learner must derive final net.",
    collapse_test: "The visual is required.",
    derived_values_keyed: { final_cumulative_net_ml: -299 },
  })).some((error) => error.code === "self_check_final_mismatch"),
  "wrong final cumulative net must fail",
);

assert(
  selfCheckIoTrend(spec, questionWithMeta({
    visual_justification: "The learner must derive the trend.",
    collapse_test: "The visual is required.",
    expected_trend: [{ series: "output", direction: "down", window: [8, 16] }],
  })).some((error) => error.code === "self_check_trend_failed"),
  "wrong trend direction must fail",
);

assert(
  selfCheckIoTrend(spec, questionWithMeta({
    visual_justification: "The learner must identify the crossover.",
    collapse_test: "The visual is required.",
    crossover: { series: "cumulative_net", index: 1, from: "positive", to: "negative" },
  })).some((error) => error.code === "self_check_crossover_failed"),
  "wrong crossover index must fail",
);

assert(
  selfCheckIoTrend(spec, questionWithMeta({
    visual_justification: "The learner must derive the visual.",
  })).some((error) => error.code === "self_check_missing_collapse_test"),
  "meta without collapse_test must fail",
);

assert(
  selfCheckIoTrend({
    ...spec,
    intervals: [{ intakeMl: 1.5, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }, { intakeMl: 0, outputMl: 1 }],
  }, questionWithMeta({
    visual_justification: "The learner must derive the visual.",
    collapse_test: "The visual is required.",
  })).some((error) => error.code === "self_check_invalid_volume"),
  "invalid volume must fail selfCheck",
);

let malformedResult: ReturnType<typeof selfCheckIoTrend> | undefined;
try {
  malformedResult = selfCheckIoTrend({} as IoTrendSpec, {} as Question);
} catch (error) {
  throw new Error(`malformed selfCheck input must not throw: ${String(error)}`);
}
assert(malformedResult?.length === 0, "malformed selfCheck input must return []");

assert(
  JSON.stringify(ioTrendModule.allowedItemTypes) === JSON.stringify(["multiple_choice", "select_all", "matrix"]),
  "io_trend placement must exclude fill_in_blank",
);

const tableInput: DocTableInput = {
  title: "I/O Trend",
  columns: [
    { key: "period", label: "", widthFr: 2, align: "left" },
    { key: "intake", label: "Intake (mL)", widthFr: 1.2, align: "right" },
    { key: "output", label: "Output (mL)", widthFr: 1.2, align: "right" },
    { key: "net", label: "Net (mL)", widthFr: 1.2, align: "right" },
    { key: "cumulative", label: "Cumulative (mL)", widthFr: 1.4, align: "right" },
  ],
  rows: [{ cells: { period: "0800", intake: "100", output: "50", net: "+50", cumulative: "+50" } }],
  width: 600,
  rowHeight: 26,
  headerHeight: 30,
};
const tableHeightMatch = renderDocTable(tableInput).match(/<rect x="0" y="0" width="[^"]+" height="([^"]+)"/);
if (tableHeightMatch === null) throw new Error("rendered doc-table height must be inspectable");
assert(
  measureDocTable(tableInput) === Number(tableHeightMatch[1]),
  "measureDocTable must match rendered 5-column io_trend table height",
);

const minimalQuestion = {
  id: "u11-io-trend-q",
  itemType: "multiple_choice",
  category: "Physiological Adaptation",
  topic: "Fluid Balance",
  difficulty: "medium",
  stem: { en: "Which finding requires follow-up?", zh: "哪项发现需要跟进？" },
  visual: spec,
  meta: {
    visual_justification: "The learner must compare I/O trend values.",
    collapse_test: "Removing the visual removes the cumulative net trend.",
  },
  rationale: {
    correct: { en: "The cumulative net balance is increasingly negative.", zh: "累计净平衡越来越负。" },
    byChoice: [
      { refId: "A", en: "Correct.", zh: "正确。" },
      { refId: "B", en: "Incorrect; the trend is worsening.", zh: "不正确；趋势正在恶化。" },
      { refId: "C", en: "Incorrect; additional fluids may be unsafe without assessment.", zh: "不正确；未经评估额外补液可能不安全。" },
    ],
  },
  testTakingStrategy: { en: "Use the trend and cumulative net.", zh: "使用趋势和累计净值。" },
  glossary: [],
  options: [{ id: "A", en: "Notify the provider.", zh: "通知医嘱开具者。" }, { id: "B", en: "Continue monitoring.", zh: "继续监测。" }, { id: "C", en: "Offer fluids.", zh: "提供液体。" }],
  correct: ["A"],
} as Question;

const exported = toExportEnvelope([minimalQuestion]);
assert(exported.meta?.schemaVersion === "1.9", "export envelope must lift io_trend to schema 1.9");
const lowVersion = validateBankObject({ meta: { schemaVersion: "1.8", count: 1 }, questions: [minimalQuestion] });
if (lowVersion.ok) throw new Error("bank validation must reject io_trend below schema 1.9");
assert(lowVersion.reasons.some((reason) => reason.includes("io_trend visual requires meta.schemaVersion 1.9")), "bank validation must enforce io_trend schema floor");

const rationaleOnlyQuestion = {
  ...minimalQuestion,
  visual: undefined,
  rationale: {
    ...minimalQuestion.rationale,
    visuals: [spec],
  },
} as Question;
assert(toExportEnvelope([rationaleOnlyQuestion]).meta?.schemaVersion === "1.9", "export envelope must lift rationale io_trend to schema 1.9");

const carrierQuestion = {
  ...minimalQuestion,
  rationale: { ...minimalQuestion.rationale, visuals: [spec] },
  itemType: "case_study",
  caseStudy: {
    title: { en: "Case", zh: "病例" },
    exhibits: [
      { id: "baseline", title: { en: "Baseline", zh: "基线" }, content: { en: "I/O", zh: "出入量" }, visual: spec },
    ],
    stages: [
      {
        id: "stage1",
        title: { en: "Stage 1", zh: "阶段 1" },
        exhibits: [
          { id: "trend", title: { en: "Trend", zh: "趋势" }, content: { en: "I/O", zh: "出入量" }, visual: spec },
        ],
      },
    ],
    questions: [
      { ...minimalQuestion, id: "case-part-1", visual: spec },
      { ...rationaleOnlyQuestion, id: "case-part-2" },
    ],
  },
} as unknown as Question;
assert(
  collectAllVisuals(carrierQuestion).filter((visual) => visual.kind === "io_trend").length === 6,
  "collectAllVisuals must traverse top-level, rationale, exhibits, staged exhibits, embedded visuals, and embedded rationale visuals",
);

console.log("io-trend tests passed");
