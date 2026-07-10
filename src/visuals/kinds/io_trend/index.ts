import { fmt, fmtNum } from "../../primitives/graphPaper";
import { escapeXml } from "../../primitives/escapeXml";
import { renderDivergingBars, type DivergingBarBin, type OverlayLinePoint } from "../../primitives/divergingBars";
import { measureDocTable, renderDocTable, type DocTableInput, type DocTableRow } from "../../primitives/table";
import { type VisualError, type VisualKindModule, registerVisual } from "../../registry";
import type { IoTrendInterval, IoTrendSpec } from "./types";

const MAX_INTERVAL_ML = 10_000;
const KEYED_ARRAYS = ["net_by_interval_ml", "cumulative_net_ml"] as const;
const KEYED_SCALARS = ["final_cumulative_net_ml"] as const;
const TREND_SERIES = ["intake", "output", "net", "cumulative_net"] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isValidVolume = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value >= 0;

const validateTextPair = (
  value: unknown,
  path: "periodLabel" | "caption",
): VisualError[] => {
  if (!isRecord(value) || !nonEmptyString(value.en)) {
    return [{
      path: `${path}.en`,
      code: path === "periodLabel" ? "period_label_en_required" : "caption_en_required",
      message: "is required when present",
    }];
  }
  if (value.zh !== undefined && !nonEmptyString(value.zh)) {
    return [{
      path: `${path}.zh`,
      code: path === "periodLabel" ? "period_label_zh_empty" : "caption_zh_empty",
      message: "must be non-empty when present",
    }];
  }
  return [];
};

const structuralIntervals = (value: unknown): Array<Record<string, unknown>> | null => {
  if (!Array.isArray(value)) return null;
  const intervals: Array<Record<string, unknown>> = [];
  for (const interval of value) {
    if (!isRecord(interval)) return null;
    intervals.push(interval);
  }
  return intervals;
};

const usableIntervals = (spec: IoTrendSpec): IoTrendInterval[] | null => {
  if (!Array.isArray(spec.intervals)) return null;
  const intervals: IoTrendInterval[] = [];
  for (const interval of spec.intervals) {
    if (!isRecord(interval) || !isValidVolume(interval.intakeMl) || !isValidVolume(interval.outputMl)) return null;
    intervals.push({ intakeMl: interval.intakeMl, outputMl: interval.outputMl });
  }
  return intervals;
};

export const validateIoTrend = (spec: IoTrendSpec): VisualError[] => {
  const errors: VisualError[] = [];
  const value = spec as unknown as Record<string, unknown>;

  if (value.kind !== "io_trend") {
    return [{ path: "kind", code: "invalid_kind", message: "must be 'io_trend'" }];
  }

  let times: number[] = [];
  if (!isRecord(value.time) || !Array.isArray(value.time.values)) {
    errors.push({ path: "time", code: "time_invalid", message: "must provide time.values as an array" });
  } else {
    times = value.time.values as number[];
    if (value.time.unit !== "hr" && value.time.unit !== "shift") {
      errors.push({ path: "time.unit", code: "invalid_time_unit", message: "must be 'hr' or 'shift'" });
    }
    times.forEach((timepoint, index) => {
      if (typeof timepoint !== "number" || !Number.isFinite(timepoint)) {
        errors.push({ path: `time.values[${index}]`, code: "timepoint_not_number", message: "must be a finite number" });
        return;
      }
      if (index > 0 && timepoint <= times[index - 1]) {
        errors.push({ path: `time.values[${index}]`, code: "timepoints_not_increasing", message: "must be strictly increasing" });
      }
    });
    if (times.length < 3) {
      errors.push({ path: "time.values", code: "too_few_timepoints", message: "must contain at least three timepoints" });
    }
  }

  const intervals = structuralIntervals(value.intervals);
  if (intervals === null) {
    errors.push({ path: "intervals", code: "intervals_invalid", message: "must be an array of interval objects" });
  } else {
    if (times.length > 0 && intervals.length !== times.length) {
      errors.push({ path: "intervals", code: "intervals_length_mismatch", message: "must match time.values length" });
    }
    let totalVolume = 0;
    intervals.forEach((interval, index) => {
      for (const key of ["intakeMl", "outputMl"] as const) {
        const volume = interval[key];
        if (!isValidVolume(volume)) {
          errors.push({ path: `intervals[${index}].${key}`, code: "invalid_volume", message: "must be a finite non-negative integer" });
        } else {
          totalVolume += volume;
          if (volume > MAX_INTERVAL_ML) {
            errors.push({ path: `intervals[${index}].${key}`, code: "volume_out_of_range", message: `must be no greater than ${MAX_INTERVAL_ML} mL` });
          }
        }
      }
    });
    if (intervals.length > 0 && totalVolume === 0) {
      errors.push({ path: "intervals", code: "no_volumes", message: "must contain at least one non-zero intake or output volume" });
    }
  }

  if (value.binLabels !== undefined) {
    if (!Array.isArray(value.binLabels) || (times.length > 0 && value.binLabels.length !== times.length)) {
      errors.push({ path: "binLabels", code: "bin_labels_length_mismatch", message: "must match time.values length" });
    } else {
      value.binLabels.forEach((label, index) => {
        if (!isRecord(label) || !nonEmptyString(label.en)) {
          errors.push({ path: `binLabels[${index}].en`, code: "bin_label_en_required", message: "is required when present" });
        } else if (label.zh !== undefined && !nonEmptyString(label.zh)) {
          errors.push({ path: `binLabels[${index}].zh`, code: "bin_label_zh_empty", message: "must be non-empty when present" });
        }
      });
    }
  }

  if (value.showCumulativeNet !== undefined && typeof value.showCumulativeNet !== "boolean") {
    errors.push({ path: "showCumulativeNet", code: "invalid_show_cumulative_net", message: "must be a boolean when present" });
  }
  if (value.periodLabel !== undefined) errors.push(...validateTextPair(value.periodLabel, "periodLabel"));
  if (value.caption !== undefined) errors.push(...validateTextPair(value.caption, "caption"));

  return errors;
};

const derive = (intervals: IoTrendInterval[]) => {
  const netByInterval = intervals.map((interval) => interval.intakeMl - interval.outputMl);
  const cumulative: number[] = [];
  let running = 0;
  for (const net of netByInterval) {
    running += net;
    cumulative.push(running);
  }
  return { netByInterval, cumulative, final: running };
};

const seriesValues = (
  series: string,
  intervals: IoTrendInterval[],
  netByInterval: number[],
  cumulative: number[],
): number[] | null => {
  switch (series) {
    case "intake": return intervals.map((interval) => interval.intakeMl);
    case "output": return intervals.map((interval) => interval.outputMl);
    case "net": return netByInterval;
    case "cumulative_net": return cumulative;
    default: return null;
  }
};

const signOf = (value: number): "positive" | "negative" | null =>
  value > 0 ? "positive" : value < 0 ? "negative" : null;

export const selfCheckIoTrend = (spec: IoTrendSpec, question: unknown): VisualError[] => {
  if (spec.kind !== "io_trend" || !Array.isArray(spec.time?.values)) return [];
  const rawIntervals = structuralIntervals((spec as unknown as Record<string, unknown>).intervals);
  if (rawIntervals === null) return [];

  const errors: VisualError[] = [];
  const meta = isRecord(question) && isRecord(question.meta) ? question.meta : null;

  if (meta !== null && !nonEmptyString(meta.visual_justification)) {
    errors.push({
      path: "meta.visual_justification",
      code: "self_check_missing_justification",
      message: "must be present and non-empty",
    });
  }
  if (meta !== null && !nonEmptyString(meta.collapse_test)) {
    errors.push({
      path: "meta.collapse_test",
      code: "self_check_missing_collapse_test",
      message: "must be present and non-empty",
    });
  }
  if (rawIntervals.length < 3) {
    errors.push({
      path: "intervals",
      code: "self_check_too_few_timepoints",
      message: "must contain at least three intervals for trend assertions",
    });
  }
  for (let index = 0; index < rawIntervals.length; index += 1) {
    const interval = rawIntervals[index];
    if (!isValidVolume(interval.intakeMl) || !isValidVolume(interval.outputMl)) {
      errors.push({
        path: `intervals[${index}]`,
        code: "self_check_invalid_volume",
        message: "must contain finite non-negative integer volumes",
      });
    }
  }
  if (errors.some((error) => error.code === "self_check_invalid_volume")) return errors;

  const intervals = rawIntervals.map((interval) => ({
    intakeMl: interval.intakeMl as number,
    outputMl: interval.outputMl as number,
  }));

  const { netByInterval, cumulative, final } = derive(intervals);
  const keyed = meta !== null && isRecord(meta.derived_values_keyed) ? meta.derived_values_keyed : null;
  if (keyed !== null) {
    for (const key of KEYED_ARRAYS) {
      if (!Object.prototype.hasOwnProperty.call(keyed, key)) continue;
      const expected = key === "net_by_interval_ml" ? netByInterval : cumulative;
      const actual = keyed[key];
      if (!Array.isArray(actual) || actual.length !== expected.length) {
        errors.push({
          path: `meta.derived_values_keyed.${key}`,
          code: "self_check_keyed_length_mismatch",
          message: `must contain ${expected.length} values`,
        });
      } else if (actual.some((value, index) => value !== expected[index])) {
        errors.push({
          path: `meta.derived_values_keyed.${key}`,
          code: key === "net_by_interval_ml" ? "self_check_net_mismatch" : "self_check_cumulative_mismatch",
          message: "does not match computed values",
        });
      }
    }
    for (const key of KEYED_SCALARS) {
      if (Object.prototype.hasOwnProperty.call(keyed, key) && keyed[key] !== final) {
        errors.push({
          path: `meta.derived_values_keyed.${key}`,
          code: "self_check_final_mismatch",
          message: `declared ${String(keyed[key])} does not match computed ${final}`,
        });
      }
    }
  }

  const times = spec.time.values;
  const expectedTrends = meta !== null && Array.isArray(meta.expected_trend) ? meta.expected_trend : [];
  for (const entry of expectedTrends) {
    if (!isRecord(entry)) continue;
    if (typeof entry.series !== "string" || !(TREND_SERIES as readonly string[]).includes(entry.series)) continue;
    if (entry.direction !== "up" && entry.direction !== "down") continue;
    if (!Array.isArray(entry.window) || entry.window.length !== 2) continue;
    const idxStart = times.indexOf(entry.window[0] as number);
    const idxEnd = times.indexOf(entry.window[1] as number);
    if (idxStart === -1 || idxEnd === -1 || idxEnd <= idxStart) continue;
    const values = seriesValues(entry.series, intervals, netByInterval, cumulative);
    if (values === null) continue;
    const start = values[idxStart];
    const end = values[idxEnd];
    if (entry.direction === "up" && end <= start) {
      errors.push({ path: `meta.expected_trend.${entry.series}`, code: "self_check_trend_failed", message: "expected upward trend but values did not match" });
    }
    if (entry.direction === "down" && end >= start) {
      errors.push({ path: `meta.expected_trend.${entry.series}`, code: "self_check_trend_failed", message: "expected downward trend but values did not match" });
    }
  }

  if (meta !== null && isRecord(meta.crossover)) {
    const entry = meta.crossover;
    const values = typeof entry.series === "string"
      ? seriesValues(entry.series, intervals, netByInterval, cumulative)
      : null;
    const index = typeof entry.index === "number" ? entry.index : -1;
    const from = typeof entry.from === "string" ? entry.from : null;
    const to = typeof entry.to === "string" ? entry.to : null;
    const validSigns = from !== null && to !== null &&
      ["positive", "negative"].includes(from) &&
      ["positive", "negative"].includes(to) &&
      from !== to;
    const passed = values !== null &&
      Number.isInteger(index) &&
      index >= 1 &&
      index < values.length &&
      validSigns &&
      signOf(values[index - 1]) === from &&
      signOf(values[index]) === to;
    if (!passed) {
      errors.push({
        path: "meta.crossover",
        code: "self_check_crossover_failed",
        message: "declared crossover does not match computed adjacent signs",
      });
    }
  }

  return errors;
};

const labelForBin = (spec: IoTrendSpec, index: number): string => {
  const explicit = spec.binLabels?.[index]?.en;
  if (explicit !== undefined) return explicit;
  const value = spec.time.values[index];
  return spec.time.unit === "shift" ? `Shift ${fmt(value)}` : `${fmt(value)} hr`;
};

const signed = (value: number): string =>
  value >= 0 ? `+${fmtNum(value)}` : `−${fmtNum(Math.abs(value))}`;

const buildTableInput = (spec: IoTrendSpec, intervals: IoTrendInterval[]): DocTableInput => {
  const { netByInterval, cumulative, final } = derive(intervals);
  const totalIntake = intervals.reduce((sum, interval) => sum + interval.intakeMl, 0);
  const totalOutput = intervals.reduce((sum, interval) => sum + interval.outputMl, 0);
  const rows: DocTableRow[] = intervals.map((interval, index) => ({
    cells: {
      period: labelForBin(spec, index),
      intake: fmtNum(interval.intakeMl),
      output: fmtNum(interval.outputMl),
      net: signed(netByInterval[index]),
      cumulative: signed(cumulative[index]),
    },
  }));

  rows.push({
    rowHeader: true,
    cells: {
      period: { text: "Total", emphasis: "bold" },
      intake: { text: fmtNum(totalIntake), emphasis: "bold" },
      output: { text: fmtNum(totalOutput), emphasis: "bold" },
      net: { text: signed(final), emphasis: "bold" },
      cumulative: { text: signed(final), emphasis: "bold" },
    },
  });

  return {
    title: spec.periodLabel?.en ?? "Intake & Output Trend",
    columns: [
      { key: "period", label: "", widthFr: 2, align: "left" },
      { key: "intake", label: "Intake (mL)", widthFr: 1.2, align: "right" },
      { key: "output", label: "Output (mL)", widthFr: 1.2, align: "right" },
      { key: "net", label: "Net (mL)", widthFr: 1.2, align: "right" },
      { key: "cumulative", label: "Cumulative (mL)", widthFr: 1.4, align: "right" },
    ],
    rows,
    width: 600,
    rowHeight: 26,
    headerHeight: 30,
  };
};

export const renderIoTrendSvg = (spec: IoTrendSpec): string => {
  const intervals = usableIntervals(spec) ?? [];
  const { cumulative } = derive(intervals);
  const chartHeight = 260;
  const tableInput = buildTableInput(spec, intervals);
  const tableHeight = measureDocTable(tableInput);
  const totalHeight = chartHeight + tableHeight;
  const bins: DivergingBarBin[] = intervals.map((interval, index) => ({
    label: labelForBin(spec, index),
    positive: interval.intakeMl,
    negative: interval.outputMl,
  }));
  const overlayPoints: OverlayLinePoint[] = cumulative.map((value, index) => ({
    binIndex: index,
    value,
  }));
  const chart = renderDivergingBars({
    bins,
    positiveLabel: "Intake",
    negativeLabel: "Output",
    yAxisLabel: "mL by interval",
    overlay: spec.showCumulativeNet === true
      ? { label: "Cumulative net", points: overlayPoints, axisLabel: "net mL" }
      : undefined,
    width: 600,
    height: chartHeight,
  });
  const table = renderDocTable(tableInput);
  const ariaLabel = escapeXml(
    spec.caption?.en ?? spec.periodLabel?.en ?? "Intake and Output Trend",
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 ${fmt(totalHeight)}" role="img" aria-label="${ariaLabel}" data-kind="io_trend">\n${chart}\n<g transform="translate(0 ${fmt(chartHeight)})">\n${table}\n</g>\n</svg>`;
};

const invalidBase = {
  kind: "io_trend",
  time: { unit: "hr", values: [1, 2, 3] },
  intervals: [
    { intakeMl: 1, outputMl: 0 },
    { intakeMl: 0, outputMl: 1 },
    { intakeMl: 1, outputMl: 0 },
  ],
};

const fixtures: VisualKindModule<IoTrendSpec>["fixtures"] = {
  valid: [
    {
      kind: "io_trend",
      time: { unit: "hr", values: [4, 8, 12, 16] },
      binLabels: [
        { en: "0400", zh: "0400" },
        { en: "0800", zh: "0800" },
        { en: "1200", zh: "1200" },
        { en: "1600", zh: "1600" },
      ],
      intervals: [
        { intakeMl: 300, outputMl: 150 },
        { intakeMl: 250, outputMl: 220 },
        { intakeMl: 200, outputMl: 400 },
        { intakeMl: 200, outputMl: 480 },
      ],
      showCumulativeNet: true,
      periodLabel: { en: "Postoperative I/O trend", zh: "术后出入量趋势" },
      caption: { en: "Intake and output trend across the shift", zh: "班次内出入量趋势" },
    },
    {
      kind: "io_trend",
      time: { unit: "hr", values: [8, 16, 24] },
      intervals: [
        { intakeMl: 250, outputMl: 300 },
        { intakeMl: 200, outputMl: 280 },
        { intakeMl: 150, outputMl: 250 },
      ],
    },
  ],
  invalid: [
    { spec: { ...invalidBase, kind: "io_record" }, expectCode: "invalid_kind" },
    { spec: { kind: "io_trend", intervals: [] }, expectCode: "time_invalid" },
    { spec: { ...invalidBase, time: { unit: "day", values: [1, 2, 3] } }, expectCode: "invalid_time_unit" },
    { spec: { ...invalidBase, time: { unit: "hr", values: [1, "x", 3] } }, expectCode: "timepoint_not_number" },
    { spec: { ...invalidBase, time: { unit: "hr", values: [1, 1, 3] } }, expectCode: "timepoints_not_increasing" },
    { spec: { ...invalidBase, time: { unit: "hr", values: [1, 2] }, intervals: [{ intakeMl: 1, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }] }, expectCode: "too_few_timepoints" },
    { spec: { ...invalidBase, intervals: null }, expectCode: "intervals_invalid" },
    { spec: { ...invalidBase, intervals: [{ intakeMl: 1, outputMl: 0 }] }, expectCode: "intervals_length_mismatch" },
    { spec: { ...invalidBase, intervals: [{ intakeMl: -1, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }, { intakeMl: 1, outputMl: 0 }] }, expectCode: "invalid_volume" },
    { spec: { ...invalidBase, intervals: [{ intakeMl: 20_000, outputMl: 0 }, { intakeMl: 0, outputMl: 1 }, { intakeMl: 1, outputMl: 0 }] }, expectCode: "volume_out_of_range" },
    { spec: { ...invalidBase, intervals: [{ intakeMl: 0, outputMl: 0 }, { intakeMl: 0, outputMl: 0 }, { intakeMl: 0, outputMl: 0 }] }, expectCode: "no_volumes" },
    { spec: { ...invalidBase, binLabels: [{ en: "1" }] }, expectCode: "bin_labels_length_mismatch" },
    { spec: { ...invalidBase, binLabels: [{ en: "1" }, { en: "" }, { en: "3" }] }, expectCode: "bin_label_en_required" },
    { spec: { ...invalidBase, binLabels: [{ en: "1" }, { en: "2", zh: "" }, { en: "3" }] }, expectCode: "bin_label_zh_empty" },
    { spec: { ...invalidBase, showCumulativeNet: "yes" }, expectCode: "invalid_show_cumulative_net" },
    { spec: { ...invalidBase, periodLabel: { en: "" } }, expectCode: "period_label_en_required" },
    { spec: { ...invalidBase, periodLabel: { en: "x", zh: "" } }, expectCode: "period_label_zh_empty" },
    { spec: { ...invalidBase, caption: { en: "" } }, expectCode: "caption_en_required" },
    { spec: { ...invalidBase, caption: { en: "x", zh: "" } }, expectCode: "caption_zh_empty" },
  ],
};

export const ioTrendModule: VisualKindModule<IoTrendSpec> = {
  kind: "io_trend",
  requiredSchemaVersion: "1.9",
  allowedItemTypes: ["multiple_choice", "select_all", "matrix"],
  validate: validateIoTrend,
  selfCheck: selfCheckIoTrend,
  renderSvg: renderIoTrendSvg,
  fixtures,
};

registerVisual(ioTrendModule as VisualKindModule);
