import type {
  LanguageMode,
  StructuredMeasurementPanel,
  StructuredMeasurements,
  StructuredMeasurementValue,
  TextPair,
} from "./types";
import { MEASUREMENT_ALLOWLIST } from "./measurementAllowlist";
import {
  displayPolicyFor,
  isIdentityScale,
  normalizeUnit,
  parseMeasurementValue,
  toCanonicalMeasurementValue,
  toMeasurementDisplayValue,
} from "./measurementUnitPolicy";
import { renderDocTable, type DocTableColumn, type DocTableRow } from "./visuals/primitives/table";

type Locale = "en" | "zh";

const PANEL_TITLES: Record<StructuredMeasurementPanel["kind"], TextPair> = {
  labs: { en: "Laboratory results", zh: "实验室结果" },
  vitals: { en: "Vital signs", zh: "生命体征" },
};

const POST_INTERVENTION_LABEL: TextPair = {
  en: "post-intervention",
  zh: "干预后",
};

const MEASUREMENT_HEADER: TextPair = {
  en: "Measurement",
  zh: "测量项目",
};

const textFor = (pair: TextPair | undefined, locale: Locale): string => pair?.[locale] ?? "";

const labelForMode = (pair: TextPair | undefined, languageMode: LanguageMode): string => {
  if (!pair) return "";
  return languageMode === "always" && pair.zh ? `${pair.en} / ${pair.zh}` : pair.en;
};

const trimNumber = (value: number): string => {
  if (!Number.isFinite(value)) return "";
  if (Math.abs(value) >= 100) return Number(value.toFixed(Number.isInteger(value) ? 0 : 1)).toString();
  if (Math.abs(value) >= 10) return Number(value.toFixed(1)).toString();
  if (Math.abs(value) >= 1) return Number(value.toFixed(2)).toString();
  return Number(value.toPrecision(2)).toString();
};

const displayUnitText = (unit: string): string =>
  normalizeUnit(unit) === "(unitless)" || normalizeUnit(unit) === "(ratio)" ? "" : unit;

const formatRawMeasurement = (value: string, unit: string): string =>
  displayUnitText(unit) ? `${value} ${displayUnitText(unit)}` : value;

export const formatStructuredMeasurementValue = (
  key: string,
  entry: StructuredMeasurementValue,
  locale: Locale = "en",
): string => {
  const def = MEASUREMENT_ALLOWLIST[key];
  if (!def) return formatRawMeasurement(entry.value, entry.unit);

  const policy = displayPolicyFor(key);
  const inputIsPrimary = normalizeUnit(entry.unit) === normalizeUnit(policy.primaryUnit);
  const primaryValue = inputIsPrimary
    ? parseMeasurementValue(entry.value)
    : toMeasurementDisplayValue(key, entry.value, entry.unit, policy.primaryUnit);
  const primaryUnit = displayUnitText(policy.primaryUnit);
  const primaryDisplayValue = inputIsPrimary ? entry.value.replace(/,/g, "").trim() : (primaryValue === null ? "" : trimNumber(primaryValue));
  const primaryText = primaryValue === null
    ? formatRawMeasurement(entry.value, entry.unit)
    : formatRawMeasurement(primaryDisplayValue, primaryUnit);

  const secondaryValue = policy.secondaryUnit
    ? toMeasurementDisplayValue(key, entry.value, entry.unit, policy.secondaryUnit)
    : null;
  const duplicateScaleDisplay = policy.secondaryUnit
    ? isIdentityScale(key, policy.primaryUnit, policy.secondaryUnit)
    : false;
  const secondaryText = policy.secondaryUnit && secondaryValue !== null && !duplicateScaleDisplay && entry.bound === undefined
    ? ` (${formatRawMeasurement(trimNumber(secondaryValue), policy.secondaryUnit)})`
    : "";

  const converted = toCanonicalMeasurementValue(key, entry.value, entry.unit);
  const base = converted === null ? formatRawMeasurement(entry.value, entry.unit) : `${primaryText}${secondaryText}`;
  const bound = entry.bound === ">" || entry.bound === "<" ? entry.bound : "";
  const context = entry.context === "post_intervention" ? ` [${POST_INTERVENTION_LABEL[locale]}]` : "";
  return `${bound}${base}${context}`;
};

export const serializeStructuredMeasurements = (
  measurements: StructuredMeasurements | undefined,
): TextPair | undefined => {
  if (!measurements?.panels.length) return undefined;
  const renderLocale = (locale: Locale) => measurements.panels.flatMap((panel) => {
    const panelTitle = PANEL_TITLES[panel.kind][locale];
    const columnById = new Map(panel.columns.map((column) => [column.id, column]));
    const lines = panel.rows.flatMap((row) => row.values.map((entry) => {
      const columnLabel = textFor(columnById.get(entry.columnId)?.label, locale);
      const prefix = columnLabel ? `${textFor(row.label, locale)} (${columnLabel})` : textFor(row.label, locale);
      return `${prefix}: ${formatStructuredMeasurementValue(row.key, entry, locale)}`;
    }));
    return [`${panelTitle}:`, ...lines];
  }).join("\n");

  return {
    en: renderLocale("en"),
    zh: renderLocale("zh"),
  };
};

const tableHeight = (rowCount: number, hasTitle: boolean): number =>
  (hasTitle ? 32 : 0) + 32 + rowCount * 28;

const approximateTextWidth = (text: string, fontSize: number): number =>
  Array.from(text).reduce((width, character) => {
    if (/\s/u.test(character)) return width + fontSize * 0.34;
    if (/\p{Script=Han}/u.test(character)) return width + fontSize;
    if (/[MW@#%&]/u.test(character)) return width + fontSize * 0.82;
    if (/[ilI1.,:;|'`]/u.test(character)) return width + fontSize * 0.32;
    return width + fontSize * 0.58;
  }, 0);

export const isCompactStructuredMeasurements = (
  measurements: StructuredMeasurements | undefined,
): boolean => {
  if (measurements?.panels.length !== 1) return false;
  const [panel] = measurements.panels;
  return panel.rows.length === 1 && panel.columns.length === 1;
};

const compactPanelWidth = (
  panel: StructuredMeasurementPanel,
  languageMode: LanguageMode,
): number => {
  const title = labelForMode(PANEL_TITLES[panel.kind], languageMode);
  const measurementHeader = labelForMode(MEASUREMENT_HEADER, languageMode);
  const columnHeader = labelForMode(panel.columns[0]?.label, languageMode) || panel.columns[0]?.id || "";
  const row = panel.rows[0];
  const measurement = labelForMode(row?.label, languageMode);
  const value = row?.values[0]
    ? formatStructuredMeasurementValue(row.key, row.values[0], "en")
    : "";
  const horizontalPadding = 16;
  const measurementCellWidth = Math.max(
    approximateTextWidth(measurementHeader, 11),
    approximateTextWidth(measurement, 12),
  ) + horizontalPadding;
  const valueCellWidth = Math.max(
    approximateTextWidth(columnHeader, 11),
    approximateTextWidth(value, 12),
  ) + horizontalPadding;
  const titleWidth = approximateTextWidth(title, 13) + horizontalPadding * 2;

  // The shared table primitive allocates 1.35fr to the measurement column and
  // 1fr to the value column. Size the compact canvas so neither column clips.
  const totalFr = 2.35;
  const contentWidth = Math.max(
    titleWidth,
    measurementCellWidth * totalFr / 1.35,
    valueCellWidth * totalFr,
  );
  return Math.max(320, Math.ceil(contentWidth / 4) * 4);
};

const panelToTable = (
  panel: StructuredMeasurementPanel,
  languageMode: LanguageMode,
  width: number,
): { svg: string; width: number; height: number } => {
  const title = labelForMode(PANEL_TITLES[panel.kind], languageMode);
  const columns: DocTableColumn[] = [
    { key: "measurement", label: labelForMode(MEASUREMENT_HEADER, languageMode), widthFr: 1.35 },
    ...panel.columns.map((column) => ({
      key: column.id,
      label: labelForMode(column.label, languageMode) || column.id,
      align: "center" as const,
    })),
  ];
  const rows: DocTableRow[] = panel.rows.map((row) => {
    const cells: DocTableRow["cells"] = {
      measurement: { text: labelForMode(row.label, languageMode), emphasis: "bold" },
    };
    row.values.forEach((entry) => {
      cells[entry.columnId] = {
        text: formatStructuredMeasurementValue(row.key, entry, "en"),
        emphasis: entry.context === "post_intervention" ? "bold" : "normal",
      };
    });
    return { cells };
  });
  return {
    svg: renderDocTable({ title, columns, rows, width }),
    width,
    height: tableHeight(rows.length, true),
  };
};

export const renderStructuredMeasurementsSvg = (
  measurements: StructuredMeasurements,
  languageMode: LanguageMode,
): string => {
  const gap = 12;
  const compact = isCompactStructuredMeasurements(measurements);
  const tables = measurements.panels.map((panel) => panelToTable(
    panel,
    languageMode,
    compact ? compactPanelWidth(panel, languageMode) : 600,
  ));
  const width = compact
    ? Math.max(...tables.map((table) => table.width))
    : Math.max(...tables.map((table) => table.width), 600);
  const height = tables.reduce((sum, table) => sum + table.height, 0) + Math.max(0, tables.length - 1) * gap;
  let y = 0;
  const body = tables.map((table) => {
    const translated = `<g transform="translate(0 ${y})">${table.svg}</g>`;
    y += table.height + gap;
    return translated;
  }).join("\n");
  const intrinsicSize = compact ? ` width="${width}" height="${height}"` : "";
  return `<svg viewBox="0 0 ${width} ${height}"${intrinsicSize} role="img" aria-label="structured clinical measurements" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
};
