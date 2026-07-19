import { type RenderOptions, type VisualError, type VisualKindModule } from "../../registry";
import { type ChartSeries, type LineChartInput, renderLineChart } from "../../primitives/lineChart";
import { type VitalKey, type VitalsTrendSpec } from "./types";
import { fmt, fmtNum } from "../../primitives/graphPaper";
import { escapeXml } from "../../primitives/escapeXml";
import { measureDocTable, renderDocTable, type DocTableInput, type DocTableRow } from "../../primitives/table";
import { VITAL_DEFS } from "./defs";
import { isPopulation } from "../../../population";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

export const validateVitalsTrend = (spec: VitalsTrendSpec): VisualError[] => {
  const errs: VisualError[] = [];
  const value = spec as unknown as Record<string, unknown>;

  let times: number[] = [];
  
  if (isRecord(value.time) && Array.isArray(value.time.values)) {
    times = value.time.values as number[];
    if (value.time.unit !== "hr" && value.time.unit !== "min") {
      errs.push({ path: "time.unit", code: "invalid_time_unit", message: "must be 'hr' or 'min'" });
    }
  } else if (Array.isArray(value.timepointsHr)) {
    times = value.timepointsHr as number[];
  }

  if (times.length === 0) {
    errs.push({ path: "time", code: "timepoints_invalid", message: "must provide time.values or timepointsHr as a non-empty array" });
    return errs;
  }
  
  for (let i = 0; i < times.length; i++) {
    if (typeof times[i] !== "number" || !Number.isFinite(times[i])) {
      errs.push({ path: `time.values[${i}]`, code: "timepoint_not_number", message: "must be a finite number" });
    }
    if (i > 0 && times[i] <= times[i - 1]) {
      errs.push({ path: `time.values[${i}]`, code: "timepoints_not_increasing", message: "must be strictly increasing" });
    }
  }

  if (value.population !== undefined && !isPopulation(value.population)) {
    errs.push({ path: "population", code: "invalid_population", message: "must be 'adult', 'peds_child', or 'peds_infant'" });
  }

  if (!Array.isArray(value.series) || value.series.length === 0) {
    errs.push({ path: "series", code: "series_empty", message: "must have at least one series" });
    return errs;
  }

  const seenVitals = new Set<string>();
  const series = value.series as Record<string, unknown>[];

  series.forEach((s, idx) => {
    if (!isRecord(s)) {
      errs.push({ path: `series[${idx}]`, code: "series_entry_invalid", message: "must be an object" });
      return;
    }

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
    if (s.vital === "temp") {
      const u = spec.tempUnit ?? "C";
      min = u === "F" ? 86 : 30;
      max = u === "F" ? 109 : 43;
    }

    if (s.showReferenceBand !== undefined && typeof s.showReferenceBand !== "boolean") {
      errs.push({ path: `series[${idx}].showReferenceBand`, code: "invalid_show_reference_band", message: "must be a boolean" });
    }
    if (value.population !== undefined && value.population !== "adult" && s.showReferenceBand === true) {
      errs.push({
        path: `series[${idx}].showReferenceBand`,
        code: "reference_band_population_unsupported",
        message: 'reference bands are only available for population "adult"; omit showReferenceBand or set it to false',
      });
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
  const dbpSeries = (spec.series || []).find(s => isRecord(s) && s.vital === "dbp" && Array.isArray(s.values));
  const mapSeries = (spec.series || []).find(s => isRecord(s) && s.vital === "map" && Array.isArray(s.values));
  const sbpSeries = (spec.series || []).find(s => isRecord(s) && s.vital === "sbp" && Array.isArray(s.values));

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

  const times = spec.time?.values ?? spec.timepointsHr;
  if (!Array.isArray(times) || !Array.isArray(spec.series)) {
    return errs;
  }

  const dbpSeries = spec.series.find(s => isRecord(s) && s.vital === "dbp" && Array.isArray(s.values));
  const mapSeries = spec.series.find(s => isRecord(s) && s.vital === "map" && Array.isArray(s.values));
  const sbpSeries = spec.series.find(s => isRecord(s) && s.vital === "sbp" && Array.isArray(s.values));

  if (mapSeries && sbpSeries && dbpSeries) {
    for (let i = 0; i < times.length; i++) {
      const dbp = dbpSeries.values[i];
      const sbp = sbpSeries.values[i];
      const providedMap = mapSeries.values[i];
      if (typeof dbp === "number" && typeof sbp === "number" && typeof providedMap === "number") {
        const computedMap = Math.round(dbp + (sbp - dbp) / 3);
        if (providedMap !== computedMap) {
          errs.push({ path: `series.map.values[${i}]`, code: "self_check_map_failed", message: `provided MAP ${providedMap} does not match computed MAP ${computedMap}` });
        }
      }
    }
  }
  
  // Check question.meta.expected_trend (canonical snake_case array; accepts legacy "vital" or "series" key)
  const meta = isRecord(_question) && isRecord((_question as Record<string, unknown>).meta)
    ? (_question as Record<string, unknown>).meta as Record<string, unknown>
    : null;
  const expectedTrends = meta && Array.isArray(meta.expected_trend) ? meta.expected_trend as unknown[] : [];
  for (const entry of expectedTrends) {
    if (!isRecord(entry)) continue;
    const vitalKey = typeof entry.series === "string" ? entry.series : typeof entry.vital === "string" ? entry.vital : null;
    if (!vitalKey || !Array.isArray(entry.window) || entry.window.length !== 2) continue;
    const tSeries = spec.series.find(s => isRecord(s) && s.vital === vitalKey && Array.isArray(s.values));
    if (!tSeries) continue;
    const idxStart = times.indexOf(entry.window[0] as number);
    const idxEnd = times.indexOf(entry.window[1] as number);
    if (idxStart === -1 || idxEnd === -1 || idxEnd <= idxStart) continue;
    const valStart = tSeries.values[idxStart];
    const valEnd = tSeries.values[idxEnd];
    if (typeof valStart !== "number" || typeof valEnd !== "number") continue;
    if (entry.direction === "down" && valEnd >= valStart) {
      errs.push({ path: `series.${vitalKey}`, code: "self_check_trend_failed", message: `expected trend ${entry.direction} but values did not match` });
    }
    if (entry.direction === "up" && valEnd <= valStart) {
      errs.push({ path: `series.${vitalKey}`, code: "self_check_trend_failed", message: `expected trend ${entry.direction} but values did not match` });
    }
  }

  return errs;
};

export const VITALS_TREND_LAYOUT = {
  width: 600,
  singleAxisChartWidth: 570,
  headingHeight: 28,
  legendRowHeight: 20,
  panelGap: 16,
  chartTableGap: 24,
  standardChartHeight: 260,
  temperatureChartHeight: 220,
  tableHeaderHeight: 28,
  tableRowHeight: 24,
  tableFirstColumnFr: 2.4,
} as const;

type VitalSeriesSpec = VitalsTrendSpec["series"][number];
type ScaleFamily = "pressure" | "hr" | "rr" | "spo2" | "temp";
type VitalsPanelKey = "hemodynamics" | "respiratory-oxygenation" | "temperature";

type PanelSeries = {
  vital: VitalKey;
  chart: ChartSeries;
};

type VitalsPanel = {
  key: VitalsPanelKey;
  heading: string;
  chartHeight: number;
  series: PanelSeries[];
  leftFamily: ScaleFamily;
  leftLabel: string;
  rightFamily?: ScaleFamily;
  rightLabel?: string;
};

const LEGEND_LABELS: Record<VitalKey, string> = {
  hr: "HR",
  sbp: "SBP",
  dbp: "DBP",
  map: "MAP",
  rr: "RR",
  spo2: "SpO₂",
  temp: "Temperature",
};

const VITAL_ORDER = ["hr", "sbp", "dbp", "map", "rr", "spo2", "temp"] as const;

export type VitalsTableModel = {
  columns: Array<{ key: string; label: string }>;
  rows: Array<{ key: string; label: string; values: string[] }>;
};

export type EpicVitalsLegendEntry = {
  key: "hr" | "bp" | "map" | "rr" | "spo2" | "temp";
  label: string;
  unit: string;
  vitals: VitalKey[];
  colorRole: string;
  dashed: boolean;
};

export type EpicVitalsModel = {
  timeUnit: "hr" | "min";
  timepoints: Array<{ index: number; label: string; value: number }>;
  yAxis: { min: number; max: number; ticks: number[] };
  referenceBand?: { low: number; high: number };
  series: Array<{
    vital: VitalKey;
    label: string;
    unit: string;
    colorRole: string;
    dashed: boolean;
    points: Array<{ timeIndex: number; value: number }>;
  }>;
  legend: EpicVitalsLegendEntry[];
  readoutByTimepoint: Array<{
    timeLabel: string;
    rows: Array<{ key: string; label: string; valueText: string }>;
  }>;
  tableModel: VitalsTableModel;
};

export const EPIC_VITALS_LAYOUT = {
  width: 600,
  height: 360,
  plotLeft: 60,
  plotRight: 570,
  plotTop: 74,
  plotBottom: 304,
  legendLeft: 60,
  legendTop: 10,
  legendCellWidth: 170,
  legendCellHeight: 24,
  legendColumns: 3,
} as const;

const colorForStyleRole = (role?: string): string => {
  switch (role) {
    case "red": return "#ef4444";
    case "blue": return "#3b82f6";
    case "green": return "#10b981";
    case "orange": return "#f97316";
    case "purple": return "#8b5cf6";
    case "slate": return "#64748b";
    default: return "#1f2933";
  }
};

const unitForVital = (vital: VitalKey, tempUnit?: "C" | "F"): string =>
  vital === "temp" ? (tempUnit === "F" ? "°F" : "°C") : VITAL_DEFS[vital].unit;

const buildVitalsPanels = (
  seriesByVital: Map<VitalKey, VitalSeriesSpec>,
  times: number[],
  tempUnit: "C" | "F" | undefined,
  population: VitalsTrendSpec["population"] | "adult",
): VitalsPanel[] => {
  const panels: VitalsPanel[] = [];

  const makeSeries = (
    vital: VitalKey,
    axis: "left" | "right",
    panelSeriesCount: number,
  ): PanelSeries | undefined => {
    const source = seriesByVital.get(vital);
    if (!source) return undefined;
    const def = VITAL_DEFS[vital];
    return {
      vital,
      chart: {
        label: LEGEND_LABELS[vital],
        unit: unitForVital(vital, tempUnit),
        axis,
        styleRole: def.styleRole,
        strokeDash: vital === "dbp",
        points: source.values.map((value, index) => ({ x: times[index], y: value })),
        referenceBand:
          panelSeriesCount === 1 && population === "adult" && source.showReferenceBand !== false
            ? def.normal(tempUnit)
            : undefined,
      },
    };
  };

  const hemodynamicKeys = (["hr", "sbp", "dbp", "map"] as const).filter((key) => seriesByVital.has(key));
  if (hemodynamicKeys.length > 0) {
    const pressurePresent = (["sbp", "dbp", "map"] as const).some((key) => seriesByVital.has(key));
    const hrPresent = seriesByVital.has("hr");
    const series = hemodynamicKeys
      .map((vital) => makeSeries(vital, vital === "hr" && pressurePresent ? "right" : "left", hemodynamicKeys.length))
      .filter((entry): entry is PanelSeries => entry !== undefined);
    panels.push({
      key: "hemodynamics",
      heading: "Hemodynamics",
      chartHeight: VITALS_TREND_LAYOUT.standardChartHeight,
      series,
      leftFamily: pressurePresent ? "pressure" : "hr",
      leftLabel: pressurePresent ? "Blood pressure (mmHg)" : "HR (bpm)",
      ...(pressurePresent && hrPresent ? { rightFamily: "hr" as const, rightLabel: "HR (bpm)" } : {}),
    });
  }

  const respiratoryKeys = (["rr", "spo2"] as const).filter((key) => seriesByVital.has(key));
  if (respiratoryKeys.length > 0) {
    const rrPresent = seriesByVital.has("rr");
    const spo2Present = seriesByVital.has("spo2");
    const series = respiratoryKeys
      .map((vital) => makeSeries(vital, vital === "spo2" && rrPresent ? "right" : "left", respiratoryKeys.length))
      .filter((entry): entry is PanelSeries => entry !== undefined);
    panels.push({
      key: "respiratory-oxygenation",
      heading: "Respiratory / oxygenation",
      chartHeight: VITALS_TREND_LAYOUT.standardChartHeight,
      series,
      leftFamily: rrPresent ? "rr" : "spo2",
      leftLabel: rrPresent ? "RR (/min)" : "SpO₂ (%)",
      ...(rrPresent && spo2Present ? { rightFamily: "spo2" as const, rightLabel: "SpO₂ (%)" } : {}),
    });
  }

  if (seriesByVital.has("temp")) {
    const series = makeSeries("temp", "left", 1);
    if (series) {
      panels.push({
        key: "temperature",
        heading: "Temperature",
        chartHeight: VITALS_TREND_LAYOUT.temperatureChartHeight,
        series: [series],
        leftFamily: "temp",
        leftLabel: `Temperature (${tempUnit === "F" ? "°F" : "°C"})`,
      });
    }
  }

  return panels;
};

const scaleForSeries = (series: PanelSeries[], family: ScaleFamily) => {
  const values = series.flatMap(({ chart }) => [
    ...chart.points.map((point) => point.y),
    ...(chart.referenceBand ? [chart.referenceBand.low, chart.referenceBand.high] : []),
  ]);
  const rawMin = values.length > 0 ? Math.min(...values) : 0;
  const rawMax = values.length > 0 ? Math.max(...values) : 100;
  const fineScale = family === "spo2" || family === "temp";
  const step = fineScale ? 1 : 10;
  const padding = Math.max(step, (rawMax - rawMin) * 0.1);
  let min = Math.floor((rawMin - padding) / step) * step;
  const max = Math.ceil((rawMax + padding) / step) * step;
  if (min < 0 && values.every((value) => value >= 0)) min = 0;
  return { min, max, ticks: [min, min + (max - min) / 2, max] };
};

const legendRowsForPanel = (panel: VitalsPanel): number => Math.ceil(panel.series.length / 2);

const measureVitalsPanel = (panel: VitalsPanel): number =>
  VITALS_TREND_LAYOUT.headingHeight +
  legendRowsForPanel(panel) * VITALS_TREND_LAYOUT.legendRowHeight +
  panel.chartHeight;

const renderPanelLegend = (panel: VitalsPanel): string => {
  const elements = panel.series.map(({ vital, chart }, index) => {
    const cellX = index % 2 === 0 ? 60 : 300;
    const row = Math.floor(index / 2);
    const markerY = VITALS_TREND_LAYOUT.headingHeight + row * VITALS_TREND_LAYOUT.legendRowHeight + 8;
    const color = colorForStyleRole(chart.styleRole);
    const strokeDash = vital === "dbp" ? ` stroke-dasharray="6 4"` : "";
    return [
      `<g class="vitals-legend-entry" data-vital="${vital}" data-axis="${chart.axis ?? "left"}" data-cell-x="${cellX}" data-cell-width="240">`,
      `<line x1="${cellX}" y1="${fmt(markerY)}" x2="${cellX + 16}" y2="${fmt(markerY)}" stroke="${color}" stroke-width="2"${strokeDash}/>`,
      `<circle cx="${cellX + 8}" cy="${fmt(markerY)}" r="3" fill="#ffffff" stroke="${color}" stroke-width="2"/>`,
      `<text x="${cellX + 22}" y="${fmt(markerY + 4)}" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="start">${escapeXml(chart.label)} (${escapeXml(chart.unit)})</text>`,
      `</g>`,
    ].join("\n");
  });
  return `<g class="vitals-panel-legend">\n${elements.join("\n")}\n</g>`;
};

const renderVitalsPanel = (
  panel: VitalsPanel,
  yOffset: number,
  times: number[],
  xMin: number,
  xMax: number,
  isLowestPanel: boolean,
  timeUnit: "hr" | "min",
): string => {
  const leftSeries = panel.series.filter(({ chart }) => chart.axis !== "right");
  const rightSeries = panel.series.filter(({ chart }) => chart.axis === "right");
  const leftScale = scaleForSeries(leftSeries, panel.leftFamily);
  const rightScale = panel.rightFamily ? scaleForSeries(rightSeries, panel.rightFamily) : undefined;
  const chartTop = VITALS_TREND_LAYOUT.headingHeight + legendRowsForPanel(panel) * VITALS_TREND_LAYOUT.legendRowHeight;
  const input: LineChartInput = {
    series: panel.series.map(({ chart }) => chart),
    xAxis: {
      label: isLowestPanel ? (timeUnit === "min" ? "Time (Minutes)" : "Time (Hours)") : "",
      min: xMin,
      max: xMax,
      ticks: times,
    },
    yAxisLeft: { label: panel.leftLabel, ...leftScale },
    width: rightScale ? VITALS_TREND_LAYOUT.width : VITALS_TREND_LAYOUT.singleAxisChartWidth,
    height: panel.chartHeight,
    showLegend: false,
    ...(rightScale && panel.rightLabel
      ? { yAxisRight: { label: panel.rightLabel, ...rightScale } }
      : {}),
  };
  return [
    `<g class="vitals-panel" data-vitals-panel="${panel.key}" transform="translate(0 ${fmt(yOffset)})">`,
    `<text x="60" y="19" font-family="sans-serif" font-size="15" font-weight="600" fill="#1e293b" text-anchor="start">${escapeXml(panel.heading)}</text>`,
    renderPanelLegend(panel),
    `<g class="vitals-panel-chart" transform="translate(0 ${fmt(chartTop)})">`,
    renderLineChart(input),
    `</g>`,
    `</g>`,
  ].join("\n");
};

export const buildVitalsTableModel = (spec: VitalsTrendSpec): VitalsTableModel => {
  const times = spec.time?.values ?? spec.timepointsHr ?? [];
  const timeUnit = spec.time?.unit ?? "hr";
  const seriesByVital = new Map(spec.series.map((series) => [series.vital, series] as const));
  const rows: VitalsTableModel["rows"] = [];
  const addRow = (key: string, label: string, values: string[]) => rows.push({ key, label, values });
  const addNumericRow = (vital: VitalKey, label: string) => {
    const source = seriesByVital.get(vital);
    if (source) addRow(vital, label, source.values.map(fmtNum));
  };

  addNumericRow("hr", "HR (bpm)");
  const sbp = seriesByVital.get("sbp");
  const dbp = seriesByVital.get("dbp");
  if (sbp && dbp) {
    addRow("bp", "BP (mmHg)", times.map((_, index) => `${fmtNum(sbp.values[index])}/${fmtNum(dbp.values[index])}`));
  } else if (sbp) {
    addRow("sbp", "SBP (mmHg)", sbp.values.map(fmtNum));
  } else if (dbp) {
    addRow("dbp", "DBP (mmHg)", dbp.values.map(fmtNum));
  }
  addNumericRow("map", "MAP (mmHg)");
  addNumericRow("rr", "RR (/min)");
  addNumericRow("spo2", "SpO₂ (%)");
  addNumericRow("temp", `Temperature (${spec.tempUnit === "F" ? "°F" : "°C"})`);

  return {
    columns: [
      { key: "vital", label: "Vital sign" },
      ...times.map((time, index) => ({
        key: `time-${index}`,
        label: `${fmtNum(time)} ${timeUnit === "hr" ? "h" : "min"}`,
      })),
    ],
    rows,
  };
};

const buildVitalsTable = (spec: VitalsTrendSpec): DocTableInput => {
  const model = buildVitalsTableModel(spec);
  const columns: DocTableInput["columns"] = model.columns.map((column, index) => ({
    ...column,
    ...(index === 0
      ? { widthFr: VITALS_TREND_LAYOUT.tableFirstColumnFr }
      : { align: "center" as const }),
  }));
  const rows: DocTableRow[] = model.rows.map((row) => {
    const cells: DocTableRow["cells"] = { vital: { text: row.label, emphasis: "bold" } };
    row.values.forEach((value, index) => {
      cells[`time-${index}`] = value;
    });
    return { cells };
  });
  return {
    columns,
    rows,
    width: VITALS_TREND_LAYOUT.width,
    rowHeight: VITALS_TREND_LAYOUT.tableRowHeight,
    headerHeight: VITALS_TREND_LAYOUT.tableHeaderHeight,
  };
};

const familyForVital = (vital: VitalKey): ScaleFamily => {
  if (vital === "hr") return "hr";
  if (vital === "rr") return "rr";
  if (vital === "spo2") return "spo2";
  if (vital === "temp") return "temp";
  return "pressure";
};

const fittedEpicScale = (
  vital: VitalKey,
  values: number[],
  referenceBand?: { low: number; high: number },
) => {
  const chart: ChartSeries = {
    label: LEGEND_LABELS[vital],
    unit: "",
    points: values.map((value, index) => ({ x: index, y: value })),
    referenceBand,
  };
  return scaleForSeries([{ vital, chart }], familyForVital(vital));
};

const adaptiveEpicCeiling = (values: number[]): number => {
  const maxValue = values.length > 0 ? Math.max(...values) : 0;
  const minCeiling = maxValue / 0.95;
  return [120, 140, 160, 180, 200, 250, 300].find((bucket) => bucket >= minCeiling) ?? 300;
};

export const buildEpicModel = (spec: VitalsTrendSpec): EpicVitalsModel => {
  const times = spec.time?.values ?? spec.timepointsHr ?? [];
  const timeUnit = spec.time?.unit ?? "hr";
  const seriesByVital = new Map(spec.series.map((series) => [series.vital, series] as const));
  const orderedSeries = VITAL_ORDER.flatMap((vital) => {
    const source = seriesByVital.get(vital);
    if (!source) return [];
    const def = VITAL_DEFS[vital];
    return [{
      vital,
      label: LEGEND_LABELS[vital],
      unit: unitForVital(vital, spec.tempUnit),
      colorRole: def.styleRole,
      dashed: vital === "dbp",
      points: source.values.map((value, timeIndex) => ({ timeIndex, value })),
    }];
  });

  const onlySeries = orderedSeries.length === 1 ? orderedSeries[0] : undefined;
  const onlySource = onlySeries ? seriesByVital.get(onlySeries.vital) : undefined;
  const population = spec.population === undefined ? "adult" : spec.population;
  const referenceBand =
    onlySeries && onlySource && population === "adult" && onlySource.showReferenceBand !== false
      ? VITAL_DEFS[onlySeries.vital].normal(spec.tempUnit)
      : undefined;
  const allValues = orderedSeries.flatMap((series) => series.points.map((point) => point.value));
  const yAxis = onlySeries
    ? fittedEpicScale(onlySeries.vital, allValues, referenceBand)
    : (() => {
      const max = adaptiveEpicCeiling(allValues);
      return { min: 0, max, ticks: [0, max / 2, max] };
    })();

  const legend: EpicVitalsLegendEntry[] = [];
  const addLegend = (
    key: EpicVitalsLegendEntry["key"],
    label: string,
    unit: string,
    vitals: VitalKey[],
    colorRole: string,
    dashed = false,
  ) => legend.push({ key, label, unit, vitals, colorRole, dashed });
  if (seriesByVital.has("hr")) addLegend("hr", "HR", "bpm", ["hr"], VITAL_DEFS.hr.styleRole);
  const hasSbp = seriesByVital.has("sbp");
  const hasDbp = seriesByVital.has("dbp");
  if (hasSbp && hasDbp) {
    addLegend("bp", "BP", "mmHg", ["sbp", "dbp"], VITAL_DEFS.sbp.styleRole, true);
  } else if (hasSbp) {
    addLegend("bp", "SBP", "mmHg", ["sbp"], VITAL_DEFS.sbp.styleRole);
  } else if (hasDbp) {
    addLegend("bp", "DBP", "mmHg", ["dbp"], VITAL_DEFS.dbp.styleRole, true);
  }
  if (seriesByVital.has("map")) addLegend("map", "MAP", "mmHg", ["map"], VITAL_DEFS.map.styleRole);
  if (seriesByVital.has("rr")) addLegend("rr", "RR", "/min", ["rr"], VITAL_DEFS.rr.styleRole);
  if (seriesByVital.has("spo2")) addLegend("spo2", "SpO₂", "%", ["spo2"], VITAL_DEFS.spo2.styleRole);
  if (seriesByVital.has("temp")) {
    addLegend("temp", "Temperature", spec.tempUnit === "F" ? "°F" : "°C", ["temp"], VITAL_DEFS.temp.styleRole);
  }

  const tableModel = buildVitalsTableModel(spec);
  return {
    timeUnit,
    timepoints: times.map((value, index) => ({
      index,
      value,
      label: `${fmtNum(value)} ${timeUnit === "hr" ? "h" : "min"}`,
    })),
    yAxis,
    ...(referenceBand ? { referenceBand } : {}),
    series: orderedSeries,
    legend,
    readoutByTimepoint: times.map((_, index) => ({
      timeLabel: `${fmtNum(times[index])} ${timeUnit === "hr" ? "h" : "min"}`,
      rows: tableModel.rows.map((row) => ({
        key: row.key,
        label: row.label,
        valueText: row.values[index],
      })),
    })),
    tableModel,
  };
};

const renderEpicVitalsSvg = (spec: VitalsTrendSpec): string => {
  const model = buildEpicModel(spec);
  const layout = EPIC_VITALS_LAYOUT;
  const plotWidth = layout.plotRight - layout.plotLeft;
  const plotHeight = layout.plotBottom - layout.plotTop;
  const xMin = model.timepoints.length > 0 ? Math.min(...model.timepoints.map((point) => point.value)) : 0;
  const xMax = model.timepoints.length > 0 ? Math.max(...model.timepoints.map((point) => point.value)) : 1;
  const mapX = (value: number) => xMax <= xMin
    ? layout.plotLeft + plotWidth / 2
    : layout.plotLeft + ((value - xMin) / (xMax - xMin)) * plotWidth;
  const mapY = (value: number) => model.yAxis.max <= model.yAxis.min
    ? layout.plotTop + plotHeight / 2
    : layout.plotBottom - ((value - model.yAxis.min) / (model.yAxis.max - model.yAxis.min)) * plotHeight;
  const elements: string[] = [];

  if (model.referenceBand) {
    const y1 = mapY(model.referenceBand.high);
    const y2 = mapY(model.referenceBand.low);
    elements.push(`<rect x="${fmt(layout.plotLeft)}" y="${fmt(y1)}" width="${fmt(plotWidth)}" height="${fmt(Math.max(0, y2 - y1))}" fill="#f1f5f9" opacity="0.6" data-reference-band="true"/>`);
  }

  model.yAxis.ticks.forEach((tick) => {
    const y = mapY(tick);
    elements.push(`<line x1="${fmt(layout.plotLeft)}" y1="${fmt(y)}" x2="${fmt(layout.plotRight)}" y2="${fmt(y)}" stroke="#e2e8f0" stroke-width="1"/>`);
    elements.push(`<text x="${fmt(layout.plotLeft - 8)}" y="${fmt(y + 4)}" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="end">${escapeXml(fmtNum(tick))}</text>`);
  });

  const pointXs = model.timepoints.map((timepoint) => mapX(timepoint.value));
  model.timepoints.forEach((timepoint, index) => {
    const x = pointXs[index];
    elements.push(`<line x1="${fmt(x)}" y1="${fmt(layout.plotTop)}" x2="${fmt(x)}" y2="${fmt(layout.plotBottom)}" stroke="#e2e8f0" stroke-width="1"/>`);
    elements.push(`<text x="${fmt(x)}" y="${fmt(layout.plotBottom + 18)}" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle">${escapeXml(fmtNum(timepoint.value))}</text>`);
  });
  elements.push(`<line x1="${fmt(layout.plotLeft)}" y1="${fmt(layout.plotTop)}" x2="${fmt(layout.plotLeft)}" y2="${fmt(layout.plotBottom)}" stroke="#94a3b8" stroke-width="2"/>`);
  elements.push(`<line x1="${fmt(layout.plotLeft)}" y1="${fmt(layout.plotBottom)}" x2="${fmt(layout.plotRight)}" y2="${fmt(layout.plotBottom)}" stroke="#94a3b8" stroke-width="2"/>`);
  elements.push(`<text x="${fmt(layout.plotLeft + plotWidth / 2)}" y="${fmt(layout.height - 14)}" font-family="sans-serif" font-size="14" font-weight="500" fill="#334155" text-anchor="middle">${model.timeUnit === "min" ? "Time (Minutes)" : "Time (Hours)"}</text>`);

  model.series.forEach((series) => {
    const color = colorForStyleRole(series.colorRole);
    const points = series.points.map((point) => `${fmt(pointXs[point.timeIndex])},${fmt(mapY(point.value))}`).join(" ");
    const dash = series.dashed ? ` stroke-dasharray="6 4"` : "";
    const marks = series.points.map((point) =>
      `<circle cx="${fmt(pointXs[point.timeIndex])}" cy="${fmt(mapY(point.value))}" r="4" fill="#ffffff" stroke="${color}" stroke-width="2"/>`
    ).join("\n");
    elements.push(`<g class="vitals-epic-series" data-vital="${series.vital}">\n<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.5"${dash} stroke-linecap="round" stroke-linejoin="round"/>\n${marks}\n</g>`);
  });

  model.legend.forEach((entry, index) => {
    const column = index % layout.legendColumns;
    const row = Math.floor(index / layout.legendColumns);
    const x = layout.legendLeft + column * layout.legendCellWidth;
    const y = layout.legendTop + row * layout.legendCellHeight + 10;
    const color = colorForStyleRole(entry.colorRole);
    const dash = entry.dashed ? ` stroke-dasharray="6 4"` : "";
    const marker = entry.key === "bp" && entry.vitals.length === 2
      ? [
        `<line x1="${fmt(x)}" y1="${fmt(y - 3)}" x2="${fmt(x + 18)}" y2="${fmt(y - 3)}" stroke="${color}" stroke-width="2"/>`,
        `<line x1="${fmt(x)}" y1="${fmt(y + 3)}" x2="${fmt(x + 18)}" y2="${fmt(y + 3)}" stroke="${color}" stroke-width="2" stroke-dasharray="6 4"/>`,
      ].join("\n")
      : `<line x1="${fmt(x)}" y1="${fmt(y)}" x2="${fmt(x + 18)}" y2="${fmt(y)}" stroke="${color}" stroke-width="2.5"${dash}/>`;
    elements.push([
      `<g class="vitals-epic-legend-entry" data-legend="${entry.key}" data-legend-x="${fmt(x)}" data-legend-y="${fmt(y - 10)}" data-legend-width="${fmt(layout.legendCellWidth)}" data-legend-height="${fmt(layout.legendCellHeight)}">`,
      marker,
      `<circle cx="${fmt(x + 9)}" cy="${fmt(y)}" r="3" fill="#ffffff" stroke="${color}" stroke-width="2"/>`,
      `<text x="${fmt(x + 25)}" y="${fmt(y + 4)}" font-family="sans-serif" font-size="12" fill="#334155" text-anchor="start">${escapeXml(entry.label)} (${escapeXml(entry.unit)})</text>`,
      `</g>`,
    ].join("\n"));
  });

  model.timepoints.forEach((timepoint, index) => {
    const x = pointXs[index];
    const left = index === 0 ? layout.plotLeft : (pointXs[index - 1] + x) / 2;
    const right = index === model.timepoints.length - 1 ? layout.plotRight : (x + pointXs[index + 1]) / 2;
    elements.push(`<rect x="${fmt(left)}" y="${fmt(layout.plotTop)}" width="${fmt(Math.max(0, right - left))}" height="${fmt(plotHeight)}" fill="transparent" data-timepoint-index="${timepoint.index}" data-timepoint-x="${fmt(x)}"/>`);
  });
  elements.push(`<line class="vitals-epic-guide" data-guide-line="true" x1="${fmt(layout.plotLeft)}" y1="${fmt(layout.plotTop)}" x2="${fmt(layout.plotLeft)}" y2="${fmt(layout.plotBottom)}" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="3 3" opacity="0"/>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${layout.width} ${layout.height}" role="img" aria-label="Vitals Trend" data-kind="vitals_trend" data-variant="epic">\n${elements.join("\n")}\n</svg>`;
};

export const renderVitalsTrendSvg = (spec: VitalsTrendSpec, options?: RenderOptions): string => {
  if (options?.variant === "epic") return renderEpicVitalsSvg(spec);
  const times = spec.time?.values ?? spec.timepointsHr ?? [];
  const timeUnit = spec.time?.unit ?? "hr";
  const population = spec.population === undefined ? "adult" : spec.population;

  const seriesByVital = new Map(spec.series.map((series) => [series.vital, series] as const));
  const xMin = times.length > 0 ? Math.min(...times) : 0;
  const xMax = times.length > 0 ? Math.max(...times) : 1;

  const panels = buildVitalsPanels(seriesByVital, times, spec.tempUnit, population);
  const table = buildVitalsTable(spec);
  const tableHeight = measureDocTable(table);
  const panelsHeight = panels.reduce(
    (height, panel, index) => height + measureVitalsPanel(panel) + (index > 0 ? VITALS_TREND_LAYOUT.panelGap : 0),
    0,
  );
  const totalHeight = panelsHeight + VITALS_TREND_LAYOUT.chartTableGap + tableHeight;

  const elements: string[] = [];
  let yOffset = 0;
  panels.forEach((panel, index) => {
    if (index > 0) yOffset += VITALS_TREND_LAYOUT.panelGap;
    elements.push(renderVitalsPanel(panel, yOffset, times, xMin, xMax, index === panels.length - 1, timeUnit));
    yOffset += measureVitalsPanel(panel);
  });
  yOffset += VITALS_TREND_LAYOUT.chartTableGap;
  elements.push(`<g class="vitals-flowsheet" data-vitals-table="true" transform="translate(0 ${fmt(yOffset)})">\n${renderDocTable(table)}\n</g>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VITALS_TREND_LAYOUT.width} ${fmt(totalHeight)}" role="img" aria-label="Vitals Trend" data-kind="vitals_trend">\n${elements.join("\n")}\n</svg>`;
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
    },
    {
      kind: "vitals_trend",
      timepointsHr: [0, 1],
      series: [{ vital: "temp", values: [108, 109] }],
      tempUnit: "F",
    },
    {
      kind: "vitals_trend",
      population: "peds_child",
      timepointsHr: [0, 1],
      series: [{ vital: "hr", values: [110, 105] }],
    },
    {
      kind: "vitals_trend",
      population: "peds_infant",
      timepointsHr: [0, 1],
      series: [{ vital: "hr", values: [140, 135], showReferenceBand: false }],
    },
  ],
  invalid: [
    { spec: { kind: "vitals_trend", population: null, timepointsHr: [0, 1], series: [{ vital: "hr", values: [80, 85] }] }, expectCode: "invalid_population" },
    { spec: { kind: "vitals_trend", timepointsHr: [0, 1], series: [] }, expectCode: "series_empty" },
    { spec: { kind: "vitals_trend", timepointsHr: [1, 0], series: [{ vital: "hr", values: [80, 90] }] }, expectCode: "timepoints_not_increasing" },
    { spec: { kind: "vitals_trend", timepointsHr: [0, 1], series: [{ vital: "hr", values: [80] }] }, expectCode: "values_length_mismatch" },
    { spec: { kind: "vitals_trend", timepointsHr: [0, 1], series: [{ vital: "hr", values: [80, 90] }, { vital: "hr", values: [85, 95] }] }, expectCode: "duplicate_vital" },
    { spec: { kind: "vitals_trend", timepointsHr: [0, 1], series: [{ vital: "hr", values: [999, 90] }] }, expectCode: "value_out_of_range" },
    { spec: { kind: "vitals_trend", timepointsHr: [0], tempUnit: "C", series: [{ vital: "temp", values: [43.1] }] }, expectCode: "value_out_of_range" },
    { spec: { kind: "vitals_trend", timepointsHr: [0, 1], series: [{ vital: "sbp", values: [100, 100] }, { vital: "dbp", values: [60, 60] }, { vital: "map", values: [200, 200] }] }, expectCode: "map_bounds_violation" },
    { spec: { kind: "vitals_trend", population: "peds_child", timepointsHr: [0, 1], series: [{ vital: "hr", values: [110, 105], showReferenceBand: true }] }, expectCode: "reference_band_population_unsupported" },
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
