import { fmt } from "../../primitives/graphPaper";
import { escapeXml } from "../../primitives/escapeXml";
import { renderDocTable, type DocTableRow } from "../../primitives/table";
import { type VisualError, type VisualKindModule, registerVisual } from "../../registry";
import type { IoEntry, IoRecordSpec } from "./types";

const MAX_ENTRY_ML = 10_000;
const KEYED_TOTALS = ["intake_total_ml", "output_total_ml", "net_balance_ml"] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isValidVolume = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && Number.isInteger(value) && value > 0;

const validateEntries = (entries: unknown[], path: "intake" | "output"): VisualError[] => {
  const errors: VisualError[] = [];

  entries.forEach((entry, index) => {
    if (!isRecord(entry)) {
      errors.push({
        path: `${path}[${index}].label`,
        code: "entry_label_missing",
        message: "must be a non-empty string",
      });
      errors.push({
        path: `${path}[${index}].volumeMl`,
        code: "invalid_volume",
        message: "must be a finite positive integer",
      });
      return;
    }

    if (!nonEmptyString(entry.label)) {
      errors.push({
        path: `${path}[${index}].label`,
        code: "entry_label_missing",
        message: "must be a non-empty string",
      });
    }

    if (!isValidVolume(entry.volumeMl)) {
      errors.push({
        path: `${path}[${index}].volumeMl`,
        code: "invalid_volume",
        message: "must be a finite positive integer",
      });
    } else if (entry.volumeMl > MAX_ENTRY_ML) {
      errors.push({
        path: `${path}[${index}].volumeMl`,
        code: "volume_out_of_range",
        message: `must be no greater than ${MAX_ENTRY_ML} mL`,
      });
    }
  });

  return errors;
};

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

export const validateIoRecord = (spec: IoRecordSpec): VisualError[] => {
  const errors: VisualError[] = [];
  const value = spec as unknown as Record<string, unknown>;

  if (value.kind !== "io_record") {
    return [{ path: "kind", code: "invalid_kind", message: "must be 'io_record'" }];
  }

  const intakeValid = Array.isArray(value.intake);
  const outputValid = Array.isArray(value.output);

  if (!intakeValid) {
    errors.push({ path: "intake", code: "intake_invalid", message: "must be an array" });
  }
  if (!outputValid) {
    errors.push({ path: "output", code: "output_invalid", message: "must be an array" });
  }

  const intake = intakeValid ? value.intake as unknown[] : [];
  const output = outputValid ? value.output as unknown[] : [];
  if (intakeValid && outputValid && intake.length + output.length === 0) {
    errors.push({ path: "", code: "no_entries", message: "must contain at least one intake or output entry" });
  }

  errors.push(...validateEntries(intake, "intake"));
  errors.push(...validateEntries(output, "output"));

  if (value.periodLabel !== undefined) {
    errors.push(...validateTextPair(value.periodLabel, "periodLabel"));
  }
  if (value.caption !== undefined) {
    errors.push(...validateTextPair(value.caption, "caption"));
  }

  return errors;
};

const structuralEntries = (value: unknown): Array<Record<string, unknown>> | null => {
  if (!Array.isArray(value)) return null;
  const entries: Array<Record<string, unknown>> = [];
  for (const entry of value) {
    if (!isRecord(entry)) return null;
    entries.push(entry);
  }
  return entries;
};

export const selfCheckIoRecord = (spec: IoRecordSpec, question: unknown): VisualError[] => {
  const value = spec as unknown as Record<string, unknown>;
  const intake = structuralEntries(value.intake);
  const output = structuralEntries(value.output);

  // The conformance harness intentionally calls selfCheck with malformed input.
  if (value.kind !== "io_record" || intake === null || output === null) return [];

  const errors: VisualError[] = [];
  const meta = isRecord(question) && isRecord(question.meta) ? question.meta : null;

  if (meta !== null && !nonEmptyString(meta.visual_justification)) {
    errors.push({
      path: "meta.visual_justification",
      code: "self_check_missing_justification",
      message: "must be present and non-empty",
    });
  }

  const keyed = meta !== null && isRecord(meta.derived_values_keyed)
    ? meta.derived_values_keyed
    : null;
  const presentKeys = keyed === null
    ? []
    : KEYED_TOTALS.filter((key) => Object.prototype.hasOwnProperty.call(keyed, key));

  if (meta !== null && presentKeys.length === 0) {
    errors.push({
      path: "meta.derived_values_keyed",
      code: "self_check_no_keyed_values",
      message: "must declare at least one computed intake, output, or net value",
    });
  }

  const allEntries = [...intake, ...output];
  allEntries.forEach((entry, index) => {
    if (!isValidVolume(entry.volumeMl)) {
      errors.push({
        path: `entries[${index}].volumeMl`,
        code: "self_check_invalid_volume",
        message: "must be a finite positive integer",
      });
    }
  });
  if (errors.some((error) => error.code === "self_check_invalid_volume")) return errors;

  const intakeTotal = intake.reduce((sum, entry) => sum + (entry.volumeMl as number), 0);
  const outputTotal = output.reduce((sum, entry) => sum + (entry.volumeMl as number), 0);
  const computed: Record<(typeof KEYED_TOTALS)[number], number> = {
    intake_total_ml: intakeTotal,
    output_total_ml: outputTotal,
    net_balance_ml: intakeTotal - outputTotal,
  };

  for (const key of presentKeys) {
    if (keyed?.[key] !== computed[key]) {
      errors.push({
        path: `meta.derived_values_keyed.${key}`,
        code: "self_check_total_mismatch",
        message: `declared ${String(keyed?.[key])} does not match computed ${computed[key]}`,
      });
    }
  }

  return errors;
};

const sumVolumes = (entries: IoEntry[]): number =>
  entries.reduce((sum, entry) => sum + entry.volumeMl, 0);

const signed = (value: number): string =>
  value >= 0 ? `+${fmt(value)}` : `−${fmt(Math.abs(value))}`;

export const renderIoRecordSvg = (spec: IoRecordSpec): string => {
  const intake = Array.isArray(spec.intake) ? spec.intake : [];
  const output = Array.isArray(spec.output) ? spec.output : [];
  const intakeTotal = sumVolumes(intake);
  const outputTotal = sumVolumes(output);
  const netBalance = intakeTotal - outputTotal;

  const rows: DocTableRow[] = [
    { rowHeader: true, cells: { item: "Intake" } },
    ...intake.map((entry) => ({ cells: { item: entry.label, vol: fmt(entry.volumeMl) } })),
    {
      cells: {
        item: { text: "Intake total", emphasis: "bold" },
        vol: { text: fmt(intakeTotal), emphasis: "bold" },
      },
    },
    { rowHeader: true, cells: { item: "Output" } },
    ...output.map((entry) => ({ cells: { item: entry.label, vol: fmt(entry.volumeMl) } })),
    {
      cells: {
        item: { text: "Output total", emphasis: "bold" },
        vol: { text: fmt(outputTotal), emphasis: "bold" },
      },
    },
    {
      cells: {
        item: { text: "Net balance", emphasis: "bold" },
        vol: { text: signed(netBalance), emphasis: "bold" },
      },
    },
  ];

  const rowHeight = 24;
  const headerHeight = 28;
  const titleHeight = 32;
  const totalHeight = titleHeight + headerHeight + rows.length * rowHeight;
  const title = spec.periodLabel?.en ?? "Intake & Output Record";
  const table = renderDocTable({
    title,
    columns: [
      { key: "item", label: "", widthFr: 3, align: "left" },
      { key: "vol", label: "Volume (mL)", widthFr: 1.4, align: "right" },
    ],
    rows,
    width: 420,
    rowHeight,
    headerHeight,
  });
  const ariaLabel = escapeXml(
    spec.caption?.en ?? spec.periodLabel?.en ?? "Intake and Output Record",
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 ${fmt(totalHeight)}" role="img" aria-label="${ariaLabel}" data-kind="io_record">\n${table}\n</svg>`;
};

const fixtures: VisualKindModule<IoRecordSpec>["fixtures"] = {
  valid: [
    {
      kind: "io_record",
      periodLabel: { en: "0700–1500 shift", zh: "0700–1500 班次" },
      intake: [
        { label: "PO water", volumeMl: 480 },
        { label: "0.9% NaCl IV", volumeMl: 1000 },
        { label: "IV piggyback antibiotic", volumeMl: 100 },
      ],
      output: [
        { label: "Foley urine", volumeMl: 600 },
        { label: "Emesis", volumeMl: 150 },
      ],
      caption: { en: "Intake and output flowsheet", zh: "出入量记录单" },
    },
    {
      kind: "io_record",
      intake: [
        { label: "PO fluids", volumeMl: 240 },
        { label: "0.9% NaCl IV", volumeMl: 500 },
      ],
      output: [
        { label: "Urine", volumeMl: 1400 },
        { label: "NG drainage", volumeMl: 300 },
      ],
    },
  ],
  invalid: [
    { spec: { kind: "io_record", intake: [], output: [] }, expectCode: "no_entries" },
    {
      spec: { kind: "io_record", intake: [{ label: "PO", volumeMl: -1 }], output: [] },
      expectCode: "invalid_volume",
    },
    {
      spec: { kind: "io_record", intake: [{ label: "IV", volumeMl: 50_000 }], output: [] },
      expectCode: "volume_out_of_range",
    },
    {
      spec: { kind: "io_record", intake: [{ label: "", volumeMl: 100 }], output: [] },
      expectCode: "entry_label_missing",
    },
    { spec: { kind: "mar", intake: [], output: [] }, expectCode: "invalid_kind" },
    { spec: { kind: "io_record", intake: null, output: [] }, expectCode: "intake_invalid" },
    {
      spec: { kind: "io_record", intake: [{ label: "PO", volumeMl: 100 }], output: [], caption: { en: "" } },
      expectCode: "caption_en_required",
    },
    {
      spec: { kind: "io_record", intake: [{ label: "PO", volumeMl: 100 }], output: [], caption: { en: "x", zh: "" } },
      expectCode: "caption_zh_empty",
    },
    {
      spec: { kind: "io_record", intake: [{ label: "PO", volumeMl: 100 }], output: [], periodLabel: { en: "" } },
      expectCode: "period_label_en_required",
    },
    {
      spec: { kind: "io_record", intake: [{ label: "PO", volumeMl: 100 }], output: [], periodLabel: { en: "x", zh: "" } },
      expectCode: "period_label_zh_empty",
    },
  ],
};

export const ioRecordModule: VisualKindModule<IoRecordSpec> = {
  kind: "io_record",
  allowedItemTypes: ["multiple_choice", "select_all", "matrix", "fill_in_blank"],
  validate: validateIoRecord,
  selfCheck: selfCheckIoRecord,
  renderSvg: renderIoRecordSvg,
  fixtures,
};

registerVisual(ioRecordModule as VisualKindModule);
