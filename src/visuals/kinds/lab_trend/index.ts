import { type VisualError, type VisualKindModule } from "../../registry";
import { type ChartSeries, type LineChartInput, renderLineChart } from "../../primitives/lineChart";
import { type LabAnalyteKey, type LabTrendSpec } from "./types";
import { fmt, fmtNum } from "../../primitives/graphPaper";
import { escapeXml } from "../../primitives/escapeXml";
import { ANALYTE_DEFS } from "./defs";
import { isPopulation, type Population } from "../../../population";

const ANALYTE_KEYS = new Set<string>(Object.keys(ANALYTE_DEFS));

const SERIES_STYLE_ROLES = ["blue", "green"] as const;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const nonEmptyString = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

// ---------- validate ----------

export const validateLabTrend = (spec: LabTrendSpec): VisualError[] => {
  const errs: VisualError[] = [];
  const value = spec as unknown as Record<string, unknown>;

  if (value.kind !== "lab_trend") {
    errs.push({ path: "kind", code: "invalid_kind", message: "must be 'lab_trend'" });
    return errs;
  }

  // time
  if (!isRecord(value.time)) {
    errs.push({ path: "time", code: "timepoints_invalid", message: "must be an object with unit and values" });
    return errs;
  }
  const timeObj = value.time as Record<string, unknown>;
  if (timeObj.unit !== "hr" && timeObj.unit !== "min" && timeObj.unit !== "day") {
    errs.push({ path: "time.unit", code: "invalid_time_unit", message: "must be 'hr', 'min', or 'day'" });
  }
  if (!Array.isArray(timeObj.values) || timeObj.values.length === 0) {
    errs.push({ path: "time.values", code: "timepoints_invalid", message: "must be a non-empty array" });
    return errs;
  }

  const times = timeObj.values as unknown[];
  for (let i = 0; i < times.length; i++) {
    if (typeof times[i] !== "number" || !Number.isFinite(times[i] as number)) {
      errs.push({ path: `time.values[${i}]`, code: "timepoint_not_number", message: "must be a finite number" });
    } else if (i > 0 && typeof times[i - 1] === "number" && (times[i] as number) <= (times[i - 1] as number)) {
      errs.push({ path: `time.values[${i}]`, code: "timepoints_not_increasing", message: "must be strictly increasing" });
    }
  }

  const numTimepoints = times.length;
  if (numTimepoints < 3) {
    errs.push({ path: "time.values", code: "too_few_timepoints", message: "must have at least 3 timepoints" });
  }

  // population
  if (value.population !== undefined && !isPopulation(value.population)) {
    errs.push({ path: "population", code: "invalid_population", message: "must be 'adult', 'peds_child', or 'peds_infant'" });
  }

  // series
  if (!Array.isArray(value.series) || value.series.length === 0) {
    errs.push({ path: "series", code: "series_empty", message: "must have at least one series" });
    return errs;
  }
  if ((value.series as unknown[]).length > 2) {
    errs.push({ path: "series", code: "too_many_series", message: "must have at most 2 series" });
  }

  const pop: Population = isPopulation(value.population) ? value.population : "adult";
  const seenAnalytes = new Set<string>();
  const seriesArr = value.series as Record<string, unknown>[];

  seriesArr.forEach((s, idx) => {
    if (!isRecord(s)) {
      errs.push({ path: `series[${idx}]`, code: "series_entry_invalid", message: "must be an object" });
      return;
    }

    if (typeof s.analyte !== "string" || !ANALYTE_KEYS.has(s.analyte)) {
      errs.push({ path: `series[${idx}].analyte`, code: "invalid_analyte_key", message: "is not a recognized analyte key" });
      return;
    }

    const analyteKey = s.analyte as LabAnalyteKey;
    if (seenAnalytes.has(analyteKey)) {
      errs.push({ path: `series[${idx}].analyte`, code: "duplicate_analyte", message: "cannot duplicate analyte keys" });
    }
    seenAnalytes.add(analyteKey);

    const def = ANALYTE_DEFS[analyteKey];

    if (s.unit !== undefined) {
      const recognizedUnits = [def.canonicalUnit, ...def.altUnits];
      if (typeof s.unit !== "string" || !recognizedUnits.includes(s.unit)) {
        errs.push({ path: `series[${idx}].unit`, code: "invalid_unit_for_analyte", message: `must be one of: ${recognizedUnits.join(", ")}` });
      }
    }

    if (s.showReferenceBand !== undefined && typeof s.showReferenceBand !== "boolean") {
      errs.push({ path: `series[${idx}].showReferenceBand`, code: "invalid_show_reference_band", message: "must be a boolean" });
    }

    if (!Array.isArray(s.values)) {
      errs.push({ path: `series[${idx}].values`, code: "values_length_mismatch", message: "must be an array" });
      return;
    }

    if ((s.values as unknown[]).length !== numTimepoints) {
      errs.push({ path: `series[${idx}].values`, code: "values_length_mismatch", message: "must match time.values length" });
    }

    const { min, max } = def.sanity;
    const refBand = def.refBand[pop];

    if (s.showReferenceBand !== false && !refBand) {
      errs.push({
        path: `series[${idx}].showReferenceBand`,
        code: "reference_band_unavailable",
        message: `no verified ${pop} reference band exists for ${analyteKey}; set showReferenceBand false for trend-only use`,
      });
    }

    (s.values as unknown[]).forEach((v, vidx) => {
      if (typeof v !== "number" || !Number.isFinite(v)) {
        errs.push({ path: `series[${idx}].values[${vidx}]`, code: "value_not_number", message: "must be a finite number" });
      } else if (v < min || v > max) {
        const bandContext = refBand ? `; reference band is ${refBand.low}–${refBand.high}` : "";
        errs.push({ path: `series[${idx}].values[${vidx}]`, code: "value_out_of_range", message: `must be between ${min} and ${max} ${def.canonicalUnit} (sanity bounds for ${analyteKey}${bandContext})` });
      }
    });
  });

  if (value.caption !== undefined) {
    if (!isRecord(value.caption) || !nonEmptyString(value.caption.en)) {
      errs.push({ path: "caption.en", code: "caption_en_required", message: "is required when caption is present" });
    } else if (value.caption.zh !== undefined && !nonEmptyString(value.caption.zh)) {
      errs.push({ path: "caption.zh", code: "caption_zh_empty", message: "must be non-empty when present" });
    }
  }

  return errs;
};

// ---------- selfCheck ----------

export const selfCheckLabTrend = (spec: LabTrendSpec, question: unknown): VisualError[] => {
  const errs: VisualError[] = [];

  const times = Array.isArray(spec.time?.values) ? spec.time.values : [];
  if (times.length === 0 || !Array.isArray(spec.series)) return errs;

  const pop: Population = spec.population ?? "adult";

  // 1. Render fidelity: every plotted point equals series.values
  spec.series.forEach((s, idx) => {
    if (!ANALYTE_KEYS.has(s.analyte) || !Array.isArray(s.values)) return;
    s.values.forEach((v, vidx) => {
      if (typeof v !== "number" || !Number.isFinite(v)) {
        errs.push({ path: `series[${idx}].values[${vidx}]`, code: "self_check_render_divergence", message: "plotted value is not a finite number" });
      }
    });
  });

  // 2–4. Check question.meta block (audit-only; guards for malformed meta → VisualError, never throw)
  const meta = isRecord(question) && isRecord((question as Record<string, unknown>).meta)
    ? (question as Record<string, unknown>).meta as Record<string, unknown>
    : null;

  // 4a. Necessity: visual_justification
  if (meta !== null && !nonEmptyString(meta.visual_justification)) {
    errs.push({ path: "meta.visual_justification", code: "self_check_missing_justification", message: "must be present and non-empty" });
  }

  // 4b. Necessity: at least one expected_trend or expected_flags entry
  const expectedTrends: unknown[] = meta && Array.isArray(meta.expected_trend) ? meta.expected_trend : [];
  const expectedFlags: unknown[] = meta && Array.isArray(meta.expected_flags) ? meta.expected_flags : [];
  if (meta !== null && expectedTrends.length === 0 && expectedFlags.length === 0) {
    errs.push({ path: "meta", code: "self_check_no_keyed_cue", message: "must declare at least one expected_trend or expected_flags entry" });
  }

  // 3. Trend correctness
  for (const entry of expectedTrends) {
    if (!isRecord(entry)) continue;
    const seriesKey = typeof entry.series === "string" ? entry.series : null;
    if (!seriesKey) continue;
    if (!Array.isArray(entry.window) || entry.window.length !== 2) continue;

    const t0 = entry.window[0] as number;
    const t1 = entry.window[1] as number;

    // 4c. Necessity: window must span more than one timepoint
    const idxStart = times.indexOf(t0);
    const idxEnd = times.indexOf(t1);
    if (idxStart === -1 || idxEnd === -1 || idxEnd <= idxStart) {
      errs.push({ path: `meta.expected_trend[series=${seriesKey}]`, code: "self_check_snapshot_not_trajectory", message: "window must span more than one timepoint present in time.values" });
      continue;
    }

    const tSeries = spec.series.find(s => s.analyte === seriesKey);
    if (!tSeries || !Array.isArray(tSeries.values)) continue;

    const valStart = tSeries.values[idxStart];
    const valEnd = tSeries.values[idxEnd];
    if (typeof valStart !== "number" || typeof valEnd !== "number") continue;

    const def = ANALYTE_DEFS[tSeries.analyte];
    const band = def ? def.refBand[pop] : undefined;

    if (entry.direction === "stable" && !band) {
      errs.push({
        path: `meta.expected_trend[series=${seriesKey}]`,
        code: "self_check_stable_requires_reference_band",
        message: `stable assertions require a verified ${pop} reference band for ${seriesKey}`,
      });
      continue;
    }

    const eps = def && band ? def.stableEps * (band.high - band.low) : 0;

    if (entry.direction === "up" && valEnd <= valStart) {
      errs.push({ path: `series.${seriesKey}`, code: "self_check_trend_failed", message: `expected 'up' but valEnd (${valEnd}) <= valStart (${valStart})` });
    } else if (entry.direction === "down" && valEnd >= valStart) {
      errs.push({ path: `series.${seriesKey}`, code: "self_check_trend_failed", message: `expected 'down' but valEnd (${valEnd}) >= valStart (${valStart})` });
    } else if (entry.direction === "stable" && Math.abs(valEnd - valStart) > eps) {
      errs.push({ path: `series.${seriesKey}`, code: "self_check_trend_failed", message: `expected 'stable' but |valEnd − valStart| (${Math.abs(valEnd - valStart)}) > stableEps (${eps})` });
    }
  }

  // 2. Flag correctness: for each expected_flags entry, recompute H/L from registry band
  for (const entry of expectedFlags) {
    if (!isRecord(entry)) continue;
    const seriesKey = typeof entry.series === "string" ? entry.series : null;
    if (!seriesKey || typeof entry.at !== "number") continue;

    const tSeries = spec.series.find(s => s.analyte === seriesKey);
    if (!tSeries || !Array.isArray(tSeries.values)) continue;

    const def = ANALYTE_DEFS[tSeries.analyte];
    if (!def) continue;

    const timeIdx = times.indexOf(entry.at as number);
    if (timeIdx === -1) continue;

    const val = tSeries.values[timeIdx];
    if (typeof val !== "number") continue;

    const band = def.refBand[pop];
    if (!band) {
      errs.push({
        path: `meta.expected_flags[series=${seriesKey}]`,
        code: "self_check_flag_requires_reference_band",
        message: `H/L assertions require a verified ${pop} reference band for ${seriesKey}`,
      });
      continue;
    }

    const computedFlag = val > band.high ? "H" : val < band.low ? "L" : null;
    if (entry.flag !== computedFlag) {
      errs.push({ path: `series.${seriesKey}[t=${entry.at}]`, code: "self_check_flag_failed", message: `declared flag '${entry.flag}' but computed '${computedFlag ?? "normal"}' (value ${val}, band ${band.low}–${band.high})` });
    }
  }

  return errs;
};

// ---------- renderSvg ----------

export const renderLabTrendSvg = (spec: LabTrendSpec): string => {
  const times = spec.time?.values ?? [];
  const timeUnit = spec.time?.unit ?? "hr";
  const pop: Population = spec.population ?? "adult";

  const xAxisLabel =
    timeUnit === "min" ? "Time (Minutes)" :
    timeUnit === "day" ? "Time (Days)" :
    "Time (Hours)";

  const chartSeries: ChartSeries[] = spec.series.map((s, idx) => {
    const def = ANALYTE_DEFS[s.analyte];
    const band = def ? def.refBand[pop] : undefined;
    const axis: "left" | "right" = idx === 0 ? "left" : "right";
    return {
      label: def ? def.label : s.analyte,
      unit: s.unit ?? (def ? def.canonicalUnit : ""),
      axis,
      styleRole: SERIES_STYLE_ROLES[idx] ?? "blue",
      points: s.values.map((v, i) => ({ x: times[i], y: v })),
      referenceBand: s.showReferenceBand !== false && band ? band : undefined,
    };
  });

  const xMin = times.length > 0 ? Math.min(...times) : 0;
  const xMax = times.length > 0 ? Math.max(...times) : 1;

  let leftMin = 9999, leftMax = -9999;
  let rightMin = 9999, rightMax = -9999;
  let hasLeft = false, hasRight = false;

  chartSeries.forEach(s => {
    const vals = s.points.map(p => p.y);
    if (s.referenceBand) vals.push(s.referenceBand.low, s.referenceBand.high);
    const mn = Math.min(...vals);
    const mx = Math.max(...vals);
    if (s.axis === "left") {
      hasLeft = true;
      leftMin = Math.min(leftMin, mn);
      leftMax = Math.max(leftMax, mx);
    } else {
      hasRight = true;
      rightMin = Math.min(rightMin, mn);
      rightMax = Math.max(rightMax, mx);
    }
  });

  if (hasLeft) {
    const pad = Math.max((leftMax - leftMin) * 0.1, (leftMax - leftMin) * 0.05 + 0.1);
    leftMin = leftMin - pad;
    leftMax = leftMax + pad;
    if (leftMin < 0 && !chartSeries.some(s => s.axis === "left" && s.points.some(p => p.y < 0))) leftMin = 0;
  } else {
    leftMin = 0; leftMax = 100;
  }

  if (hasRight) {
    const pad = Math.max((rightMax - rightMin) * 0.1, (rightMax - rightMin) * 0.05 + 0.1);
    rightMin = rightMin - pad;
    rightMax = rightMax + pad;
    if (rightMin < 0 && !chartSeries.some(s => s.axis === "right" && s.points.some(p => p.y < 0))) rightMin = 0;
  }

  const input: LineChartInput = {
    series: chartSeries,
    xAxis: { label: xAxisLabel, min: xMin, max: xMax, ticks: times },
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
  const captionAttr = spec.caption ? ` aria-label="${escapeXml(spec.caption.en)}"` : ` aria-label="Lab Trend"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" role="img"${captionAttr} data-kind="lab_trend">\n${svgBody}\n</svg>`;
};

// ---------- learner-facing two-series presentation ----------

export type LabTrendTableModel = {
  columns: Array<{ key: string; label: string }>;
  rows: Array<{
    key: LabAnalyteKey;
    label: string;
    unit: string;
    values: string[];
  }>;
};

export type LabTrendLegendEntry = {
  key: LabAnalyteKey;
  label: string;
  unit: string;
  colorRole: (typeof SERIES_STYLE_ROLES)[number];
  dashed: boolean;
};

type LabTrendPresentationCommon = {
  timeUnit: LabTrendSpec["time"]["unit"];
  timepoints: Array<{ index: number; value: number; label: string }>;
  legend: LabTrendLegendEntry[];
  readoutByTimepoint: Array<{
    timeLabel: string;
    rows: Array<{ key: LabAnalyteKey; label: string; valueText: string }>;
  }>;
  tableModel: LabTrendTableModel;
};

export type NormalizedLabTrendPresentationModel = LabTrendPresentationCommon & {
  mode: "normalized";
  yAxis: { min: number; max: number; ticks: number[] };
  series: Array<{
    analyte: LabAnalyteKey;
    label: string;
    unit: string;
    colorRole: (typeof SERIES_STYLE_ROLES)[number];
    dashed: boolean;
    points: Array<{ timeIndex: number; value: number; normalizedChangePct: number }>;
  }>;
};

export type LegacyFallbackLabTrendPresentationModel = LabTrendPresentationCommon & {
  mode: "legacy_fallback";
  reason: "zero_baseline";
};

export type LabTrendPresentationModel =
  | NormalizedLabTrendPresentationModel
  | LegacyFallbackLabTrendPresentationModel;

export const LAB_TREND_PRESENTATION_LAYOUT = {
  width: 600,
  height: 340,
  plotLeft: 72,
  plotRight: 570,
  plotTop: 72,
  plotBottom: 286,
  legendLeft: 72,
  legendTop: 16,
  legendCellWidth: 240,
  legendCellHeight: 28,
} as const;

const shortTimeUnit = (unit: LabTrendSpec["time"]["unit"]): string =>
  unit === "hr" ? "hr" : unit === "min" ? "min" : "day";

const timepointLabel = (value: number, unit: LabTrendSpec["time"]["unit"]): string =>
  unit === "day" ? `Day ${fmtNum(value)}` : `${fmtNum(value)} ${shortTimeUnit(unit)}`;

const timeAxisLabel = (unit: LabTrendSpec["time"]["unit"]): string =>
  unit === "hr" ? "Time (Hours)" : unit === "min" ? "Time (Minutes)" : "Time (Days)";

export const formatLabTrendLabelWithUnit = (label: string, unit: string): string =>
  unit.startsWith("(") && unit.endsWith(")") ? `${label} ${unit}` : `${label} (${unit})`;

export const buildLabTrendTableModel = (spec: LabTrendSpec): LabTrendTableModel => ({
  columns: [
    { key: "analyte", label: "Laboratory test" },
    ...spec.time.values.map((time, index) => ({
      key: `time-${index}`,
      label: timepointLabel(time, spec.time.unit),
    })),
  ],
  rows: spec.series.map((series) => {
    const def = ANALYTE_DEFS[series.analyte];
    return {
      key: series.analyte,
      label: def.label,
      unit: series.unit ?? def.canonicalUnit,
      values: series.values.map(fmtNum),
    };
  }),
});

const niceStep = (roughStep: number): number => {
  if (!Number.isFinite(roughStep) || roughStep <= 0) return 10;
  const exponent = Math.floor(Math.log10(roughStep));
  const fraction = roughStep / (10 ** exponent);
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * (10 ** exponent);
};

const cleanNumber = (value: number): number => Number(value.toPrecision(12));

const normalizedScale = (values: number[]): { min: number; max: number; ticks: number[] } => {
  const minValue = Math.min(0, ...values);
  const maxValue = Math.max(0, ...values);
  if (minValue === 0 && maxValue === 0) return { min: -10, max: 10, ticks: [-10, 0, 10] };

  const paddedMin = minValue < 0 ? minValue - Math.max((maxValue - minValue) * 0.08, 1) : 0;
  const paddedMax = maxValue > 0 ? maxValue + Math.max((maxValue - minValue) * 0.08, 1) : 0;
  const step = niceStep((paddedMax - paddedMin) / 5);
  const min = paddedMin < 0 ? Math.floor(paddedMin / step) * step : 0;
  const max = paddedMax > 0 ? Math.ceil(paddedMax / step) * step : 0;
  const ticks: number[] = [];
  for (let tick = min; tick <= max + step * 0.001; tick += step) ticks.push(cleanNumber(tick));
  return { min: cleanNumber(min), max: cleanNumber(max), ticks };
};

export const buildLabTrendPresentationModel = (spec: LabTrendSpec): LabTrendPresentationModel => {
  const tableModel = buildLabTrendTableModel(spec);
  const timeUnit = spec.time.unit;
  const timepoints = spec.time.values.map((value, index) => ({
    index,
    value,
    label: timepointLabel(value, timeUnit),
  }));
  const legend: LabTrendLegendEntry[] = spec.series.map((series, index) => {
    const def = ANALYTE_DEFS[series.analyte];
    return {
      key: series.analyte,
      label: def.label,
      unit: series.unit ?? def.canonicalUnit,
      colorRole: SERIES_STYLE_ROLES[index] ?? "blue",
      dashed: index === 1,
    };
  });
  const readoutByTimepoint = timepoints.map((timepoint) => ({
    timeLabel: timepoint.label,
    rows: tableModel.rows.map((row) => ({
      key: row.key,
      label: row.label,
      valueText: `${row.values[timepoint.index]} ${row.unit}`,
    })),
  }));
  const common: LabTrendPresentationCommon = {
    timeUnit,
    timepoints,
    legend,
    readoutByTimepoint,
    tableModel,
  };

  if (spec.series.some((series) => series.values[0] === 0)) {
    return { ...common, mode: "legacy_fallback", reason: "zero_baseline" };
  }

  const series = spec.series.map((source, index) => {
    const def = ANALYTE_DEFS[source.analyte];
    const baseline = source.values[0];
    return {
      analyte: source.analyte,
      label: def.label,
      unit: source.unit ?? def.canonicalUnit,
      colorRole: SERIES_STYLE_ROLES[index] ?? "blue",
      dashed: index === 1,
      points: source.values.map((value, timeIndex) => ({
        timeIndex,
        value,
        normalizedChangePct: cleanNumber(((value - baseline) / Math.abs(baseline)) * 100),
      })),
    };
  });
  const normalizedValues = series.flatMap((entry) => entry.points.map((point) => point.normalizedChangePct));
  return { ...common, mode: "normalized", yAxis: normalizedScale(normalizedValues), series };
};

const colorForLabStyleRole = (role: LabTrendLegendEntry["colorRole"]): string =>
  role === "green" ? "#047857" : "#2563eb";

export const renderNormalizedLabTrendSvg = (model: NormalizedLabTrendPresentationModel): string => {
  const layout = LAB_TREND_PRESENTATION_LAYOUT;
  const plotWidth = layout.plotRight - layout.plotLeft;
  const plotHeight = layout.plotBottom - layout.plotTop;
  const xMin = Math.min(...model.timepoints.map((point) => point.value));
  const xMax = Math.max(...model.timepoints.map((point) => point.value));
  const mapX = (value: number) => xMax <= xMin
    ? layout.plotLeft + plotWidth / 2
    : layout.plotLeft + ((value - xMin) / (xMax - xMin)) * plotWidth;
  const mapY = (value: number) => model.yAxis.max <= model.yAxis.min
    ? layout.plotTop + plotHeight / 2
    : layout.plotBottom - ((value - model.yAxis.min) / (model.yAxis.max - model.yAxis.min)) * plotHeight;
  const elements: string[] = [];

  model.yAxis.ticks.forEach((tick) => {
    const y = mapY(tick);
    const baseline = tick === 0;
    elements.push(`<line x1="${fmt(layout.plotLeft)}" y1="${fmt(y)}" x2="${fmt(layout.plotRight)}" y2="${fmt(y)}" stroke="${baseline ? "#94a3b8" : "#e2e8f0"}" stroke-width="${baseline ? "1.5" : "1"}"${baseline ? ' data-baseline-line="true"' : ""}/>`);
    elements.push(`<text x="${fmt(layout.plotLeft - 8)}" y="${fmt(y + 4)}" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="end">${escapeXml(`${fmtNum(tick)}%`)}</text>`);
  });

  const pointXs = model.timepoints.map((timepoint) => mapX(timepoint.value));
  model.timepoints.forEach((timepoint, index) => {
    const x = pointXs[index];
    elements.push(`<line x1="${fmt(x)}" y1="${fmt(layout.plotTop)}" x2="${fmt(x)}" y2="${fmt(layout.plotBottom)}" stroke="#e2e8f0" stroke-width="1"/>`);
    elements.push(`<text x="${fmt(x)}" y="${fmt(layout.plotBottom + 18)}" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle">${escapeXml(fmtNum(timepoint.value))}</text>`);
  });
  elements.push(`<line x1="${fmt(layout.plotLeft)}" y1="${fmt(layout.plotTop)}" x2="${fmt(layout.plotLeft)}" y2="${fmt(layout.plotBottom)}" stroke="#94a3b8" stroke-width="2"/>`);
  elements.push(`<line x1="${fmt(layout.plotLeft)}" y1="${fmt(layout.plotBottom)}" x2="${fmt(layout.plotRight)}" y2="${fmt(layout.plotBottom)}" stroke="#94a3b8" stroke-width="2"/>`);
  elements.push(`<text x="18" y="${fmt(layout.plotTop + plotHeight / 2)}" transform="rotate(-90 18 ${fmt(layout.plotTop + plotHeight / 2)})" font-family="sans-serif" font-size="12" font-weight="600" fill="#475569" text-anchor="middle">Change from baseline</text>`);
  elements.push(`<text x="${fmt(layout.plotLeft + plotWidth / 2)}" y="${fmt(layout.height - 12)}" font-family="sans-serif" font-size="14" font-weight="500" fill="#334155" text-anchor="middle">${timeAxisLabel(model.timeUnit)}</text>`);

  model.series.forEach((series) => {
    const color = colorForLabStyleRole(series.colorRole);
    const dash = series.dashed ? ' stroke-dasharray="7 5"' : "";
    const points = series.points.map((point) => `${fmt(pointXs[point.timeIndex])},${fmt(mapY(point.normalizedChangePct))}`).join(" ");
    const marks = series.points.map((point) => {
      const x = pointXs[point.timeIndex];
      const y = mapY(point.normalizedChangePct);
      return series.dashed
        ? `<rect x="${fmt(x - 4)}" y="${fmt(y - 4)}" width="8" height="8" transform="rotate(45 ${fmt(x)} ${fmt(y)})" fill="#ffffff" stroke="${color}" stroke-width="2"/>`
        : `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="4" fill="#ffffff" stroke="${color}" stroke-width="2"/>`;
    }).join("\n");
    elements.push(`<g class="lab-trend-epic-series" data-analyte="${series.analyte}">\n<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.75"${dash} stroke-linecap="round" stroke-linejoin="round"/>\n${marks}\n</g>`);
  });

  model.legend.forEach((entry, index) => {
    const x = layout.legendLeft + index * layout.legendCellWidth;
    const y = layout.legendTop + 12;
    const color = colorForLabStyleRole(entry.colorRole);
    const dash = entry.dashed ? ' stroke-dasharray="7 5"' : "";
    elements.push([
      `<g class="lab-trend-epic-legend-entry" data-legend="${entry.key}">`,
      `<line x1="${fmt(x)}" y1="${fmt(y)}" x2="${fmt(x + 20)}" y2="${fmt(y)}" stroke="${color}" stroke-width="2.75"${dash}/>` ,
      entry.dashed
        ? `<rect x="${fmt(x + 7)}" y="${fmt(y - 3)}" width="6" height="6" transform="rotate(45 ${fmt(x + 10)} ${fmt(y)})" fill="#ffffff" stroke="${color}" stroke-width="1.5"/>`
        : `<circle cx="${fmt(x + 10)}" cy="${fmt(y)}" r="3" fill="#ffffff" stroke="${color}" stroke-width="1.5"/>`,
      `<text x="${fmt(x + 28)}" y="${fmt(y + 4)}" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="start">${escapeXml(formatLabTrendLabelWithUnit(entry.label, entry.unit))}</text>`,
      `</g>`,
    ].join("\n"));
  });

  model.timepoints.forEach((timepoint, index) => {
    const x = pointXs[index];
    const left = index === 0 ? layout.plotLeft : (pointXs[index - 1] + x) / 2;
    const right = index === model.timepoints.length - 1 ? layout.plotRight : (x + pointXs[index + 1]) / 2;
    elements.push(`<rect x="${fmt(left)}" y="${fmt(layout.plotTop)}" width="${fmt(Math.max(0, right - left))}" height="${fmt(plotHeight)}" fill="transparent" data-timepoint-index="${timepoint.index}" data-timepoint-x="${fmt(x)}"/>`);
  });
  elements.push(`<line class="lab-trend-epic-guide" data-guide-line="true" x1="${fmt(layout.plotLeft)}" y1="${fmt(layout.plotTop)}" x2="${fmt(layout.plotLeft)}" y2="${fmt(layout.plotBottom)}" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="3 3" opacity="0"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${layout.width} ${layout.height}" role="img" aria-label="Lab trend. Vertical position represents percentage change from each analyte's baseline; exact measurements are listed in the table below." data-kind="lab_trend" data-variant="normalized">\n${elements.join("\n")}\n</svg>`;
};

export const renderLabTrendPresentationSvg = (
  spec: LabTrendSpec,
  model: LabTrendPresentationModel = buildLabTrendPresentationModel(spec),
): string => model.mode === "normalized" ? renderNormalizedLabTrendSvg(model) : renderLabTrendSvg(spec);

// ---------- fixtures ----------

const fixtures: VisualKindModule<LabTrendSpec>["fixtures"] = {
  valid: [
    // Rising creatinine over 72 h (AKI worsening, single analyte, left axis)
    {
      kind: "lab_trend",
      time: { unit: "hr", values: [0, 24, 48, 72] },
      population: "adult",
      series: [{ analyte: "creatinine", values: [1.1, 1.8, 2.6, 3.5] }],
      caption: { en: "Serum creatinine trend", zh: "血肌酐变化趋势" },
    },
    // Falling Na⁺ (SIADH) paired with rising creatinine — dual axis
    {
      kind: "lab_trend",
      time: { unit: "day", values: [0, 1, 2, 3] },
      population: "adult",
      series: [
        { analyte: "sodium", values: [138, 132, 126, 121] },
        { analyte: "creatinine", values: [0.9, 1.2, 1.6, 2.0] },
      ],
    },
    // Pediatric trend-only use is allowed when the unavailable coarse-bucket band is suppressed.
    {
      kind: "lab_trend",
      time: { unit: "hr", values: [0, 12, 24] },
      population: "peds_child",
      series: [{ analyte: "lactate", values: [4.2, 2.8, 1.9], showReferenceBand: false }],
    },
  ],
  invalid: [
    // too_few_timepoints: only 2 points
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24] }, series: [{ analyte: "creatinine", values: [1.0, 2.0] }] }, expectCode: "too_few_timepoints" },
    // too_many_series: 3 analytes
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "sodium", values: [138, 135, 132] }, { analyte: "potassium", values: [4.0, 4.2, 4.5] }, { analyte: "creatinine", values: [1.0, 1.5, 2.0] }] }, expectCode: "too_many_series" },
    // duplicate_analyte
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1.0, 1.5, 2.0] }, { analyte: "creatinine", values: [1.0, 1.5, 2.0] }] }, expectCode: "duplicate_analyte" },
    // values_length_mismatch
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1.0, 2.0] }] }, expectCode: "values_length_mismatch" },
    // value_out_of_range: creatinine 99 exceeds sanity max of 25
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1.0, 2.0, 99] }] }, expectCode: "value_out_of_range" },
    // invalid_analyte_key
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "fibrinogen", values: [300, 350, 400] }] }, expectCode: "invalid_analyte_key" },
    // timepoints_not_increasing
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 48, 24] }, series: [{ analyte: "creatinine", values: [1.0, 2.0, 1.5] }] }, expectCode: "timepoints_not_increasing" },
    // invalid_kind
    { spec: { kind: "vitals_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1.0, 1.5, 2.0] }] }, expectCode: "invalid_kind" },
    // invalid_time_unit
    { spec: { kind: "lab_trend", time: { unit: "week", values: [0, 1, 2] }, series: [{ analyte: "creatinine", values: [1.0, 1.5, 2.0] }] }, expectCode: "invalid_time_unit" },
    // timepoint_not_number
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, "twenty-four", 48] }, series: [{ analyte: "creatinine", values: [1.0, 1.5, 2.0] }] }, expectCode: "timepoint_not_number" },
    // invalid_population
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, population: "geriatric", series: [{ analyte: "creatinine", values: [1.0, 1.5, 2.0] }] }, expectCode: "invalid_population" },
    // Coarse pediatric buckets are trend-only unless the band is explicitly suppressed.
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, population: "peds_child", series: [{ analyte: "creatinine", values: [0.5, 0.6, 0.7] }] }, expectCode: "reference_band_unavailable" },
    // invalid_unit_for_analyte
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", unit: "bpm", values: [1.0, 1.5, 2.0] }] }, expectCode: "invalid_unit_for_analyte" },
    // caption_en_required
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1.0, 1.5, 2.0] }], caption: { en: "" } }, expectCode: "caption_en_required" },
    // caption_zh_empty
    { spec: { kind: "lab_trend", time: { unit: "hr", values: [0, 24, 48] }, series: [{ analyte: "creatinine", values: [1.0, 1.5, 2.0] }], caption: { en: "Creatinine", zh: "" } }, expectCode: "caption_zh_empty" },
  ],
};

export const labTrendModule: VisualKindModule<LabTrendSpec> = {
  kind: "lab_trend",
  allowedItemTypes: ["multiple_choice", "select_all", "matrix", "ordered_response", "dropdown_cloze", "fill_in_blank"],
  validate: validateLabTrend,
  selfCheck: selfCheckLabTrend,
  renderSvg: renderLabTrendSvg,
  fixtures,
};

import { registerVisual } from "../../registry";
registerVisual(labTrendModule as VisualKindModule);
