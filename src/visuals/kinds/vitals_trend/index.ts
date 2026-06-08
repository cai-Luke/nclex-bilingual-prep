import { type VisualError, type VisualKindModule } from "../../registry";
import { type ChartSeries, type LineChartInput, renderLineChart } from "../../primitives/lineChart";
import { type VitalKey, type VitalsTrendSpec } from "./types";
import { fmt } from "../../primitives/graphPaper";

const VITAL_DEFS: Record<VitalKey, { label: string; unit: string; axis: "left" | "right"; styleRole: string; range: { min: number; max: number }; normal: (unit?: "C" | "F") => { low: number; high: number } }> = {
  hr:   { label: "HR",   unit: "bpm",  axis: "left",  styleRole: "red",     range: { min: 10, max: 300 }, normal: () => ({ low: 60, high: 100 }) },
  sbp:  { label: "SBP",  unit: "mmHg", axis: "left",  styleRole: "blue",    range: { min: 40, max: 300 }, normal: () => ({ low: 90, high: 120 }) },
  dbp:  { label: "DBP",  unit: "mmHg", axis: "left",  styleRole: "blue",    range: { min: 20, max: 200 }, normal: () => ({ low: 60, high: 80 }) },
  map:  { label: "MAP",  unit: "mmHg", axis: "left",  styleRole: "purple",  range: { min: 30, max: 250 }, normal: () => ({ low: 70, high: 100 }) },
  rr:   { label: "RR",   unit: "/min", axis: "left",  styleRole: "green",   range: { min: 2, max: 80 },   normal: () => ({ low: 12, high: 20 }) },
  spo2: { label: "SpO2", unit: "%",    axis: "right", styleRole: "slate",   range: { min: 50, max: 100 }, normal: () => ({ low: 95, high: 100 }) },
  temp: { label: "Temp", unit: "°C",   axis: "right", styleRole: "orange",  range: { min: 30, max: 110 }, normal: (u) => u === "F" ? ({ low: 97.7, high: 99.5 }) : ({ low: 36.5, high: 37.5 }) },
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

export const validateVitalsTrend = (spec: VitalsTrendSpec): VisualError[] => {
  const errs: VisualError[] = [];
  const value = spec as unknown as Record<string, unknown>;

  if (!Array.isArray(value.timepointsHr) || value.timepointsHr.length === 0) {
    errs.push({ path: "timepointsHr", code: "timepoints_invalid", message: "must be a non-empty array" });
    return errs;
  }
  
  const times = value.timepointsHr as number[];
  for (let i = 0; i < times.length; i++) {
    if (typeof times[i] !== "number" || !Number.isFinite(times[i])) {
      errs.push({ path: `timepointsHr[${i}]`, code: "timepoint_not_number", message: "must be a finite number" });
    }
    if (i > 0 && times[i] <= times[i - 1]) {
      errs.push({ path: `timepointsHr[${i}]`, code: "timepoints_not_increasing", message: "must be strictly increasing" });
    }
  }

  if (!Array.isArray(value.series) || value.series.length === 0) {
    errs.push({ path: "series", code: "series_empty", message: "must have at least one series" });
    return errs;
  }

  const seenVitals = new Set<string>();
  const series = value.series as Record<string, unknown>[];

  series.forEach((s, idx) => {
    if (typeof s.vital !== "string" || !Object.keys(VITAL_DEFS).includes(s.vital)) {
      errs.push({ path: `series[${idx}].vital`, code: "invalid_vital_key", message: "is not a recognized vital key" });
      return;
    }
    
    if (seenVitals.has(s.vital)) {
      errs.push({ path: `series[${idx}].vital`, code: "duplicate_vital", message: "cannot duplicate vital keys" });
    }
    seenVitals.add(s.vital);

    if (!Array.isArray(s.values)) {
      errs.push({ path: `series[${idx}].values`, code: "values_not_array", message: "must be an array" });
      return;
    }

    if (s.values.length !== times.length) {
      errs.push({ path: `series[${idx}].values`, code: "values_length_mismatch", message: "must match timepointsHr length" });
    }

    const def = VITAL_DEFS[s.vital as VitalKey];
    let min = def.range.min;
    let max = def.range.max;
    if (s.vital === "temp" && spec.tempUnit === "F") {
      min = 86;
      max = 109;
    }

    s.values.forEach((v, vidx) => {
      if (typeof v !== "number" || !Number.isFinite(v)) {
        errs.push({ path: `series[${idx}].values[${vidx}]`, code: "value_not_number", message: "must be a finite number" });
      } else if (v < min || v > max) {
        errs.push({ path: `series[${idx}].values[${vidx}]`, code: "value_out_of_range", message: `must be between ${min} and ${max}` });
      }
    });
  });

  const tempUnit = value.tempUnit as string | undefined;
  if (tempUnit !== undefined && tempUnit !== "C" && tempUnit !== "F") {
    errs.push({ path: "tempUnit", code: "invalid_temp_unit", message: "must be 'C' or 'F'" });
  }

  // Cross-series bounds logic
  const dbpSeries = (spec.series || []).find(s => s.vital === "dbp");
  const mapSeries = (spec.series || []).find(s => s.vital === "map");
  const sbpSeries = (spec.series || []).find(s => s.vital === "sbp");

  if (mapSeries && sbpSeries && dbpSeries && mapSeries.values.length === times.length && sbpSeries.values.length === times.length && dbpSeries.values.length === times.length) {
    for (let i = 0; i < times.length; i++) {
      const mapVal = mapSeries.values[i];
      const sbpVal = sbpSeries.values[i];
      const dbpVal = dbpSeries.values[i];
      if (mapVal < dbpVal || mapVal > sbpVal) {
        errs.push({ path: `series_map[${i}]`, code: "map_bounds_violation", message: "MAP must be between DBP and SBP" });
      }
    }
  }

  if (value.caption !== undefined) {
    if (!isRecord(value.caption) || !nonEmptyString(value.caption.en)) {
      errs.push({ path: "caption.en", code: "caption_en_required", message: "is required when caption is present" });
    } else if (value.caption.zh !== undefined && !nonEmptyString(value.caption.zh)) {
      errs.push({ path: "caption.zh", code: "caption_zh_empty", message: "must be non-empty when present" });
    }
  }

  return errs;
};

export const selfCheckVitalsTrend = (spec: VitalsTrendSpec, _question: any): VisualError[] => {
  const errs: VisualError[] = [];

  const dbpSeries = spec.series.find(s => s.vital === "dbp");
  const mapSeries = spec.series.find(s => s.vital === "map");
  const sbpSeries = spec.series.find(s => s.vital === "sbp");

  if (mapSeries && sbpSeries && dbpSeries) {
    for (let i = 0; i < spec.timepointsHr.length; i++) {
      const dbp = dbpSeries.values[i];
      const sbp = sbpSeries.values[i];
      const providedMap = mapSeries.values[i];
      const computedMap = Math.round(dbp + (sbp - dbp) / 3);
      if (providedMap !== computedMap) {
        errs.push({ path: `series.map.values[${i}]`, code: "self_check_map_failed", message: `provided MAP ${providedMap} does not match computed MAP ${computedMap}` });
      }
    }
  }
  
  // Also check if question has an expectedTrend metadata block
  if (_question?.metadata?.expectedTrend) {
    const trend = _question.metadata.expectedTrend; // e.g. { vital: 'map', direction: 'down', window: [0, 6] }
    const tSeries = spec.series.find(s => s.vital === trend.vital);
    if (tSeries) {
      const idxStart = spec.timepointsHr.indexOf(trend.window[0]);
      const idxEnd = spec.timepointsHr.indexOf(trend.window[1]);
      if (idxStart !== -1 && idxEnd !== -1 && idxEnd > idxStart) {
        const valStart = tSeries.values[idxStart];
        const valEnd = tSeries.values[idxEnd];
        if (trend.direction === "down" && valEnd >= valStart) {
          errs.push({ path: `series.${trend.vital}`, code: "self_check_trend_failed", message: `expected trend ${trend.direction} but values did not match` });
        }
        if (trend.direction === "up" && valEnd <= valStart) {
          errs.push({ path: `series.${trend.vital}`, code: "self_check_trend_failed", message: `expected trend ${trend.direction} but values did not match` });
        }
      }
    }
  }

  return errs;
};

export const renderVitalsTrendSvg = (spec: VitalsTrendSpec): string => {
  const chartSeries: ChartSeries[] = spec.series.map(s => {
    const def = VITAL_DEFS[s.vital];
    const unit = s.vital === "temp" && spec.tempUnit === "F" ? "°F" : def.unit;
    return {
      label: def.label,
      unit: unit,
      axis: def.axis,
      styleRole: def.styleRole,
      points: s.values.map((v, i) => ({ x: spec.timepointsHr[i], y: v })),
      referenceBand: s.showReferenceBand !== false ? def.normal(spec.tempUnit) : undefined,
    };
  });

  const xMin = Math.min(...spec.timepointsHr);
  const xMax = Math.max(...spec.timepointsHr);
  
  // Calculate y-axis bounds
  let leftMin = 9999;
  let leftMax = -9999;
  let rightMin = 9999;
  let rightMax = -9999;
  
  let hasLeft = false;
  let hasRight = false;

  chartSeries.forEach(s => {
    const vals = s.points.map(p => p.y);
    if (s.referenceBand) {
      vals.push(s.referenceBand.low, s.referenceBand.high);
    }
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    
    if (s.axis === "left") {
      hasLeft = true;
      leftMin = Math.min(leftMin, min);
      leftMax = Math.max(leftMax, max);
    } else {
      hasRight = true;
      rightMin = Math.min(rightMin, min);
      rightMax = Math.max(rightMax, max);
    }
  });
  
  // Padding for y-axes
  if (hasLeft) {
    const padding = Math.max(10, (leftMax - leftMin) * 0.1);
    leftMin = Math.floor((leftMin - padding) / 10) * 10;
    leftMax = Math.ceil((leftMax + padding) / 10) * 10;
    if (leftMin < 0 && !chartSeries.some(s => s.points.some(p => p.y < 0))) leftMin = 0;
  } else {
    leftMin = 0; leftMax = 100;
  }
  
  if (hasRight) {
    const padding = Math.max(1, (rightMax - rightMin) * 0.1);
    rightMin = Math.floor(rightMin - padding);
    rightMax = Math.ceil(rightMax + padding);
  }

  const input: LineChartInput = {
    series: chartSeries,
    xAxis: {
      label: "Time (Hours)",
      min: xMin,
      max: xMax,
      ticks: spec.timepointsHr,
    },
    yAxisLeft: {
      label: "",
      min: leftMin,
      max: leftMax,
      ticks: [leftMin, leftMin + (leftMax - leftMin) / 2, leftMax],
    },
    width: 600,
    height: 300,
  };

  if (hasRight) {
    input.yAxisRight = {
      label: "",
      min: rightMin,
      max: rightMax,
      ticks: [rightMin, rightMin + (rightMax - rightMin) / 2, rightMax],
    };
  }

  const svgBody = renderLineChart(input);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" role="img" aria-label="Vitals Trend" data-kind="vitals_trend">\n${svgBody}\n</svg>`;
};

const fixtures: VisualKindModule<VitalsTrendSpec>["fixtures"] = {
  valid: [
    {
      kind: "vitals_trend",
      timepointsHr: [0, 1, 2, 3],
      series: [
        { vital: "hr", values: [80, 90, 100, 120] },
        { vital: "map", values: [90, 85, 80, 65] }
      ],
    },
    {
      kind: "vitals_trend",
      timepointsHr: [0, 4, 8],
      series: [
        { vital: "temp", values: [37.0, 38.5, 39.2] },
        { vital: "spo2", values: [98, 96, 92] }
      ],
      tempUnit: "C"
    }
  ],
  invalid: [
    { spec: { kind: "vitals_trend", timepointsHr: [0, 1], series: [] }, expectCode: "series_empty" },
    { spec: { kind: "vitals_trend", timepointsHr: [1, 0], series: [{ vital: "hr", values: [80, 90] }] }, expectCode: "timepoints_not_increasing" },
    { spec: { kind: "vitals_trend", timepointsHr: [0, 1], series: [{ vital: "hr", values: [80] }] }, expectCode: "values_length_mismatch" },
    { spec: { kind: "vitals_trend", timepointsHr: [0, 1], series: [{ vital: "hr", values: [80, 90] }, { vital: "hr", values: [85, 95] }] }, expectCode: "duplicate_vital" },
    { spec: { kind: "vitals_trend", timepointsHr: [0, 1], series: [{ vital: "hr", values: [999, 90] }] }, expectCode: "value_out_of_range" },
    { spec: { kind: "vitals_trend", timepointsHr: [0, 1], series: [{ vital: "sbp", values: [100, 100] }, { vital: "dbp", values: [60, 60] }, { vital: "map", values: [200, 200] }] }, expectCode: "map_bounds_violation" },
  ],
};

export const vitalsTrendModule: VisualKindModule<VitalsTrendSpec> = {
  kind: "vitals_trend",
  validate: validateVitalsTrend,
  selfCheck: selfCheckVitalsTrend,
  renderSvg: renderVitalsTrendSvg,
  fixtures,
};

import { registerVisual } from "../../registry";
registerVisual(vitalsTrendModule as VisualKindModule);
